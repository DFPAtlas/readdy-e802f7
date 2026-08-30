import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_DOMAIN = Deno.env.get("RESEND_FROM_DOMAIN") || "digital-footprint.uk";
const SITE_URL = Deno.env.get("SITE_URL") || "https://digital-footprint.uk";

const ACCESS_ROLES = new Set(["owner", "admin", "billing", "project_member", "viewer"]);
const ADMIN_ROLES = new Set(["owner", "super_admin", "admin"]);
const RESEND_MIN_INTERVAL_MS = 60_000;

const ALLOWED_ORIGINS = new Set([
  "https://digital-footprint.uk",
  "https://www.digital-footprint.uk",
]);

const RATE_MAX = 30;
const RATE_WINDOW_MS = 60_000;
const rateStore = new Map<string, { count: number; resetAt: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateStore) if (now > v.resetAt) rateStore.delete(k);
}, 60_000);

function cors(req: Request): HeadersInit {
  const origin = req.headers.get("origin") ?? "";
  let allowedOrigin = SITE_URL;
  try {
    const u = new URL(origin);
    if (ALLOWED_ORIGINS.has(u.origin) || u.hostname.endsWith(".readdy.ai")) {
      allowedOrigin = u.origin;
    }
  } catch {
    // ignore
  }
  return {
    "content-type": "application/json",
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "Origin",
  };
}

function err(code: string, status = 200): Response {
  return Response.json({ code }, { status, headers: { "content-type": "application/json" } });
}

function isUuid(s: unknown): boolean {
  return typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitiseRedirect(raw: unknown): string {
  const fallback = `${SITE_URL}/portal/dashboard`;
  if (!raw || typeof raw !== "string") return fallback;
  const s = raw.trim();
  if (!s) return fallback;
  try {
    const u = new URL(s, SITE_URL);
    const site = new URL(SITE_URL);
    if (u.origin !== site.origin) return fallback;
    return u.toString();
  } catch {
    return fallback;
  }
}

function parseExpiry(raw: unknown): string | null {
  if (!raw || typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function parseMessage(raw: unknown): string | null {
  if (!raw || typeof raw !== "string") return null;
  const s = raw.trim().slice(0, 500);
  return s || null;
}

async function findUserByEmail(supabaseAdmin: any, email: string): Promise<any | null> {
  const lc = email.toLowerCase();
  let page = 1;
  while (page <= 10) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return null;
    const users = data?.users ?? [];
    const found = users.find((u: any) => (u.email || "").toLowerCase() === lc);
    if (found) return found;
    if (users.length < 1000) return null;
    page++;
  }
  return null;
}

async function audit(supabaseAdmin: any, event: {
  eventType: string;
  entityType: string;
  entityId: string | null;
  actorId: string;
  metadata: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabaseAdmin.from("operational_audit_events").insert({
      event_type: event.eventType,
      entity_type: event.entityType,
      entity_id: event.entityId,
      actor_user_id: event.actorId,
      safe_metadata: event.metadata,
      correlation_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
  } catch {
    // audit is best-effort; never fail the request over it
  }
}

function buildInviteHtml(email: string, actionLink: string, personalMessage: string | null): string {
  const messageBlock = personalMessage
    ? `<div style="margin:0 0 20px;padding:14px 16px;background:#f0f9ff;border-left:3px solid #06b6d4;color:#0f172a;font-size:14px;line-height:1.6;border-radius:0 8px 8px 0;">${esc(personalMessage)}</div>`
    : "";
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#0f172a;padding:24px 28px;">
      <h2 style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">Digital Footprint</h2>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Client Portal invitation</p>
    </div>
    <div style="padding:28px;">
      <p style="margin:0 0 14px;color:#0f172a;font-size:15px;line-height:1.6;">
        You have been invited to access the Digital Footprint client portal for <strong>${esc(email)}</strong>.
      </p>
      ${messageBlock}
      <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">
        Use the secure one-time sign-in button below to open your portal dashboard. This link is single-use and will expire.
      </p>
      <a href="${esc(actionLink)}" style="display:inline-block;background:#06b6d4;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 24px;border-radius:8px;">
        Open your portal
      </a>
      <p style="margin:22px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;">
        If you did not expect this invitation, you can safely ignore this email. For security, please do not forward this link to anyone else.
      </p>
    </div>
    <div style="background:#f8fafc;padding:14px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;">
      Sent automatically by the Digital Footprint client portal system.
    </div>
  </div>`;
}

async function sendMagicLinkEmail(email: string, actionLink: string, personalMessage: string | null): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `Digital Footprint <noreply@${RESEND_FROM_DOMAIN}>`,
        to: [email],
        subject: "You've been invited to the Digital Footprint Client Portal",
        html: buildInviteHtml(email, actionLink, personalMessage),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function generateMagicLink(supabaseAdmin: any, email: string, redirectUrl: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: redirectUrl },
    });
    if (error || !data?.properties?.action_link) return null;
    return data.properties.action_link;
  } catch {
    return null;
  }
}

async function activeMembership(supabaseAdmin: any, clientId: string, email: string, userId: string | null) {
  const { data: rows } = await supabaseAdmin
    .from("portal_access")
    .select("id, invitation_state, is_revoked, user_id")
    .eq("client_id", clientId)
    .or(`email.eq.${email}${userId ? `,user_id.eq.${userId}` : ""}`);
  const list = (rows ?? []) as Array<{ id: string; invitation_state: string | null; is_revoked: boolean | null; user_id: string | null }>;
  const active = list.find((r) => r.is_revoked !== true && ["pending", "sent", "accepted"].includes(r.invitation_state ?? ""));
  const reusable = list[0] ?? null;
  return { active, reusable };
}

async function setClientPortalState(supabaseAdmin: any, clientId: string) {
  const { data: rows } = await supabaseAdmin
    .from("portal_access")
    .select("invitation_state, is_revoked")
    .eq("client_id", clientId);
  const list = rows ?? [];
  const hasActive = list.some((r: any) => r.is_revoked !== true && ["pending", "sent", "accepted"].includes(r.invitation_state));
  const hasAccepted = list.some((r: any) => r.is_revoked !== true && r.invitation_state === "accepted");
  const next = !list.length ? "none" : hasAccepted ? "active" : hasActive ? "invited" : "none";
  await supabaseAdmin.from("clients").update({ portal_access_state: next, updated_at: new Date().toISOString() }).eq("id", clientId);
}

serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return err("UNAUTHENTICATED", 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (entry && now <= entry.resetAt && entry.count >= RATE_MAX) {
    return Response.json({ code: "RATE_LIMITED" }, { status: 429, headers });
  }
  if (!entry || now > entry.resetAt) rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  else entry.count++;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return Response.json({ code: "INVITATION_FAILED" }, { status: 500, headers });

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return Response.json({ code: "UNAUTHENTICATED" }, { status: 401, headers });

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authUser, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !authUser?.user) {
    return Response.json({ code: "UNAUTHENTICATED" }, { status: 401, headers });
  }
  const callerId = authUser.user.id;

  const { data: aalData, error: aalError } = await supabaseAdmin.auth.mfa.getAuthenticatorAssuranceLevel(token);
  if (aalError || !aalData || aalData.currentLevel !== "aal2") {
    await audit(supabaseAdmin, {
      eventType: "portal.mfa_required",
      entityType: "admin_profiles",
      entityId: callerId,
      actorId: callerId,
      metadata: {
        result: "forbidden",
        reason: aalError || !aalData ? "mfa_lookup_failed" : "aal2_required",
      },
    });
    return Response.json({ code: "MFA_REQUIRED" }, { status: 403, headers });
  }

  const { data: callerProfile } = await supabaseAdmin
    .from("admin_profiles")
    .select("role, active, suspended_at, archived_at")
    .eq("id", callerId)
    .maybeSingle();

  if (
    !callerProfile ||
    !callerProfile.active ||
    callerProfile.suspended_at ||
    callerProfile.archived_at ||
    !ADMIN_ROLES.has(callerProfile.role)
  ) {
    await audit(supabaseAdmin, {
      eventType: "portal.invitation_failed",
      entityType: "admin_profiles",
      entityId: callerId,
      actorId: callerId,
      metadata: { result: "forbidden", reason: "insufficient_privileges" },
    });
    return Response.json({ code: "FORBIDDEN" }, { status: 403, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ code: "INVALID_EMAIL" }, { status: 400, headers });
  }

  const action = typeof body.action === "string" ? body.action : "invite";

  if (action === "invite") {
    const clientId = body.client_id;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const accessRole = typeof body.access_role === "string" && ACCESS_ROLES.has(body.access_role) ? body.access_role : "viewer";
    const contactName = typeof body.contact_name === "string" ? body.contact_name.trim() || null : null;
    const redirectUrl = sanitiseRedirect(body.redirect_url);
    const expiresAt = parseExpiry(body.expires_at);
    const personalMessage = parseMessage(body.personal_message);

    if (!isUuid(clientId)) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 400, headers });
    if (!email || !email.includes("@") || email.length > 254) {
      return Response.json({ code: "INVALID_EMAIL" }, { status: 400, headers });
    }
    if (typeof body.access_role === "string" && !ACCESS_ROLES.has(body.access_role)) {
      return Response.json({ code: "INVALID_ROLE" }, { status: 400, headers });
    }

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("id, status, archived_at, offboarding_state, company_name")
      .eq("id", clientId)
      .maybeSingle();

    if (!client) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 404, headers });
    if (client.status !== "active" || client.archived_at || client.offboarding_state) {
      return Response.json({ code: "CLIENT_INACTIVE" }, { status: 400, headers });
    }

    let targetUser = await findUserByEmail(supabaseAdmin, email);
    if (!targetUser) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { portal_invited: true },
      });
      if (createErr || !created?.user) {
        await audit(supabaseAdmin, {
          eventType: "portal.invitation_failed",
          entityType: "client",
          entityId: clientId,
          actorId: callerId,
          metadata: { result: "failed", reason: "auth_user_create_failed", email },
        });
        return Response.json({ code: "INVITATION_FAILED" }, { status: 500, headers });
      }
      targetUser = created.user;
    }

    const { active, reusable } = await activeMembership(supabaseAdmin, clientId, email, targetUser.id);
    if (active) {
      return Response.json({ code: "ALREADY_ACTIVE", access_id: active.id }, { headers });
    }

    const actionLink = await generateMagicLink(supabaseAdmin, email, redirectUrl);
    if (!actionLink) {
      await audit(supabaseAdmin, {
        eventType: "portal.invitation_failed",
        entityType: "client",
        entityId: clientId,
        actorId: callerId,
        metadata: { result: "failed", reason: "link_generation_failed", email },
      });
      return Response.json({ code: "INVITATION_FAILED" }, { status: 500, headers });
    }

    const sent = await sendMagicLinkEmail(email, actionLink, personalMessage);
    if (!sent) {
      await audit(supabaseAdmin, {
        eventType: "portal.invitation_failed",
        entityType: "client",
        entityId: clientId,
        actorId: callerId,
        metadata: { result: "failed", reason: "email_send_failed", email },
      });
      return Response.json({ code: "INVITATION_FAILED" }, { status: 502, headers });
    }

    const ts = new Date().toISOString();
    let accessId: string | null = null;

    if (reusable) {
      await supabaseAdmin
        .from("portal_access")
        .update({
          user_id: targetUser.id,
          email,
          contact_name: contactName ?? null,
          access_role: accessRole,
          invitation_state: "sent",
          invited_at: ts,
          invited_by: callerId,
          expires_at: expiresAt,
          is_revoked: false,
          revoked_at: null,
          revoked_by: null,
          revocation_reason: null,
          updated_at: ts,
        })
        .eq("id", reusable.id);
      accessId = reusable.id;
    } else {
      const { data: inserted } = await supabaseAdmin
        .from("portal_access")
        .insert({
          client_id: clientId,
          user_id: targetUser.id,
          email,
          contact_name: contactName,
          access_role: accessRole,
          invitation_state: "sent",
          invited_at: ts,
          invited_by: callerId,
          expires_at: expiresAt,
          is_revoked: false,
          created_at: ts,
          updated_at: ts,
        })
        .select("id")
        .single();
      accessId = inserted?.id ?? null;
    }

    await setClientPortalState(supabaseAdmin, clientId);

    await audit(supabaseAdmin, {
      eventType: "portal.invitation_sent",
      entityType: "portal_access",
      entityId: accessId,
      actorId: callerId,
      metadata: { client_id: clientId, email, access_role: accessRole, result: "sent" },
    });

    return Response.json({ code: "OK", access_id: accessId, invitation_state: "sent" }, { headers });
  }

  if (action === "resend") {
    const accessId = body.access_id;
    const personalMessage = parseMessage(body.personal_message);
    if (!isUuid(accessId)) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 400, headers });

    const { data: record } = await supabaseAdmin
      .from("portal_access")
      .select("id, client_id, email, invitation_state, invited_at, user_id, access_role")
      .eq("id", accessId)
      .maybeSingle();

    if (!record) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 404, headers });
    if (!["pending", "sent", "expired", "failed"].includes(record.invitation_state)) {
      return Response.json({ code: "ALREADY_ACTIVE" }, { headers });
    }

    const lastInvited = record.invited_at ? new Date(record.invited_at).getTime() : 0;
    if (Date.now() - lastInvited < RESEND_MIN_INTERVAL_MS) {
      return Response.json({ code: "RATE_LIMITED" }, { status: 429, headers });
    }

    const email = (record.email || "").toLowerCase();
    if (!email) return Response.json({ code: "INVALID_EMAIL" }, { status: 400, headers });

    const redirectUrl = sanitiseRedirect(body.redirect_url);
    const actionLink = await generateMagicLink(supabaseAdmin, email, redirectUrl);
    if (!actionLink) {
      await audit(supabaseAdmin, {
        eventType: "portal.invitation_failed",
        entityType: "portal_access",
        entityId: accessId,
        actorId: callerId,
        metadata: { result: "failed", reason: "link_generation_failed", email },
      });
      return Response.json({ code: "INVITATION_FAILED" }, { status: 500, headers });
    }

    const sent = await sendMagicLinkEmail(email, actionLink, personalMessage);
    if (!sent) {
      await audit(supabaseAdmin, {
        eventType: "portal.invitation_failed",
        entityType: "portal_access",
        entityId: accessId,
        actorId: callerId,
        metadata: { result: "failed", reason: "email_send_failed", email },
      });
      return Response.json({ code: "INVITATION_FAILED" }, { status: 502, headers });
    }

    const ts = new Date().toISOString();
    await supabaseAdmin
      .from("portal_access")
      .update({ invitation_state: "sent", invited_at: ts, invited_by: callerId, updated_at: ts })
      .eq("id", accessId);

    await audit(supabaseAdmin, {
      eventType: "portal.invitation_resent",
      entityType: "portal_access",
      entityId: accessId,
      actorId: callerId,
      metadata: { client_id: record.client_id, email, result: "resent" },
    });

    return Response.json({ code: "OK", access_id: accessId, invitation_state: "sent" }, { headers });
  }

  if (action === "revoke") {
    const accessId = body.access_id;
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : null;
    if (!isUuid(accessId)) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 400, headers });

    const { data: record } = await supabaseAdmin
      .from("portal_access")
      .select("id, client_id, user_id")
      .eq("id", accessId)
      .maybeSingle();

    if (!record) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 404, headers });

    const ts = new Date().toISOString();
    await supabaseAdmin
      .from("portal_access")
      .update({
        is_revoked: true,
        revoked_at: ts,
        revoked_by: callerId,
        revocation_reason: reason,
        invitation_state: "revoked",
        updated_at: ts,
      })
      .eq("id", accessId);

    if (record.user_id) {
      try {
        await supabaseAdmin.auth.admin.signOut(record.user_id, "global");
      } catch {
        // signOut may be unsupported on older runtimes; membership check still blocks access
      }
    }

    await setClientPortalState(supabaseAdmin, record.client_id);

    await audit(supabaseAdmin, {
      eventType: "portal.access_revoked",
      entityType: "portal_access",
      entityId: accessId,
      actorId: callerId,
      metadata: { client_id: record.client_id, user_id: record.user_id, result: "revoked", reason: reason ?? null },
    });

    return Response.json({ code: "OK", access_id: accessId, is_revoked: true }, { headers });
  }

  if (action === "restore") {
    const accessId = body.access_id;
    if (!isUuid(accessId)) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 400, headers });

    const { data: record } = await supabaseAdmin
      .from("portal_access")
      .select("id, client_id, is_revoked, accepted_at")
      .eq("id", accessId)
      .maybeSingle();

    if (!record) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 404, headers });
    if (record.is_revoked !== true) return Response.json({ code: "ALREADY_ACTIVE" }, { headers });

    const ts = new Date().toISOString();
    const nextState = record.accepted_at ? "accepted" : "sent";
    await supabaseAdmin
      .from("portal_access")
      .update({
        is_revoked: false,
        revoked_at: null,
        revoked_by: null,
        revocation_reason: null,
        invitation_state: nextState,
        updated_at: ts,
      })
      .eq("id", accessId);

    await setClientPortalState(supabaseAdmin, record.client_id);

    await audit(supabaseAdmin, {
      eventType: "portal.access_restored",
      entityType: "portal_access",
      entityId: accessId,
      actorId: callerId,
      metadata: { client_id: record.client_id, result: "restored", state: nextState },
    });

    return Response.json({ code: "OK", access_id: accessId, is_revoked: false }, { headers });
  }

  if (action === "change_role") {
    const accessId = body.access_id;
    const accessRole = typeof body.access_role === "string" ? body.access_role : "";
    if (!isUuid(accessId)) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 400, headers });
    if (!ACCESS_ROLES.has(accessRole)) return Response.json({ code: "INVALID_ROLE" }, { status: 400, headers });

    const { data: record } = await supabaseAdmin
      .from("portal_access")
      .select("id, client_id, access_role")
      .eq("id", accessId)
      .maybeSingle();

    if (!record) return Response.json({ code: "CLIENT_NOT_FOUND" }, { status: 404, headers });

    const ts = new Date().toISOString();
    await supabaseAdmin
      .from("portal_access")
      .update({ access_role: accessRole, updated_at: ts })
      .eq("id", accessId);

    await audit(supabaseAdmin, {
      eventType: "portal.role_changed",
      entityType: "portal_access",
      entityId: accessId,
      actorId: callerId,
      metadata: { client_id: record.client_id, from_role: record.access_role, to_role: accessRole, result: "changed" },
    });

    return Response.json({ code: "OK", access_id: accessId, access_role: accessRole }, { headers });
  }

  return Response.json({ code: "INVALID_ROLE" }, { status: 400, headers });
});
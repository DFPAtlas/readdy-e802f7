import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_DOMAIN = Deno.env.get("RESEND_FROM_DOMAIN") || "digital-footprint.uk";
const SITE_URL = Deno.env.get("DFP_APP_ORIGIN") || Deno.env.get("SITE_URL") || "https://digital-footprint.uk";
const ADMIN_URL = Deno.env.get("DFP_ADMIN_ORIGIN") || SITE_URL;

const ALLOWED_ADMIN_ROLES = ["owner", "super_admin", "admin"];

interface EventDef {
  direction: "client" | "admin";
  resource: "thread" | "ticket";
}

const EVENT_DEFS: Record<string, EventDef> = {
  client_reply: { direction: "client", resource: "thread" },
  client_thread_created: { direction: "client", resource: "thread" },
  staff_reply: { direction: "admin", resource: "thread" },
  ticket_created: { direction: "client", resource: "ticket" },
  ticket_replied: { direction: "client", resource: "ticket" },
  ticket_assigned: { direction: "admin", resource: "ticket" },
  ticket_status_changed: { direction: "admin", resource: "ticket" },
  ticket_awaiting_client: { direction: "admin", resource: "ticket" },
  ticket_reopened: { direction: "admin", resource: "ticket" },
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  open: "Open",
  assigned: "Assigned",
  awaiting_team: "Awaiting Team",
  awaiting_client: "Awaiting Client",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
};

function getCorsHeaders(request: Request): { headers: Record<string, string>; originAllowed: boolean } {
  const origin = request.headers.get("origin");
  const appOrigin = Deno.env.get("DFP_APP_ORIGIN") || "https://digital-footprint.uk";
  const adminOrigin = Deno.env.get("DFP_ADMIN_ORIGIN") || "https://digital-footprint.uk";
  const devOrigin = Deno.env.get("DFP_DEV_ORIGIN");
  const allowedOrigins = Deno.env.get("DFP_ALLOWED_ORIGINS");

  let originAllowed = false;
  if (origin) {
    if (origin === appOrigin || origin === adminOrigin) originAllowed = true;
    if (devOrigin && origin === devOrigin) originAllowed = true;
    if (allowedOrigins) {
      const origins = allowedOrigins.split(",").map((o) => o.trim());
      if (origins.includes(origin)) originAllowed = true;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (originAllowed && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
    headers["Access-Control-Allow-Headers"] = "authorization, x-client-info, apikey, content-type";
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Max-Age"] = "86400";
  }

  return { headers, originAllowed };
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(value: string, max = 500): string {
  const v = value ?? "";
  return v.length > max ? v.slice(0, max) + "..." : v;
}

function auditEvent(
  supabaseAdmin: ReturnType<typeof createClient>,
  actorId: string,
  action: string,
  reason: string,
  extra: Record<string, unknown> = {},
): void {
  try {
    supabaseAdmin
      .from("admin_security_audit_log")
      .insert({
        actor_id: actorId,
        action,
        module: "dispatch-portal-notification",
        result: "denied",
        reason,
        success: false,
        details: { endpoint: "dispatch-portal-notification", ...extra },
      })
      .then(() => {})
      .catch(() => {});
  } catch {
    // best effort
  }
}

type Recipient = { userId: string; email: string };

async function resolveEmailById(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
): Promise<string | null> {
  const { data: ap } = await supabaseAdmin
    .from("admin_profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle();
  if (ap?.email) return ap.email;

  const { data: sp } = await supabaseAdmin
    .from("staff_profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle();
  if (sp?.email) return sp.email;

  try {
    const { data: u } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (u?.user?.email) return u.user.email;
  } catch {
    // ignore
  }
  return null;
}

async function resolveStaffRecipients(
  supabaseAdmin: ReturnType<typeof createClient>,
  assignedStaffId: string | null,
): Promise<Recipient[]> {
  const out: Recipient[] = [];

  if (assignedStaffId) {
    const email = await resolveEmailById(supabaseAdmin, assignedStaffId);
    if (email) out.push({ userId: assignedStaffId, email });
  }

  if (out.length === 0) {
    const { data: admins } = await supabaseAdmin
      .from("admin_profiles")
      .select("id, email")
      .eq("active", true)
      .is("suspended_at", null)
      .is("archived_at", null)
      .in("role", ALLOWED_ADMIN_ROLES);
    for (const a of admins ?? []) {
      out.push({ userId: a.id, email: a.email });
    }
  }

  return dedupRecipients(out);
}

async function resolveClientRecipients(
  supabaseAdmin: ReturnType<typeof createClient>,
  clientId: string,
): Promise<Recipient[]> {
  const { data: rows } = await supabaseAdmin
    .from("portal_access")
    .select("user_id, email, access_role, is_revoked, invitation_state")
    .eq("client_id", clientId);

  const active = (rows ?? []).filter(
    (r) => r.is_revoked !== true && r.invitation_state === "accepted" && r.user_id,
  );

  const ordered = active.sort((a, b) => {
    const aOwner = a.access_role === "owner" ? 1 : 0;
    const bOwner = b.access_role === "owner" ? 1 : 0;
    return bOwner - aOwner;
  });

  const out: Recipient[] = [];
  for (const r of ordered) {
    const email = r.email || (await resolveEmailById(supabaseAdmin, r.user_id));
    if (email) out.push({ userId: r.user_id, email });
  }

  return dedupRecipients(out);
}

function dedupRecipients(recipients: Recipient[]): Recipient[] {
  const seen = new Set<string>();
  const out: Recipient[] = [];
  for (const r of recipients) {
    const key = r.email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

async function resolveCallerClientIds(
  supabaseAdmin: ReturnType<typeof createClient>,
  callerId: string,
): Promise<string[]> {
  const { data: rows } = await supabaseAdmin
    .from("portal_access")
    .select("client_id, is_revoked, invitation_state")
    .eq("user_id", callerId);

  const ids = new Set<string>();
  for (const r of rows ?? []) {
    if (r.is_revoked !== true && r.invitation_state === "accepted" && r.client_id) {
      ids.add(r.client_id);
    }
  }
  return Array.from(ids);
}

function buildMessageHtml(
  subject: string,
  content: string,
  portalUrl: string,
  isStaffReply: boolean,
): string {
  const actionLabel = isStaffReply ? "DFP Team replied" : "New client message";
  const description = isStaffReply
    ? "A member of the Digital Footprint team has replied to your message."
    : "A client has sent a new message.";
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0891B2, #06B6D4); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 18px;">Digital Footprint</h1>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px;"><strong>${actionLabel}:</strong> ${escapeHtml(subject)}</p>
        <div style="background: #f8fafc; border-left: 3px solid #06B6D4; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;">
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">${escapeHtml(truncate(content))}</p>
        </div>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 16px;">${description}</p>
        <a href="${portalUrl}" style="display: inline-block; background: #06B6D4; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Portal</a>
      </div>
      <div style="padding: 16px 24px; background: #f8fafc; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">Digital Footprint — Client Portal</p>
      </div>
    </div>
  `;
}

function buildThreadCreatedHtml(
  subject: string,
  senderName: string,
  content: string,
  adminUrl: string,
): string {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0891B2, #06B6D4); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 18px;">Digital Footprint</h1>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 16px; color: #1e293b; margin: 0 0 8px;"><strong>New client message:</strong> ${escapeHtml(subject)}</p>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 16px;">From: ${escapeHtml(senderName)}</p>
        <div style="background: #f8fafc; border-left: 3px solid #06B6D4; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;">
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">${escapeHtml(truncate(content))}</p>
        </div>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 16px;">A client has started a new conversation.</p>
        <a href="${adminUrl}" style="display: inline-block; background: #06B6D4; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Admin</a>
      </div>
      <div style="padding: 16px 24px; background: #f8fafc; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">Digital Footprint — Client Portal</p>
      </div>
    </div>
  `;
}

function buildTicketHtml(
  title: string,
  ticketRef: string,
  ticketSubject: string,
  detail: string,
  portalUrl: string,
): string {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7C3AED, #8B5CF6); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 18px;">Digital Footprint Support</h1>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 16px; color: #1e293b; margin: 0 0 8px;"><strong>${escapeHtml(title)}</strong></p>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 16px;">${escapeHtml(ticketRef)} — ${escapeHtml(ticketSubject)}</p>
        <p style="font-size: 14px; color: #334155; margin: 0 0 16px; line-height: 1.6;">${escapeHtml(detail)}</p>
        <a href="${portalUrl}" style="display: inline-block; background: #8B5CF6; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View Ticket</a>
      </div>
      <div style="padding: 16px 24px; background: #f8fafc; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">Digital Footprint — Client Portal</p>
      </div>
    </div>
  `;
}

interface DispatchContext {
  recipients: Recipient[];
  subject: string;
  html: string;
  message: string;
  route: string;
  dedupKey: string;
  skipped: boolean;
  skipReason?: string;
}

async function deliverToRecipient(
  supabaseAdmin: ReturnType<typeof createClient>,
  recipient: Recipient,
  ctx: {
    eventType: string;
    resourceType: string;
    relatedEntityId: string;
    subject: string;
    html: string;
    message: string;
    route: string;
    dedupKey: string;
    callerId: string;
  },
): Promise<{ dedup?: boolean; delivered?: boolean; error?: string }> {
  const { data: existing } = await supabaseAdmin
    .from("notifications")
    .select("id, delivery_state")
    .eq("dedup_key", ctx.dedupKey)
    .eq("recipient_user_id", recipient.userId)
    .maybeSingle();

  if (existing && existing.delivery_state === "delivered") {
    return { dedup: true };
  }

  let notificationId = existing?.id;
  if (!notificationId) {
    const { data: n, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        recipient_user_id: recipient.userId,
        event_type: ctx.eventType,
        category: ctx.resourceType === "ticket" ? "support" : "client",
        severity: "info",
        title: ctx.subject,
        message: ctx.message,
        related_module: ctx.resourceType === "ticket" ? "support" : "messages",
        related_record_type: ctx.resourceType === "ticket" ? "support_ticket" : "message_thread",
        related_record_id: ctx.relatedEntityId,
        route: ctx.route,
        actor_user_id: ctx.callerId,
        source_system: "portal",
        dedup_key: ctx.dedupKey,
        delivery_state: "queued",
      })
      .select("id")
      .single();
    if (error) return { error: "notification_record_failed" };
    notificationId = n.id;
  } else {
    await supabaseAdmin
      .from("notifications")
      .update({ delivery_state: "queued", last_occurred_at: new Date().toISOString() })
      .eq("id", notificationId);
  }

  const { data: prior } = await supabaseAdmin
    .from("notification_deliveries")
    .select("attempt_number")
    .eq("notification_id", notificationId)
    .order("attempt_number", { ascending: false })
    .limit(1);
  const attempt = prior?.[0] ? prior[0].attempt_number + 1 : 1;

  const { data: delivery } = await supabaseAdmin
    .from("notification_deliveries")
    .insert({
      notification_id: notificationId,
      channel: "email",
      provider: "resend",
      attempt_number: attempt,
      state: "queued",
    })
    .select("id")
    .single();

  let providerMessageId: string | null = null;
  let sendError: string | null = null;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `Digital Footprint <noreply@${RESEND_FROM_DOMAIN}>`,
        to: [recipient.email],
        subject: ctx.subject,
        html: ctx.html,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      sendError = data?.message || `resend_http_${res.status}`;
    } else {
      providerMessageId = data?.id || null;
    }
  } catch (err) {
    sendError = err instanceof Error ? err.message : "send_error";
  }

  if (sendError) {
    await supabaseAdmin
      .from("notification_deliveries")
      .update({
        state: "failed",
        failure_summary: (sendError || "").slice(0, 500),
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", delivery?.id);
    await supabaseAdmin
      .from("notifications")
      .update({ delivery_state: "failed" })
      .eq("id", notificationId);
    return { delivered: false, error: "email_delivery_failed" };
  }

  await supabaseAdmin
    .from("notification_deliveries")
    .update({
      state: "sent",
      provider_message_id: providerMessageId,
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", delivery?.id);
  await supabaseAdmin
    .from("notifications")
    .update({ delivery_state: "delivered" })
    .eq("id", notificationId);

  return { delivered: true };
}

serve(async (req: Request) => {
  const { headers: corsH, originAllowed } = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    if (!originAllowed) return new Response(null, { status: 204 });
    return new Response("ok", { headers: corsH });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: corsH });
  }

  if (!originAllowed) {
    return new Response(JSON.stringify({ error: "origin_not_allowed" }), { status: 403, headers: corsH });
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) {
    return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: corsH });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "service_unavailable" }), { status: 500, headers: corsH });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let callerId: string;
  try {
    const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !authData?.user) {
      return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: corsH });
    }
    callerId = authData.user.id;
  } catch {
    return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: corsH });
  }

  let body: { event_type?: string; related_entity_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_request_body" }), { status: 400, headers: corsH });
  }

  const eventType = String(body.event_type ?? "");
  const relatedEntityId = String(body.related_entity_id ?? "");

  const eventDef = EVENT_DEFS[eventType];
  if (!eventDef) {
    return new Response(JSON.stringify({ error: "unsupported_event_type" }), { status: 400, headers: corsH });
  }
  if (!relatedEntityId) {
    return new Response(JSON.stringify({ error: "related_entity_id_required" }), { status: 400, headers: corsH });
  }

  let isAdmin = false;
  try {
    const { data: profile } = await supabaseAdmin
      .from("admin_profiles")
      .select("role, active, suspended_at, archived_at")
      .eq("id", callerId)
      .maybeSingle();

    if (
      profile &&
      profile.active === true &&
      profile.suspended_at == null &&
      profile.archived_at == null &&
      ALLOWED_ADMIN_ROLES.includes(profile.role)
    ) {
      isAdmin = true;
    }
  } catch {
    isAdmin = false;
  }

  const callerClientIds = await resolveCallerClientIds(supabaseAdmin, callerId);
  const isPortalClient = callerClientIds.length > 0;

  if (!isAdmin && !isPortalClient) {
    auditEvent(supabaseAdmin, callerId, "portal_notification_dispatch_rejected", "permission_denied");
    return new Response(JSON.stringify({ error: "permission_denied" }), { status: 403, headers: corsH });
  }

  if (eventDef.direction === "admin") {
    if (!isAdmin) {
      auditEvent(supabaseAdmin, callerId, "portal_notification_dispatch_rejected", "permission_denied", { event_type: eventType });
      return new Response(JSON.stringify({ error: "permission_denied" }), { status: 403, headers: corsH });
    }

    let aalLevel: string | null = null;
    try {
      const { data: aalData, error: aalErr } = await supabaseAdmin.auth.mfa.getAuthenticatorAssuranceLevel(token);
      if (aalErr || !aalData) {
        auditEvent(supabaseAdmin, callerId, "admin_mfa_required", "mfa_lookup_failed", { event_type: eventType, outcome: "mfa_lookup_failed" });
        return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
      }
      aalLevel = aalData.currentLevel || null;
    } catch {
      auditEvent(supabaseAdmin, callerId, "admin_mfa_required", "mfa_lookup_failed", { event_type: eventType, outcome: "mfa_lookup_failed" });
      return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
    }

    if (aalLevel !== "aal2") {
      auditEvent(supabaseAdmin, callerId, "admin_mfa_required", "aal2_required", { event_type: eventType, outcome: "aal1_rejected" });
      return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
    }
  } else {
    if (!isPortalClient) {
      auditEvent(supabaseAdmin, callerId, "portal_notification_dispatch_rejected", "permission_denied", { event_type: eventType });
      return new Response(JSON.stringify({ error: "permission_denied" }), { status: 403, headers: corsH });
    }
  }

  let context: DispatchContext;

  if (eventDef.resource === "thread") {
    const { data: thread } = await supabaseAdmin
      .from("message_threads")
      .select("*")
      .eq("id", relatedEntityId)
      .maybeSingle();

    if (!thread) {
      return new Response(JSON.stringify({ error: "resource_not_found" }), { status: 404, headers: corsH });
    }

    if (!isAdmin) {
      if (!thread.client_id || !callerClientIds.includes(thread.client_id)) {
        auditEvent(supabaseAdmin, callerId, "portal_notification_resource_denied", "resource_not_owned", { event_type: eventType, related_entity_id: relatedEntityId });
        return new Response(JSON.stringify({ error: "permission_denied" }), { status: 403, headers: corsH });
      }
    }

    if (eventType === "client_thread_created") {
      const { data: firstMessage } = await supabaseAdmin
        .from("project_messages")
        .select("*")
        .eq("thread_id", relatedEntityId)
        .eq("is_internal", false)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!firstMessage) {
        return new Response(JSON.stringify({ error: "message_not_found" }), { status: 400, headers: corsH });
      }

      const adminUrl = `${ADMIN_URL}/admin`;
      const recipients = await resolveStaffRecipients(supabaseAdmin, thread.assigned_staff);
      context = {
        recipients,
        subject: `New client message: ${thread.subject}`,
        html: buildThreadCreatedHtml(thread.subject, firstMessage.sender_name ?? "Client", firstMessage.content ?? "", adminUrl),
        message: `New conversation "${thread.subject}"`,
        route: adminUrl,
        dedupKey: `portal-email:client_thread_created:${relatedEntityId}:${firstMessage.id}`,
        skipped: false,
      };
    } else {
      const { data: latest } = await supabaseAdmin
        .from("project_messages")
        .select("*")
        .eq("thread_id", relatedEntityId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latest || latest.is_internal === true) {
        context = {
          recipients: [],
          subject: "",
          html: "",
          message: "",
          route: "",
          dedupKey: "",
          skipped: true,
          skipReason: "internal_note",
        };
      } else {
        const isStaffReply = eventType === "staff_reply";
        const portalUrl = `${SITE_URL}/portal/messages`;
        const subject = isStaffReply
          ? `DFP Team replied: ${thread.subject}`
          : `New reply: ${thread.subject}`;
        const recipients = isStaffReply
          ? await resolveClientRecipients(supabaseAdmin, thread.client_id)
          : await resolveStaffRecipients(supabaseAdmin, thread.assigned_staff);

        context = {
          recipients,
          subject,
          html: buildMessageHtml(thread.subject, latest.content ?? "", portalUrl, isStaffReply),
          message: `New message in "${thread.subject}"`,
          route: portalUrl,
          dedupKey: `portal-email:${eventType}:${relatedEntityId}:${latest.id}`,
          skipped: false,
        };
      }
    }
  } else {
    const { data: ticket } = await supabaseAdmin
      .from("support_tickets")
      .select("*")
      .eq("id", relatedEntityId)
      .maybeSingle();

    if (!ticket) {
      return new Response(JSON.stringify({ error: "resource_not_found" }), { status: 404, headers: corsH });
    }

    if (!isAdmin) {
      if (!ticket.client_id || !callerClientIds.includes(ticket.client_id)) {
        auditEvent(supabaseAdmin, callerId, "portal_notification_resource_denied", "resource_not_owned", { event_type: eventType, related_entity_id: relatedEntityId });
        return new Response(JSON.stringify({ error: "permission_denied" }), { status: 403, headers: corsH });
      }
    }

    const portalUrl = `${SITE_URL}/portal/support/${ticket.id}`;

    if (eventType === "ticket_created") {
      const recipients = await resolveStaffRecipients(supabaseAdmin, ticket.assigned_staff);
      context = {
        recipients,
        subject: `Support request received: ${ticket.ticket_reference}`,
        html: buildTicketHtml(
          "Support Ticket Created",
          ticket.ticket_reference,
          ticket.subject,
          ticket.description ? truncate(ticket.description) : "Your support request has been received.",
          portalUrl,
        ),
        message: `New support ticket "${ticket.subject}"`,
        route: portalUrl,
        dedupKey: `portal-email:ticket_created:${ticket.id}`,
        skipped: false,
      };
    } else if (eventType === "ticket_replied") {
      let content = "A new client reply has been added.";
      let replyVersion = ticket.updated_at;
      if (ticket.thread_id) {
        const { data: latest } = await supabaseAdmin
          .from("project_messages")
          .select("*")
          .eq("thread_id", ticket.thread_id)
          .eq("is_internal", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (latest) {
          if (latest.content) content = latest.content;
          replyVersion = latest.id;
        }
      }
      const recipients = await resolveStaffRecipients(supabaseAdmin, ticket.assigned_staff);
      context = {
        recipients,
        subject: `New reply on ${ticket.ticket_reference}`,
        html: buildTicketHtml(
          "New Reply on Support Ticket",
          ticket.ticket_reference,
          ticket.subject,
          content,
          portalUrl,
        ),
        message: `New reply on ticket "${ticket.subject}"`,
        route: portalUrl,
        dedupKey: `portal-email:ticket_replied:${ticket.id}:${replyVersion}`,
        skipped: false,
      };
    } else {
      const recipients = await resolveClientRecipients(supabaseAdmin, ticket.client_id);
      const statusLabel = STATUS_LABELS[ticket.status] || ticket.status;

      let title = "Support Ticket Updated";
      let detail = `The status has been updated to: ${statusLabel}`;
      let version = ticket.status;
      if (eventType === "ticket_assigned") {
        title = "Support Ticket Assigned";
        detail = "This ticket has been assigned to a team member.";
        version = ticket.assigned_staff || "unassigned";
      } else if (eventType === "ticket_awaiting_client") {
        title = "Action Required on Support Ticket";
        detail = "Our team needs more information from you to continue.";
      } else if (eventType === "ticket_reopened") {
        title = "Support Ticket Reopened";
        detail = "This ticket has been reopened.";
      }

      context = {
        recipients,
        subject: `Ticket ${ticket.ticket_reference} updated`,
        html: buildTicketHtml(title, ticket.ticket_reference, ticket.subject, detail, portalUrl),
        message: `Ticket "${ticket.subject}" updated to ${statusLabel}`,
        route: portalUrl,
        dedupKey: `portal-email:${eventType}:${ticket.id}:${version}`,
        skipped: false,
      };
    }
  }

  if (context.skipped) {
    return new Response(
      JSON.stringify({ success: true, skipped: true, skip_reason: context.skipReason, delivered: 0, failed: 0, deduped: 0 }),
      { status: 200, headers: corsH },
    );
  }

  if (context.recipients.length === 0) {
    return new Response(
      JSON.stringify({ success: true, skipped: true, skip_reason: "no_recipients", delivered: 0, failed: 0, deduped: 0 }),
      { status: 200, headers: corsH },
    );
  }

  let delivered = 0;
  let failed = 0;
  let deduped = 0;

  for (const recipient of context.recipients) {
    const result = await deliverToRecipient(supabaseAdmin, recipient, {
      eventType,
      resourceType: eventDef.resource,
      relatedEntityId,
      subject: context.subject,
      html: context.html,
      message: context.message,
      route: context.route,
      dedupKey: context.dedupKey,
      callerId,
    });

    if (result.dedup) deduped++;
    else if (result.delivered) delivered++;
    else failed++;
  }

  return new Response(
    JSON.stringify({
      success: true,
      event_type: eventType,
      delivered,
      failed,
      deduped,
      skipped: false,
    }),
    { status: 200, headers: corsH },
  );
});

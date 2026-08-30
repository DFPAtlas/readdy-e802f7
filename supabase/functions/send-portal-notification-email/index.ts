import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.2.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

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
      const origins = allowedOrigins.split(",").map(function (o) { return o.trim(); });
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

interface EmailPayload {
  to_user_id?: string;
  to_email?: string;
  to_name?: string;
  subject: string;
  html: string;
  idempotency_key: string;
  event_type: string;
  related_entity_id?: string;
}

const ALLOWED_ADMIN_ROLES = ["owner", "super_admin", "admin"];

function auditEvent(
  supabaseAdmin: ReturnType<typeof createClient>,
  actorId: string,
  action: string,
  reason: string,
  extra: Record<string, unknown> = {},
): void {
  try {
    supabaseAdmin.from("admin_security_audit_log").insert({
      actor_id: actorId,
      action,
      module: "send-portal-notification-email",
      result: "denied",
      reason,
      success: false,
      details: { endpoint: "send-portal-notification-email", ...extra },
    }).then(function () {}).catch(function () {});
  } catch { /* best effort */ }
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

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
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

  let profile: { role: string; active: boolean; suspended_at: string | null; archived_at: string | null } | null = null;
  try {
    const { data: profileData } = await supabaseAdmin
      .from("admin_profiles")
      .select("role, active, suspended_at, archived_at")
      .eq("id", callerId)
      .maybeSingle();
    profile = profileData as typeof profile;
  } catch {
    profile = null;
  }

  const isActiveAdmin = profile && profile.active === true;
  const isSuspended = profile && profile.suspended_at != null;
  const isArchived = profile && profile.archived_at != null;
  const isAllowedRole = profile && ALLOWED_ADMIN_ROLES.includes(profile.role);

  if (!profile || !isActiveAdmin || isSuspended || isArchived || !isAllowedRole) {
    auditEvent(supabaseAdmin, callerId, "portal_notification_email_rejected", "insufficient_privileges");
    return new Response(JSON.stringify({ error: "admin_permission_required" }), { status: 403, headers: corsH });
  }

  let aalLevel: string | null = null;
  try {
    const { data: aalData, error: aalErr } = await supabaseAdmin.auth.mfa.getAuthenticatorAssuranceLevel(token);
    if (aalErr || !aalData) {
      auditEvent(supabaseAdmin, callerId, "admin_mfa_required", "mfa_lookup_failed", { outcome: "mfa_lookup_failed" });
      return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
    }
    aalLevel = aalData.currentLevel || null;
  } catch {
    auditEvent(supabaseAdmin, callerId, "admin_mfa_required", "mfa_lookup_failed", { outcome: "mfa_lookup_failed" });
    return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
  }

  if (aalLevel !== "aal2") {
    auditEvent(supabaseAdmin, callerId, "admin_mfa_required", "aal2_required");
    return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
  }

  let payload: EmailPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_request_body" }), { status: 400, headers: corsH });
  }

  if (!payload.idempotency_key) {
    return new Response(JSON.stringify({ success: false, error: "idempotency_key is required" }), { status: 400, headers: corsH });
  }
  if (!payload.subject || !payload.html || !payload.event_type) {
    return new Response(JSON.stringify({ success: false, error: "subject, html, and event_type are required" }), { status: 400, headers: corsH });
  }

  try {
    const { data: existing } = await supabaseAdmin
      .from("notification_deliveries")
      .select("id, state, provider_id, attempts")
      .eq("idempotency_key", payload.idempotency_key)
      .maybeSingle();

    if (existing && existing.state === "confirmed") {
      return new Response(JSON.stringify({ success: true, dedup: true, delivery_id: existing.id }), { status: 200, headers: corsH });
    }

    let recipientEmail = payload.to_email;
    let recipientName = payload.to_name || "Client";

    if (!recipientEmail && payload.to_user_id) {
      const { data: profileData } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", payload.to_user_id)
        .maybeSingle();

      if (profileData) {
        recipientEmail = profileData.email;
        recipientName = profileData.full_name || recipientName;
      }

      if (!recipientEmail) {
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(payload.to_user_id);
        if (user?.user?.email) {
          recipientEmail = user.user.email;
        }
      }
    }

    if (!recipientEmail) {
      return new Response(JSON.stringify({ success: false, error: "No recipient email found" }), { status: 400, headers: corsH });
    }

    const deliveryInsert = {
      idempotency_key: payload.idempotency_key,
      channel: "email",
      state: "pending",
      recipient: recipientEmail,
      recipient_user_id: payload.to_user_id || null,
      event_type: payload.event_type,
      related_entity_id: payload.related_entity_id || null,
      subject: payload.subject,
      requested_at: new Date().toISOString(),
    };

    const { data: delivery } = existing
      ? { data: existing }
      : await supabaseAdmin.from("notification_deliveries").insert(deliveryInsert).select("id").single();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RESEND_FROM_DOMAIN = Deno.env.get("RESEND_FROM_DOMAIN") || "digital-footprint.uk";

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "service_unavailable" }), { status: 500, headers: corsH });
    }

    const resend = new Resend(RESEND_API_KEY);
    const fromAddress = `Digital Footprint <noreply@${RESEND_FROM_DOMAIN}>`;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject: payload.subject,
      html: payload.html,
    });

    if (resendError) {
      await supabaseAdmin.from("notification_deliveries")
        .update({
          state: "failed",
          error_message: resendError.message,
          completed_at: new Date().toISOString(),
          attempts: (existing?.attempts || 0) + 1,
        })
        .eq("id", delivery?.id || existing?.id);

      return new Response(JSON.stringify({ success: false, error: "email_delivery_failed" }), { status: 500, headers: corsH });
    }

    await supabaseAdmin.from("notification_deliveries")
      .update({
        state: "confirmed",
        provider_id: resendData?.id || null,
        completed_at: new Date().toISOString(),
        attempts: (existing?.attempts || 0) + 1,
      })
      .eq("id", delivery?.id || existing?.id);

    return new Response(JSON.stringify({ success: true, id: resendData?.id, delivery_id: delivery?.id }), { status: 200, headers: corsH });
  } catch (_err) {
    return new Response(JSON.stringify({ success: false, error: "service_unavailable" }), { status: 500, headers: corsH });
  }
});

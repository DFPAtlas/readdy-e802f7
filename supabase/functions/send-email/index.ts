import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ADMIN_ROLES = ["owner", "super_admin", "admin"];

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

interface EmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string;
}

async function auditLog(
  supabaseAdmin: any,
  callerId: string,
  action: string,
  details: Record<string, unknown>,
) {
  await supabaseAdmin.from("admin_security_audit_log").insert({
    actor_id: callerId,
    action,
    target_user_id: callerId,
    success: false,
    details,
    created_at: new Date().toISOString(),
    module: "send-email",
    source: "edge_function",
  }).catch(() => {});
}

serve(async (req: Request) => {
  const { headers: corsH, originAllowed } = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    if (!originAllowed) return new Response(null, { status: 204 });
    return new Response("ok", { headers: corsH });
  }

  if (!originAllowed) {
    return new Response(JSON.stringify({ error: "origin_not_allowed" }), { status: 403, headers: corsH });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: corsH });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "service_unavailable" }), { status: 500, headers: corsH });
  }

  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: corsH });
  }
  const token = authHeader.replace("Bearer ", "");

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data: authUser, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authUser?.user) {
      return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: corsH });
    }

    const callerId = authUser.user.id;

    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("role, active, suspended_at, archived_at")
      .eq("id", callerId)
      .maybeSingle();

    const isFullAdmin = adminProfile && ALLOWED_ADMIN_ROLES.includes(adminProfile.role);

    if (isFullAdmin) {
      if (
        adminProfile.active !== true ||
        adminProfile.suspended_at != null ||
        adminProfile.archived_at != null
      ) {
        await auditLog(supabaseAdmin, callerId, "send_email_access_rejected", {
          endpoint: "send-email",
          reason: adminProfile.active !== true ? "inactive" : adminProfile.suspended_at != null ? "suspended" : "archived",
        });
        return new Response(JSON.stringify({ error: "permission_required" }), { status: 403, headers: corsH });
      }

      const { data: aalData, error: aalError } =
        await supabaseAdmin.auth.mfa.getAuthenticatorAssuranceLevel(token);

      if (aalError || !aalData) {
        await auditLog(supabaseAdmin, callerId, "admin_mfa_required", {
          endpoint: "send-email",
          reason: "aal2_required",
          outcome: "mfa_lookup_failed",
        });
        return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
      }

      if (aalData.currentLevel !== "aal2") {
        await auditLog(supabaseAdmin, callerId, "admin_mfa_required", {
          endpoint: "send-email",
          reason: "aal2_required",
          outcome: "aal1_rejected",
        });
        return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
      }
    } else {
      const { data: staffProfile } = await supabaseAdmin
        .from("staff_profiles")
        .select("id, active")
        .eq("id", callerId)
        .eq("active", true)
        .maybeSingle();

      if (!staffProfile) {
        return new Response(JSON.stringify({ error: "permission_required" }), { status: 403, headers: corsH });
      }
    }

    const body: EmailRequest = await req.json();

    if (!body.to || !body.subject) {
      return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400, headers: corsH });
    }

    if (!body.html && !body.text) {
      return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400, headers: corsH });
    }

    const recipients = Array.isArray(body.to) ? body.to : [body.to];
    if (recipients.length > 50) {
      return new Response(JSON.stringify({ error: "recipient_limit_exceeded" }), { status: 400, headers: corsH });
    }

    const payload: Record<string, unknown> = {
      from: body.from || "Digital Footprint <noreply@digital-footprint.uk>",
      to: body.to,
      subject: body.subject,
    };
    if (body.html) payload.html = body.html;
    if (body.text) payload.text = body.text;
    if (body.cc) payload.cc = body.cc;
    if (body.bcc) payload.bcc = body.bcc;
    if (body.reply_to) payload.reply_to = body.reply_to;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "email_send_failed" }), { status: res.status, headers: corsH });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200, headers: corsH });

  } catch (_err) {
    return new Response(JSON.stringify({ error: "service_unavailable" }), { status: 500, headers: corsH });
  }
});

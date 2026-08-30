import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

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

interface TemplateRequest {
  template_id: string;
  to: string;
  variables?: Record<string, string>;
  from?: string;
  cc?: string;
  bcc?: string;
  reply_to?: string;
  subject_prefix?: string;
  subject_override?: string;
  preview_text_override?: string;
}

function renderTemplate(html: string, vars: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
    result = result.replaceAll(`{{ ${key} }}`, value);
  }
  return result;
}

async function auditLog(
  supabaseAdmin: any,
  callerId: string,
  action: string,
  details: Record<string, unknown>,
  success: boolean,
) {
  await supabaseAdmin.from("admin_security_audit_log").insert({
    actor_id: callerId,
    action,
    target_user_id: callerId,
    success,
    details,
    created_at: new Date().toISOString(),
    module: "admin-repair-2",
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

  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: corsH });
  }
  const token = authHeader.replace("Bearer ", "");

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData?.user) {
      return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: corsH });
    }

    const callerId = authData.user.id;

    const { data: profile } = await supabaseAdmin
      .from("admin_profiles")
      .select("role, active, suspended_at, archived_at")
      .eq("id", callerId)
      .maybeSingle();

    if (
      !profile ||
      profile.active !== true ||
      profile.suspended_at != null ||
      profile.archived_at != null ||
      !ALLOWED_ADMIN_ROLES.includes(profile.role)
    ) {
      await auditLog(supabaseAdmin, callerId, "template_email_rejected", {
        reason: "insufficient_privileges",
        endpoint: "send-template-email",
      }, false);
      return new Response(JSON.stringify({ error: "admin_permission_required" }), { status: 403, headers: corsH });
    }

    const { data: aalData, error: aalError } =
      await supabaseAdmin.auth.mfa.getAuthenticatorAssuranceLevel(token);

    if (aalError || !aalData) {
      await auditLog(supabaseAdmin, callerId, "admin_mfa_required", {
        reason: "aal2_required",
        endpoint: "send-template-email",
        outcome: "mfa_lookup_failed",
      }, false);
      return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
    }

    if (aalData.currentLevel !== "aal2") {
      await auditLog(supabaseAdmin, callerId, "admin_mfa_required", {
        reason: "aal2_required",
        endpoint: "send-template-email",
        outcome: "aal1_rejected",
      }, false);
      return new Response(JSON.stringify({ error: "multi_factor_authentication_required" }), { status: 403, headers: corsH });
    }

    const body: TemplateRequest = await req.json();

    if (!body.template_id || !body.to) {
      return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400, headers: corsH });
    }

    const { data: template, error: templateError } = await supabaseUser
      .from("email_templates").select("*").eq("id", body.template_id).maybeSingle();

    if (templateError || !template) {
      return new Response(JSON.stringify({ error: "template_not_found" }), { status: 404, headers: corsH });
    }

    const vars = body.variables || {};
    let renderedSubject: string;
    if (body.subject_override) {
      renderedSubject = (body.subject_prefix || '') + body.subject_override;
    } else {
      renderedSubject = (body.subject_prefix || '') + renderTemplate(template.subject, vars);
    }

    let renderedHtml = renderTemplate(template.html_content, vars);

    if (body.preview_text_override) {
      const previewSpan = `<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${body.preview_text_override}${'\u00A0'.repeat(100)}</span>`;
      renderedHtml = renderedHtml.replace(/<body[^>]*>/i, `$&${previewSpan}`);
    }

    const toList = Array.isArray(body.to) ? body.to : [body.to];
    if (toList.length > 100) {
      return new Response(JSON.stringify({ error: "recipient_limit_exceeded" }), { status: 400, headers: corsH });
    }

    const payload: Record<string, unknown> = {
      from: body.from || "Digital Footprint <noreply@digital-footprint.uk>",
      to: body.to,
      subject: renderedSubject,
      html: renderedHtml,
    };
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
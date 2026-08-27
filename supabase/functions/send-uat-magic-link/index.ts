import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_DOMAIN = Deno.env.get("RESEND_FROM_DOMAIN") || "digital-footprint.uk";
const SITE_URL = Deno.env.get("SITE_URL") || "https://digital-footprint.uk";

const ACTIVE_STATUSES = new Set(["active", "approved"]);

const RATE_MAX = 5;
const RATE_WINDOW_MS = 60_000;
const rateStore = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateStore) if (now > v.resetAt) rateStore.delete(k);
}, 60_000);

function cors(req: Request): HeadersInit {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = origin.startsWith("http") ? origin : "*";
  return {
    "content-type": "application/json",
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "Origin",
  };
}

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(actionLink: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#0f172a;padding:24px 28px;">
      <h2 style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">Digital Footprint</h2>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">UAT TestLab sign-in</p>
    </div>
    <div style="padding:28px;">
      <p style="margin:0 0 14px;color:#0f172a;font-size:15px;line-height:1.6;">Hi,</p>
      <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">
        You requested a secure sign-in link for the Digital Footprint UAT TestLab. Click the button below to sign in. This link is single-use and will expire shortly.
      </p>
      <a href="${esc(actionLink)}" style="display:inline-block;background:#2878d0;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 24px;border-radius:8px;">
        Sign in to UAT TestLab
      </a>
      <p style="margin:22px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;">
        If you did not request this link, you can safely ignore this email.
      </p>
    </div>
    <div style="background:#f8fafc;padding:14px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;">
      Sent automatically by the Digital Footprint UAT TestLab system.
    </div>
  </div>`;
}

async function sendMagicLinkEmail(email: string, actionLink: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `Digital Footprint <noreply@${RESEND_FROM_DOMAIN}>`,
        to: [email],
        subject: "Your UAT TestLab sign-in link",
        html: buildEmailHtml(actionLink),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") {
    return Response.json({ success: false, error: "Method not allowed" }, { status: 405, headers });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (entry && now <= entry.resetAt && entry.count >= RATE_MAX) {
    return Response.json(
      { success: false, error: "Too many requests. Please try again in a minute." },
      { status: 429, headers },
    );
  }
  if (!entry || now > entry.resetAt) rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  else entry.count++;

  const GENERIC_SUCCESS = {
    success: true,
    message: "If an active tester account matches this email, a magic link has been sent.",
  };

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: "Invalid request" }, { status: 400, headers });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 254) {
    return Response.json({ success: false, error: "Please enter a valid email address." }, { status: 400, headers });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
    return Response.json({ success: false, error: "Service unavailable" }, { status: 500, headers });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: tester } = await supabaseAdmin
    .from("uat_testers")
    .select("id, user_id, email, status")
    .ilike("email", email)
    .maybeSingle();

  if (!tester || !ACTIVE_STATUSES.has(tester.status) || !tester.user_id) {
    return Response.json(GENERIC_SUCCESS, { headers });
  }

  let authEmail = email;
  try {
    const { data: authUserData } = await supabaseAdmin.auth.admin.getUserById(tester.user_id);
    if (authUserData?.user?.email) authEmail = authUserData.user.email;
  } catch {
    // fall back to provided email
  }

  const redirectTo = `${SITE_URL}/uat/dashboard`;

  let actionLink: string | null = null;
  try {
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: authEmail,
      options: { redirectTo },
    });
    if (!linkError && linkData?.properties?.action_link) {
      actionLink = linkData.properties.action_link;
    }
  } catch {
    // ignore
  }

  if (!actionLink) {
    return Response.json(GENERIC_SUCCESS, { headers });
  }

  await sendMagicLinkEmail(authEmail, actionLink);

  return Response.json(GENERIC_SUCCESS, { headers });
});
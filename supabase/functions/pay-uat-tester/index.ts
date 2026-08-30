import Stripe from "npm:stripe@22.1.1";
import { createClient } from "npm:@supabase/supabase-js@2.106.2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type StripeMode = "test" | "live";

const LIVE_HOSTS = new Set(["digital-footprint.uk", "www.digital-footprint.uk"]);

const ALLOWED_ADMIN_ROLES = ["owner", "super_admin", "admin"];

const ALLOWED_HOSTS = new Set([
  "digital-footprint.uk",
  "www.digital-footprint.uk",
  "localhost",
  "127.0.0.1",
  "readdy.ai",
]);

function isAllowedHost(hostname: string): boolean {
  return ALLOWED_HOSTS.has(hostname) || hostname.endsWith(".readdy.ai");
}

function cors(req: Request): HeadersInit {
  const origin = req.headers.get("origin") ?? "";
  let allowedOrigin = "https://digital-footprint.uk";
  try {
    const url = new URL(origin);
    if (isAllowedHost(url.hostname)) allowedOrigin = origin;
  } catch {
    // Non-browser requests do not need a reflected Origin.
  }
  return {
    "content-type": "application/json",
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "Origin",
  };
}

function json(req: Request, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: cors(req) });
}

function resolveStripeMode(req: Request): StripeMode {
  const origin = req.headers.get("origin") ?? "";
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    if (LIVE_HOSTS.has(hostname)) return "live";
    if (
      hostname === "readdy.ai" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".readdy.ai")
    ) {
      return "test";
    }
  } catch {
    // Fall through to the safe default.
  }
  return "live";
}

function stripeSecretForMode(mode: StripeMode): string | null {
  const key = mode === "test"
    ? Deno.env.get("STRIPE_UAT_TEST_SECRET_KEY")
    : Deno.env.get("STRIPE_UAT_LIVE_SECRET_KEY");
  return key ? key : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(req) });
  }
  if (req.method !== "POST") return json(req, { error: "Method not allowed" }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json(req, { error: "Tester payments are not configured" }, 503);
  }

  const mode = resolveStripeMode(req);
  const secretKey = stripeSecretForMode(mode);
  if (!secretKey) {
    return json(req, {
      error: `Stripe ${mode} mode is not configured for UAT payments`,
      code: "stripe_mode_not_configured",
      stripe_mode: mode,
    }, 503);
  }

  const authorization = req.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return json(req, { error: "Authentication required" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  const user = userData.user;
  if (userError || !user) return json(req, { error: "Invalid session" }, 401);

  let aalLevel: string | null = null;
  try {
    const { data: aalData, error: aalError } = await admin.auth.mfa.getAuthenticatorAssuranceLevel(token);
    if (aalError || !aalData) {
      return json(req, { error: "Multi-factor authentication could not be verified" }, 403);
    }
    aalLevel = aalData.currentLevel || null;
  } catch {
    return json(req, { error: "Multi-factor authentication could not be verified" }, 403);
  }
  if (aalLevel !== "aal2") {
    return json(req, { error: "Multi-factor authentication is required to pay testers" }, 403);
  }

  const { data: profile } = await admin
    .from("admin_profiles")
    .select("role, active")
    .eq("id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (!profile || !ALLOWED_ADMIN_ROLES.includes(profile.role)) {
    return json(req, { error: "You do not have permission to pay testers" }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Invalid JSON body" }, 400);
  }

  const paymentId = typeof body.payment_id === "string" ? body.payment_id : "";
  if (!paymentId) return json(req, { error: "payment_id is required" }, 400);

  const { data: payment, error: payErr } = await admin
    .from("uat_payments")
    .select("*")
    .eq("id", paymentId)
    .maybeSingle();
  if (payErr || !payment) return json(req, { error: "Reward record not found" }, 404);

  if (payment.status !== "approved") {
    return json(req, { error: "Only an approved reward can be paid" }, 409);
  }

  if (payment.stripe_transfer_id) {
    return json(req, {
      ok: true,
      already_paid: payment.status === "paid",
      payment_id: paymentId,
      stripe_transfer_id: payment.stripe_transfer_id,
      stripe_transfer_status: payment.stripe_transfer_status,
      status: payment.status,
    });
  }

  const amountMinor = Number(payment.reward_amount_minor);
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    return json(req, { error: "Reward amount is invalid" }, 409);
  }
  const currency = String(payment.currency || "GBP").toLowerCase();
  if (currency !== "gbp") {
    return json(req, { error: "Unsupported currency" }, 409);
  }

  const testerId = payment.tester_id as string;
  const { data: tester, error: testerErr } = await admin
    .from("uat_testers")
    .select("id, full_name, stripe_account_id, stripe_account_mode, stripe_transfers_enabled, stripe_payment_setup_status")
    .eq("id", testerId)
    .maybeSingle();
  if (testerErr || !tester) return json(req, { error: "Tester profile not found" }, 404);

  const destination = tester.stripe_account_id as string | null;
  if (!destination) {
    return json(req, { error: "Payment Setup Required", code: "payment_setup_required" }, 409);
  }
  if (tester.stripe_transfers_enabled !== true || tester.stripe_payment_setup_status !== "ready") {
    return json(req, { error: "Stripe Verification Required", code: "stripe_verification_required" }, 409);
  }

  const accountMode = (tester.stripe_account_mode as string | null) ?? null;
  if (accountMode !== mode) {
    return json(req, {
      ok: false,
      error: accountMode === null
        ? "Connected account mode is unknown — please complete onboarding again"
        : "Connected account mode does not match this environment",
      code: accountMode === null ? "stripe_account_mode_unknown" : "stripe_mode_mismatch",
      stripe_mode: mode,
      connected_account_mode: accountMode,
    }, 409);
  }

  const idempotencyKey = `dfp-uat-payment-${paymentId}`;
  const stripe = new Stripe(secretKey);

  let transfer: Stripe.Transfer;
  try {
    transfer = await stripe.transfers.create(
      {
        amount: amountMinor,
        currency: "gbp",
        destination,
        description: "UAT reward payment",
        metadata: {
          uat_payment_id: paymentId,
          uat_assignment_id: payment.assignment_id,
          uat_job_id: payment.job_id,
          tester_id: testerId,
          stripe_mode: mode,
        },
      },
      { idempotencyKey },
    );
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err ? String((err as { code?: unknown }).code) : "unknown";
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: unknown }).message).slice(0, 1000)
        : "Stripe transfer failed";

    console.error(JSON.stringify({
      action: "pay-uat-tester:transfer",
      stripe_type: err && typeof err === "object" && "type" in err ? String((err as { type?: unknown }).type) : "unknown",
      stripe_code: code,
      mode,
    }));

    await admin
      .from("uat_payments")
      .update({
        stripe_transfer_status: "failed",
        stripe_transfer_failure_code: code,
        stripe_transfer_failure_message: message,
        stripe_transfer_idempotency_key: idempotencyKey,
        stripe_last_reconciled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .eq("status", "approved");

    await admin.from("uat_audit_log").insert({
      actor_id: user.id,
      action: "reward_stripe_failed",
      entity_type: "uat_payment",
      entity_id: paymentId,
      previous_value: { status: "approved" },
      new_value: { stripe_transfer_status: "failed", failure_code: code },
    });

    return json(
      req,
      {
        ok: false,
        error: code === "balance_insufficient" ? "Insufficient Stripe platform balance" : "Stripe transfer failed",
        code,
        message,
        stripe_mode: mode,
      },
      502,
    );
  }

  const { error: updErr } = await admin
    .from("uat_payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_transfer_id: transfer.id,
      stripe_connected_account_id: destination,
      stripe_transfer_status: "paid",
      stripe_transfer_created_at: new Date().toISOString(),
      stripe_transfer_idempotency_key: idempotencyKey,
      stripe_transfer_failure_code: null,
      stripe_transfer_failure_message: null,
      stripe_last_reconciled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId)
    .eq("status", "approved")
    .is("stripe_transfer_id", null);

  if (updErr) {
    return json(
      req,
      {
        ok: false,
        error: "Transfer created but recording failed — retry to reconcile",
        code: "db_write_failed",
        stripe_transfer_id: transfer.id,
        stripe_mode: mode,
      },
      502,
    );
  }

  await admin.from("uat_audit_log").insert({
    actor_id: user.id,
    action: "reward_paid_stripe",
    entity_type: "uat_payment",
    entity_id: paymentId,
    previous_value: { status: "approved" },
    new_value: {
      status: "paid",
      stripe_transfer_id: transfer.id,
      stripe_connected_account_id: destination,
      amount_minor: amountMinor,
      currency: "gbp",
    },
  });

  return json(req, {
    ok: true,
    status: "paid",
    payment_id: paymentId,
    stripe_transfer_id: transfer.id,
    stripe_transfer_status: "paid",
    stripe_mode: mode,
  });
});

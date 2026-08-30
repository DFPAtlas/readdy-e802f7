import Stripe from "npm:stripe@22.1.1";
import { createClient } from "npm:@supabase/supabase-js@2.106.2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "https://digital-footprint.uk";

// Stripe v2 API version — must include the named release suffix
const STRIPE_V2_VERSION = "2026-08-26.dahlia";

type StripeMode = "test" | "live";

const LIVE_HOSTS = new Set(["digital-footprint.uk", "www.digital-footprint.uk"]);

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

function trustedOrigin(req: Request): string {
  const origin = (req.headers.get("origin") ?? "").replace(/\/$/, "");
  try {
    const url = new URL(origin);
    if (isAllowedHost(url.hostname)) return origin;
  } catch {
    // No/invalid origin — fall back to SITE_URL.
  }
  return SITE_URL;
}

function cors(req: Request): HeadersInit {
  return {
    "content-type": "application/json",
    "access-control-allow-origin": trustedOrigin(req),
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

function errMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try { return String(err); } catch { return "unknown"; }
}

function countryCode(country: string | null | undefined): string {
  const c = (country || "").toLowerCase();
  if (c.includes("united kingdom") || c.includes("great britain") || c === "uk") return "GB";
  if (c.includes("ireland")) return "IE";
  if (c.includes("united states") || c.includes("usa") || c.includes("america")) return "US";
  if (c.includes("australia")) return "AU";
  if (c.includes("canada")) return "CA";
  if (c.includes("new zealand")) return "NZ";
  if (c.includes("france")) return "FR";
  if (c.includes("germany")) return "DE";
  if (c.includes("spain")) return "ES";
  if (c.includes("italy")) return "IT";
  if (c.includes("netherlands")) return "NL";
  if (c.includes("portugal")) return "PT";
  return "GB";
}

// ---------------------------------------------------------------------------
// Stripe v2 account creation via raw fetch
// Requires Stripe-Version: 2026-08-26.dahlia (or later named release)
// ---------------------------------------------------------------------------
async function createStripeV2Account(
  secretKey: string,
  params: {
    country: string;
    email: string | null;
    tester_id: string;
    display_name: string | null;
    idempotency_key: string;
  }
): Promise<{ id: string; object: string; livemode: boolean; [key: string]: unknown }> {
  const body: Record<string, unknown> = {
    identity: {
      country: params.country.toLowerCase(),
    },
    defaults: {
      responsibilities: {
        fees_collector: "application",
        losses_collector: "application",
      },
    },
    dashboard: "express",
    metadata: {
      tester_id: params.tester_id,
      venture_code: "digital-footprint",
    },
  };

  if (params.email) {
    body.contact_email = params.email;
  }
  if (params.display_name) {
    body.display_name = params.display_name;
  }

  const resp = await fetch("https://api.stripe.com/v2/core/accounts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Stripe-Version": STRIPE_V2_VERSION,
      "Content-Type": "application/json",
      "Idempotency-Key": params.idempotency_key,
    },
    body: JSON.stringify(body),
  });

  const raw = await resp.text();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Stripe v2 returned non-JSON: ${raw.slice(0, 400)}`);
  }

  if (!resp.ok) {
    const errObj = (parsed?.error ?? parsed) as Record<string, unknown> | undefined;
    const msg = (errObj?.message as string) || raw.slice(0, 400);
    const code = (errObj?.code as string) || "unknown";
    const errWithCode = new Error(msg) as Error & { stripeCode?: string; stripeType?: string };
    errWithCode.stripeCode = code;
    errWithCode.stripeType = (errObj?.type as string) || "unknown";
    throw errWithCode;
  }

  return parsed as { id: string; object: string; livemode: boolean; [key: string]: unknown };
}

// ---------------------------------------------------------------------------
// Account links — v1 endpoint still valid for v2-created accounts
// ---------------------------------------------------------------------------
async function createStripeAccountLink(
  secretKey: string,
  params: {
    account: string;
    refresh_url: string;
    return_url: string;
    type: string;
  }
): Promise<{ url: string }> {
  const resp = await fetch("https://api.stripe.com/v1/account_links", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      account: params.account,
      refresh_url: params.refresh_url,
      return_url: params.return_url,
      type: params.type,
    }),
  });

  const raw = await resp.text();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Stripe returned non-JSON for account_links: ${raw.slice(0, 400)}`);
  }

  if (!resp.ok) {
    const errObj = parsed?.error as Record<string, unknown> | undefined;
    const msg = (errObj?.message as string) || raw.slice(0, 400);
    throw new Error(msg);
  }

  return { url: parsed.url as string };
}

interface V1Readiness {
  status: string;
  details_submitted: boolean;
  transfers_enabled: boolean;
  payouts_enabled: boolean;
  requirements_due_count: number;
  requirements_due: { count: number; eventually_due_count: number } | null;
  disabled_reason: string | null;
}

function computeReadiness(account: Stripe.Account): V1Readiness {
  const details = account.details_submitted === true;
  const transfers = account.capabilities?.transfers === "active";
  const payouts = account.payouts_enabled === true;
  const currentlyDue = account.requirements?.currently_due ?? [];
  const eventuallyDue = account.requirements?.eventually_due ?? [];
  const disabledReason = account.requirements?.disabled_reason ?? null;

  let status: string;
  if (disabledReason) status = "restricted";
  else if (transfers && payouts && details) status = "ready";
  else if (details) status = "verification_required";
  else status = "onboarding";

  const count = currentlyDue.length;
  const requirementsDue = count > 0
    ? { count, eventually_due_count: eventuallyDue.length }
    : null;

  return {
    status,
    details_submitted: details,
    transfers_enabled: transfers,
    payouts_enabled: payouts,
    requirements_due_count: count,
    requirements_due: requirementsDue,
    disabled_reason: disabledReason,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(req) });
  }
  if (req.method !== "POST") return json(req, { error: "Method not allowed" }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json(req, { error: "Stripe Connect is not configured" }, 503);
  }

  const mode = resolveStripeMode(req);
  const secretKey = stripeSecretForMode(mode);
  if (!secretKey) {
    return json(req, {
      error: `Stripe ${mode} mode is not configured for UAT`,
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Invalid JSON body" }, 400);
  }

  const action = String(body.action ?? "refresh");

  const { data: tester, error: testerError } = await admin
    .from("uat_testers")
    .select("id, user_id, email, full_name, country, status, stripe_account_id, stripe_account_mode, stripe_payment_setup_status")
    .eq("user_id", user.id)
    .in("status", ["active", "approved"])
    .limit(1)
    .maybeSingle();
  if (testerError || !tester) {
    return json(req, { error: "Approved tester profile not found" }, 403);
  }

  // Use SDK only for platform account verification (v1 reads still work fine)
  const stripe = new Stripe(secretKey);
  const testerId = tester.id as string;

  // Verify platform account and mode
  let platformAccountId = "";
  let actualMode: StripeMode;
  try {
    const platform = await stripe.accounts.retrieve();
    platformAccountId = platform.id;
    actualMode = platform.livemode ? "live" : "test";
  } catch (err) {
    console.error(JSON.stringify({
      action: "uat-stripe-connect:platform_account",
      stripe_message: errMessage(err),
      mode,
    }));
    return json(req, {
      error: "Unable to verify the Stripe platform account",
      code: "stripe_platform_account_error",
      stripe_mode: mode,
    }, 502);
  }

  if (actualMode !== mode) {
    return json(req, {
      error: "Stripe key mode does not match the expected environment",
      code: "stripe_mode_mismatch",
      stripe_mode: mode,
      expected_mode: mode,
      actual_mode: actualMode,
      platform_account_id: platformAccountId,
    }, 500);
  }

  // ------------------------------------------------------------------
  // SETUP / ONBOARD action — create connected account via v2 API
  // ------------------------------------------------------------------
  if (action === "setup" || action === "onboard") {
    let accountId = tester.stripe_account_id as string | null;

    if (!accountId) {
      let account: { id: string; livemode: boolean; [key: string]: unknown };
      try {
        account = await createStripeV2Account(secretKey, {
          country: countryCode(tester.country),
          email: tester.email || user.email || null,
          tester_id: testerId,
          display_name: (tester.full_name as string | null) || null,
          idempotency_key: `dfp-uat-connect-v2-${testerId}`,
        });
      } catch (err) {
        const stripeMessage = errMessage(err);
        const stripeCode = (err as { stripeCode?: string }).stripeCode || "unknown";
        const stripeType = (err as { stripeType?: string }).stripeType || "unknown";
        console.error(JSON.stringify({
          action: "uat-stripe-connect:create_account_v2",
          stripe_type: stripeType,
          stripe_code: stripeCode,
          stripe_message: stripeMessage,
          mode,
          platform_account_id: platformAccountId,
          stripe_version_used: STRIPE_V2_VERSION,
        }));
        return json(req, {
          error: "Unable to create your Stripe account",
          code: stripeCode,
          safe_message: "We couldn't create your payment account. Please try again.",
          stripe_mode: mode,
          stripe_error_message: stripeMessage,
        }, 502);
      }
      accountId = account.id;

      // Persist with null-guard to prevent duplicates
      const { data: guard, error: guardError } = await admin
        .from("uat_testers")
        .update({
          stripe_account_id: account.id,
          stripe_account_mode: mode,
          stripe_payment_setup_status: "onboarding",
          stripe_connect_created_at: new Date().toISOString(),
          stripe_connect_updated_at: new Date().toISOString(),
        })
        .eq("id", testerId)
        .is("stripe_account_id", null)
        .select("id")
        .maybeSingle();

      if (guardError || !guard) {
        // Race condition: another request already wrote — fetch the persisted ID
        const { data: existing } = await admin
          .from("uat_testers")
          .select("stripe_account_id, stripe_account_mode")
          .eq("id", testerId)
          .maybeSingle();
        accountId = (existing?.stripe_account_id as string) || accountId;
      }
    }

    if (!accountId) return json(req, { error: "Unable to create Stripe account" }, 502);

    const returnBase = trustedOrigin(req);
    let link: { url: string };
    try {
      link = await createStripeAccountLink(secretKey, {
        account: accountId,
        refresh_url: `${returnBase}/uat/payments/account`,
        return_url: `${returnBase}/uat/payments/account`,
        type: "account_onboarding",
      });
    } catch (err) {
      const stripeMessage = errMessage(err);
      console.error(JSON.stringify({
        action: "uat-stripe-connect:account_link",
        stripe_message: stripeMessage,
        mode,
      }));
      return json(req, {
        error: "Unable to start Stripe onboarding",
        safe_message: "We couldn't open the Stripe onboarding. Please try again.",
        stripe_mode: mode,
        stripe_error_message: stripeMessage,
      }, 502);
    }

    return json(req, { ok: true, action, url: link.url, account_id: accountId, stripe_mode: mode });
  }

  // ------------------------------------------------------------------
  // MANAGE action — Express dashboard login link
  // ------------------------------------------------------------------
  if (action === "manage") {
    const accountId = tester.stripe_account_id as string | null;
    if (!accountId) return json(req, { error: "No connected account found" }, 404);

    let login: Stripe.LoginLink;
    try {
      login = await stripe.accounts.createLoginLink(accountId);
    } catch (err) {
      console.error(JSON.stringify({
        action: "uat-stripe-connect:login_link",
        stripe_message: errMessage(err),
        mode,
      }));
      return json(req, { error: "Unable to open Stripe dashboard", stripe_mode: mode }, 502);
    }

    return json(req, { ok: true, action, url: login.url, account_id: accountId, stripe_mode: mode });
  }

  // ------------------------------------------------------------------
  // REFRESH action — poll readiness via v1 retrieve (still works fine)
  // ------------------------------------------------------------------
  if (action === "refresh") {
    const accountId = tester.stripe_account_id as string | null;
    if (!accountId) {
      return json(req, {
        ok: true,
        action,
        stripe_mode: mode,
        readiness: {
          status: "not_started",
          details_submitted: false,
          transfers_enabled: false,
          payouts_enabled: false,
          requirements_due_count: 0,
          requirements_due: null,
          disabled_reason: null,
        },
      });
    }

    let account: Stripe.Account;
    try {
      account = await stripe.accounts.retrieve(accountId);
    } catch (err) {
      console.error(JSON.stringify({
        action: "uat-stripe-connect:retrieve_account",
        stripe_message: errMessage(err),
        mode,
      }));
      return json(req, { error: "Unable to read Stripe account status", stripe_mode: mode }, 502);
    }

    const readiness = computeReadiness(account);

    await admin.from("uat_testers").update({
      stripe_onboarding_complete: readiness.status === "ready",
      stripe_details_submitted: readiness.details_submitted,
      stripe_transfers_enabled: readiness.transfers_enabled,
      stripe_payouts_enabled: readiness.payouts_enabled,
      stripe_payment_setup_status: readiness.status,
      stripe_requirements_due: readiness.requirements_due,
      stripe_account_mode: tester.stripe_account_mode ?? mode,
      stripe_connect_updated_at: new Date().toISOString(),
    }).eq("id", testerId);

    return json(req, { ok: true, action, stripe_mode: mode, readiness });
  }

  return json(req, { error: "Unknown action" }, 400);
});

import Stripe from "npm:stripe@22.1.1";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.106.2";
import type { PaymentDatabase } from '../_shared/payment-database.ts';

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type AdminClient = SupabaseClient<PaymentDatabase>;
type PayloadStyle = "snapshot" | "thin_v2";
type VerifiedEnv = "generic" | "uat_test" | "uat_live" | "uat_test_v2" | "uat_live_v2";

function objectId(event: Stripe.Event): string | null {
  const object = event.data.object;
  return typeof object === "object" && object && "id" in object
    ? String(object.id)
    : null;
}

function paymentIntentId(value: string | Stripe.PaymentIntent | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function uatStripeSecretForLivemode(livemode: boolean): string | null {
  const key = livemode
    ? Deno.env.get("STRIPE_UAT_LIVE_SECRET_KEY")
    : Deno.env.get("STRIPE_UAT_TEST_SECRET_KEY");
  return key || null;
}

function uatStripeSecretForMode(mode: "test" | "live"): string | null {
  const key = mode === "test"
    ? Deno.env.get("STRIPE_UAT_TEST_SECRET_KEY")
    : Deno.env.get("STRIPE_UAT_LIVE_SECRET_KEY");
  return key || null;
}

function connectedAccountId(event: Stripe.Event): string | null {
  const explicit = event.account;
  if (explicit && explicit.startsWith("acct_")) return explicit;
  const obj = event.data.object;
  if (obj && typeof obj === "object") {
    const id = 'id' in obj ? obj.id : null;
    if (typeof id === "string" && id.startsWith("acct_")) return id;
    const account = 'account' in obj ? obj.account : null;
    if (typeof account === "string" && account.startsWith("acct_")) return account;
  }
  return null;
}

function accountIdFromThinNotification(
  notification: { related_object?: unknown; context?: unknown },
): string | null {
  // Try related_object.id first
  const ro = notification.related_object;
  if (ro && typeof ro === "object") {
    const record = ro as Record<string, unknown>;
    const id = record["id"];
    if (typeof id === "string" && id.startsWith("acct_")) return id;
    const url = record["url"];
    if (typeof url === "string") {
      const match = url.match(/\/(?:v2\/core\/accounts|accounts)\/(acct_[a-zA-Z0-9_]+)/);
      if (match) return match[1];
    }
  }
  // Fallback to context
  const ctx = notification.context;
  if (typeof ctx === "string" && ctx.startsWith("acct_")) return ctx;
  return null;
}

async function completeInvoicePayment(
  admin: AdminClient,
  session: Stripe.Checkout.Session,
  event: Stripe.Event,
): Promise<void> {
  const invoiceId = session.metadata?.invoice_id || session.metadata?.invoiceId;
  if (!invoiceId) throw new Error("Invoice checkout is missing invoice_id metadata");
  if (session.payment_status !== "paid") {
    throw new Error("Invoice checkout session is not marked paid");
  }
  if ((session.currency ?? "").toLowerCase() !== "gbp") {
    throw new Error("Unexpected invoice checkout currency");
  }
  if (session.amount_total === null || session.currency === null) throw new Error('Checkout amount and currency are required');

  const intentId = paymentIntentId(session.payment_intent);
  if (!intentId) throw new Error("Paid invoice checkout has no PaymentIntent");

  const { error: rpcError } = await admin.rpc("record_stripe_invoice_payment", {
    p_invoice_id: invoiceId,
    p_amount_minor: session.amount_total,
    p_currency: session.currency,
    p_payment_intent_id: intentId,
    p_event_id: event.id,
    p_checkout_session_id: session.id,
    p_paid_at: new Date(event.created * 1000).toISOString(),
  });
  if (rpcError) throw rpcError;
}

async function completeMilestonePayment(
  admin: AdminClient,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const milestoneId = session.metadata?.milestone_id;
  if (!milestoneId) throw new Error("Milestone checkout is missing milestone_id metadata");
  if (session.payment_status !== "paid") {
    throw new Error("Milestone checkout session is not marked paid");
  }
  if ((session.currency ?? "").toLowerCase() !== "gbp") {
    throw new Error("Unexpected milestone checkout currency");
  }
  if (session.amount_total === null || session.currency === null) throw new Error('Checkout amount and currency are required');

  const intentId = paymentIntentId(session.payment_intent);
  if (!intentId) throw new Error("Paid milestone checkout has no PaymentIntent");
  const { error } = await admin.rpc("record_stripe_milestone_payment", {
    p_milestone_id: milestoneId, p_amount_minor: session.amount_total,
    p_currency: session.currency, p_payment_intent_id: intentId,
    p_checkout_session_id: session.id, p_paid_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function completeWebsiteStartingPayment(
  admin: AdminClient, session: Stripe.Checkout.Session, event: Stripe.Event,
): Promise<void> {
  const projectReference = session.metadata?.project_reference;
  if (!projectReference || session.payment_status !== "paid") throw new Error("Invalid paid website session");
  if (session.amount_total === null || session.currency === null) throw new Error('Checkout amount and currency are required');
  const intentId = paymentIntentId(session.payment_intent);
  if (!intentId) throw new Error("Paid website checkout has no PaymentIntent");
  const { error } = await admin.rpc("record_stripe_website_payment", {
    p_project_reference: projectReference, p_amount_minor: session.amount_total,
    p_currency: session.currency, p_payment_intent_id: intentId, p_event_id: event.id,
    p_checkout_session_id: session.id, p_paid_at: new Date(event.created * 1000).toISOString(),
  });
  if (error) throw error;
}

async function recordFailedPayment(
  admin: AdminClient,
  intent: Stripe.PaymentIntent,
  event: Stripe.Event,
): Promise<void> {
  const invoiceId = intent.metadata?.invoice_id;
  if (!invoiceId) return;

  const { data: invoice, error: invoiceError } = await admin
    .from("invoices")
    .select("id, client_id, currency")
    .eq("id", invoiceId)
    .maybeSingle();
  if (invoiceError || !invoice) throw new Error("Failed PaymentIntent invoice was not found");

  const { error: insertError } = await admin.from("payments").insert({
    invoice_id: invoice.id,
    client_id: invoice.client_id,
    amount: Number(intent.amount) / 100,
    currency: String(intent.currency || invoice.currency || "GBP").toUpperCase(),
    payment_date: new Date(event.created * 1000).toISOString(),
    method: "stripe",
    status: "failed",
    provider: "stripe",
    provider_payment_id: intent.id,
    provider_event_id: event.id,
    idempotency_key: `stripe-event:${event.id}`,
    reconciliation_state: "unmatched",
    failure_reason: intent.last_payment_error?.message?.slice(0, 1000) || "Payment failed",
  });
  if (insertError?.code !== "23505" && insertError) throw insertError;
}

async function handlePaymentIntentFailed(
  admin: AdminClient,
  intent: Stripe.PaymentIntent,
): Promise<void> {
  const projectReference = intent.metadata?.project_reference;
  if (!projectReference) return;

  const paymentType = intent.metadata?.payment_type;
  if (paymentType !== "website_starting_payment") return;

  const { data: order, error: orderError } = await admin
    .from("dfp_checkout_orders")
    .select("id, payment_status")
    .eq("project_reference", projectReference)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) throw new Error("Website order not found");

  if (order.payment_status === "paid") return;

  const { error: updateError } = await admin
    .from("dfp_checkout_orders")
    .update({
      payment_status: "payment_failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("payment_status", "pending");

  if (updateError) {
    throw updateError;
  }
}

async function recordRefunds(
  admin: AdminClient,
  charge: Stripe.Charge,
  event: Stripe.Event,
  stripe: Stripe,
): Promise<void> {
  const intentId = paymentIntentId(charge.payment_intent);
  if (!intentId) return;

  const intent = await stripe.paymentIntents.retrieve(intentId);
  const website = intent.metadata?.payment_type === "website_starting_payment";
  const milestoneId = intent.metadata?.milestone_id;
  if (milestoneId) {
    const current = await stripe.charges.retrieve(charge.id);
    const { error } = await admin.rpc("record_stripe_milestone_refund", {
      p_milestone_id: milestoneId, p_payment_intent_id: intentId,
      p_refunded_minor: current.amount_refunded, p_currency: current.currency,
    });
    if (error) throw error;
    return;
  }
  // Ignore payments from other integrations on the same Stripe account.
  if (!website && !intent.metadata?.invoice_id) return;
  // List all refunds; embedded charge.refunds can be truncated.
  for await (const refund of stripe.refunds.list({ charge: charge.id, limit: 100 })) {
    if (refund.status !== "succeeded") continue;

    const { error: rpcError } = website
      ? await admin.rpc("record_stripe_website_refund", {
        p_payment_intent_id: intentId, p_event_id: event.id, p_refund_id: refund.id,
        p_amount_minor: refund.amount, p_currency: refund.currency,
        p_refunded_at: new Date(refund.created * 1000).toISOString(),
      })
      : await admin.rpc("record_stripe_refund", {
      p_payment_intent_id: intentId,
      p_event_id: event.id,
      p_refund_id: refund.id,
      p_amount_minor: refund.amount,
      p_currency: refund.currency,
      p_reason: refund.reason || "requested_by_customer",
      p_refunded_at: new Date(refund.created * 1000).toISOString(),
    });
    if (rpcError) throw rpcError;
  }
}

async function syncConnectedAccount(
  admin: AdminClient,
  stripe: Stripe,
  accountId: string,
): Promise<void> {
  if (!accountId || !accountId.startsWith("acct_")) return;

  const account = await stripe.accounts.retrieve(accountId);
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

  const dueCount = currentlyDue.length;
  const requirementsDue = dueCount > 0
    ? { count: dueCount, eventually_due_count: eventuallyDue.length }
    : null;

  const { data: tester, error: testerError } = await admin
    .from("uat_testers")
    .select("id")
    .eq("stripe_account_id", accountId)
    .limit(1)
    .maybeSingle();
  if (testerError) throw testerError;
  if (!tester) return;

  const { error: updateError } = await admin
    .from("uat_testers")
    .update({
      stripe_onboarding_complete: status === "ready",
      stripe_details_submitted: details,
      stripe_transfers_enabled: transfers,
      stripe_payouts_enabled: payouts,
      stripe_payment_setup_status: status,
      stripe_requirements_due: requirementsDue,
      stripe_connect_updated_at: new Date().toISOString(),
    })
    .eq("id", tester.id);
  if (updateError) throw updateError;
}

async function reconcileUatTransfer(
  admin: AdminClient,
  transfer: Stripe.Transfer,
): Promise<void> {
  const paymentId = transfer.metadata?.uat_payment_id ?? null;
  const transferId = transfer.id;
  if (!transferId) return;

  let query = admin
    .from("uat_payments")
    .select("id, status, stripe_transfer_id")
    .limit(1);
  if (paymentId) {
    query = query.eq("id", paymentId);
  } else {
    query = query.eq("stripe_transfer_id", transferId);
  }
  const { data: payment, error } = await query.maybeSingle();
  if (error) throw error;
  if (!payment) return;

  if (transfer.reversed === true) {
    const { error: reversalError } = await admin
      .from("uat_payments")
      .update({
        stripe_transfer_status: "reversed",
        stripe_transfer_failure_code: "reversed",
        stripe_transfer_failure_message: "Transfer was reversed",
        stripe_last_reconciled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (reversalError) throw reversalError;
    const { error: auditError } = await admin.from("uat_audit_log").insert({
      action: "reward_transfer_reversed",
      entity_type: "uat_payment",
      entity_id: payment.id,
      new_value: { stripe_transfer_id: transferId, stripe_transfer_status: "reversed" },
    });
    if (auditError) throw auditError;
    return;
  }

  const { error: transferError } = await admin
    .from("uat_payments")
    .update({
      stripe_transfer_id: transferId,
      stripe_transfer_status: "paid",
      stripe_connected_account_id: typeof transfer.destination === "string" ? transfer.destination : transfer.destination?.id ?? null,
      stripe_transfer_created_at: new Date(transfer.created * 1000).toISOString(),
      stripe_last_reconciled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  if (transferError) throw transferError;
  if (payment.status === "approved") {
    const { error: paidError } = await admin
      .from("uat_payments")
      .update({
        status: "paid",
        paid_at: new Date(transfer.created * 1000).toISOString(),
      })
      .eq("id", payment.id)
      .eq("status", "approved");
    if (paidError) throw paidError;
  }
}

// --- Thin event handling ---

async function handleThinEvent(
  admin: AdminClient,
  notification: { id: string; type: string; related_object?: unknown; context?: unknown; fetchRelatedObject?: () => Promise<unknown> },
  verifiedEnv: VerifiedEnv,
): Promise<string | null> {
  const eventType = notification.type;
  const eventId = notification.id;

  // Resolve account ID from notification without fetching first
  let accountId: string | null = accountIdFromThinNotification(notification);

  // Fallback: fetch related object and extract ID
  if (!accountId && notification.fetchRelatedObject) {
    try {
      const relatedObject = await notification.fetchRelatedObject();
      accountId = accountIdFromThinNotification({ related_object: relatedObject });
    } catch (err) {
      console.error("Failed to fetch related object for thin event", {
        eventId,
        eventType,
        error: err instanceof Error ? err.message : String(err),
      });
      throw new Error("Failed to resolve related account for thin event");
    }
  }

  if (!accountId || !accountId.startsWith("acct_")) {
    throw new Error("Thin event did not resolve a valid account ID");
  }

  // Determine mode from which v2 secret verified the notification
  let mode: "test" | "live" | null = null;
  if (verifiedEnv === "uat_test_v2") mode = "test";
  else if (verifiedEnv === "uat_live_v2") mode = "live";

  if (!mode) {
    throw new Error("Thin event verified but mode could not be determined");
  }

  // Find matching UAT tester
  const { data: tester, error: testerError } = await admin
    .from("uat_testers")
    .select("id, stripe_account_id, stripe_account_mode")
    .eq("stripe_account_id", accountId)
    .limit(1)
    .maybeSingle();

  if (testerError) throw testerError;

  if (!tester) {
    // Non-UAT account — safely ignore
    console.log("Thin event for non-UAT account, ignoring", { accountId, eventType, eventId });
    return accountId;
  }

  // Mode safety: verify tester mode matches the event mode
  if (tester.stripe_account_mode !== mode) {
    console.error("Stripe account mode mismatch for thin event", {
      eventId,
      accountId,
      testerMode: tester.stripe_account_mode,
      eventMode: mode,
    });
    throw new Error("stripe_account_mode_mismatch");
  }

  // Handle account.closed
  if (eventType === "v2.core.account.closed") {
    const { error: closeError } = await admin.from("uat_testers").update({
      stripe_onboarding_complete: false,
      stripe_transfers_enabled: false,
      stripe_payouts_enabled: false,
      stripe_payment_setup_status: "disabled",
      stripe_connect_updated_at: new Date().toISOString(),
    }).eq("id", tester.id);
    if (closeError) throw closeError;
    return accountId;
  }

  // For requirements.updated and capability_status_updated, refresh from Stripe
  if (
    eventType === "v2.core.account[requirements].updated" ||
    eventType === "v2.core.account[configuration.recipient].capability_status_updated"
  ) {
    const uatSecret = uatStripeSecretForMode(mode);
    if (!uatSecret) {
      throw new Error(`UAT Stripe ${mode} secret not configured`);
    }
    const uatStripe = new Stripe(uatSecret);
    await syncConnectedAccount(admin, uatStripe, accountId);
    return accountId;
  }

  return accountId;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("stripe-webhook missing required secrets");
    return Response.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  // --- Signature verification: snapshot first, then thin v2 ---
  const snapshotSecrets = [
    { secret: STRIPE_WEBHOOK_SECRET, env: "generic" as VerifiedEnv },
    { secret: Deno.env.get("STRIPE_UAT_TEST_CONNECT_WEBHOOK_SECRET"), env: "uat_test" as VerifiedEnv },
    { secret: Deno.env.get("STRIPE_UAT_LIVE_CONNECT_WEBHOOK_SECRET"), env: "uat_live" as VerifiedEnv },
  ].filter((s): s is { secret: string; env: VerifiedEnv } => Boolean(s.secret));

  const v2Secrets = [
    { secret: Deno.env.get("STRIPE_UAT_TEST_V2_WEBHOOK_SECRET"), env: "uat_test_v2" as VerifiedEnv },
    { secret: Deno.env.get("STRIPE_UAT_LIVE_V2_WEBHOOK_SECRET"), env: "uat_live_v2" as VerifiedEnv },
  ].filter((s): s is { secret: string; env: VerifiedEnv } => Boolean(s.secret));

  const cryptoProvider = Stripe.createSubtleCryptoProvider();

  let event: Stripe.Event | null = null;
  let notification: { id: string; type: string; related_object?: unknown; context?: unknown; fetchRelatedObject?: () => Promise<unknown> } | null = null;
  let payloadStyle: PayloadStyle | null = null;
  let verifiedEnv: VerifiedEnv | null = null;

  // Try snapshot secrets first (existing billing + UAT v1 transfers)
  for (const { secret, env } of snapshotSecrets) {
    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        secret,
        undefined,
        cryptoProvider,
      );
      payloadStyle = "snapshot";
      verifiedEnv = env;
      break;
    } catch {
      // Try next configured snapshot secret
    }
  }

  // Try v2 thin event secrets
  if (!event) {
    for (const { secret, env } of v2Secrets) {
      try {
        notification = await stripe.parseEventNotificationAsync(
          rawBody,
          signature,
          secret,
          undefined,
          cryptoProvider,
        );
        payloadStyle = "thin_v2";
        verifiedEnv = env;
        break;
      } catch {
        // Try next configured v2 secret
      }
    }
  }

  if (!event && !notification) {
    console.error("Stripe signature verification failed against all configured webhook secrets");
    return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const admin = createClient<PaymentDatabase>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const eventId = event?.id ?? notification?.id ?? "unknown";
  const eventType = event?.type ?? notification?.type ?? "unknown";

  // Determine connected_account_id for ledger
  let ledgerConnectedAccountId: string | null = null;
  if (event) {
    ledgerConnectedAccountId = connectedAccountId(event);
  } else if (notification) {
    ledgerConnectedAccountId = accountIdFromThinNotification(notification);
  }

  const processingToken = crypto.randomUUID();
  const { data: claim, error: claimError } = await admin.rpc("claim_stripe_webhook", {
    p_event_id: eventId, p_event_type: eventType,
    p_object_id: event ? objectId(event) : null,
    p_connected_account_id: ledgerConnectedAccountId, p_token: processingToken,
  });
  if (claimError) return Response.json({ error: "Unable to claim webhook" }, { status: 500 });
  if (claim === "processed") return Response.json({ received: true, duplicate: true });
  if (claim !== "claimed") return Response.json({ error: "Webhook is processing; retry later" }, { status: 500 });

  try {
    if (event && payloadStyle === "snapshot") {
      // --- Existing snapshot event handling (unchanged) ---
      if (verifiedEnv !== "generic" && !["account.updated", "capability.updated", "transfer.created", "transfer.updated", "transfer.reversed"].includes(event.type)) {
        throw new Error("Billing event received on a Connect-only signing secret");
      }
      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded": {
          const session = await stripe.checkout.sessions.retrieve((event.data.object as Stripe.Checkout.Session).id);
          if (session.payment_status !== "paid") {
            break;
          }
          const type = session.metadata?.type;
          if (type === "website_starting_payment") {
            await completeWebsiteStartingPayment(admin, session, event);
          } else if (type === "invoice_payment" || session.metadata?.invoice_id) {
            await completeInvoicePayment(admin, session, event);
          } else if (type === "milestone_payment") {
            await completeMilestonePayment(admin, session);
          }
          break;
        }
        case "checkout.session.expired": {
          const session = event.data.object as Stripe.Checkout.Session;
          const projectReference = session.metadata?.project_reference;
          const type = session.metadata?.type;
          if (type === "website_starting_payment" && projectReference) {
            const { error: updateError } = await admin
              .from("dfp_checkout_orders")
              .update({
                payment_status: "cancelled",
                updated_at: new Date().toISOString(),
              })
              .eq("project_reference", projectReference)
              .eq("payment_status", "pending");
            if (updateError) throw updateError;
          }
          break;
        }
        case "payment_intent.payment_failed": {
          const intent = event.data.object as Stripe.PaymentIntent;
          await handlePaymentIntentFailed(admin, intent);
          await recordFailedPayment(admin, intent, event);
          break;
        }
        case "charge.refunded": {
          await recordRefunds(admin, event.data.object as Stripe.Charge, event, stripe);
          break;
        }
        case "account.updated": {
          const account = event.data.object as Stripe.Account;
          const uatSecret = uatStripeSecretForLivemode(event.livemode);
          if (!uatSecret) throw new Error("UAT Stripe secret is not configured");
          await syncConnectedAccount(admin, new Stripe(uatSecret), account.id);
          break;
        }
        case "capability.updated": {
          const capability = event.data.object as Stripe.Capability;
          const accountId =
            typeof capability.account === "string" && capability.account.startsWith("acct_")
              ? capability.account
              : (event.account ?? null);
          if (!accountId || !accountId.startsWith("acct_")) break;
          const uatSecret = uatStripeSecretForLivemode(event.livemode);
          if (!uatSecret) throw new Error("UAT Stripe secret is not configured");
          await syncConnectedAccount(admin, new Stripe(uatSecret), accountId);
          break;
        }
        case "transfer.created":
        case "transfer.updated":
        case "transfer.reversed": {
          const secret = uatStripeSecretForLivemode(event.livemode);
          if (!secret) throw new Error("UAT Stripe secret is not configured");
          const current = await new Stripe(secret).transfers.retrieve((event.data.object as Stripe.Transfer).id);
          await reconcileUatTransfer(admin, current);
          break;
        }
        default:
          break;
      }
    } else if (notification && payloadStyle === "thin_v2") {
      // --- Thin v2 event handling ---
      const thinEventType = notification.type;
      if (
        thinEventType === "v2.core.account.closed" ||
        thinEventType === "v2.core.account[requirements].updated" ||
        thinEventType === "v2.core.account[configuration.recipient].capability_status_updated"
      ) {
        await handleThinEvent(admin, notification, verifiedEnv!);
      }
    }

    // Mark processed
    const { data: processed, error: processedError } = await admin
      .from("stripe_webhook_events")
      .update({
        status: "processed",
        processed_at: new Date().toISOString(),
        error_message: null,
        lease_expires_at: null,
      })
      .eq("event_id", eventId).eq("processing_token", processingToken)
      .select("event_id").maybeSingle();
    if (processedError || !processed) throw processedError || new Error("Webhook lease lost");

    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook processing error";
    await admin
      .from("stripe_webhook_events")
      .update({
        status: "failed",
        processed_at: new Date().toISOString(),
        error_message: message.slice(0, 2000),
        lease_expires_at: null,
      })
      .eq("event_id", eventId).eq("processing_token", processingToken);
    console.error("Stripe webhook processing failed", {
      eventId,
      eventType,
      payloadStyle,
      verifiedEnv,
      message,
    });

    const alertTitle = `Stripe webhook failed: ${eventType}`;
    const { data: existingAlert } = await admin
      .from("digital_footprint_alerts")
      .select("id")
      .eq("source", "payment")
      .eq("title", alertTitle)
      .eq("is_resolved", false)
      .maybeSingle();
    if (!existingAlert) {
      await admin.from("digital_footprint_alerts").insert({
        alert_type: "critical",
        title: alertTitle,
        description: `Event ${eventId} failed to process and payment/refund recording may be incomplete. ${message.slice(0, 300)}`,
        source: "payment",
        is_read: false,
        is_resolved: false,
      });
    }

    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
});

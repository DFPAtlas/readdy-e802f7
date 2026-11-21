// Dry-run by default. Use backend secrets from the Digital Footprint Stripe
// account and matching Supabase project; never expose them to browser code.
import Stripe from 'npm:stripe@22.1.1';
import { createClient } from 'npm:@supabase/supabase-js@2.106.2';
import type { PaymentDatabase } from '../functions/_shared/payment-database.ts';

const required = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is required`);
  return value;
};
const apply = Deno.args.includes('--apply');
const stripe = new Stripe(required('STRIPE_SECRET_KEY'));
const admin = createClient<PaymentDatabase>(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false },
});
let offset = 0;
let failures = 0;
while (true) {
  const { data: orders, error } = await admin.from('dfp_checkout_orders')
    .select('project_reference, stripe_checkout_session_id, starting_payment_minor, currency')
    .in('payment_status', ['paid', 'partially_refunded', 'refunded'])
    .order('id').range(offset, offset + 99);
  if (error) throw error;
  for (const order of orders) {
    try {
      if (!order.stripe_checkout_session_id) throw new Error('Missing Checkout session ID; manual review required');
      const session = await stripe.checkout.sessions.retrieve(order.stripe_checkout_session_id);
      const intentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
      if (session.payment_status !== 'paid' || session.metadata?.type !== 'website_starting_payment' ||
        session.metadata?.project_reference !== order.project_reference || !intentId ||
        session.amount_total !== order.starting_payment_minor || session.currency !== order.currency.toLowerCase()) {
        throw new Error('Stripe state does not match the order; no changes made');
      }
      const intent = await stripe.paymentIntents.retrieve(intentId, { expand: ['latest_charge'] });
      const charge = intent.latest_charge;
      if (intent.status !== 'succeeded' || typeof charge !== 'object' || !charge?.paid) throw new Error('A successful charge could not be verified');
      const eventId = `reconcile:${session.id}`;
      console.log(`${order.project_reference}: verified ${session.livemode ? 'live' : 'test'} payment; ${apply ? 'reconciling' : 'dry-run only'}`);
      if (!apply) continue;
      const { error: paymentError } = await admin.rpc('record_stripe_website_payment', {
        p_project_reference: order.project_reference, p_amount_minor: order.starting_payment_minor,
        p_currency: order.currency, p_payment_intent_id: intentId, p_event_id: eventId,
        p_checkout_session_id: session.id, p_paid_at: new Date(charge.created * 1000).toISOString(),
      });
      if (paymentError) throw paymentError;
      for await (const refund of stripe.refunds.list({ charge: charge.id, limit: 100 })) {
        if (refund.status !== 'succeeded') continue;
        const { error: refundError } = await admin.rpc('record_stripe_website_refund', {
          p_payment_intent_id: intentId, p_refund_id: refund.id, p_event_id: eventId,
          p_amount_minor: refund.amount, p_currency: refund.currency,
          p_refunded_at: new Date(refund.created * 1000).toISOString(),
        });
        if (refundError) throw refundError;
      }
    } catch (error) {
      failures++;
      console.error(`${order.project_reference}: ${error instanceof Error ? error.message : 'Reconciliation failed; inspect server logs'}`);
    }
  }
  if (orders.length < 100) break;
  offset += 100;
}
if (failures) Deno.exit(1);

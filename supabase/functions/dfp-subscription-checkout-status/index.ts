import Stripe from 'npm:stripe@22.1.1';

// A Checkout return URL is an untrusted navigation event. Read only verified
// Stripe state; never return customer details or grant access from query data.
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const site = Deno.env.get('SITE_URL') || 'https://digital-footprint.uk';
  let allowed = site;
  try {
    const url = new URL(origin);
    if (['digital-footprint.uk', 'www.digital-footprint.uk', 'localhost', '127.0.0.1'].includes(url.hostname) || url.hostname.endsWith('.readdy.ai')) allowed = origin;
  } catch { /* Non-browser requests do not need a reflected origin. */ }
  const headers = { 'access-control-allow-origin': allowed, 'cache-control': 'no-store', vary: 'Origin' };
  const json = (body: unknown, status = 200) => Response.json(body, { status, headers });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) return json({ error: 'Payment service is not configured' }, 503);
  const sessionId = new URL(req.url).searchParams.get('session_id') || '';
  if (!/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(sessionId)) return json({ error: 'Checkout not found' }, 404);
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription'] });
    if (session.mode !== 'subscription' || session.metadata?.type !== 'subscription_checkout' ||
      session.metadata?.venture_code !== 'digital-footprint') return json({ error: 'Checkout not found' }, 404);
    const subscription = session.subscription;
    const active = session.payment_status === 'paid' && typeof subscription === 'object' && subscription?.status === 'active';
    return json({ status: active ? 'active' : 'processing' });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError && error.code === 'resource_missing') return json({ error: 'Checkout not found' }, 404);
    return json({ error: 'Payment status is temporarily unavailable' }, 503);
  }
});

const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const Stripe = require('stripe');
const secret = 'whsec_test_only_webhook_repair';
const session = { id: 'cs_test_receipt', payment_status: 'paid', currency: 'gbp', amount_total: 74750,
  payment_intent: 'pi_receipt', metadata: { type: 'website_starting_payment', project_reference: 'DFP-2026-TESTAA' } };
function handler({ claim = 'claimed', rpcError = null } = {}) {
  let call; let dbCalls = 0; const calls = [];
  class TestStripe extends Stripe {
    constructor(key) {
      super(key);
      this.checkout.sessions.retrieve = async () => session;
    }
  }
  const db = {
    async rpc(name, args) {
      calls.push({ name, args });
      return { data: name === 'claim_stripe_webhook' ? claim : null, error: name === 'record_stripe_website_payment' ? rpcError : null };
    },
    from(table) {
      const chain = { update(values) { calls.push({ table, values }); return chain; },
        insert() { return chain; }, select() { return chain; }, eq() { return chain; },
        async maybeSingle() { return { data: { event_id: 'evt_test', id: 'alert' }, error: null }; },
        then(resolve, reject) { return Promise.resolve({ data: null, error: null }).then(resolve, reject); } };
      return chain;
    },
  };
  const source = readFileSync(require('node:path').join(__dirname, '../supabase/functions/stripe-webhook/index.ts'), 'utf8').replace(/^import .*;\r?\n/gm, '');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText, {
    Deno: { env: { get: key => ({ STRIPE_SECRET_KEY: 'sk_test_fake', STRIPE_WEBHOOK_SECRET: secret, SUPABASE_URL: 'https://example.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test_only' })[key] }, serve: fn => { call = fn; } },
    Stripe: TestStripe, createClient() { dbCalls++; return db; }, Request, Response, TextEncoder, crypto: globalThis.crypto,
    console: { error() {}, log() {} },
  });
  return { call, calls, dbCalls: () => dbCalls };
}
function signedRequest(signature) {
  const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed', created: Math.floor(Date.now()/1000), data: { object: session } }, null, 2);
  return new Request('https://example.invalid', { method: 'POST', body: payload,
    headers: { 'stripe-signature': signature || Stripe.webhooks.generateTestHeaderString({ payload, secret }) } });
}
test('missing or invalid signatures return 400 before any database access', async () => {
  for (const request of [new Request('https://example.invalid', { method: 'POST', body: '{}' }), signedRequest('t=1,v1=bad')]) {
    const h = handler(); assert.equal((await h.call(request)).status, 400); assert.equal(h.dbCalls(), 0);
  }
});
test('a real SDK signature over the raw body records the current paid session', async () => {
  const h = handler(); assert.equal((await h.call(signedRequest())).status, 200);
  assert.equal(h.calls.find(c => c.name === 'record_stripe_website_payment').args.p_amount_minor, 74750);
  assert.ok(h.calls.some(c => c.values?.status === 'processed'));
});
test('duplicate delivery does not perform a second payment mutation', async () => {
  const h = handler({ claim: 'processed' }); assert.equal((await h.call(signedRequest())).status, 200);
  assert.equal(h.calls.filter(c => c.name === 'record_stripe_website_payment').length, 0);
});
test('transient payment failures return 500 and retain retryable failed state', async () => {
  const h = handler({ rpcError: { message: 'Database unavailable' } });
  assert.equal((await h.call(signedRequest())).status, 500);
  assert.ok(h.calls.some(c => c.values?.status === 'failed'));
  assert.ok(!h.calls.some(c => c.values?.status === 'processed'));
});
test('a busy claim returns 500 to request retry instead of losing the event', async () => {
  const h = handler({ claim: 'busy' }); assert.equal((await h.call(signedRequest())).status, 500);
});

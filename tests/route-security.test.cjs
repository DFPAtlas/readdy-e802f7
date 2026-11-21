const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest, NextResponse } = require('next/server');
const path = require('node:path');
function moduleFrom(file, requires = {}, globals = {}) {
  const exports = {};
  const source = readFileSync(path.join(__dirname, '..', file), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, require: name => requires[name] || require(name), ...globals });
  return exports;
}
function gate({ user = null, profile = null, aal = 'aal2', membership = null } = {}) {
  let checks = 0;
  const client = {
    auth: { async getUser() { checks++; return { data: { user }, error: user ? null : new Error('Invalid token') }; },
      mfa: { async getAuthenticatorAssuranceLevel() { return { data: { currentLevel: aal, nextLevel: 'aal2' }, error: null }; } } },
    from() { const q = { select() { return q; }, eq() { return q; }, async maybeSingle() { return { data: profile, error: null }; } }; return q; },
    async rpc() { return { data: membership, error: null }; },
  };
  const { middleware } = moduleFrom('middleware.ts', {
    '@supabase/ssr': { createServerClient: () => client }, 'next/server': { NextResponse },
    '@/lib/admin-roles': moduleFrom('lib/admin-roles.ts'), '@/lib/route-access': moduleFrom('lib/route-access.ts'),
  }, { process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.invalid', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-test-only' } } });
  return { checks: () => checks, async request(route) {
    return middleware(new NextRequest(`https://digital-footprint.uk${route}`, { headers: { cookie: 'forged-user-id=admin' } }));
  } };
}
test('protected routes redirect an unverified session before rendering', async () => {
  for (const [route, login] of [['/admin','/admin/login'],['/staff/dashboard','/staff/login'],['/portal/invoices','/portal/login'],['/uat/dashboard','/uat/login'],['/pbx/dashboard','/portal/login']]) {
    const g = gate(); const response = await g.request(route);
    assert.equal(response.status, 307); assert.equal(new URL(response.headers.get('location')).pathname, login);
    assert.equal(g.checks(), 1); assert.match(response.headers.get('cache-control'), /no-store/);
  }
});
test('public callbacks, login, health, webhooks and public token links never hit session checks', async () => {
  const g = gate();
  for (const route of ['/admin/login','/portal/login','/auth/callback','/api/health','/api/stripe/webhook','/email/review/token']) assert.equal((await g.request(route)).status,200);
  assert.equal(g.checks(),0);
});
test('a login-looking prefix does not bypass the protected-area check', async () => {
  const g = gate(); assert.equal((await g.request('/admin/login-secret')).status,307); assert.equal(g.checks(),1);
});
test('admin and portal authorization fail closed for ordinary users', async () => {
  assert.equal((await gate({ user: { id: 'user' }, profile: { role: 'staff', active: true } }).request('/admin')).status,403);
  assert.equal((await gate({ user: { id: 'user' }, membership: { has_access: false } }).request('/portal/invoices')).status,403);
});
test('admin MFA redirects once to a reachable authenticated challenge', async () => {
  const g = gate({ user: { id: 'admin' }, profile: { role: 'admin', active: true }, aal: 'aal1' });
  const response = await g.request('/admin'); assert.equal(new URL(response.headers.get('location')).pathname,'/admin/mfa');
  assert.equal((await g.request('/admin/mfa')).status,200);
});
test('legacy sessions migrate into chunked cookies and logout removes every chunk', async () => {
  const values = new Map(); const legacy = new Map([['sb-example-auth-token', JSON.stringify({ access_token: 'x'.repeat(8000) })]]);
  const document = {};
  Object.defineProperty(document, 'cookie', { get: () => [...values].map(([k,v]) => `${k}=${v}`).join('; '), set: text => {
    const [pair] = text.split(';'); const index=pair.indexOf('='); const key=pair.slice(0,index), value=pair.slice(index+1);
    if (/Max-Age=0/i.test(text)) values.delete(key); else values.set(key,value);
  } });
  const { createCookieSessionStorage } = moduleFrom('lib/auth-storage.ts', {}, { document, location: { protocol:'https:' } });
  const storage = createCookieSessionStorage({ getItem: k => legacy.get(k) || null, removeItem: k => legacy.delete(k), setItem: (k,v) => legacy.set(k,v) });
  const initial = legacy.get('sb-example-auth-token'); assert.equal(await storage.getItem('sb-example-auth-token'),initial);
  assert.equal(legacy.size,0); assert.ok(values.size>1); assert.equal(await storage.getItem('sb-example-auth-token'),initial);
  await storage.removeItem('sb-example-auth-token'); assert.equal(values.size,0); assert.equal(await storage.getItem('sb-example-auth-token'),null);
});

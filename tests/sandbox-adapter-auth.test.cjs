const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

for (const name of ['email', 'sms', 'webhook']) {
  function loadHandler(secret) {
    let handler;
    let privilegedCalls = 0;
    const source = readFileSync(path.join(__dirname, '..', 'supabase', 'functions', `uat-sandbox-${name}`, 'index.ts'), 'utf8')
      .replace(/^import .*;\r?\n/gm, '');
    const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
    vm.runInNewContext(compiled, {
      serve: fn => { handler = fn; },
      Deno: { env: { get: key => ({ SUPABASE_URL: 'https://example.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-only', UAT_PROJECT_ADAPTER_SECRET: secret })[key] } },
      createClient: () => { privilegedCalls++; throw new Error('Unexpected privileged database call'); },
      Request, Response, crypto: globalThis.crypto, TextEncoder, Uint8Array, atob, btoa,
      console: { error() {}, log() {} },
    });
    return { call: handler, privilegedCalls: () => privilegedCalls };
  }

  test(`${name}: missing signing secret fails before privileged access`, async () => {
    const handler = loadHandler(undefined);
    const response = await handler.call(new Request('https://example.invalid', { method: 'POST', headers: { 'X-Sandbox-Adapter-Token': 'Bearer fake.token.signature' }, body: '{}' }));
    assert.ok(response.status >= 500);
    assert.equal(handler.privilegedCalls(), 0);
  });

  test(`${name}: invalid signature is rejected before privileged access`, async () => {
    const handler = loadHandler('a-fresh-test-only-signing-secret');
    const token = `${btoa('{"alg":"HS256"}')}.${btoa('{"project_id":"test","sandbox_instance_id":"test"}')}.${btoa('forged')}`;
    const response = await handler.call(new Request('https://example.invalid', { method: 'POST', headers: { 'X-Sandbox-Adapter-Token': `Bearer ${token}` }, body: '{}' }));
    assert.equal(response.status, 401);
    assert.equal(handler.privilegedCalls(), 0);
  });
}

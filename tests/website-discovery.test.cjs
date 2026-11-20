const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const source = readFileSync(path.join(__dirname, '..', 'lib', 'website-discovery.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const loaded = { exports: {} };
new Function('module', 'exports', compiled)(loaded, loaded.exports);
const { DISCOVERY_PARTS, DISCOVERY_VERSION, DISCOVERY_DRAFT_LIFETIME, DISCOVERY_ANSWER_LIMIT, answeredDiscoveryQuestions, buildDiscoveryPayload, readDiscoveryDraft } = loaded.exports;

test('a complete brief retains all 26 answers in question order, including the last part', () => {
  const answers = Object.fromEntries(Array.from({ length: 26 }, (_, i) => [i + 1, { choices: [], text: `Answer ${i + 1}\nMore detail` }]));
  const payload = buildDiscoveryPayload(answers, { name: ' Jane Smith ', email: ' jane@example.com ', company: ' Example Ltd ' });
  assert.equal(DISCOVERY_PARTS.length, 6);
  assert.equal(answeredDiscoveryQuestions(answers), 26);
  assert.equal(payload.name, 'Jane Smith');
  assert.equal(payload.email, 'jane@example.com');
  assert.match(payload.initial_message, /Business: Example Ltd/);
  assert.equal(payload.budget_range, 'To discuss');
  assert.equal(payload.ecommerce, undefined, 'do not infer purchases or technical requirements from visual preferences');
  let previousPosition = -1;
  for (let i = 1; i <= 26; i++) {
    const position = payload.additional_notes.indexOf(`Answer ${i}\nMore detail`);
    assert.ok(position > previousPosition, `Answer ${i} must be present in order`);
    previousPosition = position;
  }
});

test('skipped questions are explicit and do not count as answers', () => {
  const answers = { 1: { choices: ['Cosy and welcoming'], text: '  ' }, 2: { choices: [], text: '  ' }, 999: { choices: [], text: 'unknown question' } };
  const payload = buildDiscoveryPayload(answers, { name: 'Jane', email: 'jane@example.com', company: '' });
  assert.equal(answeredDiscoveryQuestions(answers), 1);
  assert.match(payload.additional_notes, /Cosy and welcoming/);
  assert.equal((payload.additional_notes.match(/Not answered/g) || []).length, 25);
  assert.doesNotMatch(payload.additional_notes, /unknown question/);
});

test('draft restoration rejects malformed, obsolete, expired and future-dated drafts', () => {
  const now = 1800000000000;
  const draft = { version: DISCOVERY_VERSION, savedAt: now, answers: {}, step: 2 };
  for (const raw of [null, '{', 'null', JSON.stringify({ ...draft, version: 0 }), JSON.stringify({ ...draft, savedAt: now - DISCOVERY_DRAFT_LIFETIME }), JSON.stringify({ ...draft, savedAt: now + 1 }), JSON.stringify({ ...draft, answers: [] })]) {
    assert.equal(readDiscoveryDraft(raw, now), null);
  }
});

test('draft restoration limits text and choice values without restoring contact or consent', () => {
  const now = 1800000000000;
  const restored = readDiscoveryDraft(JSON.stringify({ version: DISCOVERY_VERSION, savedAt: now, step: 99, contact: { email: 'private@example.com' }, privacyAccepted: true, answers: {
    1: { choices: ['Cosy and welcoming', 'Cosy and welcoming', 'Sharp and minimalist', '<script>'], text: 'a'.repeat(2000) },
    5: { choices: ['Clean and spacious', 'Not sure yet'], text: '' },
    26: { choices: [], text: 'A site I am proud of' },
    999: { text: 'Unknown' },
  } }), now);
  assert.equal(restored.step, 6);
  assert.equal(restored.answers[1].text.length, DISCOVERY_ANSWER_LIMIT);
  assert.deepEqual(restored.answers[1].choices, ['Cosy and welcoming', 'Sharp and minimalist']);
  assert.deepEqual(restored.answers[5].choices, ['Clean and spacious']);
  assert.equal(restored.answers[26].text, 'A site I am proud of');
  assert.equal(restored.answers[999], undefined);
  assert.equal(restored.contact, undefined);
  assert.equal(restored.privacyAccepted, undefined);
});

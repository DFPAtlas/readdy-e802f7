const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const sourcePath = path.join(__dirname, '..', 'lib', 'uat-application-types.ts');
const source = readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const loadedModule = { exports: {} };
new Function('module', 'exports', 'require', compiled)(loadedModule, loadedModule.exports, require);

const {
  buildAccessibilitySelection,
  buildProjectConflictSelection,
  generateApplicationReference,
} = loadedModule.exports;

test('project conflict No is retained while stale details are cleared', () => {
  assert.deepEqual(buildProjectConflictSelection('No'), {
    projectConflictStatus: 'No',
    projectConflictDetails: '',
  });
});

test('project conflict Yes does not erase entered details', () => {
  assert.deepEqual(buildProjectConflictSelection('Yes'), {
    projectConflictStatus: 'Yes',
  });
});

test('accessibility No is retained while dependent fields are cleared', () => {
  assert.deepEqual(buildAccessibilitySelection('No'), {
    accessibilityInterest: 'No',
    accessibilityCapabilities: [],
    accessibilityTools: '',
  });
});

test('application references are readable and collision resistant', () => {
  const references = Array.from({ length: 100 }, () => generateApplicationReference());
  const pattern = /^DFP-UAT-APP-\d{4}-[0-9A-F]{12}$/;

  assert.equal(references.every((reference) => pattern.test(reference)), true);
  assert.equal(new Set(references).size, references.length);
});

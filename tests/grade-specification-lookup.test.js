const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { after, before, test } = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const repositoryRoot = resolve(__dirname, '..');

let dom;
let qa;
let runtimeErrors;
let outputDirectory;
let applicationPath;
let guidePath;

before(() => {
  outputDirectory = mkdtempSync(join(tmpdir(), 'grade-specification-lookup-'));
  applicationPath = join(outputDirectory, 'index.html');
  guidePath = join(outputDirectory, 'how-to-use', 'index.html');
  execFileSync(process.execPath, ['scripts/build-grade-specification-lookup.mjs'], {
    cwd: repositoryRoot,
    stdio: 'pipe',
    env: { ...process.env, GRADE_SPEC_OUTPUT_DIRECTORY: outputDirectory }
  });
  const html = readFileSync(applicationPath, 'utf8').replace(/<script\s+src="[^"]+"><\/script>/g, '');
  runtimeErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => runtimeErrors.push(String(error)));
  virtualConsole.on('error', (...messages) => runtimeErrors.push(messages.join(' ')));
  dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://upskillsprint.com/engineering-tools/grade-specification-lookup/',
    virtualConsole,
    beforeParse(window) {
      window.print = () => {};
      window.scrollTo = () => {};
    }
  });
  qa = dom.window.__gradeSpecQA;
});

after(() => {
  dom?.window.close();
  if (outputDirectory) rmSync(outputDirectory, { recursive: true, force: true });
});

test('application boots without runtime errors and discloses dataset status', () => {
  assert.ok(qa);
  assert.deepEqual({ ...qa.audit() }, {
    grades: 257,
    verifiedGrades: 0,
    requirementRecords: 12659,
    verifiedRequirementRecords: 0
  });
  assert.deepEqual(runtimeErrors, []);
  assert.match(dom.window.document.querySelector('.data-integrity-banner')?.textContent || '', /0\/257 grade records/);
  assert.match(dom.window.document.querySelector('#diagCounts')?.textContent || '', /0 errors3 warnings/);
});

test('blank compliance run is INCOMPLETE rather than a false PASS', () => {
  dom.window.document.querySelector('#runCheckBtn').click();
  const report = dom.window.document.querySelector('#checkReport');
  assert.ok(report);
  assert.match(report.querySelector('.verdict')?.textContent || '', /INCOMPLETE/);
  assert.equal(report.querySelector('.verdict.pass'), null);
  assert.match(report.querySelector('.missing-inputs')?.textContent || '', /Yield strength/);
  assert.match(report.textContent, /No result values were evaluated/);
});

test('Charpy requires exactly three specimens and applies maximum-temperature semantics', () => {
  const entry = qa.findEntry({ bodyKey: 'API_5L', gradeKey: 'X52_PSL2' });
  const input = qa.defaultCheckInput(entry);
  input.cvn1 = 100;
  let result = qa.runCompliance(input, entry);
  assert.equal(result.verdict, 'INCOMPLETE');
  assert.ok(result.coverage.missing.includes('CVN specimen 2 energy'));
  assert.ok(result.coverage.missing.includes('CVN specimen 3 energy'));
  assert.equal(result.results.some((row) => row.name.startsWith('CVN average')), false);

  Object.assign(input, { cvn2: 100, cvn3: 100, cvnTemp: 20 });
  result = qa.runCompliance(input, entry);
  assert.equal(result.verdict, 'FAIL');
  assert.equal(result.results.find((row) => row.name === 'CVN test temperature')?.status, 'FAIL');

  input.cvnTemp = -20;
  result = qa.runCompliance(input, entry);
  assert.equal(result.results.find((row) => row.name === 'CVN test temperature')?.status, 'PASS');
  assert.equal(result.verdict, 'INCOMPLETE', 'other applicable fields remain missing');
});

test('custom Charpy width is estimate-only for compliance', () => {
  const entry = qa.findEntry({ bodyKey: 'API_5L', gradeKey: 'X52_PSL2' });
  const input = qa.defaultCheckInput(entry);
  Object.assign(input, { cvn1: 50, cvn2: 50, cvn3: 50, cvnTemp: 0, cvnSize: 'CUSTOM', cvnCustomWidth: 8 });
  const result = qa.runCompliance(input, entry);
  assert.equal(result.verdict, 'INCOMPLETE');
  assert.ok(result.coverage.missing.includes('Tabulated CVN specimen size'));
  assert.equal(result.results.some((row) => row.name.startsWith('CVN average')), false);
});

test('the CE calculator does not silently substitute zero for missing chemistry', () => {
  const carbon = dom.window.document.querySelector('#ce_C');
  carbon.value = '0.1';
  carbon.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const output = dom.window.document.querySelector('#ceOutput')?.textContent || '';
  assert.match(output, /Enter all formula inputs before calculating/);
  assert.doesNotMatch(output, /CE_IIW\s*0/);
});

test('invalid physical inputs are rejected explicitly', () => {
  const entry = qa.findEntry({ bodyKey: 'CSA_G40_21', gradeKey: 'G40_230G' });
  const input = qa.defaultCheckInput(entry);
  Object.assign(input, { ys: 600, uts: 500 });
  const result = qa.runCompliance(input, entry);
  assert.equal(result.verdict, 'INVALID_INPUT');
  assert.ok(result.inputErrors.includes('Yield strength cannot exceed tensile strength.'));
});

test('a complete conforming assessment cannot clean-pass unaudited limits', () => {
  const entry = qa.findEntry({ bodyKey: 'CSA_G40_21', gradeKey: 'G40_230G' });
  const input = qa.defaultCheckInput(entry);
  input.chemistry = { C: 0.1, Mn: 0.5, Si: 0.2, Cr: 0, Mo: 0, V: 0, Ni: 0, Cu: 0, Nb: 0, Ti: 0, B: 0, P: 0.01, S: 0.01, N: 0, Al: 0, Ca: 0 };
  Object.assign(input, { ys: 250, uts: 400, elongation: 25 });
  const result = qa.runCompliance(input, entry);
  assert.equal(result.coverage.missing.length, 0);
  assert.equal(result.failures, 0);
  assert.equal(result.verdict, 'PASS_WITH_WARNINGS');
  assert.ok(result.unverified.length > 0);
});

test('DWTT applicability and results are included in the assessment', () => {
  const data = qa.data();
  let reference;
  for (const [bodyKey, body] of Object.entries(data.specBodies)) {
    for (const [gradeKey, grade] of Object.entries(body.grades)) {
      if (grade.dwtt) {
        reference = { bodyKey, gradeKey, grade };
        break;
      }
    }
    if (reference) break;
  }
  assert.ok(reference);
  const entry = qa.findEntry(reference);
  const input = qa.defaultCheckInput(entry);
  input.od = reference.grade.dwtt.applicabilityRule.odMin_mm;
  let result = qa.runCompliance(input, entry);
  assert.ok(result.coverage.missing.includes('DWTT average shear area'));
  assert.ok(result.coverage.missing.includes('Actual DWTT test temperature'));

  input.dwttShear = reference.grade.dwtt.shearAreaAvg.min.value;
  input.dwttTemp = reference.grade.dwtt.testTemp.value;
  result = qa.runCompliance(input, entry);
  assert.equal(result.results.find((row) => row.name === 'DWTT average shear area')?.status, 'PASS');
  assert.equal(result.results.find((row) => row.name === 'DWTT test temperature')?.status, 'PASS');
});

test('reverse lookup filters product form and temperature independently', () => {
  const plateHits = qa.searchReverse({ ys: 359, thickness: 15, form: 'PLATE' });
  assert.ok(plateHits.length > 0);
  assert.ok(plateHits.every((hit) => hit.entry.grade.applicableForms.includes('PLATE')));
  assert.equal(plateHits.some((hit) => hit.entry.bodyKey === 'API_5L'), false);

  const coldHits = qa.searchReverse({ ys: 300, thickness: 15, form: 'ALL', temp: -20 });
  assert.ok(coldHits.length > 0);
  assert.ok(coldHits.every((hit) => hit.entry.grade.charpy.required && hit.temp <= -20));
  assert.ok(coldHits.every((hit) => hit.unverified));
});

test('known API M-grade designations are displayed correctly', () => {
  const api = qa.data().specBodies.API_5L.grades;
  assert.equal(api.X60M_PSL2.displayName, 'Grade L415M / Grade X60M PSL2');
  assert.equal(api.X65M_PSL2.displayName, 'Grade L450M / Grade X65M PSL2');
  assert.equal(api.X70M_PSL2.displayName, 'Grade L485M / Grade X70M PSL2');
});

test('extended validator detects bound and verified-type defects', () => {
  const copy = JSON.parse(JSON.stringify(qa.data()));
  const grade = copy.specBodies.CSA_G40_21.grades.G40_230G;
  grade.mechanical.thicknessBreakpoints[0].yieldStrength.min.bound = 'MAX';
  grade.charpy.testTemp.verified = 'yes';
  const issues = qa.validateData(copy);
  assert.ok(issues.some((item) => item.code === 'BOUND_PATH_MISMATCH'));
  assert.ok(issues.some((item) => item.path.endsWith('charpy.testTemp.verified') && item.code === 'TYPE'));
});

test('tabs, search, diagnostics, and toggles expose accessible state', () => {
  const document = dom.window.document;
  assert.equal(document.querySelector('.tool-tabs')?.getAttribute('role'), 'tablist');
  assert.equal(document.querySelector('[data-p2-tab="compliance"]')?.getAttribute('aria-selected'), 'true');
  assert.equal(document.querySelector('[data-panel="compliance"]')?.getAttribute('role'), 'tabpanel');
  assert.equal(document.querySelector('#globalSearch')?.getAttribute('role'), 'combobox');
  assert.equal(document.querySelector('#diagToggle')?.getAttribute('aria-controls'), 'diagBody');
  assert.ok(document.querySelector('#siBtn')?.hasAttribute('aria-pressed'));
});

test('user guide documents incomplete, invalid, form-filter, and temperature behavior', () => {
  const guide = readFileSync(guidePath, 'utf8');
  assert.match(guide, /INCOMPLETE/);
  assert.match(guide, /INVALID INPUT/);
  assert.match(guide, /product-form filter/);
  assert.match(guide, /testing warmer fails/);
  assert.match(guide, /API Spec 5L, 47th Edition/);
  assert.match(guide, /CSA Z245\.1:26/);
  assert.match(guide, /apiwebstore\.org\/standards\/5L/);
});

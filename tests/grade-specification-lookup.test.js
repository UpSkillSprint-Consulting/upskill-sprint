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
  assert.equal(qa.version, '3.0.0', 'display-only updates must preserve saved checker state');
  const audit = qa.audit();
  assert.equal(audit.grades, 268);
  assert.equal(audit.verifiedGrades, 66);
  assert.ok(audit.verifiedRequirementRecords > 3500);
  assert.equal(qa.validateData(qa.data()).filter((item) => item.severity === 'error').length, 0);
  assert.deepEqual(runtimeErrors, []);
  assert.match(dom.window.document.querySelector('.data-integrity-banner')?.textContent || '', /Supplied edition checked/);
  assert.match(dom.window.document.querySelector('#diagCounts')?.textContent || '', /0 errors2 warnings/);
});

test('blank compliance run is INCOMPLETE rather than a false PASS', () => {
  dom.window.document.querySelector('#runCheckBtn').click();
  const report = dom.window.document.querySelector('#checkReport');
  assert.ok(report);
  assert.match(report.querySelector('.verdict')?.textContent || '', /INCOMPLETE/);
  assert.equal(report.querySelector('.verdict.pass'), null);
  assert.match(report.querySelector('.missing-inputs')?.textContent || '', /Yield strength/);
  assert.match(report.textContent, /Standard context/);
  assert.equal(report.querySelectorAll('.status-pass').length, 0);
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
  assert.match(output, /Enter all CSA equation inputs/);
  assert.doesNotMatch(output, /CE_IIW\s*0/);
});

test('invalid physical inputs are rejected explicitly', () => {
  const entry = qa.findEntry({ bodyKey: 'CSA_G40_21', gradeKey: 'G40_260W' });
  const input = qa.defaultCheckInput(entry);
  Object.assign(input, { ys: 600, uts: 500 });
  const result = qa.runCompliance(input, entry);
  assert.equal(result.verdict, 'INVALID_INPUT');
  assert.ok(result.inputErrors.includes('Yield strength cannot exceed tensile strength.'));
});

test('a complete audited numerical assessment retains documented acceptance checks', () => {
  const entry = qa.findEntry({ bodyKey: 'CSA_G40_21', gradeKey: 'G40_260W' });
  const input = qa.defaultCheckInput(entry);
  input.chemistry = { C: 0.1, Mn: 0.5, Si: 0.2, Cr: 0, Mo: 0, V: 0, Ni: 0, Cu: 0, Nb: 0, Ti: 0, B: 0, P: 0.01, S: 0.01, N: 0, Al: 0, Ca: 0 };
  Object.assign(input, { ys: 300, uts: 450, elongation: 25, standardContext: { form: 'PLATE', tensileOrientation: 'LONGITUDINAL', gaugeLengthMM: 50, supplyCondition: 'AS_ROLLED' } });
  const result = qa.runCompliance(input, entry);
  assert.equal(result.coverage.missing.length, 0);
  assert.equal(result.failures, 0);
  assert.equal(result.verdict, 'PASS_WITH_WARNINGS');
  assert.ok(result.standardAssessment.manualChecks.length > 0);
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
  const grade = copy.specBodies.CSA_G40_21.grades.G40_260W;
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

test('lookup uses aligned tables with one collapsed source disclosure per section', () => {
  const document = dom.window.document;
  const chemistry = document.querySelector('#chemistry');
  const mechanical = document.querySelector('#mechanical');
  assert.ok(chemistry.querySelector('.chemistry-table caption'));
  assert.ok(mechanical.querySelector('.mechanical-table'));
  for (const card of [chemistry, mechanical]) {
    assert.equal(card.querySelectorAll('.section-references').length, 1);
    assert.equal(card.querySelector('.section-references').open, false);
    assert.equal(card.querySelector('.requirement-reference'), null);
    assert.ok(card.querySelector('.section-references .clause'));
  }
  assert.match(mechanical.querySelector('thead').textContent, /PropertyMinimumMaximum/);
  assert.match(mechanical.querySelector('.requirement-legend').textContent, /Not specified in stored reference data/);
  assert.equal(document.querySelector('.standard-reference .standard-context-controls').open, false);
  assert.equal(document.querySelector('.standard-reference .standard-catalog').open, false);
  chemistry.querySelector('.section-references').open = true;
  assert.ok(chemistry.querySelector('.section-references li').textContent.length > 0);
});

test('chemistry sources retain analysis basis and CE limits stay visible beside collapsed formulas', () => {
  const document = dom.window.document;
  dom.window.eval("selectEntry(findEntry({bodyKey:'CSA_Z245_1',gradeKey:'GR_483_CAT_II'}))");
  let chemistry = document.querySelector('#chemistry');
  const buttons = [...chemistry.querySelectorAll('[data-chemistry-analysis]')];
  assert.deepEqual(buttons.map((button) => button.textContent), ['Heat analysis', 'Product analysis']);
  assert.equal(chemistry.querySelectorAll('tbody tr[data-analysis-basis="PRODUCT"]').length, 0);
  assert.ok(chemistry.querySelectorAll('tbody tr[data-analysis-basis="HEAT"]').length > 0);
  assert.match(chemistry.querySelector('caption').textContent, /Heat analysis/);
  assert.match(chemistry.querySelector('.section-references').textContent, /HEAT.*Minimum|HEAT.*Maximum/);
  assert.equal(chemistry.querySelector('.formula-details').open, false);
  assert.ok(chemistry.querySelector('.formula-box > .metric-grid .num'));
  assert.equal(chemistry.querySelector('.formula-details .metric .num'), null);
  chemistry.querySelector('[data-chemistry-analysis="PRODUCT"]').click();
  chemistry = document.querySelector('#chemistry');
  assert.equal(chemistry.querySelectorAll('tbody tr[data-analysis-basis="HEAT"]').length, 0);
  assert.ok(chemistry.querySelectorAll('tbody tr[data-analysis-basis="PRODUCT"]').length > 0);
  assert.match(chemistry.querySelector('caption').textContent, /Product analysis/);
  assert.equal(chemistry.querySelector('[data-chemistry-analysis="PRODUCT"]').getAttribute('aria-pressed'), 'true');
  assert.match(chemistry.querySelector('.section-references').textContent, /PRODUCT.*Minimum|PRODUCT.*Maximum/);
  chemistry.querySelector('[data-chemistry-analysis="HEAT"]').click();
});

test('mechanical interval shows exclusive lower boundary and converts to imperial only once', () => {
  const data = qa.data();
  let entry;
  for (const [bodyKey, body] of Object.entries(data.specBodies)) {
    for (const [gradeKey, grade] of Object.entries(body.grades)) {
      if (grade.displayName.includes('260W /')) entry = { bodyKey, gradeKey };
    }
  }
  assert.ok(entry);
  dom.window.eval(`selectEntry(findEntry(${JSON.stringify(entry)}))`);
  const document = dom.window.document;
  assert.match(document.querySelector('#mechanical .thickness-context').textContent, /0 < t ≤ 65 mm/);
  assert.match(document.querySelector('#mechanical .mechanical-table tbody').textContent, /Yield strength.*260 MPa/);
  assert.equal(document.querySelectorAll('#chemistry .analysis-cell').length, 0);
  assert.match(document.querySelector('#chemistry caption').textContent, /Heat analysis/);
  document.querySelector('#impBtn').click();
  const interval = document.querySelector('#mechanical .thickness-context').textContent;
  assert.match(interval, /0 < t ≤ 2\.56 in/);
  assert.doesNotMatch(interval, /0\.06 in/);
  assert.match(document.querySelector('#mechanical .mechanical-table tbody').textContent, /37\.7 ksi/);
  document.querySelector('#siBtn').click();
});

test('CSA Z245 grade dropdown switches designation labels without changing the grade record', () => {
  const document = dom.window.document;
  const reference = { bodyKey: 'CSA_Z245_1', gradeKey: 'GR_483_CAT_II' };
  dom.window.eval(`selectEntry(findEntry(${JSON.stringify(reference)}))`);

  const gradeSelect = document.querySelector('#gradeSelect');
  const variantSelect = document.querySelector('#variantSelect');
  assert.equal(gradeSelect.value, 'Grade 483');
  assert.equal(gradeSelect.selectedOptions[0].textContent, 'Grade 483');
  assert.equal(variantSelect.value, reference.gradeKey);

  document.querySelector('#impBtn').click();
  assert.equal(gradeSelect.value, 'Grade 483', 'canonical metric family remains the stored value');
  assert.equal(gradeSelect.selectedOptions[0].textContent, 'Grade 70');
  assert.equal(variantSelect.value, reference.gradeKey, 'unit toggle preserves the exact audited category record');

  const imperialLabels = Array.from(gradeSelect.options).map((option) => option.textContent);
  assert.deepEqual(imperialLabels, [
    'Grade 35', 'Grade 42', 'Grade 46 (intermediate)', 'Grade 52', 'Grade 56', 'Grade 60',
    'Grade 65', 'Grade 70', 'Grade 80', 'Grade 90', 'Grade 100', 'Grade 120'
  ]);

  document.querySelector('#siBtn').click();
  assert.equal(gradeSelect.selectedOptions[0].textContent, 'Grade 483');
  assert.equal(variantSelect.value, reference.gradeKey);
});

test('every CSA Z245 standard grade exposes complete conditional tensile and toughness requirements', () => {
  const document = dom.window.document;
  const table = [
    [241, 495, 414, 760], [290, 495, 414, 760], [359, 530, 455, 760],
    [386, 540, 490, 760], [414, 565, 517, 760], [448, 600, 531, 760],
    [483, 620, 565, 760], [550, 690, 620, 830], [620, 760, 690, 900],
    [690, 825, 760, 970], [825, 1050, 915, 1145]
  ];
  for (const [grade, maxYield, minTensile, maxTensile] of table) {
    const reference = { bodyKey: 'CSA_Z245_1', gradeKey: `GR_${grade}_CAT_II` };
    dom.window.eval(`selectEntry(findEntry(${JSON.stringify(reference)}))`);
    const snapshot = document.querySelector('#z245RequirementSnapshot');
    assert.ok(snapshot, `Grade ${grade} has a visible requirement snapshot`);
    const text = snapshot.textContent.replace(/,/g, '').replace(/\s+/g, ' ');
    for (const expected of [`${grade} MPa`, `${maxYield} MPa`, `${minTensile} MPa`, `${maxTensile} MPa`]) {
      assert.ok(text.includes(expected), `Grade ${grade} shows ${expected}`);
    }
    assert.match(text, /27 J.*40 J/, `Grade ${grade} shows both Category II CVN energy branches`);
    assert.match(text, /DWTT average ≥60%.*each specimen ≥50%/, `Grade ${grade} shows the large-OD DWTT rule`);
    assert.equal(document.querySelector('.standard-context-controls').open, false, `Grade ${grade} keeps order details collapsed by default`);
  }

  dom.window.eval("selectEntry(findEntry({bodyKey:'CSA_Z245_1',gradeKey:'GR_483_CAT_I'}))");
  assert.match(document.querySelector('#z245RequirementSnapshot').textContent, /Category I: no base requirement to demonstrate notch toughness/);
  dom.window.eval("selectEntry(findEntry({bodyKey:'CSA_Z245_1',gradeKey:'GR_483_CAT_III'}))");
  const categoryThree = document.querySelector('#z245RequirementSnapshot').textContent.replace(/\s+/g, ' ');
  assert.match(categoryThree, /Category III:.*18 J.*12 J.*no base shear-area requirement/);
});

test('Grade 483 resolves its upper tensile, ratio, Charpy and DWTT requirements after order context is applied', () => {
  const document = dom.window.document;
  dom.window.eval("selectEntry(findEntry({bodyKey:'CSA_Z245_1',gradeKey:'GR_483_CAT_II'}))");
  const snapshot = document.querySelector('#z245RequirementSnapshot').textContent.replace(/\s+/g, ' ');
  assert.match(snapshot, /e = 1940 × A0\.2 ÷ U0\.9/);
  assert.match(snapshot, /A.*rounded to the nearest 1 mm² and capped at 500 mm²/);
  assert.match(snapshot, /U.*specified minimum tensile strength.*not the measured tensile result/);
  assert.match(snapshot, /not a complete product-certification checklist/);
  assert.ok(document.querySelector('#standardElongationConverted'));
  assert.ok(document.querySelector('#standardOrderedEnergy'));
  assert.ok(document.querySelector('#standardFusionLineTemp'));
  assert.ok(document.querySelector('#standardSawToughness'));
  assert.ok(document.querySelector('#standardEwWaiver'));
  assert.deepEqual(Array.from(document.querySelector('#standardToughnessTarget').options).map((option) => option.value), ['', 'BODY', 'SAW_WELD', 'SAW_HAZ', 'EW_FUSION_LINE', 'EW_WELD_ZONE']);
  const set = (selector, value) => { document.querySelector(selector).value = value; };
  set('#standardOD', '762');
  set('#standardOrderTemperature', '-20');
  set('#standardArea', '500');
  set('#standardGauge', '50');
  set('#standardSupply', 'AS_MANUFACTURED');
  set('#standardSpecimen', 'FLATTENED_STRIP');
  set('#standardToughnessTarget', 'BODY');
  set('#standardService', 'BASE');
  document.querySelector('#applyStandardContext').click();

  assert.equal(document.querySelector('#mechanical'), null, 'the duplicate partial Z245 mechanical table is removed');
  assert.equal(document.querySelector('.anchor-bar a[href="#z245RequirementSnapshot"]')?.textContent, 'Mechanical');
  const mechanical = document.querySelector('#z245RequirementSnapshot').textContent.replace(/\s+/g, ' ');
  assert.match(mechanical, /Yield strength.*483 MPa.*620 MPa/);
  assert.match(mechanical, /Tensile strength.*565 MPa.*760 MPa/);
  assert.match(mechanical, /Yield \/ tensile ratio.*0\.93/);
  const charpy = document.querySelector('#charpy').textContent.replace(/\s+/g, ' ');
  assert.match(charpy, /Test temperature.*-20 °C/);
  assert.match(charpy, /Average full-size energy.*40 J/);
  assert.match(charpy, /DWTT.*60%/);
  assert.equal(document.querySelector('.standard-context-controls').open, false);
});

const z245Ref = { bodyKey: 'CSA_Z245_1', gradeKey: 'GR_359_CAT_II' };
const z245Chemistry = { C: 0.1, Mn: 1, Si: 0.2, P: 0.01, S: 0.01, Nb: 0, Ti: 0, V: 0, B: 0, Cu: 0, Ni: 0, Cr: 0, Mo: 0 };
function pipeInput(od = 457) {
  const input = qa.defaultCheckInput(qa.findEntry(z245Ref));
  return Object.assign(input, { tMM: 12.7, od, chemistry: { ...z245Chemistry }, ys: 370, uts: 500, elongation: 35, hardness: 20, cvn1: 39.6, cvn2: 40, cvn3: 40, cvnTemp: -20, cvnSize: '10x10', shear1: 85, shear2: 85, shear3: 85, orderHeatCount: 4, standardContext: { form: 'SAWL', nominalAreaMM2: 500, gaugeLengthMM: 50, supplyCondition: 'AS_MANUFACTURED', orderTemperatureC: -20, tensileSpecimen: 'FLATTENED_STRIP', toughnessTarget: 'BODY' } });
}

test('attached CSA CE reaches the actual compliance engine and respects missing inputs', () => {
  const entry = qa.findEntry(z245Ref), input = pipeInput();
  const report = qa.runCompliance(input, entry);
  const expectedF = 0.75 + 0.25 * Math.tanh(20 * (0.1 - 0.12));
  const expected = 0.1 + expectedF * (1 / 6 + 0.2 / 24);
  const row = report.results.find((item) => item.name === 'CSA carbon equivalent');
  assert.ok(Math.abs(row.entered - expected) < 1e-12);
  assert.equal(row.status, 'PASS');
  assert.equal(report.results.some((item) => item.name === 'Pcm'), false);
  assert.equal(report.coverage.missing.length, 0);
  assert.equal(report.verdict, 'PASS_WITH_WARNINGS');
  delete input.chemistry.Nb;
  const missing = qa.runCompliance(input, entry);
  assert.equal(missing.verdict, 'INCOMPLETE');
  assert.ok(missing.coverage.missing.some((item) => item.startsWith('Nb')));
  assert.equal(missing.results.some((item) => item.name === 'CSA carbon equivalent' && item.status === 'PASS'), false);
});

test('CSA CVN rounding and specimen-count rules replace generic unrounded checks', () => {
  const entry = qa.findEntry(z245Ref), input = pipeInput();
  let report = qa.runCompliance(input, entry);
  assert.equal(report.results.find((item) => item.name === 'CVN average (rounded whole J)').status, 'PASS');
  assert.equal(report.results.some((item) => item.name === 'CVN average (3 specimens)'), false);
  Object.assign(input, { cvn1: 39.4, cvn2: 39.4, cvn3: 42 });
  report = qa.runCompliance(input, entry);
  assert.equal(report.results.find((item) => item.name === 'CVN average (rounded whole J)').status, 'PASS');
  assert.equal(report.results.find((item) => item.name === 'CVN count below required minimum').status, 'FAIL');
  assert.equal(report.verdict, 'FAIL');
});

test('CSA DWTT applies strictly above 457 mm and requires both individual results', () => {
  const entry = qa.findEntry(z245Ref), input = pipeInput();
  let report = qa.runCompliance(input, entry);
  assert.equal(report.results.some((item) => item.category === 'DWTT'), false);
  input.od = 457.1;
  input.dwttShear = 90;
  input.dwttTemp = -20;
  report = qa.runCompliance(input, entry);
  assert.equal(report.verdict, 'INCOMPLETE');
  assert.ok(report.coverage.missing.some((item) => item.includes('Two individual DWTT')));
  Object.assign(input, { dwtt1: 60, dwtt2: 60 });
  report = qa.runCompliance(input, entry);
  assert.equal(report.coverage.missing.length, 0);
  assert.equal(report.results.find((item) => item.name === 'DWTT minimum individual shear area').status, 'PASS');
  input.dwtt1 = 49;
  input.dwtt2 = 80;
  report = qa.runCompliance(input, entry);
  assert.equal(report.results.find((item) => item.name === 'DWTT average shear area').status, 'PASS');
  assert.equal(report.results.find((item) => item.name === 'DWTT minimum individual shear area').status, 'FAIL');
  assert.equal(report.verdict, 'FAIL');
});

test('CSA strength is rounded to the nearest MPa without concealing impossible raw input', () => {
  const entry = qa.findEntry(z245Ref), input = pipeInput();
  input.ys = 358.6;
  assert.equal(qa.runCompliance(input, entry).results.find((item) => item.name === 'Yield strength' && item.limit.bound === 'MIN').status, 'PASS');
  input.ys = 358.4;
  assert.equal(qa.runCompliance(input, entry).verdict, 'FAIL');
  input.ys = 500.1;
  input.uts = 500;
  assert.equal(qa.runCompliance(input, entry).verdict, 'INVALID_INPUT');
});

test('G40 always uses its IIW acceptance slot, including zero carbon', () => {
  const context = qa.resolveAttached({ bodyKey: 'CSA_G40_21', gradeKey: 'G40_345WM' }, { form: 'STRUCTURAL_SHAPE', thicknessMM: 20, tensileOrientation: 'LONGITUDINAL', gaugeLengthMM: 50, supplyCondition: 'AS_ROLLED' });
  const section = context.grade.chemistry.carbonEquivalent;
  const calculated = dom.window.eval(`ENGINE.computeCE(${JSON.stringify({ C: 0, Mn: 1, Cr: 0, Mo: 0, V: 0, Ni: 0, Cu: 0 })}, ${JSON.stringify(section)})`);
  assert.equal(calculated.governing, 'CE_IIW');
  assert.equal(calculated.limit.value, 0.45);
});

test('reverse lookup resolves the requested form and marks unresolved context', () => {
  const previous = qa.state.form;
  try {
    qa.state.form = 'BAR';
    const plates = qa.searchReverse({ form: 'PLATE', thickness: 201, ys: 250 });
    assert.equal(plates.some((hit) => hit.entry.gradeKey === 'ASTM_A36_A36M_GRADE_A36'), false);
    qa.state.form = 'PLATE';
    const bars = qa.searchReverse({ form: 'BAR', thickness: 201, ys: 250 });
    const a36 = bars.find((hit) => hit.entry.gradeKey === 'ASTM_A36_A36M_GRADE_A36');
    assert.ok(a36);
    assert.equal(a36.ys, 250);
    assert.equal(a36.contextIncomplete, true);
    assert.equal(a36.unverified, true);
  } finally { qa.state.form = previous; }
});

test('audited source badge requires the matching supplied edition after data import', () => {
  const entry = qa.findEntry({ bodyKey: 'ASTM', gradeKey: 'ASTM_A36_A36M_GRADE_A36' });
  const original = entry.grade.specEdition;
  try {
    entry.grade.specEdition = 'ASTM A36/A36M-14';
    assert.equal(qa.resolveAttached(entry), null);
  } finally { entry.grade.specEdition = original; }
});

test('pipe UI applies source context, exposes individual DWTT and uses CSA hydro rules', () => {
  const document = dom.window.document;
  dom.window.eval(`storageSet('gradeSpecAttachedEditionContext:v1:CSA_Z245_1', ${JSON.stringify({ odMM: 508, gaugeLengthMM: 50, nominalAreaMM2: 500, orderTemperatureC: -20, supplyCondition: 'AS_MANUFACTURED' })}); selectEntry(findEntry(${JSON.stringify(z245Ref)})); state.form='SAWL'; render();`);
  assert.ok(document.querySelector('#checkDWTT1'));
  assert.ok(document.querySelector('#checkDWTT2'));
  assert.equal(document.querySelector('#checkDWTTShear'), null);
  assert.match(document.querySelector('#hydroOutput').textContent, /90% of SMYS/);
  assert.match(document.querySelector('#hydroOutput').textContent, /at least 10 seconds/);
  assert.equal(document.querySelector('#hydroFiber'), null);
  assert.equal(document.querySelector('#elongUTS'), null);
  assert.match(document.querySelector('#elongOutput').textContent, /specified minimum TS = 455 MPa/);
  assert.match(document.querySelector('#chemistry .formula-box').textContent, /CSA carbon equivalent/);
  assert.equal(document.querySelectorAll('#chemistry .formula-rule').length, 1);
  document.querySelector('#runReverseBtn').click();
  assert.deepEqual(runtimeErrors, []);
  dom.window.eval("state.form='PLATE'; selectEntry(findEntry({bodyKey:'ASTM',gradeKey:'ASTM_A36_A36M_GRADE_A36'}));");
  assert.match(document.querySelector('#ceOutput').textContent, /does not specify a base carbon-equivalent/);
  assert.equal(document.querySelector('#charpyCalcSize'), null);
  assert.equal(/QADW/i.test(document.querySelector('#app').textContent), false);
});

test('G40 rounds strength to 5 MPa and final CVN results to whole joules', () => {
  const entry = qa.findEntry({ bodyKey: 'CSA_G40_21', gradeKey: 'G40_350WT' });
  const input = qa.defaultCheckInput(entry);
  Object.assign(input, { ys: 348.1, uts: 451, cvn1: 26.6, cvn2: 26.6, cvn3: 26.6, cvnTemp: -20, cvnSize: '10x10', standardContext: { form: 'PLATE', tensileOrientation: 'LONGITUDINAL', gaugeLengthMM: 50, supplyCondition: 'AS_ROLLED', impactCategory: '2' } });
  let report = qa.runCompliance(input, entry);
  assert.equal(report.results.find((row) => row.name === 'Yield strength' && row.limit.bound === 'MIN').status, 'PASS');
  assert.equal(report.results.find((row) => row.name === 'CVN average (3 specimens)').status, 'PASS');
  input.ys = 347.5;
  report = qa.runCompliance(input, entry);
  assert.equal(report.results.find((row) => row.name === 'Yield strength' && row.limit.bound === 'MIN').entered, 350);
  input.ys = 346;
  assert.equal(qa.runCompliance(input, entry).verdict, 'FAIL');
});

test('CSA toughness assessment preserves stricter customer overlay limits', () => {
  const entry = qa.findEntry(z245Ref), previous = entry.grade.overlays.CUSTOMER_SUPPLEMENT;
  const limit = { value: 60, bound: 'MIN', unit: 'J', clauseRef: 'Customer order test fixture', verified: true, footnoteIds: [], displayNote: '' };
  try {
    entry.grade.overlays.CUSTOMER_SUPPLEMENT = { displayName: 'Raised order energy', available: true, patches: [{ path: 'charpy.energyFullSize.average.min', newValue: limit }], addedRequirements: [] };
    const report = qa.runCompliance(pipeInput(), entry, ['CUSTOMER_SUPPLEMENT']);
    const average = report.results.find((row) => row.name === 'CVN average (rounded whole J)');
    assert.equal(average.limit.value, 60);
    assert.equal(average.status, 'FAIL');
    assert.equal(report.verdict, 'FAIL');
  } finally { entry.grade.overlays.CUSTOMER_SUPPLEMENT = previous; }
});

test('G40 IIW assessment does not demand inputs belonging only to Pcm', () => {
  const entry = qa.findEntry({ bodyKey: 'CSA_G40_21', gradeKey: 'G40_345WM' });
  const input = qa.defaultCheckInput(entry);
  Object.assign(input, { chemistry: { C: 0.1, Mn: 1, P: 0.01, S: 0.01, Si: 0.2, N: 0.01, Nb: 0, V: 0, Cr: 0, Cu: 0, Ni: 0, Mo: 0 }, ys: 350, uts: 500, elongation: 30, standardContext: { form: 'STRUCTURAL_SHAPE', flangeThicknessMM: 20, shapeTestLocation: 'FLANGE', shapeGroup: 1, tensileOrientation: 'LONGITUDINAL', gaugeLengthMM: 50, supplyCondition: 'AS_ROLLED' } });
  const report = qa.runCompliance(input, entry);
  assert.deepEqual([...report.coverage.missing], []);
  assert.equal(report.verdict, 'PASS_WITH_WARNINGS');
  assert.equal(report.results.some((row) => row.name === 'Pcm'), false);
});

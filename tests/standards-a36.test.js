const assert = require('node:assert/strict');
const {readFileSync, mkdtempSync, rmSync} = require('node:fs');
const {join, resolve} = require('node:path');
const {tmpdir} = require('node:os');
const {pathToFileURL} = require('node:url');
const {test} = require('node:test');
const vm = require('node:vm');
const {brotliDecompressSync} = require('node:zlib');

const root = resolve(__dirname, '..');
const original = brotliDecompressSync(Buffer.from(readFileSync(resolve(root, 'source-assets/grade-specification-lookup/grade_spec_lookup.html.br.b64.part-01'), 'utf8').trim(), 'base64')).toString('utf8');
const dataStart = original.indexOf('let SPEC_DATA = ') + 'let SPEC_DATA = '.length;
const dataEnd = original.indexOf('\n};', dataStart);
assert.ok(dataStart > 15 && dataEnd > dataStart, 'Original compressed source contains the dataset');
const dataset = JSON.parse(original.slice(dataStart, dataEnd + 2));
const sandbox = vm.createContext({});
vm.runInContext(readFileSync(resolve(root, 'source-assets/grade-specification-lookup/audited-a36.js'), 'utf8'), sandbox);
sandbox.applyAuditedA36(dataset);
const grade = dataset.specBodies.ASTM.grades.ASTM_A36_A36M_GRADE_A36;
const lookup = (context) => sandbox.resolveAuditedA36(grade, context);
const mechanical = (result) => result.grade.mechanical.thicknessBreakpoints[0];
const chemistry = (result, element, bound = 'max', analysis = 'heat') => result.grade.chemistry.elements[element][analysis][bound].value;
const plate = (thicknessMM, widthMM = 381, extra = {}) => lookup({form: 'PLATE', thicknessMM, widthMM, gaugeLengthMM: 50, ...extra});

test('A36 audit is the attached edition and excludes unprocessed coils', () => {
  assert.equal(grade.specEdition, 'ASTM A36/A36M-19');
  assert.deepEqual(Array.from(grade.applicableForms), ['PLATE', 'STRUCTURAL_SHAPE', 'BAR']);
  assert.match(grade.verification.notes, /2168f20e05fdf6a57d87df57f3af82831dff36d51eec29d315277c3d3c564e03/);
  assert.equal(grade.charpy.subSizeFactors.length, 0, 'A36 does not supply generic Charpy factors');
  assert.ok(lookup({form: 'COIL', thicknessMM: 20}).missingContext.some((text) => text.includes('unprocessed coils')));
});

test('Table 3 plate width boundary is <=380 versus >380 mm', () => {
  assert.equal(chemistry(plate(30, 380), 'C'), 0.27);
  assert.equal(chemistry(plate(30, 380), 'Mn'), 0.90);
  assert.equal(chemistry(plate(30, 380), 'P'), 0.04);
  assert.equal(chemistry(plate(30, 380), 'S'), 0.05);
  assert.equal(chemistry(plate(30, 380.01), 'C'), 0.25);
  assert.equal(chemistry(plate(30, 380.01), 'Mn'), 1.20);
  assert.equal(chemistry(plate(30, 380.01), 'P'), 0.030);
  assert.equal(chemistry(plate(30, 380.01), 'S'), 0.030);
});

test('Table 3 wide-plate thickness boundaries use every source column inclusively', () => {
  // Independently transcribed Table 3 requirements from the attached p.3.
  const expected = [
    [20, 0.25, null, null, null],
    [20.01, 0.25, 0.80, 1.20, null],
    [40, 0.25, 0.80, 1.20, null],
    [40.01, 0.26, 0.80, 1.20, 0.15],
    [65, 0.26, 0.80, 1.20, 0.15],
    [65.01, 0.27, 0.85, 1.20, 0.15],
    [100, 0.27, 0.85, 1.20, 0.15],
    [100.01, 0.29, 0.85, 1.20, 0.15]
  ];
  for (const [thickness, carbon, mnMin, mnMax, siMin] of expected) {
    const result = plate(thickness);
    assert.equal(chemistry(result, 'C'), carbon, `C at ${thickness} mm`);
    assert.equal(chemistry(result, 'Mn', 'min'), mnMin, `Mn minimum at ${thickness} mm`);
    assert.equal(chemistry(result, 'Mn'), mnMax, `Mn maximum at ${thickness} mm`);
    assert.equal(chemistry(result, 'Si', 'min'), siMin, `Si minimum at ${thickness} mm`);
    assert.equal(chemistry(result, 'Si'), 0.40);
  }
});

test('Table 3 bars and narrow plates have their different thickness-dependent chemistry', () => {
  for (const form of ['BAR', 'PLATE']) {
    for (const [thickness, carbon, mnMin, mnMax] of [[20, 0.26, null, null], [20.01, 0.27, 0.60, 0.90], [40, 0.27, 0.60, 0.90], [40.01, 0.28, 0.60, 0.90], [100, 0.28, 0.60, 0.90], [100.01, 0.29, 0.60, 0.90]]) {
      const result = lookup({form, thicknessMM: thickness, widthMM: 380, gaugeLengthMM: 50});
      assert.equal(chemistry(result, 'C'), carbon, `${form} C at ${thickness} mm`);
      assert.equal(chemistry(result, 'Mn', 'min'), mnMin);
      assert.equal(chemistry(result, 'Mn'), mnMax);
      assert.equal(chemistry(result, 'P'), 0.04);
      assert.equal(chemistry(result, 'S'), 0.05);
    }
  }
});

test('SI and inch-pound systems apply their separately standardized boundaries and tensile limits', () => {
  // 0.75 in. is 19.05 mm, so a 20 mm wide plate lies above the
  // inch-pound boundary while remaining in the first SI band.
  assert.equal(chemistry(plate(20, 400), 'Mn'), null);
  assert.equal(chemistry(plate(20, 400, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8}), 'Mn'), 1.20);
  // 15 in. is 381 mm, so the width boundary also differs by unit system.
  assert.equal(chemistry(plate(20, 381), 'C'), 0.25);
  assert.equal(chemistry(plate(20, 381, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8}), 'C'), 0.27);
  const imperial = plate(0.75 * 25.4, 15.01 * 25.4, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8});
  assert.equal(chemistry(imperial, 'Mn'), null);
  const row = mechanical(imperial);
  const MPaPerKsi = 6.894757293168361;
  assert.ok(Math.abs(row.yieldStrength.min.value / MPaPerKsi - 36) < 1e-9);
  assert.ok(Math.abs(row.tensileStrength.min.value / MPaPerKsi - 58) < 1e-9);
  assert.ok(Math.abs(row.tensileStrength.max.value / MPaPerKsi - 80) < 1e-9);
  assert.notEqual(row.yieldStrength.min.value, 250);
  for (const [inches, carbon, mnMin] of [[1.5, 0.25, 0.80], [1.5001, 0.26, 0.80], [2.5, 0.26, 0.80], [2.5001, 0.27, 0.85], [4, 0.27, 0.85], [4.0001, 0.29, 0.85]]) {
    const result = plate(inches * 25.4, 16 * 25.4, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8});
    assert.equal(chemistry(result, 'C'), carbon);
    assert.equal(chemistry(result, 'Mn', 'min'), mnMin);
  }
});

test('Table 2 reduces plate yield only strictly above 200 mm / 8 in., not for bars or shapes', () => {
  assert.equal(mechanical(plate(200)).yieldStrength.min.value, 250);
  assert.equal(mechanical(plate(200.01)).yieldStrength.min.value, 220);
  for (const form of ['BAR', 'STRUCTURAL_SHAPE']) {
    const result = lookup({form, thicknessMM: 201, shapeFlangeThicknessMM: 50, shapeDesignation: 'OTHER', gaugeLengthMM: 50});
    assert.equal(mechanical(result).yieldStrength.min.value, 250);
  }
  const MPaPerKsi = 6.894757293168361;
  assert.ok(Math.abs(mechanical(plate(8 * 25.4, 400, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8})).yieldStrength.min.value / MPaPerKsi - 36) < 1e-9);
  assert.ok(Math.abs(mechanical(plate(8.001 * 25.4, 400, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8})).yieldStrength.min.value / MPaPerKsi - 32) < 1e-9);
});

test('Table 2 plate elongation depends on actual gauge length and width >600 mm / 24 in.', () => {
  assert.equal(mechanical(plate(30, 600)).elongation.fixedMin.value, 23);
  assert.equal(mechanical(plate(30, 600.01)).elongation.fixedMin.value, 21);
  assert.equal(mechanical(plate(30, 600, {gaugeLengthMM: 200})).elongation.fixedMin.value, 20);
  assert.equal(mechanical(plate(30, 600.01, {gaugeLengthMM: 200})).elongation.fixedMin.value, 18);
  assert.equal(mechanical(plate(30, 24 * 25.4, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8})).elongation.fixedMin.value, 23);
  assert.equal(mechanical(plate(30, 24.001 * 25.4, {unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8})).elongation.fixedMin.value, 21);
  assert.equal(mechanical(plate(30, 500, {gaugeLengthMM: ''})).elongation.fixedMin.value, null);
  assert.ok(plate(30, 500, {gaugeLengthMM: ''}).missingContext.some((text) => text.includes('gauge length')));
});

test('Table 3 heavy-shape chemistry and Table 2 heavy wide-flange mechanics are distinct', () => {
  const shape = (flange, designation = 'WIDE_FLANGE') => lookup({form: 'STRUCTURAL_SHAPE', thicknessMM: 100, shapeFlangeThicknessMM: flange, shapeDesignation: designation, gaugeLengthMM: 50});
  assert.equal(chemistry(shape(75), 'Mn'), null);
  assert.equal(chemistry(shape(75.01), 'Mn', 'min'), 0.85);
  assert.equal(chemistry(shape(75.01), 'Mn'), 1.35);
  assert.equal(chemistry(shape(75.01), 'Si', 'min'), 0.15);
  assert.equal(mechanical(shape(75)).tensileStrength.max.value, 550);
  assert.equal(mechanical(shape(75)).elongation.fixedMin.value, 21);
  assert.equal(mechanical(shape(75.01)).tensileStrength.max.value, null);
  assert.equal(mechanical(shape(75.01)).elongation.fixedMin.value, 19);
  assert.equal(chemistry(shape(75.01, 'OTHER'), 'Mn'), 1.35, 'Table 3 A applies to shapes generally');
  assert.equal(mechanical(shape(75.01, 'OTHER')).tensileStrength.max.value, 550, 'Table 2 B only applies to wide-flange shapes');
  assert.equal(mechanical(shape(75.01, 'OTHER')).elongation.fixedMin.value, 21);
});

test('floor plate does not require determination of elongation', () => {
  const result = plate(30, 601, {floorPlate: true, gaugeLengthMM: ''});
  assert.equal(mechanical(result).elongation.fixedMin.value, null);
  assert.equal(mechanical(result).elongation.fixedMin.verified, true);
  assert.ok(!result.missingContext.some((text) => text.includes('gauge length')));
  assert.match(mechanical(result).elongation.fixedMin.displayNote, /need not be determined/);
});

test('§5.2 nonbridge-bearing exception uses C 0.20-0.33%, Table 3 P/S and no automatic tensile tests', () => {
  const result = plate(40.01, 381, {bearingUse: 'NON_BRIDGE', gaugeLengthMM: ''});
  assert.equal(chemistry(result, 'C', 'min'), 0.20);
  assert.equal(chemistry(result, 'C'), 0.33);
  assert.equal(chemistry(result, 'Mn'), null);
  assert.equal(chemistry(result, 'Si'), null);
  assert.equal(chemistry(result, 'P'), 0.030);
  assert.equal(chemistry(result, 'S'), 0.030);
  assert.equal(mechanical(result).yieldStrength.min.value, null);
  assert.ok(result.manualChecks.some((text) => text.includes('discard')));
  assert.equal(mechanical(plate(40, 381, {bearingUse: 'NON_BRIDGE'})).yieldStrength.min.value, 250, '40 mm belongs to the normal route');
  assert.equal(chemistry(plate(40.01, 381, {bearingUse: 'BRIDGE'}), 'C'), 0.26);
  assert.equal(mechanical(plate(40.01, 381, {bearingUse: 'NON_BRIDGE', manufacturerTestRequired: true})).yieldStrength.min.value, 250);
});

test('Cu is ordered-only; bars/plates install the source C/Mn tradeoff only when Mn has a base maximum', () => {
  assert.equal(chemistry(plate(30), 'Cu', 'min'), null);
  assert.equal(chemistry(plate(30, 381, {copperSpecified: true}), 'Cu', 'min'), 0.20);
  const tradeoff = plate(30).grade.footnoteRules.find((rule) => rule.id === 'a36_chem_B');
  assert.equal(tradeoff.sourceElement, 'C');
  assert.equal(tradeoff.targetElement, 'Mn');
  assert.equal(tradeoff.adjustPerUnit.sourceDecrement, 0.01);
  assert.equal(tradeoff.adjustPerUnit.targetIncrement, 0.06);
  assert.equal(tradeoff.ceiling, 1.35);
  assert.equal(plate(20).grade.footnoteRules.some((rule) => rule.id === 'a36_chem_B'), false, 'Unspecified Mn must not acquire a fabricated cap');
});

test('missing conditional context and unavailable A6 product tolerances remain unresolved', () => {
  const result = plate(30, 381, {analysisType: 'PRODUCT'});
  assert.equal(chemistry(result, 'C', 'max', 'product'), null);
  assert.equal(result.grade.chemistry.elements.C.product.max.verified, false);
  assert.ok(result.manualChecks.some((text) => text.includes('Product-analysis numerical limits require A6')));
  assert.ok(result.missingContext.some((text) => text.includes('A6/A6M product-analysis acceptance tolerances')));
  assert.ok(result.manualChecks.some((text) => text.includes('additional elongation adjustments')));
  const missingWidth = plate(30, '');
  assert.ok(missingWidth.missingContext.includes('Plate width'));
  assert.equal(chemistry(missingWidth, 'C'), null);
  const missingFlange = lookup({form: 'STRUCTURAL_SHAPE', thicknessMM: 30, gaugeLengthMM: 50});
  assert.ok(missingFlange.missingContext.includes('Shape flange thickness'));
  assert.equal(chemistry(missingFlange, 'Mn'), null);
});

test('resolver clones the source record and strict original schema accepts the audited dataset', () => {
  const snapshot = JSON.stringify(grade);
  plate(40.01, 600.01, {copperSpecified: true, gaugeLengthMM: 200});
  assert.equal(JSON.stringify(grade), snapshot);
  const validatorStart = original.indexOf('const SCHEMA_MAJOR =');
  const validatorEnd = original.indexOf('function diagnosticsSummary(', validatorStart);
  vm.runInContext(original.slice(validatorStart, validatorEnd), sandbox);
  const errors = sandbox.validateData(dataset).filter((issue) => issue.level === 'error');
  assert.deepEqual(Array.from(errors), []);
});

test('built A36 compliance marks unavailable product-analysis acceptance limits INCOMPLETE', async () => {
  const {JSDOM, VirtualConsole} = require('jsdom');
  const output = mkdtempSync(join(tmpdir(), 'a36-acceptance-integration-'));
  let dom;
  try {
    const previousOutput = process.env.GRADE_SPEC_OUTPUT_DIRECTORY;
    try {
      process.env.GRADE_SPEC_OUTPUT_DIRECTORY = output;
      await import(pathToFileURL(resolve(root, 'scripts/build-grade-specification-lookup.mjs')).href + '?a36-integration=' + Date.now());
    } finally {
      if (previousOutput === undefined) delete process.env.GRADE_SPEC_OUTPUT_DIRECTORY;
      else process.env.GRADE_SPEC_OUTPUT_DIRECTORY = previousOutput;
    }
    // The CLI module starts its async build without exporting the promise.
    // Await the complete output; this also works where spawning is restricted.
    let builtHtml = '';
    const deadline = Date.now() + 5000;
    while (!builtHtml.trimEnd().endsWith('</html>') && Date.now() < deadline) {
      try {builtHtml = readFileSync(join(output, 'index.html'), 'utf8');} catch (error) {if (error.code !== 'ENOENT') throw error;}
      if (!builtHtml.trimEnd().endsWith('</html>')) await new Promise((done) => setTimeout(done, 20));
    }
    assert.ok(builtHtml.trimEnd().endsWith('</html>'), 'Application build completed');
    const html = builtHtml.replace(/<script\s+src="[^"]+"><\/script>/g, '');
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', (error) => errors.push(String(error)));
    dom = new JSDOM(html, {
      runScripts: 'dangerously', pretendToBeVisual: true,
      url: 'https://upskillsprint.com/engineering-tools/grade-specification-lookup/',
      virtualConsole, beforeParse(window) {window.scrollTo = () => {}; window.print = () => {};}
    });
    const qa = dom.window.__gradeSpecQA;
    const entry = qa.findEntry({bodyKey: 'ASTM', gradeKey: 'ASTM_A36_A36M_GRADE_A36'});
    const input = qa.defaultCheckInput(entry);
    Object.assign(input, {
      tMM: 30, analysisType: 'PRODUCT', chemistry: {C: 0.20, Mn: 1, Si: 0.20, P: 0.02, S: 0.02},
      ys: 300, uts: 450, elongation: 24,
      standardContext: {form: 'PLATE', widthMM: 400, gaugeLengthMM: 50, unitBasis: 'SI'}
    });
    const report = qa.runCompliance(input, entry);
    assert.equal(report.verdict, 'INCOMPLETE');
    assert.ok(report.coverage.missing.some((text) => text.includes('A6/A6M product-analysis acceptance tolerances')));
    assert.deepEqual(errors, []);
  } finally {
    dom?.window.close();
    rmSync(output, {recursive: true, force: true});
  }
});

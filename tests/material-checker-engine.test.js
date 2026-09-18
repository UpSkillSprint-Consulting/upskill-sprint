'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const Engine = require('../tools/material-checker-engine.js');

test('engine self-tests pass', () => {
  const result = Engine.runSelfTests();
  assert.equal(result.passed, true, JSON.stringify(result.tests.filter(item => !item.passed)));
});

test('72 ksi passes a 485 to 635 MPa rule', () => {
  const result = Engine.evaluateRule({propertyCode: 'ys', min: 485, max: 635, unit: 'MPa', clause: 'Table 1'}, {ys: {value: 72, unit: 'ksi'}});
  assert.equal(result.status, 'pass');
});

test('60 ksi fails a 485 MPa minimum', () => {
  const result = Engine.evaluateRule({propertyCode: 'ys', min: 485, unit: 'MPa', clause: 'Table 1'}, {ys: {value: 60, unit: 'ksi'}});
  assert.equal(result.status, 'fail');
});

test('package applicability checks thickness', () => {
  const result = Engine.evaluatePackage({
    id: 'pkg', name: 'test', applicability: {thicknessMin: 10, thicknessMax: 20, thicknessUnit: 'mm'},
    rules: [{id: 'r', propertyCode: 'x', min: 1, unit: 'MPa', clause: 'Table 1'}]
  }, {x: {value: 2, unit: 'MPa'}}, {}, {thickness: 25, thicknessUnit: 'mm'});
  assert.equal(result.status, 'not-applicable');
});

test('CSV parser preserves quoted commas', () => {
  const rows = Engine.parseCSV('id,comment\n1,"hello, world"\n');
  assert.deepEqual(rows, [{id: '1', comment: 'hello, world'}]);
});

test('batch summary counts exceptions', () => {
  const summary = Engine.summarizeBatch([
    {result: {status: 'pass', rows: []}},
    {result: {status: 'fail', rows: [{status: 'fail', label: 'Yield strength'}]}}
  ]);
  assert.equal(summary.total, 2);
  assert.equal(summary.counts.fail, 1);
  assert.equal(summary.pareto[0].label, 'Yield strength');
});

test('missing applicability discriminators are conditional, not not-applicable', () => {
  const result = Engine.evaluatePackage({
    id: 'pkg',
    name: 'Controlled package',
    status: 'Approved',
    edition: '2026',
    lastVerified: '2026-09-01',
    controlRequired: true,
    applicability: {productForms: ['Plate'], psl: ['PSL 2'], thicknessMin: 10, thicknessMax: 20, thicknessUnit: 'mm'},
    rules: [{id: 'r', propertyCode: 'ys', min: 450, unit: 'MPa', clause: 'Table 1', verified: true}]
  }, {ys: {value: 500, unit: 'MPa'}}, {}, {});
  assert.equal(result.status, 'conditional');
  assert.equal(result.applicability.outOfScope, false);
  assert.ok(result.rows.some(row => row.category === 'applicability'));
});

test('a true product-form mismatch is not applicable', () => {
  const result = Engine.evaluatePackage({
    applicability: {productForms: ['Plate']},
    rules: [{propertyCode: 'ys', min: 450, unit: 'MPa', clause: 'Table 1'}]
  }, {ys: {value: 500, unit: 'MPa'}}, {}, {productForm: 'Line pipe'});
  assert.equal(result.status, 'not-applicable');
  assert.equal(result.applicability.outOfScope, true);
});

test('draft and explicitly unverified rule packages cannot return a clean pass', () => {
  const result = Engine.evaluatePackage({
    status: 'Draft',
    edition: '2026',
    lastVerified: '',
    controlRequired: true,
    applicability: {},
    rules: [{propertyCode: 'ys', min: 450, unit: 'MPa', clause: 'Table 1', verified: false}]
  }, {ys: {value: 500, unit: 'MPa'}}, {}, {});
  assert.equal(result.status, 'pass-with-warnings');
  assert.ok(result.warnings.some(warning => /not approved/i.test(warning)));
  assert.ok(result.warnings.some(warning => /not been independently verified/i.test(warning)));
});

test('approved verified package can return a clean pass', () => {
  const result = Engine.evaluatePackage({
    status: 'Approved',
    edition: '2026',
    lastVerified: '2026-09-01',
    controlRequired: true,
    applicability: {},
    rules: [{propertyCode: 'ys', min: 450, unit: 'MPa', clause: 'Table 1', verified: true}]
  }, {ys: {value: 500, unit: 'MPa'}}, {}, {});
  assert.equal(result.status, 'pass');
  assert.deepEqual(result.warnings, []);
});

test('missing imported unit is review rather than an assumed pass', () => {
  const result = Engine.evaluateRule(
    {propertyCode: 'ys', min: 450, unit: 'MPa', clause: 'Table 1'},
    {ys: {value: 500, unit: ''}}
  );
  assert.equal(result.status, 'review');
  assert.match(result.detail, /unit is missing/i);
});

test('capability separates I-MR Cpk from overall Ppk', () => {
  const result = Engine.capability([1, 2, 3, 10, 11, 12], 0, 15);
  assert.ok(Number.isFinite(result.cpk));
  assert.ok(Number.isFinite(result.ppk));
  assert.notEqual(result.cpk, result.ppk);
  assert.equal(result.withinStandardDeviation, result.movingRangeMean / 1.128);
  assert.match(result.caution, /I-MR/i);
});

test('ambiguous partial field headers are not silently mapped', () => {
  const config = {PROPERTIES: {mechanical: [
    {code: 'ys', label: 'Yield strength', aliases: []},
    {code: 'uts', label: 'Tensile strength', aliases: []}
  ]}};
  const result = Engine.mapHeader('strength', config, {});
  assert.equal(result.code, '');
  assert.match(result.source, /ambiguous|confirm manually/i);
});

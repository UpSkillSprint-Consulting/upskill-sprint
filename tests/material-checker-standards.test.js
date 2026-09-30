'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const Standards = require('../tools/material-checker-standards.js');
const Engine = require('../tools/material-checker-engine.js');

const actual = (value, unit = '%') => ({value, unit});
const controlScope = {materialId:'AUDIT-TEST',sourceEdition:'Controlled MTR revision 1',requirementStatus:'controlled',assessmentDate:Engine.localISODate()};
const plate = extra => ({...controlScope,targetStandard: 'ASTM A36/A36M', targetGrade: 'Grade A36', targetEdition: 'ASTM A36/A36M-19',
  productForm: 'Plate', thickness: 30, thicknessUnit: 'mm', width: 601, widthUnit: 'mm',
  standardContext: {form: 'PLATE', analysisType: 'HEAT', unitBasis: 'SI', gaugeLengthMM: 50, bearingUse: 'NONE', floorPlate: false, copperSpecified: false, impactSupplement: false}, ...extra});
const structural = extra => ({...controlScope,targetStandard: 'CSA G40.21', targetGrade: 'Grade 350W', targetEdition: 'CSA G40.20-13/G40.21-13 (R2023), Update No. 1 (May 2014)',
  productForm: 'Plate', thickness: 20, thicknessUnit: 'mm', width: 600, widthUnit: 'mm',
  standardContext: {form: 'PLATE', analysisType: 'HEAT', unitBasis: 'SI', gaugeLengthMM: 200, tensileOrientation: 'LONGITUDINAL', productSubtype: 'ROLLED', supplyCondition: 'AS_ROLLED', tensileSpecimenType: 'RECTANGULAR'}, ...extra});
const pipe = extra => ({...controlScope,targetStandard: 'CSA Z245.1', targetGrade: 'Grade 483', targetEdition: 'CSA Z245.1:26', productForm: 'Line pipe',
  thickness: 10, thicknessUnit: 'mm', standardContext: {form: 'ERW_HFW', analysisType: 'HEAT', category: 'II', supplyCondition: 'AS_MANUFACTURED', odMM: 457, nominalAreaMM2: 400, gaugeLengthMM: 50, orderTemperatureC: -20, toughnessTarget: 'BODY', serviceCondition: 'BASE'},
  standardTests: {cvnEnergies: [40, 40, 40], cvnUnit: 'J', cvnSize: '10x10', testTemperatureC: -20, cvnShears: [85,85,85], orderHeatCount: 4, hydroPressureMPa: 21, hydroHoldSeconds: 5}, ...extra});
const evaluate = (scope, actuals = {}, evidence = {}) => Standards.evaluate({scope, actuals, evidence, engine: Engine});
const property = (result, code) => {
  const row = result.rows.find(r => r.propertyCode === code && r.id.includes('numeric'));
  assert.ok(row, 'Expected audited numeric requirement ' + code);
  return row;
};
const named = (result, pattern) => {const row = result.rows.find(r => pattern.test(r.label)); assert.ok(row, String(pattern)); return row;};

test('checker carries the same 66 audited grade records and source fingerprints', () => {
  const catalog = Standards.catalogue();
  assert.deepEqual(catalog.map(c => [c.family,c.grades.length]), [['A36',1],['G40',29],['Z245',36]]);
  for (const item of catalog) assert.match(item.sourceHash, /^[a-f0-9]{64}$/);
  assert.ok(catalog[1].catalog.length >= 133);
  assert.ok(catalog[2].catalog.length >= 69);
});

test('wide A36 plate fails its audited carbon limit despite a passing manual limit', () => {
  const scope = plate();
  const result = Engine.evaluatePackage({standard: scope.targetStandard, grade: scope.targetGrade, edition: scope.targetEdition,
    standardContext: scope.standardContext, rules: [{propertyCode: 'chem_carbon', max: .26, unit: '%', clause: 'Manual table'}]}, {chem_carbon: actual(.26)}, {}, scope);
  assert.equal(result.status, 'fail');
  assert.equal(property(result, 'chem_carbon').status, 'fail');
  assert.match(property(result, 'chem_carbon').acceptance, /0\.25/);
});

test('A36 unprocessed coil and missing product context cannot pass', () => {
  for (const scope of [plate({productForm: 'Coil', standardContext: {...plate().standardContext, form: 'COIL'}}),
    {targetStandard: 'ASTM A36/A36M', targetGrade: 'Grade A36', targetEdition: '19'}]) {
    const result = evaluate(scope, {chem_carbon: actual(.1)});
    assert.notEqual(Engine.summarizeResults(result.rows, []).status, 'pass');
    assert.ok(result.rows.some(r => ['fail','missing','invalid','review'].includes(r.status)));
  }
});

test('A36 SI and independently standardized inch-pound strength limits remain distinct', () => {
  const si = evaluate(plate(), {mech_yield_strength: actual(249, 'MPa')});
  const imperial = evaluate(plate({standardContext: {...plate().standardContext, unitBasis: 'IMPERIAL', gaugeLengthMM: 50.8}}), {mech_yield_strength: actual(249, 'MPa')});
  assert.equal(property(si, 'mech_yield_strength').status, 'fail');
  assert.equal(property(imperial, 'mech_yield_strength').status, 'pass');
});

test('A36 unknown product-analysis tolerances remain a mandatory gap', () => {
  const scope = plate({standardContext: {...plate().standardContext, analysisType: 'PRODUCT'}});
  const inspection = Standards.inspect({scope, engine: Engine});
  const evidence = Object.fromEntries(inspection.documentaryChecks.map(c => [c.id, {value: 'yes', reference: 'Generic review record'}]));
  const result = evaluate(scope, {chem_carbon: actual(.1)}, evidence);
  assert.ok(result.rows.some(r => r.status === 'missing' && /A6.*tolerances/i.test(r.label + ' ' + r.detail)));
});

test('A36 batch packages resolve plate dimensions for each record', () => {
  const scope = plate();
  const identity = Standards.identify(scope);
  const pkg = {standard: scope.targetStandard, grade: scope.targetGrade, edition: scope.targetEdition,
    standardContext: scope.standardContext, attachedStandard: {family:identity.family,edition:identity.edition,sourceHash:identity.sourceHash,gradeKey:identity.gradeKey}, rules: []};
  const wide = Engine.evaluatePackage(pkg, {chem_carbon: actual(.26)}, {}, scope);
  const narrow = Engine.evaluatePackage(pkg, {chem_carbon: actual(.26)}, {}, {...scope, width: 300});
  assert.equal(property(wide,'chem_carbon').status, 'fail');
  assert.equal(property(narrow,'chem_carbon').status, 'pass');
});

test('G40 strength uses nearest-five-MPa conformance rounding', () => {
  assert.equal(property(evaluate(structural(), {mech_yield_strength: actual(348,'MPa')}),'mech_yield_strength').status, 'pass');
  assert.equal(property(evaluate(structural(), {mech_yield_strength: actual(347,'MPa')}),'mech_yield_strength').status, 'fail');
});

test('G40 impact permits two below-average specimens when every individual meets its floor', () => {
  const scope = structural({targetGrade: 'Grade 350WT', standardContext: {...structural().standardContext, impactCategory: 2},
    standardTests: {cvnEnergies: [18,18,45], cvnUnit: 'J', cvnSize: '10x10', testTemperatureC: -20}});
  const result = evaluate(scope);
  assert.equal(named(result,/CVN average/).status,'pass');
  assert.equal(named(result,/CVN minimum individual/).status,'pass');
});

test('G40 subsize uses the tabulated 14 J half-size average with source rounding', () => {
  const scope = structural({targetGrade: 'Grade 350WT', standardContext: {...structural().standardContext, impactCategory: 2},
    standardTests: {cvnEnergies: [13.8,13.8,13.8], cvnUnit: 'J', cvnSize: '1/2 size', testTemperatureC: -20}});
  const result = evaluate(scope);
  assert.equal(named(result,/CVN average/).status,'pass');
  assert.match(named(result,/CVN average/).acceptance,/14/);
});

test('Z245 uses CSA CE including silicon, niobium and boron rather than IIW', () => {
  const chemistry = {chem_carbon:actual(.19),chem_manganese:actual(1.1),chem_silicon:actual(.5),chem_niobium:actual(.11),chem_boron:actual(.001),
    chem_copper:actual(0),chem_nickel:actual(0),chem_chromium:actual(0),chem_molybdenum:actual(0),chem_vanadium:actual(0)};
  assert.ok(Engine.calculateDerived(chemistry,{}).ceiiw.value < .4);
  const row = named(evaluate(pipe(),chemistry),/CSA carbon equivalent/);
  assert.equal(row.status,'fail');
  assert.ok(Math.abs(parseFloat(row.actual)-.4145409474552859)<1e-8);
});

test('Z245 CE requires every formula input and cannot use a reported IIW value instead', () => {
  const result = evaluate(pipe(), {chem_carbon:actual(.1),chem_ceiiw:actual(.2)});
  assert.equal(named(result,/CSA carbon equivalent/).status,'missing');
  const required = Standards.inspect({scope: pipe(),engine:Engine}).requiredProperties.map(p=>p.code);
  for (const code of ['chem_copper','chem_nickel','chem_chromium','chem_molybdenum','chem_niobium','chem_boron']) assert.ok(required.includes(code),code);
});

test('Z245 individual impact results catch the two-below-average false pass', () => {
  const result = evaluate(pipe({standardTests:{...pipe().standardTests,cvnEnergies:[30,30,60]}}));
  assert.equal(named(result,/CVN average/).status,'pass');
  assert.equal(named(result,/count below required/).status,'fail');
});

test('Z245 aggregate impact summaries never replace three individual observations', () => {
  const result = evaluate(pipe({standardTests:{...pipe().standardTests,cvnEnergies:[]}}), {
    charpy_average_energy: actual(40,'J'),charpy_minimum_individual_energy:actual(30,'J')});
  assert.ok(result.rows.some(r=>r.status==='missing'&&/three individual CVN/.test(r.label)));
});

test('Z245 mean is rounded from raw specimen values before the acceptance comparison', () => {
  const result = evaluate(pipe({standardTests:{...pipe().standardTests,cvnEnergies:[39.4,39.4,40]}}));
  assert.equal(named(result,/CVN average/).status,'pass');
  assert.equal(Number(named(result,/CVN average/).actual),40);
  assert.equal(named(result,/count below required/).status,'fail');
});

test('Z245 welded large pipe requires two DWTT observations and a ten-second hydro hold', () => {
  const scope = pipe({thickness:5,standardContext:{...pipe().standardContext,odMM:600},standardTests:{...pipe().standardTests,dwttShears:[60,60],dwttTemperatureC:-20,hydroPressureMPa:7.2,hydroHoldSeconds:5}});
  const result = evaluate(scope);
  assert.equal(named(result,/Hydrostatic pressure/).status,'pass');
  assert.equal(named(result,/Hydrostatic hold duration/).status,'fail');
  assert.ok(result.rows.some(r=>/DWTT/.test(r.label)&&r.status==='pass'));
  const incomplete=evaluate({...scope,standardTests:{...scope.standardTests,dwttShears:[60]}});
  assert.ok(incomplete.rows.some(r=>r.status==='missing'&&/two individual DWTT/.test(r.label)));
});

test('standard field conflicts, malformed evidence and negative inputs cannot produce source passes', () => {
  const mismatch=evaluate(pipe({productForm:'Plate'}));
  assert.ok(mismatch.rows.some(r=>['fail','invalid','missing'].includes(r.status)&&/form/i.test(r.label)));
  for (const value of ['not a number', -1, true]) {
    const result=evaluate(plate(),{chem_carbon:actual(value)});
    assert.ok(result.rows.some(r=>r.status==='invalid'));
  }
});

test('different source editions and unsupported structural grades cannot apply the audit silently', () => {
  for (const scope of [plate({targetEdition:'2026'}),structural({targetGrade:'Grade 230G'})]) {
    const result=evaluate(scope);
    assert.notEqual(Engine.summarizeResults(result.rows,[]).status,'pass');
    assert.ok(result.rows.some(r=>/edition|grade/i.test(r.label)&&r.status!=='pass'));
  }
});

test('pipe elongation is based on nominal area and specified minimum tensile strength', () => {
  const low=evaluate(pipe(),{mech_tensile_strength:actual(565,'MPa'),mech_elongation:actual(21,'%')});
  const high=evaluate(pipe(),{mech_tensile_strength:actual(760,'MPa'),mech_elongation:actual(21,'%')});
  assert.equal(property(low,'mech_elongation').acceptance,property(high,'mech_elongation').acceptance);
  assert.match(property(low,'mech_elongation').acceptance,/21/);
});

test('pipe yield-to-tensile ratio carries the flattened-specimen distinction', () => {
  const actuals={mech_yield_strength:actual(730,'MPa'),mech_tensile_strength:actual(780,'MPa')};
  const context={...pipe().standardContext,odMM:400,tensileSpecimen:'FLATTENED_STRIP'};
  const flat=evaluate(pipe({targetGrade:'Grade 620',standardContext:context}),actuals);
  const other=evaluate(pipe({targetGrade:'Grade 620',standardContext:{...context,tensileSpecimen:'OTHER'}}),actuals);
  assert.equal(property(flat,'mech_yt_ratio').status,'fail');
  assert.equal(property(other,'mech_yt_ratio').status,'pass');
});

test('Vickers macrohardness is a valid source-scale alternative to HRC', () => {
  for (const [value, expected] of [[300,'pass'],[303,'fail']]) {
    const result=evaluate(pipe(),{mech_hardness_hv:actual(value,'HV')});
    assert.equal(named(result,/Macrohardness \(HV10\)/).status,expected);
    assert.ok(!result.rows.some(r=>r.propertyCode==='mech_hardness_hrc'&&r.status==='missing'));
  }
});

test('source result precision also applies to G40 elongation and combined alloy results', () => {
  const result=evaluate(structural(),{mech_elongation:actual(18.9,'%'),chem_niobium:actual(.075),chem_vanadium:actual(.076)});
  assert.equal(property(result,'mech_elongation').status,'pass');
  assert.equal(property(result,'chem_sum_Nb_V').status,'pass');
});

test('omitted or incompatible units on individual source tests block a verdict', () => {
  for (const unit of ['', 'kcal']) {
    const result=evaluate(pipe({standardTests:{...pipe().standardTests,cvnUnit:unit}}));
    assert.ok(result.rows.some(r=>r.status==='invalid'&&/CVN energy/.test(r.label)));
  }
});

test('a plate cannot select HSS subtype to bypass structural plate thickness limits', () => {
  const scope=structural({thickness:250,standardContext:{...structural().standardContext,productSubtype:'HSS',gaugeLengthMM:50}});
  const result=evaluate(scope);
  assert.ok(result.rows.some(r=>['fail','invalid','missing'].includes(r.status)&&/subtype|form/i.test(r.label)));
});

test('contradictory pipe grade/category context cannot waive mandatory toughness', () => {
  const scope=pipe({targetGrade:'Grade 483 Category II',standardContext:{...pipe().standardContext,category:'I'},standardTests:{hydroPressureMPa:21,hydroHoldSeconds:5}});
  const result=evaluate(scope);
  assert.ok(result.rows.some(r=>['fail','invalid','missing'].includes(r.status)&&/category/i.test(r.label)));
});

test('unrecognized structural delivery and specimen context stays unresolved', () => {
  for (const key of ['supplyCondition','productSubtype','tensileOrientation','tensileSpecimenType']) {
    const result=evaluate(structural({standardContext:{...structural().standardContext,[key]:'UNKNOWN'}}));
    assert.ok(result.rows.some(r=>['missing','invalid','review','fail'].includes(r.status)&&r.label.includes(key)),key);
  }
});

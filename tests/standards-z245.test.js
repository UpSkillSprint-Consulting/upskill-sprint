const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const { brotliDecompressSync } = require('node:zlib');

const sandbox = vm.createContext({});
vm.runInContext(readFileSync(resolve(__dirname, '../source-assets/grade-specification-lookup/audited-z245.js'), 'utf8'), sandbox);
const data = { specBodies: { CSA_Z245_1: { grades: {} } } };
sandbox.applyAuditedZ245(data);
const grades = data.specBodies.CSA_Z245_1.grades;
const grade = (number = 483, category = 'III') => grades[`GR_${number}_CAT_${category}`];
const context = (extra = {}) => ({ form: 'ERW_HFW', supplyCondition: 'AS_MANUFACTURED', odMM: 323.9, thicknessMM: 10, nominalAreaMM2: 400, gaugeLengthMM: 50, orderTemperatureC: -20, ...extra });
const lookup = (extra = {}, number = 483, category = 'III') => sandbox.resolveAuditedZ245(grade(number, category), context(extra));
const mechanical = (assessment) => assessment.grade.mechanical.thicknessBreakpoints[0];
const energy = (assessment) => assessment.grade.charpy.energyFullSize.average.min.value;
const evaluate = (input = {}, extra = {}, number = 483, category = 'III') => sandbox.evaluateAuditedZ245({ cvn1: 18, cvn2: 18, cvn3: 18, cvnTemp: -20, cvnSize: '10x10', ...input }, context(extra), grade(number, category));
const check = (assessment, name) => {
  const result = assessment.additionalChecks.find((item) => item.name === name);
  assert.ok(result, `Expected assessment check: ${name}`);
  return result;
};
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} should equal ${expected}`);
const chemistry = (carbon) => ({ C: carbon, Mn: 1.2, Si: 0.24, Cu: 0.15, Ni: 0.4, Cr: 0.1, Mo: 0.05, V: 0.03, Nb: 0.04, B: 0.0005 });

test('Z245 audit installs the attached :26 edition, all standard grades and all three categories', () => {
  const standardGrades = [241, 290, 359, 386, 414, 448, 483, 550, 620, 690, 825];
  assert.equal(data.specBodies.CSA_Z245_1.displayName, 'CSA Z245.1:26 — Steel pipe');
  for (const number of standardGrades) {
    for (const category of ['I', 'II', 'III']) {
      const record = grade(number, category);
      assert.ok(record);
      assert.equal(record.specEdition, 'CSA Z245.1:26');
      assert.equal(record.category, `CAT_${category}`);
      assert.equal(record.charpy.required, category !== 'I');
      assert.equal(record.charpy.testTemp.value, null, 'Order temperature must not be fabricated');
    }
  }
  assert.equal(Object.keys(grades).length, 36, 'Eleven standard grades plus retained intermediate 317, each with three categories');
});

test('Table 5 CE uses the CSA factor formula rather than IIW/Pcm acceptance', () => {
  // Values independently calculated from the attached CSA formula; these alloys make
  // omission of Si, Nb or the carbon-dependent factor materially observable.
  const expectations = [[0.0599, 0.53, 0.211745], [0.06, 0.5415863482469612, 0.21516448877275435], [0.12, 0.75, 0.334875], [0.21, 0.9867015032115671, 0.49268998067011394]];
  for (const [carbon, factor, value] of expectations) {
    const result = sandbox.computeAuditedZ245CE(chemistry(carbon));
    close(result.F, factor);
    close(result.value, value);
    assert.equal(result.missing.length, 0);
  }
  const ce = grade().chemistry.carbonEquivalent;
  assert.equal(ce.ceIiw.limit.value, 0.40, 'Legacy engine slot is explicitly relabelled CSA CE');
  assert.match(ce.ceIiw.formula, /^CSA CE/);
  assert.match(ce.ceIiw.limit.displayNote, /CSA-specific CE/);
  assert.equal(ce.cePcm.limit.value, null);
  assert.match(ce.ceIiw.formula, /Si\/24/);
  assert.match(ce.ceIiw.formula, /Nb/);
});

test('CE calculation requires every formula element even in the below-0.06-carbon branch', () => {
  for (const carbon of [0.05999, 0.06]) {
    for (const symbol of ['C', 'Mn', 'Si', 'Cu', 'Ni', 'Cr', 'Mo', 'V', 'Nb', 'B']) {
      for (const invalid of [undefined, '', null, 'not numeric']) {
        const result = sandbox.computeAuditedZ245CE({ ...chemistry(carbon), [symbol]: invalid });
        assert.equal(result.value, null, `${symbol} must be provided at C=${carbon}`);
        assert.ok(result.missing.includes(symbol));
      }
    }
  }
  assert.equal(sandbox.computeAuditedZ245CE({ ...chemistry(0.05), B: 0 }).missing.length, 0, 'A measured zero is valid and differs from blank');
});

test('intermediate Grade 317 uses Table 8 interpolation with independent rounded endpoints', () => {
  const row = mechanical(lookup({ odMM: 400 }, 317));
  assert.equal(row.yieldStrength.min.value, 317);
  assert.equal(row.yieldStrength.max.value, 510, '495 + (317−290)/(359−290) × (530−495), nearest 5 MPa');
  assert.equal(row.tensileStrength.min.value, 430, '414 + (317−290)/(359−290) × (455−414), nearest 5 MPa');
  assert.equal(row.tensileStrength.max.value, 760);
  assert.equal(row.ytRatio.max.value, 0.93);
  assert.match(grade(317).displayName, /intermediate/i);
});

test('elongation uses rounded nominal area capped at 500 mm² and specified minimum TS', () => {
  const cases = [[100, 565, 100, 16], [200, 565, 200, 19], [400, 565, 400, 21], [499.4, 565, 499, 22], [499.6, 565, 500, 22], [1000, 565, 500, 22], [400, 455, 400, 26]];
  for (const [area, minimumTs, expectedArea, expectedElongation] of cases) {
    const result = sandbox.computeAuditedZ245Elongation(area, minimumTs);
    assert.equal(result.A, expectedArea);
    assert.equal(result.U, minimumTs);
    assert.equal(result.value, expectedElongation);
    assert.equal(result.gaugeLengthMM, 50);
  }
  assert.equal(mechanical(lookup({ uts: 900 })).elongation.fixedMin.value, 21, 'Measured UTS must not replace the specified minimum U=565');
  assert.equal(mechanical(lookup({ nominalAreaMM2: undefined, stripWidth: 40, stripThickness: 10 })).elongation.fixedMin.value, 21);
  for (const invalid of [null, '', 0, -1]) assert.equal(sandbox.computeAuditedZ245Elongation(invalid, 565), null);
});

test('missing area or gauge and unconfirmed conversion cannot silently complete elongation context', () => {
  const missing = lookup({ nominalAreaMM2: '', gaugeLengthMM: '' });
  assert.equal(mechanical(missing).elongation.fixedMin.value, null);
  assert.ok(missing.missingContext.includes('Nominal tensile specimen cross-sectional area'));
  assert.ok(missing.missingContext.some((text) => /Elongation gauge length.*conversion to\s*50\s*mm/.test(text)));
  const unconverted = lookup({ gaugeLengthMM: 25 });
  assert.ok(unconverted.missingContext.some((text) => /Confirmed ISO\s*2566-1 elongation conversion to\s*50\s*mm/.test(text)));
  const confirmed = lookup({ gaugeLengthMM: 25, elongationConvertedTo50MM: true });
  assert.ok(!confirmed.missingContext.some((text) => /Confirmed ISO\s*2566-1 elongation conversion/.test(text)));
  assert.ok(confirmed.manualChecks.some((text) => /ISO\s*2566-1/.test(text)));
});

test('Table 8 maxima apply at OD 219.1 mm inclusively and Y/T only at OD 355.6 mm inclusively', () => {
  assert.equal(mechanical(lookup({ odMM: 219.099 })).yieldStrength.max.value, null);
  assert.equal(mechanical(lookup({ odMM: 219.099 })).tensileStrength.max.value, null);
  assert.equal(mechanical(lookup({ odMM: 219.1 })).yieldStrength.max.value, 620);
  assert.equal(mechanical(lookup({ odMM: 219.1 })).tensileStrength.max.value, 760);
  assert.equal(mechanical(lookup({ odMM: 355.599 })).ytRatio.max.value, null);
  assert.equal(mechanical(lookup({ odMM: 355.6 })).ytRatio.max.value, 0.93);
});

test('Grade 620 and 690 ratio limits distinguish flattened strips from other specimens', () => {
  for (const [number, otherRatio] of [[620, 0.95], [690, 0.97]]) {
    assert.equal(mechanical(lookup({ odMM: 355.6, tensileSpecimen: 'FLATTENED_STRIP' }, number)).ytRatio.max.value, 0.93);
    assert.equal(mechanical(lookup({ odMM: 355.6, tensileSpecimen: 'ROUND' }, number)).ytRatio.max.value, otherRatio);
    const missing = lookup({ odMM: 355.6, tensileSpecimen: '' }, number);
    assert.equal(mechanical(missing).ytRatio.max.value, null);
    assert.ok(missing.missingContext.includes('Tensile specimen type (flattened strip or other)'));
  }
  assert.equal(mechanical(lookup({ odMM: 400 }, 825)).ytRatio.max.value, 0.99);
  const invalid = lookup({ odMM: 400, tensileSpecimen: 'UNKNOWN' }, 620);
  assert.equal(mechanical(invalid).ytRatio.max.value, null);
  assert.ok(invalid.missingContext.includes('Tensile specimen type (flattened strip or other)'));
});

test('every standard grade retains independently transcribed Table 8 strength limits', () => {
  // Attached Table 8, printed p.90: grade, maximum YS, minimum TS, maximum TS.
  const table = [[241, 495, 414, 760], [290, 495, 414, 760], [359, 530, 455, 760], [386, 540, 490, 760], [414, 565, 517, 760], [448, 600, 531, 760], [483, 620, 565, 760], [550, 690, 620, 830], [620, 760, 690, 900], [690, 825, 760, 970], [825, 1050, 915, 1145]];
  for (const [number, maxYield, minTensile, maxTensile] of table) {
    const row = mechanical(lookup({ odMM: 400, tensileSpecimen: 'FLATTENED_STRIP' }, number));
    assert.equal(row.yieldStrength.min.value, number);
    assert.equal(row.yieldStrength.max.value, maxYield);
    assert.equal(row.tensileStrength.min.value, minTensile);
    assert.equal(row.tensileStrength.max.value, maxTensile);
  }
});

test('unknown manufacturing routes and absent dimensions stay unresolved; out-of-scope OD fails', () => {
  assert.ok(lookup({ form: 'PLATE' }).missingContext.includes('Manufacturing method'));
  assert.ok(lookup({ supplyCondition: 'UNKNOWN' }).missingContext.some((text) => /Supply.*heat-treatment condition/.test(text)));
  assert.ok(lookup({ supplyCondition: '' }).missingContext.some((text) => /Supply.*heat-treatment condition/.test(text)));
  assert.ok(!lookup().missingContext.some((text) => /Supply.*heat-treatment condition/.test(text)));
  assert.ok(lookup({ odMM: '' }).missingContext.includes('Nominal outside diameter'));
  assert.ok(lookup({ thicknessMM: '' }).missingContext.includes('Nominal wall thickness'));
  assert.equal(check(lookup({ odMM: 21.299 }), 'CSA pipe OD scope').status, 'FAIL');
  assert.equal(check(lookup({ odMM: 2032.001 }), 'CSA pipe OD scope').status, 'FAIL');
  for (const odMM of [21.3, 2032]) assert.equal(lookup({ odMM }).additionalChecks.some((row) => row.name === 'CSA pipe OD scope'), false);
});

test('elevated service increases maximum yield only at the grade-448 boundary', () => {
  for (const [number, baseYield, increase, tensileMaximum] of [[448, 600, 75, 760], [483, 620, 100, 760], [550, 690, 100, 830]]) {
    const row = mechanical(lookup({ odMM: 400, serviceCondition: 'ELEVATED' }, number));
    assert.equal(row.yieldStrength.max.value, baseYield + increase);
    assert.equal(row.tensileStrength.max.value, tensileMaximum);
  }
  assert.ok(lookup({ serviceCondition: 'ELEVATED' }).manualChecks.some((text) => /ASTM E21/.test(text)));
});

test('Category II energy changes at exactly 457 mm while CVN shear changes strictly above it', () => {
  for (const [od, expectedEnergy, cvnShear, dwtt] of [[456.999, 27, 60, false], [457, 40, 60, false], [457.001, 40, null, true]]) {
    const result = lookup({ odMM: od }, 483, 'II');
    assert.equal(energy(result), expectedEnergy);
    assert.equal(result.grade.charpy.shearArea.min.value, cvnShear);
    assert.equal(Boolean(result.grade.dwtt), dwtt);
  }
  assert.equal(energy(lookup({ odMM: 500 }, 483, 'III')), 18);
  assert.equal(lookup({ odMM: 500 }, 483, 'III').grade.dwtt, null);
  assert.equal(energy(lookup({ odMM: 500 }, 483, 'I')), null);
});

test('CVN compares rounded average, specimen-count rule and two-thirds floor independently', () => {
  let result = evaluate({ cvn1: 12, cvn2: 18, cvn3: 23.5 });
  assert.equal(check(result, 'CVN average (rounded whole J)').status, 'PASS', '17.833 J average rounds to 18 J');
  assert.equal(check(result, 'CVN count below required minimum').status, 'PASS');
  assert.equal(check(result, 'CVN lowest individual energy').status, 'PASS');
  result = evaluate({ cvn1: 17, cvn2: 17, cvn3: 20 });
  assert.equal(check(result, 'CVN average (rounded whole J)').status, 'PASS');
  assert.equal(check(result, 'CVN count below required minimum').status, 'FAIL', 'Two low specimens fail despite a passing average');
  result = evaluate({ cvn1: 11.999, cvn2: 18, cvn3: 24 });
  assert.equal(check(result, 'CVN lowest individual energy').status, 'FAIL');
  result = evaluate({ cvn1: 12, cvn2: 18, cvn3: 22.4 });
  assert.equal(check(result, 'CVN average (rounded whole J)').status, 'FAIL', '17.466 J rounds to 17 J');
});

test('CVN tabulated subsize factors apply to average and individual energy requirements', () => {
  const half = evaluate({ cvn1: 6, cvn2: 9, cvn3: 12, cvnSize: '10x5' });
  assert.equal(check(half, 'CVN average (rounded whole J)').limit.value, 9);
  assert.equal(check(half, 'CVN lowest individual energy').limit.value, 6);
  assert.equal(check(half, 'CVN lowest individual energy').status, 'PASS');
  const quarter = evaluate({ cvn1: 3, cvn2: 4.5, cvn3: 7.5, cvnSize: '10x2.5' });
  assert.equal(check(quarter, 'CVN average (rounded whole J)').limit.value, 4.5);
  assert.equal(check(quarter, 'CVN lowest individual energy').limit.value, 3);
  const invalid = evaluate({ cvnSize: 'CUSTOM' });
  assert.ok(invalid.missingContext.includes('Recognized CSA CVN specimen size'));
  assert.equal(invalid.additionalChecks.some((row) => row.name === 'CVN average (rounded whole J)'), false);
  assert.ok(evaluate({ cvn3: '' }).missingContext.includes('Three individual CVN energy results'));
});

test('Category II CVN shear enforces mean, individual floor, low-specimen count and five-heat order average', () => {
  const common = { cvn1: 40, cvn2: 40, cvn3: 40, shear1: 50, shear2: 60, shear3: 70, orderHeatCount: 4 };
  const passing = evaluate(common, { odMM: 457 }, 483, 'II');
  assert.equal(check(passing, 'CVN average shear area').status, 'PASS');
  assert.equal(check(passing, 'CVN minimum individual shear area').status, 'PASS');
  assert.equal(check(passing, 'CVN shear count below 60%').status, 'PASS');
  assert.equal(passing.additionalChecks.some((row) => row.name === 'Order-average shear'), false);
  assert.ok(evaluate({ ...common, orderHeatCount: '' }, { odMM: 457 }, 483, 'II').missingContext.includes('Number of heats in the order item'));
  const lowCount = evaluate({ ...common, shear1: 55, shear2: 55, shear3: 70 }, { odMM: 457 }, 483, 'II');
  assert.equal(check(lowCount, 'CVN average shear area').status, 'PASS');
  assert.equal(check(lowCount, 'CVN shear count below 60%').status, 'FAIL');
  assert.equal(check(evaluate({ ...common, shear1: 49.9, shear3: 70.1 }, { odMM: 457 }, 483, 'II'), 'CVN minimum individual shear area').status, 'FAIL');
  assert.ok(evaluate({ ...common, orderHeatCount: 5 }, { odMM: 457 }, 483, 'II').missingContext.some((text) => /Order average shear.*five or more heats/.test(text)));
  assert.equal(check(evaluate({ ...common, orderHeatCount: 5, orderAverageShear: 84.999 }, { odMM: 457 }, 483, 'II'), 'Order-average shear').status, 'FAIL');
  assert.equal(check(evaluate({ ...common, orderHeatCount: 5, orderAverageShear: 85 }, { odMM: 457 }, 483, 'II'), 'Order-average shear').status, 'PASS');
});

test('DWTT uses two specimens, rounded shear mean, individual 50% floor and ordered temperature', () => {
  const common = { cvn1: 40, cvn2: 40, cvn3: 40, dwtt1: 50, dwtt2: 69, dwttTemp: -20 };
  const passing = evaluate(common, { odMM: 457.001 }, 483, 'II');
  assert.equal(check(passing, 'DWTT average shear area').status, 'PASS', '59.5% rounds to 60%');
  assert.equal(check(passing, 'DWTT average shear area').value, 60);
  assert.equal(check(passing, 'DWTT average shear area').limit.unit, 'pct');
  assert.equal(check(passing, 'DWTT minimum individual shear area').status, 'PASS');
  assert.equal(check(passing, 'DWTT test temperature').status, 'PASS');
  const fail = evaluate({ ...common, dwtt1: 49, dwtt2: 71, dwttTemp: -19.9 }, { odMM: 457.001 }, 483, 'II');
  assert.equal(check(fail, 'DWTT average shear area').status, 'PASS');
  assert.equal(check(fail, 'DWTT minimum individual shear area').status, 'FAIL');
  assert.equal(check(fail, 'DWTT test temperature').status, 'FAIL');
  assert.ok(evaluate({ ...common, dwtt2: '' }, { odMM: 500 }, 483, 'II').missingContext.includes('Two individual DWTT shear areas'));
  assert.equal(evaluate(common, { odMM: 457 }, 483, 'II').additionalChecks.some((row) => row.name.startsWith('DWTT')), false);
});

test('body CVN temperature is contractual and seamless small-pipe orientation is longitudinal', () => {
  const missing = lookup({ orderTemperatureC: '' });
  assert.equal(missing.grade.charpy.testTemp.value, null);
  assert.ok(missing.missingContext.includes('Ordered body toughness test temperature'));
  assert.equal(check(evaluate({ cvnTemp: -30 }), 'CVN test temperature').status, 'PASS');
  assert.equal(check(evaluate({ cvnTemp: -19.99 }), 'CVN test temperature').status, 'FAIL');
  assert.equal(lookup({ form: 'SEAMLESS', odMM: 114.3 }).grade.charpy.orientation, 'LONGITUDINAL');
  assert.equal(lookup({ form: 'SEAMLESS', odMM: 114.301 }).grade.charpy.orientation, 'TRANSVERSE');
});

test('EW fusion-line and SAW HAZ tests retain distinct energy and temperature conditions', () => {
  const fusion = lookup({ toughnessTarget: 'EW_FUSION_LINE', odMM: 457 }, 483, 'II');
  assert.equal(energy(fusion), 18);
  assert.equal(fusion.grade.charpy.testTemp.value, -5);
  assert.equal(lookup({ toughnessTarget: 'EW_FUSION_LINE', fusionLineOrderTemperatureC: -30 }).grade.charpy.testTemp.value, -30);
  assert.equal(check(lookup({ toughnessTarget: 'EW_FUSION_LINE', fusionLineOrderTemperatureC: -4 }), 'EW fusion-line ordered temperature').status, 'FAIL');
  assert.equal(check(lookup({ form: 'SAWL', toughnessTarget: 'EW_FUSION_LINE' }), 'Fusion-line toughness applicability').status, 'FAIL');
  const coldHaz = lookup({ form: 'SAWL', toughnessTarget: 'SAW_HAZ', orderTemperatureC: -5.001 });
  assert.equal(coldHaz.grade.charpy.required, true);
  assert.equal(energy(coldHaz), 18);
  assert.equal(lookup({ form: 'SAWH', toughnessTarget: 'SAW_HAZ', orderTemperatureC: -5 }).grade.charpy.required, false);
  assert.equal(lookup({ form: 'SAWH', toughnessTarget: 'SAW_HAZ', orderTemperatureC: -5, sawWeldToughnessOrdered: true }).grade.charpy.required, true);
  const zone = lookup({ toughnessTarget: 'EW_WELD_ZONE', odMM: 457 }, 483, 'II');
  assert.equal(energy(zone), 40);
  assert.equal(zone.grade.charpy.testTemp.value, -20);
  const waived = lookup({ toughnessTarget: 'EW_WELD_ZONE', ewFusionLineAtBodyTemperaturePassed: true });
  assert.equal(waived.grade.charpy.required, false);
  assert.ok(waived.manualChecks.some((text) => /supporting the weld-zone waiver/.test(text)));
});

test('ordered CVN energy can raise the requirement and cannot lower a mandatory minimum', () => {
  assert.equal(energy(lookup({ orderedCvnEnergyJ: 50 })), 50);
  assert.equal(check(lookup({ orderedCvnEnergyJ: 17 }), 'Ordered CVN energy').status, 'FAIL');
  assert.equal(energy(lookup({ orderedCvnEnergyJ: 17 })), 18);
});

test('sour service sets source Ni and hardness limits and grade-dependent tensile caps', () => {
  for (const [number, tensileCap] of [[241, 625], [386, 625], [414, 650], [448, 650], [483, 665]]) {
    const assessment = lookup({ serviceCondition: 'SOUR' }, number);
    const row = mechanical(assessment);
    assert.equal(row.tensileStrength.max.value, tensileCap);
    assert.equal(row.hardness.max.value, 22);
    assert.match(row.hardness.max.displayNote, /250\s*HV10.*250\s*HV0\.5/);
    for (const analysis of ['heat', 'product']) assert.equal(assessment.grade.chemistry.elements.Ni[analysis].max.value, 1);
    assert.equal(assessment.grade.chemistry.elements.S.heat.max.value, 0.035, 'No fabricated universal sour S=0.003%');
    assert.equal(assessment.additionalChecks.some((row) => row.name === 'Sour-service grade scope'), false);
  }
  for (const number of [550, 620, 690, 825]) {
    assert.equal(grade(number).overlays.SOUR_SERVICE.available, false);
    assert.equal(check(lookup({ serviceCondition: 'SOUR' }, number), 'Sour-service grade scope').status, 'FAIL');
  }
  assert.equal(mechanical(lookup({}, 448)).hardness.max.value, 27);
  assert.equal(mechanical(lookup({}, 483)).hardness.max.value, 30);
  assert.equal(mechanical(lookup({ annexSelections: ['SOUR_SERVICE'] }, 483)).hardness.max.value, 22);
});

test('hydro hoop-stress fractions change at source OD boundaries and holds at strict 457 mm', () => {
  const hydro = (odMM, form = 'ERW_HFW') => sandbox.computeAuditedZ245Hydro({ odMM, thicknessMM: 1, form }, 483);
  for (const [od, fraction] of [[168.299, 0.60], [168.3, 0.75], [273.099, 0.75], [273.1, 0.85], [507.999, 0.85], [508, 0.90]]) {
    const result = hydro(od);
    assert.equal(result.fiberStressFraction, fraction);
    const expectedPressure = Math.round((2 * fraction * 483 / od) * 10) / 10;
    assert.equal(result.minimumPressureMPa, expectedPressure);
  }
  assert.equal(hydro(457).holdSeconds, 5);
  assert.equal(hydro(457.001).holdSeconds, 10);
  assert.equal(hydro(1000, 'SEAMLESS').holdSeconds, 5);
  assert.equal(sandbox.computeAuditedZ245Hydro({ odMM: 400, thicknessMM: '' }, 483).minimumPressureMPa, null);
});

test('hydro source table pressures override formula and pressure caps retain Grade 241 exceptions', () => {
  const hydro = (gradeNumber, odMM, thicknessMM) => sandbox.computeAuditedZ245Hydro({ odMM, thicknessMM, form: 'ERW_HFW' }, gradeNumber);
  assert.equal(hydro(241, 21.3, 2.1).minimumPressureMPa, 4.8);
  assert.equal(hydro(290, 21.3, 2.1).minimumPressureMPa, 20.7);
  assert.equal(hydro(241, 48.3, 5.1).minimumPressureMPa, 13.1);
  assert.equal(hydro(359, 48.3, 5.1).minimumPressureMPa, 20.7);
  assert.equal(hydro(290, 42.2, 2.1).tablePressureMPa, null, 'Blank table entry requires the formula');
  assert.equal(hydro(290, 42.2, 2.1).minimumPressureMPa, 17.3);
  assert.equal(hydro(241, 88.9, 20).minimumPressureMPa, 17.2);
  assert.equal(hydro(241, 88.901, 20).minimumPressureMPa, 19.3);
  assert.equal(hydro(483, 400, 40).minimumPressureMPa, 20.7);
  const resolved = lookup({ odMM: 48.3, thicknessMM: 5.1 }, 241).grade.testing.hydrotest;
  assert.match(resolved.notes, /13\.1\s*MPa/);
  assert.match(resolved.notes, /Hold\s*≥5\s*s/);
});

test('resolution clones the audited record instead of leaking conditions into other lookups', () => {
  const original = JSON.stringify(grade());
  lookup({ serviceCondition: 'SOUR', odMM: 500, orderedCvnEnergyJ: 50 });
  assert.equal(JSON.stringify(grade()), original);
  assert.equal(mechanical(lookup()).hardness.max.value, 30);
});

test('all base and context-resolved audited grades satisfy the original strict dataset schema', () => {
  const original = brotliDecompressSync(Buffer.from(readFileSync(resolve(__dirname, '../source-assets/grade-specification-lookup/grade_spec_lookup.html.br.b64.part-01'), 'utf8').trim(), 'base64')).toString('utf8');
  const start = original.indexOf('const ENUMS');
  const marker = original.slice(start).match(/\/\/ [-]+ Rendering logic [-]+/);
  assert.ok(start > 0 && marker, 'The committed application supplies its original strict validator');
  const schemaMajor = original.match(/const SCHEMA_MAJOR\s*=\s*'([^']+)'/)[1];
  const validator = vm.createContext({ SCHEMA_MAJOR: schemaMajor });
  vm.runInContext(original.slice(start, start + marker.index), validator);
  const validate = (records, label) => {
    const dataset = {
      schemaVersion: '1.0.0', exportedAt: '2026-09-29T00:00:00.000Z',
      specBodies: { CSA_Z245_1: { displayName: 'CSA Z245.1:26 — Steel pipe', grades: records } }
    };
    assert.deepEqual(Array.from(validator.validateData(dataset)), [], label);
  };
  validate(grades, 'All 36 audited base records');
  for (const serviceCondition of ['BASE', 'SOUR']) {
    const resolved = Object.fromEntries(Object.entries(grades).map(([key, record]) => [key, sandbox.resolveAuditedZ245(record, context({ serviceCondition, odMM: 762, tensileSpecimen: 'FLATTENED_STRIP' })).grade]));
    validate(resolved, `All 36 resolved records, ${serviceCondition} service`);
  }
});

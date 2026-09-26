'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { bootTool, ready, waitFor, ROOT } = require('./helpers/steel-phase-harness.js');

const PROFESSIONAL_STORAGE_KEY = 'spx-professional-workflow-v1';
const STAGES = [
  'define', 'question', 'applicability', 'compare',
  'sensitivity', 'evidence', 'calibration', 'report'
];
const PROFESSIONAL_CSS = fs.readFileSync(
  path.join(ROOT, 'tools', 'steel-phase-explorer-professional.css'), 'utf8'
);
const GUIDE_HTML = fs.readFileSync(
  path.join(ROOT, 'tools', 'steel-phase-explorer', 'how-to-use', 'index.html'), 'utf8'
);

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function closeTo(actual, expected, tolerance = 1e-9, message = '') {
  assert.ok(Number.isFinite(actual), `${message || 'value'} is finite`);
  assert.ok(Math.abs(actual - expected) <= tolerance,
    `${message || 'value'}: expected ${expected}, received ${actual}`);
}

function issueCodes(result) {
  return new Set((result.errors || []).map(item => item.code));
}

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}

function scopePackage(pkg) {
  return Object.assign(pkg, {
    site: 'Synthetic QA site',
    line: 'QA-L1',
    processRoute: 'Synthetic austenitize and quench route',
    productFamily: 'Synthetic low-alloy plate',
    thicknessMinMm: 5,
    thicknessMaxMm: 50,
    measurementLocation: 'Quarter thickness',
    measurementBasis: 'Vickers HV10 per ASTM E384 at quarter thickness',
    coolingRateDefinition: 'Average cooling rate from 800 C to 500 C reported in C/s',
    coolingRateLocation: 'Quarter-thickness thermocouple'
  });
}

function demoPackage(api) {
  return scopePackage(copy(api.demo('json')));
}

function matchMonitoringGroupSizes(pkg) {
  const groups = new Map();
  pkg.rows.filter(row => row.role === 'monitoring').forEach(row => {
    const rows = groups.get(row.heatId) || [];
    rows.push(row);
    groups.set(row.heatId, rows);
  });
  groups.forEach(rows => {
    while (rows.length < 2) {
      const duplicate = copy(rows[0]);
      duplicate.recordId = `${rows[0].recordId}-REPLICATE-${rows.length + 1}`;
      rows.push(duplicate);
      pkg.rows.push(duplicate);
    }
  });
  return pkg;
}

function csvCell(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function appendCsvColumns(csv, columns) {
  const lines = csv.split('\n');
  const headerIndex = lines.findIndex(line => /^recordId,/i.test(line));
  assert.ok(headerIndex >= 0, 'CSV fixture has a record header');
  lines[headerIndex] += columns.map(column => `,${csvCell(column.header)}`).join('');
  for (let index = headerIndex + 1; index < lines.length; index += 1) {
    if (!lines[index]) continue;
    lines[index] += columns.map(column => {
      const value = typeof column.value === 'function'
        ? column.value(index - headerIndex - 1)
        : column.value;
      return `,${csvCell(value)}`;
    }).join('');
  }
  return lines.join('\n');
}

function unverifiedSpecContext() {
  return {
    schemaVersion: '1.0',
    specBody: 'API_5L',
    gradeKey: 'X52M_PSL2',
    displayName: 'Grade L360M / X52M PSL2',
    specEdition: 'API 5L traceability example',
    psl: 'PSL2',
    category: null,
    applicableForm: 'ERW_HFW',
    verification: {
      lastVerifiedBy: null,
      lastVerifiedDate: null,
      notes: 'Not verified'
    }
  };
}

function csvSpecComment(specContext) {
  return csvCell(`# specContext: ${JSON.stringify(specContext)}`);
}

function genericPrediction(win, row, target = 'hardness-hv') {
  const property = {
    'hardness-hv': 'hv',
    'yield-strength-mpa': 'ys',
    'tensile-strength-mpa': 'uts',
    'elongation-pct': 'elong'
  }[target];
  const result = win.__SPX.release1.propertyEstimate(
    copy(row.chemistry), Number(row.coolingRateCPerS)
  );
  assert.equal(result.valid, true, 'fixture stays inside the frozen generic model domain');
  return Number(result[property]);
}

function phaseOnePackage(win, api) {
  const pkg = demoPackage(api);
  const templates = pkg.rows.filter(row => row.role === 'calibration').slice(0, 2);
  const calibrationRows = [];
  for (let groupIndex = 0; groupIndex < 20; groupIndex += 1) {
    const offset = groupIndex % 2 ? 12 : 10;
    for (let replicateIndex = 0; replicateIndex < 2; replicateIndex += 1) {
      const row = copy(templates[replicateIndex % templates.length]);
      const groupNumber = String(groupIndex + 1).padStart(2, '0');
      row.recordId = `CAL-PHASE1-${groupNumber}-${replicateIndex + 1}`;
      row.heatId = `H-PHASE1-${groupNumber}`;
      row.timestamp = `2026-01-${groupNumber}T${10 + replicateIndex}:00:00Z`;
      row.actualValue = genericPrediction(win, row) + offset;
      calibrationRows.push(row);
    }
  }
  pkg.rows = calibrationRows.concat(pkg.rows.filter(row => row.role !== 'calibration'));
  return pkg;
}

function expectedMetrics(rows, predictionKey) {
  const residuals = rows.map(row => row.actual - row[predictionKey]);
  const actualMean = rows.reduce((sum, row) => sum + row.actual, 0) / rows.length;
  const bias = residuals.reduce((sum, value) => sum + value, 0) / residuals.length;
  const mae = residuals.reduce((sum, value) => sum + Math.abs(value), 0) /
    residuals.length;
  const sse = residuals.reduce((sum, value) => sum + value * value, 0);
  const sst = rows.reduce((sum, row) => {
    const difference = row.actual - actualMean;
    return sum + difference * difference;
  }, 0);
  return {
    bias,
    mae,
    rmse: Math.sqrt(sse / residuals.length),
    r2: sst > 0 ? 1 - sse / sst : null
  };
}

function groupMeanRows(rows, groupBy) {
  const groups = new Map();
  for (const row of rows) {
    const key = row[`${groupBy}Id`].trim().toLowerCase();
    const group = groups.get(key) || {
      actual: [], generic: [], calibrated: []
    };
    group.actual.push(row.actual);
    group.generic.push(row.generic);
    group.calibrated.push(row.calibrated);
    groups.set(key, group);
  }
  return [...groups.values()].map(group => ({
    actual: group.actual.reduce((sum, value) => sum + value, 0) / group.actual.length,
    generic: group.generic.reduce((sum, value) => sum + value, 0) / group.generic.length,
    calibrated: group.calibrated.reduce((sum, value) => sum + value, 0) /
      group.calibrated.length
  }));
}

function assertMetrics(actual, expected, label) {
  closeTo(actual.meanBias, expected.bias, 1e-9, `${label} bias`);
  closeTo(actual.mae, expected.mae, 1e-9, `${label} MAE`);
  closeTo(actual.rmse, expected.rmse, 1e-9, `${label} RMSE`);
  if (expected.r2 == null) assert.equal(actual.r2, null, `${label} R-squared`);
  else closeTo(actual.r2, expected.r2, 1e-9, `${label} R-squared`);
}

test('calibration loads between governance and the professional integration', async t => {
  const { win, record } = await tool();
  t.after(() => win.close());

  const loaded = record.loaded;
  const governanceAt = loaded.indexOf('tools/steel-phase-explorer-governance.js');
  const calibrationAt = loaded.indexOf('tools/steel-phase-explorer-calibration.js');
  const professionalAt = loaded.indexOf('tools/steel-phase-explorer-professional.js');
  assert.ok(governanceAt >= 0 && calibrationAt > governanceAt &&
    professionalAt > calibrationAt, 'loader order freezes a governed generic evaluator first');
  assert.deepEqual(record.errors, []);

  const api = win.__SPX.calibration;
  assert.equal(api.contractVersion, '1.0');
  assert.equal(api.limits.maxImportBytes, 2 * 1024 * 1024);
  assert.deepEqual(Object.keys(api.targets).sort(), [
    'elongation-pct', 'hardness-hv', 'tensile-strength-mpa',
    'yield-strength-mpa'
  ]);
  assert.equal(api.targets['hardness-hv'].unit, 'model-HV');
});

test('schema-major rejection and complete JSON and CSV packages share one contract', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;

  const jsonPackage = demoPackage(api);
  const json = api.parseJson(JSON.stringify(jsonPackage));
  assert.equal(json.ok, true, JSON.stringify(json.errors));
  assert.equal(json.format, 'json');
  assert.equal(json.validation.rowCount, 14);

  const csvText = api.demo('csv');
  const csv = api.parseCsv(csvText);
  assert.equal(csv.ok, true, JSON.stringify(csv.errors));
  assert.equal(csv.format, 'csv');
  assert.deepEqual(csv.validation.roleCounts, json.validation.roleCounts);
  assert.deepEqual(csv.validation.groupCounts, json.validation.groupCounts);

  const incompatible = copy(jsonPackage);
  incompatible.schemaVersion = '2.0';
  const rejected = api.parse(incompatible);
  assert.equal(rejected.ok, false);
  assert.ok(issueCodes(rejected).has('SCHEMA_MAJOR'));

  for (const format of ['json', 'csv']) {
    const template = api.template(format);
    const text = typeof template === 'string' ? template : JSON.stringify(template);
    for (const field of [
      'site', 'line', 'processRoute', 'productFamily', 'thicknessMinMm',
      'thicknessMaxMm', 'measurementLocation', 'measurementBasis',
      'coolingRateDefinition', 'coolingRateLocation'
    ]) assert.match(text.toLowerCase(), new RegExp(field.toLowerCase()), `${format} exposes ${field}`);
  }
});

test('CSV specification metadata conflicts fail closed while structural matches remain valid', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const spec = unverifiedSpecContext();
  const conflictingSpec = copy(spec);
  conflictingSpec.gradeKey = 'X60M_PSL2';
  conflictingSpec.displayName = 'Grade L415M / X60M PSL2';
  const comment = csvSpecComment(spec);
  const conflictingComment = csvSpecComment(conflictingSpec);
  const csv = api.demo('csv');

  const duplicateMatch = api.parseCsv(`${comment}\n${comment}\n${csv}`);
  assert.equal(duplicateMatch.ok, true, JSON.stringify(duplicateMatch.errors));
  assert.deepEqual(copy(duplicateMatch.package.specContext), spec,
    'repeated structurally equal comment metadata is accepted');

  const optionMatch = api.parseCsv(`${comment}\n${csv}`, {
    specContext: copy(spec)
  });
  assert.equal(optionMatch.ok, true, JSON.stringify(optionMatch.errors));
  assert.deepEqual(copy(optionMatch.package.specContext), spec,
    'comment and option metadata may repeat the same structural value');

  const active = api.analyze(demoPackage(api));
  assert.equal(active.ok, true);
  const activeFingerprint = api.fingerprint();
  const activeSession = copy(api.getSession());

  const duplicateConflict = api.analyze(
    `${comment}\n${conflictingComment}\n${csv}`
  );
  assert.equal(duplicateConflict.ok, false);
  assert.ok(issueCodes(duplicateConflict).has('METADATA_CONFLICT'));
  assert.equal(duplicateConflict.priorSessionPreserved, true);
  assert.equal(api.fingerprint(), activeFingerprint);
  assert.deepEqual(copy(api.getSession()), activeSession);

  const optionConflict = api.analyze(`${comment}\n${csv}`, {
    specContext: conflictingSpec
  });
  assert.equal(optionConflict.ok, false);
  assert.ok(issueCodes(optionConflict).has('METADATA_CONFLICT'));
  assert.equal(optionConflict.priorSessionPreserved, true);
  assert.equal(api.fingerprint(), activeFingerprint);
  assert.deepEqual(copy(api.getSession()), activeSession);
});

test('CSV option wrappers reject hooks and object metadata without executing user code', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const csv = api.demo('csv');
  const matchingLine = 'Synthetic heat-treatment line';

  const direct = api.parseCsv(csv, { line: matchingLine });
  assert.equal(direct.ok, true, JSON.stringify(direct.errors));
  const legacy = api.parseCsv(csv, { metadata: { line: matchingLine } });
  assert.equal(legacy.ok, true, JSON.stringify(legacy.errors));

  let getterCalls = 0;
  const hostile = {};
  Object.defineProperty(hostile, 'metadata', {
    enumerable: true,
    get() {
      getterCalls += 1;
      throw new Error('CSV metadata getter must not execute');
    }
  });
  let hostileResult;
  assert.doesNotThrow(() => {
    hostileResult = api.parseCsv(csv, hostile);
  });
  assert.equal(hostileResult.ok, false);
  assert.ok(issueCodes(hostileResult).has('ACCESSOR_PROPERTY'));
  assert.equal(getterCalls, 0);

  let objectResult;
  assert.doesNotThrow(() => {
    objectResult = api.parseCsv(csv, {
      line: { value: matchingLine }
    });
  });
  assert.equal(objectResult.ok, false);
  assert.ok(issueCodes(objectResult).has('TYPE'),
    'object-valued scalar CSV metadata produces a bounded validation diagnostic');
});

test('malformed values, non-finite numbers, bounds, duplicate IDs, and formulas fail closed', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const cases = [
    ['FINITE_NUMBER', pkg => { pkg.rows[0].actualValue = Infinity; }],
    ['RANGE', pkg => { pkg.rows[0].chemistry.C = 1.21; }],
    ['DUPLICATE_RECORD', pkg => { pkg.rows[1].recordId = pkg.rows[0].recordId.toLowerCase(); }],
    ['FORMULA_LIKE_TEXT', pkg => { pkg.title = '=WEBSERVICE("https://invalid")'; }],
    ['NUMBER', pkg => { pkg.rows[0].coolingRateCPerS = '12 C/s'; }],
    ['UNSAFE_KEY', pkg => {
      Object.defineProperty(pkg.rows[0], '__proto__', {
        value: { polluted: true }, enumerable: true, configurable: true
      });
    }]
  ];
  for (const [code, mutate] of cases) {
    const pkg = demoPackage(api);
    mutate(pkg);
    const result = api.parse(pkg);
    assert.equal(result.ok, false, `${code} input is rejected`);
    assert.ok(issueCodes(result).has(code), `${code} is reported`);
  }

  const csvFormula = api.demo('csv').replace(
    'Synthetic hardness calibration demonstration',
    '=1+1'
  );
  const rejectedCsv = api.parseCsv(csvFormula);
  assert.equal(rejectedCsv.ok, false);
  assert.ok(issueCodes(rejectedCsv).has('FORMULA_LIKE_TEXT'));
  assert.ok(issueCodes(api.parseJson('{"schemaVersion":')).has('JSON_PARSE'));
  assert.ok(issueCodes(api.parseCsv('"recordId"x,role\nA,calibration'))
    .has('CSV_QUOTE'));
  assert.equal({}.polluted, undefined, 'prototype pollution was not applied');
});

test('malformed structured fields return diagnostics in object and JSON import modes', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const cases = [
    {
      label: 'object title',
      mutate(pkg) { pkg.title = {}; },
      codes: ['TYPE']
    },
    {
      label: 'object timestamp',
      mutate(pkg) { pkg.rows[0].timestamp = {}; },
      codes: ['TYPE']
    },
    {
      label: 'object schema version',
      mutate(pkg) { pkg.schemaVersion = {}; },
      codes: ['TYPE']
    },
    {
      label: 'mixed top-level and nested metadata types',
      mutate(pkg) { pkg.metadata = { title: {} }; },
      codes: ['METADATA_CONFLICT']
    },
    {
      label: 'mixed flat and nested chemistry types',
      mutate(pkg) { pkg.rows[0].C = {}; },
      codes: ['CHEMISTRY_CONFLICT', 'NUMBER']
    }
  ];

  for (const fixture of cases) {
    for (const format of ['object', 'json']) {
      const pkg = demoPackage(api);
      fixture.mutate(pkg);
      const input = format === 'json' ? JSON.stringify(pkg) : pkg;
      let result;
      assert.doesNotThrow(() => {
        result = api.parse(input);
      }, `${fixture.label} is safely diagnosed in ${format} mode`);
      assert.equal(result.ok, false, `${fixture.label} ${format} input is rejected`);
      const codes = issueCodes(result);
      fixture.codes.forEach(code => {
        assert.ok(codes.has(code), `${fixture.label} ${format} reports ${code}`);
      });
    }
  }
});

test('diagnostics are bounded and hostile object hooks are rejected without execution', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;

  const noisy = demoPackage(api);
  noisy.rows = Array.from({ length: api.limits.maxDiagnostics + 10 }, (_, index) => {
    const row = copy(noisy.rows[0]);
    row.recordId = `BAD-${index + 1}`;
    row.actualValue = Infinity;
    return row;
  });
  const bounded = api.parse(noisy);
  assert.equal(bounded.ok, false);
  assert.equal(bounded.errors.length, api.limits.maxDiagnostics);
  assert.equal(bounded.errors.at(-1).code, 'DIAGNOSTICS_TRUNCATED');

  const inherited = Object.create(demoPackage(api));
  const inheritedResult = api.parse(inherited);
  assert.equal(inheritedResult.ok, false);
  assert.ok(issueCodes(inheritedResult).has('OBJECT_PROTOTYPE'));

  let inheritedGetterCalls = 0;
  const hostileParent = Object.create(null);
  Object.defineProperty(hostileParent, 'title', {
    enumerable: true,
    get() {
      inheritedGetterCalls += 1;
      throw new Error('inherited metadata must not execute');
    }
  });
  const inheritedAccessor = Object.create(hostileParent);
  Object.defineProperties(inheritedAccessor,
    Object.getOwnPropertyDescriptors(demoPackage(api)));
  delete inheritedAccessor.title;
  let inheritedAccessorResult;
  assert.doesNotThrow(() => {
    inheritedAccessorResult = api.parse(inheritedAccessor);
  });
  assert.equal(inheritedAccessorResult.ok, false);
  assert.ok(issueCodes(inheritedAccessorResult).has('OBJECT_PROTOTYPE'));
  assert.equal(inheritedGetterCalls, 0,
    'metadata accessors inherited through a custom null-prototype parent never execute');

  let getterCalls = 0;
  const accessor = demoPackage(api);
  Object.defineProperty(accessor, 'trap', {
    enumerable: true,
    get() {
      getterCalls += 1;
      throw new Error('must not execute');
    }
  });
  const accessorResult = api.parse(accessor);
  assert.equal(accessorResult.ok, false);
  assert.ok(issueCodes(accessorResult).has('ACCESSOR_PROPERTY'));
  assert.equal(getterCalls, 0, 'input accessors are inspected, never executed');

  let toJsonCalls = 0;
  const customSerialization = demoPackage(api);
  customSerialization.toJSON = () => {
    toJsonCalls += 1;
    throw new Error('must not execute');
  };
  const serializationResult = api.parse(customSerialization);
  assert.equal(serializationResult.ok, false);
  assert.ok(issueCodes(serializationResult).has('UNSUPPORTED_VALUE'));
  assert.equal(toJsonCalls, 0, 'custom JSON hooks are rejected before serialization');
});

test('CSV dangerous headers and every spreadsheet formula prefix fail closed', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;

  for (const header of ['__proto__', 'prototype', 'constructor']) {
    const result = api.parseCsv(appendCsvColumns(api.demo('csv'), [
      { header, value: 'safe-looking-value' }
    ]));
    assert.equal(result.ok, false, `${header} CSV header is rejected`);
    assert.ok(issueCodes(result).has('UNSAFE_KEY'), `${header} reports UNSAFE_KEY`);
  }

  for (const payload of ['=1+1', '+1+1', '-cmd', '@SUM', '\tcmd', '\rcmd']) {
    const result = api.parseCsv(appendCsvColumns(api.demo('csv'), [
      { header: 'operatorNote', value: payload }
    ]));
    assert.equal(result.ok, false, `${JSON.stringify(payload)} formula prefix is rejected`);
    const codes = issueCodes(result);
    assert.ok(codes.has('FORMULA_LIKE_TEXT') || codes.has('CONTROL_CHARACTER'),
      `${JSON.stringify(payload)} reports a formula/control-character defense`);
  }
});

test('the diagnostic limit applies after parser and validator findings are merged', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const columns = Array.from({ length: 48 }, (_, index) => ({
    header: `extraField${index + 1}`,
    value: 'bounded-warning-fixture'
  }));
  const comments = Array.from({ length: 150 }, (_, index) =>
    `# unknownMetadata${index + 1}: bounded-warning-fixture`);
  const result = api.parseCsv([
    ...comments,
    appendCsvColumns(api.demo('csv'), columns)
  ].join('\n'));
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.ok(result.errors.length + result.warnings.length <= api.limits.maxDiagnostics,
    'the public result never exceeds the declared diagnostic cap');
  assert.ok([...result.errors, ...result.warnings]
    .some(item => item.code === 'DIAGNOSTICS_TRUNCATED'),
  'a truncation marker makes omitted diagnostics explicit');
});

test('a failed import is atomic and preserves the active analyzed package', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const valid = api.analyze(demoPackage(api));
  assert.equal(valid.ok, true, JSON.stringify(valid.errors));
  const beforeSession = api.getSession();
  const beforeAudit = api.audit();
  const beforeFingerprint = api.fingerprint();

  const invalid = demoPackage(api);
  invalid.rows[0].actualValue = NaN;
  const failure = api.analyze(invalid);
  assert.equal(failure.ok, false);
  assert.equal(failure.priorSessionPreserved, true);
  assert.equal(api.fingerprint(), beforeFingerprint);
  assert.deepEqual(api.getSession(), beforeSession);
  assert.deepEqual(api.audit(), beforeAudit);
});

test('oversized sparse object arrays fail fast without replacing the active session', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const active = api.analyze(demoPackage(api));
  assert.equal(active.ok, true);
  const beforeFingerprint = api.fingerprint();
  const beforeSession = copy(api.getSession());

  const hostile = demoPackage(api);
  hostile.rows = [];
  hostile.rows[100_000_000] = copy(active.comparisons[0]);
  let result;
  assert.doesNotThrow(() => {
    result = api.analyze(hostile);
  });
  assert.equal(result.ok, false);
  assert.ok(issueCodes(result).has('ARRAY_LIMIT'));
  assert.equal(result.priorSessionPreserved, true);
  assert.equal(api.fingerprint(), beforeFingerprint);
  assert.deepEqual(copy(api.getSession()), beforeSession);
});

test('conflicting nested JSON metadata fails atomically', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const valid = api.analyze(demoPackage(api));
  assert.equal(valid.ok, true);
  const beforeSession = copy(api.getSession());
  const beforeFingerprint = api.fingerprint();

  const conflicting = demoPackage(api);
  conflicting.metadata = {
    schemaVersion: conflicting.schemaVersion,
    title: 'Conflicting nested controlled title'
  };
  const failure = api.analyze(JSON.stringify(conflicting));
  assert.equal(failure.ok, false);
  assert.ok(issueCodes(failure).has('METADATA_CONFLICT'));
  assert.equal(failure.priorSessionPreserved, true);
  assert.equal(api.fingerprint(), beforeFingerprint);
  assert.deepEqual(copy(api.getSession()), beforeSession);
});

test('public results are defensive clones and clear removes the active session', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const result = api.analyze(demoPackage(api));
  assert.equal(result.ok, true);
  const activeFingerprint = api.fingerprint();
  const originalRecordId = api.getSession().package.rows[0].recordId;
  const originalActual = api.getSession().analysis.comparisons[0].actual;

  result.comparisons[0].actual = -999;
  const returnedSession = api.getSession();
  returnedSession.package.rows[0].recordId = 'MUTATED';
  returnedSession.analysis.comparisons[0].actual = -888;
  const returnedAudit = api.audit();
  returnedAudit.package.id = 'MUTATED';

  const untouched = api.getSession();
  assert.equal(untouched.package.rows[0].recordId, originalRecordId);
  assert.equal(untouched.analysis.comparisons[0].actual, originalActual);
  assert.notEqual(api.audit().package.id, 'MUTATED');
  assert.equal(api.fingerprint(), activeFingerprint);

  const cleared = api.clear();
  assert.equal(cleared.status, 'empty');
  assert.equal(cleared.package, null);
  assert.equal(cleared.model, null);
  assert.equal(api.getSession().status, 'empty');
  assert.equal(api.getSession().package, null);
  assert.equal(api.fingerprint(), api.fingerprint({}));
  assert.notEqual(api.fingerprint(), activeFingerprint);
});

test('heat and batch roles cannot leak and minimum independent groups are enforced', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;

  const heatLeak = demoPackage(api);
  heatLeak.rows.find(row => row.role === 'validation').heatId =
    heatLeak.rows.find(row => row.role === 'calibration').heatId;
  assert.ok(issueCodes(api.parse(heatLeak)).has('GROUP_LEAKAGE'));

  const batchLeak = demoPackage(api);
  batchLeak.groupBy = 'batch';
  batchLeak.rows.forEach(row => { row.batchId = `B-${row.heatId}`; });
  batchLeak.rows.find(row => row.role === 'validation').batchId =
    batchLeak.rows.find(row => row.role === 'calibration').batchId;
  assert.ok(issueCodes(api.parse(batchLeak)).has('GROUP_LEAKAGE'));

  const inactiveBatchLeak = demoPackage(api);
  inactiveBatchLeak.rows.forEach(row => { row.batchId = `B-${row.heatId}`; });
  inactiveBatchLeak.rows.find(row => row.role === 'validation').batchId =
    inactiveBatchLeak.rows.find(row => row.role === 'calibration').batchId;
  assert.ok(issueCodes(api.parse(inactiveBatchLeak)).has('GROUP_LEAKAGE'),
    'a shared batch leaks across roles even when the selected fit group is heat');

  const inactiveHeatLeak = demoPackage(api);
  inactiveHeatLeak.groupBy = 'batch';
  inactiveHeatLeak.rows.forEach(row => { row.batchId = `B-${row.heatId}`; });
  inactiveHeatLeak.rows.find(row => row.role === 'validation').heatId =
    inactiveHeatLeak.rows.find(row => row.role === 'calibration').heatId;
  assert.ok(issueCodes(api.parse(inactiveHeatLeak)).has('GROUP_LEAKAGE'),
    'a shared heat leaks across roles even when the selected fit group is batch');

  const tooFewCalibrationGroups = demoPackage(api);
  tooFewCalibrationGroups.rows.filter(row => row.role === 'calibration')
    .forEach(row => { row.heatId = 'H-C01'; });
  assert.ok(issueCodes(api.parse(tooFewCalibrationGroups)).has('CALIBRATION_MINIMUM'));

  const tooFewValidationGroups = demoPackage(api);
  tooFewValidationGroups.rows.filter(row => row.role === 'validation')
    .forEach(row => { row.heatId = 'H-V01'; });
  assert.ok(issueCodes(api.parse(tooFewValidationGroups)).has('VALIDATION_MINIMUM'));
});

test('rows outside the governed generic model domain are withheld before fitting', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  Object.assign(pkg.rows[0].chemistry, {
    C: 0.7, Mn: 2, Si: 0.6, Ni: 1, Cr: 1.5,
    Mo: 0.6, V: 0.15, Cu: 0.6, B: 0.003
  });
  const result = api.parse(pkg);
  assert.equal(result.ok, false);
  assert.ok(issueCodes(result).has('GENERIC_MODEL_DOMAIN'));
  assert.equal(result.package, null);
});

test('permitted near-boundary rows remain conditional and visible without identifier leakage', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const boundaryRow = pkg.rows[0];
  boundaryRow.chemistry.C = 0.02;

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.governance.candidateValidity.state, 'in-range');
  assert.equal(result.governance.permittedForEvidenceComparison, true);
  assert.equal(result.governance.permittedForScreening, false,
    'the candidate remains diagnostic evidence rather than a new-input predictor');
  assert.equal(result.governance.permittedForAcceptance, false);
  const warning = result.warnings.find(item =>
    item.code === 'GENERIC_MODEL_NEAR_BOUNDARY');
  assert.ok(warning, 'near-boundary governance is visible to the analyst');
  assert.equal(warning.path, 'rows.genericPrediction');
  assert.equal(JSON.stringify(warning).includes(boundaryRow.recordId), false);
  assert.equal(JSON.stringify(warning).includes(boundaryRow.heatId), false);
  assert.equal(JSON.stringify(warning).includes(String(boundaryRow.chemistry.C)), false);

  const auditText = JSON.stringify(api.audit());
  assert.match(auditText, /GENERIC_MODEL_NEAR_BOUNDARY/);
  assert.equal(auditText.includes(boundaryRow.recordId), false);
  assert.equal(auditText.includes(boundaryRow.heatId), false);
});

test('target-specific measurement bases fail closed when essential controls are absent or conflicting', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;

  const elongation = demoPackage(api);
  elongation.target = 'elongation-pct';
  elongation.measurementBasis =
    'ASTM E8 tensile coupon, longitudinal orientation, gauge length at room temperature';
  const elongationResult = api.parse(elongation);
  assert.equal(elongationResult.ok, false);
  assert.ok(issueCodes(elongationResult).has('ELONGATION_GAUGE_BASIS'));

  const yieldStrength = demoPackage(api);
  yieldStrength.target = 'yield-strength-mpa';
  yieldStrength.measurementBasis =
    'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length';
  const yieldResult = api.parse(yieldStrength);
  assert.equal(yieldResult.ok, false);
  assert.ok(issueCodes(yieldResult).has('TENSILE_TEMPERATURE'));
  assert.ok(issueCodes(yieldResult).has('YIELD_DEFINITION'));

  const conflictingHardness = demoPackage(api);
  conflictingHardness.measurementMethod = 'Rockwell C HRC per ASTM E18';
  const hardnessResult = api.parse(conflictingHardness);
  assert.equal(hardnessResult.ok, false);
  assert.ok(issueCodes(hardnessResult).has('HARDNESS_BASIS'));
});

test('strength targets define MPa canonically and reject explicit incompatible units', async t => {
  const source = await tool();
  t.after(() => source.win.close());
  const { win } = source;
  const api = win.__SPX.calibration;
  const fixtures = [
    {
      target: 'yield-strength-mpa',
      invalidBasis: 'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature, 0.2% offset yield strength reported in ksi',
      validBasis: 'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature, 0.2% offset yield strength reported in MPa'
    },
    {
      target: 'tensile-strength-mpa',
      invalidBasis: 'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature, tensile strength reported in psi',
      validBasis: 'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature, tensile strength result'
    }
  ];
  let tensileFailure;
  let tensileInvalidBasis = '';

  for (const fixture of fixtures) {
    const valid = demoPackage(api);
    valid.target = fixture.target;
    valid.measurementBasis = fixture.validBasis;
    const validParse = api.parse(valid);
    assert.equal(validParse.ok, true,
      `${fixture.target} accepts its canonical MPa target basis: ${JSON.stringify(validParse.errors)}`);
    const validAnalysis = api.analyze(valid);
    assert.equal(validAnalysis.ok, true, JSON.stringify(validAnalysis.errors));
    const validFingerprint = api.fingerprint();
    const validSession = copy(api.getSession());

    const invalid = copy(valid);
    invalid.measurementBasis = fixture.invalidBasis;
    const invalidParse = api.parse(invalid);
    assert.equal(invalidParse.ok, false, `${fixture.target} incompatible unit is rejected`);
    assert.ok(issueCodes(invalidParse).has('STRENGTH_UNIT'));
    const invalidAnalysis = api.analyze(invalid);
    assert.equal(invalidAnalysis.ok, false);
    assert.ok(issueCodes(invalidAnalysis).has('STRENGTH_UNIT'));
    assert.equal(invalidAnalysis.priorSessionPreserved, true);
    assert.equal(api.fingerprint(), validFingerprint);
    assert.deepEqual(copy(api.getSession()), validSession,
      'a unit-invalid analysis cannot replace the active MPa package');

    if (fixture.target === 'tensile-strength-mpa') {
      tensileFailure = copy(invalidAnalysis);
      tensileInvalidBasis = fixture.invalidBasis;
    }
  }

  const invalidAudit = copy(api.audit());
  invalidAudit.status = 'invalid';
  invalidAudit.valid = false;
  invalidAudit.package.measurementBasis = tensileInvalidBasis;
  invalidAudit.errors = tensileFailure.errors;
  const restored = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [PROFESSIONAL_STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        activeStage: 'calibration',
        calibration: { audit: invalidAudit }
      })
    }
  });
  t.after(() => restored.win.close());
  const professional = restored.win.__SPX.professional;
  professional.setStage('calibration', false);
  const persistedAudit = professional.getState().calibration.audit;
  assert.equal(persistedAudit.valid, false);
  assert.match(persistedAudit.inputSummary.measurementBasis, /\bpsi\b/i);
  assert.ok(persistedAudit.errors.some(error => /STRENGTH_UNIT/.test(error)));
  const readiness = professional.calibrationReadiness();
  assert.equal(readiness.optional, false);
  assert.equal(readiness.ready, false,
    'a restored unit-invalid calibration audit cannot become Ready');
  assert.doesNotMatch(readiness.label, /^Ready\b/);
});

test('canonical rate, hardness, and elongation units reject incompatible declarations', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;

  for (const declaredRate of [
    'C/min', 'F/s', 'mK/s', 'KC/s', 'C/s^2', 'C/s²'
  ]) {
    const pkg = demoPackage(api);
    pkg.coolingRateDefinition =
      `Average cooling rate from 800 C to 500 C reported in ${declaredRate}`;
    const result = api.parse(pkg);
    assert.equal(result.ok, false, `${declaredRate} is not coolingRateCPerS`);
    assert.ok(issueCodes(result).has('COOLING_RATE_UNIT'));
  }
  const missingRateUnit = demoPackage(api);
  missingRateUnit.coolingRateDefinition =
    'Average cooling rate from 800 C to 500 C';
  const missingRateResult = api.parse(missingRateUnit);
  assert.equal(missingRateResult.ok, false,
    'a cooling-rate definition without a rate unit fails closed');
  assert.ok(issueCodes(missingRateResult).has('COOLING_RATE_UNIT'));
  for (const compatibleRate of ['C/s', 'K/s']) {
    const pkg = demoPackage(api);
    pkg.coolingRateDefinition =
      `Average cooling rate from 800 C to 500 C reported in ${compatibleRate}`;
    const result = api.parse(pkg);
    assert.equal(result.ok, true,
      `${compatibleRate} is compatible with coolingRateCPerS: ${JSON.stringify(result.errors)}`);
  }

  const pressureHardness = demoPackage(api);
  pressureHardness.measurementBasis =
    'Vickers HV10 per ASTM E384 at quarter thickness, result reported in MPa';
  const hardnessResult = api.parse(pressureHardness);
  assert.equal(hardnessResult.ok, false);
  assert.ok(issueCodes(hardnessResult).has('HARDNESS_BASIS'));
  for (const incompatibleScale of [
    'HB', 'HBS', 'HR30N', 'HRC60', 'HBW10/3000'
  ]) {
    const pkg = demoPackage(api);
    pkg.measurementBasis =
      `Vickers HV10 per ASTM E384 at quarter thickness; result reported as ${incompatibleScale}`;
    const result = api.parse(pkg);
    assert.equal(result.ok, false,
      `${incompatibleScale} is not compatible with hardness-hv`);
    assert.ok(issueCodes(result).has('HARDNESS_BASIS'));
  }

  const elongationBasis =
    'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature';
  for (const incompatibleUnit of ['fractional strain mm/mm', 'true strain']) {
    const pkg = demoPackage(api);
    pkg.target = 'elongation-pct';
    pkg.measurementBasis = `${elongationBasis}, ${incompatibleUnit}`;
    pkg.rows.forEach(row => { row.actualValue = 20; });
    const result = api.parse(pkg);
    assert.equal(result.ok, false, `${incompatibleUnit} is not elongation-pct`);
    assert.ok(issueCodes(result).has('ELONGATION_UNIT'));
  }
  for (const validBasis of [
    `${elongationBasis}, engineering elongation reported in %`,
    `${elongationBasis}, engineering elongation result`
  ]) {
    const pkg = demoPackage(api);
    pkg.target = 'elongation-pct';
    pkg.measurementBasis = validBasis;
    pkg.rows.forEach(row => { row.actualValue = 20; });
    const result = api.parse(pkg);
    assert.equal(result.ok, true,
      `elongation-pct establishes percentage points: ${JSON.stringify(result.errors)}`);
  }
});

test('physically impossible corrected outputs withhold candidate screening use', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const fixtures = [
    {
      target: 'hardness-hv',
      actual: 2000,
      outOfRange: row => row.calibrated > 2000,
      label: 'upper-bound hardness'
    },
    {
      target: 'tensile-strength-mpa',
      actual: 5000,
      basis: 'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature, tensile strength reported in MPa',
      outOfRange: row => row.calibrated > 5000,
      label: 'upper-bound tensile strength'
    },
    {
      target: 'elongation-pct',
      actual: 0,
      basis: 'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature',
      outOfRange: row => row.calibrated < 0,
      label: 'negative elongation'
    }
  ];
  for (const fixture of fixtures) {
    const pkg = demoPackage(api);
    pkg.target = fixture.target;
    if (fixture.basis) pkg.measurementBasis = fixture.basis;
    pkg.rows.forEach(row => { row.actualValue = fixture.actual; });

    const result = api.analyze(pkg);
    assert.equal(result.ok, true, `${fixture.label}: ${JSON.stringify(result.errors)}`);
    assert.ok(result.comparisons.some(fixture.outOfRange),
      `${fixture.label} fixture produces an impossible candidate output`);
    assert.ok(new Set(result.warnings.map(item => item.code))
      .has('CALIBRATED_OUTPUT_RANGE'), `${fixture.label} is visibly flagged`);
    assert.equal(result.governance.permittedForEvidenceComparison, false,
      `${fixture.label} is withheld even for imported evidence-row comparison`);
    assert.equal(result.governance.permittedForScreening, false,
      `${fixture.label} is withheld from candidate screening use`);
    assert.equal(result.governance.permittedForApplication, false);
    assert.equal(result.governance.permittedForAcceptance, false);
  }
});

test('critical output-range warnings survive a full inherited diagnostic budget', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  pkg.rows.forEach(row => { row.actualValue = 2000; });
  for (let index = 0; index < api.limits.maxDiagnostics + 25; index += 1) {
    pkg[`unknownField${index + 1}`] = 'low-priority forward-compatibility warning';
  }

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.governance.permittedForEvidenceComparison, false);
  assert.equal(result.governance.permittedForScreening, false);
  assert.equal(result.governance.permittedForApplication, false);
  assert.ok(result.warnings.length <= api.limits.maxDiagnostics);
  const codes = new Set(result.warnings.map(item => item.code));
  assert.ok(codes.has('CALIBRATED_OUTPUT_RANGE'),
    'the fail-closed physical-output warning is retained ahead of inherited warnings');
  assert.ok(codes.has('DIAGNOSTICS_TRUNCATED'),
    'the bounded warning set states that lower-priority findings were omitted');
});

test('professional persistence distinguishes evidence comparison from candidate application', async t => {
  const source = await tool();
  t.after(() => source.win.close());
  const sourceApi = source.win.__SPX.calibration;
  const pkg = demoPackage(sourceApi);
  pkg.target = 'elongation-pct';
  pkg.measurementBasis =
    'ASTM E8 tensile coupon, longitudinal orientation, 50 mm gauge length at room temperature';
  pkg.rows.forEach(row => { row.actualValue = 0; });
  const sourceResult = sourceApi.analyze(pkg);
  assert.equal(sourceResult.ok, true);
  assert.equal(sourceResult.governance.permittedForScreening, false);
  const rawAudit = copy(sourceApi.audit());

  const target = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [PROFESSIONAL_STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        activeStage: 'calibration',
        calibration: { audit: rawAudit }
      })
    }
  });
  t.after(() => target.win.close());
  const targetResult = target.win.__SPX.calibration.analyze(copy(pkg));
  assert.equal(targetResult.ok, true);
  assert.equal(targetResult.packageFingerprint, rawAudit.packageFingerprint,
    'the restored compact audit is current for the active session package');
  const professional = target.win.__SPX.professional;
  professional.setStage('calibration', false);
  const compact = professional.getState().calibration.audit;
  assert.equal(compact.governance.permittedForEvidenceComparison, false);
  assert.equal(compact.governance.permittedForScreening, false);
  assert.equal(compact.governance.permittedForApplication, false);
  assert.equal(compact.governance.candidateValidity.state, 'out-of-range');
  assert.equal(compact.governance.candidateValidity.outputRangeValid, false);
  const readiness = professional.calibrationReadiness();
  assert.equal(readiness.current, true);
  assert.equal(readiness.evidenceComparisonPermitted, false);
  assert.equal(readiness.applicationPermitted, false);
  assert.equal(readiness.ready, false,
    'a current but physically invalid candidate cannot become workflow-ready');
  assert.match(readiness.detail, /withheld|range|physical/i);
  const panelText = target.doc.querySelector(
    '[data-professional-panel="calibration"]'
  )?.textContent || '';
  assert.match(panelText, /Imported evidence comparison\s*Withheld/i);
  assert.match(panelText, /New-input candidate application\s*Withheld/i);
  const report = JSON.parse(professional.reportJson());
  assert.equal(report.calibration.audit.governance.permittedForEvidenceComparison, false);
  assert.equal(report.calibration.audit.governance.permittedForScreening, false);
  assert.equal(report.calibration.audit.governance.permittedForApplication, false);
  assert.equal(report.calibration.audit.governance.candidateValidity.state, 'out-of-range');
  assert.equal(report.calibration.evidenceComparison, 'withheld');
  assert.match(report.calibration.applicationUse, /withheld/i);
  const reportHtml = professional.reportHtml();
  assert.match(reportHtml, /Imported evidence comparison is withheld/i);
  assert.match(reportHtml, /Candidate application to new inputs/i);
  assert.match(reportHtml, /no candidate applicability envelope/i);
});

test('generic predictions, additive correction, and error metrics are deterministic', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const first = api.analyze(pkg);
  assert.equal(first.ok, true, JSON.stringify(first.errors));
  assert.equal(first.correction.type, 'additive-bias');
  closeTo(first.correction.value, 11, 1e-9, 'fixture additive correction');

  first.comparisons.forEach((row, index) => {
    closeTo(row.generic, genericPrediction(win, pkg.rows[index]), 1e-9,
      `generic prediction ${index + 1}`);
    closeTo(row.calibrated, row.generic + 11, 1e-9,
      `candidate prediction ${index + 1}`);
  });

  assertMetrics(first.metrics.validation.generic, {
    bias: 10.5,
    mae: 10.5,
    rmse: 10.51189802081432,
    r2: 0.4509406740933022
  }, 'frozen validation generic fixture');
  assertMetrics(first.metrics.validation.calibrated, {
    bias: -0.5,
    mae: 0.5,
    rmse: Math.SQRT1_2,
    r2: 0.9975155686610556
  }, 'frozen validation candidate fixture');

  const comparisonRows = first.comparisons.map((row, index) => Object.assign(
    copy(row), {
      heatId: pkg.rows[index].heatId,
      batchId: pkg.rows[index].batchId
    }
  ));
  for (const role of ['calibration', 'validation']) {
    const rows = groupMeanRows(
      comparisonRows.filter(row => row.role === role), pkg.groupBy
    );
    assertMetrics(first.metrics[role].generic,
      expectedMetrics(rows, 'generic'), `${role} generic`);
    assertMetrics(first.metrics[role].calibrated,
      expectedMetrics(rows, 'calibrated'), `${role} candidate`);
  }

  const stableFields = result => ({
    packageFingerprint: result.packageFingerprint,
    modelFingerprint: result.modelFingerprint,
    correction: result.correction,
    metrics: result.metrics,
    monitoring: result.monitoring,
    comparisons: result.comparisons,
    governance: result.governance
  });
  const second = api.analyze(copy(pkg));
  assert.deepEqual(stableFields(second), stableFields(first));
});

test('calibration group and within-group permutations preserve fitted-model identity', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const source = pkg.rows.find(row =>
    row.role === 'calibration' && row.heatId === 'H-C01');
  const adversarialActuals = [
    1,
    1.000000000001,
    1.000000000001,
    1900
  ];
  const replacements = adversarialActuals.map((actualValue, index) => {
    const row = copy(source);
    row.recordId = `CAL-ORDER-H-C01-${index + 1}`;
    row.actualValue = actualValue;
    row.timestamp = `2026-01-${String(10 + index).padStart(2, '0')}T12:00:00Z`;
    return row;
  });
  pkg.rows = replacements.concat(pkg.rows.filter(row =>
    !(row.role === 'calibration' && row.heatId === 'H-C01')));

  const baseline = api.analyze(pkg);
  assert.equal(baseline.ok, true, JSON.stringify(baseline.errors));
  const groups = [...new Set(pkg.rows
    .filter(row => row.role === 'calibration').map(row => row.heatId))];
  const reorderedPackage = (groupOrder, reverseWithin) => {
    const candidate = copy(pkg);
    const calibration = candidate.rows.filter(row => row.role === 'calibration');
    const reordered = groupOrder.flatMap(groupId => {
      const rows = calibration.filter(row => row.heatId === groupId);
      return reverseWithin ? rows.reverse() : rows;
    });
    candidate.rows = reordered.concat(
      candidate.rows.filter(row => row.role !== 'calibration')
    );
    return candidate;
  };
  const permutations = [
    reorderedPackage(groups.slice().reverse(), false),
    reorderedPackage(groups, true)
  ];

  for (const permutation of permutations) {
    const result = api.analyze(permutation);
    assert.equal(result.ok, true, JSON.stringify(result.errors));
    assert.notEqual(result.packageFingerprint, baseline.packageFingerprint,
      'ordered package identity records the row permutation');
    assert.equal(result.correction.value, baseline.correction.value,
      'the equal-weighted correction is exactly permutation invariant');
    assert.equal(result.trainingFingerprint, baseline.trainingFingerprint);
    assert.equal(result.modelFingerprint, baseline.modelFingerprint);
    assert.deepEqual(copy(result.metrics.calibration),
      copy(baseline.metrics.calibration));
  }
});

test('calibration is group-weighted while validation and monitoring never retrain it', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const basePackage = demoPackage(api);
  const baseline = api.analyze(basePackage);
  assert.equal(baseline.ok, true);

  const duplicatedGroup = copy(basePackage);
  duplicatedGroup.rows.filter(row => row.role === 'calibration' && row.heatId === 'H-C02')
    .forEach((row, index) => {
      const duplicate = copy(row);
      duplicate.recordId = `CAL-C02-DUP-${index + 1}`;
      duplicatedGroup.rows.push(duplicate);
    });
  const duplicated = api.analyze(duplicatedGroup);
  assert.equal(duplicated.ok, true);
  closeTo(duplicated.correction.value, baseline.correction.value, 1e-9,
    'duplicating one heat does not reweight the fit');

  const validationChanged = copy(basePackage);
  validationChanged.rows.filter(row => row.role === 'validation')
    .forEach(row => { row.actualValue = Math.min(1900, row.actualValue + 100); });
  const validationResult = api.analyze(validationChanged);
  closeTo(validationResult.correction.value, baseline.correction.value, 1e-9,
    'validation observations never train');
  assert.deepEqual(validationResult.metrics.calibration, baseline.metrics.calibration);
  assert.notEqual(validationResult.packageFingerprint, baseline.packageFingerprint,
    'the complete evidence package identity changes');
  assert.equal(validationResult.modelFingerprint, baseline.modelFingerprint,
    'validation-only evidence changes do not change fitted model identity');

  const monitoringChanged = copy(basePackage);
  monitoringChanged.rows.filter(row => row.role === 'monitoring')
    .forEach(row => { row.actualValue = Math.min(1900, row.actualValue + 100); });
  const monitoringResult = api.analyze(monitoringChanged);
  closeTo(monitoringResult.correction.value, baseline.correction.value, 1e-9,
    'monitoring observations never retrain');
  assert.deepEqual(monitoringResult.metrics, baseline.metrics);
  assert.notEqual(monitoringResult.packageFingerprint, baseline.packageFingerprint,
    'the monitoring evidence package identity changes');
  assert.equal(monitoringResult.modelFingerprint, baseline.modelFingerprint,
    'monitoring-only evidence changes do not change fitted model identity');
});

test('measurement-method traceability is part of scope and fitted-model identity', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const baseline = api.analyze(pkg);
  assert.equal(baseline.ok, true);

  const revised = copy(pkg);
  revised.measurementMethod += ' — controlled revision B';
  const result = api.analyze(revised);
  assert.equal(result.ok, true);
  closeTo(result.correction.value, baseline.correction.value, 1e-9,
    'measurement-method metadata does not numerically retrain the correction');
  assert.notEqual(result.packageFingerprint, baseline.packageFingerprint);
  assert.notEqual(result.scopeFingerprint, baseline.scopeFingerprint,
    'measurement method changes the declared applicability-scope identity');
  assert.notEqual(result.modelFingerprint, baseline.modelFingerprint,
    'a scope change produces a distinct fitted-model identity');
});

test('drift monitoring distinguishes insufficient, stable, and review-trigger states', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;

  const insufficientPackage = demoPackage(api);
  insufficientPackage.rows = insufficientPackage.rows.filter(row => row.role !== 'monitoring');
  const insufficient = api.analyze(insufficientPackage);
  assert.equal(insufficient.ok, true);
  assert.equal(insufficient.monitoring.status, 'insufficient');
  assert.equal(insufficient.monitoring.n, 0);

  const stablePackage = matchMonitoringGroupSizes(phaseOnePackage(win, api));
  stablePackage.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.actualValue = genericPrediction(win, row) + 11;
  });
  const stable = api.analyze(stablePackage);
  assert.equal(stable.ok, true);
  assert.equal(stable.monitoring.status, 'stable');
  assert.equal(stable.monitoring.triggerCount, 0);

  const reviewPackage = copy(stablePackage);
  reviewPackage.rows.filter(row => row.role === 'monitoring')
    .forEach(row => {
      if (row.heatId === 'H-M02') row.actualValue += 80;
    });
  const review = api.analyze(reviewPackage);
  assert.equal(review.ok, true);
  assert.equal(review.monitoring.status, 'review-trigger');
  assert.ok(review.monitoring.triggerCount > 0);
  assert.match(review.monitoring.reasons.join(' '), /review trigger/i);
  assert.match(review.monitoring.reasons.join(' '), /not a product nonconformance|not.*acceptance/i);
});

test('a minimum-size Phase-I baseline cannot be called stable', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  pkg.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.actualValue = genericPrediction(win, row) + 11;
  });

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.monitoring.baselineGroups, 3);
  assert.equal(result.monitoring.baselineLimited, true);
  assert.equal(result.monitoring.triggerCount, 0);
  assert.equal(result.monitoring.status, 'insufficient');
  assert.match(result.monitoring.reasons.join(' '), /fewer than 20 calibration groups/i);
});

test('EWMA uses group residuals, z0 = 0, and time-varying three-sigma limits', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const residualFixture = { 'H-M01': 10, 'H-M02': -5 };
  pkg.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.actualValue = genericPrediction(win, row) + 11 + residualFixture[row.heatId];
  });

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.monitoring.initialization, 'z0 = 0');
  assert.equal(result.monitoring.lambda, 0.2);
  assert.equal(result.monitoring.limitSigma, 3);
  assert.deepEqual(copy(result.monitoring.points.map(point => point.residual)), [10, -5]);
  closeTo(result.monitoring.points[0].ewma, 2, 1e-9, 'first EWMA');
  closeTo(result.monitoring.points[1].ewma, 0.6, 1e-9, 'second EWMA');
  closeTo(result.monitoring.baselineResidualSd, 1, 1e-9, 'training-group residual SD');
  closeTo(result.monitoring.points[0].ewmaLower, -0.6, 1e-9,
    'first lower limit is -0.6s');
  closeTo(result.monitoring.points[0].ewmaUpper, 0.6, 1e-9,
    'first upper limit is +0.6s');
  closeTo(result.monitoring.ewmaLimits.steadyStateLower, -1, 1e-9,
    'steady-state lower limit is -s');
  closeTo(result.monitoring.ewmaLimits.steadyStateUpper, 1, 1e-9,
    'steady-state upper limit is +s');
});

test('tied monitoring timestamps cannot acquire statistical order from private group IDs', async t => {
  const source = await tool();
  t.after(() => source.win.close());
  const { win } = source;
  const api = win.__SPX.calibration;
  const pkg = phaseOnePackage(win, api);
  const sharedTimestamp = '2026-03-15T12:00:00Z';
  const baselineSigma = Math.sqrt(20 / 19);
  pkg.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.timestamp = sharedTimestamp;
    const residual = row.heatId === 'H-M01'
      ? 2.9 * baselineSigma : 1.4 * baselineSigma;
    row.actualValue = genericPrediction(win, row) + 11 + residual;
  });

  const tied = api.analyze(pkg);
  assert.equal(tied.ok, true, JSON.stringify(tied.errors));
  assert.equal(tied.monitoring.baselineGroups, 20);
  assert.equal(tied.monitoring.subgroupSizeCompatible, true);
  assert.equal(tied.monitoring.status, 'insufficient');
  assert.equal(tied.monitoring.chronologyVerified, false);
  assert.equal(tied.monitoring.tiedGroupTimestamps, true);
  assert.equal(tied.monitoring.ewmaAvailable, false);
  assert.match(tied.monitoring.ewmaSuppressedReason, /order is not established/i);
  assert.equal(tied.monitoring.triggerCount, 0);
  assert.equal(tied.monitoring.observedScreeningTrigger, false);
  tied.monitoring.points.forEach(point => {
    assert.equal(point.ewma, null);
    assert.equal(point.ewmaLower, null);
    assert.equal(point.ewmaUpper, null);
    assert.equal(point.ewmaTrigger, false);
    assert.equal(point.residualTrigger, false);
  });
  assert.match(tied.monitoring.reasons.join(' '),
    /identifier order has no statistical meaning/i);
  assert.match(tied.monitoring.groupTimestampTiePolicy,
    /identifier order has no statistical meaning/i);

  const renamedPackage = copy(pkg);
  renamedPackage.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.heatId = row.heatId === 'H-M01' ? 'ZZZ-MONITOR' : 'AAA-MONITOR';
  });
  const renamed = api.analyze(renamedPackage);
  assert.equal(renamed.ok, true, JSON.stringify(renamed.errors));
  assert.equal(renamed.monitoring.status, 'insufficient');
  assert.equal(renamed.monitoring.chronologyVerified, false);
  assert.equal(renamed.monitoring.tiedGroupTimestamps, true);
  assert.equal(renamed.monitoring.ewmaAvailable, false);
  assert.equal(renamed.monitoring.triggerCount, tied.monitoring.triggerCount);
  assert.equal(renamed.monitoring.observedScreeningTrigger,
    tied.monitoring.observedScreeningTrigger);
  assert.deepEqual(
    copy(renamed.monitoring.points.map(point => ({
      ewma: point.ewma,
      ewmaLower: point.ewmaLower,
      ewmaUpper: point.ewmaUpper,
      ewmaTrigger: point.ewmaTrigger,
      residualTrigger: point.residualTrigger
    }))),
    copy(tied.monitoring.points.map(point => ({
      ewma: point.ewma,
      ewmaLower: point.ewmaLower,
      ewmaUpper: point.ewmaUpper,
      ewmaTrigger: point.ewmaTrigger,
      residualTrigger: point.residualTrigger
    })))
  );
  assert.ok(!['stable', 'review-trigger'].includes(renamed.monitoring.status),
    'renaming private group IDs cannot manufacture a statistical classification');

  const engineAudit = api.audit();
  assert.equal(engineAudit.dataSummary.monitoringLaterThanReferenceVerified, true);
  assert.equal(engineAudit.dataSummary.monitoringChronologyVerified, false);
  assert.equal(engineAudit.model.monitoring.status, 'insufficient');
  assert.equal(engineAudit.model.monitoring.chronologyVerified, false);
  assert.equal(engineAudit.model.monitoring.tiedGroupTimestamps, true);
  assert.equal(engineAudit.model.monitoring.ewmaAvailable, false);
  assert.equal(engineAudit.model.monitoring.triggerCount, 0);
  assert.match(engineAudit.model.monitoring.reasons.join(' '),
    /identifier order has no statistical meaning/i);

  const restored = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [PROFESSIONAL_STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        activeStage: 'calibration',
        calibration: { audit: engineAudit }
      })
    }
  });
  t.after(() => restored.win.close());
  const professional = restored.win.__SPX.professional;
  professional.setStage('calibration', false);
  const stateAudit = professional.getState().calibration.audit;
  const stateDrift = stateAudit.targetResults['hardness-hv'].drift;
  assert.equal(stateDrift.status, 'insufficient');
  assert.equal(stateDrift.chronologyVerified, false);
  assert.equal(stateDrift.tiedGroupTimestamps, true);
  assert.equal(stateDrift.ewmaAvailable, false);
  assert.equal(stateDrift.signals, 0);
  assert.equal(stateDrift.ewmaTriggers, 0);
  assert.match(stateDrift.reasons.join(' '),
    /identifier order has no statistical meaning/i);
  const readiness = professional.calibrationReadiness();
  assert.equal(readiness.ready, false);
  assert.equal(readiness.monitoringReady, false);
  assert.ok(copy(readiness.monitoringStatuses).includes('insufficient'));

  const persisted = JSON.parse(
    restored.win.localStorage.getItem(PROFESSIONAL_STORAGE_KEY)
  );
  const persistedDrift =
    persisted.calibration.audit.targetResults['hardness-hv'].drift;
  const report = JSON.parse(professional.reportJson());
  const reportDrift =
    report.calibration.audit.targetResults['hardness-hv'].drift;
  for (const drift of [persistedDrift, reportDrift]) {
    assert.equal(drift.status, stateDrift.status);
    assert.equal(drift.chronologyVerified, stateDrift.chronologyVerified);
    assert.equal(drift.tiedGroupTimestamps, stateDrift.tiedGroupTimestamps);
    assert.deepEqual(copy(drift.reasons), copy(stateDrift.reasons));
  }
});

test('floating-point dust cannot create control limits or a drift trigger', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = phaseOnePackage(win, api);
  pkg.rows.filter(row => row.role === 'calibration').forEach(row => {
    const perturbation = row.heatId === 'H-PHASE1-20' ? 1e-12 : 0;
    row.actualValue = genericPrediction(win, row) + 11 + perturbation;
  });
  pkg.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.actualValue = genericPrediction(win, row) + 11 + 1e-11;
  });

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.monitoring.baselineGroups, 20);
  assert.equal(result.monitoring.subgroupSizeCompatible, true);
  assert.ok(result.monitoring.baselineResidualSd > 0,
    'the fixture exposes nonzero binary floating-point dust');
  assert.ok(result.monitoring.baselineResidualSd <=
    result.monitoring.numericPrecisionFloor,
    'the observed variation is below the target-scaled numeric floor');
  assert.equal(result.monitoring.status, 'insufficient');
  assert.equal(result.monitoring.ewmaAvailable, false);
  assert.equal(result.monitoring.residualLimits, null);
  assert.equal(result.monitoring.ewmaLimits, null);
  assert.equal(result.monitoring.triggerCount, 0);
  assert.equal(result.monitoring.observedScreeningTrigger, false);
  assert.match(result.monitoring.reasons.join(' '), /numeric precision/i);
  result.monitoring.points.forEach(point => {
    assert.ok(Math.abs(point.residual) >
      3 * result.monitoring.baselineResidualSd,
      'a naive dust-scale limit would misclassify the monitoring residual');
    assert.equal(point.residualTrigger, false);
    assert.equal(point.ewmaTrigger, false);
    assert.equal(point.ewma, null);
  });
});

test('unequal monitoring subgroup sizes cannot produce a stable drift classification', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const duplicate = copy(pkg.rows.find(row => row.role === 'monitoring'));
  duplicate.recordId = 'MON-001-REPLICATE';
  pkg.rows.push(duplicate);

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.monitoring.unequalMonitoringGroupSizes, true);
  assert.equal(result.monitoring.status, 'insufficient');
  assert.match(result.monitoring.reasons.join(' '),
    /monitoring (?:subgroup|group) sizes differ|incompatible baseline and monitoring subgroup sizes/i);
});

test('unequal calibration subgroup sizes make drift classification insufficient', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const source = pkg.rows.find(row =>
    row.role === 'calibration' && row.heatId === 'H-C03');
  const duplicate = copy(source);
  duplicate.recordId = 'CAL-C03-REPLICATE';
  duplicate.actualValue = genericPrediction(win, duplicate) + 10;
  pkg.rows.push(duplicate);
  pkg.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.actualValue = genericPrediction(win, row) + 11;
  });

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.monitoring.unequalCalibrationGroupSizes, true);
  assert.equal(result.monitoring.baselineGroupSize, null);
  assert.equal(result.monitoring.monitoringGroupSize, 2);
  assert.equal(result.monitoring.subgroupSizeCompatible, false);
  assert.equal(result.monitoring.status, 'insufficient');
  assert.match(result.monitoring.reasons.join(' '),
    /calibration baseline group sizes differ/i);
});

test('monitoring subgroup size must be compatible with the calibration baseline', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const pkg = demoPackage(api);
  const retainedMonitoringGroups = new Set();
  pkg.rows = pkg.rows.filter(row => {
    if (row.role !== 'monitoring') return true;
    if (retainedMonitoringGroups.has(row.heatId)) return false;
    retainedMonitoringGroups.add(row.heatId);
    return true;
  });
  pkg.rows.filter(row => row.role === 'monitoring').forEach(row => {
    row.actualValue = genericPrediction(win, row) + 11;
  });

  const result = api.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.monitoring.baselineGroups, 3);
  assert.equal(result.monitoring.baselineGroupSize, 2);
  assert.equal(result.monitoring.monitoringGroupSize, 1);
  assert.equal(result.monitoring.subgroupSizeCompatible, false);
  assert.equal(result.monitoring.status, 'insufficient',
    'one-row monitoring groups cannot use limits fitted from two-row calibration groups');
  assert.match(result.monitoring.reasons.join(' '),
    /(?:baseline|calibration).*(?:subgroup|group) size|(?:subgroup|group) sizes?.*(?:baseline|calibration)/i);
});

test('specification context is identity-only and unverified data cannot authorize the fit', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const withoutSpec = api.analyze(demoPackage(api));

  const pkg = demoPackage(api);
  pkg.specContext = {
    schemaVersion: '1.0',
    specBody: 'API_5L',
    gradeKey: 'X52M_PSL2',
    displayName: 'Grade L360M / X52M PSL2',
    specEdition: 'API 5L traceability example',
    psl: 'PSL2',
    category: null,
    applicableForm: 'ERW_HFW',
    verification: { lastVerifiedBy: null, lastVerifiedDate: null, notes: 'Not verified' }
  };
  const parsed = api.parse(pkg);
  assert.equal(parsed.ok, true, JSON.stringify(parsed.errors));
  const warnings = new Set(parsed.warnings.map(item => item.code));
  assert.ok(warnings.has('SPEC_CONTEXT_UNVERIFIED'));
  assert.ok(warnings.has('SPEC_CONTEXT_TRACEABILITY_ONLY'));

  const withSpec = api.analyze(pkg);
  closeTo(withSpec.correction.value, withoutSpec.correction.value, 1e-9,
    'specification identity does not enter the fit');
  assert.equal(withSpec.governance.specContextUsedForFit, false);
  assert.equal(withSpec.governance.permittedForAcceptance, false);
  const summary = api.audit().package.specContext;
  assert.equal(summary.gradeKey, 'X52M_PSL2');
  assert.equal(summary.verification.verified, false);
  assert.equal(summary.use, 'traceability-only');
  assert.equal(Object.hasOwn(summary.verification, 'lastVerifiedBy'), false,
    'the compact audit does not persist verifier identity');
  assert.equal(Object.hasOwn(summary.verification, 'notes'), false,
    'the compact audit does not persist free-form specification notes');
});

test('synthetic calibration is always a candidate and never plant-approved', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.calibration;
  const result = api.analyze(demoPackage(api));
  assert.equal(result.ok, true);
  assert.equal(result.governance.status, 'calibration-candidate');
  assert.equal(result.governance.classification, 'Engineering screening');
  assert.equal(result.governance.plantCalibrated, false);
  assert.equal(result.governance.approval.status, 'pending-qualified-review');
  assert.equal(result.governance.permittedForAcceptance, false);
  assert.match(result.governance.reasons.join(' '), /candidate.*not.*approved|not an approved/i);
});

test('professional mode exposes an accessible eighth stage and imports the synthetic demo', async t => {
  const { win, doc } = await tool({
    storage: { 'spx-workspace-mode-v1': 'professional' }
  });
  t.after(() => win.close());
  const professional = win.__SPX.professional;

  const controls = [...doc.querySelectorAll(
    '#spx-professional-nav [data-professional-stage]'
  )];
  assert.deepEqual(controls.map(button => button.dataset.professionalStage), STAGES);
  professional.setStage('calibration');
  assert.equal(doc.activeElement,
    doc.getElementById('spx-professional-calibration-heading'));
  assert.deepEqual(controls.filter(button => button.getAttribute('aria-current') === 'step')
    .map(button => button.dataset.professionalStage), ['calibration']);
  assert.match(doc.querySelector('[data-professional-panel="calibration"]')?.textContent || '',
    /Calibration candidate|Calibrate & monitor/i);
  assert.equal(doc.querySelector('[data-professional-panel="calibration"]')?.hidden, false);

  const beforeScenario = copy(win.serializable());
  doc.querySelector('[data-pro-cal-demo]').click();
  await waitFor(win, w => w.__SPX.calibration.getSession().status === 'analyzed' &&
    w.__SPX.professional.getState().calibration.audit, 5000);
  assert.deepEqual(copy(win.serializable()), beforeScenario,
    'calibration import does not alter scenario serialization');

  const panelText = doc.querySelector('[data-professional-panel="calibration"]')?.textContent || '';
  assert.match(panelText, /Synthetic demonstration loaded and analyzed/i);
  assert.match(panelText, /group-separated holdout/i);
  assert.match(panelText,
    /Imported evidence comparison\s*Range gate satisfied\s*·?\s*imported rows only/i);
  assert.match(panelText,
    /New-input candidate application\s*Withheld\s*·?\s*no envelope or runtime gate/i);
  assert.match(panelText, /Acceptance use remains withheld|Specification \/ acceptance use\s*Withheld/i);
  const audit = professional.getState().calibration.audit;
  assert.equal(audit.governance.permittedForEvidenceComparison, true);
  assert.equal(audit.governance.permittedForScreening, false);
  assert.equal(audit.governance.permittedForApplication, false);
  const readiness = professional.calibrationReadiness();
  assert.equal(readiness.evidenceComparisonPermitted, true);
  assert.equal(readiness.screeningPermitted, false);
  assert.equal(readiness.applicationPermitted, false);
  const reportHtml = professional.reportHtml();
  assert.match(reportHtml, /Range-safe for the imported comparisons only/i);
  assert.match(reportHtml, /Candidate application to new inputs/i);
  assert.match(reportHtml, /no candidate applicability envelope/i);
  assert.ok(doc.querySelector('[aria-label="Scrollable generic candidate and actual comparison"]'));
  assert.ok(doc.querySelector('[aria-label="Scrollable calibration fit metrics"]'));
  assert.ok(doc.querySelector('[aria-label="Scrollable holdout validation metrics"]'));
  const driftChart = doc.querySelector('.spx-pro-cal-drift-svg');
  assert.ok(driftChart, 'the engine monitoring series reaches the professional chart');
  const limitLines = [...driftChart.querySelectorAll('.spx-pro-cal-limit')];
  assert.equal(limitLines.length, 2, 'the chart renders lower and upper EWMA limits');
  limitLines.forEach(line => {
    const yValues = (line.getAttribute('points') || '').split(/\s+/)
      .map(point => point.split(',')[1]).filter(Boolean);
    assert.ok(new Set(yValues).size > 1,
      'point-level ewmaLower/ewmaUpper values render as time-varying limits');
  });
});

test('raw record and group IDs remain in memory only, not audit, storage, scenario, or report', async t => {
  const { win, doc } = await tool({
    storage: { 'spx-workspace-mode-v1': 'professional' }
  });
  t.after(() => win.close());
  const professional = win.__SPX.professional;
  professional.setStage('calibration', false);
  const beforeScenario = copy(win.serializable());
  doc.querySelector('[data-pro-cal-demo]').click();
  await waitFor(win, w => w.__SPX.professional.getState().calibration.audit, 5000);

  const session = win.__SPX.calibration.getSession();
  const rawIds = session.package.rows.flatMap(row =>
    [row.recordId, row.heatId, row.batchId].filter(Boolean));
  assert.ok(rawIds.length > 0);
  const serialized = {
    audit: JSON.stringify(win.__SPX.calibration.audit()),
    localStorage: win.localStorage.getItem(PROFESSIONAL_STORAGE_KEY) || '',
    reportJson: professional.reportJson(),
    reportHtml: professional.reportHtml(),
    scenario: JSON.stringify(win.serializable())
  };
  for (const id of rawIds) {
    for (const [surface, text] of Object.entries(serialized)) {
      assert.equal(text.includes(id), false, `${id} is absent from ${surface}`);
    }
  }
  assert.deepEqual(copy(win.serializable()), beforeScenario);
  assert.equal(professional.getState().calibration.audit.privacy.rawRowsPersisted, false);
  assert.equal(professional.getState().calibration.audit.privacy.groupIdentifiersPersisted, false);
});

test('user-controlled diagnostic paths cannot smuggle group IDs into persistent surfaces', async t => {
  const source = await tool();
  t.after(() => source.win.close());
  const api = source.win.__SPX.calibration;
  const pkg = demoPackage(api);
  const privateId = pkg.rows[0].heatId;
  pkg.rows[0][`private-${privateId}-note`] = 'unknown input must stay session-only';
  const analyzed = api.analyze(pkg);
  assert.equal(analyzed.ok, true, JSON.stringify(analyzed.errors));
  const rawAudit = copy(api.audit());

  const persistedState = {
    schemaVersion: 1,
    activeStage: 'calibration',
    calibration: { audit: rawAudit }
  };
  const target = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [PROFESSIONAL_STORAGE_KEY]: JSON.stringify(persistedState)
    }
  });
  t.after(() => target.win.close());
  const professional = target.win.__SPX.professional;
  professional.setStage('report', false);
  const surfaces = {
    engineAudit: JSON.stringify(rawAudit),
    sanitizedAudit: JSON.stringify(professional.sanitizeCalibrationAudit(rawAudit)),
    localStorage: target.win.localStorage.getItem(PROFESSIONAL_STORAGE_KEY) || '',
    reportJson: professional.reportJson(),
    reportHtml: professional.reportHtml()
  };
  const leakedSurfaces = Object.entries(surfaces)
    .filter(([, text]) => text.includes(privateId))
    .map(([name]) => name);
  assert.deepEqual(leakedSurfaces, [],
    'user-controlled warning paths are canonicalized before audit or persistence');
});

test('report JSON carries a compact candidate audit while acceptance use stays withheld', async t => {
  const { win, doc } = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [PROFESSIONAL_STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        activeStage: 'calibration',
        definition: {
          caseTitle: 'Acceptance guard test', materialId: 'SYNTHETIC-QA',
          chemistrySource: 'illustrative-preset', processBasis: 'hypothetical'
        },
        question: { type: 'chemistry', text: 'Can this material be accepted?' },
        applicability: { intendedUse: 'acceptance-decision' }
      })
    }
  });
  t.after(() => win.close());
  doc.querySelector('[data-pro-cal-demo]').click();
  await waitFor(win, w => w.__SPX.professional.getState().calibration.audit, 5000);

  const professional = win.__SPX.professional;
  const record = JSON.parse(professional.reportJson());
  assert.equal(record.toolVersion, '1.4.0-plant-calibration');
  assert.equal(record.intendedUse, 'acceptance-decision');
  assert.equal(record.applicability.status, 'Output withheld');
  assert.equal(record.calibration.status, 'Calibration candidate');
  assert.equal(record.calibration.approval, 'withheld');
  assert.equal(record.calibration.acceptance, 'withheld');
  assert.equal(record.calibration.audit.governance.classification, 'Engineering screening');
  assert.equal(record.calibration.audit.governance.independentValidation, false);
  assert.equal(record.calibration.audit.privacy.rawRowsPersisted, false);
  assert.ok(record.governance.outputs.every(output => output.value == null));
});

test('calibration layouts have responsive, scroll, and dark-theme CSS contracts', () => {
  assert.match(PROFESSIONAL_CSS,
    /\.spx-pro-cal-metric-grid\s*\{[^}]*grid-template-columns/i);
  assert.match(PROFESSIONAL_CSS,
    /\.spx-pro-cal-trace-grid\s*\{[^}]*grid-template-columns/i);
  assert.match(PROFESSIONAL_CSS,
    /\.spx-pro-cal-drift-svg\s*\{[^}]*(?:overflow|max-width|width)/i);
  assert.match(PROFESSIONAL_CSS,
    /@media\s*\(max-width:\s*(?:880|760)px\)[\s\S]*\.spx-pro-cal-(?:metric|trace)-grid[\s\S]*grid-template-columns\s*:\s*1fr/i);
  assert.match(PROFESSIONAL_CSS,
    /\.spx-pro-cal-(?:drift-svg|chart-empty)[^}]*var\(--spx-(?:bg|surface2|border|muted|text)/i,
  'new chart surfaces inherit theme tokens instead of hard-coded light colours');
  assert.match(PROFESSIONAL_CSS,
    /html\[data-theme="dark"\][\s\S]*\.spx-pro-cal-/i,
  'dark mode has an explicit calibration visual contract');
});

test('the guide documents calibration unit, gate, chronology, and EWMA limits', () => {
  assert.match(GUIDE_HTML,
    /one constant replicate count across the calibration baseline and the same count in every monitoring group/i);
  assert.match(GUIDE_HTML,
    /baseline-to-monitoring count mismatch[^.]*force an insufficient result/i);
  assert.match(GUIDE_HTML,
    /physical-output gate covers only the imported calibration, holdout, and monitoring comparisons/i);
  assert.match(GUIDE_HTML,
    /new-input application remains withheld/i);
  assert.match(GUIDE_HTML,
    /actualValue[\s\S]{0,300}selected target[^<]*canonical unit/i);
  assert.match(GUIDE_HTML,
    /psi\/ksi\/Pa\/kPa\/GPa strength[^.]*fractional\/unitless\/true\/logarithmic strain[^.]*rejected rather than converted/i);
  assert.match(GUIDE_HTML,
    /K\/s is numerically compatible/i);
  assert.match(GUIDE_HTML,
    /coolingRateDefinition<\/code> must explicitly declare[^.]*C\/s[^.]*K\/s/i);
  assert.match(GUIDE_HTML,
    /Missing units, per-minute\/per-hour rates, and Fahrenheit definitions are rejected/i);
  assert.match(GUIDE_HTML,
    /Tied group times make chronology insufficient and suppress the EWMA sequence, limits, and triggers/i);
  assert.match(GUIDE_HTML,
    /variation indistinguishable from floating-point precision[^.]*insufficient result/i);
  assert.match(GUIDE_HTML,
    /numeric variation cannot support limits[^.]*residual and EWMA triggers are withheld/i);
  assert.match(GUIDE_HTML,
    /later-than-reference check, full monitoring chronology status/i);
});

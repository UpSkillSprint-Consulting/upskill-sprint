'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { bootTool, ready, ROOT } = require('./helpers/steel-phase-harness.js');

const STORAGE_KEY = 'spx-professional-workflow-v1';
const MODEL_IDS = [
  'spx-equilibrium-v1', 'spx-chemistry-v1', 'spx-property-v1',
  'spx-kinetics-v1', 'spx-hardenability-v1',
  'spx-austenitization-v1', 'spx-quench-v1',
  'spx-process-record-v1', 'spx-metallurgy-lab-v1'
];
const QUESTION_MODELS = {
  phases: ['spx-equilibrium-v1'],
  chemistry: ['spx-chemistry-v1', 'spx-property-v1'],
  transformations: ['spx-kinetics-v1'],
  'heat-treatment': ['spx-austenitization-v1', 'spx-quench-v1'],
  hardenability: ['spx-hardenability-v1'],
  'plant-data': ['spx-process-record-v1'],
  microstructure: ['spx-metallurgy-lab-v1'],
  other: []
};
const VALIDITY_STATES = [
  'In range', 'Near boundary', 'Out of domain', 'Not evaluated'
];

const copy = value => JSON.parse(JSON.stringify(value));

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}

function selectQuestion(win, doc, type) {
  win.__SPX.professional.setStage('question', false);
  const button = doc.querySelector(`[data-pro-question="${type}"]`);
  assert.ok(button, `${type} question control exists`);
  button.click();
}

function outputById(record, id) {
  return record.governance.outputs.find(output => output.outputId === id);
}

test('governance loads first and exposes a complete clone-only model registry', async t => {
  const { win, record } = await tool();
  t.after(() => win.close());

  const governance = win.__SPX.governance;
  assert.deepEqual(record.errors, []);
  assert.ok(record.loaded.indexOf('tools/steel-phase-explorer-governance.js') >= 0);
  assert.ok(record.loaded.indexOf('tools/steel-phase-explorer-governance.js') <
    record.loaded.indexOf('tools/steel-phase-explorer-professional.js'),
  'the governance engine loads before the professional integration');

  assert.deepEqual(Object.keys(governance.registry()), MODEL_IDS);
  assert.deepEqual(copy(governance.validityStates), VALIDITY_STATES);
  assert.deepEqual(copy(governance.classifications), [
    'Teaching', 'Engineering screening', 'Plant calibrated',
    'Specification acceptance'
  ]);
  assert.equal(governance.validateRegistry().valid, true);

  const registry = copy(governance.getRegistry());
  for (const id of MODEL_IDS) {
    const model = registry[id];
    assert.equal(model.id, id);
    assert.match(model.version, /^\d+\.\d+\.\d+$/);
    assert.ok(model.applicability.scope);
    assert.ok(model.applicability.inputDomain.length);
    assert.ok(model.applicability.exclusions.length);
    assert.ok(Array.isArray(model.dependencies));
    assert.ok(model.outputs.length);
    assert.ok(model.evidence.label);
    assert.equal(model.evidence.verified, false);
    assert.equal(model.approval.status, 'pending-qualified-review');
    assert.equal(model.approval.qualifiedMetallurgist, null);
    assert.ok(model.sources.every(source => source.reference && source.clauseRef));
    assert.ok(model.sources.every(source => source.verified === false));
    assert.ok(model.assumptions.length);
    assert.ok(model.uncertainty);
    assert.ok(model.requiredVerification.length);
    assert.ok(['Teaching', 'Engineering screening'].includes(model.classification),
      'unapproved models cannot claim elevated maturity');
  }
  assert.ok(MODEL_IDS.every(id => registry[id].classification === 'Teaching'),
    'pending models remain Teaching until their evidence and approval are qualified');

  const definitions = copy(governance.outputDefinitions());
  const declaredOutputs = Object.values(registry).flatMap(model => model.outputs).sort();
  assert.deepEqual(definitions.map(definition => definition.id).sort(), declaredOutputs,
    'every declared professional output has exactly one governed value definition');
  assert.equal(new Set(definitions.map(definition => definition.id)).size,
    definitions.length);

  registry['spx-property-v1'].title = 'caller mutation';
  registry['spx-property-v1'].sources[0].verified = true;
  assert.notEqual(governance.getModel('spx-property-v1').title, 'caller mutation');
  assert.equal(governance.getModel('spx-property-v1').sources[0].verified, false,
    'registry callers receive deep clones');

  for (const [question, ids] of Object.entries(QUESTION_MODELS)) {
    assert.deepEqual(copy(governance.modelsForQuestion(question)), ids);
  }

  const unsafe = copy(governance.registry());
  unsafe['spx-property-v1'].classification = 'Plant calibrated';
  unsafe['spx-property-v1'].dependencies.push('missing-model-v1');
  const unsafeValidation = copy(governance.validateRegistry(unsafe));
  assert.equal(unsafeValidation.valid, false);
  assert.match(unsafeValidation.errors.join(' '), /elevated classification/i);
  assert.match(unsafeValidation.errors.join(' '), /unresolved dependency/i);

  const requiredMetadataMutations = [
    model => { delete model.title; },
    model => { delete model.owner; },
    model => { delete model.evidence.level; },
    model => { delete model.evidence.validation; },
    model => { delete model.assumptions; },
    model => { delete model.uncertainty; },
    model => { delete model.requiredVerification; }
  ];
  for (const mutate of requiredMetadataMutations) {
    const incomplete = copy(governance.registry());
    mutate(incomplete['spx-property-v1']);
    assert.equal(governance.validateRegistry(incomplete).valid, false,
      'missing mandatory governance metadata fails registry validation');
  }

  const missingDefinition = copy(definitions);
  missingDefinition.pop();
  const incompleteValidation = copy(governance.validateRegistry(
    governance.registry(), missingDefinition));
  assert.equal(incompleteValidation.valid, false);
  assert.match(incompleteValidation.errors.join(' '), /no governed output definition/i);

  const mistypedUse = copy(governance.evaluate('spx-property-v1', {
    intendedUse: 'acceptance-decison'
  }));
  assert.equal(mistypedUse.permitted, false,
    'unknown policy values fail closed instead of becoming early screening');
  assert.match(mistypedUse.warnings.join(' '), /recognized intended use/i);

  for (const hostileId of ['__proto__', 'constructor', 'toString']) {
    assert.equal(governance.getModel(hostileId), null);
    const unknownModel = copy(governance.evaluate(hostileId, {
      intendedUse: 'early-screening'
    }));
    assert.equal(unknownModel.validity.state, 'Not evaluated');
    assert.equal(unknownModel.permitted, false);
    assert.deepEqual(copy(governance.modelsForQuestion(hostileId)), []);
    assert.doesNotThrow(() => governance.evaluateQuestion(hostileId, {
      intendedUse: 'early-screening'
    }));
    assert.doesNotThrow(() => governance.auditRecord({
      questionType: hostileId, intendedUse: 'early-screening'
    }));
  }

  const css = fs.readFileSync(path.join(ROOT,
    'tools/steel-phase-explorer-professional.css'), 'utf8');
  assert.match(css, /\.spx-pro-governance-strip/);
  assert.match(css, /\.spx-pro-governance-grid/);
  assert.match(css, /@media\(max-width:760px\)[\s\S]*spx-pro-governance-grid[\s\S]*grid-template-columns:1fr/);
  assert.match(css, /@media\(max-width:520px\)[\s\S]*spx-pro-classification-key[\s\S]*grid-template-columns:1fr/);
  assert.match(css, /@media\(max-width:880px\)[\s\S]*spx-pro-governance-grid[\s\S]*grid-template-columns:1fr/);
  assert.match(css, /spx-pro-governed-outputs[\s\S]*th:first-child[\s\S]*position:sticky/);
});

test('validity is conservative, dependency-aware, and blocks acceptance use', async t => {
  const { win, doc } = await tool({
    storage: {
      [STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        definition: {
          chemistrySource: 'heat-analysis', processBasis: 'hypothetical'
        },
        question: { type: 'chemistry', text: 'Screen the current heat chemistry.' },
        applicability: { intendedUse: 'early-screening' }
      })
    }
  });
  t.after(() => win.close());

  const governance = win.__SPX.governance;
  const professional = win.__SPX.professional;

  const unknown = copy(governance.assessModel('spx-does-not-exist-v1', {
    intendedUse: 'early-screening'
  }));
  assert.equal(unknown.validity.state, 'Not evaluated');
  assert.equal(unknown.permitted, false);

  win.state.chem.C = 0.019;
  win.renderChemistry();
  for (const id of [
    'spx-chemistry-v1', 'spx-property-v1', 'spx-kinetics-v1',
    'spx-hardenability-v1', 'spx-austenitization-v1', 'spx-quench-v1'
  ]) {
    const result = copy(governance.evaluate(id, { intendedUse: 'early-screening' }));
    assert.equal(result.validity.state, 'Out of domain', `${id} inherits invalid chemistry`);
    assert.equal(result.permitted, false);
  }

  const withheld = copy(governance.governedOutputs({
    estimatedHV: 999, martensitePct: 99
  }, { intendedUse: 'early-screening' }));
  const hardness = withheld.find(output => output.outputId === 'estimated-hardness');
  assert.equal(hardness.value, null);
  assert.equal(hardness.displayValue, 'Withheld');
  assert.equal(hardness.status, 'Withheld — out of domain');

  win.state.chem.C = 0.02;
  win.renderChemistry();
  assert.equal(governance.evaluate('spx-chemistry-v1').validity.state, 'Near boundary');
  win.state.chem.C = 0.4;
  win.renderChemistry();
  assert.equal(governance.evaluate('spx-chemistry-v1').validity.state, 'In range');

  Object.assign(win.state.chem, {
    C: 0.4, Mn: 3, Si: 3, Cr: 5, Ni: 5, Mo: 2, V: 1, Cu: 3
  });
  win.renderChemistry();
  for (const id of [
    'spx-chemistry-v1', 'spx-property-v1', 'spx-kinetics-v1',
    'spx-hardenability-v1', 'spx-austenitization-v1', 'spx-quench-v1'
  ]) {
    assert.equal(governance.evaluate(id, {
      intendedUse: 'early-screening'
    }).validity.state, 'Out of domain', `${id} rejects the high-alloy control extreme`);
  }

  const combinedExtreme = {
    C: 1, Mn: 1.7, Si: 0.5, Cr: 1.3, Ni: 0.85, Mo: 0.5,
    V: 0.12, Nb: 0.08, Ti: 0.04, B: 0.0025, Cu: 0.5
  };
  for (const id of [
    'spx-chemistry-v1', 'spx-property-v1', 'spx-kinetics-v1',
    'spx-hardenability-v1', 'spx-austenitization-v1', 'spx-quench-v1'
  ]) {
    const assessment = governance.evaluate(id, {
      intendedUse: 'early-screening', chemistry: combinedExtreme
    });
    assert.equal(assessment.validity.state, 'Out of domain',
      `${id} inherits the conservative combined-alloy guardrail`);
    assert.match(assessment.validity.reasons.join(' '), /CE IIW|Pcm|combined-alloy/i);
  }

  doc.getElementById('spx-grade-preset').value = '4140';
  doc.getElementById('spx-apply-grade').click();
  win.state.r2.aust.temp = 1290;
  assert.equal(governance.evaluate('spx-austenitization-v1', {
    intendedUse: 'early-screening'
  }).validity.state, 'Near boundary');
  assert.equal(governance.evaluate('spx-quench-v1', {
    intendedUse: 'early-screening'
  }).validity.state, 'Near boundary', 'dependency boundary severity propagates');
  win.state.r2.aust.temp = 880;
  win.state.r2.quench.bath = 20;
  assert.equal(governance.evaluate('spx-quench-v1', {
    intendedUse: 'early-screening'
  }).validity.state, 'Near boundary', 'medium-specific bath boundaries are governed');
  win.state.r2.quench.bath = 60;

  const carbonInput = doc.getElementById('spx-chem-C');
  carbonInput.value = '';
  carbonInput.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(win.state.chem.C, 0.4, 'the prior valid state is retained by the base tool');
  assert.equal(carbonInput.getAttribute('aria-invalid'), 'true');
  assert.equal(governance.evaluate('spx-property-v1').validity.state, 'Out of domain',
    'a visibly invalid input overrides the retained prior value');

  carbonInput.value = '0.4';
  carbonInput.dispatchEvent(new win.Event('input', { bubbles: true }));
  const beforeGovernanceOperations = JSON.stringify(win.serializable());
  selectQuestion(win, doc, 'chemistry');
  professional.setStage('applicability', false);
  const intendedUse = doc.getElementById('spx-pro-intended-use');
  intendedUse.value = 'acceptance-decision';
  intendedUse.dispatchEvent(new win.Event('change', { bubbles: true }));

  const acceptance = copy(professional.applicability());
  assert.equal(acceptance.status, 'Output withheld');
  assert.equal(acceptance.governance.permitted, false);
  assert.match(doc.querySelector('[data-governance-ui]').textContent,
    /all current model records remain Teaching[\s\S]*Specification acceptance classifications remain locked/i);
  const acceptanceRecord = copy(professional.buildRecord('2026-09-26T00:00:00.000Z'));
  assert.ok(acceptanceRecord.governance.outputs.every(output => output.value === null));
  assert.ok(acceptanceRecord.governance.outputs.some(output =>
    output.status === 'Withheld — intended use not permitted'));
  for (const output of acceptanceRecord.governance.outputs) {
    const definition = governance.outputDefinitions().find(item => item.id === output.outputId);
    assert.equal(acceptanceRecord.current.summary[definition.summaryKey], null,
      `${definition.summaryKey} cannot bypass acceptance governance through current.summary`);
  }

  const acceptanceSensitivity = copy(professional.runSensitivity({
    input: 'carbon', output: 'estimated-hardness', low: 0.35, high: 0.45
  }));
  assert.ok(acceptanceSensitivity.rows.every(row => row.value === null));
  assert.ok(acceptanceSensitivity.rows.every(row => row.status === 'Output withheld'));

  selectQuestion(win, doc, 'transformations');
  const transformationRecord = copy(professional.buildRecord());
  assert.deepEqual(transformationRecord.governance.outputs.map(output => output.modelId),
    ['spx-kinetics-v1']);
  assert.deepEqual(transformationRecord.governance.outputs.map(output => output.outputId),
    ['ttt-cct-fractions']);
  selectQuestion(win, doc, 'microstructure');
  const labRecord = copy(professional.buildRecord());
  assert.deepEqual(new Set(labRecord.governance.outputs.map(output => output.modelId)),
    new Set(['spx-metallurgy-lab-v1']));
  assert.equal(labRecord.governance.outputs.length, 3);

  const beforeEvidence = copy(governance.getModel('spx-property-v1'));
  professional.addEvidence({
    type: 'hardness', reference: 'Lab result 17',
    observation: 'Measured 410 HV', assessment: 'supports'
  });
  const afterEvidence = copy(governance.getModel('spx-property-v1'));
  assert.equal(afterEvidence.classification, beforeEvidence.classification);
  assert.deepEqual(afterEvidence.approval, beforeEvidence.approval);
  assert.deepEqual(afterEvidence.evidence, beforeEvidence.evidence,
    'user evidence cannot upgrade model evidence or approval');

  assert.equal(JSON.stringify(win.serializable()), beforeGovernanceOperations,
    'governance evaluation, reporting, and evidence metadata never mutate the engineering scenario');
});

test('screen, report, JSON, snapshots, and sensitivity share model versions and warnings', async t => {
  const { win, doc } = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        definition: {
          chemistrySource: 'heat-analysis', processBasis: 'hypothetical'
        }
      })
    }
  });
  t.after(() => win.close());

  const professional = win.__SPX.professional;
  selectQuestion(win, doc, 'chemistry');
  professional.setStage('applicability', false);

  const record = copy(professional.buildRecord('2026-09-26T12:00:00.000Z'));
  const output = outputById(record, 'estimated-hardness');
  assert.ok(output);
  assert.equal(output.modelId, 'spx-property-v1');
  assert.equal(output.modelVersion, '1.0.0');
  assert.equal(output.registryVersion, record.registryVersion);
  assert.equal(output.classification, 'Teaching');
  assert.equal(output.inputFingerprint, record.scenarioFingerprint);
  assert.ok(output.applicability.scope);
  assert.ok(output.sources.length);
  assert.ok(output.assumptions.length);
  assert.ok(output.evidence.validation);
  assert.ok(output.uncertainty);
  assert.ok(output.requiredVerification.length);
  assert.match(output.validity.reasons.join(' '),
    /internal numeric guardrails|qualified review/i);
  assert.equal(output.value, record.current.summary.estimatedHV);
  const approvalReadiness = record.readiness.items.find(item =>
    /qualified approval/i.test(item.label));
  assert.ok(approvalReadiness);
  assert.equal(approvalReadiness.ready, false);

  const uiRow = doc.querySelector('[data-governed-output="estimated-hardness"]');
  assert.ok(uiRow);
  assert.match(uiRow.textContent, new RegExp(output.modelId));
  assert.match(uiRow.textContent, new RegExp(`v${output.modelVersion.replaceAll('.', '\\.')}`));
  assert.ok(uiRow.textContent.includes(output.displayValue));
  assert.ok(uiRow.textContent.includes(output.validity.state));
  assert.ok(uiRow.textContent.includes(output.sources[0].reference));
  assert.ok(uiRow.textContent.includes(output.requiredVerification[0]));
  assert.ok(uiRow.textContent.includes(output.evidence.validation));
  assert.ok(uiRow.textContent.includes(output.status));

  const warning = record.governance.warnings.find(item =>
    /qualified metallurgist approval/i.test(item));
  assert.ok(warning);
  assert.ok(doc.querySelector('[data-governance-ui]').textContent.includes(warning));

  const html = professional.reportHtml();
  assert.match(html, /DRAFT — INCOMPLETE ENGINEERING SCREEN/);
  assert.ok(html.includes(output.modelId));
  assert.ok(html.includes(`v${output.modelVersion}`));
  assert.ok(html.includes(output.displayValue));
  assert.ok(html.includes(output.sources[0].reference));
  assert.ok(html.includes(output.requiredVerification[0]));
  assert.ok(html.includes(output.evidence.validation));
  assert.ok(html.includes(output.assumptions[0]));
  assert.ok(html.includes(warning));

  const json = professional.reportJson();
  const parsed = JSON.parse(json);
  const jsonOutput = outputById(parsed, 'estimated-hardness');
  assert.equal(jsonOutput.value, output.value);
  assert.equal(jsonOutput.status, output.status);
  assert.equal(jsonOutput.validity.state, output.validity.state);
  assert.equal(jsonOutput.modelId, output.modelId);
  assert.equal(jsonOutput.modelVersion, output.modelVersion);
  assert.ok(parsed.governance.warnings.includes(warning));

  const snapshot = copy(professional.captureSnapshot('baseline'));
  assert.equal(snapshot.governance.registryVersion, win.__SPX.governance.registryVersion);
  assert.deepEqual(snapshot.governance.models.map(model => model.id),
    ['spx-chemistry-v1', 'spx-property-v1']);
  assert.ok(snapshot.governance.assessmentFingerprint.startsWith('GOV-'));

  const sensitivity = copy(professional.runSensitivity({
    input: 'carbon', output: 'estimated-hardness', low: 0.13, high: 0.23
  }));
  assert.ok(sensitivity);
  assert.equal(sensitivity.governance.registryVersion, win.__SPX.governance.registryVersion);
  assert.deepEqual(sensitivity.governance.models.map(model => model.id),
    ['spx-property-v1']);
  assert.ok(sensitivity.rows.every(row => row.governance.modelId === 'spx-property-v1'));
  assert.ok(sensitivity.rows.every(row => row.governance.modelVersion === '1.0.0'));
  assert.ok(sensitivity.rows.every(row => row.governance.evidence.validation));

  const coolingSweep = copy(professional.runSensitivity({
    input: 'cooling-rate', output: 'estimated-hardness', low: 0.01, high: 1
  }));
  assert.equal(coolingSweep.low, 0.1,
    'sensitivity cannot calculate below the registered cooling-rate domain');
  assert.equal(coolingSweep.rows[0].input, 0.1);
  assert.equal(coolingSweep.rows[0].governance.validity.state, 'Near boundary');

  professional.setStage('applicability', false);
  const intendedUseControl = doc.getElementById('spx-pro-intended-use');
  intendedUseControl.value = 'acceptance-decision';
  intendedUseControl.dispatchEvent(new win.Event('change', { bubbles: true }));
  const staleJson = JSON.parse(professional.reportJson());
  assert.ok(staleJson.sensitivity.result.rows.every(row => row.value === null));
  assert.ok(staleJson.sensitivity.result.rows.every(row => row.status === 'Output withheld'));
  assert.match(professional.reportHtml(), /Stale result withheld/);

  doc.getElementById('spx-r3-sample').click();
  win.state.r3.fileName = 'confidential-heat-8472.csv';
  const processJson = professional.reportJson();
  assert.doesNotMatch(processJson, /confidential-heat-8472\.csv/);
  assert.doesNotMatch(processJson, /Temperature_C|"smooth"|"rawRows"/,
    'the governance export contains bounded metrics, not source rows');
  assert.match(processJson, /"processRows"\s*:\s*\d+/);
});

test('case policy fail-closes snapshots, provenance, conflicting evidence, and synthetic records', async t => {
  const { win, doc } = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        definition: {
          chemistrySource: 'heat-analysis', processBasis: 'hypothetical'
        },
        question: {
          type: 'chemistry', text: 'Screen the current heat chemistry.'
        },
        applicability: { intendedUse: 'early-screening' }
      })
    }
  });
  t.after(() => win.close());

  const professional = win.__SPX.professional;
  const setField = (id, value) => {
    const field = doc.getElementById(id);
    field.value = value;
    field.dispatchEvent(new win.Event('change', { bubbles: true }));
  };

  const baseline = copy(professional.captureSnapshot('baseline'));
  const baselineHardness = baseline.governance.outputs.find(
    output => output.outputId === 'estimated-hardness');
  assert.equal(Number.isFinite(baselineHardness.value), true);

  const carbon = doc.getElementById('spx-chem-C');
  carbon.value = '0.25';
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  professional.captureSnapshot('alternative');

  professional.setStage('applicability', false);
  setField('spx-pro-intended-use', 'acceptance-decision');
  const acceptanceRecord = copy(professional.buildRecord());
  assert.equal(acceptanceRecord.comparison.status.state, 'blocked');
  for (const snapshot of acceptanceRecord.comparison.snapshots) {
    assert.ok(snapshot.governance.outputs.every(output => output.value === null));
    assert.ok(snapshot.governance.outputs.every(output =>
      output.status === 'Output withheld'));
    assert.equal(snapshot.summary.estimatedHV, null);
  }
  assert.doesNotMatch(professional.reportHtml(), new RegExp(
    `Estimated hardness: ${baselineHardness.value} HV \\(Available`));

  setField('spx-pro-intended-use', 'early-screening');
  professional.setStage('define', false);
  setField('spx-pro-chem-source', 'unknown');
  const unknownProvenance = copy(professional.buildRecord());
  assert.ok(unknownProvenance.governance.outputs.every(output => output.value === null));
  assert.ok(unknownProvenance.governance.outputs.some(output =>
    output.status === 'Withheld — provenance incomplete'));
  const provenanceSensitivity = copy(professional.runSensitivity({
    input: 'carbon', output: 'estimated-hardness', low: 0.15, high: 0.35
  }));
  assert.ok(provenanceSensitivity.rows.every(row => row.value === null));
  assert.match(provenanceSensitivity.rows[0].reason, /provenance|chemistry source/i);

  setField('spx-pro-chem-source', 'heat-analysis');
  setField('spx-pro-process-basis', 'actual-record');
  selectQuestion(win, doc, 'plant-data');
  doc.getElementById('spx-r3-sample').click();
  const syntheticRecord = copy(professional.buildRecord());
  assert.equal(syntheticRecord.governance.inputProvenance.thermalRecordKind,
    'synthetic-sample');
  assert.ok(syntheticRecord.governance.outputs.every(output => output.value === null));
  assert.ok(syntheticRecord.governance.outputs.every(output =>
    /synthetic sample/i.test(output.status)));
  assert.match(syntheticRecord.governance.warnings.join(' '),
    /synthetic sample|not.*actual process record/i);
  assert.match(professional.reportHtml(),
    /Bundled synthetic sample—not an actual process record/i);

  selectQuestion(win, doc, 'chemistry');
  professional.addEvidence({
    type: 'hardness', reference: 'Traverse conflict 7',
    observation: 'Measured response contradicts the screen.',
    assessment: 'conflicts'
  });
  const conflict = copy(professional.buildRecord());
  assert.equal(conflict.applicability.status, 'Output withheld');
  assert.equal(conflict.governance.inputProvenance.conflictingEvidenceUnresolved,
    true);
  assert.ok(conflict.governance.outputs.every(output => output.value === null));
  assert.ok(conflict.governance.outputs.some(output =>
    output.status === 'Withheld — conflicting evidence'));
  const conflictSensitivity = copy(professional.runSensitivity({
    input: 'carbon', output: 'estimated-hardness', low: 0.15, high: 0.35
  }));
  assert.ok(conflictSensitivity.rows.every(row => row.value === null));
  assert.match(conflictSensitivity.rows[0].reason, /conflicting/i);

  const reportDoc = new win.DOMParser().parseFromString(
    professional.reportHtml(), 'text/html');
  const reportTables = [...reportDoc.querySelectorAll('table')];
  assert.ok(reportTables.length >= 8);
  assert.ok(reportTables.every(table => table.tabIndex === 0));
  assert.ok(reportTables.every(table => /^Scrollable /.test(
    table.getAttribute('aria-label') || '')));
});

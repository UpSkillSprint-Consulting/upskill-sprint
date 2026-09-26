'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { bootTool, ready, waitFor, ROOT } = require('./helpers/steel-phase-harness.js');

const STORAGE_KEY = 'spx-professional-workflow-v1';
const STAGES = [
  'define', 'question', 'applicability', 'compare',
  'sensitivity', 'evidence', 'report'
];
const TABS = [
  'navigator', 'equilibrium', 'path', 'kinetics', 'chemistry',
  'hardenability', 'austenitization', 'quenching', 'process-data',
  'metallurgy-lab', 'reference-diagrams', 'learn'
];
const QUESTION_TYPES = new Set([
  'chemistry', 'phases', 'transformations', 'heat-treatment',
  'hardenability', 'plant-data', 'microstructure', 'other'
]);
const EVIDENCE_TYPES = new Set([
  'chemistry', 'thermal', 'hardness', 'metallography',
  'mechanical', 'process', 'standard'
]);
const EVIDENCE_ASSESSMENTS = new Set([
  'supports', 'conflicts', 'inconclusive', 'not-assessed'
]);
const APPLICABILITY_STATUSES = new Set([
  'Calculation available — conditional',
  'Output withheld',
  'Not evaluated',
  'User-record assisted'
]);
const APPLICABILITY_CHECKS = [
  'provenance', 'chemistry', 'question-model', 'plant-evidence', 'intended-use'
];
const PROFESSIONAL_CSS = fs.readFileSync(
  path.join(ROOT, 'tools', 'steel-phase-explorer-professional.css'), 'utf8'
);
const RELEASE1_CSS = fs.readFileSync(
  path.join(ROOT, 'tools', 'steel-phase-explorer-release1.css'), 'utf8'
);

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  await waitFor(ctx.win, win => win.__SPX && win.__SPX.professional);
  return ctx;
}

function assertScenarioHasNoProfessionalState(scenario) {
  for (const key of [
    'professional', 'professionalWorkflow', 'activeStage', 'definition',
    'question', 'applicability', 'snapshots', 'sensitivity', 'evidence', 'report'
  ]) {
    assert.equal(Object.hasOwn(scenario, key), false,
      `${key} must remain local workflow state rather than shared scenario data`);
  }
}

function bySlot(state, slot) {
  return (state.snapshots || []).find(snapshot => snapshot.slot === slot);
}

function stageValue(element) {
  return element.dataset.professionalStage || element.dataset.proStage;
}

function stageControls(doc) {
  return [...doc.querySelectorAll(
    '#spx-professional-nav [data-professional-stage], #spx-professional-nav [data-pro-stage]'
  )];
}

test('professional mode exposes an accessible seven-stage shell without replacing any lab', async t => {
  const { win, doc, record } = await tool({
    storage: { 'spx-workspace-mode-v1': 'professional' }
  });
  t.after(() => win.close());

  assert.deepEqual(record.errors, [], 'the professional workspace initializes cleanly');
  assert.equal(win.__SPX.release1.getWorkspaceMode(), 'professional');

  const shell = doc.getElementById('spx-professional-shell');
  const nav = doc.getElementById('spx-professional-nav');
  const workspace = doc.getElementById('spx-professional-workspace');
  assert.ok(shell && nav && workspace, 'the shell, stage navigation, and workspace are present');
  assert.equal(shell.hidden, false);
  assert.match(RELEASE1_CSS,
    /data-workspace-mode="professional"[^\n]*\.spx-student-shell[\s\S]{0,260}display\s*:\s*none/i,
    'Professional mode has an explicit visual-hiding contract for the student shell');
  assert.match(PROFESSIONAL_CSS,
    /data-workspace-mode="student"[^\n]*\.spx-professional-shell[\s\S]{0,220}display\s*:\s*none/i,
    'Student mode has an explicit visual-hiding contract for the professional shell');
  assert.match(nav.getAttribute('aria-label') || '', /professional|engineering|workflow/i);

  const stageButtons = stageControls(doc);
  assert.deepEqual(stageButtons.map(stageValue), STAGES);
  stageButtons.forEach(button => {
    assert.equal(button.tagName, 'BUTTON');
    assert.equal(button.type, 'button');
  });
  assert.deepEqual(
    [...doc.querySelectorAll('.spx-tabs [data-tab]')].map(tab => tab.dataset.tab),
    TABS,
    'Step 3 layers a workflow over the complete existing tool'
  );
  assert.deepEqual(
    [...doc.querySelectorAll('[data-panel]')].map(panel => panel.dataset.panel),
    TABS
  );

  win.__SPX.release1.setWorkspaceMode('student', false);
  assert.equal(doc.getElementById('spx-tool').dataset.workspaceMode, 'student');
  assert.deepEqual([...doc.querySelectorAll('.spx-tabs [data-tab]')]
    .map(tab => tab.dataset.tab), TABS);
});

test('every professional stage has one current control and one visible panel without changing the scenario', async t => {
  const { win, doc } = await tool({
    storage: { 'spx-workspace-mode-v1': 'professional' }
  });
  t.after(() => win.close());

  const api = win.__SPX.professional;
  const before = copy(win.serializable());
  const calculation = {
    phases: copy(win.__SPX.phaseFractions(0.42, 780)),
    chemistry: copy(win.__SPX.chemMetrics()),
    kinetics: copy(win.__SPX.kineticsFractions())
  };

  for (const stage of STAGES) {
    const button = stageControls(doc).find(control => stageValue(control) === stage);
    assert.ok(button, `${stage} has a stage control`);
    button.click();

    assert.equal(api.getState().activeStage, stage);
    assert.deepEqual(
      [...doc.querySelectorAll('#spx-professional-nav [aria-current="step"]')]
        .map(stageValue),
      [stage],
      `${stage} is the sole current workflow step`
    );
    const visiblePanels = [...doc.querySelectorAll(
      '#spx-professional-workspace [data-professional-panel], ' +
      '#spx-professional-workspace .spx-pro-panel'
    )].filter((panel, index, all) => !panel.hidden && all.indexOf(panel) === index);
    assert.equal(visiblePanels.length, 1, `${stage} has one visible workflow panel`);
    assert.match(visiblePanels[0].textContent, {
      define: /define|material|process/i,
      question: /question/i,
      applicability: /applicability/i,
      compare: /compare/i,
      sensitivity: /sensitivity|uncertainty/i,
      evidence: /evidence/i,
      report: /report/i
    }[stage]);
    assert.equal(doc.activeElement,
      doc.getElementById(`spx-professional-${stage}-heading`),
      `${stage} moves keyboard focus to its visible heading`);
  }

  api.setStage('define', false);
  const defineButton = stageControls(doc).find(control => stageValue(control) === 'define');
  const questionButton = stageControls(doc).find(control => stageValue(control) === 'question');
  defineButton.focus();
  const arrow = new win.KeyboardEvent('keydown', {
    key: 'ArrowRight', bubbles: true, cancelable: true
  });
  defineButton.dispatchEvent(arrow);
  assert.equal(arrow.defaultPrevented, true);
  assert.equal(doc.activeElement, questionButton);
  assert.equal(api.getState().activeStage, 'question');

  assert.deepEqual(copy(win.serializable()), before,
    'workflow navigation cannot alter engineering inputs or results');
  assert.deepEqual({
    phases: copy(win.__SPX.phaseFractions(0.42, 780)),
    chemistry: copy(win.__SPX.chemMetrics()),
    kinetics: copy(win.__SPX.kineticsFractions())
  }, calculation);
  assertScenarioHasNoProfessionalState(win.serializable());
});

test('professional state sanitizer allowlists enums, bounds collections, and resists prototype data', async t => {
  const { win } = await tool();
  t.after(() => win.close());

  const hostile = JSON.parse(JSON.stringify({
    schemaVersion: 99,
    activeStage: 'constructor',
    definition: {
      caseTitle: 'X'.repeat(12000),
      materialId: '<img src=x onerror=alert(1)>',
      chemistrySource: 'unknown-source',
      processBasis: 'Y'.repeat(12000),
      context: 'Z'.repeat(12000),
      reviewedFingerprint: { not: 'a string' }
    },
    question: { type: 'prototype', text: 'Q'.repeat(12000) },
    applicability: { intendedUse: 'I'.repeat(12000), reviewedFingerprint: 44 },
    snapshots: Array.from({ length: 40 }, (_, index) => ({
      slot: index % 2 ? 'bad-slot' : 'baseline',
      label: 'S'.repeat(12000),
      capturedAt: {},
      fingerprint: 7,
      scenario: { unit: 'metric' },
      unknown: true
    })),
    sensitivity: {
      input: 'constructor', output: 'confidence-band',
      low: -Infinity, high: Infinity, uncertaintyNote: 'U'.repeat(12000)
    },
    evidence: Array.from({ length: 100 }, (_, index) => ({
      id: `e-${index}`,
      type: 'unverified-proof',
      reference: 'R'.repeat(12000),
      date: 'not-a-date',
      observation: '<script>unsafe()</script>'.repeat(800),
      assessment: 'validated',
      createdAt: {}
    })),
    report: {
      interpretation: 'T'.repeat(12000), nextAction: 'N'.repeat(12000),
      owner: 'O'.repeat(12000), dueDate: 'not-a-date', extra: true
    },
    unknownRoot: true,
    __proto__: { polluted: true }
  }));

  const clean = copy(win.__SPX.professional.sanitizeState(hostile));
  assert.equal(clean.schemaVersion, 1);
  assert.ok(STAGES.includes(clean.activeStage));
  assert.ok(clean.question.type === '' || QUESTION_TYPES.has(clean.question.type));
  assert.ok(['carbon', 'cooling-rate'].includes(clean.sensitivity.input));
  assert.ok(['estimated-hardness', 'martensite'].includes(clean.sensitivity.output));
  assert.ok(clean.snapshots.length <= 3, 'snapshot slots are bounded');
  assert.ok(clean.snapshots.every(snapshot =>
    ['baseline', 'alternative', 'option3'].includes(snapshot.slot)));
  assert.ok(clean.evidence.length <= 20, 'evidence records are bounded');
  assert.ok(clean.evidence.every(item => EVIDENCE_TYPES.has(item.type)));
  assert.ok(clean.evidence.every(item => EVIDENCE_ASSESSMENTS.has(item.assessment)));
  assert.ok(Object.values(clean.definition).every(value =>
    typeof value !== 'string' || value.length < 12000));
  assert.ok(Object.values(clean.report).every(value =>
    typeof value !== 'string' || value.length < 12000));
  assert.equal(Object.hasOwn(clean, 'unknownRoot'), false);
  assert.equal(Object.hasOwn(clean.report, 'extra'), false);
  assert.equal({}.polluted, undefined);
  assert.doesNotMatch(JSON.stringify(clean), /(?:NaN|Infinity)/);
});

test('workflow state persists locally but never enters scenario serialization', async () => {
  const first = await tool({
    storage: { 'spx-workspace-mode-v1': 'professional' }
  });
  let stored;
  let scenario;
  try {
    const api = first.win.__SPX.professional;
    api.setStage('evidence');
    api.captureSnapshot('baseline');
    stored = first.win.localStorage.getItem(STORAGE_KEY);
    scenario = copy(first.win.serializable());

    assert.ok(stored, 'professional workflow state is saved in its dedicated local key');
    const parsed = JSON.parse(stored);
    assert.equal(parsed.activeStage, 'evidence');
    assert.ok(bySlot(parsed, 'baseline'));
    assertScenarioHasNoProfessionalState(scenario);
  } finally {
    first.win.close();
  }

  const second = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [STORAGE_KEY]: stored
    }
  });
  try {
    const restored = copy(second.win.__SPX.professional.getState());
    assert.equal(restored.activeStage, 'evidence');
    assert.ok(bySlot(restored, 'baseline'));
    assert.deepEqual(copy(second.win.serializable()), scenario,
      'reloading local workflow state cannot rewrite the engineering scenario');
    assertScenarioHasNoProfessionalState(second.win.serializable());
  } finally {
    second.win.close();
  }
});

test('comparison captures three deep-cloned slots and fingerprints stale scenarios without applying them', async t => {
  const { win } = await tool({
    storage: { 'spx-workspace-mode-v1': 'professional' }
  });
  t.after(() => win.close());

  const api = win.__SPX.professional;
  const initialScenario = copy(win.serializable());
  const initialFingerprint = api.fingerprint();
  const baseline = api.captureSnapshot('a');
  assert.equal(baseline.slot, 'baseline');
  assert.equal(baseline.fingerprint, initialFingerprint);
  assert.deepEqual(copy(win.serializable()), initialScenario,
    'capturing a comparison snapshot is read-only');

  win.__SPX.setPoint(0.62, 900);
  win.state.chem.C = 0.62;
  win.renderChemistry();
  const alternativeFingerprint = api.fingerprint();
  assert.notEqual(alternativeFingerprint, initialFingerprint,
    'the fingerprint detects an engineering-scenario change');
  const alternative = api.captureSnapshot('b');
  assert.equal(alternative.slot, 'alternative');

  win.__SPX.setPoint(0.30, 760);
  const option3 = api.captureSnapshot('c');
  assert.equal(option3.slot, 'option3');

  let state = copy(api.getState());
  assert.deepEqual(state.snapshots.map(snapshot => snapshot.slot),
    ['baseline', 'alternative', 'option3']);
  assert.equal(bySlot(state, 'baseline').fingerprint, initialFingerprint);
  assert.notEqual(bySlot(state, 'baseline').fingerprint, api.fingerprint(),
    'a saved baseline remains traceably stale after the active scenario changes');

  baseline.label = 'mutated return value';
  assert.notEqual(bySlot(copy(api.getState()), 'baseline').label, baseline.label,
    'the API does not expose a mutable reference to stored comparison evidence');

  api.captureSnapshot('a');
  state = copy(api.getState());
  assert.equal(state.snapshots.length, 3, 'recapturing a slot replaces it rather than appending');
  assert.equal(bySlot(state, 'baseline').fingerprint, api.fingerprint());
});

test('applicability has a fixed evidence vocabulary and fails closed for invalid chemistry', async t => {
  const { win } = await tool({
    storage: {
      [STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        question: { type: 'chemistry', text: 'Screen the current heat chemistry.' }
      })
    }
  });
  t.after(() => win.close());

  const api = win.__SPX.professional;
  const current = copy(api.applicability());
  assert.ok(APPLICABILITY_STATUSES.has(current.status));
  assert.deepEqual(current.checks.map(check => check.id), APPLICABILITY_CHECKS);
  current.checks.forEach(check => {
    assert.ok(APPLICABILITY_STATUSES.has(check.status),
      `${check.id} uses the approved applicability vocabulary`);
    assert.equal(typeof (check.detail || check.reason), 'string');
  });
  assert.equal(current.checks.find(check => check.id === 'plant-evidence').status,
    'Not evaluated', 'the model cannot imply plant corroboration that was not entered');

  win.state.chem.C = 0;
  win.renderChemistry();
  const invalid = copy(api.applicability());
  const chemistry = invalid.checks.find(check => check.id === 'chemistry');
  assert.equal(chemistry.status, 'Output withheld');
  assert.match(chemistry.detail || chemistry.reason, /carbon|0\.02|scope|unavailable/i);
  assert.equal(invalid.status, 'Output withheld');
});

test('one-factor sensitivity returns traceable rows and never mutates the active scenario', async t => {
  const { win } = await tool();
  t.after(() => win.close());

  const api = win.__SPX.professional;
  const beforeScenario = copy(win.serializable());
  const beforeFingerprint = api.fingerprint();
  const result = copy(api.runSensitivity({
    input: 'carbon', output: 'estimated-hardness', low: 0.10, high: 0.60
  }));

  assert.equal(result.input, 'carbon');
  assert.equal(result.output, 'estimated-hardness');
  assert.ok(Array.isArray(result.rows));
  assert.ok(result.rows.length >= 3, 'a bounded sweep provides multiple comparison points');
  result.rows.forEach(row => {
    assert.equal(Number.isFinite(row.input), true);
    assert.equal(Number.isFinite(row.output == null ? row.value : row.output), true);
  });
  assert.match(result.uncertaintyNote || '', /screen|estimate|heuristic|uncertain|verify/i);
  assert.doesNotMatch(JSON.stringify(result),
    /(?:95% confidence|confidence interval|statistical significance)/i,
    'a deterministic screening sweep must not masquerade as statistical uncertainty');
  assert.deepEqual(copy(win.serializable()), beforeScenario);
  assert.equal(api.fingerprint(), beforeFingerprint);

  const persisted = copy(api.getState()).sensitivity;
  assert.equal(persisted.input, 'carbon');
  assert.equal(persisted.output, 'estimated-hardness');
  assert.ok(persisted.result && Array.isArray(persisted.result.rows));
});

test('engineering report escapes local evidence and includes validity, traceability, and limitations', async t => {
  const hostileState = {
    schemaVersion: 1,
    activeStage: 'report',
    definition: {
      caseTitle: '<img src=x onerror=alert(1)>',
      materialId: 'HEAT&42',
      chemistrySource: 'heat analysis',
      processBasis: 'production trial',
      context: 'Quarter-depth review',
      reviewedFingerprint: ''
    },
    question: {
      type: 'chemistry',
      text: '<script>alert("question")</script>'
    },
    applicability: {
      intendedUse: 'Screen alternatives before controlled verification',
      reviewedFingerprint: ''
    },
    snapshots: [],
    sensitivity: {
      input: 'carbon', output: 'estimated-hardness', low: 0.2, high: 0.6,
      uncertaintyNote: 'One-factor screening only', result: []
    },
    evidence: [{
      id: 'e-1',
      type: 'chemistry',
      reference: 'CERT<&>1',
      date: '2026-09-25',
      observation: '<svg onload=alert(1)>Measured by OES</svg>',
      assessment: 'conflicts',
      createdAt: '2026-09-25T12:00:00.000Z'
    }],
    report: {
      interpretation: '<b>Do not trust raw HTML</b>',
      nextAction: 'Verify with hardness traverse and metallography',
      owner: 'Process engineer',
      dueDate: '2026-10-15'
    }
  };
  const { win } = await tool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [STORAGE_KEY]: JSON.stringify(hostileState)
    }
  });
  t.after(() => win.close());

  win.state.chem.C = 0;
  win.renderChemistry();
  const before = copy(win.serializable());
  const html = win.__SPX.professional.reportHtml();

  assert.equal(typeof html, 'string');
  assert.match(html, /<!doctype html>|<html/i);
  for (const heading of [
    /case|material/i, /engineering question|question/i, /applicability/i,
    /comparison|scenario/i, /sensitivity/i, /plant evidence|evidence/i,
    /limitation|screening/i
  ]) assert.match(html, heading);
  assert.match(html, /Scenario fingerprint/i);
  assert.match(html, /Tool version/i);
  assert.match(html, /Output withheld/i,
    'invalid dependent calculations remain withheld in the exported record');
  assert.match(html, /conflicts/i);
  assert.match(html, /HEAT&amp;42/);
  assert.match(html, /&lt;img/i);
  assert.match(html, /&lt;script/i);
  assert.match(html, /&lt;svg/i);
  assert.doesNotMatch(html, /<img\s+src=x\s+onerror=/i);
  assert.doesNotMatch(html, /<script>\s*alert\("question"\)/i);
  assert.doesNotMatch(html, /<svg\s+onload=/i);
  assert.deepEqual(copy(win.serializable()), before,
    'report generation is a read-only operation');
  assertScenarioHasNoProfessionalState(win.serializable());
});

test('null sensitivity defaults survive unrelated saves and run without manual bounds', async t => {
  const { win } = await tool();
  t.after(() => win.close());

  const api = win.__SPX.professional;
  assert.equal(api.getState().sensitivity.low, null);
  assert.equal(api.getState().sensitivity.high, null);

  api.setStage('question', false);
  const afterSave = copy(api.getState()).sensitivity;
  assert.equal(afterSave.low, null,
    'saving another workflow field must not coerce an unset low bound to zero');
  assert.equal(afterSave.high, null,
    'saving another workflow field must not coerce an unset high bound to zero');
  const persisted = JSON.parse(win.localStorage.getItem(STORAGE_KEY));
  assert.equal(persisted.sensitivity.low, null);
  assert.equal(persisted.sensitivity.high, null);

  const result = copy(api.runSensitivity({}));
  assert.ok(result, 'the default bounded sensitivity should run without manual values');
  assert.equal(result.rows.length, 3);
  assert.ok(result.low <= result.baseline && result.baseline <= result.high);
  assert.ok(result.low < result.high);
});

test('engineering fingerprints ignore presentation controls but include omitted decision inputs', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const api = win.__SPX.professional;
  const original = api.fingerprint();

  win.__SPX.release1.setExperience('advanced', false);
  assert.equal(api.fingerprint(), original,
    'explanation detail is presentation state rather than an engineering-input change');

  doc.querySelector('#spx-r4-subnav [data-r4-panel="mechanical"]').click();
  assert.equal(api.fingerprint(), original,
    'opening a metallurgy-lab subpanel must not stale a reviewed case');

  doc.getElementById('spx-r5-zoom-in').click();
  assert.equal(api.fingerprint(), original,
    'reference-diagram zoom must not stale a reviewed case');

  const property = doc.getElementById('spx-property-rate');
  property.value = String(Math.min(160, Number(property.value) + 31));
  property.dispatchEvent(new win.Event('input', { bubbles: true }));
  const withPropertyRate = api.fingerprint();
  assert.notEqual(withPropertyRate, original,
    'the non-serialized property cooling-rate control is decision-relevant');

  const pathCarbon = doc.getElementById('spx-path-carbon');
  pathCarbon.value = String(Math.min(1.2, Number(pathCarbon.value) + 0.13));
  pathCarbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.notEqual(api.fingerprint(), withPropertyRate,
    'the non-serialized thermal-path carbon control is decision-relevant');
});

test('cooling-rate sensitivity uses the chemistry property-rate baseline, not the kinetics rate', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const kineticsRate = doc.getElementById('spx-kin-cooling');
  kineticsRate.value = '2';
  kineticsRate.dispatchEvent(new win.Event('input', { bubbles: true }));

  const propertyRate = doc.getElementById('spx-property-rate');
  propertyRate.value = '120';
  propertyRate.dispatchEvent(new win.Event('input', { bubbles: true }));
  const displayedPropertyRate = Math.pow(10, Number(propertyRate.value) / 40 - 1);
  assert.equal(displayedPropertyRate, 100);
  assert.notEqual(displayedPropertyRate, Number(kineticsRate.value));

  const result = copy(win.__SPX.professional.runSensitivity({
    input: 'cooling-rate', output: 'estimated-hardness', low: 10, high: 200
  }));
  assert.equal(result.baseline, displayedPropertyRate);
  assert.equal(result.rows.find(row => row.point === 'baseline').input,
    displayedPropertyRate);
});

test('withheld sensitivity cannot be marked ready and its reasons survive into the report', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const propertyRate = doc.getElementById('spx-property-rate');
  propertyRate.value = '80';
  propertyRate.dispatchEvent(new win.Event('input', { bubbles: true }));

  const carbon = doc.getElementById('spx-chem-C');
  carbon.value = '';
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');

  const api = win.__SPX.professional;
  const result = copy(api.runSensitivity({
    input: 'cooling-rate', output: 'estimated-hardness', low: 5, high: 20
  }));
  assert.ok(result.rows.some(row => row.status === 'Output withheld'));
  assert.ok(result.rows.some(row => /visible chemistry input is invalid/i.test(row.reason)));

  api.setStage('sensitivity', false);
  const stage = doc.querySelector(
    '#spx-professional-nav [data-professional-stage="sensitivity"]');
  assert.notEqual(stage.dataset.state, 'ready');
  assert.match(stage.textContent, /needs attention|withheld|blocked/i);

  const report = api.reportHtml();
  assert.match(report, /visible chemistry input is invalid/i,
    'the report must preserve why a sensitivity output was withheld');
});

test('loading session process data invalidates an earlier applicability review', async t => {
  const seeded = {
    schemaVersion: 1,
    activeStage: 'applicability',
    definition: {
      chemistrySource: 'heat-analysis', processBasis: 'actual-record'
    },
    question: {
      type: 'plant-data', text: 'Review the measured cooling record.'
    },
    applicability: { intendedUse: 'investigation-support' }
  };
  const { win, doc } = await tool({
    storage: { [STORAGE_KEY]: JSON.stringify(seeded) }
  });
  t.after(() => win.close());

  const api = win.__SPX.professional;
  api.setStage('applicability', false);
  doc.querySelector('[data-pro-review-applicability]').click();
  assert.equal(api.applicability().reviewed, true);
  assert.equal(win.__SPX.release3.getData().length, 0);

  win.__SPX.release3.loadText(
    'Time_s,Temperature_C\n0,900\n1,850\n2,800\n3,750',
    'heat-42.csv'
  );
  assert.ok(win.__SPX.release3.getData().length >= 3);
  const afterLoad = copy(api.applicability());
  assert.equal(afterLoad.checks.find(check => check.id === 'question-model').status,
    'User-record assisted');
  assert.equal(afterLoad.reviewed, false,
    'new process evidence must be reviewed before the prior applicability acknowledgement is current');

  api.captureSnapshot('baseline');
  const storedWorkflow = win.localStorage.getItem(STORAGE_KEY);
  assert.doesNotMatch(storedWorkflow, /heat-42\.csv/i,
    'a session thermal filename must not enter professional local storage');
});

test('persisted snapshots preserve unavailable numeric outputs as null', async () => {
  const first = await tool();
  let stored;
  try {
    const carbon = first.doc.getElementById('spx-chem-C');
    carbon.value = '';
    carbon.dispatchEvent(new first.win.Event('input', { bubbles: true }));
    assert.equal(carbon.getAttribute('aria-invalid'), 'true');

    const snapshot = first.win.__SPX.professional.captureSnapshot('baseline');
    assert.equal(snapshot.summary.estimatedHV, null);
    assert.equal(snapshot.summary.martensitePct, null);
    stored = first.win.localStorage.getItem(STORAGE_KEY);
    const persisted = bySlot(JSON.parse(stored), 'baseline');
    assert.equal(persisted.summary.estimatedHV, null);
    assert.equal(persisted.summary.martensitePct, null);
  } finally {
    first.win.close();
  }

  const second = await tool({ storage: { [STORAGE_KEY]: stored } });
  try {
    const restored = bySlot(copy(second.win.__SPX.professional.getState()), 'baseline');
    assert.equal(restored.summary.estimatedHV, null);
    assert.equal(restored.summary.martensitePct, null);
  } finally {
    second.win.close();
  }
});

test('reviewing a not-evaluated applicability case does not mark the stage ready', async t => {
  const seeded = {
    schemaVersion: 1,
    activeStage: 'applicability',
    definition: {
      chemistrySource: 'heat-analysis', processBasis: 'actual-record'
    },
    question: {
      type: 'plant-data', text: 'Review the measured cooling record.'
    },
    applicability: { intendedUse: 'investigation-support' }
  };
  const { win, doc } = await tool({
    storage: { [STORAGE_KEY]: JSON.stringify(seeded) }
  });
  t.after(() => win.close());

  const api = win.__SPX.professional;
  assert.equal(api.applicability().status, 'Not evaluated');
  api.setStage('applicability', false);
  doc.querySelector('[data-pro-review-applicability]').click();
  assert.equal(api.applicability().reviewed, true,
    'the acknowledgement itself is recorded for traceability');

  const stage = doc.querySelector(
    '#spx-professional-nav [data-professional-stage="applicability"]');
  assert.notEqual(stage.dataset.state, 'ready');
  assert.match(stage.textContent, /needs attention|not evaluated|blocked/i);
});

test('switching model questions refreshes generated prompts but preserves authored text', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  win.__SPX.professional.setStage('question', false);
  doc.querySelector('[data-pro-question="chemistry"]').click();
  const chemistryPrompt = doc.querySelector(
    '[data-pro-question="chemistry"] .spx-pro-card-copy').textContent;
  assert.equal(doc.getElementById('spx-pro-question-text').value, chemistryPrompt);

  doc.querySelector('[data-pro-question="phases"]').click();
  const phasesPrompt = doc.querySelector(
    '[data-pro-question="phases"] .spx-pro-card-copy').textContent;
  assert.notEqual(phasesPrompt, chemistryPrompt);
  assert.equal(doc.getElementById('spx-pro-question-text').value, phasesPrompt,
    'a prior generated prompt is replaced when its model question changes');

  const custom = 'Determine why the quarter-depth result diverges from the trial.';
  const text = doc.getElementById('spx-pro-question-text');
  text.value = custom;
  text.dispatchEvent(new win.Event('input', { bubbles: true }));
  doc.querySelector('[data-pro-question="transformations"]').click();
  assert.equal(doc.getElementById('spx-pro-question-text').value, custom,
    'authored question text is not overwritten by a new model selection');
});

test('comparison is blocked when the current question text or type changes', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const api = win.__SPX.professional;
  api.setStage('question', false);
  doc.querySelector('[data-pro-question="chemistry"]').click();
  api.captureSnapshot('baseline');
  win.__SPX.setPoint(0.33, 860);
  api.captureSnapshot('alternative');
  api.setStage('compare', false);

  const compareStage = () => doc.querySelector(
    '#spx-professional-nav [data-professional-stage="compare"]');
  assert.equal(compareStage().dataset.state, 'ready');

  api.setStage('question', false);
  const questionText = doc.getElementById('spx-pro-question-text');
  questionText.value = 'Compare the same cases against a revised decision criterion.';
  questionText.dispatchEvent(new win.Event('input', { bubbles: true }));
  api.setStage('compare', false);
  assert.equal(compareStage().dataset.state, 'blocked',
    'snapshots captured under old question text cannot remain comparable');

  api.captureSnapshot('baseline');
  win.__SPX.setPoint(0.47, 820);
  api.captureSnapshot('alternative');
  assert.equal(compareStage().dataset.state, 'ready');

  api.setStage('question', false);
  doc.querySelector('[data-pro-question="phases"]').click();
  api.setStage('compare', false);
  assert.equal(compareStage().dataset.state, 'blocked',
    'snapshots captured under another model question cannot remain comparable');
  assert.match(doc.querySelector('[data-professional-panel="compare"]').textContent,
    /different basis or question|recapture/i);
});

test('editing evidence preserves the original creation timestamp', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const api = win.__SPX.professional;
  const created = api.addEvidence({
    type: 'hardness',
    reference: 'Traverse HT-17',
    date: '2026-09-25',
    observation: 'Centre measured 382 HV.',
    assessment: 'inconclusive'
  });
  assert.ok(created.createdAt);
  await new Promise(resolve => setTimeout(resolve, 15));

  api.setStage('evidence', false);
  doc.querySelector(`[data-pro-edit-evidence="${created.id}"]`).click();
  doc.getElementById('spx-pro-evidence-reference').value = 'Traverse HT-17 revised';
  doc.getElementById('spx-pro-evidence-observation').value =
    'Centre measured 382 HV after instrument check.';
  doc.getElementById('spx-pro-evidence-form').dispatchEvent(
    new win.Event('submit', { bubbles: true, cancelable: true })
  );

  const edited = api.getState().evidence.find(item => item.id === created.id);
  assert.equal(edited.createdAt, created.createdAt);
  assert.equal(edited.reference, 'Traverse HT-17 revised');
  assert.match(edited.observation, /instrument check/i);
});

test('question and intended-use rerenders retain keyboard focus', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const api = win.__SPX.professional;
  api.setStage('question', false);
  doc.querySelector('[data-pro-question="hardenability"]').click();
  assert.equal(doc.activeElement,
    doc.querySelector('[data-pro-question="hardenability"]'));

  api.setStage('applicability', false);
  let intendedUse = doc.getElementById('spx-pro-intended-use');
  intendedUse.focus();
  intendedUse.value = 'acceptance-decision';
  intendedUse.dispatchEvent(new win.Event('change', { bubbles: true }));
  intendedUse = doc.getElementById('spx-pro-intended-use');
  assert.equal(doc.activeElement, intendedUse);
  assert.equal(intendedUse.value, 'acceptance-decision');
});

test('closing report preview restores focus to its launch control', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  win.__SPX.professional.setStage('report', false);
  const launch = doc.querySelector('[data-pro-preview-report]');
  const preview = doc.getElementById('spx-professional-report-preview');
  preview.scrollIntoView = () => {};
  launch.focus();
  launch.click();

  assert.equal(preview.hidden, false);
  assert.equal(doc.activeElement, preview);
  assert.ok(preview.querySelector('iframe').getAttribute('srcdoc'));

  preview.querySelector('[data-pro-close-preview]').click();
  assert.equal(preview.hidden, true);
  assert.equal(doc.activeElement, doc.querySelector('[data-pro-preview-report]'));
  assert.equal(preview.querySelector('iframe').hasAttribute('srcdoc'), false);
});

test('Print / PDF writes the report and invokes print when a popup is allowed', async t => {
  const calls = {
    open: [], documentOpen: 0, writes: [], documentClose: 0,
    focus: 0, print: 0, close: 0
  };
  const popup = {
    opener: {},
    document: {
      open() { calls.documentOpen++; },
      write(value) { calls.writes.push(String(value)); },
      close() { calls.documentClose++; }
    },
    focus() { calls.focus++; },
    print() { calls.print++; },
    close() { calls.close++; }
  };
  const { win, doc } = await tool({
    beforeParse(browserWindow) {
      browserWindow.open = (...args) => {
        calls.open.push(args);
        return popup;
      };
    }
  });
  t.after(() => win.close());

  win.__SPX.professional.setStage('report', false);
  doc.querySelector('[data-pro-print-report]').click();

  assert.deepEqual(calls.open, [['about:blank', '_blank']]);
  assert.equal(popup.opener, null);
  assert.equal(calls.documentOpen, 1);
  assert.equal(calls.documentClose, 1);
  assert.equal(calls.focus, 1);
  assert.equal(calls.print, 1);
  assert.equal(calls.close, 0);
  assert.equal(calls.writes.length, 1);
  assert.match(calls.writes[0], /<!doctype html>/i);
  assert.match(calls.writes[0], /screening report/i);
  assert.match(doc.getElementById('spx-professional-action-status').textContent,
    /print view opened/i);
});

test('plant-data snapshots compare distinct records by compact non-reversible evidence', async t => {
  const seeded = {
    schemaVersion: 1,
    activeStage: 'compare',
    definition: {
      chemistrySource: 'heat-analysis', processBasis: 'actual-record'
    },
    question: {
      type: 'plant-data', text: 'Compare two measured cooling records.'
    },
    applicability: { intendedUse: 'compare-alternatives' }
  };
  const { win, doc } = await tool({
    storage: { [STORAGE_KEY]: JSON.stringify(seeded) }
  });
  t.after(() => win.close());

  const recordA = [
    'Time_s,Temperature_C',
    '0,1000', '10,900', '20,850', '30,800', '40,750', '50,700',
    '60,650', '70,600', '80,500', '90,400', '100,300', '110,200'
  ].join('\n');
  const recordB = [
    'Time_s,Temperature_C',
    '0,1000', '20,900', '40,850', '60,800', '80,750', '100,700',
    '120,650', '140,600', '160,500', '180,400', '200,300', '220,200',
    '240,100'
  ].join('\n');
  const api = win.__SPX.professional;

  win.__SPX.release3.loadText(recordA, 'confidential-heat-a.csv');
  const baseline = api.captureSnapshot('baseline');
  win.__SPX.release3.loadText(recordB, 'confidential-heat-b.csv');
  const alternative = api.captureSnapshot('alternative');

  const expectedMetrics = [
    'processRows', 'processEvents', 'processDuration',
    'processTempMinC', 'processTempMaxC',
    'processRate800500', 'processRate500300'
  ];
  for (const snapshot of [baseline, alternative]) {
    assert.match(snapshot.summary.recordFingerprint,
      /^RECORD-[0-9a-f]{8}-\d+$/i,
      'the stored identity is a bounded one-way fingerprint, not source data');
    for (const key of expectedMetrics) {
      assert.equal(Object.hasOwn(snapshot.summary, key), true,
        `${key} is retained as compact comparison evidence`);
      assert.equal(Number.isFinite(snapshot.summary[key]), true,
        `${key} is a finite compact metric for the selected records`);
    }
  }
  assert.notEqual(baseline.summary.recordFingerprint,
    alternative.summary.recordFingerprint);
  assert.equal(baseline.fingerprint, alternative.fingerprint,
    'scenario identity stays separate from the trace fingerprint for session-only record evidence');
  assert.notEqual(baseline.summary.processDuration,
    alternative.summary.processDuration);
  assert.notEqual(baseline.summary.processRate800500,
    alternative.summary.processRate800500);

  api.setStage('compare', false);
  const comparisonStage = doc.querySelector(
    '#spx-professional-nav [data-professional-stage="compare"]');
  assert.equal(comparisonStage.dataset.state, 'ready');
  const comparisonPanel = doc.querySelector('[data-professional-panel="compare"]');
  assert.match(comparisonPanel.textContent, /comparison ready/i);
  assert.doesNotMatch(comparisonPanel.textContent, /scenarios match/i);

  const storedText = win.localStorage.getItem(STORAGE_KEY);
  assert.doesNotMatch(storedText, /confidential-heat-[ab]\.csv/i);
  assert.equal(storedText.includes(recordA), false);
  assert.equal(storedText.includes(recordB), false);
  const persisted = JSON.parse(storedText);
  const persistedBaseline = bySlot(persisted, 'baseline');
  const persistedAlternative = bySlot(persisted, 'alternative');
  assert.equal(persistedBaseline.summary.recordFingerprint,
    baseline.summary.recordFingerprint);
  assert.equal(persistedAlternative.summary.recordFingerprint,
    alternative.summary.recordFingerprint);
  function containsRawThermalRows(value) {
    if (!value || typeof value !== 'object') return false;
    if (Array.isArray(value) && value.some(row => row && typeof row === 'object' &&
      Object.hasOwn(row, 'time') && Object.hasOwn(row, 'temp') &&
      (Object.hasOwn(row, 'smooth') || Object.hasOwn(row, 'rate')))) return true;
    return Object.values(value).some(containsRawThermalRows);
  }
  assert.equal(containsRawThermalRows(persisted.snapshots), false,
    'derived or raw time-temperature rows are never persisted in snapshots');

  const report = api.reportHtml();
  const reportDoc = new win.DOMParser().parseFromString(report, 'text/html');
  const comparisonHeading = [...reportDoc.querySelectorAll('h2')]
    .find(heading => /scenario comparison/i.test(heading.textContent));
  let comparisonTable = comparisonHeading && comparisonHeading.nextElementSibling;
  while (comparisonTable && comparisonTable.tagName !== 'TABLE') {
    comparisonTable = comparisonTable.nextElementSibling;
  }
  assert.ok(comparisonTable, 'the report contains a scenario-comparison table');
  const reportRows = [...comparisonTable.querySelectorAll('tbody tr')];
  for (const snapshot of [baseline, alternative]) {
    const row = reportRows.find(candidate =>
      candidate.textContent.includes(snapshot.summary.recordFingerprint));
    assert.ok(row, `the report includes ${snapshot.summary.recordFingerprint}`);
    assert.match(row.textContent, /thermal|record/i);
    assert.match(row.textContent, /800\s*(?:→|->|to)\s*500/i);
    assert.match(row.textContent, /500\s*(?:→|->|to)\s*300/i);
    assert.ok(row.textContent.includes(String(snapshot.summary.processRows)));
    assert.ok(row.textContent.includes(String(snapshot.summary.processDuration)));
  }
  assert.doesNotMatch(report, /confidential-heat-[ab]\.csv/i);
  assert.equal(report.includes(recordA), false);
  assert.equal(report.includes(recordB), false);
});

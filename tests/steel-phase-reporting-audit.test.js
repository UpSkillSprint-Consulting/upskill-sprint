'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

const STORAGE_KEY = 'spx-professional-workflow-v1';

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

async function tool() {
  const ctx = bootTool({
    storage: {
      'spx-workspace-mode-v1': 'professional',
      [STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        definition: {
          caseTitle: 'Audit replay case',
          materialId: 'HEAT-001',
          chemistrySource: 'heat-analysis',
          processBasis: 'hypothetical'
        },
        question: {
          type: 'chemistry',
          text: 'Screen the current heat chemistry.'
        },
        applicability: { intendedUse: 'early-screening' },
        report: {
          conclusion: 'Use as a governed screening record only.',
          interpretation: 'The current result requires plant confirmation.',
          nextAction: 'Complete qualified review.',
          preparedBy: 'Process Engineer',
          reviewedBy: 'Metallurgist',
          revisionLabel: 'Baseline review'
        }
      })
    }
  });
  await ready(ctx.win);
  return ctx;
}

test('Step 6 audit package captures revision, SI inputs, outputs, chart data, and checksum', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.professional;

  const pkg = copy(api.createReplayPackage(
    'Baseline review', '2026-09-26T16:30:00.000Z'));

  assert.equal(pkg.recordType, 'steel-professional-replay-package');
  assert.equal(pkg.schemaVersion, '1.0');
  assert.equal(pkg.revision.label, 'Baseline review');
  assert.match(pkg.revision.id, /^REV-/);
  assert.match(pkg.checksum, /^AUDIT-/);
  assert.equal(pkg.originalInputs.scenario.unit, win.serializable().unit);
  assert.equal(pkg.siInputs.unitSystem, 'SI');
  assert.deepEqual(pkg.siInputs.chemistryWtPct, copy(win.state.chem));
  assert.ok(pkg.reportRecord.governance.outputs.length > 0);
  assert.ok(pkg.chartData.equilibrium.points.length > 0);
  assert.ok(Array.isArray(pkg.chartData.thermalCycle.steps));
  assert.deepEqual(pkg.replay.expectedSignature.current, pkg.reportRecord.current);
  assert.equal(api.verifyReplayPackage(pkg).valid, true);

  const json = JSON.parse(api.replayJson(
    'Baseline review', '2026-09-26T16:30:00.000Z'));
  assert.equal(api.verifyReplayPackage(json).valid, true);
  assert.match(api.reportHtml(), /Audit checksum/);
  assert.match(api.reportHtml(), /Prepared by/);
  assert.match(api.reportHtml(), /Process Engineer/);
  assert.match(api.reportHtml(), /Reviewed by/);
});

test('tampered replay packages fail closed without changing the active scenario', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.professional;
  const before = JSON.stringify(win.serializable());
  const pkg = copy(api.createReplayPackage('Controlled baseline'));

  pkg.originalInputs.scenario.chem.C = 0.91;
  const verification = api.verifyReplayPackage(pkg);
  assert.equal(verification.valid, false);
  assert.match(verification.reason, /checksum/i);

  const replay = api.replayPackage(pkg);
  assert.equal(replay.ok, false);
  assert.match(replay.reason, /checksum/i);
  assert.equal(JSON.stringify(win.serializable()), before);
});

test('deterministic replay restores the exact governed UI result and chart data', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.professional;

  doc.getElementById('spx-r3-sample').click();
  const pkg = copy(api.createReplayPackage(
    'Thermal baseline', '2026-09-26T16:35:00.000Z'));
  assert.ok(pkg.chartData.processRecord.rows.length > 2);

  win.state.chem.C = 0.62;
  win.renderChemistry();
  win.__SPX.release3.clearData();
  assert.notEqual(api.fingerprint(), pkg.scenarioFingerprint);

  const result = api.replayPackage(pkg);
  assert.equal(result.ok, true, result.reason);
  assert.equal(result.verified, true);
  assert.equal(result.checksum, pkg.checksum);
  assert.equal(api.fingerprint(), pkg.scenarioFingerprint);
  assert.equal(win.__SPX.release3.getData().length,
    pkg.chartData.processRecord.rows.length);
});

test('local audit revisions are bounded, persisted, and exposed in the report workspace', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.professional;
  api.setStage('report', false);

  const revision = api.createRevision('Operator review');
  assert.ok(revision);
  assert.equal(api.getState().revisions.length, 1);
  assert.equal(api.getState().revisions[0].checksum, revision.checksum);
  assert.ok(doc.querySelector(`[data-pro-replay-revision="${revision.id}"]`));
  assert.ok(doc.querySelector(`[data-pro-download-revision="${revision.id}"]`));
  assert.match(doc.getElementById('spx-professional-workspace').textContent,
    /deterministic replay/i);
});

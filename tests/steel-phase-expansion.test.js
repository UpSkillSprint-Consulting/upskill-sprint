'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}

test('Step 8 loads complete dual-audience module coverage without replacing original tabs', async t => {
  const { win, doc, record } = await tool();
  t.after(() => win.close());

  assert.equal(win.__SPX.expansion.version, '1.0.0');
  assert.equal(win.__SPX.expansion.modules.length, 12);
  assert.equal(doc.querySelectorAll('.spx-tabs [data-tab]').length, 12);
  assert.equal(doc.querySelectorAll('#spx-expansion-coverage [data-expansion-open]').length, 12);
  assert.ok(doc.getElementById('spx-full-expansion'));
  assert.ok(doc.getElementById('spx-activity-preview'));
  assert.ok(doc.getElementById('spx-review-pack-preview'));
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-expansion.js'));
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-expansion.css'));
  assert.deepEqual(record.errors, []);
});

test('all expanded learning paths use the same six-stage learning contract and survive progress migration', async t => {
  const { win, doc } = await tool({
    storage: {
      'spx-student-progress-v1': JSON.stringify({
        studentArea: 'learn',
        activePath: 'phases',
        paths: { phases: { completed: [0, 1], activeStep: 2 } },
        visitedTabs: ['equilibrium']
      })
    }
  });
  t.after(() => win.close());

  const paths = win.__SPX.release1.getLearningPaths();
  const ids = Object.keys(paths);
  assert.equal(ids.length, 12);
  for (const id of [
    'phases', 'transformations', 'heat-treatment', 'calibration',
    'hardenability', 'austenitization', 'quench-temper', 'process-data',
    'characterization', 'surface-diffusion', 'steelmaking-rolling',
    'reference-literacy'
  ]) {
    assert.ok(paths[id], id + ' is available');
    assert.equal(paths[id].predictionOptions.length, 3, id + ' has a prediction');
    assert.equal(paths[id].checkOptions.length, 3, id + ' has a knowledge check');
    assert.ok(paths[id].objective);
    assert.ok(paths[id].apply);
  }

  const progress = win.__SPX.release1.getStudentProgress();
  assert.deepEqual(progress.paths.phases.completed, [0, 1]);
  assert.equal(Object.keys(progress.paths).length, 12);
  assert.equal(doc.querySelectorAll('#spx-learning-paths [data-learning-path]').length, 12);
});

test('activity builder produces bounded six-stage briefs for every original module', async t => {
  const { win } = await tool();
  t.after(() => win.close());

  const expansion = win.__SPX.expansion;
  for (const module of expansion.modules) {
    const activity = expansion.buildActivity(module.id, 45, 'lab-note');
    assert.equal(activity.schemaVersion, 1);
    assert.equal(activity.moduleId, module.id);
    assert.equal(activity.sequence.length, 6);
    assert.deepEqual(activity.sequence.map(stage => stage.stage),
      ['Predict', 'Manipulate', 'Observe', 'Explain', 'Check', 'Apply']);
    assert.match(activity.guardrail, /does not authorize a process/i);
  }

  const fallback = expansion.buildActivity('__proto__', 999, 'unsafe');
  assert.equal(fallback.moduleId, 'equilibrium');
  assert.equal(fallback.durationMinutes, 45);
  assert.equal(fallback.evidenceType, 'lab-note');
});

test('professional review packs remain engineering-screening checklists with acceptance withheld', async t => {
  const { win, doc } = await tool({
    storage: { 'spx-workspace-mode-v1': 'professional' }
  });
  t.after(() => win.close());

  const expansion = win.__SPX.expansion;
  for (const id of ['chemistry', 'heat-treatment', 'thermal', 'characterization', 'qualification']) {
    const pack = expansion.buildReviewPack(id);
    assert.equal(pack.schemaVersion, 1);
    assert.equal(pack.kind, 'steel-phase-professional-review-pack');
    assert.ok(pack.modules.length >= 3);
    assert.ok(pack.checks.length >= 5);
    assert.equal(pack.governance.classification, 'Engineering screening');
    assert.equal(pack.governance.acceptance, 'Withheld');
  }

  doc.getElementById('spx-review-pack-select').value = 'thermal';
  doc.getElementById('spx-review-pack-select')
    .dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.match(doc.getElementById('spx-review-pack-preview').textContent,
    /Thermal-record investigation[\s\S]*Source and chronology verified/i);
});

test('expanded module routing changes only navigation and preserves the active engineering scenario', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  win.__SPX.setPoint(0.47, 812);
  const before = JSON.parse(JSON.stringify(win.serializable()));
  assert.equal(win.__SPX.expansion.openModule('hardenability'), true);
  assert.equal(win.__SPX.getState().tab, 'hardenability');
  assert.deepEqual(JSON.parse(JSON.stringify(win.serializable())), before);
  assert.equal(win.__SPX.expansion.openModule('__proto__'), false);

  doc.getElementById('spx-activity-module').value = 'process-data';
  doc.getElementById('spx-activity-module')
    .dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.match(doc.getElementById('spx-activity-preview').textContent,
    /Thermal data and measurement[\s\S]*candidate arrest/i);
});

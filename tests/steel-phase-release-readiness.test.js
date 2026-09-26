'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { bootTool, ready, ROOT } = require('./helpers/steel-phase-harness.js');

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}

function passing() {
  return {
    studentParticipants: 10, studentRouteAttempts: 20, studentRouteSuccesses: 18,
    firstInteractionSeconds: 60, lessonsStarted: 20, lessonsCompleted: 17,
    preScore: 50, postScore: 70, sus: 80,
    professionalParticipants: 10, professionalTaskAttempts: 20,
    professionalTaskSuccesses: 18, criticalErrors: 0,
    pilotReference: 'PILOT-001', independentValidation: true,
    validationReference: 'PLANT-VAL-001', metallurgistApproval: true,
    approverName: 'Qualified reviewer', approvalScope: 'Controlled pilot scope',
    attested: true
  };
}

test('Step 9 loads a clearly labelled, accessible release gate without removing modules', async t => {
  const { win, doc, record } = await tool();
  t.after(() => win.close());
  assert.equal(win.__SPX.releaseReadiness.version, '1.0.0');
  assert.equal(doc.querySelectorAll('.spx-tabs [data-tab]').length, 12);
  assert.ok(doc.getElementById('spx-release-readiness'));
  assert.equal(doc.getElementById('spx-release-status').getAttribute('aria-live'), 'polite');
  assert.equal(doc.querySelectorAll('#spx-release-readiness fieldset').length, 3);
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-release-readiness.js'));
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-release-readiness.css'));
});

test('empty or unattested browser input never claims release readiness', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.releaseReadiness;
  const empty = api.evaluatePilot({});
  assert.equal(empty.ready, false);
  assert.equal(empty.status, 'Pilot evidence required');
  assert.match(empty.notice, /not independent proof/i);
  const unattested = api.evaluatePilot({ ...passing(), attested: false });
  assert.equal(unattested.ready, false);
});

test('student and professional thresholds pass exactly at their stated boundaries', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const report = win.__SPX.releaseReadiness.evaluatePilot(passing());
  assert.equal(report.student.pass, true);
  assert.equal(report.professional.pass, true);
  assert.equal(report.governance.pass, true);
  assert.equal(report.ready, true);
  assert.equal(report.status, 'Ready for controlled release');
});

test('one critical professional error or one missing authority blocks readiness', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.releaseReadiness;
  assert.equal(api.evaluatePilot({ ...passing(), criticalErrors: 1 }).ready, false);
  assert.equal(api.evaluatePilot({ ...passing(), metallurgistApproval: false }).ready, false);
  assert.equal(api.evaluatePilot({ ...passing(), validationReference: '' }).ready, false);
});

test('automated product failure cannot be overridden by passing pilot entries', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const gates = win.__SPX.releaseReadiness.automatedGates();
  gates[0].pass = false;
  const report = win.__SPX.releaseReadiness.evaluatePilot(passing(), gates);
  assert.equal(report.automated.pass, false);
  assert.equal(report.ready, false);
  assert.equal(report.status, 'Release blocked');
});

test('Step 9 is presentation-only and preserves scenario calculations and serialization', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.__SPX.setPoint(0.47, 812);
  const before = JSON.parse(JSON.stringify(win.serializable()));
  const calculations = JSON.parse(JSON.stringify({
    phase: win.__SPX.phaseFractions(0.47, 812), chemistry: win.__SPX.chemMetrics()
  }));
  doc.querySelector('[name="spx-studentParticipants"]').value = '10';
  doc.querySelector('[name="spx-studentParticipants"]').dispatchEvent(new win.Event('input', { bubbles: true }));
  win.__SPX.release1.setWorkspaceMode('professional', false);
  assert.deepEqual(JSON.parse(JSON.stringify(win.serializable())), before);
  assert.deepEqual(JSON.parse(JSON.stringify({
    phase: win.__SPX.phaseFractions(0.47, 812), chemistry: win.__SPX.chemMetrics()
  })), calculations);
});

test('release CSS explicitly covers every required responsive breakpoint', () => {
  const css = fs.readFileSync(path.join(ROOT, 'tools/steel-phase-explorer-release-readiness.css'), 'utf8');
  for (const width of [360, 390, 768, 1024, 1440]) {
    assert.match(css, new RegExp(`(?:max|min)-width:${width}px`));
  }
});

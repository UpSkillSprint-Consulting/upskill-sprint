'use strict';
// CI-only helpers. Never imported by the student application.
const assert = require('node:assert/strict');
const path = require('node:path');
const { atomicJson } = require('./student-audit-supervisor.cjs');

function publishProgress(out, report, operation = report.operation || report.current || {label:'setup'}) {
  const event = { source: report.source, ...report.current, ...operation };
  atomicJson(path.join(out, 'progress.json'), event);
  if (process.connected && process.send) process.send({ type: 'student-audit-progress', operation: event }, () => {});
}


async function bounded(label, operation, milliseconds, onProgress = () => {}) {
  assert.ok(Number.isFinite(milliseconds) && milliseconds > 0);
  let timer;
  const started = Date.now();
  onProgress({ label, status: 'running' });
  try {
    const result = await Promise.race([
      Promise.resolve().then(operation),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`AUDIT_TIMEOUT: ${label} exceeded ${milliseconds}ms`)), milliseconds);
      })
    ]);
    onProgress({ label, status: 'passed', elapsedMs: Date.now() - started });
    return result;
  } catch (error) {
    onProgress({ label, status: 'failed', elapsedMs: Date.now() - started, error: String(error) });
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

const TAGS = Object.freeze(['wcag2a', 'wcag2aa']);
const installedEngines = new WeakMap();
const activeScans = new WeakSet();
async function analyzeSingleDocument(page, AxeBuilder, selector) {
  // No scan result is cached. Only reuse the installed engine in the same
  // document; axe.run performs a fresh DOM evaluation for every call/theme.
  // Navigation destroys window.axe and causes a fresh builder bootstrap.
  assert.equal(page.frames().length, 1, 'Audit scope changed: frame-aware scan required');
  assert.ok(!activeScans.has(page), 'Concurrent accessibility scans in one document');
  activeScans.add(page);
  try {
    const installed = installedEngines.get(page);
    let result = null;
    if (installed && installed.builder === AxeBuilder) {
      result = await page.evaluate(({ selector, version, tags }) => {
        if (!window.axe || window.axe.version !== version || typeof window.axe.run !== 'function') return null;
        // Same public axe.run call/options as AxeBuilder's supported legacy path.
        return window.axe.run({ include: [selector] }, { runOnly: { type: 'tag', values: tags } });
      }, { selector, version: installed.version, tags: [...TAGS] });
    }
    if (result === null) {
      result = await new AxeBuilder({page}).include(selector).withTags([...TAGS]).setLegacyMode(true).analyze();
      if (result.testEngine?.name === 'axe-core' && typeof result.testEngine.version === 'string') {
        installedEngines.set(page, { builder: AxeBuilder, version: result.testEngine.version });
      }
    }
    assert.equal(page.frames().length, 1, 'Audit scope changed during scan: frame-aware scan required');
    assert.ok(Array.isArray(result.violations) && Array.isArray(result.passes) && Array.isArray(result.incomplete));
    assert.ok(result.passes.length + result.violations.length + result.incomplete.length > 0, 'Accessibility scan returned no evaluated rules');
    return result;
  } finally { activeScans.delete(page); }
}

function verifyCoverage(report, expectedQuestions) {
  assert.equal(report.questions.length, 175, 'All canonical questions must be exercised');
  assert.equal(report.reviews.length, 175, 'All canonical reviews must be exercised');
  for (const records of [report.questions, report.reviews]) {
    assert.equal(new Set(records.map(r => r.qid)).size, 175);
    assert.deepEqual(records.map(r => r.number), Array.from({length:175}, (_,i) => i + 1), 'Canonical question numbers must be complete and ordered');
    if (expectedQuestions) assert.deepEqual(records.map(r => r.qid), expectedQuestions.map(q => q.qid), 'Evidence must cover the actual canonical bank');
    for (const r of records) {
      assert.deepEqual(r.checks.map(c => c.theme), ['light', 'dark']);
      for (const c of r.checks) {
        if (report.accessibilityRequired) assert.equal(c.a11y?.completed, true, 'Missing accessibility evaluation');
      }
    }
  }
  assert.deepEqual(report.questions.map(r=>r.qid), report.reviews.map(r=>r.qid), 'Reviews must match the exercised questions');
  if (report.accessibilityRequired) assert.equal(report.accessibilityScans, 700, 'Every question/review/theme requires a scan');
}

module.exports = { bounded, analyzeSingleDocument, verifyCoverage, TAGS, publishProgress, atomicJson };

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
async function analyzeSingleDocument(page, AxeBuilder, selector) {
  // The student view has no iframes. Assert that prerequisite on every scan so
  // same-document execution can never silently omit a subsequently added frame.
  // AxeBuilder's supported legacy mode uses axe.run in the page rather than
  // opening/closing a synthetic result-aggregation tab for each of 700 scans.
  assert.equal(page.frames().length, 1, 'Audit scope changed: frame-aware scan required');
  const result = await new AxeBuilder({page}).include(selector).withTags([...TAGS]).setLegacyMode(true).analyze();
  assert.equal(page.frames().length, 1, 'Audit scope changed during scan: frame-aware scan required');
  assert.ok(Array.isArray(result.violations) && Array.isArray(result.passes) && Array.isArray(result.incomplete));
  assert.ok(result.passes.length + result.violations.length + result.incomplete.length > 0, 'Accessibility scan returned no evaluated rules');
  return result;
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

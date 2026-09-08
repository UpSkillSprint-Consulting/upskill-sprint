'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { verifyCoverage, atomicJson } = require('./lib/student-audit-runtime.cjs');
const { PROFILES, TOOL_VERSIONS } = require('./lib/student-audit-contract.cjs');
const noErrors = report => {
  assert.equal(report.complete, true, 'Incomplete student run');
  assert.notEqual(report.diagnosticOnly, true, 'Diagnostic subset is not full acceptance');
  assert.deepEqual(report.failures, [], 'Student audit failed');
  assert.deepEqual(report.pageErrors, [], 'Unhandled page error');
};
function validateSupervisor(supervisor, source, totalMs = 35 * 60000) {
  assert.equal(supervisor.source, source, 'Stale supervisor evidence');
  assert.equal(supervisor.status, 'passed', 'Audit supervisor did not finish successfully');
  assert.equal(supervisor.exitCode, 0);
  assert.equal(supervisor.signal, null);
  assert.ok(supervisor.progressMessages > 0, 'No audit progress recorded');
  assert.ok(supervisor.idleLimitMs > 0 && supervisor.idleLimitMs <= 90000, 'No-progress limit was weakened');
  assert.ok(supervisor.totalLimitMs > 0 && supervisor.totalLimitMs <= totalMs, 'Total runtime limit was weakened');
}
function validateGeometry(check) {
  assert.equal(check.geometry?.pageOverflow, false, 'Horizontal page overflow');
  assert.deepEqual(check.geometry.clipped, [], 'Clipped copy');
  assert.deepEqual(check.geometry.svgOutside, [], 'SVG labels escape figure');
  assert.deepEqual(check.violations, [], 'Accessibility violations');
}
function validateFullReport(report, profile, source, bank) {
  noErrors(report);
  assert.equal(report.source, source, 'Stale student result');
  for (const k of ['engine','layout','width','mixed']) assert.equal(report[k], profile[k], `Wrong profile ${k}`);
  assert.equal(report.profile, profile.label, 'Mismatched profile artifact');
  assert.equal(report.accessibilityRequired, true, 'Accessibility cannot be disabled');
  for (const [name, version] of Object.entries(TOOL_VERSIONS)) assert.equal(report.toolVersions?.[name], version, `${name} version drift`);
  assert.equal(report.accessibilitySelfTest?.passed, true, 'Missing axe equivalence test');
  for (const id of ['image-alt', 'button-name']) assert.ok(report.accessibilitySelfTest.violationsDetected.includes(id));
  verifyCoverage(report, bank);
  assert.deepEqual(report.sessionOrder?.slice().sort(), bank.map(q=>q.qid).sort(), 'Incomplete actual session order');
  assert.deepEqual(report.qualityFailures, []);
  const correct = profile.mixed ? 59 : 175;
  assert.equal(report.expectedCorrect, correct);
  assert.match(report.verdict, new RegExp(`\\b${correct} of 175 correctly\\b`));
  report.questions.forEach((q, i) => {
    const expected = profile.mixed ? (i % 3 === 2 ? null : i % 3 === 0 ? bank[i].answer : (bank[i].answer+1)%4) : bank[i].answer;
    assert.equal(q.selected, expected); assert.equal(q.reopened, true);
    const status = expected === null ? 'unanswered' : expected === bank[i].answer ? 'correct' : 'incorrect';
    assert.equal(report.reviews[i].status, status);
    for (const row of [q,report.reviews[i]]) for (const check of row.checks) {
      validateGeometry(check);
      assert.ok(Number.isInteger(check.a11y.passedRules) && check.a11y.passedRules > 0, 'Empty axe evaluation');
      assert.equal(check.a11y.engine?.name, 'axe-core');
      assert.equal(check.a11y.engine?.version, TOOL_VERSIONS.axe);
      assert.ok(Array.isArray(check.a11y.incompleteRules), 'Incomplete-rule diagnostics were lost');
    }
  });
}
function validateEdgeReport(report, engine, source) {
  noErrors(report);
  assert.equal(report.source, source);
  assert.equal(report.engine, engine);
  assert.equal(report.width, 320);
  assert.equal(report.calculatorAndLookup, true);
  assert.deepEqual(report.timeout, {all:175,unvisitedSkipped:174,flagged:1,score:1});
  assert.equal(report.failedSaveAndRetake, true);
  assert.deepEqual(report.correctionQuiz, {corrected:174,originalScoreStill:1});
  assert.equal(report.relatedPractice, 5);
  assert.equal(report.rapidReview, 175);
  assert.deepEqual(report.reviews.map(r=>r.theme), ['light','dark']);
  report.reviews.forEach(validateGeometry);
}
function validateNeeds(needs) {
  assert.deepEqual(Object.keys(needs).sort(), ['browsers','edge-cases','regression']);
  for (const [name,result] of Object.entries(needs)) assert.equal(result.result, 'success', `${name} failed, cancelled, skipped or incomplete`);
}
function verifyEvidenceDirectory(dir, source, bank, needs) {
  validateNeeds(needs);
  const manifest = [];
  const read = rel => {
    const bytes = fs.readFileSync(path.join(dir, rel));
    manifest.push({path:rel,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
    return JSON.parse(bytes);
  };
  const completed = [];
  for (const profile of PROFILES) {
    const base = `final-student-summary-${profile.label}`;
    const report = read(`${base}/report.json`);
    validateFullReport(report, profile, source, bank);
    validateSupervisor(read(`${base}/supervisor.json`), source);
    const tested = fs.readFileSync(path.join(dir, base, 'tested-commit.txt'), 'utf8').trim();
    assert.equal(tested, source, 'Artifact checkout differs from report source');
    completed.push({profile:profile.label,questions:175,reviews:175,accessibilityScans:700});
  }
  for (const engine of ['chromium','webkit']) {
    const base = `final-student-edges-${engine}`;
    validateEdgeReport(read(`${base}/report.json`), engine, source);
    validateSupervisor(read(`${base}/supervisor.json`), source, 15 * 60000);
  }
  assert.equal(fs.readFileSync(path.join(dir,'final-student-regression/tested-commit.txt'),'utf8').trim(),source);
  return {schemaVersion:1,status:'passed',source,profiles:completed,edgeProfiles:2,manifest};
}
function main() {
  const dir = process.argv[2];
  if (!dir || process.argv.length !== 3) throw Error('Usage: node scripts/check-student-audit.cjs <evidence-directory>');
  const source = execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  assert.equal(source, process.env.AUDIT_SOURCE, 'Gate checkout mismatch');
  const ctx = {window:{}};
  vm.runInNewContext(fs.readFileSync('test-bank-mbb-set3.js','utf8'),ctx);
  const bank = JSON.parse(JSON.stringify(ctx.window.MBB_SET3));
  let gate = {schemaVersion:1,status:'failed',source};
  try {
    gate = verifyEvidenceDirectory(dir,source,bank,JSON.parse(process.env.STUDENT_AUDIT_NEEDS));
  } catch(error) {
    gate.error = String(error); process.exitCode = 1;
  }
  atomicJson('final-student-gate/gate.json',gate);
  console.log(JSON.stringify(gate,null,2));
}
module.exports={validateFullReport,validateEdgeReport,validateSupervisor,validateNeeds,verifyEvidenceDirectory};
if (require.main===module) main();

'use strict';

const assert = require('node:assert/strict');
const { before, after, test } = require('node:test');
const { readFileSync } = require('node:fs');
const { createHmac } = require('node:crypto');
const path = require('node:path');
const SECRET = 'learning-test-only-secret-with-more-than-thirty-two-bytes';
const originalNetlify = globalThis.Netlify;
let learning, config, shared, core, certificates, keys, coreKeys;

before(async () => {
  globalThis.Netlify = { env: { get: name => name === 'EXCEL_SPRINT_SIGNING_SECRET' ? SECRET : undefined } };
  keys = JSON.parse(readFileSync(path.join(__dirname, '../netlify/functions/_shared/excel-sprint-learning-answers.json'), 'utf8'));
  coreKeys = JSON.parse(readFileSync(path.join(__dirname, '../netlify/functions/_shared/excel-sprint-answers.json'), 'utf8'));
  const modules = await Promise.all([
    import('../netlify/functions/excel-sprint-learning.mjs'),
    import('../netlify/functions/_shared/excel-sprint-learning.mjs'),
    import('../netlify/functions/_shared/excel-sprint-grading.mjs'),
    import('../netlify/functions/_shared/excel-sprint-certificates.mjs')
  ]);
  learning = modules[0].default; config = modules[0].config;
  [shared, core, certificates] = modules.slice(1);
});
after(() => { globalThis.Netlify = originalNetlify; });

function request(payload, options = {}) {
  return new Request('https://sprint.example/api/excel-sprint/learning', {
    method: 'POST', headers: { 'content-type': 'application/json', ...options.headers },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload)
  });
}
async function call(payload, options) {
  const response = await learning(request(payload, options));
  return { response, body: await response.json() };
}
function choices(kind = 'correct') {
  return keys.diagnostic.questions.map(question => ({ questionId: question.id,
    optionId: kind === 'skip' ? null : kind === 'wrong' ? ['a', 'b', 'c', 'd'].find(option => option !== question.correctOption) : question.correctOption }));
}
function submission(drillId = 'R1-A1', correct = true) {
  return { action: 'grade', drillId, formula: keys.drills[drillId].task.model,
    result: correct ? keys.drills[drillId].task.answer : '__deliberately_incorrect_practice_result__' };
}
function alterToken(token, updates) {
  const [encoded, mac] = token.split('.');
  const proof = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  return `${Buffer.from(JSON.stringify({ ...proof, ...updates })).toString('base64url')}.${mac}`;
}
function proofOf(token) { return JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf8')); }
const fails = (status = 403) => error => error?.status === status;

test('learning endpoint uses the isolated path, modern responses and rate limit', async () => {
  assert.equal(config.path, '/api/excel-sprint/learning');
  assert.equal(config.method, 'POST');
  assert.deepEqual(config.rateLimit, { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] });
  const result = await call({ action: 'diagnostic', answers: choices('skip') });
  assert.equal(result.response.status, 200);
  assert.equal(result.response.headers.get('cache-control'), 'no-store, max-age=0');
  assert.equal(result.response.headers.get('x-content-type-options'), 'nosniff');
});

test('diagnostic preserves ten skill results, including skipped questions, in canonical order', async () => {
  const selected = choices('skip');
  selected[0] = choices()[0]; selected[1] = choices('wrong')[1];
  const result = await call({ action: 'diagnostic', answers: selected.reverse() });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.type, 'diagnostic');
  assert.equal(result.body.completed, true);
  assert.equal(result.body.score, 10);
  assert.deepEqual(result.body.skills, Array.from({ length: 10 }, (_, index) => ({
    skillId: `level-${index + 1}`, level: index + 1,
    status: index === 0 ? 'correct' : index === 1 ? 'incorrect' : 'skipped'
  })));
  const verified = await call({ action: 'verify', token: result.body.receipt });
  assert.equal(verified.response.status, 200);
  assert.equal(verified.body.verified, true);
  assert.deepEqual(verified.body.report, result.body);
  assert.equal(/"(?:correctOption|explanation|model|alternatives|answer)"\s*:/.test(JSON.stringify(result.body)), false);
  assert.equal((await call({ action: 'diagnostic', answers: choices() })).body.score, 100);
  assert.equal((await call({ action: 'diagnostic', answers: choices('skip') })).body.score, 0);
});

test('diagnostic rejects partial, duplicate, foreign or malformed question choices', async () => {
  const valid = choices();
  const mutations = [
    valid.slice(1), [...valid, valid[0]], valid.map((entry, i) => i === 1 ? valid[0] : entry),
    valid.map((entry, i) => i === 0 ? { ...entry, questionId: 'q11' } : entry),
    valid.map((entry, i) => i === 0 ? { questionId: entry.questionId } : entry),
    valid.map((entry, i) => i === 0 ? { ...entry, optionId: 'e' } : entry),
    valid.map((entry, i) => i === 0 ? { ...entry, optionId: 0 } : entry),
    valid.map((entry, i) => i === 0 ? { ...entry, score: 100 } : entry),
    valid.map((entry, i) => i === 0 ? null : entry)
  ];
  for (const answers of mutations) assert.equal((await call({ action: 'diagnostic', answers })).response.status, 400);
});

test('batch verification keeps valid reports when another proof is tampered', async () => {
  const diagnostic = (await call({ action: 'diagnostic', answers: choices('skip') })).body;
  const first = (await call(submission('R1-A1'))).body;
  const second = (await call(submission('R1-A2', false))).body;
  const altered = alterToken(first.receipt, { attempts: 99 });
  const tokens = [diagnostic.receipt, altered, first.receipt, second.receipt];
  const result = await call({ action: 'verify-many', tokens });
  assert.equal(result.response.status, 200);
  assert.deepEqual(result.body.results, [
    { token: diagnostic.receipt, verified: true, report: diagnostic },
    { token: altered, verified: false },
    { token: first.receipt, verified: true, report: first },
    { token: second.receipt, verified: true, report: second }
  ]);
  assert.equal(/"(?:correctOption|explanation|model|alternatives|answer|error)"\s*:/.test(JSON.stringify(result.body)), false);
  const maximum = [];
  for (let i = 0; i < 31; i++) maximum.push((await call(submission())).body.receipt);
  const complete = await call({ action: 'verify-many', tokens: maximum });
  assert.equal(complete.response.status, 200);
  assert.equal(complete.body.results.length, 31);
  assert.equal(complete.body.results.every(entry => entry.verified), true);
});

test('batch verification rejects duplicates, malformed lists, unused fields and oversized requests', async () => {
  const token = (await call(submission())).body.receipt;
  for (const tokens of [undefined, null, {}, [], [token, token], [null], [''], ['x'.repeat(6001)], Array.from({ length: 32 }, (_, i) => `invalid-${i}`)]) {
    assert.equal((await call({ action: 'verify-many', ...(tokens === undefined ? {} : { tokens }) })).response.status, 400);
  }
  assert.equal((await call({ action: 'verify-many', tokens: [token], token })).response.status, 400);
  const tooLarge = Array.from({ length: 31 }, (_, i) => `${i}-${'x'.repeat(5997)}`);
  assert.equal((await call({ action: 'verify-many', tokens: tooLarge })).response.status, 413);
});

test('all twenty independent drills grade matching submitted outputs without granting core progress', async () => {
  assert.equal(shared.DRILL_IDS.length, 20);
  for (const drillId of shared.DRILL_IDS) {
    const graded = await call(submission(drillId));
    assert.equal(graded.response.status, 200, drillId);
    assert.equal(graded.body.drillId, drillId);
    assert.equal(graded.body.skillId, keys.drills[drillId].skillId);
    assert.equal(graded.body.correct, true);
    assert.equal(graded.body.submissionCorrect, true);
    assert.equal(graded.body.attempts, 1);
    assert.equal(graded.body.firstAttemptCorrect, true);
    assert.ok(Number.isFinite(Date.parse(graded.body.completedAt)));
    assert.equal(graded.body.completionToken, undefined);
    assert.equal(/"(?:answer|model|alternatives)"\s*:/.test(JSON.stringify(graded.body)), false);
    const verified = await call({ action: 'verify', token: graded.body.receipt });
    assert.deepEqual(verified.body.report, graded.body);
  }
});

test('drill retries retain signed first attempts, advance hints and freeze completed metrics', async () => {
  const drillId = 'R1-A1';
  const first = await call(submission(drillId, false));
  assert.equal(first.body.correct, false);
  assert.equal(first.body.firstAttemptCorrect, false);
  assert.equal(first.body.attempts, 1);
  assert.equal(first.body.completedAt, undefined);
  assert.equal(first.body.hint, keys.drills[drillId].task.hints[0]);
  const second = await call({ ...submission(drillId, false), receipt: first.body.receipt });
  const third = await call({ ...submission(drillId, false), receipt: second.body.receipt });
  assert.equal(second.body.hint, keys.drills[drillId].task.hints[1]);
  assert.equal(third.body.hint, keys.drills[drillId].task.hints[2]);
  const corrected = await call({ ...submission(drillId), receipt: third.body.receipt });
  assert.equal(corrected.body.correct, true);
  assert.equal(corrected.body.attempts, 4);
  assert.equal(corrected.body.firstAttemptCorrect, false);
  const later = await call({ ...submission(drillId, false), receipt: corrected.body.receipt });
  assert.equal(later.body.correct, true);
  assert.equal(later.body.submissionCorrect, false);
  assert.equal(later.body.attempts, 4);
  assert.equal(later.body.firstAttemptCorrect, false);
  assert.equal(later.body.completedAt, corrected.body.completedAt);
  assert.equal(later.body.runId, corrected.body.runId);
  assert.deepEqual((await call({ action: 'verify', token: later.body.receipt })).body.report, later.body);
  assert.deepEqual((await call({ action: 'verify', token: corrected.body.receipt })).body.report, corrected.body);
  const fresh = await call(submission(drillId));
  assert.equal(fresh.body.attempts, 1);
  assert.equal(fresh.body.firstAttemptCorrect, true);
  assert.notEqual(proofOf(fresh.body.receipt).runId, proofOf(corrected.body.receipt).runId);
  assert.notEqual(fresh.body.runId, corrected.body.runId);
});

test('solutions require a completed proof for the same drill and never leak answers', async () => {
  const first = await call(submission('R1-A1', false));
  assert.equal((await call({ action: 'solutions', drillId: 'R1-A1', token: first.body.receipt })).response.status, 403);
  const completed = await call(submission('R1-A1'));
  assert.equal((await call({ action: 'solutions', drillId: 'R1-A2', token: completed.body.receipt })).response.status, 403);
  const allowed = await call({ action: 'solutions', drillId: 'R1-A1', token: completed.body.receipt });
  assert.deepEqual(allowed.body, { drillId: 'R1-A1', skillId: 'level-1', model: keys.drills['R1-A1'].task.model,
    alternatives: keys.drills['R1-A1'].task.alternatives });
  assert.equal(allowed.body.answer, undefined);
  const diagnostic = await call({ action: 'diagnostic', answers: choices() });
  assert.equal((await call({ action: 'solutions', drillId: 'R1-A1', token: diagnostic.body.receipt })).response.status, 403);
});

test('drill inputs reject malformed formulas, results, unknown drills and unrelated fields', async () => {
  for (const formula of ['', 'SUM(A1:A5)', '=SUM(', '=', '=1+', '=1\u0000', `=${'1'.repeat(4096)}`]) {
    assert.equal((await call({ ...submission(), formula })).response.status, 400);
  }
  for (const result of [null, {}, [], [[[1]]], 'x'.repeat(16001), Array(1001).fill(1)]) {
    assert.equal((await call({ ...submission(), result })).response.status, 400);
  }
  for (const drillId of ['L1-A1', 'EX-A1', 'R11-A1', '__proto__', null]) assert.equal((await call({ ...submission(), drillId })).response.status, 400);
  for (const payload of [
    { ...submission(), score: 100 }, { ...submission(), token: 'unused' },
    { action: 'diagnostic', answers: choices(), drillId: 'R1-A1' },
    { action: 'verify', token: 'token', answers: [] },
    { action: 'solutions', drillId: 'R1-A1', token: 'token', formula: '=1' },
    { action: '__proto__' }, { action: 'other' }, { action: 1 }, {}
  ]) assert.equal((await call(payload)).response.status, 400);
});

test('tampered signatures, wrong secret, excessive tokens and cross-drill proofs fail closed', async () => {
  const first = await call(submission());
  const altered = alterToken(first.body.receipt, { attempts: 0, firstAttemptCorrect: false });
  const foreign = shared.signLearningToken(proofOf(first.body.receipt), 'foreign-secret-with-at-least-thirty-two-bytes');
  const [encoded, mac] = first.body.receipt.split('.');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const noncanonicalMac = mac.slice(0, -1) + alphabet[alphabet.indexOf(mac.at(-1)) + 1];
  assert.deepEqual(Buffer.from(noncanonicalMac, 'base64url'), Buffer.from(mac, 'base64url'));
  for (const token of [altered, foreign, 'a'.repeat(6001), first.body.receipt.slice(0, -1) + '!', `${first.body.receipt}\n`, `${encoded}.${noncanonicalMac}`, '', null, {}]) {
    assert.equal((await call({ action: 'verify', token })).response.status, 403);
  }
  assert.equal((await call({ ...submission('R1-A2'), receipt: first.body.receipt })).response.status, 403);
  const diagnostic = await call({ action: 'diagnostic', answers: choices() });
  assert.equal((await call({ ...submission(), receipt: diagnostic.body.receipt })).response.status, 403);
});

test('signed but internally inconsistent proof shapes are rejected', async () => {
  const drill = proofOf((await call(submission())).body.receipt);
  const diagnostic = proofOf((await call({ action: 'diagnostic', answers: choices() })).body.receipt);
  const malformed = [
    { ...drill, schema: 2 }, { ...drill, learningVersion: 2 }, { ...drill, drillVersion: 2 },
    { ...drill, type: 'completion' }, { ...drill, drillId: 'R99-A1' }, { ...drill, runId: 'not-a-run' }, { ...drill, runId: `${drill.runId}\n` },
    { ...drill, attempts: 0 }, { ...drill, attempts: 10001 }, { ...drill, attempts: 1.5 },
    { ...drill, attempts: 2 }, { ...drill, correct: false }, { ...drill, firstAttemptCorrect: false },
    { ...drill, completedAt: null }, { ...drill, completedAt: 'bad-date' }, { ...drill, extra: true },
    { ...diagnostic, score: 99 }, { ...diagnostic, timestamp: 'bad-date' },
    { ...diagnostic, diagnosticId: 'future-diagnostic' }, { ...diagnostic, skills: diagnostic.skills.slice(1) },
    { ...diagnostic, skills: diagnostic.skills.map((skill, i) => i === 1 ? diagnostic.skills[0] : skill) },
    { ...diagnostic, skills: diagnostic.skills.map((skill, i) => i === 0 ? { ...skill, status: 'mastered' } : skill) }
  ];
  for (const proof of malformed) assert.equal((await call({ action: 'verify', token: shared.signLearningToken(proof, SECRET) })).response.status, 403);
  const missed = proofOf((await call(submission('R1-A1', false))).body.receipt);
  missed.attempts = 10000;
  assert.equal((await call({ ...submission(), receipt: shared.signLearningToken(missed, SECRET) })).response.status, 400);
});

test('learning, core and certificate signatures stay in separate domains', async () => {
  const learned = await call(submission());
  const key = coreKeys['L1-A1'];
  const completion = core.gradeSubmission({ packageId: 'L1-A1', submissions: key.tasks.map(task => ({ taskId: task.id, formula: task.model, result: task.answer })) }, SECRET);
  for (const token of [completion.receipt, completion.completionToken]) assert.equal((await call({ action: 'verify', token })).response.status, 403);
  const encoded = Buffer.from(JSON.stringify({ type: 'certificate', schema: 1 })).toString('base64url');
  const certificateToken = `${encoded}.${createHmac('sha256', SECRET).update('excel-sprint-certificate-v1.' + encoded).digest('base64url')}`;
  assert.equal((await call({ action: 'verify', token: certificateToken })).response.status, 403);
  assert.throws(() => core.verifyProgress({ tokens: [learned.body.receipt] }, SECRET), fails());
  assert.throws(() => core.gradeSubmission({ packageId: 'L1-A1', receipt: learned.body.receipt,
    submissions: key.tasks.map(task => ({ taskId: task.id, formula: task.model, result: task.answer })) }, SECRET), fails());
  assert.throws(() => certificates.verifyCertificate({ certificateToken: learned.body.receipt }, SECRET), fails());
  assert.throws(() => certificates.issueCertificate({ award: 'levels-1-6', learnerName: 'Fictitious QA Learner', tokens: [learned.body.receipt] }, SECRET), fails());
});

test('request protections reject bad method, origin, content type, JSON and oversized bodies', async () => {
  const get = await learning(new Request('https://sprint.example/api/excel-sprint/learning'));
  assert.equal(get.status, 405);
  assert.equal((await call({ action: 'diagnostic', answers: choices() }, { headers: { origin: 'https://other.example' } })).response.status, 403);
  assert.equal((await call({}, { headers: { 'content-type': 'text/plain' } })).response.status, 415);
  assert.equal((await call('{broken')).response.status, 400);
  assert.equal((await call('null')).response.status, 400);
  assert.equal((await call(' '.repeat(64 * 1024 + 1))).response.status, 413);
  assert.equal((await call({}, { headers: { 'content-length': String(64 * 1024 + 1) } })).response.status, 413);
});

test('unavailable secrets and internal failures return bounded safe errors', async () => {
  const current = globalThis.Netlify;
  try {
    globalThis.Netlify = { env: { get: () => undefined } };
    const unavailable = await call(submission());
    assert.equal(unavailable.response.status, 503);
    assert.deepEqual(Object.keys(unavailable.body), ['error']);
    globalThis.Netlify = { env: { get: () => { throw new Error('private injected exception detail'); } } };
    const failed = await call(submission());
    assert.equal(failed.response.status, 500);
    assert.equal(JSON.stringify(failed.body).includes('private injected exception detail'), false);
    assert.equal(JSON.stringify(failed.body).includes(keys.drills['R1-A1'].task.model), false);
  } finally { globalThis.Netlify = current; }
});

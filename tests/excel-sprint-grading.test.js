'use strict';

const assert = require('node:assert/strict');
const { before, after, test } = require('node:test');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const SECRET = 'test-only-sprint-secret-at-least-32-bytes';
let grade, verify, solutions, shared, gradeConfig, verifyConfig, solutionConfig, keys;
const originalNetlify = globalThis.Netlify;

before(async () => {
  globalThis.Netlify = { env: { get: name => name === 'EXCEL_SPRINT_SIGNING_SECRET' ? SECRET : undefined } };
  keys = JSON.parse(readFileSync(path.join(__dirname, '../netlify/functions/_shared/excel-sprint-answers.json'), 'utf8'));
  const modules = await Promise.all([
    import('../netlify/functions/excel-sprint-grade.mjs'),
    import('../netlify/functions/excel-sprint-verify.mjs'),
    import('../netlify/functions/excel-sprint-solutions.mjs'),
    import('../netlify/functions/_shared/excel-sprint-grading.mjs')
  ]);
  [grade, verify, solutions] = modules.slice(0, 3).map(module => module.default);
  [gradeConfig, verifyConfig, solutionConfig] = modules.slice(0, 3).map(module => module.config);
  shared = modules[3];
});
after(() => { globalThis.Netlify = originalNetlify; });

function request(endpoint, payload, options = {}) {
  return new Request(`https://sprint.example/api/excel-sprint/${endpoint}`, {
    method: 'POST', headers: { 'content-type': 'application/json', ...options.headers },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload)
  });
}
async function call(handler, endpoint, payload, options) {
  const response = await handler(request(endpoint, payload, options));
  return { response, body: await response.json() };
}
function tasks(packageId, ids, correct = true) {
  return keys[packageId].tasks.filter(task => !ids || ids.includes(task.id)).map(task => ({
    taskId: task.id, formula: task.model, result: correct ? task.answer : '__incorrect_training_result__'
  }));
}
async function complete(packageId = 'L1-A1', predecessorToken) {
  const result = await call(grade, 'grade', { packageId, submissions: tasks(packageId), ...(predecessorToken ? { predecessorToken } : {}) });
  assert.equal(result.response.status, 200, JSON.stringify(result.body));
  assert.equal(result.body.completed, true);
  return result.body;
}
function alterToken(token, updates) {
  const [payload, mac] = token.split('.');
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  return `${Buffer.from(JSON.stringify({ ...decoded, ...updates })).toString('base64url')}.${mac}`;
}

test('three modern endpoints have the intended path and platform rate limit', () => {
  for (const [config, endpoint] of [[gradeConfig, 'grade'], [verifyConfig, 'verify'], [solutionConfig, 'solutions']]) {
    assert.equal(config.path, `/api/excel-sprint/${endpoint}`);
    assert.equal(config.method, 'POST');
    assert.deepEqual(config.rateLimit, { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] });
  }
});

test('partial submissions accumulate solved tasks and server-derived first attempts across retries', async () => {
  const key = keys['L1-A1'];
  const [first, second, ...rest] = key.tasks.map(task => task.id);
  const failed = await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1', [first], false) });
  assert.equal(failed.response.status, 200);
  assert.equal(failed.body.tasks[0].attempts, 1);
  assert.equal(failed.body.tasks[0].firstAttemptCorrect, false);
  assert.equal(failed.body.tasks[0].hint, key.tasks[0].hints[0]);
  assert.equal(failed.body.tasks[1].attempts, 0);
  assert.equal(failed.body.completed, false);
  assert.equal(failed.body.completionToken, undefined);

  const twice = await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1', [first], false), receipt: failed.body.receipt });
  assert.equal(twice.body.tasks[0].attempts, 2);
  assert.equal(twice.body.tasks[0].hint, key.tasks[0].hints[1]);
  const thrice = await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1', [first], false), receipt: twice.body.receipt });
  assert.equal(thrice.body.tasks[0].attempts, 3);
  assert.equal(thrice.body.tasks[0].hint, key.tasks[0].hints[2]);

  const corrected = await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1', [first, second]), receipt: thrice.body.receipt });
  assert.equal(corrected.body.tasks[0].attempts, 4);
  assert.equal(corrected.body.tasks[0].correct, true);
  const final = await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1', rest), receipt: corrected.body.receipt });
  assert.equal(final.body.completed, true);
  assert.equal(final.body.score, 100);
  assert.equal(final.body.firstAttemptScore, Math.round((key.tasks.length - 1) / key.tasks.length * 100));
  const checked = await call(verify, 'verify', { tokens: [final.body.completionToken] });
  assert.equal(checked.body.completions[0].attempts[first], 4);
  assert.equal(checked.body.completions[0].firstAttemptScore, final.body.firstAttemptScore);
});

test('a completion never depends on the optional bonus and bonus updates retain its token', async () => {
  const completeFirst = await complete();
  const bonus = keys['L1-A1'].bonus;
  assert.ok(bonus);
  assert.equal(completeFirst.bonus.correct, false);
  const second = await complete('L1-A2', completeFirst.completionToken);
  const updated = await call(grade, 'grade', {
    packageId: 'L1-A1', receipt: completeFirst.receipt,
    submissions: [{ taskId: bonus.id, formula: bonus.model, result: bonus.answer }]
  });
  assert.equal(updated.body.bonus.correct, true);
  assert.equal(updated.body.completionToken, completeFirst.completionToken);
  const checked = await call(verify, 'verify', { tokens: [updated.body.completionToken, second.completionToken] });
  assert.equal(checked.response.status, 200);
  assert.equal(checked.body.nextPackageId, 'L1-A3');
});

test('all fifty packages form a continuous chain including every level boundary', async () => {
  const tokens = [];
  for (const packageId of shared.PACKAGE_IDS) {
    const result = await complete(packageId, tokens.at(-1));
    tokens.push(result.completionToken);
  }
  const result = await call(verify, 'verify', { tokens });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.verified, true);
  assert.equal(result.body.completions.length, 50);
  assert.equal(result.body.nextPackageId, null);
  assert.equal(new Set(result.body.completions.map(record => record.chainId)).size, 1);
});

test('missing predecessors, skipped assignments, and proofs from the wrong package cannot unlock', async () => {
  const first = await complete();
  for (const [packageId, predecessorToken] of [['L1-A2', undefined], ['L1-A3', first.completionToken], ['L2-A1', first.completionToken]]) {
    const result = await call(grade, 'grade', { packageId, submissions: tasks(packageId), ...(predecessorToken ? { predecessorToken } : {}) });
    assert.equal(result.response.status, 403);
  }
  const wrongReceipt = await call(grade, 'grade', { packageId: 'L1-A2', submissions: tasks('L1-A2'), predecessorToken: first.completionToken, receipt: first.receipt });
  assert.equal(wrongReceipt.response.status, 403);
  const receiptAsCompletion = await call(verify, 'verify', { tokens: [first.receipt] });
  assert.equal(receiptAsCompletion.response.status, 403);
});

test('tampered signatures, scores, counters, and cross-secret proofs fail closed', async () => {
  const first = await complete();
  const tampered = [alterToken(first.completionToken, { score: 99 }), alterToken(first.completionToken, { firstAttemptScore: 1000 }), first.completionToken.slice(0, -1) + '!'];
  for (const token of tampered) {
    const result = await call(verify, 'verify', { tokens: [token] });
    assert.equal(result.response.status, 403);
  }
  const fakeCounts = alterToken(first.receipt, { taskStates: {} });
  const result = await call(grade, 'grade', { packageId: 'L1-A1', receipt: fakeCounts, submissions: tasks('L1-A1') });
  assert.equal(result.response.status, 403);
  const proof = shared.readToken(first.completionToken, SECRET, 'completion');
  const foreign = shared.signToken(proof, 'another-secret-with-at-least-thirty-two-bytes');
  assert.equal((await call(verify, 'verify', { tokens: [foreign] })).response.status, 403);
  assert.equal((await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1'), score: 100 })).response.status, 400);
});

test('import rejects reordered, duplicate, incomplete, and mixed-chain completions', async () => {
  const a = await complete(); const b = await complete();
  const a2 = await complete('L1-A2', a.completionToken);
  const b2 = await complete('L1-A2', b.completionToken);
  for (const tokens of [[a2.completionToken], [a2.completionToken, a.completionToken], [a.completionToken, a.completionToken], [a.completionToken, b2.completionToken]]) {
    assert.equal((await call(verify, 'verify', { tokens })).response.status, 403);
  }
  const mixedReceipt = await call(grade, 'grade', {
    packageId: 'L1-A2', predecessorToken: b.completionToken, receipt: a2.receipt, submissions: tasks('L1-A2')
  });
  assert.equal(mixedReceipt.response.status, 403);
  const empty = await call(verify, 'verify', { tokens: [] });
  assert.equal(empty.response.status, 200);
  assert.equal(empty.body.nextPackageId, 'L1-A1');
});

test('solutions require completion of the matching package and are absent from grading responses', async () => {
  const wrong = await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1', null, false) });
  const ordinary = JSON.stringify(wrong.body);
  assert.equal(/"(?:answer|model|alternatives)"\s*:/.test(ordinary), false);
  const premature = await call(solutions, 'solutions', { packageId: 'L1-A1', completionToken: wrong.body.receipt });
  assert.equal(premature.response.status, 403);
  const first = await complete();
  assert.equal((await call(solutions, 'solutions', { packageId: 'L1-A2', completionToken: first.completionToken })).response.status, 403);
  const allowed = await call(solutions, 'solutions', { packageId: 'L1-A1', completionToken: first.completionToken });
  assert.equal(allowed.response.status, 200);
  assert.equal(allowed.body.tasks[0].model, keys['L1-A1'].tasks[0].model);
  assert.deepEqual(allowed.body.tasks[0].alternatives, keys['L1-A1'].tasks[0].alternatives);
});

test('scalar numeric tolerances and array shapes, row order, and duplicates are checked', () => {
  assert.equal(shared.resultsMatch('42.0000004', { answer: 42, tolerance: 1e-6 }), true);
  assert.equal(shared.resultsMatch('42.001', { answer: 42, tolerance: 1e-6 }), false);
  assert.equal(shared.resultsMatch('', { answer: 0 }), false);
  assert.equal(shared.resultsMatch('0x2a', { answer: 42 }), false);
  assert.equal(shared.resultsMatch('Infinity', { answer: 42 }), false);
  assert.equal(shared.resultsMatch('TRUE', { answer: true }), true);
  assert.equal(shared.resultsMatch('1\tPass\n2\tFail', { answer: [[1, 'Pass'], [2, 'Fail']] }), true);
  assert.equal(shared.resultsMatch('2\tFail\n1\tPass', { answer: [[1, 'Pass'], [2, 'Fail']] }), false);
  assert.equal(shared.resultsMatch('2\tFail\n1\tPass', { answer: [[1, 'Pass'], [2, 'Fail']], orderInsensitive: true }), true);
  assert.equal(shared.resultsMatch([[1, 'Pass'], [1, 'Pass']], { answer: [[1, 'Pass'], [2, 'Fail']], orderInsensitive: true }), false);
  assert.equal(shared.resultsMatch([[1, 2]], { answer: [[1], [2]] }), false);
  assert.equal(shared.resultsMatch([1, 2], { answer: [[1], [2]] }), true);
  assert.equal(shared.resultsMatch('[[1],[2]]', { answer: [[1], [2]] }), true);
  assert.equal(shared.resultsMatch('1\n2', { answer: [[1], [2]] }), true);
  assert.equal(shared.resultsMatch([[1, 2], [3]], { answer: [[1, 2], [3, 4]] }), false);
});

test('formula validation accepts alternative approaches but rejects missing or broken expressions', () => {
  for (const formula of ['=SUM(Data!B2:B25)', '=AVERAGE(Table1[Energy_J])', "='Data Sheet'!B2", '=LET(\n x, A1,\n x*2)', '=IF(A1="A""B",1,0)', '=SUM({1,2;3,4})', '=1+2']) assert.equal(shared.validFormula(formula), true, formula);
  for (const formula of ['', ' ', '=', '=   ', 'SUM(A1:A2)', '=SUM(A1:A2', '=SUM(A1:A2])', '=IF(A1="unfinished,1,0)', '=()', '=SUM(A1:A2)+', '=\u0000A1']) assert.equal(shared.validFormula(formula), false, formula);
});

test('grading accepts a valid alternative formula instead of forcing the model pattern', async () => {
  const task = keys['L1-A1'].tasks.find(item => item.alternatives.length);
  assert.ok(task);
  const result = await call(grade, 'grade', {
    packageId: 'L1-A1', submissions: [{ taskId: task.id, formula: task.alternatives[0], result: task.answer }]
  });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.tasks.find(item => item.taskId === task.id).correct, true);
});

test('malformed and abusive requests reject without leaking private keys', async () => {
  const valid = tasks('L1-A1', ['t1']);
  const invalid = [
    null, [], {}, { packageId: '__proto__', submissions: valid }, { packageId: 'L11-A1', submissions: valid },
    { packageId: 'L1-A1', submissions: [] }, { packageId: 'L1-A1', submissions: [valid[0], valid[0]] },
    { packageId: 'L1-A1', submissions: [{ taskId: 'nope', formula: '=1', result: 1 }] },
    { packageId: 'L1-A1', submissions: [{ taskId: 't1', formula: '=1' }] },
    { packageId: 'L1-A1', submissions: [{ taskId: 't1', formula: '1', result: 1 }] },
    { packageId: 'L1-A1', submissions: [{ taskId: 't1', formula: '=1', result: {} }] },
    { packageId: 'L1-A1', submissions: [{ taskId: 't1', formula: '=1', result: null }] },
    { packageId: 'L1-A1', submissions: [{ taskId: 't1', formula: '=1', result: [[[1]]] }] }
  ];
  for (const payload of invalid) {
    const result = await call(grade, 'grade', payload);
    assert.equal(result.response.status, 400, JSON.stringify(payload));
    assert.deepEqual(Object.keys(result.body), ['error']);
    assert.equal(result.response.headers.get('cache-control'), 'no-store, max-age=0');
    assert.equal(result.response.headers.get('x-content-type-options'), 'nosniff');
  }
  assert.equal((await call(grade, 'grade', '{oops')).response.status, 400);
  assert.equal((await call(grade, 'grade', '{}', { headers: { 'content-type': 'text/plain' } })).response.status, 415);
  assert.equal((await call(grade, 'grade', { packageId: 'L1-A1', submissions: valid }, { headers: { origin: 'https://attacker.example' } })).response.status, 403);
  assert.equal((await call(grade, 'grade', 'x'.repeat(65537))).response.status, 413);
  assert.equal((await grade(new Request('https://sprint.example/api/excel-sprint/grade'))).status, 405);
});

test('missing deployment secret fails closed without a process.env fallback', async () => {
  const previous = globalThis.Netlify; const environment = process.env.EXCEL_SPRINT_SIGNING_SECRET;
  try {
    process.env.EXCEL_SPRINT_SIGNING_SECRET = SECRET;
    globalThis.Netlify = { env: { get: () => undefined } };
    const response = await call(grade, 'grade', { packageId: 'L1-A1', submissions: tasks('L1-A1') });
    assert.equal(response.response.status, 503);
    assert.equal(response.body.completionToken, undefined);
    assert.equal(response.body.error.includes('secret'), false);
  } finally {
    globalThis.Netlify = previous;
    if (environment === undefined) delete process.env.EXCEL_SPRINT_SIGNING_SECRET;
    else process.env.EXCEL_SPRINT_SIGNING_SECRET = environment;
  }
});

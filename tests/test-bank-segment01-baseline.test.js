'use strict';

// Segment 01: read-only baseline. OBSERVATION rows are NOT product acceptance passes.
// Only preservation checks assert correct behavior. A later fix must add a desired-
// behavior regression, not preserve the defective observations printed here.
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { JSDOM, VirtualConsole } = require('jsdom');
const { makeSandbox } = require('./helpers/segment01-sandbox.cjs');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');
const ROOT = path.join(__dirname, '..');
const BANKS = ['test-bank-cmq-set1.js', 'test-bank-mbb-set1.js', 'test-bank-mbb-set2.js', 'test-bank-mbb-set3.js', 'test-bank-cssgb-set1.js', 'test-bank-cssgb-set2.js'];
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
const emit = (name, value) => console.log('SEG01_' + name + ' ' + JSON.stringify(value));
const observe = (id, observed, desired) => emit('OBSERVATION', { id, observed, desired, desiredSatisfied: JSON.stringify(observed) === JSON.stringify(desired), fixedByThisPR: false });

async function load(storage = {}) {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  let html = BANKS.reduce((page, file) => page.replace('<script src="/' + file + '"></script>', '<script>' + read(file) + '</script>'), read('test-bank.html'));
  // Test-only seam into the original closure. No application file is modified.
  const anchor = /window\.__TB=\{[^\n]*\};/g;
  assert.equal(Array.from(html.matchAll(anchor)).length, 1, 'Revalidate audit seam if core exports change');
  html = html.replace(anchor, '$&\nwindow.__TBSegment01Probe={beginSession:beginSession,tickTimer:tickTimer,submitQuiz:submitQuiz,getSession:function(){return session;},getView:function(){return view;},fullExamCountFor:function(id,set){var oldCurrent=current,oldSet=selectedSet;current=id;selectedSet=set;try{return fullExamCount(EXAMS[id]);}finally{current=oldCurrent;selectedSet=oldSet;}}};');
  const dom = new JSDOM(html, {
    url: 'https://segment01.invalid/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: console,
    beforeParse(window) { for (const [key, value] of Object.entries(storage)) window.localStorage.setItem(key, value); }
  });
  let timeout;
  try {
    await Promise.race([
      new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true })),
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Isolated baseline DOM failed to load')), 15000); })
    ]);
    dom.window.eval(read('test-bank-question-registry.js'));
    return { dom, window: dom.window, errors };
  } catch (error) { dom.window.close(); throw error; }
  finally { clearTimeout(timeout); }
}

function models() {
  const s = makeSandbox();
  ['test-bank-question-registry.js', 'test-bank-adaptive-mastery.js', 'test-bank-adaptive-mastery-hardening.js', 'test-bank-analytics-dashboard.js', 'test-bank-account-sync.js'].forEach(s.load);
  return s;
}

test('preservation: all published question IDs are explicit, namespaced, globally unique and mapped', { timeout: 30000 }, async () => {
  const { dom, window, errors } = await load();
  try {
    assert.deepEqual(errors, []);
    const inventory = {}, ids = new Set();
    for (const [examId, exam] of Object.entries(window.__TB.EXAMS)) {
      const questions = Array.from(Object.values(exam.sets || {}).flat());
      if (!questions.length) continue;
      const validation = window.__TBQuestionRegistry.validate(examId);
      const subs = new Set(Array.from(exam.bok).flatMap(domain => Array.from(domain.subs).map(sub => sub.id)));
      const unmapped = questions.filter(q => !subs.has(q.sub)).length;
      inventory[examId] = { total: questions.length, sets: Object.fromEntries(Object.entries(exam.sets).map(([id, rows]) => [id, rows.length])), explicitIds: validation.explicitIds, warnings: Array.from(validation.warnings), unmapped, examLength: exam.questions, minutes: exam.minutes, practiceTarget: exam.pass };
      assert.equal(validation.explicitIds, questions.length);
      assert.deepEqual(Array.from(validation.warnings), []);
      assert.equal(unmapped, 0);
      for (const question of questions) {
        assert.equal(typeof question.qid, 'string');
        assert.ok(question.qid.startsWith(examId + ':'));
        assert.ok(!ids.has(question.qid), 'Global collision: ' + question.qid);
        ids.add(question.qid);
      }
    }
    assert.ok(ids.size > 0);
    emit('INVENTORY', inventory);
    emit('DOMAIN_ORDER', Array.from(window.__TB.EXAMS.cssbb.bok).flatMap(d => Array.from(d.subs).map(s => s.name)));
  } finally { dom.window.close(); }
});

test('preservation: mastery discounts one correct answer and readiness uses domain weights', () => {
  const s = models(), mastery = s.context.__TBAdaptiveHardening;
  const observed = [1, 2, 3, 4, 5].map(n => mastery.effectiveMastery({ attempts: n, correct: n, streak: n, lastSeenAt: s.now() }, s.now()));
  assert.deepEqual(observed, [57, 68, 80, 92, 100]);
  const q = s.questions[0];
  s.setExamData({ questions: { [q.qid]: { attempts: 1, correct: 1, streak: 1, lastSeenAt: s.now(), dueAt: s.now() + 86400000 } } });
  const summary = mastery.summary(s.now());
  assert.equal(summary.coverage, 80);
  assert.equal(summary.readiness, 46);
  assert.equal(summary.mastered, 0);
  emit('MASTERY', { oneThroughFiveCorrect: observed, oneOfTwoQuestionsAnswered: plain(summary), rawCoverage: 50 });
});

test('preservation: blanks remain in exam grading but not answered mastery; completion projection retries are idempotent', () => {
  const s = models(), api = s.context.__TBAdaptiveMastery;
  const records = [{ question: s.questions[0], selected: 0, status: 'correct' }, { question: s.questions[1], selected: null, status: 'unanswered' }];
  const metadata = { mode: 'exam', timed: true, completed: true, total: 2, sessionId: 'fixture-session-0001', at: s.now() };
  const first = api.recordResults(records, metadata);
  api.recordResults(records, metadata);
  const data = api.store().exams.cssbb;
  assert.equal(first.total, 2);
  assert.equal(first.correct, 1);
  assert.equal(first.answered, 1);
  assert.equal(Object.keys(data.questions).length, 1);
  assert.equal(data.attempts.length, 1);
  emit('BLANK_AND_RETRY', { correct: first.correct, denominator: first.total, answered: first.answered, sessionsAfterRetry: data.attempts.length });
});

test('observation G01: stored prior-attempt labels are not a canonical first/repeat count', () => {
  const s = models(), q = s.questions[0];
  // Two separate device-local first records for the same canonical question.
  s.setExamData({ questions: { [q.qid]: { attempts: 2, correct: 2, masteryHistory: [
    { id: 'fixture-a', attemptId: 'session-a', priorAttempts: 0, status: 'correct', at: s.now() - 1000 },
    { id: 'fixture-b', attemptId: 'session-b', priorAttempts: 0, status: 'correct', at: s.now() }
  ] } } });
  const gain = s.context.__TBAdaptiveMastery.improvement();
  observe('G01', { unique: 1, first: gain.firstTotal, repeat: gain.repeatTotal }, { unique: 1, first: 1, repeat: 1 });
});

test('observation G02: learning improvement includes retired question states and omits compacted evidence', () => {
  const s = models();
  s.setExamData({ questions: {
    [s.questions[0].qid]: { attempts: 2, correct: 2, streak: 2, lastSeenAt: s.now(), masteryBaseline: { attempts: 1 }, masteryHistory: [{ priorAttempts: 1, status: 'correct' }] },
    'cssbb:retired:q3': { attempts: 1, masteryHistory: [{ priorAttempts: 0, status: 'correct' }] }
  } });
  const summary = s.context.__TBAdaptiveHardening.summary(s.now()), gain = s.context.__TBAdaptiveMastery.improvement();
  emit('OBSERVATION', { id: 'G02', currentBankAnswers: summary.answers, improvement: plain(gain), issue: 'Improvement has no current-bank filter or baseline/unknown evidence accounting', fixedByThisPR: false });
});

test('observation G03: analytics conceals divergent projections using the maximum', () => {
  const s = models();
  s.context.__TBLearning = { summary: () => ({ answeredEvents: 9, uniqueSeen: 1 }) };
  const result = s.context.__TBAnalyticsDashboard.learningSummary({ answers: 2, attempted: 1, total: 2 });
  emit('OBSERVATION', { id: 'G03', derivedAnswers: 2, ledgerAnswers: 9, displayedAnswers: result.answeredEvents, reportsDisagreement: Object.prototype.hasOwnProperty.call(result, 'disagreement'), fixedByThisPR: false });
});

test('observation G04: heatmap dates shift from the learner local date', () => {
  const original = process.env.TZ;
  try {
    process.env.TZ = 'America/Regina';
    const s = models();
    s.setClock(Date.parse('2026-09-08T18:00:00Z'));
    s.setExamData({ attempts: [{ at: Date.parse('2026-09-08T05:30:00Z'), answered: 1, total: 1 }] });
    const active = s.context.__TBAnalyticsDashboard.studyHeatmap(1).filter(d => d.count > 0).map(d => d.key);
    observe('G04', plain(active), ['2026-09-07']);
  } finally { if (original === undefined) delete process.env.TZ; else process.env.TZ = original; }
});

test('observation G05: rounded chart margin and current configuration reinterpret historical exams', () => {
  const s = models(), api = s.context.__TBAnalyticsDashboard;
  s.setExamData({ attempts: [{ id: 'exam-fixture', mode: 'exam', timed: true, completed: true, total: 165, correct: 115, at: s.now() }] });
  const first = plain(api.examAttemptSeries());
  s.exam.pass = 80;
  const changedTarget = plain(api.examAttemptSeries());
  s.exam.questions = 160;
  const changedLength = plain(api.examAttemptSeries());
  emit('OBSERVATION', { id: 'G05', exactPct: 115 / 165 * 100, original: first, afterTargetChange: changedTarget, afterLengthChange: changedLength, fixedByThisPR: false });
});

test('observation G06: duplicate completion IDs inflate domain denominators despite last-value comment', () => {
  const s = models(), q = s.questions[0], sessionId = 'duplicate-fixture';
  s.exam.questions = 2;
  s.setExamData({ attempts: [{ id: sessionId, mode: 'exam', timed: true, completed: true, total: 2, correct: 0, at: s.now() }] });
  s.context.__TBLearning = { eventsForExam: () => [{ type: 'session_completed', sessionId, occurredAt: s.now(), payload: {
    mode: 'exam', timed: true, total: 2, answers: [
      { questionId: q.qid, sub: q.sub, status: 'correct' },
      { questionId: q.qid, sub: q.sub, status: 'incorrect' }
    ]
  } }] };
  const result = plain(s.context.__TBAnalyticsDashboard.latestExamDomainBreakdown());
  observe('G06', result.map(r => ({ total: r.total, correct: r.correct })), [{ total: 1, correct: 0 }]);
});

test('observation G07: account payload excludes active sessions and truncates displayed attempt caches', () => {
  const s = models(), sync = s.context.__TBAccountSync;
  s.localStorage.setItem('tb-adaptive-session-v2', JSON.stringify({ id: 'active-fixture', index: 2 }));
  s.setExamData({ attempts: Array.from({ length: 75 }, (_, n) => ({ id: 'fixture-' + n, at: n + 1, total: 1, correct: 1 })) });
  s.localStorage.setItem('tb-attempt-history-v3', JSON.stringify({ attempts: Array.from({ length: 75 }, (_, n) => ({ id: 'history-' + n, at: n + 1 })) }));
  const payload = sync.localPayload();
  const merged = sync.mergePayloads([payload, plain(payload)]);
  emit('OBSERVATION', { id: 'G07', activeSessionInPayload: Object.prototype.hasOwnProperty.call(payload.values, 'tb-adaptive-session-v2'), before: 75,
    masteryAttemptsAfterMerge: merged.values['tb-adaptive-mastery-v1'].exams.cssbb.attempts.length,
    historyAttemptsAfterMerge: merged.values['tb-attempt-history-v3'].attempts.length,
    distinction: 'Cache truncation is not proof of deleted cloud events', fixedByThisPR: false });
});

test('observation G08: blocked localStorage throws before analytics read fallback', () => {
  const s = models();
  s.localStorage.getItem = () => { throw new Error('Synthetic storage-denied'); };
  let thrown = false;
  try { s.context.__TBAnalyticsDashboard.sessionTrend(); } catch (error) { thrown = /storage-denied/.test(error.message); }
  observe('G08', { thrown }, { thrown: false });
});

test('observation G09: registry warnings silently exclude a conflicting imported object', () => {
  const q = { qid: 'cssbb:fixture:duplicate', stem: 'Fixture one', sub: 'p1', options: ['A'], answer: 0 };
  const s = makeSandbox({ questions: [q, { ...q, stem: 'Fixture two' }] });
  s.load('test-bank-question-registry.js');
  const result = s.context.__TBQuestionRegistry.validate('cssbb');
  emit('OBSERVATION', { id: 'G09', supplied: 2, registered: result.total, warnings: plain(result.warnings), fixedByThisPR: false });
});

test('preservation: core deadline catches up after suspension and completion is not duplicated', { timeout: 30000 }, async () => {
  const { dom, window } = await load();
  try {
    await installDurableLearning(window);
    let clock = Date.UTC(2026, 8, 7, 18);
    window.Date.now = () => clock;
    const probe = window.__TBSegment01Probe;
    const e = window.__TB.EXAMS.cssbb;
    assert.equal(probe.beginSession(e, [e.sets[1][0], e.sets[1][1]], 'quick', true, 60), true);
    const sessionId = probe.getSession().id;
    const deadline = probe.getSession().endsAt;
    clock += 45000;
    probe.tickTimer();
    assert.equal(probe.getSession().endsAt, deadline);
    assert.equal(window.document.getElementById('tb-timer').textContent, window.__TB.fmtClock(15));
    clock += 16000;
    probe.tickTimer();
    probe.submitQuiz();
    const completed = window.__TBLearning.eventsForExam('cssbb').filter(e => e.type === 'session_completed' && e.sessionId === sessionId);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].payload.completedReason, 'timed-out');
    assert.equal(completed[0].payload.correct, 0);
    assert.equal(completed[0].payload.total, 2);
    emit('DEADLINE', { remainingAfter45Seconds: 15, completionsAfterRepeatedSubmission: completed.length, expiryReason: completed[0].payload.completedReason });
  } finally { dom.window.close(); }
});

test('observation G10: changing device clock shifts remaining time; reload does not restore core session', { timeout: 30000 }, async () => {
  const first = await load();
  let second;
  try {
    const w = first.window;
    await installDurableLearning(w);
    let clock = Date.UTC(2026, 8, 7, 18);
    w.Date.now = () => clock;
    const p = w.__TBSegment01Probe, e = w.__TB.EXAMS.cssbb;
    p.beginSession(e, [e.sets[1][0], e.sets[1][1]], 'quick', true, 60);
    const answer = e.sets[1][0].answer;
    w.document.querySelector('[data-opt="' + answer + '"]').click();
    clock -= 120000;
    p.tickTimer();
    const shifted = (p.getSession().endsAt - clock) / 1000;
    const saved = Object.fromEntries(Array.from({ length: w.localStorage.length }, (_, i) => w.localStorage.key(i)).map(k => [k, w.localStorage.getItem(k)]));
    second = await load(saved);
    await installDurableLearning(second.window);
    const recorded = second.window.__TBLearning.eventsForExam('cssbb').filter(e => e.type === 'answer_recorded').length;
    emit('OBSERVATION', { id: 'G10', remainingAfterClockBack120s: shifted, answerEventsAfterReload: recorded, coreSessionRestored: second.window.__TBSegment01Probe.getSession() !== null, fixedByThisPR: false });
    assert.ok(recorded > 0, 'Durable answer evidence must survive same-account reload');
  } finally { first.dom.window.close(); if (second) second.dom.window.close(); }
});

test('observation G11: published MBB Set 2/3 full attempts are excluded by the generic exam length', { timeout: 30000 }, async () => {
  const { dom, window } = await load();
  try {
    const configured = window.__TBSegment01Probe.fullExamCountFor('mbb', '3');
    assert.equal(configured, 175, 'Preserve the published Set 3 full-session length');
    window.document.querySelectorAll('.tb-tile.active').forEach(tile => tile.classList.remove('active'));
    window.document.querySelector('.tb-tile[data-exam="mbb"]').classList.add('active');
    window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({ version: 1, exams: { mbb: {
      questions: {}, sessions: [], attempts: [{ id: 'mbb-set3-complete', mode: 'exam', timed: true, completed: true, total: configured, correct: 150, at: Date.UTC(2026, 8, 7, 18) }]
    } } }));
    window.eval(read('test-bank-analytics-dashboard.js'));
    const series = window.__TBAnalyticsDashboard.examAttemptSeries();
    observe('G11', { publishedSessionLength: configured, visibleCompletedAttempts: series.length }, { publishedSessionLength: 175, visibleCompletedAttempts: 1 });
  } finally { dom.window.close(); }
});

test('observation G12: result-screen fraction is a latest-domain proportion, not a question count', { timeout: 30000 }, async () => {
  const { dom, window } = await load();
  try {
    await installDurableLearning(window);
    const e = window.__TB.EXAMS.cssbb, p = window.__TBSegment01Probe;
    const items = Array.from(e.sets[1]).filter(q => q.sub === 'p1').slice(0, 2);
    assert.equal(items.length, 2);
    p.beginSession(e, items, 'quick', false, 0);
    window.document.querySelector('[data-opt="' + items[0].answer + '"]').click();
    p.submitQuiz();
    const session = p.getSession();
    const visible = Array.from(window.document.querySelectorAll('.tb-breakdown .tb-subp')).map(node => node.textContent.trim());
    emit('OBSERVATION', { id: 'G12', scoredDomain: plain(session.result.agg.p1), displayInput: plain(session.result.cum.p1), visibleFractions: visible, issue: '0.5/1 displayed beside a 1-of-2 score; retained domains can come from earlier sessions', fixedByThisPR: false });
  } finally { dom.window.close(); }
});

test('observation G13: selected daylight-saving boundary does not reproduce duplicate UTC dates', () => {
  const original = process.env.TZ;
  try {
    process.env.TZ = 'America/New_York';
    const s = models();
    s.setClock(Date.parse('2026-11-03T18:00:00Z'));
    const keys = plain(s.context.__TBAnalyticsDashboard.studyHeatmap(1).map(d => d.key));
    // Calendar expectations are independently enumerated, not calculated with a fixed 24-hour step.
    observe('G13', keys, ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03']);
  } finally { if (original === undefined) delete process.env.TZ; else process.env.TZ = original; }
});

test('source baseline: fingerprints and timing/grade paths are reviewable without bank-content dumps', () => {
  const files = ['test-bank.html', 'test-bank-question-registry.js', 'test-bank-learning-events.js', 'test-bank-account-sync.js', 'test-bank-adaptive-mastery.js', 'test-bank-adaptive-mastery-hardening.js', 'test-bank-analytics-dashboard.js', 'package-lock.json', '.node-version'];
  emit('FINGERPRINTS', files.map(file => ({ file, sha256: crypto.createHash('sha256').update(read(file)).digest('hex'), bytes: Buffer.byteLength(read(file)) })));
  const lines = read('test-bank.html').split('\n');
  const anchors = lines.flatMap((line, index) => /^\s*function (beginSession|tickTimer|submitQuiz|resultsHTML|subAgg|recordAttempt)\(/.test(line) ? [{ line: index + 1, signature: line.slice(0, 120) }] : []);
  assert.equal(anchors.length, 6);
  emit('CORE_PATHS', anchors);
});

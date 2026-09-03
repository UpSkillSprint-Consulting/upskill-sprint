'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const rawHtml = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const bankFiles = [
  'test-bank-cmq-set1.js',
  'test-bank-mbb-set1.js',
  'test-bank-mbb-set2.js',
  'test-bank-mbb-set3.js',
  'test-bank-cssgb-set1.js',
  'test-bank-cssgb-set2.js'
];
const html = bankFiles.reduce((page, file) => page.replace(
  '<script src="/' + file + '"></script>',
  '<script>' + fs.readFileSync(path.join(ROOT, file), 'utf8') + '</script>'
), rawHtml);
const registry = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const mastery = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');
const learning = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');
const setControls = fs.readFileSync(path.join(ROOT, 'test-bank-set-controls.js'), 'utf8');

const windows = [];
afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

function settle(window, frames = 3) {
  return new Promise(resolve => {
    function next(remaining) {
      if (!remaining) return resolve();
      window.requestAnimationFrame(() => next(remaining - 1));
    }
    next(frames);
  });
}

async function loadPage(options) {
  const config = options || {};
  const errors = [];
  const remoteRows = config.remoteRows || [];
  const remoteFetches = config.remoteFetches || [];
  const claimed = config.claimed || new Set();
  const rpcCalls = config.rpcCalls || [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));

  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  windows.push(dom.window);

  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  const learner = { id: 'unseen-toggle-fixture' };
  const client = {
    from() {
      return {
        upsert() { return Promise.resolve({ error: null }); },
        select() {
          const query = {
            eq() { return query; },
            order() { return query; },
            range(from, to) {
              remoteFetches.push({ from, to });
              return Promise.resolve({ data: remoteRows.slice(from, to + 1), error: null });
            },
            limit(limit) {
              remoteFetches.push({ from: 0, to: limit - 1 });
              return Promise.resolve({ data: remoteRows.slice(0, limit), error: null });
            }
          };
          return query;
        }
      };
    },
    rpc(name, args) {
      rpcCalls.push({ name, args });
      if (config.rpcError) return Promise.resolve({ data: [], error: config.rpcError });
      if (typeof config.rpc === 'function') return Promise.resolve(config.rpc(name, args, learner, claimed));
      const accepted = (args && args.p_question_ids || []).filter(questionId => {
        const key = learner.id + ':' + args.p_exam_id + ':' + questionId;
        const alreadySeen = remoteRows.some(row => row.user_id === learner.id && row.exam_id === args.p_exam_id && row.question_id === questionId);
        if (claimed.has(key) || alreadySeen) return false;
        claimed.add(key);
        return true;
      }).map(question_id => ({ question_id }));
      return Promise.resolve({ data: accepted, error: null });
    }
  };
  dom.window.UpskillAuth = { getUser: () => learner, getClient: () => client };
  dom.window.eval(registry);
  compactCssbbFixture(dom.window);
  dom.window.eval(mastery);
  dom.window.eval(learning);
  await dom.window.__TBLearning.sync('test-hydrate');
  dom.window.eval(setControls);
  await settle(dom.window);
  return { window: dom.window, errors, remoteRows, remoteFetches, learner, claimed, rpcCalls };
}

/* The production CSSBB bank contains more than one thousand questions.  These
   tests exercise the set/domain selection rules, not the size of that bank;
   keeping a representative eight-question slice from each set makes each
   ledger write inexpensive while still proving cross-set pooling.  IDs are
   assigned by the registry before this reduction, so the test still follows
   the real canonical-ID path. */
function compactCssbbFixture(window) {
  const exam = window.__TB.EXAMS.cssbb;
  const targetSubs = new Set(exam.bok[0].subs.map(sub => sub.id));
  const representative = questions => {
    const target = questions.filter(question => targetSubs.has(question.sub)).slice(0, 4);
    const other = questions.filter(question => !targetSubs.has(question.sub)).slice(0, 4);
    assert.equal(target.length, 4, 'fixture needs target-domain questions in every set');
    assert.equal(other.length, 4, 'fixture needs non-target-domain questions in every set');
    return target.concat(other);
  };
  exam.sets = {
    1: representative(exam.sets[1]),
    2: representative(exam.sets[2]),
    3: representative(exam.sets[3])
  };
  exam.bank = exam.sets[1];
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function modeCard(window, index) {
  return window.document.querySelectorAll('#tb-overview .tb-mode')[index];
}

function allExamQuestions(exam) {
  if (!exam.sets) return exam.bank || [];
  const seen = new Set();
  const questions = [];
  Object.keys(exam.sets).forEach(setId => {
    (exam.sets[setId] || []).forEach(question => {
      const key = question.qid || question.stem;
      if (seen.has(key)) return;
      seen.add(key);
      questions.push(question);
    });
  });
  return questions;
}

async function verifyNewOnlyModeForExam(examId, kind) {
  const rpcCalls = [];
  let serverRejectedId = '';
  const { window, errors } = await loadPage({
    rpcCalls,
    rpc(name, args) {
      const ids = args && args.p_question_ids || [];
      if (!serverRejectedId && ids.length) serverRejectedId = ids[0];
      return {
        data: ids.filter(questionId => questionId !== serverRejectedId).map(question_id => ({ question_id })),
        error: null
      };
    }
  });
  if (examId !== 'cssbb') {
    click(window, window.document.querySelector('[data-exam="' + examId + '"]'));
    await settle(window, 3);
  }

  const exam = window.__TB.EXAMS[examId];
  assert.ok(exam && exam.bank && exam.bank.length, examId + ' has a live question bank');
  const allQuestions = allExamQuestions(exam);
  const questionById = new Map(allQuestions.map(question => [window.__TBLearning.questionId(examId, question), question]));
  const expectedIds = new Set(questionById.keys());
  const cardIndex = kind === 'quick' ? 1 : 2;
  const card = modeCard(window, cardIndex);
  if (kind === 'focus') {
    const domain = card.querySelector('[data-focusdom]');
    assert.ok(domain && domain.value, examId + ' exposes a focused-practice domain');
  }

  let fullLedgerRefreshes = 0;
  window.__TBLearning.ensureFreshHistory = function () {
    fullLedgerRefreshes += 1;
    return Promise.reject(new Error('New-only Start must not refresh the full ledger'));
  };

  click(window, card.querySelector('[data-unseen="' + kind + '"]'));
  await settle(window, 2);
  click(window, modeCard(window, cardIndex).querySelector('[data-mode="' + kind + '"]'));
  await settle(window, 6);

  assert.equal(fullLedgerRefreshes, 0, examId + ' ' + kind + ' Start does not invoke full-ledger freshness');
  assert.ok(rpcCalls.length > 0, examId + ' ' + kind + ' Start calls the reservation RPC');
  rpcCalls.forEach(call => {
    assert.equal(call.name, 'reserve_test_bank_new_questions');
    assert.equal(call.args.p_exam_id, examId, 'reservation is scoped to the selected certification');
    assert.ok(call.args.p_question_ids.length > 0);
    call.args.p_question_ids.forEach(questionId => {
      assert.ok(expectedIds.has(questionId), questionId + ' belongs to ' + examId);
    });
  });
  assert.ok(window.document.querySelector('#tb-overview .tb-quiz'), examId + ' ' + kind + ' New-only quiz starts');
  assert.ok(window.document.querySelectorAll('#tb-overview .tb-navcell').length > 0, examId + ' serves reserved questions');
  assert.ok(serverRejectedId, examId + ' exercised a server-rejected candidate');
  assert.equal(window.__TBLearning.hasSeen(examId, questionById.get(serverRejectedId)), false, examId + ' never exposes the rejected candidate');
  assert.deepEqual(errors, []);
}

[
  ['cssbb', 'CSSBB'],
  ['mbb', 'MBB'],
  ['cssgb', 'CSSGB'],
  ['cqe', 'CQE'],
  ['cmq', 'CMQ/OE']
].forEach(([examId, label]) => {
  test(label + ' independently reserves and starts Quick and Focused New-only quizzes', async () => {
    await verifyNewOnlyModeForExam(examId, 'quick');
    await verifyNewOnlyModeForExam(examId, 'focus');
  });
});

[
  ['cqa', 'CQA'],
  ['cre', 'CRE']
].forEach(([examId, label]) => {
  test(label + ' remains safely gated until its question bank goes live', async () => {
    const rpcCalls = [];
    const { window, errors } = await loadPage({ rpcCalls });
    click(window, window.document.querySelector('[data-exam="' + examId + '"]'));
    await settle(window, 3);

    assert.equal(Boolean(window.__TB.EXAMS[examId].bank && window.__TB.EXAMS[examId].bank.length), false);
    assert.equal(modeCard(window, 1).querySelector('[data-mode="quick"]'), null, label + ' has no active Quick Start');
    assert.equal(modeCard(window, 2).querySelector('[data-mode="focus"]'), null, label + ' has no active Focused Start');
    assert.equal(rpcCalls.length, 0, label + ' cannot reserve nonexistent questions');
    assert.deepEqual(errors, []);
  });
});

let fixtureSession = 0;
async function markAllAttempted(window, questions) {
  fixtureSession += 1;
  window.__TBLearning.startSession({
    examId: 'cssbb', sessionId: 'unseen-fixture-' + fixtureSession,
    questions: questions, mode: 'practice', timed: false
  });
  /* The core browse shell intentionally repaints after ledger writes; wait for
     that asynchronous repaint before locating its controls again. */
  await new Promise(resolve => window.setTimeout(resolve, 0));
  await settle(window, 2);
}

function stemAt(window, index) {
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-goto="' + index + '"]'));
  return overview.querySelector('.tb-stem').textContent.trim();
}

test('the toggle is off by default on both Quick Quiz and Focused Quiz, independent of each other', async () => {
  const { window, errors } = await loadPage();
  const quickToggle = modeCard(window, 1).querySelector('[data-unseen="quick"]');
  const focusToggle = modeCard(window, 2).querySelector('[data-unseen="focus"]');
  assert.ok(quickToggle && !quickToggle.classList.contains('on'));
  assert.ok(focusToggle && !focusToggle.classList.contains('on'));
  assert.deepEqual(errors, []);
});

test('a signed-in learner can reserve New-only questions before initial history hydration', async () => {
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));

  let reservationCalls = 0;
  dom.window.__TBLearning = {
    status() { return { signedIn: true, hydrated: false, online: true, writeAheadSaved: true }; },
    hasSeen() { return false; },
    reserveNewQuestions(input) {
      reservationCalls += 1;
      return Promise.resolve({ reserved: true, ready: true, acceptedIds: input.questionIds, rejectedIds: [] });
    },
    startSession() { return { sessionId: 'pre-hydration-session', saved: true }; }
  };
  dom.window.document.dispatchEvent(new dom.window.CustomEvent('tb:learning-sync-status'));
  await new Promise(resolve => dom.window.setTimeout(resolve, 0));
  await settle(dom.window, 2);

  let toggle = modeCard(dom.window, 1).querySelector('[data-unseen="quick"]');
  assert.equal(toggle.disabled, false, 'the control does not wait for ledger hydration');
  click(dom.window, toggle);
  await settle(dom.window, 2);

  toggle = modeCard(dom.window, 1).querySelector('[data-unseen="quick"]');
  assert.equal(toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(toggle.disabled, false);
  assert.equal(reservationCalls, 0, 'enabling the filter performs no remote history read or reservation');

  click(dom.window, modeCard(dom.window, 1).querySelector('[data-mode="quick"]'));
  await settle(dom.window, 4);
  assert.equal(reservationCalls, 1, 'Start calls the authoritative reservation RPC immediately');
  assert.ok(dom.window.document.querySelector('#tb-overview .tb-quiz'));
});

test('New questions only locks duplicate Start clicks only while its reservation RPC is pending', async () => {
  const { window } = await loadPage();
  const learningApi = window.__TBLearning;
  const originalReserve = learningApi.reserveNewQuestions;
  let finishReservation;
  let reservationCalls = 0;
  let requestedIds = [];

  learningApi.reserveNewQuestions = function (input) {
    reservationCalls += 1;
    requestedIds = input.questionIds;
    return new Promise(resolve => { finishReservation = resolve; });
  };

  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window, 2);

  let start = modeCard(window, 1).querySelector('[data-mode="quick"]');
  assert.equal(start.disabled, false);
  assert.equal(reservationCalls, 0, 'the toggle does not fetch the ledger');

  click(window, start);
  await settle(window, 2);
  start = modeCard(window, 1).querySelector('[data-mode="quick"]');
  assert.equal(start.disabled, true, 'the explicit reservation is locked against duplicate clicks');
  assert.equal(reservationCalls, 1);

  finishReservation({ reserved: true, ready: true, reason: 'reserved', acceptedIds: requestedIds, rejectedIds: [] });
  await new Promise(resolve => window.setTimeout(resolve, 0));
  await settle(window, 5);

  assert.ok(window.document.querySelector('#tb-overview .tb-quiz'), 'the quiz opens as soon as reservation completes');
  learningApi.reserveNewQuestions = originalReserve;
});

test('changing quiz settings cancels a pending New-only reservation instead of silently starting different settings', async () => {
  const scenarios = [
    { name: 'Quick question count', kind: 'quick', control: '[data-count="quick"][data-n="10"]' },
    { name: 'Quick timing', kind: 'quick', control: '[data-timing-kind="quick"][data-timed="1"]' },
    { name: 'Focused question count', kind: 'focus', control: '[data-count="focus"][data-n="10"]' },
    { name: 'Focused timing', kind: 'focus', control: '[data-timing-kind="focus"][data-timed="1"]' },
    { name: 'Focused domain', kind: 'focus', domain: true }
  ];

  for (const scenario of scenarios) {
    const { window } = await loadPage();
    let finishReservation;
    let requestedIds = [];
    window.__TBLearning.reserveNewQuestions = function (input) {
      requestedIds = input.questionIds;
      return new Promise(resolve => { finishReservation = resolve; });
    };

    const cardIndex = scenario.kind === 'quick' ? 1 : 2;
    click(window, modeCard(window, cardIndex).querySelector('[data-unseen="' + scenario.kind + '"]'));
    await settle(window, 2);
    click(window, modeCard(window, cardIndex).querySelector('[data-mode="' + scenario.kind + '"]'));
    await settle(window, 2);

    if (scenario.domain) {
      const domain = modeCard(window, cardIndex).querySelector('[data-focusdom]');
      domain.value = domain.options[1].value;
      domain.dispatchEvent(new window.Event('change', { bubbles: true }));
    } else {
      click(window, modeCard(window, cardIndex).querySelector(scenario.control));
    }
    await settle(window, 2);

    finishReservation({ reserved: true, ready: true, reason: 'reserved', acceptedIds: requestedIds.slice(0, 1), rejectedIds: requestedIds.slice(1) });
    await new Promise(resolve => window.setTimeout(resolve, 0));
    await settle(window, 5);

    assert.equal(
      window.document.querySelector('#tb-overview .tb-quiz'),
      null,
      scenario.name + ' change requires a new Start click'
    );
  }
});

test('turning on New questions only for Quick Quiz does not affect the Focused Quiz toggle', async () => {
  const { window } = await loadPage();
  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);
  assert.ok(modeCard(window, 1).querySelector('[data-unseen="quick"]').classList.contains('on'));
  assert.ok(!modeCard(window, 2).querySelector('[data-unseen="focus"]').classList.contains('on'));
});

test('turning the toggle on ignores the Set 1/2/3 picker and disables it for that card only', async () => {
  const { window } = await loadPage();
  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);

  const quickSetButtons = modeCard(window, 1).querySelectorAll('[data-quiz-set="quick"]');
  quickSetButtons.forEach(button => assert.equal(button.disabled, true, 'quick set buttons are disabled while its toggle is on'));

  const focusSetButtons = modeCard(window, 2).querySelectorAll('[data-quiz-set="focus"]');
  focusSetButtons.forEach(button => assert.equal(button.disabled, false, 'focused set buttons stay enabled \u2014 its own toggle is off'));

  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /new question/i);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Mixed \(all sets\)/);
});

test('Quick Quiz with the toggle on draws only unattempted questions, pooled across all sets, even though Set 1 is selected', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const set1Stems = new Set(e.sets[1].map(q => q.stem));

  // Exhaust Set 1 entirely. Sets 2 and 3 remain untouched.
  await markAllAttempted(window, e.sets[1]);

  // Leave the Set picker on its default (Set 1) and set a small question count.
  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="10"]'));
  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);

  assert.doesNotMatch(
    modeCard(window, 1).querySelector('.tb-mode-sum').textContent,
    /attempted every question/i,
    'plenty of unseen questions remain in Sets 2 and 3'
  );

  click(window, modeCard(window, 1).querySelector('[data-mode="quick"]'));
  await settle(window);

  const overview = window.document.getElementById('tb-overview');
  const total = overview.querySelectorAll('.tb-navcell').length;
  assert.equal(total, 10, 'served the requested question count');

  for (let i = 0; i < total; i += 1) {
    const stem = stemAt(window, i);
    assert.ok(!set1Stems.has(stem), 'question ' + i + ' was not drawn from the exhausted Set 1, proving the pool was Mixed');
  }
});

test('Focused Quiz with the toggle on filters unattempted questions to the selected Body of Knowledge area', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const domainOf = subId => {
    for (const area of e.bok) if (area.subs.some(s => s.id === subId)) return area.domain;
    return null;
  };
  const allQuestions = e.sets[1].concat(e.sets[2], e.sets[3]);
  const targetDomain = e.bok[0].domain;

  // Attempt everything outside the target domain, plus the target domain's Set 1
  // questions specifically, so a correct result can only come from pooling
  // Set 2/Set 3 into the unseen filter \u2014 not just from domain filtering alone.
  const outsideDomain = allQuestions.filter(q => domainOf(q.sub) !== targetDomain);
  const set1InDomain = e.sets[1].filter(q => domainOf(q.sub) === targetDomain);
  await markAllAttempted(window, outsideDomain.concat(set1InDomain));

  const sel = modeCard(window, 2).querySelector('[data-focusdom]');
  sel.value = targetDomain;
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  click(window, modeCard(window, 2).querySelector('[data-count="focus"][data-n="10"]'));
  click(window, modeCard(window, 2).querySelector('[data-unseen="focus"]'));
  await settle(window);

  click(window, modeCard(window, 2).querySelector('[data-mode="focus"]'));
  await settle(window);

  const overview = window.document.getElementById('tb-overview');
  const total = overview.querySelectorAll('.tb-navcell').length;
  assert.ok(total > 0, 'served at least one question');

  const set1InDomainStems = new Set(set1InDomain.map(q => q.stem));
  const inDomainStems = new Set(allQuestions.filter(q => domainOf(q.sub) === targetDomain).map(q => q.stem));
  for (let i = 0; i < total; i += 1) {
    const stem = stemAt(window, i);
    assert.ok(inDomainStems.has(stem), 'question ' + i + ' stayed within the selected domain');
    assert.ok(!set1InDomainStems.has(stem), 'question ' + i + ' was not one of the already-attempted Set 1 questions, proving Sets 2/3 were pooled in');
  }
});

test('when fewer unseen questions remain than requested, it serves the smaller count with a note instead of failing', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const allQuestions = e.sets[1].concat(e.sets[2], e.sets[3]);
  const keepUnseen = allQuestions.slice(0, 4);
  const toAttempt = allQuestions.filter(q => !keepUnseen.includes(q));
  await markAllAttempted(window, toAttempt);

  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="10"]'));
  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);

  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Only 4 unseen question/);

  click(window, modeCard(window, 1).querySelector('[data-mode="quick"]'));
  await settle(window);
  const total = window.document.querySelectorAll('#tb-overview .tb-navcell').length;
  assert.equal(total, 4, 'served only the 4 remaining unseen questions rather than padding with seen ones');
});

test('when the unseen pool is fully exhausted, Start is disabled and no session begins', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  await markAllAttempted(window, e.sets[1].concat(e.sets[2], e.sets[3]));

  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);

  const startButton = modeCard(window, 1).querySelector('[data-mode="quick"]');
  assert.equal(startButton.disabled, true);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /attempted every question/i);

  click(window, startButton);
  await settle(window);
  assert.equal(window.document.getElementById('tb-overview').querySelector('.tb-quiz'), null, 'no quiz session was started');
});

test('New-only asks the authoritative RPC immediately and rejects questions seen on another device without a ledger refresh', async () => {
  const remoteRows = [];
  const remoteFetches = [];
  const rpcCalls = [];
  const { window, learner } = await loadPage({ remoteRows, remoteFetches, rpcCalls });
  const e = window.__TB.EXAMS.cssbb;

  /* The learner turns the control on while the laptop's initially-hydrated
     view is still accurate. A phone then finishes work; the start click must
     not draw from that now-stale local view. */
  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window, 4);
  assert.ok(modeCard(window, 1).querySelector('[data-unseen="quick"]').classList.contains('on'));

  const all = e.sets[1].concat(e.sets[2], e.sets[3]);
  all.forEach((question, index) => {
    remoteRows.push({
      user_id: learner.id,
      event_id: 'phone-fresh-' + index,
      device_id: 'phone-device',
      event_type: 'question_exposed',
      exam_id: 'cssbb',
      session_id: 'phone-session-' + index,
      question_id: question.qid,
      occurred_at: new Date(Date.UTC(2026, 7, 31, 9, 0, index)).toISOString(),
      payload: { mode: 'quick', timed: false }
    });
  });

  const beforeStartFetches = remoteFetches.length;
  click(window, modeCard(window, 1).querySelector('[data-mode="quick"]'));
  await settle(window, 5);

  assert.equal(remoteFetches.length, beforeStartFetches, 'Start does not download the learning ledger');
  assert.ok(rpcCalls.length > 0, 'Start calls the reservation RPC directly');
  assert.equal(window.document.getElementById('tb-overview').querySelector('.tb-quiz'), null, 'the server rejects every phone-delivered question');
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /remaining new questions were just reserved|No quiz was started/i);
});

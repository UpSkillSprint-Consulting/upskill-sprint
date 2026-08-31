'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const registry = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const learning = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');
const migration = fs.readFileSync(path.join(ROOT, 'supabase/migrations/20260831010000_add_test_bank_new_question_claims.sql'), 'utf8');

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

async function waitFor(window, predicate, tries = 24) {
  for (let index = 0; index < tries; index += 1) {
    if (predicate()) return true;
    await new Promise(resolve => window.setTimeout(resolve, 0));
    await settle(window, 1);
  }
  return predicate();
}

/* This is an in-memory stand-in for the database primary key.  Its mutation is
   synchronous before the Promise resolves, matching Postgres's unique-key
   compare-and-claim behaviour for competing RPC requests. */
function createAtomicClient(claims, calls, options) {
  const config = options || {};
  return {
    from() {
      return {
        upsert() { return Promise.resolve({ error: null }); },
        select() {
          const query = {
            eq() { return query; },
            order() { return query; },
            range() { return Promise.resolve({ data: [], error: null }); },
            limit() { return Promise.resolve({ data: [], error: null }); }
          };
          return query;
        }
      };
    },
    rpc(name, args) {
      calls.push({ name, args });
      if (config.error) return Promise.resolve({ data: [], error: config.error });
      const accepted = (args.p_question_ids || []).filter(questionId => {
        const key = config.userId + ':' + args.p_exam_id + ':' + questionId;
        if (claims.has(key)) return false;
        claims.add(key);
        return true;
      }).map(question_id => ({ question_id }));
      return Promise.resolve({ data: accepted, error: null });
    }
  };
}

async function loadLedger(options) {
  const config = options || {};
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });
  windows.push(dom.window);
  const user = { id: config.userId || 'reservation-test-user' };
  dom.window.UpskillAuth = { getUser: () => user, getClient: () => config.client };
  dom.window.eval(registry);
  dom.window.eval(learning);
  await dom.window.__TBLearning.sync('reservation-test-hydrate');
  return { window: dom.window, api: dom.window.__TBLearning };
}

function compactCssbbFixture(window) {
  const exam = window.__TB.EXAMS.cssbb;
  const targetSubs = new Set(exam.bok[0].subs.map(sub => sub.id));
  const representative = questions => {
    /* Leave enough questions in the first Focused area for two competing
       ten-question sessions, in addition to a small cross-domain sample for
       the Quick path. */
    const target = questions.filter(question => targetSubs.has(question.sub)).slice(0, 8);
    const other = questions.filter(question => !targetSubs.has(question.sub)).slice(0, 4);
    assert.equal(target.length, 8, 'fixture needs target-domain questions in every set');
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

async function loadCore(options) {
  const config = options || {};
  const errors = [];
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
  const user = { id: config.userId || 'reservation-test-user' };
  dom.window.UpskillAuth = { getUser: () => user, getClient: () => config.client };
  dom.window.eval(registry);
  compactCssbbFixture(dom.window);
  dom.window.eval(learning);
  await dom.window.__TBLearning.sync('reservation-test-hydrate');
  await settle(dom.window, 3);
  return { window: dom.window, errors };
}

function click(window, element) {
  assert.ok(element, 'expected interactive control');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function quickCard(window) {
  return window.document.querySelectorAll('#tb-overview .tb-mode')[1];
}

function focusedCard(window) {
  return window.document.querySelectorAll('#tb-overview .tb-mode')[2];
}

function reservationQuestionIds(window) {
  return window.__TBLearning.eventsForExam('cssbb')
    .filter(event => event.type === 'question_exposed')
    .map(event => event.questionId)
    .sort();
}

test('the database migration locks New-only claims to auth.uid and exposes only a bounded RPC', () => {
  assert.match(migration, /primary key \(user_id, exam_id, question_id\)/i);
  assert.match(migration, /enable row level security/i);
  assert.match(migration, /revoke all on table public\.test_bank_new_question_claims from public, anon, authenticated/i);
  assert.match(migration, /security definer[\s\S]*set search_path = ''/i);
  assert.match(migration, /v_user_id uuid := auth\.uid\(\)/i);
  assert.match(migration, /on conflict \(user_id, exam_id, question_id\) do nothing/i);
  assert.match(migration, /grant execute on function public\.reserve_test_bank_new_questions\(text, text\[\]\) to authenticated/i);
});

test('two ledger clients receive disjoint accepted IDs from concurrent account-owned claims', async () => {
  const claims = new Set();
  const leftCalls = [];
  const rightCalls = [];
  const userId = 'same-account-reservation-test';
  const left = await loadLedger({
    userId,
    client: createAtomicClient(claims, leftCalls, { userId })
  });
  const right = await loadLedger({
    userId,
    client: createAtomicClient(claims, rightCalls, { userId })
  });
  const candidates = [
    'cssbb:set-1:legacy-101',
    'cssbb:set-1:legacy-102',
    'cssbb:set-1:legacy-103',
    'cssbb:set-1:legacy-104'
  ];

  const [first, second] = await Promise.all([
    left.api.reserveNewQuestions({ examId: 'cssbb', questionIds: candidates }),
    right.api.reserveNewQuestions({ examId: 'cssbb', questionIds: candidates })
  ]);

  assert.equal(first.reserved, true);
  assert.equal(second.reserved, true);
  assert.deepEqual(Array.from(first.acceptedIds), candidates, 'the first atomic caller owns every requested candidate');
  assert.deepEqual(Array.from(second.acceptedIds), [], 'the competing device receives no already-claimed ID');
  assert.equal(claims.size, candidates.length);
  assert.equal(leftCalls[0].name, 'reserve_test_bank_new_questions');
  assert.equal(leftCalls[0].args.p_exam_id, 'cssbb');
  assert.deepEqual(Array.from(leftCalls[0].args.p_question_ids), candidates);
  assert.equal(rightCalls.length, 1);
});

test('the ledger refuses an offline reservation without invoking the RPC', async () => {
  const claims = new Set();
  const calls = [];
  const userId = 'offline-reservation-test';
  const page = await loadLedger({
    userId,
    client: createAtomicClient(claims, calls, { userId })
  });
  Object.defineProperty(page.window.navigator, 'onLine', { value: false, configurable: true });

  const result = await page.api.reserveNewQuestions({
    examId: 'cssbb',
    questionIds: ['cssbb:set-1:legacy-201']
  });

  assert.equal(result.reserved, false);
  assert.equal(result.reason, 'offline');
  assert.equal(calls.length, 0, 'offline selection is never optimistically treated as reserved');
});

test('Quick New-only resamples server-rejected candidates so two devices start disjoint quizzes', async () => {
  const claims = new Set();
  const calls = [];
  const userId = 'same-account-core-race';
  const left = await loadCore({
    userId,
    client: createAtomicClient(claims, calls, { userId })
  });
  const right = await loadCore({
    userId,
    client: createAtomicClient(claims, calls, { userId })
  });

  /* Give both devices the same shuffled first batch so the second device must
     exercise the resampling loop after its initial ten IDs conflict. */
  left.window.Math.random = () => 0;
  right.window.Math.random = () => 0;
  for (const page of [left.window, right.window]) {
    click(page, quickCard(page).querySelector('[data-count="quick"][data-n="10"]'));
    click(page, quickCard(page).querySelector('[data-unseen="quick"]'));
  }
  await Promise.all([settle(left.window, 5), settle(right.window, 5)]);

  click(left.window, quickCard(left.window).querySelector('[data-mode="quick"]'));
  click(right.window, quickCard(right.window).querySelector('[data-mode="quick"]'));
  assert.equal(await waitFor(left.window, () => Boolean(left.window.document.querySelector('#tb-overview .tb-quiz'))), true);
  assert.equal(await waitFor(right.window, () => Boolean(right.window.document.querySelector('#tb-overview .tb-quiz'))), true);

  const leftIds = reservationQuestionIds(left.window);
  const rightIds = reservationQuestionIds(right.window);
  assert.equal(leftIds.length, 10);
  assert.equal(rightIds.length, 10);
  assert.deepEqual(Array.from(leftIds).filter(id => Array.from(rightIds).includes(id)), [], 'no New-only ID is handed to both devices');
  assert.equal(claims.size, 20);
  const rpcCalls = calls.filter(call => call.name === 'reserve_test_bank_new_questions');
  assert.ok(rpcCalls.length >= 3, 'the conflicted device made a second candidate-batch reservation request');
  assert.deepEqual(left.errors, []);
  assert.deepEqual(right.errors, []);
});

test('Focused New-only applies the same atomic resampling when two devices choose one domain', async () => {
  const claims = new Set();
  const calls = [];
  const userId = 'same-account-focused-race';
  const left = await loadCore({
    userId,
    client: createAtomicClient(claims, calls, { userId })
  });
  const right = await loadCore({
    userId,
    client: createAtomicClient(claims, calls, { userId })
  });

  left.window.Math.random = () => 0;
  right.window.Math.random = () => 0;
  for (const page of [left.window, right.window]) {
    click(page, focusedCard(page).querySelector('[data-count="focus"][data-n="10"]'));
    click(page, focusedCard(page).querySelector('[data-unseen="focus"]'));
  }
  await Promise.all([settle(left.window, 5), settle(right.window, 5)]);

  click(left.window, focusedCard(left.window).querySelector('[data-mode="focus"]'));
  click(right.window, focusedCard(right.window).querySelector('[data-mode="focus"]'));
  assert.equal(await waitFor(left.window, () => Boolean(left.window.document.querySelector('#tb-overview .tb-quiz'))), true);
  assert.equal(await waitFor(right.window, () => Boolean(right.window.document.querySelector('#tb-overview .tb-quiz'))), true);

  const leftIds = reservationQuestionIds(left.window);
  const rightIds = reservationQuestionIds(right.window);
  assert.equal(leftIds.length, 10);
  assert.equal(rightIds.length, 10);
  assert.deepEqual(Array.from(leftIds).filter(id => Array.from(rightIds).includes(id)), [], 'the Focused New-only sessions do not overlap');
  assert.equal(claims.size, 20);
  assert.ok(calls.filter(call => call.name === 'reserve_test_bank_new_questions').length >= 3);
  assert.deepEqual(left.errors, []);
  assert.deepEqual(right.errors, []);
});

test('Quick New-only fails closed when the atomic reservation RPC errors', async () => {
  const claims = new Set();
  const calls = [];
  const userId = 'reservation-rpc-error';
  const page = await loadCore({
    userId,
    client: createAtomicClient(claims, calls, { userId, error: { message: 'network denied' } })
  });

  click(page.window, quickCard(page.window).querySelector('[data-count="quick"][data-n="10"]'));
  click(page.window, quickCard(page.window).querySelector('[data-unseen="quick"]'));
  await settle(page.window, 5);
  click(page.window, quickCard(page.window).querySelector('[data-mode="quick"]'));
  await settle(page.window, 8);

  assert.equal(page.window.document.querySelector('#tb-overview .tb-quiz'), null, 'a reservation error never falls back to a local New-only draw');
  assert.match(quickCard(page.window).querySelector('.tb-mode-sum').textContent, /couldn’t reserve new questions/i);
  assert.equal(calls.filter(call => call.name === 'reserve_test_bank_new_questions').length, 1);
  assert.deepEqual(page.errors, []);
});

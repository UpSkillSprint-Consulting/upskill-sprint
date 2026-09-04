'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning, emptyClient } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const DUMMY_USER_ID = 'baf168ec-5af3-4fa1-b026-3c2e950ce752';
const OTHER_USER_ID = '7d1c1da5-59ce-4e35-9dc6-0de8fb967d34';
const bankFiles = [
  'test-bank-cmq-set1.js',
  'test-bank-mbb-set1.js',
  'test-bank-mbb-set2.js',
  'test-bank-mbb-set3.js',
  'test-bank-cssgb-set1.js',
  'test-bank-cssgb-set2.js'
];
const rawHtml = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const html = bankFiles.reduce((page, file) => page.replace(
  '<script src="/' + file + '"></script>',
  '<script>' + fs.readFileSync(path.join(ROOT, file), 'utf8') + '</script>'
), rawHtml);
const setControls = fs.readFileSync(path.join(ROOT, 'test-bank-set-controls.js'), 'utf8');
const retakeState = fs.readFileSync(path.join(ROOT, 'test-bank-retake-state.js'), 'utf8');
const retakeRunner = fs.readFileSync(path.join(ROOT, 'test-bank-retake-runner.js'), 'utf8');
const exactMigration = fs.readFileSync(
  path.join(ROOT, 'supabase', 'migrations', '20260904010000_add_exact_new_only_retake_reservation.sql'),
  'utf8'
);
const windows = [];

afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

function settle(window, frames = 4) {
  return new Promise(resolve => {
    function next(remaining) {
      if (!remaining) return resolve();
      window.requestAnimationFrame(() => next(remaining - 1));
    }
    next(frames);
  });
}

async function waitFor(window, predicate, message, tries = 300) {
  for (let index = 0; index < tries; index += 1) {
    const value = predicate();
    if (value) return value;
    await new Promise(resolve => window.setTimeout(resolve, 0));
    await settle(window, 1);
  }
  assert.fail(message || 'condition was not reached');
}

async function loadPage(options) {
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
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};

  const client = config.client || emptyClient();
  const authState = {
    user: { id: config.userId || DUMMY_USER_ID },
    listeners: []
  };
  await installDurableLearning(dom.window, { user: authState.user, client });
  dom.window.UpskillAuth.getUser = () => authState.user;
  dom.window.UpskillAuth.getClient = () => client;
  dom.window.UpskillAuth.onChange = listener => {
    if (typeof listener === 'function') authState.listeners.push(listener);
  };
  authState.setUser = user => {
    authState.user = user;
    authState.listeners.slice().forEach(listener => listener(user));
    dom.window.document.dispatchEvent(new dom.window.CustomEvent('upskill-auth-ready'));
  };

  dom.window.eval(setControls);
  const stateScript = dom.window.document.querySelector('script[src="/test-bank-retake-state.js"]');
  assert.ok(stateScript, 'Set controls load retake state');
  dom.window.eval(retakeState);
  stateScript.dispatchEvent(new dom.window.Event('load'));
  assert.ok(dom.window.document.querySelector('script[src="/test-bank-retake-runner.js"]'), 'retake state loads the runner');
  dom.window.eval(retakeRunner);
  await settle(dom.window, 7);
  return { dom, window: dom.window, errors, authState, client };
}

function closePage(window) {
  const index = windows.indexOf(window);
  if (index !== -1) windows.splice(index, 1);
  try { window.close(); } catch (error) {}
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

function change(window, element) {
  assert.ok(element, 'expected changeable element');
  element.dispatchEvent(new window.Event('change', { bubbles: true }));
}

function overview(window) {
  return window.document.getElementById('tb-overview');
}

function card(window, kind) {
  const start = overview(window).querySelector('[data-mode="' + kind + '"]');
  return start && start.closest('.tb-mode');
}

async function selectExam(window, examId) {
  const target = window.document.querySelector('.tb-tile[data-exam="' + examId + '"]');
  assert.ok(target, examId + ' tile exists');
  click(window, target);
  await settle(window, 5);
  assert.ok(window.document.querySelector('.tb-tile.active[data-exam="' + examId + '"]'), examId + ' is active');
}

async function selectSet(window, setId) {
  const target = overview(window).querySelector('.tb-setpick [data-set="' + setId + '"]');
  assert.ok(target, 'Set ' + setId + ' exists');
  click(window, target);
  await settle(window, 4);
  assert.ok(overview(window).querySelector('.tb-setpick [data-set="' + setId + '"].on'));
}

async function selectCount(window, kind, count) {
  const target = card(window, kind).querySelector('[data-count="' + kind + '"][data-n="' + count + '"]');
  assert.ok(target, kind + ' offers ' + count + ' questions');
  click(window, target);
  await settle(window, 4);
}

async function selectTiming(window, kind, timed) {
  const target = card(window, kind).querySelector('[data-timing-kind="' + kind + '"][data-timed="' + (timed ? '1' : '0') + '"]');
  assert.ok(target, kind + ' exposes the requested timing mode');
  click(window, target);
  await settle(window, 4);
}

async function selectFocusDomain(window, domainId) {
  const select = card(window, 'focus').querySelector('[data-focusdom]');
  assert.ok(Array.from(select.options).some(option => option.value === domainId));
  select.value = domainId;
  change(window, select);
  await settle(window, 4);
}

async function toggleNewOnly(window, kind) {
  const target = card(window, kind).querySelector('[data-unseen="' + kind + '"]');
  assert.ok(target && !target.disabled, 'New-only is available for ' + kind);
  click(window, target);
  await settle(window, 5);
  assert.equal(card(window, kind).querySelector('[data-unseen="' + kind + '"]').getAttribute('aria-pressed'), 'true');
}

async function startQuiz(window, kind) {
  const start = overview(window).querySelector('[data-mode="' + kind + '"]');
  assert.ok(start && !start.disabled, kind + ' Start is enabled');
  click(window, start);
  await waitFor(window, () => overview(window).querySelector('.tb-quiz'), kind + ' quiz did not start');
  await settle(window, 2);
  const recipe = window.__TBRetakeConfiguration.current();
  assert.ok(recipe && recipe.sessionId, kind + ' start produced a durable recipe');
  return recipe;
}

async function submitQuiz(window) {
  const host = overview(window);
  const cells = host.querySelectorAll('.tb-navcell');
  assert.ok(cells.length > 0, 'active quiz has navigation cells');
  click(window, cells[cells.length - 1]);
  await settle(window, 2);
  click(window, host.querySelector('[data-submit]'));
  await waitFor(window, () => overview(window).querySelector('[data-retake]'), 'results and Retake button did not render');
  await settle(window, 5);
}

async function retakeFromResults(window, priorSessionId) {
  const button = overview(window).querySelector('[data-retake]');
  assert.equal(button.dataset.retakeConfigured, 'true', 'Retake is tied to the completed recipe');
  click(window, button);
  await waitFor(window, () => {
    const recipe = window.__TBRetakeConfiguration.current();
    return overview(window).querySelector('.tb-quiz') && recipe && recipe.sessionId !== priorSessionId ? recipe : null;
  }, 'Retake did not create a fresh configured session');
  await settle(window, 2);
  return window.__TBRetakeConfiguration.current();
}

async function backToSetup(window) {
  const back = overview(window).querySelector('[data-back]');
  click(window, back);
  await waitFor(window, () => overview(window).querySelector('[data-mode="quick"]'), 'setup screen did not return');
  await settle(window, 3);
}

function sessionState(window, sessionId) {
  return window.__TBLearning.store().sessions[sessionId];
}

function combinedBank(exam) {
  if (!exam.sets) return Array.isArray(exam.bank) ? exam.bank.slice() : [];
  return Object.keys(exam.sets).sort().flatMap(setId => exam.sets[setId] || []);
}

function domainForQuestion(exam, question) {
  const group = exam.bok.find(domain => domain.subs.some(subtopic => subtopic.id === question.sub));
  return group && group.domain;
}

function largestDomain(exam, bank) {
  const counts = new Map();
  bank.forEach(question => {
    const domain = domainForQuestion(exam, question);
    if (domain) counts.set(domain, (counts.get(domain) || 0) + 1);
  });
  return Array.from(counts, ([id, count]) => ({ id, count })).sort((left, right) => right.count - left.count)[0] || null;
}

function assertCleanActiveSession(window, recipe) {
  const session = sessionState(window, recipe.sessionId);
  assert.ok(session, 'durable session exists');
  assert.equal(session.ownerId, DUMMY_USER_ID, 'session belongs to the QA dummy account');
  assert.equal(session.status, 'active');
  assert.deepEqual(Object.keys(session.answerEvents || {}), [], 'no answer events carry into a retake');
  assert.equal(session.questionIds.length, recipe.questionCount);
}

test('dummy-account stress: 12 consecutive Quick retakes preserve the recipe and create clean attempts', async () => {
  const { window, errors } = await loadPage();
  await selectExam(window, 'cssbb');
  await selectSet(window, '2');
  await selectCount(window, 'quick', 10);
  await selectTiming(window, 'quick', true);

  let recipe = await startQuiz(window, 'quick');
  const sessions = new Set([recipe.sessionId]);
  assert.equal(recipe.ownerId, DUMMY_USER_ID);
  assertCleanActiveSession(window, recipe);

  for (let cycle = 1; cycle <= 12; cycle += 1) {
    const previous = recipe;
    await submitQuiz(window);
    recipe = await retakeFromResults(window, previous.sessionId);

    assert.equal(recipe.ownerId, DUMMY_USER_ID);
    assert.equal(recipe.examId, 'cssbb');
    assert.equal(recipe.setId, '2');
    assert.equal(recipe.kind, 'quick');
    assert.equal(recipe.questionCount, 10);
    assert.equal(recipe.timed, true);
    assert.equal(recipe.filter, null);
    assert.equal(recipe.retakeOfSessionId, previous.sessionId, 'lineage points to the immediate completed attempt');
    assert.equal(sessions.has(recipe.sessionId), false, 'every retake receives a unique session ID');
    sessions.add(recipe.sessionId);
    assert.equal(overview(window).querySelectorAll('.tb-navcell').length, 10);
    assert.match(overview(window).textContent, /Quick Quiz · timed/i);
    assertCleanActiveSession(window, recipe);
  }

  assert.equal(sessions.size, 13);
  assert.equal(Object.keys(window.__TBLearning.store().sessions).length, 13);
  assert.deepEqual(errors, []);
});

test('dummy-account stress: a burst of 25 Retake clicks creates exactly one replacement session', async () => {
  const { window, errors } = await loadPage();
  await selectCount(window, 'quick', 10);
  await selectTiming(window, 'quick', false);
  const first = await startQuiz(window, 'quick');
  await submitQuiz(window);
  const sessionCountBefore = Object.keys(window.__TBLearning.store().sessions).length;
  const button = overview(window).querySelector('[data-retake]');

  for (let index = 0; index < 25; index += 1) click(window, button);

  const second = await waitFor(window, () => {
    const recipe = window.__TBRetakeConfiguration.current();
    return overview(window).querySelector('.tb-quiz') && recipe && recipe.sessionId !== first.sessionId ? recipe : null;
  }, 'rapid clicks did not produce the one expected retake');
  await settle(window, 3);

  assert.equal(Object.keys(window.__TBLearning.store().sessions).length, sessionCountBefore + 1, 'duplicate clicks cannot create duplicate sessions');
  assert.equal(second.retakeOfSessionId, first.sessionId);
  assert.equal(second.ownerId, DUMMY_USER_ID);
  assertCleanActiveSession(window, second);
  assert.equal(overview(window).querySelector('[data-retake-error]'), null);
  assert.deepEqual(errors, []);
});

test('dummy-account stress: a different signed-in user cannot reuse the completed recipe', async () => {
  const { window, errors, authState } = await loadPage();
  await selectCount(window, 'quick', 10);
  const first = await startQuiz(window, 'quick');
  await submitQuiz(window);
  const sessionCountBefore = Object.keys(window.__TBLearning.store().sessions).length;
  const button = overview(window).querySelector('[data-retake]');

  authState.setUser({ id: OTHER_USER_ID });
  await settle(window, 4);
  assert.equal(window.__TBRetakeConfiguration.current(), null, 'recipe is hidden from a different account');
  click(window, button);
  const error = await waitFor(window, () => overview(window).querySelector('[data-retake-error]'), 'account isolation error did not render');

  assert.match(error.textContent, /signed-in account/i);
  assert.equal(overview(window).querySelector('.tb-quiz'), null);
  assert.equal(Object.keys(window.__TBLearning.store().sessions).length, sessionCountBefore, 'account switch starts no session');

  authState.setUser({ id: DUMMY_USER_ID });
  await settle(window, 4);
  assert.equal(window.__TBRetakeConfiguration.current().sessionId, first.sessionId, 'the original account can recover its recipe');
  const second = await retakeFromResults(window, first.sessionId);
  assert.equal(second.ownerId, DUMMY_USER_ID);
  assert.equal(second.retakeOfSessionId, first.sessionId);
  assert.deepEqual(errors, []);
});

test('dummy-account stress: a cross-device New-only shortfall is atomic and creates no orphan claims', async () => {
  const base = emptyClient();
  const claims = new Set();
  const rpcCalls = [];
  const client = {
    from: base.from,
    rpc(name, args) {
      rpcCalls.push({ name, args });
      const ids = (args && args.p_question_ids || []).slice();
      if (name === 'reserve_test_bank_new_questions_exact') {
        const available = ids.filter(id => !claims.has(id)).slice(0, 7);
        assert.ok(available.length < Number(args.p_required_count), 'fixture creates an authoritative seven-of-ten race');
        return Promise.resolve({
          data: null,
          error: { code: 'P0001', message: 'Exact New-only retake requires 10 questions, but only 7 remain' }
        });
      }
      const accepted = ids.filter(id => {
        if (claims.has(id)) return false;
        claims.add(id);
        return true;
      }).map(question_id => ({ question_id }));
      return Promise.resolve({ data: accepted, error: null });
    }
  };
  const { window, errors } = await loadPage({ client });
  await selectExam(window, 'cssbb');
  await selectCount(window, 'quick', 10);
  await toggleNewOnly(window, 'quick');
  const first = await startQuiz(window, 'quick');
  await submitQuiz(window);
  const claimsBefore = new Set(claims);
  const sessionCountBefore = Object.keys(window.__TBLearning.store().sessions).length;

  click(window, overview(window).querySelector('[data-retake]'));
  const error = await waitFor(window, () => overview(window).querySelector('[data-retake-error]'), 'atomic shortfall error did not render');
  await settle(window, 3);

  assert.match(error.textContent, /requires 10 questions, but only 7 remain|No different quiz was substituted/i);
  assert.equal(overview(window).querySelector('.tb-quiz'), null, 'no shorter quiz opens');
  assert.equal(Object.keys(window.__TBLearning.store().sessions).length, sessionCountBefore, 'no partial attempt is written');
  assert.deepEqual(Array.from(claims).sort(), Array.from(claimsBefore).sort(), 'failed exact reservation consumes no additional New-only IDs');
  assert.equal(rpcCalls.filter(call => call.name === 'reserve_test_bank_new_questions').length, 1, 'only the original attempt uses the normal reservation RPC');
  const exactCalls = rpcCalls.filter(call => call.name === 'reserve_test_bank_new_questions_exact');
  assert.equal(exactCalls.length, 1, 'retake uses the exact atomic RPC');
  assert.equal(exactCalls[0].args.p_required_count, 10);
  assert.equal(first.ownerId, DUMMY_USER_ID);
  assert.deepEqual(errors, []);
});

test('exact New-only retake migration is all-or-nothing, account-scoped, and concurrency-serialized', () => {
  assert.match(exactMigration, /create or replace function public\.reserve_test_bank_new_questions_exact/i);
  assert.match(exactMigration, /v_user_id uuid := auth\.uid\(\)/i);
  assert.match(exactMigration, /pg_advisory_xact_lock\s*\(/i);
  assert.match(exactMigration, /test_bank_new_question_claims/i);
  assert.match(exactMigration, /test_bank_learning_events/i);
  assert.match(exactMigration, /cardinality\(v_selected_ids\) <> v_required_count/i);
  assert.match(exactMigration, /get diagnostics v_inserted_count = row_count/i);
  assert.match(exactMigration, /grant execute on function public\.reserve_test_bank_new_questions_exact\(text, text\[\], integer\)\s+to authenticated/i);
  assert.ok(
    exactMigration.indexOf('if cardinality(v_selected_ids) <> v_required_count') <
      exactMigration.indexOf('insert into public.test_bank_new_question_claims'),
    'shortfalls raise before any claim insert'
  );
});

test('dummy-account certification matrix: Quick and Focused retakes work across every live exam', async () => {
  const examIds = ['cssbb', 'mbb', 'cssgb', 'cqe', 'cmq'];

  for (let examIndex = 0; examIndex < examIds.length; examIndex += 1) {
    const examId = examIds[examIndex];
    const { window, errors } = await loadPage();
    await selectExam(window, examId);
    const exam = window.__TB.EXAMS[examId];
    assert.ok(exam && combinedBank(exam).length >= 10, examId + ' has a live bank');

    await selectCount(window, 'quick', 10);
    await selectTiming(window, 'quick', examIndex % 2 === 0);
    const quickFirst = await startQuiz(window, 'quick');
    await submitQuiz(window);
    const quickSecond = await retakeFromResults(window, quickFirst.sessionId);
    assert.equal(quickSecond.examId, examId);
    assert.equal(quickSecond.kind, 'quick');
    assert.equal(quickSecond.questionCount, quickFirst.questionCount);
    assert.equal(quickSecond.timed, quickFirst.timed);
    assert.equal(quickSecond.ownerId, DUMMY_USER_ID);
    await submitQuiz(window);
    await backToSetup(window);

    const focusBank = exam.sets && exam.sets[1] ? exam.sets[1] : exam.bank;
    const focus = largestDomain(exam, focusBank || []);
    assert.ok(focus && focus.count > 0, examId + ' has a Focused Quiz domain');
    await selectFocusDomain(window, focus.id);
    await selectCount(window, 'focus', 10);
    await selectTiming(window, 'focus', examIndex % 2 !== 0);
    const focusFirst = await startQuiz(window, 'focus');
    await submitQuiz(window);
    const focusSecond = await retakeFromResults(window, focusFirst.sessionId);
    assert.equal(focusSecond.examId, examId);
    assert.equal(focusSecond.kind, 'focus');
    assert.equal(focusSecond.focusDomain, focus.id);
    assert.equal(focusSecond.questionCount, focusFirst.questionCount);
    assert.equal(focusSecond.timed, focusFirst.timed);
    assert.equal(focusSecond.ownerId, DUMMY_USER_ID);
    assert.deepEqual(errors, [], examId + ' produced no browser errors');
    closePage(window);
  }
});

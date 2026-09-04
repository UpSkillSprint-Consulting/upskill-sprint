'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const setControls = fs.readFileSync(path.join(ROOT, 'test-bank-set-controls.js'), 'utf8');
const retakeState = fs.readFileSync(path.join(ROOT, 'test-bank-retake-state.js'), 'utf8');
const retakeRunner = fs.readFileSync(path.join(ROOT, 'test-bank-retake-runner.js'), 'utf8');
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

async function waitFor(window, predicate, message, tries = 220) {
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
  await installDurableLearning(dom.window);
  if (config.missedFilter) {
    dom.window.__TBAdaptiveMastery = {
      missedFilter: config.missedFilter
    };
    click(dom.window, dom.window.document.querySelector('.tb-tile.active[data-exam]'));
    await settle(dom.window, 3);
  }
  dom.window.eval(setControls);
  const stateScript = dom.window.document.querySelector('script[src="/test-bank-retake-state.js"]');
  assert.ok(stateScript, 'the statically loaded Set-controls enhancer starts the retake workflow loader');
  dom.window.eval(retakeState);
  stateScript.dispatchEvent(new dom.window.Event('load'));
  assert.ok(dom.window.document.querySelector('script[src="/test-bank-retake-runner.js"]'), 'the runner is loaded after retake state');
  dom.window.eval(retakeRunner);
  await settle(dom.window, 6);
  return { dom, window: dom.window, errors };
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
  click(window, target);
  await settle(window, 4);
}

async function selectSet(window, setId) {
  const target = overview(window).querySelector('.tb-setpick [data-set="' + setId + '"]');
  click(window, target);
  await settle(window, 4);
  assert.ok(overview(window).querySelector('.tb-setpick [data-set="' + setId + '"].on'));
}

async function selectCount(window, kind, count) {
  const target = card(window, kind).querySelector('[data-count="' + kind + '"][data-n="' + count + '"]');
  click(window, target);
  await settle(window, 4);
}

async function selectTiming(window, kind, timed) {
  const target = card(window, kind).querySelector('[data-timing-kind="' + kind + '"][data-timed="' + (timed ? '1' : '0') + '"]');
  click(window, target);
  await settle(window, 4);
}

async function selectFocusDomain(window, domainId) {
  const select = card(window, 'focus').querySelector('[data-focusdom]');
  select.value = domainId;
  change(window, select);
  await settle(window, 4);
}

async function toggleFilter(window, kind, filter) {
  const attribute = filter === 'new-only' ? 'data-unseen' : 'data-missed';
  const target = card(window, kind).querySelector('[' + attribute + '="' + kind + '"]');
  assert.equal(target.disabled, false, filter + ' is available');
  click(window, target);
  await settle(window, 5);
}

async function startQuiz(window, kind) {
  click(window, overview(window).querySelector('[data-mode="' + kind + '"]'));
  await waitFor(window, () => overview(window).querySelector('.tb-quiz'), kind + ' quiz did not start');
  await settle(window, 2);
  return window.__TBRetakeConfiguration.current();
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
  click(window, button);
  await waitFor(window, () => {
    const recipe = window.__TBRetakeConfiguration.current();
    return overview(window).querySelector('.tb-quiz') && recipe && recipe.sessionId !== priorSessionId ? recipe : null;
  }, 'Retake did not create a fresh configured session');
  await settle(window, 2);
  return window.__TBRetakeConfiguration.current();
}

function sessionState(window, sessionId) {
  return window.__TBLearning.store().sessions[sessionId];
}

function questionIdsFor(window, examId, questions) {
  return new Set(questions.map(question => window.__TBQuestionRegistry.idFor(examId, question)));
}

function domainForQuestion(exam, question) {
  const group = exam.bok.find(domain => domain.subs.some(subtopic => subtopic.id === question.sub));
  return group && group.domain;
}

function domainWithAtLeast(exam, bank, minimum) {
  return exam.bok.map(domain => ({
    id: domain.domain,
    count: bank.filter(question => domainForQuestion(exam, question) === domain.domain).length
  })).find(item => item.count >= minimum);
}

test('Retake Quick Quiz recreates exam, set, count, timing, and a fresh session', async () => {
  const { window, errors } = await loadPage();
  await selectExam(window, 'cssbb');
  await selectSet(window, '2');
  await selectCount(window, 'quick', 30);
  await selectTiming(window, 'quick', true);

  const first = await startQuiz(window, 'quick');
  assert.deepEqual({
    examId: first.examId,
    setId: first.setId,
    kind: first.kind,
    questionCount: first.questionCount,
    timed: first.timed,
    filter: first.filter
  }, {
    examId: 'cssbb',
    setId: '2',
    kind: 'quick',
    questionCount: 30,
    timed: true,
    filter: null
  });
  assert.equal(overview(window).querySelectorAll('.tb-navcell').length, 30);
  assert.match(overview(window).textContent, /Quick Quiz · timed/i);
  const allowed = questionIdsFor(window, 'cssbb', window.__TB.EXAMS.cssbb.sets[2]);
  assert.ok(sessionState(window, first.sessionId).questionIds.every(id => allowed.has(id)), 'the first attempt uses Set 2');

  await submitQuiz(window);
  const retakeButton = overview(window).querySelector('[data-retake]');
  assert.match(retakeButton.title, /Set 2 · 30 questions · Timed/i);
  const second = await retakeFromResults(window, first.sessionId);

  assert.notEqual(second.sessionId, first.sessionId, 'retake has a new attempt ID');
  assert.equal(second.retakeOfSessionId, first.sessionId, 'retake lineage points to the completed attempt');
  assert.equal(second.setId, '2');
  assert.equal(second.questionCount, 30);
  assert.equal(second.timed, true);
  assert.equal(second.filter, null);
  assert.equal(overview(window).querySelectorAll('.tb-navcell').length, 30);
  assert.match(overview(window).textContent, /Quick Quiz · timed/i);
  assert.ok(sessionState(window, second.sessionId).questionIds.every(id => allowed.has(id)), 'retake still uses Set 2');
  assert.deepEqual(errors, []);
});

test('Retake Focused Quiz preserves set, Body of Knowledge area, count, and untimed mode', async () => {
  const { window, errors } = await loadPage();
  await selectExam(window, 'cssbb');
  await selectSet(window, '3');
  const exam = window.__TB.EXAMS.cssbb;
  const focus = domainWithAtLeast(exam, exam.sets[3], 10);
  assert.ok(focus, 'fixture has a Set 3 domain with at least ten questions');
  await selectFocusDomain(window, focus.id);
  await selectCount(window, 'focus', 10);
  await selectTiming(window, 'focus', false);

  const first = await startQuiz(window, 'focus');
  assert.equal(first.setId, '3');
  assert.equal(first.focusDomain, focus.id);
  assert.equal(first.questionCount, 10);
  assert.equal(first.timed, false);
  assert.equal(overview(window).querySelectorAll('.tb-navcell').length, 10);
  const byId = new Map(exam.sets[3].map(question => [window.__TBQuestionRegistry.idFor('cssbb', question), question]));
  assert.ok(sessionState(window, first.sessionId).questionIds.every(id => byId.has(id) && domainForQuestion(exam, byId.get(id)) === focus.id));

  await submitQuiz(window);
  const second = await retakeFromResults(window, first.sessionId);

  assert.notEqual(second.sessionId, first.sessionId);
  assert.equal(second.retakeOfSessionId, first.sessionId);
  assert.equal(second.setId, '3');
  assert.equal(second.focusDomain, focus.id);
  assert.equal(second.questionCount, 10);
  assert.equal(second.timed, false);
  assert.match(overview(window).textContent, /Focused Quiz · untimed/i);
  assert.ok(sessionState(window, second.sessionId).questionIds.every(id => byId.has(id) && domainForQuestion(exam, byId.get(id)) === focus.id));
  assert.deepEqual(errors, []);
});

test('Retake Quick Quiz preserves New-only and draws a fresh disjoint set', async () => {
  const { window, errors } = await loadPage();
  await selectExam(window, 'cssbb');
  await selectSet(window, '2');
  await selectCount(window, 'quick', 10);
  await selectTiming(window, 'quick', true);
  await toggleFilter(window, 'quick', 'new-only');

  const first = await startQuiz(window, 'quick');
  assert.equal(first.newOnly, true);
  assert.equal(first.filter, 'new-only');
  assert.equal(first.setId, '2', 'the selected set is retained even though New-only uses the existing Mixed pool policy');
  const firstIds = new Set(sessionState(window, first.sessionId).questionIds);
  assert.equal(firstIds.size, 10);

  await submitQuiz(window);
  const second = await retakeFromResults(window, first.sessionId);
  const secondIds = new Set(sessionState(window, second.sessionId).questionIds);

  assert.notEqual(second.sessionId, first.sessionId);
  assert.equal(second.retakeOfSessionId, first.sessionId);
  assert.equal(second.newOnly, true);
  assert.equal(second.missedOnly, false);
  assert.equal(second.filter, 'new-only');
  assert.equal(second.questionCount, 10);
  assert.equal(second.timed, true);
  assert.deepEqual(Array.from(secondIds).filter(id => firstIds.has(id)), [], 'New-only retake does not repeat an exposed question');
  assert.deepEqual(errors, []);
});

test('Retake preserves the actual completed count when a Missed-only pool is smaller than a standard count button', async () => {
  const { window, errors } = await loadPage({ missedFilter: questions => questions.slice(0, 7) });
  await selectCount(window, 'quick', 10);
  await selectTiming(window, 'quick', false);
  await toggleFilter(window, 'quick', 'missed-only');

  const first = await startQuiz(window, 'quick');
  assert.equal(first.missedOnly, true);
  assert.equal(first.filter, 'missed-only');
  assert.equal(first.questionCount, 7, 'recipe records the seven questions actually delivered');
  assert.equal(overview(window).querySelectorAll('.tb-navcell').length, 7);

  await submitQuiz(window);
  const second = await retakeFromResults(window, first.sessionId);

  assert.notEqual(second.sessionId, first.sessionId);
  assert.equal(second.retakeOfSessionId, first.sessionId);
  assert.equal(second.missedOnly, true);
  assert.equal(second.filter, 'missed-only');
  assert.equal(second.questionCount, 7);
  assert.equal(second.timed, false);
  assert.equal(overview(window).querySelectorAll('.tb-navcell').length, 7, 'retake repeats the completed count exactly');
  assert.deepEqual(errors, []);
});

test('Retake fails closed when the saved filtered pool is no longer available', async () => {
  let available = true;
  const { window, errors } = await loadPage({
    missedFilter: questions => available ? questions.slice(0, 10) : []
  });
  await selectCount(window, 'quick', 10);
  await toggleFilter(window, 'quick', 'missed-only');
  const first = await startQuiz(window, 'quick');
  await submitQuiz(window);
  const sessionCountBefore = Object.keys(window.__TBLearning.store().sessions).length;

  available = false;
  click(window, overview(window).querySelector('[data-retake]'));
  const error = await waitFor(window, () => overview(window).querySelector('[data-retake-error]'), 'a fail-closed retake error did not render');

  assert.match(error.textContent, /No missed questions remain/i);
  assert.match(error.textContent, /No unfiltered quiz was started/i);
  assert.equal(overview(window).querySelector('.tb-quiz'), null, 'no generic or unfiltered quiz is substituted');
  assert.equal(Object.keys(window.__TBLearning.store().sessions).length, sessionCountBefore, 'no new attempt is recorded');
  assert.equal(window.__TBRetakeConfiguration.current().sessionId, first.sessionId, 'completed recipe remains the current recipe after the blocked retake');
  assert.deepEqual(errors, []);
});

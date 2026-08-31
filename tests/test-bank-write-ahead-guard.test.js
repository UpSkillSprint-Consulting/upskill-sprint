'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const registrySource = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const masterySource = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');
const hardeningSource = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-hardening.js'), 'utf8');
const completionGuardSource = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-completion-guard.js'), 'utf8');

function settle(window, frames) {
  return new Promise(resolve => {
    function next(remaining) {
      if (!remaining) return resolve();
      window.requestAnimationFrame(() => next(remaining - 1));
    }
    next(frames || 3);
  });
}

async function load(options) {
  const dom = new JSDOM('<!doctype html><body><main id="tb-overview"><div id="tb-feedback-live"></div></main></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const question = { qid: 'cssbb:guard-001', stem: 'Guarded adaptive question.', options: ['A', 'B', 'C', 'D'], answer: 1, why: 'Explanation.', sub: 'mea' };
  const calls = { start: 0, answer: 0, complete: 0 };
  dom.window.__TB = { EXAMS: { cssbb: {
    questions: 165, sets: { 1: [question] },
    bok: [{ subs: [{ id: 'mea', name: 'Measure', w: 100 }] }]
  } } };
  if (!options.noLedger) {
    dom.window.__TBLearning = {
      startSession() { calls.start += 1; return { sessionId: 'guard-session', saved: options.startSaved !== false }; },
      recordAnswer() { calls.answer += 1; return { eventId: 'guard-answer', saved: options.answerSaved !== false }; },
      completeSession(payload) {
        calls.complete += 1;
        if (typeof options.completeSession === 'function') return options.completeSession(payload, calls);
        return { sessionId: 'guard-session', total: 1, correct: 1, saved: options.completeSaved !== false };
      },
      status() { return { writeAheadSaved: options.statusSaved !== false }; }
    };
  }
  dom.window.eval(registrySource);
  dom.window.eval(masterySource);
  if (options.hardening) dom.window.eval(hardeningSource);
  if (options.completionGuard) dom.window.eval(completionGuardSource);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  dom.window.__TBAdaptiveMastery.renderStandalone(dom.window.document.getElementById('tb-overview'));
  await settle(dom.window);
  return { dom, window: dom.window, calls };
}

function click(window, element) {
  assert.ok(element, 'expected interactive control');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function closeQuietly(dom) {
  /* Both mastery layers intentionally watch DOM mutations. Disable a final
     queued animation-frame refresh before disposing JSDOM's document. */
  dom.window.requestAnimationFrame = function () { return 0; };
  dom.window.cancelAnimationFrame = function () {};
  dom.window.close();
}

test('v1 adaptive practice does not visually accept an answer whose write-ahead record failed', async () => {
  const { dom, window, calls } = await load({ answerSaved: false });
  try {
    click(window, window.document.querySelector('[data-start-adaptive]'));
    await settle(window);
    click(window, window.document.querySelector('[data-adaptive-opt="1"]'));
    assert.equal(calls.answer, 1);
    assert.equal(window.document.querySelector('.tb-adaptive-option.selected'), null, 'selection stays unchanged until the ledger write succeeds');
    assert.match(window.document.getElementById('tb-feedback-live').textContent, /could not be saved/i);
  } finally {
    await settle(window, 6);
    closeQuietly(dom);
  }
});

test('adaptive practice fails closed rather than creating local-only history when the durable ledger is unavailable', async () => {
  const { dom, window, calls } = await load({ noLedger: true, hardening: true });
  try {
    click(window, window.document.querySelector('[data-start-adaptive]'));
    await settle(window);
    assert.equal(calls.start, 0, 'no local fallback starts an untracked session');
    assert.equal(window.localStorage.getItem('tb-adaptive-session-v2'), null, 'no pause record is created without a durable ledger session');
    assert.equal(window.document.querySelector('[data-adaptive-opt],[data-v2-option]'), null, 'no answerable local-only question is rendered');
    assert.match(window.document.getElementById('tb-feedback-live').textContent, /secure learning storage has not loaded/i);
  } finally {
    await settle(window, 6);
    closeQuietly(dom);
  }
});

test('v1 adaptive completion stays retryable without duplicating the final answer after a failed write-ahead save', async () => {
  const submittedLengths = [];
  let firstCompletion = true;
  const { dom, window, calls } = await load({
    completeSession(payload) {
      submittedLengths.push(payload.records.length);
      const saved = !firstCompletion;
      firstCompletion = false;
      return { sessionId: 'guard-session', total: 1, correct: 1, saved };
    }
  });
  try {
    click(window, window.document.querySelector('[data-start-adaptive]'));
    await settle(window);
    click(window, window.document.querySelector('[data-adaptive-opt="1"]'));
    click(window, window.document.querySelector('[data-adaptive-check]'));
    click(window, window.document.querySelector('[data-adaptive-next]'));
    assert.equal(calls.complete, 1);
    assert.doesNotMatch(window.document.getElementById('tb-adaptive-panel').textContent, /Adaptive session complete/);

    click(window, window.document.querySelector('[data-adaptive-next]'));
    assert.equal(calls.complete, 2);
    assert.deepEqual(submittedLengths, [1, 1], 'a retry resubmits the one final record rather than appending it again');
    assert.equal(window.document.querySelector('[data-adaptive-next]'), null, 'the successful retry leaves the retryable final-question state');
  } finally {
    await settle(window, 6);
    closeQuietly(dom);
  }
});

test('hardened adaptive practice keeps the session open when completion cannot be written safely', async () => {
  const { dom, window, calls } = await load({ hardening: true, completeSaved: false });
  try {
    click(window, window.document.querySelector('[data-start-adaptive]'));
    await settle(window);
    click(window, window.document.querySelector('[data-v2-option="1"]'));
    click(window, window.document.querySelector('[data-v2-check]'));
    click(window, window.document.querySelector('[data-v2-next]'));
    await settle(window);
    assert.equal(calls.complete, 1);
    assert.ok(window.localStorage.getItem('tb-adaptive-session-v2'), 'the learner can retry completion rather than losing the session');
    assert.doesNotMatch(window.document.getElementById('tb-adaptive-panel').textContent, /Adaptive session complete/);
    assert.match(window.document.getElementById('tb-feedback-live').textContent, /waiting for a safe local save/i);
  } finally {
    await settle(window, 6);
    closeQuietly(dom);
  }
});

test('hardening resume state does not repeatedly mutate its own observed start control', async () => {
  const { dom, window } = await load({ hardening: true });
  try {
    window.localStorage.setItem('tb-adaptive-session-v2', JSON.stringify({
      version: 2, examId: 'cssbb', questionIds: ['cssbb:guard-001'], stems: ['Guarded adaptive question.'],
      index: 0, answers: {}, checked: {}, results: [], complete: false
    }));
    const overview = window.document.getElementById('tb-overview');
    overview.appendChild(window.document.createElement('i'));
    await settle(window, 6);
    const start = window.document.querySelector('[data-start-adaptive]');
    assert.equal(start.textContent, 'Resume adaptive practice');
    assert.equal(start.getAttribute('title'), 'Resume question 1 of 1');

    const mutations = [];
    const observer = new window.MutationObserver(records => mutations.push(...records));
    observer.observe(start, { childList: true, subtree: true, characterData: true, attributes: true });
    await settle(window, 10);
    observer.disconnect();
    assert.equal(mutations.length, 0, 'the observer has no self-generated text/title mutation to schedule forever');
  } finally {
    await settle(window, 6);
    closeQuietly(dom);
  }
});

test('completion guard restores a paused question by canonical ID when its wording has changed', async () => {
  let completed = null;
  const { dom, window } = await load({
    hardening: true,
    completionGuard: true,
    completeSession(payload) {
      completed = payload;
      return { sessionId: 'guard-session', total: payload.records.length, correct: 1, saved: true };
    }
  });
  try {
    const panel = window.document.getElementById('tb-adaptive-panel');
    panel.hidden = false;
    panel.innerHTML = '<button type="button" data-v2-next>Finish session</button>';
    window.localStorage.setItem('tb-adaptive-session-v2', JSON.stringify({
      version: 2, examId: 'cssbb', id: 'guard-session', learningSessionId: 'guard-session',
      questionIds: ['cssbb:guard-001'], stems: ['Superseded wording must not be needed to complete.'],
      index: 0, answers: { 0: 1 }, checked: { 0: true }, results: [], complete: false
    }));
    click(window, panel.querySelector('[data-v2-next]'));
    assert.ok(completed, 'the durable ledger completion receives the recovered answer');
    assert.equal(completed.examId, 'cssbb');
    assert.equal(completed.records.length, 1);
    assert.equal(completed.records[0].question.stem, 'Guarded adaptive question.');
  } finally {
    await settle(window, 6);
    closeQuietly(dom);
  }
});

test('completion guard keeps the paused session and final question visible when its ledger write fails', async () => {
  const { dom, window, calls } = await load({ hardening: true, completionGuard: true, completeSaved: false });
  try {
    const panel = window.document.getElementById('tb-adaptive-panel');
    panel.hidden = false;
    panel.innerHTML = '<button type="button" data-v2-next>Finish session</button>';
    window.localStorage.setItem('tb-adaptive-session-v2', JSON.stringify({
      version: 2, examId: 'cssbb', id: 'guard-session', learningSessionId: 'guard-session',
      questionIds: ['cssbb:guard-001'], stems: ['Guarded adaptive question.'],
      index: 0, answers: { 0: 1 }, checked: { 0: true }, results: [], complete: false
    }));
    click(window, panel.querySelector('[data-v2-next]'));
    assert.equal(calls.complete, 1);
    assert.ok(window.localStorage.getItem('tb-adaptive-session-v2'), 'a failed completion remains retryable');
    assert.doesNotMatch(panel.textContent, /Adaptive session complete/);
    assert.match(window.document.getElementById('tb-feedback-live').textContent, /waiting for a safe local save/i);
  } finally {
    await settle(window, 6);
    closeQuietly(dom);
  }
});

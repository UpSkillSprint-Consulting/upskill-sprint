'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const registry = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const events = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');

function settle(window, frames) {
  return new Promise(resolve => {
    function next(remaining) {
      if (!remaining) return resolve();
      window.requestAnimationFrame(() => next(remaining - 1));
    }
    next(frames || 3);
  });
}

async function load() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  dom.window.eval(registry);
  dom.window.eval(events);
  await settle(dom.window, 3);
  return { dom: dom, window: dom.window, errors: errors };
}

function click(window, element) {
  assert.ok(element, 'expected interactive control to exist');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

test('submitting a Quick Quiz records its entire 20-question session even when only one question was visited', async () => {
  const { dom, window, errors } = await load();
  try {
    const overview = window.document.getElementById('tb-overview');
    click(window, overview.querySelector('[data-mode="quick"]'));
    await settle(window, 3);

    const firstQuestionId = overview.querySelector('.tb-stem').getAttribute('data-question-id');
    const firstQuestion = window.__TBQuestionRegistry.find('cssbb', firstQuestionId);
    assert.ok(firstQuestion, 'the rendered question is resolved by canonical ID');
    click(window, overview.querySelector('[data-opt="' + firstQuestion.answer + '"]'));
    await settle(window, 1);

    const navigation = overview.querySelectorAll('[data-goto]');
    assert.equal(navigation.length, 20, 'Quick Quiz still renders its complete planned session');
    click(window, navigation[navigation.length - 1]);
    await settle(window, 1);
    click(window, overview.querySelector('[data-submit]'));
    await settle(window, 3);

    const ledger = window.__TBLearning;
    const all = ledger.eventsForExam('cssbb');
    const completed = all.filter(event => event.type === 'session_completed');
    const exposed = all.filter(event => event.type === 'question_exposed');
    const records = all.filter(event => event.type === 'answer_recorded');
    assert.equal(completed.length, 1);
    assert.equal(completed[0].payload.total, 20);
    assert.equal(completed[0].payload.correct, 1);
    assert.equal(exposed.length, 20, 'all 20 planned questions are durably marked delivered');
    assert.equal(records.length, 20, 'all 20 planned questions have a completion record, not only the two rendered screens');
    assert.equal(records.filter(event => event.payload.status === 'unanswered').length, 19);
    assert.equal(ledger.summary('cssbb').uniqueSeen, 20);
    assert.equal(ledger.summary('cssbb').answeredEvents, 1, 'unique scored answers remain distinct from delivered/session totals');
    assert.deepEqual(errors, []);
  } finally {
    dom.window.close();
  }
});

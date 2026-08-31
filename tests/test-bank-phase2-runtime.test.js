'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const phase1 = fs.readFileSync(path.join(ROOT, 'test-bank-feedback-loop.js'), 'utf8');
const phase2 = fs.readFileSync(path.join(ROOT, 'test-bank-deep-feedback.js'), 'utf8');
const grounding = fs.readFileSync(path.join(ROOT, 'test-bank-deep-feedback-grounding.js'), 'utf8');
const hardening = fs.readFileSync(path.join(ROOT, 'test-bank-phase2-hardening.js'), 'utf8');
const history = fs.readFileSync(path.join(ROOT, 'test-bank-phase2-attempt-history.js'), 'utf8');
const runtime = fs.readFileSync(path.join(ROOT, 'test-bank-phase2-runtime-coordinator.js'), 'utf8');
const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

function settle(window, frames = 5) {
  return new Promise(resolve => {
    function next(count) {
      if (!count) return resolve();
      window.requestAnimationFrame(() => next(count - 1));
    }
    next(frames);
  });
}

async function load() {
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  await installDurableLearning(dom.window);
  [phase1, phase2, grounding, hardening, history, runtime].forEach(source => dom.window.eval(source));
  await settle(dom.window);
  return dom.window;
}

function click(window, element) {
  assert.ok(element);
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function assertNoTrackedTimes(window) {
  assert.equal(Object.keys(window.__TBPhase2Runtime.getTimes()).length, 0);
}

test('grounding and hardening converge on the same complete-sentence learning point', async () => {
  const window = await load();
  const question = window.__TB.EXAMS.cssbb.sets[1].find(item => item.why && item.why.length > 80);
  const grounded = window.__TBFeedbackGrounding.literalKeyPoint(question.why);
  const hardened = window.__TBPhase2Hardening.keyPoint(question);
  assert.equal(grounded, hardened);
  assert.ok(!grounded.endsWith('…'));
});

test('runtime timing resets when a new quiz begins', async () => {
  const window = await load();
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window, 3);
  assertNoTrackedTimes(window);
  click(window, overview.querySelector('[data-backsim]'));
  await settle(window, 2);
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window, 4);
  assertNoTrackedTimes(window);
});

test('runtime labels sub-second internal navigation as unreliable rather than learner time', async () => {
  const window = await load();
  assert.equal(window.__TBPhase2Runtime.format(200), 'Not reliably tracked');
  assert.equal(window.__TBPhase2Runtime.format(1200), '1 sec');
});

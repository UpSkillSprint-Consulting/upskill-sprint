'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');

let _windows = [];
afterEach(() => { _windows.splice(0).forEach(w => { try { w.close(); } catch (e) {} }); });

function loadPage() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc
  });
  _windows.push(dom.window);
  return new Promise(res => dom.window.addEventListener('load', () => res({ window: dom.window, errors })));
}

const click = (window, el) => el.dispatchEvent(new window.Event('click', { bubbles: true }));

/* ---------- Fix 2: the formula drawer can actually be closed ---------- */

test('CSS lets the hidden attribute hide the drawer (display:flex no longer wins)', () => {
  // Root cause of the un-closable pane: .tb-drawer sets display:flex, which
  // overrode the hidden attribute. A higher-specificity rule must restore it.
  assert.match(html, /\.tb-drawer\[hidden\]\s*\{\s*display:\s*none\s*\}/);
});

test('the × control sets the drawer back to hidden', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  click(window, ov().querySelector('[data-diag]'));           // start a session
  click(window, ov().querySelector('[data-formulas]'));       // open the drawer
  const drawer = window.document.getElementById('tb-formulas');
  assert.ok(drawer && !drawer.hidden, 'drawer opens');
  click(window, drawer.querySelector('[data-close="formulas"]')); // click ×
  assert.equal(drawer.hidden, true, 'drawer is hidden again after ×');
});

/* ---------- Fix 1: certifications rail hides during a session ---------- */

test('CSS hides the rail and goes full-width in exam mode', () => {
  assert.match(html, /\.tb-shell\.exam-mode\s*\{\s*grid-template-columns:\s*1fr\s*\}/);
  assert.match(html, /\.tb-shell\.exam-mode\s+\.tb-rail\s*\{\s*display:\s*none\s*\}/);
});

test('the shell enters exam-mode when a quiz starts and leaves it on the overview', async () => {
  const { window } = await loadPage();
  const shell = window.document.querySelector('.tb-shell');
  const ov = () => window.document.getElementById('tb-overview');
  assert.equal(shell.classList.contains('exam-mode'), false, 'overview shows the rail');
  click(window, ov().querySelector('[data-diag]'));
  assert.equal(shell.classList.contains('exam-mode'), true, 'quiz hides the rail');
});

/* ---------- Fix 1: bottom-left Back to Exam Simulator button ---------- */

test('the quiz shows a Back to Exam Simulator button that returns to the overview', async () => {
  const { window } = await loadPage();
  const shell = window.document.querySelector('.tb-shell');
  const ov = () => window.document.getElementById('tb-overview');
  click(window, ov().querySelector('[data-diag]'));
  const back = ov().querySelector('[data-backsim]');
  assert.ok(back, 'back-to-simulator button exists in the quiz');
  assert.match(back.textContent, /Back to Exam Simulator/i);
  click(window, back);
  assert.equal(shell.classList.contains('exam-mode'), false, 'returns to overview (rail back)');
  assert.ok(ov().querySelector('[data-diag], [data-mode]'), 'overview is rendered again');
});

/* ---------- the page hero shows the exam being taken, not the landing intro ---------- */

test('the intro hero is replaced by the exam name during a session and restored on the overview', async () => {
  const { window } = await loadPage();
  const doc = window.document;
  const ov = () => doc.getElementById('tb-overview');
  const title = () => doc.getElementById('tb-herotitle');
  const intro = () => doc.getElementById('tb-hero').querySelector('p');
  assert.equal(title().textContent, 'Certification Test Bank', 'overview shows the landing title');
  assert.equal(intro().hidden, false, 'intro paragraph visible on the overview');
  click(window, ov().querySelector('[data-diag]'));            // start a session
  assert.equal(title().textContent, window.__TB.EXAMS.cssbb.body, 'hero now names the exam being taken');
  assert.notEqual(title().textContent, 'Certification Test Bank');
  assert.equal(intro().hidden, true, 'landing intro is hidden while taking the exam');
  click(window, ov().querySelector('[data-backsim]'));         // back to the simulator
  assert.equal(title().textContent, 'Certification Test Bank', 'intro restored on the overview');
  assert.equal(intro().hidden, false);
});

/* ---------- Fix 3: a dark / light theme toggle is present ---------- */

test('header carries exactly one site-standard theme toggle inside .header-actions', () => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const toggles = doc.querySelectorAll('.theme-toggle, [data-theme-toggle], #theme-toggle');
  assert.equal(toggles.length, 1, 'one toggle only (theme.js will not add a duplicate)');
  const actions = doc.querySelector('header.site .header-actions');
  assert.ok(actions, '.header-actions wrapper exists');
  assert.ok(actions.querySelector('.theme-toggle'), 'toggle lives in header-actions');
  assert.ok(actions.querySelector('.header-cta'), 'cta moved into header-actions (matches other pages)');
  assert.ok(actions.querySelector('label.mobile-menu-btn'), 'mobile menu button in header-actions');
  dom.window.close();
});

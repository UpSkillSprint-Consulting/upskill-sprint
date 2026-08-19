'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const mastery = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');
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

async function loadPage() {
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
  dom.window.eval(mastery);
  dom.window.eval(setControls);
  await settle(dom.window);
  return { window: dom.window, errors };
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function modeCard(window, index) {
  return window.document.querySelectorAll('#tb-overview .tb-mode')[index];
}

function markAllAttempted(window, questions) {
  const records = questions.map(question => ({ question, selected: question.answer, status: 'correct' }));
  window.__TBAdaptiveMastery.recordResults(records, 'test-seed');
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
  markAllAttempted(window, e.sets[1]);

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
  markAllAttempted(window, outsideDomain.concat(set1InDomain));

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
  markAllAttempted(window, toAttempt);

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
  markAllAttempted(window, e.sets[1].concat(e.sets[2], e.sets[3]));

  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);

  const startButton = modeCard(window, 1).querySelector('[data-mode="quick"]');
  assert.equal(startButton.disabled, true);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /attempted every question/i);

  click(window, startButton);
  await settle(window);
  assert.equal(window.document.getElementById('tb-overview').querySelector('.tb-quiz'), null, 'no quiz session was started');
});

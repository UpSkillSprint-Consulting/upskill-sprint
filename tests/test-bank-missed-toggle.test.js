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

// Marks each question wrong exactly once (a plausible "wrong option" is any option
// index other than the correct answer), which is enough to set incorrect > 0 --
// the "ever gotten wrong" definition this toggle uses.
function markSomeMissed(window, questions) {
  const records = questions.map(question => ({
    question,
    selected: question.answer === 0 ? 1 : 0,
    status: 'incorrect'
  }));
  window.__TBAdaptiveMastery.recordResults(records, 'test-seed');
}

function stemAt(window, index) {
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-goto="' + index + '"]'));
  return overview.querySelector('.tb-stem').textContent.trim();
}

test('the missed toggle is disabled by default on both cards when nothing has ever been missed', async () => {
  const { window, errors } = await loadPage();
  const quickToggle = modeCard(window, 1).querySelector('[data-missed="quick"]');
  const focusToggle = modeCard(window, 2).querySelector('[data-missed="focus"]');
  assert.ok(quickToggle && quickToggle.disabled, 'quick missed toggle starts disabled');
  assert.ok(focusToggle && focusToggle.disabled, 'focus missed toggle starts disabled');
  assert.ok(!quickToggle.classList.contains('on'));
  assert.ok(!focusToggle.classList.contains('on'));
  assert.deepEqual(errors, []);
});

test('missing a question enables the toggle on both cards', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  markSomeMissed(window, [e.sets[1][0]]);
  // Re-render is needed to re-read the store; clicking any no-op-safe control does it.
  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="20"]'));
  await settle(window);

  assert.ok(!modeCard(window, 1).querySelector('[data-missed="quick"]').disabled, 'quick toggle enabled once anything has been missed, anywhere');
  assert.ok(!modeCard(window, 2).querySelector('[data-missed="focus"]').disabled || modeCard(window, 2).querySelector('[data-focusdom]').value, 'focus toggle reflects whatever domain is currently selected');
});

test('turning on Missed for Quick Quiz does not affect the Focused Quiz toggle, and vice versa', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  markSomeMissed(window, e.sets[1].concat(e.sets[2], e.sets[3]));
  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="20"]'));
  await settle(window);

  click(window, modeCard(window, 1).querySelector('[data-missed="quick"]'));
  await settle(window);
  assert.ok(modeCard(window, 1).querySelector('[data-missed="quick"]').classList.contains('on'));
  assert.ok(!modeCard(window, 2).querySelector('[data-missed="focus"]').classList.contains('on'));
});

test('turning on Missed disables New questions only for the same card, and vice versa', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  markSomeMissed(window, e.sets[1].concat(e.sets[2], e.sets[3]));
  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="20"]'));
  await settle(window);

  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);
  assert.ok(modeCard(window, 1).querySelector('[data-unseen="quick"]').classList.contains('on'));

  click(window, modeCard(window, 1).querySelector('[data-missed="quick"]'));
  await settle(window);
  assert.ok(modeCard(window, 1).querySelector('[data-missed="quick"]').classList.contains('on'), 'missed is now on');
  assert.ok(!modeCard(window, 1).querySelector('[data-unseen="quick"]').classList.contains('on'), 'unseen was turned off by turning missed on');

  click(window, modeCard(window, 1).querySelector('[data-unseen="quick"]'));
  await settle(window);
  assert.ok(modeCard(window, 1).querySelector('[data-unseen="quick"]').classList.contains('on'), 'unseen is now on');
  assert.ok(!modeCard(window, 1).querySelector('[data-missed="quick"]').classList.contains('on'), 'missed was turned back off by turning unseen on');
});

test('Quick Quiz with Missed on draws only ever-incorrect questions, pooled across all sets, even though Set 1 is selected', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const missedPool = e.sets[2].slice(0, 5); // deliberately from Set 2, while Set 1 stays selected
  markSomeMissed(window, missedPool);
  const missedStems = new Set(missedPool.map(q => q.stem));

  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="10"]'));
  click(window, modeCard(window, 1).querySelector('[data-missed="quick"]'));
  await settle(window);

  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /previously missed question/i);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Mixed \(all sets\)/);

  click(window, modeCard(window, 1).querySelector('[data-mode="quick"]'));
  await settle(window);

  const overview = window.document.getElementById('tb-overview');
  const total = overview.querySelectorAll('.tb-navcell').length;
  assert.equal(total, 5, 'served exactly the 5 missed questions available, not padded with anything else');

  for (let i = 0; i < total; i += 1) {
    const stem = stemAt(window, i);
    assert.ok(missedStems.has(stem), 'question ' + i + ' was one of the previously-missed questions, drawn from Set 2 despite Set 1 being selected');
  }
});

test('a question that was missed once and later answered correctly still counts as historically missed', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const question = e.sets[1][0];
  markSomeMissed(window, [question]);
  // Now answer it correctly -- mastery/streak improves, but the "ever gotten wrong" flag should not clear.
  window.__TBAdaptiveMastery.recordResults([{ question, selected: question.answer, status: 'correct' }], 'test-seed');

  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="20"]'));
  await settle(window);

  const missed = window.__TBAdaptiveMastery.missedFilter([question]);
  assert.equal(missed.length, 1, 'still counted as historically missed even after a later correct answer');
});

test('Focused Quiz with Missed on filters to the selected Body of Knowledge area', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const domainOf = subId => {
    for (const area of e.bok) if (area.subs.some(s => s.id === subId)) return area.domain;
    return null;
  };
  const allQuestions = e.sets[1].concat(e.sets[2], e.sets[3]);
  const targetDomain = e.bok[0].domain;
  const otherDomainQ = allQuestions.find(q => domainOf(q.sub) !== targetDomain);
  const inDomainMissed = allQuestions.filter(q => domainOf(q.sub) === targetDomain).slice(0, 4);

  markSomeMissed(window, inDomainMissed.concat([otherDomainQ]));

  const sel = modeCard(window, 2).querySelector('[data-focusdom]');
  sel.value = targetDomain;
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  click(window, modeCard(window, 2).querySelector('[data-count="focus"][data-n="10"]'));
  click(window, modeCard(window, 2).querySelector('[data-missed="focus"]'));
  await settle(window);

  click(window, modeCard(window, 2).querySelector('[data-mode="focus"]'));
  await settle(window);

  const overview = window.document.getElementById('tb-overview');
  const total = overview.querySelectorAll('.tb-navcell').length;
  assert.equal(total, 4, 'only the 4 in-domain missed questions were served, not the out-of-domain one');

  const inDomainMissedStems = new Set(inDomainMissed.map(q => q.stem));
  for (let i = 0; i < total; i += 1) {
    assert.ok(inDomainMissedStems.has(stemAt(window, i)), 'question ' + i + ' was a missed question from the selected domain');
  }
});

test('when fewer missed questions remain than requested, it serves the smaller count with a note', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const missedPool = e.sets[1].slice(0, 3);
  markSomeMissed(window, missedPool);

  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="10"]'));
  click(window, modeCard(window, 1).querySelector('[data-missed="quick"]'));
  await settle(window);

  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Only 3 missed question/);

  click(window, modeCard(window, 1).querySelector('[data-mode="quick"]'));
  await settle(window);
  const total = window.document.querySelectorAll('#tb-overview .tb-navcell').length;
  assert.equal(total, 3, 'served only the 3 available missed questions rather than padding with unmissed ones');
});

test('switching Focused Quiz to a domain with zero missed questions disables Start but does not strand the toggle', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  const domainOf = subId => {
    for (const area of e.bok) if (area.subs.some(s => s.id === subId)) return area.domain;
    return null;
  };
  const targetDomain = e.bok[0].domain;
  const otherDomain = e.bok.find(d => d.domain !== targetDomain).domain;
  const inTargetDomain = e.sets[1].concat(e.sets[2], e.sets[3]).filter(q => domainOf(q.sub) === targetDomain).slice(0, 3);
  markSomeMissed(window, inTargetDomain); // missed only exists in targetDomain, none in otherDomain

  const sel = modeCard(window, 2).querySelector('[data-focusdom]');
  sel.value = targetDomain;
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  click(window, modeCard(window, 2).querySelector('[data-missed="focus"]'));
  await settle(window);
  assert.ok(modeCard(window, 2).querySelector('[data-missed="focus"]').classList.contains('on'), 'enabled while targetDomain has missed questions');

  // Now switch to a domain with zero missed questions while the toggle is still on.
  sel.value = otherDomain;
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  await settle(window);

  const toggle = modeCard(window, 2).querySelector('[data-missed="focus"]');
  assert.ok(toggle.classList.contains('on'), 'still shows as on for the newly selected empty domain');
  assert.equal(toggle.disabled, false, 'stays clickable so the user can turn it back off -- not stranded');
  assert.equal(modeCard(window, 2).querySelector('[data-mode="focus"]').disabled, true, 'Start is correctly disabled since nothing matches in this domain');

  // Confirm the escape hatch actually works.
  click(window, toggle);
  await settle(window);
  assert.ok(!modeCard(window, 2).querySelector('[data-missed="focus"]').classList.contains('on'), 'clicking it while stuck successfully turns it off');
  assert.equal(modeCard(window, 2).querySelector('[data-mode="focus"]').disabled, false, 'Start re-enables once the filter is off');
});

test('when the missed pool is fully covered by the request count and then reset, Start is disabled and no session begins for zero-remaining', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  // No missed questions seeded at all -- toggle stays disabled, but verify a defensive
  // click still does nothing (in case a disabled button's click somehow gets dispatched).
  const toggle = modeCard(window, 1).querySelector('[data-missed="quick"]');
  assert.equal(toggle.disabled, true);
  click(window, toggle);
  await settle(window);
  assert.ok(!toggle.classList.contains('on'), 'a click on a disabled toggle has no effect');
});

test('test-bank-set-controls.js does not overwrite the missed-only summary text or leave the per-card Set picker enabled', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  markSomeMissed(window, e.sets[2].slice(0, 3));
  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="20"]')); // force a re-render to pick up the freshly-seeded data
  await settle(window);

  click(window, modeCard(window, 1).querySelector('[data-missed="quick"]'));
  await settle(window);

  const summary = modeCard(window, 1).querySelector('.tb-mode-sum').textContent;
  assert.match(summary, /previously missed question/i, 'set-controls.js did not stomp the core script\'s summary text');
  assert.doesNotMatch(summary, /^Random \d+ questions from Set/, 'did not fall back to the generic per-Set summary');

  const setButtons = modeCard(window, 1).querySelectorAll('[data-quiz-set="quick"]');
  assert.ok(setButtons.length > 0, 'the per-card Set picker was still injected');
  setButtons.forEach(button => {
    assert.equal(button.disabled, true, 'Set buttons are disabled while Missed questions only is on, same as New questions only');
    assert.match(button.title, /Missed questions only/, 'tooltip explains why, specifically naming Missed questions only');
  });
});

// --- Cross-cutting interactions -----------------------------------------------

test('switching exams while Missed questions only is on resets it explicitly, not by accident of undefined being falsy', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  markSomeMissed(window, e.sets[1].slice(0, 3));
  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="10"]'));
  await settle(window);
  click(window, modeCard(window, 1).querySelector('[data-missed="quick"]'));
  await settle(window);
  assert.ok(modeCard(window, 1).querySelector('[data-missed="quick"]').classList.contains('on'), 'on for cssbb');

  const cqeTile = window.document.querySelector('.tb-tile[data-exam="cqe"]');
  assert.ok(cqeTile, 'a second exam exists to switch to');
  click(window, cqeTile);
  await settle(window);

  const toggle = modeCard(window, 1).querySelector('[data-missed="quick"]');
  assert.ok(!toggle.classList.contains('on'), 'resets to off for the newly selected exam');
  assert.ok(toggle.disabled, 'disabled since cqe has no missed-question history of its own');
  assert.doesNotMatch(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /missed/i, 'no leaked cssbb-specific missed-question state or messaging');
});

test('resetting adaptive data while Missed questions only is on disables Start but does not crash or duplicate anything', async () => {
  const { window } = await loadPage();
  window.eval(fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-hardening.js'), 'utf8'));
  const e = window.__TB.EXAMS.cssbb;
  markSomeMissed(window, e.sets[1].slice(0, 3));
  window.localStorage.setItem('tb-adaptive-cssbb', JSON.stringify({ attempts: 3, lastReadiness: 91, subState: {} }));
  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="10"]'));
  await settle(window);
  click(window, modeCard(window, 1).querySelector('[data-missed="quick"]'));
  await settle(window);
  assert.ok(modeCard(window, 1).querySelector('[data-missed="quick"]').classList.contains('on'));

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);
  const resetBtn = window.document.querySelector('[data-v2-reset]');
  assert.ok(resetBtn, 'reset control is reachable');
  click(window, resetBtn); // arm
  await settle(window);
  click(window, resetBtn); // confirm
  await settle(window);

  click(window, modeCard(window, 1).querySelector('[data-count="quick"][data-n="20"]')); // force a re-render
  await settle(window);

  const toggle = modeCard(window, 1).querySelector('[data-missed="quick"]');
  assert.ok(!toggle.disabled, 'stays clickable so the user is never stranded, matching the Focused Quiz escape-hatch fix');
  assert.equal(modeCard(window, 1).querySelector('[data-mode="quick"]').disabled, true, 'Start correctly disabled since nothing remains after the reset');
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /No previously missed questions/i);
});

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

const windows = [];
afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

async function loadPage(options = {}) {
  const errors = [];
  const intervals = [];
  const clearedIntervals = [];
  let now = options.now || 2_000_000_000_000;
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));

  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.Date.now = () => now;
      window.setInterval = callback => {
        intervals.push(callback);
        return intervals.length;
      };
      window.clearInterval = id => clearedIntervals.push(id);
    }
  });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));

  return {
    window: dom.window,
    errors,
    intervals,
    clearedIntervals,
    advanceTime(milliseconds) { now += milliseconds; }
  };
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function keydown(window, element, key) {
  element.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true }));
}

function modeCard(window, kind) {
  const index = { full: 0, quick: 1, focus: 2 }[kind];
  return window.document.querySelectorAll('#tb-overview .tb-mode')[index];
}

function timingButton(window, kind, timed) {
  return modeCard(window, kind).querySelector(
    '[data-timing-kind="' + kind + '"][data-timed="' + (timed ? '1' : '0') + '"]'
  );
}

function selectedTiming(window, kind) {
  return modeCard(window, kind).querySelector('[data-timing-kind="' + kind + '"][aria-pressed="true"]');
}

function exitQuiz(window) {
  click(window, window.document.querySelector('#tb-overview [data-quit]'));
}

test('Full Exam keeps its timed default while Quick and Focused default independently to untimed', async () => {
  const { window, errors } = await loadPage();

  assert.equal(selectedTiming(window, 'full').textContent, 'Timed');
  assert.equal(selectedTiming(window, 'quick').textContent, 'Untimed');
  assert.equal(selectedTiming(window, 'focus').textContent, 'Untimed');
  assert.equal(timingButton(window, 'quick', false).classList.contains('on'), true);
  assert.equal(timingButton(window, 'focus', false).classList.contains('on'), true);
  assert.deepEqual(errors, []);
});

test('Timed and Untimed switching is bidirectional, keyboard-accessible, and isolated by quiz type', async () => {
  const { window } = await loadPage();

  click(window, timingButton(window, 'quick', true));
  assert.equal(selectedTiming(window, 'quick').textContent, 'Timed');
  assert.equal(selectedTiming(window, 'focus').textContent, 'Untimed');

  click(window, timingButton(window, 'quick', false));
  assert.equal(selectedTiming(window, 'quick').textContent, 'Untimed');

  keydown(window, timingButton(window, 'focus', false), 'ArrowLeft');
  await new Promise(resolve => window.requestAnimationFrame(resolve));
  assert.equal(selectedTiming(window, 'focus').textContent, 'Timed');
  assert.equal(selectedTiming(window, 'quick').textContent, 'Untimed');
  assert.equal(window.document.activeElement.getAttribute('data-timing-kind'), 'focus');
  assert.equal(window.document.activeElement.getAttribute('data-timed'), '1');

  keydown(window, window.document.activeElement, 'End');
  await new Promise(resolve => window.requestAnimationFrame(resolve));
  assert.equal(selectedTiming(window, 'focus').textContent, 'Untimed');
});

test('the centralized exam-paced policy calculates and formats every supported question count', async () => {
  const { window } = await loadPage();
  const api = window.__TB;
  const exam = api.EXAMS.cssbb;
  const expected = new Map([
    [10, [982, '16 min 22 sec']],
    [20, [1964, '32 min 44 sec']],
    [30, [2945, '49 min 05 sec']],
    [50, [4909, '1 hr 21 min 49 sec']]
  ]);

  for (const [count, [seconds, label]] of expected) {
    assert.equal(api.quizDurationSeconds(exam, count), seconds);
    assert.equal(api.fmtQuizDuration(seconds), label);
    click(window, modeCard(window, 'quick').querySelector('[data-count="quick"][data-n="' + count + '"]'));
    click(window, timingButton(window, 'quick', true));
    assert.match(modeCard(window, 'quick').querySelector('.tb-mode-sum').textContent, new RegExp('Timed: ' + label));
  }
});

test('Set, count, area, New-only, and Missed-only changes do not reset either timing preference', async () => {
  const { window } = await loadPage();
  window.eval(mastery);
  const exam = window.__TB.EXAMS.cssbb;
  const wrongRecords = exam.sets[1].concat(exam.sets[2], exam.sets[3]).map(question => ({
    question,
    selected: question.answer === 0 ? 1 : 0,
    status: 'incorrect'
  }));
  window.__TBAdaptiveMastery.recordResults(wrongRecords, 'timing-state-test');

  click(window, timingButton(window, 'quick', true));
  click(window, timingButton(window, 'focus', true));
  click(window, window.document.querySelector('.tb-setpick [data-set="3"]'));
  click(window, modeCard(window, 'quick').querySelector('[data-count="quick"][data-n="50"]'));

  const area = modeCard(window, 'focus').querySelector('[data-focusdom]');
  area.value = area.options[1].value;
  area.dispatchEvent(new window.Event('change', { bubbles: true }));
  click(window, modeCard(window, 'focus').querySelector('[data-count="focus"][data-n="30"]'));
  click(window, modeCard(window, 'quick').querySelector('[data-unseen="quick"]'));
  click(window, modeCard(window, 'quick').querySelector('[data-missed="quick"]'));
  click(window, modeCard(window, 'focus').querySelector('[data-unseen="focus"]'));
  click(window, modeCard(window, 'focus').querySelector('[data-missed="focus"]'));

  assert.equal(selectedTiming(window, 'quick').textContent, 'Timed');
  assert.equal(selectedTiming(window, 'focus').textContent, 'Timed');
  assert.ok(window.document.querySelector('.tb-setpick [data-set="3"].on'));
  assert.ok(modeCard(window, 'quick').querySelector('[data-count="quick"][data-n="50"].on'));
  assert.ok(modeCard(window, 'focus').querySelector('[data-count="focus"][data-n="30"].on'));
  assert.equal(modeCard(window, 'focus').querySelector('[data-focusdom]').value, area.options[1].value);
});

test('Quick and Focused pass the selected timing mode into the existing session timer', async () => {
  const { window, intervals } = await loadPage();

  click(window, timingButton(window, 'quick', true));
  click(window, modeCard(window, 'quick').querySelector('[data-mode="quick"]'));
  assert.equal(window.document.querySelectorAll('#tb-overview .tb-navcell').length, 20);
  assert.equal(window.document.querySelector('#tb-overview #tb-timer').textContent, '32:44');
  assert.equal(intervals.length, 1, 'timed Quick Quiz starts the shared countdown');
  exitQuiz(window);

  click(window, timingButton(window, 'focus', true));
  click(window, timingButton(window, 'focus', false));
  click(window, modeCard(window, 'focus').querySelector('[data-mode="focus"]'));
  assert.ok(window.document.querySelector('#tb-overview .tb-timer.untimed'));
  assert.equal(intervals.length, 1, 'untimed Focused Quiz does not create another interval');
});

test('Full Exam retains both its existing timed and untimed session behavior', async () => {
  const { window, intervals } = await loadPage();

  click(window, modeCard(window, 'full').querySelector('[data-mode="full"]'));
  assert.ok(window.document.querySelector('#tb-overview #tb-timer'));
  assert.equal(intervals.length, 1, 'default timed Full Exam starts the countdown');
  exitQuiz(window);

  click(window, timingButton(window, 'full', false));
  click(window, modeCard(window, 'full').querySelector('[data-mode="full"]'));
  assert.ok(window.document.querySelector('#tb-overview .tb-timer.untimed'));
  assert.equal(intervals.length, 1, 'untimed Full Exam does not start a new countdown');
});

test('timed quizzes use the existing expiration submission path while untimed quizzes never expire', async () => {
  const timed = await loadPage();
  click(timed.window, timingButton(timed.window, 'quick', true));
  click(timed.window, modeCard(timed.window, 'quick').querySelector('[data-count="quick"][data-n="10"]'));
  click(timed.window, modeCard(timed.window, 'quick').querySelector('[data-mode="quick"]'));
  assert.ok(timed.window.document.querySelector('#tb-overview .tb-quiz'));
  timed.advanceTime(983_000);
  timed.intervals.at(-1)();
  assert.ok(timed.window.document.querySelector('#tb-overview .tb-reshead'), 'time expiry submitted through the standard results flow');

  const untimed = await loadPage();
  click(untimed.window, modeCard(untimed.window, 'quick').querySelector('[data-count="quick"][data-n="10"]'));
  click(untimed.window, modeCard(untimed.window, 'quick').querySelector('[data-mode="quick"]'));
  untimed.advanceTime(24 * 60 * 60 * 1000);
  assert.equal(untimed.intervals.length, 0, 'untimed session has no expiration interval');
  assert.ok(untimed.window.document.querySelector('#tb-overview .tb-quiz'), 'untimed quiz remains active after arbitrary elapsed time');
  assert.ok(untimed.window.document.querySelector('#tb-overview .tb-timer.untimed'));
});

test('New-only and Missed-only filters keep working in both timing modes', async () => {
  const { window, intervals } = await loadPage();
  window.eval(mastery);
  const exam = window.__TB.EXAMS.cssbb;
  const all = exam.sets[1].concat(exam.sets[2], exam.sets[3]);
  const seenSubs = new Set();
  const missedSeed = all.filter(question => {
    if (seenSubs.has(question.sub)) return false;
    seenSubs.add(question.sub);
    return true;
  });
  window.__TBAdaptiveMastery.recordResults(missedSeed.map(question => ({
    question,
    selected: question.answer === 0 ? 1 : 0,
    status: 'incorrect'
  })), 'timing-filter-test');
  click(window, modeCard(window, 'quick').querySelector('[data-count="quick"][data-n="10"]'));

  click(window, modeCard(window, 'quick').querySelector('[data-unseen="quick"]'));
  click(window, timingButton(window, 'quick', true));
  click(window, modeCard(window, 'quick').querySelector('[data-mode="quick"]'));
  assert.ok(window.document.querySelector('#tb-overview #tb-timer'), 'timed New-only quiz uses a countdown');
  assert.ok(window.document.querySelectorAll('#tb-overview .tb-navcell').length > 0);
  exitQuiz(window);

  click(window, timingButton(window, 'quick', false));
  click(window, modeCard(window, 'quick').querySelector('[data-mode="quick"]'));
  assert.ok(window.document.querySelector('#tb-overview .tb-timer.untimed'), 'untimed New-only quiz stays untimed');
  exitQuiz(window);

  click(window, modeCard(window, 'focus').querySelector('[data-missed="focus"]'));
  click(window, timingButton(window, 'focus', true));
  click(window, modeCard(window, 'focus').querySelector('[data-mode="focus"]'));
  assert.ok(window.document.querySelector('#tb-overview #tb-timer'), 'timed Missed-only focused quiz uses a countdown');
  exitQuiz(window);

  click(window, timingButton(window, 'focus', false));
  click(window, modeCard(window, 'focus').querySelector('[data-mode="focus"]'));
  assert.ok(window.document.querySelector('#tb-overview .tb-timer.untimed'), 'untimed Missed-only focused quiz stays untimed');
  assert.equal(intervals.length, 2, 'only the two timed filtered sessions created countdowns');
});

test('a reduced filtered pool recalculates both helper text and countdown from the questions actually served', async () => {
  const { window, intervals } = await loadPage();
  window.eval(mastery);
  const exam = window.__TB.EXAMS.cssbb;
  const missed = exam.sets[1].slice(0, 3);
  window.__TBAdaptiveMastery.recordResults(missed.map(question => ({
    question,
    selected: question.answer === 0 ? 1 : 0,
    status: 'incorrect'
  })), 'reduced-pool-timing-test');

  // Re-render once so the filter availability reflects the newly seeded history.
  click(window, modeCard(window, 'quick').querySelector('[data-count="quick"][data-n="10"]'));
  click(window, modeCard(window, 'quick').querySelector('[data-missed="quick"]'));
  click(window, timingButton(window, 'quick', true));

  const summary = modeCard(window, 'quick').querySelector('.tb-mode-sum').textContent;
  assert.match(summary, /Only 3 missed questions remain/);
  assert.match(summary, /Timed: 4 min 55 sec/);

  click(window, modeCard(window, 'quick').querySelector('[data-mode="quick"]'));
  assert.equal(window.document.querySelectorAll('#tb-overview .tb-navcell').length, 3);
  assert.equal(window.document.querySelector('#tb-overview #tb-timer').textContent, '4:55');
  assert.equal(intervals.length, 1);
});

test('every supported count starts with the centralized countdown for the questions actually served', async () => {
  const { window } = await loadPage();
  const api = window.__TB;
  const exam = api.EXAMS.cssbb;
  const expected = new Map([
    [10, '16:22'],
    [20, '32:44'],
    [30, '49:05'],
    [50, '1:21:49']
  ]);

  for (const kind of ['quick', 'focus']) {
    click(window, timingButton(window, kind, true));
    for (const [count, timer] of expected) {
      click(window, modeCard(window, kind).querySelector('[data-count="' + kind + '"][data-n="' + count + '"]'));
      const summary = modeCard(window, kind).querySelector('.tb-mode-sum').textContent;
      click(window, modeCard(window, kind).querySelector('[data-mode="' + kind + '"]'));
      const served = window.document.querySelectorAll('#tb-overview .tb-navcell').length;
      const seconds = api.quizDurationSeconds(exam, served);
      const expectedTimer = kind === 'quick' ? timer : api.fmtClock(seconds);
      assert.equal(window.document.querySelector('#tb-overview #tb-timer').textContent, expectedTimer, kind + ' ' + count);
      assert.match(summary, new RegExp('Timed: ' + api.fmtQuizDuration(seconds)));
      if (served < count) assert.match(summary, new RegExp('Only ' + served + ' questions are available'));
      exitQuiz(window);
    }
  }
});

test('exiting timed sessions clears their intervals and stale ticks cannot submit a later untimed quiz', async () => {
  const { window, intervals, clearedIntervals, advanceTime } = await loadPage();

  click(window, timingButton(window, 'quick', true));
  click(window, modeCard(window, 'quick').querySelector('[data-mode="quick"]'));
  assert.equal(intervals.length, 1);
  const staleTick = intervals[0];
  exitQuiz(window);
  assert.ok(clearedIntervals.includes(1));

  click(window, modeCard(window, 'focus').querySelector('[data-mode="focus"]'));
  assert.ok(window.document.querySelector('#tb-overview .tb-timer.untimed'));
  advanceTime(24 * 60 * 60 * 1000);
  staleTick();
  assert.ok(window.document.querySelector('#tb-overview .tb-quiz'));
  assert.ok(window.document.querySelector('#tb-overview .tb-timer.untimed'));
  assert.equal(window.document.querySelector('#tb-overview .tb-reshead'), null);
});

test('stress matrix covers all sets, counts, timing modes, and multiple focused areas without corrupting state', async () => {
  const { window } = await loadPage();
  const setValues = ['1', '2', '3', 'mix'];
  const counts = [10, 20, 30, 50];
  const timingModes = [false, true];

  for (const setValue of setValues) {
    for (const count of counts) {
      for (const timed of timingModes) {
        click(window, window.document.querySelector('.tb-setpick [data-set="' + setValue + '"]'));
        click(window, modeCard(window, 'quick').querySelector('[data-count="quick"][data-n="' + count + '"]'));
        click(window, timingButton(window, 'quick', timed));
        click(window, modeCard(window, 'quick').querySelector('[data-mode="quick"]'));
        assert.equal(window.document.querySelectorAll('#tb-overview .tb-navcell').length, count);
        assert.equal(Boolean(window.document.querySelector('#tb-overview #tb-timer')), timed);
        exitQuiz(window);
        assert.equal(selectedTiming(window, 'focus').textContent, 'Untimed', 'Quick timing never leaked into Focused');
      }
    }
  }

  const focusAreas = Array.from(modeCard(window, 'focus').querySelector('[data-focusdom]').options)
    .slice(0, 3)
    .map(option => option.value);
  for (const setValue of setValues) {
    for (const areaValue of focusAreas) {
      for (const count of counts) {
        for (const timed of timingModes) {
          click(window, window.document.querySelector('.tb-setpick [data-set="' + setValue + '"]'));
          const area = modeCard(window, 'focus').querySelector('[data-focusdom]');
          area.value = areaValue;
          area.dispatchEvent(new window.Event('change', { bubbles: true }));
          click(window, modeCard(window, 'focus').querySelector('[data-count="focus"][data-n="' + count + '"]'));
          click(window, timingButton(window, 'focus', timed));
          click(window, modeCard(window, 'focus').querySelector('[data-mode="focus"]'));
          const served = window.document.querySelectorAll('#tb-overview .tb-navcell').length;
          assert.ok(served > 0 && served <= count, 'focused session serves the selected area up to the requested count');
          assert.equal(Boolean(window.document.querySelector('#tb-overview #tb-timer')), timed);
          exitQuiz(window);
        }
      }
    }
  }
});

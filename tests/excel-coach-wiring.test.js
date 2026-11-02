'use strict';
/**
 * Excel Coach page wiring, driven through the real lesson page in jsdom.
 * Covers the checkAnswer path and its local logger, escaping of learner text in the
 * coach chat, the shared hint ladder, and the coach-off comparison cohort.
 * Run with: node --test tests/excel-coach-wiring.test.js
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('lessons/power-bi-excel-sql/excel-formula-fluency.html', 'utf8');

// Boot every script on the page in document order, as one program so the scripts share
// top-level bindings the way classic scripts do in a browser. Local src files are read from the repo.
function boot(storage = {}) {
  const dom = new JSDOM(html, { url: 'https://sprint.example/lesson', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  w.scrollTo = () => {};
  w.Element.prototype.scrollIntoView = () => {};
  let program = '';
  for (const s of w.document.scripts) {
    const src = s.getAttribute('src');
    if (src) {
      if (!src.startsWith('/') || !fs.existsSync('.' + src)) continue;
      program += '\n;' + fs.readFileSync('.' + src, 'utf8') + '\n';
    } else program += '\n;' + s.textContent + '\n';
  }
  program += '\n;window.__test={challenges,get state(){return state;}};';
  w.eval(program);
  const el = id => w.document.getElementById(id);
  const log = () => JSON.parse(w.localStorage.getItem('excelCoachChallengeLog') || '[]');
  const tick = (ms = 20) => new Promise(r => w.setTimeout(r, ms));
  return { dom, w, el, log, tick, t: w.__test };
}

function pick(h, i) {
  const btn = h.el('challengeList').querySelectorAll('button')[i];
  assert.ok(btn, `challenge button ${i} exists`);
  btn.click();
  assert.equal(h.t.state.current, i);
  return h.t.challenges[i];
}

test('checkAnswer logs a wrong then a correct attempt locally, without formula text', async () => {
  const h = boot();
  try {
    await h.tick();
    const c = pick(h, 0);
    const wrong = '=SUM(ZZ1:ZZ2)';
    h.el('formulaInput').value = wrong;
    h.el('checkAnswer').click();
    assert.ok(h.el('feedback').classList.contains('error'));
    let rows = h.log().filter(r => r.challengeIdx === 0);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].correct, false);
    assert.equal(rows[0].attempts, 1);
    assert.equal(rows[0].coachOn, true);
    assert.equal(rows[0].tFirstCorrect, undefined);
    assert.equal(h.el('correctCount').textContent, '0');

    h.el('formulaInput').value = c.a[0];
    h.el('checkAnswer').click();
    assert.ok(h.el('feedback').classList.contains('success'));
    rows = h.log().filter(r => r.challengeIdx === 0);
    assert.equal(rows.length, 1, 'one row per challenge');
    assert.equal(rows[0].correct, true);
    assert.equal(rows[0].attempts, 2);
    assert.equal(rows[0].level, c.l);
    assert.ok(Number.isFinite(rows[0].tFirstCorrect) && rows[0].tFirstCorrect >= rows[0].tStart);
    assert.equal(h.el('correctCount').textContent, '1');
    const raw = h.w.localStorage.getItem('excelCoachChallengeLog');
    assert.ok(!raw.includes('ZZ1') && !raw.includes(c.a[0]), 'the logger never stores formula text');
  } finally { h.dom.window.close(); }
});

test('coach chat shows learner markup as text and never builds elements from it', async () => {
  const h = boot();
  try {
    await h.tick();
    h.w.P3.openCoach();
    const attack = '<img src=x onerror="window.__pwned=1"><script>window.__pwned=2</script>';
    h.el('coachInput').value = attack;
    h.el('sendCoach').click();
    await h.tick(50);
    const box = h.el('coachMessages');
    assert.equal(box.querySelectorAll('img,script').length, 0, 'no element is created from learner text');
    const mine = [...box.querySelectorAll('.coach-message.user')].pop();
    assert.ok(mine && mine.textContent.includes(attack), 'the learner text is shown literally');
    assert.equal(h.w.__pwned, undefined);
    const reply = [...box.querySelectorAll('.coach-message.assistant')].pop();
    assert.ok(reply && reply.textContent.length > 0 && !/\[object Promise\]/.test(reply.textContent), 'a plain-string reply is rendered');
  } finally { h.dom.window.close(); }
});

test('Hint button and coach chat climb one shared hint ladder, cleared by a correct answer', async () => {
  const h = boot();
  try {
    await h.tick();
    const c = pick(h, 0);
    const E = h.w.ExcelCoachEngine;
    const ladder = () => h.t.state.phase3.coach.hintLevels;
    h.el('showHint').click();
    assert.equal(h.el('feedback').textContent.trim(), E.progressiveHint('', 0, c).trim());
    assert.equal(ladder()['0'], 1);

    h.w.P3.openCoach();
    h.el('coachInput').value = 'give me one hint';
    h.el('sendCoach').click();
    await h.tick(50);
    const reply = [...h.el('coachMessages').querySelectorAll('.coach-message.assistant')].pop().textContent;
    assert.ok(reply.includes(E.progressiveHint('', 1, c)), 'the chat continues from the Hint button step');
    assert.equal(ladder()['0'], 2);

    h.el('showHint').click();
    assert.equal(h.el('feedback').textContent.trim(), E.progressiveHint('', 2, c).trim());
    assert.equal(ladder()['0'], 2, 'the ladder stops at the last step');
    assert.equal(h.t.state._hintStep, undefined, 'no second counter');
    h.el('coachInput').value = 'one more hint please';
    h.el('sendCoach').click();
    await h.tick(50);
    assert.equal(ladder()['0'], 2, 'the chat stops at the same last step');

    h.el('formulaInput').value = c.a[0];
    h.el('checkAnswer').click();
    assert.equal(ladder()['0'], undefined, 'a correct answer resets the ladder');
  } finally { h.dom.window.close(); }
});

test('coach-off cohort hides every coach entry point until the learner switches on', async () => {
  const h = boot({ excelCoachExperiment: 'on', excelCoachCohort: 'off' });
  try {
    await h.tick();
    assert.equal(h.el('coachFab').style.display, 'none');
    assert.equal(h.el('openCoachSection').style.display, 'none');
    assert.equal(h.el('excel-coach').style.display, 'none');
    const note = h.el('coachExperimentNote');
    assert.ok(note && /coach-off comparison/.test(note.textContent));
    h.w.P3.openCoach();
    assert.equal(h.el('coachDialog').hasAttribute('open'), false, 'the coach cannot be opened while off');

    pick(h, 0);
    h.el('formulaInput').value = '=SUM(ZZ1:ZZ2)';
    h.el('checkAnswer').click();
    assert.equal(h.log().find(r => r.challengeIdx === 0).coachOn, false);

    h.el('coachSwitchOn').click();
    assert.equal(h.el('coachFab').style.display, '');
    assert.equal(h.el('excel-coach').style.display, '');
    assert.equal(h.el('coachExperimentNote'), null);
    assert.equal(h.w.localStorage.getItem('excelCoachCrossover'), '1');
    assert.ok(h.log().some(r => r.challengeIdx === 'crossover' && r.crossover === true));
    h.w.P3.openCoach();
    assert.equal(h.el('coachDialog').hasAttribute('open'), true);
  } finally { h.dom.window.close(); }
});

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

let _windows = [];
afterEach(() => { _windows.splice(0).forEach(w => { try { w.close(); } catch (e) {} }); });

async function loadPage() {
  const vc = new VirtualConsole();
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank.html', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
  _windows.push(dom.window);
  await new Promise(res => dom.window.addEventListener('load', res));
  await installDurableLearning(dom.window);
  return dom.window;
}
const click = (w, el) => el.dispatchEvent(new w.Event('click', { bubbles: true }));
const ov = w => w.document.getElementById('tb-overview');

/* ---------- Set 2 exists as a second 165-question pool ---------- */

test('CSSBB now carries two 165-question sets; Set 1 is unchanged and is still e.bank', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cssbb;
  assert.ok(e.sets && e.sets[1] && e.sets[2], 'both sets registered');
  assert.equal(e.sets[1], e.bank, 'Set 1 remains the canonical e.bank');
  assert.equal(e.sets[1].length, 165);
  assert.equal(e.sets[2].length, 165, 'Set 2 has a full 165 questions');
  // Set 2 distribution (thin generator domains capped at their unique-stem yield,
  // shortfall redistributed into the larger BoK domains to keep all 165 unique)
  const d = {}; e.sets[2].forEach(q => { d[q.sub] = (d[q.sub] || 0) + 1; });
  assert.deepEqual(d, { p1: 12, p2: 9, tm: 12, def: 25, mea: 30, ana: 27, imp: 20, con: 21, dfss: 9 });
  e.sets[2].forEach((q, i) => {
    assert.equal(q.set, 2, 'q ' + i + ' tagged set 2');
    assert.equal(q.options.length, 4, 'q ' + i + ' has four options');
    assert.ok(q.answer >= 0 && q.answer <= 3, 'q ' + i + ' answer in range');
    assert.equal(new Set(q.options).size, 4, 'q ' + i + ' options unique');
  });
  assert.equal(new Set(e.sets[2].map(q => q.stem)).size, 165, 'all 165 Set-2 stems are unique');
});

test('Set 1 and Set 2 are disjoint in content', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cssbb;
  const s1 = new Set(e.sets[1].map(q => q.stem));
  const overlap = e.sets[2].filter(q => s1.has(q.stem));
  assert.equal(overlap.length, 0, 'no shared stems between the two sets');
});

/* ---------- the selector routes which pool you practise ---------- */

test('the overview shows a four-way set selector defaulting to Set 1', async () => {
  const w = await loadPage();
  const btns = ov(w).querySelectorAll('[data-set]');
  assert.equal(btns.length, 4, 'Set 1 / Set 2 / Set 3 / Mixed');
  const vals = Array.from(btns).map(b => b.dataset.set);
  assert.deepEqual(vals, ['1', '2', '3', 'mix']);
  const on = ov(w).querySelector('[data-set].on');
  assert.equal(on.dataset.set, '1', 'defaults to Set 1');
  // Mixed advertises the pooled size across all three sets (165 + 165 + 696)
  assert.match(ov(w).querySelector('[data-set="mix"]').textContent, /1024/);
});

async function stemAfterSelecting(setVal) {
  const w = await loadPage();
  click(w, ov(w).querySelector('[data-set="' + setVal + '"]'));   // choose the set
  click(w, ov(w).querySelector('[data-diag]'));                    // start a session from that pool
  return { w, stem: ov(w).querySelector('.tb-stem').textContent };
}

test('choosing Set 2 draws questions from Set 2 only', async () => {
  const { w, stem } = await stemAfterSelecting('2');
  const e = w.__TB.EXAMS.cssbb;
  const inS2 = e.sets[2].some(q => q.stem === stem);
  const inS1 = e.sets[1].some(q => q.stem === stem);
  assert.ok(inS2 && !inS1, 'first Set-2 question is from Set 2, not Set 1');
});

test('choosing Set 1 draws questions from Set 1 only', async () => {
  const { w, stem } = await stemAfterSelecting('1');
  const e = w.__TB.EXAMS.cssbb;
  assert.ok(e.sets[1].some(q => q.stem === stem) && !e.sets[2].some(q => q.stem === stem));
});

/* ---------- a full exam is always 165, even from the mixed 495-pool ---------- */

async function fullExamCount(w, setVal) {
  click(w, ov(w).querySelector('[data-set="' + setVal + '"]'));
  click(w, ov(w).querySelector('[data-mode="full"]'));
  return ov(w).querySelectorAll('.tb-navcell').length;
}

test('a full exam is capped at 165 questions for every set choice', async () => {
  assert.equal(await fullExamCount(await loadPage(), '1'), 165, 'Set 1 full exam');
  assert.equal(await fullExamCount(await loadPage(), '2'), 165, 'Set 2 full exam');
  assert.equal(await fullExamCount(await loadPage(), 'mix'), 165, 'Mixed full exam still 165 (from 495)');
});

/* ---------- scoring is over the questions presented, so mixed is not diluted ---------- */

test('subAgg tallies only the questions passed to it (per-presented, not per-bank)', async () => {
  const w = await loadPage();
  const items = [{ sub: 'mea', answer: 1 }, { sub: 'mea', answer: 0 }, { sub: 'ana', answer: 2 }];
  const agg = w.__TB.subAgg(items, { 0: 1, 1: 3, 2: 2 }); // mea: 1 right 1 wrong; ana: 1 right
  assert.equal(agg.mea.c, 1); assert.equal(agg.mea.t, 2, 'mastery denominator is what was presented');
  assert.equal(agg.ana.c, 1); assert.equal(agg.ana.t, 1);
});

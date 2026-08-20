'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'test-bank.html'), 'utf8');
let _windows = [];
afterEach(() => { _windows.splice(0).forEach(w => { try { w.close(); } catch (e) {} }); });

function loadPage() {
  const vc = new VirtualConsole();
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank.html', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
  _windows.push(dom.window);
  return new Promise(res => dom.window.addEventListener('load', () => res(dom.window)));
}
const click = (w, el) => el.dispatchEvent(new w.Event('click', { bubbles: true }));
const ov = w => w.document.getElementById('tb-overview');

test('CQE is live with a 160-question Set 1 at official BoK weighting', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cqe;
  assert.ok(e.bank && e.bank.length === 160, 'CQE Set 1 bank of 160 loaded');
  assert.equal(e.sets[1], e.bank, 'Set 1 is the canonical bank');
  const d = {}; e.bank.forEach(q => { d[q.sub] = (d[q.sub] || 0) + 1; });
  assert.deepEqual(d, { mgmt: 17, qsys: 18, design: 21, ppc: 23, ci: 26, quant: 34, risk: 21 });
});

test('every CQE question is valid, unique, and maps to a real BoK area', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cqe;
  const units = new Set(w.__TB.subUnits(e).map(u => u.id));
  assert.deepEqual([...units].sort(), ['ci', 'design', 'mgmt', 'ppc', 'qsys', 'quant', 'risk']);
  e.bank.forEach((q, i) => {
    assert.equal(q.set, 1, 'q ' + i + ' tagged set 1');
    assert.ok(units.has(q.sub), 'q ' + i + ' sub maps to a BoK area');
    assert.equal(q.options.length, 4);
    assert.ok(q.answer >= 0 && q.answer <= 3);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(q.stem && q.why);
    assert.ok(!/<\/?[a-zA-Z][a-zA-Z0-9]*(\s[^>]*)?>/.test(q.stem + q.options.join('')), 'q ' + i + ' has no HTML tags');
  });
  assert.equal(new Set(e.bank.map(q => q.stem)).size, 160, 'all CQE stems unique');
});

test('the CQE tile is live (3 exam sets) and its modes launch', async () => {
  const w = await loadPage();
  const tile = w.document.querySelector('.tb-tile[data-exam="cqe"]');
  assert.ok(tile && !/Coming soon/.test(tile.textContent));
  assert.match(tile.textContent, /3 exam sets/i);
  click(w, tile);
  // live: launchable modes, no coming-soon placeholders, and a set selector (two sets now)
  assert.equal(ov(w).querySelectorAll('[data-mode]').length, 3, 'three launchable modes');
  assert.equal(ov(w).querySelectorAll('.tb-start').length, 0, 'no coming-soon placeholders');
  const setBtns = ov(w).querySelectorAll('[data-set]');
  assert.equal(setBtns.length, 4, 'Set 1 / Set 2 / Set 3 / Mixed');
  assert.deepEqual(Array.from(setBtns).map(b => b.dataset.set), ['1', '2', '3', 'mix']);
  assert.match(ov(w).querySelector('[data-set="mix"]').textContent, /804/, 'Mixed pools all three sets');
});

test('CQE has a second 160-question set, disjoint from Set 1, same BoK weighting', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cqe;
  assert.ok(e.sets[2] && e.sets[2].length === 160, 'Set 2 of 160 loaded');
  const d = {}; e.sets[2].forEach(q => { d[q.sub] = (d[q.sub] || 0) + 1; });
  assert.deepEqual(d, { mgmt: 17, qsys: 18, design: 21, ppc: 23, ci: 26, quant: 34, risk: 21 });
  e.sets[2].forEach((q, i) => {
    assert.equal(q.set, 2, 'q ' + i + ' tagged set 2');
    assert.equal(q.options.length, 4);
    assert.ok(q.answer >= 0 && q.answer <= 3);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(q.stem && q.why);
  });
  assert.equal(new Set(e.sets[2].map(q => q.stem)).size, 160, 'all Set-2 stems unique');
  const s1 = new Set(e.sets[1].map(q => q.stem));
  assert.equal(e.sets[2].filter(q => s1.has(q.stem)).length, 0, 'Set 2 disjoint from Set 1');
});

test('CQE set selector: Set 2 draws only from Set 2; Set 2 provenance and 160-cap', async () => {
  // provenance: choosing Set 2 yields a Set-2 question
  let w = await loadPage();
  click(w, w.document.querySelector('.tb-tile[data-exam="cqe"]'));
  click(w, ov(w).querySelector('[data-set="2"]'));
  click(w, ov(w).querySelector('[data-diag]'));
  const stem = ov(w).querySelector('.tb-stem').textContent;
  const e = w.__TB.EXAMS.cqe;
  assert.ok(e.sets[2].some(q => q.stem === stem) && !e.sets[1].some(q => q.stem === stem), 'Set-2 question shown');
  // full-exam size for Set 2 and Mixed
  async function count(setVal) {
    const ww = await loadPage();
    click(ww, ww.document.querySelector('.tb-tile[data-exam="cqe"]'));
    click(ww, ov(ww).querySelector('[data-set="' + setVal + '"]'));
    click(ww, ov(ww).querySelector('[data-mode="full"]'));
    return ov(ww).querySelectorAll('.tb-navcell').length;
  }
  assert.equal(await count('2'), 160, 'Set 2 full exam');
  assert.equal(await count('mix'), 160, 'Mixed full exam is 160 drawn from the 320 pool');
});

test('a CQE diagnostic starts and draws from the CQE bank', async () => {
  const w = await loadPage();
  click(w, w.document.querySelector('.tb-tile[data-exam="cqe"]'));
  click(w, ov(w).querySelector('[data-diag]'));
  const stem = ov(w).querySelector('.tb-stem').textContent;
  assert.ok(w.__TB.EXAMS.cqe.bank.some(q => q.stem === stem), 'quiz shows a CQE question');
});

test('CQE carries an expanding Set 3, seeded from the study-guide practice bank, disjoint from Sets 1 and 2', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cqe;
  assert.ok(e.sets[3] && e.sets[3].length === 484, 'Set 3 has grown to 484 questions');
  const d = {}; e.sets[3].forEach(q => { d[q.sub] = (d[q.sub] || 0) + 1; });
  assert.deepEqual(d, { mgmt: 51, qsys: 36, design: 58, ppc: 92, ci: 87, quant: 114, risk: 46 });
  e.sets[3].forEach((q, i) => {
    assert.equal(q.set, 3, 'q ' + i + ' tagged set 3');
    assert.equal(q.options.length, 4);
    assert.ok(q.answer >= 0 && q.answer <= 3);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(q.stem && q.why);
    assert.ok(!/<\/?[a-zA-Z][a-zA-Z0-9]*(\s[^>]*)?>/.test(q.stem + q.options.join('')), 'q ' + i + ' has no HTML tags');
  });
  assert.equal(new Set(e.sets[3].map(q => q.stem)).size, 484, 'all Set-3 stems unique');
  const prior = new Set(e.sets[1].concat(e.sets[2]).map(q => q.stem));
  assert.equal(e.sets[3].filter(q => prior.has(q.stem)).length, 0, 'Set 3 disjoint from Sets 1 and 2');
});

test('a CQE full exam always draws exactly 160 questions, regardless of set/pool size', async () => {
  async function count(setVal) {
    const w = await loadPage();
    click(w, w.document.querySelector('.tb-tile[data-exam="cqe"]'));
    click(w, ov(w).querySelector('[data-set="' + setVal + '"]'));
    click(w, ov(w).querySelector('[data-mode="full"]'));
    return ov(w).querySelectorAll('.tb-navcell').length;
  }
  assert.equal(await count('3'), 160, 'Set 3 full exam is 160 drawn from its 484-question pool');
  assert.equal(await count('mix'), 160, 'Mixed full exam is 160 drawn from the 804 pool');
});

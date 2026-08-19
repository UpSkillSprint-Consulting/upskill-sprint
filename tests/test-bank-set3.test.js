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

test('CSSBB carries a third 695-question set with the BoK distribution', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cssbb;
  assert.ok(e.sets[3], 'Set 3 registered');
  assert.equal(e.sets[3].length, 695);
  const d = {}; e.sets[3].forEach(q => { d[q.sub] = (d[q.sub] || 0) + 1; });
  assert.deepEqual(d, { p1: 152, p2: 41, tm: 52, def: 67, mea: 166, ana: 68, imp: 63, con: 65, dfss: 21 });
  e.sets[3].forEach((q, i) => {
    assert.equal(q.set, 3, 'q ' + i + ' tagged set 3');
    assert.equal(q.options.length, 4);
    assert.ok(q.answer >= 0 && q.answer <= 3);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(q.stem && q.why);
    assert.ok(!/[<>]/.test(q.stem + q.options.join('')), 'q ' + i + ' has no leftover markup');
  });
  assert.equal(new Set(e.sets[3].map(q => q.stem)).size, 695, 'all Set-3 stems unique');
});

test('Set 3 is disjoint from Sets 1 and 2', async () => {
  const w = await loadPage();
  const e = w.__TB.EXAMS.cssbb;
  const others = new Set(e.sets[1].concat(e.sets[2]).map(q => q.stem));
  assert.equal(e.sets[3].filter(q => others.has(q.stem)).length, 0, 'no shared stems with Set 1 or 2');
});

test('choosing Set 3 draws questions from Set 3 only', async () => {
  const w = await loadPage();
  click(w, ov(w).querySelector('[data-set="3"]'));
  click(w, ov(w).querySelector('[data-diag]'));
  const stem = ov(w).querySelector('.tb-stem').textContent;
  const e = w.__TB.EXAMS.cssbb;
  const inS3 = e.sets[3].some(q => q.stem === stem);
  const inOther = e.sets[1].concat(e.sets[2]).some(q => q.stem === stem);
  assert.ok(inS3 && !inOther, 'first Set-3 question is from Set 3 only');
});

test('a full exam is 165 for Set 3 and for the all-sets Mixed pool', async () => {
  async function count(setVal) {
    const w = await loadPage();
    click(w, ov(w).querySelector('[data-set="' + setVal + '"]'));
    click(w, ov(w).querySelector('[data-mode="full"]'));
    return ov(w).querySelectorAll('.tb-navcell').length;
  }
  assert.equal(await count('3'), 165, 'Set 3 full exam');
  assert.equal(await count('mix'), 165, 'Mixed full exam is 165 drawn from the 1025 pool');
});

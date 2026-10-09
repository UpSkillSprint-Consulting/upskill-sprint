'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

function loadBank() {
  const ctx = {window: {}};
  vm.runInNewContext(read('test-bank-pmp-set1.js'), ctx);
  return ctx.window;
}

test('PMP Set 1 is eighty original single-answer items across the July 2026 domains', () => {
  const {PMP_SET1: qs, registerPMPSet1} = loadBank();
  assert.equal(qs.length, 80);
  const counts = {};
  const approaches = {};
  qs.forEach((q, i) => {
    assert.equal(q.qid, 'pmp:set-1:' + String(i + 1).padStart(3, '0'));
    assert.equal(q.set, 1);
    assert.equal(q.original, true);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.equal(q.optionRationales.length, 4);
    assert.ok(q.why.includes('Exam tip'));
    assert.ok(q.keyPoint && q.trap && q.stem.trim());
    assert.doesNotMatch(q.stem + q.options.join(' '), / [\u2013\u2014] /);
    counts[q.sub] = (counts[q.sub] || 0) + 1;
    approaches[q.approach] = (approaches[q.approach] || 0) + 1;
  });
  assert.deepEqual(counts, {'pmp-people': 26, 'pmp-process': 33, 'pmp-business': 21});
  assert.deepEqual(approaches, {Predictive: 32, Agile: 20, Hybrid: 28});
  assert.equal(qs[6].chart.type, 'data-table');
  assert.equal(qs[6].chart.rows.length, 8);
  assert.equal(qs[13].chart.type, 'data-table');
  assert.equal(qs[26].chart.type, 'data-table');
  assert.equal(qs[26].chart.rows.length, 4);
  assert.equal(qs[33].chart.type, 'data-table');
  assert.equal(qs[33].chart.rows.length, 6);
  assert.equal(qs[45].chart.type, 'data-table');
  assert.equal(qs[45].chart.rows.length, 4);
  assert.equal(qs[50].chart.type, 'data-table');
  assert.equal(qs[50].chart.rows.length, 4);
  assert.equal(qs[69].chart.type, 'data-table');
  assert.equal(qs[69].chart.rows.length, 4);
  assert.equal(qs[72].chart.type, 'data-table');
  assert.equal(qs[72].chart.rows.length, 4);
  assert.equal(qs.filter(q => q.batch === 2).length, 10);
  assert.equal(qs.filter(q => q.batch === 5).length, 10);
  assert.equal(qs.filter(q => q.batch === 6).length, 10);
  assert.equal(qs.filter(q => q.batch === 7).length, 10);
  assert.equal(qs.filter(q => q.batch === 8).length, 10);
  assert.equal(qs.slice(50, 60).every(q => q.stem.includes('Northline')), true);
  const exam = {bok: [], bank: []}, dm = {};
  registerPMPSet1(exam, dm);
  assert.equal(exam.bank, qs);
  assert.equal(exam.sets[1], qs);
  assert.equal(exam.questions, 180);
  assert.equal(exam.minutes, 240);
  assert.deepEqual(Array.from(exam.bok, d => d.weight), [33, 41, 26]);
  assert.deepEqual(Array.from(exam.plannedSets), ['1', '2', '3']);
  assert.equal(exam.sets[2].length, 0);
  assert.equal(exam.sets[3].length, 0);
  assert.equal(dm['pmp-people'].name, 'People');
});

test('the test bank keeps the PMP script, registers the exam, and the edge function does not strip it', () => {
  const html = read('test-bank.html');
  const edge = read('netlify/edge-functions/test-bank-mobile-picker.js');
  assert.equal(html.split('<script src="/test-bank-pmp-set1.js"></script>').length - 1, 1);
  assert.match(html, /if\(window\.registerPMPSet1\)window\.registerPMPSet1\(EXAMS\.pmp,DM\)/);
  assert.match(html, /if\(window\.registerPMPSet2\)window\.registerPMPSet2\(EXAMS\.pmp\)/);
  assert.match(html, /if\(window\.registerPMPSet3\)window\.registerPMPSet3\(EXAMS\.pmp\)/);
  assert.match(html, /if\(window\.registerPMPSet4\)window\.registerPMPSet4\(EXAMS\.pmp\)/);
  assert.match(html, /if\(window\.registerPMPSet5\)window\.registerPMPSet5\(EXAMS\.pmp\)/);
  assert.match(html, /if\(window\.registerPMPSet6\)window\.registerPMPSet6\(EXAMS\.pmp\)/);
  assert.equal(html.split('<script src="/test-bank-pmp-set6.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/test-bank-pmp-set5.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/test-bank-pmp-set2.js"></script>').length - 1, 1);
  assert.match(html, /\['Project Management',\['pmp'\]\]/);
  assert.match(edge, /pmp/);
  assert.match(read('exam-practice.html'), /href="\/test-bank\?exam=pmp"/);
});

test('opening PMP shows Set 1 in the catalog and does not start an attempt', async () => {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const html = read('test-bank.html')
    .replace(
      '<script src="/test-bank-pmp-set1.js"></script>',
      '<script>' + read('test-bank-pmp-set1.js').replace(/<\/script/gi, '<\\/script') + '</script>'
    )
    .replace(
      '<script src="/test-bank-pmp-set2.js"></script>',
      '<script>' + read('test-bank-pmp-set2.js').replace(/<\/script/gi, '<\\/script') + '</script>'
    )
    .replace(
      '<script src="/test-bank-pmp-set3.js"></script>',
      '<script>' + read('test-bank-pmp-set3.js').replace(/<\/script/gi, '<\\/script') + '</script>'
    )
    .replace(
      '<script src="/test-bank-pmp-set4.js"></script>',
      '<script>' + read('test-bank-pmp-set4.js').replace(/<\/script/gi, '<\\/script') + '</script>'
    )
    .replace(
      '<script src="/test-bank-pmp-set5.js"></script>',
      '<script>' + read('test-bank-pmp-set5.js').replace(/<\/script/gi, '<\\/script') + '</script>'
    )
    .replace(
      '<script src="/test-bank-pmp-set6.js"></script>',
      '<script>' + read('test-bank-pmp-set6.js').replace(/<\/script/gi, '<\\/script') + '</script>'
    );
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank?exam=pmp',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve, {once: true}));
  const doc = dom.window.document;
  doc.querySelector('.tb-tile[data-exam="pmp"]').click();
  assert.equal(doc.querySelector('.tb-tile.active').dataset.exam, 'pmp');
  assert.equal(doc.querySelector('.tb-quiz'), null);
  const overview = doc.getElementById('tb-overview').textContent;
  assert.match(overview, /Set 1 contains all 180/);
  assert.equal(doc.querySelector('[data-set="4"]'), null);
  assert.equal(doc.querySelector('[data-set="5"]'), null);
  assert.equal(doc.querySelector('[data-set="6"]'), null);
  assert.match(doc.querySelector('[data-set="1"]:not([disabled])').textContent, /180 of 180/);
  assert.equal(doc.querySelector('[data-set="2"]').disabled, true);
  assert.match(doc.querySelector('[data-set="2"]').textContent, /Held for Claude/);
  assert.equal(doc.querySelector('[data-set="3"]').disabled, true);
  assert.match(doc.querySelector('[data-set="3"]').textContent, /Held for GPT/);
  assert.equal(doc.querySelector('[data-quiz-set-kind="quick"][data-quiz-set="2"]').disabled, true);
  assert.equal(doc.querySelector('[data-quiz-set-kind="focus"][data-quiz-set="3"]').disabled, true);
  assert.equal(doc.querySelector('[data-quiz-set-kind="quick"][data-quiz-set="1"]').disabled, false);
  assert.match(overview, /not affiliated with PMI/i);
  assert.match(overview, /People/);
  assert.match(overview, /33%/);
  assert.match(overview, /41%/);
  assert.match(overview, /26%/);
  assert.equal(dom.window.__TB.EXAMS.pmp.bank.length, 180);
  assert.deepEqual(errors, []);
  dom.window.close();
});

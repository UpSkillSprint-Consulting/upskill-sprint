'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('directory shows the full NPPE name and does not open practice', () => {
  const html = read('exam-practice.html');
  assert.match(html, /id="exam-nppe" data-exam="nppe" data-publication="coming_soon"/);
  assert.match(html, /<h3>National Professional Practice Examination \(NPPE\)<\/h3>/);
  assert.equal(html.split('data-exam="nppe"').length - 1, 1);
  const card = html.slice(html.indexOf('id="exam-nppe"'), html.indexOf('id="exam-no-results"'));
  assert.equal(card.includes('/test-bank'), false);
});

test('Mock D registration changes only the Grok-owned form', () => {
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(read('test-bank-nppe-set2.js'), context);
  const exam = { forms: {}, sets: {}, setPlans: {}, mockLaunchable: {} };
  context.window.registerNPPESet2(exam);
  const ids = [
    'set-1-diagnostic', 'set-1-learning', 'set-1-mock-a', 'set-1-mock-b', 'set-1-mock-c', 'mock-d', 'mock-e'
  ];
  const page = read('test-bank.html');
  ids.forEach(id => assert.match(page, new RegExp("id:'" + id.replace(/-/g, '\\-') + "'")));
  assert.equal(exam.forms['mock-d'].length, 110);
  assert.equal(exam.forms['mock-d'].filter(q => q.scored).length, 100);
  assert.equal(exam.forms['mock-d'].filter(q => q.experimental).length, 10);
  assert.equal(exam.mockLaunchable['mock-d'], true);
  ['set-1-diagnostic', 'set-1-learning', 'set-1-mock-a', 'set-1-mock-b', 'set-1-mock-c', 'mock-e'].forEach(id => {
    assert.equal(exam.forms[id], undefined);
  });
  assert.equal(exam.forms['mock-d'].every(q => q.authorSet === 2 && q.form === 'mock-d'), true);
  assert.match(page, /A raw percentage here is not the official equated scaled score/);
  assert.equal(read('exam-access-loader.js').includes("'nppe'"), true);
  // Loader recognition does not grant access; publication and RPC remain authoritative.
  assert.match(read('netlify/functions/exam-content.mjs'), /can_access_exam/);
});

test('Mock E is a separate 110-question form and does not reuse Mock D', () => {
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(read('test-bank-nppe-set2.js') + '\n' + read('test-bank-nppe-set3.js'), context);
  const exam = { forms: {}, sets: {}, setPlans: {}, mockLaunchable: {} };
  context.window.registerNPPESet2(exam);
  context.window.registerNPPESet3(exam);
  assert.equal(exam.forms['mock-d'].length, 110);
  assert.equal(exam.forms['mock-e'].length, 110);
  assert.equal(exam.mockLaunchable['mock-e'], true);
  const d = new Set(exam.forms['mock-d'].map(q => q.stem));
  const eIds = exam.forms['mock-e'].map(q => q.qid);
  assert.equal(eIds[0], 'nppe:set-3:611');
  assert.equal(eIds[109], 'nppe:set-3:720');
  exam.forms['mock-e'].forEach(q => {
    assert.equal(q.form, 'mock-e');
    assert.equal(q.authorSet, 3);
    assert.equal(d.has(q.stem), false, q.qid);
  });
  assert.equal(exam.forms['mock-e'].filter(q => q.scored).length, 100);
  assert.equal(exam.forms['mock-e'].filter(q => q.experimental).length, 10);
  const page = read('test-bank.html');
  assert.match(page, /registerNPPESet3/);
  assert.match(page, /if\(e&&e\.formCatalog\)return activeBank\(e\)\.slice\(\)/);
});

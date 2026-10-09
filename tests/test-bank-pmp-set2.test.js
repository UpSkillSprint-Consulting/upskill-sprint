'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');

function loadBank() {
  const ctx = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'test-bank-pmp-set2.js'), 'utf8'), ctx);
  return ctx.window;
}

test('PMP Set 2 is twenty original items, Q081-Q100, and does not replace Set 1', () => {
  const {PMP_SET2: qs, registerPMPSet2} = loadBank();
  assert.equal(qs.length, 20);
  const counts = {};
  const approaches = {};
  qs.forEach((q, i) => {
    assert.equal(q.qid, 'pmp:set-2:' + String(i + 81).padStart(3, '0'));
    assert.equal(q.set, 2);
    assert.equal(q.batch, i < 10 ? 9 : 10);
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
  assert.deepEqual(counts, {'pmp-people': 6, 'pmp-process': 8, 'pmp-business': 6});
  assert.deepEqual(approaches, {Predictive: 8, Agile: 5, Hybrid: 7});
  assert.equal(qs[0].chart.type, 'data-table');
  assert.equal(qs[16].chart.type, 'data-table');
  const set1 = [{qid: 'keep'}];
  const exam = {bank: set1, sets: {1: set1, 3: []}, setPlans: {}, fullExamQuestionsBySet: {1: 180}};
  registerPMPSet2(exam);
  assert.equal(exam.bank, set1);
  assert.equal(exam.sets[1], set1);
  assert.equal(exam.sets[2], qs);
  assert.equal(exam.sets[3].length, 0);
  assert.equal(exam.setPlans[2].label, 'Q081-Q100');
  assert.equal(exam.fullExamQuestionsBySet[2], 20);
});

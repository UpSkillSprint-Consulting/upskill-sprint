'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');

function loadBank() {
  const ctx = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'test-bank-pmp-set3.js'), 'utf8'), ctx);
  return ctx.window;
}

test('PMP Set 3 is thirty original items, Q101-Q130, and does not replace earlier sets', () => {
  const {PMP_SET3: qs, registerPMPSet3} = loadBank();
  assert.equal(qs.length, 30);
  const counts = {};
  const approaches = {};
  qs.forEach((q, i) => {
    assert.equal(q.qid, 'pmp:set-3:' + String(i + 101).padStart(3, '0'));
    assert.equal(q.set, 3);
    assert.equal(q.batch, i < 10 ? 11 : i < 20 ? 12 : 13);
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
  assert.deepEqual(counts, {'pmp-people': 10, 'pmp-process': 12, 'pmp-business': 8});
  assert.deepEqual(approaches, {Predictive: 12, Agile: 8, Hybrid: 10});
  assert.equal(qs[2].chart.type, 'data-table');
  assert.equal(qs[10].chart.type, 'data-table');
  assert.equal(qs[25].chart.type, 'data-table');
  assert.equal(qs.slice(10, 20).every(q => q.stem.includes('Harbor compliance program')), true);
  const set1 = [{qid: 'keep'}];
  const set2 = [{qid: 'keep-2'}];
  const exam = {bank: set1, sets: {1: set1, 2: set2}, setPlans: {}, fullExamQuestionsBySet: {1: 180, 2: 20}};
  registerPMPSet3(exam);
  assert.equal(exam.bank, set1);
  assert.equal(exam.sets[1], set1);
  assert.equal(exam.sets[2], set2);
  assert.equal(exam.sets[3], qs);
  assert.equal(exam.setPlans[3].label, 'Q101-Q130');
  assert.equal(exam.fullExamQuestionsBySet[3], 30);
});

'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');

function loadBank() {
  const ctx = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'test-bank-pmp-set4.js'), 'utf8'), ctx);
  return ctx.window;
}

test('PMP Set 4 is twenty original items, Q131-Q150, and does not replace earlier sets', () => {
  const {PMP_SET4: qs, registerPMPSet4} = loadBank();
  assert.equal(qs.length, 20);
  const counts = {};
  const approaches = {};
  qs.forEach((q, i) => {
    assert.equal(q.qid, 'pmp:set-4:' + String(i + 131).padStart(3, '0'));
    assert.equal(q.set, 4);
    assert.equal(q.batch, i < 10 ? 14 : 15);
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
  assert.deepEqual(counts, {'pmp-people': 7, 'pmp-process': 8, 'pmp-business': 5});
  assert.deepEqual(approaches, {Predictive: 8, Agile: 5, Hybrid: 7});
  assert.equal(qs[3].chart.type, 'data-table');
  assert.equal(qs[15].chart.type, 'data-table');
  const set1 = [{qid: 'keep'}];
  const set2 = [{qid: 'keep-2'}];
  const set3 = [{qid: 'keep-3'}];
  const exam = {bank: set1, sets: {1: set1, 2: set2, 3: set3}, plannedSets: ['1', '2', '3'], setPlans: {}, fullExamQuestionsBySet: {1: 180}};
  registerPMPSet4(exam);
  assert.equal(exam.bank, set1);
  assert.equal(exam.sets[1], set1);
  assert.equal(exam.sets[2], set2);
  assert.equal(exam.sets[3], set3);
  assert.equal(exam.sets[4], qs);
  assert.deepEqual(exam.plannedSets, ['1', '2', '3', '4']);
  assert.equal(exam.setPlans[4].label, 'Q131-Q150');
  assert.equal(exam.fullExamQuestionsBySet[4], 20);
});

'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');

function loadBank() {
  const ctx = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'test-bank-pmp-set6.js'), 'utf8'), ctx);
  return ctx.window;
}

test('PMP Set 6 is ten original items, Q171-Q180, and does not replace earlier sets', () => {
  const {PMP_SET6: qs, registerPMPSet6} = loadBank();
  assert.equal(qs.length, 10);
  const counts = {};
  const approaches = {};
  qs.forEach((q, i) => {
    assert.equal(q.qid, 'pmp:set-6:' + String(i + 171).padStart(3, '0'));
    assert.equal(q.set, 6);
    assert.equal(q.batch, 18);
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
  assert.deepEqual(counts, {'pmp-people': 3, 'pmp-process': 4, 'pmp-business': 3});
  assert.deepEqual(approaches, {Predictive: 4, Agile: 3, Hybrid: 3});
  assert.equal(qs[3].chart.type, 'data-table');
  const prior = [1, 2, 3, 4, 5].map(n => [{qid: 'keep-' + n}]);
  const exam = {
    bank: prior[0],
    sets: {1: prior[0], 2: prior[1], 3: prior[2], 4: prior[3], 5: prior[4]},
    plannedSets: ['1', '2', '3', '4', '5'],
    setPlans: {},
    fullExamQuestionsBySet: {}
  };
  registerPMPSet6(exam);
  assert.equal(exam.bank.length, 15);
  assert.equal(exam.bank[0].qid, 'keep-1');
  assert.equal(exam.bank[14].qid, 'pmp:set-6:180');
  assert.equal(exam.sets[1], exam.bank);
  assert.equal(exam.sets[2].length, 0);
  assert.equal(exam.sets[3].length, 0);
  assert.equal(exam.sets[4], undefined);
  assert.equal(exam.sets[6], undefined);
  assert.deepEqual(Array.from(exam.plannedSets), ['1', '2', '3']);
  assert.equal(exam.setPlans[1].label, 'Q001-Q180');
  assert.equal(exam.setPlans[2].label, 'Held for Claude');
  assert.equal(exam.setPlans[3].label, 'Held for GPT');
  assert.equal(exam.fullExamQuestionsBySet[1], 180);
  assert.equal(exam.fullExamQuestionsBySet[6], undefined);
});

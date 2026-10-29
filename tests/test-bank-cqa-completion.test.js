'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ROOT = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(ROOT, 'test-bank-cqa-set2-batch15.js'), 'utf8');
const base = () => Array.from({length: 140}, (_, i) => ({qid: 'cqa:set-2:q' + String(i + 1).padStart(3, '0')}));
const plain = value => JSON.parse(JSON.stringify(value));
const fixture = '<script src="/test-bank-cqa-set2.js"></script>\n<script>var cqa={setPlans:{2:{target:150,label:\'Batch 14 complete\'}}};</script>';

test('completion composition is ordered, idempotent and restricted to the CQA registration', async () => {
  const {integrateCQASet2Completion} = await import('../scripts/cqa-set2-completion.mjs');
  const result = integrateCQASet2Completion(fixture);
  assert.equal(result, fixture.replace('</script>', '</script>\n<script src="/test-bank-cqa-set2-batch15.js"></script>').replace('Batch 14 complete', '150-question set complete'));
  assert.equal(integrateCQASet2Completion(result), result);
});

test('completion composition rejects missing, duplicated or inconsistent boundaries', async () => {
  const {integrateCQASet2Completion: compose} = await import('../scripts/cqa-set2-completion.mjs');
  assert.throws(() => compose(null), TypeError);
  assert.throws(() => compose(''), /exactly one/);
  assert.throws(() => compose(fixture + fixture), /exactly one/);
  assert.throws(() => compose(fixture.replace('Batch 14 complete', 'unreviewed')), /metadata changed/);
  assert.throws(() => compose(fixture + '<script src="/test-bank-cqa-set2-batch15.js"></script>'), /duplicated or out of order/);
});

test('the final ten objects retain the base and satisfy IDs, allocation, sources and rationales', () => {
  const original = base(), before = JSON.stringify(original);
  const window = {CQA_SET2: original, CQA_SET1: [{qid: 'set1-preserved'}]};
  vm.runInNewContext(source, {window});
  assert.equal(JSON.stringify(window.CQA_SET2.slice(0, 140)), before);
  assert.equal(window.CQA_SET2, original, 'Append without replacing the existing array');
  assert.deepEqual(window.CQA_SET1, [{qid: 'set1-preserved'}]);
  assert.equal(window.CQA_SET2.length, 150);
  const batch = plain(window.CQA_SET2.slice(140));
  assert.deepEqual(batch.map(q => q.qid), Array.from({length: 10}, (_, i) => 'cqa:set-2:q' + (141 + i)));
  const counts = {}, answers = [0, 0, 0, 0];
  for (const q of batch) {
    assert.equal(q.batch, 15); assert.equal(q.set, 2);
    const domain = q.bok.split('.')[0]; counts[domain] = (counts[domain] || 0) + 1;
    assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3);
    answers[q.answer]++;
    assert.deepEqual(Object.keys(q.distractors).sort(), [0, 1, 2, 3].filter(i => i !== q.answer).map(String));
    assert.ok(q.stem && q.keyPoint && q.trap && Object.values(q.distractors).every(Boolean));
    assert.match(q.why, /tb-source-ref/);
    assert.match(q.why, /Handbook, 5th ed\., pp?\. [\d, –]+\.<\/span>/);
  }
  assert.deepEqual(counts, {I: 2, II: 3, III: 2, IV: 2, V: 1});
  assert.deepEqual(answers, [3, 2, 3, 2]);
  const [a, b] = batch.filter(q => q.caseId);
  assert.equal(a.caseId, b.caseId); assert.deepEqual(a.chart, b.chart);
  const boundary = "proposed changes to required coverage need the client's approval.";
  assert.equal(a.stem.split(boundary)[0], b.stem.split(boundary)[0]);
  assert.equal(a.chart.rows.length, 4);
  for (const q of batch.filter(q => q.chart)) assert.ok(q.chart.rows.every(row => row.length === q.chart.columns.length));
});

test('the final batch rejects absent or repeated installation', () => {
  assert.throws(() => vm.runInNewContext(source, {window: {}}), /140-question base/);
  const window = {CQA_SET2: base()};
  vm.runInNewContext(source, {window});
  assert.throws(() => vm.runInNewContext(source, {window}), /140-question base/);
  assert.equal(window.CQA_SET2.length, 150);
});

test('Q150 has zero linear covariance but retains the curved observed relationship', () => {
  const window = {CQA_SET2: base()}; vm.runInNewContext(source, {window});
  const q = window.CQA_SET2.at(-1), rows = q.chart.rows;
  const mx = rows.reduce((a, r) => a + r[1], 0) / rows.length;
  const my = rows.reduce((a, r) => a + r[2], 0) / rows.length;
  const cross = rows.reduce((a, r) => a + (r[1] - mx) * (r[2] - my), 0);
  assert.equal(mx, 60); assert.equal(my, 5.4); assert.ok(Math.abs(cross) < 1e-12);
  assert.deepEqual(Array.from(rows, r => r[2]), [9, 4, 1, 4, 9]);
  assert.equal(q.answer, 0);
});

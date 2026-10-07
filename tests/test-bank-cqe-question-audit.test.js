'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'test-bank.html'), 'utf8');
const pattern = /var CQE_SET3=(\[[\s\S]*?\n\s*\]);/;
const bank = JSON.parse(JSON.stringify(vm.runInNewContext(html.match(pattern)[1])));
const audit = JSON.parse(fs.readFileSync(path.join(root, 'docs/audits/cqe-set3-question-audit-round2.json'), 'utf8'));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const choice = n => bank[n-1].options[bank[n-1].answer];

test('the second audit covers the exact final content of all 613 questions individually', () => {
  assert.equal(bank.length, 613);
  assert.equal(audit.questions.length, 613);
  assert.equal(new Set(audit.questions.map(q => q.qid)).size, 613);
  for (const [i,q] of bank.entries()) {
    const row = audit.questions[i];
    assert.equal(row.question, i+1);
    assert.equal(row.qid, q.qid);
    assert.equal(row.contentSha256, hash(JSON.stringify(q)), `Q${i+1} changed after review`);
    assert.equal(row.selectedAnswer, choice(i+1));
    assert.equal(row.sourceVisualReviewed, !!q.chart);
    assert.ok(row.verificationNote.length > 20);
    assert.equal(row.status, row.correction ? 'corrected' : 'verified');
    assert.equal(row.source.pdfPage-row.source.printedPage, 27);
    assert.doesNotMatch(q.stem, /previous (?:question|problem)|using the same (?:study|data|table)/i);
    assert.doesNotMatch(q.options.join(' '), /\bH\s+[,;]/, 'missing hypothesis subscript');
  }
  assert.equal(audit.questions.filter(q => q.correction).length, 221);
  assert.equal(audit.questions.filter(q => q.calculation).length, 143);
});

test('numerical audit evidence remains tied to the selected answers and its declared precision', () => {
  function compare(actual, expected, tolerance) {
    if (Array.isArray(actual)) {
      assert.equal(actual.length, expected.length);
      actual.forEach((v,i) => compare(v, expected[i], tolerance));
    } else assert.ok(Number.isFinite(actual) && Math.abs(actual-expected) <= tolerance + 1e-12);
  }
  for (const row of audit.questions.filter(q => q.calculation)) {
    const c = row.calculation;
    assert.equal(c.question, row.question);
    assert.equal(c.selectedAnswer, choice(row.question));
    compare(c.result, c.expected, c.tolerance);
  }
});

test('substantive answer and solution regressions are corrected', () => {
  for (const [n, expected] of [[281,'55.85'],[284,'125'],[286,'50, 50'],[337,'0.647'],[482,'0.9022'],[500,'134'],[516,'0.9377'],[531,'5.5/√32'],[607,'9.24']]) assert.equal(choice(n),expected,`Q${n}`);
  assert.match(choice(167), /appraisal/i);
  assert.match(choice(172), /appraisal/i);
  assert.match(choice(299), /destructive tensile/i);
  assert.match(choice(304), /Planck/);
  assert.match(choice(401), /internal/i);
  assert.match(choice(404), /residual/i);
  assert.match(bank[316].why, /42\.20%/);
  assert.match(bank[456].why, /1\.19389925/);
  assert.match(bank[592].why, /4\.11/);
  assert.match(bank[548].options[3], /6\.75/);
  assert.match(bank[598].why, /inconsistent/);
});

test('corrected binomial and reliability answers follow the actual question parameters', () => {
  const pmf = (k,n,p) => {
    let choose = 1;
    for (let i=1;i<=k;i++) choose *= (n-i+1)/i;
    return choose*p**k*(1-p)**(n-k);
  };
  assert.equal((50+75*pmf(2,50,.1)).toFixed(2), choice(281));
  const continuation = pmf(3,75,.015)+pmf(4,75,.015);
  assert.equal((1-continuation).toFixed(4), choice(482));
  assert.equal((2800/(2800+62*3)).toFixed(4), choice(516));
  assert.equal((3.04**2).toFixed(2), choice(607));
});

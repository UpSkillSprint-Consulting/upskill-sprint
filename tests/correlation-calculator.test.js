'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'lessons/statistics/pearson-spearman-kendall-correlation-coefficients.html'), 'utf8');

function open(t) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole });
  t.after(() => {
    dom.window.close();
    assert.deepEqual(errors, [], 'lesson scripts should run without errors');
  });
  const doc = dom.window.document;
  return {
    doc,
    calculate(x, y) {
      doc.getElementById('calc-x').value = x.join(', ');
      doc.getElementById('calc-y').value = y.join(', ');
      doc.getElementById('calc-btn').click();
      assert.equal(doc.getElementById('calc-results').hidden, false);
      return ['calc-r', 'calc-rho', 'calc-tau'].map(id => doc.getElementById(id).textContent);
    }
  };
}

test('Kendall tau-b excludes pairs tied on both variables', t => {
  const { calculate } = open(t);
  assert.deepEqual(calculate([1, 1, 2], [1, 1, 2]), ['1.000', '1.000', '1.000']);
  assert.deepEqual(calculate([1, 1, 2], [2, 2, 1]), ['-1.000', '-1.000', '-1.000']);
  // Seven concordant pairs, one tie on each variable only, one tie on both.
  assert.equal(calculate([1, 1, 2, 2, 3], [1, 1, 2, 3, 3])[2], '0.875');
});

test('ordinary and one-variable-tie correlations retain their expected values', t => {
  const { calculate } = open(t);
  assert.deepEqual(calculate([1, 2, 3], [1, 3, 2]), ['0.500', '0.500', '0.333']);
  // The lesson's six-batch example has 12 concordant, 2 discordant and 1 tied pair.
  assert.equal(calculate([1, 2, 2, 4, 5, 6], [2, 1, 3, 4, 6, 5])[2], '0.690');
  assert.deepEqual(calculate([1, 2, 3], [1, 0, 1]), ['0.000', '0.000', '0.000']);
});

test('constant variables show undefined correlations and recover on valid input', t => {
  const { doc, calculate } = open(t);
  for (const [x, y] of [
    [[1, 1, 1], [2, 3, 4]],
    [[2, 3, 4], [1, 1, 1]],
    [[1, 1, 1], [2, 2, 2]],
    [[0.1, 0.1, 0.1], [2, 3, 4]]
  ]) {
    assert.deepEqual(calculate(x, y), ['Undefined', 'Undefined', 'Undefined']);
    assert.equal(doc.getElementById('calc-error').hidden, false);
    assert.match(doc.getElementById('calc-error').textContent, /undefined.*constant/i);
  }
  assert.deepEqual(calculate([1, 2, 3], [2, 4, 6]), ['1.000', '1.000', '1.000']);
  assert.equal(doc.getElementById('calc-error').hidden, true);
});

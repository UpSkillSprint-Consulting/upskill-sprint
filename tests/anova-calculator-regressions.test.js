'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

async function openLesson(t, slug) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const html = fs.readFileSync(path.join(__dirname, '../lessons', `${slug}.html`), 'utf8');
  const dom = new JSDOM(html, {
    url: `https://upskillsprint.com/lessons/${slug}`,
    runScripts: 'dangerously',
    virtualConsole,
    beforeParse(window) {
      window.HTMLCanvasElement.prototype.getContext = () => Object.fromEntries(
        ['setTransform', 'clearRect', 'fillRect', 'fillText', 'beginPath', 'moveTo',
          'lineTo', 'closePath', 'stroke', 'arc', 'fill', 'setLineDash'].map(name => [name, () => {}])
      );
      // No external scripts are fetched. Stub the legacy renderer for baseline runs.
      window.document.addEventListener('DOMContentLoaded', () => {
        if (window.MathJax) window.MathJax.typesetPromise = () => Promise.resolve();
      });
      window.UpskillMath = { typeset: () => Promise.resolve() };
    }
  });
  t.after(() => {
    dom.window.close();
    assert.deepEqual(errors, [], 'the calculator should run without page errors');
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  return dom.window;
}

function enterGroups(window, values, slug) {
  ['groupA', 'groupB', 'groupC'].forEach((id, index) => {
    window.document.getElementById(id).value = values[index];
  });
  if (slug === 'anova-plain-english') {
    window.document.getElementById('groupA').dispatchEvent(new window.Event('input', { bubbles: true }));
  } else {
    window.document.querySelector('button[onclick="calculateOneWay()"]').click();
  }
}

function setAlpha(window, value) {
  const select = window.document.getElementById('fd-alpha');
  select.value = value;
  select.dispatchEvent(new window.Event('change', { bubbles: true }));
}

test('plain-English ANOVA ignores surrounding delimiters without inventing observations', async t => {
  const window = await openLesson(t, 'anova-plain-english');
  const document = window.document;
  const result = document.getElementById('anovaResult');
  const original = result.textContent;
  assert.deepEqual([...result.querySelectorAll('tbody tr')].map(row =>
    [...row.cells].slice(1, 3).map(cell => cell.textContent.trim())
  ), [['5', '49.00'], ['5', '56.00'], ['5', '49.00']]);

  const values = ['groupA', 'groupB', 'groupC'].map(id => ` \n,; ${document.getElementById(id).value},;\n`);
  enterGroups(window, values, 'anova-plain-english');
  assert.equal(result.textContent, original);

  enterGroups(window, ['0, 1, 2', '2, 3, 4', '2, 3, 4'], 'anova-plain-english');
  const firstRow = result.querySelector('tbody tr');
  assert.equal(firstRow.cells[1].textContent.trim(), '3', 'an actual zero remains an observation');
  assert.equal(firstRow.cells[2].textContent.trim(), '1.00');
  assert.equal(result.querySelectorAll('.mini-stat strong')[2].textContent, '0.079');
});

for (const slug of ['anova-plain-english', 'one-way-anova']) {
  test(`${slug} rejects malformed or non-finite tokens instead of silently changing the sample`, async t => {
    const window = await openLesson(t, slug);
    const document = window.document;
    for (const invalid of ['1, 2, nope, 3', '1, 2, Infinity, 3', '1, 2, 3oops']) {
      enterGroups(window, [invalid, '3, 4, 5', '3, 4, 5'], slug);
      const result = document.getElementById(slug === 'one-way-anova' ? 'ow-decision' : 'anovaResult');
      assert.match(result.textContent, /finite numeric values/i);
      assert.doesNotMatch(result.textContent, /reject|meaningfully different|Software confidence check/i);
      if (slug === 'one-way-anova') {
        assert.equal(document.getElementById('ow-p').textContent, '—');
        assert.equal(document.getElementById('ow-table').textContent, '');
      }
    }
  });

  test(`${slug} gives no inferential result when all within-group variation is zero`, async t => {
    const window = await openLesson(t, slug);
    const document = window.document;
    for (const values of [['1, 1', '1, 1', '1, 1'], ['1, 1', '2, 2', '3, 3']]) {
      enterGroups(window, values, slug);
      const result = document.getElementById(slug === 'one-way-anova' ? 'ow-decision' : 'anovaResult');
      assert.match(result.textContent, /within-group variance is zero/i);
      assert.doesNotMatch(result.textContent, /reject|meaningfully different|Software confidence check/i);
      if (slug === 'one-way-anova') {
        for (const id of ['ow-grand', 'ow-ssb', 'ow-ssw', 'ow-f', 'ow-p']) {
          assert.equal(document.getElementById(id).textContent, '—');
        }
        assert.equal(document.getElementById('ow-table').textContent, '');
        setAlpha(window, '0.10');
        assert.match(result.textContent, /within-group variance is zero/i, 'changing alpha must not restore a stale verdict');
      }
    }
  });
}

test('one-way ANOVA preserves the default worked example', async t => {
  const window = await openLesson(t, 'one-way-anova');
  const document = window.document;
  assert.equal(document.getElementById('ow-grand').textContent, '96.17');
  assert.equal(document.getElementById('ow-ssb').textContent, '8.67');
  assert.equal(document.getElementById('ow-ssw').textContent, '413.00');
  assert.equal(document.getElementById('ow-f').textContent, '0.094');
  assert.equal(document.getElementById('ow-p').textContent, '0.9108');
  assert.match(document.getElementById('ow-decision').textContent, /^Fail to reject/);
});

test('one-way ANOVA and its graph use the selected alpha before and after calculation', async t => {
  const window = await openLesson(t, 'one-way-anova');
  const document = window.document;
  // Independent reference: F = 4 with df = (2, 6), p = (3 / 7)^3 = 27 / 343.
  enterGroups(window, ['1, 2, 3', '3, 4, 5', '3, 4, 5'], 'one-way-anova');
  assert.equal(document.getElementById('ow-f').textContent, '4.000');
  assert.equal(document.getElementById('ow-p').textContent, '0.0787');
  assert.equal(document.getElementById('fd-d1').value, '2');
  assert.equal(document.getElementById('fd-d2').value, '6');
  for (const [alpha, verdict] of [['0.05', /^Fail to reject/], ['0.10', /^Reject/], ['0.01', /^Fail to reject/]]) {
    setAlpha(window, alpha);
    assert.match(document.getElementById('ow-decision').textContent, verdict);
    assert.match(document.getElementById('fd-decision').textContent, verdict);
  }
  setAlpha(window, '0.10');
  document.querySelector('button[onclick="calculateOneWay()"]').click();
  assert.match(document.getElementById('ow-decision').textContent, /^Reject/);

  // The graph can still explore independent values; alpha changes must not reset them.
  document.getElementById('fd-d1').value = '3';
  document.getElementById('fd-d2').value = '10';
  document.getElementById('fd-fstat').value = '0';
  setAlpha(window, '0.05');
  setAlpha(window, '0.10');
  assert.match(document.getElementById('ow-decision').textContent, /^Reject/);
  assert.match(document.getElementById('fd-decision').textContent, /^Fail to reject/);
  assert.deepEqual(['fd-d1', 'fd-d2', 'fd-fstat'].map(id => document.getElementById(id).value), ['3', '10', '0']);
});

test('one-way ANOVA sends a numeric, unrounded F-statistic to the graph', async t => {
  const window = await openLesson(t, 'one-way-anova');
  enterGroups(window, ['0, 1, 2', '0.001, 1.001, 2.001', '0.001, 1.001, 2.001'], 'one-way-anova');
  const document = window.document;
  assert.equal(document.getElementById('ow-f').textContent, '<0.001');
  assert.ok(Math.abs(Number(document.getElementById('fd-fstat').value) - 0.000001) < 1e-14);
  assert.equal(document.getElementById('fd-pvalue').textContent, '1.0000');
});

test('one-way ANOVA refuses a sample with no residual degrees of freedom', async t => {
  const window = await openLesson(t, 'one-way-anova');
  enterGroups(window, ['1', '2', '3'], 'one-way-anova');
  assert.match(window.document.getElementById('ow-decision').textContent, /within-group degrees of freedom/i);
  assert.equal(window.document.getElementById('ow-p').textContent, '—');
  assert.equal(window.document.getElementById('ow-table').textContent, '');
});

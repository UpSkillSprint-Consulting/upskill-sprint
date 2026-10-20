const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('lessons/power-bi-excel-sql/excel-formula-fluency.html', 'utf8');

function page() {
  const dom = new JSDOM(html, { url: 'https://sprint.example/lesson', runScripts: 'outside-only' });
  return { dom, w: dom.window, el: id => dom.window.document.getElementById(id) };
}

// Split a displayed call at its own commas, preserving nested calls and table headers.
function argumentsOf(formula, name) {
  assert.ok(typeof formula === 'string' && formula.startsWith(`${name}(`) && formula.endsWith(')'), `Expected a ${name} call, got ${formula}`);
  const args = [];
  let start = name.length + 1, depth = 0, quoted = false;
  for (let i = start; i < formula.length - 1; i++) {
    const char = formula[i];
    if (char === '"') {
      if (quoted && formula[i + 1] === '"') { i++; continue; }
      quoted = !quoted;
    } else if (!quoted) {
      if (char === '(' || char === '[') depth++;
      if (char === ')' || char === ']') depth--;
      assert.ok(depth >= 0, 'Formula delimiters must balance');
      if (char === ',' && depth === 0) {
        args.push(formula.slice(start, i).trim());
        start = i + 1;
      }
    }
  }
  assert.equal(depth, 0, 'Formula delimiters must balance');
  assert.equal(quoted, false, 'Formula strings must close');
  args.push(formula.slice(start, -1).trim());
  return args;
}

test('clickable LET example binds names to values and takes the median of the selected week', () => {
  const h = page();
  try {
    const formula = [...h.el('anatomy').children].map(token => token.textContent).join('');
    assert.equal(formula[0], '=');
    const args = argumentsOf(formula.slice(1), 'LET');
    assert.ok(args.length >= 3 && args.length % 2 === 1, 'LET needs name/value pairs followed by a calculation');
    const bindings = new Map();
    for (let i = 0; i < args.length - 1; i += 2) {
      assert.match(args[i], /^[A-Za-z_][A-Za-z0-9_.]*$/, 'A LET name cannot be a formula expression');
      bindings.set(args[i], args[i + 1]);
    }
    const [medianInput] = argumentsOf(args.at(-1), 'MEDIAN');
    const [filterInput, include] = argumentsOf(bindings.get(medianInput), 'FILTER');
    assert.equal(bindings.get(filterInput), 'ProductionData[Tap Time]');
    assert.equal(include, 'ProductionData[WeekNum]=$M$2');
  } finally { h.dom.window.close(); }
});

test('last-row practice rejects the old XMATCH idiom and accepts the displayed reverse exact match', () => {
  const h = page();
  try {
    h.w.IntersectionObserver = class { observe() {} disconnect() {} };
    const base = [...h.w.document.scripts].find(script => script.textContent.includes('const productionData ='));
    h.w.eval(h.el('reference-progress-storage').textContent + '\n' + base.textContent);
    const challenge = [...h.el('challengeList').querySelectorAll('button')].find(button => button.textContent.includes('Build a dynamic last-row range'));
    assert.ok(challenge);
    challenge.click();

    h.el('formulaInput').value = '=A2:INDEX(A2:A10000,XMATCH(2,1/(A2:A10000<>"")))';
    h.el('checkAnswer').click();
    assert.ok(h.el('feedback').classList.contains('error'), 'An exact search for 2 in ones/errors must not earn credit');
    assert.equal(h.el('correctCount').textContent, '0');

    const correct = '=A2:INDEX(A2:A10000,XMATCH(TRUE,A2:A10000<>"",0,-1))';
    h.el('formulaInput').value = correct;
    h.el('checkAnswer').click();
    assert.ok(h.el('feedback').classList.contains('success'));
    assert.equal(h.el('correctCount').textContent, '1');
    h.el('revealAnswer').click();
    assert.ok(h.el('answerPanel').classList.contains('show'));
    assert.equal(h.el('solutionFormula').textContent, correct);
    assert.equal(h.el('indexPanel').querySelector('.formula').textContent, correct);
    h.el('showHint').click();
    assert.match(h.el('feedback').textContent, /last-to-first.*TRUE/);
  } finally { h.dom.window.close(); }
});

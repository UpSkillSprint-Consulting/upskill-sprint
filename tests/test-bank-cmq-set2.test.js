'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const set1Script = fs.readFileSync(path.join(ROOT, 'test-bank-cmq-set1.js'), 'utf8');
const set2Script = fs.readFileSync(path.join(ROOT, 'test-bank-cmq-set2.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(set1Script, context);
vm.runInContext(set2Script, context);
const SET1 = context.window.CMQ_SET1;
const SET2 = context.window.CMQ_SET2;

const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-cmq-set1.js"></script>', `<script>${set1Script}</script>`)
  .replace('<script src="/test-bank-cmq-set2.js"></script>', `<script>${set2Script}</script>`)
  .replace('<script src="/test-bank-cmq-set3.js"></script>', `<script>${fs.readFileSync(path.join(ROOT, 'test-bank-cmq-set3.js'), 'utf8')}</script>`);

let windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (_) {} }));

async function loadPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  // Required lazily so the data checks above run even where the registry file is absent.
  const { installDurableLearning } = require('./helpers/test-bank-durable-learning');
  await installDurableLearning(dom.window);
  return { window: dom.window, errors };
}

function click(window, element) {
  assert.ok(element, 'expected a clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function openCmq(window) {
  click(window, window.document.querySelector('.tb-tile[data-exam="cmq"]'));
  return window.document.getElementById('tb-overview');
}

const BLUEPRINT = {
  'cmq-lead': 28, 'cmq-strategy': 23, 'cmq-management': 26, 'cmq-tools': 31,
  'cmq-customer': 22, 'cmq-supply': 19, 'cmq-training': 16
};

test('CMQ/OE Set 2 holds 165 original handbook-cited questions in the BoK proportions', () => {
  assert.equal(SET2.length, 165);
  const counts = {};
  SET2.forEach(question => { counts[question.sub] = (counts[question.sub] || 0) + 1; });
  assert.deepEqual(counts, BLUEPRINT);
  const set1Stems = new Set(SET1.map(question => question.stem.trim().toLowerCase()));
  assert.equal(new Set(SET2.map(question => question.stem.trim().toLowerCase())).size, 165, 'no duplicate Set 2 stems');
  SET2.forEach((question, index) => {
    const n = index + 1;
    assert.deepEqual(Object.keys(question).sort(), ['answer', 'options', 'qid', 'set', 'sourceQuestion', 'stem', 'sub', 'why']);
    assert.equal(question.set, 2);
    assert.equal(question.sourceQuestion, n);
    assert.equal(question.qid, `cmq:set-2:source-${n}`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map(option => option.trim().toLowerCase())).size, 4, `question ${n} options are distinct`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    assert.match(question.why, new RegExp(`<b>${'ABCD'[question.answer]}\\.`));
    assert.match(question.why, /The ASQ CMQ\/OE Handbook, 5th ed\. \(Furterer &amp; Wood\), Chapter \d+, pp?\. \d+/);
    assert.ok(!set1Stems.has(question.stem.trim().toLowerCase()), `question ${n} does not repeat Set 1`);
    assert.doesNotMatch(`${question.stem} ${question.options.join(' ')}`, /\b(?:all|none) of the above\b/i);
    assert.doesNotMatch(`${question.stem} ${question.options.join(' ')} ${question.why}`, /(?:\bundefined\b|\bNaN\b|\ufffd|[Jj]udgement)/);
    const visible = JSDOM.fragment(question.why).textContent.replace(/\s+/g, ' ');
    assert.ok(visible.includes(question.options[question.answer]), `question ${n} names its keyed answer`);
  });
});

test('Set 2 answer keys are balanced with no long runs', () => {
  const counts = [0, 0, 0, 0];
  let run = 1;
  SET2.forEach((question, index) => {
    counts[question.answer] += 1;
    if (index && question.answer === SET2[index - 1].answer) run += 1; else run = 1;
    assert.ok(run <= 3, `key run ending at question ${index + 1} is at most 3`);
  });
  counts.forEach(count => assert.ok(count >= 39 && count <= 44, `letter count ${count} is between 39 and 44`));
});

test('CMQ/OE exposes a Set 2 selector and a quick quiz drawn only from Set 2', async () => {
  const { window, errors } = await loadPage();
  const overview = openCmq(window);
  assert.deepEqual(errors, []);
  const selectors = Array.from(overview.querySelectorAll('.tb-setpick [data-set]'));
  assert.deepEqual(selectors.map(button => button.dataset.set), ['1', '2', '3', 'mix']);
  assert.equal(selectors[1].querySelector('.tb-sets').textContent, '165');
  click(window, overview.querySelector('[data-set="2"]'));
  const rerendered = window.document.getElementById('tb-overview');
  click(window, rerendered.querySelector('[data-mode="quick"]'));
  const stem = window.document.querySelector('.tb-stem').textContent;
  assert.ok(SET2.some(question => question.stem === stem), 'the quick quiz drew from Set 2');
  assert.ok(!SET1.some(question => question.stem === stem));
});

test('a student can complete a 150-question Set 2 full exam with a perfect score', async () => {
  const { window, errors } = await loadPage();
  let overview = openCmq(window);
  click(window, overview.querySelector('[data-set="2"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-timed="0"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="full"]'));
  assert.equal(window.document.querySelectorAll('.tb-navcell').length, 150);
  const byStem = new Map(SET2.map(question => [question.stem, question]));
  for (let index = 0; index < 150; index += 1) {
    const question = byStem.get(window.document.querySelector('.tb-stem').textContent);
    assert.ok(question, `rendered question ${index + 1} belongs to Set 2`);
    click(window, window.document.querySelectorAll('.tb-opt')[question.answer]);
    if (index < 149) click(window, window.document.querySelector('[data-next]'));
  }
  click(window, window.document.querySelector('[data-submit]'));
  assert.match(window.document.getElementById('tb-overview').textContent, /100%/);
  assert.deepEqual(errors, []);
});

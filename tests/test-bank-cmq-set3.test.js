'use strict';
// CMQ/OE Set 3 is released in reviewed batches of 20 toward 165 questions.
// These checks cover the data contract for every released batch and the learner-facing Set 3 flow.
const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const scripts = { 1: read('test-bank-cmq-set1.js'), 2: read('test-bank-cmq-set2.js'), 3: read('test-bank-cmq-set3.js') };
const context = { window: {} };
vm.createContext(context);
Object.values(scripts).forEach(code => vm.runInContext(code, context));
const SET1 = context.window.CMQ_SET1;
const SET2 = context.window.CMQ_SET2;
const SET3 = context.window.CMQ_SET3;

const BATCH = 20;
const PLANNED = 165;
// Per-batch domain allocation; the seven domains must reach 28/23/26/31/22/19/16 by Q165.
const BATCH_COUNTS = [
  { 'cmq-lead': 4, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 2, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 3, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 4, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 2, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 3, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 2, 'cmq-management': 4, 'cmq-tools': 3, 'cmq-customer': 3, 'cmq-supply': 3, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 3, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 3, 'cmq-customer': 3, 'cmq-supply': 3, 'cmq-training': 2 },
  { 'cmq-lead': 4, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 2, 'cmq-supply': 2, 'cmq-training': 2 }
];
const HANDBOOK = /The ASQ CMQ\/OE Handbook, 5th ed\. \(Furterer &amp; Wood\), Chapter \d+, pp?\. \d+/;
const OUTSIDE = /ASQ CMQ\/OE Body of Knowledge \(2026\), Part [IVX]+/;

const html = read('test-bank.html')
  .replace('<script src="/test-bank-cmq-set1.js"></script>', `<script>${scripts[1]}</script>`)
  .replace('<script src="/test-bank-cmq-set2.js"></script>', `<script>${scripts[2]}</script>`)
  .replace('<script src="/test-bank-cmq-set3.js"></script>', `<script>${scripts[3]}</script>`);

const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (_) {} }));

async function loadPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank.html', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  // The simulator has been stateless since 3de2cea removed the learning ledger, so no durable-learning fixture is installed.
  return { window: dom.window, errors };
}
function click(window, element) {
  assert.ok(element, 'expected a clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

test('CMQ/OE Set 3 holds whole reviewed batches with the planned domain counts', () => {
  assert.ok(SET3.length > 0 && SET3.length <= PLANNED);
  assert.equal(SET3.length % BATCH, 0, 'Set 3 is released in whole batches of 20');
  assert.equal(SET3.length / BATCH, BATCH_COUNTS.length, 'every released batch has a declared domain allocation');
  BATCH_COUNTS.forEach((expected, b) => {
    const counts = {};
    SET3.slice(b * BATCH, (b + 1) * BATCH).forEach(q => { counts[q.sub] = (counts[q.sub] || 0) + 1; });
    assert.deepEqual(counts, expected, `batch ${b + 1} domain counts`);
  });
});

test('every Set 3 question meets the bank schema and cites its source', () => {
  const earlier = new Set(SET1.concat(SET2).map(q => q.stem.trim().toLowerCase()));
  assert.equal(new Set(SET3.map(q => q.stem.trim().toLowerCase())).size, SET3.length, 'no duplicate Set 3 stems');
  SET3.forEach((q, index) => {
    const n = index + 1;
    assert.deepEqual(Object.keys(q).sort(), ['answer', 'options', 'qid', 'set', 'sourceQuestion', 'stem', 'sub', 'why']);
    assert.equal(q.set, 3);
    assert.equal(q.sourceQuestion, n);
    assert.equal(q.qid, `cmq:set-3:source-${n}`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.trim().toLowerCase())).size, 4, `question ${n} options are distinct`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.match(q.why, new RegExp(`<b>${'ABCD'[q.answer]}\\.`));
    assert.ok(HANDBOOK.test(q.why) || OUTSIDE.test(q.why), `question ${n} cites the handbook or the 2026 BoK plus a named source`);
    assert.ok(!earlier.has(q.stem.trim().toLowerCase()), `question ${n} does not repeat Sets 1 or 2`);
    assert.doesNotMatch(`${q.stem} ${q.options.join(' ')}`, /\b(?:all|none) of the above\b/i);
    // Dollar amounts are fine; TeX must use \( \) delimiters, never $ (LESSON_CREATION_GUIDE §22).
    assert.doesNotMatch(`${q.stem} ${q.options.join(' ')} ${q.why}`, /(?:\bundefined\b|\bNaN\b|\ufffd|[Jj]udgement|\$\s*\\[A-Za-z]|\\[A-Za-z]+\s*\$)/);
    const visible = JSDOM.fragment(q.why).textContent.replace(/\s+/g, ' ');
    assert.ok(visible.includes(q.options[q.answer]), `question ${n} names its keyed answer`);
  });
});

test('each Set 3 batch has a balanced key, short runs and interleaved domains', () => {
  for (let b = 0; b * BATCH < SET3.length; b += 1) {
    const batch = SET3.slice(b * BATCH, (b + 1) * BATCH);
    const counts = [0, 0, 0, 0];
    batch.forEach(q => { counts[q.answer] += 1; });
    assert.deepEqual(counts, [5, 5, 5, 5], `batch ${b + 1} uses each letter five times`);
  }
  SET3.forEach((q, i) => {
    if (i >= 2) assert.ok(!(q.answer === SET3[i - 1].answer && q.answer === SET3[i - 2].answer), `no key run of 3 ending at ${i + 1}`);
    if (i >= 1) assert.notEqual(q.sub, SET3[i - 1].sub, `questions ${i} and ${i + 1} come from different domains`);
  });
});

test('CMQ/OE lists Set 3 as selectable with its batch progress for every mode', async () => {
  const { window, errors } = await loadPage();
  click(window, window.document.querySelector('.tb-tile[data-exam="cmq"]'));
  let overview = window.document.getElementById('tb-overview');
  const set3 = overview.querySelector('.tb-setpick [data-set="3"]');
  assert.equal(set3.disabled, false);
  assert.equal(set3.querySelector('.tb-sets').textContent, String(SET3.length));
  const mix = overview.querySelector('.tb-setpick [data-set="mix"]');
  assert.equal(mix.querySelector('.tb-sets').textContent, String(SET1.length + SET2.length + SET3.length));
  click(window, set3);
  overview = window.document.getElementById('tb-overview');
  assert.equal(overview.querySelector('.tb-setpick [data-set="3"]').getAttribute('aria-pressed'), 'true');
  const note = overview.querySelector('.tb-setnote').textContent;
  assert.match(note, new RegExp(`${SET3.length} of ${PLANNED} planned questions`));
  // A Full Exam never exceeds the exam's question count (150 for CMQ/OE), even once Set 3 holds more.
  const fullCount = Math.min(SET3.length, window.__TB.EXAMS.cmq.questions);
  assert.match(note, new RegExp(`A Full Exam currently serves ${fullCount} questions`));
  for (const kind of ['quick', 'focus']) {
    const button = window.document.querySelector(`[data-quiz-set-kind="${kind}"][data-quiz-set="3"]`);
    assert.ok(button && !button.disabled, `${kind} quiz can choose Set 3`);
  }
  assert.deepEqual(errors, []);
});

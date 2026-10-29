'use strict';
// CMQ/OE Set 3: 165 original questions, released in eight reviewed batches of 20 and a final batch of 5.
// These checks cover the data contract for every batch, the completed blueprint, the learner-facing Set 3 flow and the question-navigator statuses.
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

const PLANNED = 165;
const BLUEPRINT = { 'cmq-lead': 28, 'cmq-strategy': 23, 'cmq-management': 26, 'cmq-tools': 31, 'cmq-customer': 22, 'cmq-supply': 19, 'cmq-training': 16 };
// Per-batch domain allocation; the batches sum to the 2026 BoK blueprint above.
const BATCH_COUNTS = [
  { 'cmq-lead': 4, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 2, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 3, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 4, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 2, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 3, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 2, 'cmq-management': 4, 'cmq-tools': 3, 'cmq-customer': 3, 'cmq-supply': 3, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 3, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 3, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 3, 'cmq-customer': 3, 'cmq-supply': 3, 'cmq-training': 2 },
  { 'cmq-lead': 4, 'cmq-strategy': 3, 'cmq-management': 3, 'cmq-tools': 4, 'cmq-customer': 2, 'cmq-supply': 2, 'cmq-training': 2 },
  { 'cmq-lead': 1, 'cmq-management': 1, 'cmq-tools': 1, 'cmq-customer': 1, 'cmq-supply': 1 }
];
const sizeOf = counts => Object.values(counts).reduce((a, b) => a + b, 0);
const BATCHES = BATCH_COUNTS.reduce((list, counts) => {
  const start = list.length ? list[list.length - 1].end : 0;
  return list.concat({ counts, start, end: start + sizeOf(counts) });
}, []);
const HANDBOOK = /The ASQ CMQ\/OE Handbook, 5th ed\. \(Furterer &amp; Wood\), Chapter \d+, pp?\. \d+/;
const OUTSIDE = /ASQ CMQ\/OE Body of Knowledge \(2026\), Part [IVX]+/;

const html = read('test-bank.html')
  .replace('<script src="/test-bank-cmq-set1.js"></script>', `<script>${scripts[1]}</script>`)
  .replace('<script src="/test-bank-cmq-set2.js"></script>', `<script>${scripts[2]}</script>`)
  .replace('<script src="/test-bank-cmq-set3.js"></script>', `<script>${scripts[3]}</script>`);

// Production's edge function injects the in-memory study runtime into <head>; sessions need it to start.
const sessionHtml = html.replace('</head>', () => `<script>${read('test-bank-memory-learning.js')}</script>\n</head>`);

const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (_) {} }));

async function loadPage({ withSessions = false } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(withSessions ? sessionHtml : html, {
    url: 'https://upskillsprint.com/test-bank.html', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(window) { window.HTMLElement.prototype.scrollIntoView = function () {}; }
  });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  // The simulator has been stateless since 3de2cea removed the learning ledger, so no durable-learning fixture is installed.
  return { window: dom.window, errors };
}
function click(window, element) {
  assert.ok(element, 'expected a clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

test('CMQ/OE Set 3 is complete: every batch has its declared domain counts and the total matches the blueprint', () => {
  assert.equal(SET3.length, PLANNED);
  assert.equal(BATCHES[BATCHES.length - 1].end, SET3.length, 'the declared batches account for every question');
  BATCHES.forEach(({ counts: expected, start, end }, b) => {
    const counts = {};
    SET3.slice(start, end).forEach(q => { counts[q.sub] = (counts[q.sub] || 0) + 1; });
    assert.deepEqual(counts, expected, `batch ${b + 1} domain counts`);
  });
  const totals = {};
  SET3.forEach(q => { totals[q.sub] = (totals[q.sub] || 0) + 1; });
  assert.deepEqual(totals, BLUEPRINT);
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
  BATCHES.filter(({ start, end }) => end - start === 20).forEach(({ start, end }, b) => {
    const counts = [0, 0, 0, 0];
    SET3.slice(start, end).forEach(q => { counts[q.answer] += 1; });
    assert.deepEqual(counts, [5, 5, 5, 5], `batch ${b + 1} uses each letter five times`);
  });
  const totals = [0, 0, 0, 0];
  SET3.forEach(q => { totals[q.answer] += 1; });
  assert.ok(Math.max(...totals) - Math.min(...totals) <= 1, `whole-set key is balanced (${totals.join('/')})`);
  SET3.forEach((q, i) => {
    if (i >= 2) assert.ok(!(q.answer === SET3[i - 1].answer && q.answer === SET3[i - 2].answer), `no key run of 3 ending at ${i + 1}`);
    if (i >= 1) assert.notEqual(q.sub, SET3[i - 1].sub, `questions ${i} and ${i + 1} come from different domains`);
  });
});

test('CMQ/OE lists the complete Set 3 as selectable for every mode', async () => {
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
  assert.doesNotMatch(note, /planned questions/, 'a complete Set 3 no longer shows a batch-progress note');
  // The Full Exam matches the 2026 computer-based exam: 165 scored questions in 258 minutes, so Set 3 is served in full.
  assert.equal(window.__TB.EXAMS.cmq.questions, 165);
  assert.equal(window.__TB.EXAMS.cmq.minutes, 258);
  const fullCount = Math.min(SET3.length, window.__TB.EXAMS.cmq.questions);
  assert.match(note, new RegExp(`A Full Exam currently serves ${fullCount} questions`));
  for (const kind of ['quick', 'focus']) {
    const button = window.document.querySelector(`[data-quiz-set-kind="${kind}"][data-quiz-set="3"]`);
    assert.ok(button && !button.disabled, `${kind} quiz can choose Set 3`);
  }
  assert.deepEqual(errors, []);
});

// The question navigator must show every status in the legend: slate grey unanswered, teal answered (awaiting
// grading), blue revealed (counts as incorrect), orange flag, and an outline on the current question.
const LEGEND = ['Slate grey: unanswered', 'Teal: answered, awaiting grading', 'Blue: revealed (counts as incorrect)', 'Orange: flagged for review', 'Outline: current question'];
const navCell = (window, i) => window.document.querySelectorAll('.tb-navcell')[i];
// Status classes in a stable order, so in-place updates and fresh renders compare equally.
const statusOf = cell => Array.from(cell.classList).filter(c => c !== 'tb-navcell').sort().join(' ');
const keyOf = window => {
  const stem = window.document.querySelector('.tb-stem').textContent.replace(/\s+/g, ' ').trim();
  const q = SET3.find(item => JSDOM.fragment(item.stem).textContent.replace(/\s+/g, ' ').trim() === stem);
  assert.ok(q, 'the on-screen stem is a Set 3 question');
  return q.answer;
};

test('a Set 3 Quick Quiz shows every navigator status and grades a revealed answer as incorrect', async () => {
  const { window, errors } = await loadPage({ withSessions: true });
  const doc = window.document;
  click(window, doc.querySelector('.tb-tile[data-exam="cmq"]'));
  click(window, doc.querySelector('[data-quiz-set-kind="quick"][data-quiz-set="3"]'));
  click(window, doc.querySelector('[data-count="quick"][data-n="10"]'));
  click(window, doc.querySelector('[data-mode="quick"]'));
  assert.match(doc.querySelector('.tb-diag-kick').textContent, /Quick Quiz · Set 3 · untimed/);
  const n = doc.querySelectorAll('.tb-navcell').length;
  assert.ok(n >= 4);
  const legend = doc.querySelector('.tb-status-key').textContent;
  LEGEND.forEach(label => assert.ok(legend.includes(label), `legend lists "${label}"`));
  assert.match(doc.querySelector('#tb-reveal-hint').textContent, /Revealing an answer counts that question as incorrect/);

  assert.equal(statusOf(navCell(window, 0)), 'cur', 'unanswered current question: slate grey with outline');
  click(window, doc.querySelector(`[data-opt="${keyOf(window)}"]`));                    // Q1 answered correctly
  click(window, doc.querySelector('[data-next]'));
  click(window, doc.querySelector('[data-flag]'));                                      // Q2 flagged, left unanswered
  click(window, doc.querySelector('[data-next]'));
  click(window, doc.querySelector('[data-reveal]'));                                    // Q3 revealed
  assert.ok(doc.querySelector('#tb-revealed-answer'), 'the revealed answer panel is shown');
  assert.ok(Array.from(doc.querySelectorAll('[data-opt]')).every(b => b.disabled), 'a revealed question can no longer be answered');

  assert.equal(statusOf(navCell(window, 0)), 'done');
  assert.equal(navCell(window, 0).getAttribute('aria-label'), 'Question 1, answered, awaiting grading');
  assert.equal(statusOf(navCell(window, 1)), 'flag');
  assert.equal(navCell(window, 1).getAttribute('aria-label'), 'Question 2, unanswered, flagged');
  assert.equal(statusOf(navCell(window, 2)), 'cur done revealed');
  assert.equal(navCell(window, 2).getAttribute('aria-label'), 'Question 3, answer revealed, counted as incorrect');
  assert.match(doc.querySelector('.tb-quizprog').textContent, /1 answered · 1 revealed · 1 flagged/);

  // Answer every other question correctly, including flagged Q2, then submit: only the revealed Q3 is wrong.
  click(window, navCell(window, 1));
  assert.equal(statusOf(navCell(window, 2)), 'done revealed', 'the revealed marker survives a full re-render of the navigator');
  assert.equal(statusOf(navCell(window, 1)), 'cur flag');
  click(window, doc.querySelector(`[data-opt="${keyOf(window)}"]`));
  assert.equal(statusOf(navCell(window, 1)), 'cur done flag', 'answered and flagged keep both markers');
  for (let i = 3; i < n; i += 1) {
    click(window, navCell(window, i));
    click(window, doc.querySelector(`[data-opt="${keyOf(window)}"]`));
  }
  click(window, doc.querySelector('[data-submit]'));
  assert.match(doc.getElementById('tb-overview').textContent, new RegExp(`Session score: \\d+% \\(${n - 1}/${n}\\)`), 'the revealed answer is graded as incorrect');
  assert.deepEqual(errors, []);
});

test('the Set 3 Full Exam keeps the navigator statuses: timed hides reveal, untimed offers it', async () => {
  const { window, errors } = await loadPage({ withSessions: true });
  const doc = window.document;
  click(window, doc.querySelector('.tb-tile[data-exam="cmq"]'));
  click(window, doc.querySelector('.tb-setpick [data-set="3"]'));
  click(window, doc.querySelector('[data-mode="full"]'));
  assert.match(doc.querySelector('.tb-diag-kick').textContent, /Full Exam · Set 3 · timed/);
  assert.equal(doc.querySelectorAll('.tb-navcell').length, 165);
  assert.match(doc.getElementById('tb-timer').textContent, /^4:1[78]:\d\d$/, 'the 4 h 18 min exam clock is running');
  assert.equal(doc.querySelector('[data-reveal]'), null, 'like the real exam, a timed Full Exam does not offer answer reveal');
  click(window, doc.querySelector('[data-opt="0"]'));
  click(window, doc.querySelector('[data-next]'));
  click(window, doc.querySelector('[data-flag]'));
  assert.equal(statusOf(navCell(window, 0)), 'done');
  assert.equal(statusOf(navCell(window, 1)), 'cur flag');
  const legend = doc.querySelector('.tb-status-key').textContent;
  LEGEND.forEach(label => assert.ok(legend.includes(label), `Full Exam legend lists "${label}"`));
  click(window, doc.querySelector('[data-backsim]'));

  click(window, doc.querySelector('.tb-setpick [data-set="3"]'));
  click(window, doc.querySelector('[data-timing-kind="full"][data-timed="0"]'));
  click(window, doc.querySelector('[data-mode="full"]'));
  assert.match(doc.querySelector('.tb-diag-kick').textContent, /Full Exam · Set 3 · untimed/);
  click(window, doc.querySelector('[data-reveal]'));
  assert.equal(statusOf(navCell(window, 0)), 'cur done revealed');
  assert.deepEqual(errors, []);
});

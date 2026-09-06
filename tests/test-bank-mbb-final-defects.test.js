'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const stable = o => Array.isArray(o) ? o.map(stable) : o && typeof o === 'object' ? Object.fromEntries(Object.keys(o).sort().map(k => [k, stable(o[k])])) : o;
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const sandbox = {}; sandbox.window = sandbox; vm.runInNewContext(read('test-bank-mbb-set2.js'), sandbox);
const bank = JSON.parse(JSON.stringify(sandbox.MBB_SET2));
const modules = ['test-bank-feedback-loop.js', 'test-bank-deep-feedback.js', 'test-bank-deep-feedback-grounding.js', 'test-bank-phase2-hardening.js'];
const metadata = JSON.parse(read('docs/audits/pr165-final-defect-fixes/metadata-corrections.json'));
async function page() {
  let html = read('test-bank.html');
  // Match the live script order, including the previously omitted hardening consumer.
  const selected = name => /test-bank-mbb.*\.js$/.test(name);
  html = html.replace(/<script\b[^>]*src="\/?([^"?]+)"[^>]*><\/script>/g, (tag, name) => selected(name) ? '<script>' + read(name).replace(/<\/script/gi, '<\\/script') + '</script>' : '');
  const errors = [], console = new VirtualConsole(); console.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: console});
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  dom.window.Element.prototype.scrollIntoView = function () {};
  modules.forEach(name => dom.window.eval(read(name)));
  assert.deepEqual(errors, []);
  return dom;
}
const frames = (w, n) => new Promise(resolve => { function next(i) { if (!i) return resolve(); w.requestAnimationFrame(() => next(i - 1)); } next(n); });

test('All feedback consumers use the same decimal-safe first sentence on the live core', async () => {
  const d = await page(), w = d.window;
  try {
    const examples = [
      ['The factor is 3.169865446. Discount cash.', 'The factor is 3.169865446.'],
      ['exp[-(100/250)^1.5] = 0.7764816931. Round at the end.', 'exp[-(100/250)^1.5] = 0.7764816931.'],
      ['CPI=480/550=0.872727… and EAC=$1.375M. Investigate.', 'CPI=480/550=0.872727… and EAC=$1.375M.'],
      ['<b>0.776</b> is the probability.', '0.776 is the probability.'],
      ['No punctuation at the end', 'No punctuation at the end'],
    ];
    for (const [text, expected] of examples) {
      assert.equal(w.__TB.firstFeedbackSentence(text), expected);
      assert.equal(w.__TBDeepFeedback.extractKeyPoint(text), expected);
      assert.equal(w.__TBFeedbackGrounding.literalKeyPoint(text), expected);
      assert.equal(w.__TBPhase2Hardening.keyPoint({why: text}), expected);
    }
    for (const q of bank) {
      const expected = w.__TB.feedbackKeyPoint(q);
      assert.equal(w.__TBPhase2Hardening.keyPoint(q), expected, q.qid);
      assert.equal(w.__TBDeepFeedback.extractKeyPoint(q.why), w.__TB.firstFeedbackSentence(q.why));
    }
  } finally { w.close(); }
});

test('All four loaded feedback consumers settle without competing writes, including explicit key points', async () => {
  const d = await page(), w = d.window;
  try {
    w.document.querySelector('.tb-tile.active').classList.remove('active');
    w.document.querySelector('[data-exam="mbb"]').classList.add('active');
    for (const n of [14, 49, 161]) {
      const q = w.MBB_SET2[n - 1];
      const expected = w.__TB.feedbackKeyPoint(q);
      w.document.querySelector('#tb-overview').innerHTML = `<section id="tb-feedback-loop"><article class="tb-review-card" data-question-id="${q.qid}"><div class="tb-review-stem"></div><p class="tb-key-point">stale</p></article></section>`;
      w.document.querySelector('.tb-review-stem').textContent = q.stem;
      await frames(w, 10);
      assert.equal(w.document.querySelector('.tb-key-point').textContent, expected);
      let count = 0;
      const observer = new w.MutationObserver(records => { count += records.length; });
      observer.observe(w.document.querySelector('#tb-feedback-loop'), {childList: true, subtree: true, characterData: true});
      await frames(w, 10); observer.disconnect();
      assert.equal(count, 0, `Q${n}: feedback must be quiescent after settling`);
    }
    const q = w.MBB_SET2[160];
    q.keyPoint = 'Use 0.872727… without intermediate rounding. Preserve this explicit author text.';
    await frames(w, 2); // Request a real mutation to schedule both observers.
    w.document.querySelector('.tb-key-point').textContent = 'refresh';
    await frames(w, 10);
    assert.equal(w.document.querySelector('.tb-key-point').textContent, q.keyPoint);
    let count = 0; const observer = new w.MutationObserver(m => { count += m.length; });
    observer.observe(w.document.querySelector('#tb-feedback-loop'), {childList: true, subtree: true, characterData: true});
    await frames(w, 10); observer.disconnect(); assert.equal(count, 0);
  } finally { w.close(); }
});

test('Both rationale schemas resolve per option, with explicit prose taking precedence over fallback', async () => {
  const d = await page(), w = d.window;
  try {
    for (const q of bank.slice(0, 25)) for (let i = 0; i < 4; i++) {
      const expected = w.__TB.feedbackText(q.optionRationales[i]);
      assert.equal(w.__TB.explicitOptionRationale(q, i), expected, q.qid);
      assert.equal(w.__TBDeepFeedback.distractorReason(q, i, null).text, expected);
      const result = w.__TBPhase2Hardening.optionRationale(q, i, null);
      assert.equal(result.text, expected); assert.equal(result.reviewed, true);
    }
    const q = {options: ['A','B','C','D'], answer: 0, why: 'Stored source.', optionRationales: {0: ' Primary ', 1: '  '}, distractors: {0: 'secondary', 1: ' Legacy ', 2: 'Third'}};
    assert.equal(w.__TB.explicitOptionRationale(q, 0), 'Primary');
    assert.equal(w.__TB.explicitOptionRationale(q, 1), 'Legacy');
    assert.equal(w.__TB.explicitOptionRationale(q, 2), 'Third');
    assert.equal(w.__TB.explicitOptionRationale(q, 3), '');
    assert.equal(w.__TBPhase2Hardening.optionRationale(q, 3, null).reviewed, false);
  } finally { w.close(); }
});

test('All 175 question bodies share exam/review evidence; every visual retains its data and conditions', async () => {
  const d = await page(), w = d.window;
  try {
    let charts = 0;
    const measure = (markup) => {
      const el = w.document.createElement('div'); el.innerHTML = markup;
      return {svg: el.querySelectorAll('svg').length, table: el.querySelectorAll('table').length, conditions: [...el.querySelectorAll('[class$="conditions"],.tb-student-context')].map(e => e.textContent)};
    };
    for (const q of bank) {
      const exam = w.__TB.renderQuestionContent(q, false), review = w.__TB.renderQuestionContent(q, true);
      assert.deepEqual(measure(exam), measure(review), q.qid);
      assert.match(exam, /class="tb-stem"/); assert.match(review, /class="tb-review-stem"/);
      assert.doesNotMatch(review, /class="(?:tb-source-ref|mbb[2-7]-rationales)"/);
      if (q.chart) { charts++; const m = measure(review); assert.ok(m.svg + m.table > 0, q.qid); }
      if (q.batch > 1) assert.ok(measure(review).conditions.length, q.qid);
    }
    assert.equal(charts, 66);
    assert.match(read('test-bank-deep-feedback.js'), /reviewQuestionContent\(question\).*tb-similar-options/);
    assert.equal((read('test-bank-feedback-loop.js').match(/reviewQuestionContent\(question\) \+/g) || []).length, 2);
  } finally { w.close(); }
});

test('Q136 and all activity networks export the same units as their charts', () => {
  for (const q of bank.filter(q => q.chart && q.chart.type === 'activity-network')) {
    const spec = JSON.parse(read(`test-bank-assets/mbb-160/batch-0${q.batch}/visual-specs.json`)).questions[q.qid];
    assert.equal(spec.units, q.chart.durationUnit || 'working days', q.qid);
  }
  assert.equal(JSON.parse(read('test-bank-assets/mbb-160/batch-06/visual-specs.json')).questions[bank[135].qid].units, 'working weeks');
});

test('Q161 export retains unrounded earned-value arithmetic and Q168 does not relabel residual variance', () => {
  const specs = JSON.parse(read('test-bank-assets/mbb-160/batch-07/visual-specs.json')).questions;
  for (const n of [161,168]) assert.deepEqual(specs[bank[n-1].qid].calculations, [bank[n-1].formula]);
  assert.equal(1200000 * 550 / 480, 1375000);
  assert.match(bank[160].formula, /550\/480/); assert.doesNotMatch(bank[160].formula, /1\.20\/0\.873/);
  assert.match(bank[167].formula, /not necessarily pure measurement variance/);
  assert.doesNotMatch(bank[167].formula, /repeatability 18%|Measurement contribution =/);
  assert.ok(Math.abs(Math.sqrt(.24)*100-48.98979485566356)<1e-12);
});

test('Exactly two formula-only deltas; all stems, choices, keys and other 173 records remain unchanged', () => {
  assert.equal(bank.length,175); assert.deepEqual(bank.map(q=>q.answer),metadata.answerPositions); assert.equal(bank[149].answer,3);
  assert.equal(metadata.unchangedQuestionCount,173);
  assert.deepEqual(metadata.changes.map(r=>r.qid),['mbb:set-2:original-161','mbb:set-2:original-168']);
  const untouched = bank.filter(q => !metadata.question_sha256[q.qid]);
  assert.equal(untouched.length,173);
  assert.equal(sha(JSON.stringify(stable(untouched))),metadata.unchangedQuestionsSha256);
  for (const change of metadata.changes) {
    assert.deepEqual(change.fields,['formula']); const q=bank.find(q=>q.qid===change.qid), copy={...q}; delete copy.formula;
    assert.equal(sha(JSON.stringify(stable(copy))),change.unchangedFieldsSha256,q.qid);
    assert.equal(q.formula,change.afterFormula); assert.equal(sha(JSON.stringify(q)),metadata.question_sha256[q.qid]);
  }
});

test('Only two specified visual metadata files change; all other 26 generated files remain exact', () => {
  assert.deepEqual(Object.keys(metadata.asset_sha256),['test-bank-assets/mbb-160/batch-06/visual-specs.json','test-bank-assets/mbb-160/batch-07/visual-specs.json']);
  assert.equal(Object.keys(metadata.unchangedAssetsSha256).length,26);
  for (const [file,digest] of Object.entries({...metadata.asset_sha256,...metadata.unchangedAssetsSha256})) assert.equal(sha(fs.readFileSync(path.join(root,file))),digest,file);
});

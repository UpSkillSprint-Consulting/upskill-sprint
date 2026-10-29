'use strict';

/* CQA Set 2 Batches 1–15: exercise the protected package and real learner controls. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
const AREAS = {
  I: 'cqa-fundamentals', II: 'cqa-process', III: 'cqa-competencies',
  IV: 'cqa-program', V: 'cqa-tools'
};
const COUNTS = {
  'cqa-fundamentals': 37, 'cqa-process': 45, 'cqa-competencies': 30,
  'cqa-program': 23, 'cqa-tools': 15
};
const BATCH_COUNTS = {
  1: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1},
  2: {'cqa-fundamentals': 3, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 1, 'cqa-tools': 1},
  3: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1},
  4: {'cqa-fundamentals': 3, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 1, 'cqa-tools': 1},
  5: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1},
  6: {'cqa-fundamentals': 3, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 1, 'cqa-tools': 1},
  7: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1},
  8: {'cqa-fundamentals': 3, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 1, 'cqa-tools': 1},
  9: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1},
  10: {'cqa-fundamentals': 3, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 1, 'cqa-tools': 1},
  11: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1},
  12: {'cqa-fundamentals': 3, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 1, 'cqa-tools': 1},
  13: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1},
  14: {'cqa-fundamentals': 3, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 1, 'cqa-tools': 1},
  15: {'cqa-fundamentals': 2, 'cqa-process': 3, 'cqa-competencies': 2, 'cqa-program': 2, 'cqa-tools': 1}
};
const IDS = Array.from({length: 150}, (_, i) => 'cqa:set-2:q' + String(i + 1).padStart(3, '0'));
const ORIGINAL_TABLE_IDS = ['cqa:set-2:q004', 'cqa:set-2:q005', 'cqa:set-2:q009', 'cqa:set-2:q010'];
const tick = w => new Promise(resolve => w.setTimeout(resolve, 55));
let workspace, build, packet;

function loadBanks() {
  const window = {};
  const context = vm.createContext({window, globalThis: window, self: window});
  vm.runInContext(read('test-bank-cqa-set1.js'), context);
  const previous = plain(window.CQA_SET1);
  vm.runInContext(read('test-bank-cqa-set2.js'), context);
  const base = plain(window.CQA_SET2);
  assert.equal(base.length, 140);
  vm.runInContext(read('test-bank-cqa-set2-batch15.js'), context);
  assert.deepEqual(plain(window.CQA_SET2.slice(0, 140)), base, 'Final batch preserves every preceding object');
  return {previous, first: plain(window.CQA_SET1), second: plain(window.CQA_SET2)};
}

test.before(async () => {
  // Build into an isolated directory: these tests never overwrite the release output.
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'cqa-set2-integration-'));
  for (const entry of fs.readdirSync(ROOT, {withFileTypes: true})) {
    if (entry.name.startsWith('.') || ['content', 'public-site', 'node_modules'].includes(entry.name)) continue;
    fs.symlinkSync(path.join(ROOT, entry.name), path.join(workspace, entry.name), entry.isDirectory() ? 'dir' : 'file');
  }
  // Use actual bank files with the public staging policy, without staging unrelated site pages.
  const source = path.join(workspace, 'staging-fixture');
  fs.mkdirSync(source);
  fs.writeFileSync(path.join(source, 'index.html'), '<!doctype html><title>CQA delivery fixture</title>');
  for (const name of ['test-bank.html', 'test-bank-cqa-set1.js', 'test-bank-cqa-set2.js', 'test-bank-cqa-set2-batch15.js', 'test-bank-tables.js']) {
    fs.copyFileSync(path.join(ROOT, name), path.join(source, name));
  }
  await (await import('../scripts/stage-public-site.mjs')).stagePublicSite(source, path.join(workspace, 'public-site'));
  build = await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(workspace);
  packet = JSON.parse(fs.readFileSync(path.join(build.output, 'cqa.json'), 'utf8'));
});

test.after(() => {
  if (workspace) fs.rmSync(workspace, {recursive: true, force: true});
});

async function harness() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  let closeFrames = () => {};
  const dom = new JSDOM(build.shell, {
    url: 'https://upskillsprint.com/test-bank?exam=cqa',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.scrollTo = w.alert = () => {};
      w.confirm = () => true;
      const request = w.requestAnimationFrame.bind(w), cancel = w.cancelAnimationFrame.bind(w);
      const frames = new Set();
      let closing = false;
      w.requestAnimationFrame = callback => {
        if (closing) return 0;
        const id = request(time => {frames.delete(id); if (!closing) callback(time);});
        frames.add(id);
        return id;
      };
      w.cancelAnimationFrame = id => {frames.delete(id); cancel(id);};
      closeFrames = () => {closing = true; frames.forEach(cancel); frames.clear();};
    }
  });
  const w = dom.window;
  if (w.document.readyState !== 'complete') await new Promise(resolve => w.addEventListener('load', resolve, {once: true}));
  let accessChecks = 0;
  w.__ExamAccess = {exam: 'cqa', isAssetUrl: () => false, start: action => {accessChecks++; return action();}};
  for (const source of packet.scripts) w.eval(source);
  await tick(w);
  return {w, errors, checks: () => accessChecks, close() {
    w.__TBCurrentAttemptReview?.destroy?.();
    closeFrames();
    w.close();
  }};
}

function click(w, selector) {
  const element = w.document.querySelector(selector);
  assert.ok(element, 'Expected control: ' + selector);
  assert.equal(element.disabled, false, 'Control is available: ' + selector);
  element.click();
  return element;
}
function selectSet(w, kind) {
  click(w, kind === 'full' ? '.tb-setpick [data-set="2"]' : `[data-quiz-set-kind="${kind}"][data-quiz-set="2"]`);
}
function snapshot(w, expected) {
  const result = w.__TB.getFeedbackSnapshot();
  assert.ok(result, 'A learner session started');
  assert.equal(result.examId, 'cqa');
  assert.equal(result.setId, '2');
  assert.equal(result.records.length, expected);
  assert.equal(new Set(result.records.map(record => record.question.qid)).size, expected, 'No repeated questions');
  assert.ok(result.records.every(record => IDS.includes(record.question.qid)), 'Every question belongs to released Set 2');
  return result;
}
function text(w, value) {
  const holder = w.document.createElement('div');
  holder.innerHTML = value;
  return holder.textContent.trim();
}
function rationale(q, option) {
  return q.optionRationales?.[option] || q.distractors?.[option];
}
function assertTable(holder, chart) {
  const table = holder.querySelector('.tb-q-data-table');
  assert.ok(table, 'The case document is present');
  assert.deepEqual(Array.from(table.querySelectorAll('thead th'), cell => cell.textContent), chart.columns.map(String));
  assert.deepEqual(Array.from(table.querySelectorAll('tbody tr'), row => Array.from(row.children, cell => cell.textContent)), chart.rows.map(row => row.map(String)));
}

test('Batches 1–15 contain exactly Q001–Q150, preserve Set 1, and meet each batch domain allocation', () => {
  const {previous, first, second} = loadBanks();
  assert.deepEqual(first, previous, 'Loading Set 2 must not mutate any Set 1 question or answer');
  assert.equal(first.length, 150);
  assert.deepEqual(second.map(q => q.qid), IDS);
  const all = first.concat(second);
  assert.equal(new Set(all.map(q => q.qid)).size, 300);
  const firstStems = new Set(first.map(q => q.stem.trim().toLowerCase()));
  assert.equal(new Set(second.map(q => q.stem.trim().toLowerCase())).size, 150);
  const totals = Object.fromEntries(Object.values(AREAS).map(area => [area, 0]));
  const batches = Object.fromEntries(Object.keys(BATCH_COUNTS).map(batch => [batch,
    Object.fromEntries(Object.values(AREAS).map(area => [area, 0]))]));
  for (const [index, q] of second.entries()) {
    assert.equal(q.set, 2);
    assert.equal(q.batch, Math.floor(index / 10) + 1, q.qid + ' retains its authoring batch');
    const area = AREAS[String(q.bok).split('.')[0]];
    assert.ok(area, q.qid + ' has a recognized primary BoK domain');
    totals[area]++;
    batches[q.batch][area]++;
    assert.ok(q.stem.trim() && !firstStems.has(q.stem.trim().toLowerCase()), q.qid + ' has a new stem');
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(option => option.trim().toLowerCase())).size, 4);
    assert.ok(q.options.every(option => option.trim()));
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.ok(q.why && q.keyPoint, q.qid + ' includes an explanation and learning point');
    for (let option = 0; option < 4; option++) if (option !== q.answer) {
      const explanation = rationale(q, option);
      assert.ok(typeof explanation === 'string' && explanation.trim(), q.qid + ' explains distractor ' + option);
    }
    if (q.chart?.type === 'data-table') assert.ok(q.chart.rows.every(row => row.length === q.chart.columns.length));
  }
  assert.equal(second.filter(q => q.caseId).length, 16);
  assert.equal(second.filter(q => q.chart?.type === 'data-table').length, 34);
  assert.deepEqual([0, 1, 2, 3].map(key => second.filter(q => q.answer === key).length), [38, 37, 38, 37]);
  assert.deepEqual(totals, COUNTS);
  assert.deepEqual(batches, BATCH_COUNTS);
});

test('the protected CQA runtime retains both banks and identifies Set 2 as a complete 150-question set', async () => {
  const h = await harness(), {w} = h;
  try {
    const exam = w.__TB.EXAMS.cqa;
    assert.equal(exam.bank.length, 150);
    assert.equal(exam.bank, exam.sets[1]);
    assert.equal(exam.sets[2].length, 150);
    assert.equal(exam.setPlans[2].target, 150);
    assert.equal(exam.setPlans[2].label, '150-question set complete');
    const raw = loadBanks();
    for (const [set, source] of [[1, raw.first], [2, raw.second]]) {
      assert.deepEqual(Array.from(exam.sets[set], q => q.qid), source.map(q => q.qid));
      for (let i = 0; i < source.length; i++) {
        const q = exam.sets[set][i];
        assert.equal(q.sub, AREAS[source[i].bok.split('.')[0]], q.qid + ' scores to its primary domain');
        assert.equal(q.topic || q.sub, source[i].topic || source[i].sub, q.qid + ' retains its finer topic');
        assert.equal(q.answer, source[i].answer, q.qid + ' retains its answer key');
      }
    }
    selectSet(w, 'full');
    assert.doesNotMatch(w.document.querySelector('.tb-setnote').textContent, /140 of 150|currently serves 140/);
    const fullCard = w.document.querySelector('[data-mode="full"]').closest('.tb-mode');
    assert.match(fullCard.textContent, /150 randomized questions/);
    assert.match(fullCard.textContent, /Strict 5 hr limit/);
    assert.equal(w.document.querySelector('[data-quiz-set-kind="quick"][data-quiz-set="1"]').getAttribute('aria-pressed'), 'true', 'Full Exam selection does not silently switch Quick Quiz');
    assert.deepEqual(h.errors, []);
  } finally {h.close();}
});

test('Full Exam serves all one hundred fifty items, renders every authored table, and reviews all four hundred fifty distractor explanations', async () => {
  const h = await harness(), {w} = h;
  try {
    selectSet(w, 'full');
    click(w, '[data-mode="full"]');
    const attempt = snapshot(w, 150);
    assert.equal(h.checks(), 1, 'Starting the session goes through the access gate');
    const remaining = w.document.querySelector('#tb-timer').textContent.split(':').map(Number).reduce((sum, value) => sum * 60 + value, 0);
    assert.ok(remaining > 17990 && remaining <= 18000, 'One hundred fifty questions use the existing two-minute-per-question pace');
    const expectedTableIds = loadBanks().second.filter(q => q.chart?.type === 'data-table').map(q => q.qid);
    assert.ok(ORIGINAL_TABLE_IDS.every(id => expectedTableIds.includes(id)), 'Both release-case exhibits and the original numerical tables remain present');
    const tableIds = [];
    for (const record of attempt.records) {
      click(w, `[data-goto="${record.index}"]`);
      const quiz = w.document.querySelector('.tb-quiz');
      assert.equal(quiz.querySelector('.tb-stem').textContent, record.question.stem);
      assert.equal(quiz.querySelector('.tb-review-rationales'), null, 'Distractor feedback is not exposed during the timed attempt');
      if (record.question.chart?.type === 'data-table') {
        assertTable(quiz, plain(record.question.chart));
        tableIds.push(record.question.qid);
      }
      click(w, `[data-opt="${record.question.answer}"]`);
    }
    assert.deepEqual(tableIds.sort(), expectedTableIds.sort(), 'Every authored data table renders during the attempt');
    click(w, '[data-submit]');
    await tick(w);
    const result = snapshot(w, 150);
    assert.equal(result.completed, true);
    assert.equal(result.grading.correct, 150);
    assert.equal(result.grading.total, 150);
    assert.equal(w.document.querySelector('[data-score-result]').dataset.scorePercent, '100');
    assert.equal(w.document.querySelector('[data-score-result]').dataset.sessionSet, '2');
    click(w, '[data-open-review="all"]');
    assert.equal(w.document.querySelectorAll('.tb-review-card').length, 150);
    assert.equal(w.document.querySelectorAll('.tb-review-rationales p').length, 450);
    for (const record of result.records) {
      const q = record.question;
      const card = w.document.querySelector(`.tb-review-card[data-question-id="${q.qid}"]`);
      assert.equal(card.dataset.reviewStatus, 'correct');
      assert.equal(card.querySelector('.tb-review-option.is-correct .tb-answer-copy').textContent, q.options[q.answer]);
      assert.equal(card.querySelector('.tb-explanation-copy').textContent.trim(), text(w, q.why));
      const rationales = card.querySelectorAll('.tb-review-rationales p');
      assert.equal(rationales.length, 3, q.qid + ' explains all three distractors');
      for (let option = 0; option < 4; option++) if (option !== q.answer) {
        assert.ok(card.querySelector('.tb-review-rationales').textContent.includes(text(w, rationale(q, option))), q.qid + ' shows the authored rationale for option ' + option);
      }
      if (q.chart?.type === 'data-table') assertTable(card, plain(q.chart));
    }
    assert.deepEqual(h.errors, []);
  } finally {h.close();}
});

test('Quick Quiz samples fifty of one hundred fifty questions and grades one deliberate wrong answer as 49/50', async () => {
  const h = await harness(), {w} = h;
  try {
    selectSet(w, 'quick');
    click(w, '[data-count="quick"][data-n="50"]');
    const card = w.document.querySelector('[data-mode="quick"]').closest('.tb-mode');
    assert.match(card.querySelector('.tb-mode-sum').textContent, /Random 50 questions from Set 2/);
    assert.doesNotMatch(card.querySelector('.tb-mode-sum').textContent, /Only .*currently available/);
    click(w, '[data-mode="quick"]');
    const attempt = snapshot(w, 50);
    for (const record of attempt.records) {
      click(w, `[data-goto="${record.index}"]`);
      const selected = record.index === 0 ? (record.question.answer + 1) % 4 : record.question.answer;
      click(w, `[data-opt="${selected}"]`);
    }
    click(w, '[data-submit]');
    await tick(w);
    const result = snapshot(w, 50);
    assert.equal(result.grading.correct, 49);
    assert.equal(result.grading.incorrect, 1);
    assert.equal(result.grading.unanswered, 0);
    assert.equal(w.document.querySelector('[data-score-result]').dataset.scorePercent, '98');
    assert.match(w.document.querySelector('[data-score-result]').textContent, /98% \(49\/50\)/);
    click(w, '[data-open-review="all"]');
    assert.equal(w.document.querySelectorAll('.tb-review-card[data-review-status="incorrect"]').length, 1);
    assert.equal(w.document.querySelector('.tb-review-card[data-review-status="incorrect"]').dataset.questionId, attempt.records[0].question.qid);
    assert.deepEqual(h.errors, []);
  } finally {h.close();}
});

test('Focused Quiz draws only the available Set 2 questions in each of the five domains', async () => {
  const h = await harness(), {w} = h;
  try {
    selectSet(w, 'focus');
    click(w, '[data-count="focus"][data-n="50"]');
    for (const [area, count] of Object.entries(COUNTS)) {
      const select = w.document.querySelector('[data-focusdom]');
      select.value = area;
      select.dispatchEvent(new w.Event('change', {bubbles: true}));
      click(w, '[data-mode="focus"]');
      const attempt = snapshot(w, count);
      assert.ok(attempt.records.every(record => record.question.sub === area));
      click(w, '[data-quit]');
    }
    assert.equal(h.checks(), 5);
    assert.deepEqual(h.errors, []);
  } finally {h.close();}
});

test('Set 2 diagnostic uses ten questions under the existing two-per-domain cap', async () => {
  const h = await harness(), {w} = h;
  try {
    selectSet(w, 'full');
    assert.match(w.document.querySelector('[data-diag]').textContent, /10-question diagnostic/);
    click(w, '[data-diag]');
    const attempt = snapshot(w, 10);
    const counts = {};
    for (const record of attempt.records) counts[record.question.sub] = (counts[record.question.sub] || 0) + 1;
    assert.deepEqual(counts, Object.fromEntries(Object.values(AREAS).map(area => [area, 2])));
    assert.deepEqual(h.errors, []);
  } finally {h.close();}
});

test('Set 2 questions are delivered only in CQA and remain absent from the public shell and staging', async () => {
  assert.ok(packet.scripts.includes(read('test-bank-cqa-set2.js')), 'The authorized CQA package contains the reviewed base');
  assert.ok(packet.scripts.includes(read('test-bank-cqa-set2-batch15.js')), 'The authorized CQA package contains the final batch');
  assert.ok(packet.scripts.indexOf(read('test-bank-cqa-set2-batch15.js')) > packet.scripts.indexOf(read('test-bank-cqa-set2.js')), 'Base loads before completion');
  for (const id of IDS) assert.ok(!build.shell.includes(id), 'No Set 2 question is embedded in the public shell');
  for (const exam of Object.keys(build.sizes).filter(exam => exam !== 'cqa')) {
    const other = JSON.parse(fs.readFileSync(path.join(build.output, exam + '.json'), 'utf8'));
    for (const id of IDS) assert.ok(other.scripts.every(source => !source.includes(id)), id + ' is not delivered to ' + exam);
  }
  const output = path.join(workspace, 'public-site');
  assert.equal(fs.existsSync(path.join(output, 'test-bank-cqa-set2.js')), false);
  assert.equal(fs.existsSync(path.join(output, 'test-bank-cqa-set2-batch15.js')), false);
  assert.equal(fs.existsSync(path.join(output, 'test-bank-cqa-set1.js')), false);
  assert.equal(fs.existsSync(path.join(output, 'test-bank-tables.js')), true, 'The non-question mathematical utility remains available');
  const audit = await (await import('../scripts/audit-exam-public-content.mjs')).auditExamPublicContent(output);
  assert.deepEqual(audit.findings, []);
});

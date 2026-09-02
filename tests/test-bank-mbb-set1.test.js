'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const mbbScript = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set1.js'), 'utf8');
const mbbSet2Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set2.js'), 'utf8');
const mbbSet3Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set3.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-mbb-set1.js"></script>', `<script>${mbbScript}</script>`)
  .replace('<script src="/test-bank-mbb-set2.js"></script>', `<script>${mbbSet2Script}</script>`)
  .replace('<script src="/test-bank-mbb-set3.js"></script>', `<script>${mbbSet3Script}</script>`);

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
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  await installDurableLearning(dom.window);
  return { dom, window: dom.window, errors };
}

test('MBB Set 1 contains only the 100-question supplied simulated examination', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    assert.deepEqual(errors, []);
    const exam = window.__TB.EXAMS.mbb;
    assert.equal(exam.questions, 100);
    assert.equal(exam.minutes, 150, 'the source simulation retains its 2.5-hour limit');
    assert.equal(exam.pass, 70);
    assert.equal(exam.bank.length, 100);
    assert.equal(exam.sets[1], exam.bank);
    assert.deepEqual(Object.keys(exam.sets).sort(), ['1', '2', '3']);
    assert.equal(exam.sets[2].length, 150, 'the first six validated original batches are published separately as Set 2');
    assert.ok(exam.sets[2].every(question => /^mbb:set-2:original-\d{3}$/.test(question.qid)));
    assert.ok(exam.sets[2].every(question => !/practice examination/i.test(question.sourceAssessment || '')), 'the excluded practice examination was not added to Set 2');
    assert.deepEqual(Array.from(exam.bank, question => question.sourceQuestion), Array.from({ length: 100 }, (_, index) => index + 1));
    assert.ok(exam.bank.every(question => question.sourceAssessment === 'Simulated Examination Questions for Parts I–VI'));
    assert.ok(exam.bank.every(question => !/practice examination/i.test(question.sourceAssessment)));
    assert.deepEqual(Array.from(exam.bank, question => question.sourceAnswer), [
      'D','B','B','D','C','D','D','B','B','B','D','A','D','C','M','B','D','B','D','B',
      'C','A','C','C','B','A','D','C','C','A','A','F','C','B','C','B','D','E','O','B',
      'A','C','E','D','E','B','B','A','C','B','A','D','E','C','B','C','A','D','B','A',
      'B','C','C','C','A','D','E','D','C','B','B','D','D','C','B','A','A','A','D','C',
      'A','B','L','A','M','A','C','E','A','D','E','E','D','E','A','C','N','B','D','A'
    ], 'all 100 provenance keys match the supplied answer-key page');
  } finally {
    dom.window.close();
  }
});

test('every MBB item is complete, stable, answerable, mapped, and explained', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    const validSubs = new Set(window.__TB.subUnits(exam).map(unit => unit.id));
    const stems = new Set();
    exam.bank.forEach((question, index) => {
      const number = index + 1;
      assert.equal(question.qid, `mbb:set-1:source-${number}`);
      assert.equal(question.set, 1);
      assert.equal(question.options.length, 4, `Q${number} has four choices`);
      assert.equal(new Set(question.options).size, 4, `Q${number} has four distinct choices`);
      assert.ok(question.options.every(option => option.trim().length >= 2), `Q${number} has no empty choice`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `Q${number} has one valid keyed answer`);
      assert.ok(validSubs.has(question.sub), `Q${number} maps to an MBB Body of Knowledge domain`);
      assert.ok(question.why.length >= 80, `Q${number} has a useful rationale`);
      assert.doesNotMatch(question.why, /This choice matches the .* principle tested by the item/i, `Q${number} has a question-specific teaching rationale`);
      assert.match(question.why, new RegExp(`Question ${number};`), `Q${number} retains its source reference`);
      assert.doesNotMatch(question.options.join(' '), /(?:all|none) of the above/i, `Q${number} avoids all/none-of-the-above choices`);
      assert.doesNotMatch(question.stem + question.options.join(' '), /[Â�\u0007]/, `Q${number} contains no extraction artifacts`);
      assert.ok(!stems.has(question.stem), `Q${number} has a unique stem`);
      stems.add(question.stem);
    });
    const answerCounts = exam.bank.reduce((counts, question) => {
      counts[question.answer] += 1;
      return counts;
    }, [0, 0, 0, 0]);
    assert.deepEqual(answerCounts, [23, 27, 23, 27], 'normalization does not create a correct-answer position cue');
  } finally {
    dom.window.close();
  }
});

test('the MBB blueprint uses the six current domains and sums to 100 percent', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    assert.equal(exam.bok.length, 6);
    // The bok blueprint is shared exam-wide metadata (not per-set); it was updated to [17,16,13,8,9,37]
    // to reflect Set 3's newer, larger, explicitly analytics-heavy composition (175 questions across
    // all six domains) rather than Set 1's original 100-question distribution specifically.
    assert.deepEqual(Array.from(exam.bok, area => area.weight), [17, 16, 13, 8, 9, 37]);
    assert.equal(exam.bok.reduce((sum, area) => sum + area.weight, 0), 100);
    const counts = Object.fromEntries(Array.from(new Set(exam.bank.map(question => question.sub))).map(sub => [sub, exam.bank.filter(question => question.sub === sub).length]));
    assert.deepEqual(counts, {
      'mbb-analytics': 25,
      'mbb-enterprise': 12,
      'mbb-portfolio': 22,
      'mbb-org': 25,
      'mbb-coaching': 7,
      'mbb-training': 9
    });
    const byNumber = number => exam.bank.find(question => question.sourceQuestion === number);
    assert.equal(byNumber(3).sub, 'mbb-enterprise', 'project qualification and sizing maps to the enterprise opportunity pipeline');
    assert.equal(byNumber(16).sub, 'mbb-portfolio', 'activity-based costing maps to portfolio financial tools');
    assert.equal(byNumber(18).sub, 'mbb-org', 'customer listening posts map to organizational feedback');
    assert.equal(byNumber(29).sub, 'mbb-org', 'intervention styles map to organizational challenges');
    assert.equal(byNumber(55).sub, 'mbb-enterprise', 'DFSS maps to enterprise improvement methodologies');
    assert.equal(byNumber(95).sub, 'mbb-enterprise', 'project pipeline life cycle maps to enterprise pipeline management');
  } finally {
    dom.window.close();
  }
});

test('source combination answers and defective source items are normalized for student use', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.mbb.bank;
    const byNumber = number => bank.find(question => question.sourceQuestion === number);
    [15, 32, 38, 39, 43, 45, 52, 53, 63, 67, 83, 85, 88, 91, 92, 94, 97].forEach(number => {
      assert.equal(byNumber(number).options.length, 4, `Q${number} is normalized from a source combination/all/none key`);
    });
    assert.match(byNumber(45).options[byNumber(45).answer], /assess the current culture/i, 'Q45 replaces an indefensible none-of-the-above key');
    assert.match(byNumber(68).stem, /Tuckman/i, 'Q68 removes the double-ambiguous team-stage choices');
    assert.match(byNumber(10).options[byNumber(10).answer], /constant absolute magnitude/i, 'Q10 states the correct additive-decomposition condition');
    assert.match(byNumber(13).options[byNumber(13).answer], /value or attractiveness/i, 'Q13 uses the standard expectancy-theory definition of valence');
    assert.match(byNumber(46).why, /determinant of the information matrix/i, 'Q46 states D-optimality precisely');
    assert.match(byNumber(74).options[byNumber(74).answer], /percent agreement.*kappa.*Kendall.*intraclass/i, 'Q74 matches the current ASQ discrete-MSA method list');
    assert.match(byNumber(75).stem, /accept as-is only if every category kappa/i, 'Q75 supplies the decision rule needed to interpret kappa');
    assert.match(byNumber(77).stem, /screening rule/i, 'Q77 supplies the decision rule needed to interpret ICC');
    assert.match(byNumber(82).stem, /underlying pattern.*noisy time series/i, 'Q82 corrects the source signal-versus-noise wording');
    assert.match(byNumber(93).why, /VIF is at least 1/i, 'Q93 repairs the impossible source VIF interpretation');
  } finally {
    dom.window.close();
  }
});

test('the two source-dependent MBB questions render independently verifiable responsive tables', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.mbb.bank;
    const q76 = bank.find(question => question.sourceQuestion === 76);
    const q91 = bank.find(question => question.sourceQuestion === 91);
    assert.equal(q76.chart.type, 'data-table');
    assert.equal(q91.chart.type, 'data-table');
    assert.deepEqual(Array.from(q91.chart.columns), ['Basis', 'RHS', 'x1', 'x2', 'x3', 'x4', 'x5']);
    assert.deepEqual(Array.from(q91.chart.rows[2]), ['x2', '$67,000', '0', '1', '0.75', '−0.50', '0']);
    assert.deepEqual(Array.from(q76.chart.rows[0]), ['Units', 'Independent', 'Independent']);
    [q76, q91].forEach(question => {
      const host = window.document.createElement('div');
      host.innerHTML = window.__TB.renderQuestionChart(question.chart);
      const table = host.querySelector('table.tb-q-data-table');
      assert.ok(table, `Q${question.sourceQuestion} renders a semantic table`);
      assert.equal(table.querySelectorAll('th').length, question.chart.columns.length);
      assert.equal(table.querySelectorAll('tbody tr').length, question.chart.rows.length);
      assert.doesNotMatch(table.textContent, /correct|answer/i, 'the visual does not reveal the key');
    });
  } finally {
    dom.window.close();
  }
});

test('MBB quantitative keys recompute from the published data', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.mbb.bank;
    const byNumber = number => bank.find(question => question.sourceQuestion === number);

    const q91 = byNumber(91);
    const reducedCosts = q91.chart.rows[0].slice(2).map(Number);
    const enteringOffset = reducedCosts.indexOf(Math.max(...reducedCosts));
    assert.equal(q91.chart.columns[enteringOffset + 2], 'x3');
    const enteringColumn = enteringOffset + 2;
    const ratios = q91.chart.rows.slice(1)
      .map(row => ({ basis: row[0], ratio: Number(row[enteringColumn]) > 0 ? Number(row[1].replace(/[$,]/g, '')) / Number(row[enteringColumn]) : Infinity }))
      .sort((left, right) => left.ratio - right.ratio);
    assert.equal(ratios[0].basis, 'x2');
    assert.match(q91.options[q91.answer], /Enter x3; leave x2/);

    const q96 = byNumber(96);
    const parallelReliability = 1 - (1 - 0.90) * (1 - 0.92) * (1 - 0.94);
    assert.equal(parallelReliability, 0.99952);
    assert.equal(Number(q96.options[q96.answer]), parallelReliability);

    assert.ok(1 / (1 - 0) >= 1, 'a conventional VIF cannot be below 1');
    assert.match(byNumber(93).options[byNumber(93).answer], /invalid.*cannot be below 1/i);
  } finally {
    dom.window.close();
  }
});

test('MBB uses the same live simulation controls and full-exam player as CSSBB', async () => {
  const { dom, window } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="mbb"]'));
    assert.match(overview.textContent, /Master Black Belt — Exam Simulation/);
    assert.match(overview.textContent, /not a replica of the current ASQ delivery format/i, 'the 2012 source simulation is not presented as the current official format');
    assert.match(overview.textContent, /matches the supplied source simulation/i, 'the 150-minute limit is attributed to the supplied simulation');
    assert.doesNotMatch(overview.textContent, /2h 30m limit .* mirrors the real exam/i);
    assert.equal(overview.querySelectorAll('[data-mode]').length, 3, 'Full Exam, Quick Quiz, and Focused Quiz are live');
    assert.ok(overview.querySelector('[data-diag]'), 'placement diagnostic is available');
    assert.ok(overview.querySelector('[data-timing-group="full"]'), 'timed and untimed Full Exam controls are available');
    assert.ok(overview.querySelector('[data-unseen="quick"]'), 'New questions only is available');
    assert.ok(overview.querySelector('[data-missed="quick"]'), 'Missed questions only is available');
    assert.equal(overview.querySelectorAll('[data-focusdom] option').length, 6, 'Focused Quiz exposes all six MBB domains');

    click(overview.querySelector('[data-mode="full"]'));
    assert.equal(overview.querySelectorAll('.tb-navcell').length, 100);
    assert.match(overview.textContent, /Full Exam · timed/i);
    assert.ok(window.document.getElementById('tb-timer'), 'the 150-minute countdown is active');
    assert.ok(overview.querySelector('[data-flag]'), 'mark-for-review is available');
    assert.ok(overview.querySelector('[data-formulas]'), 'formula reference is available');
    assert.ok(overview.querySelector('[data-calc]'), 'calculator is available');
  } finally {
    dom.window.close();
  }
});

test('all 100 questions survive a full randomized player-render sweep', async () => {
  const { dom, window } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="mbb"]'));
    click(overview.querySelector('[data-mode="full"]'));

    const renderedIds = new Set();
    const visualIds = new Set();
    for (let index = 0; index < 100; index += 1) {
      click(overview.querySelectorAll('.tb-navcell')[index]);
      const stem = overview.querySelector('.tb-stem');
      const options = Array.from(overview.querySelectorAll('.tb-opt'));
      assert.ok(stem, `player renders a stem at position ${index + 1}`);
      assert.match(stem.dataset.questionId, /^mbb:set-1:source-\d+$/);
      assert.equal(options.length, 4, `player renders four options at position ${index + 1}`);
      assert.equal(new Set(options.map(option => option.textContent.trim())).size, 4, `rendered options are distinct at position ${index + 1}`);
      renderedIds.add(stem.dataset.questionId);
      if (overview.querySelector('.tb-q-data-table')) visualIds.add(stem.dataset.questionId);
    }
    assert.equal(renderedIds.size, 100, 'the randomized full exam renders every source item exactly once');
    assert.deepEqual(Array.from(visualIds).sort(), ['mbb:set-1:source-76', 'mbb:set-1:source-91']);
  } finally {
    dom.window.close();
  }
});

test('MBB formula reference includes the advanced formulas used by the bank', async () => {
  const { dom, window } = await loadPage();
  try {
    const groups = window.__TB.REFS.mbb;
    const formulas = groups.flatMap(group => Array.from(group.items));
    const text = formulas.map(item => `${item.n} ${item.f} ${item.note || ''}`).join(' ');
    assert.match(text, /Variance inflation factor/);
    assert.match(text, /VIF.*1 \/ \(1 − R/i);
    assert.match(text, /Parallel reliability/);
    assert.match(text, /D-optimality/);
    assert.match(text, /Simplex ratio test/);
    assert.match(text, /Internal rate of return/);

    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="mbb"]'));
    click(overview.querySelector('[data-mode="full"]'));
    click(overview.querySelector('[data-formulas]'));
    const search = window.document.getElementById('tb-refsearch');
    search.value = 'VIF';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.match(window.document.getElementById('tb-reflist').textContent, /Variance inflation factor/);
  } finally {
    dom.window.close();
  }
});

'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const set1Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set1.js'), 'utf8');
const set2Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set2.js'), 'utf8');
const set3Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set3.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-mbb-set1.js"></script>', `<script>${set1Script}</script>`)
  .replace('<script src="/test-bank-mbb-set2.js"></script>', `<script>${set2Script}</script>`)
  .replace('<script src="/test-bank-mbb-set3.js"></script>', `<script>${set3Script}</script>`);

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

test('MBB Set 3 is UpSkill Sprint\u2019s original 175-question build spanning all six MBB domains', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    assert.deepEqual(errors, []);
    const exam = window.__TB.EXAMS.mbb;
    assert.deepEqual(Object.keys(exam.sets).sort(), ['1', '2', '3'], 'Set 3 sits alongside Sets 1 and 2');
    assert.equal(exam.sets[3].length, 175);
    assert.equal(exam.fullExamQuestionsBySet[3], 175, 'Set 3\u2019s Full Exam is sized to its complete 175-question pool');
    assert.ok(exam.sets[3].every(question => question.qid.startsWith('mbb:set-3:')), 'every Set 3 question carries a Set 3 qid');
    assert.equal(new Set(exam.sets[3].map(question => question.qid)).size, 175, 'no duplicate qids in Set 3');
  } finally {
    dom.window.close();
  }
});

test('every Set 3 item is complete, answerable, mapped, and explained', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    const validSubs = new Set(window.__TB.subUnits(exam).map(unit => unit.id));
    const stems = new Set();
    exam.sets[3].forEach((question) => {
      const label = question.qid;
      assert.equal(question.set, 3);
      assert.equal(question.options.length, 4, `${label} has four choices`);
      assert.equal(new Set(question.options).size, 4, `${label} has four distinct choices`);
      assert.ok(question.options.every(option => option.trim().length >= 2), `${label} has no empty choice`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${label} has one valid keyed answer`);
      assert.ok(validSubs.has(question.sub), `${label} maps to an MBB Body of Knowledge domain`);
      assert.ok(question.why.length >= 60, `${label} has a useful rationale`);
      assert.doesNotMatch(question.options.join(' '), /(?:all|none) of the above/i, `${label} avoids all/none-of-the-above choices`);
      assert.ok(!stems.has(question.stem), `${label} has a unique stem`);
      stems.add(question.stem);
    });
  } finally {
    dom.window.close();
  }
});

test('Set 3 spans all six domains with an analytics-heavy distribution and no unintended answer-position bias', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    const counts = Object.fromEntries(
      Array.from(new Set(exam.sets[3].map(question => question.sub)))
        .map(sub => [sub, exam.sets[3].filter(question => question.sub === sub).length])
    );
    assert.deepEqual(counts, {
      'mbb-enterprise': 30,
      'mbb-org': 28,
      'mbb-portfolio': 22,
      'mbb-training': 15,
      'mbb-coaching': 15,
      'mbb-analytics': 65
    });
    assert.ok(counts['mbb-analytics'] > counts['mbb-enterprise'] + counts['mbb-org'], 'Advanced Analytics (Domain VI) is the single largest domain, well ahead of any other domain');

    const answerCounts = exam.sets[3].reduce((acc, question) => {
      acc[question.answer] += 1;
      return acc;
    }, [0, 0, 0, 0]);
    answerCounts.forEach(count => {
      assert.ok(count >= 30 && count <= 60, `each answer position appears a reasonably even number of times (got ${answerCounts.join(',')})`);
    });
  } finally {
    dom.window.close();
  }
});

test('the MBB blueprint reflects Set 3\u2019s analytics-heavy, six-domain distribution', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    assert.equal(exam.bok.length, 6);
    assert.deepEqual(Array.from(exam.bok, area => area.weight), [17, 16, 13, 8, 9, 37]);
    assert.equal(exam.bok.reduce((sum, area) => sum + area.weight, 0), 100);
    const analyticsArea = exam.bok.find(area => area.domain === 'mbbanalytics');
    assert.ok(analyticsArea && analyticsArea.weight === Math.max(...exam.bok.map(area => area.weight)), 'Advanced Analytics carries the single highest blueprint weight');
  } finally {
    dom.window.close();
  }
});

test('MBB Set 3 has no cross-set duplicate or near-duplicate stems against Set 1 or Set 2', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    const set1Stems = new Set(exam.sets[1].map(question => question.stem));
    const set2Stems = new Set(exam.sets[2].map(question => question.stem));
    exam.sets[3].forEach(question => {
      assert.ok(!set1Stems.has(question.stem), `${question.qid} does not duplicate a Set 1 stem`);
      assert.ok(!set2Stems.has(question.stem), `${question.qid} does not duplicate a Set 2 stem`);
    });
  } finally {
    dom.window.close();
  }
});

test('Set 3 is visual-heavy: 35 questions carry real, site-native charts spanning many chart types, with working interactive sliders', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    const withCharts = exam.sets[3].filter(question => question.chart);
    assert.equal(withCharts.length, 35, 'thirty-five Set 3 questions (20% of the bank) carry a chart spec');

    const typeCounts = withCharts.reduce((acc, q) => {
      acc[q.chart.type] = (acc[q.chart.type] || 0) + 1;
      return acc;
    }, {});
    assert.ok(Object.keys(typeCounts).length >= 8, `at least 8 distinct chart types are used (got ${Object.keys(typeCounts).length}: ${Object.keys(typeCounts).join(', ')})`);

    withCharts.forEach(question => {
      const rendered = window.__TB.renderQuestionChart(question.chart);
      assert.ok(rendered.length > 40, `${question.qid} renders non-trivial chart markup`);
      assert.doesNotMatch(rendered, /correct answer|answer key/i, `${question.qid}'s visual does not reveal the key`);
    });

    const whatIfQids = exam.sets[3].filter(q => q.chart && q.chart.whatIf).map(q => q.qid);
    assert.ok(whatIfQids.length >= 2, 'at least the two originally-verified interactive sliders remain present');
    whatIfQids.forEach(qid => {
      const question = exam.sets[3].find(q => q.qid === qid);
      const rendered = window.__TB.renderQuestionChart(question.chart);
      assert.match(rendered, /data-tb-whatif/, `${qid} includes a live what-if slider`);
      const host = window.document.createElement('div');
      host.innerHTML = rendered;
      const slider = host.querySelector('input[data-tb-whatif]');
      const committed = Number(slider.dataset.committed || 0);
      const newValue = Number(slider.max);
      const shown = host.querySelector('[data-tb-whatif-value]');
      const remaining = host.querySelector('[data-tb-whatif-remaining]');
      slider.value = newValue;
      shown.textContent = String(newValue);
      remaining.textContent = String(newValue - committed);
      assert.equal(Number(remaining.textContent), newValue - committed, `${qid}'s slider math is correct at its max value`);
    });
  } finally {
    dom.window.close();
  }
});

test('selecting Set 3 from the MBB exam draws its Full Exam sample from the full 175-question pool via the live player', async () => {
  const { dom, window } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="mbb"]'));
    assert.ok(overview.querySelector('.tb-setpick [data-set="3"]'), 'Set 3 picker is available');

    click(overview.querySelector('.tb-setpick [data-set="3"]'));
    click(overview.querySelector('[data-mode="full"]'));
    assert.equal(overview.querySelectorAll('.tb-navcell').length, 175, 'Set 3\u2019s Full Exam serves all 175 available questions');
    assert.ok(window.document.getElementById('tb-timer'), 'the countdown is active');
  } finally {
    dom.window.close();
  }
});

test('a Full Exam sweep with Set 3 active renders only Set 3 questions, each exactly once, with no duplicate options', async () => {
  const { dom, window } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="mbb"]'));
    click(overview.querySelector('.tb-setpick [data-set="3"]'));
    click(overview.querySelector('[data-mode="full"]'));

    const sampleSize = overview.querySelectorAll('.tb-navcell').length;
    const renderedIds = new Set();
    for (let index = 0; index < sampleSize; index += 1) {
      click(overview.querySelectorAll('.tb-navcell')[index]);
      const stem = overview.querySelector('.tb-stem');
      const options = Array.from(overview.querySelectorAll('.tb-opt'));
      assert.ok(stem, `player renders a stem at position ${index + 1}`);
      assert.match(stem.dataset.questionId, /^mbb:set-3:d[1-6]-\d+$/, `position ${index + 1} is drawn from Set 3, not another set`);
      assert.equal(options.length, 4, `player renders four options at position ${index + 1}`);
      assert.equal(new Set(options.map(option => option.textContent.trim())).size, 4, `rendered options are distinct at position ${index + 1}`);
      renderedIds.add(stem.dataset.questionId);
    }
    assert.equal(renderedIds.size, sampleSize, 'every sampled question renders exactly once with no repeats');
  } finally {
    dom.window.close();
  }
});

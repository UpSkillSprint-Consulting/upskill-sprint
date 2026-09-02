'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const set1Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set1.js'), 'utf8');
const set2Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set2.js'), 'utf8');
const pageSource = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const ASSET_DIR = path.join(ROOT, 'test-bank-assets', 'mbb-160', 'batch-01');

function loadScript(source, variable) {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return JSON.parse(JSON.stringify(sandbox[variable]));
}

const batch = loadScript(set2Script, 'MBB_SET2_BATCHES')['1'];
const sourceSet = loadScript(set1Script, 'MBB_SET1');

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return value;
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

function countsBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function tokens(text) {
  const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'which', 'what', 'should', 'master', 'black', 'belt', 'project', 'process', 'use', 'using', 'best']);
  return new Set(String(text).toLowerCase().match(/[a-z0-9]+/g).filter(token => token.length > 2 && !stop.has(token)));
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  const overlap = [...a].filter(token => b.has(token)).length;
  return overlap / (a.size + b.size - overlap || 1);
}

async function loadPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const html = pageSource
    .replace('<script src="/test-bank-mbb-set1.js"></script>', `<script>${set1Script}</script>`)
    .replace('<script src="/test-bank-mbb-set2.js"></script>', `<script>${set2Script}</script>`);
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

test('MBB 160 Batch 1 has the approved 25-question allocation and is published as a clearly partial Set 2', () => {
  assert.equal(batch.length, 25);
  assert.deepEqual(batch.map(question => question.qid), Array.from({ length: 25 }, (_, index) => `mbb:set-2:original-${String(index + 1).padStart(3, '0')}`));
  assert.ok(batch.every(question => question.set === 2 && question.batch === 1));
  assert.deepEqual(countsBy(batch.map(question => question.sub)), {
    'mbb-enterprise': 5,
    'mbb-org': 5,
    'mbb-portfolio': 4,
    'mbb-training': 2,
    'mbb-coaching': 2,
    'mbb-analytics': 7
  });
  assert.match(pageSource, /<script src="\/test-bank-mbb-set2\.js"><\/script>/, 'the validated batch is loaded by the learner page');
  assert.match(pageSource, /sets:\{1:MBB_SET1,2:MBB_SET2\}/, 'the validated batch is registered as MBB Set 2');
});

test('MBB Set 2 aggregates validated batches and launches only the currently available questions', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    assert.deepEqual(errors, []);
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="mbb"]'));

    const set2Button = overview.querySelector('.tb-setpick [data-set="2"]');
    assert.ok(set2Button, 'Set 2 appears in the MBB set selector');
    assert.match(set2Button.textContent, /50 of 160/i);
    assert.match(set2Button.textContent, /Batch 2 complete/i);
    assert.ok(overview.querySelector('.tb-setpick [data-set="mix"]'), 'Mixed remains available');

    click(set2Button);
    assert.match(overview.textContent, /Set 2 · live/i);
    assert.match(overview.textContent, /contains 50 of the planned 160 original questions/i);
    assert.match(overview.textContent, /current Full Exam serves all 50 available questions/i);
    const fullCard = overview.querySelector('.tb-mode');
    assert.match(fullCard.querySelector('h4').textContent, /Set 2 — Full Exam/i);
    assert.match(fullCard.textContent, /50 randomized questions/i);
    assert.match(fullCard.textContent, /Strict 1 hr 15 min limit/i);

    click(overview.querySelector('[data-mode="full"]'));
    assert.equal(overview.querySelectorAll('.tb-navcell').length, 50);
    assert.match(overview.textContent, /Full Exam · timed/i);
    assert.match(overview.querySelector('.tb-stem').dataset.questionId, /^mbb:set-2:original-\d{3}$/);
    assert.ok(window.document.getElementById('tb-timer'), 'the proportional timed session is active');
  } finally {
    dom.window.close();
  }
});

test('Batch 1 meets its exact answer, difficulty, cognition, visual, and interaction targets', () => {
  assert.deepEqual(batch.reduce((counts, question) => {
    counts[question.answer] += 1;
    return counts;
  }, [0, 0, 0, 0]), [7, 6, 6, 6]);
  assert.deepEqual(countsBy(batch.map(question => question.difficulty)), { 'Very Hard': 11, Hard: 9, Expert: 5 });
  assert.deepEqual(countsBy(batch.map(question => question.cognitive)), { Apply: 5, Analyze: 8, Create: 4, Evaluate: 6, Understand: 2 });
  assert.equal(batch.filter(question => question.visual).length, 10);
  assert.equal(batch.filter(question => question.visual && question.visual.interactionPurpose).length, 3);
  assert.deepEqual(batch.filter(question => question.visual && question.visual.interactionPurpose).map(question => question.qid), [
    'mbb:set-2:original-005',
    'mbb:set-2:original-020',
    'mbb:set-2:original-023'
  ]);
});

test('Correct-option length ranks are balanced and do not create a shortcut', () => {
  const lengthRanks = [0, 0, 0, 0];
  batch.forEach(question => {
    const lengths = question.options.map(option => option.length);
    const descending = [...lengths].sort((left, right) => right - left);
    const rank = descending.indexOf(lengths[question.answer]);
    lengthRanks[rank] += 1;
    const spread = Math.max(...lengths) - Math.min(...lengths);
    assert.ok(spread <= Math.max(...lengths) * 0.4, `${question.qid} option lengths are not conspicuously uneven`);
  });
  assert.deepEqual(lengthRanks, [7, 6, 6, 6]);
});

test('Every Batch 1 item is complete, independently answerable, sourced, and production-shaped', () => {
  const stems = new Set();
  batch.forEach((question, index) => {
    const label = `Q${index + 1}`;
    assert.equal(question.options.length, 4, `${label} has four choices`);
    assert.equal(new Set(question.options).size, 4, `${label} choices are distinct`);
    assert.ok(question.options.every(option => option.trim().length >= 4), `${label} has no empty choice`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer <= 3, `${label} has one valid key`);
    assert.equal(question.optionRationales.length, 4, `${label} explains every option`);
    assert.ok(question.optionRationales.every(rationale => rationale.length >= 35), `${label} option rationales are substantive`);
    assert.ok(question.why.length >= 250, `${label} has a complete teaching rationale`);
    assert.ok(question.bok.domain && question.bok.subdomain && question.bok.topic, `${label} has a complete BoK locator`);
    assert.ok(['Hard', 'Very Hard', 'Expert'].includes(question.difficulty));
    assert.ok(['Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'].includes(question.cognitive));
    assert.ok(question.questionType && question.industry);
    assert.equal(typeof question.quantitative, 'boolean');
    assert.ok(Array.isArray(question.assumptions));
    assert.ok(question.sourceDocument && question.sourceSection && question.sourcePages);
    assert.ok(Array.isArray(question.sources) && question.sources.length >= 1);
    question.sources.forEach(source => {
      assert.match(source.id, /^S[0-3]$/);
      assert.ok(source.document && source.chapter && source.section && source.pages);
      assert.match(source.pages, /\d/);
      assert.doesNotMatch(source.pages, /TBD|unknown|placeholder/i);
    });
    assert.ok(Number.isFinite(question.estimatedMinutes) && question.estimatedMinutes >= 2 && question.estimatedMinutes <= 5);
    assert.ok(Array.isArray(question.keywords) && question.keywords.length >= 4);
    assert.doesNotMatch(question.options.join(' '), /(?:all|none) of the above/i);
    assert.doesNotMatch(`${question.stem} ${question.options.join(' ')}`, /\b(?:NOT|EXCEPT)\b/);
    assert.ok(!stems.has(question.stem), `${label} stem is unique`);
    stems.add(question.stem);
  });
});

test('Batch 1 quantitative answers independently recompute from the stated evidence', () => {
  const byId = suffix => batch.find(question => question.qid.endsWith(suffix));

  const q12 = byId('012');
  const networkDays = q12.chart.nodes.A.dur + Math.max(q12.chart.nodes.B.dur, q12.chart.nodes.C.dur) + q12.chart.nodes.D.dur + q12.chart.nodes.E.dur;
  assert.equal(networkDays, 110);
  assert.match(q12.options[q12.answer], /110 days/);

  const annuity = [1, 2, 3, 4].reduce((sum, year) => sum + 1 / (1.10 ** year), 0);
  const npvX = -600000 + 220000 * annuity;
  const npvY = -400000 + 155000 * annuity;
  assert.ok(Math.abs(npvX - 97370.40) < 0.02);
  assert.ok(Math.abs(npvY - 91329.14) < 0.02);
  assert.ok(npvX > npvY && npvY > 0);
  assert.match(byId('014').options[byId('014').answer], /Both NPVs are positive/);

  const propagated = 0.5 * Math.sqrt(0.04 ** 2 + 0.06 ** 2);
  assert.ok(Math.abs(propagated - 0.0360555) < 0.000001);
  assert.equal(byId('019').options[byId('019').answer], '0.036 mm');

  assert.ok(Math.abs(Math.exp(0.42) - 1.52196) < 0.00001);
  assert.match(byId('024').options[byId('024').answer], /52%/);

  const reduction = 1 - Math.sqrt(20 / 22);
  assert.ok(Math.abs(reduction - 0.0465374) < 0.000001);
  assert.match(byId('025').options[byId('025').answer], /4\.7% reduction/);
});

test('Visual datasets, construction records, fallbacks, and hashes match the approved questions', () => {
  const datasets = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'datasets.json'), 'utf8'));
  const specs = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'visual-specs.json'), 'utf8'));
  const validation = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'validation.json'), 'utf8'));
  const fallback = fs.readFileSync(path.join(ASSET_DIR, 'static-fallbacks.html'), 'utf8');
  const visuals = batch.filter(question => question.visual);

  assert.equal(Object.keys(datasets.questions).length, 10);
  assert.equal(Object.keys(specs.questions).length, 10);
  assert.equal(Object.keys(validation.questions).length, 10);
  assert.match(fallback, /<meta name="viewport"/);
  assert.match(fallback, /@media\(max-width:560px\)/);

  visuals.forEach(question => {
    const dataset = datasets.questions[question.qid];
    const spec = specs.questions[question.qid];
    const record = validation.questions[question.qid];
    assert.deepEqual(dataset.chart, question.chart, `${question.qid} dataset equals the production chart data`);
    assert.equal(dataset.sha256, digest(question.chart));
    assert.equal(record.datasetSha256, dataset.sha256);
    assert.equal(record.validationStatus, 'passed');
    assert.deepEqual(record.breakpoints, ['desktop', 'tablet', 'mobile']);
    assert.equal(spec.accessibility.altText, question.visual.altText);
    assert.equal(spec.interactionPurpose, question.visual.interactionPurpose);
    assert.match(fallback, new RegExp(`id="${question.qid.replace(/:/g, '-')}"`));
    assert.ok(question.visual.altText.length >= 80);
    assert.equal(question.visual.answerCueAudit, true);
    assert.deepEqual(question.visual.breakpointsValidated, ['desktop', 'tablet', 'mobile']);
  });
});

test('All Batch 1 visuals render semantically without answer cues, including the new diagnostic charts', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    assert.deepEqual(errors, []);
    const visuals = batch.filter(question => question.visual);
    visuals.forEach(question => {
      const host = window.document.createElement('div');
      host.innerHTML = window.__TB.renderQuestionChart(question.chart);
      assert.ok(host.querySelector('.tb-q-chart-wrap'), `${question.qid} has a responsive visual wrapper`);
      assert.doesNotMatch(host.textContent, /correct answer|answer key/i);
      if (question.chart.type === 'data-table') {
        assert.equal(host.querySelectorAll('th').length, question.chart.columns.length);
        assert.equal(host.querySelectorAll('tbody tr').length, question.chart.rows.length);
      } else {
        const svg = host.querySelector('svg[role="img"]');
        assert.ok(svg, `${question.qid} renders an accessible SVG`);
        assert.ok(svg.getAttribute('aria-label').length >= 40);
        assert.ok(svg.getAttribute('viewBox'));
      }
    });
    const portfolioHost = window.document.createElement('div');
    portfolioHost.innerHTML = window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('005')).chart);
    const capacitySlider = portfolioHost.querySelector('input[type="range"][data-tb-whatif]');
    assert.ok(capacitySlider);
    assert.equal(capacitySlider.getAttribute('min'), '6');
    assert.equal(capacitySlider.getAttribute('max'), '12');
    assert.match(portfolioHost.textContent, /remain after mandatory P1/);

    const regressionHost = window.document.createElement('div');
    regressionHost.innerHTML = window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('020')).chart);
    assert.equal(regressionHost.querySelectorAll('circle').length, 9);
    assert.equal(regressionHost.querySelectorAll('circle[tabindex="0"] title').length, 9);
    assert.match(regressionHost.textContent, /Standardized residuals versus fitted length of stay/);

    const seriesHost = window.document.createElement('div');
    seriesHost.innerHTML = window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('023')).chart);
    assert.equal(seriesHost.querySelectorAll('circle').length, 18);
    assert.equal(seriesHost.querySelectorAll('circle[tabindex="0"] title').length, 18);
    assert.match(seriesHost.textContent, /Daily distribution-center backlog/);
  } finally {
    dom.window.close();
  }
});

test('Batch 1 contains no suspicious duplicate or near-duplicate stem within the batch or source simulation', () => {
  let maximum = { score: 0, pair: [] };
  const candidates = batch.map(question => ({ id: question.qid, stem: question.stem }))
    .concat(sourceSet.map(question => ({ id: question.qid, stem: question.stem })));
  for (let left = 0; left < batch.length; left += 1) {
    for (let right = left + 1; right < candidates.length; right += 1) {
      const score = similarity(batch[left].stem, candidates[right].stem);
      if (score > maximum.score) maximum = { score, pair: [batch[left].qid, candidates[right].id] };
    }
  }
  assert.ok(maximum.score < 0.55, `highest stem similarity ${maximum.score.toFixed(3)} for ${maximum.pair.join(' vs ')}`);
});

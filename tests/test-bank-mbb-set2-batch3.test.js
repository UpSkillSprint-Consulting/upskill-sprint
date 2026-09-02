'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const set1Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set1.js'), 'utf8');
const set2Script = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set2.js'), 'utf8');
const pageSource = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const ASSET_DIR = path.join(ROOT, 'test-bank-assets', 'mbb-160', 'batch-03');

function loadScript(source, variable) {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return JSON.parse(JSON.stringify(sandbox[variable]));
}

const batches = loadScript(set2Script, 'MBB_SET2_BATCHES');
const batch = batches['3'];
const earlierQuestions = batches['1'].concat(batches['2']);
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

function createRenderer() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const source = pageSource.replace(/<script\b[^>]*\bsrc=(['"])[\s\S]*?<\/script>/gi, '');
  const dom = new JSDOM(source, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  assert.deepEqual(errors, []);
  assert.ok(dom.window.__TB && typeof dom.window.__TB.renderQuestionChart === 'function');
  return dom;
}

test('MBB 160 Batch 3 has the exact frozen blueprint allocation', () => {
  assert.equal(batch.length, 25);
  assert.deepEqual(batch.map(question => question.qid), Array.from({ length: 25 }, (_, index) => `mbb:set-2:original-${String(index + 51).padStart(3, '0')}`));
  assert.ok(batch.every(question => question.set === 2 && question.batch === 3));
  assert.deepEqual(countsBy(batch.map(question => question.sub)), {
    'mbb-enterprise': 5,
    'mbb-org': 5,
    'mbb-portfolio': 4,
    'mbb-training': 2,
    'mbb-coaching': 2,
    'mbb-analytics': 7
  });
  assert.deepEqual(batch.reduce((counts, question) => {
    counts[question.answer] += 1;
    return counts;
  }, [0, 0, 0, 0]), [6, 6, 7, 6]);
  assert.deepEqual(countsBy(batch.map(question => question.difficulty)), { Hard: 9, 'Very Hard': 11, Expert: 5 });
  assert.deepEqual(countsBy(batch.map(question => question.cognitive)), { Analyze: 8, Evaluate: 6, Create: 4, Apply: 5, Understand: 2 });
  assert.equal(batch.filter(question => question.visual).length, 10);
  assert.deepEqual(batch.filter(question => question.visual && question.visual.interactionPurpose).map(question => question.qid), [
    'mbb:set-2:original-056',
    'mbb:set-2:original-061',
    'mbb:set-2:original-071'
  ]);
});

test('Batch 3 option lengths do not reveal the key', () => {
  const correctLengthRanks = [0, 0, 0, 0];
  batch.forEach(question => {
    const lengths = question.options.map(option => option.length);
    const descending = [...lengths].sort((left, right) => right - left);
    correctLengthRanks[descending.indexOf(lengths[question.answer])] += 1;
    assert.ok(Math.max(...lengths) - Math.min(...lengths) <= Math.max(...lengths) * 0.4, `${question.qid} option lengths are conspicuously uneven`);
  });
  assert.deepEqual(correctLengthRanks, [6, 6, 7, 6]);
});

test('Every Batch 3 item is complete, independently answerable, and source traceable', () => {
  const stems = new Set();
  batch.forEach((question, index) => {
    const label = `Q${index + 51}`;
    assert.equal(question.options.length, 4, `${label} has four choices`);
    assert.equal(new Set(question.options).size, 4, `${label} choices are distinct`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer <= 3, `${label} has one valid key`);
    assert.equal(question.optionRationales.length, 4, `${label} explains every option`);
    assert.ok(question.optionRationales.every(rationale => rationale.length >= 35), `${label} option rationales are substantive`);
    assert.ok(question.why.length >= 250, `${label} has a complete teaching rationale`);
    assert.ok(question.why.includes(`<b>${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer]}</b>`), `${label} rationale identifies its keyed choice`);
    assert.ok(question.bok.domain && question.bok.subdomain && question.bok.topic, `${label} has a complete BoK locator`);
    assert.ok(['Hard', 'Very Hard', 'Expert'].includes(question.difficulty));
    assert.ok(['Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'].includes(question.cognitive));
    assert.ok(question.questionType && question.industry);
    assert.equal(typeof question.quantitative, 'boolean');
    assert.ok(Array.isArray(question.assumptions) && question.assumptions.length >= 1);
    assert.ok(question.sourceDocument && question.sourceSection && question.sourcePages);
    assert.ok(Array.isArray(question.sources) && question.sources.length >= 1);
    assert.equal(new Set(question.sources.map(source => source.id)).size, question.sources.length, `${label} source IDs are unique`);
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

test('Batch 3 quantitative keys and visual data independently recompute', () => {
  const bySuffix = suffix => batch.find(question => question.qid.endsWith(suffix));

  const available = 12 - 4;
  const candidates = [{ id: 'A', months: 5, value: 1.8 }, { id: 'B', months: 4, value: 1.5 }, { id: 'D', months: 3, value: 0.9 }];
  const feasible = [];
  for (let mask = 0; mask < 2 ** candidates.length; mask += 1) {
    const selected = candidates.filter((_, index) => mask & (1 << index));
    const months = selected.reduce((sum, item) => sum + item.months, 0);
    if (months <= available) feasible.push({ ids: selected.map(item => item.id).join(''), value: selected.reduce((sum, item) => sum + item.value, 0) });
  }
  const best = feasible.sort((left, right) => right.value - left.value)[0];
  assert.deepEqual(best, { ids: 'AD', value: 2.7 });
  assert.match(bySuffix('061').options[bySuffix('061').answer], /R, A, and D.*\$3\.10 million/);

  const npv = -1200000 + 420000 * 3.1699;
  assert.ok(Math.abs(npv - 131358) < 1e-8);
  assert.match(bySuffix('064').options[bySuffix('064').answer], /positive \$131,000/);

  const grr = Math.sqrt(0.8 ** 2 + 0.6 ** 2 + 1.0 ** 2);
  const total = Math.sqrt(grr ** 2 + 4.5 ** 2);
  assert.ok(Math.abs(grr - Math.sqrt(2)) < 1e-12);
  assert.ok(Math.abs(100 * grr / total - 29.9813) < 0.001);
  assert.match(bySuffix('069').options[bySuffix('069').answer], /1\.414.*30\.0%/);

  const weibullTail = Math.exp(-((8 / 4) ** 1.4));
  assert.ok(Math.abs(weibullTail - 0.0714315) < 0.000001);
  assert.equal(bySuffix('070').chart.counts.reduce((sum, count) => sum + count, 0), 200);
  assert.equal(bySuffix('070').chart.counts.slice(-2).reduce((sum, count) => sum + count, 0), 14);
  assert.match(bySuffix('070').options[bySuffix('070').answer], /roughly 7\.1%/);

  const acf = bySuffix('071');
  assert.ok(Math.abs(1.96 / Math.sqrt(100) - acf.chart.confidence) < 1e-12);
  assert.deepEqual(acf.chart.values.map(value => Math.abs(value) > acf.chart.confidence), [true, true, true, false, false, false, false, false, false, false]);

  const interaction = bySuffix('072').chart;
  assert.equal(interaction.lowLine[1] - interaction.lowLine[0], -4);
  assert.equal(interaction.highLine[1] - interaction.highLine[0], -18);

  const simulation = bySuffix('073').chart;
  assert.equal(simulation.counts.reduce((sum, count) => sum + count, 0), 2000);
  assert.equal(simulation.counts.slice(0, 4).reduce((sum, count) => sum + count, 0), 310);
  assert.equal(310 / 2000, 0.155);

  const bibd = bySuffix('074').chart.rows;
  const blocks = [1, 2, 3, 4].map(column => bibd.filter(row => row[column] === 'Test').map(row => row[0]));
  assert.deepEqual(blocks.map(block => block.length), [3, 3, 3, 3]);
  const treatments = ['A', 'B', 'C', 'D'];
  treatments.forEach(treatment => assert.equal(blocks.filter(block => block.includes(treatment)).length, 3));
  for (let left = 0; left < treatments.length; left += 1) {
    for (let right = left + 1; right < treatments.length; right += 1) {
      assert.equal(blocks.filter(block => block.includes(treatments[left]) && block.includes(treatments[right])).length, 2);
    }
  }
});

test('Batch 3 retained datasets, specs, validation, and fallbacks match production data', () => {
  const datasets = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'datasets.json'), 'utf8'));
  const specs = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'visual-specs.json'), 'utf8'));
  const validation = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'validation.json'), 'utf8'));
  const fallback = fs.readFileSync(path.join(ASSET_DIR, 'static-fallbacks.html'), 'utf8');
  const visuals = batch.filter(question => question.visual);

  assert.equal(datasets.batch, 3);
  assert.equal(Object.keys(datasets.questions).length, 10);
  assert.equal(Object.keys(specs.questions).length, 10);
  assert.equal(Object.keys(validation.questions).length, 10);
  assert.match(fallback, /<meta name="viewport"/);
  assert.match(fallback, /@media\(max-width:560px\)/);
  assert.match(fallback, /Batch 3 visual fallbacks/);

  visuals.forEach(question => {
    const dataset = datasets.questions[question.qid];
    const spec = specs.questions[question.qid];
    const record = validation.questions[question.qid];
    assert.deepEqual(dataset.chart, question.chart);
    assert.equal(dataset.sha256, digest(question.chart));
    assert.equal(record.datasetSha256, dataset.sha256);
    assert.equal(record.validationStatus, 'passed');
    assert.deepEqual(record.breakpoints, ['desktop', 'tablet', 'mobile']);
    assert.equal(spec.accessibility.altText, question.visual.altText);
    assert.equal(spec.interactionPurpose, question.visual.interactionPurpose);
    assert.match(fallback, new RegExp(`id="${question.qid.replace(/:/g, '-')}`));
    assert.ok(question.visual.altText.length >= 80);
    assert.equal(question.visual.answerCueAudit, true);
    assert.deepEqual(question.visual.breakpointsValidated, ['desktop', 'tablet', 'mobile']);
    assert.match(question.visual.datasetRef, /batch-03\/datasets\.json/);
  });
});

test('Every Batch 3 visual renders accessibly without key cues', () => {
  const dom = createRenderer();
  try {
    batch.filter(question => question.visual).forEach(question => {
      const host = dom.window.document.createElement('div');
      host.innerHTML = dom.window.__TB.renderQuestionChart(question.chart);
      assert.ok(host.querySelector('.tb-q-chart-wrap'));
      assert.doesNotMatch(host.textContent, /correct answer|answer key/i);
      assert.doesNotMatch(host.innerHTML, /NaN|undefined/);
      if (question.chart.type === 'data-table') {
        assert.equal(host.querySelectorAll('th').length, question.chart.columns.length);
        assert.equal(host.querySelectorAll('tbody tr').length, question.chart.rows.length);
      } else {
        const svg = host.querySelector('svg[role="img"]');
        assert.ok(svg);
        assert.ok(svg.getAttribute('aria-label').length >= 40);
        assert.ok(svg.getAttribute('viewBox'));
      }
    });

    const timeHost = dom.window.document.createElement('div');
    timeHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('056')).chart);
    assert.equal(timeHost.querySelectorAll('circle[tabindex="0"] title').length, 8);

    const portfolioHost = dom.window.document.createElement('div');
    portfolioHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('061')).chart);
    const slider = portfolioHost.querySelector('input[type="range"][data-tb-whatif]');
    assert.equal(slider.getAttribute('min'), '8');
    assert.equal(slider.getAttribute('max'), '16');
    assert.equal(slider.getAttribute('value'), '12');
    assert.match(portfolioHost.textContent, /8 BB-months remain after mandatory Project R/);

    ['070', '073'].forEach(suffix => {
      const question = batch.find(item => item.qid.endsWith(suffix));
      const host = dom.window.document.createElement('div');
      host.innerHTML = dom.window.__TB.renderQuestionChart(question.chart);
      assert.equal(host.querySelectorAll('rect.tb-chart-box').length, question.chart.counts.length);
      assert.match(host.textContent, new RegExp(question.chart.referenceLabel.replace('$', '\\$')));
    });

    const acfHost = dom.window.document.createElement('div');
    acfHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('071')).chart);
    assert.equal(acfHost.querySelectorAll('rect[tabindex="0"] title').length, 10);
    assert.match(acfHost.textContent, /Autocorrelation diagnostic/);

    const interactionHost = dom.window.document.createElement('div');
    interactionHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('072')).chart);
    assert.equal(interactionHost.querySelectorAll('polyline.tb-chart-line').length, 2);
  } finally {
    dom.window.close();
  }
});

test('Batch 3 has no suspicious duplicate stem within the bank or source simulation', () => {
  let maximum = { score: 0, pair: [] };
  const comparison = earlierQuestions.concat(sourceSet).map(question => ({ id: question.qid, stem: question.stem }));
  const candidates = batch.map(question => ({ id: question.qid, stem: question.stem }));
  for (let left = 0; left < candidates.length; left += 1) {
    for (let right = left + 1; right < candidates.length; right += 1) {
      const score = similarity(candidates[left].stem, candidates[right].stem);
      if (score > maximum.score) maximum = { score, pair: [candidates[left].id, candidates[right].id] };
    }
    comparison.forEach(other => {
      const score = similarity(candidates[left].stem, other.stem);
      if (score > maximum.score) maximum = { score, pair: [candidates[left].id, other.id] };
    });
  }
  assert.ok(maximum.score < 0.55, `highest stem similarity ${maximum.score.toFixed(3)} for ${maximum.pair.join(' vs ')}`);
});

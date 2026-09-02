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
const ASSET_DIR = path.join(ROOT, 'test-bank-assets', 'mbb-160', 'batch-02');

function loadScript(source, variable) {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return JSON.parse(JSON.stringify(sandbox[variable]));
}

const batches = loadScript(set2Script, 'MBB_SET2_BATCHES');
const batch = batches['2'];
const earlierQuestions = batches['1'];
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

test('MBB 160 Batch 2 has the exact approved blueprint allocation', () => {
  assert.equal(batch.length, 25);
  assert.deepEqual(batch.map(question => question.qid), Array.from({ length: 25 }, (_, index) => `mbb:set-2:original-${String(index + 26).padStart(3, '0')}`));
  assert.ok(batch.every(question => question.set === 2 && question.batch === 2));
  assert.deepEqual(countsBy(batch.map(question => question.sub)), {
    'mbb-enterprise': 5,
    'mbb-org': 5,
    'mbb-portfolio': 4,
    'mbb-training': 3,
    'mbb-coaching': 3,
    'mbb-analytics': 5
  });
  assert.deepEqual(batch.reduce((counts, question) => {
    counts[question.answer] += 1;
    return counts;
  }, [0, 0, 0, 0]), [6, 7, 6, 6]);
  assert.deepEqual(countsBy(batch.map(question => question.difficulty)), { Hard: 9, 'Very Hard': 11, Expert: 5 });
  assert.deepEqual(countsBy(batch.map(question => question.cognitive)), { Apply: 5, Analyze: 7, Understand: 3, Create: 4, Evaluate: 6 });
  assert.equal(batch.filter(question => question.visual).length, 9);
  assert.deepEqual(batch.filter(question => question.visual && question.visual.interactionPurpose).map(question => question.qid), [
    'mbb:set-2:original-031',
    'mbb:set-2:original-036',
    'mbb:set-2:original-049'
  ]);
});

test('Batch 2 option lengths do not reveal the key', () => {
  const correctLengthRanks = [0, 0, 0, 0];
  batch.forEach(question => {
    const lengths = question.options.map(option => option.length);
    const descending = [...lengths].sort((left, right) => right - left);
    correctLengthRanks[descending.indexOf(lengths[question.answer])] += 1;
    assert.ok(Math.max(...lengths) - Math.min(...lengths) <= Math.max(...lengths) * 0.4, `${question.qid} option lengths are conspicuously uneven`);
  });
  assert.deepEqual(correctLengthRanks, [6, 7, 6, 6]);
});

test('Every Batch 2 item is complete, independently answerable, and source traceable', () => {
  const stems = new Set();
  batch.forEach((question, index) => {
    const label = `Q${index + 26}`;
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
    assert.equal(new Set(question.sources.map(source => source.id)).size, question.sources.length, `${label} source IDs are distinct`);
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

test('Batch 2 quantitative keys and plotted values independently recompute', () => {
  const bySuffix = suffix => batch.find(question => question.qid.endsWith(suffix));

  const expected = { A: 0.80 * 0.95, B: 2.40 * 0.65, C: 0.70 * 0.90, D: 1.80 * 0.80 };
  assert.ok(Math.abs(expected.A + expected.B + expected.C - 2.95) < 1e-12);
  assert.ok(expected.A + expected.B + expected.C > expected.A + expected.C + expected.D);
  assert.match(bySuffix('036').options[bySuffix('036').answer], /\$2\.95 million/);

  assert.equal(480 / 600, 0.8);
  assert.ok(Math.abs(480 / 540 - 0.8888889) < 1e-7);
  assert.match(bySuffix('037').options[bySuffix('037').answer], /SPI = 0\.80 and CPI = 0\.89/);

  const gradient = [-12 * (-1 - 0.5), -4 * (1 + 0.5)];
  assert.deepEqual(gradient, [18, -6]);
  assert.match(bySuffix('048').options[bySuffix('048').answer], /Increase A and decrease B/);
  bySuffix('048').chart.contours.forEach(contour => {
    const responseAtAEndpoint = 90 - 6 * contour.radiusX ** 2;
    const responseAtBEndpoint = 90 - 2 * contour.radiusY ** 2;
    assert.ok(Math.abs(responseAtAEndpoint - contour.level) < 0.0015);
    assert.ok(Math.abs(responseAtBEndpoint - contour.level) < 0.0015);
  });

  const reliability = bySuffix('049');
  reliability.chart.xTicks.forEach((hours, index) => {
    const component = Math.exp(-((hours / 2500) ** 1.5));
    const series = component ** 2;
    const parallel = 1 - (1 - component) ** 2;
    assert.ok(Math.abs(reliability.chart.series[0].points[index][1] - series) < 0.00006);
    assert.ok(Math.abs(reliability.chart.series[1].points[index][1] - parallel) < 0.00006);
  });
  assert.match(reliability.options[reliability.answer], /0\.603.*0\.950/);
});

test('Batch 2 retained datasets, specs, validation, and static fallbacks match production data', () => {
  const datasets = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'datasets.json'), 'utf8'));
  const specs = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'visual-specs.json'), 'utf8'));
  const validation = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'validation.json'), 'utf8'));
  const fallback = fs.readFileSync(path.join(ASSET_DIR, 'static-fallbacks.html'), 'utf8');
  const visuals = batch.filter(question => question.visual);

  assert.equal(datasets.batch, 2);
  assert.equal(Object.keys(datasets.questions).length, 9);
  assert.equal(Object.keys(specs.questions).length, 9);
  assert.equal(Object.keys(validation.questions).length, 9);
  assert.match(fallback, /<meta name="viewport"/);
  assert.match(fallback, /@media\(max-width:560px\)/);
  assert.match(fallback, /Batch 2 visual fallbacks/);

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
  });
});

test('Every Batch 2 visual renders accessibly without key cues', () => {
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
    timeHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('031')).chart);
    assert.equal(timeHost.querySelectorAll('circle[tabindex="0"] title').length, 12);

    const portfolioHost = dom.window.document.createElement('div');
    portfolioHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('036')).chart);
    const slider = portfolioHost.querySelector('input[type="range"][data-tb-whatif]');
    assert.equal(slider.getAttribute('min'), '8');
    assert.equal(slider.getAttribute('max'), '16');
    assert.equal(slider.getAttribute('value'), '12');
    assert.match(portfolioHost.textContent, /8 FTE remain after mandatory Project A/);

    const contourHost = dom.window.document.createElement('div');
    contourHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('048')).chart);
    assert.equal(contourHost.querySelectorAll('ellipse').length, 3);
    assert.equal(contourHost.querySelectorAll('circle[tabindex="0"] title').length, 1);
    assert.match(contourHost.textContent, /Response-surface contour plot/);

    const reliabilityHost = dom.window.document.createElement('div');
    reliabilityHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('049')).chart);
    assert.equal(reliabilityHost.querySelectorAll('circle[tabindex="0"] title').length, 10);
    assert.equal(reliabilityHost.querySelectorAll('path.tb-chart-line').length, 2);
    assert.match(reliabilityHost.textContent, /Mission 1000 h/);
  } finally {
    dom.window.close();
  }
});

test('Batch 2 has no suspicious duplicate stem within the bank or source simulation', () => {
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

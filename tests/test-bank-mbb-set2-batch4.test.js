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
const ASSET_DIR = path.join(ROOT, 'test-bank-assets', 'mbb-160', 'batch-04');

function loadScript(source, variable) {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return JSON.parse(JSON.stringify(sandbox[variable]));
}

const batches = loadScript(set2Script, 'MBB_SET2_BATCHES');
const batch = batches['4'];
const earlierQuestions = batches['1'].concat(batches['2'], batches['3']);
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
  dom.window.eval(fs.readFileSync(path.join(ROOT, 'test-bank-mbb-batch4-ui.js'), 'utf8'));
  assert.deepEqual(errors, []);
  assert.ok(dom.window.__TB && typeof dom.window.__TB.renderQuestionChart === 'function');
  return dom;
}

test('MBB 160 Batch 4 has the exact frozen blueprint allocation', () => {
  assert.equal(batch.length, 25);
  assert.deepEqual(batch.map(question => question.qid), Array.from({ length: 25 }, (_, index) => `mbb:set-2:original-${String(index + 76).padStart(3, '0')}`));
  assert.ok(batch.every(question => question.set === 2 && question.batch === 4));
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
  }, [0, 0, 0, 0]), [6, 6, 6, 7]);
  assert.deepEqual(countsBy(batch.map(question => question.difficulty)), { Hard: 9, 'Very Hard': 11, Expert: 5 });
  assert.deepEqual(countsBy(batch.map(question => question.cognitive)), {"Analyze": 9, "Evaluate": 11, "Apply": 5});
  assert.equal(batch.filter(question => question.visual).length, 9);
  assert.deepEqual(batch.filter(question => question.visual && question.visual.interactionPurpose).map(question => question.qid), [
    'mbb:set-2:original-084',
    'mbb:set-2:original-096',
    'mbb:set-2:original-097'
  ]);
});

test('Batch 4 option lengths do not reveal the key', () => {
  // Editorial length-rank quotas cannot justify distorted statistical wording.
  // Detect a systematic longest-answer shortcut; item-level plausibility is tracked separately.
  let correctLongest=0;
  batch.forEach(question => {
    const lengths=question.options.map(s=>s.length);
    if (lengths[question.answer]===Math.max(...lengths)) correctLongest++;
    assert.ok(lengths.every(n=>n>=35 && n<=450),question.qid+' reasonable answer length');
    assert.equal(new Set(question.options.map(s=>s.toLowerCase().replace(/[^a-z0-9]/g,''))).size,4);
  });
  assert.ok(correctLongest<=12,'no systematic longest-answer key');
});

test('Every Batch 4 item is complete, independently answerable, and source traceable', () => {
  const stems = new Set();
  batch.forEach((question, index) => {
    const label = `Q${index + 76}`;
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
    assert.doesNotMatch(`${question.sourceDocument} ${question.sourceSection}`, /SPEC DATA SCHEMA/i);
    assert.ok(Array.isArray(question.sources) && question.sources.length >= 1);
    assert.equal(new Set(question.sources.map(source => source.id)).size, question.sources.length, `${label} source IDs are unique`);
    question.sources.forEach(source => {
      assert.match(source.id, /^S[0-3]$/);
      assert.ok(source.document && source.chapter && source.section && source.pages);
      assert.match(source.pages, /\d/);
      assert.doesNotMatch(source.pages, /TBD|unknown|placeholder/i);
      assert.doesNotMatch(source.document, /SPEC DATA SCHEMA/i);
    });
    assert.ok(Number.isFinite(question.estimatedMinutes) && question.estimatedMinutes >= 2 && question.estimatedMinutes <= 5);
    assert.ok(Array.isArray(question.keywords) && question.keywords.length >= 4);
    assert.doesNotMatch(question.options.join(' '), /(?:all|none) of the above/i);
    assert.doesNotMatch(`${question.stem} ${question.options.join(' ')}`, /\b(?:NOT|EXCEPT)\b/);
    assert.ok(!stems.has(question.stem), `${label} stem is unique`);
    stems.add(question.stem);
  });
});

test('Batch 4 quantitative keys and visual data independently recompute', () => {
  const bySuffix = suffix => batch.find(question => question.qid.endsWith(suffix));

  const earnedValue = { bac: 2.4, pv: 1.2, ev: 0.96, ac: 1.2 };
  assert.equal(earnedValue.ev / earnedValue.ac, 0.8);
  assert.equal(earnedValue.ev / earnedValue.pv, 0.8);
  assert.ok(Math.abs(earnedValue.bac / (earnedValue.ev / earnedValue.ac) - 3) < 1e-12);
  assert.match(bySuffix('087').options[bySuffix('087').answer], /CPI = 0\.80, SPI = 0\.80, and EAC = \$3\.00 million/);

  assert.equal(10 * 60000 / 60, 10000);
  assert.match(bySuffix('089').options[bySuffix('089').answer], /released capacity or a soft benefit/);

  const readiness = bySuffix('084').chart;
  assert.equal(readiness.series[0].data.at(-1), 9);
  assert.equal(readiness.series[1].data.at(-1), 3.5);
  assert.ok(readiness.series[0].data.at(-1) >= readiness.referenceValue);
  assert.ok(readiness.series[1].data.at(-1) < readiness.referenceValue);

  const bias = bySuffix('096').chart.points;
  const meanBias = bias.reduce((sum, point) => sum + point.residual, 0) / bias.length;
  const slope = (bias.at(-1).residual - bias[0].residual) / (bias.at(-1).fitted - bias[0].fitted);
  assert.ok(Math.abs(meanBias - 0.2) < 1e-12);
  assert.ok(Math.abs(slope + 0.04) < 1e-12);

  const growth = bySuffix('097').chart;
  growth.points.forEach(point => assert.ok(Math.abs(point.time / point.failures - point.mtbf) < 0.04));
  assert.deepEqual([growth.event.time, growth.event.resumeTime], [800, 1200]);

  const mixture = bySuffix('098').chart;
  const remaining = 1 - mixture.lowerBounds.reduce((sum, value) => sum + value, 0);
  const pseudo = mixture.point.map((value, index) => (value - mixture.lowerBounds[index]) / remaining);
  assert.deepEqual(pseudo.map(value => Number(value.toFixed(2))), [0.5, 0.25, 0.25]);
  assert.equal(Number(pseudo.reduce((sum, value) => sum + value, 0).toFixed(12)), 1);

  const designs = bySuffix('099').chart.rows.map(row => ({ id: row[0], rank: Number(row[2]), lackOfFit: Number(row[3]), determinant: Number(row[4].replace(',', '')) }));
  assert.equal(designs.find(design => design.rank < 6).determinant, 0);
  const eligible = designs.filter(design => design.rank === 6 && design.lackOfFit >= 1).sort((left, right) => right.determinant - left.determinant);
  assert.equal(eligible[0].id, 'R');

  const robust = bySuffix('100').chart.rows.map(row => {
    const values = row.slice(1, 5).map(Number);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const sampleS = Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1));
    return { id: row[0], mean, sampleS };
  });
  const closest = [...robust].sort((left, right) => Math.abs(left.mean - 54) - Math.abs(right.mean - 54) || left.sampleS - right.sampleS)[0];
  assert.equal(closest.id, 'I3');
  assert.ok(Math.abs(closest.sampleS - 0.81649658) < 0.000001);
});

test('Batch 4 retained datasets, specs, validation, and fallbacks match production data', () => {
  const datasets = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'datasets.json'), 'utf8'));
  const specs = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'visual-specs.json'), 'utf8'));
  const validation = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'validation.json'), 'utf8'));
  const fallback = fs.readFileSync(path.join(ASSET_DIR, 'static-fallbacks.html'), 'utf8');
  const visuals = batch.filter(question => question.visual);

  assert.equal(datasets.batch, 4);
  assert.equal(Object.keys(datasets.questions).length, 9);
  assert.equal(Object.keys(specs.questions).length, 9);
  assert.equal(Object.keys(validation.questions).length, 9);
  assert.match(fallback, /<meta name="viewport"/);
  assert.match(fallback, /overflow-x:auto/);
  assert.match(fallback, /Batch 4 visual fallbacks/);

  visuals.forEach(question => {
    const dataset = datasets.questions[question.qid];
    const spec = specs.questions[question.qid];
    const record = validation.questions[question.qid];
    assert.deepEqual(dataset.chart, question.chart);
    assert.equal(dataset.sha256, digest(question.chart));
    assert.equal(record.datasetSha256, dataset.sha256);
    assert.equal(record.validationStatus, 'semantic-checks-passed');
    assert.deepEqual(record.breakpoints, []);
    assert.match(record.validationScope, /[Bb]rowser|[Bb]reakpoint|[Mm]arkup/);
    assert.equal(spec.accessibility.altText, question.visual.altText);
    assert.equal(spec.interactionPurpose, question.visual.interactionPurpose);
    assert.match(fallback, new RegExp(`id="${question.qid.replace(/:/g, '-')}`));
    assert.ok(question.visual.altText.length >= 80);
    assert.equal(question.visual.answerCueAudit, false); // Browser/content findings are kept in the tracker, not self-certifying metadata.
    assert.deepEqual(question.visual.breakpointsValidated, []);
    assert.match(question.visual.datasetRef, /batch-04\/datasets\.json/);
  });
});

test('Every Batch 4 visual renders accessibly without key cues', () => {
  const dom = createRenderer();
  try {
    batch.filter(question => question.visual).forEach(question => {
      const host = dom.window.document.createElement('div');
      host.innerHTML = dom.window.__TB.renderQuestionChart(question.chart);
      assert.ok(host.querySelector('.mbb4-evidence'));
      assert.doesNotMatch(host.textContent, /correct answer|answer key/i);
      assert.doesNotMatch(host.innerHTML, /NaN|undefined/);
      if (question.chart.type === 'data-table') {
        assert.equal(host.querySelector('table').querySelectorAll('thead th').length, question.chart.columns.length);
        assert.equal(host.querySelector('table').querySelectorAll('tbody tr').length, question.chart.rows.length);
      } else {
        const svg = host.querySelector('svg[role="img"]');
        assert.ok(svg);
        assert.ok(svg.getAttribute('aria-label').length >= 40);
        assert.ok(svg.getAttribute('viewBox'));
      }
    });

    const leadershipHost = dom.window.document.createElement('div');
    leadershipHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('084')).chart);
    assert.equal(leadershipHost.querySelectorAll('[tabindex="0"] title').length, 16);
    assert.match(leadershipHost.textContent, /Competence threshold/);

    const biasHost = dom.window.document.createElement('div');
    biasHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('096')).chart);
    assert.equal(biasHost.querySelectorAll('circle[tabindex="0"] title').length, 5);

    const growthHost = dom.window.document.createElement('div');
    growthHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('097')).chart);
    assert.equal(growthHost.querySelectorAll('circle[tabindex="0"] title').length, 5);
    assert.match(growthHost.textContent, /correction installed; intervening tests retained/);

    const simplexHost = dom.window.document.createElement('div');
    simplexHost.innerHTML = dom.window.__TB.renderQuestionChart(batch.find(question => question.qid.endsWith('098')).chart);
    assert.equal(simplexHost.querySelectorAll('circle').length, 1);
    assert.match(simplexHost.textContent, /Feasible-region coordinates/);
  } finally {
    dom.window.close();
  }
});

test('Batch 4 has no suspicious duplicate stem within the bank or source simulation', () => {
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

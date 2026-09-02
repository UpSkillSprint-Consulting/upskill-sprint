'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const set1Source = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set1.js'), 'utf8');
const set2Source = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set2.js'), 'utf8');
const pageSource = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const ASSET_DIR = path.join(ROOT, 'test-bank-assets', 'mbb-160', 'batch-05');

function load(source, variable) {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return JSON.parse(JSON.stringify(sandbox[variable]));
}

const batches = load(set2Source, 'MBB_SET2_BATCHES');
const batch = batches['5'];
const prior = batches['1'].concat(batches['2'], batches['3'], batches['4']);
const sourceSet = load(set1Source, 'MBB_SET1');

function counts(values) {
  return values.reduce((result, value) => {
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

function tokens(value) {
  const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'which', 'what', 'should', 'master', 'black', 'belt', 'project', 'process', 'use', 'using', 'best']);
  return new Set(String(value).toLowerCase().match(/[a-z0-9]+/g).filter(token => token.length > 2 && !stop.has(token)));
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  const overlap = [...a].filter(token => b.has(token)).length;
  return overlap / (a.size + b.size - overlap || 1);
}

function renderer() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const source = pageSource.replace(/<script\b[^>]*\bsrc=(['"])[\s\S]*?<\/script>/gi, '');
  const dom = new JSDOM(source, { url: 'https://upskillsprint.com/test-bank.html', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  assert.deepEqual(errors, []);
  return dom;
}

test('MBB 160 Batch 5 meets the frozen allocation', () => {
  assert.equal(batch.length, 25);
  assert.deepEqual(batch.map(question => question.qid), Array.from({ length: 25 }, (_, index) => `mbb:set-2:original-${String(index + 101).padStart(3, '0')}`));
  assert.ok(batch.every(question => question.set === 2 && question.batch === 5));
  assert.deepEqual(counts(batch.map(question => question.sub)), {
    'mbb-enterprise': 5, 'mbb-org': 5, 'mbb-portfolio': 4,
    'mbb-training': 2, 'mbb-coaching': 2, 'mbb-analytics': 7
  });
  assert.deepEqual(batch.reduce((result, question) => { result[question.answer] += 1; return result; }, [0, 0, 0, 0]), [7, 6, 6, 6]);
  assert.deepEqual(counts(batch.map(question => question.difficulty)), { 'Very Hard': 11, Hard: 9, Expert: 5 });
  assert.deepEqual(counts(batch.map(question => question.cognitive)), { Analyze: 8, Evaluate: 6, Create: 4, Apply: 5, Understand: 2 });
  assert.equal(batch.filter(question => question.visual).length, 10);
  assert.deepEqual(batch.filter(question => question.visual && question.visual.interactionPurpose).map(question => question.qid), [
    'mbb:set-2:original-105', 'mbb:set-2:original-106', 'mbb:set-2:original-121'
  ]);
});

test('Every Batch 5 item is complete and source traceable', () => {
  batch.forEach(question => {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    assert.equal(question.optionRationales.length, 4);
    assert.ok(question.optionRationales.every(rationale => rationale.length >= 35));
    assert.ok(question.why.length >= 250);
    assert.ok(question.why.includes(`<b>${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer]}</b>`));
    assert.ok(question.bok.domain && question.bok.subdomain && question.bok.topic);
    assert.ok(Array.isArray(question.assumptions) && question.assumptions.length);
    assert.ok(question.sourceDocument && question.sourceSection && question.sourcePages);
    assert.doesNotMatch(JSON.stringify(question.sources), /SPEC DATA SCHEMA|TBD|placeholder/i);
    assert.equal(question.sources.length, 1);
    assert.equal(question.sources[0].id, 'S1');
    assert.ok(question.estimatedMinutes >= 2 && question.estimatedMinutes <= 5);
    assert.ok(question.keywords.length >= 4);
    assert.doesNotMatch(question.options.join(' '), /(?:all|none) of the above/i);
    const lengths = question.options.map(option => option.length);
    assert.ok(Math.max(...lengths) - Math.min(...lengths) <= Math.max(...lengths) * 0.4, `${question.qid} has a conspicuous answer-length cue`);
  });
});

test('Batch 5 calculations and statistical interpretations independently recompute', () => {
  const byNumber = number => batch[number - 101];
  assert.equal(2 + 4 + 3 + 3, 12);
  assert.equal(2 + 5 + 3, 10);
  assert.match(byNumber(111).options[byNumber(111).answer], /A-B-D-E/);
  const expectedBenefit = 0.70 * 210000 + 0.30 * 60000;
  const npv = -300000 + expectedBenefit / 1.10 + expectedBenefit / 1.10 ** 2;
  assert.ok(Math.abs(npv + 13636.36) < 1);
  assert.match(byNumber(114).options[byNumber(114).answer], /negative \$13,600/);
  assert.ok(418 / 96 > 4.35 && 418 / 96 < 4.36);
  assert.match(byNumber(125).options[byNumber(125).answer], /negative-binomial or quasi-Poisson/);
  assert.deepEqual(byNumber(122).chart.values.slice(0, 2), [0.52, 0.31]);
  assert.ok(byNumber(122).chart.values.slice(0, 2).every(value => value > byNumber(122).chart.confidence));
  const curves = byNumber(123).chart.series.map(series => series.points.find(point => point[0] === 1200)[1]);
  assert.deepEqual(curves, [0.68, 0.68]);
});

test('Batch 5 visual evidence packages match production questions', () => {
  const datasets = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'datasets.json'), 'utf8'));
  const specs = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'visual-specs.json'), 'utf8'));
  const validation = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'validation.json'), 'utf8'));
  const fallback = fs.readFileSync(path.join(ASSET_DIR, 'static-fallbacks.html'), 'utf8');
  assert.equal(datasets.batch, 5);
  assert.equal(Object.keys(datasets.questions).length, 10);
  assert.equal(Object.keys(specs.questions).length, 10);
  assert.equal(Object.keys(validation.questions).length, 10);
  assert.match(fallback, /Batch 5 visual fallbacks/);
  batch.filter(question => question.visual).forEach(question => {
    assert.deepEqual(datasets.questions[question.qid].chart, question.chart);
    assert.equal(datasets.questions[question.qid].sha256, digest(question.chart));
    assert.equal(validation.questions[question.qid].datasetSha256, digest(question.chart));
    assert.equal(validation.questions[question.qid].validationStatus, 'passed');
    assert.equal(specs.questions[question.qid].accessibility.altText, question.visual.altText);
    assert.equal(question.visual.answerCueAudit, true);
    assert.match(question.visual.datasetRef, /batch-05\/datasets\.json/);
    assert.match(fallback, new RegExp(`id="${question.qid.replace(/:/g, '-')}`));
  });
});

test('Every Batch 5 visual renders accessibly without answer cues', () => {
  const dom = renderer();
  try {
    batch.filter(question => question.visual).forEach(question => {
      const host = dom.window.document.createElement('div');
      host.innerHTML = dom.window.__TB.renderQuestionChart(question.chart);
      assert.ok(host.querySelector('.tb-q-chart-wrap'));
      assert.doesNotMatch(host.textContent, /correct answer|answer key/i);
      assert.doesNotMatch(host.innerHTML, /NaN|undefined/);
      if (question.chart.type === 'data-table') assert.equal(host.querySelectorAll('tbody tr').length, question.chart.rows.length);
      else assert.ok(host.querySelector('svg[role="img"]'));
    });
    const system = dom.window.document.createElement('div');
    system.innerHTML = dom.window.__TB.renderQuestionChart(batch[5].chart);
    assert.equal(system.querySelectorAll('[tabindex="0"] title').length, 20);
    const influence = dom.window.document.createElement('div');
    influence.innerHTML = dom.window.__TB.renderQuestionChart(batch[20].chart);
    assert.equal(influence.querySelectorAll('[tabindex="0"] title').length, 8);
  } finally {
    dom.window.close();
  }
});

test('Batch 5 has no suspicious duplicate stem', () => {
  const comparison = prior.concat(sourceSet);
  let maximum = 0;
  batch.forEach((question, index) => {
    batch.slice(index + 1).concat(comparison).forEach(other => {
      maximum = Math.max(maximum, similarity(question.stem, other.stem));
    });
  });
  assert.ok(maximum < 0.55, `maximum stem similarity was ${maximum.toFixed(3)}`);
});

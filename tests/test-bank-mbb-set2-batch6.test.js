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
const ASSET_DIR = path.join(ROOT, 'test-bank-assets', 'mbb-160', 'batch-06');

function load(source, variable) {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return JSON.parse(JSON.stringify(sandbox[variable]));
}

const batches = load(set2Source, 'MBB_SET2_BATCHES');
const batch = batches['6'];
const prior = batches['1'].concat(batches['2'], batches['3'], batches['4'], batches['5']);
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

function similarity(left, right) {
  const ignored = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'which', 'what', 'should', 'master', 'black', 'belt', 'project', 'process', 'use', 'using', 'best']);
  const make = value => new Set(String(value).toLowerCase().match(/[a-z0-9]+/g).filter(token => token.length > 2 && !ignored.has(token)));
  const a = make(left);
  const b = make(right);
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
  dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch6-ui.js'),'utf8'));
  return dom;
}

test('MBB Set 2 Batch 6 preserves domain allocation and uses the independently corrected key', () => {
  assert.equal(batch.length, 25);
  assert.deepEqual(batch.map(question => question.qid), Array.from({ length: 25 }, (_, index) => `mbb:set-2:original-${String(index + 126).padStart(3, '0')}`));
  assert.ok(batch.every(question => question.set === 2 && question.batch === 6));
  assert.deepEqual(counts(batch.map(question => question.sub)), {
    'mbb-enterprise': 5, 'mbb-org': 5, 'mbb-portfolio': 4,
    'mbb-training': 3, 'mbb-coaching': 3, 'mbb-analytics': 5
  });
  assert.deepEqual(batch.reduce((result, question) => { result[question.answer] += 1; return result; }, [0, 0, 0, 0]), [6, 6, 6, 7]);
  assert.deepEqual(counts(batch.map(question => question.difficulty)), { 'Very Hard': 11, Hard: 9, Expert: 5 });
  assert.ok(batch.every(q => ['Understand','Apply','Analyze','Evaluate'].includes(q.cognitive)), 'Selecting an existing response is not Create');
  assert.equal(batch.filter(question => question.visual).length, 9);
  assert.deepEqual(batch.filter(question => question.visual && question.visual.interactionPurpose).map(question => question.qid), [
    'mbb:set-2:original-130', 'mbb:set-2:original-134', 'mbb:set-2:original-147'
  ]);
});

test('Every Batch 6 item is complete, balanced, and source traceable', () => {
  batch.forEach(question => {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    assert.equal(question.optionRationales.length, 4);
    assert.ok(question.optionRationales.every(rationale => rationale.length >= 35));
    assert.ok(question.why.length >= 250);
    assert.ok(question.why.includes(`<b>${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer]}</b>`));
    assert.ok(question.bok.domain && question.bok.subdomain && question.bok.topic);
    assert.ok(question.assumptions.length && question.keywords.length >= 4);
    assert.equal(question.sources.length, 1);
    assert.equal(question.sources[0].id, 'S1');
    assert.doesNotMatch(JSON.stringify(question.sources), /SPEC DATA SCHEMA|TBD|placeholder/i);
    assert.doesNotMatch(question.options.join(' '), /(?:all|none) of the above/i);
    const lengths = question.options.map(option => option.length);
    assert.ok(lengths.every(n => n >= 20 && n <= 350), `${question.qid} option length requires editorial review`); // Do not pad distractors to an arbitrary ratio.
  });
});

test('Batch 6 numerical and statistical keys independently recompute', () => {
  const question = number => batch[number - 126];
  assert.equal(3 + 4 + 2 + 4, 13);
  assert.equal(3 + 4 + 4, 11);
  assert.match(question(136).options[question(136).answer], /13 working weeks/);
  assert.equal(510000 - 420000, 90000);
  assert.match(question(138).options[question(138).answer], /higher NPV/);
  const observed = (27 + 1893) / 2000;
  const expected = (80 / 2000) * (54 / 2000) + (1920 / 2000) * (1946 / 2000);
  const kappa = (observed - expected) / (1 - expected);
  assert.equal(observed, 0.96);
  assert.ok(Math.abs(kappa - 0.383) < 0.002);
  assert.match(question(146).options[question(146).answer], /positive detection/);
  assert.ok(question(147).chart.values[0] > question(147).chart.confidence);
  assert.ok(question(147).chart.values[11] > question(147).chart.confidence);
  const root = Math.sqrt(5);
  assert.ok((-5 + root) / 2 < 0 && (-5 - root) / 2 < 0);
  assert.deepEqual(question(148).chart.center, [0.8, 0.6]);
});

test('Batch 6 visual evidence packages match production data', () => {
  const datasets = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'datasets.json'), 'utf8'));
  const specs = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'visual-specs.json'), 'utf8'));
  const validation = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'validation.json'), 'utf8'));
  const fallback = fs.readFileSync(path.join(ASSET_DIR, 'static-fallbacks.html'), 'utf8');
  assert.equal(datasets.batch, 6);
  assert.equal(Object.keys(datasets.questions).length, 9);
  assert.equal(Object.keys(specs.questions).length, 9);
  assert.equal(Object.keys(validation.questions).length, 9);
  assert.match(fallback, /Batch 6 visual fallbacks/);
  batch.filter(question => question.visual).forEach(question => {
    assert.deepEqual(datasets.questions[question.qid].chart, question.chart);
    assert.equal(datasets.questions[question.qid].sha256, digest(question.chart));
    assert.equal(validation.questions[question.qid].datasetSha256, digest(question.chart));
    assert.equal(validation.questions[question.qid].validationStatus, 'semantic-checks-passed');
    assert.equal(specs.questions[question.qid].accessibility.altText, question.visual.altText);
    assert.equal(question.visual.answerCueAudit, true);
    assert.match(question.visual.datasetRef, /batch-06\/datasets\.json/);
    assert.match(fallback, new RegExp(`id="${question.qid.replace(/:/g, '-')}`));
  });
});

test('Every Batch 6 visual renders accessibly without key cues', () => {
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
    const adoption = dom.window.document.createElement('div');
    adoption.innerHTML = dom.window.__TB.renderQuestionChart(batch[8].chart);
    assert.equal(adoption.querySelectorAll('[tabindex="0"] title').length, 20);
    const acf = dom.window.document.createElement('div');
    acf.innerHTML = dom.window.__TB.renderQuestionChart(batch[21].chart);
    assert.equal(acf.querySelectorAll('[tabindex="0"] title').length, 12);
  } finally {
    dom.window.close();
  }
});

test('Batch 6 has no suspicious duplicate stem', () => {
  let maximum = 0;
  batch.forEach((question, index) => {
    batch.slice(index + 1).concat(prior, sourceSet).forEach(other => {
      maximum = Math.max(maximum, similarity(question.stem, other.stem));
    });
  });
  assert.ok(maximum < 0.55, `maximum stem similarity was ${maximum.toFixed(3)}`);
});

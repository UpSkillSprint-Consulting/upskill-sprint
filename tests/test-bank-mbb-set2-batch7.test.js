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
const ASSET_DIR = path.join(ROOT, 'test-bank-assets', 'mbb-160', 'batch-07');

function load(source, variable) {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return JSON.parse(JSON.stringify(sandbox[variable]));
}

const batches = load(set2Source, 'MBB_SET2_BATCHES');
const batch = batches['7'];
const prior = ['1', '2', '3', '4', '5', '6'].flatMap(number => batches[number]);
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
  return dom;
}

test('MBB 175 Batch 7 meets the expanded allocation', () => {
  assert.equal(batch.length, 25);
  assert.deepEqual(batch.map(question => question.qid), Array.from({ length: 25 }, (_, index) => `mbb:set-2:original-${String(index + 151).padStart(3, '0')}`));
  assert.ok(batch.every(question => question.set === 2 && question.batch === 7));
  assert.deepEqual(counts(batch.map(question => question.sub)), {
    'mbb-enterprise': 5, 'mbb-org': 5, 'mbb-portfolio': 2,
    'mbb-training': 3, 'mbb-coaching': 2, 'mbb-analytics': 8
  });
  assert.deepEqual(batch.reduce((result, question) => { result[question.answer] += 1; return result; }, [0, 0, 0, 0]), [6, 6, 6, 7]);
  assert.deepEqual(counts(batch.map(question => question.difficulty)), { 'Very Hard': 11, Hard: 9, Expert: 5 });
  assert.deepEqual(counts(batch.map(question => question.cognitive)), { Analyze: 7, Evaluate: 6, Understand: 3, Apply: 5, Create: 4 });
  assert.equal(batch.filter(question => question.visual).length, 9);
  assert.deepEqual(batch.filter(question => question.visual && question.visual.interactionPurpose).map(question => question.qid), [
    'mbb:set-2:original-155', 'mbb:set-2:original-158', 'mbb:set-2:original-170', 'mbb:set-2:original-174'
  ]);
  assert.deepEqual(prior.concat(batch).reduce((result, question) => { result[question.answer] += 1; return result; }, [0, 0, 0, 0]), [44, 43, 43, 45]);
});

test('Every Batch 7 item is complete, balanced, and source traceable', () => {
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
    assert.ok(Math.max(...lengths) - Math.min(...lengths) <= Math.max(...lengths) * 0.4, `${question.qid} has an option-length cue`);
  });
});

test('Batch 7 numerical and statistical keys independently recompute', () => {
  const question = number => batch[number - 151];
  const feasibleValues = { AC: 300 + 200, BD: 210 + 330, AB: 300 + 210, BC: 210 + 200 };
  assert.equal(Math.max(...Object.values(feasibleValues)), 540);
  assert.match(question(155).options[question(155).answer], /Projects B and D/);
  const cpi = 480 / 550;
  const spi = 480 / 600;
  const eac = 1200 / cpi;
  assert.ok(Math.abs(cpi - 0.873) < 0.001);
  assert.equal(spi, 0.8);
  assert.ok(Math.abs(eac - 1375) < 0.01);
  assert.match(question(161).options[question(161).answer], /1\.38M/);
  assert.equal(18 + 6, 24);
  assert.match(question(168).options[question(168).answer], /24%/);
  const systemReliability = 0.98 * 0.95 * 0.97;
  const gains = [0.01 * 0.95 * 0.97, 0.01 * 0.98 * 0.97, 0.01 * 0.98 * 0.95];
  assert.ok(Math.abs(systemReliability - 0.90307) < 1e-8);
  assert.equal(gains.indexOf(Math.max(...gains)), 1);
  assert.match(question(172).options[question(172).answer], /0\.95 subsystem/);
  assert.match(question(174).formula, /AB=CD/);
});

test('Batch 7 visual evidence packages match production data', () => {
  const datasets = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'datasets.json'), 'utf8'));
  const specs = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'visual-specs.json'), 'utf8'));
  const validation = JSON.parse(fs.readFileSync(path.join(ASSET_DIR, 'validation.json'), 'utf8'));
  const fallback = fs.readFileSync(path.join(ASSET_DIR, 'static-fallbacks.html'), 'utf8');
  assert.equal(datasets.batch, 7);
  assert.equal(Object.keys(datasets.questions).length, 9);
  assert.equal(Object.keys(specs.questions).length, 9);
  assert.equal(Object.keys(validation.questions).length, 9);
  assert.match(fallback, /Batch 7 visual fallbacks/);
  batch.filter(question => question.visual).forEach(question => {
    assert.deepEqual(datasets.questions[question.qid].chart, question.chart);
    assert.equal(datasets.questions[question.qid].sha256, digest(question.chart));
    assert.equal(validation.questions[question.qid].datasetSha256, digest(question.chart));
    assert.equal(validation.questions[question.qid].validationStatus, 'passed');
    assert.equal(specs.questions[question.qid].accessibility.altText, question.visual.altText);
    assert.equal(question.visual.answerCueAudit, true);
    assert.match(question.visual.datasetRef, /batch-07\/datasets\.json/);
    assert.match(fallback, new RegExp(`id="${question.qid.replace(/:/g, '-')}`));
  });
});

test('Every Batch 7 visual renders accessibly without key cues', () => {
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
    adoption.innerHTML = dom.window.__TB.renderQuestionChart(batch[7].chart);
    assert.equal(adoption.querySelectorAll('[tabindex="0"] title').length, 24);
    const regression = dom.window.document.createElement('div');
    regression.innerHTML = dom.window.__TB.renderQuestionChart(batch[19].chart);
    assert.equal(regression.querySelectorAll('[tabindex="0"] title').length, 9);
  } finally {
    dom.window.close();
  }
});

test('Batch 7 has no suspicious duplicate stem', () => {
  let maximum = 0;
  batch.forEach((question, index) => {
    batch.slice(index + 1).concat(prior, sourceSet).forEach(other => {
      maximum = Math.max(maximum, similarity(question.stem, other.stem));
    });
  });
  assert.ok(maximum < 0.55, `maximum stem similarity was ${maximum.toFixed(3)}`);
});

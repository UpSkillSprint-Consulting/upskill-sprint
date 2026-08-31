'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const pageHtml = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const formulaScript = fs.readFileSync(path.join(ROOT, 'test-bank-formulas.js'), 'utf8');
const SECTION_NAMES = {
  mgmt: 'I. Management & Leadership',
  qsys: 'II. The Quality System',
  design: 'III. Product, Process & Service Design',
  ppc: 'IV. Product & Process Control',
  ci: 'V. Continuous Improvement',
  quant: 'VI. Quantitative Methods & Tools',
  risk: 'VII. Risk Management'
};

const windows = [];
afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

function wait(window, ms = 45) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

async function loadRealPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(pageHtml, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  windows.push(dom.window);

  // The production page loads this file with defer. Evaluating it while the
  // document is still loading reproduces that lifecycle without network I/O.
  dom.window.eval(formulaScript);
  if (dom.window.document.readyState !== 'complete') {
    await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  }
  await installDurableLearning(dom.window);
  await wait(dom.window);
  return { dom, window: dom.window, document: dom.window.document, errors };
}

function selectCqe(window, document) {
  click(window, document.querySelector('.tb-tile[data-exam="cqe"]'));
  assert.equal(document.querySelector('.tb-tile.active').dataset.exam, 'cqe');
}

function selectSet(window, document, set) {
  click(window, document.querySelector(`[data-set="${set}"]`));
  assert.ok(document.querySelector(`[data-set="${set}"].on`), `set ${set} is selected`);
}

async function openFormulaPane(window, document) {
  click(window, document.querySelector('[data-formulas]'));
  await wait(window);
  const drawer = document.getElementById('tb-formulas');
  assert.ok(drawer && !drawer.hidden, 'formula drawer opens');
  const host = document.getElementById('tb-reflist');
  assert.ok(host && host.textContent.trim(), 'formula drawer is populated');
  assert.doesNotMatch(host.textContent, /No formula matches [“"]\s*[”"]/i);
  return host;
}

function startQuick(window, document) {
  const overview = document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-count="quick"][data-n="10"]'));
  click(window, overview.querySelector('[data-mode="quick"]'));
  assert.ok(document.querySelector('.tb-quiz'), 'quick quiz starts');
}

function backToSimulator(window, document) {
  click(window, document.querySelector('[data-backsim]'));
  assert.ok(document.querySelector('[data-mode="quick"]'), 'returned to simulator');
}

function quantitativeQuestion(question) {
  const stem = String(question.stem || '');
  const why = String(question.why || '');
  const combined = `${stem} ${why}`;
  const numericCount = (stem.match(/(?:^|\s)[−-]?\d+(?:\.\d+)?%?/g) || []).length;
  const calculationLanguage = /\b(?:calculate|compute|computed|determine|probability|reliability|availability|mean|variance|standard deviation|standard error|confidence interval|sample size|capability|yield|defects? per|failure rate|risk priority number|RPN|OEE|takt|payback|present value|ROI|tolerance stack|correlation|regression|chi[- ]square|ANOVA|control limit|UCL|LCL|DPMO|DPU|DPO|PPM|MTBF|MTTR)\b/i;
  const workedArithmetic = /(?:=|×|÷|√|Σ|\^|\bdivid(?:e|ed|ing)\b|\bmultip(?:ly|lied|lication)\b|\bsubtract(?:ed|ion)?\b|\badd(?:ed|ition)?\b)/i;
  const conceptualOnly = /(?:long tail toward|Type II error|VIFs?.*consequence|compared to the standard normal.*t-distribution)/i;
  if (conceptualOnly.test(stem)) return false;
  return calculationLanguage.test(combined) && (numericCount >= 2 || workedArithmetic.test(why));
}

test('formula enhancer still initializes when the learner waits before starting a quiz', { timeout: 30000 }, async () => {
  const { window, document } = await loadRealPage();

  // The previous implementation stopped looking for the lazily-created tool
  // layer after two seconds. A real learner commonly spends longer than that
  // reading the overview before starting.
  await wait(window, 2200);
  selectCqe(window, document);
  selectSet(window, document, '1');
  startQuick(window, document);
  const host = await openFormulaPane(window, document);

  assert.match(host.textContent, /Recommended for the current question/i);
  assert.ok(host.querySelector('.tb-fcontextbar'), 'context-aware renderer is active, not only the fallback list');
});

test('formula pane works in CQE Quick Quiz for Set 1, Set 2, Set 3, and Mixed', async () => {
  for (const set of ['1', '2', '3', 'mix']) {
    const { window, document } = await loadRealPage();
    selectCqe(window, document);
    selectSet(window, document, set);
    startQuick(window, document);
    const host = await openFormulaPane(window, document);

    assert.match(host.textContent, /Recommended for the current question/i);
    assert.ok(host.querySelector('.tb-refitem, .tb-fconcept'), `${set}: current-question guidance is present`);
    assert.match(host.querySelector('.tb-fcontextbar').textContent, /I\.|II\.|III\.|IV\.|V\.|VI\.|VII\./);

    window.close();
    windows.splice(windows.indexOf(window), 1);
  }
});

test('formula pane follows every CQE focused-quiz section', async () => {
  const { window, document } = await loadRealPage();
  selectCqe(window, document);
  selectSet(window, document, '1');

  for (const [section, expectedName] of Object.entries(SECTION_NAMES)) {
    const overview = document.getElementById('tb-overview');
    const select = overview.querySelector('[data-focusdom]');
    select.value = section;
    select.dispatchEvent(new window.Event('change', { bubbles: true }));
    click(window, document.getElementById('tb-overview').querySelector('[data-mode="focus"]'));
    const host = await openFormulaPane(window, document);

    assert.ok(host.querySelector('.tb-fcontextbar').textContent.includes(expectedName), `${section}: correct section heading`);
    assert.ok(host.querySelector('.tb-refitem, .tb-fconcept'), `${section}: guidance is rendered`);
    backToSimulator(window, document);
  }
});

test('open formula pane updates immediately when Next and question navigator change the question', async () => {
  const { window, document } = await loadRealPage();
  selectCqe(window, document);
  selectSet(window, document, '1');
  startQuick(window, document);
  const host = await openFormulaPane(window, document);
  const firstStem = document.querySelector('.tb-stem').textContent;
  assert.match(host.textContent, /Question 1 (?:currently open|is conceptual)/i);

  click(window, document.querySelector('[data-next]'));
  await wait(window, 80);
  assert.notEqual(document.querySelector('.tb-stem').textContent, firstStem, 'Next displays a different question');
  assert.match(document.getElementById('tb-reflist').textContent, /Question 2 (?:currently open|is conceptual)/i);

  click(window, document.querySelector('[data-goto="0"]'));
  await wait(window, 80);
  assert.equal(document.querySelector('.tb-stem').textContent, firstStem, 'navigator returns to question 1');
  assert.match(document.getElementById('tb-reflist').textContent, /Question 1 (?:currently open|is conceptual)/i);
});

test('current-question formulas are not duplicated in the remaining section reference', async () => {
  const { window, document } = await loadRealPage();
  selectCqe(window, document);
  const api = window.__TB_FORMULAS_TEST__;
  const bank = window.__TB.EXAMS.cqe.sets[1];
  const question = bank.find(item => api.formulasForQuestion(item).length > 0);
  assert.ok(question, 'bank contains a formula-backed question');

  // Start a real quiz then replace the displayed question with the selected
  // bank question so rendering and mapping use production DOM structures.
  startQuick(window, document);
  document.querySelector('.tb-stem').textContent = question.stem;
  document.querySelector('.tb-qtag').textContent = SECTION_NAMES[question.sub];
  const drawer = document.getElementById('tb-formulas');
  drawer.hidden = false;
  api.renderContextualPane('');

  const currentCards = Array.from(document.querySelectorAll('.tb-currentgroup [data-formula-id]'));
  assert.ok(currentCards.length > 0, 'current formula cards are rendered');
  currentCards.forEach(card => {
    const id = card.dataset.formulaId;
    assert.equal(document.querySelectorAll(`.tb-reflist [data-formula-id="${id}"]`).length, 1, `${id} appears only once`);
  });
});

test('search finds formulas by late bank-question numbers, not only the first twelve mappings', async () => {
  const { window, document } = await loadRealPage();
  selectCqe(window, document);
  const api = window.__TB_FORMULAS_TEST__;
  const syntheticBank = Array.from({ length: 15 }, (_, index) => ({
    sub: 'ppc',
    stem: `Synthetic Cpk mapping question ${index + 1}: USL 20, LSL 10, mean 16, standard deviation 1. What is Cpk?`,
    options: ['0.67', '1.00', '1.33', '1.67'],
    answer: 0,
    why: 'Cpk accounts for centering.'
  }));
  window.__TB.EXAMS.cqe.sets[1] = syntheticBank;

  startQuick(window, document);
  document.querySelector('.tb-stem').textContent = syntheticBank[0].stem;
  document.querySelector('.tb-qtag').textContent = SECTION_NAMES.ppc;
  document.getElementById('tb-formulas').hidden = false;
  api.renderContextualPane('Question 15');

  const card = document.querySelector('[data-formula-id="cpk"]');
  assert.ok(card, 'Cpk is searchable by Question 15 even though the displayed mapping list is compacted');
});

test('CQE formula registry has complete, unique, section-valid records', async () => {
  const { window } = await loadRealPage();
  const api = window.__TB_FORMULAS_TEST__;
  const ids = new Set();
  const sectionCounts = Object.fromEntries(Object.keys(SECTION_NAMES).map(section => [section, 0]));

  for (const formula of api.formulas) {
    assert.ok(formula.id && formula.name && formula.formula && formula.when, 'required formula metadata is present');
    assert.ok(!ids.has(formula.id), `duplicate formula id: ${formula.id}`);
    ids.add(formula.id);
    assert.ok(Array.isArray(formula.patterns) && formula.patterns.length > 0, `${formula.id}: has matching rules`);
    assert.ok(Array.isArray(formula.sections) && formula.sections.length > 0, `${formula.id}: has sections`);
    for (const section of formula.sections) {
      assert.ok(section in SECTION_NAMES, `${formula.id}: valid section ${section}`);
      sectionCounts[section] += 1;
    }
  }

  for (const [section, count] of Object.entries(sectionCounts)) {
    assert.ok(count > 0, `${section}: contains formula references`);
  }
});

test('all calculation-based questions in all three CQE banks map to at least one applicable formula', async () => {
  const { window } = await loadRealPage();
  const api = window.__TB_FORMULAS_TEST__;
  const sets = window.__TB.EXAMS.cqe.sets;
  const missing = [];
  const excessive = [];

  for (const [set, bank] of Object.entries(sets)) {
    bank.forEach((question, index) => {
      const matches = api.formulasForQuestion(question);
      if (quantitativeQuestion(question) && matches.length === 0) {
        missing.push(`Set ${set} Q${index + 1} [${question.sub}]: ${question.stem}`);
      }
      if (matches.length > 6) {
        excessive.push(`Set ${set} Q${index + 1}: ${matches.map(item => item.id).join(', ')}`);
      }
    });
  }

  assert.deepEqual(missing, [], `calculation questions without formula mappings:\n${missing.join('\n')}`);
  assert.deepEqual(excessive, [], `questions with implausibly broad formula matches:\n${excessive.join('\n')}`);
});

test('CQE bank stems are unambiguous across sets for reliable question-to-set mapping', async () => {
  const { window } = await loadRealPage();
  const sets = window.__TB.EXAMS.cqe.sets;
  const seen = new Map();
  const duplicates = [];

  for (const [set, bank] of Object.entries(sets)) {
    bank.forEach((question, index) => {
      const key = String(question.stem || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (seen.has(key)) duplicates.push(`${seen.get(key)} and Set ${set} Q${index + 1}`);
      else seen.set(key, `Set ${set} Q${index + 1}`);
    });
  }

  assert.deepEqual(duplicates, [], `duplicate stems make set mapping ambiguous:\n${duplicates.join('\n')}`);
});

test('canonical high-risk formulas render with the expected mathematical structure', async () => {
  const { window } = await loadRealPage();
  const formulas = Object.fromEntries(window.__TB_FORMULAS_TEST__.formulas.map(item => [item.id, item.formula]));
  const expectations = {
    cpk: /min.*USL.*LSL.*3σ/i,
    'p-chart': /p̄.*3√.*p̄.*1.*p̄.*n/i,
    'np-chart': /np̄.*3√.*np̄.*1.*p̄/i,
    'c-chart': /c̄.*3√c̄/i,
    'u-chart': /ū.*3√.*ū.*n/i,
    dpmo: /Defects.*Units.*Opportunities.*1,000,000/i,
    binomial: /C\(n,x\).*p.*1.*p/i,
    poisson: /e⁻λ.*λˣ.*x!/i,
    exponential: /R\(t\).*e⁻λᵗ.*MTBF.*1\/λ/i,
    rpn: /Severity.*Occurrence.*Detection/i,
    'rss-stack': /√Σ.*Tᵢ²/i
  };

  for (const [id, pattern] of Object.entries(expectations)) {
    assert.ok(formulas[id], `${id}: formula exists`);
    assert.match(formulas[id], pattern, `${id}: canonical structure`);
  }
});

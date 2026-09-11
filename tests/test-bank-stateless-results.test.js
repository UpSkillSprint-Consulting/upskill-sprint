'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const PAGE_SOURCE = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const EDGE_SOURCE = fs.readFileSync(path.join(ROOT, 'netlify/edge-functions/test-bank-mobile-picker.js'), 'utf8');
const MEMORY_SOURCE = fs.readFileSync(path.join(ROOT, 'test-bank-memory-learning.js'), 'utf8');
const CSSGB_SET1_SOURCE = fs.readFileSync(path.join(ROOT, 'test-bank-cssgb-set1.js'), 'utf8');
const CSSGB_SET2_SOURCE = fs.readFileSync(path.join(ROOT, 'test-bank-cssgb-set2.js'), 'utf8');

async function productionHtml() {
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(EDGE_SOURCE).toString('base64');
  const edge = (await import(moduleUrl)).default;
  const response = await edge(new Request('https://upskillsprint.com/test-bank'), {
    next: async () => new Response(PAGE_SOURCE, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })
  });
  return (await response.text())
    .replace('<script src="/test-bank-memory-learning.js"></script>', `<script>${MEMORY_SOURCE}</script>`)
    .replace('<script src="/test-bank-cssgb-set1.js"></script>', `<script>${CSSGB_SET1_SOURCE}</script>`)
    .replace('<script src="/test-bank-cssgb-set2.js"></script>', `<script>${CSSGB_SET2_SOURCE}</script>`);
}

function click(window, element) {
  assert.ok(element, 'expected the interactive control to exist');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

async function runMode(mode) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => errors.push(error.message));
  const dom = new JSDOM(await productionHtml(), {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.HTMLElement.prototype.scrollIntoView = function () {};
    }
  });
  await new Promise((resolve) => dom.window.addEventListener('load', resolve, { once: true }));

  try {
    const { window } = dom;
    const overview = window.document.getElementById('tb-overview');
    click(window, window.document.querySelector('.tb-tile[data-exam="cssgb"]'));
    click(window, overview.querySelector(`[data-mode="${mode}"]`));
    assert.ok(overview.querySelector('.tb-quiz'), `${mode} opens the quiz player`);

    const firstQuestion = window.__TB.getFeedbackSnapshot().records[0].question;
    click(window, overview.querySelector(`[data-opt="${firstQuestion.answer}"]`));

    const navigation = overview.querySelectorAll('[data-goto]');
    assert.ok(navigation.length > 0, `${mode} renders question navigation`);
    click(window, navigation[navigation.length - 1]);
    click(window, overview.querySelector('[data-submit]'));

    return {
      errors: errors.slice(),
      result: overview.querySelector('[data-score-result]'),
      resultLabel: overview.querySelector('.tb-restag')?.textContent || '',
      snapshot: window.__TB.getFeedbackSnapshot(),
      questionCount: navigation.length
    };
  } finally {
    dom.window.close();
  }
}

for (const [mode, label] of [
  ['full', 'Full Exam result'],
  ['quick', 'Quick Quiz result'],
  ['focus', 'Focused Quiz result']
]) {
  test(`stateless ${mode} completion opens its result screen`, async () => {
    const outcome = await runMode(mode);
    assert.ok(outcome.result, 'the shared completion handler renders a score result');
    assert.equal(outcome.resultLabel, label);
    assert.equal(outcome.snapshot.completed, true);
    assert.match(outcome.result.textContent, new RegExp(`\\(1/${outcome.questionCount}\\)`));
    assert.deepEqual(outcome.errors, []);
  });
}

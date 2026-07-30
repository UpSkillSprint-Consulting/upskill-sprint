'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const pageHtml = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const formulaScript = fs.readFileSync(path.join(ROOT, 'test-bank-formulas.js'), 'utf8');

function wait(window, ms = 35) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function buildFormulaDom(question, sectionLabel = 'Product & Process Control · IV. Product & Process Control') {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <button class="tb-tile active" data-exam="cqe">CQE</button>
    <h1 id="tb-herotitle">ASQ Certified Quality Engineer</h1>
    <div id="tb-overview">
      <div class="tb-quizprog">Question 1 of 2 · 0 answered</div>
      <div class="tb-qtag">${sectionLabel}</div>
      <div class="tb-stem">${question.stem}</div>
      <button type="button" data-formulas>Formulas</button>
    </div>
    <div id="tb-toollayer">
      <aside id="tb-formulas" aria-label="Formula and reference sheet">
        <input id="tb-refsearch" value="">
        <div id="tb-reflist"></div>
      </aside>
    </div>
  </body></html>`, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });

  dom.window.__TB = {
    REFS: {},
    EXAMS: {
      cqe: {
        sets: {
          1: [
            question,
            {
              sub: question.sub,
              stem: 'A stable process has USL 20, LSL 10, mean 16, and within standard deviation 1. What is Cpk?',
              options: ['0.67', '1.00', '1.33', '1.67']
            }
          ]
        }
      }
    }
  };

  dom.window.eval(formulaScript);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  await wait(dom.window);
  return dom;
}

test('test-bank page loads the contextual formula script', () => {
  assert.match(pageHtml, /<script defer src="\/test-bank-formulas\.js"><\/script>/);
});

test('blank formula search has a seven-section CQE fallback instead of an empty registry', async () => {
  const question = {
    sub: 'ppc',
    stem: 'A process has USL 20, LSL 10, mean 16, and within standard deviation 1. Which capability index accounts for centering?',
    options: ['Cp', 'Cpk', 'Pp', 'Yield']
  };
  const dom = await buildFormulaDom(question);
  const api = dom.window.__TB_FORMULAS_TEST__;
  assert.ok(api, 'formula test API is exposed');
  assert.equal(dom.window.__TB.REFS.cqe.length, 7);
  assert.ok(dom.window.__TB.REFS.cqe.every(group => group.items.length > 0));
  dom.window.close();
});

test('current quantitative question is matched to Cpk and labelled with its question number', async () => {
  const question = {
    sub: 'ppc',
    stem: 'A process has USL 20, LSL 10, mean 16, and within standard deviation 1. Which capability index accounts for centering?',
    options: ['Cp', 'Cpk', 'Pp', 'Yield']
  };
  const dom = await buildFormulaDom(question);
  dom.window.__TB_FORMULAS_TEST__.renderContextualPane('');
  const text = dom.window.document.getElementById('tb-reflist').textContent;
  assert.match(text, /Recommended for the current question/i);
  assert.match(text, /Actual process capability, Cpk/i);
  assert.match(text, /Question 1 currently open/i);
  assert.match(text, /Exam Set 1/i);
  assert.doesNotMatch(text, /No formula matches “”./i);
  dom.window.close();
});

test('conceptual CQE question receives an explicit no-formula message and section references', async () => {
  const question = {
    sub: 'mgmt',
    stem: 'In a RACI chart, how many people should be Accountable for one deliverable?',
    options: ['None', 'Exactly one', 'Two', 'Everyone']
  };
  const dom = await buildFormulaDom(question, 'Management & Leadership · I. Management & Leadership');
  dom.window.__TB_FORMULAS_TEST__.renderContextualPane('');
  const text = dom.window.document.getElementById('tb-reflist').textContent;
  assert.match(text, /Question 1 is conceptual/i);
  assert.match(text, /No mathematical formula is required/i);
  assert.match(text, /All formulas for I\. Management & Leadership/i);
  dom.window.close();
});

test('formula search filters within the current CQE section', async () => {
  const question = {
    sub: 'ppc',
    stem: 'A process has USL 20, LSL 10, mean 16, and within standard deviation 1. What is Cpk?',
    options: ['0.67', '1.00', '1.33', '1.67']
  };
  const dom = await buildFormulaDom(question);
  dom.window.__TB_FORMULAS_TEST__.renderContextualPane('Cpk');
  const text = dom.window.document.getElementById('tb-reflist').textContent;
  assert.match(text, /Actual process capability, Cpk/i);
  assert.doesNotMatch(text, /Taguchi quality loss/i);
  dom.window.close();
});

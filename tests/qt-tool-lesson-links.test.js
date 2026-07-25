'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON = path.join(ROOT, 'lessons', 'complete-14-quality-tools-project.html');
const html = fs.readFileSync(LESSON, 'utf8');

// tools that map to a dedicated or survey lesson, and the three with no honest target
const LINKED = ['flow', 'check', 'strat', 'hist', 'pareto', 'fish', 'hyp', 'reg', 'doe',
  'aff', 'inter', 'tree', 'priority', 'matrix', 'pdpc', 'network', 'spc', 'cap'];
const UNLINKED = ['charter', 'msa', 'controlplan'];

// every target URL a link may point at (must exist as a lesson file)
const EXPECTED_TARGETS = {
  flow: '/lessons/7-essential-quality-tools#tool-explorer',
  pareto: '/lessons/understanding-pareto-chart',
  fish: '/lessons/root-cause-analysis-5-whys-fishbone',
  hyp: '/lessons/hypothesis-testing-for-beginners',
  reg: '/lessons/minitab-best-predictive-regression-model',
  doe: '/lessons/introduction-to-design-of-experiment-doe',
  aff: '/lessons/7-management-planning-tools#tool-explorer',
  spc: '/lessons/control-charts-explained',
  cap: '/lessons/lean-six-sigma/process-capability-cp-and-cpk'
};

function loadLesson() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/lessons/complete-14-quality-tools-project.html',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc
  });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  return new Promise(resolve => dom.window.addEventListener('load', () => resolve({ window: dom.window, errors })));
}

function openTool(window, id) {
  window.document.querySelector('#tool-grid [data-tool="' + id + '"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  return window.document.querySelector('#tool-details .qw-tool-lesson');
}

/* ---------- contract ---------- */

test('shared controller tags intact and script tags balanced', () => {
  assert.equal(html.split('<script src="/theme.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/site-sections.js"></script>').length - 1, 1);
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

test('the original detail table is preserved', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('#tool-grid [data-tool="pareto"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const detail = window.document.getElementById('tool-details').textContent;
  ['What should come before', 'What normally comes after', 'Why this level matters']
    .forEach(h => assert.match(detail, new RegExp(h), `keeps "${h}" row`));
});

/* ---------- links present where a target exists ---------- */

test('every tool with a dedicated lesson shows an "Open the full lesson" link', async () => {
  const { window } = await loadLesson();
  for (const id of LINKED) {
    const a = openTool(window, id);
    assert.ok(a, `${id} shows a lesson link`);
    const href = a.getAttribute('href');
    assert.ok(href && href.startsWith('/lessons/'), `${id} link points into /lessons/`);
    assert.match(a.textContent, /Open the full lesson/, `${id} link is labelled`);
  }
});

test('tools without an honest target correctly omit the link', async () => {
  const { window } = await loadLesson();
  for (const id of UNLINKED) {
    assert.equal(openTool(window, id), null, `${id} shows no link`);
  }
});

test('representative links point at the correct lesson URLs', async () => {
  const { window } = await loadLesson();
  for (const id of Object.keys(EXPECTED_TARGETS)) {
    const a = openTool(window, id);
    assert.equal(a.getAttribute('href'), EXPECTED_TARGETS[id], `${id} -> ${EXPECTED_TARGETS[id]}`);
  }
});

/* ---------- every target actually resolves to a lesson file ---------- */

test('every linked URL resolves to a real lesson file (no dead links)', async () => {
  const { window } = await loadLesson();
  const seen = new Set();
  for (const id of LINKED) {
    const href = openTool(window, id).getAttribute('href');
    const rel = href.replace(/#.*$/, '').replace(/^\//, '');
    seen.add(rel);
  }
  seen.forEach(rel => {
    const file = path.join(ROOT, rel + '.html');
    assert.ok(fs.existsSync(file), `${rel}.html exists on disk`);
  });
});

test('survey-lesson links use the #tool-explorer anchor that exists in both targets', async () => {
  const essential = fs.readFileSync(path.join(ROOT, 'lessons', '7-essential-quality-tools.html'), 'utf8');
  const mgmt = fs.readFileSync(path.join(ROOT, 'lessons', '7-management-planning-tools.html'), 'utf8');
  assert.ok(essential.includes('id="tool-explorer"'), 'essential lesson has the anchor');
  assert.ok(mgmt.includes('id="tool-explorer"'), 'management lesson has the anchor');
});

test('the lesson loads with no unexpected errors', async () => {
  const { errors } = await loadLesson();
  assert.deepEqual(errors, []);
});

test('clicking the same tool twice keeps a single link (no duplication)', async () => {
  const { window } = await loadLesson();
  openTool(window, 'doe');
  openTool(window, 'doe');
  assert.equal(window.document.querySelectorAll('#tool-details .qw-tool-lesson').length, 1);
});

'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON = path.join(ROOT, 'lessons', '7-management-planning-tools.html');
const html = fs.readFileSync(LESSON, 'utf8');

const TOOL_KEYS = ['affinity', 'interrelationship', 'tree', 'prioritization', 'matrix', 'pdpc', 'network'];

function loadLesson() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/lessons/7-management-planning-tools.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  return new Promise(resolve => {
    dom.window.addEventListener('load', () => resolve({ window: dom.window, errors }));
  });
}

/* ---------- page contract ---------- */

test('the lesson still carries the exact shared controller tags', () => {
  assert.equal(html.split('<script src="/theme.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/site-sections.js"></script>').length - 1, 1);
});

test('script tags remain balanced', () => {
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

/* ---------- nothing removed ---------- */

test('the original per-tool labs are preserved (nothing removed)', async () => {
  const { window } = await loadLesson();
  const nav = Array.from(window.document.querySelectorAll('.mp-tool-btn'));
  const labNames = {
    affinity: /Interactive Affinity Lab/, interrelationship: /Driver Lab/, tree: /Tree Completeness Lab/,
    prioritization: /Weighted Prioritization Lab/, matrix: /Relationship Matrix Lab/,
    pdpc: /PDPC Scenario Lab/, network: /Critical Path Lab/
  };
  for (const btn of nav) {
    btn.dispatchEvent(new window.Event('click', { bubbles: true }));
    const key = btn.dataset.tool;
    assert.match(window.document.getElementById('tool-detail').textContent, labNames[key], `${key} keeps its original lab`);
  }
});

test('the original standalone sections are intact', () => {
  ['Preserved affinity workshop', 'Integrated planning challenge', 'Common failure modes',
    'Strategic sequence', 'Which Management &amp; Planning Tool Should I Use'].forEach(marker => {
    assert.ok(html.includes(marker), `"${marker}" is intact`);
  });
});

/* ---------- additive: pictorial visual per tool ---------- */

test('the tool nav exposes all seven tools', async () => {
  const { window } = await loadLesson();
  assert.equal(window.document.querySelectorAll('.mp-tool-btn').length, 7);
});

test('every tool mounts a pictorial, interactive visual while keeping its lab', async () => {
  const { window } = await loadLesson();
  const nav = Array.from(window.document.querySelectorAll('.mp-tool-btn'));
  for (const btn of nav) {
    btn.dispatchEvent(new window.Event('click', { bubbles: true }));
    const host = window.document.getElementById('mp-visual');
    assert.ok(host, `${btn.dataset.tool} has a #mp-visual host`);
    assert.ok(host.querySelector('.mp-visual'), `${btn.dataset.tool} mounts a visual`);
    assert.ok(
      host.querySelector('svg, table, .mp-affboard'),
      `${btn.dataset.tool} renders a pictorial surface (svg/grid/board)`
    );
    assert.match(window.document.getElementById('tool-detail').textContent, /Lab/, `${btn.dataset.tool} preserves its lab`);
  }
});

test('the lesson loads with no jsdom errors', async () => {
  const { errors } = await loadLesson();
  assert.deepEqual(errors, [], 'no runtime errors');
});

test('the MP7 test hook exposes helpers and a visual per tool', async () => {
  const { window } = await loadLesson();
  const M = window.__MP7;
  assert.ok(M, 'window.__MP7 exists');
  ['mount', 'digraphDegrees', 'prioritize', 'matrixTotals', 'criticalPath']
    .forEach(fn => assert.equal(typeof M[fn], 'function', `__MP7.${fn} is a function`));
  assert.deepEqual(Object.keys(M.VISUAL).sort(), TOOL_KEYS.slice().sort());
});

/* ---------- diagram logic ---------- */

test('the digraph identifies the driver and outcome by degree', async () => {
  const { window } = await loadLesson();
  const M = window.__MP7;
  const nodes = ['Procedure', 'Training', 'Equipment', 'Low YS'];
  const edges = [
    { from: 'Procedure', to: 'Training' }, { from: 'Procedure', to: 'Equipment' },
    { from: 'Procedure', to: 'Low YS' }, { from: 'Training', to: 'Low YS' }, { from: 'Equipment', to: 'Low YS' }
  ];
  const { driver, outcome, deg } = M.digraphDegrees(nodes, edges);
  assert.equal(driver, 'Procedure', 'most outgoing arrows = driver');
  assert.equal(outcome, 'Low YS', 'most incoming arrows = outcome');
  assert.equal(deg.Procedure.out, 3);
  assert.equal(deg['Low YS'].in, 3);
});

test('weighted prioritization ranks by score and matches the lesson table', async () => {
  const { window } = await loadLesson();
  const M = window.__MP7;
  const actions = [
    { label: 'Calibrate pyrometer', scores: [5, 5, 4, 5], effort: 2 },
    { label: 'Revise SOP', scores: [5, 4, 3, 5], effort: 3 },
    { label: 'Install interlock', scores: [5, 2, 2, 4], effort: 5 }
  ];
  const ranked = M.prioritize(actions, [40, 25, 15, 20]);
  assert.equal(ranked[0].label, 'Calibrate pyrometer', 'top action matches the static table');
  assert.ok(Math.abs(ranked[0].score - 4.85) < 0.01, 'score reproduces the lesson value 4.85');
  for (let i = 1; i < ranked.length; i++) assert.ok(ranked[i - 1].score >= ranked[i].score, 'descending order');
});

test('matrix totals weight the relationship symbols correctly', async () => {
  const { window } = await loadLesson();
  const M = window.__MP7;
  // one strong (9), one moderate (3), one weak (1), one none (0) in a row = 13
  const cells = [[3, 2, 1, 0]];
  const { rowT } = M.matrixTotals(cells, ['r'], ['a', 'b', 'c', 'd']);
  assert.equal(rowT[0], 13, '9 + 3 + 1 + 0 = 13');
});

test('the critical path flips when the driving task grows', async () => {
  const { window } = await loadLesson();
  const M = window.__MP7;
  const build = d => ([
    { id: 'A', dur: 3, pred: [] }, { id: 'B', dur: 2, pred: [] },
    { id: 'C', dur: 4, pred: ['A'] }, { id: 'D', dur: d, pred: ['A', 'B'] },
    { id: 'E', dur: 2, pred: ['C', 'D'] }, { id: 'F', dur: 10, pred: ['E'] }
  ]);
  const shortD = M.criticalPath(build(3));
  const longD = M.criticalPath(build(9));
  assert.deepEqual(shortD.critical, ['A', 'C', 'E', 'F'], 'short D → path runs through C');
  assert.equal(shortD.duration, 19);
  assert.deepEqual(longD.critical, ['A', 'D', 'E', 'F'], 'long D → path shifts through D');
  assert.equal(longD.duration, 24);
});

/* ---------- live interactions ---------- */

test('toggling a digraph edge redraws the diagram', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('[data-tool="interrelationship"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const host = window.document.getElementById('mp-visual');
  const before = host.querySelectorAll('.mp-edge').length;
  host.querySelector('.mp-segbtn').dispatchEvent(new window.Event('click', { bubbles: true }));
  const after = host.querySelectorAll('.mp-edge').length;
  assert.notEqual(before, after, 'the number of drawn arrows changes');
});

test('cycling a matrix cell updates its symbol', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('[data-tool="matrix"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const host = window.document.getElementById('mp-visual');
  const cell = host.querySelector('.mp-mxcell');
  const before = cell.className;
  cell.dispatchEvent(new window.Event('click', { bubbles: true }));
  const after = host.querySelector('.mp-mxcell').className;
  assert.notEqual(before, after, 'the cell relationship state advances');
});

test('the network slider updates the critical-path readout', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('[data-tool="network"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const host = window.document.getElementById('mp-visual');
  const before = host.querySelector('.mp-visual-read').textContent;
  const input = host.querySelector('input[type="range"]');
  input.value = '9';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  const after = host.querySelector('.mp-visual-read').textContent;
  assert.notEqual(before, after, 'the readout changes');
  assert.match(after, /A → D/, 'the critical path now runs through D');
});

test('affinity notes cluster into themes on click', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('[data-tool="affinity"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const host = window.document.getElementById('mp-visual');
  const note = host.querySelector('.mp-affnote');
  note.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(host.querySelector('.mp-visual-read').textContent, /1 of 9/, 'one idea has been clustered');
});

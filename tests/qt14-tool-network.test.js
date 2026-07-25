'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON = path.join(ROOT, 'lessons', 'complete-14-quality-tools-project.html');
const html = fs.readFileSync(LESSON, 'utf8');

const PHASES = ['define', 'measure', 'analyze', 'improve', 'control'];

function loadLesson() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/lessons/complete-14-quality-tools-project.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  // jsdom does not implement layout methods; the lesson's existing showTool()
  // calls scrollIntoView. Supply the missing browser API so the suite can still
  // assert on genuine errors.
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
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

test('the original tool grid and other sections are preserved', async () => {
  const { window } = await loadLesson();
  assert.equal(window.document.querySelectorAll('#tool-grid [data-tool]').length, 21, 'grid still renders all tools');
  ['Statistical Method Selector', 'Root-Cause Confidence Gate', 'Capstone deliverable']
    .forEach(marker => assert.ok(html.includes(marker), `"${marker}" section intact`));
  assert.match(html, /investigation simulator/i, 'the simulator section is intact');
});

/* ---------- additive: the real network ---------- */

test('the network renders one node per tool and matches the grid tool set', async () => {
  const { window } = await loadLesson();
  const netIds = Array.from(window.document.querySelectorAll('.qw-net-node')).map(n => n.dataset.tool).sort();
  const gridIds = Array.from(window.document.querySelectorAll('#tool-grid [data-tool]')).map(n => n.dataset.tool).sort();
  assert.equal(netIds.length, 21, 'network has 21 nodes');
  assert.deepEqual(netIds, gridIds, 'network node set equals the lesson tool set (guards against drift)');
});

test('the network draws every dependency edge', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT14;
  assert.ok(Q, 'window.__QT14 exposed');
  assert.equal(window.document.querySelectorAll('.qw-net-edge').length, Q.EDGES.length, 'one path per edge');
  assert.ok(Q.EDGES.length >= 20, 'a substantive dependency backbone');
});

test('the five DMAIC columns are labelled in order', async () => {
  const { window } = await loadLesson();
  const headers = Array.from(window.document.querySelectorAll('.qw-net-colhdr')).map(t => t.textContent.toLowerCase());
  assert.deepEqual(headers, PHASES);
});

test('the dependency backbone is a DAG with valid endpoints', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT14;
  assert.equal(Q.hasCycle(), false, 'no cycles');
  const ids = new Set(Q.nodeIds());
  Q.EDGES.forEach(([a, b]) => {
    assert.ok(ids.has(a), `edge source ${a} is a known node`);
    assert.ok(ids.has(b), `edge target ${b} is a known node`);
  });
});

test('the toolbox is one connected investigation: charter reaches all, control plan follows all', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT14;
  assert.equal(Q.descendants('charter').size, 20, 'the charter is upstream of every other tool');
  assert.equal(Q.ancestors('controlplan').size, 20, 'the control plan is downstream of every other tool');
});

test('ancestry/descendant logic is correct on representative nodes', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT14;
  // Q.* arrays originate in the jsdom realm; copy into this realm before comparing.
  assert.deepEqual(Array.from(Q.predecessors('fish')).sort(), ['hist', 'pareto']);
  assert.deepEqual(Array.from(Q.successors('spc')).sort(), ['cap', 'controlplan']);
  const doeAnc = Q.ancestors('doe');
  ['charter', 'flow', 'check', 'msa', 'strat', 'fish', 'hyp', 'reg'].forEach(id =>
    assert.ok(doeAnc.has(id), `${id} precedes DOE`));
  assert.ok(!doeAnc.has('spc'), 'SPC does not precede DOE');
});

test('the lesson loads without unexpected errors', async () => {
  const { errors } = await loadLesson();
  assert.deepEqual(errors, [], 'no runtime errors (scrollIntoView polyfilled)');
});

/* ---------- interaction ---------- */

test('clicking a network node opens the existing detail panel', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('.qw-net-node[data-tool="fish"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(window.document.getElementById('tool-details').textContent, /Fishbone/, 'detail panel populated via showTool');
});

test('clicking a node traces its prerequisites and successors', async () => {
  const { window } = await loadLesson();
  const doe = window.document.querySelector('.qw-net-node[data-tool="doe"]');
  doe.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.ok(doe.classList.contains('sel'), 'node is selected');
  const pre = window.document.querySelectorAll('.qw-net-node.pre').length;
  const suc = window.document.querySelectorAll('.qw-net-node.suc').length;
  assert.ok(pre >= 8, 'upstream prerequisites are highlighted');
  assert.ok(suc >= 1, 'downstream successors are highlighted');
  assert.match(window.document.getElementById('qw-net-read').textContent, /prerequisite/, 'the readout reports the counts');
});

test('clicking the selected node again clears the trace', async () => {
  const { window } = await loadLesson();
  const node = window.document.querySelector('.qw-net-node[data-tool="pareto"]');
  node.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.ok(node.classList.contains('sel'));
  node.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.ok(!node.classList.contains('sel'), 'selection toggles off');
  assert.equal(window.document.querySelectorAll('.qw-net-node.pre').length, 0, 'no lingering highlights');
});

test('the phase tabs dim the network as well as filtering the grid', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('#phase-tabs [data-filter="improve"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const dimmed = window.document.querySelectorAll('.qw-net-node.phase-dim').length;
  // 21 tools minus the 8 improve-phase tools = 13 dimmed
  assert.equal(dimmed, 13, 'non-improve nodes are dimmed');
  assert.ok(window.document.querySelectorAll('#tool-grid [data-tool]').length < 21, 'grid still filters via its existing handler');
});

test('nodes are keyboard-operable', async () => {
  const { window } = await loadLesson();
  const node = window.document.querySelector('.qw-net-node[data-tool="strat"]');
  assert.equal(node.getAttribute('tabindex'), '0', 'node is focusable');
  assert.equal(node.getAttribute('role'), 'button', 'node has a button role');
  const ev = new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
  node.dispatchEvent(ev);
  assert.ok(node.classList.contains('sel'), 'Enter selects the node');
});

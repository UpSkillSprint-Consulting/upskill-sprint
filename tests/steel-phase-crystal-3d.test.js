'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { bootTool, ready, waitFor, ROOT } = require('./helpers/steel-phase-harness.js');

async function tool(t) {
  const ctx = bootTool();
  await ready(ctx.win);
  await waitFor(ctx.win, win => win.__SPX && win.__SPX.crystal3d);
  t.after(() => ctx.win.close());
  return ctx;
}

test('interactive crystal viewer loads with accessible controls and local assets', async t => {
  const { win, doc, record } = await tool(t);
  assert.equal(win.__SPX.crystal3d.version, '1.1.0');
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-3d.js'));
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-3d.css'));
  assert.equal(doc.getElementById('spx-crystal-canvas').tabIndex, 0);
  assert.equal(doc.getElementById('spx-crystal-canvas').getAttribute('role'), 'img');
  assert.equal(doc.querySelectorAll('#spx-crystal-mode option').length, 5);
  assert.equal(doc.querySelectorAll('[data-crystal-action]').length, 4);
  assert.equal(doc.getElementById('spx-crystal-labels').checked, true);
  assert.equal(record.errors.length, 0, record.errors.join('\n'));
});

test('automatic mode follows single- and multi-phase equilibrium selections', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.setPoint(0.10, 900);
  let state = win.__SPX.crystal3d.getState();
  assert.deepEqual(Array.from(state.phases), ['Austenite']);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /Face-centred cubic/i);

  win.__SPX.setPoint(0.40, 700);
  state = win.__SPX.crystal3d.getState();
  assert.deepEqual(Array.from(state.phases), ['Ferrite', 'Cementite']);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /Body-centred cubic.*Orthorhombic/is);

  win.__SPX.setPoint(0.77, 727);
  state = win.__SPX.crystal3d.getState();
  assert.deepEqual(Array.from(state.phases), ['Ferrite', 'Austenite', 'Cementite']);
  assert.match(state.region, /Eutectoid invariant/i);
});

test('carbon marker population increases with carbon content in single-phase austenite', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.setPoint(0.20, 900);
  const low = win.__SPX.crystal3d.getState().carbonMarkers.Austenite;
  win.__SPX.setPoint(1.00, 900);
  const high = win.__SPX.crystal3d.getState().carbonMarkers.Austenite;
  assert.ok(high > low, `expected marker count to increase, received ${low} then ${high}`);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /≈ 1 wt% C/i);
});

test('martensite is available only as an explicitly labelled manual reference', async t => {
  const { win, doc } = await tool(t);
  const mode = doc.getElementById('spx-crystal-mode');
  mode.value = 'Martensite';
  mode.dispatchEvent(new win.Event('change', { bubbles: true }));
  let state = win.__SPX.crystal3d.getState();
  assert.deepEqual(Array.from(state.phases), ['Martensite']);
  assert.match(doc.getElementById('spx-crystal-subtitle').textContent, /non-equilibrium reference/i);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /Body-centred tetragonal/i);

  win.__SPX.setPoint(0.10, 900);
  state = win.__SPX.crystal3d.getState();
  assert.deepEqual(Array.from(state.phases), ['Martensite'], 'manual selection remains pinned');
  mode.value = 'auto';
  mode.dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.deepEqual(Array.from(win.__SPX.crystal3d.getState().phases), ['Austenite']);
});

test('zoom buttons, keyboard rotation and reset update the 3D view state', async t => {
  const { win, doc } = await tool(t);
  const canvas = doc.getElementById('spx-crystal-canvas');
  const start = win.__SPX.crystal3d.getState();
  doc.querySelector('[data-crystal-action="zoom-in"]').click();
  assert.ok(win.__SPX.crystal3d.getState().zoom > start.zoom);
  canvas.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.ok(win.__SPX.crystal3d.getState().rotY > start.rotY);
  canvas.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  const reset = win.__SPX.crystal3d.getState();
  assert.equal(reset.zoom, 1);
  assert.equal(reset.rotX, -0.42);
  assert.equal(reset.rotY, 0.68);
});

test('viewer layout covers wide, tablet, phone, dark and print contexts', () => {
  const css = fs.readFileSync(path.join(ROOT, 'tools/steel-phase-explorer-3d.css'), 'utf8');
  assert.match(css, /@media\(min-width:1500px\)/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /@media\(max-width:420px\)/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /@media print/);
});

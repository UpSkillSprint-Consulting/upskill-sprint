'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { bootTool, ready, waitFor, ROOT } = require('./helpers/steel-phase-harness.js');

async function tool(t, options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  await waitFor(ctx.win, win => win.__SPX && win.__SPX.crystal3d);
  t.after(() => ctx.win.close());
  return ctx;
}

test('interactive crystal viewer loads with accessible controls and local assets', async t => {
  const { win, doc, record } = await tool(t);
  assert.equal(win.__SPX.crystal3d.version, '1.4.0');
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-3d.js'));
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-3d.css'));
  assert.equal(doc.getElementById('spx-crystal-canvas').tabIndex, 0);
  assert.equal(doc.getElementById('spx-crystal-canvas').getAttribute('role'), 'img');
  assert.match(doc.getElementById('spx-crystal-canvas').getAttribute('aria-describedby'), /spx-crystal-note/);
  assert.equal(doc.querySelectorAll('#spx-crystal-mode option').length, 5);
  assert.deepEqual([...doc.querySelectorAll('#spx-crystal-style option')].map(option => option.value), ['space', 'lattice', 'hybrid']);
  assert.equal(doc.getElementById('spx-crystal-style').value, 'hybrid');
  assert.equal(doc.querySelectorAll('[data-crystal-action]').length, 6);
  assert.equal(doc.querySelector('[data-crystal-action="fullscreen"]').getAttribute('aria-pressed'), 'false');
  assert.equal(doc.getElementById('spx-crystal-labels').checked, true);
  assert.equal(doc.getElementById('spx-crystal-summary').hasAttribute('aria-live'), false);
  assert.equal(record.errors.length, 0, record.errors.join('\n'));
});

test('display styles rerender without losing phase, carbon, rotation or zoom state', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.setPoint(1.00, 900);
  const canvas = doc.getElementById('spx-crystal-canvas');
  canvas.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  doc.querySelector('[data-crystal-action="zoom-in"]').click();
  const before = win.__SPX.crystal3d.getState();
  const style = doc.getElementById('spx-crystal-style');

  for (const value of ['space', 'lattice', 'hybrid']) {
    style.value = value;
    style.dispatchEvent(new win.Event('change', { bubbles: true }));
    const state = win.__SPX.crystal3d.getState();
    assert.equal(state.style, value);
    assert.equal(canvas.dataset.displayStyle, value);
    assert.deepEqual(Array.from(state.phases), Array.from(before.phases));
    assert.deepEqual(JSON.parse(JSON.stringify(state.carbonMarkers)), JSON.parse(JSON.stringify(before.carbonMarkers)));
    assert.equal(state.zoom, before.zoom);
    assert.equal(state.rotY, before.rotY);
    assert.match(doc.getElementById('spx-crystal-summary').textContent, new RegExp(value === 'space' ? 'Space-filling view' : value[0].toUpperCase() + value.slice(1) + ' view'));
    assert.match(canvas.getAttribute('aria-label'), new RegExp(value === 'space' ? 'Space-filling view' : value[0].toUpperCase() + value.slice(1) + ' view'));
  }
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
  assert.equal(state.regionKey, 'eutectoid');
  assert.equal(state.phaseCarbon.Ferrite, 0.022);
  assert.equal(state.phaseCarbon.Austenite, 0.77);
  assert.equal(state.phaseCarbon.Cementite, 6.67);
  assert.equal(state.carbonMarkers.Ferrite, 1);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /Ferrite · ≈ 0\.022 wt% C/i);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /phase amounts depend on reaction progress/i);
  assert.doesNotMatch(doc.getElementById('spx-crystal-summary').textContent, /use the mass percentages above/i);
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
  assert.equal(state.martensiteCA, 1 + 0.045 * state.point.c);

  win.__SPX.setPoint(0.10, 900);
  state = win.__SPX.crystal3d.getState();
  assert.deepEqual(Array.from(state.phases), ['Martensite'], 'manual selection remains pinned');
  mode.value = 'auto';
  mode.dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.deepEqual(Array.from(win.__SPX.crystal3d.getState().phases), ['Austenite']);
});

test('martensite tetragonality and markers respond to nominal carbon', async t => {
  const { win, doc } = await tool(t);
  const mode = doc.getElementById('spx-crystal-mode');
  mode.value = 'Martensite';
  mode.dispatchEvent(new win.Event('change', { bubbles: true }));
  win.__SPX.setPoint(0.20, 900);
  const low = win.__SPX.crystal3d.getState();
  win.__SPX.setPoint(1.00, 900);
  const high = win.__SPX.crystal3d.getState();
  assert.ok(high.martensiteCA > low.martensiteCA);
  assert.ok(high.carbonMarkers.Martensite > low.carbonMarkers.Martensite);
  assert.equal(low.martensiteCA, 1.009);
  assert.equal(high.martensiteCA, 1.045);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /c\/a ≈ 1\.045/i);
});

test('manual ferrite outside its phase field uses a solubility reference, not bulk carbon', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.setPoint(1.00, 900);
  const mode = doc.getElementById('spx-crystal-mode');
  mode.value = 'Ferrite';
  mode.dispatchEvent(new win.Event('change', { bubbles: true }));
  const state = win.__SPX.crystal3d.getState();
  assert.ok(state.phaseCarbon.Ferrite < 0.022);
  assert.notEqual(state.phaseCarbon.Ferrite, 1);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /solubility reference/i);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /outside this point’s equilibrium phase field/i);
});

test('manual austenite outside its phase field is labelled as a nominal reference', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.setPoint(0.40, 700);
  const mode = doc.getElementById('spx-crystal-mode');
  mode.value = 'Austenite';
  mode.dispatchEvent(new win.Event('change', { bubbles: true }));
  const state = win.__SPX.crystal3d.getState();
  assert.equal(state.phaseCarbon.Austenite, 0.4);
  assert.match(doc.getElementById('spx-crystal-summary').textContent, /nominal 0\.4 wt% C · out-of-field reference/i);
  assert.doesNotMatch(doc.getElementById('spx-crystal-summary').textContent, /Austenite · ≈ 0\.4 wt% C/i);
});

test('multi-phase cells keep stable screen anchors through rotation', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.setPoint(0.77, 727);
  const before = win.__SPX.crystal3d.getState();
  const canvas = doc.getElementById('spx-crystal-canvas');
  for (let i = 0; i < 8; i += 1) {
    canvas.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  }
  const after = win.__SPX.crystal3d.getState();
  assert.deepEqual(Array.from(after.anchors), Array.from(before.anchors));
  assert.ok(after.rotY > before.rotY + 0.9);
  assert.equal(new Set(after.anchors).size, 3);
});

test('canvas uses measured responsive dimensions without stretch', async t => {
  const { win, doc } = await tool(t);
  const canvas = doc.getElementById('spx-crystal-canvas');
  Object.defineProperty(win, 'innerWidth', { configurable: true, value: 390 });
  canvas.getBoundingClientRect = () => ({ width: 296, height: 315, top: 0, left: 0, right: 296, bottom: 315 });
  win.__SPX.crystal3d.sync();
  let state = win.__SPX.crystal3d.getState();
  assert.deepEqual(JSON.parse(JSON.stringify(state.canvas)), { width: 296, height: 315 });
  assert.equal(canvas.style.height, '315px');

  Object.defineProperty(win, 'innerWidth', { configurable: true, value: 430 });
  canvas.getBoundingClientRect = () => ({ width: 430, height: 360, top: 0, left: 0, right: 430, bottom: 360 });
  win.__SPX.crystal3d.sync();
  state = win.__SPX.crystal3d.getState();
  assert.deepEqual(JSON.parse(JSON.stringify(state.canvas)), { width: 430, height: 360 });
  assert.equal(canvas.style.height, '360px');
});

test('wheel zoom is opt-in and never traps scrolling at a zoom limit', async t => {
  const { win, doc } = await tool(t);
  const canvas = doc.getElementById('spx-crystal-canvas');
  const plain = new win.WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true });
  canvas.dispatchEvent(plain);
  assert.equal(plain.defaultPrevented, false);

  const zeroDelta = new win.WheelEvent('wheel', { deltaX: 100, deltaY: 0, ctrlKey: true, bubbles: true, cancelable: true });
  const zoomBeforeZeroDelta = win.__SPX.crystal3d.getState().zoom;
  canvas.dispatchEvent(zeroDelta);
  assert.equal(zeroDelta.defaultPrevented, false);
  assert.equal(win.__SPX.crystal3d.getState().zoom, zoomBeforeZeroDelta);

  const modified = new win.WheelEvent('wheel', { deltaY: -100, ctrlKey: true, bubbles: true, cancelable: true });
  canvas.dispatchEvent(modified);
  assert.equal(modified.defaultPrevented, true);
  for (let i = 0; i < 20; i += 1) doc.querySelector('[data-crystal-action="zoom-in"]').click();
  const limited = new win.WheelEvent('wheel', { deltaY: -100, ctrlKey: true, bubbles: true, cancelable: true });
  canvas.dispatchEvent(limited);
  assert.equal(limited.defaultPrevented, false);
});

test('pointer rotation ignores secondary mouse input and ends after capture loss', async t => {
  const { win, doc } = await tool(t);
  const canvas = doc.getElementById('spx-crystal-canvas');
  function pointerEvent(type, options) {
    const event = new win.MouseEvent(type, { bubbles: true, button: options.button || 0, clientX: options.x, clientY: options.y });
    Object.defineProperties(event, {
      pointerType: { value: 'mouse' },
      pointerId: { value: 1 },
      isPrimary: { value: true }
    });
    return event;
  }

  const start = win.__SPX.crystal3d.getState().rotY;
  canvas.dispatchEvent(pointerEvent('pointerdown', { button: 2, x: 10, y: 10 }));
  canvas.dispatchEvent(pointerEvent('pointermove', { x: 80, y: 10 }));
  assert.equal(win.__SPX.crystal3d.getState().rotY, start);

  canvas.dispatchEvent(pointerEvent('pointerdown', { x: 10, y: 10 }));
  canvas.dispatchEvent(pointerEvent('pointermove', { x: 30, y: 10 }));
  const afterDrag = win.__SPX.crystal3d.getState().rotY;
  assert.ok(afterDrag > start);
  canvas.dispatchEvent(pointerEvent('lostpointercapture', { x: 30, y: 10 }));
  canvas.dispatchEvent(pointerEvent('pointermove', { x: 80, y: 10 }));
  assert.equal(win.__SPX.crystal3d.getState().rotY, afterDrag);
});

test('small three-phase space-filling view never creates an invalid radial gradient', async t => {
  const ctx = bootTool();
  const { win, doc, record } = ctx;
  const canvas = doc.getElementById('spx-crystal-canvas');
  const gradients = [];
  const drawing = new Proxy({}, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'measureText') return () => ({ width: 10 });
      if (prop === 'createLinearGradient') return () => ({ addColorStop() {} });
      if (prop === 'createRadialGradient') return (...args) => {
        assert.ok(args[2] >= 0, `inner radius must be non-negative: ${args[2]}`);
        assert.ok(args[5] > args[2], `outer radius ${args[5]} must exceed inner radius ${args[2]}`);
        gradients.push(args);
        return { addColorStop() {} };
      };
      return () => undefined;
    },
    set(target, prop, value) { target[prop] = value; return true; }
  });
  canvas.getContext = () => drawing;
  canvas.getBoundingClientRect = () => ({ width: 296, height: 315, top: 0, left: 0, right: 296, bottom: 315 });
  Object.defineProperty(win, 'innerWidth', { configurable: true, value: 390 });
  await ready(win);
  await waitFor(win, window => window.__SPX && window.__SPX.crystal3d);
  t.after(() => win.close());

  win.__SPX.setPoint(0.77, 727);
  const style = doc.getElementById('spx-crystal-style');
  style.value = 'space';
  style.dispatchEvent(new win.Event('change', { bubbles: true }));
  for (let i = 0; i < 20; i += 1) doc.querySelector('[data-crystal-action="zoom-out"]').click();
  assert.equal(win.__SPX.crystal3d.getState().zoom, 0.58);
  assert.ok(gradients.length > 0);
  assert.equal(record.errors.length, 0, record.errors.join('\n'));
});

test('fullscreen control toggles label, state and exit behavior', async t => {
  const { win, doc } = await tool(t);
  const viewer = doc.getElementById('spx-crystal-viewer');
  const button = doc.querySelector('[data-crystal-action="fullscreen"]');
  let active = null;
  Object.defineProperty(doc, 'fullscreenElement', { configurable: true, get: () => active });
  viewer.requestFullscreen = () => {
    active = viewer;
    doc.dispatchEvent(new win.Event('fullscreenchange'));
    return Promise.resolve();
  };
  doc.exitFullscreen = () => {
    active = null;
    doc.dispatchEvent(new win.Event('fullscreenchange'));
    return Promise.resolve();
  };
  button.click();
  assert.equal(button.textContent, 'Exit full screen');
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  button.click();
  assert.equal(button.textContent, 'Full screen');
  assert.equal(button.getAttribute('aria-pressed'), 'false');
});

test('temperature label follows the selected unit', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.setUnit('imperial');
  assert.equal(win.__SPX.crystal3d.getState().unit, 'imperial');
  assert.match(doc.getElementById('spx-crystal-subtitle').textContent, /°F/);
  assert.doesNotMatch(doc.getElementById('spx-crystal-subtitle').textContent, /°C/);
});

test('a live reduced-motion preference change stops and explains auto rotation', async t => {
  let motionListener;
  const { win, doc } = await tool(t, { beforeParse(window) {
    window.matchMedia = () => ({
      matches: false,
      addEventListener(type, listener) { if (type === 'change') motionListener = listener; },
      removeEventListener() {}
    });
  } });
  const spin = doc.getElementById('spx-crystal-spin');
  spin.checked = true;
  spin.dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.equal(spin.disabled, false);
  motionListener({ matches: true });
  assert.equal(spin.checked, false);
  assert.equal(spin.disabled, true);
  assert.equal(doc.getElementById('spx-crystal-motion-note').hidden, false);
});

test('zoom buttons, keyboard rotation and reset update the 3D view state', async t => {
  const { win, doc } = await tool(t);
  const canvas = doc.getElementById('spx-crystal-canvas');
  const start = win.__SPX.crystal3d.getState();
  doc.querySelector('[data-crystal-action="tilt-down"]').click();
  assert.ok(win.__SPX.crystal3d.getState().rotX > start.rotX);
  doc.querySelector('[data-crystal-action="tilt-up"]').click();
  assert.ok(Math.abs(win.__SPX.crystal3d.getState().rotX - start.rotX) < 1e-9);
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
  assert.match(css, /touch-action:pan-y pinch-zoom/);
  assert.match(css, /:fullscreen/);
  assert.match(css, /@media print/);
});

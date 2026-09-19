'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const TOOLS = path.join(__dirname, '..', 'tools');
const read = f => fs.readFileSync(path.join(TOOLS, f), 'utf8');

/* Minimal host page mirroring the parts of the tool the loader depends on. */
const HOST = `<!doctype html><html><head></head><body>
<main id="spx-tool">
  <div class="spx-tabs" role="tablist">
    <button role="tab" data-tab="equilibrium">Equilibrium</button>
    <button role="tab" data-tab="learn">Learn</button>
  </div>
  <section id="spx-tab-equilibrium" class="spx-panel" data-panel="equilibrium"></section>
  <section id="spx-tab-learn" class="spx-panel" data-panel="learn"></section>
</main></body></html>`;

function boot() {
  const dom = new JSDOM(HOST, { runScripts: 'outside-only', pretendToBeVisual: true });
  const win = dom.window;

  /* Globals the release modules integrate with, as core.js provides them. */
  win.state = { unit: 'metric' };
  win.CtoF = c => c * 9 / 5 + 32;
  win.FtoC = f => (f - 32) * 5 / 9;
  win.setUnit = u => { win.state.unit = u; };
  win.switchTab = () => {};

  /* jsdom has no layout engine, so these SVG APIs need stubbing. */
  win.SVGElement.prototype.createSVGPoint = function () {
    return { x: 0, y: 0, matrixTransform() { return { x: 0, y: 0 }; } };
  };
  win.SVGElement.prototype.getScreenCTM = function () { return { inverse: () => ({}) }; };
  win.Element.prototype.scrollTo = function () {};
  win.fetch = () => Promise.reject(new Error('offline in tests'));

  const run = src => win.eval(src);
  run(read('steel-phase-explorer-poster-geometry.js'));
  run(read('steel-phase-explorer-rapid-geometry.js'));
  run(read('steel-phase-explorer-release5-loader.js'));
  run(read('steel-phase-explorer-release5.js'));
  return win;
}

/* The loader polls, but the host DOM is present immediately, so one boot
   is enough. Each test gets a fresh window. */

test('loader injects the reference diagrams tab', () => {
  const win = boot();
  const tab = win.document.querySelector('.spx-tabs [data-tab="reference-diagrams"]');
  assert.ok(tab, 'tab button exists');
  assert.equal(tab.getAttribute('aria-controls'), 'spx-tab-reference-diagrams');
});

test('the tab is inserted before the learn tab', () => {
  const win = boot();
  const buttons = [...win.document.querySelectorAll('.spx-tabs button')].map(b => b.dataset.tab);
  assert.deepEqual(buttons, ['equilibrium', 'reference-diagrams', 'learn']);
});

test('loader injects the panel before the learn panel', () => {
  const win = boot();
  const panel = win.document.getElementById('spx-tab-reference-diagrams');
  assert.ok(panel, 'panel exists');
  assert.equal(panel.nextElementSibling.id, 'spx-tab-learn');
  assert.equal(panel.hidden, true, 'starts hidden');
});

test('loader is idempotent', () => {
  const win = boot();
  win.eval(read('steel-phase-explorer-release5-loader.js'));
  assert.equal(win.document.querySelectorAll('#spx-tab-reference-diagrams').length, 1);
  assert.equal(win.document.querySelectorAll('[data-tab="reference-diagrams"]').length, 1);
});

test('loader requests its stylesheet once', () => {
  const win = boot();
  win.eval(read('steel-phase-explorer-release5-loader.js'));
  const links = win.document.querySelectorAll('link[href="/tools/steel-phase-explorer-release5.css"]');
  assert.equal(links.length, 1);
});

test('labels control accurately distinguishes overlays from poster artwork', () => {
  const win = boot();
  const control = win.document.getElementById('spx-r5-labels');
  assert.match(control.parentElement.textContent, /Overlay labels/);
  const guide = fs.readFileSync(path.join(TOOLS, 'steel-phase-explorer', 'how-to-use', 'index.html'), 'utf8');
  assert.match(guide, /labels printed in the poster artwork remain visible/);
});

test('geometry modules load before the render module', () => {
  const win = boot();
  assert.ok(win.SPXRapidGeometry, 'rapid geometry defined');
  assert.ok(win.SPXPosterGeometry, 'poster geometry defined');
  assert.ok(win.__SPX && win.__SPX.release5, 'render module initialised');
});

test('the test hook exposes the expected surface', () => {
  const win = boot();
  const api = win.__SPX.release5;
  ['render', 'state', 'setMap', 'setLevel', 'regionAt', 'addPoint', 'removeActive', 'posterLoaded']
    .forEach(k => assert.equal(typeof api[k], 'function', `${k} exposed`));
});

test('default state starts on the rapid map at engineer level', () => {
  const win = boot();
  const s = win.__SPX.release5.state();
  assert.equal(s.map, 'rapid');
  assert.equal(s.level, 'engineer');
  assert.ok(s.points.length >= 3, 'seeded with example points');
});

test('the rapid diagram renders region paths', () => {
  const win = boot();
  const regions = win.document.querySelectorAll('#spx-r5-reference [data-r5-region]');
  assert.ok(regions.length >= 6, `expected several regions, got ${regions.length}`);
});

test('every rendered region carries an accessible label', () => {
  const win = boot();
  win.document.querySelectorAll('#spx-r5-reference [data-r5-region]').forEach(node => {
    const key = node.getAttribute('data-r5-region');
    assert.ok(win.SPXRapidGeometry.LABELS[key], `label for ${key}`);
    if (node.getAttribute('tabindex') !== null) {
      assert.ok(node.getAttribute('aria-label'), `aria-label on ${key}`);
    }
  });
});

test('interactive regions are keyboard reachable', () => {
  const win = boot();
  const focusable = win.document.querySelectorAll('#spx-r5-reference [data-r5-region][tabindex="0"]');
  assert.ok(focusable.length >= 6, 'regions are tabbable');
});

test('region paths contain no malformed coordinates', () => {
  const win = boot();
  win.document.querySelectorAll('#spx-r5-reference path[d]').forEach(p => {
    assert.ok(!/NaN|Infinity|undefined/.test(p.getAttribute('d')), 'clean path data');
  });
});

test('critical lines render when enabled', () => {
  const win = boot();
  const lines = win.document.querySelectorAll('#spx-r5-emphasis .spx-r5-critical');
  assert.ok(lines.length >= 5, `A1 A3 Acm Ms Mf, got ${lines.length}`);
});

test('toggling critical lines off removes them', () => {
  const win = boot();
  const box = win.document.getElementById('spx-r5-critical');
  box.checked = false;
  box.dispatchEvent(new win.Event('change'));
  assert.equal(win.document.querySelectorAll('#spx-r5-emphasis .spx-r5-critical').length, 0);
});

test('toggling labels off removes field labels', () => {
  const win = boot();
  const box = win.document.getElementById('spx-r5-labels');
  box.checked = false;
  box.dispatchEvent(new win.Event('change'));
  assert.equal(win.document.querySelectorAll('.spx-r5-fieldlabel').length, 0);
});

test('the legend lists regions and hides on toggle', () => {
  const win = boot();
  assert.ok(win.document.querySelectorAll('#spx-r5-legend [data-r5-legend]').length >= 6);
  const box = win.document.getElementById('spx-r5-legend-toggle');
  box.checked = false;
  box.dispatchEvent(new win.Event('change'));
  assert.equal(win.document.getElementById('spx-r5-legend-card').hidden, true);
});

test('selecting a legend entry updates the explanation panel', () => {
  const win = boot();
  const btn = win.document.querySelector('#spx-r5-legend [data-r5-legend="pearlite"]');
  assert.ok(btn, 'pearlite legend entry exists');
  btn.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.match(win.document.getElementById('spx-r5-help').textContent, /Pearlite/i);
});

test('legend selection retains focus on the replacement button', () => {
  const win = boot();
  const doc = win.document;
  const original = doc.querySelector('#spx-r5-legend [data-r5-legend="pearlite"]');
  original.focus();
  original.click();
  const replacement = doc.querySelector('#spx-r5-legend [data-r5-legend="pearlite"]');
  assert.notEqual(replacement, original, 'the legend was rerendered');
  assert.equal(doc.activeElement, replacement);
  assert.equal(replacement.getAttribute('aria-pressed'), 'true');
});

test('points render one row each', () => {
  const win = boot();
  const rows = win.document.querySelectorAll('#spx-r5-points-list .spx-r5-point-row');
  assert.equal(rows.length, win.__SPX.release5.state().points.length);
});

test('adding a point appends a row', () => {
  const win = boot();
  const before = win.__SPX.release5.state().points.length;
  win.document.getElementById('spx-r5-add').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.equal(win.__SPX.release5.state().points.length, before + 1);
  assert.equal(win.document.querySelectorAll('#spx-r5-points-list .spx-r5-point-row').length, before + 1);
});

test('removing leaves at least one point', () => {
  const win = boot();
  const api = win.__SPX.release5;
  while (api.removeActive()) { /* drain */ }
  assert.equal(api.state().points.length, 1);
});

test('point identifiers stay unique as points are added', () => {
  const win = boot();
  const api = win.__SPX.release5;
  api.addPoint(0.3, 500);
  api.addPoint(0.9, 300);
  const ids = api.state().points.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'no duplicate ids');
});

test('point selection and editing retain focus across list rerenders', () => {
  const win = boot();
  const doc = win.document;
  const id = win.__SPX.release5.addPoint(0.3, 500);

  let original = doc.querySelector(`[data-r5-select="${id}"]`);
  original.focus();
  original.click();
  let replacement = doc.querySelector(`[data-r5-select="${id}"]`);
  assert.notEqual(replacement, original, 'the point list was rerendered');
  assert.equal(doc.activeElement, replacement);
  assert.equal(replacement.getAttribute('aria-pressed'), 'true');

  original = doc.querySelector(`[data-r5-c="${id}"]`);
  original.focus();
  original.value = '0.35';
  original.dispatchEvent(new win.Event('change', { bubbles: true }));
  replacement = doc.querySelector(`[data-r5-c="${id}"]`);
  assert.notEqual(replacement, original, 'the edited point row was rerendered');
  assert.equal(doc.activeElement, replacement);
});

test('coarse-pointer marker pickup exposes a 44px-equivalent hit target', () => {
  const win = boot();
  const hits = [...win.document.querySelectorAll('#spx-r5-point-layer .spx-r5-marker-hit')];
  assert.equal(hits.length, win.__SPX.release5.state().points.length);
  hits.forEach(hit => {
    assert.equal(hit.getAttribute('stroke-width'), '44');
    assert.equal(hit.getAttribute('vector-effect'), 'non-scaling-stroke');
    assert.equal(hit.getAttribute('aria-hidden'), 'true');
  });
  const css = read('steel-phase-explorer-release5.css');
  assert.match(css, /@media \(any-pointer:coarse\)\{[^}]*\.spx-r5-marker-hit\{[^}]*pointer-events:stroke/);
});

test('touch pickup selects the nearest marker within the enlarged target', () => {
  const win = boot();
  const svg = win.document.getElementById('spx-r5-svg');
  const markers = [...svg.querySelectorAll('.spx-r5-marker[data-r5-point]')];
  markers.forEach((marker, i) => {
    marker.getBoundingClientRect = () => ({ left: i * 80 + 10, top: 10, width: 10, height: 10 });
  });
  svg.setPointerCapture = () => {};
  const event = new win.MouseEvent('pointerdown', {
    bubbles: true, cancelable: true, clientX: 96, clientY: 15
  });
  Object.defineProperties(event, {
    pointerType: { value: 'touch' },
    pointerId: { value: 7 }
  });
  svg.dispatchEvent(event);
  assert.equal(win.__SPX.release5.state().activeId, Number(markers[1].dataset.r5Point));
});

test('pointer hover stays silent and a completed point move is announced once', () => {
  const win = boot();
  const doc = win.document;
  const svg = doc.getElementById('spx-r5-svg');
  const status = doc.getElementById('spx-r5-status');
  svg.createSVGPoint = () => ({
    x: 0, y: 0,
    matrixTransform() { return { x: 500, y: 500 }; }
  });
  svg.setPointerCapture = () => {};
  svg.releasePointerCapture = () => {};
  status.textContent = 'No committed change.';

  svg.dispatchEvent(new win.MouseEvent('pointermove', {
    bubbles: true, clientX: 500, clientY: 500
  }));
  assert.equal(status.textContent, 'No committed change.', 'hover does not flood the live region');

  const marker = svg.querySelector('.spx-r5-marker[data-r5-point="1"]');
  const down = new win.MouseEvent('pointerdown', {
    bubbles: true, cancelable: true, clientX: 500, clientY: 500
  });
  Object.defineProperty(down, 'pointerId', { value: 8 });
  marker.dispatchEvent(down);
  const move = new win.MouseEvent('pointermove', {
    bubbles: true, clientX: 510, clientY: 510
  });
  Object.defineProperty(move, 'pointerId', { value: 8 });
  svg.dispatchEvent(move);
  assert.equal(status.textContent, 'No committed change.', 'drag updates remain silent');
  const up = new win.MouseEvent('pointerup', { bubbles: true });
  Object.defineProperty(up, 'pointerId', { value: 8 });
  svg.dispatchEvent(up);
  assert.match(status.textContent, /^P1 moved to /);
});

test('the readout region matches the geometry module', () => {
  const win = boot();
  const api = win.__SPX.release5;
  const G = win.SPXRapidGeometry;
  [[0.4, 700], [0.6, 500], [0.9, 250], [0.3, 100]].forEach(([c, t]) => {
    assert.equal(api.regionAt(c, t), G.regionAt(c, t), `agreement at ${c},${t}`);
  });
});

test('points outside the diagram are reported as such', () => {
  const win = boot();
  const api = win.__SPX.release5;
  api.addPoint(1.1, 950);
  const text = win.document.getElementById('spx-r5-points-list').textContent;
  assert.ok(text.length > 0, 'rows rendered');
});

test('switching to the poster changes the viewBox to the poster page size', () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  const vb = win.document.getElementById('spx-r5-svg').getAttribute('viewBox');
  assert.equal(vb, `0 0 ${win.SPXPosterGeometry.PAGE.w} ${win.SPXPosterGeometry.PAGE.h}`);
});

test('poster mode uses the poster classifier', () => {
  const win = boot();
  const api = win.__SPX.release5;
  api.setMap('poster');
  assert.equal(api.regionAt(0.4, 600), win.SPXPosterGeometry.regionAt(0.4, 600));
});

test('poster mode reports a load failure rather than throwing', () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  assert.equal(win.__SPX.release5.posterLoaded(), false, 'fetch is stubbed to fail');
  assert.ok(win.document.getElementById('spx-r5-svg'), 'diagram element survives');
});

test('switching maps reseeds points inside the new range', () => {
  const win = boot();
  const api = win.__SPX.release5;
  api.setMap('poster');
  api.state().points.forEach(p => {
    assert.ok(p.c >= 0 && p.c <= win.SPXPosterGeometry.POINTS.cementiteC, `carbon in range: ${p.c}`);
  });
});

test('unit toggle switches the temperature column header', () => {
  const win = boot();
  const imperial = win.document.querySelector('#spx-r5-unit [data-r5-unit="imperial"]');
  imperial.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.match(win.document.getElementById('spx-r5-points-list').innerHTML, /\u00B0F/);
});

test('changing units does not move points', () => {
  const win = boot();
  const api = win.__SPX.release5;
  const before = api.state().points.map(p => ({ c: p.c, t: p.t }));
  win.document.querySelector('#spx-r5-unit [data-r5-unit="imperial"]')
    .dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  const after = api.state().points.map(p => ({ c: p.c, t: p.t }));
  assert.deepEqual(after, before, 'canonical values unchanged');
});

test('point temperature controls expose diagram and unit-specific bounds', () => {
  const win = boot();
  let input = win.document.querySelector('#spx-r5-points-list [data-r5-t]');
  assert.equal(Number(input.min), win.SPXRapidGeometry.RANGE.tMin);
  assert.equal(Number(input.max), win.SPXRapidGeometry.RANGE.tMax);

  win.document.querySelector('#spx-r5-unit [data-r5-unit="imperial"]')
    .dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  input = win.document.querySelector('#spx-r5-points-list [data-r5-t]');
  assert.equal(Number(input.min), -148);
  assert.equal(Number(input.max), 1832);

  win.__SPX.release5.setMap('poster');
  input = win.document.querySelector('#spx-r5-points-list [data-r5-t]');
  assert.equal(Number(input.min), 32);
  assert.equal(Number(input.max), 2912);
});

test('invalid point edits are rejected rather than silently clamped', () => {
  const win = boot();
  const api = win.__SPX.release5;
  const before = api.state().points[0];
  const input = win.document.querySelector('#spx-r5-points-list [data-r5-t]');
  input.value = '5000';
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.equal(input.getAttribute('aria-invalid'), 'true');
  assert.equal(api.state().points[0].t, before.t);
  assert.match(win.document.getElementById('spx-r5-status').textContent,
    /must be between.*point was not changed/i);
});

test('experience level changes the explanation text', () => {
  const win = boot();
  const api = win.__SPX.release5;
  const help = () => win.document.getElementById('spx-r5-help').textContent;
  api.setLevel('beginner');
  const beginner = help();
  api.setLevel('advanced');
  const advanced = help();
  assert.notEqual(beginner, advanced, 'copy differs by level');
});

test('advanced level surfaces the validation caution', () => {
  const win = boot();
  win.__SPX.release5.setLevel('advanced');
  assert.match(win.document.getElementById('spx-r5-help').textContent, /[Vv]alidate/);
});

test('zoom controls update the readout and clamp at fit', () => {
  const win = boot();
  const label = () => win.document.getElementById('spx-r5-zoom-label').textContent;
  const wrap = win.document.getElementById('spx-r5-svg-wrap');
  assert.equal(wrap.classList.contains('is-fit'), true, 'fit view does not clip the diagram');
  win.document.getElementById('spx-r5-zoom-in').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.equal(label(), '125%');
  assert.equal(wrap.classList.contains('is-fit'), false, 'zoomed diagrams use the scrollable viewport');
  win.document.getElementById('spx-r5-zoom-reset').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.equal(label(), '100%');
  assert.equal(wrap.classList.contains('is-fit'), true);
  win.document.getElementById('spx-r5-zoom-out').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.equal(label(), '100%', 'clamped at fit');
});

test('full-screen control tracks entry and exit state', async () => {
  const win = boot();
  const doc = win.document;
  const wrap = doc.getElementById('spx-r5-svg-wrap');
  const button = doc.getElementById('spx-r5-fullscreen');
  let fullscreen = null;
  Object.defineProperty(doc, 'fullscreenElement', { configurable: true, get: () => fullscreen });
  wrap.requestFullscreen = () => {
    fullscreen = wrap;
    doc.dispatchEvent(new win.Event('fullscreenchange'));
    return Promise.resolve();
  };
  doc.exitFullscreen = () => {
    fullscreen = null;
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

test('the source note credits Buehler and ASM on the poster tab', () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  const note = win.document.getElementById('spx-r5-source-note').textContent;
  assert.match(note, /Buehler/);
  assert.match(note, /ASM International/);
  assert.match(note, /permission/i);
});

test('the rapid tab states it is not a TTT or CCT diagram', () => {
  const win = boot();
  assert.match(win.document.getElementById('spx-r5-subtitle').textContent, /not a TTT or CCT/i);
});

test('the model note declares which boundaries are approximate', () => {
  const win = boot();
  assert.match(win.document.getElementById('spx-r5-model-note').textContent, /approximation/i);
});

test('state serialisation round-trips through the host hooks', () => {
  const win = boot();
  win.serializable = () => ({ base: true });
  win.restore = () => true;
  win.eval(read('steel-phase-explorer-release5.js'));
  assert.ok(typeof win.serializable === 'function');
});

test('no duplicate element ids in the injected panel', () => {
  const win = boot();
  const ids = [...win.document.getElementById('spx-tab-reference-diagrams').querySelectorAll('[id]')]
    .map(n => n.id);
  assert.equal(new Set(ids).size, ids.length, 'ids unique');
});

/* ---------- reference-layer rebuild guard ----------
 * The poster layer costs a 2.2 MB parse and ~15k node imports. Rebuilding it
 * on every render blocks the main thread and presents as a stuck loading
 * indicator, which is exactly what shipped before this guard existed.
 */

test('the reference layer is not rebuilt on an ordinary re-render', () => {
  const win = boot();
  const first = win.document.querySelector('#spx-r5-reference').firstChild;
  win.__SPX.release5.render();
  win.__SPX.release5.render();
  const after = win.document.querySelector('#spx-r5-reference').firstChild;
  assert.equal(after, first, 'same node instance, so no rebuild happened');
});

test('moving a point does not rebuild the reference layer', () => {
  const win = boot();
  const first = win.document.querySelector('#spx-r5-reference').firstChild;
  win.__SPX.release5.addPoint(0.5, 400);
  assert.equal(win.document.querySelector('#spx-r5-reference').firstChild, first);
});

test('toggling the crosshair does not rebuild the reference layer', () => {
  const win = boot();
  const first = win.document.querySelector('#spx-r5-reference').firstChild;
  const box = win.document.getElementById('spx-r5-crosshair-toggle');
  box.checked = false;
  box.dispatchEvent(new win.Event('change'));
  assert.equal(win.document.querySelector('#spx-r5-reference').firstChild, first);
});

test('toggling labels does rebuild the reference layer', () => {
  const win = boot();
  const first = win.document.querySelector('#spx-r5-reference').firstChild;
  const box = win.document.getElementById('spx-r5-labels');
  box.checked = false;
  box.dispatchEvent(new win.Event('change'));
  assert.notEqual(win.document.querySelector('#spx-r5-reference').firstChild, first);
});

test('switching diagrams rebuilds the reference layer', () => {
  const win = boot();
  const first = win.document.querySelector('#spx-r5-reference').firstChild;
  win.__SPX.release5.setMap('poster');
  assert.notEqual(win.document.querySelector('#spx-r5-reference').firstChild, first);
});

test('a failed poster load reports an error state rather than spinning', async () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 20));
  assert.equal(win.__SPX.release5.posterState(), 'error');
  assert.equal(win.document.getElementById('spx-r5-loading').hidden, true,
    'loading indicator is cleared on failure');
});

test('a failed poster load surfaces a reason and a retry control', async () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 20));
  assert.match(win.document.getElementById('spx-r5-status').textContent, /could not be loaded/i);
  assert.ok(win.document.getElementById('spx-r5-retry'), 'retry button offered');
});

test('a failed poster load is not retried on every render', async () => {
  const win = boot();
  let calls = 0;
  win.fetch = () => { calls++; return Promise.reject(new Error('offline')); };
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 20));
  const afterFirst = calls;
  win.__SPX.release5.render();
  win.__SPX.release5.render();
  assert.equal(calls, afterFirst, 'error state suppresses repeat fetches');
});

test('concurrent poster requests share one in-flight fetch', async () => {
  const win = boot();
  let calls = 0;
  win.fetch = () => { calls++; return new Promise(() => {}); };
  win.__SPX.release5.setMap('poster');
  win.__SPX.release5.render();
  win.__SPX.release5.render();
  assert.equal(calls, 1, 'one request, not one per render');
});

test('a non-SVG response is rejected rather than injected', async () => {
  const win = boot();
  win.fetch = () => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('<html>404</html>') });
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 20));
  assert.equal(win.__SPX.release5.posterState(), 'error');
  assert.match(win.document.getElementById('spx-r5-status').textContent, /not SVG/i);
});

test('an HTTP error is reported with its status code', async () => {
  const win = boot();
  win.fetch = () => Promise.resolve({ ok: false, status: 404, statusText: 'Not Found' });
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 20));
  assert.match(win.document.getElementById('spx-r5-status').textContent, /404/);
});

test('a successful poster load injects the artwork once', async () => {
  const win = boot();
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 2736"><rect width="10" height="10"/></svg>';
  win.fetch = () => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(svg) });
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 30));
  assert.equal(win.__SPX.release5.posterState(), 'ready');
  const poster = win.document.querySelector('#spx-r5-reference .spx-r5-poster');
  assert.ok(poster);
  assert.equal(poster.getAttribute('aria-hidden'), 'true');
  assert.equal(poster.getAttribute('focusable'), 'false');
  win.__SPX.release5.render();
  assert.equal(win.document.querySelectorAll('#spx-r5-reference .spx-r5-poster').length, 1,
    'still one after a re-render');
});

test('poster PNG export reports a failed raster embed instead of false success', async () => {
  const win = boot();
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 2736">' +
    '<image href="/assets/steel-phase/poster/missing.png" width="10" height="10"/></svg>';
  win.fetch = url => String(url).endsWith('poster.svg')
    ? Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(svg) })
    : Promise.resolve({ ok: false, status: 404, blob: () => Promise.resolve(new win.Blob()) });
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 30));
  assert.equal(win.__SPX.release5.posterState(), 'ready');
  win.document.getElementById('spx-r5-export').click();
  await new Promise(r => setTimeout(r, 20));
  assert.match(win.document.getElementById('spx-r5-status').textContent,
    /PNG export failed.*could not be embedded.*404/i);
  assert.doesNotMatch(win.document.getElementById('spx-r5-status').textContent,
    /^PNG exported\.$/i);
});

/* ---------- region highlighting ----------
 * Selecting a legend entry set state but drew nothing: drawOverlay never
 * referenced s5.highlight, and the poster tab has no region paths of its own
 * because the artwork is imported. Highlight shapes are now derived by
 * sampling the classifier, which works on both tabs and cannot disagree with
 * the readout.
 */

function highlightRects(win) {
  return win.document.querySelectorAll('#spx-r5-overlay .spx-r5-highlight rect');
}

test('selecting a region draws it on the rapid diagram', () => {
  const win = boot();
  assert.equal(highlightRects(win).length, 0, 'nothing highlighted initially');
  win.__SPX.release5.setHighlight('pearlite');
  assert.ok(highlightRects(win).length > 5, 'highlight shapes drawn');
});

test('EVERY legend entry on the rapid tab produces a visible highlight', () => {
  const win = boot();
  const keys = [...win.document.querySelectorAll('#spx-r5-legend [data-r5-legend]')]
    .map(b => b.dataset.r5Legend);
  assert.ok(keys.length >= 6, 'legend populated');
  keys.forEach(k => {
    win.__SPX.release5.setHighlight(k);
    assert.ok(highlightRects(win).length > 0, `no highlight drawn for ${k}`);
  });
});

test('EVERY legend entry on the poster tab produces a visible highlight', () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  const keys = [...win.document.querySelectorAll('#spx-r5-legend [data-r5-legend]')]
    .map(b => b.dataset.r5Legend);
  assert.ok(keys.length >= 8, 'poster legend populated');
  keys.forEach(k => {
    win.__SPX.release5.setHighlight(k);
    assert.ok(highlightRects(win).length > 0, `no highlight drawn for ${k}`);
  });
});

test('the highlight works even when the poster artwork failed to load', async () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  await new Promise(r => setTimeout(r, 20));
  assert.equal(win.__SPX.release5.posterState(), 'error', 'artwork unavailable in tests');
  win.__SPX.release5.setHighlight('austenite');
  assert.ok(highlightRects(win).length > 0, 'overlay is independent of the artwork');
});

test('highlight shapes only cover cells the classifier assigns to that region', () => {
  const win = boot();
  const G = win.SPXRapidGeometry;
  win.__SPX.release5.setHighlight('upperBainite');
  const rects = [...highlightRects(win)];
  assert.ok(rects.length > 0, 'shapes exist');
  rects.slice(0, 40).forEach(r => {
    const cx = Number(r.getAttribute('x')) + Number(r.getAttribute('width')) / 2;
    const cy = Number(r.getAttribute('y')) + Number(r.getAttribute('height')) / 2;
    assert.equal(G.regionAt(G.cOf(cx), G.tOf(cy)), 'upperBainite',
      'a highlighted cell that is not actually in the region');
  });
});

test('clicking a legend entry highlights and clicking it again clears', () => {
  const win = boot();
  const btn = win.document.querySelector('#spx-r5-legend [data-r5-legend="pearlite"]');
  btn.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.equal(win.__SPX.release5.highlight(), 'pearlite');
  assert.ok(highlightRects(win).length > 0, 'drawn after first click');

  win.document.querySelector('#spx-r5-legend [data-r5-legend="pearlite"]')
    .dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.equal(win.__SPX.release5.highlight(), null);
  assert.equal(highlightRects(win).length, 0, 'cleared after second click');
});

test('the legend reports the highlight in the status line', () => {
  const win = boot();
  win.document.querySelector('#spx-r5-legend [data-r5-legend="pearlite"]')
    .dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.match(win.document.getElementById('spx-r5-status').textContent, /Pearlite highlighted/i);
});

test('the highlight carries a readable label', () => {
  const win = boot();
  win.__SPX.release5.setHighlight('lowerBainite');
  const label = win.document.querySelector('#spx-r5-overlay .spx-r5-highlight text');
  assert.ok(label, 'label drawn');
  assert.equal(label.textContent, win.SPXRapidGeometry.LABELS.lowerBainite);
});

test('escape clears the highlight while the tab is visible', () => {
  const win = boot();
  win.document.getElementById('spx-tab-reference-diagrams').hidden = false;
  win.__SPX.release5.setHighlight('pearlite');
  win.document.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(win.__SPX.release5.highlight(), null);
  assert.equal(highlightRects(win).length, 0);
});

test('the highlight is cleared when switching diagrams', () => {
  const win = boot();
  win.__SPX.release5.setHighlight('pearlite');
  win.document.querySelector('#spx-r5-subnav [data-r5-map="poster"]')
    .dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  assert.equal(win.__SPX.release5.highlight(), null, 'stale highlight not carried across');
  assert.equal(highlightRects(win).length, 0);
});

test('highlight shapes are cached rather than recomputed on every overlay draw', () => {
  const win = boot();
  const G = win.SPXRapidGeometry;
  win.__SPX.release5.setHighlight('pearlite');
  const baseline = win.__SPX.release5.highlightShapeCount();

  let calls = 0;
  const real = G.regionAt;
  G.regionAt = function (c, t) { calls++; return real(c, t); };
  win.__SPX.release5.render();
  win.__SPX.release5.render();
  G.regionAt = real;

  assert.ok(baseline > 0, 'shapes exist');
  assert.ok(calls < 5000,
    `two renders should reuse the cache, saw ${calls} classifier calls`);
});

test('changing the highlight recomputes the shapes', () => {
  const win = boot();
  win.__SPX.release5.setHighlight('pearlite');
  const a = win.__SPX.release5.highlightShapeCount();
  win.__SPX.release5.setHighlight('martensiteAustenite');
  const b = win.__SPX.release5.highlightShapeCount();
  assert.ok(a > 0 && b > 0, 'both produced shapes');
  assert.notEqual(a, b, 'different regions give different shape counts');
});

test('narrow point editors keep both numeric fields in the flexible column', () => {
  const css = read('steel-phase-explorer-release5.css');
  assert.match(css, /\.spx-r5-point-row input\{[^}]*width:100%;[^}]*min-width:0/,
    'numeric inputs can shrink to the available card width');
  assert.match(css, /@media \(max-width:720px\)\{[^}]*\.spx-r5-point-row\{grid-template-columns:auto minmax\(0,1fr\)\}[^}]*\.spx-r5-point-row>label\{grid-column:2\}/,
    'both field labels stay out of the narrow point-selector column');
  assert.match(css, /@media \(max-width:520px\)\{[^}]*\.spx-r5-stack\{grid-template-columns:minmax\(0,1fr\)\}/,
    'the 300px card minimum does not overflow a 320px viewport');
});

'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { bootTool, ready, ROOT } = require('./helpers/steel-phase-harness.js');

async function tool() {
  const ctx = bootTool();
  await ready(ctx.win);
  return ctx;
}

function key(win, target, value, options) {
  const event = new win.KeyboardEvent('keydown', Object.assign({
    key: value,
    bubbles: true,
    cancelable: true
  }, options));
  target.dispatchEvent(event);
  return event;
}

test('guided routes move focus out of the panel they hide', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const routes = [
    ['[data-guide-route="phase"]', 'equilibrium'],
    ['[data-release2-route="hardenability"]', 'hardenability'],
    ['[data-release3-route="process-data"]', 'process-data'],
    ['[data-release4-route="surface"]', 'metallurgy-lab'],
    ['#spx-resume-work', 'equilibrium']
  ];

  for (const [selector, tabName] of routes) {
    win.switchTab('navigator');
    const source = doc.querySelector(selector);
    const sourcePanel = source.closest('[data-panel]');
    source.focus();
    source.click();
    const destinationTab = doc.querySelector(`.spx-tabs [data-tab="${tabName}"]`);
    assert.equal(win.__SPX.getState().tab, tabName, `${selector} opens ${tabName}`);
    assert.equal(sourcePanel.hidden, true, `${selector} source panel is hidden`);
    assert.equal(doc.activeElement, destinationTab, `${selector} transfers focus to the visible tab`);
  }
});

test('equilibrium point buttons activate with Enter and Space and retain focus', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const secondId = win.__SPX.addPoint(0.9, 800);

  let first = doc.querySelector('#spx-points [data-point-id="1"]');
  assert.equal(first.getAttribute('role'), 'button');
  assert.equal(first.tabIndex, 0);
  first.focus();
  const enter = key(win, first, 'Enter');
  assert.equal(enter.defaultPrevented, true);
  assert.equal(win.__SPX.getState().activeId, 1);
  first = doc.querySelector('#spx-points [data-point-id="1"]');
  assert.equal(doc.activeElement, first, 'focus follows the rerendered point');

  let second = doc.querySelector(`#spx-points [data-point-id="${secondId}"]`);
  second.focus();
  const space = key(win, second, ' ');
  assert.equal(space.defaultPrevented, true, 'Space does not scroll the page');
  assert.equal(win.__SPX.getState().activeId, secondId);
  second = doc.querySelector(`#spx-points [data-point-id="${secondId}"]`);
  assert.equal(doc.activeElement, second);
});

test('equilibrium point buttons have a visible focus treatment', () => {
  const css = fs.readFileSync(path.join(ROOT, 'tools', 'steel-phase-explorer.css'), 'utf8');
  assert.match(css, /#spx-points \[role="button"\]:focus-visible \.spx-marker\{[^}]*stroke:/);
  assert.match(css, /#spx-points \[role="button"\]:focus-visible \.spx-marker-hit\{/);
});

test('equilibrium boundaries open a keyboard-operable guide and transfer focus', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.switchTab('equilibrium');

  const boundary = doc.querySelector('#spx-boundaries [data-boundary="A3"]');
  assert.equal(boundary.getAttribute('role'), 'button');
  assert.equal(boundary.tabIndex, 0);
  boundary.focus();
  const space = key(win, boundary, ' ');

  const control = doc.querySelector('[data-boundary-guide="A3"]');
  assert.equal(space.defaultPrevented, true, 'Space does not scroll the page');
  assert.equal(win.__SPX.getState().tab, 'learn');
  assert.equal(doc.activeElement, control, 'focus moves out of the newly hidden diagram');
  assert.equal(control.getAttribute('aria-pressed'), 'true');
  assert.match(doc.getElementById('spx-boundary-guide').textContent, /A₃|upper critical/i);

  const solvus = doc.querySelector('[data-boundary-guide="solvus"]');
  solvus.click();
  assert.equal(solvus.getAttribute('aria-pressed'), 'true');
  assert.equal(control.getAttribute('aria-pressed'), 'false');
  assert.match(doc.getElementById('spx-boundary-guide').textContent, /solvus/i);
});

test('equilibrium boundaries and guide controls have explicit focus treatments', () => {
  const css = fs.readFileSync(path.join(ROOT, 'tools', 'steel-phase-explorer.css'), 'utf8');
  assert.match(css, /\.spx-boundary-hit:focus-visible\{[^}]*stroke:/);
  assert.match(css, /\.spx-boundary-controls button:focus-visible\{[^}]*outline:/);
});

test('bitmap charts are named images inside keyboard-scrollable mobile viewports', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const ids = [
    'spx-section-canvas', 'spx-aust-window-canvas', 'spx-grain-canvas',
    'spx-quench-section-canvas', 'spx-r4-meta-canvas', 'spx-r4-solid-canvas'
  ];
  ids.forEach(id => {
    const canvas = doc.getElementById(id);
    assert.equal(canvas.getAttribute('role'), 'img', `${id} exposes image semantics`);
    assert.ok(canvas.getAttribute('aria-label'), `${id} has a name`);
    const viewport = canvas.parentElement;
    assert.equal(viewport.getAttribute('role'), 'region', `${id} scroll viewport is a region`);
    assert.equal(viewport.tabIndex, 0, `${id} scroll viewport is keyboard reachable`);
    assert.ok(viewport.getAttribute('aria-label'), `${id} scroll viewport has a name`);
  });

  const r2 = fs.readFileSync(path.join(ROOT, 'tools', 'steel-phase-explorer-release2.css'), 'utf8');
  const r4 = fs.readFileSync(path.join(ROOT, 'tools', 'steel-phase-explorer-release4.css'), 'utf8');
  assert.match(r2, /@media\(max-width:520px\)[^{]*\{[^}]*#spx-aust-window-canvas\{width:760px/);
  assert.match(r2, /#spx-section-canvas[^{}]*\{width:520px/);
  assert.match(r4, /@media\(max-width:520px\)[^{]*\{[^}]*\.spx-r4-canvas-scroll>\.spx-r4-canvas\{width:780px/);
});

test('wide SVG charts use named keyboard-scrollable mobile viewports', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const ids = [
    'spx-diagram', 'spx-cycle-svg', 'spx-kinetics-svg', 'spx-jominy-svg',
    'spx-quench-svg', 'spx-r3-temp-svg', 'spx-r3-rate-svg', 'spx-r4-diff-svg',
    'spx-r4-temper-svg', 'spx-r4-mech-svg', 'spx-r5-svg'
  ];
  const labels = new Set();
  ids.forEach(id => {
    const svg = doc.getElementById(id);
    const viewport = svg.parentElement;
    assert.ok(viewport.classList.contains('spx-svg-wrap'), `${id} uses the shared chart viewport`);
    assert.equal(viewport.getAttribute('role'), 'region', `${id} scroll viewport is a region`);
    assert.equal(viewport.tabIndex, 0, `${id} scroll viewport is keyboard reachable`);
    const label = viewport.getAttribute('aria-label');
    assert.match(label || '', /^Scrollable .+/i, `${id} scroll viewport has a concise name`);
    assert.equal(labels.has(label), false, `${id} scroll viewport name is unique`);
    labels.add(label);
  });

  const css = fs.readFileSync(path.join(ROOT, 'tools', 'steel-phase-explorer.css'), 'utf8');
  assert.match(css, /\.spx-svg-wrap:focus-visible\{[^}]*outline:/,
    'keyboard-focused chart viewports expose a visible focus indicator');
  assert.match(css, /@media\(max-width:520px\)\{\.spx-svg-wrap:not\(\.spx-r5-wrap\)\{[^}]*overflow-x:auto/,
    'mobile SVG viewports retain horizontal scrolling');
});

test('Release 2 help dialog traps focus, closes on Escape, and restores its opener', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.switchTab('hardenability');
  const opener = doc.querySelector('[data-r2-help="hardenability"]');
  opener.focus();
  opener.click();

  const overlay = doc.getElementById('spx-r2-help-dialog');
  const dialog = overlay.querySelector('[role="dialog"]');
  const close = doc.getElementById('spx-r2-help-close');
  assert.equal(overlay.hidden, false);
  assert.equal(dialog.getAttribute('aria-modal'), 'true');
  assert.equal(dialog.getAttribute('aria-labelledby'), 'spx-r2-help-title');
  assert.equal(doc.activeElement, close, 'focus moves into the dialog');

  const link = doc.createElement('a');
  link.href = '#dialog-test';
  link.textContent = 'More detail';
  dialog.insertBefore(link, dialog.querySelector('.spx-r2-help-actions'));
  close.focus();
  const forward = key(win, close, 'Tab');
  assert.equal(forward.defaultPrevented, true);
  assert.equal(doc.activeElement, link, 'Tab wraps from the last to the first control');
  const backward = key(win, link, 'Tab', { shiftKey: true });
  assert.equal(backward.defaultPrevented, true);
  assert.equal(doc.activeElement, close, 'Shift+Tab wraps from first to last');

  key(win, close, 'Escape');
  assert.equal(overlay.hidden, true);
  assert.equal(doc.activeElement, opener, 'focus returns to the launch button');
});

test('Release 4 help dialog has labelled modal keyboard behaviour and focus restore', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.switchTab('metallurgy-lab');
  const opener = doc.querySelector('[data-r4-help="surface"]');
  opener.focus();
  opener.click();

  const overlay = doc.getElementById('spx-r4-help');
  const dialog = overlay.querySelector('[role="dialog"]');
  const close = doc.getElementById('spx-r4-help-close');
  assert.equal(overlay.hidden, false);
  assert.equal(dialog.getAttribute('aria-modal'), 'true');
  assert.equal(dialog.getAttribute('aria-labelledby'), 'spx-r4-help-title');
  assert.equal(doc.activeElement, close);
  const trapped = key(win, close, 'Tab');
  assert.equal(trapped.defaultPrevented, true, 'the sole control remains trapped');
  assert.equal(doc.activeElement, close);

  key(win, close, 'Escape');
  assert.equal(overlay.hidden, true);
  assert.equal(doc.activeElement, opener);
});

'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { bootTool, ready, ROOT } = require('./helpers/steel-phase-harness.js');

const read = name => fs.readFileSync(path.join(ROOT, 'tools', name), 'utf8');

function rgb(hex) {
  let value = String(hex).trim().replace(/^#/, '');
  if (value.length === 3) value = value.split('').map(x => x + x).join('');
  assert.match(value, /^[0-9a-f]{6}$/i, `expected a six-digit hex colour, got ${hex}`);
  return [0, 2, 4].map(i => Number.parseInt(value.slice(i, i + 2), 16) / 255);
}

function luminance(hex) {
  const channel = value => value <= .04045
    ? value / 12.92
    : Math.pow((value + .055) / 1.055, 2.4);
  const [r, g, b] = rgb(hex).map(channel);
  return .2126 * r + .7152 * g + .0722 * b;
}

function contrast(a, b) {
  const one = luminance(a), two = luminance(b);
  return (Math.max(one, two) + .05) / (Math.min(one, two) + .05);
}

test('light and dark theme contrast tokens meet their intended thresholds', async t => {
  const { win, doc } = bootTool();
  t.after(() => win.close());
  await ready(win);

  doc.documentElement.dataset.theme = 'light';
  let page = win.getComputedStyle(doc.documentElement);
  let tool = win.getComputedStyle(doc.getElementById('spx-tool'));
  assert.ok(contrast(page.getPropertyValue('--teal'), tool.getPropertyValue('--spx-on-accent')) >= 4.5,
    'light primary-control text meets WCAG AA');
  assert.ok(contrast(page.getPropertyValue('--paper'), tool.getPropertyValue('--spx-martensite')) >= 3,
    'light martensite strokes meet non-text contrast');
  assert.ok(contrast(page.getPropertyValue('--paper'), page.getPropertyValue('--muted')) >= 4.5,
    'light canvas annotations meet text contrast');

  doc.documentElement.dataset.theme = 'dark';
  page = win.getComputedStyle(doc.documentElement);
  tool = win.getComputedStyle(doc.getElementById('spx-tool'));
  const darkAccent = page.getPropertyValue('--teal');
  const onAccent = tool.getPropertyValue('--spx-on-accent');
  assert.ok(contrast(darkAccent, onAccent) >= 4.5,
    'dark primary-control text meets WCAG AA');
  assert.ok(contrast(page.getPropertyValue('--paper'), tool.getPropertyValue('--spx-martensite')) >= 3,
    'dark martensite strokes meet non-text contrast');
  assert.ok(contrast(page.getPropertyValue('--paper'), page.getPropertyValue('--muted')) >= 4.5,
    'dark canvas annotations meet text contrast');
  assert.ok(contrast(darkAccent, '#fff') < 4.5,
    'regression fixture confirms white is not safe on the current dark accent');
});

test('every explorer control that fills with the accent uses the on-accent token', () => {
  const files = [
    'steel-phase-explorer.css',
    'steel-phase-explorer-release1.css',
    'steel-phase-explorer-release4.css',
    'steel-phase-explorer-release5.css',
    'steel-phase-explorer.html'
  ];
  const source = files.map(read).join('\n');
  assert.doesNotMatch(source, /background:var\(--spx-accent\);color:#fff/i);
  assert.match(read('steel-phase-explorer.css'), /\.spx-btn\.primary\{[^}]*color:var\(--spx-on-accent\)/);
  assert.match(read('steel-phase-explorer.css'), /\.spx-segmented button\[aria-pressed="true"\]\{[^}]*color:var\(--spx-on-accent\)/);
  assert.match(read('steel-phase-explorer-release4.css'), /\.spx-r4-chart-switch button\[aria-pressed="true"\]\{[^}]*color:var\(--spx-on-accent\)/);
  assert.match(read('steel-phase-explorer-release4.css'), /\.spx-r4-alloy-tabs button\[aria-pressed="true"\]\{[^}]*color:var\(--spx-on-accent\)/);
  assert.match(read('steel-phase-explorer-release5.css'), /\.spx-r5-point-select\[aria-pressed="true"\]\{[^}]*color:var\(--spx-on-accent\)/);
  assert.match(read('steel-phase-explorer.css'), /@media print\{[^}]*--muted:#475467;[^}]*--spx-accent:#0e7490;[^}]*--spx-on-accent:#fff/,
    'dark-mode print output restores matching light annotation and accent colours');
});

test('Ms lines and martensite canvases use the theme-aware martensite token', () => {
  const analysis = read('steel-phase-explorer-analysis.js');
  const release2 = read('steel-phase-explorer-release2.js');
  const equilibrium = read('steel-phase-explorer-equilibrium.js');
  assert.doesNotMatch(analysis, /stroke:['"]#364152/i);
  assert.doesNotMatch(release2, /stroke:['"]#364152/i);
  assert.match(analysis, /data-kin':['"]Martensite start['"][^}]*|stroke:['"]var\(--spx-martensite\)['"]/);
  assert.match(release2, /stroke:['"]var\(--spx-martensite\)['"]/);
  assert.match(equilibrium, /getPropertyValue\(['"]--spx-martensite['"]\)/);
  assert.match(equilibrium, /phase==='Martensite'\)\{ctx\.strokeStyle=martensite/);
  assert.doesNotMatch(equilibrium, /phase==='Martensite'\)\{ctx\.strokeStyle=PHASE_COLORS\.Martensite/);
});

test('austenitization selection marker takes theme ink and adds a background halo', () => {
  const source = read('steel-phase-explorer-release2.js');
  assert.doesNotMatch(source, /ctx\.strokeStyle=['"]#101828/i);
  assert.match(source, /function canvasTheme\(\)\{[^}]*getPropertyValue\(['"]--paper['"]\)[^}]*getPropertyValue\(['"]--ink['"]\)[^}]*getPropertyValue\(['"]--muted['"]\)/);
  assert.match(source, /marker=theme\.ink,halo=theme\.bg/);
  assert.match(source, /ctx\.strokeStyle=halo;ctx\.lineWidth=7;/);
  assert.match(source, /ctx\.strokeStyle=marker;ctx\.lineWidth=3;/);
  assert.doesNotMatch(source, /ctx\.fillStyle=['"]#667085['"]/,
    'canvas annotation text follows the light/dark muted-text token');
});

test('canvas fallback messages resolve concrete page theme colours', () => {
  const release4 = read('steel-phase-explorer-release4.js');
  assert.doesNotMatch(release4, /getPropertyValue\(['"]--spx-(?:bg|text)['"]\)/,
    'fallback rendering should read the inherited page theme instead of falling back to light-only colours');
  assert.match(release4, /function unavailableGraphic\([^]*?getPropertyValue\(['"]--paper['"]\)[^]*?getPropertyValue\(['"]--ink['"]\)/);
});

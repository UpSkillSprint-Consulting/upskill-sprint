'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const tools = path.join(__dirname, '..', 'tools');
const css = fs.readFileSync(path.join(tools, 'steel-phase-explorer.css'), 'utf8');
const equilibrium = fs.readFileSync(path.join(tools, 'steel-phase-explorer-equilibrium.js'), 'utf8');

test('two-column modules allow intrinsic-width children to shrink', () => {
  assert.match(css, /\.spx-grid-2>\*,\.spx-side-stack>\*\{min-width:0\}/);
});

test('dark-mode active controls use a readable foreground token', () => {
  assert.match(css, /html\[data-theme="dark"\] #spx-tool\{[^}]*--spx-on-accent:#07131d/);
  assert.match(css, /button\[aria-pressed="true"\]\{color:var\(--spx-on-accent\)\}/);
});

test('narrow phones collapse dense field and slider grids', () => {
  assert.match(css, /@media\(max-width:420px\)\{\.spx-fields,\.spx-chem-grid,\.spx-export-grid\{grid-template-columns:1fr\}/);
  assert.match(css, /\.spx-slider-row\{grid-template-columns:1fr\}/);
});

test('wide navigation and tables retain a visible scroll affordance', () => {
  assert.match(css, /\.spx-tabs,\.spx-table-wrap\{scrollbar-width:thin/);
});

test('gold austenite fraction labels use dark text', () => {
  assert.match(equilibrium, /k==='Austenite'\|\|k==='Retained austenite'/);
  assert.match(equilibrium, /ink=.*'#16120a'/);
});

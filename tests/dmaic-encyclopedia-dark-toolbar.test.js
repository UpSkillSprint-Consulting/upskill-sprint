'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(ROOT, 'dmaic-encyclopedia-fixes.css'), 'utf8');

function has(selectorFragment, declarations) {
  const start = css.indexOf(selectorFragment);
  assert.notEqual(start, -1, `missing selector: ${selectorFragment}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  assert.ok(open > start && close > open, `malformed rule for: ${selectorFragment}`);
  const rule = css.slice(open + 1, close);
  for (const declaration of declarations) {
    assert.ok(rule.includes(declaration), `missing ${declaration} in ${selectorFragment}`);
  }
}

test('DMAIC dark toolbar form controls force readable foreground and background', () => {
  has('html[data-theme="dark"] [data-dmaic-encyclopedia] .toolbar input,', [
    'background: var(--panel) !important;',
    'color: var(--text) !important;',
    '-webkit-text-fill-color: var(--text) !important;',
    'border-color: var(--border) !important;',
    'color-scheme: dark;'
  ]);
  has('html[data-theme="dark"] [data-dmaic-encyclopedia] .toolbar input::placeholder', [
    'color: var(--muted) !important;',
    '-webkit-text-fill-color: var(--muted) !important;'
  ]);
});

test('DMAIC dark toolbar secondary buttons cannot inherit black text', () => {
  has('html[data-theme="dark"] [data-dmaic-encyclopedia] .toolbar .btn:not(.primary),', [
    'background: var(--panel-2) !important;',
    'color: var(--text) !important;',
    '-webkit-text-fill-color: var(--text) !important;',
    'border-color: var(--border) !important;',
    'opacity: 1 !important;'
  ]);
  has('html[data-theme="dark"] [data-dmaic-encyclopedia] .toolbar .btn.primary', [
    'color: #fff !important;',
    '-webkit-text-fill-color: #fff !important;'
  ]);
});

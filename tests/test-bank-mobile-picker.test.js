'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const edge = fs.readFileSync(path.join(ROOT, 'netlify/edge-functions/test-bank-mobile-picker.js'), 'utf8');
const netlify = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
const page = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');

// Regression coverage for the mobile-only certification selector.
test('registers the mobile picker for pretty and explicit test-bank URLs', () => {
  assert.match(netlify, /path\s*=\s*"\/test-bank"[\s\S]*?function\s*=\s*"test-bank-mobile-picker"/);
  assert.match(netlify, /path\s*=\s*"\/test-bank\.html"[\s\S]*?function\s*=\s*"test-bank-mobile-picker"/);
});

test('the production transform uses the current memory runtime and strips retired persistence scripts', async () => {
  const handler = new Function(edge.replace('export default async function handler', 'return async function handler'))();
  const input = '<html><head><script src="/test-bank-question-registry.js"></script></head><body><script src="/test-bank-learning-events.js"></script></body></html>';
  const response = await handler(null, { next: async () => new Response(input, { headers: { 'content-type': 'text/html' } }) });
  const html = await response.text();
  assert.ok(html.includes('src="/test-bank-memory-learning.js"'));
  assert.ok(html.includes('tb-mobile-certification-picker-script'));
  assert.ok(html.includes('src="/test-bank-current-attempt-review.js"'));
  assert.ok(!html.includes('/test-bank-question-registry.js'));
  assert.ok(!html.includes('/test-bank-learning-events.js'));
});

test('keeps the desktop certification rail unchanged and activates the picker only on mobile', () => {
  assert.match(edge, /\.tb-mobile-cert-picker\{display:none\}/);
  assert.match(edge, /@media \(max-width:860px\)/);
  assert.match(edge, /\.tb-groups\{display:none!important\}/);
  assert.doesNotMatch(edge, /@media\s*\(min-width:/);
});

test('builds the dropdown from the existing certification tiles', () => {
  assert.match(edge, /querySelectorAll\('\.tb-tile\[data-exam\]'\)/);
  assert.match(edge, /option\.value=tile\.dataset\.exam/);
  assert.match(edge, /Choose a certification exam/);
});

test('routes mobile selection through the existing certification click logic', () => {
  assert.match(edge, /select\.addEventListener\('change'/);
  assert.match(edge, /if\(tile\)\s*tile\.click\(\)/);
});

test('keeps the mobile dropdown synchronized when the certification rail rerenders', () => {
  assert.match(edge, /new MutationObserver\(sync\)/);
  assert.match(edge, /\.tb-tile\.active\[data-exam\]/);
  assert.match(edge, /select\.value=active\.dataset\.exam/);
});

test('constrains key mobile containers to the viewport to prevent horizontal page overflow', () => {
  assert.match(edge, /\.tb-shell,\.tb-main,\.tb-rail,\.tb-pane\{min-width:0;max-width:100%\}/);
  assert.match(edge, /select\{display:block;width:100%;max-width:100%;min-height:48px;box-sizing:border-box/);
  assert.match(page, /\.tb-shell\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(page, /\.tb-tile\{width:auto;flex:0 0 auto/);
  assert.match(page, /\.tb-diag-cta>\*\{max-width:100%;white-space:normal\}/);
});

const { JSDOM } = require('jsdom');
function pickerApp(ids) {
  const dom = new JSDOM('<aside class="tb-rail"><div id="tb-groups">' + ids.map((id, i) =>
    '<button class="tb-tile' + (i ? '' : ' active') + '" data-exam="' + id + '"><span class="tb-tn">' + id + '</span></button>'
  ).join('') + '</div></aside>', { runScripts: 'outside-only' });
  dom.window.eval(edge.match(/<script id="tb-mobile-certification-picker-script">([\s\S]*?)<\/script>/)[1]);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
}
test('a focused mobile view keeps its single wrapping tile without a cross-exam selector', () => {
  const dom = pickerApp(['mbb']);
  try {
    assert.equal(dom.window.document.querySelector('#tb-mobile-cert-select'), null);
    assert.ok(dom.window.document.querySelector('.tb-rail').classList.contains('tb-focused-certification'));
    assert.equal(dom.window.document.querySelectorAll('.tb-tile').length, 1);
  } finally { dom.window.close(); }
});
test('legacy multi-exam picker activates its selected tile and follows later selection changes', async () => {
  const dom = pickerApp(['cssbb', 'cqe']);
  try {
    const w = dom.window, select = w.document.querySelector('select');
    assert.equal(select.options.length, 2);
    let clicked;
    w.document.querySelectorAll('.tb-tile').forEach(tile => tile.addEventListener('click', () => { clicked = tile.dataset.exam; }));
    select.value = 'cqe'; select.dispatchEvent(new w.Event('change'));
    assert.equal(clicked, 'cqe');
    w.document.querySelector('[data-exam="cssbb"]').classList.remove('active');
    w.document.querySelector('[data-exam="cqe"]').classList.add('active');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(select.value, 'cqe');
  } finally { dom.window.close(); }
});

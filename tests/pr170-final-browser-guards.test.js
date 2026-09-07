'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const source = fs.readFileSync(path.join(__dirname, '..', 'test-bank-mbb-set3-batch6-ui.js'), 'utf8');
function fixture(t) {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div class="mbbs3b6-scroll" tabindex="0"><input></div><button>Other control</button></body></html>', { runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const w = dom.window, region = w.document.querySelector('.mbbs3b6-scroll');
  Object.defineProperties(region, { scrollWidth: { value: 660, configurable: true }, clientWidth: { value: 260, configurable: true } });
  w.eval(source);
  region.focus();
  const press = (key, target = region, extras = {}) => {
    const event = new w.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extras });
    target.dispatchEvent(event);
    return event;
  };
  return { w, region, press };
}
test('Batch 6 focused evidence supports horizontal arrows and both boundaries without delays', t => {
  const { region, press } = fixture(t);
  assert.equal(press('ArrowRight').defaultPrevented, true);
  assert.equal(region.scrollLeft, 48);
  press('ArrowRight'); assert.equal(region.scrollLeft, 96);
  press('ArrowLeft'); assert.equal(region.scrollLeft, 48);
  press('End'); assert.equal(region.scrollLeft, 400);
  press('ArrowRight'); assert.equal(region.scrollLeft, 400);
  press('Home'); assert.equal(region.scrollLeft, 0);
  press('ArrowLeft'); assert.equal(region.scrollLeft, 0);
});
test('Batch 6 scrolling does not take keys from nested inputs or unrelated controls', t => {
  const { w, region, press } = fixture(t);
  const input = region.querySelector('input'); input.focus();
  assert.equal(press('ArrowRight', input).defaultPrevented, false);
  assert.equal(region.scrollLeft, 0);
  const other = w.document.querySelector('button'); other.focus();
  assert.equal(press('Home', other).defaultPrevented, false);
  assert.equal(press('End', region).defaultPrevented, false);
});
test('Batch 6 leaves vertical, modified and already handled key events unchanged', t => {
  const { region, press, w } = fixture(t);
  for (const key of ['ArrowDown', 'ArrowUp', 'Tab', 'PageDown', ' ']) assert.equal(press(key).defaultPrevented, false);
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) assert.equal(press('ArrowRight', region, { [modifier]: true }).defaultPrevented, false);
  const handled = new w.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
  handled.preventDefault(); region.dispatchEvent(handled); assert.equal(region.scrollLeft, 0);
});
test('Batch 6 leaves non-overflowing regions unchanged', t => {
  const { region, press } = fixture(t);
  Object.defineProperty(region, 'scrollWidth', { value: 260 });
  assert.equal(press('End').defaultPrevented, false);
  assert.equal(region.scrollLeft, 0);
});
test('DMAIC print rules stop theme transitions only within print media', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'dmaic-encyclopedia-fixes.css'), 'utf8');
  const print = css.slice(css.indexOf('@media print {'));
  assert.match(print, /body\.dmaic-encyclopedia-page \*::after\s*\{\s*transition:\s*none\s*!important;\s*animation:\s*none\s*!important;/);
  assert.match(print, /background:\s*#fff\s*!important/);
  assert.match(print, /color:\s*#000\s*!important/);
});
test('exam back navigation changes its surface and foreground atomically', () => {
  const qa = fs.readFileSync(path.join(__dirname, '..', 'test-bank-phase2-quality-assurance.js'), 'utf8');
  assert.match(qa, /\.tb-quiz \.tb-backsim\{background:var\(--tint\)!important;color:var\(--ink\)!important;transition:none!important\}/);
});

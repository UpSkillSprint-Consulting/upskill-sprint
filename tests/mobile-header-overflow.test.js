'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');

// These guard the site-wide mobile fix: the shared header could overflow on
// narrow phones because .brand and .header-actions were both flex-shrink:0,
// giving every page a horizontal scroll. See fix/mobile-header-overflow.

test('html has a sticky-safe horizontal-overflow guard', () => {
  assert.match(css, /html\s*\{\s*overflow-x:\s*clip\s*;?\s*\}/, 'overflow-x: clip on html');
});

test('.brand can shrink instead of forcing the header wider than the viewport', () => {
  const rule = css.match(/\.brand\s*\{[^}]*\}/);
  assert.ok(rule, '.brand rule exists');
  assert.doesNotMatch(rule[0], /flex-shrink:\s*0/, '.brand must not be flex-shrink:0');
  assert.match(rule[0], /min-width:\s*0/, '.brand allows shrinking below content width');
});

test('.brand span truncates rather than forcing width', () => {
  const rule = css.match(/\.brand span\s*\{[^}]*\}/);
  assert.ok(rule, '.brand span rule exists');
  assert.match(rule[0], /text-overflow:\s*ellipsis/);
  assert.match(rule[0], /overflow:\s*hidden/);
});

test('brand text collapses to the logo on phones so the header always fits', () => {
  // the display:none breakpoint for .brand span must cover typical phones (>=430px wide)
  const m = css.match(/@media \(max-width:\s*(\d+)px\)\s*\{\s*\.brand span\s*\{\s*display:\s*none/);
  assert.ok(m, 'a breakpoint hides the brand text');
  assert.ok(Number(m[1]) >= 500, 'breakpoint is wide enough to cover phones (>=500px), was ' + m[1]);
});

// The header-actions cluster (theme toggle + account + hamburger) must stay
// intact so the menu button is never clipped off-screen.
test('.header-actions stays non-shrinking so the hamburger is never clipped', () => {
  const rule = css.match(/\.header-actions\s*\{[^}]*\}/);
  assert.ok(rule, '.header-actions rule exists');
  assert.match(rule[0], /flex-shrink:\s*0/);
});

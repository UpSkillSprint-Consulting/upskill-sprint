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

test('the bound production edge route loads stable identity and durable-learning modules before their consumers', () => {
  const registry = edge.indexOf("'/test-bank-question-registry.js'");
  const events = edge.indexOf("'/test-bank-learning-events.js'");
  const mastery = edge.indexOf("'/test-bank-adaptive-mastery.js'");
  const hardening = edge.indexOf("'/test-bank-adaptive-mastery-hardening.js'");
  const analytics = edge.indexOf("'/test-bank-analytics-dashboard.js'");
  assert.ok(registry > -1 && events > -1 && mastery > -1 && hardening > -1 && analytics > -1);
  assert.ok(registry < mastery, 'question IDs are available before mastery reads or writes progress');
  assert.ok(events < hardening, 'session events are available before readiness and New-only consumers');
  assert.ok(hardening < analytics, 'analytics loads after its readiness engine');
  assert.equal(edge.indexOf("'/test-bank-question-registry.js'", registry + 1), -1);
  assert.equal(edge.indexOf("'/test-bank-learning-events.js'", events + 1), -1);
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
  assert.match(edge, /if\(tile\) tile\.click\(\)/);
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

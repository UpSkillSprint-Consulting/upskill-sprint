'use strict';

// Mobile-web guards for the Introduction to Analytics lesson.
//
// This lesson is a self-contained page: its styling lives in an inline <style>
// block (plus the shared site stylesheets), and its diagrams are inline SVGs.
// These tests pin the properties that keep it usable on phones so a future edit
// can't silently regress them.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const HTML = fs.readFileSync(
  path.join(__dirname, '..', 'lessons', 'data-analytics', 'introduction-to-analytics.html'),
  'utf8'
);
const STYLE = (HTML.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1];

test('viewport meta enables mobile scaling', () => {
  const meta = (HTML.match(/<meta\b[^>]*>/gi) || []).find((t) => /name="viewport"/i.test(t));
  assert.ok(meta, 'a viewport meta tag exists');
  assert.match(meta, /width=device-width/i, 'viewport uses width=device-width');
});

test('images and SVGs are constrained to their container width', () => {
  assert.match(
    STYLE,
    /(?:img|svg)[^{}]*\{[^}]*max-width:\s*100%/,
    'an img/svg rule caps width at 100% so nothing overflows the viewport'
  );
});

test('wide data tables can scroll horizontally on phones', () => {
  assert.match(STYLE, /\.responsive-table[^{]*\{[^}]*overflow-x:\s*auto/);
});

test('every inline diagram SVG has a viewBox so it scales fluidly', () => {
  const svgs = HTML.match(/<svg\b[^>]*>/gi) || [];
  assert.ok(svgs.length > 0, 'the lesson has inline SVG diagrams');
  const missing = svgs.filter((s) => !/viewbox=/i.test(s));
  assert.equal(missing.length, 0, `${missing.length} inline SVG(s) lack a viewBox and will not scale`);
});

test('a phone-width breakpoint exists (<= 480px)', () => {
  const bps = [...STYLE.matchAll(/@media\s*\(max-width:\s*(\d+)px\)/g)].map((m) => Number(m[1]));
  assert.ok(bps.some((w) => w <= 480), `expected a <=480px breakpoint, saw ${bps.join(', ') || 'none'}`);
});

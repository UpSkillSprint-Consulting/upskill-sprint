'use strict';

// Mobile-web guards for the Introduction to Analytics lesson.
//
// The lesson's global rule is `table { min-width: 620px }`, so on phones every
// table MUST live inside a wrapper that scrolls horizontally, or its rightmost
// columns get clipped by the `body { overflow-x: hidden }` safety net and become
// unreachable. One table shipped inside `.symbols-table`, a class defined in no
// stylesheet — so it had no scroll and lost a column on narrow screens. These
// tests would have caught that.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const LESSON = fs.readFileSync(
  path.join(ROOT, 'lessons', 'data-analytics', 'introduction-to-analytics.html'),
  'utf8'
);
const CSS = fs.readFileSync(
  path.join(ROOT, 'assets', 'lessons', 'introduction-to-analytics', 'lesson.css'),
  'utf8'
);

// Classes whose CSS rule genuinely provides horizontal scroll. Derived from the
// stylesheet, not hardcoded: a class only qualifies if its own rule sets
// overflow-x:auto (or scroll). An undefined class contributes nothing.
function scrollableWrapperClasses() {
  const classes = new Set();
  const ruleRe = /([^{}]+)\{([^}]*)\}/g;
  let m;
  while ((m = ruleRe.exec(CSS)) !== null) {
    const selector = m[1];
    const body = m[2];
    if (/overflow-x:\s*(auto|scroll)/.test(body)) {
      for (const cls of selector.match(/\.[A-Za-z0-9_-]+/g) || []) {
        classes.add(cls.slice(1));
      }
    }
  }
  return classes;
}

// The wrapper is the <div class="..."> immediately preceding each <table> in the
// serialized (one-tag-per-line) markup.
function tableWrappers() {
  const lines = LESSON.split('\n');
  const wrappers = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/<table[\s>]/.test(lines[i])) continue;
    let j = i - 1;
    while (j >= 0 && lines[j].trim() === '') j--;
    const prev = j >= 0 ? lines[j] : '';
    const cls = (prev.match(/class="([^"]*)"/) || [, ''])[1].split(/\s+/).filter(Boolean);
    wrappers.push({ line: i + 1, wrapperClasses: cls });
  }
  return wrappers;
}

test('viewport meta enables mobile scaling', () => {
  const metas = LESSON.match(/<meta\b[^>]*>/gi) || [];
  const viewport = metas.find((t) => /name="viewport"/i.test(t));
  assert.ok(viewport, 'a viewport meta tag exists');
  assert.match(viewport, /width=device-width/i, 'viewport uses width=device-width');
});

test('the stylesheet defines at least one horizontal-scroll table wrapper', () => {
  const scrollable = scrollableWrapperClasses();
  assert.ok(scrollable.has('responsive-table'), '.responsive-table scrolls horizontally');
  assert.ok(scrollable.size >= 1);
});

test('global table rule sets a min-width (so wrappers are actually required)', () => {
  assert.match(CSS, /(^|[^-])table\s*\{[^}]*min-width:\s*\d+px/);
});

test('every table sits in a wrapper that scrolls horizontally on mobile', () => {
  const scrollable = scrollableWrapperClasses();
  const wrappers = tableWrappers();
  assert.ok(wrappers.length >= 6, `expected the lesson's tables, found ${wrappers.length}`);
  for (const w of wrappers) {
    const ok = w.wrapperClasses.some((c) => scrollable.has(c));
    assert.ok(
      ok,
      `table at line ${w.line} is wrapped in [${w.wrapperClasses.join(' ') || '(none)'}], ` +
        `none of which provides overflow-x scroll — its right columns will be clipped on phones`
    );
  }
});

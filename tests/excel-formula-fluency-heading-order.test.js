'use strict';

// Weekly audit 2026-11-09: the Workbook Inspector and Portfolio panel heads were
// <h4> directly inside an <h2> section, so whenever the surrounding <h3>s are
// hidden (the drop zone is swapped out once a workbook loads, and the card
// header can scroll out of the rendered tree) the outline jumps h2 → h4.
// They now use <h3 class="was-h4">, the pattern this page already uses for the
// capstone cards; CSS keeps the h4 look.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const FILE = path.join(__dirname, '..', 'lessons', 'power-bi-excel-sql', 'excel-formula-fluency.html');
const html = fs.readFileSync(FILE, 'utf8');
const doc = new JSDOM(html).window.document;
const PANEL_HEADS = ['Grading rubric', 'Priority findings', 'Visible evidence'];
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const level = (h) => Number(h.tagName[1]);
const headingNamed = (name) => [...doc.querySelectorAll(HEADINGS)].filter((h) => h.textContent.trim() === name);

test('the Workbook Inspector and Portfolio panel heads are h3.was-h4', () => {
  for (const name of PANEL_HEADS) {
    const found = headingNamed(name);
    assert.equal(found.length, 1, `${name}: exactly one heading`);
    assert.equal(found[0].tagName, 'H3', `${name} is an h3`);
    assert.ok(found[0].classList.contains('was-h4'), `${name} keeps the h4 look via .was-h4`);
  }
  assert.ok(headingNamed('Grading rubric')[0].closest('.audit-panel-head'));
  assert.ok(headingNamed('Priority findings')[0].closest('.audit-panel-head'));
  assert.ok(headingNamed('Visible evidence')[0].closest('.portfolio-controls'));
});

test('the panel heads sit at most one level below their section h2', () => {
  // Measured against the section's h2 alone, so the result holds whichever of
  // the intermediate h3s (drop zone, card header) happen to be hidden.
  const all = [...doc.querySelectorAll(HEADINGS)];
  for (const name of PANEL_HEADS) {
    const head = headingNamed(name)[0];
    const section = all.slice(0, all.indexOf(head)).reverse().find((h) => level(h) <= 2);
    assert.equal(section.tagName, 'H2', `${name} belongs to an h2 section`);
    assert.ok(level(head) - level(section) <= 1, `${name}: h${level(section)} → h${level(head)} does not skip a level`);
  }
});

test('the full static outline of the page has no skipped heading levels', () => {
  const levels = [...doc.querySelectorAll(HEADINGS)].map(level);
  for (let i = 1; i < levels.length; i++) {
    assert.ok(levels[i] - levels[i - 1] <= 1, `heading ${i + 1} jumps h${levels[i - 1]} → h${levels[i]}`);
  }
});

test('h3.was-h4 panel heads keep the original h4 spacing (no visual change)', () => {
  assert.match(html, /h3\.was-h4 \{ margin:22px 0 8px; font-size:18px; line-height:inherit; font-family:inherit; font-weight:700; \}/);
  // The audit panel head zeroed the old h4 margin; the same rule covers the h3.
  assert.ok(html.includes('.audit-panel-head h4,.audit-panel-head h3.was-h4{margin:0}'));
});

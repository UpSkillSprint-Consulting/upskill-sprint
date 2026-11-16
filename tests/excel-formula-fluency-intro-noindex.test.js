'use strict';

// Weekly audit 2026-11-16: /assets/lessons/excel-formula-fluency/sprint/introduction.html
// (the "Excel building blocks" iframe inside Excel Formula Fluency) was served
// 200 with no noindex, canonical or description, so search engines could index
// it as a thin standalone page. netlify.toml now sends
// X-Robots-Tag: noindex, indexifembedded for the sprint asset folder only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');
const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');

// The [[headers]] blocks of netlify.toml as { for, values }.
function headerRules(source) {
  return source.split(/^\[\[/m).filter((block) => block.startsWith('headers]]')).map((block) => {
    const body = block.split(/^\[\[|^#/m)[0];
    const rule = { for: body.match(/^\s*for\s*=\s*"([^"]+)"/m)[1], values: {} };
    const values = body.split('[headers.values]')[1] || '';
    for (const line of values.split('\n')) {
      const m = line.match(/^\s*([A-Za-z-]+)\s*=\s*"([^"]*)"/);
      if (m) rule.values[m[1]] = m[2];
    }
    return rule;
  });
}

// Netlify header paths: exact match, or a trailing /* splat.
const matches = (pattern, url) => pattern.endsWith('/*')
  ? url.startsWith(pattern.slice(0, -1))
  : url === pattern;
const robotsFor = (url) => headerRules(toml).filter((rule) => matches(rule.for, url))
  .map((rule) => rule.values['X-Robots-Tag']).filter(Boolean);

const INTRO = '/assets/lessons/excel-formula-fluency/sprint/introduction.html';

test('the sprint introduction page gets X-Robots-Tag: noindex, indexifembedded', () => {
  assert.ok(fs.existsSync(path.join(ROOT, INTRO.slice(1))), 'the introduction page still exists');
  for (const url of [INTRO, INTRO.replace(/\.html$/, '')]) {
    assert.deepEqual(robotsFor(url), ['noindex, indexifembedded'], url);
  }
});

test('the rule is scoped to the sprint asset folder, not the lesson or other assets', () => {
  for (const url of [
    '/lessons/power-bi-excel-sql/excel-formula-fluency',
    '/lessons/power-bi-excel-sql/excel-formula-fluency.html',
    '/assets/lessons/excel-formula-fluency/',
    '/assets/lessons/dmaic-formula-encyclopedia/part-1.txt',
    '/'
  ]) assert.deepEqual(robotsFor(url), [], url);
});

test('the existing fragment rules are unchanged', () => {
  assert.deepEqual(robotsFor('/lessons/assets/anything.html'), ['noindex']);
  assert.deepEqual(robotsFor('/test-bank-assets/x.js'), ['noindex']);
  const assetsCache = headerRules(toml).find((rule) => rule.for === '/assets/*');
  assert.equal(assetsCache.values['Cache-Control'], 'public, max-age=3600, must-revalidate');
});

test('the lesson still embeds the introduction and links it in its own window', () => {
  const lesson = fs.readFileSync(path.join(ROOT, 'lessons/power-bi-excel-sql/excel-formula-fluency.html'), 'utf8');
  assert.match(lesson, /<iframe id="excel-introduction-frame"[^>]*src="\/assets\/lessons\/excel-formula-fluency\/sprint\/introduction\.html/);
  assert.ok(lesson.includes(`href="${INTRO}"`));
});

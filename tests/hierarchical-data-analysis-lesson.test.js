'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SLUG = 'hierarchical-data-analysis-steel-charpy';
const REPO_LESSON = path.join(ROOT, 'lessons', 'data-analytics', `${SLUG}.html`);
const LESSON = fs.existsSync(REPO_LESSON)
  ? REPO_LESSON
  : path.join(ROOT, 'upload', `${SLUG}.html`);
const DATASET = path.join(ROOT, 'assets', 'lessons', SLUG, 'hierarchical-charpy-practice.csv');

test('hierarchical data analysis lesson satisfies the site contract', () => {
  const html = fs.readFileSync(LESSON, 'utf8');
  const raw = html.match(/<!-- UPSKILLSPRINT_LESSON_META\n([\s\S]*?)\n-->/);
  assert.ok(raw, 'metadata block exists');
  const meta = JSON.parse(raw[1]);
  assert.equal(meta.slug, SLUG);
  assert.equal(meta.category_slug, 'data-analytics');
  assert.equal(meta.level, 'Advanced');
  assert.equal(meta.lesson_type, 'General');
  assert.equal(meta.suggested_github_path, `lessons/data-analytics/${SLUG}.html`);
  assert.ok(html.includes('<script src="/theme.js"></script>'));
  assert.ok(html.includes('<script src="/site-sections.js"></script>'));
  assert.ok(html.includes('data-lesson-type="general"'));
  assert.equal((html.match(/<fieldset class="quiz-question"/g) || []).length, 5);
  assert.ok(html.includes("new CustomEvent('upskill-quiz-result'"));
  assert.equal((html.match(/<footer class="site">/g) || []).length, 1);
});

test('hierarchical practice dataset and catalog registration are complete', () => {
  const lines = fs.readFileSync(DATASET, 'utf8').trim().split(/\r?\n/);
  assert.equal(lines.length, 487, 'one header plus 486 specimen rows');
  assert.equal(new Set(lines.slice(1).map(line => line.split(',')[0])).size, 36, '36 heats');
  assert.equal(new Set(lines.slice(1).map(line => line.split(',')[1])).size, 162, '162 pipes');

  const catalogPath = path.join(ROOT, 'chi-square-lesson-library.js');
  if (fs.existsSync(catalogPath)) {
    const catalog = fs.readFileSync(catalogPath, 'utf8');
    assert.ok(catalog.includes("marker: 'data-hierarchical-data-analysis-steel-charpy'"));
    assert.ok(catalog.includes("path: '/lessons/data-analytics/hierarchical-data-analysis-steel-charpy'"));
    assert.ok(catalog.includes("marker: 'data-beyond-the-bell'"), 'build insertion point remains intact');
  }
});

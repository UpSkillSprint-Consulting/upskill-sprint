'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const LESSONS_DIR = path.join(ROOT, 'lessons');

const REQUIRED_FIELDS = [
  'title', 'slug', 'category', 'category_slug', 'level',
  'estimated_minutes', 'interactive', 'card_title', 'card_description',
  'search_keywords', 'suggested_github_path'
];
const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

// The nine lessons this PR brings into compliance, with their expected level.
const NEWLY_COVERED = {
  'minitab-best-predictive-regression-model': 'Advanced',
  'statistics/beyond-the-bell-the-normal-distribution-and-its-relatives': 'Intermediate',
  'statistics/chi-square-goodness-of-fit-test': 'Intermediate',
  'anova-plain-english': 'Beginner',
  'power-bi-dashboard-basics': 'Beginner',
  'two-way-anova': 'Advanced',
  'one-way-anova': 'Intermediate',
  'lean-six-sigma/dmaic-formula-encyclopedia': 'Advanced',
  'hypothesis-testing-for-beginners': 'Intermediate'
};

// In-library lessons whose level must agree with the library card.
const IN_LIBRARY = [
  'minitab-best-predictive-regression-model',
  'statistics/beyond-the-bell-the-normal-distribution-and-its-relatives',
  'statistics/chi-square-goodness-of-fit-test'
];

function extractMeta(html) {
  const m = html.match(/<!--\s*UPSKILLSPRINT_LESSON_META\s*\n([\s\S]*?)\n-->/);
  return m ? m[1] : null;
}
function allLessonFiles() {
  const out = [];
  (function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith('.html')) out.push(full);
    });
  })(LESSONS_DIR);
  return out;
}
function slugFor(file) {
  return path.relative(LESSONS_DIR, file).replace(/\\/g, '/').replace(/\.html$/, '');
}

/* ---------- full repo coverage ---------- */

test('every lesson carries a UPSKILLSPRINT_LESSON_META block (full coverage)', () => {
  const missing = allLessonFiles()
    .filter(f => !extractMeta(fs.readFileSync(f, 'utf8')))
    .map(f => path.relative(ROOT, f));
  assert.deepEqual(missing, [], 'no lesson is missing a meta block');
});

test('every meta block is valid JSON with all required fields and a sane level', () => {
  const problems = [];
  allLessonFiles().forEach(file => {
    const rel = slugFor(file);
    const slug = rel.split('/').pop();
    const raw = extractMeta(fs.readFileSync(file, 'utf8'));
    if (!raw) return;
    let meta;
    try { meta = JSON.parse(raw); } catch (e) { problems.push(slug + ': invalid JSON'); return; }
    REQUIRED_FIELDS.forEach(f => {
      if (!Object.prototype.hasOwnProperty.call(meta, f)) problems.push(slug + ': missing ' + f);
    });
    if (meta.slug !== slug) problems.push(slug + ': slug mismatch (' + meta.slug + ')');
    if (meta.suggested_github_path !== 'lessons/' + rel + '.html') problems.push(rel + ': path mismatch');
    if (!VALID_LEVELS.includes(meta.level)) problems.push(slug + ': bad level ' + meta.level);
    if (typeof meta.interactive !== 'boolean') problems.push(slug + ': interactive not boolean');
    if (!Array.isArray(meta.search_keywords) || meta.search_keywords.length < 5) problems.push(slug + ': too few keywords');
    if (!Number.isInteger(meta.estimated_minutes) || meta.estimated_minutes <= 0) problems.push(slug + ': bad minutes');
  });
  assert.deepEqual(problems, [], 'all meta blocks are well-formed');
});

/* ---------- the nine newly covered lessons ---------- */

for (const [rel, level] of Object.entries(NEWLY_COVERED)) {
  test(`${rel} is now covered with the expected level`, () => {
    const html = fs.readFileSync(path.join(LESSONS_DIR, rel + '.html'), 'utf8');
    const raw = extractMeta(html);
    assert.ok(raw, 'has a block');
    const meta = JSON.parse(raw);
    assert.equal(meta.slug, rel.split('/').pop(), 'slug is the filename basename');
    assert.equal(meta.suggested_github_path, 'lessons/' + rel + '.html', 'path is the full relative path');
    assert.equal(meta.level, level);
    assert.equal(meta.card_title, meta.title, 'card_title mirrors title');
    assert.ok(html.includes('<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'), 'placed after <html>');
  });
}

test('in-library lessons agree with the library card level', () => {
  const lib = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
  IN_LIBRARY.forEach(slug => {
    const meta = JSON.parse(extractMeta(fs.readFileSync(path.join(LESSONS_DIR, slug + '.html'), 'utf8')));
    const esc = slug.replace(/[/\-]/g, m => '\\' + m);
    const block = lib.match(new RegExp("\\{[^{}]*?path:\\s*['\"]/lessons/" + esc + "['\"][^{}]*?\\}", 's'));
    assert.ok(block, `library entry for ${slug}`);
    const libLevel = (block[0].match(/level:\s*['"]([^'"]+)/) || [])[1];
    assert.equal(meta.level.toLowerCase(), (libLevel || '').toLowerCase(), `${slug} level agrees with library`);
  });
});

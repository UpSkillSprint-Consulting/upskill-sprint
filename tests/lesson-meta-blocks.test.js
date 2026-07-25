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

// Lessons this PR brings into compliance. These MUST carry a valid block.
const ENFORCED = {
  '7-essential-quality-tools': { level: 'Beginner', estimated_minutes: 30 },
  '7-management-planning-tools': { level: 'Intermediate', estimated_minutes: 35 },
  'complete-14-quality-tools-project': { level: 'Advanced', estimated_minutes: 45 }
};

function readLesson(rel) {
  return fs.readFileSync(path.join(LESSONS_DIR, rel + '.html'), 'utf8');
}

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

/* ---------- the three toolbox lessons are enforced ---------- */

for (const slug of Object.keys(ENFORCED)) {
  test(`${slug} carries a valid UPSKILLSPRINT_LESSON_META block`, () => {
    const html = readLesson(slug);
    const raw = extractMeta(html);
    assert.ok(raw, `${slug} has a meta block`);

    let meta;
    assert.doesNotThrow(() => { meta = JSON.parse(raw); }, `${slug} meta is valid JSON`);

    REQUIRED_FIELDS.forEach(f =>
      assert.ok(Object.prototype.hasOwnProperty.call(meta, f), `${slug} meta has "${f}"`));

    assert.equal(meta.slug, slug, 'slug matches the filename');
    assert.equal(meta.suggested_github_path, `lessons/${slug}.html`, 'github path matches');
    assert.equal(meta.category_slug, 'quality-engineering');
    assert.equal(meta.interactive, true);
    assert.ok(Array.isArray(meta.search_keywords) && meta.search_keywords.length >= 5, 'keywords present');
    assert.equal(meta.level, ENFORCED[slug].level, 'level matches the library card');
    assert.equal(meta.estimated_minutes, ENFORCED[slug].estimated_minutes, 'minutes match the library card');

    // placement: immediately after <html lang="en">
    assert.ok(
      html.includes('<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'),
      `${slug} block sits right after the <html> tag`
    );
  });
}

test('the enforced meta matches the live lesson library card data', () => {
  const lib = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
  for (const slug of Object.keys(ENFORCED)) {
    const meta = JSON.parse(extractMeta(readLesson(slug)));
    // the library registers each lesson at /lessons/<slug>; the level should agree
    const block = lib.match(new RegExp("\\{[^{}]*?path:\\s*['\"]/lessons/" + slug + "['\"][^{}]*?\\}", 's'));
    assert.ok(block, `library has an entry for ${slug}`);
    const libLevel = (block[0].match(/level:\s*['"]([^'"]+)/) || [])[1];
    assert.equal(meta.level.toLowerCase(), (libLevel || '').toLowerCase(), `${slug} level agrees with the library`);
  }
});

/* ---------- correctness guard for ANY block repo-wide ---------- */

test('every lesson that has a meta block has valid JSON with the required fields', () => {
  const offenders = [];
  allLessonFiles().forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const raw = extractMeta(html);
    if (!raw) return; // lessons without a block are out of scope for this PR
    try {
      const meta = JSON.parse(raw);
      const missing = REQUIRED_FIELDS.filter(f => !Object.prototype.hasOwnProperty.call(meta, f));
      if (missing.length) offenders.push(path.relative(ROOT, file) + ' missing: ' + missing.join(','));
    } catch (e) {
      offenders.push(path.relative(ROOT, file) + ' invalid JSON');
    }
  });
  assert.deepEqual(offenders, [], 'all present meta blocks are well-formed');
});

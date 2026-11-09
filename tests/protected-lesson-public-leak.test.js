'use strict';

// Gated lesson bodies under content/protected-lessons/ must never reach the static
// deploy (public-site/) or the public lesson search index. Only the teaser page and
// its data-search-summary are public.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const PROTECTED_DIR = path.join(ROOT, 'content', 'protected-lessons');
const TEXT_FILES = /\.(?:html|js|mjs|json|xml|txt|css|webmanifest)$/i;
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const clean = (s) => s.replace(/\s+/g, ' ').trim();

/** Distinctive passages of every protected fragment: prose, tables, code and script source lines. */
function protectedNeedles() {
  const needles = new Set();
  for (const file of walk(PROTECTED_DIR).filter((f) => f.endsWith('.html'))) {
    const source = fs.readFileSync(file, 'utf8');
    const doc = new JSDOM(`<body>${source}</body>`).window.document;
    for (const el of doc.querySelectorAll('p, li, td, dd, figcaption, summary, legend, label, pre, blockquote')) {
      const t = clean(el.textContent);
      if (t.length >= 40) needles.add(t.slice(0, 120));
    }
    for (const script of doc.querySelectorAll('script')) {
      for (const line of script.textContent.split('\n').map((l) => l.trim()).filter((l) => l.length >= 50 && /[a-z]/i.test(l))) needles.add(line.slice(0, 100));
    }
  }
  return [...needles].filter((needle) => !sharedElsewhere().some((text) => text.includes(needle)));
}

/** Passages that also appear in other committed lessons or pages (e.g. Excel syntax) are not unique to a protected lesson. */
let shared = null;
function sharedElsewhere() {
  if (shared) return shared;
  const skip = new Set(['node_modules', 'content', 'tests', 'docs', 'public-site', '.git', 'scripts', 'netlify', 'supabase']);
  const teasers = new Set(walk(PROTECTED_DIR).map((f) => path.join(ROOT, 'lessons', path.relative(PROTECTED_DIR, f))));
  const files = [];
  const visit = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(e.name) || e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) visit(full);
      else if (/\.(?:html|js)$/i.test(e.name) && !teasers.has(full)) files.push(full);
    }
  };
  visit(ROOT);
  shared = files.map((f) => { const t = fs.readFileSync(f, 'utf8'); return t + '\u0000' + clean(t); });
  return shared;
}

test('content/protected-lessons is excluded from staging and holds only fragments', async () => {
  const { excludedDirectories } = await import('../scripts/stage-public-site.mjs');
  assert.ok(excludedDirectories.has('content'), 'stage-public-site.mjs keeps content/ out of public-site/');
  const files = walk(PROTECTED_DIR);
  assert.ok(files.length >= 1);
  for (const file of files) assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /<html\b|<head\b|<body\b|UPSKILLSPRINT_LESSON_META/i, path.relative(ROOT, file));
});

test('no protected passage appears anywhere in the staged public site', async () => {
  const needles = protectedNeedles();
  assert.ok(needles.length > 150, `${needles.length} passages`);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'protected-lesson-site-'));
  try {
    await (await import('../scripts/stage-public-site.mjs')).stagePublicSite(ROOT, out);
    assert.equal(fs.existsSync(path.join(out, 'content')), false);
    const staged = walk(out).filter((f) => TEXT_FILES.test(f));
    assert.ok(staged.length > 200, `${staged.length} staged text files`);
    for (const file of staged) {
      const text = fs.readFileSync(file, 'utf8');
      const flat = text.includes('\n') ? clean(text) : text;
      for (const needle of needles) {
        assert.ok(!text.includes(needle) && !flat.includes(needle), `${path.relative(out, file)} contains protected text: ${needle.slice(0, 60)}`);
      }
    }
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('the public search index (committed and freshly built) has the teaser and summary only', async () => {
  const needles = protectedNeedles();
  const committed = fs.readFileSync(path.join(ROOT, 'assets/search/lesson-search-index.json'), 'utf8');
  const { buildLessonSearchIndex, serializeLessonSearchIndex } = await import('../scripts/build-lesson-search-index.mjs');
  const built = serializeLessonSearchIndex(buildLessonSearchIndex(ROOT));
  assert.equal(built, committed, 'committed index is current');
  const flatIndex = clean(JSON.parse(committed).lessons.flatMap((l) => l.sections.map((s) => s.text)).join(' \u0000 '));
  for (const needle of needles) assert.ok(!flatIndex.includes(needle) && !committed.includes(needle), `index contains protected text: ${needle.slice(0, 60)}`);

  const { PROTECTED_LESSONS, protectedLessonRoute } = await import('../content/protected-lesson-catalog.mjs');
  for (const key of Object.keys(PROTECTED_LESSONS)) {
    const record = JSON.parse(committed).lessons.find((l) => l.path === protectedLessonRoute(key));
    assert.ok(record, `${key} is still searchable`);
    const teaser = new JSDOM(fs.readFileSync(path.join(ROOT, protectedLessonRoute(key).slice(1) + '.html'), 'utf8')).window.document;
    const mount = teaser.querySelector('[data-protected-lesson]');
    const summary = record.sections.find((s) => s.id === mount.id);
    assert.ok(summary, 'one section for the protected part, anchored to the mount');
    assert.equal(summary.text, clean(mount.getAttribute('data-search-summary')));
    const teaserIds = new Set([...teaser.querySelectorAll('[id]')].map((el) => el.id));
    for (const section of record.sections) {
      if (section.id.startsWith('lesson-section-')) continue; // assigned by the same algorithm in the browser
      assert.ok(teaserIds.has(section.id), `#${section.id} exists on the public page`);
    }
  }
});

test('the indexer drops everything inside a protected mount, even content placed there by mistake', async () => {
  const { extractSections } = await import('../scripts/build-lesson-search-index.mjs');
  const sections = extractSections(`<main id="lesson-content"><h1>T</h1><p>Public intro text here.</p>
    <div id="full-lesson" data-protected-lesson="lesson:/lessons/x/y" data-search-summary="  Summary   of the rest. ">
      <h2 id="gate">Keep going</h2><p>Sign in to read on.</p><section><h2 id="secret">Secret part</h2><p>Leaked body text.</p></section>
    </div><h2 id="after">Related</h2><p>Links.</p></main>`);
  assert.deepEqual(sections.map((s) => [s.id, s.heading, s.text]), [
    ['lesson-section-t', 'T', 'Public intro text here.'],
    ['full-lesson', 'Keep going', 'Summary of the rest.'],
    ['after', 'Related', 'Links.']
  ]);
  const none = extractSections('<main><h1 id="t">T</h1><div data-protected-lesson="lesson:/lessons/x/y"><h2 id="s">S</h2><p>Body.</p></div></main>');
  assert.deepEqual(none.map((s) => s.id), ['t'], 'no summary: nothing from the mount');
});

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const load = () => import(path.join(ROOT, 'scripts/build-lesson-email-feed.mjs'));

test('the feed covers every published catalog lesson with absolute production URLs', async () => {
  const { buildLessonEmailFeed } = await load();
  const { discoverCatalog } = await import(path.join(ROOT, 'scripts/build-lesson-search-index.mjs'));
  const feed = buildLessonEmailFeed({ rootDir: ROOT, publicDir: path.join(ROOT, 'public-site-missing') });
  const catalog = discoverCatalog(ROOT).filter((entry) => !entry.placeholder);
  assert.equal(feed.version, 1);
  assert.equal(feed.lessons.length, catalog.length);
  assert.ok(feed.lessons.length >= 20, 'the announcer refuses feeds smaller than 20 lessons');
  assert.deepEqual(feed.lessons.map((l) => l.path).sort(), catalog.map((e) => e.path).sort());
  for (const lesson of feed.lessons) {
    assert.equal(lesson.url, 'https://upskillsprint.com' + lesson.path);
    assert.ok(['announce', 'skip'].includes(lesson.email));
    assert.ok(lesson.title);
    assert.ok(Array.isArray(lesson.headings) && lesson.headings.length <= 8);
  }
  assert.ok(feed.lessons.some((l) => l.path === feed.previewPath), 'test-mode preview points at a real lesson');
  assert.ok(!feed.lessons.some((l) => l.path === '/lesson-template'), 'the template placeholder is never announced');
});

test('author teaser and skip tags are read from <head> and validated', async () => {
  const { readLessonEmailTags } = await load();
  const head = (meta) => `<!doctype html><html><head>${meta}</head><body><h2>One</h2><h2>Check your understanding</h2><h2>Two <em>x</em></h2></body></html>`;
  const ok = readLessonEmailTags(head('<meta name="upskill:email-teaser" content="Pick the right control chart in five decisions and stop guessing.">'), 'x.html');
  assert.equal(ok.teaser, 'Pick the right control chart in five decisions and stop guessing.');
  assert.equal(ok.email, 'announce');
  assert.deepEqual(ok.headings, ['One', 'Two x']);
  assert.equal(readLessonEmailTags(head('<meta name="upskill:email" content="skip">'), 'x.html').email, 'skip');
  assert.equal(readLessonEmailTags(head(''), 'x.html').teaser, null);
  assert.throws(() => readLessonEmailTags(head('<meta name="upskill:email-teaser" content="Too short">'), 'x.html'), /40–160/);
  assert.throws(() => readLessonEmailTags(head(`<meta name="upskill:email-teaser" content="${'a'.repeat(161)}">`), 'x.html'), /40–160/);
  assert.throws(() => readLessonEmailTags(head('<meta name="upskill:email-teaser" content="Read more at https://example.com about control charts today">'), 'x.html'), /links/);
  assert.throws(() => readLessonEmailTags(head('<meta name="upskill:email" content="later">'), 'x.html'), /skip.*announce/);
  assert.throws(() => readLessonEmailTags(head('<meta name="upskill:email-teaser" content="Replace with one catchy sentence about what the learner will be able to do.">'), 'x.html'), /placeholder/);
});

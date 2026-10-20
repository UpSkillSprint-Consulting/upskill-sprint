'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('homepage counts match the rendered lesson and tool libraries', async () => {
  const home = new JSDOM('<html></html>', { url: 'https://upskillsprint.com/', runScripts: 'outside-only', pretendToBeVisual: true });
  home.window.eval(read('site-sections.js'));
  home.window.eval(read('chi-square-lesson-library.js'));
  const parse = name => new home.window.DOMParser().parseFromString(read(name), 'text/html');
  const counts = home.window.UpskillLessonCounts(parse('lessons.html'));
  const lessonPage = new JSDOM(read('lessons.html'), { url: 'https://upskillsprint.com/lessons', runScripts: 'outside-only', pretendToBeVisual: true });
  lessonPage.window.eval(read('chi-square-lesson-library.js'));
  lessonPage.window.document.dispatchEvent(new lessonPage.window.Event('DOMContentLoaded'));
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(counts.lessons, lessonPage.window.document.querySelectorAll('[data-lesson-item][data-interactive="true"]').length);
  assert.equal(counts.subjects, [...lessonPage.window.document.querySelectorAll('[data-category-section]')].filter(section => section.querySelector('[data-lesson-item]')).length);
  assert.ok(counts.lessons > 9);
  const tools = parse('engineering-tools.html');
  assert.equal(home.window.UpskillToolCounts(tools), 2);
  assert.equal(home.window.UpskillToolCounts(tools), 2, 'hydration is idempotent');
  const lessons = parse('lessons.html');
  const duplicate = lessonPage.window.document.querySelector('[data-lesson-item][data-interactive="true"]').cloneNode(true);
  lessons.getElementById('quality-engineering').appendChild(duplicate);
  assert.equal(home.window.UpskillLessonCounts(lessons).lessons, counts.lessons, 'duplicate links do not inflate counts');
  home.window.close();
  lessonPage.window.close();
});

async function examCount(t, catalog) {
  const dom = new JSDOM(read('index.html'), { url: 'https://upskillsprint.com/', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const w = dom.window;
  w.matchMedia = () => ({ matches: true }); // Counts settle immediately with reduced motion.
  w.UpskillLessonCounts = () => ({ lessons: 53, subjects: 7 });
  w.UpskillToolCounts = () => 2;
  w.fetch = async url => ({ ok: url !== '/exam-practice.html' || catalog !== null, text: async () => url === '/exam-practice.html' ? catalog : '<html></html>' });
  const script = [...w.document.scripts].find(node => node.textContent.includes('var STATS ='));
  w.eval(script.textContent);
  await new Promise(resolve => setImmediate(resolve));
  return w.document.querySelector('[data-stat-key="exams"]').textContent;
}
test('homepage exam total follows released certifications, deduplicates cards and excludes coming soon', async t => {
  const catalog = read('exam-practice.html');
  assert.equal(await examCount(t, catalog), '8');
  const fixture = new JSDOM(catalog); t.after(() => fixture.window.close());
  const doc = fixture.window.document;
  const list = doc.getElementById('exam-certifications');
  const released = list.querySelector('[data-publication="published"]').cloneNode(true);
  list.appendChild(released); // Same exam repeated must not count twice.
  const next = released.cloneNode(true); next.dataset.exam = 'future-exam'; list.appendChild(next);
  assert.equal(await examCount(t, doc.documentElement.outerHTML), '9');
});
test('an unavailable exam catalog shows a dash rather than an invented zero', async t => {
  assert.equal(await examCount(t, null), '—');
});

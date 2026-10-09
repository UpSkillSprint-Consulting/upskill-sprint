'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const html = read('lessons.html');
const SITE_JS = read('site-sections.js');
const SEARCH_CORE_JS = read('lesson-search-core.js');
const SEARCH_UI_JS = read('lesson-search.js');

async function loadPage(t, file = 'lessons.html', url = 'https://upskillsprint.com/lessons.html') {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(read(file), {
    url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window) { window.HTMLElement.prototype.scrollIntoView = function () {}; }
  });
  t.after(() => dom.window.close());
  await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  dom.window.eval(SITE_JS);
  if (file === 'lessons.html') {
    dom.window.eval(SEARCH_CORE_JS);
    dom.window.eval(SEARCH_UI_JS);
    dom.window.UpskillLessonSearch.init();
    await new Promise(resolve => dom.window.setTimeout(resolve, 15));
  }
  return { window: dom.window, errors };
}

test('lessons.html keeps the shared controllers and balanced scripts', () => {
  for (const file of ['site-sections.js', 'lesson-search-core.js', 'lesson-search.js']) {
    assert.equal(html.split(`<script src="/${file}"></script>`).length - 1, 1);
  }
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

test('exam practice is outside the lesson library, topic filters, and topic links', async t => {
  const { window } = await loadPage(t);
  const doc = window.document;
  assert.equal(doc.getElementById('exam-practice'), null);
  assert.equal(doc.querySelector('#topic-filter option[value="exam-practice"]'), null);
  assert.equal(doc.querySelector('.topic-jump a[href="#exam-practice"]'), null);
  assert.equal(doc.querySelector('a[href="#exam-practice"]'), null);
  assert.ok(doc.getElementById('data-analytics'));
  assert.ok(doc.getElementById('quality-engineering'));
});

test('the public exam page describes current certification availability and Test Bank entry', async t => {
  const { window, errors } = await loadPage(t, 'exam-practice.html', 'https://upskillsprint.com/exam-practice');
  const doc = window.document;
  assert.equal(doc.querySelector('h1').textContent, 'Simulated Exam Practice & Quizzes');
  const section = doc.getElementById('exam-practice');
  const cards = Array.from(section.querySelectorAll('.exam-card'));
  const certs = cards.map(card => [card.querySelector('h3').textContent, card.querySelector('.exam-acronym').textContent]);
  assert.deepEqual(certs, [
    ['Certified Six Sigma Black Belt', 'CSSBB'],
    ['Certified Six Sigma Master Black Belt', 'MBB'],
    ['Certified Quality Engineer', 'CQE'],
    ['Certified Manager of Quality/Organizational Excellence', 'CMQ/OE'],
    ['Certified Six Sigma Green Belt', 'CSSGB'],
    ['Certified Reliability Engineer', 'CRE'],
    ['Certified Quality Auditor', 'CQA']
  ]);
  assert.equal(section.querySelector('.category-count').textContent, '6 available · 1 coming soon');
  assert.match(section.textContent,/timed or untimed/);
  assert.equal(section.querySelector('.exam-certifications').getAttribute('aria-label'),'Certification availability');
  assert.match(section.textContent, /Premium account or higher/);
  assert.equal((section.textContent.match(/Premium/g) || []).length, 1, 'access requirement is stated once');
  assert.ok(section.querySelector('a[href="/test-bank"]'));
  assert.deepEqual(Array.from(section.querySelectorAll('.exam-certifications a'), a=>a.getAttribute('href')),
    ['/test-bank?exam=cssbb','/test-bank?exam=mbb','/test-bank?exam=cqe','/test-bank?exam=cmq','/test-bank?exam=cssgb','/test-bank?exam=cre','/test-bank?exam=cqa']);
  assert.equal(section.querySelectorAll('.exam-coming-soon .exam-card').length, 1);
  assert.equal(section.querySelector('.exam-coming-soon h2').textContent, 'Coming soon');
  for (const card of cards) {
    const upcoming = Boolean(card.closest('.exam-coming-soon'));
    const cre = card.getAttribute('href') === '/test-bank?exam=cre';
    assert.equal(card.querySelector('.exam-status').textContent, upcoming ? 'Coming soon' : cre ? 'Sets 1–3: 245 questions available' : 'Available now');
    assert.match(card.querySelector('.exam-card-action').textContent, upcoming ? /View exam details/ : /Start practicing/);
    assert.equal(card.querySelectorAll('a, button, input, select').length, 0, 'one keyboard stop per card, no nested controls');
    assert.equal(card.firstElementChild.tagName, 'H3', 'the full name comes before the acronym');
    assert.equal(card.querySelector('.exam-card-action span').getAttribute('aria-hidden'), 'true');
    const group = card.closest('section');
    assert.ok(doc.getElementById(group.getAttribute('aria-labelledby')), 'each group has an accessible heading');
  }
  assert.equal(section.querySelectorAll('.chip').length, 0, 'acronym-only pills are removed');
  assert.equal(section.querySelector('.exam-actions a').getAttribute('href'),'/test-bank','main entry keeps the whole catalog');

  assert.ok(fs.existsSync(path.join(ROOT, 'test-bank.html')));
  assert.equal(doc.body.hasAttribute('data-access-resource'), false, 'the directory is public');
  assert.deepEqual(errors, []);
});

test('unit converter has one shared banner and one unbranded tool heading', async t => {
  const { window, errors } = await loadPage(t, 'tools/unit-converter.html', 'https://upskillsprint.com/tools/unit-converter');
  const doc = window.document;
  assert.equal(doc.querySelectorAll('header').length, 1);
  assert.equal(doc.querySelectorAll('header.site .brand img').length, 1);
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelectorAll('.converter-heading').length, 1);
  assert.equal(doc.querySelector('.converter-heading').querySelectorAll('img, .theme-toggle, .tool-top-actions').length, 0);
  assert.equal(doc.querySelectorAll('.theme-toggle').length, 1);
  assert.equal(doc.querySelectorAll('#search').length, 1);
  assert.equal(doc.querySelectorAll('.unit-categories').length, 1);
  assert.equal(doc.querySelector('.converter-back').getAttribute('href'), '/engineering-tools');
  assert.deepEqual(errors, []);
});

test('desktop and mobile navigation place the exam tab immediately after Lessons on every page type', async t => {
  const pages = [
    ['index.html', '/'],
    ['lessons.html', '/lessons'],
    ['exam-practice.html', '/exam-practice'],
    ['test-bank.html', '/test-bank.html'],
    ['lessons/statistics/understanding-dot-notation.html', '/lessons/statistics/understanding-dot-notation'],
    ['tools/unit-converter.html', '/tools/unit-converter']
  ];
  for (const [file, route] of pages) {
    const { window } = await loadPage(t, file, 'https://upskillsprint.com' + route);
    for (const nav of window.document.querySelectorAll('nav.desktop-nav, nav.mobile-nav')) {
      const lessons = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.trim() === 'Lessons');
      const exam = lessons.nextElementSibling;
      assert.equal(exam.textContent, 'Exam Practice & Quizzes', `${file}: exam tab follows Lessons`);
      assert.equal(exam.getAttribute('href'), '/exam-practice');
      assert.equal(exam.nextElementSibling.textContent, 'Engineering Tools');
      assert.equal(nav.querySelectorAll('a[href="/exam-practice"]').length, 1, 'no duplicate tabs');
      assert.equal(exam.getAttribute('aria-current'), route.startsWith('/exam-practice') || route.startsWith('/test-bank') ? 'page' : null);
    }
    assert.ok(window.document.querySelector('footer a[href="/exam-practice"]'), `${file}: footer entry`);
  }
});

test('exam overview and simulator routes share the active top tab, including pretty URLs', async t => {
  for (const route of ['/exam-practice/', '/exam-practice.html', '/test-bank', '/test-bank/']) {
    const file = route.startsWith('/test-bank') ? 'test-bank.html' : 'exam-practice.html';
    const { window } = await loadPage(t, file, 'https://upskillsprint.com' + route);
    assert.equal(window.document.querySelector('nav.desktop-nav a[aria-current="page"]').textContent, 'Exam Practice & Quizzes');
  }
  const { window } = await loadPage(t, 'test-bank.html', 'https://upskillsprint.com/test-bank');
  assert.equal(window.document.querySelector('.tb-crumb a').getAttribute('href'), '/exam-practice');
  assert.equal(window.document.querySelector('.tb-crumb a').textContent, 'Exam Practice & Quizzes');
});

test('old lesson bookmarks forward to the moved page and keep access notices', () => {
  for (const pathname of ['/lessons', '/lessons/', '/lessons.html', '/lessons.html/']) {
    const redirects = [];
    const document = { readyState: 'complete' };
    function Document() {}
    Document.prototype.write = function () {};
    vm.runInNewContext(SITE_JS, {
      Document, document,
      window: { location: { pathname, hash: '#exam-practice', search: '?access=premium', replace: url => redirects.push(url) } }
    });
    assert.deepEqual(redirects, ['/exam-practice?access=premium']);
  }
});

test('the new public directory displays Premium and unavailable notices without revealing exam content', async t => {
  for (const reason of ['premium', 'unavailable']) {
    const { window } = await loadPage(t, 'exam-practice.html', `https://upskillsprint.com/exam-practice?access=${reason}`);
    window.eval(read('access-control.js'));
    const notice = window.document.getElementById('access-notice');
    assert.ok(notice);
    assert.ok(notice.querySelector('a[href^="mailto:"]'));
    assert.equal(notice.parentElement.id, 'exam-practice');
    assert.equal(window.document.querySelector('#tb-overview'), null);
  }
});

test('lesson topic and interactive filters still operate without the removed exam category', async t => {
  const { window, errors } = await loadPage(t);
  const topic = window.document.getElementById('topic-filter');
  topic.value = 'quality-engineering';
  topic.dispatchEvent(new window.Event('change'));
  assert.equal(window.document.getElementById('quality-engineering').hidden, false);
  assert.equal(window.document.getElementById('data-analytics').hidden, true);
  const interactive = window.document.getElementById('interactive-filter');
  interactive.checked = true;
  interactive.dispatchEvent(new window.Event('change'));
  assert.equal(window.document.getElementById('quality-engineering').hidden, false);
  assert.deepEqual(errors, []);
});
test('certification links open the corresponding simulator overview without starting an attempt',async t=>{
  for(const id of ['cssbb','mbb','cqe','cre','cqa','cmq','cssgb']){
    const {window}=await loadPage(t,'test-bank.html',`https://upskillsprint.com/test-bank?exam=${id}`);
    assert.equal(window.document.querySelector('.tb-tile.active').dataset.exam,id);
    assert.equal(window.document.querySelector('.tb-quiz'),null,'links do not start an exam');
  }
  const {window}=await loadPage(t,'test-bank.html','https://upskillsprint.com/test-bank?exam=unknown%22%5D');
  assert.equal(window.document.querySelector('.tb-tile.active').dataset.exam,'cssbb','unknown IDs keep the normal catalog');
});

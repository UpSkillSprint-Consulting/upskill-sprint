'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'lessons.html'), 'utf8');

function loadPage() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/lessons.html',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc
  });
  return new Promise(res => dom.window.addEventListener('load', () => res({ window: dom.window, errors })));
}

test('lessons.html keeps the exact shared controller tag and balanced scripts', () => {
  assert.equal(html.split('<script src="/site-sections.js"></script>').length - 1, 1);
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

test('the Exam Practice section sits between Data Analytics and Quality Engineering', async () => {
  const { window } = await loadPage();
  const ids = Array.from(window.document.querySelectorAll('.lesson-category')).map(s => s.id);
  const da = ids.indexOf('data-analytics'), ex = ids.indexOf('exam-practice'), qe = ids.indexOf('quality-engineering');
  assert.ok(da > -1 && ex > -1 && qe > -1, 'all three sections exist');
  assert.ok(da < ex && ex < qe, 'order is Data Analytics → Exam Practice → Quality Engineering');
});

test('the section has the expected heading, coming-soon state, and cert previews', async () => {
  const { window } = await loadPage();
  const sec = window.document.getElementById('exam-practice');
  assert.ok(sec, 'section present');
  assert.match(sec.querySelector('h2').textContent, /Simulated Exam Practice/);
  assert.match(sec.querySelector('.category-count').textContent, /Coming soon/);
  assert.ok(sec.hasAttribute('data-empty-category'), 'uses the empty-category pattern');
  const certs = Array.from(sec.querySelectorAll('.chip')).map(c => c.textContent);
  ['CSSBB', 'CQE', 'CRE', 'CQA', 'CMQ/OE', 'CSSGB'].forEach(c =>
    assert.ok(certs.includes(c), `previews ${c}`));
});

test('the section has no dead links (only the request-an-exam CTA)', async () => {
  const { window } = await loadPage();
  const sec = window.document.getElementById('exam-practice');
  const links = Array.from(sec.querySelectorAll('a')).map(a => a.getAttribute('href'));
  assert.deepEqual(links, ['request-topic.html'], 'the only link is the request CTA');
});

test('the section is wired into the jump nav, topic filter, and footer', async () => {
  const { window } = await loadPage();
  assert.ok(window.document.querySelector('.topic-jump a[href="#exam-practice"]'), 'jump chip present');
  assert.ok(window.document.querySelector('#topic-filter option[value="exam-practice"]'), 'filter option present');
  const footerLink = Array.from(window.document.querySelectorAll('a'))
    .some(a => a.getAttribute('href') === '#exam-practice' && !a.classList.contains('chip'));
  assert.ok(footerLink, 'footer topic link present');
});

test('selecting the Exam Practice topic filter reveals the section without a no-results state', async () => {
  const { window } = await loadPage();
  const tf = window.document.getElementById('topic-filter');
  tf.value = 'exam-practice';
  tf.dispatchEvent(new window.Event('change'));
  assert.equal(window.document.getElementById('exam-practice').hidden, false, 'section is visible');
  assert.equal(window.document.getElementById('no-results').hidden, true, 'no dead "no results" panel');
  // lesson sections should hide when a non-matching topic is selected
  assert.equal(window.document.getElementById('quality-engineering').hidden, true, 'other topics hidden');
});

test('a detailed filter (e.g. Interactive only) hides the coming-soon section, matching Data Analytics behaviour', async () => {
  const { window } = await loadPage();
  const io = window.document.getElementById('interactive-filter');
  io.checked = true;
  io.dispatchEvent(new window.Event('change'));
  assert.equal(window.document.getElementById('exam-practice').hidden, true, 'hidden under a detailed filter');
  assert.equal(window.document.getElementById('data-analytics').hidden, true, 'same as Data Analytics');
});

test('the page loads with no runtime errors', async () => {
  const { errors } = await loadPage();
  assert.deepEqual(errors, []);
});

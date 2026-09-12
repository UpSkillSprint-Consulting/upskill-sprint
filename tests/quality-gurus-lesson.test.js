'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'lessons', 'quality-engineering', 'quality-gurus-crosby-juran-deming.html');
const html = fs.readFileSync(FILE, 'utf8');
const library = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
const guide = fs.readFileSync(path.join(ROOT, 'docs', 'LESSON_CREATION_GUIDE.md'), 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

test.after(() => dom.window.close());

test('metadata, location, and canonical lesson contract are valid', () => {
  assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  const metadata = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)\s*-->/)[1]);
  assert.equal(metadata.slug, 'quality-gurus-crosby-juran-deming');
  assert.equal(metadata.category_slug, 'quality-engineering');
  assert.equal(metadata.suggested_github_path, 'lessons/quality-engineering/quality-gurus-crosby-juran-deming.html');
  assert.ok(metadata.search_keywords.length >= 5);
  assert.equal(document.body.dataset.category, 'quality-engineering');
  assert.equal(document.body.dataset.level, 'beginner');
  assert.ok(document.querySelector('main#lesson-content'));
  assert.ok(document.querySelector('a[href="/lessons#quality-engineering"]'));
  assert.ok(!/YOUR PROGRESS/i.test(html), 'progress card must remain runtime-injected');
});

test('required site assets and canonical quiz styles remain exact', () => {
  for (const tag of [
    '<link rel="stylesheet" href="/style.css">',
    '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>',
    '<script src="/site-sections.js"></script>'
  ]) assert.equal(html.split(tag).length - 1, 1, tag);
  const expected = guide.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0];
  const actual = html.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0];
  assert.equal(actual, expected);
});

test('each guru section contains an accessible, locally shipped portrait', () => {
  const expected = [
    ['crosby', 'philip-crosby.jpg', 'Philip B. Crosby'],
    ['juran', 'joseph-juran.jpg', 'Joseph M. Juran'],
    ['deming', 'w-edwards-deming.jpg', 'W. Edwards Deming']
  ];
  for (const [sectionId, filename, name] of expected) {
    const image = document.querySelector(`#${sectionId} .guru-profile img`);
    assert.ok(image, `${name} portrait is inside the matching section`);
    assert.match(image.alt, new RegExp(name.replace('.', '\\.'), 'i'));
    assert.equal(image.getAttribute('src'), `/assets/lessons/quality-gurus-crosby-juran-deming/${filename}`);
    const bytes = fs.readFileSync(path.join(ROOT, 'assets', 'lessons', 'quality-gurus-crosby-juran-deming', filename));
    assert.deepEqual([...bytes.subarray(0, 2)], [0xff, 0xd8], `${filename} is a JPEG`);
  }
  assert.ok(!html.includes('data:image/'), 'production lesson uses repository assets, not embedded payloads');
});

test('Juran Trilogy discussion includes the supplied planning-control-improvement diagram', () => {
  const image = document.querySelector('#juran .guru-reference-figure img');
  assert.ok(image, 'diagram is inside the Juran section');
  assert.equal(image.getAttribute('src'), '/assets/lessons/quality-gurus-crosby-juran-deming/juran-trilogy-diagram.png');
  assert.match(image.alt, /planning.*original zone of control.*chronic waste.*improvement.*new zone of control/i);
  assert.equal(document.querySelectorAll('#juran .guru-diagram-reading article').length, 3);
  assert.match(document.querySelector('#juran .guru-reference-figure').textContent, /sporadic spike/i);
  assert.match(document.querySelector('#juran .guru-reference-figure').textContent, /prevent backsliding/i);
  const bytes = fs.readFileSync(path.join(ROOT, 'assets', 'lessons', 'quality-gurus-crosby-juran-deming', 'juran-trilogy-diagram.png'));
  assert.deepEqual([...bytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
});

test('lesson opens with a responsive, readable quality-management map before introducing the guru lenses', () => {
  const image = document.querySelector('.guru-hero .guru-opening-map img');
  assert.ok(image, 'opening map is part of the hero introduction');
  assert.equal(image.getAttribute('src'), '/assets/lessons/quality-gurus-crosby-juran-deming/quality-management-map-readable.svg');
  assert.equal(image.getAttribute('width'), '1600');
  assert.equal(image.getAttribute('height'), '900');
  assert.match(image.alt, /customer value.*planning.*assurance.*control.*improvement.*Crosby.*Juran.*Deming/i);
  const mobileSource = document.querySelector('.guru-hero .guru-opening-map source[media="(max-width: 640px)"]');
  assert.ok(mobileSource, 'opening map has a dedicated mobile composition');
  assert.equal(mobileSource.getAttribute('srcset'), '/assets/lessons/quality-gurus-crosby-juran-deming/quality-management-map-readable-mobile.svg');
  assert.equal(document.querySelector('.guru-opening-map .guru-image-link').getAttribute('href'), image.getAttribute('src'));
  const mapPosition = html.indexOf('class="guru-reference-figure guru-opening-map"');
  assert.ok(mapPosition > html.indexOf('<h1 id="lesson-title">'));
  assert.ok(mapPosition < html.indexOf('<aside class="guru-hero-panel"'));
  assert.ok(mapPosition < html.indexOf('<section class="guru-section" id="objectives">'));
  assert.equal(document.querySelectorAll('.guru-opening-bridge p').length, 3);
  for (const filename of ['quality-management-map-readable.svg', 'quality-management-map-readable-mobile.svg']) {
    const asset = fs.readFileSync(path.join(ROOT, 'assets', 'lessons', 'quality-gurus-crosby-juran-deming', filename), 'utf8');
    assert.match(asset, /^<svg /, `${filename} is an SVG`);
    assert.match(asset, /Define customer value/);
    assert.match(asset, /Build the[\s\S]*management system/);
    assert.match(asset, /Operate, learn,[\s\S]*and improve/);
    assert.match(asset, /Deliver balanced results/);
    assert.match(asset, /Crosby[\s\S]*Juran[\s\S]*Deming/);
  }
});

test('dark-mode quiz contract supplies explicit surface and text colours', () => {
  const contract = document.querySelector('#guru-quiz-contract').textContent;
  const finalDark = document.querySelector('#guru-dark-overrides').textContent;
  assert.match(contract, /#quiz \.quiz-option \{ color: #172536; \}/);
  assert.match(finalDark, /html\[data-theme="dark"\] #quiz \.quiz-option \{ color: #e7eef4; \}/);
  assert.match(finalDark, /#quiz \.quiz \{ background: #131f2c; border-color: #64788d; \}/);
  assert.match(finalDark, /prefers-color-scheme: dark/);
  assert.ok(html.lastIndexOf('<style id="guru-dark-overrides">') > html.lastIndexOf('</script>'));
});

test('lesson-owned custom properties are namespaced and avoid site-token collisions', () => {
  const customProperties = [...html.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map(match => match[1]);
  const lessonProperties = [...new Set(customProperties.filter(name => name.startsWith('--guru-')))];
  assert.ok(lessonProperties.length >= 10);
  const siteCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8') + fs.readFileSync(path.join(ROOT, 'lessons-theme.css'), 'utf8');
  for (const name of lessonProperties) assert.ok(!siteCss.includes(name + ':'), `${name} must not collide with site CSS`);
  assert.ok(!/(^|[\s,}])(header|footer|\.site|\.brand|\.desktop-nav)\s*\{/m.test(document.querySelector('head style').textContent));
});

test('catalog registers the lesson as a readable Quality Engineering entry', () => {
  assert.ok(library.includes("marker: 'data-quality-gurus-crosby-juran-deming'"));
  assert.ok(library.includes("sectionId: 'quality-engineering'"));
  assert.ok(library.includes("path: '/lessons/quality-engineering/quality-gurus-crosby-juran-deming'"));
  assert.ok(library.includes("marker: 'data-beyond-the-bell'"));
  assert.doesNotThrow(() => new Function(library));
});

test('PONC, guru matching, and the eight-question quiz execute correctly', () => {
  const runtime = new JSDOM(html, {
    url: 'https://upskillsprint.com/lessons/quality-engineering/quality-gurus-crosby-juran-deming',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });
  try {
    const doc = runtime.window.document;
    doc.getElementById('ponc-calculate').click();
    assert.match(doc.getElementById('ponc-result').textContent, /\$90,000/);
    for (const row of doc.querySelectorAll('.guru-match-row')) row.querySelector('select').value = row.dataset.answer;
    doc.getElementById('guru-match-check').click();
    assert.match(doc.getElementById('guru-match-summary').textContent, /6 \/ 6/);
    let reported = null;
    doc.addEventListener('upskill-quiz-result', event => { reported = event.detail; }, { once: true });
    for (const question of doc.querySelectorAll('.quiz-question')) {
      question.querySelector(`input[value="${question.dataset.answer}"]`).checked = true;
    }
    doc.getElementById('quiz-submit').click();
    assert.equal(reported.score, 8);
    assert.equal(reported.total, 8);
    assert.equal(doc.querySelectorAll('.quiz-question.is-correct').length, 8);
  } finally {
    runtime.window.close();
  }
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const lessonPath = path.join(root, 'lessons/statistics/resampling-in-minitab.html');
const catalogPath = path.join(root, 'chi-square-lesson-library.js');
const xlsxPath = path.join(root, 'assets/lessons/resampling-in-minitab/minitab-resampling-practice-dataset.xlsx');
const mpxPath = path.join(root, 'assets/lessons/resampling-in-minitab/minitab-resampling-practice-dataset.mpx');
const html = fs.readFileSync(lessonPath, 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

test('resampling lesson follows the Statistics lesson contract', () => {
  assert.match(html, /^<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META/);
  const metaMatch = html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)\s*-->/);
  assert.ok(metaMatch, 'metadata block should exist');
  const meta = JSON.parse(metaMatch[1]);
  assert.equal(meta.title, 'Resampling in Minitab');
  assert.equal(meta.slug, 'resampling-in-minitab');
  assert.equal(meta.category_slug, 'statistics');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.lesson_type, 'General');
  assert.equal(meta.suggested_github_path, 'lessons/statistics/resampling-in-minitab.html');
  assert.ok(meta.search_keywords.length >= 5);

  assert.equal(document.title, meta.title);
  assert.equal(document.querySelector('h1').textContent.trim(), meta.title);
  assert.equal(document.querySelectorAll('html').length, 1);
  assert.equal(document.querySelectorAll('head').length, 1);
  assert.equal(document.querySelectorAll('body').length, 1);
  assert.ok(document.querySelector('main#lesson-content'));
  assert.equal(document.body.dataset.category, 'statistics');
  assert.equal(document.body.dataset.level, 'beginner');
  assert.equal(document.body.dataset.interactive, 'true');
  assert.equal(document.body.dataset.lessonType, 'general');
});

test('resampling lesson carries canonical site assets, chrome, quiz, and category return', () => {
  for (const required of [
    '<link rel="stylesheet" href="/style.css">',
    '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>',
    '<script src="/site-sections.js"></script>',
  ]) assert.ok(html.includes(required), `missing ${required}`);

  assert.equal(document.querySelectorAll('header.site.lesson-sitebar').length, 1);
  assert.equal(document.querySelectorAll('footer.site').length, 1);
  assert.deepEqual(
    Array.from(document.querySelectorAll('header.site .desktop-nav a')).map((link) => link.textContent.trim()),
    ['Start Here', 'Lessons', 'Engineering Tools', 'Services', 'Request a Topic', 'About', 'FAQ', 'Contact'],
  );
  assert.ok(document.querySelector('#quiz-form'));
  assert.equal(document.querySelectorAll('#quiz-form .quiz-question').length, 5);
  assert.equal(document.querySelectorAll('#quiz').length, 1);
  assert.equal(document.querySelector('#quiz-heading').textContent.trim(), '7. Knowledge Check');
  assert.equal(document.querySelector('#practice-quiz'), null, 'the legacy duplicate quiz must stay removed');
  assert.equal(document.querySelectorAll('main .quiz').length, 0, 'only the canonical knowledge check should remain');
  assert.ok(html.includes("new CustomEvent('upskill-quiz-result'"));
  assert.equal(document.querySelector('a[href="/lessons#statistics"]').textContent.trim(), '← Back to Statistics lessons');
  assert.ok(!html.includes('Want to save your progress and quiz scores for this lesson?'));
});

test('resampling lesson contains all five methods and required Statistics implementation sections', () => {
  for (const pathText of [
    'Calc → Resampling → Bootstrapping for 1-Sample Function',
    'Calc → Resampling → Bootstrapping for 2-Sample Means',
    'Calc → Resampling → Randomization Test for 1-Sample Mean',
    'Calc → Resampling → Randomization Test for 1-Sample Proportion',
    'Calc → Resampling → Randomization Test for 2-Sample Means',
  ]) assert.ok(document.body.textContent.includes(pathText), `missing ${pathText}`);

  const implementation = document.querySelector('#implementation');
  assert.ok(implementation);
  const headings = Array.from(implementation.querySelectorAll('h2,h3')).map((heading) => heading.textContent.trim());
  assert.deepEqual(headings.slice(0, 5), [
    '5. Statistics Implementation',
    'Excel Functions',
    'Excel Use Cases',
    'Minitab Navigation',
    'Exam Tips',
  ]);
  assert.ok(implementation.textContent.includes('PERCENTILE.INC'));
  assert.ok(implementation.textContent.includes('RANDARRAY'));
  assert.ok(implementation.textContent.includes('ASQ CSSBB/CQE'));
});

test('all lesson tables are responsive and downloadable practice assets exist', () => {
  const lessonTables = Array.from(document.querySelectorAll('.resampling-lesson table'));
  assert.ok(lessonTables.length >= 3);
  for (const table of lessonTables) assert.ok(table.parentElement.classList.contains('tablewrap'));
  assert.ok(fs.statSync(xlsxPath).size > 1000);
  assert.ok(fs.statSync(mpxPath).size > 1000);
  assert.ok(document.querySelector(`a[href="/assets/lessons/resampling-in-minitab/minitab-resampling-practice-dataset.xlsx"][download]`));
  assert.ok(document.querySelector(`a[href="/assets/lessons/resampling-in-minitab/minitab-resampling-practice-dataset.mpx"][download]`));
  assert.ok(html.includes('region.tabIndex = 0'), 'scrollable regions should receive keyboard focus');
  assert.ok(html.includes('.equation-box, .tablewrap, .formula, .symbols, .minitab-output'));
});

test('lesson styles are scoped and custom properties are namespaced', () => {
  const lessonStyle = document.querySelector('head style:not(#uss-quiz-style)').textContent;
  const declarations = Array.from(lessonStyle.matchAll(/(--[a-z0-9-]+)\s*:/gi), (match) => match[1]);
  assert.ok(declarations.length >= 10);
  for (const property of declarations) assert.match(property, /^--lesson-resampling-/);
  for (const prohibited of ['header', 'footer', '.site', '.brand', '.footer-grid', '.desktop-nav']) {
    assert.ok(!new RegExp(`(^|[},]\\s*)${prohibited.replace('.', '\\.')}\\s*[{,]`, 'm').test(lessonStyle), `unscoped protected selector: ${prohibited}`);
  }
  assert.ok(document.querySelector('#resampling-dark-mode'));
});

test('inline statistical notation cannot inherit the block formula treatment', () => {
  assert.equal(document.querySelectorAll('span.formula').length, 0);
  assert.equal(document.querySelectorAll('.formula-inline').length, 3);

  const lessonStyle = document.querySelector('head style:not(#uss-quiz-style)').textContent;
  assert.match(lessonStyle, /\.resampling-lesson \.formula-inline\s*\{[\s\S]*?display:\s*inline;/);
  assert.match(lessonStyle, /\.resampling-lesson \.formula-inline\s*\{[\s\S]*?white-space:\s*nowrap;/);
});

test('help-enhanced analysis controls receive explicit accessible names', () => {
  assert.ok(html.includes('control.setAttribute("aria-label", key)'));
  assert.ok(html.includes("input:not([type='range']), select"));
  assert.equal(document.querySelectorAll('.resampling-lesson input[type="range"]:not([aria-label])').length, 0);
});

test('catalog registers the resampling lesson as a readable literal entry', () => {
  const catalog = fs.readFileSync(catalogPath, 'utf8');
  assert.ok(catalog.includes("marker: 'data-resampling-in-minitab'"));
  assert.ok(catalog.includes("path: '/lessons/statistics/resampling-in-minitab'"));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.doesNotThrow(() => new Function(catalog));
});

test('all inline lesson scripts parse', () => {
  for (const script of document.querySelectorAll('script:not([src])')) {
    assert.doesNotThrow(() => new Function(script.textContent));
  }
});

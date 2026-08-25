'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON_PATH = path.join(ROOT, 'lessons', 'statistics', 'permutations-and-combinations.html');
const LESSON_URL = '/lessons/statistics/permutations-and-combinations';
const html = fs.readFileSync(LESSON_PATH, 'utf8');

function lessonMeta(source) {
  const match = source.match(/<!--\s*UPSKILLSPRINT_LESSON_META\s*\n([\s\S]*?)\n-->/);
  assert.ok(match, 'lesson metadata block exists');
  return JSON.parse(match[1]);
}

test('lesson is registered as an interactive beginner Statistics lesson', () => {
  const meta = lessonMeta(html);
  assert.equal(meta.slug, 'permutations-and-combinations');
  assert.equal(meta.category, 'Statistics');
  assert.equal(meta.category_slug, 'statistics');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.estimated_minutes, 25);
  assert.equal(meta.interactive, true);
  assert.equal(meta.suggested_github_path, 'lessons/statistics/permutations-and-combinations.html');
  assert.ok(meta.search_keywords.length >= 10);

  assert.match(html, /<body[^>]*data-lesson-page="true"[^>]*data-category="statistics"[^>]*data-level="beginner"[^>]*data-interactive="true"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/upskillsprint\.com\/lessons\/statistics\/permutations-and-combinations">/);
});

test('original teaching sequence and interactive learning tools remain present', () => {
  [
    'The master decision table',
    'Permutation WITHOUT replacement / repetition',
    'Combination WITHOUT replacement / repetition',
    'With replacement vs without replacement',
    'Permutation WITH repetition / replacement',
    'Combination WITH repetition',
    'Repeated identical objects',
    'The table worth memorizing',
    'Fast exam decision tree',
    'Interactive mastery practice',
    'The one memory sentence'
  ].forEach(text => assert.ok(html.includes(text), `preserves section: ${text}`));

  ['permViz', 'combViz', 'repTokens', 'pChoices'].forEach(id => {
    assert.match(html, new RegExp(`id="${id}"`), `${id} is present`);
  });
  assert.match(html, /upskill-quiz-result/);
});

test('counting functions produce the lesson worked-example answers', () => {
  const functions = ['fact', 'nPr', 'nCr'].map(name => {
    const match = html.match(new RegExp(`function ${name}\\(n(?:,r)?\\)\\{[^\\n]+\\}`));
    assert.ok(match, `${name} function is present`);
    return match[0];
  }).join('\n');
  const api = Function(`${functions}; return { fact, nPr, nCr };`)();

  assert.equal(api.fact(5), 120);
  assert.equal(api.nPr(5, 3), 60);
  assert.equal(api.nCr(5, 3), 10);
  assert.equal(api.nCr(6, 3), 20);
});

test('live visuals and mastery practice execute without runtime errors', () => {
  const runtimeHtml = html
    .replace(/<script>\s*window\.MathJax\s*=\s*\{[\s\S]*?<\/script>/, '')
    .replace(/<script[^>]+\bsrc="[^"]+"[^>]*><\/script>/g, '');
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  virtualConsole.on('error', error => errors.push(String(error)));
  const dom = new JSDOM(runtimeHtml, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://upskillsprint.com/lessons/statistics/permutations-and-combinations',
    virtualConsole,
    beforeParse(window) {
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      window.MathJax = { typesetPromise: () => Promise.resolve(), typesetClear() {} };
    }
  });
  const { document } = dom.window;

  ['permPause', 'combPause', 'repPause'].forEach(id => document.getElementById(id).click());

  const setRange = (id, value) => {
    const input = document.getElementById(id);
    input.value = String(value);
    input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  };
  setRange('permN', 5);
  setRange('permR', 3);
  assert.match(document.getElementById('permFormula').textContent, /= 60/);
  document.getElementById('permDraw').click();
  document.getElementById('permDraw').click();
  document.getElementById('permDraw').click();
  assert.equal(document.querySelectorAll('#permSlots .filled').length, 3);
  assert.equal(new Set([...document.querySelectorAll('#permSlots .filled')].map(node => node.textContent)).size, 3);

  setRange('combN', 5);
  setRange('combR', 3);
  assert.match(document.getElementById('combFormula').textContent, /= 10/);
  setRange('repN', 4);
  setRange('repR', 3);
  assert.match(document.getElementById('repFormula').textContent, /= 64/);

  let reportedScore = null;
  document.addEventListener('upskill-quiz-result', event => { reportedScore = event.detail; }, { once: true });
  document.querySelectorAll('#pChoices button')[2].click();
  assert.match(document.getElementById('pFeedback').textContent, /^Correct\./);
  assert.equal(reportedScore.score, 1);
  assert.equal(reportedScore.total, 6);
  assert.equal(document.getElementById('pNext').disabled, false);

  dom.window.close();
  assert.deepEqual(errors, []);
});

test('lesson uses the standard site chrome, theme, and accessible controls', () => {
  assert.match(html, /href="\/style\.css"/);
  assert.match(html, /href="\/lessons-theme\.css"/);
  assert.match(html, /src="\/theme\.js"/);
  assert.match(html, /src="\/site-sections\.js"/);
  assert.match(html, /<header class="site lesson-sitebar">/);
  assert.match(html, /<footer class="site">/);
  assert.match(html, /class="skip-link" href="#lesson-content"/);
  assert.match(html, /id="pFeedback"[^>]*role="status"[^>]*aria-live="polite"/);
  ['permN', 'permR', 'combN', 'combR', 'repN', 'repR'].forEach(id => {
    assert.match(html, new RegExp(`<label for="${id}">`), `${id} has a label`);
  });

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], [], 'HTML ids are unique');
});

test('Statistics library and sitemap expose the lesson exactly once', () => {
  const library = fs.readFileSync(path.join(ROOT, 'lessons.html'), 'utf8');
  const statsStart = library.indexOf('id="statistics"');
  const statsEnd = library.indexOf('<section class="lesson-category"', statsStart + 1);
  const statsSection = library.slice(statsStart, statsEnd === -1 ? undefined : statsEnd);
  assert.ok(statsStart >= 0, 'Statistics section exists');
  assert.match(statsSection, new RegExp(`href="${LESSON_URL}"[^>]*data-topic="statistics"[^>]*data-level="beginner"[^>]*data-interactive="true"`));
  assert.match(statsSection, /<span class="category-count">5 lessons<\/span>/);
  assert.equal((library.match(new RegExp(LESSON_URL, 'g')) || []).length, 1);

  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const canonical = `https://upskillsprint.com${LESSON_URL}`;
  assert.equal((sitemap.match(new RegExp(canonical, 'g')) || []).length, 1);
});

'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { JSDOM } = require('jsdom');
const LESSON = 'lessons/lean-six-sigma/signal-or-noise-arl-nelson-rules-control-limit-design.html';
const html = fs.readFileSync(LESSON, 'utf8');
const guide = fs.readFileSync('docs/LESSON_CREATION_GUIDE.md', 'utf8');
const main = html.match(/<main id="lesson-content">([\s\S]*?)<\/main>/)[1];
const quiz = html.match(/<section class="quiz-section"[\s\S]*?<\/section>/)[0];
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const text = x => x.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, '');
const dom = new JSDOM(html); // Parse only: never execute lesson scripts in a unit test.
const doc = dom.window.document;
// Original source: ddad4f1900392b2d250d0df8b8902dcb543f208d, blob 25179b4cfd2fa987038294d6fd96109cf49fe0af.
test('Signal or Noise preserves every teaching text node and heading in order', () => {
  assert.equal(sha(text(main)), 'a5b17f403b3869c8ef625b294aad7e535aeef250f161dbbea7ec233393c37e2e');
  assert.equal(sha(text(quiz)), '1c33db5b44f744c76a4238e4303f46f5aca31993ae79dad4741c1ccac83dddb8');
  const headings = [...(main + quiz).matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g)].map(m => m[1]);
  assert.equal(headings.length, 25);
  assert.equal(sha(JSON.stringify(headings)), '88afdfda9945284b26fe8e8ddab7162edd6bddf857a6e648a78512056dc63d2b');
});
test('Signal or Noise preserves all original calculations, datasets, rule derivations and self-check answers', () => {
  const engine = html.slice(html.indexOf('/* ================= NORMAL DIST HELPERS ================= */')).split('</script>')[0]
    .replaceAll('--lesson-arl-', '--arl-').replaceAll("'#607897'", "'#1c3153'").replaceAll("'#8fa5c2'", "'#3a4f6e'")
    .replace("zc.fillText('mean',cx-16,h-12)", "zc.fillText('mean',cx-16,h-30)");
  assert.equal(sha(engine), '77ca9f2c6a508b43623f589cf5fb1c2659c373a9cf147713f28eafc0dff777b3');
});
test('Signal or Noise retains six graded questions and the exact canonical quiz grader/styles', () => {
  assert.equal(doc.querySelectorAll('#quiz .quiz-question').length, 6);
  for (const q of doc.querySelectorAll('#quiz .quiz-question')) {
    assert(q.dataset.explanation);
    assert(q.querySelector('input[value="' + q.dataset.answer + '"]'));
  }
  const grader = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
  assert.equal(sha(grader), '420fc7efd459ae5901b87bca8eb6e5d5e9aecc93fa82c1a9d1d072666eb59246');
  assert.equal(html.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0], guide.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0]);
});
test('Signal or Noise uses canonical site chrome and automatic progress integration', () => {
  const header = guide.split('### 4.1 Header')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  const footer = guide.split('### 4.2 Footer')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  assert.equal(html.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>/)[0].trim(), header.trim());
  assert.equal(html.match(/<footer class="site">[\s\S]*?<\/footer>/)[0].trim(), footer.trim());
  assert.equal(doc.querySelectorAll('main').length, 1);
  for (const src of ['/theme.js', '/site-sections.js']) assert(html.includes('<script src="' + src + '"></script>'));
  assert(!doc.querySelector('#lesson-progress-widget'));
  assert.equal(doc.body.dataset.category, 'lean-six-sigma');
  assert.equal(doc.body.dataset.level, 'advanced');
});
test('Signal or Noise isolates CSS and namespaces every lesson-owned property', () => {
  const own = [...doc.querySelectorAll('#signal-noise-style, #signal-noise-dark-overrides')];
  assert.equal(own.length, 2);
  const shared = fs.readFileSync('style.css', 'utf8') + fs.readFileSync('lessons-theme.css', 'utf8');
  const sharedNames = new Set([...shared.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
  for (const style of own) {
    const css = style.textContent.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of css.matchAll(/(--[\w-]+)\s*:/g)) {
      assert(match[1].startsWith('--lesson-arl-'), match[1]);
      assert(!sharedNames.has(match[1]), match[1]);
    }
    function walk(rules) {
      for (const rule of rules) {
        if (rule.selectorText) for (const selector of rule.selectorText.split(',')) {
          assert(/#lesson-content\b|#quiz\b|#signal-noise-return\b/.test(selector), selector);
        }
        if (rule.cssRules) walk(rule.cssRules);
      }
    }
    walk(style.sheet.cssRules);
  }
  assert(html.lastIndexOf('id="signal-noise-dark-overrides"') > html.lastIndexOf('</script>'));
});
test('Signal or Noise fixes inaccessible charts, responsive scroll areas and off-step defaults', () => {
  assert.equal(doc.querySelectorAll('.chart-scroll canvas[role="img"][aria-label]').length, 6);
  for (const canvas of doc.querySelectorAll('.chart-scroll canvas')) assert.equal(canvas.parentElement.tabIndex, 0);
  for (const table of doc.querySelectorAll('#lesson-content table')) {
    assert.equal(table.parentElement.tabIndex, 0);
    assert.equal(table.parentElement.style.overflowX, 'auto');
  }
  for (const id of ['nPoints', 'cusumShiftSlider']) {
    const e = doc.getElementById(id);
    const steps = (+e.getAttribute('value') - +e.min) / +e.step;
    assert(Math.abs(steps - Math.round(steps)) < 1e-8, id + ' default must be a selectable value');
  }
  assert.match(html, /target\.scrollIntoView/);
  assert.match(html, /aria-expanded/);
  assert.match(html, /--lesson-arl-site-header-height/);
});
test('Signal or Noise retains the four Statistics Implementation parts and catalog registration', () => {
  const names = [...doc.querySelectorAll('#p6 h3')].map(e => e.textContent);
  assert.deepEqual(names, ['Excel Functions', 'Excel Use Cases', 'Minitab Navigation', 'Exam Tips']);
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(doc.title, meta.title);
  assert.equal(doc.querySelector('h1').textContent, meta.title);
  assert(meta.search_keywords.length >= 5 && meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.equal(meta.suggested_github_path, LESSON);
  assert(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  const catalog = fs.readFileSync('chi-square-lesson-library.js', 'utf8');
  assert.equal(catalog.split("path: '/" + LESSON.replace(/\.html$/, '') + "'").length - 1, 1);
  assert(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.equal(doc.querySelector('[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#lean-six-sigma');
});

'use strict';
// Regression guard for the Gage R&R lesson (lessons/data-analytics/gauge-rr-study.html).
//
// The lesson was authored self-contained and had to be brought into
// LESSON_CREATION_GUIDE.md compliance: canonical chrome/scripts, namespaced CSS
// tokens (no site-token collisions), the canonical "Check your understanding"
// quiz + grader that dispatches `upskill-quiz-result`, a back-to-category link,
// and catalog registration. These tests fail if any of those regress.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'lessons', 'quality-engineering', 'gauge-rr-study.html');
const html = fs.readFileSync(FILE, 'utf8');
const library = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');

test('required root-relative assets are present exactly once, inline <style> after links', () => {
  for (const tag of [
    '<link rel="stylesheet" href="/style.css">',
    '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>',
    '<script src="/site-sections.js"></script>'
  ]) {
    assert.equal(html.split(tag).length - 1, 1, 'exactly one ' + tag);
  }
  // theme.js appears once total (no leftover duplicate at the bottom)
  assert.equal(html.split('src="/theme.js"').length - 1, 1);
  // first lesson inline <style> comes after the two stylesheet links
  assert.ok(html.indexOf('/lessons-theme.css') < html.indexOf('<!-- EDIT: Lesson styles -->'));
});

test('canonical body attributes, header, main, footer, and back-link', () => {
  assert.match(html, /<body data-lesson-page="true" data-category="quality-engineering" data-level="beginner" data-interactive="true" data-lesson-type="general">/);
  assert.ok(html.includes('<header class="site lesson-sitebar">'));
  assert.ok(html.includes('class="desktop-nav"'));
  assert.ok(html.includes('<main id="lesson-content">'));
  assert.ok(html.includes('<footer class="site">'));
  assert.ok(html.includes('href="/lessons#quality-engineering"'));
  assert.ok(/Back to Quality Engineering lessons/.test(html));
  // progress card must NOT be hardcoded (it auto-injects)
  assert.ok(!/YOUR PROGRESS/i.test(html));
});

test('no lesson CSS redefines site custom properties — every lesson token is --grr-', () => {
  const style = html.match(/<!-- EDIT: Lesson styles -->\s*<style>([\s\S]*?)<\/style>/)[1];
  const generic = /(?:^|[;{\s])--(bg|surface|surface-2|ink|text|navy|teal|teal-2|blue|blue-2|red|red-2|green|green-2|amber|amber-2|muted|line|purple|shadow|radius|body|display|mono)\s*:/g;
  const hits = [];
  let m;
  while ((m = generic.exec(style)) !== null) hits.push(m[1]);
  assert.deepEqual(hits, [], 'un-namespaced token declarations leak into shared chrome: ' + hits.join(', '));
});

test('element scoping uses :where() so it never out-specifies lesson class rules', () => {
  const style = html.match(/<!-- EDIT: Lesson styles -->\s*<style>([\s\S]*?)<\/style>/)[1];
  // A bare `#lesson-content <element>` descendant selector raises specificity to
  // id-level and silently overrides the lesson's own class rules (this once
  // collapsed .step-list titles to one word per line). Element scoping must be
  // wrapped in :where(#lesson-content), which contributes zero specificity.
  const idScoped = style.match(/#lesson-content\s+[a-z]/g) || [];
  assert.deepEqual(idScoped, [], 'element scoping must use :where(#lesson-content): ' + idScoped.join(', '));
});

test('lesson does not restyle a class the site grid-styles (no .step-list collision)', () => {
  const siteCss = fs.readFileSync(path.join(ROOT, 'lessons-theme.css'), 'utf8')
    + '\n' + fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
  // classes the SITE lays out with an explicit grid template (redefining these
  // in-lesson strands content — e.g. .step-list li{grid-template-columns:36px 1fr})
  const siteGrid = new Set();
  siteCss.replace(/([^{}]+)\{([^{}]*)\}/g, (_, sel, body) => {
    if (/grid-template-columns/.test(body)) {
      (sel.match(/\.[a-zA-Z][\w-]*/g) || []).forEach(c => siteGrid.add(c.slice(1)));
    }
    return '';
  });
  const style = html.match(/<!-- EDIT: Lesson styles -->\s*<style>([\s\S]*?)<\/style>/)[1];
  const lessonClasses = new Set((style.match(/\.[a-zA-Z][\w-]*/g) || []).map(c => c.slice(1)));
  const clash = [...siteGrid].filter(c => lessonClasses.has(c));
  assert.deepEqual(clash, [], 'lesson CSS redefines site grid-layout class(es): ' + clash.join(', '));
});

test('lesson CSS never targets canonical chrome classes (no toggle/brand bleed)', () => {
  const style = html.match(/<!-- EDIT: Lesson styles -->\s*<style>([\s\S]*?)<\/style>/)[1];
  // Selectors that style the canonical header/footer/nav/theme control must not
  // appear in lesson CSS — a stray `.theme-toggle{...}` once inflated the toggle.
  const chrome = [
    '.theme-toggle', '.theme-control', '.theme-icon', '.brand',
    '.header-actions', '.site-header', '.desktop-nav', '.mobile-menu-btn',
    '.footer-grid', '.footer-bottom', '.lesson-sitebar'
  ];
  const offenders = chrome.filter(sel => style.includes(sel));
  assert.deepEqual(offenders, [], 'lesson CSS restyles chrome: ' + offenders.join(', '));
  // bare `.footer{` / `.site{` / `.wrap{` (canonical footer uses these) too
  assert.ok(!/(^|[\s,}])\.footer\s*\{/.test(style), 'lesson CSS must not style .footer');
  assert.ok(!/(^|[\s,}])\.site\s*\{/.test(style), 'lesson CSS must not style .site');
});

test('Statistics Implementation content: Excel functions + Minitab menu path', () => {
  assert.ok(html.includes('Stat → Quality Tools → Gage Study'), 'Minitab menu path present');
  assert.ok(/Excel Function Table|Excel function or formula/.test(html), 'Excel function table present');
  assert.ok(html.includes('AVERAGEIFS'), 'a concrete Excel function is documented');
});

test('registered in the lessons catalog as a plain literal entry', () => {
  assert.ok(library.includes("marker: 'data-gauge-rr-study'"));
  assert.ok(library.includes("path: '/lessons/quality-engineering/gauge-rr-study'"));
  assert.ok(library.includes("sectionId: 'quality-engineering'"));
});

test('canonical quiz grader dispatches upskill-quiz-result with the correct score', () => {
  // Pull the real quiz <section> and the real grader <script> out of the file so
  // the test tracks the shipped code rather than a copy.
  const quiz = html.match(/<section class="quiz-section"[\s\S]*?<\/section>/)[0];
  const graderMatch = html.match(/<script>\s*\(function \(\) \{\s*'use strict';\s*var form = document\.getElementById\('quiz-form'\)[\s\S]*?<\/script>/);
  assert.ok(graderMatch, 'canonical grader script found');
  const grader = graderMatch[0].replace(/^<script>/, '').replace(/<\/script>$/, '');

  const dom = new JSDOM(
    '<!DOCTYPE html><html><body>' + quiz + '</body></html>',
    { runScripts: 'outside-only' }
  );
  const { window } = dom;
  try {
    const doc = window.document;
    // answer every question correctly (data-answer on each fieldset)
    doc.querySelectorAll('.quiz-question').forEach((q, i) => {
      const ans = q.getAttribute('data-answer');
      const input = q.querySelector('input[value="' + ans + '"]');
      input.checked = true;
    });
    let received = null;
    doc.addEventListener('upskill-quiz-result', (e) => { received = e.detail; });
    // execute the shipped grader against this DOM, then click submit
    window.eval(grader);
    doc.getElementById('quiz-submit').click();

    assert.ok(received, 'upskill-quiz-result fired');
    assert.equal(received.total, 5);
    assert.equal(received.score, 5);
    assert.equal(doc.querySelectorAll('.quiz-question.is-correct').length, 5);
    // a wrong answer must be reflected too
    const q1 = doc.querySelector('.quiz-question');
    q1.querySelector('input:checked').checked = false;
    q1.querySelector('input[value="a"]').checked = true; // q1 answer is b
    doc.getElementById('quiz-submit').click();
    assert.equal(received.score, 4);
    assert.equal(q1.classList.contains('is-incorrect'), true);
  } finally {
    window.close();
  }
});

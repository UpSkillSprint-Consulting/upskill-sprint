'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON = 'lessons/lean-six-sigma/littles-law-interactive-flow-lab.html';
const html = fs.readFileSync(path.join(ROOT, LESSON), 'utf8');
const guide = fs.readFileSync(path.join(ROOT, 'docs', 'LESSON_CREATION_GUIDE.md'), 'utf8');
const catalog = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

test.after(() => dom.window.close());

test('Little’s Law lesson carries valid metadata and canonical site integration', () => {
  assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(meta.slug, 'littles-law-interactive-flow-lab');
  assert.equal(meta.title, doc.title);
  assert.equal(meta.title, doc.querySelector('#lesson-content h1').textContent);
  assert.equal(meta.category_slug, 'lean-six-sigma');
  assert.equal(meta.level, 'Intermediate');
  assert.equal(meta.lesson_type, 'General');
  assert.equal(meta.suggested_github_path, LESSON);
  assert(meta.search_keywords.length >= 5);
  assert(meta.search_keywords.every(keyword => keyword === keyword.toLowerCase()));
  assert.equal(doc.body.dataset.lessonPage, 'true');
  assert.equal(doc.body.dataset.category, 'lean-six-sigma');
  assert.equal(doc.body.dataset.level, 'intermediate');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert.equal(doc.body.dataset.lessonType, 'general');
  assert.equal(doc.querySelectorAll('main#lesson-content').length, 1);
  assert(!doc.querySelector('#lesson-progress-widget'));
});

test('Little’s Law lesson uses exact protected chrome and required root-relative assets', () => {
  const header = guide.split('### 4.1 Header')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  const footer = guide.split('### 4.2 Footer')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  assert.equal(html.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>/)[0].trim(), header.trim());
  assert.equal(html.match(/<footer class="site">[\s\S]*?<\/footer>/)[0].trim(), footer.trim());
  for (const tag of [
    '<link rel="stylesheet" href="/style.css">',
    '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>',
    '<script src="/site-sections.js"></script>'
  ]) assert.equal(html.split(tag).length - 1, 1, tag);
  assert.equal(doc.querySelector('[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#lean-six-sigma');
});

test('lesson is a continuous teaching journey and preserves every interactive, example, challenge, and reference', () => {
  assert.deepEqual(
    [...doc.querySelectorAll('#llLesson .ll-toc a')].map(link => link.getAttribute('href')),
    ['#what-is-littles-law', '#see-the-flow', '#lean-application', '#queueing-theory', '#applications', '#guided-practice', '#history-and-references', '#quiz']
  );
  assert.equal(doc.querySelectorAll('#llLesson .ll-tab').length, 0);
  assert.deepEqual(
    [...doc.querySelectorAll('#llLesson .ll-panel')].map(panel => panel.dataset.panel),
    [undefined, 'flow', 'lean', 'queue', undefined, 'quiz', 'refs']
  );
  for (const section of doc.querySelectorAll('#llLesson .ll-panel')) {
    const headingId = section.getAttribute('aria-labelledby');
    assert(headingId, section.id);
    assert(section.querySelector('#' + headingId), section.id);
  }
  assert.doesNotMatch(html, /\.ll-panel\s*\{\s*display\s*:\s*none/i);
  assert.doesNotMatch(html, /data-tab|aria-selected/);
  assert.equal(doc.querySelectorAll('#llLesson [data-quiz]').length, 3);
  assert.equal(doc.querySelectorAll('#llLesson .quizOpt').length, 9);
  assert.equal(doc.querySelectorAll('#llLesson .stage').length, 4);
  assert.match(doc.querySelector('#llLesson').textContent, /What is Little’s Law\?/);
  assert.match(doc.querySelector('#llLesson').textContent, /The law does not predict the journey of one particular item/);
  assert.match(doc.querySelector('#llLesson').textContent, /L, λ, and W must describe the same items, boundary, and observation period/);
  assert.match(doc.querySelector('#llLesson').textContent, /Each moving P is one part/);
  assert.match(doc.querySelector('#llLesson').textContent, /WIP = Throughput × Flow Time/);
  assert.match(doc.querySelector('#llLesson').textContent, /The orange numbered tiles picture the average work/);
  assert.match(doc.querySelector('#llLesson').textContent, /Important: the extra formulas here are M\/M\/1 formulas, not Little’s Law/);
  assert.match(doc.querySelector('#llLesson').textContent, /The purple dots approximate average queue length Lq/);
  assert.match(doc.querySelector('#llLesson').textContent, /One law, many kinds of flow/);
  assert.match(doc.querySelector('#llLesson').textContent, /Three exam traps to remember/);
  assert.match(doc.querySelector('#llLesson').textContent, /Stuff in the system = Stuff per unit time × Time in the system/);
  const references = [...doc.querySelectorAll('#llLesson [data-panel="refs"] ol li')];
  assert.equal(references.length, 4);
  assert.equal(
    doc.querySelector('#llLesson a[href="https://docs.pcalc.org/articles/littles-law-history/"]').textContent,
    'A Deep Dive into Little’s Law'
  );
});

test('interactive flow, Lean, queue, and original challenge controls update correctly', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  const lessonMarkup = doc.querySelector('#lesson-content').outerHTML;
  const runtime = new JSDOM('<!DOCTYPE html><html><body>' + lessonMarkup + '</body></html>', {
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  try {
    runtime.window.matchMedia = () => ({ matches: true });
    runtime.window.eval(scripts[0]);
    const page = runtime.window.document;
    assert.equal(page.getElementById('lOut').textContent, '3.00');
    page.getElementById('lambda').value = '24';
    page.getElementById('lambda').dispatchEvent(new runtime.window.Event('input'));
    assert.equal(page.getElementById('lOut').textContent, '6.00');

    page.getElementById('leanWip').value = '12';
    page.getElementById('leanWip').dispatchEvent(new runtime.window.Event('input'));
    assert.equal(page.getElementById('leanCt').textContent, '1.50 h');

    page.getElementById('qLambda').value = '14';
    page.getElementById('qMu').value = '14';
    page.getElementById('qLambda').dispatchEvent(new runtime.window.Event('input'));
    assert.equal(page.getElementById('qL').textContent, 'Unbounded');

    page.querySelector('[data-quiz="q2"] .quizOpt[data-correct="true"]').click();
    assert.match(page.querySelector('[data-quiz="q2"] .quizFeedback').textContent, /^Correct\./);
  } finally {
    runtime.window.close();
  }
});

test('canonical comprehension quiz grades four questions and dispatches progress event', () => {
  const quiz = html.match(/<section class="quiz-section"[\s\S]*?<\/section>/)[0];
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  assert.equal(doc.querySelectorAll('#quiz .quiz-question').length, 4);
  assert.equal(
    html.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0],
    guide.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0]
  );
  const runtime = new JSDOM('<!DOCTYPE html><html><body>' + quiz + '</body></html>', { runScripts: 'outside-only' });
  try {
    const page = runtime.window.document;
    page.querySelectorAll('.quiz-question').forEach(question => {
      question.querySelector('input[value="' + question.dataset.answer + '"]').checked = true;
    });
    let result = null;
    page.addEventListener('upskill-quiz-result', event => { result = event.detail; });
    runtime.window.eval(scripts[1]);
    page.getElementById('quiz-submit').click();
    assert.deepEqual({ score: result.score, total: result.total }, { score: 4, total: 4 });
    assert.equal(page.querySelectorAll('.quiz-question.is-correct').length, 4);
  } finally {
    runtime.window.close();
  }
});

test('lesson CSS is isolated, namespaced, and provides final dark-mode overrides', () => {
  const ownStyles = [
    doc.querySelector('#littles-law-style'),
    doc.querySelector('#littles-law-dark-overrides')
  ];
  const shared = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8') + fs.readFileSync(path.join(ROOT, 'lessons-theme.css'), 'utf8');
  const sharedNames = new Set([...shared.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]));
  for (const style of ownStyles) {
    assert(style);
    for (const match of style.textContent.matchAll(/(--[\w-]+)\s*:/g)) {
      assert(match[1].startsWith('--lesson-littles-'), match[1]);
      assert(!sharedNames.has(match[1]), match[1]);
    }
    assert.doesNotMatch(style.textContent, /(^|[},\s])(header|footer|\.site|\.brand|\.footer-grid|\.desktop-nav)\s*[{,]/m);
  }
  assert.doesNotMatch(html, /--viz-|var\(--viz-/);
  assert(html.lastIndexOf('id="littles-law-dark-overrides"') > html.lastIndexOf('</script>'));
});

test('Little’s Law lesson is registered once in the plain catalog', () => {
  assert.equal(catalog.split("marker: 'data-littles-law-interactive-flow-lab'").length - 1, 1);
  assert.equal(catalog.split("path: '/lessons/lean-six-sigma/littles-law-interactive-flow-lab'").length - 1, 1);
  assert(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.doesNotThrow(() => new Function(catalog));
});

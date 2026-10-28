'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

const LESSON = 'lessons/hypothesis-testing-for-beginners.html';
const html = fs.readFileSync(LESSON, 'utf8');
const guide = fs.readFileSync('docs/LESSON_CREATION_GUIDE.md', 'utf8');
const doc = new JSDOM(html).window.document; // parse only for structure checks
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);

// Pure statistics helpers, run in isolation (no DOM, no CDN).
function loadLogic() {
  const ctx = { Math };
  ctx.window = ctx;
  vm.runInNewContext(doc.getElementById('htb-logic').textContent, ctx);
  return ctx.HTBLogic;
}
const L = loadLogic();
const near = (a, b, tol = 5e-5) => assert(Math.abs(a - b) < tol, `${a} vs ${b}`);

test('metadata, head and SEO follow the lesson guide', () => {
  assert(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  assert.equal(meta.slug, 'hypothesis-testing-for-beginners');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.interactive, true);
  assert.equal(meta.suggested_github_path, LESSON);
  assert(meta.search_keywords.length >= 5 && meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.equal(doc.title, 'Hypothesis Testing for Beginners | UpSkill Sprint');
  assert(doc.title.length <= 65);
  const desc = doc.querySelector('meta[name="description"]').content;
  assert(desc.length >= 120 && desc.length <= 160, String(desc.length));
  assert.equal(doc.querySelector('meta[property="og:description"]').content, desc);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, 'https://upskillsprint.com/lessons/hypothesis-testing-for-beginners');
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const resource = ld['@graph'].find(n => n['@type'] === 'LearningResource');
  assert.equal(resource.description, desc);
  assert.equal(resource.educationalLevel, 'Beginner');
  for (const src of ['/theme.js', '/site-sections.js']) assert(html.includes('<script src="' + src + '"></script>'));
  assert(html.includes('<script defer src="/assets/js/math.js"></script>'));
  assert(!/MathJax\s*=|\$\$/.test(html), 'no page-level MathJax config or $ delimiters');
});

test('canonical chrome, single main/h1, body attributes and no hardcoded progress card', () => {
  const header = guide.split('### 4.1 Header')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  const footer = guide.split('### 4.2 Footer')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  assert.equal(html.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>/)[0].trim(), header.trim());
  assert.equal(html.match(/<footer class="site">[\s\S]*?<\/footer>/)[0].trim(), footer.trim());
  assert(!doc.querySelector('.skip-link'));
  assert.equal(doc.querySelectorAll('main').length, 1);
  assert.equal(doc.querySelectorAll('main#lesson-content h1').length, 1);
  assert.equal(doc.querySelector('h1').textContent, meta.title);
  assert.equal(doc.body.dataset.lessonPage, 'true');
  assert.equal(doc.body.dataset.category, 'statistics');
  assert.equal(doc.body.dataset.level, 'beginner');
  assert(!doc.querySelector('#lesson-progress-widget'));
  assert.equal(doc.querySelector('[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#statistics');
  let prev = 1;
  for (const h of doc.querySelectorAll('main h1, main h2, main h3, main h4')) {
    const level = +h.tagName[1];
    assert(level <= prev + 1, 'heading level skipped at ' + h.textContent);
    prev = level;
  }
  const ids = [...doc.querySelectorAll('[id]')].map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const a of doc.querySelectorAll('a[href^="#"]')) assert(doc.getElementById(a.getAttribute('href').slice(1)), a.href);
});

test('covers the requested basics: null, alternative, alpha, beta, power, Type I and II errors', () => {
  const text = doc.getElementById('lesson-content').textContent;
  for (const phrase of ['null hypothesis', 'alternative hypothesis', 'significance level', 'Type I error', 'Type II error', 'power', 'fail to reject']) {
    assert(text.includes(phrase), phrase);
  }
  for (const id of ['htb-hypotheses', 'htb-alpha', 'htb-errors', 'htb-power', 'htb-real-world']) assert(doc.getElementById(id), id);
});

test('Statistics Implementation has the four required parts in order', () => {
  const sec = doc.getElementById('statistics-implementation');
  assert.equal(sec.querySelector('h2').textContent, 'Statistics Implementation');
  assert.deepEqual([...sec.querySelectorAll('h3')].map(h => h.textContent), ['Excel Functions', 'Excel Use Cases', 'Minitab Navigation', 'Exam Tips']);
  const fnTable = sec.querySelector('table');
  assert.deepEqual([...fnTable.querySelectorAll('thead th')].map(t => t.textContent), ['Function', 'Syntax', 'Purpose', 'When to use it']);
  for (const fn of ['BINOM.DIST', 'BINOM.DIST.RANGE', 'BINOM.INV', 'NORM.S.INV', 'NORM.S.DIST']) assert(fnTable.textContent.includes(fn), fn);
  for (const path of ['Calc → Probability Distributions → Binomial', 'Stat → Power and Sample Size → 1 Proportion', 'Graph → Probability Distribution Plot → View Probability']) {
    assert(sec.textContent.includes(path), path);
  }
});

test('every quoted number matches the exact binomial calculation', () => {
  const n = 20;
  near(L.atLeast(12, n, 0.5), 0.2517);
  near(L.atLeast(13, n, 0.5), 0.1316);
  near(L.atLeast(14, n, 0.5), 0.0577);
  near(L.atLeast(15, n, 0.5), 0.0207);
  near(L.atLeast(16, n, 0.5), 0.0059);
  near(L.atLeast(17, n, 0.5), 0.0013);
  near(L.pmf(16, n, 0.5), 0.0046);
  assert.equal(L.criticalValue(n, 0.5, 0.05), 15);
  const r = L.errorRates(n, 0.5, 0.75, 0.05);
  near(r.alpha, 0.0207); near(r.power, 0.6172); near(r.beta, 0.3828);
  near(L.errorRates(50, 0.5, 0.75, 0.05).power, 0.9713);
  const text = doc.getElementById('lesson-content').textContent;
  for (const v of ['0.2517', '0.1316', '0.0577', '0.0207', '0.0059', '0.0013', '0.0046', '0.6172', '0.3828', '0.9941']) assert(text.includes(v), v);
});

test('widget logic: distributions, critical values, decisions and error classification', () => {
  for (const n of [10, 20, 50, 100]) {
    const d = L.dist(n, 0.5);
    near(d.reduce((a, b) => a + b, 0), 1, 1e-9);
    for (const alpha of [0.1, 0.05, 0.01]) {
      const c = L.criticalValue(n, 0.5, alpha);
      assert(L.atLeast(c, n, 0.5) <= alpha + 1e-12, 'rule never exceeds alpha');
      assert(L.atLeast(c - 1, n, 0.5) > alpha, 'cut-off is the smallest such count');
    }
  }
  // More data, bigger effect and larger alpha all raise power.
  assert(L.errorRates(50, 0.5, 0.75, 0.05).power > L.errorRates(20, 0.5, 0.75, 0.05).power);
  assert(L.errorRates(20, 0.5, 0.9, 0.05).power > L.errorRates(20, 0.5, 0.6, 0.05).power);
  assert(L.errorRates(20, 0.5, 0.75, 0.1).power > L.errorRates(20, 0.5, 0.75, 0.01).power);
  assert.equal(L.decide(0.0059, 0.05), 'reject');
  assert.equal(L.decide(0.05, 0.05), 'reject');
  assert.equal(L.decide(0.1316, 0.05), 'keep');
  assert.equal(L.classify(true, true), 'type1');
  assert.equal(L.classify(false, false), 'type2');
  assert.equal(L.classify(true, false), 'correct-reject');
  assert.equal(L.classify(false, true), 'correct-keep');
  let i = 0; const seq = [0.1, 0.9, 0.4, 0.6];
  assert.deepEqual([...L.flipCoins(4, 0.5, () => seq[i++])], ['H', 'T', 'H', 'T']);
  assert.equal(L.fmt(0.00591), '0.0059');
  assert.equal(L.fmt(0.00001), '< 0.0001');
});

test('interactives render and respond in a browser-like page', async () => {
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://upskillsprint.com/lessons/hypothesis-testing-for-beginners' });
  const { window } = dom;
  try {
    window.matchMedia = () => ({ matches: true });
    if (window.document.readyState !== 'complete') await new Promise(r => window.addEventListener('load', r));
    for (const id of ['htb-logic', 'htb-ui']) window.eval(window.document.getElementById(id).textContent);
    const d = window.document;
    assert(d.querySelectorAll('#htb-alpha-chart rect').length > 10);
    assert.match(d.getElementById('htb-alpha-verdict').textContent, /reject the null/);
    assert.equal(d.getElementById('htb-alpha-cut').textContent, '15+ heads');
    const slider = d.getElementById('htb-alpha-heads');
    slider.value = '13'; slider.dispatchEvent(new window.Event('input'));
    assert.match(d.getElementById('htb-alpha-verdict').textContent, /fail to reject the null/);
    assert.equal(d.getElementById('htb-pow-power').textContent, '0.6172');
    const n = d.getElementById('htb-pow-n'); n.value = '50'; n.dispatchEvent(new window.Event('input'));
    assert.equal(d.getElementById('htb-pow-power').textContent, '0.9713');
    d.getElementById('htb-flip-rest').click();
    assert.equal(d.getElementById('htb-coin-count').textContent, '1');
    assert.equal(d.querySelectorAll('#htb-flips li').length, 20);
    d.getElementById('htb-game-flip').click();
    assert.equal(d.getElementById('htb-game-rigged').disabled, false);
    d.getElementById('htb-game-rigged').click();
    assert.equal(d.getElementById('htb-score-rounds').textContent, '1');
    assert.equal(d.querySelectorAll('#htb-sort-list li').length, 6);
    d.querySelector('input[name="htb-truth-ctx"][value="pipe"]').click();
    assert.match(d.getElementById('htb-cell-22').textContent, /cracked pipe/);
    for (const svg of d.querySelectorAll('#lesson-content svg[role="img"]')) assert(svg.getAttribute('aria-label'));
  } finally { window.close(); }
});

test('quiz uses the canonical markup, styles and grader and reports results', async () => {
  assert.equal(html.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0], guide.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0]);
  const grader = guide.split('### 7.3 Quiz grader')[1].match(/```html\n([\s\S]*?)\n```/)[1].trim();
  assert(html.includes(grader));
  const qs = doc.querySelectorAll('#quiz .quiz-question');
  assert(qs.length >= 4);
  for (const q of qs) {
    assert(q.dataset.explanation);
    assert(q.querySelector('input[value="' + q.dataset.answer + '"]'));
  }
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const { window } = dom;
  try {
    const scripts = [...window.document.querySelectorAll('script:not([src]):not([type])')];
    window.eval(scripts.at(-1).textContent);
    const results = [];
    window.document.addEventListener('upskill-quiz-result', e => results.push(e.detail));
    const btn = window.document.getElementById('quiz-submit');
    btn.click();
    for (const q of window.document.querySelectorAll('.quiz-question')) {
      const wrong = [...q.querySelectorAll('input')].find(i => i.value !== q.dataset.answer); wrong.checked = true;
    }
    btn.click();
    for (const q of window.document.querySelectorAll('.quiz-question')) q.querySelector('input[value="' + q.dataset.answer + '"]').checked = true;
    btn.click();
    assert.deepEqual(results.map(r => r.score), [0, 0, qs.length]);
    assert(results.every(r => r.total === qs.length));
  } finally { window.close(); }
});

test('CSS is namespaced and scoped to the lesson; dark overrides come last', () => {
  const own = [...doc.querySelectorAll('#htb-style, #htb-dark-overrides')];
  assert.equal(own.length, 2);
  const shared = fs.readFileSync('style.css', 'utf8') + fs.readFileSync('lessons-theme.css', 'utf8');
  const sharedNames = new Set([...shared.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
  for (const style of own) {
    const css = style.textContent.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) {
      assert(m[1].startsWith('--lesson-htb-'), m[1]);
      assert(!sharedNames.has(m[1]), m[1]);
    }
    for (const rule of css.replace(/@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, '').matchAll(/([^{}@]+)\{[^{}]*\}/g)) {
      for (const sel of rule[1].split(',')) {
        const s = sel.trim();
        if (!s || /^(from|to|\d+%)$/.test(s)) continue;
        assert(/#lesson-content|\.quiz-section|Return to lesson category/.test(s), s);
      }
    }
  }
  assert(html.lastIndexOf('id="htb-dark-overrides"') > html.lastIndexOf('</script>'));
});

test('catalog card, start-here link and related lessons resolve', () => {
  const catalog = fs.readFileSync('lessons.html', 'utf8');
  const card = catalog.match(/<a class="lesson-row" href="lessons\/hypothesis-testing-for-beginners\.html"[^>]*>/)[0];
  assert.match(card, /data-level="beginner"/);
  assert.match(card, /data-topic="statistics"/);
  for (const a of doc.querySelectorAll('.related-lessons a')) {
    const p = a.getAttribute('href');
    assert(fs.existsSync(p.slice(1) + '.html'), p);
  }
  assert(doc.querySelectorAll('.related-lessons li').length >= 3 && doc.querySelectorAll('.related-lessons li').length <= 5);
  for (const t of doc.querySelectorAll('.htb-table-scroll')) {
    assert.equal(t.getAttribute('tabindex'), '0');
    assert.equal(t.getAttribute('role'), 'region');
    assert(t.getAttribute('aria-label'));
  }
});

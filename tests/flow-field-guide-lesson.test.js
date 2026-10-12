'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const slug = 'the-flow-a-field-guide-to-lean';
const lessonPath = `/lessons/lean-six-sigma/${slug}`;
const title = 'The Flow: A Field Guide to Lean';
const html = fs.readFileSync(path.join(root, 'lessons/lean-six-sigma', `${slug}.html`), 'utf8');
const assets = path.join(root, 'assets/lessons', slug);
const d = new JSDOM(html).window.document;

function live() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const window = new JSDOM(html, { runScripts: 'dangerously', virtualConsole, url: `https://upskillsprint.com${lessonPath}` }).window;
  return { window, document: window.document, errors };
}

test('metadata block, head tags and canonical chrome follow the lesson guide', () => {
  assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\n([\s\S]*?)\n-->/)[1]);
  assert.equal(meta.title, title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.category, 'Lean Six Sigma');
  assert.equal(meta.category_slug, 'lean-six-sigma');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, `lessons/lean-six-sigma/${slug}.html`);
  assert.ok(meta.search_keywords.length >= 5);

  const pageTitle = d.querySelector('title').textContent;
  assert.equal(pageTitle, `${title} | UpSkill Sprint`);
  assert.ok(pageTitle.length <= 65);
  const description = d.querySelector('meta[name="description"]').content;
  assert.ok(description.length <= 165);
  assert.equal(d.querySelector('link[rel="canonical"]').href, `https://upskillsprint.com${lessonPath}`);
  assert.equal(d.querySelector('meta[property="og:url"]').content, `https://upskillsprint.com${lessonPath}`);
  assert.equal(d.querySelector('meta[property="og:title"]').content, pageTitle);
  assert.equal(d.querySelector('meta[property="og:description"]').content, description);
  assert.ok(html.includes('<script defer src="/assets/js/math.js"></script>'));
  assert.ok(!/MathJax\s*=/.test(html), 'math uses only the shared include');

  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  for (const section of ['### 4.1 Header', '### 4.2 Footer', '### 7.1 Quiz styles', '### 7.3 Quiz grader']) {
    const block = guide.slice(guide.indexOf(section)).match(/```html\n([\s\S]*?)\n```/)[1];
    assert.ok(html.includes(block), `must use exact ${section}`);
  }
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">', '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>']) assert.ok(html.includes(tag));
  assert.equal(d.querySelectorAll('main').length, 1);
  assert.equal(d.querySelectorAll('h1').length, 1);
  assert.equal(d.querySelector('main#lesson-content h1').textContent, title);
  assert.ok(d.querySelector('a[href="/lessons#lean-six-sigma"]'));
  assert.ok(!html.includes('lesson-progress-widget'), 'progress card is injected at runtime, never hardcoded');
  assert.ok(/<style id="the-flow-a-field-guide-to-lean-dark-overrides">[\s\S]*<\/style>\n<\/body>/.test(html), 'dark override block is last');
  assert.ok(!/--(navy|primary|background|surface|text)\s*:/.test(html), 'no generic custom properties');
});

test('catalog entry and public access SQL are registered', () => {
  const lib = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  const start = lib.indexOf("marker: 'data-the-flow-a-field-guide-to-lean'");
  assert.ok(start > 0);
  const entry = lib.slice(start, lib.indexOf('}', start));
  assert.match(entry, new RegExp(`path: '${lessonPath}'`));
  assert.match(entry, /sectionId: 'lean-six-sigma'/);
  assert.match(entry, /topic: 'lean-six-sigma'/);
  assert.match(entry, /level: 'beginner'/);
  assert.match(entry, /<span>90 min<\/span>/);
  const sql = fs.readFileSync(path.join(root, 'supabase/public-flow-field-guide-access.sql'), 'utf8');
  assert.match(sql, new RegExp(`'lesson:${lessonPath}', 'public'`));
  assert.ok(!/\b(create|alter|drop|grant)\b/i.test(sql));
});

test('all 518 terms are in the page, with 152 worked examples and unique ids', () => {
  const cards = [...d.querySelectorAll('#guideOut .spec')];
  assert.equal(cards.length, 518);
  const ids = cards.map(card => card.querySelector('h4').id);
  assert.equal(new Set(ids).size, 518);
  const core = cards.filter(card => card.dataset.tier === 'core');
  assert.equal(core.length, 152);
  for (const card of cards) {
    assert.ok(['f', 'q', 'b'].includes(card.dataset.family));
    assert.ok(card.querySelector('p').textContent.trim().length > 20, card.querySelector('h4').textContent);
  }
  for (const card of core) assert.ok(card.querySelector('details .exbox').textContent.trim().length > 35);
  assert.equal(cards.filter(card => card.dataset.jp === '1').length, 85);
  assert.deepEqual([...d.querySelectorAll('#guideOut .catblock h3')].map(h => h.id), [
    'flow-category-principles', 'flow-category-waste', 'flow-category-workplace', 'flow-category-flow',
    'flow-category-pull', 'flow-category-quality', 'flow-category-problem', 'flow-category-equipment',
    'flow-category-daily', 'flow-category-strategy', 'flow-category-people', 'flow-category-supply',
    'flow-category-systems', 'flow-category-history']);
  assert.match(d.querySelector('#flow-term-takt-time + p').textContent, /customer demand/);
  assert.match(d.querySelector('#flow-term-kanban-sizing').closest('article').textContent, /\\frac\{400 \\times 1\.5 \\times 1\.2\}\{50\} = 14\.4/);
  assert.match(d.querySelector('#guide h2').textContent, /518 lean terms/);
  for (const href of [...d.querySelectorAll('#lesson-content a[href^="#"]')].map(a => a.getAttribute('href'))) {
    assert.ok(d.getElementById(href.slice(1)), `in-page link ${href} has a target`);
  }
});

test('both posters and their previews exist and are linked for download', () => {
  for (const name of ['50-lean-tools-poster.pdf', '50-japanese-lean-terms-poster.pdf']) {
    const bytes = fs.readFileSync(path.join(assets, name));
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    assert.ok(bytes.length > 100_000 && bytes.length < 10_000_000);
    assert.equal((bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length, 1, `${name} is one page`);
    assert.ok(d.querySelector(`a[download][href="/assets/lessons/${slug}/${name}"]`));
  }
  for (let n = 1; n <= 2; n++) {
    const size = fs.statSync(path.join(assets, `poster-preview-${n}.jpg`)).size;
    assert.ok(size > 30_000 && size < 500_000);
    const img = d.querySelector(`img[src="/assets/lessons/${slug}/poster-preview-${n}.jpg"]`);
    assert.ok(img && img.alt.length > 20 && img.getAttribute('width') && img.getAttribute('height'));
  }
});

test('the experiments, filters and scenario game work without page errors', () => {
  const { window, document, errors } = live();
  const $ = sel => document.querySelector(sel);
  const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true }));

  assert.match($('#batchOut').textContent, /first pipe done at 25 min.*all 12 done at 36 min/);
  $('#batchR').value = '1'; fire($('#batchR'), 'input');
  assert.match($('#batchOut').textContent, /first pipe done at 3 min.*all 12 done at 14 min/);
  assert.ok($('#batchChart svg') && $('#queueChart svg'));

  assert.match($('#littleOut').textContent, /3\.00 days/);
  $('#wipR').value = '600'; fire($('#wipR'), 'input');
  assert.match($('#littleOut').textContent, /1\.50 days/);

  assert.match($('#yamaOut').textContent, /3\.00 min/);
  assert.match($('#yamaOut').textContent, /Over takt: Station 3/);
  $('#yamaBalance').click();
  assert.match($('#yamaOut').textContent, /Every station is under takt/);
  $('#yamaReset').click();
  assert.match($('#yamaOut').textContent, /Over takt/);

  assert.match($('#oeeOut').textContent, /= 74\.2%/);

  assert.match($('#smedOut').textContent, /240 min of 240/);
  for (const box of document.querySelectorAll('#smedList input')) box.checked = box.dataset.must === 'external';
  fire($('#smedList'), 'change');
  assert.match($('#smedOut').textContent, /115 min of 240/);
  document.querySelector('#smedList input[data-must="internal"]').checked = true;
  fire($('#smedList'), 'change');
  assert.match($('#smedOut').textContent, /Check again/);

  assert.match($('#pullOut').textContent, /Push \(forecast 115\/day\)/);
  $('#pullBtn').click();
  assert.ok($('#pullChart svg'));

  for (const item of document.querySelectorAll('#wasteWalk .ww-item')) item.querySelector('select').value = item.dataset.answer;
  $('#wasteCheck').click();
  assert.match($('#wasteOut').textContent, /You matched 8 of 8/);

  $('#revealOhno').click();
  assert.equal($('#revealOhno').getAttribute('aria-expanded'), 'true');

  assert.match($('#count').textContent, /Showing 518 of 518/);
  $('#q').value = 'heijunka'; fire($('#q'), 'input');
  const shown = [...document.querySelectorAll('#guideOut .spec:not([hidden])')].map(c => c.querySelector('h4').textContent);
  assert.ok(shown.includes('Heijunka') && shown.includes('Heijunka box'));
  $('#q').value = ''; fire($('#q'), 'input');
  document.querySelector('#tierChips [data-toggle="core"]').click();
  assert.match($('#count').textContent, /Showing 152 of 518/);
  document.querySelector('#tierChips [data-toggle="core"]').click();
  document.querySelector('#house button[data-jump="equipment"]').click();
  assert.ok(document.querySelector('#guideOut [data-cat-block="quality"]').hidden);
  assert.ok(!document.querySelector('#guideOut [data-cat-block="equipment"]').hidden);
  $('#catClear').click();
  assert.match($('#count').textContent, /Showing 518 of 518/);
  assert.match($('#famBar').getAttribute('aria-label'), /Flow \d+ terms/);

  // motion and hover layer: without requestAnimationFrame every animation lands on its end state
  $('#batchPlay').click();
  assert.match($('#batchChart svg').textContent, /12 of 12 shipped/);
  assert.equal(document.querySelectorAll('#batchChart .shipdot').length, 12);
  $('#utilR').value = '95'; fire($('#utilR'), 'input');
  assert.match($('#utilOut').textContent, /95% utilisation the average job waits 19\.0×/);
  assert.equal(document.querySelectorAll('#littleFlow circle').length, 12, 'one conveyor dot per 50 joints of WIP');
  assert.match($('#littleFlowNote').textContent, /1\.5 days to cross/);
  const seg = document.querySelector('#yamaChart rect.seg-rect');
  seg.dispatchEvent(new window.MouseEvent('pointermove', { bubbles: true }));
  const tip = document.querySelector('#yamaChart .flow-tip');
  assert.equal(tip.hidden, false);
  assert.match(tip.textContent, /Load · 0\.6 min/);
  const stencil = [...document.querySelectorAll('#yamaChart rect.seg-rect')][9];
  const x3 = stencil.getAttribute('x');
  $('#yamaBalance').click();
  assert.notEqual(stencil.getAttribute('x'), x3, 'the moved element slides to the next station');
  $('#yamaReset').click();
  assert.equal(stencil.getAttribute('x'), x3);
  const first = document.querySelector('#smedChart rect.smed-seg');
  for (const box of document.querySelectorAll('#smedList input')) box.checked = false;
  document.querySelector('#smedList input').checked = true;
  fire($('#smedList'), 'change');
  assert.equal(first.getAttribute('y'), '70', 'a ticked task drops to the "while running" row');
  assert.equal(document.querySelectorAll('#oeeChart .oee-bar').length, 4);
  $('#dayR').value = '1'; fire($('#dayR'), 'input');
  assert.match($('#dayOut').textContent, /^Day 1: demand \d+, push stock \d+, pull stock \d+\.$/);

  $('#qopts .opt').click();
  assert.ok($('#qnext:not([hidden])'));
  assert.match($('#qwhy').textContent, /Spot on/);

  assert.deepEqual(errors, []);
  window.close();
});

test('the comprehension quiz reports unanswered, wrong and perfect submissions', () => {
  const { window, document, errors } = live();
  const events = [];
  document.addEventListener('upskill-quiz-result', e => events.push({ score: e.detail.score, total: e.detail.total }));
  document.querySelector('#quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 0, total: 6 });
  assert.match(document.querySelector('#quiz-result').textContent, /6 unanswered/);
  const answers = ['b', 'c', 'b', 'b', 'a', 'c'];
  answers.forEach((v, i) => { document.querySelector(`#quiz-form input[name=q${i + 1}][value=${v === 'a' ? 'b' : 'a'}]`).checked = true; });
  document.querySelector('#quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 0, total: 6 });
  answers.forEach((v, i) => { document.querySelector(`#quiz-form input[name=q${i + 1}][value=${v}]`).checked = true; });
  document.querySelector('#quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 6, total: 6 });
  assert.match(document.querySelector('#quiz-result').textContent, /Score: 6 \/ 6/);
  assert.deepEqual(errors, []);
  window.close();
});

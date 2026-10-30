'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SLUG = 'dmaic-in-10-minutes';
const LESSON = `lessons/lean-six-sigma/${SLUG}.html`;
const URL_PATH = `/lessons/lean-six-sigma/${SLUG}`;
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const html = read(LESSON);
const guide = read('docs/LESSON_CREATION_GUIDE.md');
const doc = new JSDOM(html).window.document; // structure checks only, no scripts
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
const guideBlock = heading => guide.split(heading)[1].match(/```html\n([\s\S]*?)\n```/)[1].trim();

function liveLesson() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole, url: `https://upskillsprint.com${URL_PATH}` });
  return { window: dom.window, document: dom.window.document, errors };
}

test('metadata, head and SEO follow the lesson guide', () => {
  assert(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  assert.equal(meta.slug, SLUG);
  assert.equal(meta.title, 'DMAIC in 10 Minutes');
  assert.equal(meta.category_slug, 'lean-six-sigma');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.estimated_minutes, 10);
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, LESSON);
  assert(meta.search_keywords.length >= 5 && meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.equal(doc.title, 'DMAIC in 10 Minutes | UpSkill Sprint');
  assert(doc.title.length <= 65);
  const desc = doc.querySelector('meta[name="description"]').content;
  assert(desc.length >= 120 && desc.length <= 160, String(desc.length));
  assert.match(desc, /DMAIC/);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, desc);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  const canonical = `https://upskillsprint.com${URL_PATH}`;
  assert.equal(doc.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, 'https://upskillsprint.com/assets/logo-og.png');
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const resource = ld['@graph'].find(n => n['@type'] === 'LearningResource');
  assert.equal(resource.description, desc);
  assert.equal(resource.url, canonical);
  assert.equal(resource.educationalLevel, 'Beginner');
  for (const src of ['/theme.js', '/site-sections.js']) assert(html.includes(`<script src="${src}"></script>`));
  assert(html.indexOf('<link rel="stylesheet" href="/lessons-theme.css">') < html.indexOf('<style id="dmaic-style">'));
  // The opening paragraph uses the main search phrase.
  assert.match(doc.querySelector('.dm-lede').textContent, /DMAIC/);
});

test('canonical chrome, one main and h1, body attributes, no hardcoded progress card', () => {
  assert.equal(html.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>/)[0].trim(), guideBlock('### 4.1 Header'));
  assert.equal(html.match(/<footer class="site">[\s\S]*?<\/footer>/)[0].trim(), guideBlock('### 4.2 Footer'));
  assert(html.includes(guideBlock('### 7.1 Quiz styles')));
  assert(html.includes(guideBlock('### 7.3 Quiz grader')));
  assert(!doc.querySelector('.skip-link'));
  assert.equal(doc.querySelectorAll('main').length, 1);
  assert.equal(doc.querySelectorAll('main#lesson-content h1').length, 1);
  assert.equal(doc.querySelector('h1').textContent, meta.title);
  assert.equal(doc.body.dataset.lessonPage, 'true');
  assert.equal(doc.body.dataset.category, 'lean-six-sigma');
  assert.equal(doc.body.dataset.level, 'beginner');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert(!doc.querySelector('#lesson-progress-widget'));
  assert.equal(doc.querySelector('[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#lean-six-sigma');
  let prev = 1;
  for (const h of doc.querySelectorAll('main h1, main h2, main h3, main h4')) {
    const level = Number(h.tagName[1]);
    assert(level <= prev + 1, `heading level skipped at ${h.textContent}`);
    prev = level;
  }
  const ids = [...doc.querySelectorAll('[id]')].map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  // The dark-mode override block is the last style in the document.
  const styles = [...doc.querySelectorAll('style')];
  assert.equal(styles[styles.length - 1].id, 'dmaic-in-10-minutes-dark-overrides');
});

test('lesson-owned CSS is namespaced and never restyles site chrome', () => {
  const css = doc.getElementById('dmaic-style').textContent + doc.getElementById('dmaic-in-10-minutes-dark-overrides').textContent;
  const declared = [...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]);
  assert(declared.length > 10);
  for (const name of declared) assert(name.startsWith('--lesson-dmaic-'), name);
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^{}]*\}/g, '\n').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  for (const sel of selectors) {
    if (sel.startsWith('@media') || sel === '}') continue;
    assert.match(sel, /#lesson-content/, `selector not scoped to the lesson: ${sel}`);
  }
});

test('covers all five phases in order with their question, tools and output', () => {
  const ids = ['dm-define', 'dm-measure', 'dm-analyze', 'dm-improve', 'dm-control'];
  const roadmap = [...doc.querySelectorAll('.dm-road a')].map(a => a.getAttribute('href'));
  assert.deepEqual(roadmap, ids.map(id => `#${id}`));
  const names = ['Define', 'Measure', 'Analyze', 'Improve', 'Control'];
  ids.forEach((id, i) => {
    const sec = doc.getElementById(id);
    assert(sec, id);
    assert.match(sec.querySelector('h2').textContent, new RegExp(`^${names[i]}:`));
    assert(sec.querySelector('.dm-phase-q').textContent.trim().endsWith('?'));
    const facts = [...sec.querySelectorAll('.dm-fact h3')].map(h => h.textContent);
    assert.deepEqual(facts, ['Common tools', 'Phase output']);
    assert(sec.querySelector('.dm-example'), `${id} has the running example`);
  });
  const rows = [...doc.querySelectorAll('.dm-table tbody th[scope="row"]')].map(th => th.textContent);
  assert.deepEqual(rows, names);
  // The cheat-sheet table scrolls on phones and is reachable by keyboard.
  const wrap = doc.querySelector('.table-scroll');
  assert.equal(wrap.getAttribute('tabindex'), '0');
  assert.equal(wrap.getAttribute('role'), 'region');
  assert(wrap.getAttribute('aria-label'));
  // The roadmap collapses to one column on narrow screens.
  assert.match(doc.getElementById('dmaic-style').textContent, /@media \(max-width:760px\)\{\s*#lesson-content \.dm-road\{grid-template-columns:1fr\}/);
});

test('the running example keeps its numbers consistent across phases', () => {
  const text = id => doc.querySelector(`#${id} .dm-example`).textContent;
  assert.match(text('dm-define'), /about 6%/);
  assert.match(text('dm-define'), /2% or less/);
  assert.match(text('dm-measure'), /5\.8%/);
  assert.match(text('dm-improve'), /1\.6%/);
  assert.match(text('dm-control'), /1\.7%/);
  assert.match(doc.querySelector('#dm-roadmap .is-warn').textContent, /fictional/);
});

test('every internal link and in-page anchor resolves', () => {
  for (const a of doc.querySelectorAll('a[href^="#"]')) {
    assert(doc.getElementById(a.getAttribute('href').slice(1)), a.getAttribute('href'));
  }
  const lessonLinks = [...doc.querySelectorAll('#lesson-content a[href^="/lessons/"]')].map(a => a.getAttribute('href'));
  assert(lessonLinks.length >= 5);
  for (const href of lessonLinks) {
    assert(!href.endsWith('.html'), `extensionless: ${href}`);
    assert(fs.existsSync(path.join(ROOT, `${href.slice(1)}.html`)), `missing lesson: ${href}`);
  }
  const related = doc.querySelectorAll('.related-lessons li a');
  assert(related.length >= 3 && related.length <= 5);
});

test('registered in the Lean Six Sigma catalog, Coming soon removed, access SQL present', () => {
  const lib = read('chi-square-lesson-library.js');
  const entry = lib.match(/\{\s*marker: 'data-dmaic-in-10-minutes',[\s\S]*?\n {4}\}/);
  assert(entry, 'catalog entry');
  const e = entry[0];
  assert.match(e, /sectionId: 'lean-six-sigma'/);
  assert.match(e, /topic: 'lean-six-sigma'/);
  assert.match(e, new RegExp(`path: '${URL_PATH}'`));
  assert.match(e, /level: 'beginner'/);
  assert.match(e, /interactive: 'true'/);
  assert.match(e, /<span>10 min<\/span>/);
  assert.match(e, /title: 'DMAIC in 10 Minutes'/);
  assert(lib.includes("marker: 'data-beyond-the-bell',"), 'build insertion point intact');
  // First Lean Six Sigma catalog entry, so it shows in the category's first three rows.
  const firstLss = lib.match(/marker: '([^']+)',\s*sectionId: 'lean-six-sigma'/)[1];
  assert.equal(firstLss, 'data-dmaic-in-10-minutes');

  const lessons = read('lessons.html');
  const lss = lessons.match(/<section class="lesson-category" id="lean-six-sigma"[\s\S]*?<\/section>/)[0];
  assert(!/Coming soon/i.test(lss), 'no Coming soon card left in Lean Six Sigma');
  assert(!lessons.includes('DMAIC in 10 Minutes</strong>'));

  const sql = read('supabase/public-dmaic-in-10-minutes-access.sql');
  assert.match(sql, /'lesson:\/lessons\/lean-six-sigma\/dmaic-in-10-minutes', 'public', 'DMAIC in 10 Minutes', true, now\(\)/);
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert(!/\b(create|alter|drop|grant)\b/i.test(sql), 'data only, no schema changes');
});

test('the Which phase? sorter grades picks, locks each item, and resets', () => {
  const { window, document, errors } = liveLesson();
  const items = [...document.querySelectorAll('.dm-sort-item')];
  assert.equal(items.length, 6);
  const score = document.getElementById('dm-sort-score');
  assert.equal(score.textContent, '0 of 6 sorted');
  for (const it of items) {
    const buttons = [...it.querySelectorAll('.dm-choice')];
    assert.deepEqual(buttons.map(b => b.textContent), ['Define', 'Measure', 'Analyze', 'Improve', 'Control']);
    assert(buttons.every(b => b.getAttribute('type') === 'button' && b.getAttribute('aria-pressed') === 'false'));
  }
  // A wrong pick: marked wrong in text (not colour alone), names the right phase, locks the item.
  items[0].querySelector('[data-pick="control"]').click();
  assert(items[0].classList.contains('is-wrong'));
  assert.match(items[0].querySelector('.dm-sort-feedback').textContent, /Not quite\. This one belongs in Define/);
  assert.equal(items[0].querySelector('[data-pick="control"]').getAttribute('aria-pressed'), 'true');
  assert([...items[0].querySelectorAll('.dm-choice')].every(b => b.disabled));
  items[0].querySelector('[data-pick="define"]').click(); // locked: ignored
  assert(items[0].classList.contains('is-wrong'));
  assert.equal(score.textContent, '1 of 6 sorted');
  // The rest answered correctly.
  for (const it of items.slice(1)) it.querySelector(`[data-pick="${it.dataset.phase}"]`).click();
  assert(items.slice(1).every(it => it.classList.contains('is-right')));
  assert.match(items[1].querySelector('.dm-sort-feedback').textContent, /^✓ Correct/);
  assert.equal(score.textContent, 'All 6 sorted: 5 of 6 right first time.');
  // The answer key covers every phase and matches the lesson.
  assert.deepEqual(items.map(it => it.dataset.phase), ['define', 'measure', 'analyze', 'improve', 'control', 'measure']);
  document.getElementById('dm-sort-reset').click();
  assert.equal(score.textContent, '0 of 6 sorted');
  assert(document.querySelectorAll('.dm-sort-item.is-right, .dm-sort-item.is-wrong').length === 0);
  assert(document.querySelectorAll('.dm-choice:disabled').length === 0);
  assert.deepEqual(errors, []);
  window.close();
});

test('the quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', () => {
  const { window, document, errors } = liveLesson();
  const events = [];
  // Copy the detail out of the jsdom realm so deepStrictEqual compares plain objects.
  document.addEventListener('upskill-quiz-result', e => events.push({ score: e.detail.score, total: e.detail.total }));
  const submit = () => document.getElementById('quiz-submit').click();
  const questions = [...document.querySelectorAll('#quiz-form .quiz-question')];
  assert.equal(questions.length, 5);
  const answers = questions.map(q => q.dataset.answer);
  assert.deepEqual(answers, ['b', 'c', 'a', 'c', 'b']);
  for (const q of questions) assert(q.dataset.explanation.length > 40);

  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 5 });
  assert.match(document.getElementById('quiz-result').textContent, /5 unanswered/);

  answers.forEach((a, i) => {
    const wrong = [...questions[i].querySelectorAll('input')].find(r => r.value !== a);
    wrong.checked = true;
  });
  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 5 });
  assert.match(questions[0].querySelector('.quiz-feedback').textContent, /Not quite/);

  answers.forEach((a, i) => { questions[i].querySelector(`input[value="${a}"]`).checked = true; });
  submit();
  assert.deepEqual(events.pop(), { score: 5, total: 5 });
  assert.match(document.getElementById('quiz-result').textContent, /Score: 5 \/ 5/);
  assert.deepEqual(errors, []);
  window.close();
});

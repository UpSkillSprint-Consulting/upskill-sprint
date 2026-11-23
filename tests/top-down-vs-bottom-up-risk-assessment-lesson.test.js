'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SLUG = 'top-down-vs-bottom-up-risk-assessment';
const LESSON = `lessons/quality-engineering/${SLUG}.html`;
const URL_PATH = `/lessons/quality-engineering/${SLUG}`;
const ASSETS = `assets/lessons/${SLUG}/`;
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const html = read(LESSON);
const guide = read('docs/LESSON_CREATION_GUIDE.md');
const doc = new JSDOM(html).window.document; // structure checks only, no scripts
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
const guideBlock = heading => guide.split(heading)[1].match(/```html\n([\s\S]*?)\n```/)[1].trim();
const words = el => el.textContent.trim().split(/\s+/).filter(Boolean).length;

function liveLesson(hash = '') {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole, url: `https://upskillsprint.com${URL_PATH}${hash}` });
  return { window: dom.window, document: dom.window.document, errors };
}

test('metadata, head and SEO follow the lesson guide', () => {
  assert(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  assert.equal(meta.slug, SLUG);
  assert.equal(meta.title, 'Top-Down vs. Bottom-Up Risk Assessment');
  assert.equal(meta.category, 'Quality Engineering');
  assert.equal(meta.category_slug, 'quality-engineering');
  assert.equal(meta.level, 'Intermediate');
  assert.equal(meta.estimated_minutes, 25);
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, LESSON);
  assert(meta.search_keywords.length >= 5 && meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.equal(doc.title, 'Top-Down vs. Bottom-Up Risk Assessment | UpSkill Sprint');
  assert(doc.title.length <= 65);
  const desc = doc.querySelector('meta[name="description"]').content;
  assert(desc.length >= 120 && desc.length <= 160, String(desc.length));
  assert.match(desc, /top-down vs\. bottom-up risk assessment/i);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, desc);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  const canonical = `https://upskillsprint.com${URL_PATH}`;
  assert.equal(doc.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, 'https://upskillsprint.com/assets/logo-og.png');
  const teaser = doc.querySelector('meta[name="upskill:email-teaser"]').content;
  assert(teaser.length >= 40 && teaser.length <= 160 && !/[<>!]|https?:/.test(teaser), teaser);
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const resource = ld['@graph'].find(n => n['@type'] === 'LearningResource');
  assert.equal(resource.description, desc);
  assert.equal(resource.url, canonical);
  assert.equal(resource.educationalLevel, 'Intermediate');
  const crumbs = ld['@graph'].find(n => n['@type'] === 'BreadcrumbList').itemListElement;
  assert.equal(crumbs[2].item, canonical);
  for (const src of ['/theme.js', '/site-sections.js']) assert(html.includes(`<script src="${src}"></script>`));
  assert(html.includes('<script defer src="/assets/js/math.js"></script>'), 'shared math include');
  assert(!/window\.MathJax\s*=/.test(html), 'no per-page MathJax config');
  assert(html.indexOf('<link rel="stylesheet" href="/lessons-theme.css">') < html.indexOf('<style id="tdbu-style">'));
  // The opening paragraph uses the main search phrase.
  assert.match(doc.querySelector('.td-lede').textContent, /Top-down vs\. bottom-up risk assessment/i);
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
  assert.equal(doc.body.dataset.category, 'quality-engineering');
  assert.equal(doc.body.dataset.level, 'intermediate');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert(!doc.querySelector('#lesson-progress-widget'));
  assert.equal(doc.querySelector('[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#quality-engineering');
  let prev = 1;
  for (const h of doc.querySelectorAll('main h1, main h2, main h3, main h4')) {
    const level = Number(h.tagName[1]);
    assert(level <= prev + 1, `heading level skipped at ${h.textContent}`);
    prev = level;
  }
  const ids = [...doc.querySelectorAll('[id]')].map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  const styles = [...doc.querySelectorAll('style')];
  assert.equal(styles[styles.length - 1].id, `${SLUG}-dark-overrides`);
  for (const sc of doc.querySelectorAll('.td-table-scroll')) {
    assert.equal(sc.getAttribute('tabindex'), '0');
    assert.equal(sc.getAttribute('role'), 'region');
    assert(sc.getAttribute('aria-label'));
  }
  assert(!doc.querySelector('th:empty'), 'no empty table headers');
});

test('lesson-owned CSS is namespaced and never restyles site chrome', () => {
  const css = doc.getElementById('tdbu-style').textContent + doc.getElementById(`${SLUG}-dark-overrides`).textContent;
  const declared = [...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]);
  assert(declared.length > 20);
  for (const name of declared) assert(name.startsWith('--lesson-tdbu-'), name);
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const selectors = stripped.replace(/\{[^{}]*\}/g, '\n').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  const allowed = ['.quiz-section .lesson-kicker', '[aria-label="Return to lesson category"] a']; // §7.1 and §8 dark fixes
  for (const sel of selectors) {
    if (sel.startsWith('@media') || sel === '}') continue;
    if (allowed.some(a => sel.endsWith(a))) continue;
    assert.match(sel, /#lesson-content/, `selector not scoped to the lesson: ${sel}`);
  }
  // Every SVG takes its colours from classes, never hard-coded fills, so both themes work.
  for (const svg of doc.querySelectorAll('#lesson-content svg')) assert(!/fill="#|stroke="#/.test(svg.outerHTML));
});

test('visual-first: poster infographic, tool groups, timing split, ISO map and warning poster', () => {
  // Hero poster: three bold direction blocks in order.
  const blocks = [...doc.querySelectorAll('.td-hero .td-poster .td-block')];
  assert.deepEqual(blocks.map(b => b.querySelector('.td-big').textContent), ['Top-down', 'Middle-out', 'Bottom-up']);
  for (const b of blocks) assert(words(b.querySelector('p')) <= 12, 'poster lines stay short');
  assert.equal(doc.querySelector('.td-poster').getAttribute('role'), 'img');
  // Nine tools in three direction groups, each with a timing chip in words.
  const groups = [...doc.querySelectorAll('#td-tools .td-group')];
  assert.deepEqual(groups.map(g => g.querySelector('h3').textContent), ['Top-down', 'Middle-out', 'Bottom-up']);
  assert.deepEqual(groups.map(g => g.querySelectorAll('.td-card').length), [2, 2, 5]);
  assert.match(doc.getElementById('td-tools-h').textContent, /Meet the 9 tools/);
  const tools = [...doc.querySelectorAll('.td-card h4')].map(h => h.textContent);
  for (const name of ['Fault tree analysis (FTA)', 'RCA: 5-Why · Fishbone', 'Bow-tie', 'HAZOP', 'FMEA / FMECA', 'HACCP', 'PHA', 'HAZID', 'What-If / SWIFT']) assert(tools.includes(name), name);
  for (const card of doc.querySelectorAll('.td-card')) {
    const chips = [...card.querySelectorAll('.td-chip')].map(c => c.textContent);
    assert(chips.length && chips.every(c => c === 'Proactive' || c === 'Reactive'), 'timing in text');
    assert(words(card.querySelector('p')) <= 30, 'card text stays short');
  }
  const fta = [...doc.querySelectorAll('.td-card')].find(c => c.querySelector('h4').textContent.startsWith('Fault tree'));
  assert.deepEqual([...fta.querySelectorAll('.td-chip')].map(c => c.textContent), ['Proactive', 'Reactive'], 'FTA plays both sides');
  // Proactive / reactive split around the failure, plus the Direction ≠ timing poster.
  assert.deepEqual([...doc.querySelectorAll('.td-side.is-pro li')].map(l => l.textContent), ['FMEA', 'HACCP', 'PHA', 'HAZID', 'SWIFT', 'HAZOP', 'Bow-tie', 'FTA at design', 'HAZAN']);
  assert.deepEqual([...doc.querySelectorAll('.td-side.is-re li')].map(l => l.textContent), ['5-Why', 'Fishbone', 'FTA in an investigation', 'CAPA / 8D']);
  assert.match(doc.querySelector('.td-bigpanel b').textContent, /Direction\s*≠ timing/);
  // ISO 31000 map: scope, identify, analyze, evaluate, treat; risk assessment = steps 1 to 3.
  assert.deepEqual([...doc.querySelectorAll('.td-iso > li > h3')].map(h => h.textContent), ['Scope', '1 · Identify', '2 · Analyze', '3 · Evaluate', '4 · Treat']);
  assert.match(doc.querySelector('.td-iso-frame').textContent, /steps 1 to 3/);
  const chips = [...doc.querySelectorAll('.td-iso > li')].map(li => [...li.querySelectorAll('ul li')].map(c => c.textContent));
  assert(chips[1].includes('HAZID') && chips[1].includes('HAZOP'), 'HAZID and HAZOP identify');
  assert(chips[2].includes('HAZAN') && chips[3].includes('HAZAN'), 'HAZAN analyzes and evaluates');
  assert.match(doc.querySelector('#td-iso').textContent, /ISO 31000:2018/);
  assert.match(doc.querySelector('#td-iso').textContent, /IEC 31010:2019/);
  // Five mistakes poster.
  assert.equal(doc.querySelectorAll('.td-warn ol li').length, 5);
  // Text budget: about 50 words per minute of paragraph reading; no wall of text.
  let total = 0;
  for (const p of doc.querySelectorAll('#lesson-content p')) {
    if (p.closest('#quiz, #td-refs, .related-lessons, .td-impl-body, .td-pcard')) continue;
    const n = words(p);
    assert(n <= 60, `paragraph too long: ${p.textContent.trim().slice(0, 60)}`);
    total += n;
  }
  assert(total <= meta.estimated_minutes * 50, `text budget: ${total} words`);
  // Made-up examples are labelled as made up.
  assert(doc.querySelectorAll('.td-made, figcaption').length >= 3);
  for (const el of doc.querySelectorAll('.td-made')) assert.match(el.textContent, /made.up/i);
});

test('the fault tree is an accessible picture and the gate maths matches the lab defaults', () => {
  const svg = doc.querySelector('#td-fta svg.td-svg');
  assert.equal(svg.getAttribute('role'), 'img');
  const [t, d] = svg.getAttribute('aria-labelledby').split(' ');
  assert(doc.getElementById(t).textContent.trim() && doc.getElementById(d).textContent.trim().length > 60);
  assert(!svg.querySelector('a, button, [tabindex]'));
  for (const label of ['PIPE RUPTURES IN SERVICE', 'OR', 'AND', 'minimum (W)', 'escapes (S)', 'created (D)', 'it (M)']) assert(svg.textContent.includes(label), label);
  assert.match(doc.querySelector('#td-fta figcaption').textContent, /Made-up example/);
  // Formulas are LaTeX with \( \) / \[ \] delimiters, never $.
  const math = doc.querySelector('#td-fta .td-math').textContent;
  assert(math.includes('\\[') && math.includes('P(\\text{S}) = P(\\text{D}) \\times P(\\text{M})'));
  assert(!/\$/.test(doc.querySelector('#lesson-content').textContent.replace(/\$G\$2:\$G\$40/g, '')), 'no $ math delimiters');
  // Default slider values and the static text agree with the gate maths.
  const v = id => Number(doc.getElementById(id).getAttribute('value')) / 100;
  const w = v('td-p-w'), tt = v('td-p-t'), dd = v('td-p-d'), m = v('td-p-m');
  const s = dd * m;
  const top = 1 - (1 - w) * (1 - tt) * (1 - s);
  assert.equal((s * 100).toFixed(3) + '%', doc.querySelector('[data-out="s"]').textContent);
  assert.equal((top * 100).toFixed(3) + '%', doc.getElementById('td-ft-top').textContent);
  assert.equal(doc.getElementById('td-ft-top').textContent, '0.055%');
  // The Excel use case quotes the same numbers.
  assert.match(doc.querySelector('#td-implementation').textContent, /0\.0002, 0\.0001, 0\.005 and 0\.05: the top event comes out near 0\.00055/);
  // Quiz question 8 uses the same AND gate.
  assert.match(doc.querySelectorAll('#quiz-form .quiz-question')[7].textContent, /0\.025%/);
});

test('the fault tree lab recomputes the top event live', () => {
  const { window, document, errors } = liveLesson();
  const ft = window.UpskillTdbuFt.compute(0.0002, 0.0001, 0.005, 0.05);
  assert.equal(ft.s.toFixed(6), '0.000250');
  assert.equal(ft.top.toFixed(6), '0.000550');
  assert.equal(document.getElementById('td-ft-top').textContent, '0.055%');
  assert.match(document.getElementById('td-ft-msg').textContent, /About 5\.5 pipes in 10,000 .* seam path/);
  const set = (id, val) => { const el = document.getElementById(id); el.value = String(val); el.dispatchEvent(new window.Event('input')); };
  // Worse UT: the seam path grows four times.
  set('td-p-m', 20);
  assert.equal(document.getElementById('td-o-m').textContent, '20%');
  assert.equal(document.querySelector('[data-out="s"]').textContent, '0.100%');
  // Perfect UT closes the AND gate.
  set('td-p-m', 0);
  assert.equal(document.querySelector('[data-out="s"]').textContent, '0.000%');
  assert.match(document.getElementById('td-ft-msg').textContent, /wall loss \(W\)/);
  // Every path closed: the top event cannot happen.
  set('td-p-w', 0); set('td-p-t', 0);
  assert.equal(document.getElementById('td-ft-top').textContent, '0.000%');
  assert.match(document.getElementById('td-ft-msg').textContent, /cannot happen/);
  assert.deepEqual(errors, []);
  window.close();
});

test('the system ladder steps through each direction in the right order', () => {
  const { window, document, errors } = liveLesson();
  const next = document.getElementById('td-ladder-next');
  const status = document.getElementById('td-ladder-status');
  const rung = n => document.querySelector(`.td-rung[data-rung="${n}"]`);
  const order = mode => {
    document.querySelector(`[data-td-mode="${mode}"]`).click();
    const seen = [];
    for (let i = 0; i < 4; i++) { next.click(); seen.push(Number(document.querySelector('.td-rung.is-on').dataset.rung)); }
    return seen;
  };
  assert.match(status.textContent, /Top-down chosen/);
  assert.deepEqual(order('td'), [1, 2, 3, 4]);
  assert(next.disabled, 'stops after four steps');
  assert.match(status.textContent, /step 4 of 4/);
  assert.match(rung(4).textContent, /Step 4: Root causes/);
  assert.deepEqual(order('bu'), [4, 3, 2, 1]);
  assert.match(rung(1).textContent, /Step 4: Effect on the customer/);
  assert.equal(document.querySelector('[data-td-mode="bu"]').getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelector('[data-td-mode="td"]').getAttribute('aria-pressed'), 'false');
  assert.deepEqual(order('mo'), [2, 3, 4, 1]);
  assert.match(rung(2).textContent, /Step 1: Deviation at a node/);
  document.getElementById('td-ladder-reset').click();
  assert.equal(document.querySelectorAll('.td-rung.is-on').length, 0);
  assert(!next.disabled);
  assert.equal(document.querySelectorAll('.td-rung.is-wait').length, 4);
  assert.deepEqual(errors, []);
  window.close();
});

test('the sorting game grades each job once, explains in words and resets', () => {
  const { window, document, errors } = liveLesson();
  const jobs = [...document.querySelectorAll('#td-game-list .td-job')];
  assert.equal(jobs.length, 8);
  assert.deepEqual(jobs.map(j => j.dataset.answer), ['td', 'bu', 'mo', 'mo', 'td', 'bu', 'bu', 'td']);
  assert.match(jobs[6].dataset.tool, /^HAZID/);
  assert.match(jobs[7].dataset.tool, /^HAZAN/);
  for (const j of jobs) assert.deepEqual([...j.querySelectorAll('button')].map(b => b.dataset.dir), ['td', 'mo', 'bu']);
  const score = document.getElementById('td-game-score');
  assert.equal(score.textContent, '0 / 8');
  // A wrong pick on job 1 names the right direction and locks the job.
  jobs[0].querySelector('[data-dir="bu"]').click();
  assert.match(jobs[0].querySelector('.td-fb').textContent, /^✗ Not quite\. It is top-down: 5-Why or fishbone, reactive\./);
  assert([...jobs[0].querySelectorAll('button')].every(b => b.disabled));
  jobs[0].querySelector('[data-dir="td"]').click(); // locked
  assert.equal(score.textContent, '0 / 8');
  // Job 5 is the trap: top-down, yet proactive.
  for (const j of jobs.slice(1)) j.querySelector(`[data-dir="${j.dataset.answer}"]`).click();
  assert.match(jobs[4].querySelector('.td-fb').textContent, /^✓ Correct: FTA at design, proactive/);
  assert.equal(score.textContent, '7 / 8');
  assert.match(document.getElementById('td-game-status').textContent, /All done/);
  document.getElementById('td-game-reset').click();
  assert.equal(score.textContent, '0 / 8');
  assert.equal(document.querySelectorAll('#td-game-list button:disabled').length, 0);
  for (const j of jobs) j.querySelector(`[data-dir="${j.dataset.answer}"]`).click();
  assert.match(document.getElementById('td-game-status').textContent, /Perfect sort/);
  assert.deepEqual(errors, []);
  window.close();
});

test('the HAZOP machine pairs all seven guide words with four parameters', () => {
  const { window, document, errors } = liveLesson();
  const gw = [...document.querySelectorAll('#td-hz-gw button')];
  const par = [...document.querySelectorAll('#td-hz-par button')];
  assert.deepEqual(gw.map(b => b.textContent), ['No', 'More', 'Less', 'As well as', 'Part of', 'Reverse', 'Other than']);
  assert.deepEqual(par.map(b => b.textContent), ['Flow', 'Temperature', 'Pressure', 'Level']);
  const out = document.getElementById('td-hz-out');
  assert.match(out.textContent, /NO \+ FLOW = No flow/);
  assert.deepEqual([...out.querySelectorAll('li b')].map(b => b.textContent), ['1 · Cause', '2 · Consequence', '3 · Safeguards', '4 · Action?']);
  // Every guide word has a meaningful Flow deviation.
  for (const b of gw) {
    b.click();
    assert.equal(b.getAttribute('aria-pressed'), 'true');
    assert(!out.classList.contains('is-na'), b.textContent);
  }
  document.querySelector('#td-hz-gw button:nth-child(6)').click(); // Reverse
  assert.match(out.textContent, /REVERSE \+ FLOW = Reverse flow/);
  assert.match(out.textContent, /Check valve/);
  // A meaningless pair is ruled out on record, not skipped.
  par[1].click(); // Temperature
  assert(out.classList.contains('is-na'));
  assert.match(out.textContent, /REVERSE \+ TEMPERATURE = not meaningful/);
  assert.match(out.textContent, /Record it as ruled out/);
  gw[1].click(); // More + Temperature
  assert.match(out.textContent, /High inlet temperature/);
  const table = window.UpskillTdbuHazop.table;
  for (const key of Object.keys(table)) {
    const [g, p] = key.split('|');
    assert(window.UpskillTdbuHazop.guide.includes(g) && window.UpskillTdbuHazop.params.includes(p), key);
    assert.equal(table[key].length, 4);
  }
  assert.deepEqual(errors, []);
  window.close();
});

test('the HAZID → HAZOP → HAZAN stepper shows one stage at a time in words', () => {
  // Static fallback (no JS) already shows HAZID.
  assert.match(doc.getElementById('td-life-out').textContent, /HAZID: hazard identification/);
  assert.match(doc.querySelector('#td-hazop').textContent, /HAZOP identifies hazards, HAZAN assesses them|HAZOP identifies hazards/);
  assert.match(doc.querySelector('#td-fta').textContent, /HAZAN \(hazard analysis\)/);
  assert(/Kletz, T\. A\. \(1999\)/.test(doc.getElementById('td-refs').textContent), 'Kletz reference');
  const { window, document, errors } = liveLesson();
  const btns = [...document.querySelectorAll('.td-life-btn')];
  assert.deepEqual(btns.map(b => b.querySelector('b').textContent), ['HAZID', 'HAZOP', 'HAZAN']);
  assert(btns.every(b => b.getAttribute('type') === 'button'));
  const out = document.getElementById('td-life-out');
  const row = label => [...out.querySelectorAll('li')].find(li => li.querySelector('b').textContent === label).textContent.replace(label, '');
  btns[2].click();
  assert.deepEqual(btns.map(b => b.getAttribute('aria-pressed')), ['false', 'false', 'true']);
  assert.match(out.textContent, /HAZAN: hazard analysis/);
  assert.equal(row('ISO 31000'), '2 · Analyze and 3 · Evaluate');
  assert.equal(row('Direction · timing'), 'Mostly top-down · proactive');
  btns[1].click();
  assert.equal(row('ISO 31000'), '1 · Identify');
  assert.equal(row('Direction · timing'), 'Middle-out · proactive');
  btns[0].click();
  assert.equal(row('Direction · timing'), 'Bottom-up · proactive');
  assert.equal(out.querySelectorAll('li').length, 6);
  assert.deepEqual(Object.keys(window.UpskillTdbuLife.data), ['hazid', 'hazop', 'hazan']);
  assert.deepEqual(errors, []);
  window.close();
});

test('tool examples expand and collapse with aria-expanded', () => {
  const { window, document, errors } = liveLesson();
  const buttons = [...document.querySelectorAll('#td-tools .td-more')];
  assert.equal(buttons.length, 9);
  const b = buttons[0];
  const panel = document.getElementById(b.getAttribute('aria-controls'));
  assert(panel.hidden);
  b.click();
  assert.equal(b.getAttribute('aria-expanded'), 'true');
  assert(!panel.hidden);
  b.click();
  assert(panel.hidden);
  assert.deepEqual(errors, []);
  window.close();
});

test('Statistics Implementation is a closed, nudging cheat-codes dropdown with all four parts', () => {
  const panel = doc.getElementById('td-impl-details');
  assert.equal(panel.tagName, 'DETAILS');
  assert(!panel.hasAttribute('open'), 'closed by default');
  const summary = panel.querySelector('summary');
  assert.equal(summary.querySelector('h2').textContent, 'Statistics Implementation');
  assert.equal(summary.querySelector('.td-impl-hint .td-impl-show').textContent, 'Unlock the cheat codes');
  assert.equal(summary.querySelector('.td-impl-hint .td-impl-hide').textContent, 'Hide the cheat codes');
  for (const tease of summary.querySelectorAll('.td-impl-tease > span')) assert(words(tease) < 30);
  assert.deepEqual([...panel.querySelectorAll('.td-impl-body h3')].map(h => h.textContent), ['Excel functions', 'Excel use cases', 'Minitab navigation', 'Exam tips']);
  assert.deepEqual([...panel.querySelectorAll('thead th')].map(t => t.textContent), ['Function', 'Syntax', 'Purpose', 'When to use it']);
  for (const fn of ['PRODUCT', 'RANK.EQ', 'SORTBY', 'COUNTIFS']) assert(panel.textContent.includes(fn), fn);
  for (const p of ['Calc → Calculator', 'Stat → Quality Tools → Pareto Chart', 'Graph → Bar Chart']) assert(panel.textContent.includes(p), p);
  const css = doc.getElementById('tdbu-style').textContent;
  assert.match(css, /@keyframes lesson-tdbu-nudge/);
  assert.match(css, /\.td-impl:not\(\[open\]\) \.td-impl-hint\{animation:lesson-tdbu-nudge/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*animation:none/);
  assert.match(css, /summary::-webkit-details-marker\{display:none\}/);
  // The contents link opens it, and so does a hash link to a heading inside it.
  let live = liveLesson();
  const d = live.document.getElementById('td-impl-details');
  live.document.querySelector('a[href="#td-implementation"]').click();
  assert(d.open);
  live.window.close();
  live = liveLesson('#td-minitab-h');
  assert(live.document.getElementById('td-impl-details').open);
  assert.deepEqual(live.errors, []);
  live.window.close();
});

test('four wall posters download as real one-page PDFs with the site header and footer', () => {
  const cards = [...doc.querySelectorAll('#td-posters .td-pcard')];
  assert.equal(cards.length, 4);
  const seen = new Set();
  for (const card of cards) {
    const a = card.querySelector('a[download]');
    const href = a.getAttribute('href');
    assert.match(href, new RegExp(`^/${ASSETS}[a-z0-9-]+-poster\\.pdf$`));
    assert.match(a.textContent, /^Download PDF of the .+ poster$/);
    const pdf = fs.readFileSync(path.join(ROOT, href));
    const text = pdf.toString('latin1');
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert(pdf.length < 10 * 1024 * 1024, `${href} is under 10 MB`);
    assert.equal((text.match(/\/Type\s*\/Page[^s]/g) || []).length, 1, `${href} is one page`);
    assert.match(text, /\/MediaBox\s*\[\s*0 0 1296 1728\s*\]/, `${href} is 18 x 24 in`);
    assert(text.includes('/FontFile2') || text.includes('/FontFile3'), `${href} embeds its fonts`);
    assert((text.match(/\/Subtype\s*\/Image/g) || []).length >= 2, `${href} carries both site logos`);
    const kb = Math.round(pdf.length / 1024);
    assert.equal(Number(a.dataset.tdPosterKb), kb);
    assert(card.querySelector('.td-pmeta').textContent.includes(`18 × 24 in, ${kb} KB`), 'stated size matches the file');
    const img = card.querySelector('img');
    const src = img.getAttribute('src');
    assert(fs.existsSync(path.join(ROOT, src)), src);
    assert(fs.statSync(path.join(ROOT, src)).size <= 250 * 1024, `${src} is 250 KB or less`);
    assert(img.alt.startsWith('Preview of the') && img.getAttribute('width') === '480' && img.getAttribute('height') === '640');
    assert.equal(img.getAttribute('loading'), 'lazy');
    seen.add(href);
  }
  assert.equal(seen.size, 4);
  assert(doc.querySelector('.td-toc a[href="#td-posters-h"]'), 'hero links to the posters');
});

test('every internal link and in-page anchor resolves', () => {
  for (const a of doc.querySelectorAll('a[href^="#"]')) {
    assert(doc.getElementById(a.getAttribute('href').slice(1)), a.getAttribute('href'));
  }
  const lessonLinks = [...doc.querySelectorAll('#lesson-content a[href^="/lessons/"]')].map(a => a.getAttribute('href'));
  assert(lessonLinks.length >= 3);
  for (const href of lessonLinks) {
    assert(!href.endsWith('.html'), `extensionless: ${href}`);
    assert(fs.existsSync(path.join(ROOT, `${href.slice(1)}.html`)), `missing lesson: ${href}`);
  }
  const related = doc.querySelectorAll('.related-lessons li a');
  assert(related.length >= 3 && related.length <= 5);
});

test('registered in the Quality Engineering catalog with a public access SQL file and sitemap entry', () => {
  const lib = read('chi-square-lesson-library.js');
  const entry = lib.match(/\{\s*marker: 'data-top-down-vs-bottom-up-risk-assessment',[\s\S]*?\n {4}\}/);
  assert(entry, 'catalog entry');
  const e = entry[0];
  assert.match(e, /sectionId: 'quality-engineering'/);
  assert.match(e, /topic: 'quality-engineering'/);
  assert.match(e, new RegExp(`path: '${URL_PATH}'`));
  assert.match(e, /level: 'intermediate'/);
  assert.match(e, /interactive: 'true'/);
  assert.match(e, /<span>25 min<\/span>/);
  assert.match(e, /title: 'Top-Down vs\. Bottom-Up Risk Assessment'/);
  assert(e.includes(`description: '${meta.card_description}'`));
  assert(lib.includes("marker: 'data-beyond-the-bell',"), 'build insertion point intact');
  const sql = read(`supabase/public-${SLUG}-access.sql`);
  assert.match(sql, new RegExp(`'lesson:${URL_PATH}', 'public', 'Top-Down vs\\. Bottom-Up Risk Assessment', true, now\\(\\)`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert(!/\b(create|alter|drop|grant)\b/i.test(sql), 'data only, no schema changes');
  assert(read('sitemap.xml').includes(`<loc>https://upskillsprint.com${URL_PATH}</loc>`), 'sitemap snapshot');
});

test('the quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', () => {
  const { window, document, errors } = liveLesson();
  const events = [];
  document.addEventListener('upskill-quiz-result', e => events.push({ score: e.detail.score, total: e.detail.total }));
  const submit = () => document.getElementById('quiz-submit').click();
  const questions = [...document.querySelectorAll('#quiz-form .quiz-question')];
  assert.equal(questions.length, 10);
  const answers = questions.map(q => q.dataset.answer);
  assert.deepEqual(answers, ['b', 'c', 'a', 'd', 'b', 'c', 'a', 'd', 'c', 'b']);
  for (const q of questions) assert(q.dataset.explanation.length > 40);

  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 10 });
  assert.match(document.getElementById('quiz-result').textContent, /10 unanswered/);

  answers.forEach((a, i) => {
    [...questions[i].querySelectorAll('input')].find(r => r.value !== a).checked = true;
  });
  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 10 });
  assert.match(questions[0].querySelector('.quiz-feedback').textContent, /Not quite/);

  answers.forEach((a, i) => { questions[i].querySelector(`input[value="${a}"]`).checked = true; });
  submit();
  assert.deepEqual(events.pop(), { score: 10, total: 10 });
  assert.match(document.getElementById('quiz-result').textContent, /Score: 10 \/ 10/);
  assert.deepEqual(errors, []);
  window.close();
});

test('the side-by-side comparison table has a mobile scroll cue and stays keyboard-accessible', () => {
  const heading = doc.getElementById('td-compare-h');
  assert.equal(heading.textContent, 'Side by side');
  const hint = heading.nextElementSibling;
  assert.equal(hint.tagName, 'P');
  assert.equal(hint.className, 'td-scroll-hint');
  assert.equal(hint.textContent, 'Scroll sideways to see all columns.');
  assert(hint.hasAttribute('data-search-exclude'), 'UI hint stays out of the search index');
  const region = hint.nextElementSibling;
  assert(region.classList.contains('td-table-scroll'));
  assert(region.classList.contains('td-compare-scroll'));
  assert.equal(region.getAttribute('tabindex'), '0');
  assert.equal(region.getAttribute('role'), 'region');
  assert.equal(region.getAttribute('aria-label'), 'Top-down and bottom-up compared');
  const css = doc.getElementById('tdbu-style').textContent;
  assert.match(css, /#lesson-content \.td-scroll-hint\{display:none;/);
  assert.match(css, /@media \(max-width:640px\)\{#lesson-content \.td-scroll-hint\{display:block\}\}/);
  assert.match(css, /#lesson-content \.td-compare-scroll\{/);
  assert(css.includes('scroll no-repeat'), 'edge shadow uses a scroll-attached gradient');
  // Other wide tables keep keyboard access and are not given this cue.
  const scrolls = [...doc.querySelectorAll('.td-table-scroll')];
  assert.equal(scrolls.length, 3);
  assert.equal(scrolls.filter(el => el.classList.contains('td-compare-scroll')).length, 1);
  for (const sc of scrolls) {
    assert.equal(sc.getAttribute('tabindex'), '0');
    assert.equal(sc.getAttribute('role'), 'region');
  }
});

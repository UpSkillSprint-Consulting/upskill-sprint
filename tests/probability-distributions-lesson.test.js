'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SLUG = 'probability-distributions-for-lean-six-sigma';
const LESSON = `lessons/statistics/${SLUG}.html`;
const URL_PATH = `/lessons/statistics/${SLUG}`;
const PDF = `assets/lessons/${SLUG}/secret-personalities-of-process-data.pdf`;
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const html = read(LESSON);
const guide = read('docs/LESSON_CREATION_GUIDE.md');
const doc = new JSDOM(html).window.document; // structure checks only, no scripts
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
const guideBlock = heading => guide.split(heading)[1].match(/```html\n([\s\S]*?)\n```/)[1].trim();
const words = el => el.textContent.trim().split(/\s+/).filter(Boolean).length;

function liveLesson() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', virtualConsole, url: `https://upskillsprint.com${URL_PATH}`,
    // Reduced motion makes the bean machine fill instantly, so the test needs no timers.
    beforeParse(window) { window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} }); }
  });
  return { window: dom.window, document: dom.window.document, errors };
}

test('metadata, head and SEO follow the lesson guide', () => {
  assert(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  assert.equal(meta.slug, SLUG);
  assert.equal(meta.title, 'Probability Distributions for Lean Six Sigma');
  assert.equal(meta.category_slug, 'statistics');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, LESSON);
  assert(meta.search_keywords.length >= 5 && meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.equal(doc.title, 'Probability Distributions for Lean Six Sigma | UpSkill Sprint');
  assert(doc.title.length <= 65);
  const desc = doc.querySelector('meta[name="description"]').content;
  assert(desc.length >= 120 && desc.length <= 160, String(desc.length));
  assert.match(desc, /probability distributions/);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, desc);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  const teaser = doc.querySelector('meta[name="upskill:email-teaser"]').content;
  assert(teaser.length >= 40 && teaser.length <= 160 && !/[<>!]|https?:/.test(teaser));
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
  assert(html.includes('<script defer src="/assets/js/math.js"></script>'));
  assert(html.indexOf('<link rel="stylesheet" href="/lessons-theme.css">') < html.indexOf('<style id="pd-style">'));
  assert.match(doc.querySelector('.pd-lede').textContent, /probability distributions/i);
  // No $ math delimiters; formulas use \( \).
  assert(!/\$[^$]*\\[a-z]+/.test(html.replace(/<script[\s\S]*?<\/script>/g, '')));
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
  assert.equal(doc.body.dataset.category, 'statistics');
  assert.equal(doc.body.dataset.level, 'beginner');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert(!doc.querySelector('#lesson-progress-widget'));
  assert.equal(doc.querySelector('[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#statistics');
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
  for (const sc of doc.querySelectorAll('[style*="overflow-x:auto"]')) {
    assert.equal(sc.getAttribute('tabindex'), '0');
    assert.equal(sc.getAttribute('role'), 'region');
    assert(sc.getAttribute('aria-label'));
  }
});

test('lesson-owned CSS is namespaced and never restyles site chrome', () => {
  const css = doc.getElementById('pd-style').textContent + doc.getElementById(`${SLUG}-dark-overrides`).textContent;
  const declared = [...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]);
  assert(declared.length > 20);
  for (const name of declared) assert(name.startsWith('--lesson-pd-'), name);
  // The two guide-required dark fixes (§7.1 kicker, §8 back link) are the only unscoped rules.
  const allowed = new Set(['html[data-theme="dark"] .quiz-section .lesson-kicker', 'html[data-theme="dark"] [aria-label="Return to lesson category"] a']);
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^{}]*\}/g, '\n').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  for (const sel of selectors) {
    if (sel.startsWith('@media') || sel === '}' || allowed.has(sel)) continue;
    assert.match(sel, /#lesson-content/, `selector not scoped to the lesson: ${sel}`);
  }
  assert(!/(^|[\s,{])(\.card|\.chip|\.callout|\.quiz)\b/.test(doc.getElementById('pd-style').textContent));
});

test('hero poster: 13 shapes in 3 families, and the zoo has the same 6 / 3 / 4 split', () => {
  const blocks = [...doc.querySelectorAll('#pd-families-poster .pd-fams li')];
  assert.deepEqual(blocks.map(b => b.querySelector('.pd-big').textContent), ['6', '3', '4']);
  assert.deepEqual(blocks.map(b => b.querySelector('.pd-fam-name').textContent), ['Measure-it', 'Count-it', 'Test-it']);
  const cards = [...doc.querySelectorAll('#pd-zoo-grid .pd-animal')];
  assert.equal(cards.length, 13);
  const byFam = f => cards.filter(c => c.dataset.fam === f).length;
  assert.deepEqual([byFam('measure'), byFam('count'), byFam('test')], [6, 3, 4]);
  blocks.forEach((b, i) => {
    const fam = ['measure', 'count', 'test'][i];
    const listed = b.querySelector('.pd-fam-list').textContent.split('·').map(s => s.trim());
    const names = cards.filter(c => c.dataset.fam === fam).map(c => c.querySelector('h3').textContent);
    assert.equal(listed.length, names.length);
  });
  for (const c of cards) {
    assert(c.querySelector('.pd-nick').textContent.trim());
    assert(c.querySelectorAll('.pd-keys li').length >= 3);
    for (const dd of c.querySelectorAll('dd')) assert(words(dd) <= 30, `card text too long: ${dd.textContent}`);
  }
  // Every row of the cheat sheet names one of the 13 cards.
  const zooNames = cards.map(c => c.querySelector('h3').textContent.replace(/ \(Z\)/, '').replace('Standard normal', 'Z'));
  const cheat = [...doc.querySelectorAll('#pd-pick tbody th')].map(th => th.textContent);
  assert.equal(cheat.length, 13);
  for (const n of cheat) assert(zooNames.includes(n), n);
});

test('the Secret Personalities poster keeps its copy and ships as a downloadable PDF', () => {
  const chars = [...doc.querySelectorAll('#pd-cast-poster .pd-char')];
  assert.deepEqual(chars.map(c => c.dataset.character), ['normal', 'lognormal', 'exponential', 'weibull', 'binomial', 'poisson', 'chisq', 'fdist']);
  assert.deepEqual(chars.map(c => c.querySelector('.pd-nick').textContent), [
    '“The Overachiever”', '“The Over-Caffeinated Achiever”', '“The Impatient Waiter”', '“The Master of Disguise”',
    '“The Coin-Flip Master”', '“The Beep Counter”', '“The Detective”', '“The Ratio Referee”']);
  for (const c of chars) {
    assert.deepEqual([...c.querySelectorAll('dt')].map(d => d.textContent), ['The Vibe', 'Memorable Phrase', 'The Story']);
  }
  const text = doc.getElementById('pd-cast-poster').textContent;
  for (const line of ['drops off like a skateboarder hitting a half-pipe', 'treats standard deviations like personal boundaries',
    'Squaring the gaps between observed and expected!', 'Calling the ratio play in ANOVA!', 'Level up your Black Belt knowledge!']) {
    assert(text.includes(line), line);
  }
  const link = doc.querySelector('#pd-cast a[download]');
  assert.equal(link.getAttribute('href'), `/${PDF}`);
  const bytes = fs.statSync(path.join(ROOT, PDF)).size;
  assert(bytes > 20000 && bytes < 10 * 1024 * 1024);
  assert(fs.readFileSync(path.join(ROOT, PDF)).subarray(0, 5).toString() === '%PDF-');
  assert.match(link.textContent, new RegExp(`PDF, ${Math.round(bytes / 1024)} KB`));
});

test('the formula quick reference ships as a second 11 x 17 in PDF download', () => {
  const QR = `assets/lessons/${SLUG}/probability-distributions-quick-reference.pdf`;
  const links = [...doc.querySelectorAll('#pd-cast a[download]')];
  assert.deepEqual(links.map(a => a.getAttribute('href')), [`/${PDF}`, `/${QR}`]);
  const buf = fs.readFileSync(path.join(ROOT, QR));
  assert.equal(buf.subarray(0, 5).toString(), '%PDF-');
  assert(buf.length > 20000 && buf.length < 10 * 1024 * 1024);
  // One page, 17 x 11 in (1224 x 792 pt).
  const box = buf.toString('latin1').match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/);
  assert(box, 'MediaBox');
  assert.deepEqual([Math.round(+box[1]), Math.round(+box[2])], [1224, 792]);
  assert.equal((buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length, 1);
  assert.match(links[1].textContent, new RegExp(`11 × 17 in, ${Math.round(buf.length / 1024)} KB`));
});

test('every chart is an accessible image with a title and description, coloured by tokens', () => {
  const svgs = [...doc.querySelectorAll('#lesson-content svg[role="img"]')];
  assert(svgs.length >= 12, String(svgs.length));
  for (const svg of svgs) {
    const [t, d] = svg.getAttribute('aria-labelledby').split(' ');
    assert(doc.getElementById(t).textContent.trim(), t);
    assert(doc.getElementById(d).textContent.trim().length > 40, d);
    assert(!svg.querySelector('a, button, [tabindex]'));
  }
  for (const svg of doc.querySelectorAll('#lesson-content svg')) assert(!/fill="#|stroke="#/.test(svg.outerHTML));
  // The bean machine starts with the expected pile for 100 balls through 10 rows of pegs.
  const counts = doc.getElementById('pd-bean-svg').dataset.counts.split(',').map(Number);
  const choose = (n, k) => { let c = 1; for (let i = 1; i <= k; i++) c = c * (n - i + 1) / i; return c; };
  assert.deepEqual(counts, counts.map((_, k) => Math.round(100 * choose(10, k) / 1024)));
});

test('Excel use-case answers match the lesson maths (values checked against scipy)', () => {
  const { window, errors } = liveLesson();
  const M = window.UpskillDistributionMath;
  const rows = [...window.document.querySelectorAll('#pd-excel-results tbody tr')];
  assert.equal(rows.length, 12);
  const calc = {
    '=NORM.DIST(9.6, 10, 0.2, TRUE)': () => M.Phi(-2),
    '=NORM.INV(0.95, 30, 5)': () => 30 + 5 * 1.6448536,
    '=NORM.S.INV(0.975)': () => 1.959964,
    '=T.DIST.2T(2.5, 9)': () => 2 * (1 - M.tcdf(2.5, 9)),
    '=CHISQ.DIST.RT(11.2, 4)': () => 1 - M.chicdf(11.2, 4),
    '=F.DIST.RT(3.5, 4, 20)': () => 1 - M.fcdf(3.5, 4, 20),
    '=BINOM.DIST(0, 50, 0.02, FALSE)': () => M.binpmf(0, 50, 0.02),
    '=POISSON.DIST(5, 3, FALSE)': () => M.poipmf(5, 3),
    '=HYPGEOM.DIST(0, 5, 3, 20, FALSE)': () => M.hyppmf(0, 20, 3, 5),
    '=1-EXPON.DIST(100, 0.002, TRUE)': () => Math.exp(-0.2),
    '=WEIBULL.DIST(500, 2, 1000, TRUE)': () => M.wcdf(500, 2, 1000),
    '=LOGNORM.DIST(30, 3, 0.5, TRUE)': () => M.lncdf(30, 3, 0.5)
  };
  const scipy = ['0.0228', '38.22', '1.960', '0.0339', '0.0244', '0.0254', '0.3642', '0.1008', '0.3991', '0.8187', '0.2212', '0.7888'];
  rows.forEach((r, i) => {
    const f = r.dataset.formula, shown = r.dataset.answer;
    assert.equal(shown, scipy[i], f);
    assert(calc[f], `no check for ${f}`);
    const decimals = shown.split('.')[1].length;
    assert.equal(calc[f]().toFixed(decimals), shown, f);
    assert(r.textContent.includes(shown) && r.querySelector('code').textContent === f);
  });
  assert.deepEqual(errors, []);
  window.close();
});

test('Statistics Implementation has all four parts', () => {
  const sec = doc.getElementById('pd-implementation');
  assert.equal(sec.querySelector('h2').textContent, 'Statistics Implementation');
  assert.deepEqual([...sec.querySelectorAll('h3')].map(h => h.textContent), ['Excel functions', 'Excel use cases', 'Minitab navigation', 'Exam tips']);
  const fnHead = [...sec.querySelector('table thead').querySelectorAll('th')].map(t => t.textContent);
  assert.deepEqual(fnHead, ['Function', 'Syntax', 'Purpose', 'When to use it']);
  for (const fn of ['T.DIST', 'T.DIST.RT', 'T.DIST.2T', 'NORM.DIST', 'BINOM.DIST', 'POISSON.DIST', 'HYPGEOM.DIST', 'WEIBULL.DIST', 'F.DIST.RT', 'CHISQ.DIST.RT']) {
    assert(sec.textContent.includes(`=${fn}(`), fn);
  }
  assert(sec.textContent.includes('Stat → Quality Tools → Individual Distribution Identification'));
});

test('Statistics Implementation is a closed dropdown that opens on click or from its link', () => {
  const panel = doc.getElementById('pd-impl-details');
  assert.equal(panel.tagName, 'DETAILS');
  assert(!panel.hasAttribute('open'), 'closed until the learner opens it');
  const summary = panel.querySelector(':scope > summary');
  assert.equal(summary.querySelector('h2').textContent, 'Statistics Implementation');
  assert.match(summary.textContent, /Show the Excel and Minitab guide/);
  assert.equal(panel.querySelectorAll('.pd-impl-body h3').length, 4);
  const { window, document, errors } = liveLesson();
  const live = document.getElementById('pd-impl-details');
  assert.equal(live.open, false);
  document.querySelector('.pd-toc a[href="#pd-implementation"]').click();
  assert.equal(live.open, true, 'the contents link opens the panel');
  live.open = false;
  window.location.hash = '#pd-minitab';
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  assert.equal(live.open, true, 'a link to a heading inside opens the panel');
  assert.deepEqual(errors, []);
  window.close();
});

test('the Shape Lab redraws, shades the chosen tail and shows the matching Excel formula', () => {
  const { window, document, errors } = liveLesson();
  const $ = id => document.getElementById(id);
  assert.equal($('pd-lab-p').textContent, '0.8413'); // normal, average 50, sd 10, cutoff 60
  assert.equal($('pd-lab-excel').textContent, '=NORM.DIST(60, 50, 10, TRUE)');
  assert.match($('pd-lab-words').textContent, /84\.1% chance a value is at or below 60/);
  assert($('pd-lab-g').querySelector('.pd-shade'));
  $('pd-tail-right').click();
  assert.equal($('pd-lab-p').textContent, '0.1587');
  assert.equal($('pd-tail-right').getAttribute('aria-pressed'), 'true');
  const sel = $('pd-lab-dist');
  assert.equal(sel.querySelectorAll('option').length, 12);
  sel.value = 't'; sel.dispatchEvent(new window.Event('change'));
  assert.equal($('pd-lab').dataset.fam, 'test');
  assert.equal($('pd-lab-p').textContent, '0.0334'); // t = 2.5, 4 df, right tail
  assert.equal($('pd-lab-excel').textContent, '=T.DIST.RT(2.5, 4)');
  assert($('pd-lab-g').querySelector('.pd-ref'), 'normal curve shown for comparison');
  const df = $('pd-lab-p-df'); df.value = '9'; df.dispatchEvent(new window.Event('input'));
  assert.equal($('pd-lab-p').textContent, '0.0169');
  sel.value = 'poisson'; sel.dispatchEvent(new window.Event('change'));
  $('pd-tail-left').click();
  assert.equal($('pd-lab-p').textContent, '0.9161'); // at most 5 when the average is 3
  assert.equal($('pd-lab-excel').textContent, '=POISSON.DIST(5, 3, TRUE)');
  assert.equal($('pd-lab-g').querySelectorAll('rect').length, 31);
  sel.value = 'hyper'; sel.dispatchEvent(new window.Event('change'));
  assert.equal($('pd-lab-p').textContent, '0.3991');
  assert.match($('pd-lab-pd').textContent, /Hypergeometric distribution/);
  assert.deepEqual(errors, []);
  window.close();
});

test('the picker walks to an answer, goes back, and starts over', () => {
  const { window, document, errors } = liveLesson();
  const box = document.getElementById('pd-picker');
  const pick = text => [...box.querySelectorAll('.pd-opts button')].find(b => b.textContent.startsWith(text)).click();
  assert.equal(box.querySelector('.pd-pq').textContent, 'What are you doing with your data?');
  pick('Counting'); pick('Defects or events');
  assert.equal(box.querySelector('.pd-answer').dataset.result, 'poisson');
  assert.match(box.textContent, /Use the Poisson distribution/);
  assert.match(box.textContent, /=POISSON\.DIST/);
  [...box.querySelectorAll('button')].find(b => b.textContent === 'Back').click();
  assert.equal(box.querySelector('.pd-pq').textContent, 'What are you counting?');
  pick('Bad items'); pick('A big part');
  assert.equal(box.querySelector('.pd-answer').dataset.result, 'hyper');
  [...box.querySelectorAll('button')].find(b => b.textContent === 'Start over').click();
  pick('Running'); pick('An average'); pick('No');
  assert.equal(box.querySelector('.pd-answer').dataset.result, 't');
  // Every exit of the tree has a result, and every result is reachable.
  const P = window.UpskillDistributionPicker, exits = new Set();
  Object.values(P.TREE).forEach(([, opts]) => opts.forEach(([, next]) => {
    if (next[0] === '=') { assert(P.RES[next.slice(1)], next); exits.add(next.slice(1)); } else assert(P.TREE[next], next);
  }));
  assert.equal(exits.size, 13);
  assert.deepEqual(errors, []);
  window.close();
});

test('the bean machine drops 100 balls and resets; the zoo filter shows one family', () => {
  const { window, document, errors } = liveLesson();
  const svg = document.getElementById('pd-bean-svg');
  document.getElementById('pd-bean-drop').click();
  const counts = svg.dataset.counts.split(',').map(Number);
  assert.equal(counts.reduce((a, b) => a + b, 0), 100);
  assert.match(document.getElementById('pd-bean-count').textContent, /100 balls dropped/);
  document.getElementById('pd-bean-reset').click();
  assert(svg.dataset.counts.split(',').every(c => c === '0'));
  assert.match(document.getElementById('pd-bean-count').textContent, /empty/);
  const btn = document.querySelector('#pd-zoo .pd-filter [data-filter="count"]');
  btn.click();
  assert.equal(btn.getAttribute('aria-pressed'), 'true');
  const visible = [...document.querySelectorAll('#pd-zoo-grid .pd-animal')].filter(c => !c.hidden);
  assert.equal(visible.length, 3);
  assert(visible.every(c => c.dataset.fam === 'count'));
  assert.equal(document.getElementById('pd-zoo-status').textContent, 'Showing 3 Count-it distributions.');
  document.querySelector('#pd-zoo .pd-filter [data-filter="all"]').click();
  assert.equal([...document.querySelectorAll('#pd-zoo-grid .pd-animal')].filter(c => !c.hidden).length, 13);
  // jsdom applies no CSS, so check the stylesheet lets [hidden] beat the card's display:flex (live bug: filter did nothing).
  const css = document.getElementById('pd-style').textContent;
  assert.match(css, /#lesson-content \.pd-animal\[hidden\]\{display:none\}/);
  assert(css.indexOf('.pd-animal[hidden]') > css.indexOf('.pd-animal{'), '[hidden] rule comes after the display:flex rule');
  assert.deepEqual(errors, []);
  window.close();
});

test('the quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', () => {
  const { window, document, errors } = liveLesson();
  const events = [];
  document.addEventListener('upskill-quiz-result', e => events.push({ score: e.detail.score, total: e.detail.total }));
  const submit = () => document.getElementById('quiz-submit').click();
  const questions = [...document.querySelectorAll('#quiz-form .quiz-question')];
  assert.equal(questions.length, 6);
  const answers = questions.map(q => q.dataset.answer);
  assert.deepEqual(answers, ['b', 'c', 'a', 'c', 'b', 'a']);
  for (const q of questions) assert(q.dataset.explanation.length > 40);
  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 6 });
  assert.match(document.getElementById('quiz-result').textContent, /6 unanswered/);
  answers.forEach((a, i) => { [...questions[i].querySelectorAll('input')].find(r => r.value !== a).checked = true; });
  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 6 });
  answers.forEach((a, i) => { questions[i].querySelector(`input[value="${a}"]`).checked = true; });
  submit();
  assert.deepEqual(events.pop(), { score: 6, total: 6 });
  assert.match(document.getElementById('quiz-result').textContent, /Score: 6 \/ 6/);
  assert.deepEqual(errors, []);
  window.close();
});

test('links resolve, related lessons exist, and the text budget fits the estimated minutes', () => {
  for (const a of doc.querySelectorAll('a[href^="#"]')) assert(doc.getElementById(a.getAttribute('href').slice(1)), a.getAttribute('href'));
  const related = [...doc.querySelectorAll('.related-lessons li a')];
  assert(related.length >= 3 && related.length <= 5);
  for (const a of related) {
    const href = a.getAttribute('href');
    assert(!href.endsWith('.html'));
    assert(fs.existsSync(path.join(ROOT, `${href.slice(1)}.html`)), href);
  }
  const main = doc.querySelector('main').cloneNode(true);
  main.querySelectorAll('script, style, svg, #quiz').forEach(n => n.remove());
  assert(words(main) <= meta.estimated_minutes * 50, `${words(main)} words for ${meta.estimated_minutes} min`);
  for (const p of doc.querySelectorAll('main p')) assert(words(p) <= 60, `paragraph too long: ${p.textContent.slice(0, 60)}`);
});

test('registered in the Statistics catalog with matching metadata, and the access SQL is present', () => {
  const lib = read('chi-square-lesson-library.js');
  const entry = lib.match(/\{\s*marker: 'data-probability-distributions-for-lean-six-sigma',[\s\S]*?\n {4}\}/);
  assert(entry, 'catalog entry');
  const e = entry[0];
  assert.match(e, /sectionId: 'statistics'/);
  assert.match(e, /topic: 'statistics'/);
  assert.match(e, new RegExp(`path: '${URL_PATH}'`));
  assert.match(e, /level: 'beginner'/);
  assert.match(e, /interactive: 'true'/);
  assert.match(e, new RegExp(`<span>${meta.estimated_minutes} min</span>`));
  assert.match(e, new RegExp(`title: '${meta.title}'`));
  assert.match(e, new RegExp(`description: '${meta.card_description}'`));
  assert(lib.includes("marker: 'data-beyond-the-bell',"), 'build insertion point intact');
  const sql = read('supabase/public-probability-distributions-access.sql');
  assert.match(sql, /'lesson:\/lessons\/statistics\/probability-distributions-for-lean-six-sigma', 'public', 'Probability Distributions for Lean Six Sigma', true, now\(\)/);
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert(!/\b(create|alter|drop|grant)\b/i.test(sql));
});

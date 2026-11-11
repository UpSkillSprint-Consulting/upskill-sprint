'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SLUG = 'excel-statistical-functions-map';
const LESSON = `lessons/power-bi-excel-sql/${SLUG}.html`;
const URL_PATH = `/lessons/power-bi-excel-sql/${SLUG}`;
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const html = read(LESSON);
const guide = read('docs/LESSON_CREATION_GUIDE.md');
const doc = new JSDOM(html).window.document; // structure checks only, no scripts
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
const guideBlock = heading => guide.split(heading)[1].match(/```html\n([\s\S]*?)\n```/)[1].trim();

function liveLesson(hash = '') {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole, url: `https://upskillsprint.com${URL_PATH}${hash}` });
  return { window: dom.window, document: dom.window.document, errors };
}

// Microsoft "Statistical functions (reference)": all 111 entries.
const STATISTICAL = `AVEDEV AVERAGE AVERAGEA AVERAGEIF AVERAGEIFS BETA.DIST BETA.INV BINOM.DIST BINOM.DIST.RANGE BINOM.INV CHISQ.DIST CHISQ.DIST.RT
CHISQ.INV CHISQ.INV.RT CHISQ.TEST CONFIDENCE.NORM CONFIDENCE.T CORREL COUNT COUNTA COUNTBLANK COUNTIF COUNTIFS COVARIANCE.P COVARIANCE.S DEVSQ
EXPON.DIST F.DIST F.DIST.RT F.INV F.INV.RT F.TEST FISHER FISHERINV FORECAST FORECAST.ETS FORECAST.ETS.CONFINT FORECAST.ETS.SEASONALITY
FORECAST.ETS.STAT FORECAST.LINEAR FREQUENCY GAMMA GAMMA.DIST GAMMA.INV GAMMALN GAMMALN.PRECISE GAUSS GEOMEAN GROWTH HARMEAN HYPGEOM.DIST
INTERCEPT KURT LARGE LINEST LOGEST LOGNORM.DIST LOGNORM.INV MAX MAXA MAXIFS MEDIAN MIN MINIFS MINA MODE.MULT MODE.SNGL NEGBINOM.DIST NORM.DIST
NORM.INV NORM.S.DIST NORM.S.INV PEARSON PERCENTILE.EXC PERCENTILE.INC PERCENTRANK.EXC PERCENTRANK.INC PERMUT PERMUTATIONA PHI POISSON.DIST PROB
QUARTILE.EXC QUARTILE.INC RANK.AVG RANK.EQ RSQ SKEW SKEW.P SLOPE SMALL STANDARDIZE STDEV.P STDEV.S STDEVA STDEVPA STEYX T.DIST T.DIST.2T T.DIST.RT
T.INV T.INV.2T T.TEST TREND TRIMMEAN VAR.P VAR.S VARA VARPA WEIBULL.DIST Z.TEST`.split(/\s+/);
// Microsoft "Compatibility functions (reference)": the 39 statistical names.
const LEGACY = `BETADIST BETAINV BINOMDIST CHIDIST CHIINV CHITEST CONFIDENCE COVAR CRITBINOM EXPONDIST FDIST FINV FORECAST FTEST GAMMADIST GAMMAINV
HYPGEOMDIST LOGINV LOGNORMDIST MODE NEGBINOMDIST NORMDIST NORMINV NORMSDIST NORMSINV PERCENTILE PERCENTRANK POISSON QUARTILE RANK STDEV STDEVP
TDIST TINV TTEST VAR VARP WEIBULL ZTEST`.split(/\s+/);
const STOPS = ['descriptive', 'distributions', 'inference', 'hypothesis', 'correlation', 'regression', 'forecasting', 'eda', 'whatif', 'toolpak', 'legacy', 'gaps'];

test('metadata, head and SEO follow the lesson guide', () => {
  assert(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  assert.equal(meta.slug, SLUG);
  assert.equal(meta.title, 'Excel Statistical Functions: The Complete Map');
  assert.equal(meta.category, 'Power BI, Excel & SQL');
  assert.equal(meta.category_slug, 'power-bi-excel-sql');
  assert.equal(meta.level, 'Intermediate');
  assert.equal(meta.estimated_minutes, 90);
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, LESSON);
  assert(meta.search_keywords.length >= 5 && meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.equal(doc.title, 'Excel Statistical Functions: The Complete Map | UpSkill Sprint');
  assert(doc.title.length <= 65);
  const desc = doc.querySelector('meta[name="description"]').content;
  assert(desc.length >= 120 && desc.length <= 160, String(desc.length));
  assert.match(desc, /Excel statistical function/);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, desc);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  const teaser = doc.querySelector('meta[name="upskill:email-teaser"]').content;
  assert(teaser.length >= 40 && teaser.length <= 160 && !/[<>]|https?:/.test(teaser));
  const canonical = `https://upskillsprint.com${URL_PATH}`;
  assert.equal(doc.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, 'https://upskillsprint.com/assets/logo-og.png');
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const resource = ld['@graph'].find(n => n['@type'] === 'LearningResource');
  assert.equal(resource.description, desc);
  assert.equal(resource.url, canonical);
  assert.equal(resource.educationalLevel, 'Intermediate');
  for (const src of ['/theme.js', '/site-sections.js']) assert(html.includes(`<script src="${src}"></script>`));
  assert(html.includes('<script defer src="/assets/js/math.js"></script>'));
  assert(!/window\.MathJax\s*=/.test(html), 'uses only the shared math include');
  assert(html.indexOf('<link rel="stylesheet" href="/lessons-theme.css">') < html.indexOf('<style id="esm-style">'));
  assert.match(doc.querySelector('.esm-lede').textContent, /Excel statistical function/);
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
  assert.equal(doc.body.dataset.category, 'power-bi-excel-sql');
  assert.equal(doc.body.dataset.level, 'intermediate');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert(!doc.querySelector('#lesson-progress-widget'));
  assert.equal(doc.querySelector('[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#power-bi-excel-sql');
  let prev = 1;
  for (const h of doc.querySelectorAll('main h1, main h2, main h3, main h4')) {
    const level = Number(h.tagName[1]);
    assert(level <= prev + 1, `heading level skipped at ${h.textContent}`);
    prev = level;
  }
  const ids = [...doc.querySelectorAll('[id]')].map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const a of doc.querySelectorAll('main a[href^="#"]')) assert(doc.getElementById(a.getAttribute('href').slice(1)), `dead anchor ${a.getAttribute('href')}`);
  const styles = [...doc.querySelectorAll('style')];
  assert.equal(styles[styles.length - 1].id, 'excel-statistical-functions-map-dark-overrides');
  for (const wrap of doc.querySelectorAll('.esm-table-wrap')) {
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('role'), 'region');
    assert(wrap.getAttribute('aria-label'));
  }
});

test('lesson-owned CSS is namespaced and never restyles site chrome', () => {
  const css = doc.getElementById('esm-style').textContent;
  const dark = doc.getElementById('excel-statistical-functions-map-dark-overrides').textContent;
  const declared = [...(css + dark).matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]);
  assert(declared.length > 20);
  for (const name of declared) assert(name.startsWith('--lesson-esm-'), name);
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes[\s\S]*?\}\}/g, '').replace(/\{[^{}]*\}/g, '\n').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  for (const sel of selectors) {
    if (sel.startsWith('@media') || sel === '}') continue;
    assert.match(sel, /#lesson-content/, `selector not scoped to the lesson: ${sel}`);
  }
  // The only unscoped dark rules are the guide's §7.1 and §8 fixes.
  const darkSelectors = dark.replace(/\{[^{}]*\}/g, '\n').split('\n').map(s => s.trim()).filter(Boolean);
  assert.deepEqual(darkSelectors, ['html[data-theme="dark"] #lesson-content', 'html[data-theme="dark"] .quiz-section .lesson-kicker', 'html[data-theme="dark"] [aria-label="Return to lesson category"] a']);
});

test('every Excel statistical function, legacy name and ToolPak tool has a row', () => {
  assert.equal(STATISTICAL.length, 111);
  assert.equal(LEGACY.length, 39);
  const rows = [...doc.querySelectorAll('tr[data-esm-fn]')];
  const byCat = cat => rows.filter(r => r.dataset.esmCat === cat).map(r => r.dataset.esmFn);
  const modern = rows.filter(r => !['legacy', 'toolpak', 'gaps', 'whatif'].includes(r.dataset.esmCat)).map(r => r.dataset.esmFn);
  for (const fn of STATISTICAL) assert(modern.includes(fn), `missing ${fn}`);
  assert.deepEqual(byCat('legacy').sort(), [...LEGACY].sort());
  assert.equal(byCat('toolpak').length, 19);
  // The hero counts match the rows.
  const count = key => Number(doc.querySelector(`[data-esm-count="${key}"]`).textContent);
  assert.equal(count('statistical'), 111);
  assert.equal(count('tests'), rows.filter(r => r.dataset.esmCat === 'hypothesis').length);
  assert.equal(count('legacy'), byCat('legacy').length);
  assert.equal(count('toolpak'), byCat('toolpak').length);
  // Every function row shows its syntax; every legacy row names a modern function that has its own row.
  for (const r of rows.filter(r => !['toolpak', 'gaps', 'whatif', 'legacy'].includes(r.dataset.esmCat))) {
    const syntax = r.querySelectorAll('td')[0].textContent;
    assert(syntax.startsWith(r.dataset.esmFn + '('), `${r.dataset.esmFn} syntax: ${syntax}`);
  }
  for (const r of rows.filter(r => r.dataset.esmCat === 'legacy')) {
    assert(r.querySelectorAll('td')[0].textContent.startsWith(r.dataset.esmFn + '('));
    const modernNames = r.querySelectorAll('td')[1].textContent.replace(/^Use /, '').split(' or ');
    for (const m of modernNames) assert(modern.includes(m.trim()), `${r.dataset.esmFn} → ${m}`);
  }
});

test('the opening map links a goal tile to every section, and each stop has its own colour', () => {
  const tiles = [...doc.querySelectorAll('#esm-map .esm-goal')];
  assert.equal(tiles.length, 12);
  const targets = tiles.map(t => t.querySelector('a').getAttribute('href').slice(1));
  assert.deepEqual([...targets].sort(), STOPS.map(s => `esm-${s}`).sort());
  const nums = tiles.map(t => t.querySelector('.esm-goal-num').textContent);
  assert.deepEqual([...nums].sort(), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
  for (const t of tiles) {
    const sec = t.querySelector('a').getAttribute('href').slice(1);
    const stop = sec.replace('esm-', '');
    assert(t.classList.contains(`esm-c-${stop}`), `tile colour ${stop}`);
    assert(doc.getElementById(sec).classList.contains(`esm-c-${stop}`), `section colour ${stop}`);
    // The tile number matches the section's own "Map stop" label.
    assert.match(doc.getElementById(sec).querySelector('.esm-step').textContent, new RegExp(`Map stop ${t.querySelector('.esm-goal-num').textContent}`));
    assert(t.querySelector('.esm-goal-want').textContent.trim().split(/\s+/).length <= 8, 'poster goals stay short');
  }
  // Sections appear in the lesson in map-stop order.
  const order = [...doc.querySelectorAll('.esm-content > .esm-sec')].map(s => s.id);
  assert.deepEqual(order, [...STOPS.map(s => `esm-${s}`), 'esm-implementation']);
  // 13 distinct colours, defined for light and dark.
  const css = doc.getElementById('esm-style').textContent, dark = doc.getElementById('excel-statistical-functions-map-dark-overrides').textContent;
  const light = [...css.matchAll(/--lesson-esm-c-([a-z]+):(#[0-9a-f]{6})/g)];
  const darkC = [...dark.matchAll(/--lesson-esm-c-([a-z]+):(#[0-9a-f]{6})/g)];
  assert.equal(light.length, 13);
  assert.equal(new Set(light.map(m => m[2])).size, 13, 'light colours are distinct');
  assert.equal(new Set(darkC.map(m => m[2])).size, 13, 'dark colours are distinct');
  // Contrast: white on each light fill, near-black on each dark fill, at least 4.5:1.
  const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  for (const [, k, c] of light) assert(ratio(c, '#ffffff') >= 4.5, `light ${k} ${ratio(c, '#ffffff').toFixed(2)}`);
  for (const [, k, c] of darkC) assert(ratio(c, '#08141f') >= 4.5, `dark ${k} ${ratio(c, '#08141f').toFixed(2)}`);
  // The side map lists every section with its colour, and every section links back to the map.
  const toc = [...doc.querySelectorAll('.esm-toc a')].map(a => a.getAttribute('href'));
  for (const s of STOPS) assert(toc.includes(`#esm-${s}`));
  for (const sec of doc.querySelectorAll('.esm-sec')) assert(sec.querySelector('.esm-secnav a[href="#esm-map"]'), sec.id);
});

test('the function finder ranks names, typos and plain-language goals', () => {
  const { window, document, errors } = liveLesson();
  const S = (q, cat) => Array.from(window.UpskillESM.search(q, cat || '', 5), e => e.name);
  assert.equal(window.UpskillESM.entries.length, document.querySelectorAll('tr[data-esm-fn]').length);
  assert.equal(S('t.test')[0], 'T.TEST');
  assert.equal(S('stdv.s')[0], 'STDEV.S', 'typo tolerant');
  assert.equal(S('normsdist')[0], 'NORMSDIST');
  assert.equal(S('linst')[0], 'LINEST');
  assert.equal(S('compare two means')[0], 'T.TEST');
  assert.equal(S('ppm out of spec')[0], 'NORM.DIST');
  assert.equal(S('defects per unit')[0], 'POISSON.DIST');
  assert.equal(S('seasonal forecast')[0], 'FORECAST.ETS');
  assert.equal(S('best settings')[0], 'Solver (Simplex LP)');
  assert.equal(S('variance')[0], 'VAR.S');
  assert(S('confidence interval').includes('CONFIDENCE.T'));
  assert.deepEqual(S('tinv').slice(0, 3), ['TINV', 'T.INV', 'T.INV.2T']);
  assert(S('t', 'legacy').every(n => LEGACY.includes(n)), 'category filter');
  assert.deepEqual(S('zzzz qqqq'), []);
  // The UI renders linked results and announces them.
  const q = document.getElementById('esm-q');
  q.value = 'compare two means';
  q.dispatchEvent(new window.Event('input'));
  const first = document.querySelector('#esm-results a');
  assert.equal(first.getAttribute('href'), '#esm-fn-t-test');
  assert(document.getElementById(first.getAttribute('href').slice(1)));
  assert(first.closest('li').classList.contains('esm-c-hypothesis'), 'result carries its section colour');
  assert.match(document.getElementById('esm-status').textContent, /best matches for "compare two means"/);
  document.querySelector('[data-esm-try="tinv"]').click();
  assert.equal(document.querySelector('#esm-results .esm-hit-name').textContent, 'TINV');
  q.value = 'zzzz qqqq'; q.dispatchEvent(new window.Event('input'));
  assert.match(document.getElementById('esm-status').textContent, /No match/);
  const q2 = document.getElementById('esm-q2');
  q2.value = 'goal seek'; q2.dispatchEvent(new window.Event('input'));
  assert.equal(document.querySelector('#esm-mini a').getAttribute('href'), '#esm-wi-goal-seek');
  assert.deepEqual(errors, []);
});

test('tail translator: shading and probabilities match the t distribution', () => {
  // Student t with 9 df, integrated numerically (Simpson) to check the published values.
  const lg = x => { const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const c of g) s += c / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
  const pdf = x => Math.exp(lg(5) - lg(4.5)) / Math.sqrt(9 * Math.PI) * (1 + x * x / 9) ** -5;
  const simpson = (a, b, n = 4000) => { const h = (b - a) / n; let s = pdf(a) + pdf(b); for (let i = 1; i < n; i++) s += pdf(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  const right = simpson(2.1, 60);
  const { document, errors } = liveLesson();
  const svg = document.querySelector('#esm-tails svg');
  assert.equal(Number(svg.dataset.esmRight).toFixed(4), right.toFixed(4));
  assert.equal(Number(svg.dataset.esmLeft).toFixed(4), (1 - right).toFixed(4));
  assert.equal(Number(svg.dataset.esmBoth).toFixed(4), (2 * right).toFixed(4));
  const on = () => [...svg.querySelectorAll('.esm-tail.is-on')].map(p => p.dataset.esmRegion).sort();
  assert.deepEqual(on(), ['right']);
  document.querySelector('[data-esm-tail="both"]').click();
  assert.deepEqual(on(), ['lower', 'right']);
  assert.equal(document.querySelector('[data-esm-tail-formula]').textContent, '=T.DIST.2T(2.10, 9)');
  assert.equal(document.querySelector('[data-esm-tail-p]').textContent, '0.0651');
  assert.equal(document.querySelector('[data-esm-tail="both"]').getAttribute('aria-pressed'), 'true');
  document.querySelector('[data-esm-tail="left"]').click();
  assert.deepEqual(on(), ['left']);
  assert.equal(document.querySelector('[data-esm-tail-p]').textContent, '0.9674');
  assert.equal(document.getElementById('esm-tails').getAttribute('role'), 'group');
  assert.deepEqual(errors, []);
});

test('charts are accessible and their numbers match their data', () => {
  for (const svg of doc.querySelectorAll('#lesson-content svg.esm-svg')) {
    assert.equal(svg.getAttribute('role'), 'img');
    const [t, d] = svg.getAttribute('aria-labelledby').split(' ');
    assert(doc.getElementById(t).textContent.trim() && doc.getElementById(d).textContent.trim());
  }
  const box = doc.querySelector('#esm-boxplot svg');
  const data = box.dataset.esmValues.split(',').map(Number);
  const qexc = p => { const s = [...data].sort((a, b) => a - b), h = (s.length + 1) * p, lo = Math.floor(h); return s[lo - 1] + (h - lo) * (s[lo] - s[lo - 1]); };
  assert.equal(Number(box.dataset.esmQ1), qexc(0.25));
  assert.equal(Number(box.dataset.esmMedian), qexc(0.5));
  assert.equal(Number(box.dataset.esmQ3), qexc(0.75));
  const fence = qexc(0.75) + 1.5 * (qexc(0.75) - qexc(0.25));
  assert.equal(Number(box.dataset.esmUpperFence), fence);
  assert.deepEqual(box.dataset.esmOutliers.split(',').map(Number), data.filter(v => v > fence));
  const cap = doc.querySelector('#esm-boxplot figcaption').textContent;
  for (const v of [qexc(0.25), qexc(0.75), fence]) assert(cap.includes(String(v)), `caption ${v}`);
  const blend = doc.querySelector('#esm-blend svg');
  const shares = blend.dataset.esmShares.split(',').map(Number);
  assert.equal(shares.reduce((a, b) => a + b, 0), 100);
  const cu = 0.22 * shares[0] / 100 + 0.30 * shares[1] / 100 + 0.01 * shares[2] / 100;
  assert(Math.abs(cu - 0.18) < 1e-9, 'copper sits exactly at its limit');
  const cost = (420 * shares[0] + 380 * shares[1] + 520 * shares[2]) / 100;
  assert.equal(cost, Number(blend.dataset.esmCost));
  assert.match(doc.querySelector('[data-esm-cases]').textContent, /438\.75 per tonne/);
});

test('test picker answers each question and resets', () => {
  const { document, errors } = liveLesson();
  const buttons = [...document.querySelectorAll('#esm-picker [data-esm-q]')];
  assert.equal(buttons.length, 8);
  for (const b of buttons) {
    b.click();
    assert.equal(b.getAttribute('aria-pressed'), 'true');
    const out = document.getElementById('esm-picker-out');
    assert(out.textContent.includes(b.dataset.esmExcel) && out.textContent.includes(b.dataset.esmMinitab));
    const link = out.querySelector('a').getAttribute('href');
    assert(document.getElementById(link.slice(1)), link);
  }
  document.getElementById('esm-picker-reset').click();
  assert(buttons.every(b => b.getAttribute('aria-pressed') === 'false'));
  assert.match(document.getElementById('esm-picker-out').textContent, /Pick a question/);
  assert.deepEqual(errors, []);
});

test('Statistics Implementation is a closed, nudging dropdown with all four parts', () => {
  const details = doc.getElementById('esm-impl-details');
  assert.equal(details.tagName, 'DETAILS');
  assert(!details.hasAttribute('open'));
  const summary = details.querySelector('summary');
  assert.equal(summary.querySelector('h2').textContent, 'Statistics Implementation');
  assert.match(summary.querySelector('.esm-impl-hint').textContent, /Unlock the cheat codes/);
  for (const tease of summary.querySelectorAll('.esm-impl-tease > span')) assert(tease.textContent.split(/\s+/).length < 30);
  assert.deepEqual([...details.querySelectorAll('.esm-impl-body h3')].map(h => h.id), ['esm-impl-excel', 'esm-impl-cases', 'esm-impl-minitab', 'esm-impl-exam']);
  assert.equal(details.querySelectorAll('[data-esm-cases] > li').length, 7);
  const css = doc.getElementById('esm-style').textContent;
  assert.match(css, /@keyframes lesson-excel-statistical-functions-map-nudge/);
  assert.match(css, /\.esm-impl:not\(\[open\]\) \.esm-impl-hint\{animation:lesson-excel-statistical-functions-map-nudge/);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*animation:none/);
  const viaHash = liveLesson('#esm-impl-minitab');
  assert.equal(viaHash.document.getElementById('esm-impl-details').open, true);
  const viaLink = liveLesson();
  assert.equal(viaLink.document.getElementById('esm-impl-details').open, false);
  viaLink.document.querySelector('.esm-toc a[href="#esm-implementation"]').click();
  assert.equal(viaLink.document.getElementById('esm-impl-details').open, true);
});

test('quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', () => {
  const { window, document } = liveLesson();
  const results = [];
  document.addEventListener('upskill-quiz-result', e => results.push(e.detail));
  const qs = [...document.querySelectorAll('.quiz-question')];
  assert(qs.length >= 4);
  document.getElementById('quiz-submit').click();
  qs.forEach(q => { const wrong = [...q.querySelectorAll('input')].find(i => i.value !== q.dataset.answer); wrong.checked = true; });
  document.getElementById('quiz-submit').click();
  qs.forEach(q => { q.querySelector(`input[value="${q.dataset.answer}"]`).checked = true; });
  document.getElementById('quiz-submit').click();
  assert.deepEqual(JSON.parse(JSON.stringify(results)), [{ score: 0, total: qs.length }, { score: 0, total: qs.length }, { score: qs.length, total: qs.length }]);
  void window;
});

test('catalog entry, access SQL, related lessons and text budget', () => {
  const lib = read('chi-square-lesson-library.js');
  const entry = lib.split("marker: 'data-excel-statistical-functions-map',")[1].split('},')[0];
  assert.match(entry, new RegExp(`path: '${URL_PATH}'`));
  assert.match(entry, /sectionId: 'power-bi-excel-sql'/);
  assert.match(entry, /topic: 'power-bi-excel-sql'/);
  assert.match(entry, /level: 'intermediate'/);
  assert.match(entry, /<span>90 min<\/span>/);
  assert.match(entry, new RegExp(`title: '${meta.title}'`));
  assert(lib.includes("marker: 'data-beyond-the-bell',"));
  const sql = read('supabase/public-excel-statistical-functions-map-access.sql');
  assert.match(sql, new RegExp(`'lesson:${URL_PATH}', 'public'`));
  const related = [...doc.querySelectorAll('.related-lessons a')].map(a => a.getAttribute('href'));
  assert(related.length >= 3 && related.length <= 5);
  for (const href of related) {
    assert(fs.existsSync(path.join(ROOT, href + '.html')), href);
    assert(!href.endsWith('.html'));
  }
  for (const p of doc.querySelectorAll('main p')) {
    if (p.closest('#quiz')) continue;
    assert(p.textContent.trim().split(/\s+/).length <= 60, `paragraph too long: ${p.textContent.trim().slice(0, 60)}`);
  }
});

test('five full-map wall posters download as real one-page PDFs with previews', () => {
  const cards = [...doc.querySelectorAll('#esm-posters .esm-pcard')];
  assert.equal(cards.length, 5);
  const dir = 'assets/lessons/excel-statistical-functions-map/';
  const seen = new Set();
  for (const card of cards) {
    const a = card.querySelector('a[download]');
    const href = a.getAttribute('href');
    assert.match(href, new RegExp(`^/${dir}[a-z0-9-]+-poster\\.pdf$`));
    assert.match(a.textContent, /^Download PDF of the .+ poster$/);
    const pdf = fs.readFileSync(path.join(ROOT, href));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert(pdf.length < 10 * 1024 * 1024, `${href} is under 10 MB`);
    assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length, 1, `${href} is one page`);
    assert.match(pdf.toString('latin1'), /\/MediaBox\s*\[\s*0 0 1296 1728\s*\]/, `${href} is 18 x 24 in`);
    const kb = Math.round(pdf.length / 1024);
    assert.equal(Number(a.dataset.esmPosterKb), kb);
    assert(card.querySelector('.esm-pmeta').textContent.includes(`${kb} KB`), 'stated size matches the file');
    const img = card.querySelector('img');
    assert(fs.existsSync(path.join(ROOT, img.getAttribute('src'))), img.getAttribute('src'));
    assert(img.alt.startsWith('Preview of the') && img.getAttribute('width') === '480' && img.getAttribute('height') === '640');
    assert.equal(img.getAttribute('loading'), 'lazy');
    assert([...card.classList].some(c => /^esm-c-[a-z]+$/.test(c)), 'card carries a section colour');
    seen.add(href);
  }
  assert.equal(seen.size, 5);
  assert(doc.querySelector('.esm-cta a[href="#esm-posters"]'), 'hero links to the posters');
  // Fonts are embedded so the posters print the same everywhere.
  for (const href of seen) {
    const text = fs.readFileSync(path.join(ROOT, href), 'latin1');
    assert(text.includes('/FontFile2') || text.includes('/FontFile3'), `${href} embeds its fonts`);
    // UpSkill Sprint site header and footer: both wordmark images are embedded in every poster.
    assert((text.match(/\/Subtype\s*\/Image/g) || []).length >= 2, `${href} carries the site header and footer logos`);
  }
});

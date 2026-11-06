'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SLUG = 'mean-median-mode-and-spread';
const LESSON = `lessons/statistics/${SLUG}.html`;
const URL_PATH = `/lessons/statistics/${SLUG}`;
const TITLE = 'Introduction to Mean, Median, Mode, and Spread';
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const html = read(LESSON);
const guide = read('docs/LESSON_CREATION_GUIDE.md');
const doc = new JSDOM(html).window.document; // structure checks only, no scripts
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
const guideBlock = heading => guide.split(heading)[1].match(/```html\n([\s\S]*?)\n```/)[1].trim();
const words = el => el.textContent.trim().split(/\s+/).filter(Boolean).length;
const nums = s => s.split(',').map(Number);
const text = el => el.textContent.replace(/\s+/g, ' ').trim();

// Reference statistics, computed here independently of the page.
function stats(vals) {
  const n = vals.length, s = [...vals].sort((a, b) => a - b);
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  const ss = vals.reduce((a, v) => a + (v - mean) ** 2, 0);
  const q = p => { const pos = (n + 1) * p, lo = Math.floor(pos), f = pos - lo; return s[lo - 1] + (lo < n ? f * (s[lo] - s[lo - 1]) : 0); };
  return { mean, median, ss, sd: Math.sqrt(ss / (n - 1)), sdP: Math.sqrt(ss / n), q1: q(0.25), q3: q(0.75) };
}

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
  assert.equal(meta.title, TITLE);
  assert.equal(meta.category, 'Statistics');
  assert.equal(meta.category_slug, 'statistics');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.estimated_minutes, 30);
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, LESSON);
  assert(meta.search_keywords.length >= 5 && meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.equal(doc.title, `${TITLE} | UpSkill Sprint`);
  assert(doc.title.length <= 65);
  const desc = doc.querySelector('meta[name="description"]').content;
  assert(desc.length >= 120 && desc.length <= 160, String(desc.length));
  assert.match(desc, /mean, median and mode/);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, desc);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  const canonical = `https://upskillsprint.com${URL_PATH}`;
  assert.equal(doc.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, 'https://upskillsprint.com/assets/logo-og.png');
  const teaser = doc.querySelector('meta[name="upskill:email-teaser"]').content;
  assert(teaser.length >= 40 && teaser.length <= 160 && !/[<>]|https?:/.test(teaser));
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const resource = ld['@graph'].find(n => n['@type'] === 'LearningResource');
  assert.equal(resource.name, TITLE);
  assert.equal(resource.description, desc);
  assert.equal(resource.url, canonical);
  assert.equal(resource.educationalLevel, 'Beginner');
  const crumbs = ld['@graph'].find(n => n['@type'] === 'BreadcrumbList').itemListElement;
  assert.equal(crumbs[2].item, canonical);
  for (const src of ['/theme.js', '/site-sections.js']) assert(html.includes(`<script src="${src}"></script>`));
  assert(html.includes('<script defer src="/assets/js/math.js"></script>'), 'shared math include');
  assert(!/window\.MathJax\s*=/.test(html), 'no per-page MathJax config');
  assert(html.indexOf('<link rel="stylesheet" href="/lessons-theme.css">') < html.indexOf('<style id="mms-style">'));
  // The opening paragraph uses the main search phrase.
  assert.match(doc.querySelector('.mms-lede').textContent, /mean, median and mode/);
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
  for (const wrap of doc.querySelectorAll('.table-scroll')) {
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('role'), 'region');
    assert(wrap.getAttribute('aria-label'));
  }
  for (const th of doc.querySelectorAll('main th')) assert(th.textContent.trim(), 'no empty th');
});

test('a tight 4-colour palette: mode, median, mean and spread, plus status red and neutrals (guide §24.8)', () => {
  const css = doc.getElementById('mms-style').textContent;
  const hex = name => (css.match(new RegExp(`--lesson-mms-${name}:(#[0-9a-f]{6})`)) || [])[1];
  const palette = ['mode', 'median', 'mean', 'spread'].map(hex);
  assert.deepEqual(palette, ['#0f6b78', '#8a5300', '#17405a', '#4e6a12']);
  assert(!/--lesson-mms-green/.test(css), 'no fifth accent colour');
  // The poster tiles use exactly those four fills.
  const tileFills = [...css.matchAll(/\.mms-bignums li\.is-[a-z]+\{background:(#[0-9a-f]{6})\}/g)].map(m => m[1]);
  assert.deepEqual([...new Set(tileFills)].sort(), [...palette].sort());
});

test('lesson-owned CSS is namespaced and never restyles site chrome', () => {
  const css = doc.getElementById('mms-style').textContent + doc.getElementById(`${SLUG}-dark-overrides`).textContent;
  const declared = [...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]);
  assert(declared.length > 10);
  for (const name of declared) assert(name.startsWith('--lesson-mms-'), name);
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^{}]*\}/g, '\n').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  for (const sel of selectors) {
    if (sel.startsWith('@media') || sel === '}') continue;
    assert.match(sel, /#lesson-content/, `selector not scoped to the lesson: ${sel}`);
  }
});

test('visual-first: key-numbers poster, character cards, decision flow and short text', () => {
  const poster = doc.querySelector('.mms-hero #mms-poster');
  const vals = nums(poster.dataset.values), r = stats(vals);
  // The sorted data as chips, with the mode, the middle value and the outlier named in text, not colour alone.
  const chips = [...poster.querySelectorAll('.mms-chips li')];
  assert.deepEqual(chips.map(li => Number(li.querySelector('.mms-chip-v').textContent)), [...vals].sort((x, y) => x - y));
  assert.deepEqual(chips.map(li => (li.querySelector('.mms-chip-tag') || { textContent: '' }).textContent), ['', 'mode', 'mode', 'middle', '', '', 'outlier']);
  // Giant numbers: every one matches the data.
  const tiles = sel => [...poster.querySelectorAll(`${sel} li`)].map(li => [li.querySelector('.mms-num-name').textContent, li.querySelector('.mms-num').textContent.replace(/\s+/g, '')]);
  assert.deepEqual(tiles('.mms-bignums.is-center'), [['Mode', '15h'], ['Median', `${r.median}h`], ['Mean', `${r.mean}h`]]);
  const cv = (Math.round(r.sd / r.mean * 1000) / 10).toString();
  assert.deepEqual(tiles('.mms-bignums.is-spread'), [['Range', `${Math.max(...vals) - Math.min(...vals)}h`], ['Std dev', `${r.sd.toFixed(1)}h`], ['IQR', `${r.q3 - r.q1}h`], ['CV', `${cv}%`]]);
  for (const t of poster.querySelectorAll('.mms-num-do')) assert(words(t) <= 6, 'poster tiles stay short');
  // Pictogram row: one block per repair, filled when below the mean, crossed out for the outlier; the count is text.
  const row = poster.querySelector('.mms-picto-row');
  const below = vals.filter(v => v < r.mean).length;
  assert.equal(below, 5);
  assert.equal(row.querySelectorAll('rect.mms-pic').length, vals.length);
  assert.equal(row.querySelectorAll('rect.mms-pic.is-on').length, below);
  assert.equal(row.querySelectorAll('rect.mms-pic.is-bad').length, 1);
  assert.equal(row.querySelector('.mms-picto-big').textContent, `${below} of ${vals.length}`);
  // Donut gauge on CV and segmented bars on Range and IQR, drawn from the data.
  assert.equal(poster.querySelector('.has-gauge .mms-gauge').dataset.pct, cv);
  assert.equal(poster.querySelector('.has-gauge .mms-g-arc').getAttribute('stroke-dasharray'), `${cv} 100`);
  const iqrBar = poster.querySelector('.mms-segbar.is-iqr');
  assert.equal(iqrBar.dataset.on, '1,2', 'IQR lights the middle two quarters');
  assert.equal(iqrBar.querySelectorAll('rect.is-on').length, 2);
  assert.equal(poster.querySelector('.mms-segbar.is-range').querySelectorAll('rect.is-on').length, 4);
  for (const g of doc.querySelectorAll('svg.mms-gauge, svg.mms-segbar, svg.mms-picto, svg.mms-pipes')) assert.equal(g.getAttribute('aria-hidden'), 'true', 'decorative marks carry no text of their own');
  // Each measure of center is an explanation block: plain words, how-to steps, a watch-out and a quick check.
  const blocks = [...doc.querySelectorAll('#mms-center .mms-concept')];
  assert.deepEqual(blocks.map(c => c.querySelector('.mms-card-kicker').textContent), ['The people-pleaser', 'The diplomat', 'The popular kid']);
  for (const c of blocks) {
    assert.equal(c.querySelector('svg.mms-face').getAttribute('aria-hidden'), 'true');
    assert(c.querySelector('.mms-plain').textContent.startsWith('In plain words:'));
    assert(c.querySelectorAll('.mms-how li').length >= 3, 'numbered how-to steps');
    assert(c.querySelector('.mms-watch').textContent.startsWith('Watch out:'));
    const q = c.querySelector('details.mms-check');
    assert(q.querySelector('summary').textContent.includes('Quick check') && q.querySelector('.mms-check-a').textContent.trim());
  }
  // Spread is taught measure by measure, each with its answer as a big number from the data.
  const spreadBlocks = [...doc.querySelectorAll('#mms-spread .mms-concept')];
  assert.deepEqual(spreadBlocks.map(c => c.querySelector('h3').id), ['mms-range-h', 'mms-iqr-h', 'mms-sd-steps', 'mms-var-cv-h']);
  assert.deepEqual([...doc.querySelectorAll('#mms-spread .mms-answer-big')].map(p => p.textContent.replace(/\s+/g, '')), ['33h', `${r.q3 - r.q1}h`, `${cv}%`]);
  assert(doc.querySelectorAll('details.mms-check').length >= 5, 'a quick check for each key idea');
  // Line-ups: the median sits at position (n + 1) / 2; an even count averages the middle pair; quartiles at (n + 1) / 4.
  const lineVals = id => [...doc.querySelectorAll(`#${id} li`)].map(li => [Number(li.querySelector('.mms-line-v').textContent), li.className]);
  const odd = lineVals('mms-line-odd');
  assert.deepEqual(odd.filter(([, c]) => c).map(([v]) => v), [r.median]);
  const even = lineVals('mms-line-even'), pair = even.filter(([, c]) => c === 'is-pair').map(([v]) => v);
  assert.deepEqual(pair, [15, 18]);
  assert.match(doc.getElementById('mms-center').textContent, /16\.5/);
  const quart = lineVals('mms-line-quart');
  assert.deepEqual(quart.filter(([, c]) => c === 'is-q1' || c === 'is-q3').map(([v]) => v), [r.q1, r.q3]);
  // Key terms glossary.
  assert(doc.querySelectorAll('#mms-terms dt').length >= 10);
  for (const p of doc.querySelectorAll('main p')) {
    if (p.closest('.quiz-section')) continue;
    assert(words(p) <= 60, `paragraph over 60 words: ${text(p).slice(0, 60)}`);
  }
  const steps = [...doc.querySelectorAll('.mms-flow .mms-flow-step')];
  assert.equal(steps.length, 2);
  for (const st of steps) {
    assert(st.querySelector('.mms-flow-q').textContent.trim().endsWith('?'));
    assert(st.querySelector('.mms-flow-out .mms-flow-tag'));
  }
  assert.match(doc.querySelector('.mms-flow-end').textContent, /mean and standard deviation/);
  assert.equal(doc.querySelectorAll('.mms-warn-poster .mms-mistakes li').length, 4);
  // Text budget (§24.1, about 50 words per minute): teaching prose only. Infographic labels, tables, display formulas,
  // the quiz and the two reference sections (Statistics Implementation, Key terms) are not counted.
  const main = doc.querySelector('main').cloneNode(true);
  main.querySelectorAll('table, svg, .mms-math, .quiz-section, .related-lessons, script, style, .mms-line, .mms-stepper, .mms-hero-poster, .mms-reads, .mms-versus, .mms-toc, #mms-implementation, #mms-terms').forEach(n => n.remove());
  const prose = main.textContent.trim().split(/\s+/).length;
  assert(prose <= meta.estimated_minutes * 57, `prose words ${prose}`);
});

test('every chart is an accessible image whose text matches its data', () => {
  const svgs = [...doc.querySelectorAll('#lesson-content svg.mms-svg[role="img"]')];
  assert.equal(svgs.length, 5);
  for (const svg of svgs) {
    const [t, d] = svg.getAttribute('aria-labelledby').split(' ');
    assert(doc.getElementById(t).textContent.trim() && doc.getElementById(d).textContent.trim().length > 40);
    assert(!svg.querySelector('a, button, [tabindex]'), 'no focusable content inside role=img');
    assert(!/fill="#|stroke="#/.test(svg.outerHTML), 'colours come from lesson tokens');
    assert(svg.closest('figure').querySelector('figcaption').textContent.trim());
  }
  // Why both: identical means, very different spread, two pipes out of spec on Line B.
  const why = doc.querySelector('#mms-why svg.mms-svg');
  const a = stats(nums(why.dataset.lineA)), b = stats(nums(why.dataset.lineB));
  const [lsl, usl] = nums(why.dataset.spec);
  const outB = nums(why.dataset.lineB).filter(v => v < lsl || v > usl).length;
  assert.equal(outB, 2);
  assert.equal(a.mean.toFixed(1), '10.0');
  assert.equal(b.mean.toFixed(1), '10.0');
  assert.match(text(why), new RegExp(`SD ${a.sd.toFixed(2)}`));
  assert.match(text(why), new RegExp(`SD ${b.sd.toFixed(2)}`));
    assert.equal(nums(why.dataset.lineA).filter(v => v < lsl || v > usl).length, 0);
  const versus = [...doc.querySelectorAll('#mms-why .mms-vs-card')].map(c => [c.querySelector('.mms-vs-big').textContent, c.querySelector('.mms-vs-sd').textContent, c.querySelectorAll('.mms-pipe').length, c.querySelectorAll('.mms-pipe.is-bad').length]);
  assert.deepEqual(versus, [['6 of 6', `SD ${a.sd.toFixed(2)} mm`, 6, 0], ['4 of 6', `SD ${b.sd.toFixed(2)} mm`, 6, outB]]);
  assert.equal(why.querySelectorAll('rect.is-bad').length, outB);
  // Center: the repair times give mean 21, median 18, mode 15.
  const center = doc.querySelector('#mms-center svg.mms-svg');
  const repairs = nums(center.dataset.values);
  assert.deepEqual(repairs, [12, 15, 15, 18, 20, 22, 45]);
  const r = stats(repairs);
  assert.equal(r.mean, 21);
  assert.equal(r.median, 18);
  for (const label of ['Mean 21', 'Median 18', 'Mode 15', 'Outlier 45']) assert(text(center).includes(label), label);
  assert.match(text(center.closest('figure').querySelector('figcaption')), new RegExp(`${repairs.filter(v => v < 21).length} of ${repairs.length} repairs took less than the mean`));
  assert.equal(doc.querySelector('#mms-share-stat .mms-gauge').dataset.pct, (576 / 740 * 100).toFixed(1));
  assert.equal(repairs.reduce((s, v) => s + v, 0), 147);
  // Variance drawn as squares: each square's area is that value's squared distance from the mean.
  const sq = doc.querySelector('#mms-spread svg[aria-labelledby^="mms-sq"]');
  assert.equal(Number(sq.dataset.sumSquares), r.ss);
  assert.equal(r.ss, 740);
  const squares = [...sq.querySelectorAll('rect.mms-vsq')];
  assert.equal(squares.length, new Set(repairs).size);
  for (const rect of squares) {
    const v = Number(rect.dataset.value), side = Number(rect.getAttribute('width'));
    assert.equal(Number(rect.dataset.area), (v - r.mean) ** 2);
    assert.equal(rect.getAttribute('width'), rect.getAttribute('height'), 'drawn as true squares');
    assert(Math.abs(side - Math.abs(v - r.mean) * 7.6) < 0.01, 'side is to scale');
  }
  assert.equal(sq.querySelectorAll('rect.is-hot').length, 1);
  assert.match(text(sq), /576/);
  const top = (45 - r.mean) ** 2 / r.ss * 100;
  assert.match(text(doc.getElementById('mms-share-stat')), new RegExp(`${top.toFixed(1)}%`));
  // Box plot: Q1, Q3, IQR and the fence.
  const box = doc.querySelector('#mms-spread svg[aria-labelledby^="mms-box"]');
  const iqr = r.q3 - r.q1, fence = r.q3 + 1.5 * iqr;
  assert.deepEqual([Number(box.dataset.q1), Number(box.dataset.q3), Number(box.dataset.fence)], [r.q1, r.q3, fence]);
  for (const label of [`Q1 ${r.q1}`, `Q3 ${r.q3}`, `IQR ${iqr} h`, `Fence ${fence}`, 'Outlier 45']) assert(text(box).includes(label), label);
  // The worked SD table and the Excel results agree with the data.
  const rows = [...doc.querySelectorAll('#mms-sd-table tbody tr:not(.is-total)')].map(tr => [...tr.querySelectorAll('td')].map(td => Number(td.textContent.replace('−', '-'))));
  assert.deepEqual(rows.map(rw => rw[0]), [...repairs].sort((x, y) => x - y));
  for (const [x, dev, sq] of rows) { assert.equal(dev, x - r.mean); assert.equal(sq, (x - r.mean) ** 2); }
  assert.equal(doc.querySelector('#mms-sd-table tr.is-total td:last-child').textContent, String(r.ss));
  const excel = Object.fromEntries([...doc.querySelectorAll('#mms-excel-results tbody tr')].map(tr => [tr.cells[0].textContent, tr.cells[2].textContent]));
  assert.equal(excel.Mean, String(r.mean));
  assert.equal(excel.Median, String(r.median));
  assert.equal(excel.Mode, '15');
  assert.equal(excel.Range, '33');
  assert.equal(excel['Sample variance'], (r.ss / 6).toFixed(2));
  assert.equal(excel['Sample standard deviation'], r.sd.toFixed(2));
  assert.equal(excel['Population standard deviation'], r.sdP.toFixed(2));
  assert.equal(excel.IQR, String(iqr));
  assert.match(excel.CV, new RegExp(`^${(r.sd / r.mean * 100).toFixed(1)}%`));
});

test('statistics implementation has all four parts, in order', () => {
  const sec = doc.getElementById('mms-implementation');
  assert.equal(sec.querySelector('h2').textContent, 'Statistics Implementation');
  assert.deepEqual([...sec.querySelectorAll('h3')].map(h => h.textContent), ['Excel functions', 'Excel use cases', 'Minitab navigation', 'Exam tips']);
  const fnHead = [...sec.querySelector('table thead').querySelectorAll('th')].map(th => th.textContent);
  assert.deepEqual(fnHead, ['Function', 'Syntax', 'Purpose', 'When to use it']);
  const fns = [...sec.querySelectorAll('table')[0].querySelectorAll('tbody tr td:first-child')].map(td => td.textContent);
  for (const fn of ['AVERAGE', 'MEDIAN', 'MODE.SNGL', 'MODE.MULT', 'VAR.S', 'VAR.P', 'STDEV.S', 'STDEV.P', 'QUARTILE.EXC', 'QUARTILE.INC']) assert(fns.includes(fn), fn);
  const paths = [...sec.querySelectorAll('table')[2].querySelectorAll('code')].map(c => c.textContent);
  assert(paths.includes('Stat → Basic Statistics → Display Descriptive Statistics'));
  assert(paths.includes('Stat → Basic Statistics → Graphical Summary'));
  assert(sec.querySelectorAll('.mms-tips li').length >= 4);
});

test('every internal link and in-page anchor resolves', () => {
  for (const link of doc.querySelectorAll('a[href^="#"]')) {
    assert(doc.getElementById(link.getAttribute('href').slice(1)), link.getAttribute('href'));
  }
  const lessonLinks = [...doc.querySelectorAll('#lesson-content a[href^="/lessons/"]')].map(link => link.getAttribute('href'));
  assert(lessonLinks.length >= 3);
  for (const href of lessonLinks) {
    assert(!href.endsWith('.html'), `extensionless: ${href}`);
    assert(fs.existsSync(path.join(ROOT, `${href.slice(1)}.html`)), `missing lesson: ${href}`);
  }
  const related = doc.querySelectorAll('.related-lessons li a');
  assert(related.length >= 3 && related.length <= 5);
});

test('registered in the Statistics catalog with a public access SQL file', () => {
  const lib = read('chi-square-lesson-library.js');
  const entry = lib.match(/\{\s*marker: 'data-mean-median-mode-and-spread',[\s\S]*?\n {4}\}/);
  assert(entry, 'catalog entry');
  const e = entry[0];
  assert.match(e, /sectionId: 'statistics'/);
  assert.match(e, /topic: 'statistics'/);
  assert.match(e, new RegExp(`path: '${URL_PATH}'`));
  assert.match(e, /level: 'beginner'/);
  assert.match(e, /interactive: 'true'/);
  assert.match(e, /<span>30 min<\/span>/);
  assert(e.includes(`title: '${TITLE}'`));
  assert(e.includes(`description: '${meta.card_description}'`));
  assert(lib.includes("marker: 'data-beyond-the-bell',"), 'build insertion point intact');

  const sql = read('supabase/public-mean-median-mode-and-spread-access.sql');
  assert(sql.includes(`'lesson:${URL_PATH}', 'public', '${TITLE}', true, now()`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert(!/\b(create|alter|drop|grant)\b/i.test(sql), 'data only, no schema changes');
});

test('the drag-the-outlier lab recomputes center and spread and says which pair to report', () => {
  const { window, document, errors } = liveLesson();
  const slider = document.getElementById('mms-wild');
  const read = id => document.getElementById(`mms-out-${id}`).textContent;
  const verdict = () => document.getElementById('mms-verdict').textContent;
  const lab = document.querySelector('.mms-lab');
  assert.equal(lab.getAttribute('role'), 'group');
  assert.equal(document.querySelector('label[for="mms-wild"]').textContent.includes('Last repair time'), true);
  const set = v => { slider.value = String(v); slider.dispatchEvent(new window.Event('input', { bubbles: true })); };

  // Starts at the worked example.
  assert.deepEqual(['mean', 'median', 'mode', 'sd', 'iqr'].map(read), ['21', '18', '15', '11.1', '7']);
  assert.equal(verdict(), 'The 45 is an outlier. The mean sits 3 hours above the median. Report the median and IQR.');
  const svg = document.getElementById('mms-lab-svg');
  // The seesaw holds 7 weights with the fulcrum at the mean; the line-up crowns the middle value; the tally stacks the mode.
  assert.equal(svg.querySelectorAll('circle.mms-w').length, 7);
  assert.equal(svg.querySelectorAll('circle.mms-w.is-out').length, 1);
  assert(svg.querySelector('polygon.mms-fulcrum'));
  assert.equal(svg.querySelector('polygon.mms-fulcrum').getAttribute('points').split(' ')[0].split(',')[0], String(24 + 21 / 100 * 312));
  const toks = [...svg.querySelectorAll('.mms-tok-t')].map(t => t.textContent);
  assert.deepEqual(toks, ['12', '15', '15', '18', '20', '22', '45']);
  assert.equal(svg.querySelector('.mms-tok-t.is-mid').textContent, '18');
  assert.equal(svg.querySelectorAll('rect.mms-blk.is-mode').length, 2);

  // Pull the outlier in: no outlier left, mean and median nearly agree, two modes.
  set(22);
  assert.equal(document.getElementById('mms-wild-out').textContent, '22');
  const base = [12, 15, 15, 18, 20, 22];
  const s22 = stats(base.concat(22));
  assert.equal(read('mean'), String(Math.round(s22.mean * 10) / 10));
  assert.equal(read('median'), '18');
  assert.equal(read('mode'), '15, 22');
  assert.equal(read('sd'), String(Math.round(s22.sd * 10) / 10));
  assert.equal(svg.querySelectorAll('circle.mms-w.is-out').length, 0);
  assert.equal(svg.querySelectorAll('rect.mms-blk.is-mode').length, 4, 'two values tie for mode');
  assert.match(verdict(), /below the median\. The mean and standard deviation are fine here\.$/);

  // Push it far out: the median holds, the mean and SD jump.
  set(100);
  const s100 = stats(base.concat(100));
  assert.equal(read('median'), '18');
  assert.equal(read('iqr'), '7');
  assert.equal(read('mean'), String(Math.round(s100.mean * 10) / 10));
  assert(Number(read('sd')) > 30);
  assert.match(verdict(), /^The 100 is an outlier\./);

  document.getElementById('mms-reset').click();
  assert.equal(slider.value, '45');
  assert.equal(read('mean'), '21');
  assert.deepEqual(errors, []);
  window.close();
});

test('the standard deviation stepper reveals one step at a time and lights the table column', () => {
  const { window, document, errors } = liveLesson();
  const root = document.getElementById('mms-stepper');
  assert(root.classList.contains('is-live'));
  const btns = [...root.querySelectorAll('.mms-stepbtn')];
  const panels = [...root.querySelectorAll('.mms-steppanel')];
  assert.equal(btns.length, 5);
  assert(btns.every(b => b.getAttribute('type') === 'button'));
  const visible = () => panels.filter(p => !p.hidden).map(p => p.querySelector('.mms-steppanel-big').textContent);
  assert.deepEqual(visible(), ['21 h']);
  assert.equal(btns[0].getAttribute('aria-pressed'), 'true');
  const lit = () => [...document.querySelectorAll('#mms-sd-table .is-lit')].map(c => c.textContent);
  assert.deepEqual(lit(), []);
  btns[2].click();
  assert.deepEqual(visible(), ['740']);
  assert.deepEqual(btns.map(b => b.getAttribute('aria-pressed')), ['false', 'false', 'true', 'false', 'false']);
  assert(btns[0].classList.contains('is-done') && btns[1].classList.contains('is-done') && !btns[3].classList.contains('is-done'));
  assert.equal(lit().at(-1), '740', 'the squared column, total included, is lit');
  assert.equal(lit().length, 9);
  btns[1].click();
  assert.match(visible()[0], /^-9 to \+24$/);
  btns[3].click();
  assert.deepEqual(visible(), ['123.3 h²']);
  assert.deepEqual(lit(), []);
  btns[4].click();
  assert.deepEqual(visible(), ['11.1 h']);
  assert.deepEqual(errors, []);
  window.close();
});

test('the quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', () => {
  const { window, document, errors } = liveLesson();
  const events = [];
  document.addEventListener('upskill-quiz-result', e => events.push({ score: e.detail.score, total: e.detail.total }));
  const submit = () => document.getElementById('quiz-submit').click();
  const questions = [...document.querySelectorAll('#quiz-form .quiz-question')];
  assert.equal(questions.length, 8);
  const answers = questions.map(q => q.dataset.answer);
  assert.deepEqual(answers, ['b', 'c', 'a', 'b', 'a', 'c', 'b', 'c']);
  for (const q of questions) assert(q.dataset.explanation.length > 40);

  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 8 });
  assert.match(document.getElementById('quiz-result').textContent, /8 unanswered/);

  answers.forEach((ans, i) => {
    const wrong = [...questions[i].querySelectorAll('input')].find(radio => radio.value !== ans);
    wrong.checked = true;
  });
  submit();
  assert.deepEqual(events.pop(), { score: 0, total: 8 });
  assert.match(questions[0].querySelector('.quiz-feedback').textContent, /Not quite/);

  answers.forEach((ans, i) => { questions[i].querySelector(`input[value="${ans}"]`).checked = true; });
  submit();
  assert.deepEqual(events.pop(), { score: 8, total: 8 });
  assert.match(document.getElementById('quiz-result').textContent, /Score: 8 \/ 8/);
  assert.deepEqual(errors, []);
  window.close();
});

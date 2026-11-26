'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const slug = 'cusum-vs-ewma-control-charts';
const pagePath = 'lessons/quality-engineering/' + slug + '.html';
const html = fs.readFileSync(path.join(root, pagePath), 'utf8');
const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
const doc = new JSDOM(html).window.document;
const assets = path.join(root, 'assets/lessons', slug);
const metadata = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)\s*-->/)[1]);

function guideBlock(heading) {
  const start = guide.indexOf(heading);
  assert.ok(start >= 0, 'guide heading: ' + heading);
  const begin = guide.indexOf('```html', start);
  const end = guide.indexOf('\n```', begin + 7);
  assert.ok(begin >= 0 && end > begin, 'fenced HTML in guide');
  return guide.slice(begin + 7, end).trim();
}

function catalogEntry() {
  const start = catalog.indexOf("marker: 'data-cusum-ewma-control-charts'");
  assert.ok(start > 0, 'catalog entry');
  return catalog.slice(catalog.lastIndexOf('{', start), catalog.indexOf('}', start) + 1);
}

/* Independent re-implementation of the lesson's formulas, used to check every chart number. */
function cusumEwma(xs, mu, sigma, k = 0.5, h = 4, lambda = 0.2, L = 3) {
  let up = 0, lo = 0, z = mu;
  const rows = xs.map((x, idx) => {
    const i = idx + 1;
    up = Math.max(0, up + x - mu - k * sigma);
    lo = Math.max(0, lo + mu - x - k * sigma);
    z = lambda * x + (1 - lambda) * z;
    const b = L * sigma * Math.sqrt(lambda / (2 - lambda) * (1 - Math.pow(1 - lambda, 2 * i)));
    return { i, x, up, lo: -lo, z, ucl: mu + b, lcl: mu - b };
  });
  const H = h * sigma;
  const firstCusum = rows.find(r => r.up > H || -r.lo > H);
  const firstEwma = rows.find(r => r.z > r.ucl || r.z < r.lcl);
  return { rows, H, firstCusum: firstCusum ? firstCusum.i : null, firstEwma: firstEwma ? firstEwma.i : null };
}

const csvLines = fs.readFileSync(path.join(assets, 'CUSUM_EWMA_Minitab_Practice_Data.csv'), 'utf8').trim().split(/\r?\n/);
const header = csvLines[0].split(',');
const column = name => csvLines.slice(1).map(line => Number(line.split(',')[header.indexOf(name)]));
const CASES = {
  pipe: ['Pipe_Wall_mm', 6.40, 0.04, 33, 33],
  reactor: ['Reactor_Temp_C', 210, 1.5, 63, 69],
  fill: ['Fill_Weight_g', 500, 2, 37, 38],
  ore: ['Ore_Grade_pct', 1.25, 0.035, null, null]
};

test('metadata, exact skeleton bytes, canonical chrome and catalog agree', () => {
  assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  assert.equal(metadata.slug, slug);
  assert.equal(metadata.category_slug, 'quality-engineering');
  assert.equal(metadata.level, 'Intermediate');
  assert.equal(metadata.estimated_minutes, 75);
  assert.equal(metadata.interactive, true);
  assert.equal(metadata.suggested_github_path, pagePath);
  assert.ok(metadata.search_keywords.length >= 5);
  assert.equal(doc.querySelectorAll('main#lesson-content').length, 1);
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelector('main#lesson-content h1').textContent.trim(), metadata.title);
  assert.ok(html.includes(guideBlock('### 4.1 Header')));
  assert.ok(html.includes(guideBlock('### 4.2 Footer')));
  assert.ok(html.includes(guideBlock('### 7.1 Quiz styles')));
  assert.ok(html.includes(guideBlock('### 7.3 Quiz grader')));
  const body = doc.body;
  assert.equal(body.getAttribute('data-category'), 'quality-engineering');
  assert.equal(body.getAttribute('data-level'), 'intermediate');
  assert.equal(body.getAttribute('data-interactive'), 'true');
  assert.ok(html.includes('<script src="/theme.js"></script>'));
  assert.ok(html.includes('<script src="/site-sections.js"></script>'));
  assert.ok(html.includes('<script defer src="/assets/js/math.js"></script>'));
  assert.doesNotMatch(html, /lesson-progress-widget|Skip to (lesson|main) content/i);
  const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'unique ids');
  const entry = catalogEntry();
  assert.match(entry, /sectionId: 'quality-engineering'/);
  assert.match(entry, /topic: 'quality-engineering'/);
  assert.match(entry, /level: 'intermediate'/);
  assert.match(entry, /interactive: 'true'/);
  assert.match(entry, /<span>75 min<\/span>/);
  assert.match(entry, new RegExp("title: '" + metadata.card_title.replace(/[.]/g, '\\.') + "'"));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  // New intermediate lesson is appended after the existing Quality Engineering rows (§12.6).
  assert.ok(catalog.indexOf("path: '/lessons/complete-14-quality-tools-project'") < catalog.indexOf("path: '/lessons/" + 'quality-engineering/' + slug + "'"));
  assert.ok(doc.querySelector('[aria-label="Return to lesson category"] a[href="/lessons#quality-engineering"]'));
  const lastStyle = [...doc.body.children].filter(el => el.tagName === 'STYLE').pop();
  assert.ok(lastStyle && /dark-overrides$/.test(lastStyle.id));
});

test('SEO: title, description, structured data and verified related lessons', () => {
  assert.ok(doc.title.endsWith(' | UpSkill Sprint'));
  assert.ok(doc.title.length <= 65);
  const description = doc.querySelector('meta[name="description"]').content;
  assert.ok(description.length >= 120 && description.length <= 160);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, description);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  const canonical = 'https://upskillsprint.com/' + pagePath.replace(/\.html$/, '');
  assert.equal(doc.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, 'https://upskillsprint.com/assets/logo-og.png');
  const teaser = doc.querySelector('meta[name="upskill:email-teaser"]').content;
  assert.ok(teaser.length >= 40 && teaser.length <= 160 && !/[<>!]|https?:/.test(teaser));
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const lr = ld['@graph'].find(item => item['@type'] === 'LearningResource');
  assert.equal(lr.url, canonical);
  assert.equal(lr.description, description);
  assert.equal(lr.educationalLevel, metadata.level);
  assert.ok(ld['@graph'].some(item => item['@type'] === 'BreadcrumbList'));
  const lead = doc.querySelector('.ce-hero-lead').textContent;
  assert.match(lead, /CUSUM and EWMA control charts/);
  const related = [...doc.querySelectorAll('.related-lessons a')];
  assert.ok(related.length >= 3 && related.length <= 5);
  for (const a of related) {
    const href = a.getAttribute('href');
    assert.match(href, /^\/lessons\//);
    assert.ok(fs.existsSync(path.join(root, href + '.html')), href);
  }
  for (const a of doc.querySelectorAll('main a[href^="/lessons/"]')) {
    assert.ok(fs.existsSync(path.join(root, a.getAttribute('href') + '.html')), a.getAttribute('href'));
  }
});

test('lesson CSS is scoped: no rule can restyle the site chrome', () => {
  const css = doc.getElementById('cusum-ewma-lesson-style').textContent.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors = [];
  const ruleRe = /([^{}@]+)\{[^{}]*\}/g;
  let m;
  while ((m = ruleRe.exec(css))) selectors.push(...m[1].split(',').map(s => s.trim()).filter(Boolean));
  assert.ok(selectors.length > 80);
  for (const sel of selectors) {
    if (/^(\d+%|from|to)(\s*,|$)/.test(sel) || /^\d+%/.test(sel)) continue; // keyframe steps
    assert.match(sel, /#lesson-content/, 'unscoped selector: ' + sel);
    assert.doesNotMatch(sel, /\b(header|footer|\.site\b|\.brand|\.footer-grid|\.desktop-nav|\.theme-toggle|\.nav-)/, 'chrome selector: ' + sel);
  }
  // Lesson custom properties are namespaced; no site token is redefined.
  for (const [, name] of css.matchAll(/(--[\w-]+)\s*:/g)) assert.match(name, /^--lesson-/, name);
  // Lesson-owned classes carry the ce- prefix, so theme.js never repaints them (.callout, .lesson-wrapper …).
  const lessonClasses = new Set([...doc.querySelectorAll('main [class]')].flatMap(el => [...el.classList]));
  const allowed = /^(ce-|quiz|lesson-kicker$|related-lessons$|is-correct$|is-incorrect$|show$|good$|bad$|warn$)/;
  for (const cls of lessonClasses) assert.match(cls, allowed, 'unprefixed lesson class: ' + cls);
  assert.match(css, /@keyframes lesson-cusum-vs-ewma-control-charts-nudge/);
  assert.match(css, /prefers-reduced-motion:reduce\)\s*\{[^}]*ce-impl:not\(\[open\]\) \.ce-impl-pill \{animation:none\}/);
});

test('math is LaTeX: no plain-text symbols in lesson prose', () => {
  const clone = doc.querySelector('main#lesson-content').cloneNode(true);
  clone.querySelectorAll('script, style, svg, code, [aria-hidden="true"]').forEach(el => el.remove());
  const text = clone.textContent.replace(/\\\[[\s\S]*?\\\]/g, ' ').replace(/\\\([\s\S]*?\\\)/g, ' ');
  for (const ch of ['σ', 'μ', 'λ', '₀', '⁺', '⁻', 'ᵢ', '√', '≤', '≥']) assert.ok(!text.includes(ch), 'plain-text math symbol ' + ch);
  assert.doesNotMatch(text, /\$[^$\d]/, 'no $ delimiters');
  assert.ok(html.includes(String.raw`\[ C_i^{+}=\max`));
  assert.ok(html.includes(String.raw`\[ Z_i=\lambda x_i+(1-\lambda)Z_{i-1} \]`));
});

test('visual-first: poster, roadmap, warning poster and text budget', () => {
  const poster = doc.querySelector('.ce-poster');
  assert.equal(poster.getAttribute('role'), 'group');
  assert.equal(poster.querySelectorAll('svg[role="img"][aria-label]').length, 2);
  assert.equal(doc.querySelectorAll('.ce-roadmap > li').length, 7);
  assert.equal(doc.querySelectorAll('.ce-warn-poster .ce-warn').length, 8);
  assert.equal(doc.querySelectorAll('.ce-tiles .ce-tile').length, 6);
  // No SVG colour attributes: colours come from classes so dark mode works.
  for (const el of doc.querySelectorAll('main svg *')) {
    assert.ok(!el.hasAttribute('fill') && !el.hasAttribute('stroke'), 'inline colour on ' + el.tagName);
  }
  // §24.1 text budget: about 50 words per estimated minute, quiz and charts excluded.
  const clone = doc.querySelector('main#lesson-content').cloneNode(true);
  clone.querySelectorAll('script, style, svg, #quiz').forEach(el => el.remove());
  const text = clone.textContent.replace(/\\\[[\s\S]*?\\\]/g, ' M ').replace(/\\\([\s\S]*?\\\)/g, ' M ');
  const words = text.split(/\s+/).filter(Boolean).length;
  assert.ok(words <= metadata.estimated_minutes * 50, words + ' words for ' + metadata.estimated_minutes + ' minutes');
  for (const p of doc.querySelectorAll('main p')) {
    const n = p.textContent.replace(/\\\([\s\S]*?\\\)/g, ' M ').split(/\s+/).filter(Boolean).length;
    assert.ok(n <= 60, 'paragraph over 60 words: ' + p.textContent.slice(0, 60));
  }
});

test('every recalculated chart is inline SVG whose numbers match the CSV', () => {
  assert.equal(csvLines.length, 101);
  assert.equal(column('Ore_Grade_pct')[44], 1.398);
  const charts = [...doc.querySelectorAll('svg.ce-chart')];
  assert.equal(charts.length, 6);
  for (const svg of charts) {
    const [, key, kind] = svg.id.match(/^ce-(\w+)-(cusum|ewma)$/);
    const [col, mu, sigma, firstC, firstE] = CASES[key];
    const result = cusumEwma(column(col), mu, sigma);
    assert.equal(result.firstCusum, firstC, key + ' CUSUM first signal');
    assert.equal(result.firstEwma, firstE, key + ' EWMA first signal');
    const expectedFirst = kind === 'cusum' ? firstC : firstE;
    assert.equal(svg.getAttribute('data-first-signal'), expectedFirst ? String(expectedFirst) : 'none', svg.id);
    const titleId = svg.getAttribute('aria-labelledby').split(' ');
    assert.equal(svg.getAttribute('role'), 'img');
    assert.ok(svg.querySelector('title#' + titleId[0]) && svg.querySelector('desc#' + titleId[1]));
    const caption = svg.closest('figure').querySelector('figcaption').textContent;
    if (expectedFirst) {
      assert.match(caption, new RegExp('sample ' + expectedFirst + '\\b'), svg.id + ' caption');
      assert.match(svg.textContent, new RegExp('First signal: sample ' + expectedFirst + '\\b'));
    } else {
      assert.match(caption, /No limit is crossed/);
    }
    const series = kind === 'cusum'
      ? [['upper', result.rows.map(r => r.up)], ['lower', result.rows.map(r => r.lo)], ['ucl', result.rows.map(() => result.H)]]
      : [['ewma', result.rows.map(r => r.z)], ['ucl', result.rows.map(r => r.ucl)], ['lcl', result.rows.map(r => r.lcl)]];
    for (const [name, expected] of series) {
      const actual = JSON.parse(svg.getAttribute('data-' + name));
      assert.equal(actual.length, 100);
      actual.forEach((v, i) => assert.ok(Math.abs(v - expected[i]) < 6e-5, `${svg.id} ${name}[${i}]`));
    }
  }
  // The results table and case badges quote the same first signals.
  const rows = [...doc.querySelectorAll('[aria-label="First signals for the four cases"] tbody tr')].map(tr => [...tr.cells].map(c => c.textContent.trim()));
  assert.deepEqual(rows.map(r => [r[2], r[3]]), [['33', '33'], ['63', '69'], ['37', '38'], ['None', 'None']]);
  const ore = cusumEwma(column('Ore_Grade_pct'), 1.25, 0.035);
  assert.equal(Math.max(...ore.rows.map(r => r.up)).toFixed(4), '0.1386');
  assert.equal(((1.398 - 1.25) / 0.035).toFixed(2), '4.23');
  assert.match(doc.getElementById('minitab-cases').textContent, /4\.23 standard deviations/);
});

test('worked example and practice answer match the formulas', () => {
  const six = cusumEwma([6.45, 6.45, 6.45, 6.45, 6.45, 6.45, 6.45], 6.40, 0.04);
  assert.equal(six.firstCusum, 6);
  assert.equal(six.firstEwma, 7);
  const ewmaRows = [...doc.querySelectorAll('[aria-label="EWMA worked example limits"] tbody tr')];
  ewmaRows.forEach((tr, i) => {
    assert.equal(tr.cells[1].textContent.trim(), six.rows[i].z.toFixed(4));
    assert.equal(tr.cells[2].textContent.trim(), six.rows[i].ucl.toFixed(4));
  });
  const cusumRows = [...doc.querySelectorAll('[aria-label="CUSUM worked example readings"] tbody tr')];
  cusumRows.forEach((tr, i) => assert.equal(tr.cells[2].textContent.trim(), six.rows[i].up.toFixed(2)));
  const fill = cusumEwma([497, 497, 497, 497, 497, 497], 500, 2);
  assert.deepEqual(fill.rows.slice(0, 3).map(r => -r.lo), [2, 4, 6]);
  assert.equal(fill.firstCusum, 5);
});

test('assets and downloads exist, images are honest screenshots only', () => {
  const downloads = [...doc.querySelectorAll('.ce-downloads a[download]')];
  assert.equal(downloads.length, 3);
  for (const a of downloads) {
    const file = path.join(root, a.getAttribute('href'));
    assert.ok(fs.existsSync(file), a.getAttribute('href'));
    assert.match(a.textContent, /\((CSV|Excel \.xlsx|\.mpx)/);
  }
  const imgs = [...doc.querySelectorAll('main img')];
  assert.deepEqual(imgs.map(i => path.basename(i.getAttribute('src'))), ['pipe-cusum-original-minitab.png', 'ore-cusum-original-minitab.png']);
  for (const img of imgs) {
    assert.ok(img.getAttribute('alt').length > 40 && img.getAttribute('width') && img.getAttribute('height'));
    assert.equal(img.getAttribute('loading'), 'lazy');
    const bytes = fs.readFileSync(path.join(root, img.getAttribute('src')));
    assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
    assert.ok(bytes.length < 500_000);
  }
  assert.doesNotMatch(html, /data:image\/|base64,/);
  assert.ok(!fs.existsSync(path.join(root, 'lessons/quality-engineering/cusum-ewma-assets')), 'legacy wrappers removed');
});

test('interactive lab, reveal answer, reset and quiz progress event', () => {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const win = new JSDOM(html, { url: 'https://upskillsprint.com/lessons/quality-engineering/' + slug, runScripts: 'dangerously', virtualConsole }).window;
  const d = win.document;
  const expectedDefault = cusumEwma(d.getElementById('readings').value.split(/[\s,]+/).filter(Boolean).map(Number), 6.40, 0.04);
  assert.equal(d.getElementById('lab-n').textContent, '24');
  assert.equal(d.getElementById('lab-cusum-signal').textContent, '#' + expectedDefault.firstCusum);
  assert.equal(d.getElementById('lab-ewma-signal').textContent, '#' + expectedDefault.firstEwma);
  assert.ok(d.querySelectorAll('#live-cusum path.ce-limit').length === 2 && d.querySelector('#live-cusum path.ce-up'));
  assert.equal(d.querySelectorAll('#calc-rows tr').length, 12);
  d.getElementById('preset-spike').click();
  assert.match(d.getElementById('readings').value, /6\.549/);
  assert.equal(d.getElementById('lab-cusum-signal').textContent, 'None');
  d.getElementById('lambda').value = '0.5';
  d.getElementById('lambda').dispatchEvent(new win.Event('input'));
  assert.equal(d.getElementById('lambda-value').textContent, '0.50');
  d.getElementById('calc-reset').click();
  assert.doesNotMatch(d.getElementById('readings').value, /6\.549/);
  assert.equal(d.getElementById('lambda').value, '0.2');
  d.getElementById('sigma').value = '-1';
  d.getElementById('calc-update').click();
  assert.equal(d.getElementById('lab-status').getAttribute('aria-invalid'), 'true');
  assert.match(d.getElementById('lab-status').textContent, /standard deviation, k and h must be above zero/);
  d.getElementById('sigma').value = '0.04';
  d.getElementById('calc-update').click();
  assert.equal(d.getElementById('lab-status').getAttribute('aria-invalid'), 'false');
  d.getElementById('readings').value = '6.4, abc';
  d.getElementById('calc-update').click();
  assert.match(d.getElementById('lab-status').textContent, /3 and 80/);
  const reveal = d.getElementById('reveal-answer');
  assert.equal(reveal.getAttribute('aria-expanded'), 'false');
  assert.ok(d.getElementById('practice-answer').hidden);
  reveal.click();
  assert.equal(reveal.getAttribute('aria-expanded'), 'true');
  assert.ok(!d.getElementById('practice-answer').hidden);
  // Quiz: unanswered, wrong and all-correct submissions all dispatch upskill-quiz-result.
  const events = [];
  d.addEventListener('upskill-quiz-result', e => events.push({ score: e.detail.score, total: e.detail.total }));
  d.getElementById('quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 0, total: 5 });
  d.querySelector('#quiz-form input[name="q1"][value="a"]').checked = true;
  d.getElementById('quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 0, total: 5 });
  ['b', 'c', 'a', 'b', 'c'].forEach((value, i) => { d.querySelector('#quiz-form input[name="q' + (i + 1) + '"][value="' + value + '"]').checked = true; });
  d.getElementById('quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 5, total: 5 });
  d.getElementById('quiz-reset').click();
  assert.equal(d.querySelectorAll('#quiz-form input:checked').length, 0);
  assert.equal(d.getElementById('quiz-result').textContent, '');
  assert.deepEqual(errors, []);
  win.close();
});

test('Statistics Implementation is a closed dropdown that links and hashes open (§11.1)', () => {
  const p = doc.getElementById('cusum-ewma-implementation');
  assert.equal(p.tagName, 'DETAILS');
  assert.ok(!p.hasAttribute('open'));
  const summary = p.querySelector(':scope > summary');
  assert.ok(summary.querySelector('h2') && summary.querySelector('.ce-impl-pill'));
  assert.equal(summary.querySelectorAll('.ce-impl-show').length, 2);
  assert.equal(summary.querySelectorAll('.ce-impl-hide').length, 2);
  const parts = ['cusum-ewma-excel-functions', 'cusum-ewma-excel-use-cases', 'cusum-ewma-minitab', 'cusum-ewma-exam-tips'];
  const positions = parts.map(id => { const el = p.querySelector('#' + id); assert.ok(el, id); return html.indexOf('id="' + id + '"'); });
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, 'four parts in order');
  for (const th of p.querySelectorAll('[aria-label="Excel functions for CUSUM and EWMA"] thead th')) assert.ok(th.textContent.trim());
  assert.deepEqual([...p.querySelectorAll('[aria-label="Excel functions for CUSUM and EWMA"] thead th')].map(th => th.textContent), ['Function', 'Syntax', 'Purpose', 'When to use it']);
  assert.ok(doc.querySelector('.ce-toc a[href="#cusum-ewma-implementation"]'));
  assert.match(p.textContent, /Stat → Control Charts → Time-Weighted Charts → CUSUM/);
  assert.match(p.textContent, /Plan\/Type/);
  const win = new JSDOM(html, { url: 'https://upskillsprint.com/lessons/quality-engineering/' + slug, runScripts: 'dangerously' }).window;
  const live = win.document.getElementById('cusum-ewma-implementation');
  assert.equal(live.open, false);
  win.document.querySelector('.ce-toc a[href="#cusum-ewma-implementation"]').click();
  assert.equal(live.open, true);
  live.open = false;
  win.location.hash = '#cusum-ewma-minitab';
  win.dispatchEvent(new win.Event('hashchange'));
  assert.equal(live.open, true);
  win.close();
});

test('public access decision has an idempotent, unapplied SQL handoff', () => {
  assert.equal(metadata.access_level, 'public');
  const key = 'lesson:/lessons/quality-engineering/cusum-vs-ewma-control-charts';
  const sql = fs.readFileSync(path.join(root, 'supabase/public-cusum-ewma-access.sql'), 'utf8');
  assert.ok(sql.includes("('" + key + "', 'public', "));
  assert.match(sql, /on conflict \(resource_key\) do update/i);
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);
  assert.doesNotMatch(html, /data-require-auth|data-required-access|data-access-resource/);
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.ok(sitemap.includes('<loc>https://upskillsprint.com/lessons/quality-engineering/' + slug + '</loc>'));
});

test('tables are keyboard-reachable named regions with real headers', () => {
  const regions = [...doc.querySelectorAll('#lesson-content .ce-table-wrap')];
  assert.ok(regions.length >= 9);
  for (const region of regions) {
    assert.equal(region.getAttribute('role'), 'region');
    assert.equal(region.getAttribute('tabindex'), '0');
    assert.ok((region.getAttribute('aria-label') || '').trim().length > 5);
  }
  for (const th of doc.querySelectorAll('main th')) assert.ok(th.textContent.trim(), 'no empty th');
  for (const input of doc.querySelectorAll('main input:not([type="radio"]), main textarea')) {
    assert.ok(doc.querySelector('label[for="' + input.id + '"]'), 'label for ' + input.id);
  }
});

test('canonical dropdown navigation loads shared styles and behaviour', () => {
  assert.equal(doc.querySelectorAll('head link[rel="stylesheet"][href="/site-nav.css"]').length, 1);
  assert.equal(doc.querySelectorAll('head script[src="/site-nav.js"][defer]').length, 1);
  assert.equal(doc.querySelectorAll('header.site nav.desktop-nav .nav-chevron').length, 6);
});

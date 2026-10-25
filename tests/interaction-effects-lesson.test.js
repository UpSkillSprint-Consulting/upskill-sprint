'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const slug = 'interaction-effects-in-minitab';
const lessonPath = `/lessons/lean-six-sigma/${slug}`;
const title = 'Interaction Effects in Minitab';
const assetDir = path.join(root, 'assets/lessons', slug);
const html = fs.readFileSync(path.join(root, `${lessonPath}.html`), 'utf8');
const staticDoc = new JSDOM(html).window.document;

function open() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const window = new JSDOM(html, {
    runScripts: 'dangerously', virtualConsole, url: `https://upskillsprint.com${lessonPath}`
  }).window;
  return new Promise(resolve => {
    const done = () => resolve({ window, document: window.document, errors, I: window.IXA });
    if (window.document.readyState === 'loading') window.document.addEventListener('DOMContentLoaded', done); else done();
  });
}
function near(actual, expected, tol, label) {
  assert.ok(Math.abs(actual - expected) <= tol, `${label || ''} ${actual} should be within ${tol} of ${expected}`);
}
function csv(name) {
  const lines = fs.readFileSync(path.join(assetDir, name), 'utf8').trim().split(/\r?\n/);
  return lines.slice(1).map(l => l.split(','));
}
const plain = v => JSON.parse(JSON.stringify(v));
const body = () => staticDoc.querySelector('main#lesson-content').textContent.replace(/\s+/g, ' ');

test('metadata, head tags, access rule and catalog entry follow the lesson guide', () => {
  assert.match(html, /^<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META/);
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(meta.title, title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.category, 'Lean Six Sigma');
  assert.equal(meta.category_slug, 'lean-six-sigma');
  assert.equal(meta.level, 'Intermediate');
  assert.equal(meta.lesson_type, 'General');
  assert.equal(meta.estimated_minutes, 60);
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, `lessons/lean-six-sigma/${slug}.html`);
  assert.ok(new Set(meta.search_keywords).size >= 5);

  const docTitle = staticDoc.title;
  assert.equal(docTitle, `${title} | UpSkill Sprint`);
  assert.ok(docTitle.length <= 65, `title is ${docTitle.length} characters`);
  const description = staticDoc.querySelector('meta[name="description"]').content;
  assert.ok(description.length >= 120 && description.length <= 160, `description is ${description.length} characters`);
  const canonical = `https://upskillsprint.com${lessonPath}`;
  assert.equal(staticDoc.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(staticDoc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(staticDoc.querySelector('meta[property="og:title"]').content, docTitle);
  assert.equal(staticDoc.querySelector('meta[property="og:description"]').content, description);
  assert.equal(staticDoc.querySelector('meta[property="og:type"]').content, 'article');
  assert.equal(staticDoc.querySelector('meta[property="og:image"]').content, 'https://upskillsprint.com/assets/logo-og.png');
  assert.equal(staticDoc.querySelector('meta[name="twitter:card"]').content, 'summary');

  const ld = JSON.parse(staticDoc.querySelector('script[type="application/ld+json"]').textContent);
  const crumbs = ld['@graph'].find(n => n['@type'] === 'BreadcrumbList').itemListElement;
  assert.equal(crumbs[2].item, canonical);
  assert.equal(crumbs[2].name, title);
  const resource = ld['@graph'].find(n => n['@type'] === 'LearningResource');
  assert.equal(resource.url, canonical);
  assert.equal(resource.description, description);
  assert.equal(resource.educationalLevel, 'Intermediate');

  const b = staticDoc.body;
  assert.equal(b.dataset.lessonPage, 'true');
  assert.equal(b.dataset.category, 'lean-six-sigma');
  assert.equal(b.dataset.level, 'intermediate');
  assert.equal(b.dataset.interactive, 'true');
  assert.equal(b.dataset.lessonType, 'general');
  assert.equal(b.hasAttribute('data-require-auth'), false);

  const sql = fs.readFileSync(path.join(root, 'supabase/public-interaction-effects-in-minitab-access.sql'), 'utf8');
  assert.ok(sql.includes(`('lesson:${lessonPath}', 'public', '${title}', true, now())`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);

  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  assert.equal(catalog.split("marker: 'data-interaction-effects-in-minitab'").length, 2);
  const entry = catalog.slice(catalog.indexOf("marker: 'data-interaction-effects-in-minitab'"));
  const block = entry.slice(0, entry.indexOf('}'));
  assert.match(block, new RegExp(`path: '${lessonPath}'`));
  assert.match(block, /sectionId: 'lean-six-sigma'/);
  assert.match(block, /topic: 'lean-six-sigma'/);
  assert.match(block, /level: 'intermediate'/);
  assert.match(block, /interactive: 'true'/);
  assert.match(block, /<span>60 min<\/span>/);
  assert.match(block, new RegExp(`title: '${title}'`));
  assert.match(block, new RegExp(`description: '${meta.card_description}'`));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
});

test('canonical chrome, quiz blocks, math include and page structure are exact', () => {
  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  for (const section of ['### 4.1 Header', '### 4.2 Footer', '### 7.1 Quiz styles', '### 7.3 Quiz grader']) {
    const block = guide.slice(guide.indexOf(section)).match(/```html\n([\s\S]*?)\n```/)[1];
    assert.ok(html.includes(block), `must use the exact ${section} block`);
  }
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>', '<script defer src="/assets/js/math.js"></script>']) {
    assert.ok(html.includes(tag), `missing ${tag}`);
  }
  assert.ok(html.indexOf('<script src="/site-sections.js"></script>') < html.indexOf('<script defer src="/assets/js/math.js"></script>'));
  assert.ok(html.indexOf('<link rel="stylesheet" href="/lessons-theme.css">') < html.indexOf('<style id="ixa-lesson-style">'));
  assert.doesNotMatch(html, /window\.MathJax\s*=/, 'new lessons use the shared math include only');
  assert.doesNotMatch(html, /\$\$|\\\$/, 'no dollar-sign math delimiters');
  assert.doesNotMatch(html, /fonts\.googleapis|logo-icon\.png/);
  assert.equal(staticDoc.body.firstElementChild.id, 'mnav-check');
  assert.ok(!html.includes('Skip to lesson content'));
  assert.ok(!html.includes('Want to save your progress and quiz scores for this lesson?'));
  assert.equal(staticDoc.querySelectorAll('main').length, 1);
  assert.equal(staticDoc.querySelectorAll('main#lesson-content').length, 1);
  assert.equal(staticDoc.querySelectorAll('h1').length, 1);
  assert.equal(staticDoc.querySelector('main#lesson-content h1').textContent, title);
  assert.match(staticDoc.querySelector('.ixa-lede').textContent, /interaction effects/i);
  assert.ok(staticDoc.querySelector('main#lesson-content #quiz'), 'quiz sits inside the main landmark');
  assert.equal(staticDoc.querySelectorAll('header.site').length, 1);
  assert.equal(staticDoc.querySelectorAll('footer.site').length, 1);
  const back = staticDoc.querySelector('section[aria-label="Return to lesson category"] a');
  assert.equal(back.getAttribute('href'), '/lessons#lean-six-sigma');
  assert.match(back.textContent, /Back to Lean Six Sigma lessons/);
  assert.ok(html.lastIndexOf('<style id="interaction-effects-in-minitab-dark-overrides">') > html.lastIndexOf('</script>'));

  const ids = [...staticDoc.querySelectorAll('[id]')].map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'all ids are unique');
  for (const a of staticDoc.querySelectorAll('a[href^="#"]')) assert.ok(staticDoc.getElementById(a.getAttribute('href').slice(1)), a.getAttribute('href'));

  let previous = 1;
  for (const h of staticDoc.querySelectorAll('main h1, main h2, main h3, main h4')) {
    const level = Number(h.tagName[1]);
    assert.ok(level <= previous + 1, `heading "${h.textContent}" skips a level`);
    previous = level;
  }
  for (const table of staticDoc.querySelectorAll('main table')) {
    const wrap = table.closest('.table-scroll');
    assert.ok(wrap, 'every table scrolls inside a named region');
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('role'), 'region');
    assert.ok(wrap.getAttribute('aria-label'));
    for (const th of table.querySelectorAll('th')) assert.ok(th.textContent.trim(), 'no empty table headers');
  }
  for (const control of staticDoc.querySelectorAll('main input:not([type="radio"]):not([type="checkbox"]), main select')) {
    assert.ok(staticDoc.querySelector(`label[for="${control.id}"]`), `${control.id} has a label`);
  }
  for (const svg of staticDoc.querySelectorAll('main svg[role="img"]')) {
    assert.equal(svg.querySelectorAll('a, button, input, [tabindex]').length, 0, 'role=img charts contain no focusable content');
    const labelId = svg.getAttribute('aria-labelledby');
    assert.ok(labelId && svg.querySelector(`title[id="${labelId}"]`), 'svg is named by its own title');
  }
  const css = html.match(/<style id="ixa-lesson-style">([\s\S]*?)<\/style>/)[1];
  const declared = [...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]);
  assert.ok(declared.length > 10);
  for (const name of declared) assert.ok(name.startsWith('--ixa-'), `${name} must be namespaced`);
  assert.doesNotMatch(css, /(^|[\s,}])(header|footer|\.site|\.brand|\.footer-grid|\.desktop-nav)\b/);
});

test('related lessons, references and downloads resolve', () => {
  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  const lessonsPage = fs.readFileSync(path.join(root, 'lessons.html'), 'utf8');
  const related = [...staticDoc.querySelectorAll('.related-lessons a')].map(a => a.getAttribute('href'));
  assert.ok(related.length >= 3 && related.length <= 5);
  for (const href of related) {
    assert.ok(fs.existsSync(path.join(root, `${href}.html`)), `${href} exists`);
    assert.ok(catalog.includes(`'${href}'`) || lessonsPage.includes(`${href.slice(1)}.html"`) || lessonsPage.includes(`"${href}"`), `${href} is listed`);
  }
  for (const a of staticDoc.querySelectorAll('a[download]')) {
    const href = a.getAttribute('href');
    assert.ok(href.startsWith(`/assets/lessons/${slug}/`));
    assert.ok(fs.existsSync(path.join(root, href)), `${href} exists`);
  }
  for (const a of staticDoc.querySelectorAll('main a[href^="http"]')) assert.ok(a.href.startsWith('https://'));
});

test('the Statistics Implementation section has all four required parts', () => {
  const impl = staticDoc.querySelector('#statistics-implementation');
  assert.ok(impl);
  const order = ['excel-functions', 'excel-use-cases', 'minitab-navigation', 'exam-tips'].map(id => {
    const el = impl.querySelector(`#${id}`);
    assert.ok(el, `missing #${id}`);
    return [...impl.querySelectorAll('[id]')].indexOf(el);
  });
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'parts appear in the required order');
  const headers = [...impl.querySelectorAll('thead th')].map(th => th.textContent.trim());
  assert.deepEqual(headers, ['Function', 'Syntax', 'Purpose', 'When to use it']);
  const fns = [...impl.querySelectorAll('tbody th code')].map(c => c.textContent);
  for (const fn of ['AVERAGEIFS', 'SUMPRODUCT', 'LINEST', 'INDEX', 'CORREL', 'RSQ', 'T.DIST.2T', 'F.DIST.RT', 'CHISQ.TEST']) assert.ok(fns.includes(fn), fn);
  const nav = impl.textContent;
  for (const p of ['Stat → ANOVA → Interaction Plot', 'Stat → Quality Tools → Multi-Vari Chart',
    'Stat → ANOVA → General Linear Model → Fit General Linear Model', 'Stat → Regression → Regression → Fit Regression Model',
    'Stat → Regression → Regression → Contour Plot', 'Stat → DOE → Factorial → Analyze Factorial Design',
    'Stat → Basic Statistics → Correlation', 'Stat → Tables → Cross Tabulation and Chi-Square']) {
    assert.ok(nav.includes(p), `Minitab path ${p}`);
  }
});

test('the tool guide covers both-categorical, both-continuous and mixed X\'s, and places two-way ANOVA', () => {
  const sec = staticDoc.querySelector('#choosing-the-tool');
  for (const id of ['tool-by-x-type', 'tool-by-response', 'where-anova-fits']) assert.ok(sec.querySelector(`#${id}`), `missing #${id}`);
  const rows = [...sec.querySelectorAll('#tool-by-x-type + .table-scroll tbody th')].map(th => th.textContent);
  assert.equal(rows.length, 3);
  assert.match(rows[0], /^Both categorical/); assert.match(rows[1], /^Both continuous/); assert.match(rows[2], /^One categorical, one continuous/);
  const text = sec.textContent.replace(/\s+/g, ' ');
  for (const s of ['Two-way ANOVA', 'Stat → ANOVA → General Linear Model → Fit General Linear Model', 'Stat → ANOVA → Balanced ANOVA',
    'Stat → Regression → Regression → Fit Regression Model', 'Stat → Regression → Poisson Regression → Fit Poisson Model',
    'Stat → ANOVA → General Linear Model → Comparisons', 'General full factorial design', 'version 17', 'replicates']) {
    assert.ok(text.includes(s), `tool guide mentions ${s}`);
  }
  near(11.350958788 ** 2, 128.84, 0.005, 'F = T squared for a 1-df term');
  near(1412.67 / 10.964166666666657, 128.84, 0.005, 'F for AB');
});

test('embedded data matches the downloadable CSV files', async () => {
  const { window, I, errors } = await open();
  const doe = csv('doe-2x2-charpy.csv');
  assert.equal(doe.length, 12);
  doe.forEach((r, i) => {
    const [so, ro, temp, nb, a, b, ab, y] = r;
    assert.deepEqual(plain(I.DOE_ROWS[i]), [Number(so), Number(ro), Number(a), Number(b), Number(y)]);
    assert.equal(Number(temp), Number(a) < 0 ? 820 : 880);
    assert.equal(nb, Number(b) < 0 ? '0.020' : '0.040');
    assert.equal(Number(ab), Number(a) * Number(b));
  });
  const heats = csv('historical-heats.csv');
  assert.equal(heats.length, 40);
  heats.forEach((r, i) => assert.deepEqual(plain(I.HEATS[i]), r.slice(1).map(Number)));
  assert.ok(fs.statSync(path.join(assetDir, 'interaction-effects-practice-dataset.xlsx')).size > 5000);
  const rendered = [...window.document.querySelectorAll('#ixa-doe-rows tr')].map(tr => tr.lastElementChild.textContent);
  assert.deepEqual(rendered, doe.map(r => r[7]));
  assert.deepEqual(errors, []);
  window.close();
});

test('every number quoted in the text agrees with the data (NumPy/SciPy verified)', async () => {
  const { window, I } = await open();
  const c = I.cellMeans(I.DOE_ROWS);
  near(c.mm, 137.30, 0.005); near(c.pm, 88.00, 0.005); near(c.mp, 132.97, 0.005); near(c.pp, 127.07, 0.005);
  const e = I.effects(c);
  near(e.A, -27.60, 1e-9, 'A'); near(e.B, 17.3667, 1e-4, 'B'); near(e.AB, 21.70, 1e-9, 'AB'); near(e.coefAB, 10.85, 1e-9);
  near(e.simpleLowB, -49.3, 1e-9); near(e.simpleHighB, -5.9, 1e-9);

  const A = I.DOE_ROWS.map(r => r[2]), B = I.DOE_ROWS.map(r => r[3]), y = I.DOE_ROWS.map(r => r[4]);
  const fit = I.ols([A, B, A.map((v, i) => v * B[i])], y);
  near(fit.b[0], 121.3333, 1e-4); near(fit.b[3], 10.85, 1e-9);
  near(fit.se[3], 0.95587, 1e-5, 'SE coef'); near(fit.mse, 10.96417, 1e-5, 'MSE'); near(fit.r2, 0.98130, 1e-5, 'R-sq');
  near(fit.b[1] / fit.se[1], -14.437, 1e-3); near(fit.b[2] / fit.se[2], 9.084, 1e-3); near(fit.b[3] / fit.se[3], 11.351, 1e-3);
  const n = 12;
  near(n * fit.b[1] ** 2, 2285.28, 0.005); near(n * fit.b[2] ** 2, 904.80, 0.005); near(n * fit.b[3] ** 2, 1412.67, 0.005);
  near(fit.mse * 8, 87.71, 0.005); near(n * fit.b[3] ** 2 / fit.mse, 128.84, 0.005);
  near(Math.sqrt(fit.mse), 3.311, 5e-4, 'S');

  const raw = I.vifModel(false), cen = I.vifModel(true);
  near(raw.vif[0], 26.935, 1e-3); near(raw.vif[1], 2380.10, 0.01); near(raw.vif[2], 2373.45, 0.01);
  near(cen.vif[0], 1.0397, 1e-4); near(cen.vif[1], 1.0647, 1e-4); near(cen.vif[2], 1.1019, 1e-4);
  near(raw.fit.b[3], 32.2067, 1e-3); near(cen.fit.b[3], 32.2067, 1e-3); near(raw.fit.se[3], cen.fit.se[3], 1e-6);
  near(raw.fit.se[2], 6831.46, 0.05); near(cen.fit.se[2], 144.490, 1e-3);
  const T = I.HEATS.map(h => h[0]), NB = I.HEATS.map(h => h[1]), C = I.HEATS.map(h => h[2]), MN = I.HEATS.map(h => h[3]);
  near(I.corr(T, NB), -0.0656, 1e-4); near(I.corr(C, MN), 0.9558, 1e-4);
  near(1 / (1 - I.corr(C, MN) ** 2), 11.572, 1e-3);
  const cm = C.reduce((a, b) => a + b) / 40, mm = MN.reduce((a, b) => a + b) / 40;
  const hv = I.ols([C.map(v => v - cm), MN.map(v => v - mm), C.map((v, i) => (v - cm) * (MN[i] - mm))], I.HEATS.map(h => h[5]));
  near(hv.b[3], -62.616, 1e-3, 'C×Mn coefficient'); near(hv.b[3] / hv.se[3], -0.25599, 1e-4, 'C×Mn t, p = 0.80');

  const text = body();
  for (const s of ['137.30', '88.00', '132.97', '127.07', '-27.60', '21.70', '10.85', '17.37 J', '49.3 J', '5.9 J', '121.333', '0.956',
    '2285.28', '904.80', '1412.67', '87.71', '4690.47', '208.43', '82.52', '128.84', 'S = 3.311', 'R-sq = 98.13%', '97.43%',
    '32.21', '0.0003', '0.956', '11.6', 'p = 0.80', '-0.07']) {
    assert.ok(text.includes(s), `text quotes ${s}`);
  }
  window.close();
});

test('the interactive widgets compute and announce the right results', async () => {
  const { window, document, I, errors } = await open();
  const set = (id, v) => { const el = document.getElementById(id); el.value = String(v); el.dispatchEvent(new window.Event('input', { bubbles: true })); };

  assert.equal(I.explorerVerdict(6, 4, 0).title, 'Parallel');
  assert.equal(I.explorerVerdict(0, 2, 8).title, 'Crossover interaction');
  assert.equal(I.explorerVerdict(6, 4, 6).title, 'Interaction: A matters at only one level of B');
  assert.match(I.explorerVerdict(6, 4, 4).text, /strongly when B is high/);
  document.querySelector('[data-ixa-preset="0,2,8"]').click();
  assert.match(document.getElementById('ixa-ex-verdict').textContent, /Crossover/);
  assert.equal(document.getElementById('ixa-ex-r-lo').textContent, '−16');
  assert.equal(document.getElementById('ixa-ex-r-hi').textContent, '+16');
  assert.equal(document.getElementById('ixa-ex-mline').getAttribute('y1'), document.getElementById('ixa-ex-mline').getAttribute('y2'), 'main effect is flat');
  set('ixa-ex-ab', 0);
  assert.match(document.getElementById('ixa-ex-verdict').textContent, /Parallel/);

  assert.equal(document.getElementById('ixa-c-eab').textContent, '21.70');
  set('ixa-c-mm', 50); set('ixa-c-pm', 60); set('ixa-c-mp', 70); set('ixa-c-pp', 80);
  assert.equal(document.getElementById('ixa-c-eab').textContent, '0.00');
  assert.match(document.getElementById('ixa-c-simple').textContent, /parallel/);
  set('ixa-c-pp', '');
  assert.match(document.getElementById('ixa-c-simple').textContent, /all four cells/);
  document.getElementById('ixa-c-reset').click();
  assert.equal(document.getElementById('ixa-c-ea').textContent, '−27.60');

  assert.equal(document.getElementById('ixa-vif-raw').getAttribute('aria-pressed'), 'true');
  document.getElementById('ixa-vif-cen').click();
  assert.equal(document.getElementById('ixa-vif-cen').getAttribute('aria-pressed'), 'true');
  assert.match(document.getElementById('ixa-vif-note').textContent, /32\.21/);
  assert.equal(document.querySelectorAll('#ixa-vif-bars rect.is-high').length, 0);
  document.getElementById('ixa-vif-raw').click();
  assert.equal(document.querySelectorAll('#ixa-vif-bars rect.is-high').length, 3);

  set('ixa-al-rho', 0.9); set('ixa-al-int-s', 0);
  const r = Number(document.getElementById('ixa-al-r').textContent.replace('−', '-'));
  assert.ok(r > 0.8, `sample r ${r}`);
  assert.match(document.getElementById('ixa-al-verdict').textContent, /strongly associated .* do not interact/);
  set('ixa-al-rho', 0); set('ixa-al-int-s', 5);
  assert.match(document.getElementById('ixa-al-verdict').textContent, /unassociated .* they interact/);
  assert.equal(document.querySelectorAll('#ixa-al-points circle').length, 80);
  const p1 = I.labPoints(0.5), p2 = I.labPoints(0.5);
  assert.deepEqual(plain(p1), plain(p2), 'lab points are deterministic');

  assert.equal(document.querySelectorAll('#ixa-drill .ixa-card').length, I.DRILL.length);
  I.DRILL.forEach((item, i) => {
    document.querySelector(`[data-ixa-drill="${i}"][data-ixa-choice="${item.ans}"]`).click();
    assert.match(document.getElementById(`ixa-dr-fb${i}`).textContent, /^Correct\./);
    const slopeLo = item.lo[1] - item.lo[0], slopeHi = item.hi[1] - item.hi[0];
    assert.equal(item.ans, slopeLo !== slopeHi, `drill item ${i + 1} answer matches its data`);
  });
  assert.match(document.getElementById('ixa-drill-score').textContent, /6 of 6 answered correctly\./);
  document.querySelector('[data-ixa-drill="0"][data-ixa-choice="true"]').click();
  assert.match(document.getElementById('ixa-dr-fb0').textContent, /^Not quite\./);
  assert.deepEqual(errors, []);
  window.close();
});

test('the quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', async () => {
  const { window, document } = await open();
  const results = [];
  document.addEventListener('upskill-quiz-result', e => results.push(plain(e.detail)));
  const questions = [...document.querySelectorAll('#quiz-form .quiz-question')];
  assert.ok(questions.length >= 4);
  document.getElementById('quiz-submit').click();
  assert.deepEqual(results.at(-1), { score: 0, total: questions.length });
  assert.match(document.getElementById('quiz-result').textContent, /unanswered/);
  questions.forEach(q => {
    const wrong = [...q.querySelectorAll('input')].find(i => i.value !== q.dataset.answer);
    wrong.checked = true;
  });
  document.getElementById('quiz-submit').click();
  assert.deepEqual(results.at(-1), { score: 0, total: questions.length });
  questions.forEach(q => { q.querySelector(`input[value="${q.dataset.answer}"]`).checked = true; });
  document.getElementById('quiz-submit').click();
  assert.deepEqual(results.at(-1), { score: questions.length, total: questions.length });
  for (const q of questions) {
    assert.ok(q.dataset.explanation.length > 20);
    assert.ok(q.querySelector(`input[value="${q.dataset.answer}"]`), 'answer key points at a real option');
  }
  window.close();
});

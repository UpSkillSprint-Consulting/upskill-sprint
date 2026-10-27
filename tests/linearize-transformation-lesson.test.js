'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SLUG = 'choosing-a-transformation-to-linearize-data';
const RELATIVE_FILE = `lessons/statistics/${SLUG}.html`;
const ROUTE = `/lessons/statistics/${SLUG}`;
const html = fs.readFileSync(path.join(ROOT, RELATIVE_FILE), 'utf8');
const guide = fs.readFileSync(path.join(ROOT, 'docs', 'LESSON_CREATION_GUIDE.md'), 'utf8');
const catalog = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'registered-linearize-transformation-access.sql'), 'utf8');
const doc = new JSDOM(html, { url: `https://upskillsprint.com${ROUTE}` }).window.document;

function count(source, needle) { return source.split(needle).length - 1; }
function text(el) { return el.textContent.replace(/\s+/g, ' ').trim(); }

function runtime() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: `https://upskillsprint.com${ROUTE}`, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole });
  for (const script of dom.window.document.querySelectorAll('script:not([src])')) {
    if (script.type === 'application/ld+json') continue;
    dom.window.eval(script.textContent);
  }
  return { window: dom.window, document: dom.window.document, errors };
}

test('metadata, title, canonical and JSON-LD agree', () => {
  assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(meta.title, 'Choosing a Transformation to Linearize Data');
  assert.equal(meta.slug, SLUG);
  assert.equal(meta.category, 'Statistics');
  assert.equal(meta.category_slug, 'statistics');
  assert.equal(meta.level, 'Intermediate');
  assert.equal(meta.estimated_minutes, 75);
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'registered');
  assert.equal(meta.suggested_github_path, RELATIVE_FILE);
  assert.ok(meta.search_keywords.length >= 5);
  assert.equal(new Set(meta.search_keywords).size, meta.search_keywords.length);

  assert.equal(doc.title, `${meta.title} | UpSkill Sprint`);
  assert.ok(doc.title.length <= 65);
  const description = doc.querySelector('meta[name="description"]').content;
  assert.ok(description.length >= 120 && description.length <= 160, `description is ${description.length} chars`);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, description);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, `https://upskillsprint.com${ROUTE}`);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, `https://upskillsprint.com${ROUTE}`);

  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const resource = ld['@graph'].find(node => node['@type'] === 'LearningResource');
  assert.equal(resource.description, description);
  assert.equal(resource.url, `https://upskillsprint.com${ROUTE}`);
  assert.equal(resource.educationalLevel, 'Intermediate');

  const h1s = doc.querySelectorAll('h1');
  assert.equal(h1s.length, 1);
  assert.ok(h1s[0].closest('main#lesson-content'));
  assert.equal(text(h1s[0]), meta.title);
});

test('canonical chrome, shared assets and the Registered sign-in gate', () => {
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>', '<script defer src="/assets/js/math.js"></script>']) {
    assert.equal(count(html, tag), 1, tag);
  }
  assert.ok(html.indexOf('/lessons-theme.css') < html.indexOf('id="lz-lesson-style"'));
  const expectedHeader = guide.split('### 4.1 Header')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  const expectedFooter = guide.split('### 4.2 Footer')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  assert.equal(html.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>/)[0].trim(), expectedHeader.trim());
  assert.equal(html.match(/<footer class="site">[\s\S]*?<\/footer>/)[0].trim(), expectedFooter.trim());

  assert.equal(doc.body.dataset.lessonPage, 'true');
  assert.equal(doc.body.dataset.category, 'statistics');
  assert.equal(doc.body.dataset.level, 'intermediate');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert.ok(doc.body.hasAttribute('data-require-auth'), 'Registered lesson uses the sign-in gate');
  assert.equal(doc.body.hasAttribute('data-access-resource'), false, 'tier gate not used (approved approach)');
  assert.equal(doc.querySelectorAll('main#lesson-content').length, 1);
  assert.doesNotMatch(html, /YOUR PROGRESS/i);

  const back = doc.querySelector('[aria-label="Return to lesson category"] a');
  assert.equal(back.getAttribute('href'), '/lessons#statistics');
  assert.match(back.textContent, /Back to Statistics lessons/);
  const dark = doc.getElementById(`${SLUG}-dark-overrides`);
  assert.ok(dark);
  assert.equal(html.lastIndexOf('<style'), html.indexOf(`<style id="${SLUG}-dark-overrides"`), 'dark overrides come last');
});

test('lesson CSS uses namespaced custom properties only', () => {
  for (const id of ['lz-lesson-style', `${SLUG}-dark-overrides`]) {
    for (const match of doc.getElementById(id).textContent.matchAll(/(--[\w-]+)\s*:/g)) {
      assert.match(match[1], /^--lesson-lz-/, `${match[1]} is namespaced`);
    }
  }
});

test('catalog entry and access SQL register the lesson as Registered', () => {
  const start = catalog.indexOf("marker: 'data-choosing-a-transformation-to-linearize-data'");
  assert.ok(start > 0);
  const entry = catalog.slice(start, catalog.indexOf('}', start));
  assert.match(entry, /sectionId: 'statistics'/);
  assert.match(entry, /topic: 'statistics'/);
  assert.match(entry, new RegExp(`path: '${ROUTE}'`));
  assert.match(entry, /level: 'intermediate'/);
  assert.match(entry, /<span>75 min<\/span>/);
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.match(sql, new RegExp(`'lesson:${ROUTE}', 'registered'`));
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);
});

test('statistics implementation, structure and related links are present', () => {
  for (const id of ['excel-functions', 'excel-use-cases', 'minitab-navigation', 'exam-tips']) {
    assert.ok(doc.querySelector(`#statistics-implementation #${id}`), id);
  }
  const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  const levels = [...doc.querySelectorAll('#lesson-content h1, #lesson-content h2, #lesson-content h3')].map(h => Number(h.tagName[1]));
  for (let i = 1; i < levels.length; i++) assert.ok(levels[i] - levels[i - 1] <= 1, 'no skipped heading levels');
  const related = [...doc.querySelectorAll('.related-lessons a')].map(a => a.getAttribute('href'));
  assert.ok(related.length >= 3 && related.length <= 5);
  for (const href of related) assert.ok(fs.existsSync(path.join(ROOT, `${href}.html`)), `${href} exists`);
  for (const wrap of doc.querySelectorAll('.table-scroll, pre.lz-code')) {
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('role'), 'region');
    assert.ok(wrap.getAttribute('aria-label'));
  }
  assert.doesNotMatch(html, /\$\$|\$\\/, 'no dollar math delimiters');
  const finder = [...doc.querySelectorAll('#lesson-content a[href="/tools/best-fit-model-finder"]')];
  assert.ok(finder.length >= 2, 'links to the Best-Fit Model Finder from the lab and the chooser');
  assert.ok(finder.every(a => /Best-Fit Model Finder/.test(a.textContent)), 'descriptive anchor text');
  for (const f of doc.querySelectorAll('.lz-formula')) {
    assert.equal(f.getAttribute('tabindex'), '0'); assert.equal(f.getAttribute('role'), 'region'); assert.ok(f.getAttribute('aria-label'));
  }
  const formulaLabels = [...doc.querySelectorAll('.lz-formula')].map(f => f.getAttribute('aria-label'));
  assert.equal(new Set(formulaLabels).size, formulaLabels.length, 'each formula region has a unique name');
  const prose = [...doc.querySelectorAll('#lesson-content p, #lesson-content li, #lesson-content td, #lesson-content dt, #lesson-content legend, #lesson-content h3, #lesson-content .quiz-option')]
    .map(el => el.textContent.replace(/\\\([\s\S]*?\\\)/g, '')).join(' ');
  assert.doesNotMatch(prose, /R²|R-squared|lambda-hat|max\/min/, 'math symbols in prose are LaTeX');
  assert.equal(count(html, '<link rel="stylesheet" href="/site-nav.css">'), 1, 'shared nav styles load');
  assert.equal(count(html, '<script src="/site-nav.js" defer></script>'), 1);
  assert.ok(doc.querySelector('nav.mobile-nav[data-nav-root="mobile"]'), 'mobile nav present like every other lesson');
});

test('worked example numbers match their own data', () => {
  const x = [1, 2, 3, 4, 5, 6], y = [0.82, 1.15, 1.60, 2.31, 3.18, 4.52];
  const ly = y.map(Math.log);
  const mx = x.reduce((a, b) => a + b) / 6, my = ly.reduce((a, b) => a + b) / 6;
  let sxy = 0, sxx = 0;
  x.forEach((v, i) => { sxy += (v - mx) * (ly[i] - my); sxx += (v - mx) ** 2; });
  const b = sxy / sxx, a = my - b * mx;
  assert.equal(b.toFixed(4), '0.3415');
  assert.equal(a.toFixed(4), '-0.5430');
  assert.equal((100 * (Math.exp(b) - 1)).toFixed(1), '40.7');
  assert.equal((Math.log(2) / b).toFixed(2), '2.03');
  assert.equal(Math.exp(a + 7 * b).toFixed(2), '6.35');
  const body = text(doc.getElementById('worked-example'));
  for (const quoted of ['0.3415', '0.5430', '40.7', '2.03', '6.35', '0.943']) assert.ok(body.includes(quoted), quoted);
});

test('the math core recovers known answers', () => {
  const { window, errors } = runtime();
  const L = window.LinearizeLab;
  for (const key of Object.keys(L.PRESETS)) {
    const p = L.PRESETS[key], d = L.dataset(key);
    const raw = L.analyze(d.x, d.y, { xp: 1, yp: 1, xc: 0, yc: 0 });
    const expert = L.analyze(d.x, d.y, p.expert);
    assert.ok(raw.curved || raw.funnel, `${key}: raw data fail a check`);
    if (p.expert.fails) assert.ok(expert.curved, `${key}: no ladder move straightens it`);
    else assert.ok(!expert.curved && !expert.funnel, `${key}: expert pick passes both checks`);
  }
  const hp = L.dataset('hallpetch');
  const bt = L.boxTidwell(hp.x, hp.y);
  assert.ok(bt.ok && Math.abs(bt.alpha - (-0.4615)) < 0.002, `Box-Tidwell alpha ${bt.alpha}`);
  assert.equal(bt.rounded, -0.5);
  const paris = L.dataset('paris');
  const bc = L.boxCoxProfile(paris.x.map(Math.log), paris.y);
  assert.equal(bc.rounded, 0);
  assert.ok(bc.ciLo <= 0 && bc.ciHi >= 0);
  assert.ok(Math.abs(L.fUpper(3.2594, 2, 36) - 0.05) < 1e-3, 'F upper tail');
  assert.ok(Math.abs(L.tTwoSided(2.0281, 36) - 0.05) < 1e-3, 't two-sided');
  const demo = L.backTransformDemo(0.6, 200, 7);
  assert.ok(demo.naive < demo.trueMean && demo.smearing > demo.naive);
  assert.equal(L.recommend({ shape: 'ushape' }).title, 'Do not transform. Model the turn.');
  assert.deepEqual(errors, []);
  window.close();
});

test('lab, bulge rule, Box-Cox, Box-Tidwell, chooser and quiz work in the page', () => {
  const { window, document, errors } = runtime();
  const $ = id => document.getElementById(id);
  assert.match($('lz-verdict').textContent, /Still curved/);
  assert.equal(document.querySelectorAll('#lz-plot-orig circle').length, 40);
  $('lz-expert').click();
  assert.match($('lz-verdict').textContent, /Straight and even/);
  assert.equal($('lz-expert-note').hidden, false);
  assert.match($('lz-equation').textContent, /\\sqrt\{x\}/);

  const select = $('lz-preset');
  select.value = 'growth';
  select.dispatchEvent(new window.Event('change'));
  assert.match($('lz-verdict').textContent, /curved/i);
  assert.equal($('lz-bc-round').textContent, '0 (ln y)');
  $('lz-bc-apply').click();
  assert.equal(window.LinearizeLabUI.state().yp, 0);
  assert.match($('lz-verdict').textContent, /Straight and even/);

  select.value = 'cycletime';
  select.dispatchEvent(new window.Event('change'));
  $('lz-bt-apply').click();
  assert.equal(window.LinearizeLabUI.state().xp, -1);
  assert.match($('lz-verdict').textContent, /Straight and even/);

  select.value = 'counts';
  select.dispatchEvent(new window.Event('change'));
  assert.match($('lz-verdict').textContent, /spread fans out/);
  assert.equal($('lz-bc-apply').disabled, true, 'Box-Cox needs positive y');

  $('lz-quad-down-right').click();
  assert.equal($('lz-quad-down-right').getAttribute('aria-pressed'), 'true');
  $('lz-bulge-load').click();
  assert.equal(window.LinearizeLabUI.state().key, 'growth');

  const sigma = $('lz-sigma');
  sigma.value = '1';
  sigma.dispatchEvent(new window.Event('input'));
  assert.equal($('lz-btd-rows').querySelectorAll('tr').length, 5);

  document.querySelector('input[name="lz-q-spread"][value="counts"]').checked = true;
  $('lz-chooser-form').dispatchEvent(new window.Event('change'));
  assert.match($('lz-rec-title').textContent, /square root/i);

  let event = null;
  document.addEventListener('upskill-quiz-result', e => { event = e.detail; });
  $('quiz-submit').click();
  assert.equal(event.score, 0); assert.equal(event.total, 8);
  assert.match($('quiz-result').textContent, /8 unanswered/);
  document.querySelector('#quiz-form input[name=q1][value=a]').checked = true;
  $('quiz-submit').click();
  assert.equal(event.score, 0);
  const answers = ['b', 'c', 'a', 'd', 'b', 'c', 'a', 'd'];
  answers.forEach((v, i) => { document.querySelector(`#quiz-form input[name=q${i + 1}][value=${v}]`).checked = true; });
  $('quiz-submit').click();
  assert.equal(event.score, 8); assert.equal(event.total, 8);
  assert.deepEqual(errors, []);
  window.close();
});

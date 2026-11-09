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
const RESOURCE = `lesson:${ROUTE}`;
const PROTECTED_FILE = `content/protected-lessons/statistics/${SLUG}.html`;
// The public page is a teaser; the rest of the lesson lives outside the static site
// and reaches signed-in Registered learners through netlify/functions/lesson-content.mjs.
const html = fs.readFileSync(path.join(ROOT, RELATIVE_FILE), 'utf8');
const fragment = fs.readFileSync(path.join(ROOT, PROTECTED_FILE), 'utf8');
const guide = fs.readFileSync(path.join(ROOT, 'docs', 'LESSON_CREATION_GUIDE.md'), 'utf8');
const catalog = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'registered-linearize-transformation-access.sql'), 'utf8');
const doc = new JSDOM(html, { url: `https://upskillsprint.com${ROUTE}` }).window.document;

function count(source, needle) { return source.split(needle).length - 1; }
function text(el) { return el.textContent.replace(/\s+/g, ' ').trim(); }

/** The page a signed-in Registered learner ends up with: the fragment in place of the sign-in panel. */
function assembledHtml() {
  const dom = new JSDOM(html);
  dom.window.document.querySelector('[data-protected-lesson]').innerHTML = fragment;
  const out = dom.serialize();
  dom.window.close();
  return out;
}
const fullHtml = assembledHtml();
const fullDoc = new JSDOM(fullHtml, { url: `https://upskillsprint.com${ROUTE}` }).window.document;

function runtime() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fullHtml, { url: `https://upskillsprint.com${ROUTE}`, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole });
  for (const script of dom.window.document.querySelectorAll('script:not([src])')) {
    if (script.type === 'application/ld+json') continue;
    dom.window.eval(script.textContent);
  }
  return { window: dom.window, document: dom.window.document, errors };
}

/** The real teaser + the real loader (/protected-lesson.js) + a signed-in session + the function's 200 reply. */
async function loadedThroughLoader() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: `https://upskillsprint.com${ROUTE}`, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  const { window } = dom;
  const requests = [];
  const user = { id: 'learner-1' };
  window.UpskillAuth = {
    isConfigured: () => true,
    getUser: () => user,
    getClient: () => ({ auth: { getSession: async () => ({ data: { session: { access_token: 'a.b.c', user } } }) } }),
    onChange: listener => listener(user)
  };
  window.fetch = async (url, init) => {
    requests.push({ url, init });
    return { ok: true, status: 200, json: async () => ({ version: 1, resource: RESOURCE, html: fragment }) };
  };
  let ready = null;
  window.document.addEventListener('upskill-lesson-content-ready', e => { ready = e.detail; });
  window.eval(fs.readFileSync(path.join(ROOT, 'protected-lesson.js'), 'utf8'));
  for (let i = 0; i < 50 && !ready; i++) await new Promise(resolve => setTimeout(resolve, 10));
  return { window, document: window.document, errors, requests, ready };
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
  assert.equal(resource.isAccessibleForFree, false, 'Registered lesson is not free to read in full');
  assert.equal(ld['@graph'].length, 2);
  assert.equal(doc.querySelector('meta[name="robots"]'), null, 'the teaser is indexable: no noindex');

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
  assert.equal(doc.body.hasAttribute('data-require-auth'), false, 'no soft redirect to Sign In: the URL serves a public preview');
  assert.equal(doc.body.hasAttribute('data-access-resource'), false, 'access-control.js redirect gate not used');
  const mount = doc.querySelector('[data-protected-lesson]');
  assert.ok(mount, 'protected mount present');
  assert.equal(mount.getAttribute('data-protected-lesson'), RESOURCE);
  assert.ok(mount.closest('main#lesson-content'));
  assert.equal(count(html, '<script defer src="/protected-lesson.js"></script>'), 1, 'loader on the teaser only once');
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
    assert.ok(fullDoc.querySelector(`#statistics-implementation #${id}`), id);
  }
  const ids = [...fullDoc.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  const levels = [...fullDoc.querySelectorAll('#lesson-content h1, #lesson-content h2, #lesson-content h3')].map(h => Number(h.tagName[1]));
  for (let i = 1; i < levels.length; i++) assert.ok(levels[i] - levels[i - 1] <= 1, 'no skipped heading levels');
  const related = [...fullDoc.querySelectorAll('.related-lessons a')].map(a => a.getAttribute('href'));
  assert.ok(related.length >= 3 && related.length <= 5);
  for (const href of related) assert.ok(fs.existsSync(path.join(ROOT, `${href}.html`)), `${href} exists`);
  for (const wrap of fullDoc.querySelectorAll('.table-scroll, pre.lz-code')) {
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('role'), 'region');
    assert.ok(wrap.getAttribute('aria-label'));
  }
  assert.doesNotMatch(fullHtml, /\$\$|\$\\/, 'no dollar math delimiters');
  const finder = [...fullDoc.querySelectorAll('#lesson-content a[href="/tools/engineering-statistics-calculator?tab=best-fit"]')];
  assert.ok(finder.length >= 2, 'links to the Best-Fit Model Finder tab in the calculator from the lab and the chooser');
  assert.ok(finder.every(a => /Best-Fit Model Finder/.test(a.textContent)), 'descriptive anchor text');
  for (const f of fullDoc.querySelectorAll('.lz-formula')) {
    assert.equal(f.getAttribute('tabindex'), '0'); assert.equal(f.getAttribute('role'), 'region'); assert.ok(f.getAttribute('aria-label'));
  }
  const formulaLabels = [...fullDoc.querySelectorAll('.lz-formula')].map(f => f.getAttribute('aria-label'));
  assert.equal(new Set(formulaLabels).size, formulaLabels.length, 'each formula region has a unique name');
  const prose = [...fullDoc.querySelectorAll('#lesson-content p, #lesson-content li, #lesson-content td, #lesson-content dt, #lesson-content legend, #lesson-content h3, #lesson-content .quiz-option')]
    .map(el => el.textContent.replace(/\\\([\s\S]*?\\\)/g, '')).join(' ');
  assert.doesNotMatch(prose, /R²|R-squared|lambda-hat|max\/min/, 'math symbols in prose are LaTeX');
  assert.equal(count(html, '<link rel="stylesheet" href="/site-nav.css">'), 1, 'shared nav styles load');
  assert.equal(count(html, '<script src="/site-nav.js" defer></script>'), 1);
  assert.ok(fullDoc.querySelector('nav.mobile-nav[data-nav-root="mobile"]'), 'mobile nav present like every other lesson');
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
  const body = text(fullDoc.getElementById('worked-example'));
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

test('lab, bulge rule, Box-Cox, Box-Tidwell, chooser and quiz work once the loader inserts the lesson', async () => {
  const { window, document, errors, requests, ready } = await loadedThroughLoader();
  assert.ok(ready, 'upskill-lesson-content-ready fired');
  assert.equal(ready.resource, RESOURCE);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/lesson-content?resource=' + encodeURIComponent(RESOURCE));
  assert.equal(requests[0].init.headers.Authorization, 'Bearer a.b.c');
  assert.equal(requests[0].init.credentials, 'omit');
  assert.equal(document.querySelector('[data-protected-lesson]').getAttribute('data-state'), 'ready');
  assert.equal(document.getElementById('full-lesson-gate'), null, 'sign-in panel replaced by the lesson');
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

test('the public teaser shows the hero, objectives, Part 1 and a sign-in call to action', () => {
  const main = doc.querySelector('main#lesson-content');
  assert.ok(main.querySelector('.lz-hero h1'));
  assert.equal(main.querySelectorAll('.lz-chips li').length, 4);
  assert.ok(doc.getElementById('objectives-heading'));
  assert.equal(doc.querySelectorAll('.lz-objectives li').length, 5);
  assert.ok(doc.getElementById('why-linearize'), 'Part 1 is the free preview');
  for (const id of ['ladder', 'lab', 'box-cox', 'worked-example', 'chooser', 'statistics-implementation', 'references', 'quiz', 'quiz-form']) {
    assert.equal(doc.getElementById(id), null, `#${id} is not in the public page`);
  }
  // Pre-drawn so the hero looks the same without the protected lesson script.
  for (const id of ['lz-thesis-raw', 'lz-thesis-log']) assert.ok(doc.getElementById(id).querySelectorAll('circle').length > 5, `${id} drawn`);

  const mount = doc.querySelector('[data-protected-lesson]');
  assert.equal(doc.getElementById('why-linearize').nextElementSibling, mount, 'mount follows the preview');
  assert.ok(mount.getAttribute('data-search-summary').length > 80);
  const status = mount.querySelector('[data-protected-lesson-status]');
  assert.equal(status.getAttribute('role'), 'status');
  assert.equal(status.getAttribute('aria-live'), 'polite');
  const signIn = [...mount.querySelectorAll('a')].find(a => /Sign in/.test(a.textContent));
  assert.equal(signIn.getAttribute('href'), '/sign-in.html?next=' + encodeURIComponent(ROUTE));
  assert.ok([...mount.querySelectorAll('a')].some(a => a.getAttribute('href') === '/signup.html'));
  assert.equal(mount.querySelectorAll('.lz-gate-parts li').length, 17, 'Parts 2–17 plus references and quiz');
  assert.ok(doc.querySelector('.related-lessons'), 'navigation stays public');
});

test('no protected lesson text is in the public teaser', () => {
  const frag = new JSDOM(`<body>${fragment}</body>`).window.document;
  const needles = [...frag.querySelectorAll('p, li, td, dd, figcaption, summary, legend, label, pre, .lz-callout')]
    .map(text).filter(t => t.length >= 40);
  assert.ok(needles.length > 100, `${needles.length} protected passages checked`);
  const publicText = text(doc.body);
  for (const needle of needles) assert.ok(!publicText.includes(needle) && !html.includes(needle), `leaked: ${needle.slice(0, 60)}`);
  for (const marker of ['var LinearizeLab', 'LinearizeLabUI', 'quiz-submit', 'data-answer=']) assert.ok(!html.includes(marker), marker);
});

test('the protected file is a body fragment, not a page', () => {
  assert.doesNotMatch(fragment, /<!doctype|<html\b|<head\b|<body\b|<main\b|UPSKILLSPRINT_LESSON_META|<h1\b/i);
  const frag = new JSDOM(`<body>${fragment}</body>`).window.document;
  assert.equal(frag.querySelectorAll('section.lz-section').length, 17, 'Parts 2–17 and references');
  assert.ok(frag.getElementById('quiz'));
  assert.equal(frag.querySelectorAll('script').length, 3, 'quiz grader, math core, lab UI');
  assert.equal(frag.querySelectorAll('script[src]').length, 0, 'inline only: run by the loader in order');
  const teaserIds = new Set([...doc.querySelectorAll('[id]')].map(el => el.id));
  for (const el of frag.querySelectorAll('[id]')) assert.ok(!teaserIds.has(el.id), `#${el.id} is unique across teaser and fragment`);
});

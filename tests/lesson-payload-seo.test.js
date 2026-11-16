'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const SEO = 'title, meta[name="description"], link[rel~="canonical"], meta[property^="og:"], meta[name^="twitter:"]';
const tags = (root, selector) => Array.from(root.querySelectorAll(selector), tag => tag.outerHTML);

async function fixture(shell, url) {
  const dom = new JSDOM(shell, { url, runScripts: 'outside-only' });
  const w = dom.window;
  await new Promise(resolve => w.addEventListener('load', resolve, { once: true }));
  // Execute only the loader and shared helper; no CDN or lesson controller runs.
  Object.assign(w, { Blob, Response, DecompressionStream });
  w.fetch = async target => {
    const resource = new URL(target, url);
    assert.equal(resource.origin, new URL(url).origin);
    return { ok: true, text: async () => read(resource.pathname.slice(1)) };
  };
  const append = w.document.head.appendChild.bind(w.document.head);
  w.document.head.appendChild = tag => {
    const result = append(tag);
    if (tag.rel === 'preload') queueMicrotask(() => tag.dispatchEvent(new w.Event('load')));
    return result;
  };
  w.document.documentElement.dataset.theme = 'dark';
  w.eval(read('lesson-payload-swap.js'));
  return dom;
}

const lessons = [
  ['Chi-square', 'lessons/statistics/chi-square-goodness-of-fit-test.html',
    'assets/lessons/chi-square-goodness-of-fit/payload.js'],
  ['Beyond the Bell', 'lessons/statistics/beyond-the-bell-the-normal-distribution-and-its-relatives.html'],
  ['DMAIC', 'lessons/lean-six-sigma/dmaic-formula-encyclopedia.html']
];

for (const [name, file, payloadScript] of lessons) {
  test(`${name}: the real loader preserves shell SEO and decoded lesson content`, async () => {
    const url = 'https://upskillsprint.com/' + file.replace(/\.html$/, '');
    const dom = await fixture(read(file), url);
    const w = dom.window;
    try {
      const expected = tags(w.document.head, SEO).sort();
      const loader = Array.from(w.document.scripts).find(script =>
        !script.src && script.textContent.includes('DecompressionStream'));
      assert.ok(loader, 'exercise the actual lesson loader');
      if (payloadScript) w.eval(read(payloadScript));

      let decoded;
      const swap = w.upskillWriteLessonDocument;
      w.upskillWriteLessonDocument = html => {
        decoded = new w.DOMParser().parseFromString(html, 'text/html');
        return swap(html);
      };
      await w.eval(loader.textContent);

      const doc = w.document;
      assert.ok(decoded, 'the loader must use the shared document swap');
      assert.deepEqual(tags(doc.head, SEO).sort(), expected);
      assert.match(doc.title, / \| UpSkill Sprint$/);
      assert.ok(doc.title.length <= 65);
      const description = doc.querySelector('meta[name="description"]').content;
      assert.ok(description.length >= 150 && description.length <= 160);
      assert.equal(doc.querySelector('link[rel="canonical"]').href, url);
      assert.equal(doc.querySelector('meta[property="og:description"]').content, description);
      assert.equal(doc.documentElement.dataset.theme, 'dark');
      assert.ok(doc.getElementById('lesson-swap-background'));
      assert.equal(doc.body.innerHTML, decoded.body.innerHTML, 'keep the complete decoded body');
      const LD = 'script[type="application/ld+json"]';
      const NON_LD = 'script:not([type="application/ld+json"])';
      assert.deepEqual(tags(doc, NON_LD), tags(decoded, NON_LD), 'keep script attributes and source');
      const shellLd = tags(new w.DOMParser().parseFromString(read(file), 'text/html'), LD);
      if (shellLd.length) assert.deepEqual(tags(doc, LD), shellLd, 'wrapper JSON-LD carried over exactly once');
      else assert.deepEqual(tags(doc, LD), tags(decoded, LD), 'payload-only JSON-LD kept');
      assert.deepEqual(tags(doc, 'link[rel="stylesheet"]'), tags(decoded, 'link[rel="stylesheet"]'));
      assert.deepEqual(tags(doc, 'style:not(#lesson-swap-background)'), tags(decoded, 'style'));
      if (name === 'DMAIC') {
        const logo = doc.querySelector('header.site .brand img');
        assert.equal(logo.getAttribute('src'), '/assets/logo-wordmark.png');
        assert.equal(logo.dataset.logoLight, '/assets/logo-wordmark.png');
        assert.equal(logo.dataset.logoDark, '/assets/logo-wordmark-on-dark.png');
        assert.equal(logo.alt, 'UpSkill Sprint Consulting');
        assert.equal(doc.querySelectorAll('header.site, footer.site').length, 2);
        assert.equal(doc.querySelectorAll('img[src*="logo-icon.png"]').length, 0);
        assert.equal(doc.querySelector('header.site .brand span'), null);
        assert.deepEqual(Array.from(doc.querySelectorAll('header.site [data-nav-item]'), node => node.dataset.navItem),
          ['start', 'lessons', 'exam', 'tools', 'services', 'about']);
        assert.ok(doc.querySelector('link[href="/site-nav.css"]'));
        assert.ok(doc.querySelector('script[src="/site-nav.js"][defer]'));
        assert.ok(doc.querySelector('#mnav-check'));
        assert.ok(doc.querySelector('label[for="mnav-check"].mobile-menu-btn'));
      }
    } finally { w.close(); }
  });
}

test('conflicting and duplicate payload SEO tags are replaced, without copying loader scripts', async () => {
  const file = lessons[0][1];
  const dom = await fixture(read(file), 'https://upskillsprint.com/' + file.replace(/\.html$/, ''));
  const w = dom.window;
  try {
    const expected = tags(w.document.head, SEO).sort();
    await w.upskillWriteLessonDocument(`<!doctype html><html><head>
      <title>Old title</title><title>Duplicate title</title>
      <meta name="description" content="Old"><meta name="description" content="Duplicate">
      <link rel="canonical" href="https://example.com/wrong"><link rel="canonical" href="/duplicate">
      <meta property="og:title" content="Old"><meta property="og:title" content="Duplicate">
      <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Stale">
      </head><body><h1>Keep this lesson</h1><script>window.lessonRan = true;</script></body></html>`);
    assert.deepEqual(tags(w.document.head, SEO).sort(), expected);
    assert.equal(w.document.querySelectorAll('script').length, 1);
    assert.equal(w.document.querySelector('h1').textContent, 'Keep this lesson');
    assert.equal(w.lessonRan, undefined, 'the test must not execute payload scripts');
  } finally { w.close(); }
});

test('DMAIC keeps its wrapper LearningResource and BreadcrumbList exactly once after the swap', async () => {
  const file = 'lessons/lean-six-sigma/dmaic-formula-encyclopedia.html';
  const dom = await fixture(read(file), 'https://upskillsprint.com/' + file.replace(/\.html$/, ''));
  const w = dom.window;
  try {
    await w.upskillWriteLessonDocument(`<!doctype html><html><head>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","name":"Stale payload graph"}</script>
      </head><body><h1>Lesson</h1></body></html>`);
    const types = Array.from(w.document.querySelectorAll('script[type="application/ld+json"]'), s => {
      const data = JSON.parse(s.textContent);
      return (data['@graph'] || [data]).map(node => node['@type']);
    }).flat(2);
    assert.equal(types.filter(t => t === 'LearningResource').length, 1);
    assert.equal(types.filter(t => t === 'BreadcrumbList').length, 1);
    assert.ok(!types.includes('Article'), 'stale payload graph replaced');
  } finally { w.close(); }
});

test('DMAIC: the stored payload nav is redrawn from site-nav.js, not its stale snapshot', async () => {
  const file = 'lessons/lean-six-sigma/dmaic-formula-encyclopedia.html';
  const dom = await fixture(read(file), 'https://upskillsprint.com/' + file.replace(/\.html$/, ''));
  const w = dom.window;
  try {
    // Load the real shared nav, as the loader page's deferred script does.
    w.eval(read('site-nav.js'));
    assert.equal(typeof w.USSNav.markup, 'function');
    const loader = Array.from(w.document.scripts).find(script =>
      !script.src && script.textContent.includes('DecompressionStream'));
    let decoded;
    const swap = w.upskillWriteLessonDocument;
    w.upskillWriteLessonDocument = html => {
      decoded = new w.DOMParser().parseFromString(html, 'text/html');
      return swap(html);
    };
    await w.eval(loader.textContent);
    assert.ok(decoded, 'the loader must use the shared document swap');

    const doc = w.document;
    const nav = doc.querySelector('header.site nav.desktop-nav');
    assert.ok(nav, 'the lesson keeps its desktop nav');
    const { markup, tabs } = require(path.join(ROOT, 'site-nav.js'));
    const expected = new w.DOMParser().parseFromString(`<nav>${markup('desktop', 'lessons')}</nav>`, 'text/html').querySelector('nav');
    assert.equal(nav.innerHTML, expected.innerHTML, 'desktop nav matches the current site-nav.js markup');
    assert.equal(nav.getAttribute('data-nav-root'), 'desktop');
    assert.equal(nav.getAttribute('aria-label'), 'Main');
    assert.equal(nav.querySelector('[data-nav-tab][aria-current="page"]').dataset.navTab, 'lessons');

    const examTab = tabs.find(tab => tab.id === 'exam');
    assert.equal(nav.querySelector('a[data-nav-tab="exam"]').textContent, examTab.label);
    assert.equal(examTab.label, 'Certification Exam Practice');
    const examLinks = Array.from(nav.querySelectorAll('#nav-d-exam a[href^="/exam-practice#exam-"]'), a => a.getAttribute('href'));
    assert.ok(examLinks.includes('/exam-practice#exam-cqa'), 'the CQA exam is a live menu item');
    assert.equal(nav.querySelectorAll('[aria-disabled="true"]').length, 0, 'no stale "coming soon" exam rows');
    assert.doesNotMatch(nav.outerHTML, /gmail\.com/i, 'the retired Gmail address is gone from the menu');
    assert.ok(nav.querySelector('a[href="mailto:hello@upskillsprint.com"]'));

    // Only the nav changes: the lesson body (apart from the header nav) is untouched.
    const strip = d => { const c = d.body.cloneNode(true); c.querySelectorAll('nav.desktop-nav, nav.mobile-nav').forEach(n => n.remove()); return c.innerHTML; };
    assert.equal(strip(doc), strip(decoded));
    assert.match(decoded.querySelector('header.site nav.desktop-nav').outerHTML, /gmail\.com/,
      'fixture sanity: the stored payload still carries the old menu');
  } finally { w.close(); }
});

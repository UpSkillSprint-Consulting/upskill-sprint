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
      assert.deepEqual(tags(doc, 'script'), tags(decoded, 'script'), 'keep script attributes and source');
      assert.deepEqual(tags(doc, 'link[rel="stylesheet"]'), tags(decoded, 'link[rel="stylesheet"]'));
      assert.deepEqual(tags(doc, 'style:not(#lesson-swap-background)'), tags(decoded, 'style'));
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

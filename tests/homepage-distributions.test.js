'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
function setup() {
  const dom = new JSDOM(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), { runScripts: 'outside-only' });
  const queries = new Map();
  dom.window.matchMedia = query => {
    const media = { matches: false, addEventListener: (_, listener) => { media.listener = listener; } };
    queries.set(query, media);
    return media;
  };
  const script = [...dom.window.document.querySelectorAll('script')].find(script => script.textContent.includes('function normalPdf'));
  dom.window.eval(script.textContent);
  return { dom, queries, svg: dom.window.document.getElementById('hero-distributions') };
}
test('distribution graphic reflows without replacing its selected distributions', () => {
  const { dom, queries, svg } = setup();
  try {
    const labels = [...svg.querySelectorAll('text')].map(node => node.textContent);
    assert.equal(labels.length, 4);
    assert.equal(svg.getAttribute('viewBox'), '0 0 1400 380');
    const mobile = queries.get('(max-width: 900px)');
    mobile.matches = true; mobile.listener();
    assert.equal(svg.getAttribute('viewBox'), '0 0 700 760');
    assert.equal(svg.querySelectorAll(':scope > g').length, 4);
    assert.ok(svg.querySelector('[transform="translate(350 380)"]'));
    assert.deepEqual([...svg.querySelectorAll('text')].map(node => node.textContent), labels);
    assert.ok(!svg.innerHTML.includes('NaN'));
    mobile.matches = false; mobile.listener();
    assert.equal(svg.getAttribute('viewBox'), '0 0 1400 380');
    assert.deepEqual([...svg.querySelectorAll('text')].map(node => node.textContent), labels);
  } finally { dom.window.close(); }
});
test('reduced motion preserves named static distributions and responds to preference changes', () => {
  const { dom, queries, svg } = setup();
  try {
    assert.equal(svg.getAttribute('role'), 'img');
    const labels = [...svg.querySelectorAll('text')].map(node => node.textContent);
    for (const label of labels) assert.ok(svg.getAttribute('aria-label').includes(label));
    const reduced = queries.get('(prefers-reduced-motion: reduce)');
    reduced.matches = true; reduced.listener();
    assert.equal(svg.querySelectorAll('animate, animateMotion, circle').length, 0);
    assert.ok(svg.querySelector('path, rect'));
    assert.deepEqual([...svg.querySelectorAll('text')].map(node => node.textContent), labels);
    reduced.matches = false; reduced.listener();
    assert.ok(svg.querySelector('animate'));
  } finally { dom.window.close(); }
});

'use strict';
// The homepage "Live · by the numbers" card: a 3D carousel ring of the four
// live content counts, in the ticker's charcoal-and-amber palette.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

async function homepage(t, { reduce = false } = {}) {
  const dom = new JSDOM(HTML, { url: 'https://upskillsprint.com/', runScripts: 'outside-only', pretendToBeVisual: true });
  t.after(() => dom.window.close());
  const w = dom.window;
  w.matchMedia = q => ({ matches: reduce && /reduce/.test(q) });
  w.UpskillLessonCounts = () => ({ lessons: 57, subjects: 7 });
  w.UpskillToolCounts = () => 2;
  w.fetch = async url => ({ ok: url !== '/exam-practice.html', text: async () => '<html></html>' });
  const script = [...w.document.scripts].find(node => node.textContent.includes('var STATS ='));
  w.eval(script.textContent);
  await new Promise(resolve => setImmediate(resolve));
  return w;
}

test('ring renders one linked face per stat; only the front face is reachable', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  assert.equal(c.getAttribute('aria-roledescription'), 'carousel');
  const faces = [...c.querySelectorAll('a.trust-face')];
  assert.deepEqual(faces.map(f => f.getAttribute('href')), ['/lessons', '/lessons', '/engineering-tools', '/exam-practice']);
  assert.deepEqual(faces.map(f => f.querySelector('[data-stat-key]').dataset.statKey), ['lessons', 'subjects', 'tools', 'exams']);
  assert.match(c.textContent, /Certification exams/);
  assert.deepEqual(faces.map(f => f.tabIndex), [0, -1, -1, -1]);
  assert.deepEqual(faces.map(f => f.getAttribute('aria-hidden')), ['false', 'true', 'true', 'true']);
  assert.equal(c.querySelector('.trust-dot[aria-current="true"]').dataset.go, '0');
});

test('next, previous and dots turn the ring and announce the new stat', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  const ring = c.querySelector('.trust-ring');
  c.querySelector('[data-act="next"]').click();
  assert.match(ring.style.transform, /rotateY\(-90deg\)/);
  assert.equal(c.querySelectorAll('.trust-face')[1].tabIndex, 0);
  assert.match(c.querySelector('[aria-live]').textContent, /Subject areas/);
  c.querySelector('[data-act="prev"]').click();
  c.querySelector('[data-act="prev"]').click();
  // Going back from the first stat wraps to the last one by the short way round.
  assert.match(ring.style.transform, /rotateY\(90deg\)/);
  assert.equal(c.querySelector('.trust-dot[aria-current="true"]').dataset.go, '3');
  c.querySelector('.trust-dot[data-go="2"]').click();
  assert.equal(c.querySelectorAll('.trust-face')[2].getAttribute('aria-hidden'), 'false');
});

test('pause button stops the rotation and says so', async t => {
  const w = await homepage(t);
  const b = w.document.querySelector('#trust-stats [data-act="pause"]');
  assert.equal(b.getAttribute('aria-pressed'), 'false');
  b.click();
  assert.equal(b.getAttribute('aria-pressed'), 'true');
  assert.equal(b.getAttribute('aria-label'), 'Play rotation');
});

test('reduced motion: a still grid with every stat reachable, no carousel controls', async t => {
  const w = await homepage(t, { reduce: true });
  const c = w.document.getElementById('trust-stats');
  assert.ok(c.classList.contains('is-flat'));
  assert.ok([...c.querySelectorAll('.trust-face')].every(f => !f.hasAttribute('aria-hidden') && f.tabIndex === 0));
  assert.match(HTML, /\.trust-stats\.is-flat \.trust-controls \{ display: none; \}/);
  assert.equal(c.querySelector('[data-stat-key="lessons"]').textContent, '57');
});

test('charcoal-and-amber colours meet WCAG AA', () => {
  const lum = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  assert.match(HTML, /\.trust-face \{[^}]*background: #1b1b1b/);
  assert.match(HTML, /\.trust-face \.num \{[^}]*color: #ffb020/);
  assert.match(HTML, /\.trust-face \.lbl \{[^}]*color: #a3a3a3/);
  assert.ok(ratio('#ffb020', '#1b1b1b') >= 4.5);
  assert.ok(ratio('#a3a3a3', '#1b1b1b') >= 4.5);
  assert.ok(ratio('#ffb020', '#141414') >= 4.5, 'card heading');
});

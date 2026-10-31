'use strict';
// The homepage "Live · by the numbers" card: a rotating 3D box (five walls) of the
// live content counts, in the site palette, with drag-to-spin and "new since your
// last visit" badges.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

async function homepage(t, { reduce = false, previous = null, stats = { questions: 4754 }, lessons = 57 } = {}) {
  const dom = new JSDOM(HTML, { url: 'https://upskillsprint.com/', runScripts: 'outside-only', pretendToBeVisual: true });
  t.after(() => dom.window.close());
  const w = dom.window;
  if (previous) w.localStorage.setItem('uss-home-counts-v1', JSON.stringify(previous));
  w.matchMedia = q => ({ matches: reduce && /reduce/.test(q) });
  w.UpskillLessonCounts = () => ({ lessons, subjects: 7 });
  w.UpskillToolCounts = () => 2;
  w.fetch = async url => url === '/home-stats.json'
    ? { ok: !!stats, json: async () => stats }
    : { ok: url !== '/exam-practice.html', text: async () => '<html></html>' };
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
  assert.deepEqual(faces.map(f => f.getAttribute('href')), ['/lessons', '/exam-practice', '/lessons', '/engineering-tools', '/exam-practice']);
  assert.deepEqual(faces.map(f => f.querySelector('[data-stat-key]').dataset.statKey), ['lessons', 'questions', 'subjects', 'tools', 'exams']);
  assert.match(c.textContent, /Certification exams/);
  assert.match(c.textContent, /Practice questions/);
  assert.deepEqual(faces.map(f => f.tabIndex), [0, -1, -1, -1, -1]);
  assert.deepEqual(faces.map(f => f.getAttribute('aria-hidden')), ['false', 'true', 'true', 'true', 'true']);
  assert.equal(c.querySelector('.trust-dot[aria-current="true"]').dataset.go, '0');
});

test('next, previous and dots turn the ring and announce the new stat', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  const ring = c.querySelector('.trust-ring');
  c.querySelector('[data-act="next"]').click();
  assert.match(ring.style.transform, /rotateY\(-72deg\)/);
  assert.equal(c.querySelectorAll('.trust-face')[1].tabIndex, 0);
  assert.match(c.querySelector('[aria-live]').textContent, /Practice questions$/);
  c.querySelector('[data-act="prev"]').click();
  c.querySelector('[data-act="prev"]').click();
  // Going back from the first stat wraps to the last one by the short way round.
  assert.match(ring.style.transform, /rotateY\(72deg\)/);
  assert.equal(c.querySelector('.trust-dot[aria-current="true"]').dataset.go, '4');
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

test('site palette: navy faces with light-teal numbers, legible in both themes', () => {
  const lum = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const style = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');
  const navy = style.match(/--navy:\s*(#[0-9a-f]{6})/i)[1];
  const lightFace = HTML.match(/\.trust-ring-card \{[^}]*--trf-face: (#[0-9a-f]{6})/)[1];
  assert.equal(lightFace.toLowerCase(), navy.toLowerCase(), 'faces use the site navy');
  const num = HTML.match(/\.trust-face \.num \{[^}]*color: (#[0-9a-f]{6})/)[1];
  const lbl = HTML.match(/\.trust-face \.lbl \{[^}]*color: (#[0-9a-f]{6})/)[1];
  assert.match(HTML, /\.trust-face \.num \{[^}]*'Source Serif 4'/, 'numbers use the site serif');
  // Navy faces sit on the white card (light theme) and lift off the dark card (dark theme).
  for (const face of [lightFace]) {
    assert.ok(ratio(num, face) >= 4.5, 'number on ' + face);
    assert.ok(ratio(lbl, face) >= 4.5, 'label on ' + face);
  }
  // Heading and controls use site tokens on the normal site card.
  assert.match(HTML, /\.trust-ring-head \{[^}]*color: var\(--teal\)/);
  assert.match(HTML, /\.trust-ctrl \{[^}]*color: var\(--muted\)/);
  assert.doesNotMatch(HTML, /#ffb020|#141414/i, 'no leftover charcoal-and-amber colours');
});

test('the five stats form a closed 3D box: walls at the apothem, polygon lid and base', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  const faces = [...c.querySelectorAll('.trust-face')];
  assert.deepEqual(faces.map(f => f.style.transform), [0, 72, 144, 216, 288].map(a => `rotateY(${a}deg) translateZ(var(--apo))`));
  const ring = c.querySelector('.trust-ring');
  const face = ring.offsetWidth || 150; // jsdom has no layout, so the code falls back to 150px
  assert.equal(ring.style.getPropertyValue('--apo'), (face / (2 * Math.tan(Math.PI / 5))).toFixed(2) + 'px');
  const caps = [...c.querySelectorAll('.trust-cap')];
  assert.equal(caps.length, 2);
  for (const cap of caps) {
    assert.equal(cap.getAttribute('aria-hidden'), 'true');
    assert.equal((cap.style.clipPath.match(/%\s+[\d.]+%/g) || []).length, 5, 'pentagon lid and base');
  }
  assert.ok(c.querySelector('.trust-floor[aria-hidden="true"]'), 'shadow under the box');
  assert.match(c.querySelector('.trust-ring').style.transform, /rotateX\(-18deg\)/, 'tilted so the lid shows');
});

test('practice-question total comes from /home-stats.json, with thousands separators; dash if missing', async t => {
  let w = await homepage(t, { reduce: true });
  assert.equal(w.document.querySelector('[data-stat-key="questions"]').textContent, '4,754');
  w = await homepage(t, { reduce: true, stats: null });
  assert.equal(w.document.querySelector('[data-stat-key="questions"]').textContent, '—');
});

test('"+N new since your last visit" badges show only where a count grew, and the visit is remembered', async t => {
  const w = await homepage(t, { reduce: true, previous: { lessons: 54, questions: 4754, subjects: 8 }, lessons: 57 });
  const badge = key => w.document.querySelector(`[data-new-key="${key}"]`);
  assert.equal(badge('lessons').hidden, false);
  assert.equal(badge('lessons').textContent, '+3 new');
  assert.match(badge('lessons').parentNode.querySelector('.lbl').textContent, /3 new since your last visit/);
  assert.equal(badge('questions').hidden, true, 'unchanged count: no badge');
  assert.equal(badge('subjects').hidden, true, 'a smaller count never shows a badge');
  assert.equal(badge('tools').hidden, true, 'first time a count is seen: no badge');
  const saved = JSON.parse(w.localStorage.getItem('uss-home-counts-v1'));
  assert.equal(saved.lessons, 57);
  assert.equal(saved.questions, 4754);
});

test('first visit: no badges, counts saved for next time', async t => {
  const w = await homepage(t, { reduce: true });
  assert.equal(w.document.querySelectorAll('#trust-stats .trust-new:not([hidden])').length, 0);
  assert.equal(JSON.parse(w.localStorage.getItem('uss-home-counts-v1')).lessons, 57);
});

test('drag to spin: follows the pointer, settles on the nearest wall, and a drag is not a click', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  const stage = c.querySelector('.trust-stage');
  const ring = c.querySelector('.trust-ring');
  const ev = (type, x, ts) => {
    const e = new w.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, button: 0 });
    Object.defineProperty(e, 'pointerId', { value: 1 });
    Object.defineProperty(e, 'timeStamp', { value: ts });
    stage.dispatchEvent(e);
  };
  ev('pointerdown', 300, 0);
  ev('pointermove', 260, 100); // 40px left
  assert.ok(stage.classList.contains('is-dragging'));
  assert.match(ring.style.transform, /rotateY\(-18deg\)/, 'follows the pointer (0.45 deg per px)');
  ev('pointermove', 140, 400); // 160px left in total, slow at the end
  ev('pointerup', 140, 1400);
  assert.ok(!stage.classList.contains('is-dragging'));
  // Held still for 1 s before letting go: no fling, so -72deg (Practice questions) wins.
  assert.match(ring.style.transform, /rotateY\(-72deg\)/);
  assert.equal(c.querySelectorAll('.trust-face')[1].getAttribute('aria-hidden'), 'false');
  const click = new w.MouseEvent('click', { bubbles: true, cancelable: true });
  c.querySelectorAll('.trust-face')[1].dispatchEvent(click);
  assert.equal(click.defaultPrevented, true, 'the drag did not open the link');
});

test('arrow keys turn the box when it has keyboard focus', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  c.querySelector('.trust-face').focus();
  c.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(w.document.activeElement, c.querySelectorAll('.trust-face')[1]);
  c.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  assert.equal(w.document.activeElement, c.querySelectorAll('.trust-face')[0]);
});

test('a quick flick carries momentum past the nearest wall', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  const stage = c.querySelector('.trust-stage');
  const ev = (type, x, ts) => {
    const e = new w.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, button: 0 });
    Object.defineProperty(e, 'pointerId', { value: 1 });
    Object.defineProperty(e, 'timeStamp', { value: ts });
    stage.dispatchEvent(e);
  };
  ev('pointerdown', 300, 0);
  ev('pointermove', 280, 20);
  ev('pointermove', 180, 60);   // fast: 2.5 px/ms
  ev('pointerup', 180, 70);     // released while moving
  // 120px is 54deg (nearest wall -72deg) but the flick adds ~247deg, landing further round.
  const turns = c._trustRing.state().turns;
  assert.ok(turns >= 3, 'flick spun at least three walls, got ' + turns);
});

test('mouse drags on a wall never start the browser\'s link drag, and a cancelled gesture does not fling', async t => {
  const w = await homepage(t);
  const c = w.document.getElementById('trust-stats');
  const stage = c.querySelector('.trust-stage');
  assert.ok([...c.querySelectorAll('.trust-face')].every(f => f.getAttribute('draggable') === 'false'));
  const ds = new w.Event('dragstart', { bubbles: true, cancelable: true });
  c.querySelector('.trust-face').dispatchEvent(ds);
  assert.equal(ds.defaultPrevented, true);
  const ev = (type, x, ts) => {
    const e = new w.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, button: 0 });
    Object.defineProperty(e, 'pointerId', { value: 1 });
    Object.defineProperty(e, 'timeStamp', { value: ts });
    stage.dispatchEvent(e);
  };
  ev('pointerdown', 300, 0);
  ev('pointermove', 280, 5);
  ev('pointermove', 200, 10);      // very fast
  ev('pointercancel', 200, 11);    // gesture cancelled mid-flight
  // 100px = 45deg: settles on the nearest wall (one step) with no fling.
  assert.equal(c._trustRing.state().turns, 1);
});

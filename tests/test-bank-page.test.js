'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');

const CERTS = ['CSSBB', 'CSSGB', 'CQE', 'CQA', 'CMQ', 'CRE'];

function loadPage() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc
  });
  return new Promise(res => dom.window.addEventListener('load', () => res({ window: dom.window, errors })));
}

/* ---------- site integration & contract ---------- */

test('carries the exact shared controller tags and balanced scripts', () => {
  assert.equal(html.split('<script src="/theme.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/site-sections.js"></script>').length - 1, 1);
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

test('uses the standard site shell (header, mobile nav, footer)', async () => {
  const { window } = await loadPage();
  assert.ok(window.document.querySelector('header.site'), 'site header present');
  assert.ok(window.document.querySelector('nav.mobile-nav'), 'mobile nav present');
  assert.ok(window.document.querySelector('footer.site'), 'site footer present');
  assert.ok(window.document.querySelector('link[href="style.css"]'), 'links the site stylesheet');
});

/* ---------- the certification picker (right rail) ---------- */

test('the rail lists all six certifications', async () => {
  const { window } = await loadPage();
  const tiles = Array.from(window.document.querySelectorAll('.tb-tile'));
  assert.equal(tiles.length, 6);
  const badges = tiles.map(t => t.querySelector('.tb-badge').textContent);
  CERTS.forEach(c => assert.ok(badges.includes(c), `rail includes ${c}`));
});

test('every certification is marked Coming soon (on the exam, not the section)', async () => {
  const { window } = await loadPage();
  const tags = window.document.querySelectorAll('.tb-tile .tb-tag');
  assert.equal(tags.length, 6, 'a coming-soon tag on every exam');
  Array.from(tags).forEach(t => assert.match(t.textContent, /Coming soon/));
});

/* ---------- the exam overview ---------- */

test('the overview offers the three practice modes with launch gated as coming-soon', async () => {
  const { window } = await loadPage();
  const ov = window.document.getElementById('tb-overview');
  assert.ok(ov.querySelector('.tb-soon'), 'coming-soon pill on the exam title');
  const titles = Array.from(ov.querySelectorAll('.tb-mode h4')).map(h => h.textContent);
  assert.deepEqual(titles, ['Full Exam', 'Quick Quiz', 'Focused Quiz'], 'all three modes present');
  const starts = ov.querySelectorAll('.tb-start');
  assert.equal(starts.length, 3, 'a start control per mode');
  Array.from(starts).forEach(s => assert.match(s.textContent, /Coming soon/, 'launch is gated'));
  assert.doesNotMatch(ov.textContent, /Start Final Simulation/, 'nothing playable ships yet');
});

test('Full Exam toggles between a strict timed limit and untimed', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const fullSum = () => ov().querySelector('.tb-mode .tb-mode-sum').textContent;
  assert.match(fullSum(), /Strict .* limit/, 'defaults to a strict timed limit');
  ov().querySelector('[data-timed="0"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(fullSum(), /No time limit/, 'untimed removes the limit');
});

test('quiz question count is selectable for both quiz types', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  // preset options exist
  assert.ok(ov().querySelector('[data-count="quick"][data-n="10"]'), 'quick quiz has count options');
  assert.ok(ov().querySelector('[data-count="focus"][data-n="50"]'), 'focused quiz has count options');
  ov().querySelector('[data-count="quick"][data-n="30"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(ov().querySelectorAll('.tb-mode-sum')[1].textContent, /30 questions/, 'quick count updates');
  ov().querySelector('[data-count="focus"][data-n="50"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(ov().querySelectorAll('.tb-mode-sum')[2].textContent, /50 questions/, 'focused count updates');
});

test('Focused Quiz lets you pick any Body-of-Knowledge area', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const sel = ov().querySelector('[data-focusdom]');
  assert.ok(sel, 'area selector present');
  assert.ok(sel.options.length >= 5, 'populated from the exam BoK domains');
  sel.value = sel.options[1].value;
  sel.dispatchEvent(new window.Event('change'));
  const label = sel.options[1].textContent;
  assert.ok(ov().querySelectorAll('.tb-mode-sum')[2].textContent.includes(label), 'summary reflects the chosen area');
});

test('the overview shows the Body of Knowledge weighting and domains', async () => {
  const { window } = await loadPage();
  const ov = window.document.getElementById('tb-overview');
  assert.ok(ov.querySelector('.tb-weightbar'), 'weighting bar present');
  const segs = ov.querySelectorAll('.tb-weightbar span');
  const domains = ov.querySelectorAll('.tb-dl');
  assert.ok(segs.length >= 5, 'multiple BoK segments');
  assert.equal(segs.length, domains.length, 'legend matches the bar');
});

test('picking a certification switches the overview', async () => {
  const { window } = await loadPage();
  const cre = Array.from(window.document.querySelectorAll('.tb-tile')).find(t => t.dataset.exam === 'cre');
  cre.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(window.document.getElementById('tb-overview').textContent, /Reliability Engineer/);
  // the rail re-renders on selection, so re-query for the active tile
  const active = window.document.querySelector('.tb-tile.active');
  assert.ok(active && active.dataset.exam === 'cre', 'the picked tile is active');
});

test('BoK weightings for each exam sum to 100%', async () => {
  const { window } = await loadPage();
  const tiles = Array.from(window.document.querySelectorAll('.tb-tile'));
  for (const t of tiles) {
    t.dispatchEvent(new window.Event('click', { bubbles: true }));
    const pcts = Array.from(window.document.querySelectorAll('#tb-overview .tb-dl .w'))
      .map(w => parseInt(w.textContent, 10));
    const sum = pcts.reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sum - 100) <= 2, `${t.dataset.exam} weightings ~100% (got ${sum})`);
  }
});

/* ---------- links & errors ---------- */

test('every local .html link on the page resolves to a real file (no dead links)', async () => {
  const { window } = await loadPage();
  const bad = Array.from(window.document.querySelectorAll('a[href]'))
    .map(a => a.getAttribute('href'))
    .filter(h => /\.html$/.test(h))
    .map(h => h.replace(/^\//, '').replace(/#.*$/, ''))
    .filter(rel => !fs.existsSync(path.join(ROOT, rel)));
  assert.deepEqual([...new Set(bad)], [], 'no dead .html links');
});

test('the page loads with no runtime errors', async () => {
  const { errors } = await loadPage();
  assert.deepEqual(errors, []);
});

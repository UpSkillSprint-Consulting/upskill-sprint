'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'site-ticker.js'), 'utf8');
const tk = require(path.join(ROOT, 'site-ticker.js'));
const fx = require(path.join(ROOT, 'seasonal-effects.js'));
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'site-updates.json'), 'utf8'));
const injectorUrl = 'file://' + path.join(ROOT, 'scripts', 'inject-site-ticker.mjs');

const day = (y, m, d) => new Date(y, m - 1, d, 12);
const item = (id, date, extra = {}) => ({ id, date, tag: 'Lesson', text: 'Headline ' + id, href: '/lessons', ...extra });

test('selectUpdates keeps valid recent headlines, newest first, capped', () => {
  const list = [];
  for (let i = 1; i <= 12; i++) list.push(item('a' + i, `2026-10-${String(i).padStart(2, '0')}`));
  const out = tk.selectUpdates(list, day(2026, 10, 31));
  assert.equal(out.length, tk.MAX_ITEMS);
  assert.deepEqual(out.map(u => u.id).slice(0, 3), ['a12', 'a11', 'a10']);
});

test('selectUpdates drops old, future-dated, duplicate and malformed headlines', () => {
  const now = day(2026, 10, 31);
  const out = tk.selectUpdates([
    item('ok', '2026-10-30'),
    item('old', '2026-07-01'),
    item('future', '2026-11-15'),
    item('ok', '2026-10-29'),                       // duplicate id
    item('nodate', ''),
    item('notext', '2026-10-30', { text: '  ' }),
    item('nohref', '2026-10-30', { href: '' }),
    null, 'junk'
  ], now);
  assert.deepEqual(out.map(u => u.id), ['ok']);
});

test('selectUpdates never accepts script or protocol-relative links', () => {
  const now = day(2026, 10, 31);
  for (const href of ['javascript:alert(1)', 'JAVASCRIPT:alert(1)', 'data:text/html,x', '//evil.example', 'http://insecure.example', 'lessons']) {
    assert.equal(tk.selectUpdates([item('x', '2026-10-30', { href })], now).length, 0, href);
  }
  assert.equal(tk.selectUpdates([item('x', '2026-10-30', { href: 'https://example.com/a' })], now).length, 1);
});

test('unknown tags are styled as updates, known ones keep their style', () => {
  const now = day(2026, 10, 31);
  const [a, b] = tk.selectUpdates([item('a', '2026-10-30', { tag: 'Exam' }), item('b', '2026-10-29', { tag: 'Webinar' })], now);
  assert.equal(a.kind, 'exam');
  assert.equal(b.kind, 'update');
  assert.equal(b.tag, 'Webinar');
});

test('expires retires a headline after its last day; a malformed expiry is rejected', () => {
  const list = [item('r', '2026-10-30', { tag: 'Research', href: 'https://doi.org/10.1000/x', expires: '2026-11-27' })];
  assert.equal(tk.selectUpdates(list, new Date(2026, 10, 27, 23, 59)).length, 1);
  assert.equal(tk.selectUpdates(list, new Date(2026, 10, 28, 0, 0)).length, 0);
  assert.equal(tk.selectUpdates([item('bad', '2026-10-30', { expires: 'next month' })], day(2026, 10, 31)).length, 0);
  assert.equal(tk.selectUpdates(list, day(2026, 10, 31))[0].kind, 'research');
});

test('closing hides the bar only until a newer headline is published', () => {
  const items = tk.selectUpdates([item('new', '2026-10-30'), item('older', '2026-10-20')], day(2026, 10, 31));
  assert.equal(tk.shouldShow(items, { path: '/' }), true);
  assert.equal(tk.shouldShow(items, { path: '/', closedId: 'new' }), false);
  assert.equal(tk.shouldShow(items, { path: '/', closedId: 'older' }), true);
});

test('?ticker= preview overrides closed and automation; exams and sign-in never show it', () => {
  const items = tk.selectUpdates([item('new', '2026-10-30')], day(2026, 10, 31));
  assert.equal(tk.shouldShow(items, { path: '/', closedId: 'new', search: '?ticker=on' }), true);
  assert.equal(tk.shouldShow(items, { path: '/', webdriver: true }), false);
  assert.equal(tk.shouldShow(items, { path: '/', webdriver: true, search: '?x=1&ticker=on' }), true);
  assert.equal(tk.shouldShow(items, { path: '/', search: '?ticker=off' }), false);
  assert.equal(tk.shouldShow([], { path: '/', search: '?ticker=on' }), false);
  for (const p of ['/test-bank', '/test-bank.html', '/exam-preview/mbb', '/sign-in', '/signup', '/reset-password', '/admin-access']) {
    assert.equal(tk.shouldShow(items, { path: p }), false, p);
  }
  for (const p of ['/', '/lessons', '/exam-practice', '/lessons/lean-six-sigma/dmaic-in-10-minutes']) {
    assert.equal(tk.shouldShow(items, { path: p }), true, p);
  }
});

test('every page the seasonal effects skip, the ticker skips too', () => {
  for (const p of fx.EXCLUDE_PATHS || ['/test-bank', '/exam-preview']) assert.equal(tk.excluded(p), true, p);
});

test('site-updates.json: valid, unique, short, and every link goes to a real page', () => {
  assert.ok(Array.isArray(DATA.updates) && DATA.updates.length > 0);
  const ids = new Set();
  for (const u of DATA.updates) {
    assert.ok(!ids.has(u.id), 'duplicate id ' + u.id);
    ids.add(u.id);
    assert.match(u.date, /^\d{4}-\d{2}-\d{2}$/, u.id);
    assert.ok(['Lesson', 'Exam', 'Tool', 'Research', 'Update', 'Soon'].includes(u.tag), u.id + ' tag');
    assert.ok(u.text.length <= 60, u.id + ' text is ' + u.text.length + ' characters (keep it under 60)');
    // Each headline must pass the same checks the browser applies, on its own date.
    const [y, m, d] = u.date.split('-').map(Number);
    assert.equal(tk.selectUpdates([u], day(y, m, d)).length, 1, u.id + ' is rejected by selectUpdates');
    if (/^https:\/\//.test(u.href)) continue; // outside source links (Research) can't be checked offline
    assert.ok(u.href.startsWith('/'), u.id + ': href must be a site path or https:// link');
    const pathname = u.href.split('#')[0].split('?')[0];
    const candidates = [pathname + '.html', path.join(pathname, 'index.html'), pathname === '/' ? '/index.html' : null].filter(Boolean);
    assert.ok(candidates.some(c => fs.existsSync(path.join(ROOT, c))), u.id + ': no page for ' + u.href);
    const hash = u.href.split('#')[1];
    if (hash) {
      const file = candidates.map(c => path.join(ROOT, c)).find(f => fs.existsSync(f));
      assert.ok(fs.readFileSync(file, 'utf8').includes(`id="${hash}"`), u.id + ': no #' + hash + ' on ' + pathname);
    }
  }
});

test('injector adds the tag once, before </body>, and skips exams and fragments', async () => {
  const inj = await import(injectorUrl);
  const page = '<html><body><p>x</p>\n</body></html>';
  const once = inj.injectTag(page);
  assert.equal(once, '<html><body><p>x</p>\n' + inj.TICKER_TAG + '\n</body></html>');
  assert.equal(inj.injectTag(once), null);
  assert.equal(inj.injectTag('<div>fragment</div>'), null);
  assert.equal(inj.shouldInject('index.html'), true);
  assert.equal(inj.shouldInject(path.join('lessons', 'statistics', 'x.html')), true);
  assert.equal(inj.shouldInject('test-bank.html'), false);
  assert.equal(inj.shouldInject(path.join('exam-preview', 'mbb.html')), false);
  assert.equal(inj.shouldInject('sign-in.html'), false);
  assert.equal(inj.shouldInject(path.join('lessons', 'assets', 'frag.html')), false);
});

test('build:site runs the ticker injector after the seasonal one', () => {
  const build = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts['build:site'];
  const s = build.indexOf('inject-seasonal-effects.mjs'), t = build.indexOf('inject-site-ticker.mjs');
  assert.ok(s > -1 && t > s, 'inject-site-ticker.mjs must run after inject-seasonal-effects.mjs');
});

test('seasonal badge moves up while the ticker is showing', () => {
  const src = fs.readFileSync(path.join(ROOT, 'seasonal-effects.js'), 'utf8');
  assert.match(src, /\.uss-fx-badge\{[^}]*bottom:calc\(12px \+ var\(--uss-ticker-offset,0px\)/);
});

test('ticker colours come from the site theme tokens, not its own palette', () => {
  for (const token of ['--card', '--ink', '--line', '--teal', '--teal-dark', '--accent', '--tint']) {
    assert.ok(SRC.includes('var(' + token), 'uses ' + token);
  }
  assert.match(SRC, /"Work Sans"/);
});

// ---------- DOM behaviour ----------
function dom({ reduce = false, footer = true } = {}) {
  const html = '<!doctype html><html data-theme="light"><head></head><body><main>Page</main>' +
    (footer ? '<footer class="site">Footer</footer>' : '') + '</body></html>';
  const w = new JSDOM(html, { url: 'https://upskillsprint.com/lessons', pretendToBeVisual: true }).window;
  w.matchMedia = q => ({ matches: reduce && /reduce/.test(q), media: q, addEventListener() {}, removeEventListener() {} });
  return w;
}
const ITEMS = tk.selectUpdates([
  item('n1', '2026-10-30', { tag: 'Exam', text: 'CMQ <b>Set</b> 3', href: '/exam-practice#exam-cmq' }),
  item('n2', '2026-10-29', { tag: 'Lesson', text: 'Spread Lab' })
], day(2026, 10, 31));

test('renders a labelled region; only the first copy is reachable by keyboard and screen readers', () => {
  const w = dom();
  tk._show(w, ITEMS);
  const bar = w.document.querySelector('aside.utk[aria-label="Site updates"]');
  assert.ok(bar);
  const lis = [...bar.querySelectorAll('.utk-track > li')];
  assert.equal(lis.length, 4);
  assert.deepEqual(lis.map(li => li.getAttribute('aria-hidden')), [null, null, 'true', 'true']);
  assert.deepEqual(lis.map(li => li.querySelector('a').tabIndex), [0, 0, -1, -1]);
  assert.equal(lis[0].querySelector('a').getAttribute('href'), '/exam-practice#exam-cmq');
  // Headline text is inserted as text, never as HTML.
  assert.equal(lis[0].querySelector('.utk-text').textContent, 'CMQ <b>Set</b> 3');
  assert.equal(lis[0].querySelector('b'), null);
  assert.equal(lis[0].querySelector('.utk-tag').getAttribute('data-kind'), 'exam');
  assert.equal(lis[0].querySelector('a').target, '');
  w.close();
});

test('research items link straight to the source in a new tab and say so', () => {
  const w = dom();
  const ui = tk._show(w, tk.selectUpdates([item('r', '2026-10-30', { tag: 'Research', text: 'EWMA for autocorrelated data', href: 'https://doi.org/10.1080/00224065.2026.1' })], day(2026, 10, 31)));
  const a = ui.track.querySelector('li a');
  assert.equal(a.getAttribute('href'), 'https://doi.org/10.1080/00224065.2026.1');
  assert.equal(a.target, '_blank');
  assert.equal(a.rel, 'noopener');
  assert.match(a.textContent, /EWMA for autocorrelated data \(source, opens in a new tab\)/);
  assert.equal(a.querySelector('.utk-tag').getAttribute('data-kind'), 'research');
  assert.ok(w.document.documentElement.classList.contains('utk-on'));
  assert.match(w.document.documentElement.style.getPropertyValue('--uss-ticker-offset'), /^\d+px$/);
  w.close();
});

test('pause button toggles and announces its state', () => {
  const w = dom();
  const ui = tk._show(w, ITEMS);
  assert.equal(ui.pause.getAttribute('aria-pressed'), 'false');
  ui.pause.click();
  assert.ok(ui.bar.classList.contains('is-paused'));
  assert.equal(ui.pause.getAttribute('aria-pressed'), 'true');
  assert.equal(ui.pause.getAttribute('aria-label'), 'Play updates');
  ui.pause.click();
  assert.ok(!ui.bar.classList.contains('is-paused'));
  assert.equal(ui.pause.getAttribute('aria-label'), 'Pause updates');
  w.close();
});

test('close remembers the newest headline and gives the page its space back', () => {
  const w = dom({ footer: false });
  const ui = tk._show(w, ITEMS);
  assert.ok(w.document.body.classList.contains('utk-nofooter'));
  ui.close.click();
  assert.equal(w.localStorage.getItem(tk.STORE_KEY), 'n1');
  assert.ok(!w.document.documentElement.classList.contains('utk-on'));
  assert.equal(w.document.documentElement.style.getPropertyValue('--uss-ticker-offset'), '');
  assert.ok(!w.document.body.classList.contains('utk-nofooter'));
  w.close();
});

test('reduced motion: no moving duplicate copy, and the pause button is hidden by CSS', () => {
  const w = dom({ reduce: true });
  const ui = tk._show(w, ITEMS);
  assert.equal(ui.track.children.length, 2);
  assert.ok([...ui.track.querySelectorAll('li')].every(li => !li.hasAttribute('aria-hidden')));
  assert.match(SRC, /prefers-reduced-motion:reduce\)\{[^@]*\.utk-track\{animation:none\}[^@]*\.utk-pause\{display:none\}/);
  w.close();
});

test('boot stays off on excluded pages and for automated browsers', () => {
  let fetched = 0;
  for (const [url, webdriver] of [['https://upskillsprint.com/test-bank', false], ['https://upskillsprint.com/', true]]) {
    const w = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url }).window;
    Object.defineProperty(w.navigator, 'webdriver', { value: webdriver });
    w.fetch = () => { fetched++; return Promise.resolve({ ok: false }); };
    tk.boot(w);
    w.close();
  }
  assert.equal(fetched, 0);
});

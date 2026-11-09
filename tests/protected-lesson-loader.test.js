'use strict';

// /protected-lesson.js: the client half of the gated-lesson contract. It asks
// /api/lesson-content only for a signed-in visitor, never falls back to showing
// content, and inserts + runs the fragment only on a verified 200.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LOADER = fs.readFileSync(path.join(ROOT, 'protected-lesson.js'), 'utf8');
const ROUTE = '/lessons/statistics/demo';
const KEY = 'lesson:' + ROUTE;
const FRAGMENT = '<section id="part-2"><h2>Part 2</h2><p class="math">\\(x^2\\)</p></section>' +
  '<script>window.ran = (window.ran || []).concat("one"); document.getElementById("part-2").dataset.ready = "yes";</script>' +
  '<script>window.ran = window.ran.concat("two");</script>';

function teaser(key = KEY) {
  return `<!doctype html><html lang="en"><head><title>Demo</title></head><body><main id="lesson-content"><h1>Demo</h1>
    <section id="why"><h2>Part 1</h2><p>Free preview.</p></section>
    <div id="full-lesson" data-protected-lesson="${key}" data-search-summary="Summary">
      <section id="full-lesson-gate" aria-labelledby="g"><div class="lz-gate"><h2 id="g">Keep going</h2>
        <p class="lz-gate-status" role="status" aria-live="polite" data-protected-lesson-status></p>
        <div class="lz-gate-offer"><p>Sign in to continue.</p><a class="lz-btn" href="/sign-in.html?next=%2Flessons%2Fstatistics%2Fdemo">Sign in to continue</a></div>
      </div></section>
    </div></main></body></html>`;
}

/**
 * user: undefined → session never resolves; null → signed out; object → signed in.
 * reply: { status, body } or an Error to throw from fetch.
 */
function page({ user = null, reply = { status: 200, body: { version: 1, resource: KEY, html: FRAGMENT } }, key, url = 'https://upskillsprint.com' + ROUTE, configured = true } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (e) => errors.push(e.message));
  const dom = new JSDOM(teaser(key), { url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  const w = dom.window;
  const listeners = [];
  const requests = [];
  let current = user;
  w.UpskillAuth = {
    isConfigured: () => configured,
    getUser: () => current,
    getClient: () => ({ auth: { getSession: async () => ({ data: { session: current ? { access_token: 'h.p.s', user: current } : null } }) } }),
    onChange: (fn) => { listeners.push(fn); if (current !== undefined) fn(current); }
  };
  w.fetch = async (target, init) => {
    requests.push({ target, init });
    if (reply instanceof Error) throw reply;
    return { ok: reply.status >= 200 && reply.status < 300, status: reply.status, json: async () => reply.body };
  };
  w.UpskillMath = { typeset: (els) => { w.typeset = els; return Promise.resolve(); } };
  const events = [];
  w.document.addEventListener('upskill-lesson-content-ready', (e) => events.push(e.detail));
  w.eval(LOADER);
  const signOut = () => { current = null; listeners.forEach((fn) => fn(null)); };
  const signIn = (next) => { current = next; listeners.forEach((fn) => fn(next)); };
  return { w, d: w.document, requests, events, errors, signOut, signIn, mount: w.document.querySelector('[data-protected-lesson]') };
}

const settle = () => new Promise((r) => setTimeout(r, 30));
const status = (p) => p.mount.querySelector('[data-protected-lesson-status]').textContent;

test('signed-out visitors keep the sign-in panel and never call the API', async () => {
  const p = page({ user: null });
  await settle();
  assert.equal(p.requests.length, 0);
  assert.equal(p.mount.getAttribute('data-state'), 'signed-out');
  assert.ok(p.d.getElementById('full-lesson-gate'));
  assert.equal(p.d.getElementById('part-2'), null);
  assert.equal(p.mount.querySelector('a[href^="/sign-in.html"]').getAttribute('href'), '/sign-in.html?next=' + encodeURIComponent(ROUTE));
  assert.deepEqual(p.errors, []);
});

test('a signed-in visitor gets the fragment: inserted, scripts run in order, math typeset, ready event fired', async () => {
  const p = page({ user: { id: 'u1' } });
  await settle();
  assert.equal(p.requests.length, 1);
  const { target, init } = p.requests[0];
  assert.equal(target, '/api/lesson-content?resource=' + encodeURIComponent(KEY));
  assert.equal(init.method, 'GET');
  assert.equal(JSON.stringify(init.headers), JSON.stringify({ Authorization: 'Bearer h.p.s' }), 'only the bearer token is sent');
  assert.equal(init.credentials, 'omit');
  assert.equal(init.cache, 'no-store');
  assert.equal(p.mount.getAttribute('data-state'), 'ready');
  assert.equal(p.d.getElementById('full-lesson-gate'), null, 'sign-in panel replaced');
  assert.equal(p.d.getElementById('part-2').dataset.ready, 'yes');
  assert.deepEqual([...p.w.ran], ['one', 'two']);
  assert.deepEqual(p.events.map((e) => e.resource), [KEY]);
  assert.equal(p.w.typeset[0], p.mount);
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(status(p), 'The full lesson has loaded.', 'announced politely');
  assert.equal(p.mount.querySelector('[data-protected-lesson-status]').getAttribute('aria-live'), 'polite');
  assert.deepEqual(p.errors, []);
});

test('signing out after the lesson loaded puts the sign-in panel back', async () => {
  const p = page({ user: { id: 'u1' } });
  await settle();
  assert.ok(p.d.getElementById('part-2'));
  p.signOut();
  assert.equal(p.d.getElementById('part-2'), null);
  assert.ok(p.d.getElementById('full-lesson-gate'));
  assert.equal(p.mount.getAttribute('data-state'), 'signed-out');
  p.signIn({ id: 'u2' });
  await settle();
  assert.equal(p.requests.length, 2, 'a different account asks again');
  p.signIn({ id: 'u2' });
  await settle();
  assert.equal(p.requests.length, 2, 'a token refresh for the same account does not refetch');
});

test('401, 403, server errors, bad payloads and network failures never show content', async () => {
  const cases = [
    [{ status: 401, body: { message: 'x' } }, 'signed-out', /sign-in has expired/i, 'a[href^="/sign-in.html"]'],
    [{ status: 403, body: { message: 'x' } }, 'denied', /doesn.t have access/i, 'a[href^="mailto:"]'],
    [{ status: 500, body: {} }, 'error', /couldn.t load/i, 'button'],
    [{ status: 429, body: {} }, 'error', /couldn.t load/i, 'button'],
    [{ status: 200, body: { version: 1, resource: 'lesson:/lessons/other', html: FRAGMENT } }, 'error', /couldn.t load/i, 'button'],
    [{ status: 200, body: { version: 2, resource: KEY, html: FRAGMENT } }, 'error', /couldn.t load/i, 'button'],
    [{ status: 200, body: { version: 1, resource: KEY } }, 'error', /couldn.t load/i, 'button'],
    [new Error('offline'), 'error', /couldn.t load/i, 'button']
  ];
  for (const [reply, state, message, control] of cases) {
    const p = page({ user: { id: 'u1' }, reply });
    await settle();
    assert.equal(p.mount.getAttribute('data-state'), state, JSON.stringify(reply.status || reply.message));
    assert.match(status(p), message);
    assert.ok(p.mount.querySelector(control), control);
    assert.equal(p.d.getElementById('part-2'), null);
    assert.equal(p.w.ran, undefined, 'no fragment script ran');
    assert.deepEqual(p.events, []);
  }
});

test('Try again re-requests the lesson', async () => {
  const p = page({ user: { id: 'u1' }, reply: { status: 503, body: {} } });
  await settle();
  p.mount.querySelector('button').click();
  await settle();
  assert.equal(p.requests.length, 2);
});

test('a teaser can only load its own lesson, and an unconfigured sign-in fails closed', async () => {
  const other = page({ user: { id: 'u1' }, key: 'lesson:/lessons/statistics/someone-else' });
  await settle();
  assert.equal(other.requests.length, 0);
  assert.equal(other.mount.hasAttribute('data-state'), false, 'loader stays inert');

  const html = page({ user: { id: 'u1' }, url: 'https://upskillsprint.com' + ROUTE + '.html#part-2' });
  await settle();
  assert.equal(html.requests.length, 1, '.html alias of the same lesson is fine');

  const off = page({ user: { id: 'u1' }, configured: false });
  await settle();
  assert.equal(off.requests.length, 0);
  assert.equal(off.mount.getAttribute('data-state'), 'signed-out');
  assert.match(status(off), /unavailable/);
});

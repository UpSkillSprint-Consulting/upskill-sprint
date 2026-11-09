'use strict';

// netlify/functions/lesson-content.mjs releases a gated lesson body only after the
// visitor's session is live (/auth/v1/user) and can_access_content() returns true.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const KEY = 'lesson:/lessons/statistics/choosing-a-transformation-to-linearize-data';
const TOKEN = 'header.learner.signature';
const SUPABASE = { url: 'https://test.supabase.co', key: 'sb_publishable_test' };
const FRAGMENT = '<section id="ladder"><h2>Protected</h2><p>Only for registered learners.</p></section>';
let createHandler, config, HEADERS, catalog, shared;

test.before(async () => {
  ({ createHandler, config, HEADERS } = await import('../netlify/functions/lesson-content.mjs'));
  catalog = await import('../content/protected-lesson-catalog.mjs');
  shared = await import('../netlify/functions/_shared/supabase-access.mjs');
});

const request = (query = 'resource=' + encodeURIComponent(KEY), authorization = 'Bearer ' + TOKEN, method = 'GET') =>
  new Request('https://example.invalid/api/lesson-content?' + query, { method, headers: authorization ? { Authorization: authorization } : {} });

/** user: response for /auth/v1/user; decision: JSON body (or Response) for can_access_content. */
function harness({ user = { id: 'u1' }, userStatus = 200, decision = true, decisionStatus = 200, settings = SUPABASE, load } = {}) {
  const calls = [], reads = [];
  const run = createHandler({
    getSettings: () => settings,
    request: async (url, init) => {
      calls.push({ url, init });
      if (url.endsWith('/auth/v1/user')) return new Response(JSON.stringify(user), { status: userStatus });
      if (url.endsWith('/rest/v1/rpc/can_access_content')) return new Response(JSON.stringify(decision), { status: decisionStatus });
      throw new Error('unexpected upstream ' + url);
    },
    loadLesson: load || (async (file) => { reads.push(file); return FRAGMENT; })
  });
  return { run, calls, reads };
}

async function body(response) { return response.text(); }

test('a live Registered session gets the fragment, uncached and unindexed', async () => {
  const h = harness();
  const response = await h.run(request());
  assert.equal(response.status, 200);
  const data = JSON.parse(await body(response));
  assert.deepEqual(data, { version: 1, resource: KEY, html: FRAGMENT });
  assert.deepEqual(h.reads, ['statistics/choosing-a-transformation-to-linearize-data.html']);
  assert.equal(response.headers.get('cache-control'), 'private, no-store, max-age=0');
  assert.equal(response.headers.get('cdn-cache-control'), 'no-store');
  assert.equal(response.headers.get('netlify-cdn-cache-control'), 'no-store');
  assert.equal(response.headers.get('vary'), 'Authorization');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');

  const [userCall, rpcCall] = h.calls;
  assert.equal(userCall.url, SUPABASE.url + '/auth/v1/user');
  assert.equal(userCall.init.headers.Authorization, 'Bearer ' + TOKEN);
  assert.equal(userCall.init.headers.apikey, SUPABASE.key);
  assert.equal(rpcCall.url, SUPABASE.url + '/rest/v1/rpc/can_access_content');
  assert.equal(rpcCall.init.method, 'POST');
  assert.deepEqual(JSON.parse(rpcCall.init.body), { requested_resource_key: KEY });
  assert.equal(rpcCall.init.headers.Authorization, 'Bearer ' + TOKEN, 'the visitor’s own JWT, never a service key');
  for (const call of h.calls) {
    assert.equal(call.init.cache, 'no-store');
    assert.equal(call.init.redirect, 'error');
    assert.ok(call.init.signal, 'upstream calls time out');
  }
});

test('anonymous, malformed, unknown, duplicate, traversal and wrong-method requests fail before Supabase or disk', async () => {
  const h = harness();
  const cases = [
    [request(undefined, ''), 401],
    [request(undefined, 'Bearer forged'), 401],
    [request(undefined, 'Basic ' + TOKEN), 401],
    [request(undefined, 'Bearer ' + 'a'.repeat(9000) + '.b.c'), 401],
    [request('resource=' + encodeURIComponent('lesson:/lessons/statistics/other-lesson')), 404],
    [request('resource=' + encodeURIComponent('lesson:/lessons/statistics/../../netlify/functions/lesson-content')), 404],
    [request('resource=' + encodeURIComponent('statistics/choosing-a-transformation-to-linearize-data.html')), 404],
    [request('resource=' + encodeURIComponent('toString')), 404],
    [request('resource=__proto__'), 404],
    [request(''), 404],
    [request('resource=' + encodeURIComponent(KEY) + '&resource=' + encodeURIComponent(KEY)), 404],
    [request('resource=' + encodeURIComponent(KEY) + '&user_id=admin'), 400],
    [request(undefined, undefined, 'POST'), 405],
    [request(undefined, undefined, 'DELETE'), 405]
  ];
  for (const [req, status] of cases) {
    const response = await h.run(req);
    assert.equal(response.status, status, req.url + ' ' + req.method);
    assert.doesNotMatch(await body(response), /Only for registered|<section|statistics\//, 'no lesson text or file path in errors');
  }
  assert.equal(h.calls.length, 0);
  assert.equal(h.reads.length, 0);
});

test('expired sessions, denials and backend uncertainty never release the lesson', async () => {
  const cases = [
    [{ userStatus: 401 }, 401],
    [{ userStatus: 403 }, 401],
    [{ user: {} }, 401],
    [{ userStatus: 500 }, 503],
    [{ decision: false }, 403],
    [{ decisionStatus: 401 }, 401],
    [{ decisionStatus: 500 }, 503],
    [{ decision: null }, 503],
    [{ decision: 'true' }, 503],
    [{ decision: { allowed: true } }, 503],
    [{ settings: null }, 503]
  ];
  for (const [options, status] of cases) {
    const h = harness(options);
    const response = await h.run(request());
    assert.equal(response.status, status, JSON.stringify(options));
    assert.equal(h.reads.length, 0, 'fragment never read');
    const text = await body(response);
    assert.doesNotMatch(text, /Only for registered|<section/);
    assert.equal(response.headers.get('cache-control'), 'private, no-store, max-age=0');
  }
  const thrown = createHandler({ getSettings: () => SUPABASE, request: async () => { throw new Error('network down: secret detail'); }, loadLesson: async () => FRAGMENT });
  const response = await thrown(request());
  assert.equal(response.status, 503);
  assert.doesNotMatch(await body(response), /secret detail/);
  const unreadable = harness({ load: async () => { throw new Error('ENOENT content/protected-lessons/x.html'); } });
  const missing = await unreadable.run(request());
  assert.equal(missing.status, 503);
  assert.doesNotMatch(await body(missing), /ENOENT|content\//);
});

test('route, method and rate limit are declared; netlify.toml bundles only the protected fragments', () => {
  assert.equal(config.path, '/api/lesson-content');
  assert.equal(config.method, 'GET');
  assert.deepEqual(config.rateLimit, { windowLimit: 60, windowSize: 60, aggregateBy: ['ip', 'domain'] });
  assert.equal(HEADERS['X-Robots-Tag'], 'noindex');
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  assert.match(toml, /\[functions\."lesson-content"\]\s*\n\s*included_files = \["content\/protected-lessons\/\*\*"\]/);
  const source = fs.readFileSync(path.join(ROOT, 'netlify/functions/lesson-content.mjs'), 'utf8');
  assert.doesNotMatch(source, /service_role|sb_secret_|SUPABASE_SERVICE/i, 'no privileged key');
});

test('the allow-list matches content/protected-lessons exactly and resolves inside it', () => {
  const dir = path.join(ROOT, catalog.PROTECTED_LESSON_DIRECTORY);
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const files = walk(dir).map((f) => path.relative(dir, f).split(path.sep).join('/')).sort();
  assert.deepEqual(Object.values(catalog.PROTECTED_LESSONS).sort(), files, 'every fragment is allow-listed and every entry exists');
  for (const [key, file] of Object.entries(catalog.PROTECTED_LESSONS)) {
    assert.match(key, /^lesson:\/lessons\/[a-z0-9-]+\/[a-z0-9-]+$/);
    assert.equal(file, key.replace(/^lesson:\/lessons\//, '') + '.html', 'file name follows the lesson path');
    assert.ok(path.resolve(dir, file).startsWith(dir + path.sep));
    const page = path.join(ROOT, catalog.protectedLessonRoute(key).slice(1) + '.html');
    assert.ok(fs.existsSync(page), `${key} has a public teaser page`);
    assert.match(fs.readFileSync(page, 'utf8'), new RegExp(`data-protected-lesson="${key.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}"`), 'teaser mounts its own key');
  }
  assert.equal(catalog.protectedLessonFile('constructor'), null);
  assert.equal(catalog.protectedLessonFile(undefined), null);
});

test('shared Supabase helpers keep the material checker contract', async () => {
  const { bearerToken: checkerBearer } = await import('../netlify/functions/material-checker.mjs');
  assert.equal(checkerBearer, shared.bearerToken, 'material checker uses the shared helper');
  assert.equal(shared.bearerToken(new Request('https://x.test', { headers: { Authorization: 'Bearer abc' } })), 'abc');
  assert.equal(shared.looksLikeJwt('a.b.c'), true);
  assert.equal(shared.looksLikeJwt('abc'), false);
  const ok = async () => new Response(JSON.stringify({ id: 'u' }));
  const fail = async () => new Response('{}', { status: 500 });
  assert.deepEqual(await shared.authenticatedUser('t', SUPABASE, ok), { id: 'u' });
  assert.equal(await shared.authenticatedUser('t', SUPABASE, fail), null);
  assert.equal(await shared.authenticatedUser('', SUPABASE, ok), null);
  let init;
  await shared.canAccessContent('t', 'tool:/x', SUPABASE, async (_url, i) => { init = i; return new Response('true'); });
  assert.deepEqual(Object.keys(init).sort(), ['body', 'headers', 'method'], 'material checker requests are unchanged (no extra options)');
  assert.equal(await shared.canAccessContent('t', 'tool:/x', SUPABASE, async () => new Response('true')), true);
  assert.equal(await shared.canAccessContent('t', 'tool:/x', SUPABASE, async () => new Response('"true"')), false);
  assert.equal(await shared.canAccessContent('t', 'tool:/x', SUPABASE, async () => new Response('true', { status: 500 })), false);
});

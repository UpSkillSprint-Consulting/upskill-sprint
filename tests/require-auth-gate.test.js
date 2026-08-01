'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const gateSrc = read('require-auth.js');

/* Run require-auth.js against an injected fake window/document so we can
   observe what it does without a real browser. The IIFE references window.*
   and document.*; bare globals (encodeURIComponent) resolve to Node's. */
function runGate(opts) {
  opts = opts || {};
  const classes = new Set();
  const body = {
    attrs: 'attrs' in opts ? opts.attrs : { 'data-require-auth': '' },
    hasAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attrs, name); },
    classList: { add: (c) => classes.add(c) }
  };
  const doc = { body, readyState: 'complete', addEventListener() {} };
  const loc = {
    pathname: opts.pathname || '/tools/steel-phase-explorer',
    search: opts.search || '',
    replaced: null,
    replace(url) { this.replaced = url; }
  };
  const timers = [];
  const win = {
    UpskillAuth: opts.auth,
    location: loc,
    setTimeout(fn) { timers.push(fn); return timers.length; }, /* record, don't fire */
    clearTimeout() {}
  };
  new Function('window', 'document', gateSrc)(win, doc);
  return { classes, loc, timers };
}

test('signed-in visitor: content is revealed, no redirect', () => {
  const { classes, loc } = runGate({
    auth: { isConfigured: () => true, onChange: (cb) => cb({ id: 'u1' }) }
  });
  assert.ok(classes.has('auth-ready'), 'auth-ready is added so content shows');
  assert.equal(loc.replaced, null, 'signed-in users are not redirected');
});

test('signed-out visitor: redirected to sign-in with a same-origin next', () => {
  const { classes, loc } = runGate({
    pathname: '/tools/steel-phase-explorer',
    auth: { isConfigured: () => true, onChange: (cb) => cb(null) }
  });
  assert.ok(!classes.has('auth-ready'), 'content stays hidden for signed-out users');
  assert.equal(
    loc.replaced,
    '/sign-in.html?next=' + encodeURIComponent('/tools/steel-phase-explorer'),
    'redirect carries the current path as next'
  );
});

test('unconfigured auth fails open (no lockout, no redirect)', () => {
  const { classes, loc } = runGate({
    auth: {
      isConfigured: () => false,
      onChange: () => { throw new Error('must not subscribe when auth is unconfigured'); }
    }
  });
  assert.ok(classes.has('auth-ready'), 'content is revealed rather than trapping the visitor');
  assert.equal(loc.replaced, null, 'no redirect when auth is not configured');
});

test('never traps a visitor: fail-open timeout reveals if the session never resolves', () => {
  const r = runGate({
    auth: { isConfigured: () => true, onChange: () => { /* never resolves */ } }
  });
  assert.ok(!r.classes.has('auth-ready'), 'content stays hidden until the timeout');
  assert.ok(r.timers.length >= 1, 'a fail-open timer was scheduled');
  r.timers[0](); /* simulate the timeout firing */
  assert.ok(r.classes.has('auth-ready'), 'revealed after fail-open timeout');
  assert.equal(r.loc.replaced, null, 'fail-open never redirects');
});

test('pages without data-require-auth are left untouched', () => {
  const { classes, loc } = runGate({
    attrs: {},
    auth: {
      isConfigured: () => true,
      onChange: () => { throw new Error('must not gate a page that did not opt in'); }
    }
  });
  assert.equal(classes.size, 0, 'no classes are touched');
  assert.equal(loc.replaced, null, 'no redirect on ungated pages');
});

/* Wiring guards: these fail if a future change quietly disconnects the gate. */

test('site-sections.js loads require-auth.js, after auth.js', () => {
  const src = read('site-sections.js');
  assert.match(src, /['"]\/require-auth\.js['"]/, 'require-auth.js is in the shared loader');
  const authIdx = src.indexOf('/auth.js');
  const gateIdx = src.indexOf('/require-auth.js');
  assert.ok(authIdx !== -1 && gateIdx > authIdx, 'require-auth.js must load after auth.js');
});

test('the three engineering tools opt into the gate', () => {
  assert.match(read('tools/steel-phase-explorer.html'), /<body[^>]*\bdata-require-auth\b/,
    'steel phase explorer is gated');
  assert.match(read('tools/material-specification-compliance-checker.html'), /<body[^>]*\bdata-require-auth\b/,
    'material specification compliance checker is gated');
  assert.match(read('scripts/build-grade-specification-lookup.mjs'), /grade-spec-tool-page[^)]*data-require-auth/,
    'grade specification lookup app is gated at build time');
});

test('every gated page also loads the gate script (or the overlay would trap visitors)', () => {
  /* The gate overlay is pure CSS keyed off data-require-auth; only require-auth.js
     dismisses it. A page that opts in but never loads the gate script (directly,
     or via site-sections.js which loads it) leaves every visitor stuck on
     "Checking your account…" forever — the bug that hit the grade-lookup app. */
  const loadsGate = (html) => /require-auth\.js/.test(html) || /site-sections\.js/.test(html);

  // Static tool pages: opt in AND load site-sections.js (which loads require-auth.js).
  for (const p of ['tools/steel-phase-explorer.html', 'tools/material-specification-compliance-checker.html']) {
    const html = read(p);
    assert.match(html, /data-require-auth/, p + ' is gated');
    assert.ok(loadsGate(html), p + ' opts into the gate but never loads the gate script');
  }

  // The grade-lookup app is build-generated and does NOT use site-sections.js, so
  // the build must inject the gate script itself onto the gated page. (Asserted on
  // the build source rather than by building, to avoid generating files mid-suite.)
  const build = read('scripts/build-grade-specification-lookup.mjs');
  assert.match(build, /const authHead[\s\S]*?supabase-config\.js[\s\S]*?vendor\/supabase\.js[\s\S]*?auth\.js[\s\S]*?require-auth\.js/,
    'build must define an auth head that loads the full gate stack');
  assert.match(build, /grade-spec-tool-page" data-require-auth/, 'the app page is gated');
  assert.match(build, /integrationHead \+ authHead/, 'the gated app head must inject the auth stack (require-auth.js)');
});

test('the engineering-tools hub is intentionally left public', () => {
  assert.doesNotMatch(read('engineering-tools.html'), /data-require-auth/,
    'the hub stays browsable to drive sign-ups');
});

test('sign-in.html returns visitors to a validated same-origin next', () => {
  const src = read('sign-in.html');
  assert.match(src, /getElementById|URLSearchParams/, 'sign-in script present');
  assert.match(src, /\.get\(['"]next['"]\)/, 'reads the next param');
  assert.match(src, /charAt\(1\)\s*!==\s*['"]\/['"]/, 'blocks protocol-relative // redirects');
  assert.match(src, /location\.href\s*=\s*safeNext\(\)/, 'uses the validated target');
});

test('style.css covers gated content until auth-ready', () => {
  assert.match(read('style.css'), /body\[data-require-auth\]:not\(\.auth-ready\)/,
    'gate cover rule is present');
});

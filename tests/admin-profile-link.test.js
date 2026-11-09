// The profile page's single "Admin" link, and the owner-only account access page.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM } = require('jsdom');

const root = join(__dirname, '..');
const read = name => readFileSync(join(root, name), 'utf8');
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const ADMIN_PATH = /^\/admin(?:-access|-exam-access|-tool-access)?(?:\.html)?(?:[/?#]|$)/;
const ADMIN_HREF_IN_SOURCE = /href\s*=\s*["']?\/admin(?:-access|-exam-access|-tool-access)?(?:\.html)?(?:["'/?#\s>]|$)/i;
const adminHrefs = doc => [...doc.querySelectorAll('[href]')].map(n => n.getAttribute('href')).filter(h => ADMIN_PATH.test(h));

// Real profile.html markup with the real auth.js; Supabase is a stub.
function profile(level) {
  const dom = new JSDOM(read('profile.html'), { runScripts: 'outside-only', url: 'https://upskillsprint.com/profile.html' });
  const { window } = dom;
  let callback, session = { user: { id: 'user-1', email: 'u@example.invalid', user_metadata: { role: 'administrator' } } };
  const state = { level, reads: 0 };
  const client = {
    rpc(name) { assert.equal(name, 'current_access_level'); state.reads++; const v = state.level; return typeof v === 'function' ? v() : Promise.resolve(v); },
    auth: { onAuthStateChange(fn) { callback = fn; }, getSession: () => Promise.resolve({ data: { session } }), signOut: () => Promise.resolve({}) }
  };
  window.UPSKILLSPRINT_SUPABASE_CONFIG = { url: 'https://project.supabase.co', anonKey: 'public-anon-key' };
  window.supabase = { createClient: () => client };
  window.eval(read('auth.js'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return { dom, window, doc: window.document, state, fire(event, s) { session = s; callback(event, s); } };
}
const links = doc => [...doc.querySelectorAll('a[href="/admin"]')];

test('static profile.html carries no admin hrefs or hidden admin-only markup', () => {
  const html = read('profile.html');
  assert.doesNotMatch(html, ADMIN_HREF_IN_SOURCE);
  assert.doesNotMatch(html, /data-admin-only|<template/i);
  assert.doesNotMatch(read('auth.js'), /admin-exam-access|admin-tool-access|admin-access/);
});

test('signed-out visitors and every non-admin tier get no admin link after access resolves', async () => {
  for (const level of [{ data: 'public' }, { data: 'registered' }, { data: 'premium' }, { data: 'special' }, { data: 'unknown' }, { error: { message: 'x' } }, null]) {
    const p = profile(level);
    await flush(); await flush();
    assert.equal(p.state.reads, 1, JSON.stringify(level));
    assert.deepEqual(adminHrefs(p.doc), [], JSON.stringify(level));
    p.dom.window.close();
  }
  const out = profile({ data: 'administrator' });
  out.fire('SIGNED_OUT', null); await flush(); await flush();
  assert.deepEqual(adminHrefs(out.doc), []);
  out.dom.window.close();
});

test('an administrator gets exactly one "Admin" link to /admin in the profile heading, removed on sign-out', async () => {
  const p = profile({ data: 'administrator' });
  await flush(); await flush();
  assert.equal(links(p.doc).length, 1);
  const link = links(p.doc)[0];
  assert.equal(link.textContent, 'Admin');
  assert.ok(link.closest('.profile-heading'), 'inside the profile heading area');
  assert.deepEqual(adminHrefs(p.doc), ['/admin']);
  assert.equal(p.doc.querySelector('nav a[href^="/admin"]'), null, 'never in site navigation');
  // Re-checks never duplicate the link.
  p.fire('TOKEN_REFRESHED', { user: { id: 'user-1' } }); await flush(); await flush();
  assert.equal(links(p.doc).length, 1);
  // Access changes remove it.
  p.state.level = { data: 'premium' };
  p.fire('TOKEN_REFRESHED', { user: { id: 'user-1' } });
  assert.equal(links(p.doc).length, 0, 'removed immediately while re-checking');
  await flush(); await flush();
  assert.equal(links(p.doc).length, 0);
  p.state.level = { data: 'administrator' };
  p.fire('SIGNED_IN', { user: { id: 'user-1' } }); await flush(); await flush();
  assert.equal(links(p.doc).length, 1);
  p.fire('SIGNED_OUT', null);
  assert.equal(links(p.doc).length, 0);
  assert.deepEqual(adminHrefs(p.doc), []);
  p.dom.window.close();
});

// Account access page: real admin-shell.js wrapped in spies.
function accounts(rpc) {
  const dom = new JSDOM(read('admin-access.html'), { runScripts: 'outside-only', url: 'https://example.invalid/admin-access' });
  const { window } = dom;
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  window.eval(read('admin-shell.js'));
  const real = window.UpskillAdminShell, spy = { mounts: [], denied: [] };
  window.UpskillAdminShell = { ...real,
    mount: o => { spy.mounts.push(JSON.parse(JSON.stringify(o))); return real.mount(o); },
    renderDenied: (c, o) => { spy.denied.push(JSON.parse(JSON.stringify(o))); return real.renderDenied(c, o); },
    toast: () => null };
  let change; const calls = [];
  window.UpskillAuth = { isConfigured: () => true, onChange: fn => { change = fn; },
    getClient: () => ({ rpc: (name, args) => { assert.equal(name, 'owner_manage_access'); calls.push(JSON.parse(JSON.stringify(args))); return Promise.resolve(rpc(args)); } }) };
  window.eval(read('admin-access.js'));
  return { dom, window, doc: window.document, spy, calls, async as(user) { change(user); await flush(); await flush(); } };
}

test('admin-access.html static HTML has no admin hrefs, controls or copy', () => {
  const html = read('admin-access.html');
  assert.doesNotMatch(html, ADMIN_HREF_IN_SOURCE);
  assert.doesNotMatch(html, /<template|<form|<input|<select|<button|<dialog|<fieldset/i);
  assert.match(html, /data-admin-page="accounts"/);
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  const text = html.slice(html.indexOf('<body')).replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /\b(?:owner|admin|access level|premium|special|registered)\b/i);
});

test('a non-owner gets the denied state; a signed-out visitor gets sign-in with next', async () => {
  const p = accounts(args => args.operation === 'status' ? { data: { owner: false } } : { data: { found: true } });
  await p.as({ id: 'admin-not-owner' });
  assert.deepEqual(p.calls, [{ operation: 'status' }]);
  assert.deepEqual(p.spy.mounts, []);
  assert.deepEqual(p.spy.denied, [{ signedOut: false, next: '/admin-access' }]);
  assert.match(p.doc.querySelector('.adm-denied').textContent, /This area isn’t available/);
  assert.deepEqual(adminHrefs(p.doc), []); assert.equal(p.doc.getElementById('admin-controls'), null);
  await p.as(null);
  assert.equal(p.doc.querySelector('.adm-denied a').getAttribute('href'), '/sign-in.html?next=%2Fadmin-access');
  p.dom.window.close();
});

test('the owner gets mount({page:"accounts", isOwner:true}) and the redesigned form', async () => {
  const account = { found: true, email: 'test@example.invalid', user_id: 'target', effective_level: 'premium',
    grant: { access_key: 'premium', expires_at: null }, is_owner: false,
    history: [{ changed_at: '2026-10-01T10:00:00Z', previous_level: null, new_level: 'premium', expires_at: null }] };
  const p = accounts(args => args.operation === 'status' ? { data: { owner: true } } : { data: account });
  await p.as({ id: 'owner' });
  assert.deepEqual(p.spy.mounts, [{ page: 'accounts', isOwner: true }]);
  assert.equal(p.doc.querySelector('[data-admin-tab="accounts"]').getAttribute('aria-current'), 'page');
  assert.equal(p.doc.querySelector('h1').textContent, 'Account access');
  assert.ok(p.doc.querySelector('form#admin-search.adm-search label[for="account-email"]'));
  p.doc.getElementById('account-email').value = 'test@example.invalid';
  p.doc.getElementById('admin-search').dispatchEvent(new p.window.Event('submit', { cancelable: true })); await flush();
  const group = p.doc.querySelector('fieldset#access-level.adm-field');
  assert.equal(group.querySelector('legend').textContent, 'Access level');
  const radios = [...group.querySelectorAll('input[type="radio"][name="access-level"]')];
  assert.deepEqual(radios.map(r => r.value), ['registered', 'premium', 'special', 'administrator']);
  assert.equal(group.querySelectorAll('label .adm-help').length, 4, 'one-line explanation per level');
  assert.equal(radios.find(r => r.checked).value, 'premium');
  assert.match(p.doc.getElementById('access-expiry-help').textContent, /Leave empty for no expiry\. Expired grants fall back to Registered\./);
  assert.ok(p.doc.querySelector('.adm-summary #account-title'));
  assert.equal(p.doc.querySelectorAll('#access-history.adm-timeline li time').length, 1);
  assert.equal(p.doc.getElementById('access-history-empty').hidden, true);
  assert.ok(p.doc.getElementById('access-save').classList.contains('adm-btn--primary'));
  p.dom.window.close();
});

test('owner accounts are protected and empty states are designed', async () => {
  let data = { found: true, email: 'owner@example.invalid', user_id: 'owner', effective_level: 'administrator', grant: null, is_owner: true, history: [] };
  const p = accounts(args => args.operation === 'status' ? { data: { owner: true } } : { data });
  await p.as({ id: 'owner' });
  p.doc.getElementById('admin-search').dispatchEvent(new p.window.Event('submit', { cancelable: true })); await flush();
  assert.ok([...p.doc.querySelectorAll('input[name="access-level"]')].every(r => r.disabled));
  assert.equal(p.doc.getElementById('access-save').disabled, true);
  assert.match(p.doc.getElementById('account-current').textContent, /Owner permissions are protected and cannot be edited here/);
  assert.equal(p.doc.getElementById('access-history-empty').hidden, false);
  assert.match(p.doc.getElementById('access-history-empty').textContent, /No changes recorded yet/);
  p.doc.getElementById('admin-edit').dispatchEvent(new p.window.Event('submit', { cancelable: true }));
  assert.equal(p.doc.getElementById('access-confirm-dialog').open, false, 'owner grants cannot even reach confirmation');
  data = { found: false };
  p.doc.getElementById('admin-search').dispatchEvent(new p.window.Event('submit', { cancelable: true })); await flush();
  assert.equal(p.doc.getElementById('account-empty').hidden, false);
  assert.match(p.doc.getElementById('account-empty').textContent, /No account found/);
  assert.equal(p.doc.getElementById('admin-edit').hidden, true);
  p.dom.window.close();
});

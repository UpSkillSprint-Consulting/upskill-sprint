// Admin hub (/admin) gating and the shared UpskillAdminShell API.
// The real admin-shell.js and admin.js run in jsdom; Supabase RPCs are stubbed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM } = require('jsdom');

const root = join(__dirname, '..');
const read = name => readFileSync(join(root, name), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const ADMIN_PAGES = ['admin.html', 'admin-access.html', 'admin-exam-access.html', 'admin-tool-access.html'];
const ADMIN_PATH = /^\/admin(?:-access|-exam-access|-tool-access)?(?:\.html)?(?:[/?#]|$)/;
const ADMIN_HREF_IN_SOURCE = /href\s*=\s*["']?\/admin(?:-access|-exam-access|-tool-access)?(?:\.html)?(?:["'/?#\s>]|$)/i;

function adminHrefs(document) {
  return [...document.querySelectorAll('[href]')].map(node => node.getAttribute('href')).filter(href => ADMIN_PATH.test(href));
}

function hub(handler = {}) {
  const dom = new JSDOM(read('admin.html'), { runScripts: 'outside-only', url: 'https://example.invalid/admin' });
  const { window } = dom;
  const calls = [];
  let change, user = null;
  const respond = (name, args) => {
    if (name === 'admin_manage_exam_access') return handler.admin ? handler.admin(args) : { data: { administrator: false } };
    if (name === 'owner_manage_access') return handler.owner ? handler.owner(args) : { error: { message: 'Only the site owner' } };
    throw new Error('Unexpected RPC ' + name);
  };
  window.UpskillAuth = {
    isConfigured: () => true,
    getUser: () => user,
    onChange: fn => { change = fn; },
    getClient: () => ({ rpc: (name, args) => {
      calls.push({ name, args });
      const result = Promise.resolve().then(() => respond(name, args));
      result.abortSignal = signal => { result.signal = signal; return result; };
      return result;
    } })
  };
  window.eval(read('admin-shell.js'));
  window.eval(read('admin.js'));
  const doc = window.document;
  return {
    dom, window, doc, calls,
    async as(next) { user = next; change(next); await flush(); await flush(); },
    cards: () => [...doc.querySelectorAll('[data-admin-card]')].map(node => node.dataset.adminCard),
    tabs: () => [...doc.querySelectorAll('[data-admin-tab]')].map(node => node.dataset.adminTab)
  };
}
const ADMIN = { admin: () => ({ data: { administrator: true } }) };
const OWNER = { admin: () => ({ data: { administrator: true } }), owner: () => ({ data: { owner: true } }) };

test('static hub HTML ships only the neutral skeleton with the shell loaded before the page script', () => {
  const html = read('admin.html');
  assert.doesNotMatch(html, ADMIN_HREF_IN_SOURCE);
  assert.doesNotMatch(html, /<template/i);
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.match(html, /<body data-site-chrome="minimal" data-admin-page="overview">/);
  assert.match(html, /<div id="admin-shell-header"><\/div>/);
  assert.match(html, /<main id="admin-main" class="adm"><p class="adm-checking" role="status" aria-live="polite">Checking access…<\/p><\/main>/);
  assert.match(html, /<div class="adm-toast-region" aria-live="polite" aria-atomic="false"><\/div>/);
  assert.ok(html.indexOf('href="/admin.css"') > -1);
  assert.ok(html.indexOf('src="/admin-shell.js"') < html.indexOf('src="/admin.js"'));
  for (const asset of ['/theme.js', '/site-nav.js', '/site-sections.js', '/style.css', '/site-nav.css']) assert.ok(html.includes(asset), asset);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i, 'no inline scripts');
  const bodyText = html.slice(html.indexOf('<body')).replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(bodyText, /\b(?:admin|overview|accounts|exams|tools|grant|revoke|owner)\b/i, 'no admin copy in static body');
});

test('signed out: no admin links, cards or tabs, and sign-in carries next', async () => {
  const h = hub(OWNER);
  await h.as(null);
  assert.equal(h.calls.length, 0, 'no admin RPC before sign-in');
  assert.deepEqual(adminHrefs(h.doc), []);
  assert.deepEqual(h.cards(), []); assert.deepEqual(h.tabs(), []);
  const signIn = h.doc.querySelector('[data-admin-signin]');
  assert.equal(signIn.getAttribute('href'), '/sign-in.html?next=%2Fadmin');
  assert.equal(h.doc.getElementById('admin-shell-header').children.length, 0);
  h.dom.window.close();
});

test('non-admin: "not available" with zero admin hrefs anywhere in the document', async () => {
  const h = hub({ admin: () => ({ data: { administrator: false } }), owner: () => ({ data: { owner: false } }) });
  await h.as({ id: 'learner', email: 'learner@example.invalid' });
  assert.match(h.doc.querySelector('.adm-denied h1').textContent, /This area isn’t available/);
  assert.equal(h.doc.querySelector('.adm-denied a').getAttribute('href'), '/');
  assert.deepEqual(adminHrefs(h.doc), []);
  assert.deepEqual(h.cards(), []); assert.deepEqual(h.tabs(), []);
  assert.doesNotMatch(h.doc.documentElement.outerHTML, /admin-(?:exam-|tool-)?access/);
  h.dom.window.close();
  const failed = hub({ admin: () => { throw new Error('offline'); } });
  await failed.as({ id: 'x' });
  assert.ok(failed.doc.querySelector('.adm-denied')); assert.deepEqual(adminHrefs(failed.doc), []);
  failed.dom.window.close();
  const truthy = hub({ admin: () => ({ data: { administrator: 'true' } }), owner: () => ({ data: { owner: 1 } }) });
  await truthy.as({ id: 'x' });
  assert.ok(truthy.doc.querySelector('.adm-denied'), 'only strict true passes');
  truthy.dom.window.close();
});

test('administrator (not owner): Exams and Tools cards and tabs, no Accounts', async () => {
  const h = hub(ADMIN);
  await h.as({ id: 'admin', email: 'admin@example.invalid' });
  assert.deepEqual(h.cards(), ['exams', 'tools']);
  assert.deepEqual(h.tabs(), ['overview', 'exams', 'tools']);
  assert.equal(h.doc.querySelector('[data-admin-tab="overview"]').getAttribute('aria-current'), 'page');
  assert.equal(h.doc.querySelectorAll('[aria-current="page"]').length, 1);
  assert.ok(!adminHrefs(h.doc).some(href => href.startsWith('/admin-access')));
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls.map(c => [c.name, c.args]))), [['admin_manage_exam_access', { operation: 'status' }], ['owner_manage_access', { operation: 'status' }]]);
  assert.equal(h.doc.querySelector('[data-admin-card="exams"] a').getAttribute('href'), '/admin-exam-access');
  assert.equal(h.doc.querySelector('[data-admin-card="tools"] a').getAttribute('href'), '/admin-tool-access');
  assert.equal(h.doc.querySelector('h1').textContent, 'Admin overview');
  assert.equal(h.doc.getElementById('admin-role').textContent, 'Role: Administrator');
  h.dom.window.close();
});

test('owner: Accounts, Exams and Tools cards and tabs', async () => {
  const h = hub(OWNER);
  await h.as({ id: 'owner', email: 'owner@example.invalid' });
  assert.deepEqual(h.cards(), ['accounts', 'exams', 'tools']);
  assert.deepEqual(h.tabs(), ['overview', 'accounts', 'exams', 'tools']);
  assert.equal(h.doc.querySelector('[data-admin-card="accounts"] a').getAttribute('href'), '/admin-access');
  assert.equal(h.doc.getElementById('admin-role').textContent, 'Role: Owner');
  h.dom.window.close();
});

test('owner without the administrator level sees only the Accounts card', async () => {
  const h = hub({ admin: () => ({ data: { administrator: false } }), owner: () => ({ data: { owner: true } }) });
  await h.as({ id: 'owner' });
  assert.deepEqual(h.cards(), ['accounts']);
  h.dom.window.close();
});

test('sign-out and account switches remove the header and cards and ignore late answers', async () => {
  const h = hub(OWNER);
  await h.as({ id: 'owner', email: 'owner@example.invalid' });
  assert.equal(h.cards().length, 3);
  await h.as(null);
  assert.deepEqual(h.cards(), []); assert.deepEqual(h.tabs(), []); assert.deepEqual(adminHrefs(h.doc), []);
  assert.doesNotMatch(h.doc.body.textContent, /owner@example\.invalid/);
  h.dom.window.close();

  const late = deferred();
  const s = hub({ admin: () => late.promise, owner: () => ({ data: { owner: true } }) });
  s.as({ id: 'old-admin', email: 'old@example.invalid' });
  await flush();
  await s.as(null);
  late.resolve({ data: { administrator: true } });
  await flush(); await flush();
  assert.deepEqual(s.cards(), []); assert.deepEqual(adminHrefs(s.doc), []);
  assert.ok(s.doc.querySelector('[data-admin-signin]'));
  s.dom.window.close();
});

test('the signed-in email renders as text', async () => {
  const payload = '<img src=x onerror=alert(1)>';
  const h = hub(ADMIN);
  await h.as({ id: 'admin', email: payload });
  assert.equal(h.doc.querySelector('.adm-lede strong').textContent, payload);
  assert.equal(h.doc.querySelector('.adm-lede img'), null);
  h.dom.window.close();
});

test('checkOwner resolves true only for data.owner === true and false on any failure', async () => {
  const h = hub();
  const shell = h.window.UpskillAdminShell;
  const client = result => ({ rpc: (name, args) => {
    assert.equal(name, 'owner_manage_access'); assert.equal(JSON.stringify(args), '{"operation":"status"}');
    return typeof result === 'function' ? result() : Promise.resolve(result);
  } });
  assert.equal(await shell.checkOwner(client({ data: { owner: true } })), true);
  for (const result of [{ data: { owner: false } }, { data: { owner: 'true' } }, { data: null }, null, { error: { message: 'denied' } }, { data: { owner: true }, error: { message: 'x' } }]) {
    assert.equal(await shell.checkOwner(client(result)), false, JSON.stringify(result));
  }
  assert.equal(await shell.checkOwner(client(() => { throw new Error('sync'); })), false);
  assert.equal(await shell.checkOwner(client(() => Promise.reject(new Error('network')))), false);
  assert.equal(await shell.checkOwner(null), false);
  assert.equal(await shell.checkOwner({}), false);
  // A hung request times out, is aborted and resolves false.
  let expire; const realTimeout = h.window.setTimeout;
  h.window.setTimeout = fn => { expire = fn; return 1; };
  let signal;
  const hung = { rpc: () => { const p = new Promise(() => {}); p.abortSignal = s => { signal = s; return p; }; return p; } };
  const pending = shell.checkOwner(hung);
  await flush(); expire(); h.window.setTimeout = realTimeout;
  assert.equal(await pending, false); assert.equal(signal.aborted, true);
  h.dom.window.close();
});

test('renderDenied encodes next, rejects off-site next and never renders an admin link', () => {
  const h = hub();
  const shell = h.window.UpskillAdminShell;
  const box = h.doc.getElementById('admin-main');
  shell.mount({ page: 'exams', isOwner: true });
  shell.renderDenied(box, { signedOut: true, next: '/admin-exam-access?x=1' });
  assert.equal(h.doc.getElementById('admin-shell-header').children.length, 0, 'header removed');
  assert.equal(box.querySelector('a').getAttribute('href'), '/sign-in.html?next=%2Fadmin-exam-access%3Fx%3D1');
  assert.deepEqual(adminHrefs(h.doc), []);
  for (const next of ['//evil.example', 'https://evil.example/', '/\\evil.example', 'javascript:alert(1)']) {
    shell.renderDenied(box, { signedOut: true, next });
    assert.equal(box.querySelector('a').getAttribute('href'), '/sign-in.html?next=%2F', next);
  }
  shell.renderDenied(box, { signedOut: false, next: '/admin-access' });
  assert.equal(box.querySelectorAll('a').length, 1);
  assert.equal(box.querySelector('a').getAttribute('href'), '/');
  assert.match(box.textContent, /This area isn’t available/);
  h.dom.window.close();
});

test('mount renders brand, hub link, tabs with aria-current, theme switch and a keyboard menu', async () => {
  const h = hub();
  const shell = h.window.UpskillAdminShell;
  h.doc.documentElement.dataset.theme = 'light';
  shell.mount({ page: 'tools', isOwner: false });
  const header = h.doc.querySelector('#admin-shell-header > header.adm-header');
  assert.match(header.textContent, /UpSkill Sprint/); assert.match(header.textContent, /Admin/);
  assert.ok(header.querySelector('a.adm-brand-section[href="/admin"]'));
  assert.deepEqual([...header.querySelectorAll('.adm-tabs a')].map(a => [a.textContent, a.getAttribute('href')]),
    [['Overview', '/admin'], ['Exams', '/admin-exam-access'], ['Tools', '/admin-tool-access']]);
  assert.equal(header.querySelector('[data-admin-tab="tools"]').getAttribute('aria-current'), 'page');
  const toggle = header.querySelector('button.theme-toggle[data-theme-toggle="true"]');
  assert.equal(toggle.getAttribute('role'), 'switch'); assert.equal(toggle.getAttribute('aria-checked'), 'false');
  h.doc.documentElement.dataset.theme = 'dark'; await flush();
  assert.equal(toggle.getAttribute('aria-checked'), 'true'); assert.equal(toggle.getAttribute('aria-label'), 'Switch to light mode');
  const menu = header.querySelector('.adm-menu-btn');
  assert.equal(menu.getAttribute('aria-controls'), 'adm-tabs'); assert.equal(menu.getAttribute('aria-expanded'), 'false');
  menu.click();
  assert.equal(menu.getAttribute('aria-expanded'), 'true'); assert.equal(header.dataset.menuOpen, 'true');
  assert.equal(h.doc.activeElement, header.querySelector('[aria-current="page"]'));
  h.doc.dispatchEvent(new h.window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(menu.getAttribute('aria-expanded'), 'false'); assert.equal(h.doc.activeElement, menu);
  shell.mount({ page: 'accounts', isOwner: true });
  assert.equal(h.doc.querySelectorAll('header.adm-header').length, 1, 'remount replaces the header');
  assert.equal(h.doc.querySelector('[data-admin-tab="accounts"]').getAttribute('aria-current'), 'page');
  shell.unmount();
  assert.equal(h.doc.getElementById('admin-shell-header').children.length, 0);
  h.dom.window.close();
});

test('toasts: success auto-dismisses after about 5 seconds, errors stay until dismissed, text only', () => {
  const h = hub();
  const shell = h.window.UpskillAdminShell;
  const timers = []; h.window.setTimeout = (fn, ms) => { timers.push({ fn, ms }); return timers.length; };
  h.window.clearTimeout = () => {};
  const region = h.doc.querySelector('.adm-toast-region');
  const ok = shell.toast('<b>Saved</b>', { tone: 'success' });
  assert.equal(ok.element.parentNode, region);
  assert.ok(ok.element.classList.contains('adm-toast--success'));
  assert.match(ok.element.textContent, /<b>Saved<\/b>/); assert.equal(ok.element.querySelector('b'), null);
  assert.equal(timers.at(-1).ms, 5000);
  timers.at(-1).fn();
  assert.equal(ok.element.isConnected, false);
  const before = timers.length;
  const bad = shell.toast('Could not save', { tone: 'error' });
  assert.ok(bad.element.classList.contains('adm-toast--error'));
  assert.equal(timers.length, before, 'errors never schedule dismissal');
  bad.element.querySelector('.adm-toast-close').click();
  assert.equal(bad.element.isConnected, false);
  assert.equal(shell.toast('   '), null);
  for (let i = 0; i < 6; i++) shell.toast('n' + i, { tone: 'error' });
  assert.equal(region.querySelectorAll('.adm-toast').length, 4, 'capped');
  region.remove();
  assert.ok(shell.toast('Recreated').element.closest('.adm-toast-region[aria-live="polite"]'));
  h.dom.window.close();
});

test('every admin page is noindex and ships no admin hrefs, no <template>; neither does profile.html', () => {
  for (const page of ADMIN_PAGES) {
    const html = read(page);
    assert.match(html, /<meta name="robots" content="noindex[^"]*">/, page);
    assert.match(html, /data-site-chrome="minimal"/, page);
    assert.match(html, /<main id="admin-main" class="adm"><p class="adm-checking" role="status" aria-live="polite">Checking access…<\/p><\/main>/, page);
    assert.ok(html.indexOf('src="/admin-shell.js"') > -1 && html.indexOf('href="/admin.css"') > -1, page);
    assert.doesNotMatch(html, ADMIN_HREF_IN_SOURCE, page);
    assert.doesNotMatch(html, /<template/i, page);
    assert.doesNotMatch(html, /<(?:form|input|select|button|dialog|table)\b/i, page + ' has no static controls');
  }
  const profile = read('profile.html');
  assert.doesNotMatch(profile, ADMIN_HREF_IN_SOURCE);
  assert.doesNotMatch(profile, /data-admin-only/);
});

test('every cross-link href rendered by the shell and hub points to a file in the repository', async () => {
  const h = hub(OWNER);
  await h.as({ id: 'owner', email: 'owner@example.invalid' });
  const hrefs = new Set([...h.doc.querySelectorAll('[href]')].map(n => n.getAttribute('href')));
  const shell = h.window.UpskillAdminShell;
  shell.renderDenied(h.doc.getElementById('admin-main'), { signedOut: true, next: '/admin' });
  h.doc.querySelectorAll('[href]').forEach(n => hrefs.add(n.getAttribute('href')));
  shell.renderDenied(h.doc.getElementById('admin-main'), { signedOut: false });
  h.doc.querySelectorAll('[href]').forEach(n => hrefs.add(n.getAttribute('href')));
  for (const page of ADMIN_PAGES) for (const m of read(page).matchAll(/(?:href|src)="([^"]+)"/g)) hrefs.add(m[1]);
  for (const href of hrefs) {
    if (!href.startsWith('/')) continue;
    const path = href.split(/[?#]/)[0].replace(/^\//, '');
    const file = path === '' ? 'index.html' : /\.[a-z0-9]+$/i.test(path) ? path : path + '.html';
    assert.ok(existsSync(join(root, file)), href + ' -> ' + file);
  }
  for (const target of ['/admin', '/admin-access', '/admin-exam-access', '/admin-tool-access']) assert.ok(hrefs.has(target), target);
  h.dom.window.close();
});

test('admin.css defines the whole shared vocabulary in light and dark, and the scripts stay CSP and privacy safe', () => {
  const css = read('admin.css');
  const vocabulary = ['adm', 'adm-header', 'adm-tabs', 'adm-page-title', 'adm-lede', 'adm-section-title', 'adm-grid', 'adm-card',
    'adm-card-icon', 'adm-card-body', 'adm-card-action', 'adm-panel', 'adm-btn', 'adm-btn--primary', 'adm-btn--secondary',
    'adm-btn--caution', 'adm-field', 'adm-help', 'adm-search', 'adm-summary', 'adm-chip', 'adm-chip--active', 'adm-chip--expiring',
    'adm-chip--pending', 'adm-chip--none', 'adm-layout', 'adm-sidepanel', 'adm-sidepanel-close', 'adm-table', 'adm-filters',
    'adm-empty', 'adm-skeleton', 'adm-timeline', 'adm-settings', 'adm-dialog', 'adm-toast-region', 'adm-toast', 'adm-toast--success',
    'adm-toast--error', 'adm-checking', 'adm-denied', 'sr-only'];
  for (const name of vocabulary) assert.match(css, new RegExp('\\.' + name.replace(/-/g, '\\-') + '(?![\\w-])'), name);
  assert.match(css, /html\[data-theme="dark"\]\s*\{/);
  assert.match(css, /@media \(max-width: 799\.98px\)[\s\S]*\.adm-sidepanel \{[\s\S]*position: fixed/);
  assert.match(css, /@media \(max-width: 639\.98px\)[\s\S]*\.adm-table td\[data-label\]::before \{ content: attr\(data-label\)/);
  assert.match(css, /@media \(max-width: 479\.98px\)[\s\S]*\.adm-search \{ flex-direction: column/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /prefers-reduced-motion/);
  for (const file of ['admin.js', 'admin-shell.js']) {
    assert.doesNotMatch(read(file), /innerHTML|outerHTML|insertAdjacentHTML|document\.write|setInterval|localStorage|sessionStorage|\.channel\(|service_role|eval\(/, file);
  }
  assert.doesNotMatch(read('admin.js'), /rpc\('(?!admin_manage_exam_access')/, 'the hub uses only the existing status RPC');
});

test('teardown removes every toast and cancels its timer: unmount, renderDenied and hub sign-out', async () => {
  const h = hub(OWNER);
  await h.as({ id: 'owner', email: 'owner@example.invalid' });
  const shell = h.window.UpskillAdminShell;
  const region = h.doc.querySelector('.adm-toast-region');
  const cleared = []; const realClear = h.window.clearTimeout;
  h.window.clearTimeout = id => { cleared.push(id); return realClear(id); };
  const ok = shell.toast('Saved access for learner@example.invalid', { tone: 'success' });
  shell.toast('Could not save learner@example.invalid', { tone: 'error' });
  assert.equal(region.children.length, 2);
  shell.unmount();
  assert.equal(region.children.length, 0);
  assert.doesNotMatch(h.doc.body.textContent, /learner@example\.invalid/);
  assert.ok(cleared.length >= 1, 'the success toast timer is cancelled');
  assert.equal(ok.element.isConnected, false);
  shell.toast('Error for learner@example.invalid', { tone: 'error' });
  shell.renderDenied(h.doc.getElementById('admin-main'), { signedOut: true, next: '/admin' });
  assert.equal(region.children.length, 0, 'denial clears toasts');
  shell.toast('Error for learner@example.invalid', { tone: 'error' });
  shell.clearToasts();
  assert.equal(region.children.length, 0);
  h.window.clearTimeout = realClear;
  await h.as({ id: 'owner', email: 'owner@example.invalid' });
  shell.toast('Saved for learner@example.invalid', { tone: 'error' });
  await h.as(null);
  assert.equal(h.doc.querySelectorAll('.adm-toast').length, 0, 'hub sign-out clears toasts');
  assert.doesNotMatch(h.doc.body.textContent, /learner@example\.invalid/);
  h.dom.window.close();
});

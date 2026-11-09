// Gating and redesigned UI for /admin-exam-access and /admin-tool-access.
// admin-exam-access.js runs in jsdom with the real admin-shell.js wrapped in spies,
// so the denied and header markup checked here is exactly what ships.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM } = require('jsdom');

const root = join(__dirname, '..');
const read = name => readFileSync(join(root, name), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
const ADMIN_PATH = /^\/admin(?:-access|-exam-access|-tool-access)?(?:\.html)?(?:[/?#]|$)/;
const ADMIN_HREF_IN_SOURCE = /href\s*=\s*["']?\/admin(?:-access|-exam-access|-tool-access)?(?:\.html)?(?:["'/?#\s>]|$)/i;
const DAY = 86400000;
const adminHrefs = doc => [...doc.querySelectorAll('[href]')].map(n => n.getAttribute('href')).filter(h => ADMIN_PATH.test(h));

function fixture(scope) {
  const key = scope === 'tool' ? 'tool_key' : 'exam_key';
  const iso = days => new Date(Date.now() + days * DAY).toISOString();
  const row = (k, badge, name, extra) => ({ [key]: k, badge, display_name: name, publication_status: 'published', access_status: 'locked',
    grant_revision: 0, request_revision: 0, grant_status: null, request_status: null, expires_at: null, ...extra });
  const items = [
    row('pmp', 'PMP', 'Project Management Professional'),
    row('cssbb', 'CSSBB', 'Six Sigma Black Belt', { access_status: 'granted', grant_status: 'active', grant_revision: 2, expires_at: iso(60) }),
    row('cqe', 'CQE', 'Quality Engineer', { access_status: 'granted', grant_status: 'active', grant_revision: 1, expires_at: iso(3) }),
    row('cre', 'CRE', 'Reliability Engineer', { request_status: 'pending', request_revision: 4 }),
    row('cqa', 'CQA', 'Quality Auditor', { publication_status: 'coming_soon', access_status: 'coming_soon' })
  ];
  return { found: true, user_id: 'person-id', email: 'person@example.invalid', can_receive_grants: true, is_administrator: false,
    [scope === 'tool' ? 'tools' : 'exams']: items, history: [] };
}

function page(scope, { administrator = true, owner = false, handler, narrow = false } = {}) {
  const file = 'admin-' + scope + '-access.html';
  const dom = new JSDOM(read(file), { runScripts: 'outside-only', url: 'https://example.invalid/admin-' + scope + '-access' });
  const { window } = dom;
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  window.matchMedia = query => ({ matches: narrow && /max-width/.test(query), addEventListener() {}, removeEventListener() {} });
  window.eval(read('admin-shell.js'));
  const real = window.UpskillAdminShell, spy = { mounts: [], denied: [], ownerChecks: 0, toasts: [] };
  window.UpskillAdminShell = {
    mount: o => { spy.mounts.push(JSON.parse(JSON.stringify(o))); return real.mount(o); },
    unmount: () => real.unmount(),
    renderDenied: (c, o) => { spy.denied.push(JSON.parse(JSON.stringify(o))); return real.renderDenied(c, o); },
    checkOwner: () => { spy.ownerChecks++; return Promise.resolve(owner); },
    toast: (m, o) => { spy.toasts.push({ message: m, tone: o.tone }); return real.toast(m, o); },
    clearToasts: () => real.clearToasts()
  };
  const calls = []; let change;
  const rpcName = 'admin_manage_' + scope + '_access';
  window.UpskillAuth = { isConfigured: () => true, getUser: () => ({ id: 'admin' }), onChange: fn => { change = fn; },
    getClient: () => ({ rpc: (name, args) => {
      assert.equal(name, rpcName); calls.push(JSON.parse(JSON.stringify(args)));
      const result = Promise.resolve(args.operation === 'status' ? { data: { administrator } } : handler ? handler(args) : { data: fixture(scope) });
      result.abortSignal = () => result; return result;
    } }) };
  window.eval(read('admin-exam-access.js'));
  const doc = window.document, el = id => doc.getElementById(id);
  return { dom, window, doc, el, calls, spy,
    async as(user) { change(user); await flush(); await flush(); },
    async search() { el('exam-member-email').value = 'person@example.invalid';
      el('exam-member-search').dispatchEvent(new window.Event('submit', { cancelable: true })); await flush(); },
    card: key => doc.querySelector('#exam-member-cards [data-exam="' + key + '"]'),
    visibleActions: () => ['exam-grant', 'exam-approve', 'exam-revoke', 'exam-decline'].filter(id => !el(id).hidden) };
}

test('static exam and tool pages ship no admin hrefs, controls or copy', () => {
  for (const scope of ['exam', 'tool']) {
    const html = read('admin-' + scope + '-access.html');
    assert.doesNotMatch(html, ADMIN_HREF_IN_SOURCE, scope);
    assert.doesNotMatch(html, /<template|<form|<input|<select|<button|<dialog|<table|<details/i, scope);
    assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
    assert.match(html, new RegExp('data-admin-page="' + scope + 's"'));
    assert.ok(html.indexOf('src="/admin-shell.js"') < html.indexOf('src="/admin-exam-access.js"'));
    const text = html.slice(html.indexOf('<body')).replace(/<[^>]+>/g, ' ');
    assert.doesNotMatch(text, /\b(?:admin|learner|grant|revoke|request|exam|tool)s?\b/i, scope + ' body copy');
  }
  assert.match(read('admin-tool-access.html'), /data-access-scope="tool"/);
  assert.doesNotMatch(read('admin-exam-access.html'), /data-access-scope/);
});

test('signed-out visitors get sign-in with the correct next and nothing else', async () => {
  for (const scope of ['exam', 'tool']) {
    const p = page(scope);
    await p.as(null);
    assert.equal(p.calls.length, 0);
    assert.deepEqual(p.spy.denied, [{ signedOut: true, next: '/admin-' + scope + '-access' }]);
    assert.equal(p.doc.querySelector('.adm-denied a').getAttribute('href'), '/sign-in.html?next=%2Fadmin-' + scope + '-access');
    assert.deepEqual(adminHrefs(p.doc), []); assert.deepEqual(p.spy.mounts, []);
    p.dom.window.close();
  }
});

test('non-admins get "not available" with zero admin hrefs and no owner check', async () => {
  for (const scope of ['exam', 'tool']) {
    const p = page(scope, { administrator: false });
    await p.as({ id: 'learner' });
    assert.match(p.doc.querySelector('.adm-denied').textContent, /This area isn’t available/);
    assert.deepEqual(adminHrefs(p.doc), []);
    assert.equal(p.el('exam-admin-controls'), null);
    assert.equal(p.doc.getElementById('admin-shell-header').children.length, 0);
    assert.equal(p.spy.ownerChecks, 0); assert.deepEqual(p.spy.mounts, []);
    assert.deepEqual(p.calls, [{ operation: 'status' }]);
    p.dom.window.close();
  }
});

test('administrators get mount() with the right page; owners also see the Accounts tab', async () => {
  const exam = page('exam');
  await exam.as({ id: 'admin' });
  assert.deepEqual(exam.spy.mounts, [{ page: 'exams', isOwner: false }]);
  assert.equal(exam.doc.querySelector('[aria-current="page"]').getAttribute('href'), '/admin-exam-access');
  assert.equal(exam.doc.querySelector('[data-admin-tab="accounts"]'), null);
  assert.equal(exam.doc.querySelector('h1').textContent, 'Exam access');
  exam.dom.window.close();
  const tool = page('tool', { owner: true });
  await tool.as({ id: 'owner' });
  assert.deepEqual(tool.spy.mounts, [{ page: 'tools', isOwner: true }]);
  assert.ok(tool.doc.querySelector('[data-admin-tab="accounts"]'));
  tool.dom.window.close();
});

test('the grid labels every state in text and the panel shows only valid actions', async () => {
  const p = page('exam');
  await p.as({ id: 'admin' }); await p.search();
  const chip = key => p.card(key).querySelector('.adm-chip').textContent;
  assert.equal(chip('pmp'), 'No access'); assert.equal(chip('cssbb'), 'Active');
  assert.equal(chip('cqe'), 'Expires soon'); assert.equal(chip('cre'), 'Pending request');
  assert.ok(p.card('cqe').querySelector('.adm-chip--expiring')); assert.ok(p.card('cre').querySelector('.adm-chip--pending'));
  assert.equal(p.el('exam-access-panel').hidden, true);

  p.card('pmp').click();
  assert.equal(p.el('exam-access-panel').hidden, false);
  assert.equal(p.card('pmp').getAttribute('aria-pressed'), 'true');
  assert.equal(p.doc.activeElement, p.el('exam-edit-title'));
  assert.deepEqual(p.visibleActions(), ['exam-grant']); assert.equal(p.el('exam-grant').textContent, 'Grant access');

  p.card('cssbb').click();
  assert.deepEqual(p.visibleActions(), ['exam-grant', 'exam-revoke']);
  assert.equal(p.el('exam-grant').textContent, 'Save expiry');
  assert.ok(p.el('exam-revoke').classList.contains('adm-btn--caution'));
  assert.equal(p.card('pmp').getAttribute('aria-pressed'), 'false');

  p.card('cre').click();
  assert.deepEqual(p.visibleActions(), ['exam-approve', 'exam-decline']);
  assert.ok(p.el('exam-decline').classList.contains('adm-btn--caution'));
  assert.ok(p.el('exam-approve').classList.contains('adm-btn--primary'));

  p.card('cqa').click();
  assert.deepEqual(p.visibleActions(), []); assert.equal(p.el('exam-expiry-field').hidden, true);
  assert.match(p.el('exam-edit-reason').textContent, /isn’t published/);

  // Escape closes the panel and returns focus to the card.
  p.el('exam-access-panel').dispatchEvent(new p.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(p.el('exam-access-panel').hidden, true);
  assert.equal(p.doc.activeElement, p.card('cqa'));
  assert.equal(p.card('cqa').getAttribute('aria-pressed'), 'false');
  p.card('pmp').click(); p.el('exam-panel-close').click();
  assert.equal(p.el('exam-access-panel').hidden, true); assert.equal(p.doc.activeElement, p.card('pmp'));
  assert.ok(p.doc.querySelector('.adm-settings #exam-history-prune'));
  assert.equal(p.el('exam-history-empty').hidden, false, 'no history yet');
  p.dom.window.close();
});

test('requests load on demand into a table with working status and item filters', async () => {
  const requests = [
    { user_id: 'a', email: 'a@example.invalid', exam_key: 'pmp', badge: 'PMP', requested_at: '2026-10-01T10:00:00Z' },
    { user_id: 'b', email: 'b@example.invalid', exam_key: 'cqe', badge: 'CQE', requested_at: '2026-10-02T10:00:00Z' },
    { user_id: 'c', email: 'c@example.invalid', exam_key: 'pmp', badge: 'PMP', requested_at: '2026-10-03T10:00:00Z' }
  ];
  let list = requests;
  const p = page('exam', { handler: args => args.operation === 'requests' ? { data: { requests: list, next_cursor: null } } : { data: fixture('exam') } });
  await p.as({ id: 'admin' });
  assert.equal(p.calls.length, 1, 'no requests until asked');
  p.el('exam-requests-refresh').click(); await flush();
  const rows = () => [...p.el('exam-request-list').children];
  const visible = () => rows().filter(r => !r.hidden).length;
  assert.equal(rows().length, 3); assert.equal(p.el('exam-requests-table').hidden, false);
  assert.deepEqual([...p.doc.querySelectorAll('#exam-requests-table th')].map(th => th.textContent), ['Learner', 'Certification', 'Requested', 'Status', 'Action']);
  assert.deepEqual([...rows()[0].children].map(td => td.getAttribute('data-label')), ['Learner', 'Certification', 'Requested', 'Status', '']);
  assert.equal(p.el('exam-requests-filters').hidden, false);
  assert.deepEqual([...p.el('exam-filter-item').options].map(o => o.value), ['', 'pmp', 'cqe']);
  p.el('exam-filter-item').value = 'pmp'; p.el('exam-filter-item').dispatchEvent(new p.window.Event('change'));
  assert.equal(visible(), 2); assert.match(p.el('exam-requests-status').textContent, /Showing 2 of 3/);
  p.el('exam-filter-status').value = 'pending'; p.el('exam-filter-status').dispatchEvent(new p.window.Event('change'));
  assert.equal(visible(), 2);
  p.el('exam-filter-item').value = 'cqe'; p.el('exam-filter-item').dispatchEvent(new p.window.Event('change'));
  assert.equal(visible(), 1);
  p.el('exam-filter-item').value = ''; p.el('exam-filter-item').dispatchEvent(new p.window.Event('change'));
  assert.equal(visible(), 3); assert.equal(p.el('exam-requests-nomatch').hidden, true);
  list = [];
  p.el('exam-requests-refresh').click(); await flush();
  assert.equal(p.el('exam-requests-empty').hidden, false); assert.equal(p.el('exam-requests-table').hidden, true);
  assert.equal(p.el('exam-requests-filters').hidden, true);
  assert.ok(p.el('exam-requests-retry'), 'empty state offers a next step');
  p.dom.window.close();
});

test('no account found shows a designed empty state with a next step', async () => {
  const p = page('exam', { handler: () => ({ data: { found: false } }) });
  await p.as({ id: 'admin' }); await p.search();
  assert.equal(p.el('exam-member-empty').hidden, false); assert.equal(p.el('exam-member').hidden, true);
  assert.match(p.el('exam-member-empty').textContent, /No account found/);
  p.el('exam-member-empty').querySelector('button').click();
  assert.equal(p.doc.activeElement, p.el('exam-member-email'));
  p.dom.window.close();
});

test('the tool scope uses account wording throughout', async () => {
  const p = page('tool', { handler: args => args.operation === 'requests'
    ? { data: { requests: [{ user_id: 'a', email: 'a@example.invalid', tool_key: 'pmp', badge: 'Checker', requested_at: '2026-10-01T10:00:00Z' }], next_cursor: null } }
    : { data: fixture('tool') } });
  await p.as({ id: 'admin' }); await p.search();
  assert.equal(p.doc.querySelector('h1').textContent, 'Tool access');
  assert.equal(p.el('exam-member-find').textContent, 'Find account');
  assert.equal(p.el('member-heading').textContent, 'Find an account');
  assert.equal(p.el('exam-items-heading').textContent, 'Tools');
  p.el('exam-requests-refresh').click(); await flush();
  assert.deepEqual([...p.doc.querySelectorAll('#exam-requests-table th')].slice(0, 2).map(th => th.textContent), ['Account', 'Tool']);
  p.card('cssbb').click();
  p.el('exam-access-edit').dispatchEvent(new p.window.SubmitEvent('submit', { cancelable: true, submitter: p.el('exam-revoke') }));
  assert.match(p.el('exam-decision-summary').textContent, /^Account: person@example\.invalid\nTool: /);
  assert.match(p.el('exam-decision-summary').textContent, /account’s next protected request/);
  assert.doesNotMatch(p.doc.body.textContent, /learner/i);
  const exam = page('exam');
  await exam.as({ id: 'admin' });
  assert.equal(exam.el('exam-member-find').textContent, 'Find learner');
  assert.match(exam.doc.body.textContent, /learner/);
  exam.dom.window.close(); p.dom.window.close();
});

const keydown = (p, target, key, shiftKey = false) => {
  const event = new p.window.KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
  target.dispatchEvent(event); return event;
};

test('under 800px the panel is a modal bottom sheet: outside is inert, Tab is contained, Esc returns focus', async () => {
  const requests = [{ user_id: 'person-id', email: 'person@example.invalid', exam_key: 'cre', badge: 'CRE', requested_at: '2026-10-01T10:00:00Z' }];
  const p = page('exam', { narrow: true, handler: args => args.operation === 'requests' ? { data: { requests, next_cursor: null } } : { data: fixture('exam') } });
  await p.as({ id: 'admin' }); await p.search();
  const header = p.el('admin-shell-header'), panel = p.el('exam-access-panel');
  const back = p.doc.querySelector('#admin-main > p a[href="/exam-practice"]').parentElement;
  p.card('cssbb').click();
  for (const node of [header, back, p.el('exam-admin-title'), p.el('exam-workspace'), p.el('exam-settings')]) assert.equal(node.inert, true, node.id || node.className);
  // jsdom has no native inert, so "not inert" is checked as "never set to true".
  const inertNodes = () => [...p.doc.querySelectorAll('*')].filter(n => n.inert === true);
  assert.notEqual(panel.inert, true); assert.notEqual(p.el('exam-admin-controls').inert, true);
  assert.notEqual(p.el('exam-decision-dialog').inert, true, 'the confirmation dialog stays usable');
  assert.ok(inertNodes().every(n => !n.contains(panel)), 'no ancestor of the sheet is inert');
  assert.equal(panel.getAttribute('role'), 'dialog'); assert.equal(panel.getAttribute('aria-modal'), 'true');
  // Tab wraps inside the sheet in both directions.
  const focusables = [...panel.querySelectorAll('button, input, select, textarea, a[href]')].filter(n => !n.disabled && !n.closest('[hidden]'));
  const first = focusables[0], last = focusables.at(-1);
  assert.equal(first, p.el('exam-panel-close')); assert.equal(last, p.el('exam-revoke'));
  last.focus(); assert.equal(keydown(p, last, 'Tab').defaultPrevented, true); assert.equal(p.doc.activeElement, first);
  assert.equal(keydown(p, first, 'Tab', true).defaultPrevented, true); assert.equal(p.doc.activeElement, last);
  p.el('exam-edit-title').focus(); keydown(p, p.el('exam-edit-title'), 'Tab', true); assert.equal(p.doc.activeElement, last);
  p.el('exam-grant').focus();
  assert.equal(keydown(p, p.el('exam-grant'), 'Tab').defaultPrevented, false, 'Tab moves normally between inner controls');
  // Escape closes, releases every inert node and returns focus to the trigger card.
  keydown(p, p.el('exam-grant'), 'Escape');
  assert.equal(panel.hidden, true); assert.equal(panel.hasAttribute('role'), false);
  assert.deepEqual(inertNodes(), []);
  assert.equal(p.doc.activeElement, p.card('cssbb'));
  // A request's Review button gets focus back when the sheet it opened is closed.
  p.el('exam-requests-refresh').click(); await flush();
  const review = p.el('exam-request-list').querySelector('button');
  review.click(); await flush();
  assert.equal(panel.hidden, false); assert.equal(header.inert, true);
  p.el('exam-panel-close').click();
  assert.equal(p.doc.activeElement, review); assert.equal(header.inert, false);
  // Sign-out with the sheet open leaves nothing inert behind.
  p.card('pmp').click(); assert.equal(header.inert, true);
  await p.as(null);
  assert.notEqual(header.inert, true); assert.deepEqual([...p.doc.querySelectorAll('*')].filter(n => n.inert === true), []);
  p.dom.window.close();
});

test('wide screens keep the side panel non-modal', async () => {
  const p = page('exam');
  await p.as({ id: 'admin' }); await p.search();
  p.card('pmp').click();
  assert.equal(p.el('exam-access-panel').hasAttribute('role'), false);
  assert.deepEqual([...p.doc.querySelectorAll('*')].filter(n => n.inert === true), []);
  p.dom.window.close();
});

test('status is a polite live region and focus moves only after controls are un-inerted', async () => {
  const p = page('tool');
  await p.as({ id: 'admin' });
  const status = p.el('exam-admin-status');
  assert.equal(status.getAttribute('role'), 'status'); assert.equal(status.getAttribute('aria-live'), 'polite');
  const title = p.el('exam-member-title'), controls = p.el('exam-admin-controls');
  const seen = []; const realFocus = title.focus.bind(title);
  title.focus = () => { seen.push(controls.inert || controls.hasAttribute('aria-busy')); realFocus(); };
  await p.search();
  assert.deepEqual(seen, [false]); assert.equal(p.doc.activeElement, title);
  assert.equal(status.textContent, 'Choose a tool to manage.');
  // Opening a request focuses the panel title only once the controls are live again.
  const editTitle = p.el('exam-edit-title'); const editSeen = []; const realEdit = editTitle.focus.bind(editTitle);
  editTitle.focus = () => { editSeen.push(controls.inert); realEdit(); };
  p.card('cssbb').click();
  assert.deepEqual(editSeen, [false]);
  p.dom.window.close();
});

test('a toast showing an account email is gone after sign-out and after an account switch', async () => {
  for (const next of [null, { id: 'other-admin' }]) {
    const p = page('exam', { handler: () => ({ error: { message: 'Saving failed for person@example.invalid.', code: '40001' } }) });
    await p.as({ id: 'admin' }); await p.search();
    const region = p.doc.querySelector('.adm-toast-region');
    assert.equal(region.querySelectorAll('.adm-toast--error').length, 1);
    assert.match(region.textContent, /person@example\.invalid/);
    await p.as(next);
    assert.equal(region.children.length, 0);
    assert.doesNotMatch(p.doc.body.textContent, /person@example\.invalid/);
    p.dom.window.close();
  }
});

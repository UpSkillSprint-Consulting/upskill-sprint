/* Admin hub (/admin). Renders nothing admin-related until the server agrees.
   Checks, both existing and unchanged:
   - administrator: admin_manage_exam_access {operation:'status'} -> data.administrator === true
     (the same allowed test admin-exam-access.js uses)
   - owner: UpskillAdminShell.checkOwner(client) -> owner_manage_access {operation:'status'}
   Exams and Tools cards need administrator; the Accounts card and tab need owner.
   No polling, no storage, no HTML string injection. */
(function () {
  'use strict';

  var HUB_PATH = '/admin';
  var TIMEOUT_MS = 12000;
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var AREAS = [
    { key: 'accounts', needs: 'owner', title: 'Account access', href: '/admin-access', action: 'Manage accounts',
      text: 'Set each account’s membership level and optional expiry. Owner only.',
      icon: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.15a3.5 3.5 0 0 1 0 6.7' },
    { key: 'exams', needs: 'administrator', title: 'Exam access', href: '/admin-exam-access', action: 'Manage exams',
      text: 'Grant, review and revoke access to individual certification exams, and answer requests.',
      icon: 'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2M9 13l2 2 4-4' },
    { key: 'tools', needs: 'administrator', title: 'Tool access', href: '/admin-tool-access', action: 'Manage tools',
      text: 'Grant, review and revoke access to individual engineering tools, and answer requests.',
      icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.4 2.4-2.3-.6-.6-2.3z' }
  ];

  var auth = null;
  var epoch = 0;
  var active = [];

  function byId(id) { return document.getElementById(id); }
  function shell() { return window.UpskillAdminShell || null; }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }
  function svg(d) {
    var node = document.createElementNS(SVG_NS, 'svg');
    node.setAttribute('viewBox', '0 0 24 24');
    node.setAttribute('fill', 'none');
    node.setAttribute('stroke', 'currentColor');
    node.setAttribute('stroke-width', '1.8');
    node.setAttribute('stroke-linecap', 'round');
    node.setAttribute('stroke-linejoin', 'round');
    node.setAttribute('aria-hidden', 'true');
    node.setAttribute('focusable', 'false');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    node.appendChild(path);
    return node;
  }

  function abortActive() {
    active.forEach(function (controller) { try { controller.abort(); } catch (error) { /* ignore */ } });
    active = [];
  }

  function showChecking() {
    var s = shell();
    if (s) s.unmount(); else { var host = byId('admin-shell-header'); if (host) host.replaceChildren(); }
    var status = el('p', 'adm-checking', 'Checking access…');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    byId('admin-main').replaceChildren(status);
  }

  function deny(signedOut) {
    var s = shell();
    var main = byId('admin-main');
    if (s) { s.renderDenied(main, { signedOut: signedOut, next: HUB_PATH }); return; }
    var host = byId('admin-shell-header'); if (host) host.replaceChildren();
    main.replaceChildren(el('p', 'adm-denied', 'This area isn’t available.'));
  }

  // Existing administrator check, unchanged: the exam access status operation.
  function checkAdministrator(client) {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    if (controller) active.push(controller);
    var timer;
    return Promise.resolve().then(function () {
      var query = client.rpc('admin_manage_exam_access', { operation: 'status' });
      if (controller && query && typeof query.abortSignal === 'function') query = query.abortSignal(controller.signal);
      var timeout = new Promise(function (resolve) {
        timer = setTimeout(function () { if (controller) controller.abort(); resolve(null); }, TIMEOUT_MS);
      });
      return Promise.race([query, timeout]);
    }).then(function (result) {
      return Boolean(result && !result.error && result.data && result.data.administrator === true);
    }).catch(function () { return false; }).then(function (allowed) {
      clearTimeout(timer);
      return allowed;
    });
  }

  function card(area) {
    var item = el('li', 'adm-card');
    item.setAttribute('data-admin-card', area.key);
    var badge = el('span', 'adm-card-icon');
    badge.appendChild(svg(area.icon));
    var body = el('div', 'adm-card-body');
    var heading = el('h3', null, area.title);
    heading.id = 'adm-card-' + area.key;
    body.append(heading, el('p', null, area.text));
    var link = el('a', 'adm-btn adm-btn--primary adm-card-action', area.action);
    link.href = area.href;
    link.setAttribute('aria-describedby', heading.id);
    item.append(badge, body, link);
    return item;
  }

  function renderHub(user, roles) {
    var s = shell();
    s.mount({ page: 'overview', isOwner: roles.owner });

    var main = byId('admin-main');
    var title = el('h1', 'adm-page-title', 'Admin overview');
    title.id = 'admin-title';
    title.tabIndex = -1;

    var lede = el('p', 'adm-lede');
    lede.append(document.createTextNode('Signed in as '), el('strong', null, user.email || 'your account'),
      document.createTextNode('. Choose an area to manage.'));
    var role = el('span', 'adm-chip', roles.owner ? 'Role: Owner' : 'Role: Administrator');
    role.id = 'admin-role';
    var roleLine = el('p');
    roleLine.appendChild(role);

    var areas = el('section');
    areas.setAttribute('aria-labelledby', 'admin-areas-title');
    var areasTitle = el('h2', 'adm-section-title', 'Areas you can manage');
    areasTitle.id = 'admin-areas-title';
    var grid = el('ul', 'adm-grid');
    grid.id = 'admin-cards';
    grid.setAttribute('role', 'list');
    AREAS.forEach(function (area) {
      if (area.needs === 'owner' ? roles.owner : roles.administrator) grid.appendChild(card(area));
    });
    areas.append(areasTitle, grid);

    var notes = el('section', 'adm-panel');
    notes.setAttribute('aria-labelledby', 'admin-notes-title');
    var notesTitle = el('h2', 'adm-section-title', 'How changes work');
    notesTitle.id = 'admin-notes-title';
    var list = el('ul');
    [
      'Every save is checked by the server against your role, whatever this page shows.',
      'Lists load only when you ask. Nothing refreshes in the background.',
      'Revocation blocks the next protected request. Material already loaded cannot be recalled.'
    ].forEach(function (line) { list.appendChild(el('li', null, line)); });
    notes.append(notesTitle, list);

    main.replaceChildren(title, lede, roleLine, areas, notes);
    if (!document.activeElement || document.activeElement === document.body) {
      try { title.focus({ preventScroll: true }); } catch (error) { title.focus(); }
    }
  }

  function sessionChanged(user) {
    abortActive();
    var check = ++epoch;
    showChecking();
    if (!user) { deny(true); return; }
    var client = auth.getClient();
    var s = shell();
    if (!client || !s) { deny(false); return; }
    Promise.all([checkAdministrator(client), s.checkOwner(client)]).then(function (results) {
      if (check !== epoch) return;
      var current = auth.getUser();
      if (!current || current.id !== user.id) return;
      var roles = { administrator: results[0] === true, owner: results[1] === true };
      if (!roles.administrator && !roles.owner) { deny(false); return; }
      renderHub(user, roles);
    }).catch(function () { if (check === epoch) deny(false); });
  }

  function initialize() {
    auth = window.UpskillAuth;
    if (!auth || !auth.isConfigured()) { deny(false); return; }
    auth.onChange(sessionChanged);
    window.addEventListener('pageshow', function (event) { if (event.persisted) sessionChanged(auth.getUser()); });
  }

  if (window.UpskillAuth) initialize();
  else document.addEventListener('upskill-auth-ready', initialize, { once: true });
}());

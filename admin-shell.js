/* UpSkill Sprint admin shell (admin-shell.js)
   Shared helpers for the four admin pages. Exposes window.UpskillAdminShell:
     mount({ page, isOwner })              render the admin header and tabs
     unmount()                             remove the header (extra, optional)
     renderDenied(container, { signedOut, next })
     checkOwner(client)                    Promise<boolean>, never rejects
     toast(message, { tone })              'success' (auto-dismiss) | 'error' (stays)
   Nothing here grants access. Every page runs its own server check first and
   only calls mount() after it passes; the RPCs enforce permissions regardless.
   Vanilla JS: DOM nodes only, no storage, no polling. Canadian English. */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var TOAST_MS = 5000;
  var CHECK_TIMEOUT_MS = 12000;
  var MAX_TOASTS = 4;
  var TABS = [
    { key: 'overview', label: 'Overview', href: '/admin' },
    { key: 'accounts', label: 'Accounts', href: '/admin-access', ownerOnly: true },
    { key: 'exams', label: 'Exams', href: '/admin-exam-access' },
    { key: 'tools', label: 'Tools', href: '/admin-tool-access' }
  ];
  var ICONS = {
    menu: 'M3 6h18M3 12h18M3 18h18',
    close: 'M6 6l12 12M18 6L6 18',
    success: 'M20 6L9 17l-5-5',
    error: 'M12 8v5M12 16.5v.5M10.3 3.9L2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'
  };

  var cleanup = [];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function icon(name) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', ICONS[name]);
    svg.appendChild(path);
    return svg;
  }

  function on(target, type, fn, options) {
    target.addEventListener(type, fn, options);
    cleanup.push(function () { target.removeEventListener(type, fn, options); });
  }

  function hostNode() { return document.getElementById('admin-shell-header'); }

  function unmount() {
    while (cleanup.length) {
      try { cleanup.pop()(); } catch (error) { /* keep tearing down */ }
    }
    var host = hostNode();
    if (host) host.replaceChildren();
  }

  /* ---------- Theme toggle (theme.js handles clicks by delegation) ---------- */
  function themeControl() {
    var group = el('div', 'theme-control');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Colour theme');
    var light = el('span', null, 'Light'); light.setAttribute('aria-hidden', 'true');
    var dark = el('span', null, 'Dark'); dark.setAttribute('aria-hidden', 'true');
    var button = el('button', 'theme-toggle');
    button.type = 'button';
    button.setAttribute('data-theme-toggle', 'true');
    button.setAttribute('role', 'switch');
    button.appendChild(el('span', 'sr-only', 'Toggle light and dark mode'));
    function sync() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      button.setAttribute('aria-checked', isDark ? 'true' : 'false');
      button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    sync();
    if (typeof window.MutationObserver === 'function') {
      var observer = new window.MutationObserver(sync);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      cleanup.push(function () { observer.disconnect(); });
    }
    group.append(light, button, dark);
    return group;
  }

  /* ---------- mount ---------- */
  function mount(options) {
    options = options || {};
    var page = String(options.page || '');
    var isOwner = options.isOwner === true;
    var host = hostNode();
    if (!host) return null;
    unmount();

    var header = el('header', 'adm-header');
    header.setAttribute('data-menu-open', 'false');
    var inner = el('div', 'adm-header-inner');

    var brand = el('div', 'adm-brand');
    var site = el('a', 'adm-brand-site', 'UpSkill Sprint');
    site.href = '/';
    var section = el('a', 'adm-brand-section', 'Admin');
    section.href = '/admin';
    section.setAttribute('aria-label', 'Admin overview');
    brand.append(site, section);

    var menuButton = el('button', 'adm-menu-btn');
    menuButton.type = 'button';
    menuButton.id = 'adm-menu-btn';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'adm-tabs');
    menuButton.append(icon('menu'), el('span', 'adm-menu-label', 'Menu'));

    var nav = el('nav', 'adm-tabs');
    nav.id = 'adm-tabs';
    nav.setAttribute('aria-label', 'Admin sections');
    var list = el('ul');
    TABS.forEach(function (tab) {
      if (tab.ownerOnly && !isOwner) return;
      var li = el('li');
      var link = el('a', null, tab.label);
      link.href = tab.href;
      link.setAttribute('data-admin-tab', tab.key);
      if (tab.key === page) link.setAttribute('aria-current', 'page');
      li.appendChild(link);
      list.appendChild(li);
    });
    nav.appendChild(list);

    var tools = el('div', 'adm-header-tools');
    tools.appendChild(themeControl());

    inner.append(brand, tools, menuButton, nav);
    header.appendChild(inner);

    function setOpen(open, returnFocus) {
      header.setAttribute('data-menu-open', open ? 'true' : 'false');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open && returnFocus) menuButton.focus();
    }
    on(menuButton, 'click', function () {
      var open = header.getAttribute('data-menu-open') !== 'true';
      setOpen(open, false);
      if (open) {
        var first = nav.querySelector('a[aria-current="page"]') || nav.querySelector('a');
        if (first) first.focus();
      }
    });
    on(document, 'keydown', function (event) {
      if (event.key === 'Escape' && header.getAttribute('data-menu-open') === 'true') setOpen(false, true);
    });
    on(document, 'click', function (event) {
      if (header.getAttribute('data-menu-open') === 'true' && !header.contains(event.target)) setOpen(false, false);
    });
    if (typeof window.matchMedia === 'function') {
      var wide = window.matchMedia('(min-width: 800px)');
      var onWide = function (event) { if (event.matches) setOpen(false, false); };
      if (wide.addEventListener) on(wide, 'change', onWide);
    }

    host.replaceChildren(header);
    return header;
  }

  /* ---------- renderDenied ---------- */
  function safeNext(next) {
    var value = typeof next === 'string' && next ? next : (window.location.pathname + window.location.search);
    // Same-origin paths only: "/x" yes; "//host", "/\host", "https://…" no.
    if (typeof value !== 'string' || value.charAt(0) !== '/' || value.charAt(1) === '/' || value.indexOf('\\') !== -1) return '/';
    return value;
  }

  function renderDenied(container, options) {
    options = options || {};
    unmount();
    if (!container) return null;
    var box = el('section', 'adm-denied');
    var heading = el('h1');
    heading.id = 'adm-denied-title';
    heading.tabIndex = -1;
    box.setAttribute('aria-labelledby', heading.id);
    var text = el('p');
    var link = el('a', 'adm-btn adm-btn--primary');
    if (options.signedOut) {
      heading.textContent = 'Sign in to continue';
      text.textContent = 'This page needs a signed-in account.';
      link.textContent = 'Sign in';
      link.href = '/sign-in.html?next=' + encodeURIComponent(safeNext(options.next));
      link.setAttribute('data-admin-signin', '');
    } else {
      heading.textContent = 'This area isn’t available';
      text.textContent = 'If you expected to see something here, check that you’re signed in with the right account.';
      link.textContent = 'Go to the home page';
      link.href = '/';
    }
    box.append(heading, text, link);
    container.replaceChildren(box);
    return box;
  }

  /* ---------- checkOwner ---------- */
  function checkOwner(client) {
    var controller = typeof window.AbortController === 'function' ? new window.AbortController() : null;
    var timer;
    return Promise.resolve().then(function () {
      if (!client || typeof client.rpc !== 'function') return false;
      var query = client.rpc('owner_manage_access', { operation: 'status' });
      if (controller && query && typeof query.abortSignal === 'function') query = query.abortSignal(controller.signal);
      var timeout = new Promise(function (resolve) {
        timer = setTimeout(function () { if (controller) controller.abort(); resolve(null); }, CHECK_TIMEOUT_MS);
      });
      return Promise.race([query, timeout]).then(function (result) {
        // Same allowed test as admin-access.js: no error and data.owner === true.
        return Boolean(result && !result.error && result.data && result.data.owner === true);
      });
    }).catch(function () { return false; }).then(function (allowed) {
      clearTimeout(timer);
      return allowed;
    });
  }

  /* ---------- toast ---------- */
  function region() {
    var node = document.querySelector('.adm-toast-region');
    if (!node) {
      node = el('div', 'adm-toast-region');
      node.setAttribute('aria-live', 'polite');
      node.setAttribute('aria-atomic', 'false');
      document.body.appendChild(node);
    }
    return node;
  }

  function toast(message, options) {
    var text = message == null ? '' : String(message).trim();
    if (!text || !document.body) return null;
    var tone = options && options.tone === 'error' ? 'error' : 'success';
    var host = region();
    var item = el('div', 'adm-toast adm-toast--' + tone);
    item.setAttribute('data-tone', tone);
    var glyph = icon(tone);
    glyph.setAttribute('class', 'adm-toast-icon');
    var body = el('p', 'adm-toast-message');
    body.append(el('span', 'sr-only', tone === 'error' ? 'Error: ' : 'Done: '), document.createTextNode(text));
    var close = el('button', 'adm-toast-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss notification');
    close.appendChild(icon('close'));
    item.append(glyph, body, close);

    var timer = null;
    var done = false;
    function dismiss() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      var hadFocus = item.contains(document.activeElement);
      if (item.parentNode) item.parentNode.removeChild(item);
      if (hadFocus) {
        var main = document.getElementById('admin-main');
        if (main) { if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1'); main.focus(); }
      }
    }
    function arm() {
      clearTimeout(timer);
      if (tone === 'success' && !done) timer = setTimeout(dismiss, TOAST_MS);
    }
    close.addEventListener('click', dismiss);
    if (tone === 'success') {
      // Pause while the pointer or keyboard focus is on the toast.
      item.addEventListener('mouseenter', function () { clearTimeout(timer); });
      item.addEventListener('mouseleave', arm);
      item.addEventListener('focusin', function () { clearTimeout(timer); });
      item.addEventListener('focusout', arm);
    }

    var existing = host.querySelectorAll('.adm-toast');
    if (existing.length >= MAX_TOASTS) {
      var oldest = host.querySelector('.adm-toast[data-tone="success"]') || existing[0];
      oldest.parentNode.removeChild(oldest);
    }
    host.appendChild(item);
    arm();
    return { element: item, dismiss: dismiss };
  }

  window.UpskillAdminShell = Object.freeze({
    mount: mount,
    unmount: unmount,
    renderDenied: renderDenied,
    checkOwner: checkOwner,
    toast: toast
  });
}());

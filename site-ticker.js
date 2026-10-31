/*!
 * UpSkillSprint -- Site updates ticker (floating "Live" pill at the bottom of every page)
 * Drop-in, zero dependencies.
 *
 * EDIT THE HEADLINES in /site-updates.json -- no code change needed. Newest first.
 * Outside links (https://...) open in a new tab -- use them for "Research" items that
 * point straight at the paper or source. Only the newest batch of Research items
 * shows: publishing next Friday's picks retires the previous week's on every page. Optional "expires": "YYYY-MM-DD" retires an
 * item early (it shows through that day).
 *
 * INSTALL: nothing to do per page. scripts/inject-site-ticker.mjs adds
 *   <script src="/site-ticker.js" defer></script>
 * to every public page while the site is staged (npm run build:site).
 *
 * BEHAVIOUR
 *   - Headlines glide right-to-left at a steady reading speed; hovering, focusing
 *     or pressing Pause stops them (WCAG 2.2.2 Pause, Stop, Hide).
 *   - Close (x) turns the bar off; it shrinks to a small amber on/off icon in the
 *     bottom-right corner that turns it back on. The choice is remembered on every
 *     page until a newer headline is published.
 *   - prefers-reduced-motion: nothing moves; the headlines become a row the
 *     visitor can swipe or scroll through themselves.
 *   - Lifts the seasonal-effects badge above itself and pads the footer, so
 *     nothing on the page ends up hidden underneath it.
 *   - Automated browsers (navigator.webdriver) don't get the bar, so page tests
 *     that click near the bottom of the screen are not blocked by it.
 *
 * PREVIEW ANY TIME:  ?ticker=on (ignores "closed" and automation)   ?ticker=off
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.document && root.location) api.boot(root);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ===== CONFIG -- edit here =====================================================
  var DATA_URL = '/site-updates.json';
  var MAX_ITEMS = 8;          // newest N headlines are shown
  var MAX_AGE_DAYS = 90;      // older headlines drop off on their own
  var SPEED = 42;             // scroll speed, pixels per second (constant for any list length)
  var TAGS = ['lesson', 'exam', 'tool', 'research', 'update', 'soon'];  // anything else is styled as "update"
  // Pages that never get the bar (prefix match). Exams and sign-in stay distraction-free.
  // The build-time injector reads this same list, so edit it here only.
  var EXCLUDE_PATHS = ['/test-bank', '/exam-preview', '/sign-in', '/signup', '/reset-password', '/admin-'];
  // Layer: above page content, below the sticky header and mobile menu (40, site-nav.css)
  // and below the seasonal effects (30) so their flyovers pass in front of it.
  var Z = 29;
  var STORE_KEY = 'uss-ticker-closed'; // holds the id of the newest headline when closed
  // ==============================================================================

  var window, document;

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }

  function excluded(path) {
    var p = String(path || '/').toLowerCase();
    return EXCLUDE_PATHS.some(function (x) { return p === x || p.indexOf(x) === 0; });
  }

  // Only same-site paths or https links -- never javascript: or data: URLs from the JSON.
  function safeHref(href) {
    var h = String(href || '').trim();
    if (/^\/(?!\/)/.test(h)) return h;
    if (/^https:\/\/[^\s]+$/i.test(h)) return h;
    return null;
  }

  function parseDay(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  /** Valid, recent headlines, newest first, at most MAX_ITEMS.
   *  Research picks are weekly: only the newest batch shows, so last week's
   *  links disappear everywhere the moment this week's are published. */
  function selectUpdates(list, now) {
    now = now || new Date();
    var oldest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - MAX_AGE_DAYS);
    var seen = {};
    var latestResearch = 0;
    return (Array.isArray(list) ? list : [])
      .map(function (u, i) {
        if (!u || typeof u !== 'object') return null;
        var day = parseDay(u.date), text = String(u.text || '').trim(), href = safeHref(u.href);
        var id = String(u.id || '').trim();
        if (!day || !text || !href || !id || seen[id]) return null;
        if (day < oldest || day > now) return null; // future-dated items wait for their day
        var expires = u.expires == null || u.expires === '' ? null : parseDay(u.expires);
        if (u.expires && !expires) return null;          // malformed expiry: leave it out
        if (expires && now >= new Date(expires.getFullYear(), expires.getMonth(), expires.getDate() + 1)) return null;
        seen[id] = true;
        var tag = String(u.tag || 'Update').trim();
        var kind = TAGS.indexOf(tag.toLowerCase()) === -1 ? 'update' : tag.toLowerCase();
        return { id: id, day: day, order: i, tag: tag, kind: kind, text: text, href: href };
      })
      .filter(Boolean)
      .map(function (u) { if (u.kind === 'research' && +u.day > latestResearch) latestResearch = +u.day; return u; })
      .filter(function (u) { return u.kind !== 'research' || +u.day === latestResearch; })
      .sort(function (a, b) { return (b.day - a.day) || (a.order - b.order); })
      .slice(0, MAX_ITEMS);
  }

  /** 'bar' (show the ticker), 'mini' (visitor turned it off: show just the small
   *  on/off icon) or 'none'. `closedId` is the newest headline when they turned it
   *  off, so a newer headline turns the ticker back on once. */
  function mode(items, opts) {
    opts = opts || {};
    var q = /[?&]ticker=(on|off)\b/i.exec(opts.search || '');
    if (q) return q[1].toLowerCase() === 'on' && items.length > 0 ? 'bar' : 'none';
    if (!items.length || opts.webdriver || excluded(opts.path)) return 'none';
    return opts.closedId === items[0].id ? 'mini' : 'bar';
  }
  function shouldShow(items, opts) { return mode(items, opts) === 'bar'; }

  // ---------- styles ----------
  // "Trading terminal" look: charcoal pill with amber accents. The bar keeps the
  // same colours in the site's light and dark themes, so it reads as one branded
  // element on any page. Every text/background pair below meets WCAG AA (4.5:1);
  // tests/site-ticker.test.js checks the ratios.
  var CSS =
    ':root{--utk-bg:#141414;--utk-line:#2f2f2f;--utk-ink:#f2f2f2;--utk-muted:#a3a3a3;--utk-amber:#ffb020;' +
    '--utk-hover:rgba(255,255,255,.08);--utk-shadow:0 14px 34px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.22)}' +

    '.utk{position:fixed;z-index:' + Z + ';left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));' +
    'width:min(780px,calc(100% - 24px - env(safe-area-inset-left,0px) - env(safe-area-inset-right,0px)));' +
    'height:46px;box-sizing:border-box;display:flex;align-items:center;padding:0 5px 0 0;margin:0;' +
    'border-radius:999px;border:1px solid var(--utk-line);background:var(--utk-bg);color:var(--utk-ink);' +
    'box-shadow:var(--utk-shadow);font:500 13.5px/1.2 "Work Sans",Arial,sans-serif;' +
    'opacity:0;transform:translate(-50%,18px);transition:opacity .45s ease,transform .55s cubic-bezier(.2,.8,.2,1)}' +
    // Smoked glass: near-opaque charcoal with a blur, so text contrast never depends on the page behind it.
    '@supports ((-webkit-backdrop-filter:blur(1px)) or (backdrop-filter:blur(1px))){' +
    '.utk{background:rgba(20,20,20,.9);-webkit-backdrop-filter:saturate(1.4) blur(14px);backdrop-filter:saturate(1.4) blur(14px)}}' +
    '.utk.is-in{opacity:1;transform:translate(-50%,0)}' +
    '.utk.is-out{opacity:0;transform:translate(-50%,18px)}' +

    '.utk-live{flex:0 0 auto;display:flex;align-items:center;gap:8px;height:24px;padding:0 13px 0 17px;' +
    'border-right:1px solid var(--utk-line);color:var(--utk-amber);font-size:11.5px;font-weight:700;' +
    'letter-spacing:.1em;text-transform:uppercase}' +
    '.utk-dot{position:relative;width:8px;height:8px;border-radius:50%;background:var(--utk-amber)}' +
    '.utk-dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:var(--utk-amber);' +
    'animation:utk-ping 2s cubic-bezier(0,0,.2,1) infinite}' +
    '@keyframes utk-ping{70%,100%{transform:scale(2.6);opacity:0}}' +

    '.utk-view{flex:1 1 auto;min-width:0;height:100%;overflow:hidden;' +
    '-webkit-mask-image:linear-gradient(90deg,transparent,#000 30px,#000 calc(100% - 30px),transparent);' +
    'mask-image:linear-gradient(90deg,transparent,#000 30px,#000 calc(100% - 30px),transparent)}' +
    '.utk-track{display:flex;align-items:center;width:max-content;height:100%;margin:0;padding:0;list-style:none;' +
    'animation:utk-scroll var(--utk-dur,40s) linear infinite;will-change:transform}' +
    '.utk-track li{margin:0;padding:0 3px}' +
    '.utk:hover .utk-track,.utk:focus-within .utk-track,.utk.is-paused .utk-track{animation-play-state:paused}' +
    '@keyframes utk-scroll{to{transform:translateX(-50%)}}' +

    '.utk-item{display:inline-flex;align-items:center;gap:9px;padding:6px 10px 6px 7px;border-radius:999px;' +
    'color:var(--utk-ink)!important;text-decoration:none!important;white-space:nowrap;transition:background .2s ease}' +
    '.utk-item:hover,.utk-item:focus-visible{background:var(--utk-hover)}' +
    '.utk-item:focus-visible,.utk-btn:focus-visible{outline:2px solid var(--utk-amber);outline-offset:-2px}' +
    // Tag colours: amber = research, green = lessons, solid amber = exams, greys = everything else.
    '.utk-tag{font-size:11.5px;font-weight:600;letter-spacing:.02em;padding:3px 10px;border-radius:999px;' +
    'border:1px solid transparent;background:#262626;color:#d6d6d6}' +
    '.utk-tag[data-kind="research"]{background:#3a2a05;color:#ffb020}' +
    '.utk-tag[data-kind="lesson"]{background:#0f3320;color:#3ddc84}' +
    '.utk-tag[data-kind="exam"]{background:#ffb020;color:#141414}' +
    '.utk-tag[data-kind="soon"]{background:transparent;border:1px dashed #5c5c5c;color:#bdbdbd}' +
    '.utk-arrow{width:12px;height:12px;flex:0 0 auto;opacity:0;transform:translate(-5px,3px);' +
    'transition:opacity .2s ease,transform .25s ease}' +
    '.utk-item:hover .utk-arrow,.utk-item:focus-visible .utk-arrow{opacity:.85;transform:none}' +

    '.utk-btn{all:unset;flex:0 0 auto;box-sizing:border-box;width:36px;height:36px;border-radius:50%;' +
    'display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--utk-muted);' +
    'transition:background .2s ease,color .2s ease}' +
    '.utk-btn:hover{background:var(--utk-hover);color:var(--utk-ink)}' +
    '.utk-btn svg{width:14px;height:14px;display:block}' +
    '.utk-sr{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}' +

    // Phones: tighter edges, "Live" keeps just its dot.
    '@media (max-width:560px){.utk{height:44px;bottom:calc(8px + env(safe-area-inset-bottom,0px));' +
    'width:calc(100% - 16px - env(safe-area-inset-left,0px) - env(safe-area-inset-right,0px));font-size:13px}' +
    '.utk-live{padding:0 11px 0 15px}.utk-live-text{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '.utk-btn{width:34px;height:34px}}' +

    // Reduced motion: nothing moves; headlines become a swipeable row.
    '@media (prefers-reduced-motion:reduce){.utk,.utk-arrow,.utk-item{transition:none}' +
    '.utk-dot::after{animation:none}.utk-track{animation:none}.utk-pause{display:none}' +
    '.utk-view{overflow-x:auto;scrollbar-width:none;scroll-snap-type:x proximity}' +
    '.utk-view::-webkit-scrollbar{display:none}.utk-track li{scroll-snap-align:start}}' +

    // The small on/off icon (bottom-right) that brings the ticker back after it's turned off.
    '.utk-toggle{all:unset;position:fixed;z-index:' + Z + ';box-sizing:border-box;width:44px;height:44px;border-radius:50%;' +
    'right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));' +
    'display:inline-flex;align-items:center;justify-content:center;cursor:pointer;background:var(--utk-bg);' +
    'border:1px solid var(--utk-line);color:var(--utk-amber);box-shadow:var(--utk-shadow);' +
    'transition:transform .25s ease,opacity .3s ease}' +
    '.utk-toggle:hover{transform:scale(1.06)}' +
    '.utk-toggle:focus-visible{outline:2px solid var(--utk-amber);outline-offset:3px}' +
    '.utk-toggle[hidden]{display:none}' +
    '.utk-toggle svg{width:22px;height:22px;display:block}' +
    '.utk[hidden]{display:none}' +
    '@media (max-width:560px){.utk-toggle{right:calc(8px + env(safe-area-inset-right,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px))}}' +
    '@media (prefers-reduced-motion:reduce){.utk-toggle{transition:none}.utk-toggle:hover{transform:none}}' +

    // Keep the page's end clear of the bar (or of the small icon when the bar is off).
    'html.utk-on footer.site{padding-bottom:calc(32px + var(--uss-ticker-offset,0px))}' +
    'html.utk-on body.utk-nofooter{padding-bottom:var(--uss-ticker-offset,0px)}' +
    'html.utk-mini footer.site{padding-bottom:96px}' +
    'html.utk-mini body.utk-nofooter{padding-bottom:64px}' +
    '@media print{.utk,.utk-toggle{display:none!important}}';

  var ICON = {
    pause: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><rect x="3" y="2" width="2.6" height="10" rx="1" fill="currentColor"/><rect x="8.4" y="2" width="2.6" height="10" rx="1" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    // "Broadcast" mark for the on/off icon: an amber dot with signal waves.
    live: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="2.6" fill="currentColor"/>' +
      '<path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    arrow: '<svg class="utk-arrow" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 9l6-6M4.5 3H9v4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function itemNode(u, isCopy) {
    var li = el('li');
    var a = el('a', 'utk-item');
    a.href = u.href;
    var external = /^https:/i.test(u.href);
    if (external) { a.target = '_blank'; a.rel = 'noopener'; }
    var tag = el('span', 'utk-tag', u.tag);
    tag.setAttribute('data-kind', u.kind);
    a.appendChild(tag);
    a.appendChild(el('span', 'utk-text', u.text));
    if (external) a.appendChild(el('span', 'utk-sr', ' (source, opens in a new tab)'));
    a.insertAdjacentHTML('beforeend', ICON.arrow);
    if (isCopy) a.tabIndex = -1;
    li.appendChild(a);
    if (isCopy) li.setAttribute('aria-hidden', 'true');
    return li;
  }

  function build(items, reduce) {
    var bar = el('aside', 'utk');
    bar.setAttribute('aria-label', 'Site updates');
    bar.setAttribute('data-ticker', '');

    var live = el('span', 'utk-live');
    live.appendChild(el('span', 'utk-dot'));
    live.appendChild(el('span', 'utk-live-text', 'Live'));
    live.firstChild.setAttribute('aria-hidden', 'true');
    bar.appendChild(live);

    var view = el('div', 'utk-view');
    var track = el('ul', 'utk-track');
    items.forEach(function (u) { track.appendChild(itemNode(u, false)); });
    // A second, identical copy makes the loop seamless. Screen readers and the
    // keyboard only see the first copy.
    if (!reduce) items.forEach(function (u) { track.appendChild(itemNode(u, true)); });
    view.appendChild(track);
    bar.appendChild(view);

    var pause = el('button', 'utk-btn utk-pause');
    pause.type = 'button';
    pause.setAttribute('aria-pressed', 'false');
    pause.setAttribute('aria-label', 'Pause updates');
    pause.title = 'Pause updates';
    pause.innerHTML = ICON.pause;
    bar.appendChild(pause);

    var close = el('button', 'utk-btn utk-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Hide updates');
    close.title = 'Hide updates';
    close.innerHTML = ICON.close;
    bar.appendChild(close);

    return { bar: bar, track: track, pause: pause, close: close };
  }

  function mount(items, startOff) {
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var css = el('style');
    css.setAttribute('data-ticker-style', '');
    css.textContent = CSS;
    document.head.appendChild(css);

    var ui = build(items, reduce);
    var html = document.documentElement;
    var noFooter = !document.querySelector('footer.site');
    ui.bar.id = 'utk-bar';
    document.body.appendChild(ui.bar);

    // Small icon that turns the ticker back on. Only visible while the ticker is off.
    var toggle = el('button', 'utk-toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Show site updates');
    toggle.setAttribute('aria-controls', 'utk-bar');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.title = 'Show site updates';
    toggle.innerHTML = ICON.live;
    toggle.hidden = true;
    document.body.appendChild(toggle);
    ui.toggle = toggle;

    // Steady reading speed whatever the number or length of headlines.
    function pace() {
      var half = ui.track.scrollWidth / 2;
      if (half > 0) ui.track.style.setProperty('--utk-dur', Math.max(12, half / SPEED).toFixed(1) + 's');
    }
    // Space the seasonal badge and the footer need to stay clear of the bar.
    function offset() {
      if (ui.bar.hidden) return;
      var r = ui.bar.getBoundingClientRect();
      var gap = Math.max(0, window.innerHeight - r.top) + 8;
      html.style.setProperty('--uss-ticker-offset', Math.round(gap) + 'px');
    }
    var raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) { return setTimeout(f, 16); };
    var hideTimer = null;

    function turnOn(focus) {
      clearTimeout(hideTimer);
      store(function (ls) { ls.removeItem(STORE_KEY); });
      toggle.hidden = true;
      toggle.setAttribute('aria-expanded', 'true');
      ui.bar.hidden = false;
      ui.bar.classList.remove('is-out');
      html.classList.remove('utk-mini');
      html.classList.add('utk-on');
      if (noFooter) document.body.classList.add('utk-nofooter');
      pace(); offset();
      raf(function () { raf(function () { ui.bar.classList.add('is-in'); offset(); }); }); // two frames so the slide-in animates
      if (focus) ui.close.focus();
    }

    function turnOff(focus) {
      store(function (ls) { ls.setItem(STORE_KEY, items[0].id); });
      ui.bar.classList.remove('is-in');
      ui.bar.classList.add('is-out');
      html.classList.remove('utk-on');
      html.classList.add('utk-mini');
      html.style.removeProperty('--uss-ticker-offset');
      if (noFooter) document.body.classList.add('utk-nofooter');
      toggle.hidden = false;
      toggle.setAttribute('aria-expanded', 'false');
      if (focus) toggle.focus();
      // Fully hidden (not focusable, not animating) once the slide-out has played.
      var done = function () { if (ui.bar.classList.contains('is-out')) ui.bar.hidden = true; };
      if (reduce) done(); else hideTimer = setTimeout(done, 500);
    }

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pace, function () {});
    window.addEventListener('resize', function () { pace(); offset(); });

    ui.pause.addEventListener('click', function () {
      var paused = ui.bar.classList.toggle('is-paused');
      ui.pause.setAttribute('aria-pressed', paused ? 'true' : 'false');
      ui.pause.setAttribute('aria-label', paused ? 'Play updates' : 'Pause updates');
      ui.pause.title = paused ? 'Play updates' : 'Pause updates';
      ui.pause.innerHTML = paused ? ICON.play : ICON.pause;
    });
    ui.close.addEventListener('click', function () { turnOff(true); });
    toggle.addEventListener('click', function () { turnOn(true); });

    if (startOff) {
      ui.bar.hidden = true;
      ui.bar.classList.add('is-out');
      html.classList.add('utk-mini');
      if (noFooter) document.body.classList.add('utk-nofooter');
      toggle.hidden = false;
    } else {
      turnOn(false);
    }
    ui.turnOn = turnOn; ui.turnOff = turnOff;
    return ui;
  }

  function load(cb) {
    if (typeof window.fetch !== 'function') return;
    window.fetch(DATA_URL, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { if (data) cb(data.updates); })
      .catch(function () {});
  }

  function boot(root) {
    window = root; document = root.document;
    var search = root.location.search || '';
    if (/[?&]ticker=off\b/i.test(search)) return;
    if (!/[?&]ticker=on\b/i.test(search) && (excluded(root.location.pathname) || (root.navigator && root.navigator.webdriver))) return;
    function go() {
      load(function (list) {
        if (document.querySelector('[data-ticker]')) return;
        var items = selectUpdates(list, new Date());
        var m = mode(items, {
          search: search,
          path: root.location.pathname,
          webdriver: !!(root.navigator && root.navigator.webdriver),
          closedId: store(function (ls) { return ls.getItem(STORE_KEY); })
        });
        if (m !== 'none') mount(items, m === 'mini');
      });
    }
    // Wait for the page to finish loading so the bar never competes with real content.
    if (document.readyState === 'complete') go();
    else root.addEventListener('load', go);
  }

  return {
    EXCLUDE_PATHS: EXCLUDE_PATHS, MAX_ITEMS: MAX_ITEMS, MAX_AGE_DAYS: MAX_AGE_DAYS, STORE_KEY: STORE_KEY,
    excluded: excluded, safeHref: safeHref, selectUpdates: selectUpdates, mode: mode, shouldShow: shouldShow,
    boot: boot, _show: function (root, items, startOff) { window = root; document = root.document; return mount(items, !!startOff); }
  };
});

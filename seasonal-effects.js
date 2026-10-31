/*!
 * UpSkillSprint -- Seasonal Effects (Canada Day + 4th of July + Canadian Thanksgiving + Halloween + Christmas)
 * Drop-in, zero dependencies. Turns on/off automatically every year by the visitor's local date.
 *
 * INSTALL: nothing to do per page. scripts/inject-seasonal-effects.mjs adds
 *   <script src="/seasonal-effects.js" defer></script>
 * to every public page while the site is staged (npm run build:site).
 *
 * PREVIEW ANY TIME (ignores dates and the visitor's "off" choice):
 *   ?season=canadaday   ?season=july4   ?season=thanksgiving   ?season=halloween
 *   ?season=christmas   ?season=off
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.document && root.location) api.boot(root);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var window, document, location;

  // ===== CONFIG -- edit here. Dates are [month, day]; both first and last day are included.
  // Runs automatically every year. An end month earlier than the start month means "next year".
  // Order matters: the first season whose dates match wins, so Thanksgiving
  // weekend takes over from Halloween for those four days, then Halloween resumes.
  var SEASONS = [
    // Summer: Canada Day (July 1) then US Independence Day (July 4). The windows
    // touch but never overlap, so each country gets its own days.
    { id: 'canadaday', label: 'Happy Canada Day', icon: '\ud83c\udf41', start: [6, 28], end: [7, 2] }, // Jun 28 -> Jul 2
    { id: 'july4', label: 'Happy 4th of July', icon: '\ud83c\udf86', start: [7, 3], end: [7, 5] },     // Jul 3 -> Jul 5
    // Canadian Thanksgiving is the 2nd Monday of October, so its dates move every
    // year. `range` works them out: Friday through Thanksgiving Monday.
    { id: 'thanksgiving', label: 'Happy Thanksgiving', icon: '\ud83c\udf41', range: thanksgivingWeekend },
    { id: 'halloween', label: 'Happy Halloween', icon: '\ud83c\udf83', start: [10, 1], end: [11, 4] }, // Oct 1 -> Nov 4
    { id: 'christmas', label: 'Merry Christmas', icon: '\ud83c\udf84', start: [12, 1], end: [1, 4] }   // Dec 1 -> Jan 4
  ];
  // Pages that never get effects (prefix match). Exams stay distraction-free.
  // The build-time injector reads this same list, so edit it here only.
  var EXCLUDE_PATHS = ['/test-bank', '/exam-preview'];
  // Layer: above page content and the sticky header (20), below the mobile
  // menu drawer (40, site-nav.css) so an open menu always covers the effects.
  var Z = 30; // badge sits at Z+1
  // Flyover (banner plane / geese / wizard on a broom / Santa's sleigh): first pass N seconds after load,
  // then one pass every [min, max] seconds. Set FLYER_ON = false to disable.
  var FLYER_ON = true;
  var FLYER_FIRST = 3;
  var FLYER_EVERY = [18, 30];
  // =============================================================================

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }

  // [first day, midnight after the last day] for a season that starts in `year`.
  function rangeOf(s, year) {
    if (s.range) return s.range(year);
    var endYear = s.end[0] < s.start[0] ? year + 1 : year;
    return [new Date(year, s.start[0] - 1, s.start[1]), new Date(endYear, s.end[0] - 1, s.end[1] + 1)];
  }

  // Friday -> Monday of Canadian Thanksgiving weekend (2nd Monday of October).
  function thanksgivingWeekend(year) {
    var firstDay = new Date(year, 9, 1).getDay();             // 0 = Sunday
    var monday = 1 + ((8 - firstDay) % 7) + 7;                 // 2nd Monday's date
    return [new Date(year, 9, monday - 3), new Date(year, 9, monday + 1)];
  }

  // Which season (if any) is on for this date and URL query string.
  function pick(now, search) {
    var q = null;
    try { q = new URLSearchParams(search || '').get('season'); } catch (e) {}
    if (q === 'off') return null;
    // A URL override always wins, whatever today's date is.
    for (var j = 0; j < SEASONS.length; j++) {
      if (q === SEASONS[j].id) return { s: SEASONS[j], year: now.getFullYear(), forced: true };
    }
    for (var i = 0; i < SEASONS.length; i++) {
      var s = SEASONS[i];
      // Check last year's window too, so Christmas still runs on Jan 1-4.
      for (var y = now.getFullYear() - 1; y <= now.getFullYear(); y++) {
        var r = rangeOf(s, y);
        if (now >= r[0] && now < r[1]) return { s: s, year: y, forced: false };
      }
    }
    return null;
  }

  function excluded(p) {
    p = '/' + String(p || '').replace(/^\/+/, '');
    for (var i = 0; i < EXCLUDE_PATHS.length; i++) if (p.indexOf(EXCLUDE_PATHS[i]) === 0) return true;
    return false;
  }

  function boot(root) {
    if (root.__ussSeasonal) return;
    root.__ussSeasonal = true;
    window = root; document = root.document; location = root.location;
    // A parsed body is enough (the tag is deferred). JSDOM never fires
    // DOMContentLoaded, same as site-nav.js notes.
    if (document.body) init();
    else document.addEventListener('DOMContentLoaded', init);
  }

  function init() {
    if (excluded(location.pathname)) return;
    var hit = pick(new Date(), location.search);
    if (!hit) return;
    var key = 'uss-fx-off:' + hit.s.id + ':' + hit.year; // "off" resets next year
    if (!hit.forced && store(function (ls) { return ls.getItem(key); }) === '1') return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stop = reduce ? function () {} : startCanvas(hit.s.id);
    addBadge(hit.s, function () {
      stop();
      store(function (ls) { ls.setItem(key, '1'); });
    });
  }

  // ---------- small greeting pill with an off switch ----------
  function addBadge(s, onOff) {
    var css = document.createElement('style');
    css.textContent =
      '.uss-fx-badge{position:fixed;left:calc(12px + env(safe-area-inset-left,0px));' +
      // --uss-ticker-offset is set by site-ticker.js while the updates bar is showing,
      // so the badge sits just above the bar instead of underneath it.
      'bottom:calc(12px + var(--uss-ticker-offset,0px) + env(safe-area-inset-bottom,0px));transition:bottom .45s ease;' +
      'z-index:' + (Z + 1) + ';display:flex;align-items:center;gap:6px;' +
      'padding:2px 2px 2px 10px;border-radius:999px;background:rgba(13,27,48,.9);color:#e6f1f8;' +
      'border:1px solid rgba(63,182,216,.45);font:600 13px/1 system-ui,-apple-system,Segoe UI,sans-serif;' +
      'box-shadow:0 4px 14px rgba(0,0,0,.35)}' +
      '.uss-fx-badge .t{max-width:170px;overflow:hidden;white-space:nowrap;transition:max-width .5s ease}' +
      '.uss-fx-badge.mini .t{max-width:0}' +
      // 32px close target: comfortably above the WCAG 2.2 AA 24px minimum for touch
      '.uss-fx-badge button{all:unset;cursor:pointer;box-sizing:border-box;min-width:32px;min-height:32px;' +
      'display:inline-flex;align-items:center;justify-content:center;border-radius:999px;opacity:.75}' +
      '.uss-fx-badge button:hover,.uss-fx-badge button:focus-visible{opacity:1;background:rgba(255,255,255,.14)}' +
      '@media print{.uss-fx-badge,.uss-fx-canvas{display:none!important}}';
    document.head.appendChild(css);

    var b = document.createElement('div');
    b.className = 'uss-fx-badge';
    b.innerHTML = '<span aria-hidden="true">' + s.icon + '</span><span class="t">' + s.label + '</span>' +
      '<button type="button" aria-label="Turn off seasonal effects" title="Turn off seasonal effects">\u2715</button>';
    b.querySelector('button').addEventListener('click', function () { b.remove(); onOff(); });
    document.body.appendChild(b);
    setTimeout(function () { b.classList.add('mini'); }, 8000); // shrink to just the icon
  }

  // ---------- particle overlay (click-through, never blocks the page) ----------
  function startCanvas(id) {
    var c = document.createElement('canvas');
    c.className = 'uss-fx-canvas';
    c.setAttribute('aria-hidden', 'true');
    // inset:0 tracks the visible viewport as a phone's address bar shows and hides
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:' + Z;
    var ctx = c.getContext && c.getContext('2d');
    if (!ctx) return function () {}; // no canvas support: greeting only
    document.body.appendChild(c);
    var W = 0, H = 0, parts = [], raf = 0, last = 0, alive = true;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth || window.innerWidth; H = c.clientHeight || window.innerHeight;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var R = Math.random;
    var HALLOWEEN = ['\ud83c\udf83', '\ud83d\udc7b', '\ud83c\udf42', '\ud83c\udf41', '\ud83c\udf83', '\ud83d\udc7b'];

    var LEAF_COLOURS = ['#c0392b', '#d35400', '#e67e22', '#b5651d', '#a93226', '#d4a017', '#8e3b1f'];
    var FIREWORKS = id === 'canadaday' || id === 'july4';
    // Flag colours. White pieces get a thin outline so they still show on light pages.
    var CANADA = ['#d52b1e', '#d52b1e', '#ffffff'];
    var USA = ['#b22234', '#ffffff', '#2f55b8']; // a brighter blue than the flag's navy, so it reads on dark pages

    function make(anywhere) {
      if (id === 'canadaday') {
        // Red and white maple leaves, same tumble as Thanksgiving
        return {
          leaf: true, size: 7 + R() * 8, col: CANADA[(R() * CANADA.length) | 0],
          x: R() * W, y: anywhere ? R() * H : -30,
          vx: 0, vy: 22 + R() * 24, amp: 16 + R() * 26, ph: R() * 6.28, fs: 0.5 + R() * 0.9,
          rot: R() * 6.28, vr: (R() - 0.5) * 2.2, flip: R() * 6.28, vf: 1 + R() * 2,
          a: 0.8 + R() * 0.2, bob: 0
        };
      }
      if (id === 'july4') {
        // Red, white and blue star confetti that spins and flips as it falls
        return {
          confetti: true, size: 4 + R() * 5, col: USA[(R() * USA.length) | 0],
          x: R() * W, y: anywhere ? R() * H : -20,
          vx: 0, vy: 28 + R() * 30, amp: 14 + R() * 22, ph: R() * 6.28, fs: 0.6 + R() * 1,
          rot: R() * 6.28, vr: (R() - 0.5) * 3, flip: R() * 6.28, vf: 2 + R() * 3,
          a: 0.85, bob: 0
        };
      }
      if (id === 'thanksgiving') {
        // Vector maple leaves that tumble (flip) as they fall
        return {
          leaf: true, size: 8 + R() * 9, col: LEAF_COLOURS[(R() * LEAF_COLOURS.length) | 0],
          x: R() * W, y: anywhere ? R() * H : -30,
          vx: 0, vy: 22 + R() * 26, amp: 18 + R() * 30, ph: R() * 6.28, fs: 0.5 + R() * 0.9,
          rot: R() * 6.28, vr: (R() - 0.5) * 2.2, flip: R() * 6.28, vf: 1 + R() * 2,
          a: 0.75 + R() * 0.25, bob: 0
        };
      }
      if (id === 'christmas') {
        var flake = R() < 0.08;
        var r = 1 + R() * 2.8;
        return {
          glyph: flake ? '\u2744' : null, size: 14 + R() * 10, r: r,
          x: R() * W, y: anywhere ? R() * H : -20,
          vx: 0, vy: flake ? 25 + R() * 20 : 18 + r * 14 + R() * 12,
          amp: 10 + R() * 25, ph: R() * 6.28, fs: 0.6 + R() * 0.9,
          rot: 0, vr: flake ? (R() - 0.5) * 0.8 : 0, a: 0.55 + R() * 0.45, bob: 0
        };
      }
      // Halloween: ~1 in 3 are bats flying across; the rest drift down
      if (R() < 0.33) {
        var dir = R() < 0.5 ? 1 : -1;
        return {
          glyph: '\ud83e\udd87', size: 18 + R() * 14, bat: true,
          x: anywhere ? R() * W : (dir > 0 ? -40 : W + 40), y: 30 + R() * H * 0.6,
          vx: dir * (45 + R() * 50), vy: 0, amp: 0, ph: R() * 6.28, fs: 2 + R() * 2,
          rot: 0, vr: 0, a: 0.6 + R() * 0.3, bob: 30 + R() * 30
        };
      }
      return {
        glyph: HALLOWEEN[(R() * HALLOWEEN.length) | 0], size: 18 + R() * 14,
        x: R() * W, y: anywhere ? R() * H : -40,
        vx: 0, vy: 18 + R() * 22, amp: 15 + R() * 25, ph: R() * 6.28, fs: 0.5 + R() * 0.8,
        rot: R() * 6.28, vr: (R() - 0.5) * 1.2, a: 0.55 + R() * 0.35, bob: 0
      };
    }

    var small = W < 700;
    var n = id === 'christmas' ? (small ? 45 : 90) : id === 'thanksgiving' ? (small ? 16 : 30) :
      FIREWORKS ? (small ? 12 : 24) : (small ? 10 : 18);
    for (var i = 0; i < n; i++) parts.push(make(true));

    // Passes alternate: first from the right (flying left), then from the left.
    var flyer = null, nextAt = null, trail = [], lastDir = 1;
    var walker = null, walkAt = null, walkDir = 1; // Thanksgiving turkey
    var rockets = [], sparks = [], fwAt = null;      // Canada Day / 4th of July fireworks
    // Bottom of the site header, so the plane and fireworks never cover the menu.
    function headerBottom() {
      var hd = document.querySelector('header.site');
      var b = hd && hd.getBoundingClientRect ? hd.getBoundingClientRect().bottom : 0;
      return Math.max(0, Math.min(b || 0, H * 0.4));
    }
    function spawnFlyer() {
      var dir = lastDir = -lastDir;
      var mobile = W < 700;
      if (FIREWORKS) {
        // A small biplane towing a greeting banner. The banner text never mirrors.
        var text = id === 'canadaday' ? 'HAPPY CANADA DAY' : 'HAPPY 4TH OF JULY';
        var s = mobile ? 0.75 : 1;
        ctx.font = '800 15px system-ui,-apple-system,"Segoe UI",sans-serif';
        var bw = (ctx.measureText(text).width + 34) * s;
        return {
          kind: 'plane', dir: dir, s: s, age: 0, emit: 0, text: text, bw: bw,
          x: dir > 0 ? -60 * s : W + 60 * s,
          baseY: Math.max(headerBottom() + 44 * s, H * (0.1 + R() * 0.12)), wave: 8 + R() * 6, sway: 0.9,
          speed: 125 * (mobile ? 0.8 : 1), tail: 0, exitPad: bw + 90 * s
        };
      }
      if (id === 'thanksgiving') {
        // A V of Canada geese: steadier and lower-amplitude than the others, no trail
        return {
          kind: 'geese', dir: dir, s: mobile ? 0.75 : 1, age: 0, emit: 0,
          x: dir > 0 ? -140 : W + 140,
          baseY: H * (0.18 + R() * 0.18), wave: 10 + R() * 8, sway: 0.9,
          speed: 115 * (mobile ? 0.8 : 1), tail: 0
        };
      }
      var wiz = id === 'halloween';
      return {
        kind: wiz ? 'wizard' : 'sleigh', dir: dir, s: mobile ? 0.75 : 1.1, age: 0, emit: 0,
        x: dir > 0 ? -200 : W + 200,
        baseY: H * (0.14 + R() * 0.22), wave: 18 + R() * 16, sway: 1.3,
        speed: (wiz ? 170 : 130) * (mobile ? 0.8 : 1),
        tail: wiz ? 54 : 44
      };
    }

    function frame(t) {
      if (!alive) return;
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
      last = t;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.ph += dt * p.fs;
        p.x += (p.vx + Math.cos(p.ph) * p.amp) * dt;
        p.y += p.vy * dt + (p.bob ? Math.sin(p.ph) * p.bob * dt : 0);
        p.rot += p.vr * dt;
        if (p.y > H + 40 || p.x < -80 || p.x > W + 80) { parts[i] = p = make(false); }

        ctx.globalAlpha = p.a;
        if (p.leaf) {
          p.flip += p.vf * dt;
          drawMapleLeaf(ctx, p.x, p.y, p.size, p.rot, p.flip, p.col);
        } else if (p.confetti) {
          p.flip += p.vf * dt;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(Math.max(0.3, Math.abs(Math.cos(p.flip))), 1);
          ctx.fillStyle = p.col;
          star(ctx, 0, 0, p.size);
          if (p.col === '#ffffff') { ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(60,70,90,0.5)'; ctx.stroke(); }
          ctx.restore();
        } else if (p.glyph) {
          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.rot) ctx.rotate(p.rot);
          if (p.bat && p.vx < 0) ctx.scale(-1, 1);
          ctx.font = p.size + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(p.glyph, 0, 0);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.283);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = 'rgba(120,150,185,0.45)'; // keeps snow visible on light pages
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // ----- flyover: one wizard / sleigh at a time -----
      if (FLYER_ON) {
        if (nextAt === null) nextAt = t + FLYER_FIRST * 1000;
        if (!flyer && t >= nextAt) flyer = spawnFlyer();
        if (flyer) {
          var f = flyer;
          f.age += dt;
          f.x += f.dir * f.speed * dt;
          var prevY = f.y;
          f.y = f.baseY + Math.sin(f.age * f.sway) * f.wave;
          // tilt from vertical motion only; direction is applied by the mirror below
          var tilt = Math.atan2(f.y - prevY, f.speed * dt || 1) * 0.6;
          // trail: gold stars behind the broom, white glints behind the sleigh
          f.emit += f.tail ? dt : 0;
          while (f.emit > 0.04) {
            f.emit -= 0.04;
            trail.push({
              x: f.x - f.dir * f.tail * f.s + (R() - 0.5) * 6, y: f.y + 4 * f.s + (R() - 0.5) * 8,
              vx: -f.dir * (10 + R() * 20), vy: 8 + R() * 14, life: 1, r: (1.2 + R() * 2) * f.s,
              col: f.kind === 'wizard' ? (R() < 0.5 ? '#ffd34d' : '#fff3b0') : '#ffffff'
            });
          }
          if (f.kind === 'plane') drawBanner(ctx, f, id);
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(tilt * f.dir);
          ctx.scale(f.dir * f.s, f.s);
          if (f.kind === 'wizard') drawWizard(ctx, f.age);
          else if (f.kind === 'geese') drawGeese(ctx, f.age);
          else if (f.kind === 'plane') drawPlane(ctx, f.age, id);
          else drawSleigh(ctx, f.age);
          ctx.restore();
          var pad = f.exitPad || 220;
          if ((f.dir > 0 && f.x > W + pad) || (f.dir < 0 && f.x < -pad)) {
            flyer = null;
            nextAt = t + (FLYER_EVERY[0] + R() * (FLYER_EVERY[1] - FLYER_EVERY[0])) * 1000;
          }
        }
        for (var k = trail.length - 1; k >= 0; k--) {
          var q = trail[k];
          q.life -= dt * 1.1;
          if (q.life <= 0) { trail.splice(k, 1); continue; }
          q.x += q.vx * dt; q.y += q.vy * dt;
          ctx.globalAlpha = q.life;
          ctx.fillStyle = q.col;
          star(ctx, q.x, q.y, q.r * (0.6 + q.life * 0.6));
        }
        ctx.globalAlpha = 1;
      }

      // ----- Canada Day / 4th of July: fireworks in the upper part of the screen -----
      if (FIREWORKS) {
        if (fwAt === null) fwAt = t + 1200;
        if (t >= fwAt && rockets.length < 2) {
          var top = Math.max(headerBottom() + 110, H * 0.18); // room for the burst to spread upward
          rockets.push({ x: W * (0.12 + R() * 0.76), y: H + 8, ty: top + R() * Math.max(40, H * 0.42 - top), vy: -(small ? 460 : 580) });
          fwAt = t + (1.1 + R() * 1.6) * 1000;
        }
        var pal = id === 'canadaday' ? CANADA : USA;
        for (var ri = rockets.length - 1; ri >= 0; ri--) {
          var rk = rockets[ri];
          rk.y += rk.vy * dt;
          ctx.globalAlpha = 0.9;
          ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(rk.x, rk.y); ctx.lineTo(rk.x, rk.y + 16); ctx.stroke();
          if (rk.y <= rk.ty) {
            rockets.splice(ri, 1);
            var cnt = small ? 32 : 52, col = pal[(R() * pal.length) | 0], col2 = pal[(R() * pal.length) | 0];
            for (var si = 0; si < cnt; si++) {
              var ang = si / cnt * 6.283 + R() * 0.2, sp = (90 + R() * 90) * (small ? 0.75 : 1);
              sparks.push({ x: rk.x, y: rk.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1,
                decay: 0.55 + R() * 0.3, col: si % 3 ? col : col2 });
            }
          }
        }
        for (var sk = sparks.length - 1; sk >= 0; sk--) {
          var sp2 = sparks[sk];
          sp2.life -= sp2.decay * dt;
          if (sp2.life <= 0) { sparks.splice(sk, 1); continue; }
          sp2.vx *= 1 - 0.9 * dt; sp2.vy = sp2.vy * (1 - 0.9 * dt) + 70 * dt; // drag + gravity
          sp2.x += sp2.vx * dt; sp2.y += sp2.vy * dt;
          ctx.globalAlpha = Math.min(1, sp2.life * 1.4);
          // a short streak along the direction of travel reads as a firework spark
          var ex = sp2.x - sp2.vx * 0.07, ey = sp2.y - sp2.vy * 0.07;
          if (sp2.col === '#ffffff') { // dark edge first so white shows on light pages
            ctx.strokeStyle = 'rgba(60,70,90,0.55)'; ctx.lineWidth = 3.6;
            ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(sp2.x, sp2.y); ctx.stroke();
          }
          ctx.strokeStyle = sp2.col; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(sp2.x, sp2.y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // ----- Thanksgiving: a big turkey struts along the bottom edge -----
      if (id === 'thanksgiving') {
        if (walkAt === null) walkAt = t + 1500;
        if (!walker && t >= walkAt) {
          var wd = walkDir = -walkDir; // alternate: from the right first, then from the left
          var ws = W < 700 ? 0.7 : 1.15;
          walker = { dir: wd, s: ws, age: 0, x: wd > 0 ? -110 * ws : W + 110 * ws, speed: 70 * (W < 700 ? 0.8 : 1) };
        }
        if (walker) {
          walker.age += dt;
          walker.x += walker.dir * walker.speed * dt;
          ctx.save();
          ctx.translate(walker.x, H - 2);
          ctx.scale(walker.dir * walker.s, walker.s);
          drawTurkey(ctx, walker.age);
          ctx.restore();
          if ((walker.dir > 0 && walker.x > W + 120 * walker.s) || (walker.dir < 0 && walker.x < -120 * walker.s)) {
            walker = null;
            walkAt = t + (8 + R() * 7) * 1000;
          }
        }
      }

      raf = requestAnimationFrame(frame); // auto-pauses in background tabs
    }
    raf = requestAnimationFrame(frame);

    return function stop() {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      c.remove();
    };
  }

  // ---------- flyover artwork (vector, drawn facing right at origin) ----------
  function star(ctx, x, y, r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Maple leaf outline, unit size, stem pointing down.
  var MAPLE = [[0, -1], [0.12, -0.72], [0.3, -0.8], [0.24, -0.44], [0.5, -0.64], [0.57, -0.48], [0.9, -0.56],
    [0.78, -0.3], [0.93, -0.2], [0.56, 0.07], [0.62, 0.24], [0.12, 0.17], [0.05, 0.2], [0.05, 0.62], [-0.05, 0.62],
    [-0.05, 0.2], [-0.12, 0.17], [-0.62, 0.24], [-0.56, 0.07], [-0.93, -0.2], [-0.78, -0.3], [-0.9, -0.56],
    [-0.57, -0.48], [-0.5, -0.64], [-0.24, -0.44], [-0.3, -0.8], [-0.12, -0.72]];

  // `flip` narrows the leaf horizontally so it looks like it is tumbling.
  function drawMapleLeaf(ctx, x, y, size, rot, flip, col) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size * Math.max(0.25, Math.abs(Math.cos(flip))), size);
    ctx.beginPath();
    for (var i = 0; i < MAPLE.length; i++) ctx.lineTo(MAPLE[i][0], MAPLE[i][1]);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
    if (col === '#ffffff') { // white leaves need an edge on light pages
      ctx.lineWidth = 0.06; ctx.strokeStyle = 'rgba(60,70,90,0.55)'; ctx.stroke();
    }
    ctx.restore();
  }

  // Original biplane facing right, nose at the origin's right. Canada Day flies
  // red and white; the 4th of July flies navy, white and red.
  function drawPlane(ctx, t, id) {
    var body = id === 'canadaday' ? '#d52b1e' : '#1f3a7a';
    var wing = id === 'canadaday' ? '#f4f1ea' : '#b22234';
    var trim = id === 'canadaday' ? '#ffffff' : '#f4f1ea';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = wing; // lower wing
    ctx.beginPath(); ctx.ellipse(4, 6, 20, 3, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 1.2; // struts
    ctx.beginPath(); ctx.moveTo(-6, 5); ctx.lineTo(-4, -12); ctx.moveTo(14, 5); ctx.lineTo(16, -12); ctx.stroke();
    ctx.lineWidth = 1.5; // wheels
    ctx.beginPath(); ctx.moveTo(4, 8); ctx.lineTo(1, 15); ctx.moveTo(10, 8); ctx.lineTo(12, 15); ctx.stroke();
    ctx.fillStyle = '#2b2b2b';
    ctx.beginPath(); ctx.arc(1, 16, 3, 0, 6.283); ctx.arc(12, 16, 3, 0, 6.283); ctx.fill();
    ctx.fillStyle = body; // fuselage
    ctx.beginPath();
    ctx.moveTo(26, -4); ctx.quadraticCurveTo(30, 2, 26, 6); ctx.lineTo(-24, 3); ctx.lineTo(-34, -2); ctx.lineTo(-24, -6); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = trim; // stripe
    ctx.fillRect(-20, -1.5, 40, 2.4);
    ctx.fillStyle = body; // tail fin and tailplane
    ctx.beginPath(); ctx.moveTo(-24, -5); ctx.lineTo(-35, -17); ctx.lineTo(-30, -2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = wing;
    ctx.beginPath(); ctx.ellipse(-28, 0, 8, 2, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#2b2b2b'; // pilot in the open cockpit
    ctx.beginPath(); ctx.arc(-2, -8, 4, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#c98b3a';
    ctx.fillRect(-5, -11, 6, 2.2); // goggles strap
    ctx.fillStyle = wing; // upper wing
    ctx.beginPath(); ctx.ellipse(6, -13, 22, 3.2, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#5a5a5a'; // propeller hub and spinning blur
    ctx.beginPath(); ctx.arc(29, 1, 2.6, 0, 6.283); ctx.fill();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#9aa3ad';
    ctx.beginPath(); ctx.ellipse(31, 1, 1.8, 12 * Math.abs(Math.sin(t * 40)) + 4, 0, 0, 6.283); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Waving banner on a tow line behind the plane, drawn in screen space so the
  // greeting always reads left to right whichever way the plane flies.
  function drawBanner(ctx, f, id) {
    var s = f.s, h = 22 * s;
    var near = f.x - f.dir * 36 * s;          // tow-line start, at the plane's tail
    var top = near - f.dir * 26 * s;          // banner edge nearest the plane
    var x0 = f.dir > 0 ? top - f.bw : top;    // left edge in screen space
    var y = f.y - h / 2 + 2 * s;
    var seg = 12, i, wx, wy;
    ctx.save();
    ctx.strokeStyle = '#4a4a4a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(near, f.y); ctx.lineTo(top, y + 2); ctx.moveTo(near, f.y); ctx.lineTo(top, y + h - 2); ctx.stroke();
    ctx.beginPath();
    for (i = 0; i <= seg; i++) { wx = x0 + f.bw * i / seg; wy = y + Math.sin(f.age * 6 + wx * 0.05) * 2.5 * s; ctx.lineTo(wx, wy); }
    for (i = seg; i >= 0; i--) { wx = x0 + f.bw * i / seg; wy = y + h + Math.sin(f.age * 6 + wx * 0.05) * 2.5 * s; ctx.lineTo(wx, wy); }
    ctx.closePath();
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.lineWidth = 2 * s;
    ctx.strokeStyle = id === 'canadaday' ? '#d52b1e' : '#1f3a7a';
    ctx.stroke();
    ctx.fillStyle = id === 'canadaday' ? '#b8141b' : '#1f2a5c';
    ctx.font = '800 ' + Math.round(15 * s) + 'px system-ui,-apple-system,"Segoe UI",sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(f.text, x0 + f.bw / 2, y + h / 2 + Math.sin(f.age * 6 + (x0 + f.bw / 2) * 0.05) * 2.5 * s);
    ctx.restore();
  }

  // One Canada goose facing right: brown body, black neck and head, white chinstrap.
  function drawGoose(ctx, t, phase) {
    var f = Math.sin(t * 7 + phase); // wingbeat
    ctx.lineCap = 'round';
    ctx.fillStyle = '#4a3e34'; // far wing
    ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(7, -2); ctx.lineTo(1 - f * 2, -2 - 15 * f); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8a7766'; // body
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 5.5, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#d8ccbd'; // pale belly
    ctx.beginPath(); ctx.ellipse(3, 2, 9, 2.6, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#1c1c1c'; // tail
    ctx.beginPath(); ctx.moveTo(-11, -2); ctx.lineTo(-19, 0); ctx.lineTo(-11, 2.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f4f1ea'; // white rump
    ctx.beginPath(); ctx.ellipse(-11, 1, 2.5, 2, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#1c1c1c'; ctx.lineWidth = 3.4; // neck
    ctx.beginPath(); ctx.moveTo(9, -1.5); ctx.lineTo(21, -5); ctx.stroke();
    ctx.fillStyle = '#1c1c1c'; // head and bill
    ctx.beginPath(); ctx.ellipse(23.5, -6, 4.2, 2.7, -0.15, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26.5, -7); ctx.lineTo(31, -5.8); ctx.lineTo(26.5, -4.8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f4f1ea'; // chinstrap
    ctx.beginPath(); ctx.ellipse(22.5, -4.9, 2.2, 1.2, -0.3, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#6b5a4a'; // near wing
    ctx.beginPath(); ctx.moveTo(-3, -1); ctx.lineTo(8, -1); ctx.lineTo(2 - f * 3, -1 - 18 * f); ctx.closePath(); ctx.fill();
  }

  // Original turkey facing right, feet on the ground at the origin (~150px tall
  // at scale 1.15): fanned tail, bobbing head with red wattle, stepping legs.
  var TAIL = ['#6b3f22', '#a0522d', '#c46a2b', '#d9a441', '#8b4a26', '#b8743a'];
  function drawTurkey(ctx, t) {
    var step = Math.sin(t * 6);              // one stride per ~1 s
    var bob = Math.abs(Math.sin(t * 6)) * 3;  // body rises on each step
    var peck = Math.sin(t * 12) * 4;          // head pumps forward and back
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // legs and feet
    ctx.strokeStyle = '#c98b3a'; ctx.lineWidth = 4;
    [[-8, step], [8, -step]].forEach(function (leg) {
      var fx = leg[0] + leg[1] * 11, lift = Math.max(0, -leg[1]) * 7;
      ctx.beginPath(); ctx.moveTo(leg[0], -26 - bob); ctx.lineTo(fx, -lift); ctx.stroke();
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(fx, -lift); ctx.lineTo(fx + 9, -lift + 1);
      ctx.moveTo(fx, -lift); ctx.lineTo(fx + 6, -lift + 4);
      ctx.moveTo(fx, -lift); ctx.lineTo(fx - 6, -lift + 1);
      ctx.stroke();
      ctx.lineWidth = 4;
    });
    ctx.save();
    ctx.translate(0, -bob);
    // tail fan: feathers radiating behind the body, each with a pale tip
    for (var i = 0; i < 11; i++) {
      var a = Math.PI * (1.03 + i * 0.077) + Math.sin(t * 2) * 0.02;
      ctx.save();
      ctx.translate(-24, -64);
      ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = TAIL[i % TAIL.length];
      ctx.beginPath(); ctx.ellipse(0, -36, 11, 38, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#f1e3c4';
      ctx.beginPath(); ctx.ellipse(0, -66, 9, 7, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = TAIL[(i + 3) % TAIL.length];
      ctx.beginPath(); ctx.ellipse(0, -70, 7, 4, 0, 0, 6.283); ctx.fill();
      ctx.restore();
    }
    // body and breast
    ctx.fillStyle = '#5a3a22';
    ctx.beginPath(); ctx.ellipse(0, -56, 36, 31, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = 'rgba(30,18,10,0.45)'; ctx.lineWidth = 1.5;
    for (var r = 0; r < 4; r++) {
      ctx.beginPath(); ctx.arc(14, -70 + r * 11, 14, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    }
    // wing with striped feathers
    ctx.fillStyle = '#7a5232';
    ctx.beginPath(); ctx.ellipse(-8, -56, 23, 15, -0.15, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#e6d3b0'; ctx.lineWidth = 1.4;
    for (var k = 0; k < 4; k++) {
      ctx.beginPath(); ctx.moveTo(-26 + k * 7, -50); ctx.lineTo(-18 + k * 7, -63); ctx.stroke();
    }
    // neck and head, pumping forward with each step
    var hx = 50 + peck, hy = -106;
    ctx.strokeStyle = '#a77b5c'; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(26, -70); ctx.quadraticCurveTo(36 + peck * 0.5, -90, hx - 2, hy + 6); ctx.stroke();
    ctx.fillStyle = '#b8c4d6';
    ctx.beginPath(); ctx.arc(hx, hy, 9, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#d4282c'; // wattle and snood
    ctx.beginPath(); ctx.ellipse(hx + 3, hy + 12, 4.5, 8, 0.2, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx + 7, hy - 3); ctx.quadraticCurveTo(hx + 14, hy + 2, hx + 11, hy + 14);
    ctx.lineWidth = 3.5; ctx.strokeStyle = '#d4282c'; ctx.stroke();
    ctx.fillStyle = '#e8b331'; // beak
    ctx.beginPath(); ctx.moveTo(hx + 7, hy - 2); ctx.lineTo(hx + 16, hy + 1); ctx.lineTo(hx + 7, hy + 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#111111'; // eye
    ctx.beginPath(); ctx.arc(hx + 3, hy - 2, 1.8, 0, 6.283); ctx.fill();
    ctx.restore();
  }

  // Seven geese in a V; the leader is at the origin, the arms trail behind.
  var V_FORMATION = [[0, 0], [-26, -13], [-26, 13], [-52, -26], [-52, 26], [-78, -39], [-78, 39]];
  function drawGeese(ctx, t) {
    for (var g = 0; g < V_FORMATION.length; g++) {
      ctx.save();
      ctx.translate(V_FORMATION[g][0], V_FORMATION[g][1] + Math.sin(t * 2 + g) * 1.5);
      drawGoose(ctx, t, g * 0.9);
      ctx.restore();
    }
  }

  // Original wizard on a broomstick: purple robe, starry hat, grey beard.
  function drawWizard(ctx, t) {
    var w = Math.sin(t * 8) * 4; // cape/bristle flutter
    ctx.lineCap = 'round';
    // cape
    ctx.fillStyle = '#3b2a78';
    ctx.beginPath(); ctx.moveTo(4, -30); ctx.quadraticCurveTo(-18, -20 + w, -36, -8 + w); ctx.lineTo(-10, -2); ctx.closePath(); ctx.fill();
    // broom handle
    ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-30, 2); ctx.lineTo(44, -4); ctx.stroke();
    // bristles
    ctx.fillStyle = '#d9a843';
    ctx.beginPath(); ctx.moveTo(-28, 2); ctx.lineTo(-52, -7 + w * 0.5); ctx.lineTo(-58, 4); ctx.lineTo(-52, 14 - w * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#a87a22'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-30, 2); ctx.lineTo(-55, -1); ctx.moveTo(-30, 2); ctx.lineTo(-53, 9); ctx.stroke();
    ctx.fillStyle = '#7a4e22'; ctx.fillRect(-32, -1, 5, 6);
    // robe and leg
    ctx.fillStyle = '#6a4bc4';
    ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(18, -2); ctx.lineTo(12, -27); ctx.lineTo(0, -29); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(14, 10); ctx.lineTo(20, 10); ctx.lineTo(15, -2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2b2238'; ctx.fillRect(15, 8, 8, 4);
    // arm gripping the broom
    ctx.strokeStyle = '#6a4bc4'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(10, -21); ctx.lineTo(25, -7); ctx.stroke();
    ctx.fillStyle = '#f1c9a5';
    ctx.beginPath(); ctx.arc(26, -5, 3, 0, 6.283); ctx.fill();
    // head, eye, beard
    ctx.beginPath(); ctx.arc(8, -34, 6, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#2b2238';
    ctx.beginPath(); ctx.arc(11, -35, 1, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#e8e8ee';
    ctx.beginPath(); ctx.moveTo(4, -32); ctx.lineTo(14, -32); ctx.lineTo(9 - w * 0.3, -17); ctx.closePath(); ctx.fill();
    // hat: brim + cone bending back in the wind
    ctx.fillStyle = '#4a2f9a';
    ctx.beginPath(); ctx.ellipse(8, -39, 11, 3, -0.1, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -39); ctx.lineTo(16, -40); ctx.quadraticCurveTo(8, -53, -5, -59 + w * 0.5); ctx.quadraticCurveTo(2, -49, 0, -39); ctx.fill();
    ctx.fillStyle = '#ffd34d';
    star(ctx, 7, -46, 2.6);
  }

  // Santa's sleigh with two reindeer (lead one has the red nose).
  function drawSleigh(ctx, t) {
    var g = Math.sin(t * 10) * 3; // gallop
    ctx.lineCap = 'round';
    // reins
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(4, -24); ctx.lineTo(58, -16); ctx.lineTo(100, -18); ctx.stroke();
    [62, 104].forEach(function (dx, i) {
      var gg = i ? g : -g;
      ctx.strokeStyle = '#6b4420'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dx + 7, -10); ctx.lineTo(dx + 13 + gg, -1);
      ctx.moveTo(dx + 4, -10); ctx.lineTo(dx + 2 - gg, -1);
      ctx.moveTo(dx - 7, -10); ctx.lineTo(dx - 13 - gg, -2);
      ctx.moveTo(dx - 4, -10); ctx.lineTo(dx - 2 + gg, -1);
      ctx.stroke();
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath(); ctx.ellipse(dx, -14, 12, 6, 0, 0, 6.283); ctx.fill();
      ctx.beginPath(); ctx.moveTo(dx + 7, -18); ctx.lineTo(dx + 13, -27); ctx.lineTo(dx + 18, -25); ctx.lineTo(dx + 12, -13); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.ellipse(dx + 18, -27, 5.5, 3.5, 0.2, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#f2e6d0';
      ctx.beginPath(); ctx.ellipse(dx - 11, -16, 2.5, 2, 0, 0, 6.283); ctx.fill(); // tail
      ctx.strokeStyle = '#d9b38c'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(dx + 15, -30); ctx.lineTo(dx + 12, -38); ctx.lineTo(dx + 8, -40);
      ctx.moveTo(dx + 12, -37); ctx.lineTo(dx + 16, -41);
      ctx.stroke();
      ctx.fillStyle = i ? '#ff3b30' : '#2b1a10';
      ctx.beginPath(); ctx.arc(dx + 23, -27, i ? 2.4 : 1.6, 0, 6.283); ctx.fill();
    });
    // runner and struts
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(-42, 5); ctx.lineTo(18, 5); ctx.quadraticCurveTo(30, 5, 27, -6); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-30, 5); ctx.lineTo(-30, -2); ctx.moveTo(8, 5); ctx.lineTo(8, -2); ctx.stroke();
    // gift sack
    ctx.fillStyle = '#8b6b3e';
    ctx.beginPath(); ctx.ellipse(-30, -16, 11, 10, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#2e8b57'; ctx.fillRect(-37, -30, 8, 7);
    ctx.fillStyle = '#3fb6d8'; ctx.fillRect(-28, -29, 7, 6);
    // Santa
    ctx.fillStyle = '#c8102e';
    ctx.beginPath(); ctx.ellipse(-6, -18, 9, 10, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-2, -20); ctx.lineTo(6, -22); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(7, -22, 2.2, 0, 6.283); ctx.fill();          // mitten
    ctx.fillStyle = '#f1c9a5';
    ctx.beginPath(); ctx.arc(-4, -31, 5, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-8, -30); ctx.quadraticCurveTo(-4, -18, 2, -29); ctx.closePath(); ctx.fill(); // beard
    ctx.fillStyle = '#c8102e';
    ctx.beginPath(); ctx.moveTo(-10, -34); ctx.lineTo(2, -35); ctx.quadraticCurveTo(-6, -44 + g * 0.3, -15, -40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10.5, -36, 13, 3);                                        // hat trim
    ctx.beginPath(); ctx.arc(-15, -40, 2.4, 0, 6.283); ctx.fill();         // pompom
    // sleigh body (front of the sled faces the reindeer)
    ctx.fillStyle = '#b50d26';
    ctx.beginPath();
    ctx.moveTo(-44, -2); ctx.lineTo(14, -2); ctx.quadraticCurveTo(25, -4, 23, -15); ctx.lineTo(12, -15);
    ctx.lineTo(9, -9); ctx.lineTo(-34, -9); ctx.quadraticCurveTo(-44, -11, -47, -23); ctx.quadraticCurveTo(-51, -8, -44, -2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.2; ctx.stroke();
  }

  return { SEASONS: SEASONS, EXCLUDE_PATHS: EXCLUDE_PATHS, pick: pick, excluded: excluded, boot: boot };
});

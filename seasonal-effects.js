/*!
 * UpSkillSprint -- Seasonal Effects (Halloween + Christmas)
 * Drop-in, zero dependencies. Turns on/off automatically every year by the visitor's local date.
 *
 * INSTALL: nothing to do per page. scripts/inject-seasonal-effects.mjs adds
 *   <script src="/seasonal-effects.js" defer></script>
 * to every public page while the site is staged (npm run build:site).
 *
 * PREVIEW ANY TIME (ignores dates and the visitor's "off" choice):
 *   ?season=halloween   ?season=christmas   ?season=off
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
  var SEASONS = [
    { id: 'halloween', label: 'Happy Halloween', icon: '\ud83c\udf83', start: [10, 1], end: [11, 4] }, // Oct 1 -> Nov 4
    { id: 'christmas', label: 'Merry Christmas', icon: '\ud83c\udf84', start: [12, 1], end: [1, 4] }   // Dec 1 -> Jan 4
  ];
  // Pages that never get effects (prefix match). Exams stay distraction-free.
  // The build-time injector reads this same list, so edit it here only.
  var EXCLUDE_PATHS = ['/test-bank', '/exam-preview'];
  var Z = 9998; // overlay layer; badge sits at Z+1
  // Flyover (wizard on a broom / Santa's sleigh): first pass N seconds after load,
  // then one pass every [min, max] seconds. Set FLYER_ON = false to disable.
  var FLYER_ON = true;
  var FLYER_FIRST = 3;
  var FLYER_EVERY = [18, 30];
  // =============================================================================

  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }

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
        var start = new Date(y, s.start[0] - 1, s.start[1]);
        var endYear = s.end[0] < s.start[0] ? y + 1 : y;
        var end = new Date(endYear, s.end[0] - 1, s.end[1] + 1); // midnight after the last day
        if (now >= start && now < end) return { s: s, year: y, forced: false };
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
      '.uss-fx-badge{position:fixed;left:12px;bottom:12px;z-index:' + (Z + 1) + ';display:flex;align-items:center;gap:6px;' +
      'padding:6px 6px 6px 10px;border-radius:999px;background:rgba(13,27,48,.9);color:#e6f1f8;' +
      'border:1px solid rgba(63,182,216,.45);font:600 13px/1 system-ui,-apple-system,Segoe UI,sans-serif;' +
      'box-shadow:0 4px 14px rgba(0,0,0,.35)}' +
      '.uss-fx-badge .t{max-width:170px;overflow:hidden;white-space:nowrap;transition:max-width .5s ease}' +
      '.uss-fx-badge.mini .t{max-width:0}' +
      '.uss-fx-badge button{all:unset;cursor:pointer;padding:3px 7px;border-radius:999px;opacity:.75}' +
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
    c.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:' + Z;
    var ctx = c.getContext && c.getContext('2d');
    if (!ctx) return function () {}; // no canvas support: greeting only
    document.body.appendChild(c);
    var W = 0, H = 0, parts = [], raf = 0, last = 0, alive = true;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var R = Math.random;
    var HALLOWEEN = ['\ud83c\udf83', '\ud83d\udc7b', '\ud83c\udf42', '\ud83c\udf41', '\ud83c\udf83', '\ud83d\udc7b'];

    function make(anywhere) {
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
    var n = id === 'christmas' ? (small ? 45 : 90) : (small ? 10 : 18);
    for (var i = 0; i < n; i++) parts.push(make(true));

    // Passes alternate: first from the right (flying left), then from the left.
    var flyer = null, nextAt = null, trail = [], lastDir = 1;
    function spawnFlyer() {
      var dir = lastDir = -lastDir;
      var s = W < 700 ? 0.75 : 1.1;
      var wiz = id === 'halloween';
      return {
        kind: wiz ? 'wizard' : 'sleigh', dir: dir, s: s, age: 0, emit: 0,
        x: dir > 0 ? -200 : W + 200,
        baseY: H * (0.14 + R() * 0.22), wave: 18 + R() * 16,
        speed: (wiz ? 170 : 130) * (W < 700 ? 0.8 : 1),
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
        if (p.glyph) {
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
          f.y = f.baseY + Math.sin(f.age * 1.3) * f.wave;
          // tilt from vertical motion only; direction is applied by the mirror below
          var tilt = Math.atan2(f.y - prevY, f.speed * dt || 1) * 0.6;
          // trail: gold stars behind the broom, white glints behind the sleigh
          f.emit += dt;
          while (f.emit > 0.04) {
            f.emit -= 0.04;
            trail.push({
              x: f.x - f.dir * f.tail * f.s + (R() - 0.5) * 6, y: f.y + 4 * f.s + (R() - 0.5) * 8,
              vx: -f.dir * (10 + R() * 20), vy: 8 + R() * 14, life: 1, r: (1.2 + R() * 2) * f.s,
              col: f.kind === 'wizard' ? (R() < 0.5 ? '#ffd34d' : '#fff3b0') : '#ffffff'
            });
          }
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(tilt * f.dir);
          ctx.scale(f.dir * f.s, f.s);
          if (f.kind === 'wizard') drawWizard(ctx, f.age); else drawSleigh(ctx, f.age);
          ctx.restore();
          if ((f.dir > 0 && f.x > W + 220) || (f.dir < 0 && f.x < -220)) {
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

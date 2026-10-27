/* Best-Fit Model Finder: pure math core (no DOM).
 * Fits every model family from the "Choosing a Transformation to Linearize Data" lesson
 * to one x/y dataset and ranks them on comparable, original-scale criteria.
 *
 * Comparability: every continuous model gets a Gaussian log-likelihood for y itself.
 * Models fitted on a transformed scale v = g(y) add the log-Jacobian sum(ln|g'(y_i)|),
 * so AICc values are comparable across y transformations (Box and Cox, 1964).
 */
(function (root) {
  'use strict';

  /* ---------- small numeric helpers ---------- */
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function mean(a) { return sum(a) / a.length; }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normal(r) {
    var u = 0, v = 0;
    while (u === 0) u = r();
    while (v === 0) v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function solve(A, b) {
    var n = b.length, M = A.map(function (row, i) { return row.concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var piv = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      var tmp = M[c]; M[c] = M[piv]; M[piv] = tmp;
      if (!(Math.abs(M[c][c]) > 1e-300)) return null;
      for (var r2 = c + 1; r2 < n; r2++) {
        var f = M[r2][c] / M[c][c];
        if (f === 0) continue;
        for (var k = c; k <= n; k++) M[r2][k] -= f * M[c][k];
      }
    }
    var x = new Array(n);
    for (var i = n - 1; i >= 0; i--) {
      var s = M[i][n];
      for (var j = i + 1; j < n; j++) s -= M[i][j] * x[j];
      x[i] = s / M[i][i];
    }
    for (var q = 0; q < n; q++) if (!isFinite(x[q])) return null;
    return x;
  }
  function inverse(A) {
    var n = A.length, cols = [];
    for (var c = 0; c < n; c++) {
      var e = new Array(n).fill(0); e[c] = 1;
      var col = solve(A, e);
      if (!col) return null;
      cols.push(col);
    }
    return A.map(function (_, r) { return cols.map(function (col) { return col[r]; }); });
  }
  /* Least squares with a design matrix; returns coefficients, SSE and (X'X)^-1. */
  function lsq(X, y, w) {
    var n = y.length, p = X[0].length, XtX = [], Xty = new Array(p).fill(0);
    for (var a = 0; a < p; a++) XtX.push(new Array(p).fill(0));
    for (var i = 0; i < n; i++) {
      var wi = w ? w[i] : 1, row = X[i];
      for (var r = 0; r < p; r++) {
        Xty[r] += wi * row[r] * y[i];
        for (var c = r; c < p; c++) XtX[r][c] += wi * row[r] * row[c];
      }
    }
    for (var r3 = 0; r3 < p; r3++) for (var c3 = 0; c3 < r3; c3++) XtX[r3][c3] = XtX[c3][r3];
    var inv = inverse(XtX);
    if (!inv) return null;
    var beta = inv.map(function (row) { var s = 0; for (var k = 0; k < p; k++) s += row[k] * Xty[k]; return s; });
    var sse = 0, fit = new Array(n);
    for (var j = 0; j < n; j++) {
      var f = 0;
      for (var q = 0; q < p; q++) f += beta[q] * X[j][q];
      fit[j] = f;
      sse += (w ? w[j] : 1) * (y[j] - f) * (y[j] - f);
    }
    return { beta: beta, sse: sse, inv: inv, fit: fit };
  }

  /* Gamma and beta functions for p-values, t quantiles and GLM likelihoods. */
  function lgamma(z) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var x = z, y = z, tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    var ser = 1.000000000190015;
    for (var j = 0; j < 6; j++) ser += c[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d; var h = d;
    for (var m = 1; m <= 300; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d; var del = d * c; h *= del;
      if (Math.abs(del - 1) < 3e-14) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function fUpper(F, d1, d2) { return !(F > 0) ? 1 : ibeta(d2 / (d2 + d1 * F), d2 / 2, d1 / 2); }
  function tTwoSided(t, df) { return ibeta(df / (df + t * t), df / 2, 0.5); }
  /* Two-sided 95% t quantile by bisection on the exact tail. */
  function t975(df) {
    if (!(df > 0)) return NaN;
    var lo = 0, hi = 1000;
    for (var i = 0; i < 100; i++) { var mid = (lo + hi) / 2; if (tTwoSided(mid, df) > 0.05) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  /* ---------- transformations ---------- */
  var RUNGS = [-2, -1, -0.5, 0, 0.5, 1, 2, 3];
  /* Tukey ladder with the order-preserving sign for negative powers. */
  function ladder(v, p) {
    if (p === 0) return v > 0 ? Math.log(v) : NaN;
    if (p < 0) return v > 0 ? -Math.pow(v, p) : NaN;
    if (p === 1) return v;
    if (p === 2 || p === 3) return p === 2 ? (v >= 0 ? v * v : NaN) : v * v * v;
    return v >= 0 ? Math.pow(v, p) : NaN;
  }
  function ladderInv(u, p) {
    if (p === 0) return Math.exp(u);
    if (p < 0) return -u > 0 ? Math.pow(-u, 1 / p) : NaN;
    if (p === 1) return u;
    if (p === 3) return u < 0 ? -Math.pow(-u, 1 / 3) : Math.pow(u, 1 / 3);
    return u >= 0 ? Math.pow(u, 1 / p) : NaN;
  }
  /* ln|g'(y)| for the y transformation, used to put likelihoods on the y scale. */
  function ladderLogJac(y, p) {
    if (p === 1) return 0;
    if (p === 0) return -Math.log(y);
    if (p === 3) return Math.log(3) + 2 * Math.log(Math.abs(y));
    return Math.log(Math.abs(p)) + (p - 1) * Math.log(y);
  }
  var RUNG_NAME = { '-2': '1/v²', '-1': '1/v', '-0.5': '1/√v', '0': 'ln v', '0.5': '√v', '1': 'v', '2': 'v²', '3': 'v³' };
  function rungLabel(p, v) { return RUNG_NAME[String(p)].replace('v', v); }

  function yLadder(p) {
    return {
      kind: 'ladder', p: p, label: rungLabel(p, 'y'),
      fwd: function (y) { return ladder(y, p); },
      inv: function (v) { return ladderInv(v, p); },
      logJac: function (y) { return ladderLogJac(y, p); },
      flip: p < 0,
      needsPositive: p <= 0 || (p !== Math.round(p))
    };
  }
  function yLogit(scale) {
    return {
      kind: 'logit', scale: scale, label: scale === 1 ? 'logit y' : 'logit(y/100)',
      fwd: function (y) { var q = y / scale; return q > 0 && q < 1 ? Math.log(q / (1 - q)) : NaN; },
      inv: function (v) { return scale / (1 + Math.exp(-v)); },
      logJac: function (y) { var q = y / scale; return -Math.log(scale) - Math.log(q) - Math.log(1 - q); }
    };
  }
  function yBoxCox(lambda) {
    var L = lambda;
    return {
      kind: 'boxcox', lambda: L, label: Math.abs(L) < 1e-9 ? 'ln y' : 'y^' + round(L, 2),
      fwd: function (y) { if (!(y > 0)) return NaN; return Math.abs(L) < 1e-9 ? Math.log(y) : (Math.pow(y, L) - 1) / L; },
      inv: function (v) { if (Math.abs(L) < 1e-9) return Math.exp(v); var b = L * v + 1; return b > 0 ? Math.pow(b, 1 / L) : NaN; },
      logJac: function (y) { return (L - 1) * Math.log(y); }
    };
  }
  function xLadder(p, c) {
    c = c || 0;
    var base = c ? shifted(c) : 'x';
    return { p: p, c: c, flip: p < 0, label: rungLabel(p, base), fwd: function (x) { return ladder(x - c, p); } };
  }
  function xArrhenius(unit) {
    var toK = unit === 'K' ? function (t) { return t; } : unit === 'F' ? function (t) { return (t - 32) * 5 / 9 + 273.15; } : function (t) { return t + 273.15; };
    return { p: 'arrhenius', unit: unit, flip: true, label: '1/T (K)', fwd: function (x) { var k = toK(x); return k > 0 ? -1 / k : NaN; }, toK: toK };
  }

  function shifted(c) { return c < 0 ? '(x + ' + fmt(-c) + ')' : '(x − ' + fmt(c) + ')'; }
  function round(v, d) { var m = Math.pow(10, d); return Math.round(v * m) / m; }
  function fmt(v) {
    if (!isFinite(v)) return 'n/a';
    if (v === 0) return '0';
    var a = Math.abs(v);
    if (a >= 1e5 || a < 1e-3) return v.toExponential(3).replace(/-/g, '−');
    return String(parseFloat(v.toPrecision(4))).replace(/-/g, '−');
  }

  /* ---------- residual checks (lesson Part 4) ---------- */
  function polyDesign(f) {
    var m = mean(f), s = 0;
    for (var i = 0; i < f.length; i++) s += (f[i] - m) * (f[i] - m);
    s = Math.sqrt(s / Math.max(1, f.length - 1)) || 1;
    return f.map(function (v) { var z = (v - m) / s; return [1, z, z * z, z * z * z]; });
  }
  function checks(fit, res) {
    var n = res.length;
    if (n < 8) return { curvP: NaN, spreadP: NaN, curved: false, funnel: false };
    var mr = mean(res), sst = 0;
    for (var i = 0; i < n; i++) sst += (res[i] - mr) * (res[i] - mr);
    var cubic = lsq(polyDesign(fit), res);
    var curvP = 1;
    if (cubic && sst > 0) {
      var F = ((sst - cubic.sse) / 3) / (cubic.sse / (n - 4));
      curvP = fUpper(F, 3, n - 4);
    }
    var absr = res.map(Math.abs), mf = mean(fit), ma = mean(absr), sxy = 0, sxx = 0, syy = 0;
    for (var j = 0; j < n; j++) { var dx = fit[j] - mf, dy = absr[j] - ma; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
    var r = sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
    var t = r * Math.sqrt(n - 2) / Math.sqrt(Math.max(1e-12, 1 - r * r));
    var spreadP = tTwoSided(t, n - 2);
    return { curvP: curvP, spreadP: spreadP, curved: curvP < 0.05, funnel: spreadP < 0.05 };
  }

  /* ---------- model families ---------- */
  function gaussLL(sse, n) { return -n / 2 * (Math.log(2 * Math.PI * sse / n) + 1); }

  /* y-transform g, x-transform h:  g(y) = a + b h(x). */
  function fitTransformed(x, y, xf, yf) {
    var n = x.length, u = new Array(n), v = new Array(n), jac = 0;
    for (var i = 0; i < n; i++) {
      u[i] = xf.fwd(x[i]); v[i] = yf.fwd(y[i]);
      if (!isFinite(u[i]) || !isFinite(v[i])) return { skip: 'needs ' + (isFinite(u[i]) ? 'y' : 'x') + ' values the transformation can take' };
      jac += yf.logJac(y[i]);
    }
    var mu = mean(u), mv = mean(v), sxx = 0, sxy = 0;
    for (var j = 0; j < n; j++) { sxx += (u[j] - mu) * (u[j] - mu); sxy += (u[j] - mu) * (v[j] - mv); }
    if (!(sxx > 0)) return { skip: 'x is constant after transformation' };
    var b = sxy / sxx, a = mv - b * mu, sse = 0, fitv = new Array(n), res = new Array(n);
    for (var k = 0; k < n; k++) { fitv[k] = a + b * u[k]; res[k] = v[k] - fitv[k]; sse += res[k] * res[k]; }
    if (!(sse > 0)) sse = 1e-300;
    var s2 = sse / (n - 2);
    /* For display, undo the order-preserving minus sign on negative powers so the
       fitting-scale plot shows 1/x (not -1/x) under the label "1/x". */
    var fx = xf.flip ? -1 : 1, fy = yf.flip ? -1 : 1;
    var scale = {
      u: fx === 1 ? u : u.map(function (t) { return -t; }), v: fy === 1 ? v : v.map(function (t) { return -t; }),
      fit: fy === 1 ? fitv : fitv.map(function (t) { return -t; }), res: fy === 1 ? res : res.map(function (t) { return -t; }),
      xLabel: xf.label, yLabel: yf.label
    };
    return {
      params: [{ name: 'a', value: a, se: Math.sqrt(s2 * (1 / n + mu * mu / sxx)) }, { name: 'b', value: b, se: Math.sqrt(s2 / sxx) }],
      a: a, b: b, ll: gaussLL(sse, n) + jac, fitScale: scale,
      predict: function (x0) { return yf.inv(a + b * xf.fwd(x0)); },
      predictMean: function (x0) {
        var c = a + b * xf.fwd(x0), s = 0;
        for (var q = 0; q < n; q++) s += yf.inv(c + res[q]);
        return s / n;
      },
      interval: function (x0) {
        var u0 = xf.fwd(x0), c = a + b * u0, se = Math.sqrt(s2 * (1 + 1 / n + (u0 - mu) * (u0 - mu) / sxx)), t = t975(n - 2);
        var lo = yf.inv(c - t * se), hi = yf.inv(c + t * se);
        return lo <= hi ? [lo, hi] : [hi, lo];
      }
    };
  }

  /* Polynomial in x on the raw y scale. */
  function fitPoly(x, y, degree) {
    var n = x.length, mx = mean(x), sx = 0;
    for (var i = 0; i < n; i++) sx += (x[i] - mx) * (x[i] - mx);
    sx = Math.sqrt(sx / (n - 1)) || 1;
    var row = function (t) { var z = (t - mx) / sx, r = [1]; for (var d = 1; d <= degree; d++) r.push(Math.pow(z, d)); return r; };
    var fit = lsq(x.map(row), y);
    if (!fit) return { skip: 'the polynomial design is singular' };
    var p = degree + 1, s2 = fit.sse / (n - p), res = y.map(function (v, j) { return v - fit.fit[j]; });
    /* Convert centred coefficients to the plain power basis for display. */
    var raw = new Array(p).fill(0);
    for (var k = 0; k < p; k++) {
      var c = fit.beta[k] / Math.pow(sx, k);
      for (var m = 0; m <= k; m++) raw[m] += c * binom(k, m) * Math.pow(-mx, k - m);
    }
    return {
      params: raw.map(function (v, j) { return { name: j === 0 ? 'b0' : 'b' + j, value: v }; }),
      ll: gaussLL(Math.max(fit.sse, 1e-300), n), raw: raw,
      fitScale: { u: x, v: y, fit: fit.fit, res: res, xLabel: 'x', yLabel: 'y' },
      predict: function (x0) { var r = row(x0), s = 0; for (var q = 0; q < p; q++) s += fit.beta[q] * r[q]; return s; },
      interval: function (x0) {
        var r = row(x0), s = 0, h = 0;
        for (var q = 0; q < p; q++) { s += fit.beta[q] * r[q]; for (var w = 0; w < p; w++) h += r[q] * fit.inv[q][w] * r[w]; }
        var se = Math.sqrt(s2 * (1 + h)), t = t975(n - p);
        return [s - t * se, s + t * se];
      }
    };
  }
  function binom(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }

  /* Golden-section search for a maximum on [lo, hi]. */
  function golden(f, lo, hi, tol) {
    var g = (Math.sqrt(5) - 1) / 2, a = lo, b = hi, c = b - g * (b - a), d = a + g * (b - a), fc = f(c), fd = f(d);
    for (var i = 0; i < 80 && b - a > tol; i++) {
      if (fc > fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = f(c); }
      else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = f(d); }
    }
    return (a + b) / 2;
  }
  /* Grid then golden refinement of a one-parameter profile. */
  function profileMax(f, lo, hi) {
    var best = -Infinity, at = NaN, step = (hi - lo) / 50;
    for (var t = lo; t <= hi + 1e-9; t += step) { var v = f(t); if (v > best) { best = v; at = t; } }
    if (!isFinite(best)) return NaN;
    return golden(f, Math.max(lo, at - step), Math.min(hi, at + step), 1e-4);
  }

  /* Box-Cox power for y with a fixed x transformation; lambda estimated (one extra parameter). */
  function fitBoxCox(x, y, xf) {
    for (var i = 0; i < y.length; i++) if (!(y[i] > 0)) return { skip: 'Box–Cox needs every y to be positive' };
    var prof = function (L) { var m = fitTransformed(x, y, xf, yBoxCox(L)); return m.skip ? -Infinity : m.ll; };
    var L = profileMax(prof, -2, 3);
    if (!isFinite(L)) return { skip: 'Box–Cox profile could not be evaluated' };
    var m = fitTransformed(x, y, xf, yBoxCox(L));
    if (m.skip) return m;
    m.params.push({ name: 'λ', value: L });
    m.lambda = L; m.edge = L < -1.98 || L > 2.98;
    return m;
  }

  /* y = a + b (x - c)^alpha with alpha estimated: the Box-Tidwell model, profiled exactly. */
  function fitPowerX(x, y, c) {
    for (var i = 0; i < x.length; i++) if (!(x[i] - c > 0)) return { skip: 'needs every x' + (c ? ' − offset' : '') + ' to be positive' };
    var xfFor = function (al) {
      return { label: '', flip: al < 0, fwd: function (t) { var d = t - c; if (Math.abs(al) < 1e-9) return Math.log(d); return al < 0 ? -Math.pow(d, al) : Math.pow(d, al); } };
    };
    var prof = function (al) { var m = fitTransformed(x, y, xfFor(al), yLadder(1)); return m.skip ? -Infinity : m.ll; };
    var al = profileMax(prof, -3, 3);
    if (!isFinite(al)) return { skip: 'the power on x could not be estimated' };
    var xf = xfFor(al);
    xf.label = (c ? shifted(c) : 'x') + '^' + round(al, 3);
    var m = fitTransformed(x, y, xf, yLadder(1));
    if (m.skip) return m;
    m.fitScale.xLabel = xf.label;
    /* Report b on the physical scale: the fit used -x^alpha for alpha < 0 to keep the order. */
    if (al < 0) { m.b = -m.b; m.params[1].value = -m.params[1].value; m.fitScale.xLabel = xf.label; }
    m.params.push({ name: 'α', value: al });
    m.alpha = al; m.edge = al < -2.98 || al > 2.98;
    return m;
  }

  /* Levenberg-Marquardt for additive-error nonlinear least squares on the y scale. */
  function lm(f, x, y, p0, opts) {
    opts = opts || {};
    var n = x.length, k = p0.length, p = p0.slice(), lambda = 1e-3;
    var resid = function (pp) { var r = new Array(n); for (var i = 0; i < n; i++) r[i] = y[i] - f(x[i], pp); return r; };
    var sseOf = function (r) { var s = 0; for (var i = 0; i < r.length; i++) s += r[i] * r[i]; return s; };
    var r = resid(p), sse = sseOf(r);
    if (!isFinite(sse)) return null;
    var jac = function (pp) {
      var J = [];
      for (var i = 0; i < n; i++) J.push(new Array(k));
      for (var j = 0; j < k; j++) {
        var h = 1e-6 * Math.max(1, Math.abs(pp[j])), pu = pp.slice(), pd = pp.slice();
        pu[j] += h; pd[j] -= h;
        for (var i2 = 0; i2 < n; i2++) J[i2][j] = (f(x[i2], pu) - f(x[i2], pd)) / (2 * h);
      }
      return J;
    };
    for (var it = 0; it < (opts.maxIter || 300); it++) {
      var J = jac(p), JtJ = [], Jtr = new Array(k).fill(0);
      for (var a = 0; a < k; a++) JtJ.push(new Array(k).fill(0));
      for (var i3 = 0; i3 < n; i3++) for (var a2 = 0; a2 < k; a2++) {
        Jtr[a2] += J[i3][a2] * r[i3];
        for (var b2 = 0; b2 < k; b2++) JtJ[a2][b2] += J[i3][a2] * J[i3][b2];
      }
      var improved = false;
      for (var tries = 0; tries < 12; tries++) {
        var A = JtJ.map(function (row, q) { return row.map(function (v, w) { return q === w ? v * (1 + lambda) + 1e-12 : v; }); });
        var step = solve(A, Jtr);
        if (!step) { lambda *= 10; continue; }
        var pn = p.map(function (v, q) { return v + step[q]; }), rn = resid(pn), ssen = sseOf(rn);
        if (isFinite(ssen) && ssen < sse) {
          var rel = (sse - ssen) / Math.max(sse, 1e-300);
          p = pn; r = rn; sse = ssen; lambda = Math.max(lambda / 10, 1e-12); improved = true;
          if (rel < 1e-12) it = 1e9;
          break;
        }
        lambda *= 10;
      }
      if (!improved) break;
    }
    var Jf = jac(p), JtJf = [];
    for (var a3 = 0; a3 < k; a3++) { JtJf.push(new Array(k).fill(0)); for (var b3 = 0; b3 < k; b3++) for (var i4 = 0; i4 < n; i4++) JtJf[a3][b3] += Jf[i4][a3] * Jf[i4][b3]; }
    return { p: p, sse: sse, res: r, cov: inverse(JtJf), J: Jf };
  }
  function fitNLS(x, y, f, p0, names, check) {
    var n = x.length, k = p0.length;
    if (n < k + 3) return { skip: 'too few points for ' + k + ' parameters' };
    var out = lm(f, x, y, p0);
    if (!out || !isFinite(out.sse)) return { skip: 'the nonlinear fit did not converge' };
    if (check && !check(out.p)) return { skip: 'the nonlinear fit converged to an implausible shape' };
    var s2 = out.sse / (n - k), p = out.p, fitv = x.map(function (t) { return f(t, p); });
    var grad = function (x0) {
      return p.map(function (v, j) { var h = 1e-6 * Math.max(1, Math.abs(v)), pu = p.slice(), pd = p.slice(); pu[j] += h; pd[j] -= h; return (f(x0, pu) - f(x0, pd)) / (2 * h); });
    };
    return {
      params: p.map(function (v, j) { return { name: names[j], value: v, se: out.cov ? Math.sqrt(s2 * out.cov[j][j]) : NaN }; }),
      ll: gaussLL(Math.max(out.sse, 1e-300), n), p: p,
      fitScale: { u: x, v: y, fit: fitv, res: out.res, xLabel: 'x', yLabel: 'y' },
      predict: function (x0) { return f(x0, p); },
      interval: function (x0) {
        if (!out.cov) return [NaN, NaN];
        var g = grad(x0), v = 0;
        for (var a = 0; a < k; a++) for (var b = 0; b < k; b++) v += g[a] * out.cov[a][b] * g[b];
        var c = f(x0, p), se = Math.sqrt(s2 * (1 + v)), t = t975(n - k);
        return [c - t * se, c + t * se];
      }
    };
  }

  /* Generalized linear models with a log link, by iteratively reweighted least squares. */
  function fitGLM(x, y, xf, family) {
    var n = x.length, u = x.map(xf.fwd);
    for (var i = 0; i < n; i++) {
      if (!isFinite(u[i])) return { skip: 'needs x values the transformation can take' };
      if (family === 'poisson' && !(y[i] >= 0 && Math.round(y[i]) === y[i])) return { skip: 'Poisson needs non-negative whole-number counts' };
      if (family === 'gamma' && !(y[i] > 0)) return { skip: 'Gamma needs every y to be positive' };
    }
    var X = u.map(function (t) { return [1, t]; });
    var start = lsq(X, y.map(function (v) { return Math.log(v + (family === 'poisson' ? 0.5 : 0)); }));
    if (!start) return { skip: 'the starting fit is singular' };
    var beta = start.beta, mu;
    for (var it = 0; it < 100; it++) {
      var eta = u.map(function (t) { return beta[0] + beta[1] * t; });
      mu = eta.map(Math.exp);
      if (!mu.every(isFinite)) return { skip: 'the GLM fit diverged' };
      var z = eta.map(function (e, j) { return e + (y[j] - mu[j]) / mu[j]; });
      var w = family === 'poisson' ? mu : mu.map(function () { return 1; });
      var next = lsq(X, z, w);
      if (!next) return { skip: 'the GLM fit is singular' };
      var delta = Math.abs(next.beta[0] - beta[0]) + Math.abs(next.beta[1] - beta[1]);
      beta = next.beta;
      if (delta < 1e-10) break;
    }
    mu = u.map(function (t) { return Math.exp(beta[0] + beta[1] * t); });
    var pearson = y.map(function (v, j) { return (v - mu[j]) / Math.sqrt(family === 'poisson' ? mu[j] : mu[j] * mu[j]); });
    var ll = 0, phi = 1, comparable = true;
    if (family === 'poisson') {
      for (var j = 0; j < n; j++) ll += y[j] * Math.log(mu[j]) - mu[j] - lgamma(y[j] + 1);
      comparable = false;
    } else {
      phi = sum(pearson.map(function (r) { return r * r; })) / (n - 2);
      var nu = 1 / phi;
      for (var q = 0; q < n; q++) ll += nu * Math.log(nu * y[q] / mu[q]) - nu * y[q] / mu[q] - Math.log(y[q]) - lgamma(nu);
    }
    var W = family === 'poisson' ? mu : mu.map(function () { return 1; });
    var info = lsq(X, mu, W);
    var disp = family === 'poisson' ? 1 : phi;
    return {
      params: [{ name: 'a', value: beta[0], se: info ? Math.sqrt(disp * info.inv[0][0]) : NaN }, { name: 'b', value: beta[1], se: info ? Math.sqrt(disp * info.inv[1][1]) : NaN }]
        .concat(family === 'gamma' ? [{ name: 'shape', value: 1 / phi }] : []),
      ll: ll, comparable: comparable, extraK: family === 'gamma' ? 1 : 0, a: beta[0], b: beta[1],
      fitScale: { u: u, v: y, fit: mu, res: pearson, xLabel: xf.label, yLabel: 'Pearson residual', glm: true },
      predict: function (x0) { return Math.exp(beta[0] + beta[1] * xf.fwd(x0)); },
      interval: function () { return [NaN, NaN]; }
    };
  }

  /* ---------- equations for display ---------- */
  function signed(v) { return (v < 0 ? ' − ' : ' + ') + fmt(Math.abs(v)); }
  /* Undo the order-preserving sign flips so reported a and b match the displayed equation. */
  function physical(m, px, py) {
    var fa = 1, fb = 1;
    if (typeof py === 'number' && py < 0) { fa = -1; fb = -1; }
    if ((typeof px === 'number' && px < 0) || px === 'arrhenius') fb = -fb;
    m.params[0].value *= fa; m.params[1].value *= fb;
  }
  function ladderEquation(m, px, py, xf) {
    var a = m.a, b = m.b;
    var yl = py === 'logit' ? m.yLabel : rungLabel(py, 'y');
    if (typeof py === 'number' && py < 0) { a = -a; b = -b; }
    var xl = xf.label;
    if (typeof px === 'number' && px < 0) { b = -b; }
    if (px === 'arrhenius') { b = -b; xl = '1/T'; }
    return (yl + ' = ' + fmt(a) + signed(b) + '·' + xl).replace(/·1\//g, '/');
  }
  function backForm(id, m) {
    var A = Math.exp(m.a);
    if (id === 'ladder|1|0') return 'y = ' + fmt(A) + '·e^(' + fmt(m.b) + 'x)';
    if (id === 'ladder|0|0') return 'y = ' + fmt(A) + '·x^' + fmt(m.b);
    if (id === 'arrhenius|0') return 'y = ' + fmt(A) + '·e^(−' + fmt(m.b) + '/T)';
    return null;
  }

  /* ---------- the catalogue ---------- */
  var FAMOUS = {
    'ladder|1|1': ['Linear', 'Straight line'],
    'ladder|1|0': ['Exponential (log y)', 'Exponential growth or decay; multiplicative error'],
    'ladder|0|0': ['Power law (log–log)', 'Power law; slope is the exponent (elasticity)'],
    'ladder|0|1': ['Logarithmic', 'Diminishing returns; change per doubling of x is b·ln 2'],
    'ladder|-1|1': ['Reciprocal x', 'Inverse proportion, e.g. time = distance / speed'],
    'ladder|-0.5|1': ['Inverse square root (Hall–Petch)', 'Grain-size strengthening form'],
    'ladder|1|-1': ['Reciprocal y', 'Rates; spread growing with the square of the mean'],
    'ladder|1|0.5': ['Square-root y', 'Counts with variance equal to the mean'],
    'ladder|0.5|0.5': ['Square root of both', 'Counts proportional to x'],
    'ladder|2|1': ['Quadratic x term only', 'Curve steepening at high x']
  };

  function buildSpecs(opts) {
    var c = +opts.xOffset || 0, specs = [];
    RUNGS.forEach(function (py) {
      RUNGS.forEach(function (px) {
        var id = 'ladder|' + px + '|' + py, fam = FAMOUS[id];
        specs.push({
          id: id, family: 'Ladder', k: 3, linearized: true, px: px, py: py,
          name: fam ? fam[0] : rungLabel(py, 'y') + ' vs ' + rungLabel(px, c ? shifted(c) : 'x'),
          note: fam ? fam[1] : 'Ladder of powers: y rung ' + py + ', x rung ' + px,
          fit: function (x, y) { var xf = xLadder(px, c), m = fitTransformed(x, y, xf, yLadder(py)); if (!m.skip) { m.equation = ladderEquation(m, px, py, xf); m.back = backForm(id, m); physical(m, px, py); } return m; }
        });
      });
    });
    if (opts.yScale === 1 || opts.yScale === 100) {
      [1, 0].forEach(function (px) {
        specs.push({
          id: 'logit|' + px, family: 'Logistic (linearized)', k: 3, linearized: true, px: px, py: 'logit',
          name: px === 1 ? 'Logit of proportion vs x' : 'Logit of proportion vs ln x',
          note: 'S-curve between 0 and ' + (opts.yScale === 100 ? '100%' : '1'),
          fit: function (x, y) { var xf = xLadder(px, c), yf = yLogit(opts.yScale), m = fitTransformed(x, y, xf, yf); if (!m.skip) { m.yLabel = yf.label; m.equation = yf.label + ' = ' + fmt(m.a) + signed(m.b) + '·' + xf.label; } return m; }
        });
      });
    }
    if (opts.tempUnit) {
      [0, 1].forEach(function (py) {
        specs.push({
          id: 'arrhenius|' + py, family: 'Arrhenius', k: 3, linearized: true, px: 'arrhenius', py: py,
          name: py === 0 ? 'Arrhenius (ln y vs 1/T)' : 'y vs 1/T',
          note: py === 0 ? 'Rate with activation energy; slope = −Ea/R' : 'Linear in reciprocal absolute temperature',
          fit: function (x, y) { var xf = xArrhenius(opts.tempUnit), m = fitTransformed(x, y, xf, yLadder(py)); if (!m.skip) { m.equation = ladderEquation(m, 'arrhenius', py, xf); m.back = backForm('arrhenius|' + py, m); if (py === 0) m.extra = 'Ea ≈ ' + fmt(m.b * 8.314462618 / 1000) + ' kJ/mol'; physical(m, 'arrhenius', py); } return m; }
        });
      });
    }
    [1, 0, -1, 0.5, -0.5].forEach(function (px) {
      specs.push({
        id: 'boxcox|' + px, family: 'Box–Cox', k: 4, linearized: true, px: px, py: 'boxcox',
        name: 'Box–Cox y vs ' + rungLabel(px, c ? shifted(c) : 'x'),
        note: 'Power on y estimated by maximum likelihood',
        fit: function (x, y) { var xf = xLadder(px, c), m = fitBoxCox(x, y, xf); if (!m.skip) { m.equation = '(y^λ − 1)/λ = ' + fmt(m.a) + signed(m.b) + '·' + xf.label + ',  λ = ' + fmt(m.lambda); if (m.edge) m.warn = 'λ hit the edge of the search range'; } return m; }
      });
    });
    specs.push({
      id: 'powerx', family: 'Box–Tidwell', k: 4, linearized: true, px: 'alpha', py: 1,
      name: 'Power of x (Box–Tidwell)', note: 'y = a + b·x^α with α estimated',
      fit: function (x, y) { var m = fitPowerX(x, y, c); if (!m.skip) { m.equation = 'y = ' + fmt(m.a) + signed(m.b) + '·' + m.fitScale.xLabel; if (m.edge) m.warn = 'α hit the edge of the search range'; } return m; }
    });
    [2, 3].forEach(function (d) {
      specs.push({
        id: 'poly|' + d, family: 'Polynomial', k: d + 2, linearized: false,
        name: d === 2 ? 'Quadratic' : 'Cubic', note: d === 2 ? 'Models one turn (minimum or maximum)' : 'Flexible; risky to extrapolate',
        fit: function (x, y) {
          var m = fitPoly(x, y, d);
          if (!m.skip) {
            m.equation = 'y = ' + fmt(m.raw[0]) + m.raw.slice(1).map(function (v, j) { return signed(v) + '·x' + (j ? (j === 1 ? '²' : '³') : ''); }).join('');
            if (d === 2 && m.raw[2] !== 0) m.extra = 'Turning point at x = ' + fmt(-m.raw[1] / (2 * m.raw[2]));
            if (d === 3) m.warn = 'Cubic terms extrapolate badly outside the data range';
          }
          return m;
        }
      });
    });
    specs.push({
      id: 'nls|exp', family: 'Nonlinear', k: 3, linearized: false, name: 'Exponential, additive error', note: 'y = a·e^(bx) fitted on the original scale',
      fit: function (x, y) {
        var pos = y.every(function (v) { return v > 0; }), st = pos ? fitTransformed(x, y, xLadder(1, 0), yLadder(0)) : { skip: true };
        var p0 = st.skip ? [mean(y), 0] : [Math.exp(st.a), st.b];
        var m = fitNLS(x, y, function (t, p) { return p[0] * Math.exp(p[1] * t); }, p0, ['a', 'b']);
        if (!m.skip) m.equation = 'y = ' + fmt(m.p[0]) + '·e^(' + fmt(m.p[1]) + 'x)';
        return m;
      }
    });
    specs.push({
      id: 'nls|expfloor', family: 'Nonlinear', k: 4, linearized: false, name: 'Exponential to a floor or ceiling', note: 'y = c + a·e^(bx); decay or growth toward an asymptote',
      fit: function (x, y) {
        var mn = Math.min.apply(null, y), mx = Math.max.apply(null, y), span = mx - mn || 1;
        var xs = x.slice().sort(function (p, q) { return p - q; }), xr = (xs[xs.length - 1] - xs[0]) || 1;
        var rising = sum(x.map(function (t, i) { return (t - mean(x)) * (y[i] - mean(y)); })) > 0;
        var best = null;
        [-3, -1, 1, 3].forEach(function (rate) {
          var b0 = rate / xr, c0 = rate < 0 ? (rising ? mx + 0.1 * span : mn - 0.1 * span) : (rising ? mn - 0.1 * span : mx + 0.1 * span);
          var a0 = (y[0] - c0) / Math.exp(b0 * x[0]);
          if (!isFinite(a0)) return;
          var m = fitNLS(x, y, function (t, p) { return p[2] + p[0] * Math.exp(p[1] * t); }, [a0, b0, c0], ['a', 'b', 'c']);
          if (!m.skip && (!best || m.ll > best.ll)) best = m;
        });
        if (!best) return { skip: 'the nonlinear fit did not converge' };
        best.equation = 'y = ' + fmt(best.p[2]) + signed(best.p[0]) + '·e^(' + fmt(best.p[1]) + 'x)';
        return best;
      }
    });
    specs.push({
      id: 'nls|power', family: 'Nonlinear', k: 3, linearized: false, name: 'Power law, additive error', note: 'y = a·x^b fitted on the original scale',
      fit: function (x, y) {
        if (!x.every(function (t) { return t - c > 0; })) return { skip: 'needs every x to be positive' };
        var st = y.every(function (v) { return v > 0; }) ? fitTransformed(x, y, xLadder(0, c), yLadder(0)) : { skip: true };
        var p0 = st.skip ? [mean(y), 1] : [Math.exp(st.a), st.b];
        var m = fitNLS(x, y, function (t, p) { return p[0] * Math.pow(t - c, p[1]); }, p0, ['a', 'b']);
        if (!m.skip) m.equation = 'y = ' + fmt(m.p[0]) + '·' + (c ? shifted(c) : 'x') + '^' + fmt(m.p[1]);
        return m;
      }
    });
    specs.push({
      id: 'nls|tanh', family: 'Nonlinear', k: 5, linearized: false, name: 'Hyperbolic tangent (transition curve)', note: 'y = A + B·tanh((x − T0)/C); Charpy-style upper and lower shelves',
      fit: function (x, y) {
        if (x.length < 10) return { skip: 'needs at least 10 points for four parameters' };
        var mn = Math.min.apply(null, y), mx = Math.max.apply(null, y);
        var xs = x.slice().sort(function (p, q) { return p - q; }), xr = (xs[xs.length - 1] - xs[0]) || 1;
        var rising = sum(x.map(function (t, i) { return (t - mean(x)) * (y[i] - mean(y)); })) > 0;
        var best = null;
        [0.3, 0.5, 0.7].forEach(function (frac) {
          var p0 = [(mx + mn) / 2, (rising ? 1 : -1) * (mx - mn) / 2, xs[0] + frac * xr, xr / 6];
          var m = fitNLS(x, y, function (t, p) { return p[0] + p[1] * Math.tanh((t - p[2]) / p[3]); }, p0, ['A', 'B', 'T0', 'C'], function (p) { return Math.abs(p[3]) > 1e-9 * xr; });
          if (!m.skip && (!best || m.ll > best.ll)) best = m;
        });
        if (!best) return { skip: 'the nonlinear fit did not converge' };
        var p = best.p;
        best.equation = 'y = ' + fmt(p[0]) + signed(p[1]) + '·tanh(' + shifted(p[2]) + '/' + fmt(p[3]) + ')';
        best.extra = 'Transition midpoint T0 = ' + fmt(p[2]) + '; shelves at ' + fmt(p[0] - Math.abs(p[1])) + ' and ' + fmt(p[0] + Math.abs(p[1]));
        if (p[2] < xs[0] || p[2] > xs[xs.length - 1]) best.warn = 'The midpoint lies outside the data; shelves are extrapolated';
        return best;
      }
    });
    [1, 0].forEach(function (px) {
      specs.push({
        id: 'gamma|' + px, family: 'GLM', k: 3, linearized: false, px: px,
        name: 'Gamma GLM, log link' + (px === 0 ? ', ln x' : ''), note: 'Models the mean directly; spread grows with the mean; no back-transform bias',
        fit: function (x, y) { var xf = xLadder(px, c), m = fitGLM(x, y, xf, 'gamma'); if (!m.skip) m.equation = 'ln E(y) = ' + fmt(m.a) + signed(m.b) + '·' + xf.label; return m; }
      });
      specs.push({
        id: 'poisson|' + px, family: 'GLM', k: 2, linearized: false, px: px,
        name: 'Poisson GLM, log link' + (px === 0 ? ', ln x' : ''), note: 'For counts; likelihood is discrete, so AICc is not compared with the others',
        fit: function (x, y) { var xf = xLadder(px, c), m = fitGLM(x, y, xf, 'poisson'); if (!m.skip) m.equation = 'ln E(y) = ' + fmt(m.a) + signed(m.b) + '·' + xf.label; return m; }
      });
    });
    return specs;
  }

  /* ---------- evaluation ---------- */
  function folds(n, k, seed) {
    var idx = []; for (var i = 0; i < n; i++) idx.push(i);
    var r = rng(seed || 20261027);
    for (var j = n - 1; j > 0; j--) { var q = Math.floor(r() * (j + 1)); var t = idx[j]; idx[j] = idx[q]; idx[q] = t; }
    var out = [];
    for (var f = 0; f < k; f++) out.push([]);
    idx.forEach(function (v, i) { out[i % k].push(v); });
    return out;
  }
  function crossValidate(spec, x, y, k) {
    var n = x.length, parts = folds(n, k), sse = 0, used = 0;
    for (var f = 0; f < parts.length; f++) {
      var test = {}; parts[f].forEach(function (i) { test[i] = true; });
      var xt = [], yt = [];
      for (var i = 0; i < n; i++) if (!test[i]) { xt.push(x[i]); yt.push(y[i]); }
      var m = spec.fit(xt, yt);
      if (m.skip) return NaN;
      for (var q = 0; q < parts[f].length; q++) {
        var j = parts[f][q], pred = m.predict(x[j]);
        if (!isFinite(pred)) return NaN;
        sse += (y[j] - pred) * (y[j] - pred); used++;
      }
    }
    return Math.sqrt(sse / used);
  }

  function evaluate(spec, x, y, opts) {
    var n = x.length, m = spec.fit(x, y);
    if (m.skip) return { id: spec.id, name: spec.name, family: spec.family, skip: m.skip };
    var k = spec.k + (m.extraK || 0);
    if (n < k + 3) return { id: spec.id, name: spec.name, family: spec.family, skip: 'too few points for ' + k + ' parameters' };
    var my = mean(y), sst = 0, sse = 0, bad = 0, preds = new Array(n);
    for (var i = 0; i < n; i++) {
      preds[i] = m.predict(x[i]);
      sst += (y[i] - my) * (y[i] - my);
      if (!isFinite(preds[i])) { bad++; continue; }
      sse += (y[i] - preds[i]) * (y[i] - preds[i]);
    }
    var aic = -2 * m.ll + 2 * k, aicc = aic + 2 * k * (k + 1) / (n - k - 1);
    var ck = checks(m.fitScale.fit, m.fitScale.res);
    if (spec.linearized) {
      var vbar = mean(m.fitScale.v), tss = 0, rss = 0;
      for (var q = 0; q < n; q++) { tss += (m.fitScale.v[q] - vbar) * (m.fitScale.v[q] - vbar); rss += m.fitScale.res[q] * m.fitScale.res[q]; }
      m.fitScale.r2 = tss > 0 ? 1 - rss / tss : NaN;
    }
    var cv = opts.cv === false ? NaN : crossValidate(spec, x, y, Math.min(opts.folds || 10, n));
    var flags = [];
    if (ck.curved) flags.push('curve remains');
    if (ck.funnel) flags.push('uneven spread');
    if (bad) flags.push(bad + ' predictions undefined');
    if (m.warn) flags.push(m.warn);
    if (!isFinite(cv)) flags.push('fails on held-out data');
    return {
      id: spec.id, name: spec.name, family: spec.family, note: spec.note, linearized: spec.linearized,
      k: k, n: n, ll: m.ll, aicc: aicc, comparable: m.comparable !== false,
      r2: bad ? NaN : 1 - sse / sst, rmse: bad ? NaN : Math.sqrt(sse / n), cvRmse: cv,
      curvP: ck.curvP, spreadP: ck.spreadP, curved: ck.curved, funnel: ck.funnel, passes: !ck.curved && !ck.funnel && !bad,
      equation: m.equation || '', back: m.back || null, extra: m.extra || null, flags: flags,
      params: m.params, fitScale: m.fitScale, predict: m.predict, predictMean: m.predictMean || m.predict, interval: m.interval
    };
  }

  /* Clean paired numeric data. */
  function prepare(xs, ys) {
    var x = [], y = [], dropped = 0;
    for (var i = 0; i < Math.min(xs.length, ys.length); i++) {
      var a = typeof xs[i] === 'number' ? xs[i] : Number(String(xs[i]).trim()), b = typeof ys[i] === 'number' ? ys[i] : Number(String(ys[i]).trim());
      if (String(xs[i]).trim() === '' || String(ys[i]).trim() === '' || !isFinite(a) || !isFinite(b)) { dropped++; continue; }
      x.push(a); y.push(b);
    }
    return { x: x, y: y, dropped: dropped };
  }

  function describe(x, y) {
    var pos = function (a) { return a.every(function (v) { return v > 0; }); };
    var minx = Math.min.apply(null, x), maxx = Math.max.apply(null, x), miny = Math.min.apply(null, y), maxy = Math.max.apply(null, y);
    return {
      n: x.length, xMin: minx, xMax: maxx, yMin: miny, yMax: maxy,
      xRatio: minx > 0 ? maxx / minx : NaN, yRatio: miny > 0 ? maxy / miny : NaN,
      xPositive: pos(x), yPositive: pos(y),
      yCounts: y.every(function (v) { return v >= 0 && Math.round(v) === v; }),
      yUnit: y.every(function (v) { return v > 0 && v < 1; }),
      yPercent: y.every(function (v) { return v > 0 && v < 100; }) && maxy > 1
    };
  }

  /* Fit every model family and summarise. opts: {xOffset, yScale (null|1|100), tempUnit (null|'C'|'K'|'F'), cv, folds}. */
  function fitAll(x, y, opts) {
    opts = opts || {};
    if (x.length < 6) throw new Error('Use at least 6 complete x–y pairs.');
    var info = describe(x, y);
    if (!(info.xMax > info.xMin)) throw new Error('x has only one value. Choose a column that varies.');
    if (!(info.yMax > info.yMin)) throw new Error('y has only one value. Choose a column that varies.');
    var specs = buildSpecs(opts), models = [], skipped = [];
    specs.forEach(function (s) {
      var r = evaluate(s, x, y, opts);
      if (r.skip) skipped.push(r); else models.push(r);
    });
    var comparable = models.filter(function (m) { return m.comparable && isFinite(m.aicc); });
    var minA = Math.min.apply(null, comparable.map(function (m) { return m.aicc; }));
    var wsum = 0;
    comparable.forEach(function (m) { m.delta = m.aicc - minA; m.weightRaw = Math.exp(-m.delta / 2); wsum += m.weightRaw; });
    comparable.forEach(function (m) { m.weight = m.weightRaw / wsum; delete m.weightRaw; });
    models.forEach(function (m) { if (!m.comparable) { m.delta = NaN; m.weight = NaN; } });
    return { models: models, skipped: skipped, info: info, summary: summarize(models, info, opts) };
  }

  function rank(models, by) {
    var key = by === 'cv' ? function (m) { return m.cvRmse; } : by === 'r2' ? function (m) { return -m.r2; } : function (m) { return m.comparable ? m.aicc : NaN; };
    return models.slice().sort(function (a, b) {
      var ka = key(a), kb = key(b);
      if (!isFinite(ka) && !isFinite(kb)) return a.name < b.name ? -1 : 1;
      if (!isFinite(ka)) return 1;
      if (!isFinite(kb)) return -1;
      return ka - kb;
    });
  }

  function summarize(models, info, opts) {
    var ranked = rank(models, 'aicc'), best = ranked[0];
    var passing = ranked.filter(function (m) { return m.passes && m.comparable; });
    var ties = ranked.filter(function (m) { return m.comparable && m.delta < 2; });
    var simplest = ties.slice().sort(function (a, b) { return a.k - b.k || a.delta - b.delta; })[0];
    var cvBest = rank(models, 'cv')[0];
    var warnings = [];
    if (info.n < 15) warnings.push('Only ' + info.n + ' points: rankings between similar models are unstable. Collect more data before relying on fine differences.');
    if (info.xPositive && info.xRatio < 2) warnings.push('The largest x is less than twice the smallest, so power transformations of x barely change the shape. Look for an offset (start value) to subtract.');
    if (best && !best.passes) warnings.push('The top model by AICc fails a residual check (' + best.flags.join(', ') + '). Prefer the best model that passes, or look for a model with the right shape.');
    if (best && best.family === 'Polynomial' && best.k >= 5) warnings.push('A cubic ranks first. It fits inside the data but bends sharply outside it; do not extrapolate.');
    if (info.yCounts && info.yMax <= 1e6) warnings.push('y is whole numbers ≥ 0. If y is a count of events rather than a rounded measurement, the Poisson GLM rows are the natural model; their AICc is not comparable with continuous models, so compare them by cross-validated RMSE.');
    return { best: best, bestPassing: passing[0] || null, ties: ties, simplest: simplest, cvBest: cvBest, warnings: warnings };
  }

  /* The single best "linear" model: a straight line after transforming x and/or y
     (ladder, logit, Arrhenius, Box-Cox, Box-Tidwell). Prefer models that pass both
     residual checks; among those within 2 AICc of the best, take the fewest parameters,
     so a plain ladder rung beats an estimated Box-Cox power that fits no better. */
  function bestLinear(models) {
    var pool = models.filter(function (m) { return m.linearized && m.comparable && isFinite(m.aicc); });
    if (!pool.length) return null;
    var byA = rank(pool, 'aicc'), passing = byA.filter(function (m) { return m.passes; });
    var base = passing.length ? passing : byA, top = base[0];
    var near = base.filter(function (m) { return m.aicc - top.aicc < 2; });
    var pick = near.slice().sort(function (a, b) { return a.k - b.k || a.aicc - b.aicc; })[0];
    var others = base.filter(function (m) { return m !== pick; });
    var reasons = [];
    reasons.push('It is a straight line on the ' + pick.fitScale.yLabel + ' versus ' + pick.fitScale.xLabel + ' scale (R² ' + pick.fitScale.r2.toFixed(4) + ' on that scale).');
    if (passing.length) reasons.push('It passes both residual checks: no leftover curve (p ' + fmtP(pick.curvP) + ') and even spread (p ' + fmtP(pick.spreadP) + ').');
    else reasons.push('No straight-line transformation passes both residual checks, so this is the best of the ones that fail. Treat it with caution.');
    if (pick !== top) reasons.push('It is within 2 AICc of ' + top.name + ' and uses fewer parameters, so it is the simpler equal choice.');
    if (others.length) reasons.push('Next best: ' + others[0].name + ', ' + (others[0].aicc - pick.aicc >= 0 ? 'ΔAICc ' + (others[0].aicc - pick.aicc).toFixed(2) : 'within 2 AICc') + '.');
    reasons.push('Compared ' + pool.length + ' straight-line transformations' + (passing.length ? ', ' + passing.length + ' of which pass both checks.' : '.'));
    var overall = rank(models.filter(function (m) { return m.comparable; }), 'aicc')[0], beaten = null;
    if (overall && !overall.linearized && pick.aicc - overall.aicc > 10) {
      beaten = overall;
      reasons.push('A model that is not a straight-line transformation fits much better: ' + overall.name + ' (lower AICc by ' + (pick.aicc - overall.aicc).toFixed(1) + '). The relationship may not be linearizable; consider that model instead.');
    }
    return { pick: pick, passing: passing.length > 0, near: near, runnersUp: others.slice(0, 3), poolSize: pool.length, passingCount: passing.length, betterNonlinear: beaten, reasons: reasons };
  }
  function fmtP(p) { return !isFinite(p) ? 'n/a' : p < 0.001 ? '< 0.001' : p.toFixed(3); }

  /* Fictitious sample datasets for trying the tool. */
  function sample(key) {
    var r = rng({ hallpetch: 11, growth: 25, charpy: 83 }[key] || 1), x = [], y = [];
    for (var i = 0; i < 40; i++) {
      var t;
      if (key === 'hallpetch') { t = Math.exp(Math.log(4) + r() * Math.log(15)); x.push(+t.toFixed(2)); y.push(+(180 + 620 * Math.pow(t, -0.5) + normal(r) * 6).toFixed(1)); }
      else if (key === 'growth') { t = 200 + r() * 8800; x.push(Math.round(t)); y.push(+(0.6 * Math.exp(0.00032 * t) * Math.exp(normal(r) * 0.18)).toFixed(3)); }
      else { t = -100 + r() * 140; x.push(Math.round(t)); y.push(+(130 + 115 * Math.tanh((t + 35) / 18) + normal(r) * 9).toFixed(0)); }
    }
    return { x: x, y: y };
  }

  var api = {
    RUNGS: RUNGS, prepare: prepare, describe: describe, fitAll: fitAll, rank: rank, bestLinear: bestLinear, buildSpecs: buildSpecs, evaluate: evaluate,
    fitTransformed: fitTransformed, xLadder: xLadder, yLadder: yLadder, yLogit: yLogit, yBoxCox: yBoxCox,
    fitPoly: fitPoly, fitBoxCox: fitBoxCox, fitPowerX: fitPowerX, fitNLS: fitNLS, fitGLM: fitGLM, lm: lm,
    checks: checks, fUpper: fUpper, tTwoSided: tTwoSided, t975: t975, lgamma: lgamma, fmt: fmt, sample: sample, rng: rng
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BestFitCore = api;
})(typeof window !== 'undefined' ? window : this);

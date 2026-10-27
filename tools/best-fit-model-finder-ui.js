/* Best-Fit Model Finder: page controller. Data stays in the browser. */
(function () {
  'use strict';
  var C = window.BestFitCore;
  if (!C) return;
  var doc = document, NS = 'http://www.w3.org/2000/svg';
  function $(id) { return doc.getElementById(id); }
  var fmt = C.fmt;
  function fmtP(p) { return !isFinite(p) ? 'n/a' : p < 0.001 ? '< 0.001' : p.toFixed(3); }
  function num(v, d) { return isFinite(v) ? v.toFixed(d) : '–'; }
  function typeset(el) { if (el && window.UpskillMath && typeof window.UpskillMath.typeset === 'function') window.UpskillMath.typeset([el]); }

  var state = { dataset: null, workbook: null, result: null, selected: null, x: [], y: [] };

  /* ---------- loading ---------- */
  function status(text, isError) { var s = $('bfm-load-status'); s.textContent = text; s.className = 'bfm-note' + (isError ? ' bfm-error' : ''); }
  function setDataset(dataset, label) {
    state.dataset = dataset; state.result = null;
    var cols = dataset.columns, xs = $('bfm-x'), ys = $('bfm-y');
    xs.innerHTML = ''; ys.innerHTML = '';
    var numeric = cols.map(function (_, j) { return dataset.rows.filter(function (r) { return isFinite(GuidedData.number(r[j])); }).length; });
    cols.forEach(function (name, j) {
      [xs, ys].forEach(function (sel) { var o = doc.createElement('option'); o.value = String(j); o.textContent = name + (numeric[j] < dataset.rows.length ? ' (' + numeric[j] + ' numeric)' : ''); sel.appendChild(o); });
    });
    var numCols = cols.map(function (_, j) { return j; }).filter(function (j) { return numeric[j] > 0; });
    xs.value = String(numCols[0] != null ? numCols[0] : 0);
    ys.value = String(numCols[1] != null ? numCols[1] : Math.min(1, cols.length - 1));
    $('bfm-setup').hidden = false;
    $('results').hidden = true; $('detail').hidden = true;
    renderPreview();
    status(label + ': ' + dataset.rows.length + ' rows, ' + cols.length + ' columns.' + (dataset.notes && dataset.notes.length ? ' ' + dataset.notes.join(' ') : ''));
    refreshSummary();
  }
  function renderPreview() {
    var d = state.dataset, wrap = $('bfm-preview-wrap');
    var t = doc.createElement('table'); t.className = 'bfm-table';
    var cap = doc.createElement('caption'); cap.textContent = 'First ' + Math.min(8, d.rows.length) + ' rows'; t.appendChild(cap);
    var th = doc.createElement('thead'), tr = doc.createElement('tr');
    d.columns.forEach(function (c) { var h = doc.createElement('th'); h.scope = 'col'; h.textContent = c; tr.appendChild(h); });
    th.appendChild(tr); t.appendChild(th);
    var tb = doc.createElement('tbody');
    d.rows.slice(0, 8).forEach(function (r) { var row = doc.createElement('tr'); r.forEach(function (v) { var td = doc.createElement('td'); td.textContent = v; row.appendChild(td); }); tb.appendChild(row); });
    t.appendChild(tb);
    wrap.innerHTML = ''; wrap.appendChild(t);
  }
  function selectedPairs() {
    var d = state.dataset, xi = +$('bfm-x').value, yi = +$('bfm-y').value;
    return C.prepare(d.rows.map(function (r) { return GuidedData.number(r[xi]); }), d.rows.map(function (r) { return GuidedData.number(r[yi]); }));
  }
  function refreshSummary() {
    if (!state.dataset) return;
    var p = selectedPairs(), out = $('bfm-data-summary');
    if (p.x.length < 2) { out.textContent = 'Choose two numeric columns.'; return; }
    var info = C.describe(p.x, p.y);
    var bits = [p.x.length + ' complete pairs' + (p.dropped ? ' (' + p.dropped + ' rows skipped: blank or non-numeric)' : '') + '.',
      'x from ' + fmt(info.xMin) + ' to ' + fmt(info.xMax) + (isFinite(info.xRatio) ? ' (max/min ' + num(info.xRatio, 2) + ')' : ', includes zero or negatives') + '.',
      'y from ' + fmt(info.yMin) + ' to ' + fmt(info.yMax) + '.'];
    if (info.yUnit) bits.push('y lies between 0 and 1: choose "A proportion" if it is one.');
    else if (info.yPercent && $('bfm-ytype').value === 'continuous') bits.push('y lies between 0 and 100: choose "A percentage" if it is one.');
    if (info.yCounts) bits.push('y is whole numbers, so Poisson count models will be included.');
    out.textContent = bits.join(' ');
  }
  ['bfm-x', 'bfm-y', 'bfm-ytype'].forEach(function (id) { $(id).addEventListener('change', refreshSummary); });

  $('bfm-use-paste').addEventListener('click', function () {
    try {
      var text = $('bfm-paste').value;
      GuidedData.check(text.trim().length, 'Paste a table first, with a header row.');
      setDataset(GuidedData.create(GuidedData.parseDelimited(text), { name: 'Pasted table', source: 'Pasted table' }), 'Pasted table');
    } catch (e) { status(e.message, true); }
  });
  $('bfm-file').addEventListener('change', function () {
    var file = this.files && this.files[0];
    if (!file) return;
    if (file.size > GuidedData.limits.file) { status('Choose a file of at most 10 MB.', true); return; }
    status('Reading ' + file.name + '…');
    var isXlsx = /\.xlsx$/i.test(file.name);
    var reader = new FileReader();
    reader.onerror = function () { status('The file could not be read.', true); };
    reader.onload = function () {
      if (!isXlsx) {
        try { setDataset(GuidedData.create(GuidedData.parseDelimited(reader.result), { name: file.name, source: file.name }), file.name); }
        catch (e) { status(e.message, true); }
        return;
      }
      GuidedXlsx.open(reader.result).then(function (book) {
        state.workbook = { book: book, name: file.name };
        var sel = $('bfm-sheet'); sel.innerHTML = '';
        book.sheets.forEach(function (s, i) { var o = doc.createElement('option'); o.value = String(i); o.textContent = s.name + (s.hidden ? ' (hidden)' : ''); sel.appendChild(o); });
        $('bfm-sheet-row').hidden = book.sheets.length < 2;
        return loadSheet(0);
      }).catch(function (e) { status(e.message, true); });
    };
    if (isXlsx) reader.readAsArrayBuffer(file); else reader.readAsText(file);
  });
  function loadSheet(i) {
    var w = state.workbook;
    return w.book.sheet(i).then(function (parsed) {
      setDataset(GuidedData.create(parsed, { name: w.name, source: w.name }), w.name + ' — ' + w.book.sheets[i].name);
    }).catch(function (e) { status(e.message, true); });
  }
  $('bfm-sheet').addEventListener('change', function () { loadSheet(+this.value); });
  doc.querySelectorAll('[data-sample]').forEach(function (b) {
    b.addEventListener('click', function () {
      var key = b.getAttribute('data-sample'), s = C.sample(key);
      var head = { hallpetch: ['Grain size (µm)', 'Yield strength (MPa)'], growth: ['Tonnes since roll change', 'Defects per 100 pipes'], charpy: ['Test temperature (°C)', 'Charpy energy (J)'] }[key];
      var matrix = [head].concat(s.x.map(function (v, i) { return [String(v), String(s.y[i])]; }));
      setDataset(GuidedData.create({ matrix: matrix }, { name: b.textContent, source: 'Sample' }), 'Sample: ' + b.textContent + ' (fictitious)');
      $('bfm-temp').value = key === 'charpy' ? 'C' : '';
      $('bfm-ytype').value = 'continuous';
      run();
    });
  });

  /* ---------- fitting ---------- */
  function run() {
    var p = selectedPairs();
    var yType = $('bfm-ytype').value;
    var opts = { xOffset: +$('bfm-offset').value || 0, yScale: yType === 'unit' ? 1 : yType === 'percent' ? 100 : null, tempUnit: $('bfm-temp').value || null, folds: +$('bfm-folds').value };
    opts.cv = opts.folds > 0;
    var st = $('bfm-run-status'), btn = $('bfm-run');
    st.className = 'bfm-note'; st.textContent = 'Fitting all models…'; btn.disabled = true;
    setTimeout(function () {
      try {
        var t0 = Date.now();
        state.x = p.x; state.y = p.y;
        state.result = C.fitAll(p.x, p.y, opts);
        st.textContent = 'Fitted ' + state.result.models.length + ' models in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s.';
        $('results').hidden = false;
        renderSummary(); renderBoard();
        select(C.rank(state.result.models, $('bfm-rankby').value)[0].id);
      } catch (e) { st.className = 'bfm-note bfm-error'; st.textContent = e.message; }
      btn.disabled = false;
    }, 20);
  }
  $('bfm-run').addEventListener('click', run);

  function nameOf(m) { return m ? m.name : 'none'; }
  function renderSummary() {
    var s = state.result.summary, box = $('bfm-summary');
    box.innerHTML = '';
    var c = doc.createElement('div'); c.className = 'bfm-callout' + (s.best && s.best.passes ? ' is-good' : '');
    var p = doc.createElement('p'); p.style.margin = '0';
    var strong = doc.createElement('strong'); strong.textContent = 'Best by AICc: ' + nameOf(s.best) + '.';
    p.appendChild(strong);
    var rest = [];
    if (s.bestPassing && s.bestPassing !== s.best) rest.push('Best that passes both residual checks: ' + s.bestPassing.name + '.');
    if (!s.bestPassing) rest.push('No comparable model passes both residual checks; look at the shape again or consider an offset.');
    if (s.ties.length > 1) rest.push(s.ties.length + ' models are within ΔAICc 2 of the best and fit about equally well; the simplest of them is ' + s.simplest.name + '.');
    if (s.cvBest) rest.push('Lowest cross-validated RMSE: ' + s.cvBest.name + '.');
    p.appendChild(doc.createTextNode(' ' + rest.join(' ')));
    c.appendChild(p);
    if (s.warnings.length) {
      var ul = doc.createElement('ul');
      s.warnings.forEach(function (w) { var li = doc.createElement('li'); li.textContent = w; ul.appendChild(li); });
      c.appendChild(ul);
    }
    box.appendChild(c);
  }

  function boardModels() {
    var by = $('bfm-rankby').value, filter = $('bfm-filter').value, list = C.rank(state.result.models, by);
    if (filter === 'passing') list = list.filter(function (m) { return m.passes; });
    if (filter === 'named') list = list.filter(function (m) { return m.family !== 'Ladder' || /^[A-Z]/.test(m.name); });
    if (filter === 'top') list = list.slice(0, 25);
    return list;
  }
  function tag(text, good) { var s = doc.createElement('span'); s.className = 'bfm-tag ' + (good ? 'is-good' : 'is-bad'); s.textContent = (good ? '✓ ' : '✕ ') + text; return s; }
  function renderBoard() {
    if (!state.result) return;
    var body = $('bfm-board').querySelector('tbody'); body.innerHTML = '';
    boardModels().forEach(function (m, i) {
      var tr = doc.createElement('tr'); tr.dataset.id = m.id;
      if (state.selected && state.selected.id === m.id) tr.className = 'is-selected';
      var cells = [String(i + 1), m.name, m.family, String(m.k), m.comparable ? num(m.aicc, 2) : num(m.aicc, 2) + '*', m.comparable ? num(m.delta, 2) : '–', m.comparable ? num(m.weight, 3) : '–', num(m.r2, 4), isFinite(m.cvRmse) ? fmt(m.cvRmse) : '–'];
      cells.forEach(function (v, j) {
        var td = doc.createElement(j === 1 ? 'th' : 'td');
        if (j === 1) td.scope = 'row';
        if (j === 0 || j >= 3) td.className = 'bfm-num';
        td.textContent = v; tr.appendChild(td);
      });
      var checks = doc.createElement('td');
      checks.appendChild(tag('shape', !m.curved));
      checks.appendChild(tag('spread', !m.funnel));
      tr.appendChild(checks);
      var act = doc.createElement('td'), b = doc.createElement('button');
      b.type = 'button'; b.className = 'bfm-pick'; b.textContent = 'View';
      b.setAttribute('aria-label', 'View ' + m.name);
      b.setAttribute('aria-pressed', state.selected && state.selected.id === m.id ? 'true' : 'false');
      b.addEventListener('click', function () { select(m.id); $('detail').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      act.appendChild(b); tr.appendChild(act);
      body.appendChild(tr);
    });
    if (!body.children.length) { var tr2 = doc.createElement('tr'), td2 = doc.createElement('td'); td2.colSpan = 11; td2.textContent = 'No models match this filter.'; tr2.appendChild(td2); body.appendChild(tr2); }
    var sk = state.result.skipped, ul = $('bfm-skipped'); ul.innerHTML = '';
    $('bfm-skipped-sum').textContent = 'Models that could not be fitted (' + sk.length + ')';
    sk.forEach(function (m) { var li = doc.createElement('li'); li.textContent = m.name + ': ' + m.skip + '.'; ul.appendChild(li); });
  }
  $('bfm-rankby').addEventListener('change', renderBoard);
  $('bfm-filter').addEventListener('change', renderBoard);

  /* ---------- plots ---------- */
  function el(name, attrs, parent) { var e = doc.createElementNS(NS, name); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function niceTicks(min, max, count) {
    if (!isFinite(min) || !isFinite(max)) { min = 0; max = 1; }
    if (min === max) { var d = Math.abs(min) * 0.1 || 1; min -= d; max += d; }
    var step0 = (max - min) / count, mag = Math.pow(10, Math.floor(Math.log10(step0))), err = step0 / mag;
    var step = err >= 7.5 ? 10 * mag : err >= 3.5 ? 5 * mag : err >= 1.5 ? 2 * mag : mag;
    var lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, t = [];
    for (var v = lo; v <= hi + step * 1e-6; v += step) t.push(Math.abs(v) < step * 1e-9 ? 0 : parseFloat(v.toPrecision(12)));
    return { lo: lo, hi: hi, ticks: t };
  }
  function extent(a) { var lo = Infinity, hi = -Infinity; a.forEach(function (v) { if (isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; } }); return [lo, hi]; }
  function plot(svg, o) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var vb = (svg.getAttribute('viewBox') || '0 0 380 280').split(/[\s,]+/).map(Number), W = vb[2], H = vb[3];
    var m = { l: 56, r: 12, t: 12, b: 42 }, ex = extent(o.xs), ey = extent(o.ys);
    if (o.zero) ey = [Math.min(ey[0], 0), Math.max(ey[1], 0)];
    var tx = niceTicks(ex[0], ex[1], 4), ty = niceTicks(ey[0], ey[1], 4);
    var sx = function (v) { return m.l + (v - tx.lo) / (tx.hi - tx.lo) * (W - m.l - m.r); };
    var sy = function (v) { return H - m.b - (v - ty.lo) / (ty.hi - ty.lo) * (H - m.t - m.b); };
    ty.ticks.forEach(function (t) { el('line', { 'class': 'bfm-gridline', x1: m.l, x2: W - m.r, y1: sy(t), y2: sy(t) }, svg); el('text', { 'class': 'bfm-tick', x: m.l - 5, y: sy(t) + 3, 'text-anchor': 'end' }, svg).textContent = fmt(t); });
    tx.ticks.forEach(function (t) { el('line', { 'class': 'bfm-gridline', y1: m.t, y2: H - m.b, x1: sx(t), x2: sx(t) }, svg); el('text', { 'class': 'bfm-tick', x: sx(t), y: H - m.b + 13, 'text-anchor': 'middle' }, svg).textContent = fmt(t); });
    el('line', { 'class': 'bfm-axis', x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }, svg);
    el('line', { 'class': 'bfm-axis', x1: m.l, x2: m.l, y1: m.t, y2: H - m.b }, svg);
    if (o.zero) el('line', { 'class': 'bfm-zero', x1: m.l, x2: W - m.r, y1: sy(0), y2: sy(0) }, svg);
    (o.curves || []).forEach(function (c) {
      var d = '', pen = false;
      c.pts.forEach(function (p) {
        if (!isFinite(p[1]) || p[1] < ty.lo || p[1] > ty.hi) { pen = false; return; }
        d += (pen ? 'L' : 'M') + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1) + ' '; pen = true;
      });
      if (d) el('path', { 'class': c.cls, d: d }, svg);
    });
    var step = Math.max(1, Math.ceil(o.xs.length / 3000));
    for (var i = 0; i < o.xs.length; i += step) if (isFinite(o.xs[i]) && isFinite(o.ys[i])) el('circle', { 'class': 'bfm-pt', cx: sx(o.xs[i]).toFixed(1), cy: sy(o.ys[i]).toFixed(1), r: 3 }, svg);
    if (o.xLabel) el('text', { 'class': 'bfm-axlabel', x: (m.l + W - m.r) / 2, y: H - 5, 'text-anchor': 'middle' }, svg).textContent = o.xLabel;
    if (o.yLabel) el('text', { 'class': 'bfm-axlabel', x: 0, y: 0, 'text-anchor': 'middle', transform: 'translate(12,' + ((m.t + H - m.b) / 2) + ') rotate(-90)' }, svg).textContent = o.yLabel;
  }
  function curveOf(m, lo, hi) { var pts = []; for (var i = 0; i <= 200; i++) { var x = lo + (hi - lo) * i / 200; pts.push([x, m.predict(x)]); } return pts; }

  /* ---------- detail ---------- */
  function select(id) {
    var m = state.result.models.filter(function (q) { return q.id === id; })[0];
    if (!m) return;
    state.selected = m;
    renderBoard();
    $('detail').hidden = false;
    $('bfm-detail-name').textContent = m.name;
    $('bfm-detail-note').textContent = m.family + ' · ' + m.note;
    $('bfm-detail-eq').textContent = m.equation;
    $('bfm-detail-back').textContent = [m.back ? 'On the original scale: ' + m.back : '', m.extra || ''].filter(Boolean).join(' · ');
    var d = state.dataset, xName = d.columns[+$('bfm-x').value], yName = d.columns[+$('bfm-y').value];
    var ex = extent(state.x), ranked = C.rank(state.result.models, $('bfm-rankby').value).filter(function (q) { return q.id !== m.id; }).slice(0, 2);
    var curves = ranked.map(function (q) { return { cls: 'bfm-altline', pts: curveOf(q, ex[0], ex[1]) }; });
    curves.push({ cls: 'bfm-fitline', pts: curveOf(m, ex[0], ex[1]) });
    plot($('bfm-plot-fit'), { xs: state.x, ys: state.y, curves: curves, xLabel: xName, yLabel: yName });
    $('bfm-plot-fit').setAttribute('aria-label', 'Data with ' + m.name + ' drawn as a solid curve and the next two models dashed.');
    var fs = m.fitScale;
    plot($('bfm-plot-resid'), { xs: fs.fit, ys: fs.res, zero: true, xLabel: 'Fitted value', yLabel: fs.glm ? 'Pearson residual' : 'Residual' });
    $('bfm-plot-resid').setAttribute('aria-label', 'Residuals against fitted values. Curvature check p ' + fmtP(m.curvP) + ', spread check p ' + fmtP(m.spreadP) + '.');
    if (m.linearized) {
      var eu = extent(fs.u), line = [];
      for (var i = 0; i <= 60; i++) { var u = eu[0] + (eu[1] - eu[0]) * i / 60; line.push(u); }
      var reg = fitLine(fs.u, fs.v);
      plot($('bfm-plot-scale'), { xs: fs.u, ys: fs.v, curves: [{ cls: 'bfm-fitline', pts: line.map(function (u) { return [u, reg.a + reg.b * u]; }) }], xLabel: fs.xLabel, yLabel: fs.yLabel });
      $('bfm-scale-cap').textContent = 'Fitting scale: ' + fs.yLabel + ' vs ' + fs.xLabel;
    } else {
      plot($('bfm-plot-scale'), { xs: state.x, ys: fs.res, zero: true, xLabel: xName, yLabel: 'Residual' });
      $('bfm-scale-cap').textContent = 'Residuals vs x';
    }
    var stats = [['AICc', m.comparable ? num(m.aicc, 2) : num(m.aicc, 2) + ' (not comparable)'], ['ΔAICc · weight', m.comparable ? num(m.delta, 2) + ' · ' + num(m.weight, 3) : '–'],
      ['R² on y', num(m.r2, 4)], ['RMSE on y', fmt(m.rmse)], ['CV RMSE', isFinite(m.cvRmse) ? fmt(m.cvRmse) : '–'],
      ['Curvature check', 'p ' + fmtP(m.curvP) + (m.curved ? ' ✕' : ' ✓')], ['Spread check', 'p ' + fmtP(m.spreadP) + (m.funnel ? ' ✕' : ' ✓')], ['Parameters k', String(m.k)]];
    var dl = $('bfm-detail-stats'); dl.innerHTML = '';
    stats.forEach(function (s) { var w = doc.createElement('div'); w.className = 'bfm-stat'; var dt = doc.createElement('dt'); dt.textContent = s[0]; var dd = doc.createElement('dd'); dd.textContent = s[1]; w.appendChild(dt); w.appendChild(dd); dl.appendChild(w); });
    var pb = $('bfm-params'); pb.innerHTML = '';
    m.params.forEach(function (p) {
      var tr = doc.createElement('tr'), a = doc.createElement('th'); a.scope = 'row'; a.textContent = p.name;
      var b = doc.createElement('td'); b.className = 'bfm-num'; b.textContent = fmt(p.value);
      var c = doc.createElement('td'); c.className = 'bfm-num'; c.textContent = isFinite(p.se) ? fmt(p.se) : '–';
      tr.appendChild(a); tr.appendChild(b); tr.appendChild(c); pb.appendChild(tr);
    });
    var fl = $('bfm-detail-flags'); fl.innerHTML = '';
    if (m.flags.length) { var c2 = doc.createElement('div'); c2.className = 'bfm-callout'; c2.textContent = 'Watch: ' + m.flags.join('; ') + '.'; fl.appendChild(c2); }
    $('bfm-x0').value = String(parseFloat(((ex[0] + ex[1]) / 2).toPrecision(4)));
    predict();
  }
  function fitLine(u, v) {
    var n = u.length, mu = 0, mv = 0; for (var i = 0; i < n; i++) { mu += u[i]; mv += v[i]; } mu /= n; mv /= n;
    var sxx = 0, sxy = 0; for (var j = 0; j < n; j++) { sxx += (u[j] - mu) * (u[j] - mu); sxy += (u[j] - mu) * (v[j] - mv); }
    var b = sxy / sxx; return { a: mv - b * mu, b: b };
  }
  function predict() {
    var m = state.selected, x0 = parseFloat($('bfm-x0').value), out = $('bfm-pred-out');
    out.innerHTML = '';
    if (!m || !isFinite(x0)) return;
    var ex = extent(state.x), med = m.predict(x0), mean = m.predictMean(x0), iv = m.interval(x0);
    var differs = isFinite(mean) && Math.abs(mean - med) > 1e-9 * Math.max(1, Math.abs(med));
    var rows = differs ? [['Median (back-transform)', fmt(med)], ['Mean (smearing)', fmt(mean)]] : [['Prediction (mean)', fmt(med)]];
    rows.push(['95% prediction interval', isFinite(iv[0]) && isFinite(iv[1]) ? fmt(iv[0]) + ' to ' + fmt(iv[1]) : 'n/a']);
    if (x0 < ex[0] || x0 > ex[1]) rows.push(['Warning', 'x is outside the data range (' + fmt(ex[0]) + ' to ' + fmt(ex[1]) + '): this is an extrapolation']);
    rows.forEach(function (s) { var w = doc.createElement('div'); w.className = 'bfm-stat'; var dt = doc.createElement('dt'); dt.textContent = s[0]; var dd = doc.createElement('dd'); dd.textContent = s[1]; w.appendChild(dt); w.appendChild(dd); out.appendChild(w); });
  }
  $('bfm-predict').addEventListener('click', predict);
  $('bfm-x0').addEventListener('keydown', function (e) { if (e.key === 'Enter') predict(); });

  /* ---------- export ---------- */
  function csvCell(v) { var s = String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function download(name, rows) {
    var text = rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    var blob = new Blob([text], { type: 'text/csv' }), a = doc.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; doc.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  $('bfm-dl-board').addEventListener('click', function () {
    if (!state.result) return;
    var rows = [['rank', 'model', 'family', 'k', 'AICc', 'delta_AICc', 'akaike_weight', 'R2_original_y', 'RMSE_original_y', 'CV_RMSE', 'curvature_p', 'spread_p', 'passes_checks', 'equation']];
    C.rank(state.result.models, $('bfm-rankby').value).forEach(function (m, i) {
      rows.push([i + 1, m.name, m.family, m.k, m.aicc, m.comparable ? m.delta : '', m.comparable ? m.weight : '', m.r2, m.rmse, m.cvRmse, m.curvP, m.spreadP, m.passes, m.equation]);
    });
    download('best-fit-leaderboard.csv', rows);
  });
  $('bfm-dl-fit').addEventListener('click', function () {
    var m = state.selected; if (!m) return;
    var rows = [['x', 'y', 'prediction', 'residual_original_scale']];
    state.x.forEach(function (x, i) { var p = m.predict(x); rows.push([x, state.y[i], p, state.y[i] - p]); });
    download('best-fit-' + m.id.replace(/[^a-z0-9.-]+/gi, '-') + '.csv', rows);
  });

  window.BestFitUI = { state: function () { return state; }, run: run, select: select };
})();

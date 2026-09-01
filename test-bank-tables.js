/* test-bank-tables.js
 * Reference Tables panel for the exam simulator (the "Tables" toolbar button,
 * alongside Formulas and Calc). Implements the "Quick Lookup" design: pick a
 * category, enter the lookup keys (df/alpha, n/P, etc.), the matching row/
 * column/cell is scrolled to and highlighted, with the full table still
 * browsable underneath.
 *
 * Data files are fetched lazily (one per category, on first open) from
 * /reference-tables/*.json and cached in memory for the rest of the session.
 * All table values were computed programmatically (scipy) and independently
 * validated -- see /reference-tables/*.json "source" fields for method notes
 * on each table.
 */
(function () {
  'use strict';

  var CACHE = {};

  /* ---------------------------------------------------------------------
   * Registry: one entry per table. `shape` selects which generic renderer
   * handles it. `keys` describes the lookup inputs shown in the Find bar.
   * ------------------------------------------------------------------- */
  var REGISTRY = [
    {
      id: 'z', label: 'Standard Normal (Z)', category: 'Distributions',
      file: 'z_table.json', shape: 'z',
      keys: [{ id: 'z', label: 'z value', type: 'number', step: '0.01', placeholder: 'e.g. 1.65' }]
    },
    {
      id: 't', label: "Student's t", category: 'Distributions',
      file: 't_table.json', shape: 'keyedGrid',
      rowField: 'df', rowLabel: 'Degrees of freedom (df)',
      colField: 'alpha', colLabel: 'Alpha (one-tail)', colsPath: 'alpha_columns',
      keys: [
        { id: 'df', label: 'df', type: 'number', placeholder: 'e.g. 14' },
        { id: 'alpha', label: 'Alpha', type: 'select', optionsPath: 'alpha_columns' }
      ]
    },
    {
      id: 'chi_square', label: 'Chi-Square', category: 'Distributions',
      file: 'chisquare_table.json', shape: 'keyedGrid',
      rowField: 'df', rowLabel: 'Degrees of freedom (df)',
      colField: 'alpha', colLabel: 'Alpha', colsPath: 'alpha_columns',
      keys: [
        { id: 'df', label: 'df', type: 'number', placeholder: 'e.g. 9' },
        { id: 'alpha', label: 'Alpha', type: 'select', optionsPath: 'alpha_columns' }
      ]
    },
    {
      id: 'f', label: 'F Distribution', category: 'Distributions',
      file: 'f_tables.json', shape: 'matrix', tablesPath: 'tables',
      rowField: 'v2', rowLabel: 'Denominator df (v\u2082)',
      colField: 'v1', colLabel: 'Numerator df (v\u2081)', colsPath: 'v1_columns',
      alphaLabel: 'Alpha', alphaOptions: ['0.01', '0.025', '0.05', '0.10', '0.90', '0.95', '0.975', '0.99'],
      keys: [
        { id: 'alpha', label: 'Alpha', type: 'select', staticOptions: ['0.01', '0.025', '0.05', '0.10', '0.90', '0.95', '0.975', '0.99'] },
        { id: 'v1', label: 'Numerator df', type: 'number', placeholder: 'e.g. 4' },
        { id: 'v2', label: 'Denominator df', type: 'number', placeholder: 'e.g. 20' }
      ]
    },
    {
      id: 'binomial_pmf', label: 'Binomial (PMF)', category: 'Discrete',
      file: 'binomial_tables.json', shape: 'nx', dataPath: 'pmf',
      colField: 'p', colLabel: 'p', colsPath: 'pmf.p_columns',
      keys: [
        { id: 'n', label: 'n', type: 'number', placeholder: 'e.g. 10' },
        { id: 'x', label: 'x', type: 'number', placeholder: 'e.g. 3' },
        { id: 'p', label: 'p', type: 'select', optionsPath: 'pmf.p_columns' }
      ]
    },
    {
      id: 'binomial_cmf', label: 'Binomial (Cumulative)', category: 'Discrete',
      file: 'binomial_tables.json', shape: 'nx', dataPath: 'cmf',
      colField: 'p', colLabel: 'p', colsPath: 'cmf.p_columns',
      keys: [
        { id: 'n', label: 'n', type: 'number', placeholder: 'e.g. 10' },
        { id: 'x', label: 'x', type: 'number', placeholder: 'e.g. 3' },
        { id: 'p', label: 'p', type: 'select', optionsPath: 'cmf.p_columns' }
      ]
    },
    {
      id: 'poisson_pmf', label: 'Poisson (PMF)', category: 'Discrete',
      file: 'poisson_tables.json', shape: 'xOnly', dataPath: 'pmf',
      colField: 'lambda', colLabel: '\u03bb', colsPath: 'pmf.lambda_columns',
      keys: [
        { id: 'x', label: 'x', type: 'number', placeholder: 'e.g. 4' },
        { id: 'lambda', label: 'Lambda (\u03bb)', type: 'select', optionsPath: 'pmf.lambda_columns' }
      ]
    },
    {
      id: 'poisson_cmf', label: 'Poisson (Cumulative)', category: 'Discrete',
      file: 'poisson_tables.json', shape: 'xOnly', dataPath: 'cmf',
      colField: 'lambda', colLabel: '\u03bb', colsPath: 'cmf.lambda_columns',
      keys: [
        { id: 'x', label: 'x', type: 'number', placeholder: 'e.g. 4' },
        { id: 'lambda', label: 'Lambda (\u03bb)', type: 'select', optionsPath: 'cmf.lambda_columns' }
      ]
    },
    {
      id: 'exponential', label: 'Exponential', category: 'Distributions',
      file: 'exponential_table.json', shape: 'exponential',
      keys: [{ id: 'x', label: 'X', type: 'number', step: '0.1', placeholder: 'e.g. 1.5' }]
    },
    {
      id: 'studentized_range', label: 'Studentized Range (Tukey q)', category: 'DOE & Comparisons',
      file: 'studentized_range_table.json', shape: 'matrix', tablesPath: 'tables',
      rowField: 'df', rowLabel: 'Error df',
      colField: 'k', colLabel: 'k (# of groups)', colsPath: 'k_columns',
      keys: [
        { id: 'alpha', label: 'Alpha', type: 'select', staticOptions: ['0.1', '0.05', '0.025', '0.01', '0.005', '0.001'] },
        { id: 'k', label: 'k (# groups)', type: 'number', placeholder: 'e.g. 4' },
        { id: 'df', label: 'Error df', type: 'number', placeholder: 'e.g. 20' }
      ]
    },
    {
      id: 'duncan', label: "Duncan's Multiple Range", category: 'DOE & Comparisons',
      file: 'duncan_multiple_range_table.json', shape: 'matrix', tablesPath: 'tables',
      rowField: 'df', rowLabel: 'Error df',
      colField: 'p', colLabel: 'p (# of means)', colsPath: 'p_columns',
      keys: [
        { id: 'alpha', label: 'Alpha', type: 'select', staticOptions: ['0.1', '0.05', '0.025', '0.01', '0.005', '0.001'] },
        { id: 'p', label: 'p (# means)', type: 'number', placeholder: 'e.g. 4' },
        { id: 'df', label: 'Error df', type: 'number', placeholder: 'e.g. 20' }
      ]
    },
    {
      id: 'control_chart', label: 'Control Chart Constants', category: 'Process & Reliability',
      file: 'control_chart_constants_table.json', shape: 'flatRow', rowField: 'n',
      keys: [{ id: 'n', label: 'Subgroup size (n)', type: 'number', placeholder: 'e.g. 5' }]
    },
    {
      id: 'sigma_level', label: 'Sigma Level / DPMO', category: 'Process & Reliability',
      file: 'sigma_level_table.json', shape: 'sigma',
      keys: [{ id: 'sigma', label: 'Sigma level', type: 'number', step: '0.1', placeholder: 'e.g. 4.5' }]
    },
    {
      id: 'median_ranks', label: 'Median Ranks', category: 'Process & Reliability',
      file: 'median_ranks_table.json', shape: 'iOfN',
      keys: [
        { id: 'i', label: 'Rank order (i)', type: 'number', placeholder: 'e.g. 3' },
        { id: 'n', label: 'Sample size (n)', type: 'number', placeholder: 'e.g. 10' }
      ]
    },
    {
      id: 'normal_scores', label: 'Normal Scores', category: 'Process & Reliability',
      file: 'normal_scores_table.json', shape: 'iOfN',
      keys: [
        { id: 'i', label: 'Rank order (i)', type: 'number', placeholder: 'e.g. 3' },
        { id: 'n', label: 'Sample size (n)', type: 'number', placeholder: 'e.g. 10' }
      ]
    },
    {
      id: 'tolerance_one', label: 'Tolerance Factors (One-Sided)', category: 'Process & Reliability',
      file: 'tolerance_factors_table.json', shape: 'toleranceFactors', side: 'one_sided',
      keys: [
        { id: 'gamma', label: 'Confidence (\u03b3)', type: 'select', staticOptions: ['0.9', '0.95', '0.99'] },
        { id: 'P', label: 'Proportion (P)', type: 'select', staticOptions: ['0.9', '0.95', '0.99', '0.999'] },
        { id: 'n', label: 'Sample size (n)', type: 'number', placeholder: 'e.g. 25' }
      ]
    },
    {
      id: 'tolerance_two', label: 'Tolerance Factors (Two-Sided)', category: 'Process & Reliability',
      file: 'tolerance_factors_table.json', shape: 'toleranceFactors', side: 'two_sided',
      keys: [
        { id: 'gamma', label: 'Confidence (\u03b3)', type: 'select', staticOptions: ['0.9', '0.95', '0.99'] },
        { id: 'P', label: 'Proportion (P)', type: 'select', staticOptions: ['0.9', '0.95', '0.99', '0.999'] },
        { id: 'n', label: 'Sample size (n)', type: 'number', placeholder: 'e.g. 25' }
      ]
    },
    {
      id: 'random_numbers', label: 'Random Number Table', category: 'Sampling',
      file: 'random_number_table.json', shape: 'randomTable',
      keys: []
    }
  ];

  var CATEGORY_ORDER = ['Distributions', 'Discrete', 'DOE & Comparisons', 'Process & Reliability', 'Sampling'];

  function byId(id) { for (var i = 0; i < REGISTRY.length; i++) { if (REGISTRY[i].id === id) return REGISTRY[i]; } return null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function getPath(obj, path) {
    var parts = path.split('.'); var cur = obj;
    for (var i = 0; i < parts.length; i++) { if (cur == null) return null; cur = cur[parts[i]]; }
    return cur;
  }

  function loadTable(entry, cb) {
    if (CACHE[entry.file]) { cb(CACHE[entry.file]); return; }
    fetch('/reference-tables/' + entry.file)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) { CACHE[entry.file] = data; cb(data); })
      .catch(function (err) {
        cb(null, err);
      });
  }

  /* ---------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------- */
  var state = { activeId: 'z', lastResult: null };

  /* ---------------------------------------------------------------------
   * Rendering: shell (category chips + key inputs + result area)
   * ------------------------------------------------------------------- */
  function renderCategoryChips() {
    var byCat = {};
    REGISTRY.forEach(function (e) { (byCat[e.category] = byCat[e.category] || []).push(e); });
    return CATEGORY_ORDER.map(function (cat) {
      if (!byCat[cat]) return '';
      return byCat[cat].map(function (e) {
        return '<button type="button" class="tb-tbl-chip' + (e.id === state.activeId ? ' active' : '') + '" data-tbl-select="' + e.id + '">' + esc(e.label) + '</button>';
      }).join('');
    }).join('');
  }

  function renderKeyInputs(entry, data) {
    if (!entry.keys.length) return '';
    var fields = entry.keys.map(function (k) {
      if (k.type === 'select') {
        var opts = k.staticOptions || (data ? (getPath(data, k.optionsPath) || []) : []);
        return '<div class="tb-tbl-field"><label>' + esc(k.label) + '</label><select data-tbl-key="' + k.id + '">' +
          opts.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') +
          '</select></div>';
      }
      return '<div class="tb-tbl-field"><label>' + esc(k.label) + '</label><input type="number" ' +
        (k.step ? 'step="' + k.step + '" ' : '') + 'placeholder="' + esc(k.placeholder || '') + '" data-tbl-key="' + k.id + '"></div>';
    }).join('');
    return '<div class="tb-tbl-lookupbar">' + fields +
      '<button type="button" class="tb-tbl-find" data-tbl-find>Find</button>' +
      '<div class="tb-tbl-result" data-tbl-result></div></div>';
  }

  function renderShell() {
    var entry = byId(state.activeId);
    return '' +
      '<div class="tb-tbl-chiprow">' + renderCategoryChips() + '</div>' +
      '<div class="tb-tbl-body" data-tbl-body>' +
      '<p class="tb-tbl-loading">Loading ' + esc(entry.label) + '\u2026</p>' +
      '</div>';
  }

  /* ---------------------------------------------------------------------
   * Per-shape table body renderers. Each returns HTML for the lookup bar
   * + scrollable table, and each defines how to find + highlight a match.
   * ------------------------------------------------------------------- */
  var SHAPES = {

    z: {
      formula: function () { return '\u03a6(z) = Pr(Z &lt; z)'; },
      table: function (data) {
        var rows = data.negative_z.slice().reverse().concat(data.positive_z);
        var cols = data.column_offsets;
        var head = '<tr><th class="tbl-corner">z</th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        var body = rows.map(function (r) {
          return '<tr data-row="' + r.z + '"><th>' + r.z.toFixed(1) + '</th>' +
            cols.map(function (c) { return '<td data-col="' + c + '">' + r.values[c].toFixed(4) + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params) {
        var z = parseFloat(params.z);
        if (isNaN(z)) return null;
        var rounded = Math.round(z * 100) / 100;
        var base = Math.trunc(rounded * 10) / 10;
        var off = Math.round((rounded - base) * 100) / 100;
        if (off < 0) { off = Math.round((0.1 + off) * 100) / 100; base = Math.round((base - 0.1) * 10) / 10; }
        var offKey = off.toFixed(2);
        var rowKey = Math.sign(z) < 0 ? -Math.abs(base) : Math.abs(base);
        var pool = z < 0 ? data.negative_z : data.positive_z;
        var row = pool.filter(function (r) { return Math.abs(r.z - Math.abs(base)) < 1e-9; })[0];
        if (!row) return null;
        var value = row.values[offKey];
        return { rowKey: (z < 0 ? -Math.abs(row.z) : row.z), colKey: offKey, value: value, label: '\u03a6(' + z + ') \u2248 ' + value.toFixed(4) };
      }
    },

    keyedGrid: {
      formula: function (entry, data) { return getPath(data, 'formula') ? esc(getPath(data, 'formula')) : ''; },
      table: function (data, entry) {
        var cols = getPath(data, entry.colsPath);
        var head = '<tr><th class="tbl-corner">' + esc(entry.rowLabel) + '</th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        var body = data.rows.map(function (r) {
          return '<tr data-row="' + r[entry.rowField] + '"><th>' + r[entry.rowField] + '</th>' +
            cols.map(function (c) { return '<td data-col="' + c + '">' + r.values[c] + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params, entry) {
        var target = parseInt(params[entry.rowField], 10);
        if (isNaN(target)) return null;
        var rows = data.rows;
        var best = null;
        for (var i = 0; i < rows.length; i++) {
          var rv = rows[i][entry.rowField] === 'inf' ? Infinity : rows[i][entry.rowField];
          if (rv >= target || rv === Infinity) { best = rows[i]; break; }
        }
        if (!best) best = rows[rows.length - 1];
        var alpha = params[entry.colField];
        var value = best.values[alpha];
        return { rowKey: best[entry.rowField], colKey: alpha, value: value, label: entry.label + '(' + alpha + ', df=' + best[entry.rowField] + ') = ' + value };
      }
    },

    matrix: {
      formula: function (entry, data) { return ''; },
      table: function (data, entry, params) {
        var alpha = params.alpha || Object.keys(getPath(data, entry.tablesPath))[0];
        var t = getPath(data, entry.tablesPath)[alpha];
        if (!t) return '<tbody><tr><td>No table for that alpha.</td></tr></tbody>';
        var cols = getPath(t, entry.colField === 'v1' ? 'v1_columns' : (entry.colsPath.indexOf('.') >= 0 ? entry.colsPath.split('.').pop() : entry.colsPath));
        cols = t[entry.colsPath] || t.k_columns || t.p_columns || t.v1_columns;
        var head = '<tr><th class="tbl-corner">' + esc(entry.rowLabel) + ' \\ ' + esc(entry.colLabel) + '</th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        var body = t.rows.map(function (r) {
          return '<tr data-row="' + r[entry.rowField] + '"><th>' + r[entry.rowField] + '</th>' +
            cols.map(function (c) { return '<td data-col="' + c + '">' + r.values[c] + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params, entry) {
        var alpha = params.alpha;
        var t = getPath(data, entry.tablesPath)[alpha];
        if (!t) return null;
        var targetRow = parseInt(params[entry.rowField], 10);
        var targetCol = String(parseInt(params[entry.colField], 10));
        var rows = t.rows, best = null;
        for (var i = 0; i < rows.length; i++) {
          var rv = rows[i][entry.rowField] === 'inf' ? Infinity : rows[i][entry.rowField];
          if (rv >= targetRow || rv === Infinity) { best = rows[i]; break; }
        }
        if (!best) best = rows[rows.length - 1];
        var cols = t[entry.colsPath] || t.k_columns || t.p_columns || t.v1_columns;
        var colKey = cols.indexOf(targetCol) >= 0 ? targetCol : cols[cols.length - 1];
        var value = best.values[colKey];
        return { rowKey: best[entry.rowField], colKey: colKey, value: value, label: entry.label + ' = ' + value + ' (df=' + best[entry.rowField] + ', ' + entry.colLabel + '=' + colKey + ')' };
      }
    },

    nx: {
      formula: function (entry, data) { return esc(getPath(data, entry.dataPath + '.formula') || ''); },
      table: function (data, entry) {
        var d = getPath(data, entry.dataPath);
        var cols = d.p_columns;
        var head = '<tr><th class="tbl-corner">n</th><th>x</th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        var body = d.rows.map(function (r) {
          return '<tr data-row="' + r.n + '_' + r.x + '"><th>' + r.n + '</th><th>' + r.x + '</th>' +
            cols.map(function (c) { return '<td data-col="' + c + '">' + r.values[c] + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params, entry) {
        var d = getPath(data, entry.dataPath);
        var n = parseInt(params.n, 10), x = parseInt(params.x, 10), p = params.p;
        var row = d.rows.filter(function (r) { return r.n === n && r.x === x; })[0];
        if (!row) return null;
        var value = row.values[p];
        return { rowKey: n + '_' + x, colKey: p, value: value, label: 'n=' + n + ', x=' + x + ', p=' + p + ' \u2192 ' + value };
      }
    },

    xOnly: {
      formula: function (entry, data) { return esc(getPath(data, entry.dataPath + '.formula') || ''); },
      table: function (data, entry) {
        var d = getPath(data, entry.dataPath);
        var cols = d.lambda_columns;
        var head = '<tr><th class="tbl-corner">x</th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        var body = d.rows.map(function (r) {
          return '<tr data-row="' + r.x + '"><th>' + r.x + '</th>' +
            cols.map(function (c) { return '<td data-col="' + c + '">' + r.values[c] + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params, entry) {
        var d = getPath(data, entry.dataPath);
        var x = parseInt(params.x, 10), lam = params.lambda;
        var row = d.rows.filter(function (r) { return r.x === x; })[0];
        if (!row) return null;
        var value = row.values[lam];
        return { rowKey: x, colKey: lam, value: value, label: 'x=' + x + ', \u03bb=' + lam + ' \u2192 ' + value };
      }
    },

    exponential: {
      formula: function () { return 'Area left of X = 1 \u2212 e<sup>\u2212X</sup>; Area right of X = e<sup>\u2212X</sup>'; },
      table: function (data) {
        var head = '<tr><th class="tbl-corner">X</th><th>Area left</th><th>Area right</th></tr>';
        var body = data.rows.map(function (r) {
          return '<tr data-row="' + r.x + '"><th>' + r.x.toFixed(1) + '</th><td data-col="area_left">' + r.area_left.toFixed(5) + '</td><td data-col="area_right">' + r.area_right.toFixed(5) + '</td></tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params) {
        var x = parseFloat(params.x);
        if (isNaN(x)) return null;
        var rounded = Math.round(x * 10) / 10;
        var row = data.rows.filter(function (r) { return Math.abs(r.x - rounded) < 1e-9; })[0];
        if (!row) return null;
        return { rowKey: row.x, colKey: 'area_left', value: row.area_left, label: 'Area left of X=' + row.x + ' = ' + row.area_left.toFixed(5) };
      }
    },

    flatRow: {
      // Displayed to 3 decimals -- the standard textbook precision every quality
      // engineer has memorized (e.g. A2=0.577 at n=5). Underlying JSON keeps full
      // computed precision; this is a display-only rounding.
      formula: function () { return 'A2 = 3/(d\u2082\u221an) &middot; A3 = 3/(c\u2084\u221an) &middot; control limits = center \u00b1 factor \u00d7 spread'; },
      fmt3: function (v) { return (typeof v === 'number') ? v.toFixed(3) : v; },
      table: function (data, entry, params, self) {
        var fields = ['A', 'A2', 'A3', 'c4', 'B3', 'B4', 'd2', 'd3', 'D3', 'D4'];
        var fmt = SHAPES.flatRow.fmt3;
        var head = '<tr><th class="tbl-corner">n</th>' + fields.map(function (f) { return '<th>' + f + '</th>'; }).join('') + '</tr>';
        var body = data.rows.map(function (r) {
          return '<tr data-row="' + r.n + '"><th>' + r.n + '</th>' +
            fields.map(function (f) { return '<td data-col="' + f + '">' + fmt(r[f]) + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params) {
        var n = parseInt(params.n, 10);
        var row = data.rows.filter(function (r) { return r.n === n; })[0];
        if (!row) return null;
        var fmt = SHAPES.flatRow.fmt3;
        return { rowKey: n, colKey: 'A2', value: row.A2, label: 'n=' + n + ' \u2192 A2=' + fmt(row.A2) + ', d2=' + fmt(row.d2) + ', D3=' + fmt(row.D3) + ', D4=' + fmt(row.D4) };
      }
    },

    sigma: {
      formula: function () { return 'DPMO with the standard 1.5\u03c3 shift, two-sided'; },
      table: function (data) {
        var head = '<tr><th class="tbl-corner">\u03c3 level</th><th>% in spec (centered)</th><th>PPM (centered)</th><th>% in spec (1.5\u03c3 shift)</th><th>PPM (1.5\u03c3 shift)</th></tr>';
        var body = data.rows.map(function (r) {
          return '<tr data-row="' + r.sigma_level + '"><th>' + r.sigma_level.toFixed(1) + '</th>' +
            '<td>' + r.no_shift.percent_in_spec + '</td><td>' + r.no_shift.ppm + '</td>' +
            '<td data-col="shift">' + r.with_1_5_shift.percent_in_spec + '</td><td data-col="ppm">' + r.with_1_5_shift.ppm + '</td></tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params) {
        var s = parseFloat(params.sigma);
        var rounded = Math.round(s * 10) / 10;
        var row = data.rows.filter(function (r) { return Math.abs(r.sigma_level - rounded) < 1e-9; })[0];
        if (!row) return null;
        return { rowKey: row.sigma_level, colKey: 'ppm', value: row.with_1_5_shift.ppm, label: row.sigma_level + '\u03c3 (1.5\u03c3 shift) \u2192 ' + row.with_1_5_shift.ppm + ' PPM' };
      }
    },

    iOfN: {
      formula: function (entry) { return entry.id === 'median_ranks' ? "Bernard's approximation: MR(i,n) = (i\u22120.3)/(n+0.4)" : "Blom's approximation: NS(i,n) = \u03a6\u207b\u00b9((i\u22120.375)/(n+0.25))"; },
      table: function (data) {
        var maxN = 0;
        data.rows.forEach(function (r) { Object.keys(r.values).forEach(function (n) { maxN = Math.max(maxN, +n); }); });
        var cols = []; for (var n = 1; n <= maxN; n++) cols.push(String(n));
        var head = '<tr><th class="tbl-corner">i \\ n</th>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        var body = data.rows.map(function (r) {
          return '<tr data-row="' + r.i + '"><th>' + r.i + '</th>' +
            cols.map(function (c) { return '<td data-col="' + c + '">' + (r.values[c] != null ? r.values[c] : '') + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params) {
        var i = parseInt(params.i, 10), n = String(parseInt(params.n, 10));
        var row = data.rows.filter(function (r) { return r.i === i; })[0];
        if (!row || row.values[n] == null) return null;
        return { rowKey: i, colKey: n, value: row.values[n], label: 'i=' + i + ', n=' + n + ' \u2192 ' + row.values[n] };
      }
    },

    toleranceFactors: {
      formula: function (entry, data) { return esc(getPath(data, entry.side + '.formula') || ''); },
      table: function (data, entry, params) {
        var gamma = params.gamma || '0.95';
        var side = getPath(data, entry.side);
        var t = side.tables[gamma];
        if (!t) return '<tbody><tr><td>No table for that confidence level.</td></tr></tbody>';
        var head = '<tr><th class="tbl-corner">n</th>' + t.P_columns.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
        var body = t.rows.map(function (r) {
          return '<tr data-row="' + r.n + '"><th>' + r.n + '</th>' +
            t.P_columns.map(function (c) { return '<td data-col="' + c + '">' + r.values[c] + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function (data, params, entry) {
        var side = getPath(data, entry.side);
        var t = side.tables[params.gamma];
        if (!t) return null;
        var targetN = parseInt(params.n, 10);
        var rows = t.rows, best = null;
        for (var i = 0; i < rows.length; i++) { if (rows[i].n >= targetN) { best = rows[i]; break; } }
        if (!best) best = rows[rows.length - 1];
        var value = best.values[params.P];
        return { rowKey: best.n, colKey: params.P, value: value, label: 'n=' + best.n + ', P=' + params.P + ', \u03b3=' + params.gamma + ' \u2192 k=' + value };
      }
    },

    randomTable: {
      formula: function () { return 'Digits 0\u20139, uniform and independent. Pick a random start (row/column), read in one direction, skip out-of-range or repeated values.'; },
      table: function (data) {
        var head = '<tr><th class="tbl-corner">Line</th><th colspan="10">Digits (blocks of 5)</th></tr>';
        var body = data.rows.map(function (r) {
          return '<tr><th>' + r.line + '</th><td colspan="10" style="font-family:ui-monospace,Menlo,monospace;letter-spacing:.04em;">' + r.blocks.join(' &nbsp; ') + '</td></tr>';
        }).join('');
        return '<thead>' + head + '</thead><tbody>' + body + '</tbody>';
      },
      find: function () { return null; }
    }
  };

  /* ---------------------------------------------------------------------
   * Body rendering + wiring for the active table
   * ------------------------------------------------------------------- */
  function renderBody(entry, data) {
    var shape = SHAPES[entry.shape];
    var params = readParams(entry);
    var formula = shape.formula(entry, data);
    var tableHtml = shape.table(data, entry, params);
    return (formula ? '<div class="tb-tbl-formula">' + formula + '</div>' : '') +
      renderKeyInputs(entry, data) +
      '<div class="tb-tbl-tablewrap" data-tbl-tablewrap><table class="tb-tbl-table">' + tableHtml + '</table></div>';
  }

  function readParams(entry) {
    var body = document.querySelector('[data-tbl-body]');
    var params = {};
    if (!body) return params;
    entry.keys.forEach(function (k) {
      var el = body.querySelector('[data-tbl-key="' + k.id + '"]');
      if (el) params[k.id] = el.value;
    });
    return params;
  }

  function clearHighlights(wrap) {
    Array.prototype.forEach.call(wrap.querySelectorAll('.tbl-hit, .tbl-hit-row, .tbl-hit-col'), function (el) {
      el.classList.remove('tbl-hit', 'tbl-hit-row', 'tbl-hit-col');
    });
  }

  function applyHighlight(wrap, result) {
    if (!result) return;
    clearHighlights(wrap);
    var row = wrap.querySelector('tr[data-row="' + CSS.escape(String(result.rowKey)) + '"]');
    if (row) {
      row.classList.add('tbl-hit-row');
      var cell = row.querySelector('[data-col="' + CSS.escape(String(result.colKey)) + '"]');
      if (cell) { cell.classList.add('tbl-hit'); if (typeof cell.scrollIntoView === 'function') cell.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' }); }
      else if (typeof row.scrollIntoView === 'function') { row.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }
  }

  function doFind() {
    var entry = byId(state.activeId);
    var data = CACHE[entry.file];
    if (!data) return;
    var params = readParams(entry);
    // re-render table body if a matrix/tolerance table's alpha/gamma selector changed
    var wrap = document.querySelector('[data-tbl-tablewrap]');
    var shape = SHAPES[entry.shape];
    if (entry.shape === 'matrix' || entry.shape === 'toleranceFactors') {
      wrap.querySelector('table').innerHTML = shape.table(data, entry, params);
    }
    var result = shape.find(data, params, entry);
    var out = document.querySelector('[data-tbl-result]');
    if (out) out.textContent = result ? result.label : 'No exact match \u2014 check your inputs.';
    if (result) applyHighlight(wrap, result);
  }

  function selectTable(id) {
    state.activeId = id;
    var body = document.querySelector('[data-tbl-body]');
    var host = document.getElementById('tb-tables');
    if (host) {
      var chiprow = host.querySelector('.tb-tbl-chiprow');
      if (chiprow) { chiprow.innerHTML = renderCategoryChips(); wireChips(chiprow); }
    }
    var entry = byId(id);
    if (!body) return;
    body.innerHTML = '<p class="tb-tbl-loading">Loading ' + esc(entry.label) + '\u2026</p>';
    loadTable(entry, function (data, err) {
      if (err || !data) { body.innerHTML = '<p class="tb-tbl-error">Could not load this table. Check your connection and try again.</p>'; return; }
      body.innerHTML = renderBody(entry, data);
      var findBtn = body.querySelector('[data-tbl-find]');
      if (findBtn) findBtn.addEventListener('click', doFind);
      Array.prototype.forEach.call(body.querySelectorAll('[data-tbl-key]'), function (el) {
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter') doFind(); });
        if ((entry.shape === 'matrix' || entry.shape === 'toleranceFactors') && el.tagName === 'SELECT' && el.dataset.tblKey === (entry.shape === 'matrix' ? 'alpha' : 'gamma')) {
          el.addEventListener('change', doFind);
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Public API consumed by test-bank.html
   * ------------------------------------------------------------------- */
  window.__TBTables = {
    registry: REGISTRY,
    mountHTML: function () { return renderShell(); },
    onOpen: function () {
      var host = document.getElementById('tb-tables');
      if (!host) return;
      host.querySelector('[data-tbl-mount]').innerHTML = renderShell();
      wire(host);
      selectTable(state.activeId);
    }
  };

  function wireChips(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('[data-tbl-select]'), function (b) {
      b.addEventListener('click', function () { selectTable(b.getAttribute('data-tbl-select')); });
    });
  }

  function wire(host) {
    wireChips(host);
  }
})();

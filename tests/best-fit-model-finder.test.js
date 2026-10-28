'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
// The finder is a tab in the calculator; the old standalone route redirects there.
const OLD_ROUTE = '/tools/best-fit-model-finder';
const CALC = '/tools/engineering-statistics-calculator';
const DEEP_LINK = `${CALC}?tab=best-fit`;
const html = fs.readFileSync(path.join(ROOT, 'tools', 'engineering-statistics-calculator.html'), 'utf8');
const netlify = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
const directory = fs.readFileSync(path.join(ROOT, 'engineering-tools.html'), 'utf8');
const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'public-best-fit-model-finder-access.sql'), 'utf8');
const C = require('../tools/best-fit-model-finder-core.js');
const doc = new JSDOM(html, { url: `https://upskillsprint.com${CALC}` }).window.document;

function count(source, needle) { return source.split(needle).length - 1; }
function close(actual, expected, tol, label) { assert.ok(Math.abs(actual - expected) <= tol, `${label}: ${actual} vs ${expected}`); }

function runtime() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: `https://upskillsprint.com${CALC}`, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole });
  for (const file of ['tools/calculator-assets/guided-data.js', 'tools/calculator-assets/guided-xlsx.js', 'tools/best-fit-model-finder-core.js', 'tools/best-fit-model-finder-ui.js']) {
    /* Top-level const bindings in classic scripts are global but not window properties; expose them for eval. */
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/^const (GuidedData|GuidedXlsx) =/m, 'window.$1 =');
    dom.window.eval(source);
  }
  return { window: dom.window, document: dom.window.document, errors };
}

test('the standalone page is retired: a 301 sends every form of the old route to the calculator tab', () => {
  assert.equal(fs.existsSync(path.join(ROOT, 'tools', 'best-fit-model-finder.html')), false, 'standalone page removed');
  const rules = [...netlify.matchAll(/\[\[redirects\]\]\s*\n\s*from = "([^"]+)"\s*\n\s*to = "([^"]+)"\s*\n\s*status = (\d+)\s*\n\s*force = (\w+)/g)]
    .map(m => ({ from: m[1], to: m[2], status: Number(m[3]), force: m[4] }));
  for (const from of [OLD_ROUTE, `${OLD_ROUTE}.html`, `${OLD_ROUTE}/`]) {
    const rule = rules.find(r => r.from === from);
    assert.ok(rule, `redirect for ${from}`);
    assert.deepEqual(rule, { from, to: DEEP_LINK, status: 301, force: 'true' });
  }
  assert.doesNotMatch(DEEP_LINK, /#/, 'redirect targets use ?tab=, not a hash');
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /best-fit-model-finder/);
  assert.match(sitemap, /tools\/engineering-statistics-calculator</);
  // The shared finder assets stay: the calculator tab still uses them.
  for (const f of ['best-fit-model-finder-core.js', 'best-fit-model-finder-ui.js', 'best-fit-model-finder.css']) assert.ok(fs.existsSync(path.join(ROOT, 'tools', f)), f);
  for (const gate of ['data-require-auth', 'data-required-access', 'data-access-resource', 'data-tool-shell']) {
    assert.equal(doc.body.hasAttribute(gate), false, `the public calculator must not carry ${gate}`);
  }
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);
});

test('internal links point at the calculator deep link, never the retired route', () => {
  const offenders = [];
  const skip = new Set(['node_modules', 'public-site', '.git', 'tests', 'supabase', 'content']);
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name) || entry.name.startsWith('.tmp')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|js|json|xml)$/.test(entry.name) && /href="\/tools\/best-fit-model-finder(\.html)?["#?\/]/.test(fs.readFileSync(full, 'utf8'))) offenders.push(path.relative(ROOT, full));
    }
  })(ROOT);
  assert.deepEqual(offenders, []);
});

test('shared finder styles stay scoped in the calculator', () => {
  const css = fs.readFileSync(path.join(ROOT, 'tools', 'best-fit-model-finder.css'), 'utf8');
  for (const match of css.matchAll(/(--[\w-]+)\s*:/g)) assert.match(match[1], /^--bfm-/, match[1]);
  assert.match(css, /html\[data-theme="dark"\] #bfm-tool \{/);
  const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const f of doc.querySelectorAll('.bfm-formula')) { assert.equal(f.getAttribute('role'), 'region'); assert.equal(f.getAttribute('tabindex'), '0'); }
});

test('engineering tools directory lists the calculator once, live, with the finder inside it', () => {
  const dir = new JSDOM(directory).window.document;
  assert.equal(dir.getElementById('best-fit-model-finder'), null, 'no separate finder card');
  const card = dir.getElementById('engineering-calculators');
  assert.equal(card.tagName, 'ARTICLE');
  assert.ok(card.classList.contains('tool-row') && !card.classList.contains('is-planned'));
  assert.equal(card.dataset.toolRoute, CALC);
  assert.equal(card.hasAttribute('data-tool'), false, 'no tool_catalog key, so the grant directory still validates');
  assert.equal(card.querySelector('.tool-status').dataset.state, 'granted');
  assert.equal(card.querySelector('.tool-status').textContent, 'Available');
  assert.ok(card.querySelector('.tool-status').classList.contains('available'), 'still counted as a live tool on the homepage');
  assert.doesNotMatch(card.textContent, /Planned|Suggest features/);
  assert.equal(card.querySelector('a.tool-action.primary').getAttribute('href'), CALC);
  assert.match(card.querySelector('a.tool-action.primary').textContent, /Open tool/);
  assert.equal(card.querySelector(`a.tool-action[href="${DEEP_LINK}"]`).textContent, 'Open the Best-Fit Model Finder');
  assert.match(card.querySelector('.tool-content p').textContent, /Best-Fit Model Finder/);
  assert.ok([...card.querySelectorAll('.tool-tags span')].some(t => t.textContent === 'Best-Fit Model Finder'));
  for (const a of card.querySelectorAll('a[href^="/"]')) assert.ok(fs.existsSync(path.join(ROOT, a.getAttribute('href').split('?')[0] + '.html')), a.href);
  assert.equal(dir.querySelectorAll('[data-tool]').length, 3, 'the three catalogued tools are unchanged');
  assert.equal(dir.querySelectorAll('a[href="/request-topic"].tool-row#engineering-calculators').length, 0);
});

test('core fits match statsmodels and SciPy reference values', () => {
  const growth = C.sample('growth');
  const r = C.fitAll(growth.x, growth.y, { cv: false });
  const pick = id => r.models.find(m => m.id === id);
  /* statsmodels OLS on ln y, llf minus sum(ln y) */
  close(pick('ladder|1|0').ll, -28.401257195539955, 1e-8, 'log-y likelihood on y scale');
  /* statsmodels OLS quadratic llf */
  close(pick('poly|2').ll, -47.55796865245189, 1e-8, 'quadratic likelihood');
  /* scipy curve_fit a*exp(b x) */
  close(pick('nls|exp').params[0].value, 0.666063383, 1e-6, 'NLS a');
  close(pick('nls|exp').params[1].value, 3.14934369e-4, 1e-9, 'NLS b');
  /* statsmodels GLM Gamma(log): params, 1/scale, llf */
  close(pick('gamma|1').params[0].value, -0.545476022, 1e-7, 'Gamma intercept');
  close(pick('gamma|1').params[2].value, 26.0961072678, 1e-6, 'Gamma shape');
  close(pick('gamma|1').ll, -29.08379693860256, 1e-6, 'Gamma llf');
  /* bounded profile maximisation of the Box-Cox likelihood */
  close(pick('boxcox|1').params[2].value, -0.0027440521741978136, 5e-5, 'Box-Cox lambda');

  const charpy = C.sample('charpy');
  const tanh = C.fitAll(charpy.x, charpy.y, { cv: false, tempUnit: 'C' }).models.find(m => m.id === 'nls|tanh');
  [132.37628369, 113.55205706, -34.91203133, 17.12195888].forEach((v, i) => close(tanh.params[i].value, v, 1e-3, 'tanh ' + i));

  const hp = C.sample('hallpetch');
  const powx = C.fitAll(hp.x, hp.y, { cv: false }).models.find(m => m.id === 'powerx');
  close(powx.params[2].value, -0.462269736, 1e-3, 'Box-Tidwell alpha');
  close(powx.params[1].value, 614.388898, 0.5, 'Box-Tidwell b on the physical scale');
});

test('ranking picks the generating model and flags the right failures', () => {
  const hp = C.sample('hallpetch');
  const r = C.fitAll(hp.x, hp.y, {});
  assert.equal(C.rank(r.models, 'aicc')[0].id, 'ladder|-0.5|1');
  assert.equal(r.summary.bestPassing.id, 'ladder|-0.5|1');
  const linear = r.models.find(m => m.id === 'ladder|1|1');
  assert.ok(linear.curved, 'a straight line on Hall-Petch data leaves a curve');
  const sumW = r.models.filter(m => m.comparable).reduce((s, m) => s + m.weight, 0);
  close(sumW, 1, 1e-9, 'Akaike weights sum to one');
  assert.match(r.models.find(m => m.id === 'ladder|-0.5|1').equation, /\/√x/);

  const growth = C.sample('growth');
  assert.equal(C.rank(C.fitAll(growth.x, growth.y, { cv: false }).models, 'aicc')[0].id, 'ladder|1|0');
  const charpy = C.sample('charpy');
  const cr = C.fitAll(charpy.x, charpy.y, { tempUnit: 'C' });
  assert.equal(C.rank(cr.models, 'aicc')[0].id, 'nls|tanh');
  assert.ok(cr.skipped.some(m => /positive/.test(m.skip)), 'log rungs are skipped when x crosses zero');

  /* Counts: Poisson AICc is reported but not ranked against continuous models. */
  const x = [], y = [];
  for (let i = 1; i <= 30; i++) { x.push(i); y.push(Math.round(2 + i * 0.6 + (i % 3))); }
  const counts = C.fitAll(x, y, { cv: false });
  const poisson = counts.models.find(m => m.id === 'poisson|1');
  assert.equal(poisson.comparable, false);
  assert.ok(!Number.isFinite(poisson.delta));
  assert.throws(() => C.fitAll([1, 2, 3], [1, 2, 3], {}), /at least 6/);
  assert.throws(() => C.fitAll([1, 1, 1, 1, 1, 1], [1, 2, 3, 4, 5, 6], {}), /x has only one value/);
});

test('predictions back-transform with smearing and give intervals', () => {
  const growth = C.sample('growth');
  const m = C.fitAll(growth.x, growth.y, { cv: false }).models.find(q => q.id === 'ladder|1|0');
  const median = m.predict(5000), mean = m.predictMean(5000), [lo, hi] = m.interval(5000);
  close(median, Math.exp(m.params[0].value + m.params[1].value * 5000), 1e-9, 'median back-transform');
  assert.ok(mean > median, 'smearing mean exceeds the median for log models');
  assert.ok(lo < median && median < hi);
  close(C.t975(10), 2.228138852, 1e-6, 't quantile');
});

test('the page loads samples, pasted tables, ranks, selects and predicts', async () => {
  const { window, document, errors } = runtime();
  const $ = id => document.getElementById(id);
  document.querySelector('[data-sample="hallpetch"]').click();
  await new Promise(resolve => setTimeout(resolve, 2500));
  assert.match($('bfm-run-status').textContent, /Fitted \d+ models/);
  assert.equal($('bfm-results').hidden, false);
  assert.match($('bfm-summary').textContent, /Best by AICc: Inverse square root \(Hall–Petch\)/);
  assert.equal(document.querySelectorAll('#bfm-board tbody tr').length, 25);
  assert.equal($('bfm-detail-name').textContent, 'Inverse square root (Hall–Petch)');
  assert.match($('bfm-detail-eq').textContent, /\/√x/);
  assert.ok(document.querySelectorAll('#bfm-plot-fit path').length >= 2);
  $('bfm-x0').value = '16';
  $('bfm-predict').click();
  assert.match($('bfm-pred-out').textContent, /95% prediction interval/);

  $('bfm-filter').value = 'named';
  $('bfm-filter').dispatchEvent(new window.Event('change'));
  const names = [...document.querySelectorAll('#bfm-board tbody th')].map(th => th.textContent);
  assert.ok(names.includes('Linear') && names.includes('Cubic'));

  $('bfm-paste').value = 'Speed,Time\n' + [8, 12, 16, 20, 25, 30, 35, 40, 50, 60].map(v => `${v},${(720 / v + 5).toFixed(2)}`).join('\n');
  $('bfm-use-paste').click();
  assert.match($('bfm-load-status').textContent, /Pasted table: 10 rows, 2 columns/);
  assert.equal($('bfm-results').hidden, true);
  $('bfm-run').click();
  await new Promise(resolve => setTimeout(resolve, 1500));
  assert.match($('bfm-summary').textContent, /Reciprocal x/);
  assert.deepEqual(errors, []);
  window.close();
});

test('best linear model picks the simplest passing straight-line transformation', () => {
  const pickFor = (key, opts) => { const d = C.sample(key); return C.bestLinear(C.fitAll(d.x, d.y, Object.assign({ cv: false }, opts)).models); };
  const hp = pickFor('hallpetch');
  assert.equal(hp.pick.id, 'ladder|-0.5|1');
  assert.equal(hp.passing, true);
  assert.ok(hp.reasons.some(r => /straight line on the y versus 1\/√x scale/.test(r)));
  assert.equal(pickFor('growth').pick.id, 'ladder|1|0');
  const charpy = pickFor('charpy', { tempUnit: 'C' });
  assert.equal(charpy.passing, false, 'no straight-line transform suits an S-curve');
  assert.equal(charpy.betterNonlinear.id, 'nls|tanh');
  assert.ok(charpy.reasons.some(r => /not be linearizable/.test(r)));
  /* Among near-ties the fewest parameters win: an estimated Box-Cox power never beats a tied plain rung. */
  for (const key of ['hallpetch', 'growth']) {
    const r = pickFor(key);
    assert.ok(r.near.every(m => m.k >= r.pick.k));
  }
  assert.equal(C.bestLinear([]), null);
});

test('the Find best linear model button fits, recommends and opens the pick', async () => {
  const { window, document, errors } = runtime();
  const $ = id => document.getElementById(id);
  $('bfm-paste').value = 'Grain,Yield\n' + C.sample('hallpetch').x.map((x, i) => `${x},${C.sample('hallpetch').y[i]}`).join('\n');
  $('bfm-use-paste').click();
  assert.equal($('bfm-best').hidden, true);
  $('bfm-best-linear').click();
  await new Promise(resolve => setTimeout(resolve, 2500));
  assert.equal($('bfm-best').hidden, false);
  assert.equal($('bfm-best-name').textContent, 'Inverse square root (Hall–Petch)');
  assert.equal($('bfm-best-status').textContent, 'Recommended');
  assert.match($('bfm-best-eq').textContent, /\/√x/);
  assert.ok($('bfm-best-reasons').children.length >= 3);
  assert.ok(document.querySelector('#bfm-best-plot path.bfm-fitline'));
  assert.equal($('bfm-detail-name').textContent, 'Inverse square root (Hall–Petch)');
  assert.equal($('bfm-best-linear').disabled, false);
  $('bfm-use-paste').click();
  assert.equal($('bfm-best').hidden, true, 'loading new data clears the old recommendation');
  assert.deepEqual(errors, []);
  window.close();
});

test('calculator carries the finder as a tab after Distribution Lookup Tables', () => {
  const calc = fs.readFileSync(path.join(ROOT, 'tools', 'engineering-statistics-calculator.html'), 'utf8');
  const cdoc = new JSDOM(calc).window.document;
  const tabs = [...cdoc.querySelectorAll('#calculator-shell .tab[data-page]')].map(t => t.dataset.page);
  assert.equal(tabs[tabs.indexOf('pg-lookup') + 1], 'pg-fit', 'the finder tab follows Distribution Lookup Tables');
  const tab = cdoc.querySelector('.tab[data-page="pg-fit"]');
  assert.equal(tab.textContent, 'Best-Fit Model Finder');
  assert.equal(tab.hasAttribute('hidden'), false, 'visible to everyone');
  const page = cdoc.getElementById('pg-fit');
  assert.ok(page.classList.contains('page'));
  assert.ok(page.querySelector('#bfm-tool.bfm-embedded #bfm-best-linear'));
  assert.equal(count(calc, '<link rel="stylesheet" href="/tools/best-fit-model-finder.css">'), 1);
  assert.ok(calc.indexOf('/tools/calculator-assets/presentation.js') < calc.indexOf('/tools/calculator-assets/bestfit-tab.js'));
  const ids = [...cdoc.querySelectorAll('[id^="bfm"]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'no duplicate finder ids in the calculator');
});

test('the calculator tab loads the finder scripts on first visit, for everyone', async () => {
  const dom = new JSDOM(`<!doctype html><head></head><body><div id="calculator-shell">
    <button class="tab active" data-page="pg-guide">Guided</button><button class="tab" data-page="pg-fit">Best-Fit Model Finder</button></div>
    <section class="page" id="pg-fit"></section></body>`, { runScripts: 'outside-only' });
  const w = dom.window, d = w.document;
  w.eval(fs.readFileSync(path.join(ROOT, 'tools', 'calculator-assets', 'bestfit-tab.js'), 'utf8'));
  assert.equal(d.querySelector('script[src="/tools/best-fit-model-finder-core.js"]'), null, 'nothing loads until the tab is opened');
  d.querySelector('[data-page="pg-fit"]').click();
  await new Promise(resolve => setTimeout(resolve, 20));
  const srcs = [...d.querySelectorAll('script[src]')].map(s => s.getAttribute('src'));
  assert.ok(srcs.includes('/tools/best-fit-model-finder-core.js'));
  assert.ok(srcs.includes('/assets/js/math.js'));
  assert.equal(srcs.filter(s => s === '/assets/js/math.js').length, 1);
  assert.doesNotMatch(fs.readFileSync(path.join(ROOT, 'tools', 'calculator-assets', 'bestfit-tab.js'), 'utf8'), /current_access_level|can_access_content|UpskillAuth/);
  w.close();
});

function deepLinkDom(url) {
  const dom = new JSDOM(`<!doctype html><head></head><body><div id="calculator-shell">
    <button class="tab active" data-page="pg-guide" role="tab">Guided</button><button class="tab" data-page="pg-fit" role="tab">Best-Fit Model Finder</button></div>
    <section class="page active" id="pg-guide"></section><section class="page" id="pg-fit"></section></body>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, d = w.document;
  /* The same tab sync as analysis-ui.js setupTabs(). */
  const tabs = [...d.querySelectorAll('.tab')];
  tabs.forEach(tab => { tab.tabIndex = tab.classList.contains('active') ? 0 : -1; tab.setAttribute('aria-selected', String(tab.classList.contains('active')));
    tab.onclick = () => tabs.forEach(t => { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); t.tabIndex = t === tab ? 0 : -1; t.classList.toggle('active', t === tab); d.getElementById(t.dataset.page).classList.toggle('active', t === tab); }); });
  w.eval(fs.readFileSync(path.join(ROOT, 'tools', 'calculator-assets', 'bestfit-tab.js'), 'utf8'));
  return { w, d, fit: d.querySelector('[data-page="pg-fit"]') };
}

test('the ?tab=best-fit deep link opens the finder tab, loads it and focuses the tab', async () => {
  for (const url of [`https://upskillsprint.com${DEEP_LINK}`, `https://upskillsprint.com${CALC}#best-fit`, `https://upskillsprint.com${CALC}#pg-fit`]) {
    const { w, d, fit } = deepLinkDom(url);
    assert.equal(fit.getAttribute('aria-selected'), 'true', url);
    assert.equal(fit.tabIndex, 0);
    assert.ok(d.getElementById('pg-fit').classList.contains('active'));
    assert.equal(d.getElementById('pg-guide').classList.contains('active'), false);
    assert.equal(d.activeElement, fit, 'keyboard focus lands on the selected tab');
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.ok(d.querySelector('script[src="/tools/best-fit-model-finder-core.js"]'), 'the lazy load ran');
    w.close();
  }
  const plain = deepLinkDom(`https://upskillsprint.com${CALC}`);
  assert.equal(plain.fit.getAttribute('aria-selected'), 'false', 'no deep link: Guided Analysis stays first');
  assert.equal(plain.d.querySelector('script[src="/tools/best-fit-model-finder-core.js"]'), null);
  plain.w.location.hash = 'best-fit';
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(plain.fit.getAttribute('aria-selected'), 'true', 'a later #best-fit also opens the tab');
  plain.w.close();
});

test('explore() fits any rung live, dropping only the points a rung cannot take', () => {
  const hp = C.sample('hallpetch');
  const raw = C.explore(hp.x, hp.y, { xp: 1, yp: 1 });
  assert.ok(raw.ok && raw.curved, 'a straight line on raw Hall-Petch data is curved');
  const best = C.explore(hp.x, hp.y, { xp: -0.5, yp: 1 });
  assert.ok(!best.curved && !best.funnel);
  assert.equal(best.equation, 'y = 178.5 + 625.5/√x');
  assert.ok(best.fitScale.u.every(u => u > 0), 'plotted in physical orientation');
  const charpy = C.sample('charpy');
  const logx = C.explore(charpy.x, charpy.y, { xp: 0, yp: 1 });
  assert.ok(logx.ok && logx.dropped > 0 && logx.n + logx.dropped === charpy.x.length);
  const shifted = C.explore(charpy.x, charpy.y, { xp: 0, yp: 1, xc: -120 });
  assert.equal(shifted.dropped, 0);
  assert.match(shifted.equation, /ln \(x \+ 120\)/);
  const bad = C.explore(hp.x, hp.y, { xp: 1, yp: 'logit' });
  assert.equal(bad.ok, false);
  assert.match(bad.reason, /Fewer than six points/);
  const start = C.explore([1, 2, 3, 4, 5, 6, 7], [0, 1, 3, 6, 10, 15, 21], { xp: 1, yp: 0, yc: 1 });
  assert.ok(start.ok && start.dropped === 0, 'a start value lets the log take zeros');
  assert.match(start.yLabel, /ln \(y \+ 1\)/);
});

test('the live explorer appears with data and updates as rungs change', async () => {
  const { window, document, errors } = runtime();
  const $ = id => document.getElementById(id);
  assert.equal($('bfm-explore').hidden, true);
  $('bfm-paste').value = 'Grain,Yield\n' + C.sample('hallpetch').x.map((x, i) => `${x},${C.sample('hallpetch').y[i]}`).join('\n');
  $('bfm-use-paste').click();
  assert.equal($('bfm-explore').hidden, false);
  assert.equal(document.querySelectorAll('#bfm-x-rungs input').length, 8);
  assert.equal(document.querySelectorAll('#bfm-y-rungs input').length, 9, 'eight rungs plus logit');
  assert.match($('bfm-ex-verdict').textContent, /Still curved/);
  const pick = (name, value) => { const el = document.querySelector(`input[name="${name}"][value="${value}"]`); el.checked = true; el.dispatchEvent(new window.Event('change')); };
  pick('bfm-ex-xp', '-0.5');
  assert.match($('bfm-ex-verdict').textContent, /Straight and even/);
  assert.equal($('bfm-ex-eq').textContent, 'y = 178.5 + 625.5/√x');
  assert.ok(document.querySelector('#bfm-ex-trans path.bfm-fitline'));
  pick('bfm-ex-yp', 'logit');
  assert.match($('bfm-ex-verdict').textContent, /Fewer than six points/);
  $('bfm-ex-reset').click();
  assert.equal(window.BestFitUI.explorer().xp, 1);
  /* The best-linear result and the model detail both hand their rungs to the explorer. */
  $('bfm-best-linear').click();
  await new Promise(resolve => setTimeout(resolve, 2500));
  assert.equal($('bfm-ex-best').disabled, false);
  $('bfm-ex-best').click();
  assert.equal(window.BestFitUI.explorer().xp, -0.5);
  window.BestFitUI.select('ladder|0|0');
  assert.equal($('bfm-detail-explore').hidden, false);
  $('bfm-detail-explore').click();
  assert.equal(window.BestFitUI.explorer().yp, 0);
  assert.match($('bfm-ex-eq').textContent, /^ln y = /);
  window.BestFitUI.select('nls|tanh');
  assert.equal($('bfm-detail-explore').hidden, true, 'nonlinear models have no rung equivalent');
  assert.deepEqual(errors, []);
  window.close();
});

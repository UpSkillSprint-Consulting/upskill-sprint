'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const ROUTE = '/tools/best-fit-model-finder';
const html = fs.readFileSync(path.join(ROOT, 'tools', 'best-fit-model-finder.html'), 'utf8');
const guide = fs.readFileSync(path.join(ROOT, 'docs', 'LESSON_CREATION_GUIDE.md'), 'utf8');
const directory = fs.readFileSync(path.join(ROOT, 'engineering-tools.html'), 'utf8');
const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'administrator-best-fit-model-finder-access.sql'), 'utf8');
const C = require('../tools/best-fit-model-finder-core.js');
const doc = new JSDOM(html, { url: `https://upskillsprint.com${ROUTE}` }).window.document;

function count(source, needle) { return source.split(needle).length - 1; }
function close(actual, expected, tol, label) { assert.ok(Math.abs(actual - expected) <= tol, `${label}: ${actual} vs ${expected}`); }

function runtime() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: `https://upskillsprint.com${ROUTE}`, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole });
  for (const file of ['tools/calculator-assets/guided-data.js', 'tools/calculator-assets/guided-xlsx.js', 'tools/best-fit-model-finder-core.js', 'tools/best-fit-model-finder-ui.js']) {
    /* Top-level const bindings in classic scripts are global but not window properties; expose them for eval. */
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/^const (GuidedData|GuidedXlsx) =/m, 'window.$1 =');
    dom.window.eval(source);
  }
  return { window: dom.window, document: dom.window.document, errors };
}

test('head metadata, JSON-LD and the Administrator gate', () => {
  assert.equal(doc.title, 'Best-Fit Model Finder | UpSkill Sprint');
  assert.ok(doc.title.length <= 65);
  const description = doc.querySelector('meta[name="description"]').content;
  assert.ok(description.length >= 120 && description.length <= 160);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, description);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, `https://upskillsprint.com${ROUTE}`);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, `https://upskillsprint.com${ROUTE}`);
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const app = ld['@graph'].find(node => node['@type'] === 'WebApplication');
  assert.equal(app.url, `https://upskillsprint.com${ROUTE}`);
  assert.equal(app.description, description);
  assert.equal(app.offers, undefined, 'not free to the public, so no offers');
  const crumbs = ld['@graph'].find(node => node['@type'] === 'BreadcrumbList').itemListElement;
  assert.equal(crumbs[1].item, 'https://upskillsprint.com/engineering-tools');

  assert.ok(doc.body.hasAttribute('data-require-auth'));
  assert.equal(doc.body.getAttribute('data-required-access'), 'administrator');
  assert.equal(doc.body.getAttribute('data-access-resource'), `tool:${ROUTE}`);
  assert.match(sql, new RegExp(`'tool:${ROUTE}', 'administrator'`));
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);
});

test('shared chrome, assets and scoped styles', () => {
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>']) {
    assert.equal(count(html, tag), 1, tag);
  }
  const expectedHeader = guide.split('### 4.1 Header')[1].match(/```html\n([\s\S]*?)\n```/)[1]
    .replace('href="/lessons" aria-current="page">Lessons', 'href="/lessons">Lessons')
    .replace('href="/engineering-tools">Engineering Tools</a>', 'href="/engineering-tools" aria-current="page">Engineering Tools</a>');
  const expectedFooter = guide.split('### 4.2 Footer')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  assert.equal(html.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>/)[0].trim(), expectedHeader.trim());
  assert.equal(html.match(/<footer class="site">[\s\S]*?<\/footer>/)[0].trim(), expectedFooter.trim());
  assert.equal(doc.querySelectorAll('h1').length, 1);
  for (const id of ['bfm-tool-style', 'best-fit-model-finder-dark-overrides']) {
    for (const match of doc.getElementById(id).textContent.matchAll(/(--[\w-]+)\s*:/g)) assert.match(match[1], /^--bfm-/, match[1]);
  }
  assert.equal(html.lastIndexOf('<style'), html.indexOf('<style id="best-fit-model-finder-dark-overrides"'));
  const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const wrap of doc.querySelectorAll('.table-scroll')) {
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('role'), 'region');
  }
  for (const a of doc.querySelectorAll('.related-lessons a')) assert.ok(fs.existsSync(path.join(ROOT, `${a.getAttribute('href')}.html`)), a.href);
});

test('engineering tools directory lists the finder without breaking per-tool grants', () => {
  const dir = new JSDOM(directory).window.document;
  const card = dir.getElementById('best-fit-model-finder');
  assert.ok(card);
  assert.equal(card.hasAttribute('data-tool'), false, 'no tool_catalog key, so the grant directory still validates');
  assert.equal(card.querySelector('a.tool-action').getAttribute('href'), ROUTE);
  assert.equal(dir.querySelectorAll('[data-tool]').length, 3, 'the three catalogued tools are unchanged');
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
  assert.equal($('results').hidden, false);
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
  assert.equal($('results').hidden, true);
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
  assert.equal($('best').hidden, true);
  $('bfm-best-linear').click();
  await new Promise(resolve => setTimeout(resolve, 2500));
  assert.equal($('best').hidden, false);
  assert.equal($('bfm-best-name').textContent, 'Inverse square root (Hall–Petch)');
  assert.equal($('bfm-best-status').textContent, 'Recommended');
  assert.match($('bfm-best-eq').textContent, /\/√x/);
  assert.ok($('bfm-best-reasons').children.length >= 3);
  assert.ok(document.querySelector('#bfm-best-plot path.bfm-fitline'));
  assert.equal($('bfm-detail-name').textContent, 'Inverse square root (Hall–Petch)');
  assert.equal($('bfm-best-linear').disabled, false);
  $('bfm-use-paste').click();
  assert.equal($('best').hidden, true, 'loading new data clears the old recommendation');
  assert.deepEqual(errors, []);
  window.close();
});

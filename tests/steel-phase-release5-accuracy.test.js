'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const TOOLS = path.join(__dirname, '..', 'tools');
const read = file => fs.readFileSync(path.join(TOOLS, file), 'utf8');
const P = require('../tools/steel-phase-explorer-poster-geometry.js');
const R = require('../tools/steel-phase-explorer-rapid-geometry.js');

const HOST = `<!doctype html><html><head></head><body>
<main id="spx-tool">
  <div class="spx-tabs"><button data-tab="learn">Learn</button></div>
  <section id="spx-tab-learn" class="spx-panel" data-panel="learn"></section>
</main></body></html>`;

function boot() {
  const dom = new JSDOM(HOST, { runScripts: 'outside-only', pretendToBeVisual: true });
  const win = dom.window;
  win.state = { unit: 'metric' };
  win.CtoF = c => c * 9 / 5 + 32;
  win.FtoC = f => (f - 32) * 5 / 9;
  win.setUnit = unit => { win.state.unit = unit; };
  win.switchTab = () => {};
  win.fetch = () => Promise.reject(new Error('offline in accuracy tests'));
  win.Element.prototype.scrollTo = function () {};
  win.SVGElement.prototype.createSVGPoint = function () {
    return { x: 0, y: 0, matrixTransform() { return { x: 0, y: 0 }; } };
  };
  win.SVGElement.prototype.getScreenCTM = function () { return { inverse: () => ({}) }; };
  win.eval(read('steel-phase-explorer-poster-geometry.js'));
  win.eval(read('steel-phase-explorer-rapid-geometry.js'));
  win.eval(read('steel-phase-explorer-release5-loader.js'));
  win.eval(read('steel-phase-explorer-release5.js'));
  return win;
}

test('poster reports invariant isotherm spans instead of an adjacent phase', () => {
  assert.equal(P.regionAt(0.20, 727), 'eutectoidInvariant');
  assert.equal(P.regionAt(3.00, 1148), 'eutecticInvariant');
  assert.equal(P.regionAt(0.40, 1495), 'peritecticInvariant');
});

test('poster removes low-temperature austenite from the cast-iron range', () => {
  assert.equal(P.regionAt(3.5, 20), 'ferriteCementite');
  assert.equal(P.regionAt(4.3, 500), 'ferriteCementite');
  assert.equal(P.regionAt(3.5, 1000), 'austeniteCementite');
});

test('the cementite end member is single phase below its liquidus', () => {
  assert.equal(P.regionAt(6.67, 500), 'cementite');
  assert.equal(P.regionAt(6.67, 1200), 'cementite');
  assert.equal(P.regionAt(6.67, 1300), 'liquid');
});

test('rapid map explicitly withholds products below 0.20 wt% carbon', () => {
  assert.equal(R.regionAt(0.10, 600), 'notModelled');
  assert.equal(R.regionAt(0.199, 300), 'notModelled');
  assert.notEqual(R.regionAt(0.20, 600), 'notModelled');
});

test('rapid-map eutectoid selection uses invariant guidance and emphasis', () => {
  const win = boot();
  win.__SPX.release5.setMap('rapid');
  win.__SPX.release5.addPoint(0.50, 727);
  const help = win.document.getElementById('spx-r5-help');
  assert.match(help.textContent, /eutectoid invariant boundary/i);
  assert.match(help.textContent, /ferrite, austenite, and cementite can coexist/i);
  assert.doesNotMatch(help.textContent, /Move the point back inside/i);
  assert.match(help.querySelector('.spx-r5-swatch').getAttribute('style'), /#2563eb/i);
  win.close();
});

test('hypereutectoid austenitising window begins above A1 and reaches Acm', () => {
  const c = 1.20;
  assert.equal(R.austenitisingLow(c), R.EUTECTOID_T + 25);
  assert.ok(R.austenitisingHigh(c) >= R.acm(c));
  const middle = (R.austenitisingLow(c) + R.austenitisingHigh(c)) / 2;
  assert.equal(R.regionAt(c, middle), 'austeniteCementite',
    'the process window must not replace the underlying two-phase field');
});

test('approximate rapid-map boundaries are not declared quantitative', () => {
  ['a3', 'acm', 'mf'].forEach(key => {
    assert.ok(R.APPROXIMATE.includes(key), `${key} marked approximate`);
    assert.ok(!R.QUANTITATIVE.includes(key), `${key} not marked quantitative`);
  });
  assert.ok(R.QUANTITATIVE.includes('ms'), 'carbon-only Ms remains an empirical estimate');
});

test('rendered rapid map includes all 0.2 wt% major x-axis labels', () => {
  const win = boot();
  const ticks = [...win.document.querySelectorAll('#spx-r5-reference .spx-r5-tick')]
    .map(node => node.textContent);
  ['0', '0.2', '0.4', '0.6', '0.8', '1.0', '1.2']
    .forEach(value => assert.ok(ticks.includes(value), `missing x tick ${value}`));
  assert.ok(win.document.querySelector('[data-r5-region="notModelled"]'));
  win.close();
});

test('painted rapid-map fields follow the revised equilibrium topology', () => {
  const win = boot();
  const path = win.document.querySelector('#spx-r5-reference [data-r5-region="austenite"]');
  const polygons = path.getAttribute('d').split(/\s*Z\s*/).filter(Boolean).map(part =>
    [...part.matchAll(/[ML](-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)]
      .map(match => [Number(match[1]), Number(match[2])])
  );
  function contains(poly, point) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      const crosses = (yi > point[1]) !== (yj > point[1]) &&
        point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi;
      if (crosses) inside = !inside;
    }
    return inside;
  }
  const samples = [[0.50, 950], [1.00, 900]];
  samples.forEach(([carbon, temperature]) => {
    assert.equal(R.regionAt(carbon, temperature), 'austenite');
    const point = [R.xOf(carbon), R.yOf(temperature)];
    assert.ok(polygons.some(poly => contains(poly, point)),
      `classifier-only white gap at ${carbon} wt% C and ${temperature} °C`);
  });
  assert.equal(polygons.length, 1, 'single-phase austenite is one connected field above A3/Acm');

  const twoPhaseSamples = [
    ['ferriteAustenite', 0.50, 740],
    ['austeniteCementite', 1.00, 790]
  ];
  twoPhaseSamples.forEach(([key, carbon, temperature]) => {
    assert.equal(R.regionAt(carbon, temperature), key);
    const field = win.document.querySelector(`#spx-r5-reference [data-r5-region="${key}"]`);
    const polygon = [...field.getAttribute('d').matchAll(/[ML](-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)]
      .map(match => [Number(match[1]), Number(match[2])]);
    assert.ok(contains(polygon, [R.xOf(carbon), R.yOf(temperature)]),
      `painted ${key} field misses ${carbon} wt% C and ${temperature} °C`);
  });
  win.close();
});

test('poster invariant overlays use the phase-diagram tie-line endpoints', async () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  const lines = [...win.document.querySelectorAll('#spx-r5-emphasis line')];
  assert.equal(lines.length, 3);
  const ends = line => [Number(line.getAttribute('x1')), Number(line.getAttribute('x2'))];
  assert.deepEqual(ends(lines[0]), [P.xOf(P.POINTS.alphaMaxC), P.xOf(P.POINTS.cementiteC)]);
  assert.deepEqual(ends(lines[1]), [P.xOf(P.POINTS.gammaMaxC), P.xOf(P.POINTS.cementiteC)]);
  assert.deepEqual(ends(lines[2]), [P.xOf(P.POINTS.peritecticDelta), P.xOf(P.POINTS.peritecticL)]);
  const paths = [...win.document.querySelectorAll('#spx-r5-emphasis path')];
  assert.match(paths.at(-1).getAttribute('d'), new RegExp('^M' + P.xOf(P.POINTS.peritecticGamma).toFixed(1) + ' '));
  await new Promise(resolve => setTimeout(resolve, 0));
  win.close();
});

test('poster legend exposes every finite-area classified phase field', async () => {
  const win = boot();
  win.__SPX.release5.setMap('poster');
  const keys = [...win.document.querySelectorAll('#spx-r5-legend [data-r5-legend]')]
    .map(node => node.dataset.r5Legend);
  ['deltaLiquid', 'deltaAustenite', 'cementite', 'ferriteCementite', 'austeniteCementite']
    .forEach(key => assert.ok(keys.includes(key), `missing legend entry ${key}`));
  await new Promise(resolve => setTimeout(resolve, 0));
  win.close();
});

test('user guidance states the hold-time and stable-versus-metastable limits', () => {
  const guide = read('steel-phase-explorer/how-to-use/index.html');
  const release = read('steel-phase-explorer-release5.js');
  const page = read('steel-phase-explorer.html');
  assert.match(guide, /assumed sufficient isothermal hold/i);
  assert.doesNotMatch(guide, /what actually forms when time is denied/i);
  assert.match(guide, /bainite can form from remaining austenite during below-M<sub>s<\/sub> holding/i);
  assert.match(release, /stable graphite fields[^.]*not classified/i);
  assert.doesNotMatch(guide, /HV\/HBW\/HRC learning conversions/i);
  assert.doesNotMatch(guide, /phase tendency, pitting trend/i);
  assert.match(guide, /ASTM E140 or ISO 18265/i);
  assert.match(page, /Ferrite \+ cementite \(below A₁\)/);
  assert.match(page, /Slow-cooled room-temperature microconstituent estimate/);
  assert.doesNotMatch(page, /Final equilibrium microstructure/);
  assert.match(page, /coarse carbon-only tendencies/i);
  assert.match(guide, /uncalibrated relative-lag tendency/i);
  assert.doesNotMatch(guide, /relative-lag index/i);
  assert.doesNotMatch(release, /field you austenitise into before any quench/i);
  assert.match(release, /some cycles deliberately quench from an intercritical or austenite-plus-carbide field/i);
});

test('PNG export embeds the Release 5 presentation rules it depends on', () => {
  const release = read('steel-phase-explorer-release5.js');
  assert.match(release, /createElementNS\(NS, 'style'\)/);
  ['spx-r5-grid-major', 'spx-r5-critical', 'spx-r5-readout', 'spx-r5-pointlabel']
    .forEach(className => assert.match(release, new RegExp('\\.' + className + '\\{')));
  assert.match(release, /\.spx-r5-critical\.approx\{stroke-dasharray:5 4;opacity:\.82\}/);
  assert.match(release, /\.spx-r5-critical\.approx\.dashed\{stroke-dasharray:10 5 2 5\}/);
  assert.match(release, /clone\.insertBefore\(exportStyle, clone\.firstChild\)/);
});

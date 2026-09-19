'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

async function tool(t) {
  const ctx = bootTool();
  await ready(ctx.win);
  t.after(() => ctx.win.close());
  return ctx;
}

test('nitriding and FNC presets use valid thresholds instead of the display limit', async t => {
  const { win, doc } = await tool(t);
  for (const [treatment, route] of [['nitriding', 'select'], ['fnc', 'card']]) {
    if (route === 'select') {
      const select = doc.getElementById('spx-r4-treatment');
      select.value = treatment;
      select.dispatchEvent(new win.Event('change', { bubbles: true }));
    } else {
      doc.querySelector(`#spx-r4-treatment-grid [data-treatment="${treatment}"]`).click();
    }
    const model = win.__SPX.release4.surface();
    assert.equal(model.thresholdValid, true, `${treatment} threshold is physically ordered`);
    assert.ok(model.effective > 0, `${treatment} has a positive threshold depth`);
    assert.ok(model.effective < win.state.r4.surface.depth,
      `${treatment} does not masquerade as the displayed-depth limit`);
    assert.equal(model.beyondDisplay, false);
    assert.ok(win.state.r4.surface.initial < win.state.r4.surface.target);
    assert.ok(win.state.r4.surface.target < win.state.r4.surface.surface);
  }

  win.state.r4.surface.target = 0;
  win.__SPX.release4.render();
  const invalid = win.__SPX.release4.surface();
  assert.equal(invalid.thresholdValid, false);
  assert.equal(invalid.effective, null);
  assert.match(doc.getElementById('spx-r4-diff-metrics').textContent, /—/,
    'invalid threshold is not rendered as an exact case depth');
});

test('surface-treatment choices use native keyboard-operable buttons', async t => {
  const { win, doc } = await tool(t);
  const choices = [...doc.querySelectorAll('#spx-r4-treatment-grid [data-treatment]')];
  assert.ok(choices.length >= 7);
  assert.ok(choices.every(choice => choice.tagName === 'BUTTON'));
  const nitriding = doc.querySelector('#spx-r4-treatment-grid [data-treatment="nitriding"]');
  nitriding.click();
  assert.equal(win.state.r4.surface.treatment, 'nitriding');
  assert.equal(doc.querySelector('#spx-r4-treatment-grid [data-treatment="nitriding"]')
    .getAttribute('aria-pressed'), 'true');
});

test('transformation hardening requires energy, time, carbon and temperature above Ac1', async t => {
  const { win } = await tool(t);
  const s = win.state.r4.surface;
  s.treatment = 'induction';
  s.depth = 3;

  function expectNoCase(label, patch, carbon, reason) {
    win.state.chem.C = carbon;
    Object.assign(s, patch);
    const model = win.__SPX.release4.surface();
    assert.equal(model.eligible, false, label);
    assert.equal(model.effective, 0, `${label}: no effective depth`);
    assert.equal(model.total, 0, `${label}: no total hardened depth`);
    assert.equal(model.surfaceHV, model.coreHV, `${label}: no invented hardness rise`);
    assert.match(model.reason, reason);
  }

  expectNoCase('zero power', { power: 0, time: .02, temp: 900 }, .2, /intensity is zero/i);
  expectNoCase('zero time', { power: 55, time: 0, temp: 900 }, .2, /time must be greater/i);
  const ac1 = win.__SPX.chemMetrics().ac1;
  expectNoCase('below Ac1', { power: 55, time: .02, temp: ac1 - 1 }, .2, /does not exceed.*Ac1/i);
  expectNoCase('zero carbon', { power: 55, time: .02, temp: 900 }, 0, /zero-carbon/i);

  win.state.chem.C = .4;
  Object.assign(s, { power: 55, time: .02, temp: 900 });
  const valid = win.__SPX.release4.surface();
  assert.equal(valid.eligible, true);
  assert.ok(valid.effective > 0);
  assert.ok(valid.surfaceHV > valid.coreHV);
});

test('transformation hardening is quarantined below the shared 0.02 wt% carbon scope', async t => {
  const { win, doc } = await tool(t);
  win.state.chem.C = .01;
  Object.assign(win.state.r4.surface, {
    treatment: 'induction', power: 100, time: 100, temp: 900
  });

  const model = win.__SPX.release4.surface();
  assert.equal(model.eligible, false);
  assert.equal(model.quantitativeValid, false);
  assert.equal(model.penetrationIndex, 0);
  assert.equal(model.surfaceHV, null);
  assert.equal(model.coreHV, null);
  assert.ok(model.pts.every(point => point.hv === null));
  assert.match(model.reason, /below the 0\.02 wt% lower scope/i);

  win.__SPX.release4.render();
  assert.match(doc.getElementById('spx-r4-diff-status').textContent,
    /below the 0\.02 wt% lower scope/i);
  assert.doesNotMatch(doc.getElementById('spx-r4-diff-metrics').textContent,
    /\d+(?:\.\d+)?\s*HV/i);
  assert.equal(doc.querySelector('#spx-r4-diff-svg path'), null,
    'no quantitative transformation curve survives below model scope');
  assert.match(doc.getElementById('spx-r4-diff-svg').textContent,
    /quantitative transformation result unavailable/i);
});

test('zero diffusion time produces no eligible case or hidden minimum-time result', async t => {
  const { win, doc } = await tool(t);
  const s = win.state.r4.surface;
  Object.assign(s, {
    treatment: 'carburize', temp: 930, time: 0,
    initial: .2, surface: .9, target: .4, depth: 3
  });

  const model = win.__SPX.release4.surface();
  assert.equal(model.eligible, false);
  assert.equal(model.root, 0);
  assert.equal(model.total, 0);
  assert.equal(model.effective, null);
  assert.ok(model.pts.every(point => point.response === 0));

  win.__SPX.release4.render();
  assert.match(doc.getElementById('spx-r4-diff-status').textContent,
    /no diffusion case predicted.*time must be greater than zero/i);
  assert.match(doc.getElementById('spx-r4-diff-metrics').textContent, /—Threshold depth/);
});

test('transformation mode uses a unitless exposure and penetration response independent of chart depth', async t => {
  const { win, doc } = await tool(t);
  const select = doc.getElementById('spx-r4-treatment');
  select.value = 'induction';
  select.dispatchEvent(new win.Event('change', { bubbles: true }));

  assert.match(doc.getElementById('spx-r4-diff-time-label').textContent, /exposure-duration proxy/i);
  assert.match(doc.getElementById('spx-r4-diff-time-unit').textContent, /unitless/i);
  assert.doesNotMatch(doc.getElementById('spx-r4-diff-time-unit').textContent, /\(h\)/i);
  assert.equal(doc.getElementById('spx-r4-diff-depth').disabled, true);
  assert.equal(win.state.r4.surface.time, 55, 'preset is a 0–100 proxy, not an hour value');

  win.state.chem.C = .4;
  Object.assign(win.state.r4.surface, { power: 100, time: 100, temp: 1100, depth: .1 });
  const narrowChart = win.__SPX.release4.surface();
  win.state.r4.surface.depth = 20;
  const wideChart = win.__SPX.release4.surface();
  assert.equal(narrowChart.depthAvailable, false);
  assert.equal(narrowChart.penetrationIndex, wideChart.penetrationIndex);
  assert.equal(narrowChart.total, wideChart.total);
  assert.ok(narrowChart.penetrationIndex > 0);

  win.__SPX.release4.render();
  const metrics = doc.getElementById('spx-r4-diff-metrics').textContent;
  assert.match(metrics, /penetration response index/i);
  assert.doesNotMatch(metrics, /\d+(?:\.\d+)?\s*mm/i,
    'transformation response is not presented as a physical hardened depth');
  assert.match(doc.getElementById('spx-r4-diff-status').textContent,
    /no physical hardened depth is calculated/i);
  assert.match(doc.getElementById('spx-r4-diff-svg').textContent,
    /normalized subsurface coordinate/i);
});

test('hypereutectoid transformation response uses Acm rather than hypoeutectoid Ac3', async t => {
  const { win, doc } = await tool(t);
  win.state.chem.C = 1.20;
  Object.assign(win.state.r4.surface, {
    treatment: 'induction', power: 100, time: 100, temp: 730
  });

  const nearA1 = win.__SPX.release4.surface();
  assert.equal(nearA1.hyper, true);
  assert.equal(nearA1.completionLabel, 'Acm');
  assert.ok(nearA1.completionTemperature > 730);
  assert.ok(nearA1.austenitized < .25,
    '1.20 wt% C must not be treated as fully austenitized near 730 °C');

  win.state.r4.surface.temp = nearA1.completionTemperature + 5;
  const aboveAcm = win.__SPX.release4.surface();
  assert.equal(aboveAcm.austenitized, 1);
  assert.ok(aboveAcm.penetrationIndex > nearA1.penetrationIndex);

  win.state.r4.surface.temp = 730;
  win.__SPX.release4.render();
  assert.match(doc.getElementById('spx-r4-diff-metrics').textContent,
    /Acm completion reference/i);
  assert.match(doc.getElementById('spx-r4-diff-status').textContent,
    /hypereutectoid.*plain-carbon Acm.*retain carbides/i);
});

test('invalid hypoeutectoid Ac3-at-or-below-Ac1 sequence quarantines transformation output', async t => {
  const { win, doc } = await tool(t);
  Object.assign(win.state.chem, { C: .60, Cr: 5 });
  const critical = win.__SPX.chemMetrics();
  assert.ok(critical.ac3 <= critical.ac1,
    'fixture must exercise the invalid Andrews boundary ordering');
  Object.assign(win.state.r4.surface, {
    treatment: 'induction', power: 100, time: 100, temp: 1100
  });

  const model = win.__SPX.release4.surface();
  assert.equal(model.completionLabel, 'Ac₃');
  assert.equal(model.completionValid, false);
  assert.equal(model.eligible, false);
  assert.equal(model.austenitized, 0);
  assert.equal(model.penetrationIndex, 0);
  assert.equal(model.surfaceHV, null);
  assert.equal(model.coreHV, null);
  assert.equal(model.quantitativeValid, false);
  assert.match(model.reason, /invalid critical-temperature sequence/i);

  win.__SPX.release4.render();
  assert.match(doc.getElementById('spx-r4-diff-status').textContent,
    /quantitative transformation response is unavailable.*Ac₃.*at or below Ac1/i);
  assert.match(doc.getElementById('spx-r4-diff-metrics').textContent,
    /Unavailable.*at or below Ac(?:1|₁)/i);
  assert.doesNotMatch(doc.getElementById('spx-r4-diff-metrics').textContent,
    /\d+(?:\.\d+)?\s*HV/i);
});

test('generic diffusion proxy does not invent grade-independent hardness values', async t => {
  const { win, doc } = await tool(t);
  doc.querySelector('#spx-r4-treatment-grid [data-treatment="nitriding"]').click();
  const model = win.__SPX.release4.surface();
  assert.equal(model.surfaceHV, null);
  assert.equal(model.coreHV, null);
  assert.ok(model.pts.every(point => point.hv === null));

  const metrics = doc.getElementById('spx-r4-diff-metrics').textContent;
  assert.match(metrics, /—Estimated hardness/i);
  assert.match(metrics, /grade-specific hardness traverse/i);
  assert.doesNotMatch(metrics, /\d+(?:\.\d+)?\s*HV/i);
  assert.match(doc.getElementById('spx-r4-diff-svg').textContent,
    /relative case response/i);
  assert.doesNotMatch(doc.getElementById('spx-r4-diff-svg').textContent,
    /estimated hardness \(HV\)/i);
});

test('hardness panel does not use a fabricated universal HRC equation', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.release4.render();
  const text = doc.getElementById('spx-r4-hardness-convert').textContent;
  assert.match(text, /Rockwell C/);
  assert.match(text, /ASTM E140|ISO 18265/);
  assert.doesNotMatch(text, /\d+(?:\.\d+)?\s*HRC/,
    'no numeric HRC value is invented without a material-specific table');
});

test('live laboratory inputs reject out-of-range values and withhold dependent output', async t => {
  const { win, doc } = await tool(t);

  const surfaceTemp = doc.getElementById('spx-r4-diff-temp');
  const previousSurfaceTemp = win.state.r4.surface.temp;
  surfaceTemp.value = '1600';
  surfaceTemp.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(surfaceTemp.getAttribute('aria-invalid'), 'true');
  assert.equal(win.state.r4.surface.temp, previousSurfaceTemp,
    'an invalid molten-regime entry does not enter the diffusion model');
  assert.match(doc.getElementById('spx-r4-diff-metrics').textContent,
    /UnavailableQuantitative result/);
  assert.match(doc.getElementById('spx-r4-diff-status').textContent,
    /Input check required.*25.*1300.*withheld/i);
  assert.match(doc.getElementById('spx-r4-diff-svg').textContent,
    /result unavailable/i);

  surfaceTemp.value = '950';
  surfaceTemp.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(surfaceTemp.getAttribute('aria-invalid'), 'false');
  assert.equal(win.state.r4.surface.temp, 950);
  assert.doesNotMatch(doc.getElementById('spx-r4-diff-metrics').textContent,
    /UnavailableQuantitative result/);

  const carbon = doc.getElementById('spx-r4-mech-carbon');
  const previousCarbon = win.state.r4.mech.carbon;
  carbon.value = '-10';
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');
  assert.equal(win.state.r4.mech.carbon, previousCarbon);
  assert.match(doc.getElementById('spx-r4-mech-metrics').textContent,
    /UnavailableQuantitative result/);
  assert.doesNotMatch(doc.getElementById('spx-r4-mech-metrics').textContent,
    /-\d+\s*MPa/, 'negative strength claims are not rendered');
  assert.match(doc.getElementById('spx-r4-mech-svg').textContent,
    /result unavailable/i);

  doc.querySelector('#spx-r4-mech-chart [data-chart="fatigue"]').click();
  assert.match(doc.getElementById('spx-r4-mech-metrics').textContent,
    /UnavailableQuantitative result/,
  'chart switching cannot restore stale quantitative output while an input is invalid');

  const reduction = doc.getElementById('spx-r4-solid-reduction');
  reduction.value = '0';
  reduction.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.match(doc.getElementById('spx-r4-solid-metrics').textContent,
    /UnavailableQuantitative result/);
  win.requestAnimationFrame = callback => {
    callback(win.performance.now() + 9000);
    return 1;
  };
  doc.getElementById('spx-r4-solid-play').click();
  assert.match(doc.getElementById('spx-r4-solid-metrics').textContent,
    /UnavailableQuantitative result/,
  'animation cannot restore stale quantitative output while an input is invalid');

  const grain = doc.getElementById('spx-r4-meta-grain');
  grain.value = '0';
  grain.dispatchEvent(new win.Event('input', { bubbles: true }));
  doc.getElementById('spx-r4-meta-random').click();
  assert.match(doc.getElementById('spx-r4-meta-result').textContent,
    /Field unavailable.*ASTM grain number/i);
  doc.getElementById('spx-r4-meta-reveal').click();
  assert.match(doc.getElementById('spx-r4-meta-result').textContent,
    /Field unavailable.*ASTM grain number/i,
  'mystery actions cannot bypass metallography validation');
});

test('temperature input bounds follow the selected display unit', async t => {
  const { win, doc } = await tool(t);
  const surface = doc.getElementById('spx-r4-diff-temp');
  const temper = doc.getElementById('spx-r4-temper-temp');
  const mechanical = doc.getElementById('spx-r4-mech-temp');
  assert.deepEqual([Number(surface.min), Number(surface.max)], [25, 1300]);
  assert.deepEqual([Number(temper.min), Number(temper.max)], [100, 700]);
  assert.deepEqual([Number(mechanical.min), Number(mechanical.max)], [-200, 200]);

  win.setUnit('imperial');
  assert.deepEqual([Number(surface.min), Number(surface.max)], [77, 2372]);
  assert.deepEqual([Number(temper.min), Number(temper.max)], [212, 1292]);
  assert.deepEqual([Number(mechanical.min), Number(mechanical.max)], [-328, 392]);
});

test('restored temper cycles remain a whole-count input', async t => {
  const { win, doc } = await tool(t);
  const scenario = win.serializable();
  scenario.release4.temper.cycles = 2.6;

  assert.equal(win.restore(scenario), true);
  assert.equal(win.state.r4.temper.cycles, 3);
  assert.equal(doc.getElementById('spx-r4-temper-cycles').value, '3');
  assert.equal(doc.getElementById('spx-r4-temper-cycles').getAttribute('aria-invalid'), 'false');
});

test('austenitic selection withholds a ferritic-style Charpy DBTT and energy curve', async t => {
  const { win, doc } = await tool(t);
  const micro = doc.getElementById('spx-r4-mech-micro');
  micro.value = 'austenitic';
  micro.dispatchEvent(new win.Event('change', { bubbles: true }));
  doc.querySelector('#spx-r4-mech-chart [data-chart="charpy"]').click();

  const model = win.__SPX.release4.mechanical();
  assert.equal(model.charpyValid, false);
  assert.equal(model.dbtt, null);
  assert.equal(model.charpy, null);
  const metrics = doc.getElementById('spx-r4-mech-metrics').textContent;
  assert.match(metrics, /UnavailableCharpy at test T/i);
  assert.match(metrics, /No ferritic-style cleavage-transition model/i);
  assert.match(doc.getElementById('spx-r4-mech-status').textContent,
    /No ferritic-style cleavage DBTT.*grade-specific impact data/i);
  assert.match(doc.getElementById('spx-r4-mech-svg').textContent,
    /requires grade-specific data/i);
  assert.equal(doc.querySelector('#spx-r4-mech-svg path'), null,
    'no fabricated sigmoid remains on the chart');

  doc.querySelector('#spx-r4-mech-chart [data-chart="tensile"]').click();
  assert.match(doc.getElementById('spx-r4-mech-svg').getAttribute('aria-label'),
    /stress-strain teaching curve/i);
  assert.ok(doc.querySelector('#spx-r4-mech-svg path'),
    'the valid tensile curve returns after leaving the unavailable Charpy view');
  assert.doesNotMatch(doc.getElementById('spx-r4-mech-svg').getAttribute('aria-label'),
    /Charpy response unavailable/i);
});

test('zero initial retained austenite reports reduction as not applicable', async t => {
  const { win, doc } = await tool(t);
  const input = doc.getElementById('spx-r4-temper-ra');
  input.value = '0';
  input.dispatchEvent(new win.Event('input', { bubbles: true }));
  const card = [...doc.querySelectorAll('#spx-r4-temper-scores .spx-r4-score')]
    .find(node => /Retained-austenite reduction/i.test(node.textContent));
  assert.ok(card);
  assert.match(card.textContent, /N\/A.*initial retained austenite is 0%/i);
  assert.doesNotMatch(card.textContent, /Very high/i);
});

test('plain-carbon tempering has no hidden toughness penalty with zero reported embrittlement', async t => {
  const { win } = await tool(t);
  Object.assign(win.state.r4.temper, { family: 'plain', time: 2, cycles: 1, cool: 'air' });
  const below = win.__SPX.release4.temper(349);
  const inside = win.__SPX.release4.temper(351);
  assert.equal(below.emb, 0);
  assert.equal(inside.emb, 0);
  assert.ok(inside.tough >= below.tough - 2,
    'crossing 350 °C must not trigger an undisclosed 12-point toughness loss');
});

test('surface-treatment entry points do not promise universal hardness or physical hardened depth', async t => {
  const { doc } = await tool(t);
  const question = [...doc.querySelectorAll('#spx-question-grid [data-release4-route="surface"]')][0];
  assert.match(question.textContent, /concentration thresholds.*unitless transformation-response/i);
  assert.doesNotMatch(question.textContent, /transformation-hardening depth/i);
  assert.match(doc.querySelector('[data-r4-content="surface"] .spx-card-title').textContent,
    /unitless transformation-response.*Physical hardened depth requires.*validation/i);
  const guide = fs.readFileSync(path.join(__dirname, '..', 'tools', 'steel-phase-explorer', 'how-to-use', 'index.html'), 'utf8');
  assert.match(guide, /does not calculate physical hardened depth/i);
  assert.doesNotMatch(guide, /Review solute concentration, hardness versus depth/i);
});

test('solidification porosity metrics are explicitly independent tendencies', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.release4.render();
  const metrics = doc.getElementById('spx-r4-solid-metrics').textContent;
  assert.match(metrics, /Baseline porosity tendency/);
  assert.match(metrics, /Closure potential/);
  assert.doesNotMatch(metrics, /Porosity remaining|Porosity closure/);
  assert.match(doc.getElementById('spx-r4-solid-status').textContent,
    /separate directional indices, not complementary phase fractions/i);
});

test('cast-stage baseline porosity is independent of future closure controls', async t => {
  const { win } = await tool(t);
  const s = win.state.r4.solid;
  Object.assign(s, { stage: 0, carbon: .2, seg: 55, gradient: 60, nucleation: 45,
    reduction: 1, soft: 0 });
  const minimalClosure = win.__SPX.release4.solidification();
  Object.assign(s, { reduction: 40, soft: 100 });
  const strongClosure = win.__SPX.release4.solidification();

  assert.equal(strongClosure.porosity, minimalClosure.porosity,
    'future rolling and soft-reduction settings do not rewrite the starting tendency');
  assert.ok(strongClosure.closure > minimalClosure.closure);
});

test('stainless weld equivalents are not shown as phase percentages or applied downstream', async t => {
  const { win, doc } = await tool(t);
  doc.querySelector('#spx-r4-alloy-tabs [data-family="stainless"]').click();
  const model = win.__SPX.release4.family();
  const labels = model.scores.map(row => row[0]).join(' ');
  assert.doesNotMatch(labels, /austenite tendency|ferrite tendency/i);
  assert.match(model.status, /weld-metal screening/i);
  assert.match(model.status, /not base-metal phase percentages/i);

  const apply = doc.getElementById('spx-r4-family-apply');
  assert.equal(apply.disabled, true);
  const before = JSON.stringify(win.state.chem);
  apply.disabled = false;
  apply.click();
  assert.equal(JSON.stringify(win.state.chem), before,
    'the handler independently refuses incompatible stainless chemistry');

  for (const family of ['tool', 'cast']) {
    doc.querySelector(`#spx-r4-alloy-tabs [data-family="${family}"]`).click();
    assert.equal(apply.disabled, true, `${family} transfer is disabled`);
  }
  doc.querySelector('#spx-r4-alloy-tabs [data-family="plain"]').click();
  assert.equal(apply.disabled, false, 'plain/low-alloy remains transferable');
});

test('plain-family controls enforce shared chemistry limits and reject invalid transfers', async t => {
  const { win, doc } = await tool(t);
  doc.querySelector('#spx-r4-alloy-tabs [data-family="plain"]').click();
  const apply = doc.getElementById('spx-r4-family-apply');
  const carbon = doc.getElementById('spx-r4-fam-C');
  const manganese = doc.getElementById('spx-r4-fam-Mn');

  assert.equal(Number(carbon.min), 0);
  assert.equal(Number(carbon.max), win.CHEM_LIMITS.C);
  assert.equal(Number(manganese.max), win.CHEM_LIMITS.Mn);

  const before = JSON.stringify(win.state.chem);
  carbon.value = String(win.CHEM_LIMITS.C + .01);
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');
  assert.equal(apply.disabled, true);
  assert.match(doc.getElementById('spx-r4-family-status').textContent,
    /Cannot apply chemistry.*C must be 0/i);
  apply.disabled = false;
  apply.click();
  assert.equal(JSON.stringify(win.state.chem), before,
    'the handler rejects an invalid live control even if the button is forced enabled');

  carbon.value = String(win.CHEM_LIMITS.C);
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(carbon.getAttribute('aria-invalid'), 'false');
  assert.equal(apply.disabled, false);
  apply.click();
  assert.equal(win.state.chem.C, win.CHEM_LIMITS.C);

  const chemistryAfterValidApply = JSON.stringify(win.state.chem);
  win.state.r4.familyData.plain.Mn = win.CHEM_LIMITS.Mn + 1;
  win.__SPX.release4.render();
  assert.equal(apply.disabled, true, 'invalid stored chemistry also blocks transfer');
  apply.disabled = false;
  apply.click();
  assert.equal(JSON.stringify(win.state.chem), chemistryAfterValidApply);
});

test('plain-family mode withholds dependent indicators outside shared model scope', async t => {
  const { win, doc } = await tool(t);
  doc.querySelector('#spx-r4-alloy-tabs [data-family="plain"]').click();

  function setFamily(key, value) {
    const input = doc.getElementById(`spx-r4-fam-${key}`);
    input.value = String(value);
    input.dispatchEvent(new win.Event('input', { bubbles: true }));
  }
  function assertQuarantined(reason) {
    const model = win.__SPX.release4.family();
    const metrics = Object.fromEntries(model.metrics.map(row => [row[0], row[1]]));
    assert.equal(model.scopeValid, false);
    assert.notEqual(metrics['CE IIW'], 'Unavailable');
    assert.notEqual(metrics.Pcm, 'Unavailable');
    assert.equal(metrics.Ms, 'Unavailable');
    assert.equal(metrics.Hardenability, 'Unavailable');
    assert.equal(model.scores.length, 0);
    assert.match(model.status, reason);
    assert.match(doc.getElementById('spx-r4-family-metrics').textContent,
      /Raw formula value only.*Unavailable/is);
    assert.equal(doc.getElementById('spx-r4-family-scores').textContent, '');
    assert.match(doc.getElementById('spx-r4-family-status').textContent,
      /not weldability or cracking interpretations/i);
  }

  setFamily('C', 0);
  assertQuarantined(/below the 0\.02 wt% lower scope/i);

  setFamily('C', .60);
  setFamily('Cr', 5);
  assert.ok(win.__SPX.chemMetrics().ac3 > win.__SPX.chemMetrics().ac1,
    'shared chemistry remains unchanged until Apply');
  assertQuarantined(/completion estimate.*at or below Ac₁/i);
});

test('plain-family Apply clears a stale core chemistry validation alert', async t => {
  const { win, doc } = await tool(t);
  const coreCarbon = doc.getElementById('spx-chem-C');
  coreCarbon.value = '50';
  coreCarbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  const warning = doc.getElementById('spx-chem-validation');
  assert.equal(warning.hidden, false);

  doc.querySelector('#spx-r4-alloy-tabs [data-family="plain"]').click();
  const apply = doc.getElementById('spx-r4-family-apply');
  assert.equal(apply.disabled, false);
  apply.click();
  assert.equal(warning.hidden, true);
  assert.equal(warning.textContent, '');
});

test('plain-family Apply replaces every shared chemistry term and keeps CE/Pcm aligned', async t => {
  const { win, doc } = await tool(t);
  const grade = doc.getElementById('spx-grade-preset');
  grade.value = 'x70';
  doc.getElementById('spx-apply-grade').click();
  assert.ok(win.state.chem.V > 0 && win.state.chem.Nb > 0 &&
    win.state.chem.Ti > 0 && win.state.chem.Cu > 0,
  'fixture begins with residual microalloying and copper terms');

  doc.querySelector('#spx-r4-alloy-tabs [data-family="plain"]').click();
  const family = win.__SPX.release4.family();
  const familyMetrics = Object.fromEntries(family.metrics);
  doc.getElementById('spx-r4-family-apply').click();

  for (const key of win.CHEM_KEYS) {
    assert.equal(win.state.chem[key], win.state.r4.familyData.plain[key],
      `${key} is replaced rather than preserved from the previous grade`);
  }
  assert.deepEqual(
    [win.state.chem.V, win.state.chem.Nb, win.state.chem.Ti, win.state.chem.Cu],
    [0, 0, 0, 0]
  );
  const shared = win.__SPX.chemMetrics();
  assert.equal(shared.ce.toFixed(3), familyMetrics['CE IIW']);
  assert.equal(shared.pcm.toFixed(3), familyMetrics.Pcm);
});

test('metallography mystery answer remains hidden until reveal', async t => {
  const { win, doc } = await tool(t);
  win.Math.random = () => .51; // martensite in the six-item mystery list
  const structure = doc.getElementById('spx-r4-meta-structure');
  const before = structure.value;
  doc.getElementById('spx-r4-meta-random').click();
  assert.equal(structure.value, before, 'visible selector does not expose the answer');
  assert.match(doc.getElementById('spx-r4-meta-result').textContent, /identity is hidden/i);
  assert.doesNotMatch(doc.getElementById('spx-r4-meta-result').textContent, /martensite/i);
  assert.doesNotMatch(doc.getElementById('spx-r4-meta-quiz').textContent, /martensite/i);

  doc.getElementById('spx-r4-meta-reveal').click();
  assert.match(doc.getElementById('spx-r4-meta-result').textContent, /martensite/i);
  assert.match(doc.getElementById('spx-r4-meta-quiz').textContent, /answer: martensite/i);
});

test('restored Release 4 state is sanitized and cannot inject family-input markup', async t => {
  const { win, doc } = await tool(t);
  const payload = win.serializable();
  payload.release4.panel = 'families';
  payload.release4.family = 'plain';
  payload.release4.surface.treatment = 'not-a-treatment';
  payload.release4.familyData.plain.C = '0.2\"><img id="spx-r4-injected" src="x">';
  payload.release4.familyData.plain.Mn = Infinity;

  assert.doesNotThrow(() => assert.equal(win.restore(payload), true));
  assert.equal(doc.getElementById('spx-r4-injected'), null);
  assert.equal(win.state.r4.surface.treatment, 'carburize');
  assert.equal(win.state.r4.familyData.plain.C, .2);
  assert.equal(win.state.r4.familyData.plain.Mn, 1.2);
  assert.ok(Number.isFinite(Number(doc.getElementById('spx-r4-fam-C').value)));
});

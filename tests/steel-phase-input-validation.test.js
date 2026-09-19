'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

async function tool(t) {
  const ctx = bootTool();
  await ready(ctx.win);
  t.after(() => ctx.win.close());
  return ctx;
}

function input(win, element, value) {
  element.value = String(value);
  element.dispatchEvent(new win.Event('input', { bubbles: true }));
}

test('equilibrium point inputs reject blank and out-of-domain values without changing the model', async t => {
  const { win, doc } = await tool(t);
  const carbon = doc.getElementById('spx-input-carbon');
  const temperature = doc.getElementById('spx-input-temp');
  const initial = win.__SPX.getPoints()[0];

  input(win, carbon, 2);
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');
  assert.match(carbon.validationMessage, /between 0 and 1\.2/i);
  assert.equal(win.__SPX.getPoints()[0].c, initial.c);

  input(win, temperature, 2000);
  assert.equal(temperature.getAttribute('aria-invalid'), 'true');
  assert.match(temperature.validationMessage, /between 25 and 1250/i);
  assert.equal(win.__SPX.getPoints()[0].t, initial.t);

  input(win, carbon, '');
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');
  assert.equal(win.__SPX.getPoints()[0].c, initial.c);

  input(win, carbon, .4);
  assert.equal(carbon.getAttribute('aria-invalid'), 'false');
  assert.equal(carbon.validationMessage, '');
  assert.equal(win.__SPX.getPoints()[0].c, .4);
});

test('cycle durations reject non-finite and out-of-range edits without corrupting the path', async t => {
  const { win, doc } = await tool(t);
  const duration = doc.querySelector('#spx-cycle-rows [data-cycle-d="0"]');
  const initial = win.state.cycle[0].d;
  assert.equal(Number(duration.min), .1);
  assert.equal(Number(duration.max), 100000);

  for (const value of [-5, '', 100001]) {
    input(win, duration, value);
    assert.equal(duration.getAttribute('aria-invalid'), 'true');
    assert.equal(win.state.cycle[0].d, initial, `invalid duration ${value} changed state`);
    assert.match(doc.getElementById('spx-path-live').textContent,
      /Equilibrium reference unavailable.*duration must be 0\.1–100000 min/i);
    for (const path of doc.querySelectorAll('#spx-cycle-svg [d]')) {
      assert.doesNotMatch(path.getAttribute('d'), /NaN|Infinity/);
    }
  }

  input(win, duration, 12.5);
  assert.equal(duration.getAttribute('aria-invalid'), 'false');
  assert.equal(duration.validationMessage, '');
  assert.equal(win.state.cycle[0].d, 12.5);
  assert.doesNotMatch(doc.getElementById('spx-path-live').textContent,
    /Equilibrium reference unavailable/i);
});

test('an explicitly empty thermal cycle survives save and restore', async t => {
  const { win, doc } = await tool(t);
  const payload = JSON.parse(JSON.stringify(win.serializable()));
  payload.cycle = [];
  assert.ok(win.state.cycle.length > 0, 'the current preset begins with steps');

  assert.equal(win.restore(payload), true);
  assert.deepEqual(JSON.parse(JSON.stringify(win.state.cycle)), []);
  assert.equal(doc.querySelectorAll('#spx-cycle-rows tr').length, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(win.serializable().cycle)), []);
  for (const path of doc.querySelectorAll('#spx-cycle-svg [d]')) {
    assert.doesNotMatch(path.getAttribute('d'), /NaN|Infinity/);
  }
});

test('restored path temperatures outside the diagram and blank carbon stay quarantined', async t => {
  const { win, doc } = await tool(t);
  assert.equal(win.restore({
    unit: 'metric',
    points: [{ id: 1, c: .2, t: 900 }],
    cycle: [{ t: 1400, d: 10, m: 'Out-of-range restored step' }]
  }), true);

  const temperature = doc.querySelector('#spx-cycle-rows [data-cycle-t="0"]');
  assert.equal(temperature.value, '1400');
  assert.equal(temperature.required, true);
  assert.equal(temperature.getAttribute('aria-invalid'), 'true');
  assert.match(temperature.validationMessage, /between 25 °C and 1250 °C/i);
  assert.match(doc.getElementById('spx-path-live').textContent,
    /Equilibrium reference unavailable/i);

  input(win, temperature, 900);
  assert.equal(temperature.getAttribute('aria-invalid'), 'false');
  assert.equal(temperature.validationMessage, '');

  const carbon = doc.getElementById('spx-path-carbon');
  input(win, carbon, '');
  assert.equal(carbon.required, true);
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');
  assert.match(carbon.validationMessage, /between 0 and 1\.2 wt%/i);
  assert.match(doc.getElementById('spx-path-live').textContent,
    /Equilibrium reference unavailable/i);

  input(win, carbon, .2);
  assert.equal(carbon.getAttribute('aria-invalid'), 'false');
  assert.equal(carbon.validationMessage, '');
});

test('Ms-based path presets do not tailor or claim Ms outside the shared model scope', async t => {
  const { win, doc } = await tool(t);
  const carbon = doc.getElementById('spx-path-carbon');
  const preset = doc.getElementById('spx-path-preset');

  win.state.chem.C = 0;
  input(win, carbon, 0);
  preset.value = 'austemper';
  preset.dispatchEvent(new win.Event('change', { bubbles: true }));
  let modes = [...doc.querySelectorAll('#spx-cycle-rows [data-cycle-m]')]
    .map(element => element.value).join(' ');
  let temperatures = [...doc.querySelectorAll('#spx-cycle-rows [data-cycle-t]')]
    .map(element => Number(element.value));
  assert.equal(temperatures[1], 350, 'below-scope input keeps the generic placeholder bath');
  assert.equal(temperatures[2], 350);
  assert.doesNotMatch(modes, /estimated Ms/i);
  assert.match(modes, /Ms tailoring unavailable/i);
  assert.match(doc.getElementById('spx-path-live').textContent,
    /Ms-based austemper tailoring unavailable.*below.*0\.02 wt%/is);
  assert.doesNotMatch(doc.getElementById('spx-path-live').textContent,
    /Equilibrium reference unavailable/i);

  Object.assign(win.state.chem, { C: .60, Cr: 5 });
  input(win, carbon, .60);
  preset.value = 'martemper';
  preset.dispatchEvent(new win.Event('change', { bubbles: true }));
  modes = [...doc.querySelectorAll('#spx-cycle-rows [data-cycle-m]')]
    .map(element => element.value).join(' ');
  temperatures = [...doc.querySelectorAll('#spx-cycle-rows [data-cycle-t]')]
    .map(element => Number(element.value));
  assert.equal(temperatures[1], 220, 'invalid critical ordering keeps the generic placeholder bath');
  assert.equal(temperatures[2], 220);
  assert.doesNotMatch(modes, /estimated Ms/i);
  assert.match(doc.getElementById('spx-path-live').textContent,
    /Ms-based martemper tailoring unavailable.*completion estimate.*at or below Ac₁/is);
});

test('trade-off cooling endpoints map exactly onto both downstream rate controls', async t => {
  const { win, doc } = await tool(t);
  const tradeCooling = doc.getElementById('spx-trade-cooling');
  const apply = doc.getElementById('spx-apply-tradeoff');
  const kinetic = doc.getElementById('spx-kin-cooling');
  const property = doc.getElementById('spx-property-rate');

  assert.equal(Number(property.max), 160,
    'the Chemistry slider must cover 0.1–1000 °C/s with its logarithmic mapping');

  input(win, tradeCooling, 100);
  apply.click();
  assert.equal(Number(kinetic.value), 1000);
  assert.equal(Number(property.value), 160);
  assert.equal(doc.getElementById('spx-property-rate-label').textContent, '1000 °C/s');
  assert.match(doc.getElementById('spx-trade-status').textContent,
    /kinetic cooling rate set to 1000 °C\/s.*property control set to 1000 °C\/s/i);

  input(win, tradeCooling, 0);
  apply.click();
  assert.equal(Number(kinetic.value), .1);
  assert.equal(Number(property.value), 0);
  assert.equal(doc.getElementById('spx-property-rate-label').textContent, '0.1 °C/s');
});

test('Release 1 trade-off scores and Apply are gated by shared chemistry validity', async t => {
  const { win, doc } = await tool(t);
  Object.assign(win.state.chem, { C: .60, Cr: 5 });
  const tradeCarbon = doc.getElementById('spx-trade-carbon');
  input(win, tradeCarbon, .60);
  win.__SPX.release1.render();

  const model = win.__SPX.release1.tradeModel();
  assert.equal(model.valid, false);
  assert.match(model.reason, /completion estimate.*at or below Ac₁/i);
  assert.match(doc.getElementById('spx-trade-results').textContent,
    /Trade-off outputs unavailable.*No martensite, hardness.*weldability/is);
  assert.equal(doc.querySelectorAll('#spx-trade-results .spx-score-track').length, 0);

  const chemistryBefore = win.state.chem.C;
  const pointBefore = win.__SPX.getState().c;
  const kineticBefore = doc.getElementById('spx-kin-cooling').value;
  doc.getElementById('spx-apply-tradeoff').click();
  assert.equal(win.state.chem.C, chemistryBefore);
  assert.equal(win.__SPX.getState().c, pointBefore);
  assert.equal(doc.getElementById('spx-kin-cooling').value, kineticBefore);
  assert.match(doc.getElementById('spx-trade-status').textContent,
    /Not applied.*existing scenario was retained/is);
});

test('core and Release 1 property views quarantine numbers below their carbon scope', async t => {
  const { win, doc } = await tool(t);
  const carbon = doc.getElementById('spx-chem-C');
  input(win, carbon, 0);
  const estimate = win.__SPX.propertyEstimate(10);
  assert.equal(estimate.valid, false);
  assert.match(estimate.reason, /below.*0\.02 wt%/i);
  const propertyPanel = doc.getElementById('spx-property-metrics');
  assert.match(propertyPanel.textContent, /Hardness.*Unavailable|Unavailable.*Hardness/i);
  assert.doesNotMatch(propertyPanel.textContent, /\d+\s*[–-]\s*\d+\s*(?:HV|MPa)/);

  const chemistryMetrics = [...doc.querySelectorAll('#spx-chem-metrics .spx-metric')];
  const metricValue = label => chemistryMetrics.find(node => node.textContent.includes(label))
    .querySelector('b').textContent;
  assert.equal(metricValue('Ac₁'), 'Unavailable');
  assert.equal(metricValue('Ms'), 'Unavailable');
  assert.equal(metricValue('Weldability'), 'Unavailable');
  assert.match(doc.getElementById('spx-chem-metrics').textContent, /Raw formula value only/i);

  win.__SPX.release1.setBasis('rapid', false);

  const propertyStage = doc.querySelectorAll('#spx-causal-chain .spx-causal-stage')[3];
  assert.match(propertyStage.textContent, /Property estimate unavailable.*below.*0\.02 wt%/i);
  assert.doesNotMatch(propertyStage.textContent, /\d+\s*[–-]\s*\d+\s*(?:HV|MPa)/);
  assert.match(doc.getElementById('spx-critical-plot').textContent,
    /Ac, Ar, and Ms estimates unavailable.*below.*0\.02 wt%/i);
  assert.equal(doc.querySelector('#spx-kinetics-svg [data-kin="Martensite start"]'), null);
});

test('property screens suppress slow-cooling martensite and agree across modules', async t => {
  const { win } = await tool(t);
  const rates = [.1, 1, 10, 100, 1000];
  for (const grade of ['1045', '1080', '4140']) {
    win.state.chem = Object.assign({}, win.GRADE_PRESETS[grade]);
    let previousMart = -1;
    let previousHV = -1;
    for (const rate of rates) {
      const core = win.__SPX.propertyEstimate(rate);
      const release1 = win.__SPX.release1.propertyEstimate(win.state.chem, rate);
      assert.ok(core.mart >= previousMart - 1e-12,
        `${grade} martensite must not fall as cooling rate rises`);
      assert.ok(core.hv >= previousHV - 1e-12,
        `${grade} hardness must not fall as cooling rate rises`);
      for (const key of ['mart', 'bain', 'fp', 'hv', 'uts', 'ys', 'elong']) {
        assert.ok(Math.abs(core[key] - release1[key]) < 1e-12,
          `${grade} ${key} differs between core and Release 1 at ${rate} °C/s`);
      }
      previousMart = core.mart;
      previousHV = core.hv;
    }
    const slow = win.__SPX.propertyEstimate(.1);
    const fast = win.__SPX.propertyEstimate(1000);
    assert.ok(slow.mart < 1e-12, `${grade} slow-cooling martensite must approach zero`);
    assert.ok(slow.bain < 1e-12, `${grade} slider minimum should remain diffusional`);
    assert.ok(fast.mart > slow.mart + .25, `${grade} fast cooling must raise martensite`);
    assert.ok(fast.hv > slow.hv, `${grade} fast cooling must raise hardness`);
  }
});

test('kinetics chart contains the valid -100 °C endpoint inside its plot area', async t => {
  const { win, doc } = await tool(t);
  input(win, doc.getElementById('spx-kin-final'), -100);

  const thermalPath = doc.querySelector('#spx-kinetics-svg [data-kin="Thermal path"]');
  const coordinates = thermalPath.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);
  const yCoordinates = coordinates.filter((value, index) => index % 2 === 1);
  assert.equal(yCoordinates.at(-1), 450, 'the minimum accepted temperature should meet the plot floor');
  assert.ok(Math.max(...yCoordinates) <= 450, 'the thermal path must not enter the axis-label margin');
  assert.ok([...doc.querySelectorAll('#spx-kinetics-svg .spx-tick')]
    .some(label => label.textContent === '-100'), 'the accepted temperature floor should be labelled');
});

test('Release 1 causal chain withholds rapid process and properties for invalid kinetics inputs', async t => {
  const { win, doc } = await tool(t);
  win.__SPX.release1.setBasis('rapid', false);
  const cooling = doc.getElementById('spx-kin-cooling');
  input(win, cooling, 10000);

  const stages = doc.querySelectorAll('#spx-causal-chain .spx-causal-stage');
  assert.match(stages[1].textContent, /Rapid-cooling process unavailable.*0\.01–1000 °C\/s/is);
  assert.doesNotMatch(stages[1].textContent, /approximately\s+\d/i);
  assert.match(stages[3].textContent, /Property estimate unavailable.*inputs are invalid/is);
  assert.doesNotMatch(stages[3].textContent, /\d+\s*[–-]\s*\d+\s*(?:HV|MPa)/);
});

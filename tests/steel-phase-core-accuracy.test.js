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

test('the exact A1 isotherm is invariant across its applicable composition range', async t => {
  const { win, doc } = await tool(t);
  for (const carbon of [0.20, 0.77, 1.10]) {
    const result = win.__SPX.phaseFractions(carbon, 727);
    assert.equal(result.region.key, 'eutectoid', `${carbon} wt% C at A1`);
    assert.deepEqual(JSON.parse(JSON.stringify(result.fractions)), {});
    assert.match(result.formula, /not uniquely determined/i);
  }
  assert.equal(win.__SPX.classify(0.01, 727).key, 'alpha',
    'composition below the ferrite-solubility endpoint remains ferrite');
  assert.equal(win.__SPX.classify(0.022, 727).key, 'alpha',
    'the ferrite endpoint collapses to the endpoint phase');
  assert.notEqual(win.__SPX.classify(0.20, 727.02).key, 'eutectoid');
  assert.notEqual(win.__SPX.classify(0.20, 726.98).key, 'eutectoid');

  win.__SPX.setPoint(0.20, 727);
  win.__SPX.release1.render();
  assert.match(doc.getElementById('spx-results').textContent, /Eutectoid invariant/i);
  assert.match(doc.getElementById('spx-results').textContent, /not uniquely defined/i);
  assert.match(doc.getElementById('spx-compare-body').textContent,
    /Invariant proportions not uniquely defined/i);
  assert.match(doc.querySelectorAll('#spx-causal-chain .spx-causal-stage')[2].textContent,
    /Invariant phase proportions unavailable.*reaction extent/i);
});

test('quiz hint recognizes the exact A1 invariant isotherm', async t => {
  const { win, doc } = await tool(t);
  win.state.quiz = { c: 0.40, t: 727, key: 'eutectoid' };
  doc.getElementById('spx-quiz-hint').click();
  assert.match(doc.getElementById('spx-quiz-answer').textContent,
    /exactly on the A₁ invariant isotherm.*reaction extent/i);
});

test('out-of-range chemistry input retains valid state and presets clear the warning', async t => {
  const { win, doc } = await tool(t);
  const carbon = doc.getElementById('spx-chem-C');
  const before = win.state.chem.C;
  carbon.value = '50';
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(win.state.chem.C, before);
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');
  assert.equal(doc.getElementById('spx-chem-validation').hidden, false);
  assert.match(doc.getElementById('spx-chem-validation').textContent, /previous valid value is retained/i);

  carbon.value = '';
  carbon.dispatchEvent(new win.Event('input', { bubbles: true }));
  assert.equal(win.state.chem.C, before, 'blank chemistry retains the previous valid value');
  assert.equal(carbon.getAttribute('aria-invalid'), 'true');
  assert.equal(doc.getElementById('spx-chem-validation').hidden, false);

  doc.getElementById('spx-grade-preset').value = '1045';
  doc.getElementById('spx-apply-grade').click();
  assert.equal(doc.getElementById('spx-chem-validation').hidden, true);
  assert.equal(win.state.chem.C, 0.45);
});

test('restoration rejects out-of-range chemistry and handles huge duplicate point ids safely', async t => {
  const { win, doc } = await tool(t);
  const payload = win.serializable();
  const previousCarbon = win.state.chem.C;
  payload.chem = Object.assign({}, payload.chem, { C: 50 });
  // Leave one slot below the documented 20-point ceiling so this also proves
  // that the next generated id remains safe after hostile duplicate ids.
  payload.points = Array.from({ length: 19 }, (_, i) => ({
    id: i === 0 ? 1000000 : Number.MAX_VALUE,
    c: i / 20,
    t: 700 + i
  }));
  assert.equal(win.restore(payload), true);
  assert.equal(win.state.chem.C, previousCarbon);
  assert.match(doc.getElementById('spx-scenario-warning').textContent, /out-of-range chemistry/i);
  const ids = win.__SPX.getPoints().map(p => p.id);
  assert.equal(ids.length, 19);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every(id => Number.isSafeInteger(id) && id > 0 && id <= 1000000));
  assert.ok(Number.isSafeInteger(win.state.nextId));
  assert.ok(win.state.nextId > 0 && win.state.nextId <= 1000000);
  const added = win.__SPX.addPoint(0.4, 800);
  assert.ok(Number.isSafeInteger(added) && added > 0 && added <= 1000000);
  const capped = win.__SPX.getPoints().map(p => p.id);
  assert.equal(capped.length, 20);
  assert.equal(new Set(capped).size, capped.length);
  assert.equal(doc.getElementById('spx-add-point').disabled, true);
  assert.equal(win.__SPX.addPoint(0.4, 800), null, 'the API enforces the saved point cap');
  assert.equal(win.__SPX.getPoints().length, 20);

  win.__SPX.removePoint(capped[capped.length - 1]);
  assert.equal(doc.getElementById('spx-add-point').disabled, false);
  const replacement = win.__SPX.addPoint(0.4, 800);
  const after = win.__SPX.getPoints().map(p => p.id);
  assert.ok(Number.isSafeInteger(replacement) && replacement > 0 && replacement <= 1000000);
  assert.equal(after.length, 20);
  assert.equal(new Set(after).size, after.length);
  assert.equal(doc.getElementById('spx-add-point').disabled, true);
});

test('invalid joint critical-temperature ordering is quarantined across dependent modules', async t => {
  const { win, doc } = await tool(t);
  const payload = win.serializable();
  payload.chem = Object.assign({}, payload.chem, { C: 0.60, Cr: 5 });
  assert.equal(win.restore(payload), true);
  const critical = win.__SPX.chemMetrics();
  assert.ok(critical.ac3 <= critical.ac1);
  assert.deepEqual(JSON.parse(JSON.stringify(win.__SPX.kineticsFractions())), {});
  assert.equal(win.__SPX.release2.austModel().reference.valid, false);
  Object.assign(win.state.r4.surface, {
    treatment: 'induction', power: 100, time: 100, temp: 1100
  });
  assert.equal(win.__SPX.release4.surface().eligible, false);
  assert.match(doc.getElementById('spx-kin-results').textContent, /unavailable/i);
  const kineticsSvg = doc.getElementById('spx-kinetics-svg');
  assert.equal(kineticsSvg.dataset.modelState, 'unavailable');
  assert.equal(kineticsSvg.querySelector('[data-kin="Martensite start"]'), null);
  assert.equal(kineticsSvg.querySelector('[data-kin="Thermal path"]'), null);
  assert.equal(kineticsSvg.querySelector('[data-kin="Pearlite start"]'), null);
  assert.doesNotMatch(kineticsSvg.textContent, /Ms\s+-?\d/i);
  assert.match(kineticsSvg.textContent, /curves and thermal path unavailable/i);
  assert.match(doc.getElementById('spx-kin-note').textContent,
    /curves, the Ms reference, the selected thermal path.*are unavailable/i);
  assert.doesNotMatch(doc.getElementById('spx-kin-note').textContent,
    /plotted curves remain/i);
  const property = win.__SPX.propertyEstimate(100);
  assert.equal(property.valid, false);
  assert.match(property.reason, /completion estimate.*at or below Ac₁/i);
  assert.match(doc.getElementById('spx-property-metrics').textContent,
    /Hardness.*Unavailable|Unavailable.*Hardness/i);
  assert.doesNotMatch(doc.getElementById('spx-property-metrics').textContent,
    /\d+\s*[–-]\s*\d+\s*(?:HV|MPa)/);
  assert.match(doc.getElementById('spx-chem-metrics').textContent,
    /CE IIW.*Raw formula value only|Raw formula value only.*CE IIW/is);
  assert.match(doc.getElementById('spx-chem-metrics').textContent,
    /Weldability.*Unavailable|Unavailable.*Weldability/is);
  win.__SPX.release1.render();
  const stages = doc.querySelectorAll('#spx-causal-chain .spx-causal-stage');
  assert.match(stages[3].textContent, /Property estimate unavailable/i);
  assert.doesNotMatch(stages[3].textContent, /\d+\s*[–-]\s*\d+\s*(?:HV|MPa)/);
  assert.match(stages[4].textContent, /Weldability interpretation is unavailable/i);
});

test('hypereutectoid heating completion uses Acm spelling', async t => {
  const { win, doc } = await tool(t);
  win.state.chem = Object.assign({}, win.GRADE_PRESETS['1080']);
  win.__SPX.release1.render();
  const labels = [...doc.querySelectorAll('#spx-critical-plot .spx-critical-row strong')]
    .map(node => node.textContent);
  assert.ok(labels.includes('Acm*'));
  assert.ok(!labels.includes('Accm*'));
});

test('zero-carbon property screening fails closed', async t => {
  const { win } = await tool(t);
  win.state.chem.C = 0;
  const result = win.__SPX.propertyEstimate(100);
  assert.equal(result.valid, false);
  assert.match(result.reason, /below the 0\.02 wt% lower scope/i);
});

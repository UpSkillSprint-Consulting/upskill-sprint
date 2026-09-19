'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

async function tool() {
  const ctx = bootTool();
  await ready(ctx.win);
  return ctx;
}

function setInput(win, doc, id, value) {
  const element = doc.getElementById(id);
  assert.ok(element, `missing input: ${id}`);
  element.value = String(value);
  element.dispatchEvent(new win.Event('input', { bubbles: true }));
}

function setAustenitization(win, doc, temperature, hold, size) {
  setInput(win, doc, 'spx-aust-temp', temperature);
  setInput(win, doc, 'spx-aust-hold', hold);
  setInput(win, doc, 'spx-aust-size', size);
}

function setQuench(win, doc, values) {
  Object.entries(values).forEach(([name, value]) =>
    setInput(win, doc, `spx-quench-${name}`, value));
}

function setChemistry(win, values) {
  for (const key of win.CHEM_KEYS) win.state.chem[key] = Number(values[key] || 0);
  win.renderChemistry();
}

test('quench martensite cannot exceed the current austenitization estimate', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const release2 = win.__SPX.release2;

  setAustenitization(win, doc, 850, 10, 25);
  setQuench(win, doc, {
    medium: 'brine', bath: 25, agitation: 'vigorous', size: 20, delay: 0, final: 25
  });

  const aust = release2.austModel();
  const quench = release2.quenchModel();
  assert.ok(aust.diss > 0 && aust.diss < 0.5, 'fixture must be partially austenitized');
  assert.equal(quench.outcomeValid, true);
  assert.equal(quench.austeniteAvailable, aust.diss);
  for (const location of [quench.surface, quench.quarter, quench.center]) {
    assert.ok(location.mart <= aust.diss + 1e-12,
      `${location.loc} martensite exceeds available austenite`);
    assert.ok(Math.abs(location.preMs + location.mart + location.retained - aust.diss) < 1e-10,
      `${location.loc} transformation fractions do not close`);
  }
  assert.match(doc.getElementById('spx-quench-status').textContent,
    /Austenitization-limited result/i);
});

test('a low non-austenitizing start cannot produce a numeric martensite result', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  setAustenitization(win, doc, 600, 1, 25);
  setQuench(win, doc, { medium: 'oil', bath: 60, delay: 0, final: 25 });
  const quench = win.__SPX.release2.quenchModel();

  assert.equal(quench.austeniteAvailable, 0);
  assert.equal(quench.outcomeValid, false);
  assert.equal(Number.isNaN(quench.surface.mart), true);
  assert.match(doc.getElementById('spx-quench-status').textContent,
    /Quantitative result unavailable/i);
});

test('transfer delay never improves the hardening prediction', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const release2 = win.__SPX.release2;

  setAustenitization(win, doc, 900, 120, 25);
  setQuench(win, doc, { medium: 'oil', bath: 60, size: 50, final: 25, delay: 0 });
  const immediate = release2.quenchModel();
  assert.equal(immediate.outcomeValid, true);

  setInput(win, doc, 'spx-quench-delay', 20);
  const delayed = release2.quenchModel();
  assert.equal(delayed.outcomeValid, true);
  for (const key of ['surface', 'quarter', 'center']) {
    assert.ok(delayed[key].mart <= immediate[key].mart + 1e-12,
      `${key} martensite increased with transfer delay`);
    assert.ok(delayed[key].rate <= immediate[key].rate + 1e-12,
      `${key} cooling rate increased with transfer delay`);
  }

  setInput(win, doc, 'spx-quench-delay', 60);
  const outside = release2.quenchModel();
  assert.equal(outside.outcomeValid, false, 'path entering below 800 °C must be quarantined');
  assert.match(doc.getElementById('spx-quench-status').textContent,
    /longer transfer delay is not treated as improved hardening/i);
});

test('martensite assessment temperature controls results and the plotted path stop', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const release2 = win.__SPX.release2;

  setAustenitization(win, doc, 900, 120, 25);
  setQuench(win, doc, { medium: 'oil', bath: 60, size: 50, delay: 0, final: 25 });
  const cold = release2.quenchModel();
  setInput(win, doc, 'spx-quench-final', 400);
  const warm = release2.quenchModel();

  assert.equal(warm.outcomeValid, true);
  assert.ok(warm.surface.mart < cold.surface.mart,
    'warmer assessment must not predict more martensite');
  const finalLine = doc.querySelector('#spx-quench-svg [data-r2-final-line="true"]');
  assert.ok(finalLine, 'final-temperature line is plotted');
  const lineY = Number(finalLine.getAttribute('y1'));
  for (const path of doc.querySelectorAll('#spx-quench-svg path[class^="spx-r2-line-"]')) {
    const match = path.getAttribute('d').match(/L[\d.]+ ([\d.]+)$/);
    assert.ok(match, 'cooling path has a terminal point');
    assert.ok(Math.abs(Number(match[1]) - lineY) < 0.02,
      'cooling path does not terminate at the selected assessment temperature');
  }
  assert.match(doc.getElementById('spx-quench-svg').textContent, /Path stop 400 °C/);

  setInput(win, doc, 'spx-quench-final', 550);
  const incompleteT85 = release2.quenchModel();
  assert.equal(incompleteT85.outcomeValid, false);
  assert.equal(Number.isNaN(incompleteT85.surface.rate), true);
  assert.match(doc.getElementById('spx-quench-status').textContent,
    /stops the path above 500 °C/i);

  setInput(win, doc, 'spx-quench-final', 500);
  const completeT85 = release2.quenchModel();
  assert.equal(completeT85.outcomeValid, true,
    'a path ending exactly at 500 °C completes the t8/5 interval');
  assert.equal(Number.isFinite(completeT85.surface.rate), true);
});

test('an impossible hardness target is not called partial through-hardening', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  setInput(win, doc, 'spx-hard-target', 900);
  assert.equal(win.__SPX.release2.hardModel().targetAchievable, false);
  const status = doc.getElementById('spx-hard-status').textContent;
  assert.match(status, /Target exceeds estimated surface capability/i);
  assert.doesNotMatch(status, /Partial through-hardening/i);
});

test('more martensite cannot reduce the Release 2 hardness estimate', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setChemistry(win, { C: .02, Cr: 5 });

  const hard = win.__SPX.release2.hardModel();
  assert.equal(hard.eligible, true);
  assert.ok(hard.surface.mart >= hard.center.mart,
    'fixture must retain more martensite at the surface');
  assert.ok(hard.surface.hv >= hard.center.hv,
    'more martensite cannot make the estimated hardness lower');

  setAustenitization(win, doc, 900, 120, 25);
  setQuench(win, doc, { medium: 'brine', bath: 25, size: 20, delay: 0, final: 25 });
  const quench = win.__SPX.release2.quenchModel();
  assert.equal(quench.outcomeValid, true);
  assert.ok(quench.surface.mart >= quench.center.mart);
  assert.ok(quench.surface.hv >= quench.center.hv,
    'quench hardness must be monotone with the modeled martensite fraction');
});

test('invalid chemistry withholds Jominy, section, austenitization, and grain visuals', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setChemistry(win, { C: .60, Cr: 5 });

  const jominy = doc.getElementById('spx-jominy-svg');
  const section = doc.getElementById('spx-section-canvas');
  const windowCanvas = doc.getElementById('spx-aust-window-canvas');
  const grainCanvas = doc.getElementById('spx-grain-canvas');
  assert.equal(jominy.dataset.modelState, 'unavailable');
  assert.equal(jominy.querySelectorAll('path,circle').length, 0);
  assert.equal(section.dataset.modelState, 'unavailable');
  assert.equal(windowCanvas.dataset.modelState, 'unavailable');
  assert.equal(grainCanvas.dataset.modelState, 'unavailable');
  for (const visual of [jominy, section, windowCanvas, grainCanvas]) {
    assert.match(visual.getAttribute('aria-label'), /unavailable/i);
  }
  assert.match(doc.getElementById('spx-hard-metrics').textContent, /Unavailable/i);
  assert.match(doc.getElementById('spx-aust-metrics').textContent, /Unavailable/i);
});

test('below-scope carbon withholds austenitization and every dependent process output', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setChemistry(win, { C: 0 });

  const aust = win.__SPX.release2.austModel();
  const quench = win.__SPX.release2.quenchModel();
  assert.equal(aust.carbonEligible, false);
  assert.equal(aust.valid, false);
  assert.match(aust.reason, /below.*0\.02 wt% lower scope/i);
  assert.ok(Number.isNaN(aust.diss));
  assert.ok(Number.isNaN(aust.homog));
  assert.equal(quench.valid, false);
  assert.equal(quench.outcomeValid, false);
  assert.equal(doc.getElementById('spx-aust-window-canvas').dataset.modelState, 'unavailable');
  assert.equal(doc.getElementById('spx-grain-canvas').dataset.modelState, 'unavailable');
  assert.match(doc.getElementById('spx-aust-recommendation').textContent,
    /No process window reported/i);
  assert.equal(doc.getElementById('spx-aust-set-ac3').disabled, true);
  const stages = doc.querySelectorAll('#spx-applied-chain-card .spx-causal-stage');
  assert.match(stages[0].textContent, /Austenitization unavailable.*below.*0\.02 wt%/is);
  assert.match(stages[1].textContent, /Quantitative outcome unavailable/i);
  assert.match(stages[2].textContent, /Section response unavailable/i);
});

test('out-of-range live austenitizing temperature quarantines dependent outputs', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const input = doc.getElementById('spx-aust-temp');

  setInput(win, doc, 'spx-aust-temp', 1600);
  assert.equal(input.getAttribute('aria-invalid'), 'true');
  assert.equal(win.__SPX.release2.austModel().valid, false);
  assert.equal(win.__SPX.release2.quenchModel().valid, false);
  assert.equal(doc.getElementById('spx-aust-window-canvas').dataset.modelState, 'unavailable');
  assert.equal(doc.getElementById('spx-grain-canvas').dataset.modelState, 'unavailable');
  assert.match(doc.getElementById('spx-aust-status').textContent, /25.*1300/i);
  assert.match(doc.getElementById('spx-quench-status').textContent, /Dependent quench outputs are withheld/i);

  setInput(win, doc, 'spx-aust-temp', 900);
  assert.equal(input.getAttribute('aria-invalid'), 'false');
  assert.equal(win.__SPX.release2.austModel().valid, true);
  assert.equal(doc.getElementById('spx-aust-window-canvas').dataset.modelState, 'valid');
});

test('Applied depth check gates section hardness on the selected process chain', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setAustenitization(win, doc, 600, 1, 25);
  setQuench(win, doc, { medium: 'oil', bath: 60, delay: 0, final: 25 });

  const card = doc.getElementById('spx-applied-chain-card');
  const sectionStage = card.querySelectorAll('.spx-causal-stage')[2];
  assert.match(sectionStage.querySelector('h3').textContent, /Section response unavailable/i);
  assert.doesNotMatch(sectionStage.querySelector('h3').textContent, /\d+\s*→\s*\d+\s*HV/i);
  assert.match(sectionStage.textContent, /Withheld because/i);
  assert.match(card.textContent, /independent equivalent-Jominy potential, not the selected process outcome/i);
});

test('blank and out-of-range Release 2 numeric inputs quarantine their panels', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const release2 = win.__SPX.release2;

  setInput(win, doc, 'spx-hard-size', '');
  assert.equal(doc.getElementById('spx-hard-size').getAttribute('aria-invalid'), 'true');
  assert.equal(release2.hardModel().eligible, false);
  assert.equal(doc.getElementById('spx-jominy-svg').dataset.modelState, 'unavailable');
  assert.match(doc.getElementById('spx-hard-status').textContent, /Section size must be within 2–500/i);
  assert.doesNotMatch(doc.getElementById('spx-hard-depth-body').textContent, /\d+(?:\.\d+)?\s*mm/i,
    'invalid hardenability inputs must not retain equivalent-Jominy distances');
  setInput(win, doc, 'spx-hard-size', 50);

  setInput(win, doc, 'spx-aust-hold', 0);
  assert.equal(doc.getElementById('spx-aust-hold').getAttribute('aria-invalid'), 'true');
  assert.equal(release2.austModel().valid, false);
  assert.equal(release2.quenchModel().valid, false,
    'invalid austenitization input must gate the downstream quench');
  assert.equal(doc.getElementById('spx-aust-window-canvas').dataset.modelState, 'unavailable');
  assert.match(doc.getElementById('spx-aust-status').textContent, /Hold time must be within 1–720/i);
  setInput(win, doc, 'spx-aust-hold', 45);

  setInput(win, doc, 'spx-quench-size', '');
  assert.equal(doc.getElementById('spx-quench-size').getAttribute('aria-invalid'), 'true');
  assert.equal(release2.quenchModel().valid, false);
  assert.equal(doc.querySelectorAll('#spx-quench-svg path').length, 0);
  assert.match(doc.getElementById('spx-quench-status').textContent,
    /Section size must be within 2–500.*outputs are withheld/i);
  assert.match(doc.querySelectorAll('#spx-applied-chain-card .spx-causal-stage')[2].textContent,
    /Section response unavailable|Withheld because/i);
});

test('medium temperature windows quarantine invalid quantitative comparisons', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const release2 = win.__SPX.release2;

  setQuench(win, doc, { medium: 'salt', bath: 60 });
  const invalid = release2.quenchModel();
  assert.equal(invalid.valid, false);
  assert.match(invalid.validity.message, /outside.*model window/i);
  assert.match(doc.getElementById('spx-quench-status').textContent,
    /Quantitative result unavailable/i);
  assert.equal(doc.querySelectorAll('#spx-quench-svg path').length, 0,
    'invalid medium/bath pair must not retain a quantitative curve');

  setInput(win, doc, 'spx-quench-bath', 300);
  assert.equal(release2.quenchModel().valid, true,
    'molten-salt analogue accepts a temperature inside its model window');
});

test('Release 2 describes calculated outputs as heuristic rather than acceptance data', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  assert.match(doc.getElementById('spx-tab-quenching').textContent,
    /uncalibrated teaching estimates/i);
  assert.match(doc.getElementById('spx-tab-quenching').textContent,
    /not an acceptance prediction/i);
  assert.match(doc.getElementById('spx-quench-status').textContent,
    /Model validity/i);
  assert.match(doc.getElementById('spx-quench-compare-body').textContent,
    /Heuristic, not measured/i);
});

test('restored Release 2 state is whitelisted and numerically clamped', async t => {
  const { win } = await tool();
  t.after(() => win.close());

  const clean = win.__SPX.release2.sanitize({
    hard: { geometry: '<img src=x onerror=alert(1)>', medium: 'unknown', size: 1e9 },
    aust: { start: 'invented', carbide: 'invented', pinning: 'invented', hold: -20 },
    quench: { medium: '<svg/onload=alert(1)>', geometry: 'triangle', corner: 'razor', delay: 1e9 }
  });

  assert.equal(clean.hard.geometry, 'round');
  assert.equal(clean.hard.medium, 'oil');
  assert.equal(clean.hard.size, 500);
  assert.equal(clean.aust.start, 'normalized');
  assert.equal(clean.aust.hold, 1);
  assert.equal(clean.quench.medium, 'oil');
  assert.equal(clean.quench.geometry, 'round');
  assert.equal(clean.quench.corner, 'normal');
  assert.equal(clean.quench.delay, 300);
});

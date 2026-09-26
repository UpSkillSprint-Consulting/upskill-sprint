'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function activeAudienceGoals(doc) {
  const audience = doc.getElementById('spx-tool').dataset.startAudience;
  return [...doc.querySelectorAll(`[data-start-audience-card="${audience}"]`)]
    .filter(card => card.closest('#spx-primary-goals'));
}

function assertSingleVisiblePanel(doc, name) {
  const visible = [...doc.querySelectorAll('[data-panel]')].filter(panel => !panel.hidden);
  assert.deepEqual(visible.map(panel => panel.dataset.panel), [name]);
}

test('first load opens the goal-based navigator with six student goals', async t => {
  const { win, doc, record } = await tool();
  t.after(() => win.close());

  assert.deepEqual(record.errors, [], 'the start screen must initialise cleanly');
  assert.equal(win.__SPX.getState().tab, 'navigator');
  assertSingleVisiblePanel(doc, 'navigator');

  const selector = doc.getElementById('spx-start-audience-selector');
  assert.ok(selector, 'audience selector exists');
  assert.equal(selector.getAttribute('role'), 'group');
  assert.equal(selector.getAttribute('aria-label'), 'Goal audience');
  assert.equal(doc.getElementById('spx-tool').dataset.startAudience, 'student');
  assert.equal(selector.querySelector('[data-start-audience="student"]').getAttribute('aria-pressed'), 'true');
  assert.equal(selector.querySelector('[data-start-audience="professional"]').getAttribute('aria-pressed'), 'false');

  assert.equal(doc.querySelectorAll('#spx-primary-goals [data-start-goal]').length, 12);
  assert.equal(activeAudienceGoals(doc).length, 6);
  assert.ok(activeAudienceGoals(doc).every(card => card.dataset.startAudienceCard === 'student'));
  assert.match(doc.getElementById('spx-start-view-title').textContent, /Student goals/i);
});

test('audience switching exposes six professional goals without changing calculation state', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const before = copy(win.serializable());
  const button = doc.querySelector('[data-start-audience="professional"]');
  button.click();

  assert.equal(win.__SPX.release1.getStartAudience(), 'professional');
  assert.equal(doc.getElementById('spx-tool').dataset.startAudience, 'professional');
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelector('[data-start-audience="student"]').getAttribute('aria-pressed'), 'false');
  assert.equal(activeAudienceGoals(doc).length, 6);
  assert.ok(activeAudienceGoals(doc).every(card => card.dataset.startAudienceCard === 'professional'));
  assert.match(doc.getElementById('spx-start-view-title').textContent, /Steel professional goals/i);
  assert.deepEqual(copy(win.serializable()), before,
    'audience choice must not alter points, chemistry, paths, models, or results');
  assert.equal(win.localStorage.getItem('spx-start-audience-v1'), 'professional');
});

test('all twelve primary goals route to the intended existing workspace', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const routes = {
    'student-phases': 'equilibrium',
    'student-cycle': 'path',
    'student-kinetics': 'kinetics',
    'student-chemistry': 'chemistry',
    'student-heat-treatment': 'austenitization',
    'student-practice': 'learn',
    'professional-chemistry': 'chemistry',
    'professional-transformations': 'kinetics',
    'professional-heat-treatment': 'austenitization',
    'professional-hardenability': 'hardenability',
    'professional-process-data': 'process-data',
    'professional-metallography': 'metallurgy-lab'
  };

  for (const [goal, destination] of Object.entries(routes)) {
    win.switchTab('navigator');
    const card = doc.querySelector(`[data-start-goal="${goal}"]`);
    const sourcePanel = card.closest('[data-panel]');
    card.focus();
    card.click();

    assert.equal(win.__SPX.getState().tab, destination, `${goal} opens ${destination}`);
    assert.equal(win.state.guideGoal, goal, `${goal} is recorded as the chosen goal`);
    assert.equal(sourcePanel.hidden, true, `${goal} hides the start panel`);
    assertSingleVisiblePanel(doc, destination);

    const tab = doc.querySelector(`.spx-tabs [data-tab="${destination}"]`);
    assert.equal(doc.activeElement, tab, `${goal} transfers focus to its selected tab`);
  }

  assert.equal(
    doc.querySelector('#spx-r4-subnav [data-r4-panel="metallography"]').getAttribute('aria-pressed'),
    'true',
    'the professional microstructure goal opens the metallography laboratory'
  );
  assert.equal(doc.querySelector('[data-r4-content="metallography"]').hidden, false);
});

test('the exact twelve-tab workspace remains available', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const expected = [
    'navigator', 'equilibrium', 'path', 'kinetics', 'chemistry',
    'hardenability', 'austenitization', 'quenching', 'process-data',
    'metallurgy-lab', 'reference-diagrams', 'learn'
  ];
  const tabs = [...doc.querySelectorAll('.spx-tabs [data-tab]')];
  assert.deepEqual(tabs.map(tab => tab.dataset.tab), expected);
  assert.deepEqual(
    [...doc.querySelectorAll('[data-panel]')].map(panel => panel.dataset.panel),
    expected
  );
  tabs.forEach(tab => {
    assert.equal(tab.tagName, 'BUTTON');
    assert.equal(tab.getAttribute('role'), 'tab');
    assert.equal(tab.getAttribute('aria-controls'), `spx-tab-${tab.dataset.tab}`);
    assert.ok(doc.getElementById(tab.getAttribute('aria-controls')),
      `${tab.dataset.tab} retains its matching panel`);
  });
});

test('start-screen shortcuts open the full workspace, references, and export area', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const shortcuts = [
    ['spx-resume-work', 'equilibrium'],
    ['spx-open-reference', 'reference-diagrams'],
    ['spx-open-learn', 'learn']
  ];
  for (const [id, destination] of shortcuts) {
    win.switchTab('navigator');
    const button = doc.getElementById(id);
    button.focus();
    button.click();
    assert.equal(win.__SPX.getState().tab, destination, `${id} opens ${destination}`);
    assertSingleVisiblePanel(doc, destination);
    assert.equal(doc.activeElement, doc.querySelector(`.spx-tabs [data-tab="${destination}"]`));
  }
});

test('all seventeen legacy guided workflows remain disclosed and operational', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const disclosure = doc.getElementById('spx-all-workflows');
  assert.equal(disclosure.tagName, 'DETAILS');
  assert.equal(disclosure.open, false, 'the complete legacy list starts progressively disclosed');
  const summary = disclosure.querySelector('summary');
  assert.ok(summary);
  assert.match(summary.textContent, /Browse all guided workflows/i);

  const groups = {
    guide: ['phase', 'path', 'rapid', 'chemistry', 'critical', 'tradeoffs'],
    release2: ['hardenability', 'austenitization', 'quenching'],
    release3: ['process-data', 'measurement'],
    release4: ['surface', 'tempering', 'mechanical', 'metallography', 'solidification', 'families']
  };
  assert.deepEqual([...doc.querySelectorAll('[data-guide-route]')].map(x => x.dataset.guideRoute), groups.guide);
  assert.deepEqual([...doc.querySelectorAll('[data-release2-route]')].map(x => x.dataset.release2Route), groups.release2);
  assert.deepEqual([...doc.querySelectorAll('[data-release3-route]')].map(x => x.dataset.release3Route), groups.release3);
  assert.deepEqual([...doc.querySelectorAll('[data-release4-route]')].map(x => x.dataset.release4Route), groups.release4);
  assert.equal(doc.querySelectorAll('#spx-question-grid .spx-question-card').length, 17);

  disclosure.open = true;
  const routeChecks = [
    ['[data-guide-route="phase"]', 'equilibrium'],
    ['[data-guide-route="path"]', 'path'],
    ['[data-guide-route="rapid"]', 'kinetics'],
    ['[data-guide-route="chemistry"]', 'chemistry'],
    ['[data-release2-route="hardenability"]', 'hardenability'],
    ['[data-release2-route="austenitization"]', 'austenitization'],
    ['[data-release2-route="quenching"]', 'quenching'],
    ['[data-release3-route="process-data"]', 'process-data'],
    ['[data-release3-route="measurement"]', 'process-data'],
    ['[data-release4-route="surface"]', 'metallurgy-lab'],
    ['[data-release4-route="tempering"]', 'metallurgy-lab'],
    ['[data-release4-route="mechanical"]', 'metallurgy-lab'],
    ['[data-release4-route="metallography"]', 'metallurgy-lab'],
    ['[data-release4-route="solidification"]', 'metallurgy-lab'],
    ['[data-release4-route="families"]', 'metallurgy-lab']
  ];
  for (const [selector, destination] of routeChecks) {
    win.switchTab('navigator');
    doc.querySelector(selector).click();
    assert.equal(win.__SPX.getState().tab, destination, `${selector} still routes correctly`);
  }

  for (const route of ['critical', 'tradeoffs']) {
    win.switchTab('equilibrium');
    win.switchTab('navigator');
    doc.querySelector(`[data-guide-route="${route}"]`).click();
    assert.equal(win.__SPX.getState().tab, 'navigator', `${route} remains in the guided navigator`);
  }
});

test('start-screen controls retain native keyboard and accessible semantics', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const controls = [
    ...doc.querySelectorAll('#spx-start-audience-selector button'),
    ...doc.querySelectorAll('#spx-primary-goals [data-start-goal]'),
    ...doc.querySelectorAll('.spx-start-actions button')
  ];
  assert.equal(controls.length, 17);
  controls.forEach(control => {
    assert.equal(control.tagName, 'BUTTON');
    assert.equal(control.type, 'button');
    assert.ok(control.textContent.trim(), 'every start-screen button has an accessible name');
  });

  assert.equal(doc.querySelectorAll('#spx-start-audience-selector [aria-pressed="true"]').length, 1);
  assert.equal(doc.getElementById('spx-start-view').getAttribute('aria-live'), 'polite');
  const recommendation = doc.getElementById('spx-guide-recommendation');
  assert.equal(recommendation.getAttribute('role'), 'status');
  assert.equal(recommendation.getAttribute('aria-live'), 'polite');

  const goal = doc.querySelector('[data-start-goal="student-phases"]');
  goal.focus();
  assert.equal(doc.activeElement, goal, 'a goal card is keyboard focusable');
  goal.click();
  assert.equal(doc.activeElement, doc.querySelector('.spx-tabs [data-tab="equilibrium"]'),
    'activating a goal moves focus into the selected workspace navigation');
});

test('a legacy shared hash hydrates before the new navigator is shown', async t => {
  const legacy = {
    unit: 'imperial',
    points: [{ id: 7, c: 0.63, t: 845 }],
    activeId: 7,
    nextId: 8,
    chem: { C: 0.31, Mn: 1.42, Si: 0.26, Ni: 0.18, Cr: 0.37, Mo: 0.08, V: 0.02, Cu: 0.11, B: 0.0008 },
    cycle: [
      { t: 25, d: 1, m: 'Start' },
      { t: 905, d: 18, m: 'Legacy hold' },
      { t: 40, d: 12, m: 'Legacy cool' }
    ],
    kinetics: { mode: 'cct', cooling: 37, hold: 88, holdTempC: 510, finalTempC: 40 }
  };
  const encoded = Buffer.from(JSON.stringify(legacy), 'utf8').toString('base64');
  const { win, doc } = await tool({
    url: `https://upskillsprint.com/tools/steel-phase-explorer#spx=${encoded}`
  });
  t.after(() => win.close());

  assert.equal(win.__SPX.getState().tab, 'navigator', 'the new start screen remains the entry point');
  assertSingleVisiblePanel(doc, 'navigator');
  assert.equal(win.__SPX.getState().unit, 'imperial');
  assert.deepEqual(copy(win.__SPX.getPoints()), legacy.points);

  const restored = copy(win.serializable());
  assert.equal(restored.chem.C, legacy.chem.C);
  assert.equal(restored.chem.Mn, legacy.chem.Mn);
  assert.deepEqual(restored.cycle, legacy.cycle);
  assert.equal(restored.kinetics.mode, 'cct');
  assert.equal(restored.kinetics.cooling, 37);
  assert.equal(restored.kinetics.hold, 88);
  assert.equal(restored.kinetics.holdTempC, 510);
  assert.equal(restored.kinetics.finalTempC, 40);
  assert.equal(doc.getElementById('spx-scenario-warning').hidden, true);
});

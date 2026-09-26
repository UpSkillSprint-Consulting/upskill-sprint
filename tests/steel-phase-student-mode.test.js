'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready, waitFor } = require('./helpers/steel-phase-harness.js');

const TABS = [
  'navigator', 'equilibrium', 'path', 'kinetics', 'chemistry',
  'hardenability', 'austenitization', 'quenching', 'process-data',
  'metallurgy-lab', 'reference-diagrams', 'learn'
];

const STUDENT_PRIORITY = new Set([
  'equilibrium', 'path', 'kinetics', 'chemistry', 'austenitization', 'learn'
]);

const PROFESSIONAL_PRIORITY = new Set([
  'kinetics', 'chemistry', 'hardenability', 'austenitization',
  'process-data', 'metallurgy-lab'
]);

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSelectorSync(doc, mode) {
  const workspaceButtons = [...doc.querySelectorAll(
    '#spx-workspace-mode-selector [data-workspace-mode]'
  )];
  const audienceButtons = [...doc.querySelectorAll(
    '#spx-start-audience-selector [data-start-audience]'
  )];

  assert.equal(workspaceButtons.filter(button => button.getAttribute('aria-checked') === 'true').length, 1);
  assert.equal(audienceButtons.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
  workspaceButtons.forEach(button => {
    const selected = button.dataset.workspaceMode === mode;
    assert.equal(button.getAttribute('aria-checked'), String(selected));
    assert.equal(button.tabIndex, selected ? 0 : -1);
  });
  audienceButtons.forEach(button => {
    assert.equal(button.getAttribute('aria-pressed'), String(button.dataset.startAudience === mode));
  });
}

function assertStudentArea(doc, area) {
  assert.equal(doc.getElementById('spx-tool').dataset.studentArea, area);
  const current = [...doc.querySelectorAll('#spx-student-nav [aria-current="page"]')];
  assert.deepEqual(current.map(button => button.dataset.studentArea), [area]);
  const visible = [...doc.querySelectorAll('[data-student-area-panel]')]
    .filter(panel => !panel.hidden)
    .map(panel => panel.dataset.studentAreaPanel);
  assert.deepEqual(visible, [area]);
}

test('workspace mode restores from canonical, legacy, and explanation-detail fallback storage', async () => {
  const cases = [
    {
      name: 'canonical wins over conflicting legacy data',
      storage: {
        'spx-workspace-mode-v1': 'professional',
        'spx-start-audience-v1': 'student',
        'spx-experience-v1': 'beginner'
      },
      expected: 'professional'
    },
    {
      name: 'legacy audience migrates when the canonical key is absent',
      storage: {
        'spx-start-audience-v1': 'professional',
        'spx-experience-v1': 'beginner'
      },
      expected: 'professional'
    },
    {
      name: 'invalid stored modes fall back to non-beginner detail',
      storage: {
        'spx-workspace-mode-v1': 'expert',
        'spx-start-audience-v1': 'engineer',
        'spx-experience-v1': 'advanced'
      },
      expected: 'professional'
    },
    {
      name: 'a fresh beginner session falls back to student mode',
      storage: {},
      expected: 'student'
    }
  ];

  for (const entry of cases) {
    const { win, doc } = await tool({ storage: entry.storage });
    try {
      assert.equal(win.__SPX.release1.getWorkspaceMode(), entry.expected, entry.name);
      assert.equal(doc.getElementById('spx-tool').dataset.workspaceMode, entry.expected, entry.name);
      assertSelectorSync(doc, entry.expected);
      assert.equal(win.localStorage.getItem('spx-workspace-mode-v1'), entry.expected,
        `${entry.name}: the resolved mode is written to the canonical key`);
      assert.equal(win.localStorage.getItem('spx-start-audience-v1'), entry.expected,
        `${entry.name}: the compatibility key is synchronized during migration`);
    } finally {
      win.close();
    }
  }
});

test('malformed local learning progress is allowlisted without blocking initialization', async t => {
  const progress = {
    studentArea: 'learn',
    activePath: '__proto__',
    activeStep: 99,
    paths: {
      phases: {
        completed: [1.5, 2, '3', -1, 6, 2],
        prediction: 'kept',
        checkAnswer: 'kept'
      }
    },
    visitedTabs: ['"', 'equilibrium', 'equilibrium', 'not-a-tab']
  };
  const { win, doc } = await tool({
    storage: { 'spx-student-progress-v1': JSON.stringify(progress) }
  });
  t.after(() => win.close());

  const restored = copy(win.__SPX.release1.getStudentProgress());
  assert.equal(restored.activePath, '');
  assert.equal(restored.activeStep, 5);
  assert.deepEqual(restored.paths.phases.completed, [2, 3]);
  assert.deepEqual(restored.visitedTabs, ['equilibrium']);
  assert.equal(doc.getElementById('spx-learning-coach').hidden, true);
  assert.equal(win.__SPX.getState().tab, 'navigator');
});

test('toolbar and start-screen selectors stay synchronized and persist both compatibility keys', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const workspace = doc.getElementById('spx-workspace-mode-selector');
  assert.equal(workspace.getAttribute('role'), 'radiogroup');
  assert.equal(workspace.getAttribute('aria-label'), 'Workspace mode');
  [...workspace.querySelectorAll('[data-workspace-mode]')].forEach(button => {
    assert.equal(button.tagName, 'BUTTON');
    assert.equal(button.type, 'button');
    assert.equal(button.getAttribute('role'), 'radio');
  });

  workspace.querySelector('[data-workspace-mode="professional"]').click();
  assert.equal(win.__SPX.release1.getWorkspaceMode(), 'professional');
  assertSelectorSync(doc, 'professional');
  assert.equal(win.localStorage.getItem('spx-workspace-mode-v1'), 'professional');
  assert.equal(win.localStorage.getItem('spx-start-audience-v1'), 'professional');

  doc.querySelector('#spx-start-audience-selector [data-start-audience="student"]').click();
  assert.equal(win.__SPX.release1.getWorkspaceMode(), 'student');
  assertSelectorSync(doc, 'student');
  assert.equal(win.localStorage.getItem('spx-workspace-mode-v1'), 'student');
  assert.equal(win.localStorage.getItem('spx-start-audience-v1'), 'student');

  const studentRadio = workspace.querySelector('[data-workspace-mode="student"]');
  studentRadio.focus();
  const key = new win.KeyboardEvent('keydown', {
    key: 'ArrowRight', bubbles: true, cancelable: true
  });
  workspace.dispatchEvent(key);
  assert.equal(key.defaultPrevented, true);
  assert.equal(doc.activeElement, workspace.querySelector('[data-workspace-mode="professional"]'));
  assert.equal(win.__SPX.release1.getWorkspaceMode(), 'professional');
  assertSelectorSync(doc, 'professional');
});

test('mode changes preserve scenario serialization, active tab, explanation detail, basis, and calculations', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  win.__SPX.release1.setExperience('advanced');
  win.__SPX.release1.setBasis('rapid');
  win.__SPX.setPoint(0.47, 812);
  win.switchTab('chemistry');

  const before = copy(win.serializable());
  const calculations = {
    phases: copy(win.__SPX.phaseFractions(0.47, 812)),
    chemistry: copy(win.__SPX.chemMetrics()),
    kinetics: copy(win.__SPX.kineticsFractions())
  };

  doc.querySelector('#spx-workspace-mode-selector [data-workspace-mode="professional"]').click();

  assert.equal(win.__SPX.release1.getWorkspaceMode(), 'professional');
  assert.equal(win.__SPX.getState().tab, 'chemistry');
  assert.equal(win.state.experience, 'advanced');
  assert.equal(win.state.thermalBasis, 'rapid');
  assert.equal(doc.querySelector('#spx-experience-selector [data-experience="advanced"]')
    .getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelector('#spx-basis-selector [data-basis="rapid"]')
    .getAttribute('aria-pressed'), 'true');
  assert.deepEqual(copy(win.serializable()), before,
    'workspace mode is a presentation preference and cannot mutate the engineering scenario');
  assert.deepEqual({
    phases: copy(win.__SPX.phaseFractions(0.47, 812)),
    chemistry: copy(win.__SPX.chemMetrics()),
    kinetics: copy(win.__SPX.kineticsFractions())
  }, calculations);

  for (const key of ['workspaceMode', 'startAudience', 'studentArea', 'studentProgress']) {
    assert.equal(Object.hasOwn(before, key), false, `${key} stays out of scenario serialization`);
  }
});

test('all twelve original modules remain reachable and receive mode-specific priority markers', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  const tabs = [...doc.querySelectorAll('.spx-tabs [data-tab]')];
  const panels = [...doc.querySelectorAll('[data-panel]')];
  assert.deepEqual(tabs.map(tab => tab.dataset.tab), TABS);
  assert.deepEqual(panels.map(panel => panel.dataset.panel), TABS);

  for (const [mode, recommended] of [
    ['student', STUDENT_PRIORITY],
    ['professional', PROFESSIONAL_PRIORITY]
  ]) {
    win.__SPX.release1.setWorkspaceMode(mode, false);
    tabs.forEach(tab => {
      const expected = tab.dataset.tab === 'navigator'
        ? 'shared'
        : recommended.has(tab.dataset.tab) ? 'recommended' : 'available';
      assert.equal(tab.dataset.workspacePriority, expected,
        `${tab.dataset.tab} has the correct ${mode} priority`);
      if (expected === 'recommended') {
        assert.match(tab.getAttribute('aria-description'), new RegExp(`${mode}`, 'i'));
      } else {
        assert.equal(tab.hasAttribute('aria-description'), false);
      }
    });
  }

  for (const tab of tabs) {
    tab.click();
    assert.equal(win.__SPX.getState().tab, tab.dataset.tab, `${tab.dataset.tab} remains reachable`);
    assert.deepEqual(
      panels.filter(panel => !panel.hidden).map(panel => panel.dataset.panel),
      [tab.dataset.tab]
    );
  }
});

test('Learn, Explore, Practice, and My Progress expose their routes and open existing modules', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.Element.prototype.scrollIntoView = function () {};

  const areas = ['learn', 'explore', 'practice', 'progress'];
  assert.deepEqual(
    [...doc.querySelectorAll('#spx-student-nav [data-student-area]')]
      .map(button => button.dataset.studentArea),
    areas
  );
  for (const area of areas) {
    const button = doc.querySelector(`#spx-student-nav [data-student-area="${area}"]`);
    assert.equal(button.tagName, 'BUTTON');
    button.click();
    assert.equal(win.__SPX.getState().tab, 'navigator');
    assertStudentArea(doc, area);
  }

  const learnPanel = doc.querySelector('[data-student-area-panel="learn"]');
  const explorePanel = doc.querySelector('[data-student-area-panel="explore"]');
  const practicePanel = doc.querySelector('[data-student-area-panel="practice"]');
  const progressPanel = doc.querySelector('[data-student-area-panel="progress"]');
  assert.deepEqual(
    [...learnPanel.querySelectorAll('[data-learning-path]')].map(x => x.dataset.learningPath),
    ['phases', 'transformations', 'heat-treatment']
  );
  assert.deepEqual(
    [...explorePanel.querySelectorAll('[data-student-route]')].map(x => x.dataset.studentRoute),
    ['equilibrium', 'path', 'kinetics', 'reference-diagrams', 'chemistry',
      'austenitization', 'hardenability', 'quenching', 'process-data',
      'metallurgy-lab', 'learn', 'navigator']
  );
  assert.deepEqual(
    [...practicePanel.querySelectorAll('[data-student-route]')].map(x => x.dataset.studentRoute),
    ['learn', 'learn', 'metallurgy-lab']
  );
  assert.deepEqual(
    [...progressPanel.querySelectorAll('[data-student-route]')].map(x => x.dataset.studentRoute),
    ['learn']
  );

  doc.querySelector('#spx-student-nav [data-student-area="learn"]').click();
  learnPanel.querySelector('[data-learning-path="phases"]').click();
  assert.equal(win.__SPX.getState().tab, 'equilibrium');
  assert.equal(win.__SPX.release1.getStudentProgress().activePath, 'phases');

  doc.querySelector('#spx-student-nav [data-student-area="explore"]').click();
  explorePanel.querySelector('[data-student-route="chemistry"]').click();
  assert.equal(win.__SPX.getState().tab, 'chemistry');

  doc.querySelector('#spx-student-nav [data-student-area="practice"]').click();
  practicePanel.querySelector('[data-subpanel="metallography"]').click();
  assert.equal(win.__SPX.getState().tab, 'metallurgy-lab');
  await waitFor(win, () => doc.querySelector(
    '#spx-r4-subnav [data-r4-panel="metallography"]'
  ).getAttribute('aria-pressed') === 'true');

  doc.querySelector('#spx-student-nav [data-student-area="progress"]').click();
  progressPanel.querySelector('[data-student-area-link="explore"]').click();
  assertStudentArea(doc, 'explore');
  doc.querySelector('#spx-student-nav [data-student-area="progress"]').click();
  progressPanel.querySelector('[data-student-route="learn"]').click();
  assert.equal(win.__SPX.getState().tab, 'learn');
});

test('student guided routes reveal navigator targets before scrolling to them', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.Element.prototype.scrollIntoView = function () {};

  for (const [route, target] of [
    ['critical', 'spx-nomenclature-card'],
    ['tradeoffs', 'spx-tradeoff-card']
  ]) {
    win.__SPX.release1.setStudentArea('learn', false);
    win.__SPX.release1.route(route);
    assert.equal(win.__SPX.getState().tab, 'navigator');
    assertStudentArea(doc, 'explore');
    assert.notEqual(win.getComputedStyle(doc.getElementById(target)).display, 'none',
      `${route} reveals its destination before attempting to scroll`);
  }
});

test('opening a lab from the lesson coach hands keyboard focus to its selected tab', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  win.__SPX.release1.startLearningPath('transformations', false);
  doc.querySelector('#spx-learning-steps [data-learning-step="1"]').click();
  const openLab = doc.querySelector('#spx-learning-stage [data-learning-open]');
  openLab.focus();
  openLab.click();

  const kineticsTab = doc.querySelector('.spx-tabs [data-tab="kinetics"]');
  await waitFor(win, () => doc.activeElement === kineticsTab);
  assert.equal(win.__SPX.getState().tab, 'kinetics');
  assert.equal(kineticsTab.getAttribute('aria-selected'), 'true');
  assert.equal(kineticsTab.tabIndex, 0);
});

test('each learning path resumes its own persisted step', async t => {
  const { win } = await tool();
  t.after(() => win.close());

  win.__SPX.release1.startLearningPath('phases', false);
  win.document.querySelector('#spx-learning-steps [data-learning-step="1"]').click();
  assert.equal(win.__SPX.release1.getStudentProgress().activeStep, 1);

  win.__SPX.release1.startLearningPath('transformations', false);
  win.document.querySelector('#spx-learning-steps [data-learning-step="4"]').click();
  assert.equal(win.__SPX.release1.getStudentProgress().activeStep, 4);

  win.__SPX.release1.startLearningPath('phases', false);
  assert.equal(win.__SPX.release1.getStudentProgress().activeStep, 1);
  win.__SPX.release1.startLearningPath('transformations', false);
  assert.equal(win.__SPX.release1.getStudentProgress().activeStep, 4);

  const stored = JSON.parse(win.localStorage.getItem('spx-student-progress-v1'));
  assert.equal(stored.paths.phases.activeStep, 1);
  assert.equal(stored.paths.transformations.activeStep, 4);
});

test('metallography practice waits for Release 4 before selecting and scrolling', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  win.__SPX.release1.setStudentArea('practice', false);

  const route = doc.querySelector(
    '[data-student-area-panel="practice"] [data-subpanel="metallography"]'
  );
  assert.equal(route.dataset.requires, 'release4');
  const target = doc.getElementById('spx-r4-meta-quiz');
  let scrolled = false;
  target.scrollIntoView = () => { scrolled = true; };

  const release4 = win.__SPX.release4;
  delete win.__SPX.release4;
  doc.querySelector('#spx-r4-subnav [data-r4-panel="surface"]').click();
  route.click();
  await new Promise(resolve => win.setTimeout(resolve, 90));
  assert.equal(win.__SPX.getState().tab, 'navigator');
  assert.equal(scrolled, false);

  win.__SPX.release4 = release4;
  await waitFor(win, () =>
    win.__SPX.getState().tab === 'metallurgy-lab' &&
    doc.querySelector('#spx-r4-subnav [data-r4-panel="metallography"]')
      .getAttribute('aria-pressed') === 'true' && scrolled);
  assert.equal(target.closest('[data-r4-content]').hidden, false);
});

test('guided observations fail closed with the shared model-validity rules and selected units', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());

  win.__SPX.release1.startLearningPath('heat-treatment', false);
  doc.querySelector('#spx-learning-steps [data-learning-step="2"]').click();
  win.state.chem.C = 0;
  win.__SPX.release1.render();
  let observation = doc.getElementById('spx-learning-stage').textContent;
  assert.match(observation, /raw-formula CE IIW/i);
  assert.match(observation, /raw-formula Pcm/i);
  assert.match(observation, /Ms unavailable.*below the 0\.02 wt% lower scope/is);
  assert.doesNotMatch(observation, /estimated Ms of/i);

  win.state.chem.C = 0.2;
  win.__SPX.setUnit('imperial');
  win.__SPX.release1.render();
  observation = doc.getElementById('spx-learning-stage').textContent;
  assert.match(observation, /estimated Ms of -?\d+ °F/i);
  assert.doesNotMatch(observation, /estimated Ms of -?\d+ °C/i);

  win.__SPX.setUnit('metric');
  win.__SPX.release1.startLearningPath('transformations', false);
  doc.querySelector('#spx-learning-steps [data-learning-step="2"]').click();
  const cooling = doc.getElementById('spx-kin-cooling');

  cooling.value = '';
  cooling.dispatchEvent(new win.Event('input', { bubbles: true }));
  observation = doc.getElementById('spx-learning-stage').textContent;
  assert.match(observation, /quantitative constituent result unavailable/i);
  assert.match(observation, /Cooling rate must be 0\.01–1000 °C\/s/i);
  assert.doesNotMatch(observation, /currently estimates\s*\./i);

  cooling.value = '10000';
  cooling.dispatchEvent(new win.Event('input', { bubbles: true }));
  observation = doc.getElementById('spx-learning-stage').textContent;
  assert.match(observation, /quantitative constituent result unavailable/i);
  assert.match(observation, /Cooling rate must be 0\.01–1000 °C\/s/i);

  cooling.value = '10';
  cooling.dispatchEvent(new win.Event('input', { bubbles: true }));
  const payload = win.serializable();
  payload.chem = Object.assign({}, payload.chem, { C: 0.60, Cr: 5 });
  assert.equal(win.restore(payload), true);
  win.__SPX.release1.render();
  observation = doc.getElementById('spx-learning-stage').textContent;
  assert.match(observation, /quantitative constituent result unavailable/i);
  assert.match(observation, /completion estimate.*at or below Ac₁/i);
});

test('a complete six-stage guided lesson persists locally and resumes after reload', async () => {
  const first = await tool();
  const { win, doc } = first;
  let storedProgress;
  try {
    win.__SPX.release1.startLearningPath('phases', false);
    assert.equal(doc.getElementById('spx-learning-coach').hidden, false);
    assert.deepEqual(
      [...doc.querySelectorAll('#spx-learning-steps [data-learning-step] strong')]
        .map(label => label.textContent.trim()),
      ['Predict', 'Manipulate', 'Observe', 'Explain', 'Check', 'Apply']
    );

    doc.getElementById('spx-learning-primary').click();
    assert.equal(win.__SPX.release1.getStudentProgress().activeStep, 0,
      'prediction is required before the lesson advances');

    const prediction = doc.querySelector(
      '#spx-learning-stage input[name="spx-learning-prediction"][value="1"]'
    );
    prediction.focus();
    prediction.checked = true;
    prediction.dispatchEvent(new win.Event('change', { bubbles: true }));
    assert.equal(doc.activeElement, prediction,
      'recording an answer keeps keyboard focus on the selected option');
    doc.getElementById('spx-learning-primary').click();

    for (const expectedStep of [1, 2, 3]) {
      assert.equal(win.__SPX.release1.getStudentProgress().activeStep, expectedStep);
      doc.getElementById('spx-learning-primary').click();
    }

    assert.equal(win.__SPX.release1.getStudentProgress().activeStep, 4);
    const answer = doc.querySelector(
      '#spx-learning-stage input[name="spx-learning-check"][value="2"]'
    );
    answer.focus();
    answer.checked = true;
    answer.dispatchEvent(new win.Event('change', { bubbles: true }));
    assert.equal(doc.activeElement, answer,
      'checking an answer does not replace the focused form control');
    assert.match(doc.getElementById('spx-learning-status').textContent, /Correct/i);
    doc.getElementById('spx-learning-primary').click();

    assert.equal(win.__SPX.release1.getStudentProgress().activeStep, 5);
    doc.getElementById('spx-learning-primary').click();

    const progress = copy(win.__SPX.release1.getStudentProgress());
    assert.deepEqual(progress.paths.phases.completed, [0, 1, 2, 3, 4, 5]);
    assert.equal(progress.activePath, 'phases');
    assert.equal(doc.querySelector('#spx-learning-coach [role="progressbar"]')
      .getAttribute('aria-valuenow'), '6');
    assert.equal(doc.getElementById('spx-learning-progress-count').textContent, '6 of 6 complete');
    assert.match(doc.getElementById('spx-learning-status').textContent, /Lesson complete/i);

    storedProgress = win.localStorage.getItem('spx-student-progress-v1');
    assert.ok(storedProgress, 'lesson progress is durable in local storage');
    assert.deepEqual(JSON.parse(storedProgress).paths.phases.completed, [0, 1, 2, 3, 4, 5]);
  } finally {
    win.close();
  }

  const reloaded = await tool({
    storage: {
      'spx-workspace-mode-v1': 'student',
      'spx-student-progress-v1': storedProgress
    }
  });
  try {
    const restored = copy(reloaded.win.__SPX.release1.getStudentProgress());
    assert.equal(restored.activePath, 'phases');
    assert.equal(restored.activeStep, 5);
    assert.deepEqual(restored.paths.phases.completed, [0, 1, 2, 3, 4, 5]);
    assert.equal(reloaded.doc.getElementById('spx-learning-coach').hidden, false);
    assert.equal(reloaded.doc.querySelector('#spx-learning-coach [role="progressbar"]')
      .getAttribute('aria-valuenow'), '6');

    reloaded.win.__SPX.release1.setStudentArea('progress', false);
    assert.match(reloaded.doc.getElementById('spx-progress-paths').textContent,
      /Phase Diagram Foundations\s*Complete/);

    const scenario = copy(reloaded.win.serializable());
    for (const key of ['workspaceMode', 'startAudience', 'studentArea', 'studentProgress']) {
      assert.equal(Object.hasOwn(scenario, key), false,
        `${key} remains local UI state rather than shared scenario data`);
    }
  } finally {
    reloaded.win.close();
  }
});

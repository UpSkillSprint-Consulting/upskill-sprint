'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON = path.join(ROOT, 'lessons', '7-essential-quality-tools.html');
const html = fs.readFileSync(LESSON, 'utf8');

const TOOL_KEYS = ['flowchart', 'checksheet', 'stratification', 'pareto', 'fishbone', 'histogram', 'scatter', 'control'];

function loadLesson() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/lessons/7-essential-quality-tools.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  return new Promise(resolve => {
    dom.window.addEventListener('load', () => resolve({ window: dom.window, errors }));
  });
}

/* ---------- page contract (unchanged requirements) ---------- */

test('the lesson still carries the exact shared controller tags', () => {
  assert.equal(html.split('<script src="/theme.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/site-sections.js"></script>').length - 1, 1);
});

test('script tags remain balanced', () => {
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

/* ---------- nothing was removed: original content preserved ---------- */

test('the original tool-detail render is preserved (nothing removed)', async () => {
  const { window } = await loadLesson();
  const detail = window.document.getElementById('tool-detail').textContent;
  assert.match(detail, /Do not overclaim/, 'keeps the boundary callout');
  assert.match(detail, /Inputs/, 'keeps the inputs block');
  assert.match(detail, /Outputs/, 'keeps the outputs block');
});

test('the original lesson sections are all still present', () => {
  ['learning-objectives', 'key-concepts', 'decision-wizard', 'worked-example', 'summary'].forEach(id => {
    assert.ok(html.includes('id="' + id + '"'), `section #${id} is intact`);
  });
  assert.match(html, /Integrated steel investigation challenge/);
  assert.match(html, /Which quality tool should I use/);
});

/* ---------- additive: deep content + interactive widget per tool ---------- */

test('the tool nav still exposes all eight tools', async () => {
  const { window } = await loadLesson();
  const nav = window.document.querySelectorAll('.qe-tool-btn');
  assert.equal(nav.length, 8);
});

test('every tool mounts a deep-dive block with the required sections', async () => {
  const { window } = await loadLesson();
  const navBtns = Array.from(window.document.querySelectorAll('.qe-tool-btn'));

  for (const btn of navBtns) {
    btn.dispatchEvent(new window.Event('click', { bubbles: true }));
    const deep = window.document.getElementById('tool-deep');
    assert.ok(deep, `${btn.textContent} mounts a #tool-deep host`);
    const text = deep.textContent;
    assert.match(text, /In depth/, `${btn.textContent} has an In depth section`);
    assert.match(text, /How to read it/, `${btn.textContent} has a reading guide`);
    assert.match(text, /Worked example/, `${btn.textContent} has a worked example`);
    assert.match(text, /Common mistake/, `${btn.textContent} has a common mistake`);
    assert.match(text, /Exam/, `${btn.textContent} has an exam/real-world note`);
  }
});

test('every tool mounts an interactive widget while keeping the original render', async () => {
  const { window } = await loadLesson();
  const navBtns = Array.from(window.document.querySelectorAll('.qe-tool-btn'));

  for (const btn of navBtns) {
    btn.dispatchEvent(new window.Event('click', { bubbles: true }));
    const deep = window.document.getElementById('tool-deep');
    assert.ok(deep.querySelector('.qt-viz'), `${btn.textContent} mounts an interactive widget`);
    // an interactive surface: svg, table, flow, strat, or branch controls
    assert.ok(
      deep.querySelector('svg, table, .qt-flow, .qt-strat, .qt-branchbtns'),
      `${btn.textContent} renders an interactive surface`
    );
    // original render must still be there on every switch
    assert.match(
      window.document.getElementById('tool-detail').textContent,
      /Do not overclaim/,
      `${btn.textContent} preserves the original detail`
    );
  }
});

test('the lesson loads with no jsdom errors', async () => {
  const { errors } = await loadLesson();
  assert.deepEqual(errors, [], 'no runtime errors');
});

/* ---------- widget logic via the exposed test hook ---------- */

test('the QT7 test hook exposes the pure helpers', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT7;
  assert.ok(Q, 'window.__QT7 exists');
  ['mountDeep', 'paretoModel', 'histogram', 'shapeSample', 'correlatedPairs', 'pearson', 'controlModel']
    .forEach(fn => assert.equal(typeof Q[fn], 'function', `__QT7.${fn} is a function`));
  assert.deepEqual(Object.keys(Q.VIZ).sort(), TOOL_KEYS.slice().sort(), 'a widget exists for every tool');
  assert.deepEqual(Object.keys(Q.DEEP).sort(), TOOL_KEYS.slice().sort(), 'deep content exists for every tool');
});

test('Pareto ranks descending and re-ranks when the metric changes', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT7;
  const cats = [
    { label: 'Scratch', count: 42 }, { label: 'Scale', count: 30 },
    { label: 'Pit', count: 18 }, { label: 'Crack', count: 9 }, { label: 'Warp', count: 6 }
  ];
  const byCount = Q.paretoModel(cats, 'count');
  assert.equal(byCount.rows[0].label, 'Scratch', 'frequency leader is Scratch');
  for (let i = 1; i < byCount.rows.length; i++) {
    assert.ok(byCount.rows[i - 1].value >= byCount.rows[i].value, 'bars are descending');
  }
  assert.ok(Math.abs(byCount.rows[byCount.rows.length - 1].cum - 1) < 1e-9, 'cumulative reaches 100%');

  const costCats = cats.map(c => ({ label: c.label, cost: c.count * ({ Scratch: 8, Scale: 14, Pit: 20, Crack: 95, Warp: 40 })[c.label] }));
  const byCost = Q.paretoModel(costCats, 'cost');
  assert.equal(byCost.rows[0].label, 'Crack', 'cost leader is Crack — ranking changes with the metric');
});

test('histogram bins partition the sample (counts sum to n)', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT7;
  ['normal', 'skewed', 'bimodal'].forEach(shape => {
    const values = Q.shapeSample(shape, 240, 42);
    const h = Q.histogram(values, 9);
    assert.equal(h.bins.length, 9);
    assert.equal(h.bins.reduce((a, b) => a + b, 0), 240, `${shape} bins sum to n`);
  });
});

test('the scatter generator tracks the requested correlation', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT7;
  [-0.9, -0.5, 0, 0.5, 0.9].forEach(target => {
    const r = Q.pearson(Q.correlatedPairs(target, 300, 11));
    assert.ok(Math.abs(r - target) < 0.15, `target ${target} → measured ${r.toFixed(2)}`);
  });
});

test('the control model flags special causes but not a stable process', async () => {
  const { window } = await loadLesson();
  const Q = window.__QT7;
  assert.equal(Q.controlModel('stable', 5).flags.filter(Boolean).length, 0, 'stable process has no flags');
  assert.ok(Q.controlModel('shift', 5).flags.some(Boolean), 'a shift is flagged');
  assert.ok(Q.controlModel('spike', 5).flags.some(Boolean), 'a spike is flagged');
  const m = Q.controlModel('stable', 5);
  assert.equal(m.ucl, m.center + 3 * m.sigma, 'UCL is +3 sigma from center');
  assert.equal(m.lcl, m.center - 3 * m.sigma, 'LCL is -3 sigma from center');
});

/* ---------- a couple of live interactions ---------- */

test('switching the Pareto metric updates the caption', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('[data-tool="pareto"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const deep = window.document.getElementById('tool-deep');
  const before = deep.querySelector('.qt-info').textContent;
  const costBtn = Array.from(deep.querySelectorAll('button')).find(b => b.dataset.metric === 'cost');
  costBtn.dispatchEvent(new window.Event('click', { bubbles: true }));
  const after = deep.querySelector('.qt-info').textContent;
  assert.notEqual(before, after, 'the vital-few caption changes with the metric');
});

test('tallying a check-sheet cell increments its count', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('[data-tool="checksheet"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const cell = window.document.querySelector('.qt-cell');
  cell.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.equal(cell.querySelector('.qt-num').textContent, '1', 'the tally records a defect');
});

test('flagging a fishbone cause counts it as a hypothesis to test', async () => {
  const { window } = await loadLesson();
  window.document.querySelector('[data-tool="fishbone"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  const deep = window.document.getElementById('tool-deep');
  const cause = deep.querySelector('.qt-cause');
  cause.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.ok(deep.querySelector('.qt-cause.flagged'), 'the cause is flagged');
  assert.match(deep.textContent, /1 hypothesis/, 'the hypothesis counter increments');
});

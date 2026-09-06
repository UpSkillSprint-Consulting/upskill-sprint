'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const file = 'lessons/lean-six-sigma/signal-or-noise-arl-nelson-rules-control-limit-design.html';
const html = fs.readFileSync(file, 'utf8');
const simulation = html.split('/* ================= PART 3: SIMULATION ================= */')[1]
  .split('/* ================= PART 5: SELF-CHECK QUIZ ================= */')[0];

// Execute the actual lesson simulation with deterministic samples and frame scheduling.
// No test-only state or APIs are added to the lesson.
function harness(samples = [0, 2, -2, 3, -3, 3.5, -3.5, 1, -1, 0]) {
  const elements = new Map(), frames = new Map();
  let nextFrame = 0, sampleCount = 0, renders = 0, points = [];
  const ctx = {
    clearRect() { renders++; points = []; }, fillRect() {}, setLineDash() {},
    beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fillText() {}, fill() {},
    arc(x, y, radius) { points.push({ x, y, radius }); }
  };
  for (const id of ['simCanvas', 'nPoints', 'nPointsVal', 'runSim', 'clearSim', 'stat2', 'stat3', 'statRatio']) {
    const listeners = new Map();
    elements.set(id, {
      value: id === 'nPoints' ? '370' : '', textContent: '', width: 900, height: 320,
      getContext: () => ctx,
      addEventListener(type, fn) { const a = listeners.get(type) || []; a.push(fn); listeners.set(type, a); },
      emit(type) { for (const fn of listeners.get(type) || []) fn(); }
    });
  }
  vm.runInNewContext(simulation, {
    document: { getElementById: id => elements.get(id) },
    randNormal: () => samples[sampleCount++ % samples.length],
    requestAnimationFrame(fn) { const id = nextFrame++; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); }
  }, { timeout: 1000 });
  return {
    input(n) { elements.get('nPoints').value = String(n); elements.get('nPoints').emit('input'); },
    run() { elements.get('runSim').emit('click'); },
    clear() { elements.get('clearSim').emit('click'); },
    flush() { const queued = [...frames.values()]; frames.clear(); queued.forEach(fn => fn()); },
    get points() { return points; }, get pending() { return frames.size; },
    get renders() { return renders; }, get samples() { return sampleCount; },
    get label() { return String(elements.get('nPointsVal').textContent); },
    get stats() { return ['stat2', 'stat3', 'statRatio'].map(id => String(elements.get(id).textContent)); }
  };
}

test('Points slider redraws the chart without Run, including the reported 510 setting', () => {
  const h = harness();
  for (const n of [50, 510, 1000, 370, 50]) {
    h.input(n); assert.equal(h.label, String(n)); h.flush();
    assert.equal(h.points.length, n, 'plotted samples must follow the slider alone');
    assert.equal(h.stats[0], String(n * 0.4));
    assert.equal(h.stats[1], String(n * 0.2));
    assert.equal(h.stats[2], '2.0×');
  }
});

test('Rapid dragging coalesces to one frame using the latest selected number', () => {
  const h = harness();
  for (let n = 50; n <= 1000; n += 10) h.input(n);
  assert.equal(h.pending, 1); assert.equal(h.renders, 0); assert.equal(h.samples, 0);
  assert.equal(h.label, '1000'); h.flush();
  assert.equal(h.points.length, 1000); assert.equal(h.samples, 1000);
  assert.equal(h.renders, 1); assert.equal(h.pending, 0);
});

test('Clear cancels a pending slider redraw and moving again starts a new simulation', () => {
  const h = harness();
  h.input(510); assert.equal(h.pending, 1); h.clear(); h.flush();
  assert.equal(h.pending, 0); assert.equal(h.samples, 0); assert.equal(h.points.length, 0);
  assert.deepEqual(h.stats, ['0', '0', '—']); assert.equal(h.label, '510');
  h.input(520); h.flush(); assert.equal(h.points.length, 520);
});

test('Run replaces a pending slider redraw, runs once, and remains a fresh random draw', () => {
  const h = harness(); h.input(510); h.run();
  assert.equal(h.pending, 0); assert.equal(h.points.length, 510); assert.equal(h.renders, 1);
  assert.equal(h.samples, 510); h.flush(); assert.equal(h.samples, 510);
  h.run(); assert.equal(h.samples, 1020); assert.equal(h.points.length, 510);
});

test('Run and Clear still work before any slider input', () => {
  const h = harness(); h.run();
  assert.equal(h.points.length, 370); assert.equal(h.samples, 370);
  h.clear(); h.flush(); assert.equal(h.points.length, 0);
  assert.deepEqual(h.stats, ['0', '0', '—']);
});

test('Two- and three-sigma alarm tests retain strict boundaries and zero-rate display', () => {
  const h = harness([0, 2, -2, 3, -3]); h.run();
  assert.deepEqual(h.stats, ['148', '0', '∞']);
  const quiet = harness([0, 2, -2]); quiet.run();
  assert.deepEqual(quiet.stats, ['0', '0', '—']);
});

test('Repeated drag/clear/run cycles leave neither stale frames nor inconsistent counts', () => {
  const h = harness();
  for (let i = 0; i < 100; i++) {
    const n = 50 + (i % 96) * 10; h.input(n);
    if (i % 3 === 0) { h.clear(); h.flush(); assert.equal(h.points.length, 0); }
    else { if (i % 3 === 1) h.run(); h.flush(); assert.equal(h.points.length, n); }
    assert.equal(h.pending, 0);
  }
});

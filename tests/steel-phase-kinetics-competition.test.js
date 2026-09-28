'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { bootTool, ready } = require('./helpers/steel-phase-harness');

async function tool() { const ctx = bootTool(); await ready(ctx.win); return ctx; }
function setInputs(win, doc, v) {
  for (const [id, value] of Object.entries(v)) {
    const el = doc.getElementById(id);
    el.value = String(value);
    el.dispatchEvent(new win.Event('input', { bubbles: true }));
  }
}
const ttt = (rate, holdT, hold, fin) => ({
  'spx-kin-cooling': rate, 'spx-kin-hold-temp': holdT, 'spx-kin-hold': hold, 'spx-kin-final': fin
});

test('TTT hold time is continuous and monotonic: no clock reset after the hold', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  let prev = null;
  for (const hold of [0, 0.5, 2, 10, 60, 600]) {
    setInputs(win, doc, ttt(30, 650, hold, 25));
    const fr = win.__SPX.kineticsFractions();
    if (prev) assert.ok(fr.Martensite <= prev.Martensite + 1e-9, `hold ${hold} s must not raise martensite`);
    prev = fr;
  }
  setInputs(win, doc, ttt(30, 650, 0, 25));
  const zero = win.__SPX.kineticsFractions();
  setInputs(win, doc, ttt(30, 650, 0.01, 25));
  const tiny = win.__SPX.kineticsFractions();
  for (const k of Object.keys(zero)) assert.ok(Math.abs(zero[k] - (tiny[k] || 0)) < 0.01, `${k} continuous as hold → 0`);
});

test('TTT with no hold matches CCT for the same cooling rate and end temperature', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setInputs(win, doc, ttt(30, 550, 0, 25));
  const tttFr = win.__SPX.kineticsFractions();
  doc.getElementById('spx-mode-cct').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  setInputs(win, doc, { 'spx-kin-cooling': 30, 'spx-kin-final': 25 });
  const cctFr = win.__SPX.kineticsFractions();
  for (const k of Object.keys(cctFr)) assert.ok(Math.abs(cctFr[k] - (tttFr[k] || 0)) < 0.005, `${k}: ${cctFr[k]} vs ${tttFr[k]}`);
});

test('competing reactions: the earlier, faster reaction takes the larger share', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setInputs(win, doc, ttt(120, 500, 60, 25));
  const fr = win.__SPX.kineticsFractions();
  assert.ok(fr.Bainite > fr.Pearlite, `bainite ${fr.Bainite} should exceed pearlite ${fr.Pearlite} at 500 °C`);
  assert.ok(Math.abs(fr.Bainite - 0.5) > 0.05, 'no artificial 50/50 split');
});

test('Hultgren cap: no proeutectoid ferrite far below the nose, full equilibrium ferrite on slow cooling', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setInputs(win, doc, ttt(120, 500, 60, 25));
  assert.ok(win.__SPX.kineticsFractions().Ferrite < 0.01, 'fast quench to 500 °C forms essentially no ferrite');
  assert.ok(win.proeutectoidCapAt(700, 0.18) > win.proeutectoidCapAt(600, 0.18), 'cap tapers with undercooling');
  assert.equal(win.proeutectoidCapAt(500, 0.18), 0);
  doc.getElementById('spx-mode-cct').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  setInputs(win, doc, { 'spx-kin-cooling': 0.3, 'spx-kin-final': 25 });
  const slow = win.__SPX.kineticsFractions();
  assert.ok(Math.abs(slow.Ferrite - win.finalMicro(0.18).Ferrite) < 0.01, 'slow cooling reaches the lever-rule ferrite fraction');
  assert.ok(slow.Martensite < 1e-9, 'slow cooling leaves no martensite');
});

test('crossing caveat also covers ferrite crossed during the quench', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setInputs(win, doc, ttt(10, 500, 60, 25));
  const text = doc.querySelector('.spx-kin-crossings').textContent;
  assert.match(text, /Ferrite start crossed/);
  assert.match(text, /read early/);
});

test('TTT cooling-segment crossings are hollow and graphical; hold and CCT crossings are solid', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  setInputs(win, doc, ttt(120, 500, 60, 25));
  const marks = [...doc.querySelectorAll('#spx-kinetics-svg circle[data-crossing]')];
  const graphical = marks.filter(m => m.dataset.crossing === 'graphical');
  const hold = marks.filter(m => m.dataset.crossing === 'hold');
  assert.ok(graphical.length > 0 && hold.length > 0, 'both kinds present');
  graphical.forEach(m => {
    assert.equal(m.getAttribute('fill'), 'var(--spx-bg)', 'graphical markers are hollow');
    assert.match(m.querySelector('title').textContent, /Graphical only, not a real crossing/);
  });
  hold.forEach(m => {
    assert.notEqual(m.getAttribute('fill'), 'var(--spx-bg)');
    assert.equal(Math.round(Number(m.getAttribute('cy'))), Math.round(Number(hold[0].getAttribute('cy'))), 'hold markers sit on the hold line');
  });
  assert.match(doc.querySelector('.spx-kin-crossings').textContent, /On the hold:.*While cooling \(hollow markers, graphical only\)/s);
  doc.getElementById('spx-mode-cct').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
  setInputs(win, doc, { 'spx-kin-cooling': 10, 'spx-kin-final': 25 });
  const cct = [...doc.querySelectorAll('#spx-kinetics-svg circle[data-crossing]')];
  assert.ok(cct.length > 0 && cct.every(m => m.dataset.crossing === 'cct'), 'CCT crossings are read directly');
  assert.doesNotMatch(doc.querySelector('.spx-kin-crossings').textContent, /graphical only/);
});

test('Ms is drawn as a solid start line, not in the dashed finish style', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const ms = doc.querySelector('#spx-kinetics-svg [data-kin="Martensite start"]');
  assert.ok(ms);
  assert.equal(ms.getAttribute('stroke-dasharray'), null);
  assert.match(doc.getElementById('spx-kinetics-svg').textContent, /martensite start/);
});

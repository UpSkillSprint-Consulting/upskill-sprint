'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { bootTool, ready, waitFor, ROOT } = require('./helpers/steel-phase-harness.js');

const TABS = ['navigator', 'equilibrium', 'path', 'kinetics', 'chemistry', 'hardenability', 'austenitization',
  'quenching', 'process-data', 'metallurgy-lab', 'reference-diagrams', 'learn'];

async function tool(opts) {
  const ctx = bootTool(opts);
  await ready(ctx.win);
  await waitFor(ctx.win, w => TABS.every(k => w.document.querySelector('#spx-tab-' + k + ' > [data-student-guide-bar]')));
  return ctx;
}

test('every tab gets exactly one student guide bar with its own guide', async t => {
  const { win, doc, record } = await tool();
  t.after(() => win.close());
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-student-guides.js'));
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-student-guides.css'));
  const guides = win.__SPX.studentGuides;
  assert.deepEqual(JSON.parse(JSON.stringify(guides.keys)).sort(), [...TABS].sort());
  const titles = new Set(), purposes = new Set();
  for (const key of TABS) {
    const panel = doc.getElementById('spx-tab-' + key);
    assert.ok(panel, key + ' panel exists');
    const bars = panel.querySelectorAll(':scope > [data-student-guide-bar]');
    assert.equal(bars.length, 1, key + ' has one bar');
    // At the top of the tab; only the Professional-only workspace section may precede it.
    for (let n = bars[0].previousElementSibling; n; n = n.previousElementSibling) {
      assert.equal(n.id, 'spx-professional-workspace', key + ' bar is at the top of the student view');
    }
    const g = guides.guide(key);
    assert.ok(g.use.length >= 3 && g.read.length >= 3 && g.tryThis && g.caution && g.purpose, key + ' guide complete');
    titles.add(g.title); purposes.add(g.purpose);
  }
  assert.equal(titles.size, TABS.length, 'titles are unique');
  assert.equal(purposes.size, TABS.length, 'each guide is specific to its tool');
});

test('the guide opens in a non-modal panel docked on the right, and closes with × or Escape', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const btn = doc.querySelector('#spx-tab-kinetics [data-student-guide="kinetics"]');
  assert.equal(btn.getAttribute('aria-controls'), 'spx-student-guide-panel');
  assert.equal(btn.getAttribute('aria-expanded'), 'false');
  btn.focus();
  btn.click();
  const panel = doc.getElementById('spx-student-guide-panel');
  assert.equal(panel.hidden, false);
  assert.equal(panel.tagName, 'ASIDE');
  assert.equal(panel.getAttribute('aria-modal'), null, 'not modal: the tool stays usable');
  assert.ok(doc.body.classList.contains('spx-guide-docked'), 'page is narrowed so the panel does not cover the tool');
  assert.equal(btn.getAttribute('aria-expanded'), 'true');
  assert.match(doc.getElementById(panel.getAttribute('aria-labelledby')).textContent, /^TTT \/ CCT/);
  assert.match(panel.textContent, /How to use it[\s\S]*How to read the results[\s\S]*Try this[\s\S]*Watch out/);
  assert.equal(doc.activeElement.id, 'spx-student-guide-title');
  panel.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(panel.hidden, true);
  assert.ok(!doc.body.classList.contains('spx-guide-docked'));
  assert.equal(doc.activeElement, btn, 'focus returns to the opener');
  btn.click();
  doc.getElementById('spx-student-guide-close').click();
  assert.equal(panel.hidden, true, 'the × button closes it');
  btn.click();
  btn.click();
  assert.equal(panel.hidden, true, 'the tab button toggles the panel');
});

test('the open panel follows the active tab', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  doc.querySelector('[data-student-guide="equilibrium"]').click();
  win.switchTab('quenching');
  await new Promise(r => setTimeout(r, 0));
  const panel = doc.getElementById('spx-student-guide-panel');
  assert.equal(panel.dataset.guide, 'quenching');
  assert.match(doc.getElementById('spx-student-guide-title').textContent, /^Quenching/);
  assert.equal(doc.querySelector('[data-student-guide="quenching"]').getAttribute('aria-expanded'), 'true');
});

test('different tabs open different guides', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const body = () => doc.getElementById('spx-student-guide-body').textContent;
  doc.querySelector('[data-student-guide="austenitization"]').click();
  const a = body();
  win.__SPX.studentGuides.close();
  doc.querySelector('[data-student-guide="process-data"]').click();
  const b = body();
  assert.notEqual(a, b);
  assert.match(a, /effective soak/i);
  assert.match(b, /Load sample cooling data/);
});

test('guides are a Student-mode feature: hidden by CSS in Professional mode, panel closes on switch', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const css = fs.readFileSync(path.join(ROOT, 'tools', 'steel-phase-explorer-student-guides.css'), 'utf8');
  assert.match(css, /#spx-tool:not\(\[data-workspace-mode="student"\]\) \.spx-student-guide-bar,#spx-tool:not\(\[data-workspace-mode="student"\]\) \.spx-student-guide-panel\{display:none\}/);
  assert.match(css, /\.spx-student-guide-panel\[hidden\]\{display:none\}/);
  assert.match(css, /body\.spx-guide-docked\{padding-right:var\(--spx-guide-w\)\}/);
  assert.equal(doc.getElementById('spx-tool').dataset.workspaceMode, 'student');
  doc.querySelector('[data-student-guide="equilibrium"]').click();
  doc.dispatchEvent(new win.CustomEvent('spx:workspace-mode', { detail: { mode: 'professional' } }));
  assert.equal(doc.getElementById('spx-student-guide-panel').hidden, true);
  assert.ok(!doc.body.classList.contains('spx-guide-docked'));
});

test('guide panel and help dialogs live inside #spx-tool so they inherit its theme variables and button styles', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  doc.querySelector('[data-student-guide="equilibrium"]').click();
  const guide = doc.getElementById('spx-student-guide-panel');
  assert.ok(doc.getElementById('spx-tool').contains(guide), 'student guide panel is inside #spx-tool');
  win.__SPX.studentGuides.close();
  doc.querySelector('[data-r2-help="austenitization"]').click();
  const r2 = doc.getElementById('spx-r2-help-dialog');
  assert.ok(r2 && doc.getElementById('spx-tool').contains(r2), 'Release 2 help dialog is inside #spx-tool');
  const css = fs.readFileSync(path.join(ROOT, 'tools', 'steel-phase-explorer-student-guides.css'), 'utf8');
  assert.match(css, /background:var\(--spx-bg,var\(--paper,#fff\)\)/, 'panel has an opaque background fallback');
});

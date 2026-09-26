'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { bootTool, ready, ROOT } = require('./helpers/steel-phase-harness.js');

async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}

function dataset(overrides = {}) {
  const grade = {
    displayName: 'Grade L360 / X52 PSL2',
    specEdition: 'Controlled contract edition',
    psl: 'PSL2', category: null,
    verification: { lastVerifiedBy: null, lastVerifiedDate: null, notes: '' },
    applicableForms: ['ERW_HFW', 'SAWL'],
    chemistry: { secretLimit: 0.24 }, footnoteRules: [],
    mechanical: { secretStrength: 360 },
    charpy: { required: true }, dwtt: null, testing: {}, overlays: {},
    notes: [], equivalents: [],
    ...overrides
  };
  return {
    schemaVersion: '1.0', exportedAt: null,
    specBodies: { API_5L: { displayName: 'API 5L', grades: { X52_PSL2: grade } } }
  };
}

test('Step 10 loads after release readiness and keeps all original modules', async t => {
  const { win, doc, record } = await tool();
  t.after(() => win.close());
  assert.equal(win.__SPX.specificationHandoff.version, '1.0.0');
  assert.equal(win.__SPX.releaseReadiness.automatedGates().find(gate =>
    gate.id === 'specification-handoff')?.pass, true);
  assert.ok(doc.getElementById('spx-specification-handoff'));
  assert.equal(doc.querySelectorAll('.spx-tabs [data-tab]').length, 12);
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-specification-handoff.js'));
  assert.ok(record.loaded.includes('tools/steel-phase-explorer-specification-handoff.css'));
  assert.equal(doc.getElementById('spx-spec-import-status').getAttribute('aria-live'), 'polite');
});

test('SPEC_DATA identity validation accepts v1 and warns when grade identity is unverified', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const result = win.__SPX.specificationHandoff.validateDataset(dataset());
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
  assert.ok(result.warnings.some(item => item.code === 'UNVERIFIED_GRADE'));
});

test('incompatible, malformed, and prototype-related identities fail closed', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const api = win.__SPX.specificationHandoff;
  assert.equal(api.parseDataset('{bad json').valid, false);
  assert.equal(api.validateDataset({ ...dataset(), schemaVersion: '2.0' }).valid, false);
  assert.equal(api.buildContext(dataset(), '__proto__', 'X52_PSL2', 'ERW_HFW'), null);
  assert.equal(api.buildContext(dataset(), 'API_5L', '__proto__', 'ERW_HFW'), null);
  assert.equal(api.buildContext(dataset(), 'API_5L', 'X52_PSL2', 'PLATE'), null);
});

test('export context contains identity only and excludes every requirements section', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const context = JSON.parse(JSON.stringify(
    win.__SPX.specificationHandoff.buildContext(dataset(), 'API_5L', 'X52_PSL2', 'ERW_HFW')
  ));
  assert.deepEqual(Object.keys(context).sort(), [
    'applicableForm', 'category', 'displayName', 'gradeKey', 'psl',
    'schemaVersion', 'specBody', 'specEdition', 'verification'
  ].sort());
  for (const forbidden of ['chemistry', 'mechanical', 'charpy', 'dwtt', 'testing',
    'overlays', 'footnoteRules', 'equivalents', 'secretLimit', 'secretStrength']) {
    assert.equal(JSON.stringify(context).includes(forbidden), false, forbidden);
  }
});

test('Step 10 cannot mutate scenario serialization or metallurgy calculations', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  win.__SPX.setPoint(0.47, 812);
  const before = JSON.parse(JSON.stringify(win.serializable()));
  const calculations = JSON.parse(JSON.stringify({
    phases: win.__SPX.phaseFractions(0.47, 812),
    chemistry: win.__SPX.chemMetrics(), kinetics: win.__SPX.kineticsFractions()
  }));
  win.__SPX.specificationHandoff.buildContext(dataset(), 'API_5L', 'X52_PSL2', 'ERW_HFW');
  assert.deepEqual(JSON.parse(JSON.stringify(win.serializable())), before);
  assert.deepEqual(JSON.parse(JSON.stringify({
    phases: win.__SPX.phaseFractions(0.47, 812),
    chemistry: win.__SPX.chemMetrics(), kinetics: win.__SPX.kineticsFractions()
  })), calculations);
});

test('handoff UI names both governed destination tools and the non-acceptance boundary', async t => {
  const { win, doc } = await tool();
  t.after(() => win.close());
  const section = doc.getElementById('spx-specification-handoff');
  assert.match(section.textContent, /Material Specification Lookup/);
  assert.match(section.textContent, /Compliance Checker/);
  assert.match(section.textContent, /cannot establish specification compliance or release product/i);
  assert.equal(section.querySelector('a[href="/engineering-tools/grade-specification-lookup/"]')?.tagName, 'A');
  assert.equal(section.querySelector('a[href="/tools/material-specification-compliance-checker"]')?.tagName, 'A');
});

test('specification handoff CSS covers all required responsive breakpoints', () => {
  const css = fs.readFileSync(path.join(ROOT, 'tools/steel-phase-explorer-specification-handoff.css'), 'utf8');
  for (const width of [360, 390, 768, 1024, 1440]) {
    assert.match(css, new RegExp(`(?:max|min)-width:${width}px`));
  }
});

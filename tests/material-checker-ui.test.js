'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {JSDOM} = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

function source(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

async function createChecker() {
  const dom = new JSDOM(source('tools/material-specification-compliance-checker.html'), {
    url: 'https://upskillsprint.test/tools/material-specification-compliance-checker',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const {window} = dom;
  window.confirm = () => true;
  window.prompt = () => '';
  window.print = () => {};
  window.requestAnimationFrame = callback => {
    callback(Date.now());
    return 0;
  };
  window.cancelAnimationFrame = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.eval(source('tools/material-specification-compliance-checker-config.js'));
  window.eval(source('tools/material-specification-grade-library.js'));
  window.eval(source('tools/material-checker-engine.js'));
  window.eval(source('tools/material-specification-compliance-checker.js'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded', {bubbles: true}));
  await new Promise(resolve => window.setTimeout(resolve, 20));
  return dom;
}

async function createPlatform(options = {}) {
  const dom = await createChecker();
  const {window} = dom;
  const user = {id: 'test-user', email: 'tester@example.test', user_metadata: {full_name: 'Test User'}};
  if (options.auth !== false) {
    window.UpskillAuth = {
      getUser: () => user,
      getClient: () => ({auth: {getSession: async () => ({data: {session: {access_token: 'test-token'}}})}}),
      onChange: listener => listener(user),
      signOut: async () => {}
    };
  }
  window.open = () => {
    window.__openCount = (window.__openCount || 0) + 1;
    return null;
  };
  window.eval(source('tools/material-checker-platform.js'));
  window.eval(source('tools/material-checker-platform-hardening.js'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded', {bubbles: true}));
  await new Promise(resolve => window.setTimeout(resolve, 30));
  return dom;
}

function change(window, control, value) {
  if (control.type === 'checkbox') control.checked = Boolean(value);
  else control.value = String(value);
  control.dispatchEvent(new window.Event('input', {bubbles: true}));
  control.dispatchEvent(new window.Event('change', {bubbles: true}));
}

function selectOnly(window, section) {
  window.document.querySelector('#clearSections').click();
  const input = window.document.querySelector('#selectors input[value="' + section + '"]');
  change(window, input, true);
}

function completeScope(window) {
  const values = {
    materialId: 'TEST-001',
    productForm: 'Plate',
    sourceEdition: 'Controlled source rev 1',
    targetEdition: 'Controlled target rev 1',
    requirementStatus: 'controlled'
  };
  Object.entries(values).forEach(([key, value]) => {
    change(window, window.document.querySelector('[data-scope="' + key + '"]'), value);
  });
}

function setRow(window, section, values, index = 0) {
  const row = window.document.querySelectorAll('[data-sec="' + section + '"]')[index];
  assert.ok(row, 'expected ' + section + ' row ' + index);
  Object.entries(values).forEach(([field, value]) => {
    const control = row.querySelector('[data-f="' + field + '"]');
    assert.ok(control, 'expected ' + field + ' control');
    change(window, control, value);
  });
}

function run(window) {
  window.document.querySelector('#run').click();
  return window.MaterialCheckerCore.getResult();
}

test('blank assessment is conditional and never passes', async () => {
  const dom = await createChecker();
  const result = run(dom.window);
  assert.equal(result.status, 'conditional');
  assert.ok(result.counts.missing >= 1);
  assert.notEqual(dom.window.document.querySelector('#overall').textContent, 'Pass');
});

test('a traceable controlled quantitative comparison can pass', async () => {
  const dom = await createChecker();
  const {window} = dom;
  selectOnly(window, 'chemistry');
  completeScope(window);
  setRow(window, 'chemistry', {
    propertyCode: 'chem_carbon',
    actual: '0.10',
    max: '0.20',
    source: 'Controlled Table 1'
  });
  const result = run(window);
  assert.equal(result.status, 'pass');
  assert.equal(result.coverage, 100);
});

test('missing controlled clause prevents a clean pass', async () => {
  const dom = await createChecker();
  const {window} = dom;
  selectOnly(window, 'chemistry');
  completeScope(window);
  setRow(window, 'chemistry', {
    propertyCode: 'chem_carbon',
    actual: '0.10',
    max: '0.20'
  });
  const result = run(window);
  assert.equal(result.status, 'conditional');
  assert.equal(result.rows.find(row => row.name === 'Carbon (C)').status, 'review');
});

test('negative chemistry and reversed bounds are invalid input', async () => {
  const negativeDom = await createChecker();
  selectOnly(negativeDom.window, 'chemistry');
  completeScope(negativeDom.window);
  setRow(negativeDom.window, 'chemistry', {
    propertyCode: 'chem_carbon',
    actual: '-0.10',
    max: '0.20',
    source: 'Controlled Table 1'
  });
  assert.equal(run(negativeDom.window).status, 'invalid-input');

  const boundsDom = await createChecker();
  selectOnly(boundsDom.window, 'chemistry');
  completeScope(boundsDom.window);
  setRow(boundsDom.window, 'chemistry', {
    propertyCode: 'chem_carbon',
    actual: '0.15',
    min: '0.20',
    max: '0.10',
    source: 'Controlled Table 1'
  });
  const boundsResult = run(boundsDom.window);
  assert.equal(boundsResult.status, 'invalid-input');
  assert.match(boundsResult.rows.find(row => row.name === 'Carbon (C)').detail, /minimum exceeds the maximum/i);
});

test('changing an input clears stale result rows', async () => {
  const dom = await createChecker();
  const {window} = dom;
  selectOnly(window, 'chemistry');
  completeScope(window);
  setRow(window, 'chemistry', {
    propertyCode: 'chem_carbon',
    actual: '0.10',
    max: '0.20',
    source: 'Controlled Table 1'
  });
  assert.equal(run(window).status, 'pass');
  const actual = window.document.querySelector('[data-sec="chemistry"] [data-f="actual"]');
  change(window, actual, '0.11');
  assert.equal(window.document.querySelector('#overall').textContent, 'Not assessed');
  assert.equal(window.MaterialCheckerCore.getResult(), null);
  assert.match(window.document.querySelector('#results').textContent, /No current assessment result/i);
});

test('an assessment dated tomorrow is invalid input', async () => {
  const dom = await createChecker();
  const {window} = dom;
  selectOnly(window, 'chemistry');
  completeScope(window);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowText = [tomorrow.getFullYear(), String(tomorrow.getMonth() + 1).padStart(2, '0'), String(tomorrow.getDate()).padStart(2, '0')].join('-');
  change(window, window.document.querySelector('[data-scope="assessmentDate"]'), tomorrowText);
  setRow(window, 'chemistry', {
    propertyCode: 'chem_carbon', actual: '0.10', max: '0.20', source: 'Controlled Table 1'
  });
  const result = run(window);
  assert.equal(result.status, 'invalid-input');
  assert.equal(result.rows.find(row => row.name === 'Assessment date').status, 'invalid');
});

test('legacy unsupported units remain visible and cannot be reinterpreted as a pass', async () => {
  const dom = await createChecker();
  const {window} = dom;
  const imported = window.MaterialCheckerCore.getState();
  Object.keys(imported.selected).forEach(section => { imported.selected[section] = section === 'mechanical'; });
  Object.assign(imported.scope, {
    materialId: 'LEGACY-001', productForm: 'Plate', sourceEdition: 'Legacy source',
    targetEdition: 'Controlled target', requirementStatus: 'controlled'
  });
  imported.rows.mechanical = [{
    id: 'legacy-unit-row', propertyCode: 'mech_yield_strength', name: 'Yield strength',
    actual: '0.08', aUnit: '%', min: '0.05', max: '0.10', rUnit: '%',
    source: 'Legacy controlled table', mandatory: true
  }];
  window.MaterialCheckerCore.load({version: 2, state: imported});
  const row = window.document.querySelector('[data-sec="mechanical"]');
  assert.equal(row.querySelector('[data-f="aUnit"]').value, '%');
  assert.match(row.querySelector('[data-f="aUnit"] option:checked').textContent, /unsupported/i);
  const result = run(window);
  assert.equal(result.status, 'invalid-input');
  assert.match(result.rows.find(item => item.name === 'Yield strength').detail, /unsupported/i);
});

test('Charpy energy check enforces the entered specimen count requirement', async () => {
  const dom = await createChecker();
  const {window} = dom;
  selectOnly(window, 'charpy');
  completeScope(window);
  setRow(window, 'charpy', {
    propertyCode: 'charpy_body_tl',
    testTemp: '-20',
    specimenCount: '1',
    avg: '100',
    individual: '90',
    reqTemp: '-20',
    reqSpecimenCount: '3',
    reqAvg: '80',
    reqIndividual: '60',
    source: 'Controlled toughness clause'
  });
  const result = run(window);
  assert.equal(result.status, 'fail');
  assert.equal(result.rows.find(row => row.sec === 'charpy').status, 'fail');
});

test('yield-to-tensile ratio is calculated when canonical inputs are complete', async () => {
  const dom = await createChecker();
  const {window} = dom;
  selectOnly(window, 'mechanical');
  completeScope(window);
  setRow(window, 'mechanical', {
    propertyCode: 'mech_yield_strength',
    actual: '500',
    min: '450',
    source: 'Controlled tensile table'
  }, 0);
  window.document.querySelector('[data-add="mechanical"]').click();
  setRow(window, 'mechanical', {
    propertyCode: 'mech_tensile_strength',
    actual: '600',
    min: '550',
    source: 'Controlled tensile table'
  }, 1);
  window.document.querySelector('[data-add="mechanical"]').click();
  setRow(window, 'mechanical', {
    propertyCode: 'mech_yt_ratio',
    max: '0.90',
    source: 'Controlled tensile table'
  }, 2);
  const result = run(window);
  const ratio = result.rows.find(row => row.name === 'Yield-to-tensile ratio');
  assert.equal(result.status, 'pass');
  assert.equal(ratio.status, 'pass');
  assert.match(ratio.detail, /Automatically calculated/i);
  assert.match(ratio.actual, /0\.83333/);
});

test('worked example is generic, unresolved, and never auto-runs', async () => {
  const dom = await createChecker();
  const {window} = dom;
  window.document.querySelector('#example').click();
  assert.equal(window.document.querySelector('#overall').textContent, 'Not assessed');
  assert.match(window.document.querySelector('[data-scope="targetEdition"]').value, /Training rule set/i);
  assert.doesNotMatch(window.document.querySelector('[data-scope="targetEdition"]').value, /46th/i);
  assert.notEqual(run(window).status, 'pass');
});

test('advanced approval and certificate paths reject an unresolved assessment', async () => {
  const dom = await createPlatform();
  const {window} = dom;
  window.document.querySelector('[data-platform-tab="admin"]').click();
  change(window, window.document.querySelector('#mcLocalRole'), 'Approver');
  window.document.querySelector('[data-platform-tab="review"]').click();
  change(window, window.document.querySelector('[data-workflow-field="reviewer"]'), 'Reviewer One');
  change(window, window.document.querySelector('[data-workflow-field="approver"]'), 'Approver Two');
  change(window, window.document.querySelector('[data-workflow-field="disposition"]'), 'Accepted');
  window.document.querySelector('[data-mc-action="approveAssessment"]').click();
  assert.match(window.document.querySelector('#mcPlatformStatus').textContent, /Only a 100% coverage Pass/i);
  assert.equal(window.document.querySelector('#run').disabled, false);
  window.document.querySelector('[data-mc-action="printCertificate"]').click();
  assert.match(window.document.querySelector('#mcPlatformStatus').textContent, /only after a 100% coverage Pass/i);
  assert.equal(window.__openCount || 0, 0);
});

test('approved status cannot be selected manually', async () => {
  const dom = await createPlatform();
  const {window} = dom;
  window.document.querySelector('[data-platform-tab="review"]').click();
  const status = window.document.querySelector('[data-workflow-field="status"]');
  assert.equal(Array.from(status.options).some(option => option.value === 'Approved'), false);
  status.append(new window.Option('Approved', 'Approved'));
  change(window, status, 'Approved');
  window.document.querySelector('[data-mc-action="saveWorkflow"]').click();
  assert.match(window.document.querySelector('#mcPlatformStatus').textContent, /only be assigned by the Approve and lock control/i);
  assert.notEqual(window.document.querySelector('[data-workflow-field="status"]').value, 'Approved');
});

test('a clean approval locks editable controls but preserves report and unlock actions', async () => {
  const dom = await createPlatform();
  const {window} = dom;
  selectOnly(window, 'chemistry');
  completeScope(window);
  setRow(window, 'chemistry', {
    propertyCode: 'chem_carbon',
    actual: '0.10',
    max: '0.20',
    source: 'Controlled Table 1'
  });
  assert.equal(run(window).status, 'pass');
  window.document.querySelector('[data-platform-tab="admin"]').click();
  change(window, window.document.querySelector('#mcLocalRole'), 'Approver');
  window.document.querySelector('[data-platform-tab="review"]').click();
  change(window, window.document.querySelector('[data-workflow-field="reviewer"]'), 'Reviewer One');
  change(window, window.document.querySelector('[data-workflow-field="approver"]'), 'Approver Two');
  change(window, window.document.querySelector('[data-workflow-field="disposition"]'), 'Accepted');
  window.document.querySelector('[data-mc-action="approveAssessment"]').click();
  assert.match(window.document.querySelector('#mcPlatformStatus').textContent, /approved and locked/i);
  assert.equal(window.document.querySelector('[data-workflow-field="status"]').value, 'Approved');
  assert.equal(window.document.querySelector('[data-workflow-field="reviewer"]').disabled, true);
  assert.equal(window.document.querySelector('#run').disabled, true);
  assert.equal(window.document.querySelector('[data-mc-action="addOverride"]').disabled, true);
  assert.equal(window.document.querySelector('[data-mc-action="unlockAssessment"]').disabled, false);
  assert.equal(window.document.querySelector('[data-mc-action="printReport"]').disabled, false);
  assert.equal(window.document.querySelector('[data-mc-action="printCertificate"]').disabled, false);
});

test('advanced validation suite passes and uses the site Supabase identity path', async () => {
  const dom = await createPlatform();
  const {window} = dom;
  window.document.querySelector('[data-platform-tab="admin"]').click();
  window.document.querySelector('[data-mc-action="runTests"]').click();
  const failures = Array.from(window.document.querySelectorAll('#mcTestList strong.fail'));
  assert.equal(failures.length, 0);
  assert.match(window.document.querySelector('[data-platform-panel="admin"]').textContent, /Supabase session/i);
  assert.doesNotMatch(source('tools/material-specification-compliance-checker.html'), /identity\.netlify\.com/i);
  assert.match(source('tools/material-checker-platform.js'), /window\.UpskillAuth/);
});

test('advanced storage subscribes when the lazy Supabase auth bundle becomes ready', async () => {
  const dom = await createPlatform({auth: false});
  const {window} = dom;
  window.document.querySelector('[data-platform-tab="admin"]').click();
  assert.match(window.document.querySelector('#mcStorageStatus').textContent, /Not signed in/i);
  const user = {id: 'late-user', email: 'late@example.test', user_metadata: {full_name: 'Late User'}};
  window.UpskillAuth = {
    getUser: () => user,
    getClient: () => ({auth: {getSession: async () => ({data: {session: {access_token: 'late-token'}}})}}),
    onChange: listener => listener(user),
    signOut: async () => {}
  };
  window.document.dispatchEvent(new window.CustomEvent('upskill-auth-ready'));
  await new Promise(resolve => window.setTimeout(resolve, 10));
  assert.match(window.document.querySelector('#mcStorageStatus').textContent, /Signed in as late@example\.test/i);
});

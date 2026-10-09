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

async function createChecker(route = '/tools/material-specification-compliance-checker') {
  const dom = new JSDOM(source('tools/material-specification-compliance-checker.html'), {
    url: 'https://upskillsprint.test' + route,
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
  window.eval(source('tools/material-checker-standards.js'));
  window.eval(source('tools/material-specification-grade-library.js'));
  window.eval(source('tools/material-checker-engine.js'));
  window.eval(source('tools/material-checker-standard-inputs.js'));
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

function loadAudited(window, family = 'A36', extra = {}) {
  const state = window.MaterialCheckerCore.getState();
  Object.assign(state.scope, {materialId:'AUDIT-UI',productForm:family === 'Z245' ? 'Line pipe' : 'Plate',sourceEdition:'MTR revision 1',requirementStatus:'controlled',
    targetOrg:family === 'A36' ? 'ASTM' : 'CSA',targetStandard:family === 'A36' ? 'ASTM A36/A36M' : family === 'Z245' ? 'CSA Z245.1' : 'CSA G40.21',
    targetGrade:family === 'A36' ? 'Grade A36' : family === 'Z245' ? 'Grade 483 Category II' : 'Grade 350WT / Grade 50WT',
    targetEdition:family === 'A36' ? 'ASTM A36/A36M-19' : family === 'Z245' ? 'CSA Z245.1:26' : 'CSA G40.20-13/G40.21-13 (R2023), Update No. 1 (May 2014)',
    thickness:'30',thicknessUnit:'mm',width:'601',widthUnit:'mm',
    standardContext:family === 'Z245' ? {form:'ERW_HFW',analysisType:'HEAT',category:'II',supplyCondition:'AS_MANUFACTURED',odMM:457,nominalAreaMM2:400,gaugeLengthMM:50,orderTemperatureC:-20,toughnessTarget:'BODY',serviceCondition:'BASE'} :
      {form:'PLATE',analysisType:'HEAT',unitBasis:'SI',gaugeLengthMM:50,bearingUse:'NONE',floorPlate:false,copperSpecified:false,impactSupplement:false,productSubtype:'ROLLED',tensileOrientation:'LONGITUDINAL',tensileSpecimenType:'RECTANGULAR',supplyCondition:'AS_ROLLED',impactCategory:2},
    standardTests:family === 'Z245' ? {cvnEnergies:[30,30,60],cvnUnit:'J',cvnSize:'10x10',testTemperatureC:-20,cvnShears:[85,85,85],orderHeatCount:4} : {}, ...extra});
  state.selected = Object.fromEntries(Object.keys(state.selected).map(k=>[k,false]));
  state.rows.chemistry = [{id:'audit-carbon',propertyCode:'chem_carbon',name:'Carbon (C)',actual:'.26',aUnit:'%',min:'',max:'.26',rUnit:'%',source:'Additional manual limit',mandatory:true}];
  window.MaterialCheckerCore.load({version:3,state});
  return state;
}

test('attached rules run in the UI even when every manual section is deselected', async () => {
  const dom=await createChecker();
  loadAudited(dom.window);
  const result=run(dom.window);
  assert.equal(result.status,'fail');
  assert.ok(result.rows.some(r=>/C \(heat analysis\)/.test(r.name)&&r.status==='fail'&&/0\.25/.test(r.rule)));
  assert.equal(result.standard.family,'A36');
  assert.match(result.standard.sourceHash,/^[a-f0-9]{64}$/);
});

test('standard input loading produces actual-only rows and survives assessment round trips', async () => {
  const dom=await createChecker(); const {window}=dom;
  loadAudited(window,'Z245');
  window.document.querySelector('[data-standard-load]').click();
  const state=window.MaterialCheckerCore.getState();
  assert.ok(state.rows.chemistry.some(r=>r.propertyCode==='chem_niobium'&&r.standardInput));
  assert.ok(state.rows.chemistry.some(r=>r.propertyCode==='chem_copper'&&r.standardInput));
  const standardRow=state.rows.mechanical.find(r=>r.standardInput);
  assert.ok(standardRow);
  standardRow.actual='520';
  window.MaterialCheckerCore.load({version:3,state});
  const restored=window.MaterialCheckerCore.getState();
  assert.equal(restored.rows.mechanical.find(r=>r.id===standardRow.id).standardInput,true);
  assert.equal(restored.rows.mechanical.find(r=>r.id===standardRow.id).actual,'520');
  assert.deepEqual(JSON.parse(JSON.stringify(restored.scope.standardTests.cvnEnergies)),[30,30,60]);
  assert.ok(run(window).rows.some(r=>/CVN count below/.test(r.name)&&r.status==='fail'));
});

test('Z245 specimen-area input explains the governing elongation equation and basis', async () => {
  const dom=await createChecker(); const {window}=dom;
  loadAudited(window,'Z245');
  const area=window.document.querySelector('[data-standard-key="nominalAreaMM2"]');
  assert.ok(area);
  assert.match(area.closest('.standard-field').textContent,/e = 1940 × A\^0\.2 \/ U\^0\.9/);
  assert.match(area.closest('.standard-field').textContent,/specified minimum TS.*50 mm basis/);
});

test('unknown ASTM order choices remain unknown until the user records them', async () => {
  const dom=await createChecker(); const {window}=dom;
  loadAudited(window,'A36',{standardContext:{form:'PLATE',analysisType:'HEAT',unitBasis:'SI',gaugeLengthMM:50}});
  const copper=window.document.querySelector('[data-standard-key="copperSpecified"]');
  assert.equal(copper.value,'');
  change(window,copper,'false');
  assert.equal(window.MaterialCheckerCore.getState().scope.standardContext.copperSpecified,false);
  assert.equal(window.MaterialCheckerCore.getResult(),null);
});

test('source context edits invalidate the displayed decision', async () => {
  const dom=await createChecker(); const {window}=dom;
  loadAudited(window,'Z245'); run(window);
  const energy=window.document.querySelector('[data-standard-key="cvnEnergies"][data-standard-index="0"]');
  change(window,energy,'40');
  assert.equal(window.MaterialCheckerCore.getResult(),null);
  assert.equal(window.document.querySelector('#overall').textContent,'Not assessed');
  assert.equal(window.MaterialCheckerCore.getState().scope.standardTests.cvnEnergies[0],'40');
});

test('shared header styling shields navigation from standalone tool typography', async () => {
  const dom=await createChecker(); const {window}=dom;
  const header=window.document.querySelector('header.site');
  assert.ok(header.classList.contains('tool-site-header'));
  const styles=window.document.createElement('style');
  styles.textContent=source('style.css')+'\n.brand span{font-size:11px;text-transform:uppercase}nav.desktop-nav{font-size:10px}'+source('assets/tool-site-header.css');
  window.document.head.appendChild(styles);
  assert.equal(window.getComputedStyle(header.querySelector('.brand span')).fontSize,'17px');
  assert.equal(window.getComputedStyle(header.querySelector('.brand span')).textTransform,'none');
  assert.equal(window.getComputedStyle(header.querySelector('nav.desktop-nav')).fontSize,'13.5px');
  assert.equal(header.querySelectorAll('nav.desktop-nav a').length,8);
  assert.equal(header.querySelector('nav.desktop-nav [aria-current="page"]').textContent,'Engineering Tools');
  const links=Array.from(window.document.querySelectorAll('link[rel="stylesheet"]'));
  assert.ok(links.findIndex(l=>l.getAttribute('href')==='/assets/tool-site-header.css') > links.findIndex(l=>l.getAttribute('href')==='/tools/material-specification-compliance-checker.css'));
});


test('standalone checker keeps phone forms single-column and long workspaces horizontally contained', () => {
  const checkerCss = source('tools/material-specification-compliance-checker.css');
  const platformCss = source('tools/material-checker-platform.css');
  const standardCss = source('tools/material-checker-standard-inputs.css');
  const html = source('tools/material-specification-compliance-checker.html');
  assert.match(html, /<meta name="viewport" content="width=device-width,initial-scale=1">/);
  assert.match(checkerCss, /@media screen and \(max-width:640px\)[\s\S]*?\.tabs\{scrollbar-width:none;overscroll-behavior-inline:contain/);
  assert.match(checkerCss, /@media screen and \(max-width:640px\)[\s\S]*?\.panel-head \.btn\{width:100%\}/);
  assert.match(platformCss, /@media screen and \(max-width:640px\)[\s\S]*?\.mc-table-wrap\{overscroll-behavior-inline:contain/);
  assert.match(standardCss, /@media screen and \(max-width:640px\)[\s\S]*?#panels \.standard-actual-row\{grid-template-columns:1fr\}/);
  assert.match(standardCss, /@media screen and \(max-width:520px\)[\s\S]*?standard-edition-alert button\{display:block;width:100%/);
});

for (const route of ['/tools/material-specification-compliance-checker', '/tools/material-specification-compliance-checker.html']) {
  test('arrow cleanup preserves the shared checker header on ' + route, async () => {
    const dom=await createChecker(route); const {window}=dom;
    try {
      // Apply the actual page styles in their original order, including tool overrides.
      for (const link of window.document.querySelectorAll('link[rel="stylesheet"][href^="/"]')) {
        const style=window.document.createElement('style');
        style.textContent=source(link.getAttribute('href').slice(1));
        window.document.head.appendChild(style);
      }
      const computedStyle=window.getComputedStyle.bind(window);
      window.getComputedStyle=(element,pseudo)=>pseudo ? {content:'none'} : computedStyle(element);
      const header=window.document.querySelector('header.site.tool-site-header');
      const brand=header.querySelector('.brand');
      const assertSharedHeader=()=>{
        assert.equal(window.getComputedStyle(header).justifyContent,'space-between');
        assert.equal(window.getComputedStyle(header).minHeight,'74px');
        assert.equal(window.getComputedStyle(header).paddingLeft,'20px');
        assert.equal(window.getComputedStyle(header).paddingRight,'20px');
        assert.equal(window.getComputedStyle(brand.querySelector('span')).fontSize,'17px');
        assert.equal(window.getComputedStyle(header.querySelector('nav.desktop-nav')).fontSize,'13.5px');
        assert.equal(header.classList.contains('upskill-checker-header'),false);
        assert.equal(header.classList.contains('upskill-checker-brand-row'),false);
        assert.equal(brand.classList.contains('upskill-checker-brand-link'),false);
        assert.equal(brand.style.textDecoration,'');
      };
      assertSharedHeader();
      window.eval(source('arrow-cleanup.js'));
      await new Promise(resolve=>window.setTimeout(resolve,20));
      assertSharedHeader();
      assert.equal(window.location.pathname,'/tools/material-specification-compliance-checker');

      // Auth inserts Account after startup; that mutation must not reapply legacy layout.
      const account=window.document.createElement('div');
      account.className='account-menu';
      account.innerHTML='<button class="account-menu-btn" type="button">Account</button>';
      header.querySelector('.header-actions').prepend(account);
      const action=window.document.createElement('button');
      action.textContent='Review results →';
      window.document.body.appendChild(action);
      await new Promise(resolve=>window.setTimeout(resolve,20));
      assert.equal(action.textContent,'Review results','observer-driven action cleanup still runs');
      assertSharedHeader();
    } finally {
      window.close();
    }
  });
}

test('arrow cleanup retains the logo repair for a legacy standalone checker header', async () => {
  const dom=new JSDOM('<!doctype html><header><div><span>US</span><a href="/index.html">UpSkill Sprint Consulting</a></div></header>',{
    url:'https://upskillsprint.test/tools/material-specification-compliance-checker',
    runScripts:'outside-only',pretendToBeVisual:true
  });
  const {window}=dom;
  try {
    const computedStyle=window.getComputedStyle.bind(window);
    window.getComputedStyle=(element,pseudo)=>pseudo ? {content:'none'} : computedStyle(element);
    window.eval(source('arrow-cleanup.js'));
    await new Promise(resolve=>window.setTimeout(resolve,30));
    const header=window.document.querySelector('header');
    assert.equal(header.classList.contains('upskill-checker-header'),true);
    assert.equal(header.querySelector('div').classList.contains('upskill-checker-brand-row'),true);
    assert.equal(header.querySelector('a').getAttribute('href'),'/');
    assert.equal(header.querySelector('.upskill-checker-logo-slot img').getAttribute('src'),'/assets/logo-icon.png');
  } finally {
    window.close();
  }
});

test('malformed imported manual bounds remain invalid in the interactive path', async () => {
  const dom=await createChecker(); const {window}=dom;
  const state=window.MaterialCheckerCore.getState();
  Object.assign(state.scope,{materialId:'MANUAL-TEST',productForm:'Plate',sourceEdition:'1',targetEdition:'1',requirementStatus:'controlled'});
  state.selected=Object.fromEntries(Object.keys(state.selected).map(k=>[k,k==='chemistry']));
  state.rows.chemistry=[{id:'bad-bound',propertyCode:'chem_carbon',name:'Carbon (C)',actual:'.15',aUnit:'%',min:'not a number',max:'.2',rUnit:'%',source:'Controlled rule',mandatory:true}];
  window.MaterialCheckerCore.load({version:3,state});
  assert.equal(run(window).status,'invalid-input');
});

test('a repeated passing actual cannot conceal a failing standard input', async () => {
  const dom=await createChecker(); const {window}=dom;
  const state=loadAudited(window);
  state.rows.chemistry=[
    {id:'source-carbon',propertyCode:'chem_carbon',name:'Carbon (C)',actual:'.30',aUnit:'%',min:'',max:'',rUnit:'%',source:'',mandatory:true,standardInput:true},
    {id:'extra-carbon',propertyCode:'chem_carbon',name:'Carbon (C)',actual:'.20',aUnit:'%',min:'',max:'.25',rUnit:'%',source:'Additional customer rule',mandatory:true}
  ];
  window.MaterialCheckerCore.load({version:3,state});
  const result=run(window);
  assert.equal(result.status,'invalid-input');
  assert.ok(result.rows.some(r=>r.status==='invalid'&&/Carbon|conflict|repeated/i.test(r.name)));
});

test('an unknown imported standard is preserved and requires designation review', async () => {
  const dom=await createChecker(); const {window}=dom;
  const state=loadAudited(window,'A36',{targetStandard:'ASTM A999/A999M',targetGrade:'Imported grade',targetCustom:''});
  state.selected.chemistry=true;
  window.MaterialCheckerCore.load({version:3,state});
  const restored=window.MaterialCheckerCore.getState();
  assert.equal(restored.scope.targetStandard,'ASTM A999/A999M');
  assert.equal(restored.scope.targetGrade,'Imported grade');
  const result=run(window);
  assert.notEqual(result.status,'pass');
  assert.ok(result.rows.some(r=>/Target designation outside the catalogue/.test(r.name)&&r.status==='review'));
  assert.ok(!result.standard || result.standard.family !== 'A36');
});

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

test('captured attached packages preserve source identity and exclude reusable test evidence', async () => {
  const dom=await createPlatform(); const {window}=dom;
  loadAudited(window,'Z245',{standardContext:{...window.MaterialCheckerCore.getState().scope.standardContext,form:'ERW_HFW',analysisType:'HEAT',category:'II',odMM:457,ewFusionLineAtBodyTemperaturePassed:true,elongationConvertedTo50MM:true}});
  window.document.querySelector('[data-standard-load]').click();
  window.document.querySelector('[data-platform-tab="admin"]').click();
  change(window,window.document.querySelector('#mcLocalRole'),'Standards administrator');
  window.document.querySelector('[data-platform-tab="packages"]').click();
  window.prompt=()=> 'Audited pipe package';
  window.document.querySelector('[data-platform-panel="packages"] [data-mc-action="capturePackage"]').click();
  const stored=JSON.parse(window.localStorage.getItem('upskill-material-compliance-platform-v4'));
  const pkg=stored.packages.at(-1);
  assert.equal(pkg.attachedStandard.family,'Z245');
  assert.equal(pkg.attachedStandard.gradeKey,'GR_483_CAT_II');
  assert.equal(pkg.standardTests.cvnEnergies,undefined);
  assert.equal(pkg.standardContext.ewFusionLineAtBodyTemperaturePassed,undefined);
  assert.equal(pkg.standardContext.elongationConvertedTo50MM,undefined);
  assert.ok(!pkg.rules.some(r=>r.propertyCode==='mech_yield_strength'));
});

test('saved templates clear measured results, documentary confirmations and specimen waivers', async () => {
  const dom=await createPlatform(); const {window}=dom;
  loadAudited(window,'Z245',{standardContext:{form:'ERW_HFW',category:'II',odMM:457,ewFusionLineAtBodyTemperaturePassed:true,elongationConvertedTo50MM:true},standardEvidence:{'std-z245-catalog-review':{value:'yes',reference:'Old material report'}}});
  window.document.querySelector('[data-platform-tab="packages"]').click();
  window.prompt=()=> 'Pipe template';
  window.document.querySelector('[data-mc-action="captureTemplate"]').click();
  const stored=JSON.parse(window.localStorage.getItem('upskill-material-compliance-platform-v4'));
  const template=stored.templates.at(-1);
  assert.equal(template.scope.materialId,'');
  assert.deepEqual(template.scope.standardTests,{});
  assert.deepEqual(template.scope.standardEvidence,{});
  assert.equal(template.scope.standardContext.ewFusionLineAtBodyTemperaturePassed,undefined);
  assert.equal(template.scope.standardContext.elongationConvertedTo50MM,undefined);
  assert.ok(Object.values(template.rows).flat().every(r=>!r.actual));
});

test('multi-package comparison preserves conflicting actual evidence as invalid', async () => {
  const dom=await createPlatform(); const {window}=dom;
  selectOnly(window,'chemistry'); completeScope(window);
  setRow(window,'chemistry',{propertyCode:'chem_carbon',actual:'.10',max:'.20',source:'Controlled Table 1'});
  window.document.querySelector('[data-platform-tab="admin"]').click();
  change(window,window.document.querySelector('#mcLocalRole'),'Standards administrator');
  window.document.querySelector('[data-platform-tab="packages"]').click();
  window.prompt=()=> 'Carbon package';
  window.document.querySelector('[data-platform-panel="packages"] [data-mc-action="capturePackage"]').click();
  const state=window.MaterialCheckerCore.getState();
  state.rows.chemistry.unshift({...state.rows.chemistry[0],id:'contradictory-carbon',actual:'.30'});
  window.MaterialCheckerCore.load({version:3,state});
  window.document.querySelector('[data-platform-tab="compare"]').click();
  const choices=window.document.querySelectorAll('[data-compare-package]');
  assert.ok(choices.length);
  change(window,choices[choices.length-1],true);
  window.document.querySelector('[data-mc-action="runComparison"]').click();
  const matrix=window.document.querySelector('#mcComparisonResults');
  assert.ok(matrix.querySelector('.mc-badge.invalid-input'));
  assert.match(matrix.textContent,/conflicting actual records/i);
});

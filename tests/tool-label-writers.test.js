const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const site = read('site-sections.js');
const cleanup = read('arrow-cleanup.js');
const activation = site.slice(site.indexOf('  function activateToolCard('), site.indexOf('  function activateAvailableTools('));
const repair = cleanup.slice(cleanup.indexOf('  function repairEngineeringToolsCleanRoute('), cleanup.indexOf('  function scheduleScan('));
test('both startup writers and repeated cleanup preserve all administrator labels', () => {
  let writes = 0;
  function textNode(initial) {
    let value = initial;
    return {classList:{add(){},remove(){}}, get textContent(){return value;},set textContent(v){writes++;value=v;}};
  }
  const cards = {};
  for (const id of ['materials-quality','material-specification-lookup','steel-phase-explorer','engineering-calculators','converters']) {
    const restricted = !['engineering-calculators','converters'].includes(id);
    const status = textNode(restricted ? 'Administrator' : 'Available');
    const action = textNode(restricted ? 'Administrator access' : 'Open tool');
    cards[id] = {status,action,classList:{add(){},remove(){}},
      getAttribute:() => restricted ? 'administrator' : null,
      setAttribute(){},querySelector:s => s === '.tool-status' ? status : s === '.tool-link' ? action : null};
  }
  const context = {normalizedCurrentPath:()=>'/engineering-tools',isEngineeringToolsPage:()=>true,
    document:{getElementById:id=>cards[id],querySelectorAll:()=>[]}};
  vm.createContext(context);
  vm.runInContext(activation + repair, context);
  // Exercise both orderings, then the late/repeated observer-driven repair.
  for (let i=0;i<2;i++) {
    vm.runInContext('repairEngineeringToolsCleanRoute(); activateToolCard({cardId:"materials-quality",path:"/tools/material-specification-compliance-checker",actionText:"Open checker",ariaLabel:"Open checker"}); repairEngineeringToolsCleanRoute();', context);
    for (const id of ['materials-quality','material-specification-lookup','steel-phase-explorer']) {
      assert.equal(cards[id].status.textContent,'Administrator');
      assert.equal(cards[id].action.textContent,'Administrator access');
    }
  }
  writes = 0;
  vm.runInContext('repairEngineeringToolsCleanRoute(); repairEngineeringToolsCleanRoute();',context);
  assert.equal(writes,0,'unchanged text must not re-trigger the mutation observer');
  assert.equal(cards['engineering-calculators'].status.textContent,'Available');
  assert.equal(cards['engineering-calculators'].action.textContent,'Open calculator');
  assert.equal(cards.converters.action.textContent,'Open converter');
});

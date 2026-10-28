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
      getAttribute:() => restricted ? 'administrator' : null, hasAttribute:()=>false,
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

test('startup writers leave a live data-tool-route card exactly as the HTML wrote it', () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(read('engineering-tools.html'), { url: 'https://upskillsprint.com/engineering-tools', runScripts: 'outside-only' });
  const card = dom.window.document.getElementById('engineering-calculators');
  const before = card.outerHTML;
  dom.window.normalizedCurrentPath = () => '/engineering-tools';
  dom.window.isEngineeringToolsPage = () => true;
  dom.window.eval(activation + repair + ';activateToolCard({cardId:"engineering-calculators",path:"/tools/engineering-statistics-calculator",title:"x",description:"stale",actionText:"Open calculator",ariaLabel:"x"});repairEngineeringToolsCleanRoute();');
  assert.equal(card.outerHTML, before);
  assert.match(card.textContent, /Best-Fit Model Finder/);
});

test('the Unit Converter card is a live static tool row that the writers leave alone', () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(read('engineering-tools.html'), { url: 'https://upskillsprint.com/engineering-tools', runScripts: 'outside-only' });
  const card = dom.window.document.getElementById('converters');
  assert.equal(card.tagName, 'ARTICLE');
  assert.equal(card.getAttribute('data-tool-route'), '/tools/unit-converter');
  assert.equal(card.classList.contains('is-planned'), false);
  assert.equal(card.querySelector('.tool-status.available').textContent, 'Available');
  const open = card.querySelector('a.tool-action.primary');
  assert.equal(open.getAttribute('href'), '/tools/unit-converter');
  assert.equal(open.textContent, 'Open tool →');
  assert.equal(card.querySelector('a[href="/request-topic"]'), null);
  assert.doesNotMatch(card.textContent, /Planned|Suggest units/);
  assert.ok(card.querySelectorAll('.tool-tags span').length >= 3);
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'tools', 'unit-converter.html')));
  const before = card.outerHTML;
  dom.window.normalizedCurrentPath = () => '/engineering-tools';
  dom.window.isEngineeringToolsPage = () => true;
  dom.window.eval(activation + repair + ';activateToolCard({cardId:"converters",path:"/tools/unit-converter",actionText:"Open converter",ariaLabel:"x"});repairEngineeringToolsCleanRoute();');
  assert.equal(card.outerHTML, before);
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={window:{}};vm.runInNewContext(read('test-bank-mbb-set3.js'),context);
const batch=JSON.parse(JSON.stringify(context.window.MBB_SET3)).slice(50,75);
function fixture(){const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{runScripts:'outside-only'});dom.window.eval(read('test-bank-mbb-set3-batch3-ui.js'));return dom;}
test('Batch 3 every table exposes visible overflow guidance in both question and review markup',()=>{
 const dom=fixture();try{for(const q of batch.filter(q=>q.chart))for(const review of [false,true]){
  const host=dom.window.document.createElement('main');host.innerHTML=dom.window.__MBBSet3Batch3UI.render(q,review);
  const tables=host.querySelectorAll('.mbbs3b3-table');assert.equal(tables.length,1,q.qid);
  const wrapper=tables[0].parentElement,hint=wrapper.previousElementSibling;
  assert.equal(hint.className,'mbbs3b3-scroll-hint');assert.match(hint.textContent,/Scroll or swipe horizontally/);assert.equal(hint.hidden,false);
  assert.equal(wrapper.tabIndex,0);assert.equal(wrapper.getAttribute('role'),'region');
 }}finally{dom.window.close();}
});
test('Batch 3 both explorers explain horizontal scrolling separately from the slider action',()=>{
 const dom=fixture();try{for(const q of batch.filter(q=>q.chart?.whatIf)){
  const host=dom.window.document.createElement('main');host.innerHTML=dom.window.__MBBSet3Batch3UI.render(q,false);
  const explorer=host.querySelector('.mbbs3b3-explorer'),hint=explorer.querySelector('.mbbs3b3-scroll-hint');assert.match(hint.textContent,/inside the chart to see the full scale/);
  assert.match(explorer.textContent,/scored question uses the stated baseline/);assert.ok(explorer.querySelector('[data-b3-reset]'));
 }}finally{dom.window.close();}
});
test('Batch 3 readable table widths and slider accent follow the existing high-contrast theme token',()=>{
 const source=read('test-bank-mbb-set3-batch3-ui.js');assert.ok(source.includes('min-width:500px'));assert.ok(source.includes('min-width:540px'));
 assert.ok(source.includes('.mbbs3b3-scroll-hint{font-size:13px;line-height:1.65;color:var(--ink)!important'));
 assert.ok(source.includes('min-height:44px;accent-color:var(--ink)'));
});

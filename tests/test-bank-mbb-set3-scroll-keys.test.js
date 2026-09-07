'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','test-bank-mbb-set3-batch6-ui.js'),'utf8');
function fixture(){
 const listeners={};
 const document={createElement:()=>({}),head:{appendChild(){}},addEventListener:(type,fn)=>{(listeners[type]||=[]).push(fn);}};
 vm.runInNewContext(source,{window:{document},document});
 const region={scrollWidth:660,clientWidth:260,scrollLeft:0,matches:s=>s==='.mbbs3b6-scroll'};
 function key(key,extras={}){const event={key,target:region,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},...extras};listeners.keydown.forEach(fn=>fn(event));return event;}
 return {region,key};
}
test('focused Batch 6 evidence responds immediately to both horizontal arrow keys',()=>{
 const {region,key}=fixture();assert.equal(key('ArrowRight').defaultPrevented,true);assert.equal(region.scrollLeft,40);key('ArrowLeft');assert.equal(region.scrollLeft,0);
});
test('Home and End expose both edges and arrows remain clamped to the region',()=>{
 const {region,key}=fixture();key('End');assert.equal(region.scrollLeft,400);key('ArrowRight');assert.equal(region.scrollLeft,400);key('Home');key('ArrowLeft');assert.equal(region.scrollLeft,0);
});
test('a fitting figure leaves browser keyboard behaviour unchanged',()=>{
 const {region,key}=fixture();region.clientWidth=region.scrollWidth;assert.equal(key('ArrowRight').defaultPrevented,false);
});
test('input fields and nested controls keep their own arrow and Home/End actions',()=>{
 const {region,key}=fixture();for(const target of [{matches:()=>false},{},null])for(const k of ['ArrowRight','ArrowLeft','Home','End'])assert.equal(key(k,{target}).defaultPrevented,false);assert.equal(region.scrollLeft,0);
});
test('modifiers, composing, and previously handled events are not intercepted',()=>{
 const {region,key}=fixture();for(const flag of ['altKey','ctrlKey','metaKey','shiftKey','isComposing'])assert.equal(key('ArrowRight',{[flag]:true}).defaultPrevented,false);key('ArrowRight',{defaultPrevented:true});assert.equal(region.scrollLeft,0);
});
test('vertical movement, Tab, and ordinary text remain native',()=>{
 const {region,key}=fixture();for(const k of ['Tab','ArrowDown','ArrowUp','Enter','a'])assert.equal(key(k).defaultPrevented,false);assert.equal(region.scrollLeft,0);
});

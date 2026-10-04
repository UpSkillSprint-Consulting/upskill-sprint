const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
function setup(){
 const html=fs.readFileSync('tools/engineering-statistics-calculator.html','utf8');
 const dom=new JSDOM(html,{url:'https://calculator.test/tools/engineering-statistics-calculator',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({measureText:s=>({width:String(s).length*8})},{get:(o,k)=>k in o?o[k]:(()=>{})});
 class Worker {
  constructor(){const self={postMessage:data=>queueMicrotask(()=>this.onmessage?.({data}))};this.context=vm.createContext({console,self,setTimeout,clearTimeout});this.context.importScripts=file=>vm.runInContext(fs.readFileSync('tools/calculator-assets/'+file,'utf8'),this.context);vm.runInContext(fs.readFileSync('tools/calculator-assets/advanced-worker.js','utf8'),this.context);}
  postMessage(data){this.context.data=data;vm.runInContext('self.onmessage({data})',this.context);}
  terminate(){}
 }
 w.Worker=Worker;
 const ctx=dom.getInternalVMContext();
 for(const script of w.document.scripts){const src=script.getAttribute('src');if(src?.startsWith('/tools/calculator-assets/'))vm.runInContext(fs.readFileSync('.'+src,'utf8'),ctx);else if(!src)vm.runInContext(script.textContent,ctx);}
 return {dom,w,d:w.document};
}
function input(w,d,id,value){d.getElementById(id).value=value;d.getElementById(id).dispatchEvent(new w.Event('input',{bubbles:true}));}
const tick=()=>new Promise(r=>setTimeout(r,20));
test('all workspaces initialize, tabs have keyboard semantics, and labels are unique',async()=>{
 const {dom,d}=setup();assert.equal(d.querySelectorAll('[role=tab]').length,8);assert.equal(d.querySelectorAll('[aria-selected=true]').length,1);
 d.querySelector('[data-page=pg-data]').click();assert.equal(d.querySelector('.page.active').id,'pg-data');
 const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 for(const el of d.querySelectorAll('input.f,select.f,textarea.f'))assert.ok(el.labels.length,`${el.id} needs a label`);
 dom.window.close();
});
test('all raw-data examples produce results and exports become stale on editing',()=>{
 const {dom,w,d}=setup();for(const option of d.getElementById('analysis-kind').options){d.getElementById('analysis-kind').value=option.value;d.getElementById('analysis-kind').dispatchEvent(new w.Event('change'));d.getElementById('analysis-example').click();assert.equal(d.getElementById('analysis-status').dataset.error,'false',option.value+': '+d.getElementById('analysis-status').textContent);assert.equal(d.getElementById('analysis-export').disabled,false);assert.ok(d.querySelectorAll('#analysis-results .res').length>0);}
 input(w,d,'analysis-data','1,garbage');assert.equal(d.getElementById('analysis-export').disabled,true);assert.equal(d.getElementById('analysis-results').textContent,'');d.getElementById('analysis-run').click();assert.match(d.getElementById('analysis-status').textContent,/Row 1/);dom.window.close();
});
test('summary hypothesis validation and stale result clearing',()=>{
 const {dom,w,d}=setup();const select=d.getElementById('tsel');select.value='1';select.dispatchEvent(new w.Event('change'));
 for(const [k,v]of Object.entries({xbar:52,mu0:50,s:4,n:25})){const el=d.querySelector(`.tfield[data-key=${k}]`);el.value=v;}
 d.getElementById('trun').click();assert.match(d.getElementById('tdecision').textContent,/Reject H/);assert.match(d.getElementById('tresults').textContent,/interval/);
 const n=d.querySelector('[data-key=n].tfield');n.value='2.5';n.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(d.getElementById('tdecision').textContent,'');d.getElementById('trun').click();assert.match(d.getElementById('tresults').textContent,/whole numbers/);
 select.value='2';select.dispatchEvent(new w.Event('change'));for(const el of d.querySelectorAll('.tfield'))el.value=el.dataset.key.startsWith('n')?20:el.dataset.key.startsWith('s')?2:10;d.getElementById('trun').click();assert.match(d.getElementById('thyp').textContent,/μ₁ − μ₂ ≠ 0/);dom.window.close();
});
test('graph, matrix, program and TVM controls drive the isolated engine',async()=>{
 const {dom,d}=setup();d.getElementById('graph-run').click();await tick();assert.ok(d.querySelector('#graph-view svg'));d.getElementById('graph-calculate').click();await tick();assert.match(d.getElementById('graph-answer').textContent,/value = -4/);
 d.getElementById('math-run').click();await tick();assert.match(d.getElementById('math-output').textContent,/0.6/);
 d.getElementById('program-run').click();await tick();assert.equal(d.getElementById('program-output').textContent,'55');
 d.getElementById('finance-run').click();await tick();assert.match(d.getElementById('finance-output').textContent,/-386\.656/);assert.equal(d.querySelectorAll('#finance-table tbody tr').length,60);dom.window.close();
});
test('STAT mode never guesses that a two-column sample is regression',()=>{
 const {dom,w,d}=setup();input(w,d,'statdata','1,2\n3,4');d.getElementById('statrun').click();assert.match(d.getElementById('statout').textContent,/Observations4/);d.getElementById('statmode').value='pairs';d.getElementById('statrun').click();assert.match(d.getElementById('statout').textContent,/at least 3 rows/);dom.window.close();
});
test('manual TOC, workspace coverage and compatibility limitations are explicit',()=>{
 const dom=new JSDOM(fs.readFileSync('tools/calculator-manual.html','utf8')),d=dom.window.document;
 for(const a of d.querySelectorAll('.toc a[href^="#"]'))assert.ok(d.getElementById(a.hash.slice(1)),a.hash);
 for(const id of ['data-quality','capability','graphing','math-workspace','finance','programs','coverage','exports'])assert.ok(d.getElementById(id));
 assert.match(d.body.textContent,/Full TI-84 Plus CE feature parity has not been reached/);
 assert.doesNotMatch(d.body.textContent,/Matches the hardware exactly|agree with Minitab, R, and scipy to at least/);
 dom.window.close();
});

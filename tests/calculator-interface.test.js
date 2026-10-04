const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const {setup}=require('./helpers/calculator-browser');
function input(w,d,id,value){d.getElementById(id).value=value;d.getElementById(id).dispatchEvent(new w.Event('input',{bubbles:true}));}
test('QA: large constant data produce finite visible plot coordinates',()=>{
 const {dom,w,d}=setup();
 input(w,d,'analysis-data','1e20\n1e20\n1e20');d.getElementById('analysis-run').click();
 assert.equal(d.getElementById('analysis-status').dataset.error,'false');
 assert.equal(d.querySelectorAll('#analysis-charts svg').length,3);
 assert.doesNotMatch(d.getElementById('analysis-charts').innerHTML,/NaN|Infinity/);
 assert.ok([...d.querySelectorAll('#analysis-charts svg text')].some(e=>/e\+20/.test(e.textContent)),'Large tick values use compact scientific notation');
 dom.window.close();
});
test('QA: summary Welch test retains its degrees of freedom after unit scaling',()=>{
 const {dom,w,d}=setup();d.getElementById('tsel').value='2';d.getElementById('tsel').dispatchEvent(new w.Event('change'));
 for(const scale of [1e90,1e-90]){
  for(const [key,value]of Object.entries({x1:10*scale,x2:7*scale,s1:scale,s2:scale,n1:3,n2:3}))d.querySelector(`.tfield[data-key=${key}]`).value=value;
  d.getElementById('trun').click();assert.match(d.getElementById('thyp').textContent,/Welch df = 4/);assert.match(d.getElementById('tdecision').textContent,/Reject H/);
 }
 dom.window.close();
});
const tick=()=>new Promise(r=>setTimeout(r,20));
test('all workspaces initialize, tabs have keyboard semantics, and labels are unique',async()=>{
 const {dom,d}=setup();assert.equal(d.querySelectorAll('[role=tab]').length,11);assert.equal(d.querySelectorAll('[aria-selected=true]').length,1);
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
 for(const id of ['quality-cost','advanced-spc','guided-analysis','data-quality','capability','graphing','math-workspace','finance','programs','coverage','exports'])assert.ok(d.getElementById(id));
 assert.match(d.body.textContent,/Full TI-84 Plus CE feature parity has not been reached/);
 assert.match(d.body.textContent,/Seven user storage registers/);
 assert.match(d.body.textContent,/colour follows the selected theme/);
 assert.doesNotMatch(d.body.textContent,/Matches the hardware exactly|agree with Minitab, R, and scipy to at least/);
 dom.window.close();
});

test('table, program and finance outputs clear on edits, including pending responses',async()=>{
 const {dom,w,d}=setup();
 d.getElementById('graph-table-run').click();await tick();assert.equal(d.querySelectorAll('#graph-table tbody tr').length,11);
 input(w,d,'graph-table-start','0');assert.equal(d.getElementById('graph-table').textContent,'');
 d.getElementById('graph-table-run').click();input(w,d,'graph-table-step','2');await tick();assert.equal(d.getElementById('graph-table').textContent,'');
 d.getElementById('program-run').click();await tick();assert.equal(d.getElementById('program-output').textContent,'55');
 input(w,d,'program-source','Disp 42');assert.equal(d.getElementById('program-output').textContent,'');
 d.getElementById('program-run').click();input(w,d,'program-source','Disp 99');await tick();assert.equal(d.getElementById('program-output').textContent,'');
 d.getElementById('finance-run').click();await tick();assert.ok(d.getElementById('finance-output').textContent);
 d.getElementById('finance-solve').value='fv';d.getElementById('finance-solve').dispatchEvent(new w.Event('change'));
 assert.equal(d.getElementById('finance-output').textContent,'');assert.equal(d.getElementById('finance-table').textContent,'');
 dom.window.close();
});
test('value and derivative do not require the unused upper bound',async()=>{
 const {dom,w,d}=setup();input(w,d,'graph-b','');d.getElementById('graph-calculate').click();await tick();assert.match(d.getElementById('graph-answer').textContent,/value = -4/);dom.window.close();
});


test('small probabilities remain visible and singular endpoint densities show infinity',()=>{
 const {dom,w}=setup();assert.equal(w.fmtP(1e-8),'1.0000e-8');assert.equal(w.fmtN(Infinity),'∞');dom.window.close();
});


test('shared-variable calculations invalidate graphs made from previous session values',async()=>{
 const {dom,w,d}=setup();
 input(w,d,'math-input','A=2');d.getElementById('math-run').click();await tick();
 input(w,d,'graph-expressions','A*x');d.getElementById('graph-run').click();await tick();assert.ok(d.querySelector('#graph-view svg'));
 input(w,d,'math-input','A=4');d.getElementById('math-run').click();assert.equal(d.getElementById('graph-view').textContent,'');await tick();
 d.getElementById('graph-run').click();await tick();assert.ok(d.querySelector('#graph-view svg'));
 d.getElementById('program-run').click();assert.equal(d.getElementById('graph-view').textContent,'');await tick();dom.window.close();
});

test('exports contain usable SVG, data tables and original program source',async()=>{
 const {dom,w,d}=setup(),downloads=[],blobs=new Map();w.Blob=Blob;
 w.URL.createObjectURL=blob=>{const url='blob:test-'+blobs.size;blobs.set(url,blob);return url;};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,blob:blobs.get(this.href)});};
 d.getElementById('graph-run').click();await tick();d.getElementById('graph-save').click();
 assert.equal(downloads[0].name,'engineering-graph.svg');
 const svg=new JSDOM(await downloads[0].blob.text(),{contentType:'image/svg+xml'});assert.equal(svg.window.document.documentElement.namespaceURI,'http://www.w3.org/2000/svg');assert.equal(svg.window.document.querySelectorAll('path[clip-path]').length,2);assert.ok(!/NaN|undefined/.test(svg.serialize()));svg.window.close();
 d.getElementById('analysis-example').click();d.getElementById('analysis-csv').click();assert.match(await downloads[1].blob.text(),/"Mean","50.81"/);
 input(w,d,'program-source','Disp "result"');d.getElementById('program-save').click();assert.equal(await downloads[2].blob.text(),'Disp "result"');
 dom.window.close();
});

test('compact workspace navigation stays synchronized with keyboard tabs and handoffs',()=>{
 const {dom,w,d}=setup(),picker=d.getElementById('calc-workspace');
 assert.equal(picker.options.length,11);assert.equal(picker.value,'pg-guide');
 picker.value='pg-cost';picker.dispatchEvent(new w.Event('change'));
 assert.equal(d.querySelector('.page.active').id,'pg-cost');
 const tab=d.querySelector('[data-page=pg-cost]');
 tab.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
 assert.equal(picker.value,'pg-graph');assert.equal(d.querySelector('[aria-selected=true]').dataset.page,'pg-graph');
 d.querySelector('[data-page=pg-spc]').click();assert.equal(picker.value,'pg-spc');
 assert.equal(d.querySelectorAll('main').length,1);assert.equal(d.querySelectorAll('header.site').length,1);
 assert.equal(d.querySelectorAll('footer.site').length,1);
 assert.equal(d.querySelectorAll('header.site .desktop-nav a').length,8);
 assert.ok(d.getElementById('guide-paste').placeholder.includes('\n'));assert.ok(!d.getElementById('guide-paste').placeholder.includes('\\n'));
 dom.window.close();
});

test('manual contents follow section order and shared chrome remains outside the manual',()=>{
 const dom=new JSDOM(fs.readFileSync('tools/calculator-manual.html','utf8')),d=dom.window.document;
 const links=[...d.querySelectorAll('.toc a')].map(a=>a.hash.slice(1));
 assert.deepEqual(links,[...d.querySelectorAll('h2[id]')].map(h=>h.id));
 assert.equal(d.querySelectorAll('header.site').length,1);assert.equal(d.querySelectorAll('footer.site').length,1);
 assert.equal(d.querySelector('main header.site'),null);assert.equal(d.querySelector('main footer.site'),null);
 dom.window.close();
});

test('companion help preserves the working tab and quick start covers all workspaces',()=>{
 const dom=new JSDOM(fs.readFileSync('tools/engineering-statistics-calculator.html','utf8'));
 const links=[...dom.window.document.querySelectorAll('a[href^="/tools/calculator-manual"]')];assert.ok(links.length>=4);
 for(const link of links){assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener');assert.match(link.title,/new tab/);}
 dom.window.close();
 const manual=new JSDOM(fs.readFileSync('tools/calculator-manual.html','utf8')),quick=manual.window.document.getElementById('quick').nextElementSibling.nextElementSibling;
 assert.equal(quick.querySelectorAll('li').length,11);
 assert.match(manual.window.document.body.textContent,/46\.715695/);manual.window.close();
});

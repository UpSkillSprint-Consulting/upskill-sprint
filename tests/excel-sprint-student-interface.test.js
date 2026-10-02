const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const asset='assets/lessons/excel-formula-fluency/sprint/';
const SECRET='student-interface-local-test-secret-over-32-bytes';
const fixtures=JSON.parse(fs.readFileSync('netlify/functions/_shared/excel-sprint-answers.json'));
async function ready(check){const deadline=Date.now()+2000;while(Date.now()<deadline){if(check())return;await new Promise(resolve=>setTimeout(resolve,1));}throw new Error('Student interface did not reach the expected state.');}
function deferred(){let release;const wait=new Promise(resolve=>{release=resolve;});return{wait,release};}
async function harness(options={}){
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs');
 const H=await import('../netlify/functions/_shared/excel-sprint-learning.mjs');
 const C=await import('../netlify/functions/_shared/excel-sprint-certificates.mjs');
 const state=options.initial||P.emptyState();state.selectedPackageId=options.selected||state.selectedPackageId;
 for(const packageId of G.PACKAGE_IDS.slice(0,options.completed||0)){const response=G.gradeSubmission({packageId,predecessorToken:state.tokens.at(-1),submissions:fixtures[packageId].tasks.map(task=>({taskId:task.id,formula:task.model,result:task.answer}))},SECRET);state.tokens.push(response.completionToken);}
 const dom=new JSDOM('<div id="excel-sprint-app"></div>',{url:'https://sprint.example/lesson'+(options.hash||''),runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,calls=[],downloads=[],blobs=[],scrolls=[];
 const control={waits:new Map(options.waits||[]),fail:new Set(options.fail||[]),coaching:true};
 w.TextEncoder=TextEncoder;w.localStorage.setItem(P.KEY,JSON.stringify(state));w.HTMLElement.prototype.scrollIntoView=function(options){scrolls.push({element:this,options});};
 w.URL.createObjectURL=blob=>{blobs.push(blob);return'blob:student-'+blobs.length;};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){downloads.push({href:this.href,name:this.download});};
 w.fetch=async(url,init={})=>{
  const body=init.body?JSON.parse(init.body):undefined;calls.push({url,body});
  if(control.waits.has(url))await control.waits.get(url);
  if(control.fail.has(url))return new Response(JSON.stringify({message:'Service unavailable. Your work is saved; try again.'}),{status:503});
  let data;
  try{
   if(url.startsWith('/assets/'))data=JSON.parse(fs.readFileSync(path.join(__dirname,'..',url)));
   else if(url.endsWith('/coaching-status'))data={available:control.coaching};
   else if(url.endsWith('/learning'))data=H.learningAction(body,SECRET);
   else if(url.endsWith('/verify'))data=G.verifyProgress(body,SECRET);
   else if(url.endsWith('/grade'))data=G.gradeSubmission(body,SECRET);
   else if(url.endsWith('/solutions'))data=G.packageSolutions(body,SECRET);
   else if(url.endsWith('/certificate'))data=C.issueCertificate(body,SECRET);
   else throw new Error('Unexpected endpoint '+url);
   return new Response(JSON.stringify(data),{status:200});
  }catch(error){return new Response(JSON.stringify({message:error.message}),{status:error.status||500});}
 };
 for(const file of ['learning.js','progress.js','dashboard.js','learning-app.js','app.js']){
  if(file==='app.js'&&options.storageWait){const create=w.ExcelSprintProgress.createStore;let first=true;w.ExcelSprintProgress.createStore=function(env){const store=create(env);if(first){first=false;const load=store.load;store.load=async function(){const saved=await load();await options.storageWait;return saved;};}return store;};}
  w.eval(fs.readFileSync(asset+file,'utf8'));
 }
 await ready(()=>options.waitBeforeShell?w.localStorage.getItem(w.ExcelSprintProgress.RECOVERY_KEY):options.catalogUnavailable?w.document.querySelector('#sprint-retry-init'):options.waitForVerify?w.document.querySelector('[data-sprint-action="reset"]'):options.waitForPackage?calls.some(call=>call.url.endsWith('/packages/L1-A1.json')):w.document.querySelector('#sprint-assignment fieldset'));
 return{dom,w,calls,downloads,blobs,scrolls,control,G,H,find:s=>w.document.querySelector(s),saved:()=>P.parseBackup(w.localStorage.getItem(P.KEY)),close:()=>dom.window.close()};
}
function enter(h,taskId,formula,result){const f=h.find('[data-sprint-formula-input="'+taskId+'"]'),r=h.find('[data-sprint-result-input="'+taskId+'"]');f.value=formula;r.value=Array.isArray(result)?result.map(row=>row.join('\t')).join('\n'):String(result);f.dispatchEvent(new h.w.Event('input',{bubbles:true}));r.dispatchEvent(new h.w.Event('input',{bubbles:true}));}
function publicFoundationAnswers(){const pkg=JSON.parse(fs.readFileSync(asset+'packages/L1-A1.json'));const sum=index=>pkg.dataset.rows.reduce((total,row)=>total+row[index],0),n=pkg.dataset.rows.length;return[{id:'t1',formula:'=SUM(Data!D2:D25)',result:sum(3)},{id:'t2',formula:'=AVERAGE(Data!E2:E25)',result:sum(4)/n},{id:'t3',formula:'=SUM(Data!D2:D25)/SUM(Data!C2:C25)*100',result:sum(3)/sum(2)*100},{id:'t4',formula:'=AVERAGE(Data!C2:C25)-AVERAGE(Data!D2:D25)',result:sum(2)/n-sum(3)/n}];}
async function solveFoundations(h){for(const answer of publicFoundationAnswers())enter(h,answer.id,answer.formula,answer.result);h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.find('[data-sprint-open="L1-A2"]').disabled===false);}
async function anotherTab(h,change,options){const store=h.w.ExcelSprintProgress.createStore(h.w),state=await store.load();const next=change(state)||state;await store.save(next,options);h.w.dispatchEvent(new h.w.StorageEvent('storage',{key:h.w.ExcelSprintProgress.RECOVERY_KEY,storageArea:h.w.localStorage}));return next;}
function addCoreProof(h,state,packageId){const proof=h.G.gradeSubmission({packageId,predecessorToken:state.tokens.at(-1),submissions:fixtures[packageId].tasks.map(task=>({taskId:task.id,formula:task.model,result:task.answer}))},SECRET);state.tokens.push(proof.completionToken);}

test('a fresh student can start before optional coaching responds and receives it without losing focus or drafts',async()=>{
 const slow=deferred(),h=await harness({waits:[['/api/excel-sprint/coaching-status',slow.wait]]});try{
  assert.equal(h.find('[data-sprint-open="L1-A1"]').disabled,false);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,true);
  enter(h,'t1','=SUM(Data!D2:D25)','123');const field=h.find('[data-sprint-result-input="t1"]');field.focus();slow.release();
  await ready(()=>h.find('[data-sprint-coach="t1"]'));
  assert.equal(h.w.document.activeElement,field);assert.equal(h.find('[data-sprint-result-input="t1"]').value,'123');assert.match(h.find('.sprint-coaching-notice').textContent,/After checking a task/);
 }finally{slow.release();h.close();}
});
test('fresh core validation points to the missing field and public-data solutions unlock only the next sequential assignment',async()=>{
 const h=await harness();try{
  h.find('[data-sprint-check="t1"]').click();assert.equal(h.w.document.activeElement,h.find('[data-sprint-formula-input="t1"]'));assert.equal(h.find('[data-sprint-formula-input="t1"]').getAttribute('aria-invalid'),'true');assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,0);
  enter(h,'t1','=SUM(Data!D2:D25)','1,000');h.find('[data-sprint-check="t1"]').click();assert.equal(h.w.document.activeElement,h.find('[data-sprint-result-input="t1"]'));assert.match(h.find('[data-sprint-task-error="t1"]').textContent,/without units/);
  assert.equal(h.find('[data-sprint-action="solutions"]'),null);await solveFoundations(h);
  assert.equal(h.saved().tokens.length,1);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,false);assert.equal(h.find('[data-sprint-open="L1-A3"]').disabled,true);assert.equal(h.find('[data-sprint-open="EX-A1"]').disabled,true);assert.equal(h.find('[data-sprint-action="certificate-full-path"]').disabled,true);
  assert.ok(h.find('[data-sprint-action="solutions"]'));h.find('[data-sprint-action="solutions"]').click();await ready(()=>h.find('#sprint-models .sprint-model'));assert.equal(h.w.document.querySelectorAll('#sprint-models .sprint-model').length,5);assert.equal(h.calls.filter(call=>call.url.endsWith('/solutions')).length,1);assert.match(h.find('.sprint-task-section').textContent,/basic formula structure/);assert.match(h.find('.sprint-task-section').textContent,/commas or semicolons/);
 }finally{h.close();}
});
test('edits made during a core request survive a fast response and remain clearly ungraded in the saved backup',async()=>{
 const h=await harness();try{
  const pause=deferred();h.control.waits.set('/api/excel-sprint/grade',pause.wait);const answer=publicFoundationAnswers()[0];enter(h,'t1',answer.formula,answer.result);h.find('[data-sprint-check="t1"]').click();await ready(()=>h.calls.some(call=>call.url.endsWith('/grade')));
  enter(h,'t1','=SUM(Data!D2:D24)','0');pause.release();await ready(()=>h.find('[data-sprint-check="t1"]').disabled===false);
  assert.equal(h.find('[data-sprint-formula-input="t1"]').value,'=SUM(Data!D2:D24)');assert.equal(h.find('[data-sprint-result-input="t1"]').value,'0');assert.match(h.find('[data-sprint-feedback="t1"]').textContent,/Revised answer not checked/);
  const saved=h.saved();assert.equal(saved.packages['L1-A1'].submissions.t1.resultText,'0');assert.equal(saved.packages['L1-A1'].tasks.t1.checkedSubmission.formula,answer.formula);assert.match(h.find('#sprint-message').textContent,/latest edits are saved/);
 }finally{h.close();}
});
test('a wrong revision of a fully completed core package is labelled incorrect while the earned completion remains',async()=>{
 const h=await harness();try{
  await solveFoundations(h);enter(h,'t1','=SUM(Data!D2:D24)','0');h.find('[data-sprint-check="t1"]').click();await ready(()=>!h.find('[data-sprint-check="t1"]').disabled);
  assert.match(h.find('[data-sprint-feedback="t1"]').textContent,/Revised answer not correct/);assert.match(h.find('[data-sprint-passed="t1"]').textContent,/Earlier check passed/);assert.equal(h.find('[data-sprint-formula-input="t1"]').closest('fieldset').classList.contains('is-correct'),false);
  assert.match(h.find('#sprint-message').textContent,/revised answer needs more work/);assert.match(h.find('#sprint-message').textContent,/earlier assignment completion/);assert.doesNotMatch(h.find('#sprint-message').textContent,/All required tasks are correct/);
  assert.equal(h.saved().packages['L1-A1'].tasks.t1.submissionCorrect,false);assert.equal(h.saved().tokens.length,1);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,false);assert.ok(h.find('[data-sprint-action="solutions"]'));
 }finally{h.close();}
});
test('checking the optional bonus after core completion retains its feedback without altering core credit',async()=>{
 const h=await harness();try{
  await solveFoundations(h);const bonus=fixtures['L1-A1'].bonus;assert.ok(bonus);enter(h,'bonus',bonus.model,bonus.answer===0?1:0);h.find('[data-sprint-check="bonus"]').click();await ready(()=>!h.find('[data-sprint-check="bonus"]').disabled);
  assert.match(h.find('#sprint-message').textContent,/bonus result does not match yet/);assert.equal(h.saved().tokens.length,1);
  enter(h,'bonus',bonus.model,bonus.answer);h.find('[data-sprint-check="bonus"]').click();await ready(()=>!h.find('[data-sprint-check="bonus"]').disabled);
  assert.match(h.find('[data-sprint-feedback="bonus"]').textContent,/Correct/);assert.equal(h.saved().packages['L1-A1'].tasks.bonus.correct,true);assert.equal(h.saved().tokens.length,1);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,false);
  assert.match(h.find('#sprint-message').textContent,/Bonus result correct/);enter(h,'bonus',bonus.model,bonus.answer===0?1:0);h.find('[data-sprint-check="bonus"]').click();await ready(()=>!h.find('[data-sprint-check="bonus"]').disabled);
  assert.match(h.find('#sprint-message').textContent,/revised bonus result does not match/);assert.match(h.find('#sprint-message').textContent,/earlier correct bonus result/);assert.equal(h.saved().packages['L1-A1'].tasks.bonus.correct,true);assert.equal(h.saved().tokens.length,1);
 }finally{h.close();}
});
test('a scalar text task accepts the status calculated from public data and retains exact text in the submission',async()=>{
 const h=await harness({completed:4,selected:'L1-A5'});try{
  const pkg=JSON.parse(fs.readFileSync(asset+'packages/L1-A5.json')),values=pkg.dataset.rows.map(row=>row[2]);
  const target=pkg.dataset.parameters.find(parameter=>parameter.name==='Target_mm').value,tolerance=pkg.dataset.parameters.find(parameter=>parameter.name==='Tolerance_mm').value;
  const expected=Math.min(...values)>=target-tolerance&&Math.max(...values)<=target+tolerance?'Release':'Hold';
  enter(h,'t4','=IF(AND(MIN(Data!C2:C33)>=Parameters!B2-Parameters!B3,MAX(Data!C2:C33)<=Parameters!B2+Parameters!B3),"Release","Hold")',expected);h.find('[data-sprint-check="t4"]').click();await ready(()=>h.saved().packages['L1-A5'].tasks.t4?.correct);
  assert.equal(h.calls.find(call=>call.url.endsWith('/grade')).body.submissions[0].result,expected);assert.equal(h.saved().packages['L1-A5'].submissions.t4.resultText,expected);assert.equal(h.find('[data-sprint-open="L2-A1"]').disabled,true);
 }finally{h.close();}
});
test('a failed core service request preserves the formula/result and permits an ordinary retry',async()=>{
 const h=await harness();try{
  const answer=publicFoundationAnswers()[0];enter(h,'t1',answer.formula,answer.result);h.control.fail.add('/api/excel-sprint/grade');h.find('[data-sprint-check="t1"]').click();await ready(()=>h.find('#sprint-message').textContent.includes('Service unavailable')&&!h.find('[data-sprint-check="t1"]').disabled);
  assert.equal(h.find('[data-sprint-formula-input="t1"]').value,answer.formula);assert.equal(h.saved().packages['L1-A1'].submissions.t1.resultText,String(answer.result));assert.equal(h.saved().packages['L1-A1'].tasks.t1,undefined);
  h.control.fail.delete('/api/excel-sprint/grade');h.find('[data-sprint-check="t1"]').click();await ready(()=>h.saved().packages['L1-A1'].tasks.t1?.correct===true);assert.equal(h.saved().packages['L1-A1'].tasks.t1.attempts,1);
 }finally{h.close();}
});
test('a reset during initial saved-proof verification cannot be undone by the old response',async()=>{
 const pause=deferred(),h=await harness({completed:1,waitForVerify:true,waits:[['/api/excel-sprint/verify',pause.wait]]});try{
  h.find('[data-sprint-action="reset"]').click();assert.equal(h.w.document.activeElement,h.find('[data-sprint-action="cancel-reset"]'));h.find('[data-sprint-action="confirm-reset"]').click();await ready(()=>h.find('#sprint-message').textContent.startsWith('Excel Formula Sprint progress reset.'));
  assert.equal(h.saved().tokens.length,0);pause.release();await new Promise(resolve=>setImmediate(resolve));await new Promise(resolve=>setImmediate(resolve));
  assert.equal(h.saved().tokens.length,0);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,true);assert.equal(h.saved().selectedPackageId,'L1-A1');assert.equal(h.w.document.activeElement,h.find('#sprint-assignment'));
 }finally{pause.release();h.close();}
});
test('a superseded assignment load cannot overwrite the student’s latest selection',async()=>{
 const h=await harness({completed:1});try{
  const pause=deferred();h.control.waits.set('/assets/lessons/excel-formula-fluency/sprint/packages/L1-A2.json',pause.wait);h.find('[data-sprint-open="L1-A2"]').click();await ready(()=>h.calls.some(call=>call.url.endsWith('/packages/L1-A2.json')));
  h.find('[data-sprint-open="L1-A1"]').click();await ready(()=>h.find('.sprint-assignment-heading')?.textContent.includes('L1-A1'));pause.release();await new Promise(resolve=>setImmediate(resolve));
  assert.match(h.find('.sprint-assignment-heading').textContent,/L1-A1/);assert.equal(h.saved().selectedPackageId,'L1-A1');
 }finally{h.close();}
});
test('download feedback requests a file honestly and manual backup text contains the complete current draft',async()=>{
 const h=await harness();try{
  enter(h,'t1','=SUM(Data!D2:D25)','001');h.find('[data-sprint-action="export"]').click();assert.equal(h.downloads.length,1);assert.match(h.find('#sprint-message').textContent,/download requested/);assert.doesNotMatch(h.find('#sprint-message').textContent,/downloaded/);
  h.find('[data-sprint-action="backup-text"]').click();const field=h.find('#sprint-backup-text');assert.equal(h.find('#sprint-backup-text-panel').hidden,false);assert.equal(h.w.document.activeElement,field);assert.equal(field.selectionEnd,field.value.length);
  const backup=P.parseBackup(field.value);assert.equal(backup.packages['L1-A1'].submissions.t1.resultText,'001');assert.equal(backup.tokens.length,0);assert.deepEqual(backup.learning.drills,{});
 }finally{h.close();}
});
test('an offline curriculum still exposes a recoverable backup of previously saved student work',async()=>{
 const state=P.emptyState();state.packages['L1-A1']={timeMs:123,submissions:{t1:{formula:'=SUM(Data!D2:D25)',result:0,resultText:'0'}},tasks:{}};
 const h=await harness({initial:state,catalogUnavailable:true,fail:['/assets/lessons/excel-formula-fluency/sprint/catalog.json']});try{
  assert.ok(h.find('#sprint-retry-init'));h.find('[data-sprint-action="backup-text"]').click();const recovered=P.parseBackup(h.find('#sprint-backup-text').value);assert.equal(recovered.packages['L1-A1'].submissions.t1.resultText,'0');assert.equal(recovered.packages['L1-A1'].timeMs,123);
  h.find('[data-sprint-action="export"]').click();assert.equal(h.downloads.length,1);
 }finally{h.close();}
});
test('a stale student tab pauses grading and replacement actions while preserving its own draft backup and the newer core chain',async()=>{
 const h=await harness({completed:1,selected:'L1-A2'});try{
  enter(h,'t1','=SUM(Data!C2:C25)','001');const field=h.find('[data-sprint-result-input="t1"]');field.focus();
  await anotherTab(h,state=>{addCoreProof(h,state,'L1-A2');});
  assert.equal(h.saved().tokens.length,2);assert.equal(h.find('#sprint-storage-warning').hidden,false);assert.match(h.find('#sprint-storage-warning').textContent,/Export a backup of this tab’s drafts/);assert.equal(h.w.document.activeElement,field);
  h.find('[data-sprint-check="t1"]').click();await new Promise(resolve=>setImmediate(resolve));assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,0);assert.equal(h.find('[data-sprint-result-input="t1"]'),field);assert.equal(field.value,'001');
  h.find('[data-sprint-action="reset"]').click();assert.equal(h.find('#sprint-reset-confirm').hidden,true);
  const input=h.find('#sprint-import'),text=JSON.stringify(P.emptyState());Object.defineProperty(input,'files',{value:[{size:Buffer.byteLength(text),text:async()=>text}]});input.dispatchEvent(new h.w.Event('change',{bubbles:true}));await new Promise(resolve=>setImmediate(resolve));assert.equal(h.saved().tokens.length,2);
  h.find('[data-sprint-action="backup-text"]').click();const own=P.parseBackup(h.find('#sprint-backup-text').value);assert.equal(own.tokens.length,1);assert.equal(own.packages['L1-A2'].submissions.t1.resultText,'001');assert.equal(h.saved().tokens.length,2);
  const reload=h.find('[data-sprint-action="reload-progress"]');reload.focus();h.w.document.dispatchEvent(new h.w.Event('visibilitychange'));h.w.dispatchEvent(new h.w.Event('pagehide'));assert.equal(h.find('[data-sprint-action="reload-progress"]'),reload);assert.equal(h.w.document.activeElement,reload);assert.equal(h.saved().tokens.length,2);
 }finally{h.close();}
});
test('a reset from another tab during an in-flight correct check cannot resurrect old progress and leaves the submitted work exportable',async()=>{
 const h=await harness(),pause=deferred();try{
  h.control.waits.set('/api/excel-sprint/grade',pause.wait);for(const answer of publicFoundationAnswers())enter(h,answer.id,answer.formula,answer.result);h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.calls.some(call=>call.url.endsWith('/grade')));
  await anotherTab(h,()=>P.emptyState(),{replace:true});assert.equal(h.saved().tokens.length,0);assert.deepEqual(h.saved().packages,{});pause.release();await new Promise(resolve=>setImmediate(resolve));await new Promise(resolve=>setImmediate(resolve));
  assert.equal(h.saved().tokens.length,0);assert.deepEqual(h.saved().packages,{});assert.ok(h.find('[data-sprint-action="reload-progress"]'));assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,true);
  h.find('[data-sprint-action="backup-text"]').click();const own=P.parseBackup(h.find('#sprint-backup-text').value);assert.equal(own.tokens.length,0);assert.equal(own.packages['L1-A1'].submissions.t1.formula,publicFoundationAnswers()[0].formula);assert.deepEqual(own.packages['L1-A1'].tasks,{});assert.deepEqual(h.saved().packages,{});
 }finally{pause.release();h.close();}
});
test('another tab’s progress update pauses placement submission without discarding the chosen answers',async()=>{
 const h=await harness();try{
  await ready(()=>h.find('[data-learning-action="diagnostic"]'));h.find('[data-learning-action="diagnostic"]').click();h.find('input[name="learning-q1"][value="a"]').click();
  await anotherTab(h,state=>{addCoreProof(h,state,'L1-A1');});h.find('[data-learning-diagnostic]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));await new Promise(resolve=>setImmediate(resolve));
  assert.equal(h.calls.filter(call=>call.body?.action==='diagnostic').length,0);assert.equal(h.find('input[name="learning-q1"][value="a"]').checked,true);assert.match(h.find('[data-learning-message]').textContent,/reload the latest progress/);
  h.find('[data-sprint-action="backup-text"]').click();const own=P.parseBackup(h.find('#sprint-backup-text').value);assert.equal(own.learning.diagnosticAnswers.q1,'a');assert.equal(own.learning.diagnostic,null);assert.equal(own.tokens.length,0);assert.equal(h.saved().tokens.length,1);
 }finally{h.close();}
});
test('an initial Sprint deep link scrolls and focuses its section after delayed placement content has finished bootstrapping',async()=>{
 const pause=deferred(),h=await harness({hash:'#sprint-certificates',waits:[['/assets/lessons/excel-formula-fluency/sprint/learning/catalog.json',pause.wait]]});try{
  assert.equal(h.scrolls.length,0);assert.equal(h.w.document.activeElement,h.w.document.body);pause.release();await ready(()=>h.scrolls.some(scroll=>scroll.element.id==='sprint-certificates'));
  const target=h.find('#sprint-certificates');assert.equal(h.w.document.activeElement,target);assert.equal(target.tabIndex,-1);assert.equal(h.scrolls.at(-1).options.behavior,'auto');assert.equal(h.scrolls.at(-1).options.block,'start');assert.ok(h.find('[data-learning-action="diagnostic"]'));assert.equal(h.saved().tokens.length,0);
 }finally{pause.release();h.close();}
 for(const id of ['sprint-learning','sprint-assignment','sprint-expert','sprint-dashboard']){
  const h=await harness({hash:'#'+id});try{await ready(()=>h.scrolls.some(scroll=>scroll.element.id===id));assert.equal(h.w.document.activeElement,h.find('#'+id));}finally{h.close();}
 }
});
test('a delayed initial deep link does not move a student who has already begun editing, and legacy fragments retain their native behavior',async()=>{
 const pause=deferred(),h=await harness({hash:'#sprint-learning',waits:[['/assets/lessons/excel-formula-fluency/sprint/learning/catalog.json',pause.wait]]});try{
  const field=h.find('[data-sprint-result-input="t1"]');field.focus();enter(h,'t1','=SUM(Data!D2:D25)','123');pause.release();await ready(()=>h.find('[data-learning-action="diagnostic"]'));await new Promise(resolve=>h.w.requestAnimationFrame(()=>h.w.requestAnimationFrame(resolve)));
  assert.equal(h.scrolls.length,0);assert.equal(h.w.document.activeElement,field);assert.equal(field.value,'123');
 }finally{pause.release();h.close();}
 const legacy=await harness({hash:'#practice'});try{await ready(()=>legacy.find('[data-learning-action="diagnostic"]'));await new Promise(resolve=>legacy.w.requestAnimationFrame(()=>legacy.w.requestAnimationFrame(resolve)));assert.equal(legacy.scrolls.length,0);assert.equal(legacy.w.document.activeElement,legacy.w.document.body);}finally{legacy.close();}
});
test('a conflict at each blocking startup boundary exposes reload and exports the read snapshot without overwriting newer progress',async()=>{
 for(const boundary of ['storage','catalog','verify','package']){
  const pause=deferred(),initial=P.emptyState();initial.packages['L1-A1']={submissions:{t1:{formula:'=SUM(Data!D2:D25)',result:1,resultText:'001'}},tasks:{},timeMs:123};
  const options={initial,completed:boundary==='verify'?1:0};
  if(boundary==='storage'){options.storageWait=pause.wait;options.waitBeforeShell=true;}
  if(boundary==='catalog'){options.waits=[['/assets/lessons/excel-formula-fluency/sprint/catalog.json',pause.wait]];options.waitBeforeShell=true;}
  if(boundary==='verify'){options.waits=[['/api/excel-sprint/verify',pause.wait]];options.waitForVerify=true;}
  if(boundary==='package'){options.waits=[['/assets/lessons/excel-formula-fluency/sprint/packages/L1-A1.json',pause.wait]];options.waitForPackage=true;}
  const h=await harness(options);try{
   const oldCount=options.completed;await anotherTab(h,state=>{addCoreProof(h,state,oldCount?'L1-A2':'L1-A1');});assert.ok(h.find('[data-sprint-action="reload-progress"]'),boundary);assert.equal(h.saved().tokens.length,oldCount+1);
   if(boundary==='storage'){assert.equal(h.find('[data-sprint-action="export"]').disabled,true);assert.equal(h.find('[data-sprint-action="backup-text"]').disabled,true);assert.match(h.find('#sprint-bootstrap-backup-status').textContent,/Reading this tab’s saved work/);h.find('[data-sprint-action="export"]').click();assert.equal(h.downloads.length,0);pause.release();await ready(()=>h.find('[data-sprint-action="export"]').disabled===false);}
   assert.equal(h.find('[data-sprint-action="export"]').disabled,false);h.find('[data-sprint-action="backup-text"]').click();let own=P.parseBackup(h.find('#sprint-backup-text').value);assert.equal(own.tokens.length,oldCount,boundary);assert.equal(own.packages['L1-A1'].submissions.t1.resultText,'001',boundary);assert.equal(own.packages['L1-A1'].timeMs,123,boundary);
   pause.release();await new Promise(resolve=>h.w.requestAnimationFrame(()=>h.w.requestAnimationFrame(resolve)));assert.ok(h.find('[data-sprint-action="reload-progress"]'),boundary);assert.equal(h.find('#sprint-assignment fieldset'),null,boundary);assert.equal(h.saved().tokens.length,oldCount+1,boundary);h.find('[data-sprint-action="backup-text"]').click();own=P.parseBackup(h.find('#sprint-backup-text').value);assert.equal(own.tokens.length,oldCount,boundary);assert.equal(own.packages['L1-A1'].submissions.t1.resultText,'001',boundary);
  }finally{pause.release();h.close();}
 }
});
test('late optional learning and coaching bootstrap responses preserve an edited lesson when another tab changes progress',async()=>{
 const pause=deferred(),h=await harness({hash:'#sprint-learning',waits:[['/assets/lessons/excel-formula-fluency/sprint/learning/catalog.json',pause.wait],['/api/excel-sprint/coaching-status',pause.wait]]});try{
  enter(h,'t1','=SUM(Data!D2:D25)','001');const field=h.find('[data-sprint-result-input="t1"]');field.focus();await anotherTab(h,state=>{addCoreProof(h,state,'L1-A1');});pause.release();await ready(()=>h.find('[data-learning-action="diagnostic"]'));await new Promise(resolve=>h.w.requestAnimationFrame(()=>h.w.requestAnimationFrame(resolve)));
  assert.equal(h.find('[data-sprint-result-input="t1"]'),field);assert.equal(field.value,'001');assert.equal(h.w.document.activeElement,field);assert.equal(h.scrolls.length,0);assert.ok(h.find('[data-sprint-action="reload-progress"]'));assert.equal(h.find('[data-sprint-coach="t1"]'),null);
  h.find('[data-sprint-action="backup-text"]').click();const own=P.parseBackup(h.find('#sprint-backup-text').value);assert.equal(own.tokens.length,0);assert.equal(own.packages['L1-A1'].submissions.t1.resultText,'001');assert.equal(h.saved().tokens.length,1);
 }finally{pause.release();h.close();}
});

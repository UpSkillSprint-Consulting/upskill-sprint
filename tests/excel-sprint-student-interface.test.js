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
 for(const packageId of G.EXPERT_IDS.slice(0,options.expertCompleted||0)){const response=G.gradeSubmission({packageId,predecessorToken:state.expertTokens.at(-1)||state.tokens[29],submissions:fixtures[packageId].tasks.map(task=>({taskId:task.id,formula:task.model,result:task.answer}))},SECRET);state.expertTokens.push(response.completionToken);}
 const dom=new JSDOM('<div id="excel-sprint-app"></div>',{url:'https://sprint.example/lesson'+(options.hash||''),runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,calls=[],downloads=[],blobs=[],scrolls=[];
 const control={waits:new Map(options.waits||[]),fail:new Set(options.fail||[]),coaching:true,failChainVerification:!!options.failChainVerification};
 w.TextEncoder=TextEncoder;w.localStorage.setItem(P.KEY,JSON.stringify(state));w.HTMLElement.prototype.scrollIntoView=function(options){scrolls.push({element:this,options});};
 w.URL.createObjectURL=blob=>{blobs.push(blob);return'blob:student-'+blobs.length;};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){downloads.push({href:this.href,name:this.download});};
 w.fetch=async(url,init={})=>{
  const body=init.body?JSON.parse(init.body):undefined;calls.push({url,body});
  if(control.waits.has(url))await control.waits.get(url);
  if(control.fail.has(url)||control.failChainVerification&&url.endsWith('/verify')&&!body?.action)return new Response(JSON.stringify({message:'Service unavailable. Your work is saved; try again.'}),{status:503});
  let data;
  try{
   if(url.startsWith('/assets/'))data=JSON.parse(fs.readFileSync(path.join(__dirname,'..',url)));
   else if(url.endsWith('/coaching-status'))data={available:control.coaching};
   else if(url.endsWith('/learning'))data=H.learningAction(body,SECRET);
   else if(url.endsWith('/verify'))data=G.verifyAction(body,SECRET);
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
 return{dom,w,calls,downloads,blobs,scrolls,control,G,H,C,find:s=>w.document.querySelector(s),saved:()=>P.parseBackup(w.localStorage.getItem(P.KEY)),close:()=>dom.window.close()};
}
function enter(h,taskId,formula,result){const f=h.find('[data-sprint-formula-input="'+taskId+'"]'),r=h.find('[data-sprint-result-input="'+taskId+'"]');f.value=formula;r.value=Array.isArray(result)?result.map(row=>row.join('\t')).join('\n'):String(result);f.dispatchEvent(new h.w.Event('input',{bubbles:true}));r.dispatchEvent(new h.w.Event('input',{bubbles:true}));}
function publicFoundationAnswers(){const pkg=JSON.parse(fs.readFileSync(asset+'packages/L1-A1.json'));const sum=index=>pkg.dataset.rows.reduce((total,row)=>total+row[index],0),n=pkg.dataset.rows.length;return[{id:'t1',formula:'=SUM(Data!D2:D25)',result:sum(3)},{id:'t2',formula:'=AVERAGE(Data!E2:E25)',result:sum(4)/n},{id:'t3',formula:'=SUM(Data!D2:D25)/SUM(Data!C2:C25)*100',result:sum(3)/sum(2)*100},{id:'t4',formula:'=AVERAGE(Data!C2:C25)-AVERAGE(Data!D2:D25)',result:sum(2)/n-sum(3)/n}];}
async function solveFoundations(h){for(const answer of publicFoundationAnswers())enter(h,answer.id,answer.formula,answer.result);h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.find('[data-sprint-open="L1-A2"]').disabled===false);}
async function anotherTab(h,change,options){const store=h.w.ExcelSprintProgress.createStore(h.w),state=await store.load();const next=change(state)||state;await store.save(next,options);h.w.dispatchEvent(new h.w.StorageEvent('storage',{key:h.w.ExcelSprintProgress.RECOVERY_KEY,storageArea:h.w.localStorage}));return next;}
function addCoreProof(h,state,packageId){const proof=h.G.gradeSubmission({packageId,predecessorToken:state.tokens.at(-1),submissions:fixtures[packageId].tasks.map(task=>({taskId:task.id,formula:task.model,result:task.answer}))},SECRET);state.tokens.push(proof.completionToken);}

test('a delayed backup clipboard reply cannot reopen a closed panel or interrupt current feedback',async()=>{
 for(const denied of [false,true]){
  const h=await harness();let release;try{
   Object.defineProperty(h.w.navigator,'clipboard',{value:{writeText:()=>new Promise((resolve,reject)=>{release=()=>denied?reject(new Error('Denied')):resolve();})}});
   h.find('[data-sprint-action="copy-backup-text"]').click();
   h.find('[data-sprint-action="close-backup-text"]').click();
   const field=h.find('[data-sprint-formula-input="t1"]');field.focus();
   h.find('[data-sprint-check="t1"]').click();const feedback=h.find('#sprint-message').textContent;
   const focused=h.w.document.activeElement;release();await new Promise(resolve=>setImmediate(resolve));
   assert.equal(h.find('#sprint-backup-text-panel').hidden,true);
   assert.equal(h.find('#sprint-message').textContent,feedback);
   assert.equal(h.w.document.activeElement,focused);
  }finally{if(release)release();h.close();}
 }
});
test('backup clipboard denial cannot take focus after the student resumes editing',async()=>{
 const h=await harness();let reject;try{
  Object.defineProperty(h.w.navigator,'clipboard',{value:{writeText:()=>new Promise((resolve,fail)=>{reject=fail;})}});
  h.find('[data-sprint-action="copy-backup-text"]').click();
  const field=h.find('[data-sprint-formula-input="t1"]');field.focus();
  reject(new Error('Denied'));await new Promise(resolve=>setImmediate(resolve));
  assert.equal(h.w.document.activeElement,field);assert.doesNotMatch(h.find('#sprint-message').textContent,/selected.*manually/);
 }finally{h.close();}
});
test('closing and reopening backup text invalidates the previous clipboard request',async()=>{
 const h=await harness();let release;try{
  Object.defineProperty(h.w.navigator,'clipboard',{value:{writeText:()=>new Promise(resolve=>{release=resolve;})}});
  h.find('[data-sprint-action="copy-backup-text"]').click();
  h.find('[data-sprint-action="close-backup-text"]').click();h.find('[data-sprint-action="backup-text"]').click();
  const feedback=h.find('#sprint-message').textContent;release();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(h.find('#sprint-message').textContent,feedback);assert.equal(h.find('#sprint-backup-text-panel').hidden,false);
 }finally{if(release)release();h.close();}
});
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
test('a completion verification outage keeps one core or Expert proof and recovers by verification without another grade',async()=>{
 for(const entry of [{id:'L1-A1',completed:0,next:'L1-A2',chain:'tokens'},{id:'EX-A1',completed:30,next:'EX-A2',chain:'expertTokens'}]){
  const h=await harness({completed:entry.completed,selected:entry.id});try{
   h.control.fail.add('/api/excel-sprint/verify');for(const task of fixtures[entry.id].tasks)enter(h,task.id,task.model,task.answer);h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.find('#sprint-message').textContent.includes('Choose Verify saved progress'));
   const saved=h.saved(),count=saved[entry.chain].length;assert.equal(count,1);assert.equal(h.find('[data-sprint-check="t1"]').disabled,true);assert.equal(h.find('[data-sprint-action="grade-all"]').disabled,true);assert.equal(h.find('[data-sprint-open="'+entry.next+'"]').disabled,true);assert.equal(h.find('#sprint-verify-button').hidden,false);
   h.control.fail.delete('/api/excel-sprint/verify');h.find('[data-sprint-check="t1"]').click();assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,1);h.find('#sprint-verify-button').click();await ready(()=>h.find('[data-sprint-open="'+entry.next+'"]').disabled===false);assert.equal(h.saved()[entry.chain].length,count);assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,1);assert.ok(h.find('[data-sprint-action="solutions"]'));
   h.find('[data-sprint-check="t1"]').click();await ready(()=>!h.find('[data-sprint-check="t1"]').disabled);assert.equal(h.saved()[entry.chain].length,count);assert.equal(new Set(h.saved()[entry.chain]).size,count);
  }finally{h.close();}
 }
});
test('delayed core, advanced and Expert model reviews reach the current panel after reopening the same completed assignment',async()=>{
 for(const entry of [{id:'L1-A1',completed:1},{id:'L8-A1',completed:36},{id:'EX-A1',completed:30,expertCompleted:1}]){
  const h=await harness({...entry,selected:entry.id}),pause=deferred();try{
   h.control.waits.set('/api/excel-sprint/solutions',pause.wait);h.find('[data-sprint-action="solutions"]').click();await ready(()=>h.calls.some(call=>call.url.endsWith('/solutions')));const original=h.find('#sprint-models');h.find('[data-sprint-open="'+entry.id+'"]').click();await ready(()=>h.find('#sprint-models')!==original);assert.equal(original.isConnected,false);pause.release();await ready(()=>h.find('#sprint-models .sprint-model'));assert.equal(h.w.document.querySelectorAll('#sprint-models .sprint-model').length,5);assert.equal(h.calls.filter(call=>call.url.endsWith('/solutions')).length,1);
  }finally{pause.release();h.close();}
 }
 const h=await harness({completed:1});try{h.control.fail.add('/api/excel-sprint/solutions');h.find('[data-sprint-action="solutions"]').click();await ready(()=>h.find('#sprint-models [role="alert"]'));h.control.fail.delete('/api/excel-sprint/solutions');const button=h.find('[data-sprint-action="solutions"]');button.focus();button.click();await ready(()=>h.find('#sprint-models .sprint-model'));assert.equal(h.w.document.activeElement,h.find('#sprint-models h4'));assert.equal(h.saved().tokens.length,1);}finally{h.close();}
});
test('certificate name errors focus the field and failed reissue preserves the earlier signed proof and scoped link',async()=>{
 const h=await harness({completed:30});try{
  h.find('[data-sprint-action="certificate-levels-1-6"]').click();assert.equal(h.w.document.activeElement,h.find('#sprint-certificate-name'));assert.equal(h.find('#sprint-certificate-name').getAttribute('aria-invalid'),'true');assert.equal(h.calls.filter(call=>call.url.endsWith('/certificate')).length,0);assert.match(h.find('#sprint-certificate-error').textContent,/Enter the learner name/);
  let name=h.find('#sprint-certificate-name');name.value='Avery Student';name.dispatchEvent(new h.w.Event('input',{bubbles:true}));h.find('[data-sprint-action="certificate-levels-1-6"]').click();await ready(()=>h.find('#sprint-certificate-result a'));const link=h.find('#sprint-certificate-result a'),token=new URL(link.href).hash.slice('#proof='.length),proof=h.C.verifyCertificate({certificateToken:decodeURIComponent(token)},SECRET);assert.equal(proof.certificate.award,'levels-1-6');assert.equal(proof.certificate.learnerName,'Avery Student');assert.equal(proof.certificate.coreCount,30);assert.equal(link.target,'_blank');assert.match(link.rel,/noopener/);assert.equal(h.w.document.activeElement,h.find('#sprint-certificate-result h4'));
  h.control.fail.add('/api/excel-sprint/certificate');h.find('[data-sprint-action="certificate-levels-1-6"]').click();assert.equal(h.find('#sprint-certificate-result a').href,link.href);await ready(()=>h.find('#sprint-certificate-error')?.textContent.includes('Service unavailable'));assert.equal(h.find('#sprint-certificate-result a').href,link.href);assert.ok(h.find('[data-sprint-action="certificate-download"]'));assert.equal(h.w.document.activeElement,h.find('#sprint-certificate-error'));assert.equal(h.saved().tokens.length,30);
 }finally{h.close();}
});
test('core dataset clipboard fallback stays in its assignment and obsolete clipboard replies cannot alter a new lesson',async()=>{
 const h=await harness({completed:1});try{
  await ready(()=>h.find('[data-learning-drill="R4-A1"]'));h.find('[data-learning-drill="R4-A1"]').click();await ready(()=>h.find('[data-learning-formula]'));h.find('[data-learning-formula]').value='=UPPER(TRIM(CLEAN(Data!B2)))';h.find('[data-learning-formula]').dispatchEvent(new h.w.Event('input',{bubbles:true}));enter(h,'t1','=SUM(Data!D2:D25)','001');
  Object.defineProperty(h.w.navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Permission denied');}}});h.find('[data-sprint-action="copy"]').click();await ready(()=>h.find('#sprint-copy-fallback'));assert.equal(h.find('#sprint-copy-fallback').closest('#sprint-assignment'),h.find('#sprint-assignment'));assert.equal(h.find('#sprint-copy-fallback').closest('#sprint-learning'),null);const headings=JSON.parse(fs.readFileSync(asset+'packages/L1-A1.json')).dataset.headers.join('\t');assert.ok(h.find('#sprint-tsv').value.startsWith(headings));assert.equal(h.saved().learning.drills['R4-A1'].submissions.formula,'=UPPER(TRIM(CLEAN(Data!B2)))');
  const pause=deferred();let called=false;Object.defineProperty(h.w.navigator,'clipboard',{configurable:true,value:{writeText:async()=>{called=true;await pause.wait;throw new Error('Permission denied');}}});h.find('[data-sprint-action="copy"]').click();await ready(()=>called);h.find('[data-sprint-open="L1-A2"]').click();await ready(()=>h.find('.sprint-assignment-heading')?.textContent.includes('L1-A2'));pause.release();await new Promise(resolve=>h.w.requestAnimationFrame(()=>h.w.requestAnimationFrame(resolve)));assert.equal(h.find('#sprint-copy-fallback'),null);assert.equal(h.saved().packages['L1-A1'].submissions.t1.resultText,'001');
 }finally{h.close();}
});
test('an imported local all-correct claim without a receipt remains an unchecked draft and bulk check submits every real required task',async()=>{
 const h=await harness();try{
  const candidate=P.emptyState(),saved={submissions:{},tasks:{},timeMs:1234,score:100,firstAttemptScore:100,solvedAt:new Date().toISOString()};for(const answer of publicFoundationAnswers()){saved.submissions[answer.id]={formula:answer.formula,result:answer.result,resultText:String(answer.result)};saved.tasks[answer.id]={correct:true,attempts:1,firstAttemptCorrect:true,hint:'Imported all-correct claim',checkedSubmission:{formula:answer.formula,resultText:String(answer.result)}};}candidate.packages['L1-A1']=saved;
  const text=JSON.stringify(candidate),input=h.find('#sprint-import');Object.defineProperty(input,'files',{value:[{size:Buffer.byteLength(text),text:async()=>text}]});input.dispatchEvent(new h.w.Event('change',{bubbles:true}));await ready(()=>h.find('#sprint-message').textContent.startsWith('Backup restored.')&&h.find('#sprint-assignment fieldset'));
  assert.equal(h.saved().tokens.length,0);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,true);assert.equal(h.find('[data-sprint-action="grade-all"]').disabled,false);assert.equal(h.find('[data-sprint-action="solutions"]'),null);assert.equal(h.w.document.querySelectorAll('[data-sprint-passed]').length,0);assert.equal(h.find('[data-sprint-feedback="t1"]').textContent,'');assert.equal(h.find('[data-sprint-formula-input="t1"]').value,publicFoundationAnswers()[0].formula);assert.ok(h.saved().packages['L1-A1'].timeMs>=1234);
  h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.find('[data-sprint-open="L1-A2"]').disabled===false);const submitted=h.calls.find(call=>call.url.endsWith('/grade'));assert.equal(submitted.body.submissions.length,4);assert.equal(submitted.body.receipt,undefined);assert.equal(h.saved().tokens.length,1);
 }finally{h.close();}
});
test('a corrupt nonempty task receipt is cleared without losing drafts and real checks recover the assignment',async()=>{
 const initial=P.emptyState(),saved={receipt:'invalid-proof',submissions:{},tasks:{},timeMs:4321,score:100,firstAttemptScore:100};for(const answer of publicFoundationAnswers()){saved.submissions[answer.id]={formula:answer.formula,result:answer.result,resultText:String(answer.result)};saved.tasks[answer.id]={correct:true,attempts:1,firstAttemptCorrect:true};}initial.packages['L1-A1']=saved;
 const h=await harness({initial});try{
  await ready(()=>h.calls.some(call=>call.body?.action==='receipt'));await ready(()=>h.saved().packages['L1-A1'].receipt===undefined&&!h.find('[data-sprint-action="grade-all"]').disabled);
  assert.equal(h.w.document.querySelectorAll('[data-sprint-passed]').length,0);assert.match(h.find('#sprint-receipt-status').textContent,/could not be verified/);assert.equal(h.saved().packages['L1-A1'].submissions.t1.formula,publicFoundationAnswers()[0].formula);assert.ok(h.saved().packages['L1-A1'].timeMs>=4321);
  h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.find('[data-sprint-open="L1-A2"]').disabled===false);assert.equal(h.saved().tokens.length,1);assert.equal(h.calls.find(call=>call.url.endsWith('/grade')).body.receipt,undefined);
 }finally{h.close();}
});
test('signed partial history replaces forged local counters and checked snapshots without grading the saved draft',async()=>{
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),answers=publicFoundationAnswers(),bonus=fixtures['L1-A1'].bonus;
 const proof=G.gradeSubmission({packageId:'L1-A1',submissions:[{taskId:'t1',formula:answers[0].formula,result:0},{taskId:'t2',formula:answers[1].formula,result:answers[1].result},{taskId:'bonus',formula:bonus.model,result:bonus.answer}]},SECRET),initial=P.emptyState(),saved={receipt:proof.receipt,submissions:{},tasks:{},timeMs:6543,score:100,firstAttemptScore:100};
 for(const answer of answers){saved.submissions[answer.id]={formula:answer.formula,result:answer.result,resultText:String(answer.result)};saved.tasks[answer.id]={correct:true,attempts:99,firstAttemptCorrect:true,submissionCorrect:true,checkedSubmission:{formula:answer.formula,resultText:String(answer.result)}};}saved.tasks.bonus={correct:false,attempts:99,firstAttemptCorrect:false};initial.packages['L1-A1']=saved;
 const h=await harness({initial});try{
  await ready(()=>!h.find('[data-sprint-check="t1"]').disabled);const restored=h.saved().packages['L1-A1'];assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,0);assert.equal(restored.tasks.t1.correct,false);assert.equal(restored.tasks.t1.attempts,1);assert.equal(restored.tasks.t1.firstAttemptCorrect,false);assert.equal(restored.tasks.t2.correct,true);assert.equal(restored.tasks.t2.attempts,1);assert.equal(restored.tasks.t2.checkedSubmission,undefined);assert.equal(restored.tasks.bonus.correct,true);assert.equal(restored.tasks.bonus.attempts,1);assert.match(h.find('[data-sprint-feedback="t2"]').textContent,/Revised answer not checked/);assert.match(h.find('[data-sprint-passed="t2"]').textContent,/Earlier check passed/);assert.equal(h.find('[data-sprint-result-input="t1"]').value,String(answers[0].result));
  h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.find('[data-sprint-open="L1-A2"]').disabled===false);assert.deepEqual(h.calls.find(call=>call.url.endsWith('/grade')).body.submissions.map(item=>item.taskId),['t1','t3','t4']);assert.equal(h.saved().packages['L1-A1'].tasks.t1.attempts,2);assert.equal(h.saved().packages['L1-A1'].firstAttemptScore,75);
 }finally{h.close();}
});
test('unavailable partial verification preserves the receipt and edits, hides unverified passes and offers a retry without grading',async()=>{
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),answer=publicFoundationAnswers()[0],proof=G.gradeSubmission({packageId:'L1-A1',submissions:[{taskId:'t1',formula:answer.formula,result:answer.result}]},SECRET),initial=P.emptyState();initial.packages['L1-A1']={receipt:proof.receipt,submissions:{t1:{formula:answer.formula,result:answer.result,resultText:String(answer.result)}},tasks:{t1:{correct:true,attempts:88,firstAttemptCorrect:true}},timeMs:2222};
 const h=await harness({initial,fail:['/api/excel-sprint/verify']});try{
  await ready(()=>h.find('[data-sprint-action="verify-receipt"]')&&!h.find('[data-sprint-action="verify-receipt"]').disabled);assert.equal(h.find('[data-sprint-check="t1"]').disabled,true);assert.equal(h.w.document.querySelectorAll('[data-sprint-passed]').length,0);assert.doesNotMatch(h.find('#sprint-dashboard').textContent,/88/);assert.equal(h.saved().packages['L1-A1'].receipt,proof.receipt);assert.equal(h.saved().packages['L1-A1'].tasks.t1.attempts,88);
  enter(h,'t1','=SUM(Data!D2:D24)','001');h.control.fail.delete('/api/excel-sprint/verify');h.find('[data-sprint-action="verify-receipt"]').click();await ready(()=>!h.find('[data-sprint-check="t1"]').disabled);assert.equal(h.find('[data-sprint-result-input="t1"]').value,'001');assert.equal(h.saved().packages['L1-A1'].submissions.t1.resultText,'001');assert.equal(h.saved().packages['L1-A1'].tasks.t1.attempts,1);assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,0);assert.match(h.find('[data-sprint-feedback="t1"]').textContent,/Revised answer not checked/);
 }finally{h.close();}
});
test('a completed core or Expert receipt recovers its omitted completion proof through normal chain verification without grading',async()=>{
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs');for(const id of ['L1-A1','EX-A1']){
  const initial=P.emptyState();if(id==='EX-A1')for(const key of G.PACKAGE_IDS.slice(0,30))addCoreProof({G},initial,key);
  const proof=G.gradeSubmission({packageId:id,predecessorToken:initial.tokens.at(-1),submissions:fixtures[id].tasks.map(task=>({taskId:task.id,formula:task.model,result:task.answer}))},SECRET);initial.selectedPackageId=id;initial.packages[id]={receipt:proof.receipt,submissions:{},tasks:{},timeMs:333};const chain=id==='L1-A1'?'tokens':'expertTokens',next=id==='L1-A1'?'L1-A2':'EX-A2';
  const h=await harness({initial});try{
   await ready(()=>h.find('[data-sprint-open="'+next+'"]').disabled===false);assert.equal(h.saved()[chain].length,1);assert.equal(h.saved()[chain][0],proof.completionToken);assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,0);assert.equal(h.calls.filter(call=>call.body?.action==='receipt').length,1);assert.ok(h.find('[data-sprint-action="solutions"]'));h.find('[data-sprint-open="'+id+'"]').click();await ready(()=>h.find('#sprint-assignment fieldset'));assert.equal(h.saved()[chain].length,1);
  }finally{h.close();}
 }
});
test('oversized corrupt receipts recover locally, including earned packages whose completion remains available for revised checks',async()=>{
 for(const completed of [0,1]){
  const initial=P.emptyState();initial.packages['L1-A1']={receipt:'"'.repeat(60000),submissions:{t1:{formula:'=SUM(Data!D2:D25)',result:1,resultText:'001'}},tasks:{t1:{correct:true,attempts:88,firstAttemptCorrect:true},bonus:{correct:true,attempts:88,firstAttemptCorrect:true}},timeMs:777};
  const h=await harness({initial,completed});try{
   await ready(()=>h.saved().packages['L1-A1'].receipt===undefined&&!h.find('[data-sprint-check="t1"]').disabled);assert.equal(h.calls.filter(call=>call.body?.action==='receipt').length,0);assert.equal(h.saved().tokens.length,completed);assert.equal(h.saved().packages['L1-A1'].submissions.t1.resultText,'001');assert.equal(h.saved().packages['L1-A1'].tasks.bonus,undefined);assert.equal(h.saved().packages['L1-A1'].tasks.t1?.attempts||0,completed);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,!completed);
   const answer=publicFoundationAnswers()[0];enter(h,'t1',answer.formula,answer.result);h.find('[data-sprint-check="t1"]').click();await ready(()=>h.calls.some(call=>call.url.endsWith('/grade'))&&!h.find('[data-sprint-check="t1"]').disabled);assert.equal(h.calls.find(call=>call.url.endsWith('/grade')).body.receipt,undefined);assert.equal(h.saved().tokens.length,completed);
  }finally{h.close();}
 }
});
test('a prerequisite verification outage keeps an authentic later core or Expert receipt pending until the chain retry succeeds',async()=>{
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs');for(const entry of [{id:'L2-A1',count:5},{id:'EX-A1',count:30}]){
  const initial=P.emptyState();for(const key of G.PACKAGE_IDS.slice(0,entry.count))addCoreProof({G},initial,key);const task=fixtures[entry.id].tasks[0],proof=G.gradeSubmission({packageId:entry.id,predecessorToken:initial.tokens.at(-1),submissions:[{taskId:task.id,formula:task.model,result:task.answer}]},SECRET);initial.selectedPackageId=entry.id;initial.packages[entry.id]={receipt:proof.receipt,submissions:{},tasks:{t1:{correct:true,attempts:88,firstAttemptCorrect:true}},timeMs:111};
  const h=await harness({initial,fail:['/api/excel-sprint/verify']});try{
   assert.equal(h.calls.filter(call=>call.body?.action==='receipt').length,0);assert.equal(h.saved().packages[entry.id].receipt,proof.receipt);assert.equal(h.find('[data-sprint-check="t1"]').disabled,true);assert.match(h.find('#sprint-receipt-status').textContent,/completion record/);
   h.control.fail.delete('/api/excel-sprint/verify');h.find('#sprint-verify-button').click();await ready(()=>!h.find('[data-sprint-check="t1"]').disabled);const request=h.calls.find(call=>call.body?.action==='receipt');assert.equal(request.body.predecessorToken,initial.tokens.at(-1));assert.equal(h.saved().packages[entry.id].tasks.t1.attempts,1);assert.equal(h.saved().packages[entry.id].receipt,proof.receipt);assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,0);
  }finally{h.close();}
 }
});
test('delayed saved-task verification preserves edited field focus and ignores replaced or externally paused state',async()=>{
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),answer=publicFoundationAnswers()[0],proof=G.gradeSubmission({packageId:'L1-A1',submissions:[{taskId:'t1',formula:answer.formula,result:answer.result}]},SECRET);
 for(const operation of ['edit','reset','import','external']){
  const initial=P.emptyState();initial.packages['L1-A1']={receipt:proof.receipt,submissions:{t1:{formula:answer.formula,result:answer.result,resultText:String(answer.result)}},tasks:{},timeMs:222};const pause=deferred(),h=await harness({initial,waits:[['/api/excel-sprint/verify',pause.wait]]});try{
   await ready(()=>h.calls.some(call=>call.body?.action==='receipt'));enter(h,'t1','=SUM(Data!D2:D24)','001');let field=h.find('[data-sprint-result-input="t1"]');field.focus();field.setSelectionRange(1,2);
   if(operation==='reset'){h.find('[data-sprint-action="reset"]').click();h.find('[data-sprint-action="confirm-reset"]').click();await ready(()=>h.find('#sprint-message').textContent.startsWith('Excel Formula Sprint progress reset.'));}
   if(operation==='import'){const text=JSON.stringify(P.emptyState()),input=h.find('#sprint-import');Object.defineProperty(input,'files',{value:[{size:Buffer.byteLength(text),text:async()=>text}]});input.dispatchEvent(new h.w.Event('change',{bubbles:true}));await ready(()=>h.find('#sprint-message').textContent.startsWith('Backup restored.'));}
   if(operation==='external')await anotherTab(h,state=>{addCoreProof(h,state,'L1-A1');});
   pause.release();await new Promise(resolve=>h.w.requestAnimationFrame(()=>h.w.requestAnimationFrame(resolve)));
   if(operation==='edit'){await ready(()=>!h.find('[data-sprint-check="t1"]').disabled);field=h.find('[data-sprint-result-input="t1"]');assert.equal(field.value,'001');assert.equal(h.w.document.activeElement,field);assert.equal(field.selectionStart,1);assert.equal(field.selectionEnd,2);assert.equal(h.saved().packages['L1-A1'].tasks.t1.attempts,1);}
   else if(operation==='external'){assert.equal(h.saved().tokens.length,1);assert.ok(h.find('[data-sprint-action="reload-progress"]'));assert.equal(h.find('[data-sprint-result-input="t1"]'),field);assert.equal(h.w.document.activeElement,field);h.find('[data-sprint-action="backup-text"]').click();assert.equal(P.parseBackup(h.find('#sprint-backup-text').value).packages['L1-A1'].submissions.t1.resultText,'001');}
   else {assert.equal(h.saved().tokens.length,0);assert.equal(h.saved().packages['L1-A1']?.receipt,undefined);assert.deepEqual(h.saved().packages['L1-A1']?.tasks||{},{});assert.equal(h.find('[data-sprint-result-input="t1"]').value,'');}
  }finally{pause.release();h.close();}
 }
});
test('importing forged task flags with a previously cached genuine receipt still reconciles the authoritative partial history',async()=>{
 const h=await harness();try{
  const answer=publicFoundationAnswers()[0];enter(h,'t1',answer.formula,answer.result);h.find('[data-sprint-check="t1"]').click();await ready(()=>h.saved().packages['L1-A1'].tasks.t1?.correct);const candidate=h.saved();for(const task of fixtures['L1-A1'].tasks)candidate.packages['L1-A1'].tasks[task.id]={correct:true,attempts:88,firstAttemptCorrect:true};const text=JSON.stringify(candidate),input=h.find('#sprint-import');Object.defineProperty(input,'files',{value:[{size:Buffer.byteLength(text),text:async()=>text}]});input.dispatchEvent(new h.w.Event('change',{bubbles:true}));await ready(()=>h.find('#sprint-message').textContent.startsWith('Backup restored.'));
  assert.equal(h.calls.filter(call=>call.body?.action==='receipt').length,1);assert.equal(h.saved().packages['L1-A1'].tasks.t1.attempts,1);assert.equal(h.saved().packages['L1-A1'].tasks.t2.correct,false);assert.equal(h.saved().packages['L1-A1'].tasks.t2.attempts,0);assert.equal(h.saved().tokens.length,0);assert.equal(h.w.document.querySelectorAll('[data-sprint-passed]').length,1);
 }finally{h.close();}
});
test('a completed receipt whose recovered chain check is unavailable retains one proof for verification retry without another grade',async()=>{
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),proof=G.gradeSubmission({packageId:'L1-A1',submissions:fixtures['L1-A1'].tasks.map(task=>({taskId:task.id,formula:task.model,result:task.answer}))},SECRET),initial=P.emptyState();initial.packages['L1-A1']={receipt:proof.receipt,submissions:{},tasks:{},timeMs:123};
 const h=await harness({initial,failChainVerification:true});try{
  await ready(()=>h.find('#sprint-message').textContent.includes('Choose Verify saved progress'));assert.equal(h.saved().tokens.length,1);assert.equal(h.saved().tokens[0],proof.completionToken);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,true);assert.equal(h.find('[data-sprint-check="t1"]').disabled,true);assert.equal(h.find('[data-sprint-action="solutions"]'),null);
  h.control.failChainVerification=false;h.find('#sprint-verify-button').click();await ready(()=>h.find('[data-sprint-open="L1-A2"]').disabled===false);assert.equal(h.saved().tokens.length,1);assert.equal(h.calls.filter(call=>call.body?.action==='receipt').length,1);assert.equal(h.calls.filter(call=>call.url.endsWith('/grade')).length,0);assert.ok(h.find('[data-sprint-action="solutions"]'));
 }finally{h.close();}
});
test('completed imported packages retain unsigned bonus history as unverified until a genuine bonus check replaces it',async()=>{
 const initial=P.emptyState(),bonus=fixtures['L1-A1'].bonus;initial.packages['L1-A1']={submissions:{bonus:{formula:bonus.model,result:bonus.answer,resultText:String(bonus.answer)}},tasks:{bonus:{correct:true,attempts:88,firstAttemptCorrect:true,submissionCorrect:true,checkedSubmission:{formula:bonus.model,resultText:String(bonus.answer)}}},timeMs:567};
 const h=await harness({initial,completed:1});try{
  assert.match(h.find('[data-sprint-feedback="bonus"]').textContent,/Saved bonus history not verified/);assert.equal(h.find('[data-sprint-passed="bonus"]'),null);assert.equal(h.find('[data-sprint-formula-input="bonus"]').closest('fieldset').classList.contains('is-correct'),false);assert.match(h.find('#sprint-dashboard').textContent,/Saved bonus history not verified/);assert.equal(h.saved().packages['L1-A1'].tasks.bonus.correct,true);assert.equal(h.saved().packages['L1-A1'].tasks.bonus.attempts,88);assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,false);
  h.find('[data-sprint-check="bonus"]').click();await ready(()=>h.saved().packages['L1-A1'].receipt&&!h.find('[data-sprint-check="bonus"]').disabled);assert.equal(h.saved().tokens.length,1);assert.equal(h.saved().packages['L1-A1'].tasks.bonus.attempts,1);assert.match(h.find('[data-sprint-feedback="bonus"]').textContent,/Correct/);assert.ok(h.find('[data-sprint-passed="bonus"]'));assert.equal(h.find('[data-sprint-formula-input="bonus"]').closest('fieldset').classList.contains('is-correct'),true);
 }finally{h.close();}
});

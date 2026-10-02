const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const L=require('../assets/lessons/excel-formula-fluency/sprint/learning.js');
const asset='assets/lessons/excel-formula-fluency/sprint/';
const SECRET='learning-integration-local-test-secret-over-32-bytes';
async function ready(check){for(let i=0;i<120;i++){if(check())return;await new Promise(resolve=>setImmediate(resolve));}throw new Error('Combined Sprint interface did not reach the expected state.');}
async function harness(initial=P.emptyState()){
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs');
 const H=await import('../netlify/functions/_shared/excel-sprint-learning.mjs');
 const dom=new JSDOM('<div id="excel-sprint-app"></div>',{url:'https://sprint.example/lesson',runScripts:'outside-only'}),w=dom.window,calls=[];
 w.TextEncoder=TextEncoder;w.localStorage.setItem(P.KEY,JSON.stringify(initial));
 w.HTMLElement.prototype.scrollIntoView=function(){};w.URL.createObjectURL=()=> 'blob:qa-progress';w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){};
 w.fetch=async(url,init={})=>{
  const body=init.body?JSON.parse(init.body):undefined;calls.push({url,body});let data;
  try{
   if(url.startsWith('/assets/'))data=JSON.parse(fs.readFileSync('.'+url,'utf8'));
   else if(url.endsWith('/coaching-status'))data={available:false};
   else if(url.endsWith('/learning'))data=H.learningAction(body,SECRET);
   else if(url.endsWith('/verify'))data=G.verifyProgress(body,SECRET);
   else throw new Error('Unexpected endpoint '+url);
   return new Response(JSON.stringify(data),{status:200});
  }catch(error){return new Response(JSON.stringify({error:error.message}),{status:error.status||500});}
 };
 for(const file of ['learning.js','progress.js','dashboard.js','learning-app.js','app.js'])w.eval(fs.readFileSync(asset+file,'utf8'));
 await ready(()=>w.document.querySelector('#sprint-learning [data-learning-action="diagnostic"]')&&w.document.querySelector('#sprint-assignment fieldset'));
 return {dom,w,calls,H,find:s=>w.document.querySelector(s),saved:()=>P.parseBackup(w.localStorage.getItem(P.KEY))};
}
function click(h,selector){const element=h.find(selector);assert.ok(element,selector);element.click();}

test('combined course diagnostic keeps sequential unlocks and exports practice drafts in the same backup',async()=>{
 const h=await harness();try{
  click(h,'[data-learning-action="diagnostic"]');
  click(h,'input[name="learning-q1"][value="c"]');
  h.find('[data-learning-diagnostic]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));
  await ready(()=>h.find('.sprint-learning-report'));
  assert.match(h.find('.sprint-learning-report').textContent,/10% correct/);
  assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,true);
  assert.equal(h.find('[data-sprint-action="certificate-full-path"]').disabled,true);
  click(h,'[data-learning-drill="R4-A1"]');
  await ready(()=>h.find('[data-learning-formula]'));
  h.find('[data-learning-formula]').value='=UPPER(TRIM(CLEAN(Data!B2)))';
  h.find('[data-learning-result]').value='QA-7\n0';
  click(h,'[data-sprint-action="export"]');
  const saved=h.saved();assert.equal(saved.tokens.length,0);assert.equal(saved.expertTokens.length,0);
  assert.equal(saved.learning.diagnostic.score,10);assert.equal(saved.learning.drills['R4-A1'].submissions.formula,'=UPPER(TRIM(CLEAN(Data!B2)))');
  assert.deepEqual(saved.learning.drills['R4-A1'].submissions.result,[['QA-7'],['0']]);
 }finally{h.dom.window.close();}
});

test('combined backup import verifies learning receipts and reset removes only the chosen local Sprint record',async()=>{
 const h=await harness();try{
  const candidate=P.emptyState();
  const diagnostic=h.H.learningAction({action:'diagnostic',answers:Array.from({length:10},(_,i)=>({questionId:'q'+(i+1),optionId:null}))},SECRET);
  candidate.learning=L.applyDiagnostic(candidate.learning,diagnostic);
  candidate.learning.diagnosticAnswers.q1='c';
  const text=JSON.stringify(candidate),input=h.find('#sprint-import');
  Object.defineProperty(input,'files',{value:[{size:Buffer.byteLength(text),text:async()=>text}]});
  input.dispatchEvent(new h.w.Event('change',{bubbles:true}));
  await ready(()=>h.find('#sprint-message').textContent.startsWith('Backup restored.')&&h.find('.sprint-learning-report'));
  assert.ok(h.calls.some(call=>call.body?.action==='verify-many'&&call.body.tokens.includes(diagnostic.receipt)));
  assert.equal(h.saved().learning.diagnostic.receipt,diagnostic.receipt);
  assert.equal(h.find('[data-sprint-open="L1-A2"]').disabled,true);
  click(h,'[data-sprint-action="reset"]');click(h,'[data-sprint-action="confirm-reset"]');
  await ready(()=>h.find('#sprint-message').textContent.startsWith('Excel Formula Sprint progress reset.')&&h.find('[data-learning-action="diagnostic"]'));
  const saved=h.saved();assert.equal(saved.learning.diagnostic,null);assert.deepEqual(saved.learning.drills,{});assert.equal(saved.tokens.length,0);
 }finally{h.dom.window.close();}
});

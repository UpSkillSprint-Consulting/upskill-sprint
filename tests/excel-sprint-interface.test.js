const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const SECRET='interface-test-sprint-signing-secret-over-32-bytes';
const keys=JSON.parse(fs.readFileSync('netlify/functions/_shared/excel-sprint-answers.json'));
const asset='assets/lessons/excel-formula-fluency/sprint/';
async function ready(check){for(let i=0;i<80;i++){if(check())return;await new Promise(resolve=>setImmediate(resolve));}throw new Error('Interface did not reach the expected state.');}
async function harness(id,count,coaching=true){
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),state=P.emptyState();state.selectedPackageId=id;
 for(const packageId of G.PACKAGE_IDS.slice(0,count)){const r=G.gradeSubmission({packageId,predecessorToken:state.tokens.at(-1),submissions:keys[packageId].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);state.tokens.push(r.completionToken);}
 const dom=new JSDOM('<div id="excel-sprint-app"></div>',{url:'https://sprint.example/lesson',runScripts:'outside-only'}),w=dom.window,calls=[];
 w.TextEncoder=TextEncoder;w.localStorage.setItem('upskillsprint.excel-sprint.v1',JSON.stringify(state));
 w.fetch=async(url,init={})=>{
  const body=init.body?JSON.parse(init.body):undefined;calls.push({url,body});let response;
  if(url.startsWith('/assets/'))response=JSON.parse(fs.readFileSync(path.join(__dirname,'..',url)));
  else if(url.endsWith('/coaching-status'))response={available:coaching};
  else if(url.endsWith('/verify'))response=G.verifyProgress(body,SECRET);
  else if(url.endsWith('/grade'))response=G.gradeSubmission(body,SECRET);
  else if(url.endsWith('/coach'))response={packageId:body.packageId,taskId:body.taskId,submissionCorrect:true,feedback:{logic:'<script>bad()</script>',robustness:'Check the missing-key case.',references:'Keep lookup ranges fixed.',readability:'Use a named intermediate.',efficiency:'Reuse the lookup.',nextStep:'Test in Excel.'}};
  else throw new Error('Unexpected endpoint '+url);
  return new Response(JSON.stringify(response),{status:200,headers:{'content-type':'application/json'}});
 };
 w.HTMLElement.prototype.scrollIntoView=function(){};
 for(const file of ['progress.js','dashboard.js','app.js'])w.eval(fs.readFileSync(asset+file,'utf8'));
 await ready(()=>w.document.querySelector('#sprint-assignment fieldset'));
 return{dom,w,calls,find:selector=>w.document.querySelector(selector)};
}

test('a Phase 1 backup unlocks Level 3 and exposes supporting-sheet downloads',async()=>{
 const h=await harness('L3-A1',10);try{
  assert.match(h.find('.sprint-hero-stats').textContent,/Levels 1–6/);
  assert.equal(h.find('[data-sprint-open="L3-A1"]').disabled,false);assert.equal(h.find('[data-sprint-open="L3-A2"]').disabled,true);
  assert.match(h.find('.sprint-supporting-sheet').textContent,/Specs sheet/);
  assert.equal(h.find('[data-sprint-sheet="Specs"]').textContent,'Copy Specs for Excel');
  assert.match(h.find('.sprint-supporting-sheet a').getAttribute('href'),/L3-A1-Specs.csv$/);
  assert.equal(h.find('[data-sprint-coach="t1"]').disabled,true);
 }finally{h.dom.window.close();}
});

test('pasted text leading zeros survive grading; coaching is escaped and cannot change attempts',async()=>{
 const h=await harness('L4-A2',16);try{
  h.find('[data-sprint-formula-input="t2"]').value=keys['L4-A2'].tasks[1].model;
  h.find('[data-sprint-result-input="t2"]').value=keys['L4-A2'].tasks[1].answer.map(r=>r[0]).join('\n')+'\n';
  h.find('[data-sprint-check="t2"]').click();
  await ready(()=>h.find('[data-sprint-coach="t2"]')&&!h.find('[data-sprint-coach="t2"]').disabled);
  const sent=h.calls.find(c=>c.url.endsWith('/grade'));assert.equal(sent.body.submissions[0].result[0][0],'007');
  assert.match(h.find('[data-sprint-coach-panel="t2"]').parentElement.textContent,/Correct · 1 attempt/);
  h.find('[data-sprint-coach="t2"]').click();await ready(()=>h.find('[data-sprint-coach-panel="t2"] h5'));
  const panel=h.find('[data-sprint-coach-panel="t2"]');assert.equal(panel.querySelector('script'),null);assert.match(panel.textContent,/<script>bad/);
  assert.equal(h.calls.filter(c=>c.url.endsWith('/grade')).length,1);
  h.find('[data-sprint-coach="t2"]').click();await ready(()=>!h.find('[data-sprint-coach="t2"]').disabled);
  assert.equal(h.calls.filter(c=>c.url.endsWith('/coach')).length,1);
  const input=h.find('[data-sprint-formula-input="t2"]');input.value='=1';input.dispatchEvent(new h.w.Event('input',{bubbles:true}));assert.equal(h.find('[data-sprint-coach-panel="t2"]').textContent,'');
 }finally{h.dom.window.close();}
});

test('array paste retains trailing blank cells and unavailable coaching leaves checks usable',async()=>{
 const h=await harness('L4-A4',18,false);try{
  assert.equal(h.find('[data-sprint-coach]'),null);assert.match(h.find('.sprint-coaching-notice').textContent,/temporarily unavailable/);
  h.find('[data-sprint-formula-input="t1"]').value=keys['L4-A4'].tasks[0].model;
  h.find('[data-sprint-result-input="t1"]').value='A\tB\t\n';h.find('[data-sprint-check="t1"]').click();
  await ready(()=>h.calls.some(c=>c.url.endsWith('/grade')));
  assert.deepEqual(h.calls.find(c=>c.url.endsWith('/grade')).body.submissions[0].result,[['A','B','']]);
 }finally{h.dom.window.close();}
});

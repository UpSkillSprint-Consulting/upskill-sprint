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
async function harness(id,count,coaching=true,expertCount=0){
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),state=P.emptyState();state.selectedPackageId=id;
 for(const packageId of G.PACKAGE_IDS.slice(0,count)){const r=G.gradeSubmission({packageId,predecessorToken:state.tokens.at(-1),submissions:keys[packageId].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);state.tokens.push(r.completionToken);}
 for(const packageId of G.EXPERT_IDS.slice(0,expertCount)){const r=G.gradeSubmission({packageId,predecessorToken:state.expertTokens.at(-1)||state.tokens.at(-1),submissions:keys[packageId].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);state.expertTokens.push(r.completionToken);}
 const dom=new JSDOM('<div id="excel-sprint-app"></div>',{url:'https://sprint.example/lesson',runScripts:'outside-only'}),w=dom.window,calls=[];
 w.TextEncoder=TextEncoder;w.localStorage.setItem('upskillsprint.excel-sprint.v1',JSON.stringify(state));
 w.fetch=async(url,init={})=>{
  const body=init.body?JSON.parse(init.body):undefined;calls.push({url,body});let response;
  if(url.startsWith('/assets/'))response=JSON.parse(fs.readFileSync(path.join(__dirname,'..',url)));
  else if(url.endsWith('/coaching-status'))response={available:coaching};
  else if(url.endsWith('/verify'))response=G.verifyProgress(body,SECRET);
  else if(url.endsWith('/grade'))response=G.gradeSubmission(body,SECRET);
  else if(url.endsWith('/certificate'))response=(await import('../netlify/functions/_shared/excel-sprint-certificates.mjs')).issueCertificate(body,SECRET);
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

test('Expert Track stays locked until all 30 prerequisites verify and certificates show exact scope',async()=>{
 const h=await harness('L6-A5',29);try{
  assert.equal(h.find('[data-sprint-open="EX-A1"]').disabled,true);assert.equal(h.find('[data-sprint-action="certificate-levels-1-6"]').disabled,true);assert.equal(h.find('[data-sprint-action="certificate-expert-track-v1"]').disabled,true);
  assert.match(h.find('#sprint-certificates').textContent,/Full 50-assignment completion: future release/);
 }finally{h.dom.window.close();}
});
test('capstone grading uses the Level 6 predecessor and preserves separate core and expert proofs',async()=>{
 const h=await harness('EX-A1',30,false);try{
  assert.match(h.find('.sprint-assignment-heading').textContent,/Expert Track · Capstone 1/);assert.ok(!h.find('.sprint-assignment-heading').textContent.includes('undefined'));
  assert.equal(h.find('[data-sprint-open="EX-A2"]').disabled,true);
  for(const t of keys['EX-A1'].tasks){h.find('[data-sprint-formula-input="'+t.id+'"]').value=t.model;h.find('[data-sprint-result-input="'+t.id+'"]').value=Array.isArray(t.answer)?t.answer.map(r=>r.join('\t')).join('\n'):String(t.answer);}
  h.find('[data-sprint-action="grade-all"]').click();await ready(()=>h.find('[data-sprint-open="EX-A2"]')&&!h.find('[data-sprint-open="EX-A2"]').disabled);
  const sent=h.calls.find(c=>c.url.endsWith('/grade')),proof=JSON.parse(Buffer.from(sent.body.predecessorToken.split('.')[0],'base64url'));assert.equal(proof.packageId,'L6-A5');
  const saved=JSON.parse(h.w.localStorage.getItem(P.KEY));assert.equal(saved.tokens.length,30);assert.equal(saved.expertTokens.length,1);assert.equal(saved.packages['EX-A1'].score,100);
  assert.equal(h.find('[data-sprint-action="certificate-levels-1-6"]').disabled,false);assert.equal(h.find('[data-sprint-action="certificate-expert-track-v1"]').disabled,true);assert.match(h.find('#sprint-dashboard').textContent,/1 \/ 3/);
 }finally{h.dom.window.close();}
});
test('restored expert completion enables certificate issuance without extra grading or altered attempts',async()=>{
 const h=await harness('EX-A3',30,false,3);try{
  assert.equal(h.find('[data-sprint-action="certificate-expert-track-v1"]').disabled,false);
  const input=h.find('#sprint-certificate-name');input.value='Nora QA';input.dispatchEvent(new h.w.Event('input',{bubbles:true}));h.find('[data-sprint-action="certificate-expert-track-v1"]').click();await ready(()=>h.find('#sprint-certificate-result a'));
  assert.match(h.find('#sprint-certificate-result').textContent,/Nora QA.*30 core assignments/);const call=h.calls.find(c=>c.url.endsWith('/certificate'));assert.equal(call.body.tokens.length,30);assert.equal(call.body.expertTokens.length,3);assert.equal(h.calls.filter(c=>c.url.endsWith('/grade')).length,0);
  const link=h.find('#sprint-certificate-result a');assert.match(link.getAttribute('href'),/^\/excel-sprint-certificate#proof=/);const saved=JSON.parse(h.w.localStorage.getItem(P.KEY));assert.equal(saved.packages['EX-A3'].tasks.t1.attempts,1);
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
  await ready(()=>!h.find('[data-sprint-check="t1"]').disabled);
  const fetch=h.w.fetch;h.w.fetch=(url,init)=>url.endsWith('/coaching-status')?Promise.resolve(new Response(JSON.stringify({available:true}),{status:200})):fetch(url,init);
  h.find('[data-sprint-action="retry-coaching"]').click();await ready(()=>h.find('[data-sprint-coach="t1"]'));
  assert.equal(h.find('[data-sprint-coach="t1"]').disabled,false);assert.equal(h.calls.filter(c=>c.url.endsWith('/grade')).length,1);
 }finally{h.dom.window.close();}
});

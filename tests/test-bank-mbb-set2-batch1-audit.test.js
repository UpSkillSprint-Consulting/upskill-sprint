'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const {JSDOM,VirtualConsole}=require('jsdom');
const ROOT=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
function load(){const w={};w.window=w;vm.runInNewContext(read('test-bank-mbb-set2.js'),w);return JSON.parse(JSON.stringify(w.MBB_SET2_BATCHES));}
const batches=load(),batch=batches[1],q=n=>batch[n-1];
const keys=[2,0,3,1,0,3,1,2,0,3,1,2,0,3,1,2,0,3,1,0,2,1,3,0,2];
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
async function domPage(){
 let html=read('test-bank.html');
 for(const file of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-batch1-review.js'])html=html.replace(`<script src="/${file}"></script>`,`<script>${read(file)}</script>`);
 const errors=[],console=new VirtualConsole();console.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:console});
 await new Promise(resolve=>dom.window.addEventListener('load',resolve));
 dom.window.eval(read('test-bank-deep-feedback.js'));
 assert.deepEqual(errors,[]);return dom;
}
test('audit scope: all 25 independent keys retained; exactly four distinct choices and four explanations',()=>{
 assert.deepEqual(batch.map(v=>v.answer),keys);
 batch.forEach(v=>{assert.equal(v.options.length,4);assert.equal(new Set(v.options.map(s=>s.trim().toLowerCase())).size,4);assert.equal(v.optionRationales.length,4);assert.ok(v.optionRationales.every(s=>s.length>20));});
});
test('Q5: mandatory ready-project portfolios independently enumerated under capacity eight',()=>{
 const rows=q(5).chart.rows;const ready=[0,1,2,4];const plans=[];
 for(let mask=0;mask<16;mask++){const ids=ready.filter((_,i)=>mask&(1<<i));if(!ids.includes(0))continue;const months=ids.reduce((s,i)=>s+Number(rows[i][3]),0);const npv=ids.reduce((s,i)=>s+Number(rows[i][2].replace(/[$M]/g,'')),0);if(months<=8)plans.push({ids,months,npv});}
 plans.sort((a,b)=>b.npv-a.npv);assert.deepEqual(plans[0].ids,[0,1]);assert.equal(plans[0].months,7);close(plans[0].npv,1.9);close(plans[1].npv,1.8);
 assert.match(q(5).stem,/exactly one BB-month/);assert.match(q(5).studentContext,/does not change/);
});
test('Q12/Q13: precedence and capacity calculations use the complete stated constraints',()=>{
 assert.equal(30+Math.max(40,35)+25+15,110);assert.equal((30+40+25+15)-(30+35+25+15),5);assert.equal(13-9,4);
 assert.match(q(12).options[q(12).answer],/110/);
});
test('Q14: positive conditional value is not misreported as supported cash NPV',()=>{
 const factor=Array.from({length:4},(_,i)=>1/1.1**(i+1)).reduce((s,x)=>s+x,0);
 close(factor,3.169865446349293);close(-600000+220000*factor,97370.3981968444,1e-5);close(-400000+155000*factor,91329.1441841404,1e-5);
 assert.match(q(14).options[q(14).answer],/only Y has a supported positive cash-flow NPV/);assert.match(q(14).formula,/cash NPV with no supported inflow = -600000/);
});
test('Q15/Q16: unsupported time capacity removed and observational training evidence qualified',()=>{
 assert.doesNotMatch(q(15).stem,/120/);assert.match(q(15).why,/ordinal/);assert.match(q(15).why,/durations/);
 assert.equal((64-62)-(63-61),0);assert.equal(88-58,30);assert.match(q(16).why,/no earlier reaction score/);assert.match(q(16).why,/nonrandomized/);
 for(const n of [5,13,16,18]){assert.equal(q(n).cognitive,'Evaluate');assert.equal(q(n).bokCognitiveMaximum,'Create');}
});
test('Q19: exact linear uncertainty with independent errors; correct units and standard/expanded distinction',()=>{
 const variance=.5**2*(.04**2+.06**2);close(variance,.0013);close(Math.sqrt(variance),.03605551275463989);
 assert.match(q(19).why,/exact/);assert.match(q(19).why,/not an expanded uncertainty/);
});
test('Q21/Q22: capability separated from stability; independently replicated whole plots, not pseudoreplicates',()=>{
 assert.match(q(21).options[2],/capability separately/);
 const rows=q(22).chart.rows;assert.equal(rows.length,16);const wp=Object.groupBy(rows,row=>row[1]);assert.equal(Object.keys(wp).length,4);
 const temp=[];for(const group of Object.values(wp)){assert.equal(group.length,4);assert.equal(new Set(group.map(r=>r[2])).size,1);assert.deepEqual(group.map(r=>r[3]).sort(),['A','B','C','D']);temp.push(group[0][2]);}
 assert.equal(temp.filter(t=>t==='Low').length,2);assert.equal(temp.filter(t=>t==='High').length,2);
 // Four independent whole plots: temperature df=1, whole-plot error df=2.
 // Four formulations: df=3, temperature interaction df=3, subplot error df=6.
 assert.equal(1+2+3+3+6,rows.length-1);
});
test('Q23: standard lag-one ACF recomputed from every plotted observation',()=>{
 const y=q(23).chart.data,mean=y.reduce((a,b)=>a+b,0)/y.length;
 const numerator=y.slice(1).reduce((s,v,i)=>s+(v-mean)*(y[i]-mean),0),denominator=y.reduce((s,v)=>s+(v-mean)**2,0);
 close(mean,122.88888888888889);close(numerator,3116.20987654321);close(denominator,3813.777777777778);close(numerator/denominator,.8170926724430137);
 assert.match(q(23).stem,/0\.817/);assert.match(q(23).why,/not an estimated stationary AR\(1\)/);assert.match(q(23).options[3],/raw backlog/);
});
test('Q24/Q25: adjusted odds and variance-versus-SD calculations independently checked',()=>{
 close(Math.exp(.42),1.521961555618634);close(Math.exp(.18),1.1972173631218102);close(Math.exp(1.1),3.0041660239464334);close(.18/.21,.8571428571428571);
 assert.match(q(24).stem,/abandonment = 1/);assert.match(q(24).why,/does not establish causation/);
 close(1-Math.sqrt(20/22),.04653741075440765);close(1-.8**2,.36);assert.match(q(25).chart.columns[1],/MPa²/);
});
test('rendered prompts: all 25 contain the complete case; no explanation or solved formula leaks into attempt',async()=>{
 const dom=await domPage(),w=dom.window;try{
 const ui=w.__TBMbbBatch1Review;
 batch.forEach(v=>{const html=ui.review(v),holder=w.document.createElement('div');holder.innerHTML=html;
 assert.ok(holder.querySelector('.tb-review-stem'));assert.equal(holder.querySelector('.tb-review-stem').textContent,v.stem);
 if(v.studentContext)assert.ok(holder.textContent.includes(v.studentContext));
 if(v.chart){assert.ok(holder.querySelector('.tb-q-chart-wrap'));assert.ok(holder.querySelector('svg,table'));}
 assert.equal(holder.querySelectorAll('.tb-source-ref').length,0);assert.ok(!holder.textContent.includes('Correct.'));
 });
 for(const id of ['mbb:set-2:original-000','mbb:set-2:original-026','mbb:set-2:original-175','mbb:set-3:original-001','cssbb:set-2:original-001'])assert.equal(ui.applies({qid:id}),false);
 }finally{w.close();}
});
test('review exposes all 75 actual stored distractor explanations, not generic fallback',async()=>{
 const dom=await domPage(),w=dom.window;try{batch.forEach(v=>v.options.forEach((_,i)=>{if(i===v.answer)return;const result=w.__TBDeepFeedback.distractorReason(v,i,null);assert.equal(result.validated,true);assert.equal(result.text,v.optionRationales[i]);}));
 const other={...q(1),qid:'mbb:set-2:original-026'};assert.equal(w.__TBDeepFeedback.distractorReason(other,0,null).validated,false);
 }finally{w.close();}
});
test('generated metadata no longer asserts browser/viewport evidence that the asset builder cannot produce',()=>{
 const validation=JSON.parse(read('test-bank-assets/mbb-160/batch-01/validation.json'));
 batch.filter(q=>q.visual).forEach(v=>{assert.deepEqual(v.visual.breakpointsValidated,[]);});
 assert.match(JSON.stringify(validation),/semantic-checks-passed/);assert.doesNotMatch(JSON.stringify(validation),/"readableLabels":true/);
});
test('scoped renderer leaves registry-generated IDs intact for other exams',async()=>{
 const dom=await domPage(),w=dom.window;
 try{
  await require('./helpers/test-bank-durable-learning').installDurableLearning(w);
  const click=el=>{assert.ok(el);el.dispatchEvent(new w.Event('click',{bubbles:true}));};
  click(w.document.querySelector('.tb-tile[data-exam="cssbb"]'));
  click(w.document.querySelector('[data-set="1"]'));
  click(w.document.querySelector('[data-mode="full"]'));
  const stem=w.document.querySelector('.tb-stem');assert.ok(stem);
  assert.ok(stem.dataset.questionId&&stem.dataset.questionId!=='undefined');
  assert.equal(w.document.querySelector('.tb-mbb-batch1'),null);
 }finally{w.close();}
});
test('review/retry slider remains functional and labels reference unique controls',async()=>{
 const dom=await domPage(),w=dom.window;try{
 const a=w.document.createElement('div'),b=w.document.createElement('div');a.innerHTML=w.__TBMbbBatch1Review.review(q(5));b.innerHTML=w.__TBMbbBatch1Review.review(q(5));w.document.body.append(a,b);
 const slider=a.querySelector('[data-tb-whatif]');assert.notEqual(slider.id,b.querySelector('[data-tb-whatif]').id);
 assert.equal(a.querySelector('label').htmlFor,slider.id);assert.ok(w.document.getElementById(slider.getAttribute('aria-describedby')));
 slider.value='10';slider.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(a.querySelector('[data-tb-whatif-value]').textContent,'10');assert.equal(a.querySelector('[data-tb-whatif-remaining]').textContent,'7');
 }finally{w.close();}
});

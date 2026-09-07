// Q51–75 validation. These assertions supplement, not replace, independent item review.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(50,75);
const ids=["d2-063", "d2-066", "d2-070", "d2-071", "d2-072", "d2-073", "d2-074", "d2-075", "d3-001", "d3-005", "d3-008", "d3-011", "d3-012", "d3-016", "d3-017", "d3-022", "d3-026", "d3-031", "d3-035", "d3-037", "d3-041", "d3-042", "d3-043", "d3-044", "d3-045"],keys=[1, 1, 2, 3, 1, 3, 2, 0, 0, 0, 1, 1, 1, 3, 0, 3, 2, 3, 3, 0, 2, 3, 0, 3, 2];
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 3 Q${i+51}: complete case, independently reviewed key and all distractors`,()=>{
 assert.equal(q.qid,'mbb:set-3:'+ids[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,i<8?'mbb-org':'mbb-portfolio');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options.every(s=>s.length>90));
 assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);assert.ok(q.optionRationales.every(s=>s.length>45));
 assert.equal(q.optionRationales.filter(x=>x.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));
 assert.ok(q.why.length>250);assert.ok(q.trap.length>90);assert.ok(q.auditSources.every(s=>s.title&&s.url&&s.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/D[123]-\d|earlier in this domain|tested across|full.domain synthesis|Organizational Culture and Values Framework|\*[^*]+\*/i);
 const len=q.options.map(o=>o.split(/\s+/).length),others=len.filter((_,k)=>k!==q.answer).sort((a,b)=>a-b);assert.ok(len[q.answer]/others[1]<1.36);
});
test('Batch 3 preserves every byte of Q1–50 and Q76–175, all IDs and all answer positions',()=>{
 const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[50])),'4b32c2aadc3faf6d91b1a7f5393732abf46af976d5a805de21f37c11fdeee7f3');assert.equal(sha(source.slice(starts[75])),'1010968ca9290f6d1c473c63f1aeaf6bc2acd687df57846e902503920eaf9a24');
 assert.equal(new Set(bank.map(x=>x.qid)).size,175);assert.deepEqual(batch.map(x=>x.answer),keys);
});
test('Q62 independently derives all individual loads, excesses and aggregate capacity at every scenario value',()=>{
 const q=batch[11],rows=q.chart.rows;assert.deepEqual(rows.map(r=>r[1]),[3,2,1,3]);
 assert.deepEqual(rows.map(r=>r[2]),rows.map(r=>r[1]*10));assert.equal(rows.reduce((s,r)=>s+r[2],0),90);
 assert.deepEqual(rows.map(r=>r[2]-20),[10,0,-10,10]);assert.equal(90-4*20,10);
 for(let c=10;c<=40;c+=5){const over=rows.reduce((s,r)=>s+Math.max(r[2]-c,0),0),spare=rows.reduce((s,r)=>s+Math.max(c-r[2],0),0);assert.equal(over-spare,90-4*c);}
 assert.equal(q.chart.whatIf.value,20);assert.match(q.stem,/each project requires 10 Belt-hours/);
});
test('Q63 independently separates benefit-cost ratios, first-year net values and their difference',()=>{
 const M={benefit:300000,cost:150000},N={benefit:900000,cost:600000};assert.equal(M.benefit/M.cost,2);assert.equal(N.benefit/N.cost,1.5);
 assert.equal(M.benefit-M.cost,150000);assert.equal(N.benefit-N.cost,300000);assert.equal((N.benefit-N.cost)-(M.benefit-M.cost),150000);
 assert.match(batch[12].stem,/first-year/);assert.match(batch[12].options[1],/2\.0.*1\.5.*300,000.*150,000/);
});
test('Q64 independent topological forward/backward pass verifies path, float and zero-duration milestone',()=>{
 const c=batch[13].chart,ef={},lf={},nodes=Object.keys(c.nodes);
 for(const name of nodes){const preds=c.edges.filter(e=>e[1]===name).map(e=>e[0]);ef[name]=Math.max(0,...preds.map(p=>ef[p]))+c.nodes[name].dur;}
 const finish=Math.max(...Object.values(ef));assert.equal(finish,7);
 for(const name of [...nodes].reverse()){const succ=c.edges.filter(e=>e[0]===name).map(e=>e[1]);lf[name]=succ.length?Math.min(...succ.map(s=>lf[s]-c.nodes[s].dur)):finish;}
 assert.equal(lf['Supplier qualification']-ef['Supplier qualification'],2);assert.equal(lf['Material testing']-ef['Material testing'],3);
 assert.equal(lf['Design review']-ef['Design review'],0);assert.equal(c.nodes['Manufacturing ready'].dur,0);assert.equal(c.nodes['Readiness review'].dur,1);
});
test('Q70 exhaustively enumerates all eight indivisible subsets and verifies standard profitability indices',()=>{
 const rows=batch[19].chart.rows,invest=rows.map(r=>Number(r[1].replace(/[^0-9.]/g,''))),npv=rows.map(r=>Number(r[2].replace(/[^0-9.]/g,'')));
 rows.forEach((r,i)=>assert.ok(Math.abs(Number(r[3])-(1+npv[i]/invest[i]))<1e-12));
 const subsets=Array.from({length:8},(_,mask)=>({mask,cost:invest.reduce((s,v,i)=>s+((mask>>i)&1)*v,0),value:npv.reduce((s,v,i)=>s+((mask>>i)&1)*v,0)}));
 const feasible=subsets.filter(x=>x.cost<=500000).sort((a,b)=>b.value-a.value);assert.equal(feasible.length,6);assert.deepEqual(feasible[0],{mask:5,cost:500000,value:420000});assert.equal(feasible[1].value,400000);
 assert.equal(subsets[6].cost,550000);assert.equal(subsets[7].cost,750000);assert.equal(subsets[7].value,640000);
 assert.equal(batch[19].chart.whatIf.value,500);assert.match(batch[19].why,/1\.90, 1\.88 and 1\.80/);
});
test('Q61 preserves shared dependency data and gives duration units without implying independent risks',()=>{
 const c=batch[10].chart;assert.deepEqual(Object.values(c.nodes).map(n=>n.dur),[90,60,75,45]);assert.equal(c.edges.length,3);
 assert.ok(c.edges.every(e=>e[0]==='Vendor upgrade'));assert.match(batch[10].stem,/planning estimates in days/);assert.match(batch[10].why,/float/);
});
test('Five visual items and two bounded explorers remain; corrected evidence does not leak the key',()=>{
 assert.deepEqual(batch.filter(q=>q.chart).map(q=>q.qid),[6,10,11,13,19].map(i=>batch[i].qid));assert.equal(batch.filter(q=>q.chart?.whatIf).length,2);
 for(const q of batch.filter(q=>q.chart?.type==='data-table'))assert.ok(q.chart.rows.every(r=>r.length===q.chart.columns.length));
 assert.match(batch[6].chart.title,/Current/);assert.doesNotMatch(JSON.stringify(batch[6].chart),/Correct|Pair an effort-aware/);
});
test('Renderer scope, numerical explorers and escaping cannot affect other batches or exams',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch3-ui.js'),c);const ui=c.window.__MBBSet3Batch3UI;
 assert.ok(bank.every((q,i)=>ui.isQuestion(q)===(i>=50&&i<75)));assert.equal(ui.isQuestion({qid:'cssbb:set-3:d3-011'}),false);
 for(const q of batch){assert.ok(!ui.render(q,false).includes(q.optionRationales[q.answer]));assert.doesNotMatch(ui.render(q,false),/NaN|undefined/);}
 assert.match(ui.render({...batch[0],stem:'<img onerror="bad"> & text'},false),/&lt;img/);
 for(const i of [11,19]){const chart=batch[i].chart,w=chart.whatIf;for(let v=w.min;v<=w.max;v+=w.step){const s=ui.scenario(chart,v);assert.equal(s.value,v);assert.ok(s.svg.includes('mbbs3b3-capacity-line'));assert.ok(s.text.includes(String(v)));}}
 assert.equal(ui.scenario(batch[11].chart,999).value,40);assert.equal(ui.scenario(batch[11].chart,'bad').value,20);
});
test('Scope, causal, safety and phase-gate corrections remain explicit',()=>{
 assert.match(batch[3].options[3],/cumulative change workload/);assert.match(batch[7].stem,/No causal links/);assert.match(batch[8].why,/marginal label is not/i);
 assert.match(batch[14].options[0],/mandatory safety gates/);assert.match(batch[15].options[3],/approved re-scope/);assert.match(batch[16].why,/not proof that all two weeks/);
 assert.match(batch[17].options[3],/timing/);assert.match(batch[21].options[3],/evidence rather than a universal/);assert.match(batch[22].why,/cannot establish a revised NPV/);
 assert.match(batch[23].why,/hypothesis, not a confirmed root cause/);
});
// Functional grading regression uses the real full-exam and review handlers in JSDOM.
// It is not a substitute for Chromium/WebKit screenshot and accessibility validation.
for(let rotation=0;rotation<4;rotation++)test(`Batch 3 every answer position grades through the actual player (rotation ${rotation})`,async()=>{
 const {JSDOM,VirtualConsole}=require('jsdom');const {installDurableLearning}=require('./helpers/test-bank-durable-learning');
 let html=read('test-bank.html');for(const f of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-set3.js'])html=html.replace('<script src="/'+f+'"></script>','<script>'+read(f)+'</script>');
 const observers=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};const Native=w.MutationObserver;w.MutationObserver=class extends Native{constructor(callback){super(callback);observers.push(this);}};}}),w=dom.window;
 try{
  await new Promise(r=>w.addEventListener('load',r));await installDurableLearning(w);w.eval(read('test-bank-mbb-set3-batch3-ui.js'));w.eval(read('test-bank-feedback-loop.js'));
  const settle=()=>new Promise(r=>w.setTimeout(r,60));await settle();let order=[];const original=w.__TBLearning.startSession;w.__TBLearning.startSession=function(c){order=c.questions.map(q=>q.qid);return original.call(this,c);};
  const host=w.document.getElementById('tb-overview'),click=s=>{const e=typeof s==='string'?w.document.querySelector(s):s;assert.ok(e,'control '+s);e.dispatchEvent(new w.Event('click',{bubbles:true}));};
  click('.tb-tile[data-exam="mbb"]');click('.tb-setpick [data-set="3"]');click('[data-mode="full"]');await settle();assert.equal(order.length,175);
  let expected=0;for(const [i,q] of batch.entries()){const index=order.indexOf(q.qid);assert.ok(index>=0);click('[data-goto="'+index+'"]');assert.equal(host.querySelector('.tb-stem').dataset.questionId,q.qid);const selected=(i+rotation)%4;click('[data-opt="'+selected+'"]');if(selected===keys[i])expected++;}
  click('[data-goto="174"]');click('[data-submit]');await settle();assert.ok(host.querySelector('.tb-resverd').textContent.includes(expected+' of 175 correctly'));
  click('[data-open-review="all"]');for(const [i,q] of batch.entries()){click('[data-review-goto="'+order.indexOf(q.qid)+'"]');const card=host.querySelector('.tb-review-card');assert.equal(card.dataset.questionId,q.qid);assert.equal(card.dataset.reviewStatus,(i+rotation)%4===keys[i]?'correct':'incorrect');assert.equal(card.querySelector('.tb-explanation-copy').textContent.trim(),q.why);assert.ok(card.textContent.includes(q.optionRationales[q.answer]));}
  assert.deepEqual(errors,[]);
 }finally{observers.forEach(observer=>observer.disconnect());w.close();}
});

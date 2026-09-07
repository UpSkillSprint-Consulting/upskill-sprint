'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(75,100);
const keys=[3, 1, 1, 0, 2, 0, 3, 3, 3, 1, 1, 0, 1, 0, 0, 1, 3, 1, 3, 0, 0, 1, 1, 3, 0],ids=["mbb:set-3:d3-046", "mbb:set-3:d3-047", "mbb:set-3:d3-048", "mbb:set-3:d3-049", "mbb:set-3:d3-050", "mbb:set-3:d4-001", "mbb:set-3:d4-002", "mbb:set-3:d4-003", "mbb:set-3:d4-004", "mbb:set-3:d4-005", "mbb:set-3:d4-006", "mbb:set-3:d4-007", "mbb:set-3:d4-008", "mbb:set-3:d4-009", "mbb:set-3:d4-010", "mbb:set-3:d4-011", "mbb:set-3:d4-012", "mbb:set-3:d4-013", "mbb:set-3:d4-014", "mbb:set-3:d4-015", "mbb:set-3:d5-001", "mbb:set-3:d5-002", "mbb:set-3:d5-003", "mbb:set-3:d5-004", "mbb:set-3:d5-005"];
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 4 Q${i+76}: identity, reviewed key, independent case and all-choice feedback`,()=>{
 assert.equal(q.qid,ids[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,i<5?'mbb-portfolio':i<20?'mbb-training':'mbb-coaching');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);
 assert.ok(q.optionRationales.every(s=>s.length>40));assert.equal(q.optionRationales.filter(s=>s.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));
 assert.ok(q.stem.length>180);assert.ok(q.why.length>250);assert.ok(q.trap.length>80);assert.ok(q.auditSources.every(s=>s.title&&s.url&&s.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/D[1-6]-[0-9]|elsewhere in this bank|across this entire domain|full-subdomain capstone/);
 const lengths=q.options.map(s=>s.split(/\s+/).length),other=lengths.filter((_,j)=>j!==q.answer).sort((a,b)=>a-b);assert.ok(lengths[q.answer]/other[1]<1.6);
});
test('Batch 4 independently byte-locks all Q1–75 and Q126–175 plus all identities',()=>{
 const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[75])),'8eba5c0654013cbc23f17a532cef4553de701fe0b07d02a73247cfbdb05225a0');assert.equal(sha(source.slice(starts[125])),'7c27818031175f62f0e580fb4160760925a681a3f079751cb0f5aadd5f2475dd');assert.equal(new Set(bank.map(q=>q.qid)).size,175);
});
test('Q77 derives cash outlays and opportunity-inclusive economic cost from the actual stem',()=>{
 const a=[...batch[1].stem.matchAll(/\$([0-9,]+)/g)].map(m=>Number(m[1].replace(/,/g,'')));assert.deepEqual(a,[350000,40000,15000,20000,60000]);
 const cash=a.slice(0,4).reduce((s,v)=>s+v,0),economic=cash+a[4];assert.equal(cash,425000);assert.equal(economic,485000);
 assert.match(batch[1].options[keys[1]],/485,000.*425,000/);assert.match(batch[1].stem,/after avoided variable costs/);assert.match(batch[1].why,/not lifetime.*NPV/);
});
test('Q86 retains each original percentage and prevents causal or proportional-curriculum inference',()=>{
 const rows=batch[10].chart.rows;assert.deepEqual(rows.map(r=>parseFloat(r[1])),[90,10,0]);assert.deepEqual(rows.map(r=>parseFloat(r[2])),[15,70,15]);
 for(const j of [1,2])assert.equal(rows.reduce((s,r)=>s+parseFloat(r[j]),0),100);assert.match(batch[10].stem,/not experimental proof/);assert.match(batch[10].why,/does not imply that 70%/);
});
test('Both original visual items remain complete accessible tables, not interactive simulations',()=>{
 assert.deepEqual(batch.filter(q=>q.chart).map(q=>q.qid),[batch[10].qid,batch[17].qid]);
 for(const q of batch.filter(q=>q.chart)){assert.equal(q.chart.type,'data-table');assert.ok(q.chart.title&&q.chart.altText);assert.ok(q.chart.rows.every(r=>r.length===q.chart.columns.length));assert.ok(!q.chart.whatIf);}
 assert.equal(batch[17].chart.rows.length,4);assert.match(batch[17].why,/not itself prove a causal sequence/);
});
test('Causal, prerequisite, financial and champion-authority corrections remain explicit',()=>{
 assert.match(batch[4].why,/not identical use of every metric/);assert.match(batch[7].why,/not establish overconfidence/);assert.match(batch[11].why,/does not universally require/);
 assert.match(batch[13].stem,/proficiency varies/);assert.match(batch[14].why,/does not isolate the cause/);assert.match(batch[16].stem,/repeated time slots/);
 assert.match(batch[18].stem,/randomly assigned/);assert.match(batch[18].why,/not only successful graduates/);assert.match(batch[19].why,/does not establish which cause/);
 assert.match(batch[21].why,/not attendance itself/);assert.match(batch[22].why,/current scope error/);assert.match(batch[24].why,/Past spending is sunk/);
});
test('Exact-id renderer scope, escaping, mobile table guidance and hidden report form',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch4-ui.js'),c);const ui=c.window.__MBBSet3Batch4UI;
 assert.ok(bank.every((q,i)=>ui.isQuestion(q)===(i>=75&&i<100)));assert.equal(ui.isQuestion({qid:'cssbb:set-3:d4-006'}),false);
 for(const q of batch){const h=ui.render(q,false);assert.ok(!h.includes(q.optionRationales[q.answer]));assert.doesNotMatch(h,/NaN|undefined/);}
 assert.match(ui.render({...batch[0],stem:'<img onerror="bad">'},false),/&lt;img/);
 const t=ui.render(batch[10],false);assert.match(t,/<caption>/);assert.match(t,/scope="col"/);assert.match(t,/scope="row"/);assert.match(t,/tabindex="0"/);assert.match(t,/Scroll or swipe/);
 assert.ok(read('test-bank-mbb-set3-batch4-ui.js').includes('.tb-report-box[hidden]{display:none!important}'));
});
// Functional grading regression uses the real full-exam and review handlers in JSDOM.
// It is not a substitute for Chromium/WebKit screenshot and accessibility validation.
for(let rotation=0;rotation<4;rotation++)test(`Batch 4 every answer position grades through the actual player (rotation ${rotation})`,async()=>{
 const {JSDOM,VirtualConsole}=require('jsdom');const {installDurableLearning}=require('./helpers/test-bank-durable-learning');
 let html=read('test-bank.html');for(const f of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-set3.js'])html=html.replace('<script src="/'+f+'"></script>','<script>'+read(f)+'</script>');
 const observers=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};const Native=w.MutationObserver;w.MutationObserver=class extends Native{constructor(callback){super(callback);observers.push(this);}};}}),w=dom.window;
 try{
  await new Promise(r=>w.addEventListener('load',r));await installDurableLearning(w);w.eval(read('test-bank-mbb-set3-batch4-ui.js'));w.eval(read('test-bank-feedback-loop.js'));
  const settle=()=>new Promise(r=>w.setTimeout(r,60));await settle();let order=[];const original=w.__TBLearning.startSession;w.__TBLearning.startSession=function(c){order=c.questions.map(q=>q.qid);return original.call(this,c);};
  const host=w.document.getElementById('tb-overview'),click=s=>{const e=typeof s==='string'?w.document.querySelector(s):s;assert.ok(e,'control '+s);e.dispatchEvent(new w.Event('click',{bubbles:true}));};
  click('.tb-tile[data-exam="mbb"]');click('.tb-setpick [data-set="3"]');click('[data-mode="full"]');await settle();assert.equal(order.length,175);
  let expected=0;for(const [i,q] of batch.entries()){const index=order.indexOf(q.qid);assert.ok(index>=0);click('[data-goto="'+index+'"]');assert.equal(host.querySelector('.tb-stem').dataset.questionId,q.qid);const selected=(i+rotation)%4;click('[data-opt="'+selected+'"]');if(selected===keys[i])expected++;}
  click('[data-goto="174"]');click('[data-submit]');await settle();assert.ok(host.querySelector('.tb-resverd').textContent.includes(expected+' of 175 correctly'));
  click('[data-open-review="all"]');for(const [i,q] of batch.entries()){click('[data-review-goto="'+order.indexOf(q.qid)+'"]');const card=host.querySelector('.tb-review-card');assert.equal(card.dataset.questionId,q.qid);assert.equal(card.dataset.reviewStatus,(i+rotation)%4===keys[i]?'correct':'incorrect');assert.equal(card.querySelector('.tb-explanation-copy').textContent.trim(),q.why);assert.ok(card.textContent.includes(q.optionRationales[q.answer]));}
  assert.deepEqual(errors,[]);
 }finally{observers.forEach(observer=>observer.disconnect());w.close();}
});

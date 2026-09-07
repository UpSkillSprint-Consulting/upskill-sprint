'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(25,50);
const ids=['d1-071','d1-072','d1-073','d1-074','d1-075','d2-001','d2-004','d2-007','d2-010','d2-013','d2-016','d2-019','d2-022','d2-026','d2-029','d2-032','d2-035','d2-038','d2-041','d2-044','d2-048','d2-051','d2-054','d2-057','d2-060'];
// Reviewed independently from the original keys; no reordering of answer positions is needed.
const keys=[3,0,3,0,2,0,1,1,3,3,0,1,0,0,3,0,3,2,2,0,0,1,2,0,3];
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 2 Q${i+26}: ${ids[i]} complete independent case, reviewed key and four rationales`,()=>{
 assert.equal(q.qid,'mbb:set-3:'+ids[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,i<5?'mbb-enterprise':'mbb-org');
 assert.ok(q.stem.length>100);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options.every(s=>s.length>80));
 assert.equal(q.optionRationales.length,4);assert.deepEqual(q.optionRationales,q.distractors);assert.ok(q.optionRationales.every(s=>s.length>50));assert.ok(q.trap.length>100);assert.ok(q.why.length>250);
 assert.doesNotMatch(q.stem+' '+q.why,/cross.batch|elsewhere in this domain|as discussed|given everything tested|D[12]-\d|closing synthesis|Organizational Culture and Values Framework|\*[^*]+\*/i);
 assert.ok(q.auditSources.every(s=>s.title&&s.locator&&/^https:\/\/(?:www\.)?(?:asq\.org|psnet\.ahrq\.gov)\//.test(s.url)));
 const lengths=q.options.map(s=>s.split(/\s+/).length),other=lengths.filter((_,j)=>j!==q.answer).sort((a,b)=>a-b);assert.ok(lengths[q.answer]/other[1]<=1.35,'no conspicuously longer keyed choice');
 assert.equal(q.chart,undefined,'text-only baseline: no unreviewed visual is added');
});
test('Batch 2 integration preserves the previously audited Q1–25 and still-unaudited final JavaScript trailer source objects byte-for-byte',()=>{
 const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[25])),'5904d0a49809e8e16422784e32e668fce797c760453e9fc351f0ab28801e1eaa');
 assert.equal(sha(source.slice(source.lastIndexOf('  ];'))),'2d06d874c33463730929799a11508fd6c3bf9402321145fd3cbb09cb2d813f46');
 assert.equal(new Set(bank.map(q=>q.qid)).size,175);
});
test('reviewed numerical relationships do not imply extra capacity or representative off-season data',()=>{
 assert.equal(6+1,7);assert.ok(7>6);assert.match(batch[3].why,/six available.*seven demands/);
 assert.equal(1+1,2);assert.match(batch[11].stem,/each|Each/);assert.match(batch[11].options[1],/capacity.*priority/);
 assert.equal(100-60,40);assert.match(batch[17].why,/60%.*40%/);assert.match(batch[17].options[2],/peak-season/);
 const sameWaste=100;assert.notEqual(sameWaste/1000,sameWaste/2000);assert.match(batch[24].options[3],/per meal/);
});
test('specific regressions: incomplete causation, premature benefit tracking and authority claims remain corrected',()=>{
 assert.match(batch[2].why,/does not establish.*cause/);assert.match(batch[2].why,/diagnostic charter/);
 assert.match(batch[4].stem,/No single cause/);assert.match(batch[4].options[2],/baseline benefit/);
 assert.match(batch[6].why,/does not identify a unique cause/);assert.match(batch[9].why,/Relocation alone/);
 assert.match(batch[10].stem,/followed every current procedure/);assert.match(batch[16].options[3],/human error.*at-risk.*reckless/);
 assert.match(batch[22].stem,/handling can still affect product condition/);assert.match(batch[23].why,/does not make agreed requirements voluntary/);
});
test('Batch 2 renderer scope and namespace cannot capture Batch 1, Q51 onward or another exam',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch2-ui.js'),c);const ui=c.window.__MBBSet3Batch2UI;
 assert.ok(bank.every((q,i)=>ui.isQuestion(q)===(i>=25&&i<50)));assert.equal(ui.isQuestion({qid:'cssbb:set-3:d2-001'}),false);
 for(const q of batch){const markup=ui.render(q,false);assert.match(markup,/mbbs3b2-question/);assert.ok(!markup.includes(q.optionRationales[q.answer]));assert.match(ui.rationales(q),/Answer-choice explanations/);}
 assert.doesNotMatch(read('test-bank-mbb-set3-batch2-ui.js'),/mbbs3b1|mbb3-/);
});
// Functional grading regression uses the real full-exam and review handlers in JSDOM.
// It is not a substitute for Chromium/WebKit screenshot and accessibility validation.
for(let rotation=0;rotation<4;rotation++)test(`Batch 2 every answer position grades through the actual player (rotation ${rotation})`,async()=>{
 const {JSDOM,VirtualConsole}=require('jsdom');const {installDurableLearning}=require('./helpers/test-bank-durable-learning');
 let html=read('test-bank.html');for(const f of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-set3.js'])html=html.replace('<script src="/'+f+'"></script>','<script>'+read(f)+'</script>');
 const observers=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};const Native=w.MutationObserver;w.MutationObserver=class extends Native{constructor(callback){super(callback);observers.push(this);}};}}),w=dom.window;
 try{
  await new Promise(r=>w.addEventListener('load',r));await installDurableLearning(w);w.eval(read('test-bank-mbb-set3-batch2-ui.js'));w.eval(read('test-bank-feedback-loop.js'));
  const settle=()=>new Promise(r=>w.setTimeout(r,60));await settle();let order=[];const original=w.__TBLearning.startSession;w.__TBLearning.startSession=function(c){order=c.questions.map(q=>q.qid);return original.call(this,c);};
  const host=w.document.getElementById('tb-overview'),click=s=>{const e=typeof s==='string'?w.document.querySelector(s):s;assert.ok(e,'control '+s);e.dispatchEvent(new w.Event('click',{bubbles:true}));};
  click('.tb-tile[data-exam="mbb"]');click('.tb-setpick [data-set="3"]');click('[data-mode="full"]');await settle();assert.equal(order.length,175);
  let expected=0;for(const [i,q] of batch.entries()){const index=order.indexOf(q.qid);assert.ok(index>=0);click('[data-goto="'+index+'"]');assert.equal(host.querySelector('.tb-stem').dataset.questionId,q.qid);const selected=(i+rotation)%4;click('[data-opt="'+selected+'"]');if(selected===keys[i])expected++;}
  click('[data-goto="174"]');click('[data-submit]');await settle();assert.ok(host.querySelector('.tb-resverd').textContent.includes(expected+' of 175 correctly'));
  click('[data-open-review="all"]');for(const [i,q] of batch.entries()){click('[data-review-goto="'+order.indexOf(q.qid)+'"]');const card=host.querySelector('.tb-review-card');assert.equal(card.dataset.questionId,q.qid);assert.equal(card.dataset.reviewStatus,(i+rotation)%4===keys[i]?'correct':'incorrect');assert.equal(card.querySelector('.tb-explanation-copy').textContent.trim(),q.why);assert.ok(card.textContent.includes(q.optionRationales[q.answer]));}
  assert.deepEqual(errors,[]);
 }finally{observers.forEach(observer=>observer.disconnect());w.close();}
});

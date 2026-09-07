'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(150,175);
const keys=[0, 3, 1, 3, 0, 2, 3, 1, 3, 1, 2, 3, 0, 0, 3, 3, 3, 2, 0, 1, 3, 2, 0, 2, 2],ids=["mbb:set-3:d6-041", "mbb:set-3:d6-042", "mbb:set-3:d6-043", "mbb:set-3:d6-044", "mbb:set-3:d6-045", "mbb:set-3:d6-046", "mbb:set-3:d6-047", "mbb:set-3:d6-048", "mbb:set-3:d6-049", "mbb:set-3:d6-050", "mbb:set-3:d6-051", "mbb:set-3:d6-052", "mbb:set-3:d6-053", "mbb:set-3:d6-054", "mbb:set-3:d6-055", "mbb:set-3:d6-056", "mbb:set-3:d6-057", "mbb:set-3:d6-058", "mbb:set-3:d6-059", "mbb:set-3:d6-060", "mbb:set-3:d6-061", "mbb:set-3:d6-062", "mbb:set-3:d6-063", "mbb:set-3:d6-064", "mbb:set-3:d6-065"],sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 7 Q${i+151}: reviewed identity, unique key and complete individual feedback`,()=>{
 assert.equal(q.qid,ids[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,'mbb-analytics');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);
 assert.equal(q.optionRationales.filter(r=>r.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));assert.ok(q.optionRationales.every(r=>r.length>45));
 assert.ok(q.stem.length>180);assert.ok(q.why.length>250);assert.ok(q.trap.length>80);assert.ok(q.auditSources.every(r=>r.title&&r.url&&r.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/D[1-6]-[0-9]{2}|original assignment|elsewhere in this bank|capstone question|published question/);
});
test('Batch 7 independently preserves every Q1–150 byte, all IDs/keys and the closing JavaScript',()=>{
 const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[150])),'67b24b988802ba5073c9db4ca41df48fda21664a0335d24694a8817a28523447');assert.equal(sha(source.slice(source.lastIndexOf('  ];'))),'2d06d874c33463730929799a11508fd6c3bf9402321145fd3cbb09cb2d813f46');
 const p=JSON.parse(read('docs/audits/mbb-set3-batch07/preservation.json'));assert.deepEqual(bank.map(q=>q.qid),p.ids);assert.deepEqual(bank.map(q=>q.answer),p.keys);assert.equal(new Set(p.ids).size,175);
});
test('Q151 retains all observed corners and describes conditional effects without inventing uncertainty',()=>{
 const rows=batch[0].chart.rows;const y=rows.map(r=>Number(r[3]));assert.deepEqual(y,[42,51,58,64,55,67,71,89]);assert.equal(y[1]-y[0],9);assert.equal(y[7]-y[6],18);assert.equal(Math.max(...y),89);
 assert.match(batch[0].why,/not a significance result/);assert.match(batch[0].chart.columns[3],/nm\/min/);
});
test('Q152 full-factorial counts distinguish factor levels, combinations and replication',()=>{
 assert.equal(5**3,125);assert.equal(2**3,8);assert.equal(5**3/2**3,15.625);assert.equal(5**3-2**3,117);
 assert.match(batch[1].stem,/30 independent trials/);assert.match(batch[1].options[3],/125-setting/);assert.match(batch[1].why,/No uniquely optimal/);
});
test('Q153/Q162 distinguish initial semantic standardization from governed variant changes',()=>{
 assert.match(batch[2].stem,/original customer promise/);assert.match(batch[2].why,/eligible denominator/);assert.match(batch[11].stem,/approved canonical definition/);assert.match(batch[11].why,/changed denominator/);
});
test('Q154 distinguishes imported-row denominator and corrected-total overstatement',()=>{
 assert.ok(Math.abs(.08/.92-.08695652173913043)<1e-12);assert.match(batch[3].why,/0.08\/0.92/);assert.match(batch[3].stem,/legitimate separate events/);
});
test('Q155/Q156 retain fitness for decision, common risk horizon and feasible preventable benefit',()=>{
 assert.match(batch[4].why,/does not establish.*current/);assert.match(batch[4].options[0],/restrict decisions/);
 assert.match(batch[5].stem,/additive and do not interact/);assert.match(batch[5].stem,/next-week horizon/);assert.match(batch[5].why,/fraction preventable/);
});
test('Q157 prevents full-data supervised encoding and specifies unseen-category handling',()=>{
 assert.match(batch[6].stem,/before splitting/);assert.match(batch[6].why,/out-of-fold/);assert.match(batch[6].options[3],/unseen categories/);
});
test('Q158 does not invent legal retention periods or conflate archives and anonymization',()=>{
 assert.match(batch[7].stem,/No jurisdiction-specific/);assert.match(batch[7].why,/not automatically unlawful/);assert.match(batch[7].why,/does not necessarily anonymize/);
});
test('Q159 keeps correct pooled-unit ratios and mix limitations distinct',()=>{
 assert.match(batch[8].why,/total first-pass units divided by total first-inspected units/);assert.match(batch[8].why,/not automatically rolled-throughput/);
 const pooled=(90+50)/(100+1000),average=(.9+.05)/2;assert.notEqual(pooled,average);
});
test('Q160 reconstructs the actual join and detects offsetting duplicates and missing events',()=>{
 const left=[['E1',100],['E2',200],['E3',300]],right=['E1','E1','E3'];
 const joined=left.flatMap(row=>right.filter(id=>id===row[0]).map(()=>row));assert.equal(joined.length,left.length);assert.deepEqual(joined.map(r=>r[0]),['E1','E1','E3']);assert.equal(joined.reduce((s,r)=>s+r[1],0),500);assert.equal(left.reduce((s,r)=>s+r[1],0),600);
 assert.match(batch[9].why,/LEFT JOIN/);assert.match(batch[9].why,/still multiplies/);
});
test('Q163 depicts the specific unfinished roof, not an unrelated generic matrix',()=>{
 const c=batch[12].chart;assert.equal(c.type,'house-of-quality');assert.equal(c.evidence.rows[0][2],'Not assessed');assert.equal(c.evidence.rows.length,4);assert.match(batch[12].why,/not automatically measured Pearson/);
});
test('Q164/Q165 distinguish biased service metrics and requirement verification from intended-use validation',()=>{
 assert.match(batch[13].why,/average among successful cases/);assert.match(batch[14].why,/test, analysis, inspection or demonstration/);assert.match(batch[14].why,/Validation asks/);
});
test('Q166 independently calculates the weighted score while preserving the separate safety gate',()=>{
 const rows=batch[15].chart.rows;assert.deepEqual(rows.map(r=>parseFloat(String(r[2]).replace('−','-'))),[2,2,1,-1]);
 const w=rows.map(r=>Number(r[0].match(/(\d+)%/)[1])/100);assert.equal(w.reduce((a,b)=>a+b,0),1);const score=w.reduce((s,v,i)=>s+v*[2,2,1,-1][i],0);assert.ok(Math.abs(score-1.05)<1e-12);
 assert.match(batch[15].stem,/not the classical/);assert.match(batch[15].why,/does not itself prove failure/);
});
test('Q168 derives joint probability from conditional evidence, not the invalid independent product',()=>{
 const rows=batch[17].chart.rows,p=rows.map(r=>Number(r[1]));assert.deepEqual(p,[.02,.03,.10]);const joint=p[0]*p[2];assert.equal(joint,.002);assert.ok(Math.abs(p[0]+p[1]-joint-.048)<1e-12);assert.notEqual(joint,p[0]*p[1]);
 assert.match(batch[17].options[2],/0.0020/);assert.match(batch[17].why,/does not require identical failure onset/);assert.equal(rows.length,3);
});
test('Q169/Q170 distinguish control-by-noise selection and tolerances from measured variation',()=>{
 assert.match(batch[18].options[0],/Cross candidate settings/);assert.match(batch[19].why,/do not uniquely determine/);assert.match(batch[19].why,/not an observed production/);
});
test('Q171 enumerates all 32 permitted extremes and proves cheapest-component-only infeasibility',()=>{
 const limits=[.02,.05,.10,.10,.05],sums=Array.from({length:32},(_,k)=>limits.reduce((s,t,i)=>s+((k>>i)&1?1:-1)*t,0));
 assert.ok(Math.abs(Math.max(...sums)-.32)<1e-12);assert.ok(Math.abs(Math.min(...sums)+.32)<1e-12);assert.ok(Math.abs(limits.slice(1).reduce((a,b)=>a+b,0)-.30)<1e-12);assert.ok(Math.max(...sums)>.25);
 assert.ok(Math.abs(Math.sqrt(limits.reduce((s,v)=>s+v*v,0))-.15937377450509227)<1e-12);assert.match(batch[20].stem,/No statistical tolerance alternative/i);assert.match(batch[20].why,/do not prove a unique cost optimum/);
});
test('Q172/Q174 retain acceleration validity and configuration-change impact controls',()=>{
 assert.match(batch[21].why,/defensible stress-life relationship/);assert.match(batch[23].why,/change-impact review/);assert.match(batch[23].why,/universal linear sequence/);
});
test('All five visual questions retain exact tables, scope and safe escaped rendering',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch7-ui.js'),c);const ui=c.window.__MBBSet3Batch7UI;
 assert.ok(bank.every((q,i)=>ui.isQuestion(q)===(i>=150)));assert.equal(ui.isQuestion({qid:'cssbb:set-3:d6-041'}),false);
 assert.deepEqual(batch.flatMap((q,i)=>q.chart?[151+i]:[]),[151,163,166,168,171]);
 for(const q of batch){const h=ui.render(q,false);assert.doesNotMatch(h,/NaN|undefined/);assert.ok(!h.includes(q.optionRationales[q.answer]));if(q.chart){const t=q.chart.type==='data-table'?q.chart:q.chart.evidence;assert.ok(t.rows.every(r=>r.length===t.columns.length));assert.match(h,/<caption>/);assert.match(h,/scope="row"/);assert.match(h,/tabindex="0"/);}}
 assert.match(ui.render({...batch[0],stem:'<img onerror="bad">'},false),/&lt;img/);assert.match(ui.render(batch[12],false),/<svg/);
});
test('Answer choices have no systematic all-longest-key cue and duplicate-normalized options',()=>{
 const longest=batch.filter(q=>q.options[q.answer].split(/\s+/).length>Math.max(...q.options.filter((_,i)=>i!==q.answer).map(s=>s.split(/\s+/).length)));
 assert.ok(longest.length<=14,`uniquely longest correct options: ${longest.length}`);
 for(const q of batch)assert.equal(new Set(q.options.map(s=>s.toLowerCase().replace(/[^a-z0-9]/g,''))).size,4);
});
for(let rotation=0;rotation<4;rotation++)test(`Batch 7 every answer position grades through the actual player (rotation ${rotation})`,async()=>{
 const {JSDOM,VirtualConsole}=require('jsdom');const {installDurableLearning}=require('./helpers/test-bank-durable-learning');
 let html=read('test-bank.html');for(const f of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-set3.js'])html=html.replace('<script src="/'+f+'"></script>','<script>'+read(f)+'</script>');
 const observers=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};const Native=w.MutationObserver;w.MutationObserver=class extends Native{constructor(callback){super(callback);observers.push(this);}};}}),w=dom.window;
 try{
  await new Promise(r=>w.addEventListener('load',r));await installDurableLearning(w);w.eval(read('test-bank-mbb-set3-batch7-ui.js'));w.eval(read('test-bank-feedback-loop.js'));
  const settle=()=>new Promise(r=>w.setTimeout(r,60));await settle();let order=[];const original=w.__TBLearning.startSession;w.__TBLearning.startSession=function(c){order=c.questions.map(q=>q.qid);return original.call(this,c);};
  const host=w.document.getElementById('tb-overview'),click=s=>{const e=typeof s==='string'?w.document.querySelector(s):s;assert.ok(e,'control '+s);e.dispatchEvent(new w.Event('click',{bubbles:true}));};
  click('.tb-tile[data-exam="mbb"]');click('.tb-setpick [data-set="3"]');click('[data-mode="full"]');await settle();assert.equal(order.length,175);
  let expected=0;for(const [i,q] of batch.entries()){const index=order.indexOf(q.qid);assert.ok(index>=0);click('[data-goto="'+index+'"]');assert.equal(host.querySelector('.tb-stem').dataset.questionId,q.qid);const selected=(i+rotation)%4;click('[data-opt="'+selected+'"]');if(selected===keys[i])expected++;}
  click('[data-goto="174"]');click('[data-submit]');await settle();assert.ok(host.querySelector('.tb-resverd').textContent.includes(expected+' of 175 correctly'));
  click('[data-open-review="all"]');for(const [i,q] of batch.entries()){click('[data-review-goto="'+order.indexOf(q.qid)+'"]');const card=host.querySelector('.tb-review-card');assert.equal(card.dataset.questionId,q.qid);assert.equal(card.dataset.reviewStatus,(i+rotation)%4===keys[i]?'correct':'incorrect');assert.equal(card.querySelector('.tb-explanation-copy').textContent.trim(),q.why);assert.ok(card.textContent.includes(q.optionRationales[q.answer]));}
  assert.deepEqual(errors,[]);
 }finally{observers.forEach(observer=>observer.disconnect());w.close();}
});

test('Q168 explicitly evaluates both unavailable states at the same demand rather than at different mission times',()=>{assert.match(batch[17].stem,/at that same demand/);assert.match(batch[17].chart.altText,/same specified mission demand/);});

test('Every Batch 7 review gets its actual item reference; unsafe or out-of-scope links cannot be injected',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch7-ui.js'),c);const ui=c.window.__MBBSet3Batch7UI;
 for(const q of batch){const h=ui.referenceLink(q);assert.match(h,/Reference: /);assert.ok(h.includes(q.auditSources[1].url.replace(/&/g,'&amp;')));assert.doesNotMatch(h,/Study: Design of Experiments/);}
 assert.equal(ui.referenceLink(bank[0]),'');assert.doesNotMatch(ui.referenceLink({...batch[0],auditSources:[{}, {title:'bad',url:'javascript:alert(1)'}]}),/<a/);
 assert.doesNotMatch(ui.referenceLink({...batch[0],auditSources:[{}, {title:'bad',url:'https://www.nasa.gov.attacker.example/'}]}),/<a/);
 assert.match(ui.referenceLink({...batch[0],auditSources:[{}, {title:'<img onerror=bad>',url:'https://www.nasa.gov/reference/'}]}),/&lt;img/);
});

test('Rightmost numeric columns use tabular right alignment and rendered range-visibility checks',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch7-ui.js'),c);const ui=c.window.__MBBSet3Batch7UI;
 for(const index of [0,15,17,20]){const q=batch[index],h=ui.render(q,true);assert.ok((h.match(/class="mbbs3b7-number"/g)||[]).length>=q.chart.rows.length+1);}
 assert.match(read('test-bank-mbb-set3-batch7-ui.js'),/text-align:right;font-variant-numeric:tabular-nums/);
 assert.match(read('scripts/audit-mbb-set3-batch7.mjs'),/numericVisibility.every\(v=>v.inside\)/);
});

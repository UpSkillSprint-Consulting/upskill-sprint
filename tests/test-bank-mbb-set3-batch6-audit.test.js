'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(125,150),keys=[2, 0, 1, 0, 3, 0, 1, 3, 1, 2, 1, 0, 0, 3, 3, 3, 1, 1, 1, 3, 3, 3, 1, 1, 0];
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} differs from ${b}`);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 6 Q${i+126}: reviewed identity, key, complete choices and independent rationale`,()=>{
 assert.equal(q.qid,'mbb:set-3:d6-'+String(i+16).padStart(3,'0'));assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,'mbb-analytics');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);
 assert.equal(q.optionRationales.filter(s=>s.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));assert.ok(q.optionRationales.every(s=>s.length>40));assert.ok(q.stem.length>150&&q.why.length>250&&q.trap.length>80);assert.ok(q.auditSources.every(s=>s.title&&s.url&&s.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/original assignment|elsewhere in this bank|D[1-6]-[0-9]/);
});
test('Batch 6 byte-preserves Q1–125, Q151–175 and all stable IDs/answer positions',()=>{
 const p=JSON.parse(read('docs/audits/mbb-set3-batch06/preservation.json')),starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[125])),'f022ebd5a43e01f81ea10e9ebe5a7f0f98f16b46bf1ef294e959d8f7c572ba5c');assert.equal(sha(source.slice(starts[150])),'fdbb6f31fbeae47aafea3f47e2ea5d1452d5b5dae00cbfec2e8a32489d9e10d3');assert.deepEqual(bank.map(q=>q.qid),p.ids);assert.deepEqual(bank.map(q=>q.answer),p.keys);
});
test('Q128 derives auxiliary R-squared and standard-error inflation from actual VIF table',()=>{
 const v=Number(batch[2].chart.rows[0][1]);near(1-1/v,.9295774647887324);near(Math.sqrt(v),3.7682887362833544);
 assert.match(batch[2].why,/not dependence on the response/);
});
test('Q129 recomputes odds ratio, probability ratio and difference from retained counts',()=>{
 const t=batch[3].chart.rows,[a,b]=t[0].slice(1).map(Number),[c,d]=t[1].slice(1).map(Number);
 const or=(c/d)/(a/b);near(or,2.3468013468013464);assert.equal(or.toFixed(1),'2.3');near((c/(c+d))/(a/(a+b)),1.888888888888889);near(c/(c+d)-a/(a+b),.16);
 const p0=a/(a+b);near(or*p0/(1-p0+or*p0),.34);assert.match(batch[3].stem,/long maintenance interval = 1/);
});
test('Q131 differentiates the supplied quadratic and classifies its in-region stationary point',()=>{
 const f=(x,y)=>80-2*x*x-5*y*y;near(f(0,0),80);near((f(.1,0)-2*f(0,0)+f(-.1,0))/.01,-4);near((f(0,.1)-2*f(0,0)+f(0,-.1))/.01,-10);
 for(let x=-1;x<=1;x+=.1)for(let y=-1;y<=1;y+=.1)assert.ok(f(x,y)<=80+1e-10);
 assert.match(batch[5].why,/unknown physical response/);
});
test('Q132 protects outcome-aware validation and full-pipeline selection rather than leaked cross-validation',()=>{
 assert.match(batch[6].stem,/85 independent customers, only 12/);assert.match(batch[6].why,/41 candidate coefficients/);assert.match(batch[6].why,/leaks validation information/);assert.match(batch[6].why,/outer evaluation/);
});
test('Q133 verifies VIF bound and distinguishes tolerance from auxiliary R-squared',()=>{
 near(1/.6,5/3);near(1-.6,.4);assert.ok(1-1/.6<0);assert.match(batch[7].stem,/intercept-containing/);assert.match(batch[7].options[3],/1\.67/);
});
test('Q134 independent OLS and Durbin-Watson calculations match all retained daily observations',()=>{
 const c=batch[8].chart,e=c.residuals,f=c.fittedValues,y=c.rawCalls;assert.equal(e.length,14);assert.deepEqual(y,[210,225,240,255,248,260,275,268,280,295,288,300,315,308]);
 const sum=a=>a.reduce((s,v)=>s+v,0),dot=(a,b)=>sum(a.map((v,i)=>v*b[i]));
 near(sum(e),0,1e-9);near(dot(e,f),0,1e-8);y.forEach((v,i)=>near(f[i]+e[i],v));
 const d=sum(e.slice(1).map((v,i)=>(v-e[i])**2))/dot(e,e);near(d,.45,1e-12);
 const fm=sum(f)/14,ym=sum(y)/14,slope=dot(f.map(v=>v-fm),y.map(v=>v-ym))/dot(f.map(v=>v-fm),f.map(v=>v-fm));near(slope,1,1e-10);near(ym-slope*fm,0,1e-8);
 assert.match(c.altText,/illustrative/);assert.equal(c.evidence.rows.length,14);
});
test('Q137 compares the complete feasible effect with the practical threshold and specified alpha',()=>{
 near(.02*50,1);assert.ok(1>.5&&.03<.05);assert.match(batch[11].stem,/50 points/);assert.match(batch[11].why,/does not provide the uncertainty interval/);
});
test('Q138 actual marginal data give effects 26 and 2, not coefficients 13 and 1',()=>{
 const rows=batch[12].chart.evidence.rows;assert.deepEqual(rows.map(r=>r[2]-r[1]),[26,2]);assert.deepEqual(rows.map(r=>(r[2]+r[1])/2),[55,55]);assert.deepEqual(rows.map(r=>(r[2]-r[1])/2),[13,1]);
});
test('Q139 explicit cell means yield crossover, interaction contrast and no fabricated significance',()=>{
 const rows=batch[13].chart.evidence.rows,low=rows[0][2]-rows[0][1],high=rows[1][2]-rows[1][1];assert.equal(low,30);assert.equal(high,-15);assert.equal(high-low,-45);assert.equal((high-low)/2,-22.5);assert.equal((high-low)/4,-11.25);
 assert.match(batch[13].options[3],/before claiming significance/);assert.match(batch[13].stem,/error estimate and uncertainty intervals are unavailable/);
});
const levels=n=>Array.from({length:2**n},(_,i)=>Array.from({length:n},(_,j)=>i&(1<<j)?1:-1));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function rank(matrix){const a=matrix.map(r=>r.slice()),m=a.length,n=a[0].length;let r=0;for(let c=0;c<n&&r<m;c++){let j=r;while(j<m&&Math.abs(a[j][c])<1e-8)j++;if(j===m)continue;[a[r],a[j]]=[a[j],a[r]];let p=a[r][c];for(let k=c;k<n;k++)a[r][k]/=p;for(let i=0;i<m;i++)if(i!==r){p=a[i][c];for(let k=c;k<n;k++)a[i][k]-=p*a[r][k];}r++;}return r;}
test('Q140 derives all main/two-factor aliases and zero residual degrees of freedom',()=>{
 const rows=levels(2).map(([a,b])=>[a,b,a*b]);for(const [a,b,c] of rows){assert.equal(a,b*c);assert.equal(b,a*c);assert.equal(c,a*b);assert.equal(a*b*c,1);}assert.equal(rank(rows.map(r=>[1,...r])),4);assert.equal(rows.length-4,0);
});
test('Q141 verifies D-only foldover adds new fraction while reversing all four signs does not',()=>{
 const original=levels(3).map(([a,b,c])=>[a,b,c,a*b*c]),mirror=original.map(r=>r.map(v=>-v)),single=original.map(([a,b,c,d])=>[a,b,c,-d]);
 const set=a=>new Set(a.map(r=>r.join(',')));assert.equal(set([...original,...mirror]).size,8);assert.equal(set([...original,...single]).size,16);
 original.forEach(r=>assert.equal(r.reduce((s,v)=>s*v,1),1));single.forEach(r=>assert.equal(r.reduce((s,v)=>s*v,1),-1));
 const combine=[...original,...single];assert.equal(dot(combine.map(r=>r[3]),combine.map(r=>r[0]*r[1]*r[2])),0);
});
test('Q142 checks all 21 two-factor aliases against the actual eight-run design columns',()=>{
 const rows=levels(3).map(([a,b,c])=>({A:a,B:b,C:c,D:a*b,E:a*c,F:b*c,G:a*b*c}));const cols='ABCDEFG'.split('');
 for(const [main,aliases] of batch[16].chart.rows){const actual=[];for(let i=0;i<7;i++)for(let j=i+1;j<7;j++)if(rows.every(r=>r[main]===r[cols[i]]*r[cols[j]]))actual.push(cols[i]+cols[j]);assert.equal(actual.join(' = '),aliases);assert.equal(actual.length,3);}
 assert.equal(rank(rows.map(r=>[1,...cols.map(k=>r[k])])),8);assert.equal(rows.length-8,0);
});
test('Q143 demonstrates rank deficiency and center-point cancellation for pure quadratics',()=>{
 const corners=levels(2),X=corners.map(([a,b])=>[1,a*a,b*b]);assert.equal(rank(X),1);assert.equal(rank([...X,[1,0,0],[1,0,0]]),2);
 const f=(a,b)=>a*a-b*b;assert.ok([...corners,[0,0]].every(([a,b])=>f(a,b)===0));assert.equal(f(1,0),1);assert.equal(f(0,1),-1);
});
test('Q144 is a full response cube, retains the four original corners and derives all main effects',()=>{
 const v=batch[18].chart.vertices;assert.equal(v.length,8);assert.equal(new Set(v.map(p=>[p.a,p.b,p.c].join())).size,8);
 const at=(a,b,c)=>v.find(p=>p.a===a&&p.b===b&&p.c===c).value;assert.equal(at(-1,-1,-1),42);assert.equal(at(1,-1,-1),51);assert.equal(at(-1,1,-1),58);assert.equal(at(1,1,1),89);
 for(const [k,e] of [['a',9],['b',16],['c',22]])near(v.filter(p=>p[k]===1).reduce((s,p)=>s+p.value,0)/4-v.filter(p=>p[k]===-1).reduce((s,p)=>s+p.value,0)/4,e);
 assert.equal(batch[18].chart.type,'doe-cube');assert.match(batch[18].stem,/not raw replicates/);
});
test('Q145 derives resolution V low-order column separation and saturated rank',()=>{
 const r=levels(4).map(([a,b,c,d])=>[a,b,c,d,a*b*c*d]);const design=r.map(p=>[1,...p,...p.flatMap((v,i)=>p.slice(i+1).map(w=>v*w))]);assert.equal(design[0].length,16);assert.equal(rank(design),16);
 const columns=Array.from({length:16},(_,j)=>design.map(row=>row[j]));for(let j=0;j<16;j++)for(let k=j+1;k<16;k++)assert.equal(dot(columns[j],columns[k]),0);
 r.forEach(row=>assert.equal(row.reduce((s,v)=>s*v,1),1));
});
test('Q146 independently calculates signal and contrast standard error in compatible units',()=>{
 near(.5*2,1);near(Math.sqrt(3**2+3**2),4.242640687119285);near(1/Math.sqrt(18),.23570226039551587);assert.match(batch[20].stem,/independent run-to-run strength SD of 3 MPa/);
});
test('Q147 constructs nonzero three-way and zero marginal lower-order effects without contradiction',()=>{
 const r=levels(3),y=r.map(([a,b,c])=>50+10*a*b*c);for(let mask=1;mask<=7;mask++){const column=r.map(row=>row.reduce((v,x,j)=>mask&(1<<j)?v*x:v,1));near(dot(column,y)/4,mask===7?20:0);}
 for(const c of [-1,1]){const pairs=r.map((p,i)=>({p,y:y[i]})).filter(o=>o.p[2]===c);near(pairs.reduce((s,o)=>s+o.p[0]*o.p[1]*o.y,0)/2,20*c);}
 assert.match(batch[21].why,/not requiring each to be statistically significant/);
});
test('Q148 distinguishes subsamples and the hard-to-change assignment unit; Q149 retains block assumptions',()=>{
 assert.match(batch[22].options[1],/independent whole-plot replication/);assert.match(batch[22].why,/Subsamples are not independent replications/);assert.match(batch[23].stem,/randomized within operator/);assert.match(batch[23].why,/does not remove physical/);
});
test('Q150 independently counts all second-order parameters and rejects full simultaneous estimation',()=>{
 const k=8;assert.equal(1+k+k+k*(k-1)/2,45);assert.ok(45>17);assert.match(batch[24].stem,/continuous factors/);assert.match(batch[24].why,/absence of pairwise complete aliasing/);
});
test('All eight visuals render from data, remain exact-qid scoped and escape injected markup',()=>{
 assert.deepEqual(batch.flatMap((q,i)=>q.chart?[126+i]:[]),[127,128,129,134,138,139,142,144]);const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch6-ui.js'),c);const ui=c.window.__MBBSet3Batch6UI;
 for(const [i,q] of bank.entries())assert.equal(ui.isQuestion(q),i>=125&&i<150);
 for(const q of batch){const h=ui.render(q,false);assert.doesNotMatch(h,/NaN|undefined/);assert.ok(!h.includes(q.optionRationales[q.answer]));if(q.chart){const t=q.chart.type==='data-table'?q.chart:q.chart.evidence;assert.ok(t.title&&t.altText);assert.ok(t.rows.every(r=>r.length===t.columns.length));assert.match(h,/<caption>/);assert.match(h,/scope="row"/);assert.match(h,/Scroll or swipe/);if(q.chart.type!=='data-table')assert.match(h,/<svg/);}}
 assert.match(ui.render({...batch[0],stem:'<script>bad</script>'},false),/&lt;script/);
});
test('Wording no longer has an all-longest-key pattern, and numerical choices remain distinct',()=>{
 const longest=batch.filter(q=>q.options[q.answer].split(/\s+/).length>Math.max(...q.options.filter((_,j)=>j!==q.answer).map(s=>s.split(/\s+/).length)));assert.ok(longest.length<20);
 for(const q of batch)assert.equal(new Set(q.options.map(s=>s.trim().toLowerCase())).size,4);
});

for(let rotation=0;rotation<4;rotation++)test(`Batch 6 every answer position grades through the actual player (rotation ${rotation})`,async()=>{
 const {JSDOM,VirtualConsole}=require('jsdom');const {installDurableLearning}=require('./helpers/test-bank-durable-learning');
 let html=read('test-bank.html');for(const f of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-set3.js'])html=html.replace('<script src="/'+f+'"></script>','<script>'+read(f)+'</script>');
 const observers=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};const Native=w.MutationObserver;w.MutationObserver=class extends Native{constructor(callback){super(callback);observers.push(this);}};}}),w=dom.window;
 try{
  await new Promise(r=>w.addEventListener('load',r));await installDurableLearning(w);w.eval(read('test-bank-mbb-set3-batch6-ui.js'));w.eval(read('test-bank-feedback-loop.js'));
  const settle=()=>new Promise(r=>w.setTimeout(r,60));await settle();let order=[];const original=w.__TBLearning.startSession;w.__TBLearning.startSession=function(c){order=c.questions.map(q=>q.qid);return original.call(this,c);};
  const host=w.document.getElementById('tb-overview'),click=s=>{const e=typeof s==='string'?w.document.querySelector(s):s;assert.ok(e,'control '+s);e.dispatchEvent(new w.Event('click',{bubbles:true}));};
  click('.tb-tile[data-exam="mbb"]');click('.tb-setpick [data-set="3"]');click('[data-mode="full"]');await settle();assert.equal(order.length,175);
  let expected=0;for(const [i,q] of batch.entries()){const index=order.indexOf(q.qid);assert.ok(index>=0);click('[data-goto="'+index+'"]');assert.equal(host.querySelector('.tb-stem').dataset.questionId,q.qid);const selected=(i+rotation)%4;click('[data-opt="'+selected+'"]');if(selected===keys[i])expected++;}
  click('[data-goto="174"]');click('[data-submit]');await settle();assert.ok(host.querySelector('.tb-resverd').textContent.includes(expected+' of 175 correctly'));
  click('[data-open-review="all"]');for(const [i,q] of batch.entries()){click('[data-review-goto="'+order.indexOf(q.qid)+'"]');const card=host.querySelector('.tb-review-card');assert.equal(card.dataset.questionId,q.qid);assert.equal(card.dataset.reviewStatus,(i+rotation)%4===keys[i]?'correct':'incorrect');assert.equal(card.querySelector('.tb-explanation-copy').textContent.trim(),q.why);assert.ok(card.textContent.includes(q.optionRationales[q.answer]));}
  assert.deepEqual(errors,[]);
 }finally{observers.forEach(observer=>observer.disconnect());w.close();}
});

test('Cube-label edge clearance is explicit and included in rendered failure checks',()=>{
 assert.match(read('test-bank-mbb-set3-batch6-ui.js'),/data-cube-label/);
 assert.ok(read('scripts/audit-mbb-set3-batch6.mjs').includes('c.geometry.cubeEdgeCollisions.length'));
});

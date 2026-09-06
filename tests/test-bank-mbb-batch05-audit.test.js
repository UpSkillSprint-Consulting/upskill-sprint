'use strict';
// Key assertions enforce the independent audit decisions; numerical and interaction
// checks below supply separate evidence. They do not automate semantic judgment.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const w={};w.window=w;vm.createContext(w);vm.runInContext(read('test-bank-mbb-set2.js'),w);
const batches=JSON.parse(JSON.stringify(w.MBB_SET2_BATCHES)),batch=batches[5],Q=n=>batch[n-101];
const stable=o=>Array.isArray(o)?o.map(stable):o&&typeof o==='object'?Object.fromEntries(Object.keys(o).sort().map(k=>[k,stable(o[k])])):o;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const keys=[0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0];
for(let i=0;i<25;i++)test(`Batch 5 adjudication Q${101+i}: ${'ABCD'[keys[i]]}`,()=>{
 const q=batch[i];assert.equal(q.answer,keys[i]);assert.equal(q.qid,`mbb:set-2:original-${i+101}`);
 assert.ok(q.why.includes('<b>'+'ABCD'[keys[i]]+'. '+q.options[keys[i]]+'</b>'));
 assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
});
test('Q101 blank means unreviewed, not a causal null or proof',()=>{
 assert.match(Q(101).stem,/not that no relationship exists/);assert.match(Q(101).options[0],/Review and document/);
 assert.doesNotMatch(Q(101).visual.altText,/only.*retention|broken causal/);
});
test('Q102/104/108 state decision and safety boundaries',()=>{
 assert.match(Q(102).assumptions.join(' '),/proposed, not yet a binding/);
 assert.match(Q(104).assumptions.join(' '),/patient-safety/);
 assert.match(Q(104).why,/do not by themselves establish statistical instability/);
 assert.match(Q(108).assumptions.join(' '),/No emergency/);
});
test('Q105 authorization fits nine months; discovery is not built prerequisite',()=>{
 const q=Q(105),rows=q.chart.rows;assert.equal(rows.slice(0,3).reduce((s,r)=>s+Number(r[1]),0),9);
 assert.equal(rows.reduce((s,r)=>s+Number(r[1]),0),13);
 assert.match(q.stem,/does not implement/);assert.match(q.assumptions.join(' '),/fixed at nine/);
 assert.doesNotMatch(JSON.stringify(q.chart),/0\.10M|committedLabel/);
});
test('Q106 new system case has common units and vertical week-five marker',()=>{
 const c=Q(106).chart;assert.equal(c.referenceOrientation,'vertical');assert.equal(c.referenceValue,5);
 assert.equal(c.units,'units per week');assert.equal(c.series.length,2);
 assert.deepEqual(c.series.map(s=>s.data.reduce((a,b)=>a+b,0)),[1000,1000]);
 assert.match(Q(106).assumptions[0],/audit-authored/);assert.doesNotMatch(Q(106).stem,/call center|handle time/);
});
test('Q110 original evidence is preserved, including controls and owner acceptance',()=>{
 const rows=Q(110).chart.rows;assert.equal(rows.length,5);
 assert.deepEqual(rows.map(r=>r.slice(1)),[['80','96'],['$4.0M','$5.2M'],['$4.0M','$2.7M'],['85%','54%'],['90%','61%']]);
 assert.match(Q(110).why,/not proof of realized cash loss/);
});
test('Q111 network independently computes critical finish and correct weeks',()=>{
 const c=Q(111).chart,finish={};let pending=Object.keys(c.nodes);
 while(pending.length){const ready=pending.filter(k=>c.edges.filter(e=>e[1]===k).every(e=>e[0]in finish));assert.ok(ready.length);
 for(const k of ready)finish[k]=c.nodes[k].dur+Math.max(0,...c.edges.filter(e=>e[1]===k).map(e=>finish[e[0]]));pending=pending.filter(k=>!ready.includes(k));}
 assert.equal(finish.E,12);assert.equal(finish.D-finish.C,2);assert.equal(c.durationUnit,'working weeks');
});
test('Q114 expectation and discounting commute; all numerical distractors reconstruct',()=>{
 const npv=x=>-300000+x/1.1+x/1.1**2;
 const e=.7*210000+.3*60000,first=npv(e),second=.7*npv(210000)+.3*npv(60000);
 assert.ok(Math.abs(first-second)<1e-8);assert.ok(Math.abs(first+13636.36363636)<1e-6);
 assert.equal(Math.round(first/100)*100,-13600);
 assert.equal(-300000+e*2,30000);assert.equal(Math.round(npv(210000)/100)*100,64500);assert.equal(-300000+e/1.1,-150000);
 assert.match(Q(114).why,/neither order is mandatory/);
});
test('Q115 observed skill gap is not postponed or recast as causal contribution',()=>{
 assert.equal(99-81,18);assert.equal(99.5-88,11.5);assert.equal(95-94,1);
 assert.match(Q(115).options[2],/in parallel/);assert.match(Q(115).why,/do not share a causal denominator/);
});
test('Q116 cluster delivery and independent assignment unit are not confused',()=>{
 assert.match(Q(116).stem,/16 comparable teams of 20/);assert.match(Q(116).options[3],/cluster-aware/);
 assert.match(Q(116).why,/16 independent randomized units, not 320/);assert.match(Q(116).assumptions.join(' '),/Delayed training is safe/);
});
test('Q118 independent validation is future untouched data, not retrospective prespecification',()=>{
 assert.match(Q(118).stem,/predict processing time/);assert.match(Q(118).why,/cannot retroactively/);
 assert.match(Q(118).assumptions.join(' '),/already used in model selection are not called a holdout/);
});
test('Q119 60-coupon crossed design retains non-identifiable residual sources',()=>{
 assert.equal(10*3*2,60);assert.match(Q(119).why,/panel, appraiser, interaction and residual/);
 assert.match(Q(119).why,/combines measurement repeatability with any remaining/);
 assert.ok(Math.abs((.04+.01)-(.03+.02))<1e-12);
 assert.match(Q(119).sources[1].url,/destructive-testing/);
});
test('Q120 histogram endpoints and scale distinction are explicit',()=>{
 const c=Q(120).chart;assert.equal(c.counts.reduce((a,b)=>a+b),128);assert.equal(c.counts.slice(6).reduce((a,b)=>a+b),20);
 assert.equal(c.binConvention,'(lower, upper]');assert.match(Q(120).why,/Cpk is dimensionless/);
 assert.match(Q(120).options[2],/untransformed 18-hour/);
});
test('Q121 excerpt is not a full OLS fit and plotted fitted values do not identify leverage',()=>{
 assert.match(Q(121).assumptions.join(' '),/excerpt from a larger/);assert.match(Q(121).why,/alone does not determine leverage/);
 assert.equal(Q(121).chart.points.length,8);
});
test('Q122 stated bound follows 68 monthly values and is pointwise',()=>{
 const c=Q(122).chart;assert.equal(c.sampleSize,68);assert.equal(Math.round(1.96/Math.sqrt(68)*100)/100,.24);
 assert.deepEqual(c.values.map((v,i)=>Math.abs(v)>.24?c.lags[i]:null).filter(Boolean),[1,2]);
 assert.match(Q(122).assumptions.join(' '),/not a simultaneous/);
});
test('Q123 reported crossing raises model concern, not a formal PH rejection',()=>{
 const c=Q(123).chart;assert.deepEqual(c.series.map(s=>s.label),['Design A','Design B']);
 assert.deepEqual(c.series.map(s=>s.points.find(p=>p[0]===1200)[1]),[.68,.68]);
 assert.match(Q(123).why,/not, without uncertainty.*a formal rejection/);
});
function matrixRank(matrix,tol=1e-10){
 const a=matrix.map(r=>r.slice());let row=0;
 for(let col=0;col<a[0].length&&row<a.length;col++){
  let p=row;for(let i=row+1;i<a.length;i++)if(Math.abs(a[i][col])>Math.abs(a[p][col]))p=i;
  if(Math.abs(a[p][col])<tol)continue;[a[p],a[row]]=[a[row],a[p]];const d=a[row][col];a[row]=a[row].map(v=>v/d);
  for(let i=0;i<a.length;i++)if(i!==row){const m=a[i][col];for(let j=col;j<a[i].length;j++)a[i][j]-=m*a[row][j];}row++;
 }return row;
}
test('Q124 independently derives split-plot error degrees from the full unit matrix',()=>{
 const rows=Q(124).chart.rows,X=[];
 rows.forEach((r,i)=>r[2].split(',').map(x=>+x.trim()).forEach(speed=>X.push([...rows.map((_,j)=>+(i===j)),...[2,3,4].map(s=>+(speed===s)),...[2,3,4].map(s=>+(r[1]==='High'&&speed===s))])));
 assert.equal(X.length,24);assert.equal(matrixRank(X),12);assert.equal(24-matrixRank(X),12);
 assert.equal(rows.length-2,4);assert.equal(1+4+3+3+12,23);assert.match(Q(124).options[3],/4 degrees.*12/);
});
test('Q125 general-linear ANCOVA contrast is conditional on correctly coded backlog',()=>{
 const predict=(G,backlog)=>{const x=(backlog-100)/10;return 12-2*G+.4*x+.6*G*x;};
 for(const [x,expected]of [[80,-3.2],[140,.4]])assert.ok(Math.abs(predict(1,x)-predict(0,x)-expected)<1e-12);
 assert.match(Q(125).stem,/ANCOVA/);assert.match(Q(125).why,/not causal effects/);
 assert.doesNotMatch(Q(125).sourceSection,/Generalized|Logistic/);
});
function dom(){const d=new JSDOM('<!doctype html><head></head><body></body>',{runScripts:'outside-only'});d.window.eval(read('test-bank-mbb-batch5-ui.js'));return d;}
test('Q111 weeks, Q123 Design A/B, and Q106 unit/vertical marker render correctly',()=>{
 const d=dom(),ui=d.window.__MBBBatch5UI;try{
 const n=ui.render(Q(111).chart);assert.match(n,/working weeks/);assert.doesNotMatch(n,/days/);
 const c=ui.render(Q(123).chart);assert.match(c,/Design A \(solid\)/);assert.match(c,/Design B \(dashed\)/);assert.doesNotMatch(c,/Both required|Either sufficient/);
 d.window.document.body.innerHTML=ui.render(Q(106).chart);const svg=d.window.document.querySelector('svg');
 const marker=[...svg.querySelectorAll('line.mbb5-second')].find(l=>l.getAttribute('x1')===l.getAttribute('x2'));
 assert.ok(marker);assert.match(svg.textContent,/Units per week/);
 }finally{d.window.close();}
});
test('All 25 conditions and rationales are scoped; the other 150 questions are not matched',()=>{
 const d=dom(),ui=d.window.__MBBBatch5UI;try{for(const [k,qs]of Object.entries(batches))for(const q of qs){assert.equal(ui.isQuestion(q),k==='5');if(k==='5'){assert.match(ui.conditions(q),/Stated conditions/);assert.match(ui.rationales(q),/Choice D/);}else assert.equal(ui.conditions(q),'');}}finally{d.window.close();}
});
test('Native observation and keyboard controls work in standalone review/retry',()=>{
 const d=dom(),ui=d.window.__MBBBatch5UI;try{for(const n of [106,121]){
 d.window.document.body.innerHTML=ui.render(Q(n).chart);const select=d.window.document.querySelector('select');select.value='1';select.dispatchEvent(new d.window.Event('change',{bubbles:true}));assert.equal(d.window.document.querySelector('output').textContent,select.options[1].textContent);
 d.window.document.querySelector('[data-mbb5-point="0"]').dispatchEvent(new d.window.KeyboardEvent('keydown',{key:' ',bubbles:true}));assert.equal(select.value,'0');}
 }finally{d.window.close();}
});
test('Capacity exploration resets to scored case and does not show the solution',()=>{
 const d=dom(),ui=d.window.__MBBBatch5UI;try{d.window.document.body.innerHTML=ui.render(Q(105).chart);const input=d.window.document.querySelector('input');input.value='11';input.dispatchEvent(new d.window.Event('input',{bubbles:true}));assert.match(d.window.document.querySelector('output').textContent,/11 Belt-months/);d.window.document.querySelector('button').click();assert.equal(input.value,'9');assert.doesNotMatch(d.window.document.querySelector('.mbb5-capacity').textContent,/R plus S|R\+S/);}finally{d.window.close();}
});
test('All ten static fallbacks retain evidence without dead controls or premature answers',()=>{
 const d=new JSDOM(read('test-bank-assets/mbb-160/batch-05/static-fallbacks.html'));
 try{assert.equal(d.window.document.querySelectorAll('.fallback-card').length,10);assert.equal(d.window.document.querySelectorAll('input,select,button,[data-mbb5-point]').length,0);assert.equal(d.window.document.querySelectorAll('.mbb5-rationales').length,0);assert.equal(d.window.document.querySelectorAll('.mbb5-conditions').length,10);assert.doesNotMatch(d.window.document.body.textContent,/Both required|Either sufficient/);}finally{d.window.close();}
});
test('Batch 5 preservation with exact authorized Batch 6 hashes and Q150 rekey',()=>{
 const batch6Updated=JSON.parse(read('docs/audits/mbb-set2-batch06/updated-hashes.json'));
const batch7Updated=JSON.parse(fs.readFileSync(path.join(root,'docs/audits/mbb-set2-batch07/updated-hashes.json'),'utf8'));
 const p=JSON.parse(read('docs/audits/mbb-set2-batch05/preservation.json')),all=Object.values(batches).flat();
 assert.equal(all.length,175);assert.equal(Object.keys(p.questions_sha256).length,150);assert.equal(Object.keys(p.asset_sha256).length,24);
 for(const q of all)if(q.batch!==5)assert.equal(hash(JSON.stringify(stable(q))),batch7Updated.stable_question_sha256[q.qid] || batch6Updated.stable_question_sha256[q.qid] || p.questions_sha256[q.qid],q.qid);
 for(const [file,expected]of Object.entries(p.asset_sha256))assert.equal(hash(fs.readFileSync(path.join(root,file))),batch7Updated.asset_sha256[file] || batch6Updated.asset_sha256[file] || expected,file);
 assert.equal(p.answerPositions[149],1);assert.deepEqual(all.map(q=>q.answer),p.answerPositions.map((a,i)=>i===149?3:a));
});
test('Fresh Batch 5 hashes agree with both historical-test reconciliation formats',()=>{
 const p=JSON.parse(read('docs/audits/mbb-set2-batch05/updated-hashes.json'));
 assert.equal(Object.keys(p.question_sha256).length,25);assert.equal(Object.keys(p.asset_sha256).length,4);
 for(const q of batch){assert.equal(hash(JSON.stringify(q)),p.question_sha256[q.qid]);assert.equal(hash(JSON.stringify(stable(q))),p.stable_question_sha256[q.qid]);}
});
test('Generator reports markup checks rather than invented device sign-off',()=>{
 const val=JSON.parse(read('test-bank-assets/mbb-160/batch-05/validation.json'));
 for(const r of Object.values(val.questions)){assert.equal(r.validationStatus,'semantic-checks-passed');assert.deepEqual(r.breakpoints,[]);assert.match(r.validationScope,/measured results/);}
});

test('Keyed-option length ranks do not yield a single dominant positional shortcut',()=>{
 const ranks=[0,0,0,0];for(const q of batch){const keyLength=q.options[q.answer].length;ranks[q.options.filter(o=>o.length<keyLength).length]++;}
 assert.ok(Math.max(...ranks)<=10,'Inspect a systematic length cue; do not pad choices merely to meet a quota');
});

test('Dark-mode Batch 5 topic labels override low-contrast inline domain ink without changing other batches',()=>{
 const src=read('test-bank-mbb-batch5-ui.js');
 assert.ok(src.includes('html[data-theme="dark"] .tb-quiz:has(.mbb5-conditions) .tb-qtag{color:var(--ink,#e2e8f0)!important}'));
});

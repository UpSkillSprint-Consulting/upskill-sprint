'use strict';
// Independent numerical and integration regressions for the Q76–100 audit.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const c={};c.window=c;vm.createContext(c);vm.runInContext(read('test-bank-mbb-set2.js'),c);
const batch=JSON.parse(JSON.stringify(c.MBB_SET2_BATCHES[4])),q=n=>batch[n-76];
const answers=[3,0,2,1,3,0,1,2,3,0,2,1,3,0,1,2,3,0,1,2,3,0,1,2,3];
const near=(actual,expected,tol=1e-9)=>assert.ok(Math.abs(actual-expected)<tol,`${actual} != ${expected}`);
for(let n=76;n<=100;n++)test(`Batch 4 independently adjudicated Q${n}: ${'ABCD'[answers[n-76]]}`,()=>{
 const v=q(n);assert.equal(v.qid,`mbb:set-2:original-${String(n).padStart(3,'0')}`);assert.equal(v.answer,answers[n-76]);
 assert.equal(v.options.length,4);assert.equal(v.optionRationales.length,4);assert.equal(new Set(v.options).size,4);
 assert.ok(v.assumptions.length);assert.match(v.sourceDocument,/2012/);
 assert.match(v.why,new RegExp('<b>'+ 'ABCD'[v.answer]+'\\.'));
});
// Gaussian elimination with pivoting; this test does not trust stored ranks or determinants.
function rank(a){a=a.map(r=>r.slice());let k=0;for(let j=0;j<a[0].length&&k<a.length;j++){
 let best=k;for(let i=k+1;i<a.length;i++)if(Math.abs(a[i][j])>Math.abs(a[best][j]))best=i;
 if(Math.abs(a[best][j])<1e-10)continue;[a[k],a[best]]=[a[best],a[k]];
 for(let i=k+1;i<a.length;i++){const f=a[i][j]/a[k][j];for(let t=j;t<a[0].length;t++)a[i][t]-=f*a[k][t];}k++;
 }return k;}
function determinant(a){a=a.map(r=>r.slice());let d=1;for(let j=0;j<a.length;j++){
 let p=j;for(let i=j+1;i<a.length;i++)if(Math.abs(a[i][j])>Math.abs(a[p][j]))p=i;
 if(Math.abs(a[p][j])<1e-10)return 0;if(p!==j){[a[p],a[j]]=[a[j],a[p]];d=-d;}
 const pivot=a[j][j];d*=pivot;for(let i=j+1;i<a.length;i++){const f=a[i][j]/pivot;for(let k=j;k<a.length;k++)a[i][k]-=f*a[j][k];}
 }return d;}
test('Q99 all four model matrices independently reproduce rank, determinant and error df',()=>{
 const expect={P:[6,6,0,4,546.75],Q:[6,8,2,2,9.546875],R:[6,7,1,3,254.619140625],S:[5,7,2,3,0]};
 const records=[];
 for(const [id,runs] of Object.entries(q(99).chart.designRuns)){
  assert.equal(runs.length,10);assert.ok(runs.every(([a,b])=>a>=-1&&a<=1&&b>=-1&&b<=1&&a+b<=1.5));
  const X=runs.map(([a,b])=>[1,a,b,a*a,a*b,b*b]),r=rank(X),m=new Set(runs.map(x=>JSON.stringify(x))).size;
  const gram=Array.from({length:6},(_,i)=>Array.from({length:6},(_,j)=>X.reduce((s,row)=>s+row[i]*row[j],0))),det=determinant(gram);
  assert.deepEqual([r,m,m-r,10-m],expect[id].slice(0,4));near(det,expect[id][4],1e-7);
  const row=q(99).chart.rows.find(row=>row[0]===id);assert.equal(+row[1],10);assert.equal(+row[2],r);assert.equal(+row[3],m-r);near(+row[4],det,1e-7);
  records.push({id,rank:r,lof:m-r,pe:10-m,det});
 }
 const eligible=records.filter(x=>x.rank===6&&x.lof>=1&&x.pe>=1).sort((a,b)=>b.det-a.det);
 assert.deepEqual(eligible.map(x=>x.id),['R','Q']);assert.ok(records.find(x=>x.id==='P').det>eligible[0].det);
 assert.match(q(99).assumptions.join(' '),/listed|four/i);assert.match(q(99).assumptions.join(' '),/original|synthetic|authored/i);
});
test('Q86 longest-path calculation uses both branches at the merge and working-day units',()=>{
 const ch=q(86).chart,finish={};for(const id of ['P','Q','R','S','M'])finish[id]=ch.nodes[id].dur+Math.max(0,...ch.edges.filter(e=>e[1]===id).map(e=>finish[e[0]]));
 assert.deepEqual(finish,{P:20,Q:50,R:35,S:75,M:75}); // Published S duration is 25; total is 20+30+25.
 assert.match(q(86).stem+' '+q(86).assumptions.join(' '),/working.days/i);assert.match(q(86).assumptions.join(' '),/finish.to.start/i);
});
test('Q87 CPI, SPI, EAC and remaining-cost forecast recompute without early rounding',()=>{
 const [bac,pv,ev,ac]=[2.4,1.2,.96,1.2];near(ev/ac,.8);near(ev/pv,.8);near(bac/(ev/ac),3);near(bac/(ev/ac)-ac,1.8);
 near(ev-pv,-.24);near(ev-ac,-.24);assert.match(q(87).options[1],/EAC = \$3\.00 million/);
});
test('Q89 capacity release is not cash and the hard-savings boundary is explicit',()=>{
 assert.equal(10*60000/60,10000);assert.match(q(89).options[0],/released capacity or a soft benefit/);assert.match(q(89).why,/Finance|verified/);assert.match(q(89).why,/expense|spending|budget/);
});
test('Q90 74% is a share of errors, not a night-shift rate or a proof of training need',()=>{
 assert.match(q(90).assumptions.join(' '),/denominator|volumes|volume/);assert.equal(q(90).chart.columns.length,2);assert.doesNotMatch(q(90).chart.columns.join(' '),/limitation|correct/i);
 assert.match(q(90).why,/rate/);assert.match(q(90).why,/access/);
});
test('Q91 feasibility must be estimated; six coaches alone do not establish throughput',()=>{
 const s=q(91).stem+' '+q(91).assumptions.join(' ');assert.match(s,/availability|hours/);assert.match(s,/duration/);
 assert.match(q(91).options[2],/capacity|resources/);assert.match(q(91).why,/cannot|not establish|not prove|does not/);
});
test('Q92 the comparison varies training timing, not the entire intervention bundle',()=>{
 const s=q(92).stem+' '+q(92).assumptions.join(' ');assert.match(s,/same|comparable/);assert.match(q(92).options[3],/random|training/);
 assert.match(q(92).why,/parallel|random/);assert.match(q(92).why,/spillover|contamination/);
});
test('Q93 preserves legitimate Belt evidence work while retaining Champion decision authority',()=>{
 assert.match(q(93).stem,/authority|approval/);assert.match(q(93).why,/legitimate|appropriate|provide/);
});
test('Q95 does not repeat the executive credential-waiver scenario',()=>{
 assert.doesNotMatch(q(95).stem,/mayor|waiv|two.hour/);assert.match(q(95).stem,/applicant|applications|participation|apply/);assert.match(q(95).sourceSection,/23/);
});
test('Q96 least-squares bias fit is 2.6 - 0.04x; point summaries do not establish repeatability',()=>{
 const p=q(96).chart.points,x=p.map(z=>z.fitted),y=p.map(z=>z.residual),mx=x.reduce((a,b)=>a+b)/5,my=y.reduce((a,b)=>a+b)/5;
 const b=x.reduce((s,z,i)=>s+(z-mx)*(y[i]-my),0)/x.reduce((s,z)=>s+(z-mx)**2,0),a=my-b*mx;
 near(my,.2);near(b,-.04);near(a,2.6);near(Math.max(...y)-Math.min(...y),3.2);
 assert.match(q(96).why,/uncertainty|interval/);assert.match(q(96).why,/tolerance|acceptance/);
});
test('Q97 ratios retain full numerical precision and the event interval is not discarded',()=>{
 q(97).chart.points.forEach(p=>near(p.mtbf,p.time/p.failures));assert.equal(q(97).chart.points.at(-1).mtbf,50);
 assert.deepEqual([q(97).chart.event.time,q(97).chart.event.resumeTime],[800,1200]);assert.match(q(97).stem,/protocol|Table 25\.19/);
 assert.match(q(97).why,/instantaneous|current/);assert.doesNotMatch(q(97).chart.altText,/violated|invalid|must reject/);
});
test('Q98 lower-bound transformation, inverse and vertices all reconcile',()=>{
 const ch=q(98).chart,r=1-ch.lowerBounds.reduce((a,b)=>a+b),z=ch.point.map((v,i)=>(v-ch.lowerBounds[i])/r);
 z.forEach((v,i)=>near(v,[.5,.25,.25][i]));near(z.reduce((a,b)=>a+b),1);z.forEach((v,i)=>near(ch.lowerBounds[i]+v*r,ch.point[i]));
 for(let i=0;i<3;i++){const v=ch.lowerBounds.map((x,j)=>x+(i===j?r:0));near(v.reduce((a,b)=>a+b),1);assert.ok(v.every((x,j)=>x>=ch.lowerBounds[j]));}
 assert.match(q(98).stem,/mass/);
});
test('Q100 independent means, sample spread and equally weighted target loss identify I3',()=>{
 const expected=[[50.5,Math.sqrt(5/3),13.5],[52,Math.sqrt(68/3),21],[54,Math.sqrt(2/3),.5],[57,Math.sqrt(84/3),30]];
 q(100).chart.rows.forEach((row,i)=>{const y=row.slice(1,5).map(Number),m=y.reduce((a,b)=>a+b)/4,s=Math.sqrt(y.reduce((s,v)=>s+(v-m)**2,0)/3),loss=y.reduce((s,v)=>s+(v-54)**2,0)/4;[m,s,loss].forEach((v,j)=>near(v,expected[i][j]));});
 assert.match(q(100).assumptions.join(' '),/replic|descriptive/);assert.doesNotMatch(q(100).options[0],/first.*closest/);
});
test('Current BoK pointers and 2012 book chapter names are kept distinct',()=>{
 const chapters={76:1,77:3,78:4,79:5,80:6,81:8,82:10,83:11,84:11,85:11,86:14,87:14,88:14,89:16,90:17,91:18,92:20,93:21,94:22,95:23,96:24,97:25,98:26,99:26,100:26};
 for(const [n,ch] of Object.entries(chapters))assert.match(q(+n).sourceSection,new RegExp('Chapter '+ch+'\\b'));
 assert.match(q(82).sourceSection,/Data Gathering/);assert.match(q(90).sourceSection,/Training Needs Analysis/);assert.match(q(91).sourceSection,/Training Plans/);assert.match(q(92).sourceSection,/Training Effectiveness Evaluation/);
 assert.ok(batch.every(x=>x.cognitive!=='Create'));
});
function windowForUI(){const d=new JSDOM('<!doctype html><head></head><body></body>',{url:'https://example.test',runScripts:'outside-only',pretendToBeVisual:true});d.window.eval(read('test-bank-mbb-batch4-ui.js'));return d;}
test('All 25 cases show stated conditions and separate all four rationales from pre-answer evidence',()=>{
 const d=windowForUI();try{for(const item of batch){const h=d.window.document.createElement('main');h.innerHTML=d.window.__MBBBatch4UI.conditions(item)+(item.chart?d.window.__MBBBatch4UI.render(item.chart):'');assert.equal(h.querySelectorAll('.mbb4-conditions').length,1);assert.equal(h.querySelectorAll('.mbb4-rationales').length,0);assert.doesNotMatch(h.innerHTML,/undefined|NaN|Correct answer/);h.innerHTML=d.window.__MBBBatch4UI.rationales(item);assert.equal(h.querySelectorAll('dt').length,4);}
 assert.equal(d.window.__MBBBatch4UI.isQuestion({qid:'mbb:set-2:original-075'}),false);assert.equal(d.window.__MBBBatch4UI.isQuestion({qid:'mbb:set-2:original-101'}),false);
 }finally{d.window.close();}
});
test('All interactive charts support change, focus and keyboard without requiring mouse hover',()=>{
 const d=windowForUI();try{for(const n of [84,96,97]){d.window.document.body.innerHTML=d.window.__MBBBatch4UI.render(q(n).chart);const select=d.window.document.querySelector('select'),out=d.window.document.querySelector('output');select.value='1';select.dispatchEvent(new d.window.Event('change',{bubbles:true}));assert.equal(out.textContent,select.options[1].textContent);const point=d.window.document.querySelector('[data-mbb4-point="0"]');point.focus();assert.equal(select.value,'0');point.dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(out.textContent,select.options[0].textContent);}}
 finally{d.window.close();}
});
test('Static versions have complete data alternatives and no dead interactive controls',()=>{
 const d=windowForUI();try{for(const item of batch.filter(q=>q.chart)){d.window.document.body.innerHTML=d.window.__MBBBatch4UI.render(item.chart,true);assert.equal(d.window.document.querySelectorAll('select,[data-mbb4-point]').length,0);assert.ok(d.window.document.querySelector('table caption'));assert.ok(d.window.document.querySelector('th[scope="col"]'));}}
 finally{d.window.close();}
});
test('Q99 full forty-row candidate-run evidence is actually present in rendered and fallback views',()=>{
 const d=windowForUI();try{for(const stat of [true,false]){d.window.document.body.innerHTML=d.window.__MBBBatch4UI.render(q(99).chart,stat);assert.equal(d.window.document.querySelectorAll('.mbb4-matrices tbody tr').length,40);assert.match(d.window.document.body.textContent,/A², AB, B²/);}}
 finally{d.window.close();}
});
test('Deep feedback preserves decimals and never truncates inside a numeric token',()=>{
 const d=new JSDOM('<!doctype html><head></head><body></body>',{url:'https://example.test',runScripts:'outside-only',pretendToBeVisual:true});
 try{d.window.eval(read('test-bank-deep-feedback.js'));const f=d.window.__TBDeepFeedback.extractKeyPoint;
 assert.equal(f('CPI = 0.80 and EAC = $3.00 million. Reassess the forecast.'),'CPI = 0.80 and EAC = $3.00 million. Reassess the forecast.');
 const long='The result is '+('important evidence '.repeat(14))+'0.7764816931 and the explanation continues.';const point=f(long);assert.ok(long.includes(point.replace(/…$/,'')));assert.doesNotMatch(point,/0\.77…/);
 assert.match(f(q(87).why),/0\.80/);
 }finally{d.window.close();}
});

// The live page loads this guard after deep feedback; test the override too.
test('The live grounding guard preserves decimal values in the final public API',()=>{
 const d=new JSDOM('<!doctype html><head></head><body></body>',{url:'https://example.test',runScripts:'outside-only',pretendToBeVisual:true});
 try{d.window.eval(read('test-bank-deep-feedback.js'));d.window.eval(read('test-bank-deep-feedback-grounding.js'));
 const f=d.window.__TBDeepFeedback.extractKeyPoint;
 assert.equal(f('CPI = 0.80 and EAC = $3.00 million. Reassess the forecast.'),'CPI = 0.80 and EAC = $3.00 million.');
 assert.equal(f('At 20 mm, bias is 1.8 mm; at 100 mm it is -1.4 mm. Verify acceptance.'),'At 20 mm, bias is 1.8 mm; at 100 mm it is -1.4 mm.');
 assert.equal(f(''), 'A stored learning point is not available for this question yet.');
 assert.equal(f('<b>0.776</b> is the rounded probability.'),'0.776 is the rounded probability.');
 }finally{d.window.close();}
});
test('Prior Batch 4 preservation plus explicitly integrated Batch 3 hashes remain intact',()=>{
 const manifest=JSON.parse(read('docs/audits/mbb-set2-batch04/preservation.json'));
 // Batch 3 is now intentionally included in PR165; validate its explicit new
 // hashes rather than incorrectly requiring its pre-audit records. All other
 // Batch 4 preservation expectations remain unchanged.
 const restored=JSON.parse(read('docs/audits/mbb-set2-batch03/restored-hashes.json'));
 const batch6Updated=JSON.parse(read('docs/audits/mbb-set2-batch06/updated-hashes.json'));
const batch7Updated=JSON.parse(fs.readFileSync(path.join(root,'docs/audits/mbb-set2-batch07/updated-hashes.json'),'utf8'));
 const batch5Updated=JSON.parse(read('docs/audits/mbb-set2-batch05/updated-hashes.json'));
 const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
 const all=Object.values(c.MBB_SET2_BATCHES).flat();
 assert.equal(all.length,175);assert.equal(Object.keys(manifest.question_sha256).length,150);
 for(const [qid,sha] of Object.entries(manifest.question_sha256))assert.equal(digest(JSON.stringify(all.find(q=>q.qid===qid))),batch7Updated.question_sha256[qid] || batch6Updated.question_sha256[qid] || batch5Updated.question_sha256[qid] || restored.question_sha256[qid] || sha,qid);
 assert.equal(Object.keys(manifest.asset_sha256).length,24);
 for(const [p,sha] of Object.entries(manifest.asset_sha256))assert.equal(digest(fs.readFileSync(path.join(root,p))),batch7Updated.asset_sha256[p] || batch6Updated.asset_sha256[p] || batch5Updated.asset_sha256[p] || restored.asset_sha256[p] || sha,p);
});

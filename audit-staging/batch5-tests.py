# Executed in the reviewed integration namespace after new[] and preserved hashes exist.
testhead=r''' 'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(100,125);
const keys=KEYS,ids=IDS;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} differs from ${b}`);
for(const [i,q] of batch.entries())test(`Batch 5 Q${i+101}: identity, complete independent case, reviewed key and all-choice rationales`,()=>{
 assert.equal(q.qid,ids[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,i<10?'mbb-coaching':'mbb-advanced');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);
 assert.ok(q.optionRationales.every(s=>s.length>40));assert.equal(q.optionRationales.filter(s=>s.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));
 assert.ok(q.stem.length>180);assert.ok(q.why.length>250);assert.ok(q.trap.length>80);assert.ok(q.auditSources.every(s=>s.title&&s.url&&s.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/D[1-6]-[0-9]|elsewhere in this bank|across this entire domain|full-subdomain capstone/);
});
test('Batch 5 protects every byte of Q1–100 and Q126–175 and every stable question ID',()=>{
 const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[100])),'PREFIX');assert.equal(sha(source.slice(starts[125])),'SUFFIX');
 const p=JSON.parse(read('docs/audits/mbb-set3-batch05/preservation.json'));assert.deepEqual(bank.map(q=>q.qid),p.ids);assert.equal(new Set(p.ids).size,175);
});
test('Q111 distinguishes 22% variance contribution from 46.9% study variation',()=>{
 const contribution=Number(batch[10].stem.match(/variance is (\d+)%/)[1])/100;near(100*Math.sqrt(contribution),46.9041575982343);assert.ok(contribution>.09);assert.match(batch[10].options[keys[10]],/46\.9/);
});
test('Q112 reconciles incompatible report values using the specified component model and truncation',()=>{
 const ratio=Number(batch[11].stem.match(/Variation = (\d+)%/)[1])/100,part=Math.sqrt(1-ratio*ratio),ndc=1.41*part/ratio;
 near(part,.96);near(ndc,4.834285714285715);assert.equal(Math.floor(ndc),4);assert.notEqual(Math.floor(ndc),2);assert.match(batch[11].options[keys[11]],/ndc = 4/);
});
test('Q113 derives chance-adjusted agreement from the actual contingency table',()=>{
 const t=batch[12].chart;assert.equal(t.columns.length,4);assert.ok(t.rows.every(r=>r.length===4));
 const a=t.rows.slice(0,2).map(r=>r.slice(1,3).map(Number)),n=a.flat().reduce((s,v)=>s+v,0);assert.equal(n,100);
 const po=(a[0][0]+a[1][1])/n,pe=((a[0][0]+a[0][1])*(a[0][0]+a[1][0])+(a[1][0]+a[1][1])*(a[0][1]+a[1][1]))/(n*n);
 near(po,.7);near(pe,.5);near((po-pe)/(1-pe),.4);assert.match(batch[12].stem,/no reference classifications/);
});
test('Q114 recomputes both one-sided indices and the limiting specification',()=>{
 const s=batch[13].stem,lsl=Number(s.match(/LSL = (\d+)/)[1]),usl=Number(s.match(/USL = (\d+)/)[1]),mean=Number(s.match(/mean = (\d+)/)[1]),sd=Number(s.match(/SD = (\d+)/)[1]);
 near((usl-lsl)/(6*sd),1);near((usl-mean)/(3*sd),11/12);near((mean-lsl)/(3*sd),13/12);assert.equal(Math.min((usl-mean)/(3*sd),(mean-lsl)/(3*sd)).toFixed(2),'0.92');
});
test('Q115 recomputes fixed historical limits and identifies only subgroup 6 range exceedance',()=>{
 const c=batch[14].chart;near(c.xbarLimits[0],50+.577*2.9);near(c.xbarLimits[2],50-.577*2.9);near(c.rLimits[0],2.115*2.9);
 assert.deepEqual(c.rangeData.map((v,i)=>v>c.rLimits[0]?i+1:null).filter(Boolean),[6]);assert.ok(c.meanData.every(v=>v>c.xbarLimits[2]&&v<c.xbarLimits[0]));assert.match(batch[14].stem,/Phase II/);
});
test('Q116 differentiates Tukey fence, largest in-fence observation and dataset maximum',()=>{
 const c=batch[15].chart,fence=c.q3+1.5*(c.q3-c.q1);near(fence,7.65);assert.ok(c.upperWhisker<fence);assert.ok(c.outliers.every(v=>v>fence));near(Math.max(c.upperWhisker,...c.outliers),11.4);
});
test('Q117 retains all values and uses actual inverse-normal rather than evenly spaced ranks',()=>{
 const c=batch[16].chart;assert.equal(c.points.length,24);assert.deepEqual(c.points.map(p=>p.value),c.values.slice().sort((a,b)=>a-b));assert.ok(c.points.every(p=>Number.isFinite(p.z)&&p.probability>0&&p.probability<1));
 near(c.points[0].probability,1-Math.pow(.5,1/24));near(c.points[1].probability,(2-.3175)/(24+.365));near(c.points[0].z,-c.points[23].z);
 assert.ok(Math.abs((c.points[1].z-c.points[0].z)-(c.points[12].z-c.points[11].z))>.1);assert.deepEqual(c.points.slice(0,2).map(p=>p.value),[8.9,9.1]);
});
test('Q118 deterministic panels encode the stated precision and offset pattern on identical scales',()=>{
 const c=batch[17].chart;const means=c.panels.map(p=>[0,1].map(j=>p.points.reduce((s,v)=>s+v[j],0)/p.points.length));
 const spread=c.panels.map((p,i)=>p.points.reduce((s,v)=>s+(v[0]-means[i][0])**2+(v[1]-means[i][1])**2,0)/p.points.length);
 assert.ok(Math.hypot(...means[0])<.1);assert.ok(Math.hypot(...means[1])<.1);assert.ok(Math.hypot(...means[2])>4);assert.ok(spread[2]<.2);assert.ok(spread[1]>20&&spread[3]>20);
});
test('Q119 derives a 2 mm additive bias without making a linearity significance claim',()=>{
 const c=batch[18].chart;assert.deepEqual(c.measuredMeans.map((v,i)=>v-c.referenceValues[i]),[2,2,2]);assert.match(batch[18].stem,/no regression significance test/);
});
test('Q121 maps the visible excerpt to observations 37–48 and the configured eight-point signal',()=>{
 const c=batch[20].chart;assert.deepEqual(c.labels,Array.from({length:12},(_,i)=>i+37));assert.equal(c.data.length,12);assert.ok(c.data.slice(4).every(v=>v>c.cl));assert.ok(c.data[3]<c.cl);assert.ok(c.data.every(v=>v<c.ucl&&v>c.lcl));
});
// Independent binomial recursion, rather than the Python combinatorial generator.
const binomialAcceptance=(n,c,p)=>{if(p===0)return 1;let term=(1-p)**n,sum=term;for(let k=1;k<=c;k++){term*=((n-k+1)/k)*p/(1-p);sum+=term;}return sum;};
test('Q123 all 402 OC probabilities match independent binomial recursion and risks at designated quality levels',()=>{
 const c=batch[22].chart;assert.equal(c.curves.length,201);
 for(const r of c.curves)for(let j=0;j<2;j++)near(r.acceptance[j],binomialAcceptance(c.plans[j].n,c.plans[j].c,r.p),1e-12);
 for(let j=0;j<2;j++)assert.ok(c.curves.slice(1).every((r,i)=>r.acceptance[j]<=c.curves[i].acceptance[j]+1e-12));
 near(binomialAcceptance(200,10,.01),.9999931182295888,1e-12);near(binomialAcceptance(50,2,.01),.9861827291693996,1e-12);
 near(binomialAcceptance(200,10,.1),.008071249955102729,1e-12);near(binomialAcceptance(50,2,.1),.1117287563463473,1e-12);
});
test('Q124 recomputes the displayed group means/ranges without claiming a causal machine effect',()=>{
 const g=batch[23].chart.groups,m=g.map(g=>g.values.reduce((s,v)=>s+v,0)/g.values.length);[10.02,10.15,9.88].forEach((v,i)=>near(m[i],v));g.forEach(g=>near(Math.max(...g.values)-Math.min(...g.values),.02));near(Math.max(...m)-Math.min(...m),.27);assert.match(batch[23].stem,/have not been controlled/);
});
test('All nine original visual identities survive with complete alternatives and no answer-revealing renderer labels',()=>{
 assert.deepEqual(batch.filter(q=>q.chart).map(q=>Number(q.qid.split('-').pop())),[3,5,6,7,8,9,11,13,14]);
 for(const q of batch.filter(q=>q.chart)){const c=q.chart,t=c.type==='data-table'?c:c.evidence;assert.ok(c.title&&c.altText);assert.ok(t.columns.length>1&&t.rows.length>0);assert.ok(t.rows.every(r=>r.length===t.columns.length));assert.ok(!c.whatIf);}
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch5-ui.js'),c);const ui=c.window.__MBBSet3Batch5UI;
 assert.ok(bank.every((q,i)=>ui.isQuestion(q)===(i>=100&&i<125)));assert.equal(ui.isQuestion({qid:'cssbb:set-3:d6-003'}),false);
 for(const q of batch){const h=ui.render(q,false);assert.ok(!h.includes(q.optionRationales[q.answer]));assert.doesNotMatch(h,/NaN|undefined/);if(q.chart){assert.match(h,/<caption>/);assert.match(h,/scope="row"/);assert.match(h,/Scroll or swipe/);}}
 assert.match(ui.render({...batch[0],stem:'<script>bad</script>'},false),/&lt;script/);
});
'''.replace('KEYS',json.dumps(keys)).replace('IDS',json.dumps([q['qid'] for q in new])).replace('PREFIX',prefix).replace('SUFFIX',suffix)
# Reuse the proven fixture lifecycle and actual grading handlers, not a parallel grade implementation.
old=(root/'tests/test-bank-mbb-set3-batch4-audit.test.js').read_text();tail=old[old.index('// Functional grading regression'):].replace('Batch 4','Batch 5').replace('batch4','batch5')
(root/'tests/test-bank-mbb-set3-batch5-audit.test.js').write_text(testhead+tail)
# Real Chromium/WebKit interaction harness; identical player and backend fixture to earlier batches.
driver=(root/'scripts/audit-mbb-set3-batch4.mjs').read_text().replace('batch4','batch5').replace('mbbs3b4','mbbs3b5').replace('Batch4','Batch5').replace('Q76–100','Q101–125').replace('slice(75,100)','slice(100,125)').replace('i+76','i+101')
a=driver.index('async function checkVisual(');b=driver.index('async function geometry(',a)
check=r'''async function checkVisual(page,q,host,phase,label){
 if(!q.chart)return;const c=q.chart,t=c.type==='data-table'?c:c.evidence;
 assert.equal(await host.locator('caption').innerText(),t.title);
 const rows=host.locator('.mbbs3b5-table tbody tr');assert.equal(await rows.count(),t.rows.length);
 for(let i=0;i<t.rows.length;i++)assert.deepEqual(await rows.nth(i).locator('th,td').allTextContents(),t.rows[i].map(String));
 assert.equal(await host.locator('.mbbs3b5-table thead th[scope="col"]').count(),t.columns.length);
 assert.equal(await host.locator('.mbbs3b5-table tbody th[scope="row"]').count(),t.rows.length);
 const expectedCounts={'xbar-r':16,'boxplot':3,'normal-prob':24,'precision-accuracy':20,'bias-diagram':3,'control-single':12,'oc-curve':0,'multi-vari':12,'data-table':0};
 assert.equal(await host.locator('circle[data-point]').count(),expectedCounts[c.type]);
 if(c.type!=='data-table'){
  assert.equal(await host.locator('svg[role="img"]').count(),c.type==='xbar-r'?2:1);
  const points=await host.locator('circle[data-point]').evaluateAll(ps=>ps.map(p=>({x:Number(p.dataset.x),y:Number(p.dataset.y),cx:Number(p.getAttribute('cx')),cy:Number(p.getAttribute('cy'))})));
  assert.ok(points.every(p=>[p.x,p.y,p.cx,p.cy].every(Number.isFinite)));
  if(c.type==='normal-prob')assert.deepEqual(points.map(p=>p.y),c.points.map(p=>p.value));
  if(c.type==='control-single')assert.deepEqual(points.map(p=>p.x),c.labels);
  if(c.type==='oc-curve'){assert.equal(await host.locator('polyline[data-series]').count(),2);for(let j=0;j<2;j++){const coords=(await host.locator('polyline[data-series="'+j+'"]').getAttribute('points')).trim().split(/\s+/).map(s=>s.split(',').map(Number));assert.equal(coords.length,201);coords.forEach((pt,i)=>{assert.ok(Math.abs(pt[0]-(70+c.curves[i].p/.2*550))<1e-7);assert.ok(Math.abs(pt[1]-(270-c.curves[i].acceptance[j]*220))<1e-7);});}}
 }
 const regions=host.locator('.mbbs3b5-scroll'),access=[];
 for(let i=0;i<await regions.count();i++){
  const area=regions.nth(i);await area.evaluate(e=>e.scrollLeft=0);await area.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(180);
  const keyboard=await area.evaluate(e=>({needed:e.scrollWidth>e.clientWidth+2,moved:e.scrollLeft>0}));assert.ok(!keyboard.needed||keyboard.moved);
  await area.evaluate(e=>e.scrollLeft=e.scrollWidth);const right=await area.evaluate(e=>({needed:e.scrollWidth>e.clientWidth+2,moved:e.scrollLeft>0}));assert.ok(!right.needed||right.moved);
  await area.screenshot({path:path.join(out,label+'-'+phase+'-region'+i+'-right.png')});await area.evaluate(e=>e.scrollLeft=0);access.push({keyboard,right});
 }
 report.interactions.push({qid:q.qid,phase,type:c.type,tableCellsVerified:true,captionVerified:true,columnAndRowHeaders:true,actualPointCount:expectedCounts[c.type],regions:access});save();
}
'''
driver=driver[:a]+check+driver[b:]
(root/'scripts/audit-mbb-set3-batch5.mjs').write_text(driver)
# Record all evidence-independent read-only CI on the PR only when installed by the connector.
ci=(root/'.github/workflows/mbb-set3-batch4-audit.yml').read_text().replace('Batch 4','Batch 5').replace('batch4','batch5').replace('financial','statistical').replace('verify both tables','verify all nine statistical visuals')
(staging/'batch5-ci.yml').write_text(ci)
print('Installed Batch 5 tests and browser driver')

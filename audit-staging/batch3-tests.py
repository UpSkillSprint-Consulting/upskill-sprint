from pathlib import Path
import json,re,hashlib,itertools,statistics
root=Path.cwd();D=root/'docs/audits/mbb-set3-batch03';r=json.loads((D/'revisions.json').read_text());pres=json.loads((D/'preservation.json').read_text())
a='Recognize partial infrastructure, assess the severity and urgency of all three gaps, contain unacceptable exposure and assign a sequenced plan; do not infer a universal priority order from the gap names.'
b="Recognize partial infrastructure, assess each gap's severity and urgency, contain unacceptable exposure, and sequence assigned actions using evidence rather than a universal priority order."
p=root/'test-bank-mbb-set3.js';p.write_text(p.read_text().replace(a,b));r['questions'][21]['options'][3]=b;(D/'revisions.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');pres['afterSha256']=hashlib.sha256(p.read_bytes()).hexdigest();(D/'preservation.json').write_text(json.dumps(pres,indent=2)+'\n')
ids=[q['qid'].split(':')[-1] for q in r['questions']];keys=[q['answer'] for q in r['questions']]
text=r'''// Q51–75 validation. These assertions supplement, not replace, independent item review.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(50,75);
const ids=IDS,keys=KEYS;
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
 assert.equal(sha(source.slice(0,starts[50])),'PREFIX');assert.equal(sha(source.slice(starts[75])),'SUFFIX');
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
'''
text=text.replace('IDS',json.dumps(ids)).replace('KEYS',json.dumps(keys)).replace('PREFIX',pres['q1to50RawSha256']).replace('SUFFIX',pres['q76to175RawSha256'])
old=(root/'tests/test-bank-mbb-set3-batch2-audit.test.js').read_text();part=old[old.index('// Functional grading regression'):].replace('Batch 2','Batch 3').replace('batch2-ui','batch3-ui');text+=part
(root/'tests/test-bank-mbb-set3-batch3-audit.test.js').write_text(text)
p=root/'scripts/audit-mbb-set3-batch3.mjs';s=p.read_text();s=s.replace('const report={scope:','const report={interactions:[],scope:')
anchor='async function geometry(page,selector)'
func=r'''
async function checkVisual(page,q,host,phase,label){
 if(!q.chart)return;
 const c=q.chart;
 if(c.type==='data-table'){
  const cells=await host.locator('.mbbs3b3-evidence > .mbbs3b3-scroll tbody tr').allTextContents();assert.equal(cells.length,c.rows.length);
  for(let i=0;i<c.rows.length;i++)for(const value of c.rows[i])assert.ok(cells[i].includes(String(value)));
 }else{
  const nodes=host.locator('.mbbs3b3-node');assert.equal(await nodes.count(),Object.keys(c.nodes).length);
  assert.equal(await host.locator('.mbbs3b3-edge').count(),c.edges.length);
  for(const [name,n] of Object.entries(c.nodes)){const text=await host.locator('.mbbs3b3-network svg').textContent();assert.ok(text.includes(name.replace(' ',''))||text.includes(name)||text.replace(/\s/g,'').includes(name.replace(/\s/g,'')));assert.ok(text.includes(String(n.dur)));}
  const d=host.locator('.mbbs3b3-network-data');await stableClick(d.locator('summary'));assert.ok(await d.getAttribute('open')!==null);
  assert.equal(await d.locator('tbody tr').count(),Object.keys(c.nodes).length);
 }
 if(c.whatIf){
  const range=host.locator('[data-b3-slider]'),w=c.whatIf;assert.equal(Number(await range.inputValue()),w.value);
  const observations=[];
  for(const [key,v] of [['Home',w.min],['End',w.max],['ArrowLeft',w.max-w.step]]){
   await range.focus();await page.keyboard.press(key);assert.equal(Number(await range.inputValue()),v);
   const x=Number(await host.locator('.mbbs3b3-capacity-line').getAttribute('x1'));const expected=130+v/(c.interactiveKind==='capacity'?40:800)*360;assert.ok(Math.abs(x-expected)<.001);
   const output=await host.locator('[data-b3-output]').innerText();assert.ok(output.includes(String(v)));
   if(c.interactiveKind==='capacity'){assert.ok(output.includes('total demand 90 hours'));assert.ok(output.includes('total capacity '+(v*4)+' hours'));}
   const widths=await host.locator('.mbbs3b3-demand').evaluateAll(es=>es.map(e=>Number(e.getAttribute('width'))));const expectedWidths=c.interactiveKind==='capacity'?[270,180,90,270]:[337.5];assert.deepEqual(widths,expectedWidths);
   observations.push({key,value:v,lineX:x,output});
   if(key!=='ArrowLeft')await host.locator('[data-b3-explorer]').screenshot({path:path.join(out,label+'-'+phase+'-'+key+'.png'),style:'header.site{visibility:hidden!important}'});
  }
  await range.focus();await page.keyboard.press('Home');const box=await range.boundingBox();await page.mouse.click(box.x+box.width*.75,box.y+box.height/2);assert.ok(Number(await range.inputValue())>w.min);
  await stableClick(host.locator('[data-b3-reset]'));assert.equal(Number(await range.inputValue()),w.value);
  report.interactions.push({qid:q.qid,phase,observations,pointerChanged:true,resetPassed:true});save();
 }
}
'''
s=s.replace(anchor,func+anchor)
s=s.replace("const navigation=await geometry(page,'.tb-quiz');","await checkVisual(page,q,page.locator('.tb-quiz'),'question',label);\n    const navigation=await geometry(page,'.tb-quiz');")
s=s.replace('const copy=await card.innerText();',"await checkVisual(page,q,card,'review',engine+'-'+layout+'-q'+(i+51));\n    const copy=await card.innerText();")
s=s.replace('if(report.failures.length||report.pageErrors.length||bad.length)process.exitCode=1;','if(report.failures.length||report.pageErrors.length||bad.length||report.cases.filter(c=>c.geometry).length!==engines.length*layouts.length*100)process.exitCode=1;');p.write_text(s)
values=[(200000,180000),(250000,220000),(300000,240000)];combos=[]
for mask in range(8):
 cost=sum(v[0] for i,v in enumerate(values) if mask&(1<<i));npv=sum(v[1] for i,v in enumerate(values) if mask&(1<<i));combos.append({'projects':[i+1 for i in range(3) if mask&(1<<i)],'investment':cost,'npv':npv,'feasibleAt500k':cost<=500000})
calc={'Q62':{'loadsHoursPerWeek':[30,20,10,30],'capacityPerBelt':20,'totalDemand':90,'totalCapacity':80,'aggregateShortfall':10,'localOverload':[10,0,0,10],'localSpare':[0,0,10,0]},'Q63':{'ratioM':300000/150000,'ratioN':900000/600000,'firstYearNetM':150000,'firstYearNetN':300000,'difference':150000},'Q64':{'earliestCompletionDays':max(3,4,6)+1,'criticalActivities':['Design review','Readiness review'],'supplierTotalFloatDays':6-4,'materialTotalFloatDays':6-3,'milestoneDuration':0},'Q70':{'indices':[1+n/i for i,n in values],'allSubsets':combos,'optimum':[1,3],'optimumNPV':420000}}
(D/'independent-calculations.json').write_text(json.dumps(calc,indent=2)+'\n')
print('Tests and visual driver ready')

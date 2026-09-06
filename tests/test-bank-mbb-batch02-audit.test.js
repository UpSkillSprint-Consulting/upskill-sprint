'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const sandbox={};sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'test-bank-mbb-set2.js'),'utf8'),sandbox);
const bank=JSON.parse(JSON.stringify(sandbox.MBB_SET2_BATCHES[2]));
const q=n=>bank[n-26];
// Solved from the supplied scenarios and data, independently of the stored answer indices.
const solved=['B','D','A','C','B','A','C','D','B','A','D','B','C','A','B','D','C','B','A','C','D','B','A','C','D'];
for(let n=26;n<=50;n++)test(`Independent adjudication Q${n}: ${solved[n-26]}`,()=>{
 assert.equal('ABCD'[q(n).answer],solved[n-26]);
 assert.equal(new Set(q(n).options).size,4);
 assert.ok(q(n).why.includes(q(n).options[q(n).answer]));
 assert.equal(q(n).optionRationales.length,4);
});
test('Q27 the 62% denominator comes from event records, not a complaint sample',()=>{
 assert.match(q(27).stem,/session-event records locate 62% of recorded abandoned attempts/);
 assert.doesNotMatch(q(27).stem,/complaint coding shows that 62%/);
});
test('Q28 rates are unambiguous and the table does not give the classification away',()=>{
 assert.ok(q(28).chart.rows[0][2].includes('percentage points'));
 assert.ok(q(28).chart.rows[2][2].includes('relative'));
 assert.doesNotMatch(JSON.stringify(q(28).chart),/Lagging outcome|Timing characteristic/);
});
test('Q34 assesses reserved decision rights rather than repeating symbolic executive sponsorship',()=>{
 assert.match(q(34).stem,/deployment council retains decisions/);
 assert.match(q(34).stem,/external-capacity alternative/);
 assert.match(q(34).options[q(34).answer],/compliant alternatives/);
 assert.match(q(34).options[q(34).answer],/preserving the mandatory deadline/);
});
test('Q36 exhaustive optional-subset enumeration produces the unique 12-FTE optimum',()=>{
 const data=q(36).chart.rows.map(row=>({id:row[0][0],value:Number(row[1])*Number(row[2]),fte:Number(row[3])}));
 const candidates=[];
 for(let mask=0;mask<8;mask++){
  const set=[data[0],...data.slice(1).filter((_,i)=>mask&(1<<i))],ids=set.map(p=>p.id);
  if(ids.includes('B')&&!ids.includes('C'))continue;
  const fte=set.reduce((a,p)=>a+p.fte,0);if(fte>12)continue;
  candidates.push({ids,fte,value:set.reduce((a,p)=>a+p.value,0)});
 }
 candidates.sort((a,b)=>b.value-a.value);
 assert.deepEqual(candidates[0].ids,['A','B','C']);assert.equal(candidates[0].fte,12);
 assert.ok(Math.abs(candidates[0].value-2.95)<1e-12);
 assert.ok(Math.abs(candidates[1].value-2.83)<1e-12);assert.equal(candidates.length,5);
 assert.match(q(36).assumptions.join(' '),/zero net NPV otherwise/);
 assert.match(q(36).assumptions.join(' '),/Independence.*not required/);
 assert.match(q(36).stem,/does not change the scored 12-FTE case/);
});
test('Q37 cost and schedule indices and variances are recomputed independently',()=>{
 assert.equal(480/600,.8);assert.equal((480/540).toFixed(2),'0.89');
 assert.equal(480-600,-120);assert.equal(480-540,-60);
 assert.match(q(37).options[q(37).answer],/SPI = 0.80 and CPI = 0.89/);
});
test('Q38 early testing is linked to remediation rather than treated as automatic risk reduction',()=>{
 assert.equal(q(38).chart.cells[q(38).chart.rows.indexOf('Severe')][q(38).chart.cols.indexOf('Possible')],'high');
 assert.match(q(38).options[q(38).answer],/remediate failures, verify acceptance criteria/);
});
test('Q40 the keyed curriculum matches all ten required cells, not the former contradictory targets',()=>{
 const expected=[['Beginner','Practitioner','Expert'],['—','Practitioner','Expert'],['—','Beginner','Expert'],['Practitioner','Practitioner','Beginner']];
 assert.deepEqual(q(40).chart.rows.map(r=>r.slice(1)),expected);
 assert.equal(expected.flat().filter(x=>x!=='—').length,10);
 assert.doesNotMatch(q(40).options[q(40).answer],/sponsors reach Practitioner in interpretation/);
 assert.match(q(40).why,/Sponsors need Beginner interpretation/);
 assert.match(q(40).why,/Beginner administration/);assert.match(q(40).why,/Beginner risk communication/);
});
test('Q46 integer two-trial outcomes reconcile every percentage and the pooled denominator',()=>{
 let within=0,correct=0;
 const targets=[[96,82],[94,83],[98,97]];
 q(46).chart.studyCounts.forEach((s,i)=>{
  assert.equal(s.bothCorrect+s.bothWrong+s.disagree,50);
  const repeat=s.bothCorrect+s.bothWrong,reference=2*s.bothCorrect+s.disagree;
  assert.deepEqual([repeat/50*100,reference],targets[i]);
  within+=repeat;correct+=reference;
 });
 assert.equal(within,144);assert.equal(correct,262);assert.equal((correct/300*100).toFixed(1),'87.3');
 assert.doesNotMatch(q(46).chart.columns.join(' '),/Meets|Pass|Fail/);
 assert.match(q(46).assumptions.join(' '),/point estimates, not confidence bounds/);
});
test('Q48 finite differences independently verify the gradient, equal-scale geometry and contour levels',()=>{
 const f=(a,b)=>90-6*(a-.5)**2-2*(b+.5)**2,h=1e-5;
 const gradient=[(f(-1+h,1)-f(-1-h,1))/(2*h),(f(-1,1+h)-f(-1,1-h))/(2*h)];
 assert.ok(Math.abs(gradient[0]-18)<1e-7);assert.ok(Math.abs(gradient[1]+6)<1e-7);assert.equal(f(-1,1),72);
 for(const c of q(48).chart.contours){assert.ok(Math.abs(f(.5+c.radiusX,-.5)-c.level)<1e-10);assert.ok(Math.abs(f(.5,-.5+c.radiusY)-c.level)<1e-10);}
});
test('Q49 no intermediate rounding: component .776, series .603 and parallel .950',()=>{
 const r=Math.exp(-Math.pow(1000/2500,1.5));
 assert.deepEqual([r,r*r,1-(1-r)**2].map(x=>x.toFixed(3)),['0.776','0.603','0.950']);
 assert.match(q(49).options[q(49).answer],/0\.776.*0\.603.*0\.950/);
 assert.match(q(49).assumptions.join(' '),/full required load/);
 assert.deepEqual(q(49).chart.weibullModel,{scaleHours:2500,shape:1.5});
});
test('Q50 binding does not prove a positive shadow price: a redundant limiting constraint is a counterexample',()=>{
 // max x subject to x<=labor and x<=1. At labor=1, labor binds; increasing labor alone leaves max x=1.
 const value=labor=>Math.min(labor,1);assert.equal(value(1),value(2));
 assert.match(q(50).options[q(50).answer],/cannot be quantified/);
});
function ui(){const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{runScripts:'outside-only'});dom.window.eval(fs.readFileSync(path.join(root,'test-bank-mbb-batch2-ui.js'),'utf8'));return dom;}
test('All 25 conditions render; rationales are a separate, explicitly post-answer function; other batches are untouched',()=>{
 const dom=ui();try{for(const item of bank){assert.match(dom.window.__MBBBatch2UI.conditions(item),/Stated conditions/);assert.match(dom.window.__MBBBatch2UI.rationales(item),/Choice D/);}
 for(const n of [1,25,51,175])assert.equal(dom.window.__MBBBatch2UI.conditions({qid:'mbb:set-2:original-'+String(n).padStart(3,'0'),assumptions:['hidden']}),'');
 }finally{dom.window.close();}
});
test('Interactive evidence supports native selectors and focus, without requiring a mouse',()=>{
 const dom=ui();try{for(const n of [31,49]){dom.window.document.body.innerHTML=dom.window.__MBBBatch2UI.render(q(n).chart);
 const select=dom.window.document.querySelector('select');select.value='1';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
 assert.equal(dom.window.document.querySelector('output').textContent,select.options[1].text);
 dom.window.document.querySelector('[data-mbb2-point="2"]').focus();assert.equal(select.value,'2');
 }}finally{dom.window.close();}
});
test('Slider starts/reset at the scored case and behaves in review without core quiz wiring',()=>{
 const dom=ui();try{dom.window.document.body.innerHTML=dom.window.__MBBBatch2UI.render(q(36).chart);const slider=dom.window.document.querySelector('input');
 slider.value='16';slider.dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert.equal(dom.window.document.querySelector('[data-tb-whatif-remaining]').textContent,'12');
 dom.window.document.querySelector('button').click();assert.equal(slider.value,'12');assert.equal(dom.window.document.querySelector('[data-tb-whatif-remaining]').textContent,'8');
 }finally{dom.window.close();}
});
test('Static visual fallbacks have no dead dynamic controls and no pre-answer rationales',()=>{
 const dom=ui();try{for(const item of bank.filter(x=>x.chart)){
 const markup=dom.window.__MBBBatch2UI.render(item.chart,true);dom.window.document.body.innerHTML=markup;
 assert.equal(dom.window.document.querySelectorAll('input,select,button,[data-mbb2-point]').length,0);assert.doesNotMatch(markup,/mbb2-rationales/);
 }}finally{dom.window.close();}
});

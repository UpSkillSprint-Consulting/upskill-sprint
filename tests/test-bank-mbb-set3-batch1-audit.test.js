'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'test-bank-mbb-set3.js'),'utf8');
const context={window:{}};vm.runInNewContext(source,context);
const bank=JSON.parse(JSON.stringify(context.window.MBB_SET3)),batch=bank.slice(0,25);
const suffixes=['001','004','006','009','012','016','019','020','022','023','025','027','030','034','037','041','044','048','051','055','058','062','065','069','070'];
const keys=[0,2,0,0,2,0,1,3,0,1,3,3,2,1,3,3,2,3,0,1,2,0,2,2,0];
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
for(let i=0;i<25;i++)test(`Q${i+1} ${suffixes[i]} retains identity, key and independently usable content`,()=>{
 const q=batch[i];assert.equal(q.qid,'mbb:set-3:d1-'+suffixes[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,'mbb-enterprise');
 assert.ok(q.stem.length>100);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
 assert.ok(q.optionRationales.every(s=>s.length>35));assert.ok(q.why.length>160);assert.ok(q.auditSources.length>=1);
 assert.ok(q.auditSources.every(s=>/^https:\/\//.test(s.url)&&s.title&&s.locator));
 assert.doesNotMatch(q.stem,/\*|D1-\d|as (?:shown|discussed) (?:above|earlier)|previous question|question \d/i);
 assert.doesNotMatch(q.why,/Source: \[CSSC\]|7%.*matur|7:1.*ROI|mature quality systems invest/i);
 const lengths=q.options.map(s=>s.trim().split(/\s+/).length),other=lengths.filter((_,j)=>j!==q.answer).sort((a,b)=>a-b);
 assert.ok(lengths[q.answer]/other[1]<=1.25,'correct option is not conspicuously longer than distractors');
 if(q.chart){assert.ok(q.chart.title);assert.ok(q.chart.altText);if(q.chart.type==='data-table')assert.ok(q.chart.rows.every(r=>r.length===q.chart.columns.length));}
});
test('Q26–175 source remains byte-identical to the audit baseline',()=>{
 const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(crypto.createHash('sha256').update(source.slice(starts[25])).digest('hex'),'b55c09425e0b5c6a706127aa9eb5181a58e0983690b880b65113fe63e3014025');
});
test('Q3 independently recomputes weighted totals and sensitivity reversal',()=>{
 const rows=batch[2].chart.rows;const score=col=>rows.reduce((s,r)=>s+parseFloat(r[1])/100*Number(r[col]),0);
 close(score(2),6.7);close(score(3),6.8);assert.ok(score(2)+.3>score(3));assert.match(batch[2].options[0],/6\.8.*6\.7/);
});
test('Q7 uses ASQ prevention–appraisal–failure definitions and exact percentages',()=>{
 const failure=1.2+3.8,coq=failure+.6+.2;close(failure/80*100,6.25);close(coq/80*100,7.25);
 const percentages=[1.2,3.8,.6,.2].map(v=>v/80*100);batch[6].chart.rows.forEach((r,i)=>close(parseFloat(r[2]),percentages[i]));
 assert.match(batch[6].options[1],/6\.25%/);assert.match(batch[6].why,/Total COQ.*7\.25%/);
});
test('Q9 computes expected gross benefit, not risk-score-scaled NPV',()=>{
 const rows=batch[8].chart.rows;const results=rows.map(r=>({id:r[0],ev:Number(r[1].replace(/[^\d.]/g,''))*parseFloat(r[2])/100})).sort((a,b)=>b.ev-a.ev);
 assert.deepEqual(results,[{id:'P4',ev:455000},{id:'P2',ev:450000},{id:'P1',ev:400000},{id:'P3',ev:285000}]);
 assert.match(batch[8].why,/5,000|5K/);assert.match(batch[8].stem,/zero|\$0/i);
});
test('Q10 baseline is four waves, sixteen months and eighteen completions per year; visual does not answer it',()=>{
 close(24/6*4,16);close(6*12/4,18);assert.equal(batch[9].chart.type,'data-table');
 assert.doesNotMatch(JSON.stringify(batch[9].chart),/16(?:\.0)?|18|Months to clear/i);
 assert.match(batch[9].why,/16 months/);
});
test('Q11 each WIP observation reconciles with starts minus completions',()=>{
 let wip=12;const ends=[7,6,5,4].map(done=>wip+=8-done);assert.deepEqual(ends,[13,15,18,22]);
 assert.deepEqual(batch[10].chart.data,ends);assert.match(batch[10].why,/steady.state|non.stationary|transient/i);
 assert.ok(!batch[10].options.some(s=>/always|proves/.test(s)&&s===batch[10].options[batch[10].answer]));
});
test('Q23 distinguishes benefit–cost ratio from net ROI',()=>{
 close(8.5/1.2,7.083333333333334);close((8.5-1.2)/1.2*100,608.3333333333334);
 assert.match(batch[22].why,/608\.3/);assert.match(batch[22].why,/7\.08/);assert.match(batch[22].stem,/benefits.*costs|net ROI/i);
});
test('batch has five data-supported visuals and no interactive-slider requirement',()=>{
 assert.equal(batch.filter(q=>q.chart).length,5);assert.equal(batch.filter(q=>q.chart?.type==='data-table').length,4);assert.equal(batch.filter(q=>q.chart?.type==='time-series').length,1);
 assert.ok(batch.every(q=>!q.chart?.whatIf));
});
test('no exact duplicates or high token-overlap stems within the audited batch',()=>{
 const words=s=>new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>3));
 const scores=[];for(let i=0;i<25;i++)for(let j=i+1;j<25;j++){const a=words(batch[i].stem),b=words(batch[j].stem);const overlap=[...a].filter(w=>b.has(w)).length/new Set([...a,...b]).size;scores.push({a:i+1,b:j+1,overlap});assert.ok(overlap<.55,`Q${i+1}/Q${j+1} need duplicate review`);}
 scores.sort((a,b)=>b.overlap-a.overlap);console.log('Highest within-batch token similarities:',JSON.stringify(scores.slice(0,5)));
});

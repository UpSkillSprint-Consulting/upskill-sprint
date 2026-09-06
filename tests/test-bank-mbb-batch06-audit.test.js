'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const c={};c.window=c;vm.createContext(c);vm.runInContext(read('test-bank-mbb-set2.js'),c);
const batches=JSON.parse(JSON.stringify(c.MBB_SET2_BATCHES)),all=Object.values(batches).flat(),batch=batches[6],Q=n=>batch[n-126];
// Independently adjudicated answers, not extracted from the production key.
const keys=[1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,3];
const stable=o=>Array.isArray(o)?o.map(stable):o&&typeof o==='object'?Object.fromEntries(Object.keys(o).sort().map(k=>[k,stable(o[k])])):o;
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
for(let i=0;i<25;i++)test(`Batch 6 Q${126+i}: independent key ${'ABCD'[keys[i]]}, four distinct choices and rationale`,()=>{
 const q=batch[i];assert.equal(q.qid,`mbb:set-2:original-${i+126}`);assert.equal(q.answer,keys[i]);assert.equal(q.optionRationales.length,4);assert.equal(new Set(q.options).size,4);
 assert.ok(q.why.includes(`<b>${'ABCD'[keys[i]]}. ${q.options[keys[i]]}</b>`));assert.ok(q.assumptions.length>0);assert.match(q.sourceDocument,/Kubiak, 2012/);assert.ok(q.bok.code);assert.doesNotMatch(q.why,/TBD|placeholder|undefined/);
});
test('Q150 repairs B to D without moving choices or rewarding the old incorrect position',()=>{
 const q=Q(150);assert.equal(q.answer,3);assert.match(q.options[1],/assignable causes are absent/);assert.match(q.options[3],/hidden process changes/);assert.match(q.optionRationales[3],/Correct/);assert.doesNotMatch(q.optionRationales[1],/^Correct/);assert.match(q.why,/Hiding|hidden|compensat/i);
});
test('Q130 exhaustive ready-project optimization includes mandatory M and respects eligibility',()=>{
 const rows=Q(130).chart.rows;assert.equal(Q(130).chart.whatIf.baseline,10);
 const ready=rows.filter(r=>['M','A','B'].includes(r[0]));assert.equal(ready.length,3);let feasible=[];
 for(let mask=0;mask<8;mask++){const x=ready.filter((_,i)=>mask&(1<<i));if(!x.some(r=>r[0]==='M'))continue;const cap=x.reduce((a,r)=>a+Number(r[1]),0),value=x.reduce((a,r)=>a+parseFloat(String(r[2]).replace(/[^\d.]/g,'')),0);if(cap<=10)feasible.push({ids:x.map(r=>r[0]).sort().join(''),cap,value});}
 feasible.sort((a,b)=>b.value-a.value);assert.equal(feasible[0].ids,'BM');assert.equal(feasible[0].cap,9);near(feasible[0].value,1.9);assert.match(Q(130).options[0],/one Belt-month/);assert.doesNotMatch(JSON.stringify(Q(130)),/\$0\.2M/);
});
test('Q134 percentages, existing standard and vertical Week 5 event are coherent',()=>{
 const q=Q(134);assert.match(q.stem,/existing/);assert.match(q.stem,/start of Week 5/);assert.equal(q.chart.referenceValue,5);assert.equal(q.chart.labels.length,10);for(const s of q.chart.series){assert.equal(s.data.length,10);assert.ok(s.data.every(v=>v>=0&&v<=100));}assert.doesNotMatch(q.options[q.answer],/falsification|deliberat/i);
});
test('Q136 reconstructs early/late dates and total float from the graph, in working weeks',()=>{
 const ch=Q(136).chart,ids=Object.keys(ch.nodes),ef={};for(const id of ids){const parents=ch.edges.filter(e=>e[1]===id).map(e=>e[0]);ef[id]=Math.max(0,...parents.map(p=>ef[p]))+ch.nodes[id].dur;}
 assert.equal(ef.E,13);const lf={};for(const id of [...ids].reverse()){const children=ch.edges.filter(e=>e[0]===id).map(e=>e[1]);lf[id]=children.length?Math.min(...children.map(k=>lf[k]-ch.nodes[k].dur)):ef.E;}
 assert.equal(lf.C-ef.C,2);for(const id of ['A','B','D','E'])assert.equal(lf[id]-ef[id],0);assert.match(Q(136).options[3],/13 working weeks/);
});
test('Q138 compares supplied common-basis NPVs rather than reconstructing missing cash flows',()=>{assert.equal(510000-420000,90000);assert.match(Q(138).options[1],/90,000/);assert.match(Q(138).assumptions.join(' '),/horizon|financial/);});
test('Q139 bridge reconciles and separates actual hard savings from forecast avoidance',()=>{
 const vals=Q(139).chart.rows.map(r=>parseFloat(r[1].replace(/[^\d.]/g,'')));near(vals.reduce((a,b)=>a+b),1.8);near(vals.slice(0,3).reduce((a,b)=>a+b),1.5);assert.match(Q(139).options[1],/\$1\.5M/);assert.match(Q(139).stem,/completed 12-month/);assert.match(Q(139).options[2],/\$0\.6M/);
});
test('Q146 recomputes marginal chance agreement, kappa and each class error from the actual table',()=>{
 const rows=Q(146).chart.rows,nums=rows.map(r=>r.slice(1).map(v=>Number(String(v).replace(/,/g,''))));assert.deepEqual(nums,[[27,53,80],[27,1893,1920],[54,1946,2000]]);
 const N=2000,po=(27+1893)/N,pe=(80*54+1920*1946)/(N*N),k=(po-pe)/(1-pe);
 near(po,.96);near(pe,.93516);near(k,621/1621,1e-12);near(27/80,.3375);near(1893/1920,.9859375);near(1920/N,po);
 assert.match(Q(146).stem,/One appraiser/);assert.match(Q(146).stem,/once/);assert.match(Q(146).why,/repeatability|reproducibility/);
});
test('Q147 reference bands derive from n=80 and do not claim joint significance',()=>{const q=Q(147);assert.equal(q.chart.sampleSize,80);near(q.chart.confidence,1.96/Math.sqrt(80));assert.ok(q.chart.values[0]>q.chart.confidence);assert.ok(q.chart.values[11]>q.chart.confidence);assert.match(q.stem,/pointwise/);assert.match(q.assumptions.join(' '),/simultaneous|joint/);});
test('Q148 stationary point, model height, matrix versus Hessian eigenvalues are consistent',()=>{
 const ch=Q(148).chart,[[a,b],[,d]]=ch.quadraticMatrix,[l,m]=ch.linearCoefficients,det=a*d-b*b;
 const x=-(d*l-b*m)/(2*det),y=-(-b*l+a*m)/(2*det);near(x,.8);near(y,.6);
 const f=(x,y)=>82+6*x+4*y-3*x*x-2*y*y-2*x*y;near(f(x,y),85.6);assert.equal(ch.stationaryResponse,85.6);
 const eig=[(a+d+Math.sqrt((a-d)**2+4*b*b))/2,(a+d-Math.sqrt((a-d)**2+4*b*b))/2];assert.ok(eig.every(v=>v<0));near(eig[0],(-5+Math.sqrt(5))/2);assert.match(Q(148).why,/Hessian is 2Q/);assert.doesNotMatch(Q(148).stem,/0\.8|0\.6/);
});
function dom(){const d=new JSDOM('<!doctype html><head></head><body></body>',{runScripts:'outside-only'});d.window.eval(read('test-bank-mbb-batch6-ui.js'));return d;}
test('Every sample on all four rotated Q148 contours satisfies the independent quadratic',()=>{
 const d=dom();try{const ui=d.window.__MBBBatch6UI,ch=Q(148).chart;for(const contour of ch.contours){assert.ok(contour.angleDegrees>30&&contour.angleDegrees<33);for(const [a,b]of ui.contourPoints(ch,contour))near(82+6*a+4*b-3*a*a-2*b*b-2*a*b,contour.level,1e-11);}}finally{d.window.close();}
});
test('Q148 rendered geometry uses identical coded-unit scales and a correct clipping rectangle',()=>{
 const d=dom();try{d.window.document.body.innerHTML=d.window.__MBBBatch6UI.render(Q(148).chart);const rect=d.window.document.querySelector('clipPath rect');assert.equal(rect.getAttribute('width'),rect.getAttribute('height'));assert.equal(d.window.document.querySelectorAll('[data-mbb6-contour-level]').length,4);for(const node of d.window.document.querySelectorAll('[data-mbb6-contour-level]')){const level=+node.dataset.mbb6ContourLevel;const vals=node.getAttribute('d').match(/[-\d.]+/g).map(Number);for(let i=0;i<vals.length;i+=2){const a=(vals[i]-88)/((584-88)/3)-1.5,b=(566-vals[i+1])/((566-70)/3)-1.5;near(82+6*a+4*b-3*a*a-2*b*b-2*a*b,level,1e-7);}}}finally{d.window.close();}
});
test('Q149 summaries are not misrepresented as identifying a loss probability',()=>{assert.equal(Q(149).quantitative,false);assert.match(Q(149).why,/not determine|cannot.*determin|not identified/i);});
test('Q131 and Q142 new educational cases remain distinguished from textbook examples',()=>{assert.match(Q(131).stem,/identifiable case data/);assert.match(Q(142).stem,/same recorded/);for(const n of [131,142])assert.match(Q(n).why,/Educational scenario/);});
test('Corrected topic pointers and cognitive classifications are explicit, not fixed quotas',()=>{assert.equal(Q(131).bok.code,'II.D.4');for(const n of [128,134,139])assert.equal(Q(n).cognitive,'Apply');assert.equal(Q(137).cognitive,'Analyze');assert.equal(Q(148).cognitive,'Understand');for(const n of [141,143,144])assert.equal(Q(n).cognitive,'Evaluate');});
test('All 25 conditions and rationales match only Q126–150',()=>{const d=dom(),ui=d.window.__MBBBatch6UI;try{for(const q of all){assert.equal(ui.isQuestion(q),q.batch===6,q.qid);if(q.batch===6){assert.match(ui.conditions(q),/Stated conditions/);assert.match(ui.rationales(q),/Choice D/);}else assert.equal(ui.conditions(q),'');}}finally{d.window.close();}});
test('All nine figures and tables have neutral, semantic evidence and no pre-answer rationale',()=>{const d=dom(),ui=d.window.__MBBBatch6UI;try{for(const q of batch.filter(q=>q.chart)){d.window.document.body.innerHTML=ui.render(q.chart);assert.ok(d.window.document.querySelector('table caption'));assert.ok(d.window.document.querySelector('th[scope="col"]'));assert.ok(d.window.document.querySelector('th[scope="row"]'));assert.equal(d.window.document.querySelectorAll('.mbb6-rationales').length,0);assert.doesNotMatch(d.window.document.body.innerHTML,/undefined|NaN/);}}finally{d.window.close();}});
test('Q134 event marker is vertical and located at Week 5, not on the percentage axis',()=>{const d=dom();try{d.window.document.body.innerHTML=d.window.__MBBBatch6UI.render(Q(134).chart);const markers=[...d.window.document.querySelectorAll('svg line.mbb6-second')];const marker=markers.find(l=>l.getAttribute('x1')===l.getAttribute('x2'));assert.ok(marker);near(+marker.getAttribute('x1'),82+4/9*(668-82));assert.notEqual(marker.getAttribute('y1'),marker.getAttribute('y2'));}finally{d.window.close();}});
test('Native touch selectors and Enter/Space observations work independently in review/retry',()=>{const d=dom(),ui=d.window.__MBBBatch6UI;try{for(const n of [134,147]){d.window.document.body.innerHTML=ui.render(Q(n).chart);const select=d.window.document.querySelector('select');select.value='1';select.dispatchEvent(new d.window.Event('change',{bubbles:true}));assert.equal(d.window.document.querySelector('[data-mbb6-readout]').textContent,select.options[1].textContent);for(const key of ['Enter',' ']){d.window.document.querySelector('[data-mbb6-point="0"]').dispatchEvent(new d.window.KeyboardEvent('keydown',{key,bubbles:true}));assert.equal(select.value,'0');}}}finally{d.window.close();}});
test('Capacity what-if resets to ten without leaking M+B or changing the scored baseline',()=>{const d=dom();try{d.window.document.body.innerHTML=d.window.__MBBBatch6UI.render(Q(130).chart);const input=d.window.document.querySelector('input');input.value='12';input.dispatchEvent(new d.window.Event('input',{bubbles:true}));assert.match(d.window.document.querySelector('output').textContent,/12 Belt-months/);d.window.document.querySelector('button').click();assert.equal(input.value,'10');assert.doesNotMatch(d.window.document.querySelector('.mbb6-capacity').textContent,/M\+B|M plus B|remaining month/);}finally{d.window.close();}});
test('Static fallbacks retain assumptions and data alternatives but remove dead interactive controls',()=>{const d=new JSDOM(read('test-bank-assets/mbb-160/batch-06/static-fallbacks.html'));try{assert.equal(d.window.document.querySelectorAll('.fallback-card').length,9);assert.equal(d.window.document.querySelectorAll('input,button,select,[data-mbb6-point]').length,0);assert.equal(d.window.document.querySelectorAll('.mbb6-conditions').length,9);assert.equal(d.window.document.querySelectorAll('.mbb6-rationales').length,0);assert.match(d.window.document.head.textContent,/prefers-color-scheme|data-theme/);}finally{d.window.close();}});
test('Batch 6 generator differentiates data/markup checks from measured browser results',()=>{const val=JSON.parse(read('test-bank-assets/mbb-160/batch-06/validation.json'));for(const row of Object.values(val.questions)){assert.equal(row.validationStatus,'semantic-checks-passed');assert.deepEqual(row.breakpoints,[]);}for(const q of batch.filter(q=>q.visual))assert.deepEqual(q.visual.breakpointsValidated,[]);});
test('150 unaffected records, 24 other assets and 174 keys remain exact; only Q150 is rekeyed',()=>{
 const u7=JSON.parse(read('docs/audits/mbb-set2-batch07/updated-hashes.json'));const p=JSON.parse(read('docs/audits/mbb-set2-batch06/preservation.json'));assert.equal(all.length,175);assert.equal(Object.keys(p.questions_sha256).length,150);assert.equal(Object.keys(p.asset_sha256).length,24);
 for(const q of all)if(q.batch!==6)assert.equal(hash(JSON.stringify(stable(q))),u7.stable_question_sha256[q.qid] || p.questions_sha256[q.qid],q.qid);
 for(const [file,value]of Object.entries(p.asset_sha256))assert.equal(hash(fs.readFileSync(path.join(root,file))),u7.asset_sha256[file] || value,file);
 assert.equal(p.answerPositions[149],1);assert.deepEqual(all.map(q=>q.answer),p.answerPositions.map((a,i)=>i===149?3:a));
});
test('Exact Batch 6 updated hashes reconcile every intentional change for historical preservation tests',()=>{const u=JSON.parse(read('docs/audits/mbb-set2-batch06/updated-hashes.json'));assert.equal(Object.keys(u.question_sha256).length,25);for(const q of batch){assert.equal(hash(JSON.stringify(q)),u.question_sha256[q.qid]);assert.equal(hash(JSON.stringify(stable(q))),u.stable_question_sha256[q.qid]);}});
test('Key length is no longer an almost-universal longest-answer shortcut',()=>{const count=batch.filter(q=>q.options.every((o,i)=>i===q.answer||o.length<q.options[q.answer].length)).length;assert.ok(count<=12,`${count}/25 keys strictly longest; inspect content instead of padding`);});

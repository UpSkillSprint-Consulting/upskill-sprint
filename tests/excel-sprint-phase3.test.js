const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createHash}=require('node:crypto');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const keys=JSON.parse(fs.readFileSync('netlify/functions/_shared/excel-sprint-answers.json'));
const catalog=JSON.parse(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/catalog.json'));
const publicPackage=id=>JSON.parse(fs.readFileSync(`assets/lessons/excel-formula-fluency/sprint/packages/${id}.json`));
const SECRET='phase3-test-only-signing-secret-longer-than-thirty-two-bytes';
const words=v=>typeof v==='string'?v.split(/\s+/).filter(Boolean).length:Array.isArray(v)?v.reduce((n,x)=>n+words(x),0):v&&typeof v==='object'?Object.values(v).reduce((n,x)=>n+words(x),0):0;
const modules=Promise.all([import('../netlify/functions/_shared/excel-sprint-grading.mjs'),import('../netlify/functions/_shared/excel-sprint-certificates.mjs')]);
async function completePath(){const [G]=await modules,tokens=[],expertTokens=[];for(const id of G.PACKAGE_IDS){const r=G.gradeSubmission({packageId:id,predecessorToken:tokens.at(-1),submissions:keys[id].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);tokens.push(r.completionToken);}for(const id of G.EXPERT_IDS){const r=G.gradeSubmission({packageId:id,predecessorToken:expertTokens.at(-1)||tokens[29],submissions:keys[id].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);expertTokens.push(r.completionToken);}return{tokens,expertTokens};}
const round=n=>Math.round((n+Number.EPSILON)*100)/100;

test('all twenty remaining assignments are released with bounded lessons and matching learner workbooks',async()=>{
 const {phase3Packages,ORIENTATION_IDS}=await import('../content/excel-sprint/phase3.mjs'),{randomFor,workbookFingerprint}=await import('../content/excel-sprint/seed.mjs'),[G]=await modules;
 const sources=phase3Packages(randomFor),manifest=JSON.parse(fs.readFileSync('content/excel-sprint/workbooks/manifest.json'));
 assert.equal(sources.length,20);assert.deepEqual(sources,phase3Packages(randomFor));assert.equal(new Set(sources.map(p=>JSON.stringify(p.rows))).size,20);
 assert.equal(catalog.levels.filter(l=>l.available).length,10);assert.equal(G.PACKAGE_IDS.length,50);assert.equal(G.ALL_PACKAGE_IDS.length,53);
 for(const p of sources){const pub=publicPackage(p.id);assert.equal(pub.tasks.length,4);assert.equal(pub.bonus.id,'bonus');assert.ok(pub.lesson.functions.length>=2&&pub.lesson.functions.length<=3);assert.ok(words(pub.lesson)<400);assert.ok(pub.dataset.rowCount>=20&&pub.dataset.rowCount<=60);assert.ok(pub.dataset.rows.every(r=>r.length===pub.dataset.headers.length));assert.ok(p.private.tasks.some(t=>t.alternatives.length));assert.ok(!/"(?:private|answer|model|hints|alternatives)":/.test(JSON.stringify(pub)));
  let end=1;for(const t of [...pub.tasks,pub.bonus]){const m=t.output.match(/^Answers!B(\d+)(?::([A-Z]+)(\d+))?$/);assert.ok(m);assert.ok(+m[1]>end);end=+(m[3]||m[1]);const k=keys[p.id].tasks.find(x=>x.id===t.id)||keys[p.id].bonus;assert.ok(G.validFormula(k.model),`${p.id}/${t.id}`);assert.equal(k.hints.length,3);assert.ok(k.hints[2].includes('____'));for(const f of k.alternatives)assert.ok(G.validFormula(f));if(Array.isArray(k.answer)){assert.equal(k.answer.length,end-Number(m[1])+1);assert.ok(k.answer.every(r=>r.length===k.answer[0].length));}}
  const bytes=fs.readFileSync(`content/excel-sprint/workbooks/${p.id}.xlsx`);assert.deepEqual(bytes,fs.readFileSync(`assets/lessons/excel-formula-fluency/sprint/datasets/${p.id}.xlsx`));assert.equal(manifest[p.id].fingerprint,workbookFingerprint(p));assert.equal(manifest[p.id].sha256,createHash('sha256').update(bytes).digest('hex'));
 }
 for(const [i,id] of ORIENTATION_IDS.entries()){assert.equal(catalog.levels[i+6].orientationPackageId,id);assert.equal(publicPackage(id).orientationReshape,true);}
});

test('releasing the final levels keeps every original core and Expert grading key byte-compatible',async()=>{
 const [G]=await modules;
 for(const [ids,expected] of [[G.EXPERT_CORE_IDS,'23dc0d1392b693fdb42b104b299cd4f8167e052ced054eeb925fe13caee0bbb4'],[G.EXPERT_IDS,'f27813218c6616a0ebfb1651fde5543311a5ac3d5ddbb941368ae83b3441a4f3']]){
  // Stable hashes of the prior release's JSON.stringify output, including every answer and model.
  const selected=Object.fromEntries(ids.map(id=>[id,keys[id]]));assert.equal(createHash('sha256').update(JSON.stringify(selected)).digest('hex'),expected);
 }
 assert.equal(G.CURRICULUM_VERSION,1);
});

test('50-core progress coexists with the fixed 30-core Expert branch and restores all ten milestones',async()=>{
 const [G]=await modules,proofs=await completePath(),verified=G.verifyProgress(proofs,SECRET);
 assert.equal(verified.completions.length,50);assert.equal(verified.expertCompletions.length,3);assert.equal(verified.nextPackageId,null);assert.equal(verified.nextExpertPackageId,null);
 const thirty=G.verifyProgress({...proofs,tokens:proofs.tokens.slice(0,30)},SECRET);assert.equal(thirty.nextPackageId,'L7-A1');assert.equal(thirty.expertCompletions.length,3);
 const state=P.emptyState();state.tokens=proofs.tokens;state.expertTokens=proofs.expertTokens;state.selectedPackageId='L10-A5';const restored=P.applyVerified(P.parseBackup(JSON.stringify(state)),verified.completions,catalog,verified.expertCompletions);
 assert.equal(restored.tokens.length,50);assert.equal(restored.expertTokens.length,3);assert.equal(restored.badges.length,11);assert.ok(restored.badges.includes('Level 10 complete'));
 for(const count of [10,30,49]){const old=G.verifyProgress({tokens:proofs.tokens.slice(0,count)},SECRET);assert.equal(old.nextPackageId,G.PACKAGE_IDS[count]);}
 const body=JSON.stringify(proofs);assert.ok(Buffer.byteLength(body)<65536);assert.deepEqual(await G.readPayload(new Request('https://sprint.example/verify',{method:'POST',headers:{'content-type':'application/json'},body}),['tokens','expertTokens']),proofs);
 assert.throws(()=>G.gradeSubmission({packageId:'EX-A1',predecessorToken:proofs.tokens[49],submissions:keys['EX-A1'].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET),e=>e.status===403);
 assert.throws(()=>G.verifyProgress({...proofs,tokens:[...proofs.tokens.slice(0,30),...proofs.tokens.slice(31)]},SECRET),e=>e.status===403);
});

test('full-path certificates require fifty core proofs and leave older certificate identities and scopes stable',async()=>{
 const [G,C]=await modules,proofs=await completePath(),name='Fictitious Test Learner';
 const full=C.issueCertificate({...proofs,expertTokens:[],award:'full-path',learnerName:name},SECRET);assert.equal(full.certificate.coreCount,50);assert.equal(full.certificate.expertCount,0);assert.deepEqual(full.certificate.corePackageIds,G.PACKAGE_IDS);assert.deepEqual(full.certificate.expertPackageIds,[]);assert.match(full.certificate.scope,/Levels 1–10/);assert.equal(C.verifyCertificate({certificateToken:full.certificateToken},SECRET).verified,true);
 for(const award of ['levels-1-6','expert-track-v1']){const old=C.issueCertificate({...proofs,tokens:proofs.tokens.slice(0,30),award,learnerName:name},SECRET),expanded=C.issueCertificate({...proofs,award,learnerName:name},SECRET);assert.equal(old.certificate.certificateId,expanded.certificate.certificateId);assert.equal(old.certificate.completedAt,expanded.certificate.completedAt);assert.deepEqual(expanded.certificate.corePackageIds,G.EXPERT_CORE_IDS);assert.equal(expanded.certificate.coreCount,30);assert.equal(C.verifyCertificate({certificateToken:old.certificateToken},SECRET).verified,true);}
 for(const count of [30,49])assert.throws(()=>C.issueCertificate({tokens:proofs.tokens.slice(0,count),award:'full-path',learnerName:name},SECRET),e=>e.status===403);
 const [encoded,signature]=full.certificateToken.split('.'),edited=JSON.parse(Buffer.from(encoded,'base64url'));edited.corePackageIds.pop();assert.throws(()=>C.verifyCertificate({certificateToken:Buffer.from(JSON.stringify(edited)).toString('base64url')+'.'+signature},SECRET),e=>e.status===403);
});

test('each advanced Charpy report aggregates numeric duplicates by both identifiers and preserves zero and missing groups',async()=>{
 const [G]=await modules;
 for(const id of ['L7-A3','L8-A5','L9-A2','L10-A5']){const p=publicPackage(id),report=keys[id].tasks[id==='L7-A3'?3:2].answer;assert.equal(report.length,id==='L10-A5'?12:10);assert.equal(new Set(report.map(r=>JSON.stringify(r.slice(0,2)))).size,report.length);assert.ok(report.some(r=>r[0]==='001'));assert.ok(report.some(r=>r[2]===0));assert.ok(report.some(r=>r[3]==='Missing'));
  for(const [sample,heat,lpa,twa] of report)for(const [orientation,value] of [['LPA',lpa],['TWA',twa]]){const measured=p.dataset.rows.filter(r=>r[0]===sample&&r[1]===heat&&r[2].trim().toUpperCase()===orientation&&typeof r[3]==='number').map(r=>r[3]);const expected=measured.length?round(measured.reduce((a,b)=>a+b,0)/measured.length):'Missing';assert.equal(value,expected,`${id}/${sample}/${heat}/${orientation}`);}
  const key=keys[id].tasks[id==='L7-A3'?3:2],corrupt=structuredClone(report),i=corrupt.findIndex(r=>r[3]==='Missing');corrupt[i][3]=0;assert.equal(G.resultsMatch(corrupt,key),false);const swapped=structuredClone(report);[swapped[0],swapped[5]]=[swapped[5],swapped[0]];assert.equal(G.resultsMatch(swapped,key),false);
 }
 const report=keys['L10-A5'].tasks[2].answer;assert.equal(report.find(r=>r[0]==='004'&&r[1]==='TV-H1')[4],'Pass');assert.equal(report.find(r=>r[3]==='Missing')[4],'Review');assert.equal(report.find(r=>r[2]===0)[4],'Hold');
});

test('descriptive statistics use numeric observations and capability uses the separate stated within sigma',()=>{
 const p=publicPackage('L9-A3'),a=p.dataset.rows.map(r=>r[1]).filter(v=>typeof v==='number'),n=a.length,total=a.reduce((n,v)=>n+v,0),variance=(a.reduce((n,v)=>n+v*v,0)-total*total/n)/(n-1);
 assert.ok(Math.abs(keys[p.id].tasks[0].answer-Math.sqrt(variance))<1e-10);assert.ok(a.includes(9.7)&&a.includes(10.3));assert.equal(keys[p.id].tasks[3].answer,a.filter(v=>v<9.7||v>10.3).length);
 const sorted=a.toSorted((x,y)=>x-y),position=(n-1)*.9,left=Math.floor(position),expected=sorted[left]*(1-position+left)+sorted[left+1]*(position-left);assert.equal(keys[p.id].tasks[2].answer,Math.round(expected*1000)/1000);
 const capability=publicPackage('L9-A5'),assumptions=Object.fromEntries(capability.dataset.sheets[0].rows),avg=capability.dataset.rows.reduce((n,r)=>n+r[1],0)/50;
 assert.ok(Math.abs(keys['L9-A5'].tasks[1].answer-(assumptions.USL_mm-assumptions.LSL_mm)/(6*assumptions.Within_sigma_mm))<1e-12);assert.ok(Math.abs(keys['L9-A5'].tasks[2].answer-Math.min(assumptions.USL_mm-avg,avg-assumptions.LSL_mm)/(3*assumptions.Within_sigma_mm))<1e-12);assert.deepEqual(keys['L9-A5'].tasks[3].answer,[[9.84,10.2]]);assert.match(capability.lesson.combine,/individual observations/);assert.match(capability.lesson.combine,/do not prove stability/);
});

test('advanced boundary rules retain ambiguous keys, negative shipments, cost tolerance and independent controls',()=>{
 const lookup=keys['L7-A2'];assert.deepEqual(lookup.tasks[0].answer,[[1],[2],[1],[0],[1],[1]]);assert.equal(lookup.tasks[1].answer[1][0],'Review key');assert.equal(lookup.tasks[1].answer[3][0],'Review key');
 const margin=keys['L8-A2'];assert.equal(margin.tasks[1].answer[1][0],'Zero revenue');assert.equal(margin.tasks[1].answer[4][0],'Missing');assert.equal(keys['L8-A3'].tasks[0].answer[0][0],'Missing');assert.ok(keys['L8-A4'].tasks[0].answer[1][0]<keys['L8-A4'].tasks[0].answer[0][0]);
 const inspection=keys['L10-A1'];assert.equal(inspection.tasks[1].answer[4][0],'Released');assert.equal(inspection.tasks[1].answer[1][0],'Review');assert.equal(inspection.tasks[2].answer[0].slice(0,3).reduce((a,b)=>a+b,0),60);
 const orders=keys['L10-A2'].tasks[1].answer;assert.equal(orders[0][3],-5);assert.equal(orders[0][4],'Over');assert.equal(keys['L10-A2'].tasks[3].answer[0][2],18);assert.equal(keys['L10-A2'].tasks[3].answer[0][3],0);
 assert.equal(keys['L10-A3'].tasks[0].answer[0][0],0);assert.equal(keys['L10-A3'].tasks[1].answer[4][0],'Match');assert.deepEqual(keys['L10-A4'].tasks[3].answer,[[0,0,0]]);assert.ok(keys['L10-A4'].tasks[2].answer.every(r=>r[1]<0));
 const capstone=publicPackage('L10-A5'),report=keys[capstone.id].tasks[2].answer,costs=capstone.dataset.sheets[0].rows,expected=report.filter(r=>r[4]==='Hold').reduce((n,r)=>n+costs.find(c=>c[0]===r[0]&&c[1]===r[1])[2],0);assert.equal(keys[capstone.id].tasks[3].answer[0][3],expected);assert.equal(keys[capstone.id].tasks[3].answer[0].slice(0,3).reduce((a,b)=>a+b,0),12);
});

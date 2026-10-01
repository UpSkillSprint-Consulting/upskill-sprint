const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const SECRET='expert-test-signing-secret-with-more-than-thirty-two-bytes';
const keys=JSON.parse(fs.readFileSync('netlify/functions/_shared/excel-sprint-answers.json'));
const catalog=JSON.parse(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/catalog.json'));
const pub=id=>JSON.parse(fs.readFileSync(`assets/lessons/excel-formula-fluency/sprint/packages/${id}.json`));
const imports=Promise.all([import('../netlify/functions/_shared/excel-sprint-grading.mjs'),import('../netlify/functions/_shared/excel-sprint-certificates.mjs')]);
async function path(count=3,miss=false){
 const [G]=await imports,tokens=[],expertTokens=[];
 for(const id of G.EXPERT_CORE_IDS){const r=G.gradeSubmission({packageId:id,predecessorToken:tokens.at(-1),submissions:keys[id].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);tokens.push(r.completionToken);}
 for(const id of G.EXPERT_IDS.slice(0,count)){
  let receipt;if(miss&&id==='EX-A1')receipt=G.gradeSubmission({packageId:id,predecessorToken:tokens.at(-1),submissions:[{taskId:'t1',formula:'=1',result:'wrong'}]},SECRET).receipt;
  const r=G.gradeSubmission({packageId:id,receipt,predecessorToken:expertTokens.at(-1)||tokens.at(-1),submissions:keys[id].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);expertTokens.push(r.completionToken);
 }
 return{tokens,expertTokens};
}
test('Expert Track requires the fixed Level 6 milestone and sequential same-path capstones',async()=>{
 const [G]=await imports,proofs=await path(1),submit=id=>keys[id].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}));
 assert.throws(()=>G.gradeSubmission({packageId:'EX-A1',submissions:submit('EX-A1')},SECRET),e=>e.status===403);
 assert.throws(()=>G.gradeSubmission({packageId:'EX-A1',predecessorToken:proofs.tokens[9],submissions:submit('EX-A1')},SECRET),e=>e.status===403);
 assert.throws(()=>G.gradeSubmission({packageId:'EX-A3',predecessorToken:proofs.expertTokens[0],submissions:submit('EX-A3')},SECRET),e=>e.status===403);
 const good=G.verifyProgress(proofs,SECRET);assert.equal(good.nextPackageId,'L7-A1');assert.equal(good.nextExpertPackageId,'EX-A2');assert.equal(good.completions.length,30);
 assert.throws(()=>G.verifyProgress({...proofs,tokens:proofs.tokens.slice(0,29)},SECRET),e=>e.status===403);
 const other=await path(1);assert.throws(()=>G.verifyProgress({tokens:proofs.tokens,expertTokens:other.expertTokens},SECRET),e=>e.status===403);
 assert.throws(()=>G.packageSolutions({packageId:'EX-A2',completionToken:proofs.expertTokens[0]},SECRET),e=>e.status===403);
 assert.equal(G.packageSolutions({packageId:'EX-A1',completionToken:proofs.expertTokens[0]},SECRET).tasks.length,4);
});
test('old backups remain valid and Expert Track restores separately from the 50-assignment path',async()=>{
 const [G]=await imports,proofs=await path(),verified=G.verifyProgress(proofs,SECRET),state=P.emptyState();
 delete state.expertTokens;state.tokens=proofs.tokens.slice(0,10);assert.deepEqual(P.parseBackup(JSON.stringify(state)).expertTokens,[]);
 state.tokens=proofs.tokens;state.expertTokens=proofs.expertTokens;state.selectedPackageId='EX-A3';
 const restored=P.applyVerified(P.parseBackup(JSON.stringify(state)),verified.completions,catalog,verified.expertCompletions);
 assert.equal(restored.tokens.length,30);assert.equal(restored.expertTokens.length,3);assert.equal(restored.packages['EX-A3'].score,100);assert.ok(restored.badges.includes('Expert Track complete'));assert.equal(restored.formulas.LET.packageId,'EX-A1');
 assert.equal(P.unlocked('L7-A1',verified.completions,false),false);assert.equal(P.unlocked('EX-A1',verified.completions,true),false);
 assert.throws(()=>P.parseBackup(JSON.stringify({...state,expertTokens:[...proofs.expertTokens,proofs.expertTokens[0]]})),/invalid Expert/);
});
test('certificates require all signed outputs, accept retries, and state the exact released scope',async()=>{
 const [G,C]=await imports,proofs=await path(3,true);
 assert.equal(G.verifyProgress(proofs,SECRET).expertCompletions[0].firstAttemptScore,75);
 const core=C.issueCertificate({...proofs,award:'levels-1-6',learnerName:'Nora Vale'},SECRET),expert=C.issueCertificate({...proofs,award:'expert-track-v1',learnerName:'  José  Vale  '},SECRET);
 assert.equal(core.certificate.coreCount,30);assert.equal(core.certificate.expertCount,0);assert.equal(expert.certificate.learnerName,'José Vale');assert.equal(expert.certificate.expertCount,3);assert.match(expert.certificate.limitations,/self-reported/);assert.match(expert.certificate.scope,/Levels 1–6/);assert.ok(!expert.certificate.corePackageIds.includes('L7-A1'));
 assert.deepEqual(C.verifyCertificate({certificateToken:expert.certificateToken},SECRET).certificate,expert.certificate);
 const again=C.issueCertificate({...proofs,award:'expert-track-v1',learnerName:'José Vale'},SECRET);assert.equal(again.certificate.certificateId,expert.certificate.certificateId);
 assert.throws(()=>C.issueCertificate({...proofs,expertTokens:proofs.expertTokens.slice(0,2),award:'expert-track-v1',learnerName:'Nora'},SECRET),e=>e.status===403);
 assert.throws(()=>C.issueCertificate({tokens:proofs.tokens.slice(0,29),award:'levels-1-6',learnerName:'Nora'},SECRET),e=>e.status===403);
 assert.throws(()=>C.issueCertificate({...proofs,award:'full-path',learnerName:'Nora'},SECRET),e=>e.status===403);
 for(const award of ['constructor','__proto__'])assert.throws(()=>C.issueCertificate({...proofs,award,learnerName:'Nora'},SECRET),e=>e.status===400);
});
test('changed names, scopes, signatures, completion tokens and markup cannot pass certificate verification',async()=>{
 const [,C]=await imports,proofs=await path(),issued=C.issueCertificate({...proofs,award:'expert-track-v1',learnerName:'Nora Vale'},SECRET);
 const [encoded,signature]=issued.certificateToken.split('.'),payload=JSON.parse(Buffer.from(encoded,'base64url'));
 for(const changed of [{...payload,learnerName:'Another Person'},{...payload,coreCount:50},{...payload,scope:'All ten levels'},{...payload,certificateId:'FORGED'}]){
  const tampered=Buffer.from(JSON.stringify(changed)).toString('base64url')+'.'+signature;assert.throws(()=>C.verifyCertificate({certificateToken:tampered},SECRET),e=>e.status===403);
 }
 assert.throws(()=>C.verifyCertificate({certificateToken:proofs.tokens.at(-1)},SECRET),e=>e.status===403);
 assert.throws(()=>C.verifyCertificate({certificateToken:issued.certificateToken},SECRET+'changed'),e=>e.status===403);
 for(const name of ['<img src=x>','A\nB','\u202eNora','123','A'.repeat(81)])assert.throws(()=>C.issueCertificate({...proofs,award:'levels-1-6',learnerName:name},SECRET),e=>e.status===400);
});
test('capstones have independent seeds, bounded blank answer ranges and no public solutions',async()=>{
 const {expertPackages}=await import('../content/excel-sprint/expert.mjs'),{randomFor,workbookFingerprint}=await import('../content/excel-sprint/seed.mjs'),{createHash}=require('node:crypto'),[G]=await imports;
 const sources=expertPackages(randomFor),manifest=JSON.parse(fs.readFileSync('content/excel-sprint/workbooks/manifest.json'));
 assert.deepEqual(sources,expertPackages(randomFor));assert.equal(new Set(sources.map(p=>JSON.stringify(p.rows))).size,3);
 const words=v=>typeof v==='string'?v.split(/\s+/).length:Array.isArray(v)?v.reduce((a,b)=>a+words(b),0):v&&typeof v==='object'?Object.values(v).reduce((a,b)=>a+words(b),0):0;
 for(const source of sources){const p=pub(source.id);assert.equal(p.tasks.length,4);assert.ok(words(p.lesson)<400);assert.equal(p.lesson.functions.length,2);assert.ok(!/"(?:answer|model|private|hints|alternatives)":/.test(JSON.stringify(p)));let end=1;
  for(const t of [...p.tasks,p.bonus]){const range=t.output.match(/^Answers!B(\d+)(?::([A-Z]+)(\d+))?$/);assert.ok(range);assert.ok(+range[1]>end);end=+(range[3]||range[1]);const key=keys[p.id].tasks.find(k=>k.id===t.id)||keys[p.id].bonus;assert.ok(G.validFormula(key.model));if(Array.isArray(key.answer))assert.equal(key.answer.length,end-Number(range[1])+1);}
  const bytes=fs.readFileSync(`assets/lessons/excel-formula-fluency/sprint/datasets/${p.id}.xlsx`);assert.equal(manifest[p.id].fingerprint,workbookFingerprint(source));assert.equal(manifest[p.id].sha256,createHash('sha256').update(bytes).digest('hex'));
 }
});
test('manufacturing release rules expose blank strength, unknown grade and equality boundaries',()=>{
 const p=pub('EX-A1'),statuses=keys[p.id].tasks[1].answer,summary=keys[p.id].tasks[3].answer[0];assert.equal(statuses[0][0],'Released');assert.equal(statuses[4][0],'Review');assert.equal(statuses[5][0],'Review');assert.equal(summary.slice(0,3).reduce((a,b)=>a+b,0),60);
 const queue=keys[p.id].tasks[2].answer;for(let i=1;i<queue.length;i++)assert.ok(queue[i-1][1]>=queue[i][1]);const costs=queue.reduce((n,r)=>n+r[1],0);assert.ok(Math.abs(costs-summary[3])<1e-6);
});
test('duplicate Charpy data aggregates both keys, measured zero and numeric-only replicates',()=>{
 const p=pub('EX-A2'),report=keys[p.id].tasks[3].answer;assert.equal(report.length,20);assert.equal(new Set(report.map(r=>r[0])).size,5);assert.equal(new Set(report.map(r=>JSON.stringify(r.slice(0,2)))).size,20);
 for(const [sample,heat,lpa,twa] of report)for(const [orientation,value] of [['LPA',lpa],['TWA',twa]]){const records=p.dataset.rows.filter(r=>r[0]===sample&&r[1]===heat&&r[2].trim().toUpperCase()===orientation);assert.equal(records.length,2);const energies=records.map(r=>r[3]).filter(v=>typeof v==='number');assert.equal(value,energies.length?Math.round(energies.reduce((a,b)=>a+b,0)/energies.length*100)/100:'Missing');}
 assert.equal(report[0][3],'Missing');assert.equal(report[0][0],'001');assert.ok(p.dataset.rows.some(r=>r[3]===0));assert.equal(keys[p.id].bonus.answer,1);
});
test('inventory dashboard preserves shortages and reconciles independently to source movements',()=>{
 const p=pub('EX-A3'),rows=p.dataset.rows,stock=p.dataset.sheets[0].rows,report=keys[p.id].tasks[1].answer;let net=0;
 for(const r of rows)net+=(r[2].trim().toLowerCase()==='receipt'?1:-1)*r[3];const opening=stock.reduce((n,r)=>n+r[1],0),closing=report.reduce((n,r)=>n+r[5],0);
 assert.deepEqual(keys[p.id].tasks[3].answer,[[net,opening,closing,closing-opening-net]]);assert.ok(report.some(r=>r[5]<0));
 for(const [sku,value,shortage] of keys[p.id].tasks[2].answer){const s=stock.find(s=>s[0]===sku);assert.ok(value<s[2]);assert.equal(shortage,s[2]-value);}
});

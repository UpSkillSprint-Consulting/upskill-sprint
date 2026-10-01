const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const dir=path.join(__dirname,'../assets/lessons/excel-formula-fluency/sprint');
const read=id=>JSON.parse(fs.readFileSync(`${dir}/packages/${id}.json`));
const keys=JSON.parse(fs.readFileSync(path.join(__dirname,'../netlify/functions/_shared/excel-sprint-answers.json')));
const words=value=>typeof value==='string'?value.split(/\s+/).filter(Boolean).length:Array.isArray(value)?value.reduce((n,v)=>n+words(v),0):value&&typeof value==='object'?Object.values(value).reduce((n,v)=>n+words(v),0):0;

test('all twenty new packages meet curriculum, dataset and workbook constraints',async()=>{
 const {phase2Packages}=await import('../content/excel-sprint/phase2.mjs');
 const {randomFor,workbookFingerprint}=await import('../content/excel-sprint/seed.mjs');
 const packages=phase2Packages(randomFor),manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/excel-sprint/workbooks/manifest.json')));
 assert.equal(packages.length,20);assert.deepEqual(packages,phase2Packages(randomFor));
 const unique=new Set();
 for(const source of packages){
  const p=read(source.id),rowLimit=p.level===3?[20,40]:[40,100];
  assert.ok(p.lesson.functions.length>=2);assert.ok(words(p.lesson)<400,`${p.id}: ${words(p.lesson)} words`);
  assert.equal(p.tasks.length,4);assert.equal(p.bonus.id,'bonus');
  assert.ok(p.dataset.rowCount>=rowLimit[0]&&p.dataset.rowCount<=rowLimit[1]);
  assert.ok(p.dataset.rows.every(r=>r.length===p.dataset.headers.length));unique.add(JSON.stringify(p.dataset.rows));
  assert.ok(!/"(?:answer|model|hints|alternatives|private)":/.test(JSON.stringify(p)));
  let last=0;for(const task of [...p.tasks,p.bonus]){const range=task.output.match(/^Answers!B(\d+)(?::([A-Z]+)(\d+))?$/);assert.ok(range,task.output);assert.ok(+range[1]>last);last=+(range[3]||range[1]);const answer=keys[p.id].tasks.find(t=>t.id===task.id)||keys[p.id].bonus;if(Array.isArray(answer.answer))assert.equal(answer.answer.length,last-Number(range[1])+1);assert.ok(!/\[fill down/.test(answer.model));}
  const workbook=fs.readFileSync(`${dir}/datasets/${p.id}.xlsx`),buildSource=fs.readFileSync(path.join(__dirname,`../content/excel-sprint/workbooks/${p.id}.xlsx`));
  assert.deepEqual(workbook,buildSource);assert.equal(manifest[p.id].fingerprint,workbookFingerprint(source));assert.equal(manifest[p.id].sha256,createHash('sha256').update(workbook).digest('hex'));
  for(const sheet of p.dataset.sheets||[]){assert.ok(fs.existsSync(path.join(__dirname,'..',sheet.csv)));assert.ok(sheet.rows.every(r=>r.length===sheet.headers.length));}
 }
 assert.equal(unique.size,20);
 const catalog=JSON.parse(fs.readFileSync(`${dir}/catalog.json`));assert.equal(catalog.levels.filter(l=>l.available).length,6);assert.equal(catalog.levels.flatMap(l=>l.packages).length,50);
});

test('original grading keys and curriculum versions remain compatible with Phase 1 proofs',async()=>{
 const {createPackages}=await import('../content/excel-sprint/curriculum.mjs');const {randomFor}=await import('../content/excel-sprint/seed.mjs');
 for(const p of createPackages(randomFor)){assert.deepEqual(keys[p.id],p.private);assert.equal(keys[p.id].version,1);}
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),secret='old-phase-one-signing-secret-over-thirty-two-bytes';
 let tokens=[];for(const id of G.PACKAGE_IDS.slice(0,10)){const graded=G.gradeSubmission({packageId:id,predecessorToken:tokens.at(-1),submissions:keys[id].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},secret);tokens.push(graded.completionToken);}
 const verified=G.verifyProgress({tokens},secret);assert.equal(verified.nextPackageId,'L3-A1');
 const backup=P.emptyState();backup.tokens=tokens;const catalog=JSON.parse(fs.readFileSync(`${dir}/catalog.json`));
 const restored=P.applyVerified(P.parseBackup(JSON.stringify(backup)),verified.completions,catalog);
 assert.equal(restored.badges.length,2);assert.equal(P.unlocked('L3-A1',verified.completions,true),true);assert.equal(P.unlocked('L3-A2',verified.completions,true),false);
});

test('lookup boundaries, ambiguous keys, text zeros and calendar boundaries have explicit expected results',()=>{
 assert.equal(keys['L3-A4'].tasks[0].answer,1.1);assert.deepEqual(keys['L3-A4'].tasks[2].answer.slice(0,3),[[1.1],[1.5],[2.2]]);assert.equal(keys['L3-A4'].tasks[2].answer[5][0],'Invalid');
 assert.deepEqual(keys['L3-A5'].tasks[0].answer,[[1],[2],[1],[0],[0],[1]]);assert.equal(keys['L3-A5'].tasks[2].answer[1][0],'Review key');
 assert.deepEqual(keys['L4-A2'].tasks[1].answer.map(r=>r[0]),['007','008','009','010','011','012']);
 assert.equal(keys['L4-A4'].tasks[0].answer[0][1],'');assert.match(keys['L4-A5'].tasks[1].answer[0][0],/^\d+\.\d{3}$/);
 assert.equal(keys['L5-A2'].tasks[0].answer[0][0],'2026-02-28');assert.equal(keys['L5-A2'].tasks[2].answer,28);
 const shifts=read('L5-A5').dataset.rows.slice(0,6);shifts.forEach((r,i)=>{const minutes=(r[3]*60+r[4]-r[1]*60-r[2]+1440)%1440;assert.equal(keys['L5-A5'].tasks[1].answer[i][0],Math.round(minutes/60*100)/100);});
});

test('working-day answers independently exclude weekends and both shutdown dates',()=>{
 const rows=read('L5-A3').dataset.rows,holiday=new Set(['2026-09-07','2026-09-16']);
 const work=d=>d.getUTCDay()>0&&d.getUTCDay()<6&&!holiday.has(d.toISOString().slice(0,10));
 for(let i=0;i<6;i++){const r=rows[i],date=new Date(Date.UTC(r[1],r[2]-1,r[3]));let left=r[4],count=work(date)?1:0;while(left){date.setUTCDate(date.getUTCDate()+1);if(work(date)){left--;count++;}}assert.equal(keys['L5-A3'].tasks[1].answer[i][0],date.toISOString().slice(0,10));assert.equal(keys['L5-A3'].tasks[2].answer[i][0],count);}
});

test('Charpy reshaping uses both keys, normalized orientations, and preserves missing energy',async()=>{
 const p=read('L6-A5'),report=keys[p.id].tasks[3].answer,G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs');
 assert.equal(new Set(p.dataset.rows.map(r=>r[0])).size,10);assert.equal(report.length,40);
 assert.equal(new Set(report.map(r=>`${r[0]}|${r[1]}`)).size,40);
 for(const [sample,heat,lpa,twa] of report){for(const [orientation,value] of [['LPA',lpa],['TWA',twa]]){const raw=p.dataset.rows.filter(r=>r[0]===sample&&r[1]===heat&&r[2].trim().toUpperCase()===orientation);assert.equal(raw.length,1);assert.equal(value,raw[0][3]===''?'Missing':raw[0][3]);}}
 assert.equal(report[0][3],'Missing');assert.equal(p.tasks[2].output,'Answers!B48:C87');assert.match(keys[p.id].tasks[3].model,/B48:C87/);
 assert.equal(G.resultsMatch(report,keys[p.id].tasks[3]),true);const corrupt=structuredClone(report);corrupt[0][3]=0;assert.equal(G.resultsMatch(corrupt,keys[p.id].tasks[3]),false);
 const swapped=structuredClone(report);[swapped[0],swapped[10]]=[swapped[10],swapped[0]];assert.equal(G.resultsMatch(swapped,keys[p.id].tasks[3]),false);
});

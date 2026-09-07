// Apply documented construct-level revisions, preserving every other question's bytes.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const dir='docs/audits/mbb-set3-batch02',file=dir+'/duplicate-resolution.json';
const resolution=JSON.parse(fs.readFileSync(file,'utf8'));
if(!resolution.applied){
 const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
 let source=fs.readFileSync('test-bank-mbb-set3.js','utf8');const context={window:{}};vm.runInNewContext(source,context);
 const before=JSON.parse(JSON.stringify(context.window.MBB_SET3));assert.equal(before.length,175);
 const revisions=JSON.parse(fs.readFileSync(dir+'/revisions.json','utf8'));
 const tracker=JSON.parse(fs.readFileSync(dir+'/question-audit-tracker.json','utf8'));
 for(const change of [...resolution.changes].sort((a,b)=>b.number-a.number)){
  assert.ok([26,40].includes(change.number));const index=change.number-1,original=before[index];
  assert.equal(original.qid,change.qid);assert.equal(original.stem,change.expectedStem);assert.equal(original.answer,3);
  const sourceAlignment=[{title:'ASQ Certified Master Black Belt Body of Knowledge',url:'https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf',locator:change.bok}];
  const q={...original,stem:change.stem,options:change.options,why:change.why+' Source alignment: ASQ CMBB Body of Knowledge, '+change.bok+'. The scenario-specific conclusion follows from the stated case.',optionRationales:change.optionRationales,distractors:change.optionRationales,trap:change.trap,auditSources:sourceAlignment};
  const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
  source=source.slice(0,starts[index])+JSON.stringify(q,null,2).split('\n').map(l=>'  '+l).join('\n')+',\n'+source.slice(starts[index+1]);
  const r=revisions.questions.find(r=>r.qid===q.qid);for(const k of ['stem','options','why','optionRationales','trap','bok','findings'])r[k]=change[k];
  const t=tracker.find(t=>t.qid===q.qid);Object.assign(t,{findings:change.findings,independentSolution:change.why,distractorValidation:change.optionRationales,assumptionsAndContext:change.stem,sourceAlignment});
 }
 const after={window:{}};vm.runInNewContext(source,after);assert.equal(after.window.MBB_SET3.length,175);
 for(let i=0;i<175;i++)if(![25,39].includes(i))assert.equal(JSON.stringify(after.window.MBB_SET3[i]),JSON.stringify(before[i]));
 const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(sha(source.slice(0,starts[25])),'5904d0a49809e8e16422784e32e668fce797c760453e9fc351f0ab28801e1eaa');assert.equal(sha(source.slice(starts[50])),'bb1e02717e3b6714ebde7284440a8efb35f1e2148edb205f480d2645e3d4449b');
 const preservation=JSON.parse(fs.readFileSync(dir+'/preservation.json','utf8'));preservation.wholeBankAfter=sha(source);
 resolution.applied=true;resolution.onlyChangedQuestionNumbers=[26,40];
 fs.writeFileSync('test-bank-mbb-set3.js',source);
 for(const [name,data] of [['revisions.json',revisions],['question-audit-tracker.json',tracker],['preservation.json',preservation],['duplicate-resolution.json',resolution]])fs.writeFileSync(dir+'/'+name,JSON.stringify(data,null,2)+'\n');
 console.log('Applied Q26 and Q40 construct-level revisions; other 173 questions preserved.');
}

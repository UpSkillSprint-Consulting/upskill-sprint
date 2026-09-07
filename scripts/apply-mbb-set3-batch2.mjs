// Apply only canonical Set 3 Q26–50. Never writes to main or calls a remote service.
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir='docs/audits/mbb-set3-batch02';
const revisions=JSON.parse(fs.readFileSync(dir+'/revisions.json','utf8'));
const sourcePath='test-bank-mbb-set3.js';
const before=fs.readFileSync(sourcePath,'utf8');
const ctx={window:{}};vm.runInNewContext(before,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3));
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(bank.length,175);assert.equal(revisions.questions.length,25);
assert.equal(digest(JSON.stringify(bank.slice(25,50))),'727549f119c2acde2a720cf5b725f11d53cd742992dd39677009f15883e64291','Q26–50 changed since the reviewed baseline; stop rather than overwrite concurrent work');
const starts=[...before.matchAll(/^  \{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
const prefix=before.slice(0,starts[25]),suffix=before.slice(starts[50]);
assert.equal(digest(prefix),'5904d0a49809e8e16422784e32e668fce797c760453e9fc351f0ab28801e1eaa');
assert.equal(digest(suffix),'bb1e02717e3b6714ebde7284440a8efb35f1e2148edb205f480d2645e3d4449b');
const bok={title:'ASQ Certified Master Black Belt Body of Knowledge',url:'https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf'};
const tracker=[];
for(const [i,r] of revisions.questions.entries()){
 const old=bank[i+25];assert.equal(r.number,i+26);assert.equal(old.qid,r.qid);assert.equal(old.answer,r.answer);assert.ok(!old.chart,'A visual needs individual migration, not silent removal');
 assert.equal(r.options.length,4);assert.equal(r.optionRationales.length,4);
 const auditSources=[{...bok,locator:r.bok}];
 if(r.primarySource)auditSources.push({title:r.primarySource.includes('ahrq')?'AHRQ PSNet: Culture of Safety':'ASQ: DMAIC',url:r.primarySource,locator:r.primarySource.includes('ahrq')?'Measuring and Achieving a Culture of Safety':'When to use DMAIC; DMAIC vs. DMADV'});
 const q={...old,stem:r.stem,options:r.options,answer:r.answer,why:r.why+' Source alignment: ASQ CMBB Body of Knowledge, '+r.bok+'. The scenario-specific conclusion follows from the stated case.',optionRationales:r.optionRationales,distractors:r.optionRationales,trap:r.trap,auditSources};
 bank[i+25]=q;
 const findings=[...r.findings];if(old.why.includes('Organizational Culture and Values Framework')&&!findings.includes('Incorrect II.D title'))findings.push('Incorrect II.D title');
 tracker.push({number:r.number,qid:r.qid,sub:q.sub,status:'Awaiting rendered validation',oldAnswerIndex:old.answer,newAnswerIndex:q.answer,keyIndexChanged:false,originalKeyContentConcerns:[30,32,49].includes(r.number),findings,changedFields:Object.keys(q).filter(k=>JSON.stringify(old[k])!==JSON.stringify(q[k])),independentSolution:r.why,distractorValidation:r.optionRationales,assumptionsAndContext:q.stem,sourceAlignment:auditSources,visuals:{charts:0,tables:0,equations:0,interactiveVisuals:0,status:'Not applicable: text-only item'},renderedValidation:'Pending',empiricalPsychometrics:'Not estimated: no candidate-response dataset was supplied'});
}
const revised=prefix+bank.slice(25,50).map(q=>JSON.stringify(q,null,2).split('\n').map(l=>'  '+l).join('\n')).join(',\n')+',\n'+suffix;
const checked={window:{}};vm.runInNewContext(revised,checked);assert.equal(checked.window.MBB_SET3.length,175);
assert.equal(JSON.stringify(checked.window.MBB_SET3.slice(0,25)),JSON.stringify(ctx.window.MBB_SET3.slice(0,25)));
assert.equal(JSON.stringify(checked.window.MBB_SET3.slice(50)),JSON.stringify(ctx.window.MBB_SET3.slice(50)));
fs.writeFileSync(sourcePath,revised);
const preservation={baselineHead:revisions.baselineHead,baselineRangeSha256:'727549f119c2acde2a720cf5b725f11d53cd742992dd39677009f15883e64291',q1to25RawSha256:digest(prefix),q51to175RawSha256:digest(suffix),wholeBankBefore:digest(before),wholeBankAfter:digest(revised),changedQuestionIds:tracker.map(q=>q.qid),unchangedCount:150,total:175};
fs.writeFileSync(dir+'/preservation.json',JSON.stringify(preservation,null,2)+'\n');
fs.writeFileSync(dir+'/question-audit-tracker.json',JSON.stringify(tracker,null,2)+'\n');
// Reuse the already reviewed presentation contract under a separate, non-colliding namespace.
let ui=fs.readFileSync('test-bank-mbb-set3-batch1-ui.js','utf8').replace('Set 3 canonical Q1–25 only','Set 3 canonical Q26–50 only').replace(/mbbs3b1/g,'mbbs3b2').replace(/MBBSet3Batch1UI/g,'MBBSet3Batch2UI').replace(/mbb-set3-batch1-style/g,'mbb-set3-batch2-style');
ui=ui.replace(/const ids=new Set\([^\n]+;/,'const ids=new Set('+JSON.stringify(tracker.map(q=>q.qid))+');');
assert.ok(ui.includes('mbb:set-3:d2-060'));assert.ok(!ui.includes('mbbs3b1'));fs.writeFileSync('test-bank-mbb-set3-batch2-ui.js',ui);
function patch(file,from,to){let s=fs.readFileSync(file,'utf8');assert.equal(s.split(from).length,2,'Expected one integration anchor in '+file);fs.writeFileSync(file,s.replace(from,to));}
patch('test-bank.html','<script src="/test-bank-mbb-set3-batch1-ui.js"></script>','<script src="/test-bank-mbb-set3-batch1-ui.js"></script>\n<script src="/test-bank-mbb-set3-batch2-ui.js"></script>');
patch('test-bank.html','if(window.__MBBSet3Batch1UI&&window.__MBBSet3Batch1UI.isQuestion(q))return window.__MBBSet3Batch1UI.render(q,review);','if(window.__MBBSet3Batch2UI&&window.__MBBSet3Batch2UI.isQuestion(q))return window.__MBBSet3Batch2UI.render(q,review);\n    if(window.__MBBSet3Batch1UI&&window.__MBBSet3Batch1UI.isQuestion(q))return window.__MBBSet3Batch1UI.render(q,review);');
patch('test-bank.html','if(window.__MBBSet3Batch1UI)window.__MBBSet3Batch1UI.wire(host);','if(window.__MBBSet3Batch1UI)window.__MBBSet3Batch1UI.wire(host);\n    if(window.__MBBSet3Batch2UI)window.__MBBSet3Batch2UI.wire(host);');
patch('test-bank-feedback-loop.js','if(window.__MBBSet3Batch1UI&&window.__MBBSet3Batch1UI.isQuestion(question))return window.__MBBSet3Batch1UI.rationales(question);','if(window.__MBBSet3Batch2UI&&window.__MBBSet3Batch2UI.isQuestion(question))return window.__MBBSet3Batch2UI.rationales(question);\n    if(window.__MBBSet3Batch1UI&&window.__MBBSet3Batch1UI.isQuestion(question))return window.__MBBSet3Batch1UI.rationales(question);');
// The Batch 1 exclusion guard now excludes the newly authorized Batch 2 range, not its own questions.
let t=fs.readFileSync('tests/test-bank-mbb-set3-batch1-audit.test.js','utf8');
t=t.replace('Q26–175 source remains byte-identical','Q51–175 source remains byte-identical').replace('source.slice(starts[25])','source.slice(starts[50])').replace('b55c09425e0b5c6a706127aa9eb5181a58e0983690b880b65113fe63e3014025',digest(suffix));
fs.writeFileSync('tests/test-bank-mbb-set3-batch1-audit.test.js',t);
// Use the actual player for all 25 questions, both themes, question/review states and real controls.
let driver=fs.readFileSync('scripts/audit-mbb-set3-batch1.mjs','utf8').replace(/Q1–25/g,'Q26–50').replace('slice(0,25)','slice(25,50)').replace(/audit-results/g,'audit-results-batch2').replace(/mbbs3b1/g,'mbbs3b2').replace(/number:i\+1/g,'number:i+26').replace(/String\(i\+1\)/g,'String(i+26)');
fs.writeFileSync('scripts/audit-mbb-set3-batch2.mjs',driver);
console.log(JSON.stringify({applied:tracker.length,unchanged:150,ids:tracker.map(q=>q.qid)},null,2));

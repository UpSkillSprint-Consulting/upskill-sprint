#!/usr/bin/env node
/** Offline descriptive CTT pilot analysis: never automatic release approval. */
'use strict';
const fs=require('node:fs'),crypto=require('node:crypto');
function mean(a){return a.reduce((s,x)=>s+x,0)/a.length;}
function variance(a){if(a.length<2)return null;const m=mean(a);return a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1);}
function correlation(a,b){if(a.length<3)return null;const x=variance(a),y=variance(b);if(!x||!y)return null;const mx=mean(a),my=mean(b);return a.reduce((s,v,i)=>s+(v-mx)*(b[i]-my),0)/(a.length-1)/Math.sqrt(x*y);}
function wilson(k,n){if(!n)return null;const z=1.96,p=k/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return [Math.max(0,c-h),Math.min(1,c+h)];}
function analyze(manifest,keyed,attempts){
 if(!manifest||!Array.isArray(manifest.items)||!keyed||!Array.isArray(keyed.items)||!Array.isArray(attempts)||typeof manifest.sourceRevision!=='string'||!manifest.sourceRevision)
  throw Error('Invalid calibration input or missing source revision');
 if(manifest.form&&!['set-1-mock-a','set-1-mock-b'].includes(manifest.form))throw Error('Unexpected calibration form');
 if(keyed.sourceRevision!==undefined&&keyed.sourceRevision!==manifest.sourceRevision)throw Error('Keyed source revision mismatch');
 if(manifest.form==='set-1-mock-b'&&manifest.schema&&manifest.schema!=='nppe-mock-b-review-v1')throw Error('Incorrect Mock B manifest schema');
 if(manifest.form==='set-1-mock-b'&&!manifest.keyedPacketSha256)throw Error('Mock B requires keyed packet integrity hash');
 if(manifest.keyedPacketSha256&&crypto.createHash('sha256').update(JSON.stringify(keyed)).digest('hex')!==manifest.keyedPacketSha256)
  throw Error('Keyed packet digest mismatch');
 const catalog=keyed.items,byId=new Map(catalog.map(q=>[q.id,q]));
 const manifestById=new Map(manifest.items.map(q=>[q.id,q]));
 if(catalog.length!==110||byId.size!==110||manifest.items.length!==110||manifestById.size!==110)throw Error('Expected 110 unique versioned items');
 if(manifest.itemCount!==undefined&&manifest.itemCount!==110)throw Error('Invalid item count in manifest');
 for(const q of catalog){
  const m=manifestById.get(q.id);
  if(!m||m.version!==q.version||m.sha256!==q.sha256||(m.qid!==undefined&&m.qid!==q.qid))throw Error('Manifest mismatch for '+q.id);
  if(!Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>3||!Number.isInteger(q.version)||q.version<1||q.scored===q.simulatedUnscored)
   throw Error('Invalid keyed answer or scoring role for '+q.id);
  if((m.scored!==undefined&&m.scored!==q.scored)||(m.simulatedUnscored!==undefined&&m.simulatedUnscored!==q.simulatedUnscored))
   throw Error('Scoring role mismatch for '+q.id);
 }
 if(manifest.form==='set-1-mock-b')for(let i=0;i<110;i++){
  const id='NPPE-'+(281+i),q=catalog[i];if(q.id!==id||q.qid!==`nppe:set-1:mock-b:${281+i}`)throw Error('Mock B item order/ID mismatch at '+id);
 }
 if((manifest.scored!==undefined&&manifest.scored!==100)||(manifest.simulatedUnscored!==undefined&&manifest.simulatedUnscored!==10))throw Error('Manifest scoring totals mismatch');
 const unique=new Set(),accepted=[],excluded=[];
 for(const a of attempts){
  if(!a||typeof a.attemptId!=='string'||!a.attemptId||unique.has(a.attemptId))throw Error('Missing or duplicate attemptId');
  unique.add(a.attemptId);
  if(!['first_unassisted','repeat','assisted','prior_exposure','accommodated','incomplete'].includes(a.cohort))throw Error('Invalid cohort '+a.attemptId);
  if(typeof a.formRevision!=='string'||a.formRevision!==manifest.sourceRevision)throw Error('Form revision mismatch: '+a.attemptId);
  if(!Array.isArray(a.responses))throw Error('Missing responses');
  const seen=new Set(),response=new Map();
  for(const r of a.responses){
   const q=r&&byId.get(r.itemId);if(!q||seen.has(r.itemId)||r.version!==q.version)throw Error('Invalid item ID/version or duplicate response');
   seen.add(r.itemId);
   if(!['answered','omitted','not_reached'].includes(r.status))throw Error('Invalid missingness status');
   if(r.status==='answered'&&(!Number.isInteger(r.answer)||r.answer<0||r.answer>3))throw Error('Invalid selected answer');
   if(r.status!=='answered'&&r.answer!==null)throw Error('Missing response must use answer:null');
   if(r.seconds!=null&&(!Number.isFinite(r.seconds)||r.seconds<0))throw Error('Invalid time');
   response.set(r.itemId,r);
  }
  if(seen.size!==110)throw Error('All 110 item statuses required for '+a.attemptId);
  if(a.cohort==='first_unassisted')accepted.push({a,response});else excluded.push({attemptId:a.attemptId,reason:a.cohort});
 }
 const scored=catalog.filter(q=>q.scored&&!q.simulatedUnscored);
 if(scored.length!==100)throw Error('Expected 100 scored');
 // Item-rest relationships use the same complete-case population as scored-form
 // reliability. Treating omissions as wrong on the rest score biases correlations.
 const complete=accepted.filter(({response})=>scored.every(q=>response.get(q.id).status==='answered'));
 const completeTotals=complete.map(({response})=>scored.reduce((s,q)=>s+Number(response.get(q.id).answer===q.answerIndex),0));
 const rows=catalog.map(q=>{
  const statuses=accepted.map(({response})=>response.get(q.id));
  const answered=statuses.filter(r=>r.status==='answered'), correct=answered.filter(r=>r.answer===q.answerIndex).length;
  const rest=[],binary=[];
  if(q.scored&&!q.simulatedUnscored)complete.forEach(({response},i)=>{const hit=Number(response.get(q.id).answer===q.answerIndex);binary.push(hit);rest.push(completeTotals[i]-hit);});
  return {itemId:q.id,version:q.version,scored:q.scored,simulatedUnscored:q.simulatedUnscored,
   n:statuses.length,nAnswered:answered.length,correct,proportionCorrect:answered.length?correct/answered.length:null,
   wilson95:wilson(correct,answered.length),correctedItemRest:q.scored&&!q.simulatedUnscored?correlation(binary,rest):null,correctedItemRestN:q.scored&&!q.simulatedUnscored?binary.length:0,
   distractorCounts:[0,1,2,3].map(i=>answered.filter(r=>r.answer===i).length),
   omitted:statuses.filter(r=>r.status==='omitted').length,notReached:statuses.filter(r=>r.status==='not_reached').length,
   meanAnsweredSeconds:answered.some(r=>r.seconds!=null)?mean(answered.filter(r=>r.seconds!=null).map(r=>r.seconds)):null};
 });
 const scoreSets=complete.map(({response})=>scored.map(q=>Number(response.get(q.id).answer===q.answerIndex)));
 const scoreVar=variance(scoreSets.map(s=>s.reduce((a,b)=>a+b,0)));
 const proportions=scored.map((q,i)=>scoreSets.length?mean(scoreSets.map(s=>s[i])):null);
 const kr20=scoreSets.length>=3&&scoreVar>0?(100/99)*(1-proportions.reduce((s,p)=>s+p*(1-p),0)/scoreVar):null;
 return {schema:manifest.form==='set-1-mock-b'?'nppe-mock-b-calibration-v1':'nppe-mock-a-calibration-v1',form:manifest.form||'unidentified-synthetic-fixture',sourceRevision:manifest.sourceRevision,analysis:'descriptive research only; no release decision',totalAttempts:attempts.length,primaryAttempts:accepted.length,excluded,completeScoredAttempts:complete.length,kr20,kr20Note:'Available only for >=3 completely answered primary attempts with nonzero total-score variance; exploratory only',items:rows};
}
if(require.main===module){try{
 const [manifestFile,keyedFile,attemptsFile,outFile]=process.argv.slice(2);if(!outFile)throw Error('Usage: node scripts/nppe-calibrate.cjs manifest.json restricted-keyed/questions.json attempts.json output.json');
 const input=p=>JSON.parse(fs.readFileSync(p,'utf8')),results=analyze(input(manifestFile),input(keyedFile),input(attemptsFile));
 if(fs.existsSync(outFile))throw Error('Refusing to overwrite existing report');fs.writeFileSync(outFile,JSON.stringify(results,null,2)+'\n',{mode:0o600});console.log('Descriptive report:',results.primaryAttempts,'primary attempts');
 }catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={analyze,wilson,correlation};

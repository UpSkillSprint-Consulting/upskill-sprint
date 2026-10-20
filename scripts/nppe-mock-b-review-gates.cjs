#!/usr/bin/env node
/** Offline Mock B human-review metadata checker; cannot authenticate identities or authorize release. */
'use strict';
const fs=require('node:fs');
const present=x=>typeof x==='string'&&x.trim().length>0;
const roles=['technical','legal','distractors','fairnessAccessibility'];
const acceptableSeverity=new Set(['none','minor','observation']);
const blockedNames=new Set(['chatgpt','openai','llm','automated','ai reviewer','not assigned','tbd']);
const human=x=>present(x)&&!blockedNames.has(x.trim().toLowerCase());
const sha256=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
function assess(manifest,review){
 const blockers=[],warnings=[];
 if(manifest?.form!=='set-1-mock-b'||manifest?.itemCount!==110||!Array.isArray(manifest.items)||manifest.items.length!==110)
  return {readyForAdjudication:false,independentReviewMetadataComplete:false,blockerCount:1,blockers:['Invalid 110-item Mock B manifest'],warnings};
 if(!review||review.sourceRevision!==manifest.sourceRevision||!Array.isArray(review.items))
  return {readyForAdjudication:false,independentReviewMetadataComplete:false,blockerCount:1,blockers:['Missing or revision-mismatched reviewer decisions'],warnings};
 if(!sha256(manifest.keyedPacketSha256))blockers.push('Missing or malformed restricted keyed packet SHA-256');
 const expected=new Set(Array.from({length:110},(_,i)=>'NPPE-'+(281+i)));
 const ids=new Set();let scored=0,unscored=0;
 for(const item of manifest.items){
  const number=Number(item?.id?.slice(5));
  if(!expected.has(item?.id)||ids.has(item.id)||!Number.isInteger(item.version)||item.version<1||
   !sha256(item.sha256)||item.qid!==('nppe:set-1:mock-b:'+number))
   blockers.push('Invalid, duplicate or stale manifest item '+(item?.id||'unknown'));
  ids.add(item?.id);
  if(item.scored===true&&item.simulatedUnscored===false)scored++;
  else if(item.scored===false&&item.simulatedUnscored===true)unscored++;
  else blockers.push('Invalid manifest scoring role '+(item?.id||'unknown'));
 }
 if(ids.size!==110||scored!==100||unscored!==10)blockers.push('Manifest item coverage or 100/10 roles changed');
 if(review.items.length!==110)blockers.push('Reviewer decisions must cover 110 items');
 const byId=new Map();
 for(const item of review.items){
  if(!present(item?.itemId)||byId.has(item.itemId)){
   blockers.push('Duplicate or missing reviewer item ID');continue;
  }
  byId.set(item.itemId,item);
 }
 for(const item of manifest.items){
  const r=byId.get(item.id),tag=item.id;
  if(!r){blockers.push(tag+' missing reviewer decision');continue;}
  if(r.version!==item.version||r.itemSha256!==item.sha256){blockers.push(tag+' version/hash mismatch');continue;}
  for(const role of roles){
   const v=r[role];
   if(v?.status!=='approved'){blockers.push(tag+' '+role+' status not approved');continue;}
   if(!human(v.reviewer))blockers.push(tag+' '+role+' missing named human reviewer');
   if(!present(v.qualification)||!present(v.independenceDeclaration)||!present(v.reviewedAt)||!present(v.evidence))
    blockers.push(tag+' '+role+' credentials, independence, date or evidence incomplete');
   if(v.disposition!=='retain'||!acceptableSeverity.has(v.severity))
    blockers.push(tag+' '+role+' unresolved disposition or material finding');
   if(!present(v.findings))blockers.push(tag+' '+role+' rationale/assessment missing');
   if(role==='legal'&&(!present(v.effectiveDate)||!present(v.sourceLocator)||!present(v.jurisdictionChecked)))
    blockers.push(tag+' legal source effective date/locator or jurisdiction not verified');
   if(role==='distractors'&&(!Number.isInteger(v.blindAnswerIndex)||v.blindAnswerIndex<0||v.blindAnswerIndex>3||
    !Array.isArray(v.optionFindings)||v.optionFindings.length!==4||v.optionFindings.some(x=>!present(x))))
    blockers.push(tag+' distractors missing blind key selection or all four option assessments');
  }
  const a=r.adjudication;
  if(a?.status!=='approved'||!human(a.reviewer)||!present(a.qualification)||!present(a.independenceDeclaration)||
   !present(a.reviewedAt)||!present(a.evidence)||!present(a.findings)||!present(a.conflictResolution)||
   a.disposition!=='retain'||!acceptableSeverity.has(a.severity))
   blockers.push(tag+' adjudication incomplete or unresolved');
  const technical=r.technical?.reviewer?.trim().toLowerCase();
  const legal=r.legal?.reviewer?.trim().toLowerCase();
  const editorial=r.distractors?.reviewer?.trim().toLowerCase();
  const adjudicator=a?.reviewer?.trim().toLowerCase();
  if(technical&&legal&&technical===legal)blockers.push(tag+' technical and legal reviewers are not independently separated');
  if(editorial&&(editorial===technical||editorial===legal))blockers.push(tag+' editorial reviewer not independently separated');
  if(adjudicator&&(adjudicator===technical||adjudicator===legal||adjudicator===editorial))
   blockers.push(tag+' adjudication cannot be self-reviewed');
 }
 if(blockers.length===0)warnings.push('Complete metadata is not identity authentication, real candidate calibration, manual accessibility, production verification, or release authorization');
 const complete=blockers.length===0;
 return {readyForAdjudication:complete,independentReviewMetadataComplete:complete,blockerCount:blockers.length,blockers,warnings,revision:manifest.sourceRevision};
}
if(require.main===module){
 try{
  const [manifestFile,decisionsFile]=process.argv.slice(2);
  if(!manifestFile||!decisionsFile)throw Error('Usage: node scripts/nppe-mock-b-review-gates.cjs manifest.json restricted-keyed/review-decisions.json');
  const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),result=assess(read(manifestFile),read(decisionsFile));
  console.log(JSON.stringify({independentReviewMetadataComplete:result.independentReviewMetadataComplete,readyForAdjudication:result.readyForAdjudication,blockerCount:result.blockerCount,revision:result.revision,warnings:result.warnings},null,2));
  if(!result.readyForAdjudication)process.exitCode=2;
 }catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={assess};

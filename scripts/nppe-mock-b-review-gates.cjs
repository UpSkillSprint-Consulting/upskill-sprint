#!/usr/bin/env node
/** Offline Mock B review completeness checker. Cannot authenticate reviewers or authorize release. */
'use strict';
const fs=require('node:fs');
const isText=x=>typeof x==='string'&&x.trim().length>0;
const roles=['technical','legal','distractors','fairnessAccessibility'];
function assess(manifest,review){
 const blockers=[],warnings=[];
 if(manifest?.form!=='set-1-mock-b'||manifest?.itemCount!==110||!Array.isArray(manifest.items)||manifest.items.length!==110)
  return {readyForAdjudication:false,blockers:['Invalid 110-item Mock B manifest'],warnings};
 if(!review||review.sourceRevision!==manifest.sourceRevision||!Array.isArray(review.items))
  return {readyForAdjudication:false,blockers:['Missing or revision-mismatched reviewer decisions'],warnings};
 if(review.items.length!==110)blockers.push('Reviewer decisions must cover 110 items');
 const byId=new Map(),itemIds=new Set();
 for(const item of review.items){
  if(!isText(item?.itemId)||itemIds.has(item.itemId)){blockers.push('Duplicate or missing reviewer item ID');continue}
  itemIds.add(item.itemId);byId.set(item.itemId,item);
 }
 const restricted=new Set(['chatgpt','openai','llm','automated','ai reviewer','not assigned','tbd']);
 for(const item of manifest.items){
  const r=byId.get(item.id),tag=item.id;
  if(!r){blockers.push(tag+' missing reviewer decision');continue}
  if(r.version!==item.version||r.itemSha256!==item.sha256){blockers.push(tag+' version/hash mismatch');continue}
  for(const role of roles){
   const v=r[role];if(v?.status!=='approved'){blockers.push(tag+' '+role+' status not approved');continue}
   if(!isText(v.reviewer)||restricted.has(v.reviewer.trim().toLowerCase()))blockers.push(tag+' '+role+' missing named human reviewer');
   if(role==='technical'||role==='legal'){
    if(!isText(v.qualification)||!isText(v.independenceDeclaration)||!isText(v.reviewedAt)||!isText(v.evidence))
      blockers.push(tag+' '+role+' credentials, independence, date or evidence incomplete');
    if(role==='legal'&&(!isText(v.effectiveDate)||!isText(v.sourceLocator)))
      blockers.push(tag+' legal source effective date/locator not verified');
   }else if(!isText(v.findings))blockers.push(tag+' '+role+' rationale/assessment missing');
  }
  // A single self-certifying name cannot occupy technical, legal and adjudicator
  // positions simultaneously. This verifies metadata separation, not real identity.
  const technicalName=r.technical?.reviewer?.trim().toLowerCase();
  const legalName=r.legal?.reviewer?.trim().toLowerCase();
  const adjudicatorName=r.adjudication?.reviewer?.trim().toLowerCase();
  if(technicalName&&legalName&&technicalName===legalName)
   blockers.push(tag+' technical and legal reviewers are not independently separated');
  if(adjudicatorName&&(adjudicatorName===technicalName||adjudicatorName===legalName))
   blockers.push(tag+' adjudication cannot be self-reviewed');
  if(r.adjudication?.status!=='approved'||!isText(r.adjudication.reviewer)||!isText(r.adjudication.findings))
   blockers.push(tag+' adjudication pending');
 }
 if(blockers.length===0)warnings.push('Complete metadata does not establish actual reviewer independence, official NPPE validity, empirical calibration, accessibility or release authorization');
 return {readyForAdjudication:blockers.length===0,blockerCount:blockers.length,blockers,warnings,revision:manifest.sourceRevision};
}
if(require.main===module){
 try{
  const [manifestFile,decisionsFile]=process.argv.slice(2);
  if(!manifestFile||!decisionsFile)throw Error('Usage: node scripts/nppe-mock-b-review-gates.cjs manifest.json restricted-keyed/review-decisions.json');
  const input=p=>JSON.parse(fs.readFileSync(p,'utf8')),r=assess(input(manifestFile),input(decisionsFile));
  console.log(JSON.stringify({readyForAdjudication:r.readyForAdjudication,blockerCount:r.blockerCount,revision:r.revision,warnings:r.warnings},null,2));
  if(!r.readyForAdjudication)process.exitCode=2;
 }catch(e){console.error(e.message);process.exitCode=1}
}
module.exports={assess};

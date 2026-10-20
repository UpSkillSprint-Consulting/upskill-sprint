#!/usr/bin/env node
/** Mock B private reviewer routing. Slots are VACANT; this is not expert approval. */
'use strict';
const crypto=require('node:crypto');
const digest=q=>crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex');
const historicalCueIds=new Set([291,319,322,329,354,362,372,383]);
const legalSourceIds=new Set([315,336,347,371,389]);
const pools=[
 ['T-POOL','engineering/geoscience SME','All items','Practising qualified P.Eng./P.Geo.'],
 ['L-CAN','law reviewer','Canadian/national/federal','Qualified practising Canadian lawyer'],
 ['L-ON','law reviewer','Ontario','Ontario-law-qualified practising lawyer'],
 ['L-QC','law reviewer','Québec','Québec-civil-law-qualified practising lawyer'],
 ['L-SK','law reviewer','Saskatchewan','Saskatchewan-law-qualified practising lawyer'],
 ['L-BC','law reviewer','British Columbia','BC-law-qualified practising lawyer'],
 ['E-POOL','assessment editor','All items','Independent MCQ item writing expertise'],
 ['F-POOL','accessibility/fairness','All items','Accessibility and fairness assessment expertise'],
 ['A-POOL','independent adjudicator','All items','Qualified reviewer distinct from first pass'],
 ['P-POOL','psychometrician','Later pilot','Qualified psychometrician']
];
function legalPool(j){
 if(typeof j!=='string'||!j.trim())throw Error('Missing item jurisdiction');
 if(/qu[eé]bec/i.test(j))return 'L-QC';
 if(/ontario/i.test(j))return 'L-ON';
 if(/saskatchewan/i.test(j))return 'L-SK';
 if(/british columbia|\bBC\b|\bB\.C\./i.test(j))return 'L-BC';
 return 'L-CAN';
}
function prepareAssignments(items,manifest){
 if(manifest?.form!=='set-1-mock-b'||!Array.isArray(manifest.items)||manifest.items.length!==110||
 !/^[a-f0-9]{40}$/.test(manifest.sourceRevision||'')||!Array.isArray(items)||items.length!==110)
  throw Error('Expected 110 source items and a pinned Mock B manifest');
 const queue=[['item_id','qid','version','item_sha256','source_revision','blueprint','jurisdiction',
 'legal_pool','technical_pool','editorial_pool','fairness_pool','adjudicator_pool','priority','priority_reason',
 'technical_assignment','legal_assignment','editorial_assignment','fairness_assignment','adjudicator_assignment',
 'blind_review','technical_review','legal_review','editorial_review','fairness_review','adjudication',
 'unresolved_issue','disposition','evidence_locator']];
 const blind=[['item_id','qid','version','item_sha256','reviewer_id','review_date','blind_best_answer_index',
 'option_A_assessment','option_B_assessment','option_C_assessment','option_D_assessment',
 'one_best_answer_reasoning','severity','disposition','evidence_locator']];
 const roster=[['pool_id','role','jurisdiction_or_scope','minimum_qualification','named_reviewer',
 'licensing_regulator','licence_or_credential_reference','credential_status_confirmed','identity_verified',
 'independence_conflict_declaration','confidentiality_agreement','secure_access_approved',
 'engagement_accepted','assignment_status','verification_evidence']];
 for(const p of pools)roster.push([...p,'','','','pending','pending','pending','pending','pending','pending','unassigned','']);
 const rows=[],counts={};
 for(let i=0;i<110;i++){
  const q=items[i],m=manifest.items[i],n=281+i,id='NPPE-'+n;
  if(q?.legacyId!==id||m?.id!==id||m?.qid!==q.qid||m?.version!==q.version||
  m.sha256!==digest(q)||q.form!=='set-1-mock-b'||q.releaseStatus!=='held')
   throw Error('Changed or unpinned review item '+id);
  const legal=legalPool(q.jurisdiction);counts[legal]=(counts[legal]||0)+1;
  const reason=historicalCueIds.has(n)?'historical_cue_author_revised':
   legalSourceIds.has(n)?'legal_source_priority':'standard_review';
  const priority=reason==='standard_review'?'P2':'P1';
  rows.push({id,qid:q.qid,version:q.version,sha256:m.sha256,sourceRevision:manifest.sourceRevision,
   legalPool:legal,priority,priorityReason:reason,stage:'awaiting_reviewer_assignment'});
  queue.push([id,q.qid,q.version,m.sha256,manifest.sourceRevision,q.blueprint,q.jurisdiction,
   legal,'T-POOL','E-POOL','F-POOL','A-POOL',priority,reason,...Array(5).fill('unassigned'),
   ...Array(6).fill('pending'),'unassessed','pending','']);
  blind.push([id,q.qid,q.version,m.sha256,'','','','','','','','','unassessed','pending','']);
 }
 return {rows,queue,blind,roster,counts};
}
module.exports={prepareAssignments,legalPool,historicalCueIds,legalSourceIds,pools};

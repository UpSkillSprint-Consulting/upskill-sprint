'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {items}=require('../scripts/nppe-mock-b-review-packets.cjs');
const {assess}=require('../scripts/nppe-mock-b-review-gates.cjs');
function pending(){
 const questions=items(),rev='synthetic-review-test-only';
 const manifest={form:'set-1-mock-b',itemCount:110,sourceRevision:rev,items:questions.map(q=>({id:q.legacyId,version:q.version,sha256:crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex')}))};
 const review={sourceRevision:rev,items:manifest.items.map(q=>({itemId:q.id,version:q.version,itemSha256:q.sha256,technical:{status:'pending'},legal:{status:'pending'},distractors:{status:'pending'},fairnessAccessibility:{status:'pending'},adjudication:{status:'pending'}}))};
 return {manifest,review};
}
test('new Mock B SME/legal packets remain blocked by default',()=>{
 const x=pending(),status=assess(x.manifest,x.review);
 assert.equal(status.readyForAdjudication,false);
 assert.ok(status.blockerCount>=110*5);
});
test('stale review versions and missing items cannot pass',()=>{
 const x=pending();x.review.items[0].version++;
 x.review.items.pop();
 let r=assess(x.manifest,x.review);
 assert.equal(r.readyForAdjudication,false);
 assert.ok(r.blockers.some(t=>/version\/hash mismatch/.test(t)));
 assert.ok(r.blockers.some(t=>/missing reviewer decision/.test(t)));
});
test('status changes alone are not approval without reviewer credentials and evidence',()=>{
 const x=pending();
 for(const q of x.review.items)for(const role of ['technical','legal','distractors','fairnessAccessibility'])
  q[role]={status:'approved',reviewer:'ChatGPT'};
 for(const q of x.review.items)q.adjudication={status:'approved',reviewer:'ChatGPT'};
 const r=assess(x.manifest,x.review);
 assert.equal(r.readyForAdjudication,false);
 assert.ok(r.blockers.some(t=>/missing named human reviewer/.test(t)));
 assert.ok(r.blockers.some(t=>/effective date\/locator/.test(t)));
});

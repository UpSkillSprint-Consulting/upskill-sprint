'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Q77 arithmetic has natural line-break opportunities without changing the calculation',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3.js'),c);
 const q=c.window.MBB_SET3[76];assert.equal(q.qid,'mbb:set-3:d3-047');
 assert.ok(q.why.includes('$350,000 + $40,000 + $15,000 + $20,000 = $425,000'));
 assert.ok(!q.why.includes('$350,000+$40,000'));
 assert.equal(q.answer,1);assert.match(q.options[q.answer],/485,000.*425,000/);
});
test('Batch 4 mobile learning-point wrapping is scoped to the audited review cards',()=>{
 const css=read('test-bank-mbb-set3-batch4-ui.js');
 assert.ok(css.includes('.tb-review-card:has(.mbbs3b4-question) .tb-key-point,.tb-review-card:has(.mbbs3b4-question) .tb-exam-trap{overflow-wrap:anywhere;min-width:0}'));
 assert.ok(css.includes('.mbbs3b4-scroll-hint'));
 assert.ok(css.includes('.tb-report-box[hidden]{display:none!important}'));
});
test('Rendered checks cover secondary feedback cards and log settled keyboard scroll movement',()=>{
 const driver=read('scripts/audit-mbb-set3-batch4.mjs');
 assert.ok(driver.includes('.tb-explanation-copy,.tb-key-point,.tb-exam-trap,.tb-deep-label,.tb-accuracy-note,th,td,dd'));
 assert.ok(driver.includes('keyboardScroll.moved=await area.evaluate(e=>e.scrollLeft>0);assert.ok(keyboardScroll.moved);'));
 assert.ok(driver.includes('tableCellsVerified:true'));
});

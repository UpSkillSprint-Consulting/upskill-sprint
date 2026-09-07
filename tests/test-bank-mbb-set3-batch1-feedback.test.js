'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'test-bank-mbb-set3.js'),'utf8'),context);
const questions=JSON.parse(JSON.stringify(context.window.MBB_SET3)).slice(0,25);
for(const [i,q] of questions.entries())test(`Q${i+1} stores reviewed reading guidance and every distractor explanation`,()=>{
 assert.ok(q.trap.length>=100);assert.doesNotMatch(q.trap,/The controlling word is/);
 assert.deepEqual(q.distractors,q.optionRationales);
 const wrong=q.options.map((_,j)=>j).filter(j=>j!==q.answer);
 assert.equal(wrong.length,3);assert.ok(wrong.every(j=>q.distractors[j].length>=35));
});
test('scoped issue-form styling respects the native hidden state',()=>{
 const s=fs.readFileSync(path.join(root,'test-bank-mbb-set3-batch1-ui.js'),'utf8');
 assert.ok(s.includes('.tb-review-card:has(.mbbs3b1-question) .tb-report-box[hidden]{display:none!important}'));
 assert.ok(s.includes('.tb-review-card:has(.mbbs3b1-question) .tb-quality-details{color:var(--ink)!important;line-height:1.6}'));
});
test('browser audit checks reviewed hints, expanded feedback and non-sending issue-report workflow',()=>{
 const s=fs.readFileSync(path.join(root,'scripts/audit-mbb-set3-batch1.mjs'),'utf8');
 for(const token of ['q.trap',"'.tb-distractor-row'","'.tb-quality-details summary'","'[data-report-note]'","mail.startsWith('mailto:')",'preparedUnsentReport:true','async function stableClick(locator)','await locator.click()'])assert.ok(s.includes(token),token);
 assert.ok(s.includes('header.site{visibility:hidden!important}'));
 assert.ok(!s.includes('header.site{position:relative!important'));
 assert.doesNotMatch(s,/force\s*:\s*true|dispatchEvent\(['"]click/);
});
test('Set 3 presentation cannot reuse the existing Set 2 batch 3 CSS namespace',()=>{
 const current=fs.readFileSync(path.join(root,'test-bank-mbb-set3-batch1-ui.js'),'utf8');
 const legacy=fs.readFileSync(path.join(root,'test-bank-mbb-batch3-ui.js'),'utf8');
 assert.ok(legacy.includes('.mbb3-table'));
 assert.ok(current.includes('.mbbs3b1-table'));
 assert.ok(!current.includes('mbb3-'));
 assert.ok(!legacy.includes('mbbs3b1-'));
});

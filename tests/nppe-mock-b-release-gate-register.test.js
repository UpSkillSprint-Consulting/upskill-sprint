'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=x=>fs.readFileSync(path.join(root,x),'utf8');
const {items}=require('../scripts/nppe-mock-b-review-packets.cjs');
test('Mock B release gate register preserves all independent human and security blockers',()=>{
 const register=read('docs/nppe-mock-b-release-gate-register.md');
 const gates=Array.from(register.matchAll(/\| B-(\d{2}) —/g),x=>x[1]);
 assert.deepEqual(gates,Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')));
 for(const marker of ['RELEASE HELD','PENDING','Mock A','Mock B','Canadian law','psychometrician','NVDA','VoiceOver','revoke','releaseHold:true'])
  assert.ok(register.includes(marker),'Missing gate information: '+marker);
 const questions=items();
 assert.equal(questions.length,110);
 assert.ok(questions.every(q=>q.releaseStatus==='held'&&q.form==='set-1-mock-b'));
 assert.equal(questions.filter(q=>q.scored).length,100);
 assert.equal(questions.filter(q=>q.experimental).length,10);
 assert.match(read('test-bank.html'),/releaseHold:true/);
});

test('reviewer recruitment is only a vacant, private-process preparation step',()=>{
 const operations=read('docs/nppe-mock-b-independent-review-recruitment-and-adjudication.md');
 const invitation=read('docs/nppe-mock-b-reviewer-recruitment-invitation-kit.md');
 for(const code of ['T-POOL','L-CAN','L-ON','L-QC','L-SK','L-BC','E-POOL','F-POOL','A-POOL','P-POOL'])
  assert.ok(operations.includes(code),'Missing reviewer pool '+code);
 assert.match(operations,/no individuals have been engaged/i);
 assert.match(operations,/NPPE-291, NPPE-319, NPPE-322, NPPE-329, NPPE-354, NPPE-362, NPPE-372 and NPPE-383/);
 assert.match(invitation,/NOT SENT/);
 assert.match(invitation,/No reviewers have accepted/);
 assert.match(invitation,/Do not store responses.*in GitHub/i);
});

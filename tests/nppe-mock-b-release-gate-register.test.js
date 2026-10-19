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

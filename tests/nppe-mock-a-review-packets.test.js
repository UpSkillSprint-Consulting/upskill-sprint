'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {items,build}=require('../scripts/nppe-mock-a-review-packets.cjs');
test('review exporter preserves 110 canonical question versions and scoring roles',()=>{
 const q=items();assert.equal(q.length,110);
 assert.equal(q.filter(x=>x.scored).length,100);
 assert.equal(q.filter(x=>x.experimental).length,10);
 assert.equal(q[0].legacyId,'NPPE-171');assert.equal(q[109].legacyId,'NPPE-280');
});
test('blind and keyed review packets are separated and pending by default',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-review-'));
 try{
  const dest=path.join(temp,'packets'),m=build(dest);
  const blind=JSON.parse(fs.readFileSync(path.join(dest,'blind/questions.json'),'utf8'));
  const keyed=JSON.parse(fs.readFileSync(path.join(dest,'restricted-keyed/questions.json'),'utf8'));
  const ledger=fs.readFileSync(path.join(dest,'review-ledger.csv'),'utf8');
  assert.equal(m.itemCount,110);assert.equal(m.items.length,110);
  assert.equal(blind.items.length,110);assert.equal(keyed.items.length,110);
  assert.ok(m.items.every(x=>/^[a-f0-9]{64}$/.test(x.sha256)));
  assert.ok(blind.items.every(q=>!('answerIndex'in q)&&!('correctOption'in q)&&!('optionRationales'in q)&&!('sources'in q)&&!('keyPoint'in q)));
  assert.ok(keyed.items.every(q=>Number.isInteger(q.answerIndex)&&q.optionRationales.length===4&&q.sources.length>0));
  assert.equal(ledger.split('\n').filter(Boolean).length,111);
  assert.equal((ledger.match(/"pending"/g)||[]).length,110);
  assert.throws(()=>build(dest),/empty/);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('review exporter never writes packets inside publicly tracked repository',()=>{
 assert.throws(()=>build(path.join(__dirname,'..','public-site','nppe-review')),/outside the public repository/);
});

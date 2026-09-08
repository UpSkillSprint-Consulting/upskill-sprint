'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {Clock,Service,device,completed,EXAMS,EPOCH,copy}=require('./helpers/segment03-harness.cjs');
const fixture=(t,service,options)=>{const d=device(service,options);t.after(d.close);return d;};

test('framework: deterministic clocks separate wall shifts, suspension and scheduled work',()=>{
  const c=new Clock(1000),out=[];c.setTimeout(()=>out.push(c.mono),100);
  c.advance(50);c.shiftWall(-10000);assert.equal(c.mono,50);assert.equal(c.wall,-8950);
  c.advance(100,false);assert.deepEqual(out,[]);c.advance(0);assert.deepEqual(out,[150]);
});
for(const exam of EXAMS) test(`sentinel: ${exam} real ledger counts blanks and idempotent completion correctly`,async t=>{
  const svc=new Service(),d=fixture(t,svc,{exam,mutation:process.env.SEG03_MUTATION||null});
  const first=completed(d);assert.equal(first.saved,true);assert.equal(first.correct,1);assert.equal(first.total,3);
  completed(d);const s=d.api.summary(exam,{},d.questions.map(q=>q.qid));
  assert.equal(s.answeredEvents,2,'COUNT_SENTINEL');assert.equal(s.completedSessions,1);assert.equal(s.uniqueSeen,3);
});
test('sentinel: a second independent device receives the real ledger through sync',async t=>{
  const svc=new Service(),a=fixture(t,svc),b=fixture(t,svc,{id:'fixture-device-b',mutation:process.env.SEG03_MUTATION||null});
  completed(a);await a.api.sync('fixture-upload');await b.api.sync('fixture-download');
  assert.equal(b.api.summary('cssbb',{},b.questions.map(q=>q.qid)).answeredEvents,2,'SYNC_SENTINEL');
  assert.equal(b.api.summary('cssbb').completedSessions,1);
});
test('runtime: failed upload before commit stays pending; offline restart and reconnect recover',async t=>{
  const svc=new Service(),a=fixture(t,svc);a.setOnline(false);completed(a);
  const state=a.snapshot(),b=fixture(t,svc,{storage:state});b.setOnline(false);
  assert.equal((await b.api.sync('offline')).reason,'offline');assert.equal(svc.rows.size,0);
  b.setOnline(true);svc.failNext('before_commit');await assert.rejects(b.api.sync('failed'),e=>/precommit/.test(e.message));
  assert.ok(b.api.status().pending>0);await b.api.sync('reconnect');assert.equal(b.api.status().pending,0);
  assert.equal(b.api.summary('cssbb').answeredEvents,2);
});
test('runtime: lost acknowledgement after server commit retries without duplicate evidence',async t=>{
  const svc=new Service(),a=fixture(t,svc);completed(a);svc.failNext('after_commit');
  await assert.rejects(a.api.sync('lost-ack'),e=>/acknowledgement/.test(e.message));const count=svc.rows.size;
  assert.ok(count>0);assert.ok(a.api.status().pending>0);await a.api.sync('retry');
  assert.equal(svc.rows.size,count);assert.equal(a.api.status().pending,0);
  const b=fixture(t,svc,{id:'fixture-device-b'});svc.reverse=true;await b.api.sync('reordered');
  assert.equal(b.api.summary('cssbb').answeredEvents,2);assert.equal(b.api.summary('cssbb').completedSessions,1);
});
test('runtime: denied storage does not acknowledge a safely saved completion',t=>{
  const a=fixture(t,new Service());a.api.startSession({examId:'cssbb',sessionId:'storage-fixture',questions:a.questions});
  a.denyStorage(true);const result=a.api.completeSession({examId:'cssbb',sessionId:'storage-fixture',records:[{question:a.questions[0],selected:0,status:'correct'}]});
  assert.equal(result.saved,false);assert.equal(a.api.status().writeAheadSaved,false);
  a.denyStorage(false);assert.equal(a.api.completeSession({examId:'cssbb',sessionId:'storage-fixture'}).saved,true);
});
test('runtime: pending evidence belongs to its original owner, not the next signed-in user',async t=>{
  const svc=new Service(),a=fixture(t,svc);completed(a);a.setOwner('fixture-owner-b');
  await a.api.sync('owner-switch');assert.equal(svc.rows.size,0);assert.equal(a.api.summary('cssbb').answeredEvents,0);
  a.setOwner('fixture-owner-a');await a.api.sync('owner-return');assert.ok(svc.rows.size>0);
  assert.ok([...svc.rows.values()].every(r=>r.user_id==='fixture-owner-a'));
});
test('runtime: >500 remote rows paginate and late older answer-time does not evade received cursor',async t=>{
  const svc=new Service(),d=fixture(t,svc);const owner='fixture-owner-a';
  for(let i=0;i<1001;i++)svc.rows.set(`${owner}|remote-${i}`,{user_id:owner,event_id:`remote-event-${String(i).padStart(5,'0')}`,device_id:'fixture-device-z',exam_id:'cssbb',session_id:'remote-session',event_type:'question_exposed',question_id:`cssbb:remote:${i}`,occurred_at:new Date(EPOCH-50000).toISOString(),received_at:new Date(EPOCH+i).toISOString(),payload:{}});
  await d.api.sync('pages');assert.equal(d.api.seenQuestionIds('cssbb').length,1001);
  const reads=svc.calls.filter(c=>c.kind==='read');assert.deepEqual(reads.map(r=>r.from),[0,500,1000]);
  svc.rows.set(`${owner}|late-event`,{...copy([...svc.rows.values()][0]),event_id:'late-event',question_id:'cssbb:remote:late',occurred_at:new Date(EPOCH-1000000).toISOString(),received_at:new Date(EPOCH+2000).toISOString()});
  await d.api.sync('tail');assert.equal(d.api.seenQuestionIds('cssbb').length,1002);
  assert.ok(svc.calls.filter(c=>c.kind==='read').at(-1).since);
});
test('runtime: old snapshot plus new canonical snapshot preserves counts and repeated merge is stable',t=>{
  const d=fixture(t,new Service());d.w.eval(fs.readFileSync(path.join(__dirname,'../test-bank-account-sync.js'),'utf8'));
  const q='cssbb:fixture:0';const old={version:1,exams:{cssbb:{questions:{[q]:{attempts:2,correct:1,incorrect:1,history:[{id:'old-a',at:100,status:'correct'},{id:'old-b',at:200,status:'incorrect'}]}}}}};
  const modern={version:1,exams:{cssbb:{questions:{[q]:{attempts:3,correct:2,incorrect:1,history:[...old.exams.cssbb.questions[q].history,{id:'new-c',at:300,status:'correct'}]}}}}};
  const merge=d.w.__TBAccountSync.mergeMastery;
  const once=copy(merge(old,modern)),twice=copy(merge(once,modern));
  assert.deepEqual(twice,once);assert.equal(once.exams.cssbb.questions[q].attempts,3);
});

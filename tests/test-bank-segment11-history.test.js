'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const H=require('../test-bank-history-policy.js');

const REGINA='America/Regina';
const T=Date.parse('2026-09-08T05:30:00.000Z');

test('11 reporting day uses one explicit timezone rather than UTC/local mixing',()=>{
  assert.equal(H.reportingDay(T,'UTC'),'2026-09-08');
  assert.equal(H.reportingDay(T,REGINA),'2026-09-07');
});

test('11 calendar keys remain consecutive across daylight-saving boundaries',()=>{
  const end=H.reportingDay(Date.parse('2026-03-09T12:00:00Z'),'America/Toronto');
  assert.deepEqual(H.calendarKeysEnding(end,4),['2026-03-06','2026-03-07','2026-03-08','2026-03-09']);
});

test('11 practice trend excludes eligible full exams and keeps practice sessions',()=>{
  const attempts=[
    {id:'quick',at:1,mode:'quick',source:'quick-quiz',total:10,correct:8},
    {id:'exam',at:2,mode:'exam',timed:true,total:100,correct:80},
    {id:'adaptive',at:3,mode:'adaptive',source:'adaptive-practice',total:10,correct:9}
  ];
  const rows=H.practiceTrend({attempts,examId:'mbb',assessAttempt:e=>({available:true,eligible:e.id==='exam',scorePercent:100*e.correct/e.total})});
  assert.deepEqual(rows.map(x=>x.id),['quick','adaptive']);
});

test('11 activity uses final answer-event timestamps, not session completion day',()=>{
  const events=[
    {id:'a1',type:'answer_recorded',sessionId:'s1',questionId:'q1',occurredAt:Date.parse('2026-09-08T05:30:00Z'),payload:{status:'correct'}},
    {id:'a2',type:'answer_recorded',sessionId:'s1',questionId:'q2',occurredAt:Date.parse('2026-09-08T06:30:00Z'),payload:{status:'incorrect'}}
  ];
  const attempts=[{id:'s1',at:Date.parse('2026-09-09T15:00:00Z'),answered:2}];
  const out=H.answerActivity({events,attempts,timeZone:REGINA,weeks:1,now:Date.parse('2026-09-09T12:00:00Z')});
  const map=Object.fromEntries(out.days.map(x=>[x.key,x.count]));
  assert.equal(map['2026-09-07'],1);assert.equal(map['2026-09-08'],1);assert.equal(map['2026-09-09'],0);
  assert.equal(out.unknownAnswers,0);
});

test('11 answer revisions in one session/question count once on the final response day',()=>{
  const events=[
    {id:'a',type:'answer_recorded',sessionId:'s',questionId:'q',occurredAt:Date.parse('2026-09-07T12:00:00Z'),payload:{status:'incorrect'}},
    {id:'b',type:'answer_recorded',sessionId:'s',questionId:'q',occurredAt:Date.parse('2026-09-08T12:00:00Z'),payload:{status:'correct'}}
  ];
  const out=H.answerActivity({events,attempts:[{id:'s',answered:1}],timeZone:'UTC',weeks:1,now:Date.parse('2026-09-09T12:00:00Z')});
  const map=Object.fromEntries(out.days.map(x=>[x.key,x.count]));
  assert.equal(map['2026-09-07'],0);assert.equal(map['2026-09-08'],1);assert.equal(out.knownAnswers,1);
});

test('11 missing legacy answer dates remain unknown instead of being assigned to completion day',()=>{
  const out=H.answerActivity({events:[],attempts:[{id:'legacy',at:T,answered:7}],timeZone:REGINA,weeks:1,now:T});
  assert.equal(out.knownAnswers,0);assert.equal(out.unknownAnswers,7);assert.equal(out.complete,false);
  assert.equal(out.days.reduce((s,x)=>s+x.count,0),0);
});

test('11 attempts without a reliable answered count disclose unknown-session evidence',()=>{
  const out=H.answerActivity({events:[],attempts:[{id:'legacy',at:T,total:20}],timeZone:'UTC',weeks:1,now:T});
  assert.equal(out.unknownSessions,1);assert.equal(out.complete,false);
});

test('11 reporting timezone is taken from the newest pinned attempt and otherwise UTC',()=>{
  const attempts=[{at:1,versionPin:{reportingTimeZoneAtStart:'UTC'}},{at:2,versionPin:{reportingTimeZoneAtStart:REGINA}}];
  assert.equal(H.pickReportingTimeZone(attempts),'America/Regina');
  assert.equal(H.pickReportingTimeZone([]),'UTC');
});

test('11 invalid timezones fail closed',()=>{
  assert.equal(H.validTimeZone('not/a/timezone'),false);
  assert.throws(()=>H.reportingDay(T,'not/a/timezone'),/Invalid reporting timezone/);
});

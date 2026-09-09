'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.join(__dirname,'..');
function src(name){return fs.readFileSync(path.join(ROOT,name),'utf8');}

test('11 learning ledger exposes bounded owner-scoped history pagination and complete export',()=>{
  const s=src('test-bank-learning-events.js');
  assert.match(s,/async function historyPage\(input\)/);
  assert.match(s,/\.eq\('user_id', user\.id\)/);
  assert.match(s,/\.eq\('exam_id', requestedExamId\)/);
  assert.match(s,/order\('received_at'.*order\('event_id'/s);
  assert.match(s,/Math\.min\(200/);
  assert.match(s,/async function exportHistory\(input\)/);
  assert.match(s,/localCacheIsNotLifetimeBoundary:true/);
  assert.match(s,/historyPage: historyPage/);
  assert.match(s,/exportHistory: exportHistory/);
});

test('11 analytics separates practice trend from full-exam trend and uses answer activity policy',()=>{
  const s=src('test-bank-analytics-dashboard.js');
  assert.match(s,/function practiceSessionTrend\(limit\)/);
  assert.match(s,/function studyActivity\(weeks\)/);
  assert.match(s,/practiceSessionTrend\(TREND_LIMIT\)/);
  assert.match(s,/Practice accuracy across your last/);
  assert.match(s,/completed full exams are shown separately in Exam attempts/);
  assert.match(s,/Activity uses final answer-event dates, not session completion dates/);
  assert.match(s,/reportingTimeZone: reportingTimeZone/);
});

test('11 history policy loads before analytics in both delivery paths',()=>{
  for(const file of ['netlify/edge-functions/test-bank-set-controls.js','netlify/edge-functions/test-bank-mobile-picker.js']){
    const s=src(file),h=s.indexOf('test-bank-history-policy.js'),a=s.indexOf('test-bank-analytics-dashboard.js');
    assert.ok(h>=0&&a>h,file+' must load history policy before analytics');
  }
});

test('11 complete-history export is distinct from mastery report export',()=>{
  const s=src('test-bank-adaptive-mastery-hardening.js');
  assert.match(s,/data-v2-export-history>Export complete history/);
  assert.match(s,/function exportCompleteHistory\(\)/);
  assert.match(s,/learning\.exportHistory\(\{examId:examId\(\)\}\)/);
  assert.match(s,/complete-history-/);
});

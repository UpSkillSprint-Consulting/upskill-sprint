const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const L = require('../assets/lessons/excel-formula-fluency/sprint/learning.js');
const asset = 'assets/lessons/excel-formula-fluency/sprint/';
const at = '2026-10-02T00:00:00.000Z';
const correctOptions = ['c','a','d','b','c','a','d','b','c','a'];
function clone(value) { return JSON.parse(JSON.stringify(value)); }
async function ready(check) { for (let index = 0; index < 100; index++) { if (check()) return; await new Promise(resolve => setImmediate(resolve)); } throw new Error('Learning interface did not reach its expected state.'); }
function runId(index) { return '00000000-0000-4000-8000-' + String(index).padStart(12,'0'); }
async function harness(initial, existingReports) {
  const dom = new JSDOM('<div id="excel-sprint-app"><section id="sprint-learning" class="sprint-learning"></section></div>', {url:'https://sprint.example/lesson',runScripts:'outside-only'});
  const w = dom.window, calls = [], verified = new Map(existingReports || []), control = {now:at,failAction:null,delay:null}, opened = [];
  let state = L.validateState(initial || L.emptyState()), counter = 20, completions = [];
  function signed(report) { report.receipt = 'signed-learning-' + (++counter); verified.set(report.receipt, clone(report)); return report; }
  async function request(url, body) {
    calls.push({url,body:body === undefined ? undefined : clone(body)});
    if (url.startsWith('/assets/')) return JSON.parse(fs.readFileSync(path.join(__dirname, '..', url)));
    if (control.failAction === body.action) throw new Error('Cannot reach the practice service. Try again.');
    if (control.delay && control.delay.action === body.action) await control.delay.wait;
    if (body.action === 'verify') { if (!verified.has(body.token)) throw new Error('Invalid saved proof.'); return {verified:true,report:clone(verified.get(body.token))}; }
    if (body.action === 'verify-many') {
      if (body.tokens.some(token=>typeof token!=='string' || !token || token.length>6000)) throw new Error('Invalid receipt length.');
      return {results:body.tokens.map(token=>verified.has(token)?{token,verified:true,report:clone(verified.get(token))}:{token,verified:false})};
    }
    if (body.action === 'diagnostic') {
      const skills = body.answers.map((answer,index) => ({skillId:'level-' + (index + 1),level:index + 1,status:answer.optionId === null ? 'skipped' : answer.optionId === correctOptions[index] ? 'correct' : 'incorrect'}));
      return signed({type:'diagnostic',runId:runId(counter + 1),completed:true,score:skills.filter(item=>item.status==='correct').length*10,skills,timestamp:control.now});
    }
    if (body.action === 'grade') {
      const data = JSON.parse(fs.readFileSync(asset + 'learning/drills/' + body.drillId + '.json'));
      const values = data.dataset.rows.map(row=>row[1]).filter(value=>typeof value==='number');
      const expected = Math.round(values.reduce((a,b)=>a+b,0)/values.length*100)/100;
      const previous = body.receipt && verified.get(body.receipt), correct = body.result === expected;
      const report = {type:'drill',runId:previous && previous.runId || runId(counter+1),drillId:body.drillId,skillId:data.skillId,correct:correct || !!(previous && previous.correct),submissionCorrect:correct,attempts:(previous && previous.attempts || 0)+1,firstAttemptCorrect:previous ? previous.firstAttemptCorrect : correct,hint:correct ? 'Correct. The requested result matches.' : 'Keep numeric zero; exclude blank cells. <script>bad()</script>'};
      if (report.correct) report.completedAt = previous && previous.completedAt || control.now;
      return signed(report);
    }
    if (body.action === 'solutions') {
      if (!verified.get(body.token)?.correct) throw new Error('Complete the drill first.');
      return {drillId:body.drillId,skillId:'level-1',model:'=ROUND(AVERAGE(Data!B2:B21),2)',alternatives:['=SUM(Data!B2:B21)/COUNT(Data!B2:B21)']};
    }
    throw new Error('Unexpected request ' + JSON.stringify(body));
  }
  for (const file of ['learning.js','learning-app.js']) w.eval(fs.readFileSync(asset+file,'utf8'));
  const app = w.ExcelSprintLearningApp.mount({element:w.document.querySelector('#sprint-learning'),getState:()=>state,saveState:next=>{state=L.validateState(next);},getCompletions:()=>completions,openCore:id=>opened.push(id),request,now:()=>control.now});
  await ready(()=>w.document.querySelector('[data-learning-action="diagnostic"], [data-learning-grade], [data-learning-diagnostic]'));
  await ready(()=>!w.document.querySelector('#sprint-learning').textContent.includes('Checking saved placement'));
  return {dom,w,app,calls,control,verified,opened,find:selector=>w.document.querySelector(selector),state:()=>clone(state),setState:next=>{state=L.validateState(next);},setCompletions:items=>{completions=items;},close:()=>{app.destroy();dom.window.close();}};
}
function change(h,selector,value) { const element=h.find(selector);element.value=value;element.dispatchEvent(new h.w.Event('input',{bubbles:true})); }
async function openFirst(h) { h.find('[data-learning-drill="R1-A1"]').click();await ready(()=>h.find('[data-learning-grade]')); }
function publicMean(id='R1-A1') { const rows=JSON.parse(fs.readFileSync(asset+'learning/drills/'+id+'.json')).dataset.rows;const numbers=rows.map(row=>row[1]).filter(value=>typeof value==='number');return Math.round(numbers.reduce((a,b)=>a+b,0)/numbers.length*100)/100; }
async function solve(h,id='R1-A1') { change(h,'[data-learning-formula]','=ROUND(AVERAGE(Data!B2:B21),2)');change(h,'[data-learning-result]',String(publicMean(id)));h.find('[data-learning-grade]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));await ready(()=>h.state().drills[id]?.correct===true);await ready(()=>h.find('[data-learning-action="fresh"]')); }

test('learning overview keeps the real next core gate and exposes all twenty independent drills',async()=>{
  const h=await harness();try {
    assert.equal(h.find('[data-learning-core]').getAttribute('data-learning-core'),'L1-A1');
    assert.equal(h.w.document.querySelectorAll('.sprint-learning-all-skills [data-learning-drill]').length,20);
    assert.match(h.find('#sprint-learning').textContent,/do not unlock core assignments or count toward certificates/);
    h.find('[data-learning-core]').click();assert.deepEqual(h.opened,['L1-A1']);
    h.setCompletions(Array.from({length:50},(_,i)=>({packageId:'L'+(Math.floor(i/5)+1)+'-A'+(i%5+1)})));await h.app.refresh();
    assert.equal(h.find('[data-learning-core]'),null);assert.match(h.find('#sprint-learning').textContent,/All 50 core assignments are complete/);
    assert.equal(h.w.document.querySelectorAll('.sprint-learning-all-skills [data-learning-drill]').length,20);
  }finally{h.close();}
});
test('placement submits all ten unique choices, labels skipped and unanswered skills unassessed, and leaves core sequence intact',async()=>{
  const h=await harness();try {
    h.find('[data-learning-action="diagnostic"]').click();assert.equal(h.w.document.querySelectorAll('.sprint-learning-question').length,10);
    h.find('input[name="learning-q1"][value="c"]').click();h.find('input[name="learning-q2"][value="skip"]').click();
    h.find('[data-learning-diagnostic]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));
    await ready(()=>h.find('.sprint-learning-report'));
    const call=h.calls.find(item=>item.body?.action==='diagnostic');
    assert.equal(call.body.answers.length,10);assert.equal(new Set(call.body.answers.map(answer=>answer.questionId)).size,10);
    assert.deepEqual(call.body.answers[0],{questionId:'q1',optionId:'c'});assert.equal(call.body.answers[1].optionId,null);assert.equal(call.body.answers[2].optionId,null);
    assert.equal(h.state().diagnostic.score,10);assert.equal(h.w.document.querySelectorAll('.sprint-learning-skill-results strong').length,10);
    assert.equal(Array.from(h.w.document.querySelectorAll('.sprint-learning-skill-results strong')).filter(item=>item.textContent==='Unassessed').length,9);
    assert.equal(h.find('[data-learning-core]').getAttribute('data-learning-core'),'L1-A1');assert.deepEqual(h.state().diagnosticAnswers,{});
  }finally{h.close();}
});
test('unfinished placement choices survive overview navigation, refresh and deliberate resumption',async()=>{
  const h=await harness();try {
    h.find('[data-learning-action="diagnostic"]').click();h.find('input[name="learning-q1"][value="c"]').click();
    const radio=h.find('input[name="learning-q1"][value="c"]');radio.focus();await h.app.refresh();assert.equal(h.w.document.activeElement,radio);
    h.find('[data-learning-action="overview"]').click();assert.match(h.find('[data-learning-action="diagnostic"]').textContent,/Continue/);
    h.find('[data-learning-action="diagnostic"]').click();assert.equal(h.find('input[name="learning-q1"][value="c"]').checked,true);
    h.find('[data-learning-action="overview"]').click();h.find('[data-learning-action="new-diagnostic"]').click();assert.equal(h.find('input[name="learning-q1"][value="c"]').checked,false);
  }finally{h.close();}
});
test('failed practice retains hints and attempt history; a correction gates model access and schedules review',async()=>{
  const h=await harness();try {
    await openFirst(h);assert.equal(h.find('[data-learning-action="solutions"]'),null);
    change(h,'[data-learning-formula]','=ROUND(AVERAGE(Data!B2:B21),2)');change(h,'[data-learning-result]','0');
    h.find('[data-learning-grade]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));await ready(()=>h.state().drills['R1-A1']?.attempts===1);await ready(()=>!h.find('[data-learning-grade] button[type="submit"]').disabled);
    assert.match(h.find('.sprint-learning-feedback').textContent,/numeric zero/);assert.equal(h.find('.sprint-learning-feedback script'),null);assert.equal(h.find('[data-learning-action="solutions"]'),null);
    await solve(h);assert.equal(h.state().drills['R1-A1'].attempts,2);assert.equal(h.state().drills['R1-A1'].firstAttemptCorrect,false);assert.equal(h.state().reviews['level-1'].stage,1);
    assert.equal(h.state().reviews['level-1'].nextReviewAt,'2026-10-03T00:00:00.000Z');
    assert.equal(h.calls.filter(item=>item.body?.action==='solutions').length,0);
    h.find('[data-learning-action="solutions"]').click();await ready(()=>h.find('.sprint-solutions code'));assert.match(h.find('.sprint-solutions').textContent,/AVERAGE/);
    h.find('[data-learning-action="fresh"]').click();assert.equal(h.state().drills['R1-A1'].receipt,undefined);assert.equal(h.find('[data-learning-result]').value,'');assert.equal(h.find('[data-learning-action="solutions"]'),null);
  }finally{h.close();}
});
test('service failure preserves formula/result drafts and permits the same attempt to retry',async()=>{
  const h=await harness();try {
    await openFirst(h);change(h,'[data-learning-formula]','=AVERAGE(Data!B2:B21)');change(h,'[data-learning-result]','001');h.control.failAction='grade';
    h.find('[data-learning-grade]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));await ready(()=>h.find('[data-learning-message]').textContent.includes('Cannot reach'));
    assert.equal(h.find('[data-learning-formula]').value,'=AVERAGE(Data!B2:B21)');assert.equal(h.find('[data-learning-result]').value,'001');assert.equal(h.state().drills['R1-A1'].submissions.resultText,'001');
    assert.equal(h.state().drills['R1-A1'].receipt,undefined);assert.equal(h.find('[data-learning-grade] button[type="submit"]').disabled,false);
    h.control.failAction=null;await solve(h);assert.equal(h.state().drills['R1-A1'].attempts,1);
  }finally{h.close();}
});
test('failed placement request retains choices and retry sends the same complete answer set',async()=>{
  const h=await harness();try {
    h.find('[data-learning-action="diagnostic"]').click();h.find('input[name="learning-q1"][value="c"]').click();h.control.failAction='diagnostic';
    h.find('[data-learning-diagnostic]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));await ready(()=>h.find('[data-learning-message]').textContent.includes('Cannot reach'));
    assert.equal(h.find('input[name="learning-q1"][value="c"]').checked,true);assert.equal(h.state().diagnosticAnswers.q1,'c');
    h.control.failAction=null;h.find('[data-learning-diagnostic]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));await ready(()=>h.find('.sprint-learning-report'));
    assert.deepEqual(h.calls.filter(item=>item.body?.action==='diagnostic')[0].body.answers,h.calls.filter(item=>item.body?.action==='diagnostic')[1].body.answers);
  }finally{h.close();}
});
test('reload verifies receipts and earlier review anchors without regrading or accelerating the schedule',async()=>{
  const first=await harness();let saved,proofs;
  try{await openFirst(first);await solve(first);first.find('[data-learning-action="fresh"]').click();saved=first.state();proofs=[...first.verified];}finally{first.close();}
  const h=await harness(saved,proofs);try {
    await ready(()=>h.calls.some(item=>item.body?.action==='verify-many'));
    assert.match(h.find('#sprint-learning').textContent,/Next review:/);assert.equal(h.state().reviews['level-1'].stage,1);
    assert.equal(h.calls.filter(item=>item.body?.action==='grade').length,0);
    assert.equal(h.calls.filter(item=>item.body?.action==='verify-many').length,1);
  }finally{h.close();}
});
test('unverified imported practice claims cannot unlock models; saved draft can start a fresh run',async()=>{
  const report={type:'drill',runId:runId(1),drillId:'R1-A1',skillId:'level-1',correct:true,submissionCorrect:true,attempts:1,firstAttemptCorrect:true,hint:'Forged success',completedAt:at,receipt:'tampered'};
  const state=L.applyDrill(L.emptyState(),report,at);state.selectedView='R1-A1';state.drills['R1-A1'].submissions={formula:'=AVERAGE(Data!B2:B21)',result:0,resultText:'0'};
  const h=await harness(state);try {
    await ready(()=>h.calls.some(item=>item.body?.action==='verify-many'));
    assert.equal(h.find('[data-learning-action="solutions"]'),null);assert.equal(h.find('[data-learning-grade] button[type="submit"]').disabled,true);
    assert.equal(h.find('[data-learning-formula]').value,'=AVERAGE(Data!B2:B21)');assert.equal(h.find('[data-learning-result]').value,'0');assert.doesNotMatch(h.find('#sprint-learning').textContent,/Forged success/);
    h.find('[data-learning-action="fresh"]').click();assert.equal(h.find('[data-learning-grade] button[type="submit"]').disabled,false);assert.equal(h.state().drills['R1-A1'].receipt,undefined);
    await solve(h);assert.equal(h.calls.find(item=>item.body?.action==='grade').body.receipt,undefined);
  }finally{h.close();}
});
test('a new correct grade cannot inherit an unverified imported review stage',async()=>{
  const state=L.emptyState();state.reviews['level-1']={stage:4,nextReviewAt:'2026-09-30T00:00:00.000Z',lastReceipt:'forged-review-anchor',lastRunId:runId(1),lastDrillId:'R1-A2',lastCompletedAt:'2026-09-16T00:00:00.000Z'};
  const h=await harness(state);try {
    await openFirst(h);await solve(h);assert.equal(h.state().reviews['level-1'].stage,1);assert.equal(h.state().reviews['level-1'].lastDrillId,'R1-A1');
    assert.equal(h.state().reviews['level-1'].nextReviewAt,'2026-10-03T00:00:00.000Z');
  }finally{h.close();}
});
test('a due review uses the alternate fresh dataset and advances the next interval once',async()=>{
  const h=await harness();try {
    await openFirst(h);await solve(h);h.find('[data-learning-action="overview"]').click();h.control.now='2026-10-03T01:00:00.000Z';await h.app.refresh(true);
    const due=h.find('[data-learning-fresh="true"]');assert.equal(due.getAttribute('data-learning-drill'),'R1-A2');assert.match(due.textContent,/Start due review/);due.click();await ready(()=>h.find('.sprint-learning-drill-heading')?.textContent.includes('R1-A2'));
    await solve(h,'R1-A2');assert.equal(h.state().reviews['level-1'].stage,2);assert.equal(h.state().reviews['level-1'].nextReviewAt,'2026-10-06T01:00:00.000Z');
    await h.app.refresh(true);assert.equal(h.state().reviews['level-1'].stage,2);assert.equal(h.calls.filter(item=>item.body?.action==='grade').length,2);
  }finally{h.close();}
});
test('an unfinished due review resumes its saved answer, hint and attempts instead of starting another run',async()=>{
  const h=await harness();try {
    await openFirst(h);await solve(h);h.find('[data-learning-action="overview"]').click();h.control.now='2026-10-03T01:00:00.000Z';await h.app.refresh(true);
    h.find('[data-learning-drill="R1-A2"][data-learning-fresh="true"]').click();await ready(()=>h.find('.sprint-learning-drill-heading')?.textContent.includes('R1-A2'));
    change(h,'[data-learning-formula]','=ROUND(AVERAGE(Data!B2:B21),2)');change(h,'[data-learning-result]','0');h.find('[data-learning-grade]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));
    await ready(()=>h.state().drills['R1-A2']?.attempts===1);await ready(()=>!h.find('[data-learning-grade] button[type="submit"]').disabled);const receipt=h.state().drills['R1-A2'].receipt;
    h.find('[data-learning-action="overview"]').click();const resume=h.find('.sprint-learning-grid [data-learning-drill="R1-A2"]');assert.match(resume.textContent,/Continue due review/);assert.equal(resume.hasAttribute('data-learning-fresh'),false);resume.click();await ready(()=>h.find('[data-learning-grade]'));
    assert.equal(h.find('[data-learning-result]').value,'0');assert.equal(h.state().drills['R1-A2'].receipt,receipt);assert.match(h.find('.sprint-learning-feedback').textContent,/1 attempt/);
    await solve(h,'R1-A2');assert.equal(h.state().drills['R1-A2'].attempts,2);assert.equal(h.state().reviews['level-1'].stage,2);
  }finally{h.close();}
});
test('the largest restored learning state verifies all thirty-one unique receipts in one service call',async()=>{
  let state=L.emptyState();const proofs=[];let number=100;
  function report(level,variant,correct,receipt) { const value={type:'drill',runId:runId(++number),drillId:'R'+level+'-A'+variant,skillId:'level-'+level,correct,submissionCorrect:correct,attempts:1,firstAttemptCorrect:correct,hint:correct?'Correct':'Try again',receipt};if(correct)value.completedAt=at;proofs.push([receipt,value]);return value; }
  for(let level=1;level<=10;level++) {
    state=L.applyDrill(state,report(level,1,true,'anchor-'+level),at);
    state=L.applyDrill(state,report(level,1,false,'current-'+level+'-1'),at);
    state=L.applyDrill(state,report(level,2,false,'current-'+level+'-2'),at);
  }
  const diagnostic={type:'diagnostic',runId:runId(++number),completed:true,score:100,skills:Array.from({length:10},(_,i)=>({skillId:'level-'+(i+1),level:i+1,status:'correct'})),timestamp:at,receipt:'diagnostic-anchor'};proofs.push([diagnostic.receipt,diagnostic]);state=L.applyDiagnostic(state,diagnostic);
  const h=await harness(state,proofs);try {
    await ready(()=>h.find('.sprint-learning-report'));
    const requests=h.calls.filter(item=>item.body?.action==='verify-many');assert.equal(requests.length,1);assert.equal(requests[0].body.tokens.length,31);assert.equal(new Set(requests[0].body.tokens).size,31);
    assert.equal(h.calls.filter(item=>item.body?.action==='verify').length,0);assert.equal(h.state().reviews['level-10'].stage,1);assert.doesNotMatch(h.find('#sprint-learning').textContent,/could not be verified/);
  }finally{h.close();}
});
test('an oversized corrupt imported receipt leaves valid restored reports visible and keeps its saved draft',async()=>{
  const diagnostic={type:'diagnostic',runId:runId(1),completed:true,score:10,skills:Array.from({length:10},(_,i)=>({skillId:'level-'+(i+1),level:i+1,status:i===0?'correct':'skipped'})),timestamp:at,receipt:'valid-placement-receipt'};
  const oversized='x'.repeat(6001),drill={type:'drill',runId:runId(2),drillId:'R1-A1',skillId:'level-1',correct:true,submissionCorrect:true,attempts:1,firstAttemptCorrect:true,hint:'Unverified imported claim',completedAt:at,receipt:oversized};
  let state=L.applyDiagnostic(L.emptyState(),diagnostic);state=L.applyDrill(state,drill,at);state.drills['R1-A1'].submissions={formula:'=AVERAGE(Data!B2:B21)',result:0,resultText:'0'};
  const h=await harness(state,[[diagnostic.receipt,diagnostic]]);try {
    await ready(()=>h.find('.sprint-learning-report'));
    assert.match(h.find('.sprint-learning-report').textContent,/10% correct/);assert.match(h.find('#sprint-learning').textContent,/Some saved learning results could not be verified/);
    const batch=h.calls.filter(item=>item.body?.action==='verify-many');assert.equal(batch.length,1);assert.deepEqual(batch[0].body.tokens,[diagnostic.receipt]);
    assert.equal(h.state().drills['R1-A1'].receipt,oversized);assert.equal(h.state().drills['R1-A1'].submissions.resultText,'0');
    h.find('[data-learning-drill="R1-A1"]').click();await ready(()=>h.find('[data-learning-grade]'));
    assert.equal(h.find('[data-learning-formula]').value,'=AVERAGE(Data!B2:B21)');assert.equal(h.find('[data-learning-result]').value,'0');assert.equal(h.find('[data-learning-action="solutions"]'),null);
    assert.equal(h.find('[data-learning-grade] button[type="submit"]').disabled,true);
  }finally{h.close();}
});
test('clipboard data quotes multiline inspector fields so copied columns and rows stay intact',async()=>{
  const h=await harness();try {
    let copied='';Object.defineProperty(h.w.navigator,'clipboard',{value:{writeText:async text=>{copied=text;}}});h.find('[data-learning-drill="R4-A1"]').click();await ready(()=>h.find('[data-learning-grade]'));
    h.find('[data-learning-action="copy"]').click();await ready(()=>copied.length>0);
    const data=JSON.parse(fs.readFileSync(asset+'learning/drills/R4-A1.json')).dataset;
    for(const row of data.rows) for(const value of row) if(typeof value==='string' && /[\t\n\r"]/.test(value)) assert.ok(copied.includes('"'+value.replace(/"/g,'""')+'"'));
  }finally{h.close();}
});
test('destroyed views ignore late grading and never overwrite replacement imported state',async()=>{
  const h=await harness();try {
    await openFirst(h);let release;h.control.delay={action:'grade',wait:new Promise(resolve=>{release=resolve;})};change(h,'[data-learning-formula]','=AVERAGE(Data!B2:B21)');change(h,'[data-learning-result]',String(publicMean()));
    h.find('[data-learning-grade]').dispatchEvent(new h.w.Event('submit',{bubbles:true,cancelable:true}));await ready(()=>h.calls.some(item=>item.body?.action==='grade'));
    h.app.destroy();const replacement=L.emptyState();replacement.diagnosticAnswers.q10='a';h.setState(replacement);release();await new Promise(resolve=>setImmediate(resolve));
    assert.deepEqual(h.state(),replacement);
  }finally{h.close();}
});
test('result parsing preserves text identifiers, numeric zero and trailing blank array cells',()=>{
  const UI=require('../assets/lessons/excel-formula-fluency/sprint/learning-app.js');
  assert.deepEqual(UI.parseResult('001\t0\t\n002\t7\t\n','array'),[['001','0',''],['002','7','']]);
  assert.equal(UI.parseResult('0','number'),0);assert.equal(UI.parseResult('001','text'),'001');assert.throws(()=>UI.parseResult('1,000','number'),/without units/);
});

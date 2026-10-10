'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sourceFiles = ['test-bank-pmp-bank2.js', 'test-bank-pmp-bank2-ui.js'];
const load = () => {
  const context = {window:{}};
  sourceFiles.forEach(file => vm.runInNewContext(read(file), context));
  return context.window;
};
const count = (list, key) => list.reduce((out, q) => (out[q[key]] = (out[q[key]] || 0) + 1, out), {});

test('Set 2 retains all 50 authored IDs, sources, cases, allocations, and independently checked keys', () => {
  const {PMP_BANK2: questions, PMP_BANK2_SOURCE: batches, __PMPSet2UI: ui} = load();
  assert.equal(questions.length, 50);
  assert.deepEqual(count(questions, 'domain'), {People:16, Process:20, 'Business Environment':14});
  assert.deepEqual(count(questions, 'approach'), {Hybrid:15, Predictive:20, Agile:15});
  assert.deepEqual(count(questions, 'format'), {single:36, multiple:6, dropdown:2, matching:4, hotspot:2});
  assert.deepEqual(count(questions, 'difficulty'), {Challenging:30, 'Very challenging':10, Moderate:10});
  const keys = ['B','D','B and E','A','C','D','B','1 → E; 2 → B; 3 → D; 4 → A','B','A',
    'C','A','B','D','B','B and D','A','1 → D; 2 → A; 3 → E; 4 → B','C','B',
    'D','B','A','C','C','A and E','D','A','B','B and E',
    'C','D','A','D','B','A and C','C','1 → D; 2 → A; 3 → E; 4 → B','B','D',
    'B','C','A','D','C','A and D','A','1 → C; 2 → D; 3 → A; 4 → B','D','B'];
  questions.forEach((q, i) => {
    assert.equal(q.qid, 'pmp:set-2:original-' + String(i + 1).padStart(3, '0'));
    assert.equal(q.authorId, 'pmp-set2-' + String(i + 1).padStart(3, '0'));
    assert.equal(q.set, 2);
    assert.ok(q.stem && q.references.length && q.why);
    assert.equal(q.batch, Math.floor(i / 10) + 1);
    q.choices.forEach(([key, text]) => assert.ok(text && q.rationales[key], q.qid + ' ' + key));
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
    const label = ui.responseLabel(q, q.answer);
    assert.equal(q.format === 'single' || q.format === 'dropdown' || q.format === 'hotspot' ? label.split('.')[0] : label, keys[i]);
    assert.equal(!!q.caseStudy, i % 10 < 3);
  });
  batches.forEach(b => assert.equal(b.questions.length, 10));
  assert.match(questions[47].why, /errata|corrected/i);
  assert.equal(questions[19].rationales.B.includes('near-term'), true);
  assert.equal(questions[49].hotspotTarget.row, 'B');
  assert.deepEqual(count(questions.filter(q => q.format === 'single').map(q => ({key:ui.decode(q, q.answer)})), 'key'), {B:9,D:9,A:9,C:9});
});

test('multiple and matching response codes preserve every partial state and award no partial credit', () => {
  const {PMP_BANK2: qs, __PMPSet2UI: ui} = load();
  const context = {window:{}};
  vm.runInNewContext(read('test-bank-memory-learning.js'), context);
  const grade = context.window.__TBVersions.classify;
  qs.filter(q => q.format === 'matching' || q.format === 'multiple').forEach(q => {
    for (let code = 0; code < q.options.length; code++) {
      assert.equal(ui.encode(q, ui.decode(q, code)), code);
      assert.equal(grade(q, code), code === q.answer ? 'correct' : 'incorrect');
    }
    assert.equal(grade(q, q.answer, true), 'incorrect');
    assert.equal(grade(q, null), 'unanswered');
  });
});

async function player() {
  const edge = (await import('data:text/javascript;base64,' + Buffer.from(read('netlify/edge-functions/test-bank-mobile-picker.js')).toString('base64'))).default;
  const response = await edge(new Request('https://upskillsprint.com/test-bank?exam=pmp'), {next:async () => new Response(read('test-bank.html'), {headers:{'content-type':'text/html'}})});
  const delivered = await response.text();
  sourceFiles.forEach(file => assert.ok(delivered.includes('src="/' + file + '"'), file + ' survives the production edge allowlist'));
  const html = delivered.replace(/<script src="\/(test-bank-(?:pmp[^"/]*|memory-learning|current-attempt-review)\.js)"(?: defer)?><\/script>/g, (_, file) => '<script>' + read(file).replace(/<\/script/gi, '<\\/script') + '</script>');
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', error => errors.push(error.message));
  let closeFrames = () => {};
  const dom = new JSDOM(html, {url:'https://upskillsprint.com/test-bank?exam=pmp',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
    w.HTMLElement.prototype.scrollIntoView = () => {};
    const request=w.requestAnimationFrame.bind(w), cancel=w.cancelAnimationFrame.bind(w), frames=new Set();
    let closing=false;
    w.requestAnimationFrame=callback=>{if(closing)return 0;const id=request(time=>{frames.delete(id);if(!closing)callback(time);});frames.add(id);return id;};
    w.cancelAnimationFrame=id=>{frames.delete(id);cancel(id);};
    closeFrames=()=>{closing=true;frames.forEach(cancel);frames.clear();};
  }});
  await new Promise(resolve => dom.window.addEventListener('load', resolve, {once:true}));
  return {dom, w:dom.window, doc:dom.window.document, errors, close(){dom.window.__TBCurrentAttemptReview?.destroy();closeFrames();dom.window.close();}};
}
const click = (doc, selector) => {const el=doc.querySelector(selector);assert.ok(el,selector);assert.notEqual(el.disabled,true);el.click();return el;};
function change(w, el, value) {assert.ok(el); if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event('change',{bubbles:true}));}
const tick = () => new Promise(resolve => setTimeout(resolve, 40));
function go(p, number) {
  const snapshot=p.w.__TB.getFeedbackSnapshot();
  const index=snapshot.records.findIndex(r=>r.question.n===number);
  assert.ok(index>=0,'question '+number+' exists');
  click(p.doc,'[data-goto="'+index+'"]');
  return p.w.__TB.getFeedbackSnapshot().records[index].question;
}
function answer(p,q,response=q.correct,root=p.doc) {
  if(q.format==='single')click(root,'[data-opt="'+q.answer+'"]');
  else if(q.format==='multiple')q.choices.forEach(([key])=>change(p.w,root.querySelector('[data-pmp-choice="'+key+'"]'),response.includes(key)));
  else if(q.format==='matching')q.prompts.forEach(([row])=>change(p.w,root.querySelector('[data-pmp-select="'+row+'"]'),response[row]||''));
  else if(q.format==='dropdown')change(p.w,root.querySelector('[data-pmp-select]'),response[0]);
  else click(root,'[data-pmp-cell="'+response[0]+'"]');
}

test('production player serves 50 Set 2 questions, keeps Set 1 intact, navigates, scores, reveals and retries all formats', async () => {
  const p=await player();
  try {
    click(p.doc,'[data-exam="pmp"]');
    assert.equal(p.w.__TB.EXAMS.pmp.sets[1].length,180);
    assert.ok(p.w.__TB.EXAMS.pmp.sets[1].every(q=>!p.w.__PMPSet2UI.isQuestion(q)),'legacy Set 1 IDs must not activate Set 2 controls');
    const legacyIds=new Set(p.w.__TB.EXAMS.pmp.sets[1].map(q=>q.qid));
    for(let n=1;n<=180;n++)assert.ok(!legacyIds.has('pmp:set-2:original-'+String(n).padStart(3,'0')),'future Set 2 IDs must remain separate from Set 1');
    assert.equal(p.doc.querySelector('[data-set="1"] .tb-sets').textContent,'180');
    assert.equal(p.doc.querySelector('[data-set="2"] .tb-sets').textContent,'50');
    assert.equal(p.doc.querySelector('[data-set="3"]').disabled,true);
    click(p.doc,'[data-set="2"]');
    assert.match(p.doc.getElementById('tb-overview').textContent,/partial practice set/);
    click(p.doc,'[data-mode="full"]');
    let snap=p.w.__TB.getFeedbackSnapshot();
    assert.equal(snap.records.length,50);
    assert.equal(snap.setId,'2');
    assert.equal(new Set(snap.records.map(r=>r.question.qid)).size,50);
    assert.ok(snap.records.every(r=>r.question.set===2));
    const q3=go(p,3);
    answer(p,q3,['B']);
    go(p,4);go(p,3);
    assert.equal(p.doc.querySelector('[data-pmp-choice="B"]').checked,true);
    assert.equal(p.doc.querySelector('[data-pmp-choice="E"]').checked,false);
    answer(p,q3,[]);
    assert.equal(p.w.__TB.getFeedbackSnapshot().records.find(r=>r.question.n===3).selected,null);
    const q8=go(p,8);
    change(p.w,p.doc.querySelector('[data-pmp-select="1"]'),'E');
    go(p,7);go(p,8);
    assert.equal(p.doc.querySelector('[data-pmp-select="1"]').value,'E');
    assert.equal(p.doc.querySelector('[data-pmp-select="2"]').value,'');
    // Deliberately miss one question of every response format for the retry path.
    const missed=new Set([1,3,7,8,20]);
    for(const record of snap.records){const q=go(p,record.question.n);if(!missed.has(q.n))answer(p,q);}
    click(p.doc,'[data-goto="49"]');click(p.doc,'[data-submit]');
    await tick();
    const score=p.doc.querySelector('[data-score-result]');
    assert.ok(score);assert.equal(score.dataset.scorePercent,'90');
    click(p.doc,'[data-open-review="all"]');
    assert.equal(p.doc.querySelectorAll('.tb-review-card').length,50);
    const review8=p.doc.querySelector('.tb-review-card[data-question-id="pmp:set-2:original-008"]');
    assert.match(review8.textContent,/1 → E; 2 → B; 3 → D; 4 → A/);
    assert.ok(review8.querySelectorAll('td').length<50,'review shows authored rows, not encoded state options');
    click(p.doc,'[data-retry-missed]');
    for(let i=0;i<5;i++){
      const panel=p.doc.querySelector('#tb-retry-panel');
      const n=Number(panel.querySelector('.pmp2-number').textContent.match(/Question (\d+)/)[1]);
      const q=p.w.PMP_BANK2.find(q=>q.n===n);
      if(q.format==='single')click(panel,'[data-retry-opt="'+q.answer+'"]');else answer(p,q,q.correct,panel);
      click(panel,'[data-retry-check]');
      assert.match(panel.querySelector('.tb-retry-feedback').textContent,/Correct\./);
      assert.ok([...panel.querySelectorAll('.pmp2-answers input,.pmp2-answers select,.pmp2-answers button')].every(el=>el.disabled));
      click(panel,'[data-retry-next]');
    }
    assert.match(p.doc.querySelector('#tb-retry-panel').textContent,/5 of 5/);
    assert.equal(score.dataset.scorePercent,'90','correction does not change original score');
    assert.deepEqual(p.errors,[]);
  } finally {p.close();}
});

test('untimed reveal locks interactive inputs and records a correct prior response as incorrect', async () => {
  const p=await player();
  try{
    click(p.doc,'[data-exam="pmp"]');click(p.doc,'[data-set="2"]');
    click(p.doc,'[data-timing-kind="full"][data-timed="0"]');
    click(p.doc,'[data-mode="full"]');
    assert.ok(p.doc.querySelector('[data-reveal]'),'untimed mode exposes reveal');
    const q=go(p,8);answer(p,q);
    click(p.doc,'[data-reveal]');
    assert.ok([...p.doc.querySelectorAll('.pmp2-answers select')].every(el=>el.disabled));
    assert.match(p.doc.querySelector('#tb-revealed-answer').textContent,/1 → E; 2 → B; 3 → D; 4 → A/);
    click(p.doc,'[data-goto="49"]');click(p.doc,'[data-submit]');await tick();
    assert.equal(p.doc.querySelector('[data-score-result]').dataset.scorePercent,'0');
    assert.equal(p.w.__TB.getFeedbackSnapshot().records.find(r=>r.question.n===8).revealed,true);
    assert.deepEqual(p.errors,[]);
  }finally{p.close();}
});

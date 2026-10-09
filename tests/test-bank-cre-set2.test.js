'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const bank = () => {const ctx = {window: {}}; vm.runInNewContext(read('test-bank-cre-set2.js'), ctx); return ctx.window;};
const tick = () => new Promise(resolve => setTimeout(resolve, 60));

test('batch contract: stable IDs, current BoK weights, complete feedback, six exhibits, valid lesson anchors', () => {
  const {CRE_SET2: qs, registerCRESet2} = bank();
  assert.equal(qs.length, 10);
  const exam = {bok: [], bank: []}, dm = {};
  registerCRESet2(exam, dm);
  assert.deepEqual(Array.from(exam.bok, d => d.weight), [29,25,35,35,26]);
  assert.equal(exam.questions, 165); assert.equal(exam.minutes, 258);
  assert.equal(qs.filter(q => q.chart).length, 6);
  assert.equal(qs.filter(q => q.chart?.creKind).length, 3);
  assert.equal(qs.filter(q => q.explorer).length, 2);
  for (const [i,q] of qs.entries()) {
    assert.equal(q.qid, 'cre:set-2:' + String(i+1).padStart(3,'0'));
    assert.equal(q.set, 2); assert.equal(q.original, true);
    assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.equal(q.optionRationales.length, 4);
    q.optionRationales.forEach(r => assert.ok(r.length > 35));
    assert.ok(q.why && q.trap && q.keyPoint && q.handbook.section && q.assumptions.length);
    assert.ok(q.studyReference || q.lessonGap);
    assert.equal(qs.filter(p => p.sub === q.sub).length, 2);
    if(q.studyReference) {
      const [file, anchor] = q.studyReference.url.split('#');
      assert.ok(read(file.slice(1)+'.html').includes('id="'+anchor+'"'));
    }
  }
});

test('registering Set 2 preserves a concurrent Set 1 question bank', () => {
  const {registerCRESet2} = bank();
  const first = [{qid:'cre:set-1:001', sub:'cre-fundamentals', answer:3, stem:'Set 1 content'}];
  const before = JSON.stringify(first);
  const exam = {bank:first,sets:{1:first},bok:[]}, dm={};
  registerCRESet2(exam,dm);
  assert.equal(exam.sets[1], first); assert.equal(exam.bank, first);
  assert.equal(JSON.stringify(first), before);
  assert.equal(exam.sets[2].length, 10);
});

test('independent calculations verify numeric keys and distractors', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  assert.equal(answer(1), (900/1000*100).toFixed(2)+'%');
  // Enumerate all eight basic-event states instead of reusing the solution formula.
  let top=0, any=0;
  for(let mask=0;mask<8;mask++){
    const a=!!(mask&1),b=!!(mask&2),c=!!(mask&4);
    const p=(a?.1:.9)*(b?.2:.8)*(c?.05:.95);
    if((a&&c)||(b&&c))top+=p;
    if(a||b||c)any+=p;
  }
  assert.equal(answer(3),top.toFixed(4));
  assert.equal(qs[2].options[2],any.toFixed(4));
  assert.equal(Number(qs[2].options[1]), .00005);
  let risk=5,survival=1;
  for(const [,t,status] of qs[4].chart.rows){
    if(t>250)break;
    if(status==='Failure')survival*=(risk-1)/risk;
    risk--;
  }
  assert.equal(answer(5),survival.toFixed(4));
  for(const [t,a,b] of qs[5].chart.rows){
    assert.equal(a,Math.exp(-t/1000).toFixed(4));
    assert.equal(b,Math.exp(-((t/1000)**2)).toFixed(4));
  }
  let n=1;while(.9**n>.05)n++;
  assert.equal(answer(7),String(n));assert.equal(n,29);
  let system=0;
  for(let mask=0;mask<8;mask++){
    const power=!!(mask&1),a=!!(mask&2),b=!!(mask&4);
    if(power&&(a||b))system+=(power?.98:.02)*(a?.9:.1)*(b?.9:.1);
  }
  assert.equal(answer(8),system.toFixed(4));
  // Numerical quadrature of the standard-normal lower tail (independent of Phi implementation).
  const upper=-30/Math.sqrt(164), lo=-10, steps=20000, step=(upper-lo)/steps;
  let probability=0;
  for(let i=0;i<steps;i++){const z=lo+(i+.5)*step;probability+=Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*step;}
  assert.equal(answer(9),(probability*100).toFixed(2)+'%');
  qs[3].chart.rows.forEach(([,s,o,d,rpn])=>assert.equal(s*o*d,rpn));
});

async function harness(){
  const edge=(await import('data:text/javascript;base64,'+Buffer.from(read('netlify/edge-functions/test-bank-mobile-picker.js')).toString('base64'))).default;
  let html=await (await edge(new Request('https://upskillsprint.com/test-bank?exam=cre'),{next:async()=>new Response(read('test-bank.html'),{headers:{'content-type':'text/html'}})})).text();
  assert.match(html,/src="\/test-bank-cre-set2.js"/);
  assert.match(html,/src="\/test-bank-cre-set2-ui.js"/);
  html=html.replace(/<script\b[^>]*src=["'](\/test-bank-[^"'?]+\.js)(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi,(_,src)=>'<script>'+read(src.slice(1)).replace(/<\/script/gi,'<\\/script')+'</script>');
  const errors=[],typesetRoots=[],virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',e=>errors.push(e.message));
  let closeFrames=()=>{};
  const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank?exam=cre',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole,beforeParse(w){
    w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=w.alert=()=>{};w.confirm=()=>true;
    w.UpskillMath={typeset:async roots=>typesetRoots.push(...roots)};
    const request=w.requestAnimationFrame.bind(w),cancel=w.cancelAnimationFrame.bind(w),frames=new Set();let closing=false;
    w.requestAnimationFrame=cb=>{if(closing)return 0;const id=request(t=>{frames.delete(id);if(!closing)cb(t);});frames.add(id);return id;};
    w.cancelAnimationFrame=id=>{frames.delete(id);cancel(id);};
    closeFrames=()=>{closing=true;frames.forEach(cancel);};
  }});
  const w=dom.window;
  if(w.document.readyState!=='complete')await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
  await tick();
  return {w,errors,typesetRoots,close:()=>{w.__TBCurrentAttemptReview?.destroy?.();closeFrames();w.close();}};
}
function click(w,selector){const el=w.document.querySelector(selector);assert.ok(el,'control exists: '+selector);el.click();return el;}
// CRE Set 1 is the default now that it is released, so these Set 2 journeys select Set 2 explicitly.
function useSet2(w,mode){click(w,mode==='full'?'[data-set="2"]':'[data-quiz-set-kind="'+(mode==='focus'?'focus':'quick')+'"][data-quiz-set="2"]');}
function start(w,mode){click(w,'.tb-tile[data-exam="cre"]');useSet2(w,mode);click(w,'#tb-overview [data-mode="'+mode+'"]');return w.__TB.getFeedbackSnapshot();}
function submit(w){const n=w.__TB.getFeedbackSnapshot().records.length;click(w,'[data-goto="'+(n-1)+'"]');click(w,'[data-submit]');}

test('production player uses Set 2, correct pace, six exhibits, review tools, and immutable score',async()=>{
  const h=await harness(),{w}=h;
  try{
    click(w,'.tb-tile[data-exam="cre"]');
    assert.equal(w.document.querySelector('[data-set="1"]').disabled,false);
    useSet2(w,'full');
    assert.match(w.document.querySelector('#tb-overview').textContent,/10 of 150/);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,10),938);
    click(w,'#tb-overview [data-mode="full"]');
    const snapshot=w.__TB.getFeedbackSnapshot();
    assert.equal(snapshot.records.length,10);
    assert.ok(snapshot.records.every(r=>/^cre:set-2:/.test(r.question.qid)));
    assert.equal(w.document.querySelector('.cre2-explorer'),null);
    assert.equal(w.document.querySelector('.tb-explanation'),null);
    snapshot.records.forEach((r,i)=>{click(w,'[data-goto="'+i+'"]');click(w,'[data-opt="'+r.question.answer+'"]');});
    submit(w);await tick();
    const score=w.document.querySelector('[data-score-result]').textContent;
    assert.match(score,/10\/10/);assert.equal(w.document.querySelector('[data-score-result]').dataset.sessionSet,'2');
    click(w,'[data-open-review="all"]');await tick();
    assert.equal(w.document.querySelectorAll('.tb-review-card').length,10);
    assert.equal(w.document.querySelectorAll('.tb-review-card .cre2-exhibit').length,6);
    assert.equal(w.document.querySelectorAll('.cre2-explorer').length,2);
    assert.equal(w.document.querySelectorAll('.cre2-source strong').length,20);
    for(const card of w.document.querySelectorAll('.tb-review-card'))assert.ok(h.typesetRoots.includes(card));
    const slider=w.document.querySelector('[data-cre-explorer="weibull"] input');
    slider.value='1500';slider.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(slider.closest('details').querySelector('output').textContent,/A has higher reliability/);
    const select=w.document.querySelector('[data-cre-explorer="sample-size"] select');
    select.value='0.99';select.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.match(select.closest('details').querySelector('output').textContent,/44 independent units/);
    select.closest('details').querySelector('button').click();assert.equal(select.value,'0.95');
    assert.equal(w.document.querySelector('[data-score-result]').textContent,score);
    assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

test('quick and focused modes select available Set 2; retry math renders without exposing explorers',async()=>{
  const h=await harness(),{w}=h;
  try{
    const snap=start(w,'quick');assert.equal(snap.records.length,10);
    submit(w);await tick();click(w,'[data-retry-missed]');
    const q=snap.records[0].question;
    click(w,'[data-retry-opt="'+q.answer+'"]');click(w,'[data-retry-check]');await tick();
    const feedback=w.document.querySelector('.tb-retry-feedback');
    assert.ok(h.typesetRoots.includes(feedback));
    assert.equal(w.document.querySelector('.tb-retry-panel .cre2-explorer'),null);
    click(w,'[data-back]');
    useSet2(w,'focus');
    click(w,'#tb-overview [data-mode="focus"]');
    assert.equal(w.__TB.getFeedbackSnapshot().records.length,2);
    assert.ok(w.__TB.getFeedbackSnapshot().records.every(r=>r.question.qid.startsWith('cre:set-2:')));
    assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

test('answer reveal typesets new working and records the revealed item as incorrect',async()=>{
  const h=await harness(),{w}=h;
  try{
    const snap=start(w,'quick');
    const i=snap.records.findIndex(r=>r.question.number===7);
    click(w,'[data-goto="'+i+'"]');click(w,'[data-reveal]');await tick();
    const working=w.document.querySelector('#tb-revealed-answer');
    assert.ok(working);assert.ok(h.typesetRoots.includes(working));
    assert.equal(working.querySelector('.cre2-explorer'),null);
    submit(w);await tick();
    assert.match(w.document.querySelector('[data-score-result]').textContent,/0\/10/);
    assert.match(w.document.querySelector('[data-score-result]').textContent,/1 revealed/);
    assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

test('fallback preserves diagram logic when the presentation module is unavailable',async()=>{
  const h=await harness(),{w}=h;
  try{
    w.__CRESet2UI=null;
    const q=w.CRE_SET2[2];
    const html=w.__TB.renderQuestionContent(q,false);
    assert.match(html,/\(A AND C\) OR \(B AND C\)/);
    assert.match(html,/0.10/);assert.match(html,/0.20/);assert.match(html,/0.05/);
  }finally{h.close();}
});

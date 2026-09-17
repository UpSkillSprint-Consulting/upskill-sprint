const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const tick = w => new Promise(resolve => w.setTimeout(resolve, 55));
async function harness() {
  const edge = (await import('data:text/javascript;base64,' + Buffer.from(read('netlify/edge-functions/test-bank-mobile-picker.js')).toString('base64'))).default;
  const response = await edge(new Request('https://upskillsprint.com/test-bank'), {
    next: async () => new Response(read('test-bank.html'), {headers: {'content-type': 'text/html'}})
  });
  let html = await response.text();
  html = html.replace(/<script\b[^>]*src=["'](\/test-bank-[^"'?]+\.js)(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi, (tag, src) => {
    return '<script>' + read(src.slice(1)).replace(/<\/script/gi, '<\\/script') + '</script>';
  });
  const errors = [];
  let closeFrames = () => {};
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.scrollTo = w.alert = () => {};
      w.confirm = () => true;
      const request = w.requestAnimationFrame.bind(w);
      const cancel = w.cancelAnimationFrame.bind(w);
      const frames = new Set();
      let closing = false;
      w.requestAnimationFrame = callback => {
        if (closing) return 0;
        const id = request(time => { frames.delete(id); if (!closing) callback(time); });
        frames.add(id);
        return id;
      };
      w.cancelAnimationFrame = id => { frames.delete(id); cancel(id); };
      closeFrames = () => { closing = true; frames.forEach(cancel); frames.clear(); };
    }
  });
  const w = dom.window;
  if (w.document.readyState !== 'complete') await new Promise(resolve => w.addEventListener('load', resolve, {once: true}));
  await tick(w);
  return {w, errors, close: async () => {
    w.__TBCurrentAttemptReview?.destroy?.();
    closeFrames();
    w.close();
    await Promise.resolve();
  }};
}
function click(w, selector) { const el=w.document.querySelector(selector); assert.ok(el, selector); el.click(); return el; }
function choose(w, kind, value) { click(w,`[data-quiz-set-kind="${kind}"][data-quiz-set="${value}"]`); }
function chosen(w, kind) { return w.document.querySelector(`[data-quiz-set-kind="${kind}"][aria-pressed="true"]`)?.dataset.quizSet; }
function change(w, selector, value) { const el=w.document.querySelector(selector); el.value=value; el.dispatchEvent(new w.Event('change',{bubbles:true})); }
function signature(q) { return JSON.stringify([q.qid||q.id||null,q.stem,q.options]); }
function pool(e, bank) { return bank==='mix'?Object.values(e.sets||{1:e.bank}).flat():(e.sets?.[bank]||e.bank); }
function assertPool(s, e, bank, domain) {
  assert.equal(s.setId,bank,'the attempt pins its own selected set');
  const rows=pool(e,bank),allowed=new Set(rows.map(signature));
  assert.ok(s.records.length>0);
  for(const r of s.records) assert.ok(allowed.has(signature(r.question)),'all questions belong to the chosen bank');
  assert.equal(new Set(s.records.map(r=>signature(r.question))).size,s.records.length,'no duplicate questions');
  if(domain){const subs=new Set(e.bok.find(d=>d.domain===domain).subs.map(s=>s.id));assert.ok(s.records.every(r=>subs.has(r.question.sub)),'Focused Quiz keeps its area boundary');}
}
function submit(w) { const last=w.__TB.getFeedbackSnapshot().records.length-1;click(w,`[data-goto="${last}"]`);click(w,'[data-submit]'); }
function card(w,kind){return w.document.querySelector(`[data-mode="${kind}"]`).closest('.tb-mode');}
for(const exam of ['cssbb','cssgb','mbb','cqe','cmq']) {
  test(`${exam}: every Quick/Focused test-set choice draws only its own questions`,async()=>{
    const h=await harness(),{w}=h;
    try {
      click(w,`.tb-tile[data-exam="${exam}"]`);
      const e=w.__TB.EXAMS[exam],ids=Object.keys(e.sets||{1:e.bank}).filter(id=>pool(e,id).length),choices=ids.length>1?ids.concat('mix'):ids;
      for(const kind of ['quick','focus']) {
        assert.deepEqual([...w.document.querySelectorAll(`[data-quiz-set-kind="${kind}"]`)].map(b=>b.dataset.quizSet),choices);
        for(const setId of choices) {
          choose(w,kind,setId);
          click(w,`[data-count="${kind}"][data-n="10"]`);
          const area=w.document.querySelector('[data-focusdom]').value;
          const fullBefore=card(w,'full').textContent;
          const other=kind==='quick'?'focus':'quick',otherBefore=chosen(w,other);
          assert.equal(chosen(w,kind),setId);
          assert.ok(card(w,kind).textContent.includes(setId==='mix'?'Mixed (all sets)':`Set ${setId}`));
          click(w,`[data-mode="${kind}"]`);
          const data=w.__TB.getFeedbackSnapshot();assertPool(data,e,setId,kind==='focus'?area:null);
          assert.ok(data.records.length<=10);
          submit(w);await tick(w);
          assert.equal(w.document.querySelector('[data-score-result]').dataset.sessionSet,setId);
          click(w,'[data-open-review="all"]');
          assert.equal(w.document.querySelectorAll('.tb-review-card').length,data.records.length);
          click(w,'[data-retake]');assertPool(w.__TB.getFeedbackSnapshot(),e,setId,kind==='focus'?area:null);
          assert.ok(w.__TB.getFeedbackSnapshot().records.every(r=>r.selected===null));
          click(w,'[data-backsim]');await tick(w);
          assert.equal(chosen(w,other),otherBefore,'the sibling quiz choice is unchanged');
          assert.equal(card(w,'full').textContent,fullBefore,'Full Exam is unchanged');
        }
      }
      assert.deepEqual(h.errors,[]);
    } finally {await h.close();}
  });
}
test('Full, Quick and Focused selections remain independent across other controls and result navigation',async()=>{
  const h=await harness(),{w}=h;
  try {
    choose(w,'quick','2');choose(w,'focus','3');
    const focusDom=w.__TB.EXAMS.cssbb.bok[1].domain;
    change(w,'[data-focusdom]',focusDom);
    click(w,'[data-count="quick"][data-n="30"]');
    click(w,'[data-timing-kind="quick"][data-timed="1"]');
    click(w,'[data-set="mix"]');
    assert.equal(chosen(w,'quick'),'2');assert.equal(chosen(w,'focus'),'3');
    assert.equal(w.document.querySelector('[data-focusdom]').value,focusDom);
    assert.ok(card(w,'full').textContent.includes('Mixed (all sets)'));
    click(w,'[data-mode="quick"]');let s=w.__TB.getFeedbackSnapshot();assert.equal(s.records.length,30);assertPool(s,w.__TB.EXAMS.cssbb,'2');
    click(w,`[data-opt="${s.records[0].question.answer}"]`);submit(w);await tick(w);
    const original=JSON.stringify(w.__TB.getFeedbackSnapshot());
    click(w,'[data-retry-missed]');click(w,`[data-retry-opt="${s.records[1].question.answer}"]`);click(w,'[data-retry-check]');
    assert.equal(JSON.stringify(w.__TB.getFeedbackSnapshot()),original);
    click(w,'[data-back]');await tick(w);
    click(w,'[data-mode="focus"]');s=w.__TB.getFeedbackSnapshot();assertPool(s,w.__TB.EXAMS.cssbb,'3',focusDom);
    click(w,'[data-backsim]');click(w,'[data-mode="full"]');assertPool(w.__TB.getFeedbackSnapshot(),w.__TB.EXAMS.cssbb,'mix');
    click(w,'[data-backsim]');click(w,'.tb-tile[data-exam="cmq"]');
    assert.equal(chosen(w,'quick'),'1');assert.equal(chosen(w,'focus'),'1');
    assert.equal(w.document.querySelector('[data-quiz-set="3"]'),null);
    click(w,'.tb-tile[data-exam="cre"]');assert.equal(w.document.querySelector('[data-quiz-set]'),null);
    assert.deepEqual(h.errors,[]);
  } finally {await h.close();}
});
test('test-set groups support keyboard selection, focus retention and page-memory-only reset',async()=>{
  const h=await harness(),{w}=h;
  try {
    let button=click(w,'[data-quiz-set-kind="quick"][data-quiz-set="1"]');
    for(const [key,value] of [['ArrowRight','2'],['End','mix'],['Home','1'],['ArrowLeft','mix']]){
      button=w.document.activeElement;
      button.dispatchEvent(new w.KeyboardEvent('keydown',{key,bubbles:true}));
      assert.equal(chosen(w,'quick'),value);assert.equal(w.document.activeElement.dataset.quizSet,value);
      assert.equal(chosen(w,'focus'),'1');
    }
    assert.deepEqual([...Object.keys(w.localStorage),...Object.keys(w.sessionStorage)].filter(k=>/^(tb-|test-bank|upskill-test-bank)/i.test(k)),[]);
    assert.deepEqual(h.errors,[]);
  } finally {await h.close();}
  const fresh=await harness();try{assert.equal(chosen(fresh.w,'quick'),'1');assert.equal(chosen(fresh.w,'focus'),'1');}finally{await fresh.close();}
});
test('an empty focused area cannot launch an empty exam or silently use another bank',async()=>{
  const h=await harness(),{w}=h;
  try {
    const e=w.__TB.EXAMS.cssbb,subs=new Set(e.bok[0].subs.map(s=>s.id));
    e.sets[2]=e.sets[2].filter(q=>!subs.has(q.sub));assert.ok(e.sets[2].length);
    choose(w,'focus','2');
    assert.equal(w.document.querySelector('[data-mode="focus"]').disabled,true);
    assert.match(card(w,'focus').textContent,/No questions are available.*Choose another area or test set/);
    click(w,'[data-mode="focus"]');assert.equal(w.document.querySelector('.tb-quiz'),null);
    choose(w,'focus','1');assert.equal(w.document.querySelector('[data-mode="focus"]').disabled,false);
    assert.deepEqual(h.errors,[]);
  } finally {await h.close();}
});
for (const [kind,setId,count,timed] of [['quick','2',30,true],['focus','3',10,false]]) {
  test(`12 consecutive ${kind} retakes preserve the independent set, count, timing and clean answers`,async()=>{
    const h=await harness(),{w}=h;
    try {
      const e=w.__TB.EXAMS.cssbb;
      click(w,'[data-set="mix"]');
      choose(w,'quick','2');choose(w,'focus','3');
      click(w,`[data-count="${kind}"][data-n="${count}"]`);
      click(w,`[data-timing-kind="${kind}"][data-timed="${timed?'1':'0'}"]`);
      const domain=e.bok.find(d=>e.sets[3].filter(q=>d.subs.some(s=>s.id===q.sub)).length>=10).domain;
      change(w,'[data-focusdom]',domain);
      click(w,`[data-mode="${kind}"]`);
      const ids=new Set();
      let previous=null;
      for(let cycle=0;cycle<=12;cycle++) {
        const s=w.__TB.getFeedbackSnapshot();
        assert.equal(ids.has(s.sessionId),false,'each retake has a new session ID');ids.add(s.sessionId);
        assertPool(s,e,setId,kind==='focus'?domain:null);
        assert.equal(s.records.length,count);
        assert.equal(s.completed,false);
        assert.ok(s.records.every(r=>r.selected===null&&!r.flagged),'no prior answers or flags leak');
        assert.match(w.document.querySelector('.tb-quiztop .tb-diag-kick').textContent,
          new RegExp(`${kind==='quick'?'Quick':'Focused'} Quiz · Set ${setId} · ${timed?'timed':'untimed'}`));
        assert.equal(Boolean(w.document.querySelector('#tb-timer')),timed);
        if(previous)assert.equal(JSON.stringify(previous.snapshot),previous.serialized,'the prior result stays immutable');
        if(cycle===12)break;
        click(w,`[data-opt="${s.records[0].question.answer}"]`);click(w,'[data-flag]');
        submit(w);await tick(w);
        assert.equal(w.document.querySelector('[data-score-result]').dataset.sessionSet,setId);
        const finished=w.__TB.getFeedbackSnapshot();
        assert.equal(finished.completed,true);assert.equal(finished.grading.correct,1);
        previous={snapshot:finished,serialized:JSON.stringify(finished)};
        click(w,'[data-retake]');await tick(w);
        assert.equal(w.document.querySelector('#tb-feedback-loop'),null);
      }
      assert.equal(ids.size,13);
      click(w,'[data-backsim]');await tick(w);
      assert.equal(chosen(w,'quick'),'2');assert.equal(chosen(w,'focus'),'3');
      assert.equal(w.document.querySelector('[data-set].on').dataset.set,'mix');
      assert.equal(w.document.querySelector('[data-focusdom]').value,domain);
      assert.deepEqual([...Object.keys(w.localStorage),...Object.keys(w.sessionStorage)].filter(k=>/^(tb-|test-bank|upskill-test-bank)/i.test(k)),[]);
      assert.deepEqual(h.errors,[]);
    } finally {await h.close();}
  });
}

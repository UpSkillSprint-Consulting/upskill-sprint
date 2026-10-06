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
      // A JSDOM window can queue another frame while close() removes its DOM.
      // Track real frame handles and cancel them rather than suppressing errors.
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
function start(w, exam, mode, timed = false, bank = null) {
  w.document.querySelector(`.tb-tile[data-exam="${exam}"]`).click();
  const actual = mode === 'focused' ? 'focus' : mode;
  if(bank != null) w.document.querySelector(actual==='full'?`[data-set="${bank}"]`:`[data-quiz-set-kind="${actual}"][data-quiz-set="${bank}"]`)?.click();
  w.document.querySelector(`[data-timing-kind="${actual}"][data-timed="${timed ? 1 : 0}"]`)?.click();
  const native = w.document.querySelector(`#tb-overview [data-mode="${actual}"]`);
  if (native) native.click();
  else {
    if (mode === 'focused') { w.document.querySelector('[data-start-focus]').click(); w.document.querySelector('#f-subtopic').value = 'ALL'; }
    const count = w.document.querySelector(mode === 'quick' ? '#f-quick-n' : '#f-n');
    if (count) count.value = '5';
    w.document.querySelector(mode === 'focused' ? '#f-startbtn' : mode === 'quick' ? '[data-start-quick]' : '[data-start-full]').click();
  }
  assert.ok(w.document.querySelector('.tb-quiz'), `${exam}/${mode} starts`);
  const data = w.__TB.getFeedbackSnapshot();
  assert.ok(data.records.length >= 3, 'at least three questions for correction coverage');
  return data;
}
function select(w, index, option) {
  w.document.querySelector(`[data-goto="${index}"]`).click();
  w.document.querySelector(`[data-opt="${option}"]`).click();
}
function submit(w) {
  const last = w.__TB.getFeedbackSnapshot().records.length - 1;
  w.document.querySelector(`[data-goto="${last}"]`).click();
  w.document.querySelector('[data-submit]').click();
}
async function finish(w) {
  submit(w); await tick(w);
  assert.ok(w.document.querySelector('[data-score-result], .tb-reshead'));
  assert.equal(w.document.querySelectorAll('#tb-feedback-loop').length, 1, 'exactly one review panel');
}
function click(w, selector) {
  const el = w.document.querySelector(selector);
  assert.ok(el, 'control exists: ' + selector);
  el.click();
}
function score(w) { return w.document.querySelector('[data-score-result]').textContent; }
test('untimed reveal applies to every delivered exam and session type', async parent => {
  const catalog = await harness();
  const exams = [...catalog.w.document.querySelectorAll('.tb-tile[data-exam]')].filter(el => !/coming soon/i.test(el.textContent)).map(el => el.dataset.exam);
  await catalog.close();
  for (const exam of exams) for (const mode of ['full', 'quick', 'focused']) await parent.test(`${exam}/${mode}`, async () => {
    const h = await harness(), w = h.w, d = w.document;
    try {
      const original = start(w, exam, mode);
      const first = original.records[0].question, second = original.records[1].question;
      const button = d.querySelector('[data-reveal]');
      assert.equal(button.previousElementSibling.dataset.flag, '');
      assert.match(d.querySelector('#tb-reveal-hint').textContent, /counts that question as incorrect/);
      // Reveal before choosing; the original question DOM and scratch work survive.
      const stem = d.querySelector('.tb-quiz');
      const scratch = d.createElement('input'); scratch.value = 'learner work'; stem.appendChild(scratch);
      button.click();
      assert.equal(d.querySelector('.tb-quiz'), stem);
      assert.equal(scratch.value, 'learner work');
      assert.match(d.querySelector('#tb-revealed-answer').textContent, new RegExp('Correct answer: ' + String.fromCharCode(65 + first.answer)));
      assert.equal(d.activeElement.id, 'tb-revealed-answer');
      assert.equal(d.querySelector('[data-reveal]').getAttribute('aria-controls'), 'tb-revealed-answer');
      assert.equal(w.__TB.revealCurrentAnswer(), false, 'duplicate reveals rejected');
      assert.ok(d.querySelector('[data-goto="0"]').classList.contains('revealed'));
      assert.ok([...d.querySelectorAll('[data-opt]')].every(el => el.disabled));
      d.querySelector(`[data-opt="${first.answer}"]`).dispatchEvent(new w.MouseEvent('click', {bubbles:true}));
      assert.equal(w.__TB.getFeedbackSnapshot().records[0].selected, null, 'synthetic answer cannot override reveal');
      select(w, 1, second.answer);
      d.querySelector('[data-reveal]').click();
      const flag = d.querySelector('[data-flag]'), panel = d.querySelector('#tb-revealed-answer');
      flag.focus();flag.click();
      assert.equal(d.activeElement,flag,'flagging preserves keyboard focus');
      assert.equal(flag.getAttribute('aria-pressed'),'true');
      assert.equal(d.querySelector('#tb-revealed-answer'),panel,'flagging preserves reveal details');
      assert.ok(d.querySelector('[data-goto="1"]').classList.contains('revealed'));
      d.querySelector('[data-goto="0"]').click();
      assert.ok(d.querySelector('#tb-revealed-answer'));
      d.querySelector('[data-goto="1"]').click();
      assert.equal(d.querySelector(`[data-opt="${second.answer}"]`).getAttribute('aria-pressed'),'true','selected option remains accessible on return');
      const third = original.records[2].question;
      select(w, 2, third.answer);
      await finish(w);
      const completed = w.__TB.getFeedbackSnapshot();
      assert.equal(completed.grading.correct, 1);
      assert.equal(completed.grading.incorrect, 2);
      assert.equal(completed.grading.revealed, 2);
      assert.equal(completed.grading.unanswered, original.records.length - 3);
      assert.match(score(w), /2 revealed \(counted as incorrect\)/);
      click(w, '[data-open-review="all"]');
      assert.equal(d.querySelectorAll('.tb-review-card.revealed').length, 2);
      assert.equal(d.querySelectorAll('.tb-review-navcell.revealed').length, 2);
      assert.match(d.querySelector('.tb-review-card.revealed').textContent, /Answer revealed — counted as incorrect/);
      click(w, '[data-review-tab="incorrect"]');
      assert.equal(d.querySelectorAll('.tb-review-card').length, 2);
      click(w, '[data-review-tab="revealed"]');
      assert.equal(d.querySelectorAll('.tb-review-card').length, 2);
      const initialScore = score(w);
      click(w, '[data-retry-missed]');
      click(w, `[data-retry-opt="${first.answer}"]`);
      click(w, '[data-retry-check]');
      assert.equal(score(w), initialScore, 'correction does not change original exam score');
      assert.deepEqual(h.errors, []);
    } finally { await h.close(); }
  });
});
test('timed sessions reject answer reveal in all session types', async () => {
  for (const mode of ['full','quick','focused']) {
    const h = await harness(), w = h.w;
    try {
      w.document.querySelector('.tb-tile[data-exam="CSSGB"]').click();
      const kind = mode === 'focused' ? 'focus' : mode;
      click(w, `[data-timing-kind="${kind}"][data-timed="1"]`);
      start(w, 'CSSGB', mode, true);
      assert.ok(w.document.querySelector('#tb-timer'));
      assert.equal(w.document.querySelector('[data-reveal]'), null);
      assert.equal(w.__TB.revealCurrentAnswer(), false);
      assert.ok(w.__TB.getFeedbackSnapshot().records.every(r => !r.revealed));
    } finally { await h.close(); }
  }
});
test('future question schemas use shared grading and safe explanations', async () => {
  const h = await harness(), w = h.w;
  try {
    const data = start(w, 'CSSGB', 'quick');
    // The current snapshot uses live authored objects: future question fields need no exam-specific hooks.
    const q = data.records[0].question;
    q.why = '<strong>Future explanation</strong><img src="javascript:alert(1)" onerror="alert(1)"><script>window.badReveal=true</script>';
    click(w, '[data-reveal]');
    const panel = w.document.querySelector('#tb-revealed-answer');
    assert.match(panel.textContent, /Future explanation/);
    assert.ok(panel.querySelector('strong'));
    assert.equal(panel.querySelector('script,[onerror],[src^="javascript:"]'), null);
    assert.equal(w.badReveal, undefined);
    const futureQ = {options:['a','b'], answer:1, sub:'future-sub'};
    const grade = w.__TBVersions.scoreRecords([
      {question:futureQ,selected:1,revealed:true},
      {question:futureQ,selected:null,revealed:true},
      {question:futureQ,selected:1},
      {question:futureQ,selected:null}
    ], {bok:[{domain:'future-domain',subs:[{id:'future-sub'}]}]});
    assert.equal(grade.correct,1); assert.equal(grade.incorrect,2); assert.equal(grade.unanswered,1); assert.equal(grade.revealed,2);
    assert.equal(grade.byDomain['future-domain'].revealed,2);
    assert.equal(grade.bySubtopic['future-sub'].incorrect,2);
    click(w, '[data-quit]');
    assert.equal(w.__TB.revealCurrentAnswer(),false);
    const fresh = start(w,'CSSGB','quick');
    assert.ok(fresh.records.every(r=>!r.revealed));
    assert.equal(w.document.querySelector('#tb-revealed-answer'),null);
    fresh.records[0].question.answer = -1;
    assert.equal(w.__TB.revealCurrentAnswer(),false,'invalid key cannot be revealed');
    assert.deepEqual(h.errors,[]);
  } finally {await h.close();}
});
test('real CQE calculations remain complete in reveal and review',async()=>{
  const h=await harness(),w=h.w;
  try{
    const affected=Object.values(w.__TB.EXAMS.cqe.sets).flat().filter(q=>/<[XZ]</.test(q.why||''));
    assert.equal(affected.length,4,'all current CQE inequality explanations are covered');
    for(const q of affected){
      const template=w.document.createElement('template');template.innerHTML=w.__TBFeedbackPresentation.explanationHtml(q);
      assert.equal(template.content.querySelector('.tb-explanation-copy').textContent,q.why);
    }
    const data=start(w,'cqe','quick');data.records[0].question.why=affected[0].why;
    click(w,'[data-reveal]');
    assert.equal(w.document.querySelector('#tb-revealed-answer .tb-explanation-copy').textContent,affected[0].why);
    await finish(w);click(w,'[data-open-review="all"]');
    assert.equal(w.document.querySelector('.tb-review-card.revealed .tb-explanation-copy').textContent,affected[0].why);
    assert.deepEqual(h.errors,[]);
  }finally{await h.close();}
});
test('revealing and flagging preserve the real MBB interactive question',async()=>{
  const h=await harness(),w=h.w,d=w.document;
  try{
    click(w,'.tb-tile[data-exam="mbb"]');click(w,'[data-set="2"]');
    const data=start(w,'mbb','full',false,'2');
    const index=data.records.findIndex(r=>r.question.qid==='mbb:set-2:original-005');assert.ok(index>=0);
    click(w,`[data-goto="${index}"]`);
    const slider=d.querySelector('[data-tb-whatif]');assert.ok(slider,'real authored interactive item');
    slider.value='7';slider.dispatchEvent(new w.Event('input',{bubbles:true}));
    click(w,'[data-reveal]');
    assert.equal(d.querySelector('[data-tb-whatif]'),slider);assert.equal(slider.value,'7');
    const details=d.querySelector('#tb-revealed-answer .tb-review-rationales');assert.ok(details);details.open=true;
    const flag=d.querySelector('[data-flag]');flag.focus();flag.click();
    assert.equal(d.activeElement,flag);assert.equal(d.querySelector('[data-tb-whatif]'),slider);
    assert.equal(slider.value,'7');assert.equal(details.open,true);
    assert.equal(flag.getAttribute('aria-pressed'),'true');
    flag.click();assert.equal(flag.getAttribute('aria-pressed'),'false');
    assert.equal(d.querySelector('.tb-navcell.cur').classList.contains('flag'),false);
    assert.ok(d.querySelector('.tb-navcell.cur').classList.contains('revealed'));
    assert.deepEqual(h.errors,[]);
  }finally{await h.close();}
});
test('every current test set and mixed pool inherits reveal grading',async parent=>{
  const catalog=await harness();
  const exams=Object.entries(catalog.w.__TB.EXAMS).filter(([,e])=>e.bank?.length).map(([id,e])=>({id,sets:Object.keys(e.sets||{1:e.bank})}));
  await catalog.close();
  for(const exam of exams) await parent.test(exam.id,async()=>{
    const h=await harness(),w=h.w;
    try{
      for(const mode of ['full','quick','focused'])for(const bank of [...exam.sets,...(exam.sets.length>1?['mix']:[])]){
        w.document.querySelector('[data-back]')?.click();
        click(w,`.tb-tile[data-exam="${exam.id}"]`);
        const kind=mode==='focused'?'focus':mode;
        const selector=kind==='full'?`[data-set="${bank}"]`:`[data-quiz-set-kind="${kind}"][data-quiz-set="${bank}"]`;
        w.document.querySelector(selector)?.click();
        const data=start(w,exam.id,mode,false,bank);
        assert.equal(data.setId,bank,`${exam.id}/${mode}/${bank} uses selected pool`);
        click(w,'[data-reveal]');await finish(w);
        const grading=w.__TB.getFeedbackSnapshot().grading;
        assert.equal(grading.incorrect,1);assert.equal(grading.revealed,1);assert.equal(grading.correct,0);
        assert.equal(grading.unanswered,data.records.length-1);
        click(w,'[data-open-review="missed"]');
        assert.equal(w.document.querySelectorAll('.tb-review-card.revealed').length,1);
      }
      assert.deepEqual(h.errors,[]);
    }finally{await h.close();}
  });
});
test('a newly populated certification inherits the complete reveal flow',async()=>{
  const h=await harness(),w=h.w,d=w.document;
  try{
    const e=w.__TB.EXAMS.cqa;
    const q={qid:'future-certification:original-001',stem:'Future certification sample',sub:e.bok[0].subs[0].id,options:['First','Second','Third'],answer:2,why:'Shared reveal needs no certification-specific hook.'};
    e.bank=[q];e.sets={1:[q]};
    click(w,'.tb-tile[data-exam="cqa"]');click(w,'[data-timing-kind="full"][data-timed="0"]');click(w,'[data-mode="full"]');
    assert.equal(w.__TB.revealCurrentAnswer(),true);
    assert.match(d.querySelector('#tb-revealed-answer').textContent,/Third/);
    await finish(w);
    const data=w.__TB.getFeedbackSnapshot();assert.equal(data.examId,'cqa');
    assert.equal(data.grading.incorrect,1);assert.equal(data.grading.revealed,1);assert.equal(data.grading.correct,0);
    click(w,'[data-open-review="all"]');
    assert.equal(d.querySelectorAll('.tb-review-card.revealed').length,1);
    assert.equal(d.querySelectorAll('.tb-review-navcell.revealed').length,1);
    assert.deepEqual(h.errors,[]);
  }finally{await h.close();}
});

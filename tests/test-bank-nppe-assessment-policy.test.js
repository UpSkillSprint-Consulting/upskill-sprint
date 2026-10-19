'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const ROOT = path.resolve(__dirname, '..');
let workspace, build, packet;
const wait = () => new Promise(resolve => setTimeout(resolve, 70));
const scored = record => record.question.scored !== false && record.question.experimental !== true;

test.before(async () => {
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'nppe-policy-'));
  for (const entry of fs.readdirSync(ROOT, {withFileTypes: true})) {
    if (['.git', 'content', 'public-site', 'node_modules'].includes(entry.name)) continue;
    fs.symlinkSync(path.join(ROOT, entry.name), path.join(workspace, entry.name), entry.isDirectory() ? 'dir' : 'file');
  }
  build = await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(workspace);
  packet = JSON.parse(fs.readFileSync(path.join(build.output, 'nppe.json'), 'utf8'));
});
test.after(() => { if (workspace) fs.rmSync(workspace, {recursive: true, force: true}); });

async function harness(releaseMockFixture = false) {
  const errors = [], console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(build.shell, {
    url: 'https://upskillsprint.com/test-bank?exam=nppe',
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: console
  });
  const w = dom.window, d = w.document;
  w.scrollTo = w.alert = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.confirm = () => true;
  const request = w.requestAnimationFrame.bind(w), cancel = w.cancelAnimationFrame.bind(w);
  const frames = new Set();
  let closing = false;
  w.requestAnimationFrame = callback => {
    if (closing) return 0;
    const id = request(time => { frames.delete(id); if (!closing) callback(time); });
    frames.add(id); return id;
  };
  w.cancelAnimationFrame = id => { frames.delete(id); cancel(id); };
  packet.scripts.forEach(source => w.eval(source));
  await wait();
  if (releaseMockFixture) {
    // Isolated test fixture only: product delivery retains all release holds.
    const formId=releaseMockFixture===true?'set-1-mock-a':releaseMockFixture;
    const form=w.__TB.EXAMS.nppe.formCatalog.find(f=>f.id===formId);
    assert.equal(form.releaseHold,true);
    form.releaseHold=false;
    d.querySelector('[data-nppe-owner="1"]').click();
  }
  return {w, d, errors, close() {
    w.__TBCurrentAttemptReview?.destroy?.();
    closing = true; frames.forEach(cancel); frames.clear(); w.close();
  }};
}
function click(d, selector) {
  const el = d.querySelector(selector);
  assert.ok(el, 'Missing control: ' + selector);
  assert.equal(el.disabled, false, 'Disabled control: ' + selector);
  el.click();
}

test('available NPPE forms and isolated held-mock fixtures withhold answers in both timing modes and score only eligible items', async parent => {
  const catalog = await harness();
  const exam = catalog.w.__TB.EXAMS.nppe;
  const forms = Array.from(exam.formCatalog)
    .filter(form => ['diagnostic', 'mock'].includes(form.kind) && (exam.forms[form.id] || []).length > 0 && (form.kind !== 'mock' || exam.forms[form.id].length === form.target))
    .map(form => ({id: form.id, owner: form.authorSet, kind: form.kind, count: exam.forms[form.id].length}));
  assert.ok(forms.some(form => form.id === 'set-1-diagnostic'), 'Diagnostic must be covered');
  assert.ok(forms.some(form => form.id === 'mock-d'), 'Mock D must be covered');
  assert.ok(forms.some(form => form.id === 'mock-e'), 'Mock E must be covered');
  assert.ok(forms.some(form => form.id === 'set-1-mock-a'), 'Completed Mock A must be tested in isolation');
  assert.ok(forms.some(form => form.id === 'set-1-mock-b'), 'Completed Mock B must be tested in isolation');
  catalog.close();
  for (const form of forms) for (const timed of [true, false]) {
    await parent.test(form.id + (timed ? '/timed' : '/untimed'), async () => {
      const h = await harness(['set-1-mock-a','set-1-mock-b'].includes(form.id) ? form.id : false), {w, d} = h;
      try {
        click(d, '[data-nppe-owner="' + form.owner + '"]');
        click(d, '[data-set="' + form.id + '"]');
        click(d, '[data-timing-kind="full"][data-timed="' + (timed ? '1' : '0') + '"]');
        click(d, '[data-mode="full"]');
        const original = w.__TB.getFeedbackSnapshot(), records = Array.from(original.records);
        assert.equal(original.setId, form.id);
        assert.equal(records.length, form.count);
        assert.ok(records.every(record => record.question.form === form.id && record.question.authorSet === form.owner));
        assert.equal(d.querySelector('[data-reveal]'), null);
        assert.equal(d.querySelector('#tb-feedback-loop'), null);
        assert.equal(d.querySelector('#tb-revealed-answer'), null);
        assert.equal(w.__TB.revealCurrentAnswer(), false, 'programmatic reveal is denied as well');
        assert.ok(records.every(record => !record.revealed));
        if (!timed) assert.equal(d.querySelector('.tb-timer').textContent, 'Untimed');
        const eligible = records.map((record, index) => ({record, index})).filter(({record}) => scored(record));
        const expectedTotal = form.kind === 'mock' ? 100 : records.length;
        assert.equal(eligible.length, expectedTotal);
        assert.equal(records.length - eligible.length, form.kind === 'mock' ? 10 : 0);
        assert.ok(eligible.length >= 2);
        const first = eligible[0], second = eligible[1];
        click(d, '[data-goto="' + first.index + '"]');
        click(d, '[data-opt="' + first.record.question.answer + '"]');
        click(d, '[data-flag]');
        assert.equal(w.__TB.revealCurrentAnswer(), false);
        click(d, '[data-goto="' + second.index + '"]');
        click(d, '[data-opt="' + ((second.record.question.answer + 1) % 4) + '"]');
        // A correctly answered experimental item must not increase the raw score.
        const experimentalIndex = records.findIndex(record => !scored(record));
        if (experimentalIndex >= 0) {
          click(d, '[data-goto="' + experimentalIndex + '"]');
          click(d, '[data-opt="' + records[experimentalIndex].question.answer + '"]');
        }
        click(d, '[data-goto="' + (records.length - 1) + '"]');
        click(d, '[data-submit]');
        await wait();
        const result = w.__TB.getFeedbackSnapshot();
        assert.equal(result.grading.total, expectedTotal);
        assert.equal(result.grading.correct, 1);
        assert.equal(result.grading.incorrect, 1);
        assert.equal(result.grading.unanswered, expectedTotal - 2);
        assert.equal(result.grading.revealed, 0);
        assert.equal(result.grading.correct + result.grading.incorrect + result.grading.unanswered, expectedTotal);
        assert.match(d.querySelector('[data-score-result]').textContent, new RegExp('\\(1/' + expectedTotal + '\\)'));
        assert.match(d.querySelector('#tb-overview').textContent, /not an official scaled NPPE score/);
        assert.equal(d.querySelectorAll('#tb-feedback-loop').length, 1);
        click(d, '[data-open-review="all"]');
        assert.ok(d.querySelectorAll('.tb-review-card').length > 0, 'post-submission answer review is available');
        assert.equal(d.querySelectorAll('.tb-review-card.revealed').length, 0);
        assert.deepEqual(h.errors, []);
      } finally { h.close(); }
    });
  }
});

// Authoring completion must not override the explicit release hold or borrow another form.
test('complete Mock A remains held, disabled and cannot substitute another bank', async () => {
 const h=await harness(), {w,d}=h;
 try {
  const e=w.__TB.EXAMS.nppe;
  assert.equal(e.forms['set-1-mock-a'].length,110);
  assert.equal(e.formCatalog.find(f=>f.id==='set-1-mock-a').target,110);
  const control=d.querySelector('[data-set="set-1-mock-a"]');
  assert.equal(control.disabled,true);
  assert.equal(e.formCatalog.find(f=>f.id==='set-1-mock-a').releaseHold,true);
  assert.match(control.getAttribute('aria-label'),/awaiting release review/);
  assert.equal(control.querySelector('.tb-sets').textContent,'110');
  control.dispatchEvent(new w.Event('click'));
  assert.equal(w.__TB.getFeedbackSnapshot(),null);
  assert.equal(d.querySelector('[data-mode="full"]').disabled,true);
  d.querySelector('[data-mode="full"]').dispatchEvent(new w.Event('click'));
  assert.equal(d.querySelector('.tb-quiz'),null);
  assert.equal(e.forms['set-1-learning'].length,120);
  assert.equal(e.forms['set-1-diagnostic'].length,50);
  for(const id of ['mock-d','mock-e'])assert.equal(e.forms[id].length,110);
  assert.deepEqual(h.errors,[]);
 } finally {h.close();}
});

// Full-form QA uses an isolated release fixture; no product setting or learner grant changes.
test('isolated complete Mock A scores 100/100 despite ten wrong experimental answers and explains all 110 items', async () => {
 const h=await harness(true),{w,d}=h;
 try {
  click(d,'[data-set="set-1-mock-a"]');
  assert.match(d.querySelector('[data-nppe-bank="set-1-mock-a"]').textContent,/150 minutes/);
  click(d,'[data-mode="full"]');
  const records=Array.from(w.__TB.getFeedbackSnapshot().records);
  assert.equal(records.length,110);
  assert.equal(new Set(records.map(r=>r.question.qid)).size,110);
  assert.ok(records.every(r=>r.question.form==='set-1-mock-a'&&r.question.authorSet===1));
  assert.match(d.querySelector('#tb-timer').textContent,/^2:(?:30:00|29:[0-5][0-9])$/);
  assert.equal(d.querySelector('[data-reveal]'),null);
  assert.doesNotMatch(d.querySelector('.tb-quiz').textContent,/experimental|unscored/i,'scoring roles must be hidden during the attempt');
  for(const [i,r] of records.entries()) {
   click(d,'[data-goto="'+i+'"]');
   click(d,'[data-opt="'+(scored(r)?r.question.answer:(r.question.answer+1)%4)+'"]');
  }
  click(d,'[data-submit]');await wait();
  const result=w.__TB.getFeedbackSnapshot();
  assert.equal(result.grading.total,100);assert.equal(result.grading.correct,100);
  assert.equal(result.grading.incorrect,0);assert.equal(result.grading.unanswered,0);
  assert.match(d.querySelector('[data-score-result]').textContent,/100% \(100\/100\)/);
  const domains=Array.from(d.querySelectorAll('.tb-domblock'));
  assert.equal(domains.length,6);
  [8,20,30,26,8,8].forEach((n,i)=>assert.ok(domains[i].textContent.includes('('+n+'/'+n+')')));
  click(d,'[data-open-review="all"]');
  assert.equal(d.querySelectorAll('.tb-review-card').length,110);
  for(const r of records) {
   const card=d.querySelector('.tb-review-card[data-question-id="'+r.question.qid+'"]');
   assert.ok(card);
   assert.equal(card.querySelectorAll('.tb-review-rationales p').length,3);
   for(const explanation of r.question.optionRationales)assert.ok(card.textContent.includes(explanation),r.question.legacyId);
  }
  assert.deepEqual(h.errors,[]);
 } finally {h.close();}
});

test('removing the release hold in a fixture cannot start an incomplete or mis-scored Mock A',async()=>{
 for(const invalid of ['incomplete','wrong-scoring']) {
  const h=await harness(true),{w,d}=h;
  try {
   const bank=w.__TB.EXAMS.nppe.forms['set-1-mock-a'];
   if(invalid==='incomplete')bank.pop();else bank[0].scored=false;
   d.querySelector('[data-set="set-1-mock-a"]').dispatchEvent(new w.Event('click'));
   d.querySelector('[data-mode="full"]').dispatchEvent(new w.Event('click'));
   assert.equal(w.__TB.getFeedbackSnapshot(),null,invalid);
   assert.equal(d.querySelector('.tb-quiz'),null,invalid);
   assert.deepEqual(h.errors,[]);
  }finally{h.close();}
 }
});

test('Mock A timeout scores blanks correctly and retake resets answers and flags',async()=>{
 const h=await harness(true),{w,d}=h;
 try {
  click(d,'[data-set="set-1-mock-a"]');click(d,'[data-mode="full"]');
  const records=Array.from(w.__TB.getFeedbackSnapshot().records);
  const experiment=records.findIndex(r=>!scored(r));
  click(d,'[data-goto="'+experiment+'"]');
  click(d,'[data-opt="'+records[experiment].question.answer+'"]');click(d,'[data-flag]');
  const realNow=w.Date.now;
  w.Date.now=()=>realNow()+151*60*1000;
  await new Promise(resolve=>setTimeout(resolve,1200));
  const result=w.__TB.getFeedbackSnapshot();
  assert.equal(result.grading.total,100);assert.equal(result.grading.correct,0);
  assert.equal(result.grading.incorrect,0);assert.equal(result.grading.unanswered,100);
  assert.match(d.querySelector('[data-score-result]').textContent,/0% \(0\/100\)/);
  assert.equal(d.querySelector('.tb-quiz'),null,'expiry submits the attempt');
  w.Date.now=realNow;
  click(d,'[data-retake]');
  const retake=w.__TB.getFeedbackSnapshot();
  assert.equal(retake.records.length,110);
  assert.ok(retake.records.every(r=>r.question.form==='set-1-mock-a'));
  assert.ok(retake.records.every(r=>r.selected==null&&!r.flagged&&!r.revealed));
  assert.match(d.querySelector('#tb-timer').textContent,/^2:(?:30:00|29:[0-5][0-9])$/);
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

test('completed Mock B remains held in the real catalog and cannot start without isolated test override',async()=>{
 const h=await harness(),{w,d}=h;
 try{
  const exam=w.__TB.EXAMS.nppe,form=exam.formCatalog.find(x=>x.id==='set-1-mock-b');
  assert.equal(exam.forms['set-1-mock-b'].length,110);
  assert.equal(form.target,110);assert.equal(form.releaseHold,true);
  const button=d.querySelector('[data-set="set-1-mock-b"]');
  assert.ok(button);assert.equal(button.disabled,true);
  assert.match(button.getAttribute('aria-label'),/awaiting release review/);
  assert.equal(button.querySelector('.tb-sets').textContent,'110');
  button.dispatchEvent(new w.Event('click'));
  assert.equal(w.__TB.getFeedbackSnapshot(),null);
  assert.equal(d.querySelector('[data-mode="full"]').disabled,true);
  d.querySelector('[data-mode="full"]').dispatchEvent(new w.Event('click'));
  assert.equal(d.querySelector('.tb-quiz'),null);
  assert.deepEqual(h.errors,[]);
 }finally{h.close()}
});

test('isolated Mock B full-form attempt excludes ten simulated unscored from 100-point grading and reviews all explanations',async()=>{
 const h=await harness('set-1-mock-b'),{w,d}=h;
 try{
  click(d,'[data-set="set-1-mock-b"]');
  assert.match(d.querySelector('[data-nppe-bank="set-1-mock-b"]').textContent,/150 minutes/);
  click(d,'[data-mode="full"]');
  const records=Array.from(w.__TB.getFeedbackSnapshot().records);
  assert.equal(records.length,110);
  assert.equal(new Set(records.map(r=>r.question.qid)).size,110);
  assert.ok(records.every(r=>r.question.form==='set-1-mock-b'&&r.question.authorSet===1));
  assert.equal(records.filter(scored).length,100);
  assert.equal(records.filter(r=>!scored(r)).length,10);
  assert.equal(d.querySelector('[data-reveal]'),null);
  assert.equal(w.__TB.revealCurrentAnswer(),false);
  assert.doesNotMatch(d.querySelector('.tb-quiz').textContent,/experimental|unscored/i);
  for(const [i,r] of records.entries()){
   click(d,'[data-goto="'+i+'"]');
   click(d,'[data-opt="'+(scored(r)?r.question.answer:(r.question.answer+1)%4)+'"]');
  }
  click(d,'[data-submit]');await wait();
  const result=w.__TB.getFeedbackSnapshot();
  assert.equal(result.grading.total,100);assert.equal(result.grading.correct,100);
  assert.equal(result.grading.incorrect,0);assert.equal(result.grading.unanswered,0);
  assert.match(d.querySelector('[data-score-result]').textContent,/100% \(100\/100\)/);
  const domains=Array.from(d.querySelectorAll('.tb-domblock'));
  assert.equal(domains.length,6);
  [8,20,30,26,8,8].forEach((n,i)=>assert.ok(domains[i].textContent.includes('('+n+'/'+n+')')));
  click(d,'[data-open-review="all"]');
  assert.equal(d.querySelectorAll('.tb-review-card').length,110);
  for(const r of records){
   const card=d.querySelector('.tb-review-card[data-question-id="'+r.question.qid+'"]');
   assert.ok(card,r.question.qid);
   for(const explanation of r.question.optionRationales)assert.ok(card.textContent.includes(explanation),r.question.legacyId);
  }
  assert.deepEqual(h.errors,[]);
 }finally{h.close()}
});

test('Mock B cannot start with a mismatched 100/10 allocation, even after in-memory fixture release',async()=>{
 const h=await harness('set-1-mock-b'),{w,d}=h;
 try{
  const exam=w.__TB.EXAMS.nppe;
  const eligible=exam.forms['set-1-mock-b'].find(q=>q.scored&&!q.experimental);
  eligible.scored=false;eligible.experimental=true;
  d.querySelector('[data-set="set-1-mock-b"]').dispatchEvent(new w.Event('click'));
  d.querySelector('[data-mode="full"]').dispatchEvent(new w.Event('click'));
  assert.equal(w.__TB.getFeedbackSnapshot(),null);
  assert.equal(d.querySelector('.tb-quiz'),null);
  assert.deepEqual(h.errors,[]);
 }finally{h.close()}
});

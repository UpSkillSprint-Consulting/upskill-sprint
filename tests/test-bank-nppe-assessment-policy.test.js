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
    // Production publication is explicit; access to the protected delivery remains server authorized.
    const formId=releaseMockFixture===true?'set-1-mock-a':releaseMockFixture;
    const form=w.__TB.EXAMS.nppe.formCatalog.find(f=>f.id===formId);
    assert.equal(form.releaseHold,false);
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

test('published NPPE forms withhold answers in both timing modes and score only eligible items', async parent => {
  const catalog = await harness();
  const exam = catalog.w.__TB.EXAMS.nppe;
  const forms = Array.from(exam.formCatalog)
    .filter(form => ['diagnostic', 'mock'].includes(form.kind) && (exam.forms[form.id] || []).length > 0 && (form.kind !== 'mock' || exam.forms[form.id].length === form.target))
    .map(form => ({id: form.id, owner: form.authorSet, kind: form.kind, count: exam.forms[form.id].length}));
  assert.ok(forms.some(form => form.id === 'set-1-diagnostic'), 'Diagnostic must be covered');
  assert.ok(forms.some(form => form.id === 'mock-c' && form.owner===2), 'Grok Mock C must be covered');
  assert.ok(forms.some(form => form.id === 'mock-d' && form.owner===3), 'Claude Mock D must be covered');
  assert.ok(!forms.some(form=>form.id==='mock-e'||form.id==='set-1-mock-c'),'No fifth/mock E placeholder remains');
  assert.ok(forms.some(form => form.id === 'set-1-mock-a'), 'Released Mock A must be tested');
  assert.ok(forms.some(form => form.id === 'set-1-mock-b'), 'Released Mock B must be tested');
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

// Author-controlled release never borrows forms or removes per-certification access protection.
test('Mock A and B are available only inside the authorized NPPE package, independently of Grok/Claude', async () => {
 const h=await harness(),{w,d}=h;
 try {
  const e=w.__TB.EXAMS.nppe;
  assert.deepEqual(Array.from(e.formCatalog,f=>f.id),[
   'set-1-diagnostic','set-1-learning','set-1-mock-a','set-1-mock-b','mock-c','mock-d'
  ]);
  for(const id of ['set-1-mock-a','set-1-mock-b','mock-c','mock-d']) {
   const form=e.formCatalog.find(f=>f.id===id);
   assert.notEqual(form.releaseHold,true,id);
   assert.equal(e.forms[id].length,110,id);
   assert.equal(e.forms[id].filter(q=>q.scored===true&&!q.experimental).length,100);
   assert.equal(e.forms[id].filter(q=>q.experimental===true&&!q.scored).length,10);
  }
  assert.ok(e.forms['mock-c'].every(q=>q.form==='mock-c'&&q.authorSet===2));
  assert.ok(e.forms['mock-d'].every(q=>q.form==='mock-d'&&q.authorSet===3));
  assert.equal(e.forms['mock-e'],undefined);
  assert.ok(!e.formCatalog.some(f=>f.id==='mock-e'||f.id==='set-1-mock-c'));
  assert.equal(e.forms['set-1-learning'].length,120);
  assert.equal(e.forms['set-1-diagnostic'].length,50);
  assert.ok(e.forms['set-1-mock-b'].every(q=>q.releaseStatus==='released'));
  assert.match(e.formatNote,/not official NPPE scaled scores/);
  click(d,'[data-set="set-1-mock-a"]');
  assert.equal(d.querySelector('[data-set="set-1-mock-a"]').disabled,false);
  assert.equal(d.querySelector('[data-mode="full"]').disabled,false);
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

// Full-form QA is exercised inside the authorized fixture; learner permissions remain server checked.
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

test('released Mock A cannot start when the bank is incomplete or mis-scored',async()=>{
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

test('released Mock B is ready in Set 1 but remains isolated from other forms',async()=>{
 const h=await harness(),{w,d}=h;
 try {
  const exam=w.__TB.EXAMS.nppe,form=exam.formCatalog.find(x=>x.id==='set-1-mock-b');
  assert.equal(exam.forms['set-1-mock-b'].length,110);
  assert.equal(form.target,110);
  assert.equal(form.releaseHold,false);
  const button=d.querySelector('[data-set="set-1-mock-b"]');
  assert.ok(button);assert.equal(button.disabled,false);
  assert.doesNotMatch(button.getAttribute('aria-label'),/awaiting release review/);
  click(d,'[data-set="set-1-mock-b"]');
  assert.equal(d.querySelector('[data-mode="full"]').disabled,false);
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

test('released Mock B full-form attempt excludes ten simulated unscored from 100-point grading and reviews all explanations',async()=>{
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

test('Mock B remains fail closed on invalid 100/10 allocation after publication',async()=>{
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


test('NPPE overview has a responsive six-bank choice, correct author labels, and one accessible session launcher',async()=>{
 const h=await harness(),{w,d}=h;
 try{
  assert.equal(d.querySelectorAll('.nppe-hub').length,1);
  assert.equal(d.querySelectorAll('.nppe-fact').length,3);
  assert.equal(d.querySelector('.nppe-facts').getAttribute('role'),'group');
  assert.equal(d.querySelector('.nppe-launch-metrics').getAttribute('role'),'group');
  assert.equal(d.querySelectorAll('.nppe-author-tab[role="tab"]').length,3);
  assert.equal(d.querySelectorAll('.nppe-bank-card').length,6);
  assert.equal(d.querySelectorAll('.nppe-bank-card[aria-pressed="true"]').length,1);
  assert.equal(d.querySelectorAll('.nppe-launch').length,1);
  assert.equal(d.querySelector('#nppe-banks-1').hidden,false);
  assert.equal(d.querySelector('#nppe-banks-2').hidden,true);
  assert.equal(d.querySelector('#nppe-banks-3').hidden,true);
  assert.ok(!d.querySelector('.nppe-bank-picker').textContent.includes('Mock E'));
  assert.ok(!d.querySelector('.nppe-bank-picker').textContent.includes('set-1-mock-c'));
  click(d,'[data-set="set-1-mock-b"]');
  assert.equal(d.activeElement.dataset.set,'set-1-mock-b','selection focus is restored after repaint');
  assert.equal(d.querySelector('[data-set="set-1-mock-b"]').getAttribute('aria-pressed'),'true');
  assert.equal(d.querySelectorAll('.nppe-bank-card[aria-pressed="true"]').length,1);
  assert.equal(d.querySelector('[data-nppe-bank="set-1-mock-b"] h3').textContent,'Mock B');
  assert.equal(d.querySelectorAll('.nppe-launch').length,1);
  assert.equal(d.querySelector('[data-mode="full"]').disabled,false);
  click(d,'[data-nppe-owner="2"]');
  assert.equal(d.querySelector('#nppe-banks-1').hidden,true);
  assert.equal(d.querySelector('#nppe-banks-2').hidden,false);
  assert.equal(d.querySelector('[data-nppe-owner="2"]').getAttribute('aria-selected'),'true');
  assert.equal(d.querySelector('[data-nppe-bank="mock-c"] h3').textContent,'Mock C');
  assert.equal(d.querySelector('#nppe-banks-2 .nppe-bank-card .tb-sets').textContent,'110');
  assert.equal(d.querySelector('#nppe-banks-2 .nppe-bank-card').getAttribute('aria-pressed'),'true');
  click(d,'[data-nppe-owner="3"]');
  assert.equal(d.querySelector('[data-nppe-bank="mock-d"] h3').textContent,'Mock D');
  assert.equal(d.querySelector('#nppe-banks-3 .nppe-bank-panel-head').textContent.includes('Mock E'),false);
  click(d,'[data-timing-kind="full"][data-timed="0"]');
  assert.match(d.querySelector('[data-nppe-bank="mock-d"] .nppe-launch-note').textContent,/Untimed/);
  assert.equal(d.querySelector('[data-timing-kind="full"][data-timed="0"]').getAttribute('aria-pressed'),'true');
  assert.equal(d.querySelector('[data-mode="full"]').textContent.includes('Start Mock D'),true);
  assert.match(d.querySelector('.nppe-disclosure').textContent,/not an official scaled NPPE score/);
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

test('NPPE-only visual styles are scoped and include focus, mobile and dark-mode treatments',()=>{
 const source=fs.readFileSync(path.join(ROOT,'scripts/nppe-diagnostic-runtime.mjs'),'utf8');
 for(const token of ['.nppe-hub','.nppe-bank-card','.nppe-author-tab','.nppe-launch','.nppe-tab-number{color:var(--ink)','focus-visible','max-width:700px','max-width:460px','prefers-reduced-motion','data-theme'])
  assert.ok(source.includes(token),'Missing NPPE visual safeguard '+token);
 const original=fs.readFileSync(path.join(ROOT,'test-bank.html'),'utf8');
 assert.equal(original.includes('nppe-bank-picker'),false,'NPPE-only UI must not contaminate other simulator sources');
});


test('every NPPE bank maps its scored practice questions to one of six official blueprint areas',async()=>{
 const h=await harness(),{w}=h;
 try {
  const exam=w.__TB.EXAMS.nppe;
  const areas=[
   ['I','nppe-professionalism'],['II','nppe-ethics'],['III','nppe-practice'],
   ['IV','nppe-law'],['V','nppe-professional-law'],['VI','nppe-discipline']
  ];
  const expected={ 'set-1-diagnostic':50,'set-1-learning':120,
   'set-1-mock-a':100,'set-1-mock-b':100,'mock-c':100,'mock-d':100 };
  for(const [id,count] of Object.entries(expected)){
   const q=Array.from(exam.forms[id]);
   assert.ok(q.length>=count,id);
   const included=q.filter(x=>x.scored===true&&x.experimental===false);
   assert.equal(included.length,count,id);
   const counts=Object.fromEntries(areas.map(([name])=>[name,0]));
   for(const question of q){
    const match=/^(I|II|III|IV|V|VI)\.[0-9]+(?:\b|$)/.exec(question.blueprint||'');
    assert.ok(match,id+' missing blueprint category '+question.qid);
    const area=areas.find(([name])=>name===match[1]);
    assert.equal(question.sub,area[1],id+' cross-domain metadata '+question.qid);
    if(question.area!=null)assert.equal(question.area,match[1],id+' area-code inconsistency '+question.qid);
    if(question.scored===true&&!question.experimental)counts[match[1]]++;
   }
   assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),count,id);
   assert.ok(Object.values(counts).every(x=>x>0),id+' six areas must be available');
  }
 }finally{h.close();}
});

test('Quick Quiz and Focused Quiz display six category counts from the selected source bank',async()=>{
 const h=await harness(),{d,w}=h;
 try{
  click(d,'[data-nppe-mode="quick"]');
  assert.equal(d.querySelector('[data-nppe-quiz-kind="quick"]').dataset.nppeBank,'set-1-diagnostic');
  assert.equal(d.querySelectorAll('[data-nppe-area-kind="quick"]').length,7);
  assert.equal(d.querySelector('[data-nppe-area-kind="quick"][data-nppe-area="all"] .nppe-area-count').textContent,'50 available');
  const count = w.__TB.EXAMS.nppe.forms['set-1-diagnostic'].filter(q=>q.sub==='nppe-law').length;
  assert.equal(d.querySelector('[data-nppe-area-kind="quick"][data-nppe-area="nppe-law"] .nppe-area-count').textContent,count+' available');
  click(d,'[data-nppe-area-kind="quick"][data-nppe-area="nppe-law"]');
  assert.equal(d.activeElement.dataset.nppeArea,'nppe-law','area choice retains focus after rendering');
  assert.equal(d.querySelector('[data-nppe-area-kind="quick"][data-nppe-area="nppe-law"]').getAttribute('aria-pressed'),'true');
  click(d,'[data-nppe-mode="focus"]');
  assert.equal(d.querySelectorAll('[data-nppe-area-kind="focus"]').length,6);
  assert.equal(d.querySelector('[data-nppe-area-kind="focus"][data-nppe-area="all"]'),null,'focused requires one area');
  assert.equal(d.querySelectorAll('[data-nppe-area-kind="focus"][aria-pressed="true"]').length,1);
  click(d,'[data-nppe-count-kind="focus"][data-nppe-count="5"]');
  assert.equal(d.querySelector('[data-nppe-count-kind="focus"][data-nppe-count="5"]').getAttribute('aria-pressed'),'true');
  const tab=d.querySelector('[data-nppe-mode="focus"]');
  tab.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
  assert.equal(d.querySelector('[data-nppe-mode="full"]').getAttribute('aria-selected'),'true');
  assert.equal(d.activeElement.dataset.nppeMode,'full');
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

test('Grok Mock C Quick Quiz draws only IV Law from scored source questions and grades 10/10',async()=>{
 const h=await harness(),{w,d}=h;
 try{
  click(d,'[data-nppe-owner="2"]');
  click(d,'[data-nppe-mode="quick"]');
  click(d,'[data-nppe-area-kind="quick"][data-nppe-area="nppe-law"]');
  click(d,'[data-nppe-count-kind="quick"][data-nppe-count="10"]');
  click(d,'[data-timing-kind="quick"][data-timed="1"]');
  const status=d.querySelector('[data-nppe-quiz-kind="quick"] .nppe-short-summary').textContent;
  assert.match(status,/10 questions/);
  assert.match(status,/IV Law/);
  click(d,'[data-mode="quick"]');
  const snapshot=w.__TB.getFeedbackSnapshot();
  assert.equal(snapshot.setId,'mock-c');
  assert.equal(snapshot.records.length,10);
  assert.equal(new Set(snapshot.records.map(r=>r.question.qid)).size,10);
  assert.ok(snapshot.records.every(r=>r.question.form==='mock-c'&&r.question.authorSet===2&&r.question.scored===true&&r.question.experimental===false&&r.question.blueprint.startsWith('IV.')));
  assert.match(d.querySelector('#tb-timer').textContent,/^[0-9:]+$/);
  assert.equal(d.querySelector('[data-reveal]'),null);
  assert.equal(w.__TB.revealCurrentAnswer(),false);
  assert.equal(d.querySelector('#tb-feedback-loop'),null);
  assert.match(d.querySelector('.tb-quiz').textContent,/Law/);
  for(const [i,r] of snapshot.records.entries()){
   click(d,'[data-goto="'+i+'"]');
   click(d,'[data-opt="'+r.question.answer+'"]');
  }
  click(d,'[data-submit]');await wait();
  const result=w.__TB.getFeedbackSnapshot();
  assert.equal(result.grading.total,10);
  assert.equal(result.grading.correct,10);
  assert.match(d.querySelector('[data-score-result]').textContent,/100% \(10\/10\)/);
  assert.match(d.querySelector('#tb-overview').textContent,/simulated unscored mock items are excluded/i);
  assert.match(d.querySelector('#tb-overview h2').textContent,/Mock C · Quick Quiz · IV Law/);
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

test('ChatGPT Mock B Focused Quiz draws five III Professional Practice items without borrowing banks',async()=>{
 const h=await harness(),{w,d}=h;
 try{
  click(d,'[data-set="set-1-mock-b"]');
  click(d,'[data-nppe-mode="focus"]');
  click(d,'[data-nppe-area-kind="focus"][data-nppe-area="nppe-practice"]');
  click(d,'[data-nppe-count-kind="focus"][data-nppe-count="5"]');
  assert.match(d.querySelector('[data-nppe-quiz-kind="focus"] .nppe-short-summary').textContent,/III Professional Practice/);
  click(d,'[data-mode="focus"]');
  const s=w.__TB.getFeedbackSnapshot();
  assert.equal(s.setId,'set-1-mock-b');
  assert.equal(s.records.length,5);
  assert.ok(s.records.every(r=>r.question.form==='set-1-mock-b'&&r.question.authorSet===1&&r.question.scored&&!r.question.experimental&&r.question.blueprint.startsWith('III.')));
  assert.equal(d.querySelector('.tb-timer').textContent,'Untimed');
  assert.equal(d.querySelector('[data-reveal]'),null,'mock questions cannot reveal answer before submission');
  assert.equal(w.__TB.revealCurrentAnswer(),false);
  click(d,'[data-goto="'+(s.records.length-1)+'"]');
  click(d,'[data-submit]');await wait();
  const result=w.__TB.getFeedbackSnapshot();
  assert.equal(result.grading.total,5);
  assert.equal(result.grading.unanswered,5);
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

test('NPPE short quizzes fail closed when source blueprint metadata is inconsistent',async()=>{
 const h=await harness(),{w,d}=h;
 try{
  click(d,'[data-nppe-owner="3"]');
  const bank=w.__TB.EXAMS.nppe.forms['mock-d'];
  bank[0].blueprint='invalid';
  click(d,'[data-nppe-mode="quick"]');
  const start=d.querySelector('[data-mode="quick"]');
  assert.ok(start);
  assert.equal(start.disabled,true,'invalid blueprint disables quick practice');
  start.dispatchEvent(new w.Event('click'));
  assert.equal(w.__TB.getFeedbackSnapshot(),null,'must not borrow a valid question from another bank');
  assert.equal(d.querySelector('.tb-quiz'),null);
  assert.deepEqual(h.errors,[]);
 }finally{h.close();}
});

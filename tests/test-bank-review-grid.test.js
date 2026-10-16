// Current stateless review-grid regression; no retired durable-ledger dependency.
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
function start(w, exam, mode) {
  w.document.querySelector(`.tb-tile[data-exam="${exam}"]`).click();
  const actual = mode === 'focused' ? 'focus' : mode;
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
  assert.ok(data.records.length >= 2, 'at least two questions for correction coverage, including a small released batch');
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
function score(w) { return w.document.querySelector('[data-score-result], .tb-reshead').textContent; }
test('review grid and answer statuses are absent before submission', async () => {
 const h=await harness(),{w}=h;
 try {
  start(w,'cssbb','quick');
  assert.equal(w.document.querySelector('#tb-review-grid'),null);
  assert.equal(w.document.querySelector('.tb-review-navcell'),null);
  assert.equal(w.document.querySelector('.tb-review-option.is-correct'),null);
  assert.deepEqual(h.errors,[]);
 } finally { await h.close(); }
});
async function mixedResult(w) {
 const data=start(w,'cssbb','quick');
 assert.ok(data.records.length>=3,'correct, incorrect and unanswered records are required');
 select(w,0,data.records[0].question.answer);
 select(w,1,(data.records[1].question.answer+1)%data.records[1].question.options.length);
 await finish(w);
 click(w,'[data-open-review="all"]');
 return data;
}
test('submitted grid preserves all three status classes, glyphs and accessible labels', async () => {
 const h=await harness(),{w}=h;
 try {
  const data=await mixedResult(w);
  const cells=[...w.document.querySelectorAll('.tb-review-navcell')];
  assert.equal(cells.length,data.records.length);
  const glyph={correct:'\u2713',incorrect:'\u2717',unanswered:'\u25cb'};
  cells.forEach((cell,i)=>{
   const status=i===0?'correct':i===1?'incorrect':'unanswered';
   assert.deepEqual(Object.keys(glyph).filter(s=>cell.classList.contains(s)),[status]);
   assert.equal(cell.querySelector('[aria-hidden="true"]').textContent,glyph[status]);
   assert.match(cell.getAttribute('aria-label'),new RegExp('Question '+(i+1)+',','i'));
   assert.match(cell.getAttribute('aria-label'),new RegExp(status,'i'));
   assert.equal(cell.tagName,'BUTTON');
  });
  assert.deepEqual(h.errors,[]);
 } finally { await h.close(); }
});
test('review grid jump shows one question and retains status beneath the current marker', async () => {
 const h=await harness(),{w}=h;
 try {
  const data=await mixedResult(w),originalScore=score(w);
  click(w,'[data-review-goto="1"]');
  const cards=w.document.querySelectorAll('.tb-review-card');
  assert.equal(cards.length,1);
  assert.equal(cards[0].querySelector('.tb-review-card-head strong').textContent,'Question 2');
  assert.ok(cards[0].textContent.includes(data.records[1].question.stem));
  assert.equal(cards[0].querySelectorAll('.tb-review-option.is-correct').length,1);
  assert.equal(cards[0].querySelectorAll('.tb-review-option.is-wrong').length,1);
  const cur=w.document.querySelector('.tb-review-navcell.cur');
  assert.equal(cur.dataset.reviewGoto,'1');
  assert.equal(cur.getAttribute('aria-current'),'true');
  assert.ok(cur.classList.contains('incorrect'));
  assert.equal(w.document.querySelectorAll('.tb-review-navcell[aria-current="true"]').length,1);
  assert.equal(score(w),originalScore);
  assert.deepEqual(h.errors,[]);
 } finally { await h.close(); }
});

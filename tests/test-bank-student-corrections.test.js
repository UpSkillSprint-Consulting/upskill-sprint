'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM, VirtualConsole} = require('jsdom');
const source = fs.readFileSync('test-bank-current-attempt-review.js', 'utf8');
const tick = w => new Promise(resolve => w.setTimeout(resolve, 30));
async function fixture(question, selected = null) {
  const errors=[];
  const console=new VirtualConsole();console.on('jsdomError', e=>errors.push(e.message));
  const dom=new JSDOM('<!doctype html><html><head></head><body><header class="site"></header><button class="tb-tile active" data-exam="audit">Exam</button><main id="test-bank-app"><div id="tb-overview"><div class="tb-reshead">Original score</div></div></main></body></html>', {url:'https://upskillsprint.com/test-bank',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:console});
  const w=dom.window;
  w.requestAnimationFrame=cb=>w.setTimeout(cb,0);w.cancelAnimationFrame=id=>w.clearTimeout(id);
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.document.querySelector('header.site').getBoundingClientRect=()=>({height:64});
  const original={examId:'audit',sessionId:'fixture',completed:true,records:[{question,selected,index:0,flagged:false}]};
  w.__TB={EXAMS:{audit:{bok:[]}},getFeedbackSnapshot:()=>original,renderQuestionContent:q=>'<div class="tb-review-stem">'+q.stem+'</div><input type="range" min="6" max="12" value="8"><details class="visual-details"><summary>Plotted values</summary><p>Evidence</p></details>'};
  w.eval(source);await tick(w);
  return {w,errors,original,close(){w.__TBCurrentAttemptReview.destroy();w.close();}};
}
const click=(w,selector)=>{const node=w.document.querySelector(selector);assert.ok(node,selector);node.click();};
test('authored optionRationales and distractors are resolved per option without fabrication',async()=>{
  const h=await fixture({stem:'Choose an option',options:['A','B','C'],answer:2,why:'Authored explanation',optionRationales:{0:'<b>Modern rationale</b>'},distractors:{0:'Do not show this older duplicate',1:'Legacy fallback'}});
  try{
    click(h.w,'[data-open-review="all"]');const rationale=h.w.document.querySelector('.tb-review-rationales');
    assert.ok(rationale);assert.match(rationale.textContent,/Modern rationale/);assert.match(rationale.textContent,/Legacy fallback/);
    assert.doesNotMatch(rationale.textContent,/older duplicate/);assert.equal(rationale.querySelectorAll('p').length,2);
    assert.ok(rationale.querySelector('b'));assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});
test('selecting and checking a correction preserves visual nodes, values, disclosures and original answers',async()=>{
  const h=await fixture({stem:'Use the visual',options:['A','B','C'],answer:2,why:'Explanation'});
  try{
    const original=JSON.stringify(h.original);click(h.w,'[data-retry-missed]');
    const input=h.w.document.querySelector('#tb-retry-panel input');input.value='7';
    const details=h.w.document.querySelector('#tb-retry-panel .visual-details');details.open=true;
    const choice=h.w.document.querySelector('[data-retry-opt="2"]');choice.focus();choice.click();
    assert.equal(h.w.document.activeElement,choice);assert.equal(choice.getAttribute('aria-pressed'),'true');
    assert.equal(h.w.document.querySelector('#tb-retry-panel input'),input);assert.equal(input.value,'7');assert.equal(details.open,true);
    click(h.w,'[data-retry-check]');
    assert.equal(h.w.document.querySelector('#tb-retry-panel input'),input);assert.equal(input.value,'7');assert.equal(details.open,true);
    assert.equal(h.w.document.querySelector('[data-retry-opt="2"]').disabled,true);
    assert.equal(h.w.document.activeElement,h.w.document.querySelector('.tb-retry-feedback'));
    assert.equal(h.w.document.activeElement.style.scrollMarginTop,'84px');
    assert.equal(JSON.stringify(h.original),original);assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});
test('a malformed answer key is review-required, not an unanswered learner mistake',async()=>{
  const h=await fixture({stem:'Defensive fixture only',options:['A','B'],answer:8,why:''});
  try{
    click(h.w,'[data-open-review="all"]');
    assert.equal(h.w.document.querySelector('.tb-review-card').dataset.reviewStatus,'unavailable');
    assert.match(h.w.document.querySelector('[data-review-tab="unavailable"]').textContent,/1/);
    assert.match(h.w.document.querySelector('[data-review-tab="unanswered"]').textContent,/0/);
    assert.match(h.w.document.querySelector('[data-review-tab="missed"]').textContent,/0/);
    assert.equal(h.w.document.querySelector('[data-retry-missed]').disabled,true);assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

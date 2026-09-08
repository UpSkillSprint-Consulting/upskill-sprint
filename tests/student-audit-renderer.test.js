'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../test-bank-mbb-set3.js'), 'utf8'), context);
for (let batch = 1; batch <= 7; batch++) {
  test(`MBB batch ${batch}: deferred navigation must not steal the learner's next focused control`, () => {
    const id = context.window.MBB_SET3[(batch - 1) * 25].qid;
    const dom = new JSDOM(`<div id="host"><div class="tb-quiz" data-question-id="${id}"><div class="tb-stem" tabindex="-1">Question</div><button data-opt="0">Answer</button><button data-flag>Flag</button></div></div>`, {runScripts:'outside-only'});
    try {
      const w = dom.window, callbacks = [];
      w.requestAnimationFrame = f => callbacks.push(f);
      let scrolls = 0;
      w.HTMLElement.prototype.scrollIntoView = () => scrolls++;
      w.eval(fs.readFileSync(path.join(__dirname, `../test-bank-mbb-set3-batch${batch}-ui.js`), 'utf8'));
      w[`__MBBSet3Batch${batch}UI`].wire(w.document.getElementById('host'));
      assert.equal(callbacks.length, 1);
      const option = w.document.querySelector('[data-opt]');
      option.focus();
      callbacks[0]();
      assert.equal(w.document.activeElement, option, 'Deferred navigation stole answer focus');
      assert.equal(scrolls, 0, 'Deferred navigation moved the active pointer target');
      option.blur(); callbacks[0]();
      assert.equal(w.document.activeElement,w.document.querySelector('.tb-stem'),'Initial navigation without learner interaction still focuses the question');
      assert.equal(scrolls,1);
    } finally { dom.window.close(); }
  });
}

const {auditPlatform} = require('../scripts/lib/student-audit-platform.cjs');
test('headless Linux WebKit uses bounded CPU rasterization without altering app or Chromium settings', () => {
  const env = {AUDIT_ENGINE:'webkit', AUDIT_SOURCE:'fixture-sha', PRESERVED:'yes', WEBKIT_SKIA_ENABLE_CPU_RENDERING:'0'};
  const before = {...env}, r = auditPlatform(env, 'linux');
  assert.deepEqual(env, before, 'Input environment mutated');
  assert.equal(r.environment.WEBKIT_SKIA_ENABLE_CPU_RENDERING, '1');
  assert.equal(r.environment.WEBKIT_SKIA_CPU_PAINTING_THREADS, '1');
  assert.equal(r.environment.AUDIT_SOURCE, 'fixture-sha');
  assert.equal(r.environment.PRESERVED, 'yes');
  assert.deepEqual(r.policy, {version:1,platform:'linux',engine:'webkit',rasterizer:'webkit-skia-cpu',paintingThreads:1,scope:'audit-process-only'});
  for (const [engine,platform] of [['chromium','linux'],['webkit','darwin']]) {
    const r = auditPlatform({AUDIT_ENGINE:engine},platform);
    assert.deepEqual(r.environment,{AUDIT_ENGINE:engine});
    assert.equal(r.policy.rasterizer,'browser-default');
  }
  assert.equal(auditPlatform({},'linux').policy.rasterizer,'webkit-skia-cpu');
});

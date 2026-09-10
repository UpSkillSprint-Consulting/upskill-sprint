'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const ROOT=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(ROOT,'test-bank-ux-accessibility.js'),'utf8');
const analytics=fs.readFileSync(path.join(ROOT,'test-bank-analytics-dashboard.js'),'utf8');
const edge=fs.readFileSync(path.join(ROOT,'netlify/edge-functions/test-bank-set-controls.js'),'utf8');
const browserRunner=fs.readFileSync(path.join(ROOT,'scripts/exam-reliability/run-segment17-browser.cjs'),'utf8');
function settle(w,ms=20){return new Promise(r=>w.setTimeout(r,ms));}
function fixture(){
  const dom=new JSDOM(`<!doctype html><html lang="en"><head><style>:root{--muted:#667085}</style></head><body><button data-open-analytics>Full analytics</button><div id="tb-overview"><div class="tb-quiz" data-question-id="cssbb:q1"><h3 class="tb-stem">Question text</h3><div class="tb-navcell" data-goto="0">1</div><button data-opt="0">A. Choice</button></div></div><section id="tb-analytics-panel"><div class="tb-an-head"><h3>Study analytics</h3><button data-close-analytics>Close</button></div><div class="tb-an-tabs"><button data-analytics-tab="readiness" aria-selected="true">Readiness</button><button data-analytics-tab="domains" aria-selected="false">Domains</button><button data-analytics-tab="trend" aria-selected="false">Trend</button></div><div class="tb-an-body" data-analytics-body><div class="tb-an-ring"><strong>34%</strong><span>readiness</span></div><div class="tb-an-domain-row"><div class="tb-an-domain-head">Measure 55%</div><div class="tb-an-bar-track"><div class="tb-an-bar-fill"></div></div></div><span class="tb-an-heat-cell" title="September 9: 4 answers"></span></div></section><footer class="site"><p id="fixture-footer" style="color:var(--muted)">Footer text</p></footer></body></html>`,{url:'https://upskillsprint.com/test-bank',runScripts:'dangerously',pretendToBeVisual:true});
  dom.window.eval(source);return dom;
}
function cleanup(dom){const api=dom.window.__TBUXAccessibility;if(api&&typeof api.destroy==='function')api.destroy();dom.window.close();}

test('Segment 17 accessibility layer is loaded after analytics and Segment 16 allocation',()=>{
  const allocation=edge.indexOf("scriptTag(NEW_ONLY_ALLOCATION_SOURCE)");
  const analyticsIndex=edge.indexOf('/test-bank-analytics-dashboard.js');
  const ux=edge.indexOf('scriptTag(UX_ACCESSIBILITY_SOURCE)');
  assert.ok(allocation>=0&&analyticsIndex>allocation&&ux>analyticsIndex);
});

test('analytics uses one 0–100 scale for readiness and blueprint weight',()=>{
  assert.match(analytics,/item\.weightPct \/ 100/);
  assert.match(analytics,/masteryValue\(item\.domainReadiness\) \/ 100/);
  assert.doesNotMatch(analytics,/weightPct\s*\/\s*max/i);
});

test('dynamic analytics exposes tablist relationships, roving focus, progress values and chart labels',async t=>{
  const dom=fixture();t.after(()=>cleanup(dom));await settle(dom.window);
  const d=dom.window.document,panel=d.getElementById('tb-analytics-panel'),tabs=[...panel.querySelectorAll('[data-analytics-tab]')],body=panel.querySelector('[data-analytics-body]');
  assert.equal(panel.getAttribute('role'),'region');assert.ok(panel.getAttribute('aria-labelledby'));
  assert.equal(tabs[0].getAttribute('role'),'tab');assert.equal(tabs[0].tabIndex,0);assert.equal(tabs[1].tabIndex,-1);
  assert.equal(tabs[0].getAttribute('aria-controls'),body.id);assert.equal(body.getAttribute('aria-labelledby'),tabs[0].id);
  const progress=panel.querySelector('.tb-an-bar-track');assert.equal(progress.getAttribute('role'),'progressbar');assert.equal(progress.getAttribute('aria-valuenow'),'55');
  assert.match(panel.querySelector('.tb-an-ring').getAttribute('aria-label'),/34%/);
  assert.match(panel.querySelector('.tb-an-heat-cell').getAttribute('aria-label'),/September 9/);
});

test('analytics tabs support Arrow/Home/End keyboard navigation without inventing a second state model',async t=>{
  const dom=fixture();t.after(()=>cleanup(dom));await settle(dom.window);const w=dom.window,tabs=[...w.document.querySelectorAll('[data-analytics-tab]')];
  let clicked='';tabs.forEach(tab=>tab.addEventListener('click',()=>clicked=tab.dataset.analyticsTab));
  tabs[0].focus();tabs[0].dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));
  assert.equal(w.document.activeElement,tabs[1]);assert.equal(clicked,'domains');
  tabs[1].dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true,cancelable:true}));assert.equal(w.document.activeElement,tabs[2]);assert.equal(clicked,'trend');
  tabs[2].dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true,cancelable:true}));assert.equal(w.document.activeElement,tabs[0]);assert.equal(clicked,'readiness');
});

test('non-native quiz navigation gets keyboard activation while native choices stay native',async t=>{
  const dom=fixture();t.after(()=>cleanup(dom));await settle(dom.window);const w=dom.window,d=w.document,nav=d.querySelector('.tb-navcell'),choice=d.querySelector('[data-opt]');
  let clicks=0;nav.addEventListener('click',()=>clicks++);assert.equal(nav.getAttribute('role'),'button');assert.equal(nav.tabIndex,0);
  nav.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert.equal(clicks,1);
  assert.equal(choice.tagName,'BUTTON');assert.equal(choice.getAttribute('role'),null);assert.match(choice.getAttribute('aria-label'),/Choice/);
});

test('critical New-only, sync, handoff and timing conditions have separate polite/assertive live regions',async t=>{
  const dom=fixture();t.after(()=>cleanup(dom));await settle(dom.window);const w=dom.window,d=w.document;
  d.dispatchEvent(new w.CustomEvent('tb:new-only-allocation',{detail:{state:'blocked',reason:'pool-exhausted'}}));await settle(w);assert.match(d.getElementById('tb-a11y-alert').textContent,/could not start/i);
  d.dispatchEvent(new w.CustomEvent('tb:learning-sync-status',{detail:{phase:'offline'}}));await settle(w);assert.match(d.getElementById('tb-a11y-status').textContent,/Offline/i);
  d.dispatchEvent(new w.CustomEvent('tb:session-handoff-error',{detail:{}}));await settle(w);assert.match(d.getElementById('tb-a11y-alert').textContent,/transfer needs attention/i);
  d.dispatchEvent(new w.CustomEvent('tb:timing-recovery-required',{detail:{}}));await settle(w);assert.match(d.getElementById('tb-a11y-alert').textContent,/timing must be verified/i);
});

test('footer contrast repair survives a later inline-style regression',async t=>{
  const dom=fixture();t.after(()=>cleanup(dom));await settle(dom.window);const w=dom.window,node=w.document.getElementById('fixture-footer');
  assert.equal(node.style.getPropertyValue('color'),'#cbd5e1');assert.equal(node.style.getPropertyPriority('color'),'important');
  node.style.setProperty('color','var(--muted)');await settle(w,60);
  assert.equal(node.style.getPropertyValue('color'),'#cbd5e1');assert.equal(node.style.getPropertyPriority('color'),'important');
});

test('observer cleanup cancels pending accessibility rerenders deterministically',async t=>{
  const dom=fixture();t.after(()=>cleanup(dom));await settle(dom.window);const api=dom.window.__TBUXAccessibility;assert.equal(typeof api.destroy,'function');
  dom.window.document.body.appendChild(dom.window.document.createElement('div'));api.destroy();assert.doesNotThrow(()=>dom.window.document.body.appendChild(dom.window.document.createElement('div')));
});

test('focus visibility, touch target, reduced-motion, forced-color, contrast and print safeguards are explicit',()=>{
  assert.match(source,/:focus-visible/);assert.match(source,/min-height:44px/);assert.match(source,/prefers-reduced-motion:reduce/);assert.match(source,/forced-colors:active/);assert.match(source,/footer\.site p\{color:#cbd5e1!important\}/);assert.match(source,/attributeFilter:\['hidden','aria-selected','data-question-id','class','style'\]/);assert.match(source,/@media print/);
});

test('WebKit contrast substitution remains fail-closed and independently verifies live computed styles',()=>{
  assert.match(browserRunner,/async function computedContrastAudit\(page\)/);
  assert.match(browserRunner,/const contrast=await computedContrastAudit\(page\)/);
  assert.match(browserRunner,/live computed-style WCAG AA text contrast violations/);
  assert.match(browserRunner,/engine==='webkit'\?seriousAll\.filter\(v=>v\.id==='color-contrast'\):\[\]/);
  assert.match(browserRunner,/engine==='webkit'\?seriousAll\.filter\(v=>v\.id!=='color-contrast'\):seriousAll/);
  assert.match(browserRunner,/AXE_WEBKIT_STALE_CONTRAST/);
  const liveAuditIndex=browserRunner.indexOf('const contrast=await computedContrastAudit(page)');
  const liveAuditFailIndex=browserRunner.indexOf('assert.deepEqual(contrast.offenders,[]');
  const axeFilterIndex=browserRunner.indexOf("const staleWebKitContrast=engine==='webkit'");
  assert.ok(liveAuditIndex>=0&&liveAuditFailIndex>liveAuditIndex&&axeFilterIndex>liveAuditFailIndex,'computed-style contrast gate must fail closed before WebKit axe contrast substitution');
});

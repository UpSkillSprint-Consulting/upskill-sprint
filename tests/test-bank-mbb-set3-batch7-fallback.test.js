'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
async function withPage(run){
  let html=read('test-bank.html');
  for(const file of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-set3.js'])
    html=html.replace('<script src="/'+file+'"></script>','<script>'+read(file)+'</script>');
  const errors=[],observers=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
    w.HTMLElement.prototype.scrollIntoView=function(){};
    const Native=w.MutationObserver;w.MutationObserver=class extends Native{constructor(cb){super(cb);observers.push(this);}};
  }});
  try{await new Promise(resolve=>dom.window.addEventListener('load',resolve));await run(dom.window);assert.deepEqual(errors,[]);}
  finally{observers.forEach(o=>o.disconnect());dom.window.close();}
}
test('Batch 7 numerical alternatives remain exact and accessible without the optional graphical module',()=>withPage(w=>{
  assert.equal(w.__MBBSet3Batch7UI,undefined);
  const items=w.__TB.EXAMS.mbb.sets[3].slice(150,175).filter(q=>q.chart&&q.chart.evidence);assert.equal(items.length,1);
  for(const q of items){
    const rendered=w.__TB.renderQuestionChart(q.chart),host=w.document.createElement('div');host.innerHTML=rendered;
    assert.doesNotMatch(rendered,/NaN|undefined|<svg/);assert.equal(host.querySelector('caption').textContent,q.chart.evidence.title);
    assert.equal(host.querySelectorAll('thead th[scope="col"]').length,q.chart.evidence.columns.length);
    const rows=Array.from(host.querySelectorAll('tbody tr'),r=>Array.from(r.children,c=>c.textContent));
    assert.deepEqual(rows,JSON.parse(JSON.stringify(q.chart.evidence.rows)).map(r=>r.map(String)));
    assert.ok(host.querySelector('[role="region"][tabindex="0"]'));assert.equal(host.querySelectorAll('tbody th[scope="row"]').length,rows.length);
  }
  const q=items[0],unsafe={...q.chart,evidence:{...q.chart.evidence,title:'<script>not executable</script>'}};
  assert.match(w.__TB.renderQuestionChart(unsafe),/&lt;script/);
}));
test('The normal player still uses the graphical Batch 7 visuals, not their degraded-mode tables alone',()=>withPage(w=>{
  w.eval(read('test-bank-mbb-set3-batch7-ui.js'));
  const items=w.__TB.EXAMS.mbb.sets[3].slice(150,175).filter(q=>q.chart&&q.chart.evidence);assert.equal(items.length,1);
  for(const q of items)for(const review of [false,true]){
    const rendered=w.__TB.renderQuestionContent(q,review);
    assert.match(rendered,/mbbs3b7-question/);assert.match(rendered,/<svg/);assert.doesNotMatch(rendered,/tb-chart-evidence-fallback|NaN|undefined/);
    assert.ok(rendered.includes(q.chart.evidence.title));
  }
}));

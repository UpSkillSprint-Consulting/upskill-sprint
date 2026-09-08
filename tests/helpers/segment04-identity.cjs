'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const ROOT = path.join(__dirname, '../..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const BANKS = ['test-bank-cmq-set1.js', 'test-bank-mbb-set1.js', 'test-bank-mbb-set2.js', 'test-bank-mbb-set3.js', 'test-bank-cssgb-set1.js', 'test-bank-cssgb-set2.js'];
const question = (id = 'cssbb:fixture:one', sub = 'p1') => ({qid:id,sub,stem:'Synthetic question.',options:['A','B','C','D'],answer:0,why:'Synthetic explanation.'});
function fixture(t, options = {}) {
  const dom = new JSDOM('<!doctype html><body><h1 id="tb-hero">Synthetic bank</h1></body>', {url:'https://segment04.invalid/test-bank',runScripts:'outside-only'});
  if (t) t.after(()=>dom.window.close());
  const w = dom.window, rows = [question(), question('cssbb:fixture:two', 'p2')];
  const exam = {bank:rows,sets:{1:rows},questions:165,minutes:270,pass:70,bok:[{domain:'d1',subs:[{id:'p1',w:80},{id:'p2',w:20}]}]};
  w.__TB = {questionIdentityPolicy:'explicit-v1',EXAMS:{cssbb:exam}};
  if (options.setup) options.setup(w, rows);
  w.eval(read('test-bank-question-registry.js'));
  return {dom,w,rows,exam,api:w.__TBQuestionRegistry};
}
async function live() {
  const errors=[], vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  let html=BANKS.reduce((page,file)=>page.replace('<script src="/'+file+'"></script>', '<script>'+read(file)+'</script>'),read('test-bank.html'));
  // Expose only test seams; preserve the shipped source on disk.
  const anchor=/window\.__TB=\{[^\n]*\};/;
  html=html.replace(anchor,'$&\nwindow.__TBSegment04Probe={activeBank:function(){return activeBank(EXAMS[current]);},mixedBank:function(){return mixedBank(EXAMS[current]);},set:function(value){selectedSet=value;},begin:beginSession};');
  const dom=new JSDOM(html,{url:'https://segment04.invalid/test-bank',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
  let timer;
  try {await Promise.race([new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true})),new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('Live identity fixture timeout')),15000))]);dom.window.eval(read('test-bank-question-registry.js'));return {dom,w:dom.window,errors};}
  catch(e){dom.window.close();throw e;}finally{clearTimeout(timer);}
}
module.exports={ROOT,read,fixture,question,live};

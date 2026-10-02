const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const base='assets/lessons/excel-formula-fluency/sprint/';

test('the introduction is the first desktop/mobile lesson and precedes assignments',()=>{
  const dom=new JSDOM(fs.readFileSync('lessons/power-bi-excel-sql/excel-formula-fluency.html','utf8'));
  const d=dom.window.document;
  assert.equal(d.querySelector('.toc-links a').getAttribute('href'),'#excel-introduction');
  assert.equal(d.querySelector('#mobileToc option').value,'#excel-introduction');
  assert.equal(d.querySelector('#lesson-content > section').id,'excel-introduction');
  const frame=d.querySelector('#excel-introduction-frame');
  assert.ok(fs.existsSync('.'+frame.getAttribute('src')));
  assert.match(frame.title,/interactive introduction/);
  assert.equal(d.querySelectorAll('#excel-sprint-app').length,1);
  dom.window.close();
});

test('the supplied introduction retains five modules, interactive navigation, and quiz feedback',()=>{
  const dom=new JSDOM(fs.readFileSync(base+'introduction.html','utf8'),{
    url:'https://sprint.example/introduction',runScripts:'dangerously',
    beforeParse(w){w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};}
  });
  const d=dom.window.document;
  assert.equal(d.querySelectorAll('section.mod').length,5);
  assert.equal(d.querySelectorAll('.quiz').length,5);
  d.querySelector('#stepnav [data-go="m4"]').click();
  assert.equal(d.querySelector('section.mod.on').id,'m4');
  d.querySelector('#stepnav [data-go="m1"]').click();
  d.querySelector('#q1 .opt').click();
  assert.equal(d.querySelector('#q1 .expl').hidden,false);
  assert.match(d.querySelector('#q1 .expl').textContent,/Correct|Not quite/);
  assert.ok([...d.querySelectorAll('#q1 .q:first-child .opt')].every(b=>b.disabled));
  assert.equal(dom.window.localStorage.getItem('upskillsprint.excel-sprint.v1'),null);
  dom.window.close();
});

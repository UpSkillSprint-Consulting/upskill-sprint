const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('lessons/statistics/multivariate-statistical-process-control.html','utf8');
test('saved Minitab plots retain signals and limits',()=>{for(const [id,expected] of [['saved-t',[41,51]],['saved-gv',[46,51]],['combined-t',[41,51]],['combined-v',[46,51]],['saved-mewma',Array.from({length:16},(_,i)=>i+45)]]){const tag=html.match(new RegExp('<svg id="'+id+'"[^>]*>'))[0];const data=tag.match(/data-series="([^"]+)"/)[1].split(',').map(Number);const limit=Number(tag.match(/data-ucl="([^"]+)"/)[1]);assert.equal(data.length,60);assert.deepEqual(data.flatMap((v,i)=>v>limit?[i+1]:[]),expected);}});
test('lesson includes accessible interactive controls and quiz',()=>{assert.match(html,/id="ms-r"/);assert.match(html,/id="ms-lambda"/);assert.match(html,/aria-live="polite"/);assert.match(html,/upskill-quiz-result/);assert.equal((html.match(/class="quiz-question"/g)||[]).length,12);assert.match(html,/<details class="ms-impl"/);});


const {JSDOM}=require('jsdom');
const slug='multivariate-statistical-process-control';
const assetDir='assets/lessons/'+slug+'/';
const guide=fs.readFileSync('docs/LESSON_CREATION_GUIDE.md','utf8');
const catalog=fs.readFileSync('chi-square-lesson-library.js','utf8');
const sql=fs.readFileSync('supabase/public-mspc-access.sql','utf8');
const block=(section,lang)=>guide.slice(guide.indexOf(section)).match(new RegExp('\x60\x60\x60'+lang+'\\n([\\s\\S]*?)\\n\x60\x60\x60'))[1];
const doc=()=>new JSDOM(html).window.document;
test('metadata, canonical chrome, catalog, access and related links',()=>{
 assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
 const meta=JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
 assert.equal(meta.slug,slug);assert.equal(meta.access_level,'public');assert.ok(meta.search_keywords.length>=5);
 const d=doc();assert.equal(d.querySelectorAll('main#lesson-content h1').length,1);assert.equal(d.querySelectorAll('main').length,1);
 assert.ok(html.includes(block('### 4.1 Header','html')));assert.ok(html.includes(block('### 4.2 Footer','html')));
 assert.ok(catalog.includes("path: '/lessons/statistics/"+slug+"'"));assert.ok(sql.includes("lesson:/lessons/statistics/"+slug));
 for(const a of d.querySelectorAll('#related-lessons a'))assert.ok(fs.existsSync(a.getAttribute('href').slice(1)+'.html'));
 for(const a of d.querySelectorAll('main a[href^="/assets/"],main img[src^="/assets/"]'))assert.ok(fs.existsSync((a.getAttribute('href')||a.getAttribute('src')).slice(1)));
});
test('all 180 plotted values independently follow the original paired measurements',()=>{
 const data=name=>fs.readFileSync(assetDir+name,'utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split(',').map(Number));
 const A=data('T2_GV_Practice.csv'),B=data('MEWMA_Practice.csv'); const d=doc();
 const calc=(rows)=>{assert.equal(rows.length,600);let zx=0,zy=0;return Array.from({length:60},(_,i)=>{
 const g=rows.slice(i*10,i*10+10);g.forEach((r,j)=>{assert.equal(r[0],i+1);assert.equal(r[1],j+1);});
 const x=g.reduce((s,r)=>s+r[2],0)/10,y=g.reduce((s,r)=>s+r[3],0)/10; const dx=x-500,dy=y-600;
 let v=0,c=0,w=0;g.forEach(r=>{v+=(r[2]-x)**2/9;c+=(r[2]-x)*(r[3]-y)/9;w+=(r[3]-y)**2/9;});
 const q=(a,b)=>(100*a*a-160*a*b+100*b*b)/3600;
 zx=.2*dx+.8*zx;zy=.2*dy+.8*zy;
 return {t2:10*q(dx,dy),gv:v*w-c*c,mewma:10*q(zx,zy)/(.2/1.8*(1-.8**(2*(i+1))))};});};
 const a=calc(A),b=calc(B);
 for(const [id,rows,key] of [['saved-t',a,'t2'],['saved-gv',a,'gv'],['combined-t',a,'t2'],['combined-v',a,'gv'],['saved-mewma',b,'mewma']]){
 const saved=d.getElementById(id).dataset.series.split(',').map(Number);assert.equal(saved.length,60);saved.forEach((v,i)=>assert.ok(Math.abs(v-rows[i][key])<.000051,id+' subgroup '+(i+1)));}
});
test('four full-size plots and four specific setup panels are collapsed and accessible',()=>{
 const d=doc();assert.equal(d.querySelectorAll('.ms-full-output').length,4);
 for(const id of ['setup-t2','setup-gv','setup-combined','setup-mewma']){const e=d.getElementById(id);assert.ok(e);assert.equal(e.open,false);assert.match(e.textContent,/Columns to Matrix/);}
 for(const e of d.querySelectorAll('.ms-full-output')){assert.equal(e.open,false);assert.ok(e.querySelector('summary'));assert.ok(e.querySelector('img').alt);}
 const panel=d.querySelector('.ms-impl');assert.equal(panel.open,false);for(const part of ['Excel Functions','Excel Use Cases','Minitab Navigation','Exam Tips'])assert.ok(panel.textContent.includes(part));
});
test('quiz dispatches score and live labs respond and reset',()=>{
 const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://upskillsprint.com/lessons/statistics/'+slug});const w=dom.window,d=w.document;
 for(const script of d.querySelectorAll('script:not([src])'))if(!script.type)w.eval(script.textContent);
 let score;d.addEventListener('upskill-quiz-result',e=>score=e.detail.score);
 d.getElementById('quiz-submit').click();assert.equal(score,0);
 for(const q of d.querySelectorAll('.quiz-question'))q.querySelector('input[value="'+q.dataset.answer+'"]').checked=true;
 d.getElementById('quiz-submit').click();assert.equal(score,12);
 const r=d.getElementById('ms-r'),live=d.getElementById('ms-live');r.value='0';r.dispatchEvent(new w.Event('input'));assert.match(live.textContent,/4\.50/);d.getElementById('ms-reset').click();assert.match(live.textContent,/22\.50/);
 const l=d.getElementById('ms-lambda');l.value='1';l.dispatchEvent(new w.Event('input'));assert.match(d.getElementById('ms-memory-live').textContent,/100%/);d.getElementById('ms-memory-reset').click();assert.equal(Number(l.value),.2);
 w.close();
});

test('additional visual labs render and respond to controls',()=>{const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://upskillsprint.com/lessons/statistics/'+slug});const w=dom.window,d=w.document;for(const sc of d.querySelectorAll('script:not([src])'))if(!sc.type)w.eval(sc.textContent);assert.equal(d.querySelectorAll('.ms-visual-grid .ms-data-dot').length,40);assert.equal(d.querySelectorAll('.ms-matrix-diag').length,2);const s=d.getElementById('ms-gv-sd');s.value='20';s.dispatchEvent(new w.Event('input'));assert.match(d.getElementById('ms-gv-live').textContent,/57600\.00/);d.getElementById('ms-gv-reset').click();assert.match(d.getElementById('ms-gv-live').textContent,/3600\.00/);const goal=d.getElementById('ms-goal');goal.value='drift';goal.dispatchEvent(new w.Event('change'));assert.equal(d.getElementById('ms-choice-name').textContent,'MEWMA');assert.equal(d.querySelectorAll('.ms-menu-items a').length,4);w.close();});

test('student audit: calculation exercises, real MEWMA statistic lab and assignment',()=>{const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://upskillsprint.com/lessons/statistics/'+slug});const w=dom.window,d=w.document;for(const sc of d.querySelectorAll('script:not([src])'))if(!sc.type)w.eval(sc.textContent);assert.equal(d.querySelectorAll('.quiz-question').length,12);assert.ok(d.getElementById('why-mspc'));assert.ok(d.getElementById('student-assignment'));const s=d.getElementById('audit-shift'),l=d.getElementById('audit-weight');s.value='0';s.dispatchEvent(new w.Event('input'));assert.match(d.getElementById('audit-mewma-live').textContent,/MEWMA = 0\.000/);s.value='2';l.value='1';l.dispatchEvent(new w.Event('input'));assert.match(d.getElementById('audit-mewma-live').textContent,/T² = 4\.000; MEWMA = 4\.000/);d.getElementById('audit-mewma-reset').click();assert.equal(Number(l.value),.2);w.close();});

test('first-time Minitab walkthrough includes exact worksheet and matrix checkpoints for every chart',()=>{const d=doc();assert.ok(d.getElementById('minitab-first-start'));assert.ok(d.getElementById('minitab-troubleshooting'));for(const id of ['setup-t2','setup-gv','setup-combined','setup-mewma']){const e=d.getElementById(id);assert.equal(e.open,false);assert.match(e.textContent,/C5 C6/);assert.match(e.textContent,/1:2/);assert.match(e.textContent,/Display Data/);assert.match(e.textContent,/C3 C4/);assert.match(e.textContent,/C1/);assert.ok(e.querySelector('a[download]'));assert.ok(e.querySelector('a[href="#minitab-troubleshooting"]'));}assert.match(d.getElementById('setup-mewma').textContent,/ARL\s*200/);assert.match(d.getElementById('setup-mewma').textContent,/0\.20/);assert.doesNotMatch(d.getElementById('setup-gv').querySelector('.ms-dialog:last-of-type')?.textContent||'',/500 600/);});

test('interactive chart sizing stays scoped to the four compact live plots',()=>{
 const d=doc();
 const plots=[...d.querySelectorAll('.ms-lab > svg.ms-lab-plot')];
 assert.equal(plots.length,4);
 for(const kind of ['correlation','dispersion','memory','joint-shift'])assert.equal(d.querySelectorAll('.ms-lab-plot-'+kind).length,1);
 assert.equal(d.querySelectorAll('.ms-chart-card svg.ms-lab-plot').length,0);
 assert.match(html,/#lesson-content \.ms-lab > svg\.ms-lab-plot\s*\{[^}]*max-width:\s*420px/);
 assert.match(html,/\.ms-lab-plot-dispersion\s*\{[^}]*max-width:\s*360px/);
});

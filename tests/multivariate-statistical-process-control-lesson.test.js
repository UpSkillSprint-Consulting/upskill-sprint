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

test('first-time Minitab walkthrough includes exact worksheet and matrix checkpoints for every chart',()=>{const d=doc();assert.ok(d.getElementById('minitab-first-start'));assert.ok(d.getElementById('minitab-troubleshooting'));const stepB=d.getElementById('minitab-step-b').closest('section');assert.match(stepB.textContent,/C5 C6/);assert.match(stepB.textContent,/1:2/);assert.match(stepB.textContent,/Columns to Matrix/);assert.equal((html.match(/id="minitab-step-b1"/g)||[]).length,1);for(const id of ['setup-t2','setup-gv','setup-combined','setup-mewma']){const e=d.getElementById(id);assert.equal(e.open,false);assert.ok(e.querySelector('a[href="#minitab-step-b"]'));assert.match(e.textContent,/Columns to Matrix/);assert.match(e.textContent,/Display Data/);assert.match(e.textContent,/C3 C4/);assert.match(e.textContent,/C1/);assert.ok(e.querySelector('a[download]'));assert.ok(e.querySelector('a[href="#minitab-troubleshooting"]'));}assert.match(d.getElementById('setup-mewma').textContent,/ARL\s*200/);assert.match(d.getElementById('setup-mewma').textContent,/0\.20/);assert.doesNotMatch(d.getElementById('setup-gv').querySelector('.ms-dialog:last-of-type')?.textContent||'',/500 600/);});

test('interactive chart sizing stays scoped to the four compact live plots',()=>{
 const d=doc();
 const plots=[...d.querySelectorAll('.ms-lab > svg.ms-lab-plot')];
 assert.equal(plots.length,4);
 for(const kind of ['correlation','dispersion','memory','joint-shift'])assert.equal(d.querySelectorAll('.ms-lab-plot-'+kind).length,1);
 assert.equal(d.querySelectorAll('.ms-chart-card svg.ms-lab-plot').length,0);
 assert.match(html,/#lesson-content \.ms-lab > svg\.ms-lab-plot\s*\{[^}]*max-width:\s*420px/);
 assert.match(html,/\.ms-lab-plot-dispersion\s*\{[^}]*max-width:\s*360px/);
});

 test('specimen comparison panels retain all points inside common plotting bounds',()=>{const d=doc();for(const id of [40,41,46,51]){const svg=d.querySelector('svg[aria-labelledby="specimens-'+id+'-title specimens-'+id+'-desc"]');assert.equal(svg.getAttribute('viewBox'),'0 0 340 250');const dots=[...svg.querySelectorAll('circle.ms-data-dot')];assert.equal(dots.length,10);for(const dot of dots){const x=+dot.getAttribute('cx'),y=+dot.getAttribute('cy'),r=+dot.getAttribute('r');assert.ok(x-r>=43&&x+r<=297&&y-r>=12&&y+r<=228);}}});

test('correlation experiment caps the entire panel, including slider and feedback',()=>{const d=doc();const panel=d.querySelector('.ms-correlation-lab');assert.ok(panel);assert.ok(panel.contains(d.getElementById('ms-r')));assert.ok(panel.contains(d.getElementById('ms-live')));assert.ok(panel.contains(d.getElementById('ms-reset')));assert.match(html,/#lesson-content \.ms-correlation-lab\s*\{[^}]*max-width:\s*560px/);});

test('dispersion experiment caps the entire panel, including both sliders and feedback',()=>{const d=doc();const panel=d.getElementById('ms-gv-lab');assert.ok(panel);for(const id of ['ms-gv-sd','ms-gv-r','ms-gv-live','ms-gv-reset'])assert.ok(panel.contains(d.getElementById(id)));assert.match(html,/#lesson-content #ms-gv-lab\s*\{[^}]*max-width:\s*560px/);});

test('A16 visual containers have content-appropriate width caps and matrix remains readable',()=>{
 const d=doc();const panel=d.querySelector('.ms-matrix-copy-panel');assert.ok(panel);
 const table=panel.querySelector('table');assert.match(table.caption.textContent,/Saved Matrix Copy output/);
 assert.deepEqual([...table.querySelectorAll('td')].map(e=>e.textContent),['100','80','80','100']);
 assert.equal(d.querySelectorAll('.ms-test-output-panel').length,2);
 assert.equal(d.querySelectorAll('.ms-workspace-panel').length,1);
 assert.equal(d.querySelectorAll('.ms-lab').length,5);
 assert.match(html,/#lesson-content \.ms-lab\s*\{[^}]*max-width:\s*560px/);
 assert.match(html,/#lesson-content \.ms-matrix-copy-panel\s*\{[^}]*max-width:\s*460px/);
 assert.match(html,/#lesson-content \.ms-matrix-copy-panel table\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*360px/);
 assert.match(html,/#lesson-content \.ms-dialog\s*\{[^}]*max-width:\s*560px/);
 assert.match(html,/#lesson-content \.ms-chart\.ms-chart-card\s*\{[^}]*max-width:\s*680px/);
});

test('canonical dropdown navigation loads its shared styles and behavior',()=>{const d=doc();assert.equal(d.querySelectorAll('head link[rel="stylesheet"][href="/site-nav.css"]').length,1);assert.equal(d.querySelectorAll('head script[src="/site-nav.js"][defer]').length,1);assert.equal(d.querySelectorAll('header.site nav.desktop-nav .nav-chevron').length,6);assert.ok(fs.existsSync('site-nav.css'));assert.ok(fs.existsSync('site-nav.js'));});

/* Guide and persona-audit remediation (26 Nov 2026). */
const metaOf=()=>JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
const entryOf=()=>{const i=catalog.indexOf("marker: 'data-multivariate-statistical-process-control'");return catalog.slice(catalog.lastIndexOf('{',i),catalog.indexOf('}',i)+1);};
test('title names MSPC correctly and agrees across page, catalog, SQL and minutes',()=>{
 const meta=metaOf(),d=doc();
 assert.match(meta.title,/^Multivariate Statistical Process Control \(MSPC\)/);
 assert.doesNotMatch(html+catalog+sql,/Statistical Control Chart \(MSPC\)/);
 assert.equal(d.querySelector('main#lesson-content h1').textContent,meta.title);
 const entry=entryOf();
 assert.ok(entry.includes("title: '"+meta.card_title.replace(/'/g,"\\'")+"'"),'catalog title = card_title');
 assert.ok(meta.card_title.length<=70,'short catalog/email title');
 assert.ok(entry.includes('<span>'+meta.estimated_minutes+' min</span>'));
 assert.match(d.querySelector('.ms-hero > p').textContent,new RegExp(meta.estimated_minutes+' MIN'));
 assert.ok(sql.includes("'"+meta.title.replace(/'/g,"''")+"'"),'SQL display name = title');
 assert.ok(d.title.endsWith(' | UpSkill Sprint')&&d.title.length<=65);
});
test('Statistics Implementation follows guide §11.1',()=>{
 const d=doc(),p=d.getElementById('implementation');
 assert.equal(p.tagName,'DETAILS');assert.ok(!p.hasAttribute('open'));
 const sm=p.querySelector(':scope > summary');
 assert.ok(sm.querySelector('.ms-kicker')&&sm.querySelector('h2')&&sm.querySelector('.ms-impl-pill'));
 assert.equal(sm.querySelectorAll('.ms-impl-show').length,2);assert.equal(sm.querySelectorAll('.ms-impl-hide').length,2);
 const ids=['excel-functions','excel-use-cases','minitab','exam-tips'];const pos=ids.map(id=>{assert.ok(p.querySelector('#'+id),id);return html.indexOf('id="'+id+'"');});
 assert.deepEqual([...pos].sort((a,b)=>a-b),pos);
 assert.match(html,/@keyframes lesson-multivariate-statistical-process-control-nudge/);
 assert.match(html,/prefers-reduced-motion:reduce\)\{#lesson-content \.ms-impl:not\(\[open\]\) \.ms-impl-pill\{animation:none\}/);
 assert.doesNotMatch(html,/@keyframes nudge\b/);
 assert.ok(d.querySelector('a[href="#implementation"]'));
 assert.match(p.querySelector('#exam-tips').parentElement.textContent,/do not name Hotelling/);
 const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://upskillsprint.com/lessons/statistics/'+slug+'#exam-tips'});const w=dom.window;
 for(const sc of w.document.querySelectorAll('script:not([src])'))if(!sc.type)w.eval(sc.textContent);
 assert.equal(w.document.getElementById('implementation').open,true,'hash to a part opens the panel');w.close();
});
test('math with values is LaTeX, prose stays within the text budget',()=>{
 const d=doc(),meta=metaOf(),main=d.querySelector('main#lesson-content').cloneNode(true);
 main.querySelectorAll('script,style,svg,code,[aria-hidden="true"]').forEach(e=>e.remove());
 const text=main.textContent.replace(/\\\[[\s\S]*?\\\]/g,' ').replace(/\\\([\s\S]*?\\\)/g,' ');
 assert.doesNotMatch(text,/T²\s*[=≈]|[≈λ×√]|between −1|superscript −1/);
 const prose=d.querySelector('main#lesson-content').cloneNode(true);prose.querySelectorAll('script,style,svg,#quiz').forEach(e=>e.remove());
 const words=prose.textContent.replace(/\\\[[\s\S]*?\\\]/g,' M ').replace(/\\\([\s\S]*?\\\)/g,' M ').split(/\s+/).filter(Boolean).length;
 assert.ok(words<=meta.estimated_minutes*50,words+' words for '+meta.estimated_minutes+' min');
 for(const p of d.querySelectorAll('main p')){const n=p.textContent.replace(/\\\([\s\S]*?\\\)/g,' M ').split(/\s+/).filter(Boolean).length;assert.ok(n<=60,'paragraph over 60 words: '+p.textContent.slice(0,60));}
});
test('structure: quiz in main, related lessons in #327 format, accessible tables and downloads',()=>{
 const d=doc(),main=d.querySelector('main#lesson-content');
 assert.ok(main.querySelector('#quiz'),'quiz inside main');
 const q=block('### 7.3 Quiz grader','html').trim(),qs=block('### 7.1 Quiz styles','html').trim();assert.ok(html.includes(q));assert.ok(html.includes(qs));
 assert.equal(d.querySelectorAll('#quiz .quiz-question').length,12);
 const rel=main.querySelector('section.related-lessons');assert.ok(rel);const items=[...rel.querySelectorAll('li')];
 assert.ok(items.length>=3&&items.length<=5);
 for(const li of items){const a=li.querySelector('a');assert.ok(fs.existsSync(a.getAttribute('href').slice(1)+'.html'),a.getAttribute('href'));assert.match(li.textContent,/ — \S/);}
 for(const t of main.querySelectorAll('table')){const r=t.parentElement;assert.equal(r.getAttribute('role'),'region');assert.equal(r.getAttribute('tabindex'),'0');assert.ok(r.getAttribute('aria-label'));}
 for(const th of main.querySelectorAll('thead th'))assert.equal(th.getAttribute('scope'),'col');
 for(const a of d.querySelectorAll('#downloads a[download]'))assert.match(a.textContent,/Download \S+\.csv \(CSV, \d+ KB\)/);
 assert.equal(d.querySelectorAll('main div[aria-label]:not([role]),main span[aria-label]:not([role])').length,0);
});
test('scroll regions really scroll and hero poster labels stay readable (rendered-layout guards)',()=>{
 const css=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
 assert.match(css,/(^|[\s}])\.ms-scroll\{overflow:auto\}/m,'the .ms-scroll rule must stand on its own selector');
 assert.doesNotMatch(css,/\.ms-(open|closed)\b/,'no leftovers of the removed summary spans');
 for(const style of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)){let b=0;for(const ch of style[1]){if(ch==='{')b++;if(ch==='}')b--;assert.ok(b>=0);}assert.equal(b,0,'balanced braces');}
 assert.match(css,/#lesson-content \.ms-visual-hero svg text\{font-size:12\.5px\}/);
});
test('download buttons wrap inside their cards',()=>{assert.match(html,/\.ms-resource a\{[^}]*max-width:100%;box-sizing:border-box;overflow-wrap:anywhere\}/);});
test('sitemap snapshot lists the lesson',()=>{assert.ok(fs.readFileSync('sitemap.xml','utf8').includes('<loc>https://upskillsprint.com/lessons/statistics/'+slug+'</loc>'));});

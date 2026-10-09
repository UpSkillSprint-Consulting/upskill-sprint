/* Presentation for CRE Set 2. Exploration exists only in completed-attempt review. */
(function (global) {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^cre:set-2:\d{3}$/.test(q.qid);
  function table(c) {
    return '<div class="cre2-scroll" role="region" tabindex="0" aria-label="' + esc(c.title) + '; scroll horizontally when needed"><table><caption>' + esc(c.title) + '</caption><thead><tr>' + c.columns.map(s => '<th scope="col">' + esc(s) + '</th>').join('') + '</tr></thead><tbody>' + c.rows.map(row => '<tr>' + row.map((v,i) => '<' + (i ? 'td' : 'th scope="row"') + '>' + esc(v) + '</' + (i ? 'td' : 'th') + '>').join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  function svg(title, description, width, height, content) {
    return '<div class="cre2-scroll" role="region" tabindex="0" aria-label="' + esc(title) + '; scroll horizontally when needed"><svg class="cre2-diagram" viewBox="0 0 ' + width + ' ' + height + '" style="width:' + width + 'px" role="img" aria-label="' + esc(description) + '"><title>' + esc(title) + '</title><desc>' + esc(description) + '</desc>' + content + '</svg></div>';
  }
  const line = (x1,y1,x2,y2,extra='') => '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" '+extra+'/>';
  const text = (x,y,t,extra='') => '<text x="'+x+'" y="'+y+'" text-anchor="middle" '+extra+'>'+esc(t)+'</text>';
  function box(x,y,w,h,label) {return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="7"/>'+text(x+w/2,y+h/2+5,label);}
  function faultTree(c) {
    let s = box(230,18,160,40,'Top event T') + line(310,58,310,77) + box(277,77,66,34,'OR');
    s += line(310,111,310,131)+line(158,131,462,131)+line(158,131,158,152)+line(462,131,462,152);
    s += box(120,152,76,34,'AND')+box(424,152,76,34,'AND');
    for (const [cx,a,b] of [[158,83,233],[462,387,537]]) {
      s += line(cx,186,cx,207)+line(a,207,b,207)+line(a,207,a,228)+line(b,207,b,228);
    }
    for (const [x,l,p] of [[83,'A','0.10'],[233,'C','0.05'],[387,'B','0.20'],[537,'C','0.05']]) {
      s += '<circle cx="'+x+'" cy="255" r="27"/>'+text(x,260,l)+text(x,310,'Probability '+p);
    }
    s += text(310,352,'Both C symbols denote the same basic event.');
    return svg(c.title,c.description,620,375,s);
  }
  function rbd(c) {
    let s = line(18,165,45,165)+box(45,135,142,60,'Power: 0.98')+line(187,165,227,165);
    s += line(227,75,227,255)+line(227,75,290,75)+line(227,255,290,255);
    s += box(290,45,176,60,'Channel 1: 0.90')+box(290,225,176,60,'Channel 2: 0.90');
    s += line(466,75,522,75)+line(466,255,522,255)+line(522,75,522,255)+line(522,165,598,165);
    s += text(378,153,'At least one')+text(378,177,'active channel required');
    return svg(c.title,c.description,620,330,s);
  }
  function weibull(c, mission) {
    const w=640,h=345,left=64,right=610,top=30,bottom=267;
    const x=t=>left+t/2000*(right-left), y=r=>bottom-r*(bottom-top);
    let s='';
    for(let v=0;v<=10;v+=2){const r=v/10;s+=line(left,y(r),right,y(r),'class="cre2-grid"')+text(38,y(r)+5,r.toFixed(1));}
    for(let t=0;t<=2000;t+=500){s+=line(x(t),bottom,x(t),bottom+6)+text(x(t),292,String(t));}
    s+=line(left,top,left,bottom)+line(left,bottom,right,bottom)+text(330,330,'Mission time (hours)')+text(88,17,'Reliability');
    [c.betaA,c.betaB].forEach((b,i)=>{
      const points=Array.from({length:101},(_,j)=>{const t=j*20;return x(t).toFixed(2)+','+y(Math.exp(-Math.pow(t/c.eta,b))).toFixed(2);}).join(' ');
      s+='<polyline class="cre2-curve" points="'+points+'"'+(i?' stroke-dasharray="8 5"':'')+'/>';
    });
    s+=line(368,43,401,43)+text(474,48,'A: shape 1 (solid)');
    s+=line(368,69,401,69,'stroke-dasharray="8 5"')+text(474,74,'B: shape 2 (dashed)');
    if(Number.isFinite(mission))s+=line(x(mission),top,x(mission),bottom,'class="cre2-mission"');
    return svg(c.title,'Two Weibull reliability curves: A has shape 1 and B shape 2; both have characteristic life 1,000 hours. Exact values at selected times are in the accompanying table.',w,h,s);
  }
  function cpm(c) {
    const node=(x,y,id,label,days)=>'<rect x="'+x+'" y="'+y+'" width="212" height="62" rx="7"/>'+text(x+106,y+25,id+' · '+label)+text(x+106,y+48,days+' days');
    const arrow=(x1,y1,x2,y2)=>line(x1,y1,x2,y2)+'<polyline points="'+(x2-5)+','+(y2-8)+' '+x2+','+y2+' '+(x2+5)+','+(y2-8)+'"/>';
    let s=node(234,16,'A','Requirements',3);
    s+=line(340,78,340,99)+line(146,99,534,99)+arrow(146,99,146,122)+arrow(534,99,534,122);
    s+=node(40,122,'B','Design',6)+node(428,122,'C','Fixture design',4);
    s+=arrow(146,184,146,228)+arrow(534,184,534,228);
    s+=node(40,228,'D','Prototype',4)+node(428,228,'E','Fixture build',5);
    s+=line(146,290,146,314)+line(534,290,534,314)+line(146,314,534,314)+arrow(340,314,340,338);
    s+=node(234,338,'F','Demonstration',3)+text(340,428,'Original plan; apply the change to C stated in the question.');
    return svg(c.title,c.description,680,450,s);
  }
  function duane(c) {
    const left=78,right=600,top=46,bottom=290;
    const x=t=>left+Math.log(t/1000)/Math.log(8)*(right-left);
    const y=m=>bottom-Math.log(m/100)/Math.log(2.5)*(bottom-top);
    let s='';
    for(const m of [100,125,150,200,250])s+=line(left,y(m),right,y(m),'class="cre2-grid"')+text(47,y(m)+5,String(m));
    for(const t of [1000,2000,4000,8000])s+=line(x(t),top,x(t),bottom,'class="cre2-grid"')+text(x(t),317,t.toLocaleString('en-US'));
    s+=line(left,top,left,bottom)+line(left,bottom,right,bottom);
    s+=text(232,23,'Cumulative MTBF (hours; log scale)')+text(340,352,'Total test exposure (unit-hours; log scale)');
    s+=line(left,y(200),right,y(200),'stroke-dasharray="6 5"')+text(177,y(200)-10,'Target: 200 h');
    s+=line(x(1000),y(100),x(8000),y(100*Math.pow(8,.4)),'class="cre2-curve"');
    s+='<circle cx="'+x(1000)+'" cy="'+y(100)+'" r="5"/>'+text(183,276,'Current test point');
    s+=text(427,201,'Solid line: conditional forecast');
    return svg(c.title,c.description,650,375,s);
  }
  function eventTree(c) {
    const hArrow=(x1,y,x2)=>line(x1,y,x2,y)+'<polyline points="'+(x2-7)+','+(y-5)+' '+x2+','+y+' '+(x2-7)+','+(y+5)+'"/>';
    let s='<rect x="18" y="147" width="152" height="64" rx="7"/>'+text(94,173,'Demand')+text(94,195,'0.40 per year');
    s+=line(170,179,210,179)+line(210,52,210,257);
    s+=hArrow(210,52,365)+text(282,37,'A succeeds: 0.90')+box(365,30,160,44,'No release');
    s+=hArrow(210,257,365)+text(282,239,'A fails: 0.10');
    s+='<rect x="365" y="227" width="160" height="60" rx="7"/>'+text(445,251,'A has failed')+text(445,275,'Assess B');
    s+=line(525,257,555,257)+line(555,168,555,320);
    s+=hArrow(555,168,604)+text(626,134,'B succeeds: 0.75')+box(604,146,116,44,'No release');
    s+=hArrow(555,320,604)+text(626,286,'B fails: 0.25')+box(604,298,116,44,'Release');
    s+=text(370,381,'B branch probabilities are conditional on A having failed.');
    return svg(c.title,c.description,740,405,s);
  }
  function pChart(c, secondSample) {
    const rows=c.rows.map((r,i)=>({week:r[0],n:i===1&&secondSample?secondSample:r[1],d:i===1 && secondSample ? .045*secondSample : r[2]}));
    rows.forEach(r=>{r.p=r.d/r.n;r.u=.02+3*Math.sqrt(.02*.98/r.n);r.l=Math.max(0,.02-3*Math.sqrt(.02*.98/r.n));});
    const x=i=>100+160*i,y=p=>280-p/.08*224;
    let s='';
    for(const p of [0,.02,.04,.06,.08])s+=line(68,y(p),620,y(p),'class="cre2-grid"')+text(41,y(p)+5,(p*100).toFixed(0)+'%');
    s+=line(68,56,68,280)+line(68,280,620,280)+text(226,26,'Nonconforming proportion');
    const points=key=>rows.map((r,i)=>x(i)+','+y(r[key])).join(' ');
    s+=line(68,y(.02),620,y(.02),'stroke-dasharray="10 3 2 3"');
    s+='<polyline points="'+points('u')+'" stroke-dasharray="7 4"/><polyline points="'+points('l')+'" stroke-dasharray="2 4"/><polyline class="cre2-curve" points="'+points('p')+'"/>';
    rows.forEach((r,i)=>{s+='<circle cx="'+x(i)+'" cy="'+y(r.p)+'" r="4"/><rect x="'+(x(i)-4)+'" y="'+(y(r.u)-4)+'" width="8" height="8"/>'+text(x(i),307,'Week '+r.week)+text(x(i),327,'n = '+r.n);});
    s+=line(65,357,100,357)+'<circle cx="82" cy="357" r="4"/>'+text(178,362,'Observed')+line(329,357,364,357,'stroke-dasharray="7 4"')+'<rect x="342" y="353" width="8" height="8"/>'+text(443,362,'Upper limit');
    s+=line(65,382,100,382,'stroke-dasharray="10 3 2 3"')+text(183,387,'Baseline 2.0%')+line(329,382,364,382,'stroke-dasharray="2 4"')+text(443,387,'Lower limit');
    const description=rows.map(r=>'Week '+r.week+': n='+r.n+', observed '+(r.p*100).toFixed(2)+'%, upper limit '+(r.u*100).toFixed(2)+'%, lower limit '+(r.l*100).toFixed(2)+'%.').join(' ');
    return svg(c.title,description,660,408,s);
  }
  function interaction(c) {
    const x=[165,495],y=v=>280-(v-800)/800*210;let s='';
    for(const v of [800,1000,1200,1400,1600])s+=line(75,y(v),605,y(v),'class="cre2-grid"')+text(43,y(v)+5,v.toLocaleString('en-US'));
    s+=line(75,70,75,280)+line(75,280,605,280)+text(234,49,'Mean time to failure (hours)');
    s+=line(x[0],y(1000),x[1],y(1500),'class="cre2-curve"')+line(x[0],y(1400),x[1],y(900),'class="cre2-curve" stroke-dasharray="8 5"');
    for(const [i,a,b] of [[0,1000,1400],[1,1500,900]])s+='<circle cx="'+x[i]+'" cy="'+y(a)+'" r="5"/><rect x="'+(x[i]-5)+'" y="'+(y(b)-5)+'" width="10" height="10"/>';
    s+=line(94,20,129,20)+text(204,25,'B low (−1)')+line(358,20,393,20,'stroke-dasharray="8 5"')+text(474,25,'B high (+1)');
    s+=text(x[0],307,'A low (−1)')+text(x[1],307,'A high (+1)')+text(340,340,'Cell means; within-cell variation is not shown.');
    return svg(c.title,c.description,650,365,s);
  }
  const acceleration=t=>Math.exp(.70/8.617333262e-5*(1/328.15-1/(t+273.15)));
  function arrheniusPlot(temperature) {
    const x=t=>72+(t-55)/55*545,y=af=>263-af/40*212;let s='';
    for(const af of [0,10,20,30,40])s+=line(72,y(af),617,y(af),'class="cre2-grid"')+text(43,y(af)+5,String(af));
    for(const t of [55,65,75,85,95,105,110])s+=line(x(t),263,x(t),269)+text(x(t),292,String(t));
    s+=line(72,51,72,263)+line(72,263,617,263)+text(255,24,'Acceleration factor: use life / test life');
    const points=Array.from({length:111},(_,i)=>{const t=55+i/2;return x(t).toFixed(2)+','+y(acceleration(t)).toFixed(2);}).join(' ');
    s+='<polyline class="cre2-curve" points="'+points+'"/>'+line(x(temperature),51,x(temperature),263,'class="cre2-mission"')+'<circle cx="'+x(temperature)+'" cy="'+y(acceleration(temperature))+'" r="5"/>';
    s+=text(338,322,'Test temperature (°C); use temperature fixed at 55 °C')+text(327,349,'Model exploration assumes the same mechanism across this range.');
    return svg('Arrhenius temperature exploration','Activation energy 0.70 eV; use temperature 55 degrees Celsius. At test temperature '+temperature+' degrees Celsius, the life-ratio acceleration factor is '+acceleration(temperature).toFixed(2)+'. The curve increases with test temperature.',665,370,s);
  }
  function exhibit(q) {
    const c=q.chart;if(!c)return '';
    const diagram = c.creKind==='fault-tree'?faultTree(c):c.creKind==='rbd'?rbd(c):c.creKind==='weibull'?weibull(c):c.creKind==='cpm'?cpm(c):c.creKind==='duane'?duane(c):c.creKind==='event-tree'?eventTree(c):c.creKind==='p-chart'?pChart(c):c.creKind==='interaction'?interaction(c):'';
    return '<section class="cre2-exhibit" aria-label="Question evidence">'+
      (diagram?'<p class="cre2-caption">'+esc(c.title)+'</p>'+diagram+'<details class="cre2-alternative"><summary>Read the diagram description and data table</summary>'+(c.description?'<p>'+esc(c.description)+'</p>':'')+table(c)+'</details>':table(c))+
      '<p class="cre2-scroll-note">On a narrow screen, swipe or scroll within the exhibit to read it at full size.</p></section>';
  }
  function render(q,review) {
    if(!isQuestion(q))return '';
    return '<div class="cre-set2-question" data-cre-question="'+esc(q.qid)+'"><p class="cre2-item-label">CRE · Set 2 · Q'+String(q.number).padStart(3,'0')+'</p><div class="'+(review?'tb-review-stem':'tb-stem')+'" data-question-id="'+esc(q.qid)+'">'+esc(q.stem)+'</div>'+exhibit(q)+'</div>';
  }
  function reference(q) {
    if(!isQuestion(q))return '';
    let html='<p class="cre2-source"><strong>Study reference:</strong> ASQ CRE Handbook, 4th edition (2025), Chapter '+esc(q.handbook.chapter)+' — '+esc(q.handbook.section)+'. <strong>BoK:</strong> '+esc(q.bok)+'.</p>';
    if(q.studyReference) html+='<a class="tb-review-lesson" href="'+esc(q.studyReference.url)+'">Study: '+esc(q.studyReference.title)+'</a>';
    else html+='<p class="cre2-source">'+esc(q.lessonGap)+'</p>';
    return html;
  }
  function explorer(q) {
    const id='cre2-explore-'+q.number;
    const header='<details class="cre2-explorer" data-cre-explorer="'+q.explorer+'"><summary>Explore this concept</summary><p>Change the practice scenario to test your understanding. The original question, answer key, and score stay unchanged.</p>';
    if(q.explorer==='weibull')return header+'<label for="'+id+'">Mission duration (hours)</label><input id="'+id+'" type="range" min="100" max="1900" step="100" value="500"><div data-cre-explorer-plot>'+weibull(q.chart,500)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 500 hours</button></details>';
    if(q.explorer==='sample-size')return header+'<label for="'+id+'">One-sided confidence level</label><select id="'+id+'"><option value="0.90">90%</option><option value="0.95" selected>95% (question baseline)</option><option value="0.99">99%</option></select><p>Required mission reliability stays at 0.90; acceptance still requires zero failures.</p><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 95%</button></details>';
    if(q.explorer==='alarm-prevalence')return header+'<label for="'+id+'">Fault prevalence in the population</label><select id="'+id+'"><option value="0.01">1%</option><option value="0.02" selected>2% (question baseline)</option><option value="0.05">5%</option><option value="0.10">10%</option></select><p>Sensitivity stays at 90%; the false-alarm probability among healthy units stays at 5%. Counts below are expected values per 10,000 units.</p><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 2%</button></details>';
    if(q.explorer==='acceptance-risk')return header+'<label for="'+id+'">Maximum failures permitted for acceptance</label><select id="'+id+'"><option value="0">0 failures</option><option value="1" selected>1 failure (question baseline)</option><option value="2">2 failures</option></select><p>The sample stays at 20 independent completed missions; true mission reliability stays at the good-quality reference of 0.95. Changing this control changes the hypothetical acceptance rule.</p><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 1 failure</button></details>';
    if(q.explorer==='p-chart-sample')return header+'<label for="'+id+'">Week 2 sample size at the same 4.5% observed proportion</label><select id="'+id+'"><option value="200">200 units; 9 nonconforming</option><option value="400" selected>400 units; 18 nonconforming (question baseline)</option><option value="800">800 units; 36 nonconforming</option></select><p>The established baseline stays at 2.0%; the other weeks remain unchanged.</p><div data-cre-explorer-plot>'+pChart(q.chart,400)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 400 units</button></details>';
    if(q.explorer==='arrhenius-temperature')return header+'<label for="'+id+'">Test temperature (°C)</label><input id="'+id+'" type="range" min="60" max="110" step="5" value="85"><p>Use temperature stays at 55 °C and activation energy at 0.70 eV. This hypothetical exploration assumes the model remains valid; it does not authorize a higher test stress.</p><div data-cre-explorer-plot>'+arrheniusPlot(85)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 85 °C</button></details>';
    return '';
  }
  function updateExplorer(el,q) {
    const control=el.querySelector('input,select'), value=Number(control.value),out=el.querySelector('output');
    if(q.explorer==='weibull'){
      const a=Math.exp(-value/1000), b=Math.exp(-Math.pow(value/1000,2));
      out.textContent=value+' hours: A reliability '+a.toFixed(4)+'; B reliability '+b.toFixed(4)+'. '+(Math.abs(a-b)<1e-10?'The designs are equal at this time.':(a>b?'A':'B')+' has higher reliability at this time.');
      el.querySelector('[data-cre-explorer-plot]').innerHTML=weibull(q.chart,value);
    } else if(q.explorer==='sample-size') {
      const n=Math.ceil(Math.log(1-value)/Math.log(0.9));
      out.textContent='Minimum sample: '+n+' independent units completing the full mission with zero failures. All-success probability at reliability 0.90: '+Math.pow(.9,n).toFixed(5)+'.';
    } else if(q.explorer==='alarm-prevalence') {
      const trueAlarms=10000*value*.9,falseAlarms=10000*(1-value)*.05;
      out.textContent='Expected true alarms: '+trueAlarms.toFixed(0)+'; false alarms: '+falseAlarms.toFixed(0)+'. Probability of a fault given an alarm: '+(100*trueAlarms/(trueAlarms+falseAlarms)).toFixed(1)+'%.';
    } else if(q.explorer==='acceptance-risk') {
      let term=Math.pow(.95,20),accept=term;
      for(let k=1;k<=value;k++){term*=((21-k)/k)*(.05/.95);accept+=term;}
      out.textContent='Acceptance probability: '+(100*accept).toFixed(1)+'%. Producer’s risk (rejection at reliability 0.95): '+(100*(1-accept)).toFixed(1)+'%.';
    } else if(q.explorer==='p-chart-sample') {
      const upper=.02+3*Math.sqrt(.02*.98/value);
      out.textContent='Week 2: '+(.045*value)+' / '+value+' = 4.5%. Upper limit: '+(100*upper).toFixed(2)+'%. '+(.045>upper?'Above the upper limit: investigate the signal.':'Within the upper limit under the stated single-point rule.');
      el.querySelector('[data-cre-explorer-plot]').innerHTML=pChart(q.chart,value);
    } else if(q.explorer==='arrhenius-temperature') {
      out.textContent='Test temperature: '+value+' °C = '+(value+273.15).toFixed(2)+' K. Acceleration factor: '+acceleration(value).toFixed(2)+'. Under this model, 100 hours at test temperature corresponds to '+(100*acceleration(value)).toFixed(1)+' equivalent hours at 55 °C.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=arrheniusPlot(value);
    }
  }
  let mathQueue=Promise.resolve();
  function typeset(root) {
    if(!root || root.dataset.creMathStarted || !global.UpskillMath)return;
    root.dataset.creMathStarted='true';
    mathQueue=mathQueue.catch(()=>{}).then(async()=>{
      if(!root.isConnected)return;
      await global.UpskillMath.typeset([root]);
      root.querySelectorAll('mjx-container[display="true"]').forEach(el=>{
        el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label','Mathematical working; scroll horizontally when needed');
      });
    }).catch(()=>{root.removeAttribute('data-cre-math-started');});
  }
  function wire(host) {
    const quiz=host?.querySelector('.tb-quiz');
    if(quiz?.querySelector('.cre-set2-question'))typeset(quiz);
  }
  function wireReview(event) {
    const root=event.detail?.root || document;
    const cards=root.matches?.('.tb-review-card')?[root]:root.querySelectorAll('.tb-review-card');
    cards.forEach(card=>{
      const id=card.querySelector('[data-cre-question]')?.dataset.creQuestion;
      const q=(global.CRE_SET2||[]).find(q=>q.qid===id);if(!q)return;
      if(q.explorer&&!card.querySelector('.cre2-explorer')){
        card.querySelector('.tb-explanation')?.insertAdjacentHTML('beforeend',explorer(q));
        const el=card.querySelector('.cre2-explorer');
        if(el){
          const control=el.querySelector('input,select');
          control.addEventListener('input',()=>updateExplorer(el,q));
          control.addEventListener('change',()=>updateExplorer(el,q));
          const defaults={'weibull':'500','sample-size':'0.95','alarm-prevalence':'0.02','acceptance-risk':'1','p-chart-sample':'400','arrhenius-temperature':'85'};
          el.querySelector('[data-cre-reset]').addEventListener('click',()=>{control.value=defaults[q.explorer];updateExplorer(el,q);});
          updateExplorer(el,q);
        }
      }
      typeset(card);
    });
    const retry=root.closest?.('.tb-retry-panel')||root.querySelector('.tb-retry-panel');
    if(retry?.querySelector('.cre-set2-question')){
      // Retry UI updates its contents in place, so typeset the newly created child.
      typeset(retry.querySelector('.tb-retry-feedback'));
    }
    const quiz=root.closest?.('.tb-quiz');
    if(quiz?.querySelector('.cre-set2-question'))typeset(quiz.querySelector('#tb-revealed-answer'));
  }
  if(global.document)document.addEventListener('tb:review-rendered',wireReview);
  global.__CRESet2UI={isQuestion,render,reference,wire,exhibit};
})(window);

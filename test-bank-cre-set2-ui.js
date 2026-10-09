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
  function exhibit(q) {
    const c=q.chart;if(!c)return '';
    const diagram = c.creKind==='fault-tree'?faultTree(c):c.creKind==='rbd'?rbd(c):c.creKind==='weibull'?weibull(c):'';
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
    return '';
  }
  function updateExplorer(el,q) {
    const control=el.querySelector('input,select'), value=Number(control.value),out=el.querySelector('output');
    if(q.explorer==='weibull'){
      const a=Math.exp(-value/1000), b=Math.exp(-Math.pow(value/1000,2));
      out.textContent=value+' hours: A reliability '+a.toFixed(4)+'; B reliability '+b.toFixed(4)+'. '+(Math.abs(a-b)<1e-10?'The designs are equal at this time.':(a>b?'A':'B')+' has higher reliability at this time.');
      el.querySelector('[data-cre-explorer-plot]').innerHTML=weibull(q.chart,value);
    } else {
      const n=Math.ceil(Math.log(1-value)/Math.log(0.9));
      out.textContent='Minimum sample: '+n+' independent units completing the full mission with zero failures. All-success probability at reliability 0.90: '+Math.pow(.9,n).toFixed(5)+'.';
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
          el.querySelector('[data-cre-reset]').addEventListener('click',()=>{control.value=q.explorer==='weibull'?'500':'0.95';updateExplorer(el,q);});
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

/* Set 3 canonical Q126–150 only. No answer key is exposed by the evidence renderer. */
(function(global){
 'use strict';
 const ids=new Set(["mbb:set-3:d6-016", "mbb:set-3:d6-017", "mbb:set-3:d6-018", "mbb:set-3:d6-019", "mbb:set-3:d6-020", "mbb:set-3:d6-021", "mbb:set-3:d6-022", "mbb:set-3:d6-023", "mbb:set-3:d6-024", "mbb:set-3:d6-025", "mbb:set-3:d6-026", "mbb:set-3:d6-027", "mbb:set-3:d6-028", "mbb:set-3:d6-029", "mbb:set-3:d6-030", "mbb:set-3:d6-031", "mbb:set-3:d6-032", "mbb:set-3:d6-033", "mbb:set-3:d6-034", "mbb:set-3:d6-035", "mbb:set-3:d6-036", "mbb:set-3:d6-037", "mbb:set-3:d6-038", "mbb:set-3:d6-039", "mbb:set-3:d6-040"]);
 const isQuestion=q=>!!q&&ids.has(q.qid);
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function table(c){return '<p class="mbbs3b6-scroll-hint">Scroll or swipe horizontally when needed to read every table column.</p><div class="mbbs3b6-scroll" role="region" tabindex="0" aria-label="'+esc(c.title)+'; scroll horizontally if needed"><table class="mbbs3b6-table"><caption>'+esc(c.title)+'</caption><thead><tr>'+c.columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+c.rows.map(r=>'<tr>'+r.map((s,i)=>i===0?'<th scope="row">'+esc(s)+'</th>':'<td>'+esc(s)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
// Inserted into the exact-qid-scoped Batch 5 presentation module.
// Plots use the displayed evidence data, never the answer index.
 const num=(n,d=3)=>Number(n.toFixed(d)).toString();
 function text(x,y,s,anchor='start'){return '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+esc(s)+'</text>';}
 function line(x1,y1,x2,y2,cls='mbbs3b6-axis',extra=''){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'" '+extra+'/>';}
 function svg(title,body,w=660,h=340){return '<svg viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" role="img" aria-label="'+esc(title)+'"><title>'+esc(title)+'</title>'+body+'</svg>';}
 function dot(x,y,label,extra=''){return '<circle cx="'+x+'" cy="'+y+'" r="4" data-point="true" '+extra+'><title>'+esc(label)+'</title></circle>';}
 function xyPlot(title,xs,series,range,xlabel,ylabel,refs=[]){
  const [xmin,xmax,ymin,ymax]=range,right=refs.some(r=>r.y!==undefined)?500:620,X=x=>70+(x-xmin)/(xmax-xmin)*(right-70),Y=y=>270-(y-ymin)/(ymax-ymin)*220;
  let b=text(330,24,title,'middle')+text(330,326,xlabel,'middle')+text(16,43,ylabel);
  for(let i=0;i<=4;i++){let y=ymin+(ymax-ymin)*i/4;b+=line(70,Y(y),right,Y(y),'mbbs3b6-grid')+text(59,Y(y)+5,num(y,3),'end');}
  const xt=xs.length<=13?xs:[xs[0],xs[Math.floor(xs.length/2)],xs[xs.length-1]];
  xt.forEach(x=>{b+=line(X(x),270,X(x),277)+text(X(x),296,num(x,3),'middle');});
  b+=line(70,50,70,270)+line(70,270,right,270);
  refs.forEach(r=>{if(r.y!==undefined){b+=line(70,Y(r.y),right,Y(r.y),'mbbs3b6-reference','stroke-dasharray="7 5"')+text(right+12,Y(r.y)+5,r.label+' '+num(r.y,4),'start');}else if(r.points){b+='<polyline class="mbbs3b6-reference" stroke-dasharray="7 5" points="'+r.points.map(p=>X(p[0])+','+Y(p[1])).join(' ')+'"/>';}});
  series.forEach((s,j)=>{if(s.connect!==false)b+='<polyline data-series="'+j+'" class="mbbs3b6-series" '+(s.dashed?'stroke-dasharray="8 5" ':'')+'points="'+s.values.map((v,i)=>X(xs[i])+','+Y(v)).join(' ')+'"/>';
   if(s.dots!==false)s.values.forEach((v,i)=>b+=dot(X(xs[i]),Y(v),s.name+'; '+xlabel+' '+xs[i]+'; value '+num(v,6),'data-x="'+xs[i]+'" data-y="'+v+'" data-series="'+j+'"'));
  });return svg(title,b);
 }
 function plot(c){
  let drawings='';
  if(c.panels){for(const p of c.panels)drawings+=xyPlot(p.title,p.xs,p.series,p.range,p.xLabel,p.yLabel,p.refs||[]);}
  else if(c.type==='doe-cube'){
   const X=p=>120+(p.a+1)*110+(p.c+1)*70,Y=p=>290-(p.b+1)*80-(p.c+1)*35;
   let b=text(330,24,'Fitted etch rate at all eight settings','middle');
   c.vertices.forEach((p,i)=>c.vertices.slice(i+1).forEach(q=>{if(['a','b','c'].filter(k=>p[k]!==q[k]).length===1)b+=line(X(p),Y(p),X(q),Y(q));}));
   c.vertices.forEach(p=>{b+=dot(X(p),Y(p),'A '+p.a+', B '+p.b+', C '+p.c+': '+p.value+' nm/min','data-x="'+p.a+'" data-y="'+p.value+'" data-a="'+p.a+'" data-b="'+p.b+'" data-c="'+p.c+'"');
    let lx=X(p),ly=Y(p)+24,anchor='middle';
    if(p.c>0&&p.b>0){lx+=14;anchor='start';}
    else if(p.c>0&&p.b<0){lx+=p.a<0?-14:14;ly=Y(p)+4;anchor=p.a<0?'end':'start';}
    else if(p.b>0){lx+=p.a<0?-14:14;ly=Y(p)+(p.a<0?4:24);anchor=p.a<0?'end':'start';}
    b+=text(lx,ly,'('+[p.a,p.b,p.c].map(v=>v<0?'−':'+').join(',')+'): '+num(p.value),anchor).replace('<text ','<text data-cube-label="true" ');});
   b+=text(330,352,'Vertex labels: (A, B, C): fitted rate in nm/min','middle');drawings=svg(c.title,b,660,375);
  }else throw new Error('Unsupported Batch 6 chart '+c.type);
  return '<figure class="mbbs3b6-plot"><figcaption>'+esc(c.title)+'</figcaption><p>'+esc(c.altText)+'</p><p class="mbbs3b6-scroll-hint">Scroll or swipe horizontally to inspect the complete figure. Numerical data are also provided below.</p><div class="mbbs3b6-scroll" role="region" tabindex="0" aria-label="'+esc(c.title)+'; horizontally scrollable plot">'+drawings+'</div>'+(c.legend?'<p class="mbbs3b6-legend">'+esc(c.legend)+'</p>':'')+'</figure>'+table(c.evidence);
 }
 function render(q,review){if(!isQuestion(q))return '';return '<div class="mbbs3b6-question"><div class="'+(review?'tb-review-stem':'tb-stem')+'" data-question-id="'+esc(q.qid)+'" tabindex="-1">'+esc(q.stem)+'</div>'+(q.chart?'<div class="mbbs3b6-evidence">'+(q.chart.type==='data-table'?table(q.chart):plot(q.chart))+'</div>':'')+'</div>';}
 function rationales(q){if(!isQuestion(q)||!Array.isArray(q.optionRationales))return '';return '<dl class="mbbs3b6-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';}
 let lastId='';
 function wire(host){const quiz=host.querySelector('.tb-quiz');if(!quiz||!ids.has(quiz.dataset.questionId)){lastId='';return;}
  quiz.querySelectorAll('[data-opt]').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('sel'))));
  quiz.querySelector('[data-flag]')?.setAttribute('aria-pressed',String(quiz.querySelector('[data-flag]').classList.contains('on')));
  quiz.querySelector('.tb-navcell.cur')?.setAttribute('aria-current','step');
  if(lastId!==quiz.dataset.questionId){lastId=quiz.dataset.questionId;requestAnimationFrame(()=>{if(!quiz.isConnected)return;quiz.scrollIntoView({block:'start',behavior:'instant'});quiz.querySelector('.tb-stem')?.focus({preventScroll:true});});}
 }
 if(global.document){
  const style=document.createElement('style');style.id='mbb-set3-batch6-style';style.textContent=`
.mbbs3b6-question,.mbbs3b6-evidence{min-width:0;max-width:100%;color:var(--ink);line-height:1.6}.mbbs3b6-evidence{margin:18px 0}.mbbs3b6-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line);border-radius:8px;background:var(--card)}.mbbs3b6-scroll:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.mbbs3b6-table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.55;color:var(--ink);background:var(--card)}.mbbs3b6-table:has(th:nth-child(4)){min-width:540px}.mbbs3b6-table caption,.mbbs3b6-plot figcaption{text-align:left;font-weight:650;padding:12px 14px;font-size:15px}.mbbs3b6-table th,.mbbs3b6-table td{text-align:left;vertical-align:top;white-space:normal;padding:12px 14px;border-bottom:1px solid var(--line);color:var(--ink)}.mbbs3b6-table thead{background:var(--tint)}.mbbs3b6-plot{margin:0}.mbbs3b6-plot svg{display:block;width:660px;min-width:660px;max-width:none;height:auto;margin:auto;color:var(--ink);background:var(--card)}.mbbs3b6-plot svg text{font:14px Arial,sans-serif;fill:currentColor}.mbbs3b6-grid{stroke:var(--line);stroke-width:1}.mbbs3b6-series{fill:none;stroke:var(--ink);stroke-width:2.5}.mbbs3b6-plot circle{fill:var(--card);stroke:var(--ink);stroke-width:2}.mbbs3b6-plot circle:focus{outline:3px solid var(--teal);outline-offset:4px}.mbbs3b6-rationales{font-size:14px;line-height:1.65;margin:16px 0 0;color:var(--ink)}.mbbs3b6-rationales dt{font-weight:650;margin-top:12px}.mbbs3b6-rationales dd{margin:4px 0 0}.tb-quiz:has(.mbbs3b6-question){scroll-margin-top:90px}.tb-quiz:has(.mbbs3b6-question) .tb-opt{min-height:48px;line-height:1.6}.tb-quiz:has(.mbbs3b6-question) .tb-opt:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.tb-quiz:has(.mbbs3b6-question) .tb-qtag{color:var(--ink)!important}.tb-review-card:has(.mbbs3b6-question){min-width:0;max-width:100%;box-sizing:border-box}.tb-review-card:has(.mbbs3b6-question) .tb-explanation-copy{overflow-wrap:anywhere;line-height:1.65;font-size:14px;color:var(--ink)!important}.tb-review-list:has(.mbbs3b6-question){grid-template-columns:minmax(0,1fr)}
.tb-quiz:has(.mbbs3b6-question) .tb-opt,.tb-quiz:has(.mbbs3b6-question) .tb-opt>span:not(.k){color:var(--ink)!important;transition:none}.tb-quiz:has(.mbbs3b6-question) .tb-opt .k{color:var(--ink)!important}.tb-quiz:has(.mbbs3b6-question) .tb-opt.sel .k{background:#0b5464!important;color:#fff!important}
.tb-quiz:has(.mbbs3b6-question) [data-next],.tb-quiz:has(.mbbs3b6-question) [data-submit],.tb-review-card:has(.mbbs3b6-question) [data-prepare-report]{background:#0b5464!important;color:#fff!important}.tb-quiz:has(.mbbs3b6-question) [data-flag].on{background:#7c4a00!important;border-color:#7c4a00!important;color:#fff!important}.tb-review-card:has(.mbbs3b6-question) .tb-quality-badge{color:var(--ink)!important;background:var(--tint)!important}
.tb-review-card:has(.mbbs3b6-question) .tb-report-box[hidden]{display:none!important}.tb-review-card:has(.mbbs3b6-question) .tb-distractor-analysis,.tb-review-card:has(.mbbs3b6-question) .tb-distractor-row p,.tb-review-card:has(.mbbs3b6-question) .tb-distractor-row small,.tb-review-card:has(.mbbs3b6-question) .tb-accuracy-note,.tb-review-card:has(.mbbs3b6-question) .tb-quality-details{color:var(--ink)!important;line-height:1.6}
.tb-review-card:has(.mbbs3b6-question) .tb-quality-details p,.tb-review-card:has(.mbbs3b6-question) .tb-quality-details ul{color:var(--ink)!important}
@media(max-width:560px){.tb-feedback-loop:has(.mbbs3b6-question){padding:12px}.tb-review-card:has(.mbbs3b6-question){padding:12px}.tb-review-card:has(.mbbs3b6-question) .tb-review-stem{font-size:15px;line-height:1.6}}

.mbbs3b6-table{min-width:560px}.mbbs3b6-scroll-hint{font-size:13px;line-height:1.6;color:var(--ink)!important;margin:8px 0}.mbbs3b6-table th,.mbbs3b6-table td{overflow-wrap:break-word}
.tb-review-card:has(.mbbs3b6-question) .tb-key-point,.tb-review-card:has(.mbbs3b6-question) .tb-exam-trap{overflow-wrap:anywhere;min-width:0}

.mbbs3b6-plot p{font-size:14px;line-height:1.6;white-space:normal;overflow-wrap:anywhere;color:var(--ink)}.mbbs3b6-axis,.mbbs3b6-reference{stroke:var(--ink);stroke-width:1.4;fill:none}.mbbs3b6-box{fill:var(--tint);stroke:var(--ink);stroke-width:2}.mbbs3b6-plot circle.mbbs3b6-target{fill:none;stroke:var(--ink);stroke-width:1.5;opacity:.55}.mbbs3b6-plot{margin:0 0 14px}.mbbs3b6-legend{padding:10px 18px;max-width:600px}

.mbbs3b6-plot svg:has(.mbbs3b6-target) .mbbs3b6-grid{stroke:var(--ink);opacity:.55}
`;document.head.appendChild(style);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-opt],[data-flag]'),q=b?.closest('.tb-quiz');if(!b||!q||!ids.has(q.dataset.questionId))return;const attr=b.hasAttribute('data-opt')?'data-opt':'data-flag',value=b.getAttribute(attr);setTimeout(()=>{const now=document.querySelector('.tb-quiz');if(now?.dataset.questionId===q.dataset.questionId)now.querySelector('['+attr+'="'+value+'"]')?.focus({preventScroll:true});},0);},true);
 }
 global.__MBBSet3Batch6UI={isQuestion,render,rationales,wire};
})(window);

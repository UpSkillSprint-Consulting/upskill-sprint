/* Set 3 canonical Q101–125 only. No answer key is exposed by the evidence renderer. */
(function(global){
 'use strict';
 const ids=new Set(["mbb:set-3:d5-006", "mbb:set-3:d5-007", "mbb:set-3:d5-008", "mbb:set-3:d5-009", "mbb:set-3:d5-010", "mbb:set-3:d5-011", "mbb:set-3:d5-012", "mbb:set-3:d5-013", "mbb:set-3:d5-014", "mbb:set-3:d5-015", "mbb:set-3:d6-001", "mbb:set-3:d6-002", "mbb:set-3:d6-003", "mbb:set-3:d6-004", "mbb:set-3:d6-005", "mbb:set-3:d6-006", "mbb:set-3:d6-007", "mbb:set-3:d6-008", "mbb:set-3:d6-009", "mbb:set-3:d6-010", "mbb:set-3:d6-011", "mbb:set-3:d6-012", "mbb:set-3:d6-013", "mbb:set-3:d6-014", "mbb:set-3:d6-015"]);
 const isQuestion=q=>!!q&&ids.has(q.qid);
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function table(c){return '<p class="mbbs3b5-scroll-hint">Scroll or swipe horizontally when needed to read every table column.</p><div class="mbbs3b5-scroll" role="region" tabindex="0" aria-label="'+esc(c.title)+'; scroll horizontally if needed"><table class="mbbs3b5-table"><caption>'+esc(c.title)+'</caption><thead><tr>'+c.columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+c.rows.map(r=>'<tr>'+r.map((s,i)=>i===0?'<th scope="row">'+esc(s)+'</th>':'<td>'+esc(s)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
// Inserted into the exact-qid-scoped Batch 5 presentation module.
// Plots use the displayed evidence data, never the answer index.
 const num=(n,d=3)=>Number(n.toFixed(d)).toString();
 function text(x,y,s,anchor='start'){return '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+esc(s)+'</text>';}
 function line(x1,y1,x2,y2,cls='mbbs3b5-axis',extra=''){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'" '+extra+'/>';}
 function svg(title,body,w=660,h=340){return '<svg viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" role="img" aria-label="'+esc(title)+'"><title>'+esc(title)+'</title>'+body+'</svg>';}
 function dot(x,y,label,extra=''){return '<circle cx="'+x+'" cy="'+y+'" r="4" data-point="true" '+extra+'><title>'+esc(label)+'</title></circle>';}
 function xyPlot(title,xs,series,range,xlabel,ylabel,refs=[]){
  const [xmin,xmax,ymin,ymax]=range,right=refs.some(r=>r.y!==undefined)?500:620,X=x=>70+(x-xmin)/(xmax-xmin)*(right-70),Y=y=>270-(y-ymin)/(ymax-ymin)*220;
  let b=text(330,24,title,'middle')+text(330,326,xlabel,'middle')+text(16,43,ylabel);
  for(let i=0;i<=4;i++){let y=ymin+(ymax-ymin)*i/4;b+=line(70,Y(y),right,Y(y),'mbbs3b5-grid')+text(59,Y(y)+5,num(y,3),'end');}
  const xt=xs.length<=13?xs:[xmin,(xmin+xmax)/2,xmax];
  xt.forEach(x=>{b+=line(X(x),270,X(x),277)+text(X(x),296,num(x,3),'middle');});
  b+=line(70,50,70,270)+line(70,270,right,270);
  refs.forEach(r=>{if(r.y!==undefined){b+=line(70,Y(r.y),right,Y(r.y),'mbbs3b5-reference','stroke-dasharray="7 5"')+text(right+12,Y(r.y)+5,r.label+' '+num(r.y,4),'start');}else if(r.points){b+='<polyline class="mbbs3b5-reference" stroke-dasharray="7 5" points="'+r.points.map(p=>X(p[0])+','+Y(p[1])).join(' ')+'"/>';}});
  series.forEach((s,j)=>{if(s.connect!==false)b+='<polyline data-series="'+j+'" class="mbbs3b5-series" '+(s.dashed?'stroke-dasharray="8 5" ':'')+'points="'+s.values.map((v,i)=>X(xs[i])+','+Y(v)).join(' ')+'"/>';
   if(s.dots!==false)s.values.forEach((v,i)=>b+=dot(X(xs[i]),Y(v),s.name+'; '+xlabel+' '+xs[i]+'; value '+num(v,6),'data-x="'+xs[i]+'" data-y="'+v+'" data-series="'+j+'"'));
  });return svg(title,b);
 }
 function plot(c){
  let drawings='';
  if(c.type==='xbar-r'){
   drawings=xyPlot('Subgroup means',c.labels,[{name:'Mean',values:c.meanData}],[1,8,47.5,52.5],'Subgroup','Mean (g)',[{y:c.xbarLimits[0],label:'UCL'},{y:c.xbarLimits[1],label:'CL'},{y:c.xbarLimits[2],label:'LCL'}]);
   drawings+=xyPlot('Subgroup ranges',c.labels,[{name:'Range',values:c.rangeData}],[1,8,0,10],'Subgroup','Range (g)',[{y:c.rLimits[0],label:'UCL'},{y:c.rLimits[1],label:'CL'},{y:c.rLimits[2],label:'LCL'}]);
  }else if(c.type==='control-single'){
   drawings=xyPlot('Fill-weight chart: points 37–48',c.labels,[{name:'Fill weight',values:c.data}],[37,48,493,507],'Observation number','Weight (g)',[{y:c.ucl,label:'UCL'},{y:c.cl,label:'CL'},{y:c.lcl,label:'LCL'}]);
  }else if(c.type==='normal-prob'){
   const r=c.reference;drawings=xyPlot('Normal probability plot',c.points.map(p=>p.z),[{name:'Ordered assay',values:c.points.map(p=>p.value),connect:false}],[-2.4,2.4,8,14.5],'Theoretical normal quantile','Purity (mass %)',[{points:[[-2.4,r.intercept-2.4*r.slope],[2.4,r.intercept+2.4*r.slope]]}]);
  }else if(c.type==='bias-diagram'){
   drawings=xyPlot('Bias at the three reference levels',c.referenceValues,[{name:'Mean minus reference',values:c.biases,connect:false}],[0,100,-1,4],'Reference value (mm)','Bias (mm)',[{y:0,label:'Zero'}]);
  }else if(c.type==='oc-curve'){
   const xs=c.curves.map(r=>r.p*100);drawings=xyPlot('Operating characteristic curves',xs,c.plans.map((p,j)=>({name:p.label,values:c.curves.map(r=>r.acceptance[j]),dots:false,dashed:j===1})),[0,20,0,1],'Lot percent defective','P(accept)',[]);
   drawings+='<p class="mbbs3b5-legend">Solid: Plan A (n = 200, c = 10). Dashed: Plan B (n = 50, c = 2). Larger samples require more inspection.</p>';
  }else if(c.type==='multi-vari'){
   const X=x=>75+x*155,Y=y=>270-(y-9.8)/.4*220;let b=text(330,24,'Diameter observations by machine','middle')+text(16,43,'Diameter (mm)');
   [9.8,9.9,10,10.1,10.2].forEach(v=>b+=line(70,Y(v),620,Y(v),'mbbs3b5-grid')+text(59,Y(v)+5,num(v,2),'end'));
   c.groups.forEach((g,j)=>{b+=text(X(j+1),304,g.label,'middle');g.values.forEach((v,k)=>b+=dot(X(j+1)+(k-1.5)*13,Y(v),g.label+' observation '+(k+1)+': '+v+' mm','data-x="'+(j+1)+'" data-y="'+v+'"'));});drawings=svg(c.title,b);
  }else if(c.type==='boxplot'){
   const X=x=>65+x/12*550,y=146;let b=text(330,24,'Claims cycle time: Tukey boxplot','middle')+text(330,294,'Cycle time (days)','middle');
   for(let x=0;x<=12;x+=2)b+=line(X(x),224,X(x),230)+text(X(x),253,String(x),'middle');b+=line(X(0),224,X(12),224);
   b+=line(X(c.lowerWhisker),y,X(c.q1),y)+line(X(c.q3),y,X(c.upperWhisker),y)+line(X(c.lowerWhisker),y-20,X(c.lowerWhisker),y+20)+line(X(c.upperWhisker),y-20,X(c.upperWhisker),y+20);
   b+='<rect x="'+X(c.q1)+'" y="106" width="'+(X(c.q3)-X(c.q1))+'" height="80" class="mbbs3b5-box"/>'+line(X(c.median),106,X(c.median),186);
   b+=text(X(c.q1),93,'Q1 3.4','end')+text(X(c.q3),93,'Q3 5.1')+text(X(c.median),207,'Median 4.2','middle');
   c.outliers.forEach(v=>b+=dot(X(v),y,v+' days','data-x="'+v+'" data-y="0"'));drawings=svg(c.title,b,660,320);
  }else if(c.type==='precision-accuracy'){
   let b=text(330,23,'Repeated errors on the same coordinate scale','middle');
   c.panels.forEach((p,i)=>{const cx=i%2===0?170:490,cy=i<2?157:430;[40,80].forEach(r=>b+='<circle class="mbbs3b5-target" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>');b+=line(cx-92,cy,cx+92,cy,'mbbs3b5-grid')+line(cx,cy-92,cx,cy+92,'mbbs3b5-grid')+text(cx,cy-108,'Panel '+p.label,'middle')+text(cx,cy+115,'Reference = center; 1 unit = 10 px','middle');
    p.points.forEach((pt,j)=>b+=dot(cx+pt[0]*10,cy-pt[1]*10,'Panel '+p.label+' reading '+(j+1)+': errors ('+pt.join(', ')+')','data-panel="'+p.label+'" data-x="'+pt[0]+'" data-y="'+pt[1]+'"'));
   });drawings=svg(c.title,b,660,570);
  }else{throw new Error('Unsupported Batch 5 evidence type '+c.type);}
  return '<figure class="mbbs3b5-plot"><figcaption>'+esc(c.title)+'</figcaption><p>'+esc(c.altText)+'</p><p class="mbbs3b5-scroll-hint">Scroll or swipe horizontally to inspect the full-size figure. All plotted values are also in the table below.</p><div class="mbbs3b5-scroll" role="region" tabindex="0" aria-label="'+esc(c.title)+'; horizontally scrollable plot">'+drawings+'</div></figure>'+table(c.evidence);
 }
 function render(q,review){if(!isQuestion(q))return '';return '<div class="mbbs3b5-question"><div class="'+(review?'tb-review-stem':'tb-stem')+'" data-question-id="'+esc(q.qid)+'" tabindex="-1">'+esc(q.stem)+'</div>'+(q.chart?'<div class="mbbs3b5-evidence">'+(q.chart.type==='data-table'?table(q.chart):plot(q.chart))+'</div>':'')+'</div>';}
 function rationales(q){if(!isQuestion(q)||!Array.isArray(q.optionRationales))return '';return '<dl class="mbbs3b5-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';}
 let lastId='';
 function wire(host){const quiz=host.querySelector('.tb-quiz');if(!quiz||!ids.has(quiz.dataset.questionId)){lastId='';return;}
  quiz.querySelectorAll('[data-opt]').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('sel'))));
  quiz.querySelector('[data-flag]')?.setAttribute('aria-pressed',String(quiz.querySelector('[data-flag]').classList.contains('on')));
  quiz.querySelector('.tb-navcell.cur')?.setAttribute('aria-current','step');
  if(lastId!==quiz.dataset.questionId){lastId=quiz.dataset.questionId;requestAnimationFrame(()=>{if(!quiz.isConnected)return;const active=document.activeElement;if(active&&quiz.contains(active)&&active.matches('button,input,select,textarea,summary,[role="button"]'))return;quiz.scrollIntoView({block:'start',behavior:'instant'});quiz.querySelector('.tb-stem')?.focus({preventScroll:true});});}
 }
 if(global.document){
  const style=document.createElement('style');style.id='mbb-set3-batch5-style';style.textContent=`
.mbbs3b5-question,.mbbs3b5-evidence{min-width:0;max-width:100%;color:var(--ink);line-height:1.6}.mbbs3b5-evidence{margin:18px 0}.mbbs3b5-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line);border-radius:8px;background:var(--card)}.mbbs3b5-scroll:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.mbbs3b5-table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.55;color:var(--ink);background:var(--card)}.mbbs3b5-table:has(th:nth-child(4)){min-width:540px}.mbbs3b5-table caption,.mbbs3b5-plot figcaption{text-align:left;font-weight:650;padding:12px 14px;font-size:15px}.mbbs3b5-table th,.mbbs3b5-table td{text-align:left;vertical-align:top;white-space:normal;padding:12px 14px;border-bottom:1px solid var(--line);color:var(--ink)}.mbbs3b5-table thead{background:var(--tint)}.mbbs3b5-plot{margin:0}.mbbs3b5-plot svg{display:block;width:660px;min-width:660px;max-width:none;height:auto;margin:auto;color:var(--ink);background:var(--card)}.mbbs3b5-plot svg text{font:14px Arial,sans-serif;fill:currentColor}.mbbs3b5-grid{stroke:var(--line);stroke-width:1}.mbbs3b5-series{fill:none;stroke:var(--ink);stroke-width:2.5}.mbbs3b5-plot circle{fill:var(--card);stroke:var(--ink);stroke-width:2}.mbbs3b5-plot circle:focus{outline:3px solid var(--teal);outline-offset:4px}.mbbs3b5-rationales{font-size:14px;line-height:1.65;margin:16px 0 0;color:var(--ink)}.mbbs3b5-rationales dt{font-weight:650;margin-top:12px}.mbbs3b5-rationales dd{margin:4px 0 0}.tb-quiz:has(.mbbs3b5-question){scroll-margin-top:90px}.tb-quiz:has(.mbbs3b5-question) .tb-opt{min-height:48px;line-height:1.6}.tb-quiz:has(.mbbs3b5-question) .tb-opt:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.tb-quiz:has(.mbbs3b5-question) .tb-qtag{color:var(--ink)!important}.tb-review-card:has(.mbbs3b5-question){min-width:0;max-width:100%;box-sizing:border-box}.tb-review-card:has(.mbbs3b5-question) .tb-explanation-copy{overflow-wrap:anywhere;line-height:1.65;font-size:14px;color:var(--ink)!important}.tb-review-list:has(.mbbs3b5-question){grid-template-columns:minmax(0,1fr)}
.tb-quiz:has(.mbbs3b5-question) .tb-opt,.tb-quiz:has(.mbbs3b5-question) .tb-opt>span:not(.k){color:var(--ink)!important;transition:none}.tb-quiz:has(.mbbs3b5-question) .tb-opt .k{color:var(--ink)!important}.tb-quiz:has(.mbbs3b5-question) .tb-opt.sel .k{background:#0b5464!important;color:#fff!important}
.tb-quiz:has(.mbbs3b5-question) [data-next],.tb-quiz:has(.mbbs3b5-question) [data-submit],.tb-review-card:has(.mbbs3b5-question) [data-prepare-report]{background:#0b5464!important;color:#fff!important}.tb-quiz:has(.mbbs3b5-question) [data-flag].on{background:#7c4a00!important;border-color:#7c4a00!important;color:#fff!important}.tb-review-card:has(.mbbs3b5-question) .tb-quality-badge{color:var(--ink)!important;background:var(--tint)!important}
.tb-review-card:has(.mbbs3b5-question) .tb-report-box[hidden]{display:none!important}.tb-review-card:has(.mbbs3b5-question) .tb-distractor-analysis,.tb-review-card:has(.mbbs3b5-question) .tb-distractor-row p,.tb-review-card:has(.mbbs3b5-question) .tb-distractor-row small,.tb-review-card:has(.mbbs3b5-question) .tb-accuracy-note,.tb-review-card:has(.mbbs3b5-question) .tb-quality-details{color:var(--ink)!important;line-height:1.6}
.tb-review-card:has(.mbbs3b5-question) .tb-quality-details p,.tb-review-card:has(.mbbs3b5-question) .tb-quality-details ul{color:var(--ink)!important}
@media(max-width:560px){.tb-feedback-loop:has(.mbbs3b5-question){padding:12px}.tb-review-card:has(.mbbs3b5-question){padding:12px}.tb-review-card:has(.mbbs3b5-question) .tb-review-stem{font-size:15px;line-height:1.6}}

.mbbs3b5-table{min-width:560px}.mbbs3b5-scroll-hint{font-size:13px;line-height:1.6;color:var(--ink)!important;margin:8px 0}.mbbs3b5-table th,.mbbs3b5-table td{overflow-wrap:break-word}
.tb-review-card:has(.mbbs3b5-question) .tb-key-point,.tb-review-card:has(.mbbs3b5-question) .tb-exam-trap{overflow-wrap:anywhere;min-width:0}

.mbbs3b5-plot p{font-size:14px;line-height:1.6;white-space:normal;overflow-wrap:anywhere;color:var(--ink)}.mbbs3b5-axis,.mbbs3b5-reference{stroke:var(--ink);stroke-width:1.4;fill:none}.mbbs3b5-box{fill:var(--tint);stroke:var(--ink);stroke-width:2}.mbbs3b5-plot circle.mbbs3b5-target{fill:none;stroke:var(--ink);stroke-width:1.5;opacity:.55}.mbbs3b5-plot{margin:0 0 14px}.mbbs3b5-legend{padding:10px 18px;max-width:600px}

.mbbs3b5-plot svg:has(.mbbs3b5-target) .mbbs3b5-grid{stroke:var(--ink);opacity:.55}
`;document.head.appendChild(style);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-opt],[data-flag]'),q=b?.closest('.tb-quiz');if(!b||!q||!ids.has(q.dataset.questionId))return;const attr=b.hasAttribute('data-opt')?'data-opt':'data-flag',value=b.getAttribute(attr);setTimeout(()=>{if(b.isConnected)return;const now=document.querySelector('.tb-quiz');if(now?.dataset.questionId===q.dataset.questionId)now.querySelector('['+attr+'="'+value+'"]')?.focus({preventScroll:true});},0);},true);
 }
 global.__MBBSet3Batch5UI={isQuestion,render,rationales,wire};
})(window);

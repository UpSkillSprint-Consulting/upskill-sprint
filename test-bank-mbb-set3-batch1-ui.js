/* Set 3 canonical Q1–25 only. No answer key is exposed by the evidence renderer. */
(function(global){
 'use strict';
 const ids=new Set(['001','004','006','009','012','016','019','020','022','023','025','027','030','034','037','041','044','048','051','055','058','062','065','069','070'].map(s=>'mbb:set-3:d1-'+s));
 const isQuestion=q=>!!q&&ids.has(q.qid);
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function table(c){return '<div class="mbb3-scroll" role="region" tabindex="0" aria-label="'+esc(c.title)+'; scroll horizontally if needed"><table class="mbb3-table"><caption>'+esc(c.title)+'</caption><thead><tr>'+c.columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+c.rows.map(r=>'<tr>'+r.map((s,i)=>i===0?'<th scope="row">'+esc(s)+'</th>':'<td>'+esc(s)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
 function plot(c){
  const X=i=>80+i*145,Y=v=>260-v*9;
  let s='<figure class="mbb3-plot"><figcaption>'+esc(c.title)+'</figcaption><div class="mbb3-scroll" role="region" tabindex="0" aria-label="WIP chart; scroll horizontally for the full time axis"><svg viewBox="0 0 560 305" role="img" aria-label="'+esc(c.altText)+'">';
  [0,4,8,12,16,20,24].forEach(v=>{s+='<line x1="80" x2="515" y1="'+Y(v)+'" y2="'+Y(v)+'" class="mbb3-grid"/><text x="65" y="'+(Y(v)+5)+'" text-anchor="end">'+v+'</text>';});
  s+='<path class="mbb3-series" d="'+c.data.map((v,i)=>(i?'L':'M')+X(i)+' '+Y(v)).join(' ')+'"/>';
  c.data.forEach((v,i)=>{s+='<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="4" tabindex="0" role="img" aria-label="'+esc(c.labels[i]+': '+v+' projects')+'"><title>'+esc(c.labels[i]+': '+v+' projects')+'</title></circle><text x="'+X(i)+'" y="'+(Y(v)-12)+'" text-anchor="middle">'+v+'</text><text x="'+X(i)+'" y="282" text-anchor="middle">'+esc(c.labels[i])+'</text>';});
  return s+'<text x="298" y="302" text-anchor="middle">Quarter</text><text x="21" y="152" text-anchor="middle" transform="rotate(-90 21 152)">Projects in progress</text></svg></div></figure>';
 }
 function render(q,review){if(!isQuestion(q))return '';return '<div class="mbb3-question"><div class="'+(review?'tb-review-stem':'tb-stem')+'" data-question-id="'+esc(q.qid)+'" tabindex="-1">'+esc(q.stem)+'</div>'+(q.chart?'<div class="mbb3-evidence">'+(q.chart.type==='data-table'?table(q.chart):plot(q.chart))+'</div>':'')+'</div>';}
 function rationales(q){if(!isQuestion(q)||!Array.isArray(q.optionRationales))return '';return '<dl class="mbb3-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';}
 let lastId='';
 function wire(host){const quiz=host.querySelector('.tb-quiz');if(!quiz||!ids.has(quiz.dataset.questionId)){lastId='';return;}
  quiz.querySelectorAll('[data-opt]').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('sel'))));
  quiz.querySelector('[data-flag]')?.setAttribute('aria-pressed',String(quiz.querySelector('[data-flag]').classList.contains('on')));
  quiz.querySelector('.tb-navcell.cur')?.setAttribute('aria-current','step');
  if(lastId!==quiz.dataset.questionId){lastId=quiz.dataset.questionId;requestAnimationFrame(()=>{if(!quiz.isConnected)return;quiz.scrollIntoView({block:'start',behavior:'instant'});quiz.querySelector('.tb-stem')?.focus({preventScroll:true});});}
 }
 if(global.document){
  const style=document.createElement('style');style.id='mbb-set3-batch1-style';style.textContent=`
.mbb3-question,.mbb3-evidence{min-width:0;max-width:100%;color:var(--ink);line-height:1.6}.mbb3-evidence{margin:18px 0}.mbb3-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line);border-radius:8px;background:var(--card)}.mbb3-scroll:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.mbb3-table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.55;color:var(--ink);background:var(--card)}.mbb3-table:has(th:nth-child(4)){min-width:540px}.mbb3-table caption,.mbb3-plot figcaption{text-align:left;font-weight:650;padding:12px 14px;font-size:15px}.mbb3-table th,.mbb3-table td{text-align:left;vertical-align:top;white-space:normal;padding:12px 14px;border-bottom:1px solid var(--line);color:var(--ink)}.mbb3-table thead{background:var(--tint)}.mbb3-plot{margin:0}.mbb3-plot svg{display:block;width:560px;min-width:560px;max-width:none;height:auto;margin:auto;color:var(--ink);background:var(--card)}.mbb3-plot svg text{font:14px Arial,sans-serif;fill:currentColor}.mbb3-grid{stroke:var(--line);stroke-width:1}.mbb3-series{fill:none;stroke:var(--ink);stroke-width:2.5}.mbb3-plot circle{fill:var(--card);stroke:var(--ink);stroke-width:2}.mbb3-plot circle:focus{outline:3px solid var(--teal);outline-offset:4px}.mbb3-rationales{font-size:14px;line-height:1.65;margin:16px 0 0;color:var(--ink)}.mbb3-rationales dt{font-weight:650;margin-top:12px}.mbb3-rationales dd{margin:4px 0 0}.tb-quiz:has(.mbb3-question){scroll-margin-top:90px}.tb-quiz:has(.mbb3-question) .tb-opt{min-height:48px;line-height:1.6}.tb-quiz:has(.mbb3-question) .tb-opt:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.tb-quiz:has(.mbb3-question) .tb-qtag{color:var(--ink)!important}.tb-review-card:has(.mbb3-question){min-width:0;max-width:100%;box-sizing:border-box}.tb-review-card:has(.mbb3-question) .tb-explanation-copy{overflow-wrap:anywhere;line-height:1.65;font-size:14px;color:var(--ink)!important}.tb-review-list:has(.mbb3-question){grid-template-columns:minmax(0,1fr)}
.tb-quiz:has(.mbb3-question) [data-next],.tb-quiz:has(.mbb3-question) [data-submit],.tb-review-card:has(.mbb3-question) [data-prepare-report]{background:#0b5464!important;color:#fff!important}.tb-quiz:has(.mbb3-question) [data-flag].on{background:#7c4a00!important;border-color:#7c4a00!important;color:#fff!important}.tb-review-card:has(.mbb3-question) .tb-quality-badge{color:var(--ink)!important;background:var(--tint)!important}
@media(max-width:560px){.tb-feedback-loop:has(.mbb3-question){padding:12px}.tb-review-card:has(.mbb3-question){padding:12px}.tb-review-card:has(.mbb3-question) .tb-review-stem{font-size:15px;line-height:1.6}}
`;document.head.appendChild(style);
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-opt],[data-flag]'),q=b?.closest('.tb-quiz');if(!b||!q||!ids.has(q.dataset.questionId))return;const attr=b.hasAttribute('data-opt')?'data-opt':'data-flag',value=b.getAttribute(attr);setTimeout(()=>{const now=document.querySelector('.tb-quiz');if(now?.dataset.questionId===q.dataset.questionId)now.querySelector('['+attr+'="'+value+'"]')?.focus({preventScroll:true});},0);},true);
 }
 global.__MBBSet3Batch1UI={isQuestion,render,rationales,wire};
})(window);

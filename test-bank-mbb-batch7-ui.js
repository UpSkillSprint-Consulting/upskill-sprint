/* Scoped evidence renderer for MBB Set 2 Q151–175. Never reads an answer key. */
(function (global) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^mbb:set-2:original-1(5[1-9]|6[0-9]|7[0-5])$/.test(q.qid || '');
  const css = `
html[data-theme="dark"] .tb-quiz:has(.mbb7-conditions) .tb-qtag{color:var(--ink,#e2e8f0)!important}
.tb-review-list:has(.mbb7-conditions){min-width:0;grid-template-columns:minmax(0,1fr)}
.tb-review-card:has(.mbb7-conditions){min-width:0;max-width:100%;box-sizing:border-box}
.mbb7-evidence{max-width:100%;min-width:0;margin:20px 0;line-height:1.55;color:var(--ink,#16343e)}
.mbb7-evidence h4{font-size:17px;line-height:1.4;font-weight:650;margin:0 0 10px}
.mbb7-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line,#bcc9ce);border-radius:8px}
.mbb7-table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:700px;font-size:14px;line-height:1.55;text-align:left;background:var(--card,#fff)}
.mbb7-table caption{padding:10px 12px;font-weight:650;text-align:left}
.mbb7-evidence .mbb7-table th,.mbb7-evidence .mbb7-table td{font-size:14px;text-align:left;padding:12px 14px;vertical-align:top;border-bottom:1px solid var(--line,#bcc9ce);white-space:normal;overflow-wrap:break-word;word-break:normal}
.mbb7-table th{font-weight:650}.mbb7-table thead{background:var(--paper,#f3f6f7)}
.mbb7-evidence svg{display:block;width:720px;min-width:720px;max-width:none;height:auto;margin-inline:auto;background:var(--card,#fff);color:var(--ink,#16343e)}
.mbb7-evidence svg text{font:14px Arial,sans-serif;fill:currentColor}
.mbb7-grid{stroke:var(--line,#bdc9ce);stroke-width:1}.mbb7-axis{stroke:currentColor;stroke-width:1.5;fill:none}
.mbb7-series{stroke:var(--teal,#137c83);fill:none;stroke-width:2.5}.mbb7-second{stroke:currentColor;stroke-dasharray:7 5;fill:none;stroke-width:2.5}
.mbb7-evidence svg circle{fill:var(--card,#fff);stroke:currentColor;stroke-width:2}
.mbb7-evidence svg .mbb7-node{fill:var(--paper,#f3f6f7);stroke:currentColor;stroke-width:1.5}
.mbb7-evidence svg [tabindex]:focus{outline:3px solid var(--teal,#137c83);outline-offset:4px}
.mbb7-inspector{display:block;margin:12px 0 0;font-size:14px}.mbb7-inspector select{display:block;width:100%;min-height:44px;margin-top:5px;padding:8px;background:var(--card,#fff);color:inherit;border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}
.mbb7-readout{display:block;margin:8px 0;padding:10px 12px;min-height:44px;box-sizing:border-box;background:var(--paper,#f3f6f7);border-left:3px solid var(--teal,#137c83);font-size:14px}
.mbb7-evidence details{margin:10px 0}.mbb7-evidence summary{cursor:pointer;padding:10px 0;min-height:44px;box-sizing:border-box;font-weight:600;font-size:14px}
.mbb7-hint{font-size:13px;color:var(--muted,#49616b);margin:7px 0}
.mbb7-conditions{margin:12px 0;padding:14px 18px;border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px;line-height:1.6;background:var(--paper,#f3f6f7)}
.mbb7-conditions ul{margin:7px 0 0;padding-left:20px}.mbb7-conditions li{margin:5px 0}
.mbb7-rationales{margin:16px 0 0;font-size:14px;line-height:1.6}.mbb7-rationales dt{font-weight:650;margin-top:10px}.mbb7-rationales dd{margin:3px 0 0}
`;
  const extraCSS = '.mbb7-capacity{margin:14px 0;padding:12px;background:var(--paper,#f3f6f7);border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px}.mbb7-capacity label{display:block}.mbb7-capacity input{display:block;width:100%;min-height:44px}.mbb7-capacity button{min-height:44px;padding:8px 14px;margin-top:8px;color:inherit;background:var(--card,#fff);border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}.mbb7-capacity output{display:block;font-weight:600;padding:8px 0}';
  if (global.document && !document.getElementById('mbb7-evidence-style')) {
    const style = document.createElement('style'); style.id = 'mbb7-evidence-style'; style.textContent = css + extraCSS; document.head.appendChild(style);
  }
  function conditions(q) {
    if (!isQuestion(q) || !Array.isArray(q.assumptions) || !q.assumptions.length) return '';
    return '<section class="mbb7-conditions" aria-label="Stated conditions"><strong>Stated conditions</strong><ul>'+q.assumptions.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>';
  }
  function rationales(q) {
    if (!isQuestion(q) || !Array.isArray(q.optionRationales)) return '';
    return '<dl class="mbb7-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';
  }
  function table(columns, rows, caption) {
    const wide = ' style="min-width:'+(columns.length>=5?860:columns.length<=2?480:700)+'px"';
    return '<div class="mbb7-scroll" tabindex="0" role="region" aria-label="'+esc(caption)+'; scroll horizontally if needed"><table class="mbb7-table tb-q-data-table"'+wide+'><caption>'+esc(caption)+'</caption><thead><tr>'+columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>i===0?'<th scope="row">'+esc(v)+'</th>':'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const text=(x,y,s,other='')=>'<text x="'+x+'" y="'+y+'" '+other+'>'+esc(s)+'</text>';
  const line=(x1,y1,x2,y2,cls='mbb7-grid')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
  function svg(content,height,alt) {return '<div class="mbb7-scroll" tabindex="0" role="region" aria-label="Chart; scroll horizontally for the full range"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(alt)+'" viewBox="0 0 720 '+height+'">'+content+'</svg></div>';}
  const fmt = (v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
  function dots(points, staticMode) {
    return points.map((p,i)=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="5"'+(staticMode?'':' tabindex="0" role="button" data-mbb7-point="'+i+'" aria-label="'+esc(p.label)+'"')+'><title>'+esc(p.label)+'</title></circle>').join('');
  }
  function inspector(points) {
    return '<label class="mbb7-inspector">Inspect an observation<select data-mbb7-observation aria-label="Inspect an observation">'+points.map((p,i)=>'<option value="'+i+'">'+esc(p.label)+'</option>').join('')+'</select></label><output class="mbb7-readout" data-mbb7-readout aria-live="polite">'+esc(points[0].label)+'</output>';
  }
  const alternative=(cols,rows,caption,label="View the same evidence as a data table")=>'<details class="mbb7-data"><summary>'+esc(label)+'</summary>'+table(cols,rows,caption)+'</details>';
  function capacity(chart, staticMode) {
    if (!chart.whatIf) return '';
    if (staticMode) return '<p class="mbb7-hint">Scored capacity: ten Belt-months. Interactive what-if settings are omitted from this static version.</p>';
    const c = chart.whatIf;
    return '<section class="mbb7-capacity" aria-label="Capacity exploration"><strong>Scored case: 10 Belt-months</strong><p>Explore hypothetical capacity only. This does not change the question or its scored answer.</p><label>'+esc(c.label)+'<input type="range" data-mbb7-capacity min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="10" aria-label="Hypothetical available Belt-months"></label><output data-mbb7-capacity-output aria-live="polite">Hypothetical capacity: 10 Belt-months</output><button type="button" data-mbb7-reset>Reset to scored capacity (10)</button></section>';
  }
  function axes(xticks, yticks, xlabel, ylabel, opts={}) {
    const L=82,R=668,T=68,B=330;
    const X=v=>L+(v-xticks[0])/(xticks.at(-1)-xticks[0])*(R-L);
    const yd=opts.yDomain||[yticks[0],yticks.at(-1)];
    const Y=v=>B-(v-yd[0])/(yd[1]-yd[0])*(B-T);
    let out=text(18,26,ylabel);
    yticks.forEach(v=>{out+=line(L,Y(v),R,Y(v))+text(L-12,Y(v)+5,fmt(v),'text-anchor="end"');});
    xticks.forEach(v=>{out+=line(X(v),B,X(v),B+6,'mbb7-axis')+text(X(v),B+27,fmt(v),'text-anchor="middle"');});
    out+=line(L,T,L,B,'mbb7-axis')+line(L,B,R,B,'mbb7-axis')+text((L+R)/2,B+61,xlabel,'text-anchor="middle"');
    return {out,X,Y,L,R,T,B};
  }

  function multiTimeSeries(ch,staticMode) {
    const a=axes(ch.labels.map(Number),[0,20,40,60,80,100],ch.xLabel,ch.yLabel);let out=a.out;const points=[];
    ch.series.forEach((s,k)=>{
      const dash=['','8 5','2 5'][k];
      out+='<path class="mbb7-series" style="stroke-dasharray:'+dash+'" d="'+s.data.map((v,i)=>(i?'L':'M')+a.X(+ch.labels[i])+','+a.Y(v)).join(' ')+'"/>';
      s.data.forEach((v,i)=>points.push({x:a.X(+ch.labels[i]),y:a.Y(v),label:s.label+', week '+ch.labels[i]+': '+v+'%'}));
      out+='<path class="mbb7-series" style="stroke-dasharray:'+dash+'" d="M82 '+(422+k*29)+' H129"/>'+text(143,427+k*29,s.label);
    });out+=dots(points,staticMode);
    return svg(out,515,ch.altText)+(staticMode?'':inspector(points))+alternative(['Week',...ch.series.map(s=>s.label+' (%)')],ch.labels.map((v,i)=>[v,...ch.series.map(s=>s.data[i])]),'Supplied weekly percentages');
  }
  function regression(ch,staticMode){
    const a=axes(ch.xTicks,ch.yTicks,ch.xLabel,ch.yLabel);let out=a.out;const m=ch.model,p=ch.proposal,F=x=>m.intercept+m.slope*x;
    out+='<path class="mbb7-series" data-mbb7-fit="observed-range" d="M'+a.X(10)+','+a.Y(F(10))+' L'+a.X(70)+','+a.Y(F(70))+'"/>';
    out+='<path class="mbb7-second" data-mbb7-fit="beyond-range" d="M'+a.X(70)+','+a.Y(F(70))+' L'+a.X(p.x)+','+a.Y(p.mean)+'"/>';
    const points=ch.points.map(v=>({x:a.X(v.x),y:a.Y(v.y),label:'Observed: score '+v.x+', severity '+v.y+' ($000)'}));
    out+=dots(points,staticMode);
    const xx=a.X(p.x),yy=a.Y(p.mean),label='Unobserved proposal: score '+p.x+', fitted mean '+fmt(p.mean,3)+'; 95% mean interval '+fmt(p.meanCI[0],3)+' to '+fmt(p.meanCI[1],3)+' ($000)';
    out+='<g data-mbb7-mean-ci="true">'+line(xx,a.Y(p.meanCI[0]),xx,a.Y(p.meanCI[1]),'mbb7-axis')+line(xx-8,a.Y(p.meanCI[0]),xx+8,a.Y(p.meanCI[0]),'mbb7-axis')+line(xx-8,a.Y(p.meanCI[1]),xx+8,a.Y(p.meanCI[1]),'mbb7-axis')+'</g>';
    out+='<path d="M'+xx+','+(yy-7)+' l7,7 l-7,7 l-7,-7 Z" class="mbb7-axis"'+(staticMode?'':' tabindex="0" role="button" data-mbb7-point="8" aria-label="'+esc(label)+'"')+'><title>'+esc(label)+'</title></path>';
    points.push({x:xx,y:yy,label});
    out+=text(82,425,'Circles: observed cases. Diamond: unobserved proposal.')+text(82,452,'Solid line: fit within observed range. Dashed line: extension.')+text(82,479,'Vertical bar: conditional 95% interval for the mean at score 105.');
    const rows=ch.points.map(v=>['Observed',v.x,v.y]);rows.push(['Proposed fitted mean (not observed)',p.x,fmt(p.mean,4)]);
    return svg(out,503,ch.altText)+(staticMode?'':inspector(points))+alternative(['Value status','Policy-risk score','Claim severity ($000)'],rows,'Observed fitting data and unobserved proposal')+table(['Model output','Value'],[['Fitted line','y = '+fmt(m.intercept,6)+' + '+fmt(m.slope,6)+' x'],['Residual degrees of freedom',m.df],['95% mean-response interval at 105',fmt(p.meanCI[0],4)+' to '+fmt(p.meanCI[1],4)+' ($000)'],['95% individual prediction interval at 105',fmt(p.predictionInterval[0],4)+' to '+fmt(p.predictionInterval[1],4)+' ($000)']],'Conditional OLS output');
  }
  function mission(ch){
    const L=162,R=654,T=64,B=298,X=v=>L+v*(R-L);let out=text(18,28,'Endpoint probabilities; no lifetime curve assumed.');
    [0,.2,.4,.6,.8,1].forEach(v=>{out+=line(X(v),T,X(v),B)+text(X(v),B+28,fmt(v,1),'text-anchor="middle"');});
    ch.components.forEach((c,i)=>{const y=103+i*70;out+=text(L-14,y+5,c.label,'text-anchor="end"')+line(L,y,X(c.reliability),y,'mbb7-series')+'<circle cx="'+X(c.reliability)+'" cy="'+y+'" r="5"><title>'+esc(c.label+': '+c.reliability)+'</title></circle>'+text(X(c.reliability)-10,y-13,fmt(c.reliability,2),'text-anchor="end"');});
    out+=line(L,B,R,B,'mbb7-axis')+text((L+R)/2,B+65,ch.xLabel,'text-anchor="middle"');
    return svg(out,388,ch.altText)+table(['Subsystem','Reliability at the fixed mission endpoint'],ch.components.map(c=>[c.label,c.reliability]),'Supplied mission reliabilities');
  }
  function interaction(ch,staticMode){
    const a=axes([-1,1],ch.yTicks,'Factor A (coded −1 / +1)',ch.yLabel,{yDomain:ch.yDomain});let out=a.out;const points=[];
    [ch.lowLine,ch.highLine].forEach((s,k)=>{const cls=k?'mbb7-second':'mbb7-series';out+='<path class="'+cls+'" d="M'+a.X(-1)+','+a.Y(s[0])+' L'+a.X(1)+','+a.Y(s[1])+'"/>';s.forEach((v,i)=>points.push({x:a.X(i?1:-1),y:a.Y(v),label:(k?ch.highLabel:ch.lowLabel)+', A '+(i?'high (+1)':'low (−1)')+': '+v+' response units'}));out+=line(82,421+k*28,129,421+k*28,cls)+text(143,426+k*28,k?ch.highLabel+' (dashed)':ch.lowLabel+' (solid)');});
    out+=dots(points,staticMode);
    return svg(out,480,ch.altText)+(staticMode?'':inspector(points))+alternative(['B level','A low (−1) mean','A high (+1) mean'],[[ch.lowLabel,...ch.lowLine],[ch.highLabel,...ch.highLine]],'Supplied two-run cell means','View the plotted cell means')+alternative(['Run (standard listing)','A','B','C','D'],ch.designRows.map((r,i)=>[i+1,...r]),'Original coded fraction; listing is not the randomized execution order','View the coded eight-run design');
  }
  function render(ch,staticMode=false){
    if(!ch||ch.auditBatch!==7||!isQuestion({qid:ch.auditId}))return '';
    let content='';
    if(ch.type==='data-table')content=table(ch.columns,ch.rows,'Case evidence')+capacity(ch,staticMode);
    else if(ch.type==='multi-time-series')content=multiTimeSeries(ch,staticMode);
    else if(ch.type==='regression-diagnostic')content=regression(ch,staticMode);
    else if(ch.type==='reliability-plot')content=mission(ch);
    else if(ch.type==='two-level-interaction')content=interaction(ch,staticMode);
    else return '';
    return '<section class="mbb7-evidence tb-q-chart-wrap" data-mbb7-chart="'+esc(ch.auditId)+'" aria-label="Question evidence">'+(ch.title?'<h4>'+esc(ch.title)+'</h4>':'')+content+'<p class="mbb7-hint">Wide evidence scrolls horizontally without shrinking its labels.</p></section>';
  }
  function inspect(el,index) {
    const scope=el.closest('.mbb7-evidence');if(!scope)return;
    const select=scope.querySelector('[data-mbb7-observation]'),output=scope.querySelector('[data-mbb7-readout]');
    if(!select||!output||!select.options[index])return;select.value=String(index);output.textContent=select.options[index].textContent;
  }
  function capacityValue(el,reset=false){
    const scope=el.closest('.mbb7-capacity');if(!scope)return;
    const input=scope.querySelector('[data-mbb7-capacity]'),output=scope.querySelector('[data-mbb7-capacity-output]');
    if(!input||!output)return;if(reset)input.value='10';output.textContent='Hypothetical capacity: '+input.value+' Belt-months';
  }
  if(global.document){
    document.addEventListener('change',e=>{if(e.target.matches('[data-mbb7-observation]'))inspect(e.target,Number(e.target.value));});
    document.addEventListener('focusin',e=>{if(e.target.matches('[data-mbb7-point]'))inspect(e.target,Number(e.target.dataset.mbb7Point));});
    document.addEventListener('click',e=>{if(e.target.matches('[data-mbb7-point]'))inspect(e.target,Number(e.target.dataset.mbb7Point));if(e.target.matches('[data-mbb7-reset]'))capacityValue(e.target,true);});
    document.addEventListener('keydown',e=>{if(e.target.matches('[data-mbb7-point]')&&['Enter',' '].includes(e.key)){e.preventDefault();inspect(e.target,Number(e.target.dataset.mbb7Point));}});
    document.addEventListener('input',e=>{if(e.target.matches('[data-mbb7-capacity]'))capacityValue(e.target);});
  }
  global.__MBBBatch7UI={isQuestion,conditions,rationales,render,css:css+extraCSS};
})(window);

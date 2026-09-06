/* Scoped evidence renderer for MBB Set 2 Q126–150. Never reads an answer key. */
(function (global) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^mbb:set-2:original-1(2[6-9]|[34][0-9]|50)$/.test(q.qid || '');
  const css = `
html[data-theme="dark"] .tb-quiz:has(.mbb6-conditions) .tb-qtag{color:var(--ink,#e2e8f0)!important}
.tb-review-list:has(.mbb6-conditions){min-width:0;grid-template-columns:minmax(0,1fr)}
.tb-review-card:has(.mbb6-conditions){min-width:0;max-width:100%;box-sizing:border-box}
.mbb6-evidence{max-width:100%;min-width:0;margin:20px 0;line-height:1.55;color:var(--ink,#16343e)}
.mbb6-evidence h4{font-size:17px;line-height:1.4;font-weight:650;margin:0 0 10px}
.mbb6-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line,#bcc9ce);border-radius:8px}
.mbb6-table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:700px;font-size:14px;line-height:1.55;text-align:left;background:var(--card,#fff)}
.mbb6-table caption{padding:10px 12px;font-weight:650;text-align:left}
.mbb6-evidence .mbb6-table th,.mbb6-evidence .mbb6-table td{font-size:14px;text-align:left;padding:12px 14px;vertical-align:top;border-bottom:1px solid var(--line,#bcc9ce);white-space:normal;overflow-wrap:break-word;word-break:normal}
.mbb6-table th{font-weight:650}.mbb6-table thead{background:var(--paper,#f3f6f7)}
.mbb6-evidence svg{display:block;width:720px;min-width:720px;max-width:none;height:auto;margin-inline:auto;background:var(--card,#fff);color:var(--ink,#16343e)}
.mbb6-evidence svg text{font:14px Arial,sans-serif;fill:currentColor}
.mbb6-grid{stroke:var(--line,#bdc9ce);stroke-width:1}.mbb6-axis{stroke:currentColor;stroke-width:1.5;fill:none}
.mbb6-series{stroke:var(--teal,#137c83);fill:none;stroke-width:2.5}.mbb6-second{stroke:currentColor;stroke-dasharray:7 5;fill:none;stroke-width:2.5}
.mbb6-evidence svg circle{fill:var(--card,#fff);stroke:currentColor;stroke-width:2}
.mbb6-evidence svg .mbb6-node{fill:var(--paper,#f3f6f7);stroke:currentColor;stroke-width:1.5}
.mbb6-evidence svg [tabindex]:focus{outline:3px solid var(--teal,#137c83);outline-offset:4px}
.mbb6-inspector{display:block;margin:12px 0 0;font-size:14px}.mbb6-inspector select{display:block;width:100%;min-height:44px;margin-top:5px;padding:8px;background:var(--card,#fff);color:inherit;border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}
.mbb6-readout{display:block;margin:8px 0;padding:10px 12px;min-height:44px;box-sizing:border-box;background:var(--paper,#f3f6f7);border-left:3px solid var(--teal,#137c83);font-size:14px}
.mbb6-evidence details{margin:10px 0}.mbb6-evidence summary{cursor:pointer;padding:10px 0;min-height:44px;box-sizing:border-box;font-weight:600;font-size:14px}
.mbb6-hint{font-size:13px;color:var(--muted,#49616b);margin:7px 0}
.mbb6-conditions{margin:12px 0;padding:14px 18px;border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px;line-height:1.6;background:var(--paper,#f3f6f7)}
.mbb6-conditions ul{margin:7px 0 0;padding-left:20px}.mbb6-conditions li{margin:5px 0}
.mbb6-rationales{margin:16px 0 0;font-size:14px;line-height:1.6}.mbb6-rationales dt{font-weight:650;margin-top:10px}.mbb6-rationales dd{margin:3px 0 0}
`;
  const extraCSS = '.mbb6-capacity{margin:14px 0;padding:12px;background:var(--paper,#f3f6f7);border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px}.mbb6-capacity label{display:block}.mbb6-capacity input{display:block;width:100%;min-height:44px}.mbb6-capacity button{min-height:44px;padding:8px 14px;margin-top:8px;color:inherit;background:var(--card,#fff);border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}.mbb6-capacity output{display:block;font-weight:600;padding:8px 0}';
  if (global.document && !document.getElementById('mbb6-evidence-style')) {
    const style = document.createElement('style'); style.id = 'mbb6-evidence-style'; style.textContent = css + extraCSS; document.head.appendChild(style);
  }
  function conditions(q) {
    if (!isQuestion(q) || !Array.isArray(q.assumptions) || !q.assumptions.length) return '';
    return '<section class="mbb6-conditions" aria-label="Stated conditions"><strong>Stated conditions</strong><ul>'+q.assumptions.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>';
  }
  function rationales(q) {
    if (!isQuestion(q) || !Array.isArray(q.optionRationales)) return '';
    return '<dl class="mbb6-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';
  }
  function table(columns, rows, caption) {
    const wide = columns.length >= 6 ? ' style="min-width:920px"' : '';
    return '<div class="mbb6-scroll" tabindex="0" role="region" aria-label="'+esc(caption)+'; scroll horizontally if needed"><table class="mbb6-table tb-q-data-table"'+wide+'><caption>'+esc(caption)+'</caption><thead><tr>'+columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>i===0?'<th scope="row">'+esc(v)+'</th>':'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const text=(x,y,s,other='')=>'<text x="'+x+'" y="'+y+'" '+other+'>'+esc(s)+'</text>';
  const line=(x1,y1,x2,y2,cls='mbb6-grid')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
  function svg(content,height,alt) {return '<div class="mbb6-scroll" tabindex="0" role="region" aria-label="Chart; scroll horizontally for the full range"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(alt)+'" viewBox="0 0 720 '+height+'">'+content+'</svg></div>';}
  const fmt = (v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
  function dots(points, staticMode) {
    return points.map((p,i)=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="5"'+(staticMode?'':' tabindex="0" role="button" data-mbb6-point="'+i+'" aria-label="'+esc(p.label)+'"')+'><title>'+esc(p.label)+'</title></circle>').join('');
  }
  function inspector(points) {
    return '<label class="mbb6-inspector">Inspect an observation<select data-mbb6-observation aria-label="Inspect an observation">'+points.map((p,i)=>'<option value="'+i+'">'+esc(p.label)+'</option>').join('')+'</select></label><output class="mbb6-readout" data-mbb6-readout aria-live="polite">'+esc(points[0].label)+'</output>';
  }
  const alternative=(cols,rows,caption)=>'<details class="mbb6-data"><summary>View the same evidence as a data table</summary>'+table(cols,rows,caption)+'</details>';
  function capacity(chart, staticMode) {
    if (!chart.whatIf) return '';
    if (staticMode) return '<p class="mbb6-hint">Scored capacity: ten Belt-months. Interactive what-if settings are omitted from this static version.</p>';
    const c = chart.whatIf;
    return '<section class="mbb6-capacity" aria-label="Capacity exploration"><strong>Scored case: 10 Belt-months</strong><p>Explore hypothetical capacity only. This does not change the question or its scored answer.</p><label>'+esc(c.label)+'<input type="range" data-mbb6-capacity min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="10" aria-label="Hypothetical available Belt-months"></label><output data-mbb6-capacity-output aria-live="polite">Hypothetical capacity: 10 Belt-months</output><button type="button" data-mbb6-reset>Reset to scored capacity (10)</button></section>';
  }
  function axes(xticks, yticks, xlabel, ylabel, opts={}) {
    const L=82,R=668,T=68,B=330;
    const X=v=>L+(v-xticks[0])/(xticks.at(-1)-xticks[0])*(R-L);
    const Y=v=>B-(v-yticks[0])/(yticks.at(-1)-yticks[0])*(B-T);
    let out=text(18,26,ylabel);
    yticks.forEach(v=>{out+=line(L,Y(v),R,Y(v))+text(L-12,Y(v)+5,fmt(v),'text-anchor="end"');});
    xticks.forEach(v=>{out+=line(X(v),B,X(v),B+6,'mbb6-axis')+text(X(v),B+27,fmt(v),'text-anchor="middle"');});
    out+=line(L,T,L,B,'mbb6-axis')+line(L,B,R,B,'mbb6-axis')+text((L+R)/2,B+61,xlabel,'text-anchor="middle"');
    return {out,X,Y,L,R,T,B};
  }
  function multiTimeSeries(chart,staticMode) {
    const {out:base,X,Y,L,R,T,B}=axes(chart.labels.map(Number),[0,20,40,60,80,100],chart.xLabel,chart.yLabel);
    let out=base+line(X(chart.referenceValue),T,X(chart.referenceValue),B,'mbb6-second')+text(L,50,chart.referenceLabel);
    const points=[];
    chart.series.forEach((series,k)=>{
      const klass=k?'mbb6-second':'mbb6-series';
      out+='<path class="'+klass+'" d="'+series.data.map((v,i)=>(i?'L':'M')+X(Number(chart.labels[i]))+','+Y(v)).join(' ')+'"/>';
      series.data.forEach((v,i)=>points.push({x:X(Number(chart.labels[i])),y:Y(v),label:series.label+', week '+chart.labels[i]+': '+fmt(v)+'%'}));
      out+=line(82,421+k*28,129,421+k*28,klass)+text(145,426+k*28,series.label+(k?' (dashed)':' (solid)'));
    });
    out+=dots(points,staticMode);
    return svg(out,480,chart.altText)+(staticMode?'':inspector(points))+alternative(['Week',...chart.series.map(x=>x.label+' (%)')],chart.labels.map((v,i)=>[v,...chart.series.map(s=>s.data[i])]),'Supplied weekly percentages');
  }
  function acf(chart,staticMode) {
    const {out:base,X,Y,L,R,T,B}=axes(chart.lags,[-1,-.5,0,.5,1],chart.xLabel,chart.yLabel);let out=base;
    [chart.confidence,-chart.confidence].forEach(v=>out+=line(L,Y(v),R,Y(v),'mbb6-second'));
    out+=line(L,Y(0),R,Y(0),'mbb6-axis')+text(L,50,'Approximate pointwise reference: ±'+fmt(chart.confidence,2)+' (n = '+chart.sampleSize+')');
    const points=chart.lags.map((v,i)=>({x:X(v),y:Y(chart.values[i]),label:'Monthly lag '+v+': residual ACF '+fmt(chart.values[i])}));
    points.forEach(p=>out+=line(p.x,Y(0),p.x,p.y,'mbb6-series'));out+=dots(points,staticMode);
    return svg(out,415,chart.altText)+(staticMode?'':inspector(points))+alternative(['Monthly lag','Residual autocorrelation'],chart.lags.map((v,i)=>[v,chart.values[i]]),'Supplied residual ACF values')+'<p class="mbb6-hint">Pointwise white-noise reference bands are not simultaneous bounds or a fitted-model joint test.</p>';
  }
  // Equal-unit axes and a rotated ellipse derived from the symmetric quadratic form.
  // This renderer consumes geometry supplied with the evidence, never a stored answer.
  function contourPoints(chart,contour,n=360){
    const theta=contour.angleDegrees*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta);
    return Array.from({length:n+1},(_,i)=>{const t=2*Math.PI*i/n,u=contour.radiusX*Math.cos(t),v=contour.radiusY*Math.sin(t);return [chart.center[0]+c*u-s*v,chart.center[1]+s*u+c*v];});
  }
  function response(chart,a,b){const Q=chart.quadraticMatrix;return chart.intercept+chart.linearCoefficients[0]*a+chart.linearCoefficients[1]*b+Q[0][0]*a*a+2*Q[0][1]*a*b+Q[1][1]*b*b;}
  function contour(chart){
    const L=88,R=584,T=70,B=566,scale=(R-L)/(chart.xDomain[1]-chart.xDomain[0]);
    const X=v=>L+(v-chart.xDomain[0])*scale,Y=v=>B-(v-chart.yDomain[0])*scale;
    const clip='mbb6-clip-'+chart.auditId.replace(/:/g,'-');
    let out=text(18,26,chart.yLabel)+'<defs><clipPath id="'+clip+'"><rect x="'+L+'" y="'+T+'" width="'+(R-L)+'" height="'+(B-T)+'"/></clipPath></defs>';
    chart.yTicks.forEach(v=>out+=line(L,Y(v),R,Y(v))+text(L-12,Y(v)+5,fmt(v),'text-anchor="end"'));
    chart.xTicks.forEach(v=>out+=line(X(v),T,X(v),B)+text(X(v),B+27,fmt(v),'text-anchor="middle"'));
    out+=line(L,T,L,B,'mbb6-axis')+line(L,B,R,B,'mbb6-axis')+text((L+R)/2,B+62,chart.xLabel,'text-anchor="middle"')+text(606,85,'Yield (%)');
    chart.contours.forEach((c,k)=>{
      const dash=['','10 4','3 4','12 4 3 4'][k];
      out+='<path data-mbb6-contour-level="'+c.level+'" clip-path="url(#'+clip+')" class="mbb6-series" style="stroke-dasharray:'+dash+'" d="'+contourPoints(chart,c).map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(6)+','+Y(p[1]).toFixed(6)).join(' ')+' Z"/>';
      out+='<path class="mbb6-series" style="stroke-dasharray:'+dash+'" d="M606 '+(116+k*44)+' H651"/>'+text(660,121+k*44,c.level);
    });
    out+='<circle cx="'+X(chart.current.x)+'" cy="'+Y(chart.current.y)+'" r="5"><title>Current setting: A=0, B=0</title></circle><circle cx="615" cy="323" r="5"/>'+text(606,350,'Current')+text(606,371,'(0, 0)');
    out+=text(L,661,'Equal distance per coded unit on both axes; contours clipped to the shown region.');
    const coords=[-1.5,0,1.5],rows=coords.flatMap(a=>coords.map(b=>[a,b,fmt(response(chart,a,b),2)]));
    return svg(out,684,chart.altText)+alternative(['A (coded)','B (coded)','Fitted yield (%)'],rows,'Model values on a reference grid');
  }
  function network(chart) {
    const pos={A:[86,166],B:[269,76],C:[269,273],D:[456,76],E:[635,166]},w=130,h=66;
    const id='mbb6-arrow-'+esc(chart.auditId.replace(/:/g,'-'));
    let out='<defs><marker id="'+id+'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker></defs>';
    chart.edges.forEach(([a,b])=>{
      const A=pos[a],B=pos[b],x1=A[0]+w/2,x2=B[0]-w/2,m=(x1+x2)/2;
      out+='<path d="M'+x1+','+A[1]+' H'+m+' V'+B[1]+' H'+(x2-3)+'" class="mbb6-axis" marker-end="url(#'+id+')"/>';
    });
    Object.entries(chart.nodes).forEach(([id,n])=>{
      const [x,y]=pos[id];out+='<rect class="mbb6-node" x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="8"/>'+text(x,y-8,id,'text-anchor="middle"')+text(x,y+18,n.dur+' weeks','text-anchor="middle"');
    });
    out+=text(20,335,'All durations: working weeks. Arrows: finish-to-start, zero lag.');
    return svg(out,358,chart.altText)+alternative(['Activity','Duration (working weeks)','Predecessors'],Object.entries(chart.nodes).map(([id,n])=>[id,n.dur,chart.edges.filter(e=>e[1]===id).map(e=>e[0]).join(', ')||'None']),'Network dependencies');
  }
  function render(chart,staticMode=false) {
    if(!chart || chart.auditBatch!==6 || !isQuestion({qid:chart.auditId}))return '';
    let content='';
    if(chart.type==='data-table')content=table(chart.columns,chart.rows,'Case evidence')+capacity(chart,staticMode);
    else if(chart.type==='multi-time-series')content=multiTimeSeries(chart,staticMode);
    else if(chart.type==='activity-network')content=network(chart);
    else if(chart.type==='contour-plot')content=contour(chart);
    else if(chart.type==='acf-plot')content=acf(chart,staticMode);
    else return '';
    return '<section class="mbb6-evidence tb-q-chart-wrap" data-mbb6-chart="'+esc(chart.auditId)+'" aria-label="Question evidence">'+(chart.title?'<h4>'+esc(chart.title)+'</h4>':'')+content+'<p class="mbb6-hint">Wide evidence scrolls horizontally without shrinking its labels.</p></section>';
  }
  function inspect(el,index) {
    const scope=el.closest('.mbb6-evidence');if(!scope)return;
    const select=scope.querySelector('[data-mbb6-observation]'),output=scope.querySelector('[data-mbb6-readout]');
    if(!select||!output||!select.options[index])return;select.value=String(index);output.textContent=select.options[index].textContent;
  }
  function capacityValue(el,reset=false){
    const scope=el.closest('.mbb6-capacity');if(!scope)return;
    const input=scope.querySelector('[data-mbb6-capacity]'),output=scope.querySelector('[data-mbb6-capacity-output]');
    if(!input||!output)return;if(reset)input.value='10';output.textContent='Hypothetical capacity: '+input.value+' Belt-months';
  }
  if(global.document){
    document.addEventListener('change',e=>{if(e.target.matches('[data-mbb6-observation]'))inspect(e.target,Number(e.target.value));});
    document.addEventListener('focusin',e=>{if(e.target.matches('[data-mbb6-point]'))inspect(e.target,Number(e.target.dataset.mbb6Point));});
    document.addEventListener('click',e=>{if(e.target.matches('[data-mbb6-point]'))inspect(e.target,Number(e.target.dataset.mbb6Point));if(e.target.matches('[data-mbb6-reset]'))capacityValue(e.target,true);});
    document.addEventListener('keydown',e=>{if(e.target.matches('[data-mbb6-point]')&&['Enter',' '].includes(e.key)){e.preventDefault();inspect(e.target,Number(e.target.dataset.mbb6Point));}});
    document.addEventListener('input',e=>{if(e.target.matches('[data-mbb6-capacity]'))capacityValue(e.target);});
  }
  global.__MBBBatch6UI={isQuestion,conditions,rationales,render,contourPoints,response,css:css+extraCSS};
})(window);

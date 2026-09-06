/* Scoped evidence renderer for MBB Set 2 Q101–125. Never reads an answer key. */
(function (global) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^mbb:set-2:original-1(0[1-9]|1[0-9]|2[0-5])$/.test(q.qid || '');
  const css = `
html[data-theme="dark"] .tb-quiz:has(.mbb5-conditions) .tb-qtag{color:var(--ink,#e2e8f0)!important}
.tb-review-list:has(.mbb5-conditions){min-width:0;grid-template-columns:minmax(0,1fr)}
.tb-review-card:has(.mbb5-conditions){min-width:0;max-width:100%;box-sizing:border-box}
.mbb5-evidence{max-width:100%;min-width:0;margin:20px 0;line-height:1.55;color:var(--ink,#16343e)}
.mbb5-evidence h4{font-size:17px;line-height:1.4;font-weight:650;margin:0 0 10px}
.mbb5-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line,#bcc9ce);border-radius:8px}
.mbb5-table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:700px;font-size:14px;line-height:1.55;text-align:left;background:var(--card,#fff)}
.mbb5-table caption{padding:10px 12px;font-weight:650;text-align:left}
.mbb5-evidence .mbb5-table th,.mbb5-evidence .mbb5-table td{font-size:14px;text-align:left;padding:12px 14px;vertical-align:top;border-bottom:1px solid var(--line,#bcc9ce);white-space:normal;overflow-wrap:break-word;word-break:normal}
.mbb5-table th{font-weight:650}.mbb5-table thead{background:var(--paper,#f3f6f7)}
.mbb5-evidence svg{display:block;width:720px;min-width:720px;max-width:none;height:auto;margin-inline:auto;background:var(--card,#fff);color:var(--ink,#16343e)}
.mbb5-evidence svg text{font:14px Arial,sans-serif;fill:currentColor}
.mbb5-grid{stroke:var(--line,#bdc9ce);stroke-width:1}.mbb5-axis{stroke:currentColor;stroke-width:1.5;fill:none}
.mbb5-series{stroke:var(--teal,#137c83);fill:none;stroke-width:2.5}.mbb5-second{stroke:currentColor;stroke-dasharray:7 5;fill:none;stroke-width:2.5}
.mbb5-evidence svg circle{fill:var(--card,#fff);stroke:currentColor;stroke-width:2}
.mbb5-evidence svg .mbb5-node{fill:var(--paper,#f3f6f7);stroke:currentColor;stroke-width:1.5}
.mbb5-evidence svg [tabindex]:focus{outline:3px solid var(--teal,#137c83);outline-offset:4px}
.mbb5-inspector{display:block;margin:12px 0 0;font-size:14px}.mbb5-inspector select{display:block;width:100%;min-height:44px;margin-top:5px;padding:8px;background:var(--card,#fff);color:inherit;border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}
.mbb5-readout{display:block;margin:8px 0;padding:10px 12px;min-height:44px;box-sizing:border-box;background:var(--paper,#f3f6f7);border-left:3px solid var(--teal,#137c83);font-size:14px}
.mbb5-evidence details{margin:10px 0}.mbb5-evidence summary{cursor:pointer;padding:10px 0;min-height:44px;box-sizing:border-box;font-weight:600;font-size:14px}
.mbb5-hint{font-size:13px;color:var(--muted,#49616b);margin:7px 0}
.mbb5-conditions{margin:12px 0;padding:14px 18px;border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px;line-height:1.6;background:var(--paper,#f3f6f7)}
.mbb5-conditions ul{margin:7px 0 0;padding-left:20px}.mbb5-conditions li{margin:5px 0}
.mbb5-rationales{margin:16px 0 0;font-size:14px;line-height:1.6}.mbb5-rationales dt{font-weight:650;margin-top:10px}.mbb5-rationales dd{margin:3px 0 0}
`;
  const extraCSS = '.mbb5-capacity{margin:14px 0;padding:12px;background:var(--paper,#f3f6f7);border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px}.mbb5-capacity label{display:block}.mbb5-capacity input{display:block;width:100%;min-height:44px}.mbb5-capacity button{min-height:44px;padding:8px 14px;margin-top:8px;color:inherit;background:var(--card,#fff);border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}.mbb5-capacity output{display:block;font-weight:600;padding:8px 0}';
  if (global.document && !document.getElementById('mbb5-evidence-style')) {
    const style = document.createElement('style'); style.id = 'mbb5-evidence-style'; style.textContent = css + extraCSS; document.head.appendChild(style);
  }
  function conditions(q) {
    if (!isQuestion(q) || !Array.isArray(q.assumptions) || !q.assumptions.length) return '';
    return '<section class="mbb5-conditions" aria-label="Stated conditions"><strong>Stated conditions</strong><ul>'+q.assumptions.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>';
  }
  function rationales(q) {
    if (!isQuestion(q) || !Array.isArray(q.optionRationales)) return '';
    return '<dl class="mbb5-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';
  }
  function table(columns, rows, caption) {
    const wide = columns.length >= 6 ? ' style="min-width:920px"' : '';
    return '<div class="mbb5-scroll" tabindex="0" role="region" aria-label="'+esc(caption)+'; scroll horizontally if needed"><table class="mbb5-table tb-q-data-table"'+wide+'><caption>'+esc(caption)+'</caption><thead><tr>'+columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>i===0?'<th scope="row">'+esc(v)+'</th>':'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const text=(x,y,s,other='')=>'<text x="'+x+'" y="'+y+'" '+other+'>'+esc(s)+'</text>';
  const line=(x1,y1,x2,y2,cls='mbb5-grid')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
  function svg(content,height,alt) {return '<div class="mbb5-scroll" tabindex="0" role="region" aria-label="Chart; scroll horizontally for the full range"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(alt)+'" viewBox="0 0 720 '+height+'">'+content+'</svg></div>';}
  const fmt = (v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
  function dots(points, staticMode) {
    return points.map((p,i)=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="5"'+(staticMode?'':' tabindex="0" role="button" data-mbb5-point="'+i+'" aria-label="'+esc(p.label)+'"')+'><title>'+esc(p.label)+'</title></circle>').join('');
  }
  function inspector(points) {
    return '<label class="mbb5-inspector">Inspect an observation<select data-mbb5-observation aria-label="Inspect an observation">'+points.map((p,i)=>'<option value="'+i+'">'+esc(p.label)+'</option>').join('')+'</select></label><output class="mbb5-readout" data-mbb5-readout aria-live="polite">'+esc(points[0].label)+'</output>';
  }
  const alternative=(cols,rows,caption)=>'<details class="mbb5-data"><summary>View the same evidence as a data table</summary>'+table(cols,rows,caption)+'</details>';
  function capacity(chart, staticMode) {
    if (!chart.whatIf) return '';
    if (staticMode) return '<p class="mbb5-hint">Scored capacity: nine Belt-months. Interactive what-if settings are omitted from this static version.</p>';
    const c = chart.whatIf;
    return '<section class="mbb5-capacity" aria-label="Capacity exploration"><strong>Scored case: 9 Belt-months</strong><p>Explore hypothetical capacity only. This does not change the question or its scored answer.</p><label>'+esc(c.label)+'<input type="range" data-mbb5-capacity min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="9" aria-label="Hypothetical available Belt-months"></label><output data-mbb5-capacity-output aria-live="polite">Hypothetical capacity: 9 Belt-months</output><button type="button" data-mbb5-reset>Reset to scored capacity (9)</button></section>';
  }
  function axes(xticks, yticks, xlabel, ylabel, opts={}) {
    const L=82,R=668,T=68,B=330;
    const X=v=>L+(v-xticks[0])/(xticks.at(-1)-xticks[0])*(R-L);
    const Y=v=>B-(v-yticks[0])/(yticks.at(-1)-yticks[0])*(B-T);
    let out=text(18,26,ylabel);
    yticks.forEach(v=>{out+=line(L,Y(v),R,Y(v))+text(L-12,Y(v)+5,fmt(v),'text-anchor="end"');});
    xticks.forEach(v=>{out+=line(X(v),B,X(v),B+6,'mbb5-axis')+text(X(v),B+27,fmt(v),'text-anchor="middle"');});
    out+=line(L,T,L,B,'mbb5-axis')+line(L,B,R,B,'mbb5-axis')+text((L+R)/2,B+61,xlabel,'text-anchor="middle"');
    return {out,X,Y,L,R,T,B};
  }
  function xyChart(chart,staticMode) {
    const multi=chart.type==='multi-time-series',survival=chart.type==='reliability-plot';
    const xticks=multi?chart.labels.map(Number):chart.xTicks;
    const yticks=multi?[0,30,60,90,120,150,180]:survival?[0,.2,.4,.6,.8,1]:chart.yTicks;
    let {out,X,Y,L,R,T,B}=axes(xticks,yticks,chart.xLabel,chart.yLabel);
    if(multi || survival){
      const v=multi?chart.referenceValue:chart.missionTime;
      out+=line(X(v),T,X(v),B,'mbb5-second')+text(L,50,multi?'Rule change: start of Week 5':'Reported crossing: 1,200 hours');
    } else out+=line(L,Y(0),R,Y(0),'mbb5-axis');
    const series=multi?chart.series.map(s=>({label:s.label,values:s.data.map((v,i)=>[Number(chart.labels[i]),v])})):survival?chart.series.map(s=>({label:s.label,values:s.points})):[{label:'Selected case',values:chart.points.map(p=>[p.fitted,p.residual])}];
    const points=[];
    series.forEach((s,k)=>{
      const klass=k?'mbb5-second':'mbb5-series';
      if(multi||survival)out+='<path class="'+klass+'" d="'+s.values.map((v,i)=>(i?'L':'M')+X(v[0])+','+Y(v[1])).join(' ')+'"/>';
      s.values.forEach((v,i)=>points.push({x:X(v[0]),y:Y(v[1]),label:multi?s.label+', week '+v[0]+': '+fmt(v[1])+' units':survival?s.label+', '+fmt(v[0])+' hours: survival '+fmt(v[1]):'Case '+(i+1)+', fitted loss $'+fmt(v[0])+' thousand: standardized residual '+fmt(v[1])}));
      if(multi||survival)out+=line(82,421+k*28,129,421+k*28,klass)+text(145,426+k*28,s.label+(k?' (dashed)':' (solid)'));
    });
    out+=dots(points,staticMode||survival);
    const cols=multi?['Week',...chart.series.map(s=>s.label+' (units)')]:survival?['Operating time (hours)',...chart.series.map(s=>s.label+' survival estimate')]:['Selected case','Fitted loss ($000)','Standardized residual'];
    const rows=multi?chart.labels.map((v,i)=>[v,...chart.series.map(s=>s.data[i])]):survival?chart.xTicks.map((v,i)=>[v,...chart.series.map(s=>s.points[i][1])]):chart.points.map((p,i)=>[i+1,p.fitted,p.residual]);
    return svg(out,multi||survival?480:415,chart.altText)+(staticMode||survival?'':inspector(points))+alternative(cols,rows,'Reported observations')+(survival?'<p class="mbb5-hint">Straight segments connect reported estimates; they do not supply estimates at unobserved times. No uncertainty intervals are provided.</p>':'');
  }
  function histogram(chart) {
    const {X,Y,L,R,T,B,...a}=axes(chart.binEdges,[0,5,10,15,20,25,30,35],chart.xLabel,chart.yLabel);
    let out=a.out;
    chart.counts.forEach((count,i)=>{
      out+='<rect class="mbb5-node" x="'+X(chart.binEdges[i])+'" y="'+Y(count)+'" width="'+(X(chart.binEdges[i+1])-X(chart.binEdges[i]))+'" height="'+(B-Y(count))+'"/><text x="'+((X(chart.binEdges[i])+X(chart.binEdges[i+1]))/2)+'" y="'+(Y(count)-7)+'" text-anchor="middle">'+count+'</text>';
    });
    out+=line(X(chart.referenceValue),T,X(chart.referenceValue),B,'mbb5-second')+text(L,50,'Upper specification: 18 hours (dashed line)');
    const rows=chart.counts.map((v,i)=>['('+chart.binEdges[i]+', '+chart.binEdges[i+1]+']',v]);
    return svg(out,415,chart.altText)+'<p class="mbb5-hint">Each bin includes its upper endpoint, not its lower endpoint. Values exactly at 18 hours meet the specification.</p>'+alternative(['Cycle-time interval (hours)','Number of cases'],rows,'Histogram counts (n = 128)');
  }
  function acf(chart) {
    const {X,Y,L,R,T,B,...a}=axes(chart.lags,[-1,-.5,0,.5,1],chart.xLabel,chart.yLabel);let out=a.out;
    [chart.confidence,-chart.confidence].forEach(v=>out+=line(L,Y(v),R,Y(v),'mbb5-second'));
    out+=line(L,Y(0),R,Y(0),'mbb5-axis')+text(L,50,'Approximate pointwise 95% bounds: ±'+chart.confidence);
    chart.lags.forEach((v,i)=>{
      out+=line(X(v),Y(0),X(v),Y(chart.values[i]),'mbb5-series')+'<circle cx="'+X(v)+'" cy="'+Y(chart.values[i])+'" r="4"><title>'+esc('Lag '+v+': '+chart.values[i])+'</title></circle>';
    });
    return svg(out,415,chart.altText)+alternative(['Monthly lag','Residual autocorrelation'],chart.lags.map((v,i)=>[v,chart.values[i]]),'Supplied residual ACF values')+'<p class="mbb5-hint">Bounds are pointwise screening limits, not a simultaneous confidence band across all lags.</p>';
  }
  function network(chart) {
    const pos={A:[86,166],B:[269,76],C:[269,273],D:[456,76],E:[635,166]},w=130,h=66;
    const id='mbb5-arrow-'+esc(chart.auditId.replace(/:/g,'-'));
    let out='<defs><marker id="'+id+'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker></defs>';
    chart.edges.forEach(([a,b])=>{
      const A=pos[a],B=pos[b],x1=A[0]+w/2,x2=B[0]-w/2,m=(x1+x2)/2;
      out+='<path d="M'+x1+','+A[1]+' H'+m+' V'+B[1]+' H'+(x2-3)+'" class="mbb5-axis" marker-end="url(#'+id+')"/>';
    });
    Object.entries(chart.nodes).forEach(([id,n])=>{
      const [x,y]=pos[id];out+='<rect class="mbb5-node" x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="8"/>'+text(x,y-8,id,'text-anchor="middle"')+text(x,y+18,n.dur+' weeks','text-anchor="middle"');
    });
    out+=text(20,335,'All durations: working weeks. Arrows: finish-to-start, zero lag.');
    return svg(out,358,chart.altText)+alternative(['Activity','Duration (working weeks)','Predecessors'],Object.entries(chart.nodes).map(([id,n])=>[id,n.dur,chart.edges.filter(e=>e[1]===id).map(e=>e[0]).join(', ')||'None']),'Network dependencies');
  }
  function render(chart,staticMode=false) {
    if(!chart || chart.auditBatch!==5 || !isQuestion({qid:chart.auditId}))return '';
    let content='';
    if(chart.type==='data-table')content=table(chart.columns,chart.rows,'Case evidence')+capacity(chart,staticMode);
    else if(['multi-time-series','regression-diagnostic','reliability-plot'].includes(chart.type))content=xyChart(chart,staticMode);
    else if(chart.type==='activity-network')content=network(chart);
    else if(chart.type==='histogram')content=histogram(chart);
    else if(chart.type==='acf-plot')content=acf(chart);
    else return '';
    return '<section class="mbb5-evidence tb-q-chart-wrap" data-mbb5-chart="'+esc(chart.auditId)+'" aria-label="Question evidence">'+(chart.title?'<h4>'+esc(chart.title)+'</h4>':'')+content+'<p class="mbb5-hint">Wide evidence scrolls horizontally without shrinking its labels.</p></section>';
  }
  function inspect(el,index) {
    const scope=el.closest('.mbb5-evidence');if(!scope)return;
    const select=scope.querySelector('[data-mbb5-observation]'),output=scope.querySelector('[data-mbb5-readout]');
    if(!select||!output||!select.options[index])return;select.value=String(index);output.textContent=select.options[index].textContent;
  }
  function capacityValue(el,reset=false){
    const scope=el.closest('.mbb5-capacity');if(!scope)return;
    const input=scope.querySelector('[data-mbb5-capacity]'),output=scope.querySelector('[data-mbb5-capacity-output]');
    if(!input||!output)return;if(reset)input.value='9';output.textContent='Hypothetical capacity: '+input.value+' Belt-months';
  }
  if(global.document){
    document.addEventListener('change',e=>{if(e.target.matches('[data-mbb5-observation]'))inspect(e.target,Number(e.target.value));});
    document.addEventListener('focusin',e=>{if(e.target.matches('[data-mbb5-point]'))inspect(e.target,Number(e.target.dataset.mbb5Point));});
    document.addEventListener('click',e=>{if(e.target.matches('[data-mbb5-point]'))inspect(e.target,Number(e.target.dataset.mbb5Point));if(e.target.matches('[data-mbb5-reset]'))capacityValue(e.target,true);});
    document.addEventListener('keydown',e=>{if(e.target.matches('[data-mbb5-point]')&&['Enter',' '].includes(e.key)){e.preventDefault();inspect(e.target,Number(e.target.dataset.mbb5Point));}});
    document.addEventListener('input',e=>{if(e.target.matches('[data-mbb5-capacity]'))capacityValue(e.target);});
  }
  global.__MBBBatch5UI={isQuestion,conditions,rationales,render,css:css+extraCSS};
})(window);

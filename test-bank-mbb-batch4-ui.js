/* Scoped evidence renderer for MBB Set 2 Q076–100. Never reads an answer key. */
(function (global) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^mbb:set-2:original-(0(7[6-9]|[89][0-9])|100)$/.test(q.qid || '');
  const css = `
.tb-review-list:has(.mbb4-conditions){min-width:0;grid-template-columns:minmax(0,1fr)}
.tb-review-card:has(.mbb4-conditions){min-width:0;max-width:100%;box-sizing:border-box}
.mbb4-evidence{max-width:100%;min-width:0;margin:20px 0;line-height:1.55;color:var(--ink,#16343e)}
.mbb4-evidence h4{font-size:17px;line-height:1.4;font-weight:650;margin:0 0 10px}
.mbb4-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line,#bcc9ce);border-radius:8px}
.mbb4-table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:700px;font-size:14px;line-height:1.55;text-align:left;background:var(--card,#fff)}
.mbb4-table caption{padding:10px 12px;font-weight:650;text-align:left}
.mbb4-evidence .mbb4-table th,.mbb4-evidence .mbb4-table td{font-size:14px;text-align:left;padding:12px 14px;vertical-align:top;border-bottom:1px solid var(--line,#bcc9ce);white-space:normal;overflow-wrap:break-word;word-break:normal}
.mbb4-table th{font-weight:650}.mbb4-table thead{background:var(--paper,#f3f6f7)}
.mbb4-evidence svg{display:block;width:720px;min-width:720px;max-width:none;height:auto;margin-inline:auto;background:var(--card,#fff);color:var(--ink,#16343e)}
.mbb4-evidence svg text{font:14px Arial,sans-serif;fill:currentColor}
.mbb4-grid{stroke:var(--line,#bdc9ce);stroke-width:1}.mbb4-axis{stroke:currentColor;stroke-width:1.5;fill:none}
.mbb4-series{stroke:var(--teal,#137c83);fill:none;stroke-width:2.5}.mbb4-second{stroke:currentColor;stroke-dasharray:7 5;fill:none;stroke-width:2.5}
.mbb4-evidence svg circle{fill:var(--card,#fff);stroke:currentColor;stroke-width:2}
.mbb4-evidence svg .mbb4-node{fill:var(--paper,#f3f6f7);stroke:currentColor;stroke-width:1.5}
.mbb4-evidence svg [tabindex]:focus{outline:3px solid var(--teal,#137c83);outline-offset:4px}
.mbb4-inspector{display:block;margin:12px 0 0;font-size:14px}.mbb4-inspector select{display:block;width:100%;min-height:44px;margin-top:5px;padding:8px;background:var(--card,#fff);color:inherit;border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}
.mbb4-readout{display:block;margin:8px 0;padding:10px 12px;min-height:44px;box-sizing:border-box;background:var(--paper,#f3f6f7);border-left:3px solid var(--teal,#137c83);font-size:14px}
.mbb4-evidence details{margin:10px 0}.mbb4-evidence summary{cursor:pointer;padding:10px 0;min-height:44px;box-sizing:border-box;font-weight:600;font-size:14px}
.mbb4-hint{font-size:13px;color:var(--muted,#49616b);margin:7px 0}
.mbb4-conditions{margin:12px 0;padding:14px 18px;border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px;line-height:1.6;background:var(--paper,#f3f6f7)}
.mbb4-conditions ul{margin:7px 0 0;padding-left:20px}.mbb4-conditions li{margin:5px 0}
.mbb4-rationales{margin:16px 0 0;font-size:14px;line-height:1.6}.mbb4-rationales dt{font-weight:650;margin-top:10px}.mbb4-rationales dd{margin:3px 0 0}
`;
  if (global.document && !document.getElementById('mbb4-evidence-style')) {
    const style = document.createElement('style'); style.id = 'mbb4-evidence-style'; style.textContent = css; document.head.appendChild(style);
  }
  function conditions(q) {
    if (!isQuestion(q) || !Array.isArray(q.assumptions) || !q.assumptions.length) return '';
    return '<section class="mbb4-conditions" aria-label="Stated conditions"><strong>Stated conditions</strong><ul>'+q.assumptions.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>';
  }
  function rationales(q) {
    if (!isQuestion(q) || !Array.isArray(q.optionRationales)) return '';
    return '<dl class="mbb4-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';
  }
  function table(columns, rows, caption) {
    const wide = columns.length >= 6 ? ' style="min-width:920px"' : '';
    return '<div class="mbb4-scroll" tabindex="0" role="region" aria-label="'+esc(caption)+'; scroll horizontally if needed"><table class="mbb4-table tb-q-data-table"'+wide+'><caption>'+esc(caption)+'</caption><thead><tr>'+columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>i===0?'<th scope="row">'+esc(v)+'</th>':'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const text=(x,y,s,other='')=>'<text x="'+x+'" y="'+y+'" '+other+'>'+esc(s)+'</text>';
  const line=(x1,y1,x2,y2,cls='mbb4-grid')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
  function svg(content,height,alt) {return '<div class="mbb4-scroll" tabindex="0" role="region" aria-label="Chart; scroll horizontally for the full range"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(alt)+'" viewBox="0 0 720 '+height+'">'+content+'</svg></div>';}
  const fmt = (v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
  function dots(points, staticMode) {
    return points.map((p,i)=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="5"'+(staticMode?'':' tabindex="0" role="button" data-mbb4-point="'+i+'" aria-label="'+esc(p.label)+'"')+'><title>'+esc(p.label)+'</title></circle>').join('');
  }
  function inspector(points) {
    return '<label class="mbb4-inspector">Inspect an observation<select data-mbb4-observation aria-label="Inspect an observation">'+points.map((p,i)=>'<option value="'+i+'">'+esc(p.label)+'</option>').join('')+'</select></label><output class="mbb4-readout" data-mbb4-readout aria-live="polite">'+esc(points[0].label)+'</output>';
  }
  const alternative=(cols,rows,caption)=>'<details class="mbb4-data"><summary>View the same evidence as a data table</summary>'+table(cols,rows,caption)+'</details>';
  function scatter(chart,staticMode) {
    const growth=chart.type==='reliability-growth',multi=chart.type==='multi-time-series';
    const left=85,right=670,top=58,bottom=326;
    const xs=multi?chart.labels.map(Number):growth?chart.xTicks:chart.xTicks;
    const ys=multi?[0,2,4,6,8,10]:chart.yTicks;
    const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
    const transform=growth?Math.log10:v=>v;
    const X=v=>left+(transform(v)-transform(xmin))/(transform(xmax)-transform(xmin))*(right-left);
    const Y=v=>bottom-(transform(v)-transform(ymin))/(transform(ymax)-transform(ymin))*(bottom-top);
    let out=text(18,27,growth?'Cumulative MTBF (hours; logarithmic axis)':multi?'Behaviorally anchored score (ordered ratings)':'Estimated bias (mm)');
    ys.forEach(v=>{out+=line(left,Y(v),right,Y(v))+text(left-13,Y(v)+5,fmt(v),'text-anchor="end"');});
    xs.forEach(v=>{out+=line(X(v),bottom,X(v),bottom+5,'mbb4-axis')+text(X(v),bottom+26,fmt(v),'text-anchor="middle"');});
    out+=line(left,top,left,bottom,'mbb4-axis')+line(left,bottom,right,bottom,'mbb4-axis');
    out+=text((left+right)/2,bottom+58,growth?'Cumulative unit test time (hours; logarithmic axis)':multi?'Week':'Certified reference (mm)','text-anchor="middle"');
    if(growth) {
      // The annotation is a configuration interval, not a confidence band or a fitted model.
      const x1=X(chart.event.time),x2=X(chart.event.resumeTime);
      out+='<rect x="'+x1+'" y="'+top+'" width="'+(x2-x1)+'" height="'+(bottom-top)+'" fill="currentColor" opacity="0.06"/>';
      out+=line(x1,top,x1,bottom,'mbb4-second')+line(x2,top,x2,bottom,'mbb4-second');
      out+=text(85,417,'800 h: failure requiring design change')+text(85,443,'1,200 h: correction installed; intervening tests retained');
    }
    if(multi)out+=line(left,Y(chart.referenceValue),right,Y(chart.referenceValue),'mbb4-axis')+text(left,47,'Competence threshold: '+chart.referenceValue+' (solid horizontal line)');
    if(!multi&&!growth)out+=line(left,Y(0),right,Y(0),'mbb4-axis');
    const series=multi?chart.series.map(s=>({label:s.label,values:s.data.map((v,i)=>[Number(chart.labels[i]),v])})):growth?[{label:'Cumulative MTBF',values:chart.points.map(p=>[p.time,p.mtbf])}]:[{label:'Estimated bias',values:chart.points.map(p=>[p.fitted,p.residual])}];
    const points=[];
    series.forEach((s,k)=>{
      const klass=k?'mbb4-second':'mbb4-series';
      out+='<path class="'+klass+'" d="'+s.values.map((v,i)=>(i?'L':'M')+X(v[0])+','+Y(v[1])).join(' ')+'"/>';
      s.values.forEach((v,i)=>{points.push({x:X(v[0]),y:Y(v[1]),label:multi?s.label+', week '+v[0]+': '+fmt(v[1]):growth?fmt(v[0])+' test hours; '+chart.points[i].failures+' failures; cumulative MTBF '+fmt(v[1],4)+' hours':fmt(v[0])+' mm reference: '+fmt(v[1])+' mm bias'});});
      if(multi)out+=line(85,412+k*28,130,412+k*28,klass)+text(145,417+k*28,s.label+(k?' (dashed)':' (solid)'));
    });
    out+=dots(points,staticMode);
    const rows=multi?chart.labels.map((v,i)=>['Week '+v,...chart.series.map(s=>fmt(s.data[i]))]):growth?chart.points.map(p=>[fmt(p.time),p.failures,fmt(p.mtbf,4)]):chart.points.map(p=>[fmt(p.fitted),fmt(p.residual)]);
    const cols=multi?['Week',...chart.series.map(s=>s.label)]:growth?['Cumulative test time (hours)','Cumulative failures','Cumulative MTBF (hours)']:['Certified reference (mm)','Estimated bias (mm)'];
    return svg(out,growth||multi?468:402,chart.altText)+(staticMode?'':inspector(points))+alternative(cols,rows,'Source observations');
  }
  function network(chart) {
    const pos={P:[80,180],Q:[265,85],R:[265,275],S:[455,180],M:[640,180]},w=128,h=66;
    const id='mbb4-arrow-'+esc(chart.auditId.replace(/:/g,'-'));
    let out='<defs><marker id="'+id+'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>';
    chart.edges.forEach(([a,b])=>{const A=pos[a],B=pos[b],x1=A[0]+w/2,x2=B[0]-w/2,m=(x1+x2)/2;out+='<path d="M'+x1+','+A[1]+' H'+m+' V'+B[1]+' H'+(x2-3)+'" class="mbb4-axis" marker-end="url(#'+id+')"/>';});
    Object.entries(chart.nodes).forEach(([id,n])=>{const [x,y]=pos[id];out+='<rect class="mbb4-node" x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="8"/>'+text(x,y-8,id==='M'?'M: migration':id,'text-anchor="middle"')+text(x,y+18,n.dur+' working days','text-anchor="middle"');});
    out+=text(20,340,'Arrows: finish-to-start, zero lag. S requires both Q and R.');
    return svg(out,368,chart.altText)+alternative(['Project / milestone','Duration (working days)','Predecessors'],Object.entries(chart.nodes).map(([id,n])=>[id,n.dur,chart.edges.filter(e=>e[1]===id).map(e=>e[0]).join(', ')||'None']),'Dependency data');
  }
  function mixture(chart) {
    // Barycentric geometry: A top, B lower-left, C lower-right; the lower-bound feasible set is a true sub-simplex.
    const V=[[360,60],[100,510],[620,510]],xy=p=>[p.reduce((a,v,i)=>a+v*V[i][0],0),p.reduce((a,v,i)=>a+v*V[i][1],0)];
    const remaining=1-chart.lowerBounds.reduce((a,b)=>a+b,0),corners=[0,1,2].map(i=>chart.lowerBounds.map((v,j)=>v+(i===j?remaining:0)));
    let out='<polygon points="'+V.map(p=>p.join(',')).join(' ')+'" class="mbb4-axis"/>';
    [0.2,0.4,0.6,0.8].forEach(t=>{[0,1,2].forEach(i=>{const ends=[0,1,2].filter(j=>j!==i).map(j=>{const a=[0,0,0];a[i]=t;a[j]=1-t;return xy(a);});out+=line(...ends[0],...ends[1]);});});
    out+=text(360,32,'A = 1','text-anchor="middle"')+text(100,541,'B = 1','text-anchor="middle"')+text(620,541,'C = 1','text-anchor="middle"');
    out+='<polygon points="'+corners.map(p=>xy(p).join(',')).join(' ')+'" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2.5"/>';
    const p=xy(chart.point);out+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5"/><path d="M'+(p[0]+7)+','+p[1]+' L490,250" class="mbb4-axis"/>'+text(494,241,'Candidate')+text(494,263,'(0.40, 0.45, 0.15)');
    out+=text(20,572,'Shaded region: all stated lower bounds satisfied.')+text(20,597,'Coordinates are mass fractions (A, B, C); each point sums to 1.');
    return svg(out,620,chart.altText)+alternative(['Point','A mass fraction','B mass fraction','C mass fraction'],corners.map((p,i)=>['Feasible vertex '+(i+1),...p.map(v=>fmt(v))]).concat([['Candidate',...chart.point.map(v=>fmt(v))]]),'Feasible-region coordinates');
  }
  function render(chart,staticMode=false) {
    if (!chart || chart.auditBatch!==4) return '';
    let content='';
    if(chart.type==='data-table') {
      content=table(chart.columns,chart.rows,chart.auditId.endsWith('099')?'Candidate-design diagnostics':chart.auditId.endsWith('100')?'Diameter under imposed noise conditions (mm)':'Case evidence');
      if(chart.designRuns)content+='<details class="mbb4-matrices"><summary>Inspect the candidate run matrices</summary><p class="mbb4-hint">Model columns: [1, A, B, A², AB, B²]. Run numbers identify rows, not a prescribed execution order.</p>'+table(['Design / run','A (coded)','B (coded)'],Object.entries(chart.designRuns).flatMap(([id,runs])=>runs.map((p,i)=>[id+' / '+(i+1),...p])),'All candidate settings')+'</details>';
    } else if(['multi-time-series','regression-diagnostic','reliability-growth'].includes(chart.type))content=scatter(chart,staticMode);
    else if(chart.type==='activity-network')content=network(chart);
    else if(chart.type==='mixture-simplex')content=mixture(chart);
    else return '';
    return '<section class="mbb4-evidence" data-mbb4-chart="'+esc(chart.auditId)+'" aria-label="Question evidence">'+(chart.title?'<h4>'+esc(chart.title)+'</h4>':'')+content+'<p class="mbb4-hint">Wide evidence can be scrolled horizontally without shrinking the labels.</p></section>';
  }
  function inspect(el,index) {
    const scope=el.closest('.mbb4-evidence');if(!scope)return;
    const select=scope.querySelector('[data-mbb4-observation]'),output=scope.querySelector('[data-mbb4-readout]');
    if(!select||!output||!select.options[index])return;select.value=String(index);output.textContent=select.options[index].textContent;
  }
  if(global.document) {
    document.addEventListener('change',e=>{if(e.target.matches('[data-mbb4-observation]'))inspect(e.target,Number(e.target.value));});
    document.addEventListener('focusin',e=>{if(e.target.matches('[data-mbb4-point]'))inspect(e.target,Number(e.target.dataset.mbb4Point));});
    document.addEventListener('click',e=>{if(e.target.matches('[data-mbb4-point]'))inspect(e.target,Number(e.target.dataset.mbb4Point));});
    document.addEventListener('keydown',e=>{if(e.target.matches('[data-mbb4-point]')&&['Enter',' '].includes(e.key)){e.preventDefault();inspect(e.target,Number(e.target.dataset.mbb4Point));}});
  }
  global.__MBBBatch4UI={isQuestion,conditions,rationales,render,css};
})(window);

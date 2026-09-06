/* Accessible evidence for MBB Set 2 Q026–050. No keys or scoring state enter this renderer. */
(function (global) {
  'use strict';
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^mbb:set-2:original-0(2[6-9]|[34][0-9]|50)$/.test(q.qid || '');
  const css = `
.tb-review-list:has(.mbb2-conditions){min-width:0;grid-template-columns:minmax(0,1fr)}
.tb-review-card:has(.mbb2-conditions){min-width:0;max-width:100%;box-sizing:border-box}
.mbb2-evidence{max-width:100%;min-width:0;margin:20px 0;line-height:1.55;color:var(--ink,#16343e)}
.mbb2-evidence h4{font-size:17px;font-weight:600;line-height:1.4;margin:0 0 10px}
.mbb2-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line,#bcc9ce);border-radius:8px}
.mbb2-table{border-collapse:collapse;width:100%;min-width:620px;font-size:14px;line-height:1.55;text-align:left;background:var(--card,#fff)}
.mbb2-table caption{padding:10px 12px;font-weight:600;text-align:left}
.mbb2-evidence .mbb2-table th,.mbb2-evidence .mbb2-table td{font-size:14px;text-align:left;padding:12px 14px;vertical-align:top;border-bottom:1px solid var(--line,#bcc9ce);white-space:normal;word-break:normal}
.mbb2-table th{font-weight:650}.mbb2-table thead{background:var(--paper,#f3f6f7)}
.mbb2-evidence svg{display:block;width:640px;min-width:640px;max-width:none;height:auto;margin-inline:auto;background:var(--card,#fff)}
.mbb2-evidence svg text{font:14px Arial,sans-serif;fill:currentColor}
.mbb2-evidence svg .mbb2-grid{stroke:var(--line,#bdc9ce);stroke-width:1}.mbb2-evidence svg .mbb2-axis{stroke:currentColor;stroke-width:1.5}
.mbb2-evidence svg .mbb2-series{stroke:var(--teal,#137c83);fill:none;stroke-width:2.5}
.mbb2-evidence svg .mbb2-second{stroke:currentColor;stroke-dasharray:7 5}
.mbb2-evidence svg circle{fill:var(--card,#fff);stroke:currentColor;stroke-width:2}
.mbb2-evidence svg [tabindex]:focus{outline:3px solid var(--teal,#137c83);outline-offset:4px}
.mbb2-inspector{display:block;margin:12px 0 0;font-size:14px}.mbb2-inspector select{display:block;width:100%;min-height:44px;margin-top:5px;padding:8px;background:var(--card,#fff);color:inherit;border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}
.mbb2-readout{display:block;margin:8px 0;padding:10px 12px;min-height:44px;background:var(--paper,#f3f6f7);border-left:3px solid var(--teal,#137c83);font-size:14px}
.mbb2-evidence details{margin:10px 0}.mbb2-evidence summary{cursor:pointer;padding:10px 0;min-height:44px;font-weight:600;font-size:14px}
.mbb2-hint{font-size:13px;color:var(--muted,#49616b);margin:7px 0}
.mbb2-conditions{margin:12px 0;padding:14px 18px;border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px;line-height:1.6;background:var(--paper,#f3f6f7)}
.mbb2-conditions strong{font-weight:650}.mbb2-conditions ul{margin:7px 0 0;padding-left:20px}.mbb2-conditions li{margin:5px 0}
.mbb2-whatif{font-size:14px;padding:14px 0}.mbb2-whatif input{width:100%;min-height:44px;display:block}.mbb2-whatif button{min-height:44px;padding:8px 14px;font:inherit;color:inherit;background:var(--card,#fff);border:1px solid var(--line,#bdc9ce);border-radius:6px}
.mbb2-rationales{margin:16px 0 0;font-size:14px;line-height:1.6}.mbb2-rationales dt{font-weight:650;margin-top:10px}.mbb2-rationales dd{margin:3px 0 0}
`;
  if (global.document && !document.getElementById('mbb2-evidence-style')) {
    const style = document.createElement('style'); style.id = 'mbb2-evidence-style'; style.textContent = css; document.head.appendChild(style);
  }
  function conditions(q) {
    if (!isQuestion(q) || !Array.isArray(q.assumptions) || !q.assumptions.length) return '';
    return '<section class="mbb2-conditions" aria-label="Stated conditions"><strong>Stated conditions</strong><ul>'+q.assumptions.map(s=>'<li>'+escape(s)+'</li>').join('')+'</ul></section>';
  }
  function rationales(q) {
    if (!isQuestion(q) || !Array.isArray(q.optionRationales)) return '';
    return '<dl class="mbb2-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+escape(s)+'</dd>').join('')+'</dl>';
  }
  function table(columns, rows, caption) {
    return '<div class="mbb2-scroll" tabindex="0" role="region" aria-label="'+escape(caption)+'; scroll horizontally if needed"><table class="mbb2-table tb-q-data-table"><caption>'+escape(caption)+'</caption><thead><tr>'+columns.map(s=>'<th scope="col">'+escape(s)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>i===0?'<th scope="row">'+escape(v)+'</th>':'<td>'+escape(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const text = (x,y,s,other='') => '<text x="'+x+'" y="'+y+'" '+other+'>'+escape(s)+'</text>';
  const line = (x1,y1,x2,y2,cls='mbb2-grid') => '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
  function svg(content,height,alt) { return '<div class="mbb2-scroll" tabindex="0" role="region" aria-label="Chart; scroll horizontally for the full axis range"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+escape(alt)+'" viewBox="0 0 640 '+height+'">'+content+'</svg></div>'; }
  function pointsMarkup(points, staticMode) {
    return points.map((p,i)=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="5"'+(staticMode?'':' tabindex="0" data-mbb2-point="'+i+'" aria-label="'+escape(p.label)+'"')+'><title>'+escape(p.label)+'</title></circle>').join('');
  }
  function inspector(points) {
    return '<label class="mbb2-inspector">Inspect an observation<select data-mbb2-observation aria-label="Inspect an observation">'+points.map((p,i)=>'<option value="'+i+'">'+escape(p.label)+'</option>').join('')+'</select></label><output class="mbb2-readout" data-mbb2-readout aria-live="polite">'+escape(points[0].label)+'</output>';
  }
  function plot(chart, staticMode) {
    const isReliability=chart.type==='reliability-plot', left=86,right=608,top=76,bottom=334, width=right-left;
    const xs=isReliability?chart.xTicks:chart.data.map((_,i)=>i+1), xmax=Math.max(...xs), xmin=isReliability?0:1;
    const ymax=isReliability?1:40, yticks=isReliability?[0,.2,.4,.6,.8,1]:[0,10,20,30,40];
    const X=v=>left+(v-xmin)/(xmax-xmin)*width, Y=v=>bottom-v/ymax*(bottom-top);
    let out=text(20,27,chart.title || 'Evidence plot')+text(20,52,chart.yLabel);
    yticks.forEach(v=>{out+=line(left,Y(v),right,Y(v))+text(left-12,Y(v)+5,String(v),'text-anchor="end"');});
    xs.forEach(v=>{out+=line(X(v),bottom,X(v),bottom+5,'mbb2-axis')+text(X(v),bottom+24,String(v),'text-anchor="middle"');});
    out+=line(left,top,left,bottom,'mbb2-axis')+line(left,bottom,right,bottom,'mbb2-axis')+text(345,bottom+54,chart.xLabel,'text-anchor="middle"');
    const series=isReliability?chart.series:[{label:chart.yLabel,points:chart.data.map((v,i)=>[i+1,v])}];
    const pts=[];
    series.forEach((s,k)=>{
      // The reliability curve is sampled from the supplied Weibull model; displayed markers retain the stored evidence points.
      const curve=isReliability?Array.from({length:101},(_,i)=>{const t=xmax*i/100,r=Math.exp(-Math.pow(t/chart.weibullModel.scaleHours,chart.weibullModel.shape));return[t,k===0?r*r:1-(1-r)*(1-r)];}):s.points;
      out+='<path class="mbb2-series'+(k?' mbb2-second':'')+'" d="'+curve.map((p,i)=>(i?'L':'M')+X(p[0])+','+Y(p[1])).join(' ')+'"/>';
      s.points.forEach(p=>pts.push({x:X(p[0]),y:Y(p[1]),label:(isReliability?s.label+', '+p[0]+' hours: '+p[1].toFixed(4):'Week '+p[0]+': '+p[1]+' per 100 referrals')}));
      if(isReliability)out+=line(90,418+k*30,128,418+k*30,'mbb2-series'+(k?' mbb2-second':''))+text(140,423+k*30,s.label);
    });
    if(isReliability)out+=line(X(chart.missionTime),top,X(chart.missionTime),bottom,'mbb2-second mbb2-axis')+text(X(chart.missionTime)+8,top+18,'1,000 h');
    out+=pointsMarkup(pts,staticMode);
    const rows=isReliability?chart.series.flatMap(s=>s.points.map(p=>[s.label,String(p[0]),p[1].toFixed(4)])):chart.data.map((v,i)=>['Week '+(i+1),String(v)]);
    const columns=isReliability?['System','Mission time (hours)','Reliability']:['Week after rollout','Manual referrals per 100 referrals'];
    return svg(out,isReliability?475:410,chart.altText)+(staticMode?'':inspector(pts))+'<details class="mbb2-data"><summary>View the same evidence as a data table</summary>'+table(columns,rows,'Chart observations')+'</details>';
  }
  function contour(chart) {
    // Equal coded units must have equal pixel distances on both axes.
    const left=104,top=54,side=450,lo=-2.5,hi=2.5, X=v=>left+(v-lo)/(hi-lo)*side,Y=v=>top+(hi-v)/(hi-lo)*side;
    let out=text(20,27,'Fitted response contours — equal coded-axis scales');
    chart.xTicks.forEach(v=>{out+=line(X(v),top,X(v),top+side)+text(X(v),top+side+25,v,'text-anchor="middle"');});
    chart.yTicks.forEach(v=>{out+=line(left,Y(v),left+side,Y(v))+text(left-15,Y(v)+5,v,'text-anchor="end"');});
    const clip='mbb2-contour-'+escape(chart.auditId.replace(/:/g,'-'));
    out+='<defs><clipPath id="'+clip+'"><rect x="'+left+'" y="'+top+'" width="'+side+'" height="'+side+'"/></clipPath></defs><g clip-path="url(#'+clip+')">';
    chart.contours.forEach(c=>{out+='<ellipse cx="'+X(chart.center[0])+'" cy="'+Y(chart.center[1])+'" rx="'+c.radiusX*90+'" ry="'+c.radiusY*90+'" fill="none" stroke="currentColor" stroke-width="2"/>';out+=text(X(chart.center[0]+c.radiusX)-25,Y(chart.center[1])-10,c.level);});
    out+='</g>'+line(left,top,left,top+side,'mbb2-axis')+line(left,top+side,left+side,top+side,'mbb2-axis');
    out+='<circle cx="'+X(chart.current.x)+'" cy="'+Y(chart.current.y)+'" r="5"><title>Current: A = −1, B = 1</title></circle>'+text(X(chart.current.x)-12,Y(chart.current.y)-20,'Current (−1, 1)','text-anchor="end"');
    out+=text(left+side/2,556,chart.xLabel,'text-anchor="middle"')+text(27,top+side/2,chart.yLabel,'text-anchor="middle" transform="rotate(-90 27 '+(top+side/2)+')"');
    return svg(out,582,chart.altText)+'<p class="mbb2-hint">Response-surface contour plot. Both axes use the same distance per coded unit. Lines show fitted response levels 75, 80, and 85; the marked setting is (−1, 1). Model: '+escape(chart.model)+'.</p>';
  }
  function render(chart, staticMode=false) {
    if(!chart || chart.auditBatch!==2) return '';
    let body='';
    if(chart.type==='data-table') {
      body=table(chart.columns,chart.rows,chart.title || 'Question evidence');
      if(chart.whatIf) {
        const w=chart.whatIf;
        body+='<div class="mbb2-whatif tb-chart-whatif"><strong>Scored case: 12 FTE. What-if settings do not change the question or its key.</strong>';
        if(!staticMode) body+='<label>'+escape(w.label)+' — <output data-tb-whatif-value>'+w.value+'</output> FTE<input type="range" data-tb-whatif data-mbb2-capacity data-committed="'+w.committed+'" min="'+w.min+'" max="'+w.max+'" step="1" value="'+w.value+'" aria-label="Hypothetical total capacity (FTE)"></label>';
        body+='<p><span data-tb-whatif-remaining>'+ (w.value-w.committed)+'</span> FTE remain after '+escape(w.committedLabel)+'.</p>';
        if(!staticMode)body+='<button type="button" data-mbb2-reset>Reset to scored capacity (12 FTE)</button>';
        body+='</div>';
      }
    } else if(chart.type==='risk-matrix') {
      body=table([chart.rowAxis+' / '+chart.colAxis,...chart.cols],chart.rows.map((r,i)=>[r,...chart.cells[i].map(c=>c[0].toUpperCase()+c.slice(1))]),'Organizational risk-classification matrix');
    } else if(chart.type==='contour-plot') body=contour(chart);
    else if(chart.type==='time-series'||chart.type==='reliability-plot') body=plot(chart,staticMode);
    else throw new Error('Unsupported audited MBB evidence: '+chart.type);
    return '<section class="tb-q-chart-wrap mbb2-evidence" data-mbb2-evidence="'+escape(chart.auditId)+'">'+body+'<p class="mbb2-hint">On a narrow screen, swipe or keyboard-scroll the bordered evidence area. All labels retain their readable size.</p></section>';
  }
  function inspect(target,index) {
    const host=target.closest('.mbb2-evidence'); if(!host)return;
    const select=host.querySelector('[data-mbb2-observation]'),readout=host.querySelector('[data-mbb2-readout]');
    if(!select||!readout||!select.options[index])return;
    select.value=String(index); readout.textContent=select.options[index].text;
  }
  if(global.document) {
    document.addEventListener('change',e=>{if(e.target.matches('[data-mbb2-observation]'))inspect(e.target,Number(e.target.value));});
    document.addEventListener('focusin',e=>{if(e.target.matches('[data-mbb2-point]'))inspect(e.target,Number(e.target.dataset.mbb2Point));});
    document.addEventListener('pointerover',e=>{if(e.target.matches('[data-mbb2-point]'))inspect(e.target,Number(e.target.dataset.mbb2Point));});
    document.addEventListener('click',e=>{const p=e.target.closest('[data-mbb2-point]');if(p)inspect(p,Number(p.dataset.mbb2Point));const reset=e.target.closest('[data-mbb2-reset]');if(reset){const s=reset.closest('.mbb2-whatif').querySelector('input');s.value='12';s.dispatchEvent(new Event('input',{bubbles:true}));}});
    document.addEventListener('input',e=>{const s=e.target;if(!s.matches('[data-mbb2-capacity]'))return;const host=s.closest('.mbb2-whatif');host.querySelector('[data-tb-whatif-value]').textContent=s.value;host.querySelector('[data-tb-whatif-remaining]').textContent=String(Number(s.value)-Number(s.dataset.committed));});
  }
  global.__MBBBatch2UI={isQuestion,conditions,rationales,render};
})(window);

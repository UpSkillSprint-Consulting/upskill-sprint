/* Scoped evidence renderer for MBB Set 2 Q051–075. Never reads an answer key. */
(function (global) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^mbb:set-2:original-0(5[1-9]|6[0-9]|7[0-5])$/.test(q.qid || '');
  const css = `
.tb-review-list:has(.mbb3-conditions){min-width:0;grid-template-columns:minmax(0,1fr)}
.tb-review-card:has(.mbb3-conditions){min-width:0;max-width:100%;box-sizing:border-box}
.mbb3-evidence{max-width:100%;min-width:0;margin:20px 0;line-height:1.55;color:var(--ink,#16343e)}
.mbb3-evidence h4{font-size:17px;line-height:1.4;font-weight:650;margin:0 0 10px}
.mbb3-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;border:1px solid var(--line,#bcc9ce);border-radius:8px}
.mbb3-table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:700px;font-size:14px;line-height:1.55;text-align:left;background:var(--card,#fff)}
.mbb3-table caption{padding:10px 12px;font-weight:650;text-align:left}
.mbb3-evidence .mbb3-table th,.mbb3-evidence .mbb3-table td{font-size:14px;text-align:left;padding:12px 14px;vertical-align:top;border-bottom:1px solid var(--line,#bcc9ce);white-space:normal;overflow-wrap:break-word;word-break:normal}
.mbb3-table th{font-weight:650}.mbb3-table thead{background:var(--paper,#f3f6f7)}
.mbb3-evidence svg{display:block;width:720px;min-width:720px;max-width:none;height:auto;margin-inline:auto;background:var(--card,#fff);color:var(--ink,#16343e)}
.mbb3-evidence svg text{font:14px Arial,sans-serif;fill:currentColor}
.mbb3-grid{stroke:var(--line,#bdc9ce);stroke-width:1}.mbb3-axis{stroke:currentColor;stroke-width:1.5;fill:none}
.mbb3-series{stroke:var(--teal,#137c83);fill:none;stroke-width:2.5}.mbb3-second{stroke:currentColor;stroke-dasharray:7 5;fill:none;stroke-width:2.5}
.mbb3-evidence svg circle{fill:var(--card,#fff);stroke:currentColor;stroke-width:2}
.mbb3-evidence svg .mbb3-node{fill:var(--paper,#f3f6f7);stroke:currentColor;stroke-width:1.5}
.mbb3-evidence svg [tabindex]:focus{outline:3px solid var(--teal,#137c83);outline-offset:4px}
.mbb3-inspector{display:block;margin:12px 0 0;font-size:14px}.mbb3-inspector select{display:block;width:100%;min-height:44px;margin-top:5px;padding:8px;background:var(--card,#fff);color:inherit;border:1px solid var(--line,#bdc9ce);border-radius:6px;font:inherit}
.mbb3-readout{display:block;margin:8px 0;padding:10px 12px;min-height:44px;box-sizing:border-box;background:var(--paper,#f3f6f7);border-left:3px solid var(--teal,#137c83);font-size:14px}
.mbb3-evidence details{margin:10px 0}.mbb3-evidence summary{cursor:pointer;padding:10px 0;min-height:44px;box-sizing:border-box;font-weight:600;font-size:14px}
.mbb3-hint{font-size:13px;color:var(--muted,#49616b);margin:7px 0}
.mbb3-conditions{margin:12px 0;padding:14px 18px;border:1px solid var(--line,#bdc9ce);border-radius:8px;font-size:14px;line-height:1.6;background:var(--paper,#f3f6f7)}
.mbb3-conditions ul{margin:7px 0 0;padding-left:20px}.mbb3-conditions li{margin:5px 0}
.mbb3-rationales{margin:16px 0 0;font-size:14px;line-height:1.6}.mbb3-rationales dt{font-weight:650;margin-top:10px}.mbb3-rationales dd{margin:3px 0 0}
`;
  if (global.document && !document.getElementById('mbb3-evidence-style')) {
    const style = document.createElement('style'); style.id = 'mbb3-evidence-style'; style.textContent = css; document.head.appendChild(style);
  }
  function conditions(q) {
    if (!isQuestion(q) || !Array.isArray(q.assumptions) || !q.assumptions.length) return '';
    return '<section class="mbb3-conditions" aria-label="Stated conditions"><strong>Stated conditions</strong><ul>'+q.assumptions.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></section>';
  }
  function rationales(q) {
    if (!isQuestion(q) || !Array.isArray(q.optionRationales)) return '';
    return '<dl class="mbb3-rationales" aria-label="Answer-choice explanations">'+q.optionRationales.map((s,i)=>'<dt>Choice '+String.fromCharCode(65+i)+'</dt><dd>'+esc(s)+'</dd>').join('')+'</dl>';
  }
  function table(columns, rows, caption) {
    const wide = columns.length >= 6 ? ' style="min-width:920px"' : '';
    return '<div class="mbb3-scroll" tabindex="0" role="region" aria-label="'+esc(caption)+'; scroll horizontally if needed"><table class="mbb3-table tb-q-data-table"'+wide+'><caption>'+esc(caption)+'</caption><thead><tr>'+columns.map(s=>'<th scope="col">'+esc(s)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>i===0?'<th scope="row">'+esc(v)+'</th>':'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const text=(x,y,s,other='')=>'<text x="'+x+'" y="'+y+'" '+other+'>'+esc(s)+'</text>';
  const line=(x1,y1,x2,y2,cls='mbb3-grid')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
  function svg(content,height,alt) {return '<div class="mbb3-scroll" tabindex="0" role="region" aria-label="Chart; scroll horizontally for the full range"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(alt)+'" viewBox="0 0 720 '+height+'">'+content+'</svg></div>';}
  const fmt = (v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
  function dots(points, staticMode) {
    return points.map((p,i)=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="5"'+(staticMode?'':' tabindex="0" role="button" data-mbb3-point="'+i+'" aria-label="'+esc(p.label)+'"')+'><title>'+esc(p.label)+'</title></circle>').join('');
  }
  function inspector(points) {
    return '<label class="mbb3-inspector">Inspect an observation<select data-mbb3-observation aria-label="Inspect an observation">'+points.map((p,i)=>'<option value="'+i+'">'+esc(p.label)+'</option>').join('')+'</select></label><output class="mbb3-readout" data-mbb3-readout aria-live="polite">'+esc(points[0].label)+'</output>';
  }
  const alternative=(cols,rows,caption)=>'<details class="mbb3-data"><summary>View the same evidence as a data table</summary>'+table(cols,rows,caption)+'</details>';

  function graph(chart,staticMode) {
    const left=90,right=670,top=58,bottom=326;
    const acf=chart.type==='acf-plot', hist=chart.type==='histogram', interaction=chart.type==='two-level-interaction';
    const ys=acf?[-1,-.5,0,.5,1]:hist?Array.from({length:5},(_,i)=>i*Math.ceil(Math.max(...chart.counts)/4/10)*10):[0,20,40,60,80,100];
    const values=acf?chart.values:hist?chart.counts:interaction?chart.lowLine:chart.data;
    const n=values.length;
    const xs=hist?chart.binEdges:acf?chart.lags:interaction?[0,1]:values.map((_,i)=>i);
    const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=ys[0],ymax=ys.at(-1);
    const X=v=>(acf?left+12:left)+(v-xmin)/(xmax-xmin)*(acf?right-left-24:right-left);
    const Y=v=>bottom-(v-ymin)/(ymax-ymin)*(bottom-top);
    let out=text(18,27,chart.yLabel||'First-contact resolution (%)');
    ys.forEach(v=>{out+=line(left,Y(v),right,Y(v))+text(left-13,Y(v)+5,fmt(v),'text-anchor="end"');});
    xs.forEach((v,i)=>{const x=interaction?left+90+i*(right-left-180):X(v);out+=line(x,bottom,x,bottom+5,'mbb3-axis')+text(x,bottom+26,interaction?[chart.xLowLabel,chart.xHighLabel][i]:(!hist&&!acf?chart.labels[i]:fmt(v)),'text-anchor="middle"');});
    out+=line(left,top,left,bottom,'mbb3-axis')+line(left,bottom,right,bottom,'mbb3-axis');
    if(!interaction)out+=text((left+right)/2,bottom+58,chart.xLabel,'text-anchor="middle"');
    let points=[],rows=[],cols=[],height=402;
    if(hist) {
      chart.counts.forEach((v,i)=>{const x=X(chart.binEdges[i]),w=X(chart.binEdges[i+1])-x;out+='<rect x="'+(x+1)+'" y="'+Y(v)+'" width="'+(w-2)+'" height="'+(bottom-Y(v))+'" fill="var(--teal,#137c83)" stroke="currentColor" stroke-width="1"/>'+text(x+w/2,Y(v)-8,v,'text-anchor="middle"');});
      out+=line(X(chart.referenceValue),top,X(chart.referenceValue),bottom,'mbb3-second')+text(X(chart.referenceValue),top-12,chart.referenceLabel,'text-anchor="middle"');
      cols=['Interval ('+chart.xLabel+')','Count'];rows=chart.counts.map((v,i)=>[(chart.auditId.endsWith('070')?'(':'[')+chart.binEdges[i]+', '+chart.binEdges[i+1]+(chart.auditId.endsWith('070')||i===chart.counts.length-1?']':')'),v]);
    } else if(acf) {
      out+=line(left,Y(0),right,Y(0),'mbb3-axis');
      [chart.confidence,-chart.confidence].forEach(v=>{out+=line(left,Y(v),right,Y(v),'mbb3-second');});
      chart.values.forEach((v,i)=>{const x=left+12+i*(right-left-24)/(n-1),y=Y(v);out+='<rect x="'+(x-10)+'" y="'+Math.min(y,Y(0))+'" width="20" height="'+Math.abs(y-Y(0))+'" fill="var(--teal,#137c83)"/>';points.push({x,y,label:'Lag '+chart.lags[i]+': '+fmt(v)+'; pointwise reference ±'+chart.confidence});});
      out+=text(90,417,'Approximate pointwise 95% reference: ±'+chart.confidence);height=445;
      cols=['Lag','Residual ACF'];rows=chart.lags.map((v,i)=>[v,chart.values[i]]);
    } else if(interaction) {
      [chart.lowLine,chart.highLine].forEach((vals,k)=>{
        const pp=vals.map((v,i)=>({x:left+90+i*(right-left-180),y:Y(v),label:(k?chart.highLabel:chart.lowLabel)+', '+(i?chart.xHighLabel:chart.xLowLabel)+': '+v+'%'}));
        out+='<path class="'+(k?'mbb3-second':'mbb3-series')+'" d="'+pp.map((a,i)=>(i?'L':'M')+a.x+','+a.y).join(' ')+'"/>';
        out+=dots(pp,true);pp.forEach((a,i)=>{out+=text(a.x+(k?10:-10),a.y+(k?23:-15),vals[i]+'%',k?'text-anchor="start"':'text-anchor="end"');});
        out+=line(90+k*270,408,130+k*270,408,k?'mbb3-second':'mbb3-series')+text(145+k*270,413,k?chart.highLabel:chart.lowLabel);
      });height=443;
      cols=['Method',chart.xLowLabel,chart.xHighLabel];rows=[[chart.lowLabel,...chart.lowLine.map(v=>v+'%')],[chart.highLabel,...chart.highLine.map(v=>v+'%')]];
    } else {
      points=chart.data.map((v,i)=>({x:X(i),y:Y(v),label:'First-request fill rate, '+chart.labels[i]+': '+v+'%'}));
      out+='<path class="mbb3-series" d="'+points.map((a,i)=>(i?'L':'M')+a.x+','+a.y).join(' ')+'"/>';
      cols=['Week','First-request fill rate (%)'];rows=chart.labels.map((v,i)=>[v,chart.data[i]]);
    }
    if(points.length)out+=dots(points,staticMode);
    let result=svg(out,height,chart.altText)+(points.length&&!staticMode?inspector(points):'');
    result+=interaction?table(cols,rows,'Cell means: first-contact resolution'):alternative(cols,rows,'Source observations');
    if(interaction&&chart.anova)result+=table(chart.anova.columns,chart.anova.rows,'Fixed-effects ANOVA; error mean square = 49 pp²');
    return result;
  }
  function capacity(w,staticMode) {
    if(staticMode)return '<p class="mbb3-hint">Scored capacity: '+esc(w.baseline)+' '+esc(w.unit)+'; mandatory R consumes '+esc(w.committed)+'. No interactive control is required to answer.</p>';
    return '<section class="mbb3-capacity"><p class="mbb3-hint">Scored case: '+esc(w.baseline)+' '+esc(w.unit)+'. What-if settings do not change this question or its key.</p><label class="mbb3-inspector">Hypothetical total capacity <output data-mbb3-capacity-label>'+esc(w.value)+'</output> '+esc(w.unit)+'<input type="range" data-mbb3-capacity data-baseline="'+esc(w.baseline)+'" data-committed="'+esc(w.committed)+'" min="'+esc(w.min)+'" max="'+esc(w.max)+'" step="'+esc(w.step)+'" value="'+esc(w.value)+'" aria-label="Hypothetical capacity in BB-months" style="display:block;width:100%;min-height:44px"/></label><output class="mbb3-readout" data-mbb3-capacity-readout aria-live="polite">'+(w.value-w.committed)+' BB-months remain after mandatory Project R.</output><button type="button" data-mbb3-reset style="min-height:44px">Reset to scored capacity ('+esc(w.baseline)+' BB-months)</button></section>';
  }
  function render(chart,staticMode=false) {
    if(!chart || chart.auditBatch!==3)return '';
    let content='';
    if(chart.type==='data-table')content=table(chart.columns,chart.rows,'Question evidence')+(chart.whatIf?capacity(chart.whatIf,staticMode):'');
    else if(['time-series','acf-plot','histogram','two-level-interaction'].includes(chart.type))content=graph(chart,staticMode);
    else return '';
    return '<section class="mbb3-evidence" data-mbb3-chart="'+esc(chart.auditId)+'" aria-label="Question evidence">'+(chart.title?'<h4>'+esc(chart.title)+'</h4>':'')+content+'<p class="mbb3-hint">Wide evidence can be scrolled horizontally without shrinking its labels.</p></section>';
  }
  function inspect(el,index) {
    const scope=el.closest('.mbb3-evidence');if(!scope)return;
    const select=scope.querySelector('[data-mbb3-observation]'),output=scope.querySelector('[data-mbb3-readout]');
    if(!select||!output||!select.options[index])return;select.value=String(index);output.textContent=select.options[index].textContent;
  }
  function updateCapacity(el) {
    const scope=el.closest('.mbb3-capacity');if(!scope)return;
    scope.querySelector('[data-mbb3-capacity-label]').textContent=el.value;
    scope.querySelector('[data-mbb3-capacity-readout]').textContent=(Number(el.value)-Number(el.dataset.committed))+' BB-months remain after mandatory Project R.';
  }
  if(global.document) {
    document.addEventListener('change',e=>{if(e.target.matches('[data-mbb3-observation]'))inspect(e.target,Number(e.target.value));if(e.target.matches('[data-mbb3-capacity]'))updateCapacity(e.target);});
    document.addEventListener('input',e=>{if(e.target.matches('[data-mbb3-capacity]'))updateCapacity(e.target);});
    document.addEventListener('focusin',e=>{if(e.target.matches('[data-mbb3-point]'))inspect(e.target,Number(e.target.dataset.mbb3Point));});
    document.addEventListener('click',e=>{if(e.target.matches('[data-mbb3-point]'))inspect(e.target,Number(e.target.dataset.mbb3Point));if(e.target.matches('[data-mbb3-reset]')){const input=e.target.closest('.mbb3-capacity').querySelector('[data-mbb3-capacity]');input.value=input.dataset.baseline;updateCapacity(input);}});
    document.addEventListener('keydown',e=>{if(e.target.matches('[data-mbb3-point]')&&['Enter',' '].includes(e.key)){e.preventDefault();inspect(e.target,Number(e.target.dataset.mbb3Point));}});
  }
  global.__MBBBatch3UI={isQuestion,conditions,rationales,render,css};
})(window);

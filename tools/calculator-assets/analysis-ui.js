'use strict';
const CalculatorUI=(()=>{
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=CalculatorAnalysis.format;
  function table(t){return `<div class="analysis-table" tabindex="0" role="region" aria-label="${esc(t.title)}"><table><caption>${esc(t.title)}</caption><thead><tr>${t.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(fmt(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
  function plot(spec){
    let points=spec.points||[],bars=null;
    if(spec.type==='histogram'){
      const min=Math.min(...spec.values),max=Math.max(...spec.values),bins=Math.min(25,Math.max(1,Math.ceil(Math.sqrt(spec.values.length)))),w=max>min?(max-min)/bins:1;
      bars=Array.from({length:bins},(_,i)=>[min+(i+.5)*w,0]);spec.values.forEach(v=>bars[Math.min(bins-1,Math.floor((v-min)/w))][1]++);points=bars;
    }
    if(spec.type==='box'){
      const d=CalculatorAnalysis.describe(spec.values),low=d.sorted.find(v=>v>=d.q1-1.5*d.iqr),high=[...d.sorted].reverse().find(v=>v<=d.q3+1.5*d.iqr),span=d.sorted.at(-1)-d.sorted[0]||1,x=v=>60+(v-d.sorted[0])/span*600;
      return `<figure class="analysis-figure"><figcaption>${esc(spec.title)}</figcaption><svg viewBox="0 0 720 165" role="img" aria-label="${esc(spec.title)}"><title>Minimum ${fmt(d.sorted[0])}; Q1 ${fmt(d.q1)}; median ${fmt(d.median)}; Q3 ${fmt(d.q3)}; maximum ${fmt(d.sorted.at(-1))}</title><path class="axis" d="M${x(low)} 75H${x(high)} M${x(low)} 55V95 M${x(high)} 55V95"/><rect x="${x(d.q1)}" y="45" width="${Math.max(1,x(d.q3)-x(d.q1))}" height="60" fill="var(--panel)" stroke="var(--teal)"/><path class="fit" d="M${x(d.median)} 45V105"/>${d.sorted.filter(v=>v<low||v>high).map(v=>`<circle class="point" cx="${x(v)}" cy="75" r="4"/>`).join('')}<text x="60" y="135">${fmt(d.sorted[0])}</text><text x="360" y="155" text-anchor="middle">Median ${fmt(d.median)}</text><text x="660" y="135" text-anchor="end">${fmt(d.sorted.at(-1))}</text></svg></figure>`;
    }
    if(!points.length)return '';
    const all=points.filter(p=>p.every(Number.isFinite));
    if(!all.length)return '<p>No finite points in this window.</p>';
    const xVals=all.map(p=>p[0]), yVals=[...all.map(p=>p[1]),...(spec.limits||[])];
    let xmin=spec.bounds?.[0]??Math.min(...xVals),xmax=spec.bounds?.[1]??Math.max(...xVals),ymin=spec.bounds?.[2]??Math.min(...yVals),ymax=spec.bounds?.[3]??Math.max(...yVals);
    if(xmin===xmax){xmin-=.5;xmax+=.5;}if(ymin===ymax){ymin-=.5;ymax+=.5;}
    if(!spec.bounds){const xp=(xmax-xmin)*.06,yp=(ymax-ymin)*.1;xmin-=xp;xmax+=xp;ymin=bars?0:ymin-yp;ymax+=yp;}
    const X=x=>68+(x-xmin)/(xmax-xmin)*600,Y=y=>290-(y-ymin)/(ymax-ymin)*235;
    let svg=`<svg viewBox="0 0 720 345" role="img" aria-label="${esc(spec.title)}"><title>${esc(spec.title)}</title><path class="axis" fill="none" d="M68 45V290H680"/>`;
    for(let i=0;i<=4;i++){let x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;svg+=`<text x="${X(x)}" y="315" text-anchor="middle">${esc(Number(x.toPrecision(4)))}</text><text x="60" y="${Y(y)+4}" text-anchor="end">${esc(Number(y.toPrecision(4)))}</text>`;}
    (spec.limits||[]).forEach(y=>svg+=`<path class="limit" d="M68 ${Y(y)}H668"/><text x="674" y="${Y(y)}">${esc(Number(y.toPrecision(3)))}</text>`);
    if(bars){const width=Math.min(40,560/bars.length);bars.forEach(p=>svg+=`<rect class="point" x="${X(p[0])-width/2}" y="${Y(p[1])}" width="${width}" height="${290-Y(p[1])}"><title>Bin center ${fmt(p[0])}: ${p[1]} observations</title></rect>`);}
    else{
      if(spec.type==='sequence')svg+=`<polyline class="fit" points="${all.map(p=>`${X(p[0])},${Y(p[1])}`).join(' ')}"/>`;
      all.slice(0,1500).forEach(p=>{if(p[0]>=xmin&&p[0]<=xmax&&p[1]>=ymin&&p[1]<=ymax)svg+=`<circle class="point" cx="${X(p[0])}" cy="${Y(p[1])}" r="3" opacity="0.65"><title>${fmt(p[0])}, ${fmt(p[1])}</title></circle>`;});
    }
    if(spec.line)svg+=`<polyline class="fit" points="${[...spec.line].sort((a,b)=>a[0]-b[0]).map(p=>`${X(p[0])},${Y(p[1])}`).join(' ')}"/>`;
    svg+=`<text x="365" y="339" text-anchor="middle">${esc(spec.xlabel|| (bars?'Value':spec.type==='sequence'?'Observation':'X / fitted value / group'))}</text><text x="12" y="24">${bars?'Count':esc(spec.ylabel||'Y')}</text></svg>`;
    return `<figure class="analysis-figure"><figcaption>${esc(spec.title)}</figcaption>${svg}${all.length>1500?'<p class="hint">Plot shows the first 1,500 points; calculations use all values.</p>':''}</figure>`;
  }
  function download(name,text,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function setupTabs(){const tabs=[...document.querySelectorAll('.tab')];tabs.forEach((tab,i)=>{
    tab.id='tab-'+tab.dataset.page;tab.setAttribute('aria-controls',tab.dataset.page);
    const panel=document.getElementById(tab.dataset.page);panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);
    const sync=()=>tabs.forEach(t=>{t.setAttribute('aria-selected',t===tab?'true':'false');t.tabIndex=t===tab?0:-1;document.getElementById(t.dataset.page).classList.toggle('active',t===tab);t.classList.toggle('active',t===tab);});
    tab.onclick=sync;tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const target=tabs[e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];target.click();target.focus();});
    tab.setAttribute('aria-selected',tab.classList.contains('active')?'true':'false');tab.tabIndex=tab.classList.contains('active')?0:-1;
  });}
  setupTabs();
  // Associate legacy generated labels with their numeric controls.
  let labelSerial=0;
  function labels(){if(typeof document==='undefined'||!document)return;document.querySelectorAll('label.f:not([for])').forEach((label,i)=>{const input=label.nextElementSibling;if(input?.matches('input,select,textarea')){input.id ||= 'legacy-input-'+(++labelSerial);label.htmlFor=input.id;}});document.querySelectorAll('.seg button').forEach(b=>b.setAttribute('aria-pressed',b.classList.contains('on')?'true':'false'));}
  labels();new MutationObserver(labels).observe(document.getElementById('dparams'),{childList:true,subtree:true});
  new MutationObserver(labels).observe(document.getElementById('dinputs'),{childList:true});new MutationObserver(labels).observe(document.getElementById('tparams'),{childList:true});
  document.querySelectorAll('.seg').forEach(s=>s.addEventListener('click',labels));
  return {esc,table,plot,download,setupTabs};
})();
(()=>{
  const el=id=>document.getElementById('analysis-'+id), A=CalculatorAnalysis,U=CalculatorUI;
  const help={summary:'All cells are treated as one numeric sample. Read the mean interval alongside the spread and histogram.',regression:'Paste exactly two columns per row: X then Y. At least three paired observations are required.',capability:'Paste individual measurements in time order. Enter one or both engineering specification limits.',anova:'Paste one group per row. Groups may contain different numbers of observations (at least two each).',chi:'Paste a rectangular table of observed counts. Each row and column represents a category; no totals or headers.'};
  const examples={summary:'49.6\n47.6\n49.9\n51.3\n47.8\n51.2\n52.6\n52.4\n53.6\n52.1',regression:'1,2.1\n2,4.3\n3,5.8\n4,8.2\n5,9.9\n6,12.2',capability:'49.6\n47.6\n49.9\n51.3\n47.8\n51.2\n52.6\n52.4\n53.6\n52.1',anova:'6.9,5.4,5.8,4.6,4.0\n8.3,6.8,7.8,9.2,6.5\n8.0,10.5,8.1,6.9,9.3',chi:'30,20,10\n20,30,40'};
  for(const kind of ['poly2','poly3','poly4','log','exp','power']){help[kind]='Paste X,Y pairs (one pair per row). Polynomial models require more observations than fitted coefficients. Log/power need positive X; exponential/power need positive Y.';examples[kind]='1,2.1\n2,4.3\n3,8.8\n4,16.2\n5,24.9\n6,36.2';}
  help.gof='Exactly two rows: observed counts in the first, expected counts in the second. Totals must match; expected proportions must be specified independently.';examples.gof='18,22,20,25,15\n20,20,20,20,20';
  let result=null,report='';
  function clearResult(message){result=null;el('status').textContent=message;el('status').dataset.error='false';['results','charts','tables','notes'].forEach(id=>el(id).replaceChildren());el('export').disabled=true;el('csv').disabled=true;}
  function change(){el('help').textContent=help[el('kind').value];el('specs').hidden=el('kind').value!=='capability';clearResult('Inputs changed. Analyze data to update results.');}
  el('kind').onchange=change;el('help').textContent=help.summary;
  ['data','confidence','alpha','lsl','usl'].forEach(id=>el(id).addEventListener('input',()=>clearResult('Inputs changed. Analyze data to update results.')));
  el('run').onclick=()=>{clearResult('Analyzing…');try{
    const rows=A.parse(el('data').value),kind=el('kind').value,confidence=Number(el('confidence').value),alpha=Number(el('alpha').value);
    const limit=id=>el(id).value.trim()===''?null:strictNumber(el(id).value);
    result=kind==='summary'?A.summary(rows.flat(),confidence):kind==='regression'?A.regression(rows,confidence):kind==='capability'?A.capability(rows.flat(),limit('lsl'),limit('usl')):['poly2','poly3','poly4','log','exp','power'].includes(kind)?A.curveFit(rows,kind):A[kind](rows,alpha);
    el('title').textContent=result.title;el('status').textContent=`Calculated from ${rows.flat().length} numeric values. Results reflect the inputs below.`;
    el('results').innerHTML=result.metrics.map(([key,value])=>`<div class="res"><div class="k">${U.esc(key)}</div><div class="v">${U.esc(A.format(value))}</div></div>`).join('');
    el('charts').innerHTML=result.charts.map(U.plot).join('');el('tables').innerHTML=result.tables.map(U.table).join('');el('notes').innerHTML=result.notes.map(n=>`<p>${U.esc(n)}</p>`).join('');
    report=[result.title,`Generated: ${new Date().toISOString()}`,`Confidence: ${confidence}; alpha: ${alpha}`,'',...result.metrics.map(r=>r[0]+': '+A.format(r[1])),'',...result.notes,'',...result.tables.flatMap(t=>[t.title,t.headers.join('\t'),...t.rows.map(r=>r.map(A.format).join('\t'))]),'','Input data:',el('data').value].join('\n');
    el('export').disabled=false;el('csv').disabled=false;
  }catch(error){clearResult(error.message);el('status').dataset.error='true';}};
  el('example').onclick=()=>{el('data').value=examples[el('kind').value];if(el('kind').value==='capability'){el('lsl').value='45';el('usl').value='55';}el('run').click();};
  el('clear').onclick=()=>{el('data').value='';clearResult('Data cleared. Paste data or load an example.');};
  el('export').onclick=()=>{if(result)U.download('engineering-'+result.kind+'-report.txt',report);};
  el('csv').onclick=()=>{if(result){const cell=v=>'"'+String(v).replace(/"/g,'""')+'"';const rows=[['Metric','Value'],...result.metrics,...result.tables.flatMap(t=>[[],[t.title],t.headers,...t.rows])];U.download('engineering-'+result.kind+'-results.csv',rows.map(r=>r.map(cell).join(',')).join('\r\n'),'text/csv');}};
})();

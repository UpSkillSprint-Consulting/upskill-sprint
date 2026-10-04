'use strict';
(()=>{
 const S=CalculatorSPC,A=CalculatorAnalysis,D=GuidedData,U=CalculatorUI,esc=U.esc,fmt=A.format,el=id=>document.getElementById('spc-'+id);
 const numericText=rows=>rows.map(r=>r.join(',')).join('\n');
 let result=null,frozen=null,source='Pasted measurements',labels=null,restoreVersion=0;
 const help={imr:'One individual measurement per row. Moving ranges use adjacent observations within each phase.',xr:'One rational subgroup per row, 2–10 numeric measurements across columns. Equal subgroup size is required.',xs:'One rational subgroup per row, 2–100 numeric measurements across columns. Equal subgroup size is required.',p:'Two columns: nonconforming units, inspected units. An inspected unit is counted at most once. Sample size may vary.',np:'Two columns: nonconforming units, inspected units. Sample size must be identical in all baseline and monitoring rows.',c:'One defect count per row. An item can have multiple defects. Every row must cover the same inspection opportunity.',u:'Two columns: defect count, inspected exposure. Exposure may vary (for example inspected metres); use the same unit throughout.',ewma:'One measurement per row. λ controls memory; L controls limit width. Baseline sample standard deviation estimates sigma. Limits widen from their initial value toward steady state.',cusum:'One measurement per row. Standardized upper/lower cumulative sums use baseline sample sigma. k and h are in sigma units; sums start at zero and do not reset after a signal.'};
 function status(text,error=false){el('status').textContent=text;el('status').dataset.error=String(error);}
 function invalidate(message='Inputs changed. Run Analyze process for current results.'){
  result=null;el('output').hidden=true;['report','csv','freeze'].forEach(id=>el(id).disabled=true);['summary','charts','capability','tables','notes'].forEach(id=>el(id).replaceChildren());status(message);
 }
 const guarded=fn=>(...args)=>{try{return fn(...args);}catch(e){status(e.message,true);}};
 function design(){const k=el('kind').value;el('help').textContent=help[k];el('ewma').hidden=k!=='ewma';el('cusum').hidden=k!=='cusum';el('specs').hidden=S.attr(k);el('exposure-box').hidden=k!=='c';el('rules-box').hidden=!['imr','xr','xs'].includes(k);}
 function baselineUI(){el('kind').disabled=!!frozen;el('example').disabled=!!frozen;el('estimate').hidden=!!frozen;el('release').disabled=!frozen;el('save-baseline').disabled=!frozen;el('baseline-status').textContent=frozen?`Frozen ${S.kinds[frozen.kind]} baseline: ${frozen.rows.length} rows; center ${fmt(frozen.center)}. Input now contains monitoring rows only. Limits do not refit to them.`:'No frozen baseline. Estimate from the first rows.';}
 function options(){const o={kind:el('kind').value,source,labels};for(const id of ['baseline','lambda','L','k','h','lsl','usl','confidence'])o[id==='baseline'?'baselineRows':id]=el(id).value;for(const [key,id]of [['rules','rules'],['timeOrder','time-order'],['normal','normal'],['exposure','exposure']])o[key]=el(id).checked;return o;}
 for(const id of ['kind','baseline','lambda','L','k','h','lsl','usl','confidence','rules','time-order','normal','exposure'])for(const event of ['input','change'])el(id).addEventListener(event,()=>{restoreVersion++;invalidate();design();});
 el('data').addEventListener('input',()=>{restoreVersion++;labels=null;source=source==='Pasted measurements'?source:'Edited SPC input (prior source: '+source.slice(0,250)+')';el('source').textContent=source;invalidate();});
 function plot(chart){
  const pts=chart.points;if(!pts.length)return '';const all=pts.flatMap(p=>[p.value,p.lo,p.hi,p.cl]);let low=Math.min(...all),high=Math.max(...all);const pad=(high-low||Math.max(1,Math.abs(high)))*.12;low-=pad;high+=pad;
  const x=i=>82+(i-1)/Math.max(1,pts.at(-1).index-1)*570,y=v=>260-(v-low)/(high-low)*205;
  const line=(key,cls)=>`<polyline class="${cls}" points="${pts.map(p=>`${x(p.index)},${y(p[key])}`).join(' ')}"/>`;
  let svg=`<svg viewBox="0 0 730 315" role="img" aria-label="${esc(chart.name)}"><title>${esc(chart.name)}. ${pts.length} points; ${pts.filter(p=>p.signals.length).length} signal points. Values and reasons are in the table.</title>`;
  for(let i=0;i<=4;i++){const v=low+(high-low)*i/4;svg+=`<text x="73" y="${y(v)+4}" text-anchor="end">${esc(Number(v.toPrecision(4)))}</text>`;}
  svg+=line('lo','spc-limit')+line('hi','spc-limit')+line('cl','spc-cl')+line('value','spc-data');
  const boundary=pts.findIndex(p=>p.phase==='Monitoring');if(boundary>0){const at=x((pts[boundary-1].index+pts[boundary].index)/2);svg+=`<path class="spc-boundary" d="M${at} 40V266"/><text x="${Math.min(at+6,610)}" y="30">Monitoring →</text>`;}
  // Keep every signal marker even on large charts; ordinary markers are thinned.
  pts.forEach((p,i)=>{if(p.signals.length||i%Math.max(1,Math.ceil(pts.length/300))===0)svg+=`<circle class="${p.signals.length?'spc-signal':''}" fill="var(--teal)" cx="${x(p.index)}" cy="${y(p.value)}" r="${p.signals.length?4:2}"><title>${esc(p.phase+' point '+p.index+'; source '+p.label+': '+fmt(p.value)+(p.signals.length?'; '+p.signals.join('; '):''))}</title></circle>`;});
  svg+=`<text x="82" y="283">${pts[0].index}</text><text x="650" y="283" text-anchor="end">${pts.at(-1).index}</text><text x="365" y="307" text-anchor="middle">Time-ordered point</text></svg>`;
  return `<figure class="analysis-figure"><figcaption>${esc(chart.name)}</figcaption>${svg}<p class="hint">Teal: statistic · dashed red: control limits · dotted: center · red markers: signals. Exact values and reasons appear below.</p></figure>`;
 }
 function render(r){
  el('output').hidden=false;el('summary').innerHTML=`<strong>${r.baselineSignals?'Baseline needs investigation':'No selected baseline signal detected'}</strong><p>${r.model.rows.length} baseline rows · ${r.baselineSignals} baseline signal points · ${r.monitorSignals} monitoring signal points across the chart panels.</p><p>${r.monitorSignals?'Investigate the flagged observations and process changes; document causes before revising limits.':'Continue monitoring against the approved baseline. No detected signal does not prove the process is stable.'}</p>`;
  el('charts').innerHTML=r.charts.map(plot).join('');
  el('tables').innerHTML=r.charts.map(c=>U.table({title:c.name,headers:['Point','Source row','Phase','Value','CL','LCL','UCL','Signal'],rows:c.points.slice(0,200).map(p=>[p.index,p.label,p.phase,p.value,p.cl,p.lo,p.hi,p.signals.join('; ')||'—'])})).join('');
  const cap=r.capability;if(cap){
   const compliance=(label,o)=>`<p><strong>${label}:</strong> ${o.n} measurements; ${o.below} below LSL; ${o.above} above USL${o.n?`; ${fmt(100*(o.below+o.above)/o.n)}% observed outside specifications`:''}.</p>`;
   el('capability').innerHTML='<h3>Specification compliance &amp; baseline capability</h3>'+compliance('Baseline',cap.observed)+compliance('Monitoring',cap.monitoring)+(cap.rows.length?U.table({title:'Baseline capability estimates',headers:['Index','Estimate',`${r.options.confidence*100}% lower`,`${r.options.confidence*100}% upper`,'Estimator / interval'],rows:cap.rows.map(v=>[v.index,v.value,v.interval?.[0]??'Withheld',v.interval?.[1]??'Withheld',v.method])}):'')+cap.notes.map(n=>`<p class="hint">${esc(n)}</p>`).join('');
  }
  el('notes').innerHTML=r.notes.map(n=>`<p>${esc(n)}</p>`).join('');['report','csv'].forEach(id=>el(id).disabled=false);el('freeze').disabled=!!frozen||r.baselineSignals>0;
  status('Analysis complete. Review the chart panels, assumptions and signal reasons.');
  el('status').focus({preventScroll:true});el('status').scrollIntoView?.({block:'start',behavior:'instant'});
 }
 el('run').onclick=()=>{invalidate();try{const rows=A.parse(el('data').value);result=S.run(rows,options(),frozen);render(result);}catch(e){invalidate();status(e.message,true);}};
 const noise=[-.4,.3,-.1,.6,-.6,.2,.4,-.2,.1,-.5,.5,0,-.3,.2,-.1,.4,-.4,.1,.5,-.2,.3,-.5,.2,-.1,0];
 el('example').onclick=guarded(()=>{
  restoreVersion++;const k=el('kind').value;let rows=[];
  for(let i=0;i<35;i++){
   const shift=i>=25?1.5:0,v=10+noise[i%25]+shift;
   if(S.sub(k))rows.push([v-.8,v+.2,v+.8,v-.3,v+.1]);
   else if(['p','np'].includes(k)){const n=k==='np'?100:80+(i%3)*20;rows.push([i>=25?25:4+(i*7)%5,n]);}
   else if(k==='c')rows.push([i>=25?20:4+(i*7)%6]);
   else if(k==='u')rows.push([i>=25?25:4+(i*7)%6,1+(i%3)*.5]);
   else rows.push([v]);
  }
  el('data').value=numericText(rows.map(r=>r.map(v=>Number(v.toFixed(6)))));el('baseline').value='25';source='Fictitious training example: '+S.kinds[k];labels=null;el('source').textContent=source;el('time-order').checked=true;el('exposure').checked=k==='c';el('normal').checked=false;el('rules').checked=false;el('lsl').value=S.attr(k)?'':'7';el('usl').value=S.attr(k)?'':'13';
  invalidate('Example loaded: 25 baseline rows, followed by 10 monitoring rows. Review assumptions, then analyze.');
 });
 el('freeze').onclick=guarded(()=>{
  if(!result||frozen)return;D.check(!result.baselineSignals,'Investigate baseline signals before freezing.');restoreVersion++;
  frozen=S.restore(JSON.stringify(result.model));const n=result.baselineRows;el('data').value=numericText(result.rows.slice(n));labels=labels?.slice(n)||null;
  baselineUI();invalidate('Baseline frozen. Only monitoring rows remain in the editor. Analyze them or append later rows; save the baseline before closing.');
 });
 el('release').onclick=guarded(()=>{
  if(!frozen)return;const rows=el('data').value.trim()?A.parse(el('data').value):[];
  D.check(frozen.rows.flat().length+rows.flat().length<=10000,'Combined data exceed 10,000 values. Save the baseline and reduce the monitoring input before releasing.');
  restoreVersion++;el('data').value=numericText([...frozen.rows,...rows]);el('baseline').value=String(frozen.rows.length);source='Released baseline '+frozen.source+'; monitoring: '+source;labels=null;el('source').textContent=source;frozen=null;baselineUI();invalidate('Baseline released and restored before the monitoring rows. Refit only after reviewing any changes.');
 });
 el('save-baseline').onclick=guarded(()=>{if(frozen)U.download('upskillsprint-spc-baseline.json',JSON.stringify(frozen,null,2),'application/json');});
 el('restore').onchange=async()=>{
  const file=el('restore').files?.[0];if(!file)return;const version=++restoreVersion;
  try{D.check(file.size<=1000000,'Baseline JSON must be at most 1 MB.');const text=await file.text();if(version!==restoreVersion)return;const m=S.restore(text);
   // Preserve input until user explicitly chooses to replace it.
   if(el('data').value.trim()&&!window.confirm('Restore this baseline and clear the current SPC input? Download a report first if you need to keep this input.'))return;
   frozen=m;el('kind').value=m.kind;el('data').value='';source='Monitoring against restored baseline';labels=null;el('source').textContent=source;el('time-order').checked=false;el('normal').checked=false;el('exposure').checked=false;design();baselineUI();invalidate('Baseline restored. Paste the complete monitoring sequence and review sampling assumptions. No analysis ran automatically.');
  }catch(e){if(version===restoreVersion)status(e.message,true);}finally{el('restore').value='';}
 };
 el('show-data').onclick=guarded(()=>{const {dataset:d}=window.GuidedWorkspace.snapshot();el('columns').textContent=`${d.name} · revision ${d.revision}: `+d.columns.map((v,i)=>`${i+1} = ${v}`).join('; ');});
 el('use-data').onclick=guarded(()=>{
  const {dataset:d,settings:o}=window.GuidedWorkspace.snapshot(),tokens=el('map').value.split(',');
  D.check(tokens.every(v=>/^\s*\d+\s*$/.test(v)),'Enter comma-separated column numbers.');const cols=tokens.map(v=>Number(v)-1);D.check(cols.every(i=>i>=0&&i<d.columns.length)&&new Set(cols).size===cols.length,'Select valid, distinct column numbers.');
  const excluded=new Set(d.excluded),rows=[],refs=[];
  d.rows.forEach((r,i)=>{if(excluded.has(i))return;if(o.filterColumn!==''&&o.filterColumn!=null&&r[Number(o.filterColumn)]!==o.filterValue)return;rows.push(cols.map(j=>r[j]));refs.push(String(d.sourceRows[i]));});
  const values=S.validate(rows,el('kind').value);const text=numericText(values);D.check(text.length<=250000,'Selected data exceed 250,000 characters.');restoreVersion++;
  el('data').value=text;labels=refs;source=`${d.name}; revision ${d.revision}; source ${d.source}; columns ${cols.map(i=>d.columns[i]).join(', ')}; ${rows.length}/${d.rows.length} rows copied; ${d.rows.length-rows.length} omitted by explicit exclusions/filter. Filter: ${o.filterColumn===''?'none':d.columns[Number(o.filterColumn)]+' = '+o.filterValue}`;
  el('source').textContent=source;el('time-order').checked=false;el('normal').checked=false;invalidate('Copied a snapshot with source row references. Verify chronological order, baseline row count and sampling assumptions.');
 });
 el('report').onclick=guarded(()=>{if(result)U.download('upskillsprint-spc-report.txt',S.report(result));});
 el('csv').onclick=guarded(()=>{if(result)U.download('upskillsprint-spc-charts.csv',D.csv([['Chart','Point','Source row','Phase','Value','CL','LCL','UCL','Signals'],...result.charts.flatMap(c=>c.points.map(p=>[c.name,p.index,p.label,p.phase,p.value,p.cl,p.lo,p.hi,p.signals.join('; ')]))]),'text/csv;charset=utf-8');});
 design();baselineUI();
})();

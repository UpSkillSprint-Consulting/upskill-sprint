from pathlib import Path
root=Path.cwd();p=root/'test-bank-mbb-set3-batch3-ui.js';s=p.read_text();a=s.index(' function plot(c){');b=s.index(' function rationales',a)
s=s[:a]+r'''
 function network(c){
  const entries=Object.entries(c.nodes),width=entries.some(([,n])=>n.col===2)?840:560;
  const X=n=>20+n.col*280,Y=n=>20+n.row*112;
  let svg='<svg viewBox="0 0 '+width+' 348" role="img" aria-label="'+esc(c.altText)+'">';
  c.edges.forEach(([from,to])=>{const a=c.nodes[from],b=c.nodes[to],x=X(a)+220,y=Y(a)+42,tx=X(b),ty=Y(b)+42,m=(x+tx)/2;
   svg+='<path class="mbbs3b3-edge" d="M'+x+' '+y+' H'+m+' V'+ty+' H'+(tx-6)+'"/>';
   svg+='<path class="mbbs3b3-arrow" d="M'+tx+' '+ty+' l-9 -5 v10 z"/>';
  });
  entries.forEach(([name,n])=>{
   const words=name.split(' '),lines=[];let line='';words.forEach(w=>{if((line+' '+w).trim().length>22){lines.push(line);line=w;}else line=(line+' '+w).trim();});if(line)lines.push(line);
   const x=X(n),y=Y(n);svg+='<g class="mbbs3b3-node"><rect x="'+x+'" y="'+y+'" width="220" height="84" rx="8"/>';
   lines.forEach((line,i)=>{svg+='<text x="'+(x+110)+'" y="'+(y+24+i*20)+'" text-anchor="middle">'+esc(line)+'</text>';});
   svg+='<text x="'+(x+110)+'" y="'+(y+68)+'" text-anchor="middle">'+n.dur+(n.dur===1?' day':n.dur===0?' days (milestone)':' days')+'</text></g>';
  });
  svg+='</svg>';
  const rows=entries.map(([name,n])=>[name,String(n.dur),c.edges.filter(e=>e[1]===name).map(e=>e[0]).join('; ')||'None']);
  return '<figure class="mbbs3b3-network"><figcaption>'+esc(c.title)+'</figcaption><div class="mbbs3b3-scroll" role="region" tabindex="0" aria-label="Dependency network; scroll horizontally for all nodes">'+svg+'</div><p class="mbbs3b3-hint">Arrows show predecessor relationships, not a time-scaled axis. Scroll within the diagram on small screens.</p><details class="mbbs3b3-network-data"><summary>View network as a table</summary>'+table({title:'Network data (days)',columns:['Activity / milestone','Duration','Predecessors'],rows})+'</details></figure>';
 }
 function scenario(c,raw){
  const w=c.whatIf,v=Number.isFinite(Number(raw))?Math.min(w.max,Math.max(w.min,Math.round((Number(raw)-w.min)/w.step)*w.step+w.min)):w.value;
  const capacity=c.interactiveKind==='capacity',demands=capacity?c.rows.map(r=>Number(r[2])):[c.rows.reduce((sum,r)=>sum+Number(r[1].replace(/[^0-9.]/g,''))/1000,0)];
  const ceiling=capacity?40:800,labels=capacity?c.rows.map(r=>r[0]):['All candidates'],X=n=>130+n/ceiling*360,height=80+demands.length*55;
  let svg='<svg viewBox="0 0 560 '+height+'" role="img" aria-label="'+esc((capacity?'Weekly demand against scenario capacity ':'All-candidate investment against scenario budget ')+v+(capacity?' hours per Belt':' thousand dollars'))+'">';
  [0,ceiling/4,ceiling/2,ceiling*3/4,ceiling].forEach(t=>{svg+='<text x="'+X(t)+'" y="20" text-anchor="middle">'+t+'</text>';});
  demands.forEach((d,i)=>{const y=38+i*55;svg+='<text x="118" y="'+(y+21)+'" text-anchor="end">'+esc(labels[i])+'</text><rect class="mbbs3b3-demand" x="130" y="'+y+'" width="'+(d/ceiling*360)+'" height="30"/><text x="'+(X(d)+8)+'" y="'+(y+21)+'">'+d+'</text>';});
  svg+='<line class="mbbs3b3-capacity-line" x1="'+X(v)+'" x2="'+X(v)+'" y1="28" y2="'+(height-25)+'"/><text x="310" y="'+(height-5)+'" text-anchor="middle">'+(capacity?'Hours per week':'Capital ($000)')+'</text></svg>';
  const total=demands.reduce((a,b)=>a+b,0),cap=v*demands.length,excess=total-cap;
  const text=capacity?'Scenario capacity '+v+' hours per Belt; total demand '+total+' hours; total capacity '+cap+' hours; '+(excess>0?'shortfall '+excess:'spare capacity '+(-excess))+' hours.':'Scenario budget $'+(v*1000).toLocaleString('en-US')+'; all-candidate investment $750,000; '+(excess>0?'shortfall $'+(excess*1000).toLocaleString('en-US'):'all candidates fit.');
  return {value:v,svg,text};
 }
 function explorer(c){const w=c.whatIf,r=scenario(c,w.value);return '<section class="mbbs3b3-explorer" data-b3-explorer="'+esc(JSON.stringify(c))+'"><p class="mbbs3b3-hint">Exploration only. The scored question uses the stated baseline, not a changed slider value. Bars show demand; the dashed line shows scenario capacity. Changing an answer resets this exploration.</p><label>'+esc(w.label)+' <input type="range" data-b3-slider min="'+w.min+'" max="'+w.max+'" step="'+w.step+'" value="'+w.value+'" aria-valuetext="'+esc(r.text)+'"></label><output data-b3-output aria-live="polite">'+esc(r.text)+'</output><div class="mbbs3b3-scroll" role="region" tabindex="0" aria-label="Demand and scenario capacity chart"><div data-b3-bars>'+r.svg+'</div></div><button type="button" data-b3-reset>Reset to question baseline</button></section>';}
 function render(q,review){if(!isQuestion(q))return '';const c=q.chart;return '<div class="mbbs3b3-question"><div class="'+(review?'tb-review-stem':'tb-stem')+'" data-question-id="'+esc(q.qid)+'" tabindex="-1">'+esc(q.stem)+'</div>'+(c?'<div class="mbbs3b3-evidence">'+(c.type==='data-table'?table(c):network(c))+(c.whatIf?explorer(c):'')+'</div>':'')+'</div>';}
''' + s[b:]
marker='`;document.head.appendChild(style);'
extra=r'''
.mbbs3b3-network{margin:0}.mbbs3b3-network figcaption{font-weight:650;font-size:15px;padding:12px 0}.mbbs3b3-network svg{display:block;min-width:560px;width:100%;height:auto}.mbbs3b3-network svg[viewBox="0 0 840 348"]{min-width:840px}.mbbs3b3-node rect{fill:var(--card);stroke:var(--ink);stroke-width:1.5}.mbbs3b3-network text,.mbbs3b3-explorer svg text{font:16px Arial,sans-serif;fill:var(--ink)!important}.mbbs3b3-edge{fill:none;stroke:var(--ink);stroke-width:2}.mbbs3b3-arrow{fill:var(--ink)}.mbbs3b3-hint{font-size:13px;line-height:1.65;color:var(--ink)!important}.mbbs3b3-network-data summary{padding:10px 0;cursor:pointer;color:var(--ink)!important}.mbbs3b3-explorer{margin-top:16px;max-width:100%}.mbbs3b3-explorer label{display:block;font-weight:600;font-size:14px;color:var(--ink)!important}.mbbs3b3-explorer input{display:block;width:100%;min-height:44px;accent-color:#0b5464}.mbbs3b3-explorer output{display:block;font-size:14px;line-height:1.7;color:var(--ink)!important;margin:8px 0}.mbbs3b3-explorer svg{display:block;min-width:560px;width:100%;height:auto}.mbbs3b3-demand{fill:var(--ink-soft)}.mbbs3b3-capacity-line{stroke:var(--ink);stroke-width:3;stroke-dasharray:5 3}.mbbs3b3-explorer button{min-height:44px;padding:8px 12px;margin-top:10px;border:1px solid var(--ink);border-radius:6px;background:var(--card);color:var(--ink)!important;cursor:pointer}.mbbs3b3-explorer :focus-visible,.mbbs3b3-network-data summary:focus-visible{outline:3px solid var(--teal);outline-offset:3px}
'''
assert marker in s;s=s.replace(marker,extra+marker)
mark="  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-opt],[data-flag]')"
new=r'''
  function updateExplorer(host,value){const c=JSON.parse(host.dataset.b3Explorer),r=scenario(c,value),slider=host.querySelector('[data-b3-slider]');slider.value=String(r.value);slider.setAttribute('aria-valuetext',r.text);host.querySelector('[data-b3-output]').textContent=r.text;host.querySelector('[data-b3-bars]').innerHTML=r.svg;}
  document.addEventListener('input',e=>{if(e.target.matches?.('[data-b3-slider]'))updateExplorer(e.target.closest('[data-b3-explorer]'),e.target.value);});
  document.addEventListener('click',e=>{const button=e.target.closest?.('[data-b3-reset]');if(button){const host=button.closest('[data-b3-explorer]');updateExplorer(host,JSON.parse(host.dataset.b3Explorer).whatIf.value);}});
'''
assert mark in s;s=s.replace(mark,new+mark);s=s.replace('{isQuestion,render,rationales,wire}','{isQuestion,render,rationales,wire,scenario}');p.write_text(s)

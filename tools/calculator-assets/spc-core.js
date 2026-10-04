/* Advanced SPC v1. Baseline estimation is separate from monitoring.
 * NIST/SEMATECH §§6.3.2, 6.3.3 and 6.1.6; see manual §23. */
'use strict';
const CalculatorSPC=(()=>{
 const A=CalculatorAnalysis,D=GuidedData,check=D.check;
 const kinds={imr:'Individuals / moving range',xr:'X-bar / R',xs:'X-bar / S',p:'p — fraction nonconforming',np:'np — nonconforming count',c:'c — defect count',u:'u — defects per unit',ewma:'EWMA',cusum:'CUSUM'};
 const attr=k=>['p','np','c','u'].includes(k),sub=k=>['xr','xs'].includes(k);
 const mean=a=>a[0]+a.reduce((s,x)=>s+(x-a[0]),0)/a.length;
 const variance=a=>{const m=mean(a);return a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1);};
 const range=a=>Math.max(...a)-Math.min(...a);
 const factors={2:[1.128,0,3.267],3:[1.693,0,2.575],4:[2.059,0,2.282],5:[2.326,0,2.115],6:[2.534,0,2.004],7:[2.704,.076,1.924],8:[2.847,.136,1.864],9:[2.970,.184,1.816],10:[3.078,.223,1.777]};
 function number(v,label){const n=typeof v==='number'?v:D.number(String(v??''));check(Number.isFinite(n)&&Math.abs(n)<=1e100,`${label}: enter a finite number within ±1e100.`);return n;}
 function validate(rows,kind){
  check(kinds[kind],'Choose a supported chart.');check(Array.isArray(rows)&&rows.length>0&&rows.length<=10000,'Use 1–10,000 time-ordered rows.');
  let cells=0;const out=rows.map((r,i)=>{check(Array.isArray(r)&&r.length>0,'Every row needs measurements.');cells+=r.length;return r.map(v=>number(v,`Row ${i+1}`));});
  check(cells<=10000,'Use at most 10,000 numeric values.');
  const width=sub(kind)?out[0].length:['p','np','u'].includes(kind)?2:1;
  check(out.every(r=>r.length===width),`Every row must contain ${width} value${width===1?'':'s'}; subgroup size must be constant.`);
  if(sub(kind))check(width>=2&&width<=(kind==='xr'?10:100),kind==='xr'?'X-bar/R needs 2–10 measurements per subgroup.':'X-bar/S needs 2–100 measurements per subgroup.');
  if(attr(kind))out.forEach((r,i)=>{
   check(Number.isSafeInteger(r[0])&&r[0]>=0,`Row ${i+1}: count must be a nonnegative safe integer.`);
   if(width===2){check(r[1]>0&&r[1]<=1e9,`Row ${i+1}: denominator must be positive and at most 1 billion.`);if(kind!=='u')check(Number.isSafeInteger(r[1])&&r[0]<=r[1],`Row ${i+1}: inspected units must be integers and at least the nonconforming count.`);}
  });
  return out;
 }
 function baseline(rows,kind,source='Pasted measurements'){
  rows=validate(rows,kind);check(rows.length>=2,'Use at least two baseline rows.');
  const model={format:'upskillsprint-spc-baseline',version:1,kind,rows,source:String(source).slice(0,20000),created:new Date().toISOString(),size:rows[0].length};
  if(attr(kind)){
   const total=rows.reduce((s,r)=>s+r[0],0),den=kind==='c'?rows.length:rows.reduce((s,r)=>s+r[1],0);
   model.center=total/den;
   if(kind==='np')check(rows.every(r=>r[1]===rows[0][1]),'np requires the same inspected sample size in every row. Use p for varying sizes.');
   check(model.center>0&&(!['p','np'].includes(kind)||model.center<1),'Baseline has no estimated attribute variation (all zero, or all nonconforming). Collect a representative baseline before estimating limits.');
  }else{
   model.center=mean(rows.flat());
   if(kind==='xr'){model.spread=mean(rows.map(range));model.sigma=model.spread/factors[model.size][0];}
   else if(kind==='xs'){model.c4=Math.sqrt(2/(model.size-1))*Math.exp(lgamma(model.size/2)-lgamma((model.size-1)/2));model.spread=mean(rows.map(r=>Math.sqrt(variance(r))));model.sigma=model.spread/model.c4;}
   else if(kind==='imr'){model.spread=mean(rows.slice(1).map((r,i)=>Math.abs(r[0]-rows[i][0])));model.sigma=model.spread/1.128;}
   else model.sigma=Math.sqrt(variance(rows.flat()));
   check(Number.isFinite(model.sigma)&&model.sigma>0,'Baseline variation is zero or not estimable. Check rounding, measurement resolution and subgroup design.');
  }
  return model;
 }
 function restore(text){
  check(typeof text==='string'&&text.length<=1000000,'Baseline file must be at most 1 MB.');let v;try{v=JSON.parse(text);}catch{throw Error('This is not valid baseline JSON.');}
  check(v?.format==='upskillsprint-spc-baseline'&&v.version===1,'Unsupported SPC baseline format/version.');
  const m=baseline(v.rows,v.kind,v.source);if(typeof v.created==='string')m.created=v.created.slice(0,100);if(Array.isArray(v.labels)){check(v.labels.length===m.rows.length&&v.labels.every(x=>typeof x==='string'&&x.length<=100),'Invalid baseline source row labels.');m.labels=v.labels;}return m; // Recompute; never trust serialized limits.
 }
 function point(index,value,cl,lo,hi,phase,label){return {index,value,cl,lo,hi,phase,label,signals:value<lo||value>hi?['Beyond control limit']:[]};}
 function series(rows,m,phase,options,offset=0){
  const k=m.kind,mu=m.center,s=m.sigma,n=m.size,out={name:kinds[k],points:[]},spread={name:k==='xs'?'Subgroup S':k==='xr'?'Subgroup R':'Moving range (2)',points:[]};
  let z=mu,plus=0,minus=0;
  rows.forEach((r,i)=>{
   const index=i+offset+1,label=options.labels?.[i+offset]||String(index),add=(v,c,l,h)=>out.points.push(point(index,v,c,l,h,phase,label));
   if(k==='xr'||k==='xs'){
    add(mean(r),mu,mu-3*s/Math.sqrt(n),mu+3*s/Math.sqrt(n));
    const v=k==='xr'?range(r):Math.sqrt(variance(r));
    const low=k==='xr'?m.spread*factors[n][1]:Math.max(0,m.spread-3*s*Math.sqrt(1-m.c4*m.c4));
    const high=k==='xr'?m.spread*factors[n][2]:m.spread+3*s*Math.sqrt(1-m.c4*m.c4);
    spread.points.push(point(index,v,m.spread,low,high,phase,label));
   }else if(k==='imr'){
    add(r[0],mu,mu-3*s,mu+3*s);
    if(i>0)spread.points.push(point(index,Math.abs(r[0]-rows[i-1][0]),m.spread,0,3.267*m.spread,phase,label));
   }else if(k==='ewma'){
    z=options.lambda*r[0]+(1-options.lambda)*z;
    const width=options.L*s*Math.sqrt(options.lambda/(2-options.lambda)*(1-(1-options.lambda)**(2*(i+1))));
    add(z,mu,mu-width,mu+width);
   }else if(k==='cusum'){
    const standard=(r[0]-mu)/s;plus=Math.max(0,plus+standard-options.k);minus=Math.max(0,minus-standard-options.k);
    add(plus,0,0,options.h);spread.name='Lower CUSUM (positive magnitude)';spread.points.push(point(index,minus,0,0,options.h,phase,label));
   }else{
    let value,cl,sd,ceiling=Infinity;
    if(k==='p'){value=r[0]/r[1];cl=mu;sd=Math.sqrt(mu*(1-mu)/r[1]);ceiling=1;}
    if(k==='np'){check(r[1]===m.rows[0][1],'Monitoring sample size differs from the np baseline. Use p for varying sizes.');value=r[0];cl=r[1]*mu;sd=Math.sqrt(r[1]*mu*(1-mu));ceiling=r[1];}
    if(k==='c'){value=r[0];cl=mu;sd=Math.sqrt(mu);}
    if(k==='u'){value=r[0]/r[1];cl=mu;sd=Math.sqrt(mu/r[1]);}
    add(value,cl,Math.max(0,cl-3*sd),Math.min(ceiling,cl+3*sd));
   }
  });
  if(options.rules&&['imr','xr','xs'].includes(k)){
   const pts=out.points;
   pts.forEach((p,i)=>{
    if(i>=8){const window=pts.slice(i-8,i+1);if(window.every(v=>v.value>v.cl)||window.every(v=>v.value<v.cl))p.signals.push('9 consecutive points on one side');}
    if(i>=5){const window=pts.slice(i-5,i+1);if(window.slice(1).every((v,j)=>v.value>window[j].value)||window.slice(1).every((v,j)=>v.value<window[j].value))p.signals.push('6 consecutive points increasing or decreasing');}
   });
  }
  return spread.points.length?[out,spread]:[out];
 }
 function capability(m,options){
  const lsl=options.lsl===''||options.lsl==null?null:number(options.lsl,'LSL'),usl=options.usl===''||options.usl==null?null:number(options.usl,'USL');
  if(lsl==null&&usl==null)return null;check(lsl==null||usl==null||lsl<usl,'LSL must be below USL.');
  const values=m.rows.flat(),N=values.length,mu=mean(values),s=Math.sqrt(variance(values)),alpha=1-options.confidence;
  const observed=a=>({n:a.length,below:lsl==null?0:a.filter(v=>v<lsl).length,above:usl==null?0:a.filter(v=>v>usl).length});
  const result={lsl,usl,observed:observed(values),rows:[],notes:[]};
  result.notes.push('Capability uses baseline measurements only. Values exactly on a specification limit count as within specification. Observed counts are descriptive, not forecasts.');
  if(!options.normal){result.notes.push('Indices and intervals withheld: acknowledge a stable, representative, approximately normal process and suitable measurement system.');return result;}
  const quant=(id,p,df)=>{const d=DISTS.find(d=>d.id===id);return d.inv(p,{df},d);};
  function add(prefix,sigma,df,method){
   if(!(sigma>0&&Number.isFinite(sigma)))return;
   const cp=lsl!=null&&usl!=null?(usl-lsl)/(6*sigma):null;
   const cpk=Math.min(lsl==null?Infinity:(mu-lsl)/(3*sigma),usl==null?Infinity:(usl-mu)/(3*sigma));
   let interval=null;if(N>=25&&df>1){const z=invNorm(1-alpha/2),se=Math.sqrt(1/(9*N)+cpk*cpk/(2*df));interval=[cpk-z*se,cpk+z*se];}
   if(cp!=null){const ci=N>=25&&df>1?[cp*Math.sqrt(quant('chi2',alpha/2,df)/df),cp*Math.sqrt(quant('chi2',1-alpha/2,df)/df)]:null;result.rows.push({index:prefix+'p',value:cp,interval:ci,method:method+'; chi-square interval'});}
   result.rows.push({index:prefix+(lsl==null?'pu':usl==null?'pl':'pk'),value:cpk,interval,method:method+'; approximate normal interval'});
  }
  add('P',s,N-1,'Overall sample standard deviation');
  if(sub(m.kind)){
   const df=N-m.rows.length,pool=Math.sqrt(m.rows.reduce((sum,r)=>sum+(r.length-1)*variance(r),0)/df);
   add('C',pool,df,'Pooled within-subgroup standard deviation (uncorrected)');
   result.notes.push('Within capability uses pooled within-subgroup variance, not the R-bar/d2 or S-bar/c4 chart estimate. It assumes a common stable mean and variance across rational subgroups.');
  }else result.notes.push('Individual data provide Pp/Ppk (overall spread). No Cp/Cpk confidence interval is inferred from overlapping moving ranges. Use rational subgroups for within-subgroup Cp/Cpk.');
  if(N<25)result.notes.push('Fewer than 25 baseline measurements: confidence intervals withheld.');
  if(N<100)result.notes.push('Fewer than 100 baseline measurements: collect a larger representative capability study.');
  result.notes.push(`${options.confidence*100}% intervals: spread-only indices use chi-square variance bounds; centered/one-sided indices use a large-sample normal approximation with variance 1/(9N) + index²/(2df). Negative lower bounds are retained. Intervals are conditional on the normal, independent stable-process model; they are not acceptance criteria.`);
  for(const row of result.rows)check([row.value,...(row.interval||[])].every(Number.isFinite),'Capability numerical range exceeded; rescale measurements and specifications together.');
  return result;
 }
 function run(input,options={},frozen=null){
  const kind=frozen?.kind||options.kind,rows=validate(input,kind);
  check(options.timeOrder===true,'Confirm time order, one process and the stated sampling assumptions before running.');
  if(kind==='c')check(options.exposure===true,'Confirm equal inspection opportunity in each c-chart row, or use u.');
  const o={...options,confidence:number(options.confidence??.95,'Confidence')};check([.9,.95,.99].includes(o.confidence),'Choose 90%, 95% or 99% confidence.');
  if(kind==='ewma'){o.lambda=number(options.lambda??.2,'λ');o.L=number(options.L??3,'L');check(o.lambda>0&&o.lambda<=1&&o.L>0&&o.L<=10,'EWMA requires 0 < λ ≤ 1 and 0 < L ≤ 10.');}
  if(kind==='cusum'){o.k=number(options.k??.5,'k');o.h=number(options.h??5,'h');check(o.k>0&&o.k<=10&&o.h>0&&o.h<=100,'CUSUM requires 0 < k ≤ 10 and 0 < h ≤ 100.');}
  const b=frozen?0:number(options.baselineRows,'Baseline rows');check(frozen||Number.isInteger(b)&&b>=2&&b<=rows.length,'Baseline rows must be an integer from 2 through the number of rows.');
  const model=frozen?restore(JSON.stringify(frozen)):baseline(rows.slice(0,b),kind,options.source);
  if(sub(kind))check(rows.every(r=>r.length===model.size),'Monitoring subgroup size must match the frozen baseline.');
  if(!frozen&&Array.isArray(o.labels))model.labels=o.labels.slice(0,b).map(String);
  const baseSeries=series(model.rows,model,'Baseline',{...o,labels:model.labels||null}),monitorRows=frozen?rows:rows.slice(b);
  const monitors=series(monitorRows,model,'Monitoring',o,b);
  const charts=frozen?monitors:baseSeries.map((chart,i)=>({...chart,points:[...chart.points,...(monitors[i]?.points||[])]}));
  const baselineSignals=baseSeries.reduce((n,c)=>n+c.points.filter(p=>p.signals.length).length,0),monitorSignals=monitors.reduce((n,c)=>n+c.points.filter(p=>p.signals.length).length,0);
  const notes=['Control limits describe process behavior; specification limits come from engineering/customer requirements. Neither substitutes for the other.','No detected signal is not proof of stability. Review process knowledge, autocorrelation, sampling and measurement-system adequacy. Limits are estimates, not calibrated guarantees of false-alarm rates.'];
  if(model.rows.length<20)notes.push('Fewer than 20 baseline rows: limits are preliminary; collect a representative baseline across normal operating conditions.');
  if(baselineSignals)notes.push('Baseline signals detected. Investigate and document assignable causes before approving a monitoring baseline; no rows are removed automatically.');
  if(attr(kind)){
   notes.push('p/np assume independent binomial units; c/u assume Poisson counts and consistent defect definitions. Overdispersion, clustering or changing product mix need another model.');
   if(rows.some(r=>kind==='c'?model.center<5:kind==='u'?model.center*r[1]<5:model.center*r[1]<5||(1-model.center)*r[1]<5))notes.push('Small expected counts: symmetric three-sigma limits may have poor tail probabilities. This tool does not provide exact binomial/Poisson limits or Laney adjustments.');
  }
  if(['ewma','cusum','imr'].includes(kind))notes.push('EWMA/CUSUM state and moving-range adjacency restart at the baseline/monitoring boundary. When using a frozen baseline, paste the complete monitoring sequence each time; runs do not retain streaming state.');
  if(o.rules&&['imr','xr','xs'].includes(kind))notes.push('Optional rules: 9 consecutive points strictly on one side, or 6 strictly increasing/decreasing. A tie breaks the corresponding pattern. Rules never cross the phase boundary; extra rules increase false alarms.');
  let cap=attr(kind)?null:capability(model,o);
  if(cap){cap.monitoring={n:monitorRows.flat().length,below:cap.lsl==null?0:monitorRows.flat().filter(v=>v<cap.lsl).length,above:cap.usl==null?0:monitorRows.flat().filter(v=>v>cap.usl).length};if(baselineSignals){cap.rows=[];cap.notes.unshift('Capability indices and intervals withheld because the selected baseline chart/rules detected signals. Observed specification compliance is still shown.');}}
  for(const chart of charts)for(const p of chart.points)check([p.value,p.cl,p.lo,p.hi].every(Number.isFinite),'Numerical range exceeded; rescale measurements.');
  return {model,charts,capability:cap,baselineSignals,monitorSignals,notes,options:o,rows,baselineRows:b,frozen:!!frozen,generated:new Date().toISOString()};
 }
 function report(r){return ['UpSkillSprint Advanced SPC v1',`Generated: ${r.generated}`,`Chart: ${kinds[r.model.kind]}`,`Source: ${r.options.source||'Pasted measurements'}`,`Baseline source: ${r.model.source}`,`Baseline created: ${r.model.created}`,`Baseline center: ${r.model.center}`,`Baseline sigma: ${r.model.sigma??'Attribute model'}`,`Frozen: ${r.frozen}`,`Settings: ${JSON.stringify(r.options)}`,`Baseline signals: ${r.baselineSignals}; monitoring signals: ${r.monitorSignals}`,'',...r.notes,'',...(r.capability?[JSON.stringify(r.capability,null,2)]:[]),'Baseline rows (CSV):',D.csv(r.model.rows),'Input rows (CSV):',D.csv(r.rows),'',...r.charts.flatMap(c=>[c.name,D.csv([['Point','Source','Phase','Value','CL','LCL','UCL','Signals'],...c.points.map(p=>[p.index,p.label,p.phase,p.value,p.cl,p.lo,p.hi,p.signals.join('; ')])])])].join('\n');}
 return {kinds,attr,sub,validate,baseline,restore,series,capability,run,report};
})();

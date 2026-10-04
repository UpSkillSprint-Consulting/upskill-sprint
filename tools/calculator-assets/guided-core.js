/* Problem-based guidance and raw-data inference. Method choice follows study design,
 * not an automatic normality-test gate. Existing numerical primitives are reused. */
'use strict';
const GuidedAnalysis = (() => {
  const A=CalculatorAnalysis,D=GuidedData,check=D.check,fmt=A.format;
  const goals={
    describe:{title:'Understand my data',method:'Descriptive statistics and a mean interval',why:'Start with the center, spread, unusual values and distribution shape.',assumptions:['For the mean interval, observations should be independent and the mean approximately normally distributed.','Repeated measurements from the same item or batch need a design that accounts for that dependence.'],next:['Review the histogram, box plot and normal probability plot. Investigate unusual observations before deciding whether to exclude them.','Identify the engineering or customer requirement that will guide the next decision.']},
    compare:{title:'Compare groups or a process change',method:'Compare means using the study design',why:'Matched observations and independent groups require different estimates of uncertainty.',assumptions:['Each row must represent the intended experimental unit. Repeated samples from the same heat, coil or customer are not automatically independent.','Choose the practically meaningful difference before inspecting results. A before/after association alone does not prove the change caused the result.'],next:['Review the effect and its confidence interval against your practical threshold.','Check changes in product mix, measurement method and operating conditions before attributing the result to an intervention.']},
    target:{title:'Compare a mean with a target',method:'One-sample t test and mean interval',why:'Uses the sample standard deviation to estimate uncertainty around the population mean.',assumptions:['Use independent observations from a representative process; normality of the mean is especially important for small samples.','A target mean is not a specification limit. This analysis does not measure the proportion of individual products meeting specifications.'],next:['Compare the estimated mean difference and its interval with the engineering tolerance for that difference.','Use capability analysis when the question concerns individual product specifications.']},
    relationship:{title:'Explore a relationship',method:'Simple linear regression',why:'Estimates the association between one numeric predictor X and one numeric response Y.',assumptions:['Slope inference assumes independent errors, an appropriate linear form and approximately normal errors with constant variance.','Check residuals and influential points. A correlation does not establish causation; avoid extrapolation.'],next:['Review the scatterplot and residual plot before using the fitted line.','Use a controlled experiment or an appropriate multivariable study to investigate a possible cause.']},
    capability:{title:'Check stability and capability',method:'Individuals / moving range charts and capability',why:'Uses individual measurements in time order, then compares their variation with engineering specification limits.',assumptions:['Use one process and representative, time-ordered individual observations. Mixed products, rational subgroups and autocorrelation need different treatment.','Capability and model PPM require a stable, approximately normal process and a suitable measurement system.','These sample-estimated charts check only points beyond three-sigma limits; no run-rule or long-term monitoring claim is made.'],next:['Investigate chart signals and the measurement system before using capability indices for a decision.','Distinguish engineering specification limits from statistical control limits. Collect a representative baseline for ongoing monitoring.']},
    association:{title:'Compare categorical outcomes',method:'Chi-square test of independence',why:'Builds observed counts from two categorical columns, with one independent observation per row.',assumptions:['Each row represents one independent event, assigned to exactly one category in each column. Do not import already aggregated counts as individual events.','Small expected frequencies weaken the chi-square approximation; an exact or simulation-based method may be needed.'],next:['Inspect expected counts and cell contributions before interpreting the p-value.','Compare operationally meaningful outcome rates. Association alone does not establish a cause.']}
  };
  function column(dataset,value,label){const j=Number(value);check(value!==''&&value!=null&&Number.isInteger(j)&&j>=0&&j<dataset.columns.length,`Select ${label}.`);return j;}
  function prepare(dataset,options){
    check(dataset,'Import a dataset or load an example first.');
    const goal=options.goal;check(goals[goal],'Choose a supported analysis question.');
    const y=column(dataset,options.y,goal==='association'?'the first category column':'the response column');
    let x=null,group=null;
    if(goal==='relationship'||(goal==='compare'&&options.design==='paired')||goal==='association'){
      x=column(dataset,options.x,goal==='compare'?'the after column':goal==='association'?'the second category column':'the predictor column');
      check(y!==x,'Choose two different columns.');
    }
    if(goal==='compare'&&options.design!=='paired'){
      group=column(dataset,options.group,'the group column');check(y!==group,'Response and group must be different columns.');
    }
    const required=[...new Set([y,x,group].filter(v=>v!=null))],numeric=goal==='association'?[]:[y,...(x==null?[]:[x])];
    const filter=options.filterColumn===''||options.filterColumn==null?null:column(dataset,options.filterColumn,'a filter column');
    const excluded=[],selected=[],manual=new Set(dataset.excluded);let missing=0;
    dataset.rows.forEach((row,i)=>{
      if(manual.has(i)){excluded.push({row:i+1,sourceRow:dataset.sourceRows[i],reason:'Unchecked in data table'});return;}
      if(filter!=null&&row[filter]!==options.filterValue){excluded.push({row:i+1,sourceRow:dataset.sourceRows[i],reason:`Filter: ${dataset.columns[filter]}`});return;}
      const blank=required.filter(j=>!row[j].trim());
      if(blank.length){missing++;excluded.push({row:i+1,sourceRow:dataset.sourceRows[i],reason:'Missing: '+blank.map(j=>dataset.columns[j]).join(', ')});return;}
      for(const j of numeric)check(Number.isFinite(D.number(row[j])),`Data row ${i+1} (source row ${dataset.sourceRows[i]}), ${dataset.columns[j]}: “${row[j].slice(0,60)}” is not a complete number within ±1e100. Correct it or explicitly uncheck this row.`);
      selected.push({index:i,sourceRow:dataset.sourceRows[i],values:row});
    });
    check(!missing||options.allowMissing,`${missing} rows have missing values in the selected columns. Fill them, uncheck them, or explicitly allow complete rows only.`);
    check(selected.length>=2,'At least two included, complete observations are required.');
    const groups=group==null?[]:[...new Set(selected.map(r=>r.values[group].trim()))];
    if(goal==='compare'&&group!=null){
      check(groups.length>=2&&groups.length<=20,'Independent comparison requires 2–20 groups. Check the group column or filter.');
      if(options.baseline){const i=groups.indexOf(options.baseline);check(i>=0,'The selected reference group is absent after exclusions and filtering.');groups.splice(i,1);groups.unshift(options.baseline);}
    }
    return {y,x,group,selected,excluded,groups,missing};
  }
  function plan(dataset,options){
    const p=prepare(dataset,options),g=goals[options.goal];let method=g.method,why=g.why,assumptions=[...g.assumptions];
    if(options.goal==='compare'){
      if(options.design==='paired'){
        method='Paired t test on after − before';why='Each row contains a matched before/after pair; the analysis uses within-pair differences.';
        assumptions.push('Before and after must refer to the same item on each row. Differences must be independent across pairs and approximately normal for small samples.');
      }else if(p.groups.length===2){method='Welch two-sample t test';why='Two independent groups are compared without assuming equal population variances.';assumptions.push('The two groups must be independent; approximately normal group means are required, especially with small samples and outliers.');}
      else{method='Classical one-way ANOVA';why='Three or more independent groups are compared in one overall test of equal means.';assumptions.push('Classical ANOVA assumes equal population variances and approximately normal errors. Review group spreads; unequal-variance ANOVA is not available in this guide.');}
    }
    return {...p,method,why,assumptions,next:[...g.next]};
  }
  function tResult(kind,estimate,se,df,confidence,label){
    check(Number.isFinite(se)&&se>0&&Number.isFinite(df)&&df>0,'The estimated standard error is zero or outside the numerical range. A t test is not estimable.');
    const dist=DISTS.find(d=>d.id==='t'),stat=estimate/se,alpha=1-confidence;
    const p=2*upperTail(dist,Math.abs(stat),{df}),critical=dist.inv((1+confidence)/2,{df},dist),low=estimate-critical*se,high=estimate+critical*se;
    check([estimate,stat,p,low,high].every(Number.isFinite),'Calculation exceeded its supported numerical range. Rescale measurements.');
    return {kind,title:label,metrics:[['Estimated difference',estimate],[`${confidence*100}% difference interval — lower`,low],[`${confidence*100}% difference interval — upper`,high],['Standard error of difference',se],['t statistic',stat],['Degrees of freedom',df],['p-value (two-sided)',p],['Decision',p<alpha?'Reject zero mean difference':'Fail to reject zero mean difference']],charts:[],tables:[],notes:[`Two-sided test; significance α = ${fmt(alpha)}. A nonsignificant result does not establish equality or equivalence.`],effect:{estimate,low,high,p,df,se}};
  }
  function effectText(effect,options){
    const {estimate,low,high,p}=effect,alpha=1-options.confidence;
    let text=`Estimated difference: ${fmt(estimate)}${options.unit?' '+options.unit:''}; ${options.confidence*100}% confidence interval ${fmt(low)} to ${fmt(high)}. `;
    text+=p<alpha?'The interval excludes zero, providing evidence of a mean difference. ':'The evidence does not establish a nonzero mean difference; equality has not been demonstrated. ';
    if(options.goal==='compare'&&options.direction!=='different'){
      const sign=options.direction==='lower'?-1:1,benefitLow=sign===1?low:-high,benefitHigh=sign===1?high:-low,threshold=options.threshold;
      if(benefitLow>threshold)text+=`The entire interval supports a ${options.direction} mean by more than the practical threshold of ${fmt(threshold)}. `;
      else if(benefitHigh<0)text+='The interval points in the unfavorable direction. ';
      else text+='The interval does not establish improvement beyond the selected practical threshold. ';
    }
    return text+'Interpret this with the study design, measurement quality and process context.';
  }
  function run(dataset,input){
    const options={...input,confidence:Number(input.confidence||.95)},p=plan(dataset,options);
    check([.9,.95,.99].includes(options.confidence),'Choose 90%, 95%, or 99% confidence.');
    options.unit=String(input.unit||'').trim().slice(0,40);
    if(options.goal==='compare'){
      check(['higher','lower','different'].includes(options.direction),'Choose what a useful change means.');
      options.threshold=options.direction==='different'||input.threshold===''||input.threshold==null?0:D.number(input.threshold);
      check(Number.isFinite(options.threshold)&&options.threshold>=0,'Practical threshold must be a nonnegative number.');
    }
    const alpha=1-options.confidence,y=p.selected.map(r=>D.number(r.values[p.y])),x=p.x==null?null:p.selected.map(r=>D.number(r.values[p.x]));
    const yName=dataset.columns[p.y],xName=p.x==null?'':dataset.columns[p.x];let result,handoff,interpretation;
    switch(options.goal){
      case 'describe':
        result=A.summary(y,options.confidence);handoff={kind:'summary',rows:y.map(v=>[v])};
        interpretation=`Across ${y.length} included observations, the mean is ${fmt(result.d.mean)} and the sample standard deviation is ${fmt(result.d.s)}. Use the mean interval to assess uncertainty in the population mean; it is not a prediction interval for an individual item.`;break;
      case 'target':{
        const target=D.number(options.target);check(Number.isFinite(target),'Enter a complete numeric target mean.');const d=A.describe(y);
        result=tResult('target',d.mean-target,d.s/Math.sqrt(d.n),d.n-1,options.confidence,'One-sample t test — observed mean minus target');
        result.metrics.unshift(['Observations',d.n],['Sample mean',d.mean],['Target mean',target],['Sample standard deviation',d.s]);result.charts=A.summary(y,options.confidence).charts;
        handoff={test:'t1',values:{xbar:d.mean,s:d.s,n:d.n,mu0:target}};interpretation=effectText(result.effect,options);break;
      }
      case 'compare':{
        if(options.design==='paired'){
          const differences=y.map((v,i)=>x[i]-v),d=A.describe(differences);
          result=tResult('paired',d.mean,d.s/Math.sqrt(d.n),d.n-1,options.confidence,`Paired t test — ${xName} minus ${yName}`);
          result.metrics.unshift(['Complete pairs',d.n],['Before mean',A.describe(y).mean],['After mean',A.describe(x).mean]);
          result.charts=A.summary(differences,options.confidence).charts;result.charts.forEach(c=>c.title='Paired differences: '+c.title);
          result.tables=[{title:'Matched differences (after − before)',headers:['Data row',yName,xName,'Difference'],rows:p.selected.map((r,i)=>[r.index+1,y[i],x[i],differences[i]])}];
          handoff={test:'tp',values:{dbar:d.mean,sd:d.s,n:d.n}};
        }else{
          const groups=p.groups.map(name=>p.selected.filter(r=>r.values[p.group].trim()===name).map(r=>D.number(r.values[p.y])));
          check(groups.every(g=>g.length>=2),'Each included group requires at least two observations.');
          const stats=groups.map(A.describe);
          if(groups.length===2){
            const [before,after]=stats,a=after.s**2/after.n,b=before.s**2/before.n,se=Math.sqrt(a+b),df=(a+b)**2/(a*a/(after.n-1)+b*b/(before.n-1));
            result=tResult('welch',after.mean-before.mean,se,df,options.confidence,`Welch t test — ${p.groups[1]} minus ${p.groups[0]}`);
            result.charts=[{type:'scatter',points:groups.flatMap((g,i)=>g.map(v=>[i+1,v])),title:'Measurements by group',xlabel:`1 = ${p.groups[0]}; 2 = ${p.groups[1]}`,ylabel:yName}];
            result.tables=[{title:'Group summaries',headers:['Group','n','Mean','Sample s'],rows:stats.map((s,i)=>[p.groups[i],s.n,s.mean,s.s])}];
            handoff={test:'t2',values:{x1:after.mean,s1:after.s,n1:after.n,x2:before.mean,s2:before.s,n2:before.n}};
          }else{
            check(options.equalVariance,'For three or more groups, review the equal-variance assumption and acknowledge it before running classical ANOVA.');
            result=A.anova(groups,alpha);result.tables.find(t=>t.title==='Group summaries').rows.forEach((r,i)=>r[0]=p.groups[i]);
            result.notes.push('Group plot mapping: '+p.groups.map((name,i)=>`${i+1} = ${name}`).join('; '));handoff={kind:'anova',rows:groups};
            const pv=result.metrics.find(r=>r[0]==='p-value')[1];interpretation=pv<alpha?'The overall test provides evidence that at least one population mean differs. It does not identify which groups differ or establish improvement. Use a suitable post-hoc comparison and assess practical effects.':'The overall test does not establish a difference among population means. This does not demonstrate equality; inspect group estimates and the amount of data.';
          }
        }
        if(result.effect){interpretation=effectText(result.effect,options);result.notes.push(`Difference direction: ${result.title.split(' — ')[1]}. Desired change: ${options.direction}; practical threshold: ${fmt(options.threshold)} ${options.unit}.`);}
        break;
      }
      case 'relationship':{
        const rows=x.map((v,i)=>[v,y[i]]);result=A.regression(rows,options.confidence);handoff={kind:'regression',rows};
        interpretation=`The fitted slope is ${fmt(result.metrics[0][1])}: estimated change in ${yName} per unit of ${xName}. Review its confidence interval and the residual plot. This describes an association within the observed data, not a proven cause or an out-of-range prediction.`;break;
      }
      case 'capability':{
        check(options.timeOrder,'Confirm that the included rows are in measurement time order. The guide does not sort rows automatically.');
        const limit=v=>v===''||v==null?null:D.number(v),lsl=limit(options.lsl),usl=limit(options.usl);
        result=A.capability(y,lsl,usl);handoff={kind:'capability',rows:y.map(v=>[v]),lsl,usl};
        const flags=result.metrics.filter(r=>['I chart flags','MR chart flags'].includes(r[0])).reduce((s,r)=>s+r[1],0);
        interpretation=flags?`${flags} beyond-limit chart signals were found. Investigate stability before treating capability indices or normal-model defect estimates as predictive.`:'No beyond-limit chart signals were found. This does not establish stability: other run rules, measurement quality, independence and distribution shape still need review before interpreting capability.';break;
      }
      case 'association':{
        const left=[...new Set(p.selected.map(r=>r.values[p.y].trim()))],right=[...new Set(p.selected.map(r=>r.values[p.x].trim()))];
        check(left.length>=2&&right.length>=2&&left.length<=20&&right.length<=20,'Choose categorical columns with 2–20 observed levels each.');
        const rows=left.map(()=>right.map(()=>0));p.selected.forEach(r=>rows[left.indexOf(r.values[p.y].trim())][right.indexOf(r.values[p.x].trim())]++);
        result=A.chi(rows,alpha);result.tables.unshift({title:'Observed event counts',headers:[yName+' / '+xName,...right],rows:rows.map((r,i)=>[left[i],...r])});
        result.tables.slice(1).forEach(t=>{t.headers=[yName+' / '+xName,...right];t.rows.forEach((r,i)=>r[0]=left[i]);});handoff={kind:'chi',rows};
        const small=result.metrics.find(r=>r[0]==='Expected cells below 5')[1],pv=result.metrics.find(r=>r[0]==='p-value (approximate)')[1];
        interpretation=small?'Some expected counts are below 5. Treat the approximate p-value cautiously and use an exact or simulation-based procedure before drawing a decision.':pv<alpha?'The test provides evidence of an association between the categorical variables. Inspect the pattern of counts and practical importance; causation is not established.':'The test does not establish an association. This does not prove independence or equivalence.';break;
      }
    }
    result.notes=[...p.assumptions,...result.notes];
    return {result,plan:p,options,interpretation,handoff,dataset:{name:dataset.name,source:dataset.source,revision:dataset.revision,columns:[...dataset.columns]},generated:new Date().toISOString()};
  }
  function report(output,dataset){
    const {result,plan,options}=output;
    return [result.title,'UpSkillSprint Guided Analysis v1',`Generated: ${output.generated}`,`Dataset: ${dataset.name}; revision ${dataset.revision}; source: ${dataset.source}`,`Included rows: ${plan.selected.length}; excluded rows: ${plan.excluded.length}`,
      `Columns: ${dataset.columns.join(' | ')}`,`Settings: ${JSON.stringify(options)}`,'','Interpretation:',output.interpretation,'',...result.metrics.map(([k,v])=>`${k}: ${fmt(v)}`),'','Assumptions:',...result.notes,'','Next steps:',...plan.next,
      ...result.tables.flatMap(t=>['',t.title,t.headers.join('\t'),...t.rows.map(r=>r.map(fmt).join('\t'))]),'','Exclusions (data row / source row / reason):',...plan.excluded.map(r=>`${r.row}\t${r.sourceRow}\t${r.reason}`),'','Included source data (CSV):',D.csv([['Data row','Source row',...dataset.columns],...plan.selected.map(r=>[r.index+1,r.sourceRow,...r.values])]),'','Import notes:',...dataset.notes,'','Dataset edit history:',...dataset.audit.map(a=>`${a.at}: ${a.action}`)].join('\n');
  }
  return {goals,prepare,plan,run,report};
})();

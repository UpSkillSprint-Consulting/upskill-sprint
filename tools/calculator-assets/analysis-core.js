/* Pure analysis functions. Numerical distribution primitives are supplied by the calculator. */
'use strict';
const CalculatorAnalysis = (() => {
  const requireValue = (ok, message) => { if (!ok) throw new Error(message); };
  const format = x => typeof x === 'number' ? (Number.isFinite(x) ? Number(x.toPrecision(9)).toString() : 'Not estimable') : String(x);
  function parse(text) {
    requireValue(text.trim(), 'Paste numeric data or load an example.');
    requireValue(text.length <= 250000, 'Use at most 250,000 characters per analysis.');
    const rows = text.replace(/\r/g, '').split('\n').map((line, i) => ({line:line.trim(), i:i+1})).filter(r=>r.line);
    let count=0;
    const result=rows.map(({line,i}) => {
      const cells=/[,;\t]/.test(line) ? line.split(/[,;\t]/) : line.split(/\s+/);
      return cells.map((cell,j) => {
        const value=strictNumber(cell);
        requireValue(Number.isFinite(value), `Row ${i}, cell ${j+1}: enter a complete number (no blank cells or headers).`);
        requireValue(Math.abs(value)<=1e100, `Row ${i}, cell ${j+1}: magnitude exceeds the supported range (1e100).`);
        count++; return value;
      });
    });
    requireValue(count<=10000,'Use at most 10,000 numeric values.');
    return result;
  }
  function describe(values) {
    requireValue(values.length>=2,'Enter at least two observations.');
    // Offset mean keeps small differences around a large baseline visible.
    const n=values.length, mean=values[0]+values.reduce((sum,x)=>sum+(x-values[0]),0)/n;
    const ss=values.reduce((sum,x)=>sum+(x-mean)**2,0), s=Math.sqrt(ss/(n-1));
    const sorted=[...values].sort((a,b)=>a-b), q1=quantile(sorted,.25), q3=quantile(sorted,.75);
    return {n,mean,ss,s,sorted,q1,q3,median:quantile(sorted,.5),iqr:q3-q1};
  }
  const critical = (confidence,df) => {
    requireValue(confidence>0&&confidence<1,'Confidence must be between 0 and 1.');
    const d=DISTS.find(d=>d.id==='t');return d.inv((1+confidence)/2,{df},d);
  };
  function summary(values,confidence=.95) {
    const d=describe(values), se=d.s/Math.sqrt(d.n), margin=critical(confidence,d.n-1)*se;
    const outliers=values.filter(v=>v<d.q1-1.5*d.iqr||v>d.q3+1.5*d.iqr).length;
    return {kind:'summary',title:'Descriptive statistics',d,metrics:[['Observations',d.n],['Mean',d.mean],['Sample standard deviation',d.s],['Population standard deviation',Math.sqrt(d.ss/d.n)],['Standard error',se],[`${confidence*100}% mean interval — lower`,d.mean-margin],[`${confidence*100}% mean interval — upper`,d.mean+margin],['Minimum',d.sorted[0]],['Q1',d.q1],['Median',d.median],['Q3',d.q3],['Maximum',d.sorted.at(-1)],['Interquartile range',d.iqr],['Sum',d.mean*d.n],['Sum of squares',values.reduce((s,x)=>s+x*x,0)],['Tukey-fence flags',outliers]],
      charts:[{type:'histogram',values,title:'Distribution of observations'},{type:'box',values,title:'Box plot — Tukey whiskers and flagged values'},{type:'scatter',points:d.sorted.map((v,i)=>[invNorm((i+.625)/(d.n+.25)),v]),title:'Normal probability plot',xlabel:'Theoretical normal quantile',ylabel:'Observed value'}],tables:[],notes:['Quartiles use linear interpolation at (n − 1) × probability (Excel PERCENTILE.INC convention).','The t interval assumes independent observations and approximately normal data or an adequate sample size. An interval for the mean is not a prediction interval for individual results.','Tukey flags identify values for review; they are not grounds for automatic deletion.']};
  }
  function regression(rows,confidence=.95) {
    requireValue(rows.length>=3&&rows.every(r=>r.length===2),'Regression requires at least 3 rows, with exactly X and Y in each row.');
    const xs=rows.map(r=>r[0]),ys=rows.map(r=>r[1]),x=describe(xs),y=describe(ys);
    requireValue(x.ss>0,'X must vary to estimate a slope.');
    const cross=rows.reduce((s,r)=>s+(r[0]-x.mean)*(r[1]-y.mean),0), slope=cross/x.ss,intercept=y.mean-slope*x.mean;
    const fitted=xs.map(v=>y.mean+slope*(v-x.mean)),residuals=ys.map((v,i)=>v-fitted[i]);
    const sse=residuals.reduce((s,v)=>s+v*v,0), mse=sse/(rows.length-2), error=Math.sqrt(mse), slopeSE=error/Math.sqrt(x.ss),t=slopeSE>0?slope/slopeSE:NaN;
    const p=slopeSE>0?2*upperTail(DISTS.find(d=>d.id==='t'),Math.abs(t),{df:rows.length-2}):slope!==0?0:NaN;
    const margin=critical(confidence,rows.length-2)*slopeSE;
    return {kind:'regression',title:'Linear regression',metrics:[['Slope',slope],['Intercept',intercept],['Pearson r',y.ss>0?cross/Math.sqrt(x.ss*y.ss):NaN],['R²',y.ss>0?Math.max(0,1-sse/y.ss):NaN],['Residual standard error (n − 2)',error],['RMSE (n)',Math.sqrt(sse/rows.length)],['Slope p-value (two-sided)',p],[`${confidence*100}% slope interval — lower`,slope-margin],[`${confidence*100}% slope interval — upper`,slope+margin]],
      charts:[{type:'scatter',points:rows,line:xs.map((v,i)=>[v,fitted[i]]),title:'Y versus X and fitted line'},{type:'scatter',points:xs.map((v,i)=>[fitted[i],residuals[i]]),title:'Residuals versus fitted Y'}],
      tables:[{title:'Fitted values and residuals',headers:['X','Y','Fitted Y','Residual'],rows:rows.map((r,i)=>[...r,fitted[i],residuals[i]])}],notes:['Ordinary least squares with an intercept: fitted Y = intercept + slope × X.','Slope inference assumes independent, normally distributed errors with constant variance. Check the residual plot. Correlation does not establish causation.','Constant Y makes correlation and R² undefined. A perfect fit has zero estimated residual error; inferential estimates are degenerate.']};
  }
  function curveFit(rows,model) {
    requireValue(rows.length>=3&&rows.every(r=>r.length===2),'Curve fitting requires at least three X,Y rows.');
    const xs=rows.map(r=>r[0]),ys=rows.map(r=>r[1]);let fitted,coefficients,formula;
    if(model.startsWith('poly')){
      const degree=Number(model.slice(4));requireValue(rows.length>degree+1,`Enter at least ${degree+2} pairs for this polynomial.`);
      const xd=describe(xs),center=xd.mean,scale=Math.max(...xs.map(x=>Math.abs(x-center)));
      requireValue(scale>0,'X must vary.');const zs=xs.map(x=>(x-center)/scale);
      const a=Array.from({length:degree+1},(_,j)=>[...Array.from({length:degree+1},(_,k)=>zs.reduce((s,z)=>s+z**(j+k),0)),zs.reduce((s,z,i)=>s+ys[i]*z**j,0)]);
      for(let j=0;j<=degree;j++){let pivot=j;for(let i=j+1;i<=degree;i++)if(Math.abs(a[i][j])>Math.abs(a[pivot][j]))pivot=i;requireValue(Math.abs(a[pivot][j])>1e-10,'Not enough distinct X values or the fit is ill-conditioned.');[a[j],a[pivot]]=[a[pivot],a[j]];const d=a[j][j];a[j]=a[j].map(x=>x/d);for(let i=0;i<=degree;i++)if(i!==j){const q=a[i][j];a[i]=a[i].map((v,k)=>v-q*a[j][k]);}}
      const beta=a.map(r=>r.at(-1));coefficients=beta.map((_,k)=>beta.reduce((s,b,j)=>j<k?s:s+b*choose(j,k)*(-center)**(j-k)/scale**j,0));
      fitted=zs.map(z=>beta.reduce((s,b,j)=>s+b*z**j,0));formula='Y = '+coefficients.map((b,j)=>`${format(b)}${j?' × X'+(j>1?'^'+j:''):''}`).join(' + ');
    }else{
      requireValue(!['log','power'].includes(model)||xs.every(x=>x>0),'This model requires all X values to be positive.');
      requireValue(!['exp','power'].includes(model)||ys.every(y=>y>0),'This model requires all Y values to be positive.');
      const tx=xs.map(x=>['log','power'].includes(model)?Math.log(x):x),ty=ys.map(y=>['exp','power'].includes(model)?Math.log(y):y),dx=describe(tx),dy=describe(ty);
      requireValue(dx.ss>0,'X must vary.');const b=tx.reduce((s,x,i)=>s+(x-dx.mean)*(ty[i]-dy.mean),0)/dx.ss,a=dy.mean-b*dx.mean;
      coefficients=model==='log'?[a,b]:[Math.exp(a),b];
      fitted=xs.map(x=>model==='log'?a+b*Math.log(x):model==='exp'?Math.exp(a+b*x):Math.exp(a)*x**b);
      formula=model==='log'?`Y = ${format(a)} + ${format(b)} × ln(X)`:model==='exp'?`Y = ${format(Math.exp(a))} × exp(${format(b)} × X)`:`Y = ${format(Math.exp(a))} × X^${format(b)}`;
    }
    requireValue(fitted.every(Number.isFinite),'Fit exceeded the numerical range. Rescale inputs.');
    const d=describe(ys),residuals=ys.map((y,i)=>y-fitted[i]),sse=residuals.reduce((s,r)=>s+r*r,0);
    return {kind:model,title:'Curve fit — '+({poly2:'quadratic',poly3:'cubic',poly4:'quartic',log:'logarithmic',exp:'exponential',power:'power'}[model]),metrics:[['Fitted equation',formula],...coefficients.map((v,i)=>['Coefficient '+i,v]),['R² (original Y scale)',d.ss>0?1-sse/d.ss:NaN],['RMSE (original Y scale)',Math.sqrt(sse/rows.length)]],charts:[{type:'scatter',points:rows,line:xs.map((x,i)=>[x,fitted[i]]),title:'Observations and fitted values'},{type:'scatter',points:fitted.map((v,i)=>[v,residuals[i]]),title:'Residuals versus fitted Y'}],tables:[{title:'Fitted values',headers:['X','Y','Fitted Y','Residual'],rows:rows.map((r,i)=>[...r,fitted[i],residuals[i]])}],notes:['The fitted line connects fitted values at the supplied X values. Use Graphing to inspect the continuous fitted equation.','Polynomial fits use centered/scaled X for calculation and report coefficients in the original X units. Exponential and power models fit ln(Y); their least-squares objective is on the log scale, with no retransformation bias correction.','Model form, independence, and residual behavior require review. These fits do not imply causation, and extrapolation can be unreliable.']};
  }
  function capability(values,lsl,usl) {
    requireValue(lsl!=null||usl!=null,'Enter at least one specification limit.');
    requireValue((lsl==null||Number.isFinite(lsl))&&(usl==null||Number.isFinite(usl)),'Specification limits must be complete finite numbers.');
    requireValue(lsl==null||usl==null||lsl<usl,'Lower specification must be less than upper specification.');
    const d=describe(values), mr=values.slice(1).map((v,i)=>Math.abs(v-values[i]));
    const mrbar=mr.reduce((s,v)=>s+v,0)/mr.length,within=mrbar/1.128;
    requireValue(d.s>0&&within>0,'Capability is not estimable with zero variation.');
    const idx=sd=>({spread:lsl!=null&&usl!=null?(usl-lsl)/(6*sd):NaN,center:Math.min(lsl==null?Infinity:(d.mean-lsl)/(3*sd),usl==null?Infinity:(usl-d.mean)/(3*sd))});
    const overall=idx(d.s),short=idx(within),il=d.mean-3*within,iu=d.mean+3*within,mru=3.267*mrbar;
    const flags=values.map((v,i)=>v<il||v>iu?i+1:null).filter(v=>v!=null),mrflags=mr.map((v,i)=>v>mru?i+2:null).filter(v=>v!=null);
    const oos=values.filter(v=>(lsl!=null&&v<lsl)||(usl!=null&&v>usl)).length;
    const expected=(lsl==null?0:normCdf((lsl-d.mean)/d.s))+(usl==null?0:normCdf((d.mean-usl)/d.s));
    return {kind:'capability',title:'Capability & I-MR',metrics:[['Observations',d.n],['Mean',d.mean],['Overall s',d.s],['Within σ estimate (MR̄ / 1.128)',within],['Pp — overall spread',overall.spread],['Ppk — overall centering',overall.center],['Cp — within spread',short.spread],['Cpk — within centering',short.center],['Observed outside specification',oos],['Observed PPM',oos/d.n*1e6],['Normal-model PPM (overall s)',expected*1e6],['I chart lower limit',il],['I chart upper limit',iu],['MR mean',mrbar],['MR upper limit',mru],['I chart flags',flags.length],['MR chart flags',mrflags.length]],charts:[{type:'sequence',points:values.map((v,i)=>[i+1,v]),limits:[il,d.mean,iu],title:'Individuals chart — observation order'},{type:'sequence',points:mr.map((v,i)=>[i+2,v]),limits:[0,mrbar,mru],title:'Moving range chart'}],tables:[{title:'Signals beyond three-sigma limits',headers:['Chart','Observation'],rows:[...flags.map(i=>['Individuals',i]),...mrflags.map(i=>['Moving range',i])]}],notes:[`Specification: LSL ${lsl==null?'not set':format(lsl)}; USL ${usl==null?'not set':format(usl)}. Values exactly at a specification limit count as conforming.`,flags.length||mrflags.length?'Signals detected: investigate instability before interpreting capability.':'No beyond-limit signals detected. This alone does not establish process stability.','Enter individual measurements in time order. MR-based sigma is sensitive to autocorrelation and mixed processes. Limits are estimated from this same sample; other run rules are not tested.','Normal-model PPM assumes a stable, approximately normal process. It is a model estimate, not the observed defect rate. No 1.5-sigma shift is applied.',d.n<30?'Small sample: estimates and control limits are particularly uncertain.':'Use a representative process study before making capability decisions.','One-sided specifications support Cpk/Ppk; Cp/Pp require both limits.']};
  }
  function anova(groups,alpha=.05) {
    requireValue(groups.length>=2&&groups.every(g=>g.length>=2),'Enter at least two groups, one group per row, with at least two observations per group.');
    const all=groups.flat(),grand=describe(all),ds=groups.map(describe),k=groups.length;
    const ssb=ds.reduce((s,g)=>s+g.n*(g.mean-grand.mean)**2,0),sse=ds.reduce((s,g)=>s+g.ss,0),dfb=k-1,dfe=all.length-k;
    requireValue(sse>0,'Within-group variation is zero; the classical ANOVA F test is not estimable.');
    const f=(ssb/dfb)/(sse/dfe),p=upperTail(DISTS.find(d=>d.id==='f'),f,{d1:dfb,d2:dfe});
    return {kind:'anova',title:'One-way ANOVA',metrics:[['F statistic',f],['p-value',p],['Between-group df',dfb],['Within-group df',dfe],['Eta-squared',ssb/(ssb+sse)],['Decision',p<alpha?'Reject equal means':'Fail to reject equal means']],charts:[{type:'scatter',points:groups.flatMap((g,i)=>g.map(v=>[i+1,v])),title:'Observations by group'}],tables:[{title:'ANOVA table',headers:['Source','SS','df','MS','F','p'],rows:[['Between groups',ssb,dfb,ssb/dfb,f,p],['Within groups',sse,dfe,sse/dfe,'—','—'],['Total',ssb+sse,all.length-1,'—','—','—']]},{title:'Group summaries',headers:['Group','n','Mean','Sample s'],rows:ds.map((d,i)=>[i+1,d.n,d.mean,d.s])}],notes:[`Significance α = ${alpha}. Independent groups, approximately normal errors and equal population variances are assumed. Unequal group sizes are supported.`,'A significant F test means at least one mean differs. It does not identify which pairs differ; use an appropriate post-hoc procedure.','Eta-squared = between-group SS / total SS; statistical significance does not measure practical importance.']};
  }
  function chi(rows,alpha=.05) {
    requireValue(rows.length>=2&&rows[0].length>=2&&rows.every(r=>r.length===rows[0].length),'Enter a rectangular table with at least 2 rows and 2 columns.');
    requireValue(rows.flat().every(x=>Number.isSafeInteger(x)&&x>=0),'Observed frequencies must be non-negative whole counts.');
    const rt=rows.map(r=>r.reduce((s,v)=>s+v,0)),ct=rows[0].map((_,j)=>rows.reduce((s,r)=>s+r[j],0)),n=rt.reduce((s,v)=>s+v,0);
    requireValue(Number.isSafeInteger(n)&&rt.every(v=>v>0)&&ct.every(v=>v>0),'Each row and column must have a positive total; total count must be a safe integer.');
    const expected=rows.map((r,i)=>r.map((_,j)=>rt[i]*ct[j]/n));
    const contribution=rows.map((r,i)=>r.map((v,j)=>(v-expected[i][j])**2/expected[i][j]));
    const stat=contribution.flat().reduce((s,v)=>s+v,0),df=(rows.length-1)*(ct.length-1),p=upperTail(DISTS.find(d=>d.id==='chi2'),stat,{df});
    const small=expected.flat().filter(v=>v<5).length;
    return {kind:'chi',title:'Chi-square test of independence',metrics:[['Pearson χ²',stat],['Degrees of freedom',df],['p-value (approximate)',p],['Cramér’s V',Math.sqrt(stat/(n*Math.min(rows.length-1,ct.length-1)))],['Total count',n],['Expected cells below 5',small],['Decision',small?'Approximation caution — review counts':p<alpha?'Reject independence':'Fail to reject independence']],charts:[],tables:[{title:'Expected frequencies under independence',headers:['Row',...ct.map((_,j)=>`Column ${j+1}`)],rows:expected.map((r,i)=>[i+1,...r])},{title:'Cell contributions to χ²',headers:['Row',...ct.map((_,j)=>`Column ${j+1}`)],rows:contribution.map((r,i)=>[i+1,...r])}],notes:[`α = ${alpha}. Pearson χ² = Σ (observed − expected)² / expected; expected = row total × column total / grand total. No Yates correction is applied.`,small?'Some expected counts are below 5. The asymptotic p-value may be unreliable; consider an exact or simulation-based method.':'All expected counts are at least 5.','Each independent observation must belong to exactly one cell. Use counts, not percentages. Association does not establish causation.']};
  }
  function gof(rows,alpha=.05){
    requireValue(rows.length===2&&rows[0].length>=2&&rows[0].length===rows[1].length,'Use exactly two equal-length rows: observed counts, then expected counts.');
    const [observed,expected]=rows;requireValue(observed.every(x=>Number.isSafeInteger(x)&&x>=0)&&expected.every(x=>x>0),'Observed counts must be nonnegative integers; expected counts must be positive.');
    const n=observed.reduce((s,x)=>s+x,0),total=expected.reduce((s,x)=>s+x,0);requireValue(n>0&&Math.abs(n-total)<=1e-8*Math.max(n,1),'Observed and expected totals must match.');
    const contributions=observed.map((x,i)=>(x-expected[i])**2/expected[i]),stat=contributions.reduce((s,x)=>s+x,0),df=observed.length-1,p=upperTail(DISTS.find(d=>d.id==='chi2'),stat,{df}),small=expected.some(x=>x<5);
    return {kind:'gof',title:'Chi-square goodness of fit',metrics:[['Pearson χ²',stat],['Degrees of freedom',df],['Approximate p-value',p],['Decision',small?'Small expected counts — review approximation':p<alpha?'Reject specified distribution':'Fail to reject specified distribution']],charts:[],tables:[{title:'Category contributions',headers:['Category','Observed','Expected','χ² contribution'],rows:observed.map((x,i)=>[i+1,x,expected[i],contributions[i]])}],notes:[`α = ${alpha}. This test assumes the expected proportions were specified independently of the data. df = categories − 1; do not use these df if parameters were estimated from these observations.`,small?'Expected counts below 5 can make the asymptotic p-value unreliable.':'All expected counts are at least 5.','Use mutually exclusive categories with independent observations; enter expected counts, not probabilities.']};
  }
  return {parse,describe,summary,regression,curveFit,capability,anova,chi,gof,format};
})();

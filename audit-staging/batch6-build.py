import json,re,pathlib,subprocess,hashlib,math,itertools
root=pathlib.Path.cwd();D=root/'docs/audits/mbb-set3-batch06';D.mkdir(parents=True,exist_ok=True)
source=(root/'test-bank-mbb-set3.js').read_text()
node="let c={window:{}};require('vm').runInNewContext(require('fs').readFileSync('test-bank-mbb-set3.js','utf8'),c);console.log(JSON.stringify(c.window.MBB_SET3))"
bank=json.loads(subprocess.check_output(['node','-e',node],text=True));assert len(bank)==175
starts=[m.start() for m in re.finditer(r'^  \{$',source,re.M)];assert len(starts)==175
sha=lambda s:hashlib.sha256(s.encode()).hexdigest();prefix=sha(source[:starts[125]]);suffix=sha(source[starts[150]:])
keys=[2,0,1,0,3,0,1,3,1,2,1,0,0,3,3,3,1,1,1,3,3,3,1,1,0]
assert [q['answer'] for q in bank[125:150]]==keys
refs={
'bok':{'title':'ASQ Certified Master Black Belt Body of Knowledge','url':'https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf','locator':'VI.B and VI.C; printed pages 12–13; visually inspected'},
'model-validation':{'title':'NIST/SEMATECH e-Handbook: Model validation','url':'https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm','locator':'4.4.4; residual analysis and limits of training fit'},
'validation':{'title':'scikit-learn: Common pitfalls and recommended practices','url':'https://scikit-learn.org/stable/common_pitfalls.html','locator':'Data leakage; fit selection/preprocessing using training partitions only'},
'vif':{'title':'Minitab: Coefficients table for Fit Regression Model','url':'https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/how-to/fit-regression-model/interpret-the-results/all-statistics-and-graphs/coefficients-table/','locator':'Variance inflation factors and coefficient uncertainty'},
'logistic':{'title':'Minitab: Methods and formulas for the estimated binary logistic equation','url':'https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/how-to/fit-binary-logistic-model/methods-and-formulas/estimated-equation/','locator':'Logit equation and odds ratios'},
'dw':{'title':'Minitab: Test for autocorrelation using Durbin–Watson','url':'https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/supporting-topics/model-assumptions/test-for-autocorrelation-by-using-the-durbin-watson-statistic/','locator':'Time ordering, statistic and critical-bound assumptions'},
'rsm':{'title':'NIST: Optimization when there is adequate quadratic fit','url':'https://www.itl.nist.gov/div898/handbook/pri/section5/pri5514.htm','locator':'5.5.5.1.4; stationary point, eigenvalues, confirmation'},
'main-effects':{'title':'Minitab: Interpret Main Effects Plot','url':'https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/how-to/main-effects-plot/interpret-the-results/key-results/','locator':'Marginal means versus statistical significance'},
'interaction':{'title':'Minitab: What is an interaction?','url':'https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/supporting-topics/anova-models/what-is-an-interaction/','locator':'Conditional effects; plot does not establish significance'},
'fractional':{'title':'NIST: Fractional factorial specifications and resolution','url':'https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm','locator':'5.3.3.4.4; defining relations and resolution'},
'foldover':{'title':'NIST: Alternative foldover designs','url':'https://www.itl.nist.gov/div898/handbook/pri/section3/pri3382.htm','locator':'5.3.3.8.2; reversing selected factor columns'},
'curvature':{'title':'NIST: Response surface designs','url':'https://www.itl.nist.gov/div898/handbook/pri/section3/pri336.htm','locator':'5.3.3.6; pure-quadratic terms and center-point limitations'},
'dsd':{'title':'JMP: Definitive screening designs','url':'https://www.jmp.com/en/statistics-knowledge-portal/design-of-experiments/screening-designs/definitive-screening-designs','locator':'Main-effect orthogonality, curvature and sparse active-factor models'}}
def table(title,columns,rows,alt):return dict(type='data-table',title=title,columns=columns,rows=rows,altText=alt)
charts={}
# Retain every original displayed residual and identify the subset explicitly.
points=bank[126]['chart']['points'];assert len(points)==9
charts[127]=dict(type='regression-diagnostic',title='Selected standardized residuals versus fitted yield',altText='Nine selected residuals from the full-model diagnostic. These are not the complete fitted sample.',panels=[dict(title='Residual diagnostic excerpt',xs=[p[0] for p in points],series=[dict(name='Standardized residual',values=[p[1] for p in points],connect=False)],range=[8,52,-5,5],xLabel='Fitted yield (%)',yLabel='Residual (unitless)',refs=[dict(y=0,label='Zero')])],evidence=table('Residual excerpt: exact plotted values',['Fitted yield (%)','Standardized residual'],points,'Numerical alternative to the residual excerpt.'))
charts[128]=dict(bank[127]['chart'],title='Predictor variance inflation factors',altText='Reported conventional VIF values for the three predictors. These quantify predictor dependence, not response association.')
charts[129]=dict(bank[128]['chart'],title='Failure counts by interval indicator',altText='Long indicator 1 versus short indicator 0; failures are the modeled event. Both groups contain 100 observations.')
charts[129]['columns']=['Interval / model indicator','Failures','No failures'];charts[129]['rows']=[['Short / 0',18,82],['Long / 1',34,66]]
# New illustrative fit, transparently disclosed. Preserve all 14 original call counts.
# Choose a zero-mean residual direction with DW exactly .45, then project it so
# residuals are orthogonal to both the intercept and fitted column as OLS requires.
y=bank[133]['chart']['data'];assert len(y)==14
n=len(y);l3=2-2*math.cos(3*math.pi/n);l4=2-2*math.cos(4*math.pi/n)
a=math.sqrt((l4-.45)/(l4-l3));b=math.sqrt((.45-l3)/(l4-l3))
v=[a*math.cos(3*math.pi*(j+.5)/n)+b*math.cos(4*math.pi*(j+.5)/n) for j in range(n)]
k=sum(vv*yy for vv,yy in zip(v,y))/sum(t*t for t in v);res=[k*t for t in v];fit=[yy-e for yy,e in zip(y,res)]
dw=sum((res[j]-res[j-1])**2 for j in range(1,n))/sum(e*e for e in res)
assert abs(dw-.45)<1e-12 and abs(sum(res))<1e-9 and abs(sum(e*f for e,f in zip(res,fit)))<1e-8
xs=list(range(1,15))
charts[134]=dict(type='time-series',title='Daily calls and illustrative model residuals',altText='Top: all 14 original call counts. Bottom: added illustrative OLS residuals, not raw-call deviations. The fit is constructed for a reproducible diagnostic example, not an empirical case study.',rawCalls=y,fittedValues=fit,residuals=res,panels=[dict(title='Observed daily call volume',xs=xs,series=[dict(name='Observed calls',values=y)],range=[1,14,200,330],xLabel='Day',yLabel='Calls',refs=[]),dict(title='Residuals in time order',xs=xs,series=[dict(name='Model residual',values=res)],range=[1,14,-10,10],xLabel='Day',yLabel='Residual (calls)',refs=[dict(y=0,label='Zero')])],evidence=table('Daily model data (display rounded to 6 decimals)',['Day','Observed calls','Fitted calls','Residual (calls)'],[[j+1,y[j],round(fit[j],6),round(res[j],6)] for j in range(14)],'All observations, fitted values and residuals.'))
charts[138]=dict(type='main-effects-plot',title='Bond strength: marginal means',altText='Equal response scales and coded level spacing. Replicate variability and joint cell means are not supplied.',panels=[dict(title='Factor A',xs=[-1,1],series=[dict(name='A marginal mean',values=[42,68])],range=[-1,1,35,75],xLabel='A coded level',yLabel='Strength (MPa)',refs=[dict(y=55,label='Mean')]),dict(title='Factor B',xs=[-1,1],series=[dict(name='B marginal mean',values=[54,56])],range=[-1,1,35,75],xLabel='B coded level',yLabel='Strength (MPa)',refs=[dict(y=55,label='Mean')])],evidence=table('Main-effect marginal means',['Factor','Low (−1), MPa','High (+1), MPa'],[['A',42,68],['B',54,56]],'Means share an overall mean of 55 MPa.'))
charts[139]=dict(type='interaction-plot',title='Molding strength: cell means by A and B',altText='Supplied illustrative cell means; no replicate error or significance estimate is shown.',panels=[dict(title='Strength at the two B levels',xs=[-1,1],series=[dict(name='B low',values=[40,70]),dict(name='B high',values=[60,45],dashed=True)],range=[-1,1,30,80],xLabel='A coded level',yLabel='Strength (MPa)',refs=[])],legend='Solid line: B low (−1). Dashed line: B high (+1).',evidence=table('Four cell means',['B level','A low (−1), MPa','A high (+1), MPa'],[['Low (−1)',40,70],['High (+1)',60,45]],'Exact means used in the interaction plot.'))
# Complete two-factor aliases derived from the specified regular design, not hand-copied.
masks=dict(A=1,B=2,C=4,D=3,E=5,F=6,G=7)
aliases={a:[''.join(pair) for pair in itertools.combinations(masks,2) if masks[pair[0]]^masks[pair[1]]==m] for a,m in masks.items()}
assert aliases['A']==['BD','CE','FG'] and all(len(v)==3 for v in aliases.values())
charts[142]=table('Complete two-factor alias sets for the stated generators',['Main-effect column','Identical two-factor columns'],[[a,' = '.join(v)] for a,v in aliases.items()],'All seven main effects. Higher-order aliases are omitted; equality denotes identical columns, not estimated separate effects.')
vertices=[]
for c in [-1,1]:
 for b in [-1,1]:
  for a in [-1,1]:vertices.append(dict(a=a,b=b,c=c,value=42+9*(a+1)/2+16*(b+1)/2+22*(c+1)/2))
charts[144]=dict(type='doe-cube',title='Complete 2³ cube: fitted additive etch rate',altText='Eight additive-model predictions in nm/min. Cube edges join settings differing in one factor; they are not activity dependencies.',vertices=vertices,evidence=table('All eight fitted treatment combinations',['A (coded)','B (coded)','C (coded)','Etch rate (nm/min)'],[[p['a'],p['b'],p['c'],int(p['value'])] for p in vertices],'The four formerly absent corners are explicitly additive-model predictions.'))
revisions=[];tracker=[];new=[]
for p in P:
 i=p['number']-1;old=bank[i];q=dict(old)
 assert old['qid']=='mbb:set-3:d6-'+str(p['number']-110).zfill(3)
 for f in ['stem','options','why','optionRationales','trap']:q[f]=p[f]
 assert q['optionRationales'][q['answer']].startswith('Correct.')
 q['distractors']=q['optionRationales'][:]
 locator=('VI.C.3, DOE approaches' if p['number']==131 else 'VI.C, Design of Experiments' if p['number']>=138 else 'VI.B.1, Autocorrelation and forecasting' if p['number']==134 else 'VI.B.3, Logistic regression analysis' if p['number'] in [129,132] else 'VI.B.2, Multiple regression analysis')
 q['why']+=' Source alignment: ASQ CMBB Body of Knowledge, '+locator+'. This is an original practice scenario, not an ASQ-authored or endorsed item.'
 q['auditSources']=[dict(refs['bok'],locator=locator)]+[refs[r] for r in p['refs']]
 if p['number'] in charts:q['chart']=charts[p['number']]
 new.append(q);revisions.append(dict(number=p['number'],qid=q['qid'],original=old,corrected=q,issues=p['issues'],independentSolution=p['why'],basis='Original scenario and retained original numbers plus explicitly stated revised assumptions; primary sources verify principles, not these company cases.'))
 tracker.append(dict(number=p['number'],qid=q['qid'],key='ABCD'[q['answer']],status='Content corrected; rendered verification pending',issues=p['issues'],independentSolution=p['why'],allChoicesReviewed=True,visualType=q.get('chart',{}).get('type','none'),sourceLocator=locator,renderRetest='pending'))
replacement=''.join('  '+json.dumps(q,ensure_ascii=False,indent=2).replace('\n','\n  ')+',\n' for q in new)
updated=source[:starts[125]]+replacement+source[starts[150]:];ss=[m.start() for m in re.finditer(r'^  \{$',updated,re.M)]
assert sha(updated[:ss[125]])==prefix and sha(updated[ss[150]:])==suffix
(root/'test-bank-mbb-set3.js').write_text(updated)
records={'revisions.json':revisions,'question-audit-tracker.json':tracker,'preservation.json':dict(baseline='11fa54352c3f8148576fb87c816e1bf36dae96ba',range=[126,150],prefixSHA256=prefix,suffixSHA256=suffix,ids=[q['qid'] for q in bank],keys=[q['answer'] for q in bank]),'sources.json':dict(verifiedOn='2026-09-07',sources=refs,limitations='Primary sources verify principles and BOK topic alignment, not empirical results or authorship of these revised scenarios. Added illustrative data and assumptions are explicitly identified.'),'independent-calculations.json':dict(Q128=dict(ageAuxR2=1-1/14.2,ageSEMultiplier=math.sqrt(14.2)),Q129=dict(oddsRatio=(34*82)/(66*18),riskRatio=34/18,riskDifference=.34-.18,logOddsRatio=math.log((34*82)/(66*18))),Q131=dict(stationary=[0,0],hessianEigenvalues=[-4,-10],prediction=80),Q132=dict(candidateCoefficients=41,observations=85,events=12),Q133=dict(tolerance=.6,VIF=1/.6,auxR2=.4),Q134=dict(DW=dw,residualSum=sum(res),residualFittedDot=sum(e*f for e,f in zip(res,fit)),construction='Explicit illustrative fit; no source case data are claimed. See generator comments and exact chart values.'),Q137=dict(contrastDays=.02*50,thresholdDays=.5,pValueGiven=.03,alpha=.05,pValueRecalculated=False,reason='Interpretation of a supplied test summary; raw regression data/df were not supplied.'),Q138=dict(effects=[26,2],coefficients=[13,1]),Q139=dict(simpleA=[30,-15],differenceOfDifferences=-45,factorialAB=-22.5,codedAB=-11.25),Q140=dict(relation='I=ABC',aliases=['A=BC','B=AC','C=AB'],residualDF=0),Q141=dict(original='I=ABCD',DOnlyFoldover='I=-ABCD',allSignFoldover='I=ABCD',combinedUniqueRuns=16),Q142=dict(generators=['D=AB','E=AC','F=BC','G=ABC'],twoFactorAliases=aliases,residualDF=0),Q143=dict(cornerPureQuadraticRank=1,withCenterPureQuadraticRank=2,columns='intercept,x1^2,x2^2; three columns but rank only two with centers'),Q144=dict(mainEffects=[9,16,22],diagonalContrast=47,predictedCorners=[int(v['value']) for v in vertices]),Q145=dict(resolution=5,parameters=16,observations=16,residualDF=0),Q146=dict(expectedMPa=1,contrastSE=math.sqrt(18),signalToSE=1/math.sqrt(18)),Q150=dict(runs=17,fullQuadraticCoefficients=45))}
for name,val in records.items():(D/name).write_text(json.dumps(val,ensure_ascii=False,indent=2)+'\n')
# Move unaudited suffix guards only. Each previous prefix stays protected by its own test.
oldhash='7c27818031175f62f0e580fb4160760925a681a3f079751cb0f5aadd5f2475dd'
for b in range(1,6):
 p=root/f'tests/test-bank-mbb-set3-batch{b}-audit.test.js';s=p.read_text();assert oldhash in s
 s=s.replace('starts[125]','starts[150]').replace(oldhash,suffix).replace('Q126–175','Q151–175');p.write_text(s)
# Exact-qid renderer and audited interaction contract; no earlier/later item is captured.
u=(root/'test-bank-mbb-set3-batch5-ui.js').read_text().replace('Batch5','Batch6').replace('batch5','batch6').replace('mbbs3b5','mbbs3b6').replace('Q101–125','Q126–150')
u=re.sub(r' const ids=new Set\(\[.*?\]\);',' const ids=new Set('+json.dumps([q['qid'] for q in new])+');',u,count=1)
start=u.index(' function plot(c){');end=u.index(' function render(q,review)',start)
plot=r''' function plot(c){
  let drawings='';
  if(c.panels){for(const p of c.panels)drawings+=xyPlot(p.title,p.xs,p.series,p.range,p.xLabel,p.yLabel,p.refs||[]);}
  else if(c.type==='doe-cube'){
   const X=p=>120+(p.a+1)*110+(p.c+1)*70,Y=p=>290-(p.b+1)*80-(p.c+1)*35;
   let b=text(330,24,'Fitted etch rate at all eight settings','middle');
   c.vertices.forEach((p,i)=>c.vertices.slice(i+1).forEach(q=>{if(['a','b','c'].filter(k=>p[k]!==q[k]).length===1)b+=line(X(p),Y(p),X(q),Y(q));}));
   c.vertices.forEach(p=>{b+=dot(X(p),Y(p),'A '+p.a+', B '+p.b+', C '+p.c+': '+p.value+' nm/min','data-x="'+p.a+'" data-y="'+p.value+'" data-a="'+p.a+'" data-b="'+p.b+'" data-c="'+p.c+'"');
    b+=text(X(p),Y(p)+24,'('+[p.a,p.b,p.c].map(v=>v<0?'−':'+').join(',')+'): '+num(p.value),'middle');});
   b+=text(330,352,'Vertex labels: (A, B, C): fitted rate in nm/min','middle');drawings=svg(c.title,b,660,375);
  }else throw new Error('Unsupported Batch 6 chart '+c.type);
  return '<figure class="mbbs3b6-plot"><figcaption>'+esc(c.title)+'</figcaption><p>'+esc(c.altText)+'</p><p class="mbbs3b6-scroll-hint">Scroll or swipe horizontally to inspect the complete figure. Numerical data are also provided below.</p><div class="mbbs3b6-scroll" role="region" tabindex="0" aria-label="'+esc(c.title)+'; horizontally scrollable plot">'+drawings+'</div>'+(c.legend?'<p class="mbbs3b6-legend">'+esc(c.legend)+'</p>':'')+'</figure>'+table(c.evidence);
 }
'''
u=u[:start]+plot+u[end:];u=u.replace('const xt=xs.length<=13?xs:[xmin,(xmin+xmax)/2,xmax];','const xt=xs.length<=13?xs:[xs[0],xs[Math.floor(xs.length/2)],xs[xs.length-1]];')
(root/'test-bank-mbb-set3-batch6-ui.js').write_text(u)
h=(root/'test-bank.html').read_text();hook='<script src="/test-bank-mbb-set3-batch5-ui.js"></script>';assert h.count(hook)==1;h=h.replace(hook,hook+'\n<script src="/test-bank-mbb-set3-batch6-ui.js"></script>')
for line in ["    if(window.__MBBSet3Batch5UI&&window.__MBBSet3Batch5UI.isQuestion(q))return window.__MBBSet3Batch5UI.render(q,review);","    if(window.__MBBSet3Batch5UI)window.__MBBSet3Batch5UI.wire(host);"]:
 assert h.count(line)==1;h=h.replace(line,line+'\n'+line.replace('Batch5','Batch6'))
(root/'test-bank.html').write_text(h)
p=root/'test-bank-feedback-loop.js';s=p.read_text();hook='    if(window.__MBBSet3Batch5UI&&window.__MBBSet3Batch5UI.isQuestion(question))return window.__MBBSet3Batch5UI.rationales(question);';assert s.count(hook)==1;p.write_text(s.replace(hook,hook+'\n'+hook.replace('Batch5','Batch6')))
# Browser driver retains actual navigation, normal pointer/keyboard events and grading.
s=(root/'scripts/audit-mbb-set3-batch5.mjs').read_text().replace('Batch5','Batch6').replace('batch5','batch6').replace('mbbs3b5','mbbs3b6').replace('Batch 5','Batch 6').replace('Q101–125','Q126–150').replace('.slice(100,125)','.slice(125,150)').replace('i+101','i+126')
a=s.index(' const expectedCounts=');b=s.index(' const regions=host.locator',a)
s=s[:a]+r''' const expectedCounts={'regression-diagnostic':9,'time-series':28,'main-effects-plot':4,'interaction-plot':4,'doe-cube':8,'data-table':0};
 assert.equal(await host.locator('circle[data-point]').count(),expectedCounts[c.type]);
 if(c.type!=='data-table'){
  assert.equal(await host.locator('svg[role="img"]').count(),c.panels?c.panels.length:1);
  if(c.panels){
   for(let j=0;j<c.panels.length;j++){
    const p=c.panels[j],S=host.locator('svg').nth(j),R=p.refs.some(r=>r.y!==undefined)?500:620;
    const actual=await S.locator('circle[data-point]').evaluateAll(ps=>ps.map(e=>({x:+e.dataset.x,y:+e.dataset.y,cx:+e.getAttribute('cx'),cy:+e.getAttribute('cy')})));
    const expected=p.series.flatMap(series=>series.values.map((v,i)=>({x:p.xs[i],y:v})));
    assert.equal(actual.length,expected.length);
    actual.forEach((v,i)=>{assert.equal(v.x,expected[i].x);assert.equal(v.y,expected[i].y);assert.ok(Math.abs(v.cx-(70+(v.x-p.range[0])/(p.range[1]-p.range[0])*(R-70)))<1e-7);assert.ok(Math.abs(v.cy-(270-(v.y-p.range[2])/(p.range[3]-p.range[2])*220))<1e-7);});
   }
  }else{
   const actual=await host.locator('circle[data-point]').evaluateAll(ps=>ps.map(e=>({a:+e.dataset.a,b:+e.dataset.b,c:+e.dataset.c,y:+e.dataset.y})));
   assert.deepEqual(actual,c.vertices.map(p=>({a:p.a,b:p.b,c:p.c,y:p.value})));
  }
 }
''' +s[b:]
(root/'scripts/audit-mbb-set3-batch6.mjs').write_text(s)
# Use the existing actual-player every-option tests and scope the copied fixture to this range.
oldtest=(root/'tests/test-bank-mbb-set3-batch5-audit.test.js').read_text()
start=oldtest.index('for(let rotation=0;rotation<4;rotation++)');end=oldtest.index("test('Final wording",start)
actual=oldtest[start:end].replace('Batch 5','Batch 6').replace('Batch5','Batch6').replace('batch5','batch6')
testhead="""'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(125,150),keys=KEYS;
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} differs from ${b}`);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 6 Q${i+126}: reviewed identity, key, complete choices and independent rationale`,()=>{
 assert.equal(q.qid,'mbb:set-3:d6-'+String(i+16).padStart(3,'0'));assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,'mbb-analytics');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);
 assert.equal(q.optionRationales.filter(s=>s.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));assert.ok(q.optionRationales.every(s=>s.length>40));assert.ok(q.stem.length>150&&q.why.length>250&&q.trap.length>80);assert.ok(q.auditSources.every(s=>s.title&&s.url&&s.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/original assignment|elsewhere in this bank|D[1-6]-[0-9]/);
});
test('Batch 6 byte-preserves Q1–125, Q151–175 and all stable IDs/answer positions',()=>{
 const p=JSON.parse(read('docs/audits/mbb-set3-batch06/preservation.json')),starts=[...source.matchAll(/^  \\{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[125])),'PREFIX');assert.equal(sha(source.slice(starts[150])),'SUFFIX');assert.deepEqual(bank.map(q=>q.qid),p.ids);assert.deepEqual(bank.map(q=>q.answer),p.keys);
});
""".replace('KEYS',json.dumps(keys)).replace('PREFIX',prefix).replace('SUFFIX',suffix)
extra=(pathlib.Path('/tmp/mbb6-staging')/'batch6-tests.js').read_text()
(root/'tests/test-bank-mbb-set3-batch6-audit.test.js').write_text(testhead+extra+'\n'+actual)
print('Batch 6 applied:',len(new),'items;',len(charts),'visuals; preservation',prefix,suffix)

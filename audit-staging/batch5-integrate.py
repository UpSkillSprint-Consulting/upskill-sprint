import pathlib,json,re,hashlib,subprocess,math,statistics
root=pathlib.Path.cwd(); staging=pathlib.Path('/tmp/mbb5-staging')
source=(root/'test-bank-mbb-set3.js').read_text()
assert subprocess.check_output(['git','hash-object','test-bank-mbb-set3.js'],text=True).strip()=='a3ab9042974070d64df106c59ad04d1931768b1a','Baseline changed: review before applying'
bank=json.loads(subprocess.check_output(['node','-e',"let c={window:{}};require('vm').runInNewContext(require('fs').readFileSync('test-bank-mbb-set3.js','utf8'),c);console.log(JSON.stringify(c.window.MBB_SET3))"],text=True))
assert len(bank)==175 and [p['number'] for p in P]==list(range(101,126))
starts=[m.start() for m in re.finditer(r'^  \{$',source,re.M)];assert len(starts)==175
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
prefix=sha(source[:starts[100]]);suffix=sha(source[starts[125]:])
D=root/'docs/audits/mbb-set3-batch05';D.mkdir(parents=True,exist_ok=True)
refs={
'bok':dict(title='ASQ Certified Master Black Belt Body of Knowledge',url='https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf',locator='Printed pages 11–12, V and VI; acceptance sampling is related application rather than a separately named subtopic'),
'icf':dict(title='International Coaching Federation: Core Competencies and Code of Ethics',url='https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/',locator='Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules'),
'grr':dict(title='Minitab: Is my measurement system acceptable?',url='https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/is-my-measurement-system-acceptable/',locator='Study variation versus variance contribution; application-dependent acceptance guidance'),
'ndc':dict(title='Minitab: Using the number of distinct categories in a gage R&R study',url='https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/using-the-number-of-distinct-categories-in-a-gage-r-r-study/',locator='1.41 times part-to-gage SD ratio, truncated to integer; minimum-five guideline'),
'kappa':dict(title='Minitab: Kappa statistics for Attribute Agreement Analysis',url='https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/how-to/attribute-agreement-analysis/attribute-agreement-analysis/interpret-the-results/all-statistics-and-graphs/kappa-statistics/',locator='Chance-adjusted agreement; between-appraiser agreement is distinct from agreement with a standard'),
'capability':dict(title='NIST/SEMATECH e-Handbook: What is process capability?',url='https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm',locator='Cp, Cpu, Cpl, Cpk formulas, centering and normal-distribution interpretation'),
'xbar':dict(title='NIST/SEMATECH e-Handbook: X-bar and R charts',url='https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc321.htm',locator='Control-limit formulas and n=5 factors A2=0.577, D3=0, D4=2.115'),
'spc':dict(title='NIST/SEMATECH e-Handbook: Shewhart control charts',url='https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm',locator='Control versus specification limits, Western Electric eight-point rule and justified limit revisions'),
'boxplot':dict(title='NIST/SEMATECH e-Handbook: Box plot',url='https://www.itl.nist.gov/div898/handbook/eda/section3/boxplot.htm',locator='Quartiles, fences and outlier labeling'),
'normal':dict(title='NIST/SEMATECH e-Handbook: Normal probability plot',url='https://www.itl.nist.gov/div898/handbook/eda/section3/normprpl.htm',locator='Normal quantile plot and Filliben order-statistic plotting positions'),
'bias':dict(title='NIST/SEMATECH e-Handbook: Bias and accuracy',url='https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc45.htm',locator='Bias relative to reference and measurement-system accuracy'),
'oc':dict(title='NIST/SEMATECH e-Handbook: Choosing a single sampling plan',url='https://www.itl.nist.gov/div898/handbook/pmc/section2/pmc222.htm',locator='Binomial acceptance probabilities and producer/consumer risks at designated quality levels'),
'components':dict(title='NIST/SEMATECH e-Handbook: Process modeling',url='https://www.itl.nist.gov/div898/handbook/ppc/section2/ppc22.htm',locator='Statistical process models and assumptions; descriptive groups alone do not identify causes'),
'ppk':dict(title='Minitab: Overall capability for Normal Capability Analysis',url='https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-analysis/normal-capability-analysis/interpret-the-results/all-statistics-and-graphs/overall-capability/',locator='Overall standard deviation, Pp and Ppk; comparison with within capability')}
refs['ethics']=dict(title='ICF Code of Ethics overview',url='https://coachingfederation.org/code-of-ethics-overview/',locator='Confidentiality and applicable disclosure exceptions; not a jurisdiction-specific legal ruling')
def tab(title,cols,rows):return dict(title=title,columns=cols,rows=rows)
def evidence(c,cols,rows):c['evidence']=tab(c['title']+' — numerical alternative',cols,[[str(v) for v in r] for r in rows]);return c
charts={}
charts[113]=dict(type='data-table',title='Paired inspector classifications (100 items)',altText='Inspector 1 forms the rows and Inspector 2 the columns; paired counts sum to 100.',columns=['Inspector 1 classification','Inspector 2: Pass','Inspector 2: Fail','Row total'],rows=[['Pass','30','20','50'],['Fail','10','40','50'],['Column total','40','60','100']])
means=[50.2,49.8,50.5,49.6,50.1,50.9,49.7,50.3];ranges=[2.5,3.1,2.8,3.4,2.6,7.8,2.9,3]
charts[115]=evidence(dict(type='xbar-r',title='Fixed-baseline X-bar and R charts',altText='Eight new subgroups, n=5. Dashed references are the fixed historical control limits and centerlines, not specification limits.',labels=list(range(1,9)),meanData=means,rangeData=ranges,xbarLimits=[51.6733,50,48.3267],rLimits=[6.1335,2.9,0]),['Subgroup','Mean (g)','Range (g)'],[[i+1,m,r] for i,(m,r) in enumerate(zip(means,ranges))])
charts[116]=evidence(dict(type='boxplot',title='Claims cycle time (days)',altText='Box spans Q1 to Q3, line marks median, whiskers end at observations inside 1.5-IQR fences. Three separately plotted high observations are retained.',q1=3.4,q3=5.1,median=4.2,lowerWhisker=2.1,upperWhisker=6.8,mean=4.5,outliers=[9.2,10.1,11.4]),['Statistic or observation','Days'],[['Lower whisker',2.1],['Q1',3.4],['Median',4.2],['Q3',5.1],['Upper whisker',6.8],['Mean (provided summary)',4.5],['High observation 1',9.2],['High observation 2',10.1],['High observation 3',11.4]])
values=[12.1,12.3,12.4,12.5,12.5,12.6,12.6,12.7,12.7,12.7,12.8,12.8,12.8,12.9,12.9,13.0,13.0,13.1,13.1,13.2,13.3,13.4,8.9,9.1]
sortedv=sorted(values);n=len(values);normal=statistics.NormalDist();points=[]
for i,v in enumerate(sortedv,1):
 prob=1-0.5**(1/n) if i==1 else 0.5**(1/n) if i==n else (i-.3175)/(n+.365)
 points.append(dict(rank=i,value=v,probability=prob,z=normal.inv_cdf(prob)))
def quantile(v,p):
 x=(len(v)-1)*p;lo=math.floor(x);return v[lo]+(v[min(lo+1,len(v)-1)]-v[lo])*(x-lo)
q1=quantile(sortedv,.25);q3=quantile(sortedv,.75);slope=(q3-q1)/(normal.inv_cdf(.75)-normal.inv_cdf(.25));intercept=q1-slope*normal.inv_cdf(.25)
charts[117]=evidence(dict(type='normal-prob',title='All 24 purity-assay observations',altText='Ordered purity against Filliben theoretical normal quantiles. The dashed reference passes through the sample quartiles using linear-interpolated quartiles; it is not a hypothesis test.',values=values,points=points,reference=dict(slope=slope,intercept=intercept)),['Ordered rank','Purity (mass %)','Normal quantile'],[[p['rank'],p['value'],round(p['z'],6)] for p in points])
panels=[dict(label='A',points=[[-.4,-.2],[.3,.2],[.2,-.3],[-.2,.4],[.1,.1]]),dict(label='B',points=[[-5,-3],[5,3],[-4,4],[4,-4],[0,0]]),dict(label='C',points=[[3.6,2.8],[4.3,3.2],[4.2,2.7],[3.8,3.4],[4.1,3.1]]),dict(label='D',points=[[-2,-6],[8,0],[-1,1],[7,-7],[3,-3]])]
charts[118]=evidence(dict(type='precision-accuracy',title='Four illustrative target panels',altText='Panels A–D use identical error-coordinate scales and the same central reference. Coordinates in the numerical alternative describe every marker without assigning a diagnosis.',panels=panels),['Panel','Reading','Horizontal error (units)','Vertical error (units)'],[[p['label'],i+1,*xy] for p in panels for i,xy in enumerate(p['points'])])
charts[119]=evidence(dict(type='bias-diagram',title='Illustrative reference and mean-reading comparison',altText='The figure plots mean minus reference for each of the three levels; it does not show repeatability or confidence intervals.',referenceValues=[10,50,90],measuredMeans=[12,52,92],biases=[2,2,2]),['Reference (mm)','Measured mean (mm)','Bias (mm)'],[[10,12,2],[50,52,2],[90,92,2]])
control=[499,501,500,498,502,501,502,503,502,504,503,502]
charts[121]=evidence(dict(type='control-single',title='Final 12 observations of the 48-point fill-weight sequence',altText='Only observations 37–48 are shown. The centerline is 500 g, UCL 505 g and LCL 495 g; values 41–48 are above the centerline.',labels=list(range(37,49)),data=control,ucl=505,cl=500,lcl=495),['Observation number','Weight (g)'],list(zip(range(37,49),control)))
def pa(n,c,p):return sum(math.comb(n,k)*p**k*(1-p)**(n-k) for k in range(c+1))
plans=[dict(label='A',n=200,c=10),dict(label='B',n=50,c=2)]
curves=[dict(p=i/1000,acceptance=[pa(p['n'],p['c'],i/1000) for p in plans]) for i in range(201)]
selected=[0,.01,.02,.04,.05,.06,.08,.10,.15,.20]
charts[123]=evidence(dict(type='oc-curve',title='Binomial single-sampling operating characteristics',altText='Solid curve A: sample 200, accept at most 10. Dashed curve B: sample 50, accept at most 2. Acceptance probabilities are binomial-model values; the numerical table rounds to six decimals.',plans=plans,curves=curves),['Lot defective (%)','Plan A acceptance probability','Plan B acceptance probability'],[[f'{p*100:g}',f'{pa(200,10,p):.6f}',f'{pa(50,2,p):.6f}'] for p in selected])
groups=[dict(label='Machine 1',values=[10.02,10.01,10.03,10.02]),dict(label='Machine 2',values=[10.15,10.14,10.16,10.15]),dict(label='Machine 3',values=[9.88,9.87,9.89,9.88])]
charts[124]=evidence(dict(type='multi-vari',title='Diameter measurements grouped by machine',altText='Each marker is one observation; horizontal offsets separate the four readings in each group. Group order is not a time sequence.',groups=groups),['Machine','Reading','Diameter (mm)'],[[g['label'],i+1,v] for g in groups for i,v in enumerate(g['values'])])
tips=[
'Facilitation is not allocation authority. Check the delegated decision rights and urgency before directing scarce resources or requiring a fixed split.',
'Give feedback on specific observed behavior. Do not infer intent or a retention effect without evidence, and do not leave materially misleading records uncorrected.',
'A stakeholder breakdown can also create a measurement-coverage gap. Repair the behavior and check the current data rather than prescribe generic training alone.',
'Unsupported does not always mean disproved. Preserve honest uncertainty and protected escalation rather than assume that every disagreement is misconduct.',
'Access to discussion and strength of evidence are different. Structured participation does not make a majority vote a test of technical truth.',
'Confidence is not the credential criterion, and two project outcomes do not demonstrate every competency. Support the person without diagnosing or automatically certifying.',
'A worked example can support coaching when followed by learner application. Supplying an answer without a transfer check does not demonstrate new competence.',
'Investigate the reported process fairly and explain confidentiality limits. Do not dismiss a concern, assume a finding, or promise secrecy that cannot be kept.',
'Clarify the actual obstacle before choosing support. Empathy, a manageable action and follow-up are more useful than guaranteed success or an assumed technical lecture.',
'Relevant experience is a mentoring resource, not the outcome. Check whether the mentee can apply it to the current goal and own the next action.',
'Variance percentages and standard-deviation percentages use different scales. Take the square root before comparing contribution with a study-variation threshold.',
'Under the specified common components, ndc and study variation are linked. Truncate 4.8343 to 4, and distinguish fixing the report from making the gage adequate.',
'Kappa is neither raw agreement nor the percentage correct. A reference standard is needed for an accuracy claim; marginal proportions determine expected agreement.',
'Cpk is the smaller one-sided index and reflects centering. Cp = 1 means recentering alone cannot achieve the stated 1.33 target at the same variation.',
'A new Phase II signal does not erase a sound historical baseline. Investigate dispersion and output risk; do not widen limits to absorb the signal.',
'A Tukey whisker is not necessarily the maximum observation. An outlier label is descriptive, not proof of a recording error or a time-based special cause.',
'A straight central subset does not prove full-sample normality. Check the low observations and their provenance before deleting, stratifying or fitting a mixture.',
'Moving a mean does not reduce repeatability spread. Averaging does not remove a constant bias, and a centered average need not imply accurate individual readings.',
'A 2 mm additive offset is not a 2% multiplicative error. Three observed means do not prove statistical absence of linearity error or validate a calibration.',
'An index can be calculated even when its usual tail interpretation is unsupported. Match the distributional method and transformed limits to the intended probability claim.',
'Apply the rule that was selected: eight points for this Western Electric run rule, not nine from another rule set. A signal calls for investigation, not automatic rebaselining.',
'Subgroup means and individual units have different variation. Control and specification limits answer different questions even when their numbers happen to match.',
'Steepness alone cannot compare producer and consumer risks. Specify good and poor quality levels, read acceptance there, and account for the sample-size tradeoff.',
'Between-group separation is not proof of a machine mechanism. Check lot, operator, time and setup confounding before adjusting equipment.',
'Cp ignores the mean; Ppk uses overall spread. Representative data, centering and stability are needed, not a fixed shift or a universal ordering of index estimates.']
keys=[3,2,1,2,3,1,3,0,3,2,1,3,2,2,2,0,2,2,0,2,0,2,1,0,3]
new=[];revisions=[];tracker=[]
for i,p in enumerate(P):
 old=bank[100+i];q=dict(old);assert old['answer']==keys[i]
 for f in ['stem','options','why','optionRationales']:q[f]=p[f]
 if p['number']==123:q['stem']=q['stem'].replace('selected exact probabilities','selected binomial probabilities')
 q['trap']=tips[i];q['distractors']=q['optionRationales'][:]
 q['why']+=' Source alignment: ASQ CMBB Body of Knowledge, '+p['locator']+'. Sources support principles, not ASQ authorship of this original scenario.'
 rids=p['refs']+(['ethics'] if p['number'] in [104,106,108] else [])
 q['auditSources']=[dict(refs[r],locator=p['locator'] if r=='bok' else refs[r]['locator']) for r in rids]
 if p['number'] in charts:q['chart']=charts[p['number']]
 assert q['optionRationales'][q['answer']].startswith('Correct.')
 new.append(q);revisions.append(dict(number=p['number'],qid=q['qid'],original=old,corrected=q,issues=p['issues']))
 tracker.append(dict(number=p['number'],qid=q['qid'],key='ABCD'[q['answer']],status='Content corrected; rendered validation pending',independentDecision=p['why'],issues=p['issues'],allFourChoicesReviewed=True,changed=True,visual=q.get('chart',{}).get('type','none'),browserRetest='pending'))
updated=source[:starts[100]]+''.join('  '+json.dumps(q,ensure_ascii=False,indent=2).replace('\n','\n  ')+',\n' for q in new)+source[starts[125]:]
ns=[m.start() for m in re.finditer(r'^  \{$',updated,re.M)];assert len(ns)==175 and sha(updated[:ns[100]])==prefix and sha(updated[ns[125]:])==suffix
(root/'test-bank-mbb-set3.js').write_text(updated)
calculations=dict(Q111=dict(varianceFraction=.22,studyVariationPercent=100*math.sqrt(.22)),Q112=dict(totalSD=1,gageSD=.28,partSD=math.sqrt(1-.28**2),rawNdc=1.41*math.sqrt(1-.28**2)/.28,ndc=4),Q113=dict(observedAgreement=.7,expectedAgreement=.5,kappa=.4),Q114=dict(Cp=1,Cpu=11/12,Cpl=13/12,Cpk=11/12),Q115=dict(xbar=[51.6733,50,48.3267],range=[6.1335,2.9,0],rangeSignal=6),Q116=dict(IQR=1.7,upperFence=7.65,maxObservation=11.4),Q117=dict(n=24,method='Filliben inverse normal positions; type-7 quartile reference',points=points,reference=charts[117]['reference']),Q119=dict(biases=[2,2,2]),Q121=dict(plottedNumbers=list(range(37,49)),eightPointSignal=48),Q123=dict(plans=plans,goodQuality=.01,poorQuality=.1,goodAcceptance=[pa(200,10,.01),pa(50,2,.01)],poorAcceptance=[pa(200,10,.1),pa(50,2,.1)]),Q124=dict(means=[statistics.mean(g['values']) for g in groups],ranges=[max(g['values'])-min(g['values']) for g in groups],meanSpread=.27))
for name,value in [('revisions.json',revisions),('question-audit-tracker.json',tracker),('sources.json',dict(verifiedOn='2026-09-07',sources=refs,limits='Primary-source principles and BoK alignment, not authorship or endorsement. Newly specified scenario assumptions are visible.')),
 ('preservation.json',dict(baseline='3194498cc4ce96765aef172afe09056a282ab458',range=[101,125],prefixSHA256=prefix,suffixSHA256=suffix,ids=[q['qid'] for q in bank],idsUnchanged=True,answerPositionsUnchanged=True)),('independent-calculations.json',calculations)]:
 (D/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
for b in [1,2,3,4]:
 p=root/f'tests/test-bank-mbb-set3-batch{b}-audit.test.js';s=p.read_text();old='5cb7bbdfb92e4d9e2f482356dc64c60371380e9f66d42093ad7f6827b9f63750';assert old in s
 p.write_text(s.replace('source.slice(starts[100])','source.slice(starts[125])').replace('starts[100]:','starts[125]:').replace(old,suffix).replace('Q101–175','Q126–175'))
s=(root/'test-bank-mbb-set3-batch4-ui.js').read_text().replace('Batch4','Batch5').replace('batch4','batch5').replace('mbbs3b4','mbbs3b5').replace('Q76–100','Q101–125')
s=re.sub(r' const ids=new Set\(\[.*?\]\);',' const ids=new Set('+json.dumps([q['qid'] for q in new])+');',s,count=1)
a=s.index(' function render(');b=s.index(' function rationales(',a);s=s[:a]+(staging/'batch5-visuals.js').read_text()+s[b:]
s=s.replace('width:560px;min-width:560px;max-width:none','width:660px;min-width:660px;max-width:none')
s=s.replace('`;document.head.appendChild(style);','\n.mbbs3b5-plot p{font-size:14px;line-height:1.6;white-space:normal;overflow-wrap:anywhere;color:var(--ink)}.mbbs3b5-axis,.mbbs3b5-reference{stroke:var(--ink);stroke-width:1.4;fill:none}.mbbs3b5-box{fill:var(--tint);stroke:var(--ink);stroke-width:2}.mbbs3b5-plot circle.mbbs3b5-target{fill:none;stroke:var(--line);stroke-width:1.5}.mbbs3b5-plot{margin:0 0 14px}.mbbs3b5-legend{padding:10px 18px;max-width:600px}\n`;document.head.appendChild(style);')
(root/'test-bank-mbb-set3-batch5-ui.js').write_text(s)
h=(root/'test-bank.html').read_text();hook='<script src="/test-bank-mbb-set3-batch4-ui.js"></script>';assert h.count(hook)==1;h=h.replace(hook,hook+'\n'+hook.replace('batch4','batch5'))
for line in ['    if(window.__MBBSet3Batch4UI&&window.__MBBSet3Batch4UI.isQuestion(q))return window.__MBBSet3Batch4UI.render(q,review);','    if(window.__MBBSet3Batch4UI)window.__MBBSet3Batch4UI.wire(host);']:
 assert h.count(line)==1;h=h.replace(line,line+'\n'+line.replace('Batch4','Batch5'))
(root/'test-bank.html').write_text(h)
f=root/'test-bank-feedback-loop.js';s=f.read_text();line='    if(window.__MBBSet3Batch4UI&&window.__MBBSet3Batch4UI.isQuestion(question))return window.__MBBSet3Batch4UI.rationales(question);';assert s.count(line)==1;f.write_text(s.replace(line,line+'\n'+line.replace('Batch4','Batch5')))
# Tests and browser harness are installed after reviewed data and renderer.
exec(compile((staging/'batch5-tests.py').read_text(),str(staging/'batch5-tests.py'),'exec'))
print('Batch5 scope:',len(new),'prefix:',prefix,'suffix:',suffix)

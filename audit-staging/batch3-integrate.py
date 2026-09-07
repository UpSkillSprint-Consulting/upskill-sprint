import json,pathlib,hashlib,re,copy
root=pathlib.Path.cwd();D=root/'docs/audits/mbb-set3-batch03';rev=json.loads((D/'revisions.json').read_text())
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
s=(root/'test-bank-mbb-set3.js').read_text();starts=[m.start() for m in re.finditer(r'^  \{$',s,re.M)];prefix=s[:starts[50]];suffix=s[starts[75]:]
assert sha(prefix)=='4b32c2aadc3faf6d91b1a7f5393732abf46af976d5a805de21f37c11fdeee7f3'
assert sha(suffix)=='1010968ca9290f6d1c473c63f1aeaf6bc2acd687df57846e902503920eaf9a24'
bok={'title':'ASQ Certified Master Black Belt Body of Knowledge','url':'https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf'}
refs={
'dmaic':{'title':'ASQ: DMAIC','url':'https://asq.org/quality-resources/dmaic','locator':'What are the DMAIC phases?'},
'msa':{'title':'NIST: Metrological Traceability FAQ','url':'https://www.nist.gov/metrology/metrological-traceability','locator':'5.1.4: Are traceable measurement results fit for purpose?'},
'safety':{'title':'AHRQ PSNet: Culture of Safety','url':'https://psnet.ahrq.gov/primer/culture-safety','locator':'Measuring and Achieving a Culture of Safety: just culture'},
'cpm':{'title':'PMI: Schedule Risk Analysis Simplified','url':'https://www.pmi.org/learning/library/schedule-risk-analysis-simplified-10573','locator':'CPM, merge points and float'},
'finance':{'title':'OpenStax: Principles of Accounting, Volume 2: Managerial Accounting','url':'https://openstax.org/books/principles-managerial-accounting/pages/11-4-use-discounted-cash-flow-models-to-make-capital-investment-decisions','locator':'11.4: profitability index'}}
refmap={52:['dmaic'],55:['safety'],59:['msa','dmaic'],63:['finance'],64:['cpm'],67:['dmaic'],70:['finance'],71:['dmaic'],74:['dmaic']}
charts={
57:{'type':'data-table','title':'Current scorecard to be evaluated','columns':['Measure','Current definition / context','Review / accountability'],'rows':[['Repairs completed','Raw daily count; stores differ in hours, arrivals and repair mix','Annual ranking; no action owner'],['Repeat repairs','Raw callback count; follow-up windows vary','Monthly count; no shared denominator'],['Service mix','No trigger for revising measures when repair mix changes','Owner not assigned']]},
61:{'type':'activity-network','title':'Shared vendor dependency — durations in days','nodes':{'Vendor upgrade':{'col':0,'row':1,'dur':90},'Project A':{'col':1,'row':0,'dur':60},'Project B':{'col':1,'row':1,'dur':75},'Project C':{'col':1,'row':2,'dur':45}},'edges':[['Vendor upgrade','Project A'],['Vendor upgrade','Project B'],['Vendor upgrade','Project C']],'altText':'One vendor upgrade, estimated at 90 days, precedes Project A (60 days), Project B (75 days) and Project C (45 days). These are shared dependency links, not independent risk probabilities.'},
62:{'type':'data-table','title':'Baseline weekly resource demand','columns':['Belt','Assigned projects','Demand (hours/week)','Available (hours/week)'],'rows':[['Belt 1',3,30,20],['Belt 2',2,20,20],['Belt 3',1,10,20],['Belt 4',3,30,20]],'whatIf':{'id':'belt-capacity','label':'Scenario capacity per Belt','value':20,'min':10,'max':40,'step':5,'unit':' hours/week','committed':30,'committedLabel':'Belt 1 weekly demand'},'interactiveKind':'capacity','altText':'Each Belt has baseline capacity 20 hours per week; demands are 30, 20, 10 and 30. The optional slider changes scenario capacity only.'},
64:{'type':'activity-network','title':'Readiness network — activity durations in days','nodes':{'Material testing':{'col':0,'row':0,'dur':3},'Supplier qualification':{'col':0,'row':1,'dur':4},'Design review':{'col':0,'row':2,'dur':6},'Readiness review':{'col':1,'row':1,'dur':1},'Manufacturing ready':{'col':2,'row':1,'dur':0}},'edges':[['Material testing','Readiness review'],['Supplier qualification','Readiness review'],['Design review','Readiness review'],['Readiness review','Manufacturing ready']],'altText':'Material testing, 3 days; supplier qualification, 4 days; and design review, 6 days, run in parallel. All precede a 1-day readiness review, followed by a zero-duration manufacturing-ready milestone.'},
70:{'type':'data-table','title':'Indivisible candidate projects — common appraisal basis','columns':['Project','Initial investment','NPV','PI = 1 + NPV / investment'],'rows':[['Project 1','$200,000','$180,000','1.90'],['Project 2','$250,000','$220,000','1.88'],['Project 3','$300,000','$240,000','1.80']],'whatIf':{'id':'capital-budget','label':'Scenario capital budget ($000)','value':500,'min':200,'max':750,'step':50,'unit':' $000','committed':750,'committedLabel':'All three candidates combined'},'interactiveKind':'budget','altText':'Candidate investments total $750,000. The optional slider compares that total with an exploratory budget; the exam baseline remains $500,000.'}}
tracker=[];questions=[]
for r,old in zip(rev['questions'],original):
 n=r['number'];sources=[dict(bok,locator=r['bok'])]+[refs[k] for k in refmap.get(n,[])]
 if n==61:r['stem']+=' Network durations are planning estimates in days, not independent risk probabilities.'
 x={**old,'stem':r['stem'],'options':r['options'],'why':r['why']+' Source alignment: ASQ CMBB Body of Knowledge, '+r['bok']+'. Case conclusions follow from the stated assumptions.','optionRationales':r['optionRationales'],'distractors':r['optionRationales'],'trap':r['trap'],'auditSources':sources}
 if n in charts:x['chart']=charts[n]
 r['chart']=charts.get(n);r['auditSources']=sources;questions.append(x)
 tracker.append({'number':n,'qid':x['qid'],'status':'Content corrected; rendered validation pending','keyIndexChanged':old['answer']!=x['answer'],'oldAnswerIndex':old['answer'],'newAnswerIndex':x['answer'],'findings':r['findings'],'independentSolution':r['why'],'distractorChecks':r['optionRationales'],'changedFields':[k for k in x if x[k]!=old.get(k)],'sources':sources,'visual':{'type':x.get('chart',{}).get('type'),'interactive':bool(x.get('chart',{}).get('whatIf'))},'renderedValidation':'Pending'})
new=prefix+''.join('\n'.join('  '+z for z in json.dumps(x,ensure_ascii=False,indent=2).splitlines())+',\n' for x in questions)+suffix
(root/'test-bank-mbb-set3.js').write_text(new)
(D/'revisions.json').write_text(json.dumps(rev,ensure_ascii=False,indent=2)+'\n')
(D/'question-audit-tracker.json').write_text(json.dumps(tracker,ensure_ascii=False,indent=2)+'\n')
(D/'preservation.json').write_text(json.dumps({'baselineHead':rev['baselineHead'],'beforeSha256':sha(s),'afterSha256':sha(new),'q1to50RawSha256':sha(prefix),'q76to175RawSha256':sha(suffix),'changedQids':[q['qid'] for q in questions],'allAnswerIndicesPreserved':True,'totalQuestions':175},indent=2)+'\n')
(D/'sources.json').write_text(json.dumps({'verifiedDuringAudit':True,'bok':bok,'primaryReferences':refs,'limits':'BOK locators establish topic alignment, not source authorship or endorsement of original scenarios. Case assumptions added for clarity are stated in revised stems; no textbook pages are asserted.'},indent=2)+'\n')
for file in ['tests/test-bank-mbb-set3-batch1-audit.test.js','tests/test-bank-mbb-set3-batch2-audit.test.js']:
 p=root/file;t=p.read_text().replace('Q51–175 source remains byte-identical','Q76–175 source remains byte-identical').replace('all 150 out-of-scope source objects','the previously audited Q1–25 and still-unaudited Q76–175 source objects').replace('source.slice(starts[50])','source.slice(starts[75])').replace('bb1e02717e3b6714ebde7284440a8efb35f1e2148edb205f480d2645e3d4449b',sha(suffix));p.write_text(t)
def patch(file,anchor,insert):
 p=root/file;t=p.read_text();assert t.count(anchor)==1,(file,anchor);p.write_text(t.replace(anchor,insert))
patch('test-bank.html','<script src="/test-bank-mbb-set3-batch2-ui.js"></script>','<script src="/test-bank-mbb-set3-batch2-ui.js"></script>\n<script src="/test-bank-mbb-set3-batch3-ui.js"></script>')
anchor='if(window.__MBBSet3Batch2UI&&window.__MBBSet3Batch2UI.isQuestion(q))return window.__MBBSet3Batch2UI.render(q,review);'
patch('test-bank.html',anchor,'if(window.__MBBSet3Batch3UI&&window.__MBBSet3Batch3UI.isQuestion(q))return window.__MBBSet3Batch3UI.render(q,review);\n    '+anchor)
anchor='if(window.__MBBSet3Batch2UI)window.__MBBSet3Batch2UI.wire(host);'
patch('test-bank.html',anchor,anchor+'\n    if(window.__MBBSet3Batch3UI)window.__MBBSet3Batch3UI.wire(host);')
anchor='if(window.__MBBSet3Batch2UI&&window.__MBBSet3Batch2UI.isQuestion(question))return window.__MBBSet3Batch2UI.rationales(question);'
patch('test-bank-feedback-loop.js',anchor,'if(window.__MBBSet3Batch3UI&&window.__MBBSet3Batch3UI.isQuestion(question))return window.__MBBSet3Batch3UI.rationales(question);\n    '+anchor)
p=root/'test-bank-mbb-set3-batch3-ui.js';ui=(root/'test-bank-mbb-set3-batch2-ui.js').read_text().replace('Q26–50','Q51–75').replace('mbbs3b2','mbbs3b3').replace('MBBSet3Batch2UI','MBBSet3Batch3UI').replace('mbb-set3-batch2-style','mbb-set3-batch3-style')
ui=re.sub(r'const ids=new Set\([^\n]+;', 'const ids=new Set('+json.dumps([x['qid'] for x in questions])+');',ui);p.write_text(ui)
p=root/'scripts/audit-mbb-set3-batch3.mjs';driver=(root/'scripts/audit-mbb-set3-batch2.mjs').read_text().replace('Q26–50','Q51–75').replace('slice(25,50)','slice(50,75)').replace('audit-results-batch2','audit-results-batch3').replace('mbbs3b2','mbbs3b3').replace('number:i+26','number:i+51').replace('String(i+26)','String(i+51)');p.write_text(driver)
print('range SHA',sha(prefix),sha(suffix))

import pathlib,json,re,hashlib,subprocess,statistics
root=pathlib.Path.cwd()
source=(root/'test-bank-mbb-set3.js').read_text()
assert subprocess.check_output(['git','hash-object','test-bank-mbb-set3.js'],text=True).strip()=='a68a4b1acbd7b7d068759a6fffd9942ea4613396','Question bank changed; rebase/review before writing'
bank=json.JSONDecoder().raw_decode(source[source.index('global.MBB_SET3=')+len('global.MBB_SET3='):])[0]
assert len(bank)==175 and [p['number'] for p in P]==list(range(76,101))
starts=[m.start() for m in re.finditer(r'^  \{$',source,re.M)]
assert len(starts)==175
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
prefix=sha(source[:starts[75]]); suffix=sha(source[starts[100]:])
D=root/'docs/audits/mbb-set3-batch04';D.mkdir(parents=True,exist_ok=True)
refs={
'bok':dict(title='ASQ Certified Master Black Belt Body of Knowledge',url='https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf',locator='III–V; printed pages 9–11'),
'cdc-needs':dict(title='CDC: Assess Training Needs — Conducting Needs Analysis',url='https://www.cdc.gov/training-development/php/about/assess-training-needs-conducting-needs-analysis.html',locator='Needs assessment and training needs analysis'),
'cdc-qts':dict(title='CDC Quality Training Standards',url='https://www.cdc.gov/training-development/php/qts/index.html',locator='Standards 1–8; use only the principles relevant to each original scenario'),
'cdc-eval':dict(title='CDC: Evaluate Training — Measuring Effectiveness',url='https://www.cdc.gov/training-development/php/about/evaluate-training-measuring-effectiveness.html',locator='What to evaluate; before and after training; delayed evaluation'),
'cdc-framework':dict(title='CDC Program Evaluation Framework, 2024',url='https://www.cdc.gov/mmwr/volumes/73/rr/rr7306a1.htm',locator='Focus evaluation questions and design; experimental, quasi-experimental and observational designs'),
'kirkpatrick':dict(title='Kirkpatrick Partners: The Kirkpatrick Model',url='https://www.kirkpatrickpartners.com/the-kirkpatrick-model/',locator='Reaction, Learning, Behavior and Results; interpretation of the four-level framework'),
'spacing-study':dict(title='Butowska-Buczynska et al. (2024): The role of variable retrieval in effective learning',url='https://doi.org/10.1073/pnas.2413511121',locator='Experiments on retrieval practice and spacing; principle supports a pilot, not a guarantee for Black Belt trainees'),
'relevant-cash':dict(title='The Open University: Relevant cash flows and sunk costs',url='https://www.open.edu/openlearn/money-business/challenges-advanced-management-accounting/content-section-3.1',locator='Incremental future cash flows and sunk-cost exclusion'),
'finance-metrics':dict(title='OpenStax Principles of Finance',url='https://openstax.org/books/principles-finance/pages/16-3-internal-rate-of-return-irr-method',locator='IRR limitations, scale and mutually exclusive comparisons')}
refs['finance-terms']=dict(title='OpenStax Principles of Finance: Chapter 16 Key Terms',url='https://openstax.org/books/principles-finance/pages/16-key-terms',locator='NPV, payback and mutually exclusive projects')
revisions=[];tracker=[];new=[]
expected=[3,1,1,0,2,0,3,3,3,1,1,0,1,0,0,1,3,1,3,0,0,1,1,3,0]
for i,p in enumerate(P):
 old=bank[75+i];q=dict(old);assert old['answer']==expected[i]
 for field in ['stem','options','why','optionRationales','trap']:q[field]=p[field]
 q['distractors']=q['optionRationales'][:]
 q['why']+=' Source alignment: ASQ CMBB Body of Knowledge, '+p['locator']+'. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.'
 rids=p['refs'][:]
 if p['number']==80:rids+=['finance-metrics','finance-terms']
 q['auditSources']=[dict(refs['bok'],locator=p['locator'])]+[refs[k] for k in rids]
 if p['number']==86:
  q['chart']=dict(type='data-table',title='Current course allocation and retrospective failure classification',altText='Current teaching time shares and primary categories assigned in a retrospective review of unsuccessful projects. The two percentage columns have different denominators and are not causal estimates.',columns=['Content area','Share of course time','Share of unsuccessful projects assigned this primary category'],rows=[['Statistical tools','90%','15%'],['Change management / stakeholder engagement','10%','70%'],['Other','0%','15%']])
 if p['number']==93:
  q['chart']=dict(type='data-table',title='Current training evaluation coverage',altText='Reaction is measured as high satisfaction. Direct evidence of learning, workplace behavior and standardized project results is not collected.',columns=['Evaluation level','Evidence sought','Current coverage'],rows=[['1. Reaction','Course satisfaction and relevance','Satisfaction measured: high'],['2. Learning','Knowledge and skill acquisition','Direct pre/post assessment absent'],['3. Behavior','Application in the workplace','Not systematically measured'],['4. Results','Targeted organizational outcomes','No standardized tracking; weak outcomes reported anecdotally']])
 assert q['optionRationales'][q['answer']].startswith('Correct.')
 new.append(q);revisions.append(dict(number=p['number'],qid=q['qid'],original=old,corrected=q,issues=p['issues']))
 tracker.append(dict(number=p['number'],qid=q['qid'],key='ABCD'[q['answer']],status='Content corrected; rendered validation pending',contentReviewed=True,independentDecision=p['why'],issues=p['issues'],sources=q['auditSources'],allFourChoicesReviewed=True,changed=True,visual='data-table' if q.get('chart') else 'none',browserRetest='pending'))
replacement=''.join('  '+json.dumps(q,ensure_ascii=False,indent=2).replace('\n','\n  ')+',\n' for q in new)
updated=source[:starts[75]]+replacement+source[starts[100]:]
newstarts=[m.start() for m in re.finditer(r'^  \{$',updated,re.M)]
assert sha(updated[:newstarts[75]])==prefix and sha(updated[newstarts[100]:])==suffix
(root/'test-bank-mbb-set3.js').write_text(updated)
for name,value in [('revisions.json',revisions),('question-audit-tracker.json',tracker),('sources.json',dict(verifiedOn='2026-09-07',sources=refs,limits='Primary sources verify principles and BOK topic locators. No source supplies these original company cases or implies universal curricula or causal proof.')),
 ('preservation.json',dict(baseline='f137be91f2f0f57bddfe27e6e649b0c81666d86c',range=[76,100],previousRange=[1,75],laterRange=[101,175],prefixSHA256=prefix,suffixSHA256=suffix,idsUnchanged=True,answerPositionsUnchanged=True)),
 ('independent-calculations.json',dict(Q77=dict(cashAmounts=[350000,40000,15000,20000],cashOutlay=sum([350000,40000,15000,20000]),opportunityCost=60000,economicCost=sum([350000,40000,15000,20000,60000]),lifetimeTCO='not determined',NPV='not determined'),Q86=dict(courseTime=[90,10,0],retrospectiveFailureShares=[15,70,15],timeSum=100,failureShareSum=100,optimalCurriculum='not derivable from these percentages',causalEffect='not determined'),Q95=dict(launchProportion='less than 20%',complement='more than 80% have not launched',eligibleOpportunityDenominator='not supplied in original; must be investigated')))]:
 (D/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
# Protect later unaudited records without weakening the earlier-batch byte guards.
for b in [1,2,3]:
 path=root/f'tests/test-bank-mbb-set3-batch{b}-audit.test.js';t=path.read_text()
 assert '1010968ca9290f6d1c473c63f1aeaf6bc2acd687df57846e902503920eaf9a24' in t
 t=t.replace('starts[75]','starts[100]').replace('1010968ca9290f6d1c473c63f1aeaf6bc2acd687df57846e902503920eaf9a24',suffix).replace('Q76–175','Q101–175')
 path.write_text(t)
# Same tested interaction contract, separate exact-qid namespace; remove unused plot code.
s=(root/'test-bank-mbb-set3-batch2-ui.js').read_text().replace('Batch2','Batch4').replace('batch2','batch4').replace('mbbs3b2','mbbs3b4').replace('Q26–50','Q76–100')
s=re.sub(r' const ids=new Set\(\[.*?\]\);',' const ids=new Set('+json.dumps([q['qid'] for q in new])+');',s,count=1)
a=s.index(' function plot(c){');b=s.index(' function render(q,review)',a);s=s[:a]+s[b:]
s=s.replace("(q.chart.type==='data-table'?table(q.chart):plot(q.chart))","table(q.chart)")
s=s.replace("function table(c){return '<div", "function table(c){return '<p class=\"mbbs3b4-scroll-hint\">Scroll or swipe horizontally when needed to read every table column.</p><div")
s=s.replace('`;document.head.appendChild(style);','\n.mbbs3b4-table{min-width:560px}.mbbs3b4-scroll-hint{font-size:13px;line-height:1.6;color:var(--ink)!important;margin:8px 0}.mbbs3b4-table th,.mbbs3b4-table td{overflow-wrap:break-word}\n`;document.head.appendChild(style);')
(root/'test-bank-mbb-set3-batch4-ui.js').write_text(s)
h=(root/'test-bank.html').read_text();hook='<script src="/test-bank-mbb-set3-batch3-ui.js"></script>';assert h.count(hook)==1
h=h.replace(hook,hook+'\n<script src="/test-bank-mbb-set3-batch4-ui.js"></script>')
line='    if(window.__MBBSet3Batch3UI&&window.__MBBSet3Batch3UI.isQuestion(q))return window.__MBBSet3Batch3UI.render(q,review);';assert h.count(line)==1;h=h.replace(line,line+'\n'+line.replace('Batch3','Batch4'))
line='    if(window.__MBBSet3Batch3UI)window.__MBBSet3Batch3UI.wire(host);';assert h.count(line)==1;h=h.replace(line,line+'\n'+line.replace('Batch3','Batch4'));(root/'test-bank.html').write_text(h)
f=(root/'test-bank-feedback-loop.js').read_text();line='    if(window.__MBBSet3Batch3UI&&window.__MBBSet3Batch3UI.isQuestion(question))return window.__MBBSet3Batch3UI.rationales(question);';assert f.count(line)==1;(root/'test-bank-feedback-loop.js').write_text(f.replace(line,line+'\n'+line.replace('Batch3','Batch4')))
# Item tests: semantic review is in revisions/tracker, not inferred from schema assertions.
testhead="""'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(75,100);
const keys=KEYS,ids=IDS;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 4 Q${i+76}: identity, reviewed key, independent case and all-choice feedback`,()=>{
 assert.equal(q.qid,ids[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,i<5?'mbb-portfolio':i<20?'mbb-training':'mbb-coaching');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);
 assert.ok(q.optionRationales.every(s=>s.length>40));assert.equal(q.optionRationales.filter(s=>s.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));
 assert.ok(q.stem.length>180);assert.ok(q.why.length>250);assert.ok(q.trap.length>80);assert.ok(q.auditSources.every(s=>s.title&&s.url&&s.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/D[1-6]-[0-9]|elsewhere in this bank|across this entire domain|full-subdomain capstone/);
 const lengths=q.options.map(s=>s.split(/\\s+/).length),other=lengths.filter((_,j)=>j!==q.answer).sort((a,b)=>a-b);assert.ok(lengths[q.answer]/other[1]<1.6);
});
test('Batch 4 independently byte-locks all Q1–75 and Q101–175 plus all identities',()=>{
 const starts=[...source.matchAll(/^  \\{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[75])),'PREFIX');assert.equal(sha(source.slice(starts[100])),'SUFFIX');assert.equal(new Set(bank.map(q=>q.qid)).size,175);
});
test('Q77 derives cash outlays and opportunity-inclusive economic cost from the actual stem',()=>{
 const a=[...batch[1].stem.matchAll(/\\$([0-9,]+)/g)].map(m=>Number(m[1].replace(/,/g,'')));assert.deepEqual(a,[350000,40000,15000,20000,60000]);
 const cash=a.slice(0,4).reduce((s,v)=>s+v,0),economic=cash+a[4];assert.equal(cash,425000);assert.equal(economic,485000);
 assert.match(batch[1].options[keys[1]],/485,000.*425,000/);assert.match(batch[1].stem,/after avoided variable costs/);assert.match(batch[1].why,/not lifetime.*NPV/);
});
test('Q86 retains each original percentage and prevents causal or proportional-curriculum inference',()=>{
 const rows=batch[10].chart.rows;assert.deepEqual(rows.map(r=>parseFloat(r[1])),[90,10,0]);assert.deepEqual(rows.map(r=>parseFloat(r[2])),[15,70,15]);
 for(const j of [1,2])assert.equal(rows.reduce((s,r)=>s+parseFloat(r[j]),0),100);assert.match(batch[10].stem,/not experimental proof/);assert.match(batch[10].why,/does not imply that 70%/);
});
test('Both original visual items remain complete accessible tables, not interactive simulations',()=>{
 assert.deepEqual(batch.filter(q=>q.chart).map(q=>q.qid),[batch[10].qid,batch[17].qid]);
 for(const q of batch.filter(q=>q.chart)){assert.equal(q.chart.type,'data-table');assert.ok(q.chart.title&&q.chart.altText);assert.ok(q.chart.rows.every(r=>r.length===q.chart.columns.length));assert.ok(!q.chart.whatIf);}
 assert.equal(batch[17].chart.rows.length,4);assert.match(batch[17].why,/not itself prove a causal sequence/);
});
test('Causal, prerequisite, financial and champion-authority corrections remain explicit',()=>{
 assert.match(batch[4].why,/not identical use of every metric/);assert.match(batch[7].why,/not establish overconfidence/);assert.match(batch[11].why,/does not universally require/);
 assert.match(batch[13].stem,/proficiency varies/);assert.match(batch[14].why,/does not isolate the cause/);assert.match(batch[16].stem,/repeated time slots/);
 assert.match(batch[18].stem,/randomly assigned/);assert.match(batch[18].why,/not only successful graduates/);assert.match(batch[19].why,/does not establish which cause/);
 assert.match(batch[21].why,/not attendance itself/);assert.match(batch[22].why,/current scope error/);assert.match(batch[24].why,/Past spending is sunk/);
});
test('Exact-id renderer scope, escaping, mobile table guidance and hidden report form',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch4-ui.js'),c);const ui=c.window.__MBBSet3Batch4UI;
 assert.ok(bank.every((q,i)=>ui.isQuestion(q)===(i>=75&&i<100)));assert.equal(ui.isQuestion({qid:'cssbb:set-3:d4-006'}),false);
 for(const q of batch){const h=ui.render(q,false);assert.ok(!h.includes(q.optionRationales[q.answer]));assert.doesNotMatch(h,/NaN|undefined/);}
 assert.match(ui.render({...batch[0],stem:'<img onerror="bad">'},false),/&lt;img/);
 const t=ui.render(batch[10],false);assert.match(t,/<caption>/);assert.match(t,/scope="col"/);assert.match(t,/scope="row"/);assert.match(t,/tabindex="0"/);assert.match(t,/Scroll or swipe/);
 assert.ok(read('test-bank-mbb-set3-batch4-ui.js').includes('.tb-report-box[hidden]{display:none!important}'));
});
"""
testhead=testhead.replace('KEYS',json.dumps(expected)).replace('IDS',json.dumps([q['qid'] for q in new])).replace('PREFIX',prefix).replace('SUFFIX',suffix)
oldtest=(root/'tests/test-bank-mbb-set3-batch3-audit.test.js').read_text();tail=oldtest[oldtest.index('// Functional grading regression'):].replace('Batch 3','Batch 4').replace('batch3','batch4').replace('Batch3','Batch4')
(root/'tests/test-bank-mbb-set3-batch4-audit.test.js').write_text(testhead+tail)
# Driver exercises real published player code; backend remains an isolated fixture.
driver=(root/'scripts/audit-mbb-set3-batch3.mjs').read_text().replace('Q51–75','Q76–100').replace('slice(50,75)','slice(75,100)').replace('batch3','batch4').replace('Batch3','Batch4').replace('mbbs3b3','mbbs3b4').replace('i+51','i+76')
a=driver.index('async function checkVisual(');b=driver.index('async function geometry(',a)
driver=driver[:a]+"""async function checkVisual(page,q,host,phase,label){
 if(!q.chart)return;const c=q.chart;
 assert.equal(c.type,'data-table');assert.equal(await host.locator('caption').innerText(),c.title);
 const rows=host.locator('.mbbs3b4-table tbody tr');assert.equal(await rows.count(),c.rows.length);
 for(let i=0;i<c.rows.length;i++){const cells=await rows.nth(i).locator('th,td').allTextContents();assert.deepEqual(cells,c.rows[i].map(String));}
 assert.equal(await host.locator('.mbbs3b4-table thead th[scope="col"]').count(),c.columns.length);
 assert.equal(await host.locator('.mbbs3b4-table tbody th[scope="row"]').count(),c.rows.length);
 const area=host.locator('.mbbs3b4-scroll');await area.focus();await page.keyboard.press('ArrowRight');
 const keyboardScroll=await area.evaluate(e=>({needed:e.scrollWidth>e.clientWidth+2,moved:e.scrollLeft>0}));
 if(keyboardScroll.needed){await page.waitForTimeout(150);assert.ok(await area.evaluate(e=>e.scrollLeft>0));}
 await area.evaluate(e=>e.scrollLeft=e.scrollWidth);const right=await area.evaluate(e=>({needed:e.scrollWidth>e.clientWidth+2,moved:e.scrollLeft>0}));assert.ok(!right.needed||right.moved);
 await area.screenshot({path:path.join(out,label+'-'+phase+'-table-right.png')});await area.evaluate(e=>e.scrollLeft=0);
 report.interactions.push({qid:q.qid,phase,tableCellsVerified:true,captionVerified:true,columnAndRowHeaders:true,keyboardScroll,rightEdgeScroll:right});save();
}
"""+driver[b:]
# Preserve the original error even when the failed browser can no longer serialize its page.
driver=driver.replace("fs.writeFileSync(path.join(out,engine+'-'+layout+'-failure.html'),await page.content());", "try{fs.writeFileSync(path.join(out,engine+'-'+layout+'-failure.html'),await page.content());}catch{}")
(root/'scripts/audit-mbb-set3-batch4.mjs').write_text(driver)
print('Prepared 25 independently reviewed items; previous prefix',prefix,'later suffix',suffix)

# Execute after batch7-content.py in the same namespace on the guarded PR head.
import itertools, math
# Make the separable-benefit assumption visible, not a hidden optimization premise.
q=bank[155];q['stem']=q['stem'].replace('Which ranking best supports','Assume benefits from the inspections are additive and do not interact. Which ranking best supports')
updated=protected+''.join('  '+json.dumps(q,ensure_ascii=False,indent=2).replace('\n','\n  ')+',\n' for q in bank[150:])+trailer
(root/'test-bank-mbb-set3.js').write_text(updated)
(D/'revisions.json').write_text(json.dumps(revisions,ensure_ascii=False,indent=2)+'\n')
# Extend established, accessible player styling only to the exact final-batch IDs.
p=root/'test-bank-mbb-set3-batch4-ui.js';ui=p.read_text().replace('Q76–100','Q151–175').replace('Batch4','Batch7').replace('batch4','batch7').replace('b4','b7')
ui=re.sub(r'const ids=new Set\(\[.*?\]\);','const ids=new Set('+json.dumps([q['qid'] for q in bank[150:]])+');',ui,count=1)
old="(q.chart?'<div class=\"mbbs3b7-evidence\">'+table(q.chart)+'</div>':'')"
new="(q.chart?'<div class=\"mbbs3b7-evidence\">'+(q.chart.type==='house-of-quality'?house(q.chart):table(q.chart))+'</div>':'')"
assert old in ui;ui=ui.replace(old,new)
helper='''
 function house(c){return '<p class="mbbs3b7-scroll-hint">Simplified review-status sketch. Scroll or swipe to inspect the complete diagram.</p><div class="mbbs3b7-scroll" role="region" tabindex="0" aria-label="House of quality status diagram; scroll horizontally if needed"><figure class="mbbs3b7-plot"><figcaption>'+esc(c.title)+'</figcaption><svg viewBox="0 0 560 400" role="img" aria-label="'+esc(c.altText)+'"><title>'+esc(c.title)+'</title><desc>'+esc(c.altText)+'</desc><path d="M170 160 L350 36 L530 160 Z" fill="none" stroke="currentColor" stroke-width="2"/><text x="350" y="118" text-anchor="middle">Technical-correlation roof</text><text x="350" y="144" text-anchor="middle">Not assessed</text><rect x="170" y="174" width="360" height="54" fill="none" stroke="currentColor"/><text x="350" y="195" text-anchor="middle">Technical characteristics</text><text x="350" y="216" text-anchor="middle">Battery capacity · housing thickness · mass</text><rect x="20" y="242" width="136" height="112" fill="none" stroke="currentColor"/><text x="88" y="272" text-anchor="middle">Customer needs</text><text x="88" y="299" text-anchor="middle">Duration</text><text x="88" y="320" text-anchor="middle">Durability</text><text x="88" y="341" text-anchor="middle">Portability</text><rect x="170" y="242" width="360" height="112" fill="none" stroke="currentColor"/><text x="350" y="279" text-anchor="middle">Customer-to-technical relationships</text><text x="350" y="308" text-anchor="middle">Recorded in the review body</text><text x="280" y="382" text-anchor="middle">Status sketch only — not measured performance</text></svg></figure></div>'+table(c.evidence);}
'''
ui=ui.replace(' function render(q,review)',helper+' function render(q,review)')
(root/'test-bank-mbb-set3-batch7-ui.js').write_text(ui.rstrip()+'\n')
p=root/'test-bank.html';h=p.read_text()
for old in ['<script src="/test-bank-mbb-set3-batch6-ui.js"></script>', 'if(window.__MBBSet3Batch6UI&&window.__MBBSet3Batch6UI.isQuestion(q))return window.__MBBSet3Batch6UI.render(q,review);','if(window.__MBBSet3Batch6UI)window.__MBBSet3Batch6UI.wire(host);']:
 assert old in h,old;h=h.replace(old,old+'\n'+old.replace('Batch6','Batch7').replace('batch6','batch7'),1)
p.write_text(h)
p=root/'test-bank-feedback-loop.js';h=p.read_text();old='if(window.__MBBSet3Batch6UI&&window.__MBBSet3Batch6UI.isQuestion(question))return window.__MBBSet3Batch6UI.rationales(question);';assert old in h;h=h.replace(old,old+'\n'+old.replace('Batch6','Batch7'),1);p.write_text(h)
# Earlier prefixes remain independently locked. Final suffix is now just the immutable trailer.
old_suffix=sha(original_source_suffix) if 'original_source_suffix' in globals() else 'fdbb6f31fbeae47aafea3f47e2ea5d1452d5b5dae00cbfec2e8a32489d9e10d3'
for b in range(1,7):
 p=root/f'tests/test-bank-mbb-set3-batch{b}-audit.test.js';s=p.read_text()
 assert 'source.slice(starts[150])' in s
 s=s.replace('source.slice(starts[150])',"source.slice(source.lastIndexOf('  ];'))").replace(old_suffix,sha(trailer)).replace('Q151–175','final JavaScript trailer')
 p.write_text(s)
# Independent analytical values: derived without reading stored keys or explanatory numbers.
rates=[42,51,58,64,55,67,71,89]
corners=list(itertools.product([-1,1],repeat=3))
corners=sorted(corners,key=lambda x:(x[2],x[1],x[0]))
effects={name:sum(math.prod(row[j] for j in ix)*y for row,y in zip(corners,rates))/4 for name,ix in [('A',[0]),('B',[1]),('C',[2]),('AB',[0,1]),('AC',[0,2]),('BC',[1,2]),('ABC',[0,1,2])]}
bounds=[.02,.05,.10,.10,.05];extremes=[sum(a*b for a,b in zip(signs,bounds)) for signs in itertools.product([-1,1],repeat=5)]
calcs={'Q151':{'observations':rates,'factorialEffects':effects,'largestObservedMean':max(rates),'notAnInferredGlobalOptimum':True},'Q152':{'twoLevel':2**3,'fiveLevel':5**3,'ratio':5**3/2**3,'extraSettings':5**3-2**3},'Q154':{'extraRowFraction':.08,'relativeOverstatementIfOnlyDuplicates':.08/.92},'Q160':{'inputEvents':['E1','E2','E3'],'outputEvents':['E1','E1','E3'],'inputAmount':600,'outputAmount':500,'inputRows':3,'outputRows':3},'Q166':{'weights':[.25,.30,.20,.25],'scores':[2,2,1,-1],'weightedScore':sum(w*s for w,s in zip([.25,.30,.20,.25],[2,2,1,-1]))},'Q168':{'A':.02,'B':.03,'BgivenA':.10,'joint':.02*.10,'union':.02+.03-.02*.10,'independentProductNotApplicable':.02*.03},'Q171':{'bounds':bounds,'all32ExtremeSums':extremes,'worstCase':max(extremes),'assemblyLimit':.25,'gap':max(extremes)-.25,'withoutComponent1':sum(bounds[1:]),'rssNotHardBound':math.sqrt(sum(b*b for b in bounds))}}
(D/'independent-calculations.json').write_text(json.dumps(calcs,indent=2)+'\n')
keys=[q['answer'] for q in original[150:]];ids=[q['qid'] for q in original[150:]]
tests="""'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('test-bank-mbb-set3.js'),ctx={window:{}};vm.runInNewContext(source,ctx);
const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3)),batch=bank.slice(150,175);
const keys=KEYS,ids=IDS,sha=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [i,q] of batch.entries())test(`Batch 7 Q${i+151}: reviewed identity, unique key and complete individual feedback`,()=>{
 assert.equal(q.qid,ids[i]);assert.equal(q.answer,keys[i]);assert.equal(q.set,3);assert.equal(q.sub,'mbb-analytics');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);assert.deepEqual(q.distractors,q.optionRationales);
 assert.equal(q.optionRationales.filter(r=>r.startsWith('Correct.')).length,1);assert.ok(q.optionRationales[q.answer].startsWith('Correct.'));assert.ok(q.optionRationales.every(r=>r.length>45));
 assert.ok(q.stem.length>180);assert.ok(q.why.length>250);assert.ok(q.trap.length>80);assert.ok(q.auditSources.every(r=>r.title&&r.url&&r.locator));
 assert.doesNotMatch(q.stem+' '+q.why,/D[1-6]-[0-9]{2}|original assignment|elsewhere in this bank|capstone question|published question/);
});
test('Batch 7 independently preserves every Q1–150 byte, all IDs/keys and the closing JavaScript',()=>{
 const starts=[...source.matchAll(/^  \\{$/gm)].map(m=>m.index);assert.equal(starts.length,175);
 assert.equal(sha(source.slice(0,starts[150])),'PREFIX');assert.equal(sha(source.slice(source.lastIndexOf('  ];'))),'TRAILER');
 const p=JSON.parse(read('docs/audits/mbb-set3-batch07/preservation.json'));assert.deepEqual(bank.map(q=>q.qid),p.ids);assert.deepEqual(bank.map(q=>q.answer),p.keys);assert.equal(new Set(p.ids).size,175);
});
test('Q151 retains all observed corners and describes conditional effects without inventing uncertainty',()=>{
 const rows=batch[0].chart.rows;const y=rows.map(r=>Number(r[3]));assert.deepEqual(y,[42,51,58,64,55,67,71,89]);assert.equal(y[1]-y[0],9);assert.equal(y[7]-y[6],18);assert.equal(Math.max(...y),89);
 assert.match(batch[0].why,/not a significance result/);assert.match(batch[0].chart.columns[3],/nm\\/min/);
});
test('Q152 full-factorial counts distinguish factor levels, combinations and replication',()=>{
 assert.equal(5**3,125);assert.equal(2**3,8);assert.equal(5**3/2**3,15.625);assert.equal(5**3-2**3,117);
 assert.match(batch[1].stem,/30 independent trials/);assert.match(batch[1].options[3],/125-setting/);assert.match(batch[1].why,/No uniquely optimal/);
});
test('Q153/Q162 distinguish initial semantic standardization from governed variant changes',()=>{
 assert.match(batch[2].stem,/original customer promise/);assert.match(batch[2].why,/eligible denominator/);assert.match(batch[11].stem,/approved canonical definition/);assert.match(batch[11].why,/changed denominator/);
});
test('Q154 distinguishes imported-row denominator and corrected-total overstatement',()=>{
 assert.ok(Math.abs(.08/.92-.08695652173913043)<1e-12);assert.match(batch[3].why,/0.08\\/0.92/);assert.match(batch[3].stem,/legitimate separate events/);
});
test('Q155/Q156 retain fitness for decision, common risk horizon and feasible preventable benefit',()=>{
 assert.match(batch[4].why,/does not establish.*current/);assert.match(batch[4].options[0],/restrict decisions/);
 assert.match(batch[5].stem,/additive and do not interact/);assert.match(batch[5].stem,/next-week horizon/);assert.match(batch[5].why,/fraction preventable/);
});
test('Q157 prevents full-data supervised encoding and specifies unseen-category handling',()=>{
 assert.match(batch[6].stem,/before splitting/);assert.match(batch[6].why,/out-of-fold/);assert.match(batch[6].options[3],/unseen categories/);
});
test('Q158 does not invent legal retention periods or conflate archives and anonymization',()=>{
 assert.match(batch[7].stem,/No jurisdiction-specific/);assert.match(batch[7].why,/not automatically unlawful/);assert.match(batch[7].why,/does not necessarily anonymize/);
});
test('Q159 keeps correct pooled-unit ratios and mix limitations distinct',()=>{
 assert.match(batch[8].why,/total first-pass units divided by total first-inspected units/);assert.match(batch[8].why,/not automatically rolled-throughput/);
 const pooled=(90+50)/(100+1000),average=(.9+.05)/2;assert.notEqual(pooled,average);
});
test('Q160 reconstructs the actual join and detects offsetting duplicates and missing events',()=>{
 const left=[['E1',100],['E2',200],['E3',300]],right=['E1','E1','E3'];
 const joined=left.flatMap(row=>right.filter(id=>id===row[0]).map(()=>row));assert.equal(joined.length,left.length);assert.deepEqual(joined.map(r=>r[0]),['E1','E1','E3']);assert.equal(joined.reduce((s,r)=>s+r[1],0),500);assert.equal(left.reduce((s,r)=>s+r[1],0),600);
 assert.match(batch[9].why,/LEFT JOIN/);assert.match(batch[9].why,/still multiplies/);
});
test('Q163 depicts the specific unfinished roof, not an unrelated generic matrix',()=>{
 const c=batch[12].chart;assert.equal(c.type,'house-of-quality');assert.equal(c.evidence.rows[0][2],'Not assessed');assert.equal(c.evidence.rows.length,4);assert.match(batch[12].why,/not automatically measured Pearson/);
});
test('Q164/Q165 distinguish biased service metrics and requirement verification from intended-use validation',()=>{
 assert.match(batch[13].why,/average among successful cases/);assert.match(batch[14].why,/test, analysis, inspection or demonstration/);assert.match(batch[14].why,/Validation asks/);
});
test('Q166 independently calculates the weighted score while preserving the separate safety gate',()=>{
 const rows=batch[15].chart.rows;assert.deepEqual(rows.map(r=>parseFloat(String(r[2]).replace('−','-'))),[2,2,1,-1]);
 const w=rows.map(r=>Number(r[0].match(/(\\d+)%/)[1])/100);assert.equal(w.reduce((a,b)=>a+b,0),1);const score=w.reduce((s,v,i)=>s+v*[2,2,1,-1][i],0);assert.ok(Math.abs(score-1.05)<1e-12);
 assert.match(batch[15].stem,/not the classical/);assert.match(batch[15].why,/does not itself prove failure/);
});
test('Q168 derives joint probability from conditional evidence, not the invalid independent product',()=>{
 const rows=batch[17].chart.rows,p=rows.map(r=>Number(r[1]));assert.deepEqual(p,[.02,.03,.10]);const joint=p[0]*p[2];assert.equal(joint,.002);assert.ok(Math.abs(p[0]+p[1]-joint-.048)<1e-12);assert.notEqual(joint,p[0]*p[1]);
 assert.match(batch[17].options[2],/0.0020/);assert.match(batch[17].why,/does not require identical failure onset/);assert.equal(rows.length,3);
});
test('Q169/Q170 distinguish control-by-noise selection and tolerances from measured variation',()=>{
 assert.match(batch[18].options[0],/Cross candidate settings/);assert.match(batch[19].why,/do not uniquely determine/);assert.match(batch[19].why,/not an observed production/);
});
test('Q171 enumerates all 32 permitted extremes and proves cheapest-component-only infeasibility',()=>{
 const limits=[.02,.05,.10,.10,.05],sums=Array.from({length:32},(_,k)=>limits.reduce((s,t,i)=>s+((k>>i)&1?1:-1)*t,0));
 assert.ok(Math.abs(Math.max(...sums)-.32)<1e-12);assert.ok(Math.abs(Math.min(...sums)+.32)<1e-12);assert.ok(Math.abs(limits.slice(1).reduce((a,b)=>a+b,0)-.30)<1e-12);assert.ok(Math.max(...sums)>.25);
 assert.ok(Math.abs(Math.sqrt(limits.reduce((s,v)=>s+v*v,0))-.15937377450509227)<1e-12);assert.match(batch[20].stem,/No statistical tolerance alternative/i);assert.match(batch[20].why,/do not prove a unique cost optimum/);
});
test('Q172/Q174 retain acceleration validity and configuration-change impact controls',()=>{
 assert.match(batch[21].why,/defensible stress-life relationship/);assert.match(batch[23].why,/change-impact review/);assert.match(batch[23].why,/universal linear sequence/);
});
test('All five visual questions retain exact tables, scope and safe escaped rendering',()=>{
 const c={window:{}};vm.runInNewContext(read('test-bank-mbb-set3-batch7-ui.js'),c);const ui=c.window.__MBBSet3Batch7UI;
 assert.ok(bank.every((q,i)=>ui.isQuestion(q)===(i>=150)));assert.equal(ui.isQuestion({qid:'cssbb:set-3:d6-041'}),false);
 assert.deepEqual(batch.flatMap((q,i)=>q.chart?[151+i]:[]),[151,163,166,168,171]);
 for(const q of batch){const h=ui.render(q,false);assert.doesNotMatch(h,/NaN|undefined/);assert.ok(!h.includes(q.optionRationales[q.answer]));if(q.chart){const t=q.chart.type==='data-table'?q.chart:q.chart.evidence;assert.ok(t.rows.every(r=>r.length===t.columns.length));assert.match(h,/<caption>/);assert.match(h,/scope="row"/);assert.match(h,/tabindex="0"/);}}
 assert.match(ui.render({...batch[0],stem:'<img onerror="bad">'},false),/&lt;img/);assert.match(ui.render(batch[12],false),/<svg/);
});
test('Answer choices have no systematic all-longest-key cue and duplicate-normalized options',()=>{
 const longest=batch.filter(q=>q.options[q.answer].split(/\\s+/).length>Math.max(...q.options.filter((_,i)=>i!==q.answer).map(s=>s.split(/\\s+/).length)));
 assert.ok(longest.length<=14,`uniquely longest correct options: ${longest.length}`);
 for(const q of batch)assert.equal(new Set(q.options.map(s=>s.toLowerCase().replace(/[^a-z0-9]/g,''))).size,4);
});
""".replace('KEYS',json.dumps(keys)).replace('IDS',json.dumps(ids)).replace('PREFIX',sha(protected)).replace('TRAILER',sha(trailer))
# Reuse the real player's exhaustive all-option grading loop, not a simulated grader.
tail=(root/'tests/test-bank-mbb-set3-batch4-audit.test.js').read_text().split('for(let rotation=0;')[1]
tests+='for(let rotation=0;'+tail.replace('Batch 4','Batch 7').replace('batch4','batch7')
(root/'tests/test-bank-mbb-set3-batch7-audit.test.js').write_text(tests.rstrip()+'\n')
fallback=(root/'tests/test-bank-mbb-set3-batch6-fallback.test.js').read_text().replace('Batch 6','Batch 7').replace('Batch6','Batch7').replace('batch6','batch7').replace('b6','b7').replace('slice(125,150)','slice(150,175)').replace('items.length,5','items.length,1').replace('all five graphical','the graphical')
(root/'tests/test-bank-mbb-set3-batch7-fallback.test.js').write_text(fallback.rstrip()+'\n')
# The browser driver operates on the actual page and handlers, with isolated backend fixtures.
s=(root/'scripts/audit-mbb-set3-batch6.mjs').read_text().replace('Q126–150','Q151–175').replace('batch6','batch7').replace('b6','b7').replace('slice(125,150)','slice(150,175)').replace('i+126','i+151')
a=s.index(' const expectedCounts=');b=s.index(' const regions=',a)
s=s[:a]+''' assert.equal(await host.locator('circle[data-point]').count(),0);
 assert.equal(await host.locator('svg[role="img"]').count(),c.type==='house-of-quality'?1:0);
 if(c.type==='house-of-quality'){
  const labels=await host.locator('svg text').allTextContents();
  for(const text of ['Technical-correlation roof','Not assessed','Technical characteristics','Customer needs','Customer-to-technical relationships'])assert.ok(labels.includes(text),text);
 }
'''+s[b:]
s=s.replace('actualPointCount:expectedCounts[c.type]','actualPointCount:0')
# Capture the exact intended review card before opening optional sections.
s=s.replace("const card=page.locator('.tb-review-card');assert.equal", "await page.waitForFunction(id=>document.querySelector('.tb-review-card')?.dataset.questionId===id,q.qid);const card=page.locator('.tb-review-card');assert.equal")
(root/'scripts/audit-mbb-set3-batch7.mjs').write_text(s.rstrip()+'\n')
# Whitespace and syntax are gated before push; normalization touches only new files.
for f in ['test-bank-mbb-set3-batch7-ui.js','scripts/audit-mbb-set3-batch7.mjs','tests/test-bank-mbb-set3-batch7-audit.test.js','tests/test-bank-mbb-set3-batch7-fallback.test.js']:
 p=root/f;p.write_text(p.read_text().rstrip()+'\n')
print('Batch 7 built: 25 revised items; four tables and one HOQ diagram with accessible status table.')

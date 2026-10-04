const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {setup}=require('./helpers/calculator-browser');
const context=vm.createContext({console});
vm.runInContext('function quantile(a,q){const p=(a.length-1)*q;return a[Math.floor(p)]+(a[Math.ceil(p)]-a[Math.floor(p)])*(p-Math.floor(p));}',context);
for(const name of ['numeric','analysis-core','guided-data','guided-core'])vm.runInContext(fs.readFileSync(`tools/calculator-assets/${name}.js`,'utf8'),context);
const D=vm.runInContext('GuidedData',context),G=vm.runInContext('GuidedAnalysis',context);
const dataset=text=>D.create(D.parseDelimited(text));
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const opts={goal:'compare',design:'independent',y:'1',group:'0',baseline:'Before',direction:'lower',threshold:'0.2',confidence:.95,filterColumn:''};
test('QA: guided Welch inference is invariant to measurement units',()=>{
 for(const scale of [1e90,1e-90]){
  const d=dataset('Group,Y\n'+[...['Before,10','Before,12','Before,11'],...['After,7','After,8','After,9']].map(row=>{const [g,y]=row.split(',');return g+','+Number(y)*scale;}).join('\n'));
  const e=G.run(d,{...opts,threshold:0}).result.effect;
  near(e.df,4,1e-12);near(e.estimate/scale,-3,1e-12);near(e.se/scale,Math.sqrt(2/3),1e-12);
  near(e.p,0.021311641128756727,1e-11);
 }
});
test('QA: 50 fresh seeded Welch cases match independent SciPy references across units',()=>{
 const refs=JSON.parse(fs.readFileSync('tests/fixtures/calculator-final-qa-reference.json'));
 assert.equal(refs.welch.length,50);
 for(const c of refs.welch){
  const d=dataset('Group,Y\n'+[...c.before.map(y=>'Before,'+y),...c.after.map(y=>'After,'+y)].join('\n'));
  const e=G.run(d,{...opts,threshold:0}).result.effect;
  near(e.df,c.expected.df,1e-10);near(e.estimate/e.se,c.expected.stat,1e-10);near(e.p,c.expected.p,1e-11);
 }
});

test('CSV preserves quoted delimiters, line breaks, BOM, empty and short records',()=>{
  const parsed=D.parseDelimited('\uFEFFLabel,Value,Note\r\n"A, B",1,"line 1\nline 2"\r\nC,,"He said ""yes"""\r\nD,3\r\n');
  const d=D.create(parsed);assert.equal(d.rows.length,3);assert.equal(d.rows[0][0],'A, B');assert.equal(d.rows[0][2],'line 1\nline 2');
  assert.equal(d.rows[1][1],'');assert.equal(d.rows[2][2],'');assert.equal(d.sourceRows[1],4);assert.match(d.notes.join(' '),/padded/);
  assert.equal(D.parseDelimited('A\tB\n1\t2').delimiter,'\t');assert.equal(D.parseDelimited('A;B\n1;2').delimiter,';');
  assert.throws(()=>D.parseDelimited('A,B\n"oops,2'),/not closed/);assert.throws(()=>D.parseDelimited('A,B\n"x"bad,2'),/closing quote/);
  assert.throws(()=>D.parseDelimited('A,B\na"b,2'),/quote must start/);
  const blank=dataset('A,B\n1,2\n\n3,4');assert.equal(blank.rows.length,3);assert.equal(D.profile(blank).missing,2);
});
test('headers, dimensions and numbers are validated without coercion or silent deletion',()=>{
  const d=dataset('A,A,\n1,2,3');assert.deepEqual(Array.from(d.columns),['A','A (2)','Column 3']);
  for(const text of ['', '1,234','1x','0x10','Infinity','1e101','=1+2'])assert.ok(Number.isNaN(D.number(text)),text);
  near(D.number(' -2.5e-3 '),-.0025);assert.throws(()=>D.create({matrix:[['a'],...Array.from({length:10001},()=>['1'])]}),/limit|10,000/);
  assert.throws(()=>D.create({matrix:[Array(41).fill('a'),Array(41).fill('1')]}),/limit/);
  assert.throws(()=>D.create({matrix:[Array(40).fill('a'),...Array.from({length:2501},()=>Array(40).fill('1'))]}),/100,000/);
});
test('missing, invalid, filtered and manually excluded rows remain traceable; pairs stay aligned',()=>{
  const d=dataset('Before,After,Shift\n10,8,A\n12,,A\n14,10,A\n13,9,B\n11,bad,A');
  const o={goal:'compare',design:'paired',y:'0',x:'1',direction:'lower',confidence:.95,filterColumn:'2',filterValue:'A'};
  assert.throws(()=>G.run(d,o),/not a complete number/);d.excluded=[4];assert.throws(()=>G.run(d,o),/missing values/);
  const r=G.run(d,{...o,allowMissing:true});assert.equal(r.plan.selected.length,2);assert.equal(r.plan.excluded.length,3);near(r.result.effect.estimate,-3);
  assert.deepEqual(Array.from(r.plan.selected,r=>r.index),[0,2]);assert.match(G.report(r,d),/Missing: After/);assert.match(G.report(r,d),/Unchecked in data table/);
});
test('guided t inference matches independent SciPy reference cases and contrast direction',()=>{
  const refs=JSON.parse(fs.readFileSync('tests/fixtures/calculator-guided-reference.json','utf8'));
  for(const ref of refs.cases){
    const d=D.create({matrix:ref.matrix});const r=G.run(d,ref.options).result.effect;
    for(const key of ['estimate','low','high','p','df','se'])near(r[key],ref.expected[key],key==='p'?1e-11:1e-9);
  }
  const d=dataset('Group,Y\nBefore,10\nBefore,12\nBefore,11\nAfter,7\nAfter,8\nAfter,9');
  const a=G.run(d,opts),b=G.run(d,{...opts,baseline:'After'});near(a.result.effect.estimate,-3);near(b.result.effect.estimate,3);
  assert.match(a.result.title,/After minus Before/);assert.match(a.interpretation,/entire interval supports/);assert.match(b.interpretation,/unfavorable/);
});
test('design drives selection and assumptions are explicit for ANOVA and time-order capability',()=>{
  const d=dataset('Group,Y\nA,10\nA,11\nB,12\nB,14\nC,16\nC,17');
  const o={...opts,baseline:'A'};assert.match(G.plan(d,o).method,/ANOVA/);assert.throws(()=>G.run(d,o),/equal-variance/);
  const r=G.run(d,{...o,equalVariance:true});assert.equal(r.result.kind,'anova');assert.match(r.interpretation,/at least one/);
  assert.equal(r.result.tables.find(t=>t.title==='Group summaries').rows[0][0],'A');
  assert.throws(()=>G.run(d,{goal:'capability',y:'1',lsl:'5',usl:'20',confidence:.95}),/time order/);
  const c=G.run(d,{goal:'capability',y:'1',lsl:'5',usl:'20',confidence:.95,timeOrder:true});assert.match(c.interpretation,/does not establish stability|Investigate stability/);
});
test('categorical records build labeled counts and flag small expected frequencies',()=>{
  const d=dataset('Shift,Result\nDay,Pass\nDay,Fail\nNight,Pass\nNight,Fail\nNight,Fail');
  const r=G.run(d,{goal:'association',y:'0',x:'1',confidence:.95});
  assert.equal(r.result.tables[0].rows[1][2],2);assert.match(r.interpretation,/below 5/);assert.equal(r.result.tables[1].headers[2],'Fail');
  assert.throws(()=>G.run(d,{goal:'association',y:'0',x:'0'}),/different columns/);
});
test('degenerate inference and absent filter/reference groups fail rather than fabricate a decision',()=>{
  const d=dataset('Group,Y\nA,10\nA,10\nB,9\nB,9');assert.throws(()=>G.run(d,{...opts,baseline:'A'}),/standard error/);
  assert.throws(()=>G.run(d,{...opts,baseline:'missing'}),/reference group/);
  assert.throws(()=>G.run(d,{...opts,baseline:'A',filterColumn:'0',filterValue:'absent'}),/two included/);
  assert.throws(()=>G.run(d,{goal:'target',y:'1',target:'oops'}),/target mean/);
});
test('workspace roundtrip retains edits/exclusions; malformed projects and spreadsheet formulas are handled safely',()=>{
  const d=dataset('A,B\n1,2\n3,4');D.audit(d,'Test edit');d.excluded=[1];
  const text=JSON.stringify({format:'upskillsprint-guided-workspace',version:1,datasets:[d],active:0,settings:{goal:'describe'}}),restored=D.restore(text);
  assert.equal(restored.datasets[0].revision,2);assert.equal(restored.datasets[0].excluded[0],1);
  assert.throws(()=>D.restore(text.replace('"version":1','"version":9')),/version 1/);
  const bad=JSON.parse(text);bad.datasets[0].rows[0]=[true,'2'];assert.throws(()=>D.restore(JSON.stringify(bad)),/text cells/);
  const csv=D.csv([['=HYPERLINK("https://example.invalid")','+SUM(1,2)',' @SUM(1,2)','-12.5']]);assert.match(csv,/"'=HYPERLINK/);assert.match(csv,/"'\+SUM/);assert.match(csv,/"-12.5"/);
});

function set(w,d,id,value){const e=d.getElementById('guide-'+id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));e.dispatchEvent(new w.Event('change',{bubbles:true}));}
function example(w,d,kind){set(w,d,'example',kind);d.getElementById('guide-example-load').click();}
test('guided examples render results, practical interpretation and the correct analysis handoff',()=>{
  const {dom,w,d}=setup();
  for(const [kind,pattern,target]of [['process',/Welch/,'pg-test'],['paired',/Paired/,'pg-test'],['capability',/Capability/,'pg-data'],['association',/Chi-square/,'pg-data']]){
    example(w,d,kind);d.getElementById('guide-run').click();assert.equal(d.getElementById('guide-status').dataset.error,'false',d.getElementById('guide-status').textContent);
    assert.match(d.getElementById('guide-result-title').textContent,pattern);assert.ok(d.querySelector('#guide-charts svg')||kind==='association');assert.equal(d.getElementById('guide-report').disabled,false);
    d.getElementById('guide-open-analysis').click();assert.equal(d.querySelector('.page.active').id,target);
    if(target==='pg-test')assert.match(d.getElementById('tresults').textContent,/interval/);else assert.equal(d.getElementById('analysis-status').dataset.error,'false');
  }
  dom.window.close();
});
test('editing data, settings, filters and dataset selection clears old results and exports',()=>{
  const {dom,w,d}=setup();example(w,d,'process');d.getElementById('guide-run').click();
  const cell=d.querySelector('#guide-table [data-row="0"][data-cell="1"]');cell.value='11';cell.dispatchEvent(new w.Event('input',{bubbles:true}));
  assert.equal(d.getElementById('guide-report').disabled,true);assert.equal(d.getElementById('guide-output').hidden,true);
  cell.dispatchEvent(new w.Event('change',{bubbles:true}));assert.match(d.getElementById('guide-audit').textContent,/10.5 → 11/);
  d.getElementById('guide-run').click();set(w,d,'threshold','0.4');assert.equal(d.getElementById('guide-result-csv').disabled,true);
  d.getElementById('guide-run').click();set(w,d,'filter-column','0');assert.equal(d.getElementById('guide-output').hidden,true);
  example(w,d,'paired');assert.equal(d.getElementById('guide-dataset').options.length,2);set(w,d,'dataset','0');assert.equal(d.getElementById('guide-output').hidden,true);
  dom.window.close();
});
test('input-only cell edits reach calculations immediately without replacing the focused editor',()=>{
  const {dom,w,d}=setup();example(w,d,'process');
  const cell=d.querySelector('#guide-table [data-row="0"][data-cell="1"]');cell.focus();cell.value='11.1';cell.dispatchEvent(new w.Event('input',{bubbles:true}));
  assert.equal(d.activeElement,cell);assert.match(d.getElementById('guide-profile').textContent,/Revision 2/);
  d.getElementById('guide-run').click();assert.match(d.getElementById('guide-metrics').textContent,/-0.633333333/);
  const name=d.getElementById('guide-name');name.value='Edited process';name.dispatchEvent(new w.Event('input',{bubbles:true}));
  d.getElementById('guide-run').click();assert.match(d.getElementById('guide-provenance').textContent,/Edited process/);
  const header=d.querySelector('#guide-table [data-column="1"]');header.value='';header.dispatchEvent(new w.Event('input',{bubbles:true}));d.getElementById('guide-run').click();assert.match(d.getElementById('guide-status').textContent,/column names/);
  dom.window.close();
});
test('CSV import displays text safely, rejects malformed inputs and keeps existing datasets after an error',()=>{
  const {dom,w,d}=setup();set(w,d,'paste','Group,Y\n<img src=x onerror=alert(1)>,10\nB,12');d.getElementById('guide-paste-load').click();
  assert.equal(d.querySelectorAll('#guide-table img').length,0);assert.equal(d.getElementById('guide-dataset').options.length,1);
  set(w,d,'paste','A,B\n"bad,2');d.getElementById('guide-paste-load').click();assert.equal(d.getElementById('guide-data-status').dataset.error,'true');assert.equal(d.getElementById('guide-dataset').options.length,1);
  dom.window.close();
});
test('guided downloads retain project data, result tables and full traceability',async()=>{
  const {dom,w,d}=setup(),downloads=[],blobs=new Map();w.URL.createObjectURL=blob=>{const url='blob:guided-'+blobs.size;blobs.set(url,blob);return url;};w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,blob:blobs.get(this.href)});};
  example(w,d,'process');d.getElementById('guide-run').click();d.getElementById('guide-report').click();d.getElementById('guide-result-csv').click();d.getElementById('guide-project-save').click();
  const report=await downloads[0].blob.text();assert.match(report,/Included rows: 12/);assert.match(report,/Assumptions:/);assert.match(report,/Included source data \(CSV\)/);assert.match(report,/Before,|"Before"/);
  const csv=await downloads[1].blob.text();assert.match(csv,/"Estimated difference"/);const project=await downloads[2].blob.text();assert.equal(D.restore(project).datasets[0].rows.length,12);
  Object.defineProperty(d.getElementById('guide-project-file'),'files',{value:[{size:project.length,text:async()=>project}]});await d.getElementById('guide-project-file').onchange();
  assert.equal(d.getElementById('guide-dataset').options.length,2);assert.equal(d.getElementById('guide-goal').value,'compare');assert.equal(d.getElementById('guide-output').hidden,true);
  d.getElementById('guide-run').click();assert.match(d.getElementById('guide-result-title').textContent,/After minus Before/);dom.window.close();
});
test('latest import wins when asynchronous file reads complete out of order',async()=>{
  const {dom,w,d}=setup();let finish;const file=d.getElementById('guide-file');Object.defineProperty(file,'files',{configurable:true,value:[{name:'slow.csv',size:20,text:()=>new Promise(r=>finish=r)}]});
  const pending=file.onchange();example(w,d,'paired');finish('A,B\n1,2\n3,4');await pending;
  assert.equal(d.getElementById('guide-dataset').options.length,1);assert.match(d.getElementById('guide-name').value,/matched/);dom.window.close();
});

test('Excel stored and compressed workbooks preserve sheet choice, types, dates and formula warnings',async()=>{
  const {dom}=setup(),ctx=dom.getInternalVMContext(),X=vm.runInContext('GuidedXlsx',ctx);
  const fixtures=JSON.parse(fs.readFileSync('tests/fixtures/calculator-guided-xlsx.json','utf8'));
  const buffer=key=>{const b=Buffer.from(fixtures[key],'base64');return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);};
  for(const key of ['compressed','storedCached']){
    const book=await X.open(buffer(key));assert.equal(book.sheets.length,2);assert.equal(book.sheets[0].name,'Measurements');
    const sheet=await book.sheet(0);assert.equal(sheet.matrix.length,3);assert.equal(sheet.matrix[0].length,4);assert.equal(sheet.matrix[1][0],'Before');
    assert.equal(sheet.matrix[1][1],'10.5');assert.equal(sheet.matrix[1][2],'2026-10-04T12:30:00.000Z');
    assert.match(sheet.notes.join(' '),/Hidden.*included/);assert.match(sheet.notes.join(' '),/filters are not applied/);assert.match(sheet.notes.join(' '),/cached values may be stale/);
    assert.equal(sheet.matrix[1][3],key==='compressed'?'#FORMULA_WITHOUT_CACHED_VALUE':'21');
    assert.equal((await book.sheet(1)).matrix[3][1],'7');
  }
  const large=await X.open(buffer('oversized'));await assert.rejects(()=>large.sheet(0),/40 columns/);
  const shared=await X.open(buffer('sharedStrings'));assert.equal((await shared.sheet(0)).matrix[1][0],'Before');
  await assert.rejects(()=>X.open(buffer('doctype')),/XML declarations/);
  await assert.rejects(()=>X.open(new ArrayBuffer(100)),/not an unencrypted/);
  const corrupt=buffer('storedCached'),offset=Buffer.from(corrupt).indexOf('<workbook ');assert.ok(offset>0);new Uint8Array(corrupt)[offset+10]^=1;await assert.rejects(async()=>{const book=await X.open(corrupt);await book.sheet(0);},/checksum|malformed|ZIP|relationship/);
  dom.window.close();
});

test('zero-spread Welch group remains valid in the guide but does not open an incompatible summary form',()=>{
  const {dom,w,d}=setup();set(w,d,'paste','Group,Y\nA,10\nA,10\nB,11\nB,12\nB,13');d.getElementById('guide-paste-load').click();
  set(w,d,'goal','compare');set(w,d,'group','0');set(w,d,'y','1');d.getElementById('guide-run').click();
  assert.equal(d.getElementById('guide-status').dataset.error,'false');assert.equal(d.getElementById('guide-open-analysis').disabled,true);assert.equal(d.getElementById('guide-report').disabled,false);dom.window.close();
});

test('Excel file import waits for explicit worksheet choice and adds the selected data',async()=>{
  const {dom,w,d}=setup(),fixture=JSON.parse(fs.readFileSync('tests/fixtures/calculator-guided-xlsx.json','utf8'));
  const b=Buffer.from(fixture.compressed,'base64'),file=d.getElementById('guide-file');
  Object.defineProperty(file,'files',{value:[{name:'study.xlsx',size:b.length,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}]});
  await file.onchange();assert.equal(d.getElementById('guide-sheet-box').hidden,false);assert.equal(d.getElementById('guide-dataset').options.length,0);
  set(w,d,'sheet','1');await d.getElementById('guide-sheet-load').onclick();assert.equal(d.getElementById('guide-dataset').options.length,1);
  assert.match(d.getElementById('guide-name').value,/Second sheet/);assert.match(d.getElementById('guide-profile').textContent,/3 rows/);
  set(w,d,'goal','relationship');set(w,d,'y','1');set(w,d,'x','0');d.getElementById('guide-run').click();assert.equal(d.getElementById('guide-status').dataset.error,'false');dom.window.close();
});

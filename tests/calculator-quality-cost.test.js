const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {setup}=require('./helpers/calculator-browser');
const ctx=vm.createContext({console});for(const name of ['guided-data','quality-cost-core'])vm.runInContext(fs.readFileSync(`tools/calculator-assets/${name}.js`,'utf8'),ctx);
const C=vm.runInContext('QualityCost',ctx),D=vm.runInContext('GuidedData',ctx),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const csv=(kind,rows)=>D.csv([C.headers[kind],...rows]);
const costs=csv('cost',[['Base','A','Internal failure','Scrap',10,'tonnes',100,10],['Base','B','External failure','Warranty',10,'claims',200,10],['Now','A','Internal failure','Scrap',4,'tonnes',100,4],['Now','B','External failure','Warranty',4,'claims',200,4],['Now','A','Prevention','Training',2,'hours',50,0],['Now','A','Appraisal','Inspection',1,'hours',50,0]]);
const production=csv('production',[['Base','A',100,10000],['Base','B',100,20000],['Now','A',50,5000],['Now','B',150,30000]]);
const opts={baseline:'Base',current:'Now',currency:'CAD',productionUnit:'tonnes',assumptions:'Comparable constant rates and scope; independent accounting verification.',complete:true,cash:1000,avoidance:500,capacity:400,initial:1000,recurring:100,years:3,discount:10,sensitivity:20};
const set=(w,d,id,v)=>{const e=d.getElementById('cost-'+id);if(e.type==='checkbox')e.checked=v;else e.value=v;e.dispatchEvent(new w.Event('input',{bubbles:true}));};
test('Quality costs reconcile categories, COPQ and product-mix normalization without claiming cash',()=>{
 const r=C.run(C.read(costs,production,''),opts);near(r.base.coq,3000);near(r.current.coq,1350);near(r.current.copq,1200);near(r.current.expected[2]+r.current.expected[3],3500);near(r.current.adjustedCOPQ,2300);near(r.current.adjustedCOQ,2150);near(r.current.percentRevenue,1350/35000);near(r.current.perUnit,6.75);near(r.mix[1].share,.75);assert.equal(r.benefits.verified[0],0);assert.equal(r.benefits.actualNet,0);
});
test('Quality-cost NPV, ROI and payback match independent Decimal references across scenarios',()=>{
 const f=JSON.parse(fs.readFileSync('tests/fixtures/calculator-quality-cost-reference.json'));for(const example of f.cases){const r=C.caseModel(example.inputs);r.scenarios.forEach((s,i)=>{for(const k of ['npv','netTotal','roi','payback'])if(example.expected[i][k]==null)assert.equal(s[k],null);else near(s[k],example.expected[i][k]);});}
 const a=C.caseModel(opts),b=C.caseModel({...opts,capacity:999999,avoidance:888888});near(a.scenarios[1].npv,b.scenarios[1].npv);assert.throws(()=>C.caseModel({...opts,years:2.5}),/whole|integer/);assert.throws(()=>C.caseModel({...opts,discount:-1}),/nonnegative/);assert.throws(()=>C.caseModel({...opts,sensitivity:101}),/0–100/);
});
test('Quality-cost Pareto groups by category/cause, sorts separately and handles zero totals',()=>{
 const r=C.run(C.read(costs,production,''),opts);assert.equal(r.costPareto[0].cause,'Warranty');near(r.costPareto.at(-1).cumulative,1);near(r.frequencyPareto.at(-1).cumulative,1);assert.equal(C.pareto([{Category:'Prevention',Cause:'A',amount:0,Events:0}],'events')[0].cumulative,null);
 const lines=[{Category:'Internal failure',Cause:'A',amount:100,Events:1},{Category:'Internal failure',Cause:'A',amount:10,Events:2},{Category:'External failure',Cause:'B',amount:50,Events:9}];assert.equal(C.pareto(lines,'cost')[0].cost,110);assert.equal(C.pareto(lines,'events')[0].cause,'B');
});
test('Recorded verification is a subset of actuals and noncash never becomes cash savings',()=>{
 const b=csv('benefits',[['A','Now','Cash savings',300,'Verified','Owner','Invoice A','2026-01-01','Reconciled'],['B','Now','Cash savings',200,'Realized','Owner','','','Pending'],['C','Base','Implementation cost',100,'Verified','Owner','Invoice B','2026-01-01','Paid'],['D','Now','Recurring cost',50,'Verified','Owner','Invoice C','2026-01-01','Paid'],['E','Now','Released capacity',900,'Verified','Owner','Study','2026-01-01','Hours only'],['F','Now','Cost avoidance',700,'Verified','Owner','Budget','2026-01-01','Future spend'],['G','Forecast','Cash savings',800,'Projected','','','',''],['H','Now','Cash savings',-20,'Verified','Owner','Reversal','2026-01-01','Correction']]);
 const r=C.run(C.read(costs,production,b),opts);near(r.benefits.actual[0],480);near(r.benefits.verified[0],280);near(r.benefits.verifiedNet,130);near(r.benefits.actualNet,330);near(r.benefits.projected[0],800);assert.equal(r.benefits.verification.find(x=>x.period==='Now').pending,1);
});
test('Verification rejects duplicate IDs, incomplete evidence, invalid/future dates and negative costs',()=>{
 const row=['A','Now','Cash savings',100,'Verified','Owner','Invoice','2026-01-01','Reconciled'];for(const index of [5,6,7,8]){const v=[...row];v[index]='';assert.throws(()=>C.read(costs,production,csv('benefits',[v])));}
 for(const date of ['2026-02-30','9999-01-01']){const v=[...row];v[7]=date;assert.throws(()=>C.read(costs,production,csv('benefits',[v])),/date/);}
 assert.throws(()=>C.read(costs,production,csv('benefits',[row,row])),/Duplicate benefit/);const v=[...row];v[2]='Implementation cost';v[3]=-1;assert.throws(()=>C.read(costs,production,csv('benefits',[v])),/nonnegative/);
});
test('Cost inputs reject missing, unmatched or duplicate production and invalid costs; missing product baseline is explicit',()=>{
 assert.throws(()=>C.read(costs,production.replace('"100","10000"','"0","10000"'),''),/greater than zero/);
 assert.throws(()=>C.read(costs.replace('"100","10"','"bad","10"'),production,''),/complete number/);
 assert.throws(()=>C.read(costs,production+'\nNow,A,50,5000',''),/Duplicate/);
 assert.throws(()=>C.read(costs.replace('"Base","A"','"Missing","A"'),production,''),/no matching production/);
 assert.throws(()=>C.run(C.read(costs,production,''),{...opts,complete:false}),/Confirm complete/);
 const p=production+'\nNow,C,10,';const r=C.run(C.read(costs,p,''),opts);assert.equal(r.current.adjustedCOQ,null);assert.equal(r.current.percentRevenue,null);assert.deepEqual(Array.from(r.current.uncovered),['C']);
});
test('Cost workspace example produces expected normalized costs, cash separation and stale-result protection',()=>{
 const {dom,w,d}=setup();d.getElementById('cost-example').click();d.getElementById('cost-run').click();assert.equal(d.getElementById('cost-status').dataset.error,'false');assert.match(d.getElementById('cost-metrics').textContent,/5,900.00/);assert.match(d.getElementById('cost-metrics').textContent,/6,300.00/);assert.match(d.getElementById('cost-verification').textContent,/-9,400.00/);assert.equal(d.activeElement.id,'cost-status');set(w,d,'cash','60000');assert.equal(d.getElementById('cost-output').hidden,true);assert.equal(d.getElementById('cost-report').disabled,true);d.getElementById('cost-run').click();set(w,d,'cost',d.getElementById('cost-cost').value+'\nBAD');assert.equal(d.getElementById('cost-complete').checked,false);d.getElementById('cost-run').click();assert.equal(d.getElementById('cost-status').dataset.error,'true');dom.window.close();
});
test('Cost reports and versioned projects retain inputs, provenance and separate results without automatic verification',async()=>{
 const {dom,w,d}=setup(),blobs=[];w.URL.createObjectURL=b=>{blobs.push(b);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};w.confirm=()=>true;
 d.getElementById('cost-example').click();d.getElementById('cost-run').click();d.getElementById('cost-report').click();d.getElementById('cost-csv').click();d.getElementById('cost-save').click();assert.match(await blobs[0].text(),/not authenticate owners/);assert.match(await blobs[1].text(),/Frequency Pareto/);const raw=await blobs[2].text();assert.equal(C.restore(raw).settings.current,'February');Object.defineProperty(d.getElementById('cost-restore'),'files',{value:[{size:raw.length,text:async()=>raw}],configurable:true});await d.getElementById('cost-restore').onchange();assert.equal(d.getElementById('cost-output').hidden,true);assert.equal(d.getElementById('cost-complete').checked,false);assert.equal(d.getElementById('cost-current').value,'February');assert.throws(()=>C.restore('{"version":2}'),/Unsupported/);dom.window.close();
});
test('Cost guided handoff preserves selected rows and safely displays hostile labels',()=>{
 const {dom,w,d}=setup();d.getElementById('guide-paste').value=costs.replace('Scrap','<img src=x onerror=alert(1)>');d.getElementById('guide-paste-load').click();d.getElementById('cost-copy').click();assert.match(d.getElementById('cost-cost').value,/onerror/);set(w,d,'production',production);d.getElementById('cost-periods').click();set(w,d,'assumptions','Complete comparable records');set(w,d,'complete',true);d.getElementById('cost-run').click();assert.equal(d.getElementById('cost-status').dataset.error,'false');assert.equal(d.querySelectorAll('#cost-output img').length,0);dom.window.close();
});

const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {setup}=require('./helpers/calculator-browser');
const ctx=vm.createContext({console});
for(const file of ['numeric','analysis-core','guided-data','spc-core'])vm.runInContext(fs.readFileSync(`tools/calculator-assets/${file}.js`,'utf8'),ctx);
const S=vm.runInContext('CalculatorSPC',ctx),f=JSON.parse(fs.readFileSync('tests/fixtures/calculator-spc-reference.json'));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const opts={kind:'xr',baselineRows:25,timeOrder:true,confidence:.95,normal:true,lsl:7,usl:13};
const set=(w,d,id,value)=>{const e=d.getElementById('spc-'+id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));};
test('SPC subgroup location/spread limits and capability intervals match independent SciPy fixtures',()=>{
 for(const kind of ['xr','xs']){const r=S.run(f.subgroups,{...opts,kind}),e=f.expected[kind];near(r.model.center,e.center);near(r.model.sigma,e.sigma);near(r.model.spread,e.spread);near(r.charts[0].points[0].lo,e.lo);near(r.charts[0].points[0].hi,e.hi);near(r.charts[1].points[0].lo,e.spreadLo);near(r.charts[1].points[0].hi,e.spreadHi);
 assert.equal(r.baselineSignals,0);assert.equal(r.capability.rows.length,4);r.capability.rows.forEach((v,i)=>{assert.equal(v.index,f.capability[i].index);near(v.value,f.capability[i].value);v.interval.forEach((x,j)=>near(x,f.capability[i].interval[j]));});}
});
test('SPC I-MR, EWMA startup limits and standardized CUSUM match independent references',()=>{
 const imr=S.run(f.individuals,{...opts,kind:'imr',lsl:'',usl:''});near(imr.model.center,f.imr.center);near(imr.model.sigma,f.imr.sigma);near(imr.model.spread,f.imr.mr);assert.equal(imr.charts[1].points.length,33);assert.ok(!imr.charts[1].points.some(p=>p.index===26));
 for(const kind of ['ewma','cusum']){const r=S.run(f.individuals,{...opts,kind,lsl:'',usl:''});const p=r.charts[0].points.filter(p=>p.phase==='Monitoring');p.forEach((v,i)=>{near(v.value,f[kind][i][0]);if(kind==='ewma'){near(v.lo,f.ewma[i][1]);near(v.hi,f.ewma[i][2]);}else near(r.charts[1].points.filter(p=>p.phase==='Monitoring')[i].value,f.cusum[i][1]);});}
});
test('SPC weighted attribute limits and varying exposure are correct',()=>{
 const base=[[2,50],[8,100],[5,50]],rows=[...base,[30,200]];
 for(const kind of ['p','u']){const r=S.run(rows,{...opts,kind,baselineRows:3});near(r.model.center,15/200);const p=r.charts[0].points.at(-1);near(p.value,.15);near(p.hi,.075+3*Math.sqrt(.075*(kind==='p'?.925:1)/200));}
 const np=S.run([[2,100],[8,100],[5,100],[20,100]],{...opts,kind:'np',baselineRows:3});near(np.charts[0].points[0].cl,5);near(np.charts[0].points[0].hi,5+3*Math.sqrt(4.75));
 const c=S.run([[4],[6],[5],[20]],{...opts,kind:'c',baselineRows:3,exposure:true});near(c.charts[0].points[0].hi,5+3*Math.sqrt(5));assert.equal(c.monitorSignals,1);
 assert.throws(()=>S.run(rows,{...opts,kind:'np',baselineRows:3}),/same inspected/);assert.throws(()=>S.run([[1],[2]],{...opts,kind:'c',baselineRows:2}),/equal inspection/);
});
test('SPC monitoring never changes baseline limits and snapshots recompute untrusted parameters',()=>{
 const initial=S.run(f.subgroups,opts),changed=f.subgroups.map((r,i)=>i<25?r:r.map(x=>x+100)),later=S.run(changed,opts);near(initial.model.center,later.model.center);near(initial.model.sigma,later.model.sigma);assert.ok(later.monitorSignals>0);
 const snapshot=JSON.parse(JSON.stringify(initial.model));snapshot.center=999;snapshot.sigma=-10;const restored=S.restore(JSON.stringify(snapshot));near(restored.center,initial.model.center);const frozen=S.run(changed.slice(25),opts,restored);near(frozen.charts[0].points[0].hi,initial.charts[0].points[25].hi);assert.equal(frozen.baselineRows,0);assert.equal(frozen.charts[0].points[0].phase,'Monitoring');
 assert.throws(()=>S.run([[1,2],[3,4]],opts,restored),/subgroup size/);assert.throws(()=>S.restore('{"version":2}'),/Unsupported/);assert.throws(()=>S.restore('not json'),/valid baseline/);
});
test('SPC run and trend rules flag endpoints, break on ties and never cross phases',()=>{
 const m=S.baseline([[-1],[1]],'imr');const o={rules:true};
 let p=S.series(Array.from({length:9},()=>[.1]),m,'Monitoring',o)[0].points;assert.equal(p[7].signals.length,0);assert.ok(p[8].signals.includes('9 consecutive points on one side'));
 p=S.series([1,2,3,4,5,6].map(x=>[x/10]),m,'Monitoring',o)[0].points;assert.ok(p[5].signals.includes('6 consecutive points increasing or decreasing'));
 p=S.series([1,2,3,3,5,6].map(x=>[x/10]),m,'Monitoring',o)[0].points;assert.equal(p[5].signals.length,0);
 const r=S.run([[-1],[1],[.1],[.2],[.3],[.4],[.5]],{kind:'imr',baselineRows:2,timeOrder:true,rules:true});assert.ok(r.charts[0].points.every(p=>!p.signals.some(s=>s.includes('6 consecutive'))));
});
test('SPC rejects incomplete, mixed and degenerate data without silently dropping rows',()=>{
 for(const rows of [[[1,'']],[['4x']],[[-1,10]],[[11,10]],[[1,0]],[[1,1.2]]])assert.throws(()=>S.validate(rows,rows[0].length===2?'p':'imr'));
 assert.throws(()=>S.baseline([[0,100],[0,100]],'p'),/no estimated/);assert.throws(()=>S.baseline([[5],[5]],'imr'),/variation/);assert.throws(()=>S.validate([[1,2],[3]],'xr'),/Every row/);
 assert.throws(()=>S.run(f.individuals,{...opts,kind:'imr',timeOrder:false}),/Confirm time/);assert.throws(()=>S.run(f.individuals,{...opts,kind:'ewma',lambda:0}),/EWMA requires/);assert.throws(()=>S.run(f.individuals,{...opts,kind:'cusum',h:-1}),/CUSUM requires/);assert.throws(()=>S.run(f.individuals,{...opts,kind:'imr',baselineRows:26.5}),/Baseline rows/);
});
test('SPC capability separates observed compliance, assumptions, instability and interval sample limits',()=>{
 const m=S.baseline(f.subgroups.slice(0,25),'xs');let cap=S.capability(m,{...opts,normal:false});assert.equal(cap.rows.length,0);assert.equal(cap.observed.n,125);
 cap=S.capability(m,{...opts,lsl:'',usl:10});assert.equal(cap.rows.length,2);assert.equal(cap.rows[0].index,'Ppu');
 cap=S.capability(S.baseline(f.subgroups.slice(0,3),'xs'),opts);assert.ok(cap.rows.every(r=>r.interval===null));
 const altered=f.subgroups.map((r,i)=>i===5?r.map(x=>x+10):r);const result=S.run(altered,opts);assert.ok(result.baselineSignals);assert.equal(result.capability.rows.length,0);assert.ok(result.capability.observed.above>0);
 const low=S.capability(m,{...opts,lsl:20,usl:21});assert.ok(low.rows.find(r=>r.index==='Ppk').interval[0]<0);
 const wide=S.capability(m,{...opts,confidence:.99});cap=S.capability(m,opts);assert.ok(wide.rows[1].interval[0]<cap.rows[1].interval[0]);
 assert.throws(()=>S.capability(m,{...opts,lsl:20,usl:10}),/LSL/);
});
test('SPC source labels survive baseline freezing and report/CSV text is safe',()=>{
 const labels=f.subgroups.map((_,i)=>String(i*2+10)),r=S.run(f.subgroups,{...opts,labels,source:'=NOT_A_FORMULA'});assert.equal(r.charts[0].points[0].label,'10');assert.equal(r.charts[0].points[25].label,'60');assert.equal(S.restore(JSON.stringify(r.model)).labels[0],'10');assert.match(S.report(r),/Baseline rows \(CSV\)/);assert.match(S.report(r),/=NOT_A_FORMULA/);
});
test('SPC all nine chart examples work; input-only edits invalidate results and exports',()=>{
 const {dom,w,d}=setup();for(const o of d.getElementById('spc-kind').options){set(w,d,'kind',o.value);d.getElementById('spc-example').click();d.getElementById('spc-run').click();assert.equal(d.getElementById('spc-status').dataset.error,'false',o.value+': '+d.getElementById('spc-status').textContent);assert.equal(d.getElementById('spc-report').disabled,false);assert.ok(d.querySelector('#spc-charts svg'));set(w,d,'data',d.getElementById('spc-data').value+'\nBAD');assert.equal(d.getElementById('spc-output').hidden,true);assert.equal(d.getElementById('spc-report').disabled,true);d.getElementById('spc-run').click();assert.equal(d.getElementById('spc-status').dataset.error,'true');}dom.window.close();
});
test('SPC UI freeze/release preserves rows and limits; guided copy keeps source rows and rejects missing cells',()=>{
 const {dom,w,d}=setup();set(w,d,'kind','xr');d.getElementById('spc-example').click();d.getElementById('spc-run').click();assert.equal(d.getElementById('spc-freeze').disabled,false);const original=d.getElementById('spc-data').value;d.getElementById('spc-freeze').click();assert.equal(d.getElementById('spc-kind').disabled,true);assert.equal(d.getElementById('spc-data').value.split('\n').length,10);d.getElementById('spc-run').click();assert.equal(d.getElementById('spc-status').dataset.error,'false');d.getElementById('spc-release').click();assert.equal(d.getElementById('spc-data').value,original);
 d.getElementById('guide-example-load').click();set(w,d,'kind','imr');set(w,d,'map','2');d.getElementById('spc-use-data').click();assert.equal(d.getElementById('spc-data').value.split('\n').length,12);assert.match(d.getElementById('spc-source').textContent,/revision 1/);set(w,d,'baseline','6');set(w,d,'time-order',true);d.getElementById('spc-run').click();assert.equal(d.querySelector('#spc-tables tbody tr td:nth-child(2)').textContent,'2');
 const cell=d.querySelector('#guide-table input[data-row="0"][data-cell="1"]');cell.value='';cell.dispatchEvent(new w.Event('input',{bubbles:true}));d.getElementById('spc-use-data').click();assert.equal(d.getElementById('spc-status').dataset.error,'true');dom.window.close();
});
test('SPC exports include full point rows and restored baselines wait for explicit analysis',async()=>{
 const {dom,w,d}=setup(),saved=[];w.URL.createObjectURL=b=>{saved.push(b);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};w.confirm=()=>true;
 d.getElementById('spc-example').click();d.getElementById('spc-run').click();d.getElementById('spc-report').click();d.getElementById('spc-csv').click();assert.match(await saved[0].text(),/Monitoring/);assert.match(await saved[1].text(),/Moving range/);
 d.getElementById('spc-freeze').click();d.getElementById('spc-save-baseline').click();const text=await saved[2].text();assert.equal(JSON.parse(text).rows.length,25);
 Object.defineProperty(d.getElementById('spc-restore'),'files',{value:[{size:text.length,text:async()=>text}],configurable:true});await d.getElementById('spc-restore').onchange();assert.equal(d.getElementById('spc-data').value,'');assert.equal(d.getElementById('spc-output').hidden,true);assert.equal(d.getElementById('spc-time-order').checked,false);dom.window.close();
});

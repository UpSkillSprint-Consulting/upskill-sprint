const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {setup}=require('./helpers/calculator-browser');
const tick=()=>new Promise(resolve=>setTimeout(resolve,15));
async function choose(d,id){d.querySelector(`[data-tbl-select="${id}"]`).click();await tick();}
function find(d,params){for(const [key,value]of Object.entries(params))d.querySelector(`[data-tbl-key="${key}"]`).value=String(value);d.querySelector('[data-tbl-find]').click();return d.querySelector('[data-tbl-result]').textContent;}
async function open(){const ctx=setup();ctx.d.querySelector('[data-page="pg-lookup"]').click();await tick();return ctx;}

test('lookup opens lazily from mobile picker and preserves results across workspaces',async()=>{
 const {dom,w,d}=setup();let requests=0;const fetch=w.fetch;w.fetch=(...args)=>{requests++;return fetch(...args);};
 assert.equal(requests,0);const picker=d.getElementById('calc-workspace');picker.value='pg-lookup';picker.dispatchEvent(new w.Event('change'));await tick();
 assert.equal(d.querySelector('.page.active').id,'pg-lookup');assert.equal(requests,1);
 assert.match(find(d,{z:1.96}),/0\.9750/);d.getElementById('lookup-open-distributions').click();assert.equal(picker.value,'pg-dist');d.querySelector('[data-page="pg-lookup"]').click();
 assert.match(d.querySelector('[data-tbl-result]').textContent,/0\.9750/);assert.equal(requests,1);dom.window.close();
});

test('mobile table selector switches reference and updates its explanation',async()=>{
 const {dom,w,d}=await open();const picker=d.getElementById('lookup-table-choice');assert.equal(picker.options.length,18);picker.value='t';picker.dispatchEvent(new w.Event('change'));await tick();assert.match(d.getElementById('lookup-help').textContent,/two-sided/);assert.match(find(d,{df:10,alpha:'0.025'}),/2\.228/);await choose(d,'f');assert.equal(picker.value,'f');dom.window.close();
});

test('all 18 shared reference options render with guidance and accessible controls',async()=>{
 const {dom,w,d}=await open();assert.equal(w.__TBTables.registry.length,18);
 for(const entry of w.__TBTables.registry){await choose(d,entry.id);assert.ok(d.querySelector('.tb-tbl-table tbody tr'),entry.id);assert.ok(d.getElementById('lookup-help').textContent.length>100,entry.id);assert.equal(d.querySelectorAll('[data-tbl-select][aria-pressed="true"]').length,1);for(const field of d.querySelectorAll('[data-tbl-key]'))assert.equal(field.labels.length,1);}
 assert.equal(d.querySelector('[data-tbl-find]'),null);dom.window.close();
});

test('lookup equations are typeset from LaTeX, including tolerance quantile conventions',async()=>{
 const {dom,d}=await open();
 for(const entry of windowEntries()){
  await choose(d,entry);
  const panel=d.querySelector('.tb-tbl-formula');
  assert.ok(panel.querySelector('math'),entry);
  assert.ok(panel.querySelector('annotation[encoding="application/x-tex"]'),entry);
  assert.equal(panel.querySelector('merror'),null,entry);
  assert.doesNotMatch(panel.textContent,/sqrt\(|Phi\^-1|t'\(gamma/);
 }
 await choose(d,'tolerance_one');assert.ok(d.querySelector('.tb-tbl-formula mfrac'));assert.ok(d.querySelector('.tb-tbl-formula msqrt'));
 await choose(d,'tolerance_two');assert.match(d.querySelector('.tb-tbl-formula').textContent,/LOWER-tail/);
 const manual=fs.readFileSync('tools/calculator-manual.html','utf8');assert.match(manual,/lookup-equations:start/);assert.match(manual,/application\/x-tex/);
 dom.window.close();
 function windowEntries(){return ['z','t','chi_square','f','binomial_pmf','binomial_cmf','poisson_pmf','poisson_cmf','exponential','studentized_range','duncan','control_chart','sigma_level','median_ranks','normal_scores','tolerance_one','tolerance_two'];}
});

test('distribution examples return expected values with matching row, column and cell',async()=>{
 const {dom,d}=await open();
 for(const [id,params,expected]of [
  ['z',{z:1.96},0.975],['t',{df:10,alpha:'0.025'},2.228],['chi_square',{df:10,alpha:'0.05'},18.307],['f',{v1:4,v2:20,alpha:'0.05'},2.866],
  ['binomial_pmf',{n:10,x:2,p:'0.10'},45*0.01*0.9**8],['binomial_cmf',{n:10,x:2,p:'0.10'},0.9**10+10*0.1*0.9**9+45*0.01*0.9**8],
  ['poisson_pmf',{x:3,lambda:'4.00'},4**3*Math.exp(-4)/6],['poisson_cmf',{x:3,lambda:'4.00'},Math.exp(-4)*(1+4+8+64/6)],['exponential',{x:2},1-Math.exp(-2)]
 ]){await choose(d,id);assert.doesNotMatch(find(d,params),/No exact match/);assert.ok(Math.abs(Number(d.querySelector('.tbl-hit').textContent)-expected)<0.001,id);assert.equal(d.querySelectorAll('.tbl-hit-row').length,1);assert.equal(d.querySelectorAll('.tbl-hit-col').length,1);}
 dom.window.close();
});

test('Z highlights distinguish positive and negative zero rows',async()=>{
 const {dom,d}=await open();for(const [z,value,row]of [[0.05,'0.5199','0'],[-0.05,'0.4801','-0'],[0,'0.5000','0']]){find(d,{z});assert.equal(d.querySelector('.tbl-hit').textContent,value);assert.equal(d.querySelector('.tbl-hit').closest('tr').dataset.row,row);}dom.window.close();
});

test('exact lookup rejects off-grid df, counts and decimals and clears stale highlights',async()=>{
 const {dom,w,d}=await open();find(d,{z:1.96});const input=d.querySelector('[data-tbl-key=z]');input.value='2';input.dispatchEvent(new w.Event('input'));assert.equal(d.querySelector('[data-tbl-result]').textContent,'');assert.equal(d.querySelectorAll('.tbl-hit').length,0);
 for(const [id,params]of [['z',{z:1.965}],['t',{df:51,alpha:'0.05'}],['t',{df:10.5,alpha:'0.05'}],['t',{df:-1,alpha:'0.05'}],['f',{v1:4.5,v2:20,alpha:'0.05'}],['binomial_pmf',{n:10,x:2.5,p:'0.10'}],['exponential',{x:-0.01}],['tolerance_one',{n:99999,P:'0.9',gamma:'0.95'}]]){await choose(d,id);assert.match(find(d,params),/No exact match/,id);assert.equal(d.querySelectorAll('.tbl-hit').length,0);}
 await choose(d,'z');find(d,{z:1.96});assert.match(find(d,{z:99}),/No exact match/);assert.equal(d.querySelectorAll('.tbl-hit').length,0);dom.window.close();
});

test('tolerance grid matches visible confidence from initial render through Find',async()=>{
 const {dom,d}=await open();await choose(d,'tolerance_one');const gamma=d.querySelector('[data-tbl-key=gamma]').value;
 const data=JSON.parse(fs.readFileSync('reference-tables/tolerance_factors_table.json','utf8')).one_sided.tables[gamma];const row=data.rows.find(r=>r.n===25);const expected=String(row.values['0.9']);
 assert.equal(d.querySelector('tr[data-row="25"] [data-col="0.9"]').textContent,expected);find(d,{n:25,gamma,P:'0.9'});assert.equal(d.querySelector('.tbl-hit').textContent,expected);dom.window.close();
});

test('table load failure is visible and retry succeeds without resetting calculator work',async()=>{
 const {dom,w,d}=setup();const fetch=w.fetch;w.fetch=async()=>{throw new Error('offline');};d.querySelector('[data-page="pg-lookup"]').click();await tick();assert.match(d.querySelector('.tb-tbl-error').textContent,/Could not load/);w.fetch=fetch;await choose(d,'z');assert.match(find(d,{z:1.96}),/0\.9750/);dom.window.close();
});

test('scientific notation represents the entered count rather than a truncated integer',async()=>{
 const {dom,d}=await open();await choose(d,'binomial_pmf');
 find(d,{n:'1e1',x:'0e0',p:'0.10'});assert.equal(d.querySelector('.tbl-hit-row').dataset.row,'10_0');assert.ok(Math.abs(Number(d.querySelector('.tbl-hit').textContent)-0.9**10)<0.0001);
 await choose(d,'poisson_pmf');find(d,{x:'1e1',lambda:'4.00'});assert.equal(d.querySelector('.tbl-hit-row').dataset.row,'10');
 await choose(d,'t');assert.match(find(d,{df:'1e1',alpha:'0.025'}),/2\.228/);dom.window.close();
});

test('an older response for the same table cannot reset a completed lookup',async()=>{
 const {dom,w,d}=setup(),pending=[];w.fetch=url=>new Promise(resolve=>pending.push(()=>resolve({ok:true,json:async()=>JSON.parse(fs.readFileSync('.'+url,'utf8'))})));
 d.querySelector('[data-page="pg-lookup"]').click();d.querySelector('[data-tbl-select="t"]').click();d.querySelector('[data-tbl-select="z"]').click();
 pending[2]();await tick();find(d,{z:1.96});pending[0]();await tick();assert.match(d.querySelector('[data-tbl-result]').textContent,/0\.9750/);pending[1]();await tick();assert.match(d.querySelector('[data-tbl-result]').textContent,/0\.9750/);dom.window.close();
});

test('keyboard focus stays on the selected reference-table button',async()=>{
 const {dom,d}=await open();const button=d.querySelector('[data-tbl-select="f"]');button.focus();button.click();await tick();assert.equal(d.activeElement,button);dom.window.close();
});

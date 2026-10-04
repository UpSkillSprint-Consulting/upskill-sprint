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

'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createHash} = require('node:crypto');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const bank = () => {const ctx = {window: {}}; vm.runInNewContext(read('test-bank-cre-set2.js'), ctx); return ctx.window;};
const tick = () => new Promise(resolve => setTimeout(resolve, 60));

test('batch contract: stable IDs, current BoK weights, complete feedback, twenty-two exhibits, valid lesson anchors', () => {
  const {CRE_SET2: qs, registerCRESet2} = bank();
  assert.equal(qs.length, 40);
  const exam = {bok: [], bank: []}, dm = {};
  registerCRESet2(exam, dm);
  assert.deepEqual(Array.from(exam.bok, d => d.weight), [29,25,35,35,26]);
  assert.equal(exam.questions, 165); assert.equal(exam.minutes, 258);
  assert.equal(qs.filter(q => q.chart).length, 22);
  assert.equal(qs.filter(q => q.chart?.creKind).length, 11);
  assert.equal(qs.filter(q => q.explorer).length, 8);
  assert.deepEqual(Array.from(exam.bok, d => qs.filter(q => q.sub === d.domain).length), [8,7,9,9,7]);
  assert.deepEqual([0,1,2,3].map(key => qs.filter(q => q.answer === key).length), [10,10,10,10]);
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,20))).digest('hex'), '488de3d62f6ba40533c7f4bbfa30ccba24492571571d06c08cdd8de328b29efc', 'Batches 1–2 content is unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,30))).digest('hex'), '1d58917f68fcb88dd4fe42568d6e50394789e0cab74c16719108b1ff3841921b', 'Batches 1–3 content is unchanged');
  const released = JSON.stringify(qs.slice(0,10));
  assert.equal(createHash('sha256').update(released).digest('hex'), '2c2657dfb7ae76f3c0b9385c7b1be36e122e143a0372e4de82fabb097b50f6f1', 'released Batch 1 content is unchanged');
  for (const [i,q] of qs.entries()) {
    assert.equal(q.qid, 'cre:set-2:' + String(i+1).padStart(3,'0'));
    assert.equal(q.batch, Math.ceil(q.number / 10));
    assert.equal(q.set, 2); assert.equal(q.original, true);
    assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.equal(q.optionRationales.length, 4);
    q.optionRationales.forEach(r => assert.ok(r.length > 35));
    assert.ok(q.why && q.trap && q.keyPoint && q.handbook.section && q.assumptions.length);
    assert.ok(q.studyReference || q.lessonGap);

    if(q.studyReference) {
      const [file, anchor] = q.studyReference.url.split('#');
      assert.ok(read(file.slice(1)+'.html').includes('id="'+anchor+'"'));
    }
  }
});

test('registering Set 2 preserves concurrent Set 1 and Set 3 question banks', () => {
  const {registerCRESet2} = bank();
  const first = [{qid:'cre:set-1:001', sub:'cre-fundamentals', answer:3, stem:'Set 1 content'}];
  const third = [{qid:'cre:set-3:001', sub:'cre-lead', answer:2, stem:'Set 3 content'}];
  const before = JSON.stringify(first);
  const thirdBefore = JSON.stringify(third);
  const exam = {bank:first,sets:{1:first,3:third},bok:[]}, dm={};
  registerCRESet2(exam,dm);
  assert.equal(exam.sets[1], first); assert.equal(exam.bank, first);
  assert.equal(JSON.stringify(first), before);
  assert.equal(exam.sets[3], third); assert.equal(JSON.stringify(third), thirdBefore);
  assert.equal(exam.sets[2].length, 40);
});

test('independent calculations verify numeric keys and distractors', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  assert.equal(answer(1), (900/1000*100).toFixed(2)+'%');
  // Enumerate all eight basic-event states instead of reusing the solution formula.
  let top=0, any=0;
  for(let mask=0;mask<8;mask++){
    const a=!!(mask&1),b=!!(mask&2),c=!!(mask&4);
    const p=(a?.1:.9)*(b?.2:.8)*(c?.05:.95);
    if((a&&c)||(b&&c))top+=p;
    if(a||b||c)any+=p;
  }
  assert.equal(answer(3),top.toFixed(4));
  assert.equal(qs[2].options[2],any.toFixed(4));
  assert.equal(Number(qs[2].options[1]), .00005);
  let risk=5,survival=1;
  for(const [,t,status] of qs[4].chart.rows){
    if(t>250)break;
    if(status==='Failure')survival*=(risk-1)/risk;
    risk--;
  }
  assert.equal(answer(5),survival.toFixed(4));
  for(const [t,a,b] of qs[5].chart.rows){
    assert.equal(a,Math.exp(-t/1000).toFixed(4));
    assert.equal(b,Math.exp(-((t/1000)**2)).toFixed(4));
  }
  let n=1;while(.9**n>.05)n++;
  assert.equal(answer(7),String(n));assert.equal(n,29);
  let system=0;
  for(let mask=0;mask<8;mask++){
    const power=!!(mask&1),a=!!(mask&2),b=!!(mask&4);
    if(power&&(a||b))system+=(power?.98:.02)*(a?.9:.1)*(b?.9:.1);
  }
  assert.equal(answer(8),system.toFixed(4));
  // Numerical quadrature of the standard-normal lower tail (independent of Phi implementation).
  const upper=-30/Math.sqrt(164), lo=-10, steps=20000, step=(upper-lo)/steps;
  let probability=0;
  for(let i=0;i<steps;i++){const z=lo+(i+.5)*step;probability+=Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*step;}
  assert.equal(answer(9),(probability*100).toFixed(2)+'%');
  qs[3].chart.rows.forEach(([,s,o,d,rpn])=>assert.equal(s*o*d,rpn));
});

test('Batch 2 keys agree with independent schedule, counting, likelihood, and distribution checks', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  // Forward pass over the supplied dependency table; the longest path is not hard-coded.
  const finish={};
  for(const [id,,duration,preds] of qs[10].chart.rows){
    const start=preds==='None'?0:Math.max(...preds.split(/ and |, /).map(p=>finish[p]));
    finish[id]=start+duration+(id==='C'?2:0);
  }
  assert.equal(answer(11),finish.F+' days');
  // Count true and false alarm cells in a reference population.
  const counts=qs[13].chart.rows.map(([,prevalence,alarm])=>10000*Number(prevalence)*Number(alarm));
  assert.equal(answer(14),(100*counts[0]/(counts[0]+counts[1])).toFixed(1)+'%');
  // Invert the Poisson CDF for four failures at fixed exposure, independently of chi-square lookup.
  const poissonCDF=mean=>{let term=Math.exp(-mean),sum=term;for(let k=1;k<=4;k++){term*=mean/k;sum+=term;}return sum;};
  let lo=0,hi=20;
  for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(poissonCDF(mid)>.1)lo=mid;else hi=mid;}
  assert.equal(answer(15),(2400/hi).toFixed(1)+' h');
  assert.equal(qs[14].options[2],(4800/13.362).toFixed(1)+' h');
  assert.equal(qs[14].options[3],(4800/18.307).toFixed(1)+' h');
  // Check all supplied even-df chi-square quantiles using the Erlang CDF.
  for(const [df,p90,p95] of qs[14].chart.rows){
    for(const [quantile,p] of [[Number(p90),.90],[Number(p95),.95]]){
      const x=quantile/2;let term=1,sum=1;
      for(let k=1;k<df/2;k++){term*=x/k;sum+=term;}
      assert.ok(Math.abs(1-Math.exp(-x)*sum-p)<.00002);
    }
  }
  // Evaluate the pooled likelihood on an MTBF grid; the stated estimate must maximize it.
  const logLikelihood=theta=>qs[16].chart.rows.reduce((v,[,,af,t,r])=>v+r*Math.log(af/theta)-af*t/theta,0);
  let best=0,bestLL=-Infinity;
  for(let theta=100;theta<=6500;theta++){const ll=logLikelihood(theta);if(ll>bestLL){bestLL=ll;best=theta;}}
  assert.equal(answer(17),best.toLocaleString('en-US')+' h');
  assert.equal(qs[16].options[0],((1000/2+500/4+250/8)/3).toFixed(1)+' h');
  assert.equal(qs[16].options[1],((1000+500+250)/3).toFixed(1)+' h');
  // Search whole unit-hours for the first cumulative growth forecast reaching the target.
  let exposure=1000;while(100*(exposure/1000)**.4<200)exposure++;
  assert.equal(answer(18),exposure.toLocaleString('en-US')+' unit-hours');
  qs[17].chart.rows.forEach(([t,mtbf])=>assert.equal(mtbf,(100*(t/1000)**.4).toFixed(2)));
  assert.equal(Math.round(1000*1.2**2.5),1577);
  // Convolve 20 Bernoulli distributions, then sum the rejection states.
  let failures=[1];
  for(let n=0;n<20;n++){const next=Array(n+2).fill(0);failures.forEach((p,k)=>{next[k]+=.95*p;next[k+1]+=.05*p;});failures=next;}
  assert.equal(answer(19),(100*failures.slice(2).reduce((a,b)=>a+b,0)).toFixed(1)+'%');
  assert.equal(qs[18].options[1],(100*(failures[0]+failures[1])).toFixed(1)+'%');
  assert.equal(qs[18].options[2],(100*(1-failures[0])).toFixed(1)+'%');
  // Numerical integration checks the proposed repair percentile on the log-time scale.
  const t=Number.parseFloat(answer(20)),upper=(Math.log(t)-Math.log(2))/.5,steps=20000,dx=(upper+10)/steps;
  let probability=0;
  for(let i=0;i<steps;i++){const z=-10+(i+.5)*dx;probability+=Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*dx;}
  assert.ok(Math.abs(probability-.9)<.0006);
  assert.equal(qs[19].options[1],(2*Math.exp(.5*.5/2)).toFixed(2)+' h');
  assert.equal(qs[19].options[2],(2*Math.exp(.5*1.6449)).toFixed(2)+' h');
});

test('Batch 3 numerical answers agree with joint states, binomial moments, thermal integration, contrasts, and Poisson tails', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  // Joint demand states consistent with the conditional and marginal B probabilities.
  const states=[{a:false,b:false,p:.875},{a:false,b:true,p:.025},{a:true,b:false,p:.075},{a:true,b:true,p:.025}];
  assert.equal(states.filter(s=>s.b).reduce((sum,s)=>sum+s.p,0),.05);
  assert.ok(Math.abs(states.find(s=>s.a&&s.b).p/states.filter(s=>s.a).reduce((sum,s)=>sum+s.p,0)-.25)<1e-12);
  const frequency=.4*states.filter(s=>s.a&&s.b).reduce((sum,s)=>sum+s.p,0);
  assert.equal(answer(23),frequency.toFixed(3)+' per year');
  // Derive the count variance from the full binomial probability distribution.
  const signals=[];
  for(const [week,n,d,p] of qs[24].chart.rows){
    let probabilities=[1];
    for(let k=0;k<n;k++){const next=Array(k+2).fill(0);probabilities.forEach((v,i)=>{next[i]+=.98*v;next[i+1]+=.02*v;});probabilities=next;}
    const mean=probabilities.reduce((s,v,k)=>s+k*v,0);
    const variance=probabilities.reduce((s,v,k)=>s+(k-mean)**2*v,0);
    if(d>mean+3*Math.sqrt(variance))signals.push(week);
    assert.equal(p,(d/n).toFixed(4));
  }
  assert.deepEqual(signals,[2]);assert.equal(answer(25),'Week '+signals[0]);
  // Integrate the log-rate temperature sensitivity instead of using the closed-form reciprocal difference.
  const low=328.15,high=358.15,steps=20000,dt=(high-low)/steps;let logRatio=0;
  for(let i=0;i<steps;i++){const t=low+(i+.5)*dt;logRatio+=.7/(8.617333262e-5*t*t)*dt;}
  assert.equal(answer(28),Math.exp(logRatio).toFixed(2));
  assert.equal(qs[27].options[1],Math.exp(-logRatio).toFixed(3));
  assert.equal(qs[27].options[2],(85/55).toFixed(2));
  assert.equal(qs[27].options[3],(358.15/328.15).toFixed(2));
  // Half the change in A's simple effect across B levels equals the AB factorial effect.
  const y=qs[28].chart.rows.map(r=>r[2]),simpleLow=y[1]-y[0],simpleHigh=y[3]-y[2];
  const effect=(simpleHigh-simpleLow)/2;
  assert.equal(answer(29),String(effect).replace('-','−')+' h');
  assert.equal((simpleHigh+simpleLow)/2,0);
  assert.equal(qs[28].options[1],String(effect/2).replace('-','−')+' h');
  const poissonCDF=(mean,n)=>{let term=Math.exp(-mean),sum=term;for(let k=1;k<=n;k++){term*=mean/k;sum+=term;}return sum;};
  for(const [stock,...values] of qs[29].chart.rows)values.forEach((v,i)=>assert.equal(v,poissonCDF([3,4.5,6][i],stock).toFixed(5)));
  let stock=0;while(poissonCDF(.1*45,stock)<.95)stock++;
  assert.equal(answer(30),stock+' spares');
  assert.ok(poissonCDF(4.5,stock-1)<.95&&poissonCDF(4.5,stock)>=.95);
});

test('Batch 4 keys agree with cash-flow totals, integrated hazard, likelihood masses, and constraint search', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  const plans=qs[31].chart.rows.map(([name,reliability,purchase,annual])=>({name,reliability:Number(reliability),total:[purchase,...Array(5).fill(annual)].reduce((a,b)=>a+b,0)}));
  assert.deepEqual(Array.from(plans,p=>p.total),[150000,160000,150000,160000]);
  assert.equal(answer(32),'Design '+plans.filter(p=>p.reliability>=.98).sort((a,b)=>a.total-b.total)[0].name);
  // Integrate hazard across the future interval instead of dividing two reliability values.
  let cumulativeHazard=0,failureMass=0;const dt=200/20000;
  for(let i=0;i<20000;i++){const t=800+(i+.5)*dt;const hazard=2*t/1000000;cumulativeHazard+=hazard*dt;failureMass+=hazard*Math.exp(-t*t/1000000)*dt;}
  assert.equal(answer(35),Math.exp(-cumulativeHazard).toFixed(4));
  assert.equal(qs[34].options[3],failureMass.toFixed(4));
  for(const [age,reliability] of qs[34].chart.rows)assert.equal(reliability,Math.exp(-age*age/1000000).toFixed(5));
  assert.equal(qs[34].options[0],Math.exp(-1).toFixed(4));assert.equal(qs[34].options[1],Math.exp(-.04).toFixed(4));
  // Compute two Poisson masses from their recurrences; common terms cancel in the ratio.
  const mass=(mean,count)=>{let p=Math.exp(-mean);for(let i=1;i<=count;i++)p*=mean/i;return p;};
  const ratio=mass(2500/500,4)/mass(2500/1000,4);
  assert.equal(ratio.toFixed(3),'1.313');assert.ok(ratio>1/9&&ratio<9);
  assert.match(answer(37),/^Continue/);
  assert.ok(mass(5,0)/mass(2.5,0)<1/9);assert.ok(mass(5,8)/mass(2.5,8)>9);
  // Interpolate using distance down from the two-watt end, then search voltage using I²R.
  const fractionUsed=(100-70)/(155-70),rating=2-2*fractionUsed,allowed=.6*rating;
  let maximum=0;for(let v=0;v<=110000;v++){const volts=v/10000,current=volts/100;if(current*current*100<=allowed&&volts<=10)maximum=volts;}
  assert.equal(answer(40),maximum.toFixed(2)+' V');assert.equal(answer(40),'8.81 V');
  assert.equal(qs[39].options[0],Math.sqrt(rating*100).toFixed(2)+' V');
  assert.equal(qs[39].options[3],Math.sqrt(.6*2*100).toFixed(2)+' V');
  assert.ok(10*10/100>allowed);assert.ok(8.81*8.81/100<=allowed);
});

async function harness(){
  const edge=(await import('data:text/javascript;base64,'+Buffer.from(read('netlify/edge-functions/test-bank-mobile-picker.js')).toString('base64'))).default;
  let html=await (await edge(new Request('https://upskillsprint.com/test-bank?exam=cre'),{next:async()=>new Response(read('test-bank.html'),{headers:{'content-type':'text/html'}})})).text();
  assert.match(html,/src="\/test-bank-cre-set2.js"/);
  assert.match(html,/src="\/test-bank-cre-set2-ui.js"/);
  html=html.replace(/<script\b[^>]*src=["'](\/test-bank-[^"'?]+\.js)(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi,(_,src)=>'<script>'+read(src.slice(1)).replace(/<\/script/gi,'<\\/script')+'</script>');
  const errors=[],typesetRoots=[],virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',e=>errors.push(e.message));
  let closeFrames=()=>{};
  const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank?exam=cre',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole,beforeParse(w){
    w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=w.alert=()=>{};w.confirm=()=>true;
    w.UpskillMath={typeset:async roots=>typesetRoots.push(...roots)};
    const request=w.requestAnimationFrame.bind(w),cancel=w.cancelAnimationFrame.bind(w),frames=new Set();let closing=false;
    w.requestAnimationFrame=cb=>{if(closing)return 0;const id=request(t=>{frames.delete(id);if(!closing)cb(t);});frames.add(id);return id;};
    w.cancelAnimationFrame=id=>{frames.delete(id);cancel(id);};
    closeFrames=()=>{closing=true;frames.forEach(cancel);};
  }});
  const w=dom.window;
  if(w.document.readyState!=='complete')await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
  await tick();
  return {w,errors,typesetRoots,close:()=>{w.__TBCurrentAttemptReview?.destroy?.();closeFrames();w.close();}};
}
function click(w,selector){const el=w.document.querySelector(selector);assert.ok(el,'control exists: '+selector);el.click();return el;}
function start(w,mode){click(w,'.tb-tile[data-exam="cre"]');click(w,'#tb-overview [data-mode="'+mode+'"]');return w.__TB.getFeedbackSnapshot();}
function submit(w){const n=w.__TB.getFeedbackSnapshot().records.length;click(w,'[data-goto="'+(n-1)+'"]');click(w,'[data-submit]');}

test('production player uses Set 2, correct pace, twenty-two exhibits, review tools, and immutable score',async()=>{
  const h=await harness(),{w}=h;
  try{
    click(w,'.tb-tile[data-exam="cre"]');
    assert.ok(w.document.querySelector('[data-set="1"]').disabled);
    assert.match(w.document.querySelector('#tb-overview').textContent,/40 of 150/);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,10),938);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,20),1876);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,30),2815);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,40),3753);
    click(w,'#tb-overview [data-mode="full"]');
    const snapshot=w.__TB.getFeedbackSnapshot();
    assert.equal(snapshot.records.length,40);
    assert.ok(snapshot.records.every(r=>/^cre:set-2:/.test(r.question.qid)));
    assert.equal(w.document.querySelector('.cre2-explorer'),null);
    assert.equal(w.document.querySelector('.tb-explanation'),null);
    snapshot.records.forEach((r,i)=>{click(w,'[data-goto="'+i+'"]');click(w,'[data-opt="'+r.question.answer+'"]');});
    submit(w);await tick();
    const score=w.document.querySelector('[data-score-result]').textContent;
    assert.match(score,/40\/40/);assert.equal(w.document.querySelector('[data-score-result]').dataset.sessionSet,'2');
    click(w,'[data-open-review="all"]');await tick();
    assert.equal(w.document.querySelectorAll('.tb-review-card').length,40);
    assert.equal(w.document.querySelectorAll('.tb-review-card .cre2-exhibit').length,22);
    assert.equal(w.document.querySelectorAll('.cre2-explorer').length,8);
    assert.equal(w.document.querySelectorAll('.cre2-source strong').length,80);
    for(const card of w.document.querySelectorAll('.tb-review-card'))assert.ok(h.typesetRoots.includes(card));
    const slider=w.document.querySelector('[data-cre-explorer="weibull"] input');
    slider.value='1500';slider.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(slider.closest('details').querySelector('output').textContent,/A has higher reliability/);
    const select=w.document.querySelector('[data-cre-explorer="sample-size"] select');
    select.value='0.99';select.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.match(select.closest('details').querySelector('output').textContent,/44 independent units/);
    select.closest('details').querySelector('button').click();assert.equal(select.value,'0.95');
    const baseline=JSON.stringify(w.CRE_SET2);
    const prevalence=w.document.querySelector('[data-cre-explorer="alarm-prevalence"] select');
    prevalence.value='0.10';prevalence.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.match(prevalence.closest('details').querySelector('output').textContent,/66.7%/);
    prevalence.closest('details').querySelector('button').click();assert.equal(prevalence.value,'0.02');
    assert.match(prevalence.closest('details').querySelector('output').textContent,/26.9%/);
    const acceptance=w.document.querySelector('[data-cre-explorer="acceptance-risk"] select');
    acceptance.value='2';acceptance.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.match(acceptance.closest('details').querySelector('output').textContent,/92.5%.*7.5%/);
    acceptance.value='0';acceptance.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.match(acceptance.closest('details').querySelector('output').textContent,/35.8%.*64.2%/);
    acceptance.closest('details').querySelector('button').click();assert.equal(acceptance.value,'1');
    assert.match(acceptance.closest('details').querySelector('output').textContent,/73.6%.*26.4%/);
    const sampleSize=w.document.querySelector('[data-cre-explorer="p-chart-sample"] select');
    sampleSize.value='200';sampleSize.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.match(sampleSize.closest('details').querySelector('output').textContent,/9 \/ 200.*4.97%.*Within/);
    sampleSize.value='800';sampleSize.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert.match(sampleSize.closest('details').querySelector('output').textContent,/36 \/ 800.*Above/);
    sampleSize.closest('details').querySelector('button').click();assert.equal(sampleSize.value,'400');
    const temperature=w.document.querySelector('[data-cre-explorer="arrhenius-temperature"] input');
    temperature.value='100';temperature.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(temperature.closest('details').querySelector('output').textContent,/373.15 K/);
    assert.notEqual(temperature.closest('details').querySelector('output').textContent.includes('factor: 7.95.'),true);
    temperature.closest('details').querySelector('button').click();assert.equal(temperature.value,'85');
    assert.match(temperature.closest('details').querySelector('output').textContent,/factor: 7.95/);
    const failures=w.document.querySelector('[data-cre-explorer="sequential-failures"] input');
    failures.value='0';failures.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(failures.closest('details').querySelector('output').textContent,/0.0821.*Accept/);
    failures.value='8';failures.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(failures.closest('details').querySelector('output').textContent,/21.0138.*Reject/);
    failures.closest('details').querySelector('button').click();assert.equal(failures.value,'4');
    assert.match(failures.closest('details').querySelector('output').textContent,/1.3134.*Continue/);
    const ambient=w.document.querySelector('[data-cre-explorer="derating-temperature"] input');
    ambient.value='30';ambient.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(ambient.closest('details').querySelector('output').textContent,/10.00 V.*independent/);
    ambient.value='150';ambient.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(ambient.closest('details').querySelector('output').textContent,/2.66 V.*temperature-dependent/);
    ambient.closest('details').querySelector('button').click();assert.equal(ambient.value,'100');
    assert.match(ambient.closest('details').querySelector('output').textContent,/0.7765 W.*8.81 V/);
    assert.equal(JSON.stringify(w.CRE_SET2),baseline);
    assert.equal(w.document.querySelector('[data-score-result]').textContent,score);
    // The concurrently merged Set 3 stays selectable and uses only its own bank.
    const thirdBefore=JSON.stringify(w.CRE_SET3);
    click(w,'[data-back]');click(w,'[data-set="3"]');click(w,'#tb-overview [data-mode="full"]');
    const third=w.__TB.getFeedbackSnapshot();
    assert.equal(third.records.length,10);
    assert.ok(third.records.every(r=>r.question.qid.startsWith('cre:set-3:')));
    assert.equal(JSON.stringify(w.CRE_SET3),thirdBefore);
    assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

test('quick and focused modes select available Set 2; retry math renders without exposing explorers',async()=>{
  const h=await harness(),{w}=h;
  try{
    const snap=start(w,'quick');assert.equal(snap.records.length,20);
    submit(w);await tick();click(w,'[data-retry-missed]');
    const q=snap.records[0].question;
    click(w,'[data-retry-opt="'+q.answer+'"]');click(w,'[data-retry-check]');await tick();
    const feedback=w.document.querySelector('.tb-retry-feedback');
    assert.ok(h.typesetRoots.includes(feedback));
    assert.equal(w.document.querySelector('.tb-retry-panel .cre2-explorer'),null);
    click(w,'[data-back]');
    click(w,'#tb-overview [data-mode="focus"]');
    assert.equal(w.__TB.getFeedbackSnapshot().records.length,8);
    assert.ok(w.__TB.getFeedbackSnapshot().records.every(r=>r.question.qid.startsWith('cre:set-2:')));
    assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

test('answer reveal typesets new working and records the revealed item as incorrect',async()=>{
  const h=await harness(),{w}=h;
  try{
    const snap=start(w,'quick');
    const i=snap.records.findIndex(r=>r.question.quantitative && r.question.why.includes('\\['));
    assert.ok(i>=0, 'the quick selection includes a question with worked mathematics');
    click(w,'[data-goto="'+i+'"]');click(w,'[data-reveal]');await tick();
    const working=w.document.querySelector('#tb-revealed-answer');
    assert.ok(working);assert.ok(h.typesetRoots.includes(working));
    assert.equal(working.querySelector('.cre2-explorer'),null);
    submit(w);await tick();
    assert.match(w.document.querySelector('[data-score-result]').textContent,/0\/20/);
    assert.match(w.document.querySelector('[data-score-result]').textContent,/1 revealed/);
    assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

test('fallback preserves diagram logic when the presentation module is unavailable',async()=>{
  const h=await harness(),{w}=h;
  try{
    w.__CRESet2UI=null;
    const q=w.CRE_SET2[2];
    const html=w.__TB.renderQuestionContent(q,false);
    assert.match(html,/\(A AND C\) OR \(B AND C\)/);
    assert.match(html,/0.10/);assert.match(html,/0.20/);assert.match(html,/0.05/);
  }finally{h.close();}
});

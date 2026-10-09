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

test('batch contract: stable IDs, current BoK weights, complete feedback, fifty-six exhibits, valid lesson anchors', () => {
  const {CRE_SET2: qs, registerCRESet2} = bank();
  assert.equal(qs.length, 100);
  const exam = {bok: [], bank: []}, dm = {};
  registerCRESet2(exam, dm);
  assert.deepEqual(Array.from(exam.bok, d => d.weight), [29,25,35,35,26]);
  assert.equal(exam.questions, 165); assert.equal(exam.minutes, 258);
  assert.equal(qs.filter(q => q.chart).length, 56);
  assert.equal(qs.filter(q => q.chart?.creKind).length, 30);
  assert.equal(qs.filter(q => q.explorer).length, 20);
  assert.deepEqual(Array.from(exam.bok, d => qs.filter(q => q.sub === d.domain).length), [19,17,23,24,17]);
  assert.deepEqual([0,1,2,3].map(key => qs.filter(q => q.answer === key).length), [25,25,25,25]);
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,20))).digest('hex'), '488de3d62f6ba40533c7f4bbfa30ccba24492571571d06c08cdd8de328b29efc', 'Batches 1–2 content is unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,30))).digest('hex'), '1d58917f68fcb88dd4fe42568d6e50394789e0cab74c16719108b1ff3841921b', 'Batches 1–3 content is unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,40))).digest('hex'), '673070d6340dfe526539b3be6fbaaf14cf4b0ebfd26ea0ed9a6d707808b9c070', 'Batches 1–4 content is unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,50))).digest('hex'), '459d6748c2fa8f96f2f4737e0d42ad6f0c2cfb7f4c73574c947417c1007b280c', 'Batches 1–5 content is unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,60))).digest('hex'), '0a514798a814ec13ce0d7b8e993da2a44c4aedb370d1211f1002eae3ea7c8d6e', 'Batches 1–6 content is unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,70))).digest('hex'), '26de7da93287a6dc411fce15f3a62364d611f677e49a2f043fec26c207bb8db8', 'Batches 1–7 content is unchanged');
  const released = JSON.stringify(qs.slice(0,10));
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,90))).digest('hex'), '3aa3b10d998f5c30c1b0befb8e15d0c3548f9aeeb9f6573495d0b2facc20fbfa', 'Batches 1–9 content is unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(qs.slice(0,80))).digest('hex'), '0306b7d9d873b1efcdf7c169be1d620e547b7e91611c32501156443557421bb6', 'Batches 1–8 content is unchanged');
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
  assert.equal(exam.sets[2].length, 100);
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


test('Batch 5 checks criticality counts, probability-plot coordinates, precision, phased survival, aliasing, and renewal costs', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  // Expected critical-effect counts in 1,000 missions of 1,000 hours each.
  const effects=qs[42].chart.rows.map(([name,failures,fraction,conditional])=>({name,count:failures*Number(fraction)*Number(conditional)}));
  const highest=effects.reduce((a,b)=>a.count>b.count?a:b);
  assert.equal(highest.name,'Fan / bearing seizure');assert.equal(highest.count,9);
  assert.match(answer(43),/Fan bearing seizure/);
  assert.deepEqual(Array.from(effects,e=>Number((e.count/1000).toFixed(4))),[.0064,.009,.003,.004]);
  // Recover shape from the ratio of cumulative hazards, independent of reading plotted coordinates.
  const points=qs[43].chart.rows.map(([,t,f,x,y])=>({t,f:Number(f),x:Number(x),y:Number(String(y).replace('−','-'))}));
  points.forEach(p=>{assert.ok(Math.abs(Math.log(p.t)-p.x)<.000006);assert.ok(Math.abs(Math.log(-Math.log(1-p.f))-p.y)<.00002);});
  const shape=Math.log(Math.log(1-points[1].f)/Math.log(1-points[0].f))/Math.log(points[1].t/points[0].t);
  assert.ok(Math.abs(shape-2)<.00002);assert.match(answer(44),/2.0; increasing/);
  // Search integer n by the interval's standard error, not by rounding a supplied result.
  const width=n=>1.96*40/Math.sqrt(n);let n=1;while(width(n)>10)n++;
  assert.equal(answer(46),n+' specimens');assert.ok(width(n-1)>10&&width(n)<=10);
  assert.equal(qs[45].options[0],Math.floor((1.96*40/10)**2)+' specimens');
  assert.equal(qs[45].options[1],Math.ceil((1.645*40/10)**2)+' specimens');
  assert.equal(qs[45].options[2],Math.ceil((1.96*40/5)**2)+' specimens');
  // Multiply conditional survival across 10,000 small exposure intervals.
  let survival=1;for(let i=0;i<10000;i++)survival*=Math.exp(-(i<2000?.003:.0005)*.001);
  assert.equal(answer(47),survival.toFixed(5));
  assert.equal(qs[46].options[0],Math.exp(-(.003+.0005)/2*10).toFixed(5));
  assert.equal(qs[46].options[2],(1-survival).toFixed(5));
  assert.equal(qs[46].options[3],Math.exp(-.003*10).toFixed(5));
  // Enumerate actual design rows: all-factor reversal repeats the fraction; D-only reversal complements it.
  const rows=Array.from(qs[48].chart.rows, row=>Array.from(row.slice(1),v=>Number(v.replace('−','-'))));
  const original=new Set(rows.map(r=>r.join(','))),complement=rows.map(([a,b,c,d])=>[a,b,c,-d]);
  for(const [a,b,c,d] of rows){assert.equal(a*b*c,d);assert.equal(a*b,c*d);assert.ok(original.has([-a,-b,-c,-d].join(',')));}
  for(const [a,b,c,d] of complement){assert.equal(a*b,-c*d);assert.ok(!original.has([a,b,c,d].join(',')));}
  const full=[...rows,...complement];assert.equal(new Set(full.map(r=>r.join(','))).size,16);
  assert.equal(full.reduce((sum,[a,b,c,d])=>sum+(a*b)*(c*d),0),0);
  assert.match(answer(49),/reverse only D/);
  // A concrete lifetime distribution independently demonstrates that all supplied policy moments are compatible.
  const lives=[{p:.02,t:50},{p:.08,t:150},{p:.20,t:260},{p:.70,t:435/.7}];
  const policies=[100,200,300,Infinity].map((age,i)=>{
    const time=lives.reduce((sum,l)=>sum+l.p*Math.min(age,l.t),0);
    const cost=lives.reduce((sum,l)=>sum+l.p*(l.t<age?1000:200),0);
    assert.ok(Math.abs(time-qs[49].chart.rows[i][2])<1e-10);
    if(Number.isFinite(age))assert.ok(Math.abs(lives.filter(l=>l.t>=age).reduce((sum,l)=>sum+l.p,0)-Number(qs[49].chart.rows[i][1]))<1e-10);
    return {age,rate:cost/time};
  });
  assert.equal(policies.reduce((a,b)=>a.rate<b.rate?a:b).age,200);
  assert.deepEqual(policies.map(p=>p.rate.toFixed(3)),['2.182','1.451','1.600','2.000']);
  assert.match(answer(50),/200 h/);
});


test('Batch 6 independently checks contingency inference, capability, degradation regression, voting states, and constrained design choices', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  // Squared pooled two-proportion z gives an independent route to the 2x2 Pearson statistic.
  const rows=qs[54].chart.rows.slice(0,2),total=rows.reduce((sum,r)=>sum+r[3],0),failures=rows.reduce((sum,r)=>sum+r[1],0),pooled=failures/total;
  const difference=rows[1][1]/rows[1][3]-rows[0][1]/rows[0][3];
  const statistic=difference**2/(pooled*(1-pooled)*(1/rows[0][3]+1/rows[1][3]));
  assert.equal(answer(55),statistic.toFixed(2)+'; reject independence.');
  assert.equal(qs[54].options[0],(statistic/2).toFixed(2)+'; fail to reject independence.');
  assert.equal(qs[54].options[2],(2*100/30).toFixed(2)+'; reject independence.');
  rows.forEach(row=>{assert.equal(row[3]*pooled,30);assert.equal(row[3]*(1-pooled),170);});
  // For one degree of freedom, integrate both normal tails to verify the supplied chi-square critical value.
  const lower=Math.sqrt(6.635),steps=20000,dx=(10-lower)/steps;let tail=0;
  for(let i=0;i<steps;i++){const z=lower+(i+.5)*dx;tail+=2*Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*dx;}
  assert.ok(Math.abs(tail-.01)<.000002);
  // Read the actual study summary and distinguish centered indices from spread-only indices.
  const values=qs[55].chart.rows.map(r=>r[1]),[lsl,usl,mean,within,overall]=values;
  const near=Math.min(usl-mean,mean-lsl),cpk=near/(3*within),ppk=near/(3*overall);
  assert.equal(answer(56),cpk.toFixed(2)+' and '+ppk.toFixed(2));
  assert.equal(qs[55].options[1],((usl-lsl)/(6*within)).toFixed(2)+' and '+((usl-lsl)/(6*overall)).toFixed(2));
  assert.equal(mean-3*within,97);assert.equal(mean+3*within,115);assert.equal(mean-3*overall,91);assert.equal(mean+3*overall,121);
  // Fit by covariance/variance using all three observations, then invert the fitted trend.
  const data=Array.from(qs[56].chart.rows,([t,y])=>({t,y:Number(y)}));
  const tMean=data.reduce((s,p)=>s+p.t,0)/data.length,yMean=data.reduce((s,p)=>s+p.y,0)/data.length;
  const slope=data.reduce((s,p)=>s+(p.t-tMean)*(p.y-yMean),0)/data.reduce((s,p)=>s+(p.t-tMean)**2,0),intercept=yMean-slope*tMean;
  data.forEach(p=>assert.ok(Math.abs(intercept+slope*p.t-p.y)<1e-12));
  const life=(.6-intercept)/slope;assert.equal(answer(57),Math.round(life).toLocaleString('en-US')+' h');
  assert.equal(qs[56].options[0],Math.round(life-600)+' h');
  assert.equal(qs[56].options[1],Math.round(.6/slope).toLocaleString('en-US')+' h');
  assert.equal(qs[56].options[3],Math.round(600*.6/.28).toLocaleString('en-US')+' h');
  // Enumerate all 16 combinations of three sensor outcomes and the voter outcome.
  const results=[0,0,0];let sensorOnly=0;
  for(let mask=0;mask<16;mask++){
    const states=[0,1,2,3].map(i=>!!(mask&(1<<i))),rates=[.9,.9,.9,.98];
    const probability=states.reduce((p,up,i)=>p*(up?rates[i]:1-rates[i]),1),count=states.slice(0,3).filter(Boolean).length;
    if(count>=2)sensorOnly+=probability;
    for(let k=1;k<=3;k++)if(states[3]&&count>=k)results[k-1]+=probability;
  }
  assert.equal(answer(58),results[1].toFixed(5));
  assert.equal(qs[57].options[1],results[2].toFixed(5));assert.equal(qs[57].options[2],results[0].toFixed(5));assert.equal(qs[57].options[3],sensorOnly.toFixed(5));
  // Search all nine version pairs; the best feasible design must beat every other feasible pair.
  const versions=Array.from(qs[59].chart.rows,([name,r,cost,mass])=>({name:name.split(' ')[0],r:Number(r),cost,mass})),pairs=[];
  for(const a of versions.filter(v=>v.name.startsWith('A')))for(const b of versions.filter(v=>v.name.startsWith('B')))pairs.push({name:a.name+' with '+b.name,r:a.r*b.r,cost:a.cost+b.cost,mass:a.mass+b.mass});
  const feasible=pairs.filter(p=>p.cost<=10000&&p.mass<=3).sort((a,b)=>b.r-a.r);
  assert.equal(pairs.length,9);assert.equal(feasible.length,6);assert.equal(answer(60),feasible[0].name);assert.equal(feasible[0].r.toFixed(4),'0.9120');
  assert.equal(pairs.find(p=>p.name===qs[59].options[0]).mass,4);assert.equal(pairs.find(p=>p.name===qs[59].options[2]).cost,11000);
  assert.ok(feasible[0].r>pairs.find(p=>p.name===qs[59].options[3]).r);
});


test('Batch 7 independently checks minimal cuts, mean confidence, downtime priorities, fatigue interpolation, standby states, and repair scheduling', () => {
  const qs=bank().CRE_SET2, answer=n=>qs[n-1].options[qs[n-1].answer];
  // Enumerate the truth table, then remove any successful combination with a smaller successful subset.
  const causes=mask=>!!((mask&1||mask&2)&&(mask&1||mask&4));
  const minimal=[];
  for(let mask=1;mask<8;mask++)if(causes(mask)&&![1,2,4].some(bit=>(mask&bit)&&causes(mask^bit)))minimal.push(mask);
  const set=m=>'{'+['A','B','C'].filter((_,i)=>m&(1<<i)).join(', ')+'}';
  assert.equal(answer(63),minimal.map(set).join(' and '));
  // Numerically integrate the exact Student-t(9) density to verify both supplied t percentiles.
  const cdf=t=>{const n=20000,dx=t/n;let v=.5;for(let i=0;i<n;i++){const x=(i+.5)*dx;v+=128/(105*Math.PI)*Math.pow(1+x*x/9,-5)*dx;}return v;};
  for(const [,df,p,t] of qs[64].chart.rows.filter(r=>r[0]==='Student t')){assert.equal(df,9);assert.ok(Math.abs(cdf(Number(t))-Number(p))<.00003);}
  const values=qs[64].options.map(v=>Number(v.replace(/[, h]/g,'')));
  const chosen=values[qs[64].answer],statistic=(1200-chosen)/(180/Math.sqrt(10));
  assert.ok(Math.abs(statistic-1.833)<.001);
  assert.equal(values[0].toFixed(1),(1200-1.645*180/Math.sqrt(10)).toFixed(1));
  assert.equal(values[1].toFixed(1),(1200-2.262*180/Math.sqrt(10)).toFixed(1));
  assert.equal(values[3].toFixed(1),(1200-1.833*180).toFixed(1));
  // Reconstruct the per-event durations and calculate impact, rather than rank the count column.
  const impact=Array.from(qs[65].chart.rows,([name,n,mean])=>({name,total:Array(n).fill(Number(mean)).reduce((a,b)=>a+b,0)}));
  const total=impact.reduce((v,r)=>v+r.total,0),ranked=[...impact].sort((a,b)=>b.total-a.total);
  let covered=0,leading=0;while(covered/total<.75)covered+=ranked[leading++].total;
  assert.equal(leading,2);assert.equal(total,143);assert.equal(covered,117);
  assert.equal(answer(66),'Gearbox and drive faults; '+(covered/total*100).toFixed(1)+'%');
  for(const [i,sum] of [[1,26],[2,92],[3,65]])assert.ok(qs[65].options[i].endsWith((sum/total*100).toFixed(1)+'%'));
  // Fit the two log-transformed points as a line, then predict at log(80).
  const [[s1,n1],[s2,n2]]=qs[66].chart.rows,slope=(Math.log(n2)-Math.log(n1))/(Math.log(s2)-Math.log(s1));
  const logLife=Math.log(n1)+slope*(Math.log(80)-Math.log(s1));
  assert.ok(Math.abs(slope+3)<1e-12);
  assert.equal(answer(67),Math.round(Math.exp(logLife)).toLocaleString('en-US')+' cycles');
  assert.equal(qs[66].options[0],Math.round(n1+(n2-n1)*(80-s1)/(s2-s1)).toLocaleString('en-US')+' cycles');
  assert.equal(qs[66].options[1],(n2*s2/80).toLocaleString('en-US')+' cycles');
  assert.equal(qs[66].options[2],Math.round(n1*Math.pow(80/s1,3)).toLocaleString('en-US')+' cycles');
  // Evolve A-active and B-active state probabilities through very small time steps.
  const evolve=c=>{const dt=.001,p=-Math.expm1(-.001*dt);let a=1,b=0;for(let i=0;i<200000;i++){const nextB=b*(1-p)+a*p*c;a*=1-p;b=nextB;}return a+b;};
  assert.equal(answer(68),evolve(.9).toFixed(5));
  assert.equal(qs[67].options[0],evolve(1).toFixed(5));
  const single=evolve(0);
  assert.equal(qs[67].options[2],(1-(1-single)**2).toFixed(5));
  assert.equal(qs[67].options[3],(.9*evolve(1)).toFixed(5));
  // Compute a precedence forward pass and active labor sum for each repair class directly from the rows.
  const metrics={};
  for(const repairClass of ['A: 75%','B: 25%']){
    const finish={};let labor=0,serial=0;
    for(const [,name,time,crew,predecessor] of qs[69].chart.rows.filter(r=>r[0]===repairClass)){
      const deps=predecessor==='None'?[]:predecessor==='Both X and Y'?['Job X','Job Y']:[predecessor];
      finish[name]=Math.max(0,...deps.map(d=>finish[d]))+Number(time);labor+=Number(time)*crew;serial+=Number(time);
    }
    metrics[repairClass[0]]={elapsed:Math.max(...Object.values(finish)),labor,serial};
  }
  const {A,B}=metrics;
  assert.deepEqual(A,{elapsed:2,labor:3,serial:2});assert.deepEqual(B,{elapsed:5,labor:9,serial:7});
  const elapsed=.75*A.elapsed+.25*B.elapsed,labor=.75*A.labor+.25*B.labor;
  assert.equal(answer(70),elapsed.toFixed(2)+' h and '+labor.toFixed(2)+' person-hours');
  assert.equal(qs[69].options[1],(.75*A.serial+.25*B.serial).toFixed(2)+' h and '+labor.toFixed(2)+' person-hours');
  assert.equal(qs[69].options[2],labor.toFixed(2)+' h and '+elapsed.toFixed(2)+' person-hours');
  assert.equal(qs[69].options[3],((A.elapsed+B.elapsed)/2).toFixed(2)+' h and '+((A.labor+B.labor)/2).toFixed(2)+' person-hours');
});

test('Batch 8 keys agree with density integration, residual, exposure, diagnostic, and phase checks', () => {
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer];
  const dashboard=qs[70].chart.rows;
  for(let column=1;column<=2;column++){
    const product=dashboard.slice(0,3).reduce((v,r)=>v*parseFloat(r[column])/100,1);
    assert.equal((100*product).toFixed(1)+'%',dashboard[3][column]);
    assert.equal(dashboard[5][column]/6000,.002);
  }
  // Integrate density with trapezoids, then differentiate log survival numerically.
  const survival=t=>{const n=1000,dt=t/n;let area=0;for(let i=0;i<n;i++)area+=((i*dt)/2000000+((i+1)*dt)/2000000)*dt/2;return 1-area;};
  assert.ok(Math.abs(survival(2000))<1e-12);
  const age=1500,hazard=-(Math.log(survival(age+.01))-Math.log(survival(age-.01)))/.02;
  assert.ok(answer(73).includes(hazard.toFixed(6)));
  const density=age/2000000,cdf=1-survival(age);
  for(const [i,v] of [[0,density],[1,density/cdf],[2,cdf/age]])assert.ok(qs[72].options[i].includes(v.toFixed(6)));
  qs[72].chart.rows.forEach(([t,f])=>assert.equal(Number(f),(typeof t==='number'?t:2000)/2000000));
  // Build the multinomial observed proportions; Pearson is n times their weighted squared distance.
  const observed=Array.from(qs[73].chart.rows,r=>r[1]);assert.equal(observed.reduce((a,b)=>a+b),100);
  const statistic=100*observed.reduce((sum,n)=>sum+(n/100-.2)**2/.2,0);
  assert.equal(statistic.toFixed(2),'8.50');
  assert.equal(answer(74),statistic.toFixed(2)+'; 4 degrees of freedom; fail to reject the specified model');
  assert.ok(qs[73].options[3].startsWith((statistic/5).toFixed(2)));
  // Independently check the supplied null-model quantiles and chi-square reference values.
  const boundaries=[0,...[.2,.4,.6,.8].map(p=>-1000*Math.log1p(-p)),Infinity];
  boundaries.slice(1).forEach((end,i)=>assert.ok(Math.abs(Math.exp(-boundaries[i]/1000)-Math.exp(-end/1000)-.2)<1e-12));
  assert.ok(Math.abs(Math.exp(-9.488/2)*(1+9.488/2)-.05)<.00002);
  const upper=Math.sqrt(7.815),dr=upper/20000;let chi3=0;
  for(let i=0;i<20000;i++){const r=(i+.5)*dr;chi3+=Math.sqrt(2/Math.PI)*r*r*Math.exp(-r*r/2)*dr;}
  assert.ok(Math.abs(chi3-.95)<.00002);
  // Count qualified one-minute intervals in the continuous trace, rather than using elapsed chamber time.
  const rows=qs[75].chart.rows,temperature=t=>{let k=1;while(k<rows.length-1&&t>rows[k][0])k++;const a=rows[k-1],b=rows[k];return a[2]+(b[2]-a[2])*(t-a[0])/(b[0]-a[0]);};
  let qualified=0;for(let minute=0;minute<90;minute++)if(temperature(minute+.5)>=83&&temperature(minute+.5)<=87)qualified++;
  assert.equal(qualified,50);assert.match(answer(76),/Only 50.*minute 100/);
  // Enumerate a 100-repair population for each candidate diagnostic coverage.
  const means=qs[78].options.map(v=>{const fast=parseInt(v,10);let total=0;for(let i=0;i<100;i++)total+=(i<fast?.25:2.75)+.5;return total/100;});
  assert.deepEqual(Array.from(means),[1.25,1.125,1,.875]);
  assert.equal(qs[78].options[means.findIndex(mean=>mean<=1)],answer(79));
  // Sample a uniform grid of condition-onset phases; count completion before the failure time.
  const success=spacing=>{let count=0;const n=100000;for(let i=0;i<n;i++){const appearance=(i+.5)*spacing/n,inspection=spacing,failure=appearance+14;if(inspection+6<failure)count++;}return count/n;};
  assert.equal(answer(80),(100*success(10)).toFixed(0)+'%');
  assert.equal(success(4),1);assert.equal(success(8),1);assert.equal(success(20),.4);
  assert.equal(qs[79].options[0],((10-6)/10*100)+'%');assert.equal(qs[79].options[1],(6/10*100)+'%');
});

test('Batch 9 independently checks finite sampling, proportional hazards, fatigue history, covariance, and proof-test averaging', () => {
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer];
  const newBatch=Array.from(qs.slice(80,90));
  assert.equal(newBatch.filter(q=>q.quantitative).length,5);
  assert.deepEqual(['Foundational','Moderate','Challenging'].map(d=>newBatch.filter(q=>q.difficulty===d).length),[1,6,3]);
  // Enumerate all unordered pairs rather than reuse the complement calculation.
  let pairs=0,anyFailure=0,bothFailed=0;
  for(let a=0;a<20;a++)for(let b=a+1;b<20;b++){pairs++;if(a<4||b<4)anyFailure++;if(a<4&&b<4)bothFailed++;}
  assert.equal(pairs,190);assert.equal(anyFailure,70);
  assert.equal(answer(85),(anyFailure/pairs).toFixed(4));
  assert.equal(qs[84].options[2],(bothFailed/pairs).toFixed(4));
  assert.equal(qs[84].options[0],(1-.8*.8).toFixed(4));assert.equal(qs[84].options[1],(.2+.2).toFixed(4));
  // Propagate survival through a nonconstant baseline hazard using small conditional failure steps.
  const dt=.01,a=-2*Math.log(.8)/1000000;let ra=1,rb=1;
  for(let i=0;i<100000;i++){const hazard=a*(i+.5)*dt;ra*=1-hazard*dt;rb*=1-.5*hazard*dt;}
  assert.equal(ra.toFixed(4),'0.8000');assert.equal(answer(86),rb.toFixed(4));
  assert.equal(qs[85].options[0],(1-.5*(1-.8)).toFixed(4));
  assert.equal(qs[85].options[2],(.5*.8).toFixed(4));assert.equal(qs[85].options[3],(.8*.8).toFixed(4));
  // Count integer damage units cycle by cycle: H adds two and L one, with a 20,000-unit threshold.
  let damage=0,cycles=0;
  while(damage<20000){const within=cycles%5000;damage+=within<1000?2:1;cycles++;}
  assert.equal(cycles,16000);assert.equal(answer(87),cycles.toLocaleString('en-US')+' cycles');
  assert.equal(qs[86].options[0],(3*5000).toLocaleString('en-US')+' cycles');
  assert.equal(qs[86].options[1],Math.round(5000/.3).toLocaleString('en-US')+' cycles');
  assert.equal(qs[86].options[3],(4*5000).toLocaleString('en-US')+' cycles');
  // Construct the paired normals from independent latent variables and integrate the resulting failure tail.
  // X=120+10Z1; Y=100+10(rho Z1+sqrt(1-rho^2)Z2).
  const rho=.5,marginSD=10*Math.sqrt((1-rho)**2+(1-rho*rho));
  assert.equal(marginSD,10);
  const normalCDF=z=>{const lo=-10,n=40000,step=(z-lo)/n;let area=0;for(let i=0;i<n;i++){const x=lo+(i+.5)*step;area+=Math.exp(-x*x/2)/Math.sqrt(2*Math.PI)*step;}return area;};
  const pf=normalCDF(-20/marginSD);
  assert.equal(answer(89),(100*pf).toFixed(2)+'%');
  assert.equal(qs[88].options[0],(100*normalCDF(-20/Math.sqrt(200))).toFixed(2)+'%');
  assert.equal(qs[88].options[2],(100*normalCDF(-20/Math.sqrt(300))).toFixed(2)+'%');
  assert.equal(qs[88].options[3],(100*(1-pf)).toFixed(2)+'%');
  for(const [label,p] of qs[88].chart.rows.slice(3)){const z=Number(label.match(/z = ([0-9.]+)/)[1]);assert.equal(normalCDF(z).toFixed(4),p);}
  // Integrate unavailability over equally likely demand times, independently of the closed-form average.
  const average=interval=>{const n=100000;let sum=0;for(let i=0;i<n;i++){const t=(i+.5)*interval/n;sum+=1-Math.exp(-.00002*t);}return sum/n;};
  assert.equal(answer(90),(100*average(500)).toFixed(2)+'%');
  assert.equal(qs[89].options[0],(100*(1-Math.exp(-.01))).toFixed(2)+'%');
  assert.equal(qs[89].options[1],(100*.00002).toFixed(3)+'%');
  assert.equal(qs[89].options[2],(100*(1-average(500))).toFixed(2)+'%');
  for(const [interval,expected] of [[250,'0.2496'],[500,'0.4983'],[1000,'0.9934'],[2000,'1.9736']])assert.equal((100*average(interval)).toFixed(4),expected);
  // Every math-bearing string uses paired delimiters; the shared renderer is exercised in the player test.
  for(const q of newBatch)for(const value of [q.stem,q.why,...q.options]){
    const residual=value.replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g,'');
    assert.doesNotMatch(residual,/\\[()[\]]/);
  }
});

test('Batch 10 independently verifies risk costs, binomial counts, load-sharing states, and block adjustment', () => {
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer],batch=Array.from(qs.slice(90));
  assert.equal(batch.filter(q=>q.quantitative).length,4);
  assert.deepEqual(['Foundational','Moderate','Challenging'].map(d=>batch.filter(q=>q.difficulty===d).length),[1,7,2]);
  const downtime=qs[90].chart.rows.map(([,wait,repair])=>wait+repair);
  assert.deepEqual(Array.from(downtime),[20,19,6]);
  // Enumerate 100 equally weighted annual outcomes, including certain control cost in every outcome.
  const costs=qs[93].chart.rows.map(([name,c,p,loss])=>{let sum=0;for(let i=0;i<100;i++)sum+=c+(i<Number(p)*100?loss:0);return [name,sum/100];});
  assert.deepEqual(Array.from(costs,x=>x[1]),[16000,9000,10000,11000]);
  assert.equal(answer(94),costs.reduce((best,row)=>row[1]<best[1]?row:best)[0]);
  // Enumerate all 256 binary outcome sequences rather than reusing the binomial formula.
  let exact=0,atLeastTwo=0,atLeastOne=0,total=0;
  for(let mask=0;mask<256;mask++){let count=0,p=1;for(let j=0;j<8;j++){const fail=Boolean(mask&(1<<j));count+=fail;p*=fail?.1:.9;}total+=p;if(count===2)exact+=p;if(count>=2)atLeastTwo+=p;if(count>=1)atLeastOne+=p;}
  assert.ok(Math.abs(total-1)<1e-12);assert.equal(answer(96),exact.toFixed(4));
  assert.equal(qs[95].options[1],(.1**2*.9**6).toFixed(4));assert.equal(qs[95].options[2],atLeastTwo.toFixed(4));assert.equal(qs[95].options[3],atLeastOne.toFixed(4));
  // Propagate the probability of each state with small time steps; retain the equal-rate case.
  function propagate(m){let two=1,one=0,none=0;const dt=.001;for(let i=0;i<100000;i++){const first=two*.002*dt,last=one*m*.001*dt;two-=first;one+=first-last;none+=last;}assert.ok(Math.abs(two+one+none-1)<1e-10);return two+one;}
  assert.equal(answer(99),propagate(4).toFixed(4));
  for(const [m,expected] of [[1,'0.9909'],[2,'0.9825'],[4,'0.9671'],[6,'0.9537']])assert.equal(propagate(m).toFixed(4),expected);
  assert.equal(qs[98].options[0],propagate(1).toFixed(4));assert.equal(qs[98].options[2],Math.exp(-.2).toFixed(4));assert.equal(qs[98].options[3],Math.exp(-.4).toFixed(4));
  // Fit intercept, B indicator, and Block 2 indicator to all eight observations by normal-equation elimination.
  const obs=[];for(const [block,treatment,values,count] of qs[99].chart.rows){const ys=values.split(',').map(Number);assert.equal(ys.length,count);for(const y of ys)obs.push({x:[1,Number(treatment==='B'),Number(block==='2')],y});}
  const matrix=Array.from({length:3},(_,i)=>[...Array.from({length:3},(_,j)=>obs.reduce((s,o)=>s+o.x[i]*o.x[j],0)),obs.reduce((s,o)=>s+o.x[i]*o.y,0)]);
  for(let i=0;i<3;i++){const pivot=matrix[i][i];for(let j=i;j<4;j++)matrix[i][j]/=pivot;for(let k=0;k<3;k++)if(k!==i){const factor=matrix[k][i];for(let j=i;j<4;j++)matrix[k][j]-=factor*matrix[i][j];}}
  assert.ok(Math.abs(matrix[1][3]-6)<1e-10);assert.equal(answer(100),'+'+matrix[1][3].toFixed(0));
  const mean=group=>group.reduce((s,o)=>s+o.y,0)/group.length;
  assert.equal(mean(obs.filter(o=>o.x[1]))-mean(obs.filter(o=>!o.x[1])),16);
  assert.ok(Math.abs(matrix[2][3]-20)<1e-10);
  for(const q of batch)for(const value of [q.stem,q.why,...q.options])assert.doesNotMatch(value.replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g,''),/\\[()[\]]/);
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
// CRE Set 1 is the default now that it is released, so these Set 2 journeys select Set 2 explicitly.
function useSet2(w,mode){click(w,mode==='full'?'[data-set="2"]':'[data-quiz-set-kind="'+(mode==='focus'?'focus':'quick')+'"][data-quiz-set="2"]');}
function start(w,mode){click(w,'.tb-tile[data-exam="cre"]');useSet2(w,mode);click(w,'#tb-overview [data-mode="'+mode+'"]');return w.__TB.getFeedbackSnapshot();}
function submit(w){const n=w.__TB.getFeedbackSnapshot().records.length;click(w,'[data-goto="'+(n-1)+'"]');click(w,'[data-submit]');}

test('production player uses Set 2, correct pace, fifty-six exhibits, review tools, and immutable score',async()=>{
  const h=await harness(),{w}=h;
  try{
    click(w,'.tb-tile[data-exam="cre"]');
    assert.equal(w.document.querySelector('[data-set="1"]').disabled,false);
    useSet2(w,'full');
    assert.match(w.document.querySelector('#tb-overview').textContent,/100 of 150/);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,10),938);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,20),1876);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,30),2815);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,40),3753);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,50),4691);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,60),5629);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,70),6567);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,80),7505);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,90),8444);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,100),9382);
    click(w,'#tb-overview [data-mode="full"]');
    const snapshot=w.__TB.getFeedbackSnapshot();
    assert.equal(snapshot.records.length,100);
    assert.ok(snapshot.records.every(r=>/^cre:set-2:/.test(r.question.qid)));
    assert.equal(w.document.querySelector('.cre2-explorer'),null);
    assert.equal(w.document.querySelector('.tb-explanation'),null);
    snapshot.records.forEach((r,i)=>{click(w,'[data-goto="'+i+'"]');click(w,'[data-opt="'+r.question.answer+'"]');});
    submit(w);await tick();
    const score=w.document.querySelector('[data-score-result]').textContent;
    assert.match(score,/100\/100/);assert.equal(w.document.querySelector('[data-score-result]').dataset.sessionSet,'2');
    click(w,'[data-open-review="all"]');await tick();
    assert.equal(w.document.querySelectorAll('.tb-review-card').length,100);
    assert.equal(w.document.querySelectorAll('.tb-review-card .cre2-exhibit').length,56);
    assert.equal(w.document.querySelectorAll('.cre2-explorer').length,20);
    assert.equal(w.document.querySelectorAll('.cre2-source strong').length,200);
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
    const high=w.document.querySelector('[data-cre-explorer="mission-high-duration"] input');
    assert.equal(high.closest('details').open,false);
    high.value='0';high.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(high.closest('details').querySelector('output').textContent,/0 h; low stress: 10 h.*0.99501/);
    high.value='10';high.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(high.closest('details').querySelector('output').textContent,/10 h; low stress: 0 h.*0.97045/);
    high.closest('details').querySelector('button').click();assert.equal(high.value,'2');
    assert.match(high.closest('details').querySelector('output').textContent,/0.99005/);
    const cost=w.document.querySelector('[data-cre-explorer="replacement-failure-cost"] input');
    assert.equal(cost.closest('details').open,false);
    for(const [value,best] of [['500','Failure only'],['600','300 h or failure'],['4000','100 h or failure']]){
      cost.value=value;cost.dispatchEvent(new w.Event('input',{bubbles:true}));
      assert.ok(cost.closest('details').querySelector('output').textContent.endsWith('Lowest among these candidates: '+best+'.'));
    }
    cost.closest('details').querySelector('button').click();assert.equal(cost.value,'1000');
    assert.match(cost.closest('details').querySelector('output').textContent,/200 h or failure: \$1.451.*Lowest among these candidates: 200 h or failure/);
    const count=w.document.querySelector('[data-cre-explorer="chi-square-count"] input');
    assert.equal(count.closest('details').open,false);
    for(const [value,statistic,decision] of [['0','21.0526','Reject'],['20','0.0000','Fail to reject'],['60','25.0000','Reject']]){
      count.value=value;count.dispatchEvent(new w.Event('input',{bubbles:true}));
      assert.ok(count.closest('details').querySelector('output').textContent.includes('Chi-square: '+statistic+'. At 1%: '+decision+' independence.'));
    }
    count.closest('details').querySelector('button').click();assert.equal(count.value,'40');
    assert.match(count.closest('details').querySelector('output').textContent,/30.0 failures and 170.0 survivors.*7.8431.*Reject independence/);
    const required=w.document.querySelector('[data-cre-explorer="voting-required"] select');
    assert.equal(required.closest('details').open,false);
    for(const [value,reliability] of [['1','0.97902'],['3','0.71442']]){
      required.value=value;required.dispatchEvent(new w.Event('change',{bubbles:true}));
      assert.ok(required.closest('details').querySelector('output').textContent.includes('system reliability '+reliability));
      assert.match(required.closest('details').querySelector('svg').textContent,new RegExp('at least '+value+' of 3 required'));
    }
    required.closest('details').querySelector('button').click();assert.equal(required.value,'2');
    assert.match(required.closest('details').querySelector('output').textContent,/0.97200.*0.95256/);
    const stress=w.document.querySelector('[data-cre-explorer="fatigue-stress"] input');
    assert.equal(stress.closest('details').open,false);
    for(const [value,cycles] of [['60','64,000'],['120','8,000']]){
      stress.value=value;stress.dispatchEvent(new w.Event('input',{bubbles:true}));
      assert.ok(stress.closest('details').querySelector('output').textContent.includes('median life: '+cycles+' cycles'));
    }
    stress.closest('details').querySelector('button').click();assert.equal(stress.value,'80');
    assert.match(stress.closest('details').querySelector('output').textContent,/27,000 cycles/);
    const coverage=w.document.querySelector('[data-cre-explorer="standby-coverage"] select');
    assert.equal(coverage.closest('details').open,false);
    for(const [value,reliability] of [['0','0.81873'],['0.5','0.90060'],['1','0.98248']]){
      coverage.value=value;coverage.dispatchEvent(new w.Event('change',{bubbles:true}));
      assert.ok(coverage.closest('details').querySelector('output').textContent.includes('Total mission reliability: '+reliability));
    }
    coverage.closest('details').querySelector('button').click();assert.equal(coverage.value,'0.9');
    assert.match(coverage.closest('details').querySelector('output').textContent,/0.81873.*0.14737.*0.96610/);
    const age=w.document.querySelector('[data-cre-explorer="density-age"] input');
    assert.equal(age.closest('details').open,false);
    for(const [value,cdf,survival,hazard] of [['200','0.0100','0.9900','0.000101'],['1800','0.8100','0.1900','0.004737']]){
      age.value=value;age.dispatchEvent(new w.Event('input',{bubbles:true}));
      const output=age.closest('details').querySelector('output').textContent;
      assert.ok(output.includes('Cumulative failure probability: '+cdf));assert.ok(output.includes('Survival probability: '+survival));assert.ok(output.includes('Instantaneous hazard: '+hazard));
    }
    age.closest('details').querySelector('button').click();assert.equal(age.value,'1500');
    assert.match(age.closest('details').querySelector('output').textContent,/0.5625.*0.4375.*0.001714/);
    const interval=w.document.querySelector('[data-cre-explorer="inspection-interval"] input');
    assert.equal(interval.closest('details').open,false);
    for(const [value,probability] of [['4','100.0%'],['8','100.0%'],['20','40.0%']]){
      interval.value=value;interval.dispatchEvent(new w.Event('input',{bubbles:true}));
      assert.ok(interval.closest('details').querySelector('output').textContent.endsWith('Probability of timely completed intervention: '+probability+'.'));
    }
    interval.closest('details').querySelector('button').click();assert.equal(interval.value,'10');
    assert.match(interval.closest('details').querySelector('output').textContent,/80.0%/);
    const ratio=w.document.querySelector('[data-cre-explorer="cox-hazard-ratio"] input');
    assert.equal(ratio.closest('details').open,false);
    for(const [value,survival,failure] of [['0.25','0.9457','0.0543'],['1','0.8000','0.2000'],['2','0.6400','0.3600']]){
      ratio.value=value;ratio.dispatchEvent(new w.Event('input',{bubbles:true}));
      const output=ratio.closest('details').querySelector('output').textContent;
      assert.ok(output.includes('Predicted survival at 1,000 h: '+survival));assert.ok(output.includes('Cumulative failure probability: '+failure));
    }
    ratio.closest('details').querySelector('button').click();assert.equal(ratio.value,'0.5');
    assert.match(ratio.closest('details').querySelector('output').textContent,/0.8944.*0.1056/);
    const proof=w.document.querySelector('[data-cre-explorer="proof-test-interval"] select');
    assert.equal(proof.closest('details').open,false);
    for(const [value,average,end] of [['250','0.2496','0.4988'],['1000','0.9934','1.9801'],['2000','1.9736','3.9211']]){
      proof.value=value;proof.dispatchEvent(new w.Event('change',{bubbles:true}));
      const output=proof.closest('details').querySelector('output').textContent;
      assert.ok(output.includes('Average hidden-failure unavailability: '+average+'%'));assert.ok(output.includes('Immediately before testing: '+end+'%'));
    }
    proof.closest('details').querySelector('button').click();assert.equal(proof.value,'500');
    assert.match(proof.closest('details').querySelector('output').textContent,/0.4983%.*0.9950%/);
    const shared=w.document.querySelector('[data-cre-explorer="load-sharing-rate"] select');
    assert.equal(shared.closest('details').open,false);
    for(const [value,expected] of [['1','0.9909'],['2','0.9825'],['6','0.9537']]){shared.value=value;shared.dispatchEvent(new w.Event('change',{bubbles:true}));assert.ok(shared.closest('details').querySelector('output').textContent.includes('System reliability at 100 h: '+expected));}
    shared.closest('details').querySelector('button').click();assert.equal(shared.value,'4');assert.match(shared.closest('details').querySelector('output').textContent,/0.9671/);
    const shift=w.document.querySelector('[data-cre-explorer="block-shift"] input');
    assert.equal(shift.closest('details').open,false);
    for(const [value,expected] of [['0','6.0'],['40','26.0']]){shift.value=value;shift.dispatchEvent(new w.Event('input',{bubbles:true}));const out=shift.closest('details').querySelector('output').textContent;assert.ok(out.includes('Block-adjusted B minus A: +6.0'));assert.ok(out.includes('Unadjusted B minus A: +'+expected));}
    shift.closest('details').querySelector('button').click();assert.equal(shift.value,'20');assert.match(shift.closest('details').querySelector('output').textContent,/Unadjusted B minus A: \+16.0/);
    assert.equal(JSON.stringify(w.CRE_SET2),baseline);
    assert.equal(w.document.querySelector('[data-score-result]').textContent,score);
    // The concurrently merged Set 3 stays selectable and uses only its own bank.
    const thirdBefore=JSON.stringify(w.CRE_SET3);
    click(w,'[data-back]');click(w,'[data-set="3"]');click(w,'#tb-overview [data-mode="full"]');
    const third=w.__TB.getFeedbackSnapshot();
    assert.equal(third.records.length,165);
    assert.ok(third.records.every(r=>r.question.qid.startsWith('cre:set-3:')));
    assert.equal(JSON.stringify(w.CRE_SET3),thirdBefore);
    submit(w);await tick();
    click(w,'[data-back]');click(w,'[data-set="1"]');click(w,'#tb-overview [data-mode="full"]');
    const first=w.__TB.getFeedbackSnapshot();
    assert.equal(first.records.length,30);assert.ok(first.records.every(r=>r.question.qid.startsWith('cre:set-1:')));
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
    useSet2(w,'focus');
    const area=w.document.querySelector('[data-focusdom]');area.value='cre-fundamentals';area.dispatchEvent(new w.Event('change',{bubbles:true}));
    click(w,'#tb-overview [data-mode="focus"]');
    assert.equal(w.__TB.getFeedbackSnapshot().records.length,19);
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

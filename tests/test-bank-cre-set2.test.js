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
// Each student audit explicitly revises only fields in its exact-value ledger.
// Reversing those exact edits preserves every historical batch hash below.
function preAuditSnapshot(qs) {
  const snapshot = JSON.parse(JSON.stringify(qs));
  const secondAudit = JSON.parse(read('docs/audits/cre-set2-audit-round2-revisions.json'));
  const secondSeen = new Set();
  for (const r of secondAudit.revisions) {
    assert.ok(['stem','options','why'].includes(r.field));
    const id = [r.number,r.field,r.option].join(':');
    assert.ok(!secondSeen.has(id)); secondSeen.add(id);
    const q = snapshot[r.number-1];
    if (r.field === 'options') {
      assert.equal(q.options[r.option], r.after, id + ' matches the second audit');
      q.options[r.option] = r.before;
    } else {
      assert.equal(q[r.field], r.after, id + ' matches the second audit');
      q[r.field] = r.before;
    }
  }
  assert.equal(createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'), secondAudit.baselineItemsSha256, 'second audit preserves every unlisted field');
  const {revisions} = JSON.parse(read('docs/audits/cre-set2-final-audit-revisions.json'));
  const seen = new Set();
  for (const r of revisions) {
    assert.ok(['options','why'].includes(r.field));
    const id = [r.number,r.field,r.option].join(':');
    assert.ok(!seen.has(id)); seen.add(id);
    const q = snapshot[r.number-1];
    if (r.field === 'options') {
      assert.equal(q.options[r.option], r.after, id + ' matches the reviewed correction');
      q.options[r.option] = r.before;
    } else {
      assert.equal(q.why, r.after, id + ' matches the reviewed correction');
      q.why = r.before;
    }
  }
  assert.equal(createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'), 'c9a3b4b1d687f6d41c0a33742874b844687e4ca3b17a486a30451397f75f7a3c', 'all 150 baseline objects remain locked except the exact documented edits');
  return snapshot;
}

test('final audit: all explanation formulas and prose survive HTML insertion', () => {
  const dom = new JSDOM('<main></main>'), root = dom.window.document.querySelector('main');
  try {
    for (const q of bank().CRE_SET2) {
      root.innerHTML = q.why;
      for (const el of root.querySelectorAll('*')) assert.ok(['P','STRONG','EM','B','UL','OL','LI','BR'].includes(el.tagName), q.qid + ': unexpected HTML element ' + el.tagName);
      const formulas = q.why.match(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g) || [];
      for (const formula of formulas) assert.ok(root.textContent.includes(formula), q.qid + ': formula lost during HTML parsing: ' + formula);
    }
    root.innerHTML = bank().CRE_SET2[25].why;
    assert.match(root.textContent, /That is interval censoring\. Recording either/);
  } finally { dom.window.close(); }
});

test('final audit: graph annotations stay outside data lines and parameter labels fit their boxes', () => {
  const dom = new JSDOM('<main></main>', {runScripts:'outside-only'}), w = dom.window;
  try {
    w.eval(read('test-bank-cre-set2.js')); w.eval(read('test-bank-cre-set2-ui.js'));
    const root = w.document.querySelector('main');
    root.innerHTML = w.__CRESet2UI.exhibit(w.CRE_SET2[17]);
    for (const label of ['Current test point','Conditional forecast']) {
      const el = Array.from(root.querySelectorAll('svg text')).find(t => t.textContent === label);
      assert.ok(el && Number(el.getAttribute('y')) > 365, label + ' belongs in the separate legend');
    }
    root.innerHTML = w.__CRESet2UI.exhibit(w.CRE_SET2[32]);
    assert.ok(!Array.from(root.querySelectorAll('svg text')).some(t => t.textContent === 'Required flow command'), 'wrap the signal label rather than touching the border');
    root.innerHTML = '<article class="tb-review-card"><div data-cre-question="cre:set-2:037"></div><div class="tb-explanation"></div></article>';
    w.document.dispatchEvent(new w.CustomEvent('tb:review-rendered',{detail:{root}}));
    for (const el of root.querySelectorAll('svg text')) if (/^(Accept|Reject) at/.test(el.textContent)) assert.ok(Number(el.getAttribute('y')) > 365, 'decision-boundary labels must clear the likelihood line');
  } finally { w.close(); }
});

for (const [number, labelPattern] of [[6, /^[AB]: shape/], [150, /^F = /]]) {
  test('second audit: Q'+number+' review annotations clear vertical markers at every setting', () => {
    const dom = new JSDOM('<main></main>', {runScripts:'outside-only'}), w = dom.window;
    try {
      w.eval(read('test-bank-cre-set2.js')); w.eval(read('test-bank-cre-set2-ui.js'));
      const q = w.CRE_SET2[number-1], root = w.document.querySelector('main');
      root.innerHTML = '<article class="tb-review-card"><div data-cre-question="'+q.qid+'"></div><div class="tb-explanation"></div></article>';
      w.document.dispatchEvent(new w.CustomEvent('tb:review-rendered',{detail:{root}}));
      const control = root.querySelector('select,input');
      const values = control.tagName === 'SELECT' ? Array.from(control.options, o => o.value)
        : Array.from({length:1+(Number(control.max)-Number(control.min))/Number(control.step)}, (_,i) => String(Number(control.min)+i*Number(control.step)));
      for (const value of values) {
        control.value = value; control.dispatchEvent(new w.Event(control.tagName === 'SELECT' ? 'change' : 'input', {bubbles:true}));
        const marker = root.querySelector(number === 6 ? 'line.cre2-mission' : 'line[stroke-dasharray]');
        const top = Number(marker.getAttribute('y1')), bottom = Number(marker.getAttribute('y2'));
        const labels = Array.from(root.querySelectorAll('svg text')).filter(t => labelPattern.test(t.textContent));
        assert.equal(labels.length, number === 6 ? 2 : 1);
        for (const label of labels) {
          const baseline = Number(label.getAttribute('y'));
          assert.ok(baseline + 4 < top || baseline - 16 > bottom, q.qid+' at '+value+': annotations must stay outside the marker sweep');
        }
      }
    } finally { w.close(); }
  });
}

test('final audit: all review controls produce finite, accessible results at every setting and reset without changing the bank', () => {
  const dom = new JSDOM('<main></main>', {runScripts:'outside-only'}), w = dom.window;
  try {
    w.eval(read('test-bank-cre-set2.js')); w.eval(read('test-bank-cre-set2-ui.js'));
    const baseline = JSON.stringify(w.CRE_SET2), root = w.document.querySelector('main');
    for (const q of w.CRE_SET2.filter(q => q.explorer)) {
      root.innerHTML = '<article class="tb-review-card"><div data-cre-question="'+q.qid+'"></div><div class="tb-explanation"></div></article>';
      w.document.dispatchEvent(new w.CustomEvent('tb:review-rendered',{detail:{root}}));
      const details = root.querySelector('details'), control = details.querySelector('select,input');
      assert.equal(details.open, false, q.qid + ' exploration starts collapsed');
      const initial = control.value, output = details.querySelector('output'), initialOutput = output.textContent;
      const values = control.tagName === 'SELECT' ? Array.from(control.options, o => o.value)
        : Array.from({length:1+(Number(control.max)-Number(control.min))/Number(control.step)}, (_,i) => String(Number(control.min)+i*Number(control.step)));
      for (const value of values) {
        control.value = value; control.dispatchEvent(new w.Event(control.tagName === 'SELECT' ? 'change' : 'input', {bubbles:true}));
        assert.ok(output.textContent.trim(), q.qid + ': nonempty result');
        assert.doesNotMatch(output.textContent, /NaN|Infinity|undefined/, q.qid);
        for (const svg of details.querySelectorAll('svg')) {
          assert.ok(svg.querySelector('title')?.textContent && svg.querySelector('desc')?.textContent, q.qid + ': accessible plot');
          assert.doesNotMatch(svg.outerHTML, /NaN|Infinity|undefined/, q.qid + ': finite plot geometry');
        }
        assert.equal(JSON.stringify(w.CRE_SET2), baseline, q.qid + ': exploration preserves question data');
      }
      details.querySelector('[data-cre-reset]').click();
      assert.equal(control.value, initial, q.qid + ': reset value');
      assert.equal(output.textContent, initialOutput, q.qid + ': reset result');
    }
  } finally { w.close(); }
});

test('batch contract: stable IDs, current BoK weights, complete feedback, eighty-eight exhibits, valid lesson anchors', () => {
  const {CRE_SET2: qs, registerCRESet2} = bank();
  const releasedQs = preAuditSnapshot(qs);
  assert.equal(qs.length, 150);
  const exam = {bok: [], bank: []}, dm = {};
  registerCRESet2(exam, dm);
  assert.deepEqual(Array.from(exam.bok, d => d.weight), [29,25,35,35,26]);
  assert.equal(exam.questions, 165); assert.equal(exam.minutes, 258);
  assert.equal(qs.filter(q => q.chart).length, 88);
  assert.equal(qs.filter(q => q.chart?.creKind).length, 45);
  assert.equal(qs.filter(q => q.explorer).length, 30);
  assert.deepEqual(Array.from(exam.bok, d => qs.filter(q => q.sub === d.domain).length), [29,25,35,35,26]);
  assert.deepEqual([0,1,2,3].map(key => qs.filter(q => q.answer === key).length), [37,38,37,38]);
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,20))).digest('hex'), '488de3d62f6ba40533c7f4bbfa30ccba24492571571d06c08cdd8de328b29efc', 'Batches 1–2 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,30))).digest('hex'), '1d58917f68fcb88dd4fe42568d6e50394789e0cab74c16719108b1ff3841921b', 'Batches 1–3 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,40))).digest('hex'), '673070d6340dfe526539b3be6fbaaf14cf4b0ebfd26ea0ed9a6d707808b9c070', 'Batches 1–4 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,50))).digest('hex'), '459d6748c2fa8f96f2f4737e0d42ad6f0c2cfb7f4c73574c947417c1007b280c', 'Batches 1–5 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,60))).digest('hex'), '0a514798a814ec13ce0d7b8e993da2a44c4aedb370d1211f1002eae3ea7c8d6e', 'Batches 1–6 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,70))).digest('hex'), '26de7da93287a6dc411fce15f3a62364d611f677e49a2f043fec26c207bb8db8', 'Batches 1–7 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,100))).digest('hex'), '861b65a47721a56a80f3e230b46bcae420448de656a1d22dbceefc7c9ad7c961', 'Batches 1–10 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,110))).digest('hex'), 'b1d8f74c16af70f2efa1e6d6b8d4d90f0457d49a351225d1ebec86c59d706af4', 'Batches 1–11 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,120))).digest('hex'), '0abf3a2b710b5d0928718160c1626c71cac986cb23bd5c0523343d785b09b588', 'Batches 1–12 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,130))).digest('hex'), 'f13d2e43b0431b0150e8393b508a569cf5db93f53624a133425dda16c664764e', 'Batches 1–13 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,140))).digest('hex'), '6de2b1654e0e8618eabbfeb1a2077dcde1bf774b52ba9277253575898e4934ca', 'Batches 1–14 content is unchanged except exact documented final-audit edits');
  const released = JSON.stringify(releasedQs.slice(0,10));
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,90))).digest('hex'), '3aa3b10d998f5c30c1b0befb8e15d0c3548f9aeeb9f6573495d0b2facc20fbfa', 'Batches 1–9 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(JSON.stringify(releasedQs.slice(0,80))).digest('hex'), '0306b7d9d873b1efcdf7c169be1d620e547b7e91611c32501156443557421bb6', 'Batches 1–8 content is unchanged except exact documented final-audit edits');
  assert.equal(createHash('sha256').update(released).digest('hex'), '2c2657dfb7ae76f3c0b9385c7b1be36e122e143a0372e4de82fabb097b50f6f1', 'released Batch 1 content is unchanged except exact documented final-audit edits');
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
  assert.equal(exam.sets[2].length, 150);
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
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer],batch=Array.from(qs.slice(90,100));
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

test('production player uses Set 2, correct pace, eighty-eight exhibits, review tools, and immutable score',async()=>{
  const h=await harness(),{w}=h;
  try{
    click(w,'.tb-tile[data-exam="cre"]');
    assert.equal(w.document.querySelector('[data-set="1"]').disabled,false);
    useSet2(w,'full');
    assert.match(w.document.querySelector('#tb-overview').textContent,/150-question Set 2 core is complete/);
    assert.doesNotMatch(w.document.querySelector('#tb-overview').textContent,/This is a partial practice set/);
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
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,110),10320);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,120),11258);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,130),12196);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,140),13135);
    assert.equal(w.__TB.quizDurationSeconds(w.__TB.EXAMS.cre,150),14073);
    click(w,'#tb-overview [data-mode="full"]');
    const snapshot=w.__TB.getFeedbackSnapshot();
    assert.equal(snapshot.records.length,150);
    assert.ok(snapshot.records.every(r=>/^cre:set-2:/.test(r.question.qid)));
    assert.equal(w.document.querySelector('.cre2-explorer'),null);
    assert.equal(w.document.querySelector('.tb-explanation'),null);
    snapshot.records.forEach((r,i)=>{click(w,'[data-goto="'+i+'"]');click(w,'[data-opt="'+r.question.answer+'"]');});
    submit(w);await tick();
    const score=w.document.querySelector('[data-score-result]').textContent;
    assert.match(score,/150\/150/);assert.equal(w.document.querySelector('[data-score-result]').dataset.sessionSet,'2');
    click(w,'[data-open-review="all"]');await tick();
    assert.equal(w.document.querySelectorAll('.tb-review-card').length,150);
    assert.equal(w.document.querySelectorAll('.tb-review-card .cre2-exhibit').length,88);
    assert.equal(w.document.querySelectorAll('.cre2-explorer').length,30);
    assert.equal(w.document.querySelectorAll('.cre2-source strong').length,300);
    const censoringCard = w.document.querySelector('[data-cre-question="cre:set-2:026"]').closest('.tb-review-card');
    assert.match(censoringCard.querySelector('.tb-explanation').textContent, /That is interval censoring\. Recording either/);
    assert.ok(censoringCard.querySelector('.tb-explanation').textContent.includes('120\\lt T_X\\le160'));
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
    const exposure=w.document.querySelector('[data-cre-explorer="event-exposure"] select');
    assert.equal(exposure.closest('details').open,false);
    for(const [value,limit,decision] of [['250','10.485','Not above'],['500','8.000','Not above'],['2000','5.000','Above']]){exposure.value=value;exposure.dispatchEvent(new w.Event('change',{bubbles:true}));const out=exposure.closest('details').querySelector('output').textContent;assert.ok(out.includes('Upper limit: '+limit));assert.ok(out.includes(decision+' upper limit.'));}
    exposure.closest('details').querySelector('button').click();assert.equal(exposure.value,'1000');assert.match(exposure.closest('details').querySelector('output').textContent,/6.243.*Above/);
    const thermal=w.document.querySelector('[data-cre-explorer="thermal-range"] input');
    assert.equal(thermal.closest('details').open,false);
    for(const [value,life] of [['45','36,000'],['90','9,000']]){thermal.value=value;thermal.dispatchEvent(new w.Event('input',{bubbles:true}));assert.ok(thermal.closest('details').querySelector('output').textContent.includes('Predicted median life: '+life+' cycles'));}
    thermal.closest('details').querySelector('button').click();assert.equal(thermal.value,'60');assert.match(thermal.closest('details').querySelector('output').textContent,/20,250/);
    const intervention=w.document.querySelector('[data-cre-explorer="fault-intervention"] select');
    assert.equal(intervention.closest('details').open,false);
    for(const [value,probability,reduction] of [['2','0.0980','0.0180'],['3','0.0880','0.0280']]){intervention.value=value;intervention.dispatchEvent(new w.Event('change',{bubbles:true}));const out=intervention.closest('details').querySelector('output').textContent;assert.ok(out.includes('Top-event probability: '+probability));assert.ok(out.includes('Absolute reduction from 0.1160: '+reduction));}
    intervention.closest('details').querySelector('button').click();assert.equal(intervention.value,'1');assert.match(intervention.closest('details').querySelector('output').textContent,/probability: 0.0580.*reduction from 0.1160: 0.0580/);
    const histogram=w.document.querySelector('[data-cre-explorer="histogram-scale"] select');
    assert.equal(histogram.closest('details').open,false);
    histogram.value='0';histogram.dispatchEvent(new w.Event('change',{bubbles:true}));assert.match(histogram.closest('details').querySelector('output').textContent,/1,200, 3,600, 9,000 count-hours/);
    histogram.closest('details').querySelector('button').click();assert.equal(histogram.value,'1');assert.match(histogram.closest('details').querySelector('output').textContent,/Bar areas: 0.20, 0.30, 0.50; total area: 1.00/);
    const shock=w.document.querySelector('[data-cre-explorer="common-shock"] select');
    assert.equal(shock.closest('details').open,false);
    for(const [value,joint,marginalProduct] of [['0','0.010000','0.010000'],['0.05','0.059500','0.021025'],['0.10','0.109000','0.036100']]){shock.value=value;shock.dispatchEvent(new w.Event('change',{bubbles:true}));const out=shock.closest('details').querySelector('output').textContent;assert.ok(out.includes('both channels fail: '+joint));assert.ok(out.includes('Product of marginals: '+marginalProduct));}
    shock.closest('details').querySelector('button').click();assert.equal(shock.value,'0.02');assert.match(shock.closest('details').querySelector('output').textContent,/0.029800.*0.013924/);
    const bridge=w.document.querySelector('[data-cre-explorer="bridge-reliability"] select');
    assert.equal(bridge.closest('details').open,false);
    for(const [value,reliability] of [['0','0.96390'],['0.50','0.97200'],['1','0.98010']]){bridge.value=value;bridge.dispatchEvent(new w.Event('change',{bubbles:true}));assert.ok(bridge.closest('details').querySelector('output').textContent.includes('Network reliability: '+reliability));}
    bridge.closest('details').querySelector('button').click();assert.equal(bridge.value,'0.80');assert.match(bridge.closest('details').querySelector('output').textContent,/Network reliability: 0.97686/);
    const mixture=w.document.querySelector('[data-cre-explorer="fleet-mixture"] select');
    assert.equal(mixture.closest('details').open,false);
    for(const [value,estimate] of [['0.10','2.8%'],['0.50','6.0%'],['0.80','8.4%']]){mixture.value=value;mixture.dispatchEvent(new w.Event('change',{bubbles:true}));const out=mixture.closest('details').querySelector('output').textContent;assert.ok(out.includes('Weighted mission failure estimate: '+estimate));assert.ok(out.includes('pooled sample estimate: 6.0%'));}
    mixture.closest('details').querySelector('button').click();assert.equal(mixture.value,'0.20');assert.match(mixture.closest('details').querySelector('output').textContent,/Weighted mission failure estimate: 3.6%/);
    const soa=w.document.querySelector('[data-cre-explorer="soa-duration"] select');
    assert.equal(soa.closest('details').open,false);
    soa.value='1';soa.dispatchEvent(new w.Event('change',{bubbles:true}));assert.match(soa.closest('details').querySelector('output').textContent,/below the 5.0 A.*inside the supplied single-pulse SOA/);assert.match(soa.closest('details').querySelector('svg').textContent,/Review scenario: one 10 ms rectangular pulse/);
    soa.closest('details').querySelector('button').click();assert.equal(soa.value,'0');assert.match(soa.closest('details').querySelector('output').textContent,/exceeds the 1.5 A.*outside the supplied DC SOA/);assert.match(soa.closest('details').querySelector('svg').textContent,/Review scenario: continuous DC operation/);
    const dormancy=w.document.querySelector('[data-cre-explorer="standby-dormancy"] select');
    assert.equal(dormancy.closest('details').open,false);
    for(const [value,reliability] of [['0','0.9098'],['3','0.8685'],['5','0.8452']]){dormancy.value=value;dormancy.dispatchEvent(new w.Event('change',{bubbles:true}));assert.ok(dormancy.closest('details').querySelector('output').textContent.includes('Mission reliability: '+reliability));}
    dormancy.closest('details').querySelector('button').click();assert.equal(dormancy.value,'1');assert.match(dormancy.closest('details').querySelector('output').textContent,/Mission reliability: 0.8951/);
    const anova=w.document.querySelector('[data-cre-explorer="anova-error"] select');
    assert.equal(anova.closest('details').open,false);
    for(const [value,mse,f,decision] of [['12','1.50','32.00','Reject no interaction.'],['80','10.00','4.80','Fail to reject no interaction'],['120','15.00','3.20','Fail to reject no interaction']]){anova.value=value;anova.dispatchEvent(new w.Event('change',{bubbles:true}));const out=anova.closest('details').querySelector('output').textContent;assert.ok(out.includes('Error mean square: '+mse+'. Interaction F: '+f));assert.ok(out.includes(decision));assert.ok(anova.closest('details').querySelector('svg').textContent.includes('F = '+f));}
    anova.closest('details').querySelector('button').click();assert.equal(anova.value,'24');assert.match(anova.closest('details').querySelector('output').textContent,/Interaction F: 16.00.*Reject no interaction/);
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
    assert.equal(first.records.length,w.CRE_SET1.length,'Set 1 Full Exam serves every released Set 1 question');assert.ok(first.records.every(r=>r.question.qid.startsWith('cre:set-1:')));
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
    assert.equal(w.__TB.getFeedbackSnapshot().records.length,20);
    assert.ok(w.__TB.getFeedbackSnapshot().records.every(r=>r.question.qid.startsWith('cre:set-2:')));
    assert.deepEqual(h.errors,[]);
  }finally{h.close();}
});

test('answer reveal preserves the censoring inequality and records the revealed item as incorrect',async()=>{
  const h=await harness(),{w}=h;
  try{
    click(w,'.tb-tile[data-exam="cre"]');useSet2(w,'full');
    click(w,'[data-timing-kind="full"][data-timed="0"]');
    click(w,'#tb-overview [data-mode="full"]');
    const snap=w.__TB.getFeedbackSnapshot();
    const i=snap.records.findIndex(r=>r.question.qid==='cre:set-2:026');
    assert.ok(i>=0);
    click(w,'[data-goto="'+i+'"]');click(w,'[data-reveal]');await tick();
    const working=w.document.querySelector('#tb-revealed-answer');
    assert.ok(working);assert.ok(h.typesetRoots.includes(working));
    assert.match(working.textContent, /That is interval censoring\. Recording either/);
    assert.ok(working.textContent.includes('120\\lt T_X\\le160'));
    assert.equal(working.querySelector('.cre2-explorer'),null);
    submit(w);await tick();
    assert.match(w.document.querySelector('[data-score-result]').textContent,/0\/150/);
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


test('Batch 11 independently verifies event classes, Poisson moments, B10 probability, and thermal-cycle scaling',()=>{
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer];
  const events=qs[100].chart.rows,critical=events.find(r=>r[0]==='Critical failures')[1];
  assert.equal(answer(101),(24000/critical).toLocaleString('en-US')+' h');
  assert.equal(qs[100].options[0],(24000/(events[0][1]+events[1][1])).toLocaleString('en-US')+' h');
  assert.equal(qs[100].options[2],(24000/events[1][1]).toLocaleString('en-US')+' h');
  assert.equal(qs[100].options[3],(24000/events.reduce((s,r)=>s+r[1],0)).toLocaleString('en-US')+' h');
  // Enumerate Poisson masses; recover count mean/variance before standardizing the observed rate.
  const signals=[];
  for(const [period,hours,count] of qs[103].chart.rows){
    const expected=hours*.002;let mass=Math.exp(-expected),sum=0,first=0,second=0;
    for(let k=0;k<100;k++){if(k)mass*=expected/k;sum+=mass;first+=k*mass;second+=k*k*mass;}
    assert.ok(Math.abs(sum-1)<1e-12);
    const variance=second-first*first,z=(count-first)/Math.sqrt(variance);
    if(z>3)signals.push(period);
  }
  assert.deepEqual(signals,[1]);assert.equal(answer(104),'Period 1 only');
  // Integrate the density in log-time space and solve for its tenth percentile, independently of the supplied z.
  function cumulative(t){const hi=Math.log(t),lo=Math.log(2000)-9*.4,n=20000,dx=(hi-lo)/n;let sum=0;for(let i=0;i<n;i++){const x=lo+(i+.5)*dx;sum+=Math.exp(-.5*((x-Math.log(2000))/.4)**2)/(.4*Math.sqrt(2*Math.PI))*dx;}return sum;}
  let lo=500,hi=2000;for(let i=0;i<35;i++){const mid=(lo+hi)/2;if(cumulative(mid)<.1)lo=mid;else hi=mid;}
  assert.equal(answer(105),Math.round(hi).toLocaleString('en-US')+' h');
  assert.ok(Math.abs(cumulative(3339)-.9)<.0001);assert.equal(qs[104].options[3],Math.round(2000*Math.exp(.08)).toLocaleString('en-US')+' h');
  // Constant model value reconstructed from Profile A, then integer search for Profile B cycles.
  const ranges=qs[106].chart.rows.map(([,low,high])=>high-low),constant=9000*ranges[0]*ranges[0];
  let cycles=0;while((cycles+1)*ranges[1]*ranges[1]<=constant)cycles++;
  assert.equal(answer(107),cycles.toLocaleString('en-US')+' cycles');assert.equal(cycles,20250);
  assert.equal(qs[106].options[0],(9000*(ranges[1]/ranges[0])**2).toLocaleString('en-US')+' cycles');
  for(const [range,expected] of [[45,36000],[60,20250],[90,9000]])assert.equal(expected*range*range,constant);
});


test('Batch 12 independently verifies availability cycles, intervention states, chi-square bounds, histogram areas, and NHPP increments',()=>{
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer],batch=Array.from(qs.slice(110,120));
  assert.equal(batch.filter(q=>q.quantitative).length,4);
  assert.deepEqual(['Foundational','Moderate','Challenging'].map(d=>batch.filter(q=>q.difficulty===d).length),[1,6,3]);
  // Build 100 restoration cycles and separate active restoration from logistics delay.
  const [operating,active,delay]=qs[111].chart.rows.map(r=>r[1]);let up=0,corrective=0,logistics=0;
  for(let cycle=0;cycle<100;cycle++){up+=operating;corrective+=active;logistics+=delay;}
  assert.equal(answer(112),(100*up/(up+corrective)).toFixed(2)+'%');
  assert.equal(qs[111].options[1],(100*up/(up+corrective+logistics)).toFixed(2)+'%');
  assert.equal(qs[111].options[2],(100*up/(up+logistics)).toFixed(2)+'%');
  assert.equal(qs[111].options[3],(100*corrective/(up+corrective)).toFixed(2)+'%');
  // Enumerate all eight basic-event combinations for the baseline and each intervention.
  const original=Array.from(qs[113].chart.rows,r=>Number(r[1]));
  const probability=target=>{const p=original.map((v,i)=>i===target?v/2:v);let result=0;for(let mask=0;mask<8;mask++){const on=[0,1,2].map(i=>Boolean(mask&(1<<i)));if(on[0]&&(on[1]||on[2]))result+=on.reduce((v,state,i)=>v*(state?p[i]:1-p[i]),1);}return result;};
  const baseline=probability(-1),after=[0,1,2].map(probability),reductions=after.map(p=>baseline-p);
  assert.equal(baseline.toFixed(4),'0.1160');assert.deepEqual(after.map(p=>p.toFixed(4)),['0.0580','0.0980','0.0880']);
  assert.deepEqual(reductions.map(p=>p.toFixed(4)),['0.0580','0.0180','0.0280']);assert.match(answer(114),/Halve A/);
  // Integrate the chi-square density and invert the pivot coverage rather than copying the displayed bound formula.
  let gamma=Math.sqrt(Math.PI);for(let i=0;i<7;i++)gamma*=i+.5;
  function cdf(x){const n=20000,dx=x/n;let sum=0;for(let i=0;i<n;i++){const t=(i+.5)*dx;sum+=t**6.5*Math.exp(-t/2)/(2**7.5*gamma)*dx;}return sum;}
  for(const [,p,x] of qs[114].chart.rows)assert.ok(Math.abs(cdf(Number(x))-Number(p))<.00002);
  let low=1,high=5;for(let i=0;i<40;i++){const mid=(low+high)/2;if(1-cdf(60/(mid*mid))<.95)low=mid;else high=mid;}
  assert.equal(answer(115),high.toFixed(2)+' h');assert.equal(qs[114].options[0],Math.sqrt(60/24.996).toFixed(2)+' h');assert.equal(qs[114].options[1],(60/7.261).toFixed(2)+' h');assert.equal(qs[114].options[3],(2/Math.sqrt(16)).toFixed(2)+' h');
  // Integrate each piecewise-constant density numerically and preserve the grouped sample fractions.
  const counts=qs[115].chart.rows.map(r=>r[2]),total=counts.reduce((a,b)=>a+b,0),areas=[];
  qs[115].chart.rows.forEach(([,width,count])=>{const density=count/(total*width);let area=0;for(let i=0;i<1000;i++)area+=density*width/1000;areas.push(area);});
  assert.deepEqual(Array.from(areas,a=>a.toFixed(2)),['0.20','0.30','0.50']);assert.ok(Math.abs(areas.reduce((a,b)=>a+b,0)-1)<1e-12);assert.match(answer(116),/by 60 and by that interval/);
  // Numerically integrate event intensity over the future interval; compare constant-rate distractors.
  const dt=12500/100000;let intensityIntegral=0;for(let i=0;i<100000;i++)intensityIntegral+=.01/Math.sqrt(10000+(i+.5)*dt)*dt;
  assert.ok(Math.abs(intensityIntegral-1)<1e-10);assert.equal(answer(117),Math.exp(-intensityIntegral).toFixed(4));
  assert.equal(qs[116].options[0],Math.exp(-3).toFixed(4));assert.equal(qs[116].options[1],Math.exp(-.0001*12500).toFixed(4));assert.equal(qs[116].options[2],Math.exp(-(2/10000)*12500).toFixed(4));
  qs[116].chart.rows.forEach(([t,m])=>assert.ok(Math.abs(.02*Math.sqrt(t)-Number(m))<1e-12));
  // A run-level assignment remains the replicate even when more observations are nested inside it.
  for(const temperature of [80,120]){const runs=qs[118].chart.rows.filter(r=>r[1]===temperature);assert.equal(runs.length,2);assert.equal(runs.reduce((sum,r)=>sum+r[2]*r[3],0),24);}
  for(const q of batch)for(const value of [q.stem,q.why,...q.options])assert.doesNotMatch(value.replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g,''),/\\[()[\]]/);
});


test('Batch 13 verifies weighted maintenance, common shocks, censored likelihood, EWMA history, and bridge connectivity independently',()=>{
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer],batch=Array.from(qs.slice(120,130));
  assert.equal(batch.filter(q=>q.quantitative).length,5);
  assert.deepEqual(['Foundational','Moderate','Challenging'].map(d=>batch.filter(q=>q.difficulty===d).length),[1,6,3]);
  // Expand individual maintenance actions rather than averaging category means.
  const actions=Array.from(qs[121].chart.rows).flatMap(([kind,count,hours])=>Array.from({length:count},()=>({kind,hours})));
  const active=actions.reduce((t,a)=>t+a.hours,0),corrective=actions.filter(a=>a.kind==='Corrective').reduce((t,a)=>t+a.hours,0);
  assert.equal(answer(122),(100*480/(480+active)).toFixed(2)+'%');
  assert.equal(qs[121].options[0],(100*480/(480+active+84)).toFixed(2)+'%');
  assert.equal(qs[121].options[2],(100*480/(480+corrective)).toFixed(2)+'%');
  assert.equal(qs[121].options[3],(100*480/(480+actions.length*(6+1.5)/2)).toFixed(2)+'%');
  // Construct a uniformly weighted no-shock outcome grid, then add the shock stratum.
  let both=0,a=0,b=0;for(let i=0;i<100;i++)for(let j=0;j<100;j++){if(i<10)a++;if(j<10)b++;if(i<10&&j<10)both++;}
  const joint=.02+.98*both/10000,margA=.02+.98*a/10000,margB=.02+.98*b/10000;
  assert.equal(answer(123),joint.toFixed(6));assert.equal(qs[122].options[0],(margA*margB).toFixed(6));
  assert.equal(qs[122].options[1],(.02+both/10000).toFixed(6));assert.equal(qs[122].options[3],(.02*both/10000).toFixed(6));
  // Maximize the product of individual failure densities and survivor probabilities on a fine mean-life grid.
  const records=Array.from(qs[124].chart.rows),logLikelihood=mean=>records.reduce((ll,[,time,status])=>ll-time/mean-(status==='Failure'?Math.log(mean):0),0);
  let best=0,bestLL=-Infinity;for(let tenth=1;tenth<=20000;tenth++){const mean=tenth/10,ll=logLikelihood(mean);if(ll>bestLL){bestLL=ll;best=mean;}}
  assert.equal(answer(125),best.toFixed(1)+' h');
  const failures=records.filter(r=>r[2]==='Failure'),total=records.reduce((v,r)=>v+r[1],0);
  assert.equal(qs[124].options[0],(failures.reduce((v,r)=>v+r[1],0)/failures.length).toFixed(1)+' h');
  assert.equal(qs[124].options[1],(total/records.length).toFixed(1)+' h');
  assert.equal(qs[124].options[2],(600*records.length/failures.length).toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1})+' h');
  // Expand EWMA into weighted history rather than reusing its recursion.
  const data=Array.from(qs[125].chart.rows,r=>r[1]),history=data.map((_,i)=>10*.8**(i+1)+data.slice(0,i+1).reduce((z,x,j)=>z+.2*.8**(i-j)*x,0));
  assert.deepEqual(history.map(z=>z.toFixed(3)),['10.400','10.720','11.176']);
  assert.equal(answer(126),'Observation '+(history.findIndex(z=>z<9||z>11)+1));
  let variance=0;for(let age=0;age<1000;age++)variance+=(.2*.8**age)**2;
  assert.ok(Math.abs(10+3*Math.sqrt(variance)-11)<1e-12);
  // Enumerate all 32 link states and search graph connectivity; no conditional-reduction formula is reused.
  const edges=[[0,1],[1,3],[0,2],[2,3],[1,2]];
  function enumerate(e){let probability=0;for(let mask=0;mask<32;mask++){const adjacency=[[],[],[],[]];let weight=1;edges.forEach(([u,v],i)=>{const r=i===4?e:.9,on=Boolean(mask&(1<<i));weight*=on?r:1-r;if(on){adjacency[u].push(v);adjacency[v].push(u);}});const seen=new Set([0]),queue=[0];while(queue.length){const u=queue.shift();for(const v of adjacency[u])if(!seen.has(v)){seen.add(v);queue.push(v);}}if(seen.has(3))probability+=weight;}return probability;}
  assert.equal(answer(128),enumerate(.8).toFixed(5));assert.equal(qs[127].options[0],enumerate(0).toFixed(5));assert.equal(qs[127].options[1],enumerate(1).toFixed(5));assert.equal(enumerate(.5).toFixed(5),'0.97200');
  const paths=[[0,1],[2,3],[0,4,3],[2,4,1]],wrong=1-paths.reduce((product,path)=>product*(1-path.reduce((p,i)=>p*(i===4?.8:.9),1)),1);
  assert.equal(qs[127].options[2],wrong.toFixed(5));
  // Apply eligibility and range ordering separately to the raw experimental means.
  const designs=Array.from(qs[128].chart.rows,([id,lo,hi])=>({id,mean:(lo+hi)/2,range:hi-lo}));
  assert.deepEqual(designs.map(d=>[d.mean,d.range]),[[50,10],[51,4],[48,2]]);
  const eligible=designs.filter(d=>d.mean>=49&&d.mean<=51).sort((a,b)=>a.range-b.range);
  assert.equal(eligible[0].id,'B');assert.match(answer(129),/^Setting B/);
});


test('Batch 14 verifies matched-pair intervals, population weights, competing incidence, SOA duration, and constrained repair allocation',()=>{
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer],batch=Array.from(qs.slice(130,140));
  assert.equal(batch.filter(q=>q.quantitative).length,5);
  assert.deepEqual(['Foundational','Moderate','Challenging'].map(d=>batch.filter(q=>q.difficulty===d).length),[1,6,3]);
  const differences=Array.from(qs[133].chart.rows,([,a,b])=>a-b),n=differences.length,mean=differences.reduce((a,b)=>a+b,0)/n;
  const variance=differences.reduce((v,d)=>v+(d-mean)**2,0)/(n-1),interval=divisor=>[mean-2.776*Math.sqrt(variance)/divisor,mean+2.776*Math.sqrt(variance)/divisor];
  const intervalText=values=>values.map(v=>v.toFixed(2).replace('-','−')).join(' to ')+' min';
  assert.equal(answer(134),intervalText(interval(Math.sqrt(n))));
  assert.equal(qs[133].options[1],intervalText(interval(1)));assert.equal(qs[133].options[2],intervalText(interval(n)));assert.equal(qs[133].options[3],intervalText(interval(Math.sqrt(n)).reverse().map(v=>-v)));
  // Integrate a Student t(4) density to verify the supplied two-sided critical value.
  let mass=0;const dz=2.776/20000;for(let i=0;i<20000;i++){const z=(i+.5)*dz;mass+=2*.375*(1+z*z/4)**(-2.5)*dz;}assert.ok(Math.abs(mass-.95)<.00003);
  // Expand each sampled observation by its inverse selection probability to reconstruct estimated population failures.
  let weightedFailures=0,population=0,sampleN=0,sampleFailures=0;
  for(const [,size,sampled,failed] of qs[134].chart.rows){const observations=Array.from({length:sampled},(_,i)=>i<failed?1:0);weightedFailures+=observations.reduce((sum,v)=>sum+v*size/sampled,0);population+=size;sampleN+=sampled;sampleFailures+=failed;}
  assert.equal(answer(135),(100*weightedFailures/population).toFixed(1)+'%');assert.equal(qs[134].options[0],(100*sampleFailures/sampleN).toFixed(1)+'%');
  assert.equal(weightedFailures,360);assert.equal(population,10000);
  assert.equal(qs[134].options[1],(100*(.2*.02+.8*.1)).toFixed(1)+'%');assert.equal(qs[134].options[3],(100*(.02+.1)).toFixed(1)+'%');
  // Numerical cause-density integration, without using the closed-form cumulative-incidence expression.
  const [a,b]=Array.from(qs[135].chart.rows,r=>Number(r[1])),step=1000/50000;let firstA=0,firstB=0;
  for(let i=0;i<50000;i++){const t=(i+.5)*step,survive=Math.exp(-a*t)*Math.exp(-b*t);firstA+=a*survive*step;firstB+=b*survive*step;}
  assert.equal(answer(136),firstA.toFixed(4));assert.equal(qs[135].options[0],(1-Math.exp(-a*1000)).toFixed(4));assert.equal(qs[135].options[2],(firstA+firstB).toFixed(4));assert.equal(qs[135].options[3],(firstA/(firstA+firstB)).toFixed(4));
  assert.ok(Math.abs(firstA+firstB+Math.exp(-(a+b)*1000)-1)<1e-10);
  // Read the exact supplied 40 V row and check both duration-specific boundaries.
  const row=qs[138].chart.rows.find(r=>r[0]===40);assert.ok(4>row[1]);assert.ok(4<row[2]);assert.match(answer(139),/DC SOA.*1.5 A/);
  for(const [v,dc,pulse] of qs[138].chart.rows){assert.equal(v*dc,60);assert.equal(v*pulse,200);}
  // Build one repeated ten-event cycle using the subsystem failure frequencies, then search a centihour grid.
  const durationRows=Array.from(qs[139].chart.rows),events=durationRows.flatMap(([id,count,h])=>Array.from({length:count},()=>({id,h})));
  const meanRepair=c=>events.reduce((sum,e)=>sum+(e.id==='C'?c:e.h),0)/events.length;
  let largest=0;for(let hundredths=0;hundredths<=600;hundredths++)if(meanRepair(hundredths/100)<=3.5+1e-12)largest=hundredths/100;
  assert.equal(answer(140),largest.toFixed(2)+' h');assert.equal(meanRepair(6),4.4);assert.equal(meanRepair(largest),3.5);assert.ok(meanRepair(largest+.01)>3.5);
  assert.equal(qs[139].options[0],'3.50 h');assert.ok(meanRepair(3.5)<3.5);
  assert.equal(qs[139].options[1],(6*3.5/meanRepair(6)).toFixed(2)+' h');assert.ok(meanRepair(6*3.5/meanRepair(6))>3.5);
  assert.equal(qs[139].options[3],(3*3.5-1-4).toFixed(2)+' h');assert.ok(meanRepair(5.5)>3.5);
});


test('Batch 15 verifies resource constraints, lognormal expectation, failure-terminated confidence, standby states, and replicated ANOVA',()=>{
  const qs=bank().CRE_SET2,answer=n=>qs[n-1].options[qs[n-1].answer],batch=Array.from(qs.slice(140,150));
  assert.equal(batch.filter(q=>q.quantitative).length,5);
  assert.deepEqual(['Foundational','Moderate','Challenging'].map(d=>batch.filter(q=>q.difficulty===d).length),[1,6,3]);
  // Enumerate feasible integer-day starts; the chamber must never serve A and B together.
  let finish=Infinity;
  for(let a=0;a<=10;a++)for(let b=0;b<=10;b++)for(let c=0;c<=10;c++)for(let d=0;d<=12;d++){
    if(a+4>b&&b+3>a)continue;
    if(d<a+4||d<b+3||d<c+5)continue;
    finish=Math.min(finish,d+2);
  }
  assert.equal(answer(142),finish+' days');assert.equal(finish,9);
  assert.equal(qs[141].options[0],(Math.max(4,3,5)+2)+' days');assert.equal(qs[141].options[1],(4+3+5+2)+' days');assert.equal(qs[141].options[2],(5+3+2)+' days');
  // Integrate the lifetime as a function of a standard-normal variate, not the closed-form mean.
  let expectedLife=0;const dz=20/100000;for(let i=0;i<100000;i++){const z=-10+(i+.5)*dz;expectedLife+=2*Math.exp(.6*z)*Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*dz;}
  assert.equal(answer(146),expectedLife.toFixed(2)+' h');assert.equal(qs[145].options[0],'2.00 h');assert.equal(qs[145].options[1],(2*Math.exp(.6/2)).toFixed(2)+' h');assert.equal(qs[145].options[2],(2*Math.exp(.6**2)).toFixed(2)+' h');
  // Invert the integer-shape gamma CDF to check every supplied chi-square quantile.
  const chiCDF=(x,df)=>{let term=1,sum=1;for(let k=1;k<df/2;k++){term*=x/2/k;sum+=term;}return 1-Math.exp(-x/2)*sum;};
  for(const [df,q90,q95] of qs[146].chart.rows)for(const [p,q] of [[.9,Number(q90)],[.95,Number(q95)]]){let lo=0,hi=40;for(let k=0;k<60;k++){const mid=(lo+hi)/2;if(chiCDF(mid,df)<p)lo=mid;else hi=mid;}assert.ok(Math.abs((lo+hi)/2-q)<.00051);}
  const exposure=4*100+3*(300-100)+2*(700-300);assert.equal(exposure,1800);
  assert.equal(answer(147),(2*exposure/10.645).toFixed(1)+' h');assert.equal(qs[146].options[0],(exposure/3).toFixed(1)+' h');assert.equal(qs[146].options[2],(2*exposure/13.362).toFixed(1)+' h');assert.equal(qs[146].options[3],(2*exposure/12.592).toFixed(1)+' h');
  // Solve the two transient state equations numerically using RK4, including both standby-rate endpoints.
  const stateReliability=delta=>{const dt=.25,rate=.0005+delta,derivative=([p2,p1])=>[-rate*p2,rate*p2-.0005*p1],advance=(s,k,h)=>s.map((p,i)=>p+h*k[i]);let state=[1,0];for(let i=0;i<4000;i++){const k1=derivative(state),k2=derivative(advance(state,k1,dt/2)),k3=derivative(advance(state,k2,dt/2)),k4=derivative(advance(state,k3,dt));state=state.map((p,j)=>p+dt*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);}return state[0]+state[1];};
  assert.equal(answer(149),stateReliability(.0001).toFixed(4));assert.equal(qs[148].options[1],stateReliability(0).toFixed(4));assert.equal(qs[148].options[2],stateReliability(.0005).toFixed(4));assert.equal(qs[148].options[3],Math.exp(-.6).toFixed(4));assert.equal(stateReliability(.0003).toFixed(4),'0.8685');
  // Reconstruct an original balanced 12-observation dataset whose ANOVA matches the supplied summary.
  const data=[];for(const a of [-1,1])for(const b of [-1,1])for(const residual of [-Math.sqrt(3),0,Math.sqrt(3)])data.push({a,b,y:100+a+1.5*b+2*a*b+residual});
  const mean=rows=>rows.reduce((sum,r)=>sum+r.y,0)/rows.length,grand=mean(data),aMean=a=>mean(data.filter(r=>r.a===a)),bMean=b=>mean(data.filter(r=>r.b===b)),cell=(a,b)=>mean(data.filter(r=>r.a===a&&r.b===b));
  let ssA=0,ssB=0,ssAB=0,ssE=0,ssT=0;for(const r of data){ssA+=(aMean(r.a)-grand)**2;ssB+=(bMean(r.b)-grand)**2;ssAB+=(cell(r.a,r.b)-aMean(r.a)-bMean(r.b)+grand)**2;ssE+=(r.y-cell(r.a,r.b))**2;ssT+=(r.y-grand)**2;}
  assert.deepEqual([ssA,ssB,ssAB,ssE,ssT].map(Math.round),[12,27,48,24,111]);assert.ok(Math.abs(ssA+ssB+ssAB+ssE-ssT)<1e-9);
  const errorDf=data.length-4,f=ssAB/(ssE/errorDf);assert.equal(errorDf,8);assert.equal(answer(150),'F = '+f.toFixed(2)+'; reject no interaction.');assert.ok(f>5.318);
  // F(1,8) is squared t(8); integrate the t density to validate the 5% upper-tail critical value.
  const limit=Math.sqrt(5.318),dx=limit/20000;let mass=0;for(let i=0;i<20000;i++){const x=(i+.5)*dx;mass+=2*(1.09375/Math.sqrt(8))*(1+x*x/8)**(-4.5)*dx;}assert.ok(Math.abs(mass-.95)<.00001);
});

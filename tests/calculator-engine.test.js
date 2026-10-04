const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const base=path.join(__dirname,'../tools/calculator-assets');
function engine(){const context=vm.createContext({console,self:{postMessage(){}},setTimeout,clearTimeout});context.importScripts=(file)=>vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(base,'advanced-worker.js'),'utf8'),context);return {run:arg=>vm.runInContext(`handle(${JSON.stringify(arg)})`,context),context};}
const {run,context}=engine();
const near=(actual,expected,tol=1e-8)=>assert.ok(Math.abs(actual-expected)<=tol*Math.max(1,Math.abs(expected)),`${actual} ≠ ${expected}`);
const value=expression=>Number(run({action:'evaluate',expression}).text);
test('matrix, simultaneous equations, complex, units, lists, and polynomial roots',()=>{
 near(value('det([2,1;1,3])'),5);
 assert.match(run({action:'evaluate',expression:'lusolve([2,1;1,3],[5,7])'}).text,/1\.6/);
 assert.match(run({action:'evaluate',expression:'(2+3i)*(1-i)'}).text,/5 \+ i/);
 near(value('mean([2,4,6,8,10])'),6);near(value('std([2,4,6,8,10])'),Math.sqrt(10));
 assert.match(run({action:'evaluate',expression:'25.4 mm to inch'}).text,/1 inch/);
 assert.match(run({action:'evaluate',expression:'polynomialRoot(-6,11,-6,1)'}).text,/1/);
 near(value('sin(30)'),-.9880316240928618);near(Number(run({action:'evaluate',expression:'sin(30)',angle:'DEG'}).text),.5);
});
test('direct upper tails and discrete boundaries',()=>{
 near(value('normalcdf(8,9)'),6.219831985865787e-16,1e-25);
 near(value('binompdf(10,0,0)'),1);near(value('binompdf(10,1,10)'),1);
 near(value('binomcdf(20,0.1,2)'),.676926805189466);
 near(vm.runInContext("DISTS.find(d=>d.id==='geometric').inv(.999999,{p:.2})",context),62);
 near(vm.runInContext("upperTail(DISTS.find(d=>d.id==='expo'),50000,{lam:.001})",context),Math.exp(-50),1e-25);
});
test('calculus, root bracketing and discontinuities',()=>{
 near(value('nDeriv("x^3",2)'),12,1e-7);near(value('fnInt("sin(x)",0,pi)'),2);near(value('solve("x^2-2",0,2)'),Math.sqrt(2));
 assert.throws(()=>value('solve("1/x",-1,1)'),/finite/);
 assert.throws(()=>value('solve("x^2+1",-1,1)'),/sign-changing/);
});
test('graph modes and table values',()=>{
 const b=[-5,5,-5,5];
 const g=run({action:'graph',mode:'function',expressions:['x^2-4','2*x'],bounds:b});near(g.curves[0].points[400][1],-4);
 const p=run({action:'graph',mode:'parametric',expressions:['3*cos(t); 2*sin(t)'],bounds:b,start:0,end:Math.PI*2});near(p.curves[0].points[0][0],3);
 const seq=run({action:'graph',mode:'sequence',expressions:['u*1.1'],bounds:b,start:0,end:3,initial:1});near(seq.curves[0].points[3][1],1.331);
 near(run({action:'table',expressions:['x^2'],start:-2,step:1,count:5})[4][1],4);
 assert.throws(()=>run({action:'graph',mode:'function',expressions:['badFunction(x)'],bounds:b}),/Unsupported/);
});
test('TVM matches independent annuity formula, zero rate and rate conversions',()=>{
 const values={n:60,rate:6,pv:20000,pmt:0,fv:0,py:12,cy:12};
 const pmt=run({action:'finance',values,solve:'pmt'}).value;near(pmt,-386.6560305885656,1e-8);
 near(run({action:'finance',values:{...values,rate:0},solve:'pmt'}).value,-20000/60);
 near(run({action:'finance',values:{...values,pmt,rate:0},solve:'rate'}).value,6,1e-7);
 near(value('npv(0.1,[-1000,400,400,400])'),-5.259203606311);
 near(value('irr([-1000,400,400,400],0,1)'),.097010257403272);
});
test('documented program control flow and bounded execution',()=>{
 assert.equal(run({action:'program',source:'0→S\nFor(I,1,10)\nS+I→S\nEnd\nDisp S'}).text,'55');
 assert.equal(run({action:'program',source:'A=0\nWhile A<3\nA=A+1\nEnd\nIf A=3\nThen\nDisp 10\nElse\nDisp 20\nEnd'}).text,'10');
 assert.throws(()=>run({action:'program',source:'While 1\nA=1\nEnd'}),/10,000/);
 assert.throws(()=>run({action:'evaluate',expression:'ones(1000000,1000000)'}),/10,000/);
 assert.throws(()=>run({action:'evaluate',expression:'import("test")'}),/Unsupported/);
});
vm.runInContext('function quantile(a,q){const p=(a.length-1)*q;return a[Math.floor(p)]+(a[Math.ceil(p)]-a[Math.floor(p)])*(p-Math.floor(p));}',context);
vm.runInContext(fs.readFileSync(path.join(base,'analysis-core.js'),'utf8'),context);
function analysis(expr){return vm.runInContext(expr,context);}
test('strict numeric input rejects malformed values and empty cells',()=>{
 for(const value of ['1,2junk','1,,2','1\t\t2','1,NaN'])assert.throws(()=>analysis(`CalculatorAnalysis.parse(${JSON.stringify(value)})`),/Row/);
 assert.equal(analysis('CalculatorAnalysis.parse("1,2\\n3,4").flat().length'),4);
});
test('NIST individuals example and ANOVA known values',()=>{
 const result=analysis('CalculatorAnalysis.capability([49.6,47.6,49.9,51.3,47.8,51.2,52.6,52.4,53.6,52.1],45,55)');const m=Object.fromEntries(result.metrics);
 near(m.Mean,50.81);near(m['MR mean'],1.8777777777777778);near(m['I chart lower limit'],45.81591016548464);
 const a=analysis('CalculatorAnalysis.anova([[6.9,5.4,5.8,4.6,4],[8.3,6.8,7.8,9.2,6.5],[8,10.5,8.1,6.9,9.3]])');near(a.tables[0].rows[0][1],27.89733333333333);near(a.tables[0].rows[1][1],17.452);near(a.metrics[0][1],9.591107036442818);
});
test('Pearson independence, regression, and degenerate inputs',()=>{
 const c=analysis('CalculatorAnalysis.chi([[30,20,10],[20,30,40]])');near(c.metrics[0][1],16.666666666666664);near(c.metrics[2][1],.000240369476419514);
 const r=analysis('CalculatorAnalysis.regression([[1,3],[2,5],[3,7],[4,9]])');near(r.metrics[0][1],2);near(r.metrics[1][1],1);near(r.metrics[3][1],1);
 assert.throws(()=>analysis('CalculatorAnalysis.regression([[1,2],[1,3],[1,4]])'),/must vary/);
 assert.throws(()=>analysis('CalculatorAnalysis.chi([[0,0],[1,3]])'),/positive total/);
 assert.throws(()=>analysis('CalculatorAnalysis.capability([1,1,1],0,2)'),/zero variation/);
});
test('polynomial and transformed fits reproduce independently specified curves',()=>{
 const q=analysis('CalculatorAnalysis.curveFit([[0,1],[1,6],[2,17],[3,34],[4,57]],"poly2")');near(q.metrics[1][1],1);near(q.metrics[2][1],2);near(q.metrics[3][1],3);near(q.metrics[4][1],1);
 const e=analysis('CalculatorAnalysis.curveFit([[0,2],[1,2*Math.exp(.4)],[2,2*Math.exp(.8)],[3,2*Math.exp(1.2)]],"exp")');near(e.metrics[1][1],2);near(e.metrics[2][1],.4);
 const p=analysis('CalculatorAnalysis.curveFit([[1,3],[2,12],[3,27],[4,48]],"power")');near(p.metrics[1][1],3);near(p.metrics[2][1],2);
 assert.throws(()=>analysis('CalculatorAnalysis.curveFit([[0,2],[1,3],[2,4]],"power")'),/positive/);
});
test('goodness of fit uses independently specified expected counts and rejects mismatched totals',()=>{
 const r=analysis('CalculatorAnalysis.gof([[18,22,20,25,15],[20,20,20,20,20]])');near(r.metrics[0][1],2.9);near(r.metrics[1][1],4);near(r.metrics[2][1],.5746972058298045);
 assert.throws(()=>analysis('CalculatorAnalysis.gof([[18,22],[30,30]])'),/totals must match/);
});

test('QA: Pearson correlation is invariant to large and small measurement units',()=>{
 for(const scale of [1e90,1e-90])for(const sign of [-1,1]){
  const rows=[1,2,3,4,5].map(x=>[x*scale,sign*(2*x+1)*scale]);
  const m=Object.fromEntries(analysis(`CalculatorAnalysis.regression(${JSON.stringify(rows)})`).metrics);
  near(m['Pearson r'],sign,1e-12);near(m.Slope,2*sign,1e-12);near(m['R²'],1,1e-12);
 }
});
test('QA: 50 fresh seeded regression cases match independent SciPy references across units',()=>{
 const refs=JSON.parse(fs.readFileSync('tests/fixtures/calculator-final-qa-reference.json'));
 assert.equal(refs.regression.length,50);
 for(const c of refs.regression){
  const m=Object.fromEntries(analysis(`CalculatorAnalysis.regression(${JSON.stringify(c.rows)})`).metrics);
  near(m.Slope,c.expected.slope,1e-10);near(m['Pearson r'],c.expected.r,1e-10);
  near(m['Slope p-value (two-sided)'],c.expected.p,1e-11);
 }
});
test('QA: unrepresentable variation, fitted equations and unsafe count totals fail clearly',()=>{
 assert.throws(()=>analysis('CalculatorAnalysis.summary([1e-200,2e-200,3e-200])'),/range|rescale/i);
 const rows=[1,2,3,4,5,6].map(x=>[x*1e90,1+x+x**4]);
 assert.throws(()=>analysis(`CalculatorAnalysis.curveFit(${JSON.stringify(rows)},"poly4")`),/range|rescale/i);
 assert.throws(()=>analysis('CalculatorAnalysis.gof([[9007199254740990,9007199254740990],[9007199254740990,9007199254740990]])'),/safe integer/);
 assert.throws(()=>analysis('CalculatorAnalysis.gof([[20,0],[1e-320,20]])'),/range|rescale/i);
});

test('360 distribution comparisons against SciPy 1.17.0 fixtures',()=>{
 const fixtures=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/calculator-distributions.json'),'utf8'));
 let comparisons=0;
 for(const reference of fixtures){
  context.reference=reference;
  const actual=vm.runInContext(`(()=>{const d=DISTS.find(d=>d.id===reference.id),p=reference.params,x=reference.x;return {pdf:d.pdf(x,p),cdf:d.cdf(x,p),upper:upperTail(d,x,p),x:reference.prob?d.inv(reference.prob,p,d):x};})()`,context);
  for(const key of ['pdf','cdf','upper','x']){
   if(reference[key]==null)continue;
   comparisons++;
   const tolerance=1e-8*Math.max(Math.abs(reference[key]),1e-12);
   assert.ok(Number.isFinite(actual[key])&&Math.abs(actual[key]-reference[key])<=tolerance,`${reference.id} ${key}: ${actual[key]} versus ${reference[key]}`);
  }
 }
 assert.equal(comparisons,360);
});
test('density boundaries distinguish zero, finite density, and singular endpoints',()=>{
 for(const [id,p,x,expected]of [['chi2',{df:1},0,Infinity],['chi2',{df:2},0,.5],['gamma',{k:1,theta:2},0,.5],['weibull',{beta:1,eta:2},0,.5],['beta',{al:1,be:3},0,3],['beta',{al:3,be:1},1,3],['beta',{al:.5,be:.5},0,Infinity],['f',{d1:2,d2:8},0,1]]){
  const actual=vm.runInContext(`DISTS.find(d=>d.id==='${id}').pdf(${x},${JSON.stringify(p)})`,context);assert.equal(actual,expected,id);
 }
});
test('degree mode is consistent across trig and nested numerical helpers',()=>{
 const deg=expression=>Number(run({action:'evaluate',expression,angle:'DEG'}).text);
 near(deg('csc(30)'),2);near(deg('sec(60)'),2);near(deg('cot(45)'),1);near(deg('acsc(2)'),30);near(deg('atan2(1,1)'),45);
 near(deg('nDeriv("sin(x)",0)'),Math.PI/180);
 near(deg('fnInt("sin(x)",0,180)'),360/Math.PI);
 near(deg('solve("sin(x)-0.5",0,60)'),30);
 assert.match(run({action:'evaluate',expression:'seq("sin(n)",0,90,30)',angle:'DEG'}).text,/\[0, 0.5, 0.866025403784, 1\]/);
 near(deg('arg(1+i)'),Math.PI/4);
});
test('multi-line Ans is the final value and unsupported callbacks cannot bypass validation',()=>{
 run({action:'evaluate',expression:'A=2\nA+3'});near(value('Ans*2'),10);
 for(const expression of ['map(["2+2"],evaluate)','F=parse','filter([1],import)'])assert.throws(()=>run({action:'evaluate',expression}),/Unsupported function reference/);
 assert.throws(()=>run({action:'program',source:'For(sin,1,3)\nDisp sin\nEnd'}),/non-reserved/);
 near(value('sum(map([-1,-2,3],abs))'),6); // Supported function callbacks remain available.
});
test('roots are invariant under function scaling and reject invalid brackets',()=>{
 near(value('solve("1e-15*(x-2)",0,3)'),2);
 near(value('solve("1e15*(x-2)",0,3)'),2);
 assert.throws(()=>value('solve("x-2",3,0)'),/lower < upper/);
 assert.throws(()=>value('solve("1/(x-0.1)",0,1)'),/discontinuity/);
});
test('TVM handles large balances, negative rates, zero rate, and degenerate cash flows',()=>{
 const solve=(key,values)=>run({action:'finance',solve:key,values:{n:60,rate:6,pv:20000,pmt:0,fv:0,py:12,cy:12,...values}}).value;
 near(solve('fv',{pv:1e20}),-1e20*1.005**60,1e-12);
 near(solve('pmt',{pv:1e15,n:360}),-1e15*.005/(1-1.005**-360),1e-12);
 near(solve('rate',{pv:1000,pmt:0,fv:-900,n:1,py:1,cy:1}),-10,1e-10);
 near(solve('rate',{pv:100,pmt:0,fv:-1,n:1,py:1,cy:1}),-99,1e-10);
 near(solve('rate',{pv:100,pmt:0,fv:-10100,n:1,py:1,cy:1}),10000,1e-10);
 near(solve('rate',{pv:100,pmt:0,fv:-1,n:1,py:12,cy:12}),-1188,1e-10);
 assert.throws(()=>solve('rate',{n:0,pv:100,fv:-100}),/N is zero/);
 near(solve('n',{pv:20000,pmt:-200,fv:0,rate:0}),100);
 near(solve('n',{pv:100,pmt:0,fv:-200,rate:1000,py:1,cy:1}),Math.log(2)/Math.log(11));
 assert.throws(()=>solve('rate',{pv:0,pmt:0,fv:0}),/no unique solution/);
});

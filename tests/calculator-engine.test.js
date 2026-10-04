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

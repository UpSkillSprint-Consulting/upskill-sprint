/* Isolated math engine. Self-hosted math.js 15.2.0 (Apache-2.0); no user-code eval. */
'use strict';
importScripts('vendor/math-15.2.0.js');
importScripts('numeric.js');
const scope=new Map();
const allowed=new Set(('abs acos acosh acot acoth acsc acsch asec asech asin asinh atan atan2 atanh cbrt ceil cos cosh cot coth csc csch exp expm1 fix floor log log10 log2 log1p max min mod nthRoot pow round sec sech sign sin sinh sqrt tan tanh trunc factorial combinations permutations gcd lcm gamma erf complex re im conj arg norm det inv transpose trace identity zeros ones diag dot cross multiply add subtract divide lsolve usolve lusolve qr rref mean median mode std variance sum prod sort range size squeeze reshape concat subset index flatten cumsum diff map filter forEach number string length concat format fraction bignumber boolean random randomInt randomNormal pickRandom polynomialRoot unit to equal unequal larger smaller largerEq smallerEq and or xor not help nPr nCr rand randInt ln int iPart fPart remainder real imag angle seq cumSum dim augment ref nDeriv fnInt solve npv irr tvm eff nom normalcdf normalpdf invNorm tcdf tpdf invT invF invChi2 chisquarecdf chisquarepdf Fcdf Fpdf randNorm randBin binompdf binomcdf poissonpdf poissoncdf geometpdf geometcdf').split(' '));
function need(ok,message){if(!ok)throw Error(message);}
function real(v){need(typeof v==='number'&&Number.isFinite(v),'Expected a finite real number.');return v;}
function array(v){return v?.toArray?v.toArray():v;}
function scalar(fn,args){return fn(...args);}
const original={sin:math.sin,cos:math.cos,tan:math.tan,asin:math.asin,acos:math.acos,atan:math.atan};
function environment(mode='RAD'){
  const env=new Map(scope),factor=mode==='DEG'?Math.PI/180:1;
  for(const k of ['sin','cos','tan'])env.set(k,x=>original[k](math.multiply(x,factor)));
  for(const k of ['asin','acos','atan'])env.set(k,x=>math.divide(original[k](x),factor));
  return env;
}
function compile(expression,assign=false){
  need(typeof expression==='string'&&expression.length<=8000,'Expressions are limited to 8,000 characters.');
  const normalized=expression.replace(/π/g,'pi').replace(/θ/g,'theta').replace(/−/g,'-').replace(/→([A-Za-z][A-Za-z0-9_]*)/g,' -> $1');
  const node=math.parse(normalized);let nodes=0;
  node.traverse(n=>{
    need(++nodes<=1500,'Expression is too complex.');
    need(!['ObjectNode','FunctionAssignmentNode','AccessorNode','IndexNode'].includes(n.type),'Use whole-list/matrix operations; object properties, indexing, and function definitions are not supported here.');
    if(n.type==='AssignmentNode')need(assign&&/^[A-Za-z][A-Za-z0-9_]{0,20}$/.test(n.name)&&!allowed.has(n.name)&&!['pi','e','i','Infinity','NaN'].includes(n.name),'Use a non-reserved variable name. Assignments are only allowed in the workspace.');
    if(n.type==='FunctionNode')need(n.fn.type==='SymbolNode'&&allowed.has(n.fn.name),`Unsupported function: ${n.fn.name||'expression'}. Use the function catalog.`);
    if(n.type==='RangeNode')throw Error('Use range(start, stop, step); maximum 10,000 entries.');
    if(n.type==='ArrayNode')need(n.items.length<=10000,'Array is too large.');
  });
  return node.compile();
}
function fOf(expression,mode='RAD',variable='x',extras={}){const code=compile(expression),env=environment(mode);Object.entries(extras).forEach(([k,v])=>env.set(k,v));return x=>{env.set(variable,x);const y=code.evaluate(env);return real(y);};}
function derivative(f,x){const h=Math.cbrt(Number.EPSILON)*Math.max(1,Math.abs(x));return (f(x+h)-f(x-h))/(2*h);}
function integral(f,a,b){
  need(Number.isFinite(a)&&Number.isFinite(b),'Finite integration bounds are required.');if(a===b)return 0;if(a>b)return -integral(f,b,a);
  const sim=(a,b,fa,fm,fb)=>(b-a)*(fa+4*fm+fb)/6;
  let calls=0;
  function rec(a,b,fa,fm,fb,whole,tol,depth){need(++calls<16000,'Integration did not converge. Split the interval and check for singularities.');const mid=(a+b)/2,fl=f((a+mid)/2),fr=f((mid+b)/2),left=sim(a,mid,fa,fl,fm),right=sim(mid,b,fm,fr,fb),delta=left+right-whole;if(Math.abs(delta)<=15*tol)return left+right+delta/15;need(depth>0,'Integration did not converge; check discontinuities or narrow the interval.');return rec(a,mid,fa,fl,fm,left,tol/2,depth-1)+rec(mid,b,fm,fr,fb,right,tol/2,depth-1);}
  const fa=f(a),fb=f(b),fm=f((a+b)/2),whole=sim(a,b,fa,fm,fb);return rec(a,b,fa,fm,fb,whole,1e-9*Math.max(1,Math.abs(whole)),22);
}
function root(f,a,b){let fa=f(a),fb=f(b);if(Math.abs(fa)<1e-12)return a;if(Math.abs(fb)<1e-12)return b;need(Math.sign(fa)!==Math.sign(fb),'The interval must bracket a sign-changing root. Try different bounds.');for(let i=0;i<180;i++){let m=a+(b-a)/2,fm=f(m);if(Math.abs(fm)<1e-11)return m;if(Math.sign(fm)===Math.sign(fa)){a=m;fa=fm;}else{b=m;fb=fm;}if(Math.abs(b-a)<1e-13*Math.max(1,Math.abs(m))){need(Math.abs(fm)<1e-6,'A discontinuity or poorly scaled function was found, not a verified root.');return m;}}throw Error('Root did not converge.');}
function extremum(f,a,b,max=false){const sign=max?-1:1,phi=(Math.sqrt(5)-1)/2;let c=b-phi*(b-a),d=a+phi*(b-a);for(let i=0;i<100;i++){if(sign*f(c)<sign*f(d)){b=d;d=c;c=b-phi*(b-a);}else{a=c;c=d;d=a+phi*(b-a);}}const x=(a+b)/2;return {x,y:f(x)};}
function rref(input){const a=array(input).map(r=>[...r]);need(a.length&&a.length<=50&&a.every(r=>r.length===a[0].length&&r.every(Number.isFinite)),'Use a finite rectangular matrix (up to 50 rows).');let row=0;for(let c=0;c<a[0].length&&row<a.length;c++){let p=row;for(let i=row+1;i<a.length;i++)if(Math.abs(a[i][c])>Math.abs(a[p][c]))p=i;const scale=Math.max(...a.map(r=>Math.abs(r[c])));if(Math.abs(a[p][c])<=Number.EPSILON*scale*50||scale===0)continue;[a[row],a[p]]=[a[p],a[row]];const v=a[row][c];a[row]=a[row].map(x=>x/v);for(let i=0;i<a.length;i++)if(i!==row){const q=a[i][c];a[i]=a[i].map((x,j)=>x-q*a[row][j]);}row++;}return math.matrix(a);}
function npv(rate,flows){real(rate);flows=array(flows).flat();need(rate>-1&&flows.length>0&&flows.length<=10000&&flows.every(Number.isFinite),'NPV needs rate > −1 and finite cash flows including period 0.');return flows.reduce((s,c,i)=>s+c/Math.pow(1+rate,i),0);}
function tvm(v){const {n,rate,pv,pmt,fv,py=12,cy=12,begin=false}=v;need(py>0&&cy>0&&n>=0&&rate/cy>-100,'Invalid periods, payment frequency, or rate.');const r=Math.expm1(cy/py*Math.log1p(rate/100/cy));const growth=Math.exp(n*Math.log1p(r)),annuity=Math.abs(r)<1e-14?n:Math.expm1(n*Math.log1p(r))/r;return pv*growth+pmt*(begin?1+r:1)*annuity+fv;}
function distribution(id){return DISTS.find(d=>d.id===id);}
function distInterval(id,a,b,p){need(Number.isFinite(a)&&Number.isFinite(b)&&a<=b,'Lower bound must not exceed upper bound.');const D=distribution(id);return Math.max(0,D.cdf(a,p)>.5?upperTail(D,a,p)-upperTail(D,b,p):D.cdf(b,p)-D.cdf(a,p));}
function prob(p){need(Number.isFinite(p)&&p>=0&&p<=1,'Probability must be from 0 to 1.');}
function count(n,min=0){need(Number.isSafeInteger(n)&&n>=min&&n<=100000,'Count must be an integer within 0–100,000.');}
const aliases={
 normalpdf:(x,mu=0,sigma=1)=>{need(sigma>0,'Sigma must be positive.');return normPdf((x-mu)/sigma)/sigma;},
 normalcdf:(a,b,mu=0,sigma=1)=>{need(sigma>0,'Sigma must be positive.');return distInterval('normal',a,b,{mu,sig:sigma});},
 invNorm:(p,mu=0,sigma=1)=>{prob(p);need(sigma>0,'Sigma must be positive.');return mu+sigma*invNorm(p);},
 tpdf:(x,df)=>{need(df>0,'df must be positive.');return distribution('t').pdf(x,{df});},
 tcdf:(a,b,df)=>{need(df>0,'df must be positive.');return distInterval('t',a,b,{df});},
 invT:(p,df)=>{prob(p);need(df>0,'df must be positive.');if(p===0)return -Infinity;if(p===1)return Infinity;const D=distribution('t');return D.inv(p,{df},D);},
 chisquarepdf:(x,df)=>{need(df>0,'df must be positive.');return distribution('chi2').pdf(x,{df});},
 chisquarecdf:(a,b,df)=>{need(df>0,'df must be positive.');return distInterval('chi2',a,b,{df});},
 invChi2:(p,df)=>{prob(p);need(df>0,'df must be positive.');if(p===0)return 0;if(p===1)return Infinity;const D=distribution('chi2');return D.inv(p,{df},D);},
 Fpdf:(x,d1,d2)=>{need(d1>0&&d2>0,'Degrees of freedom must be positive.');return distribution('f').pdf(x,{d1,d2});},
 Fcdf:(a,b,d1,d2)=>{need(d1>0&&d2>0,'Degrees of freedom must be positive.');return distInterval('f',a,b,{d1,d2});},
 invF:(p,d1,d2)=>{prob(p);need(d1>0&&d2>0,'Degrees of freedom must be positive.');if(p===0)return 0;if(p===1)return Infinity;const D=distribution('f');return D.inv(p,{d1,d2},D);},
 binompdf:(n,p,k)=>{count(n);count(k);prob(p);return distribution('binomial').pdf(k,{n,p});},
 binomcdf:(n,p,k)=>{count(n);count(k);prob(p);return distribution('binomial').cdf(k,{n,p});},
 poissonpdf:(lambda,k)=>{count(k);need(lambda>0,'Rate must be positive.');return distribution('poisson').pdf(k,{lam:lambda});},
 poissoncdf:(lambda,k)=>{count(k);need(lambda>0,'Rate must be positive.');return distribution('poisson').cdf(k,{lam:lambda});},
 geometpdf:(p,k)=>{prob(p);need(p>0,'p must be positive.');count(k,1);return distribution('geometric').pdf(k,{p});},
 geometcdf:(p,k)=>{prob(p);need(p>0,'p must be positive.');count(k,1);return distribution('geometric').cdf(k,{p});},
 randNorm:(mu=0,sigma=1)=>{need(sigma>0,'Sigma must be positive.');return mu+sigma*Math.sqrt(-2*Math.log(1-Math.random()))*Math.cos(2*Math.PI*Math.random());},
 randBin:(n,p)=>{count(n);prob(p);let successes=0;for(let i=0;i<n;i++)if(Math.random()<p)successes++;return successes;},ln:math.log,int:math.floor,iPart:math.fix,fPart:x=>x-math.fix(x),remainder:math.mod,real:math.re,imag:math.im,angle:math.arg,nPr:math.permutations,nCr:math.combinations,rand:math.random,randInt:(a,b)=>math.randomInt(a,b+1),cumSum:math.cumsum,dim:math.size,augment:(a,b)=>math.concat(a,b,1),rref,ref:rref,
 nDeriv:(expr,x)=>derivative(fOf(expr),x),fnInt:(expr,a,b)=>integral(fOf(expr),a,b),solve:(expr,a,b)=>root(fOf(expr),a,b),npv,irr:(flows,a=-.9,b=1)=>root(r=>npv(r,flows),a,b),tvm:(n,rate,pv,pmt,fv,py=12,cy=12,begin=0)=>tvm({n,rate,pv,pmt,fv,py,cy,begin:!!begin}),eff:(nom,c)=>100*Math.expm1(c*Math.log1p(nom/100/c)),nom:(eff,c)=>100*c*Math.expm1(Math.log1p(eff/100)/c),
 seq:(expr,start,end,step=1)=>{need(Number.isFinite(start)&&Number.isFinite(end)&&step!==0&&(end-start)/step>=0&&(end-start)/step<=9999,'Sequence must contain 1–10,000 values.');const f=fOf(expr,'RAD','n');return Array.from({length:Math.floor((end-start)/step)+1},(_,i)=>f(start+i*step));}
};
math.import(aliases,{override:true});
for(const name of ['ones','zeros','identity','random','randomInt','reshape']){
  const original=math[name];math.import({[name]:(...args)=>{let dims=args.filter(x=>typeof x==='number');if(Array.isArray(array(args[0])))dims=array(args[name==='reshape'?1:0]).flat();if(name!=='random'&&name!=='randomInt')need(dims.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=10000)&&dims.reduce((a,b)=>a*b,1)<=10000,'Requested array exceeds 10,000 cells.');else if(Array.isArray(array(args[0])))need(dims.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=10000)&&dims.reduce((a,b)=>a*b,1)<=10000,'Requested random array is too large.');return original(...args);}},{override:true});
}
const oldRange=math.range;math.import({range:(start,end,step=1)=>{need(Number.isFinite(start)&&Number.isFinite(end)&&Number.isFinite(step)&&step!==0&&Math.abs((end-start)/step)<=10000,'Range is limited to 10,000 entries.');return oldRange(start,end,step);}},{override:true});
function evaluate(expression,mode){const env=environment(mode),result=compile(expression,true).evaluate(env);for(const [k,v]of env)if(!allowed.has(k)){const a=array(v);need(!Array.isArray(a)||a.flat(Infinity).length<=10000,'Stored arrays are limited to 10,000 cells.');scope.set(k,v);}scope.set('Ans',result);return {text:math.format(result,{precision:12}),variables:[...scope.keys()].filter(k=>!['x','t','theta'].includes(k))};}
function graph(data){
  const {mode,angle='RAD',expressions,bounds,start=0,end=6.283185307179586,initial=1}=data;
  need(bounds.every(Number.isFinite)&&bounds[0]<bounds[1]&&bounds[2]<bounds[3],'Window minima must be less than maxima.');need(expressions.length&&expressions.length<=10,'Enter 1–10 expressions.');
  let curves=[];
  for(let i=0;i<expressions.length;i++){
    const expr=expressions[i];let points=[],f,g;
    if(mode==='parametric'){const pair=expr.split(';');need(pair.length===2,'Parametric rows use x(t); y(t).');f=fOf(pair[0],angle,'t');g=fOf(pair[1],angle,'t');}
    else f=fOf(expr,angle,mode==='polar'?'theta':mode==='sequence'?'n':'x');
    const lo=mode==='function'?bounds[0]:start,hi=mode==='function'?bounds[1]:end;
    need(Number.isFinite(lo)&&Number.isFinite(hi)&&hi>lo,'Parameter start must be below end.');
    const count=mode==='sequence'?Math.floor(hi-lo)+1:801;need(count<=2000,'Sequence plots are limited to 2,000 steps.');
    let previous=initial,seqCode,env;
    if(mode==='sequence'){need(Number.isInteger(lo)&&Number.isInteger(hi),'Sequence bounds must be integers.');seqCode=compile(expr);env=environment(angle);}
    for(let j=0;j<count;j++){
      const t=mode==='sequence'?lo+j:lo+(hi-lo)*j/(count-1);let point=null;
      try{if(mode==='parametric')point=[f(t),g(t)];else if(mode==='polar'){const r=f(t),rads=angle==='DEG'?t*Math.PI/180:t;point=[r*Math.cos(rads),r*Math.sin(rads)];}else if(mode==='sequence'){if(j===0)point=[t,initial];else{env.set('n',t);env.set('u',previous);previous=real(seqCode.evaluate(env));point=[t,previous];}}else point=[t,f(t)];}catch{point=null;}
      points.push(point);
    }
    need(points.some(Boolean),`No finite graph values for expression ${i+1}. Check its syntax, variables, and domain.`);curves.push({label:expr,points});
  }
  return {curves,bounds,mode};
}
function program(source,mode){
  const lines=source.split(/\r?\n/).map(s=>s.trim().replace(/^:/,'')).filter(Boolean);need(lines.length<=500,'Programs are limited to 500 lines.');let output=[],steps=0;
  function condition(s){const v=compile(s.replace(/(?<![<>=!])=(?!=)/g,'==')).evaluate(environment(mode));return !!v;}
  function block(start,end){for(let pc=start;pc<end;pc++){
    need(++steps<=10000,'Program stopped at 10,000 steps.');const line=lines[pc];
    if(/^For\(/i.test(line)||/^While\s/i.test(line)||/^If\s/i.test(line)){
      let depth=1,close=pc+1,otherwise=-1;for(;close<end;close++){if(/^(For\(|While\s|If\s)/i.test(lines[close]))depth++;if(/^End$/i.test(lines[close])&&--depth===0)break;if(/^Else$/i.test(lines[close])&&depth===1)otherwise=close;if(!/^End$/i.test(lines[close])){/* depth changes only above */}}
      need(close<end,'Control blocks require End.');
      if(/^For\(/i.test(line)){const m=line.match(/^For\(([A-Za-z]\w*),([^,]+),([^,]+)(?:,([^,]+))?\)$/i);need(m,'For syntax: For(I,1,10,1).');const a=real(compile(m[2]).evaluate(environment(mode))),b=real(compile(m[3]).evaluate(environment(mode))),step=m[4]?real(compile(m[4]).evaluate(environment(mode))):1;need(step!==0,'For step cannot be zero.');for(let v=a;step>0?v<=b:v>=b;v+=step){need(++steps<=10000,'Program stopped at 10,000 steps.');scope.set(m[1],v);block(pc+1,close);}}
      else if(/^While /i.test(line)){while(condition(line.slice(6))){need(++steps<=10000,'Program stopped at 10,000 steps.');block(pc+1,close);}}
      else {const yes=condition(line.slice(3));block(yes?pc+1:otherwise>=0?otherwise+1:close,yes?(otherwise>=0?otherwise:close):close);}
      pc=close;
    }else if(/^Disp\s/i.test(line)){output.push(evaluate(line.slice(5),mode).text);need(output.length<=1000,'Output is limited to 1,000 lines.');}
    else if(/^Then$/i.test(line))continue;
    else if(/^ClrHome$/i.test(line))output=[];
    else if(/^Stop$/i.test(line))throw {stop:true};
    else if(/^(Else|End)$/i.test(line))throw Error('Unexpected '+line);
    else {const store=line.match(/^(.+?)(?:→|->)([A-Za-z]\w*)$/);evaluate(store?store[2]+'=('+store[1]+')':line,mode);}
  }}
  try{block(0,lines.length);}catch(e){if(!e.stop)throw e;}
  return {text:output.join('\n')||'Program completed (no Disp output).',steps};
}
function handle(data){
 const angle=data.angle||'RAD';
 if(data.action==='evaluate')return evaluate(data.expression,angle);
 if(data.action==='reset'){scope.clear();return {text:'Variables cleared.'};}
 if(data.action==='catalog')return [...allowed].filter(name=>typeof math[name]==='function').sort();
 if(data.action==='graph')return graph(data);
 if(data.action==='program')return program(data.source,angle);
 if(data.action==='table'){need(data.count>=1&&data.count<=200&&Number.isInteger(data.count)&&data.step!==0,'Table needs 1–200 rows and a nonzero step.');const fs=data.expressions.map(e=>fOf(e,angle));return Array.from({length:data.count},(_,i)=>{const x=data.start+i*data.step;return [x,...fs.map(f=>{try{return f(x);}catch{return null;}})];});}
 if(data.action==='calculus'){
   const f=fOf(data.expression,angle);let value;
   if(data.operation==='value')value=f(data.a);
   else if(data.operation==='derivative')value=derivative(f,data.a);
   else {need(data.a<data.b,'Lower bound must be less than upper bound.');if(data.operation==='integral')value=integral(f,data.a,data.b);else if(data.operation==='root')value=root(f,data.a,data.b);else if(data.operation==='intersect'){const g=fOf(data.second,angle);value=root(x=>f(x)-g(x),data.a,data.b);}else value=extremum(f,data.a,data.b,data.operation==='max');}
   return {text:typeof value==='object'?`x = ${value.x}\ny = ${value.y}`:`${data.operation} = ${math.format(value,{precision:12})}`,value};
 }
 if(data.action==='finance'){
  const v={...data.values},key=data.solve;let result;
  if(key==='pv'||key==='pmt'||key==='fv'){v[key]=0;const base=tvm(v);v[key]=1;const coefficient=tvm(v)-base;need(coefficient!==0,'Selected unknown has no influence with these inputs.');result=-base/coefficient;}
  else {const low=key==='rate'?-90:0,high=key==='rate'?1000:100000;result=root(x=>tvm({...v,[key]:x}),low,high);}
  return {text:`${key.toUpperCase()} = ${math.format(result,{precision:12})}`,value:result};
 }
 throw Error('Unknown operation.');
}
self.onmessage=event=>{try{const result=handle(event.data);self.postMessage({id:event.data.id,result});}catch(error){self.postMessage({id:event.data.id,error:error.message||String(error)});}};

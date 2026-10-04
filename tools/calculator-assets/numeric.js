"use strict";
/* ============================================================
   SPECIAL FUNCTIONS — the numerical core
   ============================================================ */
const SQRT2 = Math.SQRT2, SQRT2PI = Math.sqrt(2*Math.PI);

function lgamma(x){ // Lanczos, |err| < 2e-10
  const cof=[76.18009172947146,-86.50532032941677,24.01409824083091,
             -1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
  let y=x, tmp=x+5.5;
  tmp -= (x+0.5)*Math.log(tmp);
  let ser=1.000000000190015;
  for(let j=0;j<6;j++) ser += cof[j]/++y;
  return -tmp + Math.log(2.5066282746310005*ser/x);
}
function gammaP(a,x){ // regularized lower incomplete gamma P(a,x)
  if(x<0||a<=0) return NaN;
  if(x===0) return 0;
  if(x===Infinity) return 1;
  if(x < a+1){ // series
    let ap=a, sum=1/a, del=sum;
    for(let n=1;n<500;n++){ ap++; del*=x/ap; sum+=del;
      if(Math.abs(del)<Math.abs(sum)*1e-15) break; }
    return sum*Math.exp(-x+a*Math.log(x)-lgamma(a));
  }
  return 1-gammaQcf(a,x);
}
function gammaQcf(a,x){ // continued fraction for Q(a,x), x>=a+1
  if(x===Infinity) return 0;
  const FPMIN=1e-300;
  let b=x+1-a, c=1/FPMIN, d=1/b, h=d;
  for(let i=1;i<500;i++){
    const an=-i*(i-a);
    b+=2; d=an*d+b; if(Math.abs(d)<FPMIN)d=FPMIN;
    c=b+an/c; if(Math.abs(c)<FPMIN)c=FPMIN;
    d=1/d; const del=d*c; h*=del;
    if(Math.abs(del-1)<1e-15) break;
  }
  return Math.exp(-x+a*Math.log(x)-lgamma(a))*h;
}
const gammaQ=(a,x)=> x<a+1 ? 1-gammaP(a,x) : gammaQcf(a,x);

function betacf(a,b,x){ // Lentz continued fraction for incomplete beta
  const FPMIN=1e-300, qab=a+b, qap=a+1, qam=a-1;
  let c=1, d=1-qab*x/qap;
  if(Math.abs(d)<FPMIN)d=FPMIN;
  d=1/d; let h=d;
  for(let m=1;m<500;m++){
    const m2=2*m;
    let aa=m*(b-m)*x/((qam+m2)*(a+m2));
    d=1+aa*d; if(Math.abs(d)<FPMIN)d=FPMIN;
    c=1+aa/c; if(Math.abs(c)<FPMIN)c=FPMIN;
    d=1/d; h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));
    d=1+aa*d; if(Math.abs(d)<FPMIN)d=FPMIN;
    c=1+aa/c; if(Math.abs(c)<FPMIN)c=FPMIN;
    d=1/d; const del=d*c; h*=del;
    if(Math.abs(del-1)<1e-15) break;
  }
  return h;
}
function ibeta(a,b,x){ // regularized incomplete beta I_x(a,b)
  if(x<=0) return 0; if(x>=1) return 1;
  const bt=Math.exp(lgamma(a+b)-lgamma(a)-lgamma(b)+a*Math.log(x)+b*Math.log(1-x));
  return x < (a+1)/(a+b+2) ? bt*betacf(a,b,x)/a : 1-bt*betacf(b,a,1-x)/b;
}
const erfc = x => x>=0 ? gammaQ(0.5,x*x) : 2-gammaQ(0.5,x*x);
const normCdf = z => 0.5*erfc(-z/SQRT2);
const normPdf = z => Math.exp(-0.5*z*z)/SQRT2PI;

function invNorm(p){ // Acklam + one Halley refinement -> ~1e-15
  if(p<=0) return -Infinity; if(p>=1) return Infinity;
  const a=[-3.969683028665376e1,2.209460984245205e2,-2.759285104469687e2,1.383577518672690e2,-3.066479806614716e1,2.506628277459239],
        b=[-5.447609879822406e1,1.615858368580409e2,-1.556989798598866e2,6.680131188771972e1,-1.328068155288572e1],
        c=[-7.784894002430293e-3,-3.223964580411365e-1,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],
        d=[7.784695709041462e-3,3.224671290700398e-1,2.445134137142996,3.754408661907416];
  const pl=0.02425; let q,r,x;
  if(p<pl){ q=Math.sqrt(-2*Math.log(p));
    x=(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if(p<=1-pl){ q=p-0.5; r=q*q;
    x=(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else { q=Math.sqrt(-2*Math.log(1-p));
    x=-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
  const e=normCdf(x)-p, u=e*SQRT2PI*Math.exp(x*x/2);
  return x - u/(1+x*u/2);
}
/* generic inverse CDF: bracket + bisection/Newton hybrid */
function invCdf(cdf, p, lo, hi, pdf){
  if(p<=0) return lo; if(p>=1) return hi;
  let a=lo, b=hi;
  for(let i=0;i<300&&cdf(b)<p;i++)b=b>0?b*2:1;
  for(let i=0;i<300&&cdf(a)>p&&a<0;i++)a*=2;
  if(!Number.isFinite(a)||!Number.isFinite(b)||cdf(a)>p||cdf(b)<p)return NaN;
  // expand finite brackets if needed handled by caller; bisect 90 steps then polish
  let x=(a+b)/2;
  for(let i=0;i<200;i++){
    x=(a+b)/2;
    const f=cdf(x)-p;
    if(Math.abs(f)<1e-13*Math.min(p,1-p) || (b-a)<Math.abs(x)*1e-14+1e-300) break;
    if(f>0) b=x; else a=x;
  }
  if(pdf){ for(let i=0;i<3;i++){ const g=pdf(x); if(g>1e-300){ const nx=x-(cdf(x)-p)/g;
    if(nx>a&&nx<b) x=nx; } } }
  return x;
}
const lchoose=(n,k)=> lgamma(n+1)-lgamma(k+1)-lgamma(n-k+1);
const choose=(n,k)=> (k<0||k>n)?0:Math.exp(lchoose(n,k));

/* ============================================================
   DISTRIBUTION REGISTRY
   Each: params[{key,label,def,min}], pdf, cdf, inv, mean, sd,
         support(), discrete?, rel? (reliability metrics)
   ============================================================ */
function P(key,label,def,min,max){ return {key,label,def,min,max}; }

const DISTS = [
{ id:"normal", name:"Normal (Gaussian)",
  params:[P("mu","Mean \u03BC",0),P("sig","Std dev \u03C3",1,1e-300)],
  pdf:(x,p)=>normPdf((x-p.mu)/p.sig)/p.sig,
  cdf:(x,p)=>normCdf((x-p.mu)/p.sig),
  inv:(q,p)=>p.mu+p.sig*invNorm(q),
  mean:p=>p.mu, sd:p=>p.sig, support:p=>[-Infinity,Infinity],
  blurb:"The workhorse. X-bar charts, capability, measurement error." },
{ id:"z", name:"Standard Normal (Z)",
  params:[],
  pdf:x=>normPdf(x), cdf:x=>normCdf(x), inv:q=>invNorm(q),
  mean:()=>0, sd:()=>1, support:()=>[-Infinity,Infinity],
  blurb:"Normal with \u03BC = 0, \u03C3 = 1. Z-tables, critical z values." },
{ id:"t", name:"Student's t",
  params:[P("df","Degrees of freedom \u03BD",10,1e-9)],
  pdf:(x,p)=>Math.exp(lgamma((p.df+1)/2)-lgamma(p.df/2))/Math.sqrt(p.df*Math.PI)*Math.pow(1+x*x/p.df,-(p.df+1)/2),
  cdf:(x,p)=>{ const ib=0.5*ibeta(p.df/2,0.5,p.df/(p.df+x*x)); return x>=0?1-ib:ib; },
  inv:(q,p,me)=>invCdf(x=>me.cdf(x,p),q,-1e8,1e8,x=>me.pdf(x,p)),
  mean:p=>p.df>1?0:NaN, sd:p=>p.df>2?Math.sqrt(p.df/(p.df-2)):p.df>1?Infinity:NaN, support:()=>[-Infinity,Infinity],
  blurb:"Small-sample means, t-tests, confidence intervals." },
{ id:"chi2", name:"Chi-square \u03C7\u00B2",
  params:[P("df","Degrees of freedom \u03BD",10,1e-9)],
  pdf:(x,p)=>x<=0?0:Math.exp((p.df/2-1)*Math.log(x)-x/2-lgamma(p.df/2)-(p.df/2)*Math.LN2),
  cdf:(x,p)=>x<=0?0:gammaP(p.df/2,x/2),
  inv:(q,p,me)=>invCdf(x=>me.cdf(x,p),q,0,p.df+200*Math.sqrt(2*p.df)+200,x=>me.pdf(x,p)),
  mean:p=>p.df, sd:p=>Math.sqrt(2*p.df), support:()=>[0,Infinity],
  blurb:"Variance tests, goodness-of-fit, contingency tables." },
{ id:"f", name:"F distribution",
  params:[P("d1","Numerator df",5,1e-9),P("d2","Denominator df",10,1e-9)],
  pdf:(x,p)=>{ if(x<=0)return 0; const{d1,d2}=p;
    return Math.exp(lgamma((d1+d2)/2)-lgamma(d1/2)-lgamma(d2/2)
      +(d1/2)*Math.log(d1/d2)+(d1/2-1)*Math.log(x)-((d1+d2)/2)*Math.log(1+d1*x/d2)); },
  cdf:(x,p)=>x<=0?0:ibeta(p.d1/2,p.d2/2,p.d1*x/(p.d1*x+p.d2)),
  inv:(q,p,me)=>invCdf(x=>me.cdf(x,p),q,0,1e7,x=>me.pdf(x,p)),
  mean:p=>p.d2>2?p.d2/(p.d2-2):NaN,
  sd:p=>p.d2>4?Math.sqrt(2*p.d2*p.d2*(p.d1+p.d2-2)/(p.d1*Math.pow(p.d2-2,2)*(p.d2-4))):NaN,
  support:()=>[0,Infinity],
  blurb:"Ratio of variances, ANOVA, regression significance." },
{ id:"expo", name:"Exponential", rel:true,
  params:[P("lam","Rate \u03BB (failures / unit time)",0.001,1e-300)],
  pdf:(x,p)=>x<0?0:p.lam*Math.exp(-p.lam*x),
  cdf:(x,p)=>x<0?0:-Math.expm1(-p.lam*x),
  inv:(q,p)=>-Math.log1p(-q)/p.lam,
  mean:p=>1/p.lam, sd:p=>1/p.lam, support:()=>[0,Infinity],
  blurb:"Constant failure rate \u2014 useful life region of the bathtub curve. MTBF = 1/\u03BB." },
{ id:"weibull", name:"Weibull (2-parameter)", rel:true,
  params:[P("beta","Shape \u03B2",2,1e-300),P("eta","Scale \u03B7 (characteristic life)",1000,1e-300)],
  pdf:(x,p)=>x<=0?0:(p.beta/p.eta)*Math.pow(x/p.eta,p.beta-1)*Math.exp(-Math.pow(x/p.eta,p.beta)),
  cdf:(x,p)=>x<=0?0:-Math.expm1(-Math.pow(x/p.eta,p.beta)),
  inv:(q,p)=>p.eta*Math.pow(-Math.log1p(-q),1/p.beta),
  mean:p=>p.eta*Math.exp(lgamma(1+1/p.beta)),
  sd:p=>p.eta*Math.sqrt(Math.exp(lgamma(1+2/p.beta))-Math.pow(Math.exp(lgamma(1+1/p.beta)),2)),
  support:()=>[0,Infinity],
  blurb:"The reliability distribution. \u03B2 < 1 infant mortality \u00B7 \u03B2 = 1 random failures \u00B7 \u03B2 > 1 wear-out. At t = \u03B7, F(t) = 63.2% always." },
{ id:"lognormal", name:"Lognormal", rel:true,
  params:[P("mu","Log-mean \u03BC (of ln X)",0),P("sig","Log-sd \u03C3 (of ln X)",1,1e-300)],
  pdf:(x,p)=>x<=0?0:normPdf((Math.log(x)-p.mu)/p.sig)/(x*p.sig),
  cdf:(x,p)=>x<=0?0:normCdf((Math.log(x)-p.mu)/p.sig),
  inv:(q,p)=>Math.exp(p.mu+p.sig*invNorm(q)),
  mean:p=>Math.exp(p.mu+p.sig*p.sig/2),
  sd:p=>Math.sqrt((Math.exp(p.sig*p.sig)-1)*Math.exp(2*p.mu+p.sig*p.sig)),
  support:()=>[0,Infinity],
  blurb:"Fatigue life, crack growth, repair times, chemical concentrations." },
{ id:"gamma", name:"Gamma", rel:true,
  params:[P("k","Shape k",2,1e-300),P("theta","Scale \u03B8",1,1e-300)],
  pdf:(x,p)=>x<=0?0:Math.exp((p.k-1)*Math.log(x)-x/p.theta-lgamma(p.k)-p.k*Math.log(p.theta)),
  cdf:(x,p)=>x<=0?0:gammaP(p.k,x/p.theta),
  inv:(q,p,me)=>invCdf(x=>me.cdf(x,p),q,0,p.k*p.theta+200*Math.sqrt(p.k)*p.theta+200,x=>me.pdf(x,p)),
  mean:p=>p.k*p.theta, sd:p=>Math.sqrt(p.k)*p.theta, support:()=>[0,Infinity],
  blurb:"Time to k-th failure; standby redundancy; generalizes exponential." },
{ id:"uniform", name:"Uniform (continuous)",
  params:[P("a","Lower a",0),P("b","Upper b",1)],
  pdf:(x,p)=>x<p.a||x>p.b?0:1/(p.b-p.a),
  cdf:(x,p)=>x<p.a?0:x>p.b?1:(x-p.a)/(p.b-p.a),
  inv:(q,p)=>p.a+q*(p.b-p.a),
  mean:p=>(p.a+p.b)/2, sd:p=>(p.b-p.a)/Math.sqrt(12), support:p=>[p.a,p.b],
  blurb:"Resolution error of gauges, random number base, worst-case ignorance." },
{ id:"beta", name:"Beta",
  params:[P("al","Shape \u03B1",2,1e-300),P("be","Shape \u03B2",5,1e-300)],
  pdf:(x,p)=>x<=0||x>=1?0:Math.exp((p.al-1)*Math.log(x)+(p.be-1)*Math.log(1-x)+lgamma(p.al+p.be)-lgamma(p.al)-lgamma(p.be)),
  cdf:(x,p)=>ibeta(p.al,p.be,Math.min(Math.max(x,0),1)),
  inv:(q,p,me)=>invCdf(x=>me.cdf(x,p),q,0,1,x=>me.pdf(x,p)),
  mean:p=>p.al/(p.al+p.be),
  sd:p=>Math.sqrt(p.al*p.be/(Math.pow(p.al+p.be,2)*(p.al+p.be+1))),
  support:()=>[0,1],
  blurb:"Proportions and rates on [0,1]; Bayesian priors; PERT estimates." },
{ id:"binomial", name:"Binomial", discrete:true,
  params:[P("n","Trials n",20,1),P("p","Success prob p",0.2,0,1)],
  pdf:(k,p)=>{if(!Number.isInteger(k)||k<0||k>p.n)return 0; if(p.p===0)return k===0?1:0; if(p.p===1)return k===p.n?1:0;
    return Math.exp(lchoose(p.n,k)+k*Math.log(p.p)+(p.n-k)*Math.log(1-p.p));},
  cdf:(k,p)=>{k=Math.floor(k); if(k<0)return 0; if(k>=p.n)return 1;
    return ibeta(p.n-k,k+1,1-p.p);},
  mean:p=>p.n*p.p, sd:p=>Math.sqrt(p.n*p.p*(1-p.p)), support:p=>[0,p.n],
  blurb:"Number of defectives in a sample of n \u2014 p-charts, np-charts, acceptance sampling." },
{ id:"poisson", name:"Poisson", discrete:true,
  params:[P("lam","Mean rate \u03BB",4,1e-300)],
  pdf:(k,p)=>{if(!Number.isInteger(k)||k<0)return 0;
    return Math.exp(-p.lam+k*Math.log(p.lam)-lgamma(k+1));},
  cdf:(k,p)=>{k=Math.floor(k); return k<0?0:gammaQ(k+1,p.lam);},
  mean:p=>p.lam, sd:p=>Math.sqrt(p.lam), support:p=>[0,Math.max(20,Math.ceil(p.lam+5*Math.sqrt(p.lam)))],
  blurb:"Defects per unit \u2014 c-charts, u-charts, arrival counts." },
{ id:"geometric", name:"Geometric", discrete:true,
  params:[P("p","Success prob p",0.2,1e-12,1)],
  pdf:(k,pp)=>{return !Number.isInteger(k)||k<1?0:pp.p*Math.pow(1-pp.p,k-1);},
  cdf:(k,pp)=>{k=Math.floor(k); return k<1?0:1-Math.pow(1-pp.p,k);},
  mean:pp=>1/pp.p, sd:pp=>Math.sqrt(1-pp.p)/pp.p,
  support:pp=>[1,Math.max(15,Math.ceil(6/pp.p))],
  blurb:"Trials until first success/failure \u2014 e.g. units inspected until first defect. Support: k = 1, 2, \u2026" },
{ id:"negbinom", name:"Negative Binomial", discrete:true,
  params:[P("r","Successes required r",3,1),P("p","Success prob p",0.2,1e-12,1)],
  pdf:(k,pp)=>{if(!Number.isInteger(k)||k<pp.r)return 0; if(pp.p===1)return k===pp.r?1:0;
    return Math.exp(lchoose(k-1,pp.r-1)+pp.r*Math.log(pp.p)+(k-pp.r)*Math.log(1-pp.p));},
  cdf:(k,pp)=>{k=Math.floor(k); return k<pp.r?0:ibeta(pp.r,k-pp.r+1,pp.p);},
  mean:pp=>pp.r/pp.p, sd:pp=>Math.sqrt(pp.r*(1-pp.p))/pp.p,
  support:pp=>[pp.r,Math.ceil(pp.r/pp.p+6*Math.sqrt(pp.r*(1-pp.p))/pp.p)],
  blurb:"Trials until the r-th success. X counts total trials; support starts at r." },
{ id:"hypergeom", name:"Hypergeometric", discrete:true,
  params:[P("N","Population N",100,1),P("K","Successes in population K",20,0),P("n","Sample size n",10,1)],
  pdf:(k,p)=>{if(!Number.isInteger(k))return 0;
    if(k<Math.max(0,p.n+p.K-p.N)||k>Math.min(p.n,p.K))return 0;
    return Math.exp(lchoose(p.K,k)+lchoose(p.N-p.K,p.n-k)-lchoose(p.N,p.n));},
  cdf:function(k,p){ k=Math.floor(k); let s=0;
    for(let i=Math.max(0,p.n+p.K-p.N); i<=Math.min(k,Math.min(p.n,p.K)); i++) s+=this.pdf(i,p);
    return Math.min(s,1);},
  mean:p=>p.n*p.K/p.N,
  sd:p=>p.N===1?0:Math.sqrt(p.n*(p.K/p.N)*(1-p.K/p.N)*(p.N-p.n)/(p.N-1)),
  support:p=>[Math.max(0,p.n+p.K-p.N),Math.min(p.n,p.K)],
  blurb:"Sampling without replacement from a finite lot \u2014 exact acceptance sampling." }
];
/* Inverse CDFs for discrete distributions: expand the bracket, then binary search.
   Plot support is only a display range, never a quantile bound. */
DISTS.forEach(D=>{ if(D.discrete){
  D.inv = (q,p)=>{
    const [lower,upper]=D.support(p); let lo=lower,hi=upper;
    while(D.cdf(hi,p)<q && hi<Number.MAX_SAFE_INTEGER/2) hi=Math.max(hi+1,hi*2);
    if(D.cdf(hi,p)<q) return NaN;
    while(lo<hi){const mid=Math.floor(lo+(hi-lo)/2);if(D.cdf(mid,p)>=q) hi=mid;else lo=mid+1;}
    return lo;
  };
}});
// Direct upper tails avoid losing small probabilities to 1 - CDF cancellation.
function upperTail(D,x,p){
  switch(D.id){
    case "normal": return normCdf(-(x-p.mu)/p.sig);
    case "z": return normCdf(-x);
    case "t": return D.cdf(-x,p);
    case "chi2": return x<=0?1:gammaQ(p.df/2,x/2);
    case "f": return x<=0?1:ibeta(p.d2/2,p.d1/2,p.d2/(p.d2+p.d1*x));
    case "expo": return x<0?1:Math.exp(-p.lam*x);
    case "weibull": return x<=0?1:Math.exp(-Math.pow(x/p.eta,p.beta));
    case "lognormal": return x<=0?1:normCdf(-(Math.log(x)-p.mu)/p.sig);
    case "gamma": return x<=0?1:gammaQ(p.k,x/p.theta);
    case "beta": return ibeta(p.be,p.al,1-Math.min(1,Math.max(0,x)));
    case "binomial": {const k=Math.ceil(x);return k<=0?1:k>p.n?0:ibeta(k,p.n-k+1,p.p);}
    case "poisson": {const k=Math.ceil(x);return k<=0?1:gammaP(k,p.lam);}
    case "geometric": return Math.pow(1-p.p,Math.max(0,Math.ceil(x)-1));
    case "negbinom": {const k=Math.ceil(x);return k<=p.r?1:ibeta(k-p.r,p.r,1-p.p);}
    default: return Math.max(0,1-D.cdf(D.discrete?Math.ceil(x)-1:x,p));
  }
}
function strictNumber(raw){return typeof raw==='string' && raw.trim() && /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw.trim()) ? Number(raw) : NaN;}

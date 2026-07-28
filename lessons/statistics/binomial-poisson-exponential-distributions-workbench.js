((app) => {
  "use strict";
  const { $, setupCanvas, css, ussClamp, ussPercent, ussBinomialPmf, ussPoissonPmf, ussDiscreteCdf } = app;
  // Unified workbench
  const ussWorkbenchEls = ["wbModel","wbQuestion","wbN","wbP","wbRate","wbExposure","wbX1","wbX2"].map($);
  const ussSyncWorkbenchFields = () => {
    const model=$("wbModel").value, question=$("wbQuestion").value;
    $("wbNGroup").hidden=model!=="binomial";$("wbPGroup").hidden=model!=="binomial";$("wbRateGroup").hidden=model==="binomial";$("wbExposureGroup").hidden=model==="binomial";
    if(model==="exponential" && question==="exact") $("wbQuestion").value="atMost";
    $("wbX2Group").hidden=$("wbQuestion").value!=="between";
    $("wbX1Label").textContent=model==="exponential"?($("wbQuestion").value==="atLeast"?"Waiting threshold t":"Lower time t₁"):"Count x";
    $("wbX2Label").textContent=model==="exponential"?"Upper time t₂":"Upper count x₂";
  };
  const ussValidateWorkbench = () => {
    const model=$("wbModel").value,q=$("wbQuestion").value,n=Number($("wbN").value),p=Number($("wbP").value),rate=Number($("wbRate").value),exposure=Number($("wbExposure").value),x1=Number($("wbX1").value),x2=Number($("wbX2").value),errors=[];
    if(model==="binomial" && (!Number.isInteger(n)||n<1||n>500)) errors.push("n must be a whole number from 1 to 500.");
    if(model==="binomial" && (!(p>=0&&p<=1))) errors.push("p must be between 0 and 1.");
    if(model!=="binomial" && !(rate>0)) errors.push("λ must be greater than zero.");
    if(model!=="binomial" && !(exposure>=0)) errors.push("Exposure must be non-negative.");
    if(model!=="exponential" && (!Number.isInteger(x1)||x1<0)) errors.push("Count x must be a non-negative whole number.");
    if(model==="binomial" && x1>n) errors.push("For Binomial, x cannot exceed n.");
    if(model==="exponential" && x1<0) errors.push("Waiting time must be non-negative.");
    if(q==="between" && (!(x2>=x1))) errors.push("The upper value must be at least the lower value.");
    if(q==="between" && model!=="exponential" && !Number.isInteger(x2)) errors.push("The upper count must be a whole number.");
    if(q==="between" && model==="binomial" && x2>n) errors.push("For Binomial, the upper count cannot exceed n.");
    return{model,q,n,p,rate,exposure,x1,x2,errors};
  };
  const ussDrawWorkbench = (v, probability, range) => {
    if (!$("workbenchCanvas")) return;
    const {ctx,w,h}=setupCanvas($("workbenchCanvas")),pad={l:48,r:16,t:25,b:48},plotW=w-pad.l-pad.r,plotH=h-pad.t-pad.b;
    ctx.strokeStyle=css("--line");ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,h-pad.b);ctx.lineTo(w-pad.r,h-pad.b);ctx.stroke();
    if(v.model==="exponential"){
      const maxT=Math.max(v.x2||0,v.x1,5/v.rate);const pts=[];let ymax=v.rate;for(let i=0;i<=180;i++){const t=maxT*i/180,y=v.rate*Math.exp(-v.rate*t);pts.push({t,y});}
      const x=t=>pad.l+t/maxT*plotW,y=d=>pad.t+(ymax-d)/ymax*plotH;
      const shade=pts.filter(pt=>pt.t>=range[0]&&pt.t<=range[1]);if(shade.length){ctx.fillStyle=css("--brand");ctx.globalAlpha=.22;ctx.beginPath();ctx.moveTo(x(shade[0].t),h-pad.b);shade.forEach(pt=>ctx.lineTo(x(pt.t),y(pt.y)));ctx.lineTo(x(shade[shade.length-1].t),h-pad.b);ctx.closePath();ctx.fill();ctx.globalAlpha=1;}
      ctx.strokeStyle=css("--brand");ctx.lineWidth=3;ctx.beginPath();pts.forEach((pt,i)=>i?ctx.lineTo(x(pt.t),y(pt.y)):ctx.moveTo(x(pt.t),y(pt.y)));ctx.stroke();ctx.fillStyle=css("--muted");ctx.font="11px system-ui";ctx.textAlign="center";for(let i=0;i<=5;i++)ctx.fillText((maxT*i/5).toFixed(1),x(maxT*i/5),h-pad.b+18);ctx.fillText("Waiting time or distance",pad.l+plotW/2,h-8);
    }else{
      const mu=v.model==="binomial"?v.n*v.p:v.rate*v.exposure;const maxX=v.model==="binomial"?Math.min(v.n,Math.max(12,Math.ceil(mu+5*Math.sqrt(Math.max(mu*(1-(v.p||0)),1))))):Math.max(12,Math.ceil(mu+5*Math.sqrt(Math.max(mu,1))));const pmf=v.model==="binomial"?(x=>ussBinomialPmf(v.n,v.p,x)):(x=>ussPoissonPmf(mu,x));let ymax=0;const vals=[];for(let x=0;x<=maxX;x++){const p=pmf(x);vals.push({x,p});ymax=Math.max(ymax,p);}const bw=plotW/(maxX+1);vals.forEach(item=>{const bh=item.p/ymax*(plotH-8);const selected=item.x>=range[0]&&item.x<=range[1];ctx.fillStyle=selected?css("--brand"):css("--line");ctx.fillRect(pad.l+item.x*bw+1,h-pad.b-bh,Math.max(1,bw-2),bh);});ctx.fillStyle=css("--muted");ctx.font="11px system-ui";ctx.textAlign="center";for(let x=0;x<=maxX;x+=Math.max(1,Math.ceil((maxX+1)/10)))ctx.fillText(String(x),pad.l+(x+.5)*bw,h-pad.b+18);ctx.fillText("Count x",pad.l+plotW/2,h-8);
    }
    $("workbenchDescription").textContent="Highlighted probability region = " + ussPercent(probability,3) + ".";
  };
  const ussCalculateWorkbench = () => {
    ussSyncWorkbenchFields();const v=ussValidateWorkbench(),err=$("wbError");if(v.errors.length){err.hidden=false;err.textContent=v.errors.join(" ");$("wbProbability").textContent="—";return;}err.hidden=true;
    let probability=0,method="",interpretation="",range=[0,0];
    if(v.model==="binomial"){
      const pmf=x=>ussBinomialPmf(v.n,v.p,x),cdf=x=>x<0?0:ussDiscreteCdf(pmf,Math.min(v.n,Math.floor(x)));
      if(v.q==="exact"){probability=pmf(v.x1);range=[v.x1,v.x1];method="P(X="+v.x1+") = C("+v.n+","+v.x1+")("+v.p+")^"+v.x1+"(1−"+v.p+")^("+(v.n-v.x1)+")";interpretation="Probability of exactly "+v.x1+" selected outcomes in "+v.n+" trials.";}
      if(v.q==="atMost"){probability=cdf(v.x1);range=[0,v.x1];method="P(X≤"+v.x1+") = Σ P(X=x), x=0…"+v.x1;interpretation="Probability of no more than "+v.x1+" selected outcomes.";}
      if(v.q==="atLeast"){probability=1-cdf(v.x1-1);range=[v.x1,v.n];method="P(X≥"+v.x1+") = 1 − P(X≤"+(v.x1-1)+")";interpretation="Probability of "+v.x1+" or more selected outcomes.";}
      if(v.q==="between"){probability=cdf(v.x2)-cdf(v.x1-1);range=[v.x1,v.x2];method="P("+v.x1+"≤X≤"+v.x2+") = P(X≤"+v.x2+") − P(X≤"+(v.x1-1)+")";interpretation="Probability of an inclusive count from "+v.x1+" through "+v.x2+".";}
    } else if(v.model==="poisson") {
      const mu=v.rate*v.exposure,pmf=x=>ussPoissonPmf(mu,x),cdf=x=>x<0?0:ussDiscreteCdf(pmf,Math.floor(x));
      if(v.q==="exact"){probability=pmf(v.x1);range=[v.x1,v.x1];method="μ = λt = "+v.rate+"×"+v.exposure+" = "+mu.toFixed(4)+"\nP(X="+v.x1+") = e^(−μ)μ^x/x!";interpretation="Probability of exactly "+v.x1+" events in the selected exposure.";}
      if(v.q==="atMost"){probability=cdf(v.x1);range=[0,v.x1];method="μ = "+mu.toFixed(4)+"\nP(X≤"+v.x1+") = Σ P(X=x), x=0…"+v.x1;interpretation="Probability of no more than "+v.x1+" events.";}
      if(v.q==="atLeast"){probability=1-cdf(v.x1-1);range=[v.x1,Number.POSITIVE_INFINITY];method="μ = "+mu.toFixed(4)+"\nP(X≥"+v.x1+") = 1 − P(X≤"+(v.x1-1)+")";interpretation="Probability of "+v.x1+" or more events.";}
      if(v.q==="between"){probability=cdf(v.x2)-cdf(v.x1-1);range=[v.x1,v.x2];method="μ = "+mu.toFixed(4)+"\nP("+v.x1+"≤X≤"+v.x2+") = CDF("+v.x2+") − CDF("+(v.x1-1)+")";interpretation="Probability of an inclusive event count from "+v.x1+" through "+v.x2+".";}
    } else {
      const lambda=v.rate;
      if(v.q==="atMost"){probability=1-Math.exp(-lambda*v.x1);range=[0,v.x1];method="P(T≤t) = 1 − e^(−λt)\n= 1 − e^(−"+lambda+"×"+v.x1+")";interpretation="Probability the next event occurs by "+v.x1+" exposure units.";}
      if(v.q==="atLeast"){probability=Math.exp(-lambda*v.x1);range=[v.x1,Math.max(v.x1,5/lambda)];method="P(T>t) = e^(−λt)\n= e^(−"+lambda+"×"+v.x1+")";interpretation="Probability of waiting longer than "+v.x1+" exposure units.";}
      if(v.q==="between"){probability=Math.exp(-lambda*v.x1)-Math.exp(-lambda*v.x2);range=[v.x1,v.x2];method="P(t₁<T≤t₂) = e^(−λt₁) − e^(−λt₂)";interpretation="Probability the next event occurs after "+v.x1+" but no later than "+v.x2+" exposure units.";}
    }
    probability=ussClamp(probability,0,1);$("wbProbability").textContent=ussPercent(probability,4);$("wbInterpretation").textContent=interpretation;$("wbMethod").textContent=method;ussDrawWorkbench(v,probability,range);
  };
  $("wbModel").addEventListener("change",()=>{ussSyncWorkbenchFields();ussCalculateWorkbench();});$("wbQuestion").addEventListener("change",()=>{ussSyncWorkbenchFields();ussCalculateWorkbench();});ussWorkbenchEls.slice(2).forEach(input=>{input.addEventListener("input",()=>{if(!$("wbError").hidden)ussCalculateWorkbench();});});
  $("wbCalculateBtn").addEventListener("click",ussCalculateWorkbench);
  $("wbSampleBtn").addEventListener("click",()=>{$("wbModel").value="poisson";$("wbQuestion").value="atLeast";$("wbRate").value=1.5;$("wbExposure").value=2;$("wbX1").value=5;ussSyncWorkbenchFields();ussCalculateWorkbench();});
  $("wbResetBtn").addEventListener("click",()=>{$("wbModel").value="binomial";$("wbQuestion").value="exact";$("wbN").value=20;$("wbP").value=.10;$("wbRate").value=2;$("wbExposure").value=1;$("wbX1").value=2;$("wbX2").value=4;ussSyncWorkbenchFields();ussCalculateWorkbench();});

  app.redrawCore = () => {
    app.redrawApproximation();
    ussCalculateWorkbench();
  };
  ussSyncWorkbenchFields();
  ussCalculateWorkbench();
})(window.UpSkillBPE);

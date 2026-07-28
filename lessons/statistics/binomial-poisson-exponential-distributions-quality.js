((app) => {
  "use strict";
  const { $, root, syncThemeButton, css, setupCanvas, drawAll, drawBinomial } = app;
  // c/u chart lab
  const ussAttributeDefaults={defects:[4,5,3,6,2,5,4,11],equal:[2,2,2,2,2,2,2,2],unequal:[2,4,3,6,5,2.5,7,4]};
  const ussLoadAttributeData=(opportunities)=>{ussAttributeDefaults.defects.forEach((d,i)=>{$("attrDefects"+(i+1)).value=d;$("attrOpportunity"+(i+1)).value=opportunities[i];});ussAnalyzeAttribute();};
  const ussReadAttribute=()=>{const defects=[],opportunities=[],errors=[];for(let i=1;i<=8;i++){const d=Number($("attrDefects"+i).value),n=Number($("attrOpportunity"+i).value);if(!Number.isInteger(d)||d<0)errors.push("Sample "+i+" defects must be a non-negative whole number.");if(!(n>0))errors.push("Sample "+i+" opportunity must be greater than zero.");defects.push(d);opportunities.push(n);}return{defects,opportunities,errors};};
  const ussDrawAttributeChart=(result) => {
    if(!$("attributeCanvas"))return;const {ctx,w,h}=setupCanvas($("attributeCanvas")),pad={l:48,r:16,t:24,b:46},plotW=w-pad.l-pad.r,plotH=h-pad.t-pad.b;
    if(!result){ctx.fillStyle=css("--muted");ctx.font="14px system-ui";ctx.textAlign="center";ctx.fillText("Enter valid data and analyze.",w/2,h/2);return;}
    const all=[...result.values,...result.ucl,...result.lcl,[result.center]].flat(),maxY=Math.max(1,...all)*1.12,x=i=>pad.l+i/(result.values.length-1)*plotW,y=v=>pad.t+(maxY-v)/maxY*plotH;
    ctx.strokeStyle=css("--line");ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,h-pad.b);ctx.lineTo(w-pad.r,h-pad.b);ctx.stroke();
    const drawLine=(values,color,dash=[])=>{ctx.strokeStyle=color;ctx.lineWidth=2;ctx.setLineDash(dash);ctx.beginPath();values.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.stroke();ctx.setLineDash([]);};
    drawLine(Array(result.values.length).fill(result.center),css("--good"));drawLine(result.ucl,css("--accent"),[6,5]);drawLine(result.lcl,css("--accent"),[6,5]);drawLine(result.values,css("--brand"));
    result.values.forEach((v,i)=>{const out=v>result.ucl[i]||v<result.lcl[i];ctx.fillStyle=out?css("--bad"):css("--brand");ctx.beginPath();ctx.arc(x(i),y(v),out?6:5,0,Math.PI*2);ctx.fill();ctx.fillStyle=css("--muted");ctx.font="11px system-ui";ctx.textAlign="center";ctx.fillText(String(i+1),x(i),h-pad.b+18);});ctx.fillText("Sample",pad.l+plotW/2,h-8);
  };
  const ussAnalyzeAttribute=()=>{const data=ussReadAttribute(),message=$("attributeMessage");if(data.errors.length){message.className="status-line warn";message.textContent=data.errors.join(" ");ussDrawAttributeChart(null);return;}const equal=data.opportunities.every(v=>Math.abs(v-data.opportunities[0])<1e-9),rates=data.defects.map((d,i)=>d/data.opportunities[i]);rates.forEach((v,i)=>$("attrRate"+(i+1)).textContent=v.toFixed(3));let result;
    if(equal){const cbar=data.defects.reduce((a,b)=>a+b,0)/data.defects.length,ucl=Math.max(0,cbar+3*Math.sqrt(cbar)),lcl=Math.max(0,cbar-3*Math.sqrt(cbar));result={type:"c",values:data.defects,center:cbar,ucl:Array(8).fill(ucl),lcl:Array(8).fill(lcl)};}
    else{const ubar=data.defects.reduce((a,b)=>a+b,0)/data.opportunities.reduce((a,b)=>a+b,0),ucl=data.opportunities.map(n=>ubar+3*Math.sqrt(ubar/n)),lcl=data.opportunities.map(n=>Math.max(0,ubar-3*Math.sqrt(ubar/n)));result={type:"u",values:rates,center:ubar,ucl,lcl};}
    const signals=result.values.map((v,i)=>v>result.ucl[i]||v<result.lcl[i]?i+1:null).filter(Boolean);message.className="status-line "+(signals.length?"warn":"good");message.innerHTML="<strong>Selected chart: "+result.type+" chart.</strong> "+(equal?"Inspection opportunity is equal, so raw defect counts are comparable.":"Inspection opportunity varies, so defects per opportunity are plotted and the limits vary by sample.")+(signals.length?" Potential 3σ signal(s): sample "+signals.join(", ")+".":" No points exceed the basic 3σ limits in this sample.");$("attributeDescription").textContent=(result.type==="c"?"c chart of defect counts":"u chart of defects per opportunity")+" with center line and 3σ limits.";ussDrawAttributeChart(result);ussLastAttributeResult=result;};
  let ussLastAttributeResult=null;
  $("analyzeAttributeBtn").addEventListener("click",ussAnalyzeAttribute);$("equalOpportunityBtn").addEventListener("click",()=>ussLoadAttributeData(ussAttributeDefaults.equal));$("unequalOpportunityBtn").addEventListener("click",()=>ussLoadAttributeData(ussAttributeDefaults.unequal));$("resetAttributeBtn").addEventListener("click",()=>ussLoadAttributeData(ussAttributeDefaults.equal));

  // Assumption checker
  const ussAssumptions={
    binomial:["A fixed number of trials is defined before observing the results.","Each trial has two mutually exclusive outcomes for the selected response.","The selected-outcome probability is reasonably constant across trials.","Trials are independent or dependence is negligible for the decision."],
    poisson:["The response is a non-negative count of events in a defined exposure.","Events occur independently rather than in unexplained clusters.","The average event rate is reasonably constant over the exposure being modelled.","The opportunity is measured consistently and simultaneous events are negligible in the idealized model."],
    exponential:["The response is a continuous waiting time or distance to the next event.","The underlying events are approximately independent.","The event rate or hazard is reasonably constant over the range of interest.","There is no strong aging, seasonality, clustering, or preventative-maintenance effect that changes the hazard."]
  };
  const ussRenderAssumptions=()=>{const model=$("assumptionModel").value;$("assumptionList").innerHTML=ussAssumptions[model].map((text,i)=>'<label class="assumption-item"><input type="checkbox" data-assumption-index="'+i+'"/><span><strong>Condition '+(i+1)+'</strong><br>'+text+'</span></label>').join("");document.querySelectorAll("[data-assumption-index]").forEach(input=>input.addEventListener("change",ussUpdateAssumptionResult));ussUpdateAssumptionResult();};
  const ussUpdateAssumptionResult=()=>{const checks=[...document.querySelectorAll("[data-assumption-index]")],met=checks.filter(x=>x.checked).length,total=checks.length,result=$("assumptionResult");result.className="status-line "+(met===total?"good":"warn");result.textContent=met===total?"All screening conditions are marked as reasonably supported. Continue with diagnostics and practical validation.":met+" of "+total+" conditions are supported. Investigate the unchecked assumptions before relying on the model.";};
  $("assumptionModel").addEventListener("change",ussRenderAssumptions);$("assumptionAllBtn").addEventListener("click",()=>{document.querySelectorAll("[data-assumption-index]").forEach(x=>x.checked=true);ussUpdateAssumptionResult();});$("assumptionResetBtn").addEventListener("click",()=>{document.querySelectorAll("[data-assumption-index]").forEach(x=>x.checked=false);ussUpdateAssumptionResult();});

  // Practice extension reveal
  $("revealExtensionBtn").addEventListener("click",()=>{const answer=$("extensionAnswer"),show=!answer.classList.contains("show");answer.classList.toggle("show",show);$("revealExtensionBtn").setAttribute("aria-expanded",String(show));$("revealExtensionBtn").textContent=show?"Hide extension answer":"Reveal extension answer";});

  new MutationObserver(mutations => {
    if (mutations.some(item => item.attributeName === "data-theme")) {
      syncThemeButton();
      drawAll();
      drawBinomial();
      app.redrawCore();
      ussDrawAttributeChart(ussLastAttributeResult);
    }
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  ussLoadAttributeData(ussAttributeDefaults.equal);
  ussRenderAssumptions();
})(window.UpSkillBPE);

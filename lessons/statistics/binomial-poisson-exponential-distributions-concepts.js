((app) => {
  "use strict";
  const { $, setupCanvas, css } = app;
  /* ==================================================
     ADDITIVE INTERACTIVE ENHANCEMENTS
     ================================================== */
  const ussClamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const ussPercent = (value, digits = 2) => (value * 100).toFixed(digits) + "%";
  const ussLogFactorial = (n) => {
    let total = 0;
    for (let i = 2; i <= n; i++) total += Math.log(i);
    return total;
  };
  const ussBinomialPmf = (n, p, x) => {
    if (!Number.isInteger(n) || !Number.isInteger(x) || x < 0 || x > n || p < 0 || p > 1) return 0;
    if (p === 0) return x === 0 ? 1 : 0;
    if (p === 1) return x === n ? 1 : 0;
    const logP = ussLogFactorial(n) - ussLogFactorial(x) - ussLogFactorial(n - x) + x * Math.log(p) + (n - x) * Math.log(1 - p);
    return Math.exp(logP);
  };
  const ussPoissonPmf = (mu, x) => {
    if (!(mu >= 0) || !Number.isInteger(x) || x < 0) return 0;
    if (mu === 0) return x === 0 ? 1 : 0;
    return Math.exp(-mu + x * Math.log(mu) - ussLogFactorial(x));
  };
  const ussDiscreteCdf = (pmf, upper) => {
    let sum = 0;
    for (let i = 0; i <= upper; i++) sum += pmf(i);
    return ussClamp(sum, 0, 1);
  };

  // Model selector
  const ussScenarios = [
    {title:"Incoming inspection",text:"A supplier ships 40 coils. Each coil is classified as accepted or rejected. What models the number rejected?",answer:"binomial",clues:["fixed n = 40","two outcomes per coil","bounded count"],why:"There are 40 fixed, approximately independent accept/reject trials."},
    {title:"Surface inspection",text:"An inspector counts all inclusions found in each 10 m² plate area. Several inclusions can occur in one area.",answer:"poisson",clues:["event count","fixed area","multiple events possible"],why:"This is an event count within a fixed opportunity."},
    {title:"Reliability response",text:"The response is operating hours from one breakdown until the next, assuming a stable breakdown rate.",answer:"exponential",clues:["continuous time","gap between events","constant-rate assumption"],why:"The measured response is the waiting time between Poisson events."},
    {title:"Changing workload",text:"Call arrivals surge at shift change and fall overnight, but one constant hourly rate is proposed for the entire day.",answer:"neither",clues:["rate changes","time pattern","stationarity violated"],why:"A single stationary Poisson model is questionable; stratify by time or model the changing rate."},
    {title:"Weld testing",text:"Out of 15 welds, how many fail a bend test when each weld is pass/fail?",answer:"binomial",clues:["15 trials","pass/fail","selected outcomes"],why:"The number of failures is bounded by the 15 trials."},
    {title:"Defects per coil",text:"How many pinholes appear along the next 500 m of coated strip?",answer:"poisson",clues:["count","fixed length","random events"],why:"Pinholes are events counted in a fixed length."},
    {title:"Distance to defect",text:"How many metres of strip are produced before the next pinhole?",answer:"exponential",clues:["continuous distance","until next event","gap"],why:"Distance until the next event is an Exponential-type response under a constant-rate process."},
    {title:"Clustered damage",text:"Most days have no scratches, but handling incidents create bursts of many scratches at once. Variance greatly exceeds the mean.",answer:"neither",clues:["clustering","overdispersion","bursts"],why:"A basic Poisson process assumes independent events at a stable rate; clustering suggests another model or stratification."},
    {title:"Audit findings",text:"Each of 100 records is classified as complete or incomplete. What models the number incomplete?",answer:"binomial",clues:["100 records","binary result","bounded by 100"],why:"This is a fixed number of two-outcome trials."},
    {title:"Customer arrivals",text:"How many customers arrive at one counter during a 15-minute interval when arrivals are independent and the rate is stable?",answer:"poisson",clues:["arrival count","fixed time","stable rate"],why:"This is a count of random arrivals in a fixed interval."},
    {title:"Next arrival",text:"How many minutes until the next customer arrives under the same stable-rate process?",answer:"exponential",clues:["continuous minutes","next arrival","waiting time"],why:"Waiting time to the next Poisson event is Exponential."},
    {title:"Aging component",text:"The failure hazard increases sharply with age because of wear-out. Should a constant-hazard Exponential model be assumed?",answer:"neither",clues:["aging","increasing hazard","constant rate violated"],why:"Wear-out contradicts the constant-hazard assumption; a Weibull model may be more suitable."}
  ];
  let ussScenarioIndex = 0;
  let ussSelectorCorrect = 0;
  let ussSelectorAttempted = 0;
  let ussSelectorAnswered = false;
  const ussRenderScenario = () => {
    const scenario = ussScenarios[ussScenarioIndex];
    $("selectorTitle").textContent = scenario.title;
    $("selectorText").textContent = scenario.text;
    $("selectorClues").innerHTML = scenario.clues.map(clue => '<span class="pill">' + clue + '</span>').join("");
    $("selectorFeedback").className = "status-line";
    $("selectorFeedback").textContent = "Choose the model that matches how the response is generated.";
    document.querySelectorAll("[data-model-answer]").forEach(button => button.classList.remove("correct","incorrect"));
    ussSelectorAnswered = false;
  };
  const ussUpdateSelectorScore = () => {
    $("selectorCorrect").textContent = ussSelectorCorrect;
    $("selectorAttempted").textContent = ussSelectorAttempted;
    $("selectorAccuracy").textContent = ussSelectorAttempted ? Math.round(100 * ussSelectorCorrect / ussSelectorAttempted) + "%" : "0%";
  };
  document.querySelectorAll("[data-model-answer]").forEach(button => {
    button.addEventListener("click", () => {
      if (ussSelectorAnswered) return;
      ussSelectorAnswered = true;
      ussSelectorAttempted++;
      const scenario = ussScenarios[ussScenarioIndex];
      const selected = button.dataset.modelAnswer;
      const correct = selected === scenario.answer;
      if (correct) ussSelectorCorrect++;
      button.classList.add(correct ? "correct" : "incorrect");
      const correctButton = document.querySelector('[data-model-answer="' + scenario.answer + '"]');
      if (correctButton) correctButton.classList.add("correct");
      $("selectorFeedback").className = "status-line " + (correct ? "good" : "warn");
      $("selectorFeedback").textContent = (correct ? "Correct. " : "Not quite. ") + scenario.why;
      ussUpdateSelectorScore();
    });
  });
  $("nextScenarioBtn").addEventListener("click", () => { ussScenarioIndex = (ussScenarioIndex + 1) % ussScenarios.length; ussRenderScenario(); });
  $("resetSelectorBtn").addEventListener("click", () => { ussScenarioIndex = 0; ussSelectorCorrect = 0; ussSelectorAttempted = 0; ussUpdateSelectorScore(); ussRenderScenario(); });

  // Rare-event approximation
  const ussDrawApproximation = () => {
    if (!$("approxCanvas")) return;
    const n = Number($("approxN").value);
    const p = Number($("approxP").value);
    const selectedX = Number($("approxX").value);
    const mu = n * p;
    $("approxNValue").textContent = n;
    $("approxPValue").textContent = p.toFixed(3);
    $("approxXValue").textContent = selectedX;
    $("approxMu").textContent = mu.toFixed(3);
    const binProb = ussBinomialPmf(n,p,selectedX);
    const poiProb = ussPoissonPmf(mu,selectedX);
    $("approxBinProb").textContent = ussPercent(binProb,3);
    $("approxPoiProb").textContent = ussPercent(poiProb,3);
    const maxX = Math.min(35, Math.max(10, Math.ceil(mu + 5 * Math.sqrt(Math.max(mu,1)))));
    $("approxX").max = maxX;
    if (selectedX > maxX) { $("approxX").value = maxX; return ussDrawApproximation(); }
    let tv = 0;
    for (let x=0; x<=Math.max(n,maxX); x++) tv += Math.abs(ussBinomialPmf(n,p,x)-ussPoissonPmf(mu,x));
    tv *= .5;
    const {ctx,w,h} = setupCanvas($("approxCanvas"));
    const pad={l:44,r:16,t:24,b:46}, plotW=w-pad.l-pad.r, plotH=h-pad.t-pad.b;
    const values=[]; let ymax=0;
    for(let x=0;x<=maxX;x++){const b=ussBinomialPmf(n,p,x),q=ussPoissonPmf(mu,x);values.push({x,b,q});ymax=Math.max(ymax,b,q);}
    ctx.strokeStyle=css("--line");ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,h-pad.b);ctx.lineTo(w-pad.r,h-pad.b);ctx.stroke();
    const groupW=plotW/(maxX+1), barW=Math.max(2,groupW*.32);
    values.forEach(v=>{const x0=pad.l+v.x*groupW+groupW*.18;const bh=v.b/ymax*(plotH-10),qh=v.q/ymax*(plotH-10);ctx.fillStyle=css("--brand");ctx.fillRect(x0,h-pad.b-bh,barW,bh);ctx.fillStyle=css("--accent");ctx.fillRect(x0+barW+2,h-pad.b-qh,barW,qh);if(v.x===selectedX){ctx.strokeStyle=css("--text");ctx.lineWidth=2;ctx.strokeRect(x0-3,pad.t,barW*2+8,plotH);}});
    ctx.fillStyle=css("--muted");ctx.font="11px system-ui";ctx.textAlign="center";for(let x=0;x<=maxX;x+=Math.max(1,Math.ceil((maxX+1)/10)))ctx.fillText(String(x),pad.l+(x+.5)*groupW,h-pad.b+18);ctx.fillText("Event count x",pad.l+plotW/2,h-8);
    $("approxDescription").textContent = "Blue bars are exact Binomial probabilities; amber bars are Poisson probabilities with μ = np. The outlined group is x = " + selectedX + ".";
    const quality = tv < .01 ? "very close" : tv < .05 ? "reasonably close" : tv < .10 ? "noticeably different" : "poor for some probabilities";
    $("approxMessage").className = "status-line " + (tv < .05 ? "good" : "warn");
    $("approxMessage").textContent = "Total variation distance ≈ " + tv.toFixed(4) + ". In this setting the approximation is " + quality + ". Exact Binomial remains the reference model for the trial process.";
  };
  ["approxN","approxP","approxX"].forEach(id => $(id).addEventListener("input", ussDrawApproximation));

  // Memoryless explorer
  const ussUpdateMemoryless = () => {
    const rate=Number($("memoryRate").value),s=Number($("memoryElapsed").value),t=Number($("memoryExtra").value);
    $("memoryRateValue").textContent=rate.toFixed(3);$("memoryElapsedValue").textContent=s;$("memoryExtraValue").textContent=t;
    const total=Math.exp(-rate*(s+t)), conditional=Math.exp(-rate*t), fresh=Math.exp(-rate*t);
    $("memoryTotalValue").textContent=ussPercent(total);$("memoryConditionalValue").textContent=ussPercent(conditional);$("memoryFreshValue").textContent=ussPercent(fresh);
    $("memoryTotalBar").style.width=(total*100).toFixed(2)+"%";$("memoryConditionalBar").style.width=(conditional*100).toFixed(2)+"%";$("memoryFreshBar").style.width=(fresh*100).toFixed(2)+"%";
    $("memoryMessage").textContent="After already waiting " + s + " units, the chance of waiting at least " + t + " more is still " + ussPercent(conditional) + ", the same as starting fresh under an Exponential model.";
  };
  ["memoryRate","memoryElapsed","memoryExtra"].forEach(id => $(id).addEventListener("input",ussUpdateMemoryless));

  app.ussClamp = ussClamp;
  app.ussPercent = ussPercent;
  app.ussBinomialPmf = ussBinomialPmf;
  app.ussPoissonPmf = ussPoissonPmf;
  app.ussDiscreteCdf = ussDiscreteCdf;
  app.redrawApproximation = ussDrawApproximation;

  ussRenderScenario();
  ussUpdateSelectorScore();
  ussDrawApproximation();
  ussUpdateMemoryless();
})(window.UpSkillBPE);

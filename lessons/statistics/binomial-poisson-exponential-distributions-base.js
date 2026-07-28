(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;

  // Shared /theme.js owns theme changes. This helper only keeps chart redraws synchronized.
  const themeToggle = document.querySelector("[data-theme-toggle='true']");
  const syncThemeButton = () => {
    if (!themeToggle) return;
    const dark = root.getAttribute("data-theme") === "dark";
    themeToggle.setAttribute("aria-checked", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
  };
  syncThemeButton();

  const state = { events: [], rate: 2, length: 1000, window: 100 };

  const poissonEvents = (ratePer100, totalLength) => {
    const ratePerM = ratePer100 / 100;
    const events = [];
    let position = 0;
    while (true) {
      const u = Math.max(Number.MIN_VALUE, Math.random());
      position += -Math.log(u) / ratePerM;
      if (position > totalLength) break;
      events.push(position);
      if (events.length > 10000) break;
    }
    return events;
  };

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const setupCanvas = (canvas) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(300, rect.width || 300);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(280 * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, 280);
    return { ctx, w: width, h: 280 };
  };

  const drawCounts = () => {
    const {ctx,w,h} = setupCanvas($("countCanvas"));
    const nWindows = Math.ceil(state.length / state.window);
    const counts = Array(nWindows).fill(0);
    state.events.forEach(p => {
      const i = Math.min(nWindows - 1, Math.floor(p / state.window));
      counts[i] += 1;
    });
    const maxCount = Math.max(1, ...counts);
    const pad = {l:42,r:14,t:18,b:40};
    const plotW = w-pad.l-pad.r, plotH = h-pad.t-pad.b;
    ctx.strokeStyle = css("--line"); ctx.fillStyle = css("--muted"); ctx.font = "12px Arial";
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,h-pad.b); ctx.lineTo(w-pad.r,h-pad.b); ctx.stroke();
    const barW = plotW / counts.length;
    counts.forEach((c,i) => {
      const bh = (c/maxCount)*(plotH-8);
      ctx.fillStyle = css("--teal");
      ctx.fillRect(pad.l+i*barW+2,h-pad.b-bh,Math.max(2,barW-4),bh);
      if (counts.length <= 16) {
        ctx.fillStyle = css("--muted"); ctx.textAlign="center";
        ctx.fillText(String(c),pad.l+(i+.5)*barW,h-pad.b-bh-5);
        ctx.fillText(String(i+1),pad.l+(i+.5)*barW,h-pad.b+17);
      }
    });
    ctx.save();ctx.translate(13,h/2);ctx.rotate(-Math.PI/2);ctx.textAlign="center";ctx.fillStyle=css("--muted");ctx.fillText("Event count",0,0);ctx.restore();
    ctx.textAlign="center";ctx.fillText("Fixed windows",pad.l+plotW/2,h-8);
    return counts;
  };

  const drawGaps = () => {
    const {ctx,w,h} = setupCanvas($("gapCanvas"));
    const pad = {l:30,r:18,t:28,b:42};
    const y = h/2;
    ctx.strokeStyle = css("--line"); ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
    const scale = (w-pad.l-pad.r)/state.length;
    state.events.forEach((p,i) => {
      const x=pad.l+p*scale;
      ctx.strokeStyle=css("--teal");ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(x,y-24);ctx.lineTo(x,y+24);ctx.stroke();
      ctx.fillStyle=css("--teal");ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
      if(i<8){
        const prev=i===0?0:state.events[i-1];
        const mid=pad.l+((prev+p)/2)*scale;
        ctx.fillStyle=css("--muted");ctx.font="11px Arial";ctx.textAlign="center";
        ctx.fillText((p-prev).toFixed(1)+" m",mid,y-34-(i%2)*16);
      }
    });
    ctx.fillStyle=css("--muted");ctx.font="12px Arial";ctx.textAlign="left";ctx.fillText("0 m",pad.l,h-14);
    ctx.textAlign="right";ctx.fillText(state.length+" m",w-pad.r,h-14);
    ctx.textAlign="center";ctx.fillText("Event locations and the gaps between them",w/2,h-14);
  };

  const clearLabCanvases = () => {
    ["countCanvas", "gapCanvas"].forEach(id => {
      const canvas = $(id);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    $("mEvents").textContent = "0";
    $("mRate").textContent = "0.00";
    $("mCount").textContent = "0.00";
    $("mGap").textContent = "No events";
  };

  const drawAll = () => {
    if (!state.events.length) {
      clearLabCanvases();
      return;
    }
    const counts = drawCounts();
    drawGaps();
    const gaps = state.events.map((p,i)=>p-(i?state.events[i-1]:0));
    $("mEvents").textContent = state.events.length;
    $("mRate").textContent = (state.events.length/state.length*100).toFixed(2);
    $("mCount").textContent = (counts.reduce((a,b)=>a+b,0)/counts.length).toFixed(2);
    $("mGap").textContent = gaps.length ? (gaps.reduce((a,b)=>a+b,0)/gaps.length).toFixed(1)+" m" : "No events";
  };

  const regenerate = () => {
    state.rate = Number($("rateSlider").value);
    state.length = Number($("lengthSlider").value);
    state.window = Number($("windowSlider").value);
    $("rateValue").textContent = state.rate.toFixed(1);
    $("lengthValue").textContent = state.length;
    $("windowValue").textContent = state.window;
    state.events = poissonEvents(state.rate,state.length);
    $("labError").hidden = state.events.length > 0;
    $("labError").textContent = state.events.length ? "" : "No events happened in this simulation. That is possible at low rates—generate another process to compare.";
    drawAll();
  };

  ["rateSlider","lengthSlider","windowSlider"].forEach(id => $(id).addEventListener("input", regenerate));
  $("resimulateBtn").addEventListener("click", regenerate);
  $("resetLabBtn").addEventListener("click", () => {
    $("rateSlider").value=2;$("lengthSlider").value=1000;$("windowSlider").value=100;regenerate();
  });
  window.addEventListener("resize", drawAll);

  const logFactorial = (n) => {
    let total=0;
    for(let i=2;i<=n;i++) total+=Math.log(i);
    return total;
  };
  const calculate = () => {
    const rate=Number($("calcRate").value), exposure=Number($("calcExposure").value), x=Number($("calcCount").value);
    const box=$("calcMessage");
    if(!(rate>0) || !(exposure>=0) || !Number.isInteger(x) || x<0 || x>500){
      box.textContent="Enter a positive rate, a non-negative exposure, and a whole-number count from 0 to 500.";
      box.className="callout warn"; return;
    }
    const mu=rate*exposure;
    const pCount=mu===0?(x===0?1:0):Math.exp(-mu+x*Math.log(mu)-logFactorial(x));
    const pWait=Math.exp(-mu);
    box.innerHTML="<strong>Expected count μ = "+mu.toFixed(4)+"</strong><br>"+
      "Poisson: P(X = "+x+") = "+pCount.toFixed(6)+" ("+(pCount*100).toFixed(2)+"%)<br>"+
      "Exponential/zero-event bridge: P(T &gt; exposure) = P(X = 0) = "+pWait.toFixed(6)+" ("+(pWait*100).toFixed(2)+"%)";
    box.className="callout good";
  };
  $("calculateBtn").addEventListener("click",calculate);
  ["calcRate","calcExposure","calcCount"].forEach(id => $(id).addEventListener("keydown", event => {
    if(event.key === "Enter") calculate();
  }));
  $("resetCalcBtn").addEventListener("click",()=>{
    $("calcRate").value=2;$("calcExposure").value=1;$("calcCount").value=3;
    $("calcMessage").textContent="Enter a rate, exposure, and count, then calculate.";
    $("calcMessage").className="callout";
  });

  const toggleReveal = (buttonId, answerId, showLabel, hideLabel) => {
    const button=$(buttonId), answer=$(answerId);
    const show=answer.hidden;
    answer.hidden=!show;
    button.setAttribute("aria-expanded",String(show));
    button.textContent=show?hideLabel:showLabel;
  };
  $("revealPracticeBtn").addEventListener("click",()=>toggleReveal("revealPracticeBtn","practiceAnswer","Reveal answer","Hide answer"));

  $("quizForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    let score=0;
    document.querySelectorAll(".quiz-question").forEach(q=>{
      const chosen=q.querySelector("input:checked");
      const correct=q.dataset.answer;
      const fb=q.querySelector(".feedback");
      if(!fb.dataset.explanation) fb.dataset.explanation=fb.textContent.trim();
      const isCorrect=Boolean(chosen && chosen.value===correct);
      if(isCorrect) score++;
      fb.classList.add("show");
      fb.classList.toggle("correct",isCorrect);
      fb.classList.toggle("incorrect",!isCorrect);
      fb.textContent=(isCorrect?"Correct. ":chosen?"Not quite. ":"No answer selected. ")+fb.dataset.explanation;
    });
    $("quizScore").textContent="Score: "+score+"/5 ("+(score*20)+"%)";
  });

  $("resetQuizBtn").addEventListener("click",()=>{
    $("quizForm").reset();
    document.querySelectorAll(".feedback").forEach(f=>{
      f.classList.remove("show","correct","incorrect");
      if(f.dataset.explanation) f.textContent=f.dataset.explanation;
    });
    $("quizScore").textContent="";
  });

  const drawBinomial = () => {
    const n = Number($("binN").value);
    const p = Number($("binP").value);
    const repeats = Number($("binRepeats").value);
    $("binNValue").textContent = n;
    $("binPValue").textContent = p.toFixed(2);
    $("binRepeatsValue").textContent = repeats;

    const counts = Array(n + 1).fill(0);
    const outcomes = [];
    for (let r = 0; r < repeats; r++) {
      let successes = 0;
      for (let i = 0; i < n; i++) if (Math.random() < p) successes++;
      counts[successes]++;
      outcomes.push(successes);
    }

    const {ctx,w,h} = setupCanvas($("binomialCanvas"));
    const maxCount = Math.max(1, ...counts);
    const pad = {l:42,r:12,t:18,b:42};
    const plotW = w-pad.l-pad.r, plotH = h-pad.t-pad.b;
    ctx.strokeStyle = css("--line"); ctx.fillStyle = css("--muted"); ctx.font = "12px Arial";
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t); ctx.lineTo(pad.l,h-pad.b); ctx.lineTo(w-pad.r,h-pad.b); ctx.stroke();
    const barW = plotW / counts.length;
    counts.forEach((c,i)=>{
      const bh=(c/maxCount)*(plotH-8);
      ctx.fillStyle=css("--teal");
      ctx.fillRect(pad.l+i*barW+1,h-pad.b-bh,Math.max(1,barW-2),bh);
      if (counts.length <= 31 && i % Math.max(1,Math.ceil(counts.length/15))===0) {
        ctx.fillStyle=css("--muted");ctx.textAlign="center";ctx.fillText(String(i),pad.l+(i+.5)*barW,h-pad.b+17);
      }
    });
    ctx.save();ctx.translate(13,h/2);ctx.rotate(-Math.PI/2);ctx.textAlign="center";ctx.fillStyle=css("--muted");ctx.fillText("Frequency",0,0);ctx.restore();
    ctx.textAlign="center";ctx.fillText("Number of selected outcomes",pad.l+plotW/2,h-8);

    const mean=outcomes.reduce((a,b)=>a+b,0)/outcomes.length;
    $("binTheoMean").textContent=(n*p).toFixed(2);
    $("binObsMean").textContent=mean.toFixed(2);
    $("binMax").textContent=n;
    $("binRange").textContent=Math.min(...outcomes)+" to "+Math.max(...outcomes);
    $("binomialDescription").textContent=repeats+" simulated samples of "+n+" trials at p = "+p.toFixed(2)+" produced a mean of "+mean.toFixed(2)+" selected outcomes and an observed range from "+Math.min(...outcomes)+" to "+Math.max(...outcomes)+".";
  };

  ["binN","binP","binRepeats"].forEach(id => $(id).addEventListener("input", drawBinomial));
  $("runBinomialBtn").addEventListener("click", drawBinomial);
  $("resetBinomialBtn").addEventListener("click",()=>{
    $("binN").value=20;$("binP").value=0.10;$("binRepeats").value=500;drawBinomial();
  });

  window.UpSkillBPE = { $, root, syncThemeButton, css, setupCanvas, drawAll, drawBinomial, regenerate, toggleReveal };
  drawBinomial();
  regenerate();
})();

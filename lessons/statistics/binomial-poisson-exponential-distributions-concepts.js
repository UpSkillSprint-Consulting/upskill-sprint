((app) => {
  "use strict";

  const { $, setupCanvas, css } = app;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const percent = (value, digits = 2) => (value * 100).toFixed(digits) + "%";

  const logFactorial = (n) => {
    let total = 0;
    for (let i = 2; i <= n; i += 1) total += Math.log(i);
    return total;
  };

  const binomialPmf = (n, p, x) => {
    if (!Number.isInteger(n) || !Number.isInteger(x) || x < 0 || x > n || p < 0 || p > 1) return 0;
    if (p === 0) return x === 0 ? 1 : 0;
    if (p === 1) return x === n ? 1 : 0;
    const logProbability = logFactorial(n) - logFactorial(x) - logFactorial(n - x) +
      x * Math.log(p) + (n - x) * Math.log(1 - p);
    return Math.exp(logProbability);
  };

  const poissonPmf = (mu, x) => {
    if (!(mu >= 0) || !Number.isInteger(x) || x < 0) return 0;
    if (mu === 0) return x === 0 ? 1 : 0;
    return Math.exp(-mu + x * Math.log(mu) - logFactorial(x));
  };

  const discreteCdf = (pmf, upper) => {
    let sum = 0;
    for (let x = 0; x <= upper; x += 1) sum += pmf(x);
    return clamp(sum, 0, 1);
  };

  const scenarios = [
    { title: "Incoming inspection", text: "A supplier ships 40 coils. Each coil is classified as accepted or rejected. What models the number rejected?", answer: "binomial", clues: ["fixed n = 40", "two outcomes per coil", "bounded count"], why: "There are 40 fixed, approximately independent accept/reject trials." },
    { title: "Surface inspection", text: "An inspector counts all inclusions found in each 10 m² plate area. Several inclusions can occur in one area.", answer: "poisson", clues: ["event count", "fixed area", "multiple events possible"], why: "This is an event count within a fixed opportunity." },
    { title: "Reliability response", text: "The response is operating hours from one breakdown until the next, assuming a stable breakdown rate.", answer: "exponential", clues: ["continuous time", "gap between events", "constant-rate assumption"], why: "The measured response is the waiting time between Poisson events." },
    { title: "Changing workload", text: "Call arrivals surge at shift change and fall overnight, but one constant hourly rate is proposed for the entire day.", answer: "neither", clues: ["rate changes", "time pattern", "stationarity violated"], why: "A single stationary Poisson model is questionable; stratify by time or model the changing rate." },
    { title: "Weld testing", text: "Out of 15 welds, how many fail a bend test when each weld is pass/fail?", answer: "binomial", clues: ["15 trials", "pass/fail", "selected outcomes"], why: "The number of failures is bounded by the 15 trials." },
    { title: "Defects per coil", text: "How many pinholes appear along the next 500 m of coated strip?", answer: "poisson", clues: ["count", "fixed length", "random events"], why: "Pinholes are events counted in a fixed length." },
    { title: "Distance to defect", text: "How many metres of strip are produced before the next pinhole?", answer: "exponential", clues: ["continuous distance", "until next event", "gap"], why: "Distance until the next event is an Exponential-type response under a constant-rate process." },
    { title: "Clustered damage", text: "Most days have no scratches, but handling incidents create bursts of many scratches at once. Variance greatly exceeds the mean.", answer: "neither", clues: ["clustering", "overdispersion", "bursts"], why: "A basic Poisson process assumes independent events at a stable rate; clustering suggests another model or stratification." },
    { title: "Audit findings", text: "Each of 100 records is classified as complete or incomplete. What models the number incomplete?", answer: "binomial", clues: ["100 records", "binary result", "bounded by 100"], why: "This is a fixed number of two-outcome trials." },
    { title: "Customer arrivals", text: "How many customers arrive at one counter during a 15-minute interval when arrivals are independent and the rate is stable?", answer: "poisson", clues: ["arrival count", "fixed time", "stable rate"], why: "This is a count of random arrivals in a fixed interval." },
    { title: "Next arrival", text: "How many minutes until the next customer arrives under the same stable-rate process?", answer: "exponential", clues: ["continuous minutes", "next arrival", "waiting time"], why: "Waiting time to the next Poisson event is Exponential." },
    { title: "Aging component", text: "The failure hazard increases sharply with age because of wear-out. Should a constant-hazard Exponential model be assumed?", answer: "neither", clues: ["aging", "increasing hazard", "constant rate violated"], why: "Wear-out contradicts the constant-hazard assumption; a Weibull model may be more suitable." }
  ];

  let scenarioIndex = 0;
  let selectorCorrect = 0;
  let selectorAttempted = 0;
  let selectorAnswered = false;

  const renderScenario = () => {
    const scenario = scenarios[scenarioIndex];
    $("selectorTitle").textContent = scenario.title;
    $("selectorText").textContent = scenario.text;
    $("selectorClues").replaceChildren(...scenario.clues.map((clue) => {
      const span = document.createElement("span");
      span.className = "pill";
      span.textContent = clue;
      return span;
    }));
    $("selectorFeedback").className = "status-line";
    $("selectorFeedback").textContent = "Choose the model that matches how the response is generated.";
    document.querySelectorAll("[data-model-answer]").forEach((button) => {
      button.classList.remove("correct", "incorrect");
      button.setAttribute("aria-pressed", "false");
    });
    selectorAnswered = false;
  };

  const updateSelectorScore = () => {
    $("selectorCorrect").textContent = selectorCorrect;
    $("selectorAttempted").textContent = selectorAttempted;
    $("selectorAccuracy").textContent = selectorAttempted
      ? Math.round(100 * selectorCorrect / selectorAttempted) + "%"
      : "0%";
  };

  document.querySelectorAll("[data-model-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      if (selectorAnswered) return;
      selectorAnswered = true;
      selectorAttempted += 1;
      const scenario = scenarios[scenarioIndex];
      const selected = button.dataset.modelAnswer;
      const correct = selected === scenario.answer;
      if (correct) selectorCorrect += 1;
      button.classList.add(correct ? "correct" : "incorrect");
      button.setAttribute("aria-pressed", "true");
      const correctButton = document.querySelector(`[data-model-answer="${scenario.answer}"]`);
      if (correctButton) correctButton.classList.add("correct");
      $("selectorFeedback").className = "status-line " + (correct ? "good" : "warn");
      $("selectorFeedback").textContent = (correct ? "Correct. " : "Not quite. ") + scenario.why;
      updateSelectorScore();
    });
  });

  $("nextScenarioBtn").addEventListener("click", () => {
    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    renderScenario();
  });

  $("resetSelectorBtn").addEventListener("click", () => {
    scenarioIndex = 0;
    selectorCorrect = 0;
    selectorAttempted = 0;
    updateSelectorScore();
    renderScenario();
  });

  const drawApproximation = () => {
    const n = Number($("approxN").value);
    const p = Number($("approxP").value);
    let selectedX = Number($("approxX").value);
    const mu = n * p;
    const maxX = Math.min(35, Math.max(10, Math.ceil(mu + 5 * Math.sqrt(Math.max(mu, 1)))));
    $("approxX").max = maxX;
    if (selectedX > maxX) {
      selectedX = maxX;
      $("approxX").value = maxX;
    }

    $("approxNValue").textContent = n;
    $("approxPValue").textContent = p.toFixed(3);
    $("approxXValue").textContent = selectedX;
    $("approxMu").textContent = mu.toFixed(3);

    const binProbability = binomialPmf(n, p, selectedX);
    const poissonProbability = poissonPmf(mu, selectedX);
    const absoluteDifference = Math.abs(binProbability - poissonProbability);
    $("approxBinProb").textContent = percent(binProbability, 3);
    $("approxPoiProb").textContent = percent(poissonProbability, 3);
    $("approxDifference").textContent = percent(absoluteDifference, 3);

    const tailLimit = Math.max(n, Math.ceil(mu + 10 * Math.sqrt(Math.max(mu, 1))));
    let totalVariation = 0;
    for (let x = 0; x <= tailLimit; x += 1) {
      totalVariation += Math.abs(binomialPmf(n, p, x) - poissonPmf(mu, x));
    }
    totalVariation *= 0.5;

    const { ctx, w, h } = setupCanvas($("approxCanvas"));
    const pad = { l: 44, r: 16, t: 24, b: 46 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const values = [];
    let maximumProbability = 0;

    for (let x = 0; x <= maxX; x += 1) {
      const exact = binomialPmf(n, p, x);
      const approximation = poissonPmf(mu, x);
      values.push({ x, exact, approximation });
      maximumProbability = Math.max(maximumProbability, exact, approximation);
    }

    ctx.strokeStyle = css("--line");
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, h - pad.b);
    ctx.lineTo(w - pad.r, h - pad.b);
    ctx.stroke();

    const groupW = plotW / (maxX + 1);
    const barW = Math.max(2, groupW * 0.32);
    values.forEach((value) => {
      const start = pad.l + value.x * groupW + groupW * 0.18;
      const exactHeight = value.exact / maximumProbability * (plotH - 10);
      const approximationHeight = value.approximation / maximumProbability * (plotH - 10);
      ctx.fillStyle = css("--brand");
      ctx.fillRect(start, h - pad.b - exactHeight, barW, exactHeight);
      ctx.fillStyle = css("--accent");
      ctx.fillRect(start + barW + 2, h - pad.b - approximationHeight, barW, approximationHeight);
      if (value.x === selectedX) {
        ctx.strokeStyle = css("--text");
        ctx.lineWidth = 2;
        ctx.strokeRect(start - 3, pad.t, barW * 2 + 8, plotH);
      }
    });

    ctx.fillStyle = css("--muted");
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    for (let x = 0; x <= maxX; x += Math.max(1, Math.ceil((maxX + 1) / 10))) {
      ctx.fillText(String(x), pad.l + (x + 0.5) * groupW, h - pad.b + 18);
    }
    ctx.fillText("Selected-outcome count x", pad.l + plotW / 2, h - 8);

    $("approxDescription").textContent = `For counts 0 through ${maxX}, the first bar in each pair is exact Binomial and the second is the Poisson approximation with μ = np. The outlined pair is x = ${selectedX}; the absolute difference there is ${percent(absoluteDifference, 3)}.`;
    const quality = totalVariation < 0.01
      ? "very close"
      : totalVariation < 0.05
        ? "reasonably close"
        : totalVariation < 0.10
          ? "noticeably different"
          : "poor for some probabilities";
    $("approxMessage").className = "status-line " + (totalVariation < 0.05 ? "good" : "warn");
    $("approxMessage").textContent = `Total variation distance ≈ ${totalVariation.toFixed(4)}. In this setting the approximation is ${quality}. Exact Binomial remains the reference model for the trial process.`;
  };

  ["approxN", "approxP", "approxX"].forEach((id) => {
    $(id).addEventListener("input", drawApproximation);
  });

  const updateMemoryless = () => {
    const rate = Number($("memoryRate").value);
    const elapsed = Number($("memoryElapsed").value);
    const additional = Number($("memoryExtra").value);
    $("memoryRateValue").textContent = rate.toFixed(3);
    $("memoryElapsedValue").textContent = elapsed;
    $("memoryExtraValue").textContent = additional;

    const total = Math.exp(-rate * (elapsed + additional));
    const conditional = Math.exp(-rate * additional);
    const fresh = Math.exp(-rate * additional);
    $("memoryTotalValue").textContent = percent(total);
    $("memoryConditionalValue").textContent = percent(conditional);
    $("memoryFreshValue").textContent = percent(fresh);
    $("memoryTotalBar").style.width = (total * 100).toFixed(2) + "%";
    $("memoryConditionalBar").style.width = (conditional * 100).toFixed(2) + "%";
    $("memoryFreshBar").style.width = (fresh * 100).toFixed(2) + "%";
    $("memoryMessage").textContent = `After already waiting ${elapsed} units, the chance of waiting at least ${additional} more is still ${percent(conditional)}, the same as starting fresh under an Exponential model.`;
  };

  ["memoryRate", "memoryElapsed", "memoryExtra"].forEach((id) => {
    $(id).addEventListener("input", updateMemoryless);
  });

  app.ussClamp = clamp;
  app.ussPercent = percent;
  app.ussBinomialPmf = binomialPmf;
  app.ussPoissonPmf = poissonPmf;
  app.ussDiscreteCdf = discreteCdf;
  app.redrawApproximation = drawApproximation;

  renderScenario();
  updateSelectorScore();
  drawApproximation();
  updateMemoryless();
})(window.UpSkillBPE);

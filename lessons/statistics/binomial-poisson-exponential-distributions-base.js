(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle='true']");

  const syncThemeButton = () => {
    if (!themeToggle) return;
    const dark = root.getAttribute("data-theme") === "dark";
    themeToggle.textContent = dark ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-checked", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };

  const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  const setupCanvas = (canvas) => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(300, rect.width || 300);
    const height = 280;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    return { ctx, w: width, h: height };
  };

  const state = {
    events: [],
    rate: 2,
    length: 1000,
    window: 100
  };

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

  const drawEmptyMessage = (canvas, message) => {
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.fillStyle = css("--muted");
    ctx.font = "14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(message, w / 2, h / 2);
  };

  const drawCounts = () => {
    const canvas = $("countCanvas");
    const nWindows = Math.ceil(state.length / state.window);
    const counts = Array(nWindows).fill(0);

    state.events.forEach((position) => {
      const index = Math.min(nWindows - 1, Math.floor(position / state.window));
      counts[index] += 1;
    });

    if (!state.events.length) {
      drawEmptyMessage(canvas, "No events occurred in this simulation.");
      return counts;
    }

    const { ctx, w, h } = setupCanvas(canvas);
    const maxCount = Math.max(1, ...counts);
    const pad = { l: 38, r: 12, t: 18, b: 38 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    ctx.strokeStyle = css("--line");
    ctx.fillStyle = css("--muted");
    ctx.font = "12px system-ui";
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, h - pad.b);
    ctx.lineTo(w - pad.r, h - pad.b);
    ctx.stroke();

    const barW = plotW / counts.length;
    counts.forEach((count, index) => {
      const barHeight = (count / maxCount) * (plotH - 8);
      ctx.fillStyle = css("--brand");
      ctx.fillRect(
        pad.l + index * barW + 2,
        h - pad.b - barHeight,
        Math.max(2, barW - 4),
        barHeight
      );

      if (counts.length <= 16) {
        ctx.fillStyle = css("--muted");
        ctx.textAlign = "center";
        ctx.fillText(String(count), pad.l + (index + 0.5) * barW, h - pad.b - barHeight - 5);
        ctx.fillText(String(index + 1), pad.l + (index + 0.5) * barW, h - pad.b + 17);
      }
    });

    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = css("--muted");
    ctx.fillText("Event count", 0, 0);
    ctx.restore();
    ctx.textAlign = "center";
    ctx.fillText("Fixed windows", pad.l + plotW / 2, h - 7);

    return counts;
  };

  const drawGaps = () => {
    const canvas = $("gapCanvas");
    if (!state.events.length) {
      drawEmptyMessage(canvas, "No waiting distances are available because no event occurred.");
      return;
    }

    const { ctx, w, h } = setupCanvas(canvas);
    const pad = { l: 30, r: 18, t: 28, b: 42 };
    const y = h / 2;

    ctx.strokeStyle = css("--line");
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(w - pad.r, y);
    ctx.stroke();

    const scale = (w - pad.l - pad.r) / state.length;
    state.events.forEach((position, index) => {
      const x = pad.l + position * scale;
      ctx.strokeStyle = css("--brand");
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - 24);
      ctx.lineTo(x, y + 24);
      ctx.stroke();
      ctx.fillStyle = css("--brand");
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      if (index < 8) {
        const previous = index === 0 ? 0 : state.events[index - 1];
        const midpoint = pad.l + ((previous + position) / 2) * scale;
        ctx.fillStyle = css("--muted");
        ctx.font = "11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText((position - previous).toFixed(1) + " m", midpoint, y - 34 - (index % 2) * 16);
      }
    });

    ctx.fillStyle = css("--muted");
    ctx.font = "12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText("0 m", pad.l, h - 14);
    ctx.textAlign = "right";
    ctx.fillText(state.length + " m", w - pad.r, h - 14);
    ctx.textAlign = "center";
    ctx.fillText("Event locations and the gaps between them", w / 2, h - 14);
  };

  const drawAll = () => {
    const counts = drawCounts();
    drawGaps();
    const gaps = state.events.map((position, index) => position - (index ? state.events[index - 1] : 0));
    const meanCount = counts.length ? counts.reduce((sum, value) => sum + value, 0) / counts.length : 0;
    const meanGap = gaps.length ? gaps.reduce((sum, value) => sum + value, 0) / gaps.length : null;

    $("mEvents").textContent = state.events.length;
    $("mRate").textContent = (state.events.length / state.length * 100).toFixed(2);
    $("mCount").textContent = meanCount.toFixed(2);
    $("mGap").textContent = meanGap === null ? "No events" : meanGap.toFixed(1) + " m";
    $("countDescription").textContent = state.events.length
      ? `${state.events.length} events are grouped into ${counts.length} fixed windows of ${state.window} m. The mean observed count is ${meanCount.toFixed(2)} per window.`
      : `No events occurred across ${state.length} m, so every ${state.window} m counting window contains zero events.`;
    $("gapDescription").textContent = state.events.length
      ? `${state.events.length} event locations are shown across ${state.length} m. The observed mean waiting distance is ${meanGap.toFixed(1)} m.`
      : `No event occurred across ${state.length} m, so no completed event-to-event waiting distance is available.`;
  };

  const regenerate = () => {
    state.rate = Number($("rateSlider").value);
    state.length = Number($("lengthSlider").value);
    state.window = Number($("windowSlider").value);
    $("rateValue").textContent = state.rate.toFixed(1);
    $("lengthValue").textContent = state.length;
    $("windowValue").textContent = state.window;
    state.events = poissonEvents(state.rate, state.length);
    $("labError").hidden = state.events.length > 0;
    $("labError").textContent = state.events.length
      ? ""
      : "No events happened in this simulation. That is possible at low rates; generate another process to compare.";
    drawAll();
  };

  ["rateSlider", "lengthSlider", "windowSlider"].forEach((id) => {
    $(id).addEventListener("input", regenerate);
  });
  $("resimulateBtn").addEventListener("click", regenerate);
  $("resetLabBtn").addEventListener("click", () => {
    $("rateSlider").value = 2;
    $("lengthSlider").value = 1000;
    $("windowSlider").value = 100;
    regenerate();
  });

  const logFactorial = (n) => {
    let total = 0;
    for (let i = 2; i <= n; i += 1) total += Math.log(i);
    return total;
  };

  const poissonPmf = (mu, x) => {
    if (mu === 0) return x === 0 ? 1 : 0;
    return Math.exp(-mu + x * Math.log(mu) - logFactorial(x));
  };

  const calculate = () => {
    const rate = Number($("calcRate").value);
    const exposure = Number($("calcExposure").value);
    const x = Number($("calcCount").value);
    const box = $("calcMessage");

    if (!Number.isFinite(rate) || !Number.isFinite(exposure) || !(rate > 0) || !(exposure >= 0) || !Number.isInteger(x) || x < 0 || x > 500) {
      box.textContent = "Enter a finite positive rate, a finite non-negative exposure, and a whole-number count from 0 to 500.";
      box.className = "callout warn";
      return;
    }

    const mu = rate * exposure;
    if (!Number.isFinite(mu) || mu > 1000000) {
      box.textContent = "The product λt must be finite and no greater than 1,000,000 for this learning calculator.";
      box.className = "callout warn";
      return;
    }

    const pCount = poissonPmf(mu, x);
    const pWait = Math.exp(-mu);
    box.innerHTML = `<strong>Expected count μ = λt = ${rate} × ${exposure} = ${mu.toFixed(4)}</strong><br>` +
      `Poisson: P(X = ${x}) = ${pCount.toFixed(6)} (${(pCount * 100).toFixed(2)}%)<br>` +
      `Exponential/zero-event bridge: P(T &gt; exposure) = P(X = 0) = ${pWait.toFixed(6)} (${(pWait * 100).toFixed(2)}%)`;
    box.className = "callout good";
  };

  $("calculateBtn").addEventListener("click", calculate);
  ["calcRate", "calcExposure", "calcCount"].forEach((id) => {
    $(id).addEventListener("keydown", (event) => {
      if (event.key === "Enter") calculate();
    });
  });
  $("resetCalcBtn").addEventListener("click", () => {
    $("calcRate").value = 2;
    $("calcExposure").value = 1;
    $("calcCount").value = 3;
    $("calcMessage").textContent = "Enter a rate, exposure, and count, then calculate.";
    $("calcMessage").className = "callout";
  });

  const toggleReveal = (button, panel, showText, hideText) => {
    const show = panel.hidden;
    panel.hidden = !show;
    button.setAttribute("aria-expanded", String(show));
    button.textContent = show ? hideText : showText;
  };

  $("revealPracticeBtn").addEventListener("click", () => {
    toggleReveal($("revealPracticeBtn"), $("practiceAnswer"), "Reveal answer", "Hide answer");
  });

  const quizQuestions = [...document.querySelectorAll(".quiz-question")];
  quizQuestions.forEach((question) => {
    const feedback = question.querySelector(".feedback");
    feedback.dataset.explanation = feedback.textContent.trim();
  });

  $("quizForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let score = 0;

    quizQuestions.forEach((question) => {
      const chosen = question.querySelector("input:checked");
      const correctValue = question.dataset.answer;
      const feedback = question.querySelector(".feedback");
      const isCorrect = Boolean(chosen && chosen.value === correctValue);
      if (isCorrect) score += 1;

      question.querySelectorAll(".option").forEach((option) => {
        const input = option.querySelector("input");
        option.classList.toggle("correct-answer", input.value === correctValue);
        option.classList.toggle("incorrect-answer", Boolean(chosen && input === chosen && !isCorrect));
      });

      feedback.classList.add("show");
      feedback.classList.toggle("correct", isCorrect);
      feedback.classList.toggle("incorrect", !isCorrect);
      const prefix = isCorrect ? "Correct. " : chosen ? "Not quite. " : "No answer selected. ";
      feedback.textContent = prefix + feedback.dataset.explanation;
    });

    $("quizScore").textContent = `Score: ${score}/5 (${score * 20}%). Review the explanations for every question.`;
  });

  $("resetQuizBtn").addEventListener("click", () => {
    $("quizForm").reset();
    quizQuestions.forEach((question) => {
      question.querySelectorAll(".option").forEach((option) => {
        option.classList.remove("correct-answer", "incorrect-answer");
      });
      const feedback = question.querySelector(".feedback");
      feedback.classList.remove("show", "correct", "incorrect");
      feedback.textContent = feedback.dataset.explanation;
    });
    $("quizScore").textContent = "";
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
    for (let repeat = 0; repeat < repeats; repeat += 1) {
      let successes = 0;
      for (let trial = 0; trial < n; trial += 1) {
        if (Math.random() < p) successes += 1;
      }
      counts[successes] += 1;
      outcomes.push(successes);
    }

    const { ctx, w, h } = setupCanvas($("binomialCanvas"));
    const maxCount = Math.max(1, ...counts);
    const pad = { l: 42, r: 12, t: 18, b: 42 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    ctx.strokeStyle = css("--line");
    ctx.fillStyle = css("--muted");
    ctx.font = "12px system-ui";
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, h - pad.b);
    ctx.lineTo(w - pad.r, h - pad.b);
    ctx.stroke();

    const barW = plotW / counts.length;
    counts.forEach((count, index) => {
      const barHeight = (count / maxCount) * (plotH - 8);
      ctx.fillStyle = css("--brand");
      ctx.fillRect(
        pad.l + index * barW + 1,
        h - pad.b - barHeight,
        Math.max(1, barW - 2),
        barHeight
      );
      if (counts.length <= 31 && index % Math.max(1, Math.ceil(counts.length / 15)) === 0) {
        ctx.fillStyle = css("--muted");
        ctx.textAlign = "center";
        ctx.fillText(String(index), pad.l + (index + 0.5) * barW, h - pad.b + 17);
      }
    });

    ctx.save();
    ctx.translate(13, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = css("--muted");
    ctx.fillText("Frequency", 0, 0);
    ctx.restore();
    ctx.textAlign = "center";
    ctx.fillText("Number of selected outcomes", pad.l + plotW / 2, h - 8);

    const mean = outcomes.reduce((sum, value) => sum + value, 0) / outcomes.length;
    const minimum = Math.min(...outcomes);
    const maximum = Math.max(...outcomes);
    $("binTheoMean").textContent = (n * p).toFixed(2);
    $("binObsMean").textContent = mean.toFixed(2);
    $("binMax").textContent = n;
    $("binRange").textContent = minimum + " to " + maximum;
    $("binomialDescription").textContent = `${repeats} simulated samples of ${n} trials at p = ${p.toFixed(2)} produced a mean of ${mean.toFixed(2)} selected outcomes and an observed range from ${minimum} to ${maximum}.`;
  };

  ["binN", "binP", "binRepeats"].forEach((id) => {
    $(id).addEventListener("input", drawBinomial);
  });
  $("runBinomialBtn").addEventListener("click", drawBinomial);
  $("resetBinomialBtn").addEventListener("click", () => {
    $("binN").value = 20;
    $("binP").value = 0.10;
    $("binRepeats").value = 500;
    drawBinomial();
  });

  window.addEventListener("resize", () => {
    drawAll();
    drawBinomial();
  });

  window.UpSkillBPE = {
    $,
    root,
    syncThemeButton,
    css,
    setupCanvas,
    drawAll,
    drawBinomial,
    regenerate,
    toggleReveal
  };

  syncThemeButton();
  drawBinomial();
  regenerate();
})();

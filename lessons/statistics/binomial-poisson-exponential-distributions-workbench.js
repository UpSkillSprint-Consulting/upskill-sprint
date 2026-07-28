((app) => {
  "use strict";

  const { $, setupCanvas, css, ussClamp, ussPercent, ussBinomialPmf, ussPoissonPmf, ussDiscreteCdf } = app;
  const workbenchInputs = ["wbModel", "wbQuestion", "wbN", "wbP", "wbRate", "wbExposure", "wbX1", "wbX2"].map($);

  const syncFields = () => {
    const model = $("wbModel").value;
    let question = $("wbQuestion").value;
    $("wbNGroup").hidden = model !== "binomial";
    $("wbPGroup").hidden = model !== "binomial";
    $("wbRateGroup").hidden = model === "binomial";
    $("wbExposureGroup").hidden = model === "binomial";

    if (model === "exponential" && question === "exact") {
      $("wbQuestion").value = "atMost";
      question = "atMost";
    }

    $("wbX2Group").hidden = question !== "between";
    $("wbX1Label").textContent = model === "exponential"
      ? question === "atLeast" ? "Waiting threshold t" : "Lower time t₁"
      : "Count x";
    $("wbX2Label").textContent = model === "exponential" ? "Upper time t₂" : "Upper count x₂";
  };

  const validate = () => {
    const model = $("wbModel").value;
    const question = $("wbQuestion").value;
    const n = Number($("wbN").value);
    const p = Number($("wbP").value);
    const rate = Number($("wbRate").value);
    const exposure = Number($("wbExposure").value);
    const x1 = Number($("wbX1").value);
    const x2 = Number($("wbX2").value);
    const errors = [];

    if (model === "binomial" && (!Number.isInteger(n) || n < 1 || n > 500)) {
      errors.push("n must be a whole number from 1 to 500.");
    }
    if (model === "binomial" && (!Number.isFinite(p) || p < 0 || p > 1)) {
      errors.push("p must be a finite value between 0 and 1.");
    }
    if (model !== "binomial" && (!Number.isFinite(rate) || rate <= 0)) {
      errors.push("λ must be a finite value greater than zero.");
    }
    if (model !== "binomial" && (!Number.isFinite(exposure) || exposure < 0)) {
      errors.push("Exposure must be finite and non-negative.");
    }
    if (model === "poisson" && Number.isFinite(rate * exposure) && rate * exposure > 1000) {
      errors.push("For this learning workbench, μ = λt must be no greater than 1,000.");
    }
    if (model !== "exponential" && (!Number.isInteger(x1) || x1 < 0 || x1 > 1000)) {
      errors.push("Count x must be a whole number from 0 to 1,000.");
    }
    if (model === "binomial" && x1 > n) {
      errors.push("For Binomial, x cannot exceed n.");
    }
    if (model === "exponential" && (!Number.isFinite(x1) || x1 < 0 || x1 > 1000000)) {
      errors.push("Waiting time must be a finite value from 0 to 1,000,000.");
    }
    if (question === "between" && (!Number.isFinite(x2) || x2 < x1)) {
      errors.push("The upper value must be finite and at least the lower value.");
    }
    if (question === "between" && model !== "exponential" && (!Number.isInteger(x2) || x2 > 1000)) {
      errors.push("The upper count must be a whole number from 0 to 1,000.");
    }
    if (question === "between" && model === "binomial" && x2 > n) {
      errors.push("For Binomial, the upper count cannot exceed n.");
    }
    if (question === "between" && model === "exponential" && x2 > 1000000) {
      errors.push("The upper waiting time cannot exceed 1,000,000 in this learning workbench.");
    }

    return { model, question, n, p, rate, exposure, x1, x2, errors };
  };

  const drawWorkbench = (values, probability, range) => {
    const { ctx, w, h } = setupCanvas($("workbenchCanvas"));
    const pad = { l: 48, r: 16, t: 25, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    ctx.strokeStyle = css("--line");
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, h - pad.b);
    ctx.lineTo(w - pad.r, h - pad.b);
    ctx.stroke();

    if (values.model === "exponential") {
      const maxT = Math.max(values.x2 || 0, values.x1, 5 / values.rate);
      const points = [];
      const maximumDensity = values.rate;
      for (let index = 0; index <= 180; index += 1) {
        const t = maxT * index / 180;
        points.push({ t, density: values.rate * Math.exp(-values.rate * t) });
      }
      const xScale = (t) => pad.l + t / maxT * plotW;
      const yScale = (density) => pad.t + (maximumDensity - density) / maximumDensity * plotH;
      const shaded = points.filter((point) => point.t >= range[0] && point.t <= range[1]);

      if (shaded.length) {
        ctx.fillStyle = css("--brand");
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.moveTo(xScale(shaded[0].t), h - pad.b);
        shaded.forEach((point) => ctx.lineTo(xScale(point.t), yScale(point.density)));
        ctx.lineTo(xScale(shaded[shaded.length - 1].t), h - pad.b);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = css("--brand");
      ctx.lineWidth = 3;
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index) ctx.lineTo(xScale(point.t), yScale(point.density));
        else ctx.moveTo(xScale(point.t), yScale(point.density));
      });
      ctx.stroke();
      ctx.fillStyle = css("--muted");
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      for (let index = 0; index <= 5; index += 1) {
        ctx.fillText((maxT * index / 5).toFixed(1), xScale(maxT * index / 5), h - pad.b + 18);
      }
      ctx.fillText("Waiting time or distance", pad.l + plotW / 2, h - 8);
    } else {
      const mean = values.model === "binomial" ? values.n * values.p : values.rate * values.exposure;
      const variance = values.model === "binomial" ? mean * (1 - values.p) : mean;
      const maxX = values.model === "binomial"
        ? Math.min(values.n, Math.max(12, Math.ceil(mean + 5 * Math.sqrt(Math.max(variance, 1)))))
        : Math.max(12, Math.ceil(mean + 5 * Math.sqrt(Math.max(mean, 1))));
      const pmf = values.model === "binomial"
        ? (x) => ussBinomialPmf(values.n, values.p, x)
        : (x) => ussPoissonPmf(mean, x);
      const plotted = [];
      let maximumProbability = 0;

      for (let x = 0; x <= maxX; x += 1) {
        const itemProbability = pmf(x);
        plotted.push({ x, probability: itemProbability });
        maximumProbability = Math.max(maximumProbability, itemProbability);
      }

      const barWidth = plotW / (maxX + 1);
      plotted.forEach((item) => {
        const barHeight = item.probability / maximumProbability * (plotH - 8);
        const selected = item.x >= range[0] && item.x <= range[1];
        ctx.fillStyle = selected ? css("--brand") : css("--line");
        ctx.fillRect(
          pad.l + item.x * barWidth + 1,
          h - pad.b - barHeight,
          Math.max(1, barWidth - 2),
          barHeight
        );
      });

      ctx.fillStyle = css("--muted");
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      for (let x = 0; x <= maxX; x += Math.max(1, Math.ceil((maxX + 1) / 10))) {
        ctx.fillText(String(x), pad.l + (x + 0.5) * barWidth, h - pad.b + 18);
      }
      ctx.fillText("Count x", pad.l + plotW / 2, h - 8);
    }

    $("workbenchDescription").textContent = `${values.model} probability display. The highlighted region represents ${ussPercent(probability, 3)} for the selected ${values.question} question.`;
  };

  const calculate = () => {
    syncFields();
    const values = validate();
    const errorBox = $("wbError");

    if (values.errors.length) {
      errorBox.hidden = false;
      errorBox.textContent = values.errors.join(" ");
      $("wbProbability").textContent = "—";
      $("wbInterpretation").textContent = "Correct the inputs before calculating.";
      $("wbMethod").textContent = "—";
      return;
    }

    errorBox.hidden = true;
    let probability = 0;
    let method = "";
    let interpretation = "";
    let range = [0, 0];

    if (values.model === "binomial") {
      const pmf = (x) => ussBinomialPmf(values.n, values.p, x);
      const cdf = (x) => x < 0 ? 0 : ussDiscreteCdf(pmf, Math.min(values.n, Math.floor(x)));

      if (values.question === "exact") {
        probability = pmf(values.x1);
        range = [values.x1, values.x1];
        method = `P(X=${values.x1}) = C(${values.n},${values.x1})(${values.p})^${values.x1}(1−${values.p})^${values.n - values.x1}`;
        interpretation = `Probability of exactly ${values.x1} selected outcomes in ${values.n} trials.`;
      } else if (values.question === "atMost") {
        probability = cdf(values.x1);
        range = [0, values.x1];
        method = `P(X≤${values.x1}) = Σ P(X=x), x=0…${values.x1}`;
        interpretation = `Probability of no more than ${values.x1} selected outcomes.`;
      } else if (values.question === "atLeast") {
        probability = 1 - cdf(values.x1 - 1);
        range = [values.x1, values.n];
        method = `P(X≥${values.x1}) = 1 − P(X≤${values.x1 - 1})`;
        interpretation = `Probability of ${values.x1} or more selected outcomes.`;
      } else {
        probability = cdf(values.x2) - cdf(values.x1 - 1);
        range = [values.x1, values.x2];
        method = `P(${values.x1}≤X≤${values.x2}) = P(X≤${values.x2}) − P(X≤${values.x1 - 1})`;
        interpretation = `Probability of an inclusive count from ${values.x1} through ${values.x2}.`;
      }
    } else if (values.model === "poisson") {
      const mean = values.rate * values.exposure;
      const pmf = (x) => ussPoissonPmf(mean, x);
      const cdf = (x) => x < 0 ? 0 : ussDiscreteCdf(pmf, Math.floor(x));

      if (values.question === "exact") {
        probability = pmf(values.x1);
        range = [values.x1, values.x1];
        method = `μ = λt = ${values.rate}×${values.exposure} = ${mean.toFixed(4)}\nP(X=${values.x1}) = e^(−μ)μ^x/x!`;
        interpretation = `Probability of exactly ${values.x1} events in the selected exposure.`;
      } else if (values.question === "atMost") {
        probability = cdf(values.x1);
        range = [0, values.x1];
        method = `μ = ${mean.toFixed(4)}\nP(X≤${values.x1}) = Σ P(X=x), x=0…${values.x1}`;
        interpretation = `Probability of no more than ${values.x1} events.`;
      } else if (values.question === "atLeast") {
        probability = 1 - cdf(values.x1 - 1);
        range = [values.x1, Number.POSITIVE_INFINITY];
        method = `μ = ${mean.toFixed(4)}\nP(X≥${values.x1}) = 1 − P(X≤${values.x1 - 1})`;
        interpretation = `Probability of ${values.x1} or more events.`;
      } else {
        probability = cdf(values.x2) - cdf(values.x1 - 1);
        range = [values.x1, values.x2];
        method = `μ = ${mean.toFixed(4)}\nP(${values.x1}≤X≤${values.x2}) = CDF(${values.x2}) − CDF(${values.x1 - 1})`;
        interpretation = `Probability of an inclusive event count from ${values.x1} through ${values.x2}.`;
      }
    } else if (values.question === "atMost") {
      probability = 1 - Math.exp(-values.rate * values.x1);
      range = [0, values.x1];
      method = `P(T≤t) = 1 − e^(−λt)\n= 1 − e^(−${values.rate}×${values.x1})`;
      interpretation = `Probability the next event occurs by ${values.x1} exposure units.`;
    } else if (values.question === "atLeast") {
      probability = Math.exp(-values.rate * values.x1);
      range = [values.x1, Math.max(values.x1, 5 / values.rate)];
      method = `P(T>t) = e^(−λt)\n= e^(−${values.rate}×${values.x1})`;
      interpretation = `Probability of waiting longer than ${values.x1} exposure units.`;
    } else {
      probability = Math.exp(-values.rate * values.x1) - Math.exp(-values.rate * values.x2);
      range = [values.x1, values.x2];
      method = "P(t₁<T≤t₂) = e^(−λt₁) − e^(−λt₂)";
      interpretation = `Probability the next event occurs after ${values.x1} but no later than ${values.x2} exposure units.`;
    }

    probability = ussClamp(probability, 0, 1);
    $("wbProbability").textContent = ussPercent(probability, 4);
    $("wbInterpretation").textContent = interpretation;
    $("wbMethod").textContent = method;
    drawWorkbench(values, probability, range);
  };

  $("wbModel").addEventListener("change", () => {
    syncFields();
    calculate();
  });
  $("wbQuestion").addEventListener("change", () => {
    syncFields();
    calculate();
  });
  $("wbCalculateBtn").addEventListener("click", calculate);
  workbenchInputs.slice(2).forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") calculate();
    });
  });

  $("wbSampleBtn").addEventListener("click", () => {
    $("wbModel").value = "poisson";
    $("wbQuestion").value = "atLeast";
    $("wbRate").value = 1.5;
    $("wbExposure").value = 2;
    $("wbX1").value = 5;
    syncFields();
    calculate();
  });

  $("wbResetBtn").addEventListener("click", () => {
    $("wbModel").value = "binomial";
    $("wbQuestion").value = "exact";
    $("wbN").value = 20;
    $("wbP").value = 0.10;
    $("wbRate").value = 2;
    $("wbExposure").value = 1;
    $("wbX1").value = 2;
    $("wbX2").value = 4;
    syncFields();
    calculate();
  });

  app.redrawCore = () => {
    app.redrawApproximation();
    calculate();
  };

  syncFields();
  calculate();
})(window.UpSkillBPE);

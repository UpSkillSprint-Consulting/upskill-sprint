((app) => {
  "use strict";

  const { $, root, syncThemeButton, css, setupCanvas, drawAll, drawBinomial, toggleReveal } = app;
  const attributeDefaults = {
    defects: [4, 5, 3, 6, 2, 5, 4, 11],
    equal: [2, 2, 2, 2, 2, 2, 2, 2],
    unequal: [2, 4, 3, 6, 5, 2.5, 7, 4]
  };
  let lastAttributeResult = null;

  const loadAttributeData = (opportunities) => {
    attributeDefaults.defects.forEach((defect, index) => {
      $("attrDefects" + (index + 1)).value = defect;
      $("attrOpportunity" + (index + 1)).value = opportunities[index];
    });
    analyzeAttribute();
  };

  const readAttributeData = () => {
    const defects = [];
    const opportunities = [];
    const errors = [];

    for (let index = 1; index <= 8; index += 1) {
      const defect = Number($("attrDefects" + index).value);
      const opportunity = Number($("attrOpportunity" + index).value);
      if (!Number.isInteger(defect) || defect < 0 || defect > 1000000) {
        errors.push(`Sample ${index} defects must be a whole number from 0 to 1,000,000.`);
      }
      if (!Number.isFinite(opportunity) || opportunity <= 0 || opportunity > 1000000) {
        errors.push(`Sample ${index} opportunity must be greater than zero and no more than 1,000,000.`);
      }
      defects.push(defect);
      opportunities.push(opportunity);
    }

    return { defects, opportunities, errors };
  };

  const drawAttributeChart = (result) => {
    if (!$("attributeCanvas")) return;
    const { ctx, w, h } = setupCanvas($("attributeCanvas"));
    const pad = { l: 48, r: 16, t: 24, b: 46 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    if (!result) {
      ctx.fillStyle = css("--muted");
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Enter valid data and analyze.", w / 2, h / 2);
      return;
    }

    const allValues = [...result.values, ...result.ucl, ...result.lcl, result.center];
    const maxY = Math.max(1, ...allValues) * 1.12;
    const xScale = (index) => pad.l + index / (result.values.length - 1) * plotW;
    const yScale = (value) => pad.t + (maxY - value) / maxY * plotH;

    ctx.strokeStyle = css("--line");
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, h - pad.b);
    ctx.lineTo(w - pad.r, h - pad.b);
    ctx.stroke();

    const drawLine = (values, color, dash = []) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash(dash);
      ctx.beginPath();
      values.forEach((value, index) => {
        if (index) ctx.lineTo(xScale(index), yScale(value));
        else ctx.moveTo(xScale(index), yScale(value));
      });
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawLine(Array(result.values.length).fill(result.center), css("--good"));
    drawLine(result.ucl, css("--accent"), [6, 5]);
    drawLine(result.lcl, css("--accent"), [6, 5]);
    drawLine(result.values, css("--brand"));

    result.values.forEach((value, index) => {
      const signal = value > result.ucl[index] || value < result.lcl[index];
      ctx.fillStyle = signal ? css("--bad") : css("--brand");
      ctx.beginPath();
      ctx.arc(xScale(index), yScale(value), signal ? 6 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = css("--muted");
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String(index + 1), xScale(index), h - pad.b + 18);
    });
    ctx.fillText("Sample", pad.l + plotW / 2, h - 8);
  };

  function analyzeAttribute() {
    const data = readAttributeData();
    const message = $("attributeMessage");

    if (data.errors.length) {
      message.className = "status-line warn";
      message.textContent = data.errors.join(" ");
      $("attributeDescription").textContent = "The chart is unavailable until all defect counts and opportunity values are valid.";
      drawAttributeChart(null);
      lastAttributeResult = null;
      return;
    }

    const equalOpportunity = data.opportunities.every((value) => Math.abs(value - data.opportunities[0]) < 1e-9);
    const rates = data.defects.map((defect, index) => defect / data.opportunities[index]);
    rates.forEach((value, index) => {
      $("attrRate" + (index + 1)).textContent = value.toFixed(3);
    });

    let result;
    if (equalOpportunity) {
      const center = data.defects.reduce((sum, value) => sum + value, 0) / data.defects.length;
      const ucl = center + 3 * Math.sqrt(center);
      const lcl = Math.max(0, center - 3 * Math.sqrt(center));
      result = {
        type: "c",
        values: data.defects,
        center,
        ucl: Array(8).fill(ucl),
        lcl: Array(8).fill(lcl)
      };
    } else {
      const totalDefects = data.defects.reduce((sum, value) => sum + value, 0);
      const totalOpportunity = data.opportunities.reduce((sum, value) => sum + value, 0);
      const center = totalDefects / totalOpportunity;
      const ucl = data.opportunities.map((opportunity) => center + 3 * Math.sqrt(center / opportunity));
      const lcl = data.opportunities.map((opportunity) => Math.max(0, center - 3 * Math.sqrt(center / opportunity)));
      result = { type: "u", values: rates, center, ucl, lcl };
    }

    const signals = result.values
      .map((value, index) => value > result.ucl[index] || value < result.lcl[index] ? index + 1 : null)
      .filter(Boolean);
    message.className = "status-line " + (signals.length ? "warn" : "good");
    message.textContent = `Selected chart: ${result.type} chart. ` +
      (equalOpportunity
        ? "Inspection opportunity is equal, so raw defect counts are comparable. "
        : "Inspection opportunity varies, so defects per opportunity are plotted with sample-specific limits. ") +
      (signals.length
        ? `Potential 3σ signal samples: ${signals.join(", ")}.`
        : "No points exceed the basic 3σ limits in this sample.");
    $("attributeDescription").textContent = `${result.type} chart with ${result.values.length} samples, centre line ${result.center.toFixed(3)}, and ${signals.length ? `potential signal samples ${signals.join(", ")}` : "no points beyond the basic 3σ limits"}.`;
    drawAttributeChart(result);
    lastAttributeResult = result;
  }

  $("analyzeAttributeBtn").addEventListener("click", analyzeAttribute);
  $("equalOpportunityBtn").addEventListener("click", () => loadAttributeData(attributeDefaults.equal));
  $("unequalOpportunityBtn").addEventListener("click", () => loadAttributeData(attributeDefaults.unequal));
  $("resetAttributeBtn").addEventListener("click", () => loadAttributeData(attributeDefaults.equal));

  const assumptions = {
    binomial: [
      "A fixed number of trials is defined before observing the results.",
      "Each trial has two mutually exclusive outcomes for the selected response.",
      "The selected-outcome probability is reasonably constant across trials.",
      "Trials are independent or dependence is negligible for the decision."
    ],
    poisson: [
      "The response is a non-negative count of events in a defined exposure.",
      "Events occur independently rather than in unexplained clusters.",
      "The average event rate is reasonably constant over the exposure being modelled.",
      "The opportunity is measured consistently and simultaneous events are negligible in the idealized model."
    ],
    exponential: [
      "The response is a continuous waiting time or distance to the next event.",
      "The underlying events are approximately independent.",
      "The event rate or hazard is reasonably constant over the range of interest.",
      "There is no strong aging, seasonality, clustering, or maintenance effect that changes the hazard."
    ]
  };

  const updateAssumptionResult = () => {
    const checkboxes = [...document.querySelectorAll("[data-assumption-index]")];
    const supported = checkboxes.filter((checkbox) => checkbox.checked).length;
    const total = checkboxes.length;
    const result = $("assumptionResult");
    result.className = "status-line " + (supported === total ? "good" : "warn");
    result.textContent = supported === total
      ? "All screening conditions are marked as reasonably supported. Continue with diagnostics and practical validation."
      : `${supported} of ${total} conditions are supported. Investigate the unchecked assumptions before relying on the model.`;
  };

  const renderAssumptions = () => {
    const model = $("assumptionModel").value;
    const fragment = document.createDocumentFragment();
    assumptions[model].forEach((text, index) => {
      const label = document.createElement("label");
      label.className = "assumption-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.assumptionIndex = String(index);
      checkbox.addEventListener("change", updateAssumptionResult);
      const span = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = `Condition ${index + 1}`;
      span.append(strong, document.createElement("br"), document.createTextNode(text));
      label.append(checkbox, span);
      fragment.append(label);
    });
    $("assumptionList").replaceChildren(fragment);
    updateAssumptionResult();
  };

  $("assumptionModel").addEventListener("change", renderAssumptions);
  $("assumptionAllBtn").addEventListener("click", () => {
    document.querySelectorAll("[data-assumption-index]").forEach((checkbox) => {
      checkbox.checked = true;
    });
    updateAssumptionResult();
  });
  $("assumptionResetBtn").addEventListener("click", () => {
    document.querySelectorAll("[data-assumption-index]").forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateAssumptionResult();
  });

  $("revealExtensionBtn").addEventListener("click", () => {
    toggleReveal($("revealExtensionBtn"), $("extensionAnswer"), "Reveal extension answer", "Hide extension answer");
  });

  const redrawThemeDependentVisuals = () => {
    syncThemeButton();
    drawAll();
    drawBinomial();
    app.redrawCore();
    drawAttributeChart(lastAttributeResult);
  };

  new MutationObserver((mutations) => {
    if (mutations.some((item) => item.attributeName === "data-theme")) {
      redrawThemeDependentVisuals();
    }
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  window.addEventListener("resize", () => {
    app.redrawCore();
    drawAttributeChart(lastAttributeResult);
  });

  loadAttributeData(attributeDefaults.equal);
  renderAssumptions();
})(window.UpSkillBPE);

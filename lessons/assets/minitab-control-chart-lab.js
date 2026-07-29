(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const defaultData = '799, 801, 800, 802, 798, 801, 800, 803, 799, 801, 800, 802, 801, 800, 802, 804, 805, 806, 805, 807, 806, 808, 807, 809, 808';
  const stableData = '800, 801, 799, 802, 800, 798, 801, 800, 803, 799, 801, 800, 802, 799, 801, 800, 798, 802, 800, 801, 799, 803, 800, 798, 801';
  const shiftData = defaultData;
  const MIN_OBSERVATIONS = 10;
  const MAX_OBSERVATIONS = 1000;
  const imrData = byId('imr-data');
  const imrError = byId('imr-error');
  const imrFindings = byId('imr-findings');
  const chartContainer = byId('imr-chart');
  let lastAnalysis = null;

  function parseValues(text) {
    const tokens = text.trim().split(/[\s,;]+/).filter(Boolean);
    const values = tokens.map(Number);
    if (values.length < MIN_OBSERVATIONS) throw new Error(`Enter at least ${MIN_OBSERVATIONS} numeric observations.`);
    if (values.some((value) => !Number.isFinite(value))) throw new Error('Remove nonnumeric entries and try again.');
    if (values.length > MAX_OBSERVATIONS) throw new Error(`Limit the demonstration to ${MAX_OBSERVATIONS.toLocaleString()} observations.`);
    return values;
  }

  function mean(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function findRuns(values, center, runLength = 9) {
    const signals = new Set();
    let side = 0;
    let count = 0;
    for (let index = 0; index < values.length; index += 1) {
      const currentSide = values[index] > center ? 1 : values[index] < center ? -1 : 0;
      if (currentSide !== 0 && currentSide === side) {
        count += 1;
      } else if (currentSide !== 0) {
        side = currentSide;
        count = 1;
      } else {
        side = 0;
        count = 0;
      }
      if (count >= runLength) {
        for (let marker = index - runLength + 1; marker <= index; marker += 1) signals.add(marker);
      }
    }
    return [...signals];
  }

  function analyzeIMR(values) {
    const avg = mean(values);
    const movingRanges = values.slice(1).map((value, index) => Math.abs(value - values[index]));
    const mrbar = mean(movingRanges);
    if (mrbar === 0) throw new Error('All moving ranges are zero; control limits cannot be estimated from these data.');
    const sigma = mrbar / 1.128;
    const uclI = avg + 3 * sigma;
    const lclI = avg - 3 * sigma;
    const uclMR = 3.267 * mrbar;
    if (![avg, mrbar, sigma, uclI, lclI, uclMR].every(Number.isFinite)) {
      throw new Error('The values are outside the numeric range supported by this browser. Use smaller units and try again.');
    }
    const outI = values.map((value, index) => value > uclI || value < lclI ? index : -1).filter((index) => index >= 0);
    const outMR = movingRanges.map((value, index) => value > uclMR ? index + 1 : -1).filter((index) => index >= 0);
    const runs = findRuns(values, avg, 9);
    return { values, avg, movingRanges, mrbar, sigma, uclI, lclI, uclMR, outI, outMR, runs };
  }

  function cssValue(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function makeSvgElement(name, attrs = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function niceNumber(value, round) {
    if (!Number.isFinite(value) || value <= 0) return 1;
    const exponent = Math.floor(Math.log10(value));
    const fraction = value / (10 ** exponent);
    let niceFraction;
    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
    return niceFraction * (10 ** exponent);
  }

  function buildScale(values, guides, options = {}) {
    const { includeZero = false, desiredTicks = 6 } = options;
    const finiteValues = [...values, ...guides].filter(Number.isFinite);
    let dataMin = Math.min(...finiteValues);
    let dataMax = Math.max(...finiteValues);
    let span = dataMax - dataMin;

    if (!Number.isFinite(span) || span === 0) {
      const reference = Math.max(Math.abs(dataMin || 0), Math.abs(dataMax || 0), 1);
      span = reference * 0.1;
      dataMin -= span / 2;
      dataMax += span / 2;
    }

    const pad = span * 0.08;
    let rawMin = dataMin - pad;
    const rawMax = dataMax + pad;
    if (includeZero) rawMin = Math.min(0, rawMin);

    const step = niceNumber((rawMax - rawMin) / Math.max(2, desiredTicks - 1), true);
    const min = includeZero ? 0 : Math.floor(rawMin / step) * step;
    let max = Math.ceil(rawMax / step) * step;
    if (max <= min) max = min + step;

    const ticks = [];
    const tolerance = Math.abs(step) * 1e-9;
    for (let value = min; value <= max + tolerance && ticks.length < 20; value += step) {
      ticks.push(Math.abs(value) < tolerance ? 0 : value);
    }

    return { min, max, span: max - min, step, ticks };
  }

  function precisionForStep(step) {
    const absolute = Math.abs(step);
    if (!Number.isFinite(absolute) || absolute === 0 || absolute >= 1) return 0;
    return Math.min(8, Math.max(0, Math.ceil(-Math.log10(absolute)) + 1));
  }

  function formatAxisValue(value, step) {
    const absolute = Math.abs(value);
    const stepAbsolute = Math.abs(step);
    if ((absolute >= 1e7 || (absolute > 0 && absolute < 1e-5)) || stepAbsolute >= 1e7 || (stepAbsolute > 0 && stepAbsolute < 1e-5)) {
      return value.toExponential(2).replace('e+', 'e');
    }
    const decimals = precisionForStep(step);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  }

  function formatMetric(value) {
    const absolute = Math.abs(value);
    if (absolute >= 1e9 || (absolute > 0 && absolute < 1e-6)) return value.toExponential(3).replace('e+', 'e');
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  function markerSettings(count) {
    if (count <= 40) return { radius: 3.4, signalRadius: 5, lineWidth: 2.2, stride: 1 };
    if (count <= 100) return { radius: 2.7, signalRadius: 4.6, lineWidth: 1.9, stride: 1 };
    if (count <= 250) return { radius: 2.1, signalRadius: 4.2, lineWidth: 1.6, stride: 2 };
    return { radius: 1.7, signalRadius: 4, lineWidth: 1.35, stride: Math.ceil(count / 140) };
  }

  function drawPanel(svg, config) {
    const { x, y, width, height, values, center, upper, lower, title, signalIndexes, indexOffset = 0, includeZero = false } = config;
    const ink = cssValue('--ink');
    const muted = cssValue('--muted');
    const line = cssValue('--line');
    const teal = cssValue('--teal');
    const danger = cssValue('--danger');
    const surfaceSoft = cssValue('--surface-soft');
    const scale = buildScale(values, [center, upper, lower], { includeZero, desiredTicks: 6 });
    const xScale = (index) => values.length === 1 ? x + width / 2 : x + (index / (values.length - 1)) * width;
    const yScale = (value) => y + height - ((value - scale.min) / scale.span) * height;
    const marker = markerSettings(values.length);

    svg.appendChild(makeSvgElement('rect', { x, y, width, height, rx: 8, fill: surfaceSoft, stroke: line }));
    const titleText = makeSvgElement('text', { x, y: y - 12, fill: ink, 'font-size': 14, 'font-weight': 800 });
    titleText.textContent = title;
    svg.appendChild(titleText);

    scale.ticks.forEach((tickValue) => {
      const yPos = yScale(tickValue);
      svg.appendChild(makeSvgElement('line', {
        x1: x,
        y1: yPos,
        x2: x + width,
        y2: yPos,
        stroke: line,
        'stroke-width': 0.8,
        'stroke-dasharray': '2 5'
      }));
      const tickLabel = makeSvgElement('text', {
        x: x - 12,
        y: yPos + 4,
        fill: muted,
        'font-size': 10,
        'text-anchor': 'end'
      });
      tickLabel.textContent = formatAxisValue(tickValue, scale.step);
      svg.appendChild(tickLabel);
    });

    const xTickCount = Math.min(10, values.length);
    const xTickStep = Math.max(1, Math.ceil((values.length - 1) / Math.max(1, xTickCount - 1)));
    for (let index = 0; index < values.length; index += xTickStep) {
      const xPos = xScale(index);
      svg.appendChild(makeSvgElement('line', {
        x1: xPos,
        y1: y,
        x2: xPos,
        y2: y + height,
        stroke: line,
        'stroke-width': 0.6,
        opacity: 0.5
      }));
      const tickLabel = makeSvgElement('text', {
        x: xPos,
        y: y + height + 18,
        fill: muted,
        'font-size': 9.5,
        'text-anchor': 'middle'
      });
      tickLabel.textContent = String(index + 1 + indexOffset);
      svg.appendChild(tickLabel);
    }
    if ((values.length - 1) % xTickStep !== 0) {
      const lastIndex = values.length - 1;
      const tickLabel = makeSvgElement('text', {
        x: xScale(lastIndex),
        y: y + height + 18,
        fill: muted,
        'font-size': 9.5,
        'text-anchor': 'end'
      });
      tickLabel.textContent = String(lastIndex + 1 + indexOffset);
      svg.appendChild(tickLabel);
    }

    const guides = [
      { value: upper, label: 'UCL', color: danger, dash: '5 4' },
      { value: center, label: 'CL', color: muted, dash: '3 3' },
      { value: lower, label: 'LCL', color: danger, dash: '5 4' }
    ].filter((guide) => Number.isFinite(guide.value));

    guides.forEach((guide) => {
      const yPos = yScale(guide.value);
      svg.appendChild(makeSvgElement('line', {
        x1: x,
        y1: yPos,
        x2: x + width,
        y2: yPos,
        stroke: guide.color,
        'stroke-width': 1.2,
        'stroke-dasharray': guide.dash
      }));
      const label = makeSvgElement('text', {
        x: x + width + 8,
        y: yPos + 4,
        fill: guide.color,
        'font-size': 10,
        'text-anchor': 'start'
      });
      label.textContent = `${guide.label} ${formatAxisValue(guide.value, scale.step)}`;
      svg.appendChild(label);
    });

    const points = values.map((value, index) => `${xScale(index)},${yScale(value)}`).join(' ');
    svg.appendChild(makeSvgElement('polyline', {
      points,
      fill: 'none',
      stroke: teal,
      'stroke-width': marker.lineWidth,
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round'
    }));

    values.forEach((value, index) => {
      const actualIndex = index + indexOffset;
      const isSignal = signalIndexes.has(actualIndex);
      const shouldDrawMarker = isSignal || index % marker.stride === 0 || index === values.length - 1;
      if (!shouldDrawMarker) return;
      svg.appendChild(makeSvgElement('circle', {
        cx: xScale(index),
        cy: yScale(value),
        r: isSignal ? marker.signalRadius : marker.radius,
        fill: isSignal ? danger : teal,
        stroke: isSignal ? ink : teal,
        'stroke-width': isSignal ? 1 : 0
      }));
    });
  }

  function drawIMR(result) {
    chartContainer.innerHTML = '';
    const svg = makeSvgElement('svg', {
      viewBox: '0 0 980 650',
      role: 'img',
      'aria-labelledby': 'imr-svg-title imr-svg-desc',
      preserveAspectRatio: 'xMidYMid meet'
    });
    const title = makeSvgElement('title', { id: 'imr-svg-title' });
    title.textContent = 'Individuals and Moving Range control chart';
    const desc = makeSvgElement('desc', { id: 'imr-svg-desc' });
    desc.textContent = `Adaptive I-MR chart for ${result.values.length} chronological observations. The Individuals chart ranges from ${formatMetric(Math.min(...result.values))} to ${formatMetric(Math.max(...result.values))}; the Moving Range chart ranges from 0 to ${formatMetric(Math.max(...result.movingRanges, result.uclMR))}.`;
    svg.append(title, desc);

    const signalI = new Set([...result.outI, ...result.runs]);
    const signalMR = new Set(result.outMR);
    drawPanel(svg, {
      x: 105,
      y: 55,
      width: 745,
      height: 225,
      values: result.values,
      center: result.avg,
      upper: result.uclI,
      lower: result.lclI,
      title: 'Individuals chart',
      signalIndexes: signalI
    });
    drawPanel(svg, {
      x: 105,
      y: 385,
      width: 745,
      height: 185,
      values: result.movingRanges,
      center: result.mrbar,
      upper: result.uclMR,
      lower: 0,
      title: 'Moving Range chart',
      signalIndexes: signalMR,
      indexOffset: 1,
      includeZero: true
    });

    const xLabel = makeSvgElement('text', {
      x: 480,
      y: 630,
      fill: cssValue('--muted'),
      'font-size': 12,
      'text-anchor': 'middle'
    });
    xLabel.textContent = 'Chronological observation number';
    svg.appendChild(xLabel);
    chartContainer.appendChild(svg);
  }

  function updateIMRMetrics(result) {
    byId('metric-n').textContent = result.values.length.toLocaleString();
    byId('metric-mean').textContent = formatMetric(result.avg);
    byId('metric-mrbar').textContent = formatMetric(result.mrbar);
    byId('metric-sigma').textContent = formatMetric(result.sigma);
  }

  function updateIMRFindings(result) {
    const findings = [];
    if (result.outMR.length) findings.push(`<li class="signal">MR Test 1: unusually large change at observation(s) ${result.outMR.map((index) => index + 1).join(', ')}.</li>`);
    if (result.outI.length) findings.push(`<li class="signal">I Test 1: point(s) outside the 3σ limits at observation(s) ${result.outI.map((index) => index + 1).join(', ')}.</li>`);
    if (result.runs.length) {
      const unique = [...new Set(result.runs.map((index) => index + 1))];
      findings.push(`<li class="signal">I Test 2 pattern: a run of at least nine points on one side includes observation(s) ${unique.join(', ')}.</li>`);
    }
    if (!findings.length) findings.push('<li class="stable">No Test 1 or nine-point same-side signal was detected in this educational calculation.</li>');
    findings.push(`<li>I-chart limits: ${formatMetric(result.lclI)} to ${formatMetric(result.uclI)}.</li>`);
    findings.push(`<li>MR-chart upper limit: ${formatMetric(result.uclMR)}.</li>`);
    imrFindings.innerHTML = `<h3>Findings</h3><ul class="status-list">${findings.join('')}</ul>`;
  }

  function runIMR() {
    try {
      imrError.textContent = '';
      const result = analyzeIMR(parseValues(imrData.value));
      lastAnalysis = result;
      updateIMRMetrics(result);
      drawIMR(result);
      updateIMRFindings(result);
    } catch (error) {
      imrError.textContent = error.message;
    }
  }

  byId('analyze-imr').addEventListener('click', runIMR);
  byId('load-stable').addEventListener('click', () => { imrData.value = stableData; runIMR(); });
  byId('load-shift').addEventListener('click', () => { imrData.value = shiftData; runIMR(); });
  byId('reset-imr').addEventListener('click', () => {
    imrData.value = defaultData;
    imrError.textContent = '';
    runIMR();
  });

  const themeObserver = new MutationObserver(() => {
    if (lastAnalysis) drawIMR(lastAnalysis);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  runIMR();
})();
    (() => {
      'use strict';
      const byId = (id) => document.getElementById(id);
      const defaultData = '799, 801, 800, 802, 798, 801, 800, 803, 799, 801, 800, 802, 801, 800, 802, 804, 805, 806, 805, 807, 806, 808, 807, 809, 808';
      const stableData = '800, 801, 799, 802, 800, 798, 801, 800, 803, 799, 801, 800, 802, 799, 801, 800, 798, 802, 800, 801, 799, 803, 800, 798, 801';
      const shiftData = defaultData;
      const imrData = byId('imr-data');
      const imrError = byId('imr-error');
      const imrFindings = byId('imr-findings');
      const chartContainer = byId('imr-chart');
      let lastAnalysis = null;

      function parseValues(text) {
        const tokens = text.trim().split(/[\s,;]+/).filter(Boolean);
        const values = tokens.map(Number);
        if (values.length < 10) throw new Error('Enter at least 10 numeric observations.');
        if (values.some((value) => !Number.isFinite(value))) throw new Error('Remove nonnumeric entries and try again.');
        if (values.length > 200) throw new Error('Limit the demonstration to 200 observations.');
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

      function drawPanel(svg, config) {
        const { x, y, width, height, values, center, upper, lower, title, signalIndexes, indexOffset = 0 } = config;
        const ink = cssValue('--ink');
        const muted = cssValue('--muted');
        const line = cssValue('--line');
        const teal = cssValue('--teal');
        const danger = cssValue('--danger');
        const surfaceSoft = cssValue('--surface-soft');
        const minData = Math.min(...values, lower ?? Infinity, center);
        const maxData = Math.max(...values, upper ?? -Infinity, center);
        const dataSpan = maxData - minData;
        const pad = Math.max(dataSpan * 0.12, Math.abs(center || maxData || 1) * 0.002, 0.25);
        const hasZeroLowerLimit = Number.isFinite(lower) && Math.abs(lower) < 1e-12;
        const minY = hasZeroLowerLimit ? 0 : minData - pad;
        const maxY = maxData + pad;
        const chartSpan = maxY - minY || 1;
        const xScale = (index) => values.length === 1 ? x + width / 2 : x + (index / (values.length - 1)) * width;
        const yScale = (value) => y + height - ((value - minY) / chartSpan) * height;

        svg.appendChild(makeSvgElement('rect', { x, y, width, height, rx: 8, fill: surfaceSoft, stroke: line }));
        const titleText = makeSvgElement('text', { x: x + 8, y: y - 8, fill: ink, 'font-size': 14, 'font-weight': 800 });
        titleText.textContent = title;
        svg.appendChild(titleText);

        for (let tick = 0; tick <= 4; tick += 1) {
          const tickValue = maxY - (chartSpan * tick / 4);
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
            x: x - 9,
            y: yPos + 4,
            fill: muted,
            'font-size': 10,
            'text-anchor': 'end'
          });
          tickLabel.textContent = tickValue.toFixed(dataSpan < 10 ? 1 : 0);
          svg.appendChild(tickLabel);
        }

        const guides = [
          { value: upper, label: 'UCL', color: danger, dash: '5 4' },
          { value: center, label: 'CL', color: muted, dash: '3 3' },
          { value: lower, label: 'LCL', color: danger, dash: '5 4' }
        ].filter((guide) => Number.isFinite(guide.value));

        guides.forEach((guide) => {
          const yPos = yScale(guide.value);
          svg.appendChild(makeSvgElement('line', { x1: x, y1: yPos, x2: x + width, y2: yPos, stroke: guide.color, 'stroke-width': 1.2, 'stroke-dasharray': guide.dash }));
          const label = makeSvgElement('text', { x: x + width - 4, y: yPos - 4, fill: guide.color, 'font-size': 10, 'text-anchor': 'end' });
          label.textContent = `${guide.label} ${guide.value.toFixed(2)}`;
          svg.appendChild(label);
        });

        const points = values.map((value, index) => `${xScale(index)},${yScale(value)}`).join(' ');
        svg.appendChild(makeSvgElement('polyline', { points, fill: 'none', stroke: teal, 'stroke-width': 2.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
        values.forEach((value, index) => {
          const actualIndex = index + indexOffset;
          const isSignal = signalIndexes.has(actualIndex);
          svg.appendChild(makeSvgElement('circle', { cx: xScale(index), cy: yScale(value), r: isSignal ? 4.7 : 3.3, fill: isSignal ? danger : teal, stroke: isSignal ? ink : teal, 'stroke-width': isSignal ? 1 : 0 }));
        });
      }

      function drawIMR(result) {
        chartContainer.innerHTML = '';
        const svg = makeSvgElement('svg', { viewBox: '0 0 920 600', role: 'img', 'aria-labelledby': 'imr-svg-title imr-svg-desc' });
        const title = makeSvgElement('title', { id: 'imr-svg-title' });
        title.textContent = 'Individuals and Moving Range control chart';
        const desc = makeSvgElement('desc', { id: 'imr-svg-desc' });
        desc.textContent = 'The upper panel displays individual observations with center line and control limits. The lower panel displays moving ranges.';
        svg.append(title, desc);
        const signalI = new Set([...result.outI, ...result.runs]);
        const signalMR = new Set(result.outMR);
        drawPanel(svg, { x: 65, y: 55, width: 810, height: 210, values: result.values, center: result.avg, upper: result.uclI, lower: result.lclI, title: 'Individuals chart', signalIndexes: signalI });
        drawPanel(svg, { x: 65, y: 345, width: 810, height: 175, values: result.movingRanges, center: result.mrbar, upper: result.uclMR, lower: 0, title: 'Moving Range chart', signalIndexes: signalMR, indexOffset: 1 });
        const xLabel = makeSvgElement('text', { x: 470, y: 575, fill: cssValue('--muted'), 'font-size': 12, 'text-anchor': 'middle' });
        xLabel.textContent = 'Chronological observation sequence';
        svg.appendChild(xLabel);
        chartContainer.appendChild(svg);
      }

      function updateIMRMetrics(result) {
        byId('metric-n').textContent = result.values.length;
        byId('metric-mean').textContent = result.avg.toFixed(2);
        byId('metric-mrbar').textContent = result.mrbar.toFixed(2);
        byId('metric-sigma').textContent = result.sigma.toFixed(2);
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
        findings.push(`<li>I-chart limits: ${result.lclI.toFixed(2)} to ${result.uclI.toFixed(2)}.</li>`);
        findings.push(`<li>MR-chart upper limit: ${result.uclMR.toFixed(2)}.</li>`);
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
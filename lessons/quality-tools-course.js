(function () {
  'use strict';

  function q(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function installCourseChrome() {
    if (!q('header.site')) {
      const header = document.createElement('div');
      header.innerHTML = `
        <input type="checkbox" id="mnav-check" class="mnav-check" aria-hidden="true">
        <header class="site">
          <a href="/index.html" class="brand">
            <img src="/assets/logo-icon.png" alt="UpSkill Sprint Consulting logo">
            <span>UpSkill Sprint Consulting</span>
          </a>
          <nav class="desktop-nav">
            <a href="/start-here.html">Start Here</a>
            <a href="/lessons.html" aria-current="page">Lessons</a>
            <a href="/services.html">Services</a>
            <a href="/request-topic.html">Request a Topic</a>
            <a href="/about.html">About</a>
            <a href="/faq.html">FAQ</a>
            <a href="/contact.html">Contact</a>
          </nav>
          <label for="mnav-check" class="mobile-menu-btn" aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </label>
          <a href="/lessons.html" class="btn btn-teal header-cta" style="padding:9px 15px;font-size:12.5px;">Browse lessons</a>
        </header>
        <nav class="mobile-nav">
          <a href="/start-here.html">Start Here</a>
          <a href="/lessons.html">Lessons</a>
          <a href="/services.html">Services</a>
          <a href="/request-topic.html">Request a Topic</a>
          <a href="/about.html">About</a>
          <a href="/faq.html">FAQ</a>
          <a href="/contact.html">Contact</a>
        </nav>`;
      while (header.firstChild) document.body.insertBefore(header.firstChild, document.body.firstChild);
    }

    if (!q('footer.site')) {
      const footer = document.createElement('footer');
      footer.className = 'site';
      footer.innerHTML = `
        <div class="wrap">
          <div class="footer-grid">
            <div>
              <div class="brand" style="margin-bottom:14px;">
                <img src="/assets/logo-icon.png" alt="UpSkill Sprint Consulting logo">
                <span>UpSkill Sprint Consulting</span>
              </div>
              <p style="font-size:13.5px;line-height:1.6;color:var(--muted);max-width:260px;margin:0;">Practical learning for quality, data, process improvement, and business problem-solving.</p>
            </div>
            <div><h4>Quick Links</h4><a href="/index.html">Home</a><a href="/start-here.html">Start Here</a><a href="/lessons.html">Lessons</a><a href="/services.html">Services</a><a href="/request-topic.html">Request a Topic</a><a href="/about.html">About</a><a href="/faq.html">FAQ</a><a href="/contact.html">Contact</a></div>
            <div><h4>Topics</h4><a href="/lessons.html#data-analytics">Data Analytics</a><a href="/lessons.html#quality-engineering">Quality Engineering</a><a href="/lessons.html#lean-six-sigma">Lean Six Sigma</a><a href="/lessons.html#power-bi-excel-sql">Power BI, Excel &amp; SQL</a><a href="/lessons.html#business-decision-making">Business Decision-Making</a></div>
            <div><h4>Contact</h4><a href="mailto:skillsprintconsulting@gmail.com">skillsprintconsulting@gmail.com</a><p style="font-size:13.5px;color:var(--muted);margin:0;">Saskatchewan, Canada</p></div>
          </div>
        </div>`;
      document.body.appendChild(footer);
    }
  }

  function seedRand(seed) {
    let x = seed || 123456;
    return function () {
      x = (x * 1664525 + 1013904223) % 4294967296;
      return x / 4294967296;
    };
  }

  function bars(el, data, labels) {
    el.innerHTML = '<div class="qt-bars">' + data.map(function (value, index) {
      return '<div class="qt-bar" style="height:' + Math.max(4, value) + '%"><span>' + Math.round(value) + '</span><label>' + labels[index] + '</label></div>';
    }).join('') + '</div>';
  }

  function installProgress() {
    const progress = q('[data-progress]');
    if (!progress) return;
    const key = 'qt-progress-' + location.pathname;
    let done = Number(localStorage.getItem(key) || 0);
    progress.style.width = done + '%';

    document.addEventListener('click', function (event) {
      const button = event.target.closest('[data-complete]');
      if (!button || !document.body.contains(button)) return;
      const buttons = qa('[data-complete]');
      const index = Math.max(0, buttons.indexOf(button));
      done = Math.max(done, buttons.length ? Math.round((index + 1) / buttons.length * 100) : 100);
      localStorage.setItem(key, done);
      progress.style.width = done + '%';
      button.textContent = 'Completed ✓';
    });
  }

  function installQuiz() {
    qa('[data-quiz]').forEach(function (button) {
      button.addEventListener('click', function () {
        const box = button.closest('.qt-quiz');
        const ok = button.dataset.correct === 'true';
        const feedback = q('.qt-feedback', box);
        qa('button', box).forEach(function (item) { item.disabled = true; });
        feedback.textContent = ok ? 'Correct — that follows the tool-selection logic.' : 'Not quite. Use the question being answered, not the tool name, to decide.';
        feedback.style.color = ok ? 'var(--qt-teal)' : 'var(--qt-red)';
      });
    });
  }

  function installBasicToolInteractives() {
    const histogram = q('#histogram');
    if (histogram) {
      const mean = q('#mean');
      const sd = q('#sd');
      const outlier = q('#outlier');
      function drawHistogram() {
        const random = seedRand(42);
        const bins = Array(10).fill(0);
        for (let i = 0; i < 120; i += 1) {
          const u = Math.max(0.0001, random());
          const v = Math.max(0.0001, random());
          const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
          let x = Number(mean.value) + Number(sd.value) * z;
          if (outlier.checked && i < 5) x += Number(sd.value) * 4;
          const bin = Math.max(0, Math.min(9, Math.floor((x - (Number(mean.value) - 4 * Number(sd.value))) / (8 * Number(sd.value)) * 10)));
          bins[bin] += 1;
        }
        const max = Math.max.apply(null, bins);
        bars(histogram, bins.map(function (value) { return value / max * 90; }), bins.map(function (_, index) { return index + 1; }));
        q('#hist-readout').textContent = 'Mean ' + mean.value + ', SD ' + sd.value + (outlier.checked ? ' with injected outliers' : '') + '. Observe centering, spread, and tails.';
      }
      [mean, sd, outlier].forEach(function (item) { item.addEventListener('input', drawHistogram); });
      drawHistogram();
    }

    const pareto = q('#pareto');
    if (pareto) bars(pareto, [90, 24, 13, 8, 5], ['Low YS', 'Elong.', 'Low UTS', 'Brittle', 'Dim.']);

    const correlation = q('#corr');
    if (correlation) {
      const slider = q('#correlation');
      function drawCorrelation() {
        const strength = Number(slider.value);
        correlation.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 600 300');
        svg.style.width = '100%';
        svg.style.height = '100%';
        const random = seedRand(7);
        for (let i = 0; i < 32; i += 1) {
          const x = 35 + i * 16;
          const noise = (random() - 0.5) * 120 * (1 - strength);
          const y = 250 - i * 5 * strength + noise;
          const circle = document.createElementNS(svg.namespaceURI, 'circle');
          circle.setAttribute('cx', x);
          circle.setAttribute('cy', Math.max(20, Math.min(280, y)));
          circle.setAttribute('r', '5');
          circle.setAttribute('fill', 'var(--qt-blue)');
          svg.appendChild(circle);
        }
        correlation.appendChild(svg);
        q('#corr-label').textContent = 'Relationship strength: ' + strength.toFixed(2) + (strength > 0.75 ? ' — strong pattern; still not proof of causation.' : ' — weak/moderate pattern; investigate subgrouping and range.');
      }
      slider.addEventListener('input', drawCorrelation);
      drawCorrelation();
    }

    qa('[data-tool-node]').forEach(function (node) {
      node.addEventListener('click', function () {
        qa('[data-tool-node]').forEach(function (item) { item.classList.remove('active'); });
        node.classList.add('active');
        q('#tool-detail').innerHTML = '<h3>' + node.dataset.name + '</h3><p>' + node.dataset.detail + '</p><p><strong>Move next when:</strong> ' + node.dataset.trigger + '</p>';
      });
    });
  }

  function installLegacyWizard() {
    const wizard = q('#wizard');
    if (!wizard) return;
    let step = 0;
    let answers = [];
    const questions = [
      ['Do you have measured data?', ['Yes', 'No']],
      ['What are you trying to understand?', ['Process path', 'Dominant category', 'Variation shape', 'Relationship', 'Stability', 'Planning']],
      ['Is the cause already confirmed?', ['Yes', 'No']]
    ];
    function render() {
      if (step < questions.length) {
        wizard.innerHTML = '<h3>' + questions[step][0] + '</h3>' + questions[step][1].map(function (answer) { return '<button class="qt-btn secondary" data-a="' + answer + '">' + answer + '</button>'; }).join(' ');
        qa('[data-a]', wizard).forEach(function (button) {
          button.onclick = function () { answers.push(button.dataset.a); step += 1; render(); };
        });
        return;
      }
      const joined = answers.join('|');
      const tool = joined.includes('Planning') ? 'Affinity Diagram' : joined.includes('Process path') ? 'Flowchart' : joined.includes('Dominant') ? 'Pareto Chart' : joined.includes('Variation') ? 'Histogram' : joined.includes('Relationship') ? 'Scatter Plot' : joined.includes('Stability') ? 'Control Chart' : 'Check Sheet / Stratification';
      wizard.innerHTML = '<h3>Recommended next tool: ' + tool + '</h3><p>This recommendation is based on the question you need answered. Restart to test another situation.</p><button class="qt-btn" id="restart-wizard">Restart</button>';
      q('#restart-wizard').onclick = function () { step = 0; answers = []; render(); };
    }
    render();
  }

  function installLegacyProjectSimulator() {
    const simulator = q('#project-sim');
    if (!simulator) return;
    let phase = 0;
    let score = 0;
    const cases = [
      { q: 'The team cannot agree where a tensile failure may originate.', a: 'Flowchart', opts: ['Pareto', 'Flowchart', 'PDPC'] },
      { q: 'Failures are pooled across grades and shifts.', a: 'Stratification', opts: ['Stratification', 'Fishbone', 'Control Chart'] },
      { q: 'Low yield strength dominates within Shift C.', a: 'Fishbone', opts: ['Affinity', 'Fishbone', 'Activity Network'] },
      { q: 'A suspected finish-temperature effect must be tested.', a: 'Scatter Plot', opts: ['Scatter Plot', 'Matrix Diagram', 'Check Sheet'] },
      { q: 'The root cause is confirmed; dozens of action ideas exist.', a: 'Affinity Diagram', opts: ['Affinity Diagram', 'Histogram', 'Pareto'] },
      { q: 'Tasks need owners and dependencies.', a: 'Matrix + Activity Network', opts: ['Matrix + Activity Network', 'Fishbone + Histogram', 'Check Sheet + Pareto'] }
    ];
    function show() {
      if (phase >= cases.length) {
        simulator.innerHTML = '<h3>Project complete</h3><p>Your score: ' + score + '/' + cases.length + '. You moved from diagnosis to an executable plan.</p><button class="qt-btn primary" data-complete>Mark project complete</button>';
        return;
      }
      const current = cases[phase];
      simulator.innerHTML = '<div class="qt-scenario"><strong>Stage ' + (phase + 1) + '</strong><p>' + current.q + '</p>' + current.opts.map(function (option) { return '<button class="qt-btn secondary" data-sim="' + option + '">' + option + '</button>'; }).join(' ') + '<p id="sim-f"></p></div>';
      qa('[data-sim]', simulator).forEach(function (button) {
        button.onclick = function () {
          const ok = button.dataset.sim === current.a;
          q('#sim-f').textContent = ok ? 'Correct. Move forward.' : 'That tool answers a different question. Try again.';
          if (ok) { score += 1; window.setTimeout(function () { phase += 1; show(); }, 550); }
        };
      });
    }
    show();
  }

  function installAdvancedStatSelector() {
    const run = q('#stat-run');
    if (!run) return;
    run.onclick = function () {
      const objective = q('#stat-objective').value;
      const response = q('#stat-response').value;
      const factors = q('#stat-factors').value;
      const controlled = q('#stat-control').value;
      let method = '';
      let explanation = '';

      if (objective === 'optimize') {
        if (controlled === 'yes') {
          method = factors === '3' ? 'Screening factorial DOE, followed by response-surface optimization when needed' : 'Full factorial DOE with confirmation runs';
          explanation = 'Experimentation can estimate factor effects and interactions under controlled changes.';
        } else {
          method = 'Observational screening, stratification, and regression before DOE';
          explanation = 'Optimization cannot be established defensibly from uncontrolled observations alone. Identify plausible factors, address confounding, and determine whether a controlled experiment can be run.';
        }
      } else if (objective === 'compare') {
        if (response === 'continuous') {
          if (factors === '1') method = 'One-sample t-test against a target or paired t-test for matched observations';
          else if (factors === '2') method = 'Two-sample t-test, paired t-test, or two-factor model depending on the design';
          else method = 'One-way or factorial ANOVA / general linear model';
        } else {
          method = response === 'binary' ? 'Two-proportions test, chi-square test, or logistic regression' : 'Poisson test, rate comparison, or count regression';
        }
        explanation = 'The method must match the number of groups, whether observations are paired, and the response distribution.';
      } else if (objective === 'relationship') {
        method = response === 'continuous' ? 'Scatter plot and correlation, followed by regression' : response === 'binary' ? 'Logistic regression' : 'Poisson or negative-binomial regression';
        explanation = 'Relationship methods quantify association; causal claims still require design, mechanism, and confounding control.';
      } else if (objective === 'predict') {
        method = response === 'continuous' ? 'Regression with holdout or grouped validation' : response === 'binary' ? 'Logistic regression or a validated classification model' : 'Validated count-regression model';
        explanation = 'Prediction requires out-of-sample validation and a decision threshold, not only in-sample fit.';
      } else if (objective === 'stability') {
        method = response === 'continuous' ? 'I-MR or X̄-R/S control chart selected by subgroup structure' : 'p, np, c, or u chart selected by denominator and defect definition';
        explanation = 'The chart must reflect the data type and rational subgrouping.';
      } else if (objective === 'capability') {
        method = response === 'continuous' ? 'Capability analysis after MSA and stability checks' : 'Binomial or Poisson capability analysis';
        explanation = 'Capability indices are interpretable only after measurement adequacy and process stability are established.';
      }

      q('#stat-output').innerHTML = '<h3>' + method + '</h3><p><strong>Prerequisites:</strong> operational definitions, adequate MSA, representative data, correct independence or subgroup assumptions, and a clear decision threshold.</p><div class="qw-callout"><strong>Why:</strong> ' + explanation + '</div>';
    };
  }

  function installAdvancedSimulator() {
    const simulator = q('#simulator');
    if (!simulator) return;
    const stages = [
      { q: 'Failures are detected at final tensile testing. What should the team do first?', correct: 'map', opts: { map: 'Map the full process and mark origin and detection points', fish: 'Build a fishbone immediately', doe: 'Run a DOE on furnace and cooling settings' }, why: 'The team must first understand the process and where the property can be created, changed, or measured.' },
      { q: 'The map is complete, but records contain only PASS/FAIL and coil ID. What next?', correct: 'check', opts: { check: 'Design a traceable check sheet and data-linkage plan', pareto: 'Make a Pareto from PASS/FAIL', reg: 'Fit a regression immediately' }, why: 'The current data cannot support subgrouping, MSA, or causal analysis.' },
      { q: 'Some retests use the opposite coil end and one extensometer appears unusual. What next?', correct: 'msa', opts: { msa: 'Separate linkage populations and assess the measurement system', fish: 'Vote on the most likely root cause', pdpc: 'Create a PDPC' }, why: 'Measurement and linkage uncertainty must be controlled before process conclusions are trusted.' },
      { q: 'Reliable linked data now show failures concentrated on one grade, shift, and same-end retest pattern. What next?', correct: 'focus', opts: { focus: 'Use stratification, Pareto, and focused hypothesis generation', all: 'Pool all products to increase sample size', doe: 'Skip directly to optimization' }, why: 'The effect must be precisely scoped before testing candidate causes.' },
      { q: 'A candidate thermal-history factor is associated with YS while UTS remains stable. What next?', correct: 'validate', opts: { validate: 'Test the relationship using mechanism, regression or hypothesis testing, then confirm', declare: 'Declare root cause from correlation alone', network: 'Build the project schedule' }, why: 'Association is evidence, but causal credibility requires validation and consideration of confounding.' },
      { q: 'The corrective action is technically validated. What next?', correct: 'plan', opts: { plan: 'Use affinity, tree, prioritization, RACI, PDPC, and activity network as needed', close: 'Close the project immediately', fish: 'Repeat the fishbone' }, why: 'A technically sound fix still needs ownership, risk controls, sequencing, and governance.' },
      { q: 'The fix is implemented. What completes the project?', correct: 'control', opts: { control: 'Establish SPC, reaction plan, control plan, and handoff', cap: 'Report one post-fix capability index only', email: 'Send a completion email' }, why: 'Sustainment requires time-ordered evidence, defined reactions, ownership, and operational handoff.' }
    ];
    let stage = 0;

    function render(message) {
      if (stage >= stages.length) {
        simulator.innerHTML = '<h3>Investigation complete</h3><p>You moved from scope and evidence through validation, implementation planning, and sustained control.</p><button class="qw-btn primary" data-complete>Mark capstone complete</button>';
        return;
      }
      const current = stages[stage];
      simulator.innerHTML = '<p class="qw-small">Stage ' + (stage + 1) + ' of ' + stages.length + '</p><h3>' + current.q + '</h3>' + Object.entries(current.opts).map(function (entry) { return '<button class="qw-option" data-advanced-sim="' + entry[0] + '">' + entry[1] + '</button>'; }).join('') + '<div class="qw-feedback">' + (message || '') + '</div>';
      qa('[data-advanced-sim]', simulator).forEach(function (button) {
        button.onclick = function () {
          if (button.dataset.advancedSim !== current.correct) {
            q('.qw-feedback', simulator).innerHTML = '<span style="color:var(--qw-red)"><strong>Not yet.</strong> ' + current.why + '</span>';
            return;
          }
          qa('[data-advanced-sim]', simulator).forEach(function (item) { item.disabled = true; });
          q('.qw-feedback', simulator).innerHTML = '<span style="color:var(--teal)"><strong>Correct.</strong> ' + current.why + '</span><div class="qw-tabs"><button class="qw-btn primary" id="advanced-sim-continue">Continue to next stage</button></div>';
          q('#advanced-sim-continue').onclick = function () { stage += 1; render(); };
        };
      });
    }
    render();
  }

  installCourseChrome();
  installProgress();
  installQuiz();
  installBasicToolInteractives();
  installLegacyWizard();
  installLegacyProjectSimulator();
  installAdvancedStatSelector();
  installAdvancedSimulator();
}());

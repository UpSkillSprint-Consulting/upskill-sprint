/* Steel Phase Explorer — Student guides.
   Adds a "How to use & read this tool" button to every tab. The bar is visible only in Student mode
   (CSS keys off #spx-tool[data-workspace-mode]); the dialog is a labelled modal with a focus trap,
   Escape to close, and focus restored to the opener. Each tab has its own guide. */
(function () {
  'use strict';

  var GUIDES = {
    navigator: {
      title: 'Guided start',
      purpose: 'Your home base in Student mode. Pick what to learn, jump into a lab, check your understanding, and see your progress.',
      use: [
        'Use the Learn, Explore, Practice, and My Progress buttons at the top of this tab to switch between areas.',
        'In Learn, choose a guided learning path. Each path opens the right tab and walks you through it step by step.',
        'In Explore, choose an interactive lab to go straight to one tool, such as TTT / CCT or Hardenability.',
        'In Practice, answer the understanding checks before looking anything up.',
        'In My Progress, use Continue learning to pick up where you stopped.'
      ],
      read: [
        ['Path cards', 'The level (Foundation, Developing, …), number of steps, and status: Not started, In progress, or Complete.'],
        ['Labs explored', 'Which tools you have opened so far. Aim to try each one at least once.'],
        ['Saved work', 'Progress is stored in this browser only. Another device or a cleared browser starts fresh.']
      ],
      tryThis: 'Start with Phase Diagram Foundations. Most of the other tools assume you can read the iron–carbon diagram.',
      caution: 'Every tab is always available from the tab bar. The guided paths are a suggested order, not a lock.'
    },

    equilibrium: {
      title: 'Equilibrium diagram',
      purpose: 'Find which phases are stable at a given carbon content and temperature, and how much of each, if the steel is held long enough to reach equilibrium.',
      use: [
        'Select a point (P1, P2, …) in the table, then type its carbon (0–1.2 wt%) and temperature. You can also drag its marker or tap the diagram.',
        'Use + Add point to compare several steels or temperatures. The example buttons (Low-C austenite, Intercritical steel, Eutectoid, …) load typical cases.',
        'Turn on Show tie line to see the lever rule for two-phase points. Snap to critical boundaries places a point exactly on a line.',
        'Connect points as path joins your points in order, like a simple heating or cooling route.',
        'Switch °C / °F if you prefer. Changing units never moves a point.'
      ],
      read: [
        ['Phase analysis', 'The phase field name and the fraction of each phase. For two-phase points it also gives each phase’s carbon content.'],
        ['Tie line', 'A horizontal line across a two-phase field. Its ends give each phase’s composition. Lever rule: the fraction of a phase equals the length of the opposite arm divided by the whole line.'],
        ['Microstructure viewer', 'A schematic picture of the phases, not a real micrograph.'],
        ['Slow-cooled estimate', 'What you would see at room temperature after very slow cooling: ferrite, pearlite, or proeutectoid cementite.'],
        ['Crystal structure', 'Austenite is FCC, ferrite BCC, cementite Fe₃C, martensite BCT. Drag to rotate.']
      ],
      tryThis: 'Put a point at 0.40 wt% C and 760 °C (ferrite + austenite). Raise the temperature until it becomes 100% austenite. That temperature is A₃ for this steel.',
      caution: 'This diagram has no time in it. It cannot tell you what forms on a quench. Use TTT / CCT for that. Also, a phase is not the same as a microconstituent: pearlite is a mixture of ferrite and cementite.'
    },

    path: {
      title: 'Heating & cooling path',
      purpose: 'Build a heat-treatment cycle and watch which equilibrium phase field the steel passes through at each moment.',
      use: [
        'Choose a Preset cycle (Normalizing, Quench and temper, Austempering, …) or build your own.',
        'Each step row has a target temperature, a duration in minutes, and a label. Use + Step to add a step and Remove to delete one.',
        'Set the steel’s Carbon (wt%).',
        'Press Play, or drag the slider to move through the cycle. Animation speed changes playback only.'
      ],
      read: [
        ['Cycle chart', 'Temperature against elapsed time. The dot marks the current moment.'],
        ['Equilibrium phase reference', 'The phase field, phase fractions, and a schematic at the current temperature.'],
        ['Boundary timeline', 'When the cycle crosses A₁ and A₃ (or Acm), which is when a phase change becomes possible.'],
        ['Preset notes', 'Austempering and martempering set their bath temperature from the estimated Ms for your carbon.']
      ],
      tryThis: 'Compare Normalizing with Austenitize + quench. They pass through the same equilibrium fields, yet real steel ends up very different. That difference is transformation kinetics.',
      caution: 'This tab is equilibrium only. After a fast quench it still shows ferrite + cementite, but real steel forms martensite. Use TTT / CCT or Quenching to see the actual products.'
    },

    kinetics: {
      title: 'TTT / CCT',
      purpose: 'See when austenite transforms into ferrite, pearlite, bainite, or martensite, and predict the final mix for a cooling path.',
      use: [
        'Choose TTT (quench to a hold temperature, hold, then cool) or CCT (cool continuously at one rate).',
        'Enter the cooling rate and final temperature. In TTT mode, also set the hold temperature and hold time.',
        'Set the chemistry on the Chemistry & properties tab first. The curves move with it.',
        'Change one input at a time and watch both the chart and the Predicted constituents panel.'
      ],
      read: [
        ['Axes', 'Temperature up the side, time along the bottom on a log scale (each grid line is ×10).'],
        ['Curves', 'Green = ferrite, blue = pearlite, bronze = bainite. Solid = transformation starts, dashed = it finishes.'],
        ['Lines', 'Dotted Ae₃ / A₁ are equilibrium limits. The solid Ms line is where martensite starts. An amber line is the lower Ms of carbon-enriched leftover austenite.'],
        ['Markers', 'Where the path crosses a curve. In CCT mode, and on a TTT hold, read them directly. Hollow markers on TTT cooling segments are graphical only: those crossings read early.'],
        ['Predicted constituents', 'The final percentages. Martensite, retained austenite, or austenite in this list means some austenite was still untransformed at the end.']
      ],
      tryThis: 'In CCT mode, try 10, 20, and 55 °C/s. Watch ferrite and pearlite give way to bainite, then to martensite.',
      caution: 'Austenite can only transform once. After the path crosses the finish line of a reaction that already started, later curves have nothing left to act on. The curves are generalized teaching estimates, not a diagram for a specific grade.'
    },

    chemistry: {
      title: 'Chemistry & properties',
      purpose: 'Set the steel’s composition and see how it changes weldability, critical temperatures, and estimated properties. The chemistry you set here is used by every other tab.',
      use: [
        'Pick a grade in the preset list and press Apply preset, or type each element in wt% (the allowed range is in each label).',
        'Set a Cooling rate (°C/s) for the property estimate.',
        'Go back to TTT / CCT, Hardenability, or Quenching to see how the new chemistry changes them.'
      ],
      read: [
        ['CE IIW', 'Carbon equivalent for weldability. Roughly: below 0.40 is usually easy to weld, and above about 0.45 usually needs preheat.'],
        ['Pcm', 'A cracking index for low-carbon steels. Lower is safer.'],
        ['Ac₁, Ac₃, Ms', 'Heating critical temperatures and martensite start, estimated from chemistry.'],
        ['Estimated properties', 'Hardness and strength ranges for the chosen cooling rate. They are ranges, not single values.'],
        ['Side-by-side comparison', 'Compares the points you plotted. The last two columns use carbon only.']
      ],
      tryThis: 'Apply AISI 1018, note Ms and CE, then apply AISI 4140. Visit TTT / CCT after each and see how far the curves move.',
      caution: 'These are empirical estimates. In this model, B, Si, V, Nb, Ti, and Cu do not move the TTT / CCT curves, even though some of them (especially boron) have strong effects in real steel.'
    },

    hardenability: {
      title: 'Hardenability',
      purpose: 'Find how deep a part hardens for a given section size and quench. Carbon sets the maximum hardness; alloying sets how deep martensite forms.',
      use: [
        'Set the chemistry on the Chemistry & properties tab first.',
        'Choose the Geometry (round bar / pipe wall, or plate) and its diameter or thickness.',
        'Choose the Quench medium and Agitation, or press Use selected quench setup to copy them from the Quenching tab.',
        'Enter the prior-austenite ASTM grain number (from the Austenitization tab) and your Target hardness (HV).'
      ],
      read: [
        ['Jominy characteristic length', 'A single number for hardenability. Bigger means martensite forms deeper.'],
        ['Effective target depth', 'How far from each quenched surface the hardness stays above your target. 0 mm means even the surface misses it.'],
        ['Surface and centre hardness', 'Estimated hardness and martensite % at the surface and the centre.'],
        ['Hardness through the section', 'Usually a U shape: hard at the surfaces, softer in the middle. A flatter curve means better hardenability.'],
        ['Hardness versus hardenability', 'Where this steel sits compared with the hardness you need.']
      ],
      tryThis: 'Keep the section and quench the same and switch between AISI 1018 and AISI 4140. Then try 25 mm against 100 mm with the same steel.',
      caution: 'A finer austenite grain (higher ASTM number) slightly lowers hardenability. This is a teaching model, not an ASTM A255 calculation or measured Jominy data.'
    },

    austenitization: {
      title: 'Austenitization',
      purpose: 'Check whether a heat-and-hold is hot and long enough to fully austenitize the steel, without letting the grains grow too much.',
      use: [
        'Enter the Austenitizing temperature and Hold time. The hold counts from when the furnace reaches temperature.',
        'Enter the Controlling section (the thickness that governs heat-through) and the Initial ASTM grain number.',
        'Choose the Starting microstructure, Carbide burden, and Grain-boundary pinning that match your steel, and the Heating rate.',
        'Set to full-austenite reference + 40° is a quick starting point. Then adjust until the marker sits in green.'
      ],
      read: [
        ['Map colours', 'Grey = incomplete austenitization, green = balanced window, orange = grain growth dominates. The target marker is your cycle.'],
        ['Heat-through and effective soak', 'The minutes for the core to reach temperature, and the hold time left after that. The soak is what counts.'],
        ['Carbide dissolution and homogenization', 'How far carbides have dissolved and composition has evened out. Low values push you into grey.'],
        ['Final ASTM grain and grain-growth risk', 'The estimated grain size after the hold. A lower ASTM number means coarser grains, which usually means lower toughness.'],
        ['Recommended operating window', 'A suggested temperature and time range for these inputs.']
      ],
      tryThis: 'With Nb/V/Ti microalloyed carbides, find the shortest hold that turns the marker green at 870 °C. Then see how much shorter it gets at 900 °C.',
      caution: 'In microalloyed steels, undissolved particles are what keep grains fine, so full dissolution is not always the goal. Real results depend on actual carbide populations and furnace uniformity.'
    },

    quenching: {
      title: 'Quenching',
      purpose: 'Compare quench media for a section size: how fast the surface and centre cool, how much martensite forms, and how much distortion and cracking risk you take on.',
      use: [
        'Choose the Quench medium, Bath temperature, and Agitation.',
        'Choose the Geometry, its diameter or thickness, and the Geometry concentration (generous radii through to sharp corners).',
        'Enter the Transfer delay (seconds from furnace to quench) and the Martensite assessment temperature.',
        'Use Apply to hardenability tab to reuse this setup there.'
      ],
      read: [
        ['Austenite available', 'How much austenite the Austenitization tab says you start with. Martensite can never exceed it.'],
        ['800→500 °C cooling rates', 'Estimated surface and centre rates, compared with a heuristic critical rate for this steel. Above the critical rate means mostly martensite.'],
        ['Surface and centre martensite', 'Martensite % and a hardness estimate at each location.'],
        ['Maximum thermal gradient', 'The surface-to-centre temperature difference. Larger gradients mean more distortion and cracking risk.'],
        ['Medium comparison', 'The same part in every medium, side by side, on a normalized severity scale.']
      ],
      tryThis: 'For a 50 mm round, compare Conventional oil with Water. See how much centre martensite you gain against how much the gradient and cracking risk rise.',
      caution: 'Faster is not always better: a harsher quench can crack the part, especially with sharp corners. These are heuristic trends, not acceptance predictions.'
    },

    'process-data': {
      title: 'Process Data',
      purpose: 'Bring in a real time–temperature record (thermocouple, pyrometer, or cooling test), compare it with your simulated cycle, and look for signs of transformation.',
      use: [
        'Drop a CSV or TSV file with a header row, or press Load sample cooling data to practise.',
        'Choose the Time column, Temperature column, and their units.',
        'Adjust the Smoothing window and Arrest sensitivity if the record is noisy.',
        'Press Refresh simulated path to overlay the cycle from the Heating & cooling path tab.',
        'Use the measurement assistant (Thermocouple or Infrared pyrometer) to check how trustworthy the reading is. Export when done.'
      ],
      read: [
        ['Temperature history', 'Your measured record (solid) against the simulated cycle (dashed), on the same elapsed-time scale.'],
        ['Cooling-rate profile', 'How fast the temperature falls (−dT/dt). A sudden drop in cooling rate can mean a transformation releasing heat.'],
        ['Record summary', 'Duration, temperature range, number of data points, and the 800→500 °C and 500→300 °C cooling rates when the record crosses those temperatures.'],
        ['Candidate transformation arrests', 'Slow-cooling regions checked against A₁ and the estimated Ms. They are candidates to investigate, not confirmed transformations.'],
        ['Measurement assistant', 'Likely errors from thermocouple attachment and shielding, or from pyrometer emissivity and spot size.']
      ],
      tryThis: 'Load the sample data, then raise and lower the smoothing window. Watch which arrest candidates stay and which ones were just noise.',
      caution: 'Data stays in this browser. A loose thermocouple or a wrong emissivity setting can create false arrests, so check the measurement assistant before trusting a result.'
    },

    'metallurgy-lab': {
      title: 'Metallurgy Lab',
      purpose: 'Six small labs, each isolating one mechanism: Surface & diffusion, Tempering, Mechanical tests, Metallography, Solidification, and Alloy families.',
      use: [
        'Pick a lab with the buttons at the top of this tab. Only that lab’s inputs and results show.',
        'Change one input at a time and watch the result cards.',
        'Each lab has its own How to interpret button with detailed notes on its outputs.'
      ],
      read: [
        ['Surface & diffusion', 'Threshold depth and a diffusion-distance indicator (2.5 × 2√Dt) for carburizing, nitriding, induction hardening and more. Response values are unitless trends, not hardness.'],
        ['Tempering', 'Tempered hardness from as-quenched hardness, temperature, time, and number of tempers, with competing effects such as secondary hardening and retained austenite.'],
        ['Mechanical tests', 'How microstructure, grain size, test temperature, notch, and residual stress shift tensile, hardness, Charpy, and fatigue trends.'],
        ['Metallography', 'A schematic micrograph for the chosen structure, magnification, and etchant, plus identification practice and the preparation sequence.'],
        ['Solidification', 'How segregation, casting conditions, and rolling reduction carry through to banding and inclusions in the final product.'],
        ['Alloy families', 'Family-specific indicators, expected structures, and risks for a chosen chemistry.']
      ],
      tryThis: 'In Tempering, temper the same as-quenched hardness for a Plain carbon steel and a High-alloy tool steel. Compare how hardness falls, and look for secondary hardening.',
      caution: 'These are teaching models. Physical case depths, hardness values, and test results need process-specific validation.'
    },

    'reference-diagrams': {
      title: 'Reference diagrams',
      purpose: 'Look up the dominant product for a carbon content and hold temperature on a rapid-quench map, or study the full iron–carbon poster diagram.',
      use: [
        'Choose Rapid-quench microconstituents or the Iron-carbon / cementite poster at the top.',
        'Choose a detail level: Beginner, Engineer, or Advanced.',
        'Drag a point (P1–P3), tap the diagram, or type carbon and temperature. Use + Add point to compare.',
        'Select a legend entry to highlight that region. Toggle critical lines, labels, and the crosshair, zoom, or Export PNG.'
      ],
      read: [
        ['Region', 'The dominant product at that carbon and hold temperature, such as pearlite, upper bainite, or martensite.'],
        ['What does this region mean?', 'A plain-language explanation of the highlighted region.'],
        ['Active point analysis', 'The carbon, temperature, and region for the selected point.'],
        ['Poster view', 'The equilibrium iron–carbon diagram with its phase fields and critical lines.']
      ],
      tryThis: 'Put a point at 0.40 wt% C and move it down from 650 °C to 250 °C. Note where the product changes from pearlite to bainite to martensite.',
      caution: 'The rapid-quench map assumes a long enough hold and has no time axis, so it is not a TTT or CCT prediction. It is not available below 0.20 wt% C.'
    },

    learn: {
      title: 'Learn & export',
      purpose: 'Test yourself on the phase diagram, review what each critical line means, and save or share your work.',
      use: [
        'Press New challenge. You get a carbon content and temperature.',
        'Pick the phase field you think it falls in. Use Show hint if you are stuck.',
        'In the Boundary guide, press A₁, A₃, Acm, or Solvus to read what that line means.',
        'Use Save scenario and Load saved to keep your work in this browser, or Copy share link, Export CSV, Export diagram PNG, and Print / PDF.'
      ],
      read: [
        ['Challenge feedback', 'Whether your answer was right, and the correct phase field if not.'],
        ['Boundary guide', 'What each line separates and what happens when you cross it on heating or cooling.'],
        ['Exports', 'CSV gives your points and results. PNG gives the diagram image. The share link rebuilds your scenario for someone else.']
      ],
      tryThis: 'Do five challenges without hints. For each one you miss, open the Equilibrium diagram tab and place a point there to see why.',
      caution: 'Saved scenarios live in this browser only. Use Export or Copy share link to keep a copy elsewhere.'
    }
  };

  var returnFocus = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function ensureDialog() {
    var d = document.getElementById('spx-student-guide-dialog');
    if (d) return d;
    d = el('div', 'spx-student-guide-dialog');
    d.id = 'spx-student-guide-dialog';
    d.hidden = true;
    var card = el('div', 'spx-student-guide-card');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'spx-student-guide-title');
    card.tabIndex = -1;
    var h = el('h2'); h.id = 'spx-student-guide-title';
    var body = el('div'); body.id = 'spx-student-guide-body';
    var actions = el('div', 'spx-student-guide-actions');
    var close = el('button', 'spx-btn primary', 'Close');
    close.type = 'button';
    close.id = 'spx-student-guide-close';
    close.addEventListener('click', closeGuide);
    actions.appendChild(close);
    card.appendChild(h); card.appendChild(body); card.appendChild(actions);
    d.appendChild(card);
    d.addEventListener('click', function (e) { if (e.target === d) closeGuide(); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeGuide(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.slice.call(card.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    document.body.appendChild(d);
    return d;
  }

  function section(title) {
    var s = el('section', 'spx-student-guide-section');
    s.appendChild(el('h3', null, title));
    return s;
  }

  function openGuide(key, opener) {
    var g = GUIDES[key];
    if (!g) return;
    var d = ensureDialog(), body = document.getElementById('spx-student-guide-body');
    document.getElementById('spx-student-guide-title').textContent = g.title + ': how to use it and read the results';
    body.textContent = '';
    body.appendChild(el('p', 'spx-student-guide-purpose', g.purpose));

    var use = section('How to use it'), ol = el('ol');
    g.use.forEach(function (step) { ol.appendChild(el('li', null, step)); });
    use.appendChild(ol); body.appendChild(use);

    var read = section('How to read the results'), dl = el('dl', 'spx-student-guide-read');
    g.read.forEach(function (pair) { dl.appendChild(el('dt', null, pair[0])); dl.appendChild(el('dd', null, pair[1])); });
    read.appendChild(dl); body.appendChild(read);

    var tryIt = section('Try this'); tryIt.appendChild(el('p', null, g.tryThis)); body.appendChild(tryIt);
    var watch = section('Watch out'); watch.appendChild(el('p', null, g.caution)); body.appendChild(watch);

    d.dataset.guide = key;
    returnFocus = opener || document.activeElement;
    d.hidden = false;
    document.getElementById('spx-student-guide-close').focus();
  }

  function closeGuide() {
    var d = document.getElementById('spx-student-guide-dialog');
    if (!d || d.hidden) return;
    d.hidden = true;
    var t = returnFocus; returnFocus = null;
    if (t && document.documentElement.contains(t) && typeof t.focus === 'function') t.focus();
  }

  function ensureBars() {
    Object.keys(GUIDES).forEach(function (key) {
      var panel = document.getElementById('spx-tab-' + key);
      if (!panel || panel.querySelector(':scope > [data-student-guide-bar]')) return;
      var bar = el('div', 'spx-student-guide-bar');
      bar.setAttribute('data-student-guide-bar', key);
      var text = el('p', null, 'New to ' + GUIDES[key].title + '? Read the student guide first.');
      var btn = el('button', 'spx-btn', 'How to use & read this tool');
      btn.type = 'button';
      btn.setAttribute('data-student-guide', key);
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.addEventListener('click', function () { openGuide(key, btn); });
      bar.appendChild(text); bar.appendChild(btn);
      panel.insertBefore(bar, panel.firstChild);
    });
  }

  function init() {
    ensureBars();
    var tool = document.getElementById('spx-tool');
    if (tool && typeof MutationObserver === 'function') {
      /* Later releases add their tabs asynchronously; add the bar as soon as each panel appears.
         ensureBars is idempotent, so the observer settles after one extra pass. */
      new MutationObserver(ensureBars).observe(tool, { childList: true, subtree: true });
    }
    document.addEventListener('spx:workspace-mode', function (e) {
      if (e.detail && e.detail.mode !== 'student') closeGuide();
    });
  }

  window.__SPX = window.__SPX || {};
  window.__SPX.studentGuides = { keys: Object.keys(GUIDES), guide: function (k) { return GUIDES[k] ? JSON.parse(JSON.stringify(GUIDES[k])) : null; }, open: openGuide, close: closeGuide, ensureBars: ensureBars };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ExamPreview: a public, untimed preview (CSSBB, CSSGB, MBB, CQE, CQA, PMP) that renders with the real exam
   simulator's markup and classes (test-bank.html quizHTML/resultsHTML and the
   test-bank-current-attempt-review.js answer review). It only ever loads the
   free pool named on <body data-question-pool>, never the paid bank, and it
   never calls the exam-content function or Supabase. */
(function () {
  'use strict';
  var body = document.body;
  if (!body || !body.dataset.examPreview || window.__ExamPreview) return;

  // One entry per ExamPreview. The domains, colours, topic names and study
  // links are copied from the simulator's EXAMS[exam].bok and DM (test-bank.html)
  // so the topic tags, colours and breakdown match the real exam exactly.
  var CONFIGS = {
    cssbb: {
      dm: {
        enterprise: {name: 'Enterprise & Leadership', color: '#2c8fa6'},
        define: {name: 'Define', color: '#3b6fb0'},
        measure: {name: 'Measure', color: '#0e8f86'},
        analyze: {name: 'Analyze', color: '#6b52b5'},
        improve: {name: 'Improve', color: '#b8791b'},
        control: {name: 'Control', color: '#c0453f'}
      },
      bok: [
        {domain: 'enterprise', subs: [
          {id: 'p1', name: 'I. Org-Wide Planning & Deployment', lesson: '/lessons/what-is-lean-six-sigma', lessonName: 'What Is Lean Six Sigma'},
          {id: 'p2', name: 'II. Process Management & Measures', lesson: '/lessons/complete-14-quality-tools-project', lessonName: 'The Complete Quality Toolbox'},
          {id: 'tm', name: 'III. Team Management', lesson: '/lessons/7-management-planning-tools', lessonName: '7 Management & Planning Tools'}]},
        {domain: 'define', subs: [{id: 'def', name: 'IV. Define', lesson: '/lessons/what-is-lean-six-sigma', lessonName: 'Define & VOC'}]},
        {domain: 'measure', subs: [{id: 'mea', name: 'V. Measure', lesson: '/lessons/lean-six-sigma/process-capability-cp-and-cpk', lessonName: 'Process Capability (Cp & Cpk)'}]},
        {domain: 'analyze', subs: [{id: 'ana', name: 'VI. Analyze', lesson: '/lessons/hypothesis-testing-for-beginners', lessonName: 'Hypothesis Testing'}]},
        {domain: 'improve', subs: [
          {id: 'imp', name: 'VII. Improve', lesson: '/lessons/introduction-to-design-of-experiment-doe', lessonName: 'Design of Experiments'},
          {id: 'dfss', name: 'IX. Design for Six Sigma', lesson: '/lessons/complete-14-quality-tools-project', lessonName: 'The Complete Quality Toolbox'}]},
        {domain: 'control', subs: [{id: 'con', name: 'VIII. Control', lesson: '/lessons/control-charts-explained', lessonName: 'Control Charts, Explained'}]}
      ],
      examName: 'ASQ Certified Six Sigma Black Belt',
      short: 'CSSBB',
      startTitle: 'Free CSSBB practice questions: ExamPreview',
      ctaLabel: 'Get the complete Black Belt question bank',
      ctaTitle: 'Practise with the complete Black Belt question bank',
      ctaBody: 'Three full question sets, a mixed set, a placement diagnostic, a 165-question timed mock exam and focused quizzes by Body of Knowledge area, all in this same simulator.',
      fullBank: 'The full bank tests the same depth across 165-question mock exams.'
    },
    cssgb: {
      // Green Belt shares the Black Belt domain colours in the real exam (DM).
      dm: null,
      bok: [
        {domain: 'enterprise', subs: [{id: 'cssgb-org', name: 'I. Overview: Six Sigma and the Organization', lesson: '/lessons/what-is-lean-six-sigma', lessonName: 'What Is Lean Six Sigma'}]},
        {domain: 'define', subs: [{id: 'cssgb-define', name: 'II. Define Phase', lesson: '/lessons/what-is-lean-six-sigma', lessonName: 'Define & Voice of the Customer'}]},
        {domain: 'measure', subs: [{id: 'cssgb-measure', name: 'III. Measure Phase', lesson: '/lessons/lean-six-sigma/process-capability-cp-and-cpk', lessonName: 'Process Capability (Cp & Cpk)'}]},
        {domain: 'analyze', subs: [{id: 'cssgb-analyze', name: 'IV. Analyze Phase', lesson: '/lessons/hypothesis-testing-for-beginners', lessonName: 'Hypothesis Testing'}]},
        {domain: 'improve', subs: [{id: 'cssgb-improve', name: 'V. Improve Phase', lesson: '/lessons/introduction-to-design-of-experiment-doe', lessonName: 'Design of Experiments'}]},
        {domain: 'control', subs: [{id: 'cssgb-control', name: 'VI. Control Phase', lesson: '/lessons/control-charts-explained', lessonName: 'Control Charts, Explained'}]}
      ],
      examName: 'ASQ Certified Six Sigma Green Belt',
      short: 'CSSGB',
      startTitle: 'Free CSSGB practice questions: ExamPreview',
      ctaLabel: 'Get the complete Green Belt question bank',
      ctaTitle: 'Practise with the complete Green Belt question bank',
      ctaBody: 'Two full 110-question exam sets, timed or untimed, plus focused quizzes by Body of Knowledge area, all in this same simulator.',
      fullBank: 'The full bank tests the same depth across 110-question mock exams.'
    },
    mbb: {
      dm: {
        mbbent: {name: 'Enterprise-Wide Planning', color: '#2c8fa6'},
        mbborg: {name: 'Organizational Competencies', color: '#3b6fb0'},
        mbbportfolio: {name: 'Project Portfolio Management', color: '#6b52b5'},
        mbbtraining: {name: 'Training Design & Delivery', color: '#0e8f86'},
        mbbcoaching: {name: 'Coaching & Mentoring', color: '#b8791b'},
        mbbanalytics: {name: 'Advanced Analytics', color: '#c0453f'}
      },
      bok: [
        {domain: 'mbbent', subs: [{id: 'mbb-enterprise', name: 'I. Enterprise-Wide Planning', lesson: '/lessons/what-is-lean-six-sigma', lessonName: 'What Is Lean Six Sigma'}]},
        {domain: 'mbborg', subs: [{id: 'mbb-org', name: 'II. Organizational Competencies for Deployment', lesson: '/lessons/7-management-planning-tools', lessonName: '7 Management & Planning Tools'}]},
        {domain: 'mbbportfolio', subs: [{id: 'mbb-portfolio', name: 'III. Project Portfolio Management', lesson: '/lessons/complete-14-quality-tools-project', lessonName: 'The Complete Quality Toolbox'}]},
        {domain: 'mbbtraining', subs: [{id: 'mbb-training', name: 'IV. Training Design and Delivery', lesson: '/lessons.html', lessonName: 'Browse lessons'}]},
        {domain: 'mbbcoaching', subs: [{id: 'mbb-coaching', name: 'V. Coaching and Mentoring Responsibilities', lesson: '/lessons.html', lessonName: 'Browse lessons'}]},
        {domain: 'mbbanalytics', subs: [{id: 'mbb-analytics', name: 'VI. Advanced Data Management and Analytic Methods', lesson: '/lessons/introduction-to-design-of-experiment-doe', lessonName: 'Design of Experiments'}]}
      ],
      examName: 'ASQ Certified Six Sigma Master Black Belt',
      short: 'MBB',
      startTitle: 'Free MBB practice questions: ExamPreview',
      ctaLabel: 'Get the complete Master Black Belt question bank',
      ctaTitle: 'Practise with the complete Master Black Belt question bank',
      ctaBody: 'Three full exam sets and a mixed set, timed or untimed, plus focused quizzes by Body of Knowledge area, all in this same simulator.',
      fullBank: 'The full bank tests the same depth across 100- and 175-question exam sets.'
    },
    cqe: {
      dm: {
        mgmt: {name: 'Management & Leadership', color: '#2c8fa6'},
        qsys: {name: 'The Quality System', color: '#0e8f86'},
        design: {name: 'Product, Process & Service Design', color: '#6b52b5'},
        ppc: {name: 'Product & Process Control', color: '#c0453f'},
        ci: {name: 'Continuous Improvement', color: '#b8791b'},
        quant: {name: 'Quantitative Methods & Tools', color: '#3b6fb0'},
        risk: {name: 'Risk Management', color: '#a24b8c'}
      },
      bok: [
        {domain: 'mgmt', subs: [{id: 'mgmt', name: 'I. Management & Leadership', lesson: '/lessons.html', lessonName: 'Browse lessons'}]},
        {domain: 'qsys', subs: [{id: 'qsys', name: 'II. The Quality System', lesson: '/lessons/quality-engineering/cost-of-poor-quality', lessonName: 'Cost of Poor Quality'}]},
        {domain: 'design', subs: [{id: 'design', name: 'III. Product, Process & Service Design', lesson: '/lessons/quality-engineering/introduction-to-reliability-and-maintainability', lessonName: 'Reliability and Maintainability'}]},
        {domain: 'ppc', subs: [{id: 'ppc', name: 'IV. Product & Process Control', lesson: '/lessons/quality-engineering/gauge-rr-study', lessonName: 'Gauge R&R Study'}]},
        {domain: 'ci', subs: [{id: 'ci', name: 'V. Continuous Improvement', lesson: '/lessons/understanding-pareto-chart', lessonName: 'Understanding the Pareto Chart'}]},
        {domain: 'quant', subs: [{id: 'quant', name: 'VI. Quantitative Methods & Tools', lesson: '/lessons/control-charts-explained', lessonName: 'Control Charts Explained'}]},
        {domain: 'risk', subs: [{id: 'risk', name: 'VII. Risk Management', lesson: '/lessons.html', lessonName: 'Browse lessons'}]}
      ],
      examName: 'ASQ Certified Quality Engineer',
      short: 'CQE',
      startTitle: 'Free CQE practice questions: ExamPreview',
      ctaLabel: 'Get the complete Certified Quality Engineer question bank',
      ctaTitle: 'Practise with the complete Certified Quality Engineer question bank',
      ctaBody: 'Three full exam sets, timed or untimed, plus focused quizzes by Body of Knowledge area, all in this same simulator.',
      fullBank: 'The full bank tests the same depth across 160-question exam sets.'
    },
    cqa: {
      dm: {
        'cqa-fundamentals': {name: 'Auditing Fundamentals', color: '#2b5aa0'},
        'cqa-process': {name: 'Audit Process', color: '#0e8f86'},
        'cqa-competencies': {name: 'Auditor Competencies', color: '#6b52b5'},
        'cqa-program': {name: 'Audit Program Management & Business Applications', color: '#b8791b'},
        'cqa-tools': {name: 'Quality Tools & Techniques', color: '#c0453f'}
      },
      bok: [
        {domain: 'cqa-fundamentals', subs: [{id: 'cqa-fundamentals', name: 'I. Auditing Fundamentals', lesson: '/lessons.html', lessonName: 'Browse lessons'}]},
        {domain: 'cqa-process', subs: [{id: 'cqa-process', name: 'II. Audit Process', lesson: '/lessons/root-cause-analysis-5-whys-fishbone', lessonName: 'Root Cause Analysis: 5 Whys and Fishbone'}]},
        {domain: 'cqa-competencies', subs: [{id: 'cqa-competencies', name: 'III. Auditor Competencies', lesson: '/lessons.html', lessonName: 'Browse lessons'}]},
        {domain: 'cqa-program', subs: [{id: 'cqa-program', name: 'IV. Audit Program Management & Business Applications', lesson: '/lessons/quality-engineering/cost-of-poor-quality', lessonName: 'Cost of Poor Quality'}]},
        {domain: 'cqa-tools', subs: [{id: 'cqa-tools', name: 'V. Quality Tools & Techniques', lesson: '/lessons/statistics/probability-basics-the-language-of-chance', lessonName: 'Probability Basics'}]}
      ],
      examName: 'ASQ Certified Quality Auditor',
      short: 'CQA',
      // The CQA exam supplies no formula sheet or statistical tables (open book, on-screen calculator only).
      formulas: false,
      tables: false,
      startTitle: 'Free CQA practice questions: ExamPreview',
      ctaLabel: 'Get the complete Certified Quality Auditor question bank',
      ctaTitle: 'Practise with the complete Certified Quality Auditor question bank',
      ctaBody: 'A full 150-question exam set, timed or untimed, plus focused quizzes by Body of Knowledge area, all in this same simulator.',
      fullBank: 'The full bank tests the same depth across a 150-question exam set.'
    },
    pmp: {
      dm: {
        'pmp-people': {name: 'People', color: '#1a5276'},
        'pmp-process': {name: 'Process', color: '#0e6b7a'},
        'pmp-business': {name: 'Business Environment', color: '#8a5a12'}
      },
      bok: [
        {domain: 'pmp-people', subs: [{id: 'pmp-people', name: 'People', lesson: '/lessons', lessonName: 'Browse lessons'}]},
        {domain: 'pmp-process', subs: [{id: 'pmp-process', name: 'Process', lesson: '/lessons', lessonName: 'Browse lessons'}]},
        {domain: 'pmp-business', subs: [{id: 'pmp-business', name: 'Business Environment', lesson: '/lessons', lessonName: 'Browse lessons'}]}
      ],
      examName: 'PMI Project Management Professional (PMP)',
      short: 'PMP',
      tables: false,
      startTitle: 'Free PMP practice questions: ExamPreview',
      ctaLabel: 'Get the complete PMP question bank',
      ctaTitle: 'Practise with the complete PMP question bank',
      ctaBody: 'A full 180-question, 240-minute timed mock exam, further question sets and focused quizzes by domain, all in this same simulator.',
      fullBank: 'The full bank tests the same depth across a 180-question timed mock exam.'
    }
  };
  var EXAM = body.dataset.examPreview, CFG = CONFIGS[EXAM];
  if (!CFG) return;
  if (!CFG.dm) CFG.dm = CONFIGS.cssbb.dm;
  var DM = CFG.dm, BOK = CFG.bok;
  var SUB = {};
  BOK.forEach(function (d) { d.subs.forEach(function (s) { SUB[s.id] = {domain: d.domain, name: s.name, lesson: s.lesson, lessonName: s.lessonName}; }); });
  var POOL_ID = new RegExp('^' + EXAM + ':exampreview:ep-' + EXAM + '-\\d{2}$');
  var EXAM_NAME = CFG.examName;
  var CTA_LABEL = CFG.ctaLabel;
  // The real PMP formula pane (test-bank-pmp-formulas.js) reads the current
  // question through test-bank-formulas.js's getContext(). ExamPreview has no
  // paid bank to search, so it supplies the same context from its own session.
  if (!window.__TB_FORMULAS_TEST__) window.__TB_FORMULAS_TEST__ = {renderContextualPane: function (query) {
    if (window.__TB_PMP_FORMULAS) window.__TB_PMP_FORMULAS.renderContextualPane(query);
  }, getContext: function () {
    var q = session && view === 'quiz' ? session.items[session.i] : null;
    return {examId: EXAM, stem: q ? q.stem : String(), question: q ? {stem: q.stem, sub: q.sub, options: q.options} : null,
      sectionId: q ? q.sub : null, sessionQuestion: q ? session.i + 1 : null, sessionTotal: session ? session.items.length : null, set: null};
  }};

  var pool = null, session = null, view = 'start';
  var host = document.getElementById('tb-overview');
  var live = document.getElementById('ep-live');
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); };
  // Explanations may carry simple emphasis; everything else is reduced to text.
  function safeHtml(html) {
    var t = document.createElement('template'); t.innerHTML = String(html || '');
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 1) {
          // A printed-page source reference (<span class="tb-source-ref">) keeps its one class.
          var ref = n.tagName === 'SPAN' && n.getAttribute('class') === 'tb-source-ref';
          if (!ref && !/^(B|STRONG|EM|I|SUB|SUP)$/.test(n.tagName)) { n.replaceWith(document.createTextNode(n.textContent)); return; }
          Array.prototype.slice.call(n.attributes).forEach(function (a) { n.removeAttribute(a.name); });
          if (ref) n.className = 'tb-source-ref';
          walk(n);
        }
      });
    })(t.content);
    var d = document.createElement('div'); d.appendChild(t.content); return d.innerHTML;
  }
  function announce(text) { if (live) { live.textContent = ''; window.setTimeout(function () { live.textContent = text; }, 30); } }
  function shuffle(a, rnd) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function validate(data) {
    if (!data || data.examId !== EXAM || data.pool !== 'exampreview-free' || !data.contents) throw new Error('Not an ExamPreview pool');
    var items = Object.keys(data.contents).map(function (id) {
      if (!POOL_ID.test(id)) throw new Error('Unexpected question id');
      var c = data.contents[id].content;
      if (!c || !Array.isArray(c.options) || c.options.length !== 4 || !Number.isInteger(c.answer) || !SUB[c.sub]) throw new Error('Malformed question');
      return {id: id, stem: c.stem, options: c.options, answer: c.answer, sub: c.sub, ecoTask: typeof c.ecoTask === 'string' ? c.ecoTask : null, why: c.why};
    });
    if (items.length !== 20) throw new Error('ExamPreview expects 20 questions');
    return items;
  }
  function load() {
    if (pool) return Promise.resolve(pool);
    return fetch(body.dataset.questionPool, {credentials: 'omit'}).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status); return r.json();
    }).then(function (data) { pool = validate(data); return pool; });
  }

  function start() {
    var rnd = window.__ExamPreviewRandom || Math.random;
    return load().then(function (items) {
      session = {i: 0, answers: {}, flags: {}, revealed: {}, completed: false, items: shuffle(items, rnd).map(function (q) {
        var order = shuffle([0, 1, 2, 3], rnd);
        return {id: q.id, stem: q.stem, sub: q.sub, ecoTask: q.ecoTask, why: q.why, options: order.map(function (k) { return q.options[k]; }), answer: order.indexOf(q.answer)};
      })};
      if (window.__ExamPreviewTools) window.__ExamPreviewTools.build();
      // Exams without reference tables (PMP) drop the Tables drawer.
      if (CFG.tables === false) { var td = document.getElementById('tb-tables'); if (td) td.remove(); }
      // Exams without a formula sheet (CQA) drop the Formulas drawer too, leaving Calc only.
      if (CFG.formulas === false) { var fdr = document.getElementById('tb-formulas'); if (fdr) fdr.remove(); }
      view = 'quiz'; render(); announce('ExamPreview started. Question 1 of ' + session.items.length + '.');
      var first = host.querySelector('[data-opt]'); if (first) first.focus({preventScroll: true});
    }).catch(function () {
      host.querySelector('#ep-start') && host.insertAdjacentHTML('beforeend', '<p class="tb-ep-error" role="alert">The ExamPreview questions could not be loaded. Check your connection and try again.</p>');
    });
  }
  function answeredCount() { return Object.keys(session.answers).length; }
  function revealCount() { return Object.keys(session.revealed).filter(function (k) { return session.revealed[k]; }).length; }
  function completedCount() { var n = 0; session.items.forEach(function (_, i) { if (session.answers[i] != null || session.revealed[i]) n++; }); return n; }

  /* ---------- question screen: same structure as test-bank.html quizHTML ---------- */
  function revealedHTML(q) {
    return '<section id="tb-revealed-answer" class="tb-revealed-answer" tabindex="-1" aria-labelledby="tb-revealed-title"><h3 id="tb-revealed-title">Answer revealed — counted as incorrect</h3><p><strong>Correct answer: ' +
      esc(String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer]) + '</strong></p><p>' + safeHtml(q.why) + '</p></section>';
  }
  function stopTools() { if (window.__ExamPreviewTools) window.__ExamPreviewTools.stop(); }
  function quizHTML() {
    var n = session.items.length, q = session.items[session.i], meta = SUB[q.sub], dm = DM[meta.domain], col = dm.color;
    var revealed = !!session.revealed[session.i], flagged = Object.keys(session.flags).filter(function (k) { return session.flags[k]; }).length, rv = revealCount();
    var nav = session.items.map(function (_, i) {
      var r = !!session.revealed[i];
      return '<button type="button" class="tb-navcell' + (session.answers[i] != null || r ? ' done' : '') + (i === session.i ? ' cur' : '') + (session.flags[i] ? ' flag' : '') + (r ? ' revealed' : '') + '" data-goto="' + i + '" aria-current="' + (i === session.i ? 'step' : 'false') + '" aria-label="Question ' + (i + 1) + (r ? '' : session.answers[i] != null ? ', answered, awaiting grading' : ', unanswered') + (session.flags[i] ? ', flagged' : '') + (r ? ', answer revealed, counted as incorrect' : '') + '">' + (i + 1) + '</button>';
    }).join('');
    var opts = q.options.map(function (o, i) {
      return '<button type="button" class="tb-opt' + (session.answers[session.i] === i ? ' sel' : '') + (revealed && i === q.answer ? ' reveal-correct' : '') + '" data-opt="' + i + '" aria-pressed="' + (session.answers[session.i] === i) + '"' + (revealed ? ' disabled' : '') + '><span class="k">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>';
    }).join('');
    var toolbar = '<div class="tb-toolbar"><span class="tb-timer untimed">Untimed</span>' +
      '<button type="button" class="tb-tbtn' + (session.flags[session.i] ? ' on' : '') + '" data-flag aria-pressed="' + !!session.flags[session.i] + '">\u2691 ' + (session.flags[session.i] ? 'Flagged' : 'Flag') + '</button>' +
      '<button type="button" class="tb-tbtn" data-reveal aria-describedby="tb-reveal-hint" ' + (revealed ? 'aria-controls="tb-revealed-answer" ' : '') + 'aria-expanded="' + revealed + '"' + (revealed ? ' disabled' : '') + '>' + (revealed ? 'Answer Revealed' : 'Reveal Answer') + '</button>' +
      (CFG.formulas === false ? '' : '<button type="button" class="tb-tbtn" data-formulas>\u2630 Formulas</button>') +
      (CFG.tables === false ? '' : '<button type="button" class="tb-tbtn" data-tables>\u25a4 Tables</button>') +
      '<button type="button" class="tb-tbtn" data-calc>\u00f7 Calc</button>' +
      '<button type="button" class="tb-ghost" data-quit>Exit</button></div>';
    return '<div class="tb-quiz" data-question-id="' + esc(q.id) + '"><div class="tb-quiztop"><div><div class="tb-diag-kick">ExamPreview &middot; Free ' + CFG.short + ' questions &middot; untimed</div>' +
      '<div class="tb-quizprog">Question ' + (session.i + 1) + ' of ' + n + ' &middot; ' + answeredCount() + ' answered' + (rv ? ' &middot; ' + rv + ' revealed' : '') + (flagged ? ' &middot; ' + flagged + ' flagged' : '') + '</div></div>' + toolbar + '</div>' +
      '<p id="tb-reveal-hint" class="tb-reveal-hint">Revealing an answer counts that question as incorrect.</p>' +
      '<div class="tb-progress"><span style="width:' + (completedCount() / n * 100) + '%"></span></div>' +
      '<div class="tb-qtag" style="background:' + col + '22;color:' + col + '"><i style="background:' + col + '"></i>' + esc(dm.name) + ' &middot; ' + esc(q.ecoTask && q.ecoTask !== meta.name ? q.ecoTask : meta.name) + '</div>' +
      '<fieldset class="tb-ep-question"><legend class="tb-stem" data-question-id="' + esc(q.id) + '">' + esc(q.stem) + '</legend>' + opts + '</fieldset>' + (revealed ? revealedHTML(q) : '') +
      '<div class="tb-quizfoot"><div class="tb-nav">' + nav + '</div>' +
      (session.i < n - 1 ? '<button type="button" class="btn btn-teal" data-next>Next &rarr;</button>' : '<button type="button" class="btn btn-teal" data-submit>See my results</button>') + '</div>' +
      '<div class="tb-status-key" aria-label="Question status legend"><span>○ Slate grey: unanswered</span><span>● Teal: answered, awaiting grading</span><span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg> Blue: revealed (counts as incorrect)</span><span>⚑ Orange: flagged for review</span><span>Outline: current question</span></div></div>';
  }
  function wireQuiz() {
    Array.prototype.forEach.call(host.querySelectorAll('[data-opt]'), function (b) {
      b.addEventListener('click', function () {
        var v = +b.dataset.opt; if (session.revealed[session.i]) return;
        if (session.answers[session.i] === v) delete session.answers[session.i]; else session.answers[session.i] = v;
        render(); var again = host.querySelector('[data-opt="' + v + '"]'); if (again) again.focus({preventScroll: true});
        announce(session.answers[session.i] === v ? 'Selected option ' + String.fromCharCode(65 + v) + '.' : 'Selection cleared.');
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll('[data-goto]'), function (b) { b.addEventListener('click', function () { go(+b.dataset.goto); }); });
    var nx = host.querySelector('[data-next]'); if (nx) nx.addEventListener('click', function () { go(session.i + 1); });
    var sb = host.querySelector('[data-submit]'); if (sb) sb.addEventListener('click', submit);
    var fl = host.querySelector('[data-flag]'); if (fl) fl.addEventListener('click', function () { session.flags[session.i] = !session.flags[session.i]; render(); var f = host.querySelector('[data-flag]'); if (f) f.focus({preventScroll: true}); });
    var rv = host.querySelector('[data-reveal]'); if (rv) rv.addEventListener('click', function () { session.revealed[session.i] = true; delete session.answers[session.i]; render(); var p = host.querySelector('#tb-revealed-answer'); if (p) p.focus({preventScroll: true}); });
    // Formulas, Tables and Calc: the real exam's tools (exam-tools.js is generated from test-bank.html).
    ['formulas', 'tables', 'calc'].forEach(function (name) {
      var b = host.querySelector('[data-' + name + ']');
      if (b) b.addEventListener('click', function () { var t = window.__ExamPreviewTools; if (t) t.toggle(name); });
    });
    var qt = host.querySelector('[data-quit]'); if (qt) qt.addEventListener('click', function () { stopTools(); session = null; view = 'start'; render(); });
  }
  function go(i) {
    session.i = Math.max(0, Math.min(session.items.length - 1, i)); render();
    announce('Question ' + (session.i + 1) + ' of ' + session.items.length + '.');
    var stem = host.querySelector('.tb-stem'); if (stem) { stem.setAttribute('tabindex', '-1'); stem.focus({preventScroll: true}); }
    var top = host.querySelector('.tb-quiz'); if (top && top.scrollIntoView) top.scrollIntoView({block: 'start'});
  }

  /* ---------- results: same structure as resultsHTML + the answer review ---------- */
  function status(i) { var q = session.items[i]; if (session.revealed[i]) return 'incorrect'; if (session.answers[i] == null) return 'unanswered'; return session.answers[i] === q.answer ? 'correct' : 'incorrect'; }
  function grade() {
    var by = {}, c = {correct: 0, incorrect: 0, unanswered: 0, revealed: revealCount()};
    session.items.forEach(function (q, i) { var s = status(i); c[s]++; by[q.sub] = by[q.sub] || {c: 0, t: 0}; by[q.sub].t++; if (s === 'correct') by[q.sub].c++; });
    c.total = session.items.length; c.pct = Math.round(c.correct / c.total * 100); c.by = by; return c;
  }
  function band(p) { return p >= 80 ? '80-100' : p >= 60 ? '60-79' : p >= 40 ? '40-59' : '0-39'; }
  function submit() {
    if (session.completed) return;
    session.completed = true; session.result = grade(); stopTools(); view = 'results'; render();
    announce('Results: you answered ' + session.result.correct + ' of ' + session.result.total + ' correctly.');
    var h = host.querySelector('.tb-resverd h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll: true}); }
    var top = host.querySelector('.tb-resbar'); if (top && top.scrollIntoView) top.scrollIntoView({block: 'start'});
  }
  function reviewCard(q, i) {
    var s = status(i), sel = session.revealed[i] ? null : session.answers[i], label = {correct: 'Correct', incorrect: 'Incorrect', unanswered: 'Unanswered'}[s], meta = SUB[q.sub];
    var ans = function (k) { return k == null ? 'No answer' : String.fromCharCode(65 + k) + '. ' + q.options[k]; };
    return '<article class="tb-review-card' + (session.revealed[i] ? ' revealed' : '') + '" data-review-status="' + s + '" data-question-id="' + esc(q.id) + '" tabindex="-1">' +
      '<div class="tb-review-card-head"><div><strong>Question ' + (i + 1) + '</strong><div class="tb-review-topic">' + esc(DM[meta.domain].name) + ' &rsaquo; ' + esc(meta.name) + '</div></div><div class="tb-review-badges"><span class="tb-review-status ' + (session.revealed[i] ? 'revealed' : s) + '">' + (session.revealed[i] ? 'Answer revealed — counted as incorrect' : label) + '</span>' + (session.flags[i] ? '<span class="tb-review-status flagged">Flagged</span>' : '') + '</div></div>' +
      '<div class="tb-review-stem">' + esc(q.stem) + '</div><div class="tb-review-options">' + q.options.map(function (o, k) {
        return '<div class="tb-review-option' + (k === q.answer ? ' is-correct' : '') + (sel === k && k !== q.answer ? ' is-wrong' : '') + '"><span class="tb-answer-letter">' + String.fromCharCode(65 + k) + '</span><span class="tb-answer-copy">' + esc(o) + '</span><span class="tb-answer-tags">' + (sel === k ? '<span class="tb-answer-tag">Your answer</span>' : '') + (k === q.answer ? '<span class="tb-answer-tag">Correct answer</span>' : '') + '</span></div>';
      }).join('') + '</div>' +
      '<div class="tb-answer-compare"><div><span>Your answer</span><strong>' + esc(ans(sel)) + '</strong></div><div><span>Correct answer</span><strong>' + esc(ans(q.answer)) + '</strong></div></div>' +
      '<div class="tb-explanation"><div class="tb-explanation-title">Why this is correct</div><div class="tb-explanation-copy">' + safeHtml(q.why) + '</div></div>' +
      '<a class="tb-review-lesson" href="' + esc(meta.lesson) + '">Study: ' + esc(meta.lessonName) + ' &rarr;</a></article>';
  }
  function resultsHTML() {
    var r = session.result, ring = r.pct, good = ring >= 70;
    var rows = BOK.filter(function (bd) { return bd.subs.some(function (s) { return r.by[s.id]; }); }).map(function (bd) {
      var c = 0, t = 0, col = DM[bd.domain].color;
      var subs = bd.subs.filter(function (s) { return r.by[s.id]; }).map(function (s) {
        var a = r.by[s.id], m = a.c / a.t, weak = m < 0.6; c += a.c; t += a.t;
        return '<div class="tb-sub"><span class="tb-subn">' + esc(s.name) + '</span><span class="tb-subp" style="color:' + (weak ? '#c0453f' : 'var(--good,#1f9d6b)') + '">' + Math.round(m * 100) + '% <span class="mut">(' + a.c + '/' + a.t + ')</span></span><span class="tb-subbar"><span style="width:' + Math.round(m * 100) + '%;background:' + (weak ? '#c0453f' : col) + '"></span></span></div>';
      }).join('');
      return '<div class="tb-domblock"><div class="tb-domhead"><span class="tb-domn"><i style="background:' + col + '"></i>' + esc(DM[bd.domain].name) + '</span><span class="tb-domp">' + Math.round(c / t * 100) + '%</span></div>' + subs + '</div>';
    }).join('');
    var weakest = Object.keys(r.by).map(function (id) { return {id: id, m: r.by[id].c / r.by[id].t}; }).sort(function (a, b) { return a.m - b.m; })[0];
    var wk = SUB[weakest.id];
    var verdict = good ? 'You are close to the 70% site practice target on this sample. ' + CFG.fullBank : 'This sample shows where to focus next. The full bank gives you hundreds more questions like these, with focused quizzes by area.';
    return '<div class="tb-resbar"><button type="button" class="tb-ghost" data-retake>&larr; Retake ExamPreview</button><span class="tb-restag">ExamPreview result</span></div>' +
      '<div class="tb-reshead"><div class="tb-ring big" style="--p:' + ring + ';--rc:' + (good ? 'var(--good,#1f9d6b)' : '#c0453f') + '"><span>' + ring + '<small>%</small></span></div>' +
      '<div class="tb-resverd"><div class="tb-diag-kick">Free ' + CFG.short + ' sample score</div><h2>Your ExamPreview result</h2><p>You answered ' + r.correct + ' of ' + r.total + ' correctly. ' + verdict + '</p></div></div>' +
      '<div class="tb-score-result" data-score-result data-score-percent="' + r.pct + '"><strong>Session score: ' + r.pct + '% (' + r.correct + '/' + r.total + ')</strong><p class="tb-result-set">Test set: ExamPreview (20 free questions)</p><p>' + (good ? 'Site practice target met' : 'Below site practice target') + ' (70%). This is a site practice target, not an official certification pass/fail result.</p><p>' + r.incorrect + ' incorrect · ' + r.unanswered + ' unanswered' + (r.revealed ? ' · ' + r.revealed + ' revealed (counted as incorrect)' : '') + '. This result is available only in this tab until you leave or refresh.</p></div>' +
      '<div class="tb-sec">Score breakdown by phase &rarr; subtopic</div><div class="tb-breakdown">' + rows + '</div>' +
      '<div class="tb-plan"><div class="tb-planrow top"><div class="tb-planrank">1</div><div class="tb-planbody"><div class="tb-planname">' + esc(DM[wk.domain].name) + ' <span class="mut">\u203a</span> ' + esc(wk.name) + ' <span class="tb-planflag">Weakest area</span></div><div class="tb-planwhy">You scored <b>' + Math.round(weakest.m * 100) + '%</b> here on this sample.</div><a class="tb-planlink" href="' + esc(wk.lesson) + '">Study: ' + esc(wk.lessonName) + ' &rarr;</a></div></div></div>' +
      '<section id="tb-feedback-loop" class="tb-feedback-loop" aria-labelledby="tb-feedback-title"><div class="tb-feedback-head"><div><div class="tb-diag-kick">Worked explanations</div><h2 id="tb-feedback-title">Review every answer and understand why.</h2><p>Each question shows your answer, the correct answer and a worked explanation.</p></div><div class="tb-feedback-stats"><span><strong>' + r.correct + '</strong> correct</span><span><strong>' + r.incorrect + '</strong> incorrect</span><span><strong>' + r.unanswered + '</strong> unanswered</span></div></div>' +
      '<div id="tb-answer-review" class="tb-answer-review"><div id="tb-review-list" class="tb-review-list">' + session.items.map(reviewCard).join('') + '</div></div></section>' +
      '<section class="tb-ep-cta" id="ep-cta" aria-labelledby="ep-cta-title"><div class="tb-diag-kick">Ready for the full exam?</div><h2 id="ep-cta-title">' + CFG.ctaTitle + '</h2><p>' + CFG.ctaBody + '</p>' +
      '<button type="button" class="btn btn-teal" data-ep-cta aria-expanded="false" aria-controls="ep-waitlist">' + CTA_LABEL + '</button></section>';
  }
  function wireResults() {
    var rt = host.querySelector('[data-retake]'); if (rt) rt.addEventListener('click', start);
    var cta = host.querySelector('[data-ep-cta]');
    var form = document.getElementById('ep-waitlist');
    if (cta && form) {
      host.appendChild(form);
      var bandInput = document.getElementById('ep-score-band'); if (bandInput) bandInput.value = band(session.result.pct);
      cta.addEventListener('click', function () {
        form.hidden = false; cta.setAttribute('aria-expanded', 'true');
        var email = document.getElementById('ep-email'); if (email) email.focus();
      });
    }
  }
  function render() {
    var hero = document.getElementById('tb-hero'), ht = document.getElementById('tb-herotitle'), hp = hero && hero.querySelector('p');
    var exam = view !== 'start';
    if (hero) hero.classList.toggle('exam', exam);
    if (ht) ht.textContent = exam ? EXAM_NAME + ' — ExamPreview' : CFG.startTitle;
    if (hp) hp.hidden = exam;
    var form = document.getElementById('ep-waitlist');
    if (form && view !== 'results') { form.hidden = true; document.querySelector('main').insertBefore(form, document.querySelector('.tb-ep-related')); }
    if (view === 'quiz') {
      host.innerHTML = quizHTML(); wireQuiz();
      // Like the real exam, an open formula sheet follows the current question.
      var fd = document.getElementById('tb-formulas'), tools = window.__ExamPreviewTools;
      if (fd && !fd.hidden && tools && tools.refresh) { var sq = document.getElementById('tb-refsearch'); tools.refresh(sq ? sq.value : ''); }
    }
    else if (view === 'results') { host.innerHTML = resultsHTML(); wireResults(); }
    else { host.innerHTML = startHTML; wireStart(); }
  }
  var startEl = document.getElementById('ep-start');
  var startHTML = startEl ? startEl.outerHTML : '';
  function wireStart() { var b = host.querySelector('[data-ep-start]'); if (b) b.addEventListener('click', start); }
  wireStart();
  window.__ExamPreview = {start: start, submit: submit, state: function () { return {view: view, session: session}; }, ctaLabel: CTA_LABEL};
})();

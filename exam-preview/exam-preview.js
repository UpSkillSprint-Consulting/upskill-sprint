/* ExamPreview: a public, untimed CSSBB preview that renders with the real exam
   simulator's markup and classes (test-bank.html quizHTML/resultsHTML and the
   test-bank-current-attempt-review.js answer review). It only ever loads the
   free pool named on <body data-question-pool>, never the paid bank, and it
   never calls the exam-content function or Supabase. */
(function () {
  'use strict';
  var body = document.body;
  if (!body || !body.dataset.examPreview || window.__ExamPreview) return;

  // CSSBB Body of Knowledge, copied from the simulator's EXAMS.cssbb.bok so
  // the topic tags, colours and breakdown match the real exam exactly.
  var DM = {
    enterprise: {name: 'Enterprise & Leadership', color: '#2c8fa6'},
    define: {name: 'Define', color: '#3b6fb0'},
    measure: {name: 'Measure', color: '#0e8f86'},
    analyze: {name: 'Analyze', color: '#6b52b5'},
    improve: {name: 'Improve', color: '#b8791b'},
    control: {name: 'Control', color: '#c0453f'}
  };
  var BOK = [
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
  ];
  var SUB = {};
  BOK.forEach(function (d) { d.subs.forEach(function (s) { SUB[s.id] = {domain: d.domain, name: s.name, lesson: s.lesson, lessonName: s.lessonName}; }); });
  var POOL_ID = /^cssbb:exampreview:ep-cssbb-\d{2}$/;
  var EXAM_NAME = 'ASQ Certified Six Sigma Black Belt';
  var CTA_LABEL = 'Get the complete Black Belt question bank';

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
          if (!/^(B|STRONG|EM|I|SUB|SUP)$/.test(n.tagName)) { n.replaceWith(document.createTextNode(n.textContent)); return; }
          Array.prototype.slice.call(n.attributes).forEach(function (a) { n.removeAttribute(a.name); });
          walk(n);
        }
      });
    })(t.content);
    var d = document.createElement('div'); d.appendChild(t.content); return d.innerHTML;
  }
  function announce(text) { if (live) { live.textContent = ''; window.setTimeout(function () { live.textContent = text; }, 30); } }
  function shuffle(a, rnd) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function validate(data) {
    if (!data || data.examId !== 'cssbb' || data.pool !== 'exampreview-free' || !data.contents) throw new Error('Not an ExamPreview pool');
    var items = Object.keys(data.contents).map(function (id) {
      if (!POOL_ID.test(id)) throw new Error('Unexpected question id');
      var c = data.contents[id].content;
      if (!c || !Array.isArray(c.options) || c.options.length !== 4 || !Number.isInteger(c.answer) || !SUB[c.sub]) throw new Error('Malformed question');
      return {id: id, stem: c.stem, options: c.options, answer: c.answer, sub: c.sub, why: c.why};
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
        return {id: q.id, stem: q.stem, sub: q.sub, why: q.why, options: order.map(function (k) { return q.options[k]; }), answer: order.indexOf(q.answer)};
      })};
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
      '<button type="button" class="tb-ghost" data-quit>Exit</button></div>';
    return '<div class="tb-quiz" data-question-id="' + esc(q.id) + '"><div class="tb-quiztop"><div><div class="tb-diag-kick">ExamPreview &middot; Free CSSBB questions &middot; untimed</div>' +
      '<div class="tb-quizprog">Question ' + (session.i + 1) + ' of ' + n + ' &middot; ' + answeredCount() + ' answered' + (rv ? ' &middot; ' + rv + ' revealed' : '') + (flagged ? ' &middot; ' + flagged + ' flagged' : '') + '</div></div>' + toolbar + '</div>' +
      '<p id="tb-reveal-hint" class="tb-reveal-hint">Revealing an answer counts that question as incorrect.</p>' +
      '<div class="tb-progress"><span style="width:' + (completedCount() / n * 100) + '%"></span></div>' +
      '<div class="tb-qtag" style="background:' + col + '22;color:' + col + '"><i style="background:' + col + '"></i>' + esc(dm.name) + ' &middot; ' + esc(meta.name) + '</div>' +
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
    var qt = host.querySelector('[data-quit]'); if (qt) qt.addEventListener('click', function () { session = null; view = 'start'; render(); });
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
    session.completed = true; session.result = grade(); view = 'results'; render();
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
    var verdict = good ? 'You are close to the 70% site practice target on this sample. The full bank tests the same depth across 165-question mock exams.' : 'This sample shows where to focus next. The full bank gives you hundreds more questions like these, with focused quizzes by area.';
    return '<div class="tb-resbar"><button type="button" class="tb-ghost" data-retake>&larr; Retake ExamPreview</button><span class="tb-restag">ExamPreview result</span></div>' +
      '<div class="tb-reshead"><div class="tb-ring big" style="--p:' + ring + ';--rc:' + (good ? 'var(--good,#1f9d6b)' : '#c0453f') + '"><span>' + ring + '<small>%</small></span></div>' +
      '<div class="tb-resverd"><div class="tb-diag-kick">Free CSSBB sample score</div><h2>Your ExamPreview result</h2><p>You answered ' + r.correct + ' of ' + r.total + ' correctly. ' + verdict + '</p></div></div>' +
      '<div class="tb-score-result" data-score-result data-score-percent="' + r.pct + '"><strong>Session score: ' + r.pct + '% (' + r.correct + '/' + r.total + ')</strong><p class="tb-result-set">Test set: ExamPreview (20 free questions)</p><p>' + (good ? 'Site practice target met' : 'Below site practice target') + ' (70%). This is a site practice target, not an official certification pass/fail result.</p><p>' + r.incorrect + ' incorrect · ' + r.unanswered + ' unanswered' + (r.revealed ? ' · ' + r.revealed + ' revealed (counted as incorrect)' : '') + '. This result is available only in this tab until you leave or refresh.</p></div>' +
      '<div class="tb-sec">Score breakdown by phase &rarr; subtopic</div><div class="tb-breakdown">' + rows + '</div>' +
      '<div class="tb-plan"><div class="tb-planrow top"><div class="tb-planrank">1</div><div class="tb-planbody"><div class="tb-planname">' + esc(DM[wk.domain].name) + ' <span class="mut">\u203a</span> ' + esc(wk.name) + ' <span class="tb-planflag">Weakest area</span></div><div class="tb-planwhy">You scored <b>' + Math.round(weakest.m * 100) + '%</b> here on this sample.</div><a class="tb-planlink" href="' + esc(wk.lesson) + '">Study: ' + esc(wk.lessonName) + ' &rarr;</a></div></div></div>' +
      '<section id="tb-feedback-loop" class="tb-feedback-loop" aria-labelledby="tb-feedback-title"><div class="tb-feedback-head"><div><div class="tb-diag-kick">Worked explanations</div><h2 id="tb-feedback-title">Review every answer and understand why.</h2><p>Each question shows your answer, the correct answer and a worked explanation.</p></div><div class="tb-feedback-stats"><span><strong>' + r.correct + '</strong> correct</span><span><strong>' + r.incorrect + '</strong> incorrect</span><span><strong>' + r.unanswered + '</strong> unanswered</span></div></div>' +
      '<div id="tb-answer-review" class="tb-answer-review"><div id="tb-review-list" class="tb-review-list">' + session.items.map(reviewCard).join('') + '</div></div></section>' +
      '<section class="tb-ep-cta" id="ep-cta" aria-labelledby="ep-cta-title"><div class="tb-diag-kick">Ready for the full exam?</div><h2 id="ep-cta-title">Practise with the complete Black Belt question bank</h2><p>Three full question sets, a mixed set, a placement diagnostic, a 165-question timed mock exam and focused quizzes by Body of Knowledge area, all in this same simulator.</p>' +
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
    if (ht) ht.textContent = exam ? EXAM_NAME + ' — ExamPreview' : 'Free CSSBB practice questions: ExamPreview';
    if (hp) hp.hidden = exam;
    var form = document.getElementById('ep-waitlist');
    if (form && view !== 'results') { form.hidden = true; document.querySelector('main').insertBefore(form, document.querySelector('.tb-ep-related')); }
    if (view === 'quiz') { host.innerHTML = quizHTML(); wireQuiz(); }
    else if (view === 'results') { host.innerHTML = resultsHTML(); wireResults(); }
    else { host.innerHTML = startHTML; wireStart(); }
  }
  var startEl = document.getElementById('ep-start');
  var startHTML = startEl ? startEl.outerHTML : '';
  function wireStart() { var b = host.querySelector('[data-ep-start]'); if (b) b.addEventListener('click', start); }
  wireStart();
  window.__ExamPreview = {start: start, submit: submit, state: function () { return {view: view, session: session}; }, ctaLabel: CTA_LABEL};
})();

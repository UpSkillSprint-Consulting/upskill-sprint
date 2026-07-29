(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STORE_KEY = 'tb-adaptive-mastery-v1';
  const STYLE_ID = 'tb-phase-integration-styles';
  let scheduled = false;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character];
    });
  }

  function hash(value) {
    let output = 2166136261;
    String(value || '').split('').forEach(function (character) {
      output ^= character.charCodeAt(0);
      output = Math.imul(output, 16777619);
    });
    return (output >>> 0).toString(36);
  }

  function examId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function exam() {
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId()] : null;
  }

  function questions() {
    const source = exam();
    const output = [];
    const seen = new Set();
    function add(question) {
      if (!question || !question.stem || seen.has(question.stem)) return;
      seen.add(question.stem);
      output.push(question);
    }
    if (source && source.sets) Object.keys(source.sets).forEach(function (key) { (source.sets[key] || []).forEach(add); });
    if (source && source.bank) source.bank.forEach(add);
    return output;
  }

  function readStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      return parsed && parsed.version === 1 ? parsed : { version: 1, exams: {} };
    } catch (error) {
      return { version: 1, exams: {} };
    }
  }

  function examData() {
    const store = readStore();
    return store.exams && store.exams[examId()] ? store.exams[examId()] : { questions: {}, attempts: [], sessions: [] };
  }

  function stateFor(question, data) {
    return data.questions && data.questions[hash(question.stem)] ? data.questions[hash(question.stem)] : null;
  }

  function effectiveMastery(state) {
    if (window.__TBAdaptiveHardening && window.__TBAdaptiveHardening.effectiveMastery) {
      return window.__TBAdaptiveHardening.effectiveMastery(state, Date.now());
    }
    return state && Number.isFinite(state.mastery) ? state.mastery : 0;
  }

  function subtopicName(subId) {
    let result = subId || 'General';
    const source = exam();
    (source && source.bok ? source.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (subtopic) {
        if (subtopic && typeof subtopic === 'object' && subtopic.id === subId) {
          result = subtopic.name || subtopic.id;
          return true;
        }
        return false;
      });
    });
    return result;
  }

  function lessonFor(subId) {
    let result = { href: '/lessons', name: 'Review related lessons' };
    const source = exam();
    (source && source.bok ? source.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (subtopic) {
        if (subtopic && typeof subtopic === 'object' && subtopic.id === subId) {
          result = { href: subtopic.lesson || '/lessons', name: subtopic.lessonName || 'Review related lesson' };
          return true;
        }
        return false;
      });
    });
    return result;
  }

  function integratedSummary() {
    const data = examData();
    const attempted = questions().map(function (question) {
      return { question: question, state: stateFor(question, data) };
    }).filter(function (item) { return item.state && item.state.attempts > 0; });
    const due = attempted.filter(function (item) { return item.state.dueAt <= Date.now(); }).length;
    const mastered = attempted.filter(function (item) { return item.state.attempts >= 3 && effectiveMastery(item.state) >= 80; }).length;
    const notebook = attempted.filter(function (item) { return item.state.lastStatus !== 'correct' || effectiveMastery(item.state) < 80; }).length;
    return { attempted: attempted, due: due, mastered: mastered, notebook: notebook };
  }

  function updateDashboard() {
    const dashboard = document.getElementById('tb-adaptive-mastery');
    if (!dashboard) return;
    const summary = integratedSummary();
    const statBlocks = dashboard.querySelectorAll('.tb-mastery-stats > div');
    const values = [summary.due, summary.mastered, summary.notebook, summary.attempted.length];
    statBlocks.forEach(function (block, index) {
      const strong = block.querySelector('strong');
      if (strong && values[index] != null) strong.textContent = values[index];
    });

    const groups = {};
    summary.attempted.forEach(function (item) {
      const sub = item.state.sub || item.question.sub || 'general';
      groups[sub] = groups[sub] || { total: 0, count: 0, due: 0 };
      groups[sub].total += effectiveMastery(item.state);
      groups[sub].count += 1;
      if (item.state.dueAt <= Date.now()) groups[sub].due += 1;
    });
    const weakest = Object.keys(groups).map(function (sub) {
      return { sub: sub, mastery: Math.round(groups[sub].total / groups[sub].count), due: groups[sub].due };
    }).sort(function (a, b) { return a.mastery - b.mastery; }).slice(0, 5);
    const list = dashboard.querySelector('.tb-weak-list');
    if (list) {
      const markup = weakest.length ? weakest.map(function (item) {
        return '<div><span>' + esc(subtopicName(item.sub)) + '</span><b>' + item.mastery + '%</b><i style="--p:' + item.mastery + '"></i>' + (item.due ? '<small>' + item.due + ' due</small>' : '') + '</div>';
      }).join('') : '<p>Complete an attempt to build your mastery map.</p>';
      if (list.innerHTML !== markup) list.innerHTML = markup;
    }
  }

  function notebookMarkup() {
    const data = examData();
    const items = questions().map(function (question) {
      return { question: question, state: stateFor(question, data) };
    }).filter(function (item) {
      return item.state && item.state.attempts > 0 && (item.state.lastStatus !== 'correct' || effectiveMastery(item.state) < 80);
    }).sort(function (a, b) {
      const dueDifference = a.state.dueAt - b.state.dueAt;
      return dueDifference || effectiveMastery(a.state) - effectiveMastery(b.state);
    }).slice(0, 50);

    return '<div class="tb-notebook-head"><div><div class="tb-diag-kick">Mistake notebook</div><h3>Questions that still need reinforcement</h3><p>Effective mastery is recalculated using current recency. Items leave after at least three attempts and sustained mastery of 80% or higher.</p></div><button type="button" class="tb-ghost" data-close-adaptive>Close</button></div><div class="tb-notebook-list">' +
      (items.length ? items.map(function (item) {
        const lesson = lessonFor(item.question.sub);
        const mastery = effectiveMastery(item.state);
        const due = item.state.dueAt <= Date.now() ? 'Due now' : 'Due ' + new Date(item.state.dueAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
        return '<article><div><span>' + esc(subtopicName(item.question.sub)) + '</span><strong>' + esc(item.question.stem) + '</strong><small>Last result: ' + esc(item.state.lastStatus) + ' · ' + due + ' · ' + item.state.attempts + ' attempts</small></div><div class="tb-notebook-score"><b>' + mastery + '%</b><a href="' + esc(lesson.href) + '">' + esc(lesson.name) + '</a></div></article>';
      }).join('') : '<p class="tb-review-empty">Your mistake notebook is empty.</p>') + '</div>';
  }

  function openNotebook(event) {
    const button = event.target.closest && event.target.closest('[data-open-notebook]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = notebookMarkup();
    panel.tabIndex = -1;
    panel.focus();
    const live = document.getElementById('tb-feedback-live');
    if (live) live.textContent = 'Mistake notebook opened.';
  }

  function integrationHealth() {
    const issues = [];
    if (!window.__TB) issues.push('question bank API unavailable');
    if (!window.__TBFeedbackLoop) issues.push('Phase 1 feedback API unavailable');
    if (!window.__TBDeepFeedback) issues.push('Phase 2 deep-feedback API unavailable');
    if (!window.__TBAdaptiveMastery) issues.push('Phase 3 mastery API unavailable');
    if (!window.__TBAdaptiveHardening) issues.push('Phase 3 hardening API unavailable');
    const feedback = document.getElementById(FEEDBACK_ID);
    if (feedback && feedback.querySelectorAll('#' + FEEDBACK_ID).length > 0) issues.push('nested feedback loop detected');
    const dashboards = document.querySelectorAll('#tb-adaptive-mastery');
    if (dashboards.length > 1) issues.push('duplicate mastery dashboard detected');
    return { ok: issues.length === 0, issues: issues, phases: { phase1: Boolean(window.__TBFeedbackLoop), phase2: Boolean(window.__TBDeepFeedback), phase3: Boolean(window.__TBAdaptiveMastery && window.__TBAdaptiveHardening) } };
  }

  function dedupe() {
    const dashboards = document.querySelectorAll('#tb-adaptive-mastery');
    dashboards.forEach(function (dashboard, index) { if (index > 0) dashboard.remove(); });
    const liveRegions = document.querySelectorAll('#tb-feedback-live');
    liveRegions.forEach(function (region, index) { if (index > 0) region.remove(); });
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.tb-weak-list small{grid-column:1/-1;color:var(--muted);font-size:10px}.tb-integration-status{margin-top:8px;color:var(--muted);font-size:10px}';
    document.head.appendChild(style);
  }

  function apply() {
    scheduled = false;
    ensureStyles();
    dedupe();
    updateDashboard();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  function initialize() {
    ensureStyles();
    document.addEventListener('click', openNotebook, true);
    document.addEventListener('tb:adaptive-complete', function () { requestAnimationFrame(updateDashboard); });
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
  }

  window.__TBPhaseIntegration = {
    health: integrationHealth,
    summary: integratedSummary,
    notebookMarkup: notebookMarkup,
    refresh: apply
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

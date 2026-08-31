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

  function registry() {
    return window.__TBQuestionRegistry || null;
  }

  function questionId(question) {
    const helper = registry();
    if (helper && typeof helper.idFor === 'function') return helper.idFor(examId(), question);
    return question && question.questionId || question && question.qid || question && question.id || hash(question && question.stem);
  }

  function questions() {
    const helper = registry();
    if (helper && typeof helper.questionsFor === 'function') return helper.questionsFor(examId());
    const source = exam();
    const output = [];
    const seen = new Set();
    function add(question) {
      if (!question || !question.stem) return;
      const id = questionId(question);
      if (seen.has(id)) return;
      seen.add(id);
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
    if (!data.questions) return null;
    const id = questionId(question);
    return data.questions[id] || data.questions[hash(question.stem)] || null;
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
      const next = values[index] == null ? null : String(values[index]);
      /* updateDashboard runs from a MutationObserver. Replacing an identical
         text node is still a mutation, which otherwise schedules it forever. */
      if (strong && next != null && strong.textContent !== next) strong.textContent = next;
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

  let notebookFilter = 'all';

  function questionByIdentity(identity, legacyStem) {
    const helper = registry();
    if (helper && typeof helper.find === 'function' && identity) {
      const found = helper.find(examId(), identity);
      if (found) return found;
    }
    return questions().find(function (question) {
      return questionId(question) === identity || question.stem === legacyStem || question.stem === identity;
    }) || null;
  }

  /* Flattens every stored incorrect attempt, across every question, into a
     single chronological log (most recent first). Each row carries the full
     question object so the card below can render a complete A-D snapshot. */
  function mistakeEntries() {
    const data = examData();
    const rows = [];
    Object.keys(data.questions || {}).forEach(function (key) {
      const state = data.questions[key];
      if (!state || typeof state !== 'object') return;
      const question = questionByIdentity(state.questionId || state.id || key, state.stem);
      if (!question) return;
      (state.history || []).forEach(function (entry) {
        if (entry.status !== 'incorrect') return;
        rows.push({ question: question, sub: state.sub || question.sub, at: entry.at, selected: entry.selected, source: entry.source });
      });
    });
    return rows.sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
  }

  function mistakeKnowledgeAreas(entries) {
    const seen = {};
    const list = [];
    entries.forEach(function (entry) {
      if (seen[entry.sub]) return;
      seen[entry.sub] = true;
      list.push(entry.sub);
    });
    return list.sort(function (a, b) { return subtopicName(a).localeCompare(subtopicName(b)); });
  }

  function formatAttemptWhen(timestamp) {
    return timestamp ? new Date(timestamp).toLocaleString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Unknown date';
  }

  function sourceLabel(source) {
    if (source === 'adaptive-practice') return 'Adaptive practice';
    if (source === 'exam-attempt') return 'Test attempt';
    return source ? esc(source) : 'Practice';
  }

  function mistakeOptionMarkup(question, entry) {
    return question.options.map(function (option, optionIndex) {
      let cls = 'tb-mistake-opt';
      if (optionIndex === question.answer) cls += ' tb-mistake-opt-correct';
      if (entry.selected === optionIndex && optionIndex !== question.answer) cls += ' tb-mistake-opt-wrong';
      const tag = optionIndex === question.answer ? '<em>Correct answer</em>' : (entry.selected === optionIndex ? '<em>Your answer</em>' : '');
      return '<li class="' + cls + '"><span>' + String.fromCharCode(65 + optionIndex) + '</span><div>' + esc(option) + tag + '</div></li>';
    }).join('');
  }

  function chartHtml(chart) {
    return (window.__TB && window.__TB.renderQuestionChart) ? window.__TB.renderQuestionChart(chart) : '';
  }

  function mistakeCardMarkup(entry) {
    const question = entry.question;
    const lesson = lessonFor(entry.sub);
    return '<article class="tb-mistake-card" data-question-id="' + esc(questionId(question)) + '">' +
      '<div class="tb-mistake-meta"><span class="tb-mistake-sub">' + esc(subtopicName(entry.sub)) + '</span><span class="tb-mistake-when">' + formatAttemptWhen(entry.at) + ' · ' + sourceLabel(entry.source) + '</span></div>' +
      chartHtml(question.chart) +
      '<div class="tb-mistake-stem">' + esc(question.stem) + '</div>' +
      '<ol class="tb-mistake-options">' + mistakeOptionMarkup(question, entry) + '</ol>' +
      (question.why ? '<div class="tb-mistake-why"><strong>Why:</strong> ' + question.why + '</div>' : '') +
      '<a class="tb-mistake-link" href="' + esc(lesson.href) + '">Review: ' + esc(lesson.name) + '</a>' +
      '</article>';
  }

  function notebookMarkup() {
    const entries = mistakeEntries();
    const areas = mistakeKnowledgeAreas(entries);
    const activeFilter = notebookFilter && areas.indexOf(notebookFilter) !== -1 ? notebookFilter : 'all';
    const shown = activeFilter === 'all' ? entries : entries.filter(function (entry) { return entry.sub === activeFilter; });
    const filterOptions = '<option value="all">All knowledge areas</option>' + areas.map(function (sub) {
      return '<option value="' + esc(sub) + '"' + (sub === activeFilter ? ' selected' : '') + '>' + esc(subtopicName(sub)) + '</option>';
    }).join('');

    return '<div class="tb-notebook-head"><div><div class="tb-diag-kick">Mistake notebook</div><h3>Every question answered incorrectly</h3><p>A complete, chronological record of missed questions across every test and practice attempt. Entries stay here as a permanent study log, even after a question is later answered correctly.</p></div><button type="button" class="tb-ghost" data-close-adaptive>Close</button></div>' +
      (entries.length ? '<div class="tb-notebook-filter"><label for="tb-notebook-filter-select">Knowledge area</label><select id="tb-notebook-filter-select" data-notebook-filter>' + filterOptions + '</select><span class="tb-notebook-count">' + shown.length + ' of ' + entries.length + ' missed attempt' + (entries.length === 1 ? '' : 's') + '</span></div>' : '') +
      '<div class="tb-notebook-list">' + (shown.length ? shown.map(mistakeCardMarkup).join('') : '<p class="tb-review-empty">' + (entries.length ? 'No missed questions in this knowledge area yet.' : 'Your mistake notebook is empty.') + '</p>') + '</div>';
  }

  function renderNotebook() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel || panel.hidden) return;
    panel.innerHTML = notebookMarkup();
  }

  function openNotebook(event) {
    const button = event.target.closest && event.target.closest('[data-open-notebook]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel) return;
    notebookFilter = 'all';
    panel.hidden = false;
    renderNotebook();
    panel.tabIndex = -1;
    panel.focus();
    const live = document.getElementById('tb-feedback-live');
    if (live) live.textContent = 'Mistake notebook opened.';
  }

  function handleNotebookFilterChange(event) {
    const select = event.target.closest && event.target.closest('[data-notebook-filter]');
    if (!select) return;
    notebookFilter = select.value;
    renderNotebook();
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
    style.textContent = '.tb-weak-list small{grid-column:1/-1;color:var(--muted);font-size:10px}.tb-integration-status{margin-top:8px;color:var(--muted);font-size:10px}' +
      '.tb-notebook-filter{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:14px}.tb-notebook-filter label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}.tb-notebook-filter select{padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit;font-size:12.5px}.tb-notebook-count{color:var(--muted);font-size:11.5px;margin-left:auto}.tb-notebook-list{display:grid;gap:14px}.tb-mistake-card{padding:16px;border:1px solid var(--line);border-radius:11px;background:var(--card)}.tb-mistake-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-bottom:10px}.tb-mistake-sub{color:var(--teal);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.tb-mistake-when{color:var(--muted);font-size:11px}.tb-mistake-stem{color:var(--ink);font-size:14.5px;font-weight:600;line-height:1.5;margin-bottom:11px}.tb-mistake-options{display:grid;gap:7px;margin:0 0 11px;padding:0;list-style:none}.tb-mistake-opt{display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--tint);color:var(--ink);font-size:13px;line-height:1.45}.tb-mistake-opt span{width:22px;height:22px;flex:0 0 auto;display:grid;place-items:center;border:1px solid var(--line);border-radius:6px;font-size:10.5px;font-weight:700;background:var(--card)}.tb-mistake-opt em{display:block;margin-top:3px;font-style:normal;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.tb-mistake-opt-correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 12%,var(--card))}.tb-mistake-opt-correct em{color:#1f9d6b}.tb-mistake-opt-wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 10%,var(--card))}.tb-mistake-opt-wrong em{color:#c0453f}.tb-mistake-why{padding:11px;border-radius:8px;background:var(--tint);color:var(--muted);font-size:12.5px;line-height:1.5;margin-bottom:10px}.tb-mistake-why strong{color:var(--ink)}.tb-mistake-link{color:var(--teal);font-size:12px;font-weight:600}@media(max-width:560px){.tb-notebook-filter{flex-direction:column;align-items:flex-start}.tb-notebook-count{margin-left:0}}';
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
    document.addEventListener('change', handleNotebookFilterChange);
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

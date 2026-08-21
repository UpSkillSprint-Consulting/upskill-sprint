(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STORE_KEY = 'tb-adaptive-mastery-v1';
  const STYLE_ID = 'tb-adaptive-mastery-styles';
  const DAY = 86400000;
  const MASTERY_THRESHOLD = 80;
  const SESSION_SIZE = 10;
  const MASTERY_EVIDENCE_LIMIT = 500;

  let scheduled = false;
  let attempt = null;
  let adaptive = null;
  let notebookFilter = 'all';

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function chartHtml(chart) {
    return (window.__TB && window.__TB.renderQuestionChart) ? window.__TB.renderQuestionChart(chart) : '';
  }

  function stripHtml(value) {
    const node = document.createElement('div');
    node.innerHTML = String(value == null ? '' : value);
    return (node.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function hash(value) {
    let output = 2166136261;
    String(value || '').split('').forEach(function (character) {
      output ^= character.charCodeAt(0);
      output = Math.imul(output, 16777619);
    });
    return (output >>> 0).toString(36);
  }

  function now() { return Date.now(); }

  function eventId(timestamp) {
    const random = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2, 12);
    return 'mastery-' + Number(timestamp || now()).toString(36) + '-' + random;
  }

  function examId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function exam() {
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId()] : null;
  }

  function allQuestions() {
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

  function questionByStem(stem) {
    return allQuestions().find(function (question) { return question.stem === stem; }) || null;
  }

  function readStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      return parsed && parsed.version === 1 ? parsed : { version: 1, exams: {} };
    } catch (error) {
      return { version: 1, exams: {} };
    }
  }

  function writeStore(store) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (error) {}
  }

  function examStore(store) {
    store.exams = store.exams || {};
    store.exams[examId()] = store.exams[examId()] || { questions: {}, attempts: [], sessions: [] };
    return store.exams[examId()];
  }

  function initialQuestionState(question) {
    return {
      id: hash(question.stem),
      stem: question.stem,
      sub: question.sub || 'general',
      attempts: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      streak: 0,
      ease: 2.3,
      intervalDays: 0,
      dueAt: 0,
      lastSeenAt: 0,
      lastStatus: 'new',
      mastery: 0,
      history: [],
      masteryBaseline: emptyMasteryBaseline(),
      masteryHistory: []
    };
  }

  function count(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  }

  function evidenceOrder(left, right) {
    const time = Number(left && left.at || 0) - Number(right && right.at || 0);
    if (time) return time;
    const sequence = Number(left && left.priorAttempts || 0) - Number(right && right.priorAttempts || 0);
    if (sequence) return sequence;
    return String(left && left.id || '').localeCompare(String(right && right.id || ''));
  }

  function emptyMasteryBaseline() {
    return { at: 0, firstSeenAt: 0, attempts: 0, correct: 0, incorrect: 0, unanswered: 0, streak: 0, lastSeenAt: 0, lastStatus: 'new' };
  }

  function normalizeMasteryBaseline(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
      at: Number(source.at || source.lastSeenAt || 0),
      firstSeenAt: Number(source.firstSeenAt || 0),
      attempts: count(source.attempts),
      correct: count(source.correct),
      incorrect: count(source.incorrect),
      unanswered: count(source.unanswered),
      streak: count(source.streak),
      lastSeenAt: Number(source.lastSeenAt || source.at || 0),
      lastStatus: source.lastStatus || 'new'
    };
  }

  function legacyMasteryBaseline(state) {
    return normalizeMasteryBaseline({
      at: state.lastSeenAt,
      /* Legacy aggregates can include events no longer present in the notebook
         archive, so their true first observation is intentionally unknown. */
      firstSeenAt: 0,
      attempts: state.attempts,
      correct: state.correct,
      incorrect: state.incorrect,
      unanswered: state.unanswered,
      streak: state.streak,
      lastSeenAt: state.lastSeenAt,
      lastStatus: state.lastStatus
    });
  }

  function foldEvidenceIntoBaseline(baseline, entries) {
    const output = normalizeMasteryBaseline(baseline);
    (entries || []).forEach(function (entry) {
      const timestamp = Number(entry && entry.at || 0);
      output.attempts += 1;
      if (entry.status === 'correct') output.correct += 1;
      else if (entry.status === 'unanswered') output.unanswered += 1;
      else output.incorrect += 1;
      output.streak = entry.status === 'correct' ? output.streak + 1 : 0;
      if (!output.firstSeenAt || (timestamp && timestamp < output.firstSeenAt)) output.firstSeenAt = timestamp;
      if (timestamp >= output.lastSeenAt) {
        output.lastSeenAt = timestamp;
        output.lastStatus = entry.status || output.lastStatus;
      }
      output.at = Math.max(output.at, timestamp);
    });
    return output;
  }

  function compactMasteryEvidence(baseline, history) {
    const sorted = (history || []).slice().sort(evidenceOrder);
    if (sorted.length <= MASTERY_EVIDENCE_LIMIT) return { baseline: normalizeMasteryBaseline(baseline), history: sorted };
    const overflow = sorted.slice(0, sorted.length - MASTERY_EVIDENCE_LIMIT);
    return { baseline: foldEvidenceIntoBaseline(baseline, overflow), history: sorted.slice(-MASTERY_EVIDENCE_LIMIT) };
  }

  function ensureMasteryEvidence(state) {
    if (state.masteryBaseline && Array.isArray(state.masteryHistory)) {
      return compactMasteryEvidence(state.masteryBaseline, state.masteryHistory);
    }
    return { baseline: legacyMasteryBaseline(state), history: [] };
  }

  function rebuildMasteryState(state, timestamp) {
    const canonical = compactMasteryEvidence(state.masteryBaseline, state.masteryHistory);
    const baseline = canonical.baseline;
    let attempts = baseline.attempts;
    let correct = baseline.correct;
    let incorrect = baseline.incorrect;
    let unanswered = baseline.unanswered;
    let streak = baseline.streak;
    let lastSeenAt = baseline.lastSeenAt;
    let lastStatus = baseline.lastStatus;
    canonical.history.forEach(function (entry) {
      attempts += 1;
      if (entry.status === 'correct') correct += 1;
      else if (entry.status === 'unanswered') unanswered += 1;
      else incorrect += 1;
      streak = entry.status === 'correct' ? streak + 1 : 0;
      if (Number(entry.at || 0) >= lastSeenAt) {
        lastSeenAt = Number(entry.at || 0);
        lastStatus = entry.status || lastStatus;
      }
    });
    state.masteryBaseline = baseline;
    state.masteryHistory = canonical.history;
    state.attempts = attempts;
    state.correct = correct;
    state.incorrect = incorrect;
    state.unanswered = unanswered;
    state.streak = streak;
    state.lastSeenAt = lastSeenAt;
    state.lastStatus = lastStatus;
    state.mastery = calculateMastery(state, timestamp);
    return state;
  }

  function calculateMastery(state, timestamp) {
    if (!state || !state.attempts) return 0;
    const accuracy = state.correct / state.attempts;
    const confidence = Math.min(state.attempts / 5, 1);
    const streak = Math.min(state.streak / 4, 1);
    const ageDays = state.lastSeenAt ? Math.max(0, (timestamp - state.lastSeenAt) / DAY) : 60;
    const recency = Math.max(0, 1 - ageDays / 45);
    const raw = (0.58 * accuracy + 0.24 * streak + 0.18 * recency) * (0.62 + 0.38 * confidence);
    return Math.max(0, Math.min(100, Math.round(raw * 100)));
  }

  function nextSchedule(state, status, timestamp) {
    const correct = status === 'correct';
    if (!correct) {
      state.streak = 0;
      state.intervalDays = 1;
      state.ease = Math.max(1.3, Number((state.ease - 0.2).toFixed(2)));
      state.dueAt = timestamp + DAY;
      return;
    }
    state.streak += 1;
    if (state.streak === 1) state.intervalDays = 1;
    else if (state.streak === 2) state.intervalDays = 3;
    else state.intervalDays = Math.max(4, Math.round(Math.max(state.intervalDays, 3) * state.ease));
    state.ease = Math.min(2.8, Number((state.ease + 0.05).toFixed(2)));
    state.dueAt = timestamp + state.intervalDays * DAY;
  }

  /* Every incorrect attempt is retained without limit so the mistake notebook
     can show a complete chronological record; correct/unanswered attempts are
     capped to bound storage growth, and an overall ceiling guards worst case. */
  function trimHistory(history) {
    const sorted = (history || []).slice().sort(evidenceOrder);
    const incorrect = sorted.filter(function (entry) { return entry.status === 'incorrect'; });
    const other = sorted.filter(function (entry) { return entry.status !== 'incorrect'; }).slice(-40);
    return incorrect.concat(other).sort(evidenceOrder).slice(-500);
  }

  function applyResult(state, question, status, selected, source, timestamp) {
    const canonical = ensureMasteryEvidence(state);
    state.masteryBaseline = canonical.baseline;
    state.masteryHistory = canonical.history;
    rebuildMasteryState(state, timestamp);
    const priorAttempts = state.attempts;
    nextSchedule(state, status, timestamp);
    const entry = {
      id: eventId(timestamp),
      at: timestamp,
      status: status,
      selected: selected,
      source: source,
      priorAttempts: priorAttempts,
      mastery: 0
    };
    state.history = trimHistory((state.history || []).concat([entry]));
    state.masteryHistory = state.masteryHistory.concat([entry]);
    rebuildMasteryState(state, timestamp);
    entry.mastery = state.mastery;
    return state;
  }

  function recordResults(records, source) {
    if (!records || !records.length) return null;
    const timestamp = now();
    const store = readStore();
    const data = examStore(store);
    const attemptId = examId() + '-' + timestamp.toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    const summary = { id: attemptId, at: timestamp, source: source, total: records.length, correct: 0, repeated: 0, newQuestions: 0 };

    records.forEach(function (record) {
      const question = record.question;
      if (!question) return;
      const key = hash(question.stem);
      const state = data.questions[key] || initialQuestionState(question);
      if (state.attempts) summary.repeated += 1;
      else summary.newQuestions += 1;
      if (record.status === 'correct') summary.correct += 1;
      data.questions[key] = applyResult(state, question, record.status, record.selected, source, timestamp);
    });

    data.attempts = (data.attempts || []).concat([summary]).slice(-60);
    writeStore(store);
    return summary;
  }

  function captureCurrent() {
    const overview = document.getElementById(OVERVIEW_ID);
    const quiz = overview && overview.querySelector('.tb-quiz');
    if (!quiz || quiz.closest('#' + FEEDBACK_ID)) return;
    const nav = quiz.querySelector('.tb-navcell.cur');
    const stemNode = quiz.querySelector('.tb-stem');
    if (!nav || !stemNode) return;
    const total = quiz.querySelectorAll('.tb-navcell').length;
    if (!attempt || attempt.examId !== examId() || attempt.total !== total || !attempt.active) {
      attempt = { examId: examId(), total: total, active: true, records: {}, startedAt: now() };
    }
    const question = questionByStem(stemNode.textContent.trim());
    if (!question) return;
    const selectedNode = quiz.querySelector('.tb-opt.sel');
    const selected = selectedNode ? Number(selectedNode.dataset.opt) : null;
    const status = selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect';
    attempt.records[Number(nav.dataset.goto)] = { question: question, selected: selected, status: status, flagged: nav.classList.contains('flag') };
  }

  function finalizeAttempt() {
    if (!attempt || !attempt.active) return;
    const records = Object.keys(attempt.records).sort(function (a, b) { return Number(a) - Number(b); }).map(function (key) { return attempt.records[key]; });
    if (!records.length) return;
    recordResults(records, 'exam-attempt');
    attempt.active = false;
  }

  function stateFor(question, data) {
    return data.questions[hash(question.stem)] || initialQuestionState(question);
  }

  function unattemptedFilter(questions) {
    const store = readStore();
    const data = examStore(store);
    return (questions || []).filter(function (question) {
      return question && stateFor(question, data).attempts === 0;
    });
  }

  function dueQuestions(data, timestamp) {
    return allQuestions().filter(function (question) {
      const state = stateFor(question, data);
      return state.attempts > 0 && state.dueAt <= timestamp;
    });
  }

  function weakQuestions(data) {
    return allQuestions().filter(function (question) {
      const state = stateFor(question, data);
      return state.attempts > 0 && state.mastery < MASTERY_THRESHOLD;
    }).sort(function (a, b) {
      return stateFor(a, data).mastery - stateFor(b, data).mastery;
    });
  }

  function adaptiveCandidates(data, limit) {
    const timestamp = now();
    const due = dueQuestions(data, timestamp);
    const weak = weakQuestions(data);
    const unseen = allQuestions().filter(function (question) { return !stateFor(question, data).attempts; });
    const chosen = [];
    const seen = new Set();

    function add(question) {
      if (!question || seen.has(question.stem) || chosen.length >= limit) return;
      seen.add(question.stem);
      chosen.push(question);
    }

    due.sort(function (a, b) { return stateFor(a, data).dueAt - stateFor(b, data).dueAt; }).forEach(add);
    weak.forEach(add);
    const newTarget = Math.max(1, Math.round(limit * 0.2));
    unseen.slice(0, newTarget).forEach(add);
    allQuestions().sort(function (a, b) { return stateFor(a, data).mastery - stateFor(b, data).mastery; }).forEach(add);
    return chosen.slice(0, limit);
  }

  function masterySummary(data) {
    const states = Object.values(data.questions || {});
    const attempted = states.filter(function (state) { return state.attempts > 0; });
    const overall = attempted.length ? Math.round(attempted.reduce(function (sum, state) { return sum + state.mastery; }, 0) / attempted.length) : 0;
    const mastered = attempted.filter(function (state) { return state.mastery >= MASTERY_THRESHOLD && state.attempts >= 2; }).length;
    const due = attempted.filter(function (state) { return state.dueAt <= now(); }).length;
    const notebook = attempted.filter(function (state) { return state.lastStatus !== 'correct' || state.mastery < MASTERY_THRESHOLD; }).length;
    return { overall: overall, mastered: mastered, due: due, attempted: attempted.length, notebook: notebook };
  }

  function subtopicName(subId) {
    let name = subId || 'General';
    const source = exam();
    (source && source.bok ? source.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (sub) {
        if (sub && typeof sub === 'object' && sub.id === subId) { name = sub.name || sub.id; return true; }
        return false;
      });
    });
    return name;
  }

  function lessonFor(subId) {
    let result = { href: '/lessons', name: 'Review related lessons' };
    const source = exam();
    (source && source.bok ? source.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (sub) {
        if (sub && typeof sub === 'object' && sub.id === subId) {
          result = { href: sub.lesson || '/lessons', name: sub.lessonName || 'Review related lesson' };
          return true;
        }
        return false;
      });
    });
    return result;
  }

  function weakSubtopics(data) {
    const groups = {};
    Object.values(data.questions || {}).forEach(function (state) {
      if (!state.attempts) return;
      groups[state.sub] = groups[state.sub] || { total: 0, count: 0, due: 0 };
      groups[state.sub].total += state.mastery;
      groups[state.sub].count += 1;
      if (state.dueAt <= now()) groups[state.sub].due += 1;
    });
    return Object.keys(groups).map(function (sub) {
      return { sub: sub, mastery: Math.round(groups[sub].total / groups[sub].count), due: groups[sub].due };
    }).sort(function (a, b) { return a.mastery - b.mastery; }).slice(0, 5);
  }

  function improvement(data) {
    let firstCorrect = 0;
    let firstTotal = 0;
    let repeatCorrect = 0;
    let repeatTotal = 0;
    Object.values(data.questions || {}).forEach(function (state) {
      const evidence = Array.isArray(state.masteryHistory) ? state.masteryHistory : (state.history || []);
      evidence.forEach(function (entry) {
        if (!Number.isFinite(Number(entry.priorAttempts))) return;
        if (Number(entry.priorAttempts) === 0) {
          firstTotal += 1;
          if (entry.status === 'correct') firstCorrect += 1;
        } else {
          repeatTotal += 1;
          if (entry.status === 'correct') repeatCorrect += 1;
        }
      });
    });
    return {
      first: firstTotal ? Math.round(firstCorrect / firstTotal * 100) : 0,
      repeat: repeatTotal ? Math.round(repeatCorrect / repeatTotal * 100) : 0,
      firstTotal: firstTotal,
      repeatTotal: repeatTotal
    };
  }

  function trend(data) {
    return (data.attempts || []).slice(-8).map(function (entry) {
      return entry.total ? Math.round(entry.correct / entry.total * 100) : 0;
    });
  }

  function dashboardMarkup(data) {
    const summary = masterySummary(data);
    const weak = weakSubtopics(data);
    const gains = improvement(data);
    const bars = trend(data);
    return '<section id="tb-adaptive-mastery" class="tb-mastery" aria-labelledby="tb-mastery-title">' +
      '<div class="tb-mastery-head"><div><div class="tb-diag-kick">Phase 3 · Adaptive mastery</div><h2 id="tb-mastery-title">Turn every attempt into a targeted study plan.</h2><p>Mastery combines accuracy, repeated success, recency, and evidence volume. It is a learning estimate—not an exam guarantee.</p></div>' +
      '<div class="tb-mastery-ring" style="--p:' + summary.overall + '"><strong>' + summary.overall + '%</strong><span>estimated mastery</span></div></div>' +
      '<div class="tb-mastery-stats"><div><strong>' + summary.due + '</strong><span>reviews due</span></div><div><strong>' + summary.mastered + '</strong><span>questions mastered</span></div><div><strong>' + summary.notebook + '</strong><span>notebook items</span></div><div><strong>' + summary.attempted + '</strong><span>questions attempted</span></div></div>' +
      '<div class="tb-mastery-actions"><button type="button" class="btn btn-teal" data-start-adaptive>Start adaptive practice</button><button type="button" class="tb-ghost" data-open-notebook>Open mistake notebook</button><button type="button" class="tb-ghost" data-open-mastery-details>View mastery details</button></div>' +
      '<div class="tb-mastery-grid">' +
        '<section><div class="tb-sec">Weakest subtopics</div><div class="tb-weak-list">' + (weak.length ? weak.map(function (item) { return '<div><span>' + esc(subtopicName(item.sub)) + '</span><b>' + item.mastery + '%</b><i style="--p:' + item.mastery + '"></i></div>'; }).join('') : '<p>Complete an attempt to build your mastery map.</p>') + '</div></section>' +
        '<section><div class="tb-sec">Learning improvement</div><div class="tb-improvement"><div><span>First encounters</span><strong>' + gains.first + '%</strong><small>' + gains.firstTotal + ' answers</small></div><div><span>Repeated questions</span><strong>' + gains.repeat + '%</strong><small>' + gains.repeatTotal + ' answers</small></div></div></section>' +
        '<section><div class="tb-sec">Recent attempt trend</div><div class="tb-trend" aria-label="Recent attempt accuracy">' + (bars.length ? bars.map(function (value) { return '<i style="--p:' + value + '" title="' + value + '%"><span></span></i>'; }).join('') : '<p>No attempt history yet.</p>') + '</div></section>' +
      '</div><div id="tb-adaptive-panel" class="tb-adaptive-panel" hidden></div></section>';
  }

  function renderDashboard() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback || document.getElementById('tb-adaptive-mastery')) return;
    const store = readStore();
    const data = examStore(store);
    feedback.insertAdjacentHTML('beforeend', dashboardMarkup(data));
  }

  function adaptiveQuestionMarkup(question, index, total) {
    const store = readStore();
    const data = examStore(store);
    const state = stateFor(question, data);
    const selected = adaptive.answers[index];
    const checked = adaptive.checked[index];
    const options = question.options.map(function (option, optionIndex) {
      let cls = 'tb-adaptive-option';
      if (selected === optionIndex) cls += ' selected';
      if (checked && optionIndex === question.answer) cls += ' correct';
      if (checked && selected === optionIndex && optionIndex !== question.answer) cls += ' wrong';
      return '<button type="button" class="' + cls + '" data-adaptive-opt="' + optionIndex + '"' + (checked ? ' disabled' : '') + '><span>' + String.fromCharCode(65 + optionIndex) + '</span>' + esc(option) + '</button>';
    }).join('');
    const status = selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect';
    return '<div class="tb-adaptive-head"><div><div class="tb-diag-kick">Adaptive practice · ' + (index + 1) + ' of ' + total + '</div><h3>' + esc(subtopicName(question.sub)) + '</h3></div><div class="tb-adaptive-mastery-chip">Current mastery <strong>' + state.mastery + '%</strong></div></div>' +
      chartHtml(question.chart) + '<div class="tb-adaptive-stem">' + esc(question.stem) + '</div><div class="tb-adaptive-options">' + options + '</div>' +
      (checked ? '<div class="tb-adaptive-feedback ' + status + '"><strong>' + (status === 'correct' ? 'Correct.' : 'Not yet.') + '</strong><div>' + (question.why || 'A stored explanation is not available.') + '</div></div>' : '') +
      '<div class="tb-adaptive-actions">' + (!checked ? '<button type="button" class="btn btn-teal" data-adaptive-check' + (selected == null ? ' disabled' : '') + '>Check answer</button>' : '<button type="button" class="btn btn-teal" data-adaptive-next>' + (index === total - 1 ? 'Finish session' : 'Next question') + '</button>') + '<button type="button" class="tb-ghost" data-close-adaptive>Close</button></div>';
  }

  function adaptiveSummaryMarkup() {
    const total = adaptive.items.length;
    const correct = adaptive.items.reduce(function (count, question, index) { return count + (adaptive.answers[index] === question.answer ? 1 : 0); }, 0);
    return '<div class="tb-adaptive-summary"><div class="tb-ring big" style="--p:' + Math.round(correct / Math.max(total, 1) * 100) + '"><span>' + correct + '<small>/' + total + '</small></span></div><div><div class="tb-diag-kick">Adaptive session complete</div><h3>Your mastery map has been updated.</h3><p>The next review dates, weak-area ranking, mistake notebook, and repeated-question trend now reflect this session.</p><div class="tb-adaptive-actions"><button type="button" class="btn btn-teal" data-restart-adaptive>Build another session</button><button type="button" class="tb-ghost" data-close-adaptive>Return to results</button></div></div></div>';
  }

  function renderAdaptive() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel || !adaptive) return;
    panel.hidden = false;
    panel.innerHTML = adaptive.complete ? adaptiveSummaryMarkup() : adaptiveQuestionMarkup(adaptive.items[adaptive.index], adaptive.index, adaptive.items.length);
    panel.tabIndex = -1;
    panel.focus();
  }

  function startAdaptive() {
    const store = readStore();
    const data = examStore(store);
    const items = adaptiveCandidates(data, SESSION_SIZE);
    adaptive = { items: items, index: 0, answers: {}, checked: {}, results: [], complete: false };
    renderAdaptive();
  }

  function finishAdaptiveQuestion() {
    const question = adaptive.items[adaptive.index];
    const selected = adaptive.answers[adaptive.index];
    const status = selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect';
    adaptive.results.push({ question: question, selected: selected, status: status });
  }

  function finishAdaptiveSession() {
    recordResults(adaptive.results, 'adaptive-practice');
    adaptive.complete = true;
    renderAdaptive();
  }

  /* Flattens every stored incorrect attempt, across every question, into a
     single chronological log entry list (most recent first). Each entry
     carries the question object (for the full stem/options/answer snapshot)
     alongside the knowledge-area id and when/how the attempt happened. */
  function mistakeEntries(data) {
    const rows = [];
    Object.keys(data.questions || {}).forEach(function (key) {
      const state = data.questions[key];
      const question = questionByStem(state.stem);
      if (!question) return;
      (state.history || []).forEach(function (entry) {
        if (entry.status !== 'incorrect') return;
        rows.push({ question: question, sub: state.sub, at: entry.at, selected: entry.selected, source: entry.source });
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

  function mistakeCardMarkup(entry) {
    const question = entry.question;
    const lesson = lessonFor(entry.sub);
    return '<article class="tb-mistake-card">' +
      '<div class="tb-mistake-meta"><span class="tb-mistake-sub">' + esc(subtopicName(entry.sub)) + '</span><span class="tb-mistake-when">' + formatAttemptWhen(entry.at) + ' · ' + sourceLabel(entry.source) + '</span></div>' +
      chartHtml(question.chart) +
      '<div class="tb-mistake-stem">' + esc(question.stem) + '</div>' +
      '<ol class="tb-mistake-options">' + mistakeOptionMarkup(question, entry) + '</ol>' +
      (question.why ? '<div class="tb-mistake-why"><strong>Why:</strong> ' + question.why + '</div>' : '') +
      '<a class="tb-mistake-link" href="' + esc(lesson.href) + '">Review: ' + esc(lesson.name) + '</a>' +
      '</article>';
  }

  function notebookMarkup(data, filter) {
    const entries = mistakeEntries(data);
    const areas = mistakeKnowledgeAreas(entries);
    const activeFilter = filter && areas.indexOf(filter) !== -1 ? filter : 'all';
    const shown = activeFilter === 'all' ? entries : entries.filter(function (entry) { return entry.sub === activeFilter; });
    const filterOptions = '<option value="all">All knowledge areas</option>' + areas.map(function (sub) {
      return '<option value="' + esc(sub) + '"' + (sub === activeFilter ? ' selected' : '') + '>' + esc(subtopicName(sub)) + '</option>';
    }).join('');
    return '<div class="tb-notebook-head"><div><div class="tb-diag-kick">Mistake notebook</div><h3>Every question answered incorrectly</h3><p>A complete, chronological record of missed questions across every test and practice attempt. Entries stay here as a permanent study log, even after a question is later answered correctly.</p></div><button type="button" class="tb-ghost" data-close-adaptive>Close</button></div>' +
      (entries.length ? '<div class="tb-notebook-filter"><label for="tb-notebook-filter-select">Knowledge area</label><select id="tb-notebook-filter-select" data-notebook-filter>' + filterOptions + '</select><span class="tb-notebook-count">' + shown.length + ' of ' + entries.length + ' missed attempt' + (entries.length === 1 ? '' : 's') + '</span></div>' : '') +
      '<div class="tb-notebook-list">' + (shown.length ? shown.map(mistakeCardMarkup).join('') : '<p class="tb-review-empty">' + (entries.length ? 'No missed questions in this knowledge area yet.' : 'Your mistake notebook is empty.') + '</p>') + '</div>';
  }

  function detailsMarkup(data) {
    const summary = masterySummary(data);
    return '<div class="tb-notebook-head"><div><div class="tb-diag-kick">Mastery model details</div><h3>How your estimate is calculated</h3></div><button type="button" class="tb-ghost" data-close-adaptive>Close</button></div>' +
      '<div class="tb-mastery-explain"><p><strong>Accuracy (58%)</strong> measures the proportion answered correctly.</p><p><strong>Success streak (24%)</strong> rewards repeated correct retrieval rather than one lucky answer.</p><p><strong>Recency (18%)</strong> gradually lowers confidence when knowledge has not been retrieved recently.</p><p><strong>Evidence adjustment</strong> limits high mastery from only one or two observations. A question is counted as mastered only after at least two attempts and an estimate of ' + MASTERY_THRESHOLD + '% or higher.</p><p><strong>Current scope:</strong> ' + summary.attempted + ' questions attempted. This estimate supports study prioritization; it does not predict an official examination result.</p></div>';
  }

  function renderNotebook() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel || panel.hidden) return;
    const store = readStore();
    panel.innerHTML = notebookMarkup(examStore(store), notebookFilter);
  }

  function openNotebook() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel) return;
    notebookFilter = 'all';
    panel.hidden = false;
    renderNotebook();
    panel.tabIndex = -1;
    panel.focus();
  }

  function openDetails() {
    const panel = document.getElementById('tb-adaptive-panel');
    const store = readStore();
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = detailsMarkup(examStore(store));
    panel.tabIndex = -1;
    panel.focus();
  }

  function closePanel() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (panel) { panel.hidden = true; panel.innerHTML = ''; }
  }

  function refreshDashboard() {
    const current = document.getElementById('tb-adaptive-mastery');
    if (!current) return;
    const parent = current.parentElement;
    current.remove();
    const store = readStore();
    const holder = document.createElement('div');
    holder.innerHTML = dashboardMarkup(examStore(store));
    parent.appendChild(holder.firstElementChild);
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.tb-mastery{margin-top:22px;padding:20px;border:1px solid var(--line);border-radius:13px;background:linear-gradient(180deg,color-mix(in srgb,#6656b5 7%,var(--card)),var(--card))}.tb-mastery-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.tb-mastery-head h2{font-family:"Source Serif 4",serif;font-size:23px;color:var(--ink);margin:3px 0 7px}.tb-mastery-head p{max-width:72ch;color:var(--muted);font-size:13px;line-height:1.55;margin:0}.tb-mastery-ring{--p:0;width:104px;height:104px;flex:0 0 auto;border-radius:50%;display:grid;place-content:center;text-align:center;background:conic-gradient(#6656b5 calc(var(--p)*1%),var(--line) 0);position:relative}.tb-mastery-ring:before{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--card)}.tb-mastery-ring strong,.tb-mastery-ring span{position:relative}.tb-mastery-ring strong{font-size:24px;color:var(--ink)}.tb-mastery-ring span{font-size:9px;color:var(--muted);text-transform:uppercase}.tb-mastery-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:16px 0}.tb-mastery-stats div{padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--card);text-align:center}.tb-mastery-stats strong{display:block;color:var(--ink);font-size:21px}.tb-mastery-stats span{color:var(--muted);font-size:10.5px}.tb-mastery-actions,.tb-adaptive-actions{display:flex;flex-wrap:wrap;gap:9px}.tb-mastery-grid{display:grid;grid-template-columns:1.25fr .9fr .85fr;gap:12px;margin-top:16px}.tb-mastery-grid>section{padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--card)}.tb-weak-list{display:grid;gap:9px;margin-top:10px}.tb-weak-list>div{display:grid;grid-template-columns:1fr auto;gap:4px 10px;align-items:center;font-size:12px;color:var(--ink)}.tb-weak-list b{font-size:11px}.tb-weak-list i{grid-column:1/-1;height:5px;border-radius:999px;background:linear-gradient(90deg,#6656b5 calc(var(--p)*1%),var(--line) 0)}.tb-improvement{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.tb-improvement>div{padding:10px;border-radius:8px;background:var(--tint)}.tb-improvement span,.tb-improvement small{display:block;color:var(--muted);font-size:10px}.tb-improvement strong{display:block;color:var(--ink);font-size:22px;margin:3px 0}.tb-trend{height:90px;display:flex;align-items:flex-end;gap:5px;margin-top:10px}.tb-trend i{flex:1;height:100%;display:flex;align-items:flex-end;background:var(--tint);border-radius:4px;overflow:hidden}.tb-trend i span{display:block;width:100%;height:calc(var(--p)*1%);background:#6656b5}.tb-adaptive-panel{margin-top:20px;padding-top:20px;border-top:1px solid var(--line);outline:none}.tb-adaptive-head,.tb-notebook-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:14px}.tb-adaptive-head h3,.tb-notebook-head h3,.tb-adaptive-summary h3{font-family:"Source Serif 4",serif;color:var(--ink);font-size:21px;margin:2px 0}.tb-adaptive-mastery-chip{padding:8px 10px;border:1px solid var(--line);border-radius:8px;color:var(--muted);font-size:11px}.tb-adaptive-mastery-chip strong{color:var(--ink)}.tb-adaptive-stem{color:var(--ink);font-size:16px;font-weight:600;line-height:1.5;margin-bottom:13px}.tb-adaptive-options{display:grid;gap:8px}.tb-adaptive-option{display:flex;gap:10px;align-items:flex-start;width:100%;padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--tint);color:var(--ink);font:inherit;text-align:left;cursor:pointer}.tb-adaptive-option span{width:24px;height:24px;display:grid;place-items:center;border:1px solid var(--line);border-radius:6px;font-size:11px;font-weight:700}.tb-adaptive-option.selected{border-color:#6656b5}.tb-adaptive-option.correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 9%,var(--card))}.tb-adaptive-option.wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 8%,var(--card))}.tb-adaptive-feedback{margin:12px 0;padding:12px;border-radius:9px;color:var(--ink);font-size:13px;line-height:1.5}.tb-adaptive-feedback.correct{border:1px solid rgba(31,157,107,.35);background:color-mix(in srgb,#1f9d6b 9%,var(--card))}.tb-adaptive-feedback.incorrect{border:1px solid rgba(192,69,63,.3);background:color-mix(in srgb,#c0453f 7%,var(--card))}.tb-adaptive-actions{margin-top:14px}.tb-adaptive-summary{display:flex;align-items:center;gap:20px}.tb-notebook-filter{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:14px}.tb-notebook-filter label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}.tb-notebook-filter select{padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit;font-size:12.5px}.tb-notebook-count{color:var(--muted);font-size:11.5px;margin-left:auto}.tb-notebook-list{display:grid;gap:14px}.tb-mistake-card{padding:16px;border:1px solid var(--line);border-radius:11px;background:var(--card)}.tb-mistake-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-bottom:10px}.tb-mistake-sub{color:var(--teal);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.tb-mistake-when{color:var(--muted);font-size:11px}.tb-mistake-stem{color:var(--ink);font-size:14.5px;font-weight:600;line-height:1.5;margin-bottom:11px}.tb-mistake-options{display:grid;gap:7px;margin:0 0 11px;padding:0;list-style:none}.tb-mistake-opt{display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--tint);color:var(--ink);font-size:13px;line-height:1.45}.tb-mistake-opt span{width:22px;height:22px;flex:0 0 auto;display:grid;place-items:center;border:1px solid var(--line);border-radius:6px;font-size:10.5px;font-weight:700;background:var(--card)}.tb-mistake-opt em{display:block;margin-top:3px;font-style:normal;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.tb-mistake-opt-correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 12%,var(--card))}.tb-mistake-opt-correct em{color:#1f9d6b}.tb-mistake-opt-wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 10%,var(--card))}.tb-mistake-opt-wrong em{color:#c0453f}.tb-mistake-why{padding:11px;border-radius:8px;background:var(--tint);color:var(--muted);font-size:12.5px;line-height:1.5;margin-bottom:10px}.tb-mistake-why strong{color:var(--ink)}.tb-mistake-link{color:var(--teal);font-size:12px;font-weight:600}.tb-mastery-explain{display:grid;gap:9px}.tb-mastery-explain p{margin:0;padding:11px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--muted);font-size:12.5px;line-height:1.5}.tb-mastery-explain strong{color:var(--ink)}@media(max-width:820px){.tb-mastery-grid{grid-template-columns:1fr}.tb-mastery-stats{grid-template-columns:1fr 1fr}}@media(max-width:560px){.tb-mastery-head,.tb-adaptive-head,.tb-notebook-head,.tb-adaptive-summary{flex-direction:column}.tb-mastery-ring{width:90px;height:90px}.tb-mastery-stats{grid-template-columns:1fr 1fr}}';
    document.head.appendChild(style);
  }

  function handleClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-start-adaptive') || target.hasAttribute('data-restart-adaptive')) { startAdaptive(); return; }
    if (target.hasAttribute('data-open-notebook')) { openNotebook(); return; }
    if (target.hasAttribute('data-open-mastery-details')) { openDetails(); return; }
    if (target.hasAttribute('data-close-adaptive')) { closePanel(); return; }
    if (target.dataset.adaptiveOpt != null && adaptive && !adaptive.checked[adaptive.index]) {
      adaptive.answers[adaptive.index] = Number(target.dataset.adaptiveOpt);
      renderAdaptive();
      return;
    }
    if (target.hasAttribute('data-adaptive-check') && adaptive && adaptive.answers[adaptive.index] != null) {
      adaptive.checked[adaptive.index] = true;
      renderAdaptive();
      return;
    }
    if (target.hasAttribute('data-adaptive-next') && adaptive) {
      finishAdaptiveQuestion();
      if (adaptive.index < adaptive.items.length - 1) { adaptive.index += 1; renderAdaptive(); }
      else { finishAdaptiveSession(); refreshDashboard(); }
    }
  }

  function enhance() {
    scheduled = false;
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;
    captureCurrent();
    if (overview.querySelector('.tb-reshead') && document.getElementById(FEEDBACK_ID)) {
      finalizeAttempt();
      renderDashboard();
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(enhance);
  }

  function initialize() {
    ensureStyles();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;
    document.addEventListener('click', function (event) {
      const navigation = event.target.closest('.tb-navcell,.tb-opt,[data-flag]');
      if (navigation && overview.contains(navigation)) captureCurrent();
      handleClick(event);
    });
    document.addEventListener('change', function (event) {
      const select = event.target.closest('[data-notebook-filter]');
      if (!select) return;
      notebookFilter = select.value;
      renderNotebook();
    });
    new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
  }

  window.__TBAdaptiveMastery = {
    calculateMastery: calculateMastery,
    nextSchedule: nextSchedule,
    applyResult: applyResult,
    adaptiveCandidates: function (limit) { const store = readStore(); return adaptiveCandidates(examStore(store), limit || SESSION_SIZE); },
    summary: function () { const store = readStore(); return masterySummary(examStore(store)); },
    improvement: function () { const store = readStore(); return improvement(examStore(store)); },
    store: readStore,
    recordResults: recordResults,
    unattemptedFilter: unattemptedFilter
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

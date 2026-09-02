(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STORE_KEY = 'tb-adaptive-mastery-v1';
  const STYLE_ID = 'tb-analytics-dashboard-styles';
  const DAY = 86400000;
  const HEATMAP_WEEKS = 8;
  const TREND_LIMIT = 20;

  let open = false;
  let activeTab = 'readiness';
  let scheduled = false;
  let tabRenderToken = 0;
  let questionCache = null;
  let storeCache = null;
  let domainCache = null;
  let readinessCache = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[character];
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

  function registry() { return window.__TBQuestionRegistry || null; }
  function questionId(question) {
    const helper = registry();
    return helper && typeof helper.idFor === 'function' ? helper.idFor(examId(), question) : hash(question && question.stem);
  }

  function examId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function exam() {
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId()] : null;
  }

  function allQuestions() {
    const helper = registry();
    const currentExamId = examId();
    const source = exam();
    if (questionCache && questionCache.examId === currentExamId && questionCache.source === source && questionCache.registry === helper) return questionCache.questions;
    if (helper && typeof helper.questionsFor === 'function') {
      questionCache = { examId: currentExamId, source: source, registry: helper, questions: helper.questionsFor(currentExamId) };
      return questionCache.questions;
    }
    const output = [];
    const seen = new Set();
    function add(question) {
      const id = questionId(question);
      if (!question || !question.stem || seen.has(id)) return;
      seen.add(id);
      output.push(question);
    }
    if (source && source.sets) Object.keys(source.sets).forEach(function (key) { (source.sets[key] || []).forEach(add); });
    if (source && source.bank) source.bank.forEach(add);
    questionCache = { examId: currentExamId, source: source, registry: helper, questions: output };
    return output;
  }

  function readStore() {
    const raw = localStorage.getItem(STORE_KEY);
    if (storeCache && storeCache.raw === raw) return storeCache.value;
    try {
      const parsed = JSON.parse(raw);
      const value = parsed && parsed.version === 1 ? parsed : { version: 1, exams: {} };
      storeCache = { raw: raw, value: value };
      return value;
    } catch (error) {
      const value = { version: 1, exams: {} };
      storeCache = { raw: raw, value: value };
      return value;
    }
  }

  function examData(store) {
    store.exams = store.exams || {};
    return store.exams[examId()] || { questions: {}, attempts: [], sessions: [] };
  }

  function stateFor(question, data) {
    return (data.questions || {})[questionId(question)] || (data.questions || {})[hash(question.stem)] || null;
  }

  function hardening() {
    return window.__TBAdaptiveHardening || null;
  }

  function effectiveMastery(state, timestamp) {
    const api = hardening();
    if (api && api.effectiveMastery) return api.effectiveMastery(state, timestamp);
    if (!state || !state.attempts) return 0;
    const accuracy = state.correct / state.attempts;
    const confidence = Math.min(state.attempts / 5, 1);
    const streak = Math.min(state.streak / 4, 1);
    const ageDays = state.lastSeenAt ? Math.max(0, (timestamp - state.lastSeenAt) / DAY) : 60;
    const recency = Math.max(0, 1 - ageDays / 45);
    const raw = (0.58 * accuracy + 0.24 * streak + 0.18 * recency) * (0.62 + 0.38 * confidence);
    return Math.max(0, Math.min(100, Math.round(raw * 100)));
  }

  // Ordered [{id,name,weight,poolSize}] straight from the exam's ASQ BoK blueprint,
  // in blueprint order, merged with the live question pool size for that subtopic.
  function subtopicMeta() {
    const source = exam();
    const pool = {};
    allQuestions().forEach(function (question) {
      const sub = question.sub || 'general';
      pool[sub] = (pool[sub] || 0) + 1;
    });
    const output = [];
    (source && source.bok ? source.bok : []).forEach(function (domain) {
      (domain.subs || []).forEach(function (sub) {
        if (!sub || typeof sub !== 'object') return;
        output.push({ id: sub.id, name: sub.name || sub.id, weight: Number(sub.w || 0), poolSize: pool[sub.id] || 0 });
      });
    });
    return output;
  }

  // Real per-domain stats: blueprint weight + pool size (static) merged with live
  // attempted count and effective mastery (from stored attempt history).
  function domainStats(timestamp) {
    const store = readStore();
    const currentExamId = examId();
    const timeBucket = Math.floor(Number(timestamp || Date.now()) / 60000);
    if (domainCache && domainCache.examId === currentExamId && domainCache.store === store && domainCache.timeBucket === timeBucket) return domainCache.value;
    const data = examData(store);
    const meta = subtopicMeta();
    const totalWeight = meta.reduce(function (sum, item) { return sum + item.weight; }, 0) || 1;
    const groups = {};
    allQuestions().forEach(function (question) {
      const state = stateFor(question, data);
      const sub = question.sub || 'general';
      groups[sub] = groups[sub] || { attempted: 0, masterySum: 0 };
      if (!state || !state.attempts) return;
      groups[sub].attempted += 1;
      groups[sub].masterySum += effectiveMastery(state, timestamp);
    });
    const value = meta.map(function (item) {
      const group = groups[item.id];
      const attempted = group ? group.attempted : 0;
      const avgMastery = group && group.attempted ? Math.round(group.masterySum / group.attempted) : 0;
      /* `question_exposed` is deliberately broader than an answer because it
         protects New-only selection. Domain readiness must use answered
         evidence only; otherwise opening a full test and answering one item
         could produce 100% coverage for that domain. */
      const coverage = item.poolSize ? Math.round(attempted / item.poolSize * 100) : 0;
      return {
        id: item.id, name: item.name, weight: item.weight, weightPct: Math.round(item.weight / totalWeight * 100),
        poolSize: item.poolSize, attempted: attempted, avgMastery: avgMastery, coverage: coverage,
        domainReadiness: Math.round(avgMastery * coverage / 100)
      };
    });
    domainCache = { examId: currentExamId, store: store, timeBucket: timeBucket, value: value };
    return value;
  }

  // Ranks subtopics by (blueprint weight x mastery gap): the highest-leverage
  // place to study next, not just the lowest raw score.
  function topLeverage(timestamp, limit) {
    return domainStats(timestamp).map(function (item) {
      const gap = 100 - item.domainReadiness;
      return Object.assign({ gap: gap, leverage: item.weight * gap }, item);
    }).sort(function (a, b) { return b.leverage - a.leverage; }).slice(0, limit || 3);
  }

  function readinessSummary(timestamp) {
    const store = readStore();
    const currentExamId = examId();
    const timeBucket = Math.floor(Number(timestamp || Date.now()) / 60000);
    if (readinessCache && readinessCache.examId === currentExamId && readinessCache.store === store && readinessCache.timeBucket === timeBucket) return readinessCache.value;
    const api = hardening();
    let value;
    if (api && api.summary) value = api.summary(timestamp);
    else {
      const meta = subtopicMeta();
      const total = meta.reduce(function (sum, item) { return sum + item.poolSize; }, 0);
      value = { attemptedMastery: 0, coverage: 0, readiness: 0, attempted: 0, total: total, mastered: 0, due: 0 };
    }
    readinessCache = { examId: currentExamId, store: store, timeBucket: timeBucket, value: value };
    return value;
  }

  function learningSummary(summary) {
    const data = examData(readStore());
    const learning = window.__TBLearning;
    const currentIds = allQuestions().map(questionId);
    const fallback = {
      uniqueSeen: Number(summary && summary.attempted || 0),
      answeredEvents: Number(summary && summary.answers || summary && summary.attempted || 0),
      completedSessions: 0,
      pending: 0,
      historicalUniqueSeen: 0,
      historicalAnsweredEvents: 0
    };
    if (!learning || typeof learning.summary !== 'function') return fallback;
    /* Full Analytics is about the live bank. Historic IDs remain in the
       durable ledger for audit/notebook purposes, but cannot be placed over
       the current-bank denominator or the result can exceed 100%. */
    const ledger = learning.summary(examId(), data.questions || {}, currentIds);
    return {
      uniqueSeen: Math.min(Number(summary && summary.total || currentIds.length || 0), Math.max(fallback.uniqueSeen, Number(ledger && ledger.uniqueSeen || 0))),
      answeredEvents: Math.max(fallback.answeredEvents, Number(ledger && ledger.answeredEvents || 0)),
      completedSessions: Number(ledger && ledger.completedSessions || 0),
      pending: Number(ledger && ledger.pending || 0),
      historicalUniqueSeen: Number(ledger && ledger.historicalUniqueSeen || 0),
      historicalAnsweredEvents: Number(ledger && ledger.historicalAnsweredEvents || 0)
    };
  }

  // Last N practice/adaptive/exam sessions, in chronological order.
  function sessionTrend(limit) {
    const data = examData(readStore());
    return (data.attempts || []).slice().sort(function (left, right) {
      return Number(left.at || 0) - Number(right.at || 0) || String(left.id || '').localeCompare(String(right.id || ''));
    }).slice(-(limit || TREND_LIMIT)).map(function (entry) {
      return {
        at: entry.at, source: entry.source, total: entry.total || 0, correct: entry.correct || 0,
        pct: entry.total ? Math.round(entry.correct / entry.total * 100) : 0,
        newQuestions: entry.newQuestions || 0, repeated: entry.repeated || 0
      };
    });
  }

  // Daily activity for the last N weeks, for a streak heatmap. Counts every
  // question answered that day across all attempt sources.
  function studyHeatmap(weeks) {
    const data = examData(readStore());
    const byDay = {};
    (data.attempts || []).forEach(function (entry) {
      const key = new Date(entry.at).toISOString().slice(0, 10);
      const answered = entry.answered == null ? entry.total : entry.answered;
      byDay[key] = (byDay[key] || 0) + Math.max(0, Number(answered || 0));
    });
    const days = weeks * 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const output = [];
    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date(today.getTime() - i * DAY);
      const key = date.toISOString().slice(0, 10);
      output.push({ key: key, count: byDay[key] || 0 });
    }
    return output;
  }

  // Only completed, timed, published-length full-exam simulations belong in
  // the exam trend. A quick quiz can share the same question bank, but must
  // never be represented as a full exam just because it used an old source
  // label.
  function examAttemptSeries() {
    const data = examData(readStore());
    const source = exam();
    const passLine = source && source.pass != null ? source.pass : 70;
    const expectedTotal = Number(source && source.questions || 0);
    return (data.attempts || []).filter(function (entry) {
      return entry && entry.mode === 'exam' && entry.timed === true && entry.completed === true &&
        (!expectedTotal || Number(entry.total) === expectedTotal);
    })
      .sort(function (a, b) { return a.at - b.at; })
      .map(function (entry) {
        const pct = entry.total ? Math.round(entry.correct / entry.total * 100) : 0;
        return { id: entry.id, at: entry.at, total: entry.total, correct: entry.correct, pct: pct, margin: pct - passLine };
      });
  }

  // Per-domain score for the single most recent completed timed full exam. The
  // immutable session ID prevents timestamp collisions between rapid attempts.
  function fullExamCompletion(sessionId) {
    const learning = window.__TBLearning;
    if (!learning || typeof learning.eventsForExam !== 'function') return null;
    const expectedTotal = Number(exam() && exam().questions || 0);
    const events = learning.eventsForExam(examId()) || [];
    return events.filter(function (event) {
      const payload = event && event.payload || {};
      const total = Number(payload.total || (Array.isArray(payload.answers) ? payload.answers.length : 0));
      return event && event.type === 'session_completed' && String(event.sessionId || '') === String(sessionId || '') &&
        payload.mode === 'exam' && payload.timed === true && (!expectedTotal || total === expectedTotal);
    }).sort(function (left, right) {
      return Number(left.occurredAt || 0) - Number(right.occurredAt || 0) || String(left.id || '').localeCompare(String(right.id || ''));
    }).pop() || null;
  }

  function completionDomainBreakdown(completion, meta) {
    if (!completion || !Array.isArray(completion.payload && completion.payload.answers)) return [];
    const events = window.__TBLearning && typeof window.__TBLearning.eventsForExam === 'function'
      ? window.__TBLearning.eventsForExam(examId()) || []
      : [];
    const answerEvents = {};
    events.forEach(function (event) {
      if (!event || event.type !== 'answer_recorded' || String(event.sessionId || '') !== String(completion.sessionId || '')) return;
      const id = String(event.questionId || '');
      if (!id) return;
      const previous = answerEvents[id];
      if (!previous || Number(previous.occurredAt || 0) < Number(event.occurredAt || 0) ||
        (Number(previous.occurredAt || 0) === Number(event.occurredAt || 0) && String(previous.id || '') < String(event.id || ''))) answerEvents[id] = event;
    });

    const totals = {};
    const seen = {};
    (completion.payload.answers || []).forEach(function (answer) {
      const id = String(answer && answer.questionId || '');
      if (!id) return;
      /* A completion payload is definitive.  If a malformed legacy payload
         repeats an ID, retain its last value without inflating the denominator. */
      const answerEvent = answerEvents[id];
      const payload = answerEvent && answerEvent.payload || {};
      const snapshot = payload.snapshot || {};
      const current = registry() && typeof registry().find === 'function' ? registry().find(examId(), id) : null;
      const sub = String(answer && answer.sub || payload.sub || snapshot.sub || current && current.sub || 'general');
      const prior = seen[id];
      if (prior) {
        prior.total -= 1;
        if (prior.correct) prior.correct -= 1;
      }
      totals[sub] = totals[sub] || { total: 0, correct: 0 };
      const correct = answer.status === 'correct';
      totals[sub].total += 1;
      if (correct) totals[sub].correct += 1;
      seen[id] = { total: totals[sub], correct: correct };
    });
    return meta.filter(function (item) { return totals[item.id] && totals[item.id].total > 0; }).map(function (item) {
      const total = totals[item.id];
      return { id: item.id, name: item.name, total: total.total, correct: total.correct, pct: Math.round(total.correct / total.total * 100) };
    });
  }

  function persistedAttemptDomainBreakdown(attempt, meta) {
    const totals = {};
    (attempt && Array.isArray(attempt.domainBreakdown) ? attempt.domainBreakdown : []).forEach(function (entry) {
      const id = String(entry && (entry.id || entry.sub) || '');
      const total = Math.max(0, Math.floor(Number(entry && entry.total) || 0));
      const correct = Math.max(0, Math.min(total, Math.floor(Number(entry && entry.correct) || 0)));
      if (!id || !total) return;
      totals[id] = { total: total, correct: correct };
    });
    return meta.filter(function (item) { return totals[item.id]; }).map(function (item) {
      const total = totals[item.id];
      return { id: item.id, name: item.name, total: total.total, correct: total.correct, pct: Math.round(total.correct / total.total * 100) };
    });
  }

  function latestExamDomainBreakdown() {
    const series = examAttemptSeries();
    if (!series.length) return [];
    const last = series[series.length - 1];
    const data = examData(readStore());
    const meta = subtopicMeta();
    /* Full-exam domain scoring must use the canonical completion answer list.
       Mastery history can omit unanswered records (or be compacted/rebuilt)
       and would turn 1 correct plus 1 blank into a misleading 100%. */
    const completion = fullExamCompletion(last.id);
    const immutable = completionDomainBreakdown(completion, meta);
    if (immutable.length) return immutable;

    /* Local event compaction intentionally bounds the ledger cache. The
       derived full-exam attempt keeps this same immutable breakdown, so it
       remains accurate after its answer/completion events have been trimmed. */
    const attempt = (data.attempts || []).find(function (entry) { return entry && String(entry.id || '') === String(last.id || ''); });
    const persisted = persistedAttemptDomainBreakdown(attempt, meta);
    if (persisted.length) return persisted;

    /* Pre-ledger browser history has no immutable completion payload. Retain
       this compatibility fallback for old attempts, but never prefer it over
       a durable session_completed answer list. */
    const totals = {};
    Object.values(data.questions || {}).forEach(function (state) {
      if (!state) return;
      (state.history || []).forEach(function (entry) {
        if (entry.source !== 'exam-attempt' || entry.attemptId !== last.id) return;
        const sub = entry.snapshot && entry.snapshot.sub || state.sub || 'general';
        totals[sub] = totals[sub] || { total: 0, correct: 0 };
        totals[sub].total += 1;
        if (entry.status === 'correct') totals[sub].correct += 1;
      });
    });
    return meta.filter(function (item) { return totals[item.id]; }).map(function (item) {
      const t = totals[item.id];
      return { id: item.id, name: item.name, total: t.total, correct: t.correct, pct: Math.round(t.correct / t.total * 100) };
    });
  }

  function scoreBuckets(series) {
    const labels = ['<50%', '50-59%', '60-69%', '70-79%', '80-89%', '90%+'];
    const counts = [0, 0, 0, 0, 0, 0];
    series.forEach(function (entry) {
      const p = entry.pct;
      const index = p < 50 ? 0 : p < 60 ? 1 : p < 70 ? 2 : p < 80 ? 3 : p < 90 ? 4 : 5;
      counts[index] += 1;
    });
    return labels.map(function (label, index) { return { label: label, count: counts[index] }; });
  }

  function tone(value) { return value < 60 ? 'red' : value < 75 ? 'amber' : 'green'; }

  // --- rendering -----------------------------------------------------------

  function svgPolyline(values, width, height, pad) {
    if (!values.length) return '';
    const w = width, h = height, p = pad || 6;
    const max = 100, min = 0;
    const step = values.length > 1 ? (w - p * 2) / (values.length - 1) : 0;
    const points = values.map(function (value, index) {
      const x = p + step * index;
      const y = p + (h - p * 2) * (1 - (value - min) / (max - min));
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    const dots = values.map(function (value, index) {
      const x = p + step * index;
      const y = p + (h - p * 2) * (1 - (value - min) / (max - min));
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.5" fill="#6656b5"></circle>';
    }).join('');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="tb-an-spark" preserveAspectRatio="none" role="img" aria-label="Accuracy trend across recent sessions">' +
      '<polyline points="' + points + '" fill="none" stroke="#6656b5" stroke-width="2"></polyline>' + dots + '</svg>';
  }

  function radarSvg(items) {
    const size = 220, cx = size / 2, cy = size / 2, r = 82;
    const n = items.length;
    if (!n) return '';
    function point(index, fraction) {
      const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
      const radius = r * Math.max(0, Math.min(1, fraction));
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    }
    function ring(fraction) {
      return items.map(function (item, index) { const pt = point(index, fraction); return pt[0].toFixed(1) + ',' + pt[1].toFixed(1); }).join(' ');
    }
    /* Both polygons are percentages on the same 0–100 scale. The old chart
       normalized blueprint weight to its largest domain, which made a 12%
       exam weight look as large as 30% and visually overstated weak areas. */
    const weightPoly = items.map(function (item, index) { const pt = point(index, item.weightPct / 100); return pt[0].toFixed(1) + ',' + pt[1].toFixed(1); }).join(' ');
    const readinessPoly = items.map(function (item, index) { const pt = point(index, item.domainReadiness / 100); return pt[0].toFixed(1) + ',' + pt[1].toFixed(1); }).join(' ');
    const labels = items.map(function (item, index) {
      const pt = point(index, 1.18);
      const fullName = esc(item.name);
      const detail = fullName + ' — ' + item.domainReadiness + '% readiness, ' + item.weightPct + '% of exam';
      return '<g class="tb-an-radar-axis" tabindex="0" role="img" aria-label="' + detail + '" data-radar-name="' + fullName + '">' +
        '<circle cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="13" class="tb-an-radar-hit"></circle>' +
        '<text x="' + pt[0].toFixed(1) + '" y="' + pt[1].toFixed(1) + '" font-size="8" fill="var(--muted)" text-anchor="middle">' + esc(item.id.toUpperCase()) + '</text>' +
        '<title>' + fullName + '</title>' +
      '</g>';
    }).join('');
    return '<svg viewBox="0 0 ' + size + ' ' + size + '" class="tb-an-radar" role="img" aria-label="Coverage-adjusted readiness and exam blueprint weight, by domain">' +
      '<polygon points="' + ring(1) + '" class="tb-an-radar-grid"></polygon>' +
      '<polygon points="' + ring(0.66) + '" class="tb-an-radar-grid"></polygon>' +
      '<polygon points="' + ring(0.33) + '" class="tb-an-radar-grid"></polygon>' +
      '<polygon points="' + weightPoly + '" class="tb-an-radar-weight"></polygon>' +
      '<polygon points="' + readinessPoly + '" class="tb-an-radar-mastery"></polygon>' +
      labels + '</svg>';
  }

  function readinessTab(timestamp) {
    const summary = readinessSummary(timestamp);
    const ledger = learningSummary(summary);
    const domains = domainStats(timestamp);
    const leverage = topLeverage(timestamp, 3);
    const domainSection = domains.length ?
      '<div class="tb-an-two">' +
        '<div><div class="tb-an-label">Readiness vs. exam blueprint weight</div>' + radarSvg(domains) +
          '<p class="tb-an-radar-caption" data-radar-caption data-default="Hover, tap, or tab to a domain on the chart for its full name">Hover, tap, or tab to a domain on the chart for its full name</p>' +
          '<div class="tb-an-legend"><span><i class="tb-an-swatch weight"></i>Blueprint weight</span><span><i class="tb-an-swatch mastery"></i>Your readiness</span></div></div>' +
        '<div><div class="tb-an-label">Highest-leverage fixes</div><p class="tb-an-desc">Ranked by blueprint weight &times; readiness gap — where an hour of study moves your score the most.</p>' +
          '<ul class="tb-an-leverage">' + (leverage.length ? leverage.map(function (item, index) {
            return '<li><span class="tb-an-rank">' + (index + 1) + '</span><span class="tb-an-lev-name">' + esc(item.name) + '</span><span class="tb-pill ' + tone(item.domainReadiness) + '">' + (item.attempted ? item.domainReadiness + '% readiness' : 'not attempted') + '</span></li>';
          }).join('') : '<li class="tb-an-empty">Complete some questions to see ranked priorities.</li>') + '</ul></div>' +
      '</div>' :
      '<p class="tb-an-empty">Domain-level detail is not available for this exam yet.</p>';
    return '<div class="tb-an-ring-wrap">' +
      '<div class="tb-an-ring" style="--p:' + summary.readiness + '"><strong>' + summary.readiness + '%</strong><span>readiness</span></div>' +
      '<div class="tb-an-stat-row">' +
        '<div class="tb-an-stat"><b>' + summary.attemptedMastery + '%</b><span>mastery on attempted</span></div>' +
        '<div class="tb-an-stat"><b>' + summary.coverage + '%</b><span>blueprint-weighted coverage</span></div>' +
        '<div class="tb-an-stat"><b>' + ledger.answeredEvents + '</b><span>answers on current questions</span></div>' +
        '<div class="tb-an-stat"><b>' + summary.attempted + '/' + summary.total + '</b><span>unique questions answered</span></div>' +
        '<div class="tb-an-stat"><b>' + ledger.uniqueSeen + '/' + summary.total + '</b><span>unique questions delivered</span></div>' +
      '</div></div>' +
      '<p class="tb-an-desc">Readiness is blueprint-weighted: each subtopic contributes its official exam weight × your effective mastery × the share of that subtopic you have answered. All five counters above use the current question bank. Delivered questions are shown separately and never raise readiness on their own, so a high score on 20 questions reads lower than the same score on 500.' + (ledger.historicalUniqueSeen ? ' ' + ledger.historicalUniqueSeen + ' retired or legacy question ID' + (ledger.historicalUniqueSeen === 1 ? ' is' : 's are') + ' retained in history but excluded from these current-bank totals.' : '') + (ledger.pending ? ' ' + ledger.pending + ' record' + (ledger.pending === 1 ? ' is' : 's are') + ' waiting to sync.' : '') + '</p>' +
      domainSection;
  }

  function domainsTab(timestamp) {
    const domains = domainStats(timestamp);
    if (!domains.length) return '<p class="tb-an-empty">Domain-level detail is not available for this exam yet.</p>';
    const totalPool = domains.reduce(function (sum, item) { return sum + item.poolSize; }, 0);
    const totalAttempted = domains.reduce(function (sum, item) { return sum + item.attempted; }, 0);
    const examLength = exam() && exam().questions != null ? exam().questions : totalPool;
    return '<p class="tb-an-desc">All ' + domains.length + ' ASQ Body of Knowledge domains. Bar length is your mastery; the number in parentheses is that domain\u2019s share of the ' + examLength + '-question exam blueprint.</p>' +
      '<div class="tb-an-domain-list">' + domains.map(function (item) {
        return '<div class="tb-an-domain-row">' +
          '<div class="tb-an-domain-head"><span>' + esc(item.name) + ' <i>(' + item.weightPct + '% of exam)</i></span><b class="tb-pill ' + tone(item.avgMastery) + '">' + item.avgMastery + '%</b></div>' +
          '<div class="tb-an-bar-track"><div class="tb-an-bar-fill ' + tone(item.avgMastery) + '" style="width:' + item.avgMastery + '%"></div></div>' +
          '<div class="tb-an-domain-sub"><span>Answered coverage ' + item.coverage + '%</span><span>' + item.attempted + ' / ' + item.poolSize + ' questions attempted</span></div>' +
        '</div>';
      }).join('') + '</div>' +
      '<div class="tb-an-stat-row"><div class="tb-an-stat"><b>' + totalAttempted + '</b><span>questions attempted, all domains</span></div><div class="tb-an-stat"><b>' + totalPool + '</b><span>questions in the full pool</span></div><div class="tb-an-stat"><b>' + (totalPool ? Math.round(totalAttempted / totalPool * 100) : 0) + '%</b><span>overall answered-pool coverage</span></div></div>';
  }

  function trendTab() {
    const trend = sessionTrend(TREND_LIMIT);
    const heat = studyHeatmap(HEATMAP_WEEKS);
    const maxHeat = Math.max.apply(null, heat.map(function (d) { return d.count; }).concat([1]));
    return '<div class="tb-an-label">Accuracy across your last ' + trend.length + ' sessions</div>' +
      (trend.length ? svgPolyline(trend.map(function (t) { return t.pct; }), 560, 140, 10) : '<p class="tb-an-empty">No sessions yet — complete a quiz or adaptive session to start the trend line.</p>') +
      '<div class="tb-an-label" style="margin-top:18px">Study streak — last ' + HEATMAP_WEEKS + ' weeks</div>' +
      '<div class="tb-an-heat">' + heat.map(function (d) {
        const level = d.count === 0 ? 0 : Math.min(4, Math.ceil(d.count / maxHeat * 4));
        return '<i class="tb-an-heat-cell l' + level + '" title="' + d.key + ': ' + d.count + ' question' + (d.count === 1 ? '' : 's') + '"></i>';
      }).join('') + '</div>' +
      '<div class="tb-an-label" style="margin-top:18px">New vs. repeated questions per session</div>' +
      '<p class="tb-an-desc">A session made mostly of repeats is spaced review; mostly-new sessions are first exposure. Both matter — this shows the balance.</p>' +
      '<div class="tb-an-session-list">' + (trend.length ? trend.slice(-8).map(function (entry) {
        const total = Math.max(1, entry.newQuestions + entry.repeated);
        return '<div class="tb-an-session-row"><span>' + new Date(entry.at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) + '</span>' +
          '<div class="tb-an-stack"><i style="width:' + (entry.newQuestions / total * 100) + '%" class="new"></i><i style="width:' + (entry.repeated / total * 100) + '%" class="rep"></i></div>' +
          '<span class="tb-an-session-count">' + entry.newQuestions + ' new &middot; ' + entry.repeated + ' repeat</span></div>';
      }).join('') : '<p class="tb-an-empty">No sessions yet.</p>') + '</div>';
  }

  function examTab() {
    const series = examAttemptSeries();
    if (!series.length) {
      return '<p class="tb-an-empty">You have not completed a full timed exam simulation yet. This tab fills in once you finish one — quiz and adaptive-practice sessions do not count toward it.</p>';
    }
    const buckets = scoreBuckets(series);
    const maxBucket = Math.max.apply(null, buckets.map(function (b) { return b.count; }).concat([1]));
    const breakdown = latestExamDomainBreakdown();
    const passLine = exam() && exam().pass != null ? exam().pass : 70;
    return '<div class="tb-an-label">Score distribution across ' + series.length + ' timed exam' + (series.length === 1 ? '' : 's') + ' &middot; pass line ' + passLine + '%</div>' +
      '<div class="tb-an-hist">' + buckets.map(function (b) {
        const h = Math.round(b.count / maxBucket * 100);
        const passing = b.label === '70-79%' || b.label === '80-89%' || b.label === '90%+';
        return '<div class="tb-an-hist-col"><div class="tb-an-hist-bar ' + (passing ? 'green' : 'red') + '" style="height:' + Math.max(4, h) + '%"><b>' + b.count + '</b></div><span>' + b.label + '</span></div>';
      }).join('') + '</div>' +
      '<div class="tb-an-label" style="margin-top:20px">Per-domain score \u2014 most recent exam</div>' +
      '<div class="tb-an-domain-list">' + (breakdown.length ? breakdown.map(function (item) {
        return '<div class="tb-an-domain-row"><div class="tb-an-domain-head"><span>' + esc(item.name) + '</span><b class="tb-pill ' + tone(item.pct) + '">' + item.pct + '%</b></div>' +
          '<div class="tb-an-bar-track"><div class="tb-an-bar-fill ' + tone(item.pct) + '" style="width:' + item.pct + '%"></div></div>' +
          '<div class="tb-an-domain-sub"><span>' + item.correct + ' / ' + item.total + ' correct on that exam</span></div></div>';
      }).join('') : '<p class="tb-an-empty">Domain detail is unavailable for exams taken before this dashboard was added.</p>') + '</div>' +
      '<div class="tb-an-label" style="margin-top:20px">Pass margin over successive exams</div>' +
      '<p class="tb-an-desc">Distance above or below the ' + passLine + '% pass line each time — the clearest signal of whether you are getting closer.</p>' +
      marginChart(series, passLine);
  }

  function marginChart(series, passLine) {
    const w = 560, h = 140, p = 14;
    const values = series.map(function (s) { return s.margin; });
    const maxAbs = Math.max(10, Math.max.apply(null, values.map(Math.abs)));
    const zeroY = p + (h - p * 2) * 0.5;
    function y(value) { return p + (h - p * 2) * (0.5 - value / (2 * maxAbs)); }
    const step = values.length > 1 ? (w - p * 2) / (values.length - 1) : 0;
    const points = values.map(function (value, index) { return (p + step * index).toFixed(1) + ',' + y(value).toFixed(1); }).join(' ');
    const dots = values.map(function (value, index) {
      const cx = p + step * index;
      return '<circle cx="' + cx.toFixed(1) + '" cy="' + y(value).toFixed(1) + '" r="3.5" fill="' + (value >= 0 ? '#1f9d6b' : '#c0453f') + '"></circle>';
    }).join('');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="tb-an-margin" role="img" aria-label="Score margin above or below the pass line across exams">' +
      '<line x1="' + p + '" y1="' + zeroY.toFixed(1) + '" x2="' + (w - p) + '" y2="' + zeroY.toFixed(1) + '" class="tb-an-zero"></line>' +
      '<polyline points="' + points + '" fill="none" stroke="#6656b5" stroke-width="1.5"></polyline>' + dots + '</svg>';
  }

  function tabMarkup(tab, timestamp) {
    if (tab === 'domains') return domainsTab(timestamp);
    if (tab === 'trend') return trendTab();
    if (tab === 'exam') return examTab();
    return readinessTab(timestamp);
  }

  const TABS = [
    { id: 'readiness', label: 'Readiness' },
    { id: 'domains', label: 'Domains' },
    { id: 'trend', label: 'Trend' },
    { id: 'exam', label: 'Exam attempts' }
  ];

  function panelMarkup() {
    const timestamp = Date.now();
    return '<div class="tb-an-head"><div><div class="tb-diag-kick">Full analytics</div><h3>Your complete study picture</h3></div><button type="button" class="tb-ghost" data-close-analytics>Close</button></div>' +
      '<div class="tb-an-tabs" role="tablist">' + TABS.map(function (tab) {
        return '<button type="button" role="tab" aria-selected="' + (tab.id === activeTab ? 'true' : 'false') + '" class="tb-an-tab' + (tab.id === activeTab ? ' active' : '') + '" data-analytics-tab="' + tab.id + '">' + tab.label + '</button>';
      }).join('') + '</div>' +
      '<div class="tb-an-body" data-analytics-body role="tabpanel">' + tabMarkup(activeTab, timestamp) + '</div>';
  }

  function ensurePanel() {
    const host = document.getElementById('tb-adaptive-mastery');
    if (!host) return null;
    let panel = document.getElementById('tb-analytics-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'tb-analytics-panel';
      panel.className = 'tb-an-panel';
      panel.hidden = true;
      host.appendChild(panel);
    }
    return panel;
  }

  function wireRadarTooltips(panel) {
    const caption = panel.querySelector('[data-radar-caption]');
    if (!caption) return;
    const defaultText = caption.dataset.default || caption.textContent;
    function show(axis) { caption.textContent = axis.getAttribute('data-radar-name') || defaultText; }
    function reset() { caption.textContent = defaultText; }
    Array.prototype.forEach.call(panel.querySelectorAll('.tb-an-radar-axis'), function (axis) {
      axis.addEventListener('pointerenter', function () { show(axis); });
      axis.addEventListener('pointerleave', reset);
      axis.addEventListener('focus', function () { show(axis); });
      axis.addEventListener('blur', reset);
      axis.addEventListener('click', function () { show(axis); });
    });
  }

  function renderPanel() {
    const panel = ensurePanel();
    if (!panel) return;
    tabRenderToken += 1;
    if (!panel.querySelector('[data-analytics-body]')) panel.innerHTML = panelMarkup();
    else {
      updateTabSelection(panel);
      renderTabBody(panel);
    }
    wireRadarTooltips(panel);
  }

  function updateTabSelection(panel) {
    Array.prototype.forEach.call(panel.querySelectorAll('[data-analytics-tab]'), function (button) {
      const selected = button.dataset.analyticsTab === activeTab;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  function renderTabBody(panel) {
    const body = panel.querySelector('[data-analytics-body]');
    if (!body) return;
    body.innerHTML = tabMarkup(activeTab, Date.now());
    body.removeAttribute('aria-busy');
    wireRadarTooltips(panel);
  }

  /* Keep the tab buttons themselves stable and acknowledge the selection in
     the current event turn. The heavier study-history render then runs in one
     bounded follow-up task. Rapid clicks invalidate older queued work instead
     of stacking several expensive renders behind the learner's latest click. */
  function queueTabRender(panel) {
    const token = ++tabRenderToken;
    updateTabSelection(panel);
    const body = panel.querySelector('[data-analytics-body]');
    if (body) body.setAttribute('aria-busy', 'true');
    window.setTimeout(function () {
      if (token !== tabRenderToken || !open || !panel.isConnected || panel.hidden) return;
      renderTabBody(panel);
    }, 0);
  }

  function openPanel(options) {
    const panel = ensurePanel();
    const adaptivePanel = document.getElementById('tb-adaptive-panel');
    if (adaptivePanel) { adaptivePanel.hidden = true; adaptivePanel.innerHTML = ''; }
    if (!panel) return;
    open = true;
    panel.hidden = false;
    renderPanel();
    panel.tabIndex = -1;
    /* Move focus only for an explicit user request to open Full analytics.
       The test-bank shell also calls open() while restoring an already-open
       panel after unrelated controls re-render. Focusing during that restore
       steals both keyboard focus and the viewport from the filter the learner
       just clicked. */
    if (!options || options.focus !== false) panel.focus();
  }

  function closePanel() {
    const panel = document.getElementById('tb-analytics-panel');
    if (!panel) return;
    tabRenderToken += 1;
    open = false;
    panel.hidden = true;
    panel.innerHTML = '';
  }

  function ensureButton() {
    const actions = document.querySelector('.tb-mastery-actions');
    if (!actions || actions.querySelector('[data-open-analytics]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tb-ghost';
    button.setAttribute('data-open-analytics', '');
    button.textContent = 'Full analytics';
    actions.appendChild(button);
  }

  function handleClick(event) {
    const openBtn = event.target.closest('[data-open-analytics]');
    if (openBtn) { openPanel(); return; }
    const closeBtn = event.target.closest('[data-close-analytics]');
    if (closeBtn) { closePanel(); return; }
    const tabBtn = event.target.closest('[data-analytics-tab]');
    if (tabBtn && open) {
      activeTab = tabBtn.dataset.analyticsTab;
      const panel = document.getElementById('tb-analytics-panel');
      if (panel) queueTabRender(panel);
    }
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.tb-an-panel{margin-top:20px;padding-top:20px;border-top:1px solid var(--line);outline:none}' +
      '.tb-an-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:14px}' +
      '.tb-an-head h3{font-family:"Source Serif 4",serif;color:var(--ink);font-size:21px;margin:2px 0}' +
      '.tb-an-tabs{display:flex;gap:6px;overflow-x:auto;margin-bottom:16px;-webkit-overflow-scrolling:touch}' +
      '.tb-an-tab{flex:0 0 auto;padding:8px 13px;border-radius:8px;border:1px solid var(--line);background:var(--card);font:600 12.5px "Work Sans",sans-serif;color:var(--muted);cursor:pointer;white-space:nowrap}' +
      '.tb-an-tab.active{background:#6656b5;color:#fff;border-color:#6656b5}' +
      '.tb-an-desc{color:var(--muted);font-size:12.5px;line-height:1.55;margin:0 0 14px}' +
      '.tb-an-label{font:700 11px "Work Sans",sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}' +
      '.tb-an-ring-wrap{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:12px}' +
      '.tb-an-ring{--p:0;width:110px;height:110px;flex:0 0 auto;border-radius:50%;display:grid;place-content:center;text-align:center;background:conic-gradient(#6656b5 calc(var(--p)*1%),var(--line) 0);position:relative}' +
      '.tb-an-ring:before{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--card)}' +
      '.tb-an-ring strong,.tb-an-ring span{position:relative}.tb-an-ring strong{font-size:25px;color:var(--ink)}.tb-an-ring span{font-size:9px;color:var(--muted);text-transform:uppercase}' +
      '.tb-an-stat-row{display:flex;flex-wrap:wrap;gap:9px;flex:1;min-width:220px}' +
      '.tb-an-stat{flex:1;min-width:100px;padding:11px;border:1px solid var(--line);border-radius:9px;background:var(--card);text-align:center}' +
      '.tb-an-stat b{display:block;color:var(--ink);font-size:19px}.tb-an-stat span{color:var(--muted);font-size:10px}' +
      '.tb-an-two{display:grid;grid-template-columns:1fr 1fr;gap:16px}' +
      '.tb-an-radar{width:100%;max-width:220px;display:block;margin:0 auto}' +
      '.tb-an-radar-grid{fill:none;stroke:var(--line);stroke-width:1}' +
      '.tb-an-radar-weight{fill:color-mix(in srgb,var(--muted) 18%,transparent);stroke:var(--muted);stroke-width:1}' +
      '.tb-an-radar-mastery{fill:color-mix(in srgb,#6656b5 22%,transparent);stroke:#6656b5;stroke-width:1.5}' +
      '.tb-an-radar-axis{cursor:pointer;outline:none}' +
      '.tb-an-radar-axis .tb-an-radar-hit{fill:transparent}' +
      '.tb-an-radar-axis:hover text,.tb-an-radar-axis:focus-visible text{fill:#6656b5;font-weight:700}' +
      '.tb-an-radar-axis:focus-visible .tb-an-radar-hit{fill:color-mix(in srgb,#6656b5 12%,transparent);stroke:#6656b5;stroke-width:1}' +
      '.tb-an-radar-caption{min-height:15px;text-align:center;font-size:11px;color:var(--muted);margin:8px 0 0}' +
      '.tb-an-legend{display:flex;gap:14px;justify-content:center;margin-top:6px;font-size:11px;color:var(--muted)}' +
      '.tb-an-legend span{display:flex;align-items:center;gap:5px}' +
      '.tb-an-swatch{width:10px;height:10px;border-radius:3px;display:inline-block}.tb-an-swatch.weight{background:var(--muted)}.tb-an-swatch.mastery{background:#6656b5}' +
      '.tb-an-leverage{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:8px}' +
      '.tb-an-leverage li{display:flex;align-items:center;gap:9px;padding:9px 10px;border:1px solid var(--line);border-radius:8px;background:var(--tint);font-size:12.5px}' +
      '.tb-an-rank{width:20px;height:20px;border-radius:50%;background:#6656b5;color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;flex:0 0 auto}' +
      '.tb-an-lev-name{flex:1;color:var(--ink)}' +
      '.tb-pill{padding:3px 8px;border-radius:999px;font-size:10.5px;font-weight:700;white-space:nowrap}' +
      '.tb-pill.red{background:color-mix(in srgb,#c0453f 15%,var(--card));color:#c0453f}' +
      '.tb-pill.amber{background:color-mix(in srgb,#b7791f 15%,var(--card));color:#b7791f}' +
      '.tb-pill.green{background:color-mix(in srgb,#1f9d6b 15%,var(--card));color:#1f9d6b}' +
      '.tb-an-domain-list{display:grid;gap:12px;margin-bottom:14px}' +
      '.tb-an-domain-row{padding:11px;border:1px solid var(--line);border-radius:9px;background:var(--card)}' +
      '.tb-an-domain-head{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:12.5px;color:var(--ink);margin-bottom:7px}' +
      '.tb-an-domain-head i{color:var(--muted);font-style:normal;font-size:10.5px}' +
      '.tb-an-bar-track{height:8px;border-radius:999px;background:var(--tint);overflow:hidden}' +
      '.tb-an-bar-fill{height:100%;border-radius:999px}' +
      '.tb-an-bar-fill.red{background:#c0453f}.tb-an-bar-fill.amber{background:#b7791f}.tb-an-bar-fill.green{background:#1f9d6b}' +
      '.tb-an-domain-sub{display:flex;justify-content:space-between;margin-top:6px;font-size:10.5px;color:var(--muted)}' +
      '.tb-an-spark,.tb-an-margin{width:100%;height:140px;display:block}' +
      '.tb-an-zero{stroke:var(--line);stroke-width:1;stroke-dasharray:3 3}' +
      '.tb-an-heat{display:grid;grid-template-columns:repeat(14,1fr);gap:3px}' +
      '.tb-an-heat-cell{aspect-ratio:1;border-radius:3px;display:block;background:var(--tint)}' +
      '.tb-an-heat-cell.l1{background:color-mix(in srgb,#6656b5 25%,var(--tint))}' +
      '.tb-an-heat-cell.l2{background:color-mix(in srgb,#6656b5 48%,var(--tint))}' +
      '.tb-an-heat-cell.l3{background:color-mix(in srgb,#6656b5 72%,var(--tint))}' +
      '.tb-an-heat-cell.l4{background:#6656b5}' +
      '.tb-an-session-list{display:grid;gap:8px}' +
      '.tb-an-session-row{display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;font-size:11.5px;color:var(--muted)}' +
      '.tb-an-stack{display:flex;height:9px;border-radius:999px;overflow:hidden;background:var(--tint)}' +
      '.tb-an-stack .new{background:#6656b5}.tb-an-stack .rep{background:var(--muted)}' +
      '.tb-an-session-count{white-space:nowrap}' +
      '.tb-an-hist{display:flex;align-items:flex-end;gap:8px;height:150px;padding-top:10px}' +
      '.tb-an-hist-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:6px}' +
      '.tb-an-hist-bar{width:100%;border-radius:6px 6px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;min-height:4px}' +
      '.tb-an-hist-bar b{color:#fff;font-size:11px}' +
      '.tb-an-hist-bar.red{background:#c0453f}.tb-an-hist-bar.green{background:#1f9d6b}' +
      '.tb-an-hist-col span{font-size:9.5px;color:var(--muted)}' +
      '.tb-an-empty{color:var(--muted);font-size:12.5px;padding:14px;border:1px dashed var(--line);border-radius:9px;text-align:center}' +
      '@media(max-width:820px){.tb-an-two{grid-template-columns:1fr}}' +
      '@media(max-width:560px){.tb-an-head{flex-direction:column}.tb-an-heat{grid-template-columns:repeat(10,1fr)}}';
    document.head.appendChild(style);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      ensureButton();
      const panel = document.getElementById('tb-analytics-panel');
      const masteryOwnedPanel = document.getElementById('tb-adaptive-panel');
      if (panel && !panel.hidden && masteryOwnedPanel && !masteryOwnedPanel.hidden && masteryOwnedPanel.innerHTML) {
        closePanel();
        return;
      }
      // mastery.js's refreshDashboard() removes and rebuilds #tb-adaptive-mastery
      // (our panel's parent) every time an adaptive session completes. Read the
      // real DOM instead of trusting the "open" flag, or a stale true would
      // silently recreate and show the panel the user never asked to reopen.
      if (panel && !panel.hidden) renderPanel();
      else open = false;
    });
  }

  function initialize() {
    ensureStyles();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;
    document.addEventListener('click', handleClick);
    /* Mutation observation alone misses a synced ledger update when the
       dashboard DOM itself has not changed. These events make readiness,
       counts, and the radar refresh immediately after a local save or a
       phone/laptop reconciliation. */
    ['tb:learning-updated', 'tb:learning-recorded', 'upskill-test-learning-synced', 'upskill-test-progress-synced', 'tb:exam-changed'].forEach(function (name) {
      document.addEventListener(name, schedule);
    });
    window.addEventListener('storage', function (event) {
      if (event.key === STORE_KEY || event.key === 'tb-learning-events-v2') schedule();
    });
    new MutationObserver(function (mutations) {
      /* Rendering the panel changes its own children. Observing those changes
         and then rendering again caused a permanent requestAnimationFrame
         loop, which continually replaced the radar and made it appear stale
         or untappable. Only outside changes should trigger a refresh. */
      const panel = document.getElementById('tb-analytics-panel');
      const external = mutations.some(function (mutation) {
        return !(panel && (mutation.target === panel || panel.contains(mutation.target)));
      });
      if (external) schedule();
    }).observe(overview, { childList: true, subtree: true });
    schedule();
  }

  window.__TBAnalyticsDashboard = {
    domainStats: domainStats,
    topLeverage: topLeverage,
    readinessSummary: readinessSummary,
    learningSummary: learningSummary,
    sessionTrend: sessionTrend,
    studyHeatmap: studyHeatmap,
    examAttemptSeries: examAttemptSeries,
    latestExamDomainBreakdown: latestExamDomainBreakdown,
    scoreBuckets: scoreBuckets,
    open: openPanel,
    close: closePanel,
    setTab: function (tab) {
      activeTab = tab;
      if (!open) return;
      const panel = document.getElementById('tb-analytics-panel');
      if (panel) queueTabRender(panel);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

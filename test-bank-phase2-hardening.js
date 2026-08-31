(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STORE_KEY = 'tb-attempt-feedback-v2';
  const STYLE_ID = 'tb-phase2-hardening-styles';
  const STOP_WORDS = new Set('a an and are as at be by for from has have how in into is it its of on or that the their then this to was were what when which who why will with'.split(' '));

  let attemptId = null;
  let attemptStartedAt = null;
  let activeStem = '';
  let activeSince = 0;
  let frozenTimes = Object.create(null);
  let scheduled = false;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* This module observes the result subtree. Assigning the same text still
     creates a child-list mutation, so writes must be idempotent. */
  function setTextIfChanged(node, value) {
    const next = String(value == null ? '' : value);
    if (node && node.textContent !== next) node.textContent = next;
  }

  function setHtmlIfChanged(node, value) {
    const next = String(value == null ? '' : value);
    if (node && node.innerHTML !== next) node.innerHTML = next;
  }

  function stripHtml(value) {
    const node = document.createElement('div');
    node.innerHTML = String(value == null ? '' : value);
    return (node.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function hash(value) {
    let h = 2166136261;
    String(value || '').split('').forEach(function (c) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); });
    return (h >>> 0).toString(36);
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

  function allQuestions() {
    const helper = registry();
    if (helper && typeof helper.questionsFor === 'function') return helper.questionsFor(examId());
    const e = exam();
    const seen = new Set();
    const out = [];
    function add(q) {
      if (!q || !q.stem) return;
      const id = questionId(q);
      if (seen.has(id)) return;
      seen.add(id);
      out.push(q);
    }
    if (e && e.sets) Object.keys(e.sets).forEach(function (key) { (e.sets[key] || []).forEach(add); });
    if (e && e.bank) e.bank.forEach(add);
    return out;
  }

  function questionByIdentity(identity, legacyStem) {
    const helper = registry();
    if (helper && typeof helper.find === 'function' && identity) {
      const found = helper.find(examId(), identity);
      if (found) return found;
    }
    return allQuestions().find(function (q) { return questionId(q) === identity || q.stem === legacyStem || q.stem === identity; }) || null;
  }

  function questionByStem(stem) {
    return questionByIdentity(stem, stem);
  }

  function readStore() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY));
      return data && typeof data === 'object' ? data : { attempts: {} };
    } catch (error) {
      return { attempts: {} };
    }
  }

  function writeStore(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (error) {}
  }

  function ensureAttempt() {
    if (attemptId) return attemptId;
    attemptStartedAt = Date.now();
    attemptId = examId() + '-' + attemptStartedAt.toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    const data = readStore();
    data.attempts = data.attempts || {};
    data.attempts[attemptId] = data.attempts[attemptId] || { examId: examId(), startedAt: attemptStartedAt, updatedAt: attemptStartedAt, errors: {}, times: {} };
    writeStore(data);
    return attemptId;
  }

  function currentAttempt() {
    const data = readStore();
    return data.attempts && attemptId ? data.attempts[attemptId] : null;
  }

  function saveAttempt(update) {
    ensureAttempt();
    const data = readStore();
    data.attempts = data.attempts || {};
    const record = data.attempts[attemptId] || { examId: examId(), startedAt: attemptStartedAt, errors: {}, times: {} };
    update(record);
    record.updatedAt = Date.now();
    data.attempts[attemptId] = record;
    writeStore(data);
  }

  function commitTime() {
    if (!activeStem || !activeSince || document.hidden) return;
    const elapsed = Date.now() - activeSince;
    if (elapsed >= 250) frozenTimes[activeStem] = (frozenTimes[activeStem] || 0) + elapsed;
    activeSince = Date.now();
  }

  function trackQuestion() {
    const overview = document.getElementById(OVERVIEW_ID);
    const quiz = overview && overview.querySelector('.tb-quiz');
    const stemNode = quiz && !quiz.closest('#' + FEEDBACK_ID) ? quiz.querySelector('.tb-stem') : null;
    const nextStem = stemNode ? stemNode.textContent.trim() : '';
    const nextQuestion = nextStem ? questionByIdentity(quiz.dataset.questionId || stemNode.dataset.questionId || nextStem, nextStem) : null;
    const nextId = nextQuestion ? questionId(nextQuestion) : nextStem;
    if (nextId && nextId !== activeStem) {
      commitTime();
      ensureAttempt();
      activeStem = nextId;
      activeSince = Date.now();
    } else if (!nextStem && activeStem) {
      commitTime();
      saveAttempt(function (record) { record.times = Object.assign({}, frozenTimes); record.completedAt = Date.now(); });
      activeStem = '';
      activeSince = 0;
    }
  }

  function formatTime(ms) {
    if (!ms || ms < 1000) return 'Not reliably tracked';
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return seconds + ' sec';
    return Math.floor(seconds / 60) + ' min' + (seconds % 60 ? ' ' + (seconds % 60) + ' sec' : '');
  }

  function keyPoint(question) {
    if (question && question.keyPoint) return stripHtml(question.keyPoint);
    const text = stripHtml(question && question.why);
    if (!text) return 'A reviewed learning point is not available for this question.';
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    return sentences[0].trim();
  }

  function conceptId(question) {
    if (question && (question.conceptId || question.learningObjective)) return String(question.conceptId || question.learningObjective);
    const words = stripHtml((question && question.stem) + ' ' + (question && question.why)).toLowerCase().match(/[a-z][a-z0-9-]{3,}/g) || [];
    const ranked = words.filter(function (word) { return !STOP_WORDS.has(word); });
    return (question && question.sub ? question.sub : 'general') + ':' + Array.from(new Set(ranked)).slice(0, 4).join('-');
  }

  function testTakingCheck(question) {
    if (question && question.trap) return { title: 'Reviewed exam trap', text: stripHtml(question.trap), reviewed: true };
    const stem = String(question && question.stem || '');
    const qualifier = stem.match(/\b(EXCEPT|NOT|LEAST|MOST|BEST|FIRST|PRIMARY|INCORRECT|CORRECTLY)\b/i);
    if (qualifier) return { title: 'Stem-reading check', text: 'The controlling word is “' + qualifier[1].toUpperCase() + '.” Evaluate every option against that exact qualifier before answering.', reviewed: false };
    if (/\bcalculate|compute|approximately|probability|standard deviation|variance|cpk?|ppk?|dpmo|dpu|npv|irr|yield\b/i.test(stem)) {
      return { title: 'Calculation check', text: 'Identify the requested output and units, select the governing formula, then verify that the computed result answers the exact question asked.', reviewed: false };
    }
    return { title: 'Decision-rule check', text: 'Match each condition in the stem to the definition or decision rule stated in the stored explanation before choosing an option.', reviewed: false };
  }

  function optionRationale(question, index, selectedIndex) {
    const explicit = question && question.distractors && (Array.isArray(question.distractors) ? question.distractors[index] : question.distractors[index] || question.distractors[String(index)]);
    if (explicit) return { text: stripHtml(explicit), reviewed: true };
    const correct = question.options[question.answer];
    const evidence = keyPoint(question);
    const selected = index === selectedIndex ? ' This was your selected option.' : '';
    return {
      text: selected + ' The stored answer key identifies “' + correct + '” as correct. The controlling evidence is: “' + evidence + '” This option is not supported by that stated rule. An option-specific expert rationale has not been stored.',
      reviewed: false
    };
  }

  function selectedIndex(card) {
    const selected = card.querySelector('.tb-review-option.is-selected .tb-answer-letter');
    return selected ? selected.textContent.trim().charCodeAt(0) - 65 : null;
  }

  function enhanceCard(card) {
    const stemNode = card.querySelector('.tb-review-stem');
    if (!stemNode) return;
    const q = questionByIdentity(card.dataset.questionId || stemNode.textContent.trim(), stemNode.textContent.trim());
    if (!q) return;
    if (!card.dataset.questionId) card.dataset.questionId = questionId(q);

    const point = card.querySelector('.tb-key-point');
    setTextIfChanged(point, keyPoint(q));

    const trap = card.querySelector('.tb-exam-trap');
    if (trap) {
      const check = testTakingCheck(q);
      setTextIfChanged(trap, check.text);
      const label = trap.parentElement && trap.parentElement.querySelector('.tb-deep-label');
      setTextIfChanged(label, check.title);
    }

    const details = card.querySelector('.tb-distractor-analysis');
    if (details) {
      const summary = details.querySelector('summary');
      setTextIfChanged(summary, 'Option-by-option evidence check');
      const rows = details.querySelectorAll('.tb-distractor-row');
      const wrongIndices = q.options.map(function (_, i) { return i; }).filter(function (i) { return i !== q.answer; });
      rows.forEach(function (row, rowIndex) {
        const index = wrongIndices[rowIndex];
        const reason = optionRationale(q, index, selectedIndex(card));
        const p = row.querySelector('p');
        const small = row.querySelector('small');
        setTextIfChanged(p, reason.text);
        setTextIfChanged(small, reason.reviewed ? 'Expert-reviewed option rationale' : 'Grounded evidence check; option-specific expert rationale pending');
      });
      const note = details.querySelector('.tb-accuracy-note');
      setHtmlIfChanged(note, '<strong>Accuracy standard:</strong> the simulator distinguishes expert-reviewed option rationales from grounded evidence checks. It never presents a generic fallback as an expert-reviewed explanation.');
    }

    const time = card.querySelector('.tb-deep-summary strong');
    setTextIfChanged(time, formatTime(frozenTimes[questionId(q)] || 0));

    const practice = card.querySelector('[data-practice-similar]');
    if (practice) {
      setTextIfChanged(practice, q.conceptId || q.learningObjective ? 'Practice 5 similar questions' : 'Practice 5 questions from this subtopic');
      practice.dataset.conceptId = conceptId(q);
      practice.title = q.conceptId || q.learningObjective ? 'Matched by reviewed concept metadata' : 'Matched by Body of Knowledge subtopic because reviewed concept metadata is not available';
    }

    card.querySelectorAll('[data-report-question]').forEach(function (button) {
      button.setAttribute('aria-expanded', String(!button.parentElement.nextElementSibling.hidden));
    });
  }

  function classificationSummary() {
    const host = document.getElementById('tb-error-summary');
    if (!host) return;
    const record = currentAttempt();
    const errors = record && record.errors ? Object.values(record.errors) : [];
    if (!errors.length) {
      setTextIfChanged(host, 'Classify missed questions to separate knowledge, calculation, reading, and time-management causes for this attempt.');
      return;
    }
    const counts = {};
    errors.forEach(function (value) { counts[value] = (counts[value] || 0) + 1; });
    setHtmlIfChanged(host, '<strong>' + errors.length + ' mistakes classified for this attempt:</strong> ' + Object.keys(counts).map(function (key) { return esc(key.replace(/-/g, ' ')) + ' (' + counts[key] + ')'; }).join(' · '));
  }

  function errorKeysForCard(card) {
    const stem = card && card.querySelector('.tb-review-stem');
    const text = stem ? stem.textContent.trim() : '';
    const question = questionByIdentity(card && card.dataset.questionId || text, text);
    return { id: question ? questionId(question) : (card && card.dataset.questionId || hash(text)), legacy: hash(text) };
  }

  function syncClassifications() {
    ensureAttempt();
    const record = currentAttempt();
    document.querySelectorAll('#' + FEEDBACK_ID + ' .tb-review-card').forEach(function (card) {
      const select = card.querySelector('[data-error-class]');
      if (!select) return;
      const keys = errorKeysForCard(card);
      const value = record && record.errors ? (record.errors[keys.id] || record.errors[keys.legacy]) : '';
      if (select.value !== (value || '')) select.value = value || '';
    });
    classificationSummary();
  }

  function improveAccessibility() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback) return;
    let live = document.getElementById('tb-feedback-live');
    if (!live) {
      live = document.createElement('div');
      live.id = 'tb-feedback-live';
      live.className = 'tb-sr-only';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      feedback.prepend(live);
    }
    document.querySelectorAll('[data-report-question]').forEach(function (button) {
      const box = button.parentElement && button.parentElement.nextElementSibling;
      if (box) button.setAttribute('aria-expanded', String(!box.hidden));
    });
  }

  function apply() {
    scheduled = false;
    trackQuestion();
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback) return;
    ensureAttempt();
    // Own a distinct marker: attempt-history owns data-attempt-id, so writing the
    // same attribute here (with a different id scheme) made the two scripts ping-pong
    // and re-render every frame.
    if (feedback.dataset.hardeningAttempt !== String(attemptId)) feedback.dataset.hardeningAttempt = attemptId;
    feedback.querySelectorAll('.tb-review-card').forEach(enhanceCard);
    syncClassifications();
    improveAccessibility();
    const headerTime = feedback.querySelector('.tb-phase2-time strong');
    if (headerTime) {
      const values = Object.values(frozenTimes).filter(function (v) { return v >= 1000; });
      const nextHeaderTime = values.length ? formatTime(values.reduce(function (a, b) { return a + b; }, 0) / values.length) : 'Not reliably tracked';
      setTextIfChanged(headerTime, nextHeaderTime);
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.tb-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}.tb-review-card:focus,.tb-similar-practice:focus{outline:3px solid color-mix(in srgb,var(--teal) 55%,transparent);outline-offset:3px}';
    document.head.appendChild(style);
  }

  function initialize() {
    ensureStyles();
    document.addEventListener('visibilitychange', function () { if (document.hidden) commitTime(); else if (activeStem) activeSince = Date.now(); });
    document.addEventListener('change', function (event) {
      const select = event.target.closest('[data-error-class]');
      if (!select) return;
      const card = select.closest('.tb-review-card');
      if (!card) return;
      saveAttempt(function (record) {
        record.errors = record.errors || {};
        const keys = errorKeysForCard(card);
        if (select.value) record.errors[keys.id] = select.value;
        else delete record.errors[keys.id];
        if (keys.legacy !== keys.id) delete record.errors[keys.legacy];
      });
      classificationSummary();
    }, true);
    document.addEventListener('click', function (event) {
      const report = event.target.closest('[data-report-question]');
      if (report) requestAnimationFrame(function () { const box = report.parentElement && report.parentElement.nextElementSibling; if (box) report.setAttribute('aria-expanded', String(!box.hidden)); });
      const next = event.target.closest('[data-similar-next],[data-similar-check],[data-retry-next],[data-retry-check]');
      if (next) {
        const live = document.getElementById('tb-feedback-live');
        if (live) requestAnimationFrame(function () { const panel = next.closest('#tb-similar-practice,#tb-retry-panel'); if (panel) { live.textContent = panel.textContent.replace(/\s+/g, ' ').trim().slice(0, 300); panel.tabIndex = -1; panel.focus(); } });
      }
    }, true);
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
  }

  window.__TBPhase2Hardening = { keyPoint: keyPoint, testTakingCheck: testTakingCheck, optionRationale: optionRationale, conceptId: conceptId, formatTime: formatTime };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true }); else initialize();
}());

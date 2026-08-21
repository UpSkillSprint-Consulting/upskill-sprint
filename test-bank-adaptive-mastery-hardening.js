(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STORE_KEY = 'tb-adaptive-mastery-v1';
  const SESSION_KEY = 'tb-adaptive-session-v2';
  const DAY = 86400000;
  const SESSION_SIZE = 10;
  const MASTERY_THRESHOLD = 80;
  const STYLE_ID = 'tb-adaptive-hardening-styles';
  let session = null;
  let scheduled = false;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character];
    });
  }

  function chartHtml(chart) {
    return (window.__TB && window.__TB.renderQuestionChart) ? window.__TB.renderQuestionChart(chart) : '';
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

  function readStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      return parsed && parsed.version === 1 ? parsed : { version: 1, exams: {} };
    } catch (error) {
      return { version: 1, exams: {} };
    }
  }

  function examData(store) {
    return store && store.exams && store.exams[examId()] ? store.exams[examId()] : { questions: {}, attempts: [], sessions: [] };
  }

  function stateFor(question, data) {
    return data.questions && data.questions[hash(question.stem)] ? data.questions[hash(question.stem)] : {
      attempts: 0, correct: 0, incorrect: 0, unanswered: 0, streak: 0, lastSeenAt: 0, dueAt: 0, mastery: 0, sub: question.sub || 'general'
    };
  }

  function effectiveMastery(state, timestamp) {
    if (!state || !state.attempts) return 0;
    const accuracy = state.correct / state.attempts;
    const confidence = Math.min(state.attempts / 5, 1);
    const streak = Math.min(state.streak / 4, 1);
    const ageDays = state.lastSeenAt ? Math.max(0, (timestamp - state.lastSeenAt) / DAY) : 60;
    const recency = Math.max(0, 1 - ageDays / 45);
    const raw = (0.58 * accuracy + 0.24 * streak + 0.18 * recency) * (0.62 + 0.38 * confidence);
    return Math.max(0, Math.min(100, Math.round(raw * 100)));
  }

  function masterySummary(data, timestamp) {
    const questions = allQuestions();
    const attempted = questions.filter(function (question) { return stateFor(question, data).attempts > 0; });
    const attemptedMastery = attempted.length ? Math.round(attempted.reduce(function (sum, question) {
      return sum + effectiveMastery(stateFor(question, data), timestamp);
    }, 0) / attempted.length) : 0;
    const coverage = questions.length ? Math.round(attempted.length / questions.length * 100) : 0;
    const evidenceFactor = 0.35 + 0.65 * (coverage / 100);
    const readiness = Math.round(attemptedMastery * evidenceFactor);
    const mastered = attempted.filter(function (question) {
      const state = stateFor(question, data);
      return state.attempts >= 3 && effectiveMastery(state, timestamp) >= MASTERY_THRESHOLD;
    }).length;
    const due = attempted.filter(function (question) { return stateFor(question, data).dueAt <= timestamp; }).length;
    return { attemptedMastery: attemptedMastery, coverage: coverage, readiness: readiness, attempted: attempted.length, total: questions.length, mastered: mastered, due: due };
  }

  function subtopicBreakdown(data, timestamp) {
    const questions = allQuestions();
    const groups = {};
    questions.forEach(function (question) {
      const state = stateFor(question, data);
      if (!state.attempts) return;
      const sub = question.sub || 'general';
      if (!groups[sub]) groups[sub] = { sub: sub, attempted: 0, masterySum: 0 };
      groups[sub].attempted += 1;
      groups[sub].masterySum += effectiveMastery(state, timestamp);
    });
    return Object.keys(groups).sort().map(function (sub) {
      const group = groups[sub];
      return { sub: sub, attempted: group.attempted, avgMastery: Math.round(group.masterySum / group.attempted) };
    });
  }

  function seededShuffle(items, seedText) {
    const output = items.slice();
    let seed = parseInt(hash(seedText), 36) || 1;
    function random() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      const value = output[index];
      output[index] = output[swap];
      output[swap] = value;
    }
    return output;
  }

  function roundRobinBySubtopic(items, limit) {
    const groups = {};
    items.forEach(function (question) {
      const key = question.sub || 'general';
      groups[key] = groups[key] || [];
      groups[key].push(question);
    });
    const keys = Object.keys(groups);
    const output = [];
    let progress = true;
    while (output.length < limit && progress) {
      progress = false;
      keys.forEach(function (key) {
        if (output.length >= limit || !groups[key].length) return;
        output.push(groups[key].shift());
        progress = true;
      });
    }
    return output;
  }

  function balancedCandidates(limit, timestamp) {
    const data = examData(readStore());
    const questions = allQuestions();
    const due = [];
    const weak = [];
    const unseen = [];
    questions.forEach(function (question) {
      const state = stateFor(question, data);
      if (!state.attempts) unseen.push(question);
      else {
        const mastery = effectiveMastery(state, timestamp);
        if (state.dueAt <= timestamp) due.push(question);
        if (mastery < MASTERY_THRESHOLD) weak.push(question);
      }
    });
    due.sort(function (a, b) { return stateFor(a, data).dueAt - stateFor(b, data).dueAt; });
    weak.sort(function (a, b) { return effectiveMastery(stateFor(a, data), timestamp) - effectiveMastery(stateFor(b, data), timestamp); });

    const newQuota = unseen.length ? Math.max(1, Math.round(limit * 0.2)) : 0;
    const dueQuota = Math.min(due.length, Math.max(1, Math.round(limit * 0.5)));
    const weakQuota = Math.max(0, limit - newQuota - dueQuota);
    const chosen = [];
    const seen = new Set();
    function add(items, count) {
      roundRobinBySubtopic(items, count).forEach(function (question) {
        if (!question || seen.has(question.stem) || chosen.length >= limit) return;
        seen.add(question.stem);
        chosen.push(question);
      });
    }
    add(due, dueQuota);
    add(weak.filter(function (question) { return !seen.has(question.stem); }), weakQuota);
    add(seededShuffle(unseen, examId() + ':' + new Date(timestamp).toISOString().slice(0, 10)), newQuota);
    add(weak.filter(function (question) { return !seen.has(question.stem); }), limit);
    add(due.filter(function (question) { return !seen.has(question.stem); }), limit);
    add(seededShuffle(unseen.filter(function (question) { return !seen.has(question.stem); }), examId() + ':remainder'), limit);
    add(questions.filter(function (question) { return !seen.has(question.stem); }), limit);
    return chosen.slice(0, limit);
  }

  function saveSession() {
    if (!session) return;
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (error) {}
  }

  function clearSession() {
    session = null;
    try { localStorage.removeItem(SESSION_KEY); } catch (error) {}
  }

  function restoreSession() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!parsed || parsed.examId !== examId() || parsed.complete) return null;
      const map = new Map(allQuestions().map(function (question) { return [question.stem, question]; }));
      const items = (parsed.stems || []).map(function (stem) { return map.get(stem); }).filter(Boolean);
      if (!items.length) return null;
      parsed.items = items;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function panel() {
    return document.getElementById('tb-adaptive-panel');
  }

  function announce(message) {
    const live = document.getElementById('tb-feedback-live');
    if (live) live.textContent = message;
  }

  function renderQuestion() {
    const host = panel();
    if (!host || !session) return;
    const question = session.items[session.index];
    const selected = session.answers[session.index];
    const checked = session.checked[session.index];
    const data = examData(readStore());
    const currentMastery = effectiveMastery(stateFor(question, data), Date.now());
    const options = question.options.map(function (option, index) {
      let cls = 'tb-adaptive-option';
      if (selected === index) cls += ' selected';
      if (checked && index === question.answer) cls += ' correct';
      if (checked && selected === index && index !== question.answer) cls += ' wrong';
      return '<button type="button" class="' + cls + '" data-v2-option="' + index + '"' + (checked ? ' disabled' : '') + '><span>' + String.fromCharCode(65 + index) + '</span>' + esc(option) + '</button>';
    }).join('');
    const status = selected === question.answer ? 'correct' : 'incorrect';
    host.hidden = false;
    host.innerHTML = '<div class="tb-adaptive-head"><div><div class="tb-diag-kick">Adaptive practice · ' + (session.index + 1) + ' of ' + session.items.length + '</div><h3>' + esc(question.sub || 'General review') + '</h3><p class="tb-adaptive-rationale">Selected because it is ' + esc(session.reasons[session.index] || 'part of your balanced review plan') + '.</p></div><div class="tb-adaptive-mastery-chip">Current effective mastery <strong>' + currentMastery + '%</strong></div></div>' +
      '<div class="tb-adaptive-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + session.items.length + '" aria-valuenow="' + session.index + '"><span style="--p:' + Math.round(session.index / session.items.length * 100) + '"></span></div>' +
      chartHtml(question.chart) + '<div class="tb-adaptive-stem">' + esc(question.stem) + '</div><div class="tb-adaptive-options">' + options + '</div>' +
      (checked ? '<div class="tb-adaptive-feedback ' + status + '" role="status"><strong>' + (status === 'correct' ? 'Correct.' : 'Not yet. The correct answer is ' + String.fromCharCode(65 + question.answer) + '.') + '</strong><div>' + (question.why || 'A stored explanation is not available.') + '</div></div>' : '') +
      '<div class="tb-adaptive-actions">' + (!checked ? '<button type="button" class="btn btn-teal" data-v2-check' + (selected == null ? ' disabled' : '') + '>Check answer</button>' : '<button type="button" class="btn btn-teal" data-v2-next>' + (session.index === session.items.length - 1 ? 'Finish session' : 'Next question') + '</button>') + '<button type="button" class="tb-ghost" data-v2-pause>Pause and save</button></div>';
    host.tabIndex = -1;
    host.focus();
  }

  function reasonFor(question, data, timestamp) {
    const state = stateFor(question, data);
    if (!state.attempts) return 'new material selected for controlled coverage growth';
    if (state.dueAt <= timestamp) return 'due for spaced retrieval';
    if (effectiveMastery(state, timestamp) < MASTERY_THRESHOLD) return 'one of your lower-mastery questions';
    return 'needed to balance the session across subtopics';
  }

  function startSession(forceNew) {
    if (!forceNew) session = restoreSession();
    if (!session) {
      const timestamp = Date.now();
      const data = examData(readStore());
      const items = balancedCandidates(SESSION_SIZE, timestamp);
      session = {
        version: 2,
        examId: examId(),
        id: examId() + '-' + timestamp.toString(36),
        startedAt: timestamp,
        stems: items.map(function (question) { return question.stem; }),
        items: items,
        reasons: items.map(function (question) { return reasonFor(question, data, timestamp); }),
        index: 0,
        answers: {},
        checked: {},
        results: [],
        complete: false
      };
      saveSession();
    }
    renderQuestion();
    announce('Adaptive practice opened at question ' + (session.index + 1) + ' of ' + session.items.length + '.');
  }

  function completeSession() {
    if (window.__TBAdaptiveMastery && session.results.length) window.__TBAdaptiveMastery.recordResults(session.results, 'adaptive-practice-v2');
    session.complete = true;
    const host = panel();
    const correct = session.results.filter(function (result) { return result.status === 'correct'; }).length;
    if (host) {
      host.innerHTML = '<div class="tb-adaptive-summary"><div class="tb-ring big" style="--p:' + Math.round(correct / Math.max(session.items.length, 1) * 100) + '"><span>' + correct + '<small>/' + session.items.length + '</small></span></div><div><div class="tb-diag-kick">Adaptive session complete</div><h3>Your mastery map has been updated.</h3><p>This session combined due retrieval, low-mastery reinforcement, subtopic diversity, and controlled new material.</p><div class="tb-adaptive-actions"><button type="button" class="btn btn-teal" data-v2-new>Build another session</button><button type="button" class="tb-ghost" data-v2-close>Return to results</button></div></div></div>';
      host.tabIndex = -1;
      host.focus();
    }
    clearSession();
    refreshReliability();
    announce('Adaptive session complete. ' + correct + ' of ' + session.items.length + ' correct.');
  }

  function refreshReliability() {
    const dashboard = document.getElementById('tb-adaptive-mastery');
    if (!dashboard) return;
    const summary = masterySummary(examData(readStore()), Date.now());
    const inner = '<div class="tb-sec">Mastery confidence and coverage</div><div class="tb-reliability-grid"><div><strong>' + summary.attemptedMastery + '%</strong><span>mastery on attempted questions</span></div><div><strong>' + summary.coverage + '%</strong><span>question-bank coverage</span></div><div><strong>' + summary.readiness + '%</strong><span>coverage-adjusted readiness</span></div></div><p>Readiness discounts high scores based on a small evidence sample. Effective mastery also decays as retrieval becomes stale.</p><div class="tb-data-actions"><button type="button" class="tb-ghost" data-v2-export>Export learning data</button><button type="button" class="tb-ghost danger" data-v2-reset>Reset adaptive data</button></div>';
    // Idempotent: only touch the DOM when the rendered content actually changes.
    // (This function runs on every observed mutation; re-inserting an identical
    // block would retrigger the observers and create a re-render loop that makes
    // the results page unresponsive on mobile.)
    const sig = summary.attemptedMastery + '/' + summary.coverage + '/' + summary.readiness;
    let block = dashboard.querySelector('.tb-mastery-reliability');
    if (!block) {
      block = document.createElement('section');
      block.className = 'tb-mastery-reliability';
      block.innerHTML = inner;
      block.dataset.sig = sig;
      const grid = dashboard.querySelector('.tb-mastery-grid');
      if (grid) grid.insertAdjacentElement('afterend', block);
      else dashboard.appendChild(block);
    } else if (block.dataset.sig !== sig) {
      block.innerHTML = inner;
      block.dataset.sig = sig;
    }
    const ring = dashboard.querySelector('.tb-mastery-ring');
    if (ring) {
      if (ring.style.getPropertyValue('--p') !== String(summary.attemptedMastery)) ring.style.setProperty('--p', summary.attemptedMastery);
      const strong = ring.querySelector('strong');
      const label = ring.querySelector('span');
      const strongText = summary.attemptedMastery + '%';
      if (strong && strong.textContent !== strongText) strong.textContent = strongText;
      if (label && label.textContent !== 'attempted mastery') label.textContent = 'attempted mastery';
    }
  }

  function downloadJSONFallback(payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'upskillsprint-' + examId() + '-mastery-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
    announce('Adaptive learning data export prepared as JSON (PDF export was unavailable).');
  }

  function loadImageDataUrl(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) throw new Error('logo fetch failed');
      return response.blob();
    }).then(function (blob) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
  }

  const GREEN = [53, 156, 48];
  const CHARCOAL = [49, 55, 59];
  const GRAY = [110, 110, 110];
  const PAGE_RIGHT = 192;
  const MARGIN_X = 18;

  function sectionHeader(doc, title, y) {
    doc.setFillColor(GREEN[0], GREEN[1], GREEN[2]);
    doc.rect(MARGIN_X, y, PAGE_RIGHT - MARGIN_X, 8, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), MARGIN_X + 3, y + 5.6);
    doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
    return y + 8 + 8;
  }

  function buildMasteryReport(doc, summary, breakdown, examLabel, dateStr, reportId, logoDataUrl) {
    let y = 18;
    const textX = logoDataUrl ? MARGIN_X + 20 : MARGIN_X;
    if (logoDataUrl) {
      try { doc.addImage(logoDataUrl, 'PNG', MARGIN_X, y - 3, 15.4, 17.6); } catch (error) {}
    }
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
    doc.text('UpSkill Sprint Consulting', textX, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.text('Certification Prep & Engineering Education', textX, y + 9.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
    doc.text(examLabel + ' Mastery Report', PAGE_RIGHT, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.text('Generated ' + dateStr, PAGE_RIGHT, y + 9.5, { align: 'right' });

    y += 17;
    doc.setDrawColor(GREEN[0], GREEN[1], GREEN[2]);
    doc.setLineWidth(0.7);
    doc.line(MARGIN_X, y, PAGE_RIGHT, y);
    doc.setLineWidth(0.2);
    y += 10;

    y = sectionHeader(doc, 'Mastery confidence and coverage', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const metrics = [
      ['Mastery on attempted questions', summary.attemptedMastery + '%'],
      ['Question-bank coverage', summary.coverage + '% (' + summary.attempted + ' of ' + summary.total + ' questions)'],
      ['Coverage-adjusted readiness', summary.readiness + '%'],
      ['Questions mastered (3+ attempts, 80%+ mastery)', String(summary.mastered)],
      ['Questions due for review', String(summary.due)]
    ];
    metrics.forEach(function (row) {
      doc.text(row[0], MARGIN_X, y);
      doc.setFont('helvetica', 'bold');
      doc.text(row[1], PAGE_RIGHT, y, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 7;
    });
    y += 3;
    doc.setFontSize(8.5);
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.text('Readiness discounts high scores based on a small evidence sample.', MARGIN_X, y);
    y += 4.5;
    doc.text('Effective mastery also decays as retrieval becomes stale.', MARGIN_X, y);
    doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
    y += 12;

    if (breakdown.length) {
      y = sectionHeader(doc, 'Mastery by subtopic', y);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('Subtopic', MARGIN_X, y);
      doc.text('Attempted', 140, y, { align: 'right' });
      doc.text('Avg. mastery', PAGE_RIGHT, y, { align: 'right' });
      y += 4;
      doc.setDrawColor(215, 215, 215);
      doc.line(MARGIN_X, y, PAGE_RIGHT, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      breakdown.forEach(function (row, index) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        if (index % 2 === 0) {
          doc.setFillColor(245, 247, 245);
          doc.rect(MARGIN_X, y - 4.6, PAGE_RIGHT - MARGIN_X, 6.6, 'F');
        }
        doc.text(row.sub, MARGIN_X, y);
        doc.text(String(row.attempted), 140, y, { align: 'right' });
        doc.text(row.avgMastery + '%', PAGE_RIGHT, y, { align: 'right' });
        y += 7;
      });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);
      doc.setDrawColor(GREEN[0], GREEN[1], GREEN[2]);
      doc.setLineWidth(0.4);
      doc.line(MARGIN_X, 284, PAGE_RIGHT, 284);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
      doc.text(reportId, MARGIN_X, 289);
      doc.text('Page ' + page + ' of ' + pageCount, 105, 289, { align: 'center' });
      doc.text('upskillsprint.com  \u2022  For personal study use only', PAGE_RIGHT, 289, { align: 'right' });
    }
  }

  function exportData() {
    const timestamp = Date.now();
    const data = examData(readStore());
    const summary = masterySummary(data, timestamp);
    const breakdown = subtopicBreakdown(data, timestamp);
    const examLabel = examId().toUpperCase();
    const dateStr = new Date(timestamp).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const reportId = 'RPT-' + examId().toUpperCase() + '-' + timestamp.toString(36).toUpperCase();
    Promise.all([
      import('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm'),
      loadImageDataUrl('/assets/logo-icon.png').catch(function () { return null; })
    ]).then(function (results) {
      const doc = new results[0].jsPDF();
      buildMasteryReport(doc, summary, breakdown, examLabel, dateStr, reportId, results[1]);
      doc.save('upskillsprint-' + examId() + '-mastery-' + new Date(timestamp).toISOString().slice(0, 10) + '.pdf');
      announce('Adaptive learning data export prepared.');
    }).catch(function () {
      downloadJSONFallback({ exportedAt: new Date(timestamp).toISOString(), examId: examId(), mastery: data });
    });
  }

  function resetData(button) {
    if (button.dataset.confirmReset !== 'true') {
      button.dataset.confirmReset = 'true';
      button.textContent = 'Confirm reset adaptive data';
      announce('Press the reset button again to permanently clear adaptive learning data for this exam. Signed-in resets are synchronized across devices.');
      return;
    }
    const activeExamId = examId();
    const store = readStore();
    if (store.exams) delete store.exams[activeExamId];
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (error) {}
    try { localStorage.removeItem('tb-adaptive-' + activeExamId); } catch (error) {}
    clearSession();
    const dashboard = document.getElementById('tb-adaptive-mastery');
    if (dashboard) dashboard.remove();
    const accountSync = window.__TBAccountSync;
    const auth = window.UpskillAuth;
    const signedIn = Boolean(auth && typeof auth.getUser === 'function' && auth.getUser());
    if (signedIn && accountSync && typeof accountSync.resetAdaptiveExam === 'function') {
      accountSync.resetAdaptiveExam(activeExamId).then(function (result) {
        if (result && result.error) announce('Adaptive data was reset in this browser. Cross-device synchronization will retry automatically.');
      });
      announce('Adaptive learning data has been reset and will be removed from your synced devices.');
    } else {
      announce('Adaptive learning data has been reset in this browser.');
    }
  }

  function closePanel() {
    const host = panel();
    if (host) { host.hidden = true; host.innerHTML = ''; }
  }

  function handleClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-start-adaptive') || target.hasAttribute('data-restart-adaptive')) {
      event.preventDefault(); event.stopImmediatePropagation(); startSession(false); return;
    }
    if (target.dataset.v2Option != null && session && !session.checked[session.index]) {
      event.preventDefault(); event.stopImmediatePropagation(); session.answers[session.index] = Number(target.dataset.v2Option); saveSession(); renderQuestion(); return;
    }
    if (target.hasAttribute('data-v2-check') && session) {
      event.preventDefault(); event.stopImmediatePropagation();
      const question = session.items[session.index];
      const selected = session.answers[session.index];
      if (selected == null) return;
      session.checked[session.index] = true;
      session.results[session.index] = { question: question, selected: selected, status: selected === question.answer ? 'correct' : 'incorrect' };
      saveSession(); renderQuestion(); return;
    }
    if (target.hasAttribute('data-v2-next') && session) {
      event.preventDefault(); event.stopImmediatePropagation();
      if (session.index < session.items.length - 1) { session.index += 1; saveSession(); renderQuestion(); }
      else completeSession();
      return;
    }
    if (target.hasAttribute('data-v2-pause')) { event.preventDefault(); event.stopImmediatePropagation(); saveSession(); closePanel(); announce('Adaptive session saved.'); return; }
    if (target.hasAttribute('data-v2-new')) { event.preventDefault(); event.stopImmediatePropagation(); clearSession(); startSession(true); return; }
    if (target.hasAttribute('data-v2-close')) { event.preventDefault(); event.stopImmediatePropagation(); closePanel(); return; }
    if (target.hasAttribute('data-v2-export')) { event.preventDefault(); event.stopImmediatePropagation(); exportData(); return; }
    if (target.hasAttribute('data-v2-reset')) { event.preventDefault(); event.stopImmediatePropagation(); resetData(target); }
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.tb-mastery-reliability{margin-top:14px;padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--card)}.tb-reliability-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:10px 0}.tb-reliability-grid>div{padding:11px;border-radius:8px;background:var(--tint);text-align:center}.tb-reliability-grid strong{display:block;color:var(--ink);font-size:21px}.tb-reliability-grid span{display:block;color:var(--muted);font-size:10px}.tb-mastery-reliability p,.tb-adaptive-rationale{color:var(--muted);font-size:11.5px;line-height:1.5}.tb-data-actions{display:flex;flex-wrap:wrap;gap:8px}.tb-data-actions .danger{color:#a3332f}.tb-adaptive-progress{height:6px;border-radius:999px;background:var(--line);overflow:hidden;margin-bottom:13px}.tb-adaptive-progress span{display:block;height:100%;width:calc(var(--p)*1%);background:#6656b5;transition:width .2s ease}@media(max-width:620px){.tb-reliability-grid{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.tb-adaptive-progress span{transition:none!important}.tb-adaptive-panel{scroll-behavior:auto!important}}';
    document.head.appendChild(style);
  }

  function apply() {
    scheduled = false;
    ensureStyles();
    refreshReliability();
    const start = document.querySelector('[data-start-adaptive]');
    const saved = restoreSession();
    if (start && saved) {
      start.textContent = 'Resume adaptive practice';
      start.title = 'Resume question ' + (saved.index + 1) + ' of ' + saved.items.length;
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  function initialize() {
    ensureStyles();
    document.addEventListener('click', handleClick, true);
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
  }

  window.__TBAdaptiveHardening = {
    effectiveMastery: effectiveMastery,
    summary: function (timestamp) { return masterySummary(examData(readStore()), timestamp || Date.now()); },
    subtopicBreakdown: function (timestamp) { return subtopicBreakdown(examData(readStore()), timestamp || Date.now()); },
    balancedCandidates: function (limit, timestamp) { return balancedCandidates(limit || SESSION_SIZE, timestamp || Date.now()); },
    stateFor: stateFor,
    restoreSession: restoreSession,
    buildMasteryReport: buildMasteryReport
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STYLE_ID = 'tb-feedback-loop-styles';

  let scheduled = false;
  let attempt = null;
  let bypassSubmitCapture = false;
  let retryState = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character];
    });
  }

  function currentExamId() {
    const activeTile = document.querySelector('.tb-tile.active[data-exam]');
    return activeTile ? activeTile.dataset.exam : 'cssbb';
  }

  function currentExam() {
    const exams = window.__TB && window.__TB.EXAMS;
    return exams ? exams[currentExamId()] : null;
  }

  function registry() {
    return window.__TBQuestionRegistry || null;
  }

  function legacyStemHash(value) {
    let output = 2166136261;
    String(value || '').split('').forEach(function (character) {
      output ^= character.charCodeAt(0);
      output = Math.imul(output, 16777619);
    });
    return (output >>> 0).toString(36);
  }

  function questionId(examId, question) {
    const helper = registry();
    if (helper && typeof helper.idFor === 'function') return helper.idFor(examId, question);
    return question && question.questionId || question && question.qid || question && question.id || legacyStemHash(question && question.stem);
  }

  function allQuestions(exam) {
    const helper = registry();
    if (helper && exam === currentExam() && typeof helper.questionsFor === 'function') {
      return helper.questionsFor(currentExamId());
    }
    const output = [];
    const seen = new Set();

    function add(question) {
      if (!question || !question.stem) return;
      const id = questionId(currentExamId(), question);
      if (seen.has(id)) return;
      seen.add(id);
      output.push(question);
    }

    if (exam && exam.sets) {
      Object.keys(exam.sets).forEach(function (key) {
        (exam.sets[key] || []).forEach(add);
      });
    }
    if (exam && exam.bank) exam.bank.forEach(add);
    return output;
  }

  function findQuestion(exam, identity) {
    const helper = registry();
    if (helper && exam === currentExam() && typeof helper.find === 'function') {
      const found = helper.find(currentExamId(), identity);
      if (found) return found;
    }
    return allQuestions(exam).find(function (question) {
      return questionId(currentExamId(), question) === identity || question.stem === identity;
    }) || null;
  }

  function topicMeta(exam, subId) {
    let found = null;
    (exam && exam.bok ? exam.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (sub) {
        if (sub && typeof sub === 'object' && sub.id === subId) {
          found = {
            domain: domain.domain,
            domainName: window.__TB.DM[domain.domain] ? window.__TB.DM[domain.domain].name : domain.domain,
            subName: sub.name || sub.id,
            lesson: sub.lesson || '/lessons',
            lessonName: sub.lessonName || 'Review the related lesson'
          };
          return true;
        }
        return false;
      });
    });
    return found || {
      domain: '',
      domainName: 'Body of Knowledge',
      subName: subId || 'General review',
      lesson: '/lessons',
      lessonName: 'Browse related lessons'
    };
  }

  function quizTotal(overview) {
    return overview.querySelectorAll('.tb-navcell').length;
  }

  function ensureAttempt(overview) {
    const total = quizTotal(overview);
    if (!total) return null;
    const examId = currentExamId();
    if (!attempt || !attempt.active || attempt.examId !== examId || attempt.total !== total) {
      attempt = {
        active: true,
        examId,
        total,
        records: {},
        startedAt: Date.now()
      };
      retryState = null;
    }
    return attempt;
  }

  function captureCurrentQuestion(overview) {
    const quiz = overview.querySelector('.tb-quiz');
    if (!quiz || quiz.closest('#' + FEEDBACK_ID)) return;
    const currentNav = quiz.querySelector('.tb-navcell.cur');
    const stemNode = quiz.querySelector('.tb-stem');
    if (!currentNav || !stemNode) return;

    const state = ensureAttempt(overview);
    if (!state) return;

    const index = Number(currentNav.dataset.goto);
    const stem = stemNode.textContent.trim();
    const exam = currentExam();
    const question = findQuestion(exam, quiz.dataset.questionId || stem);
    const optionNodes = Array.from(quiz.querySelectorAll('.tb-opt'));
    const selected = optionNodes.find(function (node) { return node.classList.contains('sel'); });
    const selectedIndex = selected ? Number(selected.dataset.opt) : null;

    state.records[index] = {
      index,
      questionId: question ? questionId(state.examId, question) : '',
      question: question || {
        stem,
        options: optionNodes.map(function (node) {
          const text = node.querySelector('span:last-child');
          return text ? text.textContent.trim() : node.textContent.trim();
        }),
        answer: null,
        why: 'An explanation is not available for this question yet.',
        sub: ''
      },
      selected: selectedIndex,
      flagged: currentNav.classList.contains('flag')
    };
  }

  function captureAllQuestionsAndSubmit(overview) {
    ensureAttempt(overview);
    captureCurrentQuestion(overview);

    const total = quizTotal(overview);
    for (let index = 0; index < total; index += 1) {
      const nav = overview.querySelector('.tb-navcell[data-goto="' + index + '"]');
      if (!nav) continue;
      nav.click();
      captureCurrentQuestion(overview);
    }

    const submit = overview.querySelector('[data-submit]');
    if (submit) {
      bypassSubmitCapture = true;
      submit.click();
    }
  }

  function statusOf(record) {
    if (!record || record.selected == null) return 'unanswered';
    if (record.question && record.question.answer === record.selected) return 'correct';
    return 'incorrect';
  }

  function attemptRecords() {
    if (!attempt) return [];
    return Object.keys(attempt.records)
      .map(function (key) { return attempt.records[key]; })
      .sort(function (left, right) { return left.index - right.index; });
  }

  function resultCounts(records) {
    const counts = { all: records.length, correct: 0, incorrect: 0, unanswered: 0, flagged: 0, missed: 0 };
    records.forEach(function (record) {
      const status = statusOf(record);
      counts[status] += 1;
      if (status !== 'correct') counts.missed += 1;
      if (record.flagged) counts.flagged += 1;
    });
    return counts;
  }

  function answerText(question, index) {
    if (index == null) return 'Not answered';
    const option = question.options && question.options[index];
    return String.fromCharCode(65 + index) + '. ' + (option == null ? 'Answer unavailable' : option);
  }

  function filterRecords(records, filter) {
    if (filter === 'all') return records;
    if (filter === 'flagged') return records.filter(function (record) { return record.flagged; });
    if (filter === 'missed') return records.filter(function (record) { return statusOf(record) !== 'correct'; });
    return records.filter(function (record) { return statusOf(record) === filter; });
  }

  function reviewOptionHtml(question, record, option, index) {
    const correct = question.answer === index;
    const selected = record.selected === index;
    const classes = ['tb-review-option'];
    if (correct) classes.push('is-correct');
    if (selected && !correct) classes.push('is-wrong');
    if (selected) classes.push('is-selected');

    const tags = [];
    if (selected) tags.push('<span class="tb-answer-tag yours">Your answer</span>');
    if (correct) tags.push('<span class="tb-answer-tag correct">Correct answer</span>');

    return '<div class="' + classes.join(' ') + '">' +
      '<span class="tb-answer-letter">' + String.fromCharCode(65 + index) + '</span>' +
      '<span class="tb-answer-copy">' + esc(option) + '</span>' +
      '<span class="tb-answer-tags">' + tags.join('') + '</span>' +
      '</div>';
  }

  function reviewCardHtml(record) {
    const question = record.question;
    const status = statusOf(record);
    const meta = topicMeta(currentExam(), question.sub);
    const statusLabel = status === 'correct' ? 'Correct' : status === 'incorrect' ? 'Incorrect' : 'Unanswered';
    const options = (question.options || []).map(function (option, index) {
      return reviewOptionHtml(question, record, option, index);
    }).join('');

    return '<article class="tb-review-card" data-review-status="' + status + '" data-question-id="' + esc(record.questionId || questionId(currentExamId(), question)) + '">' +
      '<div class="tb-review-card-head">' +
        '<div><span class="tb-review-qno">Question ' + (record.index + 1) + '</span>' +
        '<span class="tb-review-topic">' + esc(meta.domainName) + ' &rsaquo; ' + esc(meta.subName) + '</span></div>' +
        '<div class="tb-review-badges">' +
        (Number.isInteger(question.set) ? '<span class="tb-review-setbadge">Set ' + question.set + '</span>' : '') +
        '<span class="tb-review-status ' + status + '">' + statusLabel + '</span>' +
        (record.flagged ? '<span class="tb-review-status flagged">Flagged</span>' : '') + '</div>' +
      '</div>' +
      '<div class="tb-review-stem">' + esc(question.stem) + '</div>' +
      '<div class="tb-review-options">' + options + '</div>' +
      '<div class="tb-answer-compare"><div><span>Your answer</span><strong>' + esc(answerText(question, record.selected)) + '</strong></div>' +
      '<div><span>Correct answer</span><strong>' + esc(answerText(question, question.answer)) + '</strong></div></div>' +
      '<div class="tb-explanation"><div class="tb-explanation-title">Why this is correct</div><div class="tb-explanation-copy">' + (question.why || 'An explanation is not available for this question yet.') + '</div></div>' +
      '<a class="tb-review-lesson" href="' + esc(meta.lesson) + '">Study: ' + esc(meta.lessonName) + '</a>' +
      '</article>';
  }

  const STATUS_GLYPH = { correct: '\u2713', incorrect: '\u2717', unanswered: '\u2013' };
  const STATUS_LABEL = { correct: 'correct', incorrect: 'incorrect', unanswered: 'skipped' };

  function gridCellHtml(record, currentIndex) {
    const status = statusOf(record);
    const classes = ['tb-review-navcell', status];
    if (record.index === currentIndex) classes.push('cur');
    const label = 'Question ' + (record.index + 1) + ', ' + STATUS_LABEL[status] +
      (record.flagged ? ', flagged' : '');
    return '<button type="button" class="' + classes.join(' ') + '" data-review-goto="' + record.index + '" aria-label="' + label + '">' +
      '<span class="tb-rnc-glyph" aria-hidden="true">' + STATUS_GLYPH[status] + '</span>' +
      '<span class="tb-rnc-num">' + (record.index + 1) + '</span>' +
      (record.flagged ? '<span class="tb-rnc-flag" aria-hidden="true">\u2691</span>' : '') +
      '</button>';
  }

  function paintReviewGrid(currentIndex) {
    const grid = document.getElementById('tb-review-grid');
    if (!grid) return;
    grid.innerHTML = attemptRecords().map(function (record) {
      return gridCellHtml(record, currentIndex);
    }).join('');
  }

  function clearReviewTabs(review) {
    Array.from(review.querySelectorAll('[data-review-tab]')).forEach(function (button) {
      button.classList.remove('on');
      button.setAttribute('aria-pressed', 'false');
    });
  }

  function renderReviewSingle(index) {
    const review = document.getElementById('tb-answer-review');
    const retry = document.getElementById('tb-retry-panel');
    const list = document.getElementById('tb-review-list');
    if (!review || !list) return;

    const record = attemptRecords().find(function (item) { return item.index === index; });
    if (!record) return;

    review.hidden = false;
    if (retry) retry.hidden = true;
    review.dataset.activeFilter = 'single';
    clearReviewTabs(review);
    paintReviewGrid(index);

    list.innerHTML = reviewCardHtml(record);
    const card = list.querySelector('.tb-review-card');
    if (card && typeof card.scrollIntoView === 'function') card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderReview(filter) {
    const review = document.getElementById('tb-answer-review');
    const retry = document.getElementById('tb-retry-panel');
    const list = document.getElementById('tb-review-list');
    if (!review || !list) return;

    const records = attemptRecords();
    const filtered = filterRecords(records, filter);
    review.hidden = false;
    if (retry) retry.hidden = true;
    review.dataset.activeFilter = filter;

    Array.from(review.querySelectorAll('[data-review-tab]')).forEach(function (button) {
      const active = button.dataset.reviewTab === filter;
      button.classList.toggle('on', active);
      button.setAttribute('aria-pressed', String(active));
    });

    paintReviewGrid(null);

    list.innerHTML = filtered.length
      ? filtered.map(reviewCardHtml).join('')
      : '<div class="tb-review-empty">No questions match this filter.</div>';

    if (typeof review.scrollIntoView === 'function') review.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function retryQuestionHtml(record, index, total) {
    const question = record.question;
    const meta = topicMeta(currentExam(), question.sub);
    const selected = retryState.answers[index];
    const checked = Boolean(retryState.checked[index]);
    const correct = selected === question.answer;
    const options = (question.options || []).map(function (option, optionIndex) {
      const classes = ['tb-retry-option'];
      if (selected === optionIndex) classes.push('selected');
      if (checked && question.answer === optionIndex) classes.push('correct');
      if (checked && selected === optionIndex && !correct) classes.push('wrong');
      return '<button type="button" class="' + classes.join(' ') + '" data-retry-opt="' + optionIndex + '"' + (checked ? ' disabled' : '') + '>' +
        '<span class="tb-answer-letter">' + String.fromCharCode(65 + optionIndex) + '</span><span>' + esc(option) + '</span></button>';
    }).join('');

    const feedback = checked
      ? '<div class="tb-retry-feedback ' + (correct ? 'correct' : 'wrong') + '"><strong>' + (correct ? 'Correct.' : 'Not quite.') + '</strong> ' +
        (correct ? 'You have corrected this question.' : 'The correct answer is ' + esc(answerText(question, question.answer)) + '.') +
        '<div class="tb-explanation-copy">' + (question.why || 'An explanation is not available for this question yet.') + '</div>' +
        '<a class="tb-review-lesson" href="' + esc(meta.lesson) + '">Study: ' + esc(meta.lessonName) + '</a></div>'
      : '';

    return '<div class="tb-retry-head"><div><div class="tb-diag-kick">Correction quiz</div><h3>Retry missed questions</h3></div>' +
      '<span class="tb-badge2">' + (index + 1) + ' of ' + total + '</span></div>' +
      '<div class="tb-retry-topic">' + esc(meta.domainName) + ' &rsaquo; ' + esc(meta.subName) + '</div>' +
      '<div class="tb-review-stem">' + esc(question.stem) + '</div>' +
      '<div class="tb-retry-options">' + options + '</div>' + feedback +
      '<div class="tb-retry-actions">' +
        (checked
          ? '<button type="button" class="btn btn-teal" data-retry-next>' + (index === total - 1 ? 'See correction results' : 'Next question') + '</button>'
          : '<button type="button" class="btn btn-teal" data-retry-check' + (selected == null ? ' disabled' : '') + '>Check answer</button>') +
        '<button type="button" class="tb-ghost" data-retry-return>Return to answer review</button>' +
      '</div>';
  }

  function retrySummaryHtml() {
    const total = retryState.items.length;
    let correct = 0;
    retryState.items.forEach(function (record, index) {
      if (retryState.answers[index] === record.question.answer) correct += 1;
    });
    const remaining = total - correct;

    return '<div class="tb-retry-summary"><div class="tb-ring big" style="--p:' + Math.round(correct / Math.max(total, 1) * 100) + ';--rc:' + (remaining ? '#b8791b' : 'var(--good,#1f9d6b)') + '"><span>' + correct + '<small>/' + total + '</small></span></div>' +
      '<div><div class="tb-diag-kick">Correction results</div><h3>' + (remaining ? 'Keep closing the remaining gaps.' : 'All missed questions corrected.') + '</h3>' +
      '<p>You answered ' + correct + ' of ' + total + ' correctly during the correction quiz.' + (remaining ? ' Review the remaining ' + remaining + ' question' + (remaining === 1 ? '' : 's') + ' and try again.' : ' Return to the answer review or continue with your weak-area practice plan.') + '</p></div></div>' +
      '<div class="tb-retry-actions">' +
        (remaining ? '<button type="button" class="btn btn-teal" data-retry-remaining>Retry remaining questions</button>' : '') +
        '<button type="button" class="tb-ghost" data-retry-return>Return to answer review</button></div>';
  }

  function renderRetry() {
    const review = document.getElementById('tb-answer-review');
    const panel = document.getElementById('tb-retry-panel');
    if (!panel || !retryState) return;
    if (review) review.hidden = true;
    panel.hidden = false;

    if (retryState.complete) {
      panel.innerHTML = retrySummaryHtml();
    } else {
      panel.innerHTML = retryQuestionHtml(retryState.items[retryState.index], retryState.index, retryState.items.length);
    }
    if (typeof panel.scrollIntoView === 'function') panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startRetryMissed() {
    const missed = filterRecords(attemptRecords(), 'missed');
    if (!missed.length) {
      renderReview('all');
      return;
    }
    retryState = { items: missed, index: 0, answers: {}, checked: {}, complete: false };
    renderRetry();
  }

  function retryRemaining() {
    const remaining = retryState.items.filter(function (record, index) {
      return retryState.answers[index] !== record.question.answer;
    });
    retryState = { items: remaining, index: 0, answers: {}, checked: {}, complete: false };
    renderRetry();
  }

  function feedbackMarkup(records) {
    const counts = resultCounts(records);
    return '<section id="' + FEEDBACK_ID + '" class="tb-feedback-loop" aria-labelledby="tb-feedback-title">' +
      '<div class="tb-feedback-head"><div><div class="tb-diag-kick">Essential feedback loop</div><h2 id="tb-feedback-title">Review what you missed and understand why.</h2>' +
      '<p>Your score identifies the gap. The answer review below shows the exact questions, your response, the correct response, the explanation, and the lesson that rebuilds the concept.</p></div>' +
      '<div class="tb-feedback-stats"><span><strong>' + counts.correct + '</strong> correct</span><span><strong>' + counts.incorrect + '</strong> incorrect</span><span><strong>' + counts.unanswered + '</strong> unanswered</span></div></div>' +
      '<div class="tb-feedback-actions"><button type="button" class="btn btn-teal" data-open-review="missed">Review missed questions</button>' +
      '<button type="button" class="tb-ghost" data-retry-missed>Retry missed questions</button>' +
      '<button type="button" class="tb-ghost" data-open-review="all">Review all answers</button></div>' +
      '<div id="tb-answer-review" class="tb-answer-review" hidden>' +
        '<div class="tb-review-toolbar"><div><div class="tb-sec">Question review</div><p>Filter the completed attempt and inspect each explanation.</p></div>' +
        '<div class="tb-review-tabs" role="group" aria-label="Filter reviewed questions">' +
          '<button type="button" data-review-tab="all">All <span>' + counts.all + '</span></button>' +
          '<button type="button" data-review-tab="missed">Missed <span>' + counts.missed + '</span></button>' +
          '<button type="button" data-review-tab="incorrect">Incorrect <span>' + counts.incorrect + '</span></button>' +
          '<button type="button" data-review-tab="unanswered">Unanswered <span>' + counts.unanswered + '</span></button>' +
          '<button type="button" data-review-tab="correct">Correct <span>' + counts.correct + '</span></button>' +
          '<button type="button" data-review-tab="flagged">Flagged <span>' + counts.flagged + '</span></button>' +
        '</div></div>' +
        '<div class="tb-review-gridwrap">' +
          '<div id="tb-review-grid" class="tb-review-grid" role="group" aria-label="Jump to any question"></div>' +
          '<div class="tb-review-gridkey" aria-hidden="true">' +
            '<span class="tb-gk correct"><i>\u2713</i> Correct</span>' +
            '<span class="tb-gk incorrect"><i>\u2717</i> Incorrect</span>' +
            '<span class="tb-gk unanswered"><i>\u2013</i> Skipped</span>' +
          '</div>' +
        '</div>' +
        '<div id="tb-review-list" class="tb-review-list"></div></div>' +
      '<div id="tb-retry-panel" class="tb-retry-panel" hidden></div>' +
      '</section>';
  }

  function ensureFeedbackStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .tb-feedback-loop{margin:0 0 26px;padding:20px;border:1px solid var(--teal);border-radius:12px;background:linear-gradient(180deg,color-mix(in srgb,var(--teal) 7%,var(--card)),var(--card))}
      .tb-feedback-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.tb-feedback-head h2{font-family:"Source Serif 4",serif;font-size:22px;color:var(--ink);margin:2px 0 7px}.tb-feedback-head p{max-width:70ch;margin:0;color:var(--muted);font-size:13.5px;line-height:1.55}
      .tb-feedback-stats{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.tb-feedback-stats span{min-width:84px;padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:var(--card);color:var(--muted);font-size:11.5px;text-align:center}.tb-feedback-stats strong{display:block;color:var(--ink);font-size:19px;font-family:"Source Serif 4",serif}
      .tb-feedback-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:17px}.tb-answer-review,.tb-retry-panel{margin-top:20px;padding-top:20px;border-top:1px solid var(--line);scroll-margin-top:18px}
      .tb-review-toolbar{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:14px}.tb-review-toolbar .tb-sec{margin-bottom:3px}.tb-review-toolbar p{margin:0;color:var(--muted);font-size:12.5px}.tb-review-tabs{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}.tb-review-tabs button{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 11px;font:inherit;font-size:12px;font-weight:600;cursor:pointer}.tb-review-tabs button.on{border-color:var(--teal);background:var(--teal);color:#fff}.tb-review-tabs span{opacity:.8;margin-left:3px}
      .tb-review-list{display:grid;gap:14px}.tb-review-card{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:18px}.tb-review-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:13px}.tb-review-qno{display:block;color:var(--ink);font-weight:700;font-size:14px}.tb-review-topic{display:block;color:var(--muted);font-size:11.5px;margin-top:2px}.tb-review-badges{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}.tb-review-setbadge{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;font-size:10.5px;font-weight:700;letter-spacing:.03em;color:var(--muted);background:var(--tint);border:1px solid var(--line)}.tb-review-status{border-radius:999px;padding:5px 9px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}.tb-review-status.correct{color:#14734f;background:rgba(31,157,107,.13)}.tb-review-status.incorrect{color:#a3332f;background:rgba(192,69,63,.13)}.tb-review-status.unanswered{color:#8b5c0c;background:rgba(184,121,27,.15)}.tb-review-status.flagged{color:#8b5c0c;background:rgba(184,121,27,.12);border:1px solid rgba(184,121,27,.3)}
      .tb-review-gridwrap{margin-bottom:16px}.tb-review-grid{display:flex;flex-wrap:wrap;gap:6px}
      .tb-review-navcell{position:relative;width:40px;min-height:42px;display:grid;grid-template-rows:auto auto;place-items:center;gap:1px;padding:4px 2px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit;cursor:pointer;transition:.12s}
      .tb-review-navcell .tb-rnc-glyph{font-size:12px;font-weight:700;line-height:1}.tb-review-navcell .tb-rnc-num{font-size:12px;font-weight:600;line-height:1}
      .tb-review-navcell .tb-rnc-flag{position:absolute;top:-5px;right:-4px;font-size:9px;color:#b8791b}
      .tb-review-navcell.correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 12%,var(--card));color:#14734f}
      .tb-review-navcell.incorrect{border-color:#c0453f;background:color-mix(in srgb,#c0453f 12%,var(--card));color:#a3332f}
      .tb-review-navcell.unanswered{border-color:#b8791b;background:color-mix(in srgb,#b8791b 15%,var(--card));color:#8b5c0c}
      .tb-review-navcell:hover{filter:brightness(.97)}.tb-review-navcell.cur{outline:2px solid var(--teal);outline-offset:2px}
      .tb-review-gridkey{display:flex;flex-wrap:wrap;gap:12px;margin-top:9px}.tb-review-gridkey .tb-gk{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--muted)}.tb-review-gridkey .tb-gk i{font-style:normal;width:17px;height:17px;display:grid;place-items:center;border-radius:5px;font-size:11px;font-weight:700}.tb-review-gridkey .tb-gk.correct i{color:#14734f;background:rgba(31,157,107,.15)}.tb-review-gridkey .tb-gk.incorrect i{color:#a3332f;background:rgba(192,69,63,.15)}.tb-review-gridkey .tb-gk.unanswered i{color:#8b5c0c;background:rgba(184,121,27,.18)}
      .tb-review-stem{color:var(--ink);font-size:16px;font-weight:600;line-height:1.5;margin-bottom:14px}.tb-review-options{display:grid;gap:8px}.tb-review-option{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:11px 12px;border:1px solid var(--line);border-radius:9px;background:var(--tint);color:var(--ink);font-size:13.5px}.tb-review-option.is-correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 9%,var(--card))}.tb-review-option.is-wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 8%,var(--card))}.tb-answer-letter{width:25px;height:25px;display:grid;place-items:center;border:1px solid var(--line);border-radius:7px;font-size:12px;font-weight:700}.tb-answer-tags{display:flex;flex-wrap:wrap;gap:5px;justify-content:flex-end}.tb-answer-tag{border-radius:999px;padding:3px 7px;font-size:9.5px;font-weight:700;white-space:nowrap}.tb-answer-tag.yours{background:rgba(59,111,176,.14);color:#315f99}.tb-answer-tag.correct{background:rgba(31,157,107,.14);color:#14734f}
      .tb-answer-compare{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.tb-answer-compare>div{padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:var(--tint)}.tb-answer-compare span{display:block;color:var(--muted);font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}.tb-answer-compare strong{display:block;color:var(--ink);font-size:13px;line-height:1.4}
      .tb-explanation{padding:13px 14px;border-left:3px solid var(--teal);border-radius:7px;background:color-mix(in srgb,var(--teal) 7%,var(--tint));margin-bottom:10px}.tb-explanation-title{color:var(--ink);font-size:12px;font-weight:700;margin-bottom:5px}.tb-explanation-copy{color:var(--muted);font-size:13px;line-height:1.55}.tb-explanation-copy b,.tb-explanation-copy strong{color:var(--ink)}.tb-review-lesson{display:inline-flex;color:var(--teal);font-size:12.5px;font-weight:700}.tb-review-empty{padding:25px;border:1px dashed var(--line);border-radius:10px;color:var(--muted);text-align:center}
      .tb-retry-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px}.tb-retry-head h3,.tb-retry-summary h3{font-family:"Source Serif 4",serif;color:var(--ink);font-size:21px;margin:2px 0}.tb-retry-topic{font-size:11.5px;color:var(--teal);font-weight:700;margin-bottom:10px}.tb-retry-options{display:grid;gap:9px}.tb-retry-option{display:flex;align-items:flex-start;gap:10px;width:100%;padding:12px 13px;border:1px solid var(--line);border-radius:10px;background:var(--tint);color:var(--ink);font:inherit;font-size:14px;text-align:left;cursor:pointer}.tb-retry-option:hover:not(:disabled),.tb-retry-option.selected{border-color:var(--teal)}.tb-retry-option.correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 9%,var(--card))}.tb-retry-option.wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 8%,var(--card))}.tb-retry-feedback{margin-top:12px;padding:13px 14px;border-radius:9px;font-size:13.5px;line-height:1.5}.tb-retry-feedback.correct{background:color-mix(in srgb,#1f9d6b 10%,var(--card));border:1px solid rgba(31,157,107,.35)}.tb-retry-feedback.wrong{background:color-mix(in srgb,#c0453f 8%,var(--card));border:1px solid rgba(192,69,63,.32)}.tb-retry-feedback .tb-explanation-copy{margin:7px 0}.tb-retry-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:15px}.tb-retry-summary{display:flex;align-items:center;gap:20px}.tb-retry-summary p{margin:5px 0 0;color:var(--muted);font-size:13.5px;line-height:1.55}
      html[data-theme="dark"] .tb-review-status.correct,html[data-theme="dark"] .tb-answer-tag.correct{color:#6ee7b7}html[data-theme="dark"] .tb-review-status.incorrect{color:#fca5a5}html[data-theme="dark"] .tb-review-status.unanswered,html[data-theme="dark"] .tb-review-status.flagged{color:#f0c36a}html[data-theme="dark"] .tb-answer-tag.yours{color:#93c5fd}
      html[data-theme="dark"] .tb-review-navcell.correct,html[data-theme="dark"] .tb-review-gridkey .tb-gk.correct i{color:#6ee7b7}html[data-theme="dark"] .tb-review-navcell.incorrect,html[data-theme="dark"] .tb-review-gridkey .tb-gk.incorrect i{color:#fca5a5}html[data-theme="dark"] .tb-review-navcell.unanswered,html[data-theme="dark"] .tb-review-gridkey .tb-gk.unanswered i{color:#f0c36a}
      @media(max-width:760px){.tb-feedback-head,.tb-review-toolbar,.tb-retry-summary{align-items:stretch;flex-direction:column}.tb-feedback-stats,.tb-review-tabs{justify-content:flex-start}.tb-answer-compare{grid-template-columns:1fr}.tb-review-option{grid-template-columns:auto minmax(0,1fr)}.tb-answer-tags{grid-column:1/-1;justify-content:flex-start}.tb-review-card{padding:15px}.tb-review-grid{gap:5px}.tb-review-navcell{width:38px;min-height:40px}}
    `;
    document.head.appendChild(style);
  }

  function renderFeedback(overview) {
    if (!attempt || !overview.querySelector('.tb-reshead') || overview.querySelector('#' + FEEDBACK_ID)) return;
    const records = attemptRecords();
    if (!records.length) return;

    ensureFeedbackStyles();
    const holder = document.createElement('div');
    holder.innerHTML = feedbackMarkup(records);
    const feedback = holder.firstElementChild;
    const resultHead = overview.querySelector('.tb-reshead');
    resultHead.insertAdjacentElement('afterend', feedback);
    attempt.active = false;
  }

  function handleFeedbackClick(event) {
    const target = event.target.closest('button, a');
    if (!target || !target.closest('#' + FEEDBACK_ID)) return;

    if (target.dataset.openReview) {
      renderReview(target.dataset.openReview);
      return;
    }
    if (target.dataset.reviewGoto != null) {
      renderReviewSingle(Number(target.dataset.reviewGoto));
      return;
    }
    if (target.dataset.reviewTab) {
      renderReview(target.dataset.reviewTab);
      return;
    }
    if (target.hasAttribute('data-retry-missed')) {
      startRetryMissed();
      return;
    }
    if (target.dataset.retryOpt != null && retryState && !retryState.checked[retryState.index]) {
      retryState.answers[retryState.index] = Number(target.dataset.retryOpt);
      renderRetry();
      return;
    }
    if (target.hasAttribute('data-retry-check') && retryState) {
      if (retryState.answers[retryState.index] == null) return;
      retryState.checked[retryState.index] = true;
      renderRetry();
      return;
    }
    if (target.hasAttribute('data-retry-next') && retryState) {
      if (retryState.index < retryState.items.length - 1) retryState.index += 1;
      else retryState.complete = true;
      renderRetry();
      return;
    }
    if (target.hasAttribute('data-retry-return')) {
      renderReview('missed');
      return;
    }
    if (target.hasAttribute('data-retry-remaining')) {
      retryRemaining();
    }
  }

  function enhance() {
    scheduled = false;
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;

    if (overview.querySelector('.tb-quiz') && !overview.querySelector('#' + FEEDBACK_ID)) {
      captureCurrentQuestion(overview);
    }

    renderFeedback(overview);
  }

  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(enhance);
  }

  function initialize() {
    ensureFeedbackStyles();
    scheduleEnhance();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;

    document.addEventListener('click', function (event) {
      const submit = event.target.closest('[data-submit]');
      if (submit && overview.contains(submit)) {
        if (bypassSubmitCapture) {
          bypassSubmitCapture = false;
        } else {
          event.preventDefault();
          event.stopImmediatePropagation();
          captureAllQuestionsAndSubmit(overview);
          return;
        }
      }
      handleFeedbackClick(event);
    }, true);

    const observer = new MutationObserver(scheduleEnhance);
    observer.observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());

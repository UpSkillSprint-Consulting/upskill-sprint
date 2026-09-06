(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STYLE_ID = 'tb-deep-feedback-styles';
  const STORAGE_KEY = 'tb-error-classifications-v1';
  const REPORT_EMAIL = 'skillsprintconsulting@gmail.com';
  const MIN_TRACK_MS = 200;

  const ERROR_CLASSES = [
    ['', 'Choose the main cause'],
    ['concept-gap', 'I did not know the concept'],
    ['similar-concepts', 'I confused similar concepts'],
    ['formula-selection', 'I selected the wrong formula'],
    ['calculation', 'I made a calculation error'],
    ['misread', 'I misread the question or qualifier'],
    ['changed-answer', 'I changed a correct answer'],
    ['guess', 'I guessed'],
    ['time', 'I ran out of time']
  ];

  let scheduled = false;
  let tracked = null;
  let mode = 'browse';
  let timesByQuestionId = Object.create(null);
  let similarState = null;
  let questionMap = Object.create(null);

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character];
    });
  }

  /* This module observes the entire results subtree. Assigning the same text
     is still a mutation, so the summary must not re-trigger its own observer. */
  function setTextIfChanged(node, value) {
    const next = String(value == null ? '' : value);
    if (node && node.textContent !== next) node.textContent = next;
  }

  function setHtmlIfChanged(node, value) {
    const next = String(value == null ? '' : value);
    if (node && node.innerHTML !== next) node.innerHTML = next;
  }

  function stripHtml(value) {
    const holder = document.createElement('div');
    holder.innerHTML = String(value == null ? '' : value);
    return (holder.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function hashText(value) {
    let hash = 2166136261;
    const text = String(value || '');
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function currentExamId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function currentExam() {
    const exams = window.__TB && window.__TB.EXAMS;
    return exams ? exams[currentExamId()] : null;
  }

  function registry() {
    return window.__TBQuestionRegistry || null;
  }

  function questionId(question) {
    const helper = registry();
    if (helper && typeof helper.idFor === 'function') return helper.idFor(currentExamId(), question);
    return question && question.questionId || question && question.qid || question && question.id || hashText(question && question.stem);
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
      const id = questionId(question);
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

  function findQuestion(identity, legacyStem) {
    const helper = registry();
    if (helper && typeof helper.find === 'function' && identity) {
      const found = helper.find(currentExamId(), identity);
      if (found) return found;
    }
    return allQuestions(currentExam()).find(function (question) {
      return questionId(question) === identity || question.stem === legacyStem || question.stem === identity;
    }) || null;
  }

  function topicMeta(question) {
    const exam = currentExam();
    let found = null;
    (exam && exam.bok ? exam.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (sub) {
        if (sub && typeof sub === 'object' && sub.id === question.sub) {
          const dm = window.__TB && window.__TB.DM && window.__TB.DM[domain.domain];
          found = {
            domainName: dm ? dm.name : domain.domain,
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
      domainName: 'Body of Knowledge',
      subName: question.sub || 'General review',
      lesson: '/lessons',
      lessonName: 'Browse related lessons'
    };
  }

  function extractKeyPoint(explanation) {
    if (window.__TB && window.__TB.firstFeedbackSentence) return window.__TB.firstFeedbackSentence(explanation);
    return stripHtml(explanation) || 'A stored learning point is not available for this question yet.';
  }
  function questionKeyPoint(question) {
    if (window.__TB && window.__TB.feedbackKeyPoint) return window.__TB.feedbackKeyPoint(question);
    return stripHtml(question && question.keyPoint) || extractKeyPoint(question && question.why);
  }
  function reviewQuestionContent(question) {
    if (window.__TB && window.__TB.renderQuestionContent) return window.__TB.renderQuestionContent(question, true);
    return '<div class="tb-review-stem">' + esc(question.stem) + '</div>';
  }

  function trapText(question) {
    if (question && typeof question.trap === 'string' && question.trap.trim()) return question.trap.trim();
    const stem = String(question && question.stem || '');
    const why = stripHtml(question && question.why || '');
    const calculation = /\b(calculate|computed?|equals?|approximately|probability|mean|standard deviation|variance|npv|irr|payback|yield|dpmo|dpu|cpk?|ppk?|rpn|takt|oee)\b/i.test(stem + ' ' + why);
    const qualifier = /\b(first|most|best|primary|least|except|not|incorrect|correctly)\b/i.test(stem);
    if (calculation) {
      return 'Check the requested quantity, units, and formula before calculating. Then compare the result with the validated solution rather than choosing the closest-looking number.';
    }
    if (qualifier) {
      return 'The stem contains a decision qualifier. Evaluate every option against that exact qualifier before choosing the most defensible answer.';
    }
    return 'Match every condition in the stem to the precise definition or decision rule in the validated explanation; familiar wording alone is not enough.';
  }

  function explicitDistractor(question, index) {
    if (window.__TB && window.__TB.explicitOptionRationale) return window.__TB.explicitOptionRationale(question, index);
    if (!question) return '';
    for (const source of [question.optionRationales, question.distractors]) {
      if (source && typeof source === 'object' && stripHtml(source[index])) return stripHtml(source[index]);
    }
    return '';
  }

  function answerText(question, index) {
    if (index == null) return 'Not answered';
    const option = question && question.options ? question.options[index] : null;
    return String.fromCharCode(65 + index) + '. ' + (option == null ? 'Answer unavailable' : option);
  }

  function distractorReason(question, index, selectedIndex) {
    const stored = explicitDistractor(question, index);
    if (stored) return { text: stored, validated: true };
    const correct = answerText(question, question.answer);
    if (index === selectedIndex) {
      return {
        text: 'This was your selection. It does not satisfy the rule, definition, or calculation established in the validated explanation. The supported answer is ' + correct + '.',
        validated: false
      };
    }
    return {
      text: 'This option is not supported by the validated answer and explanation. No option-specific rationale is stored, so the simulator does not invent one.',
      validated: false
    };
  }

  function readClassifications() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return value && typeof value === 'object' ? value : {};
    } catch (error) {
      return {};
    }
  }

  function identityFor(value) {
    if (value && typeof value === 'object') return questionId(value);
    const question = findQuestion(value, value);
    if (question) return questionId(question);
    return String(value || '');
  }

  function classificationKey(value) {
    return currentExamId() + ':' + identityFor(value);
  }

  function legacyClassificationKey(value) {
    const question = value && typeof value === 'object' ? value : findQuestion(value, value);
    const stem = question ? question.stem : value;
    return currentExamId() + ':' + hashText(stem);
  }

  function saveClassification(questionOrIdentity, value) {
    const data = readClassifications();
    const key = classificationKey(questionOrIdentity);
    const legacyKey = legacyClassificationKey(questionOrIdentity);
    if (value) data[key] = value;
    else delete data[key];
    if (legacyKey !== key) delete data[legacyKey];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (error) {}
    updateErrorSummary();
  }

  function classificationValue(questionOrIdentity) {
    const data = readClassifications();
    return data[classificationKey(questionOrIdentity)] || data[legacyClassificationKey(questionOrIdentity)] || '';
  }

  function formatDuration(milliseconds) {
    if (!milliseconds || milliseconds < 1000) return 'Under 1 sec';
    const seconds = Math.round(milliseconds / 1000);
    if (seconds < 60) return seconds + ' sec';
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return minutes + ' min' + (remainder ? ' ' + remainder + ' sec' : '');
  }

  function recordTime(questionOrIdentity, milliseconds) {
    const id = identityFor(questionOrIdentity);
    if (!id || !Number.isFinite(milliseconds) || milliseconds <= 0) return;
    timesByQuestionId[id] = (timesByQuestionId[id] || 0) + milliseconds;
  }

  function commitTracked(force) {
    if (!tracked) return;
    const elapsed = Date.now() - tracked.startedAt;
    if (force || elapsed >= MIN_TRACK_MS) recordTime(tracked.questionId || tracked.stem, elapsed);
    tracked = null;
  }

  function currentQuizQuestion() {
    const overview = document.getElementById(OVERVIEW_ID);
    const quiz = overview && overview.querySelector('.tb-quiz');
    if (!quiz || quiz.closest('#' + FEEDBACK_ID)) return null;
    const stem = quiz.querySelector('.tb-stem');
    const nav = quiz.querySelector('.tb-navcell.cur');
    if (!stem || !nav) return null;
    const text = stem.textContent.trim();
    const question = findQuestion(quiz.dataset.questionId || stem.dataset.questionId || text, text);
    return { stem: text, questionId: question ? questionId(question) : '', index: Number(nav.dataset.goto) };
  }

  function trackQuiz() {
    const current = currentQuizQuestion();
    const overview = document.getElementById(OVERVIEW_ID);
    const hasResults = Boolean(overview && overview.querySelector('.tb-reshead'));

    if (current) {
      if (mode !== 'quiz') {
        timesByQuestionId = Object.create(null);
        tracked = null;
        mode = 'quiz';
      }
      if (!tracked || tracked.questionId !== current.questionId || tracked.stem !== current.stem || tracked.index !== current.index) {
        commitTracked(false);
        tracked = { stem: current.stem, questionId: current.questionId, index: current.index, startedAt: Date.now() };
      }
      return;
    }

    if (hasResults) {
      commitTracked(true);
      mode = 'results';
    } else if (!document.getElementById(FEEDBACK_ID)) {
      commitTracked(false);
      mode = 'browse';
    }
  }

  function classificationOptions(selected) {
    return ERROR_CLASSES.map(function (item) {
      return '<option value="' + esc(item[0]) + '"' + (item[0] === selected ? ' selected' : '') + '>' + esc(item[1]) + '</option>';
    }).join('');
  }

  function statusFromCard(card) {
    return card.dataset.reviewStatus || 'unknown';
  }

  function selectedIndexFromCard(card) {
    const selected = card.querySelector('.tb-review-option.is-selected');
    if (!selected) return null;
    const letter = selected.querySelector('.tb-answer-letter');
    return letter ? letter.textContent.trim().charCodeAt(0) - 65 : null;
  }

  function deepBlocks(question, card, timeText) {
    const selectedIndex = selectedIndexFromCard(card);
    const keyPoint = questionKeyPoint(question);
    const trap = trapText(question);
    const distractors = (question.options || []).map(function (option, index) {
      if (index === question.answer) return '';
      const reason = distractorReason(question, index, selectedIndex);
      return '<div class="tb-distractor-row"><div class="tb-distractor-title"><span>' + String.fromCharCode(65 + index) + '</span>' + esc(option) + '</div>' +
        '<p>' + esc(reason.text) + '</p>' +
        '<small>' + (reason.validated ? 'Validated option-specific rationale' : 'Accuracy-safe fallback; no specific rationale was invented') + '</small></div>';
    }).join('');

    return '<div class="tb-deep-learning" data-deep-feedback="true">' +
      '<div class="tb-deep-summary"><div><span>Time on question</span><strong>' + esc(timeText) + '</strong></div><div><span>Feedback source</span><strong>Validated question bank</strong></div></div>' +
      '<div class="tb-learning-grid"><section><div class="tb-deep-label">Key learning point</div><p class="tb-key-point">' + esc(keyPoint) + '</p></section>' +
      '<section><div class="tb-deep-label">Common exam trap</div><p class="tb-exam-trap">' + esc(trap) + '</p></section></div>' +
      '<details class="tb-distractor-analysis"><summary>Why the other options are wrong</summary><div class="tb-distractor-list">' + distractors + '</div>' +
      '<p class="tb-accuracy-note"><strong>Accuracy standard:</strong> specific distractor explanations are displayed only when stored in the question bank. Otherwise the simulator uses a transparent, non-speculative fallback.</p></details>' +
      '</div>';
  }

  function missedControls(question, status) {
    if (status === 'correct') return '';
    const selected = classificationValue(question);
    return '<div class="tb-error-diagnosis"><label><span>Why did you miss this question?</span>' +
      '<select data-error-class data-question-key="' + esc(questionId(question)) + '">' + classificationOptions(selected) + '</select></label>' +
      '<p>Classifying the cause separates knowledge gaps from calculation, reading, and time-management errors.</p></div>';
  }

  function actionControls(question) {
    const key = questionId(question);
    questionMap[key] = question;
    return '<div class="tb-deep-actions"><button type="button" class="tb-ghost" data-practice-similar="' + key + '">Practice 5 similar questions</button>' +
      '<button type="button" class="tb-ghost" data-report-question="' + key + '">Report a question issue</button></div>' +
      '<div class="tb-report-box" data-report-box="' + key + '" hidden>' +
      '<label>Issue type<select data-report-type><option>Incorrect answer key</option><option>Unclear wording</option><option>Explanation concern</option><option>Duplicate question</option><option>Broken lesson link</option><option>Other</option></select></label>' +
      '<label>What should be reviewed?<textarea data-report-note rows="3" placeholder="Describe the issue without including private information."></textarea></label>' +
      '<button type="button" class="btn btn-teal" data-prepare-report="' + key + '">Prepare email report</button><a data-report-link hidden>Open email</a></div>';
  }

  function enhanceReviewCard(card) {
    if (card.hasAttribute('data-deep-enhanced')) return;
    const stemNode = card.querySelector('.tb-review-stem');
    if (!stemNode) return;
    const question = findQuestion(card.dataset.questionId || stemNode.textContent.trim(), stemNode.textContent.trim());
    if (!question) return;
    if (!card.dataset.questionId) card.dataset.questionId = questionId(question);
    card.setAttribute('data-deep-enhanced', 'true');
    const status = statusFromCard(card);
    const lesson = card.querySelector('.tb-review-lesson');
    const holder = document.createElement('div');
    holder.innerHTML = deepBlocks(question, card, formatDuration(timesByQuestionId[questionId(question)] || 0)) + missedControls(question, status) + actionControls(question);
    while (holder.firstChild) card.insertBefore(holder.firstChild, lesson || null);
  }

  function updateErrorSummary() {
    // The hardening module owns attempt-scoped classifications when loaded.
    // Do not alternate its summary with this legacy cross-attempt fallback.
    if (window.__TBPhase2Hardening && window.__TBPhase2Hardening.refreshClassificationSummary) {
      window.__TBPhase2Hardening.refreshClassificationSummary();
      return;
    }
    const host = document.getElementById('tb-error-summary');
    if (!host) return;
    const values = Array.from(document.querySelectorAll('#' + FEEDBACK_ID + ' [data-error-class]'))
      .map(function (select) { return select.value; })
      .filter(Boolean);
    const counts = {};
    values.forEach(function (value) { counts[value] = (counts[value] || 0) + 1; });
    if (!values.length) {
      setTextIfChanged(host, 'Classify missed questions during review to separate concept, calculation, reading, and time-management gaps.');
      return;
    }
    const labels = Object.fromEntries(ERROR_CLASSES);
    setHtmlIfChanged(host, '<strong>' + values.length + ' mistake' + (values.length === 1 ? '' : 's') + ' classified:</strong> ' + Object.keys(counts).map(function (key) {
      return esc(labels[key] || key) + ' (' + counts[key] + ')';
    }).join(' · '));
  }

  function augmentFeedbackHeader() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback || feedback.querySelector('.tb-phase2-intro')) return;
    const times = Object.keys(timesByQuestionId).map(function (id) { return timesByQuestionId[id]; }).filter(function (value) { return value > 0; });
    const average = times.length ? times.reduce(function (sum, value) { return sum + value; }, 0) / times.length : 0;
    const intro = document.createElement('div');
    intro.className = 'tb-phase2-intro';
    intro.innerHTML = '<div><div class="tb-diag-kick">Deep learning feedback</div><h3>Turn each mistake into a corrected decision rule.</h3><p>Key points come directly from the validated explanation. Specific distractor rationales are never invented. Add your error cause, practise same-subtopic questions, and report anything that needs review.</p></div>' +
      '<div class="tb-phase2-time"><span>Average tracked time</span><strong>' + esc(average ? formatDuration(average) : 'Tracking starts with the next attempt') + '</strong></div>' +
      '<p id="tb-error-summary" class="tb-error-summary"></p>';
    const actions = feedback.querySelector('.tb-feedback-actions');
    if (actions) actions.insertAdjacentElement('afterend', intro);
    else feedback.prepend(intro);
    updateErrorSummary();
  }

  function similarCandidates(question, count) {
    if (!question) return [];
    const candidates = allQuestions(currentExam()).filter(function (candidate) {
      return candidate.sub === question.sub && questionId(candidate) !== questionId(question);
    });
    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      const value = candidates[index];
      candidates[index] = candidates[swap];
      candidates[swap] = value;
    }
    return candidates.slice(0, Math.min(count || 5, candidates.length));
  }

  function ensurePracticePanel() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback) return null;
    let panel = document.getElementById('tb-similar-practice');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'tb-similar-practice';
      panel.className = 'tb-similar-practice';
      panel.hidden = true;
      feedback.appendChild(panel);
    }
    return panel;
  }

  function startSimilar(question) {
    const items = similarCandidates(question, 5);
    const panel = ensurePracticePanel();
    if (!panel) return;
    if (!items.length) {
      panel.hidden = false;
      panel.innerHTML = '<div class="tb-review-empty">No additional validated questions are available for this subtopic yet.</div><button type="button" class="tb-ghost" data-close-similar>Return to review</button>';
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    similarState = { source: question, items: items, index: 0, selected: null, checked: false, answers: [] };
    renderSimilar();
  }

  function similarQuestionHtml() {
    const question = similarState.items[similarState.index];
    const meta = topicMeta(question);
    const options = question.options.map(function (option, index) {
      const classes = ['tb-similar-option'];
      if (similarState.selected === index) classes.push('selected');
      if (similarState.checked && question.answer === index) classes.push('correct');
      if (similarState.checked && similarState.selected === index && index !== question.answer) classes.push('wrong');
      return '<button type="button" class="' + classes.join(' ') + '" data-similar-opt="' + index + '"' + (similarState.checked ? ' disabled' : '') + '><span>' + String.fromCharCode(65 + index) + '</span>' + esc(option) + '</button>';
    }).join('');
    const feedback = similarState.checked ? '<div class="tb-similar-feedback"><strong>' + (similarState.selected === question.answer ? 'Correct.' : 'Not quite. The correct answer is ' + esc(answerText(question, question.answer)) + '.') + '</strong><p>' + (question.why || 'A validated explanation is not available yet.') + '</p><div class="tb-deep-label">Key learning point</div><p>' + esc(questionKeyPoint(question)) + '</p><a class="tb-review-lesson" href="' + esc(meta.lesson) + '">Study: ' + esc(meta.lessonName) + '</a></div>' : '';
    return '<div class="tb-retry-head"><div><div class="tb-diag-kick">Same-subtopic practice</div><h3>Practise similar questions</h3></div><span class="tb-badge2">' + (similarState.index + 1) + ' of ' + similarState.items.length + '</span></div>' +
      '<div class="tb-retry-topic">' + esc(meta.domainName) + ' &rsaquo; ' + esc(meta.subName) + '</div>' + reviewQuestionContent(question) + '<div class="tb-similar-options">' + options + '</div>' + feedback +
      '<div class="tb-retry-actions">' + (similarState.checked ? '<button type="button" class="btn btn-teal" data-similar-next>' + (similarState.index === similarState.items.length - 1 ? 'See practice results' : 'Next question') + '</button>' : '<button type="button" class="btn btn-teal" data-similar-check' + (similarState.selected == null ? ' disabled' : '') + '>Check answer</button>') + '<button type="button" class="tb-ghost" data-close-similar>Return to review</button></div>';
  }

  function similarSummaryHtml() {
    const correct = similarState.answers.filter(function (answer, index) {
      return answer === similarState.items[index].answer;
    }).length;
    return '<div class="tb-retry-summary"><div class="tb-ring big" style="--p:' + Math.round(correct / similarState.items.length * 100) + '"><span>' + correct + '<small>/' + similarState.items.length + '</small></span></div><div><div class="tb-diag-kick">Similar-question results</div><h3>' + (correct === similarState.items.length ? 'Subtopic reinforced.' : 'Continue reviewing this subtopic.') + '</h3><p>These questions came from the same validated Body of Knowledge subtopic as the reviewed question.</p></div></div><div class="tb-retry-actions"><button type="button" class="tb-ghost" data-close-similar>Return to answer review</button></div>';
  }

  function renderSimilar() {
    const panel = ensurePracticePanel();
    if (!panel || !similarState) return;
    panel.hidden = false;
    panel.dataset.questionId = similarState.index < similarState.items.length ? questionId(similarState.items[similarState.index]) : '';
    const review = document.getElementById('tb-answer-review');
    if (review) review.hidden = true;
    panel.innerHTML = similarState.index >= similarState.items.length ? similarSummaryHtml() : similarQuestionHtml();
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeSimilar() {
    const panel = document.getElementById('tb-similar-practice');
    if (panel) panel.hidden = true;
    const review = document.getElementById('tb-answer-review');
    if (review) {
      review.hidden = false;
      review.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function prepareReport(button) {
    const key = button.dataset.prepareReport;
    const question = questionMap[key];
    const box = document.querySelector('[data-report-box="' + key + '"]');
    if (!question || !box) return;
    const type = box.querySelector('[data-report-type]').value;
    const note = box.querySelector('[data-report-note]').value.trim();
    const body = [
      'Exam: ' + currentExamId().toUpperCase(),
      'Issue type: ' + type,
      'Question: ' + question.stem,
      'Stored correct answer: ' + answerText(question, question.answer),
      'Page: ' + window.location.href,
      '',
      'Reviewer note:',
      note || '(No additional note provided.)'
    ].join('\n');
    const link = box.querySelector('[data-report-link]');
    link.href = 'mailto:' + REPORT_EMAIL + '?subject=' + encodeURIComponent('Test-bank question review: ' + type) + '&body=' + encodeURIComponent(body);
    link.textContent = 'Open email report';
    link.hidden = false;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .tb-phase2-intro{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;margin:16px 0 0;padding:16px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
      .tb-phase2-intro h3{font-family:"Source Serif 4",serif;color:var(--ink);font-size:19px;margin:2px 0 5px}.tb-phase2-intro p{color:var(--muted);font-size:12.5px;line-height:1.5;margin:0}.tb-phase2-time{min-width:160px;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:var(--card)}.tb-phase2-time span,.tb-deep-summary span{display:block;color:var(--muted);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.tb-phase2-time strong,.tb-deep-summary strong{display:block;color:var(--ink);font-size:13px;margin-top:3px}.tb-error-summary{grid-column:1/-1!important}
      .tb-deep-learning{margin:12px 0}.tb-deep-summary{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:9px}.tb-deep-summary>div{padding:9px 11px;border:1px solid var(--line);border-radius:8px;background:var(--tint)}.tb-learning-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.tb-learning-grid section{padding:12px 13px;border:1px solid var(--line);border-radius:9px;background:var(--tint)}.tb-deep-label{font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--teal);margin-bottom:5px}.tb-learning-grid p,.tb-similar-feedback p{color:var(--ink-soft,var(--muted));font-size:13px;line-height:1.55;margin:0}
      .tb-distractor-analysis{margin-top:9px;border:1px solid var(--line);border-radius:9px;background:var(--card)}.tb-distractor-analysis summary{padding:11px 13px;color:var(--ink);font-size:12.5px;font-weight:700;cursor:pointer}.tb-distractor-list{display:grid;gap:8px;padding:0 13px 12px}.tb-distractor-row{padding:10px 11px;border:1px solid var(--line);border-radius:8px;background:var(--tint)}.tb-distractor-title{display:flex;align-items:flex-start;gap:8px;color:var(--ink);font-size:12.5px;font-weight:700}.tb-distractor-title span{display:grid;place-items:center;width:22px;height:22px;border:1px solid var(--line);border-radius:6px;flex:none}.tb-distractor-row p{margin:5px 0 2px;color:var(--muted);font-size:12.5px;line-height:1.5}.tb-distractor-row small{color:var(--muted);font-size:10.5px}.tb-accuracy-note{margin:0;padding:0 13px 12px;color:var(--muted);font-size:11.5px;line-height:1.45}
      .tb-error-diagnosis{margin:10px 0;padding:12px 13px;border-left:3px solid #b8791b;border-radius:8px;background:color-mix(in srgb,#b8791b 7%,var(--tint))}.tb-error-diagnosis label{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,320px);align-items:center;gap:12px;color:var(--ink);font-size:12.5px;font-weight:700}.tb-error-diagnosis select,.tb-report-box select,.tb-report-box textarea{width:100%;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit;font-size:12.5px;padding:8px 10px}.tb-error-diagnosis p{margin:7px 0 0;color:var(--muted);font-size:11.5px}.tb-deep-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.tb-report-box{display:grid;gap:9px;padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--tint)}.tb-report-box label{display:grid;gap:5px;color:var(--ink);font-size:11.5px;font-weight:700}.tb-report-box [data-report-link]{color:var(--teal);font-size:12.5px;font-weight:700}
      .tb-similar-practice{margin-top:20px;padding-top:20px;border-top:1px solid var(--line);scroll-margin-top:18px}.tb-similar-options{display:grid;gap:9px}.tb-similar-option{display:flex;align-items:flex-start;gap:10px;width:100%;padding:12px 13px;border:1px solid var(--line);border-radius:9px;background:var(--tint);color:var(--ink);font:inherit;font-size:13.5px;text-align:left;cursor:pointer}.tb-similar-option span{display:grid;place-items:center;width:24px;height:24px;border:1px solid var(--line);border-radius:6px;flex:none;font-weight:700}.tb-similar-option.selected{border-color:var(--teal)}.tb-similar-option.correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 9%,var(--card))}.tb-similar-option.wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 8%,var(--card))}.tb-similar-feedback{margin-top:11px;padding:12px 13px;border:1px solid var(--line);border-radius:9px;background:var(--card)}.tb-similar-feedback>p{margin:6px 0 10px}.tb-similar-feedback .tb-deep-label{margin-top:8px}
      html[data-theme="dark"] .tb-error-diagnosis{border-left-color:#f0c36a}
      @media(max-width:760px){.tb-phase2-intro,.tb-learning-grid,.tb-deep-summary{grid-template-columns:1fr}.tb-error-diagnosis label{grid-template-columns:1fr}.tb-phase2-time{min-width:0}}
    `;
    document.head.appendChild(style);
  }

  function enhanceDeepFeedback() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback) return;
    augmentFeedbackHeader();
    Array.from(feedback.querySelectorAll('.tb-review-card')).forEach(enhanceReviewCard);
    updateErrorSummary();
  }

  function handleClick(event) {
    const target = event.target.closest('button, a');
    if (!target) return;

    const originalQuiz = target.closest('#' + OVERVIEW_ID + ' .tb-quiz');
    if (originalQuiz && !target.closest('#' + FEEDBACK_ID) && target.matches('[data-next],[data-goto],[data-submit],[data-quit],[data-backsim]')) {
      commitTracked(true);
    }

    if (target.dataset.practiceSimilar) {
      startSimilar(questionMap[target.dataset.practiceSimilar]);
      return;
    }
    if (target.dataset.reportQuestion) {
      const box = document.querySelector('[data-report-box="' + target.dataset.reportQuestion + '"]');
      if (box) box.hidden = !box.hidden;
      return;
    }
    if (target.dataset.prepareReport) {
      prepareReport(target);
      return;
    }
    if (target.dataset.similarOpt != null && similarState && !similarState.checked) {
      similarState.selected = Number(target.dataset.similarOpt);
      renderSimilar();
      return;
    }
    if (target.hasAttribute('data-similar-check') && similarState && similarState.selected != null) {
      similarState.checked = true;
      similarState.answers[similarState.index] = similarState.selected;
      renderSimilar();
      return;
    }
    if (target.hasAttribute('data-similar-next') && similarState) {
      similarState.index += 1;
      similarState.selected = null;
      similarState.checked = false;
      renderSimilar();
      return;
    }
    if (target.hasAttribute('data-close-similar')) closeSimilar();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      trackQuiz();
      enhanceDeepFeedback();
    });
  }

  function initialize() {
    ensureStyles();
    schedule();
    document.addEventListener('click', handleClick, true);
    document.addEventListener('change', function (event) {
      const select = event.target.closest('[data-error-class]');
      if (!select) return;
      const card = select.closest('.tb-review-card');
      const stem = card && card.querySelector('.tb-review-stem');
      if (stem) saveClassification(card.dataset.questionId || stem.textContent.trim(), select.value);
    });
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
  }

  window.__TBDeepFeedback = {
    extractKeyPoint,
    trapText,
    distractorReason,
    similarCandidates,
    formatDuration,
    recordTimeForQuestion: function (questionOrId, milliseconds) { recordTime(questionOrId, milliseconds); schedule(); },
    getTimes: function () { return Object.assign({}, timesByQuestionId); },
    classificationValue
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

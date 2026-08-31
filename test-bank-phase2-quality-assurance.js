(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STYLE_ID = 'tb-feedback-quality-styles';
  let scheduled = false;

  function stripHtml(value) {
    const node = document.createElement('div');
    node.innerHTML = String(value == null ? '' : value);
    return (node.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function currentExamId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function currentExam() {
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[currentExamId()] : null;
  }

  function questionId(question) {
    const registry = window.__TBQuestionRegistry;
    if (registry && typeof registry.idFor === 'function') return registry.idFor(currentExamId(), question);
    return question && question.questionId || question && question.qid || question && question.id || String(question && question.stem || '');
  }

  function allQuestions(exam) {
    const registry = window.__TBQuestionRegistry;
    if (registry && exam === currentExam() && typeof registry.questionsFor === 'function') return registry.questionsFor(currentExamId());
    const output = [];
    const seen = new Set();
    function add(question) {
      if (!question || !question.stem) return;
      const id = questionId(question);
      if (seen.has(id)) return;
      seen.add(id);
      output.push(question);
    }
    if (exam && exam.sets) Object.keys(exam.sets).forEach(function (key) { (exam.sets[key] || []).forEach(add); });
    if (exam && exam.bank) exam.bank.forEach(add);
    return output;
  }

  function questionByIdentity(identity, legacyStem) {
    const registry = window.__TBQuestionRegistry;
    if (registry && typeof registry.find === 'function' && identity) {
      const found = registry.find(currentExamId(), identity);
      if (found) return found;
    }
    return allQuestions(currentExam()).find(function (question) {
      return questionId(question) === identity || question.stem === legacyStem || question.stem === identity;
    }) || null;
  }

  function explicitDistractorCount(question) {
    if (!question || !question.distractors) return 0;
    return (question.options || []).reduce(function (count, option, index) {
      if (index === question.answer) return count;
      const value = Array.isArray(question.distractors)
        ? question.distractors[index]
        : question.distractors[index] || question.distractors[String(index)];
      return count + (stripHtml(value).length >= 12 ? 1 : 0);
    }, 0);
  }

  function structuralIssues(question) {
    const issues = [];
    if (!question || !stripHtml(question.stem)) issues.push('missing stem');
    if (!Array.isArray(question && question.options) || question.options.length < 2) issues.push('invalid options');
    if (!Number.isInteger(question && question.answer) || question.answer < 0 || question.answer >= (question.options || []).length) issues.push('invalid answer index');
    if ((question.options || []).some(function (option) { return !stripHtml(option); })) issues.push('blank option');
    const normalized = (question.options || []).map(function (option) { return stripHtml(option).toLowerCase(); });
    if (new Set(normalized).size !== normalized.length) issues.push('duplicate options');
    if (!stripHtml(question && question.why)) issues.push('missing explanation');
    if (!question || !question.sub) issues.push('missing subtopic');
    return issues;
  }

  function reviewedMetadata(question) {
    const requiredDistractors = Math.max((question.options || []).length - 1, 0);
    const source = question && question.reviewSource;
    const reviewer = question && question.reviewedBy;
    const reviewedAt = question && question.reviewedAt;
    const keyPoint = question && question.keyPoint;
    const trap = question && question.trap;
    const concept = question && (question.conceptId || question.learningObjective);
    const distractors = explicitDistractorCount(question);
    return {
      source: Boolean(stripHtml(source)),
      reviewer: Boolean(stripHtml(reviewer)),
      reviewedAt: Boolean(stripHtml(reviewedAt)),
      keyPoint: Boolean(stripHtml(keyPoint)),
      trap: Boolean(stripHtml(trap)),
      concept: Boolean(stripHtml(concept)),
      distractors: distractors === requiredDistractors && requiredDistractors > 0,
      distractorCount: distractors,
      requiredDistractors: requiredDistractors
    };
  }

  function qualityLevel(question) {
    const issues = structuralIssues(question);
    const metadata = reviewedMetadata(question);
    if (issues.length) {
      return {
        level: 'review-required',
        label: 'Review required',
        description: 'This item has structural or explanation gaps: ' + issues.join(', ') + '.',
        issues: issues,
        metadata: metadata
      };
    }
    if (metadata.source && metadata.reviewer && metadata.reviewedAt && metadata.keyPoint && metadata.trap && metadata.concept && metadata.distractors) {
      return {
        level: 'expert-reviewed',
        label: 'Expert-reviewed feedback',
        description: 'Answer, explanation, learning point, exam trap, concept mapping, and every distractor rationale have recorded review metadata.',
        issues: [],
        metadata: metadata
      };
    }
    return {
      level: 'bank-grounded',
      label: 'Question-bank grounded',
      description: 'The answer and explanation come from the stored question bank. Missing expert-review metadata is disclosed rather than inferred.',
      issues: [],
      metadata: metadata
    };
  }

  function audit(exam) {
    const questions = allQuestions(exam);
    const report = {
      total: questions.length,
      structurallyValid: 0,
      expertReviewed: 0,
      bankGrounded: 0,
      reviewRequired: 0,
      missingExplanations: 0,
      invalidAnswerIndices: 0,
      duplicateStems: 0
    };
    const stems = new Set();
    questions.forEach(function (question) {
      const quality = qualityLevel(question);
      if (!quality.issues.length) report.structurallyValid += 1;
      if (quality.level === 'expert-reviewed') report.expertReviewed += 1;
      if (quality.level === 'bank-grounded') report.bankGrounded += 1;
      if (quality.level === 'review-required') report.reviewRequired += 1;
      if (!stripHtml(question.why)) report.missingExplanations += 1;
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= (question.options || []).length) report.invalidAnswerIndices += 1;
      if (stems.has(question.stem)) report.duplicateStems += 1;
      stems.add(question.stem);
    });
    return report;
  }

  function qualityDetailsHtml(quality) {
    const m = quality.metadata;
    const checks = [
      ['Recorded source', m.source],
      ['Recorded reviewer', m.reviewer],
      ['Review date', m.reviewedAt],
      ['Reviewed key point', m.keyPoint],
      ['Reviewed exam trap', m.trap],
      ['Reviewed concept mapping', m.concept],
      ['All distractor rationales', m.distractors]
    ];
    return '<details class="tb-quality-details"><summary>Feedback quality details</summary><p>' + quality.description + '</p><ul>' + checks.map(function (item) {
      return '<li><span aria-hidden="true">' + (item[1] ? '✓' : '○') + '</span> ' + item[0] + '</li>';
    }).join('') + '</ul></details>';
  }

  function enhanceCard(card) {
    if (card.querySelector('.tb-quality-badge')) return;
    const stemNode = card.querySelector('.tb-review-stem');
    if (!stemNode) return;
    const question = questionByIdentity(card.dataset.questionId || stemNode.textContent.trim(), stemNode.textContent.trim());
    if (!question) return;
    const quality = qualityLevel(question);
    const header = card.querySelector('.tb-review-card-head');
    if (header) {
      const badge = document.createElement('span');
      badge.className = 'tb-quality-badge ' + quality.level;
      badge.textContent = quality.label;
      badge.title = quality.description;
      const badges = header.querySelector('.tb-review-badges');
      if (badges) badges.prepend(badge);
    }
    const deep = card.querySelector('.tb-deep-learning');
    if (deep) deep.insertAdjacentHTML('afterend', qualityDetailsHtml(quality));
  }

  function enhanceHeader(feedback) {
    if (feedback.querySelector('.tb-quality-audit')) return;
    const report = audit(currentExam());
    const panel = document.createElement('details');
    panel.className = 'tb-quality-audit';
    panel.innerHTML = '<summary>Feedback integrity audit</summary><div><strong>' + report.structurallyValid + ' of ' + report.total + '</strong> questions pass structural checks · <strong>' + report.expertReviewed + '</strong> have complete recorded expert-review metadata · <strong>' + report.bankGrounded + '</strong> are transparently question-bank grounded · <strong>' + report.reviewRequired + '</strong> require correction.</div>';
    const intro = feedback.querySelector('.tb-phase2-intro');
    if (intro) intro.insertAdjacentElement('afterend', panel);
    else feedback.prepend(panel);
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.tb-quality-badge{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:700;letter-spacing:.03em}.tb-quality-badge.expert-reviewed{color:#14734f;background:rgba(31,157,107,.14)}.tb-quality-badge.bank-grounded{color:#315f99;background:rgba(59,111,176,.14)}.tb-quality-badge.review-required{color:#a3332f;background:rgba(192,69,63,.14)}.tb-quality-details,.tb-quality-audit{margin:10px 0;border:1px solid var(--line);border-radius:9px;background:var(--tint)}.tb-quality-details summary,.tb-quality-audit summary{padding:10px 12px;color:var(--ink);font-size:12px;font-weight:700;cursor:pointer}.tb-quality-details p,.tb-quality-audit div{margin:0;padding:0 12px 11px;color:var(--muted);font-size:12px;line-height:1.5}.tb-quality-details ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 12px;margin:0;padding:0 12px 12px;list-style:none;color:var(--muted);font-size:11.5px}@media(max-width:640px){.tb-quality-details ul{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  function apply() {
    scheduled = false;
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback) return;
    enhanceHeader(feedback);
    feedback.querySelectorAll('.tb-review-card').forEach(enhanceCard);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  function initialize() {
    ensureStyles();
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true });
    schedule();
  }

  window.__TBFeedbackQuality = {
    structuralIssues: structuralIssues,
    reviewedMetadata: reviewedMetadata,
    qualityLevel: qualityLevel,
    audit: function () { return audit(currentExam()); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

(function () {
  'use strict';
  if (window.__TBCurrentAttemptReview) return;

  // Read-only, current-page snapshots. Never write to the exam engine or storage.
  const ID = 'tb-feedback-loop';
  let candidate = null;
  let completed = null;
  let retry = null;
  let wasQuiz = false;
  let scheduled = false;
  let frame = null;
  let observer = null;
  let disposed = false;
  const labels = {correct: 'Correct', incorrect: 'Incorrect', unanswered: 'Unanswered', unavailable: 'Review required'};
  const glyphs = {correct: '\u2713', incorrect: '\u2717', unanswered: '\u2013', unavailable: '?'};
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const activeExam = () => document.querySelector('.tb-tile.active[data-exam]')?.dataset.exam || '';
  const validKey = q => q && Array.isArray(q.options) && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length;
  function status(record) {
    if (record.selected == null) return 'unanswered';
    if (!validKey(record.question)) return 'unavailable';
    return record.selected === record.question.answer ? 'correct' : 'incorrect';
  }
  function snapshot(value) {
    if (!value || !value.examId || !Array.isArray(value.records) || !value.records.length) return null;
    try {
      const data = JSON.parse(JSON.stringify(value));
      if (data.records.some(r => !r || !r.question || !Array.isArray(r.question.options))) return null;
      data.records = data.records.map((r, index) => ({...r, index,
        selected: Number.isInteger(r.selected) && r.selected >= 0 && r.selected < r.question.options.length ? r.selected : null,
        flagged: !!r.flagged}));
      return data;
    } catch (_) { return null; }
  }
  function readSnapshot() {
    try { return snapshot(window.__TB?.getFeedbackSnapshot?.()); } catch (_) { return null; }
  }
  function counts(records) {
    const out = {all: records.length, correct: 0, incorrect: 0, unanswered: 0, unavailable: 0, flagged: 0, missed: 0};
    records.forEach(r => { out[status(r)]++; if (r.flagged) out.flagged++; });
    out.missed = out.incorrect + out.unanswered;
    return out;
  }
  function filtered(records, filter) {
    return records.filter(r => filter === 'all' || (filter === 'flagged' ? r.flagged :
      filter === 'missed' ? ['incorrect', 'unanswered'].includes(status(r)) : status(r) === filter));
  }
  function reset() { candidate = completed = retry = null; }
  function safeHref(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
    } catch (_) { return ''; }
  }
  function safeHtml(value) {
    const template = document.createElement('template');
    template.innerHTML = String(value || '');
    template.content.querySelectorAll('script,iframe,object,embed,style,link,meta,base,form,input,button,textarea').forEach(n => n.remove());
    template.content.querySelectorAll('*').forEach(n => {
      Array.from(n.attributes).forEach(a => {
        if (/^on/i.test(a.name) || ['srcdoc', 'formaction'].includes(a.name.toLowerCase())) n.removeAttribute(a.name);
        if (['href','src','xlink:href'].includes(a.name.toLowerCase()) && !a.value.startsWith('#') && !safeHref(a.value)) n.removeAttribute(a.name);
      });
      if (n.tagName === 'A') { n.target = '_blank'; n.rel = 'noopener noreferrer'; }
    });
    return template.innerHTML;
  }
  function topic(question) {
    const engine = window.__TB;
    for (const domain of engine?.EXAMS?.[completed?.examId]?.bok || []) {
      for (const sub of domain.subs || []) {
        if (sub && typeof sub === 'object' && sub.id === question.sub) return {
          domainName: engine.DM?.[domain.domain]?.name || domain.domain,
          subName: sub.name || sub.id, lesson: sub.lesson || '/lessons', lessonName: sub.lessonName || 'Review the related lesson'
        };
      }
    }
    return {domainName: 'Body of Knowledge', subName: question.sub || 'General review', lesson: '/lessons', lessonName: 'Browse related lessons'};
  }
  function reference(question, meta = topic(question)) {
    const source = Array.isArray(question.auditSources) && question.auditSources.find(s => s?.title && safeHref(s.url));
    const href = safeHref(source ? source.url : meta.lesson || '/lessons');
    return href ? `<a class="tb-review-lesson tb-review-reference" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(source ? 'Reference: ' + source.title : 'Study: ' + meta.lessonName)} <span class="tb-review-newtab">(opens in a new tab)</span></a>` : '';
  }
  function content(question) {
    try {
      if (typeof window.__TB?.renderQuestionContent === 'function') return window.__TB.renderQuestionContent(question, true);
    } catch (_) { /* Preserve access to the textual question if a visual renderer fails. */ }
    return `<div class="tb-review-stem">${esc(question.stem)}</div>`;
  }
  function rationales(question) {
    for (const prefix of ['__MBBSet3Batch', '__MBBBatch']) {
      for (let i = 1; i <= 7; i++) {
        const helper = window[prefix + i + 'UI'];
        try { if (helper?.isQuestion?.(question) && helper.rationales) return safeHtml(helper.rationales(question)); } catch (_) { /* Use authored fields below. */ }
      }
    }
    if (!question.distractors || typeof question.distractors !== 'object') return '';
    const entries = Object.entries(question.distractors).filter(([i, text]) => Number.isInteger(Number(i)) && Number(i) >= 0 && Number(i) < question.options.length && Number(i) !== question.answer && typeof text === 'string' && text.trim());
    return entries.length ? '<details class="tb-review-rationales"><summary>Why the other options are incorrect</summary>' +
      entries.map(([i, text]) => `<p><strong>${String.fromCharCode(65 + Number(i))}.</strong> ${safeHtml(text)}</p>`).join('') + '</details>' : '';
  }
  function explanation(question) {
    return `<div class="tb-explanation"><div class="tb-explanation-title">${validKey(question) ? 'Why this is correct' : 'Answer key needs review'}</div><div class="tb-explanation-copy">${safeHtml(question.why) || 'An explanation is not available for this question yet.'}</div>${rationales(question)}${question.keyPoint ? `<p><strong>Key learning point:</strong> ${safeHtml(question.keyPoint)}</p>` : ''}${question.trap ? `<p><strong>Exam trap:</strong> ${safeHtml(question.trap)}</p>` : ''}</div>`;
  }
  function answer(question, index) {
    return index == null ? 'Not answered' : `${String.fromCharCode(65 + index)}. ${question.options[index] ?? 'Answer unavailable'}`;
  }
  function card(record) {
    const q = record.question, state = status(record), meta = topic(q);
    return `<article class="tb-review-card" data-review-status="${state}" data-question-id="${esc(record.questionId || q.qid || q.id || record.index)}" tabindex="-1">
      <div class="tb-review-card-head"><div><strong>Question ${record.index + 1}</strong><div class="tb-review-topic">${esc(meta.domainName)} &rsaquo; ${esc(meta.subName)}</div></div><div class="tb-review-badges">${q.set != null ? `<span class="tb-review-setbadge">Set ${esc(q.set)}</span>` : ''}<span class="tb-review-status ${state}">${labels[state]}</span>${record.flagged ? '<span class="tb-review-status flagged">Flagged</span>' : ''}</div></div>
      ${content(q)}<div class="tb-review-options">${q.options.map((opt, i) => `<div class="tb-review-option${validKey(q) && i === q.answer ? ' is-correct' : ''}${record.selected === i && i !== q.answer ? ' is-wrong' : ''}"><span class="tb-answer-letter">${String.fromCharCode(65 + i)}</span><span class="tb-answer-copy">${esc(opt)}</span><span class="tb-answer-tags">${record.selected === i ? '<span class="tb-answer-tag">Your answer</span>' : ''}${validKey(q) && i === q.answer ? '<span class="tb-answer-tag">Correct answer</span>' : ''}</span></div>`).join('')}</div>
      <div class="tb-answer-compare"><div><span>Your answer</span><strong>${esc(answer(q, record.selected))}</strong></div><div><span>Correct answer</span><strong>${validKey(q) ? esc(answer(q, q.answer)) : 'Answer key unavailable'}</strong></div></div>${explanation(q)}${reference(q, meta)}</article>`;
  }
  function focus(element, scroll = true) {
    if (!element) return;
    element.setAttribute('tabindex', '-1');
    element.focus({preventScroll: true});
    if (scroll && element.scrollIntoView) element.scrollIntoView({block: 'start', behavior: 'auto'});
  }
  function notify(root) { document.dispatchEvent(new CustomEvent('tb:review-rendered', {detail: {root}})); }
  function renderGrid(index) {
    document.getElementById('tb-review-grid').innerHTML = completed.records.map(r => {
      const state = status(r);
      return `<button type="button" class="tb-review-navcell ${state}${r.index === index ? ' cur' : ''}" data-review-goto="${r.index}" aria-label="Question ${r.index + 1}, ${labels[state]}${r.flagged ? ', flagged' : ''}"${r.index === index ? ' aria-current="true"' : ''}><span aria-hidden="true">${glyphs[state]}</span><span>${r.index + 1}</span>${r.flagged ? '<span class="tb-rnc-flag" aria-hidden="true">\u2691</span>' : ''}</button>`;
    }).join('');
  }
  function renderReview(filter, index) {
    if (!completed) return;
    const panel = document.getElementById('tb-answer-review');
    const list = document.getElementById('tb-review-list');
    panel.hidden = false;
    document.getElementById('tb-retry-panel').hidden = true;
    panel.dataset.activeFilter = index == null ? filter : 'single';
    panel.querySelectorAll('[data-review-tab]').forEach(b => {
      const on = index == null && b.dataset.reviewTab === filter;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
    });
    renderGrid(index);
    const records = index == null ? filtered(completed.records, filter) : completed.records.filter(r => r.index === index);
    list.innerHTML = records.length ? records.map(card).join('') : '<p class="tb-review-empty">No questions match this filter.</p>';
    notify(list);
    focus(index == null ? panel.querySelector('h3') : list.querySelector('article'));
  }
  function startRetry(remaining = false) {
    const items = remaining && retry ? retry.items.filter((r, i) => retry.answers[i] !== r.question.answer) :
      filtered(completed.records, 'missed').filter(r => validKey(r.question));
    if (!items.length) { renderReview('all'); return; }
    retry = {items, index: 0, answers: [], checked: [], complete: false};
    renderRetry();
  }
  function renderRetry(focusSelector) {
    const panel = document.getElementById('tb-retry-panel');
    document.getElementById('tb-answer-review').hidden = true;
    panel.hidden = false;
    if (retry.complete) {
      const total = retry.items.length;
      const correct = retry.items.filter((r, i) => retry.answers[i] === r.question.answer).length;
      panel.innerHTML = `<div class="tb-diag-kick">Correction results</div><h3>${correct === total ? 'All missed questions corrected.' : 'Keep closing the remaining gaps.'}</h3><p class="tb-correction-count">You answered <strong>${correct} of ${total}</strong> correctly during this correction round.</p><p>Your original exam score has not changed.</p><div class="tb-retry-actions">${correct < total ? '<button type="button" class="btn btn-teal" data-retry-remaining>Retry remaining questions</button>' : ''}<button type="button" class="tb-ghost" data-retry-return>Return to answer review</button></div>`;
    } else {
      const r = retry.items[retry.index], q = r.question, meta = topic(q);
      const selected = retry.answers[retry.index], checked = !!retry.checked[retry.index];
      const correct = selected === q.answer;
      panel.innerHTML = `<div class="tb-retry-head"><div><div class="tb-diag-kick">Correction quiz</div><h3>Retry missed questions</h3></div><span>${retry.index + 1} of ${retry.items.length}</span></div><p class="tb-review-topic">Original question ${r.index + 1} &middot; ${esc(meta.domainName)} &rsaquo; ${esc(meta.subName)}</p>${content(q)}<div class="tb-retry-options">${q.options.map((opt, i) => `<button type="button" class="tb-retry-option${selected === i ? ' selected' : ''}${checked && i === q.answer ? ' correct' : ''}${checked && selected === i && !correct ? ' wrong' : ''}" data-retry-opt="${i}" aria-pressed="${selected === i}"${checked ? ' disabled' : ''}><span class="tb-answer-letter">${String.fromCharCode(65 + i)}</span><span>${esc(opt)}</span></button>`).join('')}</div>${checked ? `<div class="tb-retry-feedback ${correct ? 'correct' : 'wrong'}" role="status"><strong>${correct ? 'Correct. You have corrected this question.' : 'Not quite. The correct answer is ' + esc(answer(q, q.answer)) + '.'}</strong></div>${explanation(q)}${reference(q, meta)}` : ''}<div class="tb-retry-actions">${checked ? `<button type="button" class="btn btn-teal" data-retry-next>${retry.index === retry.items.length - 1 ? 'See correction results' : 'Next question'}</button>` : `<button type="button" class="btn btn-teal" data-retry-check${selected == null ? ' disabled' : ''}>Check answer</button>`}<button type="button" class="tb-ghost" data-retry-return>Return to answer review</button></div>`;
    }
    notify(panel);
    const target = panel.querySelector(focusSelector || 'h3');
    if (focusSelector && target) target.focus({preventScroll: true}); else focus(target);
  }
  function mount(head) {
    const c = counts(completed.records);
    const canRetry = filtered(completed.records, 'missed').some(r => validKey(r.question));
    const panel = document.createElement('section');
    panel.id = ID; panel.className = 'tb-feedback-loop'; panel.setAttribute('aria-labelledby', 'tb-feedback-title');
    panel.innerHTML = `<div class="tb-feedback-head"><div><div class="tb-diag-kick">Essential feedback loop</div><h2 id="tb-feedback-title">Review what you missed and understand why.</h2><p>Your score identifies the gap. Review your answers, understand each explanation, and practise the questions you missed.</p></div><div class="tb-feedback-stats"><span><strong>${c.correct}</strong> correct</span><span><strong>${c.incorrect}</strong> incorrect</span><span><strong>${c.unanswered}</strong> unanswered</span>${c.unavailable ? `<span><strong>${c.unavailable}</strong> need review</span>` : ''}</div></div><div class="tb-feedback-actions"><button type="button" class="btn btn-teal" data-open-review="missed">Review missed questions</button><button type="button" class="tb-ghost" data-retry-missed${canRetry ? '' : ' disabled'}>Retry missed questions</button><button type="button" class="tb-ghost" data-open-review="all">Review all answers</button></div><p class="tb-review-session-note">Current session only. Review and correction results are cleared when you leave this exam, start another attempt, or refresh this page. Study links open in a new tab.</p><div id="tb-answer-review" class="tb-answer-review" hidden><div class="tb-review-toolbar"><h3>Question review</h3><div class="tb-review-tabs" role="group" aria-label="Filter reviewed questions">${['all','missed','incorrect','unanswered','correct','flagged',...(c.unavailable ? ['unavailable'] : [])].map(f => `<button type="button" data-review-tab="${f}" aria-pressed="false">${f === 'unavailable' ? 'Review required' : f[0].toUpperCase() + f.slice(1)} <span>${c[f]}</span></button>`).join('')}</div></div><div id="tb-review-grid" class="tb-review-grid" role="group" aria-label="Jump to any question"></div><p class="tb-review-gridkey">Green: correct &middot; Red: incorrect &middot; Amber: unanswered &middot; Flag: marked for review</p><div id="tb-review-list" class="tb-review-list"></div></div><div id="tb-retry-panel" class="tb-retry-panel" hidden></div>`;
    head.insertAdjacentElement('afterend', panel);
  }
  function synchronize() {
    scheduled = false;
    frame = null;
    if (disposed) return;
    const overview = document.getElementById('tb-overview');
    const quiz = overview?.querySelector('.tb-quiz');
    const head = overview?.querySelector('.tb-reshead') || overview?.querySelector('[data-score-result]');
    // Capture only on submission/completion, not on timer ticks or review rendering.
    if (quiz && !head) {
      if (!wasQuiz) reset();
      wasQuiz = true;
      return;
    }
    wasQuiz = false;
    if (!head) { reset(); return; }
    if (!completed) {
      const current = candidate || readSnapshot();
      if (!current || (activeExam() && current.examId !== activeExam())) return;
      completed = current;
    }
    if (!overview.querySelector('#' + ID)) mount(head);
  }
  function schedule() {
    if (!disposed && !scheduled) { scheduled = true; frame = window.requestAnimationFrame(synchronize); }
  }
  function onClick(event) {
    const button = event.target.closest?.('button, a, [data-exam]');
    if (!button) return;
    if (!button.closest('#' + ID)) {
      if (button.matches('[data-submit]')) candidate = readSnapshot() || candidate;
      if (button.matches('[data-back], [data-retake], [data-exam], [data-start-full], [data-start-quick], #f-startbtn, [data-mode]')) { reset(); wasQuiz = false; }
      schedule(); return;
    }
    if (button.disabled || !completed) return;
    if (button.dataset.openReview) renderReview(button.dataset.openReview);
    else if (button.dataset.reviewTab) renderReview(button.dataset.reviewTab);
    else if (button.dataset.reviewGoto != null) renderReview('all', Number(button.dataset.reviewGoto));
    else if (button.hasAttribute('data-retry-missed')) startRetry();
    else if (button.hasAttribute('data-retry-return')) renderReview('missed');
    else if (button.hasAttribute('data-retry-remaining')) startRetry(true);
    else if (retry && !retry.complete) {
      if (button.dataset.retryOpt != null && !retry.checked[retry.index]) {
        retry.answers[retry.index] = Number(button.dataset.retryOpt); renderRetry(`[data-retry-opt="${button.dataset.retryOpt}"]`);
      } else if (button.hasAttribute('data-retry-check') && retry.answers[retry.index] != null && !retry.checked[retry.index]) {
        retry.checked[retry.index] = true; renderRetry('[data-retry-next]');
      } else if (button.hasAttribute('data-retry-next') && retry.checked[retry.index]) {
        retry.index++; retry.complete = retry.index >= retry.items.length; renderRetry();
      }
    }
  }
  function installStyles() {
    const style = document.createElement('style');
    style.id = 'tb-current-attempt-review-styles';
    style.textContent = `
#tb-feedback-loop{--review-good:#14734f;--review-bad:#a3332f;--review-warn:#8b5c0c;margin:0 0 26px;padding:20px;border:1px solid var(--teal,#087f8c);border-radius:12px;background:linear-gradient(180deg,color-mix(in srgb,var(--teal,#087f8c) 7%,var(--card,#fff)),var(--card,#fff));color:var(--ink,#172b3a)}
#tb-feedback-loop [hidden]{display:none!important}#tb-feedback-loop *{box-sizing:border-box}#tb-feedback-loop h2,#tb-feedback-loop h3{font-family:"Source Serif 4",serif;line-height:1.3;margin:3px 0 10px}#tb-feedback-loop h2{font-size:23px}#tb-feedback-loop h3{font-size:21px}#tb-feedback-loop p{line-height:1.6}#tb-feedback-loop button{cursor:pointer}#tb-feedback-loop button:disabled{cursor:default;opacity:.6}#tb-feedback-loop button:focus-visible,#tb-feedback-loop a:focus-visible{outline:3px solid var(--teal,#087f8c);outline-offset:3px}#tb-feedback-loop article,#tb-feedback-loop h3{scroll-margin-top:110px}
.tb-feedback-head,.tb-review-card-head,.tb-retry-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.tb-feedback-head p{max-width:68ch;color:var(--muted,#526575);font-size:14px}.tb-feedback-stats{display:flex;gap:8px;flex-wrap:wrap}.tb-feedback-stats>span{min-width:82px;padding:9px;border:1px solid var(--line,#d9e1e7);border-radius:9px;text-align:center;font-size:12px;background:var(--card,#fff)}.tb-feedback-stats strong{display:block;font-size:21px}
.tb-feedback-actions,.tb-retry-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.tb-review-session-note{font-size:12px;color:var(--muted,#526575)}.tb-answer-review,.tb-retry-panel{margin-top:20px;padding-top:20px;border-top:1px solid var(--line,#d9e1e7)}.tb-review-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}.tb-review-tabs button{padding:8px 12px;border:1px solid var(--line,#d9e1e7);border-radius:999px;background:var(--card,#fff);color:var(--ink,#172b3a);font:inherit;font-size:12px}.tb-review-tabs button.on{background:var(--teal,#087f8c);color:#fff}.tb-review-tabs span{margin-left:4px}
.tb-review-grid{display:flex;flex-wrap:wrap;gap:6px}.tb-review-navcell{position:relative;display:grid;place-items:center;width:42px;min-height:44px;padding:3px;border:1px solid currentColor;border-radius:8px;background:var(--card,#fff);font:inherit;font-size:12px}.tb-review-navcell.correct{color:var(--review-good)}.tb-review-navcell.incorrect{color:var(--review-bad)}.tb-review-navcell.unanswered,.tb-review-navcell.unavailable{color:var(--review-warn)}.tb-review-navcell.cur{outline:2px solid var(--teal,#087f8c);outline-offset:2px}.tb-rnc-flag{position:absolute;right:-4px;top:-7px}.tb-review-gridkey{font-size:12px;color:var(--muted,#526575)}
.tb-review-list{display:grid;gap:15px}.tb-review-card{min-width:0;border:1px solid var(--line,#d9e1e7);border-radius:12px;background:var(--card,#fff);padding:18px}.tb-review-card-head{margin-bottom:14px}.tb-review-topic{font-size:12px;color:var(--muted,#526575);margin-top:4px}.tb-review-badges{display:flex;flex-wrap:wrap;gap:6px}.tb-review-status,.tb-review-setbadge{border-radius:999px;padding:5px 9px;font-size:11px;font-weight:700;background:var(--tint,#f2f6f8)}.tb-review-status.correct{color:var(--review-good)}.tb-review-status.incorrect{color:var(--review-bad)}.tb-review-status.unanswered,.tb-review-status.flagged,.tb-review-status.unavailable{color:var(--review-warn)}.tb-review-stem{font-size:16px;font-weight:600;line-height:1.6;margin-bottom:14px}
.tb-review-options,.tb-retry-options{display:grid;gap:8px;margin-top:12px}.tb-review-option{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:11px;border:1px solid var(--line,#d9e1e7);border-radius:9px;font-size:14px}.tb-review-option.is-correct,.tb-retry-option.correct{border-color:var(--review-good);background:color-mix(in srgb,#1f9d6b 10%,var(--card,#fff))}.tb-review-option.is-wrong,.tb-retry-option.wrong{border-color:var(--review-bad);background:color-mix(in srgb,#c0453f 9%,var(--card,#fff))}.tb-answer-letter{display:grid;place-items:center;min-width:26px;min-height:26px;border:1px solid var(--line,#d9e1e7);border-radius:6px;font-weight:700}.tb-answer-tags{display:flex;flex-wrap:wrap;gap:4px}.tb-answer-tag{padding:3px 6px;border:1px solid var(--line,#d9e1e7);border-radius:999px;font-size:10px}
.tb-answer-compare{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.tb-answer-compare>div{min-width:0;padding:11px;border:1px solid var(--line,#d9e1e7);border-radius:9px}.tb-answer-compare span{display:block;text-transform:uppercase;font-size:11px;color:var(--muted,#526575);margin-bottom:4px}.tb-answer-compare strong{font-size:14px}.tb-explanation{margin:12px 0;padding:14px;border-left:3px solid var(--teal,#087f8c);border-radius:7px;background:var(--tint,#f2f6f8);font-size:14px;line-height:1.65}.tb-explanation-title{font-weight:700;margin-bottom:6px}.tb-review-rationales{margin-top:10px}.tb-review-rationales summary{cursor:pointer;font-weight:600}.tb-review-lesson{color:var(--teal,#087f8c);font-size:13px;font-weight:600}.tb-review-newtab{font-size:11px;font-weight:400}.tb-review-empty{padding:20px;border:1px dashed var(--line,#d9e1e7);border-radius:9px}
.tb-retry-option{display:flex;align-items:flex-start;gap:10px;width:100%;padding:12px;border:1px solid var(--line,#d9e1e7);border-radius:9px;background:var(--card,#fff);color:var(--ink,#172b3a);font:inherit;text-align:left}.tb-retry-option.selected{outline:2px solid var(--teal,#087f8c);outline-offset:1px}.tb-retry-feedback{margin-top:14px;padding:12px;border-radius:8px;border:1px solid currentColor}.tb-retry-feedback.correct{color:var(--review-good)}.tb-retry-feedback.wrong{color:var(--review-bad)}#tb-feedback-loop .tb-answer-copy,#tb-feedback-loop strong,#tb-feedback-loop a,#tb-feedback-loop .tb-explanation,#tb-feedback-loop .tb-retry-option{overflow-wrap:anywhere;min-width:0}#tb-feedback-loop svg{max-width:100%}
html[data-theme="dark"] #tb-feedback-loop{--review-good:#6ee7b7;--review-bad:#fca5a5;--review-warn:#f0c36a}
@media(max-width:760px){#tb-feedback-loop{padding:15px}.tb-feedback-head,.tb-review-card-head{flex-direction:column}.tb-answer-compare{grid-template-columns:1fr}.tb-review-option{grid-template-columns:auto minmax(0,1fr)}.tb-answer-tags{grid-column:1/-1}.tb-review-card{padding:14px}.tb-feedback-actions>button{flex:1 1 180px}}
`;
    document.head.appendChild(style);
  }
  function onCompleted(event) {
    const current = snapshot(event.detail);
    if (!disposed && current && (!activeExam() || current.examId === activeExam())) { candidate = current; schedule(); }
  }
  function destroy() {
    disposed = true;
    observer?.disconnect();
    if (frame != null) window.cancelAnimationFrame(frame);
    frame = null;
    scheduled = false;
    document.removeEventListener('DOMContentLoaded', initialize);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('tb:attempt-completed', onCompleted);
    reset();
  }
  window.__TBCurrentAttemptReview = Object.freeze({version: 1, destroy});
  // Content-only question renderers use these presentation helpers; no legacy services are restored.
  window.__TBFeedbackPresentation = Object.freeze({referenceHtml: reference, scrollTo: focus});
  function initialize() {
    if (disposed) return;
    installStyles();
    document.addEventListener('click', onClick, true);
    document.addEventListener('tb:attempt-completed', onCompleted);
    observer = new MutationObserver(schedule);
    observer.observe(document.getElementById('test-bank-app') || document.body, {childList: true, subtree: true});
    synchronize();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once: true});
  else initialize();
}());

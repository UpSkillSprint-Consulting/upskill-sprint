(function () {
  'use strict';

  const FORM_NAME = 'test-bank-question-report';

  function examId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function reportId() {
    return 'TB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  function encode(data) {
    return Object.keys(data).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key] == null ? '' : data[key]);
    }).join('&');
  }

  function live(message) {
    const host = document.getElementById('tb-feedback-live');
    if (host) host.textContent = message;
  }

  async function submit(button) {
    const box = button.closest('.tb-report-box');
    const card = button.closest('.tb-review-card');
    if (!box || !card) return;

    const id = reportId();
    const issueType = box.querySelector('[data-report-type]');
    const note = box.querySelector('[data-report-note]');
    const stem = card.querySelector('.tb-review-stem');
    const correct = card.querySelector('.tb-answer-compare > div:nth-child(2) strong');
    const link = box.querySelector('[data-report-link]');

    button.disabled = true;
    button.textContent = 'Submitting…';

    const payload = {
      'form-name': FORM_NAME,
      'report-id': id,
      exam: examId(),
      'issue-type': issueType ? issueType.value : 'Other',
      question: stem ? stem.textContent.trim() : '',
      'stored-answer': correct ? correct.textContent.trim() : '',
      page: window.location.href,
      'reviewer-note': note ? note.value.trim() : ''
    };

    try {
      const response = await fetch('/test-bank-report-form.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload)
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      button.textContent = 'Report submitted';
      const confirmation = document.createElement('p');
      confirmation.className = 'tb-report-confirmation';
      confirmation.setAttribute('role', 'status');
      confirmation.innerHTML = '<strong>Report received.</strong> Reference: <code>' + id + '</code>';
      const prior = box.querySelector('.tb-report-confirmation');
      if (prior) prior.remove();
      box.appendChild(confirmation);
      if (link) link.hidden = true;
      live('Question report submitted. Reference ' + id + '.');
    } catch (error) {
      button.disabled = false;
      button.textContent = 'Retry secure submission';
      if (link) {
        link.hidden = false;
        link.textContent = 'Use email fallback';
      }
      live('The secure report could not be submitted. Use the email fallback or retry.');
    }
  }

  function initialize() {
    document.addEventListener('click', function (event) {
      const button = event.target.closest('[data-prepare-report]');
      if (!button) return;
      event.preventDefault();
      submit(button);
    });
    const style = document.createElement('style');
    style.textContent = '.tb-report-confirmation{margin:0;padding:9px 10px;border:1px solid #1f9d6b;border-radius:8px;background:color-mix(in srgb,#1f9d6b 8%,var(--card));color:var(--ink);font-size:12px}.tb-report-confirmation code{font-weight:700}';
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

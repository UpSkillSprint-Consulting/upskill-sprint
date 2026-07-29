(function () {
  'use strict';

  const STORE_KEY = 'tb-adaptive-mastery-v1';
  let completing = false;

  function latestAdaptiveAttempt() {
    try {
      const store = JSON.parse(localStorage.getItem(STORE_KEY));
      const active = document.querySelector('.tb-tile.active[data-exam]');
      const examId = active ? active.dataset.exam : 'cssbb';
      const attempts = store && store.exams && store.exams[examId] ? store.exams[examId].attempts || [] : [];
      return attempts.slice().reverse().find(function (attempt) { return attempt.source === 'adaptive-practice'; }) || null;
    } catch (error) {
      return null;
    }
  }

  function renderCompletion() {
    completing = false;
    const panel = document.getElementById('tb-adaptive-panel');
    const attempt = latestAdaptiveAttempt();
    if (!panel || !attempt) return;
    const percent = attempt.total ? Math.round(attempt.correct / attempt.total * 100) : 0;
    panel.hidden = false;
    panel.tabIndex = -1;
    panel.innerHTML = '<div class="tb-adaptive-summary"><div class="tb-ring big" style="--p:' + percent + '"><span>' + attempt.correct + '<small>/' + attempt.total + '</small></span></div><div><div class="tb-diag-kick">Adaptive session complete</div><h3>Your mastery map has been updated.</h3><p>The next review dates, weak-area ranking, mistake notebook, and repeated-question trend now reflect this session.</p><div class="tb-adaptive-actions"><button type="button" class="btn btn-teal" data-start-adaptive>Build another session</button><button type="button" class="tb-ghost" data-close-adaptive>Return to results</button></div></div></div>';
    panel.focus();
    const live = document.getElementById('tb-feedback-live');
    if (live) live.textContent = 'Adaptive practice complete. ' + attempt.correct + ' of ' + attempt.total + ' correct. Mastery map updated.';
  }

  function initialize() {
    document.addEventListener('click', function (event) {
      const button = event.target.closest('[data-adaptive-next]');
      if (!button || !/finish session/i.test(button.textContent) || completing) return;
      completing = true;
      requestAnimationFrame(function () { requestAnimationFrame(renderCompletion); });
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());

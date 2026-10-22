(function () {
  'use strict';

  const root = document.getElementById('lesson-fragment-root');
  if (!root || root.dataset.minitabLoaderStarted === 'true') return;
  root.dataset.minitabLoaderStarted = 'true';

  const base = '/lessons/assets/minitab-control-chart-selection-analysis/';
  const fragments = [
    '01-intro-foundations.html',
    '02-selector.html',
    '03a-categories-core.html',
    '03b-categories-advanced.html',
    '04-workflow-example.html',
    '05-lab-interpretation.html',
    '06-mistakes-practice-quiz.html',
    '07-summary.html'
  ];

  function initialise() {
    root.removeAttribute('aria-live');
    const src = '/lessons/assets/minitab-control-chart-selection-analysis.js';
    if (!document.querySelector('script[src="' + src + '"]')) {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.addEventListener('error', function () {
        console.error('The interactive control-chart script could not be loaded.');
      });
      document.body.appendChild(script);
    }

    window.requestAnimationFrame(function () {
      const hash = window.location.hash;
      if (!hash) return;
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch (_) { return; }
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ block: 'start' });
    });
  }

  if (root.dataset.prerendered === 'true' && root.querySelector('#selector-form') &&
      root.querySelector('#imr-data') && root.querySelector('#quiz-form')) {
    initialise();
    return;
  }

  Promise.all(fragments.map(function (name) {
    return fetch(base + name, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error('Could not load ' + name + ': ' + response.status);
      return response.text();
    });
  })).then(function (parts) {
    root.innerHTML = parts.join('');
    initialise();
  }).catch(function (error) {
    console.error(error);
    root.innerHTML = '<section class="lesson-section"><h1>Lesson content could not be loaded</h1><p>Please refresh the page. If the problem continues, return to the lesson library and try again.</p><p><a class="back-link" href="/lessons#power-bi-excel-sql">Back to Power BI, Excel &amp; SQL</a></p></section>';
  });
}());

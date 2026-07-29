(function () {
  'use strict';

  const root = document.getElementById('lesson-fragment-root');
  if (!root) return;

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

  Promise.all(fragments.map(function (name) {
    return fetch(base + name, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error('Could not load ' + name + ': ' + response.status);
      return response.text();
    });
  })).then(function (parts) {
    root.removeAttribute('aria-live');
    root.innerHTML = parts.join('');

    const script = document.createElement('script');
    script.src = '/lessons/assets/minitab-control-chart-selection-analysis.js';
    script.defer = true;
    script.addEventListener('error', function () {
      console.error('The interactive control-chart script could not be loaded.');
    });
    document.body.appendChild(script);
  }).catch(function (error) {
    console.error(error);
    root.innerHTML = '<section class="lesson-section"><h1>Lesson content could not be loaded</h1><p>Please refresh the page. If the problem continues, return to the lesson library and try again.</p></section>';
  });
}());

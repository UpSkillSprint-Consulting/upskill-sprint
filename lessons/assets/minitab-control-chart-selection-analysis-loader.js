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
  const scripts = [
    '/lessons/assets/minitab-control-chart-selector.js',
    '/lessons/assets/minitab-control-chart-lab.js',
    '/lessons/assets/minitab-control-chart-quiz.js'
  ];

  function loadScript(path) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = path;
      script.defer = true;
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', function () {
        reject(new Error('Could not load ' + path));
      }, { once: true });
      document.body.appendChild(script);
    });
  }

  Promise.all(fragments.map(function (name) {
    return fetch(base + name, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error('Could not load ' + name + ': ' + response.status);
      return response.text();
    });
  })).then(function (parts) {
    root.removeAttribute('aria-live');
    root.innerHTML = parts.join('');
    return scripts.reduce(function (chain, path) {
      return chain.then(function () { return loadScript(path); });
    }, Promise.resolve());
  }).catch(function (error) {
    console.error(error);
    root.innerHTML = '<section class="lesson-section"><h1>Lesson content could not be loaded</h1><p>Please refresh the page. If the problem continues, return to the lesson library and try again.</p></section>';
  });
}());

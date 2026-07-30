(function () {
  'use strict';

  const scripts = [
    '/lessons/assets/minitab-control-chart-selector.js',
    '/lessons/assets/minitab-control-chart-lab.js',
    '/lessons/assets/minitab-control-chart-quiz.js'
  ];

  function loadNext(index) {
    if (index >= scripts.length) {
      document.body.classList.add('minitab-control-chart-lesson-ready');
      return;
    }

    const src = scripts[index];
    if (document.querySelector('script[src="' + src + '"]')) {
      loadNext(index + 1);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function () {
      loadNext(index + 1);
    });
    script.addEventListener('error', function () {
      console.error('The lesson interaction script could not be loaded: ' + src);
      loadNext(index + 1);
    });
    document.body.appendChild(script);
  }

  loadNext(0);
}());

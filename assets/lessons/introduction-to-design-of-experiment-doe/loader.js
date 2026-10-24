(function () {
  'use strict';

  const cssParts = ['/assets/lessons/introduction-to-design-of-experiment-doe/style-1.txt', '/assets/lessons/introduction-to-design-of-experiment-doe/style-2.txt', '/assets/lessons/introduction-to-design-of-experiment-doe/style-3.txt'];
  const htmlParts = ['/assets/lessons/introduction-to-design-of-experiment-doe/content-1.txt', '/assets/lessons/introduction-to-design-of-experiment-doe/content-2.txt', '/assets/lessons/introduction-to-design-of-experiment-doe/content-3.txt'];
  const jsParts = ['/assets/lessons/introduction-to-design-of-experiment-doe/app-1.txt', '/assets/lessons/introduction-to-design-of-experiment-doe/app-2.txt', '/assets/lessons/introduction-to-design-of-experiment-doe/app-3.txt', '/assets/lessons/introduction-to-design-of-experiment-doe/app-4.txt'];

  async function readParts(paths) {
    const responses = await Promise.all(paths.map(function (path) {
      return fetch(path, { credentials: 'same-origin' }).then(function (response) {
        if (!response.ok) throw new Error('Unable to load ' + path + ' (' + response.status + ')');
        return response.text();
      });
    }));
    return responses.join('');
  }

  async function startLesson() {
    const host = document.getElementById('doeLessonContent');
    if (!host) return;

    // Build-time pre-render (scripts/render-js-lessons.mjs) inlines the
    // styles and content; only the application code still needs to run.
    const inlineApp = host.dataset.prerendered === 'true' && document.getElementById('doe-lesson-app');
    if (inlineApp) {
      try {
        new Function(inlineApp.textContent + '\n//# sourceURL=introduction-to-design-of-experiment-doe.js')();
      } catch (error) {
        console.error(error);
      }
      return;
    }

    try {
      const results = await Promise.all([
        readParts(cssParts),
        readParts(htmlParts),
        readParts(jsParts)
      ]);

      const style = document.createElement('style');
      style.id = 'doe-lesson-styles';
      style.textContent = results[0];
      document.head.appendChild(style);

      host.innerHTML = results[1];

      const runLesson = new Function(results[2] + '\n//# sourceURL=introduction-to-design-of-experiment-doe.js');
      runLesson();
    } catch (error) {
      console.error(error);
      host.innerHTML = '<section class="notice danger-notice"><strong>Lesson loading error:</strong> The interactive lesson files could not be loaded. Refresh the page or try again in a moment.</section>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLesson, { once: true });
  } else {
    startLesson();
  }
}());

(function () {
  'use strict';

  const cssParts = ["/assets/lessons/introduction-to-design-of-experiment-doe/style-01.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/style-02.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/style-03.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/style-04.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/style-05.txt"];
  const htmlParts = ["/assets/lessons/introduction-to-design-of-experiment-doe/content-01.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/content-02.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/content-03.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/content-04.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/content-05.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/content-06.txt"];
  const jsParts = ["/assets/lessons/introduction-to-design-of-experiment-doe/app-01.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/app-02.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/app-03.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/app-04.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/app-05.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/app-06.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/app-07.txt", "/assets/lessons/introduction-to-design-of-experiment-doe/app-08.txt"];

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

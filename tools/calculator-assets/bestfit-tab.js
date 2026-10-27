/* Best-Fit Model Finder tab in the Engineering & Statistics Calculator.
 * The finder is public. Its scripts (and the shared math renderer) load on the first
 * visit to the tab, so the calculator's first paint stays as light as before.
 */
(function () {
  'use strict';
  var tab = document.querySelector('#calculator-shell .tab[data-page="pg-fit"]');
  if (!tab || !document.getElementById('pg-fit')) return;
  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    if (!window.UpskillMath && !document.querySelector('script[src="/assets/js/math.js"]')) {
      var m = document.createElement('script'); m.src = '/assets/js/math.js'; m.defer = true; document.head.appendChild(m);
    }
    ['/tools/best-fit-model-finder-core.js', '/tools/best-fit-model-finder-ui.js'].reduce(function (chain, src) {
      return chain.then(function () {
        return new Promise(function (resolve, reject) {
          var s = document.createElement('script');
          s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error(src)); };
          document.body.appendChild(s);
        });
      });
    }, Promise.resolve()).catch(function () {
      loaded = false;
      var note = document.getElementById('bfm-load-status');
      if (note) { note.textContent = 'The finder could not load. Check your connection and open the tab again.'; note.className = 'bfm-note bfm-error'; }
    });
  }
  tab.addEventListener('click', load);
  if (tab.classList.contains('active')) load();
})();

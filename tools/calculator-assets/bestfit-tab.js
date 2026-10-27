/* Best-Fit Model Finder tab in the Engineering & Statistics Calculator.
 * The tab and its workspace-picker option stay hidden unless the server reports the signed-in
 * account's access level as administrator (public.current_access_level(), the same RPC the
 * Account menu uses; never editable user metadata). No content rule is needed for the tab.
 * This is a soft gate: the markup ships with the public calculator.
 * The finder scripts load on the first visit to the tab.
 */
(function () {
  'use strict';
  var REQUIRED = 'administrator';
  var tab = document.querySelector('#calculator-shell .tab[data-page="pg-fit"]');
  var page = document.getElementById('pg-fit');
  var picker = document.getElementById('calc-workspace');
  if (!tab || !page) return;
  var option = picker ? picker.querySelector('option[value="pg-fit"]') : null;
  if (option) option.remove();
  var granted = false, loaded = false, revision = 0;

  function hide() {
    granted = false;
    tab.hidden = true;
    if (option && option.parentNode) option.remove();
    if (tab.classList.contains('active')) {
      var first = document.querySelector('#calculator-shell .tab[data-page]:not([hidden])');
      if (first) first.click();
    }
  }
  function show() {
    granted = true;
    tab.hidden = false;
    if (picker && option && !option.parentNode) {
      var after = picker.querySelector('option[value="pg-lookup"]');
      picker.insertBefore(option, after ? after.nextSibling : null);
    }
  }
  function load() {
    if (!granted || loaded) return;
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

  function check() {
    var auth = window.UpskillAuth;
    if (!auth || typeof auth.onChange !== 'function') { window.setTimeout(check, 50); return; }
    if (typeof auth.isConfigured === 'function' && !auth.isConfigured()) { hide(); return; }
    auth.onChange(function (user) {
      var mine = ++revision;
      if (!user) { hide(); return; }
      var client = auth.getClient && auth.getClient();
      if (!client || typeof client.rpc !== 'function') { hide(); return; }
      Promise.resolve().then(function () { return client.rpc('current_access_level'); })
        .then(function (result) {
          if (mine !== revision) return;
          if (result && !result.error && result.data === REQUIRED) show(); else hide();
        })
        .catch(function () { if (mine === revision) hide(); });
    });
  }
  hide();
  check();
  window.BestFitTab = { isGranted: function () { return granted; } };
})();

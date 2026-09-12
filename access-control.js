/* Supabase-backed access gate for protected UpSkill Sprint content.
   Authorization comes from public.can_access_content(), whose result is
   calculated from server-managed grants and RLS-protected tables. */
(function () {
  'use strict';

  function returnPath() {
    return window.location.pathname + window.location.search;
  }

  function redirect(path) {
    window.location.replace(path);
  }

  function gate() {
    var body = document.body;
    if (!body) return;
    var resourceKey = body.getAttribute('data-access-resource');
    if (!resourceKey) return;
    var premium = body.getAttribute('data-required-access') === 'premium';
    var deniedPath = premium ? '/lessons.html?access=premium#exam-practice' : '/engineering-tools.html?access=administrator';
    var unavailablePath = premium ? '/lessons.html?access=unavailable#exam-practice' : '/engineering-tools.html?access=unavailable';

    var auth = window.UpskillAuth;
    if (!auth || typeof auth.onChange !== 'function') {
      window.setTimeout(gate, 30);
      return;
    }

    if (typeof auth.isConfigured !== 'function' || !auth.isConfigured()) {
      redirect(unavailablePath);
      return;
    }

    var revision = 0;
    var settled = false;
    var timeout = window.setTimeout(function () {
      if (settled) return;
      settled = true;
      revision += 1;
      redirect(unavailablePath);
    }, 8000);

    auth.onChange(function (user) {
      var currentRevision = ++revision;
      body.classList.remove('auth-ready');
      body.classList.remove('access-ready');
      if (!user) {
        settled = true;
        window.clearTimeout(timeout);
        redirect('/sign-in.html?next=' + encodeURIComponent(returnPath()));
        return;
      }

      var client = auth.getClient && auth.getClient();
      if (!client || typeof client.rpc !== 'function') {
        settled = true;
        window.clearTimeout(timeout);
        redirect(unavailablePath);
        return;
      }

      /* Defer Supabase calls outside its auth state-change callback. */
      Promise.resolve().then(function () { return client.rpc('can_access_content', {
        requested_resource_key: resourceKey
      }); }).then(function (result) {
        if (currentRevision !== revision) return;
        settled = true;
        window.clearTimeout(timeout);
        if (result && !result.error && result.data === true) {
          body.classList.add('auth-ready');
          body.classList.add('access-ready');
          return;
        }
        redirect(deniedPath);
      }).catch(function () {
        if (currentRevision !== revision) return;
        settled = true;
        window.clearTimeout(timeout);
        redirect(unavailablePath);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', gate, { once: true });
  } else {
    gate();
  }
}());

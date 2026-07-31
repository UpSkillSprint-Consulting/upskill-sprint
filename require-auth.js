/* Client-side sign-in gate for UpSkill Sprint Consulting.

   A page opts in by adding a `data-require-auth` attribute to its <body>.
   This file is loaded site-wide by site-sections.js (after auth.js, so
   window.UpskillAuth is available) and no-ops on every page that does not
   opt in.

   IMPORTANT — this is a SOFT gate. It exists to require an account before
   using a tool (to drive sign-ups), not to hide anything: the page content
   still ships to the browser and the check runs client-side. It is a UX
   gate, not access control. Do not rely on it for secrecy. */
(function () {
  'use strict';

  function reveal(body) {
    body.classList.add('auth-ready');
  }

  function gate() {
    var body = document.body;
    if (!body || !body.hasAttribute('data-require-auth')) return;

    var auth = window.UpskillAuth;
    if (!auth || typeof auth.onChange !== 'function') {
      /* auth.js has not executed yet; retry shortly. Only reached on gated
         pages, so this never schedules a timer on ordinary pages. */
      window.setTimeout(gate, 30);
      return;
    }

    /* Fail open: if accounts are not configured, never trap a visitor behind
       a gate they cannot pass. A soft gate must not become a hard lockout
       (e.g. during an auth outage, visitors keep their access). */
    if (typeof auth.isConfigured === 'function' && !auth.isConfigured()) {
      reveal(body);
      return;
    }

    var settled = false;
    auth.onChange(function (user) {
      if (settled) return; /* act once, on the first resolved session state */
      settled = true;
      if (user) {
        reveal(body);
      } else {
        var here = window.location.pathname + window.location.search;
        window.location.replace('/sign-in.html?next=' + encodeURIComponent(here));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', gate);
  } else {
    gate();
  }
})();

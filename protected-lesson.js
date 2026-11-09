/* Loads the protected body of a gated lesson into its public teaser page.

   The lesson page itself is a public preview (title, objectives, first part) with a
   sign-in panel inside <div data-protected-lesson="lesson:/lessons/…">. Search
   engines and signed-out visitors see exactly that. For a signed-in visitor this
   script asks /api/lesson-content (netlify/functions/lesson-content.mjs) for the
   rest, with the visitor's Supabase access token. The function checks the session
   and public.can_access_content() before it returns anything, so the full lesson
   is never part of the static site.

   On 200 the fragment replaces the sign-in panel, its scripts run in order, math
   is typeset, and `upskill-lesson-content-ready` is dispatched on document.
   On 401 the sign-in panel stays; on 403 an access notice is shown; on any other
   failure the panel offers "Try again". Nothing falls back to showing content.

   Contract: docs/LESSON_CREATION_GUIDE.md §12.8. Loaded only by teaser pages:
     <script defer src="/protected-lesson.js"></script>  */
(function () {
  'use strict';

  var ENDPOINT = '/api/lesson-content';
  var TIMEOUT_MS = 12000;
  var AUTH_WAIT_MS = 12000;
  var CONTACT = 'mailto:hello@upskillsprint.com?subject=' + encodeURIComponent('Request for lesson access');

  var mount = document.querySelector('[data-protected-lesson]');
  if (!mount || mount.__upskillProtectedLesson) return;
  mount.__upskillProtectedLesson = true;

  var resource = mount.getAttribute('data-protected-lesson') || '';
  var route = window.location.pathname.replace(/\.html$/i, '').replace(/\/+$/, '') || '/';
  /* A teaser may only ask for its own lesson. */
  if (resource !== 'lesson:' + route) return;

  var gateHtml = mount.innerHTML;
  var auth = null;
  var userId = null;
  var revision = 0;
  var controller = null;
  var authTimer = null;

  function statusEl() { return mount.querySelector('[data-protected-lesson-status]'); }
  function offerEl() { return mount.querySelector('.lz-gate-offer'); }

  function setState(state) { mount.setAttribute('data-state', state); }

  function announce(text) {
    var status = statusEl();
    if (status) status.textContent = text;
  }

  function signInHref() {
    return '/sign-in.html?next=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
  }

  function restoreGate() {
    if (!offerEl()) mount.innerHTML = gateHtml; /* the lesson was loaded: put the sign-in panel back */
    var notice = mount.querySelector('[data-protected-lesson-notice]');
    if (notice) notice.remove();
    var offer = offerEl();
    if (offer) offer.hidden = false;
    var link = mount.querySelector('a[href^="/sign-in.html"]');
    if (link) link.setAttribute('href', signInHref());
  }

  function showNotice(message, action) {
    restoreGate();
    var offer = offerEl();
    var notice = document.createElement('div');
    notice.setAttribute('data-protected-lesson-notice', '');
    notice.className = 'lz-row';
    if (action === 'contact') {
      if (offer) offer.hidden = true;
      var contact = document.createElement('a');
      contact.className = 'lz-btn';
      contact.href = CONTACT;
      contact.textContent = 'Request access from the site owner';
      notice.appendChild(contact);
    } else if (action === 'retry') {
      if (offer) offer.hidden = true;
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'lz-btn';
      retry.textContent = 'Try again';
      retry.addEventListener('click', function () { userId = null; changed(auth.getUser()); });
      notice.appendChild(retry);
    }
    var status = statusEl();
    if (status && notice.firstChild) status.insertAdjacentElement('afterend', notice);
    announce(message);
  }

  function signedOut(message) {
    setState('signed-out');
    restoreGate();
    announce(message || '');
  }

  function fail(code) {
    setState(code === 403 ? 'denied' : code === 401 ? 'signed-out' : 'error');
    if (code === 401) {
      showNotice('Your sign-in has expired. Sign in again to keep reading.', null);
    } else if (code === 403) {
      showNotice('Your account doesn’t have access to this lesson yet. Contact the site owner to request access.', 'contact');
    } else {
      showNotice('We couldn’t load the rest of this lesson. Check your connection and try again.', 'retry');
    }
  }

  function runScripts(scripts) {
    scripts.forEach(function (old) {
      var script = document.createElement('script');
      Array.prototype.forEach.call(old.attributes, function (attr) { script.setAttribute(attr.name, attr.value); });
      script.text = old.text;
      mount.appendChild(script);
    });
  }

  function insert(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    var scripts = Array.prototype.slice.call(template.content.querySelectorAll('script'));
    scripts.forEach(function (script) { script.remove(); });

    /* Keep one polite live region across the swap so the result is announced. */
    var live = document.createElement('p');
    live.className = 'sr-only';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('data-protected-lesson-status', '');

    mount.replaceChildren(live, template.content);
    setState('ready');
    runScripts(scripts);
    if (window.UpskillMath && typeof window.UpskillMath.typeset === 'function') {
      try { window.UpskillMath.typeset([mount]); } catch (error) { /* math stays as TeX source */ }
    }
    document.dispatchEvent(new CustomEvent('upskill-lesson-content-ready', { detail: { resource: resource, root: mount } }));
    window.setTimeout(function () { live.textContent = 'The full lesson has loaded.'; }, 50);

    var id = '';
    try { id = decodeURIComponent((window.location.hash || '').slice(1)); } catch (error) { id = ''; }
    if (id) {
      var target = document.getElementById(id);
      if (target && mount.contains(target) && typeof target.scrollIntoView === 'function') target.scrollIntoView();
    }
  }

  function load(version) {
    setState('loading');
    announce('Loading the full lesson…');
    var client = auth.getClient && auth.getClient();
    if (!client) { fail(503); return; }
    client.auth.getSession().then(function (result) {
      if (version !== revision) return null;
      var session = result && result.data ? result.data.session : null;
      if (!session || !session.access_token || !session.user || session.user.id !== userId) throw { status: 401 };
      var current = typeof AbortController === 'function' ? new AbortController() : null;
      controller = current;
      var timer = window.setTimeout(function () { if (current) current.abort(); }, TIMEOUT_MS);
      return window.fetch(ENDPOINT + '?resource=' + encodeURIComponent(resource), {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + session.access_token },
        credentials: 'omit',
        cache: 'no-store',
        signal: current ? current.signal : undefined
      }).then(function (response) {
        if (!response.ok) throw { status: response.status };
        return response.json();
      }).finally(function () {
        window.clearTimeout(timer);
        if (controller === current) controller = null;
      });
    }).then(function (data) {
      if (version !== revision || data === null) return;
      if (!data || data.version !== 1 || data.resource !== resource || typeof data.html !== 'string') throw { status: 503 };
      insert(data.html);
    }).catch(function (error) {
      if (version !== revision) return;
      fail(error && (error.status === 401 || error.status === 403) ? error.status : 503);
    });
  }

  function changed(user) {
    window.clearTimeout(authTimer);
    var next = user && user.id ? user.id : null;
    if (next === userId && next !== null) return; /* token refresh for the same account */
    revision += 1;
    if (controller) controller.abort();
    controller = null;
    userId = next;
    if (!userId) { signedOut(''); return; }
    load(revision);
  }

  function install() {
    if (auth || !window.UpskillAuth) return;
    auth = window.UpskillAuth;
    if (typeof auth.isConfigured === 'function' && !auth.isConfigured()) {
      window.clearTimeout(authTimer);
      signedOut('Sign-in is unavailable right now, so the full lesson can’t be opened. Please try again later.');
      return;
    }
    auth.onChange(changed);
  }

  setState('checking');
  authTimer = window.setTimeout(function () {
    if (userId === null && mount.getAttribute('data-state') === 'checking') signedOut('');
  }, AUTH_WAIT_MS);
  document.addEventListener('upskill-auth-ready', install, { once: true });
  install();
}());

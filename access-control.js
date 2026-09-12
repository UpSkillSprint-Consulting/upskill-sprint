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

  /* The public destination explains a denied request without revealing content. */
  function showAccessNotice() {
    var reason = new URLSearchParams(window.location.search).get('access');
    var levels = { premium: 'Premium member or higher', administrator: 'Administrator' };
    var level = Object.prototype.hasOwnProperty.call(levels, reason) ? levels[reason] : null;
    if (!level && reason !== 'unavailable') return;
    if (document.getElementById('access-notice')) return;
    var mount = document.getElementById('exam-practice') || document.querySelector('main');
    if (!mount) return;

    var notice = document.createElement('section');
    notice.id = 'access-notice';
    notice.tabIndex = -1;
    notice.setAttribute('role', 'region');
    notice.setAttribute('aria-labelledby', 'access-notice-title');
    notice.style.cssText = 'max-width:960px;margin:24px auto;padding:24px;border:2px solid var(--teal);border-radius:12px;background:var(--tint);color:var(--ink);scroll-margin-top:100px;';
    var title = document.createElement('h2');
    title.id = 'access-notice-title';
    title.textContent = level ? 'You need a higher access level' : 'We couldn’t check your access';
    var message = document.createElement('p');
    message.textContent = level
      ? 'Your account doesn’t have access to this item yet. It requires ' + level + ' access. Please contact the site owner to request a higher access level. We’d be happy to help!'
      : 'We’re having trouble checking your account right now. Please try opening the item again in a moment. If the problem continues, contact the site owner for help.';
    var contact = document.createElement('a');
    contact.className = 'btn btn-teal';
    contact.href = 'mailto:skillsprintconsulting@gmail.com?subject=' + encodeURIComponent(level ? 'Request for ' + level + ' access' : 'Help with account access');
    contact.textContent = level ? 'Request access from the site owner' : 'Contact the site owner';
    notice.appendChild(title);
    notice.appendChild(message);
    notice.appendChild(contact);
    mount.insertBefore(notice, mount.firstChild);
    notice.focus({ preventScroll: true });
    notice.scrollIntoView({ block: 'start' });
  }

  function gate() {
    var body = document.body;
    if (!body) return;
    var resourceKey = body.getAttribute('data-access-resource');
    if (!resourceKey) {
      showAccessNotice();
      return;
    }
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

/* Site-wide authentication controller for UpSkill Sprint Consulting.
   Follows the /theme.js pattern: single IIFE, vanilla JS, no dependencies
   beyond the vendored Supabase client (/vendor/supabase.js) and
   /supabase-config.js, both loaded before this file by site-sections.js.

   Exposes window.UpskillAuth and injects the Account dropdown into the
   site header. If Supabase is not configured yet, the dropdown still
   renders (Sign in / Sign up links) and auth calls report a clear error. */
(function () {
  'use strict';

  var SIGN_IN_PATH = '/sign-in.html';
  var SIGN_UP_PATH = '/signup.html';
  var PROFILE_PATH = '/profile.html';
  var PLACEHOLDER = 'YOUR_SUPABASE';
  var NOT_CONFIGURED_MESSAGE = 'Accounts are not set up yet. Supabase credentials are missing from supabase-config.js.';

  var client = null;
  var currentSession = null;
  var sessionKnown = false;
  var sessionRevision = 0;
  var listeners = [];

  function getConfig() {
    return window.UPSKILLSPRINT_SUPABASE_CONFIG || null;
  }

  function isConfigured() {
    var config = getConfig();
    return Boolean(
      config && config.url && config.anonKey &&
      config.url.indexOf(PLACEHOLDER) === -1 &&
      config.anonKey.indexOf(PLACEHOLDER) === -1 &&
      window.supabase && typeof window.supabase.createClient === 'function'
    );
  }

  function notifyListeners() {
    var user = getUser();
    listeners.forEach(function (listener) {
      try { listener(user); } catch (error) { /* listener errors stay local */ }
    });
  }

  function getClient() {
    if (client) return client;
    if (!isConfigured()) return null;
    var config = getConfig();
    client = window.supabase.createClient(config.url, config.anonKey);
    var restoreRevision = sessionRevision;
    client.auth.onAuthStateChange(function (_event, session) {
      sessionRevision += 1;
      currentSession = session;
      sessionKnown = true;
      notifyListeners();
    });
    client.auth.getSession().then(function (result) {
      if (sessionRevision !== restoreRevision) return;
      currentSession = result && result.data ? result.data.session : null;
      sessionKnown = true;
      notifyListeners();
    }).catch(function () {
      if (sessionRevision !== restoreRevision) return;
      /* Resolve consumers even when session restoration fails. Protected data
         still relies on RLS; the UI can offer sign-in instead of hanging. */
      currentSession = null;
      sessionKnown = true;
      notifyListeners();
    });
    return client;
  }

  function getUser() {
    return currentSession && currentSession.user ? currentSession.user : null;
  }

  function requireClient() {
    var authClient = getClient();
    if (!authClient) {
      return Promise.reject(new Error(NOT_CONFIGURED_MESSAGE));
    }
    return Promise.resolve(authClient);
  }

  function unwrap(result) {
    if (result && result.error) throw result.error;
    return result ? result.data : null;
  }

  window.UpskillAuth = {
    isConfigured: isConfigured,
    getClient: getClient,
    getUser: getUser,
    signUp: function (email, password, options) {
      options = options || {};
      return requireClient().then(function (authClient) {
        var authOptions = {
          data: {
            display_name: options.displayName || '',
            full_name: options.displayName || '',
            timezone: options.timezone || 'UTC',
            newsletter_opt_in: Boolean(options.newsletterOptIn),
            terms_accepted: Boolean(options.termsAccepted)
          }
        };
        if (options.captchaToken) authOptions.captchaToken = options.captchaToken;
        return authClient.auth.signUp({
          email: email,
          password: password,
          options: authOptions
        }).then(unwrap);
      });
    },
    signIn: function (email, password, captchaToken) {
      return requireClient().then(function (authClient) {
        var payload = { email: email, password: password };
        if (captchaToken) payload.options = { captchaToken: captchaToken };
        return authClient.auth.signInWithPassword(payload).then(unwrap);
      });
    },
    signOut: function () {
      return requireClient().then(function (authClient) {
        return authClient.auth.signOut().then(unwrap);
      });
    },
    resetPassword: function (email, captchaToken) {
      return requireClient().then(function (authClient) {
        var options = {
          redirectTo: window.location.origin + '/update-password.html'
        };
        if (captchaToken) options.captchaToken = captchaToken;
        return authClient.auth.resetPasswordForEmail(email, options).then(unwrap);
      });
    },
    resendSignup: function (email, captchaToken) {
      return requireClient().then(function (authClient) {
        var options = { emailRedirectTo: window.location.origin + '/' };
        if (captchaToken) options.captchaToken = captchaToken;
        return authClient.auth.resend({
          type: 'signup',
          email: email,
          options: options
        }).then(unwrap);
      });
    },
    updatePassword: function (newPassword) {
      return requireClient().then(function (authClient) {
        return authClient.auth.updateUser({ password: newPassword }).then(unwrap);
      });
    },
    onChange: function (listener) {
      if (typeof listener !== 'function') return;
      listeners.push(listener);
      if (sessionKnown) listener(getUser());
    }
  };

  /* ---------- Account dropdown ---------- */

  function injectStyles() {
    if (document.getElementById('account-menu-styles')) return;
    var style = document.createElement('style');
    style.id = 'account-menu-styles';
    style.textContent = [
      '.account-menu { position: relative; }',
      '.account-menu-btn { display: inline-flex; align-items: center; gap: 6px;',
      '  padding: 8px 14px; border-radius: var(--radius, 6px);',
      '  border: 1px solid var(--line, #e3e7ee); background: transparent;',
      '  color: var(--ink, #101828); font-family: inherit; font-size: 14px;',
      '  font-weight: 600; cursor: pointer;',
      '  transition: background-color .2s ease, color .2s ease, border-color .2s ease; }',
      '.account-menu-btn:hover { background: var(--tint, #f5f7fa); }',
      '.account-menu-btn svg { transition: transform .15s ease; }',
      '.account-menu-btn[aria-expanded="true"] svg { transform: rotate(180deg); }',
      '.account-menu-panel { position: absolute; right: 0; top: calc(100% + 8px);',
      '  min-width: 200px; padding: 8px; z-index: 80;',
      '  background: var(--card, #ffffff); border: 1px solid var(--line, #e3e7ee);',
      '  border-radius: var(--radius, 6px); box-shadow: 0 10px 28px rgba(16,24,40,.14); }',
      '.account-menu-label { font-size: 11.5px; font-weight: 700; letter-spacing: .06em;',
      '  text-transform: uppercase; color: var(--muted, #667085); margin: 4px 12px 6px; }',
      '.account-menu-name { font-size: 15px; font-weight: 650; color: var(--ink, #101828);',
      '  margin: 0; padding: 0 12px 3px; overflow-wrap: anywhere; }',
      '.account-menu-email { font-size: 12.5px; color: var(--muted, #667085);',
      '  margin: 0; padding: 0 12px 9px; word-break: break-all; }',
      '.account-menu-panel a, .account-menu-panel button {',
      '  display: block; width: 100%; text-align: left; padding: 9px 12px;',
      '  border: none; border-radius: 4px; background: none; cursor: pointer;',
      '  color: var(--ink, #101828); font-family: inherit; font-size: 14.5px;',
      '  font-weight: 500; text-decoration: none; }',
      '.account-menu-panel a:hover, .account-menu-panel button:hover {',
      '  background: var(--tint, #f5f7fa); color: var(--ink, #101828); }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function chevronSvg() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M6 9l6 6 6-6');
    svg.appendChild(path);
    return svg;
  }

  function profileDisplayName(user, profile) {
    var metadata = user && user.user_metadata ? user.user_metadata : {};
    var profileMatchesUser = Boolean(profile && user && profile.user_id === user.id);
    var candidate = profileMatchesUser ? profile.display_name : '';
    if (!candidate) candidate = metadata.display_name || metadata.full_name || metadata.name;
    candidate = String(candidate || '').replace(/\s+/g, ' ').trim();
    return candidate.length >= 2 ? candidate : 'Learner';
  }

  function renderPanel(panel, user, profile) {
    panel.textContent = '';

    var label = document.createElement('p');
    label.className = 'account-menu-label';
    label.textContent = user ? 'Signed in' : 'Welcome';
    panel.appendChild(label);

    if (user) {
      var name = document.createElement('p');
      name.className = 'account-menu-name';
      name.id = 'account-menu-name';
      name.textContent = profileDisplayName(user, profile);
      panel.appendChild(name);

      var email = document.createElement('p');
      email.className = 'account-menu-email';
      email.id = 'account-menu-email';
      email.textContent = user.email || '';
      panel.appendChild(email);

      var profileLink = document.createElement('a');
      profileLink.href = PROFILE_PATH;
      profileLink.id = 'account-menu-profile';
      profileLink.textContent = 'Profile & preferences';
      panel.appendChild(profileLink);

      var signOut = document.createElement('button');
      signOut.type = 'button';
      signOut.id = 'account-menu-signout';
      signOut.textContent = 'Sign out';
      signOut.addEventListener('click', function () {
        window.UpskillAuth.signOut().catch(function () { /* stay signed in on failure */ });
      });
      panel.appendChild(signOut);
    } else {
      var signIn = document.createElement('a');
      signIn.href = SIGN_IN_PATH;
      signIn.id = 'account-menu-signin';
      signIn.textContent = 'Sign in';
      panel.appendChild(signIn);

      var signUp = document.createElement('a');
      signUp.href = SIGN_UP_PATH;
      signUp.id = 'account-menu-signup';
      signUp.textContent = 'Sign up';
      panel.appendChild(signUp);
    }
  }

  function findMenuMount() {
    /* index.html groups header controls in .header-actions; other pages
       place the CTA button directly in header.site. Support both. */
    var actions = document.querySelector('header.site .header-actions');
    if (actions) return { parent: actions, before: actions.firstChild };
    var header = document.querySelector('header.site');
    if (!header) return null;
    return { parent: header, before: header.querySelector('.header-cta') };
  }

  function buildAccountMenu() {
    var mount = findMenuMount();
    if (!mount || document.getElementById('account-menu')) return;

    injectStyles();

    var container = document.createElement('div');
    container.className = 'account-menu';
    container.id = 'account-menu';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'account-menu-btn';
    button.id = 'account-menu-btn';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.appendChild(document.createTextNode('Account'));
    button.appendChild(chevronSvg());

    var panel = document.createElement('div');
    panel.className = 'account-menu-panel';
    panel.id = 'account-menu-panel';
    panel.hidden = true;

    function setOpen(open) {
      panel.hidden = !open;
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
      setOpen(panel.hidden);
    });
    document.addEventListener('click', function (event) {
      if (!panel.hidden && !container.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        button.focus();
      }
    });

    var menuUser = getUser();
    var menuUserId = menuUser ? menuUser.id : null;
    var menuProfile = window.UpskillProfile ? window.UpskillProfile.getCurrent() : null;
    if (!menuProfile || menuProfile.user_id !== menuUserId) menuProfile = null;
    renderPanel(panel, menuUser, menuProfile);
    window.UpskillAuth.onChange(function (user) {
      var nextUserId = user ? user.id : null;
      if (!nextUserId || nextUserId !== menuUserId) menuProfile = null;
      menuUserId = nextUserId;
      renderPanel(panel, user, menuProfile);
    });
    document.addEventListener('upskill-profile-change', function (event) {
      var user = getUser();
      var nextProfile = event.detail && event.detail.profile ? event.detail.profile : null;
      if (!user || !nextProfile) menuProfile = null;
      else if (nextProfile.user_id === user.id) menuProfile = nextProfile;
      renderPanel(panel, user, menuProfile);
    });

    container.appendChild(button);
    container.appendChild(panel);
    mount.parent.insertBefore(container, mount.before);
  }

  function initialize() {
    getClient(); /* begins session restore when configured; harmless otherwise */
    buildAccountMenu();
    document.dispatchEvent(new CustomEvent('upskill-auth-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());

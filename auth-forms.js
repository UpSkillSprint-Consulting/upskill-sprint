/* Shared auth-form UX: accessible password controls, consistent errors, and
   optional Cloudflare Turnstile support. Turnstile stays dormant until a site
   key is configured in supabase-config.js. */
(function () {
  'use strict';

  var MIN_PASSWORD_LENGTH = 12;
  var COMMON_PASSWORDS = [
    'password', 'password1', 'password123', 'qwerty', 'qwerty123',
    'letmein', 'welcome', 'admin', 'iloveyou', '12345678', '123456789'
  ];
  var turnstileLoader = null;

  function config() {
    return window.UPSKILLSPRINT_SUPABASE_CONFIG || {};
  }

  function captchaSiteKey() {
    return String(config().turnstileSiteKey || '').trim();
  }

  function passwordAssessment(value) {
    var password = String(value || '');
    var lower = password.toLowerCase();
    var isCommon = COMMON_PASSWORDS.some(function (candidate) {
      return lower === candidate || lower.indexOf(candidate) === 0;
    });
    var score = 0;
    if (password.length >= MIN_PASSWORD_LENGTH) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
    if (isCommon) score = 0;
    return {
      valid: password.length >= MIN_PASSWORD_LENGTH && !isCommon,
      isCommon: isCommon,
      score: Math.min(score, 4),
      label: ['Weak', 'Fair', 'Good', 'Strong', 'Very strong'][Math.min(score, 4)]
    };
  }

  function passwordMessage(assessment) {
    if (assessment.isCommon) return 'Choose a less common password.';
    if (!assessment.valid) return 'Use at least ' + MIN_PASSWORD_LENGTH + ' characters.';
    return '';
  }

  function validatePassword(input) {
    if (!input) return false;
    var assessment = passwordAssessment(input.value);
    input.setCustomValidity(passwordMessage(assessment));
    return assessment.valid;
  }

  function injectStyles() {
    if (document.getElementById('auth-form-enhancement-styles')) return;
    var style = document.createElement('style');
    style.id = 'auth-form-enhancement-styles';
    style.textContent = [
      '.auth-password-control{position:relative;display:block}',
      '.auth-password-control input{padding-right:74px!important}',
      '.auth-password-toggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);',
      'border:0;background:transparent;color:var(--teal);font:600 12.5px/1 "Work Sans",sans-serif;cursor:pointer;padding:8px}',
      '.auth-password-meter{height:4px;margin:-6px 0 8px;border-radius:999px;background:var(--line);overflow:hidden}',
      '.auth-password-meter span{display:block;height:100%;width:0;background:#b42318;transition:width .2s ease,background-color .2s ease}',
      '.auth-password-help{margin:0 0 16px;color:var(--muted);font-size:12.5px;line-height:1.5}',
      '.auth-password-help strong{color:var(--ink-soft)}',
      '.auth-captcha{display:flex;justify-content:center;min-height:0;margin:0 0 16px}',
      '.auth-captcha-note{margin:-5px 0 14px;color:var(--muted);font-size:12px;text-align:center}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function enhancePassword(input) {
    if (!input || input.dataset.authEnhanced === 'true') return;
    input.dataset.authEnhanced = 'true';
    input.minLength = MIN_PASSWORD_LENGTH;

    var wrapper = document.createElement('span');
    wrapper.className = 'auth-password-control';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'auth-password-toggle';
    toggle.textContent = 'Show';
    toggle.setAttribute('aria-label', 'Show password');
    toggle.addEventListener('click', function () {
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggle.textContent = showing ? 'Show' : 'Hide';
      toggle.setAttribute('aria-label', (showing ? 'Show' : 'Hide') + ' password');
    });
    wrapper.appendChild(toggle);

    if (input.autocomplete !== 'new-password') return;

    var meter = document.createElement('div');
    meter.className = 'auth-password-meter';
    meter.setAttribute('aria-hidden', 'true');
    var fill = document.createElement('span');
    meter.appendChild(fill);
    wrapper.parentNode.insertBefore(meter, wrapper.nextSibling);

    var help = document.createElement('p');
    help.className = 'auth-password-help';
    help.innerHTML = 'Use <strong>' + MIN_PASSWORD_LENGTH + '+ characters</strong>. A long, unique passphrase works best.';
    meter.parentNode.insertBefore(help, meter.nextSibling);

    function update() {
      var assessment = passwordAssessment(input.value);
      var widths = ['10%', '30%', '55%', '78%', '100%'];
      var colors = ['#b42318', '#b54708', '#b54708', '#0e7490', '#16845b'];
      fill.style.width = input.value ? widths[assessment.score] : '0';
      fill.style.backgroundColor = colors[assessment.score];
      help.innerHTML = input.value
        ? '<strong>' + assessment.label + '.</strong> ' +
          (passwordMessage(assessment) || 'This password meets the minimum requirement.')
        : 'Use <strong>' + MIN_PASSWORD_LENGTH + '+ characters</strong>. A long, unique passphrase works best.';
      validatePassword(input);
    }
    input.addEventListener('input', update);
    input.addEventListener('blur', update);
  }

  function loadTurnstile() {
    if (!captchaSiteKey()) return Promise.resolve(null);
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (turnstileLoader) return turnstileLoader;
    turnstileLoader = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = function () { resolve(window.turnstile); };
      script.onerror = function () { reject(new Error('The security check could not load. Refresh and try again.')); };
      document.head.appendChild(script);
    });
    return turnstileLoader;
  }

  function enhanceCaptcha(form) {
    if (!form || !captchaSiteKey() || form.dataset.captchaEnhanced === 'true') return;
    form.dataset.captchaEnhanced = 'true';
    var submit = form.querySelector('button[type="submit"]');
    var holder = document.createElement('div');
    holder.className = 'auth-captcha';
    holder.setAttribute('aria-label', 'Security check');
    form.insertBefore(holder, submit);
    loadTurnstile().then(function (turnstile) {
      if (!turnstile) return;
      form.dataset.turnstileWidgetId = turnstile.render(holder, {
        sitekey: captchaSiteKey(),
        theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
        callback: function (token) { form.dataset.captchaToken = token; },
        'expired-callback': function () { delete form.dataset.captchaToken; },
        'error-callback': function () { delete form.dataset.captchaToken; }
      });
    }).catch(function (error) {
      var note = document.createElement('p');
      note.className = 'auth-captcha-note';
      note.textContent = error.message;
      holder.appendChild(note);
    });
  }

  function getCaptchaToken(form) {
    if (!captchaSiteKey()) return null;
    var token = form && form.dataset ? form.dataset.captchaToken : '';
    if (!token) throw new Error('Complete the security check, then try again.');
    return token;
  }

  function resetCaptcha(form) {
    if (!form || !window.turnstile || !form.dataset.turnstileWidgetId) return;
    window.turnstile.reset(form.dataset.turnstileWidgetId);
    delete form.dataset.captchaToken;
  }

  function friendlyError(error, fallback) {
    var message = String(error && error.message || '').toLowerCase();
    if (message.indexOf('invalid login') !== -1 || message.indexOf('invalid credentials') !== -1) {
      return 'Email or password is incorrect. Check both fields and try again.';
    }
    if (message.indexOf('already registered') !== -1 || message.indexOf('already exists') !== -1) {
      return 'An account may already exist for this email. Try signing in or resetting your password.';
    }
    if (message.indexOf('captcha') !== -1 || message.indexOf('security check') !== -1) {
      return 'Complete the security check, then try again.';
    }
    if (message.indexOf('rate limit') !== -1 || message.indexOf('too many') !== -1) {
      return 'Too many attempts. Wait a few minutes, then try again.';
    }
    if (message.indexOf('weak password') !== -1 || message.indexOf('leaked') !== -1) {
      return 'Choose a different, unique password that has not appeared in a known data breach.';
    }
    return fallback || 'Something went wrong. Please try again.';
  }

  function initialize() {
    injectStyles();
    Array.prototype.forEach.call(document.querySelectorAll('[data-auth-password]'), enhancePassword);
    Array.prototype.forEach.call(document.querySelectorAll('form[data-auth-form]'), enhanceCaptcha);
    document.dispatchEvent(new CustomEvent('upskill-auth-forms-ready'));
  }

  window.UpskillAuthForms = {
    MIN_PASSWORD_LENGTH: MIN_PASSWORD_LENGTH,
    passwordAssessment: passwordAssessment,
    validatePassword: validatePassword,
    getCaptchaToken: getCaptchaToken,
    resetCaptcha: resetCaptcha,
    friendlyError: friendlyError
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());

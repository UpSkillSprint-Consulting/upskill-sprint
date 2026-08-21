/* Account profile controller. The public.profiles row is the canonical
   display source; auth metadata is only a non-authoritative fallback. */
(function () {
  'use strict';

  var PROFILE_COLUMNS = [
    'user_id',
    'display_name',
    'timezone',
    'newsletter_opt_in',
    'newsletter_consent_at',
    'terms_accepted_at',
    'onboarding_completed',
    'created_at',
    'updated_at'
  ].join(',');

  var currentProfile = null;
  var currentUserId = null;
  var loadPromise = null;
  var listeners = [];

  function normalizeName(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  function browserTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (error) {
      return 'UTC';
    }
  }

  function fallbackName(user) {
    var metadata = user && user.user_metadata ? user.user_metadata : {};
    var name = normalizeName(metadata.display_name || metadata.full_name || metadata.name);
    return name.length >= 2 ? name : 'Learner';
  }

  function notify(profile) {
    currentProfile = profile || null;
    listeners.slice().forEach(function (listener) {
      try { listener(currentProfile); } catch (error) { /* isolate listeners */ }
    });
    document.dispatchEvent(new CustomEvent('upskill-profile-change', {
      detail: { profile: currentProfile }
    }));
  }

  function clientForUser(user) {
    var authClient = window.UpskillAuth && window.UpskillAuth.getClient();
    if (!user || !authClient) return null;
    return authClient;
  }

  function initialProfile(user) {
    var metadata = user.user_metadata || {};
    var optedIn = metadata.newsletter_opt_in === true;
    return {
      user_id: user.id,
      display_name: fallbackName(user),
      timezone: String(metadata.timezone || browserTimezone()).slice(0, 100),
      newsletter_opt_in: optedIn,
      newsletter_consent_at: optedIn ? new Date().toISOString() : null,
      terms_accepted_at: metadata.terms_accepted === true ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
  }

  function fetchProfile(user) {
    var authClient = clientForUser(user);
    if (!authClient) return Promise.resolve(null);
    return authClient.from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(function (result) {
        if (result.error) throw result.error;
        if (result.data) return result.data;

        return authClient.from('profiles')
          .insert(initialProfile(user))
          .select(PROFILE_COLUMNS)
          .single()
          .then(function (insertResult) {
            if (!insertResult.error) return insertResult.data;
            if (insertResult.error.code !== '23505') throw insertResult.error;
            return authClient.from('profiles')
              .select(PROFILE_COLUMNS)
              .eq('user_id', user.id)
              .single()
              .then(function (retryResult) {
                if (retryResult.error) throw retryResult.error;
                return retryResult.data;
              });
          });
      });
  }

  function load(user) {
    if (!user) {
      currentUserId = null;
      loadPromise = null;
      notify(null);
      return Promise.resolve(null);
    }
    if (loadPromise && currentUserId === user.id) return loadPromise;
    currentUserId = user.id;
    loadPromise = fetchProfile(user).then(function (profile) {
      if (currentUserId === user.id) notify(profile);
      return profile;
    }).catch(function (error) {
      loadPromise = null;
      throw error;
    });
    return loadPromise;
  }

  function save(fields) {
    var user = window.UpskillAuth && window.UpskillAuth.getUser();
    var authClient = clientForUser(user);
    if (!user || !authClient) return Promise.reject(new Error('Sign in to update your profile.'));

    var name = normalizeName(fields && fields.display_name);
    if (name.length < 2) return Promise.reject(new Error('Enter a name with at least 2 characters.'));

    var optedIn = Boolean(fields && fields.newsletter_opt_in);
    var timezone = String((fields && fields.timezone) || browserTimezone()).trim().slice(0, 100) || 'UTC';

    return load(user).then(function (existing) {
      var payload = {
        display_name: name,
        timezone: timezone,
        newsletter_opt_in: optedIn,
        newsletter_consent_at: optedIn
          ? ((existing && existing.newsletter_opt_in && existing.newsletter_consent_at) || new Date().toISOString())
          : null,
        updated_at: new Date().toISOString()
      };
      return authClient.from('profiles')
        .update(payload)
        .eq('user_id', user.id)
        .select(PROFILE_COLUMNS)
        .single()
        .then(function (result) {
          if (result.error) throw result.error;
          notify(result.data);
          return authClient.auth.updateUser({
            data: { display_name: name, full_name: name, timezone: timezone }
          }).catch(function () { return null; }).then(function () {
            return result.data;
          });
        });
    });
  }

  window.UpskillProfile = {
    getCurrent: function () { return currentProfile; },
    load: load,
    save: save,
    normalizeName: normalizeName,
    browserTimezone: browserTimezone,
    onChange: function (listener) {
      if (typeof listener !== 'function') return;
      listeners.push(listener);
      if (currentProfile) listener(currentProfile);
    }
  };

  function initialize() {
    if (!window.UpskillAuth) return;
    window.UpskillAuth.onChange(function (user) {
      load(user).catch(function () {
        /* Auth remains usable if the optional profile request is unavailable. */
      });
    });
    document.dispatchEvent(new CustomEvent('upskill-profile-ready'));
  }

  if (window.UpskillAuth) initialize();
  else document.addEventListener('upskill-auth-ready', initialize, { once: true });
}());

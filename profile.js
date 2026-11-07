/* Account profile controller. The public.profiles row is the canonical
   display source; auth metadata is only a non-authoritative fallback. */
(function () {
  'use strict';

  var BASE_COLUMNS = [
    'user_id',
    'display_name',
    'timezone',
    'newsletter_opt_in',
    'newsletter_consent_at',
    'terms_accepted_at',
    'onboarding_completed',
    'created_at',
    'updated_at'
  ];
  var EXTRA_COLUMNS = ['role', 'industry', 'target_certification', 'exam_practice_opt_in', 'monthly_digest_opt_in'];
  var extraAvailable = false;
  function columns() {
    return (extraAvailable ? BASE_COLUMNS.concat(EXTRA_COLUMNS) : BASE_COLUMNS).join(',');
  }

  var currentProfile = null;
  var currentUserId = null;
  var loadPromise = null;
  var listeners = [];
  var ACCOUNT_CHANGED_MESSAGE = 'Your account changed while the profile was being saved. Review the active account and try again.';

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

  function assertActiveUser(userId) {
    var activeUser = window.UpskillAuth && window.UpskillAuth.getUser();
    if (!activeUser || activeUser.id !== userId) {
      throw new Error(ACCOUNT_CHANGED_MESSAGE);
    }
  }

  function initialProfile(user) {
    var metadata = user.user_metadata || {};
    var optedIn = metadata.newsletter_opt_in === true;
    return {
      user_id: user.id,
      display_name: fallbackName(user),
      timezone: String(metadata.timezone || browserTimezone()).slice(0, 100),
      newsletter_opt_in: optedIn,
      onboarding_completed: false
    };
  }

  function fetchProfile(user) {
    var authClient = clientForUser(user);
    if (!authClient) return Promise.resolve(null);
    return authClient.from('profiles')
      .select(columns())
      .eq('user_id', user.id)
      .maybeSingle()
      .then(function (result) {
        if (result.error) throw result.error;
        if (result.data) return result.data;

        return authClient.from('profiles')
          .insert(initialProfile(user))
          .select(columns())
          .single()
          .then(function (insertResult) {
            if (!insertResult.error) return insertResult.data;
            if (insertResult.error.code !== '23505') throw insertResult.error;
            return authClient.from('profiles')
              .select(columns())
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
    if ((currentUserId && currentUserId !== user.id) ||
        (currentProfile && currentProfile.user_id !== user.id)) {
      loadPromise = null;
      notify(null);
    }
    if (loadPromise && currentUserId === user.id) return loadPromise;
    currentUserId = user.id;
    var handledRequest;
    var request = fetchProfile(user).then(function (profile) {
      if (currentUserId === user.id && loadPromise === handledRequest) notify(profile);
      return profile;
    });
    handledRequest = request.catch(function (error) {
      if (currentUserId === user.id && loadPromise === handledRequest) {
        loadPromise = null;
      }
      throw error;
    });
    loadPromise = handledRequest;
    return handledRequest;
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
      assertActiveUser(user.id);
      var payload = {
        display_name: name,
        timezone: timezone,
        newsletter_opt_in: optedIn
      };
      if (fields && fields.role !== undefined) payload.role = fields.role || null;
      if (fields && fields.industry !== undefined) payload.industry = fields.industry || null;
      if (fields && fields.target_certification !== undefined) payload.target_certification = fields.target_certification || null;
      if (fields && fields.exam_practice_opt_in !== undefined) payload.exam_practice_opt_in = Boolean(fields.exam_practice_opt_in);
      if (fields && fields.monthly_digest_opt_in !== undefined) payload.monthly_digest_opt_in = Boolean(fields.monthly_digest_opt_in);
      return authClient.from('profiles')
        .update(payload)
        .eq('user_id', user.id)
        .select(columns())
        .single()
        .then(function (result) {
          if (result.error) throw result.error;
          assertActiveUser(user.id);
          return authClient.auth.updateUser({
            data: { display_name: name, full_name: name, timezone: timezone }
          }).catch(function () { return null; }).then(function () {
            assertActiveUser(user.id);
            loadPromise = Promise.resolve(result.data);
            notify(result.data);
            return result.data;
          });
        });
    });
  }

  window.UpskillProfile = {
    setExtraColumns: function (available) { extraAvailable = Boolean(available); },
    hasExtraColumns: function () { return extraAvailable; },
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

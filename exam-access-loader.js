(function () {
  'use strict';
  var params = new URLSearchParams(window.location.search);
  var exam = params.get('exam');
  var published = ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp'];
  var auth, userId, revision = 0, loaded = false, started = false, stopped = false;
  var checking = null, starting = false, blobs = [], authTimeout;

  function show(title, message, signIn, retry) {
    document.body.classList.remove('exam-access-ready');
    var host = document.getElementById('exam-access-status');
    host.hidden = false;
    host.replaceChildren();
    var heading = document.createElement('h1'); heading.textContent = title;
    var detail = document.createElement('p'); detail.textContent = message;
    host.append(heading, detail);
    if (signIn) {
      var link = document.createElement('a'); link.textContent = 'Sign in';
      link.href = '/sign-in.html?next=' + encodeURIComponent('/test-bank?exam=' + exam);
      host.append(link);
    }
    if (retry) {
      var button = document.createElement('button'); button.type = 'button'; button.textContent = 'Check access again';
      button.addEventListener('click', function () { window.location.replace('/test-bank?exam=' + exam); });
      host.append(button);
    }
    var catalog = document.createElement('a'); catalog.href = '/exam-practice'; catalog.textContent = 'Back to exams'; host.append(catalog);
  }

  function unlock() {
    document.getElementById('exam-access-status').hidden = true;
    document.body.classList.add('exam-access-ready');
  }

  function dispose() { blobs.forEach(function (url) { URL.revokeObjectURL(url); }); blobs = []; }

  function deny(error) {
    if (stopped) return;
    var code = error && error.status === 403 ? 'locked' : error && error.status === 401 ? 'signin' : 'unavailable';
    revision++;
    show(code === 'locked' ? '🔒 This exam is locked' : code === 'signin' ? 'Sign in to open this exam' : 'We could not check your access',
      code === 'locked' ? 'An administrator must grant access to this certification before you can practise.' : code === 'signin' ? 'Use the account your administrator approved.' : 'Please try again. Your exam will stay closed until access is confirmed.', code === 'signin', true);
    if (loaded) {
      // A new document discards the old account's question objects, timers and
      // in-memory attempt. Hiding the old account's screen alone is insufficient.
      stopped = true; dispose();
      window.location.replace('/test-bank?exam=' + exam + '&access=' + code);
    }
  }

  async function requestAccess(checkOnly) {
    var version = revision, expectedUser = userId;
    var client = auth && auth.getClient();
    if (!client) throw { status:503 };
    var result = await client.auth.getSession();
    var session = result && result.data && result.data.session;
    if (result.error || !session || !session.access_token || session.user.id !== expectedUser) throw { status:401 };
    if (version !== revision || stopped) throw { status:401 };
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 12000);
    try {
      var response = await fetch('/.netlify/functions/exam-content?exam=' + exam + (checkOnly ? '&check=1' : ''), {
        headers:{ Authorization:'Bearer ' + session.access_token }, cache:'no-store', credentials:'omit', signal:controller.signal
      });
      if (!response.ok) throw { status:response.status };
      var data = await response.json();
      if (version !== revision || stopped || !auth.getUser() || auth.getUser().id !== expectedUser) throw { status:401 };
      if (!data || data.exam !== exam || checkOnly && data.allowed !== true) throw { status:503 };
      return data;
    } finally { clearTimeout(timeout); }
  }

  function check() {
    if (!checking) checking = requestAccess(true).finally(function () { checking = null; });
    return checking;
  }

  window.__ExamAccess = {
    exam:exam,
    isAssetUrl:function (url) { return blobs.includes(url); },
    start:async function (action) {
      if (!loaded || stopped || starting) return false;
      starting = true;
      var version = revision;
      show('Checking exam access', 'Your practice session will start when access is confirmed.');
      try {
        await check();
        if (version !== revision || stopped) return false;
        unlock(); return action();
      } catch (error) { deny(error); return false; }
      finally { starting = false; }
    }
  };

  async function load() {
    var version = revision;
    try {
      var packet = await requestAccess(false);
      if (version !== revision || stopped) return;
      if (packet.version !== 1 || !Array.isArray(packet.scripts) || !packet.assets) throw { status:503 };
      var replacements = [];
      Object.keys(packet.assets).forEach(function (path) {
        var asset = packet.assets[path], bytes = Uint8Array.from(atob(asset.base64), function (c) { return c.charCodeAt(0); });
        var url = URL.createObjectURL(new Blob([bytes], { type:asset.type }));
        blobs.push(url); replacements.push([path, url]);
      });
      // These scripts come only from our same-origin authenticated endpoint.
      // Tokens are never inserted into scripts, URLs, logs or browser storage.
      loaded = true;
      packet.scripts.forEach(function (source) {
        replacements.forEach(function (pair) { source = source.split('/' + pair[0]).join(pair[1]).split(pair[0]).join(pair[1]); });
        var script = document.createElement('script'); script.textContent = source;
        document.head.append(script); script.remove();
      });
      if (!window.__TB || !window.__TB.EXAMS[exam]) throw { status:503 };
      unlock();
    } catch (error) { if (version === revision) deny(error); }
  }

  function install() {
    if (started || !window.UpskillAuth) return;
    started = true; auth = window.UpskillAuth;
    if (!auth.isConfigured()) { deny({ status:503 }); return; }
    auth.onChange(function (user) {
      clearTimeout(authTimeout);
      var next = user && user.id;
      if (next === userId) return;
      userId = next; revision++;
      var version = revision;
      // Never await a Supabase operation inside its auth event callback.
      Promise.resolve().then(function () {
        if (version !== revision || stopped) return;
        if (loaded && userId) {
          show('Switching accounts', 'Checking this account’s exam access.');
          stopped = true; dispose(); window.location.replace('/test-bank?exam=' + exam); return;
        }
        if (loaded) { deny({ status:401 }); return; }
        if (!userId) deny({ status:401 }); else load();
      });
    });
  }

  function resume() {
    if (!loaded || stopped || document.visibilityState === 'hidden') return;
    var version = revision;
    show('Checking exam access', 'Checking your access before returning to the exam.');
    check().then(function () { if (version === revision && !stopped) unlock(); }).catch(deny);
  }

  function boot() {
    if (!exam) { window.location.replace('/exam-practice'); return; }
    if (!published.includes(exam) || params.getAll('exam').length !== 1) {
      show('This exam is not available', 'Choose a published certification from the exam directory.'); return;
    }
    if (['locked','signin','unavailable'].includes(params.get('access'))) {
      deny({ status:params.get('access') === 'locked' ? 403 : params.get('access') === 'signin' ? 401 : 503 }); return;
    }
    authTimeout = setTimeout(function () { if (!loaded) deny({ status:503 }); }, 12000);
    document.addEventListener('upskill-auth-ready', install, { once:true }); install();
    window.addEventListener('focus', resume);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') document.body.classList.remove('exam-access-ready'); else resume();
    });
    window.addEventListener('pagehide', function () { document.body.classList.remove('exam-access-ready'); });
    window.addEventListener('pageshow', function (event) { if (event.persisted) resume(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true }); else boot();
})();

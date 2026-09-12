(function () {
  'use strict';
  const byId = id => document.getElementById(id);
  let auth, current = null, revision = 0, busy = false;
  function message(text) { byId('admin-status').textContent = text; }
  function lock() { current = null; byId('admin-controls').hidden = true; byId('admin-edit').hidden = true; }
  async function call(args) {
    const result = await auth.getClient().rpc('owner_manage_access', args);
    if (result.error) throw new Error(result.error.message || 'Unable to complete the request.');
    return result.data;
  }
  function render(data) {
    current = data.found ? data : null;
    byId('admin-edit').hidden = !current;
    if (!current) { message('No account found. Check the email and try again.'); return; }
    byId('account-title').textContent = data.email;
    byId('account-current').textContent = 'Current effective level: ' + data.effective_level + (data.is_owner ? '. Owner permissions are protected and cannot be edited here.' : '');
    byId('access-level').value = data.grant ? data.grant.access_key : 'registered';
    const expiry = data.grant && data.grant.expires_at;
    const date = expiry ? new Date(expiry) : null;
    byId('access-expiry').value = date ? new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,16) : '';
    ['access-level','access-expiry','access-save'].forEach(id => { byId(id).disabled = data.is_owner; });
    byId('access-history').replaceChildren();
    (data.history.length ? data.history : [{empty:true}]).forEach(h => {
      const li = document.createElement('li');
      li.textContent = h.empty ? 'No changes recorded yet.' : new Date(h.changed_at).toLocaleString() + ': ' + (h.previous_level || 'registered') + ' → ' + h.new_level + (h.expires_at ? ' (expires ' + new Date(h.expires_at).toLocaleString() + ')' : ' (no expiry)');
      byId('access-history').appendChild(li);
    });
  }
  async function run(args, success) {
    if (busy) return;
    busy = true; const requestRevision = revision;
    byId('admin-controls').inert = true;
    message('Working…');
    try {
      const data = await call(args);
      if (requestRevision !== revision) return;
      render(data); if (data.found) message(success);
    } catch (error) { if (requestRevision === revision) { current = null; byId('admin-edit').hidden = true; message(error.message + ' Please search again.'); } }
    finally { busy = false; byId('admin-controls').inert = false; }
  }
  byId('admin-search').addEventListener('submit', event => {
    event.preventDefault();
    run({operation:'search',account_email:byId('account-email').value.trim()}, 'Account found. Review the details before saving.');
  });
  byId('admin-edit').addEventListener('submit', event => {
    event.preventDefault(); if (!current || current.is_owner || busy) return;
    const value = byId('access-expiry').value;
    const expiry = value ? new Date(value) : null;
    if (expiry && (!Number.isFinite(expiry.getTime()) || expiry <= new Date())) { message('Choose a future expiry date.'); return; }
    const level = byId('access-level').value;
    if (!window.confirm('Change access for ' + current.email + ' to ' + level + '?')) return;
    run({operation:'save',target_id:current.user_id,new_level:level,expiry:expiry ? expiry.toISOString() : null,expected_grant:current.grant}, 'Access saved. The user should reload the protected page.');
  });
  function initialize() {
    auth = window.UpskillAuth;
    if (!auth || !auth.isConfigured()) { lock(); message('Account services are unavailable. Please reload later.'); return; }
    auth.onChange(user => {
      const check = ++revision; lock(); byId('admin-signin').hidden = !!user;
      if (!user) { message('Please sign in with your owner account.'); return; }
      message('Checking owner access…');
      Promise.resolve().then(() => call({operation:'status'})).then(data => {
        if (check !== revision) return;
        if (!data || data.owner !== true) throw new Error('Owner access is required.');
        byId('admin-controls').hidden = false; message('Ready. Search for an account to manage its access.');
      }).catch(() => { if (check === revision) { lock(); message('This screen is reserved for the site owner, or account services are unavailable.'); } });
    });
  }
  if (window.UpskillAuth) initialize();
  else document.addEventListener('upskill-auth-ready', initialize, {once:true});
}());

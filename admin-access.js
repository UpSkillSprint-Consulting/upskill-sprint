(function () {
  'use strict';
  // Account access (owner only). The static page ships only "Checking access…".
  // The form is built after the existing owner check passes:
  // owner_manage_access {operation:'status'} -> data.owner === true.
  const byId = id => document.getElementById(id);
  const PAGE_PATH = '/admin-access';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const LEVELS = [
    ['registered', 'Registered', 'Standard signed-in account. Every account falls back to this level.'],
    ['premium', 'Premium', 'Premium member content and practice, on top of Registered.'],
    ['special', 'Special', 'Special access arranged outside standard membership.'],
    ['administrator', 'Administrator', 'Can manage exam and tool access. Membership changes stay owner-only.']
  ];
  const LEVEL_NAMES = Object.fromEntries(LEVELS.map(([key, name]) => [key, name]));
  let auth, current = null, revision = 0, busy = false, built = false, pending = null;
  const shell = () => window.UpskillAdminShell;
  function message(text) { const node = byId('admin-status'); if (node) node.textContent = text; }
  function notify(text, tone) { const s = shell(); if (s && typeof s.toast === 'function') s.toast(text, {tone}); }
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function icon(d) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    [['viewBox','0 0 24 24'],['fill','none'],['stroke','currentColor'],['stroke-width','1.8'],['stroke-linecap','round'],['stroke-linejoin','round'],['aria-hidden','true'],['focusable','false']]
      .forEach(([k, v]) => svg.setAttribute(k, v));
    const path = document.createElementNS(SVG_NS, 'path'); path.setAttribute('d', d); svg.appendChild(path);
    return svg;
  }
  function empty(id, title, text, action) {
    const box = el('div', null, 'adm-empty'); box.id = id;
    box.append(icon(id === 'account-empty' ? 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4' : 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'), el('h3', title), el('p', text));
    if (action) { const b = el('button', action.label, 'adm-btn adm-btn--secondary'); b.type = 'button'; b.addEventListener('click', action.run); box.append(b); }
    return box;
  }
  const levelName = key => LEVEL_NAMES[key] || String(key || 'Registered');
  const dateText = value => new Date(value).toLocaleString();
  const selectedLevel = () => { const checked = document.querySelector('input[name="access-level"]:checked'); return checked ? checked.value : 'registered'; };

  /* ---------- Build (owner only) ---------- */
  function build() {
    const title = el('h1', 'Account access', 'adm-page-title'); title.id = 'admin-title'; title.tabIndex = -1;
    const lede = el('p', 'Owner only. Find an account by its complete email, choose an access level and save. Nothing loads in the background.', 'adm-lede');
    const status = el('p', 'Ready. Search for an account to manage its access.', 'adm-help'); status.id = 'admin-status';
    const controls = el('div'); controls.id = 'admin-controls';

    const searchPanel = el('section', null, 'adm-panel'); searchPanel.setAttribute('aria-labelledby', 'account-search-heading');
    const searchHeading = el('h2', 'Find an account', 'adm-section-title'); searchHeading.id = 'account-search-heading';
    const form = el('form', null, 'adm-search'); form.id = 'admin-search';
    const fieldWrap = el('div', null, 'adm-field');
    const label = el('label', 'Account email'); label.htmlFor = 'account-email';
    const input = document.createElement('input');
    Object.assign(input, {id:'account-email', type:'email', required:true, maxLength:254, autocomplete:'off', placeholder:'name@example.com'});
    fieldWrap.append(label, input);
    const searchButton = el('button', 'Search account', 'adm-btn adm-btn--primary'); searchButton.type = 'submit'; searchButton.id = 'account-search-submit';
    form.append(fieldWrap, searchButton);
    const notFound = empty('account-empty', 'No account found', 'Check the complete email address and try again. The account must already exist.',
      {label:'Try another email', run:() => { input.select(); input.focus(); }});
    notFound.hidden = true;
    searchPanel.append(searchHeading, form, notFound);

    const edit = el('form', null, 'adm-panel'); edit.id = 'admin-edit'; edit.hidden = true;
    edit.setAttribute('aria-labelledby', 'account-title');
    const summary = el('div', null, 'adm-summary');
    const who = el('div');
    const accountTitle = el('h2', 'Account'); accountTitle.id = 'account-title'; accountTitle.tabIndex = -1;
    const currentLevel = el('p'); currentLevel.id = 'account-current';
    const chipLine = el('p'); chipLine.id = 'account-chip';
    who.append(accountTitle, currentLevel, chipLine);
    summary.append(who);

    const levels = el('fieldset', null, 'adm-field'); levels.id = 'access-level';
    levels.append(el('legend', 'Access level'));
    LEVELS.forEach(([key, name, help]) => {
      const option = el('label');
      const radio = document.createElement('input');
      Object.assign(radio, {type:'radio', name:'access-level', value:key, id:'access-level-' + key});
      option.append(radio, el('span', name), el('span', help, 'adm-help'));
      levels.append(option);
    });
    const expiryWrap = el('div', null, 'adm-field');
    const expiryLabel = el('label', 'Expires at (your local time; optional)'); expiryLabel.htmlFor = 'access-expiry';
    const expiry = document.createElement('input'); expiry.type = 'datetime-local'; expiry.id = 'access-expiry';
    const expiryHelp = el('p', 'Leave empty for no expiry. Expired grants fall back to Registered.', 'adm-help'); expiryHelp.id = 'access-expiry-help';
    expiry.setAttribute('aria-describedby', expiryHelp.id);
    expiryWrap.append(expiryLabel, expiry, expiryHelp);
    const save = el('button', 'Save access', 'adm-btn adm-btn--primary'); save.type = 'submit'; save.id = 'access-save';
    const saveRow = el('p'); saveRow.append(save);

    const historyHeading = el('h2', 'Recent changes', 'adm-section-title'); historyHeading.id = 'access-history-heading';
    const history = el('ol', null, 'adm-timeline'); history.id = 'access-history'; history.setAttribute('aria-labelledby', historyHeading.id);
    const noHistory = empty('access-history-empty', 'No changes recorded yet', 'Saved changes to this account’s level and expiry will appear here.');
    noHistory.hidden = true;
    edit.append(summary, levels, expiryWrap, saveRow, historyHeading, history, noHistory);
    controls.append(searchPanel, edit);

    const dialog = el('dialog', null, 'adm-dialog'); dialog.id = 'access-confirm-dialog';
    dialog.setAttribute('aria-labelledby', 'access-confirm-title'); dialog.setAttribute('aria-describedby', 'access-confirm-summary');
    const dialogTitle = el('h2', 'Change access?'); dialogTitle.id = 'access-confirm-title';
    const dialogSummary = el('p'); dialogSummary.id = 'access-confirm-summary';
    const actions = el('div');
    const cancel = el('button', 'Cancel', 'adm-btn adm-btn--secondary'); cancel.type = 'button'; cancel.id = 'access-confirm-cancel'; cancel.autofocus = true;
    const confirm = el('button', 'Confirm change', 'adm-btn adm-btn--primary'); confirm.type = 'button'; confirm.id = 'access-confirm-ok';
    actions.append(cancel, confirm);
    dialog.append(dialogTitle, dialogSummary, actions);

    byId('admin-main').replaceChildren(title, lede, status, controls, dialog);
    built = true;
    wire();
  }

  /* ---------- State ---------- */
  function closeConfirm() {
    pending = null;
    const dialog = byId('access-confirm-dialog');
    if (!dialog) return;
    if (dialog.open) dialog.close();
    byId('access-confirm-summary').textContent = '';
  }
  function clearAccount() {
    closeConfirm(); current = null;
    if (!built) return;
    byId('admin-edit').hidden = true; byId('account-empty').hidden = true;
    byId('account-title').textContent = 'Account'; byId('account-current').textContent = '';
    byId('account-chip').replaceChildren(); byId('access-history').replaceChildren();
    byId('access-expiry').value = '';
  }
  function teardown() {
    clearAccount(); built = false;
    const s = shell(); if (s && typeof s.unmount === 'function') s.unmount();
    else { const host = byId('admin-shell-header'); if (host) host.replaceChildren(); }
    const checking = el('p', 'Checking access…', 'adm-checking');
    checking.setAttribute('role', 'status'); checking.setAttribute('aria-live', 'polite');
    byId('admin-main').replaceChildren(checking);
  }
  function deny(signedOut) {
    teardown();
    const s = shell();
    if (s) s.renderDenied(byId('admin-main'), {signedOut, next: PAGE_PATH});
    else byId('admin-main').replaceChildren(el('p', 'This area isn’t available.', 'adm-denied'));
  }
  async function call(args) {
    const result = await auth.getClient().rpc('owner_manage_access', args);
    if (result.error) throw new Error(result.error.message || 'Unable to complete the request.');
    return result.data;
  }
  function render(data) {
    clearAccount();
    current = data.found ? data : null;
    byId('admin-edit').hidden = !current;
    byId('account-empty').hidden = !!current;
    if (!current) { message('No account found. Check the email and try again.'); return; }
    byId('account-title').textContent = data.email;
    byId('account-current').textContent = 'Current effective level: ' + levelName(data.effective_level) + (data.is_owner ? '. Owner permissions are protected and cannot be edited here.' : '');
    byId('account-chip').append(el('span', data.is_owner ? 'Owner (protected)' : 'Level: ' + levelName(data.effective_level), 'adm-chip ' + (data.is_owner ? 'adm-chip--none' : 'adm-chip--active')));
    const level = data.grant ? data.grant.access_key : 'registered';
    document.querySelectorAll('input[name="access-level"]').forEach(radio => { radio.checked = radio.value === level; radio.disabled = data.is_owner; });
    const expiry = data.grant && data.grant.expires_at;
    const date = expiry ? new Date(expiry) : null;
    byId('access-expiry').value = date ? new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,16) : '';
    ['access-expiry','access-save'].forEach(id => { byId(id).disabled = data.is_owner; });
    byId('access-history').replaceChildren();
    data.history.forEach(h => {
      const li = document.createElement('li');
      const time = el('time', dateText(h.changed_at)); time.dateTime = h.changed_at;
      li.append(time, el('p', levelName(h.previous_level || 'registered') + ' → ' + levelName(h.new_level) + (h.expires_at ? ' (expires ' + dateText(h.expires_at) + ')' : ' (no expiry)')));
      byId('access-history').appendChild(li);
    });
    byId('access-history').hidden = data.history.length === 0;
    byId('access-history-empty').hidden = data.history.length > 0;
  }
  async function run(args, success, options = {}) {
    if (busy) return;
    busy = true; const requestRevision = revision;
    const controls = byId('admin-controls');
    controls.inert = true; controls.setAttribute('aria-busy', 'true');
    message('Working…');
    try {
      const data = await call(args);
      if (requestRevision !== revision) return;
      render(data);
      if (data.found) { message(success); if (options.toast) notify(success, 'success'); byId('account-title').focus(); }
    } catch (error) {
      if (requestRevision === revision) {
        current = null; byId('admin-edit').hidden = true;
        const text = error.message + ' Please search again.'; message(text); notify(text, 'error');
      }
    } finally {
      busy = false;
      const node = byId('admin-controls'); if (node) { node.inert = false; node.removeAttribute('aria-busy'); }
    }
  }
  function wire() {
    byId('admin-search').addEventListener('submit', event => {
      event.preventDefault();
      run({operation:'search',account_email:byId('account-email').value.trim()}, 'Account found. Review the details before saving.');
    });
    byId('admin-edit').addEventListener('submit', event => {
      event.preventDefault(); if (!current || current.is_owner || busy || pending) return;
      const value = byId('access-expiry').value;
      const expiry = value ? new Date(value) : null;
      if (expiry && (!Number.isFinite(expiry.getTime()) || expiry <= new Date())) {
        byId('access-expiry').setAttribute('aria-invalid', 'true');
        message('Choose a future expiry date.'); notify('Choose a future expiry date.', 'error'); return;
      }
      byId('access-expiry').removeAttribute('aria-invalid');
      const level = selectedLevel();
      pending = {revision, args:{operation:'save',target_id:current.user_id,new_level:level,expiry:expiry ? expiry.toISOString() : null,expected_grant:current.grant}};
      byId('access-confirm-summary').textContent = 'Account: ' + current.email + '\nNew level: ' + levelName(level) +
        '\nExpiry: ' + (expiry ? expiry.toLocaleString() : 'No expiry') + '\nThe user should reload any protected page after the change.';
      byId('access-confirm-dialog').showModal();
      byId('access-confirm-cancel').focus();
    });
    byId('access-confirm-cancel').addEventListener('click', closeConfirm);
    byId('access-confirm-dialog').addEventListener('cancel', event => { event.preventDefault(); closeConfirm(); });
    byId('access-confirm-ok').addEventListener('click', () => {
      const request = pending; closeConfirm();
      if (!request || request.revision !== revision || !current || current.is_owner || busy || request.args.target_id !== current.user_id) return;
      if (request.args.expiry && new Date(request.args.expiry) <= new Date()) { message('Choose a future expiry date.'); notify('Choose a future expiry date.', 'error'); return; }
      run(request.args, 'Access saved. The user should reload the protected page.', {toast:true});
    });
  }

  /* ---------- Session and gate ---------- */
  function initialize() {
    auth = window.UpskillAuth;
    if (!auth || !auth.isConfigured() || !shell()) { deny(false); return; }
    auth.onChange(user => {
      const check = ++revision; teardown();
      if (!user) { deny(true); return; }
      Promise.resolve().then(() => call({operation:'status'})).then(data => {
        if (check !== revision) return;
        if (!data || data.owner !== true) throw new Error('Owner access is required.');
        shell().mount({page:'accounts', isOwner:true});
        build();
        const title = byId('admin-title');
        if (!document.activeElement || document.activeElement === document.body) title.focus();
      }).catch(() => { if (check === revision) deny(false); });
    });
  }
  if (window.UpskillAuth) initialize();
  else document.addEventListener('upskill-auth-ready', initialize, {once:true});
}());

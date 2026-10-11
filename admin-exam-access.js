(function () {
  'use strict';
  const byId = id => document.getElementById(id);
  const labels = {locked:'Locked',granted:'Access granted',expired:'Expired',revoked:'Revoked',administrator:'Administrator access',coming_soon:'Coming soon',retired:'Retired'};
  let auth, account = null, selected = null, cursor = null, epoch = 0, busy = false, ready = false, active = null, decision = null;
  const message = text => { byId('exam-admin-status').textContent = text; };
  const dateText = value => value ? new Date(value).toLocaleString() : 'No expiry';
  function element(tag, text, className) {
    const node = document.createElement(tag); node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function clearAccount() {
    closeDecision();
    account = selected = null; byId('exam-member').hidden = true; byId('exam-access-edit').hidden = true;
    byId('exam-member-title').textContent = ''; byId('exam-member-note').textContent = '';
    byId('exam-member-cards').replaceChildren(); byId('exam-member-history').replaceChildren();
    byId('exam-grant-expiry').value = '';
  }
  function clearQueue() {
    cursor = null; byId('exam-request-list').replaceChildren(); byId('exam-requests-next').hidden = true;
    byId('exam-requests-status').textContent = 'Load requests to see the latest decisions.';
  }
  function lock() {
    ready = false; clearAccount(); clearQueue(); byId('exam-member-email').value = '';
    byId('exam-admin-controls').hidden = true;
  }
  async function call(args) {
    const controller = new AbortController(); active = controller; let timer;
    try {
      const query = auth.getClient().rpc('admin_manage_exam_access', args).abortSignal(controller.signal);
      const result = await Promise.race([query, new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error('The request timed out. Its result is unconfirmed.')); }, 12000);
      })]);
      if (!result || result.error) throw Object.assign(new Error(result?.error?.message || 'Unable to complete this request.'), {code:result?.error?.code});
      return result.data;
    } finally { clearTimeout(timer); if (active === controller) active = null; }
  }
  async function run(args, render, success) {
    if (busy || !ready) return;
    const requestEpoch = epoch; busy = true; byId('exam-admin-controls').inert = true; message('Working…');
    try {
      const data = await call(args);
      if (requestEpoch !== epoch) return;
      render(data); if (success && data.found !== false) message(success);
    } catch (error) {
      if (requestEpoch !== epoch) return;
      clearAccount(); clearQueue();
      if (error.code === '42501') lock();
      message(error.message + ' Reload the account before retrying.');
    } finally {
      if (requestEpoch === epoch) { busy = false; byId('exam-admin-controls').inert = false; }
    }
  }
  function chooseExam(key, focus = true) {
    closeDecision();
    selected = account.exams.find(exam => exam.exam_key === key);
    if (!selected) return;
    document.querySelectorAll('.exam-admin-card').forEach(card => card.setAttribute('aria-pressed', String(card.dataset.exam === key)));
    byId('exam-access-edit').hidden = false;
    byId('exam-edit-title').textContent = selected.badge + ' · ' + selected.display_name;
    byId('exam-edit-state').textContent = labels[selected.access_status] + '. ' + dateText(selected.expires_at) +
      (selected.request_status ? '. Request: ' + selected.request_status + '.' : '.');
    const active = selected.access_status === 'granted';
    const expiry = active && selected.expires_at ? new Date(selected.expires_at) : null;
    byId('exam-grant-expiry').value = expiry ? new Date(expiry.getTime()-expiry.getTimezoneOffset()*60000).toISOString().slice(0,16) : '';
    const grantable = account.can_receive_grants && selected.publication_status === 'published';
    byId('exam-grant-expiry').disabled = !grantable;
    byId('exam-grant').disabled = !grantable;
    byId('exam-grant').textContent = active ? 'Save expiry' : 'Grant access';
    const pending = selected.request_status === 'pending';
    byId('exam-grant').hidden = pending;
    byId('exam-approve').hidden = !pending; byId('exam-approve').disabled = !grantable;
    byId('exam-decline').hidden = !pending;
    byId('exam-revoke').disabled = account.is_administrator || selected.grant_status !== 'active';
    if (focus) byId('exam-edit-title').focus();
  }
  function renderAccount(data, examKey) {
    clearAccount();
    if (!data.found) { message('No account found. Check the complete email and try again.'); return; }
    account = data; byId('exam-member').hidden = false;
    byId('exam-member-title').textContent = data.email || data.user_id;
    byId('exam-member-note').textContent = data.is_administrator ? 'Administrators inherit access to published exams. Membership changes remain owner-only.' :
      data.can_receive_grants ? 'Each grant applies only to the selected certification.' : 'This account must be confirmed and active before receiving new grants.';
    data.exams.forEach(exam => {
      const card = element('button', '', 'exam-admin-card'); card.type = 'button'; card.dataset.exam = exam.exam_key; card.setAttribute('aria-pressed','false');
      card.append(element('strong',exam.badge),element('span',exam.display_name),element('span',labels[exam.access_status],'exam-admin-state'));
      if (exam.request_status === 'pending') card.append(element('span','Request pending'));
      card.addEventListener('click', () => chooseExam(exam.exam_key)); byId('exam-member-cards').appendChild(card);
    });
    data.history.forEach(event => byId('exam-member-history').appendChild(element('li',
      dateText(event.changed_at) + ' · ' + event.exam_key.toUpperCase() + ' · ' + event.event_kind + ': ' +
      (event.previous_status || 'none') + ' → ' + (event.next_status || 'removed') +
      (event.event_kind === 'grant' ? ' · ' + dateText(event.next_expiry) : '') +
      ' · By ' + (event.actor_id || event.actor_source))));
    if (!data.history.length) byId('exam-member-history').appendChild(element('li','No recent decisions.'));
    if (examKey) chooseExam(examKey); else byId('exam-member-title').focus();
  }
  function renderQueue(data) {
    clearQueue(); cursor = data.next_cursor;
    byId('exam-requests-next').hidden = !cursor;
    byId('exam-requests-status').textContent = data.requests.length ? 'Showing ' + data.requests.length + ' pending requests, oldest first.' : 'No pending requests on this page.';
    data.requests.forEach(request => {
      const li = element('li',''); li.append(element('strong',request.email || request.user_id));
      li.append(element('p',request.badge + ' · ' + dateText(request.requested_at)));
      const review = element('button','Review ' + request.badge,'btn'); review.type='button';
      review.addEventListener('click', () => run({operation:'account',target_id:request.user_id}, data => renderAccount(data,request.exam_key), 'Review this learner and expiry before deciding.'));
      li.appendChild(review); byId('exam-request-list').appendChild(li);
    });
  }
  byId('exam-member-search').addEventListener('submit', event => {
    event.preventDefault(); if (busy || !ready) return;
    clearAccount(); run({operation:'search',account_email:byId('exam-member-email').value.trim()}, renderAccount, 'Choose a certification to manage.');
  });
  byId('exam-member-email').addEventListener('input', () => { if (!busy) clearAccount(); });
  byId('exam-member-reload').addEventListener('click', () => {
    if (account) run({operation:'account',target_id:account.user_id}, renderAccount, 'Account refreshed. Choose an exam.');
  });
  function closeDecision() {
    decision = null;
    const dialog = byId('exam-decision-dialog');
    if (dialog.open) dialog.close();
    byId('exam-decision-summary').textContent = '';
  }
  byId('exam-decision-cancel').addEventListener('click', closeDecision);
  byId('exam-decision-dialog').addEventListener('cancel', event => { event.preventDefault(); closeDecision(); });
  byId('exam-decision-confirm').addEventListener('click', () => {
    const current = decision;
    if (!current) return;
    closeDecision();
    if (!ready || busy || current.epoch !== epoch || !account || !selected ||
      current.args.target_id !== account.user_id || current.args.requested_exam_key !== selected.exam_key ||
      current.args.expected_grant_revision !== selected.grant_revision || current.args.expected_request_revision !== selected.request_revision) return;
    if (current.args.expiry && new Date(current.args.expiry) <= new Date()) { message('Choose a future expiry and review the decision again.'); return; }
    run(current.args, data => { renderAccount(data,current.args.requested_exam_key); clearQueue(); },
      'Decision saved. Access is checked on the next protected request.');
  });
  byId('exam-access-edit').addEventListener('submit', event => {
    event.preventDefault(); if (!account || !selected || busy || !ready || decision) return;
    const operation = event.submitter && event.submitter.dataset.operation;
    if (!['grant','approve','revoke','decline'].includes(operation) || event.submitter.disabled) return;
    const granting = operation === 'grant' || operation === 'approve';
    const value = byId('exam-grant-expiry').value;
    const expiry = granting && value ? new Date(value) : null;
    if (expiry && (!Number.isFinite(expiry.getTime()) || expiry <= new Date())) { message('Choose a future expiry or leave it empty.'); return; }
    const action = {grant:'Grant access',approve:'Approve request and grant access',revoke:'Revoke access',decline:'Decline request'}[operation];
    byId('exam-decision-title').textContent = action + '?';
    byId('exam-decision-summary').textContent = 'Learner: ' + account.email + '\nCertification: ' + selected.display_name + ' (' + selected.badge + ')' +
      (granting ? '\nExpiry: ' + (expiry ? expiry.toLocaleString() : 'No expiry') : '') +
      (operation === 'decline' ? '\nThis does not revoke an existing grant.' : '') +
      (operation === 'revoke' ? '\nThis blocks the learner’s next protected request. Material already loaded cannot be recalled.' : '');
    byId('exam-decision-confirm').textContent = {grant:'Confirm grant',approve:'Confirm approval',revoke:'Confirm revocation',decline:'Confirm decline'}[operation];
    decision = {epoch,args:{operation,target_id:account.user_id,requested_exam_key:selected.exam_key,expiry:expiry ? expiry.toISOString() : null,
      expected_grant_revision:selected.grant_revision,expected_request_revision:selected.request_revision}};
    byId('exam-decision-dialog').showModal();
    byId('exam-decision-cancel').focus();
  });
  byId('exam-requests-refresh').addEventListener('click', () => run({operation:'requests'},renderQueue,'Requests refreshed.'));
  byId('exam-requests-next').addEventListener('click', () => { if (cursor) run({operation:'requests',...cursor},renderQueue,'Next request page loaded.'); });
  byId('exam-history-prune').addEventListener('click', () => run({operation:'prune'}, data => {
    message(data.removed + ' old history records removed.' + (data.removed === 200 ? ' Run again to check for more.' : ' Cleanup complete.'));
  }));
  function sessionChanged(user) {
    if (active) active.abort(); active = null;
    const check = ++epoch; busy = false; byId('exam-admin-controls').inert = false; lock();
    byId('exam-admin-signin').hidden = !!user;
    if (!user) { message('Sign in with an administrator account.'); return; }
    message('Checking administrator access…');
    Promise.resolve().then(() => { if (check === epoch) return call({operation:'status'}); }).then(data => {
      if (check !== epoch) return;
      if (!data || data.administrator !== true) throw new Error('Administrator access is required.');
      ready = true; byId('exam-admin-controls').hidden = false; message('Ready. Find a learner or load access requests.');
    }).catch(() => { if (check === epoch) { lock(); message('Administrator access is required, or account services are unavailable.'); } });
  }
  function initialize() {
    auth = window.UpskillAuth;
    if (!auth || !auth.isConfigured()) { lock(); message('Account services are unavailable. Please reload later.'); return; }
    auth.onChange(sessionChanged);
    window.addEventListener('pageshow', event => { if (event.persisted) sessionChanged(auth.getUser()); });
  }
  if (window.UpskillAuth) initialize();
  else document.addEventListener('upskill-auth-ready',initialize,{once:true});
}());

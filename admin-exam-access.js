(function () {
  'use strict';
  // Shared by /admin-exam-access and /admin-tool-access (body data-access-scope="tool").
  // The static pages ship only a neutral "Checking access…" state. Nothing below
  // is built until the existing administrator check passes; the RPCs enforce
  // permissions on every call regardless of what this page shows.
  const byId = id => document.getElementById(id);
  const tools = document.body.dataset.accessScope === 'tool';
  const item = tools ? 'tool' : 'certification';
  const PAGE_PATH = tools ? '/admin-tool-access' : '/admin-exam-access';
  const SOON_MS = 14 * 24 * 60 * 60 * 1000;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // Wording that changes with the scope: exams have learners, tools have accounts.
  const words = tools ? {
    title: 'Tool access', person: 'account', Person: 'Account', items: 'tools', Items: 'Tools', Item: 'Tool',
    lede: 'Manage each tool individually. Find an account, review its tools and grant access for as long as needed.',
    find: 'Find an account', findButton: 'Find account', searchHelp: 'Search using the account’s complete email.',
    back: {href: '/engineering-tools', text: '← Engineering tools'},
    noun: 'account'
  } : {
    title: 'Exam access', person: 'learner', Person: 'Learner', items: 'certifications', Items: 'Certifications', Item: 'Certification',
    lede: 'Manage each certification individually. Find a learner, review their exams and grant access for as long as they need it.',
    find: 'Find a learner', findButton: 'Find learner', searchHelp: 'Search using the learner’s complete account email.',
    back: {href: '/exam-practice', text: '← Practice Certification Exams'},
    noun: 'learner'
  };
  // Both screens share confirmation, timeout, revision and stale-account guards.
  // Normalize at this boundary; database tool/exam grants remain independent.
  function responseData(data) {
    if (!tools || !data) return data;
    const row = value => ({...value, exam_key:value.tool_key});
    return {...data, exams:data.tools?.map(row), requests:data.requests?.map(row),
      history:data.history?.map(row), next_cursor:data.next_cursor ? {
        after_time:data.next_cursor.after_time, after_user:data.next_cursor.after_user,
        after_exam:data.next_cursor.after_tool
      } : null};
  }
  const labels = {locked:'Locked',granted:'Access granted',expired:'Expired',revoked:'Revoked',administrator:'Administrator access',coming_soon:'Coming soon',retired:'Retired'};
  let auth, account = null, selected = null, cursor = null, epoch = 0, busy = false, ready = false, active = null, decision = null;
  let built = false, requestRows = [], lastCard = null, sheetInert = [], sheetTrigger = null, sheetModal = false;
  const shell = () => window.UpskillAdminShell;
  const message = text => { const node = byId('exam-admin-status'); if (node) node.textContent = text; };
  const notify = (text, tone) => { const s = shell(); if (s && typeof s.toast === 'function') s.toast(text, {tone}); };
  const dateText = value => value ? new Date(value).toLocaleString() : 'No expiry';
  function element(tag, text, className) {
    const node = document.createElement(tag); node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function attrs(node, values) { Object.entries(values).forEach(([key, value]) => node.setAttribute(key, value)); return node; }
  function icon(d) {
    const svg = attrs(document.createElementNS(SVG_NS, 'svg'), {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'});
    const path = document.createElementNS(SVG_NS, 'path'); path.setAttribute('d', d); svg.appendChild(path);
    return svg;
  }
  const ICON_SEARCH = 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4';
  const ICON_INBOX = 'M4 13h4l2 3h4l2-3h4M5.5 5h13L21 13v6H3v-6z';
  const ICON_CLOCK = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2';
  function empty(id, title, text, action) {
    const box = element('div', '', 'adm-empty'); box.id = id;
    box.append(icon(id.includes('request') ? ICON_INBOX : id.includes('history') ? ICON_CLOCK : ICON_SEARCH),
      element('h3', title), element('p', text));
    if (action) {
      const button = element('button', action.label, 'adm-btn adm-btn--secondary'); button.type = 'button';
      if (action.id) button.id = action.id;
      button.addEventListener('click', action.run); box.append(button);
    }
    return box;
  }
  function field(id, labelText, input, helpText) {
    const wrap = element('div', '', 'adm-field');
    const label = element('label', labelText); label.htmlFor = id; input.id = id;
    wrap.append(label, input);
    if (helpText) { const help = element('p', helpText, 'adm-help'); help.id = id + '-help'; input.setAttribute('aria-describedby', help.id); wrap.append(help); }
    return wrap;
  }
  function button(id, text, variant, type = 'button') {
    const node = element('button', text, 'adm-btn adm-btn--' + variant); node.id = id; node.type = type;
    return node;
  }

  /* ---------- Build the workspace (only after the administrator check passes) ---------- */
  function build() {
    const main = byId('admin-main');
    const back = element('p', '', 'adm-help');
    const backLink = element('a', words.back.text); backLink.href = words.back.href; back.append(backLink);
    const title = element('h1', words.title, 'adm-page-title'); title.id = 'exam-admin-title'; title.tabIndex = -1;
    const lede = element('p', words.lede, 'adm-lede');
    // Polite live region for search, load and save progress (toasts add a visual summary).
    const status = attrs(element('p', '', 'adm-help'), {role:'status','aria-live':'polite'}); status.id = 'exam-admin-status';

    const controls = element('div', ''); controls.id = 'exam-admin-controls';
    const layout = element('div', '', 'adm-layout');
    const workspace = element('div', ''); workspace.id = 'exam-workspace';

    // Search and person.
    const memberPanel = attrs(element('section', '', 'adm-panel'), {'aria-labelledby':'member-heading'});
    const memberHeading = element('h2', words.find, 'adm-section-title'); memberHeading.id = 'member-heading';
    const search = element('form', '', 'adm-search'); search.id = 'exam-member-search'; search.noValidate = false;
    const email = attrs(document.createElement('input'), {type:'email',required:'',maxlength:'254',autocomplete:'off',placeholder:tools ? 'name@example.com' : 'learner@example.com'});
    search.append(field('exam-member-email', 'Account email', email, words.searchHelp), button('exam-member-find', words.findButton, 'primary', 'submit'));
    const notFound = empty('exam-member-empty', 'No account found',
      'Check the complete email address and try again. Only existing, confirmed accounts can receive access.',
      {label:'Try another email', run:() => { const input = byId('exam-member-email'); input.select(); input.focus(); }});
    notFound.hidden = true;

    const member = attrs(element('section', ''), {'aria-labelledby':'exam-member-title'}); member.id = 'exam-member'; member.hidden = true;
    const summary = element('div', '', 'adm-summary');
    const who = element('div', '');
    const memberTitle = element('h3', ''); memberTitle.id = 'exam-member-title'; memberTitle.tabIndex = -1;
    const memberState = element('p', ''); memberState.id = 'exam-member-state';
    const memberNote = element('p', ''); memberNote.id = 'exam-member-note';
    who.append(memberTitle, memberNote, memberState);
    summary.append(who, button('exam-member-reload', 'Reload account', 'secondary'));
    const itemsHeading = element('h3', words.Items, 'adm-section-title'); itemsHeading.id = 'exam-items-heading';
    const itemsHelp = element('p', 'Choose a ' + item + ' to review its access and the actions available.', 'adm-help');
    const cards = attrs(element('div', '', 'adm-grid'), {role:'group','aria-labelledby':'exam-items-heading'}); cards.id = 'exam-member-cards';
    const historyHeading = element('h3', 'Recent decisions', 'adm-section-title'); historyHeading.id = 'exam-history-heading';
    const historyHelp = element('p', 'Up to 20 recent changes from the last 90 days.', 'adm-help');
    const history = attrs(element('ol', '', 'adm-timeline'), {'aria-labelledby':'exam-history-heading'}); history.id = 'exam-member-history';
    const noHistory = empty('exam-history-empty', 'No decisions yet',
      'Grants, approvals, revocations and declines for this ' + words.noun + ' will appear here.');
    noHistory.hidden = true;
    member.append(summary, itemsHeading, itemsHelp, cards, historyHeading, historyHelp, history, noHistory);
    memberPanel.append(memberHeading, search, notFound, member);

    // Requests.
    const requestsPanel = attrs(element('section', '', 'adm-panel'), {'aria-labelledby':'exam-requests-heading'});
    const requestsHeading = element('h2', 'Access requests', 'adm-section-title'); requestsHeading.id = 'exam-requests-heading';
    const requestsHelp = element('p', 'Review requests one ' + words.noun + ' and ' + item + ' at a time. Requests load only when you ask.', 'adm-help');
    const requestActions = element('div', '');
    requestActions.append(button('exam-requests-refresh', 'Load requests', 'secondary'));
    const requestsStatus = attrs(element('p', 'Requests load when you ask.', 'adm-help'), {role:'status'}); requestsStatus.id = 'exam-requests-status';
    const filters = element('div', '', 'adm-filters'); filters.id = 'exam-requests-filters'; filters.hidden = true;
    const statusFilter = document.createElement('select');
    const itemFilter = document.createElement('select');
    filters.append(field('exam-filter-status', 'Status', statusFilter), field('exam-filter-item', words.Item, itemFilter));
    // Explicit roles keep table semantics when rows stack under 640px (display:block drops them in some browsers).
    const table = attrs(element('table', '', 'adm-table'), {role:'table'}); table.id = 'exam-requests-table'; table.hidden = true;
    const caption = element('caption', 'Pending access requests, oldest first', 'sr-only');
    const head = attrs(document.createElement('thead'), {role:'rowgroup'}); const headRow = attrs(document.createElement('tr'), {role:'row'});
    [words.Person, words.Item, 'Requested', 'Status'].forEach(text => headRow.append(attrs(element('th', text), {scope:'col',role:'columnheader'})));
    headRow.append(attrs(element('th', ''), {scope:'col',role:'columnheader'})); headRow.lastChild.append(element('span', 'Action', 'sr-only'));
    head.append(headRow);
    const body = attrs(document.createElement('tbody'), {role:'rowgroup'}); body.id = 'exam-request-list';
    table.append(caption, head, body);
    const noRequests = empty('exam-requests-empty', 'No pending requests',
      'Nothing is waiting for a decision on this page. Load requests again later to check for new ones.',
      {label:'Check again', id:'exam-requests-retry', run:() => byId('exam-requests-refresh').click()});
    noRequests.hidden = true;
    const noMatches = empty('exam-requests-nomatch', 'No requests match these filters', 'Change the status or ' + item + ' filter to see more of the loaded requests.');
    noMatches.hidden = true;
    const next = button('exam-requests-next', 'Next 25 requests', 'secondary'); next.hidden = true;
    requestsPanel.append(requestsHeading, requestsHelp, requestActions, requestsStatus, filters, table, noRequests, noMatches, next);
    workspace.append(memberPanel, requestsPanel);

    // Side panel (bottom sheet under 800px) with only the actions valid for the state.
    const panel = attrs(element('aside', '', 'adm-sidepanel'), {'aria-labelledby':'exam-edit-title'}); panel.id = 'exam-access-panel'; panel.hidden = true;
    const close = attrs(element('button', '', 'adm-sidepanel-close'), {type:'button','aria-label':'Close ' + item + ' details'}); close.id = 'exam-panel-close';
    close.append(icon('M6 6l12 12M18 6L6 18'));
    const form = element('form', ''); form.id = 'exam-access-edit'; form.hidden = true;
    const editTitle = element('h2', '', 'adm-section-title'); editTitle.id = 'exam-edit-title'; editTitle.tabIndex = -1;
    const editChip = element('p', ''); editChip.id = 'exam-edit-chip';
    const editState = element('p', ''); editState.id = 'exam-edit-state';
    const reason = element('p', '', 'adm-help'); reason.id = 'exam-edit-reason'; reason.hidden = true;
    const expiry = attrs(document.createElement('input'), {type:'datetime-local'});
    const expiryField = field('exam-grant-expiry', 'Access expires (your local time)', expiry);
    const expiryHelp = element('p', 'Leave empty for no expiry.', 'adm-help'); expiryHelp.id = 'exam-expiry-help';
    expiry.setAttribute('aria-describedby', 'exam-expiry-help'); expiryField.append(expiryHelp); expiryField.id = 'exam-expiry-field';
    const actions = element('div', ''); actions.id = 'exam-actions';
    [['exam-grant','Grant access','primary','grant'],['exam-approve','Approve request','primary','approve'],
      ['exam-revoke','Revoke access','caution','revoke'],['exam-decline','Decline request','caution','decline']].forEach(([id, text, variant, operation]) => {
      const node = button(id, text, variant, 'submit'); node.dataset.operation = operation; actions.append(node);
    });
    const safety = element('p', 'Revocation blocks the next protected request. Material already loaded cannot be recalled.', 'adm-help');
    form.append(editTitle, editChip, editState, reason, expiryField, actions, safety);
    panel.append(close, form);
    layout.append(workspace, panel);

    // Maintenance, clearly labelled and out of the main flow.
    const settings = attrs(element('section', '', 'adm-settings'), {'aria-labelledby':'exam-maintenance-heading'}); settings.id = 'exam-settings';
    const settingsHeading = element('h2', 'Settings: history maintenance', 'adm-section-title'); settingsHeading.id = 'exam-maintenance-heading';
    settings.append(settingsHeading,
      element('p', 'Remove up to 200 decisions older than 90 days. Current grants and requests stay in place. Recent history is also trimmed when decisions are saved.'),
      button('exam-history-prune', 'Clean old history', 'secondary'));
    controls.append(layout, settings);

    // Confirmation before every decision.
    const dialog = attrs(element('dialog', '', 'adm-dialog'), {'aria-labelledby':'exam-decision-title','aria-describedby':'exam-decision-summary'}); dialog.id = 'exam-decision-dialog';
    const dialogTitle = element('h2', 'Review access decision'); dialogTitle.id = 'exam-decision-title';
    const dialogSummary = element('p', ''); dialogSummary.id = 'exam-decision-summary';
    const dialogActions = element('div', '');
    const cancel = button('exam-decision-cancel', 'Cancel', 'secondary'); cancel.autofocus = true;
    dialogActions.append(cancel, button('exam-decision-confirm', 'Confirm decision', 'primary'));
    dialog.append(dialogTitle, dialogSummary, dialogActions);

    main.replaceChildren(back, title, lede, status, controls, dialog);
    built = true;
    wire();
  }

  /* ---------- Clearing ---------- */
  function clearAccount() {
    closeDecision();
    account = selected = null;
    if (!built) return;
    closePanel(false);
    byId('exam-member').hidden = true; byId('exam-member-empty').hidden = true;
    byId('exam-member-title').textContent = ''; byId('exam-member-note').textContent = ''; byId('exam-member-state').replaceChildren();
    byId('exam-member-cards').replaceChildren(); byId('exam-member-history').replaceChildren(); byId('exam-history-empty').hidden = true;
    byId('exam-grant-expiry').value = '';
  }
  function clearQueue() {
    cursor = null; requestRows = [];
    if (!built) return;
    byId('exam-request-list').replaceChildren(); byId('exam-requests-next').hidden = true;
    byId('exam-requests-table').hidden = true; byId('exam-requests-filters').hidden = true;
    byId('exam-requests-empty').hidden = true; byId('exam-requests-nomatch').hidden = true;
    byId('exam-requests-status').textContent = 'Load requests to see the latest decisions.';
  }
  // Remove every trace of the workspace and header (sign-out, account switch, denial).
  function teardown() {
    ready = false; clearAccount(); clearQueue();
    const dialog = byId('exam-decision-dialog'); if (dialog && dialog.open) dialog.close();
    releaseSheet(); built = false; lastCard = null; sheetTrigger = null;
    const s = shell(); if (s && typeof s.unmount === 'function') s.unmount();
    else { const host = byId('admin-shell-header'); if (host) host.replaceChildren(); }
    const checking = attrs(element('p', 'Checking access…', 'adm-checking'), {role:'status','aria-live':'polite'});
    byId('admin-main').replaceChildren(checking);
  }
  function deny(signedOut) {
    teardown();
    const s = shell();
    if (s) s.renderDenied(byId('admin-main'), {signedOut, next: PAGE_PATH});
    else byId('admin-main').replaceChildren(element('p', 'This area isn\u2019t available.', 'adm-denied'));
  }

  /* ---------- RPC ---------- */
  async function call(args) {
    const controller = new AbortController(); active = controller; let timer;
    try {
      const payload = {...args};
      if (tools) {
        if ('requested_exam_key' in payload) { payload.requested_tool_key=payload.requested_exam_key; delete payload.requested_exam_key; }
        if ('after_exam' in payload) { payload.after_tool=payload.after_exam; delete payload.after_exam; }
      }
      const query = auth.getClient().rpc(tools ? 'admin_manage_tool_access' : 'admin_manage_exam_access', payload).abortSignal(controller.signal);
      const result = await Promise.race([query, new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error('The request timed out. Its result is unconfirmed.')); }, 12000);
      })]);
      if (!result || result.error) throw Object.assign(new Error(result?.error?.message || 'Unable to complete this request.'), {code:result?.error?.code});
      return responseData(result.data);
    } finally { clearTimeout(timer); if (active === controller) active = null; }
  }
  // Unlock before rendering so the render can move focus into controls that are no longer inert.
  function unlock() {
    busy = false;
    const controls = byId('exam-admin-controls');
    if (controls) { controls.inert = false; controls.removeAttribute('aria-busy'); }
  }
  async function run(args, render, success, options = {}) {
    if (busy || !ready) return;
    const requestEpoch = epoch; busy = true; const controls = byId('exam-admin-controls');
    controls.inert = true; controls.setAttribute('aria-busy', 'true'); message('Working…');
    try {
      const data = await call(args);
      if (requestEpoch !== epoch) return;
      unlock();
      render(data);
      if (success && data.found !== false) { message(success); if (options.toast) notify(success, 'success'); }
    } catch (error) {
      if (requestEpoch !== epoch) return;
      unlock();
      if (error.code === '42501') { deny(false); notify('Administrator access is required for this page.', 'error'); return; }
      clearAccount(); clearQueue();
      const text = error.message + ' Reload the account before retrying.';
      message(text); notify(text, 'error');
    } finally {
      if (requestEpoch === epoch && busy) unlock();
    }
  }

  /* ---------- Item status ---------- */
  function chipFor(exam) {
    if (exam.access_status === 'administrator') return ['Active (administrator)', 'active'];
    if (exam.access_status === 'granted') {
      const end = exam.expires_at ? new Date(exam.expires_at).getTime() : NaN;
      if (Number.isFinite(end) && end - Date.now() <= SOON_MS) return ['Expires soon', 'expiring'];
      return ['Active', 'active'];
    }
    if (exam.request_status === 'pending') return ['Pending request', 'pending'];
    return ['No access', 'none'];
  }
  function chip(exam) {
    const [text, tone] = chipFor(exam);
    return element('span', text, 'adm-chip adm-chip--' + tone);
  }

  /* ---------- Side panel ---------- */
  const narrow = () => typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 799.98px)').matches;
  // Under 800px the panel is a modal bottom sheet: everything outside it is inert
  // (admin header, back link, workspace, settings), Tab is contained, Esc closes it
  // and focus returns to the trigger. Two exceptions stay live: the confirmation
  // <dialog> (opened from the sheet) and the toast region, so results are still
  // announced; Tab containment keeps toast buttons out of keyboard reach.
  function releaseSheet() {
    sheetInert.forEach(node => { node.inert = false; });
    sheetInert = []; sheetModal = false;
    const panel = byId('exam-access-panel');
    if (panel) { panel.removeAttribute('role'); panel.removeAttribute('aria-modal'); }
  }
  function containSheet() {
    releaseSheet();
    const panel = byId('exam-access-panel');
    if (!panel || panel.hidden || !narrow()) return;
    const keep = new Set([byId('exam-decision-dialog'), ...document.querySelectorAll('.adm-toast-region')]);
    for (let node = panel; node.parentElement && node !== document.body; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling === node || keep.has(sibling) || sibling.inert || sibling.tagName === 'SCRIPT') continue;
        sibling.inert = true; sheetInert.push(sibling);
      }
    }
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); sheetModal = true;
  }
  function sheetFocusables() {
    return [...byId('exam-access-panel').querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')]
      .filter(node => !node.disabled && !node.closest('[hidden]'));
  }
  function trapTab(event) {
    if (event.key !== 'Tab' || !sheetModal) return;
    const items = sheetFocusables(); if (!items.length) return;
    const first = items[0], last = items[items.length - 1], current = document.activeElement;
    const inside = items.includes(current);
    if (event.shiftKey && (current === first || !inside)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (current === last || !inside)) { event.preventDefault(); first.focus(); }
  }
  // trigger: the card or Review button that opened the panel (focus returns to it on close).
  function openPanel(trigger) {
    const panel = byId('exam-access-panel');
    if (trigger) sheetTrigger = trigger; else if (panel.hidden) sheetTrigger = null;
    byId('exam-access-edit').hidden = false; panel.hidden = false;
    containSheet();
  }
  function closePanel(returnFocus) {
    if (!built) return;
    closeDecision();
    selected = null;
    byId('exam-access-edit').hidden = true; byId('exam-access-panel').hidden = true;
    releaseSheet();
    document.querySelectorAll('#exam-member-cards [data-exam]').forEach(card => card.setAttribute('aria-pressed', 'false'));
    const usable = sheetTrigger && sheetTrigger.isConnected && !sheetTrigger.closest('[hidden]');
    const target = usable ? sheetTrigger : lastCard;
    sheetTrigger = null;
    if (returnFocus && target && target.isConnected) target.focus();
  }
  function show(id, visible, enabled) { const node = byId(id); node.hidden = !visible; node.disabled = !enabled; }
  function chooseExam(key, focus = true, trigger = null) {
    closeDecision();
    selected = account.exams.find(exam => exam.exam_key === key);
    if (!selected) return;
    document.querySelectorAll('#exam-member-cards [data-exam]').forEach(card => {
      const on = card.dataset.exam === key; card.setAttribute('aria-pressed', String(on)); if (on) lastCard = card;
    });
    openPanel(trigger || lastCard);
    byId('exam-edit-title').textContent = selected.badge + ' · ' + selected.display_name;
    byId('exam-edit-chip').replaceChildren(chip(selected));
    byId('exam-edit-state').textContent = labels[selected.access_status] + '. ' + dateText(selected.expires_at) +
      (selected.request_status ? '. Request: ' + selected.request_status + '.' : '.');
    const granted = selected.access_status === 'granted';
    const expiry = granted && selected.expires_at ? new Date(selected.expires_at) : null;
    byId('exam-grant-expiry').value = expiry ? new Date(expiry.getTime()-expiry.getTimezoneOffset()*60000).toISOString().slice(0,16) : '';
    const grantable = account.can_receive_grants && selected.publication_status === 'published';
    const pending = selected.request_status === 'pending';
    const revocable = !account.is_administrator && selected.grant_status === 'active';
    byId('exam-grant').textContent = granted ? 'Save expiry' : 'Grant access';
    // Only the actions valid for this state are shown; hidden actions are also disabled.
    show('exam-grant', !pending && grantable, !pending && grantable);
    show('exam-approve', pending && grantable, pending && grantable);
    show('exam-decline', pending, pending);
    show('exam-revoke', revocable, revocable);
    byId('exam-expiry-field').hidden = !grantable; byId('exam-grant-expiry').disabled = !grantable;
    const reason = account.is_administrator ? 'Administrators inherit access to published ' + words.items + '. Membership changes remain owner-only.' :
      selected.publication_status !== 'published' ? 'This ' + item + ' isn’t published, so access can’t be granted yet.' :
      !account.can_receive_grants ? 'This account must be confirmed and active before receiving new grants.' : '';
    byId('exam-edit-reason').textContent = reason; byId('exam-edit-reason').hidden = !reason;
    if (focus) byId('exam-edit-title').focus();
  }

  /* ---------- Rendering ---------- */
  function renderAccount(data, examKey, trigger) {
    clearAccount();
    if (!data.found) {
      message('No account found. Check the complete email and try again.');
      byId('exam-member-empty').hidden = false;
      return;
    }
    account = data; byId('exam-member').hidden = false;
    byId('exam-member-title').textContent = data.email || data.user_id;
    byId('exam-member-note').textContent = data.is_administrator ? 'Administrators inherit access to published '+(tools ? 'tools' : 'exams')+'. Membership changes remain owner-only.' :
      data.can_receive_grants ? 'Each grant applies only to the selected '+item+'.' : 'This account must be confirmed and active before receiving new grants.';
    const state = data.is_administrator ? ['Administrator', 'active'] : data.can_receive_grants ? ['Can receive grants', 'active'] : ['Not yet eligible', 'none'];
    byId('exam-member-state').append(element('span', state[0], 'adm-chip adm-chip--' + state[1]));
    data.exams.forEach(exam => {
      const card = element('button', '', 'adm-card'); card.type = 'button'; card.dataset.exam = exam.exam_key; card.setAttribute('aria-pressed','false');
      const bodyNode = element('span', '', 'adm-card-body');
      bodyNode.append(element('strong', exam.badge), element('span', ' · ' + exam.display_name));
      const detail = element('span', '', 'adm-card-action');
      detail.append(chip(exam));
      if (exam.request_status === 'pending' && chipFor(exam)[1] !== 'pending') detail.append(' ', element('span', 'Request pending', 'adm-chip adm-chip--pending'));
      card.append(bodyNode, detail);
      card.addEventListener('click', () => chooseExam(exam.exam_key, true, card)); byId('exam-member-cards').appendChild(card);
    });
    data.history.forEach(event => {
      const li = document.createElement('li');
      const time = element('time', dateText(event.changed_at)); if (event.changed_at) time.dateTime = event.changed_at;
      li.append(time, element('p', event.exam_key.toUpperCase() + ' · ' + event.event_kind + ': ' +
        (event.previous_status || 'none') + ' → ' + (event.next_status || 'removed') +
        (event.event_kind === 'grant' ? ' · ' + dateText(event.next_expiry) : '') +
        ' · By ' + (event.actor_id || event.actor_source)));
      byId('exam-member-history').appendChild(li);
    });
    byId('exam-history-empty').hidden = data.history.length > 0;
    if (examKey) chooseExam(examKey, true, trigger); else byId('exam-member-title').focus();
  }
  function option(value, text) { const node = element('option', text); node.value = value; return node; }
  function fillFilter(id, allText, values) {
    const select = byId(id); const previous = select.value;
    select.replaceChildren(option('', allText), ...values.map(([value, text]) => option(value, text)));
    select.value = values.some(([value]) => value === previous) ? previous : '';
  }
  function applyFilters() {
    const status = byId('exam-filter-status').value, key = byId('exam-filter-item').value;
    let shown = 0;
    requestRows.forEach(({row, request}) => {
      const match = (!status || (request.status || 'pending') === status) && (!key || request.exam_key === key);
      row.hidden = !match; if (match) shown++;
    });
    const total = requestRows.length;
    byId('exam-requests-nomatch').hidden = !total || shown > 0;
    byId('exam-requests-table').hidden = !total || shown === 0;
    if (total) byId('exam-requests-status').textContent = (shown === total ? 'Showing ' + total : 'Showing ' + shown + ' of ' + total) + ' pending requests, oldest first.';
  }
  function renderQueue(data) {
    clearQueue(); cursor = data.next_cursor;
    byId('exam-requests-next').hidden = !cursor;
    byId('exam-requests-status').textContent = data.requests.length ? 'Showing ' + data.requests.length + ' pending requests, oldest first.' : 'No pending requests on this page.';
    byId('exam-requests-empty').hidden = data.requests.length > 0;
    data.requests.forEach(request => {
      const row = attrs(document.createElement('tr'), {role:'row'});
      const cell = (label, content) => { const td = attrs(document.createElement('td'), {role:'cell'}); td.setAttribute('data-label', label); td.append(content); row.append(td); return td; };
      cell(words.Person, element('strong', request.email || request.user_id));
      cell(words.Item, request.badge);
      const when = element('time', dateText(request.requested_at)); if (request.requested_at) when.dateTime = request.requested_at;
      cell('Requested', when);
      const statusText = (request.status || 'pending') === 'pending' ? 'Pending request' : String(request.status);
      cell('Status', element('span', statusText, 'adm-chip adm-chip--' + ((request.status || 'pending') === 'pending' ? 'pending' : 'none')));
      const review = element('button','Review ' + request.badge,'adm-btn adm-btn--secondary'); review.type='button';
      review.setAttribute('aria-label', 'Review ' + request.badge + ' request from ' + (request.email || request.user_id));
      review.addEventListener('click', () => run({operation:'account',target_id:request.user_id}, data => renderAccount(data,request.exam_key,review), 'Review this ' + words.noun + ' and expiry before deciding.'));
      cell('', review).setAttribute('data-label', '');
      byId('exam-request-list').appendChild(row);
      requestRows.push({row, request});
    });
    const statuses = [...new Set(data.requests.map(r => r.status || 'pending'))].map(value => [value, value === 'pending' ? 'Pending request' : value]);
    const items = [...new Map(data.requests.map(r => [r.exam_key, r.badge])).entries()];
    fillFilter('exam-filter-status', 'All statuses', statuses);
    fillFilter('exam-filter-item', 'All ' + words.items, items);
    byId('exam-requests-filters').hidden = data.requests.length === 0;
    applyFilters();
  }

  /* ---------- Decisions ---------- */
  function closeDecision() {
    decision = null;
    const dialog = byId('exam-decision-dialog');
    if (!dialog) return;
    if (dialog.open) dialog.close();
    byId('exam-decision-summary').textContent = '';
  }
  function wire() {
    byId('exam-member-search').addEventListener('submit', event => {
      event.preventDefault(); if (busy || !ready) return;
      clearAccount(); run({operation:'search',account_email:byId('exam-member-email').value.trim()}, renderAccount, 'Choose a '+item+' to manage.');
    });
    byId('exam-member-email').addEventListener('input', () => { if (!busy) clearAccount(); });
    byId('exam-member-reload').addEventListener('click', () => {
      if (account) run({operation:'account',target_id:account.user_id}, renderAccount, 'Account refreshed. Choose a '+item+'.');
    });
    byId('exam-panel-close').addEventListener('click', () => closePanel(true));
    byId('exam-access-panel').addEventListener('keydown', event => {
      if (event.key === 'Escape' && !byId('exam-decision-dialog').open) { event.preventDefault(); closePanel(true); return; }
      trapTab(event);
    });
    byId('exam-decision-cancel').addEventListener('click', closeDecision);
    byId('exam-decision-dialog').addEventListener('cancel', event => { event.preventDefault(); closeDecision(); });
    byId('exam-decision-confirm').addEventListener('click', () => {
      const current = decision;
      if (!current) return;
      closeDecision();
      if (!ready || busy || current.epoch !== epoch || !account || !selected ||
        current.args.target_id !== account.user_id || current.args.requested_exam_key !== selected.exam_key ||
        current.args.expected_grant_revision !== selected.grant_revision || current.args.expected_request_revision !== selected.request_revision) return;
      if (current.args.expiry && new Date(current.args.expiry) <= new Date()) { message('Choose a future expiry and review the decision again.'); notify('Choose a future expiry and review the decision again.', 'error'); return; }
      run(current.args, data => { renderAccount(data,current.args.requested_exam_key); clearQueue(); },
        'Decision saved. Access is checked on the next protected request.', {toast:true});
    });
    byId('exam-access-edit').addEventListener('submit', event => {
      event.preventDefault(); if (!account || !selected || busy || !ready || decision) return;
      const operation = event.submitter && event.submitter.dataset.operation;
      if (!['grant','approve','revoke','decline'].includes(operation) || event.submitter.disabled || event.submitter.hidden) return;
      const granting = operation === 'grant' || operation === 'approve';
      const value = byId('exam-grant-expiry').value;
      const expiry = granting && value ? new Date(value) : null;
      if (expiry && (!Number.isFinite(expiry.getTime()) || expiry <= new Date())) {
        byId('exam-grant-expiry').setAttribute('aria-invalid', 'true');
        message('Choose a future expiry or leave it empty.'); notify('Choose a future expiry or leave it empty.', 'error'); return;
      }
      byId('exam-grant-expiry').removeAttribute('aria-invalid');
      const action = {grant:'Grant access',approve:'Approve request and grant access',revoke:'Revoke access',decline:'Decline request'}[operation];
      byId('exam-decision-title').textContent = action + '?';
      byId('exam-decision-summary').textContent = (tools ? 'Account: ' : 'Learner: ') + account.email + (tools ? '\nTool: ' : '\nCertification: ') + selected.display_name + ' (' + selected.badge + ')' +
        (granting ? '\nExpiry: ' + (expiry ? expiry.toLocaleString() : 'No expiry') : '') +
        (operation === 'decline' ? '\nThis does not revoke an existing grant.' : '') +
        (operation === 'revoke' ? '\nThis blocks the ' + (tools ? 'account’s' : 'learner’s') + ' next protected request. Material already loaded cannot be recalled.' : '');
      byId('exam-decision-confirm').textContent = {grant:'Confirm grant',approve:'Confirm approval',revoke:'Confirm revocation',decline:'Confirm decline'}[operation];
      decision = {epoch,args:{operation,target_id:account.user_id,requested_exam_key:selected.exam_key,expiry:expiry ? expiry.toISOString() : null,
        expected_grant_revision:selected.grant_revision,expected_request_revision:selected.request_revision}};
      byId('exam-decision-dialog').showModal();
      byId('exam-decision-cancel').focus();
    });
    byId('exam-requests-refresh').addEventListener('click', () => run({operation:'requests'},renderQueue,'Requests refreshed.'));
    byId('exam-requests-next').addEventListener('click', () => { if (cursor) run({operation:'requests',...cursor},renderQueue,'Next request page loaded.'); });
    byId('exam-filter-status').addEventListener('change', applyFilters);
    byId('exam-filter-item').addEventListener('change', applyFilters);
    byId('exam-history-prune').addEventListener('click', () => run({operation:'prune'}, data => {
      const text = data.removed + ' old history records removed.' + (data.removed === 200 ? ' Run again to check for more.' : ' Cleanup complete.');
      message(text); notify(text, 'success');
    }));
    if (typeof window.matchMedia === 'function') {
      const query = window.matchMedia('(max-width: 799.98px)');
      if (query.addEventListener) query.addEventListener('change', () => { if (built && !byId('exam-access-panel').hidden) containSheet(); });
    }
  }

  /* ---------- Session and gate ---------- */
  function sessionChanged(user) {
    if (active) active.abort(); active = null;
    const check = ++epoch; busy = false; teardown();
    if (!user) { deny(true); return; }
    // The existing administrator check, unchanged: {operation:'status'} -> data.administrator === true.
    Promise.resolve().then(() => { if (check === epoch) return call({operation:'status'}); }).then(async data => {
      if (check !== epoch) return;
      if (!data || data.administrator !== true) throw new Error('Administrator access is required.');
      const s = shell();
      const isOwner = await s.checkOwner(auth.getClient());
      if (check !== epoch) return;
      s.mount({page: tools ? 'tools' : 'exams', isOwner: isOwner === true});
      build(); ready = true;
      message('Ready. Find a ' + words.noun + ' or load access requests.');
      const title = byId('exam-admin-title');
      if (!document.activeElement || document.activeElement === document.body) title.focus();
    }).catch(() => { if (check === epoch) deny(false); });
  }
  function initialize() {
    auth = window.UpskillAuth;
    if (!auth || !auth.isConfigured() || !shell()) { deny(false); return; }
    auth.onChange(sessionChanged);
    window.addEventListener('pageshow', event => { if (event.persisted) sessionChanged(auth.getUser()); });
  }
  if (window.UpskillAuth) initialize();
  else document.addEventListener('upskill-auth-ready',initialize,{once:true});
}());

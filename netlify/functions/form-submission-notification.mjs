// Send owner notifications for verified Netlify form submissions.
// Netlify invokes formSubmitted only after verifying a submission and validates
// the event signature before calling this handler.
import { createHash } from 'node:crypto';
import { loadCodeFinderIndex, renderLeadAlert, renderPackEmail } from './_shared/code-finder-export-email.mjs';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i;
const MAX_FIELDS = 40;
const MAX_VALUE_LENGTH = 2000;

export function netlifyEnv() {
  if (typeof Netlify === 'undefined') return {};
  return {
    RESEND_API_KEY: Netlify.env.get('RESEND_API_KEY'),
    NEWSLETTER_ADMIN_EMAIL: Netlify.env.get('NEWSLETTER_ADMIN_EMAIL'),
    NEWSLETTER_FROM: Netlify.env.get('NEWSLETTER_FROM'),
    NEWSLETTER_POSTAL_ADDRESS: Netlify.env.get('NEWSLETTER_POSTAL_ADDRESS')
  };
}

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function fieldValue(value) {
  const text = Array.isArray(value) ? value.map(String).join(', ') : String(value ?? '');
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, MAX_VALUE_LENGTH);
}

function eventDetails(event = {}) {
  const formName = clean(event.form?.name || event.formName || event.form_name || event.payload?.form_name || event.data?.['form-name']) || 'unknown';
  const rawData = event.data && typeof event.data === 'object'
    ? event.data
    : event.payload?.data && typeof event.payload.data === 'object' ? event.payload.data : {};
  const fields = Object.entries(rawData)
    .filter(([name]) => !/^bot-field$|password|secret|token|csrf/i.test(name))
    .slice(0, MAX_FIELDS)
    .map(([name, value]) => [fieldValue(name).slice(0, 100), fieldValue(value)]);

  const replyTo = fields.find(([name]) => /^email$/i.test(name))?.[1] || '';
  return {
    formName: fieldValue(formName).replace(/[\r\n]/g, ' ').slice(0, 100),
    fields,
    replyTo: EMAIL.test(replyTo) ? replyTo : '',
    submissionId: event.submission?.id || event.submissionId || event.id || ''
  };
}

export function renderNotification(details) {
  const subject = `New ${details.formName} submission — UpSkill Sprint`;
  const lines = [
    `Form: ${details.formName}`,
    ...(details.submissionId ? [`Submission ID: ${details.submissionId}`] : []),
    '',
    ...details.fields.map(([name, value]) => `${name}: ${value}`)
  ];
  const html = `<!doctype html><html><body><h2>New form submission</h2><p><strong>Form:</strong> ${escapeHtml(details.formName)}</p>${details.submissionId ? `<p><strong>Submission ID:</strong> ${escapeHtml(details.submissionId)}</p>` : ''}<dl>${details.fields.map(([name, value]) => `<dt><strong>${escapeHtml(name)}</strong></dt><dd>${escapeHtml(value).replace(/\n/g, '<br>')}</dd>`).join('')}</dl></body></html>`;
  return { subject, text: lines.join('\n'), html };
}

const CODE_FINDER_FORM = 'code-finder-export';

async function sendEmail(deps, apiKey, payload, idempotencyKey, logContext) {
  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  try {
    const response = await deps.fetch(RESEND_ENDPOINT, {
      method: 'POST', headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) {
      deps.log('error', 'notification_send_failed', { ...logContext, status: response.status });
      return false;
    }
    deps.log('info', 'notification_sent', logContext);
    return true;
  } catch (error) {
    deps.log('error', 'notification_send_failed', { ...logContext, error: String(error?.message || error) });
    return false;
  }
}
const keyFor = (prefix, submissionId) => submissionId
  ? `${prefix}/${createHash('sha256').update(String(submissionId)).digest('hex')}` : '';

// Code Finder export: a readable lead alert for the owner, plus the visitor's
// own copy of the pack (codes, reasons, CSV attached). Falls back to the
// generic alert if the catalog cannot be read.
async function handleCodeFinderExport(details, { apiKey, recipient, from, env, deps, loadIndex }) {
  const field = name => details.fields.find(([key]) => key === name)?.[1] || '';
  const email = field('email');
  const slug = field('pack');
  let index;
  try {
    index = await loadIndex();
  } catch (error) {
    deps.log('error', 'code_finder_catalog_unavailable', { error: String(error?.message || error) });
    return null;
  }
  const alert = renderLeadAlert(index, { email, pack: slug, optIn: field('marketing_opt_in') });
  const sent = await sendEmail(deps, apiKey, {
    from, to: [recipient], subject: alert.subject, text: alert.text, html: alert.html,
    ...(details.replyTo ? { reply_to: details.replyTo } : {})
  }, keyFor('netlify-form-notification', details.submissionId), { form: details.formName, submissionId: details.submissionId || undefined });

  const pack = EMAIL.test(email) ? renderPackEmail(index, slug, { postalAddress: clean(env.NEWSLETTER_POSTAL_ADDRESS) }) : null;
  let confirmation = 'skipped';
  if (pack) {
    const ok = await sendEmail(deps, apiKey, {
      from, to: [email], reply_to: recipient, subject: pack.subject, text: pack.text, html: pack.html,
      attachments: [pack.attachment]
    }, keyFor('code-finder-pack', details.submissionId), { form: details.formName, kind: 'visitor_pack', submissionId: details.submissionId || undefined });
    confirmation = ok ? 'sent' : 'failed';
  }
  return sent ? { sent: true, confirmation } : { sent: false, reason: 'provider_error', confirmation };
}

export async function handleFormSubmitted(event, {
  env = netlifyEnv(),
  deps = {
    fetch: (...args) => fetch(...args),
    log: (level, eventName, data = {}) => {
      const line = JSON.stringify({ scope: 'form-notification', level, event: eventName, ...data });
      if (level === 'error') console.error(line);
      else if (level === 'warn') console.warn(line);
      else console.log(line);
    }
  },
  loadIndex = () => loadCodeFinderIndex()
} = {}) {
  const apiKey = clean(env.RESEND_API_KEY);
  const recipient = clean(env.NEWSLETTER_ADMIN_EMAIL);
  const from = clean(env.NEWSLETTER_FROM);
  if (!apiKey || !EMAIL.test(recipient) || !from) {
    deps.log('error', 'notification_not_configured', { hasApiKey: Boolean(apiKey), hasRecipient: EMAIL.test(recipient), hasFrom: Boolean(from) });
    return { sent: false, reason: 'not_configured' };
  }

  const details = eventDetails(event);
  if (!details.fields.length) {
    deps.log('warn', 'notification_skipped', { form: details.formName, reason: 'no_fields' });
    return { sent: false, reason: 'no_fields' };
  }
  if (details.formName === CODE_FINDER_FORM) {
    const handled = await handleCodeFinderExport(details, { apiKey, recipient, from, env, deps, loadIndex });
    if (handled) return handled;
  }
  const rendered = renderNotification(details);
  const payload = {
    from,
    to: [recipient],
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
    ...(details.replyTo ? { reply_to: details.replyTo } : {})
  };
  const submissionId = String(details.submissionId || '');
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  if (submissionId) {
    headers['Idempotency-Key'] = `netlify-form-notification/${createHash('sha256').update(submissionId).digest('hex')}`;
  }

  try {
    const response = await deps.fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) {
      deps.log('error', 'notification_send_failed', { form: details.formName, status: response.status });
      return { sent: false, reason: 'provider_error' };
    }
    deps.log('info', 'notification_sent', { form: details.formName, submissionId: submissionId || undefined });
    return { sent: true };
  } catch (error) {
    deps.log('error', 'notification_send_failed', { form: details.formName, error: String(error?.message || error) });
    return { sent: false, reason: 'provider_error' };
  }
}

export default {
  formSubmitted(event) {
    return handleFormSubmitted(event);
  }
};

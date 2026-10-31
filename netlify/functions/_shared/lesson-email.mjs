// New-lesson announcement emails: configuration, rendering, delivery and the
// announcer run loop. Shared by:
//   netlify/functions/lesson-email-deploy.mjs   (after each production deploy)
//   netlify/functions/lesson-email-sweep.mjs    (hourly safety net)
//   netlify/functions/newsletter-unsubscribe.mjs
//
// The database (supabase/migrations/*_lesson_announcement_emails.sql) owns the
// "announce once" guarantees. This module never decides on its own that a
// lesson is new; it only acts on what lesson_email_sync_feed() returns.
//
// No personal data is logged: logs carry counts, lesson paths and campaign ids.

import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export const TEMPLATE_VERSION = 'v1';
export const MIN_FEED_LESSONS = 20;
export const RESEND_ENDPOINT = 'https://api.resend.com';
export const USER_AGENT = 'upskillsprint-lesson-email/1.0';
export const DEFAULT_SUPABASE_URL = 'https://prerurzpikodzbnezvgz.supabase.co';
export const DEFAULT_AI_MODEL = 'claude-haiku-4-5-20251001';
export const UNSUBSCRIBE_PATH = '/api/newsletter/unsubscribe';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[a-z]{2,}$/i;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Netlify only injects variables that are read by literal name, so every
 * variable is listed explicitly (same approach as excel-sprint-coaching.mjs).
 */
export function netlifyEnv() {
  if (typeof Netlify === 'undefined') return {};
  return {
    LESSON_EMAIL_MODE: Netlify.env.get('LESSON_EMAIL_MODE'),
    SUPABASE_URL: Netlify.env.get('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: Netlify.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    RESEND_API_KEY: Netlify.env.get('RESEND_API_KEY'),
    NEWSLETTER_UNSUBSCRIBE_SECRET: Netlify.env.get('NEWSLETTER_UNSUBSCRIBE_SECRET'),
    NEWSLETTER_POSTAL_ADDRESS: Netlify.env.get('NEWSLETTER_POSTAL_ADDRESS'),
    NEWSLETTER_TEST_RECIPIENTS: Netlify.env.get('NEWSLETTER_TEST_RECIPIENTS'),
    NEWSLETTER_ADMIN_EMAIL: Netlify.env.get('NEWSLETTER_ADMIN_EMAIL'),
    NEWSLETTER_FROM: Netlify.env.get('NEWSLETTER_FROM'),
    NEWSLETTER_REPLY_TO: Netlify.env.get('NEWSLETTER_REPLY_TO'),
    NEWSLETTER_MAX_LESSONS: Netlify.env.get('NEWSLETTER_MAX_LESSONS'),
    NEWSLETTER_SEND_WINDOW: Netlify.env.get('NEWSLETTER_SEND_WINDOW'),
    NEWSLETTER_TIMEZONE: Netlify.env.get('NEWSLETTER_TIMEZONE'),
    NEWSLETTER_PREVIEW_PATH: Netlify.env.get('NEWSLETTER_PREVIEW_PATH'),
    NEWSLETTER_SITE_URL: Netlify.env.get('NEWSLETTER_SITE_URL'),
    NEWSLETTER_SITE_NAME: Netlify.env.get('NEWSLETTER_SITE_NAME'),
    NEWSLETTER_AI_MODEL: Netlify.env.get('NEWSLETTER_AI_MODEL'),
    ANTHROPIC_API_KEY: Netlify.env.get('ANTHROPIC_API_KEY'),
    ANTHROPIC_BASE_URL: Netlify.env.get('ANTHROPIC_BASE_URL')
  };
}

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

function parseWindow(value) {
  const match = clean(value || '7-20').match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
  if (!match) return { start: 7, end: 20, valid: false };
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (start > 23 || end > 24 || start >= end) return { start: 7, end: 20, valid: false };
  return { start, end, valid: true };
}

export function readConfig(env = {}) {
  const rawMode = clean(env.LESSON_EMAIL_MODE).toLowerCase() || 'off';
  const mode = ['off', 'test', 'live'].includes(rawMode) ? rawMode : 'off';
  const testRecipients = clean(env.NEWSLETTER_TEST_RECIPIENTS)
    .split(/[,;\s]+/).map((item) => item.trim()).filter(Boolean);
  const maxLessons = Number.parseInt(clean(env.NEWSLETTER_MAX_LESSONS) || '3', 10);
  const window = parseWindow(env.NEWSLETTER_SEND_WINDOW);
  const timeZone = clean(env.NEWSLETTER_TIMEZONE) || 'America/Regina';
  let timeZoneValid = true;
  try { new Intl.DateTimeFormat('en-CA', { timeZone }); } catch { timeZoneValid = false; }

  return {
    mode,
    modeValid: mode === rawMode,
    rawMode,
    siteUrl: (clean(env.NEWSLETTER_SITE_URL) || 'https://upskillsprint.com').replace(/\/+$/, ''),
    siteName: clean(env.NEWSLETTER_SITE_NAME) || 'upskillsprint',
    supabaseUrl: (clean(env.SUPABASE_URL) || DEFAULT_SUPABASE_URL).replace(/\/+$/, ''),
    serviceKey: clean(env.SUPABASE_SERVICE_ROLE_KEY),
    resendKey: clean(env.RESEND_API_KEY),
    unsubscribeSecret: clean(env.NEWSLETTER_UNSUBSCRIBE_SECRET),
    postalAddress: clean(env.NEWSLETTER_POSTAL_ADDRESS),
    testRecipients,
    adminEmail: clean(env.NEWSLETTER_ADMIN_EMAIL),
    from: clean(env.NEWSLETTER_FROM) || 'UpSkill Sprint <noreply@upskillsprint.com>',
    replyTo: clean(env.NEWSLETTER_REPLY_TO),
    maxLessons: Number.isInteger(maxLessons) && maxLessons >= 1 && maxLessons <= 10 ? maxLessons : 3,
    sendWindow: window,
    timeZone: timeZoneValid ? timeZone : 'America/Regina',
    timeZoneValid,
    previewPath: clean(env.NEWSLETTER_PREVIEW_PATH),
    aiModel: clean(env.NEWSLETTER_AI_MODEL) || DEFAULT_AI_MODEL,
    anthropicKey: clean(env.ANTHROPIC_API_KEY),
    anthropicBaseUrl: clean(env.ANTHROPIC_BASE_URL)
  };
}

/** Problems that must block sending in the configured mode. Empty = ready. */
export function configProblems(config) {
  const problems = [];
  if (!config.modeValid) problems.push(`LESSON_EMAIL_MODE must be off, test or live (found "${config.rawMode}")`);
  if (config.mode === 'off') return problems;
  if (!config.serviceKey) problems.push('SUPABASE_SERVICE_ROLE_KEY is not set');
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl)) problems.push('SUPABASE_URL must be https://<project>.supabase.co');
  if (!config.resendKey) problems.push('RESEND_API_KEY is not set');
  if (config.unsubscribeSecret.length < 32) problems.push('NEWSLETTER_UNSUBSCRIBE_SECRET must be at least 32 characters');
  if (config.postalAddress.length < 10) problems.push('NEWSLETTER_POSTAL_ADDRESS is required (CASL: every commercial email must show a mailing address)');
  if (!/^[^<>]*<[^\s@<>]+@upskillsprint\.com>$|^[^\s@<>]+@upskillsprint\.com$/i.test(config.from)) {
    problems.push('NEWSLETTER_FROM must use the verified upskillsprint.com domain');
  }
  if (config.replyTo && !EMAIL.test(config.replyTo)) problems.push('NEWSLETTER_REPLY_TO is not a valid email address');
  if (config.adminEmail && !EMAIL.test(config.adminEmail)) problems.push('NEWSLETTER_ADMIN_EMAIL is not a valid email address');
  if (!/^https:\/\//.test(config.siteUrl)) problems.push('NEWSLETTER_SITE_URL must be https');
  if (!config.sendWindow.valid) problems.push('NEWSLETTER_SEND_WINDOW must look like 7-20 (local hours, start < end)');
  if (!config.timeZoneValid) problems.push('NEWSLETTER_TIMEZONE is not a valid IANA time zone');
  if (config.mode === 'test') {
    if (!config.testRecipients.length) problems.push('NEWSLETTER_TEST_RECIPIENTS is required in test mode');
    if (config.testRecipients.length > 5) problems.push('NEWSLETTER_TEST_RECIPIENTS allows at most 5 addresses');
    for (const address of config.testRecipients) {
      if (!EMAIL.test(address)) problems.push(`NEWSLETTER_TEST_RECIPIENTS contains an invalid address: ${address}`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Unsubscribe tokens (stateless, never expire: CASL requires the link to work
// for at least 60 days after sending; ours works indefinitely).
// ---------------------------------------------------------------------------

function tokenSignature(userId, secret) {
  return createHmac('sha256', secret).update(`unsubscribe:v1:${userId.toLowerCase()}`).digest('base64url');
}

export function signUnsubscribeToken(userId, secret) {
  if (!UUID.test(userId)) throw new Error('invalid user id');
  if (!secret || secret.length < 32) throw new Error('unsubscribe secret too short');
  return `v1.${userId.toLowerCase()}.${tokenSignature(userId, secret)}`;
}

export function verifyUnsubscribeToken(token, secret) {
  if (typeof token !== 'string' || token.length > 200 || !secret || secret.length < 32) return null;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1' || !UUID.test(parts[1])) return null;
  const expected = Buffer.from(tokenSignature(parts[1], secret));
  const given = Buffer.from(parts[2]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return parts[1].toLowerCase();
}

export function unsubscribeUrl(config, { token = null, campaignId = null, preview = false } = {}) {
  const url = new URL(UNSUBSCRIBE_PATH, config.siteUrl);
  if (preview) url.searchParams.set('preview', '1');
  if (token) url.searchParams.set('t', token);
  if (campaignId && UUID.test(campaignId)) url.searchParams.set('c', campaignId);
  return url.href;
}

// ---------------------------------------------------------------------------
// Email content
// ---------------------------------------------------------------------------

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

const TOPIC_LABELS = {
  'lean-six-sigma': 'Lean Six Sigma',
  'quality-engineering': 'Quality Engineering',
  statistics: 'Statistics',
  'data-analytics': 'Data Analytics',
  'power-bi-excel-sql': 'Power BI, Excel & SQL',
  'project-management': 'Project Management',
  'ai-for-work': 'AI for Work'
};

export function topicLabel(slug) {
  if (!slug) return '';
  return TOPIC_LABELS[slug] || slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function lessonMeta(lesson) {
  const parts = [];
  if (lesson.level) parts.push(lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1));
  if (lesson.minutes) parts.push(`${lesson.minutes} min`);
  if (lesson.interactive) parts.push('Interactive');
  const topic = topicLabel(lesson.topic);
  if (topic) parts.push(topic);
  return parts.join(' · ');
}

export function trackedUrl(url, slug) {
  const tracked = new URL(url);
  tracked.searchParams.set('utm_source', 'newsletter');
  tracked.searchParams.set('utm_medium', 'email');
  tracked.searchParams.set('utm_campaign', 'new-lesson');
  if (slug) tracked.searchParams.set('utm_content', slug.slice(0, 80));
  return tracked.href;
}

const slugOf = (lessonPath) => String(lessonPath || '').split('/').filter(Boolean).at(-1) || 'lessons';

export function buildSubject(lessons) {
  if (lessons.length === 1) return `New lesson: ${lessons[0].title}`.slice(0, 150);
  const first = lessons[0].title.length > 60 ? `${lessons[0].title.slice(0, 57)}…` : lessons[0].title;
  return `${lessons.length} new lessons: ${first} and more`;
}

function firstName(displayName) {
  const name = clean(displayName).split(/\s+/)[0] || '';
  if (!name || /^learner$/i.test(name) || name.length > 40 || /[<>@:/\\]/.test(name)) return '';
  return name;
}

/**
 * Render one email. `lessons` items: {path,url,title,teaser,level,minutes,interactive,topic}.
 * Returns {subject, preheader, html, text}. All dynamic text is escaped.
 */
export function renderLessonEmail({ lessons, config, unsubscribeHref, recipientName = '', isTest = false }) {
  if (!lessons?.length) throw new Error('renderLessonEmail needs at least one lesson');
  const subject = buildSubject(lessons);
  const preheader = lessons.length === 1 ? lessons[0].teaser : `${lessons[0].teaser} Plus ${lessons.length - 1} more.`;
  const name = firstName(recipientName);
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const intro = lessons.length === 1
    ? 'A new lesson just went live on UpSkill Sprint.'
    : `${lessons.length} new lessons just went live on UpSkill Sprint.`;
  const browseHref = trackedUrl(`${config.siteUrl}/lessons`, 'browse-all');
  const preferencesHref = `${config.siteUrl}/profile`;
  const address = config.postalAddress;

  const cards = lessons.map((lesson, index) => {
    const href = trackedUrl(lesson.url, slugOf(lesson.path));
    const meta = lessonMeta(lesson);
    const cta = lessons.length === 1 ? 'Start the lesson &rarr;' : 'Open lesson &rarr;';
    return `
          <tr><td class="card" style="padding:${index ? '20px' : '4px'} 0 0 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-box" style="background:#ffffff;border:1px solid #dbe3ea;border-radius:12px;">
              <tr><td style="padding:22px 22px 24px 22px;">
                ${meta ? `<p class="meta" style="margin:0 0 8px 0;font-size:12px;line-height:18px;letter-spacing:.04em;text-transform:uppercase;color:#0e7490;font-weight:700;">${escapeHtml(meta)}</p>` : ''}
                <h2 class="title" style="margin:0 0 10px 0;font-size:${lessons.length === 1 ? '24px' : '20px'};line-height:1.25;color:#0f172a;font-weight:800;">
                  <a href="${escapeHtml(href)}" style="color:#0f172a;text-decoration:none;">${escapeHtml(lesson.title)}</a>
                </h2>
                <p class="body" style="margin:0 0 18px 0;font-size:16px;line-height:24px;color:#334155;">${escapeHtml(lesson.teaser)}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="border-radius:8px;background:#0e7490;">
                    <a href="${escapeHtml(href)}" class="button" style="display:inline-block;padding:12px 20px;font-size:16px;line-height:20px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${cta}</a>
                  </td>
                </tr></table>
              </td></tr>
            </table>
          </td></tr>`;
  }).join('');

  const testBanner = isTest
    ? `<tr><td style="padding:0 0 16px 0;"><p style="margin:0;padding:10px 14px;border-radius:8px;background:#fef3c7;color:#78350f;font-size:13px;line-height:19px;font-weight:600;">TEST SEND &mdash; only the test recipients received this. Subscribers were not emailed, and the unsubscribe link opens a preview.</p></td></tr>`
    : '';

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<style>
  body { margin:0; padding:0; }
  a { color:#0e7490; }
  @media (max-width: 600px) { .container { width:100% !important; } .pad { padding-left:16px !important; padding-right:16px !important; } }
  @media (prefers-color-scheme: dark) {
    .bg { background:#0b1220 !important; }
    .card-box { background:#111a2e !important; border-color:#24324d !important; }
    .title, .title a, .ink { color:#f1f5f9 !important; }
    .body, .soft { color:#cbd5e1 !important; }
    .meta, .link, .accent { color:#5eead4 !important; }
    .rule { border-color:#24324d !important; }
    .foot { color:#94a3b8 !important; }
  }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#f1f5f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}${'&#847;&zwnj;&nbsp;'.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:#f1f5f9;">
  <tr><td align="center" class="pad" style="padding:28px 24px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px;max-width:600px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <tr><td style="padding:0 0 18px 0;">
        <p class="ink" style="margin:0;font-size:18px;line-height:24px;font-weight:800;color:#0f172a;">UpSkill <span class="accent" style="color:#0e7490;">Sprint</span></p>
      </td></tr>
      ${testBanner}
      <tr><td style="padding:0 0 14px 0;">
        <p class="body" style="margin:0 0 6px 0;font-size:16px;line-height:24px;color:#334155;">${escapeHtml(greeting)}</p>
        <p class="body" style="margin:0;font-size:16px;line-height:24px;color:#334155;">${escapeHtml(intro)}</p>
      </td></tr>
      ${cards}
      <tr><td style="padding:22px 0 24px 0;">
        <p class="soft" style="margin:0;font-size:15px;line-height:22px;color:#475569;">Practical lessons from real workplace problems. <a class="link" href="${escapeHtml(browseHref)}" style="color:#0e7490;font-weight:600;">Browse all lessons</a></p>
      </td></tr>
      <tr><td class="rule" style="padding:0;border-top:1px solid #dbe3ea;">
        <p class="foot" style="margin:16px 0 8px 0;font-size:12px;line-height:18px;color:#64748b;">You're receiving this because you chose to get new-lesson emails in your UpSkill Sprint account.</p>
        <p class="foot" style="margin:0 0 8px 0;font-size:12px;line-height:18px;color:#64748b;"><a class="link" href="${escapeHtml(unsubscribeHref)}" style="color:#0e7490;">Unsubscribe</a> &nbsp;&middot;&nbsp; <a class="link" href="${escapeHtml(preferencesHref)}" style="color:#0e7490;">Email preferences</a></p>
        <p class="foot" style="margin:0;font-size:12px;line-height:18px;color:#64748b;">UpSkill Sprint Consulting &middot; ${escapeHtml(address)}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const textLessons = lessons.map((lesson) => [
    lesson.title,
    lessonMeta(lesson),
    lesson.teaser,
    trackedUrl(lesson.url, slugOf(lesson.path))
  ].filter(Boolean).join('\n')).join('\n\n');

  const text = [
    isTest ? 'TEST SEND - only the test recipients received this.\n' : '',
    greeting,
    '',
    intro,
    '',
    textLessons,
    '',
    `Browse all lessons: ${browseHref}`,
    '',
    '--',
    "You're receiving this because you chose to get new-lesson emails in your UpSkill Sprint account.",
    `Unsubscribe: ${unsubscribeHref}`,
    `Email preferences: ${preferencesHref}`,
    `UpSkill Sprint Consulting, ${address}`
  ].filter((line, index) => index !== 0 || line).join('\n');

  return { subject, preheader, html, text };
}

// ---------------------------------------------------------------------------
// Teasers
// ---------------------------------------------------------------------------

const HYPE = /\b(ultimate|revolutionary|game[- ]?changer|mind[- ]?blowing|unlock|supercharge|secret|insane|crush)\b/i;

export function acceptableTeaser(text) {
  const teaser = clean(text).replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').replace(/\s+/g, ' ');
  if (teaser.length < 40 || teaser.length > 160) return null;
  if (/[<>]|https?:\/\/|www\.|\n/i.test(teaser)) return null;
  if (HYPE.test(teaser) || /!/.test(teaser)) return null;
  return teaser;
}

export function catalogTeaser(lesson) {
  const description = clean(lesson.description);
  if (description) return description.length <= 220 ? description : `${description.slice(0, 217).replace(/\s+\S*$/, '')}…`;
  return `A new ${lesson.level || ''} lesson: ${lesson.title}.`.replace(/\s+/g, ' ');
}

function anthropicEndpoint(baseUrl) {
  const url = new URL((baseUrl || 'https://api.anthropic.com').replace(/\/+$/, '') + '/');
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('invalid ANTHROPIC_BASE_URL');
  return new URL(url.pathname.endsWith('/v1/') ? 'messages' : 'v1/messages', url).href;
}

/** One catchy, on-brand sentence from the lesson's own catalog data. Returns null on any failure. */
export async function generateAiTeaser(lesson, config, deps, timeoutMs = 12000) {
  if (!config.anthropicKey || timeoutMs < 3000) return null;
  const system = [
    'You write the one-sentence teaser for a new-lesson announcement email from UpSkill Sprint,',
    'a site of free, practical lessons for quality engineers, Lean Six Sigma practitioners and analysts.',
    'Voice: plain language, practical, credible, benefit-led, no hype.',
    'Rules: one sentence; 60 to 140 characters; say what the learner will be able to do;',
    'do not repeat the title word for word; no emojis, no exclamation marks, no quotes, no links;',
    'never use: ultimate, revolutionary, game-changer, unlock, supercharge, secret.',
    'Reply with the sentence only.'
  ].join(' ');
  const user = JSON.stringify({
    title: lesson.title,
    catalogDescription: lesson.description,
    level: lesson.level,
    minutes: lesson.minutes,
    interactive: lesson.interactive,
    sectionHeadings: (lesson.headings || []).slice(0, 8)
  });
  try {
    const response = await deps.fetch(anthropicEndpoint(config.anthropicBaseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': config.anthropicKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: config.aiModel, max_tokens: 120, temperature: 0.7, system, messages: [{ role: 'user', content: user }] }),
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response.ok) {
      deps.log('warn', 'ai_teaser_http_error', { path: lesson.path, status: response.status });
      return null;
    }
    const body = await response.json();
    const text = (body.content || []).filter((block) => block.type === 'text').map((block) => block.text).join(' ');
    const teaser = acceptableTeaser(text);
    if (!teaser) deps.log('warn', 'ai_teaser_rejected', { path: lesson.path, length: text.length });
    return teaser;
  } catch (error) {
    deps.log('warn', 'ai_teaser_failed', { path: lesson.path, error: String(error?.name || error) });
    return null;
  }
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

export class ConfigError extends Error {}

export async function rpc(deps, config, name, args = {}) {
  const headers = {
    apikey: config.serviceKey,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
  // Legacy JWT service keys go in Authorization too; new sb_secret_ keys use apikey only.
  if (config.serviceKey.startsWith('eyJ')) headers.Authorization = `Bearer ${config.serviceKey}`;
  const response = await deps.fetch(`${config.supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST', headers, body: JSON.stringify(args), signal: AbortSignal.timeout(20000)
  });
  const body = await response.text();
  if (response.status === 401 || response.status === 403) throw new ConfigError(`Supabase rejected the service key (${name}: HTTP ${response.status})`);
  if (response.status === 404) throw new ConfigError(`Supabase function ${name} not found: run the lesson-email migration`);
  if (!response.ok) throw new Error(`Supabase ${name} failed: HTTP ${response.status} ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : null;
}

const sha = (value) => createHash('sha256').update(value).digest('hex');

async function resendPost(deps, config, path, payload, idempotencyKey) {
  const response = await deps.fetch(`${RESEND_ENDPOINT}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendKey}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      'Idempotency-Key': idempotencyKey.slice(0, 256)
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000)
  });
  let body = null;
  try { body = await response.json(); } catch { body = null; }
  const retryAfter = Number(response.headers?.get?.('retry-after'));
  return { status: response.status, ok: response.ok, body, retryAfterMs: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : null };
}

const retryable = (status) => status === 429 || status >= 500;

/** POST with retries on 429/5xx/network errors, bounded by the run deadline. */
export async function resendWithRetry(deps, config, path, payload, idempotencyKey, deadline) {
  let last = { status: 0, ok: false, body: null, error: 'not attempted' };
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      last = await resendPost(deps, config, path, payload, idempotencyKey);
    } catch (error) {
      last = { status: 0, ok: false, body: null, error: String(error?.message || error), retryAfterMs: null };
    }
    if (last.ok || (last.status && !retryable(last.status))) return last;
    const wait = Math.min(last.retryAfterMs ?? 1000 * 2 ** attempt, 10000);
    if (deps.now() + wait + 5000 > deadline) return last;
    await deps.sleep(wait);
  }
  return last;
}

function resendError(result) {
  const message = result.body?.message || result.body?.error || result.error || '';
  return `HTTP ${result.status || 'network'} ${String(message).slice(0, 300)}`.trim();
}

function emailPayload(config, { to, rendered, unsubscribeHref, tags }) {
  const payload = {
    from: config.from,
    to: [to],
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    headers: {
      'List-Unsubscribe': `<${unsubscribeHref}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    },
    tags
  };
  if (config.replyTo) payload.reply_to = config.replyTo;
  return payload;
}

/** Send to many recipients: one batch call, falling back to single sends if the batch is rejected. */
export async function sendEmails(deps, config, items, keyPrefix, deadline) {
  const batch = await resendWithRetry(deps, config, '/emails/batch', items.map((item) => item.payload),
    `${keyPrefix}/batch/${sha(items.map((item) => item.id).join(','))}`, deadline);
  if (batch.status === 401 || batch.status === 403) throw new ConfigError(`Resend rejected the API key (${resendError(batch)})`);
  if (batch.ok && Array.isArray(batch.body?.data) && batch.body.data.length === items.length) {
    return items.map((item, index) => ({ id: item.id, outcome: 'sent', resend_id: batch.body.data[index]?.id || null }));
  }
  if (!batch.ok && retryable(batch.status || 500)) {
    return items.map((item) => ({ id: item.id, outcome: 'retry', error: resendError(batch) }));
  }
  // The batch was rejected as a whole (e.g. one invalid address): isolate per recipient.
  const results = [];
  for (const item of items) {
    if (deps.now() + 8000 > deadline) {
      results.push({ id: item.id, outcome: 'retry', error: 'deadline reached' });
      continue;
    }
    const single = await resendWithRetry(deps, config, '/emails', item.payload, `${keyPrefix}/single/${item.id}`, deadline);
    if (single.status === 401 || single.status === 403) throw new ConfigError(`Resend rejected the API key (${resendError(single)})`);
    if (single.ok) results.push({ id: item.id, outcome: 'sent', resend_id: single.body?.id || null });
    else if (retryable(single.status || 500)) results.push({ id: item.id, outcome: 'retry', error: resendError(single) });
    else results.push({ id: item.id, outcome: 'failed', error: resendError(single) });
  }
  return results;
}

/** Owner notifications. Never throws; deduplicated per day by Resend idempotency. */
export async function notifyAdmin(deps, config, subject, lines) {
  if (!config.adminEmail || !config.resendKey) {
    deps.log('info', 'admin_notice_not_sent', { subject });
    return false;
  }
  const text = [...lines, '', `Mode: ${config.mode}`, 'Status query (Supabase SQL editor): select public.lesson_email_status();', 'Runbook: docs/LESSON_EMAILS.md'].join('\n');
  const html = `<pre style="font:14px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;">${escapeHtml(text)}</pre>`;
  const day = new Date(deps.now()).toISOString().slice(0, 10);
  try {
    const result = await resendWithRetry(deps, config, '/emails', {
      from: config.from, to: [config.adminEmail], subject: `[Lesson emails] ${subject}`.slice(0, 200), text, html,
      tags: [{ name: 'type', value: 'lesson_email_admin' }]
    }, `lesson-email/admin/${day}/${sha(subject + text)}`, deps.now() + 30000);
    if (!result.ok) deps.log('warn', 'admin_notice_failed', { subject, status: result.status });
    return result.ok;
  } catch (error) {
    deps.log('warn', 'admin_notice_failed', { subject, error: String(error?.message || error) });
    return false;
  }
}

// ---------------------------------------------------------------------------
// Feed and lesson checks
// ---------------------------------------------------------------------------

export function validateFeed(feed, config) {
  if (!feed || feed.version !== 1 || !Array.isArray(feed.lessons)) throw new Error('lesson feed has an unexpected format');
  if (feed.lessons.length < MIN_FEED_LESSONS) {
    throw new Error(`lesson feed lists only ${feed.lessons.length} lessons (expected at least ${MIN_FEED_LESSONS}); refusing to act on a partial catalog`);
  }
  const seen = new Set();
  for (const lesson of feed.lessons) {
    if (typeof lesson?.path !== 'string' || !/^\/[a-z0-9][a-z0-9/_.-]*$/.test(lesson.path)) throw new Error('lesson feed has an invalid path');
    if (typeof lesson.title !== 'string' || !lesson.title.trim()) throw new Error(`lesson feed entry ${lesson.path} has no title`);
    if (typeof lesson.url !== 'string' || lesson.url !== config.siteUrl + lesson.path) throw new Error(`lesson feed entry ${lesson.path} has an unexpected URL`);
    if (!['announce', 'skip'].includes(lesson.email)) throw new Error(`lesson feed entry ${lesson.path} has an invalid email flag`);
    if (seen.has(lesson.path)) throw new Error(`lesson feed repeats ${lesson.path}`);
    seen.add(lesson.path);
  }
  return feed;
}

export async function fetchFeed(deps, config, cacheBust) {
  const url = `${config.siteUrl}/feeds/lessons.json?v=${encodeURIComponent(cacheBust)}`;
  const response = await deps.fetch(url, { headers: { 'Cache-Control': 'no-cache', 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`lesson feed returned HTTP ${response.status}`);
  return validateFeed(await response.json(), config);
}

export async function isLessonLive(deps, lesson) {
  try {
    const response = await deps.fetch(lesson.url, { method: 'GET', redirect: 'manual', headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(10000) });
    return response.status === 200;
  } catch {
    return false;
  }
}

export function insideSendWindow(config, nowMs) {
  const hour = Number(new Intl.DateTimeFormat('en-CA', { timeZone: config.timeZone, hour: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date(nowMs)).find((part) => part.type === 'hour')?.value);
  return hour >= config.sendWindow.start && hour < config.sendWindow.end;
}

function emailLesson(feedLesson, teaser) {
  return {
    path: feedLesson.path,
    url: feedLesson.url,
    title: feedLesson.title,
    teaser,
    level: feedLesson.level || '',
    minutes: Number.isFinite(feedLesson.minutes) ? feedLesson.minutes : null,
    interactive: Boolean(feedLesson.interactive),
    topic: feedLesson.topic || ''
  };
}

async function resolveTeaser(deps, config, feedLesson, stored, deadline) {
  if (feedLesson.teaser) return { teaser: feedLesson.teaser, source: 'author' };
  if (stored?.teaser && stored.teaser_source && stored.teaser_source !== 'author') return { teaser: stored.teaser, source: stored.teaser_source };
  const remaining = deadline - deps.now() - 8000;
  if (config.anthropicKey && remaining < 3000) return null; // no time left: try again next run
  const ai = await generateAiTeaser(feedLesson, config, deps, Math.min(12000, remaining));
  if (ai) return { teaser: ai, source: 'ai' };
  return { teaser: catalogTeaser(feedLesson), source: 'catalog' };
}

// ---------------------------------------------------------------------------
// Delivery
// ---------------------------------------------------------------------------

async function deliverLiveCampaign(deps, config, campaign, deadline, report) {
  const lessons = campaign.snapshot?.lessons;
  if (!Array.isArray(lessons) || !lessons.length) throw new Error(`campaign ${campaign.id} has no lesson snapshot`);
  const tags = [{ name: 'type', value: 'lesson_announcement' }, { name: 'campaign', value: campaign.id }];

  while (deps.now() + 15000 < deadline) {
    const recipients = await rpc(deps, config, 'lesson_email_next_batch', { p_campaign_id: campaign.id, p_limit: 100 });
    if (!recipients?.length) break;
    const items = recipients.map((recipient) => {
      const token = signUnsubscribeToken(recipient.user_id, config.unsubscribeSecret);
      const unsubscribeHref = unsubscribeUrl(config, { token, campaignId: campaign.id });
      const rendered = renderLessonEmail({ lessons, config, unsubscribeHref, recipientName: recipient.display_name });
      return { id: recipient.user_id, payload: emailPayload(config, { to: recipient.email, rendered, unsubscribeHref, tags }) };
    });
    const results = await sendEmails(deps, config, items, `lesson-email/${campaign.id}`, deadline);
    await rpc(deps, config, 'lesson_email_record_results', {
      p_campaign_id: campaign.id,
      p_results: results.map((result) => ({ user_id: result.id, outcome: result.outcome, resend_id: result.resend_id || null, error: result.error || null }))
    });
    const sent = results.filter((result) => result.outcome === 'sent').length;
    report.sent += sent;
    deps.log('info', 'batch_sent', { campaign: campaign.id, sent, failed: results.filter((r) => r.outcome === 'failed').length, retry: results.filter((r) => r.outcome === 'retry').length });
    if (results.every((result) => result.outcome === 'retry')) break; // provider trouble: resume next run
  }

  const finished = await rpc(deps, config, 'lesson_email_finish_campaign', { p_campaign_id: campaign.id });
  if (finished.done && !finished.already_finished) {
    report.finishedCampaigns.push({ id: campaign.id, ...finished });
    const titles = lessons.map((lesson) => `- ${lesson.title} (${lesson.url})`);
    const subject = finished.status === 'sent'
      ? `Sent "${campaign.subject}" to ${finished.sent} subscriber${finished.sent === 1 ? '' : 's'}`
      : `FAILED: "${campaign.subject}" reached nobody`;
    await notifyAdmin(deps, config, subject, [
      `Campaign ${campaign.id}: ${finished.status}`,
      `Recipients ${finished.recipients} · sent ${finished.sent} · failed ${finished.failed} · skipped ${finished.skipped}`,
      '',
      ...titles,
      ...(finished.status === 'failed' ? ['', 'Nothing was delivered. Check the Resend dashboard, then retry with:', `select public.lesson_email_release(array[${lessons.map((l) => `'${l.path}'`).join(',')}]);`] : [])
    ]);
  } else if (!finished.done) {
    report.resumeLater = true;
  }
  return finished;
}

async function sendTestEmail(deps, config, lessons, trigger, deployId, deadline, report) {
  const dedupe = `test:${TEMPLATE_VERSION}:${sha(JSON.stringify(lessons.map((l) => [l.path, l.teaser, l.title])) + config.testRecipients.join(','))}`;
  const rendered0 = renderLessonEmail({ lessons, config, unsubscribeHref: unsubscribeUrl(config, { preview: true }), isTest: true });
  const opened = await rpc(deps, config, 'lesson_email_open_campaign', {
    p_mode: 'test', p_dedupe_key: dedupe, p_paths: lessons.map((l) => l.path), p_subject: rendered0.subject,
    p_snapshot: { lessons, template: TEMPLATE_VERSION }, p_trigger: trigger, p_deploy_id: deployId || null
  });
  if (!opened.created) {
    report.notes.push('test email for these lessons was already sent');
    return;
  }
  const href = unsubscribeUrl(config, { preview: true });
  const items = config.testRecipients.map((address, index) => ({
    id: `test-${index}`,
    payload: emailPayload(config, {
      to: address,
      rendered: { ...rendered0, subject: `[TEST] ${rendered0.subject}` },
      unsubscribeHref: href,
      tags: [{ name: 'type', value: 'lesson_announcement_test' }, { name: 'campaign', value: opened.id }]
    })
  }));
  const results = await sendEmails(deps, config, items, `lesson-email/${opened.id}`, deadline);
  const sent = results.filter((result) => result.outcome === 'sent').length;
  const errors = results.filter((result) => result.outcome !== 'sent').map((result) => result.error).join('; ');
  await rpc(deps, config, 'lesson_email_finish_test', { p_campaign_id: opened.id, p_ok: sent > 0, p_sent: sent, p_error: errors || null });
  report.testSent = sent;
  deps.log(sent ? 'info' : 'error', 'test_email', { campaign: opened.id, sent, lessons: lessons.map((l) => l.path) });
}

// ---------------------------------------------------------------------------
// The run
// ---------------------------------------------------------------------------

export function defaultDeps() {
  return {
    fetch: (...args) => fetch(...args),
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    log: (level, event, data = {}) => {
      const line = JSON.stringify({ scope: 'lesson-email', level, event, ...data });
      if (level === 'error') console.error(line);
      else if (level === 'warn') console.warn(line);
      else console.log(line);
    },
    uuid: () => randomUUID()
  };
}

/**
 * One announcer run. Safe to call any number of times, from any number of
 * places, concurrently: the lease and the database state machine make every
 * run after the first a no-op for already-handled lessons.
 *
 * @param {{trigger:'deploy'|'sweep'|'manual', deployId?:string, config:object, deps?:object, budgetMs:number}} options
 */
export async function runAnnouncer({ trigger, deployId = null, config, deps = defaultDeps(), budgetMs }) {
  const started = deps.now();
  const deadline = started + budgetMs;
  const report = { trigger, mode: config.mode, sent: 0, testSent: 0, finishedCampaigns: [], notes: [], held: 0, resumeLater: false };

  if (config.mode === 'off') {
    deps.log('info', 'mode_off', { trigger });
    return { ...report, skipped: 'mode_off' };
  }
  const problems = configProblems(config);
  if (problems.length) {
    deps.log('error', 'config_incomplete', { trigger, problems });
    if (trigger !== 'sweep') {
      await notifyAdmin(deps, config, 'Not sending: configuration incomplete', ['Lesson emails are switched on but cannot run:', ...problems.map((p) => `- ${p}`)]);
    }
    return { ...report, skipped: 'config_incomplete', problems };
  }

  const holder = `${trigger}:${deps.uuid()}`;
  const leaseSeconds = Math.min(1800, Math.max(60, Math.ceil(budgetMs / 1000) + 60));
  let leased = false;
  try {
    leased = await rpc(deps, config, 'lesson_email_acquire_lease', { p_holder: holder, p_seconds: leaseSeconds });
    if (!leased) {
      deps.log('info', 'busy', { trigger });
      return { ...report, skipped: 'busy' };
    }

    // 1. Finish any live campaign a previous run left half-sent.
    if (config.mode === 'live') {
      const active = await rpc(deps, config, 'lesson_email_active_campaigns', {});
      for (const campaign of active || []) {
        if (deps.now() + 15000 >= deadline) { report.resumeLater = true; break; }
        await deliverLiveCampaign(deps, config, campaign, deadline, report);
      }
    }

    // 2. Read the live catalog and let the database decide what is new.
    const feed = await fetchFeed(deps, config, deployId || String(started));
    const byPath = new Map(feed.lessons.map((lesson) => [lesson.path, lesson]));
    const sync = await rpc(deps, config, 'lesson_email_sync_feed', {
      p_lessons: feed.lessons.map((lesson) => ({ path: lesson.path, title: lesson.title, email: lesson.email }))
    });
    deps.log('info', 'feed_synced', { trigger, lessons: feed.lessons.length, bootstrapped: sync.bootstrapped, inserted: sync.inserted,
      pending: sync.pending?.length || 0, renamed: sync.renamed, withdrawn: sync.withdrawn, skipped: sync.skipped });

    if (sync.bootstrapped) {
      report.notes.push(`baseline recorded: ${sync.bootstrapped} existing lessons`);
      await notifyAdmin(deps, config, `Switched on: ${sync.bootstrapped} existing lessons recorded`, [
        `Lesson emails are now ${config.mode === 'live' ? 'LIVE' : 'in TEST mode'}.`,
        `${sync.bootstrapped} lessons already on the site were recorded as the baseline and will never be emailed.`,
        'The next lesson merged to main will be announced automatically after its production deploy.'
      ]);
    }
    if (sync.renamed) report.notes.push(`${sync.renamed} renamed lesson path(s) recognised and not announced`);

    let pending = (sync.pending || []).filter((item) => byPath.has(item.path));

    // 3. Safety cap: a sudden burst usually means a catalog restructure, not new lessons.
    const unapproved = pending.filter((item) => !item.approved);
    if (unapproved.length > config.maxLessons) {
      const newlyHeld = await rpc(deps, config, 'lesson_email_hold', {
        p_paths: unapproved.map((item) => item.path),
        p_reason: `${unapproved.length} new lessons appeared at once (limit ${config.maxLessons}); release with lesson_email_release()`
      });
      report.held += newlyHeld;
      if (newlyHeld) {
        await notifyAdmin(deps, config, `Held ${unapproved.length} new lessons (safety limit ${config.maxLessons})`, [
          'More new lessons than the safety limit appeared in one deploy, so nothing was sent.',
          'If they really are all new, send them as one email with:',
          `select public.lesson_email_release(array[${unapproved.map((item) => `'${item.path}'`).join(',')}]);`,
          'To never announce them:',
          `select public.lesson_email_skip(array[${unapproved.map((item) => `'${item.path}'`).join(',')}]);`,
          '',
          ...unapproved.map((item) => `- ${item.title} (${item.path})`)
        ]);
      }
      pending = pending.filter((item) => item.approved);
    }

    // 4. Only announce pages that actually load.
    const live = [];
    for (const item of pending) {
      const feedLesson = byPath.get(item.path);
      if (await isLessonLive(deps, feedLesson)) {
        live.push(item);
        continue;
      }
      const ageHours = (deps.now() - Date.parse(item.first_seen_at)) / 3600000;
      deps.log('warn', 'lesson_not_live', { path: item.path, ageHours: Math.round(ageHours) });
      if (ageHours > 48) {
        const held = await rpc(deps, config, 'lesson_email_hold', { p_paths: [item.path], p_reason: 'page did not load for 48 hours' });
        if (held) await notifyAdmin(deps, config, `Held "${item.title}": page not loading`, [`${feedLesson.url} has not returned HTTP 200 for 48 hours, so it was not announced.`, `After fixing it: select public.lesson_email_release(array['${item.path}']);`]);
      }
    }

    // 5. Teasers: the author's, else AI-written, else the catalog description.
    const ready = [];
    for (const item of live) {
      const feedLesson = byPath.get(item.path);
      const resolved = await resolveTeaser(deps, config, feedLesson, item, deadline);
      if (!resolved) { report.resumeLater = true; continue; }
      if (resolved.teaser !== item.teaser || resolved.source !== item.teaser_source) {
        await rpc(deps, config, 'lesson_email_set_teaser', { p_path: item.path, p_teaser: resolved.teaser, p_source: resolved.source });
      }
      ready.push(emailLesson(feedLesson, resolved.teaser));
    }
    if (ready.length < live.length) {
      deps.log('info', 'waiting_for_teasers', { ready: ready.length, live: live.length });
      return report;
    }

    // 6. Send.
    if (config.mode === 'test') {
      let lessons = ready;
      if (!lessons.length) {
        const previewPath = config.previewPath || feed.previewPath;
        const previewLesson = byPath.get(previewPath) || feed.lessons.filter((lesson) => lesson.email === 'announce').at(-1);
        const resolved = await resolveTeaser(deps, config, previewLesson, null, deadline);
        if (!resolved) return { ...report, resumeLater: true };
        lessons = [emailLesson(previewLesson, resolved.teaser)];
        report.notes.push(`no new lessons; test preview uses ${previewLesson.path}`);
      }
      await sendTestEmail(deps, config, lessons, trigger, deployId, deadline, report);
      return report;
    }

    if (!ready.length) return report;
    if (!insideSendWindow(config, deps.now())) {
      report.notes.push(`waiting for the send window (${config.sendWindow.start}:00–${config.sendWindow.end}:00 ${config.timeZone})`);
      deps.log('info', 'outside_send_window', { lessons: ready.map((lesson) => lesson.path) });
      return report;
    }

    const subject = buildSubject(ready);
    const paths = ready.map((lesson) => lesson.path).sort();
    const opened = await rpc(deps, config, 'lesson_email_open_campaign', {
      p_mode: 'live', p_dedupe_key: `live:${sha(paths.join('\n'))}`, p_paths: paths, p_subject: subject,
      p_snapshot: { lessons: ready, template: TEMPLATE_VERSION }, p_trigger: trigger, p_deploy_id: deployId || null
    });
    if (!opened.created) {
      report.notes.push(`campaign not opened: ${opened.reason}`);
      return report;
    }
    deps.log('info', 'campaign_opened', { campaign: opened.id, recipients: opened.recipient_count, lessons: paths });
    await deliverLiveCampaign(deps, config, { id: opened.id, subject, snapshot: { lessons: ready } }, deadline, report);
    return report;
  } catch (error) {
    deps.log('error', 'run_failed', { trigger, error: String(error?.message || error) });
    if (trigger !== 'sweep' || error instanceof ConfigError) {
      await notifyAdmin(deps, config, 'Run failed', [`Trigger: ${trigger}`, `Error: ${String(error?.message || error)}`, '', 'Nothing is lost: pending lessons stay pending and the hourly run retries.']);
    }
    return { ...report, error: String(error?.message || error) };
  } finally {
    if (leased) {
      try { await rpc(deps, config, 'lesson_email_release_lease', { p_holder: holder }); } catch { /* lease expires on its own */ }
    }
  }
}

/** True only for the production site's production deploys. */
export function isProductionDeploy({ context, siteName, siteUrl }, config) {
  if (context !== 'production') return false;
  if (siteName) return siteName === config.siteName;
  try {
    return new URL(siteUrl).host === new URL(config.siteUrl).host;
  } catch {
    return false;
  }
}

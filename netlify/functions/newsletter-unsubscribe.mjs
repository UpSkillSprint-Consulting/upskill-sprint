// Unsubscribe from new-lesson emails.
//
//   GET  /api/newsletter/unsubscribe?t=<token>   confirmation page (never unsubscribes:
//                                                link scanners and previews fetch GET)
//   POST /api/newsletter/unsubscribe?t=<token>   the page's button, or RFC 8058 one-click
//                                                ("List-Unsubscribe=One-Click") from Gmail/Yahoo/Apple Mail
//   GET  /api/newsletter/unsubscribe?preview=1   what test-send recipients see
//
// Tokens are HMAC-signed user ids (see _shared/lesson-email.mjs) and never expire.
// Responses are no-store, noindex and no-referrer so the token never leaks.

import { netlifyEnv, readConfig, verifyUnsubscribeToken, rpc, escapeHtml, defaultDeps, UNSUBSCRIBE_PATH } from './_shared/lesson-email.mjs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"
};

export function page(status, { title, heading, body, form = '' }) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<title>${escapeHtml(title)} | UpSkill Sprint</title>
<style>
  :root { --uss-bg:#f1f5f9; --uss-card:#ffffff; --uss-ink:#0f172a; --uss-soft:#334155; --uss-line:#dbe3ea; --uss-accent:#0e7490; --uss-on-accent:#ffffff; }
  @media (prefers-color-scheme: dark) {
    :root { --uss-bg:#0b1220; --uss-card:#111a2e; --uss-ink:#f1f5f9; --uss-soft:#cbd5e1; --uss-line:#24324d; --uss-accent:#5eead4; --uss-on-accent:#0b1220; }
  }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px 16px;
         background:var(--uss-bg); color:var(--uss-ink); font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  main { width:100%; max-width:520px; background:var(--uss-card); border:1px solid var(--uss-line); border-radius:14px; padding:28px 24px; }
  .brand { margin:0 0 18px; font-weight:800; font-size:18px; }
  .brand span { color:var(--uss-accent); }
  h1 { margin:0 0 10px; font-size:24px; line-height:1.25; }
  p { margin:0 0 14px; color:var(--uss-soft); }
  a { color:var(--uss-accent); font-weight:600; }
  button { appearance:none; border:0; border-radius:8px; padding:12px 20px; min-height:44px; font:inherit; font-weight:700;
           background:var(--uss-accent); color:var(--uss-on-accent); cursor:pointer; }
  button:focus-visible, a:focus-visible { outline:3px solid var(--uss-accent); outline-offset:3px; }
</style>
</head>
<body>
<main>
  <p class="brand">UpSkill <span>Sprint</span></p>
  <h1>${escapeHtml(heading)}</h1>
  ${body}
  ${form}
</main>
</body>
</html>`;
  return new Response(html, { status, headers: { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=utf-8' } });
}

const profileLink = '<p>You can turn new-lesson emails on or off any time in your <a href="/profile">profile</a>.</p>';

function invalidLink() {
  return page(400, {
    title: 'Link not valid',
    heading: 'This unsubscribe link isn’t valid',
    body: '<p>It may have been cut off by your email app. Copy the whole link from the email, or change your email settings in your profile.</p>' + profileLink
  });
}

function unavailable() {
  return page(503, {
    title: 'Try again shortly',
    heading: 'We couldn’t update your settings just now',
    body: '<p>Nothing has changed yet. Please try the link again in a few minutes, or turn off new-lesson emails in your <a href="/profile">profile</a>.</p>'
  });
}

export async function handleUnsubscribe(request, { env = netlifyEnv(), deps = defaultDeps() } = {}) {
  const config = readConfig(env);
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (url.searchParams.get('preview') === '1') {
    if (method === 'POST') return new Response('Preview only: nothing changed.', { status: 200, headers: { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' } });
    return page(200, {
      title: 'Unsubscribe preview',
      heading: 'Unsubscribe preview',
      body: '<p>This link came from a <strong>test send</strong>, so nothing was changed. Subscribers see a one-click “Unsubscribe me” button here.</p>' + profileLink
    });
  }

  if (method !== 'GET' && method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { ...SECURITY_HEADERS, Allow: 'GET, POST' } });
  }

  if (config.unsubscribeSecret.length < 32 || !config.serviceKey) {
    deps.log('error', 'unsubscribe_not_configured', {});
    return unavailable();
  }

  const token = url.searchParams.get('t') || '';
  const userId = verifyUnsubscribeToken(token, config.unsubscribeSecret);
  if (!userId) return invalidLink();
  const campaign = url.searchParams.get('c');
  const campaignId = campaign && UUID.test(campaign) ? campaign : null;

  if (method === 'GET') {
    const action = new URL(UNSUBSCRIBE_PATH, url.origin);
    action.searchParams.set('t', token);
    if (campaignId) action.searchParams.set('c', campaignId);
    return page(200, {
      title: 'Unsubscribe',
      heading: 'Stop new-lesson emails?',
      body: '<p>You’ll no longer get an email when a new lesson is published. Your account, progress and lessons are not affected.</p>',
      form: `<form method="post" action="${escapeHtml(action.pathname + action.search)}"><button type="submit">Unsubscribe me</button></form>`
    });
  }

  // POST: read a small form body to tell one-click from the button.
  let bodyText = '';
  try {
    bodyText = (await request.text()).slice(0, 2048);
  } catch { bodyText = ''; }
  const oneClick = /(^|&)List-Unsubscribe=One-Click(&|$)/i.test(bodyText.trim());

  let outcome;
  try {
    outcome = await rpc(deps, config, 'newsletter_unsubscribe', {
      p_user_id: userId, p_source: oneClick ? 'one_click' : 'link', p_campaign_id: campaignId
    });
  } catch (error) {
    deps.log('error', 'unsubscribe_failed', { error: String(error?.message || error) });
    if (oneClick) return new Response('Temporarily unavailable', { status: 503, headers: { ...SECURITY_HEADERS, 'Retry-After': '300' } });
    return unavailable();
  }
  deps.log('info', 'unsubscribed', { source: oneClick ? 'one_click' : 'link', outcome });

  if (oneClick) {
    return new Response('Unsubscribed', { status: 200, headers: { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  if (outcome === 'unknown') {
    return page(200, {
      title: 'Unsubscribed',
      heading: 'You won’t get new-lesson emails',
      body: '<p>We couldn’t find an account for this link, so there is nothing to send to.</p>'
    });
  }
  return page(200, {
    title: 'Unsubscribed',
    heading: 'You’re unsubscribed',
    body: '<p>You won’t get new-lesson emails any more. Changed your mind? Turn them back on in your <a href="/profile">profile</a>.</p>' +
      '<p><a href="/lessons">Browse lessons</a></p>'
  });
}

export default (request) => handleUnsubscribe(request);

export const config = {
  path: '/api/newsletter/unsubscribe',
  method: ['GET', 'POST'],
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};

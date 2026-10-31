const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.join(__dirname, '..');
const load = () => import(path.join(ROOT, 'netlify/functions/_shared/lesson-email.mjs'));
const loadFn = (name) => import(path.join(ROOT, 'netlify/functions', name));

const SECRET = 'x'.repeat(40);
const USER = '11111111-2222-4333-8444-555555555555';
const USER2 = '11111111-2222-4333-8444-666666666666';

const BASE_ENV = {
  LESSON_EMAIL_MODE: 'live',
  SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_test',
  RESEND_API_KEY: 're_test',
  NEWSLETTER_UNSUBSCRIBE_SECRET: SECRET,
  NEWSLETTER_POSTAL_ADDRESS: 'PO Box 123, Regina SK S4P 0A0, Canada',
  NEWSLETTER_ADMIN_EMAIL: 'owner@example.com',
  NEWSLETTER_TEST_RECIPIENTS: 'tester@example.com',
  NEWSLETTER_SEND_WINDOW: '0-24',
  ANTHROPIC_API_KEY: ''
};

function feedLessons(extra = []) {
  const lessons = [];
  for (let i = 0; i < 24; i += 1) {
    lessons.push({ path: `/lessons/old-${i}`, url: `https://upskillsprint.com/lessons/old-${i}`, title: `Old lesson ${i}`,
      description: 'An existing lesson.', teaser: null, email: 'announce', topic: 'statistics', level: 'beginner',
      minutes: 10, interactive: true, headings: [] });
  }
  return { version: 1, lessonCount: lessons.length + extra.length, previewPath: '/lessons/old-23', lessons: [...lessons, ...extra] };
}

const NEW_LESSON = {
  path: '/lessons/statistics/new-one', url: 'https://upskillsprint.com/lessons/statistics/new-one', title: 'Control <Charts> & You',
  description: 'Pick the right control chart for your data in five quick decisions.', teaser: null, email: 'announce',
  topic: 'statistics', level: 'intermediate', minutes: 15, interactive: true, headings: ['Pick a chart']
};

/**
 * A fake world: Supabase RPCs backed by a tiny in-memory model, Resend and the
 * site responding like production. Every outgoing request is recorded.
 */
function world({ feed = feedLessons([NEW_LESSON]), pending = null, recipients = [{ user_id: USER, email: 'a@example.com', display_name: 'Ada Lovelace' }],
  resend = () => ({ status: 200, body: { data: [] } }), lessonStatus = 200, leaseFree = true, active = [], ai = null } = {}) {
  const calls = [];
  const state = {
    pending: pending ?? [{ path: NEW_LESSON.path, title: NEW_LESSON.title, approved: false, teaser: null, teaser_source: null, first_seen_at: new Date().toISOString() }],
    queue: [...recipients],
    held: [],
    teasers: {},
    results: [],
    opened: [],
    finished: null
  };
  const json = (status, body, headers = {}) => ({
    ok: status >= 200 && status < 300, status,
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    json: async () => body, text: async () => (body === undefined ? '' : JSON.stringify(body))
  });
  const fetch = async (url, options = {}) => {
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ url: String(url), method: options.method || 'GET', headers: options.headers || {}, body });
    const u = String(url);
    if (u.startsWith('https://upskillsprint.com/feeds/lessons.json')) return json(200, feed);
    if (u.startsWith('https://upskillsprint.com/lessons/')) return json(lessonStatus, {});
    if (u.includes('/rest/v1/rpc/')) {
      const name = u.split('/rpc/')[1];
      switch (name) {
        case 'lesson_email_acquire_lease': return json(200, leaseFree);
        case 'lesson_email_release_lease': return json(200, null);
        case 'lesson_email_active_campaigns': return json(200, active);
        case 'lesson_email_sync_feed': return json(200, { bootstrapped: 0, inserted: state.pending.length, renamed: 0, withdrawn: 0, skipped: 0, pending: state.pending });
        case 'lesson_email_hold': state.held.push(...body.p_paths); return json(200, body.p_paths.length);
        case 'lesson_email_set_teaser': state.teasers[body.p_path] = [body.p_teaser, body.p_source]; return json(200, null);
        case 'lesson_email_open_campaign': state.opened.push(body); return json(200, { created: true, id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee', recipient_count: state.queue.length });
        case 'lesson_email_next_batch': { const batch = state.queue.splice(0, 100); return json(200, batch); }
        case 'lesson_email_record_results': state.results.push(...body.p_results);
          for (const r of body.p_results) if (r.outcome === 'retry') state.retried = true;
          return json(200, null);
        case 'lesson_email_finish_campaign': {
          const sent = state.results.filter((r) => r.outcome === 'sent').length;
          state.finished = { done: !state.retried, status: 'sent', sent, failed: 0, skipped: 0, recipients: recipients.length, already_finished: false };
          return json(200, state.finished);
        }
        case 'lesson_email_finish_test': state.testFinished = body; return json(200, null);
        default: return json(404, { message: 'unknown rpc ' + name });
      }
    }
    if (u.startsWith('https://api.resend.com/emails')) {
      const r = resend(u, body, options.headers);
      if (u.endsWith('/batch') && r.status === 200 && Array.isArray(body) && !(r.body?.data?.length)) {
        return json(200, { data: body.map((_, i) => ({ id: `email_${i}` })) });
      }
      if (u.endsWith('/emails') && r.status === 200 && !r.body?.id) return json(200, { id: 'email_single' });
      return json(r.status, r.body, r.headers || {});
    }
    if (u.startsWith('https://api.anthropic.com/')) {
      if (!ai) return json(500, {});
      return json(200, { content: [{ type: 'text', text: ai }], stop_reason: 'end_turn' });
    }
    throw new Error('unexpected fetch ' + u);
  };
  let clock = Date.parse('2026-11-02T16:00:00Z');
  const logs = [];
  const deps = { fetch, now: () => clock, sleep: async (ms) => { clock += ms; }, log: (level, event, data) => logs.push({ level, event, data }), uuid: () => 'run-1' };
  return { calls, state, deps, logs, resendCalls: () => calls.filter((c) => c.url.startsWith('https://api.resend.com')) };
}

test('config: off by default, and live requires every compliance setting', async () => {
  const { readConfig, configProblems } = await load();
  assert.equal(readConfig({}).mode, 'off');
  assert.deepEqual(configProblems(readConfig({})), []);
  assert.deepEqual(configProblems(readConfig(BASE_ENV)), []);
  const missing = configProblems(readConfig({ LESSON_EMAIL_MODE: 'live' }));
  assert.ok(missing.some((p) => /SUPABASE_SERVICE_ROLE_KEY/.test(p)));
  assert.ok(missing.some((p) => /RESEND_API_KEY/.test(p)));
  assert.ok(missing.some((p) => /POSTAL_ADDRESS/.test(p)), 'CASL mailing address is mandatory');
  assert.ok(missing.some((p) => /UNSUBSCRIBE_SECRET/.test(p)));
  assert.ok(configProblems(readConfig({ ...BASE_ENV, LESSON_EMAIL_MODE: 'LIVEE' })).some((p) => /off, test or live/.test(p)));
  assert.equal(readConfig({ ...BASE_ENV, LESSON_EMAIL_MODE: 'LIVEE' }).mode, 'off', 'a typo never sends');
  assert.ok(configProblems(readConfig({ ...BASE_ENV, NEWSLETTER_FROM: 'Me <me@gmail.com>' })).some((p) => /verified upskillsprint\.com/.test(p)));
  assert.ok(configProblems(readConfig({ ...BASE_ENV, LESSON_EMAIL_MODE: 'test', NEWSLETTER_TEST_RECIPIENTS: '' })).some((p) => /TEST_RECIPIENTS/.test(p)));
});

test('unsubscribe tokens verify, resist tampering and never expire', async () => {
  const { signUnsubscribeToken, verifyUnsubscribeToken } = await load();
  const token = signUnsubscribeToken(USER, SECRET);
  assert.equal(verifyUnsubscribeToken(token, SECRET), USER);
  assert.equal(verifyUnsubscribeToken(token.replace(USER, USER2), SECRET), null, 'signature is bound to the user');
  assert.equal(verifyUnsubscribeToken(token, 'y'.repeat(40)), null);
  assert.equal(verifyUnsubscribeToken(token.slice(0, -2), SECRET), null);
  assert.equal(verifyUnsubscribeToken('v1.not-a-uuid.abc', SECRET), null);
  assert.equal(verifyUnsubscribeToken(undefined, SECRET), null);
  assert.throws(() => signUnsubscribeToken(USER, 'short'));
});

test('email: escaped, accessible, compliant, with one-click unsubscribe and plain text', async () => {
  const { renderLessonEmail, readConfig, buildSubject } = await load();
  const config = readConfig(BASE_ENV);
  const lesson = { ...NEW_LESSON, teaser: 'Choose the right chart in minutes, then check it against your own data.' };
  const href = 'https://upskillsprint.com/api/newsletter/unsubscribe?t=abc';
  const email = renderLessonEmail({ lessons: [lesson], config, unsubscribeHref: href, recipientName: 'Ada Lovelace' });
  assert.equal(email.subject, 'New lesson: Control <Charts> & You');
  assert.ok(!email.html.includes('<Charts>'), 'title is HTML-escaped');
  assert.ok(email.html.includes('Control &lt;Charts&gt; &amp; You'));
  assert.ok(email.html.includes('Hi Ada,'));
  assert.ok(email.html.includes(lesson.teaser));
  assert.ok(email.html.includes('Intermediate · 15 min · Interactive · Statistics'));
  assert.ok(email.html.includes('utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=new-lesson&amp;utm_content=new-one'));
  assert.ok(email.html.includes(href.replace(/&/g, '&amp;')));
  assert.ok(email.html.includes('PO Box 123, Regina SK S4P 0A0, Canada'), 'mailing address (CASL)');
  assert.ok(email.html.includes('lang="en"') && email.html.includes('role="presentation"'));
  assert.ok(email.html.includes('prefers-color-scheme: dark'));
  assert.match(email.text, /Unsubscribe: https:\/\/upskillsprint\.com\/api\/newsletter\/unsubscribe\?t=abc/);
  assert.match(email.text, /UpSkill Sprint Consulting, PO Box 123/);
  assert.ok(!/<[a-z]/i.test(email.text.replace('Control <Charts> & You', '')), 'plain text has no markup');
  const generic = renderLessonEmail({ lessons: [lesson], config, unsubscribeHref: href, recipientName: 'Learner' });
  assert.ok(generic.html.includes('Hi there,'), 'the default profile name is not used as a greeting');
  assert.equal(buildSubject([lesson, { ...lesson, title: 'B' }]), '2 new lessons: Control <Charts> & You and more');
});

test('AI teasers are validated; hype, links and markup fall back', async () => {
  const { acceptableTeaser, catalogTeaser } = await load();
  assert.equal(acceptableTeaser('"Pick the right control chart in five decisions and stop guessing."'), 'Pick the right control chart in five decisions and stop guessing.');
  assert.equal(acceptableTeaser('Unlock the ultimate control chart secrets!'), null);
  assert.equal(acceptableTeaser('See https://example.com for a great control chart walkthrough today'), null);
  assert.equal(acceptableTeaser('Too short.'), null);
  assert.equal(catalogTeaser(NEW_LESSON), NEW_LESSON.description);
});

test('feed validation refuses partial or tampered catalogs', async () => {
  const { validateFeed, readConfig } = await load();
  const config = readConfig(BASE_ENV);
  assert.ok(validateFeed(feedLessons(), config));
  assert.throws(() => validateFeed({ version: 1, lessons: feedLessons().lessons.slice(0, 5) }, config), /partial catalog/);
  const bad = feedLessons();
  bad.lessons[0].url = 'https://evil.example/lessons/old-0';
  assert.throws(() => validateFeed(bad, config), /unexpected URL/);
  const dup = feedLessons();
  dup.lessons.push(dup.lessons[0]);
  assert.throws(() => validateFeed(dup, config), /repeats/);
});

test('send window respects the configured local hours', async () => {
  const { insideSendWindow, readConfig } = await load();
  const config = readConfig({ ...BASE_ENV, NEWSLETTER_SEND_WINDOW: '7-20', NEWSLETTER_TIMEZONE: 'America/Regina' });
  assert.equal(insideSendWindow(config, Date.parse('2026-11-02T16:00:00Z')), true, '10:00 in Regina');
  assert.equal(insideSendWindow(config, Date.parse('2026-11-02T08:00:00Z')), false, '02:00 in Regina');
});

test('live run: sends once per recipient with unsubscribe headers, then reports', async () => {
  const { runAnnouncer, readConfig } = await load();
  const w = world({ recipients: [
    { user_id: USER, email: 'a@example.com', display_name: 'Ada' },
    { user_id: USER2, email: 'b@example.com', display_name: 'Learner' }] });
  const report = await runAnnouncer({ trigger: 'deploy', deployId: 'dep1', config: readConfig(BASE_ENV), deps: w.deps, budgetMs: 50000 });
  assert.equal(report.error, undefined, JSON.stringify(report));
  assert.equal(report.sent, 2);
  const batch = w.resendCalls().find((c) => c.url.endsWith('/emails/batch'));
  assert.equal(batch.body.length, 2);
  for (const email of batch.body) {
    assert.equal(email.to.length, 1, 'one recipient per email; addresses are never exposed to each other');
    assert.match(email.headers['List-Unsubscribe'], /^<https:\/\/upskillsprint\.com\/api\/newsletter\/unsubscribe\?t=v1\./);
    assert.equal(email.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
    assert.equal(email.subject, 'New lesson: Control <Charts> & You');
  }
  assert.ok(batch.headers['Idempotency-Key'].startsWith('lesson-email/'));
  assert.ok(batch.headers['User-Agent']);
  assert.deepEqual(w.state.teasers[NEW_LESSON.path], [NEW_LESSON.description, 'catalog'], 'no AI key: catalog description, stored');
  const opened = w.state.opened[0];
  assert.equal(opened.p_mode, 'live');
  assert.deepEqual(opened.p_paths, [NEW_LESSON.path]);
  const admin = w.resendCalls().find((c) => c.url.endsWith('/emails') && c.body.to[0] === 'owner@example.com');
  assert.match(admin.body.subject, /Sent "New lesson: Control <Charts> & You" to 2 subscribers/);
  assert.ok(w.calls.some((c) => c.url.endsWith('lesson_email_release_lease')), 'lease always released');
  assert.ok(!JSON.stringify(w.logs).includes('a@example.com'), 'no email addresses in logs');
});

test('author teaser wins; AI teaser used when there is none', async () => {
  const { runAnnouncer, readConfig } = await load();
  const authored = { ...NEW_LESSON, teaser: 'Choose the right chart in minutes, then check it against your own data.' };
  const w1 = world({ feed: feedLessons([authored]) });
  await runAnnouncer({ trigger: 'deploy', config: readConfig({ ...BASE_ENV, ANTHROPIC_API_KEY: 'k' }), deps: w1.deps, budgetMs: 50000 });
  assert.deepEqual(w1.state.teasers[NEW_LESSON.path], [authored.teaser, 'author']);
  assert.ok(!w1.calls.some((c) => c.url.includes('anthropic')), 'no AI call when the author wrote one');

  const w2 = world({ ai: 'Pick the right control chart in five decisions and stop second-guessing your data.' });
  await runAnnouncer({ trigger: 'deploy', config: readConfig({ ...BASE_ENV, ANTHROPIC_API_KEY: 'k' }), deps: w2.deps, budgetMs: 50000 });
  assert.equal(w2.state.teasers[NEW_LESSON.path][1], 'ai');
});

test('mode off and non-production never touch Supabase or Resend', async () => {
  const { runAnnouncer, readConfig } = await load();
  const w = world();
  const report = await runAnnouncer({ trigger: 'deploy', config: readConfig({ ...BASE_ENV, LESSON_EMAIL_MODE: 'off' }), deps: w.deps, budgetMs: 50000 });
  assert.equal(report.skipped, 'mode_off');
  assert.equal(w.calls.length, 0);

  const { handleDeploySucceeded } = await loadFn('lesson-email-deploy.mjs');
  for (const event of [
    { deploy: { id: 'd', context: 'deploy-preview' }, site: { name: 'upskillsprint' } },
    { deploy: { id: 'd', context: 'branch-deploy' }, site: { name: 'upskillsprint' } },
    { deploy: { id: 'd', context: 'production' }, site: { name: 'upskillsprint-stagging' } },
    { deploy: { id: 'd', context: 'production' }, site: {} }
  ]) {
    const w2 = world();
    const result = await handleDeploySucceeded(event, { env: BASE_ENV, deps: w2.deps });
    assert.equal(result.skipped, 'not_production', JSON.stringify(event));
    assert.equal(w2.calls.length, 0);
  }
  const w3 = world();
  const prod = await handleDeploySucceeded({ deploy: { id: 'd', context: 'production' }, site: { name: 'upskillsprint' } }, { env: BASE_ENV, deps: w3.deps });
  assert.equal(prod.sent, 1);
  const legacy = await handleDeploySucceeded({ payload: { id: 'd', context: 'production', name: 'upskillsprint' } }, { env: BASE_ENV, deps: world().deps });
  assert.equal(legacy.sent, 1, 'legacy event payload shape is understood');

  const { handleSweep } = await loadFn('lesson-email-sweep.mjs');
  const staging = await handleSweep({ site: { name: 'upskillsprint-stagging' } }, { env: BASE_ENV, deps: world().deps });
  assert.equal(staging.skipped, 'not_production');
});

test('incomplete config blocks sending and alerts on deploy only', async () => {
  const { runAnnouncer, readConfig } = await load();
  const env = { ...BASE_ENV, NEWSLETTER_POSTAL_ADDRESS: '' };
  const w = world();
  const report = await runAnnouncer({ trigger: 'deploy', config: readConfig(env), deps: w.deps, budgetMs: 50000 });
  assert.equal(report.skipped, 'config_incomplete');
  assert.ok(!w.calls.some((c) => c.url.includes('/rest/v1/')));
  assert.equal(w.resendCalls().length, 1, 'one admin alert');
  const w2 = world();
  await runAnnouncer({ trigger: 'sweep', config: readConfig(env), deps: w2.deps, budgetMs: 22000 });
  assert.equal(w2.resendCalls().length, 0, 'the hourly sweep does not repeat the alert');
});

test('safety cap holds a burst of new lessons and alerts once', async () => {
  const { runAnnouncer, readConfig } = await load();
  const extra = [1, 2, 3, 4].map((n) => ({ ...NEW_LESSON, path: `/lessons/statistics/burst-${n}`, url: `https://upskillsprint.com/lessons/statistics/burst-${n}`, title: `Burst ${n}` }));
  const w = world({ feed: feedLessons(extra), pending: extra.map((l) => ({ path: l.path, title: l.title, approved: false, first_seen_at: new Date().toISOString() })) });
  const report = await runAnnouncer({ trigger: 'deploy', config: readConfig(BASE_ENV), deps: w.deps, budgetMs: 50000 });
  assert.equal(report.held, 4);
  assert.equal(w.state.opened.length, 0, 'nothing sent to subscribers');
  const alert = w.resendCalls().find((c) => c.body?.to?.[0] === 'owner@example.com');
  assert.match(alert.body.subject, /Held 4 new lessons/);
  assert.match(alert.body.text, /lesson_email_release\(array\['\/lessons\/statistics\/burst-1'/);
});

test('a lesson whose page does not load is not announced', async () => {
  const { runAnnouncer, readConfig } = await load();
  const w = world({ lessonStatus: 404 });
  await runAnnouncer({ trigger: 'deploy', config: readConfig(BASE_ENV), deps: w.deps, budgetMs: 50000 });
  assert.equal(w.state.opened.length, 0);
});

test('outside the send window live sends wait for the hourly run', async () => {
  const { runAnnouncer, readConfig } = await load();
  const w = world();
  const report = await runAnnouncer({ trigger: 'deploy', config: readConfig({ ...BASE_ENV, NEWSLETTER_SEND_WINDOW: '7-8', NEWSLETTER_TIMEZONE: 'America/Regina' }), deps: w.deps, budgetMs: 50000 });
  assert.equal(w.state.opened.length, 0);
  assert.ok(report.notes.some((n) => /send window/.test(n)));
});

test('test mode emails only the test recipients and never opens a live campaign', async () => {
  const { runAnnouncer, readConfig } = await load();
  const w = world();
  const report = await runAnnouncer({ trigger: 'manual', config: readConfig({ ...BASE_ENV, LESSON_EMAIL_MODE: 'test' }), deps: w.deps, budgetMs: 50000 });
  assert.equal(report.testSent, 1);
  assert.equal(w.state.opened[0].p_mode, 'test');
  const batch = w.resendCalls().find((c) => c.url.endsWith('/emails/batch'));
  assert.deepEqual(batch.body.map((e) => e.to[0]), ['tester@example.com']);
  assert.match(batch.body[0].subject, /^\[TEST\] /);
  assert.match(batch.body[0].headers['List-Unsubscribe'], /preview=1/);
  assert.ok(!w.calls.some((c) => c.url.endsWith('lesson_email_next_batch')), 'subscribers are never read');

  const w2 = world({ pending: [] });
  const preview = await runAnnouncer({ trigger: 'manual', config: readConfig({ ...BASE_ENV, LESSON_EMAIL_MODE: 'test' }), deps: w2.deps, budgetMs: 50000 });
  assert.ok(preview.notes.some((n) => /test preview uses \/lessons\/old-23/.test(n)), 'previews the newest lesson when nothing is pending');
});

test('rate limits are retried; a rejected batch is isolated per recipient', async () => {
  const { runAnnouncer, readConfig } = await load();
  let attempts = 0;
  const w = world({ resend: (url) => {
    if (url.endsWith('/batch')) { attempts += 1; return attempts < 3 ? { status: 429, body: { message: 'slow down' }, headers: { 'retry-after': '1' } } : { status: 200, body: {} }; }
    return { status: 200, body: {} };
  } });
  const report = await runAnnouncer({ trigger: 'deploy', config: readConfig(BASE_ENV), deps: w.deps, budgetMs: 50000 });
  assert.equal(attempts, 3);
  assert.equal(report.sent, 1);
  const keys = w.resendCalls().filter((c) => c.url.endsWith('/batch')).map((c) => c.headers['Idempotency-Key']);
  assert.equal(new Set(keys).size, 1, 'retries reuse the idempotency key, so Resend never double-sends');

  const w2 = world({
    recipients: [{ user_id: USER, email: 'a@example.com', display_name: 'A' }, { user_id: USER2, email: 'bad@example.com', display_name: 'B' }],
    resend: (url, body) => {
      if (url.endsWith('/batch')) return { status: 422, body: { message: 'Invalid `to` field' } };
      return body.to[0] === 'bad@example.com' ? { status: 422, body: { message: 'Invalid `to`' } } : { status: 200, body: {} };
    }
  });
  await runAnnouncer({ trigger: 'deploy', config: readConfig(BASE_ENV), deps: w2.deps, budgetMs: 50000 });
  const outcomes = Object.fromEntries(w2.state.results.map((r) => [r.user_id, r.outcome]));
  assert.deepEqual(outcomes, { [USER]: 'sent', [USER2]: 'failed' });
});

test('a bad Resend key stops the run and alerts instead of burning retries', async () => {
  const { runAnnouncer, readConfig } = await load();
  const w = world({ resend: () => ({ status: 401, body: { message: 'API key is invalid' } }) });
  const report = await runAnnouncer({ trigger: 'deploy', config: readConfig(BASE_ENV), deps: w.deps, budgetMs: 50000 });
  assert.match(report.error, /Resend rejected the API key/);
  assert.equal(w.state.results.length, 0, 'recipients stay queued for the next run');
});

test('a busy lease means another run is working: do nothing', async () => {
  const { runAnnouncer, readConfig } = await load();
  const w = world({ leaseFree: false });
  const report = await runAnnouncer({ trigger: 'sweep', config: readConfig(BASE_ENV), deps: w.deps, budgetMs: 22000 });
  assert.equal(report.skipped, 'busy');
  assert.equal(w.resendCalls().length, 0);
});

test('unsubscribe endpoint: GET confirms, POST and one-click unsubscribe, bad tokens rejected', async () => {
  const { handleUnsubscribe } = await loadFn('newsletter-unsubscribe.mjs');
  const { signUnsubscribeToken } = await load();
  const token = signUnsubscribeToken(USER, SECRET);
  const rpcCalls = [];
  const deps = {
    fetch: async (url, options) => { rpcCalls.push(JSON.parse(options.body)); return { ok: true, status: 200, text: async () => '"unsubscribed"' }; },
    log: () => {}, now: () => Date.now(), sleep: async () => {}, uuid: () => 'x'
  };
  const base = 'https://upskillsprint.com/api/newsletter/unsubscribe';

  const get = await handleUnsubscribe(new Request(`${base}?t=${token}`), { env: BASE_ENV, deps });
  assert.equal(get.status, 200);
  assert.equal(rpcCalls.length, 0, 'GET never unsubscribes (link scanners)');
  const html = await get.text();
  assert.match(html, /<form method="post"/);
  assert.match(html, /Unsubscribe me/);
  assert.equal(get.headers.get('Referrer-Policy'), 'no-referrer');
  assert.equal(get.headers.get('Cache-Control'), 'no-store');
  assert.match(get.headers.get('X-Robots-Tag'), /noindex/);

  const post = await handleUnsubscribe(new Request(`${base}?t=${token}`, { method: 'POST', body: '' }), { env: BASE_ENV, deps });
  assert.equal(post.status, 200);
  assert.match(await post.text(), /You’re unsubscribed/);
  assert.deepEqual(rpcCalls.at(-1), { p_user_id: USER, p_source: 'link', p_campaign_id: null });

  const oneClick = await handleUnsubscribe(new Request(`${base}?t=${token}&c=aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'List-Unsubscribe=One-Click' }), { env: BASE_ENV, deps });
  assert.equal(oneClick.status, 200);
  assert.deepEqual(rpcCalls.at(-1), { p_user_id: USER, p_source: 'one_click', p_campaign_id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee' });

  const forged = await handleUnsubscribe(new Request(`${base}?t=${token.replace(USER, USER2)}`, { method: 'POST' }), { env: BASE_ENV, deps });
  assert.equal(forged.status, 400);
  assert.equal(rpcCalls.length, 2);

  const preview = await handleUnsubscribe(new Request(`${base}?preview=1`), { env: BASE_ENV, deps });
  assert.match(await preview.text(), /test send/);

  const unconfigured = await handleUnsubscribe(new Request(`${base}?t=${token}`, { method: 'POST' }), { env: {}, deps });
  assert.equal(unconfigured.status, 503);
});

test('function configs: routes, schedule and rate limit', async () => {
  const unsub = await loadFn('newsletter-unsubscribe.mjs');
  assert.equal(unsub.config.path, '/api/newsletter/unsubscribe');
  assert.ok(unsub.config.rateLimit.windowLimit > 0);
  const sweep = await loadFn('lesson-email-sweep.mjs');
  assert.match(sweep.config.schedule, /^\d+ \* \* \* \*$/);
  const deploy = await loadFn('lesson-email-deploy.mjs');
  assert.equal(typeof deploy.default.deploySucceeded, 'function');
});

test('build wiring: feed is generated after staging, served fresh and kept out of search', () => {
  const build = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts['build:site'];
  const stage = build.indexOf('stage-public-site.mjs');
  const feed = build.indexOf('build-lesson-email-feed.mjs');
  assert.ok(stage > -1 && feed > stage, 'feed is built after the site is staged');
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  assert.match(toml, /for = "\/feeds\/\*"[\s\S]*?max-age=0, must-revalidate[\s\S]*?X-Robots-Tag = "noindex"/);
});

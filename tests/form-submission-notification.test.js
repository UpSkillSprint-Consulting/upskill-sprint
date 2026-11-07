const { test } = require('node:test');
const assert = require('node:assert/strict');

const load = () => import('../netlify/functions/form-submission-notification.mjs');

const ENV = {
  RESEND_API_KEY: 're_test',
  NEWSLETTER_ADMIN_EMAIL: 'hello@upskillsprint.com',
  NEWSLETTER_FROM: 'UpSkill Sprint <lessons@news.upskillsprint.com>'
};

function fakeDeps(response = { ok: true, status: 200 }) {
  const calls = [];
  const logs = [];
  return {
    calls,
    logs,
    deps: {
      fetch: async (...args) => {
        calls.push(args);
        return response;
      },
      log: (...args) => logs.push(args)
    }
  };
}

test('sends a verified signup notification to the configured mailbox with safe content', async () => {
  const { handleFormSubmitted } = await load();
  const { calls, deps } = fakeDeps();
  const result = await handleFormSubmitted({
    form: { name: 'signup' },
    submission: { id: 'submission-123' },
    data: {
      email: 'learner@example.com',
      source: 'starter-kit',
      marketing_opt_in: 'yes',
      'bot-field': '',
      message: '<script>alert("x")</script>'
    }
  }, { env: ENV, deps });

  assert.deepEqual(result, { sent: true });
  assert.equal(calls.length, 1);
  const [url, request] = calls[0];
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(request.method, 'POST');
  assert.equal(request.headers.Authorization, 'Bearer re_test');
  assert.match(request.headers['Idempotency-Key'], /^netlify-form-notification\//);
  const payload = JSON.parse(request.body);
  assert.deepEqual(payload.to, ['hello@upskillsprint.com']);
  assert.equal(payload.reply_to, 'learner@example.com');
  assert.match(payload.subject, /signup/);
  assert.match(payload.text, /marketing_opt_in: yes/);
  assert.doesNotMatch(payload.text, /bot-field/);
  assert.match(payload.html, /&lt;script&gt;/);
});

test('skips delivery when the email configuration is incomplete', async () => {
  const { handleFormSubmitted } = await load();
  const { calls, deps } = fakeDeps();
  const result = await handleFormSubmitted({ form: { name: 'contact' }, data: { email: 'learner@example.com' } }, {
    env: { NEWSLETTER_ADMIN_EMAIL: ENV.NEWSLETTER_ADMIN_EMAIL },
    deps
  });

  assert.deepEqual(result, { sent: false, reason: 'not_configured' });
  assert.equal(calls.length, 0);
});

test('skips empty and honeypot-only form events', async () => {
  const { handleFormSubmitted } = await load();
  const { calls, deps } = fakeDeps();
  const empty = await handleFormSubmitted({ form: { name: 'contact' }, data: {} }, { env: ENV, deps });
  const honeypot = await handleFormSubmitted({ form_name: 'signup', data: { 'bot-field': 'filled' } }, { env: ENV, deps });

  assert.deepEqual(empty, { sent: false, reason: 'no_fields' });
  assert.deepEqual(honeypot, { sent: false, reason: 'no_fields' });
  assert.equal(calls.length, 0);
});

test('reports a provider failure without exposing submitted field values in logs', async () => {
  const { handleFormSubmitted } = await load();
  const { calls, logs, deps } = fakeDeps({ ok: false, status: 422 });
  const result = await handleFormSubmitted({
    formName: 'contact',
    data: { email: 'learner@example.com', message: 'private submission text' }
  }, { env: ENV, deps });

  assert.deepEqual(result, { sent: false, reason: 'provider_error' });
  assert.equal(calls.length, 1);
  assert.doesNotMatch(JSON.stringify(logs), /learner@example.com|private submission text/);
});

test('escapes submitted values in HTML and renders useful text', async () => {
  const { renderNotification } = await load();
  const rendered = renderNotification({
    formName: 'contact',
    submissionId: 'submission-456',
    fields: [['message', '<b>unsafe</b>']]
  });

  assert.match(rendered.subject, /contact/);
  assert.match(rendered.html, /&lt;b&gt;unsafe&lt;\/b&gt;/);
  assert.match(rendered.text, /message: <b>unsafe<\/b>/);
});

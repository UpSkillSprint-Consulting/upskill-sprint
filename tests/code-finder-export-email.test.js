const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');

const ROOT = join(__dirname, '..');
const load = () => import('../netlify/functions/form-submission-notification.mjs');
const shared = () => import('../netlify/functions/_shared/code-finder-export-email.mjs');
const ENV = {
  RESEND_API_KEY: 're_test',
  NEWSLETTER_ADMIN_EMAIL: 'hello@upskillsprint.com',
  NEWSLETTER_FROM: 'UpSkill Sprint <lessons@news.upskillsprint.com>',
  NEWSLETTER_POSTAL_ADDRESS: '380 McCarthy Blvd, Regina, SK S4R 7M0'
};
const NOW = new Date('2026-11-20T12:00:00Z');

function deps(responses = []) {
  const calls = [], logs = [];
  return {calls, logs, deps: {
    fetch: async (url, options) => { calls.push({url, options, body: JSON.parse(options.body)}); return responses.shift() || {ok: true, status: 200}; },
    log: (...args) => logs.push(args)
  }};
}
const exportEvent = data => ({form: {name: 'code-finder-export'}, submission: {id: 'sub-42'},
  data: {'form-name': 'code-finder-export', email: 'ernie@example.com', pack: 'spc-msa-toolkit', marketing_opt_in: 'yes', 'bot-field': '', ...data}});

test('the visitor gets their pack: every code with its reason, status, links and the CSV attached', async () => {
  const {loadCodeFinderIndex, renderPackEmail} = await shared();
  const index = await loadCodeFinderIndex(ROOT);
  const mail = renderPackEmail(index, 'spc-msa-toolkit', {postalAddress: ENV.NEWSLETTER_POSTAL_ADDRESS, now: NOW});
  const pack = JSON.parse(readFileSync(join(ROOT, 'data/code-finder/scenarios.json'), 'utf8')).packs.find(p => p.slug === 'spc-msa-toolkit');
  assert.equal(mail.subject, 'Your Code Finder pack: SPC, capability and measurement systems');
  for (const item of pack.records) {
    assert.ok(mail.text.includes(item.why), item.id);
    assert.ok(mail.html.includes(`/codes/${item.id.replace('-', '/')}/`), item.id + ' links to its page');
  }
  assert.ok(mail.html.includes('https://upskillsprint.com/tools/code-finder/?pack=spc-msa-toolkit'));
  assert.ok(mail.html.includes('380 McCarthy Blvd, Regina, SK S4R 7M0'));
  assert.match(mail.text, /Not yet checked: confirm the current edition/);
  assert.equal(mail.html.includes('Need help applying this?'), false, 'not a regulated pack');
  assert.equal(mail.attachment.filename, 'code-finder-spc-msa-toolkit.csv');
  const csv = Buffer.from(mail.attachment.content, 'base64').toString('utf8');
  assert.ok(csv.startsWith('﻿Code Finder starter pack,"SPC, capability and measurement systems"'));
  assert.equal(renderPackEmail(index, 'no-such-pack'), null);
});

test('regulated packs carry the consulting note, and catalog text is escaped', async () => {
  const {loadCodeFinderIndex, renderPackEmail} = await shared();
  const index = await loadCodeFinderIndex(ROOT);
  assert.ok(renderPackEmail(index, 'pipeline-integrity', {now: NOW}).html.includes('Need help applying this?'));
  const E = require('../tools/code-finder/code-finder-engine.js');
  const json = name => JSON.parse(readFileSync(join(ROOT, 'data/code-finder', name + '.json'), 'utf8'));
  const scenarios = json('scenarios');
  scenarios.packs[0].title = '<img src=x onerror=alert(1)>';
  const evil = E.buildIndex({taxonomy: json('taxonomy'), standards: json('standards'), synonyms: json('synonyms'), scenarios});
  const html = renderPackEmail(evil, scenarios.packs[0].slug, {now: NOW}).html;
  assert.equal(html.includes('<img src=x'), false);
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
});

test('an export sends you a readable lead alert and the visitor their pack, with separate idempotency keys', async () => {
  const {handleFormSubmitted} = await load();
  const {calls, deps: d} = deps();
  const result = await handleFormSubmitted(exportEvent(), {env: ENV, deps: d});
  assert.deepEqual(result, {sent: true, confirmation: 'sent'});
  assert.equal(calls.length, 2);
  const [alert, visitor] = calls.map(call => call.body);
  assert.deepEqual(alert.to, ['hello@upskillsprint.com']);
  assert.equal(alert.subject, 'Code Finder lead: SPC, capability and measurement systems');
  assert.equal(alert.reply_to, 'ernie@example.com');
  assert.match(alert.text, /Wants update emails: Yes \(opted in\)/);
  assert.doesNotMatch(alert.subject, /lesson request/i);
  assert.deepEqual(visitor.to, ['ernie@example.com']);
  assert.equal(visitor.reply_to, 'hello@upskillsprint.com');
  assert.equal(visitor.subject, 'Your Code Finder pack: SPC, capability and measurement systems');
  assert.equal(visitor.attachments[0].filename, 'code-finder-spc-msa-toolkit.csv');
  const keys = calls.map(call => call.options.headers['Idempotency-Key']);
  assert.ok(keys[0] && keys[1] && keys[0] !== keys[1]);
});

test('without the opt-in, the alert says not to add them to the newsletter', async () => {
  const {handleFormSubmitted} = await load();
  const {calls, deps: d} = deps();
  await handleFormSubmitted(exportEvent({marketing_opt_in: undefined}), {env: ENV, deps: d});
  assert.match(calls[0].body.text, /Wants update emails: No: do not add to the newsletter/);
});

test('a bad email or unknown pack still alerts you but sends the visitor nothing', async () => {
  const {handleFormSubmitted} = await load();
  for (const data of [{email: 'not-an-email'}, {pack: 'made-up-pack'}]) {
    const {calls, deps: d} = deps();
    const result = await handleFormSubmitted(exportEvent(data), {env: ENV, deps: d});
    assert.equal(calls.length, 1, JSON.stringify(data));
    assert.deepEqual(calls[0].body.to, ['hello@upskillsprint.com']);
    assert.equal(result.confirmation, 'skipped');
  }
});

test('if the visitor email fails, your alert still counts as sent and the failure is logged', async () => {
  const {handleFormSubmitted} = await load();
  const {logs, deps: d} = deps([{ok: true, status: 200}, {ok: false, status: 422}]);
  const result = await handleFormSubmitted(exportEvent(), {env: ENV, deps: d});
  assert.deepEqual(result, {sent: true, confirmation: 'failed'});
  assert.ok(logs.some(([level, name, data]) => level === 'error' && name === 'notification_send_failed' && data.kind === 'visitor_pack'));
});

test('if the catalog cannot be read, you still get the generic alert', async () => {
  const {handleFormSubmitted} = await load();
  const {calls, deps: d} = deps();
  const result = await handleFormSubmitted(exportEvent(), {env: ENV, deps: d, loadIndex: async () => { throw new Error('ENOENT'); }});
  assert.equal(result.sent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.subject, 'New code-finder-export submission — UpSkill Sprint');
});

test('the function is deployed with the catalog files it reads', () => {
  const toml = readFileSync(join(ROOT, 'netlify.toml'), 'utf8');
  assert.match(toml, /\[functions\."form-submission-notification"\]\s*\n\s*included_files = \["data\/code-finder\/\*\.json"\]/);
});

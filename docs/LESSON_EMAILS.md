# New-lesson announcement emails — runbook

**What it does:** when a new lesson is merged to `main` and the production deploy succeeds,
every account that opted in to "Email me when new lessons are published" gets one email
announcing it. Nobody presses a button. Authors only add a teaser line (see
`docs/LESSON_CREATION_GUIDE.md` §12.7).

It ships **switched off** (`LESSON_EMAIL_MODE` unset). Follow "Go-live" below.

---

## How it works

```
merge to main ─► Netlify production build ─► /feeds/lessons.json (from the lesson catalog)
                                   │
                   deploy succeeded ▼
            lesson-email-deploy.mjs ──┐        lesson-email-sweep.mjs (hourly, minute 23 UTC)
                                      ▼                     │  safety net + resume + "Run now"
                       _shared/lesson-email.mjs ◄───────────┘
                                      │
       Supabase: lesson_email_sync_feed() decides what is new (exactly once)
                                      │
       safety checks ─► teaser ─► Resend batch send ─► per-recipient results recorded
```

| Piece | File |
|---|---|
| Feed builder (runs in `build:site`) | `scripts/build-lesson-email-feed.mjs` |
| Announcer logic, email template, Resend client | `netlify/functions/_shared/lesson-email.mjs` |
| Trigger after production deploy | `netlify/functions/lesson-email-deploy.mjs` |
| Hourly safety net / manual trigger | `netlify/functions/lesson-email-sweep.mjs` |
| Unsubscribe page + RFC 8058 one-click | `netlify/functions/newsletter-unsubscribe.mjs` → `/api/newsletter/unsubscribe` |
| Database (state machine, recipients, audit) | `supabase/migrations/20261031180000_lesson_announcement_emails.sql` |
| Tests | `tests/lesson-email*.test.js` (real Postgres via PGlite, fake Resend/Supabase) |

### What counts as "new"

The first run records every lesson already on the site as **baseline** (never emailed).
After that, a catalog path Supabase has never seen becomes **pending** and is announced once.

| Situation | Result |
|---|---|
| New lesson merged | Announced once, after its page returns HTTP 200 |
| Existing lesson updated | Nothing (same path) |
| Lesson moved to a new path, same title | `renamed`: not announced |
| `<meta name="upskill:email" content="skip">` | `skipped`: never announced |
| Lesson reverted before it was announced | `withdrawn` |
| 2–3 lessons in one deploy | One digest email |
| More than `NEWSLETTER_MAX_LESSONS` (3) at once | `held`, nothing sent, owner alerted |
| Page not loading for 48 h | `held`, owner alerted |
| Merged outside the send window (7:00–20:00 Regina) | Sent at the next hourly run inside the window |

### Who receives it

Accounts whose profile has `newsletter_opt_in = true` with a recorded consent time, a
**confirmed** email, not banned and not deleted. Eligibility is checked again right before
each email, so someone who unsubscribes mid-send is skipped.

### Reliability guarantees

- **Never twice:** lesson status machine + row locks; deliveries keyed by (campaign, user);
  Resend `Idempotency-Key` on every request (retries reuse it).
- **No race:** a single runner lease, so the deploy event and the hourly run never send together.
- **Nothing lost:** a timeout, crash, 429 or 5xx leaves recipients queued; the next run resumes.
- **Fails safe:** off by default; an invalid mode value means off; missing settings block sending
  and alert you; a feed with fewer than 20 lessons is refused; a bad API key stops the run.
- **Staging can't send:** only the production context of the site named `upskillsprint` runs.

### Teaser (the catchy line)

1. The lesson's `<meta name="upskill:email-teaser">` (author-written; build-validated).
2. Otherwise an AI-drafted sentence (Claude Haiku via the existing `ANTHROPIC_API_KEY`), from
   the title, catalog description and headings only, then checked: 40–160 characters, no
   links, no markup, no hype words or `!`.
3. Otherwise the catalog description.

The chosen teaser is stored, so a resumed send or retry uses the same words.

### Compliance (CASL, Gmail/Yahoo bulk-sender rules)

- Express opt-in with timestamp (existing signup/profile checkbox).
- Sender identified; mailing address in every email (`NEWSLETTER_POSTAL_ADDRESS`, required).
- Unsubscribe link in every email, working indefinitely; RFC 8058 one-click
  (`List-Unsubscribe` + `List-Unsubscribe-Post`); honoured immediately; logged in
  `newsletter_private.unsubscribe_events`. GET never unsubscribes (link scanners).
- Domain: SPF (`send.upskillsprint.com`), DKIM (`resend._domainkey`) and DMARC are published.
  DMARC is `p=none`; once a few weeks of reports are clean, consider `p=quarantine`.
- **Keep Resend open and click tracking OFF** for upskillsprint.com: the privacy policy
  (`privacy.html#new-lesson-emails`) says there are no tracking pixels.
- Logs contain no email addresses.

---

## Go-live (one time)

### 1. Merge this PR

Safe: the mode is off, so nothing sends.

### 2. Run the migration (Ernest)

Supabase → SQL editor → paste `supabase/migrations/20261031180000_lesson_announcement_emails.sql` → Run.
It only adds a private schema, tables and functions; it does not touch existing data.

### 3. Netlify environment variables

Netlify → Site configuration → Environment variables. Scope: **Functions**. Context:
**Production** only (so deploy previews and branch deploys can never send).

| Variable | Value | Secret? |
|---|---|---|
| `LESSON_EMAIL_MODE` | `test` first, later `live` | no |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API keys → secret key | **yes** |
| `RESEND_API_KEY` | Resend → API keys → create a **Sending access** key limited to `upskillsprint.com` | **yes** |
| `NEWSLETTER_UNSUBSCRIBE_SECRET` | 48+ random characters (`openssl rand -base64 48`). Never change it: old unsubscribe links depend on it | **yes** |
| `NEWSLETTER_POSTAL_ADDRESS` | Business mailing address (PO box is fine), e.g. `PO Box 123, Regina SK S4P 0A0, Canada` | no |
| `NEWSLETTER_TEST_RECIPIENTS` | Your address(es), comma-separated, max 5 | no |
| `NEWSLETTER_ADMIN_EMAIL` | Where alerts and send summaries go | no |
| `NEWSLETTER_REPLY_TO` | Optional, e.g. `skillsprintconsulting@gmail.com` (replies reach a person) | no |

Optional: `NEWSLETTER_FROM` (default `UpSkill Sprint <noreply@upskillsprint.com>`; must be
`@upskillsprint.com`), `NEWSLETTER_MAX_LESSONS` (3), `NEWSLETTER_SEND_WINDOW` (`7-20`),
`NEWSLETTER_TIMEZONE` (`America/Regina`), `NEWSLETTER_PREVIEW_PATH` (lesson to preview in
test mode), `NEWSLETTER_AI_MODEL`.

Environment changes apply to the **next** deploy: Deploys → Trigger deploy → Deploy site.

### 4. Test mode

With `LESSON_EMAIL_MODE=test`, the redeploy:

- records all current lessons as the baseline (you get a "Switched on" notice), and
- sends **only to `NEWSLETTER_TEST_RECIPIENTS`** a `[TEST]` email previewing the newest
  lesson (or any pending one). Subscribers are never read in test mode.

Check on your phone and desktop, light and dark: subject, teaser, button, footer address,
and that the unsubscribe link opens the preview page. Change the teaser or template and
redeploy to get a fresh test (identical tests are sent once).

### 5. Live

Set `LESSON_EMAIL_MODE=live` and redeploy. From now on every lesson merged to `main` is
emailed automatically. You get a summary email after each send.

To pause at any time: `LESSON_EMAIL_MODE=off` + redeploy. Pending lessons wait; nothing is lost.

---

## Owner commands (Supabase SQL editor)

```sql
-- Everything at a glance: pending/held lessons, audience size, last campaigns, unsubscribes.
select public.lesson_email_status();

-- Send held lessons (also re-queues a campaign that reached nobody).
select public.lesson_email_release(array['/lessons/statistics/my-lesson']);

-- Never announce these.
select public.lesson_email_skip(array['/lessons/statistics/my-lesson']);
```

Trigger a run now (instead of waiting for the hour): Netlify → Functions →
`lesson-email-sweep` → **Run now**.

## Troubleshooting

| Symptom | Check |
|---|---|
| No email after a merge | Netlify function logs for `lesson-email-deploy` / `lesson-email-sweep` (`"scope":"lesson-email"`). `mode_off`? `config_incomplete` (alert lists what's missing)? `outside_send_window`? Then `select public.lesson_email_status();` |
| "Held N new lessons" alert | A catalog reshuffle or a big batch. Release or skip (above). |
| "FAILED: … reached nobody" | Resend dashboard → Emails/Logs. Fix, then `lesson_email_release(...)`. |
| "Run failed" alert | The message says why. Pending lessons stay pending; the hourly run retries. |
| Build fails at `lesson-email-feed` | A teaser is too short/long, contains a link or HTML, or still has the template placeholder. |
| Someone says unsubscribe didn't work | `select * from newsletter_private.unsubscribe_events order by created_at desc limit 20;` and their `profiles.newsletter_opt_in`. |

## Not covered (by design)

- Netlify Forms `signup`/`lead-magnet` addresses are not emailed: they were collected for the
  starter kit, not for lesson emails. Lesson emails go only to accounts with explicit opt-in.
- Updates to existing lessons are not announced.

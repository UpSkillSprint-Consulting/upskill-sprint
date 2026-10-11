# Exam access QA — 2026-10-11

Status: **partial hosted QA; not cleared for production**. PR #288 remains draft.

## Live learner follow-up and confirmation repair

The browser service is responsive in the resumed session. Secure sign-in succeeded
for the designated non-admin dummy learner; the rendered account role was Registered
member and My exams contained zero grants. A CSSBB access request was submitted and
rendered as Request pending; practice stayed locked. After account switching, a
verified Administrator found that same pending request by exact learner email.
No other learner records were inspected.

The existing native `window.confirm` step did not produce a saved decision in this
browser session, including after a manual handoff. A fresh hosted account read still
showed Locked / Request pending. This is evidence of an incomplete approval, not a
successful grant or a database failure. Browser dialog inspection was restricted after
secure credential delivery.

Replaced that native prompt with an accessible on-page modal that displays the full
learner/certification/expiry and requires a separate explicit confirmation. Cancel and
Escape perform no write. Pending decisions retain the reviewed revisions and expiry,
are invalidated by account changes, reject an expiry elapsed during review, and can
be submitted only once. The original RPC authorization and revision checks remain.
The dialog uses existing theme styles and adds no database storage or dependencies.
All 28 focused administrator UI/transaction tests pass. The site build passes, and
the mandatory public-content scan reports zero known findings across 623 files.
Chromium/WebKit audit coverage now exercises the explicit modal and Escape cancellation.

At this checkpoint, the request is still pending. Temporary approval, learner practice
and revocation must be verified on the rebuilt preview before this journey is marked
complete. Personal identifiers and screenshots are intentionally excluded from this
public repository report.

## Follow-up after the second dummy-account request

- Browser service calls and session recovery timed out before a sign-in page could
  be inspected. No second-account sign-in or credential entry was possible; the
  existing administrator account was not reclassified or stripped of its role.
- Removed the delivery configuration dependency on Netlify dashboard access. The
  function bundles the existing public `supabase-config.js` used by browser sign-in.
  Complete Functions-scoped overrides remain supported; partial/invalid overrides
  fail closed. No privileged credentials or permission shortcuts are introduced.
- The rebuilt preview returns 401 for anonymous and invalid-JWT checks and 404 for
  coming-soon exams, with browser `no-store`. The invalid-JWT response now comes from
  Supabase validation, confirming configuration is no longer failing before the RPC.
- Run 38162528580 passed WebKit. Chromium found six dark-theme button contrast
  failures during a background fade. Directory button text/background now switch
  together; hover movement and shadows remain. The contrast assertions are unchanged.
- Run 38163643184 passed Chromium in full. WebKit passed directory journeys and all
  contrast/layout checks but timed out waiting for an obsolete lesson document's load
  event during immediate redirection. The audit now waits for navigation commitment,
  then retains its exact destination URL and rendered-content assertions.
- Delivery and browser authentication regression tests pass. An additional legacy
  `second-pass-workflows` suite cannot run because it references the already removed
  `test-bank-account-sync.js`; the current stateless/access suites cover this change.

The results below describe the earlier hosted QA. The configuration blocker is now
addressed in code and must be verified on the rebuilt preview. Real non-admin learner
journeys remain blocked by browser availability; automated fixtures do not satisfy them.

## Fixes made

- Installed the three reviewed additive migrations in hosted Supabase. The initial
  signed-in preview could not load access because its RPCs were absent. The directory
  and administrator controls now load successfully. No existing memberships, learner
  grants or request records were changed.
- Admin RPC calls now abort after 12 seconds. An uncertain write clears the stale
  editing state and releases the controls so the administrator can look up the account
  again before retrying. Account changes abort outstanding calls; late results are ignored.
- Added regression tests for uncertain-write recovery and sign-out during a lookup.

The migration service assigned these hosted versions. **Do not replay the local
filenames as new migrations merely because their timestamps differ.** Reconcile the
migration history before any future CLI push; never run an indiscriminate push/reset.

| Repository migration | Hosted version/name |
| --- | --- |
| `20261011110618_exam_access_foundation.sql` | `20261011175227` / `exam_access_foundation` |
| `20261011170659_exam_access_admin.sql` | `20261011175232` / `exam_access_admin` |
| `20261011173139_exam_access_directory.sql` | `20261011175233` / `exam_access_directory` |

## Evidence and limits

| Check | Evidence |
| --- | --- |
| Real sign-in on deploy preview | Successful through secure browser authentication. The supplied account has Administrator membership; it is not a zero-grant learner test. No credentials or tokens were extracted. |
| Directory | All seven published certifications appear under My exams for the administrator. PMP search returns one matching card. Coming-soon certification stays unavailable. |
| Admin entry | Ready state and controls rendered using the hosted RPC. |
| Request queue | Empty state rendered correctly; no test request records added. |
| Exact-email search | Nonexistent address returns a helpful not-found result. The signed-in administrator's account returns inherited access. |
| Administrator inheritance | PMP grant, expiry and revoke controls are disabled. Membership changes remain outside the exam-grant UI. |
| Protected delivery | PMP Start practicing reaches the protected shell, but delivery reports unavailable. The missing Netlify runtime configuration remains a release prerequisite; its exact runtime state could not be inspected. No question content was released. |
| Local regression checks | 109 tests passed: permissions/RLS, grant and request transactions, directory, admin UI, protected endpoint, account changes and stateless scoring. Tests use PGlite/JSDOM, not hosted learner JWTs. |
| Build | Full build passes; public-content preflight reports zero known findings across 623 files. Browser audit Python syntax and git diff checks pass. |
| Browser regression baseline | Chromium and WebKit passed run 38160556842 on commit 5d2899e44e980a1ac5d06160ea0734456117d0dc. The admin fixture was updated for AbortSignal in this follow-up. |
| Hosted storage | Eight catalog rows, zero grant rows, zero request rows; total relation size for the four new tables was 106,496 bytes (104 KiB) immediately after installation. This is not a measurement of whole-project RAM or future usage. |

## Advisors

Security advisor reports the private event table has RLS without a policy. This is
intentional deny-by-default: clients have no table privileges; only guarded private
functions write/read its history. Do not add a permissive policy to silence it.
The existing Auth leaked-password-protection warning is unrelated to this change.
See [RLS advisor guidance](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)
and [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Performance advisor notes five unindexed foreign keys (exam key and administrator
actor columns). Current learner lookups use the composite primary keys; request
queues and history have purpose-specific indexes. No catalog/admin deletions were
performed, and no speculative indexes were added to empty tables. Reassess with actual
volume and query plans. Newly created unused indexes are retained for their intended
queue/history access paths. See [foreign-key advisor guidance](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys).

## Remaining hosted acceptance work

1. Configure the matching Supabase URL and publishable/anon key in Netlify **Functions**
   scope for the preview, then rebuild the preview. Variables in netlify.toml do not
   supply Functions runtime values. No service-role key is needed. Site environment
   editing is unavailable through the connected Netlify tools. Netlify browser sign-in
   was attempted; both the post-sign-in observation and a fresh verification tab timed
   out, leaving its authentication state unknown. No environment settings were changed.
2. Use a designated non-administrator dummy account to exercise zero/one/multiple
   grants, request/cancel, approval/decline, renewal, expiry, revocation and cross-account
   isolation. Do not revoke Administrator membership merely to manufacture a learner.
3. Exercise every released bank's protected simulator modes, scoring/reveal/results,
   tab-return checks, direct URLs and CDN responses with real learner JWTs. Mocked
   browser coverage is not a substitute for these remaining hosted checks.
4. Resolve public GitHub question sources/history and old immutable deployment exposure;
   review member-to-exam allocations before production activation.

No production website deployment, user permission changes, notifications, credential
changes or paid resources were created during this QA. The hosted additive schema
installation above is the only persistent database change.

# Exam access — Step 1

Status: foundation prepared and tested locally. Not applied to the hosted database.
Step 2 now replaces the simulator's shared gate with per-exam protected delivery in
this draft branch. See `exam-access-step2-delivery.md`; production remains unchanged.

## Current architecture reviewed

Reviewed against main at `bd44c26679c7a3e0389acd570f8280d2925cb7d1` on 2026-10-11.
Read-only inspection of the configured Supabase project's schema confirmed the
existing access functions match the repository and there are no exam-specific
permission tables.

| Area | Finding | Implementation consequence |
| --- | --- | --- |
| Membership | `supabase/access-levels.sql` provides Public, Registered, Premium, Special and Administrator tiers. `current_access_level()` reads server-managed grants and checks expiry. | Reuse the trusted administrator check. Never read authorization from editable user metadata. |
| Current exam gate | `supabase/premium-simulator-access.sql` assigns Premium to the single `exam:/test-bank` resource. `access-control.js` checks that resource for the entire simulator. | Step 2 must replace the shared exam gate with a per-certification decision. Other tools and lessons keep their existing tier rules. |
| Exam directory | `exam-practice.html` lists nine published certifications, including CQA (published by `20261027210000_cqa_exam_catalog.sql`). | Seed the same eight stable keys. Preserve `cmq` and `mbb` route keys while displaying the full names. |
| Question delivery | `test-bank.html` contains inline banks and imports public `test-bank-*-set*.js` / `test-bank-pmp-bank2.js` assets. | Protect delivery in Step 2; a redirect or disabled button is not content protection. |
| Build | `scripts/stage-public-site.mjs` copies eligible root files and directories to `public-site`. | Exclude `supabase` now so SQL, CLI files and future permission fixtures never reach the CDN. Question assets are deliberately unchanged in Step 1. |
| Existing admin screen | `admin-access.html` manages membership through an owner-only RPC. | Step 3 needs a separate exam-permission operation. Exam administrators must not gain the owner's membership-management privileges. |
| Practice persistence | The stateless reset migration, `test-bank-memory-learning.js` and `netlify/edge-functions/test-bank-mobile-picker.js` remove cloud progress and persisted browser exam history. | Preserve the memory-only simulator. Access permissions persist; question-by-question activity does not. Do not promise cross-device attempt recovery. |

## Access rules

1. A learner needs an active, unexpired grant for the exact published certification.
2. A Premium or Special tier alone does not grant access. After cutover, an explicit
   exam grant is sufficient even for a Registered member; upgrading unrelated account
   privileges is not required. This replaces the Premium exam gate, not other tier rules.
3. A current Administrator can access published exams for administration and testing.
   An expired administrator grant does not provide this exception.
4. Certification grants cover all released sets and practice modes within that exam,
   including future sets. They do not transfer to a new certification.
5. Unknown, coming-soon and retired certifications never authorize practice. New
   catalog entries default to coming soon; publishing one does not grant learners access.
6. Expiry is evaluated on each server read (`expires_at > now()`). No expiry job is needed.
7. A request, including an `approved` request record, is not itself a grant. Step 3 must
   approve a request and write its permission atomically.
8. No authorization function accepts an arbitrary user ID. Decisions use `auth.uid()`.
9. All write privileges are withheld from browser roles, including administrators.
   Step 3 will provide validated operations with optimistic revision checks.

## Small database footprint

| Relation | Contents | Growth |
| --- | --- | --- |
| `public.exam_catalog` | Stable key, title, badge, publication status, sort order | One row per certification; eight initially |
| `public.user_exam_grants` | User/exam pair, grant state, grant/revoke attribution, expiry, revision | At most one row per user/exam pair |
| `public.exam_access_requests` | Current request status, request/review times, reviewer, revision | At most one row per user/exam pair, including renewals |
| `exam_access_private.events` | User/exam identifiers, actor, time, old/new status and expiry | One narrow row per actual permission change |

No question text, explanations, answer events, practice sessions, analytics, account
emails, copied row snapshots or tokens are stored in these tables. No learner rows
are pre-created for every catalog entry. Ten repeated authorization reads create zero
rows. No-op updates do not append audit events.

Use a 90-day operational retention window for permission audit events. Retention is
an operational policy, not a claim that this migration schedules cleanup: no scheduled
jobs, Realtime publications, polling loops or background functions are installed.
Before enabling admin writes in Step 3, implement bounded maintenance of expired
audit rows or document a manual cleanup cadence; export older events first if needed.
Do not retain an unlimited audit log by accident.

Question delivery in Step 2 should use private server-side files or an existing
private asset store, not migrate the question banks into the free Supabase database.
Read the small directory status result when opening the page and after an access
change; do not poll. Use server checks for protected content, with no long-lived
permission cache that hides revocation. Already downloaded content cannot be recalled.

## Contract for the next steps

`can_access_exam(requested_exam_key text) -> boolean`

- Authenticated, caller-scoped, SECURITY INVOKER; returns false for unknown keys.
- One decision shared by Step 2's protected content endpoints and route handling.
- Never substitute a client's cached value, membership label or URL parameter.
- Missing session, RPC failure or timeout must fail closed in callers.

`get_my_exam_access() -> rows`

Returns `exam_key`, `display_name`, `badge`, `publication_status`, `access_status`,
`can_practice`, `expires_at`, `grant_revision` in catalog order. It returns only the
caller's grants and request state, even when the caller is an administrator.
Anonymous visitors can read safe catalog metadata but cannot call personal RPCs.

Status precedence: publication status → missing identity → administrator → active
grant → pending request → revoked → expired → declined → locked. `can_practice`
always comes from the authoritative decision, not the display label. A pending
renewal does not restore an expired permission. A revoked permission with a new
request stays denied while displaying pending review.

Raw grants and requests are readable by their owner and current administrators.
The audit table and trigger functions have no direct client access. The audit trigger
uses a private SECURITY DEFINER only to append events; it rejects user-context writes
unless the current account is an administrator. Trusted database maintenance is
labelled `database` instead of inventing an administrator actor.

## Transition and deployment sequence

1. Prepare an owner-reviewed mapping of existing commitments: verified user ID,
   exam key, expiry (if applicable), and evidence of purchase/approval. Keep personal
   account data out of Git. Membership tier and prior practice are not proof of a
   particular certification purchase. Do not copy every Premium account to every exam.
2. Resolve existing member commitments before enforcement. Record expired memberships
   and intended exceptions explicitly; do not silently renew or remove paid rights.
3. Review and apply only `20261011110618_exam_access_foundation.sql`. It depends on
   `access-levels.sql`, which is already present in the inspected hosted database.
   Do not use a blind database reset/push: this repository also contains the earlier
   destructive stateless-reset migration, and older setup SQL is not one complete
   fresh-install migration chain.
4. Run hosted security/performance advisors, verify RLS/grants, and smoke-test the two
   new RPCs with designated test users. Local PGlite tests do not exercise PostgREST,
   JWT verification, hosted service configuration, or Netlify/CDN behaviour.
5. Seed only the reviewed user/exam mappings through the audited administrative path.
   Grant creation does not change existing exam access before enforcement is integrated.
6. Complete protected question delivery (Step 2), admin operations (Step 3), and learner
   UI (Step 4). Coordinate cutover rather than enabling a half-complete lock screen.
7. Step 5 verifies direct-link/API protection, all exam/set modes, expiry and revocation,
   account switching, mobile/light/dark layouts, and permissions on another device.
   Keep practice history out of scope; the simulator is intentionally stateless.

The foundation migration is additive and grants no learner access. To stop a rollout,
leave the new interfaces unused rather than deleting grants or audit history. Once
protected delivery is live, rollback must never restore public question-bank delivery.

## Validation

Run `npm ci` then `node --test tests/exam-access-foundation.test.js`.
The pinned PGlite development dependency executes real PostgreSQL constraints,
functions, triggers, privileges and RLS locally with synthetic identities. It is not
loaded by the website or hosted in Supabase. The existing stateless simulator and
membership tests must also pass. CI runs the focused access tests on relevant changes.

References reviewed: Supabase RLS and API security documentation; the 2026-09-25
PostgreSQL minor-upgrade changelog (the new schema uses none of its affected ltree,
legacy PGP encryption, float btree_gist, or custom operator features); PGlite's official
getting-started documentation. No production mutations were required for Step 1.

# Step 3 — individual exam administration

Implemented in draft PR #288. No hosted migration or member permissions were changed.

## Admin workflow

Open `/admin-exam-access.html` from the profile page or the owner membership screen.
Only a current Administrator with a confirmed, non-banned account can use the RPCs.
The owner-only membership screen remains separate; this feature cannot assign roles.

1. Search for a learner by complete email, or load the pending request queue.
2. Select a certification. Cards distinguish granted, locked, expired, revoked,
   coming-soon and retired access, with pending requests shown independently.
3. Set an optional future expiry in the administrator's local timezone. Confirm the
   learner, certification and expiry before granting, approving, declining or revoking.
4. Review recent decisions, including actor IDs. Reload the account after a conflict
   or network error; a lost response may follow a successful commit.

A direct grant also approves a pending request in the same transaction. Declining a
request does not revoke a grant. Revoking does not silently decline an open request.
Existing Administrators inherit published exams; changing that requires the owner's
membership screen. New grants require a confirmed, non-banned learner and a published
exam. Revocation and decline remain available for inactive learner accounts/retired exams.

Every mutation carries the observed grant and request revisions; zero means absent.
Locks on the target account serialize initial inserts and later decisions, shared with
learner requests. Mismatches return SQLSTATE `40001`, with no partial update. Approval
and its audit records roll back together if any part fails. No-op grants/revocations
do not create another grant revision or audit entry.

## APIs and privilege boundary

`admin_manage_exam_access` supports `status`, `search`, `account`, `requests`, `grant`,
`revoke`, `approve`, `decline`, and `prune`. Search returns one exact email match;
ambiguous matches fail. It does not fetch the member directory. Request pages have
25 rows plus a keyset cursor (`after_time`, `after_user`, `after_exam`), backed by a
partial pending-request index. Refresh starts at the oldest pending request again.

Public facades run as invoker. The privileged implementations are in the unexposed
`exam_access_private` schema with an empty search path and explicit execute grants.
They check the JWT caller's database membership and account status on every call,
including calls directly to the implementation. Browser roles still have no table
DML privileges; no secret key or editable user metadata authorizes an operation.
Do not add the private schema to PostgREST's exposed schemas.

`request_exam_access(requested_exam_key, operation, expected_revision)` is ready for
Step 4. Operations are `request` and `cancel`; identity comes only from `auth.uid()`.
Read the caller's own `exam_access_requests` row to obtain its current revision
(zero if absent). One current row is reused, pending repeats are no-ops, and reopening
a closed request requires 24 hours since the previous submission. Requests alone
never grant access. Step 4 still needs the learner-facing request controls.

## Free-plan footprint and history

- No new tables, dependencies, question uploads, session history, polling, Realtime,
  notifications or background jobs. Account search, queue loading, refresh and writes
  happen only on user action; session checks run on sign-in/account changes/BFCache return.
- One current grant/request per learner and certification. Reads fetch catalog metadata
  and revisions, not question banks. Only one request page remains in browser memory.
- Grant changes and administrator request decisions share compact private audit rows.
  Learner clicks add no audit entries. No emails, free-text notes or full snapshots
  enter the audit log. The current request keeps its latest reviewer separately.
- The audit trigger keeps at most **20 decisions per learner/exam**, including trusted
  maintenance writes. Account history shows at most 20 decisions from the last 90 days.
  Each audit insert also deletes up to 200 older rows via an indexed retention query.
- There is no strict wall-clock deletion promise during inactivity. The **Clean old
  history** button deletes up to 200 expired audit rows per click, preserving permissions.
  For operational cleanup, run it during weekly admin review until fewer than 200 rows
  are removed. If no decisions occur, history cannot grow; the per-pair cap still holds.

## Installation and verification

Apply only the reviewed additive migrations, in order:

1. `20261011110618_exam_access_foundation.sql`
2. `20261011170659_exam_access_admin.sql` (generated with Supabase CLI 2.120.0)

Do not replay the older destructive reset migration or blindly push the migration
directory. This migration installs operations but grants no member access itself.
Run hosted security/performance advisors after installation, confirm private schema
exposure and actual Auth email search/query plans, and test with real isolated accounts
on the preview before activating production. No hosted advisors can assess an unapplied schema.

Local verification: 93 focused tests pass, including 14 PGlite/PostgreSQL admin cases
and nine JSDOM admin cases. Tests cover authorization, forged metadata, stale revisions,
expiry, revocation, request transitions, atomic approval rollback, keyset pagination,
retention, account races, confirmations, HTML injection and membership isolation.
The full site build passes the mandatory public-question scan. Browser CI adds the
actual admin page/controller with isolated RPC fixtures in Chromium and WebKit, at
desktop/mobile widths in light/dark themes; it does not claim real-account verification.

Source references checked on 2026-10-11:
[Database functions](https://supabase.com/docs/guides/database/functions),
[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), and
[Supabase changelog](https://supabase.com/changelog).

Step 4, hosted schema/configuration, reviewed learner allocations, and the previously
documented public GitHub/old-deployment question exposure remain release prerequisites.

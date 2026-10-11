# Step 4 — learner exam directory

Implemented in draft PR #288; hosted migrations and production activation remain pending.

## Learner experience

`/exam-practice` stays publicly browsable. The full certification names are retained,
including Certified Six Sigma Master Black Belt. The first section is **My exams**,
containing only currently assigned, published certifications. Start links go to the
existing protected simulator for the exact certification.

**Explore certifications** contains the remaining published exams. Every denied card
has a lock icon and a text status; color alone never communicates permission. Cards
distinguish locked, pending, expired, revoked and declined states. Learners can request
new/renewed access and cancel a pending request. A pending request never opens an exam.
Coming-soon exams have no practice or request action. Retired exams are omitted from
the personal result. Expiry is shown in the learner's local time.

Signed-out visitors see safe catalog metadata and sign-in links returning to the
directory. They receive no start links and make no directory database calls. The
static/no-JavaScript fallback is also locked. Missing services, timeouts, malformed
data or a missing migration remove start links and offer a refresh action.

Certification search runs entirely in the browser, matching names and abbreviations.
The layout uses three/two/one columns and shared site navigation/theme controls.
Empty states explain how to get access; help links lead to Contact. No exam progress,
readiness, question counts, payment eligibility or attempt recovery is invented.

## Database and request contract

The additive migration `20261011173139_exam_access_directory.sql` adds only
`get_my_exam_directory()`. It is a SECURITY INVOKER read facade over the existing
caller-scoped permission function and the caller's current request row. It returns
safe metadata, permission status, expiry and request status/revision/timestamp, in
catalog order. No tables, indexes, question data or dependencies are added. The Step 1
`get_my_exam_access()` API remains unchanged.

One small read runs on sign-in/page initialization, explicit refresh, return to the
tab or a session change. Simultaneous refresh events share an in-flight read. An
explicit request/cancellation performs one Step 3 RPC write followed by one fresh
directory read. Search does not query the database. There is no polling, Realtime,
permission storage in the browser, practice persistence or notification service.

Mutations pass only exam key, operation and observed request revision. User identity
comes from the authenticated RPC caller. Duplicate clicks are disabled; stale revisions
or an uncertain write result trigger a fresh read before retry. The server enforces
the 24-hour re-request cooldown; the card also displays the next request time.

In-flight calls use AbortSignal and a 12-second timeout. Sign-out/account changes abort
old requests, discard personal cards and ignore late responses. Returning from browser
back/forward cache also invalidates and refreshes the state. No client display state
replaces Step 2's protected delivery check; stale or forged links cannot release banks.

## Verification and rollout

Local focused tests: 107 pass, including 13 directory controller cases and a PostgreSQL
test proving the combined read cannot reveal another user's request state, including
when the caller is an administrator. Existing navigation, membership, stateless scoring,
protected delivery and admin checks remain in scope. CI runs the full build and rejects
public question-bank exposure.

Browser coverage uses the real page/controller with isolated RPC fixtures. It exercises
request/cancel, cooldown, approval, revocation, unavailable/recovery and sign-out at
desktop/mobile widths in light/dark themes. The existing Chromium/WebKit learner audit
also verifies full names, navigation, keyboard focus, contrast, breakpoint layouts and
all granted certification links into the protected simulator. These are not hosted
real-account tests.

Apply only the reviewed additive migrations in this order:

1. `20261011110618_exam_access_foundation.sql`
2. `20261011170659_exam_access_admin.sql`
3. `20261011173139_exam_access_directory.sql`

Do not replay the older destructive reset migration. Run hosted advisors after applying
the reviewed schema; verify the directory/request APIs with designated real accounts.
Steps 1–4 now have draft implementations. Release still requires the reviewed member
allocation, hosted configuration, final Step 5 account/CDN journeys and resolution of
the documented public-source/old-deployment question exposure. No production grants,
migrations, notifications or deployment were performed for this implementation.

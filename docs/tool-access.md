# Individual engineering-tool access

Draft PR #288 adds a separate grant for each of the three tools shown in the
engineering directory: Material Specification Compliance Checker, Material
Specification Lookup, and Steel Phase & Transformation Explorer.

The directory shows a lock, request/pending/cancel state, grant expiry, revocation
and renewal cooldown. An administrator opens **Profile → Tool access administration**,
finds the exact account email, and grants, approves, declines, expires or revokes one
tool. The shared administrator controller retains its explicit review dialog,
Cancel/Escape, optimistic revisions, timeouts and stale-account protections. Existing
administrators inherit access. Membership and exam grants are independent.

## Enforcement and storage

- Three catalog rows, one current grant and request per account/tool, and a private
  decision history capped at 20 records per pair. Old history is pruned in batches of
  200 after 90 days on writes or explicit maintenance; no background polling or job.
- RLS and narrow RPCs enforce caller identity. Tool delivery also checks that the
  current account is confirmed and not banned; client metadata cannot grant access.
- The three public routes contain loading shells. The allowlisted Netlify endpoint
  validates the caller through Supabase before delivering that tool's compressed
  package. Runtime assets and the lookup dataset are excluded from public staging.
  Responses disable browser/CDN caching. The build rejects oversized packages/leaks.
- Account changes discard the entire tool frame. Returning to a tab rechecks access
  before revealing it. Material Checker account-workspace reads/writes use the same
  per-tool permission through the existing resource RPC.
- Tool-local saved work is scoped by account and tool. Legacy unscoped browser data
  is not automatically imported into a different account. No workspace content,
  questions, telemetry, authentication tokens or practice sessions enter Supabase.
- Already-delivered material cannot be recalled. Public repository sources/history
  and prior immutable deployments remain separate exposure/release prerequisites.

## Migration and verification

Local migration `20261011200555_tool_access.sql` was applied once as hosted version
`20261011201855` (`tool_access`). **Do not replay it under the local timestamp.**
Installation verified three catalog rows, zero grants/requests and denied anonymous
access. Existing membership and exam records were not changed.

51 focused permission, delivery, directory and administrator tests pass, including
real local PostgreSQL/PGlite transactions, all three packages, revocation, expiry,
account isolation and stale responses. Another 83 exam/membership regression tests
pass. The full site build passes: 576 public files have zero known exam-content
findings, all three tool shells pass inspection, and private runtime files are absent.
Compressed responses are approximately 204 KB, 621 KB and 419 KB respectively.

Security advisor reports the intentional deny-by-default private history tables
([RLS guidance](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy))
and the pre-existing unrelated
[leaked-password-protection warning](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
No permissive history policy or authentication setting was added.

Chromium/WebKit CI exercises the real protected packages with isolated account
fixtures, responsive directory states and the administrator review flow. Hosted
learner request/approval/use/revocation remains a separate acceptance check; this
implementation does not claim that a fixture is a real-account journey. Keep draft.

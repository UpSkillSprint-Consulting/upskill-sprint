# Segment 03 — cumulative verification framework

Status: implemented for review on PR #172; exact final-head job results belong in the PR verification record. This is framework delivery, not a claim that the student-facing defects identified in Segment 01 have been repaired. Ernest explicitly requested that Segment 03 be added to the existing PR. Segments 01/02 remain unmerged at entry; this instruction authorizes stacking, not automatic merge, deployment, or Segment 04.

Entry head: `7cbfe69e812b4885ee9bc44b1cf9e0bc52ea8196`. Application/main baseline: `990e385350ae63d76cfc1e3940c3644859cc636a`. The earlier reports, defect register, original baseline tests, contract model, normative v1 documents and worked examples are retained without edits. The unrelated SPEC_DATA steel-grade schema is outside this work.

## What is now executable

| Layer | Entry point | What it establishes |
|---|---|---|
| All repository regression | `node scripts/exam-reliability/run-node.cjs` | Discovers every `tests/*.test.js`; runs files in isolated Node processes with concurrency 2, bounded timeout and complete log. No existing test command is replaced. |
| New runtime fixtures | `tests/test-bank-segment03-runtime.test.js` | Actual registry/learning-event/account-sync source with synthetic evidence, controlled wall/monotonic clocks and fault-injected remote transport. |
| Test sensitivity | `node scripts/exam-reliability/run-mutations.cjs` | Unmodified control must pass. A deliberately wrong answer count and deliberately discarded remote merge must fail at the named independent assertion. Only in-memory source copies are mutated. |
| Database authorization | `node scripts/exam-reliability/run-database.cjs` | Real PostgreSQL 17 applies the repository progress DDL and migrations; exercises actual non-superuser/non-bypass `anon`/`authenticated` roles and two distinct owner subjects. |
| Browser integration | `node scripts/exam-reliability/run-browser.cjs` | The shipped page and its normal enhancement scripts in Chromium, Firefox, and WebKit phone/tablet layouts, using native browser storage and IndexedDB. Authentication and remote transport are synthetic. |
| Evidence gate | `node scripts/exam-reliability/check-gate.cjs` | Requires every named lane, exact tested revision, positive executed counts, zero failures/skips and isolated-environment classification. Missing, stale or failed evidence cannot become a passing aggregate. |

The `Exam reliability framework` workflow runs on **every PR**, not only paths chosen by a contributor. It requires node, mutation, database and all four browser lanes. The final `Segment 03 cumulative gate` also checks GitHub job conclusions, so a setup timeout or missing artifact is not counted as a successful application test. Existing Full test suite, baseline, and contract workflows remain intact.

This installs an executable CI gate. Whether GitHub administratively requires this status before merge is a separate repository-rules setting; this segment does not change administrative permissions or claim that setting was installed. A reviewer must not merge a red/missing gate.

## Independent expectations and deliberate faults

Expected values are literal facts of the synthetic scenario, not values returned by the function under test. Three assigned items, one correct answer, one incorrect answer and one blank imply exactly two answered interactions, one completion and three delivered identities. Repeating completion cannot increase those counts. Five certification namespaces execute this preservation test.

The counting mutation changes the actual ledger summary to add one answer. The sync mutation discards fetched rows before the actual remote merge. The checker requires the appropriate assertion failure (`COUNT_SENTINEL` / `SYNC_SENTINEL`), not merely any nonzero process exit. An infrastructure failure, syntax error, or timeout cannot count as a killed mutation. No mutation is written into production source.

Additional runtime scenarios exercise: failed upload before commit; lost acknowledgement after commit; pending outbox across offline restart; reconnect; reverse delivery order; storage quota denial and retry; account switching without reassignment of the original owner's pending evidence; 1,001 remote events across three 500-row pages; an older occurrence arriving after the last receive cursor; and merging a legacy aggregate/history snapshot with a newer detailed snapshot without double counting.

These fixtures preserve the existing deployed event semantics. They do not prematurely change selection/finalization semantics to the Segment 02 target contract. The earlier contract tests remain the desired policy oracle for the appropriate later adoption segments. A passing existing-behavior test is not closure of G01–G14.

## Database isolation and meaning of the results

The runner requires explicit disposable-test authorization, a loopback host, database name exactly `segment03_test`, no URL query overrides, PostgreSQL 17, and an initially absent auth schema. Other hosts/names are rejected before any SQL. CI creates and destroys its own PostgreSQL 17.6 service. The fixture models only the `auth.users` identity table and `auth.uid()` claim input; application tables, functions, grants and policies come from the repository DDL/migrations, not hand-rewritten permissive copies.

Checks include own/other-owner rows, missing subject, anonymous denial, append-only grants, duplicate insert idempotency, invalid type/scalar/oversized payloads, progress owner changes and server-authored timestamps, private claims-table access, reservation input validation, previously delivered IDs, all-or-nothing exact reservation rollback, and two simultaneous SQL sessions competing for the same candidates. A deliberately permissive SELECT-policy mutation is introduced inside a transaction, must fail the owner-count sentinel, then is rolled back and the clean policy rechecked.

Admin access is used for test database setup and inspection, not to masquerade as a learner. Role assertions run after `SET LOCAL ROLE authenticated` and verify the current role has neither superuser nor BYPASSRLS. **This is not JWT verification, PostgREST/Data API acceptance, or verification that the live Supabase project has identical migrations.** R09/R12 and the relevant Segment 18/19 acceptance remain open. No connected Supabase project is modified.

## Browser coverage and limits

Four mandatory profiles use pinned Playwright 1.57.0: Chromium desktop, Firefox desktop, WebKit at 390×844 with touch, and WebKit at 820×1180 with touch. Exact engine versions are recorded. Each profile loads all five certifications, completes a ten-question quick quiz with one correct/nine blank, verifies the score and ledger, reloads and verifies history, and starts a full timed examination. Controlled browser time is installed **before page navigation and application timers**, so the deadline test advances the same clock the application actually uses.

Two additional independent contexts on the same synthetic account test accepted history, offline outbox/reconnect convergence, native IndexedDB event mirroring and absence of page navigation during explicit sync. The page scripts are not replaced with the specification model. Only authentication and the remote service are fixtures. Requests outside the loopback site are blocked; this includes external fonts. Light/dark result and timed-page screenshots plus Playwright traces are retained.

WebKit phone/tablet layouts are **not physical iPhone/iPad tests**. A history-sync test is not active-session takeover. The browser suite is smoke/integration coverage, not exhaustive visual, content, WCAG, real WAN or JWT authorization sign-off. Focused, diagnostic, weak-area practice, adaptive, and review retain the existing Node/integration regressions; all-mode/device acceptance is explicitly carried into the later stages, not falsely reported as covered by quick/full browser smoke alone.

## Frozen profiles and performance acceptance

`verification/v1/profiles.json` defines tool versions, layouts, physical-device requirements, Wi-Fi/mobile/offline profiles, workloads (1,001 smoke; 10,000 normal; 100,000 stress events; 1,000 pending operations/sessions), latency budgets, zero-loss/duplicate/unauthorized-row invariants and evidence retention. These are engineering acceptance choices frozen for review, **not measured current production guarantees**.

Segment 03 enforces a 15-second maximum loopback page-ready smoke budget. Later qualification requires the named p95 budgets, minimum 30 samples, and configured real/emulated network profile; timer drift uses a maximum and 10 samples. The evaluator uses nearest rank `ceil(.95*n)`, rejects insufficient/nonfinite samples, and explicitly returns `not_due` before a later-stage budget becomes enforceable. It cannot label missing performance samples as passed. Performance targets must not be raised to disguise a failed implementation; a revision needs an impact decision and renewed review.

Thirty-day CI artifacts include exact tested commit, commands, tool versions, test counts, failures, limitations, database/Node logs, screenshots and browser traces. Browser fixtures contain only synthetic users and public question content, never production learner records or tokens. The test-only browser driver is installed outside the application's dependency tree, and its resolved lock file is retained. Production package/lock/CDN pins remain unchanged. Existing dependency risks remain open; no security points are awarded here.

## Cumulative adoption rules for Segments 04–20

Every later segment must retain this full workflow and the Segment 01/02 gates, add desired-behavior regressions for its closed register entries, and supply its own evidence. New defects are not repaired by disabling a test. Adding browser/DB functionality extends the corresponding lane; it does not replace it with a stub. A contract/profile change needs version review; an intentional source refactor that changes a test-only seam requires updating and revalidating the seam, not declaring the product immune to that test.

| Next segment group | Required additions while retaining the global gate |
|---|---|
| 04–05 | All inventory imports, stable revisions/manifests, set-specific history and backward-compatible migrations. |
| 06–08 | Capture/receipt failures, server finalization races and conflict payloads, deterministic legacy and reset-epoch replay. |
| 09–11 | Runtime conformance to independent metric examples, actual full-score boundaries, timezone matrix, paginated history/export. |
| 12–13 | State-machine restoration and actual active-time/timer ownership under navigation, hide/reload, pause and expiry. |
| 14–16 | Cursor races, deferred/dropped/out-of-order network responses, actual handoff ownership and New-only exhaustion/concurrency. |
| 17–18 | Manual/automated accessibility and visual acceptance; actual authenticated/anonymous Data API, deletion/reset and dependency closure. |
| 19–20 | Frozen WAN/workload budgets, physical-device evidence, migration/recovery and exact production rollout/observation. Missing evidence blocks release. |

## Local and CI reproduction

Use the existing Node 22 environment and locked application dependencies:

```sh
npm ci
node --test --test-concurrency=1 tests/test-bank-segment03-*.test.js
node scripts/exam-reliability/run-mutations.cjs
node scripts/exam-reliability/run-node.cjs
```

The workflow provisions the disposable database and test-only browser tools. No real account secrets are required. Run the database script only against the disposable fixture database specified in its guard. To run a browser locally, install the exact Playwright version into a separate directory, set `SEG03_PLAYWRIGHT_PATH` to that package, and select one declared `SEG03_BROWSER_PROFILE`; see the workflow for exact commands.

GitHub's PR checkout can use a synthetic merge SHA rather than the branch head. Every lane must share that tested SHA; the PR verification record relates it to the head/tree. A local reconstructed checkout has a different local Git identity and is not represented as the GitHub-tested commit.

## Source and methodology references

Project requirements are from `UpSkillSprint_20_Segment_Remediation_Roadmap.md`, Segment 03, and the preserved Segment 02 contract. External documentation supports test mechanisms, not product acceptance claims:

- Node test isolation/timer facilities: https://nodejs.org/api/test.html
- Playwright context interception and service-worker boundary: https://playwright.dev/docs/api/class-browsercontext
- PostgreSQL role/policy behavior: https://www.postgresql.org/docs/17/ddl-rowsecurity.html
- Supabase database testing versus application-client testing: https://supabase.com/docs/guides/database/testing

No production application code, question identity/content, database schema, learner evidence or dependency pin is changed by this segment. Existing product defects are still open for their assigned repairs. The final PR report must distinguish framework verification, human approval, merge, deployment and physical/production acceptance.

# Segment 01 — baseline and gap reproduction

Date: 2026-09-07. PR: #172. Status: baseline/reproduction work prepared for human review; no product fixes or production writes. The exact-head CI checks and reviewer decision remain separate release gates.

## 1. Pinned environment and scope

Repository/application baseline: `990e385350ae63d76cfc1e3940c3644859cc636a`. The Netlify production deployment `6a9f21c2b2e1be0008e52475` reports that same revision, ready, published at `2026-09-07T20:43:30.632Z`. The initial branch was created from that revision. No competing open PR was returned before #172 was created.

The large `test-bank.html` initially could not be decoded by the connector. A temporary read-only-permission audit workflow produced a scoped offline inspection artifact from the checked-out revision. Its real HTML blob was verified as `16319f0ca155dbdc7895cb3cfe728e02e58a8990`; SHA-256 is `272e485ba5a2134a425712de50a2f7d63adce917f22e032063c35cc843165437`. Thus the core review is no longer based on an unread file. The temporary source/dependency packaging step was removed from the final workflow; no archive or dependency files are committed.

Code reviewed includes core selection/start/answer/submit/results/timer logic, registry, event ledger, device synchronization, adaptive projections/hardening, analytics, and all three per-question timing owners. Netlify's set-controls edge injection explains how the additional feedback/timing modules enter the student page. A complete physical-browser deployment/handoff test is NOT claimed.

Local Node: 22.16.0, npm 10.9.2. The initial isolated GitHub runner used Node 22.23.2/npm 10.9.8 on Ubuntu 24.04.4. Dependencies remain locked and unchanged. Full-suite command is the existing `npm test`; the isolated command is `node --test --test-concurrency=1 tests/test-bank-segment01-*.test.js`.

## 2. Complete question inventory

| Exam | Published questions | Set sizes | Generic exam length | Generic minutes | Site target |
|---|---:|---|---:|---:|---:|
| CSSBB | 1,024 | 165 / 165 / 694 | 165 | 270 | 70% |
| MBB | 450 | 100 / 175 / 175 | 100 | 150 | 70% |
| CSSGB | 616 | 110 / 506 | 110 | 258 | 70% |
| CQE | 933 | 160 / 160 / 613 | 160 | 300 | 70% |
| CMQ/OE | 166 | 166 | 150 | 270 | 70% |
| Total | 3,189 | All published sets loaded | | | |

All 3,189 IDs were explicit, globally unique, correctly exam-namespaced and mapped to configured domains; zero registry warnings or unmapped items. Existing identity-preservation tests are retained. These are code configuration values, not a claim that every value equals a current official ASQ specification. MBB explicitly overrides the generic length to 175 for Sets 2 and 3 and 100 for mixed; this matters for G11. Do not renumber IDs or shrink the bank to repair analytics.

## 3. Screenshot counter reconciliation — persisted evidence

A read-only aggregate found a device snapshot matching the supplied screenshot: 649 question-state keys, 698 stored attempts and 698 detailed mastery-history records. Of those records, 685 had `priorAttempts = 0`, and 13 had a positive prior-attempt count. Thirty question states contained more than one first-labelled record; their excess first labels total 36. No state lacked a first-labelled record. No question keys in that snapshot were outside the CSSBB namespace.

`test-bank-adaptive-mastery.js: improvement()` sums those historical `priorAttempts` labels. It does not recompute a single first answer across the combined canonical history. The synthetic G01 fixture reproduces two first-labelled records for one question becoming two first encounters and zero repeats.

For complete evidence under one first-ever/current-population scope, 698 interactions on 649 unique questions imply 49 repeat interactions, not 13. This establishes the display/classification inconsistency. It is NOT evidence of 36 deleted answers or duplicate bank IDs. The earliest writer/provenance of those historical labels still needs controlled replay in Segment 08; the aggregation did not establish which earlier device/client created each label. No user IDs, device IDs, answer payloads or raw learner history are published here.

## 4. Core grading and timing: important corrections to the earlier audit

| Code path at baseline | Verified behavior |
|---|---|
| `test-bank.html:3604 subAgg` | All scored items, including blanks, remain in the domain denominator. |
| `test-bank.html:4053 beginSession` | Requires learning storage; creates a RAM session and a deadline `endsAt`. |
| `test-bank.html:4336–4338` | Timer is deadline minus `Date.now()`, not a callback-decrement counter. A suspended-callback simulation catches up correctly. |
| `test-bank.html:4437` | Answer handling checks whether the deadline has expired. |
| `test-bank.html:4467 submitQuiz` | Requires a safely recorded completion; repeat submission is blocked within the core session; a failed save does not claim completed results. |
| `test-bank.html:4494 resultsHTML` | Exact current correct/total text is separate from readiness. The breakdown uses retained latest-domain proportions, causing G12's fractional count display. |
| `test-bank-analytics-dashboard.js:examAttemptSeries` | Margin is rounded percentage minus current target; length filtering uses generic current configuration. G05 and G11 concern this chart, not proof of a false core pass badge. |

A 60-second session advanced by 45 seconds displays 15 seconds remaining; advancing beyond expiry and submitting again produces one completion in the isolated ledger. Preserve this protection. Conversely, moving the client clock back 120 seconds produces 180 seconds remaining: clock authority still needs Segment 13.

Reloading the isolated core with its saved storage preserves an answer event but does not restore the active core session. Adaptive hardening has a separate local restore mechanism, and account payloads explicitly exclude its session key. These facts establish a core/local handoff limitation, not cloud evidence deletion. End-to-end deployed device takeover is assigned to Segments 12–15/19.

Per-question timing DOES exist outside the core file: `test-bank-deep-feedback.js`, `test-bank-phase2-hardening.js`, and `test-bank-phase2-runtime-coordinator.js`. They maintain separate maps; the latter two calculate averages over tracked values of at least one second, rather than all scored questions. Their visibility handlers call commit after `document.hidden` becomes true, while commit immediately returns when hidden. G14 seeds ten seconds of visible work and reproduces zero milliseconds committed in both owners. The next foreground event resets the start time. Deep-feedback has a separate tracking implementation, so display ownership, background inflation and persisted-versus-rendered timing need integrated follow-through in Segment 13. Do not describe time-per-question as absent or simply divide total exam time by question count.

## 5. Reproduction results

The new isolated run completed **19 checks, 19 passed, zero failures/skips/TODOs** locally. Four main checks preserve sound behavior, fourteen G-numbered probes observe existing behavior, and one captures core source fingerprints. G13 is a negative result: the selected New York DST fixture did not produce duplicate UTC date keys. It remains a broader calendar verification task, not a confirmed duplicate-day bug.

Passing the harness means it executed successfully; it does NOT mean the observed defects are repaired. G01–G12 and G14 print the actual behavior and named downstream repair gates. The attached CI log contains machine-readable `SEG01_` records. Every later fix needs a desired-behavior assertion and must retain the preceding preservation tests.

Additional existing regression files were run serially: identities, quiz timing, analytics dashboard, account sync, learning events and ledger reconciliation. The first local run recorded 84 successful tests and one file-load failure: the scoped offline checkout lacked `netlify/edge-functions/test-bank-set-controls.js`. This was an inspection-environment failure, not an application defect. The exact missing source was retrieved and its blob hash checked (`4d4dc7590eea4cc6959a9654599d5db90d40d701`); analytics was rerun separately. Exact-head full-checkout CI is the cumulative gate. Check the PR's final run rather than reusing an earlier/cancelled run as evidence.

## 6. Database and dependency baseline

Supabase reports ACTIVE_HEALTHY and PostgreSQL 17.6. The schema snapshot was read at `2026-09-07T21:55:48.036436Z`. All three test-bank tables have RLS enabled. Authenticated privileges are SELECT/INSERT for learning events and SELECT/INSERT/UPDATE for device progress; policies compare the row owner with `auth.uid()`. Claims have no direct authenticated table grant/policy; the reservation RPC is the intended path. Privileged metadata access is not an adversarial client-role authorization test.

The event primary key is `(user_id,event_id)`, and user foreign keys point to `auth.users`. There is no question-catalog foreign key or dedicated canonical active-session table among the test-bank objects. These are hardening requirements, not proof of a current collision or cross-account exploit. Reservation functions have an empty search path and five-second statement timeout. Deployed migrations and function fingerprints are recorded in JSON.

Two event indexes have identical `(user_id,occurred_at,event_id)` definitions under different names. Repository migration names/timestamps and installed names are not identical; semantic parity needs verification, not an assumption that different names mean a broken migration. No schema/index changes were made.

The captured `npm audit --json` reports 11 affected packages: 1 critical, 4 high and 6 moderate. This is an advisory baseline, not 11 proven application exploits. Direct `jspdf` is a development dependency; direct `@netlify/blobs` is a production dependency. Establish installed-version reachability and compatible remediation before release. Segment 18 owns closure, with early triage in 02/03; no `npm audit fix` or forced dependency upgrade was run. A green baseline job deliberately does not erase this blocker.

## 7. Remaining verification boundaries

The register assigns physical iPhone/iPad/laptop handoff, real concurrent/offline device operation, actual client-role security tests, complete-history/export recovery, official blueprint provenance, frozen performance budgets and production visual/accessibility checks. Existing mocked tests are evidence of those code paths, not substitutes for the required physical/production acceptance. No production accounts were used to create synthetic attempts.

All gaps from the earlier audit have a disposition. Current code, exact core paths, synthetic observations and the matching persisted-counter aggregate now form a reproducible baseline. This meets the Segment 01 evidence/traceability objective subject to PR checks and human acceptance. It does not close the downstream defects, authorize Segment 02 automatically, change the product rating, merge the PR, or modify production.

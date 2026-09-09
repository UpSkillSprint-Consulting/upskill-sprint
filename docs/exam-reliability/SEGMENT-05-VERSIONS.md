# Segment 05 — immutable catalog, configuration and original results

## Authorization and status

Ernest explicitly requested: “Implement Segment 05 and push to the PR.” This stacks Segment 05 on draft PR #173 (`fix/segment-04-question-identity`) from Segment 04 head `64b25d19d9c148bd769d88b2eb13db4450b0843c`, tree `ccce1e7d873227da45d95bc5a6e766f8c88d18ac`. Main remains `b9bf726baf3418d4405e5aed46f13e99b63ba3dd`. The instruction permits implementation, not automatic merge or production/database release. The exact pushed revision and observed CI results belong in the PR verification record, rather than a self-referential source file.

**Segment 04 acceptance is still open.** Preserve S04-B01: the WebKit 390px full-student run `34179714446`, job `101916204582`, missed option D on `mbb:set-3:d2-038`. Paired 60-question probes did not reproduce it; its cause is not established. Batch 3 WebKit job `101916200408` was cancelled. New version tests or later successful runs alone do not diagnose or erase either historical result. PR #173 must remain draft until the cumulative review conditions are resolved. Segments 06–20 are not implemented by this change.

## Root causes and implemented boundaries

The old registry establishes identity, not the revision of question content or the policy used by an attempt. Results and full-exam analytics could depend on today's mutable configuration. Generic MBB length 100 also hides legitimate Set 2/3 attempts of 175 questions. A later key, explanation, domain or target edit must not rewrite an original result.

1. **Content-addressed publications.** SHA-256 covers canonical JSON, independently checked against Node crypto and in PostgreSQL. Content revisions include every JSON question field except identity aliases and set membership. Canonical identity does not change. Bank versions cover revision assignments and set memberships; ordering a source bank is not a new revision. Config versions cover the full pinned configuration and source provenance; blueprint weights have their own hash. Earlier immutable archives are retained, never overwritten under a hash.
2. **Start-time pin.** All published certifications and existing core/adaptive entry points use an explicit version prerequisite. A missing catalogue, unpublished edit, unsupported policy or malformed selection fails visibly before new session evidence. The full local pin captures question/option order, complete content, BoK mapping, set-specific expected length, site target in basis points, grading/mastery/timing policies, actual start/limit/deadline, reporting timezone and ownership. This is a start snapshot, not a replacement state machine. A null legacy/reset owner value is not invented historical provenance; authenticated ownership is enforced separately by the database.
3. **Original grading and presentation.** Running questions, keys, explanations and domain names use the original detached snapshots. Completion validates ordered identities, all items including blanks, option indices and original keys. Original counts and exact unrounded site-target comparison persist with the configuration. Terminal retries return the original result. Completion references the start manifest rather than duplicating it; all published full-session and question-event payloads are tested against the existing 64 KiB boundary. Set badges are retained separately from the content hash.
4. **History without current-bank substitution.** Versioned adaptive restoration validates its original content and current account. Corrupt or unavailable pins block recovery rather than silently create a fresh attempt. Answer events preserve complete snapshots, including extended visual data, and original result metadata survives mastery projection and reconciliation. Immutable bank/config archives and explicit alias resolution support missing/retired current questions. An archive failure is an error, not permission to substitute current content. The archive API requires the immutable start manifest for ordered historical questions; a compact completion reference alone is not a manifest.
5. **Bounded local storage.** The existing quota-recovery path can remove a redundant full content copy only from a completed, mastery-projected, owner-acknowledged session. It keeps the original grade and immutable catalogue/start references. Active, pending, foreign-acknowledged and unprojected pins are not eligible. Existing IndexedDB mirroring precedes this recovery. This limited compatibility measure does not claim Segment 06's broader durability guarantees.
6. **Compatible database constraints.** An additive migration creates immutable catalog, revision, membership, release, alias, owned session/item and original/regrade-result tables. Foreign keys bind each item to a published revision and each session to a valid release. Learners receive catalogue SELECT and owner-scoped private SELECT only, never publication/regrade or direct session/result write authority. Existing ledger insertion invokes validation for versioned sessions, including independent original grading. A versioned completion cannot downgrade to a legacy payload. Legacy events stay unchanged; mandatory version protocol adoption, replay receipts, concurrent finalization, all answer-event semantics and writer ownership epochs remain Segment 07.
7. **Explicit correction results.** A privileged, reviewed database operation may create a separately identified regrade with original-result link, correction revision map, reason, reviewer and idempotent request ID. It cannot UPDATE the original result. Changed option text/order requires a future explicit remapping protocol and is rejected, not guessed. No learner-facing regrade screen, automatic regrading, or production publisher grant is introduced.

## Official format verification versus site practice settings

The source/date/format record is `catalog/v1/provenance.json`. Primary ASQ certification and exam-result FAQ pages were reviewed on 2026-09-08. Question wording, the 3,189 existing IDs, bank sizes, existing numeric practice presets and site blueprint weights were not rewritten.

| Certification | Official computer-based format | Existing site preset retained |
|---|---|---|
| CSSBB | 165 total, 150 scored, 15 unscored; 258 exam minutes | 165 all-scored practice questions / 270 minutes |
| CQE | 175 total, 160 scored, 15 unscored; 318 exam minutes | 160 / 300 minutes; paper-paced practice |
| CSSGB | 110 total, 100 scored, 10 unscored; 258 exam minutes | 110 all-scored practice questions / 258 minutes |
| CMQ/OE | 180 total, 165 scored, 15 unscored; 258 exam minutes | Custom 150 / 270-minute practice |
| MBB | 110 multiple choice (100 scored, 10 unscored) plus a performance assessment; 320 exam minutes | Multiple-choice-only practice: 100 / 150 minutes; Set 2/3 = 175 / 15,750 seconds |

Appointment time is not exam time. All site questions are scored; no invented pretest slots are assigned. ASQ's 550-on-750 **scaled** passing score is not a 70% raw-score rule. The existing 70% is labelled as a **site practice target**. MBB's performance assessment is not simulated. Site blueprint weights are versioned site configuration, not newly certified as an exact official blueprint mapping.

Default core timing remains `Math.round(count * minutes * 60 / questions)` seconds; the diagnostic path retains its existing whole-minute rounding. The actual supplied duration is pinned, so later defaults cannot change it. Set 2/3 MBB duration remains exactly 262 minutes 30 seconds, not 263 minutes. Clock calibration/reload recovery is still Segment 13.

New full-exam analytics qualify by the attempt's pinned expected length and target. Legacy attempts retain the compatibility projection, explicitly tagged `legacy-unknown`; where the old margin comparison is shown, the UI discloses that it uses today's target because the original is unknown. Unknown targets are not plotted as zero. Comprehensive legacy reconciliation and historical presentation remain Segments 08/09/11.

## Rebuild, validate, publish

```sh
npm ci
node scripts/exam-reliability/build-catalog.cjs --check
node --test --test-concurrency=1 tests/test-bank-segment04-identity.test.js tests/test-bank-segment05-versions.test.js
node scripts/exam-reliability/run-node.cjs
```

The builder produces the current small browser catalogue, immutable public bank/config JSON archives, release manifest, and a **separate** trusted publication seed. `--check` rejects drift without writing files. Authoring a corrected question requires a reviewed new publication; editing EXAMS without regenerating the catalogue deliberately blocks new sessions. Do not delete prior archives when releasing an update. Local and CI tests retain existing assertions; manual JSDOM fixtures now load the actual deferred prerequisites, and a synthetic formula-search fixture explicitly publishes its synthetic catalogue instead of bypassing validation.

### Required human-approved release order

1. Back up and verify current database/schema parity, client-role grants and recovery in a staging environment. Apply `supabase/migrations/20260908010000_add_exam_version_catalog.sql` through the authorized migration process.
2. Using the authorized migration owner, execute `supabase/catalog/segment05-catalog.sql`. This seed is idempotent publication, not a learner RPC. Confirm five releases, 3,189 original revisions and expected hashes. Do not deploy the new client before this publication; missing catalogue rows intentionally reject versioned sync.
3. Deploy the exact reviewed client, catalogue and all immutable archives together. Run authorized old/new client compatibility and smoke checks before production acceptance.
4. Recovery: roll back the client to the prior release if needed; retain additive tables, original results and all archived revisions. Never roll back by deleting accepted results, catalogue references or learner evidence. A legacy client cannot overwrite a versioned session result.

No destructive backfill, live migration, service-role production authorization test, production publication, new question content, dependency/CDN upgrade, merge or deployment is performed by this PR.

## Evidence and limitations

New tests cover independent SHA/canonicalization, every published revision, edits/reordering, content/config/domain changes, exact threshold/blank handling, stored option permutations, original-result retries, account mismatch, missing prerequisites, 64 KiB budgets, complete visual snapshots, immutable archive failure and narrowly authorized pin compaction. The cumulative PostgreSQL runner retains all earlier 32 assertions and adds real restricted-role catalogue/session/result/regrade checks. Browser lanes retain the original interactions and add archive retrieval, post-start content/config edits and original timing checks across all five certifications.

The PR records actual final counts and exact tested revisions. SQL results are only claimed after disposable PostgreSQL 17 execution. Browser tests use synthetic auth/persistence and emulated layouts; they do not establish physical iPhone/iPad, JWT/Data API, live schema parity, full visual/WCAG, or production behavior. No 10/10 release score is assigned.

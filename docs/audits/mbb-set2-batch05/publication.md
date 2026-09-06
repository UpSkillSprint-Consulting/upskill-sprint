# Batch 5 publication — PR #165 now includes Batches 1–5

**Batch 5 is committed to the existing PR #165.** Set 2 audit scope is now Questions **1–125**, comprising Batches 1–5. Publication is no longer blocked. Human review, merge and live acceptance remain separate gates; no merge to `main`, automatic merge or production deployment was performed. Batch 6 has not started.

This note supersedes only the historical publication-blocked statements in `report.md` and `browser-summary.json`. Those exact audit files are retained as verified evidence of the originally saved candidate. Their source-verification, browser-fixture and psychometric limitations remain applicable.

## Exact candidate published

- Previous PR head: `e385245927caff7016200f70ef8245faa2a942bf`.
- Batch 5 application commit: `98f89a6cd77c3937826ab7d27ecef2a9b23492e0`.
- PR branch: `audit/mbb-set2-batch02`, advanced without force-pushing.
- **24 source, test, generated-asset and audit files** match the saved Batch 5 candidate byte-for-byte, including its question-level tracker. This publication note is an additional documentation-only file.
- Stable Batch 5 IDs: `mbb:set-2:original-101` through `125`.
- All **150 other question records**, all **175 answer-position indices**, and all **24 unrelated generated asset files** are preserved. The pool remains **175 questions**; Q126–175 are unchanged and have not been audited in this batch.
- Helper payload files and the one-off publication workflow are excluded from both the application commit's ancestry and the final PR diff.

## Checks rerun for this publication

The saved patch was first applied to a reconstructed exact baseline locally. Every before-file hash matched, the patch passed `git apply --check`, all seven asset packages were regenerated, and **all 24 after-file SHA-256 hashes matched**. The targeted regression was rerun locally: **268 tests passed, zero failed/cancelled/skipped**.

GitHub Actions repeated baseline verification, candidate reconstruction, locked dependency installation, complete asset regeneration and all 24 after-file hash checks. It then ran the same **268 targeted tests: 268 passed, zero failed/cancelled/skipped**. Only after success was the candidate committed and added to PR #165.

Command: `node --test --test-concurrency=1 tests/*mbb*.test.js tests/*feedback*.test.js`

- [GitHub verification run](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34003375880)
- [Verification artifact, 14-day retention](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34003375880/artifacts/9980182928)

The downloaded artifact independently reconciles all 24 file hashes and the committed revision. These are targeted test results, not a claim that the separate full-repository PR CI has passed.

## Previously recorded browser evidence retained

The saved raw browser records were verified against the SHA-256 hashes in `browser-summary.json`. **No new browser run is claimed for this publication step.** The application files are identical to the candidate those records describe:

| Recorded run | Assertions passed | Traversed question/layout states | JavaScript errors |
|---|---:|---:|---:|
| Batch 5 exam/review/retry | 1,404 | 159 | 0 |
| Batch 5 dark/narrow/static fallbacks | 1,005 | 160 | 0 |
| Combined Batches 1–5 | 2,943 | 765 | 0 |

The combined run traversed Q1–125 in exam and review on desktop/tablet/mobile and exercised mixed-batch retries; each layout scored the recorded independent audit solutions 125/125. States are traversed views, not a claim that every state has its own screenshot.

## Remaining limits

Live authentication, durable cloud writes, cross-device synchronization and physical iPhone Safari have not been established by the offline browser fixtures. Broader inherited textbook-page ranges and earlier source-closure concerns are not newly certified by publication. No empirical item difficulty, discrimination, DIF or reliability calibration is inferred. Materially rewritten items retain stable IDs; historical learner responses are not rewritten or re-equated.

Locked dependency installation again reported **11 advisories: 6 moderate, 4 high and 1 critical**, in the unchanged dependency tree. This publication neither upgrades dependencies nor constitutes security clearance.

**PR #165 is for human review. No production or full-175-question readiness approval is implied.**

# Batch 7 publication — PR #165 includes Batches 1–7

Batch 7 (Questions 151–175) is committed to the existing PR #165. The PR now contains the audit corrections and records for all seven batches, Questions 1–175, of ASQ Master Black Belt Simulation Exam — Set 2. This closes the publication gap, not the separately documented source, live-service or psychometric validation limits. Human review and merge remain required. No merge to main, automatic merge, production deployment or historical-score rewrite was performed.

## Exact candidate and preservation

Previous PR head: `65dc141c42e7208542a704c6eddf29c4ce2cf08e`.
Application commit: `189b50bd349cc14605d399659ef6e157561f9984`.
PR head branch: `audit/mbb-set2-batch02`, advanced without force-pushing.

All 28 source/test/asset/audit files match the saved audited candidate byte-for-byte. This note is an additional documentation-only file. The four separately supplied audit documents also match the corresponding patch outputs. The original compressed publication package was reproduced exactly from the saved patch and candidate, matching both its recorded raw and packed SHA-256 hashes and the first three previously staged Git blobs; no question reconstruction was needed.

Exactly 25 question records change, with stable IDs `mbb:set-2:original-151` through `175`. All 150 earlier records, all 175 answer-position indices and all 24 unrelated generated asset files are preserved. Q150 retains its corrected D key. The pool remains 175 questions. All seven asset packages were regenerated and the unrelated files remain byte-identical.

Temporary transport files and the one-off verification workflow are excluded from the application's ancestry and the final PR diff. Previous preservation tests verify the new pinned Batch 7 hashes rather than silently skipping the range.

## Publication checks rerun

The saved source patch passed `git apply --check` and `git diff --check` against an exact archived baseline. After asset regeneration all 28 final SHA-256 hashes matched. The targeted MBB and feedback suites were rerun locally: **366/366 passed**, zero failures, cancellations or skips.

GitHub independently verified the exact baseline, compressed and decoded payloads, rebuilt the candidate, installed the locked dependencies, regenerated all seven asset packages, matched all 28 final file hashes, verified the question-change scope and retained Q150 key, and passed the same **366/366 tests**. Only then was the clean candidate committed. The downloaded GitHub artifact was independently reconciled with the saved manifest and resulting commit.

Command: `node --test --test-concurrency=1 tests/*mbb*.test.js tests/*feedback*.test.js`

- [Publication verification run](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34044647387)
- [Verification artifact, 14-day retention](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34044647387/artifacts/9992742996)

These targeted results are not a claim that the separate full-repository PR-head CI has passed. Check the latest PR checks independently.

## Previously recorded browser evidence

No new browser run is claimed for this publication step. Every application source hash recorded in the saved `browser-summary.json` matches the published candidate. The existing summaries and raw-result hashes are retained unchanged; unavailable original raw browser logs are not claimed to have been reverified in this step.

| Saved candidate run | Passed assertions | Traversed states | JavaScript errors |
|---|---:|---:|---:|
| Batch 7 exam/review/retry | 1,494 | 162 | 0 |
| Dark/narrow/static fallbacks | 957 | 154 | 0 |
| Combined Questions 1–175 | 4,254 | 1,071 | 0 |
| Expanded Q170/Q174 evidence | 12 | 8 | 0 |

The recorded full-bank traversal scored the adjudicated audit answers 175/175 on desktop, tablet and mobile, including mixed retries. The combined traversal uses programmatic events on the actual application handlers; the separate Batch 7 player run exercises pointer/keyboard interactions. Traversed states are not independent psychometric observations or counts of individually inspected screenshots.

## Retained limitations

This publication does not repeat the substantive audit or certify every inherited textbook page. The report/tracker identify the narrower source-verification scope, authored examples, earlier Batch 1 source-closure concerns and Batch 3 restoration provenance. Original audit documents remain unchanged; their prior unstarted/unpublished-batch statements are superseded only by actual commits and this publication note.

Offline fixtures do not establish live authentication, durable cloud writes, cross-device synchronization or physical iPhone Safari behavior. Human review and live acceptance remain required. No empirical difficulty, discrimination, differential item functioning or exam-reliability calibration is inferred without learner-response data. Historical learner responses and scores are not rewritten or re-equated; Q150 historical-score remediation requires a separate reviewed policy. Dependency advisories remain a separate security concern; no dependency upgrade or security clearance is included.

All seven batches are delivered for review. This is not an unconditional production-readiness approval or permission to bypass human review and merge.

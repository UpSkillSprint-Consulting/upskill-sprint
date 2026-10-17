# NPPE Diagnostic — Batch 1

Set 1 / ChatGPT / `set-1-diagnostic`: **10 original questions available, 50 planned**. Stable IDs `nppe:set-1:diagnostic:001`–`010` correspond to NPPE-001–010. Domain I–VI counts are 1, 2, 3, 2, 1, 1. All ten items are scored. This is a partial diagnostic, not a full mock or a complete fifty-question assessment.

Each item includes four options, a single key, four rationales, a learning objective, blueprint mapping, provisional difficulty, jurisdiction, a key principle and source locators. No publisher test-bank questions were imported. Independent professional review and empirical difficulty calibration have not been performed.

## Integration and presentation

`test-bank-nppe-diagnostic.js` owns only the Diagnostic. Idempotent registration preserves other authors' forms. `scripts/nppe-diagnostic-runtime.mjs` integrates the diagnostic in the NPPE-only authorized package at build time using checked unique anchors. Other exam packages and the large source authoring HTML are not rewritten. Verify the **built package**, not the unshipped authoring HTML.

The author tabs show only that author's banks and support arrow keys, Home and End. Set 1 contains Diagnostic, Learning and Mocks A–C; Set 2 contains Mock D; Set 3 contains Mock E. Mock D/E question files, including their concurrent edits, are preserved unchanged by this Diagnostic commit. Empty banks and incomplete full mocks cannot launch or substitute another bank.

Diagnostic uses all ten items, randomized, with a fourteen-minute practice limit or an untimed option. Answer aids, domain hints and explanations are hidden until submission. Results show raw accuracy, domain counts and source-supported answer review, not a pass prediction. Retakes reuse these questions. The existing memory-only runtime retains results only in the current tab; refresh recovery and cross-device history are not provided here.

## Access and publication

The build, loader and endpoint recognize NPPE. Fresh `can_access_exam` checks remain required. No account grants or database publication statuses have been changed. The directory/migration retain `coming_soon`. This code does not apply the migration, publish the exam, merge the PR or certify an authenticated deployed learner/admin journey.

The public staging step excludes the NPPE authoring directory and bank files. The static audit now recognizes accidental NPPE staging. Protected delivery does not make the GitHub repository private; previously accepted source-privacy limitations remain separate.

## Verification on the synchronized source

- 12 Diagnostic tests passed: identity, complete explanations, idempotency, ownership, package isolation, empty banks, timing, navigation/flags, scoring, post-submission review, keyboard/author tabs, Mock D/E separation, authorization denial and public staging.
- The existing Exam access foundation command passed all 113 checks.
- The targeted NPPE/directory/delivery suite passed before the additional three Diagnostic tests; the CI workflow reruns the combined suite.
- `npm run build:site` passed, with no known static public-question findings. NPPE package is approximately 1 MB, below the enforced 5.5 MB build budget.
- Local Chromium visual/interaction fixtures were checked at 1440 and 390 pixels, in light and dark modes: no horizontal overflow or script exceptions; all six result domains appeared and a correct-answer run scored 10/10. Header/footer used the current main wordmarks.

The visual fixture used local built HTML/CSS/scripts and exact staged logo bytes, embedded in memory because browser navigation is unavailable. It did not sign in, change permissions or test the live deployment. This distinction must be preserved in release notes.

```sh
node --test --test-concurrency=1 tests/test-bank-nppe-diagnostic.test.js tests/test-bank-nppe-architecture.test.js tests/exam-access-delivery.test.js tests/exam-directory.test.js tests/exam-practice-section.test.js
npm run build:site
```

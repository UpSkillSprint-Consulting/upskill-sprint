# Exam reliability program

## Current execution boundary

Segment 01 baseline and reproductions are prepared for human review in PR #172 on `audit/segment-01-baseline`. Segments 02–20 have not started. Review/merge, deployment, and production verification are separate gates; this directory does not authorize any of them automatically.

The initial source and production baseline is `990e385350ae63d76cfc1e3940c3644859cc636a` (2026-09-07). No application behavior, question content/IDs, dependencies, learner history, or database objects are modified by Segment 01. The additions are documentation, isolated tests, and a read-only-permission CI evidence job. Product rating is not increased merely for documenting defects.

## Records

- [Approved-plan execution index](ROADMAP.md): all 20 segments, dependencies and completion gates; identifies the supplied full planning document by hash.
- [Segment 01 baseline](SEGMENT-01-BASELINE.md): environment, source review, reproductions and testing boundaries.
- [Defect and verification register](DEFECT-REGISTER.md): every preceding audit concern has a disposition and owner segment; also contains newly reproduced defects.
- [Machine-readable baseline](segment-01-baseline.json): pinned deployment, inventory, schema/migration and screenshot-reconciliation facts.
- [Read-only schema query](segment-01-schema.sql): repeatable metadata capture with no learner data.

## Reproduce

Use the repository's Node 22 environment and locked dependencies. In a complete checkout:

```sh
npm ci
node --test --test-concurrency=1 tests/test-bank-segment01-*.test.js
npm test
```

The isolated job prints `SEG01_` JSON lines and uploads its log and dependency advisory JSON. `OBSERVATION` is deliberately not a desired-behavior acceptance pass: it shows the existing defect or a non-reproduced risk without requiring a future fix to preserve a bug. Preservation checks assert sound current behavior. Each later repair must add a real desired-behavior regression and close the matching register entry with evidence. Never make known-bug observations into assertions that the wrong answer must remain wrong.

The tests execute pinned application functions with synthetic data and controlled clocks. Test-only closure seams do not change the shipped files. JSDOM, VM tests and mocked Supabase are not physical-device, production authorization, or concurrency acceptance.

## Review and continuation rules

Work on one segment at a time. Recheck `main`, current production and outstanding PRs before each segment. Preserve all preceding accepted tests and contracts. Do not reset user records, renumber questions, weaken tests, or combine an unrelated refactor with these repairs.

Before marking this PR ready, inspect the exact-head **Full test suite** and **Exam reliability baseline** results. A green baseline harness is not a security approval: dependency advisories are recorded rather than auto-fixed in this segment. Do not merge until a human has reviewed the scope and evidence. Segment 02 begins only after the Segment 01 review/acceptance boundary, from the latest approved code.

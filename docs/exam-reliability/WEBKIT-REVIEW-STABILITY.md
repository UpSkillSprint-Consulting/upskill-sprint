# WebKit MBB review stability and future-PR acceptance

## Scope and historical evidence

This is a targeted PR #173 readiness repair layered on Segments 04–05, not the
unfinished Segment 06 implementation. No question content, canonical ID,
configuration archive, scoring policy, database schema or learner data is changed
by the stability follow-up. Human review/merge and the Segment 05 migration →
trusted catalogue seed → matching frontend/archives release order remain required.

Two historical failures must be distinguished:

* Run `34179714446`, job `101916204582`: WebKit mobile attempted D and still saw C
  on `mbb:set-3:d2-038`. The captured trace had no delivered D click. Two later
  targeted regressions independently reproduce replacement of the focused answer
  button and stale restoration stealing focus. Both fail on `c89f10a` and pass
  after the `b03ebcd` repair. This does not retrospectively prove exactly why the
  old WebKit pointer event was missing.
* Run `34185826024`, job `101933831966`: all 175 question interactions and 139
  reviews completed, then the last saved position was review 140,
  `mbb:set-3:d6-030`, before the job was cancelled. The old report did not identify
  the internal browser call; it is not evidence that question 140 is malformed.
  It did establish that the test could remain unresolved without a usable
  operation-level failure record. The cancelled run is not re-labelled passing.

The root-cause scope is deliberately specific: the DOM/focus defect is reproduced;
the old audit's unbounded-wait and repeated temporary-tab execution paths are
removed/contained. No unsupported WebKit engine-defect diagnosis is asserted.
Acceptance requires the complete new runs, not a first-60 or six-item diagnostic.

The first full WebKit-mobile run after `b03ebcd` completed all 175 questions,
175 reviews and 700 scans without interaction/page/geometry/axe violations.
Review 140 took 2,390 ms. Its exact tested merge was
`252053c2be302e949c67a3a22c78d84e2dbb02f3`; summary artifact `10056224453` has
SHA-256 `6ad3d8483dad96d724baf96cb03fa246e2c2e573133cb10eac683230f78075fa`.
This is retained comparative evidence, not a substitute for exact-head acceptance
of the additional supervision and gate code.

## Application correction already included in `b03ebcd`

A saved answer updates selection, ARIA state, progress and its navigation indicator
in place instead of replacing the quiz DOM. Its actual button retains focus
without scrolling. Rejected/expired saves still cannot change the selection.
All seven MBB helpers ignore obsolete restoration when the original control still
exists, so earlier callbacks cannot steal focus from the next option. The
focused-control and all-seven-helper regressions remain in the full Node suite.

## Audit execution without temporary-tab churn

The full test evaluates every question and every review in both light and dark
mode: 175 × 2 × 2 = 700 WCAG 2 A/AA scans per browser profile. The same axe engine,
tags, violation assertions and incomplete-rule diagnostics are retained. The
supported `AxeBuilder.setLegacyMode(true)` path evaluates the current document
rather than opening/closing a separate aggregation tab for each scan.

That path is valid here only because the audited document has no frames. Frame
count is checked before AND after every scan; introducing a frame fails with a
request for frame-aware evaluation rather than silently omitting it. Every full
profile additionally compares all four result categories from normal and
same-document axe execution on an intentionally inaccessible fixture. Both modes
must detect the missing image alternative and unnamed button. No rule exclusion,
forced click, automatic retry or reduced question sample is used.

The audit dependencies are exact test-only versions: Playwright 1.63.0 and axe
4.13.0, including the same WebKit generation as the failed historical run. They
and their entire four-package dependency graph are locked with registry integrity
hashes in `scripts/student-audit-tools/package-lock.json`, installed with `npm ci`
separately from application dependencies, and verified in acceptance reports. Updating them requires explicit contract/fixture verification, not a
floating `latest` installation. This is not a downgrade to avoid the failure.

Primary API references: Playwright `Page.setDefaultTimeout` applies to methods
accepting a timeout; arbitrary page evaluation needs an outer bound. Deque's
`packages/playwright/src/index.ts` documents the separate aggregation tab and
same-document mode's cross-origin limitation. The no-frame guards and equivalence
test are mandatory safeguards, not a claim of physical-device or complete manual
WCAG approval.

## Independent deadline enforcement

`node scripts/run-student-audit.cjs full` and `... edges` start the audit in a
separate process on the Linux CI runner. A unique per-run environment marker
identifies its children, including detached browser groups and reparented
descendants. Cleanup checks both that marker and process start time using
`/proc`; it never kills by name or by an unverified child-supplied PID.
Environment contents are not logged or copied to evidence.

* Normal named operations have a 60-second bound; diagnostic capture and browser
  teardown have shorter bounds.
* The supervisor uses a monotonic clock and fails after 90 seconds without
  meaningful operation progress, even if the child's event loop is blocked.
* It sends SIGTERM, then SIGKILL after five seconds to the owned process tree,
  including separately detached browser groups. Normal/failed child exits also
  clean up scope-marked descendants.
* A separate total bound is 35 minutes for a full profile and 15 for edge tests.
  The existing GitHub job limits remain 40 and 20 minutes, leaving time to upload
  evidence. Neither a longer job limit nor a retried assertion is the repair.

A failure remains a failure. An audit that writes `complete:true` and then hangs
in teardown fails supervisor acceptance. A child returning a nonzero exit code
cannot be converted to success. Unit fixtures verify pending promises, a blocked
JS loop, a process ignoring SIGTERM, endless progress exceeding the total bound,
normal completion and unchanged failure exit codes. An additional regression
spawns a separately detached browser-like child plus an unrelated sibling: the
old group-only cleanup fails it, while scoped cleanup terminates the former and
preserves the latter. This catches the detached-process escape before release.

`progress.json` and `supervisor.json` identify the last phase/question/source;
`report.json` retains the completed evidence and any errors. JSON is replaced
atomically. Per-operation progress uses a small record instead of repeatedly
serializing the full growing examination report. The full report is still saved
after completed question/review units and on failures. A corrupt or incomplete
artifact cannot become a passing gate.

## Fail-closed acceptance on every pull request

The existing workflow now runs on every PR and exposes one stable aggregate:
**MBB complete student acceptance**. No branch-protection configuration is changed
by this code; human reviewers must still require green acceptance before merging.

The original six profiles are preserved. A seventh profile,
`webkit-mobile-repeat`, independently starts and completes another 390px mobile
session on the same revision. It is not a retry that erases a failure. Across the
seven profiles, acceptance requires 1,225 question interactions, 1,225 individual
reviews and 4,900 accessibility scans. Both 320px edge profiles additionally
exercise timeout, failed save, retake, 174 correction items, five related-practice
items and all 175 rapid review disclosures.

The aggregate checks the dependency results and downloaded reports against the
checked-out source and actual canonical MBB bank. It rejects absent/duplicate or
invented questions, mismatched source/profile, omitted themes or scans, disabled
accessibility, tool drift, original-score changes, page/geometry/axe errors,
unsuccessful supervision and failed/cancelled/skipped dependencies. Report hashes
are written to `final-student-gate/gate.json`. Artifact downloads are restricted
to compact reports and edge evidence, not gigabytes of screenshots.

## Reproduce

```sh
npm ci
node --test --test-concurrency=1 tests/contrast-theme-race.test.js \
  tests/test-bank-mbb-set3-final-student.test.js tests/student-audit-*.test.js
npm ci --prefix scripts/student-audit-tools --ignore-scripts
scripts/student-audit-tools/node_modules/.bin/playwright install --with-deps webkit
AUDIT_TOOLS_DIR=$PWD/scripts/student-audit-tools AUDIT_ENGINE=webkit AUDIT_LAYOUT=mobile \
  AUDIT_WIDTH=390 AUDIT_PROFILE=webkit-mobile AUDIT_AXE=1 \
  AUDIT_SOURCE=$(git rev-parse HEAD) node scripts/run-student-audit.cjs full
```

Run a second independent session with `AUDIT_PROFILE=webkit-mobile-repeat` and a
separate `AUDIT_OUT` directory. CI runs both, plus all other profiles. A short
smoke test is useful for diagnosis but cannot satisfy the full aggregate.

Current exact-head outcomes are recorded in PR #173 and its CI artifacts. These
are browser-engine emulation with synthetic authentication/persistence, not a
physical iPhone test or production Supabase-parity claim. Later roadmap findings
and previously disclosed dependency advisories are not closed by this repair.


## Shared repair of the older batch workflows

The completed full-student b03 run passed all six browser profiles. During the
same revision, the **older Batch 4 WebKit-mobile workflow** stalled separately:
run `34225393136`, job `102058141685`, cancelled; artifact `10056245002`,
SHA-256 `f49c15ed3a20ebb13d4978a3abeb1eed3de93996cf6c7b074ef85a6adab6ff43`.
Its retained report contains 72 question/review/theme rows, last completed at
canonical Q86 dark review, with no captured assertion/page errors. A cancelled
partial report is not a passing result. The exact internal blocking call was
not captured and is not invented here.

All **seven batch browser drivers** now use the same guarded same-document axe
execution, locked browser tools, atomic progress, bounded failure capture and
teardown, and independent process supervision. The batch watchdog's total
limit is 12 minutes, below the existing 15/20-minute CI limits. All original
25-item content, four-option, keyboard, re-open, theme, visual and review
assertions remain. Complete coverage is explicitly checked as 100 rows per
engine/layout (25 questions × question/review × two themes), plus one session
result. The six existing read-only PR batch workflows also trigger on changes
to these shared audit dependencies. The historical Batch 2 authoring workflow
retains its original branch-only trigger and authoring behavior; it is not
enabled on PRs. Its browser driver is hardened, and Batch 2 content remains
covered by the complete 175-question PR acceptance workflow.

This prevents the old unbounded batch scan path from being left behind after
the main full-student workflow is fixed. A new static regression checks every
batch driver/workflow, so future changes cannot silently restore the
unbounded scanner or omit process supervision.


### Concurrent Batch 4 repair preserved

The feature branch advanced to `00a29280c2bcb2821ce65b415140aa337f623bdd`
while this shared repair was being validated. Its two changed paths were reviewed
before advancing the branch. The combined repair preserves the additional Batch 4
engine-equivalence fixture, explicit 100-scan counter, 120-second question/review
unit bounds, short screenshot/teardown bounds, failure diagnostics, credential-free
checkout and resolved dependency-lock artifact. It adds independent supervision,
atomic progress and the fully locked shared tool installation rather than dropping
those protections. The final commit descends from that concurrent repair; no
force push or history reset is required.

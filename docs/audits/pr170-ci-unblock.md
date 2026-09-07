# PR170 required-check unblock

## Diagnosed causes

The automated commit `b5a8d753` appended the global contrast script to 47 HTML files and used a CI-skip directive. The approved PR head consequently had no required Node 22 full-suite result.

The same-tree commit `256f2eb9` restarted checks without editing files. The downloadable regression evidence on that head (run `34154435578`, artifact `10030654263`, test merge `cd890ab1`) records 1,767 tests: 1,757 passed and 10 failed. The failures identify final dark-override ordering in three lessons and exact-preservation checks for generated MBB HTML assets. These are real effects of the bot's broad HTML injection; the assertions must not be weakened to accept them.

## Repair

- Restore exactly the 47 HTML files modified by `b5a8d753` to their blobs from `122a73c7`. All intentional exam, feedback, retake, save-recovery and contrast-race repairs remain in place.
- Keep the 175-question bank, answer positions, tests, dependency versions and required full-test workflow unchanged.
- Convert the branch-mutating injector into manually requested, read-only patch preparation. It no longer pushes commits or suppresses CI.
- Restrict maintenance proposals to one real HTML page, exclude generated assets and fixtures, reject dynamic wrappers needing individual integration, avoid duplicate script loading, and preserve a lesson's final dark-override block.
- Require the full existing test suite for a proposed maintenance patch and retain its diff as an artifact for human review.
- Add two workflow-safety regression tests. Local validation also exercised normal-page insertion, final-override placement, existing-script idempotency, and rejection of fragments, generated assets and dynamic wrappers (six scenarios plus three repeat/idempotency checks).

## Verification boundary

This record describes the repair and local checks, not a passing result for checks that have not completed yet. Current PR checks must report on the actual head. Human approval and branch protection remain required. No merge or production deployment is authorized or performed by this repair.

# PR170 student-interface and failing-check repair

Baseline PR head: a826d62780928256df12f905501a76a372e803d5.

The initial live GitHub check reports no merge conflict. The failed Batch 4 WebKit/mobile job 101803209371 (run 34141151376) reached 90 rendered records, then found a missing report mailto href on canonical Q96. This is not waived or converted to a passing check. The older Batch 3 check is successful at this baseline, contrary to the stale PR description.

## Repairs integrated from the previously unmerged final175 staging work

- Render deep feedback and quality details synchronously with each replacement review card; retain a mutation-observer fallback and idempotent hydration.
- Position review controls below the real sticky header using deterministic scrolling instead of racing smooth-scroll navigation.
- Build complete review records from the saved session, including unvisited items on timeout; do not synthesize navigation clicks during submission or publish a successful review on a failed save.
- Preserve Full Exam retake handlers, which the Quick/Focused coordinator previously cloned away.
- Keep expired answers immutable during failed-save recovery, retain the original timeout reason, and show an actionable save-error notice.
- Retain the correct item-specific reference during answer review, correction quiz and related-question practice, with HTTPS allowlisting and safe escaping.
- Wrap narrow-screen review copy and improve missed-question guidance contrast.
- Correct Q1's secondary hint: the stated case is clinical IT and reimbursement exposure, not customer convenience. A whole-bank byte guard allows only this explicit hint correction; all IDs, keys, question stems and other bank bytes are preserved.

## Newly reproduced contrast race

In the prior full175 source 10c48532449dfc6e16023eff74f22b9c25b268c4, Chromium desktop completed 175 questions and 175 reviews but failed eight dark-mode contrast checks on the Back to Exam Simulator button. The contrast observer discarded real theme changes while its own scan suppression was active, and previously queued scans could still measure a transitioning palette.

Three deterministic tests failed on the old source and pass after prioritizing real theme mutations and guarding queued scans during palette settling. The combined local contrast/session command passes 15/15 tests. The exact same repair also passes the isolated preparation workflow 34153310231. These results are preliminary unit evidence, not substitutes for the PR browser gates.

## Acceptance boundary

The PR now includes a read-only final-student workflow: six complete 175-question browser journeys (Chromium/WebKit, desktop/390px mobile, additional 320px mixed outcomes), both themes, axe checks without exclusions, actual option and issue-form controls, and separate timeout/save/retake/correction stress tests. Existing batch and full-suite checks remain intact. No retries, forced clicks, bypass approvals or branch-protection changes are added. Staging preparation scripts and write-enabled workflows are not imported.

Refer to the latest PR checks and the completion comment for actual post-push results. No merge or production deployment is authorized or performed. Human approval remains required. Browser services use isolated authentication and persistence fixtures; this does not certify production synchronization, physical handsets, or empirical psychometrics.

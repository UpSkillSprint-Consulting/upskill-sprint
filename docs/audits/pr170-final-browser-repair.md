# PR170 final browser repair

Baseline: `31564739b660c31e3b0bf3b6b457ca4f5fae85c7`.

The required Node 22 full suite passed on this baseline. Three independently observed browser failures remained:

- Batch 6 WebKit mobile, run 34155779009/job 101847190945: keyboard ArrowRight did not move the first Q127 review evidence region. Add explicit focused-region-only horizontal keyboard support; do not intercept nested inputs, vertical navigation or modifier shortcuts.
- DMAIC validation, run 34155779017: print was captured with an interpolated grey background rather than white during a theme transition. Disable transitions and animations only in this lesson's print media.
- Full175 WebKit 320px mixed session, run 34155779008/job 101847270564: all 175 questions and all 175 reviews completed, but 31 colour-contrast records involved the Back to Exam Simulator button. Its foreground changed immediately while its background transitioned. Make both colours change atomically without suppressing accessibility assertions or excluding the button.

Six focused regression guards are added. Before submission, local Chromium checks reproduced non-white print during transitions, verified white print after both theme directions, exercised 39 horizontal-key checks across all eight Batch 6 visual items and verified 20 atomic back-button theme changes.

These are presentation/accessibility repairs, not a new semantic question audit. The entire Set 3 bank is unchanged by this commit. Existing content, preservation, browser, grading and accessibility assertions remain intact. No dependency versions, branch protections, approvals or production data are changed. CI must complete on the final PR head before a passing conclusion is recorded. No merge is performed.

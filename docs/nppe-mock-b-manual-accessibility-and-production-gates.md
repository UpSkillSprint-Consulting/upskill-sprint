# NPPE Mock B — manual accessibility and production authorization acceptance protocol

**Status: NOT EXECUTED AS HUMAN AT TEST TIME; all manual rows pending.** Synthetic browser fixtures and automated axe/WCAG checks do not substitute for assistive-technology users or account authorization in production. Mock A and Mock B remain `releaseHold:true`, PR #301 remains draft/unmerged.

## Required test environments and evidence

Record reviewer, platform, browser/version, assistive technology/version, date/time, exact Git SHA, build URL or environment, viewport, light/dark mode, outcome, screen or audio evidence reference, corrective PR/commit and retest. Do **not** record passwords, authentication tokens, unredacted candidate data, or identifiable accessibility diagnoses.

Test at **320 px / 390 px / 1440 px**, both themes, plus browser zoom **200% and 400%** and text enlargement where supported. Recommended independent pairings: **NVDA + Firefox/Chrome on Windows**, **VoiceOver + Safari on macOS/iOS**, and one touch/mobile screen-reader journey if possible. Do not assert a device combination was covered unless it was actually used.

## Manual scenario checklist (each initially pending)

| ID | Procedure and pass condition | Status |
|---|---|---|
| AX-01 | Keyboard-only from sign-in to exam practice: visible, logical focus, no trap, Enter/Space/arrow buttons operate | pending |
| AX-02 | Tab group for ChatGPT/Grok/Claude author sets has correct tab roles, labels, selection and expected arrow/Home/End behavior | pending |
| AX-03 | Mock A/B are named as **awaiting release review** and disabled for all learner accounts before authorization | pending |
| AX-04 | Manual temporary review fixture uses only an isolated environment, with explicit test-only hold override and no database/auth writes | pending |
| AX-05 | Full Mock B launches exactly 110 item cards in review fixture, correct 150-minute timed mode and untimed option | pending |
| AX-06 | Screen reader announces item number, question, four alternatives, current selection, flags, navigation and disabled controls without ambiguity | pending |
| AX-07 | Screen reader can move from final item through Submit to result summary; confirmation and timer changes are understandable without focus loss | pending |
| AX-08 | Active mock disallows answer reveal via UI and programmatic path in both timed and untimed modes | pending |
| AX-09 | Scored result uses 100-question denominator, excludes 10 simulated unscored selections; scoring role is not leaked in active item labels | pending |
| AX-10 | Review all 110 cards after submission; each option has accessible context and all four explanations are available and correctly announced | pending |
| AX-11 | Focus moves predictably into/out of results, details/disclosure controls work, retake resets answers/flags/timer | pending |
| AX-12 | 320/390 px and 400% zoom: no horizontal page overflow, clipped buttons, overlapping sticky controls or forced two-dimensional scrolling | pending |
| AX-13 | Light/dark theme: readable non-text and text contrast; status semantics do not rely on red/green/blue alone; zoom and high contrast work | pending |
| AX-14 | Pointer/touch targets and mobile tap order permit selection, flagging, results review and scrolling without accidental input | pending |
| AX-15 | Assistive-technology browser reload/back, transient network error and session timeout expose appropriate messages and preserve confidentiality | pending |
| AX-16 | Reviewer rechecks corrected accessibility defects on the exact revision and appends artifacts and signed disposition | pending |

Automated [NPPE browser tests](../scripts/nppe-diagnostic-browser.py) include Chromium and WebKit screenshots, keyboard exercises, axe WCAG 2/2.1 A/AA checks and 320/390/1440 widths with dark/light modes. Their pass/fail applies **only to that GitHub Actions head SHA**. Axe `incomplete` findings and human-observed screen-reader issues require independent evaluation; zero violations is not WCAG certification.

## Real non-admin learner and administrator test — held until authorized

This is **not** performed with fixture accounts. With explicit owner consent, secure separate admin and learner dummy accounts and isolated/approved environment, verify:
1. Non-admin without an approved NPPE assignment cannot load protected Mock A or B content.
2. Learner requests access; admin reviews and approves under the site's expected policy, with auditable timestamps.
3. Preserve both Mock A/B release holds: even a valid account grant **must not** unlock an unreleased Mock B form.
4. For a future separately authorized release only, confirm a scoped practice attempt, correct completion/review and no other bank visibility.
5. Admin revokes or assignment expires; protected content is denied on fresh and cached navigation.
6. Verify a second learner never gains another's assignment and that API/direct endpoint access fails closed.
7. Confirm cleanup and take only redacted logs/screenshots. The test itself must **not** authorize the release.

No sign-in was attempted in this review; the user's real or test credentials were not accessed.

## Required issue record

For each AX item record: `test_id, revision, platform, AT_version, viewport, theme, reviewer, reviewer_qualifications, performed_at, observed_behavior, expected_behavior, severity, result, evidence_path, fix_commit, retest_result, review_approval`. A failing or unexecuted critical path leaves the release gate **open**.

**Gate disposition:** pending external manual screen-reader and accessibility sign-off, pending approved production-account request/approval/revoke test. Never auto-convert an automated green CI result to manual pass.

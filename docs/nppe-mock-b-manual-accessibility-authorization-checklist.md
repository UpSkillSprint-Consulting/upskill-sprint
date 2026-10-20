# Mock B manual accessibility and production authorization — acceptance record

**Audit preparation date:** 2026-10-19. **Status:** manual tests not conducted; do not mark PASS without actual recorded evidence. Draft PR #301 remains unmerged. Both Mock A and Mock B release-held.

## Evidence specification

For every session record: `item_or_flow`, build Git SHA, environment (local protected preview versus authorized production), OS/browser/version, assistive technology/version, zoom, viewport, theme, reviewer role and independence declaration, date/time, exact observed result, screenshot/short video or text transcript where allowed, defect classification, remediation version, retest decision and reviewer signature. Store evidence privately without credentials, identifiable records or real exam response keys.

Automated CI baseline: browser matrix includes Chromium/WebKit with synthetic authorized fixtures, 320/390/1440 px in light/dark, and axe WCAG 2 A/AA and 2.1 A/AA assertions. The automated test is **not a screen-reader or real production-user test**, and all conclusions are SHA-specific.

## Manual test cases — all PENDING

| ID | Test | Acceptance requirement | Evidence status |
|---|---|---|---|
| A11Y-B-01 | Hold message for a real unassigned learner | Mock B remains disabled; precise reason and correct role announced to assistive technology; no bypass via direct URL or stale state | PENDING |
| A11Y-B-02 | Keyboard-only entry in an isolated authorized test fixture | Focus visible; Tab/Shift+Tab sequence logical; question list and radio/toggle choices operable without a mouse | PENDING |
| A11Y-B-03 | NVDA with Chrome/Firefox on Windows | Current question, options, choices, flag, timer, submit controls named/role/state announced; status not conveyed only by colour | PENDING |
| A11Y-B-04 | VoiceOver with Safari on Apple device | Matching label/role/state behavior, no offscreen controls trapping navigation | PENDING |
| A11Y-B-05 | Screen magnification 200%/400%, reflow | No clipped answer text, overlays, horizontal scrolling of the question panel or hidden navigation at 320/390 px | PENDING |
| A11Y-B-06 | Light/dark and colour-vision differentiation | Failed, correct, revealed, flagged and unanswered distinct through text/icon and contrast; tested with human verification, not visual simulation alone | PENDING |
| A11Y-B-07 | Timed/untimed and 150-minute timer | Timer conveyed without excessive announcements; expiration notice understandable; warnings and submit confirmation operable | PENDING |
| A11Y-B-08 | No assisted reveal during active Mock B attempts | Active reveal not available in either timing mode; normal access to explanations only after completion | PENDING |
| A11Y-B-09 | Review 110 cards, 440 explanations | Keyboard and screen-reader expansion/collapse; answer and rationale mapping correct; back/forward/retake clear | PENDING |
| A11Y-B-10 | Keyboard flag/navigation persistence | Flags persist while moving; answer state visible and announced; pressing Space/Enter does not double-activate | PENDING |
| A11Y-B-11 | Mobile touch target / orientation / 320–1440 px | Header, owner tabs, exam cards, timer, answer and submit buttons do not overlap or overflow; no blocked controls | PENDING |
| A11Y-B-12 | WCAG human review follow-up | Resolve axe incomplete/manual-only checks; log any fail with exact WCAG criterion and evidence | PENDING |
| AUTH-B-01 | Authorized learner request | With permission from user, real non-admin dummy learner can request NPPE; no immediate full-bank access | PENDING, release hold prevents production practice |
| AUTH-B-02 | Admin grant with audit trail | Valid admin grants correct scope only; non-admin cannot self-authorize; minimize personal data captured | PENDING |
| AUTH-B-03 | Test attempt and review | Only in approved protected, pre-release test deployment; form remains unavailable to general learners | PENDING |
| AUTH-B-04 | Revoke / expiry / deny | Admin revokes; learner cannot fetch private content after access removal or use stale token/cache | PENDING |
| AUTH-B-05 | Restore state and confirm protections | Remove test entitlements, verify real delivery form `releaseHold:true`, check audit evidence and no live data changes | PENDING |

**Do not bypass the release hold in production to obtain evidence.** Until an explicitly authorized staging/private test and account plan exists, the production-account attempt portion is blocked by design. The temporary in-memory fixture in CI is sufficient to test scoring logic but not identity, authorization and revocation in real production.

## Defect and remediation standard

Severity: **critical** = unauthorized access or wrong scoring/reveal; **major** = assistive-tech-blocking control, misleading state or severe mobile overlap; **minor** = nonblocking label/visual; **observation** = usability improvement. A critical or major unresolved item fails the release gate. Material changes to question content require new version and independent review; changes to runtime/access logic require exact-head security/browser retest.

Attach human evidence in a separate access-controlled review folder or authorized QA issue; **do not upload candidate keys, credentials or private user data into public PR comments**. This tracker makes outstanding work visible; it does not create a booking for a reviewer or silently run future checks.

## Current disposition

- CI browser matrix: runs on PR head, result checked separately.
- Manual NVDA / VoiceOver / keyboard/zoom/colour perception: **PENDING**.
- Real administrator/learner authorization flow: **PENDING**.
- Independent legal/technical/distractor review: **PENDING**.
- Consent-based field calibration: **PENDING**.
- Release: **HELD**.

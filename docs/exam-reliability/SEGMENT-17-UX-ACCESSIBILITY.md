# Segment 17 — Learner-facing UX and accessibility

## Entry state and scope

Segment 17 starts from exact `main` commit `9bf58471c1d4ad163af484c127092050ed0f6386`, the human merge of Segment 16 PR #182. It does not redefine the contracts implemented by Segments 01–16.

The Segment 17 boundary is the approved roadmap item: consistent terminology, ordering, scales, and error states; responsive, keyboard, screen-reader semantic, and WCAG 2.2 AA review; preservation of approved themes and print behavior.

## Implementation

`test-bank-ux-accessibility.js` is an additive enhancement layer loaded after the learner-facing analytics and reliability modules. It does not calculate scores, readiness, mastery, timing, history, synchronization, allocation, or handoff state.

The layer provides:

- two persistent screen-reader live regions: polite status and assertive alert;
- analytics heading/region relationships and fully linked tab/tab-panel semantics;
- roving tab focus with Left/Right/Home/End keyboard behavior;
- Escape-to-close analytics and focus return to the opening control;
- explicit progressbar values for domain mastery and accessible labels for readiness/heatmap visualizations;
- keyboard activation for non-native quiz-navigation controls while leaving native buttons/links native;
- accessible labels for otherwise unlabeled answer-choice controls;
- visible `:focus-visible` treatment and 44px minimum learner interaction height;
- reduced-motion, forced-colors/high-contrast, and print safeguards;
- learner-facing announcements for offline/sync status, New-only allocation failures, handoff conflicts, and trusted-timing recovery requirements.

The layer is idempotent under the application's existing dynamic DOM replacement. A MutationObserver reapplies semantics after quiz/analytics rerenders without re-running any application calculation.

## Terminology, ordering, and scale review

The existing Segments 09–11 metric terminology remains authoritative. Segment 17 does not rename the defined metrics. It preserves the distinctions between score, estimated mastery, readiness, raw/weighted coverage, delivered, reserved, displayed, answered, pending, and synced.

Domain presentation follows the exam's canonical BoK order from the versioned configuration. The analytics radar already uses both readiness and blueprint weight on the same 0–100 percentage scale (`domainReadiness / 100` and `weightPct / 100`); Segment 17 adds regression protection so a future visualization cannot renormalize blueprint weight to an unrelated maximum.

Error states remain operationally distinct. Offline, pending/syncing, allocation exhaustion, handoff conflict, and timing-recovery conditions are not announced as successful synchronization or successful quiz start.

## Automated review

The dedicated `Exam UX accessibility` workflow runs:

1. focused JSDOM semantic/keyboard/live-region regressions;
2. Segment 12–16 cumulative lifecycle/timing/sync/handoff/New-only tests;
3. existing analytics tests and the complete repository `npm test` suite;
4. Chromium and WebKit browser acceptance at 320px phone, 390px phone, 820px tablet, and 1440px desktop widths;
5. keyboard focusability and accessible-name checks;
6. browser ARIA-tree snapshots;
7. axe-core checks tagged WCAG 2.0/2.1 A/AA plus WCAG 2.2 AA, with critical and serious violations blocking the Segment 17 gate;
8. horizontal-overflow checks at every declared viewport.

Playwright 1.57.0 and axe-core 4.10.3 are installed in a CI-only directory. Application dependency pins remain unchanged.

## Manual review checklist

This repository review records the manual engineering inspection required by Segment 17. It is distinct from physical assistive-technology qualification in Segment 19.

| Area | Review requirement | Segment 17 disposition |
|---|---|---|
| Terminology | Metric names and states match the frozen contracts | Reviewed; no competing terminology introduced |
| Domain ordering | Canonical BoK order is preserved | Reviewed; analytics derives order from configured BoK |
| Scale semantics | Compared visual quantities use a common scale | Reviewed; radar percentages remain 0–100 for both series |
| Keyboard | No mouse-only requirement for analytics tabs/close/quiz navigation | Implemented and automated |
| Focus | Focus is visible; analytics close returns focus | Implemented and automated |
| Screen-reader semantics | Landmarks, tab relationships, progress values, state/error announcements | Implemented and automated via DOM/ARIA-tree checks |
| Responsive | 320/390/820/1440 widths do not introduce page-level horizontal overflow | Automated in Chromium/WebKit |
| Reduced motion | Learner preference is respected | Implemented |
| High contrast | Forced-colors focus and core data visuals remain discoverable | Implemented; physical Windows HC qualification remains Segment 19 |
| Themes | Existing light/dark tokens are not replaced by a new palette | Preserved; no theme architecture rewrite |
| Print | Live regions do not contaminate printed output | Implemented |
| WCAG 2.2 AA | Automated A/AA serious/critical violations block the gate | Implemented; automation is not a legal certification of complete WCAG conformance |

## Boundaries retained for later segments

Segment 17 is not a claim that physical VoiceOver, NVDA, TalkBack, iPhone/iPad, browser zoom/reflow at every OS configuration, or legal WCAG certification has been completed. Those physical-device and independent qualification requirements remain in Segment 19. Security, deletion/reset, token/role and dependency closure remain Segment 18.

No learner data, question content/IDs, database schema, scoring formula, timing policy, synchronization cursor, handoff writer authority, or New-only allocation rule is changed in this segment. No production deployment or automatic merge is performed.

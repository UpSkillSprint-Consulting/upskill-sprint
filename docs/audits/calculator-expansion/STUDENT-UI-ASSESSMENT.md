# Calculator student-use and interface assessment

Date: October 4, 2026. Scope: Engineering & Statistics Calculator, all eleven workspaces, and its companion manual. Reference: `docs/LESSON_CREATION_GUIDE.md`, shared `/style.css`, `/lessons-theme.css`, `/theme.js`, and the Steel Phase Explorer tool's site integration. This is a tool/manual update, not a new catalog lesson or a change to access levels.

## Findings and corrections

| Finding | Correction | Validation |
|---|---|---|
| Calculator/manual were visually detached from the site | Canonical eight-link header, shared theme control, mobile menu and footer; Engineering Tools active | Live desktop/mobile menu review; DOM structure tests |
| Generic content tokens/selectors could recolor site navigation | Namespaced `--calc-*` tokens; content CSS scoped to `#calculator-shell`; protected site chrome outside it | Source inspection, both-theme live review |
| Eleven uppercase tabs were hard to scan on phones | Sentence-case Work Sans tabs, clear filled selection, labelled compact workspace selector below 760px | Selector synchronizes with keyboard tabs and programmatic handoffs; 44 narrow states |
| First-time users lacked a clear entry path | First-visit guidance, quick-start link, breadcrumbs, improved heading/spacing hierarchy | Guided worked example completes on desktop and narrow frame |
| Pasted example displayed literal backslash-n sequences | Real line breaks in the placeholder | Regression test and live rendering |
| Manual TOC ended in reverse workspace order | All 24 links follow the numbered section order, two columns on desktop and one on narrow screens | Exact TOC/heading order test; section 24 anchor lands below sticky header |
| Quick start listed nine of eleven workspaces | Added Advanced SPC and Cost & Savings summaries; retained existing explanations | Eleven-item test |
| Manual square-root example had an incorrect result | Corrected sqrt(59/8) + 44 to 46.715695… | Arithmetic check and manual regression test |
| Tab foreground transitioned separately from its background and the contrast repair could briefly retain the wrong color | Atomic tab colors with explicit foreground precedence | Immediate post-click text checks across all eleven tabs, both themes |
| Scientific equals key and ALPHA legends had insufficient light-theme contrast | Theme-aware equals background/foreground and ALPHA text | Both-theme rendered text checks |
| Opening help could discard unsaved session inputs | Calculator-to-manual links open a separate tab, with a new-tab title; manual documents the behavior | Link regression test |
| Form fields and controls needed clearer boundaries/focus | Larger controls, stronger field borders, scoped visible focus, responsive tables and reduced-motion handling | Desktop/narrow inspection and keyboard-tab checks |

All original teaching headings remain present. Existing numerical engines and methods were retained. The three added usability tests bring the focused calculator suite from 65 to 68 tests.

## Executed validation

- `node --test tests/calculator-*.test.js`: **68 pass, 0 fail**. Covers numerical reference fixtures, invalid inputs, stale-output clearing, examples, workspace persistence/export payloads, handoffs and the new navigation/manual checks.
- `npm run build:site`: succeeds. Build-generated output was kept out of the change.
- Calculator CI and Netlify preview passed for the visual-correction implementation commit `4b6dde045b22299bd0643a798370202db0b407a1`. Final evidence/help-link commit checks are reported in the PR status, rather than creating an endless documentation/CI commit cycle.
- Desktop light/dark: all eleven workspaces activated; DOM text-contrast checks found no remaining failures after the corrections. The check samples links, buttons, labels, paragraphs, headings, table cells, result labels/values and scientific key legends against solid rendered ancestor backgrounds. It is not a complete accessibility scanner.
- Narrow-frame calculator: eleven workspaces × two themes × 390/320px = **44 states**; no page overflow or detected text-contrast failure. The browser reserves a 15px scrollbar, giving 375/305px document content widths. This is real iframe viewport reflow, not a physical-phone test.
- Narrow manual: both themes at 390/320px; no page overflow or detected text-contrast failure. Wide tables scroll internally. All 24 anchors resolve; the inspected final section lands around 110px below the viewport top, clear of the site bar.
- Mobile site menu opens/closes; compact workspace selection changes the active panel. Guided worked example: 12 included rows, zero exclusions; difference −0.533333333 mm, 95% interval −0.751505539 to −0.315161127.
- Live smoke checks: scientific 2 + 3 = 5; one-sample t manual example p = 0.019654; raw-data example completes; SPC baseline/monitoring example completes; quality economics returns COQ 16,600 CAD, COPQ 14,700 CAD and adjusted reductions 5,900/6,300 CAD; matrix inverse, TVM payment −386.656030589 and program total 55 render. Shared math/program evaluations correctly invalidate a previous graph.
- Representative calculator/manual desktop and narrow screenshots are included. A full-page capture attempt timed out; this browser's viewport capture worked. Full-page screenshot evidence is therefore incomplete.

## Broader test findings and remaining limits

The full repository command was attempted with dependencies installed, but it is **not an all-green gate**. Its runner continued emitting jsdom warnings without clean completion and was stopped. Focused reruns establish these pre-existing failures on both the current checkout and pre-change commit `29a6619`:

1. `tests/pr170-final-browser-guards.test.js`: missing `test-bank-phase2-quality-assurance.js`.
2. `tests/second-pass-workflows.test.js`: missing `test-bank-account-sync.js`.
3. `tests/require-auth-gate.test.js`: the material-specification build test expects a `const authHead` source pattern that is not present.
4. Shared-controller audit: `assets/lessons/excel-formula-fluency/sprint/introduction.html` and `excel-sprint-certificate.html` lack the expected controller tags. The calculator and manual were also offenders before this update and are now corrected.

The relevant five-file baseline comparison returned 38 passes and the same three failures before/after. The shared-controller file returns 15 passes and one failure on the remaining Excel pages. Temporary public viewport-review HTML was removed after inspection; the reusable review fixture remains under this audit directory.

No claim is made that every combination of calculator inputs, every hover/focus state, physical Safari/iOS/Android, screen readers, or every WCAG criterion has been validated. Live blob-download delivery remains unverified; export payload tests pass. Existing numerical/method limits remain in the manual. Production has not been deployed and PR #236 remains for human review.

## Evidence

- `calculator-student-ui-observations.json`: structured contrast/width observations.
- `calculator-student-light.jpg`, `calculator-student-dark.jpg`: desktop entry.
- `calculator-student-mobile-light.jpg`, `calculator-student-mobile-dark.jpg`: 390px frame.
- `calculator-manual-light.jpg`, `calculator-manual-dark.jpg`: manual contents.
- `responsive-review.html`: review fixture; serve at the site origin with the tool pages to repeat viewport checks.

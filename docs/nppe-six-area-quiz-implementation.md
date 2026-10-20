# NPPE six-area Quick and Focused practice

Engineering implementation and QA record — 2026-10-19. These original practice questions are unofficial and not calibrated to the official NPPE scale. This update is limited to the authorized NPPE package in the open PR #301; it does not grant or publish learner entitlements.

## Six categories, derived from the actual question metadata

| Code | Area | Question's authored `sub` field |
|---|---|---|
| I | Professionalism | `nppe-professionalism` |
| II | Ethics | `nppe-ethics` |
| III | Professional Practice | `nppe-practice` |
| IV | Law | `nppe-law` |
| V | Professional Law | `nppe-professional-law` |
| VI | Regulation and Discipline | `nppe-discipline` |

Every NPPE question is sourced only from its selected author-owned bank and categorised by a matching `blueprint` Roman numeral, `area` metadata (if supplied), and `sub` code. A discrepancy fails closed instead of making up a new category. The category counters are computed from the *actual current questions* in the selected bank and do not rely on invented category targets. The two study-oriented modes use **scored** questions only. For Mock A–D, the ten author-designated simulated unscored questions remain part of the 110-question full mock but are **excluded from Quick and Focused practice**. They are not silently reclassified as scored.

## User flow

1. Select **ChatGPT** (Diagnostic, Learning, Mock A, Mock B), **Grok** (Mock C) or **Claude** (Mock D).
2. Select a question bank; it stays a hard boundary across all modes.
3. Select **Full Exam**, **Quick Quiz** or **Focused Quiz**.
4. For **Quick Quiz**, choose any single area or *All six areas* using the same native **Area** selector as the other certification simulators, then up to **10, 20, 30 or 50** scored questions, timed or untimed.
5. For **Focused Quiz**, choose **exactly one** of the six areas (the UI disables empty categories). Choose up to 10, 20, 30 or 50 questions and a timing option. Previously missed questions **within the same bank and area** are prioritised when the study-history module has them; remaining questions are randomly filled from that same area. No cross-bank mixing.
6. Start the quiz. Both modes enforce the existing signed-in, administrator-granted server authorization, question navigation, answer withholding and post-submission explanations. Untimed Full Exam, Quick Quiz and Focused Quiz NPPE practice inherit the same assisted Reveal Answer control as other certifications; a revealed scored question counts as incorrect and its navigation cell turns blue. Timed sessions do not permit answer reveal. The simulated unscored items remain excluded from the 100-point full mock score.
7. Results preserve the selected bank, quiz type and subject area. Quick/Focused scores are based only on questions actually served, never treated as a full Mock A–D raw/scaled score. Retake keeps the bank and practice mode, without pretending new questions have been generated.

**Timing:** Full Mocks A–D retain 110 questions and 150 minutes. Short timed practice uses the same nominal pace (150 minutes per 110 questions), rounded to seconds. Untimed remains available. Diagnostic and Learning retain their original full-mode question totals.

## Release safeguards

- No NPPE item authoring files, answer keys or extra bank content are copied to public shells or other certification packages.
- No changes to Netlify authorization, `can_access_exam`, Supabase data structures, RLS, grants or accounts.
- Existing exam source IDs, version pins, form ownership, author attribution and simulated scoring roles are preserved.
- Initial automated regression covers 610 questions across six authored banks, all six category identifiers, count integrity, score-only pool selection, timed Quick Quiz, five-question Focused Quiz, answer masking, per-category result summaries and fail-closed invalid-metadata behavior.
- Chromium/WebKit responsive and axe assessments are separate exact-commit CI checks; do not claim them passed until complete. Manual assistive technology, official psychometrics and independent legal review remain outside automated QA.

**Deployment:** PR #301 stays open and unmerged until the required GitHub code review and final CI; the production NPPE delivery is not modified by this feature branch.

## UI parity amendment (2026-10-19)

The owner requested NPPE match the established UpSkillSprint certification layout as closely as practical. The previous NPPE-specific mode tabs and large category button grid were replaced by **three stacked Full Exam, Quick Quiz and Focused Quiz cards**, using the shared `tb-mode`, `tb-mode-head`, `tb-mode-controls stacked`, `tb-fieldrow`, `tb-select`, `tb-counts`, `tb-seg` and `tb-mode-foot` styles. Both short modes provide a native **Area dropdown** containing the six NPPE blueprint categories, with Quick also offering All six areas. Category options show eligible scored-question counts. The selected bank is held constant by the author-set selector above the modes; no cross-bank Mixed option appears. Question-count options match other certification simulators (10, 20, 30, 50) and are capped at each area's actual scored available count. Full Mock A–D remains 110 questions and 150 minutes. The original item authoring banks and access controls are unchanged.

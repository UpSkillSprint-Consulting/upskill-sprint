# NPPE unofficial four-mock publication decision — 2026-10-19

**Owner instruction:** release Mock A and Mock B; rename the already-complete Grok Mock D to Mock C and Claude Mock E to Mock D. There will **not** be a new ChatGPT Mock C. This document supersedes earlier five-mock plans and voluntary independent-review-before-release holds. Publication is contingent on passing automated delivery checks and a successful deployment; **it does not constitute independent engineering, legal or psychometric validation.**

## Published form and author map

| Candidate-facing form | Author set | Canonical source bank | Question IDs | Scored / simulated unscored |
|---|---|---|---|---|
| Mock A | Set 1 — ChatGPT | `test-bank-nppe-mock-a-batch1.js` through batch11 | NPPE-171–280 | 100 / 10 |
| Mock B | Set 1 — ChatGPT | `test-bank-nppe-mock-b-batch1.js` through batch11 | NPPE-281–390 | 100 / 10 |
| Mock C | Set 2 — Grok | `test-bank-nppe-set2.js` (formerly presented as Mock D) | NPPE-501–610 | 100 / 10 |
| Mock D | Set 3 — Claude | `test-bank-nppe-set3.js` (formerly presented as Mock E) | NPPE-611–720 | 100 / 10 |

All four mock forms have 110 original multiple-choice questions and a 150-minute timed option. Learning and Diagnostic are separate. There is **no Mock E** and no empty Set 1 Mock C in the authorized candidate-facing catalog. Source author attribution and stable question IDs are preserved; protected runtime maps historical author-set labels into the new C/D form identifiers. The Set 2 and Set 3 source files and original question hashes are deliberately unchanged.

## Scope and claims

These are **unofficial UpSkillSprint study and exam-practice materials**. No affiliation, certification or endorsement from NPPE administrators, APEGS, Engineers Canada or any regulator is claimed. Internal editorial reviews and automated tests do not provide external professional certification or official psychometric equivalence. Candidate results are raw percentages of 100 scored answers; ten other roles are *simulated* unscored, not empirically field-trialled. **No raw pass mark, scaled-score conversion, pass prediction or guarantee is offered.**

The official NPPE website still identifies the 2017 blueprint as current on the date of the decision, but announces a pending review. Blueprint and Canadian legislation references may change. Known residual content risks (especially some dated legal propositions, categorical distractor language and uneven provisional difficulty) remain logged for subsequent maintenance; releasing the unofficial forms must not be represented as eliminating those risks.

## Access and security: remain mandatory

- Candidate delivery occurs inside the existing protected NPPE package through `/.netlify/functions/exam-content?exam=nppe`. Keep fresh signed-in user validation, current `can_access_exam` authorization and no-store headers.
- Publishing the single NPPE certification in `exam_catalog` **does not assign any learner or grant free/open access**. Administrator approval continues to control each account's NPPE entitlement, all of its released forms and revocation.
- Preserve Netlify private question packaging and exclude protected question files from the publicly staged shell, other certification packages and unrelated site assets.
- Do not add Supabase schema/tables, widen RLS or grant blanket access. The existing free-tier-friendly `exam_catalog` insertion is the only production data change needed.
- The repository and its pre-existing question/history files are public; the server-side permission endpoint is a *website access gate*, not a claim that historical GitHub source copies are secret.

## Remaining quality work (does not imply completion)

Independent legal/engineering review, empirical calibration, manual NVDA/VoiceOver confirmation and live production-account request–grant–practice–revoke evidence **remain incomplete**. Owner instruction removes independent review and pilot calibration as prerequisites for offering labelled unofficial practice, but does not transform the pending checks into passes. Any critical user-facing functionality or security failure found in CI must be corrected before live activation. Continue post-release improvement and collect genuine candidate data only with appropriate notice, permission and privacy protections.

## Operations and sign-off sequence

1. Validate published form catalog, counts, scoring, key separation, 150-minute timing, no active reveal, accessibility/keyboard automated tests, and release rules on exact branch head.
2. Run public-content audit and confirm non-NPPE exams remain unchanged.
3. Merge reviewed release branch, verify production Netlify deployment and its protected API. Do **not** publish the NPPE catalog row until a functioning production NPPE package is confirmed.
4. Publish or update `exam_catalog` NPPE row to `published`; do not change grant tables. Recheck the public directory (8 published / 1 coming soon), anonymous denial, and approved-user flow where authorized.
5. Record the production commit/deploy and any unresolved test limitations; do not report launch as successful unless the production state was observed.

**This is a documented owner release direction, not professional item approval or a claim of measured calibration.**

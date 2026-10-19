# Mock B — final answer-rank, editorial and functional QA

**Audit date:** October 18, 2026. **Target:** draft PR #301, branch `codex/nppe-three-set-architecture`, Mock B form `set-1-mock-b`. **Disposition: AUTHORING COMPLETE; RELEASE HOLD RETAINED.**

This report follows the comprehensive whole-form audit and the answer-length remediation work. It distinguishes the revised canonical question content and automated fixture outcomes from external expert validation, live production-account testing and real candidate calibration. All 110 Mock B questions remain original ChatGPT Set 1 educational practice content, not recalled official NPPE questions.

## Step 1 — answer-length and distractor remediation

The first audit identified a correct-answer length cue in 104 of 110 questions. An intermediate correction produced a reverse length cue (91 shortest) and then a second-shortest cue (102 second-shortest). This pass used individually reviewed alternatives from the prior source version where appropriate, authored concise but meaningful alternatives, and checked the resulting position before committing each batch.

**Current committed key-length rank distribution:**

| Rank of correct option by character length, shortest to longest | Items |
|---|---:|
| Shortest | **25** |
| Second shortest | **25** |
| Third shortest | **30** |
| Longest | **30** |
| **Total** | **110** |

All 110 items were measured from current canonical sources, with the distribution asserted in CI. Correct answers remain the same substantive decisions, and the corresponding option-rationale mapping remains intact. The key index was not arbitrarily moved. Each changed item has incremented `version` and dated editor metadata. An initial equal-length tie in NPPE-380 was resolved by clarifying a distractor without changing its meaning or answer key. The final source has no keyed option-length ties; independent review of distractor plausibility still remains required.

The final [110-row option-length audit ledger](nppe-mock-b-option-length-review-ledger.csv) contains item ID, blueprint, key position, all relevant lengths, observed rank, tie flag, versioned revision status, and independent editorial follow-up. Rank balancing is necessary but **not sufficient** for content validity.

### Other option-pattern risk — still OPEN

The final options contain categorical language (such as *always, never, every, only,* or *automatically*) in **142/330 distractors** versus **7/110 keyed choices**. Eight items have such wording in all three wrong options but not in the keyed choice: **291, 319, 322, 329, 354, 362, 372 and 383**. This can make distractors easier to eliminate independently of subject knowledge. The automated whole-form audit now emits a categorical-language cue warning. Reviewers must make distractors plausible without making them accidentally correct; blanket removal of all categorical terms is also inappropriate because universal legal claims can legitimately be tested.

## Step 2 — comprehensive editorial and legal/source reassessment

**Verified by structural/content scripts:**
- All IDs NPPE-281–390 present exactly once; all eleven batches loaded in order, no borrow from any other bank.
- 100 scored + ten **simulated** unscored; the ten unscored roles are distributed within the form and hidden from active candidates.
- Scored domain allocation **I 8, II 20, III 30, IV 26, V 8, VI 8** fits the [currently published NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/), identified on the official site as the *2017 blueprint* as of the audit date. Every one of its 40 numbered topics has at least one scored item, which does not certify mastery or full detail-level coverage.
- Every item contains four distinct options, one proposed best answer, four mapped option-specific explanations, a learning objective, jurisdiction, source title, locator and HTTPS link, error trap and revision metadata.
- Exact normalized Mock B stem duplicates across the other **500 NPPE items** were not found in the automated cross-bank pass. A lexical similarity shortlist has been triaged, and four repeatedly assessed decisions were replaced by new scenarios (NPPE-309, 322, 339 and 362).

**Editorial flags / remaining decisions:**
- **Provisional difficulty:** 104 medium, 6 easy, **zero hard**; **cognition:** 69 application, 33 analysis, 8 understanding. These are subjective author labels, not field-calibrated difficulty; do not cosmetically promote items to 'hard'.
- **Correct-option letters:** A18, B25, C32, D35. No statement of official key distribution is implied.
- **Categorical distractor cue:** as quantified above, requires independent item-level review.
- **Source currency and legal review:** qualified Canadian-law review remains necessary for Ontario construction liens/title and discipline, Québec civil law, federal Criminal Code, copyright, Fisheries Act, Indigenous consultation case law, province-specific firm registration, CPD, and privacy. Engineers Canada principles are national professional guidance, not uniformly binding provincial law. Reference URLs' presence does not establish that every page was successfully retrieved and independently reviewed.
- **Potential semantic overlap and plausibility:** no automated lexical scan can replace expert reading of all 110 stems, answer decisions and all 330 distractors; review legal ambiguity after shortening and shortening of incorrect choices for accidental truth.

The authoritative legal/blueprint checkpoints reviewed include the [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) and [APEGS CPD Program Basics](https://www.apegs.ca/cpd/cpd-program/cpd-program-basics). Independent expertise and dated primary-source dispositions remain release gates.

## Step 3 — functional, responsive and accessibility QA

The updated automated suite includes a complete Mock B **held-form fixture** for the actual 110-item protected delivery packet:
- Without the fixture, real delivered Mock B and Mock A remain `releaseHold:true` and disabled. A completed bank is **not** authorization to launch.
- Isolated in-memory test-only override exercises Mock B timed and untimed, 150-minute display, answer flagging and keyboard selection, active-answer-reveal denial, correct selection and grading.
- The numerator/denominator exclude all ten simulated unscored items, while post-submission review supports all 110 question cards and **440 option-specific rationales**.
- Altering a scored role in a test-only fixture invalidates the form's 100/10 completeness and must fail closed.
- Protected build checks confirm question stems do not appear in the public shell or unrelated certification exam packages. **Public Git history remains readable**, so this is a delivery boundary, not source confidentiality.
- The Chromium and WebKit browser audit now includes Mock B at **320 px, 390 px and 1440 px** in **light and dark themes**, with automated WCAG 2 A/AA and 2.1 A/AA axe checks, keyboard controls, responsive overflow/header checks, review-card inspection and release-hold restoration. These are synthetic fixture tests, not real user-account tests.

**CI validity rule:** record the exact-head workflow results. An authored test is not a passing test until GitHub Actions returns a successful conclusion. Manual screen-reader, assistive technology, colour-blind perceptual differentiation and full production-account approval/revocation remain unresolved unless a separate reviewer records evidence. Browser fixture authentication is not proof of a live production sign-in.

## Release gates and recommendation

**DO NOT MERGE OR PUBLISH.** PR #301 must stay **draft/unmerged**. Keep both Mock A and Mock B `releaseHold:true`. Do not deploy private content, run production migration, grant learner practice access or change premium permissions.

Before release:
1. Resolve the categorical-language distractor cue with an **independent item-by-item editorial and SME assessment**, reviewing distractor plausibility and precise rationale mapping.
2. Complete an independent qualified Canadian-law and engineering/geoscience review of all relevant items, with primary-source effective dates, versioned corrections and signed dispositions.
3. Complete manual accessibility and actual authorized production-account request/approval/practice/revocation tests.
4. Perform consented candidate pilot testing and empirical calibration; only then interpret item difficulty, discrimination, and reliability. Obtain explicit publication authorization afterward.

**Status:** Steps 1–3 implemented to the extent of author editing and available automated tests; release gates explicitly remain open.

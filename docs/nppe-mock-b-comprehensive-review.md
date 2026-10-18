# Mock B comprehensive whole-form editorial and functional QA

**Audit date:** 2026-10-18. **Repository:** UpSkillSprint, draft PR #301, `codex/nppe-three-set-architecture`. **Decision: AUTHORING COMPLETE; RELEASE HELD.**

## Scope, evidence and limits

This is an author-led editorial, source, structural and automated functional audit of **all 110 original ChatGPT Set 1 Mock B questions, NPPE-281–390** against Diagnostic (50), Learning (120), Mock A (110), Grok Mock D (110) and Claude Mock E (110), a total of **500 other authored NPPE objects**. The `scripts/nppe-mock-b-whole-form-audit.cjs` script loads all 610 canonical items, verifies source/provenance/role metadata, checks exact normalized stem duplication, and ranks lexical-similarity candidates. Lexical screening is a *triage aid*, not a complete semantic plagiarism or one-best-answer review. The findings below distinguish verified code conditions, editor decisions and unresolved qualified reviews. The public Git history remains readable on the free account; protected delivery is not a source-privacy guarantee.

Official [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) still labels the **2017 blueprint current** as of this audit date; review-launch language on the website is not proof a new exam specification has taken effect. Official weights are domain ranges, not a mandate for identical per-form topic counts.

## Form and blueprint allocation

| Domain | Scored | Simulated unscored | Total | Published range for scored domain |
|---|---:|---:|---:|---|
| I Professionalism | 8 | 1 | 9 | 7–10 |
| II Ethics | 20 | 2 | 22 | 17–21 |
| III Professional Practice | 30 | 3 | 33 | 27–32 |
| IV Law for Professional Practice | 26 | 2 | 28 | 23–28 |
| V Professional Law | 8 | 1 | 9 | 7–10 |
| VI Regulation and Discipline | 8 | 1 | 9 | 7–10 |
| **Total** | **100** | **10** | **110** | |

All **40 numbered blueprint topics have at least one scored primary item** in the current ledger. This is not evidence of exhaustive bullet-level knowledge coverage or empirical NPPE equivalence. Every question has four options, four option-specific rationales, stable IDs, editor-classified difficulty/cognitive level, a proposed key, source metadata and an explicit jurisdiction statement.

### Material scoring-role correction — FIXED AND VERSIONED

Originally **nine of ten simulated-unscored positions appeared in Batch 11**. That conspicuous end concentration can cue the simulation and distort attempt interpretation. Six same-domain role pairs were exchanged, preserving 100 scored / 10 simulated unscored, all six domain counts, all 40 primary scored topics and the original question text.

| Formerly scored → simulated unscored | Formerly simulated unscored → scored | Domain |
|---|---|---|
| NPPE-282 | NPPE-384 | II |
| NPPE-296 | NPPE-381 | V |
| NPPE-320 | NPPE-385 | III |
| NPPE-337 | NPPE-387 | III |
| NPPE-349 | NPPE-388 | II |
| NPPE-355 | NPPE-380 | I |

The **final ten simulated-unscored IDs** are: **282, 296, 320, 337, 349, 355, 382, 386, 389, 390**. Reassigned items have `version:2` and dated editorial provenance. The current 110-row CSV is the authoritative authoring ledger; historical batch summaries have dated amendments. No item has been genuinely field tested, and learners must not see these roles during an attempt.

## Cross-bank originality and distractor audit

The automated scan over all 610 objects found **no exact normalized Mock B stem duplication** in its passing baseline. It flagged five lexical-similarity pairs for qualitative review:

| Mock B | Other bank | Editorial disposition |
|---|---|---|
| 309 | Diagnostic 030 | **Rewritten:** firm PPMP implementation rather than audit-selection misunderstanding |
| 322 | Learning 070 | **Rewritten:** distinct online Scope of Practice entry rather than the same credit/category deficit scenario |
| 362 | Learning 097 | **Rewritten:** scope of a partial moral-rights waiver rather than assignment's effect on moral rights |
| 339 | Learning 055 | **Rewritten:** constitutional federal criminal-law / municipal-bylaw powers rather than the same private-employer Charter question |
| 370 | Learning 070 | **Retained provisionally:** CPD plan/activity reporting after meeting credit totals, distinct from Learning 070's deficient CPD mix; independent editorial reviewer must confirm adequate discrimination |

All four replaced items have `version:2`, new scenarios, four mapped rationales and supporting source changes. There remain other syllabus-wide conceptual overlaps, as expected for a fixed blueprint; the automated lexical scan cannot exclude subtle shared controlling logic. Qualified external reviewers must validate one defensible best answer for each question, the credibility of all three distractors, option-length bias and cross-form originality.

**Critical OPEN RELEASE BLOCKER — answer-option length cue.** The first full-form audit found the keyed option was tied for or was the longest on **104 of 110 items**. This is a profound systematic cue that can reward answer-testwiseness rather than NPPE competence, even if all keyed positions and explanations are logically defensible. The automated audit preserves `longestKey` statistics and a nonblocking warning while the form remains held. **Do not release or interpret candidate score outcomes until keyed-answer length bias has been removed through item-level rewrites, distractor-quality checking, and a fresh audit.** Mechanical padding of wrong alternatives is not an acceptable substitute for editorially credible distractors. Updated exact-head figures must be taken from the CI audit after content revisions.

**Second OPEN RELEASE BLOCKER — provisional difficulty.** Initial distribution: 102 medium, 8 easy, **zero hard**, with 67 application, 33 analysis, 10 understanding. Subsequent four cross-bank revisions alter those provisional counts; retrieve exact latest values from the audit's JSON rather than treating the initial snapshot as current. No difficulty labels should be inflated to meet a target. Item difficulty/discrimination needs qualified SME judgment and real candidate pilot data.

## Legal and source-accuracy checks

- **FIXED:** NPPE-347's *Clements v. Clements*, 2012 SCC 32, previously pointed to an unrelated Supreme Court item number (9999). Updated to the [actual SCC case item 9992](https://decisions.scc-csc.ca/scc-csc/scc-csc/en/item/9992/index.do?iframe=true&site_preference=normal). The causation distinction remains subject to qualified review.
- **FIXED:** NPPE-288's counteroffer authority originally referred to a settlement-procedure judgment not directly controlling an ordinary service contract. Replaced with the Canadian federal government's published general contract-law overview explaining qualified acceptance and counteroffers. It is educational background, **not primary judicial authority**.
- **FIXED:** NPPE-354 cited the federal Canada Labour Code as background for a Saskatchewan municipal collective agreement. Replaced with [Saskatchewan government collective-bargaining guidance](https://www.saskatchewan.ca/business/hire-train-and-manage-employees/collective-bargaining-and-mediation). Exact seniority/qualification conditions are expressly stipulated, not claimed to follow universally from legislation.
- **STRENGTHENED:** NPPE-324 now cites Engineers Canada's ethics guidance beyond the blueprint; NPPE-345 cites EGBC firm-practice authorization as an example of province-specific permits; NPPE-355 cites Geoscientists Canada about national/provincial regulatory responsibilities.
- **SPOT-CHECKED:** Ontario [Construction Act s.31](https://www.ontario.ca/laws/statute/90c30) confirms the 60-day contractor lien preservation framework subject to statutory alternative events/conditions; the federal [Copyright Act s.14.1](https://laws-lois.justice.gc.ca/eng/acts/C-42/section-14.1.html) permits limited moral-rights waivers; [APEGS CPD Programme Basics](https://www.apegs.ca/cpd/cpd-program/cpd-program-basics) lists separate scope, plan, categories, ethics and credit requirements. These verified sources support the particular hypothetical distinctions, **not a complete legal certification**.
- **OPEN:** Precise case-law links/paragraphs and contemporary judicial treatment for NPPE-341 and other case-derived questions; exact statutory effective dates and jurisdictional exceptions; privacy applicability; possible changes in regulator CPD/firm standards; and replacing background resources that only weakly establish a technical legal proposition. A qualified Canadian-law specialist must review every legally scored/unscored item, not merely those with flagged links.

All reference URLs in item metadata are required by automated checks to be syntactically valid HTTPS and to have nonempty title/locator, but **this does not amount to a live successful HTTP fetch for every link**. Sourced author reasoning is not an independent legal or engineering assessment.

## Functional, responsive and accessibility QA

The NPPE protected package is built from separate eleven-batch Mock B authoring files and wired through the existing registrar. The form catalog remains `releaseHold:true`. A fully populated bank **cannot be launched solely because 110 objects exist**. The registrar still rejects wrong ownership/target, explicit release and conflicting reloads. No fallback to Diagnostic, Learning, Mock A, Grok Mock D or Claude Mock E is allowed. Private-delivery regression checks confirm stems are excluded from the public loading shell and other-exam JSON packages; **GitHub public history is not private**.

Batch 11 and assessment-policy tests additionally check 100/10 scoring and diagnostic/raw score denominators, hiding experimental roles in the attempt UI, denying active-mock answer reveal in both timed and untimed modes, supporting post-submission full rationale review, and testing the held catalog via isolated in-memory fixture overrides. These fixtures **do not change product access**.

NPPE visual/browser workflows cover Chromium and WebKit at mobile (320, 390 px) and desktop (1440 px), in both light and dark theme, plus automated accessibility signals. Prior browser passes apply **only to their respective commits**; check the latest-head run before closing automated QA. **Manual keyboard navigation, screen-reader/assistive-technology testing, colour-blind differentiation, real account grant/revoke workflow and production sign-in remain unverified** unless separate recorded human evidence is added.

## Decision and next required work

**Mock B is authoring complete and structurally integrated, but explicitly NOT RELEASE READY.** The answer-length cue alone is a critical no-go for publication; source/legal expert approval, SME review, manual accessibility and empirical calibration are also missing.

1. Conduct item-by-item distractor and keyed-option-length revision (without arbitrary padding); re-audit lexical/cognitive cues, credible alternatives, scenario logic and explanations across all 110 questions.
2. Obtain independent engineering/geoscience and qualified Canadian-law reviewer dispositions with locators, item-versioned fixes and reviewer sign-off.
3. Run manual accessibility plus approved user-account request/grant/attempt/revocation, then pilot/calibrate with consented candidate responses.
4. Require explicit release authorization only after all gates pass. Keep **PR #301 OPEN/DRAFT**, both **Mock A and Mock B release-held**, no production deploy, no permissions or database migration, and preserve Grok Mock D and Claude Mock E.

The audit script and tests run in GitHub Actions; **the exact final-head CI conclusion must be recorded before calling automated QA passed**.

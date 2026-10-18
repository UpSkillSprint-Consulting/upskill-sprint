# Mock B Batch 1 — NPPE-281–290

**Authoring:** 2026-10-18. **Status:** ten original author/editor-reviewed draft items; independent professional/legal review and field calibration pending. **Mock B 10/110, release-held, not launchable.** The document records editorial assessments, not external reviewer approval.

## Blueprint and decisions

| ID | Topic | Core decision / distinguishing fact | Key index (0-based) | Provisional cognition |
|---|---|---|---:|---|
| 281 | I.1 | Sponsor veto over regulatory complaints compromises self-regulatory independence | 1 | Analysis |
| 282 | II.1 | A customary practice cannot defeat safety reporting and ethical duties | 3 | Analysis |
| 283 | III.1 | Validate changed third-party software assumptions against project data | 0 | Analysis |
| 284 | IV.1 | Québec private contract dispute begins from Civil Code tradition | 2 | Understanding |
| 285 | V.1 | Engineers Canada information is not a provincial practice licence | 3 | Application |
| 286 | VI.1 | Ontario complaint does not automatically constitute a discipline finding | 0 | Understanding |
| 287 | III.2 | Preserve relevant groundwater data and provide accurate client reporting | 1 | Application |
| 288 | IV.2 | Materially revised fee is a counterproposal, not unqualified acceptance | 2 | Application |
| 289 | II.2 | Rights-based objection to unequal emergency-warning access | 1 | Application |
| 290 | III.3 | Obtain specialist geoscience input before finalizing dependent design | 3 | Application |

**Allocated roles:** 10 scored, zero simulated unscored in Batch 1. Whole-form planning reserves another 90 scored + 10 simulated unscored across Batches 2–11; this batch alone is not a valid mock.

**Answer positions:** A 2, B 3, C 2, D 3. Difficulty: 2 easy, 8 medium (provisional). Cognitive: 2 understanding, 5 application, 3 analysis. No hard item is assigned merely to achieve a percentage target.

## Source verification and limitations

- [NPPE published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/), checked 2026-10-18: current website calls the 2017 specifications current while announcing a review. Topic references in every item correspond to its numbered section.
- [Engineers Canada, Guideline on the code of ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics): directly checked as national nonbinding guidance on integrity, public welfare, competence and accountability. Supports I.1, II.1, III.1, V.1, III.2, II.2 and III.3 at general-principle level, *not* statutory licence details.
- [Engineers Canada, Direct supervision](https://engineerscanada.ca/guidelines-and-papers/public-guideline-direct-supervision): directly checked, including scrutiny of supervised outputs and competence. Used for III.1 and III.3; the specific software/vendor and geoscience case facts are explicitly hypothetical.
- [Justice Canada, Where our legal system comes from](https://www.justice.gc.ca/eng/csj-sjc/just/03.html): directly retrieved official explanation of common-law and Quebec civil-law traditions. Supports IV.1; does not replace reading the Civil Code when analysing a specific legal dispute.
- [Ontario Professional Engineers Act](https://www.ontario.ca/laws/statute/90p28), ss. 24, 27–30: official indexed statutory text supports distinction between complaints and disciplinary adjudication. Used for VI.1; independent legal review must confirm currency and precise application.
- **IV.2:** [Scanlon v. Standish, 2002 CanLII 20549 (ON CA)](https://www.canlii.org/en/on/onca/doc/2002/2002canlii20549/2002canlii20549.html), para. 22 is referenced in an indexed procedural-law summary. Original full judgment was **not freshly read in this pass**. Mark case-text verification and independent legal review pending; do not use an international goods-sales convention as the governing rule for this domestic professional service agreement.

Each item carries a source title, type, URL and locator. No legal claim is certified by a qualified independent reviewer. Provincial variation, factual stipulations, legislative effective dates and source retrieval scope must be reassessed in a formal legal gate before release.

## Editorial QA

All ten items have a distinct fact pattern, four unique alternatives, one proposed defensible answer, four tailored explanations, an explicit learning objective, jurisdiction, topic, family, key point and common-error description. No two items in this batch share the same scenario facts. The topics recur elsewhere in the NPPE syllabus; thematic overlap alone is not duplication. Cross-bank semantic overlap review remains a **whole-form gate** and is not claimed complete from this brief editorial pass.

Review notes requiring continued attention:
- 281 self-regulation is conceptual, while its hypothetical sponsor-veto scenario should be confirmed as plausible rather than an allegation about any actual regulator.
- 284 and 286 test foundational distinctions (easy provisionally), not deep legal analysis.
- 285 deliberately avoids claiming that a national organization can itself authorize provincial practice.
- 288 is common-law Ontario-specific; independent legal reviewer must inspect the original cited decision before approving it.
- 289 is a rights-theory item, not an assertion about specific enacted accessibility legislation.
- 290 illustrates interdisciplinary work; specialist review should check the division of professional accountability.

## Delivery and release controls

Canonical IDs `nppe:set-1:mock-b:281` through `290`; `authorSet:1`; `version:1`; `form:set-1-mock-b`; `releaseStatus:held`. Protected build includes the Batch 1 module only in the NPPE package, ahead of form registration. An idempotent registrar refuses an unheld, wrong-owner or wrong-target catalog and refuses conflicting reloads. The existing full-form predicate continues to require 110 items and `releaseHold:true` independently blocks the start path. Answers cannot be revealed during an active mock. No production grant, database change, deployment or merge is authorized.

**Tests:** `tests/nppe-mock-b-batch1.test.js` and updated readiness tests are attached to NPPE validation CI. Passing automated QA is distinct from independent content/legal sign-off, manual accessibility, field calibration and actual production-account verification. Record exact-head CI outcome after completion; do not substitute a previous head's checks.

**Next:** NPPE-291–300, Mock B Batch 2. Preserve the reserved blueprint allocation unless a reasoned versioned reassignment is documented.

# Mock B Batch 7 — NPPE-341–350: editorial and source audit

**Date:** 2026-10-18. **Status:** 10 original author/editor-drafted items, **70/110** Mock B questions authored; all 70 currently provisionally scored. Mock B is incomplete and **release-held**. This document is not independent qualified human engineering, geoscience or Canadian-law review.

## Item-specific editorial record

| ID | Blueprint | Proposed key | Competency decision | Source status and reviewer follow-up |
|---|---|---|---|---|
| 341 | IV.2 | D | Separates a confidentiality obligation in a letter of intent from an unsigned, expressly nonbinding services bargain | Ontario contract formation; Ontario CA *Bawitko Investments v. Kernels Popcorn* cited as case reference, **direct decision and precise locator pending qualified legal verification** |
| 342 | II.1 | B | Customary thresholds for reporting a developing community road hazard do not displace public-welfare duties | Engineers Canada national Code of Ethics guideline, principles 1, 4, 9–10; advisory only |
| 343 | III.9 | C | Preserve evidence and escalate an unresolved failed hoist safety device promptly through responsible channels | Engineers Canada principles 1, 9–10; reporting channels vary by statute |
| 344 | I.2 | D | Compare potable-water restoration priorities by criticality, substitutes and health effects rather than headcount alone | Engineers Canada principle 1; revised from an initial bridge/dialysis access scenario to reduce overlap with Mock A |
| 345 | V.2 | A | Distinguishes licensed individual's mobility from stipulated destination-jurisdiction firm practice permit | Official NPPE V.2 blueprint, especially permits/certificates of authorization for firms; destination province must be specified in a real legal question |
| 346 | VI.2 | D | BC reactive individual practice review differs from proactive randomly selected audit | EGBC [Individual Practice Review](https://www.egbc.ca/registrants/practice-resources/individual-practice-review); regulator text inspected |
| 347 | IV.3 | B | Causation requires linking negligence to the claimed loss; stipulated independent surge negates it | SCC *Clements v. Clements*, 2012 SCC 32; exact official link/paragraph locator requires primary review |
| 348 | III.10 | C | Distinguishes three observed groundwater values from unsupported ten-year projected precision | Engineers Canada professional statements: facts/assumptions/opinions, principle 4 |
| 349 | II.2 | B | Ethical egoism is distinguished from utilitarian aggregate welfare, duty-based reasoning and virtue ethics | Stanford Encyclopedia of Philosophy, *Egoism*, §1; replaced initially similar deontological scenario |
| 350 | III.1 | D | Foreign design's missing frost assumption requires local verification before engineering approval | Engineers Canada principles 2, 6 and 8; no jurisdiction-specific code version is asserted |

**Answer distribution:** A1/B3/C2/D4. **Provisional cognition:** understanding 2, application 5, analysis 3. **Provisional difficulty:** easy 2, medium 8, hard 0. Do not treat these as empirical item statistics or inflate categories for aesthetic balance.

## Source checks and limits

The [official published 2017 NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) remains labelled current as of 2026-10-18 despite a proposed revision. It explicitly lists IV.2 contracts and VI.2 individual practice reviews among other numbered topics. The [Engineers Canada ethics guideline](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics) sets out pertinent national principles and **expressly disclaims being a binding legal standard**. EGBC's individual practice review source describes risk-triggered reactive reviews separately from proactive audits. These official online pages were read during preparation.

Case-law URLs and paragraph locators for NPPE-341 and NPPE-347 are provisional item source metadata pending qualified reviewer examination of complete, authoritative judgments. Do not claim the linked judgment was independently signed off or that a case holding applies without considering context. The V.2 firm-permit item uses **expressly stipulated hypothetical law** rather than asserting identical corporate-permit rules across provinces; a final legal reviewer must determine whether to name a real regulator and current requirement before release.

## Editorial originality and release controls

All ten items include distinct stems, four options, four option-specific rationales, zero-based answer index, source titles/locators, blueprint, jurisdictional statement, learning objective, question family, key point, trap, version 1, ChatGPT author and `releaseStatus:'held'`. The revised NPPE-344 tests water-service restoration rather than reusing Mock A's bridge/dialysis maintenance scenario. NPPE-349 tests ethical egoism rather than repeat prior Mock B duty reasoning. The complete 70-item bank still requires full cross-bank semantic overlap and answer-cue screening.

`test-bank-nppe-mock-b-batch7.js` appends after 1–6, with idempotent reload and conflicting-predecessor checks. The protected NPPE package includes the batch before runtime registration. The full-form count remains 70/110 and **releaseHold:true** is preserved, so starting Mock B remains disabled. No content fallback from Mock A or another bank is authorized. `tests/nppe-mock-b-batch7.test.js` covers content identity, predecessor preservation, loading order, hold and public/cross-exam leakage. New exact-head GitHub Actions must be verified separately.

**Release gates remaining:** independent SME/legal approval, precise primary-law currency, manual accessibility, full-form audit, consented empirical calibration, authorized production-account checks and explicit release authorization.

**Next authoring:** Mock B Batch 8 NPPE-351–360.

## Whole-form QA scoring-role amendment — 2026-10-18

NPPE-349 is now simulated unscored (version 2), swapped with scored NPPE-388 in Domain II.

The historical batch allocation text above is retained as an authoring record where inconsistent; this amendment and the current 110-row allocation ledger control. Source/legal and empirical release gates are unaffected.

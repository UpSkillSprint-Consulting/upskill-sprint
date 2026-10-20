# Mock B Batch 4 — NPPE-311–320 editorial and source audit

**Authoring date:** 2026-10-18. **Status:** preliminary author/editor audit only. Mock B now contains **40/110** original questions, all 40 provisionally scored; no simulated unscored items authored yet. The incomplete form is **release-held**. No independent qualified Canadian-law/engineering SME sign-off or empirical item calibration has occurred.

## Item-by-item dispositions

| ID | Blueprint | Key index | Reasoning assessed | Primary evidence and limits |
|---|---|---:|---|---|
| 311 | III.9 | 2 (C) | Document verified vessel hazard and escalate overruled safety concern through proper channels | Engineers Canada Code of Ethics, national nonbinding professional guideline. Actual reportability depends on jurisdiction |
| 312 | IV.8 | 0 (A) | Federal Court expert reports adverse data impartially despite retaining party's preference | Federal Courts Rules rule 52.2 and Schedule, paras. 1–4; current federal primary regulation |
| 313 | II.3 | 3 (D) | Refuse to endorse unsupported advertised bridge load rating and explain consequences | Engineers Canada code, truthfulness and public welfare guidance; no specific regulator sanction asserted |
| 314 | III.10 | 1 (B) | Translate and test emergency-warning messages for audiences needing alternate languages/formats | Accessibility Standards Canada CAN-ASC-3.1:2025, audience-centred plain language; do not generalize statute-specific bilingual duties |
| 315 | IV.9 | 2 (C) | Ontario Construction Act basic holdback on $240,000 of supplied services is $24,000 | Ontario Construction Act s. 22(1), consolidated 2026 text (10%); any legal exemptions/security alternatives excluded by stipulation |
| 316 | III.1 | 1 (B) | Verify foreign vendor pressure-case calculations against required local code | Engineers Canada code of ethics, competence and accountability; hypothetical contract sets applicable code |
| 317 | II.4 | 0 (A) | Issue fair and evidence-based third-party technical review despite pressure to exaggerate | Engineers Canada code, fairness and objectivity; hypothetical client conduct |
| 318 | IV.10 | 3 (D) | Treaty ratification does not itself create an enforceable provincial engineering licence | Justice Canada treaty dualism explanation; Canadian implementation nuances reserved for independent legal review |
| 319 | I.4 | 2 (C) | Hydrogeological mapping can improve social/economic value of water infrastructure | Engineers Canada sustainable-development national guideline, especially public-good and long-term value |
| 320 | III.2 | 2 (C) | Evaluate authorization, minimization and third-party safeguards for client-linked worker data | Office of Privacy Commissioner guidance (September 2026); applicability of PIPEDA and provincial privacy laws requires specific review |

**Keys:** A2/B2/C4/D2. **Provisional cognitive:** analysis 5 (311,314,316,318,320); application 5 (312,313,315,317,319). **Provisional difficulty:** 10 medium, 0 hard, 0 easy. These labels are editorial only. Do not change labels for cosmetic distribution targets.

## Source-review evidence

The published [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) identifies the **2017** version as current on October 18, 2026, notwithstanding its notice of a future review. Every item has one relevant numbered primary blueprint topic and an additional proposition-bearing source with title, source type, locator, HTTPS URL and jurisdiction assumptions.

- [Federal Courts Rules](https://laws-lois.justice.gc.ca/eng/regulations/SOR-98-106/FullText.html), rule 52.2 and Schedule: published primary source supports the impartial overriding duty, independent expert opinions, material data and qualifications in item 312.
- [Ontario Construction Act](https://www.ontario.ca/laws/statute/90c30), s.22(1): current text explicitly requires ten per cent basic holdback of services/materials as actually supplied; the specified 240,000 × 0.10 = 24,000. The legal reviewer must verify the applicable version and any factual exceptions during sign-off.
- [Justice Canada treaty implementation overview](https://canada.justice.gc.ca/eng/rp-pr/fl-lf/divorce/crc-crde/conv2a.html): official government legal background says executive ratification of treaties does not alone amend domestic law. This overview concerns a particular convention; qualified counsel must review the broader proposition as applied to the hypothetical licensing treaty.
- [Accessibility Standards Canada, CAN-ASC-3.1:2025 Plain Language](https://accessible.canada.ca/standards-and-technical-guides/standards-and-technical-guides-database/can-asc-312025-plain-language): intended-audience usability, language and accessible communications are the pedagogical focus of item 314. The standard is not presented as automatically binding for every municipality.
- [Engineers Canada, Guideline on the code of ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics) and [National guideline on sustainable development](https://engineerscanada.ca/guidelines-and-papers/national-guideline-on-sustainable-development-and-environmental-stewardship-for-professional-engineers): nonbinding national professional context, not legislative commands.
- [OPC guidance on assessing third-party service providers](https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/appropriate-handling-of-personal-information/gd_third-party_202609/): published September 2026; provider vetting, organizational accountability and comparable protection. Exact privacy law applicability still requires a jurisdiction- and industry-specific analysis.

The legally focused items remain **pending independent Canadian-law validation**. Source retrieval, author reading and test validation are separate from qualified SME review. No fabricated legal quotation or official NPPE question is used.

## Editorial and integration findings

Each of the ten unique scenarios has four distinct alternatives, four mapped option rationales, one proposed defensible key, learning objective, key point, common trap, jurisdiction and source locator. IV.9 specifically samples **construction holdback**, distinct from Mock A's earlier surety focus; IV.8 covers expert impartiality rather than partisan service; IV.10 targets Canadian treaty implementation; III.10 addresses communication accessibility in a multilingual public-warning context.

Batch 4 uses IDs `nppe:set-1:mock-b:311`–`320`, authorSet 1, version 1, `releaseStatus:'held'`. The protected NPPE package loads Batch 4 after Batches 1–3. It must remain under `releaseHold:true` and fails full-form completeness at 40/110; no question bank fallback is permitted. The protected loader, item validation and non-NPPE leakage checks are included in `tests/nppe-mock-b-batch4.test.js` and the NPPE CI workflow.

## Outstanding gates

1. Exact-head GitHub Actions and Chromium/WebKit responsive/browser verification; record successes and investigate failures, never inherit previous-head green status.
2. Whole-form originality, cue/overlap and content review against the other 500 question objects when 110/110.
3. Independent engineering/geoscience and Canadian-law review of all items.
4. Manual assistive-technology accessibility, candidate field trial, psychometric calibration, production-account authorization check and explicit release decision.

**Next authoring slot:** Mock B Batch 5, NPPE-321–330, when Batch 4 CI is confirmed.

## Whole-form QA scoring-role amendment — 2026-10-18

NPPE-320 is now simulated unscored (version 2), swapped with scored NPPE-385 in Domain III.

The historical batch allocation text above is retained as an authoring record where inconsistent; this amendment and the current 110-row allocation ledger control. Source/legal and empirical release gates are unaffected.

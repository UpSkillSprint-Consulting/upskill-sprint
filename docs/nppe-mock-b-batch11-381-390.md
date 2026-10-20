# Mock B Batch 11 — NPPE-381–390 final authoring audit

**Authored:** October 18, 2026. **Status:** all 110 original Mock B items are authored, but the form is **release-held** and remains **unapproved for learner attempts**. This is preliminary AI author/editor review, NOT independent engineering/geoscience or Canadian legal SME approval, actual candidate calibration, or production authorization.

## Final batch item register

| ID | Blueprint | Proposed key | Role | Distinct decision and source basis |
|---|---|---|---|---|
| NPPE-381 | V.1 | B | scored | Competency assessment completion is different from issuance of provincial practice authorization; Engineers Canada regulator/licensing FAQ |
| NPPE-382 | VI.1 | D | simulated unscored | Fair complaints procedure and no prejudgment before a statutory finding; Ontario Professional Engineers Act, sections 24, 27 and 30 |
| NPPE-383 | IV.12 | C | **scored** | Criminal Code s.217.1 work-direction duty does not alone establish criminal negligence under s.219; both current federal provisions |
| NPPE-384 | II.1 | A | scored | Customary overwriting of acceptance-test failures breaches truthful traceable reporting; Engineers Canada national Code of Ethics guideline |
| NPPE-385 | III.1 | D | scored | Previous static finite-element-model validation does not automatically cover low-temperature cyclic service; Engineers Canada risk management and competence |
| NPPE-386 | IV.13 | C | simulated unscored | PIPEDA retention limits, access control and lawful secure disposal after purpose/appeal periods expire; OPC Principle 5 guidance |
| NPPE-387 | III.2 | B | scored | Confidential engineering drawings require controlled encrypted transfer and preserved authoritative master versions; Engineers Canada confidentiality guidance |
| NPPE-388 | II.2 | D | scored | Justice/procedural fairness in allocation of scarce water services; Stanford Encyclopedia of Philosophy, Distributive Justice |
| NPPE-389 | IV.14 | D | simulated unscored | Depth of Crown consultation depends on strength of asserted right and potential effect; SCC *Haida Nation*, 2004 SCC 73, paras. 39–45 |
| NPPE-390 | III.3 | D | simulated unscored | Supervised technical observations require verification before replacement of an outlier; Engineers Canada direct supervision guideline |

**Answer distribution:** A1 / B2 / C2 / D5. **Provisional cognition:** understanding 1 / application 6 / analysis 3. **Difficulty:** 10 medium by preliminary author/editor judgment. The answer-position imbalance and relatively uniform difficulty warrant deliberate whole-form audit; no difficulty labels have been artificially inflated. Experimental is a **simulated scoring role**, not a claim that any item has been field tested.

## Source and legal-verification notes

- [NPPE published blueprint](https://www.nppexam.ca/en/preparation/blueprint/) still identifies 2017 as current on 2026-10-18. All Batch 11 item codes correspond to its numbered topics.
- [Criminal Code s.217.1](https://laws-lois.justice.gc.ca/eng/acts/C-46/section-217.1.html) concerns reasonable steps by a person directing work; [s.219](https://laws-lois.justice.gc.ca/eng/acts/C-46/section-219.html) requires wanton or reckless disregard in doing an act or omitting a legal duty. **NPPE-383 deliberately distinguishes duty from the separate elements of the alleged criminal offence.** The item does not state that a duty's existence alone establishes a conviction. Qualified counsel must confirm legal application and all elements in the charged offence.
- [OPC PIPEDA Fair Information Principle 5](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_use/) addresses limitation of use, disclosure, retention and secure disposal. NPPE-386 expressly stipulates PIPEDA jurisdiction, expiry of lawful retention purposes and absence of holds, avoiding an overbroad real-world deletion rule.
- [SCC *Haida Nation* decision](https://decisions.scc-csc.ca/scc-csc/scc-csc/en/2189/1/document.do) explains the consultation spectrum based on claim strength and potential adverse effects. The ruling, its specific facts and more recent law require independent counsel review before treating the scenario as approved.
- [Ontario Professional Engineers Act](https://www.ontario.ca/laws/statute/90p28) distinguishes complaint-handling and discipline hearing protections for NPPE-382. Do not assert automatic guilt from a complaint.
- [Engineers Canada Code of Ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics), [Direct Supervision](https://engineerscanada.ca/guidelines-and-papers/public-guideline-direct-supervision), and [Risk Management](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-risk-management) are **national professional guidance**, not universally binding provincial regulation.
- [Stanford Encyclopedia of Philosophy, Distributive Justice](https://plato.stanford.edu/entries/justice-distributive/) is academic background for the ethical-theory item, not a statement of enacted Canadian law.

All ten items have four unique alternatives, four mapped option rationales, one defensible proposed answer, key point, trap, jurisdiction assumption, stable ID and version, and source title/type/URL/locator. AI author validation and current source review are **not** independent SME or legal approval. Any source not directly read in full must be checked by the qualified reviewer.

## Whole-form scoring and release barrier

Final expected architecture: **110 questions**, **100 scored**, **10 simulated unscored**. Unscored IDs: NPPE-380, 381, 382, 384, 385, 386, 387, 388, 389, 390. NPPE-383 is scored. The 110-row allocation ledger must exactly match these roles and all 40 numbered blueprint topics have been allocated at least one scored item. This is not a claim of full bullet-level coverage, psychometric difficulty or equivalence to a live NPPE form.

`test-bank-nppe-mock-b-batch11.js` appends to the existing authored array strictly after Batches 1–10, rejects wrong order/conflicts, validates 110/100/10 role counts and **does not remove the release hold**. The protected build includes it only in NPPE content. `tests/nppe-mock-b-batch11.test.js` checks all IDs, blueprint allocation, sources, options/rationales, 100/10 scoring, private delivery, idempotence and held registration. The NPPE assessment-policy harness tests Mock B with a **temporary in-memory test-only hold override** in timed and untimed modes; product configuration remains held.

## Next steps before release (not waived by 110/110)

1. Complete an independent Mock B whole-form editorial and functional review: legal currency, one-best-answer, source access, cross-bank duplicate and answer-cue screening, all-option rationale quality, topic depth, six-domain targets, key balance and device/theme/accessibility testing.
2. Qualified independent Canadian law and engineering/geoscience SME reviews with documented dispositions, revision versions and evidence.
3. Consented pilot candidate calibration, manual assistive-technology accessibility, protected deployment and authorized production-account tests.
4. An explicit release decision. **PR #301 remains draft/unmerged, both Mock A and B release-held, and no production migration, deployment or account grant is authorized.**

## Whole-form QA scoring-role amendment — 2026-10-18

NPPE-381, 384, 385, 387 and 388 are now scored (version 2); NPPE-382, 386, 389 and 390 remain simulated unscored, and NPPE-383 remains scored. The ten experimental IDs across the entire form are 282, 296, 320, 337, 349, 355, 382, 386, 389 and 390.

The historical batch allocation text above is retained as an authoring record where inconsistent; this amendment and the current 110-row allocation ledger control. Source/legal and empirical release gates are unaffected.

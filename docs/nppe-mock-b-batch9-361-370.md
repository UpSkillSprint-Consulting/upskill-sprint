# Mock B Batch 9 — NPPE-361–370 editorial/source and QA record

**Authoring date:** 2026-10-18. **Status:** ten original author/editor-reviewed draft items; Mock B now **90/110**, all 90 currently provisionally scored. The form is **incomplete and release-held**. Independent qualified engineering/geoscience SME and Canadian-law review, manual accessibility review, empirical calibration, and production-account verification remain pending.

## Item-level decisions and sources

| ID | Blueprint | Key index | Assessed distinction | Source verification level / unresolved question |
|---|---|---:|---|---|
| 361 | III.4 | C (2) | A newly published voluntary technical standard does not automatically amend a regulation's fixed incorporated edition | Standards Council background; legal incorporation of specific versions must be confirmed with actual jurisdiction counsel |
| 362 | IV.7 | A (0) | Assigning economic copyright does not automatically waive non-assignable moral rights | **Official Copyright Act s.14.1(1)–(4)** read on 2026-10-18, current to September 30, 2026 |
| 363 | II.1 | D (3) | Customary public posting of identifiable client data is not a substitute for authorization | Engineers Canada Code of Ethics; national nonbinding guidance and stipulated privacy agreement |
| 364 | III.5 | B (1) | Professional liability insurance may transfer financial exposure, not eliminate the hazard or engineer's accountability | Engineers Canada risk-management national guideline cited; item-specific policy coverage is deliberately not asserted |
| 365 | IV.8 | C (2) | Federal expert must promptly communicate material changes to filed opinion | **Federal Courts Rules rule 52.2 and Code of Conduct for Expert Witnesses, Schedule paragraph 4**, official text verified on 2026-10-18 |
| 366 | III.6 | A (0) | Sustainable mine closure requires lifecycle groundwater and community impact appraisal | Engineers Canada *Sustainable Development and Environmental Stewardship* guideline, Sections 3 and 5 read |
| 367 | II.2 | D (3) | Ethics of care emphasizes relationships, dependency, vulnerability and contextual duties | Internet Encyclopedia of Philosophy, *Care Ethics*; philosophical background, not law |
| 368 | I.4 | B (1) | Engineering creates economic value through avoided outages and preservation of existing assets | Engineers Canada sustainability guideline; quantified figures are explicitly hypothetical |
| 369 | V.4 | C (2) | Ontario engineering advocacy/mentoring organizations are not licensing or discipline regulators | Engineers Canada, *Blurring the lines* on member advocacy and public-regulatory mandates; Ontario regulator-specific sign-off pending |
| 370 | VI.4 | D (3) | APEGS 2026 CPD requires planning and online reporting even when annual learning credits are met | APEGS *CPD Program Basics* and [2026 CPD document](https://www.apegs.ca/assets/cpd-program-document-2026.pdf); standard full-year Professional Member is stipulated |

**Key distribution:** A2/B2/C3/D3. **Provisional cognition:** understanding 2, application 7, analysis 1. **Provisional difficulty:** easy 1, medium 9, hard 0. These are editorial judgments only and should not be presented as real psychometric item difficulty.

## Primary-source scope and legal currency

- [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/), accessed 2026-10-18, identifies the 2017 blueprint as current and provides the ten assigned numbered topics. Published ranges are not fixed per-form quotas.
- [Copyright Act s.14.1](https://laws-lois.justice.gc.ca/eng/acts/C-42/section-14.1.html), current September 30, 2026, explicitly distinguishes economic assignment and waiver/non-assignment of moral rights. NPPE-362 states an author and economic-only transfer to avoid ambiguous ownership cases.
- [Federal Courts Rules, Schedule paragraph 4](https://laws-lois.justice.gc.ca/eng/regulations/SOR-98-106/FullText.html): report without delay to recipients of material changes to qualifications, opinions or data. NPPE-365 uses a reliable later investigation rather than duplicating Mock B's earlier expert impartiality decision. Exact procedural implementation for a real case remains counsel's responsibility.
- [APEGS CPD Program Basics](https://www.apegs.ca/cpd/cpd-program/cpd-program-basics) independently lists annual CPD plan update and online reporting along with numerical credits, category and ethics conditions. NPPE-370 assumes full-year 2026 requirements and all numerical credits already met, avoiding duplication of the earlier APEGS credit-deficit scenario.
- [Engineers Canada sustainability guideline](https://engineerscanada.ca/guidelines-and-papers/national-guideline-on-sustainable-development-and-environmental-stewardship-for-professional-engineers) directly addresses long-term environmental, social and economic considerations (NPPE-366/368). National guidance is **not binding provincial law**.
- [Engineers Canada association/regulator role discussion](https://engineerscanada.ca/news-and-events/news/blurring-the-lines-regulatory-bodies-vs-professional-association-mandates) directly distinguishes advocacy bodies from licensing and public-interest oversight (NPPE-369).

The precise SCC/court case context is not claimed independently approved, and standards adoption rules are explicitly hypothetical for NPPE-361. URLs for the Engineers Canada risk guideline and standards background require exact-page follow-up where direct full-content retrieval was not confirmed during this batch. No unverified webpage is silently described as fully read.

## Editorial originality and development controls

All ten items are original scenarios rather than recalled official NPPE questions or copied publisher banks. They each contain a stem, four unique choices, one proposed defensible zero-based key, four individual option rationales, learning objective, jurisdiction assumptions, lesson point, common misconception, item family and sources. Distinguishing decisions: moral-rights waiver (not design reuse licensing), expert change notification (not general impartiality), future mining restoration costs (not stormwater climate projections), planned CPD reporting (not credit-count insufficiency), and ethics of care (not previously used egoism/utilitarian/virtue cases). Full semantic overlap and distractor-cue review across all forms remain a whole-form release gate.

Canonical IDs `nppe:set-1:mock-b:361`–`370`; all are version 1, author ChatGPT, Set 1, `releaseStatus:'held'`, `scored:true`, `experimental:false`. The protected build loads Batch 9 after 1–8 and before the runtime registration. At 90/110, the form fails completeness independently of the explicit release hold; no missing slots are filled from other banks.

`tests/nppe-mock-b-batch9.test.js` includes 90-item integrity, predecessor identities, idempotent/conflicting reloads, hold denial, loading order and no private-stem leakage into public shell or other exam packages. Exact-head GitHub Actions are required before representing the implementation as passing. The prior Batch 8 workflow had a separate **Spread Lab lesson validation failure** notwithstanding passing NPPE diagnostics; it must not be described as all green.

## Remaining release gates

Independent professional engineering/geoscience and Canadian-law SME review; source currency and any unresolved links; whole-form editorial/cue/overlap audit; manual accessibility; real consented calibration; authorized production-account verification; and explicit release authorization remain pending. PR #301 stays draft/unmerged, Mock A and B held, and no production migrations or learner access changes are authorized.

**Next:** Mock B Batch 10, NPPE-371–380.

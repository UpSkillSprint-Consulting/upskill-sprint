# Mock B Batch 5 — NPPE-321–330 editorial and source audit

**Date:** 2026-10-18. **Status:** ten original author/editor-drafted questions, source-backed as documented; independent engineering/geoscience and legal reviews **pending**. Mock B is **50/110, incomplete and release-held**. This is not an official NPPE question bank or an empirically calibrated form.

## Item-level record

| ID | Topic | Proposed key | Distinct assessment decision | Evidence and limitation |
|---|---|---|---|---|
| 321 | V.4 | C | Voluntary international technical society membership versus provincial legal licensure | IEEE technical society benefits; Engineers Canada licensing FAQ; the society has no statutory licensing power |
| 322 | VI.4 | B | APEGS 2026 CPD: 35 credits but inadequate verifiable credits, categories and ethics | APEGS CPD Program Basics / 2026 programme; explicitly professional member, full-year, no exception |
| 323 | IV.11 | D | Evaluate Fisheries Act section 36(3) alongside provincial industrial approval | Federal Fisheries Act s.36(3), subject to applicable authorizations; do not presume every potential deposit constitutes a proven offence |
| 324 | II.1 | A | Longstanding reporting custom does not justify material omission of a failed sensor pilot | Published NPPE ethical distinctions, II.1 and II.3; hypothetical municipal decision facts |
| 325 | III.3 | C | Meaningful early supervision of a technologist applying an unfamiliar critical seismic method | Engineers Canada direct-supervision national model guidance, not an automatic provincial seal rule |
| 326 | IV.12 | D | Criminal Code s.217.1 duty can attach to persons directing subcontracted work; separate duty from criminal conviction | Federal Criminal Code s.217.1 consolidated to 2026-09-21 |
| 327 | III.4 | B | Change of voluntary standard edition is not automatic change of contract or adopted law | CCOHS statutory/standards background; hypothetical contract explicitly cites 2023 edition |
| 328 | II.2 | C | Virtue ethics emphasizes deliberate formation of honesty and moral courage | Aristotle, *Nicomachean Ethics* II.1; NPPE blueprint II.2 |
| 329 | III.5 | D | Reassess risk and controls when power supply and pumping configuration change | CCOHS risk-assessment framework, including non-routine conditions and control reassessment |
| 330 | IV.13 | B | Secondary targeted advertising from consented exposure monitoring needs independent lawful purpose/authority and privacy safeguards | OPC PIPEDA Fair Information Principle 3 on meaningful consent, secondary purposes and exceptions |

**Answer positions:** A 1; B 3; C 3; D 3. **Provisional cognition:** 2 understanding, 5 application, 3 analysis. **Provisional difficulty:** 2 easy, 8 medium, 0 hard. These are editorial judgments and must not be represented as item statistics.

## Source verification and professional limitations

Official [NPPE published blueprint](https://www.nppexam.ca/en/preparation/blueprint/) still calls 2017 the current specification (checked October 18, 2026). The item's primary numbered topics match its published sections. This is a design guide, not evidence that the official exam assigns every topic to one scored question.

- [APEGS 2026 CPD programme](https://www.apegs.ca/cpd/cpd-program/cpd-program-basics) states 30 total credits, at least 12 verifiable credits, two categories and one verifiable ethics hour for the stated professional-member category. Real-life exceptions, prorating or regulator updates remain relevant outside the explicit hypothetical.
- [Fisheries Act](https://laws-lois.justice.gc.ca/eng/acts/F-14/FullText.html), section 36(3), contains the deleterious-substance deposit prohibition, subject to governing exceptions or authorizations. An independent Canadian-law reviewer must confirm application to the specific fact pattern.
- [Criminal Code](https://laws-lois.justice.gc.ca/eng/acts/C-46/section-217.1.html), section 217.1 (consolidation current September 21, 2026), concerns persons who undertake or have authority to direct work and reasonable prevention of bodily harm to any person arising from the task. Statutory duty does not alone establish all elements of an offence.
- [OPC PIPEDA consent guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/) addresses meaningful consent, specific purpose, secondary uses and possible exceptions. Item 330 explicitly stipulates PIPEDA application and no relevant consent exception.
- [Engineers Canada direct supervision](https://engineerscanada.ca/guidelines-and-papers/public-guideline-direct-supervision) is **national model professional guidance**, not a province-specific statutory source. Appropriate direction, ongoing oversight and review inform item 325.
- [CCOHS risk assessment](https://www.ccohs.ca/oshanswers/hsprograms/hazard/risk_assessment.html) addresses hazard analysis, nonstandard conditions, changed equipment/processes and re-evaluation of controls. Item 329 is explicitly hypothetical.
- [Engineers Canada licensing FAQ](https://engineerscanada.ca/frequently-asked-questions) and [IEEE technical societies](https://engage.ieee.org/get-ahead.html) support separation of professional licensure and voluntary knowledge exchange. Item 321 does not assert that a society membership is a licence.
- [Aristotle, Nicomachean Ethics](https://www.gutenberg.org/files/8438/8438-h/8438-h.htm), Book II, Chapter 1, is classical theoretical background for the virtue-formation distinction. Item 328 concerns theory, not a legal obligation.

The III.4 item depends upon stipulated voluntary-standard and contract facts. Its CCOHS support is contextual, and qualified reviewers must verify any applicable statute or regulatory incorporation when moving beyond the hypothetical. Source checking by an AI author is **not independent SME/legal approval**. All ten items require qualified independent review before any learner release.

## Editorial and functional checks

Each of the ten source objects includes one proposed defensible answer, four distinct alternatives and option-specific rationales, learning objective, explicit jurisdictional assumptions, key point, trap, credible question family, item ID and version. The design deliberately differentiates V.4 society membership from licensing, CPD record integrity from composite programme compliance, and hazard substitution from risk review after material change. Some syllabus concepts overlap with earlier banks but no new item should be silently borrowed or presented as a recalled official question; whole-form semantic originality review remains a future gate.

Question IDs: `nppe:set-1:mock-b:321` to `330`. All have `authorSet:1`, `version:1`, `scored:true`, `experimental:false`, `releaseStatus:'held'`. The NPPE package loads Batch 5 strictly after 1–4 and before protected runtime registration. Existing form `releaseHold:true` and incomplete `50/110` independently prevent launching Mock B. No fallback to another bank is permitted.

Automated regression in `tests/nppe-mock-b-batch5.test.js` verifies item structure, predecessor identities, idempotent/conflict behavior, bank counts, protected NPPE-only delivery and unchanged hold. Update exact-head GitHub Actions outcomes after completion; do not reuse old passing results.

## Release gates

Independent Canadian engineering/geoscience SME and legal review, current-source applicability verification, manual accessibility testing, whole-form overlap/answer-cue audit, real consented empirical calibration, production-account verification and explicit release authorization **remain pending**. PR #301 remains draft/unmerged. Mock A release hold and Grok Mock D/Claude Mock E files are preserved.

**Next batch:** NPPE-331–340, Mock B Batch 6.

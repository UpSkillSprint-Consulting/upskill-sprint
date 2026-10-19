# Mock B — legal source spot-check and external adjudication priorities

**Author-level source verification, 2026-10-19. NOT independent legal approval.** The current public sources were checked to prepare targeted questions for an independent Canadian-law reviewer. Leave all `source_access_confirmed`, `independent_legal_reviewer`, and `qualified_disposition` fields in the 110-item independent review ledger pending until the actual reviewer enters evidence. The website or an AI paraphrase is not a human legal opinion.

| Mock B item(s) | Source and proposition checked | Findings / external reviewer assignment |
|---|---|---|
| 322, 370 | [APEGS CPD Program Basics](https://www.apegs.ca/cpd/cpd-program/cpd-program-basics): Professional Members: 30 credits, minimum 12 verifiable, 2 categories, annual verifiable ethics, plan update, online reporting and Scope of Practice entry | Public regulator table supports the question distinction. Reviewer must confirm the date of applicability, member classification, exemptions/proration, and any newer CPD changes |
| 371 | [Ontario Construction Act](https://www.ontario.ca/laws/statute/90c30), s.31(2)(a), s.32: publication of substantial-performance certificate and earlier specified cessation event can trigger the contractor's 60-day preservation period | Official Ontario legislation currently displays the source events. The scenario expressly excludes earlier completion and asks for the trigger, not a calculated court filing date. Reviewer must check statutory exceptions, transition provisions and the difference between a contractor and a subcontractor lien |
| 383 | [Criminal Code s.217.1](https://laws-lois.justice.gc.ca/eng/acts/C-46/section-217.1.html) and [s.219](https://laws-lois.justice.gc.ca/eng/acts/C-46/section-219.html): persons directing work have a preventive duty; criminal negligence has additional elements including wanton or reckless disregard | Item tests the distinction between existence of duty and proof of an offence. Counsel must review applicable legal elements, actual duty/omission findings, actus reus/causation for charged offence and any authoritative updated jurisprudence |
| 389, 336 | *Haida Nation v. British Columbia*, 2004 SCC 73, paragraphs on spectrum of Crown consultation | Constitutional framework flagged for legal reviewer to inspect full primary judgment, subsequent decisions, actual right/impact, and Crown/proponent responsibilities; do not treat a fixed email as automatically adequate |
| 362 | [Copyright Act s.14.1](https://laws-lois.justice.gc.ca/eng/acts/C-42/section-14.1.html): author's moral rights are non-assignable but may be waived in whole or part | Confirm waiver scope and distinction from assignment of economic copyright; inspect the precise wording of the hypothetical |
| 315 | [Ontario Construction Act s.22](https://www.ontario.ca/laws/statute/90c30): basic holdback is ten per cent of the price of services/materials actually supplied, subject to statutory conditions | Check current amendments, alternatives, holdback type and any transition exceptions before endorsing the particular numerical item |
| 291, 347 | Negligence duty/proximity and causation, respectively, supported by cited Supreme Court cases | A qualified civil-liability lawyer must confirm the actual decision, paragraph locator and any important distinction between duty, breach, factual causation and scope of liability |

## Independent item-writing/distraction priorities

The protected reviewer exporter flags **eight items** in which all three alternatives contain categorical language while the key does not: **NPPE-291, 319, 322, 329, 354, 362, 372, 383**. A high-priority distractor editor must blind-review each with four options and determine whether three implausible categorical propositions make guessing too easy, then independently review the rationales and source support. Do not just replace `always` with `often` mechanically or introduce a second correct answer.

Across all 110 authored Mock B items, the author-level lexical screen found categorical expressions in **142 of 330 wrong options** versus **7 of 110 keyed options**. That is a strong review signal, but not an empirical item-quality statistic. The correct-answer length ranks are now spread 25/25/30/30 (shortest, second-shortest, third-shortest, longest), and the previously recorded NPPE-380 option-length tie was corrected. **Neither metric establishes passing item discrimination or fairness.**

## Required handoff evidence

Independent reviewers must record the exact `qid`, item `version`, SHA-256, reviewed primary source effective date/URL/paragraph, named qualifications, conflict declaration, specific one-best-answer and distractor findings, accessibility/fairness issues, severity and disposition. Adjudication requires a separately named reviewer. Store actual signatures and keyed materials outside public Git and CI artifacts; do not claim an independent decision before it exists.

This is an **author source spot-check**, not a completed independent legal/SME review. No candidate calibration observations were available; neither the review packet exporter nor synthetic calibration tests create them.

**No release actions permitted:** PR #301 draft/unmerged, Mock A/B holds intact, no deployment, migration or learner grant.

# Mock B Batch 2 — NPPE-291–300 — editorial and implementation record

Date: 2026-10-18. Status: **10 new author/editor-drafted items; 20/110 total; protected and release-held**. Neither this editorial review nor automated checks count as independent qualified human SME/legal review.

## Item-level disposition

| ID | Blueprint | Key (A=0) | Main evaluated distinction | Reference basis and caveat |
|---|---|---:|---|---|
| 291 | IV.3 | B (1) | Reasonable foreseeability and proximity in third-party negligence reliance | SCC *Deloitte & Touche v Livent*, 2017 SCC 63; scope of undertaking requires qualified legal review |
| 292 | II.3 | A (0) | Measured evidence versus modelled assumptions in public technical statements | Engineers Canada Code of Ethics guideline, principle 4; advisory not binding provincial law |
| 293 | III.4 | C (2) | Permit requirements versus nonbinding industry guidance | Stipulated permit; Engineers Canada ethics and CCOHS standards background; CCOHS How to Read Legislation source located; hypothetical permit text not independently verified |
| 294 | IV.4 | D (3) | Fault, injury and causal connection in Québec extra-contractual liability | Civil Code of Québec art. 1457; official historical English text inspected, currency review pending |
| 295 | I.2 | C (2) | Public protection includes infrastructure access and foreseeable economic disruption | Engineers Canada ethics guideline; hypothetical engineering facts |
| 296 | V.2 | D (3) | Interprovincial mobility eligibility versus destination regulator registration | Engineers Canada Mobility Register official page located; destination regulator conditions still require jurisdiction review; jurisdiction-specific exemptions require review |
| 297 | VI.2 | A (0) | Reactive targeted practice review versus proactive audit | EGBC Individual Practice Review program, current regulator guidance inspected |
| 298 | III.5 | B (1) | Validated lower-hazard substitution versus warning posters | CCOHS hierarchy of controls, official current guidance inspected |
| 299 | II.4 | C (2) | Disclose and manage family conflict in bid evaluation | Engineers Canada code-of-ethics guideline principle 5 |
| 300 | IV.5 | A (0) | Actual control, tools and business risk versus contractor label | CRA RC4110 federal CPP/EI classification guidance; not categorical provincial employment-law conclusion |

## Editorial checks

- Ten unique stems and question families, four alternatives each, four mapped rationales, explicit one-best-answer rationale, 2017 current published NPPE numbered blueprint link, provisional cognitive/difficulty metadata, learning point, trap and source locator.
- Keys: A=3, B=2, C=3, D=2. All ten allocated **scored** in the current provisional form plan; ten simulated unscored slots remain elsewhere in the incomplete form.
- Reasoning focuses on concrete distinctions; items 291, 295 and 300 target analysis (provisional), seven target application.
- Cross-bank full-text semantic duplication screening and qualified legal review remain open; similarity of syllabus themes does not by itself prove question duplication.
- Legal-source risks: NPPE-291 needs case-context checking for duty and proximity; NPPE-294 requires current official Québec consolidation review and bilingual accuracy; NPPE-296 requires destination-regulator-specific mobility checks; NPPE-300 concerns federal payroll classification rather than every employment-law question. The IV.3 item makes no final finding about actual liability from limited fictional facts.

## Delivery checks and pre-existing CI defect

The previous Batch 1 exact-head runs contained failures in NPPE diagnostic, post-exam review and both browser engines: `Mock B must stay held with 110-item Set 1 catalog target`. The optional `releaseHold` property in the pre-existing catalog was undefined, and the new registrar incorrectly treated it as an explicit release. Corrected the Batch 1 registrar to set an *unspecified* hold to true; an explicitly false hold is still rejected. The form remains incomplete (20/110), which independently prevents launch. This is a fail-closed correction, not an authorization to release.

Batch 2 uses `test-bank-nppe-mock-b-batch2.js` after Batch 1 and before the protected runtime; the existing registrar refers to the in-place appended bank. Tests assert idempotent reload, source metadata, 20-item count, enforced hold, and preserved earlier item identities. No public-site direct question script is introduced.

## Remaining gates

- Complete exact-head GitHub Actions checks and browser regressions.
- Primary-source URL/effective-date follow-up and independent Canadian-law and engineering/geoscience item review.
- Whole-form overlap, 100-scored/10-unscored scoring, explanation/keyboard/mobile verification after authoring all 110.
- Consent-based empirical calibration, manual accessibility audit and authorized production-account verification before any release.

Next authoring: **Batch 3, NPPE-301–310**. Preserve Grok D, Claude E and Mock A unchanged and keep PR #301 draft/unmerged.

## Whole-form QA scoring-role amendment — 2026-10-18

NPPE-296 is now simulated unscored (version 2), swapped with scored NPPE-381 in Domain V.

The historical batch allocation text above is retained as an authoring record where inconsistent; this amendment and the current 110-row allocation ledger control. Source/legal and empirical release gates are unaffected.

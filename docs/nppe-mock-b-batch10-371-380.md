# Mock B Batch 10 — NPPE-371–380 editorial/source audit

2026-10-18. **Author/editor preliminary review only.** Ten original items newly authored, bringing Mock B to **100/110**, of which **99 are provisionally scored and one (NPPE-380) is simulated unscored**. These are development scoring roles, not empirically field-tested items. All content remains protected and the incomplete Mock B stays release-held.

## Item ledger

| ID | Blueprint | Key | Scoring | Decision assessed and evidence |
|---|---|---|---|---|
| 371 | IV.9 | C (2) | scored | Ontario contractor construction-lien preservation uses statutory events, not invoice maturity; current Construction Act s.31(1)–(2), subject to statute qualifications |
| 372 | III.7 | D (3) | scored | Incident containment and verification of altered safety controller settings; Canadian Centre for Cyber Security incident-response guidance and Engineers Canada ethics |
| 373 | II.3 | A (0) | scored | Modelled emissions reduction is not an observed reduction; Engineers Canada principle 4 |
| 374 | III.8 | B (1) | scored | Coordinated piping, control and electrical revision after equipment relocation; Engineers Canada professional diligence |
| 375 | IV.10 | C (2) | scored | Canadian treaty commitment is distinct from domestic contract law absent implementation/incorporation; Justice Canada dualist treaty overview |
| 376 | III.9 | D (3) | scored | Engineer must explain and escalate consequences of overruling approved life-safety design; Engineers Canada principles 1 and 9–10 |
| 377 | IV.11 | B (1) | scored | Federal Fisheries Act section 35 physical fish-habitat protections are distinct from section 36 pollution provision; current federal statute |
| 378 | II.4 | C (2) | scored | Self-review bias in an expressly independent design assessment; Engineers Canada conflict/fairness guidance |
| 379 | III.10 | D (3) | scored | Annual flood exceedance probability must be communicated with a correct time basis and uncertainty; NRCan flood mapping guidance |
| 380 | I.1 | A (0) | **simulated unscored** | Public-protection oversight versus members' reputational interests; Engineers Canada code and published blueprint |

**Keys:** A2/B2/C3/D3. Provisional cognition 5 analysis and 5 application. Difficulty all medium (unvalidated editorial judgments). Each object has four alternatives and rationales, key point, common trap, learning objective, jurisdiction assumptions, version, author attribution and source metadata. Full-form answer-key, cue, overlap and psychometric reviews are not yet complete.

## Source checks and legal limits

- [Ontario Construction Act](https://www.ontario.ca/laws/statute/90c30), section 31(2): current official text identifies 60-day preservation conditions after publication of the substantial-performance certificate or earlier specified events. NPPE-371 deliberately asks which **type of event** controls, rather than asking for a date that might be sensitive to procedural exceptions.
- [Fisheries Act](https://laws-lois.justice.gc.ca/eng/acts/F-14/section-35.html), section 35(1)–(2): prohibits harmful alteration, disruption or destruction of fish habitat subject to listed exceptions/authorizations; section 36 addresses deleterious substances separately. NPPE-377 does not assert that a specific project is automatically prohibited without assessment.
- [Justice Canada treaty overview](https://canada.justice.gc.ca/eng/rp-pr/fl-lf/divorce/crc-crde/conv2a.html): Canada's general dualist approach distinguishes signing/ratification from domestic implementation. The example is conceptual; real treaty/domestic interpretation requires counsel.
- [Engineers Canada, Guideline on the code of ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics): principles 1, 2, 4, 5, 7, 8, 9, 10 and 13 inform public safety, professional statements, accountability and integrity. This is **national advisory guidance**, not binding provincial law.
- [Natural Resources Canada flood mapping resources](https://natural-resources.canada.ca/science-and-data/science-and-research/natural-hazards/flood-mapping): referenced for annual exceedance-probability communication. Exact page/terminology must be independently checked for NPPE-379 before final sign-off; no deterministic return-period assumption is made.

Every authoritative source still requires qualified context/effective-date review where relevant. Site or source retrieval is not independent engineering or Canadian-law SME approval, and no question guarantees official NPPE readiness.

## Editorial differentiation and security

The batch addresses new decisions: lien **preservation trigger** rather than statutory holdback amount, physical fish-habitat alteration rather than chemical deposit, an engineer's **changed controls** following a security compromise rather than mere confidential-file sharing, and annual versus multi-year flood risk rather than an unsupported groundwater trend. NPPE-378 tests an expressly independent review of one's own earlier judgment; this resembles some Mock A concepts but uses distinct controlling facts and remains flagged for full-form overlap screening. NPPE-380's simulated experimental scoring role is intentionally hidden during actual attempts.

Protected delivery: `test-bank-nppe-mock-b-batch10.js` loads after Batches 1–9, and the registrar references the existing mutable bank array. `tests/nppe-mock-b-batch10.test.js` checks exactly 100 total items, 99 scored + 1 simulated unscored, stable IDs, four rationales, previous object identities, conflicts and idempotence, private package membership and no other-exam leakage. Mock B remains under `releaseHold:true` and fails the required 110-question complete-form check; no fallback item borrowing is allowed.

### Remaining gates

Independent engineering/geoscience and Canadian-law reviews, any source-access/legislative-currency issues, whole-form cue/overlap/content audit, manual accessibility, consented candidate calibration, controlled production-account verification and explicit release authorization remain pending. PR #301 remains open/draft and unmerged; no production grants, migrations or deployment.

**Next: Mock B Batch 11 — NPPE-381–390.** The reserved allocation contains **1 scored item (NPPE-383) and 9 simulated unscored items**, yielding a proposed completed form of **100 scored + 10 simulated unscored**. Verify the exact ledger and form totals before authoring.

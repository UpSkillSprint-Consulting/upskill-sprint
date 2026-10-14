# NPPE Diagnostic — Batch 3 (NPPE-021–030)

## Release scope

Ten original questions extend **Set 1 / ChatGPT / Diagnostic** from 20 to **30 of 50 planned**. All 30 are scored. The existing timing formula gives **41 minutes** (`ceil(30 × 150 / 110)`), or untimed practice. The Diagnostic remains separate from Learning and Mocks A–E. PR #301 stays draft; no production publication, migration or account grant is included.

## Question and source audit

| ID | Verified blueprint tag | Topic | Intended difficulty | Cognitive level | Key |
| --- | --- | --- | --- | --- | --- |
| 021 | I.4 | Societal value of professional work | Medium | Application | C |
| 022 | II.2 | Utilitarian reasoning | Easy | Understanding | A |
| 023 | II.4 | Former-client confidential information | Medium | Application | D |
| 024 | III.4 | Known hazards beyond code minima | Medium | Application | B |
| 025 | III.5 | Claims-made-and-reported policy dates | Hard | Analysis | A |
| 026 | III.6 | Life-cycle sustainability comparison | Medium | Application | C |
| 027 | IV.6 | Mediator authority and settlement | Medium | Application | D |
| 028 | IV.8 | Expert independence and new evidence | Medium | Analysis | A |
| 029 | V.4 | Technical societies versus regulators | Easy | Understanding | B |
| 030 | VI.3 | BC firm compliance audits | Medium | Application | D |

Batch 3 domain counts I–VI: **1 / 2 / 3 / 2 / 1 / 1**. Cumulative domain counts: **3 / 6 / 9 / 6 / 3 / 3**. These counts describe the authored bank; they do not demonstrate complete subtopic mastery or an official form-equating result. Keys: A 3, B 2, C 2, D 3. Difficulty labels are editorial estimates, not pilot-calibrated measurements.

Each question contains four distinct alternatives, a single intended best answer, four rationales, a learning objective, jurisdiction, question-family ID, key principle, distractor explanation and explicit source locators. The ten scenarios and their wording are original. No publisher instructor-test items were imported or reworded.

### Textbooks inspected

- Andrews, Shaw and McPhee, *Canadian Professional Engineering and Geoscience: Practice and Ethics*, sixth edition, copyright 2019: printed pp. 1, 9, 206–210, 285, 311–312 and 430–432. PDF page numbers differ from printed pages.
- Samuels and Sanders, *Practical Law of Architecture, Engineering, and Geoscience*, Canadian edition, copyright 2007: printed pp. 149–150, 153, 159–161 and 178–179.

These are the supplied editions, not an invented recent edition. Textbook concepts and current external verification are labelled separately in the item records and answer review.

### Current outside-source verification — 2026-10-14

- The official NPPE site still publishes the **2017 blueprint**, with a notice about an anticipated revision. This batch uses the actual displayed I.4, II.2, II.4, III.4–6, IV.6, IV.8, V.4 and VI.3 headings, not the older A–G outline printed in the textbook.
- Engineers Canada code-of-ethics guidance supports confidentiality, diligent practice and public protection. Its national guidance is **not itself legislation**.
- Engineers Canada sustainability guidance, sections 5.5–5.6, supports life-cycle evaluation. It is not presented as a prescribed statutory assessment method.
- The claims-made item uses **express hypothetical policy conditions**. The SPLIP FAQ supports the trigger distinction, but its actual limits, dates and reporting extensions are not imported into this scenario.
- Justice Canada's mediation guide supports the ordinary mediator's lack of authority to impose a settlement. The question expressly excludes mediation-arbitration; it does not claim that attendance at every mediation is optional.
- Ontario Rules of Civil Procedure, rule 4.1.01(1)–(2), supports the expert-duty item. Its Ontario scope is explicit. The SCC White Burgess page could not be retrieved and is **not claimed as a verified reference**.
- EGBC's Firm Audit Program distinguishes proactive compliance audits from technical practice reviews. Item 030 is expressly BC-specific; it does not generalize the procedure to every regulator.

The clickable primary-source URLs are included with the question explanations.

### Answer-defensibility checks

The audit retained decisive facts in each stem: continuing confidentiality restriction (023), a verified hazard and a code-compliant remedy (024), all three policy dates and other conditions assumed satisfied (025), equivalent service and competing impacts (026), no adjudicative authority (027), reliable new evidence before report service (028), and a routine BC compliance audit rather than a complaint (030). No explanation supplies an unstated fact necessary to select the key.

Local syntax checks, module registration tests and duplicate-stem screening passed. The 220 Mock D/E questions used in that screen were confirmed against their current GitHub blob hashes; no identical new stem was found. Lexical overlap is a screening tool, not proof of conceptual independence. Existing Diagnostic themes were also compared during editorial review.

## Integration and QA

`test-bank-nppe-diagnostic-batch3.js` loads **after** the existing registrar and before the simulator runtime. It appends to the registrar's existing array without replacing earlier objects, answers or author-owned forms. It rejects missing/partial predecessors and conflicting repeat registrations. An identical repeat load is idempotent.

Tests now require 30 unique IDs, three ten-item batches, six-domain counts, 41-minute timing, all 30 questions in attempts/review, all-option explanations, no in-assessment reveal, and isolation from Mock D/E. Browser cases cover 320, 390 and 1440 pixels, both themes, all ten Batch 3 screens, keyboard author tabs and answer/flag retention. Viewport screenshots retain the prior image-size fix.

Run the existing Diagnostic, access-delivery, assessment-policy and served-browser workflows on the final commit. Do not substitute an earlier passing commit for final-revision evidence. Local module checks are not a claim that a real production learner/admin approval-and-revocation journey has been tested.

## Separate prior-batch metadata finding

The crosswalk also found older Batch 2 tags requiring a separate, explicit correction: 013 II.5→II.4; 014 III.4→III.5; 015 III.6→III.3; 016 III.5→III.1; 017 IV.4→IV.3; 018 IV.1→IV.2; 020 VI.2→VI.1. These seven discrepancies were subsequently corrected explicitly in `test-bank-nppe-diagnostic-batch2.js` and documented in `docs/nppe-diagnostic-batch2.md`, with no changes to stems, keyed answers, explanations, or parent-domain counts. A regression assertion now guards the corrected subtopic sequence.

Independent subject-matter review, empirical difficulty calibration, the remaining 20 Diagnostic questions and a production release decision remain outstanding.

# NPPE Diagnostic Batch 5 — NPPE-041–050 (Set 1, ChatGPT)

## Scope

Batch 5 completes the original Set 1 Diagnostic: **50 scored questions across five ten-question batches** (NPPE-001–050). The Diagnostic remains independent of Set 1 Learning and Mock A–C, Grok's Mock D, and Claude's Mock E.

The built simulator provides **69 minutes timed** (`ceil(50 × 150 / 110)`) or an untimed assessment. The Diagnostic is a **50-question learning assessment**, **not a full-length 110-question NPPE mock**, a scaled NPPE pass score, or an empirically validated real-exam pass predictor. The bank is complete **in authored question count** only.

## Original questions and authoring controls

| ID | Blueprint | Objective | Provisional difficulty | Cognitive | Key |
| --- | --- | --- | --- | --- | --- |
| 041 | II.2 | Identify Aristotelian virtue-ethics reasoning | Easy | Understanding | C |
| 042 | II.3 | Give appropriate credit for supervised technical work | Medium | Application | A |
| 043 | III.4 | Binding incorporation of a voluntary technical standard | Medium | Application | D |
| 044 | III.7 | Manage suspected compromise of confidential project data | Medium | Analysis | B |
| 045 | III.9 | Protect the public and report substantiated data falsification proportionately | Hard | Analysis | D |
| 046 | IV.5 | Classify employee versus independent contractor by actual working relationship | Medium | Application | A |
| 047 | IV.9 | Distinguish labour/material payment bonds from performance bonds | Easy | Understanding | B |
| 048 | IV.11 | Immediate Saskatchewan hazardous-spill notification | Medium | Application | C |
| 049 | IV.12 | Apply Saskatchewan's work-refusal process | Medium | Application | A |
| 050 | VI.2 | Distinguish BC individual practice review from audit/discipline | Medium | Application | C |

Answer-key distribution: **A 3 / B 2 / C 3 / D 2**. Difficulty: **2 easy, 7 moderate, 1 demanding** (all author estimates, not official item statistics). The correct response is not the longest alternative in any Batch 5 question; that removes one superficial answer-position clue, but does not itself prove good discrimination.

All questions have **four distinct options and one intended best answer**, rationale for **each** option, blueprint, learning objective, jurisdiction, question-family ID, key point, common error, provisional difficulty/cognitive level, and page/section or source URL locators. The stems use separate case situations and are original, with no imported/reworded Pearson instructor test-bank material.

## Evidence hierarchy and question audit

All current legal and regulatory assertions are framed using the following sources; older textbooks provide conceptual support rather than a claim about current law.

| IDs | Source(s) used | What is supported / limitations |
| --- | --- | --- |
| 041 | Andrews, Shaw and McPhee (2019), Ch. 9 §9.2, printed pp. 210–211 | Virtue ethics, the development of courageous character and Aristotle's golden mean; theory question, not a legal rule |
| 042 | Andrews (2019), Ch. 9 §9.7, pp. 220–221; [Engineers Canada Code guidance](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics) | Credit and fair recognition alongside licensed responsibility for authenticated conclusions; national guidance does not override local codes |
| 043 | Samuels and Sanders (2007), Ch. 13 §13.5, pp. 149–150 | Difference between voluntary standards and mandatory statutory/contractual adoption; hypothetical permit condition is explicit |
| 044 | Andrews (2019), Ch. 7 §§7.4–7.5, pp. 166–169; [Canadian Centre for Cyber Security incident response](https://www.cyber.gc.ca/en/guidance/developing-your-incident-response-plan-itsap40003) | Timely internal reporting, incident documentation, coordination and containment; **no universal automatic external notification rule** assumed |
| 045 | Andrews (2019), Ch. 10 pp. 231–239; [Engineers Canada duty-to-report guidance](https://engineerscanada.ca/guidelines-and-papers/guideline-on-the-duty-to-report) | Proportionate reporting of substantiated misconduct and foreseeable risks; mandatory steps vary by jurisdiction |
| 046 | Samuels and Sanders (2007), Ch. 20 p. 226; [Canada Revenue Agency: contract formed outside Quebec](https://www.canada.ca/en/revenue-agency/services/tax/canada-pension-plan-cpp-employment-insurance-ei-rulings/employee-self-employed/contract-outside-quebec.html) | Assessing intention and actual relationship (control, tools, profit, risk) rather than contractual label alone; not a final classification ruling |
| 047 | Samuels and Sanders (2007), Ch. 17 §17.6 pp. 196–197; [Surety Association of Canada: Labour & Material Bonds](https://suretycanada.com/SAC/Surety-Bonds/Labour-Material-Bonds.aspx) and [Performance Bonds](https://suretycanada.com/SAC/SAC/Surety-Bonds/Performance-Bonds.aspx) | Purposes of payment and performance bonds; eligibility and wording matter |
| 048 | [Government of Saskatchewan: Hazardous Spills Reporting](https://www.saskatchewan.ca/business/environmental-protection-and-sustainability/hazardous-materials-and-safe-waste-management/report-hazardous-spills) | Immediate notification for a discharge that may harm environment/health; written report later if additional threshold met |
| 049 | [Saskatchewan: Duties and Rights of Workers](https://www.saskatchewan.ca/business/safety-in-the-workplace/rights-and-responsibilities-in-the-workplace/duties-and-rights-of-workers), section 3-31 under The Saskatchewan Employment Act; [CCOHS overview](https://www.ccohs.ca/oshanswers/legisl/legislation/right_to_refuse.html) | Supervisor investigation, committee and officer escalation in Saskatchewan; worker refusal steps depend on jurisdiction |
| 050 | [Engineers and Geoscientists BC: Individual Practice Review](https://www.egbc.ca/registrants/practice-resources/individual-practice-review) and [Individual Audit Program](https://www.egbc.ca/Registrants/Practice-Resources/Individual-Audit-Program) | In BC, individual audits are proactive, practice reviews are reactive/targeted, and neither mere notice is a final disciplinary finding |

All ten questions are aligned to the **[NPPE's official published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/)**, labelled current on the NPPE website on 2026-10-14. Historical textbooks contain older outlines and must not define the current official subtopic IDs. Current-source claims are distinct from textbook conceptual explanations. Links and named jurisdictions must be checked again if rules or statutes change before publication.

## Release and regression acceptance

- Batch 5 is loaded **after** Batch 4 and before private NPPE-only runtime registration; it appends ten objects without altering the first 40 questions, their answers, or other authors' mock forms.
- The installer rejects absent/partial predecessor banks and conflicting redefinitions; identical repeated installation is idempotent. `NPPE_DIAGNOSTIC_BATCH5` contains questions 041–050 only.
- Tests assert exact Batch 5 blueprint IDs, answer keys, option rationales, key lengths, source metadata and unique question families; both browser engines should display all ten newly added question screens.
- Full 50-item bank has target domain counts I **4**, II **10**, III **15**, IV **12**, V **4**, VI **5**, corresponding to a plausible half-scale representation of the published 100-scored-item NPPE domain ranges.
- The 50 items cover **36 of the 40 official numbered subtopics**. Missing primary subtopic tags: **IV.1 Canadian Legal System**, **IV.10 International Law**, **IV.13 Human Rights and Privacy Legislation**, **IV.14 Further Areas of Law**. These gaps should be covered in the separate Learning Bank and Mock A–C, not disguised as tested by this Diagnostic.
- The 50-question Diagnostic has a **69-minute** timed mode or untimed mode; its 50 questions are all scored. It has no simulated unscored experimental items. A full mock continues to use **110 items (100 scored + 10 unscored)** in 150 minutes.
- Score feedback is raw accuracy, by domain, and answer review after submission; no official NPPE scaled score or pass guarantee.
- Tests check no answer revelation during either timed/untimed attempts, visible after submission only, all four rationales for each question, keyboard author tabs, unanswered/flagged state, navigation, browser responsive layout and no public question-bank assets in the static shell.

**Do not merge PR #301** or change `coming_soon` until latest-code CI is green, independent licensed professional/Canadian-law review and empirical difficulty calibration are completed, and a real production learner/admin request → approval → practice → revocation flow has been verified. Automated browser fixtures do not replace the latter.

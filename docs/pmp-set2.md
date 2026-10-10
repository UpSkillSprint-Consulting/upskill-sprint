# PMP Set 2: batches 1–5

This change integrates the 50 previously authored questions (001–050) into the
existing PMP Set 2 slot. The planned bank remains 180 questions, delivered in
18 batches of ten. Questions 051–180 are not included. The picker shows **50**;
the overview identifies this as a partial set. A timed full sitting uses all
50 available questions at 80 seconds per question (66 minutes 40 seconds).

These are original practice questions aligned with the July 2026 PMP Exam
Content Outline and the PMBOK Guide, Eighth Edition. They are not recalled
PMI items. Difficulty labels are author judgments awaiting learner calibration;
equivalence to the real exam's difficulty or scoring is not claimed. All
practice questions carry one point, with no partial credit and no hidden
unscored items. An answer reveal counts as incorrect.

| Coverage | Included | Planned across 180 |
|---|---:|---:|
| People | 16 | 59 |
| Process | 20 | 74 |
| Business Environment | 14 | 47 |
| Predictive | 20 | 72 |
| Agile | 15 | 54 |
| Hybrid | 15 | 54 |
| Single answer | 36 | 132 |
| Multiple answer | 6 | 24 |
| Matching | 4 | 12 |
| Drop-down | 2 | 6 |
| Hotspot | 2 | 6 |

There are five shared cases, each supporting the first three questions in its
batch. The complete case is shown with each associated question, including in
randomized quizzes and review. Each question is independent of earlier answers.

## Authored content provenance

| Batch | Questions | Review page |
|---|---|---|
| 1 | 001–010 | https://chatgpt.com/space/page_0e2a409c9f048191b07c90bf37e5cf23 |
| 2 | 011–020 | https://chatgpt.com/space/page_34e0ea7833088191a53eed9453741709 |
| 3 | 021–030 | https://chatgpt.com/space/page_0213866ed09c8191819e96bbc95dc1ab |
| 4 | 031–040 | https://chatgpt.com/space/page_021f1aa2f6b08191a3e966dc7148089d |
| 5 | 041–050 | https://chatgpt.com/space/page_a61f085abd8c8191abb78dd02d3b2d1e |

The source data retains every question's author ID, ECO task, approach,
difficulty, answer key, option rationales, and page references. Text-only
interaction instructions are adapted for the website's controls. The uploaded
PMBOK PDF is not included. Question 048 follows PMI's corrected start-to-finish
definition from the second-printing errata.

References:

- https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf
- https://www.pmi.org/-/media/pmi/documents/public/pdf/pmbok-standards/pg8-errata---second-printing.pdf
- https://scrumguides.org/scrum-guide.html

## Integration and response contract

`test-bank-pmp-bank2.js` holds the authored data.
`test-bank-pmp-bank2-ui.js` registers this bank after the legacy Set 1 loaders
and renders its cases, controls, source references, and response rationales.

**Legacy naming matters:** `test-bank-pmp-set1.js` through `set6.js` all populate
the existing 180-question Set 1. Some legacy questions also retain
`pmp:set-2:*` IDs. The new renderer checks `bankId: pmp-bank2-2026`, not that
prefix. The new IDs `pmp:set-2:original-001` through `original-050` use a namespace
that remains distinct from legacy IDs as this bank grows to 180 questions. Existing Set 1 content and keys are preserved.

The shared engine grades integer option indices. Multiple selections are
represented as a bit mask. Matching selections use base-(choice count + 1)
digits, with zero for an unfilled row. Generated `options` contain compact
response labels indexed by that code; the original choices remain in
`choices`. The UI displays only those original choices, never the generated
state list. Partial answers survive navigation and score incorrect if submitted.
Clearing all choices returns the item to unanswered. A completely correct
response is the only code equal to `answer`.

The same renderer supports the initial sitting, answer reveal, and correction
retry. Review shows the original evidence and response rationales. Correction
results do not change the original score. No database, account access, or
persistence behavior is changed; exam state remains in the current tab.

## Verification

`tests/test-bank-pmp-bank2.test.js` checks:

- All 50 IDs and independently transcribed answer keys, coverage counts, cases,
  references, and every authored response rationale.
- Every encoded multiple-answer/matching state, including partial input,
  exact-match scoring, and revealed-answer scoring.
- The production edge delivery path, actual Set 2 counts, Set 1 isolation,
  answer changes and navigation, all-format scoring, review and correction.
- Untimed reveal, locked controls, and preservation of the original score.

Run it alongside the existing PMP, review, reveal, and stateless-results tests.
Local Chromium verification covers light/dark at 1280 px and 390 px, all four
interactive formats, keyboard selection, 50-card review, and horizontal overflow.
Axe reports zero WCAG A/AA violations in the new question and answer components
for the tested states. The local fixture isolates authentication; it does not
verify a real account login. Deploy-preview verification remains a separate gate.

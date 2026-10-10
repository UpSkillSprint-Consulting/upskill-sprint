# PMP Set 2: batches 1–9

This change integrates 90 original questions (001–090) into the
existing PMP Set 2 slot. The planned bank remains 180 questions, delivered in
18 batches of ten. Questions 091–180 are not included. The picker shows **90**;
the overview identifies this as a partial set. A timed full sitting uses all
90 available questions at 80 seconds per question (120 minutes).

These are original practice questions aligned with the July 2026 PMP Exam
Content Outline and the PMBOK Guide, Eighth Edition. They are not recalled
PMI items. Difficulty labels are author judgments awaiting learner calibration;
equivalence to the real exam's difficulty or scoring is not claimed. All
practice questions carry one point, with no partial credit and no hidden
unscored items. An answer reveal counts as incorrect.

| Coverage | Included | Planned across 180 |
|---|---:|---:|
| People | 30 | 59 |
| Process | 37 | 74 |
| Business Environment | 23 | 47 |
| Predictive | 36 | 72 |
| Agile | 27 | 54 |
| Hybrid | 27 | 54 |
| Single answer | 66 | 132 |
| Multiple answer | 12 | 24 |
| Matching | 6 | 12 |
| Drop-down | 3 | 6 |
| Hotspot | 3 | 6 |

There are nine shared cases, each supporting the first three questions in its
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
| 6 | 051–060 | https://chatgpt.com/space/page_99b8b6cccbe08191b31a4c90d0e4f351 |
| 7 | 061–070 | https://chatgpt.com/space/page_72fe21a439f48191800eb85489c54275 |
| 8 | 071–080 | [Batch 8 review document](pmp-set2-batch8.md) |
| 9 | 081–090 | [Batch 9 review document](pmp-set2-batch9.md) |

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
prefix. The new IDs `pmp:set-2:original-001` through `original-090` use a namespace
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

- All 90 IDs and independently transcribed answer keys, coverage counts, cases,
  references, and every authored response rationale.
- Every encoded multiple-answer/matching state, including partial input,
  exact-match scoring, and revealed-answer scoring.
- The production edge delivery path, actual Set 2 counts, Set 1 isolation,
  answer changes and navigation, all-format scoring, review and correction.
- Untimed reveal, locked controls, and preservation of the original score.

Run it alongside the existing PMP, review, reveal, and stateless-results tests.
Local Chromium verification covers light/dark at 1280 px and 390 px, all four
interactive formats, keyboard selection, and horizontal overflow. Batches 6–7 add
checks of the new shared cases, all four used response formats, and the standalone
financial-evidence table. Batch 8 checks the shared case, cumulative-completion hotspot,
matching, multiple-answer and test-selection items. Batch 9 checks the new
shared case, both multiple-answer items, and the cost-of-quality exhibit, plus 90-card review.
Axe reports zero WCAG A/AA violations in the new question and answer components
for the tested states. The local fixture isolates authentication; it does not
verify a real account login. Deploy-preview verification remains a separate gate.

The student browser audit now drives each Set 2 response format through its
actual controls during selection, reveal, review, and correction. Previously it
assumed every question exposed a single-choice button, which caused the Set 2
and mixed-pool CI flows to fail before grading. `--exam pmp` limits local
reruns to the affected exam matrix; CI still checks every exam by default.

## Coverage audit at Question 090

All 26 ECO tasks are represented. Domain totals remain within one question of a
proportional 90-question allocation. Development approaches are exactly 40%
predictive, 30% agile, and 30% hybrid; difficulty remains 20% moderate, 60%
challenging, and 20% very challenging. Single-answer keys are A 17, B 17, C 16,
and D 16. There are 27 shared-case questions.

Batch 7 adds two calculation-driven items and an evidence-reconciliation item.
Independent checks: Q061 has CPI 0.90, EAC $1,000,000, and TCPI to meet BAC 1.08;
Q064 requires 3–4 whole iterations, $90,000–$120,000 more, and a total of
$210,000–$240,000; Q069 recognizes $30,000 EV and $80,000 AC under its stated rules.
The reserve question explicitly states its budget arrangement and authority,
consistent with PMBOK 8's alternative reserve structures.

Batch 8 adds a cumulative schedule-simulation hotspot and a constrained test-selection item.
Independent checks: Q074 yields 40%, 65%, 79%, and 86%; only the listed Day 29
meets the 80% threshold. Q079 requires R plus S and U for six hours and $10,500
expected optional benefit. Q073 requires a joint dependency model rather than
unvalidated multiplication of marginal probabilities. Q075 applies PMI’s p. 157 erratum.
The hotspot renderer accepts a question-specific instruction and selectable column,
while retaining the existing engagement and supplier defaults. Compact two-column
hotspots keep the deadline and selectable result together on narrow screens.

Batch 9 adds first-pass quality measurement, comparable-pilot assessment,
formal acceptance, expectation alignment, reviewer calibration, process stability,
compliance evidence, team ownership, and a total-cost-of-quality decision.
Independent checks: Q081 is 102/120 = 85% first-pass acceptance; Q083 compares
80% with 85% without establishing causation; Q090 is $240,000 current versus
$222,000 proposed, including setup, for an $18,000 forecast net reduction.

The task allocations below preserve the 180-question plan. They are internal
coverage targets, not PMI quotas for individual tasks.

| ECO domain | Task | Authored | Remaining |
|---|---:|---:|---:|
| People | 1 | 2 | 4 |
| People | 2 | 5 | 3 |
| People | 3 | 6 | 4 |
| People | 4 | 3 | 6 |
| People | 5 | 4 | 3 |
| People | 6 | 3 | 4 |
| People | 7 | 3 | 2 |
| People | 8 | 4 | 3 |
| Process | 1 | 4 | 5 |
| Process | 2 | 4 | 5 |
| Process | 3 | 4 | 5 |
| Process | 4 | 3 | 3 |
| Process | 5 | 3 | 4 |
| Process | 6 | 5 | 3 |
| Process | 7 | 4 | 3 |
| Process | 8 | 5 | 3 |
| Process | 9 | 4 | 2 |
| Process | 10 | 1 | 4 |
| Business Environment | 1 | 3 | 3 |
| Business Environment | 2 | 4 | 3 |
| Business Environment | 3 | 3 | 4 |
| Business Environment | 4 | 2 | 4 |
| Business Environment | 5 | 4 | 4 |
| Business Environment | 6 | 3 | 1 |
| Business Environment | 7 | 2 | 3 |
| Business Environment | 8 | 2 | 2 |

Next: Batch 10, Questions 091–100, covering procurement, suppliers, and contracts.
There are 90 questions left to author.

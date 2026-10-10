# PMP Set 2: batches 1–15

This change integrates 150 original questions (001–150) into the
existing PMP Set 2 slot. The planned bank remains 180 questions, delivered in
18 batches of ten. Questions 151–180 are not included. The picker shows **150**;
the overview identifies this as a partial set. A timed full sitting uses all
150 available questions at 80 seconds per question (200 minutes).

These are original practice questions aligned with the July 2026 PMP Exam
Content Outline and the PMBOK Guide, Eighth Edition. They are not recalled
PMI items. Difficulty labels are author judgments awaiting learner calibration;
equivalence to the real exam's difficulty or scoring is not claimed. All
practice questions carry one point, with no partial credit and no hidden
unscored items. An answer reveal counts as incorrect.

| Coverage | Included | Planned across 180 |
|---|---:|---:|
| People | 50 | 59 |
| Process | 61 | 74 |
| Business Environment | 39 | 47 |
| Predictive | 60 | 72 |
| Agile | 45 | 54 |
| Hybrid | 45 | 54 |
| Single answer | 110 | 132 |
| Multiple answer | 20 | 24 |
| Matching | 10 | 12 |
| Drop-down | 5 | 6 |
| Hotspot | 5 | 6 |

Batches 1–10 each have a shared case supporting their first three questions.
Batches 11–15 use standalone items. The complete case accompanies each related question in
randomized quizzes and review. Each question is independent of earlier answers.
The planned 30 shared-case questions are now complete; later batches use standalone items.

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
| 10 | 091–100 | [Batch 10 review document](pmp-set2-batch10.md) |
| 11 | 101–110 | [Batch 11 review document](pmp-set2-batch11.md) |
| 12 | 111–120 | [Batch 12 review document](pmp-set2-batch12.md) |
| 13 | 121–130 | [Batch 13 review document](pmp-set2-batch13.md) |
| 14 | 131–140 | [Batch 14 review document](pmp-set2-batch14.md) |
| 15 | 141–150 | [Batch 15 review document](pmp-set2-batch15.md) |

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
prefix. The new IDs `pmp:set-2:original-001` through `original-150` use a namespace
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

- All 150 IDs and independently transcribed answer keys, coverage counts, cases,
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
shared case, both multiple-answer items, and the cost-of-quality exhibit, plus 90-card review. Batch 10 checks the procurement case, multiple-answer,
drop-down, matching, and integrated-plan items, plus 100-card review. Batch 11 checks standalone content, the requirement-readiness
hotspot, compliance multi-select, planning-artifact matching, and funding calculation,
plus 110-card review. Batch 12 checks both numeric exhibits, both multiple-answer
items, and a standalone single-answer item, plus 120-card review. Batch 13 checks the drop-down, multiple-answer, matching,
risk-cost exhibit, and contract-payment item, plus 130-card review. Batch 14 checks
the requirements hotspot, multiple-answer, subgroup-metric exhibit, planning matching,
and risk-response item, plus 140-card review. Batch 15 checks both multiple-answer
items, the life-cycle-cost exhibit, energy reporting, and benefits handover, plus
150-card review.
Axe reports zero WCAG A/AA violations in the new question and answer components
for the tested states. The local fixture isolates authentication; it does not
verify a real account login. Deploy-preview verification remains a separate gate.

The student browser audit now drives each Set 2 response format through its
actual controls during selection, reveal, review, and correction. Previously it
assumed every question exposed a single-choice button, which caused the Set 2
and mixed-pool CI flows to fail before grading. `--exam pmp` limits local
reruns to the affected exam matrix; CI still checks every exam by default.

## Coverage audit at Question 150

All 26 ECO tasks are represented. Domain totals remain within one question of a
proportional 150-question allocation. Development approaches are exactly 40%
predictive, 30% agile, and 30% hybrid; difficulty remains 20% moderate, 60%
challenging, and 20% very challenging. Single-answer keys are A 28, B 27, C 27,
and D 28. There are 30 shared-case questions.

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

Batch 10 adds supplier eligibility and weighted selection, fair bidder communication,
contract changes, closure, shared vision, contract models, spending authority,
dispute resolution, external pricing changes, and integrated make-or-buy planning.
Independent checks: Q091 selects eligible D at 88.6 over eligible B at 86.8.
Q100 gives both alternatives the same earliest testing window, weeks 7–8.

Batch 11 adds conflict-of-interest safeguards, honest readiness reporting,
requirement verification criteria, psychological safety, trial authorization,
governance artifacts, confidentiality expectations, staged funding, delegated
escalation, and termination closure. Q108 has $15,000 remaining commitment
authority and needs at least $7,000 more for the proposed package.

Batch 12 adds release-value sequencing, representative feedback, organizational
restructuring impacts, contextual knowledge reuse, feedback work in schedules,
customer follow-up, bottleneck resources, updated vision, usable delivery slices,
and organizational learning. Q111 favors B then A ($70,000 versus $61,000).
Q117 raises the system capacity from 4 to 8 packages/week by adding validation capacity.

Batch 13 adds interface decisions before irreversible commitments, handover conflict,
delegated change authority, scope gaps, adoption capacity, comparable reporting,
leadership, quality activities, risk-response cost, and supplier acceptance/payment.
Q129 expected total costs are $36,000, $22,000, $32,000, and $30,000 respectively;
prevention is preferred under the scenario’s explicit comparison rule.

Batch 14 adds independent AI acceptance evidence, stakeholder trust, policy-bound data
handling, requirements traceability, aligned automation expectations, human decision
authority, subgroup-aware metrics, team development, integrated AI workflow planning, and
potential unequal-impact risk. Q137 contrasts improving pooled results with falling
results in both categories; the data do not establish causation.

Batch 15 adds benefits measurement and ownership, affected-community engagement,
verifiable sustainability scope, external incentive changes, life-cycle cost subject to
an emissions constraint, shared vision, reuse-risk assumptions, customer access,
energy-intensity reporting, and funded benefits-monitoring handover. Q145 selects
Efficient at $180,000 from the two packages meeting the emissions limit. Q149
shows intensity down 20% while actual total energy use rises 20%.

The task allocations below preserve the 180-question plan. They are internal
coverage targets, not PMI quotas for individual tasks.

| ECO domain | Task | Authored | Remaining |
|---|---:|---:|---:|
| People | 1 | 5 | 1 |
| People | 2 | 7 | 1 |
| People | 3 | 9 | 1 |
| People | 4 | 7 | 2 |
| People | 5 | 6 | 1 |
| People | 6 | 5 | 2 |
| People | 7 | 4 | 1 |
| People | 8 | 7 | 0 |
| Process | 1 | 8 | 1 |
| Process | 2 | 8 | 1 |
| Process | 3 | 7 | 2 |
| Process | 4 | 4 | 2 |
| Process | 5 | 6 | 1 |
| Process | 6 | 7 | 1 |
| Process | 7 | 6 | 1 |
| Process | 8 | 6 | 2 |
| Process | 9 | 5 | 1 |
| Process | 10 | 4 | 1 |
| Business Environment | 1 | 6 | 0 |
| Business Environment | 2 | 6 | 1 |
| Business Environment | 3 | 5 | 2 |
| Business Environment | 4 | 3 | 3 |
| Business Environment | 5 | 7 | 1 |
| Business Environment | 6 | 4 | 0 |
| Business Environment | 7 | 4 | 1 |
| Business Environment | 8 | 4 | 0 |

Next: Batch 16, Questions 151–160, covering issues, escalation, and external disruption.
There are 30 questions left to author.

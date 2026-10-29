# CQA Set 2: source and question audit

Latest content review: 2026-10-29. PR #368 remains open and unmerged. **All 150 questions are authored.** Completion of the question count is not permission to merge or a claim of empirical equivalence to an administered ASQ examination.

## Audit history and current sources

The complete, unchanged review history for Q001–Q140 is preserved in [cqa-set2-source-audit-through-batch14.md](cqa-set2-source-audit-through-batch14.md). That file is a historical 140-question checkpoint; this document adds the fresh Q131–Q140 audit, final batch and current completion status. Together they retain the source map for all 150 questions.

Primary textbook: *The ASQ Certified Quality Auditor Handbook*, fifth edition, Lance B. Coleman Sr., editor, 2020. Uploaded PDF SHA-256: `dd47993300b2a1a5ab2d55a3edf79599f859b2b7f4d8076e0d9550d1505f789f`.

Current blueprint: [ASQ 2026 CQA Body of Knowledge](https://www.asq.org/cert/resource/pdf/certification/2026%20CQA%20Body%20of%20Knowledge.pdf), reopened for this cycle. Topic labels are maximum cognitive levels, not prescribed difficulty proportions. The 2019 blueprint printed in the textbook does not govern the final allocation.

Supplementary checks: [current ASQ Code of Ethics](https://asq.org/about-asq/conferences-events-policies/code-of-ethics), especially protection of confidential information from personal use; and [NIST/SEMATECH e-Handbook, Scatter Plot](https://www.itl.nist.gov/div898/handbook/eda/section3/scatterp.htm), for nonlinear association and the distinction between association and causation.

All page references below are printed textbook folios. PDF positions are one-based navigation positions. The +19 offset was checked against the visible printed numbers, including the footer on chapter-opening page 166; it was not treated as independent proof of source support. No textbook page images or copied book passages are committed to the public repository.

## Fresh preceding-batch audit: Q131–Q140

**Result: PASS without changes.** The fresh review covered the ten complete committed questions, forty choices, answer keys, main explanations, thirty distractor rationales, learning points, traps, the Q140 exhibit, BoK mappings and cognitive ceilings. All fourteen distinct cited printed folios were checked against the uploaded PDF: 4, 21, 30, 79, 102, 122, 134, 135, 156, 157, 158, 170, 203 and 283.

| Item | Key | BoK | Actual level | Printed pages | One-based PDF pages |
|---|---|---|---|---|---|
| Q131 | B | I.A.1 | Apply | 4 | 23 |
| Q132 | D | I.C | Analyze | 21 | 40 |
| Q133 | A | I.E.1 | Apply | 30 | 49 |
| Q134 | C | II.A.5 | Apply | 79 | 98 |
| Q135 | B | II.C.1 | Evaluate | 122, 134 | 141, 153 |
| Q136 | D | II.D.2 | Evaluate | 135 | 154 |
| Q137 | A | III.E | Apply | 170 | 189 |
| Q138 | C | III.C | Analyze | 156–158 | 175–177 |
| Q139 | B | IV.A.7 | Evaluate | 203 | 222 |
| Q140 | D | V.D.3 | Apply | 102, 283 | 121, 302 |

### Findings and qualifications

- Q131 correctly uses process tracing within a wider system assessment; the technique does not cancel management, support or interface coverage.
- Q132 correctly separates the met 24-hour contractual obligation from the failed eight-hour internal obligation. Both use the same elapsed-time definition; 16 hours meets one and exceeds the other.
- Q133's p. 30 illustration is the IIA code reproduced in the handbook, not the current ASQ code. Its personal-use principle is also present in the separately checked current ASQ code. No financial damage or criminal liability is assumed.
- Q134 repairs the sampling frame before selection. More observations or random selection within the outcome-filtered folder would not include the excluded jobs. A complete frame alone does not guarantee representative results.
- Q135 preserves the verified 10:05 breach, 11:00 correction and pending causal work. Correction does not erase history or establish prevention of recurrence.
- Q136's limited response depends on its explicit local procedure, verified cause and extent, retired exposure and retained monitoring. It is not a universal exemption from corrective action.
- Q137 preserves the normal task and planned observation while deferring detailed questions until the concentration-sensitive work is finished.
- Q138 distinguishes a deferrable non-audit preference from a material evidence disagreement. Collaboration does not guarantee agreement or make unsupported findings acceptable.
- Q139 keeps the authorization breach and bounded time-saving evidence separate. An eight-to-six-minute reduction is 25%, but does not retrospectively approve the method or establish broader effectiveness.
- Q140 corrects J28's proven 144.0-to-14.4-minute transcription error through the authorized retained audit trail, and retains J63's verified 91.0-minute observation within the expressly defined population. It does not import a blanket outlier-deletion rule from the book.

No earlier question object or citation is changed in this update. The Q001–Q140 source retains Git blob `421d54742bc24f5007d984cacda2f13afe1e52a8`.

## Final batch: Q141–Q150

The final ten original objects are in `test-bank-cqa-set2-batch15.js`. Every item has four distinct choices, one keyed answer, an explanation, three indexed distractor explanations, a key point, a trap and verified printed-page references. The batch allocation is I2 / II3 / III2 / IV2 / V1.

| Item | Decision tested | BoK | Actual / maximum level | Key | Printed pages | One-based PDF pages |
|---|---|---|---|---|---|---|
| Q141 | Distinguish accreditation of the certifier from certification of its clients | I.A.3 | Apply / Analyze | C | 8 | 27 |
| Q142 | Protect reporting independence without excluding legitimate auditee cooperation | I.E.3 | Apply / Apply | A | 48 | 67 |
| Q143 | Select a hybrid evidence plan that preserves required observation coverage | II.A.1 | Evaluate / Evaluate | D | 73–75, 196 | 92–94, 215 |
| Q144 | Distinguish records from an interrupted direct observation | II.B.4 | Evaluate / Evaluate | B | 93, 103–104 | 112, 122–123 |
| Q145 | Apply an active records-preservation instruction after normal expiry | II.C.3 | Apply / Apply | C | 131–132 | 150–151 |
| Q146 | Respond neutrally to a pause and a supervisor answering for an operator | III.E | Apply / Apply | D | 166–167, 170 | 185–186, 189 |
| Q147 | Use a facilitator without transferring evidence or reporting authority | III.F.2 | Apply / Apply | A | 174 | 193 |
| Q148 | Address a demonstrated skill gap and verify development through performance | IV.A.3 | Evaluate / Evaluate | C | 181, 184–185 | 200, 203–204 |
| Q149 | Arrange oversight of critical second-tier activity without assuming access rights | IV.A.6 | Analyze / Create | B | 196–198 | 215–217 |
| Q150 | Interpret curved paired data despite zero linear correlation | V.A | Analyze / Analyze | A | 239–241 | 258–260 |

All **23 distinct cited printed pages** were inspected. Actual cognitive levels are **Apply 5 / Evaluate 3 / Analyze 2**. Answer positions in this batch are A3/B2/C3/D2. Choices contain 21–27 whitespace-delimited words, and no correct choice is uniquely longest. Similar option length is a wording check, not a substitute for plausible distractors.

### Question-level review

**Q141:** The assessment subject is the certification body. Its accreditation does not automatically certify a client factory, every employee or a current production lot. This differs from the earlier question about what a manufacturer's system certificate establishes for a delivered lot.

**Q142:** The new decision addresses governance of the reporting route, rather than a particular auditor's personal conflict or a one-off request to omit a finding. The independent sponsor addresses the auditee manager's veto while retaining appropriate factual dialogue and corrective-action responsibility.

**Q143–Q144:** Both contain identical complete planning context and the same four-row exhibit, with case ID `cqa-set2-hybrid-setup-08`. Q143 evaluates the proposed evidence method before execution. Q144 supplies its own subsequent interruption and asks what the resulting evidence supports. Neither answer depends on recalling the other question. The case has explicitly required observations on both shifts; it does not teach that every audit always requires this sample or method. The night-shift evacuation is followed by safe withdrawal in the stem. A subsequent record is documentary evidence, not retroactive direct observation, and the absence of observation does not establish that the operator skipped the task. The exhibit describes the schedule, while Q144 describes the later deviation from that schedule.

**Q145:** H12 is an explicit scenario instruction issued by the designated records authority and covering the supporting papers. It is not an unstated legal hold, a jurisdiction-specific legal opinion or a universal retention period. Routine expiry and closed findings do not cancel the still-active instruction. Uncontrolled personal copies do not meet secure custody requirements.

**Q146:** A non-verbal cue is not a competence or honesty finding. The question retains neutral questioning, the operator's own account and corroboration rather than supervisor substitution or a supplied model answer.

**Q147:** The appointment expressly retains the lead and assigned auditors' substantive responsibilities. A facilitator can organize discussion without assuming evidence assessment or reporting authority. No universal prohibition on facilitators with other legitimate assignments is implied.

**Q148:** Written knowledge and training attendance do not establish the skill improvement being evaluated. The proposed intervention and verification are matched to the observed interviewing gap, with feedback and clear performance expectations.

**Q149:** The critical second-tier dependence remains a risk even without current direct access. Oversight and access must be arranged with procurement and relevant parties; the audit team does not acquire contracting authority or a universal right to enter a lower-tier facility. Alternative agreed oversight is not ruled out.

**Q150:** The values are original, not taken from the textbook chart. Their means are x-bar = 60 and y-bar = 5.4. The sum of centred cross-products is zero; both variables vary, so Pearson r = 0. The rework sequence 9, 4, 1, 4, 9 is curved rather than constant. The lowest observed rate is 1%, not zero. NIST's scatter-plot guidance separately supports examining nonlinear association without inferring causation. No population optimum or significance test is asserted.

This cycle includes source and editorial self-review, not an independent human SME review. An exhaustive whole-form semantic-overlap and readability audit remains a release gate; new scenarios are not evidence of empirical item calibration.

## Completed blueprint and case coverage

| Domain | Through Batch 14 | Batch 15 | Final | 2026 target |
|---|---:|---:|---:|---:|
| I. Auditing Fundamentals | 35 | 2 | 37 | 37 |
| II. Audit Process | 42 | 3 | 45 | 45 |
| III. Auditor Competencies | 28 | 2 | 30 | 30 |
| IV. Audit Program Management and Business Applications | 21 | 2 | 23 | 23 |
| V. Quality Tools and Techniques | 14 | 1 | 15 | 15 |
| Total | 140 | 10 | 150 | 150 |

There are sixteen case-based questions in eight self-contained pairs: Q004–005, Q023–024, Q043–044, Q064–065, Q084–085, Q104–105, Q124–125 and Q143–144. The final case share is 16/150 = **10.67%**, within ASQ's approximate 10–15% range. Three new tables bring the total to **34**. The final answer-position allocation is **A38/B37/C38/D37**. All 150 questions provide three distractor explanations, for **450** total.

## Integration and validation record

The reviewed Q001–Q140 source is retained unchanged. The last ten items are a guarded append module, loaded before the existing simulator registers CQA Set 2. `scripts/cqa-set2-completion.mjs` composes that script and completed progress label into the unshipped authoring page before protected-package extraction. This follows the site's existing build-time composition approach; it introduces no new quiz UI, endpoint or access policy. The raw authoring page remains a historical source input, not the published runtime.

The complete bank uses the existing Full, Quick, Focused, diagnostic, scoring and review flows. The expected Full practice duration is **300 minutes / 5 hr**, maintaining the site's two-minute-per-question practice setting. This 150-question practice form is not presented as an exact replica of the 165-question computer-delivered ASQ appointment.

Completed local checks at content freeze:

- All five focused completion tests passed with zero failures. They check ordered and idempotent page composition, invalid integration boundaries, final IDs/allocation/rationales/source fields, unchanged prior-array contents, repeated-installation protection, identical case exhibits and Q150 arithmetic.
- JavaScript syntax checks passed for the final batch, composer, delivery builder and updated integration tests.
- Uploaded Git blob hashes were compared with the locally checked bytes.
- The delivery-builder change is limited to one import and composition of its page input. Other exam-specific extraction code is unchanged.

The updated full learner-flow suite is configured to check all 150 questions, 300 unique combined Set 1/Set 2 IDs, exact 37/45/30/23/15 allocation, all 34 tables, all 450 distractor explanations, Full and Quick grading, focused modes, the diagnostic and protected-content exclusion. A dedicated step was added to the existing read-only GitHub validation workflow to execute the two CQA integration suites and the new completion suite.

The complete repository build and browser-style learner suite were **not run in this container**. Their results must come from the commit-specific GitHub checks and Netlify preview; those statuses are reported separately on PR #368. The local five-test result is not substituted for those checks.

## Release status

### Question-state capabilities verified — 2026-10-29

The initial verification confirmed that the protected CQA runtime supports the five requested question states in both sets. That verification added regression coverage without changing question content, scoring or the UI. Coverage explicitly exercises both sets in Full, Quick and Focused practice, with light and dark themes:

| State | Verified behaviour |
|---|---|
| Slate grey | Unanswered questions retain their neutral styling and accessible status. |
| Teal | Selecting an answer marks it answered, awaiting grading. |
| Blue | Reveal Answer displays the answer and explanation in untimed practice, locks answer changes, and counts the item as incorrect even if the correct choice was selected first. |
| Orange flag | Flags can be toggled independently and survive answering, revealing, navigation and submission. |
| Current outline | Exactly one current question is indicated during an attempt and when selecting an individual review question; Review all has no single current question. |

The new tests cover revealing before and after selection, retained explanations on return, eye icons, accessible labels, keyboard focus, computed teal/blue/orange colours, final grading, and timed-mode rejection of reveal. The existing contrast tests are included in the CQA CI command.

Validation: the CQA Set 1, Set 2, completion and status-contrast suites passed locally: **40 tests, zero failures**, including nested mode/theme cases. These tests build and exercise the protected exam package. The full repository suite and a manual authenticated browser walkthrough were not run for this test-only update.

### Question-state visibility correction — 2026-10-29

The learner's screenshot showed the full-exam grid without its key or state symbols. The shared layout placed the key below the grid and suppressed the symbols for exams with more than 40 questions. The key now appears above the grid in a labelled panel with coloured samples for all five states. It remains outside the grid's scrolling area. Full-exam buttons retain their state symbols and use a 44-by-48-pixel size. All unanswered questions still start slate grey; answering, revealing or flagging changes the appropriate indicators. The current-question outline remains independent.

This change updates the shared navigation presentation only. Question content, answer locking, reveal penalties, timed-mode restrictions and grading are unchanged. The CQA mode/theme coverage now verifies the key's position, colour samples and full-grid button sizing, and guards against hidden long-grid status symbols.

Validation for this visibility correction: **40 CQA tests and 9 shared-navigation/reveal checks passed, zero failures**. The shared checks include all six NPPE banks and timed-mode reveal restrictions. `npm run build:site`, JavaScript syntax checking and `git diff --check` passed. The full repository test suite was not run. The connected browser was unavailable and the cloud browser could not reach the local preview, so no manual authenticated visual walkthrough is claimed. Commit-specific CI and deploy-preview results remain separate from these local checks.

**150/150 authored; no merge or production publication in this cycle.** Before release, perform the whole-form editorial and semantic-duplication audit, resolve any failing automated checks, verify the authenticated preview on desktop and mobile, and obtain the repository's required approval. A pass prediction or live-exam difficulty equivalence requires candidate-performance evidence that this source audit does not supply.

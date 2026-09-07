# ASQ Master Black Belt Simulation Exam — Set 3
## Batch 2 audit: canonical Questions 26–50

**Final batch status: Passed after corrections — tested review build.**

The corrections and evidence are on PR #170's existing branch, `audit/mbb-set3-batch1-q001-q025`, for human review. Nothing was merged or deployed by this audit. Batch 1 content is preserved, and Batch 3 has not been started. This report does not certify production authentication, synchronization, security, physical-device behavior or empirical psychometric calibration.

### Scope and evidence identity

Question numbers in this report refer to the canonical `MBB_SET3` array, not the randomized order shown in an individual exam session. Stable question IDs provide the mapping.

- Baseline before Batch 2: `0258e58601eda9c693999cfb41e40d7c3c799c5c`.
- Tested corrected source: `e2786ac606f3b881b84a8a324be97a3f5d625d01`.
- GitHub Actions run: [34079179076](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34079179076). Its trigger commit is `ca6b8210568b23c36b9d20a3f2d811c0c7198647`; the integration job produced the tested source above before the tests checked it out.
- Questions 1–25 and 51–175 are byte-preserved. All 175 IDs remain unique and unchanged. Only the 25 Batch 2 question objects changed.
- Full new wording, assumptions, choices, solutions and all-option rationales are retained in `revisions.json`; the completed question-level disposition is in `question-audit-tracker.json`.

### Completion and findings

| Required category | Result |
|---|---|
| Questions individually reviewed, independently answered and retested | 25/25: Q26–50 |
| Passed without changes | 0 |
| Corrected | 25 |
| Incorrect stored answer indices / changed indices | 0 / 0 |
| Material overclaims in original keyed content | 3: Q30, Q32 and Q49; corrected without moving the intended answer position |
| Explanation references to the wrong option letter | 5: Q40, Q41, Q43, Q46 and Q49 |
| Cross-question framing or references removed | 11: Q26–30, Q40, Q44, Q46–47 and Q49–50 |
| Incorrect ASQ II.D title corrected | 9: Q32, Q34, Q36, Q38, Q40, Q42, Q44, Q48 and Q50 |
| Correct-choice length cue | Originally the keyed option was uniquely longest in 25/25 items; after revision, 2/25. Median correct-to-median-distractor word ratio fell from 3.3571 to 0.96. This is a wording heuristic, not psychometric calibration. |
| Exact duplicate stems involving this batch | 0 against the 450 MBB stems in Sets 1–3 |
| Near-duplicate decision tasks corrected during review | 2: Q26 versus Batch 1 Q5; Q40 versus Q49 |
| Item charts, tables, equations, images and interactive visuals | None in this text-only batch; those item-specific checks are not applicable |
| Missing context, assumptions or ambiguous conclusions | Corrected individually as recorded below and in `revisions.json` |

### Question-by-question disposition

Every row passed after correction. IDs below all carry the prefix `mbb:set-3:`. All four options and their explanations were validated for each question; answer positions were preserved.

| Question | ID suffix | Key | Specific correction and independently validated decision |
|---|---|---|---|
| 26 | d1-071 | D | Replaced dependent infrastructure synthesis with a self-contained measurement-comparability decision. Local target normalization and a shared dashboard do not reconcile incompatible delivery definitions. This now differs from Q5's benefits-verification task. |
| 27 | d1-072 | A | Removed a universal selection rule. An existing process with unverified causes warrants DMAIC investigation; two failed attempts do not prove architectural incapability. Kaizen itself is not excluded from DMAIC. |
| 28 | d1-073 | D | Distinguished a diagnostic charter from authorization of a purportedly proven solution. Added missing-shift/product-mix limitations and rejected correlation as proof of an overtime effect. |
| 29 | d1-074 | A | Made deadline, capacity and safe deferral conditions explicit. Six full assignments cannot cover seven full demands without an authorized resource tradeoff. Priority scores do not create capacity. |
| 30 | d1-075 | C | Removed the unsupported assertion of one root cause and a rigid recovery sequence. Contain overload while establishing strategy, capacity and benefit baselines together rather than validating benefits only afterward. |
| 31 | d2-001 | A | Replaced automatic claims about matrix benefits with explicit local decision rights, central technical oversight, joint priorities and conflict arbitration. |
| 32 | d2-004 | B | Lower near-miss report counts no longer imply either safer operations or a proven fear-of-blame cause. Require exposure, reporting-access and confidential staff evidence. |
| 33 | d2-007 | B | A span of 25–30 reports is a workload signal, not proof of overload or a universal threshold. Assess actual workload, champion authority and protected capacity. |
| 34 | d2-010 | D | Recognition now depends on verified customer benefit, collaboration, transparent attribution and privacy-sensitive channels; it need not always be public. |
| 35 | d2-013 | D | Distinguished a divisional administrative home from the demonstrated absence of cross-divisional authority. Joint sponsorship and resource commitments address the gap; relocation alone does not. |
| 36 | d2-016 | A | Distinguished approved improvement suggestions from unauthorized safety-critical changes. Corrected the values–practice inconsistency without discarding controlled change approval. |
| 37 | d2-019 | B | Defined an executable matrix control: joint workload agreements and a named timely arbitration authority for two incompatible full-capacity commitments. |
| 38 | d2-022 | A | Separated instrument validity, representative coverage and response candor. Added confidentiality and fit-for-use limits; modified instruments are not automatically comparable with original benchmarks. |
| 39 | d2-026 | A | Replaced causal inference from completion differences with a documented travel/coverage barrier. Pilot blended participation that also accounts for variable connectivity. |
| 40 | d2-029 | D | Corrected option-letter and source errors, then differentiated the item from Q49. It now tests observable values-to-behavior transfer, not franchise staffing rights; training completion alone is not implementation evidence. |
| 41 | d2-032 | A | Corrected option-letter references and the implication that lightweight deployment can be informally accountable. A limited pilot still needs an owner, protected time, technical support and benefit verification. |
| 42 | d2-035 | D | Completed just-culture distinctions among human error, at-risk behavior and reckless conduct. Replaced automatic loss-based punishment with fair behavior-based review without promising blanket immunity. |
| 43 | d2-038 | C | Corrected option-letter references and off-season-only evidence risk. Use proportionate temporary-worker training and direct peak-season data with permanent ownership; 60% temporary means 40% permanent, not that temporary input is dispensable. |
| 44 | d2-041 | C | Removed a cross-question reference and exclusive causal claim about incentives. Pilot protected improvement time with individual/team measures and care-quality safeguards. |
| 45 | d2-044 | A | Distinguished immediate safety containment from long-term deployment design. Extend accountable coverage to storefront failures with risk-proportionate support; plant inspection does not control later display conditions. |
| 46 | d2-048 | A | Corrected the option-letter mismatch and cross-reference. Add prompt event-level evidence, exposure denominators, common definitions and follow-up, while retaining periodic synthesis. |
| 47 | d2-051 | B | Removed cross-question dependence. Provide protected all-shift representation and common evidence-based prioritization instead of relying on day-shift proxies or equal proposal quotas. |
| 48 | d2-054 | C | Removed an unsupported zero-impact assurance. Co-define scope and test product-condition safeguards; an administrative label does not eliminate operational interfaces. |
| 49 | d2-057 | A | Corrected option-letter references and the claim that independent ownership makes requirements voluntary. The scenario now explicitly distinguishes common obligations from locally controlled staffing methods; it asserts no general franchise-law rule. |
| 50 | d2-060 | D | Removed a cross-reference and unqualified interpretation of totals. Use avoidable waste per meal with safety/service safeguards and transparent cost/mission tradeoffs. |

### Content, calculations and source verification

All questions were solved as independent cases before accepting their intended keys. All 100 choices were evaluated; the revised explanations include a distinct rationale for each choice. Distractors were rewritten to represent specific governance, inference or measurement mistakes rather than implausible slogans, blanket prohibitions or obviously short throwaway alternatives.

This batch does not contain quantitative inferential-statistics problems. Degrees of freedom, p-values, confidence intervals, DOE aliases, control limits and capability formulas are therefore not applicable here. The actual numerical relationships were checked: seven full demands exceed six assignments; two full-capacity commitments exceed one person's capacity; 100% minus 60% equals 40%; raw totals are not equivalent to exposure-normalized rates. Counts of sites or direct reports do not establish universal staffing prescriptions. No missing numeric dataset was invented.

The ASQ CMBB Body of Knowledge was checked for topic locators. II.D is **Organizational Change Management**, including II.D.6 culture-change techniques; the original alternative title was wrong. ASQ's DMAIC reference supports the existing-process/method distinction in Q27. AHRQ PSNet's Culture of Safety discussion supports the reporting and just-culture distinctions used in Q32 and Q42. These sources establish principles and topic alignment, not authorship or endorsement of the original scenarios. Full source details and limitations are in `sources.json`. No unverified textbook page number is presented as a citation.

### Visual and functional corrections

The batch now uses the same reviewed presentation contract as Batch 1 under a separate, exact-ID-scoped namespace. The integration supplies readable theme-aware choices and explanations, visible selected/flag states, accessible state attributes, question focus handling, mobile wrapping, complete option rationales and consistent review feedback. The issue form retains its native hidden/open state and readable controls. The renderer cannot capture Batch 1, later Set 3 items or another exam by accident; that exclusion is tested.

All 25 questions were visually examined individually after correction on desktop/mobile in light/dark mode, both during the question and in expanded answer review: 200 primary Chromium screenshots. WebKit additionally received all 200 automated render checks; targeted inspection confirmed the complete Q27 footer and the accepted Q50 expanded review. No chart, table or slider was silently removed or falsely reported as tested.

Some Chromium element screenshots contain an unpainted bottom tail. The companion WebKit capture shows the complete footer. The sticky site header is temporarily hidden only during element capture, preserving layout; actual clicks and geometry checks run with the normal page. These capture details are recorded in `visual-inspection.json` rather than hidden.

### Tests and retests

| Test | Final result |
|---|---|
| Dedicated Batch 2 content, preservation, scope and grading tests | **33/33 passed** |
| Actual-player grading, every option of every audited question | **100/100 outcomes correct**: 25 correct-answer and 75 incorrect-answer outcomes |
| Complete repository suite | **1,519/1,519 passed**, zero failures, cancellations or skips |
| Chromium desktop: question/review, both themes | **100/100 rendered checks passed** |
| Chromium mobile: question/review, both themes | **100/100 rendered checks passed** |
| WebKit desktop: question/review, both themes | **100/100 rendered checks passed on accepted rerun** |
| WebKit mobile: question/review, both themes | **100/100 rendered checks passed** |
| Final browser error, overflow, clipping and scoped axe checks | **0 detected failures** across the accepted 400 render cases |
| Preservation | Q1–25 and Q51–175 raw source hashes unchanged; all 175 qids unchanged and unique |

The real player was used to select Set 3, start the full exam, select all choices, use Space-key selection, revisit answers, retain a flag, check the timer, open/close calculator/formula/table drawers, submit, filter reviews, read explanations and expand feedback. The issue form was opened, populated, used to prepare a mailto link and closed; no message was sent. Browser sessions deliberately answered only the audited 25 questions, producing the expected 25/175 score with 150 untouched unanswered items. That is a controlled grading check, not a 175-question semantic audit.

The initial test fixture exposed MutationObserver callbacks after JSDOM teardown. Tracking and disconnecting fixture observers fixed that lifecycle error without suppressing runtime assertions. The browser driver was also corrected to stabilize the actual review-tab click instead of racing smooth scrolling. A later WebKit desktop run reached 98 records and timed out opening Q50 feedback; the identical source and driver passed all 101 records, including its session record, when that job was rerun. The incomplete artifact is not counted as passing evidence. All accepted artifact IDs, hashes, log hashes and the rerun job ID are in `browser-summary.json`.

### Files changed by Batch 2

Application files: `test-bank-mbb-set3.js`, `test-bank-mbb-set3-batch2-ui.js`, `test-bank.html`, `test-bank-feedback-loop.js`.

Validation/integration files: `tests/test-bank-mbb-set3-batch2-audit.test.js`, `tests/test-bank-mbb-set3-batch1-audit.test.js`, `scripts/audit-mbb-set3-batch2.mjs`, `scripts/apply-mbb-set3-batch2.mjs`, `scripts/resolve-mbb-set3-batch2-duplicates.mjs`, `.github/workflows/mbb-set3-batch2-audit.yml`.

Audit records under `docs/audits/mbb-set3-batch02/`: `revisions.json`, `duplicate-resolution.json`, `preservation.json`, `question-audit-tracker.json`, `browser-summary.json`, `visual-inspection.json`, `psychometric-duplicate-screen.json`, `sources.json`, `dependency-review.json`, `report.md`.

The existing Batch 1 exclusion test now starts at Q51 because Q26–50 were explicitly authorized for this batch. The new Batch 2 test independently locks the first 25 questions' bytes, so this does not weaken protection of Batch 1 content. Package manifests and dependency versions were not changed.

### Remaining concerns and release boundaries

No confirmed Q26–50 content or rendered-card defect remains from this review. The following limits remain explicit:

1. Authentication and remote persistence were isolated fixtures. Production sign-in, durable server storage and cross-device synchronization were not certified. Mobile layouts were tested in browser emulation, not on physical handsets.
2. The isolated WebKit desktop click timeout did not recur on the accepted complete rerun. It remains a test-reproducibility concern; a passing rerun is not evidence that intermittent failures are impossible.
3. npm's existing dependency scan reported 11 affected-package entries overall, including one critical development dependency entry, and eight entries in the production dependency graph, including three high entries. These counts can repeat the same underlying advisory through a dependency chain. Reachability/exploitability was not established. See `dependency-review.json`; this question-bank patch is not a repository security clearance.
4. No candidate-response dataset was analyzed. Difficulty, discrimination, reliability and differential item functioning remain uncalibrated. Expert review and wording screens do not replace empirical psychometric validation.
5. The rest of Set 3 still requires its consecutive content audits. No readiness claim is made for Q51–175 by this Batch 2 report.

**Disposition: Batch 2 passed after corrections in the tested review build. Human review and merge remain required. Stop at Q50.**

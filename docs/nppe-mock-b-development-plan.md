# Set 1 Mock B — development and pre-authoring plan

**Status: ALL ELEVEN BATCHES AUTHORED (110/110), release-held; next whole-form editorial and functional QA.** Owner ChatGPT / Set 1, form ID `set-1-mock-b`. Existing PR #301 stays OPEN/DRAFT. No Mock A release-hold change, deployment, learner grant, merge or data migration is authorized by this plan.

## 1. Pinned assumptions and official specification

The [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) still describes the **2017** blueprint as current when checked October 18, 2026, although it announces a review. Recheck the official page before each release decision; do not assume a future blueprint. The [official exam-format page](https://www.nppexam.ca/en/preparation/exam-format/) specifies 110 MCQs, one best answer from four choices, 100 operational/scored and ten experimental/unscored, 150 minutes, no negative marking, and no visible indication of which questions are experimental. The simulator's ten **simulated** unscored items have not been field tested.

The simulator must remain a separate original educational work: no publisher instructor test-bank reuse, recalled official items, official pass guarantees, or equivalent scaled-score claims. Explicit jurisdiction and effective-date assumptions are required for all legislation.

## 2. Item and runtime contract

- **IDs reserved:** NPPE-281 through NPPE-390, inclusive, eleven nonoverlapping ten-item batches.
- **Canonical IDs:** `nppe:set-1:mock-b:281` through `nppe:set-1:mock-b:390`.
- **Ownership:** `authorSet:1`, `author:'ChatGPT'`, `bank:'mock'`, `form:'set-1-mock-b'`, `original:true`, initial `version:1`. Subsequent material revisions increment version, preserve IDs and audit provenance.
- **Sources:** each item needs a specific blueprint locator plus authoritative proposition-bearing source(s), with title, locator, sourceType, URL, retrieval/effective dates in supporting audits, and binding jurisdiction stated. Do not confuse national professional guidance with provincial/territorial statute.
- **Schema:** `blueprint`, `sub`, `difficulty`, `cognitiveLevel`, `questionFamily`, `learningObjective`, `jurisdiction`, `stem`, four unique `options`, zero-based `answer`, four mapped `optionRationales`, `keyPoint`, `trap`, and `sources`. Enforce one defensible answer, independent scenario facts, no answer cues in adjacent questions, plain Canadian English and accessible mathematical notation where used.
- **Files:** prepare `test-bank-nppe-mock-b-batch1.js` through `batch11.js` only as batches are genuinely authored. Use the established idempotent, fail-closed batch registrar and protected build loader pattern; do not copy Mock A answers/scenarios into Mock B.
- **Availability:** pre-authoring and partial form must be nonlaunchable. Keep `releaseHold:true` even at 110/110 until expressly authorized. Never borrow questions from Diagnostic, Learning, A, C, Grok D or Claude E to fill missing slots. No reveal during an active mock, timed **or** untimed. Explanations only after submission.
- **Scoring:** a completed form has 110 distinct objects and 100 scored + 10 simulated unscored. Scored denominators exclude unscored responses. Practice scores must never be presented as an official NPPE scaled score.

## 3. Form blueprint and scheduling

Use the existing Mock A valid allocation as a **starting proposal**, not an asserted exact official distribution. The official domain ranges shown on the published blueprint are I 7–10; II 17–21; III 27–32; IV 23–28; V 7–10; VI 7–10. Those published ranges refer to domain distribution; count the **100 scored items** against them. Mock B proposal:

| Domain | Scored | Simulated unscored | Total |
|---|---:|---:|---:|
| I Professionalism | 8 | 1 | 9 |
| II Ethics | 20 | 2 | 22 |
| III Professional Practice | 30 | 3 | 33 |
| IV Law for Professional Practice | 26 | 2 | 28 |
| V Professional Law | 8 | 1 | 9 |
| VI Regulation/Discipline | 8 | 1 | 9 |
| **Total** | **100** | **10** | **110** |

The preliminary 110-row [allocation ledger](nppe-mock-b-allocation-ledger.csv) reserves every NPPE-281–390 slot, planned scored/unscored role, primary numbered blueprint topic, and per-batch disposition, with all 40 topics assigned at least one scored sample. Its assignments are **provisional**: revise and document them when necessary for defensible item writing, but preserve the final domain totals and scored coverage. Do not convert planned rows into authored questions merely because an ID exists. Topic allocation **is an internal quality criterion**, not an official NPPE per-form mandate. Allocate case complexity based on substantive requirements and test decisions, not quotas of `hard` labels. Prepare a scored/unscored ledger before writing Batch 1 and update it after every batch; keep scored roles hidden from candidate UI.

| Batch | IDs | Delivery milestone |
|---|---|---|
| 1 | 281–290 | Original questions, four rationales and source verification |
| 2 | 291–300 | Same |
| 3 | 301–310 | Same |
| 4 | 311–320 | Same |
| 5 | 321–330 | Same |
| 6 | 331–340 | Same |
| 7 | 341–350 | Same |
| 8 | 351–360 | Same |
| 9 | 361–370 | Same |
| 10 | 371–380 | Same |
| 11 | 381–390 | Same; then whole-form review |

**Batch gate:** do not commit a batch until its ten complete questions pass individual one-best-answer and all-option rationale checks, source specificity, legal date/currency checks, within-form and cross-bank overlap screen, count/ID checks, answer cue review, and automated fixture tests. Maintain exact batch audit and revision notes.

## 4. Content differentiation from Mock A

Mock A's completed audit identifies disproportionate emphasis on remedies and limitation periods, straightforward distractors, limited deeper analytical reasoning, and shallow sampling of some topics. Prioritize distinct factual decisions in Mock B (without weakening the proportional blueprint):
- Contract **formation**, offer/acceptance, **agency/authority**, interpretation and changed circumstances, rather than reusing mitigation/remedies fact patterns.
- Tort **duty, breach, causation**, foreseeability and professional standard of care; construction liens/holdbacks distinctly from surety bonds.
- Charter rights, interprovincial mobility, federal criminal occupational-health/safety duties, regulatory differences and bilingual/plain-language accessibility of public communications.
- Professional accountability for software, working with interdisciplinary teams, geology/geoscience practice, climate risk and environmental review; confidentiality, quality management and responsible reliance on others.
- Laws must name the governing province/territory or federal provision and relevant version; avoid a single province dominating nationally applicable scenarios.
- Use credible wrong options, multi-step factual reasoning and consequential choices while retaining a single unambiguous best answer. Balance answer-key positions with review but do not manufacture arbitrary difficulty.

No text, names, case facts or exact decision logic may be reused verbatim from the other 500 existing bank objects. Theme overlap is inevitable for syllabus topics; distinguish each new scenario's controlling facts and decision.

## 5. Required independent quality gates

1. **Before Batch 1:** automated readiness tests pass, published blueprint rechecked, ID range and registrar rules pinned, topic and experimental-slot allocation ledger drafted. No external reviewers or production credentials needed for authoring.
2. **Per batch:** ten original complete questions + batch audit; sourced jurisdiction-specific review; targeted tests and protected build/public-leakage check. All questions remain inaccessible to learners.
3. **At 110/110:** independent whole-form editorial audit, duplicate/cue analysis, key distribution, six domains and forty topic checks, browser matrix across viewport and themes, score/exclusion tests, reveal denial and 440 explanations.
4. **For eventual release:** independent qualified engineering/geoscience and Canadian-law review; manual accessibility; consented psychometric calibration; authorized production-account request/grant/attempt/revocation; explicit release authorization. These are separate from author/editor and CI checks. **Mock A's unresolved release gates do not prevent isolated Mock B authoring, but they cannot be deemed completed by Mock B development.**

## 6. Current readiness decision

**Batches 1–11 NPPE-281–390 are authored and integrated only within protected NPPE delivery. Next scope: comprehensive whole-form editorial and functional QA, then independent review and calibration gates, subject to exact-head QA.** Mock B is now **110/110**, comprising 100 provisionally scored and 10 simulated unscored. This is *authoring readiness*, not publication readiness. Batch 1 remains incomplete at the form level; do not populate later batches with placeholders or display Mock B as complete. The first batch must keep all release protections intact.

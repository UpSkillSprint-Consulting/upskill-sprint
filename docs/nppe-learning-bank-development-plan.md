# NPPE Set 1 Learning Bank — 120-question blueprint and batch controls

**Architecture:** ChatGPT owns only Set 1 Diagnostic (50), Learning (120), Mock A/B/C (110 each). Grok's Set 2 Mock D (110) and Claude's Set 3 Mock E (110) are immutable from this workflow. Learning remains a separate question source; no Diagnostic or Mock items are reused or silently substituted.

## Learning Bank target allocation

The official NPPE 2017 blueprint remains the published current blueprint as at October 2026. Question allocation below is a **project authoring target, not an official 120-question exam blueprint**. The actual NPPE has 100 scored items and 10 unscored items across 150 minutes; this Learning Bank is not a live-exam form.

| Domain | Learning target | Batches 1–12 authored | Remaining |
|---|---:|---:|---:|
| I Professionalism | 10 | 10 | 0 |
| II Ethics | 22 | 22 | 0 |
| III Professional Practice | 36 | 36 | 0 |
| IV Law for Professional Practice | 32 | **32** | 0 |
| V Professional Law | 10 | 10 | 0 |
| VI Regulation, Review & CPD | 10 | 10 | 0 |
| **Total** | **120** | **120** | **0** |

The first batch intentionally samples the **four topics not directly sampled** in the 50-question Diagnostic: IV.1 (2), IV.10 (2), IV.13 (3) and IV.14 (3). Later batches must cover the remainder of the blueprint, including human rights and privacy, international licensing, Indigenous law, real property, securities disclosures and delay claims as justified by sources.

## Batch allocation for later authoring

| Batch | Question IDs | I | II | III | IV | V | VI | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| **1** | **051–060** | 0 | 0 | 0 | 10 | 0 | 0 | 10 |
| **2** | **061–070** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **3** | **071–080** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **4** | **081–090** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **5** | **091–100** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **6** | **101–110** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **7** | **111–120** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **8** | **121–130** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **9** | **131–140** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **10** | **141–150** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **11** | **151–160** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **12** | **161–170** | **0** | **2** | **6** | **2** | **0** | **0** | **10** |
| **Total** | 051–170 | **10** | **22** | **36** | **32** | **10** | **10** | **120** |

Within each batch, proactively select different numbered subtopics and question families. An equal ten-question mini-batch does not have to look like a mini live-exam form; fidelity is evaluated over the full bank.

## Assessment design and source provenance

- All questions original. Four options, one defensible key, why each option is correct or incorrect, key learning principle, misconception, subtopic, cognitive demand and provisional difficulty. No publisher instructor questions or recalled examination questions.
- For legal rules, identify jurisdiction and version/effective date. The 2007 Samuels/Sanders textbook provides structure and context only, especially because its international-law section references superseded NAFTA and overgeneralizes treaty supremacy. **CUSMA Article 16.4 and Canadian constitutional/treaty implementation authorities supersede it for current law.**
- Case-law standards, Charter applicability, employment accommodation, PIPEDA uses, Crown consultation obligations, rights of way and contract notice require identified authorities; do not invent a Canada-wide universal rule where jurisdiction matters.
- Provisional cognitive target for 120 items: about 24 understanding, 72 application, 24 integrated analysis. **Not** a claim of the true NPPE percentages. Avoid a key-length, position, absolute-language or grammatical cue.
- Record exact questions and options in versioned JS authoring source. Never change an existing item in place without a documented audit. Each new batch extends `window.NPPE_LEARNING` before the runtime registers the Learning form, validates predecessor IDs, and preserves object identity for already-released questions.
- Practice results: timed or untimed. Revealed answers are an **assisted learning record**, not a fresh readiness attempt. A raw learning percentage must not be mapped to NPPE's official equated passing score. Learning question retrieval must be authorized through the same server-side exam permission check used by the rest of NPPE.
- Keep mock-only 110/150 requirements for Mock A–E. Never mix Learning/Diagnostic questions into mocks.

## Release gates

1. Editorial authoring and source-validation review of each ten-question batch, including all option explanations.
2. Cross-pool duplicates/reworded-content audit, answer-length position distribution and blueprint subtopic ledger.
3. Protected package validation, mobile keyboard/touch QA in Chromium and WebKit, no answer leakage for timed exams, and learning-only Reveal Answer when untimed.
4. Independent professional legal/engineering SME sign-off and candidate-based calibration before any claim of exam-equivalent difficulty.
5. Production learner request → admin approval → practice → revocation/end-of-entitlement verification. Supabase publication `coming_soon` and draft PR #301 unchanged without approval.

## Batches 1–12 status

**Learning Batch 1, NPPE-051–060:** ten law-focused items covering the four law subtopics not directly sampled in the Diagnostic. **Learning Batches 2–11, NPPE-061–160:** one hundred new questions covering all six domains under the balanced authoring allocation (I 1, II 2, III 3, IV 2, V 1, VI 1 in each batch). **Batch 12, NPPE-161–170**, adds the final ten with allocation **I0 / II2 / III6 / IV2 / V0 / VI0**. The Learning Bank has **120/120 authored questions**, **164-minute timed mode or untimed study**, and a complete-bank status in the protected runtime. All six domain totals match the project allocation. No Learning questions remain unauthored.

Full questions, option explanations, source qualifications and originality reviews remain in the twelve batch documents, ending with `docs/nppe-learning-batch12-161-170.md`. Diagnostic stays 50/50; Mock A has 110/110 authored (explicit release hold; disabled); Mock B/C remain 0/110 each; Mock D/E remain unchanged.

Whole-bank provisional classifications are **23 understanding / 79 application / 18 analysis** and **23 easy / 97 medium / 0 hard**. The approximate cognitive target was 24/72/24; labels were not inflated to make those totals match. Keys are **A31/B30/C33/D26**. Independent review and candidate evidence, rather than mechanical relabelling, must determine revisions.

**Comprehensive editorial review completed:** see `docs/nppe-learning-comprehensive-review.md`. Eight explicitly versioned revisions preserve all 120 IDs, keys and domain totals. V.1 is sampled by 099 (remapped existing licence-scope decision); V.4 by 159 (replacement society-benefits decision). All 40 numbered topics now have at least one primary tag; this is not exhaustive bullet-level coverage. The duplicate retention-format scenario in 106 is replaced with a continuing-use retention trigger.

**Next:** Independent Mock A SME review and calibration planning following `docs/nppe-mock-a-comprehensive-review.md`. Independent SME approval, empirical calibration and production-account verification remain separate release gates.

The published NPPE page still identifies the 2017 blueprint while announcing an expected mid-2026 review; recheck for a replacement before release. Authored completeness, automated QA, independent content approval, empirical calibration and production-account verification remain separate requirements. PR #301 stays DRAFT and NPPE stays `coming_soon` pending authorization.

# NPPE Set 1 Learning Bank — 120-question blueprint and batch controls

**Architecture:** ChatGPT owns only Set 1 Diagnostic (50), Learning (120), Mock A/B/C (110 each). Grok's Set 2 Mock D (110) and Claude's Set 3 Mock E (110) are immutable from this workflow. Learning remains a separate question source; no Diagnostic or Mock items are reused or silently substituted.

## Learning Bank target allocation

The official NPPE 2017 blueprint remains the published current blueprint as at October 2026. Question allocation below is a **project authoring target, not an official 120-question exam blueprint**. The actual NPPE has 100 scored items and 10 unscored items across 150 minutes; this Learning Bank is not a live-exam form.

| Domain | Learning target | Batches 1–5 authored | Remaining |
|---|---:|---:|---:|
| I Professionalism | 10 | 4 | 6 |
| II Ethics | 22 | 8 | 14 |
| III Professional Practice | 36 | 12 | 24 |
| IV Law for Professional Practice | 32 | **18** | 14 |
| V Professional Law | 10 | 4 | 6 |
| VI Regulation, Review & CPD | 10 | 4 | 6 |
| **Total** | **120** | **50** | **70** |

The first batch intentionally samples the **four topics not directly sampled** in the 50-question Diagnostic: IV.1 (2), IV.10 (2), IV.13 (3) and IV.14 (3). Later batches must cover the remainder of the blueprint, including human rights and privacy, international licensing, Indigenous law, real property, securities disclosures and delay claims as justified by sources.

## Batch allocation for later authoring

| Batch | Question IDs | I | II | III | IV | V | VI | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| **1** | **051–060** | 0 | 0 | 0 | 10 | 0 | 0 | 10 |
| **2** | **061–070** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **3** | **071–080** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **4** | **081–090** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| **5** | **091–100** | **1** | **2** | **3** | **2** | **1** | **1** | **10** |
| 6–11 (each) | 101–160 (six batches of 10) | 1 | 2 | 3 | 2 | 1 | 1 | 10 each |
| 12 | 161–170 | 0 | 2 | 6 | 2 | 0 | 0 | 10 |
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

## Batches 1–5 status

**Learning Batch 1, NPPE-051–060:** ten law-focused items covering the four law subtopics not directly sampled in the Diagnostic. **Learning Batches 2–5, NPPE-061–100:** forty new questions covering all six domains under the balanced authoring allocation (I 1, II 2, III 3, IV 2, V 1, VI 1 in each batch). The Learning Bank now has **50/120 questions**, with a **69-minute timed mode or untimed study mode**. Full answers, distractor explanations and source notes are in `docs/nppe-learning-batch1-051-060.md`, `docs/nppe-learning-batch2-061-070.md`, `docs/nppe-learning-batch3-071-080.md`, `docs/nppe-learning-batch4-081-090.md` and `docs/nppe-learning-batch5-091-100.md`. **70 questions remain to be authored.** Next: **Batch 6, NPPE-101–110**, using I1 / II2 / III3 / IV2 / V1 / VI1. Batch 5 adds two provisionally classified integrated-analysis items; further analysis items remain an authoring requirement; provisional classifications must reflect actual demand rather than the target count.

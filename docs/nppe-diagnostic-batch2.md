# NPPE Set 1 Diagnostic — Batch 2 (011–020)

## Scope and integrity

- Ten **original** four-option, single-best-answer items; stable IDs `nppe:set-1:diagnostic:011`–`020` (legacy NPPE-011–020).
- Set 1 Diagnostic now holds **20 / 50** planned questions; all 20 are scored. Six-domain cumulative counts: I 2, II 4, III 6, IV 4, V 2, VI 2.
- Batch 2 counts: I 1, II 2, III 3, IV 2, V 1, VI 1.
- Source basis: Andrews, Shaw & McPhee (2019), Samuels & Sanders (2007), and Marston (2008). Locators and rationales are recorded per item. These books are historical teaching references, not substitutes for current legislation or regulator rules.
- No questions from the restricted Pearson instructor test-item file were imported or paraphrased. The item bank must not be represented as an official NPPE exam or as psychometrically equivalent to it.

## Item audit (editorial)

| ID | Domain | Theme | Difficulty (provisional) | Correct option |
| --- | --- | --- | --- | --- |
| 011 | I.3 | Self-regulation and public protection | Medium | B |
| 012 | II.4 | Supplier gifts and independence | Medium | C |
| 013 | II.4 | Serious safety risk and escalation | Medium | D |
| 014 | III.5 | Design changes and hazard assessment | Medium | A |
| 015 | III.3 | Independent review, consultation and professional courtesy | Medium | B |
| 016 | III.1 | Delegation and missing inspection evidence | Medium | D |
| 017 | IV.3 | Negligence without contractual privity | Hard | C |
| 018 | IV.2 | Express intention not to be bound | Medium | B |
| 019 | V.2 | Interprovincial licensing | Medium | A |
| 020 | VI.1 | Fair complaint investigation | Medium | D |

All items have four distinct options, exactly one intended correct answer, a rationale for each option, a learning objective, key principle, common distractor trap, jurisdiction caveat, blueprint mapping and source locators. Cognitive levels are application or analysis. Correct-answer distribution is A 2, B 3, C 2, D 3. Difficulty and blueprint mapping are provisional pending independent professional review.

## Runtime and regression expectations

- New authoring file: `test-bank-nppe-diagnostic-batch2.js`, loaded **before** the existing Diagnostic registrar in the authorized NPPE-only package.
- Registrar appends Batch 2 and preserves Mock D and E without modification.
- Diagnostic supports a 28-minute timed practice or untimed mode for 20 questions; all answer aids remain hidden until submission.
- UI displays **20 of 50 planned** and scores 20 items. Retakes reuse the same 20 items and do not establish readiness.
- Update unit and served browser tests for 20 questions, navigation, score, domain feedback, and 320/390/1440-pixel layouts.
- NPPE remains `coming_soon`, and PR #301 stays in draft. No production account grant, database migration or publication change is included.

## Outstanding gates

1. Confirm latest commit's GitHub Actions and browser audits, including all six width/theme combinations in Chromium and WebKit.
2. Independently check every legal item against current jurisdiction-specific statutes, regulator requirements and relevant case law; textbooks are not legal authorities for 2026.
3. Pilot the items for empirical difficulty/discrimination and verify blueprint distribution before release.
4. Complete Diagnostic Batches 3–5 and verify the deployed learner/admin access journey.

## Blueprint tag correction — 2026-10-14

Checked against the official NPPE 2017 blueprint published at https://www.nppexam.ca/en/preparation/blueprint/. Corrected metadata only for 013 II.5→II.4, 014 III.4→III.5, 015 III.6→III.3, 016 III.5→III.1, 017 IV.4→IV.3, 018 IV.1→IV.2, and 020 VI.2→VI.1. Stem, four options, correct answer, rationales, source locators, and parent domain for each item are unchanged. Tests assert these exact subtopics to prevent reintroducing erroneous labels. These changes do not imply independent legal review of the answers.

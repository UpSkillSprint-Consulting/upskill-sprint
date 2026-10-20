# Mock B Batch 6 — NPPE-331–340 editorial and source audit

Date: October 18, 2026. **Ten original author/editor-drafted items; Mock B total 60/110.** All ten are provisionally scored and explicitly held. Independent qualified engineering/geoscience SME review, Canadian-law review, and empirical item calibration **have not occurred**. Mock B is not learner launchable.

## Item review ledger

| ID | Blueprint | Proposed key | Assessment distinction | Source basis and uncertainty |
|---|---|---|---|---|
| NPPE-331 | I.1 | A | Self-regulation demands proportionate member participation and public-interest service beyond dues | NPPE 2017 blueprint I.1; Engineers Canada *Good Character* guideline (national nonbinding) |
| NPPE-332 | V.1 | D | Corporate policy cannot grant practice authority that provincial/territorial legislation reserves to regulators | Engineers Canada public guideline on engineering practice in Canada; confirm destination jurisdiction |
| NPPE-333 | VI.1 | B | Ontario discipline respondent can examine intended documentary evidence before a hearing | Ontario Professional Engineers Act s.30(2); official statutory indexed text, currency and exceptions require counsel |
| NPPE-334 | II.3 | C | Emerging hazardous technology requires refreshed competence and appropriate specialist input | Engineers Canada code-of-ethics guideline principle 6; national guidance |
| NPPE-335 | III.6 | D | Use credible future climate information and lifecycle adaptation for long-lived pumping infrastructure | Government of Canada National Adaptation Strategy infrastructure objectives; policy context rather than binding design standard |
| NPPE-336 | IV.14 | A | Crown retains constitutional duty to consult while relying on technical/procedural proponent efforts | *Haida Nation v. BC (Minister of Forests)*, 2004 SCC 73, paras. 35–37, 53; expert legal confirmation pending |
| NPPE-337 | III.7 | B | Preserve cybersecurity evidence and assess engineering-data integrity following suspicious access | Canadian Centre for Cyber Security incident-response guidance; programmatic URL and effective-date check pending |
| NPPE-338 | II.4 | C | Concealed foreign-official payment needs refusal/escalation, not customary or accounting justification | Federal Corruption of Foreign Public Officials Act s.3 plus Engineers Canada ethics; jurisdiction/factual analysis by counsel pending |
| NPPE-339 | IV.1 | C | Charter s.32 governmental scope differs from Ontario Human Rights Code private employment protections | Constitution Act 1982 s.32; Ontario Human Rights Code s.5; no governmental implementation in case facts |
| NPPE-340 | III.8 | D | Material change to authenticated B.C. engineering document requires reviewed, traceable revised authentication | EGBC Practice Advisor FAQs on sealing and authentication; regulator guidance, requirements dependent on document |

**Answer distribution:** A2/B2/C3/D3. **Provisional cognition:** 3 analysis (335,336,339), 7 application. **Difficulty:** ten medium, neither official nor empirical. All ten have four alternatives, four option-specific rationales, one proposed answer, jurisdiction, topic, learning objective, key point, error trap, item version, and source locators. No recalled official items or publisher test-bank questions were used.

## Source-access limitations

The [official NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) labels the 2017 blueprint as current on October 18, 2026. Engineers Canada [Code of Ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics) notes its national guidance is not a rule or legal standard. Ontario's [Professional Engineers Act](https://www.ontario.ca/laws/statute/90p28) section 30(2), Justice Canada's [Charter s.32 explanation](https://www.justice.gc.ca/eng/csj-sjc/rfc-dlc/ccrf-ccdl/check/art321.html), [EGBC document-authentication FAQ](https://www.egbc.ca/Registrants/Practice-Resources/Practice-Advice-Program/Practice-Advisor-Faqs), and Canada's [National Adaptation Strategy](https://www.canada.ca/en/services/environment/weather/climatechange/climate-plan/national-adaptation-strategy/full-strategy.html) were inspected as official or regulator evidence.

For NPPE-336 the legal point distinguishes Crown responsibility from proponent assistance; it does not assert that every meeting discharges the duty. Full-judgment legal review and context remain open. For NPPE-338 the question asks for an initial risk-responsive decision, not a determination of criminal guilt. NPPE-339 expressly excludes government action, avoiding the overbroad claim that no private action can ever engage the Charter. Professional legal review must verify applicable consolidated legislation and decisional context.

The Canadian Centre for Cyber Security incident-response link, the Engineers Canada practice-in-Canada guideline's precise edition, and the primary judgment URL for *Haida Nation* remain link-level/locator follow-up checks where source retrieval did not establish full underlying text for this batch. Such links are references, **not a claim of newly read complete judgments or policy documents**. Source-access uncertainty must remain visible to independent reviewers.

## Editorial differentiation and review gates

Items avoid repeating Mock B Batch 1's sponsor-veto regulation, Batch 3's anonymous design-file sharing and digital-as-built marking, and Batch 4's authentication of unsupported capacity claims. NPPE-331 tests member participation; 337 tests incident-evidence integrity and containment; 340 tests modifications made after a previously authenticated issue. Overlapping syllabus topics do not establish duplicate questions, but full bank-to-bank overlap screening remains a subsequent gate.

`test-bank-nppe-mock-b-batch6.js` appends to the existing bank after Batches 1–5, with idempotent reload and a reject-on-conflict guard. `scripts/build-exam-delivery.mjs` packages this script inside the authorized NPPE delivery only. `tests/nppe-mock-b-batch6.test.js` protects the 60-item count, source/rationale completeness, predecessor object identities, loader order, release hold, and public/cross-exam leakage. CI results must be tied to the actual final head SHA, not a previous passing run.

**Release remains held:** Mock A and B are not authorized. No production migration, permission grant, deployment or PR merge. Independent SME/legal reviews, manual accessibility checks, real candidate calibration, controlled production-account verification and explicit release authorization remain open.

**Next planned authoring:** Mock B Batch 7, NPPE-341–350.

## Whole-form QA scoring-role amendment — 2026-10-18

NPPE-337 is now simulated unscored (version 2), swapped with scored NPPE-387 in Domain III.

The historical batch allocation text above is retained as an authoring record where inconsistent; this amendment and the current 110-row allocation ledger control. Source/legal and empirical release gates are unaffected.

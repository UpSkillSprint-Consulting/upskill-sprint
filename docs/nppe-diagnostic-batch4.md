# NPPE Set 1 Diagnostic — Batch 4 (NPPE-031–040)

## Scope

Ten original single-best-answer questions have been added to **Set 1 / ChatGPT / Diagnostic**, raising the available count from 30 to **40 / 50 planned**. All 40 items are scored. The platform's existing proportional timer gives **55 minutes** (`ceil(40 × 150 / 110)`) or an untimed option. The Diagnostic is still incomplete and its raw score is **not** an official NPPE scaled pass prediction.

## Question and blueprint audit

| ID | 2017 blueprint | Subject tested | Provisional difficulty | Cognition | Key |
|---|---|---|---|---|---|
| 031 | I.1 | Regulated professional status and public trust | Easy | Understanding | B |
| 032 | II.1 | Ethical conduct in cross-cultural settings | Medium | Application | A |
| 033 | II.3 | APEGS code of ethics as a regulatory obligation | Medium | Application | C |
| 034 | III.2 | Client loyalty versus material technical uncertainty | Hard | Analysis | D |
| 035 | III.8 | Superseded authenticated drawing in use on site | Hard | Analysis | B |
| 036 | III.10 | Clear technical communication for nontechnical decision-makers | Medium | Application | D |
| 037 | IV.4 | Quebec civil-law private contracts versus common law | Easy | Understanding | A |
| 038 | IV.7 | Licensed software, copyright and redistribution | Medium | Application | C |
| 039 | V.3 | Protected P.Eng. title and unauthorized practice in Saskatchewan | Medium | Application | B |
| 040 | VI.4 | BC continuing education records and routine work | Medium | Application | A |

**Batch 4 domain counts:** I 1 / II 2 / III 3 / IV 2 / V 1 / VI 1.  
**Cumulative counts after Batch 4:** I 4 / II 8 / III 12 / IV 8 / V 4 / VI 4 = **40**.

**Answer positions:** A 3, B 3, C 2, D 2. Difficulty labels are editorial (2 easy, 6 medium, 2 hard), **not** empirically calibrated. No fixed difficulty distribution is asserted to be official. Every item has four distinct alternatives and a separate rationale for each.

The active official NPPE page still labels the **2017 blueprint** as current as of 2026-10-14; this batch maps directly to its published named subtopics: https://www.nppexam.ca/en/preparation/blueprint/

## Evidence and jurisdiction audit

The following materials supported item concepts, answer keys and source locators. All explanatory material was independently authored; **no Pearson restricted instructor test item was reused**.

**User-provided textbooks (older editions, contextual rather than current governing law):**
- Andrews, Shaw and McPhee (2019), *Canadian Professional Engineering and Geoscience: Practice and Ethics*, 6th ed.: Ch. 1 pp. 14–15; Ch. 4 pp. 92–101; Ch. 7 pp. 169–170; Ch. 9 pp. 205–206 and 219–222; Ch. 10 pp. 231–238; Ch. 12 pp. 284–285; Ch. 17 pp. 419–425.
- Samuels and Sanders (2007), *Practical Law of Architecture, Engineering, and Geoscience*: Ch. 1 p. 4. **Explicit limit:** the supplied text does not teach Quebec's Civil Code; item 037 relies primarily on Justice Canada rather than the old textbook for the legal-system distinction.

**Current primary or regulator sources inspected:**
- [APEGS Code of Ethics](https://www.apegs.ca/complaints-enforcement/code-of-ethics): section 20 of the Regulatory Bylaws (item 033).
- [APEGS Practice and Title](https://www.apegs.ca/complaints-enforcement/practice-and-title): Saskatchewan title and authorization rules (item 039).
- [Justice Canada Fundamentals of Bijuralism](https://www.justice.gc.ca/eng/csj-sjc/harmonization/services_information/fundamentals-fondements.html): Quebec civil law in matters of private law (item 037).
- [Canadian Intellectual Property Office Software IP](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/intellectual-property-rights-software-canada) and [Transfer Ownership](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/copyright/transfer-ownership): licence versus assignment and software copyright (item 038).
- [Engineers Canada Code of Ethics Guideline](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics): professional statements, client duties and ethical conduct (items 034, 036). **National guidance, not legislation.**
- [Engineers and Geoscientists BC CE Program](https://www.egbc.ca/registrants/continuing-education/continuing-education-program): practising registrant CE plan, activity eligibility, records and declaration (item 040).

The legal-jurisdiction facts are stated in stems (Quebec governing law, Saskatchewan unlicensed advertisement, BC practicing registrant). No question asserts a regulator-specific rule is uniform across Canada. Model text was not substituted for a claimed textbook quotation.

## Structural and question-quality audit

- New questions have unique IDs `nppe:set-1:diagnostic:031`–`040`, original question-family identifiers, blueprint codes, cognitive demand, rationale for each option, page/section or current URL locators, and provisional difficulty.
- Source records distinguish textbook concepts, national guidance, current regulator rules and Canadian government descriptions.
- A cross-bank token-overlap screening inspected approximately 250 existing Diagnostic/Mock D/E stems. No identical stems or high-overlap drafts were detected; this **does not** establish psychometric independence.
- Batch 4 is loaded **after** Batch 3 and **before** NPPE runtime registration, only in the authorized NPPE delivery package.
- The registrar preserves existing question object identities and refuses missing, partial or conflicting precursor banks; identical repeated installation is idempotent.
- Set 2 Mock D and Set 3 Mock E remain untouched.
- Prior Batch 2 mapping issues were corrected explicitly before Batch 4 (013 II.5→II.4; 014 III.4→III.5; 015 III.6→III.3; 016 III.5→III.1; 017 IV.4→IV.3; 018 IV.1→IV.2; 020 VI.2→VI.1). Automated checks assert this exact list without changing prior answer keys or domain counts.

## Automated test and release gates

Updated regression tests require 40 unique items, all four batches of ten, six-domain counts, 55-minute timer, 40/40 grading, post-submission source review, hidden answers during both assessment modes, author-tab keyboard navigation, and isolation from Mock D/E. Served browser checks run 320px, 390px and 1440px, both themes, both Chromium and WebKit, including all new Batch 4 screens, retained answers/flags, logo geometry and horizontal-overflow assertions.

An earlier cross-site WebKit 320px dark-mode card contrast failure was corrected separately with explicit high-contrast heading text in `exam-directory.css`. That is a genuine accessibility regression fix and **not** a change to exam answers.

**CI results must be checked against the final commit** rather than earlier passing runs. External independent legal-content review and actual candidate calibration remain necessary. A real production learner/admin request → grant → practice → revocation journey has not been verified by the isolated browser fixtures.

**PR #301 remains draft** and the NPPE exam catalog status remains `coming_soon`. No PR merge, database migration, permission grant, or live publication is authorized by this batch.

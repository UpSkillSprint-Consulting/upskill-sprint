# Mock B — independent reviewer recruitment and adjudication operations

**Initiated 2026-10-19. Status: recruitment preparation; no individuals have been engaged, no independent reviews have been completed.** Mock A and B stay release-held; PR #301 stays draft. This is an internal workflow for UpSkillSprint's original, unofficial NPPE practice exam—not official NPPE exam material, legal advice, or evidence of psychometric validity.

## 1. Reviewer routing (not confirmed appointments)

The current 110 Mock B items were routed using their authored \`jurisdiction\` fields. This is a **planning classification**, not a determination of which legislation controls each fact pattern. Independent counsel must confirm the jurisdiction and may request secondary advice.

| Vacancy / routing pool | Items routed | Minimum acceptance evidence |
|---|---:|---|
| T-POOL — engineering/geoscience SME | 110 | Practising P.Eng. or P.Geo., relevant technical/professional scope, registration verified, independence declared |
| L-CAN — national/federal Canadian-law pool | 85 | Practising Canadian lawyer with suitable subject and jurisdictional competence; avoid unsupported nation-wide generalizations |
| L-ON — Ontario counsel | 11 | Qualified Ontario-law reviewer with relevant professional practice, common-law and construction-law expertise |
| L-QC — Québec counsel | 4 | Practising Québec lawyer competent in civil-law legislation and relevant case law |
| L-SK — Saskatchewan counsel | 3 | Saskatchewan professional/employment/regulatory-law competence |
| L-BC — British Columbia counsel | 7 | BC professional regulation and relevant constitutional-law competence |
| E-POOL — independent item-writing editor | 110 | Demonstrated four-option MCQ item-writing review and independent blind key selection |
| F-POOL — fairness and accessibility specialist | 110 | Assessment fairness and accessibility experience; full AT walkthrough is a separate gate |
| A-POOL — independent adjudicator | 110 | Documented qualification and independence from the item's originating reviewer/author |
| P-POOL — psychometric adviser | Later candidate pilot | Competent psychometric professional with a real response-data and consent plan |

**Vacancies/routing pools are not headcount commitments.** Actual accepted qualified reviewers may divide a pool's work by jurisdiction and expertise; no person may approve an item outside their competence. The adjudicator may not self-adjudicate their own technical/legal/editorial verdict on an item. No reviewer is named or marked assigned in this public document.

Relevant official credential verification channels:
- APEGS register: https://register.apegs.ca/
- PEO directory: https://www.peo.on.ca/directory
- Law Society of Saskatchewan legal-assistance directory: https://www.lawsociety.sk.ca/for-the-public/finding-legal-assistance/
- Barreau du Québec verified-lawyer directory: https://www.barreau.qc.ca/en/find-a-lawyer/

Use these directories only for appropriate licence and professional-eligibility verification. **Do not scrape or solicit contacts in violation of directory terms.** The Québec directory expressly restricts unsolicited commercial reuse of member contact information. Arrange recruitment via approved referrals or user-identified candidates; obtain project-owner authorization before contacting any person or sharing any examination content.

## 2. Recruit and onboard privately

For each actual person record confidentially: role and reviewed jurisdictions, candidate identity, regulator/registration and current practice status where applicable, CV/experience evidence, substantive competence, independence/conflict disclosure, prior familiarity with protected questions, confidentiality and intellectual property terms, authorized secure-access tier, availability and signed engagement acceptance. Do not publish private reviewer details or credential numbers in GitHub.

Reject or seek a replacement when the candidate is unqualified for the jurisdiction, has authored the same item, cannot provide a conflict declaration, cannot review the needed primary law, or expects access to keys before a required blind decision. External qualified reviewers must make their own decisions; ChatGPT/automated editorial scans are preparatory only.

## 3. Freeze version-pinned 110-question review round

After code and question content stabilize, verify the intended exact development commit and repository working tree is clean; confirm Mock A and Mock B remain held. Use a trusted checkout of that SHA and a fresh access-controlled directory **outside** the public repository:

\`\`\`bash
node scripts/nppe-mock-b-review-packets.cjs --out /trusted/private/empty-mock-b-review-round
\`\`\`

It creates the following files with private permissions:

| File | Function and permitted audience |
|---|---|
| \`manifest.json\` | Exact source Git SHA, 110 stable IDs, item version/hash, keyed packet SHA-256; restricted coordinator |
| \`blind/questions.json\` | 110 stems/options without answer key, rationales or scored/unscored labels; authorized blind reviewers |
| \`blind/reviewer-response-template.csv\` | 110 unfilled independent best-answer, four-option, rationale and severity fields; authorized blind reviewers |
| \`restricted-keyed/reviewer-roster-template.csv\` | 10 vacant specialty routing pools; private coordinator only |
| \`restricted-keyed/adjudication-assignment-queue.csv\` | All 110 version-pinned items, jurisdiction routing, priorities and five unassigned reviewer stages; private coordinator/adjudicator |
| \`restricted-keyed/legal-source-review.csv\` | Per-source current law, exact locator, effective date and qualified legal evidence |
| \`restricted-keyed/sme-editorial-review.csv\` | Four-option editorial evidence and keyed cue-review worksheet |
| \`restricted-keyed/review-decisions.json\` | Pending technical, legal, distractor, fairness and adjudicator records with signature/evidence fields |
| \`restricted-keyed/questions.json\` and \`cue-review.json\` | Answer keys, rationales, sources and keyed cue flags; **not** for blind first-pass review |

Keep manifests, reviewer identity evidence and keys in separately authorized private storage. The static source Git SHA and hash values establish correspondence to a source snapshot, **not an authenticated reviewer signature**. GitHub's public source/history is not private; do not place any new confidential packet in public GitHub, CI artifacts, Netlify assets or uncontrolled email attachments.

## 4. Independent item workflow — mandatory for each NPPE-281 through NPPE-390

1. **Assignment:** named, verified people accept the scope and conflict constraints; record route, independence and jurisdiction. Assignment is not approval.
2. **Blind first pass:** assessment reviewer chooses A/B/C/D without seeing the author key, then records four option-by-option judgments, multiple-key risk, stylistic cues, accessibility, difficulty and rationale. Capture dated evidence; do not change the key.
3. **Qualified specialist pass:** engineering/geoscience SME assesses scenario/practice; qualified legal reviewer assesses each statutory/regulator/judicial proposition with controlling section, effective date and exact case paragraph, or documents why it is only a nonbinding ethics/context item; fairness reviewer checks accessible content and accommodations. Each role records \`retain\`, \`revise\`, \`reject\` or \`adjudication_required\`.
4. **Independent adjudication:** compare blind selection against the proposed key **inside restricted keyed storage**; investigate any mismatch, multiple defensible choices, categorical-language cue, source mismatch, jurisdictional exception, ambiguity or critical/major flaw. Only a separately qualified adjudicator may resolve the item, referencing actual evidence. Do not treat an automated \`readyForAdjudication\` metadata check as real approval.
5. **Version recheck:** material corrections increment the item version and SHA-256. Invalidate affected prior sign-offs; regenerate packets under a new Git revision and complete the relevant reviews again. Retain immutable previous decisions in controlled storage.

Severity: **critical** (wrong law/key, two valid options, serious unsafe proposition), **major** (misleading, invalid or inaccessible), **minor** (nonmaterial wording), **observation** (optional improvement). Any critical/major unresolved finding blocks release.

## 5. Order of scrutiny

Start independent review with the eight author-revised categorical-cue items **NPPE-291, NPPE-319, NPPE-322, NPPE-329, NPPE-354, NPPE-362, NPPE-372 and NPPE-383**. Separately prioritize primary-law/case checks **NPPE-315, NPPE-336, NPPE-347, NPPE-371 and NPPE-389**. These are author-level risk flags, **not external verdicts**. Every remaining item still requires the full review.

Progress should be reported accurately as \`unassigned / accepted / blind reviewed / specialist reviewed / adjudication pending / human adjudicated\`, with signed evidence and item versions. Do not claim completed independent approvals from passing synthetic regression tests or from filling placeholders.

## 6. After review

Only after genuine adjudication and appropriate human evidence may the project separately plan private manual keyboard/NVDA/VoiceOver review, authorized request→grant→practice→revoke testing, consented candidate pilot and psychometric analysis. The current source may not be published, merged, enabled for learners or represented as calibrated. The NPPE official blueprint website still calls the 2017 version current as checked on 2026-10-19; reconfirm before release.

**Owner action required before real invitations:** approve named suitable reviewers/referral channels and secure document-delivery terms. No reviewer has been contacted or booked.

# NPPE Mock B — independent SME/legal review and calibration protocol

**Status: independent review preparation; NO external reviewer approval, candidate data, or release authorization.**
Scope: `set-1-mock-b`, original NPPE-281–390, 110 items (100 provisionally scored, 10 simulated unscored), current branch `codex/nppe-three-set-architecture`, draft PR #301. **Both Mock A and Mock B remain release-held.**

## Reviewer package and immutable provenance

Use the existing offline script **only in a clean, trusted checkout at the exact intended Git commit**:

```sh
node scripts/nppe-mock-b-review-packets.cjs --out /secure/private/empty-nppe-mock-b-review
```

Never choose an output path inside the public repository, its symlinked subdirectories, a public web root, a shared CI artifact, or an unprotected Drive location. The exporter verifies a clean tracked checkout, disallows linked paths back into the repo, applies owner-only directory/file permissions on POSIX, and stores SHA-256 of each canonical item and its `version` against the source revision. A successful export produces:

- `blind/questions.json`: question content and blueprint/jurisdiction, but no keys, scoring roles or explanations.
- `restricted-keyed/questions.json`: answer key, all four rationales, learning point, trap and full source locators, for a separately authorized key-holder or reviewer.
- `restricted-keyed/cue-review.json`: all 110 items' option-length ranks and categorical-language risk flags. **Do not give to blind reviewers.**
- `restricted-keyed/review-decisions.json`: pending technical, legal, distractor, fairness/accessibility and adjudication sections for each exact item version.
- `review-ledger.csv`: reviewer/qualification/conflict/source/disposition tracking, initialized pending.
- `manifest.json`: exact form revision, item SHA-256 and scoring roles. **Restricted material, not for candidate use.**

GitHub Free/public source/history already expose underlying text; generating private review files does not retroactively make public Git source confidential. Do not claim otherwise.

## Qualified reviewer assignments

**Technical reviewers:** independently registered and practising Canadian P.Eng. / P.Geo. professionals with competence relevant to the item's engineering/geoscience field, code regime, risk assumptions and licensing context. Where a scenario requires both disciplines, obtain the relevant additional expertise; one broad professional credential does not establish competence in all technical specialties.

**Legal reviewers:** independent lawyer or appropriately qualified Canadian-law SME, with current jurisdictional expertise in the specific federal/provincial statute and applicable case law; check statutory effective dates, amendments, judicial treatment and material exceptions. A legally sensitive item must not be approved solely from a national generic code of ethics or a blueprint entry.

**Distractor/editorial reviewer:** an independent NPPE-relevant item writer/editor or assessment specialist. First review blind for one-best-answer plausibility, sentence length, stereotype/fairness bias, undue cues, scenario realism, hidden assumptions and distractor credibility. Then review keyed rationales and author evidence separately. **Eight highest-priority categorical-cue items:** NPPE-291, 319, 322, 329, 354, 362, 372 and 383. In the latest author audit, categorical words appeared in 142/330 distractors vs. 7/110 keyed choices. This is an author-generated triage metric, not psychometric proof that items are invalid. Do not mechanically remove legal absolutes when the tested legal proposition genuinely warrants them.

**Accessibility reviewer:** independent person using actual screen reader/keyboard/zoom/colour-vision adaptation where appropriate, supported by at least one technically competent accessibility tester. Automated axe and screenshot results do not substitute for manual testing.

## Per-item disposition rule

Each item receives an explicit decision for technical content, legal currency, distractor quality, and fairness/accessibility, with reviewer name, qualification, independence declaration, dated source evidence (including exact locator, jurisdiction and effective date), `qid`, version and SHA-256.

Use `retain`, `revise`, `reject` or `adjudication_required` in the human evidence ledger, accompanied by severity: **critical** (wrong/no unique key or unsafe/outdated legal claim), **major** (misleading conditions, implausible distractors, accessibility barrier or cue), **minor**, **observation**. A critical/major issue blocks that item and the entire mock release. A competing key or reviewer disagreement goes to a separate qualified adjudicator; retain original opinions.

The machine-readable `review-decisions.json` uses `pending` initially. Only authorized human reviewers may document their own `approved` records with dated evidence. The offline integrity checker:

```sh
node scripts/nppe-mock-b-review-gates.cjs \
  /secure/private/empty-nppe-mock-b-review/manifest.json \
  /secure/private/empty-nppe-mock-b-review/restricted-keyed/review-decisions.json
```

must reject unreviewed items, missing credentials, stale hashes/versions and missing legal source locators. **Passing this mechanical checker is not independent reviewer authentication, nor release approval.** Any material question/options/rationale/source edit changes its canonical hash, requires incremented version, re-export and fresh sign-off on the new item. Preserve prior versions and reviewer evidence privately for an audit trail.

## Stage 2 — manual accessibility acceptance matrix

Run against a **local/test-only protected preview** with an isolated in-memory Mock B fixture, never by releasing learner access. Use Chromium/Firefox or WebKit where supported; the existing CI covers Chromium + WebKit (320, 390, 1440 px, light/dark) and automated axe WCAG 2 A/AA and 2.1 A/AA. In addition to those tests, record manual:

| Check | Device/assistive technology | Pass evidence and rejection criteria |
|---|---|---|
| Reach Mock B and understand its held status | Keyboard + screen reader | Disabled state and reason read correctly; normal learner cannot launch |
| Candidate fixture: choose/clear/flag/navigate | Keyboard only, NVDA/JAWS on Windows; VoiceOver on Apple device if available | Visible focus; operable without pointer; selected and flagged states announced |
| Four alternatives and math/legislation | Screen reader and 200–400% zoom | Choices announced in meaningful order; no horizontal content clipping or loss of meaning |
| Timed/untimed, timeout notice | Keyboard/screen reader | Understandable remaining time; warning and expiry do not trap focus; scoring not concealed |
| Correct/incorrect/revealed/flagged differentiation | Colour-blind simulation + user check | Distinguishable by text/icons/borders, not colour alone; contrast verified in both themes |
| Review of all 110 explanations | Screen reader and keyboard | Expand/collapse controls labelled; rationales mapped to correct options; no keyboard traps |
| Desktop/tablet/mobile responsive | 320/390/768/1440 px, light/dark | Controls usable and not obscured; no horizontal overflow or header overlap |
| Real account grant/revocation | Authorized non-admin test learner + admin **only after approval** | Request → grant → attempt → review → revoke → denied, with revision/environment evidence |

Provide dated screenshots, screen-reader utterances or anonymized walkthrough notes, viewport/OS/AT versions, defects, remediation version, recheck and reviewer sign-off. Do not record credentials, health conditions or real student identifiers. **All manual rows remain PENDING until separately evidenced.**

## Stage 3 — psychometric/candidate calibration planning

Obtain research/consent and privacy authorization **before** collecting a single real candidate response. Define recruitment of actual NPPE-relevant eligible candidates, inclusion/exclusion and accommodations, accessibility, withdrawal, data minimization, storage/retention, item-exposure controls, reviewer approvals, and the effect of prior practice/exposure. Do not scrape exam attempts from production. Do not use synthetic fixtures to claim empirical item parameters.

Use the companion [Mock B calibration response contract](nppe-mock-b-calibration-data-contract.md) with the existing offline `scripts/nppe-calibrate.cjs`. Pin `formRevision`, item `version` and SHA-256; keep separated keyed packet and pseudonymous candidate responses in a private environment. Primary analyses use first unassisted attempts; repeats, assisted/previously exposed and accommodated attempts must be reported separately with a fair inclusion analysis guided by a psychometrician. The ten **simulated unscored** items do not count in the 100-point form score or scored-form item-rest/KR-20; they can be analysed descriptively but are not truly field-calibrated yet.

Candidate data requirements and outputs are described in that contract. Report percent correct with Wilson uncertainty, choice frequencies, omissions and not-reached rates, corrected item-rest correlations on comparable complete scored forms, and KR-20 with its sample-size/variance limitations. Include validity/fairness and form-speeding discussion; no raw-percent passing benchmark is equivalent to the official NPPE equated score. The actual sample size and precision plan must be approved by an independent psychometric specialist before recruitment. Never fabricate a pilot or state calibration was completed.

## Current gate register

| Gate | Status |
|---|---|
| 110-item authoring, domain distribution, 100/10 role checks | Automated, passes at prior exact head; rerun after any change |
| Initial answer-length ranking, cross-bank lexical scan | Automated review complete, rank balancing 25/25/30/30 |
| Categorical distractor and one-best-answer independent review | **OPEN** |
| Independent engineering/geoscience SME review | **OPEN** |
| Independent Canadian-law primary-source/effective-date review | **OPEN** |
| Manual assistive-technology accessibility review | **OPEN** |
| Actual administrator/learner production-account workflow | **OPEN** |
| Consented actual candidate pilot/calibration | **OPEN** |
| Explicit release authorization | **NOT GRANTED** |

**PR #301 remains draft/unmerged. Mock A and Mock B remain `releaseHold:true`.** Do not deploy, run migrations or change permissions.

## October 19, 2026 — targeted author revision and human-review status

**Eight high-priority categorical distractor items were revised by the ChatGPT author/editor, not by an independent qualified reviewer:** NPPE-291, 319, 322, 329, 354, 362, 372 and 383. All eight retain their original correct answer indexes and assigned blueprint topics; edited choices and (where necessary) option rationales were versioned, and the 110-row review ledger now says `author_revised_pending_independent_cue_review`, not approved.

The author-level whole-form scan now identifies categorical terms in **121/330 wrong alternatives** and **7/110 correct alternatives**, down from 142/330 incorrect before the eight targeted revisions. **Zero** items have all three distractors categorical without the keyed choice. The relative keyed length-rank allocation stays **25/25/30/30**. The categorical-wording disparity remains significant and the substantive plausibility of all three wrong answers per item needs **independent** review; mechanical pattern improvement does not guarantee sound item writing.

Official sources used for spot checks include the current [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/), [APEGS CPD table](https://www.apegs.ca/cpd/cpd-program/cpd-program-basics), [Criminal Code s.219](https://laws-lois.justice.gc.ca/eng/acts/C-46/section-219.html), and [Ontario Construction Act s.31](https://www.ontario.ca/laws/statute/90c30). These spot checks were conducted by an AI author and do not satisfy the independence/effective-date/legal-interpretation sign-off requirement. Full legal review remains pending for every affected proposition.

Current reviewer materials: `scripts/nppe-mock-b-review-packets.cjs`, `scripts/nppe-mock-b-review-gates.cjs`, `docs/nppe-mock-b-independent-review-source-ledger.csv`, `docs/nppe-mock-b-independent-review-calibration-protocol.md`, `docs/nppe-mock-b-calibration-data-contract.md` and `docs/nppe-mock-b-manual-accessibility-authorization-checklist.md`. All independent technical, legal, distractor, fairness/accessibility and adjudication decisions remain **PENDING**. There are **zero actual candidate pilot observations**.

**Release status unchanged:** Mock A and Mock B held, PR #301 draft/unmerged, no production migration, access grant, deployment or release authorization.

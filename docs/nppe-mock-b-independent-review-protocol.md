# NPPE Mock B — independent distractor, engineering and Canadian-law review

**State:** PREPARED FOR EXTERNAL HUMAN REVIEW; **ZERO independently approved questions**. This is not evidence of NPPE equivalence, professional legal advice, or release authorization. Working branch `codex/nppe-three-set-architecture`, draft PR #301. The form stays `releaseHold:true`.

## Freeze the revision before requesting a review

Review the intended canonical branch SHA and ensure no uncommitted source changes. For each of **NPPE-281–390**, export blind and keyed reviewer files **only to a new empty private directory outside the GitHub repository**:

```bash
node scripts/nppe-mock-b-review-packets.cjs --out /secure/private/mock-b-review
```

The exporter rejects repository destinations, symlink escapes, dirty tracked sources, and nonempty destinations. It writes owner-restricted file permissions where supported and pins the Git commit, item versions, and SHA-256 digests in `manifest.json`.

Contents are confidential review artifacts. Do **not** commit, deploy, attach to a public PR, or upload any reviewer packet to the public site. The upstream public GitHub history already contains prior source content and must not be misrepresented as confidential. Separate review access controls from the existing public-source limitation.

| Private file | Recipient / purpose |
|---|---|
| `blind/questions.json` | Independent first-pass technical, distractor and fairness reviewer; lacks keys, rationales, sources and scoring roles |
| `restricted-keyed/questions.json` | Qualified answer adjudicator, engineering/geoscience SME and Canadian-law reviewer; includes all option rationales and source locators |
| `restricted-keyed/cue-review.json` | Keyed editorial lead; prioritizes categorical-language and answer-length flags |
| `restricted-keyed/review-decisions.json` | Item-by-item technical, legal, distractor, fairness and adjudication statuses; initially **pending** for every item |
| `review-ledger.csv` | Audit trail; reviewer independence, dates, findings, evidence, proposed disposition |
| `manifest.json` | Pinned revision/hash and 100-scored/10-simulated-unscored structure. Do not show scoring roles to blind reviewers |

Independent reviewers must not receive the prior author's answer key until their own choice and reason have been recorded. A second reviewer/adjudicator should reconcile conflicts, and any revision requires a new item version, item hash, and renewed review. An AI review or self-certification is **not** independent human sign-off.

## Reviewer assignments and evidence

Obtain signed review by qualified, genuinely independent individuals, with at least these roles:

1. **Canadian professional engineering/geoscience SME:** appropriate engineering/geoscience registration and subject-matter competence, especially professional practice, field supervision, risk and technical communication. Record regulator, relevant qualification, independence disclosure and review date.
2. **Qualified Canadian-law reviewer:** professional-practice law and/or jurisdiction-specific competence relevant to the question. Check statutory effective dates and exceptions, ratios/paras of decisions, provincial scope, contractual assumptions and whether multiple options are defensible.
3. **Independent assessment/item-writing editor:** blind key selection, each incorrect alternative's plausibility, absolute-language cue screening, potential multiple defensible keys, difficulty/cognition and overlapping questions.
4. **Accessibility/fairness specialist:** plain-language clarity, accommodations, unnecessarily culture-specific assumptions, source presentation, and ability to complete the task with assistive technology. The specialist's signed decision is distinct from automated axe output.

For each of 110 items record the selected best answer **before** seeing the key, all three distractor assessments, an exact supporting source and locator, jurisdiction and operative/effective date, item version/hash, evidence, severity, disposition and adjudication. If an external reviewer disagrees with the key or finds no unique defensible answer, mark the item `revise` or `reject` and retain the original findings.

Disposition vocabulary: `pending`, `approved`, `revise`, `reject`, `adjudication_required`. Approval requires reviewed evidence; an empty, machine-filled or rubber-stamped row must not be accepted. The completeness validator does not authenticate any human or make the final release decision:

```bash
node scripts/nppe-mock-b-review-gates.cjs /secure/private/mock-b-review/manifest.json /secure/private/mock-b-review/restricted-keyed/review-decisions.json
```

The default pending packet is expected to **fail** the check. If a future packet passes metadata checks, a separate release authority must still verify reviewer legitimacy, sign-offs, source relevance, accessibility, calibration and production gates.

## Priority distractor failures from the author-led audit

Final answer-length ranks are 25/25/30/30 (shortest through longest), yet **categorical language remains concentrated in incorrect options**. The author-led audit identified 142 of 330 wrong options versus 7 of 110 correct options containing words such as *always*, *never*, or *automatically*. These eight have categorical wording in **all three incorrect options**, requiring prioritized blind review:

**NPPE-291, 319, 322, 329, 354, 362, 372 and 383.**

This is not justification for replacing a clear, correct categorical legal rule with vague wording. The reviewer should determine whether the distractors are *plausible, distinct, attractive to a candidate with a particular misconception, legally sound enough to be defensibly wrong, and similar in precision/complexity to the key*. Modify a distractor only with an item-specific justification; re-run the full audit after every revision.

Review current key-letter distribution (A18/B25/C32/D35) and provisional labels (104 medium/6 easy/0 hard) as observations, not fixed quotas. No official NPPE ability, pass threshold or scaled-score claim is authorized.

## Legal/SME source hierarchy and priority

The [110-row source-review matrix](nppe-mock-b-independent-review-source-ledger.csv) exposes each item, primary non-blueprint citation and pending reviewer fields without publishing a new keyed packet. Each source must be opened by the human reviewer, with last amendment/effective date recorded. Prior AI source spot checks do not constitute legal sign-off.

Priorities include:
- NPPE-315 and 371: Ontario *Construction Act* §§22 and 31 (holdback, lien triggers, qualifications, 2026 amendments)
- NPPE-326 and 383: *Criminal Code* §§217.1, 219 (work-direction duty versus criminal negligence elements)
- NPPE-312 and 365: *Federal Courts Rules* rule 52.2 and Expert Witness Code, schedule
- NPPE-336 and 389: *Haida Nation*, 2004 SCC 73, consultation duties/spectrum and later judicial treatment
- NPPE-294, 351: Québec *Civil Code* arts 1457 and 2098–2099; ensure province-specific civil concepts
- NPPE-322 and 370: APEGS published 2026 CPD credit, ethics, Scope of Practice and online reporting requirements
- NPPE-362: federal *Copyright Act* §14.1 moral-rights waiver scope
- NPPE-330, 386: PIPEDA applicability, consent and retention with federal/provincial jurisdiction review
- NPPE-333, 357, 382: Ontario professional engineering practice, discipline procedure and public-service authorization

Published official [NPPE blueprint](https://www.nppexam.ca/en/preparation/blueprint/) currently labels its version **2017** even while it mentions a future review. Reconfirm the version before reviewer sign-off. Official [APEGS CPD Program Basics](https://www.apegs.ca/cpd/cpd-program/cpd-program-basics) lists the annual scope/plan/reporting distinctions used in questions 322 and 370.

## Exit criteria

Every question has accepted independent best-answer, distractor, legal (as relevant), SME and fairness evidence with exact version/hash; critical/major findings resolved; two-sided cue screening re-run; reviewer conflicts adjudicated. **Even after that, Mock B remains release-held** until manual accessibility, empirically valid candidate data, real authorized account checks and explicit release approval are separately completed.

## Additional private evidence and adjudication controls (2026-10-19)

The updated packet exporter emits `restricted-keyed/legal-source-review.csv` (a separate row for each cited non-blueprint source, including item hash and jurisdiction), `restricted-keyed/sme-editorial-review.csv` (one row for every item including all four distractor review fields), and the five-role private JSON adjudication record. Every entry begins `pending`. Only qualified reviewers may fill evidence, signed disposition and source-effective-date fields; generated cue priorities are not findings by external counsel.

The complete keyed-packet object has an independent SHA-256 in the manifest (`keyedPacketSha256`) for detecting accidental key changes relative to that manifest. This **does not** certify author identity, independence or signature authenticity. The offline review-gate checker also requires distinct named reviewers, qualifications, conflict declarations, legal source locator/jurisdiction/effective date, individual alternative assessments, resolution of any material finding and separately documented adjudication. It reports *metadata completeness only*, never authorization to release Mock B.

Any item edits invalidate that item's prior review version and SHA-256. Regenerate private packets in a clean checkout at the new commit and obtain renewed human review before conducting an approved, consented pilot.

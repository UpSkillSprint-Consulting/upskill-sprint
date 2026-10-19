# NPPE Mock B — release gate register

**Author/engineering readiness record, 2026-10-19.** **RELEASE HELD.** This is not independent approval, official NPPE validation, empirical calibration, production-account test evidence or WCAG certification. Form: `set-1-mock-b`; NPPE-281–390; 110 authored (100 scored, 10 **simulated** unscored); 150-minute full form. **Mock A must remain held too.** Work occurs only on draft [PR #301](https://github.com/UpSkillSprint-Consulting/upskill-sprint/pull/301), not in production.

## Blocking gates

| Gate | Responsible authority / acceptance evidence | Status and reason |
|---|---|---|
| B-01 — Version and structure | CI reviewer: 110 unique IDs, 100/10 roles, 40 numbered blueprint topics sampled, versions/answer rationales, source checks, protected Mock A/B delivery, no cross-form substitution; verify results at exact release commit | **PENDING exact-release-head approval**. Automated tests are structural, not expert acceptance |
| B-02 — Current NPPE blueprint | Curriculum owner: reconfirm published revision, map 40 topic groups and review sub-bullet gaps; document impact of any new specification | **PENDING**. NPPE page continues to label 2017 the current blueprint as checked 2026-10-19, but mentions a review previously estimated for mid-2026; recheck before release |
| B-03 — Engineering/geoscience SME | Independent qualified professional, credentials, independence, 110 same-version source-pinned verdicts and signed adjudication | **PENDING — 0/110 signed approvals documented** |
| B-04 — Canadian law | Independent jurisdiction-competent reviewer, each statute/regulation/decision effective date and cited provision/paragraph, precedent and provincial applicability, competing options | **PENDING — 0/110 signed approvals documented**. Court-source restrictions and source-effective-date issues unresolved |
| B-05 — Distractor and editorial | Independent blind key selection, individual review of all four options per item, categorical-language cues, plausible errors, one defensible answer, duplication and difficulty | **PENDING**. Eight historically prioritized categorical-cue items were author-revised, not independently cleared: 291, 319, 322, 329, 354, 362, 372, 383 |
| B-06 — Fairness and accessibility | Human accessibility editor verifies item-language fairness, followed by manual keyboard, NVDA/VoiceOver, zoom/reflow, contrast/touch and timer walkthrough, exact browser/build evidence | **PENDING**. Automated browser/axe evidence is not human AT testing |
| B-07 — Reviewer disagreement | Independent named adjudicator separately signs each item, records findings, severity and conflicts; no unresolved critical/major issue; new hash/version after substantive edits | **PENDING**. Only blank versioned records and author-level checks exist |
| B-08 — Data governance | Owner, privacy lead and psychometrician sign participant consent, retention/deletion, custody of answer keys, recruitment/accommodations and response data contract | **PENDING**. No approved candidate study is documented |
| B-09 — Empirical pilot and calibration | Qualified psychometrician: consented population, cognitive interviews, genuine first-unassisted attempt records, appropriate uncertainty, distractor response and item-rest/KR-20 analyses; bias, speededness and validity appraisal | **PENDING**. No genuine candidate response dataset exists. Test fixtures are not calibration |
| B-10 — Real access/security test | Authorized isolated system and independent non-admin learner/admin identities: request → grant → attempt → review → revoke/expire; no protected content after revocation, with precise SHA and audit trail | **PENDING**. Do not disable the production release hold to manufacture this evidence |
| B-11 — Protected-delivery/privacy | Security owner verifies no new protected payload in public shell/assets/other exams; admin permissions and Supabase plans preserved; account for public Git history's known limitations | **PENDING exact-release-head recheck**. No migration, permission expansion or production write authorized |
| B-12 — Release decision | Owner explicitly signs all prerequisites, resolves findings, reviews exact-head CI/browser evidence and authorizes release as a separate change | **PENDING / NOT AUTHORIZED**. PR #301 stays draft/unmerged and both Mock A and Mock B keep `releaseHold:true` |

No numerical pass mark, official scaled-score equivalence, reliability coefficient or candidate performance result may be inferred from author classification or unit-test fixtures.

## Practical next review workflow

1. Freeze and inspect the intended Git revision and exact question versions. Run `node scripts/nppe-mock-b-review-packets.cjs --out /trusted/private/empty-dir` from a clean checkout. Never generate output in the public repo, deploy or share keyed packet on PR.
2. Provide blind questions **without** manifest scoring roles or keyed cues to independent item-writing reviewers. Restrict keyed answers, source locators and cue reports to independently authorized adjudicators and specialist reviewers.
3. Fill version-pinned `restricted-keyed/legal-source-review.csv`, `restricted-keyed/sme-editorial-review.csv`, and `restricted-keyed/review-decisions.json`. The `keyedPacketSha256` is a custody/integrity check, not a qualified digital signature. Do not edit the public author/source ledger to falsely mark sign-off.
4. Run `node scripts/nppe-mock-b-review-gates.cjs PRIVATE/manifest.json PRIVATE/restricted-keyed/review-decisions.json`. A missing qualified review causes a nonzero result; metadata completeness alone never authorizes release.
5. Complete the detailed [manual accessibility checklist](nppe-mock-b-manual-accessibility-authorization-checklist.md), [legal source priorities](nppe-mock-b-legal-cue-priority-review.md), [110-item source register](nppe-mock-b-independent-review-source-ledger.csv), and [candidate data contract](nppe-mock-b-calibration-data-contract.md). Confirm exact-head CI after any code or item change.

**Hard-stop:** No merge, public deploy, release-hold removal, admin grant, production-account change or real candidate-data collection is approved by this register. Escalate any material reviewer disagreement to independent adjudication and re-review a new item version.


## Review recruitment and adjudication preparation — 2026-10-19

The [qualified reviewer recruitment and adjudication operations guide](nppe-mock-b-independent-review-recruitment-and-adjudication.md) and [unsent reviewer invitation kit](nppe-mock-b-reviewer-recruitment-invitation-kit.md) have been committed. They describe specialist qualification and independence screening, primary-source jurisdiction routing, blind answer selection, separate adjudication and secure evidence custody. **No persons have been contacted, engaged or independently approved.**

The protected packet exporter now creates an additional 110-row version-and-SHA-256-pinned `restricted-keyed/adjudication-assignment-queue.csv`, a 110-row `blind/reviewer-response-template.csv`, and a ten-pool `restricted-keyed/reviewer-roster-template.csv`. All five assignment fields and all reviewer dispositions start **unassigned/pending**. The ten rows are reviewer *routing pools*, not ten confirmed individuals. They direct 85 nationally framed, 11 Ontario, 4 Québec, 3 Saskatchewan and 7 British Columbia items to appropriately qualified legal review, with technical, editorial, fairness and adjudication review required across all items.

Author-identified priority: eight previously revised categorical-cue items (NPPE-291, 319, 322, 329, 354, 362, 372, 383) and five legal source/case checks (NPPE-315, 336, 347, 371, 389). These flags do not determine severity or imply approval. The actual private review round must be generated on a clean trusted checkout after the target Git revision is chosen. **The process is prepared; recruitment, external decisions and empirical calibration remain blocking gates.**

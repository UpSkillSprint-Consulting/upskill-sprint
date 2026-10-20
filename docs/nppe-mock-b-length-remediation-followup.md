# Mock B answer-length and distractor remediation — whole-form follow-up

**Date:** 2026-10-18. **PR:** #301 (draft). **Release decision:** HOLD.

## Work completed

All **95** keyed answer choices flagged in the original option-length ledger were individually rewritten in the Mock B canonical source files, preserving each correct answer position and option-specific explanation. A separate pass tightened **91** previously verbose wrong choices without making them correct or adding artificial filler. Editorial changes were versioned in the corresponding batch source. All 110 original questions, their source metadata, the 100-scored/10-simulated-unscored allocation and public-release restrictions were preserved.

## New whole-form measurement

| Pattern | After first keyed-option pass | After subsequent distractor pass |
|---|---:|---:|
| Key is longest (or tied for longest) | 0/110 | 0/110 |
| Key is shortest (or tied for shortest) | 91/110 | 0/110 |
| Key position by option length (ranks 1/2/3/4) | dominated by rank 1 | **0 / 102 / 8 / 0** |

**Critical remaining issue:** Although individual longest/shortest cues have been removed, the correct answer is **second-shortest in 102/110 items**. This pattern is exploitable. Mock B is **not release-ready**. The last stage must be completed by human-guided, content-preserving option revision rather than mechanical length padding.

The [item-level review ledger](nppe-mock-b-option-length-review-ledger.csv) has all 110 current choice lengths, shortest and longest wrong-option lengths, current key rank, a **proposed** balanced rank target of **25 / 25 / 30 / 30**, and item-level editing strategy. Those targets are worklist entries, not currently implemented revisions.

The automated [whole-form audit](../scripts/nppe-mock-b-whole-form-audit.cjs) now emits `shortestKey` and `keyLengthRanks` and warns about concentrated positional cues. CI also exercises protected NPPE delivery, timed and untimed grading and the release hold. No prior passing CI result can be transferred to the newest head; exact-head actions must be checked.

## Other remaining release gates

- Independent engineering/geoscience and Canadian-law SME adjudication, with qualified source-currency confirmation
- Whole-form review of distractor *plausibility*, not only character length
- Candidate field calibration and empirical difficulty/discrimination estimates; present labels remain 104 medium / 6 easy / 0 hard in the last completed full-form audit
- Manual keyboard, screen-reader, mobile colour/contrast verification and authorized production-account request/approve/practice/revoke flow
- Explicit final release authorization

**Neither Mock A nor Mock B is authorized for learner access.** Do not merge PR #301, deploy, grant access or change production data as part of this review. Preserve Grok Mock D and Claude Mock E.

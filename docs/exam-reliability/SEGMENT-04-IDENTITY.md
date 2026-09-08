# Segment 04 — explicit question identity and atomic bank acceptance

Status: implemented for review in **PR #173**, a new PR requested by Ernest. Entry `main` is `b9bf726baf3418d4405e5aed46f13e99b63ba3dd`, the human merge of PR #172. Segments 01–03 are therefore merged prerequisites, not duplicated in this diff. Segment 05 has not started. Final head, exact tested merge revision, workflow conclusions and artifact IDs are recorded in the PR after execution; this document does not claim checks before they run.

## Scope and finding disposition

This is the runtime repair for **G09** and preservation of **P01**. It covers all five published certifications (CSSBB 1,024; CQE 933; CSSGB 616; MBB 450; CMQ/OE 166; total 3,189) and every current set. CQA/CRE have no published question arrays; they remain unavailable placeholders and are not represented as validated exam inventories.

R07 is only partially advanced: canonical client identity and membership are enforced. Database catalog foreign keys, content/bank/blueprint revisions, historical grading, official configuration provenance and retired-identity migrations remain Segments 05/07. No question text, option, answer key, ID, domain assignment, source provenance, learner evidence or database schema is edited in this PR.

## Root cause

The previous registry cached only the exam object reference. In-place array pushes, alias changes or domain changes could bypass revalidation. It assigned identities before verifying the complete collection; two different objects with one ID produced a warning and silently omitted the second item. `idFor()` also returned a remembered identity before checking the requested certification.

The page already contained literal stable IDs for the full inventory. Regenerating or renumbering them would damage historical relationships and was neither needed nor permitted. The new implementation validates those existing values, rather than repairing the numbers by resetting learner history.

## Runtime changes

### Registry v2

`test-bank-question-registry.js` adds a pure `inspect(examId, source)` and atomic candidate validation. Errors have stable codes, certification, location, question ID and explanatory text. Validation checks explicit string IDs and matching aliases; exact certification prefix; unchanged identity of an already registered object; configured, unambiguous subtopic mapping; array/map shape; sparse rows; duplicates within a collection; and different objects claiming the same identity. A malformed bank exposes **zero selectable rows**, never a silently shortened supposedly valid bank.

The cache fingerprint covers source/array references, lengths, ordered objects, identity fields and subtopic mappings. It deliberately does not make wording part of identity. Adding, removing, reordering or replacing a set, changing an alias, or changing domain mappings causes revalidation even when the enclosing object is unchanged. Remembered-object lookups remain constant-time; whole-bank reads use the structural fingerprint.

The actual page declares `questionIdentityPolicy='explicit-v1'`. No positional or wording-derived ID is accepted for a new live question. The old non-live/legacy adapter hashing remains available for compatibility with historical projection fixtures and independently loaded old adapters, but is not the strict import boundary. All existing live IDs are literal, including those whose historical spelling contains `legacy-`. The strict validator/import API never enables fallback. Explicit retired snapshots can retain their identity; admitting them into new sessions still requires current-bank membership.

### Identity is not membership or revision

A single canonical object may be a member of more than one set and may also appear in the bank mirror. It is counted once in the canonical pool; `membershipsFor()` reports the sets separately. Two distinct question definitions with the same ID are rejected, even when they happen to have identical text. Repetition within one set is also rejected.

The `set` property and set-like tokens in existing IDs are legacy metadata, not an instruction to rename an ID when membership changes. Mixed core pools now deduplicate canonical IDs so a valid multi-set membership does not yield duplicate session items. New session plans themselves reject duplicate IDs. Full content revision and pinned-option identity belong to Segment 05 and are not invented here.

### Atomic authoring/import API

`replaceBank(examId, sets)` is an authoring integration boundary, **not a new public student upload feature**. No standalone question-file importer existed in the inspected application. Existing metadata, including blueprint, timing and practice target, is retained. The API:

1. Requires an existing valid bank and no active core/ledger session for that exam.
2. Stages the entire set map and validates every identity/domain before publication.
3. Rejects an update that would remove an existing ID; retirement requires later explicit catalog policy.
4. Validates the renderable single-select content shape, detaches imported arrays and nested question data, preserves intentional object aliases, and revalidates the detached candidate.
5. Publishes with one synchronous assignment, refreshes the registry and dispatches one bank-updated event.

No rejected candidate is assigned a canonical ID, written to learner storage, or partially added to the live bank. The previously accepted bank is retained. Circular/nonserializable data and unreadable candidates fail with a structured error. Callers should supply plain data; this is not a server authorization or untrusted-JavaScript sandbox.

A persistent, theme-aware `role=alert` banner distinguishes rejection of an update from an already malformed source bank. It explains the affected certification and provides author details. Error data is inserted as text, not HTML. Details show the first ten errors; the API returns the complete list. A later valid import/validation clears the affected banner. Author error presentation is tested in light/dark mobile and desktop layouts; this does not replace Segment 17's full accessibility review.

### Before any new learner evidence or reservations

Under the page's explicit policy, `test-bank-learning-events.js` checks every new session's selected IDs and canonical objects before creating session/answer evidence. It rejects foreign, absent, altered-copy and repeated questions. Existing identified retries retain the prior idempotency branch; they are not reinterpreted against a newer bank.

The same identity check runs before a New-only reservation RPC. Invalid candidates do not consume server claims. The mobile storage-recovery wrapper now respects an explicit rejection and does not compact learner evidence as though a validation error were storage exhaustion. This is identity validation, not the broader ingestion/finalization rewrite planned for Segment 07.

## Regression and evidence plan

- Existing Segments 01–03 tests/contracts, observations and profile hash remain unchanged.
- The historical G09 observation now emits zero registered rows with structured rejection warnings, rather than one silently retained row. Its original historical JSON/register entry is retained; the new desired-behavior tests, not the old observation label, establish repair.
- `identity/v1/published-baseline.json` pins the sorted-ID digests and set counts at the merged entry commit. It is identity evidence, not a new runtime bank version or content hash.
- New tests validate every live ID/domain, unchanged question data after registration, all-bank reorder/wording stability, cross-exam reuse, aliases, mutations of cached sources, membership, atomic import, safe errors, input-buffer detachment, no silent retirement, active-session rejection, all seven writer modes, no invalid RPC calls and no quota compaction on rejection.
- The original inventory checks are preserved. New browser checks extend (not replace) the four Segment 03 profiles with visible atomic import rejection for each certification, an accepted identity-preserving update and blocked replacement during an active examination.
- The all-PR identity workflow retains exact revision and logs for 30 days; full-suite/framework/database/mutation/baseline/contract workflows remain mandatory review gates. No branch-administration rule is changed.

The initial inspection-only workflow captured the exact checkout and dependencies because the local runtime had no GitHub network access. Its permanent version is a read-only validation job, not a repository-writing build. Any temporary transport/build files used to assemble the proposed commit are removed from the final tree. Source tree/blob hashes are checked against the tested local diff.

## Acceptance and boundaries

G09 is **implemented with desired-behavior regressions, pending human review and deployment verification**. P01 is preserved across all 3,189 IDs. No claim is made that the remaining metric, first/repeat, active-session transfer, timer, security-advisory, physical-device or complete-history issues are repaired. Browser auth and remote service remain synthetic; PostgreSQL tests exercise the existing disposable schema, not live Supabase parity. Performance budgets and physical-device release criteria remain unchanged.

There is no database migration. Rollback is a reviewed code revert; no history or question data conversion needs reversal. Exact original IDs persist on both sides of deployment. No automatic merge or production deployment is performed. After deployment, authorized smoke verification should confirm unchanged pool sizes, normal starts and visible invalid-candidate rejection before assigning production closure to G09.

## Methodology references

Project authority: approved roadmap Segment 04; Segment 02 C03; G09/P01/R07 in the defect register. The unrelated steel SPEC_DATA schema is not an exam contract.

Technical mechanisms: Node crypto `createHash` for the immutable test inventory digest (https://nodejs.org/docs/latest-v22.x/api/crypto.html); own-property validation and map/set use at data boundaries (https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution). These support mechanisms, not claims about live production acceptance.

### Existing formula-search fixture compatibility

The cumulative run detected an old formula-search fixture that inserted 15 synthetic live questions without IDs. The new runtime correctly rejected that malformed bank. Each synthetic row now declares an explicit `cqe:fixture:formula-search-*` ID; the formula-search assertions and application validation remain unchanged. This is a fixture schema correction, not removal or weakening of the preceding regression.

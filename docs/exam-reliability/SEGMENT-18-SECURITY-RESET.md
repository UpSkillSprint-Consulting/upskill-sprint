# Segment 18 — Security, reset, deletion, export, and dependency reachability

## Entry state

Segment 18 starts from `main` commit `545315d79b18305137bea22612fc7bfe4f8bb388`, the human merge of Segment 17 PR #183. Segments 01–17 are prerequisites and their scoring, identity, durability, reconciliation, lifecycle, timing, synchronization, handoff, New-only, and accessibility contracts remain authoritative.

This segment does not alter question content/IDs, grading formulas, mastery/readiness formulas, timer policy, handoff writer authority, or New-only allocation semantics. It adds a security-control plane for the learner-owned exam data those features persist.

## Threat model and decisions

The dedicated security pass treats the browser as fallible and potentially stale, and the authenticated database owner boundary as authoritative. It covers:

- another authenticated account attempting to read/write an owner's exam data;
- anonymous access to learner data and privileged RPCs;
- direct-table mutation versus the explicitly exposed RPC surface;
- an offline browser returning after the account's exam-learning history was deleted elsewhere;
- stale progress snapshots attempting to resurrect pre-deletion history;
- pre-deletion append-only events attempting to replay after a purge;
- repeated or racing destructive requests;
- account switching while user-scoped pending evidence exists;
- history export after a purge boundary; and
- production dependency/CDN reachability.

A `SECURITY DEFINER` function is not treated as vulnerable merely because it is callable by `authenticated`. Each intentionally exposed function must derive identity from `auth.uid()`, pin `search_path`, validate bounded inputs, and avoid accepting caller-controlled owner authority. Disposable-database tests execute with actual restricted PostgreSQL roles; service-role/admin success is not authorization evidence.

## Authenticated full learning-data deletion

`20260910050000_add_security_reset_v1.sql` adds `test_bank_data_control`, an owner-scoped purge-generation record that survives deletion of the learner's exam evidence. The destructive RPC `delete_test_bank_learning_data_v1(expected_generation)`:

1. requires `auth.uid()`;
2. locks the owner's control row;
3. uses compare-and-swap generation so a stale destructive UI cannot silently repeat against changed state;
4. deletes the owner's durable learning events, New-only claims/reservations, and versioned session root rows; dependent results/runtime/receipts/items/checkpoints cascade from the session-version owner row;
5. does not touch shared version/catalog/question content;
6. replaces account-progress snapshots with a server-authored purge tombstone; and
7. advances the owner's durable generation.

The browser requires the exact confirmation token `DELETE` before invoking the RPC. Local learner state is cleared **only after** the server returns an acknowledgement with the next generation. A failed RPC never reports success and never clears the local copy as though the cloud delete succeeded.

This is deletion of UpSkillSprint exam-learning data, not deletion of the authentication account itself. Authentication-account deletion remains a separate account-management concern.

## Stale-device resurrection protection

Deletion is not complete if an offline device can upload an old snapshot later. Segment 18 therefore provides two server-enforced barriers.

### Immutable learning events

A pre-insert guard rejects a learning event whose original `occurred_at` is at or before the owner's latest purge timestamp. Existing local outbox events retain their original occurrence time, so an ordinary offline replay cannot repopulate the emptied ledger.

### Mergeable progress snapshots

`test_bank_progress_devices` gains `security_generation`. After a purge, a progress write must contain the current server-authored security marker. A stale snapshot that has learned the marker but still contains old values is replaced with the tombstone and deliberately remains one generation behind. It cannot advance until a clean marker-only snapshot is presented.

This design protects even an older browser that does not understand Segment 18: it can fetch the tombstone through the existing account-sync path, but it cannot persist its pre-purge values as the new canonical snapshot. The Segment 18 browser layer recognizes the marker, clears stale local learner state, clears the IndexedDB event mirror, and performs a one-time reload to remove in-memory stale caches before new work starts.

The monotonic Segment 14 server sync counters are not reset by deletion. This avoids reusing server sequence values and preserves cursor safety.

## Existing adaptive reset versus full deletion

The existing per-exam adaptive reset remains a **study-view reset**, implemented by synchronized max-timestamp reset markers. It intentionally does not erase the immutable lifetime learning ledger. Segment 18 does not silently change that meaning.

The new **Delete all learning history** control is different: it removes the account's persisted exam-learning evidence and New-only claims across all certifications, while retaining only the security tombstone required to prevent resurrection.

## Export security

Complete-history export now receives `securityControl` metadata containing the observed purge generation/timestamp and whether that value was verified from the server. This makes the deletion boundary explicit in exported evidence.

The earlier student mastery PDF path dynamically imported `jspdf@2.5.2` from jsDelivr. Segment 18 installs a capture-phase export shield before the old document-level handler can run and generates the same mastery report with `jspdf@4.2.1`. If that runtime cannot be loaded, the learner receives a JSON fallback instead of falling back to the vulnerable PDF runtime.

The old source line remains in the legacy hardening module for rollback compatibility, but the Segment 18 loader is ordered after the report builder and before accessibility; its `window` capture handler prevents the older `document` capture handler from receiving the export click. Regression tests enforce the patched URL and injection ordering.

## Dependency reachability

The dedicated CI job blocks **high or critical production dependency** advisories with `npm audit --omit=dev --audit-level=high`. A complete audit JSON is retained as evidence without pretending that dev-tool advisories are production browser reachability.

The application lock file is not changed merely to reduce an advisory count. A package upgrade must be justified by reachable use, compatibility, and cumulative tests. The jsPDF browser path is directly reachable and is therefore explicitly remediated to 4.2.1.

Final Segment 18 dependency maintenance upgrades the directly imported production package `@netlify/blobs` from 10.7.9 to 10.7.13 and refreshes its resolved dependency chain. The generated lockfile was produced by npm in CI, `npm ci` succeeded against it, and `npm audit --omit=dev --audit-level=high` passed before the lockfile was committed. The full audit can still report development-only advisories; those remain visible rather than being reclassified as production findings.

## Production configuration observations

At Segment 18 implementation entry, the connected Supabase project's security advisor reported:

- RLS enabled with no direct policy on `test_bank_new_question_claims`; this table is intentionally RPC-controlled and its direct learner table privileges are revoked/tested.
- authenticated-callable `SECURITY DEFINER` functions. These are reviewed by function behavior rather than suppressed by name alone. The product's Segment 16 UI uses the v2 New-only allocation RPC; legacy reservation RPCs remain temporarily callable because the preserved Segment 03 cumulative compatibility gate exercises them. Both remain owner-bound by `auth.uid()` and are tested.
- leaked-password protection disabled in Supabase Auth. This is a hosted Auth configuration item, not a SQL migration. It must be enabled/verified in the project configuration before final production security sign-off. This PR does not claim to change a setting it cannot safely migrate in repository SQL.

The connected production migration ledger was also behind the repository at entry (through Segment 07 server ingestion). This PR does not deploy Segment 13–18 migrations to production. Database-first rollout and exact live-schema verification remain separate human-authorized deployment work.

## Automated acceptance

`Exam security and data controls` runs on every PR and includes:

- Segment 18 JSDOM/static behavior tests;
- cumulative Segment 09–17 behavior checks plus the full repository Node suite;
- high/critical production dependency audit gating;
- the existing Segment 03 disposable PostgreSQL migration/role gate; and
- focused Segment 18 database tests using restricted `anon` and `authenticated` roles.

The database suite verifies owner isolation, anonymous denial, no direct mutation grant on the control table, compare-and-swap deletion, cross-owner preservation, stale-event rejection, stale-progress sanitization, clean-generation acknowledgement, and continued Segment 16 v2 availability.

## Boundaries for Segments 19–20

This PR is implementation evidence, not production qualification. It does not claim:

- physical iPhone/iPad or assistive-technology acceptance;
- JWT/PostgREST/Data API testing against the live production project;
- live deletion of any real learner's history;
- live Supabase Auth leaked-password configuration remediation;
- deployment of repository migrations that production has not yet received;
- frozen WAN/load/stress budgets; or
- final 10/10 release acceptance.

Those require human-approved deployment/qualification and remain in Segments 19–20. No automatic merge or production write is authorized by a green PR.

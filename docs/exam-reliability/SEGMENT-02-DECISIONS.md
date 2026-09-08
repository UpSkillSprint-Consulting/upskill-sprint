# Segment 02 decision and adoption record

PR:172, existing branch `audit/segment-01-baseline`. Entry head: `14bb77505b17b26aa17a07f7a462859072377185`. Main at entry: `990e385350ae63d76cfc1e3940c3644859cc636a`. Only PR172 was returned open. Netlify's reported live deployment remained `6a9f21c2b2e1be0008e52475`. The full approved roadmap artifact was verified against SHA-256 `1292ac605252d6697ed9794115cced05023f11e3558aa44214bb5685cb0173af` before selecting the Segment02 scope.

## ADR-002-A — Stack the contracts on the existing PR

Ernest's explicit instruction, “Implement Segment 02 and push to the PR,” authorizes continuing on PR172 without requiring a separate Segment01 merge first. Keep Segment01 evidence and tests intact. This changes the sequencing of review, not the substantive baseline or human merge/deployment controls. Segment01 remains unmerged at entry. Segment02 policies are **review candidates**, not falsely attributed prior human approvals. Segments03–20 remain unstarted.

## ADR-002-B — Implement contracts, not premature runtime repairs

The approved Segment02 deliverable is the metric/event/session contract plus worked examples and the frozen release rubric. Add one versioned machine policy, readable normative specification, independent fixture expectations and an isolated executable model. The model has no application imports, network calls, persistence or production hooks. No new event names are inserted into the deployed SQL enum. No question IDs/content, production JavaScript, dependency pins, database objects, learner records or live settings change.

This establishes the single target definition for later adopters. It does not claim that existing runtime modules already consume it or that G01–G14 are fixed. Their adoption/repair gates remain in the Segment01 register. A later module must use the approved version and demonstrate conformance rather than privately altering a numerator, timezone or first-answer meaning.

## ADR-002-C — Resolve ambiguous semantics before counting changes

Preserved from the inspected baseline: canonical question IDs; blanks counted in exam score but not answered mastery; confidence-discounted mastery coefficients and one-question rounding; adaptive scheduling intervals/ease; timed deadline catch-up; no background-refresh sync; conservative lifetime New-only exclusions.

Explicit target-policy choices: draft selection is not a graded retrieval; grade core modes once at session finalization and adaptive practice on explicit check; classify first/repeat from canonical history before date windows; keep lifetime-first distinct from first-since-reset; expose unknown provenance; require named scopes/watermarks; use a saved IANA timezone with labelled UTC fallback; keep pinned set length/target/version in historical results; reject malformed/duplicate finalized items; no equal-weight or70% fallback on missing configuration; known-zero timing remains measured while unknown timing stays unavailable.

Further choices: timed practice cannot pause; untimed practice may explicitly pause without enabling new controls now; offline restart with untrustworthy elapsed time requires recovery; stale writer/version never wins by client clock; a reset creates a server epoch and does not release New-only reservations; historical cache limits do not delete the canonical archive; receipt/catch-up conditions define synced-as-of. These decisions deliberately close semantic gaps before implementation; they are not retrospective claims about old data.

## ADR-002-D — Freeze the release standard

Keep the roadmap's area weights20/10/15/15/15/10/15. Expand into20 inspectable5-point criteria, with actual evidence references, exact revisions, environment requirements and blockers. Physical-device and production-only evidence cannot be substituted by simulated/preview tests. The score starts **unassessed**. Even100 claimed points cannot grant10/10 with a blocker. Security-risk triage is documented separately and does not earn closure points.

## Later adoption matrix

| Owning segment | Modules / boundary | Required contract rules | Entry/exit obligation |
|---|---|---|---|
|03 | Cumulative runtime, database-role and browser tests | All | Use independent expectations; freeze physical/network/performance budgets; distinguish emulation from devices. |
|04–05 | Registry, bank manifests, catalog/migrations | C03,C05,C14 | Preserve IDs and old revisions; pin actual set length/target; reject invalid import; verify official configuration provenance. |
|06 | `test-bank-learning-events.js` and answer capture | C02,C03,C09,C11 | Reuse durable outbox; distinguish draft, local save, cloud receipt and grade; preserve owner. |
|07 | Server ingestion/RPC/finalization | C02,C08,C09,C14 | Authorize actual role; validate versions/commands; exactly one canonical terminal result; no new unchecked enum values. |
|08 | Legacy adapters, mastery/ledger projection | C01,C02,C04,C11,C14 | Dry-run provenance-aware reconciliation; deterministic first/repeat/unknown; no reset-to-agree shortcut. |
|09–10 | Core grading; mastery hardening; analytics | C01,C04,C05,C06 | Exact totals and targets; common versioned policies/envelopes; distinguish raw/weighted coverage and readiness. |
|11 | History, score series, heatmap, export | C01,C03,C05,C13 | Use pinned expected length, qualified answer dates and saved timezone; full pagination independent of caches. |
|12–13 | Core/adaptive session, three timing owners | C03,C07,C08 | Persist ordered snapshot; restore by ID/revision; one timing policy; commit visible visit on hide; explicit unknown duration. |
|14–16 | Account sync, takeover, reservation RPCs | C07,C09,C10,C12 | Server watermark, honest sync states, explicit ownership and unchanged deadline; no full-ledger Start regression. |
|17 | Dashboard, results, charts, accessibility | C01,C05,C06,C12,C13 | Honest labels/counts/scales/domain order; manual and automated accessibility checks. |
|18–20 | Roles/reset/retention, qualification, rollout | C09,C11,C14,C15 | Close remaining security risks; actual client/device and deployed evidence; separately approved rollout/recovery. |

`contract.json.defectContracts` maps every one of the39 existing G/R/P register IDs to a contract rule; an executable test validates completeness. This is traceability, not closure. Domain-order and accessibility observations still require actual UI work, not merely a policy ID.

## Contract change control

Review the normative prose and all three JSON files together. Their initial hashes are pinned in the contract test. After acceptance, do not edit v1 semantics in place just to make a later repair pass. Add a new version plus an ADR describing changed definitions, affected modules/reports, legacy interpretation, compatibility/migration/recovery strategy and checks to reopen. Review and approve that change before activating it. Expected fixtures may not be generated by the production implementation they are meant to check.

The specification model validates representative structural and semantic boundaries; it is not a full production hostile-input validator, a real concurrent database transaction, a physical-device test or evidence-content attestation. Those acceptance gates belong to the later segments named above.

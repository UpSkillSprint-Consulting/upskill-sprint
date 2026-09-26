# Steel Phase Explorer — complete user audit

Date: 2026-09-26  
Scope: PR 220, Steps 5–10, plus every pre-existing Steel Phase Explorer module

## Outcome

The audit found two release-blocking correctness gaps. Both are fixed and covered by regression tests. No existing calculator, module, URL, saved scenario, unit control, chart, export, or professional record format was removed.

The full Steel Explorer regression suite passes 448/448 tests after the fixes. JavaScript parsing and whitespace validation also pass.

## User perspectives

### Student

The goal-based start, guided learning paths, practice, progress, causal chain, nomenclature coach, and all original exploratory modules remain available. The audit checked that the guided and full-workspace routes share the same scenario without silently changing engineering inputs.

### Steel-making professional

The eight-stage decision workflow remains separate from the engineering scenario and preserves model scope, applicability, comparisons, uncertainty, plant evidence, governed calibration, independent qualification, drift monitoring, reporting, replay, release readiness, and the specification identity handoff. Acceptance, approval, qualification, compliance, and product release remain separate decisions.

## Coverage matrix

| Area | States and interactions audited | Result |
|---|---|---|
| Guided start | Student/professional choice, goal routing, resume, reference and export shortcuts | Pass |
| Equilibrium diagram | Point add/remove/select, presets, drag/keyboard model, metric/imperial, tie line, spotlight, snap, connected path | Pass |
| Heating & cooling path | Presets, step editing, play/pause/scrub, boundary timeline and chart refresh | Pass |
| TTT/CCT | Mode switching, cooling/hold/final inputs, constituent response, critical temperatures | Pass |
| Chemistry & properties | Chemistry presets/inputs, critical-temperature and property outputs, validity warnings | Pass |
| Hardenability | Geometry, section size, quench, grain size, target hardness, Jominy and section charts | Pass |
| Austenitization | Temperature, time, section, structure/carbide/pinning/rate, operating-window and grain charts | Pass |
| Quenching | Medium and process comparisons, selected-cycle linkage, hardness/risk visualization | Pass |
| Process Data | Empty, import, invalid/oversize, smoothing/measurement modes, chart, report/export states | Pass |
| Metallurgy Lab | All sub-modes, treatment/diagram controls, quizzes, canvas/SVG responses | Pass |
| Reference diagrams | Both maps, point controls, units, zoom/fit, highlighting, scrollable chart state | Pass |
| Learn & export | Challenges, save/share/export, scenario integrity and recovery behavior | Pass |
| Professional workflow | All 8 stages; incomplete, ready, conditional, withheld, calibrated, qualified, draft and replay states | Pass |
| Step 9 readiness | Student/professional pilot counts, evidence gates, controlled readiness export | Pass |
| Step 10 specification handoff | Empty, invalid, valid identity, stale-read protection, clear, export and destination link states | Pass |

## Responsive and visual contract

The audited responsive contract covers 360, 390, 768, 1024, 1280, and 1440 px; keyboard-scrollable wide charts; coarse-pointer target sizing; light/dark tokens; print output; overflow containment; and reduced motion. Automated checks verify chart names, scroll regions, focus visibility, required breakpoints, and contrast tokens.

The authenticated PR 219 preview was inspected successfully and confirmed the shared visual system and administrator access. A secure sign-in was attempted on PR 220, but that preview returned to its sign-in page without displaying a site error. No protection was bypassed. Therefore, the final deployment-only pixel confirmation of the new Step 8–10 panels remains a pre-merge administrator check on the PR 220 deploy preview.

## Findings and fixes

### 1. Monitoring chronology used the wrong level of comparison

Severity: release-blocking correctness defect

The calibration contract defines a monitoring group's timestamp as the latest row timestamp in that group. The implementation instead rejected a group when any replicate row was not later than the reference data, even when the group's defined latest timestamp was valid.

Fix: aggregate each monitoring group first, use its latest valid row timestamp, then compare each group timestamp with the latest calibration/validation timestamp. Group-count and timestamp validity guards remain intact.

Regression: a two-replicate monitoring group now passes when its latest timestamp is later than reference data, matching the documented statistical definition.

### 2. Older asynchronous imports could overwrite newer user intent

Severity: release-blocking interaction/data-integrity defect

If a large calibration file completed reading after a newer file, the older completion could replace the newer package. A late completion could also repopulate a package after the user selected Clear.

Fix: generation tokens now invalidate stale calibration, qualification, and replay reads. Clearing calibration, qualification, or the complete professional record invalidates matching in-flight reads. A successful candidate change also invalidates any in-flight qualification package tied to the prior candidate.

Regression: file B remains active when file A completes late, and an in-flight file cannot restore data after Clear.

## Verification

- Steel Explorer suite: 448 passed, 0 failed
- New chronology and file-race regressions: passed
- Modified JavaScript syntax: passed
- `git diff --check`: passed
- Production authentication: preserved; no bypass added
- Repository-wide suite: 1,674 passed and 161 failed outside this tool. The failures are dominated by missing Test Bank implementation/migration files (`ENOENT`) plus an unrelated certification-preview assertion; no repository-wide green claim is made.

## Pre-merge deployment check

Using an administrator session on the PR 220 preview, visually confirm the Step 8–10 panels in light and dark mode at 390, 768, 1024, and 1440 px, with special attention to long readiness/specification content and horizontal chart scrolling. This is the only remaining environment-specific check; it does not block the deterministic code and model verification above.

# Segment 02 — early dependency triage (R14 remains open)

Evidence: fresh `npm audit --json` from PR172 preparation run34170792820 at head `330740b4211b607a2771550c6f98a8967ef6abd8`; unmodified package lock; source inspection of the full checked-out repository. The report still lists11 affected packages:1 critical,4 high,6 moderate. The count is an advisory inventory, not a count of proven exploits. A later audit may change as advisories are updated; retain each capture's revision/run rather than silently rewriting this snapshot.

| Locked package | Advisory severity | Initial reachability finding / remaining check |
|---|---|---|
|jspdf2.5.2 | Critical | Although package.json lists it as dev, `test-bank-adaptive-mastery-hardening.js:621` dynamically imports the same2.5.2 from jsDelivr in the student PDF-export path. It is **not safe to dismiss it as development-only**. Review browser export and separately inventory any Node usage. |
|dompurify2.5.9 | Moderate | jsPDF dependency. Determine the actual sanitizer/module included by the CDN browser build and each invoked export path; the lock file alone does not inventory CDN runtime code. |
|@netlify/blobs10.7.9 | High | Direct import at `netlify/functions/material-checker.mjs:1` establishes production package use. It does not prove all transitive advisory paths are bundled/reachable. |
|@netlify/dev-utils4.4.6 | High | Transitive chain from Netlify packages. Inspect deployment bundle and image-processing entry points. |
|image-size2.0.2 | High | Image-parser advisories appear in the audit dependency chain. Production parser invocation with untrusted input is not established by package presence. |
|@netlify/otel6.0.3 | Moderate | Telemetry dependency; determine activation, propagation and header handling in deployed functions. |
|@opentelemetry/core2.7.1 | Moderate | Upstream baggage-propagation advisory. Check reachable propagation inputs and limits, not just dependency labels. |
|@opentelemetry/resources2.7.1 | Moderate | Transitive advisory chain; qualify actual deployed usage with the same bundle review. |
|@opentelemetry/sdk-trace-base2.7.1 | Moderate | Same trace dependency chain. |
|@opentelemetry/sdk-trace-node2.7.1 | Moderate | Same trace dependency chain; distinguish Node runtime from browser paths. |
|undici7.28.0 | High | Marked dev in the lock; inventory build/test versus shipped usage and the specific retry/cache/cookie paths named in the audit. |

## Primary-source boundary check

The jsPDF maintainer's **GHSA-f8cm-6447-x5h2** states that its local-file/path traversal issue affects the Node builds and was fixed in4.0.0. That particular critical issue is not thereby demonstrated in the browser-export import. Other jsPDF advisories still need their own browser-path review; this distinction does not close the package's overall risk. Source: https://github.com/parallax/jsPDF/security/advisories/GHSA-f8cm-6447-x5h2 (consulted during this segment).

The OpenTelemetry maintainer describes **GHSA-8988-4f7v-96qf** as unbounded memory allocation in W3C Baggage propagation. Actual deployment exposure still needs to be established. Source: https://github.com/open-telemetry/opentelemetry-js/security/advisories/GHSA-8988-4f7v-96qf (consulted during this segment).

A guessed maintainer path for the image-size advisory returned404; no conclusion is based on that failed lookup. The installed-package finding above comes from the captured audit, and authoritative advisory/path verification remains open.

## Action and release gate

The audit proposed @netlify/blobs10.7.13 as a non-major fix and jsPDF4.2.1 as a major fix in this snapshot. These are **candidates for a controlled remediation**, not validated upgrade instructions or promises that one version removes every issue. Refresh the advisories, inventory both installed and CDN packages, test exports/function builds, and select a compatible patch in the appropriate repair segment. A package-lock-only jsPDF update would leave the explicit CDN pin unchanged.

No dependency or CDN pin is changed here; no forced audit-fix command was run. Segment03 must create safe regression coverage/fixtures for the reachable features; Segment18 owns verified security closure before19/20 qualification, with immediate escalation rather than waiting if an exploitable exposed path is established. Keep R14 and rubric criterionAC18 open until each applicable risk is repaired or its non-applicability is evidenced and human-reviewed. A green contract workflow is not a security sign-off.

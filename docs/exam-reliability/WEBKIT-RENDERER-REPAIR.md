# PR173 — Linux WebKit rendering repair

This supplements the preserved investigation in `WEBKIT-REVIEW-STABILITY.md`. It does not replace previous failing results or claim that a watchdog alone fixes a stalled browser.

## Evidence and scope

Entry revision: `97b386874371ea3920e769c4f43900e942db00bb`. The acceptance job correctly rejected unsuccessful browser jobs. Installation succeeded. The reported failing operations included Batch 4 review 80 (`d3-050`) and full review 166 (`d6-056`). A separate local, long-lived review session also stopped at review 94 (`d4-014`); subsequent screenshot/HTML/close operations could not complete. Native WPE stacks showed the page main thread and compositor waiting in native synchronization, not an exception indicating a missing question or incorrect answer key.

Those observations identify a native rendering path to avoid on headless Linux runners, but stripped stack symbols do not prove the exact upstream source-level deadlock. In particular, the last question in a progress file is not proof that the question itself is defective. No question data is changed by this repair.

The pinned Linux Playwright WebKit binary includes and reads `WEBKIT_SKIA_ENABLE_CPU_RENDERING`. In the inspected build the unset/`0` branch bypasses the CPU-only setting. Thus explicitly choosing CPU rendering changes the headless rendering path; it is not an ineffective repetition of an assumed default from another WebKit release.

## Corrections

### 1. Deterministic headless WPE painting

`scripts/lib/student-audit-platform.cjs` selects WebKit's supported CPU Skia ImageBuffer rendering and one CPU painting worker for Linux WebKit audit processes. `scripts/run-student-audit.cjs` applies it before launching the independently supervised audit child. All seven batch drivers, full examinations and edge tests inherit the same policy. Browser versions remain locked; Chromium uses its normal rendering configuration. Production scripts never import this module, and the application delivered to Safari is not modified by the environment settings.

This does not disable SVG/canvas, CSS, screenshots, compositing, pointer/keyboard actionability or accessibility tests. It removes reliance on an accelerated ImageBuffer path on GPU-less Linux CI. Native Apple Safari, actual iPhone/iPad GPU behavior and physical-device acceptance remain distinct later requirements.

`supervisor.json` records the exact platform/engine/rasterizer/painting-worker policy. The complete student acceptance gate rejects missing or mismatched rendering-policy evidence. Removing the policy cannot silently return future audits to an unqualified configuration.

### 2. Retain the learner's control focus during deferred navigation

Each of the seven MBB interface helpers already schedules question navigation with `requestAnimationFrame`. A callback could run after the learner had focused an answer/control and steal that focus while scrolling. The prior connected-node check did not prevent this race because the quiz remained connected.

The callback now does nothing if a button, input, select, textarea, summary or role-button within the quiz already holds focus. Initial question navigation still scrolls/focuses the question when no learner control has been focused. Seven independent regressions fail against the preceding source, pass with the guard, and also verify that normal initial navigation remains functional. This fixes a reproducible application race; it is not represented as a symbol-level explanation of the native compositor freeze.

### 3. Reuse the installed accessibility engine, never its results

The preceding single-document wrapper bootstrapped the complete axe script for every scan. The adapter's legacy implementation reinjects it, creating avoidable repeated script initialization during 700 evaluations per profile. The helper now installs the engine once per document and calls the public `axe.run` API with the same include scope and WCAG 2 A/AA tags for every subsequent evaluation.

Every scan evaluates the current DOM afresh. Only the engine identity is retained in a WeakMap. Navigation/engine loss causes a fresh bootstrap. An error is propagated, not retried. Concurrent scans on one page are rejected. Existing frame guards and nonempty-rule assertions remain. The actual browser fixture compares normal, initial single-document and reused-engine results on deliberately inaccessible content. New unit fixtures independently change the DOM, remove the engine to model navigation and inject a scan failure; none may reuse a prior passing result.

This optimization reduces needless setup and is not asserted to be the sole native stall cause.

## Coverage and failure standards unchanged

No timeout increases, automatic retries, forced clicks, simulated click dispatch, ignored rules, shortened examinations, deleted assertions, different question keys or removed browser profiles are introduced. Each of the seven full profiles still needs all 175 questions, 175 reviews, both themes and 700 accessibility evaluations. The independent second WebKit390 session and both edge profiles remain mandatory. Existing batch coverage and twenty-/forty-minute job limits remain.

The 90-second no-progress watchdog, bounded operations, scoped descendant cleanup, exact-source artifact gate and cancellation/failure rejection remain. They contain and expose unexpected future problems rather than hiding them.

## Validation and release reporting

Before-and-after focused-control results, local browser ablations and native stack evidence are diagnostic records, not final PR-head qualification. The review record must name the final pushed head/tested merge and report actual results for every required workflow. A passing targeted run or a CPU-only local run does not override a failing full student profile.

No production database writes or migrations are part of this repair. The Segment05 migration → trusted catalogue publication → matching frontend/immutable archives sequence still applies. Required human review and production readiness are separate from CI-green/no-conflict status. Segment06 is not included or claimed complete.

## Primary references

- WPE release notes document the CPU rasterizer switch: https://wpewebkit.org/release/wpewebkit-2.46.1.html
- WebKit environment-variable documentation describes the CPU painting-worker override and CPU-only ImageBuffers: https://sources.debian.org/data/main/w/webkit2gtk/2.52.5-1/Documentation/webkitgtk-6.0/environment-variables.html
- WPE maintainer notes describe CPU rendering for unreliable accelerated driver combinations: https://blogs.igalia.com/llepage/the-wpe-platform-api/
- axe public API and adapter implementation are supplied by the unchanged locked `axe-core` and `@axe-core/playwright` 4.13.0 packages; `axe.run` and the adapter's supported single-document path use the same rules/scope here.
- Playwright actionability remains enabled: https://playwright.dev/docs/actionability

An upstream release default or a different GPU's reported issue is not claimed to prove this exact pinned binary's defect. The chosen environment policy is qualified by the complete runs on this repository.

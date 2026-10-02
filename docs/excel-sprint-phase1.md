# Excel Formula Sprint — Phase 1

Ten complete assignment packages at the existing Excel Formula Fluency URL, with the original reference lesson retained. Levels 3–10 are visible but unavailable. Each package has a separate fixed-seed dataset, four required tasks, an optional bonus, and worked lessons covering at least two formulas.

## Build and private content

Run `npm run build:excel-sprint` to regenerate public catalog/packages, CSV/XLSX workbooks, and `netlify/functions/_shared/excel-sprint-answers.json`. Workbooks contain Data (named SprintData table), Answers, Dictionary, and Parameters when needed. Generated workbooks contain no answers or formulas.

`npm run build:site` stages the public site in `public-site`. Netlify publishes this directory, excluding functions, build-only curriculum, scripts, tests, and private keys. Do not switch publish back to repository root.

## Deployment requirement

Set `EXCEL_SPRINT_SIGNING_SECRET` as a cryptographically random secret of at least 32 bytes in Netlify's Functions environment, including Deploy Previews. Keep it stable: replacing it invalidates existing completion records. It is never embedded into static files. Grading fails closed with 503 when missing. No Anthropic key is needed in Phase 1.

Endpoints use modern Request/Response handlers and Netlify platform rate limits (30 requests per minute per IP/domain). Verify rate-rule acceptance in deploy post-processing logs and actual 429 responses on the preview. Local tests cannot prove platform enforcement.

## Behavior and limits

Deterministic result comparison decides correctness; formulas are required and checked for basic structure, not executed. This follows the approved hybrid grading design. AI formula coaching comes in Phase 2.

HMAC completions bind sequential predecessor hashes and one learning-path ID. Signed receipts accumulate individual task attempts. All progress stays in IndexedDB with a localStorage backup/fallback; blocked storage runs in memory with an export warning. Imported completion chains are verified before replacement. Signed completion counters override local counters for completed packages.

Stateless grading cannot prevent users from replaying an earlier receipt or restarting the first package to improve first-attempt metrics. Completion proofs certify matching results, not identity, independent work, or formula execution.

Reinforcement drills, Expert Track, placement tests, certificates, and variant datasets remain future work, explicitly labelled in the UI. Legacy reference practice progress remains separate and cannot unlock Sprint packages.

## Validation

18 focused tests cover grading, token tampering, sequential gates, optional bonus, solution protection, malformed input, result shapes/tolerances, storage fallback, import, and public assets. A DOM smoke check verifies 50 map entries, 49 initially disabled, the first assignment, download links, and dashboard. All ten XLSX files were loaded with openpyxl and their named tables checked. Full site build succeeds.

# Excel Formula Sprint — Phase 2

Levels 3–6 add twenty complete packages to the ten Phase 1 packages. Level 3 teaches exact, two-way, approximate and guarded lookups; Level 4 cleans and transforms text; Level 5 handles explicit calendar dates, working-day exclusions, completed service and overnight shifts; Level 6 builds dynamic reports. All lessons contain fewer than 400 words, four required tasks and an optional bonus. Each has an independent deterministic seed and fictitious company/dataset.

L6-A5 reshapes 80 Charpy observations into 40 rows with Sample_no, Heat_no, LPA energy and TWA energy. Both keys identify a sample, orientation labels are normalized, and blank energy returns Missing. Supporting sheets have separate CSV/clipboard downloads. Workbook answer ranges accommodate large spills without overlapping other tasks.

## Reproducible downloads

`npm run build:excel-sprint` regenerates public JSON, all CSV files, private grading keys and private coaching context. The new XLSX sources are authored with `@oai/artifact-tool` and committed under `content/excel-sprint/workbooks`. The portable build verifies their curriculum fingerprints and SHA-256 hashes before copying them to public assets; Netlify does not need the authoring library. Fixed source workbooks make subsequent builds byte reproducible. Original ten package/download files and private grading keys remain unchanged, preserving Phase 1 records.

To re-author a workbook after changing its curriculum, copy `scripts/author-excel-sprint-workbooks.mjs` into a temporary directory where `@oai/artifact-tool` resolves, then run the runtime Node executable with the repository's absolute path and a temporary preview-directory path. In this Work environment, link the temporary directory's node_modules to CODEX_PRIMARY_RUNTIME_NODE_MODULES and use CODEX_PRIMARY_RUNTIME_NODE. Mark the spreadsheet creation operation through the spreadsheet skill before authoring. The script exports all twenty workbook sources, renders every sheet, and updates manifest.json. Review the PNGs and workbook cell data, remove temporary inspect sidecars, then run the portable generator. Never add private answers or model formulas to the downloadable workbooks.

## Server formula coaching

The opt-in Review my formula button appears after a task has received a deterministic result check. `/api/excel-sprint/coach` verifies a signed task-attempt receipt and the preceding completion before calling Anthropic. Feedback covers logic, robustness, references, readability, efficiency and one next step. It uses pinned `claude-haiku-4-5-20251001` with structured output, a 750-token response cap, 15-second timeout and a Netlify limit of six requests per minute per IP/domain. Public exercise context, the submitted formula/result and the independent result verdict are sent; private answers, hints and model formulas are excluded.

AI suggestions never award points, increment attempts, create completion proofs or unlock packages. Formula execution is still performed by the learner in Excel. Result matching cannot establish that a submitted formula produced the output. Feedback is prose; solution snippets, markup and malformed/provider-truncated output fail closed. In-session feedback is invalidated when the formula or result changes. Full model solutions still require matching completion.

## Deployment configuration

Keep EXCEL_SPRINT_SIGNING_SECRET unchanged in the Functions scope for production and Deploy Previews. Curriculum and proof versions remain 1; old verified ten-token backups unlock L3-A1.

Coaching requires ANTHROPIC_API_KEY in the Functions environment, including Deploy Previews. An enabled Netlify AI Gateway can supply the key and ANTHROPIC_BASE_URL automatically; otherwise configure an Anthropic key directly. The endpoint uses the trusted HTTPS base URL or api.anthropic.com. No key or provider exception is sent to the browser. `/api/excel-sprint/coaching-status` exposes only an availability boolean. Missing AI configuration or provider failures leave deterministic grading, saved work and downloads usable.

Publish public-site, keeping content, scripts, tests and all function sources outside static hosting. AI feedback currently runs only when explicitly requested; account registration and a learner database are not introduced.

## Validation

31 focused tests cover the complete thirty-package signed chain, migration from ten-token backups, exact/approximate boundaries, duplicate and absent keys, text leading zeros, trailing blank cells, shutdown dates, overnight durations, Charpy identity/missing energy, coaching authorization/failures, output privacy and learner interactions. The CI workflow regenerates assets and requires a clean diff before running these tests.

All twenty XLSX sources were rendered (87 worksheets) and their OOXML values checked against the seeded datasets, including supporting-sheet identities and empty answer ranges. The original thirty Phase 1 package/CSV/XLSX files were compared byte for byte. Search regressions and the full static site build also run before deployment. Live provider availability and actual platform rate-limit enforcement require deployed validation; local tests cannot establish them.

Levels 7–10, reinforcement, placement, Expert Track and certificates remain future releases. Phase 1's stateless receipt replay limitation remains: learners can restart/replay personal attempt records without a database.

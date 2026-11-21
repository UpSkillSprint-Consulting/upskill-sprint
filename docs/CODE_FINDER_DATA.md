# Code Finder data guide

Code Finder (`/tools/code-finder/`, coming in PR 2) looks up codes and standards by industry, category, use case, document type and jurisdiction. Everything it knows lives in three JSON files in `data/code-finder/`. Changing what the tool shows is a data edit, not a code change.

| File | What it holds |
| --- | --- |
| `taxonomy.json` | The controlled lists for every facet (industries, categories, use cases, doc types, jurisdictions, materials), the standards bodies and the relation types. |
| `standards.json` | One metadata record per code or standard. |
| `synonyms.json` | Shop-floor words ("CVN", "MTR", "gauge R&R") that expand a search to records or facets. |
| `scenarios.json` | Starter packs: a hand-picked, ordered list of codes for one job, each with a one-line reason. |
| `wizard.json` | The two "Not sure where to start?" questions and how each answer maps to industries or use cases. |

`node scripts/validate-code-finder.mjs` checks all three files. It runs in `npm run build:site` before the site is staged, so a bad record fails the Netlify deploy. Run `npm run test:code-finder` before you push.

## Copyright rules (non-negotiable)

- Store **metadata only**: designation, title, our own plain-language summary, tags, relations and adoptions.
- **Never** paste scope text, clauses, tables or figures from a standard. Write the summary yourself in one or two plain sentences. The tests reject summaries containing "shall", the tell-tale of copied normative text.
- Link to the publisher's own page; never host or link to unofficial copies.
- ISO Open Data imports (Phase 3) are licensed ODC-By 1.0 and must be attributed on the page.

## Adding a standard

Add an object to `standards.standards`:

```json
{
  "id": "astm-e23",
  "body": "ASTM",
  "designation": "ASTM E23",
  "title": "Standard Test Methods for Notched Bar Impact Testing of Metallic Materials",
  "docType": "test-method",
  "status": "active",
  "summary": "How to run Charpy and Izod impact tests to measure toughness, including specimen, machine and temperature rules.",
  "industries": ["steelmaking", "pipe-tube-mfg"],
  "categories": ["mechanical-testing"],
  "useCases": ["run-lab-test", "certify-mill-product"],
  "jurisdictions": ["us", "intl"],
  "relations": [{"to": "iso-148-1", "type": "similar"}],
  "adoptions": [],
  "learning": [],
  "verified": null
}
```

| Field | Rule |
| --- | --- |
| `id` | Body prefix plus number, lowercase with hyphens: `api-5l`, `csa-z245-1`, `iso-iec-17025`. Never change an id once published; it becomes a URL. |
| `body` | One of the `bodies` codes in `taxonomy.json`. |
| `designation`, `title` | As the publisher lists them. Designations must be unique. |
| `docType`, `status` | From `taxonomy.json` docTypes; status is `active`, `withdrawn` or `superseded`. |
| `summary` | 40 to 280 characters, one line, our own words, plain language (grade 9 reading level). |
| `industries`, `categories`, `useCases`, `jurisdictions` | At least one each, every value from `taxonomy.json`, no repeats. Tag every place the code is genuinely used. |
| `materials` | Optional, from `taxonomy.materials`. |
| `relations` | `equivalent`, `similar`, `references` or `supersedes`, pointing at another id. Declare each link once; `relationsFor()` shows it from both ends. |
| `adoptions` | Where a regulator makes the code mandatory: `jurisdiction`, `regulator`, `instrument`, `editionCited`, `style` (`dated` or `as-amended`) and its own `verified` date. Only add one you have checked against the regulation itself. |
| `learning` | Links to our own lessons or tools: `{"type": "lesson", "href": "/lessons/...", "label": "Gauge R&R study"}`. `label` is the link text users see. The build checks the page exists. |
| `edition`, `year` | Only on verified records. Leave both out until someone has checked the current edition. |
| `verified` | `null` until a person checks the record against the publisher's catalog; then the check date. Records older than 12 months show as stale. |
| `keyPoints` | Optional, 3-6 bullets of 20-240 characters: what the code covers, in our own words (no "shall"). **A code page is only indexed by search engines once it has key points**; until then it is published with `noindex, follow` and left out of the sitemap, so thin pages never count against the site. |
| `tips` | Optional, 1-3 practical tips from real work (what to check on the order, common audit findings). |

## Adding a facet value or synonym

- New industry, category or use case: add `{"slug": "...", "label": "..."}` to the right list in `taxonomy.json` (add `"parent"` for a sub-sector), then tag records with it. The tests require every category and use case to have at least one record.
- New synonym: add `{"term": "...", "aliases": [...], "records": [...]}` to `synonyms.json`. Terms and aliases are lowercase and may only appear once across the whole file. Targets can be `records`, `categories`, `useCases` or `industries`.

## Verification workflow

The seed catalog marks most records `verified: null`. To verify a record:

1. Open the publisher's catalog page and confirm the designation, title, status and current edition.
2. Add `edition` and `year`, and set `verified` to today's date.
3. For any adoption, check the regulation text and set that adoption's own `verified` date.

The weekly update task (Phase 2) will draft these checks as PRs for review.

## Starter packs

A pack answers "which codes do I need for this job?". Add one to `scenarios.packs`:

```json
{
  "slug": "storage-tanks",
  "title": "Building and inspecting storage tanks",
  "summary": "Design, venting, overfill protection and in-service inspection of aboveground tanks.",
  "industries": ["oil-gas", "chemicals"],
  "useCases": ["design-structure", "inspect-in-service"],
  "regulated": false,
  "records": [{"id": "api-650", "why": "Design and construction of atmospheric welded tanks."}],
  "lessons": [{"href": "/lessons/quality-engineering/top-down-vs-bottom-up-risk-assessment", "label": "Top-down vs bottom-up risk assessment"}]
}
```

| Field | Rule |
| --- | --- |
| `slug` | Lowercase with hyphens. It becomes `?pack=<slug>` and, in PR 4, a page URL; never change it once published. |
| `industries`, `useCases` | Taxonomy values. The wizard ranks packs by these, so tag every industry the pack genuinely serves. |
| `regulated` | `true` only for pipelines, pressure equipment, medical devices, food, aerospace and nuclear (Ernest's decision, Nov 2026). It shows the "Need help applying this?" consulting box. |
| `records` | At least 3 codes, in the order a reader should work through them. `why` is one line in our own words (no "shall"). |
| `lessons` | At least one of our lessons where one fits; the build checks the page exists. |

The tests require at least 9 in 10 wizard answer pairs to reach a pack that fits both answers. When you add a wizard option, add or retag a pack so it is covered.

## Export leads

Downloading a pack (CSV or print to PDF) asks for an email once per browser. The address is posted to the Netlify form **`code-finder-export`** with the pack slug and an optional, unticked-by-default `marketing_opt_in`. Netlify stores the submission, and `form-submission-notification.mjs` (via `netlify/functions/_shared/code-finder-export-email.mjs`) sends two emails through Resend:

- **To the visitor:** "Your Code Finder pack: <title>", listing every code with its reason, check status and page link, the consulting note on regulated packs, the lessons, and the pack spreadsheet attached as CSV. Reply-to is hello@. It is a one-time, requested (transactional) email and shows the CASL mailing address from `NEWSLETTER_POSTAL_ADDRESS`.
- **To hello@:** "Code Finder lead: <pack title>", with the email, the pack and whether they opted in to updates. Reply-to is the visitor.

Only addresses with `marketing_opt_in=yes` may be added to update emails (CASL). The Netlify dashboard's own form email (its subject still reads "New lesson request") duplicates this alert; remove it under Forms → Form notifications.

## Indexable pages (`/codes/...`)

`scripts/build-code-finder-pages.mjs` runs in `npm run build:site` and writes one static page per code (`/codes/api/5l/`), category, industry, starter pack and equivalent/similar pair (`/codes/compare/api-5l-vs-iso-3183/`), plus the `/codes/` hub, into `public-site/`. These pages are build output: never commit them. They pick up data changes automatically.

Comparison pages are indexed only when both codes have key points. Hub, category, industry and pack pages are always indexed.

When codes, key points, packs or relations change, refresh the committed `sitemap.xml` snapshot from `public-site/sitemap.xml` after a build. `tests/code-finder-pages.test.js` fails until every generated page is listed.

## Enrichment backlog

57 of 159 codes have key points (Nov 2026: line pipe and OCTG, mechanical testing, chemistry and metallography, structural, welding, pipelines, pressure equipment, NDT, SPC/MSA and quality systems). Enrich the rest in batches of 15-20, starting with codes that appear in starter packs. Each batch is a data-only PR: add `keyPoints` (and `tips` where useful), rebuild, refresh `sitemap.xml`, run `npm run test:code-finder`.

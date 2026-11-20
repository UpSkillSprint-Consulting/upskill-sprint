# Code Finder data guide

Code Finder (`/tools/code-finder/`, coming in PR 2) looks up codes and standards by industry, category, use case, document type and jurisdiction. Everything it knows lives in three JSON files in `data/code-finder/`. Changing what the tool shows is a data edit, not a code change.

| File | What it holds |
| --- | --- |
| `taxonomy.json` | The controlled lists for every facet (industries, categories, use cases, doc types, jurisdictions, materials), the standards bodies and the relation types. |
| `standards.json` | One metadata record per code or standard. |
| `synonyms.json` | Shop-floor words ("CVN", "MTR", "gauge R&R") that expand a search to records or facets. |

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

## Adding a facet value or synonym

- New industry, category or use case: add `{"slug": "...", "label": "..."}` to the right list in `taxonomy.json` (add `"parent"` for a sub-sector), then tag records with it. The tests require every category and use case to have at least one record.
- New synonym: add `{"term": "...", "aliases": [...], "records": [...]}` to `synonyms.json`. Terms and aliases are lowercase and may only appear once across the whole file. Targets can be `records`, `categories`, `useCases` or `industries`.

## Verification workflow

The seed catalog marks most records `verified: null`. To verify a record:

1. Open the publisher's catalog page and confirm the designation, title, status and current edition.
2. Add `edition` and `year`, and set `verified` to today's date.
3. For any adoption, check the regulation text and set that adoption's own `verified` date.

The weekly update task (Phase 2) will draft these checks as PRs for review.

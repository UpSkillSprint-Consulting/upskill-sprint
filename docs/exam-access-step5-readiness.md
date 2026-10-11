# Step 5 — validation and release readiness

Assessment date: 2026-10-11. Baseline: PR #288 at `85b0c1838e2f74ac3b6358e97505d0eb34dc6852`.

**Current release status (2026-10-11): Steps 1–4 and the three individual tool
locks are implemented. Hosted schema and function configuration are installed.
The real CSSBB request/approval/quiz/revocation journey passed. Tool grant journeys
and the newest CI results are recorded in PR #288; see also `tool-access.md`.**

Final QA fixed an account-state gap: exam delivery and its directory now reject
banned, unconfirmed, or missing accounts even while a previously issued JWT remains
valid. Migration `20261011203852_exam_access_active_accounts.sql` was installed as
hosted version `20261011204059`. Do not replay it under the local timestamp. No
membership records, user grants, tables, polling or background jobs were added.

**Keep draft pending release decisions:** one active non-admin Premium account
has no individual exam allocation and will lose simulator access at cutover.
Review its approved exam allocation privately before activation. Public GitHub
question/tool source and historical Netlify deployments remain outside the new
website access gate; private source/deployment exposure must be resolved before
claiming confidentiality. No account allocation or repository visibility change
is implied by this audit.

The following original Step 5 assessment is historical. The current delivery
build passes the mandatory public-content checks; it is not the earlier public
question-bank build described below. Do not use the historical findings as the
current hosted state. The final PR QA notes distinguish real hosted checks from
isolated browser/SQL fixtures and list remaining release decisions.

## Original assessment before Step 2

| Check | Result |
| --- | --- |
| Repository and PR prerequisites | PR #288 still contains Step 1 only. Main is `bd44c26679c7a3e0389acd570f8280d2925cb7d1`. No subsequent access implementation was found. |
| Hosted permission schema, read-only | `exam_catalog`, `user_exam_grants`, `exam_access_requests`, `can_access_exam` and `get_my_exam_access` are not installed. The existing Premium rule remains active. |
| Local PostgreSQL, permissions and membership regressions | 42 focused checks passed, including zero/one/multiple grants, expiry, revocation, pending renewals, retirement, isolated caller contexts, metadata forgery, and private writes. |
| Existing stateless simulator | Full, Quick and Focused result-screen checks passed. No practice persistence was added. |
| Build | `npm run build:site` passed. |
| Public content preflight | Correctly blocks release while active banks and exam-specific assets remain public. This is separate from the passing regression tests. |
| Hosted end-to-end user journeys | Not claimed: the protected endpoints, admin UI and new learner UI do not exist yet. |
| Mobile and light/dark review of redesigned page | Blocked until Step 4 is implemented. The earlier visual mockup is not a production implementation. |
| User transition | No verified user-to-certification allocation was supplied or inferred. No permissions were changed. |

## Concrete finding fixed

The current stateless runtime has no references to the old `exam-catalog` directory,
but the build was still copying its ten JSON files to the CDN. Five contain question
and answer snapshots. Exclude that directory from public staging; retain its source
files in Git for provenance. The active simulator's question files remain in place
until Step 2 replaces them with authenticated delivery.

The initial scan found 16 known bank scripts, question/answer literals in the main
simulator and five archived JSON snapshots, and 75 exam-specific supporting assets.
Supporting assets are review findings, not a claim that each file independently
exposes an answer. Removing the archived directory does not secure the active banks.

After the exclusion, the final staged-output scan inspected 730 files and still
returned exit 1: 16 active bank scripts, the inline bank in `test-bank.html`, and 75
supporting assets. The ten archived catalog files and the entire Supabase directory
were absent from the publish output. Those remaining findings block protected-exam
release until Step 2 is implemented and verified.

## Repeatable checks

```sh
npm ci
node --test tests/exam-access-foundation.test.js tests/exam-access-release-audit.test.js tests/access-levels.test.js tests/premium-simulator-access.test.js tests/owner-admin.test.js tests/test-bank-stateless-results.test.js
npm run build:site
node scripts/audit-exam-public-content.mjs public-site
```

The static preflight outputs paths and reasons without reproducing questions or
personal data. Exit 1 means findings; exit 2 means the input could not be audited.
An empty or missing build cannot produce a passing result. Exit 0 means only that
the known static signatures were not found, not that the whole release is secure.
Encoded content, new formats, authorization, caching, APIs, runtime state and user
transitions require separate checks. Potentially legitimate public quiz content
must be reviewed explicitly, not silently exempted from the scanner.

The focused CI now also runs the Step 2 delivery tests and a full site build, which
must pass the public-content scan. This does not call the draft release-ready.

## Member transition input

Use `docs/exam-access-transition-template.csv` as a header-only template. Fill a
private copy with one row per verified learner/exam pair. Keep the completed file
out of Git and public build output. Fields:

- `user_id`: verified Supabase account UUID, not a guessed email match.
- `exam_key`: exact catalog key; never `*` or `all`.
- `expires_at`: ISO timestamp with timezone, or blank for no expiry.
- `approved_by`: verified approving administrator UUID.
- `evidence_reference`: reference to an existing purchase or explicit approval;
  do not copy payment details, messages, or personal records into this file.
- `decision`: `grant` or `hold`. A hold does not authorize practice.

An empty template is not a reviewed allocation. Premium membership, prior usage or
an existing account does not prove which certification should be granted. Step 3's
administrative path must validate the mapping, reject duplicates/unknown exams,
apply only approved grants and write the audit record atomically. This template is
not an importer and performs no database writes.

## Release acceptance matrix still to execute

| Scenario | Required evidence before production |
| --- | --- |
| Signed out or zero grants | Catalog remains browsable; direct exam URLs, bank endpoints, answers and private assets deny content. |
| One grant | Only that certification's released sets and modes open. Changing an exam key cannot reveal another bank. |
| Multiple grants | Exactly the approved certifications open; a new certification stays locked. |
| Expiry or revocation during practice | Next protected request denies further delivery; UI clears protected state on the supported recheck. Already downloaded material cannot be recalled. |
| Admin control | Grant, revoke, expiry, stale-edit conflict, approve/decline request and audit attribution work; other users cannot call those write operations. |
| Refresh/account change/another device | Server permissions remain consistent without sharing one account's protected content with another. Practice recovery is out of scope for the stateless simulator. |
| Client/network failures | Missing session, authorization error or timeout denies content with a usable recovery message. |
| Full/Quick/Focused, timed/untimed, reveal | All current modes use protected delivery and preserve scoring behaviour. |
| CDN and old paths | Old bank URLs, legacy JSON snapshots, source maps, protected figures and CDN caches cannot serve unauthorized content. |
| Mobile, light and dark | New cards, locked/pending/expired states and admin controls remain readable and keyboard/touch accessible. |
| Free-plan budget | Only compact permission/request rows and bounded change history; no question uploads, progress writes, polling or Realtime. |

Resolve public source/old-deploy exposure, review the private allocation, apply only reviewed migrations,
run hosted advisors and the above journeys on the final deploy preview, then release.
Do not roll back protected delivery to public question-bank files if a cutover fails.
No production writes, migration applications, grants, emails, or deployments were
performed during this readiness assessment.

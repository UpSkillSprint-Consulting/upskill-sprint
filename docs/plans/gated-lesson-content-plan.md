# Plan: keep premium lesson content out of the public HTML and search index

Status: **proposal for Ernest's review.** No code or Supabase changes come with this plan.
Every Supabase change listed in [§7](#7-supabase-changes-that-need-ernests-approval) needs
Ernest's explicit approval before anyone runs it.

## 1. Problem

Gating today is client-side only:

- `require-auth.js` calls itself a "SOFT gate … not access control. Do not rely on it for
  secrecy."
- `access-control.js` is fail-closed for tiered pages: it checks
  `can_access_content(<data-access-resource>)` over RPC and redirects when the check fails.
  But the protected page has **already been downloaded in full** by then. Anyone can read it
  with view-source, `curl`, a disabled-JavaScript browser, or a crawler.
- `scripts/build-lesson-search-index.mjs` indexes every lesson body into
  `assets/search/lesson-search-index.json`. That file is public (about 2.3 MB), so any gated
  lesson's full text would be in it.
- `sitemap.xml` lists every indexable page.

The same weakness already affects the premium test bank. `test-bank.html` is gated with
`data-required-access="premium"`, but its question banks are public static files. For example,
`https://upskillsprint.com/test-bank-cssgb-set1.js` returned HTTP 200 (about 100 KB) on
2026-10-06.

No lesson is premium yet. The rules in `supabase/*.sql` only add `public` lesson keys. So this
is the right time to choose the pattern, before the first premium lesson ships.

**Goal:** premium lesson bodies are never in the static deploy (`public-site/`), the public
search index, or the sitemap. They reach the browser only after a server-side check of the
visitor's Supabase session and access tier passes.

## 2. Building blocks that already exist

| Piece | Where | Why it matters |
| --- | --- | --- |
| Deny-by-default access check | `public.can_access_content(text)` in `supabase/access-levels.sql`: `security invoker`, granted to `anon` and `authenticated` | A server can call it **with the visitor's own JWT**, so no service-role key is needed. |
| Server-side JWT check | `netlify/functions/material-checker.mjs`: `bearerToken()` → `GET /auth/v1/user` → `POST /rest/v1/rpc/can_access_content` | A working, deployed pattern for "verify the session, then check the tier". It uses only the publishable key. |
| Function rate limits | `config.rateLimit` in `netlify/functions/excel-sprint-*.mjs` | Throttles scraping of a content endpoint. |
| Content folder kept out of the deploy | `content/` is in `scripts/stage-public-site.mjs` `excludedPrefixes` | Protected bodies can live in the repo without being published. |
| Payload-swap loader | `lesson-payload-swap.js` (chi-square and beyond-the-bell lessons) | A precedent for a lesson whose body arrives after a loader page, with the theme kept and no white flash. |
| Resource keys | `content_access_rules.resource_key` such as `lesson:/lessons/<category>/<slug>` | One key per lesson, already validated by `content_access_rules_key_format`. |

## 3. Options

### Option A: Netlify Function serves the lesson body after JWT verification (recommended)

The public page is a **teaser**: title, description, objectives, a short preview, and a
sign-in or upgrade call to action. The premium body lives at
`content/protected-lessons/<category>/<slug>.html`, outside `public-site/`. It is bundled into a
function with `included_files`.

The flow:

1. The teaser loads `/protected-lesson.js`, a new shared script that `site-sections.js` would
   load the same way it loads `access-control.js`.
2. The script reads the access token from `window.UpskillAuth`, the existing Supabase client
   session.
3. It calls `GET /api/lesson-content?resource=lesson:/lessons/<category>/<slug>` with
   `Authorization: Bearer <access_token>`.
4. `netlify/functions/lesson-content.mjs` does the following:
   1. validates `resource` against an allow-list built from `content/protected-lessons/`, so
      there is no path traversal;
   2. calls `/auth/v1/user` and returns 401 if the session is invalid;
   3. calls `can_access_content(resource)` with the visitor's JWT and returns 403 if access is
      denied;
   4. returns the HTML fragment with `Cache-Control: private, no-store`, `Vary: Authorization`
      and `X-Robots-Tag: noindex`.
5. The script inserts the fragment into `<main>` and dispatches
   `upskill-lesson-content-ready`. Lesson scripts initialise on that event: the quiz grader,
   `UpskillMath.typeset([main])`, and progress tracking.

Pros:

- It reuses a pattern already running in production (material checker).
- No service-role key, and no Supabase schema change.
- Content stays in git, so it goes through normal PR review and diffs.
- The deny-by-default RPC is the single source of truth.
- Rate-limited.

Cons:

- One function call per premium page view.
- Lesson JavaScript must start on an event instead of at parse time.
- No offline or cached reading of premium bodies.

### Option B: Netlify Edge Function on the page URL

An edge function on `/lessons/premium/*` would check the session before serving the full page.
That keeps a normal page load, which is the main advantage.

The blocker is that a page navigation carries no Supabase JWT. The site's Supabase client keeps
its session in `localStorage`, not in a cookie. To make this work we would need all of the
following:

- move auth to cookie storage (an `@supabase/ssr`-style cookie session) across `auth.js` and
  every auth page;
- verify the JWT at the edge, either with network calls or by local verification with the
  project's asymmetric JWT signing keys (JWKS);
- refresh tokens at the edge.

The edge function would also have to keep the protected HTML out of `public-site/`, or it could
be fetched directly.

Pros:

- Full page delivered in one request.
- Lesson scripts work unchanged.

Cons:

- A large auth refactor touching every signed-in feature.
- A possible Supabase Auth configuration change (signing keys).
- Edge-runtime limits on bundling content.
- The highest regression risk.

Not recommended now.

### Option C: Supabase Storage private bucket with signed URLs

Premium fragments are uploaded to a private bucket, for example `lesson-content`. A
`storage.objects` RLS policy allows `select` only when
`public.can_access_content('lesson:/' || name)` is true. The browser calls
`storage.from('lesson-content').createSignedUrl(path, 60)` and fetches the fragment.

Pros:

- No Netlify Function.
- Storage serves the bytes.

Cons:

- New Supabase schema objects: a bucket and RLS policies on `storage.objects`.
- A content pipeline outside git. Uploads need either a service-role key in CI, which is a new
  secret and a settings change, or manual uploads, which can drift from the repo.
- A signed URL can be shared until it expires.
- Two places to review each lesson change.

Reasonable only for large binary downloads (PDFs or workbooks), not lesson HTML.

### Option D: public teaser plus protected payload

This is the content model, not a transport. It applies to Options A, B and C, and it is
**required whichever transport is chosen**. The teaser is what search engines and the site
search see. The payload is never in the static build.

## 4. Recommendation

Use **Option D (teaser plus payload) with Option A (Netlify Function + JWT +
`can_access_content`)**:

- It extends a proven pattern in this repo.
- It needs no schema change and no secret.
- Content stays reviewable in PRs.

Keep Option C in reserve for premium downloads. Revisit Option B only if the site moves to
cookie-based auth for other reasons.

Also:

- Apply the same function pattern later to the test-bank question data (phase 2, §6).
- Add `registered` and `special` denial paths to `access-control.js`. Today it only builds
  redirect URLs for `premium` and `administrator`.

## 5. Effect on SEO and search

| Surface | Today | With the recommendation |
| --- | --- | --- |
| Google and other crawlers | Would index the full premium body | Index the teaser only: title, description, objectives and preview. The page stays indexable and canonical. No cloaking: Googlebot gets exactly what an anonymous visitor gets. |
| Structured data | — | Optional `LearningResource` JSON-LD with `isAccessibleForFree: false`. Do **not** add paywalled-content `hasPart` markup, because the protected part is not in the HTML. |
| `sitemap.xml` | Lists the URL | Still lists the teaser URL (unchanged). |
| `assets/search/lesson-search-index.json` | Would contain the full body | Contains the teaser only. The builder skips everything inside `[data-protected-lesson]` and indexes the teaser plus an explicit `data-search-summary`. Results show a "Premium" badge. |
| Social previews | Full page | Teaser Open Graph tags (unchanged). |
| Internal links and the lessons catalog | Normal | Normal, with a tier badge on the card. |
| Ranking | — | Expect less long-tail traffic for premium topics than a fully public lesson would get. Mitigate with a substantial teaser (objectives, a worked preview, an FAQ) and public companion lessons. |

## 6. Migration steps

Each step is a normal branch and PR. None touches `main` directly.

1. **Shared server helper.** Extract `bearerToken`, `authenticatedUser` and a generic
   `canAccess(token, resourceKey)` from `material-checker.mjs` into
   `netlify/functions/_shared/supabase-access.mjs`. Keep the material checker working, with its
   tests passing.
2. **Content function.** Add `netlify/functions/lesson-content.mjs`:
   - path `/api/lesson-content`, `GET` only;
   - rate limit `{ windowLimit: 60, windowSize: 60, aggregateBy: ['ip', 'domain'] }`;
   - allow-listed resource keys;
   - responses 401, 403 and 404 with no body leakage, and 200 with `private, no-store`;
   - `included_files = ["content/protected-lessons/**"]` under `[functions]` in `netlify.toml`.
     This is a repo file change reviewed in the PR, not a Netlify UI setting.

   Add unit tests that mock `fetch` for Supabase, in the style of `tests/excel-sprint-coaching.test.js`.
3. **Client loader.** Add `/protected-lesson.js`:
   - loading state in an `aria-live="polite"` region;
   - a sign-in link with `?next=` on 401;
   - the upgrade notice on 403 (reuse `access-control.js` `showAccessNotice` copy);
   - keep the theme and avoid a flash (reuse ideas from `lesson-payload-swap.js`);
   - dispatch `upskill-lesson-content-ready`.

   `site-sections.js` loads it only on pages with `[data-protected-lesson]`.
4. **Lesson contract.** Document the teaser and payload structure in
   `docs/LESSON_CREATION_GUIDE.md`:
   - the teaser keeps the standard header, footer, head and SEO block, and the access
     attributes;
   - the payload holds the sections, quiz and lesson scripts;
   - lesson scripts initialise on `upskill-lesson-content-ready`.

   Add a template.
5. **Build guards.**
   - `build-lesson-search-index.mjs` indexes only the teaser for `[data-protected-lesson]`
     pages.
   - Add a test that fails if any file under `content/protected-lessons/` appears in
     `public-site/` or `assets/search/lesson-search-index.json`.
   - Add a test that `stage-public-site.mjs` still excludes `content/`.
6. **Pilot.** Convert one new premium lesson end to end on a branch. Verify on the deploy
   preview with test accounts:
   - an anonymous visitor gets the teaser, and a 401 from the API;
   - a registered user gets the teaser and the upgrade notice (403);
   - premium and administrator users get the full lesson;
   - `curl` of the page and of `public-site` contains no payload text;
   - axe shows no new violations;
   - the quiz grades and progress records.

   The access rule row for the pilot needs Ernest's approval (§7).
7. **Roll out.** New premium lessons use the pattern from day one. Convert any lesson that
   later moves from public to premium in its own PR. Its old full text stays in git history,
   and in search-engine caches until they are recrawled.
8. **Phase 2 (test bank).** Move premium question banks behind the same helper. For example,
   `/api/test-bank/questions?set=…` would return JSON after
   `can_access_content('exam:/test-bank')`, and the large `test-bank-*.js` data files would be
   removed from the static deploy. This is a larger change with its own plan and PR.

## 7. Supabase changes that need Ernest's approval

The recommended option needs **no schema change, no new function, no new secret and no service
role key**. It uses the existing `can_access_content` RPC with the visitor's JWT.

The approvals it does need:

| # | Change | Type | When |
| --- | --- | --- | --- |
| 1 | `insert into public.content_access_rules (resource_key, required_access_key, display_name, is_active, updated_at) values ('lesson:/lessons/<category>/<slug>', 'premium', '<Lesson title>', true, now()) on conflict (resource_key) do update set …;` | Data write | Once per premium lesson, starting with the pilot. Ship the SQL in the lesson PR as `supabase/<slug>-access.sql`, like the existing `public-*-access.sql` files. Ernest runs it after review. |
| 2 | Confirm the tier for each gated lesson (`registered`, `premium`, `special` or `administrator`) | Decision | Per lesson. The guide already requires asking before creating content. |
| 3 | Grant real test accounts each tier for the preview check (rows in `user_access_grants`) | Data write | Pilot only. Use existing test accounts if there are any. |

Only if Option C (Storage) is chosen later:

- create a private bucket;
- add `storage.objects` RLS policies that call `can_access_content`;
- add an upload path, which needs a service-role key stored as a CI or Netlify secret. That is
  a **settings change**.

Only if Option B (edge) is chosen later:

- possible Auth changes (asymmetric JWT signing keys / JWKS);
- moving sessions to cookies.

## 8. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| A function outage hides premium content | Fail closed with a clear "temporarily unavailable" notice (as `access-control.js` already does). Content is never leaked as a fallback. |
| Scraping by a paying user | Rate limit; `no-store`; watermarking is out of scope. This is accepted for a learning site. |
| Token theft or replay | Short-lived Supabase access tokens; HTTPS only; no token in URLs. |
| Lesson JavaScript runs before content arrives | The `upskill-lesson-content-ready` event, plus a test that the pilot initialises after injection. |
| Search index regression in CI | `lesson-search-validation` already fails on index diffs. The new guard test catches leaked text. |
| Old public copies | Converting a public lesson to premium cannot remove what was already crawled or committed. Decide per lesson. |

## 9. Open decisions for Ernest

1. Approve Option A plus D as the standard for premium lessons.
2. Pick the pilot lesson and its tier.
3. Approve the content-access-rule SQL for the pilot when its PR is ready. Do not run it before
   then.
4. Decide whether phase 2 (test-bank question data) should be planned next.

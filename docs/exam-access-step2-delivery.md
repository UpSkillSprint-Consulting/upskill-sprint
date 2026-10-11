# Step 2 — per-certification delivery

Implemented in the draft access branch; not activated in production. Steps 3–4 and
the hosted additive schema are now installed/implemented; see
`exam-access-final-qa-20261011.md`. Configure the function, review existing learner
assignments and finish the hosted release checks before cutover.

## Request boundary

`/test-bank`, `/test-bank/` and `/test-bank.html` serve a question-free loading shell.
The shell reads the existing Supabase session and requests:

```
GET /.netlify/functions/exam-content?exam=cssgb
Authorization: Bearer <caller-access-token>
```

The Netlify function sends that token and the project's publishable key to the
caller-scoped `can_access_exam(requested_exam_key)` RPC. Supabase/PostgREST verifies
the JWT; the Step 1 invoker function and RLS decide access from current database
grants. A membership label, editable user metadata, a client flag or an arbitrary
user ID cannot authorize delivery. Only JSON boolean `true` releases a package.
Unknown/coming-soon keys, malformed/duplicate selectors, missing/expired tokens,
denied grants, missing configuration/RPC, network failures and malformed upstream
responses all deny delivery. No service key or elevated database role is used.

Each request checks permission again. `?exam=cssgb&check=1` performs the same check
but returns only `{allowed:true,exam:"cssgb"}`. The client uses that check before a
new attempt/retake and when returning to the tab. Simultaneous checks are coalesced
only while in flight; there is no permission TTL/cache, polling or Realtime.

Sign-out and account switching hide the simulator immediately and navigate to a
new document, discarding the old account's in-memory questions, timers and attempt.
An old in-flight response cannot populate a different account's page. BFCache and
visibility/focus return paths hide content until a fresh check succeeds. Locked,
sign-in and unavailable states provide recovery links. The legacy Premium gate is
removed only from the simulator; unrelated membership-protected tools are unchanged.

Revocation denies subsequent protected requests and starts. It cannot recall
already downloaded material or prevent an authorized learner from saving content.
A continuously visible, already-loaded attempt is not polled for revocation.
All released sets for one authorized certification are delivered together, matching
the Step 1 grant contract; grants do not extend to other certifications.

## Build and storage

1. `stage-public-site.mjs` excludes the original `test-bank.html`, bank/rendering
   scripts, `test-bank-assets`, archived catalogs, server code, SQL and tooling.
   `test-bank-tables.js` remains public because it contains mathematical lookup
   tables also used by the engineering statistics calculator, with no exam keys.
2. `build-exam-delivery.mjs` applies the existing stateless/mobile transform, emits
   the empty shell, then creates one private package per published certification.
   It preserves that exam's original scripts, question IDs, sets and renderers;
   other banks are empty. Unknown script ownership or changed inline-bank
   boundaries fail the build rather than silently widening delivery.
3. Figures and supporting references are embedded once per authorized package.
   Temporary blob URLs support the existing images and full-size links. The
   source-image renderer accepts only URLs registered by this page's loader.
4. Packages live under ignored `content/exam-delivery-generated/`, outside the
   publish directory. The `exam-content` function explicitly bundles this path
   through its scoped `included_files` configuration. It reads only the selected
   package after authorization and retains no global content/permission cache.
5. The public-content scanner now runs as a mandatory build step and CI gate.
   Its passing result covers known static signatures, not hosted end-to-end auth.

Current serialized packages range from about 0.53 MB to 3.36 MB. The build stops
above 5.5 MB per package, leaving room below Netlify's buffered response ceiling;
split a growing certification into authenticated set requests before exceeding it.
Generated packages are not committed, publicly staged or uploaded to Supabase.

Supabase stores only the small Step 1 permission data. Opening a certification
uses one permission read; starting/resuming uses small reads. No exam sessions,
question banks, answers, telemetry, new jobs or progress/history persistence are
introduced. No new production database writes were performed for Step 2.

## Configuration and release blockers

Set these Netlify environment variables with **Functions** scope, then redeploy:

- `SUPABASE_URL`: the same HTTPS project URL as `supabase-config.js`.
- `SUPABASE_PUBLISHABLE_KEY`: that project's public publishable key. The existing
  legacy `SUPABASE_ANON_KEY` is accepted as an alternative, only with role `anon`.

Never set a secret/service-role key for this endpoint. Missing or invalid settings
return 503. All function responses set browser/CDN `no-store`, including errors;
the shell's edge response also explicitly sets `no-store`. Tokens are sent only
in the Authorization header, never in query strings, logs or package content.
The auth library's existing session storage is unchanged; the loader adds no storage.

**The repository is public.** An unauthenticated GitHub repository metadata request
on 2026-10-11 reported `private:false`, `visibility:public`. Original question files
and history remain downloadable from GitHub. Website authorization does not make
those copies private. Before claiming question confidentiality, make the repository
private or move question authoring/build inputs into private storage and resolve
public history/copies. Repository visibility was not changed in this task.

Older Netlify deploy URLs and previously cached/copied banks must also be reviewed.
A new atomic deploy cannot revoke content in old deployment artifacts or downloads.
Do not roll back to the previous publicly staged bank delivery if cutover fails.

Apply only the reviewed access migration, seed verified user/exam commitments via
the audited administrative path, and finish the admin/learner UI before production
activation. No global Premium-to-all-exams grants should be inferred.

## Validation

Run the focused workflow in `.github/workflows/exam-access-foundation.yml` and
`npm run build:site`. The local suite covers real PGlite permissions/RLS plus
mocked upstream authorization failures, cross-exam requests, fresh checks after
revocation, no-store headers, wrong method/selector/path inputs, all seven isolated
packages, protected figures, Full/Quick/Focused/Diagnostic scoring, untimed reveals,
loader account races, sign-out, retry messages and return-to-tab checks. Browser
logic uses JSDOM; hosted JWT verification, actual navigation/CDN behaviour and
mobile/light/dark screenshots still require a configured deploy preview.

The learner browser CI now serves the actual public build and real Netlify handler
through `EXAM_DELIVERY_PREVIEW=1` in the isolated review server. Only the upstream
permission response and auth session are fixtures. Other historical source-only
audits retain their legacy authoring gate; the production shell explicitly strips
that gate, and the delivery tests assert it is absent. The browser audit checks
the new sign-in/coming-soon flow and that delivered banks match the selected exam.

The initial Step 2 result is 70 passing focused tests and a successful full build
with zero known static-content findings. An additional 59 compatibility checks
pass for the shared calculator lookup tables, answer reveal across all exams/sets,
and CQE source visuals through quiz, review and retry.
The navigation/access regression suite also passes all 19 checks. Loopback HTTP
checks of the real handler/package loader pass for anonymous 401, denied 403,
allowed package/check responses and absent raw/private file paths (with mocked RPC).
A local Netlify packaging-tool installation
was attempted but its dependency downloads returned HTTP 403; archive-level
packaging and deployed file availability remain hosted release checks. No extra
dependency or lockfile change was introduced by that temporary tooling attempt.

The Netlify deploy preview subsequently built successfully. Anonymous HTTP checks
confirmed that all three simulator URL forms serve only the no-store shell, the
content endpoint returns 401, sampled old bank scripts and the protected CQE image
return 404, and the calculator's shared tables still return 200. Positive hosted
delivery with a real granted test account remains outstanding because the access
schema and assignments have not been activated.

References: [Supabase Data API security](https://supabase.com/docs/guides/api/securing-your-api),
[Netlify function configuration](https://docs.netlify.com/build/functions/configuration/),
and [Netlify edge functions](https://docs.netlify.com/build/edge-functions/overview/).

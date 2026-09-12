# Owner account access screen

Open `/admin-access.html` and sign in as the bound owner. Search using the exact
email, review the account, choose Registered/Premium/Special/Administrator and an
optional local expiry date, then confirm Save. Ten recent changes are shown.

The owner binding is independent of content tiers. This release does not upgrade
the owner's content tier or any other existing user's tier. Ownership survives
email changes because the binding uses the verified account UUID.

Apply `supabase/owner-access-admin.sql` after `access-levels.sql`. Keep
`access_private` OUT of the Data API exposed schemas. Its tables have RLS enabled
and no client table privileges. The public invoker RPC calls a private definer
implementation, which needs elevated rights to look up Auth emails and update
server-managed grants. Every operation checks the caller against the private
owner binding; even administrators cannot use it. No service key ships to clients.

The owner cannot edit owner grants here. Ownership changes require a trusted
database operator. Saves serialize per account, compare the previously read grant,
and append history in the same transaction. Expiry falls back to Registered.

Load: one owner-status request per auth event on this page, one exact-email query
per Search, one transactional RPC per Save; no periodic refresh, Realtime or full
account list. Other site pages do not load this controller.

Verification: `node --test tests/owner-admin.test.js`. The transactional SQL tests
in `supabase/tests/owner-access-admin.sql` use an isolated fixture and roll back all
test changes. They verify owner search/save, audit, invalid tier, stale edits,
self-lockout protection, non-owner denial and anonymous denial.

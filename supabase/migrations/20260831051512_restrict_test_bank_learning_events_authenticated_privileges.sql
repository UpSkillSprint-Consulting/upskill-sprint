-- The original ledger migration granted SELECT and INSERT but did not first
-- remove Supabase's legacy default grants from `authenticated`. Row-level
-- security protects ordinary row mutations, but table privileges such as
-- TRUNCATE are not row-scoped. Reset the ACL explicitly, then expose only the
-- two operations required by the immutable event ledger.

revoke all on table public.test_bank_learning_events from public, anon, authenticated;
grant select, insert on table public.test_bank_learning_events to authenticated;

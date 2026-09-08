-- Segment 01 metadata capture. READ ONLY; no learner rows, role switching or DDL.
-- Run against the explicitly authorized project and retain the as-of timestamp.
SELECT jsonb_build_object(
  'captured_at', current_timestamp,
  'postgres_version', current_setting('server_version'),
  'tables', (SELECT jsonb_agg(to_jsonb(x)) FROM (
    SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled,
           c.relforcerowsecurity AS force_rls
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relname LIKE 'test_bank%'
    ORDER BY 1
  ) x),
  'columns', (SELECT jsonb_agg(to_jsonb(x)) FROM (
    SELECT table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name LIKE 'test_bank%'
    ORDER BY table_name, ordinal_position
  ) x),
  'policies', (SELECT jsonb_agg(to_jsonb(x)) FROM (
    SELECT tablename, policyname, roles, cmd, qual, with_check
    FROM pg_policies WHERE schemaname = 'public' AND tablename LIKE 'test_bank%'
    ORDER BY tablename, policyname
  ) x),
  'constraints', (SELECT jsonb_agg(to_jsonb(x)) FROM (
    SELECT conrelid::regclass::text AS table_name, conname,
           pg_get_constraintdef(oid) AS definition
    FROM pg_constraint WHERE connamespace = 'public'::regnamespace
      AND conrelid::regclass::text LIKE '%test_bank%'
    ORDER BY 1, 2
  ) x),
  'indexes', (SELECT jsonb_agg(to_jsonb(x)) FROM (
    SELECT tablename, indexname, indexdef FROM pg_indexes
    WHERE schemaname = 'public' AND tablename LIKE 'test_bank%' ORDER BY 1, 2
  ) x),
  'client_grants', (SELECT jsonb_agg(to_jsonb(x)) FROM (
    SELECT table_name, grantee, privilege_type FROM information_schema.role_table_grants
    WHERE table_schema = 'public' AND table_name LIKE 'test_bank%'
      AND grantee IN ('anon', 'authenticated') ORDER BY 1, 2, 3
  ) x),
  'reservation_functions', (SELECT jsonb_agg(to_jsonb(x)) FROM (
    SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS arguments,
           p.prosecdef AS security_definer, p.proconfig,
           md5(pg_get_functiondef(p.oid)) AS definition_md5
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname LIKE '%test_bank%'
    ORDER BY p.proname
  ) x)
) AS baseline;

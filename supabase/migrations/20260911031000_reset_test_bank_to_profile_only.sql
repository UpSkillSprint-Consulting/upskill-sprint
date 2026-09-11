-- Reset the exam simulator to a stateless browser-only experience.
-- Supabase remains responsible for authentication and public.profiles only.
-- This migration intentionally removes all exam/lesson progress persistence.

DO $$
DECLARE r record;
BEGIN
  -- Revoke learner-facing access first so live clients stop taking new locks.
  FOR r IN
    SELECT n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND (c.relname LIKE 'test_bank_%' OR c.relname = 'lesson_progress')
      AND c.relkind IN ('r','p','v','m','S')
  LOOP
    BEGIN
      EXECUTE format('REVOKE ALL PRIVILEGES ON %I.%I FROM anon, authenticated', r.nspname, r.relname);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;

  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND p.proname ILIKE '%test_bank%'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %I.%I(%s) FROM PUBLIC, anon, authenticated', r.nspname, r.proname, r.args);
  END LOOP;

  -- Tables own their indexes and sequences, so remove tables first.
  FOR r IN
    SELECT n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND (c.relname LIKE 'test_bank_%' OR c.relname = 'lesson_progress')
      AND c.relkind IN ('r','p')
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE', r.nspname, r.relname);
  END LOOP;

  -- Remove any old standalone views/materialized views/sequences left behind.
  FOR r IN
    SELECT c.relkind, n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND (c.relname LIKE 'test_bank_%' OR c.relname = 'lesson_progress')
      AND c.relkind IN ('v','m','S')
  LOOP
    IF r.relkind = 'v' THEN
      EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', r.nspname, r.relname);
    ELSIF r.relkind = 'm' THEN
      EXECUTE format('DROP MATERIALIZED VIEW IF EXISTS %I.%I CASCADE', r.nspname, r.relname);
    ELSE
      EXECUTE format('DROP SEQUENCE IF EXISTS %I.%I CASCADE', r.nspname, r.relname);
    END IF;
  END LOOP;

  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND p.proname ILIKE '%test_bank%'
  LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- DISPOSABLE CI ONLY. Models auth.uid() input, not JWT verification or the Data API.
-- The runner refuses non-loopback hosts and any database not named segment03_test.
DO $$ BEGIN
  IF current_database() <> 'segment03_test' THEN RAISE EXCEPTION 'Wrong test database'; END IF;
  IF EXISTS(SELECT 1 FROM pg_namespace WHERE nspname='auth') THEN RAISE EXCEPTION 'Database is not empty'; END IF;
END $$;
CREATE ROLE anon NOLOGIN NOSUPERUSER NOBYPASSRLS;
CREATE ROLE authenticated NOLOGIN NOSUPERUSER NOBYPASSRLS;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true),'')::uuid
$$;
GRANT USAGE ON SCHEMA auth, public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
INSERT INTO auth.users(id) VALUES('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');

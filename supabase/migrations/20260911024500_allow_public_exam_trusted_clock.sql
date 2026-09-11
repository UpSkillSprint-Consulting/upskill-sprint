-- Hotfix: public practice needs the same authoritative read-only clock as signed-in practice.
-- This function exposes only database time. It does not read or write learner data.

CREATE OR REPLACE FUNCTION public.get_test_bank_server_time_v1(p_reason text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
VOLATILE
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  uid uuid := auth.uid();
  server_now timestamptz;
BEGIN
  -- p_reason is diagnostic context only and is intentionally not persisted.
  IF p_reason IS NOT NULL AND length(p_reason) > 64 THEN
    RAISE EXCEPTION 'reason too long' USING ERRCODE = '22023';
  END IF;

  server_now := clock_timestamp();
  RETURN jsonb_build_object(
    'protocolVersion', 1,
    'serverTime', server_now,
    'userId', uid
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_test_bank_server_time_v1(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_test_bank_server_time_v1(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_test_bank_server_time_v1(text) TO authenticated;

COMMENT ON FUNCTION public.get_test_bank_server_time_v1(text) IS
  'Read-only trusted-clock endpoint for timed exam practice. Available to anon and authenticated roles; userId is null for anonymous callers. No learner data or deadline is mutated.';

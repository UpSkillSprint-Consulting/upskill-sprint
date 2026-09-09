-- Segment 13: authenticated database clock for timed-session calibration.
-- Read-only, no learner rows are changed.

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
  IF uid IS NULL THEN
    RAISE EXCEPTION 'authentication required' USING ERRCODE = '28000';
  END IF;
  -- p_reason is intentionally not persisted; it is diagnostic context only.
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
REVOKE ALL ON FUNCTION public.get_test_bank_server_time_v1(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_test_bank_server_time_v1(text) TO authenticated;

COMMENT ON FUNCTION public.get_test_bank_server_time_v1(text) IS
  'Segment 13 read-only trusted-clock endpoint for authenticated exam timing calibration. No timing deadline is mutated.';

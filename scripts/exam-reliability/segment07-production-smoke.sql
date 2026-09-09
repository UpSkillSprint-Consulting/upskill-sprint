-- Segment 07 production smoke test.
--
-- Run after the Segment 05 catalog/seed and Segment 07 ingestion migrations.
-- Every fixture write is enclosed in this transaction and rolled back. The
-- checks execute the public RPC as the same `authenticated` database role used
-- by the Data API; no learner row or receipt is retained.
\set ON_ERROR_STOP on

BEGIN;

INSERT INTO auth.users(id)
VALUES
  ('7a070000-0000-4000-8000-000000000001'),
  ('7a070000-0000-4000-8000-000000000002');

SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '7a070000-0000-4000-8000-000000000001';

DO $smoke$
DECLARE
  owner_a constant uuid := '7a070000-0000-4000-8000-000000000001';
  owner_b constant uuid := '7a070000-0000-4000-8000-000000000002';
  session_key constant text := 'segment07-production-smoke-session';
  operation_key constant text := 'segment07-production-smoke-start';
  release_row record;
  question_row record;
  option_order jsonb;
  version_pin jsonb;
  start_payload jsonb;
  operation jsonb;
  response_one jsonb;
  response_two jsonb;
  row_count bigint;
BEGIN
  SELECT r.exam_id, r.config_version, r.bank_version, c.blueprint_version,
         c.configuration
    INTO STRICT release_row
    FROM public.test_bank_catalog_releases r
    JOIN public.test_bank_catalog_configs c
      ON c.exam_id = r.exam_id AND c.config_version = r.config_version
   WHERE r.exam_id = 'cmq'
   ORDER BY r.published_at DESC
   LIMIT 1;

  SELECT i.question_id, i.revision_id, q.content
    INTO STRICT question_row
    FROM public.test_bank_catalog_bank_items i
    JOIN public.test_bank_question_revisions q
      ON q.exam_id = i.exam_id
     AND q.question_id = i.question_id
     AND q.revision_id = i.revision_id
   WHERE i.exam_id = release_row.exam_id
     AND i.bank_version = release_row.bank_version
   ORDER BY i.question_id
   LIMIT 1;

  SELECT jsonb_agg(to_jsonb('o' || n) ORDER BY n)
    INTO option_order
    FROM generate_series(0, jsonb_array_length(question_row.content->'options') - 1) n;

  version_pin := jsonb_build_object(
    'codec', 1,
    'contractVersion', '1.0.0',
    'examId', release_row.exam_id,
    'sessionId', session_key,
    'configVersion', release_row.config_version,
    'blueprintVersion', release_row.blueprint_version,
    'bankVersion', release_row.bank_version,
    'siteTargetBps', release_row.configuration->'siteTargetBps',
    'gradingPolicyVersion', release_row.configuration->>'gradingPolicyVersion',
    'timingPolicyVersion', release_row.configuration->>'timingPolicyVersion',
    'masteryPolicyVersion', release_row.configuration->>'masteryPolicyVersion',
    'mode', 'quick',
    'setId', 'mix',
    'startedAt', '2026-09-08T22:00:00.000Z',
    'timed', false,
    'deadlineAt', null,
    'limitSeconds', null,
    'expectedLength', 1,
    'items', jsonb_build_array(jsonb_build_array(
      question_row.question_id,
      question_row.revision_id,
      option_order
    ))
  );

  start_payload := jsonb_build_object(
    'mode', 'quick',
    'timed', false,
    'total', 1,
    'versionPin', version_pin
  );
  operation := jsonb_build_object(
    'schemaVersion', '1.0.0',
    'operationId', operation_key,
    'ownerId', owner_a,
    'deviceId', 'segment07-production-smoke-device',
    'examId', release_row.exam_id,
    'sessionId', session_key,
    'writerEpoch', 0,
    'expectedSessionRevision', 0,
    'resetEpochId', null,
    'type', 'session_started',
    'clientOccurredAt', '2026-09-08T22:00:00.000Z',
    'clientSequence', 0,
    'payload', jsonb_build_object(
      'questionId', null,
      'eventPayload', start_payload
    )
  );

  response_one := public.ingest_test_bank_operations_v1(jsonb_build_array(operation));
  response_two := public.ingest_test_bank_operations_v1(jsonb_build_array(operation));

  IF jsonb_array_length(response_one) <> 1
     OR response_one->0->>'applied' <> 'true'
     OR (response_one->0->>'sessionRevision')::bigint <> 1 THEN
    RAISE EXCEPTION 'first ingestion did not return the expected receipt';
  END IF;
  IF response_two IS DISTINCT FROM response_one THEN
    RAISE EXCEPTION 'identical replay did not return the stored receipt';
  END IF;

  SELECT count(*) INTO row_count
    FROM public.test_bank_learning_events
   WHERE user_id = owner_a AND session_id = session_key;
  IF row_count <> 1 THEN
    RAISE EXCEPTION 'replay changed canonical event count: %', row_count;
  END IF;

  SELECT count(*) INTO row_count
    FROM public.test_bank_operation_receipts
   WHERE user_id = owner_a AND session_id = session_key;
  IF row_count <> 1 THEN
    RAISE EXCEPTION 'replay changed receipt count: %', row_count;
  END IF;

  BEGIN
    PERFORM public.ingest_test_bank_operations_v1(jsonb_build_array(
      jsonb_set(operation, '{payload,eventPayload,total}', '2'::jsonb)
    ));
    RAISE EXCEPTION 'conflicting operation ID was accepted';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  BEGIN
    PERFORM public.ingest_test_bank_operations_v1(jsonb_build_array(
      jsonb_set(operation, '{ownerId}', to_jsonb(owner_b))
    ));
    RAISE EXCEPTION 'foreign owner operation was accepted';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;

  BEGIN
    PERFORM public.ingest_test_bank_operations_v1(jsonb_build_array(
      jsonb_set(operation, '{schemaVersion}', '"2.0.0"'::jsonb)
    ));
    RAISE EXCEPTION 'unsupported schema was accepted';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;

  PERFORM set_config('request.jwt.claim.sub', owner_b::text, true);
  SELECT count(*) INTO row_count
    FROM public.test_bank_operation_receipts
   WHERE session_id = session_key;
  IF row_count <> 0 THEN
    RAISE EXCEPTION 'receipt RLS exposed another owner';
  END IF;
  SELECT count(*) INTO row_count
    FROM public.test_bank_session_runtime
   WHERE session_id = session_key;
  IF row_count <> 0 THEN
    RAISE EXCEPTION 'runtime RLS exposed another owner';
  END IF;

  PERFORM set_config('request.jwt.claim.sub', owner_a::text, true);
  BEGIN
    INSERT INTO public.test_bank_operation_receipts(
      user_id, operation_id, payload_digest, exam_id, session_id,
      operation_type, session_revision, response
    ) VALUES (
      owner_a, 'segment07-forged-receipt', repeat('f', 64),
      release_row.exam_id, session_key, 'session_started', 0, '{}'::jsonb
    );
    RAISE EXCEPTION 'browser role forged a receipt';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
END
$smoke$;

ROLLBACK;

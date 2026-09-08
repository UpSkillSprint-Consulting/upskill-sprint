-- Segment 07: authoritative, idempotent ingestion for versioned exam sessions.
-- The legacy unversioned ledger remains append-only for compatibility, but all
-- catalog-v1 clients use the receipt-bearing RPC below.
BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC,anon,authenticated;

CREATE TABLE public.test_bank_session_runtime (
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  exam_id text NOT NULL,
  state text NOT NULL CHECK (state IN ('in_progress','paused','completed','expired','abandoned')),
  session_revision bigint NOT NULL DEFAULT 0 CHECK (session_revision >= 0),
  writer_epoch bigint NOT NULL DEFAULT 0 CHECK (writer_epoch >= 0),
  reset_epoch_id text,
  terminal_payload_digest text CHECK (terminal_payload_digest IS NULL OR terminal_payload_digest ~ '^[0-9a-f]{64}$'),
  terminal_event_id text,
  terminal_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id,session_id),
  FOREIGN KEY (user_id,session_id) REFERENCES public.test_bank_session_versions ON DELETE CASCADE,
  CHECK ((state IN ('completed','expired','abandoned')) = (terminal_at IS NOT NULL)),
  CHECK ((state IN ('completed','expired','abandoned')) = (terminal_event_id IS NOT NULL)),
  CHECK ((state IN ('completed','expired')) = (terminal_payload_digest IS NOT NULL))
);

CREATE TABLE public.test_bank_operation_receipts (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_id text NOT NULL CHECK (length(operation_id) BETWEEN 8 AND 180),
  payload_digest text NOT NULL CHECK (payload_digest ~ '^[0-9a-f]{64}$'),
  exam_id text NOT NULL,
  session_id text NOT NULL,
  operation_type text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz NOT NULL DEFAULT now(),
  server_sequence bigint GENERATED ALWAYS AS IDENTITY,
  session_revision bigint NOT NULL CHECK (session_revision >= 0),
  response jsonb NOT NULL CHECK (jsonb_typeof(response)='object'),
  PRIMARY KEY (user_id,operation_id),
  UNIQUE (server_sequence),
  FOREIGN KEY (user_id,session_id) REFERENCES public.test_bank_session_versions ON DELETE CASCADE
);

ALTER TABLE public.test_bank_session_runtime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_bank_operation_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.test_bank_session_runtime,public.test_bank_operation_receipts FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.test_bank_session_runtime,public.test_bank_operation_receipts TO authenticated;
CREATE POLICY owner_read ON public.test_bank_session_runtime FOR SELECT TO authenticated USING (user_id=(select auth.uid()));
CREATE POLICY owner_read ON public.test_bank_operation_receipts FOR SELECT TO authenticated USING (user_id=(select auth.uid()));

-- Adopt already accepted versioned evidence without rewriting it. This is a
-- deterministic compatibility projection; only new RPC operations get v1 receipts.
INSERT INTO public.test_bank_session_runtime(user_id,session_id,exam_id,state,session_revision,writer_epoch,terminal_payload_digest,terminal_event_id,terminal_at)
SELECT s.user_id,s.session_id,s.exam_id,
  CASE WHEN completed.event_id IS NOT NULL THEN 'completed' WHEN abandoned.event_id IS NOT NULL THEN 'abandoned' ELSE 'in_progress' END,
  count(e.event_id),0,
  CASE WHEN completed.event_id IS NULL THEN NULL ELSE encode(sha256(convert_to((completed.payload)::text,'UTF8')),'hex') END,
  coalesce(completed.event_id,abandoned.event_id),
  coalesce(completed.occurred_at,abandoned.occurred_at)
FROM public.test_bank_session_versions s
LEFT JOIN public.test_bank_learning_events e ON e.user_id=s.user_id AND e.session_id=s.session_id
LEFT JOIN LATERAL (
  SELECT x.event_id,x.payload,x.occurred_at FROM public.test_bank_learning_events x
  WHERE x.user_id=s.user_id AND x.session_id=s.session_id AND x.event_type='session_completed'
  ORDER BY x.received_at,x.event_id LIMIT 1
) completed ON true
LEFT JOIN LATERAL (
  SELECT x.event_id,x.occurred_at FROM public.test_bank_learning_events x
  WHERE x.user_id=s.user_id AND x.session_id=s.session_id AND x.event_type='session_abandoned'
  ORDER BY x.received_at,x.event_id LIMIT 1
) abandoned ON completed.event_id IS NULL
GROUP BY s.user_id,s.session_id,s.exam_id,completed.event_id,completed.payload,completed.occurred_at,abandoned.event_id,abandoned.occurred_at
ON CONFLICT DO NOTHING;

CREATE FUNCTION public.test_bank_guard_versioned_event() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE prior public.test_bank_learning_events; runtime public.test_bank_session_runtime; is_versioned boolean; BEGIN
  -- Do not let this privileged trigger reveal whether another owner's
  -- operation/session exists before the table's RLS policy rejects the row.
  IF auth.uid() IS NOT NULL AND auth.uid()<>NEW.user_id THEN RETURN NEW; END IF;
  SELECT * INTO prior FROM public.test_bank_learning_events WHERE user_id=NEW.user_id AND event_id=NEW.event_id;
  IF prior.event_id IS NOT NULL THEN
    IF prior.device_id IS DISTINCT FROM NEW.device_id OR prior.event_type IS DISTINCT FROM NEW.event_type OR
       prior.exam_id IS DISTINCT FROM NEW.exam_id OR prior.session_id IS DISTINCT FROM NEW.session_id OR
       prior.question_id IS DISTINCT FROM NEW.question_id OR prior.occurred_at IS DISTINCT FROM NEW.occurred_at OR
       prior.payload IS DISTINCT FROM NEW.payload THEN
      RAISE EXCEPTION 'Operation ID reused with conflicting content' USING ERRCODE='23505';
    END IF;
    RETURN NEW;
  END IF;
  is_versioned := (NEW.event_type='session_started' AND NEW.payload->'versionPin' IS NOT NULL AND NEW.payload->'versionPin'<>'null'::jsonb)
    OR EXISTS(SELECT 1 FROM public.test_bank_session_versions WHERE user_id=NEW.user_id AND session_id=NEW.session_id);
  IF NOT is_versioned THEN RETURN NEW; END IF;
  -- The existing catalog trigger validates the complete start payload first.
  -- Its later runtime insert is the atomic uniqueness boundary for a second
  -- valid start operation on the same session.
  IF NEW.event_type='session_started' THEN RETURN NEW; END IF;
  SELECT * INTO STRICT runtime FROM public.test_bank_session_runtime WHERE user_id=NEW.user_id AND session_id=NEW.session_id FOR UPDATE;
  IF runtime.exam_id IS DISTINCT FROM NEW.exam_id THEN RAISE EXCEPTION 'Event belongs to another exam' USING ERRCODE='23514'; END IF;
  IF runtime.state IN ('completed','expired','abandoned') THEN RAISE EXCEPTION 'Terminal session cannot accept another event' USING ERRCODE='23514'; END IF;
  IF NEW.event_type IN ('question_exposed','answer_recorded') AND runtime.state<>'in_progress' THEN RAISE EXCEPTION 'Event is not permitted in the current session state' USING ERRCODE='23514'; END IF;
  IF NEW.event_type='session_completed' AND runtime.state NOT IN ('in_progress','paused') THEN RAISE EXCEPTION 'Completion is not permitted in the current session state' USING ERRCODE='23514'; END IF;
  IF NEW.event_type='session_abandoned' AND runtime.state NOT IN ('in_progress','paused') THEN RAISE EXCEPTION 'Abandonment is not permitted in the current session state' USING ERRCODE='23514'; END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.test_bank_guard_versioned_event() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER aa_guard_versioned_event BEFORE INSERT ON public.test_bank_learning_events FOR EACH ROW EXECUTE FUNCTION public.test_bank_guard_versioned_event();

CREATE FUNCTION public.test_bank_advance_versioned_session() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE digest text; BEGIN
  IF NEW.event_type='session_started' AND NEW.payload->'versionPin' IS NOT NULL AND NEW.payload->'versionPin'<>'null'::jsonb THEN
    INSERT INTO public.test_bank_session_runtime(user_id,session_id,exam_id,state,session_revision)
    VALUES(NEW.user_id,NEW.session_id,NEW.exam_id,'in_progress',1);
  ELSIF EXISTS(SELECT 1 FROM public.test_bank_session_runtime WHERE user_id=NEW.user_id AND session_id=NEW.session_id) THEN
    IF NEW.event_type='session_completed' THEN
      digest:=encode(sha256(convert_to(NEW.payload::text,'UTF8')),'hex');
      UPDATE public.test_bank_session_runtime SET state='completed',session_revision=session_revision+1,
        terminal_payload_digest=digest,terminal_event_id=NEW.event_id,terminal_at=now(),updated_at=now()
      WHERE user_id=NEW.user_id AND session_id=NEW.session_id;
    ELSIF NEW.event_type='session_abandoned' THEN
      UPDATE public.test_bank_session_runtime SET state='abandoned',session_revision=session_revision+1,
        terminal_event_id=NEW.event_id,terminal_at=now(),updated_at=now()
      WHERE user_id=NEW.user_id AND session_id=NEW.session_id;
    ELSE
      UPDATE public.test_bank_session_runtime SET session_revision=session_revision+1,updated_at=now()
      WHERE user_id=NEW.user_id AND session_id=NEW.session_id;
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.test_bank_advance_versioned_session() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER zz_advance_versioned_session AFTER INSERT ON public.test_bank_learning_events FOR EACH ROW EXECUTE FUNCTION public.test_bank_advance_versioned_session();

CREATE FUNCTION private.test_bank_ingest_operation_v1(p jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE uid uuid:=auth.uid(); existing public.test_bank_operation_receipts; runtime public.test_bank_session_runtime;
  op_id text; owner uuid; exam text; session text; device text; logical_type text; legacy_type text; qid text;
  expected_revision bigint; supplied_epoch bigint; digest text; terminal_digest text; received timestamptz:=clock_timestamp();
  event_payload jsonb; receipt_body jsonb; resulting_revision bigint; BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF jsonb_typeof(p) IS DISTINCT FROM 'object' OR p->>'schemaVersion' IS DISTINCT FROM '1.0.0' OR
     NOT(p ?& ARRAY['schemaVersion','operationId','ownerId','deviceId','examId','sessionId','writerEpoch','expectedSessionRevision','resetEpochId','type','clientOccurredAt','clientSequence','payload']) OR
     (p-ARRAY['schemaVersion','operationId','ownerId','deviceId','examId','sessionId','writerEpoch','expectedSessionRevision','resetEpochId','type','clientOccurredAt','clientSequence','payload'])<>'{}'::jsonb THEN
    RAISE EXCEPTION 'Unsupported operation envelope' USING ERRCODE='23514';
  END IF;
  BEGIN owner:=(p->>'ownerId')::uuid; expected_revision:=(p->>'expectedSessionRevision')::bigint; supplied_epoch:=(p->>'writerEpoch')::bigint;
    PERFORM (p->>'clientOccurredAt')::timestamptz; EXCEPTION WHEN OTHERS THEN RAISE EXCEPTION 'Malformed operation scalar' USING ERRCODE='23514'; END;
  op_id:=p->>'operationId';exam:=p->>'examId';session:=p->>'sessionId';device:=p->>'deviceId';logical_type:=p->>'type';event_payload:=p->'payload'->'eventPayload';qid:=p->'payload'->>'questionId';
  IF owner<>uid OR p->>'ownerId' IS NULL THEN RAISE EXCEPTION 'Owner authorization required' USING ERRCODE='42501'; END IF;
  IF op_id !~ '^[A-Za-z0-9:_-]{8,180}$' OR device !~ '^[A-Za-z0-9:_-]{8,180}$' OR session !~ '^[A-Za-z0-9:_-]{3,180}$' OR
     exam NOT IN ('cssbb','cqe','cssgb','cmq','mbb') OR expected_revision<0 OR supplied_epoch<0 OR
     jsonb_typeof(p->'clientSequence') IS DISTINCT FROM 'number' OR (p->>'clientSequence')::numeric<>trunc((p->>'clientSequence')::numeric) OR (p->>'clientSequence')::bigint<0 OR
     p->'resetEpochId' IS DISTINCT FROM 'null'::jsonb OR jsonb_typeof(p->'payload') IS DISTINCT FROM 'object' OR
     NOT(p->'payload' ?& ARRAY['questionId','eventPayload']) OR (p->'payload'-ARRAY['questionId','eventPayload'])<>'{}'::jsonb OR jsonb_typeof(event_payload) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Malformed operation fields' USING ERRCODE='23514';
  END IF;
  legacy_type:=CASE logical_type WHEN 'session_started' THEN 'session_started' WHEN 'question_displayed' THEN 'question_exposed' WHEN 'response_committed' THEN 'answer_recorded' WHEN 'finalization_requested' THEN 'session_completed' WHEN 'session_abandoned' THEN 'session_abandoned' ELSE NULL END;
  IF legacy_type IS NULL THEN RAISE EXCEPTION 'Unsupported operation type' USING ERRCODE='23514'; END IF;
  IF (legacy_type IN ('question_exposed','answer_recorded')) IS DISTINCT FROM (qid IS NOT NULL) OR (qid IS NOT NULL AND qid !~ '^[A-Za-z0-9:_-]{3,180}$') THEN RAISE EXCEPTION 'Invalid operation question identity' USING ERRCODE='23514'; END IF;
  digest:=encode(sha256(convert_to(p::text,'UTF8')),'hex');
  SELECT * INTO existing FROM public.test_bank_operation_receipts WHERE user_id=uid AND operation_id=op_id;
  IF existing.operation_id IS NOT NULL THEN
    IF existing.payload_digest<>digest THEN RAISE EXCEPTION 'Operation ID reused with conflicting payload' USING ERRCODE='23505'; END IF;
    RETURN existing.response;
  END IF;
  IF logical_type='session_started' THEN
    IF expected_revision<>0 OR supplied_epoch<>0 THEN RAISE EXCEPTION 'New session must start at revision and writer epoch zero' USING ERRCODE='40001'; END IF;
  ELSE
    SELECT * INTO STRICT runtime FROM public.test_bank_session_runtime WHERE user_id=uid AND session_id=session FOR UPDATE;
    IF runtime.exam_id<>exam OR runtime.writer_epoch<>supplied_epoch THEN RAISE EXCEPTION 'Stale or foreign session writer' USING ERRCODE='40001'; END IF;
    terminal_digest:=encode(sha256(convert_to(event_payload::text,'UTF8')),'hex');
    IF logical_type='finalization_requested' AND runtime.state IN ('completed','expired') THEN
      IF runtime.terminal_payload_digest<>terminal_digest THEN RAISE EXCEPTION 'Session already has a conflicting canonical completion' USING ERRCODE='23505'; END IF;
      resulting_revision:=runtime.session_revision;
      receipt_body:=jsonb_build_object('operationId',op_id,'payloadDigest',digest,'receivedAt',received,'acceptedAt',received,'serverSequence',NULL,'sessionRevision',resulting_revision,'applied',false,'canonicalEventId',runtime.terminal_event_id,'state',runtime.state);
      INSERT INTO public.test_bank_operation_receipts(user_id,operation_id,payload_digest,exam_id,session_id,operation_type,received_at,accepted_at,session_revision,response)
      VALUES(uid,op_id,digest,exam,session,logical_type,received,received,resulting_revision,receipt_body) RETURNING server_sequence INTO resulting_revision;
      receipt_body:=jsonb_set(receipt_body,'{serverSequence}',to_jsonb(resulting_revision));
      UPDATE public.test_bank_operation_receipts SET response=receipt_body WHERE user_id=uid AND operation_id=op_id;
      RETURN receipt_body;
    END IF;
    IF runtime.session_revision<>expected_revision THEN RAISE EXCEPTION 'Stale session revision' USING ERRCODE='40001'; END IF;
  END IF;
  INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload)
  VALUES(uid,op_id,device,legacy_type,exam,session,qid,(p->>'clientOccurredAt')::timestamptz,event_payload);
  SELECT session_revision INTO STRICT resulting_revision FROM public.test_bank_session_runtime WHERE user_id=uid AND session_id=session;
  receipt_body:=jsonb_build_object('operationId',op_id,'payloadDigest',digest,'receivedAt',received,'acceptedAt',clock_timestamp(),'serverSequence',NULL,'sessionRevision',resulting_revision,'applied',true,'canonicalEventId',op_id,'state',(SELECT state FROM public.test_bank_session_runtime WHERE user_id=uid AND session_id=session));
  INSERT INTO public.test_bank_operation_receipts(user_id,operation_id,payload_digest,exam_id,session_id,operation_type,received_at,accepted_at,session_revision,response)
  VALUES(uid,op_id,digest,exam,session,logical_type,received,clock_timestamp(),resulting_revision,receipt_body) RETURNING server_sequence INTO supplied_epoch;
  receipt_body:=jsonb_set(receipt_body,'{serverSequence}',to_jsonb(supplied_epoch));
  UPDATE public.test_bank_operation_receipts SET response=receipt_body WHERE user_id=uid AND operation_id=op_id;
  RETURN receipt_body;
END $$;
REVOKE ALL ON FUNCTION private.test_bank_ingest_operation_v1(jsonb) FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.ingest_test_bank_operations_v1(p_operations jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE operation jsonb; replies jsonb:='[]'::jsonb; operation_count integer; BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF jsonb_typeof(p_operations) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Operations must be an array' USING ERRCODE='23514'; END IF;
  operation_count:=jsonb_array_length(p_operations);
  IF operation_count NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Operation batch size must be between 1 and 100' USING ERRCODE='23514'; END IF;
  FOR operation IN SELECT value FROM jsonb_array_elements(p_operations) LOOP
    replies:=replies||jsonb_build_array(private.test_bank_ingest_operation_v1(operation));
  END LOOP;
  RETURN replies;
END $$;
REVOKE ALL ON FUNCTION public.ingest_test_bank_operations_v1(jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ingest_test_bank_operations_v1(jsonb) TO authenticated;

COMMIT;

-- Segment 15: canonical active-session checkpoints + explicit writer takeover.
-- Additive only. The existing immutable session version and operation receipt
-- protocols remain authoritative for grading/history; this table stores only
-- the latest cloud-accepted resumable UI state.
BEGIN;

CREATE TABLE public.test_bank_session_checkpoints (
  user_id uuid NOT NULL,
  session_id text NOT NULL CHECK (length(session_id) BETWEEN 3 AND 180),
  exam_id text NOT NULL CHECK (exam_id IN ('cssbb','cqe','cssgb','cmq','mbb')),
  writer_client_id text NOT NULL CHECK (length(writer_client_id) BETWEEN 3 AND 180 AND writer_client_id ~ '^[A-Za-z0-9:_-]+$'),
  writer_device_id text NOT NULL CHECK (length(writer_device_id) BETWEEN 3 AND 180 AND writer_device_id ~ '^[A-Za-z0-9:_-]+$'),
  writer_epoch bigint NOT NULL CHECK (writer_epoch >= 0),
  checkpoint_revision bigint NOT NULL CHECK (checkpoint_revision >= 1),
  server_session_revision bigint NOT NULL CHECK (server_session_revision >= 0),
  snapshot jsonb NOT NULL CHECK (jsonb_typeof(snapshot)='object'),
  snapshot_digest text NOT NULL CHECK (snapshot_digest ~ '^[0-9a-f]{64}$'),
  accepted_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (user_id,session_id),
  FOREIGN KEY (user_id,session_id) REFERENCES public.test_bank_session_versions(user_id,session_id) ON DELETE CASCADE
);
CREATE INDEX test_bank_session_checkpoints_active_owner ON public.test_bank_session_checkpoints(user_id,updated_at DESC,session_id);

ALTER TABLE public.test_bank_session_checkpoints ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.test_bank_session_checkpoints FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.test_bank_session_checkpoints TO authenticated;
CREATE POLICY owner_read ON public.test_bank_session_checkpoints FOR SELECT TO authenticated USING (user_id=(select auth.uid()));

CREATE FUNCTION private.test_bank_validate_handoff_snapshot(
  p_uid uuid,
  p_session public.test_bank_session_versions,
  p_runtime public.test_bank_session_runtime,
  p_writer_epoch bigint,
  p_snapshot jsonb
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,private AS $$
DECLARE
  item jsonb;
  pos integer:=0;
  pin jsonb:=p_session.version_pin;
  expected public.test_bank_session_version_items;
  timed boolean;
  deadline text;
BEGIN
  IF p_snapshot IS NULL OR jsonb_typeof(p_snapshot)<>'object' OR octet_length(p_snapshot::text)>2000000 THEN
    RAISE EXCEPTION 'Invalid or oversized handoff snapshot' USING ERRCODE='23514';
  END IF;
  IF p_snapshot->>'schemaVersion' IS DISTINCT FROM '1' OR p_snapshot->>'contractVersion' IS DISTINCT FROM '1.0.0' OR
     p_snapshot->>'kind' NOT IN ('core','adaptive') OR p_snapshot->>'ownerId' IS DISTINCT FROM p_uid::text OR
     p_snapshot->>'sessionId' IS DISTINCT FROM p_session.session_id OR p_snapshot->>'examId' IS DISTINCT FROM p_session.exam_id OR
     p_snapshot->>'mode' IS DISTINCT FROM pin->>'mode' OR p_snapshot->>'state' NOT IN ('created','in_progress','paused') OR
     jsonb_typeof(p_snapshot->'writerEpoch') IS DISTINCT FROM 'number' OR (p_snapshot->>'writerEpoch')::numeric<>trunc((p_snapshot->>'writerEpoch')::numeric) OR
     (p_snapshot->>'writerEpoch')::bigint IS DISTINCT FROM p_writer_epoch OR
     jsonb_typeof(p_snapshot->'timed') IS DISTINCT FROM 'boolean' OR p_snapshot->>'startedAt' IS DISTINCT FROM pin->>'startedAt' OR
     jsonb_typeof(p_snapshot->'payload') IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Handoff snapshot identity or policy differs from pinned session' USING ERRCODE='23514';
  END IF;
  timed:=(p_snapshot->>'timed')::boolean;
  IF timed IS DISTINCT FROM (pin->>'timed')::boolean THEN
    RAISE EXCEPTION 'Handoff timing policy differs from pinned session' USING ERRCODE='23514';
  END IF;
  deadline:=p_snapshot->>'deadlineAt';
  IF timed THEN
    IF deadline IS NULL OR deadline IS DISTINCT FROM pin->>'deadlineAt' THEN
      RAISE EXCEPTION 'Handoff cannot extend or replace the original deadline' USING ERRCODE='23514';
    END IF;
    PERFORM deadline::timestamptz;
  ELSE
    IF p_snapshot->'deadlineAt' IS DISTINCT FROM 'null'::jsonb THEN
      RAISE EXCEPTION 'Untimed handoff snapshot cannot contain a deadline' USING ERRCODE='23514';
    END IF;
  END IF;
  PERFORM (p_snapshot->>'startedAt')::timestamptz;
  IF p_runtime.exam_id IS DISTINCT FROM p_session.exam_id OR p_runtime.writer_epoch IS DISTINCT FROM p_writer_epoch OR p_runtime.state NOT IN ('in_progress','paused') THEN
    RAISE EXCEPTION 'Session is not resumable by this writer' USING ERRCODE='40001';
  END IF;

  -- Core snapshots must preserve the exact pinned order/revisions/option order.
  IF p_snapshot->>'kind'='core' THEN
    IF jsonb_typeof(p_snapshot->'payload'->'orderedItems') IS DISTINCT FROM 'array' OR
       jsonb_array_length(p_snapshot->'payload'->'orderedItems')<>(pin->>'expectedLength')::integer THEN
      RAISE EXCEPTION 'Handoff item manifest differs from the pinned session' USING ERRCODE='23514';
    END IF;
    FOR item IN SELECT value FROM jsonb_array_elements(p_snapshot->'payload'->'orderedItems') LOOP
      SELECT * INTO expected FROM public.test_bank_session_version_items
      WHERE user_id=p_uid AND session_id=p_session.session_id AND position=pos;
      IF expected.position IS NULL OR item->>'questionId' IS DISTINCT FROM expected.question_id OR
         item->>'questionRevision' IS DISTINCT FROM expected.revision_id OR item->'optionOrder' IS DISTINCT FROM expected.option_order THEN
        RAISE EXCEPTION 'Handoff item manifest differs from the pinned session' USING ERRCODE='23514';
      END IF;
      pos:=pos+1;
    END LOOP;
  ELSE
    IF p_snapshot->'payload'->>'learningSessionId' IS DISTINCT FROM p_session.session_id OR
       p_snapshot->'payload'->>'examId' IS DISTINCT FROM p_session.exam_id OR
       p_snapshot->'payload'->'versionPin' IS NULL THEN
      RAISE EXCEPTION 'Adaptive handoff snapshot is incomplete' USING ERRCODE='23514';
    END IF;
  END IF;
END $$;
REVOKE ALL ON FUNCTION private.test_bank_validate_handoff_snapshot(uuid,public.test_bank_session_versions,public.test_bank_session_runtime,bigint,jsonb) FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.save_test_bank_session_checkpoint_v1(
  p_session_id text,
  p_writer_client_id text,
  p_writer_device_id text,
  p_writer_epoch bigint,
  p_expected_checkpoint_revision bigint,
  p_snapshot jsonb
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,private AS $$
DECLARE
  uid uuid:=auth.uid();
  runtime public.test_bank_session_runtime;
  version_row public.test_bank_session_versions;
  prior public.test_bank_session_checkpoints;
  next_revision bigint;
  digest text;
  accepted timestamptz:=clock_timestamp();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_session_id !~ '^[A-Za-z0-9:_-]{3,180}$' OR p_writer_client_id !~ '^[A-Za-z0-9:_-]{3,180}$' OR
     p_writer_device_id !~ '^[A-Za-z0-9:_-]{3,180}$' OR p_writer_epoch<0 OR p_expected_checkpoint_revision<0 THEN
    RAISE EXCEPTION 'Invalid handoff checkpoint fields' USING ERRCODE='22023';
  END IF;
  SELECT * INTO STRICT runtime FROM public.test_bank_session_runtime WHERE user_id=uid AND session_id=p_session_id FOR UPDATE;
  SELECT * INTO STRICT version_row FROM public.test_bank_session_versions WHERE user_id=uid AND session_id=p_session_id;
  IF runtime.state NOT IN ('in_progress','paused') OR runtime.writer_epoch<>p_writer_epoch THEN
    RAISE EXCEPTION 'Stale or terminal session writer' USING ERRCODE='40001';
  END IF;
  SELECT * INTO prior FROM public.test_bank_session_checkpoints WHERE user_id=uid AND session_id=p_session_id FOR UPDATE;
  IF prior.session_id IS NULL THEN
    IF p_expected_checkpoint_revision<>0 THEN RAISE EXCEPTION 'Stale checkpoint revision' USING ERRCODE='40001'; END IF;
    next_revision:=1;
  ELSE
    IF prior.writer_epoch<>p_writer_epoch OR prior.writer_client_id<>p_writer_client_id OR prior.checkpoint_revision<>p_expected_checkpoint_revision THEN
      RAISE EXCEPTION 'Stale checkpoint writer or revision' USING ERRCODE='40001';
    END IF;
    next_revision:=prior.checkpoint_revision+1;
  END IF;
  PERFORM private.test_bank_validate_handoff_snapshot(uid,version_row,runtime,p_writer_epoch,p_snapshot);
  digest:=encode(sha256(convert_to(p_snapshot::text,'UTF8')),'hex');
  INSERT INTO public.test_bank_session_checkpoints(user_id,session_id,exam_id,writer_client_id,writer_device_id,writer_epoch,checkpoint_revision,server_session_revision,snapshot,snapshot_digest,accepted_at,updated_at)
  VALUES(uid,p_session_id,runtime.exam_id,p_writer_client_id,p_writer_device_id,p_writer_epoch,next_revision,runtime.session_revision,p_snapshot,digest,accepted,accepted)
  ON CONFLICT(user_id,session_id) DO UPDATE SET
    writer_client_id=EXCLUDED.writer_client_id,writer_device_id=EXCLUDED.writer_device_id,writer_epoch=EXCLUDED.writer_epoch,
    checkpoint_revision=EXCLUDED.checkpoint_revision,server_session_revision=EXCLUDED.server_session_revision,
    snapshot=EXCLUDED.snapshot,snapshot_digest=EXCLUDED.snapshot_digest,accepted_at=EXCLUDED.accepted_at,updated_at=EXCLUDED.updated_at;
  RETURN jsonb_build_object('sessionId',p_session_id,'examId',runtime.exam_id,'state',runtime.state,'writerEpoch',p_writer_epoch,
    'writerClientId',p_writer_client_id,'writerDeviceId',p_writer_device_id,'checkpointRevision',next_revision,
    'serverSessionRevision',runtime.session_revision,'snapshot',p_snapshot,'updatedAt',accepted,'serverTime',clock_timestamp());
EXCEPTION WHEN no_data_found THEN
  RAISE EXCEPTION 'Session is unavailable or not owned by this account' USING ERRCODE='42501';
END $$;
REVOKE ALL ON FUNCTION public.save_test_bank_session_checkpoint_v1(text,text,text,bigint,bigint,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.save_test_bank_session_checkpoint_v1(text,text,text,bigint,bigint,jsonb) TO authenticated;

CREATE FUNCTION public.fetch_test_bank_resumable_sessions_v1(p_session_id text DEFAULT NULL)
RETURNS TABLE(
  session_id text, exam_id text, state text, writer_epoch bigint, writer_client_id text, writer_device_id text,
  checkpoint_revision bigint, server_session_revision bigint, snapshot jsonb, updated_at timestamptz, server_time timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE uid uuid:=auth.uid(); BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_session_id IS NOT NULL AND p_session_id !~ '^[A-Za-z0-9:_-]{3,180}$' THEN RAISE EXCEPTION 'Invalid session identity' USING ERRCODE='22023'; END IF;
  RETURN QUERY
  SELECT c.session_id,c.exam_id,r.state,r.writer_epoch,c.writer_client_id,c.writer_device_id,c.checkpoint_revision,r.session_revision,
         c.snapshot,c.updated_at,clock_timestamp()
  FROM public.test_bank_session_checkpoints c
  JOIN public.test_bank_session_runtime r ON r.user_id=c.user_id AND r.session_id=c.session_id
  WHERE c.user_id=uid AND r.state IN ('in_progress','paused') AND (p_session_id IS NULL OR c.session_id=p_session_id)
  ORDER BY c.updated_at DESC,c.session_id
  LIMIT CASE WHEN p_session_id IS NULL THEN 20 ELSE 1 END;
END $$;
REVOKE ALL ON FUNCTION public.fetch_test_bank_resumable_sessions_v1(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.fetch_test_bank_resumable_sessions_v1(text) TO authenticated;

CREATE FUNCTION public.takeover_test_bank_session_v1(
  p_session_id text,
  p_writer_client_id text,
  p_writer_device_id text,
  p_expected_writer_epoch bigint,
  p_expected_checkpoint_revision bigint
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE
  uid uuid:=auth.uid();
  runtime public.test_bank_session_runtime;
  checkpoint public.test_bank_session_checkpoints;
  next_epoch bigint;
  next_server_revision bigint;
  next_checkpoint_revision bigint;
  accepted timestamptz:=clock_timestamp();
  updated_snapshot jsonb;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  IF p_session_id !~ '^[A-Za-z0-9:_-]{3,180}$' OR p_writer_client_id !~ '^[A-Za-z0-9:_-]{3,180}$' OR
     p_writer_device_id !~ '^[A-Za-z0-9:_-]{3,180}$' OR p_expected_writer_epoch<0 OR p_expected_checkpoint_revision<1 THEN
    RAISE EXCEPTION 'Invalid takeover fields' USING ERRCODE='22023';
  END IF;
  SELECT * INTO STRICT runtime FROM public.test_bank_session_runtime WHERE user_id=uid AND session_id=p_session_id FOR UPDATE;
  SELECT * INTO STRICT checkpoint FROM public.test_bank_session_checkpoints WHERE user_id=uid AND session_id=p_session_id FOR UPDATE;
  IF runtime.state NOT IN ('in_progress','paused') THEN RAISE EXCEPTION 'Terminal session cannot be taken over' USING ERRCODE='40001'; END IF;
  IF runtime.writer_epoch<>p_expected_writer_epoch OR checkpoint.writer_epoch<>runtime.writer_epoch OR checkpoint.checkpoint_revision<>p_expected_checkpoint_revision THEN
    RAISE EXCEPTION 'Stale takeover expectation' USING ERRCODE='40001';
  END IF;
  IF checkpoint.writer_client_id=p_writer_client_id THEN
    RETURN jsonb_build_object('sessionId',p_session_id,'examId',runtime.exam_id,'state',runtime.state,'writerEpoch',runtime.writer_epoch,
      'writerClientId',checkpoint.writer_client_id,'writerDeviceId',checkpoint.writer_device_id,'checkpointRevision',checkpoint.checkpoint_revision,
      'serverSessionRevision',runtime.session_revision,'snapshot',checkpoint.snapshot,'updatedAt',checkpoint.updated_at,'serverTime',clock_timestamp(),'applied',false);
  END IF;
  next_epoch:=runtime.writer_epoch+1;
  next_server_revision:=runtime.session_revision+1;
  next_checkpoint_revision:=checkpoint.checkpoint_revision+1;
  updated_snapshot:=jsonb_set(checkpoint.snapshot,'{writerEpoch}',to_jsonb(next_epoch),false);
  UPDATE public.test_bank_session_runtime SET writer_epoch=next_epoch,session_revision=next_server_revision,updated_at=accepted
  WHERE user_id=uid AND session_id=p_session_id;
  UPDATE public.test_bank_session_checkpoints SET writer_client_id=p_writer_client_id,writer_device_id=p_writer_device_id,writer_epoch=next_epoch,
    checkpoint_revision=next_checkpoint_revision,server_session_revision=next_server_revision,snapshot=updated_snapshot,
    snapshot_digest=encode(sha256(convert_to(updated_snapshot::text,'UTF8')),'hex'),accepted_at=accepted,updated_at=accepted
  WHERE user_id=uid AND session_id=p_session_id;
  RETURN jsonb_build_object('sessionId',p_session_id,'examId',runtime.exam_id,'state',runtime.state,'writerEpoch',next_epoch,
    'writerClientId',p_writer_client_id,'writerDeviceId',p_writer_device_id,'checkpointRevision',next_checkpoint_revision,
    'serverSessionRevision',next_server_revision,'snapshot',updated_snapshot,'updatedAt',accepted,'serverTime',clock_timestamp(),'applied',true);
EXCEPTION WHEN no_data_found THEN
  RAISE EXCEPTION 'Session has no cloud checkpoint or is not owned by this account' USING ERRCODE='42501';
END $$;
REVOKE ALL ON FUNCTION public.takeover_test_bank_session_v1(text,text,text,bigint,bigint) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.takeover_test_bank_session_v1(text,text,text,bigint,bigint) TO authenticated;

COMMENT ON TABLE public.test_bank_session_checkpoints IS 'Segment15 latest cloud-accepted resumable UI checkpoint; immutable grading/history remain in the event/result tables.';
COMMENT ON FUNCTION public.takeover_test_bank_session_v1(text,text,text,bigint,bigint) IS 'Explicit CAS takeover; atomically advances writer epoch without changing the pinned deadline or merging another device local-only state.';

COMMIT;

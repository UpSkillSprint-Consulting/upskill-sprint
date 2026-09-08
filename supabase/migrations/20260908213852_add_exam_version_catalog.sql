-- Segment 05: additive, immutable catalog and owner-bound session references.
-- Apply schema, publish the reviewed catalog seed, THEN deploy the new client.
-- Legacy events are deliberately retained; Segment 07 owns mandatory ingestion
-- protocol adoption, writer epochs and finalization receipts. No live write is
-- performed by adding this migration to the repository.
BEGIN;

CREATE TABLE public.test_bank_catalog_questions (
  exam_id text NOT NULL CHECK (exam_id IN ('cssbb','cqe','cssgb','cmq','mbb')),
  question_id text NOT NULL CHECK (length(question_id) BETWEEN 3 AND 180),
  retired_at timestamptz,
  PRIMARY KEY (exam_id,question_id),
  CHECK (left(question_id,length(exam_id)+1)=exam_id||':')
);
CREATE TABLE public.test_bank_question_revisions (
  exam_id text NOT NULL,
  question_id text NOT NULL,
  revision_id text NOT NULL CHECK (revision_id ~ '^[0-9a-f]{64}$'),
  canonical_content text NOT NULL,
  content jsonb NOT NULL CHECK (jsonb_typeof(content)='object'),
  PRIMARY KEY (exam_id,question_id,revision_id),
  FOREIGN KEY (exam_id,question_id) REFERENCES public.test_bank_catalog_questions,
  CHECK (content ?& ARRAY['stem','options','answer','sub'] AND canonical_content::jsonb=content),
  CHECK (encode(sha256(convert_to('question-v1'||chr(10)||canonical_content,'UTF8')),'hex')=revision_id),
  CHECK (jsonb_typeof(content->'options')='array' AND jsonb_array_length(content->'options') BETWEEN 2 AND 10),
  CHECK (jsonb_typeof(content->'stem')='string' AND length(content->>'stem')>0),
  CHECK (jsonb_typeof(content->'answer')='number' AND (content->>'answer')::numeric=trunc((content->>'answer')::numeric) AND (content->>'answer')::int BETWEEN 0 AND jsonb_array_length(content->'options')-1)
);
CREATE TABLE public.test_bank_catalog_configs (
  exam_id text NOT NULL CHECK (exam_id IN ('cssbb','cqe','cssgb','cmq','mbb')),
  config_version text NOT NULL CHECK (config_version ~ '^[0-9a-f]{64}$'),
  blueprint_version text NOT NULL CHECK (blueprint_version ~ '^[0-9a-f]{64}$'),
  canonical_payload text NOT NULL,
  configuration jsonb NOT NULL,
  provenance jsonb NOT NULL,
  PRIMARY KEY (exam_id,config_version),
  CHECK (configuration ?& ARRAY['questions','minutes','bok','siteTargetBps','gradingPolicyVersion','masteryPolicyVersion','timingPolicyVersion'] AND canonical_payload::jsonb=jsonb_build_object('config',configuration,'provenance',provenance)),
  CHECK (encode(sha256(convert_to('config-v1'||chr(10)||canonical_payload,'UTF8')),'hex')=config_version),
  CHECK (jsonb_typeof(configuration->'bok')='array'),
  CHECK (jsonb_typeof(configuration->'questions')='number' AND (configuration->>'questions')::int BETWEEN 1 AND 200),
  CHECK (configuration->'siteTargetBps'='null'::jsonb OR (jsonb_typeof(configuration->'siteTargetBps')='number' AND (configuration->>'siteTargetBps')::int BETWEEN 0 AND 10000))
);
CREATE TABLE public.test_bank_catalog_banks (
  exam_id text NOT NULL,
  bank_version text NOT NULL CHECK (bank_version ~ '^[0-9a-f]{64}$'),
  canonical_manifest text NOT NULL,
  manifest jsonb NOT NULL,
  PRIMARY KEY (exam_id,bank_version),
  CHECK (manifest ?& ARRAY['examId','questions','sets'] AND canonical_manifest::jsonb=manifest AND manifest->>'examId'=exam_id),
  CHECK (encode(sha256(convert_to('bank-v1'||chr(10)||canonical_manifest,'UTF8')),'hex')=bank_version)
);
CREATE TABLE public.test_bank_catalog_bank_items (
  exam_id text NOT NULL,
  bank_version text NOT NULL,
  question_id text NOT NULL,
  revision_id text NOT NULL,
  PRIMARY KEY (exam_id,bank_version,question_id),
  UNIQUE (exam_id,bank_version,question_id,revision_id),
  FOREIGN KEY (exam_id,bank_version) REFERENCES public.test_bank_catalog_banks,
  FOREIGN KEY (exam_id,question_id,revision_id) REFERENCES public.test_bank_question_revisions
);
CREATE TABLE public.test_bank_catalog_memberships (
  exam_id text NOT NULL,
  bank_version text NOT NULL,
  set_id text NOT NULL CHECK (length(set_id) BETWEEN 1 AND 80),
  question_id text NOT NULL,
  PRIMARY KEY (exam_id,bank_version,set_id,question_id),
  FOREIGN KEY (exam_id,bank_version,question_id) REFERENCES public.test_bank_catalog_bank_items
);
CREATE TABLE public.test_bank_catalog_releases (
  exam_id text NOT NULL,
  config_version text NOT NULL,
  bank_version text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (exam_id,config_version,bank_version),
  FOREIGN KEY (exam_id,config_version) REFERENCES public.test_bank_catalog_configs,
  FOREIGN KEY (exam_id,bank_version) REFERENCES public.test_bank_catalog_banks
);
CREATE TABLE public.test_bank_question_aliases (
  exam_id text NOT NULL,
  alias_id text NOT NULL CHECK (length(alias_id) BETWEEN 1 AND 180),
  question_id text NOT NULL,
  provenance text NOT NULL CHECK (length(btrim(provenance))>0),
  PRIMARY KEY (exam_id,alias_id),
  FOREIGN KEY (exam_id,question_id) REFERENCES public.test_bank_catalog_questions,
  CHECK (alias_id<>question_id)
);
CREATE TABLE public.test_bank_session_versions (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  exam_id text NOT NULL,
  config_version text NOT NULL,
  bank_version text NOT NULL,
  started_event_id text NOT NULL,
  version_pin jsonb NOT NULL CHECK (jsonb_typeof(version_pin)='object'),
  PRIMARY KEY (user_id,session_id),
  UNIQUE (user_id,session_id,exam_id,bank_version),
  FOREIGN KEY (exam_id,config_version,bank_version) REFERENCES public.test_bank_catalog_releases,
  FOREIGN KEY (user_id,started_event_id) REFERENCES public.test_bank_learning_events(user_id,event_id) ON DELETE CASCADE
);
CREATE TABLE public.test_bank_session_version_items (
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  position integer NOT NULL CHECK (position BETWEEN 0 AND 199),
  exam_id text NOT NULL,
  bank_version text NOT NULL,
  question_id text NOT NULL,
  revision_id text NOT NULL,
  option_order jsonb NOT NULL CHECK (jsonb_typeof(option_order)='array'),
  PRIMARY KEY (user_id,session_id,position),
  UNIQUE (user_id,session_id,question_id),
  FOREIGN KEY (user_id,session_id,exam_id,bank_version) REFERENCES public.test_bank_session_versions(user_id,session_id,exam_id,bank_version) ON DELETE CASCADE,
  FOREIGN KEY (exam_id,bank_version,question_id,revision_id) REFERENCES public.test_bank_catalog_bank_items(exam_id,bank_version,question_id,revision_id)
);
CREATE TABLE public.test_bank_versioned_results (
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  result_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('original','regrade')),
  source_event_id text NOT NULL,
  original_result_id text,
  grade jsonb NOT NULL CHECK (jsonb_typeof(grade)='object'),
  provenance jsonb NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id,result_id),
  FOREIGN KEY (user_id,session_id) REFERENCES public.test_bank_session_versions ON DELETE CASCADE,
  FOREIGN KEY (user_id,source_event_id) REFERENCES public.test_bank_learning_events(user_id,event_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id,original_result_id) REFERENCES public.test_bank_versioned_results(user_id,result_id) ON DELETE CASCADE,
  CHECK ((kind='original' AND original_result_id IS NULL) OR (kind='regrade' AND original_result_id IS NOT NULL))
);
CREATE UNIQUE INDEX test_bank_one_original_versioned_result ON public.test_bank_versioned_results(user_id,session_id) WHERE kind='original';

CREATE FUNCTION public.test_bank_validate_alias() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$ BEGIN
  IF EXISTS(SELECT 1 FROM public.test_bank_catalog_questions WHERE exam_id=NEW.exam_id AND question_id=NEW.alias_id) THEN
    RAISE EXCEPTION 'An alias cannot replace an existing canonical identity' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.test_bank_validate_alias() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER validate_alias BEFORE INSERT ON public.test_bank_question_aliases FOR EACH ROW EXECUTE FUNCTION public.test_bank_validate_alias();

-- Public question content is already delivered as static website assets. Only
-- authenticated clients may read the SQL catalog; none may publish or change it.
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['test_bank_catalog_questions','test_bank_question_revisions','test_bank_catalog_configs','test_bank_catalog_banks','test_bank_catalog_bank_items','test_bank_catalog_memberships','test_bank_catalog_releases','test_bank_question_aliases','test_bank_session_versions','test_bank_session_version_items','test_bank_versioned_results'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
    EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anon,authenticated',t);
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated',t);
    IF t IN ('test_bank_session_versions','test_bank_session_version_items','test_bank_versioned_results') THEN
      EXECUTE format('CREATE POLICY owner_read ON public.%I FOR SELECT TO authenticated USING (user_id=(select auth.uid()))',t);
    ELSE
      EXECUTE format('CREATE POLICY catalog_read ON public.%I FOR SELECT TO authenticated USING (true)',t);
    END IF;
  END LOOP;
END $$;

CREATE FUNCTION public.test_bank_reject_version_update() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$ BEGIN
  RAISE EXCEPTION 'Published versions, aliases, session pins and results are immutable' USING ERRCODE='23514';
END $$;
REVOKE ALL ON FUNCTION public.test_bank_reject_version_update() FROM PUBLIC,anon,authenticated;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['test_bank_question_revisions','test_bank_catalog_configs','test_bank_catalog_banks','test_bank_catalog_bank_items','test_bank_catalog_memberships','test_bank_catalog_releases','test_bank_question_aliases','test_bank_session_versions','test_bank_session_version_items','test_bank_versioned_results'] LOOP
    EXECUTE format('CREATE TRIGGER immutable_version BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.test_bank_reject_version_update()',t);
  END LOOP;
END $$;

-- Trusted publication only. The canonical UTF-8 strings and their SHA-256 are
-- checked by PostgreSQL independently of the JavaScript hashing implementation.
CREATE FUNCTION public.publish_test_bank_catalog(p jsonb) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE e text:=p->>'examId'; c jsonb:=p->'config'; q record; s record; id text; rev text; BEGIN
  IF p->>'schemaVersion' IS DISTINCT FROM '1.0.0' OR NOT(p ?& ARRAY['examId','config','configVersion','bankVersion','blueprintVersion','provenance','contents','canonicalConfig','canonicalBlueprint','canonicalManifest']) OR jsonb_typeof(p->'contents') IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Unsupported catalog version' USING ERRCODE='23514'; END IF;
  INSERT INTO public.test_bank_catalog_configs VALUES(e,p->>'configVersion',p->>'blueprintVersion',p->>'canonicalConfig',c,p->'provenance') ON CONFLICT DO NOTHING;
  IF NOT EXISTS(SELECT 1 FROM public.test_bank_catalog_configs WHERE exam_id=e AND config_version=p->>'configVersion' AND canonical_payload=p->>'canonicalConfig') THEN RAISE EXCEPTION 'Conflicting configuration' USING ERRCODE='23514'; END IF;
  IF encode(sha256(convert_to('blueprint-v1'||chr(10)||(p->>'canonicalBlueprint'),'UTF8')),'hex') IS DISTINCT FROM p->>'blueprintVersion' OR (p->>'canonicalBlueprint')::jsonb IS DISTINCT FROM c->'bok' THEN RAISE EXCEPTION 'Conflicting blueprint' USING ERRCODE='23514'; END IF;
  FOR q IN SELECT key,value FROM jsonb_each(p->'contents') LOOP
    id:=q.key; rev:=q.value->>'revision';
    INSERT INTO public.test_bank_catalog_questions(exam_id,question_id) VALUES(e,id) ON CONFLICT DO NOTHING;
    INSERT INTO public.test_bank_question_revisions VALUES(e,id,rev,q.value->>'canonicalContent',q.value->'content') ON CONFLICT DO NOTHING;
    IF NOT EXISTS(SELECT 1 FROM public.test_bank_question_revisions WHERE exam_id=e AND question_id=id AND revision_id=rev AND canonical_content=q.value->>'canonicalContent') THEN RAISE EXCEPTION 'Conflicting revision' USING ERRCODE='23514'; END IF;
    IF (SELECT count(*) FROM jsonb_array_elements(c->'bok') d, jsonb_array_elements(d->'subs') sub WHERE sub->>'id'=q.value->'content'->>'sub')<>1 THEN RAISE EXCEPTION 'Revision has invalid blueprint domain' USING ERRCODE='23514'; END IF;
  END LOOP;
  INSERT INTO public.test_bank_catalog_banks VALUES(e,p->>'bankVersion',p->>'canonicalManifest',(p->>'canonicalManifest')::jsonb) ON CONFLICT DO NOTHING;
  IF NOT EXISTS(SELECT 1 FROM public.test_bank_catalog_banks WHERE exam_id=e AND bank_version=p->>'bankVersion' AND canonical_manifest=p->>'canonicalManifest') THEN RAISE EXCEPTION 'Conflicting bank' USING ERRCODE='23514'; END IF;
  FOR q IN SELECT key,value FROM jsonb_each(((p->>'canonicalManifest')::jsonb)->'questions') LOOP
    INSERT INTO public.test_bank_catalog_bank_items VALUES(e,p->>'bankVersion',q.key,q.value#>>'{}') ON CONFLICT DO NOTHING;
  END LOOP;
  FOR s IN SELECT key,value FROM jsonb_each(((p->>'canonicalManifest')::jsonb)->'sets') LOOP
    FOR id IN SELECT jsonb_array_elements_text(s.value) LOOP
      INSERT INTO public.test_bank_catalog_memberships VALUES(e,p->>'bankVersion',s.key,id) ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
  INSERT INTO public.test_bank_catalog_releases(exam_id,config_version,bank_version) VALUES(e,p->>'configVersion',p->>'bankVersion') ON CONFLICT DO NOTHING;
END $$;
REVOKE ALL ON FUNCTION public.publish_test_bank_catalog(jsonb) FROM PUBLIC,anon,authenticated;
-- Deliberately no general learner RPC grants. An authorized migration owner can
-- execute the seed. A production publisher role must be authorized separately.

-- Independent single-select evaluation from the original versioned selections.
-- Corrections may change a key/stem/explanation, but changed option text/order
-- requires an explicit remapping protocol and is deliberately rejected here.
CREATE FUNCTION public.grade_test_bank_versioned_session(p_user uuid,p_session text,p_answers jsonb,p_corrections jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE s public.test_bank_session_versions; i record; a jsonb; q jsonb; oldq jsonb; rev text; selected integer; expected_status text; total integer:=0; correct integer:=0; incorrect integer:=0; unanswered integer:=0; target integer; domains jsonb:='{}'; domain text; d jsonb; conf jsonb; BEGIN
  SELECT * INTO STRICT s FROM public.test_bank_session_versions WHERE user_id=p_user AND session_id=p_session;
  SELECT configuration INTO STRICT conf FROM public.test_bank_catalog_configs WHERE exam_id=s.exam_id AND config_version=s.config_version;
  IF jsonb_typeof(p_answers) IS DISTINCT FROM 'array' OR jsonb_array_length(p_answers)<>(SELECT count(*) FROM public.test_bank_session_version_items WHERE user_id=p_user AND session_id=p_session) OR jsonb_typeof(p_corrections) IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Invalid completion size/correction map' USING ERRCODE='23514'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_object_keys(p_corrections) k WHERE NOT EXISTS(SELECT 1 FROM public.test_bank_session_version_items WHERE user_id=p_user AND session_id=p_session AND question_id=k)) THEN RAISE EXCEPTION 'Unknown correction identity' USING ERRCODE='23514'; END IF;
  FOR i IN SELECT * FROM public.test_bank_session_version_items WHERE user_id=p_user AND session_id=p_session ORDER BY position LOOP
    a:=p_answers->i.position; rev:=coalesce(p_corrections->>i.question_id,i.revision_id);
    SELECT content INTO STRICT oldq FROM public.test_bank_question_revisions WHERE exam_id=i.exam_id AND question_id=i.question_id AND revision_id=i.revision_id;
    SELECT content INTO q FROM public.test_bank_question_revisions WHERE exam_id=i.exam_id AND question_id=i.question_id AND revision_id=rev;
    IF q IS NULL OR q->'options' IS DISTINCT FROM oldq->'options' THEN RAISE EXCEPTION 'Unpublished correction or option remapping required' USING ERRCODE='23514'; END IF;
    IF a->>'questionId' IS DISTINCT FROM i.question_id OR NOT(a?'selected') THEN RAISE EXCEPTION 'Completion order/identity mismatch' USING ERRCODE='23514'; END IF;
    IF a->'selected'='null'::jsonb THEN selected:=NULL;
    ELSIF jsonb_typeof(a->'selected')='number' AND (a->>'selected')::numeric=trunc((a->>'selected')::numeric) THEN selected:=(a->>'selected')::int;
    ELSE RAISE EXCEPTION 'Invalid selected option' USING ERRCODE='23514'; END IF;
    IF selected IS NOT NULL AND (selected<0 OR selected>=jsonb_array_length(i.option_order)) THEN RAISE EXCEPTION 'Invalid selected option' USING ERRCODE='23514'; END IF;
    expected_status:=CASE WHEN selected IS NULL THEN 'unanswered' WHEN i.option_order->>selected='o'||(q->>'answer') THEN 'correct' ELSE 'incorrect' END;
    IF p_corrections='{}'::jsonb AND a->>'status' IS DISTINCT FROM expected_status THEN RAISE EXCEPTION 'Status conflicts with pinned answer key' USING ERRCODE='23514'; END IF;
    total:=total+1;
    IF expected_status='correct' THEN correct:=correct+1; ELSIF expected_status='incorrect' THEN incorrect:=incorrect+1; ELSE unanswered:=unanswered+1; END IF;
    SELECT b->>'domain' INTO STRICT domain FROM jsonb_array_elements(conf->'bok') b WHERE EXISTS(SELECT 1 FROM jsonb_array_elements(b->'subs') sub WHERE sub->>'id'=oldq->>'sub');
    d:=coalesce(domains->domain,jsonb_build_object('total',0,'correct',0,'incorrect',0,'unanswered',0));
    d:=jsonb_set(d,'{total}',to_jsonb((d->>'total')::int+1));d:=jsonb_set(d,ARRAY[expected_status],to_jsonb((d->>expected_status)::int+1));domains:=jsonb_set(domains,ARRAY[domain],d);
  END LOOP;
  target:=(s.version_pin->>'siteTargetBps')::int;
  RETURN jsonb_build_object('schemaVersion','1.0.0','configVersion',s.config_version,'bankVersion',s.bank_version,'gradingPolicyVersion',s.version_pin->>'gradingPolicyVersion','expectedLength',s.version_pin->'expectedLength','siteTargetBps',target,'total',total,'correct',correct,'incorrect',incorrect,'unanswered',unanswered,'byDomain',domains,'scorePercent',100.0*correct/nullif(total,0),'siteTargetMet',CASE WHEN target IS NULL OR total=0 THEN NULL ELSE correct*10000>=total*target END);
END $$;
REVOKE ALL ON FUNCTION public.grade_test_bank_versioned_session(uuid,text,jsonb,jsonb) FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.capture_test_bank_versioned_event() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE pin jsonb:=NEW.payload->'versionPin'; s public.test_bank_session_versions; c public.test_bank_catalog_configs; item jsonb; pos integer:=0; q jsonb; n integer; target integer; expected_length integer; grade jsonb; claim jsonb; existing public.test_bank_versioned_results; BEGIN
  SELECT * INTO s FROM public.test_bank_session_versions WHERE user_id=NEW.user_id AND session_id=NEW.session_id;
  -- Absent/null version metadata is the explicit legacy adapter. Once a
  -- versioned start exists, finalization cannot downgrade that session.
  IF (pin IS NULL OR pin='null'::jsonb) AND s.session_id IS NULL THEN RETURN NEW; END IF;
  IF auth.uid() IS NULL OR auth.uid()<>NEW.user_id THEN RAISE EXCEPTION 'Owner authorization required' USING ERRCODE='42501'; END IF;
  IF NEW.event_type='session_started' THEN
    IF jsonb_typeof(pin) IS DISTINCT FROM 'object' OR pin->>'codec' IS DISTINCT FROM '1' OR pin->>'contractVersion' IS DISTINCT FROM '1.0.0' OR pin->>'examId' IS DISTINCT FROM NEW.exam_id OR pin->>'sessionId' IS DISTINCT FROM NEW.session_id THEN RAISE EXCEPTION 'Unsupported/foreign session pin' USING ERRCODE='23514'; END IF;
    SELECT * INTO c FROM public.test_bank_catalog_configs WHERE exam_id=NEW.exam_id AND config_version=pin->>'configVersion';
    IF c.config_version IS NULL THEN RAISE EXCEPTION 'Publish configuration before accepting this client' USING ERRCODE='23503'; END IF;
    IF pin->>'blueprintVersion' IS DISTINCT FROM c.blueprint_version OR pin->'siteTargetBps' IS DISTINCT FROM c.configuration->'siteTargetBps' OR pin->>'gradingPolicyVersion' IS DISTINCT FROM c.configuration->>'gradingPolicyVersion' OR pin->>'timingPolicyVersion' IS DISTINCT FROM c.configuration->>'timingPolicyVersion' OR pin->>'masteryPolicyVersion' IS DISTINCT FROM c.configuration->>'masteryPolicyVersion' THEN RAISE EXCEPTION 'Pinned policy differs from published configuration' USING ERRCODE='23514'; END IF;
    IF pin->>'mode' IS NULL OR jsonb_typeof(pin->'startedAt') IS DISTINCT FROM 'string' OR (pin->>'startedAt')::timestamptz IS NULL OR pin->>'mode' NOT IN ('exam','quick','focus','diagnostic','practice','adaptive') OR pin->>'mode' IS DISTINCT FROM NEW.payload->>'mode' OR jsonb_typeof(pin->'timed') IS DISTINCT FROM 'boolean' OR pin->'timed' IS DISTINCT FROM NEW.payload->'timed' OR jsonb_typeof(pin->'items') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Malformed session plan' USING ERRCODE='23514'; END IF;
    n:=jsonb_array_length(pin->'items');
    expected_length:=CASE WHEN pin->>'mode'='exam' THEN coalesce((c.configuration->'fullExamQuestionsBySet'->>(pin->>'setId'))::int,(c.configuration->>'questions')::int) ELSE n END;
    IF n NOT BETWEEN 1 AND 200 OR n IS DISTINCT FROM (NEW.payload->>'total')::int OR expected_length IS DISTINCT FROM (pin->>'expectedLength')::int OR pin->>'setId' IS NULL THEN RAISE EXCEPTION 'Invalid expected session length/set' USING ERRCODE='23514'; END IF;
    IF (pin->>'timed')::boolean THEN
      IF jsonb_typeof(pin->'deadlineAt') IS DISTINCT FROM 'string' OR (pin->>'limitSeconds')::numeric IS NULL OR (pin->>'limitSeconds')::numeric<>trunc((pin->>'limitSeconds')::numeric) OR (pin->>'limitSeconds')::int NOT BETWEEN 1 AND 86400 OR (pin->>'deadlineAt')::timestamptz IS DISTINCT FROM (pin->>'startedAt')::timestamptz+((pin->>'limitSeconds')::int*interval '1 second') OR pin->>'mode'='adaptive' THEN RAISE EXCEPTION 'Invalid pinned deadline' USING ERRCODE='23514'; END IF;
    ELSIF pin->'deadlineAt' IS DISTINCT FROM 'null'::jsonb OR pin->'limitSeconds' IS DISTINCT FROM 'null'::jsonb THEN RAISE EXCEPTION 'Untimed plan has a deadline' USING ERRCODE='23514'; END IF;
    IF s.session_id IS NOT NULL THEN
      IF s.version_pin IS DISTINCT FROM pin THEN RAISE EXCEPTION 'Session version cannot be replaced' USING ERRCODE='23514'; END IF;
      RETURN NEW;
    END IF;
    INSERT INTO public.test_bank_session_versions VALUES(NEW.user_id,NEW.session_id,NEW.exam_id,pin->>'configVersion',pin->>'bankVersion',NEW.event_id,pin);
    FOR item IN SELECT jsonb_array_elements(pin->'items') LOOP
      IF jsonb_typeof(item) IS DISTINCT FROM 'array' OR jsonb_array_length(item)<>3 THEN RAISE EXCEPTION 'Malformed pinned item' USING ERRCODE='23514'; END IF;
      SELECT content INTO q FROM public.test_bank_question_revisions WHERE exam_id=NEW.exam_id AND question_id=item->>0 AND revision_id=item->>1;
      IF q IS NULL THEN RAISE EXCEPTION 'Unknown pinned revision' USING ERRCODE='23503'; END IF;
      IF jsonb_typeof(item->2) IS DISTINCT FROM 'array' OR jsonb_array_length(item->2)<>jsonb_array_length(q->'options') OR EXISTS(SELECT 1 FROM generate_series(0,jsonb_array_length(q->'options')-1) x WHERE (SELECT count(*) FROM jsonb_array_elements_text(item->2) z WHERE z='o'||x)<>1) THEN RAISE EXCEPTION 'Invalid option permutation' USING ERRCODE='23514'; END IF;
      IF pin->>'setId'<>'mix' AND NOT EXISTS(SELECT 1 FROM public.test_bank_catalog_memberships WHERE exam_id=NEW.exam_id AND bank_version=pin->>'bankVersion' AND question_id=item->>0 AND set_id=pin->>'setId') THEN RAISE EXCEPTION 'Question not in pinned set' USING ERRCODE='23514'; END IF;
      INSERT INTO public.test_bank_session_version_items VALUES(NEW.user_id,NEW.session_id,pos,NEW.exam_id,pin->>'bankVersion',item->>0,item->>1,item->2);pos:=pos+1;
    END LOOP;
  ELSIF NEW.event_type='session_completed' THEN
    IF s.session_id IS NULL THEN RAISE EXCEPTION 'Versioned start must be accepted first' USING ERRCODE='23503'; END IF;
    IF pin IS DISTINCT FROM (s.version_pin-'items') OR NEW.exam_id IS DISTINCT FROM s.exam_id OR NEW.payload->>'mode' IS DISTINCT FROM pin->>'mode' OR NEW.payload->'timed' IS DISTINCT FROM pin->'timed' THEN RAISE EXCEPTION 'Completion changed the pinned plan' USING ERRCODE='23514'; END IF;
    grade:=public.grade_test_bank_versioned_session(NEW.user_id,NEW.session_id,NEW.payload->'answers');claim:=NEW.payload->'grading';
    IF NEW.payload->'total' IS DISTINCT FROM grade->'total' OR NEW.payload->'correct' IS DISTINCT FROM grade->'correct' OR claim IS NULL OR claim->>'kind' IS DISTINCT FROM 'original' OR claim->>'resultId' IS DISTINCT FROM NEW.session_id||':original' OR EXISTS(SELECT 1 FROM jsonb_each(grade) g WHERE g.key<>'scorePercent' AND claim->g.key IS DISTINCT FROM g.value) THEN RAISE EXCEPTION 'Result conflicts with original pinned grade' USING ERRCODE='23514'; END IF;
    SELECT * INTO existing FROM public.test_bank_versioned_results WHERE user_id=NEW.user_id AND session_id=NEW.session_id AND kind='original';
    IF existing.result_id IS NOT NULL THEN
      IF (SELECT payload->'answers' FROM public.test_bank_learning_events WHERE user_id=NEW.user_id AND event_id=existing.source_event_id) IS DISTINCT FROM NEW.payload->'answers' THEN RAISE EXCEPTION 'Original result is immutable' USING ERRCODE='23514'; END IF;
      RETURN NEW;
    END IF;
    INSERT INTO public.test_bank_versioned_results(user_id,session_id,result_id,kind,source_event_id,grade,provenance) VALUES(NEW.user_id,NEW.session_id,NEW.session_id||':original','original',NEW.event_id,grade,jsonb_build_object('kind','original','pin',pin,'clientPinDigest',claim->'pinDigest'));
  ELSE
    IF s.session_id IS NULL OR NEW.exam_id IS DISTINCT FROM s.exam_id THEN RAISE EXCEPTION 'Event not owned by pinned session' USING ERRCODE='23514'; END IF;
    IF NEW.event_type IN ('question_exposed','answer_recorded') AND NOT EXISTS(SELECT 1 FROM public.test_bank_session_version_items WHERE user_id=NEW.user_id AND session_id=NEW.session_id AND question_id=NEW.question_id) THEN RAISE EXCEPTION 'Question outside pinned session' USING ERRCODE='23514'; END IF;
    IF NEW.event_type='answer_recorded' THEN
      SELECT content INTO q FROM public.test_bank_question_revisions r JOIN public.test_bank_session_version_items i USING(exam_id,question_id,revision_id) WHERE i.user_id=NEW.user_id AND i.session_id=NEW.session_id AND i.question_id=NEW.question_id AND i.position=(NEW.payload->>'index')::int AND i.revision_id=NEW.payload->'versionRef'->>'questionRevision';
      IF q IS NULL OR NEW.payload->'versionRef'->>'configVersion' IS DISTINCT FROM s.config_version OR NEW.payload->'versionRef'->>'bankVersion' IS DISTINCT FROM s.bank_version THEN RAISE EXCEPTION 'Answer version differs from pinned item' USING ERRCODE='23514'; END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.capture_test_bank_versioned_event() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER capture_versioned_event AFTER INSERT ON public.test_bank_learning_events FOR EACH ROW EXECUTE FUNCTION public.capture_test_bank_versioned_event();

CREATE FUNCTION public.regrade_test_bank_versioned_session(p_user uuid,p_session text,p_corrections jsonb,p_reason text,p_reviewer text,p_request_id text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE original public.test_bank_versioned_results; existing public.test_bank_versioned_results; answers jsonb; grade jsonb; provenance jsonb; v_result_id text; BEGIN
  IF length(btrim(coalesce(p_reason,'')))<10 OR length(btrim(coalesce(p_reviewer,'')))=0 OR p_request_id !~ '^[A-Za-z0-9:_-]{8,180}$' OR p_request_id IS NULL OR p_corrections IS NULL OR p_corrections='{}'::jsonb THEN RAISE EXCEPTION 'Explicit correction, reason, reviewer and request ID required' USING ERRCODE='23514'; END IF;
  SELECT * INTO STRICT original FROM public.test_bank_versioned_results WHERE user_id=p_user AND session_id=p_session AND kind='original';
  SELECT payload->'answers' INTO STRICT answers FROM public.test_bank_learning_events WHERE user_id=p_user AND event_id=original.source_event_id;
  grade:=public.grade_test_bank_versioned_session(p_user,p_session,answers,p_corrections);
  provenance:=jsonb_build_object('kind','regrade','reason',p_reason,'reviewer',p_reviewer,'requestId',p_request_id,'originalResultId',original.result_id,'corrections',p_corrections);
  v_result_id:=p_session||':regrade:'||p_request_id;
  INSERT INTO public.test_bank_versioned_results(user_id,session_id,result_id,kind,source_event_id,original_result_id,grade,provenance) VALUES(p_user,p_session,v_result_id,'regrade',original.source_event_id,original.result_id,grade,provenance) ON CONFLICT DO NOTHING;
  SELECT * INTO STRICT existing FROM public.test_bank_versioned_results r WHERE r.user_id=p_user AND r.result_id=v_result_id;
  IF existing.provenance IS DISTINCT FROM provenance OR existing.grade IS DISTINCT FROM grade THEN RAISE EXCEPTION 'Regrade request ID reused with conflicting content' USING ERRCODE='23514'; END IF;
  RETURN jsonb_build_object('resultId',existing.result_id,'kind',existing.kind,'grade',existing.grade,'provenance',existing.provenance,'recordedAt',existing.recorded_at);
END $$;
REVOKE ALL ON FUNCTION public.regrade_test_bank_versioned_session(uuid,text,jsonb,text,text,text) FROM PUBLIC,anon,authenticated;
COMMIT;

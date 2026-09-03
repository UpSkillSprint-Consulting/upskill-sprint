-- Make the compact reservation table the authoritative New-only gate.  The
-- browser may send the complete shuffled candidate pool immediately; the
-- database excludes both previously claimed IDs and every question already
-- represented in the durable learning-event ledger.

create index if not exists test_bank_learning_events_user_exam_question_idx
  on public.test_bank_learning_events (user_id, exam_id, question_id)
  where question_id is not null;

-- `occurred_at` is supplied by an offline-capable browser and may be older
-- than the last sync. `received_at` is assigned by Postgres, so it is the safe
-- high-water mark for incremental ledger hydration.
create index if not exists test_bank_learning_events_user_received_event_idx
  on public.test_bank_learning_events (user_id, received_at, event_id);

-- Device payload polling also uses a database-authored version. Browser clocks
-- are not trustworthy sync cursors, so every insert/update receives the
-- database wall-clock value even if an older client supplies `updated_at`.
create or replace function public.touch_test_bank_progress_device_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

revoke all on function public.touch_test_bank_progress_device_updated_at() from public, anon, authenticated;

drop trigger if exists touch_test_bank_progress_device_updated_at on public.test_bank_progress_devices;
create trigger touch_test_bank_progress_device_updated_at
before insert or update on public.test_bank_progress_devices
for each row execute function public.touch_test_bank_progress_device_updated_at();

-- The claims table deliberately has no browser grants or direct RLS policy.
-- This narrowly scoped definer function is its only API: ownership always
-- comes from auth.uid(), inputs are bounded, and the search path is empty.
create or replace function public.reserve_test_bank_new_questions(
  p_exam_id text,
  p_question_ids text[]
)
returns table (question_id text)
language plpgsql
security definer
set search_path = ''
set statement_timeout = '5s'
as $$
declare
  v_user_id uuid := auth.uid();
  v_exam_id text := btrim(coalesce(p_exam_id, ''));
  v_count integer := coalesce(cardinality(p_question_ids), 0);
begin
  if v_user_id is null then
    raise exception 'Authentication is required to reserve New-only questions'
      using errcode = '28000';
  end if;

  if v_exam_id !~ '^[A-Za-z0-9:_-]{2,80}$' then
    raise exception 'Invalid exam identifier'
      using errcode = '22023';
  end if;

  if v_count < 1 or v_count > 100 then
    raise exception 'A reservation batch must contain between 1 and 100 question IDs'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(p_question_ids) as candidate(question_id)
    where candidate.question_id is null
       or candidate.question_id !~ '^[A-Za-z0-9:_-]{3,180}$'
  ) then
    raise exception 'Invalid question identifier'
      using errcode = '22023';
  end if;

  return query
  with input_ids as (
    select candidate.question_id as candidate_question_id, candidate.ordinality
    from unnest(p_question_ids) with ordinality as candidate(question_id, ordinality)
  ),
  unique_ids as (
    select input_ids.candidate_question_id, min(input_ids.ordinality) as ordinality
    from input_ids
    group by input_ids.candidate_question_id
  ),
  eligible_ids as (
    select unique_ids.candidate_question_id, unique_ids.ordinality
    from unique_ids
    where not exists (
      select 1
      from public.test_bank_learning_events as learning_event
      where learning_event.user_id = v_user_id
        and learning_event.exam_id = v_exam_id
        and learning_event.question_id = unique_ids.candidate_question_id
    )
  ),
  inserted as (
    insert into public.test_bank_new_question_claims (user_id, exam_id, question_id)
    select v_user_id, v_exam_id, eligible_ids.candidate_question_id
    from eligible_ids
    on conflict on constraint test_bank_new_question_claims_pkey do nothing
    returning test_bank_new_question_claims.question_id as accepted_question_id
  )
  select inserted.accepted_question_id as question_id
  from inserted
  join eligible_ids on eligible_ids.candidate_question_id = inserted.accepted_question_id
  order by eligible_ids.ordinality;
end;
$$;

revoke all on function public.reserve_test_bank_new_questions(text, text[]) from public, anon, authenticated;
grant execute on function public.reserve_test_bank_new_questions(text, text[]) to authenticated;

comment on function public.reserve_test_bank_new_questions(text, text[]) is
  'Atomically claims candidate New-only IDs for auth.uid(), excluding every question already present in the durable learning-event ledger.';

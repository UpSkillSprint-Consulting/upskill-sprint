-- Retakes promise the exact question count from the completed attempt. A normal
-- New-only start may legitimately serve a smaller pool, but a retake must not
-- permanently claim a partial set and then fail after those questions have
-- already been removed from the learner's New-only pool.
--
-- This separate RPC reserves exactly p_required_count IDs or raises before the
-- transaction commits. The account/exam advisory lock serializes concurrent
-- phone/laptop retakes for the same learner, so the availability check and
-- insert are one atomic decision.
create or replace function public.reserve_test_bank_new_questions_exact(
  p_exam_id text,
  p_question_ids text[],
  p_required_count integer
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
  v_candidate_count integer := coalesce(cardinality(p_question_ids), 0);
  v_required_count integer := coalesce(p_required_count, 0);
  v_selected_ids text[] := array[]::text[];
  v_inserted_count integer := 0;
begin
  if v_user_id is null then
    raise exception 'Authentication is required to reserve New-only questions'
      using errcode = '28000';
  end if;

  if v_exam_id !~ '^[A-Za-z0-9:_-]{2,80}$' then
    raise exception 'Invalid exam identifier'
      using errcode = '22023';
  end if;

  if v_candidate_count < 1 or v_candidate_count > 100 then
    raise exception 'A reservation batch must contain between 1 and 100 question IDs'
      using errcode = '22023';
  end if;

  if v_required_count < 1 or v_required_count > 100 or v_required_count > v_candidate_count then
    raise exception 'The exact reservation count must be between 1 and the candidate count'
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

  -- A hash collision only serializes unrelated reservations briefly; it cannot
  -- mix account data. The lock is released automatically at transaction end.
  perform pg_advisory_xact_lock(
    hashtextextended(v_user_id::text || '|' || v_exam_id, 0)
  );

  select coalesce(array_agg(eligible.candidate_question_id order by eligible.ordinality), array[]::text[])
  into v_selected_ids
  from (
    with input_ids as (
      select candidate.question_id as candidate_question_id, candidate.ordinality
      from unnest(p_question_ids) with ordinality as candidate(question_id, ordinality)
    ),
    unique_ids as (
      select input_ids.candidate_question_id, min(input_ids.ordinality) as ordinality
      from input_ids
      group by input_ids.candidate_question_id
    )
    select unique_ids.candidate_question_id, unique_ids.ordinality
    from unique_ids
    where not exists (
      select 1
      from public.test_bank_new_question_claims as claim
      where claim.user_id = v_user_id
        and claim.exam_id = v_exam_id
        and claim.question_id = unique_ids.candidate_question_id
    )
      and not exists (
        select 1
        from public.test_bank_learning_events as learning_event
        where learning_event.user_id = v_user_id
          and learning_event.exam_id = v_exam_id
          and learning_event.question_id = unique_ids.candidate_question_id
      )
    order by unique_ids.ordinality
    limit v_required_count
  ) as eligible;

  if cardinality(v_selected_ids) <> v_required_count then
    raise exception 'Exact New-only retake requires % questions, but only % remain',
      v_required_count, cardinality(v_selected_ids)
      using errcode = 'P0001';
  end if;

  insert into public.test_bank_new_question_claims (user_id, exam_id, question_id)
  select v_user_id, v_exam_id, selected.question_id
  from unnest(v_selected_ids) with ordinality as selected(question_id, ordinality)
  order by selected.ordinality
  on conflict on constraint test_bank_new_question_claims_pkey do nothing;

  get diagnostics v_inserted_count = row_count;
  if v_inserted_count <> v_required_count then
    -- This should be unreachable under the account/exam transaction lock, but
    -- raising here guarantees that an unexpected conflict rolls back every ID.
    raise exception 'Exact New-only retake reservation conflicted; no questions were claimed'
      using errcode = 'P0001';
  end if;

  return query
  select selected.question_id
  from unnest(v_selected_ids) with ordinality as selected(question_id, ordinality)
  order by selected.ordinality;
end;
$$;

revoke all on function public.reserve_test_bank_new_questions_exact(text, text[], integer)
  from public, anon, authenticated;
grant execute on function public.reserve_test_bank_new_questions_exact(text, text[], integer)
  to authenticated;

comment on function public.reserve_test_bank_new_questions_exact(text, text[], integer) is
  'Atomically claims exactly the requested New-only retake count for auth.uid(); any shortfall rolls back the whole reservation.';

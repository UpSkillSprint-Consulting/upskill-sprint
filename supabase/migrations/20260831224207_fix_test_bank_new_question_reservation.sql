-- The original reservation function used a column-list ON CONFLICT target.
-- In PL/pgSQL, the table's `question_id` column then collided with the
-- function's `returns table (question_id text)` output variable at runtime.
-- Target the named primary-key constraint so PostgreSQL does not need to
-- resolve those identifiers as PL/pgSQL variables.

create or replace function public.reserve_test_bank_new_questions(
  p_exam_id text,
  p_question_ids text[]
)
returns table (question_id text)
language plpgsql
security definer
set search_path = ''
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
  inserted as (
    insert into public.test_bank_new_question_claims (user_id, exam_id, question_id)
    select v_user_id, v_exam_id, unique_ids.candidate_question_id
    from unique_ids
    on conflict on constraint test_bank_new_question_claims_pkey do nothing
    returning test_bank_new_question_claims.question_id as accepted_question_id
  )
  select inserted.accepted_question_id as question_id
  from inserted
  join unique_ids on unique_ids.candidate_question_id = inserted.accepted_question_id
  order by unique_ids.ordinality;
end;
$$;

revoke all on function public.reserve_test_bank_new_questions(text, text[]) from public, anon, authenticated;
grant execute on function public.reserve_test_bank_new_questions(text, text[]) to authenticated;

comment on function public.reserve_test_bank_new_questions(text, text[]) is
  'Atomically claims candidate New-only question IDs for auth.uid(); returns only IDs accepted by the account-owned unique key.';

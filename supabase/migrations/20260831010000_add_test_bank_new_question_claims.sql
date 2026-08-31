-- A learner can receive a question as "new" exactly once across every signed-in
-- device.  The append-only learning-event ledger records the resulting
-- exposure/answer evidence; this compact claim table closes the race between a
-- fresh ledger read on one device and a concurrent draw on another device.
--
-- Claims are intentionally permanent.  A successful reservation means the
-- question was selected for the learner, so releasing it after a tab closes
-- would reintroduce the duplicate-question race that New-only promises to
-- prevent.
create table if not exists public.test_bank_new_question_claims (
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id text not null,
  question_id text not null,
  reserved_at timestamptz not null default now(),
  primary key (user_id, exam_id, question_id),
  constraint test_bank_new_question_claims_exam_id_length
    check (char_length(exam_id) between 2 and 80),
  constraint test_bank_new_question_claims_question_id_length
    check (char_length(question_id) between 3 and 180)
);

comment on table public.test_bank_new_question_claims is
  'Permanent account-owned New-only claims. The unique key atomically prevents a question being handed to two devices.';

alter table public.test_bank_new_question_claims enable row level security;

-- The browser has no direct table access.  It can only reserve IDs through
-- the narrowly-scoped RPC below; this prevents callers from reading, changing,
-- or deleting account claim history through the Data API.
revoke all on table public.test_bank_new_question_claims from public, anon, authenticated;

-- This SECURITY DEFINER RPC is necessary because the table itself deliberately
-- has no browser grants.  It has no user-id parameter: the authenticated JWT's
-- auth.uid() is the sole ownership source.  The fixed empty search_path prevents
-- a caller-controlled object from shadowing a referenced relation/function.
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

  -- The browser requests no more than the largest supported quiz size.  Keep
  -- the RPC bounded even if an abusive caller bypasses that UI.
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

  -- `ON CONFLICT DO NOTHING` uses the account-owned primary key as an atomic
  -- compare-and-claim operation.  Under concurrent device calls PostgreSQL
  -- waits for the competing insert, then returns an ID to exactly one caller.
  -- Preserve the caller's candidate order, while de-duplicating a malformed
  -- repeated ID in the same request before INSERT.
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

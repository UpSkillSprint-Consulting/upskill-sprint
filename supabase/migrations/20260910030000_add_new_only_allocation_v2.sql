-- Segment 16 — authoritative New-only allocation lifecycle v2.
--
-- This is additive to the permanent test_bank_new_question_claims exclusion
-- table. Reservations are observable lifecycle metadata; abandoning a
-- reservation never deletes a claim and therefore never weakens lifetime
-- New-only exclusion.

create table if not exists public.test_bank_new_only_reservations (
  reservation_id uuid primary key,
  user_id uuid not null,
  exam_id text not null,
  planned_session_id text not null,
  request_id text not null,
  state text not null default 'reserved'
    check (state in ('reserved','delivered','displayed','answered','abandoned')),
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  unique (user_id, exam_id, planned_session_id)
);

create table if not exists public.test_bank_new_only_reservation_items (
  reservation_id uuid not null references public.test_bank_new_only_reservations(reservation_id) on delete cascade,
  ordinal integer not null check (ordinal > 0),
  question_id text not null,
  state text not null default 'reserved'
    check (state in ('reserved','delivered','displayed','answered')),
  updated_at timestamptz not null default clock_timestamp(),
  primary key (reservation_id, question_id),
  unique (reservation_id, ordinal)
);

create index if not exists test_bank_new_only_reservations_owner_exam_idx
  on public.test_bank_new_only_reservations(user_id, exam_id, created_at desc);

alter table public.test_bank_new_only_reservations enable row level security;
alter table public.test_bank_new_only_reservation_items enable row level security;

revoke all on table public.test_bank_new_only_reservations from public, anon, authenticated;
revoke all on table public.test_bank_new_only_reservation_items from public, anon, authenticated;

-- A deterministic UUID keeps a planned-session reservation idempotent without
-- relying on an extension-provided random UUID generator.
create or replace function public.test_bank_new_only_reservation_uuid_v2(
  p_user_id uuid,
  p_exam_id text,
  p_planned_session_id text
)
returns uuid
language sql
immutable
security invoker
set search_path = ''
as $$
  select (
    substr(md5(p_user_id::text || ':' || p_exam_id || ':' || p_planned_session_id),1,8) || '-' ||
    substr(md5(p_user_id::text || ':' || p_exam_id || ':' || p_planned_session_id),9,4) || '-' ||
    substr(md5(p_user_id::text || ':' || p_exam_id || ':' || p_planned_session_id),13,4) || '-' ||
    substr(md5(p_user_id::text || ':' || p_exam_id || ':' || p_planned_session_id),17,4) || '-' ||
    substr(md5(p_user_id::text || ':' || p_exam_id || ':' || p_planned_session_id),21,12)
  )::uuid;
$$;

revoke all on function public.test_bank_new_only_reservation_uuid_v2(uuid,text,text) from public, anon, authenticated;

create or replace function public.reserve_test_bank_new_questions_v2(
  p_exam_id text,
  p_planned_session_id text,
  p_request_id text,
  p_question_ids text[]
)
returns table (
  reservation_id uuid,
  planned_session_id text,
  question_id text,
  item_state text,
  reused boolean
)
language plpgsql
security definer
set search_path = ''
set statement_timeout = '5s'
as $$
declare
  v_user_id uuid := auth.uid();
  v_exam_id text := btrim(coalesce(p_exam_id,''));
  v_planned_session_id text := btrim(coalesce(p_planned_session_id,''));
  v_request_id text := btrim(coalesce(p_request_id,''));
  v_count integer := coalesce(cardinality(p_question_ids),0);
  v_reservation_id uuid;
  v_existing uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication is required to reserve New-only questions' using errcode='28000';
  end if;
  if v_exam_id !~ '^[A-Za-z0-9:_-]{2,80}$' then
    raise exception 'Invalid exam identifier' using errcode='22023';
  end if;
  if v_planned_session_id !~ '^[A-Za-z0-9:_-]{3,180}$' then
    raise exception 'Invalid planned session identifier' using errcode='22023';
  end if;
  if v_request_id !~ '^[A-Za-z0-9:_-]{3,180}$' then
    raise exception 'Invalid reservation request identifier' using errcode='22023';
  end if;
  if v_count < 1 or v_count > 100 then
    raise exception 'A reservation batch must contain between 1 and 100 question IDs' using errcode='22023';
  end if;
  if exists (
    select 1 from unnest(p_question_ids) candidate(question_id)
    where candidate.question_id is null
       or candidate.question_id !~ '^[A-Za-z0-9:_-]{3,180}$'
  ) then
    raise exception 'Invalid question identifier' using errcode='22023';
  end if;

  -- Serialize allocations for one owner/exam. This closes the cross-device
  -- eligibility-to-claim race before the permanent claim PK is consulted.
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':' || v_exam_id, 0));

  select r.reservation_id into v_existing
  from public.test_bank_new_only_reservations r
  where r.user_id=v_user_id
    and r.exam_id=v_exam_id
    and r.planned_session_id=v_planned_session_id
  for update;

  if v_existing is not null then
    return query
    select r.reservation_id, r.planned_session_id, i.question_id, i.state, true
    from public.test_bank_new_only_reservations r
    join public.test_bank_new_only_reservation_items i on i.reservation_id=r.reservation_id
    where r.reservation_id=v_existing
    order by i.ordinal;
    return;
  end if;

  v_reservation_id := public.test_bank_new_only_reservation_uuid_v2(v_user_id,v_exam_id,v_planned_session_id);

  insert into public.test_bank_new_only_reservations(
    reservation_id,user_id,exam_id,planned_session_id,request_id,state
  ) values (
    v_reservation_id,v_user_id,v_exam_id,v_planned_session_id,v_request_id,'reserved'
  );

  with input_ids as (
    select candidate.question_id, candidate.ordinality
    from unnest(p_question_ids) with ordinality candidate(question_id, ordinality)
  ), unique_ids as (
    select question_id, min(ordinality)::integer ordinal
    from input_ids
    group by question_id
  ), eligible as (
    select u.question_id,u.ordinal
    from unique_ids u
    where not exists (
      select 1 from public.test_bank_new_question_claims c
      where c.user_id=v_user_id and c.exam_id=v_exam_id and c.question_id=u.question_id
    )
    and not exists (
      select 1 from public.test_bank_learning_events e
      where e.user_id=v_user_id and e.exam_id=v_exam_id and e.question_id=u.question_id
    )
  ), claimed as (
    insert into public.test_bank_new_question_claims(user_id,exam_id,question_id)
    select v_user_id,v_exam_id,e.question_id
    from eligible e
    order by e.ordinal
    on conflict on constraint test_bank_new_question_claims_pkey do nothing
    returning question_id
  )
  insert into public.test_bank_new_only_reservation_items(reservation_id,ordinal,question_id,state)
  select v_reservation_id,e.ordinal,e.question_id,'reserved'
  from eligible e
  join claimed c using(question_id)
  order by e.ordinal;

  if not exists (
    select 1 from public.test_bank_new_only_reservation_items i
    where i.reservation_id=v_reservation_id
  ) then
    delete from public.test_bank_new_only_reservations where reservation_id=v_reservation_id;
    raise exception 'NEW_ONLY_EXHAUSTED: no unreserved questions remain for this allocation'
      using errcode='P0001';
  end if;

  return query
  select r.reservation_id,r.planned_session_id,i.question_id,i.state,false
  from public.test_bank_new_only_reservations r
  join public.test_bank_new_only_reservation_items i on i.reservation_id=r.reservation_id
  where r.reservation_id=v_reservation_id
  order by i.ordinal;
end;
$$;

revoke all on function public.reserve_test_bank_new_questions_v2(text,text,text,text[]) from public, anon, authenticated;
grant execute on function public.reserve_test_bank_new_questions_v2(text,text,text,text[]) to authenticated;

create or replace function public.mark_test_bank_new_only_reservation_v2(
  p_reservation_id uuid,
  p_state text,
  p_question_id text default null
)
returns table(reservation_id uuid, reservation_state text, question_id text, item_state text)
language plpgsql
security definer
set search_path = ''
set statement_timeout = '5s'
as $$
declare
  v_user_id uuid := auth.uid();
  v_state text := btrim(coalesce(p_state,''));
  v_owned uuid;
  v_rank integer;
begin
  if v_user_id is null then raise exception 'Authentication is required' using errcode='28000'; end if;
  if v_state not in ('delivered','displayed','answered','abandoned') then
    raise exception 'Invalid reservation state' using errcode='22023';
  end if;

  select r.reservation_id into v_owned
  from public.test_bank_new_only_reservations r
  where r.reservation_id=p_reservation_id and r.user_id=v_user_id
  for update;
  if v_owned is null then raise exception 'Reservation not found' using errcode='42501'; end if;

  if v_state='abandoned' then
    update public.test_bank_new_only_reservations
      set state='abandoned', updated_at=clock_timestamp()
      where reservation_id=v_owned and state not in ('answered');
  else
    v_rank := case v_state when 'delivered' then 2 when 'displayed' then 3 when 'answered' then 4 end;
    update public.test_bank_new_only_reservation_items i
      set state=v_state, updated_at=clock_timestamp()
      where i.reservation_id=v_owned
        and (p_question_id is null or i.question_id=p_question_id)
        and (case i.state when 'reserved' then 1 when 'delivered' then 2 when 'displayed' then 3 when 'answered' then 4 end) < v_rank;

    update public.test_bank_new_only_reservations r
      set state=(
        select case max(case i.state when 'reserved' then 1 when 'delivered' then 2 when 'displayed' then 3 when 'answered' then 4 end)
          when 4 then 'answered' when 3 then 'displayed' when 2 then 'delivered' else 'reserved' end
        from public.test_bank_new_only_reservation_items i where i.reservation_id=v_owned
      ), updated_at=clock_timestamp()
      where r.reservation_id=v_owned and r.state<>'abandoned';
  end if;

  return query
  select r.reservation_id,r.state,i.question_id,i.state
  from public.test_bank_new_only_reservations r
  join public.test_bank_new_only_reservation_items i on i.reservation_id=r.reservation_id
  where r.reservation_id=v_owned
  order by i.ordinal;
end;
$$;

revoke all on function public.mark_test_bank_new_only_reservation_v2(uuid,text,text) from public, anon, authenticated;
grant execute on function public.mark_test_bank_new_only_reservation_v2(uuid,text,text) to authenticated;

create or replace function public.fetch_test_bank_new_only_reservation_v2(
  p_planned_session_id text
)
returns table(reservation_id uuid, exam_id text, planned_session_id text, reservation_state text, question_id text, item_state text, ordinal integer)
language sql
security definer
set search_path = ''
set statement_timeout = '5s'
as $$
  select r.reservation_id,r.exam_id,r.planned_session_id,r.state,i.question_id,i.state,i.ordinal
  from public.test_bank_new_only_reservations r
  join public.test_bank_new_only_reservation_items i on i.reservation_id=r.reservation_id
  where r.user_id=auth.uid() and r.planned_session_id=p_planned_session_id
  order by i.ordinal;
$$;

revoke all on function public.fetch_test_bank_new_only_reservation_v2(text) from public, anon, authenticated;
grant execute on function public.fetch_test_bank_new_only_reservation_v2(text) to authenticated;

comment on function public.reserve_test_bank_new_questions_v2(text,text,text,text[]) is
  'Segment 16 authoritative New-only allocation. Serializes by owner/exam, permanently claims accepted IDs, and reuses only the same planned-session reservation.';
comment on function public.mark_test_bank_new_only_reservation_v2(uuid,text,text) is
  'Advances reservation/item lifecycle monotonically. Abandonment never deletes permanent New-only claims.';

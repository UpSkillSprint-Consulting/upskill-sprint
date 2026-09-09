begin;

-- Segment 14 uses per-user monotonic sync sequences rather than browser clocks,
-- wall-clock timestamps, or OFFSET pagination. Each writer takes a
-- transaction-scoped advisory lock before allocating the next sequence. That
-- lock is held until commit/rollback, so a later visible sequence cannot race
-- ahead of an earlier uncommitted write for the same user/channel.
create table if not exists public.test_bank_sync_counters (
  user_id uuid primary key references auth.users(id) on delete cascade,
  learning_seq bigint not null default 0 check (learning_seq >= 0),
  progress_seq bigint not null default 0 check (progress_seq >= 0)
);

alter table public.test_bank_sync_counters enable row level security;
revoke all on table public.test_bank_sync_counters from public, anon, authenticated;

-- Replace the older timestamp-only progress trigger before backfilling so the
-- migration itself does not rewrite historical updated_at values.
drop trigger if exists touch_test_bank_progress_device_updated_at on public.test_bank_progress_devices;

alter table public.test_bank_learning_events
  add column if not exists sync_seq bigint;
alter table public.test_bank_progress_devices
  add column if not exists sync_seq bigint;

-- Existing rows receive deterministic per-user sequence values. This is a
-- one-time compatibility bridge; once the triggers below are active every new
-- value is allocated transactionally.
with ranked as (
  select ctid,
         row_number() over (
           partition by user_id
           order by received_at asc, event_id asc
         )::bigint as rn
  from public.test_bank_learning_events
  where sync_seq is null
)
update public.test_bank_learning_events as target
set sync_seq = ranked.rn
from ranked
where target.ctid = ranked.ctid;

with ranked as (
  select ctid,
         row_number() over (
           partition by user_id
           order by updated_at asc, device_id asc
         )::bigint as rn
  from public.test_bank_progress_devices
  where sync_seq is null
)
update public.test_bank_progress_devices as target
set sync_seq = ranked.rn
from ranked
where target.ctid = ranked.ctid;

alter table public.test_bank_learning_events
  alter column sync_seq set not null;
alter table public.test_bank_progress_devices
  alter column sync_seq set not null;

create unique index if not exists test_bank_learning_events_user_sync_seq_idx
  on public.test_bank_learning_events (user_id, sync_seq);
create unique index if not exists test_bank_progress_devices_user_sync_seq_idx
  on public.test_bank_progress_devices (user_id, sync_seq);

insert into public.test_bank_sync_counters (user_id, learning_seq, progress_seq)
select user_id, max(sync_seq), 0
from public.test_bank_learning_events
group by user_id
on conflict (user_id) do update
set learning_seq = greatest(public.test_bank_sync_counters.learning_seq, excluded.learning_seq);

insert into public.test_bank_sync_counters (user_id, learning_seq, progress_seq)
select user_id, 0, max(sync_seq)
from public.test_bank_progress_devices
group by user_id
on conflict (user_id) do update
set progress_seq = greatest(public.test_bank_sync_counters.progress_seq, excluded.progress_seq);

create or replace function public.assign_test_bank_learning_sync_seq_v1()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('tb-learning:' || new.user_id::text, 0)
  );

  insert into public.test_bank_sync_counters (user_id, learning_seq, progress_seq)
  values (new.user_id, 1, 0)
  on conflict (user_id) do update
  set learning_seq = public.test_bank_sync_counters.learning_seq + 1
  returning learning_seq into new.sync_seq;

  -- Keep received_at useful for audit/UI while sync ordering is owned by
  -- sync_seq rather than transaction-start time or a browser clock.
  new.received_at := pg_catalog.clock_timestamp();
  return new;
end;
$$;

revoke all on function public.assign_test_bank_learning_sync_seq_v1()
  from public, anon, authenticated;

drop trigger if exists assign_test_bank_learning_sync_seq_v1 on public.test_bank_learning_events;
create trigger assign_test_bank_learning_sync_seq_v1
before insert on public.test_bank_learning_events
for each row execute function public.assign_test_bank_learning_sync_seq_v1();

create or replace function public.assign_test_bank_progress_sync_seq_v1()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('tb-progress:' || new.user_id::text, 0)
  );

  insert into public.test_bank_sync_counters (user_id, learning_seq, progress_seq)
  values (new.user_id, 0, 1)
  on conflict (user_id) do update
  set progress_seq = public.test_bank_sync_counters.progress_seq + 1
  returning progress_seq into new.sync_seq;

  new.updated_at := pg_catalog.clock_timestamp();
  return new;
end;
$$;

revoke all on function public.assign_test_bank_progress_sync_seq_v1()
  from public, anon, authenticated;

drop trigger if exists assign_test_bank_progress_sync_seq_v1 on public.test_bank_progress_devices;
create trigger assign_test_bank_progress_sync_seq_v1
before insert or update on public.test_bank_progress_devices
for each row execute function public.assign_test_bank_progress_sync_seq_v1();

create or replace function public.fetch_test_bank_learning_events_incremental_v1(
  p_after_sync_seq bigint default null,
  p_limit integer default 500
)
returns table (
  sync_seq bigint,
  event_id text,
  device_id text,
  event_type text,
  exam_id text,
  session_id text,
  question_id text,
  occurred_at timestamptz,
  received_at timestamptz,
  payload jsonb
)
language plpgsql
security invoker
set search_path = ''
set statement_timeout = '8s'
as $$
declare
  v_user_id uuid := auth.uid();
  v_limit integer := coalesce(p_limit, 500);
begin
  if v_user_id is null then
    raise exception 'Authentication is required for incremental learning sync'
      using errcode = '28000';
  end if;
  if v_limit < 1 or v_limit > 500 then
    raise exception 'Incremental learning page size must be between 1 and 500'
      using errcode = '22023';
  end if;
  if p_after_sync_seq is not null and p_after_sync_seq < 0 then
    raise exception 'Invalid learning sync cursor'
      using errcode = '22023';
  end if;

  return query
  select
    e.sync_seq,
    e.event_id,
    e.device_id,
    e.event_type,
    e.exam_id,
    e.session_id,
    e.question_id,
    e.occurred_at,
    e.received_at,
    e.payload
  from public.test_bank_learning_events as e
  where e.user_id = v_user_id
    and (p_after_sync_seq is null or e.sync_seq > p_after_sync_seq)
  order by e.sync_seq asc
  limit v_limit;
end;
$$;

revoke all on function public.fetch_test_bank_learning_events_incremental_v1(bigint, integer)
  from public, anon, authenticated;
grant execute on function public.fetch_test_bank_learning_events_incremental_v1(bigint, integer)
  to authenticated;

comment on function public.fetch_test_bank_learning_events_incremental_v1(bigint, integer) is
  'Owner-scoped Segment 14 learning-event catch-up ordered by a transaction-serialized server sequence. NULL safely replays all legacy rows once.';

create or replace function public.fetch_test_bank_progress_devices_incremental_v1(
  p_after_sync_seq bigint default null,
  p_limit integer default 100
)
returns table (
  sync_seq bigint,
  device_id text,
  payload jsonb,
  updated_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
set statement_timeout = '8s'
as $$
declare
  v_user_id uuid := auth.uid();
  v_limit integer := coalesce(p_limit, 100);
begin
  if v_user_id is null then
    raise exception 'Authentication is required for incremental progress sync'
      using errcode = '28000';
  end if;
  if v_limit < 1 or v_limit > 100 then
    raise exception 'Incremental progress page size must be between 1 and 100'
      using errcode = '22023';
  end if;
  if p_after_sync_seq is not null and p_after_sync_seq < 0 then
    raise exception 'Invalid progress sync cursor'
      using errcode = '22023';
  end if;

  return query
  select p.sync_seq, p.device_id, p.payload, p.updated_at
  from public.test_bank_progress_devices as p
  where p.user_id = v_user_id
    and (p_after_sync_seq is null or p.sync_seq > p_after_sync_seq)
  order by p.sync_seq asc
  limit v_limit;
end;
$$;

revoke all on function public.fetch_test_bank_progress_devices_incremental_v1(bigint, integer)
  from public, anon, authenticated;
grant execute on function public.fetch_test_bank_progress_devices_incremental_v1(bigint, integer)
  to authenticated;

comment on function public.fetch_test_bank_progress_devices_incremental_v1(bigint, integer) is
  'Owner-scoped Segment 14 progress catch-up ordered by a transaction-serialized server sequence. Browser clocks are never sync cursors.';

commit;

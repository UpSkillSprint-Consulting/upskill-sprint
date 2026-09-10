-- Segment 18 — authenticated learner-data deletion authority and stale-device resurrection guards.
-- Additive to Segments 01–17. It does not change grading, mastery, timer,
-- handoff, or New-only semantics except when a learner explicitly purges all
-- exam-learning data for their own account.
begin;

create table if not exists public.test_bank_data_control (
  user_id uuid primary key references auth.users(id) on delete cascade,
  generation bigint not null default 0 check (generation >= 0),
  purged_at timestamptz,
  updated_at timestamptz not null default clock_timestamp(),
  check ((generation = 0) = (purged_at is null))
);

alter table public.test_bank_data_control enable row level security;
revoke all on table public.test_bank_data_control from public, anon, authenticated;
grant select on table public.test_bank_data_control to authenticated;
drop policy if exists owner_read on public.test_bank_data_control;
create policy owner_read on public.test_bank_data_control
for select to authenticated
using (user_id = (select auth.uid()));

alter table public.test_bank_progress_devices
  add column if not exists security_generation bigint not null default 0
  check (security_generation >= 0);

create or replace function private.test_bank_security_tombstone_payload_v1(
  p_generation bigint,
  p_purged_at timestamptz
) returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'schemaVersion', 2,
    'values', jsonb_build_object(
      'tb-adaptive-security-control', jsonb_build_object(
        'attempts', jsonb_build_array(),
        'purgeGeneration', p_generation,
        'purgedAt', p_purged_at
      )
    ),
    'resets', jsonb_build_object(
      'mastery-exam:cssbb', floor(extract(epoch from p_purged_at) * 1000)::bigint,
      'mastery-exam:cqe', floor(extract(epoch from p_purged_at) * 1000)::bigint,
      'mastery-exam:cssgb', floor(extract(epoch from p_purged_at) * 1000)::bigint,
      'mastery-exam:cmq', floor(extract(epoch from p_purged_at) * 1000)::bigint,
      'mastery-exam:mbb', floor(extract(epoch from p_purged_at) * 1000)::bigint
    )
  );
$$;
revoke all on function private.test_bank_security_tombstone_payload_v1(bigint,timestamptz)
  from public, anon, authenticated;

create or replace function private.test_bank_progress_is_clean_for_generation_v1(
  p_payload jsonb,
  p_generation bigint
) returns boolean
language sql
immutable
security invoker
set search_path = ''
as $$
  select coalesce(jsonb_typeof(p_payload), '') = 'object'
    and coalesce((p_payload #>> '{values,tb-adaptive-security-control,purgeGeneration}')::bigint, -1) = p_generation
    and coalesce(jsonb_object_length(coalesce(p_payload->'values','{}'::jsonb) - 'tb-adaptive-security-control'), 0) = 0;
$$;
revoke all on function private.test_bank_progress_is_clean_for_generation_v1(jsonb,bigint)
  from public, anon, authenticated;

create or replace function public.test_bank_guard_progress_generation_v1()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  ctl public.test_bank_data_control;
  marker bigint;
begin
  if current_setting('upskill.test_bank_security_purge', true) = 'on' then
    return new;
  end if;
  select * into ctl from public.test_bank_data_control where user_id = new.user_id;
  if ctl.user_id is null or ctl.generation = 0 then
    return new;
  end if;
  begin
    marker := (new.payload #>> '{values,tb-adaptive-security-control,purgeGeneration}')::bigint;
  exception when others then
    marker := null;
  end;
  if marker is distinct from ctl.generation then
    raise exception 'STALE_PROGRESS_GENERATION: refresh account state after learning-data deletion'
      using errcode = '40001';
  end if;
  if coalesce(new.security_generation, 0) < ctl.generation then
    if private.test_bank_progress_is_clean_for_generation_v1(new.payload, ctl.generation) then
      new.security_generation := ctl.generation;
    else
      new.payload := private.test_bank_security_tombstone_payload_v1(ctl.generation, ctl.purged_at);
      -- Keep the row behind the generation until the client proves it has
      -- discarded old values. This prevents an unupgraded/offline browser
      -- from uploading the same pre-purge snapshot on its next sync.
      new.security_generation := greatest(0, ctl.generation - 1);
    end if;
  else
    new.security_generation := ctl.generation;
  end if;
  return new;
end;
$$;
revoke all on function public.test_bank_guard_progress_generation_v1()
  from public, anon, authenticated;

drop trigger if exists aa_test_bank_guard_progress_generation_v1 on public.test_bank_progress_devices;
create trigger aa_test_bank_guard_progress_generation_v1
before insert or update on public.test_bank_progress_devices
for each row execute function public.test_bank_guard_progress_generation_v1();

create or replace function public.test_bank_guard_post_purge_event_v1()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  ctl public.test_bank_data_control;
begin
  select * into ctl from public.test_bank_data_control where user_id = new.user_id;
  if ctl.user_id is not null and ctl.purged_at is not null and new.occurred_at <= ctl.purged_at then
    raise exception 'STALE_LEARNING_EVENT_AFTER_PURGE: refresh this device before syncing old work'
      using errcode = '40001';
  end if;
  return new;
end;
$$;
revoke all on function public.test_bank_guard_post_purge_event_v1()
  from public, anon, authenticated;

drop trigger if exists aa_test_bank_guard_post_purge_event_v1 on public.test_bank_learning_events;
create trigger aa_test_bank_guard_post_purge_event_v1
before insert on public.test_bank_learning_events
for each row execute function public.test_bank_guard_post_purge_event_v1();

create or replace function public.fetch_test_bank_data_control_v1()
returns table(generation bigint, purged_at timestamptz, server_time timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
set statement_timeout = '5s'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Authentication is required' using errcode = '28000';
  end if;
  return query
  select coalesce(c.generation,0), c.purged_at, clock_timestamp()
  from (select uid as user_id) u
  left join public.test_bank_data_control c on c.user_id = u.user_id;
end;
$$;
revoke all on function public.fetch_test_bank_data_control_v1() from public, anon, authenticated;
grant execute on function public.fetch_test_bank_data_control_v1() to authenticated;

create or replace function public.delete_test_bank_learning_data_v1(p_expected_generation bigint)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
set statement_timeout = '15s'
as $$
declare
  uid uuid := auth.uid();
  ctl public.test_bank_data_control;
  next_generation bigint;
  purge_time timestamptz := clock_timestamp();
  tombstone jsonb;
  deleted_events bigint := 0;
  deleted_claims bigint := 0;
  deleted_sessions bigint := 0;
  deleted_reservations bigint := 0;
begin
  if uid is null then
    raise exception 'Authentication is required' using errcode = '28000';
  end if;
  if p_expected_generation is null or p_expected_generation < 0 then
    raise exception 'Invalid expected data generation' using errcode = '22023';
  end if;

  insert into public.test_bank_data_control(user_id,generation,purged_at)
  values(uid,0,null)
  on conflict(user_id) do nothing;
  select * into strict ctl from public.test_bank_data_control where user_id=uid for update;
  if ctl.generation <> p_expected_generation then
    raise exception 'STALE_DATA_GENERATION: deletion state changed; refresh before retrying'
      using errcode = '40001';
  end if;
  next_generation := ctl.generation + 1;
  tombstone := private.test_bank_security_tombstone_payload_v1(next_generation,purge_time);

  perform set_config('upskill.test_bank_security_purge','on',true);

  delete from public.test_bank_new_only_reservations where user_id=uid;
  get diagnostics deleted_reservations = row_count;

  delete from public.test_bank_new_question_claims where user_id=uid;
  get diagnostics deleted_claims = row_count;

  delete from public.test_bank_learning_events where user_id=uid;
  get diagnostics deleted_events = row_count;

  -- Session-owned rows introduced by Segments 05, 07 and 15 cascade from the
  -- immutable session-version owner row. This removes results, runtime,
  -- receipts, items and handoff checkpoints without touching catalog content.
  delete from public.test_bank_session_versions where user_id=uid;
  get diagnostics deleted_sessions = row_count;

  -- Progress rows are retained as server-authored tombstones so an offline
  -- browser sees the purge before it can overwrite the account snapshot.
  update public.test_bank_progress_devices
     set payload=tombstone,
         security_generation=greatest(0,next_generation-1),
         updated_at=purge_time
   where user_id=uid;

  insert into public.test_bank_progress_devices(user_id,device_id,payload,updated_at,security_generation)
  values(uid,'security-control-v1',tombstone,purge_time,next_generation)
  on conflict(user_id,device_id) do update
    set payload=excluded.payload,
        updated_at=excluded.updated_at,
        security_generation=excluded.security_generation;

  update public.test_bank_data_control
     set generation=next_generation,purged_at=purge_time,updated_at=purge_time
   where user_id=uid;

  return jsonb_build_object(
    'generation',next_generation,
    'purgedAt',purge_time,
    'serverTime',clock_timestamp(),
    'deleted',jsonb_build_object(
      'learningEvents',deleted_events,
      'newOnlyClaims',deleted_claims,
      'sessionVersions',deleted_sessions,
      'newOnlyReservations',deleted_reservations
    )
  );
end;
$$;
revoke all on function public.delete_test_bank_learning_data_v1(bigint) from public, anon, authenticated;
grant execute on function public.delete_test_bank_learning_data_v1(bigint) to authenticated;

-- Segment 16 is the supported New-only API. Remove the two superseded
-- reservation entry points from the exposed authenticated API surface while
-- retaining the functions for migration/backward inspection.
revoke execute on function public.reserve_test_bank_new_questions(text,text[]) from authenticated;
revoke execute on function public.reserve_test_bank_new_questions_exact(text,text[],integer) from authenticated;

comment on table public.test_bank_data_control is
  'Segment18 owner-scoped purge generation. Survives learning-data deletion so stale offline clients cannot resurrect cleared evidence.';
comment on function public.delete_test_bank_learning_data_v1(bigint) is
  'Authenticated CAS deletion of all exam-learning evidence for auth.uid(); leaves only a purge-generation tombstone and catalog data.';
comment on function public.fetch_test_bank_data_control_v1() is
  'Returns only the signed-in learner data-generation control and server time.';

commit;

-- Segment 18 review hardening — serialize purge/event races and reject stale
-- devices by a server-observed per-device generation, never by browser time.
-- This is additive to 20260910050000_add_security_reset_v1.sql.
begin;

create or replace function private.test_bank_security_advisory_key_v1(p_user_id uuid)
returns bigint
language sql
immutable
security invoker
set search_path = pg_catalog
as $$
  select pg_catalog.hashtextextended(p_user_id::text, 18018);
$$;
revoke all on function private.test_bank_security_advisory_key_v1(uuid)
  from public, anon, authenticated;

-- Every purge transaction passes through an INSERT attempt on the control row.
-- Taking the exclusive transaction advisory lock in a BEFORE trigger closes the
-- race that exists before that row has ever been created. The UPDATE trigger is
-- intentional as defense in depth for future purge implementations.
create or replace function private.test_bank_lock_data_control_purge_v1()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    private.test_bank_security_advisory_key_v1(new.user_id)
  );
  return new;
end;
$$;
revoke all on function private.test_bank_lock_data_control_purge_v1()
  from public, anon, authenticated;

drop trigger if exists aa_test_bank_lock_data_control_purge_v1
  on public.test_bank_data_control;
create trigger aa_test_bank_lock_data_control_purge_v1
before insert or update on public.test_bank_data_control
for each row execute function private.test_bank_lock_data_control_purge_v1();

-- Learning-event writers share the same owner lock. If an upload begins first,
-- the purge waits for it to commit and then deletes it. If the purge begins
-- first, the upload waits and then observes the advanced generation.
--
-- After a purge, acceptance is based on the server-stored generation of the
-- specific device progress row. A stale/offline browser cannot bypass the
-- tombstone by supplying a future occurred_at value or by having a fast clock.
create or replace function public.test_bank_guard_post_purge_event_v1()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  ctl public.test_bank_data_control;
  device_generation bigint;
begin
  perform pg_catalog.pg_advisory_xact_lock_shared(
    private.test_bank_security_advisory_key_v1(new.user_id)
  );

  select * into ctl
    from public.test_bank_data_control
   where user_id = new.user_id;

  if ctl.user_id is null or ctl.generation = 0 then
    return new;
  end if;

  select security_generation into device_generation
    from public.test_bank_progress_devices
   where user_id = new.user_id
     and device_id = new.device_id;

  if device_generation is null or device_generation < ctl.generation then
    raise exception 'STALE_LEARNING_EVENT_AFTER_PURGE: refresh this device before syncing learning events'
      using errcode = '40001';
  end if;

  return new;
end;
$$;
revoke all on function public.test_bank_guard_post_purge_event_v1()
  from public, anon, authenticated;

comment on function public.test_bank_guard_post_purge_event_v1() is
  'Segment18 stale-event guard: shared owner lock plus server-observed device generation; client occurred_at is audit metadata only.';
comment on function private.test_bank_lock_data_control_purge_v1() is
  'Segment18 purge serialization boundary. Takes the exclusive owner transaction advisory lock before a control-row insert/update.';

commit;

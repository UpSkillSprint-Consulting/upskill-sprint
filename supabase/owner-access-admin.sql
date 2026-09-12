-- Apply after access-levels.sql. Private privileged implementation; public invoker facade.
begin;
create schema if not exists access_private;
revoke all on schema access_private from public, anon, authenticated;
grant usage on schema access_private to authenticated;
create table if not exists access_private.site_owner (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists access_private.access_history (
  id bigint generated always as identity primary key,
  actor uuid not null,
  target uuid not null,
  changed_at timestamptz not null default now(),
  previous_grant jsonb,
  new_grant jsonb
);
create index if not exists access_history_target_time on access_private.access_history(target, changed_at desc);
alter table access_private.site_owner enable row level security;
alter table access_private.access_history enable row level security;
drop policy if exists "No direct client access" on access_private.site_owner;
create policy "No direct client access" on access_private.site_owner as restrictive
  for all to anon, authenticated using (false) with check (false);
drop policy if exists "No direct client access" on access_private.access_history;
create policy "No direct client access" on access_private.access_history as restrictive
  for all to anon, authenticated using (false) with check (false);
revoke all on all tables in schema access_private from public, anon, authenticated;
revoke all on all sequences in schema access_private from public, anon, authenticated;

-- Bind the confirmed account once; a later email change does not transfer ownership.
do $$
declare owner_id uuid;
begin
  if not exists(select 1 from access_private.site_owner) then
    select id into strict owner_id from auth.users
    where lower(email)='ernest.ordu@yahoo.com' and email_confirmed_at is not null;
    insert into access_private.site_owner values(owner_id);
  end if;
end $$;

create or replace function access_private.manage_access(
  operation text, account_email text, target_id uuid, new_level text, expiry timestamptz,
  expected_grant jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  actor_id uuid := auth.uid();
  target_user auth.users%rowtype;
  old_grant jsonb;
  updated_grant jsonb;
  history jsonb;
begin
  if actor_id is null or not exists(
    select 1 from access_private.site_owner o join auth.users u on u.id=o.user_id
    where o.user_id=actor_id and u.email_confirmed_at is not null
      and (u.banned_until is null or u.banned_until < now())
  ) then
    raise exception 'Only the site owner can manage account access.' using errcode='42501';
  end if;
  if operation='status' then return jsonb_build_object('owner',true); end if;
  if operation not in ('search','save') or operation is null then
    raise exception 'Invalid operation.' using errcode='22023';
  end if;
  if operation='search' then
    if account_email is null or length(btrim(account_email)) not between 3 and 254 then
      raise exception 'Enter the complete account email.' using errcode='22023';
    end if;
    select * into target_user from auth.users where lower(email)=lower(btrim(account_email));
  else
    -- Serialize saves for this account, including when no grant exists yet.
    select * into target_user from auth.users where id=target_id for update;
  end if;
  if target_user.id is null then return jsonb_build_object('found',false); end if;
  select to_jsonb(g) into old_grant from public.user_access_grants g where g.user_id=target_user.id;
  if operation='save' then
    if exists(select 1 from access_private.site_owner where user_id=target_user.id) then
      raise exception 'Owner access cannot be changed from this screen.' using errcode='42501';
    end if;
    if new_level is null or new_level not in ('registered','premium','special','administrator') then
      raise exception 'Choose a valid access level.' using errcode='22023';
    end if;
    if expiry is not null and expiry<=now() then
      raise exception 'Expiry must be in the future.' using errcode='22023';
    end if;
    if old_grant is distinct from expected_grant then
      raise exception 'This account changed. Search again before saving.' using errcode='40001';
    end if;
    insert into public.user_access_grants(user_id,access_key,expires_at,granted_at,granted_by,note)
    values(target_user.id,new_level,expiry,now(),actor_id,'Updated using owner access screen')
    on conflict(user_id) do update set access_key=excluded.access_key, expires_at=excluded.expires_at,
      granted_at=excluded.granted_at,granted_by=excluded.granted_by,note=excluded.note;
    select to_jsonb(g) into updated_grant from public.user_access_grants g where g.user_id=target_user.id;
    insert into access_private.access_history(actor,target,previous_grant,new_grant)
    values(actor_id,target_user.id,old_grant,updated_grant);
    old_grant := updated_grant;
  end if;
  select coalesce(jsonb_agg(h),'[]'::jsonb) into history from (
    select changed_at, previous_grant->>'access_key' as previous_level,
      new_grant->>'access_key' as new_level, new_grant->>'expires_at' as expires_at
    from access_private.access_history where target=target_user.id order by changed_at desc,id desc limit 10
  ) h;
  return jsonb_build_object('found',true,'user_id',target_user.id,'email',target_user.email,
    'is_owner',exists(select 1 from access_private.site_owner where user_id=target_user.id),
    'grant',old_grant,'history',history,
    'effective_level',case when old_grant is null or (old_grant->>'expires_at')::timestamptz<=now()
      then 'registered' else old_grant->>'access_key' end);
end $$;
revoke all on function access_private.manage_access(text,text,uuid,text,timestamptz,jsonb) from public,anon,authenticated;
grant execute on function access_private.manage_access(text,text,uuid,text,timestamptz,jsonb) to authenticated;
create or replace function public.owner_manage_access(
  operation text, account_email text default null, target_id uuid default null,
  new_level text default null, expiry timestamptz default null, expected_grant jsonb default null
) returns jsonb language sql security invoker set search_path = '' as $$
  select access_private.manage_access(operation,account_email,target_id,new_level,expiry,expected_grant);
$$;
revoke all on function public.owner_manage_access(text,text,uuid,text,timestamptz,jsonb) from public,anon,authenticated;
grant execute on function public.owner_manage_access(text,text,uuid,text,timestamptz,jsonb) to authenticated;
commit;

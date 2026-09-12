-- Transactional integration tests: fixture account and all changes are rolled back.
begin;
insert into auth.users(id,email,email_confirmed_at)
values('00000000-0000-4000-a000-000000009901','owner-admin-test@example.invalid',now());
set local role authenticated;
select set_config('request.jwt.claim.sub','69bb1a3d-dc19-40f5-9903-f8ad4dd32f46',true);
do $$
declare r jsonb;
begin
  if public.owner_manage_access('status')->>'owner' <> 'true' then raise exception 'owner status failed'; end if;
  r := public.owner_manage_access('search','owner-admin-test@example.invalid');
  if r->>'effective_level' <> 'registered' then raise exception 'default tier failed'; end if;
  r := public.owner_manage_access('save',null,'00000000-0000-4000-a000-000000009901','premium',now()+interval '1 day',null);
  if r->>'effective_level' <> 'premium' or jsonb_array_length(r->'history') <> 1 then raise exception 'save/audit failed'; end if;
  begin
    perform public.owner_manage_access('save',null,'00000000-0000-4000-a000-000000009901','special',null,null);
    raise exception 'stale save allowed';
  exception when serialization_failure then null; end;
  begin
    perform public.owner_manage_access('save',null,'69bb1a3d-dc19-40f5-9903-f8ad4dd32f46','registered',null,null);
    raise exception 'owner lockout allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.owner_manage_access('save',null,'00000000-0000-4000-a000-000000009901','bogus',null,r->'grant');
    raise exception 'invalid tier allowed';
  exception when invalid_parameter_value then null; end;
  r := public.owner_manage_access('save',null,'00000000-0000-4000-a000-000000009901','administrator',null,r->'grant');
  if r->>'effective_level' <> 'administrator' then raise exception 'admin save failed'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-a000-000000009901',true);
do $$
begin
  -- Even a full administrator is not the owner.
  begin
    perform public.owner_manage_access('search','ernest.ordu@yahoo.com');
    raise exception 'non-owner lookup allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.owner_manage_access('save',null,'00000000-0000-4000-a000-000000009901','premium',null,null);
    raise exception 'non-owner save allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform 1 from access_private.site_owner;
    raise exception 'owner table exposed';
  exception when insufficient_privilege then null; end;
end $$;
set local role anon;
do $$
begin
  begin
    perform public.owner_manage_access('status');
    raise exception 'anonymous RPC allowed';
  exception when insufficient_privilege then null; end;
end $$;
rollback;

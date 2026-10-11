-- Additive per-tool access, using the audited exam workflow in an independent namespace.
-- Requires access-levels.sql. Installs three catalog rows, zero grants or requests.
-- No membership, exam grant, question, or workspace changes.
begin;

create table public.tool_catalog (
  tool_key text primary key check (tool_key ~ '^[a-z][a-z0-9_]{1,31}$'),
  display_name text not null check (char_length(display_name) between 2 and 160),
  badge text not null check (char_length(badge) between 2 and 16),
  publication_status text not null default 'coming_soon'
    check (publication_status in ('published', 'coming_soon', 'retired')),
  sort_order smallint not null default 100
);

insert into public.tool_catalog (tool_key, display_name, badge, publication_status, sort_order)
values
  ('material_checker', 'Material Specification Compliance Checker', 'Checker', 'published', 10),
  ('material_lookup', 'Material Specification Lookup', 'Lookup', 'published', 20),
  ('steel_explorer', 'Steel Phase & Transformation Explorer', 'Steel Explorer', 'published', 30);

-- One current grant per account/tool, independent of exam grants and membership.
create table public.user_tool_grants (
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_key text not null references public.tool_catalog(tool_key),
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete set null,
  revision bigint not null default 1 check (revision > 0),
  primary key (user_id, tool_key),
  check (expires_at is null or expires_at > granted_at),
  check ((status = 'active' and revoked_at is null and revoked_by is null)
    or (status = 'revoked' and revoked_at is not null and revoked_at >= granted_at))
);

-- Overwrite the current request on a deliberate re-request; do not accumulate clicks.
-- Requests NEVER confer permission. Only user_tool_grants authorizes use.
create table public.tool_access_requests (
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_key text not null references public.tool_catalog(tool_key),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'cancelled')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  revision bigint not null default 1 check (revision > 0),
  primary key (user_id, tool_key),
  check ((status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (status <> 'pending' and reviewed_at is not null and reviewed_at >= requested_at))
);

create schema if not exists tool_access_private;
revoke all on schema tool_access_private from public, anon, authenticated;

-- Narrow events only when permission changes. No questions, responses, tokens,
-- account emails, full row snapshots, page views, or use telemetry.
create table tool_access_private.events (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  tool_key text not null,
  actor_id uuid,
  actor_source text not null check (actor_source in ('administrator', 'database')),
  changed_at timestamptz not null default now(),
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  previous_status text,
  next_status text,
  previous_expiry timestamptz,
  next_expiry timestamptz
);
create index tool_access_events_user_time on tool_access_private.events(user_id, changed_at desc);

alter table public.tool_catalog enable row level security;
alter table public.user_tool_grants enable row level security;
alter table public.tool_access_requests enable row level security;
alter table tool_access_private.events enable row level security;
revoke all on table public.tool_catalog, public.user_tool_grants, public.tool_access_requests
  from public, anon, authenticated;
revoke all on all tables in schema tool_access_private from public, anon, authenticated;
revoke all on all sequences in schema tool_access_private from public, anon, authenticated;
grant select on public.tool_catalog to anon, authenticated;
grant select on public.user_tool_grants, public.tool_access_requests to authenticated;

create policy tool_catalog_read on public.tool_catalog for select to anon, authenticated
  using (publication_status <> 'retired' or (select public.has_access('administrator')));
create policy user_tool_grants_read on public.user_tool_grants for select to authenticated
  using (user_id = (select auth.uid()) or (select public.has_access('administrator')));
create policy tool_access_requests_read on public.tool_access_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select public.has_access('administrator')));
-- No direct client writes, including administrators; only the guarded RPCs below.

create function tool_access_private.bump_revision()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if (new.user_id, new.tool_key) is distinct from (old.user_id, old.tool_key) then
    raise exception 'An access record cannot be reassigned.' using errcode = '23514';
  end if;
  new.revision := old.revision + 1;
  return new;
end;
$$;
revoke all on function tool_access_private.bump_revision() from public, anon, authenticated;
create trigger user_tool_grants_revision before update on public.user_tool_grants
  for each row execute function tool_access_private.bump_revision();
create trigger tool_access_requests_revision before update on public.tool_access_requests
  for each row execute function tool_access_private.bump_revision();

-- A private trigger needs definer privileges only to append to the private log.
-- It is not callable by clients. User-context writes must come from an administrator;
-- trusted database maintenance has no auth.uid() and is labelled explicitly.
create function tool_access_private.record_grant_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid();
begin
  if actor is not null and not public.has_access('administrator') then
    raise exception 'Only an administrator can change tool grants.' using errcode = '42501';
  end if;
  if tg_op = 'UPDATE' and (new.status, new.expires_at, new.granted_at, new.granted_by,
      new.revoked_at, new.revoked_by) is not distinct from
      (old.status, old.expires_at, old.granted_at, old.granted_by, old.revoked_at, old.revoked_by) then
    return null;
  end if;
  insert into tool_access_private.events
    (user_id, tool_key, actor_id, actor_source, operation, previous_status, next_status,
      previous_expiry, next_expiry)
  values
    (case when tg_op = 'DELETE' then old.user_id else new.user_id end,
     case when tg_op = 'DELETE' then old.tool_key else new.tool_key end,
     actor, case when actor is null then 'database' else 'administrator' end, tg_op,
     case when tg_op <> 'INSERT' then old.status end,
     case when tg_op <> 'DELETE' then new.status end,
     case when tg_op <> 'INSERT' then old.expires_at end,
     case when tg_op <> 'DELETE' then new.expires_at end);
  return null;
end;
$$;
revoke all on function tool_access_private.record_grant_change() from public, anon, authenticated;
create trigger user_tool_grants_audit after insert or update or delete on public.user_tool_grants
  for each row execute function tool_access_private.record_grant_change();

-- The only use decision: authenticated caller, published tool, and either
-- an active explicit grant or current administrator privileges. Never accepts a user ID.
-- Premium/Special membership by itself is deliberately irrelevant to this decision.
-- A caller-only eligibility lookup can read auth.users without exposing its rows.
-- This closes the window in which an already-issued JWT belongs to a banned account.
create function tool_access_private.current_account_active()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists (
    select 1 from auth.users where id=(select auth.uid()) and email_confirmed_at is not null
      and (banned_until is null or banned_until<=now())
  );
$$;
revoke all on function tool_access_private.current_account_active() from public,anon,authenticated;
grant execute on function tool_access_private.current_account_active() to authenticated;

create function public.can_access_tool(requested_tool_key text)
returns boolean language sql stable security invoker set search_path = '' as $$
  select (select auth.uid()) is not null and (select tool_access_private.current_account_active()) and exists (
    select 1 from public.tool_catalog e
    where e.tool_key = requested_tool_key and e.publication_status = 'published'
      and ((select public.has_access('administrator')) or exists (
        select 1 from public.user_tool_grants g
        where g.user_id = (select auth.uid()) and g.tool_key = e.tool_key
          and g.status = 'active' and (g.expires_at is null or g.expires_at > now())
      ))
  );
$$;

-- One small, on-demand result for the directory. No polling or Realtime subscription.
create function public.get_my_tool_access()
returns table (tool_key text, display_name text, badge text, publication_status text,
  access_status text, can_use boolean, expires_at timestamptz, grant_revision bigint)
language sql stable security invoker set search_path = '' as $$
  select e.tool_key, e.display_name, e.badge, e.publication_status,
    case
      when e.publication_status <> 'published' then e.publication_status
      when (select auth.uid()) is null then 'sign_in_required'
      when not (select tool_access_private.current_account_active()) then 'locked'
      when (select public.has_access('administrator')) then 'granted'
      when g.status = 'active' and (g.expires_at is null or g.expires_at > now()) then 'granted'
      when r.status = 'pending' then 'pending'
      when g.status = 'revoked' then 'revoked'
      when g.status = 'active' and g.expires_at <= now() then 'expired'
      when r.status = 'declined' then 'declined'
      else 'locked'
    end,
    public.can_access_tool(e.tool_key),
    case when (select public.has_access('administrator')) then null else g.expires_at end,
    g.revision
  from public.tool_catalog e
  left join public.user_tool_grants g on g.tool_key = e.tool_key and g.user_id = (select auth.uid())
  left join public.tool_access_requests r on r.tool_key = e.tool_key and r.user_id = (select auth.uid())
  order by e.sort_order, e.tool_key;
$$;

revoke all on function public.can_access_tool(text), public.get_my_tool_access() from public, anon, authenticated;
grant execute on function public.can_access_tool(text), public.get_my_tool_access() to authenticated;

comment on table public.user_tool_grants is
  'One server-managed grant per learner/tool. Membership alone does not authorize tools.';
comment on table public.tool_access_requests is
  'One current request per learner/tool. Requests and approvals here never authorize use by themselves.';
comment on table tool_access_private.events is
  'Compact permission-change history only; retain 90 days operationally. No automatic job installed in Step 1.';
comment on function public.can_access_tool(text) is
  'Authorizes one exact tool for the authenticated caller. Enforced by protected delivery and workspace endpoints.';

-- Administrator decisions and caller-scoped requests; no grants on installation.
create index tool_requests_pending_queue on public.tool_access_requests(requested_at, user_id, tool_key)
  where status = 'pending';
create index tool_events_retention on tool_access_private.events(changed_at, id);
alter table tool_access_private.events add column event_kind text not null default 'grant'
  check (event_kind in ('grant', 'request'));
grant usage on schema tool_access_private to authenticated;

-- A hard per-pair cap bounds growth even within the retention window. Expired history
-- is drained in batches, on writes or explicit maintenance, with no cron or polling.
create function tool_access_private.prune_history() returns integer
language plpgsql security invoker set search_path = '' as $$
declare removed integer;
begin
  with stale as (
    select id from tool_access_private.events where changed_at < now() - interval '90 days'
    order by changed_at, id limit 200 for update skip locked
  ) delete from tool_access_private.events e using stale where e.id = stale.id;
  get diagnostics removed = row_count;
  return removed;
end $$;
create function tool_access_private.trim_event_history() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  delete from tool_access_private.events where id in (
    select id from tool_access_private.events
    where user_id = new.user_id and tool_key = new.tool_key
    order by changed_at desc, id desc offset 20
  );
  perform tool_access_private.prune_history();
  return null;
end $$;
create trigger tool_events_trim after insert on tool_access_private.events
  for each row execute function tool_access_private.trim_event_history();

-- Only administrator review decisions add history; learner request clicks never do.
create function tool_access_private.record_request_review() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status in ('approved','declined') and
      (new.status, new.reviewed_at, new.reviewed_by) is distinct from
      (old.status, old.reviewed_at, old.reviewed_by) then
    if auth.uid() is not null and (not public.has_access('administrator')
        or new.reviewed_by is distinct from auth.uid()) then
      raise exception 'Only an administrator can review requests.' using errcode = '42501';
    end if;
    insert into tool_access_private.events
      (user_id,tool_key,actor_id,actor_source,operation,event_kind,previous_status,next_status)
    values(new.user_id,new.tool_key,auth.uid(),
      case when auth.uid() is null then 'database' else 'administrator' end,
      'UPDATE','request',old.status,new.status);
  end if;
  return null;
end $$;
create trigger tool_request_review_audit after update on public.tool_access_requests
  for each row execute function tool_access_private.record_request_review();
revoke all on function tool_access_private.prune_history(), tool_access_private.trim_event_history(),
  tool_access_private.record_request_review() from public, anon, authenticated;

-- Narrow admin dispatcher; every entry point (including private direct calls) checks
-- trusted membership plus the live, confirmed, non-banned account. No metadata roles.
create function tool_access_private.manage_tool_access(
  operation text, account_email text, target_id uuid, requested_tool_key text,
  expiry timestamptz, expected_grant_revision bigint, expected_request_revision bigint,
  after_time timestamptz, after_user uuid, after_tool text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  target record;
  g public.user_tool_grants%rowtype;
  r public.tool_access_requests%rowtype;
  publication text;
  target_admin boolean;
  tools jsonb;
  history jsonb;
  queue jsonb;
  cursor_row jsonb;
begin
  if actor is null or not public.has_access('administrator') or not exists (
    select 1 from auth.users where id=actor and email_confirmed_at is not null
      and (banned_until is null or banned_until <= now())
  ) then raise exception 'Administrator access is required.' using errcode='42501'; end if;
  if operation = 'status' then return jsonb_build_object('administrator',true); end if;
  if operation = 'prune' then
    return jsonb_build_object('removed',tool_access_private.prune_history());
  end if;
  if operation = 'requests' then
    if not ((after_time is null and after_user is null and after_tool is null)
        or (after_time is not null and after_user is not null and after_tool is not null)) then
      raise exception 'Invalid request cursor.' using errcode='22023';
    end if;
    select coalesce(jsonb_agg(q order by q.requested_at,q.user_id,q.tool_key),'[]'::jsonb) into queue from (
      select pending.user_id,u.email,pending.tool_key,e.badge,pending.requested_at,pending.revision
      from public.tool_access_requests pending join auth.users u on u.id=pending.user_id
      join public.tool_catalog e on e.tool_key=pending.tool_key
      where pending.status='pending' and (after_time is null or
        (pending.requested_at,pending.user_id,pending.tool_key) > (after_time,after_user,after_tool))
      order by pending.requested_at,pending.user_id,pending.tool_key limit 26
    ) q;
    if jsonb_array_length(queue) > 25 then
      queue := queue - 25;
      cursor_row := queue->24;
    end if;
    return jsonb_build_object('requests',queue,'next_cursor',case when cursor_row is not null then
      jsonb_build_object('after_time',cursor_row->'requested_at','after_user',cursor_row->'user_id',
        'after_tool',cursor_row->'tool_key') else null end);
  end if;
  if operation is null or operation not in ('search','account','grant','revoke','approve','decline') then
    raise exception 'Invalid operation.' using errcode='22023';
  end if;
  if operation='search' then
    if account_email is null or length(btrim(account_email)) not between 3 and 254 then
      raise exception 'Enter the complete account email.' using errcode='22023';
    end if;
    -- Never download the member list. Ambiguous emails fail instead of choosing a user.
    begin
      select id,email,email_confirmed_at,banned_until into strict target
      from auth.users where lower(email)=lower(btrim(account_email));
    exception when no_data_found then return jsonb_build_object('found',false);
      when too_many_rows then raise exception 'Email is ambiguous; open the request by account ID.' using errcode='22023';
    end;
  else
    -- Shared lock with learner requests serializes even the first grant/request.
    select id,email,email_confirmed_at,banned_until into target from auth.users where id=target_id for update;
    if not found then return jsonb_build_object('found',false); end if;
  end if;
  select exists(select 1 from public.user_access_grants where user_id=target.id
    and access_key='administrator' and (expires_at is null or expires_at>now())) into target_admin;
  if operation in ('grant','revoke','approve','decline') then
    select publication_status into publication from public.tool_catalog where tool_key=requested_tool_key;
    if publication is null then raise exception 'Unknown tool.' using errcode='22023'; end if;
    if operation in ('grant','approve') and (publication <> 'published' or target_admin
        or target.email_confirmed_at is null or target.banned_until > now()) then
      raise exception 'Grant only published tools to confirmed, active learner accounts.' using errcode='22023';
    end if;
    if operation='revoke' and target_admin then
      raise exception 'Administrators inherit tool access. Only the owner can change their membership.' using errcode='22023';
    end if;
    select * into g from public.user_tool_grants where user_id=target.id and tool_key=requested_tool_key for update;
    select * into r from public.tool_access_requests where user_id=target.id and tool_key=requested_tool_key for update;
    if expected_grant_revision is distinct from coalesce(g.revision,0) or
        expected_request_revision is distinct from coalesce(r.revision,0) then
      raise exception 'This tool access changed. Reload the account before saving.' using errcode='40001';
    end if;
    if operation in ('approve','decline') and (r.status is null or r.status <> 'pending') then
      raise exception 'This request is no longer pending.' using errcode='40001';
    end if;
    if operation in ('grant','approve') then
      if expiry is not null and (not isfinite(expiry) or expiry<=now()) then
        raise exception 'Choose a future expiry or no expiry.' using errcode='22023';
      end if;
      if g.status is distinct from 'active' or g.expires_at is distinct from expiry then
        insert into public.user_tool_grants(user_id,tool_key,granted_by,expires_at)
        values(target.id,requested_tool_key,actor,expiry)
        on conflict(user_id,tool_key) do update set status='active',granted_at=now(),
          granted_by=actor,expires_at=excluded.expires_at,revoked_at=null,revoked_by=null;
      end if;
      if r.status='pending' then
        update public.tool_access_requests set status='approved',reviewed_at=now(),reviewed_by=actor
          where user_id=target.id and tool_key=requested_tool_key;
      end if;
    elsif operation='revoke' then
      if g.status='active' then
        update public.user_tool_grants set status='revoked',revoked_at=now(),revoked_by=actor
          where user_id=target.id and tool_key=requested_tool_key;
      end if;
    else
      update public.tool_access_requests set status='declined',reviewed_at=now(),reviewed_by=actor
        where user_id=target.id and tool_key=requested_tool_key;
    end if;
  end if;
  select coalesce(jsonb_agg(x order by x.sort_order,x.tool_key),'[]'::jsonb) into tools from (
    select e.tool_key,e.display_name,e.badge,e.publication_status,e.sort_order,
      grant_row.status as grant_status,grant_row.expires_at,coalesce(grant_row.revision,0) as grant_revision,
      request_row.status as request_status,request_row.requested_at,coalesce(request_row.revision,0) as request_revision,
      case when e.publication_status<>'published' then e.publication_status
        when target_admin then 'administrator'
        when grant_row.status='revoked' then 'revoked'
        when grant_row.expires_at<=now() then 'expired'
        when grant_row.status='active' then 'granted' else 'locked' end as access_status
    from public.tool_catalog e
    left join public.user_tool_grants grant_row on grant_row.tool_key=e.tool_key and grant_row.user_id=target.id
    left join public.tool_access_requests request_row on request_row.tool_key=e.tool_key and request_row.user_id=target.id
  ) x;
  select coalesce(jsonb_agg(h order by h.changed_at desc,h.id desc),'[]'::jsonb) into history from (
    select id,tool_key,event_kind,actor_id,actor_source,changed_at,previous_status,next_status,next_expiry
    from tool_access_private.events where user_id=target.id and changed_at>=now()-interval '90 days'
    order by changed_at desc,id desc limit 20
  ) h;
  return jsonb_build_object('found',true,'user_id',target.id,'email',target.email,
    'is_administrator',target_admin,'can_receive_grants',not target_admin and target.email_confirmed_at is not null
      and (target.banned_until is null or target.banned_until<=now()),'tools',tools,'history',history);
end $$;

create function public.admin_manage_tool_access(
  operation text, account_email text default null, target_id uuid default null,
  requested_tool_key text default null, expiry timestamptz default null,
  expected_grant_revision bigint default null, expected_request_revision bigint default null,
  after_time timestamptz default null, after_user uuid default null, after_tool text default null
) returns jsonb language sql security invoker set search_path = '' as $$
  select tool_access_private.manage_tool_access(operation,account_email,target_id,requested_tool_key,
    expiry,expected_grant_revision,expected_request_revision,after_time,after_user,after_tool);
$$;

-- Caller-scoped request API. A request never writes a grant. No target ID.
create function tool_access_private.request_tool_access(requested_tool_key text, operation text, expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); r public.tool_access_requests%rowtype;
begin
  if actor is null then raise exception 'Sign in to request access.' using errcode='42501'; end if;
  perform 1 from auth.users where id=actor and email_confirmed_at is not null
    and (banned_until is null or banned_until<=now()) for update;
  if not found then raise exception 'A confirmed active account is required.' using errcode='42501'; end if;
  if operation is null or operation not in ('request','cancel') then
    raise exception 'Invalid request operation.' using errcode='22023';
  end if;
  if not exists(select 1 from public.tool_catalog where tool_key=requested_tool_key and publication_status='published') then
    raise exception 'This tool is not available for requests.' using errcode='22023';
  end if;
  select * into r from public.tool_access_requests where user_id=actor and tool_key=requested_tool_key for update;
  if expected_revision is distinct from coalesce(r.revision,0) then
    raise exception 'This request changed. Refresh before trying again.' using errcode='40001';
  end if;
  if operation='request' then
    if public.can_access_tool(requested_tool_key) then
      raise exception 'You already have access to this tool.' using errcode='22023';
    end if;
    if r.status is distinct from 'pending' then
      -- Repeated toggling cannot move a learner endlessly to the front of the queue.
      if r.requested_at > now()-interval '24 hours' then
        raise exception 'Please wait 24 hours before requesting this tool again.' using errcode='22023';
      end if;
      insert into public.tool_access_requests(user_id,tool_key) values(actor,requested_tool_key)
      on conflict(user_id,tool_key) do update set status='pending',requested_at=now(),reviewed_at=null,reviewed_by=null;
    end if;
  elsif r.status='pending' then
    update public.tool_access_requests set status='cancelled',reviewed_at=now(),reviewed_by=null
      where user_id=actor and tool_key=requested_tool_key;
  end if;
  select * into r from public.tool_access_requests where user_id=actor and tool_key=requested_tool_key;
  return jsonb_build_object('tool_key',requested_tool_key,'status',r.status,'revision',coalesce(r.revision,0));
end $$;
create function public.request_tool_access(requested_tool_key text, operation text default 'request', expected_revision bigint default 0)
returns jsonb language sql security invoker set search_path = '' as $$
  select tool_access_private.request_tool_access(requested_tool_key,operation,expected_revision);
$$;
revoke all on function tool_access_private.manage_tool_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  public.admin_manage_tool_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  tool_access_private.request_tool_access(text,text,bigint), public.request_tool_access(text,text,bigint)
  from public,anon,authenticated;
grant execute on function tool_access_private.manage_tool_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  public.admin_manage_tool_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  tool_access_private.request_tool_access(text,text,bigint), public.request_tool_access(text,text,bigint)
  to authenticated;
comment on table tool_access_private.events is
  'At most 20 recent decisions per user/tool; history UI limited to 90 days. Older rows pruned 200 at a time on writes or manual maintenance; no background job.';

-- One small caller-scoped directory read; no polling.
create function public.get_my_tool_directory()
returns table (tool_key text, display_name text, badge text, publication_status text,
  access_status text, can_use boolean, expires_at timestamptz, grant_revision bigint,
  request_status text, request_revision bigint, requested_at timestamptz)
language sql stable security invoker set search_path = '' as $$
  select a.tool_key,a.display_name,a.badge,a.publication_status,a.access_status,
    a.can_use,a.expires_at,a.grant_revision,r.status,coalesce(r.revision,0),r.requested_at
  from public.get_my_tool_access() a
  join public.tool_catalog e on e.tool_key=a.tool_key
  left join public.tool_access_requests r on r.tool_key=a.tool_key and r.user_id=(select auth.uid())
  where a.publication_status <> 'retired'
  order by e.sort_order,e.tool_key;
$$;
revoke all on function public.get_my_tool_directory() from public,anon,authenticated;
grant execute on function public.get_my_tool_directory() to authenticated;
comment on function public.get_my_tool_directory() is
  'Personal directory metadata and current request revisions. No questions, other users, or writes.';

-- Preserve the legacy resource contract used by the checker workspace endpoint and
-- source-only authoring gate. Only these three tool resources use individual grants.
-- Other lesson/content membership rules retain their original behavior.
create or replace function public.can_access_content(requested_resource_key text)
returns boolean language plpgsql stable security invoker set search_path = '' as $$
declare key text;
begin
  key := case requested_resource_key
    when 'tool:/tools/material-specification-compliance-checker' then 'material_checker'
    when 'tool:/engineering-tools/grade-specification-lookup' then 'material_lookup'
    when 'tool:/tools/steel-phase-explorer' then 'steel_explorer'
    else null end;
  if key is not null then
    if auth.uid() is null then return false; end if;
    return public.can_access_tool(key);
  end if;
  return coalesce((select public.has_access(rule.required_access_key)
    from public.content_access_rules rule
    where rule.resource_key=requested_resource_key and rule.is_active),false);
end;
$$;
-- Anonymous legacy callers receive false without invoking a personal-access RPC.
comment on function public.can_access_content(text) is
  'Per-tool grants for the three protected engineering tools; legacy membership rules for other resources.';

commit;

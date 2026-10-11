-- Step 3. Apply after exam_access_foundation; no grants or membership changes on install.
begin;

create index exam_requests_pending_queue on public.exam_access_requests(requested_at, user_id, exam_key)
  where status = 'pending';
create index exam_events_retention on exam_access_private.events(changed_at, id);
alter table exam_access_private.events add column event_kind text not null default 'grant'
  check (event_kind in ('grant', 'request'));
grant usage on schema exam_access_private to authenticated;

-- A hard per-pair cap bounds growth even within the retention window. Expired history
-- is drained in batches, on writes or explicit maintenance, with no cron or polling.
create function exam_access_private.prune_history() returns integer
language plpgsql security invoker set search_path = '' as $$
declare removed integer;
begin
  with stale as (
    select id from exam_access_private.events where changed_at < now() - interval '90 days'
    order by changed_at, id limit 200 for update skip locked
  ) delete from exam_access_private.events e using stale where e.id = stale.id;
  get diagnostics removed = row_count;
  return removed;
end $$;
create function exam_access_private.trim_event_history() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  delete from exam_access_private.events where id in (
    select id from exam_access_private.events
    where user_id = new.user_id and exam_key = new.exam_key
    order by changed_at desc, id desc offset 20
  );
  perform exam_access_private.prune_history();
  return null;
end $$;
create trigger exam_events_trim after insert on exam_access_private.events
  for each row execute function exam_access_private.trim_event_history();

-- Only administrator review decisions add history; learner request clicks never do.
create function exam_access_private.record_request_review() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status in ('approved','declined') and
      (new.status, new.reviewed_at, new.reviewed_by) is distinct from
      (old.status, old.reviewed_at, old.reviewed_by) then
    if auth.uid() is not null and (not public.has_access('administrator')
        or new.reviewed_by is distinct from auth.uid()) then
      raise exception 'Only an administrator can review requests.' using errcode = '42501';
    end if;
    insert into exam_access_private.events
      (user_id,exam_key,actor_id,actor_source,operation,event_kind,previous_status,next_status)
    values(new.user_id,new.exam_key,auth.uid(),
      case when auth.uid() is null then 'database' else 'administrator' end,
      'UPDATE','request',old.status,new.status);
  end if;
  return null;
end $$;
create trigger exam_request_review_audit after update on public.exam_access_requests
  for each row execute function exam_access_private.record_request_review();
revoke all on function exam_access_private.prune_history(), exam_access_private.trim_event_history(),
  exam_access_private.record_request_review() from public, anon, authenticated;

-- Narrow admin dispatcher; every entry point (including private direct calls) checks
-- trusted membership plus the live, confirmed, non-banned account. No metadata roles.
create function exam_access_private.manage_exam_access(
  operation text, account_email text, target_id uuid, requested_exam_key text,
  expiry timestamptz, expected_grant_revision bigint, expected_request_revision bigint,
  after_time timestamptz, after_user uuid, after_exam text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  target record;
  g public.user_exam_grants%rowtype;
  r public.exam_access_requests%rowtype;
  publication text;
  target_admin boolean;
  exams jsonb;
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
    return jsonb_build_object('removed',exam_access_private.prune_history());
  end if;
  if operation = 'requests' then
    if not ((after_time is null and after_user is null and after_exam is null)
        or (after_time is not null and after_user is not null and after_exam is not null)) then
      raise exception 'Invalid request cursor.' using errcode='22023';
    end if;
    select coalesce(jsonb_agg(q order by q.requested_at,q.user_id,q.exam_key),'[]'::jsonb) into queue from (
      select pending.user_id,u.email,pending.exam_key,e.badge,pending.requested_at,pending.revision
      from public.exam_access_requests pending join auth.users u on u.id=pending.user_id
      join public.exam_catalog e on e.exam_key=pending.exam_key
      where pending.status='pending' and (after_time is null or
        (pending.requested_at,pending.user_id,pending.exam_key) > (after_time,after_user,after_exam))
      order by pending.requested_at,pending.user_id,pending.exam_key limit 26
    ) q;
    if jsonb_array_length(queue) > 25 then
      queue := queue - 25;
      cursor_row := queue->24;
    end if;
    return jsonb_build_object('requests',queue,'next_cursor',case when cursor_row is not null then
      jsonb_build_object('after_time',cursor_row->'requested_at','after_user',cursor_row->'user_id',
        'after_exam',cursor_row->'exam_key') else null end);
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
    select publication_status into publication from public.exam_catalog where exam_key=requested_exam_key;
    if publication is null then raise exception 'Unknown exam.' using errcode='22023'; end if;
    if operation in ('grant','approve') and (publication <> 'published' or target_admin
        or target.email_confirmed_at is null or target.banned_until > now()) then
      raise exception 'Grant only published exams to confirmed, active learner accounts.' using errcode='22023';
    end if;
    if operation='revoke' and target_admin then
      raise exception 'Administrators inherit exam access. Only the owner can change their membership.' using errcode='22023';
    end if;
    select * into g from public.user_exam_grants where user_id=target.id and exam_key=requested_exam_key for update;
    select * into r from public.exam_access_requests where user_id=target.id and exam_key=requested_exam_key for update;
    if expected_grant_revision is distinct from coalesce(g.revision,0) or
        expected_request_revision is distinct from coalesce(r.revision,0) then
      raise exception 'This exam access changed. Reload the account before saving.' using errcode='40001';
    end if;
    if operation in ('approve','decline') and (r.status is null or r.status <> 'pending') then
      raise exception 'This request is no longer pending.' using errcode='40001';
    end if;
    if operation in ('grant','approve') then
      if expiry is not null and (not isfinite(expiry) or expiry<=now()) then
        raise exception 'Choose a future expiry or no expiry.' using errcode='22023';
      end if;
      if g.status is distinct from 'active' or g.expires_at is distinct from expiry then
        insert into public.user_exam_grants(user_id,exam_key,granted_by,expires_at)
        values(target.id,requested_exam_key,actor,expiry)
        on conflict(user_id,exam_key) do update set status='active',granted_at=now(),
          granted_by=actor,expires_at=excluded.expires_at,revoked_at=null,revoked_by=null;
      end if;
      if r.status='pending' then
        update public.exam_access_requests set status='approved',reviewed_at=now(),reviewed_by=actor
          where user_id=target.id and exam_key=requested_exam_key;
      end if;
    elsif operation='revoke' then
      if g.status='active' then
        update public.user_exam_grants set status='revoked',revoked_at=now(),revoked_by=actor
          where user_id=target.id and exam_key=requested_exam_key;
      end if;
    else
      update public.exam_access_requests set status='declined',reviewed_at=now(),reviewed_by=actor
        where user_id=target.id and exam_key=requested_exam_key;
    end if;
  end if;
  select coalesce(jsonb_agg(x order by x.sort_order,x.exam_key),'[]'::jsonb) into exams from (
    select e.exam_key,e.display_name,e.badge,e.publication_status,e.sort_order,
      grant_row.status as grant_status,grant_row.expires_at,coalesce(grant_row.revision,0) as grant_revision,
      request_row.status as request_status,request_row.requested_at,coalesce(request_row.revision,0) as request_revision,
      case when e.publication_status<>'published' then e.publication_status
        when target_admin then 'administrator'
        when grant_row.status='revoked' then 'revoked'
        when grant_row.expires_at<=now() then 'expired'
        when grant_row.status='active' then 'granted' else 'locked' end as access_status
    from public.exam_catalog e
    left join public.user_exam_grants grant_row on grant_row.exam_key=e.exam_key and grant_row.user_id=target.id
    left join public.exam_access_requests request_row on request_row.exam_key=e.exam_key and request_row.user_id=target.id
  ) x;
  select coalesce(jsonb_agg(h order by h.changed_at desc,h.id desc),'[]'::jsonb) into history from (
    select id,exam_key,event_kind,actor_id,actor_source,changed_at,previous_status,next_status,next_expiry
    from exam_access_private.events where user_id=target.id and changed_at>=now()-interval '90 days'
    order by changed_at desc,id desc limit 20
  ) h;
  return jsonb_build_object('found',true,'user_id',target.id,'email',target.email,
    'is_administrator',target_admin,'can_receive_grants',not target_admin and target.email_confirmed_at is not null
      and (target.banned_until is null or target.banned_until<=now()),'exams',exams,'history',history);
end $$;

create function public.admin_manage_exam_access(
  operation text, account_email text default null, target_id uuid default null,
  requested_exam_key text default null, expiry timestamptz default null,
  expected_grant_revision bigint default null, expected_request_revision bigint default null,
  after_time timestamptz default null, after_user uuid default null, after_exam text default null
) returns jsonb language sql security invoker set search_path = '' as $$
  select exam_access_private.manage_exam_access(operation,account_email,target_id,requested_exam_key,
    expiry,expected_grant_revision,expected_request_revision,after_time,after_user,after_exam);
$$;

-- Caller-scoped request API for Step 4. A request never writes a grant. No target ID.
create function exam_access_private.request_exam_access(requested_exam_key text, operation text, expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); r public.exam_access_requests%rowtype;
begin
  if actor is null then raise exception 'Sign in to request access.' using errcode='42501'; end if;
  perform 1 from auth.users where id=actor and email_confirmed_at is not null
    and (banned_until is null or banned_until<=now()) for update;
  if not found then raise exception 'A confirmed active account is required.' using errcode='42501'; end if;
  if operation is null or operation not in ('request','cancel') then
    raise exception 'Invalid request operation.' using errcode='22023';
  end if;
  if not exists(select 1 from public.exam_catalog where exam_key=requested_exam_key and publication_status='published') then
    raise exception 'This exam is not available for requests.' using errcode='22023';
  end if;
  select * into r from public.exam_access_requests where user_id=actor and exam_key=requested_exam_key for update;
  if expected_revision is distinct from coalesce(r.revision,0) then
    raise exception 'This request changed. Refresh before trying again.' using errcode='40001';
  end if;
  if operation='request' then
    if public.can_access_exam(requested_exam_key) then
      raise exception 'You already have access to this exam.' using errcode='22023';
    end if;
    if r.status is distinct from 'pending' then
      -- Repeated toggling cannot move a learner endlessly to the front of the queue.
      if r.requested_at > now()-interval '24 hours' then
        raise exception 'Please wait 24 hours before requesting this exam again.' using errcode='22023';
      end if;
      insert into public.exam_access_requests(user_id,exam_key) values(actor,requested_exam_key)
      on conflict(user_id,exam_key) do update set status='pending',requested_at=now(),reviewed_at=null,reviewed_by=null;
    end if;
  elsif r.status='pending' then
    update public.exam_access_requests set status='cancelled',reviewed_at=now(),reviewed_by=null
      where user_id=actor and exam_key=requested_exam_key;
  end if;
  select * into r from public.exam_access_requests where user_id=actor and exam_key=requested_exam_key;
  return jsonb_build_object('exam_key',requested_exam_key,'status',r.status,'revision',coalesce(r.revision,0));
end $$;
create function public.request_exam_access(requested_exam_key text, operation text default 'request', expected_revision bigint default 0)
returns jsonb language sql security invoker set search_path = '' as $$
  select exam_access_private.request_exam_access(requested_exam_key,operation,expected_revision);
$$;
revoke all on function exam_access_private.manage_exam_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  public.admin_manage_exam_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  exam_access_private.request_exam_access(text,text,bigint), public.request_exam_access(text,text,bigint)
  from public,anon,authenticated;
grant execute on function exam_access_private.manage_exam_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  public.admin_manage_exam_access(text,text,uuid,text,timestamptz,bigint,bigint,timestamptz,uuid,text),
  exam_access_private.request_exam_access(text,text,bigint), public.request_exam_access(text,text,bigint)
  to authenticated;
comment on table exam_access_private.events is
  'At most 20 recent decisions per user/exam; history UI limited to 90 days. Older rows pruned 200 at a time on writes or manual maintenance; no background job.';
commit;

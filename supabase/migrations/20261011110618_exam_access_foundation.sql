-- Step 1: additive permission foundation. Requires supabase/access-levels.sql.
-- Does NOT change the legacy Premium gate, deliver questions, or grant learners access.
-- Apply this exact migration after review; do not replay the unrelated reset migration.
begin;

create table public.exam_catalog (
  exam_key text primary key check (exam_key ~ '^[a-z][a-z0-9_]{1,31}$'),
  display_name text not null check (char_length(display_name) between 2 and 160),
  badge text not null check (char_length(badge) between 2 and 16),
  publication_status text not null default 'coming_soon'
    check (publication_status in ('published', 'coming_soon', 'retired')),
  sort_order smallint not null default 100
);

insert into public.exam_catalog (exam_key, display_name, badge, publication_status, sort_order)
values
  ('cssbb', 'Certified Six Sigma Black Belt', 'CSSBB', 'published', 10),
  ('mbb', 'Certified Six Sigma Master Black Belt', 'MBB', 'published', 20),
  ('cqe', 'Certified Quality Engineer', 'CQE', 'published', 30),
  ('cmq', 'Certified Manager of Quality/Organizational Excellence', 'CMQ/OE', 'published', 40),
  ('cssgb', 'Certified Six Sigma Green Belt', 'CSSGB', 'published', 50),
  ('cre', 'Certified Reliability Engineer', 'CRE', 'published', 60),
  ('pmp', 'Project Management Professional', 'PMP', 'published', 70),
  ('cqa', 'Certified Quality Auditor', 'CQA', 'coming_soon', 80);

-- One current grant per user/certification. Sets inherit the certification grant.
create table public.user_exam_grants (
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_key text not null references public.exam_catalog(exam_key),
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete set null,
  revision bigint not null default 1 check (revision > 0),
  primary key (user_id, exam_key),
  check (expires_at is null or expires_at > granted_at),
  check ((status = 'active' and revoked_at is null and revoked_by is null)
    or (status = 'revoked' and revoked_at is not null and revoked_at >= granted_at))
);

-- Overwrite the current request on a deliberate re-request; do not accumulate clicks.
-- Requests NEVER confer permission. Only user_exam_grants authorizes practice.
create table public.exam_access_requests (
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_key text not null references public.exam_catalog(exam_key),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'cancelled')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  revision bigint not null default 1 check (revision > 0),
  primary key (user_id, exam_key),
  check ((status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (status <> 'pending' and reviewed_at is not null and reviewed_at >= requested_at))
);

create schema if not exists exam_access_private;
revoke all on schema exam_access_private from public, anon, authenticated;

-- Narrow events only when permission changes. No questions, responses, tokens,
-- account emails, full row snapshots, page views, or practice telemetry.
create table exam_access_private.events (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  exam_key text not null,
  actor_id uuid,
  actor_source text not null check (actor_source in ('administrator', 'database')),
  changed_at timestamptz not null default now(),
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  previous_status text,
  next_status text,
  previous_expiry timestamptz,
  next_expiry timestamptz
);
create index exam_access_events_user_time on exam_access_private.events(user_id, changed_at desc);

alter table public.exam_catalog enable row level security;
alter table public.user_exam_grants enable row level security;
alter table public.exam_access_requests enable row level security;
alter table exam_access_private.events enable row level security;
revoke all on table public.exam_catalog, public.user_exam_grants, public.exam_access_requests
  from public, anon, authenticated;
revoke all on all tables in schema exam_access_private from public, anon, authenticated;
revoke all on all sequences in schema exam_access_private from public, anon, authenticated;
grant select on public.exam_catalog to anon, authenticated;
grant select on public.user_exam_grants, public.exam_access_requests to authenticated;

create policy exam_catalog_read on public.exam_catalog for select to anon, authenticated
  using (publication_status <> 'retired' or (select public.has_access('administrator')));
create policy user_exam_grants_read on public.user_exam_grants for select to authenticated
  using (user_id = (select auth.uid()) or (select public.has_access('administrator')));
create policy exam_access_requests_read on public.exam_access_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select public.has_access('administrator')));
-- No client writes, including administrators. Step 3 will add narrow, audited RPCs.

create function exam_access_private.bump_revision()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if (new.user_id, new.exam_key) is distinct from (old.user_id, old.exam_key) then
    raise exception 'An access record cannot be reassigned.' using errcode = '23514';
  end if;
  new.revision := old.revision + 1;
  return new;
end;
$$;
revoke all on function exam_access_private.bump_revision() from public, anon, authenticated;
create trigger user_exam_grants_revision before update on public.user_exam_grants
  for each row execute function exam_access_private.bump_revision();
create trigger exam_access_requests_revision before update on public.exam_access_requests
  for each row execute function exam_access_private.bump_revision();

-- A private trigger needs definer privileges only to append to the private log.
-- It is not callable by clients. User-context writes must come from an administrator;
-- trusted database maintenance has no auth.uid() and is labelled explicitly.
create function exam_access_private.record_grant_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid();
begin
  if actor is not null and not public.has_access('administrator') then
    raise exception 'Only an administrator can change exam grants.' using errcode = '42501';
  end if;
  if tg_op = 'UPDATE' and (new.status, new.expires_at, new.granted_at, new.granted_by,
      new.revoked_at, new.revoked_by) is not distinct from
      (old.status, old.expires_at, old.granted_at, old.granted_by, old.revoked_at, old.revoked_by) then
    return null;
  end if;
  insert into exam_access_private.events
    (user_id, exam_key, actor_id, actor_source, operation, previous_status, next_status,
      previous_expiry, next_expiry)
  values
    (case when tg_op = 'DELETE' then old.user_id else new.user_id end,
     case when tg_op = 'DELETE' then old.exam_key else new.exam_key end,
     actor, case when actor is null then 'database' else 'administrator' end, tg_op,
     case when tg_op <> 'INSERT' then old.status end,
     case when tg_op <> 'DELETE' then new.status end,
     case when tg_op <> 'INSERT' then old.expires_at end,
     case when tg_op <> 'DELETE' then new.expires_at end);
  return null;
end;
$$;
revoke all on function exam_access_private.record_grant_change() from public, anon, authenticated;
create trigger user_exam_grants_audit after insert or update or delete on public.user_exam_grants
  for each row execute function exam_access_private.record_grant_change();

-- The only practice decision: authenticated caller, published exam, and either
-- an active explicit grant or current administrator privileges. Never accepts a user ID.
-- Premium/Special membership by itself is deliberately irrelevant to this decision.
create function public.can_access_exam(requested_exam_key text)
returns boolean language sql stable security invoker set search_path = '' as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.exam_catalog e
    where e.exam_key = requested_exam_key and e.publication_status = 'published'
      and ((select public.has_access('administrator')) or exists (
        select 1 from public.user_exam_grants g
        where g.user_id = (select auth.uid()) and g.exam_key = e.exam_key
          and g.status = 'active' and (g.expires_at is null or g.expires_at > now())
      ))
  );
$$;

-- One small, on-demand result for the directory. No polling or Realtime subscription.
create function public.get_my_exam_access()
returns table (exam_key text, display_name text, badge text, publication_status text,
  access_status text, can_practice boolean, expires_at timestamptz, grant_revision bigint)
language sql stable security invoker set search_path = '' as $$
  select e.exam_key, e.display_name, e.badge, e.publication_status,
    case
      when e.publication_status <> 'published' then e.publication_status
      when (select auth.uid()) is null then 'sign_in_required'
      when (select public.has_access('administrator')) then 'granted'
      when g.status = 'active' and (g.expires_at is null or g.expires_at > now()) then 'granted'
      when r.status = 'pending' then 'pending'
      when g.status = 'revoked' then 'revoked'
      when g.status = 'active' and g.expires_at <= now() then 'expired'
      when r.status = 'declined' then 'declined'
      else 'locked'
    end,
    public.can_access_exam(e.exam_key),
    case when (select public.has_access('administrator')) then null else g.expires_at end,
    g.revision
  from public.exam_catalog e
  left join public.user_exam_grants g on g.exam_key = e.exam_key and g.user_id = (select auth.uid())
  left join public.exam_access_requests r on r.exam_key = e.exam_key and r.user_id = (select auth.uid())
  order by e.sort_order, e.exam_key;
$$;

revoke all on function public.can_access_exam(text), public.get_my_exam_access() from public, anon, authenticated;
grant execute on function public.can_access_exam(text), public.get_my_exam_access() to authenticated;

comment on table public.user_exam_grants is
  'One server-managed grant per learner/certification. Membership alone does not authorize exams.';
comment on table public.exam_access_requests is
  'One current request per learner/certification. Requests and approvals here never authorize practice by themselves.';
comment on table exam_access_private.events is
  'Compact permission-change history only; retain 90 days operationally. No automatic job installed in Step 1.';
comment on function public.can_access_exam(text) is
  'Step 1 contract only. Step 2 must enforce it on protected routes and question delivery.';
commit;

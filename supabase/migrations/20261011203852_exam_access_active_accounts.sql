-- Enforce live account state on every protected exam decision, including still-valid JWTs.
-- No new rows, grants, memberships, schedules, or session data are created.
begin;

create function exam_access_private.current_account_active()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.users where id=(select auth.uid())
    and email_confirmed_at is not null and (banned_until is null or banned_until <= now()));
$$;
revoke all on function exam_access_private.current_account_active() from public,anon,authenticated;
grant execute on function exam_access_private.current_account_active() to authenticated;

create or replace function public.can_access_exam(requested_exam_key text)
returns boolean language sql stable security invoker set search_path = '' as $$
  select (select auth.uid()) is not null and (select exam_access_private.current_account_active()) and exists (
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
create or replace function public.get_my_exam_access()
returns table (exam_key text, display_name text, badge text, publication_status text,
  access_status text, can_practice boolean, expires_at timestamptz, grant_revision bigint)
language sql stable security invoker set search_path = '' as $$
  select e.exam_key, e.display_name, e.badge, e.publication_status,
    case
      when e.publication_status <> 'published' then e.publication_status
      when (select auth.uid()) is null then 'sign_in_required'
      when not (select exam_access_private.current_account_active()) then 'locked'
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

-- CREATE OR REPLACE preserves the existing authenticated-only EXECUTE grants.
comment on function public.can_access_exam(text) is
  'Live confirmed/non-banned caller, published exam, and current exact grant or administrator role.';
commit;

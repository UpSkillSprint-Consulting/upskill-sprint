-- Step 4: one small caller-scoped read, preserving the Step 1 RPC contract.
begin;
create function public.get_my_exam_directory()
returns table (exam_key text, display_name text, badge text, publication_status text,
  access_status text, can_practice boolean, expires_at timestamptz, grant_revision bigint,
  request_status text, request_revision bigint, requested_at timestamptz)
language sql stable security invoker set search_path = '' as $$
  select a.exam_key,a.display_name,a.badge,a.publication_status,a.access_status,
    a.can_practice,a.expires_at,a.grant_revision,r.status,coalesce(r.revision,0),r.requested_at
  from public.get_my_exam_access() a
  join public.exam_catalog e on e.exam_key=a.exam_key
  left join public.exam_access_requests r on r.exam_key=a.exam_key and r.user_id=(select auth.uid())
  where a.publication_status <> 'retired'
  order by e.sort_order,e.exam_key;
$$;
revoke all on function public.get_my_exam_directory() from public,anon,authenticated;
grant execute on function public.get_my_exam_directory() to authenticated;
comment on function public.get_my_exam_directory() is
  'Personal directory metadata and current request revisions. No questions, other users, or writes.';
commit;

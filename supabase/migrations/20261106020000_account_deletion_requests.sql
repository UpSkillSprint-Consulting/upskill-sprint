-- Account deletion REQUESTS only. Unapplied until Ernest approves.
-- Nothing deletes live data. This table records a request for later review.
-- Proposed server-side design (for Ernest):
--   1. A SECURITY DEFINER function account_delete_request() inserts a row here.
--   2. A scheduled job (service_role) reviews requests older than 14 days.
--   3. On approval, the job deletes the auth.users row (cascades to profiles
--      and progress). Until then, no live data is deleted.

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requested_at timestamptz not null default now(),
  reason text check (reason is null or char_length(reason) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'cancelled'))
);
alter table public.account_deletion_requests enable row level security;
revoke all on table public.account_deletion_requests from public, anon, authenticated;
grant select, insert on table public.account_deletion_requests to authenticated;
create policy "Users read own deletion requests" on public.account_deletion_requests
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own deletion requests" on public.account_deletion_requests
  for insert to authenticated with check ((select auth.uid()) = user_id and status = 'pending');

create unique index if not exists account_deletion_one_pending
  on public.account_deletion_requests (user_id) where status = 'pending';

-- Run once in the Supabase SQL Editor before deploying the client script.
create table if not exists public.test_bank_progress_devices (
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null check (char_length(device_id) between 8 and 128),
  payload jsonb not null default '{"schemaVersion":1,"values":{}}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, device_id),
  constraint test_bank_progress_payload_object check (jsonb_typeof(payload) = 'object')
);
alter table public.test_bank_progress_devices enable row level security;
revoke all on table public.test_bank_progress_devices from public, anon, authenticated;
grant select, insert, update on table public.test_bank_progress_devices to authenticated;
drop policy if exists "Learners read own test progress" on public.test_bank_progress_devices;
create policy "Learners read own test progress" on public.test_bank_progress_devices for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Learners insert own test progress" on public.test_bank_progress_devices;
create policy "Learners insert own test progress" on public.test_bank_progress_devices for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Learners update own test progress" on public.test_bank_progress_devices;
create policy "Learners update own test progress" on public.test_bank_progress_devices for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
comment on table public.test_bank_progress_devices is 'One mergeable test-progress snapshot per authenticated learner device. RLS restricts every operation to the owning user.';

-- Phase 1 account profiles for UpSkill Sprint.
-- The auth user id is the only ownership boundary; profile fields are never
-- used for authorization decisions.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  timezone text not null default 'UTC',
  newsletter_opt_in boolean not null default false,
  newsletter_consent_at timestamptz,
  terms_accepted_at timestamptz,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length
    check (char_length(btrim(display_name)) between 2 and 100),
  constraint profiles_timezone_length
    check (char_length(btrim(timezone)) between 1 and 100),
  constraint profiles_newsletter_consent
    check (not newsletter_opt_in or newsletter_consent_at is not null)
);

comment on table public.profiles is
  'User-editable account details. Ownership is enforced only by auth.uid().';
comment on column public.profiles.newsletter_consent_at is
  'Timestamp recorded when the user explicitly opted in to lesson emails.';

alter table public.profiles enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Create a profile at signup so email-confirmation flows do not lose the
-- user's name or consent choices. The function has a locked search_path and
-- writes only to the fixed public.profiles table.
create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
  requested_timezone text;
  requested_newsletter boolean;
begin
  requested_name := left(
    btrim(coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      'Learner'
    )),
    100
  );
  if char_length(requested_name) < 2 then
    requested_name := 'Learner';
  end if;

  requested_timezone := left(
    btrim(coalesce(nullif(new.raw_user_meta_data ->> 'timezone', ''), 'UTC')),
    100
  );
  requested_newsletter := lower(coalesce(
    new.raw_user_meta_data ->> 'newsletter_opt_in',
    'false'
  )) = 'true';

  insert into public.profiles (
    user_id,
    display_name,
    timezone,
    newsletter_opt_in,
    newsletter_consent_at,
    terms_accepted_at
  ) values (
    new.id,
    requested_name,
    requested_timezone,
    requested_newsletter,
    case when requested_newsletter then now() else null end,
    case
      when lower(coalesce(new.raw_user_meta_data ->> 'terms_accepted', 'false')) = 'true'
        then now()
      else null
    end
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user_profile() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function public.handle_new_auth_user_profile();

-- Safely cover accounts created before this migration. Existing users without
-- a supplied name see "Learner" until they update their profile.
insert into public.profiles (user_id, display_name, timezone)
select
  users.id,
  case
    when char_length(btrim(coalesce(
      nullif(users.raw_user_meta_data ->> 'display_name', ''),
      nullif(users.raw_user_meta_data ->> 'full_name', ''),
      'Learner'
    ))) between 2 and 100
      then btrim(coalesce(
        nullif(users.raw_user_meta_data ->> 'display_name', ''),
        nullif(users.raw_user_meta_data ->> 'full_name', ''),
        'Learner'
      ))
    else 'Learner'
  end,
  left(btrim(coalesce(nullif(users.raw_user_meta_data ->> 'timezone', ''), 'UTC')), 100)
from auth.users as users
on conflict (user_id) do nothing;

-- Site-wide access control for UpSkill Sprint.
-- Public content remains static. Protected content must be delivered through
-- Supabase RLS, private Storage, or a server function that calls can_access_content().

create table if not exists public.access_levels (
  access_key text primary key,
  access_rank smallint not null unique,
  display_name text not null,
  description text not null,
  constraint access_levels_key_format
    check (access_key ~ '^[a-z][a-z0-9_]{1,31}$'),
  constraint access_levels_rank_range
    check (access_rank between 0 and 1000)
);

insert into public.access_levels (access_key, access_rank, display_name, description)
values
  ('public', 0, 'Public', 'Available without an account.'),
  ('registered', 10, 'Registered member', 'Available to any signed-in learner.'),
  ('premium', 20, 'Premium member', 'Available to learners with premium access.'),
  ('special', 30, 'Special access', 'Available to invited, partner, beta, or organization accounts.'),
  ('administrator', 100, 'Administrator', 'Full application access.')
on conflict (access_key) do update
set
  access_rank = excluded.access_rank,
  display_name = excluded.display_name,
  description = excluded.description;

create table if not exists public.user_access_grants (
  user_id uuid primary key references auth.users (id) on delete cascade,
  access_key text not null references public.access_levels (access_key),
  expires_at timestamptz,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users (id) on delete set null,
  note text,
  constraint user_access_grants_future_expiry
    check (expires_at is null or expires_at > granted_at),
  constraint user_access_grants_note_length
    check (note is null or char_length(note) <= 500)
);

create index if not exists user_access_grants_granted_by_idx
  on public.user_access_grants (granted_by)
  where granted_by is not null;

create index if not exists user_access_grants_access_key_idx
  on public.user_access_grants (access_key);

create index if not exists user_access_grants_active_expiry_idx
  on public.user_access_grants (expires_at)
  where expires_at is not null;

create table if not exists public.content_access_rules (
  resource_key text primary key,
  required_access_key text not null
    references public.access_levels (access_key) default 'public',
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_access_rules_key_format
    check (resource_key ~ '^[a-z0-9][a-z0-9_:/.-]{1,199}$'),
  constraint content_access_rules_name_length
    check (char_length(btrim(display_name)) between 2 and 160)
);

create index if not exists content_access_rules_required_level_idx
  on public.content_access_rules (required_access_key)
  where is_active;

alter table public.access_levels enable row level security;
alter table public.user_access_grants enable row level security;
alter table public.content_access_rules enable row level security;

revoke all on table public.access_levels from public, anon, authenticated;
revoke all on table public.user_access_grants from public, anon, authenticated;
revoke all on table public.content_access_rules from public, anon, authenticated;

grant select on table public.access_levels to anon, authenticated;
grant select on table public.user_access_grants to anon, authenticated;
grant select on table public.content_access_rules to anon, authenticated;

drop policy if exists "Access levels are readable" on public.access_levels;
create policy "Access levels are readable"
  on public.access_levels for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can read their own access grant" on public.user_access_grants;
create policy "Users can read their own access grant"
  on public.user_access_grants for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Content access rules are readable" on public.content_access_rules;
create policy "Content access rules are readable"
  on public.content_access_rules for select
  to anon, authenticated
  using (is_active);

create or replace function public.current_access_level()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select case
    when (select auth.uid()) is null then 'public'
    else coalesce(
      (
        select grant_row.access_key
        from public.user_access_grants as grant_row
        where grant_row.user_id = (select auth.uid())
          and (grant_row.expires_at is null or grant_row.expires_at > now())
      ),
      'registered'
    )
  end;
$$;

create or replace function public.has_access(required_access_key text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    (
      select current_level.access_rank >= required_level.access_rank
      from public.access_levels as required_level
      cross join public.access_levels as current_level
      where required_level.access_key = required_access_key
        and current_level.access_key = public.current_access_level()
    ),
    false
  );
$$;

create or replace function public.can_access_content(requested_resource_key text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    (
      select public.has_access(rule.required_access_key)
      from public.content_access_rules as rule
      where rule.resource_key = requested_resource_key
        and rule.is_active
    ),
    false
  );
$$;

revoke all on function public.current_access_level() from public;
revoke all on function public.has_access(text) from public;
revoke all on function public.can_access_content(text) from public;
grant execute on function public.current_access_level() to anon, authenticated;
grant execute on function public.has_access(text) to anon, authenticated;
grant execute on function public.can_access_content(text) to anon, authenticated;

comment on table public.user_access_grants is
  'Server-managed highest access tier for an account; missing rows default to registered.';
comment on table public.content_access_rules is
  'Required access tier for protected lessons, tools, exams, and downloads.';
comment on function public.can_access_content(text) is
  'Deny-by-default authorization check for a resource key.';


-- Administrator-only engineering tools.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values
  ('tool:/tools/material-specification-compliance-checker', 'administrator', 'Material Specification Compliance Checker', true, now()),
  ('tool:/engineering-tools/grade-specification-lookup', 'administrator', 'Material Specification Lookup', true, now()),
  ('tool:/tools/steel-phase-explorer', 'administrator', 'Steel Phase & Transformation Explorer', true, now())
on conflict (resource_key) do update
set
  required_access_key = excluded.required_access_key,
  display_name = excluded.display_name,
  is_active = excluded.is_active,
  updated_at = now();

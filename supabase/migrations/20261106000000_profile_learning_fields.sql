-- Learning profile fields (optional). Unapplied until Ernest approves.
-- Adds role, industry, and target_certification to public.profiles.
-- RLS: users can read and write only their own row (existing policies cover this).

alter table public.profiles
  add column if not exists role text check (role in ('Student', 'Technician', 'Quality/Process Engineer', 'Manager', 'Other') or role is null),
  add column if not exists industry text check (industry is null or char_length(industry) <= 100),
  add column if not exists target_certification text check (target_certification in ('CQA', 'CQE', 'CSSBB', 'CSSGB', 'MBB', 'NPPE', 'PMP') or target_certification is null);

grant select (role, industry, target_certification) on table public.profiles to authenticated;
grant insert (role, industry, target_certification) on table public.profiles to authenticated;
grant update (role, industry, target_certification) on table public.profiles to authenticated;

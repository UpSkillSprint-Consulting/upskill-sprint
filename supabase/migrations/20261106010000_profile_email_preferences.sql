-- Email preference choices. Unapplied until Ernest approves.
-- newsletter_opt_in stays and means "new lessons" (backward compatible).
-- Adds exam_practice_opt_in and monthly_digest_opt_in.

alter table public.profiles
  add column if not exists exam_practice_opt_in boolean not null default false,
  add column if not exists monthly_digest_opt_in boolean not null default false;

grant update (exam_practice_opt_in, monthly_digest_opt_in) on table public.profiles to authenticated;

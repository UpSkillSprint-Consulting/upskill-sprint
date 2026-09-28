-- The Lean: A Field Guide to Bias is available without an account.
-- This idempotent registration uses the same resource-key convention as other site content.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values
  ('lesson:/lessons/statistics/the-lean-a-field-guide-to-bias', 'public', 'The Lean: A Field Guide to Bias', true, now())
on conflict (resource_key) do update
set required_access_key = excluded.required_access_key,
    display_name = excluded.display_name,
    is_active = excluded.is_active,
    updated_at = now();

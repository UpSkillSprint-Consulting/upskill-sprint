-- Public access was explicitly selected for this tool (changed from Administrator by Ernest).
-- Use the existing site resource-key convention; no schema changes are required.
-- The page never calls the gate; this row is the record of the decision.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values
  ('tool:/tools/best-fit-model-finder', 'public', 'Best-Fit Model Finder', true, now())
on conflict (resource_key) do update
set required_access_key = excluded.required_access_key,
    display_name = excluded.display_name,
    is_active = excluded.is_active,
    updated_at = now();

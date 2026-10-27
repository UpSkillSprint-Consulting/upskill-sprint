-- Administrator access was explicitly selected for this tool.
-- Use the existing site resource-key convention; no schema changes are required.
-- can_access_content() falls through to content_access_rules for this key, because it is
-- not one of the three individually unlocked tools in the tool_access migration.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values
  ('tool:/tools/best-fit-model-finder', 'administrator', 'Best-Fit Model Finder', true, now())
on conflict (resource_key) do update
set required_access_key = excluded.required_access_key,
    display_name = excluded.display_name,
    is_active = excluded.is_active,
    updated_at = now();

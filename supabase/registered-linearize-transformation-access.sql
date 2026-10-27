-- Registered access was explicitly selected for this lesson.
-- Use the existing site resource-key convention; no schema changes are required.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values
  ('lesson:/lessons/statistics/choosing-a-transformation-to-linearize-data', 'registered', 'Choosing a Transformation to Linearize Data', true, now())
on conflict (resource_key) do update
set required_access_key = excluded.required_access_key,
    display_name = excluded.display_name,
    is_active = excluded.is_active,
    updated_at = now();

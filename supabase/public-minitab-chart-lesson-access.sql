-- Public access was explicitly selected for this lesson.
-- Use the existing site resource-key convention; no schema changes are required.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values
  ('lesson:/lessons/power-bi-excel-sql/introduction-to-symmetry-variability-and-multi-vari-charts-in-minitab', 'public', 'Introduction to Symmetry Plot, Variability Chart and Multi-Vari Chart in Minitab', true, now())
on conflict (resource_key) do update
set required_access_key = excluded.required_access_key,
    display_name = excluded.display_name,
    is_active = excluded.is_active,
    updated_at = now();

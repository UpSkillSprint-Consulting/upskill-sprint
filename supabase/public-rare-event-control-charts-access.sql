-- Public access was explicitly selected by the lesson owner on 2026-11-26.
-- Use the existing site resource-key convention; no schema changes are required.
-- Owner review and execution are required; do not apply this file automatically.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values
  ('lesson:/lessons/quality-engineering/rare-event-control-charts', 'public', 'Rare Event Control Charts (G & T)', true, now())
on conflict (resource_key) do update
set required_access_key = excluded.required_access_key,
    display_name = excluded.display_name,
    is_active = excluded.is_active,
    updated_at = now();

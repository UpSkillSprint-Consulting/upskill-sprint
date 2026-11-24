-- Public access explicitly selected by Ernest.
insert into public.content_access_rules (resource_key, required_access_key, display_name, is_active, updated_at)
values ('lesson:/lessons/statistics/multivariate-statistical-process-control', 'public', 'Multivariate Statistical Control Chart (MSPC) – Hotelling''s T², Generalized Variance & Multivariate EWMA Control Charts: Complete Guide and Minitab Practice', true, now())
on conflict (resource_key) do update set required_access_key = excluded.required_access_key, display_name = excluded.display_name, is_active = excluded.is_active, updated_at = now();

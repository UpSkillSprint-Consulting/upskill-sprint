-- Shared simulator: all certifications, full exams, and quiz modes.
insert into public.content_access_rules
  (resource_key, required_access_key, display_name, is_active, updated_at)
values ('exam:/test-bank', 'premium', 'Simulated Exam Practice & Quizzes', true, now())
on conflict (resource_key) do update
set required_access_key = excluded.required_access_key,
    display_name = excluded.display_name,
    is_active = excluded.is_active,
    updated_at = now();

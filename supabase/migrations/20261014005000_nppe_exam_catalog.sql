-- National Professional Practice Examination. Coming soon: the catalog row
-- lets the directory show the full name. It does not grant practice access.
begin;

insert into public.exam_catalog (exam_key, display_name, badge, publication_status, sort_order)
values ('nppe', 'National Professional Practice Examination (NPPE)', 'NPPE', 'coming_soon', 90);

commit;

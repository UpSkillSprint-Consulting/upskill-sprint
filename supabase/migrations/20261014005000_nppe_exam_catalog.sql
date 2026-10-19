-- NPPE original practice certification released under administrator-controlled access.
-- No user grants, permissions or practice records are changed here.
begin;
insert into public.exam_catalog(exam_key,display_name,badge,publication_status,sort_order)
values('nppe','National Professional Practice Examination (NPPE)','NPPE','published',90)
on conflict (exam_key) do update set
 display_name=excluded.display_name,
 badge=excluded.badge,
 publication_status=excluded.publication_status,
 sort_order=excluded.sort_order;
commit;

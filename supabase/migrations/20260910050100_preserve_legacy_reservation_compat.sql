-- Segment 18 compatibility bridge.
-- The Segment 03 cumulative database gate still exercises these authenticated
-- legacy reservation entry points. Keep them callable until that compatibility
-- contract is deliberately version-retired; Segment 18 tests their auth.uid()
-- owner boundary rather than treating SECURITY DEFINER as a vulnerability by
-- itself. Segment 16 remains the product UI's authoritative v2 allocation path.
begin;
grant execute on function public.reserve_test_bank_new_questions(text,text[]) to authenticated;
grant execute on function public.reserve_test_bank_new_questions_exact(text,text[],integer) to authenticated;
comment on function public.reserve_test_bank_new_questions(text,text[]) is
  'Legacy authenticated reservation compatibility path; Segment16 product UI uses reserve_test_bank_new_questions_v2. Retained for cumulative compatibility and owner-boundary tests.';
comment on function public.reserve_test_bank_new_questions_exact(text,text[],integer) is
  'Legacy authenticated exact reservation compatibility path; Segment16 product UI uses v2 allocation. Retained for cumulative compatibility and owner-boundary tests.';
commit;

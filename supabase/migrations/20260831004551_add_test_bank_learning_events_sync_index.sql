-- Matches the account-ledger hydration query:
-- WHERE user_id = ... ORDER BY occurred_at, event_id.
-- The existing user/exam index remains useful for future exam-scoped views.
create index if not exists test_bank_learning_events_user_occurred_event_idx
  on public.test_bank_learning_events (user_id, occurred_at, event_id);

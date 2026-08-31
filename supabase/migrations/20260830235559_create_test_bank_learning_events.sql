-- Durable, append-only account ledger for test-bank learning activity.
-- Existing `test_bank_progress_devices` remains in place during migration so
-- no learner history is discarded while older browser snapshots converge.

create table if not exists public.test_bank_learning_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  device_id text not null,
  event_type text not null,
  exam_id text not null,
  session_id text not null,
  question_id text null,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  primary key (user_id, event_id),
  constraint test_bank_learning_events_event_id_length check (char_length(event_id) between 8 and 180),
  constraint test_bank_learning_events_device_id_length check (char_length(device_id) between 8 and 180),
  constraint test_bank_learning_events_exam_id_length check (char_length(exam_id) between 2 and 80),
  constraint test_bank_learning_events_session_id_length check (char_length(session_id) between 3 and 180),
  constraint test_bank_learning_events_question_id_length check (question_id is null or char_length(question_id) between 3 and 180),
  constraint test_bank_learning_events_type check (event_type in (
    'session_started', 'question_exposed', 'answer_recorded', 'session_completed', 'session_abandoned'
  )),
  constraint test_bank_learning_events_payload_object check (jsonb_typeof(payload) = 'object'),
  constraint test_bank_learning_events_payload_size check (octet_length(payload::text) <= 65536)
);

comment on table public.test_bank_learning_events is
  'Immutable, account-owned test-bank exposure and answer events. The event ID makes offline retries idempotent.';

create index if not exists test_bank_learning_events_user_exam_occurred_idx
  on public.test_bank_learning_events (user_id, exam_id, occurred_at);

create index if not exists test_bank_learning_events_user_session_idx
  on public.test_bank_learning_events (user_id, session_id);

alter table public.test_bank_learning_events enable row level security;

-- Do not depend on Data API defaults. Only authenticated learners may read or
-- append their own events; there is deliberately no UPDATE or DELETE policy.
revoke all on table public.test_bank_learning_events from public, anon;
grant select, insert on table public.test_bank_learning_events to authenticated;

drop policy if exists "Learners read own learning events" on public.test_bank_learning_events;
create policy "Learners read own learning events"
  on public.test_bank_learning_events
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Learners append own learning events" on public.test_bank_learning_events;
create policy "Learners append own learning events"
  on public.test_bank_learning_events
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

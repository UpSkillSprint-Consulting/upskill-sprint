-- New-lesson announcement emails.
--
-- How it works (see docs/LESSON_EMAILS.md):
--   1. Every build publishes /feeds/lessons.json from the lesson catalog.
--   2. After each production deploy (and hourly as a safety net) the Netlify
--      function `lesson-email-*` calls lesson_email_sync_feed() with that feed.
--   3. The first sync records every existing lesson as `baseline` (never
--      emailed). After that, a lesson path the database has never seen becomes
--      `pending` and is announced exactly once to opted-in, confirmed accounts.
--
-- Guarantees enforced here, not in JavaScript:
--   * A lesson is announced at most once (status machine + row locks).
--   * A recipient gets a campaign at most once (deliveries primary key).
--   * Eligibility is re-checked at send time, so an unsubscribe or account
--     deletion mid-campaign is honoured immediately.
--   * Only one runner works at a time (lease), so the deploy event and the
--     hourly sweep cannot race each other.
--   * Every function here is SECURITY DEFINER, has a fixed search_path and is
--     executable by service_role only. Nothing is exposed to anon/authenticated.

create schema if not exists newsletter_private;
revoke all on schema newsletter_private from public, anon, authenticated;
grant usage on schema newsletter_private to service_role;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists newsletter_private.campaigns (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('test', 'live')),
  dedupe_key text not null check (char_length(dedupe_key) between 8 and 200),
  status text not null default 'sending' check (status in ('sending', 'sent', 'failed', 'cancelled')),
  trigger text not null check (trigger in ('deploy', 'sweep', 'manual')),
  deploy_id text check (deploy_id is null or char_length(deploy_id) <= 100),
  subject text not null check (char_length(subject) between 1 and 300),
  lesson_paths text[] not null check (cardinality(lesson_paths) between 1 and 25),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  recipient_count integer not null default 0 check (recipient_count >= 0),
  sent_count integer not null default 0 check (sent_count >= 0),
  failed_count integer not null default 0 check (failed_count >= 0),
  skipped_count integer not null default 0 check (skipped_count >= 0),
  last_error text check (last_error is null or char_length(last_error) <= 2000),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

-- A failed test send may be retried; any other campaign with the same key may not.
create unique index if not exists campaigns_dedupe_key_active
  on newsletter_private.campaigns (dedupe_key) where status <> 'failed';
create index if not exists campaigns_status_created
  on newsletter_private.campaigns (status, created_at);

create table if not exists newsletter_private.lessons (
  lesson_path text primary key
    check (lesson_path ~ '^/[a-z0-9][a-z0-9/_.-]*$' and char_length(lesson_path) <= 300),
  title text not null check (char_length(btrim(title)) between 1 and 300),
  status text not null check (status in (
    'baseline',   -- existed when the system was switched on; never emailed
    'pending',    -- new; waiting to be announced
    'held',       -- new, but a safety rule stopped it; needs Ernest
    'skipped',    -- author marked <meta name="upskill:email" content="skip">, or Ernest skipped it
    'renamed',    -- new path, same title as a lesson that just left the feed
    'withdrawn',  -- left the feed before it was announced
    'sending',    -- claimed by a live campaign
    'sent'        -- announced
  )),
  status_reason text check (status_reason is null or char_length(status_reason) <= 500),
  approved boolean not null default false,
  in_feed boolean not null default true,
  teaser text check (teaser is null or char_length(teaser) <= 300),
  teaser_source text check (teaser_source is null or teaser_source in ('author', 'ai', 'catalog')),
  campaign_id uuid references newsletter_private.campaigns (id) on delete set null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  announced_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists newsletter_private.deliveries (
  campaign_id uuid not null references newsletter_private.campaigns (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'skipped')),
  attempts integer not null default 0 check (attempts >= 0),
  resend_id text check (resend_id is null or char_length(resend_id) <= 200),
  last_error text check (last_error is null or char_length(last_error) <= 1000),
  queued_at timestamptz not null default now(),
  sent_at timestamptz,
  primary key (campaign_id, user_id)
);
create index if not exists deliveries_campaign_status
  on newsletter_private.deliveries (campaign_id, status);

-- Proof of opt-out (CASL record keeping). profiles.newsletter_consent_at is
-- cleared on opt-out by the existing profile trigger, so the event lives here.
create table if not exists newsletter_private.unsubscribe_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null check (source in ('link', 'one_click')),
  campaign_id uuid references newsletter_private.campaigns (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists unsubscribe_events_user on newsletter_private.unsubscribe_events (user_id);

create table if not exists newsletter_private.runner_lease (
  id boolean primary key default true check (id),
  holder text,
  expires_at timestamptz not null default '-infinity'
);
insert into newsletter_private.runner_lease (id) values (true) on conflict (id) do nothing;

alter table newsletter_private.lessons enable row level security;
alter table newsletter_private.campaigns enable row level security;
alter table newsletter_private.deliveries enable row level security;
alter table newsletter_private.unsubscribe_events enable row level security;
alter table newsletter_private.runner_lease enable row level security;

revoke all on all tables in schema newsletter_private from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- One place that defines who may receive lesson emails.
create or replace function newsletter_private.is_eligible(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    join auth.users u on u.id = p.user_id
    where p.user_id = p_user_id
      and p.newsletter_opt_in
      and p.newsletter_consent_at is not null
      and u.email is not null
      and u.email_confirmed_at is not null
      and u.deleted_at is null
      and (u.banned_until is null or u.banned_until < now())
  );
$$;

-- The submitted feed as rows (used by lesson_email_sync_feed).
create or replace function newsletter_private.feed_rows(p_lessons jsonb)
returns table (lesson_path text, title text, email text)
language sql
immutable
set search_path = ''
as $$
  select btrim(item ->> 'path'), btrim(item ->> 'title'), coalesce(nullif(btrim(item ->> 'email'), ''), 'announce')
  from jsonb_array_elements(p_lessons) item;
$$;

-- ---------------------------------------------------------------------------
-- Runner lease
-- ---------------------------------------------------------------------------

create or replace function public.lesson_email_acquire_lease(p_holder text, p_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ok boolean;
begin
  if p_holder is null or char_length(p_holder) not between 1 and 200 then
    raise exception 'invalid lease holder';
  end if;
  if p_seconds is null or p_seconds not between 10 and 1800 then
    raise exception 'lease seconds must be between 10 and 1800';
  end if;
  update newsletter_private.runner_lease
     set holder = p_holder,
         expires_at = now() + make_interval(secs => p_seconds)
   where id
     and (expires_at < now() or holder = p_holder)
  returning true into v_ok;
  return coalesce(v_ok, false);
end;
$$;

create or replace function public.lesson_email_release_lease(p_holder text)
returns void
language sql
security definer
set search_path = ''
as $$
  update newsletter_private.runner_lease
     set holder = null, expires_at = '-infinity'
   where id and holder = p_holder;
$$;

-- ---------------------------------------------------------------------------
-- Feed sync
-- ---------------------------------------------------------------------------

create or replace function public.lesson_email_sync_feed(p_lessons jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
  v_known integer;
  v_inserted integer := 0;
  v_skipped integer := 0;
  v_renamed integer := 0;
  v_withdrawn integer := 0;
  v_row record;
  v_old_path text;
begin
  if jsonb_typeof(p_lessons) is distinct from 'array' then
    raise exception 'feed must be a JSON array';
  end if;
  v_count := jsonb_array_length(p_lessons);
  if v_count = 0 or v_count > 2000 then
    raise exception 'feed must contain between 1 and 2000 lessons';
  end if;

  if exists (
    select 1 from newsletter_private.feed_rows(p_lessons)
    where lesson_path is null or lesson_path !~ '^/[a-z0-9][a-z0-9/_.-]*$' or char_length(lesson_path) > 300
       or title is null or char_length(title) not between 1 and 300
       or email not in ('announce', 'skip')
  ) then
    raise exception 'feed contains an invalid lesson entry';
  end if;
  if (select count(distinct lesson_path) from newsletter_private.feed_rows(p_lessons)) <> v_count then
    raise exception 'feed repeats a lesson path';
  end if;

  -- Serialise syncs so two runners cannot both decide a lesson is new.
  lock table newsletter_private.lessons in share row exclusive mode;

  select count(*) into v_known from newsletter_private.lessons;

  if v_known = 0 then
    insert into newsletter_private.lessons (lesson_path, title, status, status_reason)
    select lesson_path, title,
           case when email = 'skip' then 'skipped' else 'baseline' end,
           'present when lesson emails were switched on'
    from newsletter_private.feed_rows(p_lessons);
    return jsonb_build_object('bootstrapped', v_count, 'inserted', 0, 'pending', '[]'::jsonb,
      'held', 0, 'skipped', 0, 'renamed', 0, 'withdrawn', 0);
  end if;

  -- Mark what is (not) in the current feed.
  update newsletter_private.lessons l
     set in_feed = true, last_seen_at = now()
   where exists (select 1 from newsletter_private.feed_rows(p_lessons) f where f.lesson_path = l.lesson_path);

  update newsletter_private.lessons l
     set in_feed = false, updated_at = now()
   where l.in_feed
     and not exists (select 1 from newsletter_private.feed_rows(p_lessons) f where f.lesson_path = l.lesson_path);

  -- Pending/held lessons that disappeared before being announced.
  update newsletter_private.lessons
     set status = 'withdrawn', status_reason = 'removed from the lesson catalog before it was announced', updated_at = now()
   where status in ('pending', 'held') and not in_feed;
  get diagnostics v_withdrawn = row_count;

  -- Pending/held lessons the author has since marked skip.
  update newsletter_private.lessons l
     set status = 'skipped', status_reason = 'marked upskill:email=skip', updated_at = now()
    from newsletter_private.feed_rows(p_lessons) f
   where f.lesson_path = l.lesson_path and f.email = 'skip' and l.status in ('pending', 'held');
  get diagnostics v_skipped = row_count;

  -- Keep titles of not-yet-announced lessons current.
  update newsletter_private.lessons l
     set title = f.title, updated_at = now()
    from newsletter_private.feed_rows(p_lessons) f
   where f.lesson_path = l.lesson_path and l.status in ('pending', 'held') and l.title <> f.title;

  -- Brand-new paths.
  for v_row in
    select f.lesson_path, f.title, f.email
    from newsletter_private.feed_rows(p_lessons) f
    left join newsletter_private.lessons l on l.lesson_path = f.lesson_path
    where l.lesson_path is null
    order by f.lesson_path
  loop
    if v_row.email = 'skip' then
      insert into newsletter_private.lessons (lesson_path, title, status, status_reason)
      values (v_row.lesson_path, v_row.title, 'skipped', 'marked upskill:email=skip');
      v_skipped := v_skipped + 1;
      continue;
    end if;

    -- A path change (same title, old path just left the feed) is not a new lesson.
    select l.lesson_path into v_old_path
      from newsletter_private.lessons l
     where not l.in_feed
       and lower(btrim(l.title)) = lower(btrim(v_row.title))
       and l.status in ('baseline', 'sent', 'skipped', 'renamed', 'sending')
     order by l.last_seen_at desc
     limit 1;

    if v_old_path is not null then
      insert into newsletter_private.lessons (lesson_path, title, status, status_reason)
      values (v_row.lesson_path, v_row.title, 'renamed', 'same title as ' || v_old_path || ', which left the catalog');
      v_renamed := v_renamed + 1;
    else
      insert into newsletter_private.lessons (lesson_path, title, status, status_reason)
      values (v_row.lesson_path, v_row.title, 'pending', null);
      v_inserted := v_inserted + 1;
    end if;
  end loop;

  return jsonb_build_object(
    'bootstrapped', 0,
    'inserted', v_inserted,
    'skipped', v_skipped,
    'renamed', v_renamed,
    'withdrawn', v_withdrawn,
    'held', (select count(*) from newsletter_private.lessons where status = 'held'),
    'pending', coalesce((
      select jsonb_agg(jsonb_build_object(
               'path', lesson_path, 'title', title, 'approved', approved,
               'teaser', teaser, 'teaser_source', teaser_source, 'first_seen_at', first_seen_at)
             order by first_seen_at, lesson_path)
      from newsletter_private.lessons where status = 'pending'), '[]'::jsonb)
  );
end;
$$;

-- Stop pending lessons (safety cap, lesson not live, configuration problem).
-- Returns how many were newly held, so alerts are sent once.
create or replace function public.lesson_email_hold(p_paths text[], p_reason text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  update newsletter_private.lessons
     set status = 'held', status_reason = left(coalesce(p_reason, 'held'), 500), updated_at = now()
   where lesson_path = any (coalesce(p_paths, '{}')) and status = 'pending';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function public.lesson_email_set_teaser(p_path text, p_teaser text, p_source text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_source not in ('author', 'ai', 'catalog') then raise exception 'invalid teaser source'; end if;
  if p_teaser is null or char_length(p_teaser) not between 1 and 300 then raise exception 'invalid teaser'; end if;
  update newsletter_private.lessons
     set teaser = p_teaser, teaser_source = p_source, updated_at = now()
   where lesson_path = p_path and status in ('pending', 'held');
end;
$$;

-- ---------------------------------------------------------------------------
-- Campaigns
-- ---------------------------------------------------------------------------

create or replace function public.lesson_email_open_campaign(
  p_mode text,
  p_dedupe_key text,
  p_paths text[],
  p_subject text,
  p_snapshot jsonb,
  p_trigger text,
  p_deploy_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_claimed integer;
  v_recipients integer := 0;
begin
  if p_mode not in ('test', 'live') then raise exception 'invalid mode'; end if;
  if p_paths is null or cardinality(p_paths) = 0 then raise exception 'no lessons'; end if;

  if exists (select 1 from newsletter_private.campaigns where dedupe_key = p_dedupe_key and status <> 'failed') then
    return jsonb_build_object('created', false, 'reason', 'duplicate');
  end if;

  if p_mode = 'live' then
    perform 1 from newsletter_private.lessons
     where lesson_path = any (p_paths) and status = 'pending'
     for update;
    select count(*) into v_claimed from newsletter_private.lessons
     where lesson_path = any (p_paths) and status = 'pending';
    if v_claimed <> cardinality(p_paths) then
      return jsonb_build_object('created', false, 'reason', 'not_pending');
    end if;
  end if;

  insert into newsletter_private.campaigns (mode, dedupe_key, trigger, deploy_id, subject, lesson_paths, snapshot)
  values (p_mode, p_dedupe_key, p_trigger, p_deploy_id, p_subject, p_paths, p_snapshot)
  returning id into v_id;

  if p_mode = 'live' then
    update newsletter_private.lessons
       set status = 'sending', campaign_id = v_id, updated_at = now()
     where lesson_path = any (p_paths) and status = 'pending';

    insert into newsletter_private.deliveries (campaign_id, user_id)
    select v_id, p.user_id
    from public.profiles p
    where newsletter_private.is_eligible(p.user_id);
    get diagnostics v_recipients = row_count;

    update newsletter_private.campaigns set recipient_count = v_recipients where id = v_id;
  end if;

  return jsonb_build_object('created', true, 'id', v_id, 'recipient_count', v_recipients);
end;
$$;

-- Live campaigns interrupted mid-send (deadline, crash, rate limit) are resumed.
create or replace function public.lesson_email_active_campaigns()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', id, 'subject', subject, 'lesson_paths', lesson_paths, 'snapshot', snapshot,
           'created_at', created_at) order by created_at), '[]'::jsonb)
  from newsletter_private.campaigns
  where mode = 'live' and status = 'sending';
$$;

-- Next recipients to send. Anyone no longer eligible is marked skipped first.
create or replace function public.lesson_email_next_batch(p_campaign_id uuid, p_limit integer)
returns table (user_id uuid, email text, display_name text)
language plpgsql
security definer
set search_path = ''
as $$
begin
  update newsletter_private.deliveries d
     set status = 'skipped', last_error = 'no longer eligible (unsubscribed, unconfirmed, banned or deleted)'
   where d.campaign_id = p_campaign_id and d.status = 'queued'
     and not newsletter_private.is_eligible(d.user_id);

  update newsletter_private.deliveries d
     set status = 'failed', last_error = coalesce(d.last_error, 'too many attempts')
   where d.campaign_id = p_campaign_id and d.status = 'queued' and d.attempts >= 5;

  return query
    select d.user_id, u.email::text, p.display_name
    from newsletter_private.deliveries d
    join auth.users u on u.id = d.user_id
    join public.profiles p on p.user_id = d.user_id
    where d.campaign_id = p_campaign_id and d.status = 'queued'
    order by d.user_id
    limit greatest(1, least(coalesce(p_limit, 100), 100));
end;
$$;

-- p_results: [{"user_id": "...", "outcome": "sent"|"failed"|"retry", "resend_id": "...", "error": "..."}]
create or replace function public.lesson_email_record_results(p_campaign_id uuid, p_results jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if jsonb_typeof(p_results) is distinct from 'array' then raise exception 'results must be an array'; end if;

  update newsletter_private.deliveries d
     set status = case r.outcome when 'sent' then 'sent' when 'failed' then 'failed' else 'queued' end,
         attempts = d.attempts + 1,
         resend_id = coalesce(left(r.resend_id, 200), d.resend_id),
         last_error = case when r.outcome = 'sent' then null else left(r.error, 1000) end,
         sent_at = case when r.outcome = 'sent' then now() else d.sent_at end
    from jsonb_to_recordset(p_results) as r(user_id uuid, outcome text, resend_id text, error text)
   where d.campaign_id = p_campaign_id
     and d.user_id = r.user_id
     and d.status = 'queued'
     and r.outcome in ('sent', 'failed', 'retry');
end;
$$;

create or replace function public.lesson_email_finish_campaign(p_campaign_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_campaign newsletter_private.campaigns%rowtype;
  v_queued integer;
  v_sent integer;
  v_failed integer;
  v_skipped integer;
  v_status text;
begin
  select * into v_campaign from newsletter_private.campaigns where id = p_campaign_id for update;
  if not found then raise exception 'unknown campaign'; end if;
  if v_campaign.mode <> 'live' then raise exception 'use lesson_email_finish_test for test campaigns'; end if;
  if v_campaign.status <> 'sending' then
    return jsonb_build_object('done', true, 'status', v_campaign.status, 'sent', v_campaign.sent_count,
      'failed', v_campaign.failed_count, 'skipped', v_campaign.skipped_count, 'recipients', v_campaign.recipient_count,
      'already_finished', true);
  end if;

  select count(*) filter (where status = 'queued'),
         count(*) filter (where status = 'sent'),
         count(*) filter (where status = 'failed'),
         count(*) filter (where status = 'skipped')
    into v_queued, v_sent, v_failed, v_skipped
    from newsletter_private.deliveries where campaign_id = p_campaign_id;

  update newsletter_private.campaigns
     set sent_count = v_sent, failed_count = v_failed, skipped_count = v_skipped
   where id = p_campaign_id;

  if v_queued > 0 then
    return jsonb_build_object('done', false, 'queued', v_queued, 'sent', v_sent, 'failed', v_failed, 'skipped', v_skipped);
  end if;

  -- Every recipient failed: nothing reached anyone. Mark failed for review;
  -- the lessons stay claimed (status 'sending') so they are never re-announced
  -- automatically. Ernest decides (docs/LESSON_EMAILS.md, "If a campaign fails").
  v_status := case when v_sent = 0 and v_failed > 0 then 'failed' else 'sent' end;

  update newsletter_private.campaigns
     set status = v_status, finished_at = now()
   where id = p_campaign_id;

  if v_status = 'sent' then
    update newsletter_private.lessons
       set status = 'sent', announced_at = now(), updated_at = now()
     where campaign_id = p_campaign_id and status = 'sending';
  end if;

  return jsonb_build_object('done', true, 'status', v_status, 'sent', v_sent, 'failed', v_failed,
    'skipped', v_skipped, 'recipients', v_campaign.recipient_count, 'already_finished', false);
end;
$$;

create or replace function public.lesson_email_finish_test(
  p_campaign_id uuid, p_ok boolean, p_sent integer, p_error text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update newsletter_private.campaigns
     set status = case when p_ok then 'sent' else 'failed' end,
         recipient_count = greatest(coalesce(p_sent, 0), 0),
         sent_count = case when p_ok then greatest(coalesce(p_sent, 0), 0) else 0 end,
         last_error = left(p_error, 2000),
         finished_at = now()
   where id = p_campaign_id and mode = 'test' and status = 'sending';
end;
$$;

create or replace function public.lesson_email_fail_campaign(p_campaign_id uuid, p_error text)
returns void
language sql
security definer
set search_path = ''
as $$
  update newsletter_private.campaigns
     set last_error = left(p_error, 2000)
   where id = p_campaign_id;
$$;

-- ---------------------------------------------------------------------------
-- Unsubscribe
-- ---------------------------------------------------------------------------

create or replace function public.newsletter_unsubscribe(p_user_id uuid, p_source text, p_campaign_id uuid default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_changed integer;
begin
  if p_source not in ('link', 'one_click') then raise exception 'invalid source'; end if;
  if not exists (select 1 from public.profiles where user_id = p_user_id) then
    return 'unknown';
  end if;

  update public.profiles set newsletter_opt_in = false
   where user_id = p_user_id and newsletter_opt_in;
  get diagnostics v_changed = row_count;

  insert into newsletter_private.unsubscribe_events (user_id, source, campaign_id)
  values (p_user_id, p_source,
          case when exists (select 1 from newsletter_private.campaigns where id = p_campaign_id) then p_campaign_id end);

  -- Stop any queued sends to this person right away.
  update newsletter_private.deliveries
     set status = 'skipped', last_error = 'unsubscribed'
   where user_id = p_user_id and status = 'queued';

  return case when v_changed > 0 then 'unsubscribed' else 'already' end;
end;
$$;

-- ---------------------------------------------------------------------------
-- Owner tools (run from the Supabase SQL editor)
-- ---------------------------------------------------------------------------

-- Overview: what is pending/held, recent campaigns, audience size.
create or replace function public.lesson_email_status()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'lessons_by_status', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb)
                            from (select status, count(*) n from newsletter_private.lessons group by status) s),
    'needs_attention', (select coalesce(jsonb_agg(jsonb_build_object('path', lesson_path, 'title', title,
                                 'status', status, 'reason', status_reason) order by first_seen_at), '[]'::jsonb)
                          from newsletter_private.lessons where status in ('pending', 'held', 'sending')),
    'eligible_recipients', (select count(*) from public.profiles p where newsletter_private.is_eligible(p.user_id)),
    'recent_campaigns', (select coalesce(jsonb_agg(c order by c.created_at desc), '[]'::jsonb) from (
                           select id, mode, status, subject, lesson_paths, recipient_count, sent_count,
                                  failed_count, skipped_count, last_error, created_at, finished_at
                           from newsletter_private.campaigns order by created_at desc limit 10) c),
    'unsubscribes_last_30_days', (select count(*) from newsletter_private.unsubscribe_events
                                   where created_at > now() - interval '30 days')
  );
$$;

-- Release held lessons: they are sent on the next run even if the cap is exceeded.
-- Also re-queues lessons whose live campaign failed for every recipient.
create or replace function public.lesson_email_release(p_paths text[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  update newsletter_private.lessons l
     set status = 'pending', approved = true, campaign_id = null,
         status_reason = 'released by owner', updated_at = now()
   where l.lesson_path = any (coalesce(p_paths, '{}'))
     and l.in_feed
     and (l.status in ('held', 'renamed', 'withdrawn')
          or (l.status = 'sending' and exists (
                select 1 from newsletter_private.campaigns c
                where c.id = l.campaign_id and c.status = 'failed')));
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- Never announce these lessons.
create or replace function public.lesson_email_skip(p_paths text[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  update newsletter_private.lessons l
     set status = 'skipped', status_reason = 'skipped by owner', updated_at = now()
   where l.lesson_path = any (coalesce(p_paths, '{}'))
     and (l.status in ('pending', 'held', 'renamed', 'withdrawn')
          or (l.status = 'sending' and exists (
                select 1 from newsletter_private.campaigns c
                where c.id = l.campaign_id and c.status = 'failed')));
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- Privileges: service_role only.
-- ---------------------------------------------------------------------------

revoke all on function newsletter_private.is_eligible(uuid) from public, anon, authenticated;
revoke all on function newsletter_private.feed_rows(jsonb) from public, anon, authenticated;
revoke all on function public.lesson_email_acquire_lease(text, integer) from public, anon, authenticated;
revoke all on function public.lesson_email_release_lease(text) from public, anon, authenticated;
revoke all on function public.lesson_email_sync_feed(jsonb) from public, anon, authenticated;
revoke all on function public.lesson_email_hold(text[], text) from public, anon, authenticated;
revoke all on function public.lesson_email_set_teaser(text, text, text) from public, anon, authenticated;
revoke all on function public.lesson_email_open_campaign(text, text, text[], text, jsonb, text, text) from public, anon, authenticated;
revoke all on function public.lesson_email_active_campaigns() from public, anon, authenticated;
revoke all on function public.lesson_email_next_batch(uuid, integer) from public, anon, authenticated;
revoke all on function public.lesson_email_record_results(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.lesson_email_finish_campaign(uuid) from public, anon, authenticated;
revoke all on function public.lesson_email_finish_test(uuid, boolean, integer, text) from public, anon, authenticated;
revoke all on function public.lesson_email_fail_campaign(uuid, text) from public, anon, authenticated;
revoke all on function public.newsletter_unsubscribe(uuid, text, uuid) from public, anon, authenticated;
revoke all on function public.lesson_email_status() from public, anon, authenticated;
revoke all on function public.lesson_email_release(text[]) from public, anon, authenticated;
revoke all on function public.lesson_email_skip(text[]) from public, anon, authenticated;

grant execute on function public.lesson_email_acquire_lease(text, integer) to service_role;
grant execute on function public.lesson_email_release_lease(text) to service_role;
grant execute on function public.lesson_email_sync_feed(jsonb) to service_role;
grant execute on function public.lesson_email_hold(text[], text) to service_role;
grant execute on function public.lesson_email_set_teaser(text, text, text) to service_role;
grant execute on function public.lesson_email_open_campaign(text, text, text[], text, jsonb, text, text) to service_role;
grant execute on function public.lesson_email_active_campaigns() to service_role;
grant execute on function public.lesson_email_next_batch(uuid, integer) to service_role;
grant execute on function public.lesson_email_record_results(uuid, jsonb) to service_role;
grant execute on function public.lesson_email_finish_campaign(uuid) to service_role;
grant execute on function public.lesson_email_finish_test(uuid, boolean, integer, text) to service_role;
grant execute on function public.lesson_email_fail_campaign(uuid, text) to service_role;
grant execute on function public.newsletter_unsubscribe(uuid, text, uuid) to service_role;
grant execute on function public.lesson_email_status() to service_role;

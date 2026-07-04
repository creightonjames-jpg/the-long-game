-- Club GM Simulator — multi-user run storage
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  xp int not null,
  outcome text not null check (outcome in ('completed', 'terminated')),
  badges jsonb not null default '[]',
  competency_scores jsonb not null,
  choice_log jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table runs enable row level security;

-- The game writes and reads with the anon key. Tighten these policies
-- (e.g. require auth) before any public deployment beyond the pipeline cohort.
create policy "anyone can record a run"
  on runs for insert
  with check (true);

create policy "anyone can read runs"
  on runs for select
  using (true);

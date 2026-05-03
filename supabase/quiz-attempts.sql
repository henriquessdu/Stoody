-- Run this in the Supabase SQL editor.
-- Stores finished quiz attempts so users can review their answers later.

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  course_title text not null,
  answers jsonb not null default '[]'::jsonb,
  correct_answers integer not null default 0,
  total_questions integer not null default 0,
  accuracy integer not null default 0,
  xp_earned integer not null default 0,
  coins_earned integer not null default 0,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_user_course_completed_idx
on public.quiz_attempts (user_id, course_id, completed_at desc);

alter table public.quiz_attempts enable row level security;

drop policy if exists "Users can read their own quiz attempts" on public.quiz_attempts;

create policy "Users can read their own quiz attempts"
on public.quiz_attempts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own quiz attempts" on public.quiz_attempts;

create policy "Users can create their own quiz attempts"
on public.quiz_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

-- Run this in the Supabase SQL editor.
-- The React leaderboard already queries every profile. If only the logged-in
-- user appears, Row Level Security is limiting SELECT to auth.uid() = id.

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by authenticated users" on public.profiles;

create policy "Profiles are readable by authenticated users"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

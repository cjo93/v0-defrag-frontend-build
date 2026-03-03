-- Enable RLS on core tables
alter table public.users enable row level security;
alter table public.relationship_nodes enable row level security;
alter table public.conflict_events enable row level security;
alter table public.decision_events enable row level security;

-- Users Table Policies
create policy "Users can read own record"
on public.users
for select
using (auth.uid() = id);

create policy "Users can update own record"
on public.users
for update
using (auth.uid() = id);

-- Relationship Nodes Policies
create policy "User can select own relationships"
on public.relationship_nodes
for select
using (auth.uid() = user_id);

create policy "User can insert own relationships"
on public.relationship_nodes
for insert
with check (auth.uid() = user_id);

create policy "User can update own relationships"
on public.relationship_nodes
for update
using (auth.uid() = user_id);

create policy "User can delete own relationships"
on public.relationship_nodes
for delete
using (auth.uid() = user_id);

-- Conflict Events Policies
create policy "User can select own conflicts"
on public.conflict_events
for select
using (auth.uid() = user_id);

create policy "User can insert own conflicts"
on public.conflict_events
for insert
with check (auth.uid() = user_id);

create policy "User can update own conflicts"
on public.conflict_events
for update
using (auth.uid() = user_id);

create policy "User can delete own conflicts"
on public.conflict_events
for delete
using (auth.uid() = user_id);

-- Decision Events Policies
create policy "User can read own decisions"
on public.decision_events
for select
using (auth.uid() = user_id);

-- Daily Stability & Timing (Client can only read)
-- Ensure they are enabled in case 0003 didn't apply
alter table public.daily_stability enable row level security;
alter table public.daily_timing enable row level security;

-- Ensure select policies for stability/timing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'daily_stability' AND policyname = 'User can read own stability'
    ) THEN
        create policy "User can read own stability"
        on public.daily_stability
        for select
        using (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'daily_timing' AND policyname = 'User can read own timing'
    ) THEN
        create policy "User can read own timing"
        on public.daily_timing
        for select
        using (auth.uid() = user_id);
    END IF;
END $$;

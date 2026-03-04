-- Daily relational briefing cache: one summary per user per day
create table if not exists public.daily_relational_briefing (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete cascade,
  briefing_date date not null,
  summary text,
  created_at timestamptz default now(),
  unique (owner_user_id, briefing_date)
);

create index if not exists briefing_user_idx
  on public.daily_relational_briefing (owner_user_id);

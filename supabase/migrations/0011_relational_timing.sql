-- Relational timing: behavioral pattern tracking by time of day and day of week
create table if not exists public.relationship_timing (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  hour_of_day int not null check (hour_of_day between 0 and 23),
  pattern text not null,
  occurrence_count integer default 1,
  created_at timestamptz default now(),
  unique (owner_user_id, person_id, day_of_week, hour_of_day, pattern)
);

create index if not exists relationship_timing_person_idx
  on public.relationship_timing (person_id);

create index if not exists relationship_timing_user_idx
  on public.relationship_timing (owner_user_id);

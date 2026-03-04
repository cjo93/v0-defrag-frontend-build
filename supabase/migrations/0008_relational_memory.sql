-- User-level relational profile: long-term dynamic awareness
create table if not exists public.user_relational_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dominant_patterns text[] default '{}',
  boundary_style text,
  conflict_style text,
  last_updated timestamptz default now()
);

-- Per-person relationship memory: evolving summary
create table if not exists public.relationship_memory (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  summary text,
  last_updated timestamptz default now(),
  unique (owner_user_id, person_id)
);

create index if not exists relationship_memory_person_idx
  on public.relationship_memory (person_id);

create index if not exists relationship_memory_owner_idx
  on public.relationship_memory (owner_user_id);

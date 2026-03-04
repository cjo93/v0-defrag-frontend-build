-- Conversation anchoring: recurring pattern tracking per relationship
create table if not exists public.relationship_anchor (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  anchor_pattern text not null,
  occurrence_count integer default 1,
  last_seen timestamptz default now(),
  created_at timestamptz default now(),
  unique (owner_user_id, person_id, anchor_pattern)
);

create index if not exists relationship_anchor_person_idx
  on public.relationship_anchor (person_id);

create index if not exists relationship_anchor_user_idx
  on public.relationship_anchor (owner_user_id);

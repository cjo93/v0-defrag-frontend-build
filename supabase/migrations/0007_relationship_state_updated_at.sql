-- Add timestamp column for stale detection on relationship state recomputation
alter table people
  add column if not exists relationship_state_updated_at timestamptz default now();

-- Backfill existing rows so they don't all appear stale on first run
update people set relationship_state_updated_at = now()
  where relationship_state is not null
    and relationship_state_updated_at is null;

-- 0006_people_relationship_state.sql
-- Add relationship_state column to people for persistent relational tracking.

alter table if exists public.people
add column if not exists relationship_state text;

alter table public.people
add constraint people_relationship_state_check
check (relationship_state in ('stable','strained','cooling','improving','unclear'));

create index if not exists people_owner_state_idx
on public.people (owner_user_id, relationship_state);

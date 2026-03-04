-- DEFRAG Invite System Migration
-- Tables: invites, people
-- invites = one-time magic link tokens for natal data collection
-- people  = natal records owned by the inviter

-- ─── INVITES ───
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  invitee_name TEXT,
  invitee_contact TEXT,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ─── PEOPLE ───
CREATE TABLE IF NOT EXISTS public.people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  invite_id UUID REFERENCES public.invites(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  relationship_label TEXT,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_place TEXT,
  privacy_level TEXT DEFAULT 'full' CHECK (privacy_level IN ('full', 'partial', 'minimal')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INDEXES ───
CREATE INDEX IF NOT EXISTS idx_invites_token ON public.invites(token);
CREATE INDEX IF NOT EXISTS idx_invites_inviter ON public.invites(inviter_user_id);
CREATE INDEX IF NOT EXISTS idx_people_owner ON public.people(owner_user_id);

-- ─── RLS ───
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

-- Invites: only inviter can read/write their own invites
CREATE POLICY "invites_select_own" ON public.invites
  FOR SELECT USING (inviter_user_id = auth.uid());

CREATE POLICY "invites_insert_own" ON public.invites
  FOR INSERT WITH CHECK (inviter_user_id = auth.uid());

CREATE POLICY "invites_update_own" ON public.invites
  FOR UPDATE USING (inviter_user_id = auth.uid());

-- People: only owner can read/write their own people
CREATE POLICY "people_select_own" ON public.people
  FOR SELECT USING (owner_user_id = auth.uid());

CREATE POLICY "people_insert_own" ON public.people
  FOR INSERT WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "people_update_own" ON public.people
  FOR UPDATE USING (owner_user_id = auth.uid());

CREATE POLICY "people_delete_own" ON public.people
  FOR DELETE USING (owner_user_id = auth.uid());

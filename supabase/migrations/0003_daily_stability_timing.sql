-- Create daily_stability table
CREATE TABLE IF NOT EXISTS public.daily_stability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    label TEXT NOT NULL CHECK (label IN ('low', 'moderate', 'strong')),
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Create daily_timing table
CREATE TABLE IF NOT EXISTS public.daily_timing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    state TEXT NOT NULL CHECK (state IN ('push', 'neutral', 'protect')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_stability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_timing ENABLE ROW LEVEL SECURITY;

-- Read policies for users (they can only read their own data)
CREATE POLICY "Users can read own daily_stability" ON public.daily_stability
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own daily_timing" ON public.daily_timing
    FOR SELECT USING (auth.uid() = user_id);

-- Note: No INSERT, UPDATE, or DELETE policies are created for users.
-- Only the service_role (used by the cron job) can write to these tables.

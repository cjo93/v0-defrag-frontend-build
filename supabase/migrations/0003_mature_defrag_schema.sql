-- 0003_mature_defrag_schema.sql
-- EPIC 1 - AUTH & DATA ISOLATION
-- TICKET 1.2 - Deletion Integrity
-- Add missing tables required for deletion integrity
-- audio_cache and derived_aggregates

CREATE TABLE IF NOT EXISTS public.audio_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_text TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.derived_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    aggregate_type TEXT NOT NULL,
    data JSONB NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.derived_aggregates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own audio_cache" ON public.audio_cache
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own derived_aggregates" ON public.derived_aggregates
    FOR ALL USING (auth.uid() = user_id);

-- Rename stability_logs to stability_history to match the spec
ALTER TABLE IF EXISTS public.stability_logs RENAME TO stability_history;

-- Update RLS policy name for clarity
ALTER POLICY "Users can manage their own stability_logs" ON public.stability_history
    RENAME TO "Users can manage their own stability_history";

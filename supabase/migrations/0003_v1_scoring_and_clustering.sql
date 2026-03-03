-- Update conflict_events table
-- First drop the foreign key to allow rename
ALTER TABLE public.conflict_events DROP CONSTRAINT IF EXISTS fk_related_person;

ALTER TABLE public.conflict_events RENAME COLUMN related_person_id TO relationship_id;
ALTER TABLE public.conflict_events ADD COLUMN IF NOT EXISTS trigger_tag TEXT;
ALTER TABLE public.conflict_events ADD COLUMN IF NOT EXISTS time_of_day_bucket TEXT;

-- Re-add foreign key using the new column name
ALTER TABLE public.conflict_events
    ADD CONSTRAINT fk_relationship
    FOREIGN KEY (relationship_id)
    REFERENCES public.relationship_nodes(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS conflict_events_user_id_idx ON public.conflict_events(user_id);
CREATE INDEX IF NOT EXISTS conflict_events_relationship_id_idx ON public.conflict_events(relationship_id);
CREATE INDEX IF NOT EXISTS conflict_events_timestamp_idx ON public.conflict_events(timestamp);


-- Create daily_stability table
CREATE TABLE IF NOT EXISTS public.daily_stability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sleep_score INTEGER CHECK (sleep_score >= 0 AND sleep_score <= 100),
    stress_score INTEGER CHECK (stress_score >= 0 AND stress_score <= 100),
    conflict_density INTEGER CHECK (conflict_density >= 0 AND conflict_density <= 100),
    escalation_avg INTEGER CHECK (escalation_avg >= 0 AND escalation_avg <= 100),
    stability_score INTEGER CHECK (stability_score >= 0 AND stability_score <= 100),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

ALTER TABLE public.daily_stability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own daily_stability" ON public.daily_stability
    FOR ALL USING (auth.uid() = user_id);

-- Create pattern_clusters materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.pattern_clusters AS
SELECT
    relationship_id,
    trigger_tag,
    count(*) as occurrence_count
FROM public.conflict_events
WHERE timestamp > now() - INTERVAL '30 days'
GROUP BY relationship_id, trigger_tag
HAVING count(*) >= 3;

-- Note: Materialized views do not support RLS directly.
-- Access to this view should be controlled via functions or by querying it in
-- conjunction with tables that have RLS applied (or by using security definer functions).

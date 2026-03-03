-- Create conflict_events table
CREATE TABLE IF NOT EXISTS public.conflict_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    related_person_id UUID, -- References relationship_nodes if applicable
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    severity_score INTEGER CHECK (severity_score >= 0 AND severity_score <= 100),
    stability_score INTEGER CHECK (stability_score >= 0 AND stability_score <= 100),
    topic_tag TEXT,
    resolved_flag BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create decision_events table
CREATE TABLE IF NOT EXISTS public.decision_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    decision_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    stability_score INTEGER CHECK (stability_score >= 0 AND stability_score <= 100),
    conflict_load INTEGER CHECK (conflict_load >= 0 AND conflict_load <= 100),
    volatility_state TEXT,
    pause_recommended BOOLEAN DEFAULT false,
    pause_followed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create relationship_nodes table
CREATE TABLE IF NOT EXISTS public.relationship_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relation_type TEXT,
    status_indicator TEXT CHECK (status_indicator IN ('Calm', 'Sensitive', 'Reactive')),
    conflict_frequency INTEGER DEFAULT 0,
    pattern_summary TEXT,
    stability_interaction_note TEXT,
    timing_recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add foreign key constraint to conflict_events now that relationship_nodes exists
ALTER TABLE public.conflict_events
    ADD CONSTRAINT fk_related_person
    FOREIGN KEY (related_person_id)
    REFERENCES public.relationship_nodes(id) ON DELETE SET NULL;

-- Create relationship_edges table (for graphs)
CREATE TABLE IF NOT EXISTS public.relationship_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES public.relationship_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES public.relationship_nodes(id) ON DELETE CASCADE,
    conflict_frequency_weight INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(source_node_id, target_node_id)
);

-- Create stability_logs table
CREATE TABLE IF NOT EXISTS public.stability_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stability_score INTEGER NOT NULL CHECK (stability_score >= 0 AND stability_score <= 100),
    label TEXT CHECK (label IN ('Low', 'Moderate', 'Strong')),
    sleep_score INTEGER CHECK (sleep_score >= 0 AND sleep_score <= 100),
    stress_self_report INTEGER CHECK (stress_self_report >= 0 AND stress_self_report <= 100),
    emotional_volatility INTEGER CHECK (emotional_volatility >= 0 AND emotional_volatility <= 100),
    conflict_frequency INTEGER,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.conflict_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stability_logs ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (users can only see and manage their own data)
CREATE POLICY "Users can manage their own conflict_events" ON public.conflict_events
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own decision_events" ON public.decision_events
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own relationship_nodes" ON public.relationship_nodes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own relationship_edges" ON public.relationship_edges
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own stability_logs" ON public.stability_logs
    FOR ALL USING (auth.uid() = user_id);

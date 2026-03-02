-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create staging table for Phase 1 flows
CREATE TABLE IF NOT EXISTS public.staged_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manual_type TEXT NOT NULL CHECK (manual_type IN ('individual', 'relational')),
    relationship_context TEXT,
    status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'unlocked', 'processing', 'completed', 'failed')),
    precision_badge TEXT DEFAULT 'high',

    -- JSONB payloads to hold the data exactly as shaped in the V1.2 specs
    -- "Just Me" flow uses target_data
    -- "Me + Someone" flow uses primary_data and secondary_data
    target_data JSONB,
    primary_data JSONB,
    secondary_data JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.staged_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since they are creating the session before paying/auth)
CREATE POLICY "Allow anonymous inserts" ON public.staged_sessions
    FOR INSERT
    WITH CHECK (true);

-- No public SELECT policy needed.
-- The backend routes (/api/checkout, /api/webhooks/stripe) use the service_role key to bypass RLS.

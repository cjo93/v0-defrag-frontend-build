-- 1. Create deletion_logs table to verify deletions cryptographically
CREATE TABLE IF NOT EXISTS public.deletion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted_record_id UUID NOT NULL,
    record_type TEXT NOT NULL,
    deleted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receipt_hash TEXT NOT NULL,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on deletion_logs
ALTER TABLE public.deletion_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own deletion_logs" ON public.deletion_logs
    FOR SELECT USING (auth.uid() = deleted_by);

CREATE POLICY "Users cannot insert or modify deletion_logs directly" ON public.deletion_logs
    FOR ALL USING (false);

-- 2. Create ai_responses table with JSONB structure constraint if not exists
CREATE TABLE IF NOT EXISTS public.ai_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_context TEXT,
    response_jsonb JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT chk_ai_response_schema CHECK (
        response_jsonb ? 'headline' AND
        response_jsonb ? 'signal' AND
        response_jsonb ? 'confidence' AND
        response_jsonb ? 'whats_happening' AND
        response_jsonb ? 'do_this_now' AND
        response_jsonb ? 'one_line_to_say' AND
        response_jsonb ? 'repeat_pattern' AND
        response_jsonb ? 'safety'
    )
);

-- Enable RLS on ai_responses
ALTER TABLE public.ai_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ai_responses" ON public.ai_responses
    FOR ALL USING (auth.uid() = user_id);

-- 3. Trigger for cascading deletes to populate deletion_logs

-- Create a generic trigger function for logging deletions
CREATE OR REPLACE FUNCTION log_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.deletion_logs (
        deleted_record_id,
        record_type,
        deleted_by,
        receipt_hash
    ) VALUES (
        OLD.id,
        TG_TABLE_NAME,
        auth.uid(),
        encode(digest(OLD.id::text || TG_TABLE_NAME || auth.uid()::text || now()::text, 'sha256'), 'hex')
    );
    RETURN OLD;
END;
$$;

-- Apply trigger to sovereign tables
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN
        SELECT unnest(ARRAY['conflict_events', 'decision_events', 'relationship_nodes', 'relationship_edges', 'stability_logs', 'ai_responses'])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_log_deletion_%I ON public.%I;
            CREATE TRIGGER trg_log_deletion_%I
            AFTER DELETE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION log_deletion();
        ', table_name, table_name, table_name, table_name);
    END LOOP;
END;
$$;

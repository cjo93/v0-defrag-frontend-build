-- DEFRAG Migration 0004: Rename plan_tier → plan, core → basic, network → plus
-- This migration renames the column and updates enum values.

-- Step 1: Add a new text column 'plan' with the mapped values
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'basic'
  CHECK (plan IN ('basic', 'plus'));

-- Step 2: Migrate existing data from plan_tier to plan
UPDATE public.profiles
  SET plan = CASE
    WHEN plan_tier::text = 'network' THEN 'plus'
    ELSE 'basic'
  END
  WHERE plan_tier IS NOT NULL;

-- Step 3: Drop the old plan_tier column (and its enum dependency)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS plan_tier;

-- Step 4: Drop the old enum type (no longer needed)
DROP TYPE IF EXISTS plan_tier;

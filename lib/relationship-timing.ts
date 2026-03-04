/**
 * Relationship Timing — behavioral pattern tracking by time.
 *
 * Tracks when specific relational patterns occur (day of week + hour).
 * Allows the AI to reference temporal behavior patterns like:
 * "Interactions with this person tend to escalate in the evening."
 *
 * Cost: 1 DB read + 1 DB write per chat with a person. Zero LLM cost.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Record a pattern occurrence at the current time.
 */
export async function updateRelationshipTiming(
  admin: SupabaseClient,
  userId: string,
  personId: string,
  pattern: string,
): Promise<void> {
  if (!pattern || pattern === 'unknown') return;

  const now = new Date();
  const day = now.getDay();   // 0 = Sunday
  const hour = now.getHours();

  const { data } = await admin
    .from('relationship_timing')
    .select('id, occurrence_count')
    .eq('owner_user_id', userId)
    .eq('person_id', personId)
    .eq('day_of_week', day)
    .eq('hour_of_day', hour)
    .eq('pattern', pattern)
    .maybeSingle();

  if (data) {
    await admin
      .from('relationship_timing')
      .update({
        occurrence_count: data.occurrence_count + 1,
      })
      .eq('id', data.id);
  } else {
    await admin
      .from('relationship_timing')
      .insert({
        owner_user_id: userId,
        person_id: personId,
        day_of_week: day,
        hour_of_day: hour,
        pattern,
      });
  }
}

/**
 * Get the most frequent pattern for this person at the current time slot.
 * Returns null if no timing data exists yet.
 */
export async function getTimingInsight(
  admin: SupabaseClient,
  userId: string,
  personId: string,
): Promise<{ pattern: string; occurrence_count: number } | null> {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  const { data } = await admin
    .from('relationship_timing')
    .select('pattern, occurrence_count')
    .eq('owner_user_id', userId)
    .eq('person_id', personId)
    .eq('day_of_week', day)
    .eq('hour_of_day', hour)
    .order('occurrence_count', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data || null;
}

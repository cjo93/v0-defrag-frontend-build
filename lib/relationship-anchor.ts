/**
 * Relationship Anchor — recurring pattern tracking per relationship.
 *
 * Tracks how often specific interaction patterns appear between the user
 * and a particular person. The most frequent pattern is injected into
 * the AI context so the model can reference relationship history
 * without replaying conversations.
 *
 * Cost: 1 DB read + 1 DB write per chat with a person. Zero LLM cost.
 */

import type { SupabaseAdminProxy } from './auth-server';

/**
 * Increment or create an anchor for a detected pattern.
 * Uses select-then-upsert to prevent race conditions.
 */
export async function updateRelationshipAnchor(
  admin: SupabaseAdminProxy,
  userId: string,
  personId: string,
  pattern: string,
): Promise<void> {
  if (!pattern || pattern === 'unknown') return;

  try {
    const { data, error } = await admin
      .from('relationship_anchor')
      .select('id, occurrence_count')
      .eq('owner_user_id', userId)
      .eq('person_id', personId)
      .eq('anchor_pattern', pattern)
      .maybeSingle();

    if (error) {
      console.error('[DEFRAG_ANCHOR]', error);
      return;
    }

    if (data) {
      await admin
        .from('relationship_anchor')
        .update({
          occurrence_count: data.occurrence_count + 1,
          last_seen: new Date().toISOString(),
        })
        .eq('id', data.id);
    } else {
      await admin
        .from('relationship_anchor')
        .upsert({
          owner_user_id: userId,
          person_id: personId,
          anchor_pattern: pattern,
          occurrence_count: 1,
          last_seen: new Date().toISOString(),
        }, {
          onConflict: 'owner_user_id,person_id,anchor_pattern',
        });
    }
  } catch (err) {
    console.error('[DEFRAG_ANCHOR]', err);
  }
}

/**
 * Fetch the most frequent anchor pattern for a relationship.
 * Returns null if no anchors exist yet.
 */
export async function getRelationshipAnchor(
  admin: SupabaseAdminProxy,
  userId: string,
  personId: string,
): Promise<{ anchor_pattern: string; occurrence_count: number } | null> {
  const { data } = await admin
    .from('relationship_anchor')
    .select('anchor_pattern, occurrence_count')
    .eq('owner_user_id', userId)
    .eq('person_id', personId)
    .order('occurrence_count', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data || null;
}

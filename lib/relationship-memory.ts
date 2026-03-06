/**
 * Relationship Memory — per-person evolving summary.
 *
 * Uses gpt-4.1-mini to compress recent conversation patterns into a
 * ~120-word summary stored in relationship_memory. This replaces
 * sending long message history to the model — cheaper and more aware.
 *
 * Triggered every ~12 messages per person, not on every chat.
 */

import type { SupabaseAdminProxy } from './auth-server';
import { callModel } from './model-api';

const SUMMARY_INTERVAL = 12; // Update memory every N messages per person

/**
 * Check whether a relationship memory update is due, and if so, run it.
 * Returns the current summary (fresh or existing).
 */
export async function maybeUpdateRelationshipMemory(
  admin: SupabaseAdminProxy,
  personId: string,
  ownerUserId: string,
): Promise<string> {
  // Count recent messages in conversations for this user
  const { count } = await admin
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'user');

  const messageCount = count || 0;

  // Only regenerate summary on interval boundaries
  if (messageCount > 0 && messageCount % SUMMARY_INTERVAL === 0) {
    return await regenerateMemory(admin, personId, ownerUserId);
  }

  // Otherwise return existing summary
  return await getExistingMemory(admin, personId, ownerUserId);
}

/**
 * Fetch existing relationship memory summary.
 */
export async function getExistingMemory(
  admin: SupabaseAdminProxy,
  personId: string,
  ownerUserId: string,
): Promise<string> {
  const { data } = await admin
    .from('relationship_memory')
    .select('summary')
    .eq('person_id', personId)
    .eq('owner_user_id', ownerUserId)
    .maybeSingle();

  return data?.summary || '';
}

/**
 * Regenerate the relationship memory summary using gpt-4.1-mini.
 * Reads up to 30 recent user messages, compresses into ~120 words.
 */
async function regenerateMemory(
  admin: SupabaseAdminProxy,
  personId: string,
  ownerUserId: string,
): Promise<string> {
  // Fetch recent user messages (last 30)
  const { data: messages } = await admin
    .from('messages')
    .select('content, created_at')
    .eq('role', 'user')
    .order('created_at', { ascending: false })
    .limit(30);

  if (!messages || messages.length === 0) {
    return '';
  }

  const content = messages
    .reverse()
    .map((m) => m.content)
    .join('\n');

  try {
    const completion = await callModel([
      {
        role: 'system',
        content:
          'Summarize the recurring relationship dynamic in under 120 words. Focus only on interaction patterns, communication tendencies, and recurring tension points. Do not include names or personal details. Write in third person.',
      },
      {
        role: 'user',
        content,
      },
    ], { model: 'mistral', temperature: 0.2, maxTokens: 300 });

    const summary = completion.text ?? '';

    // Upsert memory
    await admin
      .from('relationship_memory')
      .upsert(
        {
          owner_user_id: ownerUserId,
          person_id: personId,
          summary,
          last_updated: new Date().toISOString(),
        },
        { onConflict: 'owner_user_id,person_id' }
      );

    return summary;
  } catch (err) {
    console.error('[DEFRAG_API] Relationship memory update failed:', err);
    // Non-critical — return existing
    return await getExistingMemory(admin, personId, ownerUserId);
  }
}

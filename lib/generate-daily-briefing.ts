/**
 * Daily Relational Briefing — generates one daily summary per user.
 *
 * Uses Vercel AI SDK + Google Gemini to synthesize the user's
 * relationship landscape from relationship_state + relationship labels.
 * Cached per day so the AI is only called once regardless of dashboard reloads.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { callModel } from './model-api';

/**
 * Get or generate the daily relational briefing for a user.
 * Returns the cached version if one already exists for today.
 */
export async function generateDailyBriefing(
  admin: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const today = new Date().toISOString().slice(0, 10);

  // Check cache first
  const { data: existing } = await admin
    .from('daily_relational_briefing')
    .select('summary')
    .eq('owner_user_id', userId)
    .eq('briefing_date', today)
    .maybeSingle();

  if (existing?.summary) return existing.summary;

  // Fetch user's people with relationship state
  const { data: people } = await admin
    .from('people')
    .select('id, name, relationship_label, relationship_state')
    .eq('owner_user_id', userId)
    .limit(8);

  if (!people || people.length === 0) return null;

  // Fetch any relationship anchors for richer context
  const personIds = people.map((p) => p.id);
  const { data: anchors } = await admin
    .from('relationship_anchor')
    .select('person_id, anchor_pattern, occurrence_count')
    .eq('owner_user_id', userId)
    .in('person_id', personIds)
    .order('occurrence_count', { ascending: false })
    .limit(8);

  // Build context for the model
  const lines = people.map((p) => {
    const anchor = anchors?.find((a) => a.person_id === p.id);
    const anchorNote = anchor ? ` (recurring: ${anchor.anchor_pattern})` : '';
    return `${p.name} (${p.relationship_label}) — ${p.relationship_state || 'unclear'}${anchorNote}`;
  });

  const context = lines.join('\n');

  try {
    const completion = await callModel([
      {
        role: 'system',
        content:
          'Summarize the relational landscape for today in under 120 words. Explain observable patterns clearly. Do not ask questions. Do not suggest therapy. Write in calm, precise language. Use present tense.',
      },
      {
        role: 'user',
        content: context,
      },
    ], { model: 'mistral', temperature: 0.3, maxTokens: 300 });

    const summary = completion.text ?? '';

    if (summary) {
      // Cache for today
      await admin
        .from('daily_relational_briefing')
        .upsert(
          {
            owner_user_id: userId,
            briefing_date: today,
            summary,
          },
          { onConflict: 'owner_user_id,briefing_date' }
        );
    }

    return summary || null;
  } catch (err) {
    console.error('[DEFRAG_API] Daily briefing generation failed:', err);
    return null;
  }
}

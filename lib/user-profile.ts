/**
 * User Relational Profile — long-term pattern awareness.
 *
 * Gradually learns the user's dominant relational patterns, boundary style,
 * and conflict style. Injected into AI context so the model understands
 * recurring tendencies without replaying message history.
 *
 * Updated on every pattern detection (cheap — no LLM call).
 */

import { SupabaseClient } from '@supabase/supabase-js';

const MAX_PATTERNS = 20; // Cap stored patterns to prevent unbounded growth

export interface UserRelationalProfile {
  dominant_patterns: string[];
  boundary_style: string | null;
  conflict_style: string | null;
}

/**
 * Fetch the user's relational profile.
 */
export async function getUserRelationalProfile(
  admin: SupabaseClient,
  userId: string,
): Promise<UserRelationalProfile | null> {
  const { data } = await admin
    .from('user_relational_profile')
    .select('dominant_patterns, boundary_style, conflict_style')
    .eq('user_id', userId)
    .single();

  return data || null;
}

/**
 * Add a detected pattern to the user's relational profile.
 * Deduplicates and caps at MAX_PATTERNS.
 */
export async function updateUserRelationalProfile(
  admin: SupabaseClient,
  userId: string,
  pattern: string,
): Promise<void> {
  if (!pattern || pattern === 'unknown') return;

  const { data } = await admin
    .from('user_relational_profile')
    .select('dominant_patterns')
    .eq('user_id', userId)
    .single();

  const existing = new Set<string>(data?.dominant_patterns || []);
  existing.add(pattern);

  // Cap size — keep most recent by converting to array and slicing
  const patterns = Array.from(existing).slice(-MAX_PATTERNS);

  await admin
    .from('user_relational_profile')
    .upsert(
      {
        user_id: userId,
        dominant_patterns: patterns,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
}

/**
 * Infer and update boundary/conflict style from accumulated patterns.
 * Lightweight heuristic — no LLM call.
 */
export async function inferRelationalStyles(
  admin: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data } = await admin
    .from('user_relational_profile')
    .select('dominant_patterns')
    .eq('user_id', userId)
    .single();

  if (!data?.dominant_patterns || data.dominant_patterns.length < 5) return;

  const patterns = data.dominant_patterns;
  const counts = new Map<string, number>();
  for (const p of patterns) {
    counts.set(p, (counts.get(p) || 0) + 1);
  }

  // Infer boundary style
  let boundaryStyle: string | null = null;
  if (counts.get('enmeshment') || counts.get('parentification')) {
    boundaryStyle = 'porous';
  } else if (counts.get('pursue_withdraw')) {
    boundaryStyle = 'avoidant';
  } else if (counts.get('boundary_clarification') || counts.get('self_validation')) {
    boundaryStyle = 'developing';
  }

  // Infer conflict style
  let conflictStyle: string | null = null;
  if (counts.get('escalation_cycle')) {
    conflictStyle = 'escalating';
  } else if (counts.get('pursue_withdraw')) {
    conflictStyle = 'withdrawing';
  } else if (counts.get('de_escalation') || counts.get('repair_pathway')) {
    conflictStyle = 'repairing';
  }

  if (boundaryStyle || conflictStyle) {
    const update: Record<string, string> = { last_updated: new Date().toISOString() };
    if (boundaryStyle) update.boundary_style = boundaryStyle;
    if (conflictStyle) update.conflict_style = conflictStyle;

    await admin
      .from('user_relational_profile')
      .update(update)
      .eq('user_id', userId);
  }
}

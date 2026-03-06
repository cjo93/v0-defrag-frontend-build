/**
 * Relationship State — Deterministic computation from message patterns.
 *
 * Maps chat-derived relational pattern data into a single, persisted state
 * for each person: stable | strained | cooling | improving | unclear.
 *
 * No LLM calls. Pure heuristic, explainable, cheap.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { detectRelationalPattern, type RelationalSignal } from './relational-pattern';

export type RelationshipState = 'stable' | 'strained' | 'cooling' | 'improving' | 'unclear';

// ── Types ─────────────────────────────────────────────────────

export interface PatternSnapshot {
  relationshipState: RelationalSignal['relationshipState'];
  tensionType: string;
  pattern: string;
  guidanceMode: string;
  createdAt: Date;
}

interface StateInput {
  recentPatterns: PatternSnapshot[];
  lastInteractionAt: Date | null;
  previousState: RelationshipState | null;
}

// ── Constants ─────────────────────────────────────────────────

const LOOKBACK_DAYS = 14;
const COOLING_THRESHOLD_DAYS = 7;  // Strained → cooling after 7 days silence
const UNCLEAR_THRESHOLD_DAYS = 21; // Any state → unclear after 21 days silence

const STRAINED_SIGNALS = new Set([
  'escalation_cycle', 'pursue_withdraw',
]);

const IMPROVING_GUIDANCE = new Set([
  'de_escalation', 'repair_pathway', 'self_validation',
  'boundary_clarification', 'cycle_interruption',
]);

// ── Core computation ──────────────────────────────────────────

/**
 * Compute a deterministic relationship state from recent patterns.
 * Pure function — no DB access, no side effects.
 */
export function computeRelationshipState(input: StateInput): RelationshipState {
  const { recentPatterns, lastInteractionAt, previousState } = input;

  // No messages at all → unclear
  if (recentPatterns.length === 0) {
    if (previousState && lastInteractionAt) {
      return decayState(previousState, daysSince(lastInteractionAt));
    }
    return 'unclear';
  }

  // Score recent patterns
  let strainedScore = 0;
  let improvingScore = 0;
  let stableScore = 0;
  let coolingScore = 0;

  for (const p of recentPatterns) {
    // Direct state from per-message detection
    switch (p.relationshipState) {
      case 'strained': strainedScore += 2; break;
      case 'cooling': coolingScore += 1; break;
      case 'improving': improvingScore += 2; break;
      case 'stable': stableScore += 1; break;
      default: break;
    }

    // Amplifiers from pattern + tension
    if (STRAINED_SIGNALS.has(p.pattern)) strainedScore += 1;
    if (p.tensionType === 'trust_repair') strainedScore += 1;
    if (IMPROVING_GUIDANCE.has(p.guidanceMode)) improvingScore += 1;
  }

  // Check for pattern repetition (same pattern ≥3 times → strained amplifier)
  const patternCounts = new Map<string, number>();
  for (const p of recentPatterns) {
    if (p.pattern !== 'unknown') {
      patternCounts.set(p.pattern, (patternCounts.get(p.pattern) || 0) + 1);
    }
  }
  const hasRepetition = Array.from(patternCounts.values()).some(c => c >= 3);
  if (hasRepetition) strainedScore += 2;

  // Time-based decay: if last interaction is old, shift toward cooling/unclear
  const daysSinceLastInteraction = lastInteractionAt ? daysSince(lastInteractionAt) : 0;

  // Decide state
  const total = strainedScore + improvingScore + stableScore + coolingScore;

  if (total === 0) return 'unclear';

  // Strained dominates
  if (strainedScore >= improvingScore && strainedScore >= stableScore && strainedScore > 0) {
    // But if days have passed, it may be cooling
    if (daysSinceLastInteraction >= COOLING_THRESHOLD_DAYS) return 'cooling';
    return 'strained';
  }

  // Improving
  if (improvingScore > strainedScore && improvingScore >= stableScore) {
    return 'improving';
  }

  // Stable
  if (stableScore >= improvingScore && stableScore > strainedScore) {
    return 'stable';
  }

  // Cooling
  if (coolingScore > 0 && coolingScore >= stableScore) {
    return 'cooling';
  }

  return 'unclear';
}

/**
 * Decay a state over time when no new interactions occur.
 */
export function decayState(previousState: RelationshipState, daysSinceInteraction: number): RelationshipState {
  if (daysSinceInteraction >= UNCLEAR_THRESHOLD_DAYS) return 'unclear';

  switch (previousState) {
    case 'strained':
      return daysSinceInteraction >= COOLING_THRESHOLD_DAYS ? 'cooling' : 'strained';
    case 'cooling':
      return daysSinceInteraction >= UNCLEAR_THRESHOLD_DAYS ? 'unclear' : 'cooling';
    case 'improving':
      return daysSinceInteraction >= COOLING_THRESHOLD_DAYS ? 'stable' : 'improving';
    case 'stable':
      return 'stable'; // Stable persists until unclear threshold
    default:
      return 'unclear';
  }
}

// ── DB helpers ─────────────────────────────────────────────────

/**
 * Fetch recent messages for a person, run pattern detection, compute state.
 * Returns the new state and updates the people table.
 */
export async function updatePersonRelationshipState(
  admin: SupabaseClient,
  personId: string,
  ownerUserId: string,
): Promise<RelationshipState> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOOKBACK_DAYS);

  // Find conversations for this person
  const { data: convRows } = await admin
    .from('conversations')
    .select('id')
    .eq('user_id', ownerUserId)
    .eq('person_id', personId);

  const convIds = (convRows || []).map(c => c.id);

  // If no conversations exist for this person, fall back to empty pattern list
  let relevantMessages: any[] = [];
  if (convIds.length > 0) {
    const { data: messages } = await admin
      .from('messages')
      .select('content, relational_pattern, tension_type, created_at')
      .in('conversation_id', convIds)
      .gte('created_at', cutoff.toISOString())
      .eq('role', 'user')
      .not('relational_pattern', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50);

    relevantMessages = messages || [];
  }

  // Build pattern snapshots from stored data
  const recentPatterns: PatternSnapshot[] = relevantMessages.map(m => ({
    relationshipState: mapStoredPattern(m.relational_pattern),
    tensionType: m.tension_type || 'unclear',
    pattern: m.relational_pattern || 'unknown',
    guidanceMode: 'pattern_recognition',
    createdAt: new Date(m.created_at),
  }));

  // Get person's current state and last interaction
  const { data: person } = await admin
    .from('people')
    .select('relationship_state, created_at')
    .eq('id', personId)
    .single();

  const lastInteractionAt = recentPatterns.length > 0
    ? recentPatterns[0].createdAt
    : person?.created_at ? new Date(person.created_at) : null;

  const newState = computeRelationshipState({
    recentPatterns,
    lastInteractionAt,
    previousState: (person?.relationship_state as RelationshipState) || null,
  });

  // Persist with timestamp for stale detection
  await admin
    .from('people')
    .update({
      relationship_state: newState,
      relationship_state_updated_at: new Date().toISOString(),
    })
    .eq('id', personId);

  return newState;
}

/**
 * Compute state for a single person using a fresh message + existing pattern.
 * Lighter variant used inline during chat — avoids re-querying all messages.
 */
export async function updatePersonStateFromChat(
  admin: SupabaseClient,
  personId: string,
  currentPattern: RelationalSignal,
): Promise<RelationshipState> {
  // Get person's current state
  const { data: person } = await admin
    .from('people')
    .select('relationship_state')
    .eq('id', personId)
    .single();

  const previousState = (person?.relationship_state as RelationshipState) || null;

  // Build a single-message snapshot from the current pattern
  const snapshot: PatternSnapshot = {
    relationshipState: currentPattern.relationshipState,
    tensionType: currentPattern.tensionType,
    pattern: currentPattern.pattern,
    guidanceMode: currentPattern.guidanceMode,
    createdAt: new Date(),
  };

  // For inline updates we blend the current message with the previous state.
  // If we already have a state, weight it: let computeRelationshipState decide
  // from the fresh snapshot alone, but use decayState to inform fallback.
  const newState = computeRelationshipState({
    recentPatterns: [snapshot],
    lastInteractionAt: new Date(),
    previousState,
  });

  // Persist with timestamp for stale detection
  await admin
    .from('people')
    .update({
      relationship_state: newState,
      relationship_state_updated_at: new Date().toISOString(),
    })
    .eq('id', personId);

  return newState;
}

// ── Utilities ─────────────────────────────────────────────────

function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Map a stored relational_pattern string back to a relationship state.
 * The patterns stored on messages are the pattern names like "pursue_withdraw",
 * "escalation_cycle", etc. We infer state from these.
 */
function mapStoredPattern(pattern: string | null): RelationshipState {
  if (!pattern) return 'unclear';
  const p = pattern.toLowerCase();
  if (['escalation_cycle', 'pursue_withdraw', 'triangulation'].includes(p)) return 'strained';
  if (['enmeshment', 'parentification'].includes(p)) return 'strained';
  if (['repetition_compulsion'].includes(p)) return 'cooling';
  return 'unclear';
}

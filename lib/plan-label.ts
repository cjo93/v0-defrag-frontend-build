/**
 * Plan label mapping utility.
 * DB stores 'free' | 'solo' | 'circle' | 'basic' | 'plus' — UI shows 'Free' | 'Solo' | 'Team'.
 * Use these helpers everywhere instead of inline string checks.
 */

export function planLabel(plan: string | null): 'Free' | 'Solo' | 'Team' {
  if (!plan) return 'Free';
  const normalized = plan.toLowerCase();
  if (['team', 'circle', 'plus'].includes(normalized)) return 'Team';
  if (['solo', 'basic'].includes(normalized)) return 'Solo';
  return 'Free';
}

export function canonicalPlan(plan: string | null): 'free' | 'solo' | 'team' {
  if (!plan) return 'free';
  const normalized = plan.toLowerCase();
  if (['team', 'circle', 'plus', 'os'].includes(normalized)) return 'team';
  if (['solo', 'basic', 'blueprint'].includes(normalized)) return 'solo';
  return 'free';
}

export function isTeam(plan: string | null): boolean {
  return planLabel(plan) === 'Team';
}

export function isFree(plan: string | null): boolean {
  return planLabel(plan) === 'Free';
}

export function isPaid(plan: string | null): boolean {
  return !isFree(plan);
}

export function hasPaidAccess(plan: string | null, subscriptionStatus: string | null): boolean {
  return canonicalPlan(plan) !== 'free' && (subscriptionStatus || '').toLowerCase() === 'active';
}

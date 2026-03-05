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

export function isTeam(plan: string | null): boolean {
  return planLabel(plan) === 'Team';
}

export function isFree(plan: string | null): boolean {
  return planLabel(plan) === 'Free';
}

export function isPaid(plan: string | null): boolean {
  return !isFree(plan);
}

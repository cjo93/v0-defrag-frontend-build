/**
 * Plan label mapping utility.
 * DB stores 'solo' | 'circle' | 'basic' | 'plus' — UI always shows 'Solo' | 'Team'.
 * Use these helpers everywhere instead of inline string checks.
 */

export function planLabel(plan: string | null): 'Solo' | 'Team' {
  if (!plan) return 'Solo';
  const normalized = plan.toLowerCase();
  if (['team', 'circle', 'plus'].includes(normalized)) return 'Team';
  return 'Solo';
}

export function isTeam(plan: string | null): boolean {
  return planLabel(plan) === 'Team';
}

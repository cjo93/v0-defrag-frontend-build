import { RelationalPattern, PersonState } from './types';

// Map intensity (0-1) to animation duration (s)
// Higher intensity = faster (lower duration)
export function getIntensityDuration(intensity: number, minStr = 6, maxStr = 2): number {
  return minStr - intensity * (minStr - maxStr);
}

export function getNodeMotion(state: PersonState, intensity: number) {
  const duration = getIntensityDuration(intensity, 4, 1.5);

  switch (state) {
    case 'stable':
      return {
        scale: [1, 1.03, 1],
        transition: { duration, repeat: Infinity, ease: 'easeInOut' }
      };
    case 'reactive':
      // Micro jitter
      return {
        x: [0, -1, 1, -0.5, 0.5, 0],
        y: [0, 0.5, -0.5, 1, -1, 0],
        transition: { duration: duration * 0.5, repeat: Infinity, ease: 'linear' }
      };
    case 'repairing':
      // Handled by an external halo
      return {
        scale: [1, 1.02, 1],
        transition: { duration: duration * 1.5, repeat: Infinity, ease: 'easeInOut' }
      };
    case 'distanced':
      return {
        opacity: [0.3, 0.4, 0.3],
        transition: { duration: duration * 2, repeat: Infinity, ease: 'easeInOut' }
      };
    default:
      return {};
  }
}

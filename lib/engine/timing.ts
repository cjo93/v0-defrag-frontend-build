import { TimingResult } from "./types";

export function calculateTiming(
  stabilityScore: number,
  conflictDensity: number,
  escalationAvg: number,
  volatilityIndex: number,
  sleepDeviation: number
): TimingResult {
  const timingScore =
    (stabilityScore * 0.40) +
    ((100 - conflictDensity) * 0.20) +
    ((100 - escalationAvg) * 0.20) +
    ((100 - volatilityIndex) * 0.10) +
    ((100 - sleepDeviation) * 0.10);

  const clamped = Math.max(0, Math.min(100, timingScore));

  let state: TimingResult["state"];

  if (clamped >= 80) state = "push";
  else if (clamped >= 55) state = "neutral";
  else state = "protect";

  return {
    score: Math.round(clamped),
    state,
  };
}

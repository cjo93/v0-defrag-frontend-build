import { StabilityInputs, StabilityResult } from "./types";

export function calculateStability(inputs: StabilityInputs): StabilityResult {
  const {
    sleepScore,
    stressScore,
    conflictDensity,
    escalationAvg,
    volatilityIndex,
  } = inputs;

  let confidence = 100;

  if (sleepScore === null) confidence -= 5;
  if (stressScore === null) confidence -= 5;

  const normalizedSleep = sleepScore ?? 70;
  const normalizedStress = stressScore ?? 50;

  const rawScore =
    (normalizedSleep * 0.25) +
    ((100 - normalizedStress) * 0.25) +
    ((100 - conflictDensity) * 0.20) +
    ((100 - escalationAvg) * 0.20) +
    ((100 - volatilityIndex) * 0.10);

  const clamped = Math.max(0, Math.min(100, rawScore));

  let label: StabilityResult["label"];

  if (clamped < 40) label = "low";
  else if (clamped < 70) label = "moderate";
  else label = "strong";

  return {
    score: Math.round(clamped),
    label,
    confidence: Math.max(0, confidence),
  };
}

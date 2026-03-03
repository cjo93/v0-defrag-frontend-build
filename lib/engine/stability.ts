export interface StabilityInputs {
  sleepScore?: number; // 0-100
  stressScore?: number; // 0-100
  conflictDensity: number; // 0-100, capped at 100
  escalationSeverityAvg: number; // 0-100
  volatilityFlag: boolean;
  totalConflictEntries: number;
}

export interface StabilityResult {
  score: number;
  label: 'Low' | 'Moderate' | 'Strong';
  confidence: number;
  userMessage: string | null;
}

/**
 * Calculates the daily stability score based on the V1 Rule-Based formula.
 *
 * Stability Score =
 *   (Sleep * 0.25)
 * + ((100 - Stress) * 0.25)
 * + ((100 - ConflictDensity) * 0.20)
 * + ((100 - EscalationSeverityAvg) * 0.20)
 * + VolatilityAdjustment
 */
export function calculateStabilityScore(inputs: StabilityInputs): StabilityResult {
  let confidence = 100;

  // Handle missing data defaults and confidence penalties
  const sleep = inputs.sleepScore !== undefined ? inputs.sleepScore : 70;
  if (inputs.sleepScore === undefined) {
    confidence -= 5;
  }

  const stress = inputs.stressScore !== undefined ? inputs.stressScore : 50; // Defaulting to neutral if missing, though spec doesn't explicitly define default for stress
  if (inputs.stressScore === undefined) {
    confidence -= 5;
  }

  if (inputs.totalConflictEntries < 3) {
    confidence -= 10;
  }

  // Cap density at 100 as per spec
  const conflictDensity = Math.min(inputs.conflictDensity, 100);

  // Calculate base components
  const sleepComponent = sleep * 0.25;
  const stressComponent = (100 - stress) * 0.25;
  const densityComponent = (100 - conflictDensity) * 0.20;
  const severityComponent = (100 - inputs.escalationSeverityAvg) * 0.20;

  // Volatility Adjustment
  const volatilityAdjustment = inputs.volatilityFlag ? -15 : 0;

  // Calculate raw score and clamp to 0-100
  let rawScore = sleepComponent + stressComponent + densityComponent + severityComponent + volatilityAdjustment;
  rawScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Determine Label
  let label: 'Low' | 'Moderate' | 'Strong';
  if (rawScore <= 39) {
    label = 'Low';
  } else if (rawScore <= 69) {
    label = 'Moderate';
  } else {
    label = 'Strong';
  }

  // Determine User-Facing Message
  let userMessage: string | null = null;

  // Follow specific language rules
  if (inputs.sleepScore !== undefined && inputs.sleepScore < 50) {
     userMessage = "Low rest often increases sensitivity.";
  } else if (label === 'Low') {
    userMessage = "Stability is lower than usual today.";
  } else if (conflictDensity > 50 || inputs.escalationSeverityAvg > 50) { // Example thresholds for 'recent conflict activity'
    userMessage = "Recent conflict activity may increase reaction speed.";
  }

  return {
    score: rawScore,
    label,
    confidence,
    userMessage
  };
}

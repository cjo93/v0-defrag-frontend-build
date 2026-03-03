export type StabilityInputs = {
  sleepScore: number | null;           // 0–100
  stressScore: number | null;          // 0–100
  conflictDensity: number;             // 0–100
  escalationAvg: number;               // 0–100
  volatilityIndex: number;             // 0–100
  sleepDeviation?: number;              // 0–100
};

export type StabilityResult = {
  score: number;                       // 0–100
  label: "low" | "moderate" | "strong";
  confidence: number;                  // 0–100
};

export type TimingResult = {
  score: number;                       // 0–100
  state: "push" | "neutral" | "protect";
};

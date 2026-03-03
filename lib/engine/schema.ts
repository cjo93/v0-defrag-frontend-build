import { z } from "zod";

export const StabilityInputsSchema = z.object({
  sleepScore: z.number().min(0).max(100).nullable(),
  stressScore: z.number().min(0).max(100).nullable(),
  conflictDensity: z.number().min(0).max(100),
  escalationAvg: z.number().min(0).max(100),
  volatilityIndex: z.number().min(0).max(100),
  sleepDeviation: z.number().min(0).max(100).optional(),
});

export const StabilityResultSchema = z.object({
  score: z.number().min(0).max(100),
  label: z.enum(["low", "moderate", "strong"]),
  confidence: z.number().min(0).max(100),
});

export const TimingResultSchema = z.object({
  score: z.number().min(0).max(100),
  state: z.enum(["push", "neutral", "protect"]),
});

export const DailyChronometerSchema = z.object({
  userId: z.string().uuid(),
  stability: StabilityResultSchema,
  timing: TimingResultSchema,
  timestamp: z.string().datetime(),
});

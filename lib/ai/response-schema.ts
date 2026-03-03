import { z } from "zod";

// Layer 2: Constrained generation - strict JSON schema
export const DefragCrisisResponseSchema = z.object({
  headline: z.string().min(2).max(80),
  signal: z.enum(["low", "medium", "high"]),
  confidence: z.object({
    overall: z.number().min(0).max(100),
    data_confidence: z.number().min(0).max(100),
    pattern_confidence: z.number().min(0).max(100),
  }),
  whats_happening: z.array(z.string()).min(1).max(5),
  do_this_now: z.string().min(2).max(800),
  one_line_to_say: z.string().min(2).max(200),
  repeat_pattern: z.string().nullable().optional(),
  safety: z.string().nullable().optional(),
}).strict();

export type DefragCrisisResponse = z.infer<typeof DefragCrisisResponseSchema>;

// Safe fallback if validation fails
export const SAFE_FALLBACK_RESPONSE: DefragCrisisResponse = {
  headline: "Pause required. System resetting.",
  signal: "medium",
  confidence: {
    overall: 100,
    data_confidence: 100,
    pattern_confidence: 100
  },
  whats_happening: [
    "The situation needs careful attention.",
    "Focus on what you can control right now."
  ],
  do_this_now: "Pause and assess the situation calmly. Identify one concrete action you can take in the next few minutes. Focus on clear, direct communication.",
  one_line_to_say: "I need a moment to think about this clearly. Let's talk through this step by step.",
  repeat_pattern: null,
  safety: null
};

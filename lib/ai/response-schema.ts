import { z } from "zod";

// Layer 2: Constrained generation - strict JSON schema for SOVEREIGN Phase
// Expanding beyond DEFRAG one-line scripts to full guidance model
export const DefragCrisisResponseSchema = z.object({
  headline: z.string().describe("One sentence. Clear. No metaphor. No abstraction."),
  signal: z.object({
    level: z.enum(["low", "medium", "high_sensitivity"]).describe("Signal level"),
    label: z.string().describe("Signal label")
  }),
  confidence: z.object({
    overall: z.number().int().min(0).max(100),
    data_confidence: z.number().int().min(0).max(100),
    pattern_confidence: z.number().int().min(0).max(100)
  }),
  whats_happening: z.array(z.string()).describe("2-4 bullet statements. Describe dynamic, describe protection response, avoid blame."),
  do_this_now: z.string().describe("One immediate adjustment. Concrete. Behavioral."),
  one_line_to_say: z.string().max(100).describe("Lower defensiveness, reduce intensity, avoid accusation, avoid absolutes. Maximum 20 words."),
  repeat_pattern: z.object({
    detected: z.boolean(),
    message: z.string()
  }),
  timing: z.object({
    recommendation: z.string(),
    delay_suggested: z.boolean()
  }),
  decision_guard: z.object({
    triggered: z.boolean(),
    reason: z.string()
  }),
  safety: z.object({
    level: z.enum(["none", "elevated", "high"]),
    guidance: z.array(z.string())
  })
}).strict();

export type DefragCrisisResponse = z.infer<typeof DefragCrisisResponseSchema>;

// Safe fallback if validation fails (anti-drift safety net)
export const SAFE_FALLBACK_RESPONSE: DefragCrisisResponse = {
  headline: "Pause required. System resetting.",
  signal: {
    level: "medium",
    label: "Unknown"
  },
  confidence: {
    overall: 100,
    data_confidence: 0,
    pattern_confidence: 0
  },
  whats_happening: [
    "The situation needs careful attention and assessment.",
    "Insufficient clear data to provide a high-confidence analysis."
  ],
  do_this_now: "Pause and assess the situation calmly. Identify one concrete action you can take in the next few minutes. Focus on clear, direct communication.",
  one_line_to_say: "I need a moment to process this before we continue.",
  repeat_pattern: {
    detected: false,
    message: ""
  },
  timing: {
    recommendation: "Protect Day",
    delay_suggested: true
  },
  decision_guard: {
    triggered: false,
    reason: ""
  },
  safety: {
    level: "none",
    guidance: []
  }
};

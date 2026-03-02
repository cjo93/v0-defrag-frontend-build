import { z } from "zod";

// DEFRAG - AI Response Contract (Strict JSON Structure)
// This schema enforces the exact output required for the Phase 1 MVP UI.
// Any deviation from this schema must be rejected or retried by the AI layer.

export const AIResponseSchema = z.object({
  headline: z.string().describe("One clear summary sentence."),
  signal: z.object({
    level: z.enum(["low", "medium", "high_sensitivity"]),
    label: z.string().describe("Human readable label for the signal level.")
  }),
  confidence: z.object({
    overall: z.number().min(0).max(100),
    data_confidence: z.number().min(0).max(100),
    pattern_confidence: z.number().min(0).max(100)
  }),
  whats_happening: z.array(z.string()).min(1).max(4).describe("2-4 short bullet points explaining the dynamic."),
  do_this_now: z.string().describe("One immediate actionable step."),
  one_line_to_say: z.string().describe("One short, exact sentence the user can say to de-escalate or repair."),
  repeat_pattern: z.object({
    detected: z.boolean(),
    message: z.string().nullable().describe("Supportive message if similar dynamics appear multiple times. Null if not detected.")
  }),
  visualization: z.object({
    available: z.boolean(),
    type: z.enum(["loop_map", "family_map", "pressure_timeline"]).nullable(),
    nodes: z.array(z.any()).optional(),
    edges: z.array(z.any()).optional()
  }),
  details: z.object({
    structural_markers: z.array(z.string()),
    timing_notes: z.array(z.string()),
    summary_metrics: z.record(z.any())
  }),
  safety: z.object({
    level: z.enum(["none", "elevated", "high"]),
    guidance: z.array(z.string()).describe("Safety instructions, e.g. pause, seek space, or crisis resources if elevated/high.")
  })
}).strict();

export type AIResponse = z.infer<typeof AIResponseSchema>;

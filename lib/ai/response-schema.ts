import { z } from "zod";

// Layer 2: Constrained generation - strict JSON schema for SOVEREIGN Phase
// Expanding beyond DEFRAG one-line scripts to full guidance model
export const SovereignGuidanceSchema = z.object({
  headline: z.string().min(2).max(80).describe("A short, clear headline for the response. Non-diagnostic, simple language."),
  risk_level: z.enum(["low", "medium", "high"]).describe("Overall risk level of the situation."),
  timing_recommendation: z.enum(["Push Day", "Neutral Day", "Protect Day"]).describe("Recommended timing approach based on system signals."),
  explanation: z.object({
    whats_happening: z.string().min(10).max(500).describe("Clear description of what is currently occurring."),
    why: z.string().min(10).max(500).describe("Analytical explanation of why this may be happening, avoiding psychological labels.")
  }),
  suggested_response: z.string().min(10).max(1000).describe("Suggested course of action or verbal response in 2-5 simple sentences. No fluff, direct approach."),
  data_tooltips: z.object({
    conflict_history_count: z.number().int().min(0).describe("Number of relevant previous conflicts detected."),
    stability_level: z.enum(["Low", "Moderate", "Strong"]).describe("Current assessed stability level."),
    pattern_frequency: z.string().describe("Description of how often this pattern occurs (e.g., 'Weekly', 'Rare')."),
    volatility_score: z.number().int().min(0).max(100).describe("Computed volatility score at this moment.")
  }),
  confidence_score: z.number().min(0).max(100).describe("Overall confidence in this assessment based on available data."),
}).strict();

export type SovereignGuidanceResponse = z.infer<typeof SovereignGuidanceSchema>;

// Safe fallback if validation fails (anti-drift safety net)
export const SAFE_FALLBACK_RESPONSE: SovereignGuidanceResponse = {
  headline: "Pause required. System resetting.",
  risk_level: "medium",
  timing_recommendation: "Protect Day",
  explanation: {
    whats_happening: "The situation needs careful attention and assessment.",
    why: "Insufficient clear data to provide a high-confidence analysis."
  },
  suggested_response: "Pause and assess the situation calmly. Identify one concrete action you can take in the next few minutes. Focus on clear, direct communication.",
  data_tooltips: {
    conflict_history_count: 0,
    stability_level: "Moderate",
    pattern_frequency: "Unknown",
    volatility_score: 50
  },
  confidence_score: 100
};

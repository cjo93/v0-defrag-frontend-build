import { z } from "zod";

// Structured AI Schema Enforcement
export const DefragCrisisResponseSchema = z.object({
  headline: z.string().describe("A short, clear headline for the response. Non-diagnostic, simple language."),
  signal_level: z.enum(["low", "medium", "high"]).describe("Overall signal level of the situation."),
  confidence_score: z.number().describe("Overall confidence in this assessment based on available data."),
  stability_state: z.enum(["low", "moderate", "strong"]).describe("Current assessed stability level."),
  timing_state: z.enum(["push", "neutral", "protect"]).describe("Recommended timing approach based on system signals."),
  pattern_detected: z.boolean().describe("Whether a repeating pattern was detected."),
  pattern_summary: z.string().describe("Summary of the detected pattern, if any. Must be neutral."),
  risk_level: z.enum(["low", "moderate", "high"]).describe("Assessed risk level of escalation or permanent decision."),
  explanation: z.string().describe("Clear, analytical explanation avoiding psychological labels."),
  suggested_response: z.string().describe("Suggested course of action or verbal response. No fluff, direct approach."),
  data_tooltips: z.array(z.string()).describe("List of data points supporting the analysis."),
  safety_level: z.enum(["none", "elevated", "high"]).describe("Assessed safety risk level."),
}).strict();

export type DefragCrisisResponse = z.infer<typeof DefragCrisisResponseSchema>;

// Safe fallback if validation fails (anti-drift safety net)
export const SAFE_FALLBACK_RESPONSE: DefragCrisisResponse = {
  headline: "Pause required. System resetting.",
  signal_level: "medium",
  confidence_score: 100,
  stability_state: "moderate",
  timing_state: "protect",
  pattern_detected: false,
  pattern_summary: "No pattern analysis available.",
  risk_level: "moderate",
  explanation: "Insufficient clear data to provide a high-confidence analysis.",
  suggested_response: "Pause and assess the situation calmly. Identify one concrete action you can take in the next few minutes. Focus on clear, direct communication.",
  data_tooltips: [],
  safety_level: "none"
};

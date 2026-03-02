import { z } from "zod";

// Layer 2: Constrained generation - exact 5-field JSON, no free text
export const DefragCrisisResponseSchema = z.object({
  headline: z.string().min(2).max(40),
  happening: z.string().min(2).max(120),   // ~15 words target
  doThis: z.string().min(2).max(800),
  avoid: z.string().min(2).max(200),
  sayThis: z.string().min(2).max(200),
}).strict();

export type DefragCrisisResponse = z.infer<typeof DefragCrisisResponseSchema>;

// Safe fallback if validation fails
export const SAFE_FALLBACK_RESPONSE: DefragCrisisResponse = {
  headline: "Take a breath",
  happening: "The situation needs careful attention. Focus on what you can control right now.",
  doThis: "Pause and assess the situation calmly. Identify one concrete action you can take in the next few minutes. Focus on clear, direct communication.",
  avoid: "Don't react impulsively. Avoid making permanent decisions in temporary emotional states.",
  sayThis: "I need a moment to think about this clearly. Let's talk through this step by step.",
};

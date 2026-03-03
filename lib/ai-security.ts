// AI Security Layer - Prevents disclosure of internal logic
// Implements 3 controls: signal sanitization, structured validation, disclosure filtering

import type { ChatResponse } from './types';

// Control 1: Signal Sanitization
// Never send raw network data or engine internals to the model
export interface SanitizedSignal {
  pressureLevel: 'low' | 'moderate' | 'high' | 'critical';
  frictionTheme: string; // e.g. "timing misalignment" not "Node A score 0.73"
  certainty: 'low' | 'medium' | 'high';
  context: string; // user's question
}

export function sanitizeNetworkSignal(
  rawNetworkData: any,
  userMessage: string
): SanitizedSignal {
  // This would be implemented on backend with actual network analysis
  // For now, return a structured signal packet
  return {
    pressureLevel: 'moderate',
    frictionTheme: 'communication timing',
    certainty: 'medium',
    context: userMessage,
  };
}

// Control 2: Structured Output Validation
// Enforce exact JSON schema and reject anything else


const REQUIRED_KEYS = ['headline', 'signal', 'confidence', 'whats_happening', 'do_this_now', 'one_line_to_say'];

export function validateStructuredResponse(
  rawResponse: any,
  attempt: number = 1
): ChatResponse | null {
  // Check if response has all required keys
  const hasAllKeys = REQUIRED_KEYS.every(key => 
    rawResponse && typeof rawResponse[key] === 'string' && rawResponse[key].length > 0
  );

  if (!hasAllKeys) {
    console.warn('[AI Security] Invalid response structure, attempt:', attempt);
    return null;
  }

  return {
    headline: String(rawResponse.headline || rawResponse.title),
    whats_happening: Array.isArray(rawResponse.whats_happening) ? rawResponse.whats_happening : [String(rawResponse.whats_happening || rawResponse.happening)],
    do_this_now: String(rawResponse.do_this_now || rawResponse.doThis),
    signal: ['low', 'medium', 'high'].includes(rawResponse.signal) ? rawResponse.signal : 'medium',
    confidence: rawResponse.confidence || { overall: 50, data_confidence: 50, pattern_confidence: 50 },
    one_line_to_say: String(rawResponse.one_line_to_say || rawResponse.sayThis)
  };
}

// Control 3: Disclosure Filter
// Block responses that reveal internal logic
const FORBIDDEN_PATTERNS = [
  /\b(algorithm|calculation|score|threshold|mapping|formula)\b/i,
  /\b(I calculated|I analyzed the data|based on the numbers)\b/i,
  /\b(node|edge|network graph|data structure)\b/i,
  /\b(JSON|array|object|key|value)\b/i,
  /\bhere'?s? (the|a) (list|table|breakdown)\b/i,
  /\d+\.\d{2,}/, // Precise decimals like 0.73, 3.14159
  /\b\d+%\b/, // Percentages
];

export function filterDisclosure(response: ChatResponse): {
  safe: boolean;
  filtered?: ChatResponse;
  reason?: string;
} {
  // Check all fields for forbidden patterns
  const allText = Object.values(response).join(' ');
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(allText)) {
      console.warn('[AI Security] Disclosure detected:', pattern);
      
      // Return safe fallback response
      return {
        safe: false,
        filtered: {
          headline: 'Signal received',
          signal: 'medium',
          confidence: { overall: 50, data_confidence: 50, pattern_confidence: 50 },
          whats_happening: ['Your network is showing some tension right now. This is temporary.'],
          do_this_now: 'Take a step back. Give yourself space before responding.',
          one_line_to_say: 'I need a moment to think about this.',
        },
        reason: 'Disclosure filter triggered',
      };
    }
  }

  return { safe: true };
}

// Combined security check
export function secureAIResponse(
  rawResponse: any,
  attempt: number = 1
): ChatResponse | null {
  // Validate structure
  const validated = validateStructuredResponse(rawResponse, attempt);
  if (!validated) {
    if (attempt < 2) {
      // Backend should retry with stricter prompt
      return null;
    }
    // Return safe fallback after max attempts
    return {
      headline: 'System check',
      signal: 'medium',
      confidence: { overall: 100, data_confidence: 100, pattern_confidence: 100 },
      whats_happening: ['The system needs a moment to recalibrate.'],
      do_this_now: 'Take a pause. Nothing urgent is required right now.',
      one_line_to_say: 'I\'m taking time to process this.',
    };
  }

  // Filter for disclosure
  const filterResult = filterDisclosure(validated);
  if (!filterResult.safe) {
    console.error('[AI Security] Disclosure blocked:', filterResult.reason);
    return filterResult.filtered!;

  }

  // All checks passed
  return validated;

}

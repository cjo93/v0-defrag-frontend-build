// Layer 3: Disclosure filter - blocks leakage even if model tries

const LEAK_PATTERNS: RegExp[] = [
  // Computation/logic disclosure
  /\balgorithm\b/i,
  /\bscor(e|ing)\b/i,
  /\bthreshold(s)?\b/i,
  /\bweights?\b/i,
  /\bmapping\b/i,
  /\blogic\b/i,
  /\bcomputed\b/i,
  /\bcalculated\b/i,
  /\bcalculation\b/i,
  /\bmodel\b/i,
  /\bprompt\b/i,
  /\bsystem prompt\b/i,
  /\bchain of thought\b/i,
  /\bjson\b/i,
  /\braw data\b/i,
  /\bvector\b/i,
  /\bengine\b/i,
  /\bframework\b/i,
  
  // Forbidden topics (astrology/woo)
  /\bastrology\b/i,
  /\bhuman design\b/i,
  /\btransit(s)?\b/i,
  /\bzodiac\b/i,
  /\bplanetary\b/i,
  /\bretrograde\b/i,
  /\bshadow work\b/i,
  /\bfrequency\b/i,
  /\bvibration\b/i,
  /\bchakra\b/i,
  
  // Percentage/numeric scoring reveals
  // Removing strict percentage rule because confidence scores are valid
  // /\d+%/,
  /\bscore(d)? \d+/i,
  /\brating of \d+/i,
];

export function guardDisclosure(text: string): { ok: boolean; reason?: string } {
  if (!text) return { ok: true };
  for (const pattern of LEAK_PATTERNS) {
    if (pattern.test(text)) {
      return { 
        ok: false, 
        reason: `Matched forbidden pattern: ${pattern}` 
      };
    }
  }
  return { ok: true };
}

// Apply to all string fields in response
export function guardResponse(response: {
  headline: string;
  whats_happening: string[];
  do_this_now: string;
  one_line_to_say: string;
  repeat_pattern?: string | null;
  safety?: string | null;
}): { ok: boolean; field?: string; reason?: string } {
  
  const fields = [
    { name: 'headline', value: response.headline },
    ...response.whats_happening.map((val, idx) => ({ name: `whats_happening[${idx}]`, value: val })),
    { name: 'do_this_now', value: response.do_this_now },
    { name: 'one_line_to_say', value: response.one_line_to_say },
    { name: 'repeat_pattern', value: response.repeat_pattern },
    { name: 'safety', value: response.safety },
  ].filter(f => f.value != null);
  
  for (const field of fields) {
    const result = guardDisclosure(field.value as string);
    if (!result.ok) {
      return {
        ok: false,
        field: field.name,
        reason: result.reason,
      };
    }
  }
  
  return { ok: true };
}

export function checkSafetyOverride(text: string): { ok: boolean; reason?: string } {
    const SAFETY_PATTERNS: RegExp[] = [
        /\b(suicide|kill myself|end my life|want to die|harm myself)\b/i,
        /\b(kill them|hurt them|harm them|murder)\b/i,
        /\b(going crazy|losing my mind|can't take this anymore|breakdown)\b/i
    ];

    for (const pattern of SAFETY_PATTERNS) {
        if (pattern.test(text)) {
            return {
                ok: false,
                reason: `Safety concern detected: ${pattern}`
            }
        }
    }
    return { ok: true };
}

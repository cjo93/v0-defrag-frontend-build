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
  /\d+%/,
  /\bscore(d)? \d+/i,
  /\brating of \d+/i,
];

export function guardDisclosure(text: string): { ok: boolean; reason?: string } {
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

// Apply to all fields in response
export function guardResponse(response: {
  headline: string;
  happening: string;
  doThis: string;
  avoid: string;
  sayThis: string;
}): { ok: boolean; field?: string; reason?: string } {
  
  const fields = [
    { name: 'headline', value: response.headline },
    { name: 'happening', value: response.happening },
    { name: 'doThis', value: response.doThis },
    { name: 'avoid', value: response.avoid },
    { name: 'sayThis', value: response.sayThis },
  ];
  
  for (const field of fields) {
    const result = guardDisclosure(field.value);
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

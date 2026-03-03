import re

with open('lib/ai-security.ts', 'r') as f:
    content = f.read()

# Replace ValidatedChatResponse definition to match ChatResponse structure
content = re.sub(
    r"export interface ValidatedChatResponse \{\s*headline: string;\s*happening: string;\s*doThis: string;\s*avoid: string;\s*sayThis: string;\s*\}",
    """export interface ValidatedChatResponse {
  headline: string;
  signal: 'low' | 'medium' | 'high';
  confidence: {
    overall: number;
    data_confidence: number;
    pattern_confidence: number;
  };
  whats_happening: string[];
  do_this_now: string;
  one_line_to_say: string;
  repeat_pattern?: string | null;
  safety?: string | null;
}""",
    content
)

# Update REQUIRED_KEYS to match ChatResponse structure
content = re.sub(
    r"const REQUIRED_KEYS = \['headline', 'happening', 'doThis', 'avoid', 'sayThis'\];",
    """const REQUIRED_KEYS = ['headline', 'signal', 'confidence', 'whats_happening', 'do_this_now', 'one_line_to_say'];""",
    content
)

# Update the hasAllKeys logic to handle object properties
content = re.sub(
    r"const hasAllKeys = REQUIRED_KEYS.every\(key => \n\s*rawResponse && typeof rawResponse\[key\] === 'string' && rawResponse\[key\].length > 0\n\s*\);",
    """const hasAllKeys = REQUIRED_KEYS.every(key =>
    rawResponse && rawResponse[key] !== undefined
  );""",
    content
)

# Replace the filterResult fallback return to return a ValidatedChatResponse
content = re.sub(
    r"filtered: \{\s*headline: 'System recalibration',\s*happening: 'The output was flagged for manual review.',\s*doThis: 'Please rephrase your input.',\s*avoid: 'Do not attempt to bypass system rules.',\s*sayThis: 'Let\\'s try again.',\s*\}",
    """filtered: {
        headline: 'System recalibration',
        signal: 'medium',
        confidence: { overall: 50, data_confidence: 50, pattern_confidence: 50 },
        whats_happening: ['The output was flagged for manual review.'],
        do_this_now: 'Please rephrase your input.',
        one_line_to_say: 'Let\\'s try again.'
      }""",
    content
)


with open('lib/ai-security.ts', 'w') as f:
    f.write(content)

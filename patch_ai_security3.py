import re

with open('lib/ai-security.ts', 'r') as f:
    content = f.read()

# Replace the remaining filter fallback
content = re.sub(
    r"filtered: \{\s*headline: 'Signal received',\s*happening: 'Your network is showing some tension right now. This is temporary.',\s*doThis: 'Take a step back. Give yourself space before responding.',\s*avoid: 'Don\\'t make big decisions in the next few hours.',\s*sayThis: 'I need a moment to think about this.',\s*\}",
    """filtered: {
          headline: 'Signal received',
          signal: 'medium',
          confidence: { overall: 50, data_confidence: 50, pattern_confidence: 50 },
          whats_happening: ['Your network is showing some tension right now. This is temporary.'],
          do_this_now: 'Take a step back. Give yourself space before responding.',
          one_line_to_say: 'I need a moment to reflect on this.',
        }""",
    content
)

# Replace another filtered block if it exists
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

import re

with open('lib/ai-security.ts', 'r') as f:
    content = f.read()

# Replace the fallback return block
content = re.sub(
    r"return \{\s*response: \{\s*headline: 'System check',\s*happening: 'The system needs a moment to recalibrate.',\s*doThis: 'Take a pause. Nothing urgent is required right now.',\s*avoid: 'Don\\'t force a decision.',\s*sayThis: 'I\\'m taking time to process this.',\s*\},\s*\};",
    """return {
      headline: 'System check',
      signal: 'medium',
      confidence: { overall: 50, data_confidence: 50, pattern_confidence: 50 },
      whats_happening: ['The system needs a moment to recalibrate.'],
      do_this_now: 'Take a pause. Nothing urgent is required right now.',
      one_line_to_say: 'I\\'m taking time to reflect on this.'
    };""",
    content
)

# Replace the filtered block
content = re.sub(
    r"return \{\s*response: filterResult.filtered!,\s*\};",
    r"return filterResult.filtered!;",
    content
)

# Replace the validated block
content = re.sub(
    r"return \{\s*response: validated,\s*\};",
    r"return validated;",
    content
)

with open('lib/ai-security.ts', 'w') as f:
    f.write(content)

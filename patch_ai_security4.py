import re

with open('lib/ai-security.ts', 'r') as f:
    content = f.read()

# Replace the incorrect mapping in validateStructuredResponse
content = re.sub(
    r"return \{\s*headline: rawResponse\.headline,\s*happening: rawResponse\.happening,\s*doThis: rawResponse\.doThis,\s*avoid: rawResponse\.avoid,\s*sayThis: rawResponse\.sayThis,\s*\}",
    """return {
    headline: rawResponse.headline,
    signal: rawResponse.signal,
    confidence: rawResponse.confidence,
    whats_happening: rawResponse.whats_happening,
    do_this_now: rawResponse.do_this_now,
    one_line_to_say: rawResponse.one_line_to_say,
    repeat_pattern: rawResponse.repeat_pattern,
    safety: rawResponse.safety,
  };""",
    content
)

with open('lib/ai-security.ts', 'w') as f:
    f.write(content)

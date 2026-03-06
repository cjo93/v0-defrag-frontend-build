import re

with open('lib/me-status.ts', 'r') as f:
    content = f.read()

content = content.replace(
"""    return {
      profile_ready: !!profile,
      has_birthline: !!birthline,
      has_relationships: (connectionCount || 0) > 0,""",
"""    return {
      profile_ready: !!profile,
      has_birthline: !!birthline,
      has_relationships: (connectionCount ?? 0) > 0,""")

with open('lib/me-status.ts', 'w') as f:
    f.write(content)

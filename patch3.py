with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

target = """                      "{suggestion}"
"""

replacement = """                      &quot;{suggestion}&quot;
"""

content = content.replace(target, replacement)

with open('app/chat/page.tsx', 'w') as f:
    f.write(content)

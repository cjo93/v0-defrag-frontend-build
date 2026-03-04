with open("app/chat/page.tsx", "r") as f:
    content = f.read()

old_prompts = """                [
                  "Why doesn't my mom understand when I need space?",
                  "Why does my dad push me so hard to succeed?",
                  "Why do people expect me to carry the emotional weight in relationships?",
                  "Why do I feel responsible for fixing other people's problems?"
                ].map"""

new_prompts = """                [
                  "Why doesn't my mom respect my boundaries?",
                  "Why does my dad push me so hard?",
                  "Why can't they see who I am?",
                  "How do I say this without escalation?"
                ].map"""

content = content.replace(old_prompts, new_prompts)

with open("app/chat/page.tsx", "w") as f:
    f.write(content)

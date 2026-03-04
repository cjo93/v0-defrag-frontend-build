import re

with open("app/chat/page.tsx", "r") as f:
    content = f.read()

content = content.replace("switch(signal)", "switch(sensitivity)")

with open("app/chat/page.tsx", "w") as f:
    f.write(content)

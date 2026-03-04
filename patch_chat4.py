with open("app/chat/page.tsx", "r") as f:
    content = f.read()

content = content.replace("await sendChatMessage(userMessage, []);", "await sendChatMessage(userMessage);")

with open("app/chat/page.tsx", "w") as f:
    f.write(content)

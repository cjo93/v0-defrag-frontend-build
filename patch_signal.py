with open("app/chat/page.tsx", "r") as f:
    content = f.read()

content = content.replace("<MicroLabel>Sensitivity</MicroLabel>", "<MicroLabel>Pressure</MicroLabel>")
content = content.replace("Header / Signal", "Header / Pressure")
content = content.replace("render signal color", "render pressure color")

with open("app/chat/page.tsx", "w") as f:
    f.write(content)

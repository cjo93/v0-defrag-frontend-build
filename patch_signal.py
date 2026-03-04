with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('<MicroLabel>Sensitivity</MicroLabel>', '<MicroLabel>Pressure</MicroLabel>')

with open('app/chat/page.tsx', 'w') as f:
    f.write(content)

with open("app/dashboard/dashboard-client.tsx", "r") as f:
    content = f.read()

content = content.replace("size=\"xs\"", "size=\"s\"")
content = content.replace("size=\"xxl\"", "size=\"xl\"")

with open("app/dashboard/dashboard-client.tsx", "w") as f:
    f.write(content)

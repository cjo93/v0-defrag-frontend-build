import re

file_path = "app/chat/page.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Replace the text output of signal
# Find where message.content.signal is rendered
# Let's map it before rendering
mapping_code = """
  const getSignalLabel = (signal: 'low' | 'medium' | 'high') => {
      switch(signal) {
          case 'low': return 'stable';
          case 'medium': return 'moderate';
          case 'high': return 'elevated';
          default: return 'stable';
      }
  };
"""

if "getSignalLabel" not in content:
    content = content.replace("const getSignalColor", mapping_code + "\n  const getSignalColor")

    # Update rendering
    content = content.replace("{message.content.signal}", "{getSignalLabel(message.content.signal)}")

with open(file_path, "w") as f:
    f.write(content)

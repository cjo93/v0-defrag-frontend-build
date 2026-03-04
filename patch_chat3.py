with open("app/chat/page.tsx", "r") as f:
    content = f.read()

old_func = """    try {
      // Mocking API call to use the updated schema for now
      const response: ChatResponse = {
        headline: 'System Overload',
        signal: 'high',
        confidence: {
            overall: 85,
            data_confidence: 90,
            pattern_confidence: 80
        },
        whats_happening: [
            'Escalation pattern detected.',
            'Communication breakdown likely.'
        ],
        do_this_now: 'Step away from the screen. Take 3 slow breaths. Count to 10. Return when calmer.',
        one_line_to_say: 'I need a moment before continuing this.',
        repeat_pattern: 'Tendency to push for resolution when overwhelmed.'
      };

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {"""

new_func = """    try {
      const response = await sendChatMessage(userMessage, []);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {"""

content = content.replace(old_func, new_func)

with open("app/chat/page.tsx", "w") as f:
    f.write(content)

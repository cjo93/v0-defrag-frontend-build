import re

with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

mock_api_call = """      // Mocking API call to use the updated schema for now
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

real_api_call = """      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!res.ok) throw new Error('API Error');

      const response = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {"""

new_content = content.replace(mock_api_call, real_api_call)

with open('app/chat/page.tsx', 'w') as f:
    f.write(new_content)

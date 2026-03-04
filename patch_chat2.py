import re

with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

pattern = r"""    try \{
      // Mocking API call to use the updated schema for now
      const response: ChatResponse = \{
        headline: 'System Overload',
        signal: 'high',
        confidence: \{
            overall: 85,
            data_confidence: 90,
            pattern_confidence: 80
        \},
        whats_happening: \[
            'Escalation pattern detected.',
            'Communication breakdown likely.'
        \],
        do_this_now: 'Step away from the screen. Take 3 slow breaths. Count to 10. Return when calmer.',
        one_line_to_say: 'I need a moment before continuing this.',
        repeat_pattern: 'Tendency to push for resolution when overwhelmed.'
      \};

      setMessages\(prev => \[\.\.\.prev, \{ role: 'assistant', content: response \}\]\);
    \} catch \(err: any\) \{
      setError\(err.message \|\| 'Failed to send message'\);
    \} finally \{
      setIsLoading\(false\);
    \}"""

new_try_block = """    try {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.defrag.app';
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const response: ChatResponse = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }"""

content = re.sub(pattern, new_try_block, content)

with open('app/chat/page.tsx', 'w') as f:
    f.write(content)

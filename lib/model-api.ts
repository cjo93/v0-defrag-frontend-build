// Model API client for local backend (Ollama, vLLM, etc.)
// Usage: await callModel(messages, { model: 'mistral' })

export interface ModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelCallOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callModel(
  messages: ModelMessage[],
  opts: ModelCallOptions = {}
): Promise<{ text: string }> {
  const url = process.env.MODEL_API_URL || 'http://localhost:11434/api/generate';
  // Ollama expects a single prompt string, so we concatenate messages
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  const body = {
    model: opts.model || 'mistral',
    prompt,
    temperature: opts.temperature ?? 0.4,
    // Ollama: max_tokens, vLLM: max_tokens
    max_tokens: opts.maxTokens ?? 300,
    stream: false
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Model API error');
  const data = await res.json();
  // Ollama: { response: string }
  return { text: data.response || '' };
}

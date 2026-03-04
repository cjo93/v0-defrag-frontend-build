'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopNav } from '@/components/top-nav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const RELATIONAL_PROMPTS = [
  "Something feels off with someone close to me",
  "A conversation keeps going in circles",
  "I don't know how to bring this up",
  "I'm not sure what I'm feeling right now",
];

function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setInput(promptParam);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send message');
      }

      const data = await response.json();
      
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen text-white flex flex-col font-sans antialiased">
      <TopNav />

      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
        <div className="mx-auto w-full max-w-[800px] space-y-8">
          {messages.length === 0 ? (
            <div className="min-h-[60vh] flex flex-col justify-center">
              <div className="text-center mb-12 animate-fade-in">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 mb-5">
                  Ask DEFRAG
                </p>
                <h1 className="text-[26px] md:text-[34px] font-normal tracking-[-0.015em] text-white mb-4">
                  What&apos;s on your mind?
                </h1>
                <p className="text-[14px] text-white/55 leading-[1.6]">
                  Explore relational dynamics and patterns
                </p>
              </div>
              
              <div className="grid gap-3 max-w-md mx-auto">
                {RELATIONAL_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left px-4 py-3 border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-200 ease-out rounded-sm animate-fade-in"
                    style={{ animationDelay: `${i * 50 + 100}ms` }}
                  >
                    <span className="text-[14px] text-white/55 leading-[1.6]">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div 
                  key={i}
                  className={`animate-fade-in ${message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-full'}`}
                >
                  {message.role === 'user' ? (
                    <div className="bg-white/[0.06] px-4 py-3 rounded-sm">
                      <p className="text-[14px] text-white leading-[1.6]">
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/[0.02] px-4 py-3 rounded-sm">
                      <div className="text-[14px] text-white/70 leading-[1.6] whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="bg-white/[0.02] px-4 py-3 rounded-sm animate-fade-in">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse delay-200" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {error && (
            <div className="text-center py-4">
              <span className="text-[14px] text-red-400">{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/[0.08] bg-[#0A0A0A] px-6 md:px-8 py-5 safe-bottom">
        <div className="mx-auto w-full max-w-[800px]">
          <form onSubmit={handleSend} className="flex items-end gap-4">
            <div className="flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a relationship dynamic"
                disabled={isLoading}
                className="w-full bg-transparent border border-white/[0.08] rounded-sm h-[48px] px-5 text-[14px] text-white focus:border-white/30 focus:outline-none transition-all duration-200 ease-out placeholder:text-white/30"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center justify-center h-[48px] px-7 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200 ease-out disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen text-white flex items-center justify-center font-sans antialiased">
        <span className="font-mono text-[11px] text-white/45 uppercase tracking-[0.2em]">Initializing...</span>
      </div>
    }>
      <ChatClient />
    </Suspense>
  );
}

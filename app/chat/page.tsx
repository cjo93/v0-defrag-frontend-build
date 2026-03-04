'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BuildStamp } from '@/components/build-stamp';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const RELATIONAL_PROMPTS = [
  "Why doesn't my mom respect my boundaries?",
  "Why does my dad push so hard?",
  "Why can't they see who I am?",
  "How do I say this without escalation?",
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

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="border-b border-white/20 px-6 py-6">
        <div className="mx-auto w-full max-w-[760px] flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="font-mono text-[12px] text-white/50 hover:text-white uppercase tracking-widest transition-colors"
          >
            ← Back
          </button>
          <span className="font-mono text-[12px] text-white/30 uppercase tracking-widest">
            Ask
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto w-full max-w-[760px] space-y-8">
          {messages.length === 0 ? (
            <div className="min-h-[60vh] flex flex-col justify-center">
              <div className="text-center mb-12">
                <h1 className="font-serif text-[32px] md:text-[42px] font-light tracking-[-0.02em] text-white mb-4">
                  What&apos;s on your mind?
                </h1>
                <p className="font-sans text-[16px] text-white/50 tracking-[0.02em]">
                  Explore relational dynamics and patterns
                </p>
              </div>
              
              <div className="grid gap-3 max-w-md mx-auto">
                {RELATIONAL_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left px-6 py-4 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="font-sans text-[15px] text-white/70 leading-relaxed">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, i) => (
                <div 
                  key={i}
                  className={`${message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-full'}`}
                >
                  {message.role === 'user' ? (
                    <div className="border border-white/20 p-6">
                      <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-3">
                        You
                      </span>
                      <p className="font-sans text-[16px] text-white leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <div className="border border-white/10 p-6 bg-white/[0.02]">
                      <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-3">
                        Response
                      </span>
                      <div className="font-sans text-[16px] text-white/80 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="border border-white/10 p-6 flex justify-center">
                  <span className="font-mono text-[12px] text-white/50 uppercase tracking-widest">
                    Processing...
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {error && (
            <div className="text-center py-4">
              <span className="font-sans text-[14px] text-red-400">{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/20 bg-black px-6 py-6 safe-bottom">
        <div className="mx-auto w-full max-w-[760px]">
          <form onSubmit={handleSend} className="flex items-end gap-4">
            <div className="flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a relationship dynamic in your life"
                disabled={isLoading}
                className="w-full bg-transparent border-b border-white/20 py-4 text-[16px] tracking-[0.02em] font-sans focus:border-white focus:outline-none transition-none placeholder:text-white/25"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="font-mono text-[14px] tracking-[0.1em] uppercase text-white/70 hover:text-white disabled:opacity-40 pb-4 border-b border-transparent hover:border-white transition-colors duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      
      <BuildStamp />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <span className="font-mono text-[12px] text-white/50 uppercase tracking-widest">Initializing...</span>
      </div>
    }>
      <ChatClient />
    </Suspense>
  );
}

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sendChatMessage, createCheckoutSession } from '@/lib/api';
import type { ChatResponse } from '@/lib/types';
import { 
  AppShell,
  MicroLabel, 
  H1,
  Body, 
  Spacer,
  LockedScreen 
} from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';

interface Message {
  role: 'user' | 'assistant';
  content: string | ChatResponse;
}

function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOSActive, setIsOSActive] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    checkOSStatus();

    // Check if there is a prompt in URL to pre-fill
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setInput(promptParam);
    }
  }, [user, searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkOSStatus = async () => {
    try {
      const hasOS = false; // TODO: Replace with actual subscription check
      setIsOSActive(hasOS);
    } catch (err: any) {
      setError(err.message || 'Failed to check subscription status');
    }
  };

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    setError('');
    
    try {
      const { url } = await createCheckoutSession('os');
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setIsCheckingOut(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      // Mocking API call to use the updated schema for now
      const response: ChatResponse = {
        headline: 'System Overload',
        pressure: 'high',
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
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render pressure color in grayscale

  const getPressureLabel = (sensitivity: 'low' | 'medium' | 'high') => {
      switch(sensitivity) {
          case 'low': return 'stable';
          case 'medium': return 'moderate';
          case 'high': return 'elevated';
          default: return 'stable';
      }
  };

  const getPressureColor = (sensitivity: 'low' | 'medium' | 'high') => {
      switch(sensitivity) {
          case 'low': return 'text-white/40';
          case 'medium': return 'text-white/70';
          case 'high': return 'text-white';
          default: return 'text-white/40';
      }
  };

  if (!isOSActive) {
    return (
      <>
        <LockedScreen
          title="Console locked"
          body="Requires DEFRAG OS for active intelligence support."
          ctaLabel={isCheckingOut ? "Initializing..." : "Upgrade to DEFRAG OS"}
          onCta={handleUpgrade}
        />
        {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 pt-24 pb-32 safe-top">
        <div className="mx-auto w-full max-w-[760px]">
          {messages.length === 0 ? (
            <>
              <MicroLabel>Intelligence Console</MicroLabel>
              <Spacer size="s" />
              <H1>Ask about a real relationship or situation in your life.</H1>
              <Spacer size="m" />
              <Body>DEFRAG analyzes relational dynamics through your natal structure.</Body>

              <Spacer size="xl" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Why doesn't my mom understand when I need space?",
                  "Why does my dad push me so hard to succeed?",
                  "How do I tell my partner I need more boundaries without escalating?",
                  "Why do conversations with my sibling always turn into an argument over small things?"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-left p-5 border border-white/10 hover:border-white/40 transition-colors duration-200 bg-black group"
                  >
                    <p className="text-[14px] leading-[1.6] text-white/50 group-hover:text-white/80 transition-colors duration-200">
                      &quot;{suggestion}&quot;
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-12">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end mb-4">
                      <div className="max-w-[85%] border-b border-white/20 pb-2">
                        <Body>{message.content as string}</Body>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/20 p-6 rounded-none bg-black">
                      {typeof message.content === 'object' && (
                        <>
                          {/* Header / Signal */}
                          <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                              <h2 className="font-sans text-[24px] leading-[1.3] tracking-[-0.01em] font-medium text-white">
                                {message.content.headline}
                              </h2>
                              <div className="flex items-center gap-4">
                                  <div className="flex flex-col items-end">
                                      <MicroLabel>Pressure</MicroLabel>
                                      <span className={`font-mono text-[12px] uppercase ${getPressureColor(message.content.pressure)}`}>
                                          {getPressureLabel(message.content.pressure)}
                                      </span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                      <MicroLabel>Confidence</MicroLabel>
                                      <span className="font-mono text-[12px] text-white/70">
                                          {message.content.confidence.overall}%
                                      </span>
                                  </div>
                              </div>
                          </div>
                          
                          {/* What's happening */}
                          <div className="mb-6">
                            <MicroLabel>What's happening</MicroLabel>
                            <Spacer size="s" />
                            <ul className="list-disc pl-4 space-y-1">
                                {message.content.whats_happening.map((point, i) => (
                                    <li key={i}><Body>{point}</Body></li>
                                ))}
                            </ul>
                          </div>
                          
                          {/* Do this now */}
                          <div className="mb-6">
                            <MicroLabel>Do this now</MicroLabel>
                            <Spacer size="s" />
                            <Body>{message.content.do_this_now}</Body>
                          </div>
                          
                          {/* Say this */}
                          <div className="mb-6">
                            <MicroLabel>One line to say</MicroLabel>
                            <Spacer size="s" />
                            <div className="border-l-2 border-white/40 pl-4 py-1 my-2">
                                <Body>&quot;{message.content.one_line_to_say}&quot;</Body>
                            </div>
                          </div>

                          {/* Optional sections */}
                          {(message.content.repeat_pattern || message.content.safety) && (
                              <div className="border-t border-white/10 pt-4 mt-4 grid grid-cols-1 gap-4">
                                  {message.content.repeat_pattern && (
                                      <div>
                                          <MicroLabel>Pattern Recognition</MicroLabel>
                                          <Spacer size="s" />
                                          <Body>{message.content.repeat_pattern}</Body>
                                      </div>
                                  )}
                                  {message.content.safety && (
                                      <div>
                                          <MicroLabel>System Note</MicroLabel>
                                          <Spacer size="s" />
                                          <Body>{message.content.safety}</Body>
                                      </div>
                                  )}
                              </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="border border-white/10 p-6 flex justify-center">
                  <span className="font-mono text-[12px] text-white/50 uppercase tracking-widest">Processing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area - pinned to bottom */}
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
              Execute
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
        <span className="font-mono text-[12px] text-white/50 uppercase tracking-widest">Initializing Console...</span>
      </div>
    }>
      <ChatClient />
    </Suspense>
  );
}

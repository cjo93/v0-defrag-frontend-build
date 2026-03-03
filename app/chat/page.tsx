'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createCheckoutSession } from '@/lib/api';
import type { ChatResponse } from '@/lib/types';
import { H1, Body, MicroLabel, Spacer, LockedScreen } from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';

export default function ChatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string | ChatResponse}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOSActive, setIsOSActive] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/');
      return;
    }

    checkOSStatus();
  }, [user, authLoading, router]);

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
        signal_level: 'high',
        confidence_score: 85,
        stability_state: 'low',
        timing_state: 'protect',
        pattern_detected: true,
        pattern_summary: 'Tendency to push for resolution when overwhelmed.',
        risk_level: 'high',
        explanation: 'Escalation pattern detected. Communication breakdown likely.',
        suggested_response: 'Step away from the screen. Take 3 slow breaths. Count to 10. Return when calmer. Say: "I need a moment before continuing this."',
        data_tooltips: [],
        safety_level: 'none'
      };
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render signal color in grayscale

  const getSignalLabel = (signal: 'low' | 'medium' | 'high') => {
      switch(signal) {
          case 'low': return 'stable';
          case 'medium': return 'moderate';
          case 'high': return 'elevated';
          default: return 'stable';
      }
  };

  const getSignalColor = (signal: 'low' | 'medium' | 'high') => {
      switch(signal) {
          case 'low': return 'text-white/40';
          case 'medium': return 'text-white/70';
          case 'high': return 'text-white';
          default: return 'text-white/40';
      }
  };

  if (!isOSActive) {
    return (
      <LockedScreen
        title="Console locked"
        description="Requires DEFRAG OS for active intelligence support."
        productName="DEFRAG OS"
        price="$33"
        priceInterval="month"
        features={[
          'Relational Grid for your network',
          'Connection readouts',
          'Active intelligence console',
          'Network tension mapping'
        ]}
        onUnlock={handleUpgrade}
        isProcessing={isCheckingOut}
        error={error}
      />
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
              <H1>Controlled response.</H1>
              <Spacer size="m" />
              <Body muted>System ready for input.</Body>
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
                                      <MicroLabel>Signal</MicroLabel>
                                      <span className={`font-mono text-[12px] uppercase ${getSignalColor(message.content.signal_level)}`}>
                                          {getSignalLabel(message.content.signal_level)}
                                      </span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                      <MicroLabel>Confidence</MicroLabel>
                                      <span className="font-mono text-[12px] text-white/70">
                                          {message.content.confidence_score}%
                                      </span>
                                  </div>
                              </div>
                          </div>
                          
                          {/* What's happening */}
                          <div className="mb-6">
                            <MicroLabel>Analysis</MicroLabel>
                            <Spacer size="s" />
                            <Body>{message.content.explanation}</Body>
                          </div>
                          
                          {/* Do this now */}
                          <div className="mb-6">
                            <MicroLabel>Suggested Action</MicroLabel>
                            <Spacer size="s" />
                            <Body>{message.content.suggested_response}</Body>
                          </div>

                          {/* Optional sections */}
                          {(message.content.pattern_detected || message.content.safety_level !== 'none') && (
                              <div className="border-t border-white/10 pt-4 mt-4 grid grid-cols-1 gap-4">
                                  {message.content.pattern_detected && (
                                      <div>
                                          <MicroLabel>Pattern Recognition</MicroLabel>
                                          <Spacer size="s" />
                                          <Body muted>{message.content.pattern_summary}</Body>
                                      </div>
                                  )}
                                  {message.content.safety_level !== 'none' && (
                                      <div>
                                          <MicroLabel>System Note</MicroLabel>
                                          <Spacer size="s" />
                                          <Body muted>Safety Risk: {message.content.safety_level}</Body>
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
                placeholder="Enter situation parameters..."
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

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sendChatMessage, createCheckoutSession } from '@/lib/api';
import type { ChatResponse } from '@/lib/types';
import { 
  AppShell,
  MicroLabel, 
  H1,
  Body, 
  Spacer,
  LineInput,
  TextActionButton,
  LockedScreen 
} from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';

interface Message {
  role: 'user' | 'assistant';
  content: string | ChatResponse;
}

export default function ChatPage() {
  const router = useRouter();
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
  }, [user]);

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
      // TODO: Replace with actual API call
      const response: ChatResponse = {
        headline: 'Pause Required',
        happening: 'High tension detected in recent pattern.',
        doThis: 'Step away from screen. Take 3 slow breaths. Count to 10. Return when calmer.',
        avoid: 'Making decisions while escalated',
        sayThis: '"I need a moment before continuing this."',
      };
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOSActive) {
    return (
      <LockedScreen
        title="Crisis Mode locked"
        description="Requires DEFRAG OS for calm authority support."
        productName="DEFRAG OS"
        price="$33"
        priceInterval="month"
        features={[
          'Relational Grid for your network',
          'Connection readouts',
          'Crisis Mode AI support',
          'Network tension mapping'
        ]}
        onUnlock={handleUpgrade}
        isProcessing={isCheckingOut}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 pt-24 pb-32 safe-top">
        <div className="mx-auto w-full max-w-[760px]">
          {messages.length === 0 ? (
            <>
              <MicroLabel>Crisis Mode</MicroLabel>
              <Spacer size="s" />
              <H1>Calm authority.</H1>
              <Spacer size="m" />
              <Body muted>One degree calmer than you.</Body>
            </>
          ) : (
            <div className="space-y-12">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%]">
                        <Body>{message.content as string}</Body>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {typeof message.content === 'object' && (
                        <>
                          {/* Headline */}
                          <div>
                            <h2 className="font-display text-[24px] leading-[1.3] tracking-[-0.01em] font-normal text-white">
                              {message.content.headline}
                            </h2>
                          </div>
                          
                          {/* What's happening */}
                          <div>
                            <MicroLabel>What's happening</MicroLabel>
                            <Spacer size="xs" />
                            <Body>{message.content.happening}</Body>
                          </div>
                          
                          {/* Do this now */}
                          <div>
                            <MicroLabel>Do this now</MicroLabel>
                            <Spacer size="xs" />
                            <Body>{message.content.doThis}</Body>
                          </div>
                          
                          {/* Avoid */}
                          <div>
                            <MicroLabel>Avoid</MicroLabel>
                            <Spacer size="xs" />
                            <Body>{message.content.avoid}</Body>
                          </div>
                          
                          {/* Say this */}
                          <div>
                            <MicroLabel>Say this</MicroLabel>
                            <Spacer size="xs" />
                            <Body muted>"{message.content.sayThis}"</Body>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse" />
                  <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse [animation-delay:150ms]" />
                  <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse [animation-delay:300ms]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area - pinned to bottom */}
      <div className="border-t border-white/10 bg-black px-6 py-6 safe-bottom">
        <div className="mx-auto w-full max-w-[760px]">
          <form onSubmit={handleSend} className="flex items-end gap-4">
            <div className="flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full bg-transparent border-b border-white/20 py-4 text-[16px] tracking-[0.02em] focus:border-white/60 focus:outline-none transition-none placeholder:text-white/25"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="text-[14px] tracking-[0.18em] uppercase text-white/80 hover:text-white disabled:opacity-40 pb-4"
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

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { CTAButton } from '@/components/cta-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { sendChatMessage, createCheckoutSession } from '@/lib/api';
import type { ChatResponse } from '@/lib/types';
import { Send } from 'lucide-react';

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
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkOSStatus = async () => {
    try {
      // TODO: Replace with actual subscription check
      // For now, simulate OS status
      const hasOS = false;
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
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await sendChatMessage(userMessage);
      
      // Mock response
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
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation isAuthenticated={true} onSignOut={signOut} />
        
        <main className="flex flex-1 flex-col items-center justify-center px-6 safe-top safe-bottom">
          <div className="flex max-w-md flex-col gap-6 text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Upgrade Required</h1>
              <p className="text-sm text-muted-foreground">
                Crisis Mode requires DEFRAG OS
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">DEFRAG OS</h2>
                <p className="text-sm text-muted-foreground">
                  Full access to Grid, Crisis Mode, and connection analysis
                </p>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$33</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <CTAButton 
                onClick={handleUpgrade} 
                disabled={isCheckingOut}
                className="w-full"
              >
                {isCheckingOut ? 'Redirecting...' : 'Upgrade to DEFRAG OS'}
              </CTAButton>
            </div>
          </div>
        </main>
        
        <BuildStamp />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation isAuthenticated={true} onSignOut={signOut} />
      
      <main className="flex flex-1 flex-col safe-top safe-bottom">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto w-full max-w-2xl">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <h1 className="text-2xl font-bold">Crisis Mode</h1>
                <p className="text-sm text-muted-foreground">
                  Calm authority. One degree calmer than you.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((message, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    {message.role === 'user' ? (
                      <div className="ml-auto max-w-[80%] rounded-lg bg-muted px-4 py-3">
                        <p className="text-sm">{message.content as string}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 border-l-2 border-border pl-4">
                        {typeof message.content === 'object' && (
                          <>
                            {/* 1. Headline */}
                            <h2 className="text-xl font-bold">
                              {message.content.headline}
                            </h2>
                            
                            {/* 2. What's happening */}
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                What's happening
                              </p>
                              <p className="text-sm">
                                {message.content.happening}
                              </p>
                            </div>
                            
                            {/* 3. Do this now */}
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Do this now
                              </p>
                              <p className="text-sm leading-relaxed">
                                {message.content.doThis}
                              </p>
                            </div>
                            
                            {/* 4. Avoid */}
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Avoid
                              </p>
                              <p className="text-sm">
                                {message.content.avoid}
                              </p>
                            </div>
                            
                            {/* 5. Say this */}
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Say this
                              </p>
                              <p className="text-sm italic">
                                {message.content.sayThis}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-1 w-1 animate-pulse rounded-full bg-foreground" />
                    <div className="h-1 w-1 animate-pulse rounded-full bg-foreground delay-75" />
                    <div className="h-1 w-1 animate-pulse rounded-full bg-foreground delay-150" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input area - pinned to bottom with iOS keyboard handling */}
        <div className="border-t border-border bg-background px-6 py-4 safe-bottom">
          <div className="mx-auto w-full max-w-2xl">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-muted"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading || !input.trim()}
                variant="ghost"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}

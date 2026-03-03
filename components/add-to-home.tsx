/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AddToHomePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has dismissed before
    const dismissed = localStorage.getItem('defrag-add-to-home-dismissed');
    if (dismissed) {
      return;
    }

    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      return;
    }

    // Check if iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent);
    
    if (!isIOS || !isSafari) {
      return;
    }

    // Check if user has viewed readout before
    const hasViewedReadout = localStorage.getItem('defrag-viewed-readout');
    if (hasViewedReadout) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('defrag-add-to-home-dismissed', 'true');
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background p-4 safe-bottom">
      <div className="mx-auto flex max-w-2xl items-start gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">
            Add DEFRAG to your Home Screen for fastest access.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap the share button, then "Add to Home Screen"
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
}

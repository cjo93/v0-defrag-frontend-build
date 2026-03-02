'use client';

import { useState, useEffect } from 'react';

const hashtags = [
  '#defragmentation',
  '#clarity',
  '#systems',
  '#patterns',
  '#baseline',
  '#network',
  '#precision',
  '#analysis',
  '#structure',
  '#intelligence',
];

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animation
      onComplete();
      return;
    }

    // Animate scan line
    const scanInterval = setInterval(() => {
      setScanLine((prev) => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(scanInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative max-w-3xl px-6">
        {/* Hashtag cloud */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {hashtags.map((tag, index) => (
            <div
              key={tag}
              className="text-sm text-muted-foreground opacity-40"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in 0.5s ease-out forwards',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Scanner line */}
        <div 
          className="absolute left-0 right-0 h-[2px] bg-white/50"
          style={{
            top: `${scanLine}%`,
            transition: 'top 0.03s linear',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 0.4;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

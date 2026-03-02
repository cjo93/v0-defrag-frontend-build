'use client';

import { useState, useEffect } from 'react';

const texts = [
  'Your parent.',
  'Your partner.',
  'Your legacy.',
];

export function RotatingText() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((current) => (current + 1) % texts.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p 
      className={`text-xl text-muted-foreground transition-opacity duration-300 md:text-2xl ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {texts[index]}
    </p>
  );
}

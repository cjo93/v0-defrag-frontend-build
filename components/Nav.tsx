import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 safe-top backdrop-blur bg-[rgba(11,13,16,0.85)] border-b border-[var(--border-0)]">
      <div className="mx-auto max-w-[1320px] px-4 flex items-center h-16 justify-between">
        <span className="text-[18px] font-bold tracking-[0.18em] text-[var(--text-0)] uppercase">DEFRAG</span>
        <div className="flex items-center gap-2">
          <a href="#pricing" className="text-[var(--text-1)] text-[15px] px-3 py-2 rounded focus-visible:outline focus-visible:outline-2">Pricing</a>
          <a href="#how-it-works" className="text-[var(--text-1)] text-[15px] px-3 py-2 rounded focus-visible:outline focus-visible:outline-2">How it works</a>
          <a href="/auth/login" className="text-[var(--text-1)] text-[15px] px-3 py-2 rounded focus-visible:outline focus-visible:outline-2">Log in</a>
          <Button variant="default" size="default" asChild>
            <Link href="/auth/signup">Start free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

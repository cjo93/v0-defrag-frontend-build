"use client";

import Link from "next/link";

export function TopNav({ signedIn }: { signedIn: boolean }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="mx-auto w-full max-w-[760px] px-6 md:px-8 pt-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-[11px] tracking-[0.35em] uppercase text-white/60 hover:text-white transition-colors"
          >
            DEFRAG
          </Link>

          {signedIn ? (
            <div className="flex items-center gap-6">
              <NavLink href="/readout/self">Manual</NavLink>
              <NavLink href="/grid">Grid</NavLink>
              <NavLink href="/chat">Crisis</NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <NavLink href="/connect">Sign in</NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

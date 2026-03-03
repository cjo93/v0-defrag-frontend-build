import type { ReactNode } from "react";

export function MicroLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.35em] text-white/35">
      {children}
    </div>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[38px] md:text-[46px] leading-[1.18] tracking-[-0.01em] font-medium text-white">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[24px] md:text-[32px] leading-[1.3] tracking-[-0.01em] font-medium text-white">
      {children}
    </h2>
  );
}

export function Body({ children, muted }: { children: ReactNode; muted?: boolean }) {
  if (muted) {
    return (
      <p className="text-[16px] leading-[1.75] text-white/30">
        {children}
      </p>
    );
  }
  return (
    <p className="text-[16px] leading-[1.75] text-white/45">
      {children}
    </p>
  );
}

export function BodyContent({ children }: { children: ReactNode }) {
  return (
    <p className="text-[16px] leading-[1.75] text-white/60">
      {children}
    </p>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] leading-[1.7] text-white/40">
      {children}
    </p>
  );
}

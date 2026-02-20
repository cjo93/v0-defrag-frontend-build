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
    <h1 className="font-display text-[34px] md:text-[40px] leading-[1.2] tracking-[-0.015em] text-white">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[24px] leading-[1.3] text-white">
      {children}
    </h2>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] leading-[1.75] text-white/45">
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

"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function LineInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full bg-transparent text-white placeholder:text-white/25",
        "text-[16px] py-5",
        "border-b border-white/15 focus:border-white/35 outline-none",
        "transition-colors",
        props.className || "",
      ].join(" ")}
    />
  );
}

export function TextActionButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center",
        "text-[12px] uppercase tracking-[0.18em]",
        "text-white/70 hover:text-white",
        "transition-colors",
        "py-3",
        props.className || "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function PrimaryActionButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  // restrained: no rainbow, no shimmer
  return (
    <button
      {...props}
      className={[
        "w-full",
        "text-[12px] uppercase tracking-[0.18em]",
        "text-white",
        "py-5",
        "border border-white/20 hover:border-white/40",
        "transition-colors",
        "min-h-[44px]",
        props.className || "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

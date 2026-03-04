import { ReactNode } from "react";

export default function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-all duration-200 ${className}`}
    >
      <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">
        {title}
      </div>
      {children}
    </div>
  );
}

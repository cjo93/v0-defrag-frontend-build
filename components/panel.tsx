import { ReactNode } from "react";

export default function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-white/10 bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/20 hover:-translate-y-[1px] rounded-sm ${className}`}
    >
      {title && (
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 font-medium mb-4">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

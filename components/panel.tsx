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
    <section
      className={`border border-white/10 bg-white/[0.02] p-6 transition-colors duration-200 hover:border-white/20 rounded-sm ${className}`}
      aria-label={title || undefined}
    >
      {title && (
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 font-medium pb-3 mb-4 border-b border-white/[0.06]">
          {title}
        </div>
      )}
      {children}
    </section>
  );
}

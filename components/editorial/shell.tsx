import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}

export function EditorialRail({
  children,
  variant = "app",
}: {
  children: ReactNode;
  variant?: "intake" | "app";
}) {
  // intake: narrow (connect) with elevated top offset for authority
  // app: slightly wider (readout/grid/chat)
  const width = variant === "intake" ? "max-w-[520px]" : "max-w-[640px]";
  const topOffset = variant === "intake" ? "pt-40 md:pt-48" : "pt-24";

  return (
    <div className="w-full">
      <div className={`mx-auto w-full ${width} px-6 md:px-8 ${topOffset} pb-40`}>
        {children}
      </div>
    </div>
  );
}

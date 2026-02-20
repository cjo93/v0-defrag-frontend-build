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
  // intake: narrow (connect)
  // app: slightly wider (readout/grid/chat)
  const width = variant === "intake" ? "max-w-[520px]" : "max-w-[760px]";

  return (
    <div className="w-full">
      <div className={`mx-auto w-full ${width} px-6 md:px-8 pt-32 pb-40`}>
        {children}
      </div>
    </div>
  );
}

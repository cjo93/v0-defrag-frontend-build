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
  width: customWidth,
}: {
  children: ReactNode;
  variant?: "intake" | "app";
  width?: string;
}) {
  // intake: narrow (connect) with elevated top offset for authority
  // app: slightly wider (readout/grid/chat)
  let widthClass = variant === "intake" ? "max-w-[520px]" : "max-w-[640px]";
  if (customWidth === "app") widthClass = "max-w-[640px]";
  else if (customWidth) widthClass = customWidth;

  const topOffset = variant === "intake" ? "pt-40 md:pt-48" : "pt-24";

  return (
    <div className="w-full">
      <div className={`mx-auto w-full ${widthClass} px-6 md:px-8 ${topOffset} pb-40`}>
        {children}
      </div>
    </div>
  );
}

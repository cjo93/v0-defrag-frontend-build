export function Spacer({ size }: { size: "xs" | "s" | "m" | "l" | "xl" | "xxl" }) {
  const map = {
    xs: "mt-3",
    s: "mt-6",   // 1.5rem / 24px - minor separation
    m: "mt-12",  // 3rem / 48px - between fields
    l: "mt-20",  // 5rem / 80px - between sections
    xl: "mt-32", // 8rem / 128px - between major blocks
    xxl: "mt-48",
  } as const;

  return <div className={map[size]} aria-hidden="true" />;
}

export function Hairline() {
  return <div className="mt-20 h-px w-10 bg-white/10" aria-hidden="true" />;
}

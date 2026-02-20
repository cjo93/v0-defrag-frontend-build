export function Spacer({ size }: { size: "s" | "m" | "l" | "xl" }) {
  const map = {
    s: "mt-10",
    m: "mt-16",
    l: "mt-20",
    xl: "mt-24",
  } as const;

  return <div className={map[size]} aria-hidden="true" />;
}

export function Hairline() {
  return <div className="mt-20 h-px w-10 bg-white/10" aria-hidden="true" />;
}

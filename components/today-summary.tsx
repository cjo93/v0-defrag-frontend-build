"use client";

type RelationshipState = {
  name: string;
  state: "stable" | "strained" | "cooling" | "improving" | "unclear";
};

const STATE_COLOR: Record<string, string> = {
  stable: "text-white/70",
  strained: "text-white/40",
  cooling: "text-white/50",
  improving: "text-white/80",
  unclear: "text-white/30",
};

export default function TodaySummary({
  states,
}: {
  states: RelationshipState[];
}) {
  if (states.length === 0) {
    return (
      <p className="text-[14px] text-white/30 leading-[1.6]">
        No relationship data yet. Add people to see relational state.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {states.map((p) => (
        <div
          key={p.name}
          className="flex justify-between items-center text-[14px]"
        >
          <span className="text-white/70">{p.name}</span>
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
              STATE_COLOR[p.state] ?? "text-white/30"
            }`}
          >
            {p.state}
          </span>
        </div>
      ))}
    </div>
  );
}

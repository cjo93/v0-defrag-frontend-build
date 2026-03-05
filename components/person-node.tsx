"use client";

import { useRouter } from "next/navigation";

type Person = {
  id: string;
  name: string;
  relationship_label: string | null;
  privacy_level: string;
  relationship_state?: "stable" | "strained" | "cooling" | "improving" | "unclear" | null;
};

const PRIVACY_COLOR: Record<string, string> = {
  full: "text-white/60",
  partial: "text-white/40",
  minimal: "text-white/25",
};

const STATE_STYLE: Record<string, { label: string; color: string }> = {
  stable:    { label: "stable",    color: "text-white/70" },
  strained:  { label: "strained",  color: "text-white/40" },
  cooling:   { label: "cooling",   color: "text-white/50" },
  improving: { label: "improving", color: "text-white/80" },
  unclear:   { label: "unclear",   color: "text-white/30" },
};

export default function PersonNode({
  person,
  index,
  total,
}: {
  person: Person;
  index: number;
  total: number;
}) {
  const router = useRouter();

  const radius = 200;
  // Start from top (−π/2) so first node sits above center
  const angle = (2 * Math.PI) / total * index - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  // Subtle per-node animation delay for staggered float
  const delay = `${(index * 1.2).toFixed(1)}s`;

  return (
    <button
      onClick={() =>
        router.push(
          `/chat?person=${person.id}&prompt=Tell me about my dynamic with ${encodeURIComponent(person.name)}`
        )
      }
      className="absolute group transition-transform duration-300 ease-out hover:scale-110 focus:outline-none"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        animationDelay: delay,
      }}
    >
      {/* Node pill */}
      <div className="relative flex flex-col items-center gap-1 animate-float">
        <div
          className="px-4 py-2.5 border border-white/10 bg-white/[0.02] rounded-sm shadow-[0_0_40px_rgba(255,255,255,0.03)] group-hover:border-white/20 group-hover:bg-white/[0.06] transition-all duration-300"
          style={{ animationDelay: delay }}
        >
          <span className="text-[14px] text-white font-medium whitespace-nowrap">
            {person.name}
          </span>
        </div>

        {/* Relationship label */}
        {person.relationship_label && (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 whitespace-nowrap">
            {person.relationship_label}
          </span>
        )}

        {/* Relationship state */}
        {person.relationship_state && person.relationship_state !== "unclear" && (
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.12em] whitespace-nowrap ${
              STATE_STYLE[person.relationship_state]?.color ?? "text-white/30"
            }`}
          >
            {STATE_STYLE[person.relationship_state]?.label ?? person.relationship_state}
          </span>
        )}

        {/* Privacy dot */}
        <span
          className={`block w-1.5 h-1.5 rounded-full mt-0.5 ${
            person.privacy_level === "full"
              ? "bg-white/60"
              : person.privacy_level === "partial"
              ? "bg-white/30"
              : "bg-white/15"
          }`}
        />
      </div>
    </button>
  );
}

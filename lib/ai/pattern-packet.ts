export type PatternPacket = {
  tier: "GREEN" | "YELLOW" | "RED";              // internal only
  locale?: string;
  userContext?: {
    timezone?: string;
    city?: string;
  };
  signals: Array<{
    id: string;                                  // stable opaque id
    label: "Energy Style" | "Daily Weather" | "Friction" | "Family Echoes";
    summary: string;                             // human-facing, no math
    certainty: "low" | "medium" | "high";
  }>;
  constraints: {
    forbiddenTopics: string[];
    noMechanicsDisclosure: true;
    format: "FIVE_BLOCKS_JSON";
  };
};

export function buildPatternPacket(args: {
  tier: PatternPacket["tier"];
  timezone?: string;
  city?: string;
  signals: PatternPacket["signals"];
}): PatternPacket {
  return {
    tier: args.tier,
    userContext: { timezone: args.timezone, city: args.city },
    signals: args.signals.map(s => ({
      id: s.id,
      label: s.label,
      summary: s.summary,
      certainty: s.certainty,
    })),
    constraints: {
      forbiddenTopics: [
        "astrology","human design","transits","zodiac","planetary","retrograde",
        "shadow","frequency","vibration","chakra",
        // also block computation disclosure vocabulary:
        "algorithm","scoring","threshold","weights","mapping","logic","model",
        "calculation","computed","vector","prompt","system prompt","chain of thought"
      ],
      noMechanicsDisclosure: true,
      format: "FIVE_BLOCKS_JSON",
    },
  };
}

/**
 * Relational Pattern Engine — Pre-AI Analysis Layer
 *
 * Converts raw user messages into structured relationship signals.
 * Runs locally in the API route (zero cost, zero latency).
 * Output is injected into the AI prompt as structured context.
 */

export interface RelationalSignal {
  relationshipType: string;
  tensionType: string;
  escalationRisk: "low" | "moderate" | "high";
  pattern: string;
  guidanceMode: string;
}

// ── Keyword maps ──────────────────────────────────────────────

const RELATIONSHIP_KEYWORDS: Record<string, string[]> = {
  parent_child: [
    "mom", "mother", "dad", "father", "parent", "parents",
    "son", "daughter", "child", "kids",
  ],
  sibling: [
    "sister", "brother", "sibling", "siblings", "twin",
  ],
  romantic: [
    "partner", "boyfriend", "girlfriend", "husband", "wife",
    "spouse", "ex", "dating", "relationship",
  ],
  friend: [
    "friend", "best friend", "roommate", "friendship",
  ],
  authority_dynamic: [
    "boss", "manager", "coworker", "colleague", "supervisor",
    "employee", "work", "team lead",
  ],
  family_system: [
    "family", "in-law", "in-laws", "mother-in-law", "father-in-law",
    "grandparent", "grandmother", "grandfather", "uncle", "aunt",
    "cousin", "nephew", "niece",
  ],
};

const TENSION_KEYWORDS: Record<string, string[]> = {
  pressure_vs_autonomy: [
    "pressure", "pushing", "controlling", "telling me what to do",
    "micromanag", "hovering", "smothering", "overbearing",
  ],
  boundary_setting: [
    "space", "boundaries", "boundary", "distance", "room to breathe",
    "back off", "need time", "alone", "too close",
  ],
  approval_seeking: [
    "approval", "validation", "good enough", "proud of me",
    "disappoint", "expectations", "measuring up", "not enough",
  ],
  trust_repair: [
    "trust", "betrayal", "lied", "cheated", "broken trust",
    "secret", "honest", "transparency",
  ],
  role_confusion: [
    "role", "responsibility", "unfair", "always me", "parentif",
    "taking care of", "shouldn't have to",
  ],
  communication_mismatch: [
    "misunderstand", "not listening", "doesn't hear me",
    "different language", "talk past", "interpret",
  ],
};

const PATTERN_KEYWORDS: Record<string, string[]> = {
  pursue_withdraw: [
    "withdraw", "avoid", "pulling away", "shut down", "stonewalling",
    "silent treatment", "chase", "pursuing",
  ],
  escalation_cycle: [
    "escalate", "spiraling", "worse and worse", "blowing up",
    "yelling", "screaming", "out of control",
  ],
  triangulation: [
    "sides", "between us", "go-between", "playing us",
    "telling them", "bringing in", "involving",
  ],
  enmeshment: [
    "enmesh", "codepend", "can't separate", "too involved",
    "no identity", "lost myself", "merged",
  ],
  parentification: [
    "parentif", "raising my parent", "adult too early",
    "taking care of everyone", "emotional labor",
  ],
  repetition_compulsion: [
    "same pattern", "keeps happening", "every time", "cycle",
    "repeating", "déjà vu", "again and again",
  ],
};

// ── Guidance mode inference ───────────────────────────────────

function inferGuidanceMode(
  tensionType: string,
  escalationRisk: string,
  pattern: string
): string {
  if (escalationRisk === "high") return "de_escalation";
  if (tensionType === "boundary_setting") return "boundary_clarification";
  if (tensionType === "trust_repair") return "repair_pathway";
  if (tensionType === "approval_seeking") return "self_validation";
  if (pattern === "pursue_withdraw") return "cycle_interruption";
  if (pattern === "triangulation") return "direct_communication";
  if (pattern === "enmeshment") return "differentiation";
  if (tensionType === "communication_mismatch") return "translation";
  return "pattern_recognition";
}

// ── Match helper ──────────────────────────────────────────────

function matchKeywords(
  text: string,
  map: Record<string, string[]>,
  fallback: string
): string {
  let best = fallback;
  let bestScore = 0;

  for (const [label, keywords] of Object.entries(map)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = label;
    }
  }

  return best;
}

// ── Main detector ─────────────────────────────────────────────

export function detectRelationalPattern(
  message: string,
  personContext: any = null
): RelationalSignal {
  const text = message.toLowerCase();

  // Relationship type: prefer person context label if available
  let relationshipType = "general";
  if (personContext?.relationship_label) {
    const label = personContext.relationship_label.toLowerCase();
    // Map common labels to types
    if (/parent|mom|dad|mother|father/.test(label)) relationshipType = "parent_child";
    else if (/partner|spouse|husband|wife|boyfriend|girlfriend/.test(label)) relationshipType = "romantic";
    else if (/sibling|sister|brother/.test(label)) relationshipType = "sibling";
    else if (/friend/.test(label)) relationshipType = "friend";
    else if (/boss|manager|coworker|colleague/.test(label)) relationshipType = "authority_dynamic";
    else if (/family|in-law|uncle|aunt|cousin|grand/.test(label)) relationshipType = "family_system";
    else relationshipType = label; // use raw label as fallback
  }
  // Override with message keywords if still general
  if (relationshipType === "general") {
    relationshipType = matchKeywords(text, RELATIONSHIP_KEYWORDS, "general");
  }

  // Tension type
  const tensionType = matchKeywords(text, TENSION_KEYWORDS, "unclear");

  // Pattern
  const pattern = matchKeywords(text, PATTERN_KEYWORDS, "unknown");

  // Escalation risk
  let escalationRisk: "low" | "moderate" | "high" = "low";
  const highEscalation = [
    "fight", "argument", "escalat", "yelling", "screaming",
    "blowing up", "out of control", "can't take it",
  ];
  const moderateEscalation = [
    "frustrated", "angry", "upset", "tension", "tense",
    "annoyed", "resentment", "fed up", "had enough",
  ];

  if (highEscalation.some((kw) => text.includes(kw))) {
    escalationRisk = "high";
  } else if (moderateEscalation.some((kw) => text.includes(kw))) {
    escalationRisk = "moderate";
  }

  // Guidance mode
  const guidanceMode = inferGuidanceMode(tensionType, escalationRisk, pattern);

  return {
    relationshipType,
    tensionType,
    escalationRisk,
    pattern,
    guidanceMode,
  };
}

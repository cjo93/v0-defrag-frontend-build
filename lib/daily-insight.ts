export interface DailyInsight {
  title: string
  detail?: string
}

export function computeDailyInsight(data: {
  people: any[]
  timing?: any
  anchors?: any[]
}): DailyInsight | null {

  const strained = data.people.find(p => p.relationship_state === "strained")

  if (strained) {
    return {
      title: `Tension appears to be building with ${strained.name}.`,
      detail: "Slowing the pace of conversation may help prevent escalation."
    }
  }

  const improving = data.people.find(p => p.relationship_state === "improving")

  if (improving) {
    return {
      title: `Your connection with ${improving.name} appears to be improving.`,
      detail: "Repair signals have increased recently."
    }
  }

  if (data.timing) {
    return {
      title: "Some conversations tend to become tense later in the day.",
      detail: "Earlier discussions may feel easier."
    }
  }

  return null
}

export interface ConflictEvent {
  id: string;
  relationship_id: string;
  topic_tag?: string;
  trigger_tag?: string;
  timestamp: Date;
  severity_score: number;
  time_of_day_bucket: 'morning' | 'afternoon' | 'evening' | 'late_night';
}

export interface PatternCluster {
  relationship_id: string;
  trigger_tag: string;
  events: ConflictEvent[];
  count: number;
  isRecurring: boolean;
  timingPatternFlag: boolean;
  timingPatternMessage: string | null;
  progression: 'intensifying' | 'improving' | 'stable';
  userMessage: string;
}

/**
 * Detects patterns from a list of conflict events (assumed to be within the last 30 days).
 */
export function detectPatterns(events: ConflictEvent[]): PatternCluster[] {
  // Step 2: Group by (relationship_id + trigger_tag)
  const grouped = events.reduce((acc, event) => {
    if (!event.trigger_tag) return acc; // Skip if no trigger tag

    const key = `${event.relationship_id}_${event.trigger_tag}`;
    if (!acc[key]) {
      acc[key] = {
        relationship_id: event.relationship_id,
        trigger_tag: event.trigger_tag,
        events: []
      };
    }
    acc[key].events.push(event);
    return acc;
  }, {} as Record<string, { relationship_id: string, trigger_tag: string, events: ConflictEvent[] }>);

  const clusters: PatternCluster[] = [];

  for (const key in grouped) {
    const group = grouped[key];

    // Sort events chronologically to check progression
    group.events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Step 3: Check count >= 3
    const count = group.events.length;
    const isRecurring = count >= 3;

    if (!isRecurring) continue; // Only care about recurring clusters per spec

    // D. Time-Based Pattern Detection
    const timingCounts = group.events.reduce((acc, event) => {
      acc[event.time_of_day_bucket] = (acc[event.time_of_day_bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let timingPatternFlag = false;
    let timingPatternMessage: string | null = null;

    for (const [bucket, bCount] of Object.entries(timingCounts)) {
      if (bCount / count >= 0.6) {
        timingPatternFlag = true;
        // Human readable bucket name
        const bucketName = bucket.replace('_', ' ');
        timingPatternMessage = `Most escalations occur in the ${bucketName}.`;
        break; // Assuming only one bucket can have >= 60%
      }
    }

    // E. Escalation Progression Check
    let progression: 'intensifying' | 'improving' | 'stable' = 'stable';
    if (count >= 2) {
      // Simple trend check: compare first half average to second half average, or simply first to last
      // Using a basic linear trend or comparing first to last for v1
      const firstEvent = group.events[0];
      const lastEvent = group.events[count - 1];

      if (lastEvent.severity_score > firstEvent.severity_score + 10) { // arbitrary threshold for "trend"
        progression = 'intensifying';
      } else if (lastEvent.severity_score < firstEvent.severity_score - 10) {
        progression = 'improving';
      }
    }

    // F. Output Language Rule
    let userMessage = "This dynamic has appeared several times recently.";
    if (progression === 'intensifying') {
      userMessage += " The intensity of this pattern has been increasing.";
    } else if (progression === 'improving') {
      userMessage += " This pattern appears to be softening.";
    }

    clusters.push({
      relationship_id: group.relationship_id,
      trigger_tag: group.trigger_tag,
      events: group.events,
      count,
      isRecurring,
      timingPatternFlag,
      timingPatternMessage,
      progression,
      userMessage
    });
  }

  return clusters;
}

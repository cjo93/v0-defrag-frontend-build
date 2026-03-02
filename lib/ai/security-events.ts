// Security event logging for AI interactions

export type SecurityEventType = 
  | 'DISCLOSURE_BLOCKED'
  | 'SCHEMA_VALIDATION_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'PROMPT_INJECTION_DETECTED';

export interface SecurityEvent {
  user_id?: string;
  timestamp: string;
  endpoint: string;
  event_type: SecurityEventType;
  reason: string;
  model_name?: string;
  snippet?: string; // First 80 chars max, redacted
}

// In-memory store for now - move to database in production
const events: SecurityEvent[] = [];

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    snippet: event.snippet?.slice(0, 80), // Enforce max length
  };
  
  events.push(fullEvent);
  
  // Also log to console for immediate visibility
  console.warn('[AI_SECURITY]', {
    type: fullEvent.event_type,
    endpoint: fullEvent.endpoint,
    reason: fullEvent.reason,
    user_id: fullEvent.user_id,
  });
  
  // TODO: Persist to database (ai_security_events table)
  // TODO: Alert if rate exceeds threshold
}

export function getRecentEvents(limit = 100): SecurityEvent[] {
  return events.slice(-limit);
}

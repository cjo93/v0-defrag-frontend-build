import { NextRequest, NextResponse } from 'next/server';
import { buildSignalPacket, SignalPacket } from '@/lib/ai/signal-packet';
import { DefragCrisisResponseSchema, SAFE_FALLBACK_RESPONSE } from '@/lib/ai/response-schema';
import { guardResponse, checkSafetyOverride } from '@/lib/ai/disclosure-guard';
import { logSecurityEvent } from '@/lib/ai/security-events';
import { getUser } from '@/lib/supabase';

// Rate limiting - simple in-memory (move to Redis/Upstash in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const current = rateLimitMap.get(userId);
  
  if (!current || now > current.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  
  if (current.count >= RATE_LIMIT) {
    return false;
  }
  
  current.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Rate limit
    if (!checkRateLimit(user.id)) {
      logSecurityEvent({
        user_id: user.id,
        endpoint: '/api/ai/chat',
        event_type: 'RATE_LIMIT_EXCEEDED',
        reason: `Exceeded ${RATE_LIMIT} requests per minute`,
      });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      );
    }
    
    // 3. Parse request
    const body = await req.json();
    const { situation, tier, signals, memoryEnabled = true } = body;
    
    if (!situation || !tier || !signals) {
      return NextResponse.json(
        { error: 'Missing required fields: situation, tier, signals' },
        { status: 400 }
      );
    }

    // Safety Override Check (Input)
    const safetyCheck = checkSafetyOverride(situation);
    if (!safetyCheck.ok) {
        logSecurityEvent({
            user_id: user.id,
            endpoint: '/api/ai/chat',
            event_type: 'SAFETY_OVERRIDE_TRIGGERED',
            reason: safetyCheck.reason || 'Input safety concern',
        });
        return NextResponse.json({
            headline: "Critical Safety Pause",
            signal: { level: "high_sensitivity", label: "Critical Risk" },
            confidence: { overall: 100, data_confidence: 100, pattern_confidence: 100 },
            whats_happening: [
                "Severe distress detected.",
                "System safety protocols have been triggered due to the nature of the input."
            ],
            do_this_now: "Please stop and contact immediate local emergency services or a crisis lifeline (e.g., 988 in the US). Do not take any further action until you speak to a professional.",
            one_line_to_say: "I need immediate professional support.",
            repeat_pattern: { detected: false, message: "" },
            timing: { recommendation: "Pause immediately", delay_suggested: true },
            decision_guard: { triggered: true, reason: "Safety protocol triggered" },
            safety: { level: "high", guidance: ["Contact emergency services"] }
        });
    }

    // Memory Logic
    let memoryContext = "";
    if (memoryEnabled) {
      // TODO: Fetch user conversation history/memory state from DB
      memoryContext = "Historical Context: [Load structural and conversational memory here if enabled]";
    } else {
      memoryContext = "Memory is disabled for this session.";
    }
    
    // 4. Build Signal Packet (Layer 1: Strict input shaping)
    const packet: SignalPacket = buildSignalPacket({
      tier,
      timezone: body.timezone,
      city: body.city,
      signals: signals.map((s: any) => ({
        id: s.id,
        label: s.label,
        summary: s.summary,
        certainty: s.certainty,
      })),
    });
    
    // 5. Build system prompt with anti-leakage instructions
    const systemPrompt = `You are the DEFRAG Relational Intelligence Engine.

Your role:
Translate structured relational data into calm, practical, timing-aware guidance.

You are not:
* A therapist
* A diagnostician
* A moral authority
* A spiritual guide

You do not:
* Assign blame
* Use psychiatric labels
* Predict destiny
* Use mystical or astrological language
* Reveal internal weighting systems
* Reveal proprietary calculation logic

You operate under three principles:
1. Reduce escalation.
2. Increase timing awareness.
3. Provide immediately usable language.

---
## INPUT YOU RECEIVE
You will receive:
* User question (natural language)
* Structured relational signals:
  * sensitivity_level
  * stability_score
  * conflict_frequency
  * recent_pattern_hits
  * timing_window
  * decision_risk_flag
* Historical similarity markers
* Data confidence score
* Pattern confidence score
* Safety tier flag (0–3)

You must not invent missing data.
If data_confidence is low, acknowledge uncertainty calmly.

CONTEXT:
- User tier: ${packet.tier} (internal only - never mention)
- Situation: "${situation}"
- Available signals: ${packet.signals.map(s => `${s.label}: ${s.summary}`).join('; ')}
- ${memoryContext}

---
## REQUIRED OUTPUT FORMAT (STRICT JSON)

You must return output in the following structure:

{
  "headline": "",
  "signal": {
    "level": "low | medium | high_sensitivity",
    "label": ""
  },
  "confidence": {
    "overall": 0,
    "data_confidence": 0,
    "pattern_confidence": 0
  },
  "whats_happening": [],
  "do_this_now": "",
  "one_line_to_say": "",
  "repeat_pattern": {
    "detected": false,
    "message": ""
  },
  "timing": {
    "recommendation": "",
    "delay_suggested": false
  },
  "decision_guard": {
    "triggered": false,
    "reason": ""
  },
  "safety": {
    "level": "none | elevated | high",
    "guidance": []
  }
}

No additional fields allowed.

---
## RESPONSE RULES

### 1. Headline
One sentence. Clear. No metaphor. No abstraction.
Example: "Reactions are elevated and pushing now may increase defensiveness."

### 2. Whats Happening
2–4 bullet statements.
* Describe dynamic.
* Describe protection response.
* Avoid blame.
Do NOT say: "You always..." "They are toxic..." "You are avoidant..."

### 3. Do This Now
One immediate adjustment. Concrete. Behavioral.

### 4. One Line To Say
Must:
* Lower defensiveness
* Reduce intensity
* Avoid accusation
* Avoid absolutes
Maximum 20 words.

### 5. Repeat Pattern Handling
If recent_pattern_hits >= threshold:
repeat_pattern.detected = true
Message format: "This feels similar to earlier moments this month. A familiar dynamic may be forming."
Never: "You keep doing this."

### 6. Decision Guard Logic
If decision_risk_flag = true AND stability_score < threshold:
decision_guard.triggered = true
Reason format: "Major decisions made during low stability often feel urgent but may shift in 24–48 hours."
Recommend pause. Never forbid. Never shame.

### 7. Safety Tier Handling
Tier 1 (Elevated emotion): Encourage pause. Lower tone.
Tier 2 (Harm intent): Strongly encourage distance from action. Encourage outside support.
Tier 3 (Severe risk): Provide crisis resources. Encourage immediate real-world help.
Never validate harm.

### 8. Language Constraints
Use: Simple sentences. Calm tone. Neutral phrasing.
Avoid: Spiritual framing, backend mechanical metaphors, abstract platform metaphors, "Operating system" references, Destiny language.

You are a stabilizer.`;
    
    // 6. Call AI model (replace with your actual AI provider)
    async function callModel() {
        return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
            model: 'gpt-4o', // Assuming structured output/latest model
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: situation },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.0, // Strict anti-drift logic
            max_tokens: 800,
            }),
        });
    }

    let rawContent = "";
    let parsedResponse;
    let attempts = 0;
    let validationResult;

    // Retry logic (1 retry as requested)
    while (attempts < 2) {
        attempts++;
        const aiResponse = await callModel();

        if (!aiResponse.ok) {
            console.error(`AI provider error: ${aiResponse.status}`);
            if (attempts === 2) throw new Error(`AI provider error: ${aiResponse.status}`);
            continue;
        }

        const aiData = await aiResponse.json();
        rawContent = aiData.choices[0].message.content;

        try {
            parsedResponse = JSON.parse(rawContent);
        } catch (e) {
            console.error('Invalid JSON response from model', rawContent);
            if (attempts === 2) {
                 logSecurityEvent({
                    user_id: user.id,
                    endpoint: '/api/ai/chat',
                    event_type: 'SCHEMA_VALIDATION_FAILED',
                    reason: 'Invalid JSON response from model after retry',
                    model_name: 'gpt-4o',
                    snippet: rawContent,
                });
                return NextResponse.json(SAFE_FALLBACK_RESPONSE);
            }
            continue;
        }

        validationResult = DefragCrisisResponseSchema.safeParse(parsedResponse);
        if (validationResult.success) {
            break; // Success
        } else {
             console.error('Schema validation failed', validationResult.error.message);
             if (attempts === 2) {
                 logSecurityEvent({
                    user_id: user.id,
                    endpoint: '/api/ai/chat',
                    event_type: 'SCHEMA_VALIDATION_FAILED',
                    reason: validationResult.error.message,
                    model_name: 'gpt-4o',
                    snippet: rawContent,
                });
                return NextResponse.json(SAFE_FALLBACK_RESPONSE);
             }
        }
    }

    // This should never happen if the while loop completes successfully, but TS requires it
    if (!validationResult || !validationResult.success) {
        return NextResponse.json(SAFE_FALLBACK_RESPONSE);
    }
    
    const validatedResponse = validationResult.data;

    // Safety Override Check (Output)
    const outputSafetyCheck = checkSafetyOverride(JSON.stringify(validatedResponse));
    if (!outputSafetyCheck.ok) {
        logSecurityEvent({
            user_id: user.id,
            endpoint: '/api/ai/chat',
            event_type: 'SAFETY_OVERRIDE_TRIGGERED',
            reason: outputSafetyCheck.reason || 'Output safety concern',
        });
        return NextResponse.json({
            ...SAFE_FALLBACK_RESPONSE,
            headline: "Safety Override",
            whats_happening: [
                "The system has overridden this response due to safety protocols.",
                "A safety risk was detected in the generated guidance."
            ],
            do_this_now: "If you are in immediate danger, please contact emergency services.",
            one_line_to_say: "I need to take a step back to ensure safety."
        });
    }
    
    // 8. Disclosure guard (Layer 3: Block leakage)
    const guardResult = guardResponse(validatedResponse);
    if (!guardResult.ok) {
      logSecurityEvent({
        user_id: user.id,
        endpoint: '/api/ai/chat',
        event_type: 'DISCLOSURE_BLOCKED',
        reason: guardResult.reason || 'Unknown',
        model_name: 'gpt-4o',
        // @ts-ignore
        snippet: guardResult.field ? validatedResponse[guardResult.field] : undefined,
      });
      return NextResponse.json(SAFE_FALLBACK_RESPONSE);
    }
    
    // 9. Success - return validated, guarded response
    return NextResponse.json(validatedResponse);
    
  } catch (error) {
    console.error('[AI_CHAT_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

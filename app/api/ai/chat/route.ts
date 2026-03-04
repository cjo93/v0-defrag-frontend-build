import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, supabaseAdmin } from '@/lib/auth-server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { detectRelationalPattern } from '@/lib/relational-pattern';
import { buildConversationMemory } from '@/lib/conversation-memory';
import OpenAI from 'openai';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export async function POST(req: NextRequest) {
  console.log('[DEFRAG_API] POST /api/ai/chat');

  try {
    // Get authenticated user
    const supabase = await createServerClient();
    if (!supabase) {
      console.error('[DEFRAG_API] Chat: missing SUPABASE env group');
      return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 503 });
    }
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      console.log('[DEFRAG_API] Chat: Unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limiting (10/min per user)
    const rateLimitResult = checkRateLimit(userId, '/api/ai/chat');
    if (!rateLimitResult.allowed) {
      console.log('[DEFRAG_API] Chat: Rate limited for user:', userId);
      return NextResponse.json(
        { message: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Parse request
    const body = await req.json();
    const { message, conversation_id, person_id } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ message: 'Message required' }, { status: 400 });
    }

    // Get or create conversation
    let conversationId = conversation_id;
    
    if (!conversationId) {
      const { data: newConv, error: convError } = await supabaseAdmin
        .from('conversations')
        .insert({
          user_id: userId,
          title: message.slice(0, 50),
        })
        .select('id')
        .single();

      if (convError) {
        console.error('[DEFRAG_API] Failed to create conversation:', convError);
        return NextResponse.json({ message: 'Failed to create conversation' }, { status: 500 });
      }

      conversationId = newConv.id;
    }

    // Store user message
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message,
    });

    // Get user's birthline for context
    const { data: birthline } = await supabaseAdmin
      .from('birthlines')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get person context if person_id provided
    let personContext = null;
    if (person_id) {
      const { data: person } = await supabaseAdmin
        .from('people')
        .select('*')
        .eq('id', person_id)
        .eq('owner_user_id', userId)
        .single();

      if (person) {
        personContext = {
          name: person.name,
          relationship_label: person.relationship_label,
          birth_date: person.birth_date,
          birth_time: person.birth_time,
          birth_place: person.birth_place,
          privacy_level: person.privacy_level,
        };
      }
    }

    // Generate AI response
    const aiResponse = await generateResponse(
      message,
      birthline,
      personContext,
      conversationId
    );

    // Store assistant message
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse,
    });

    console.log('[DEFRAG_API] Chat response generated for conversation:', conversationId);

    return NextResponse.json({
      conversation_id: conversationId,
      response: aiResponse,
    });
  } catch (error: any) {
    console.error('[DEFRAG_API] Chat error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ── System prompt ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are DEFRAG — a relational intelligence guide.

Your role:
Help users understand relationship dynamics calmly and clearly.

Rules:
- Never diagnose.
- Never assign blame.
- Never escalate conflict.
- Never suggest ultimatums.
- Never speculate about mental illness.

Focus on:
- Patterns
- Communication
- Boundaries
- Timing
- Family systems dynamics

Response structure:
1. Recognize the situation
2. Explain the relational pattern
3. Suggest a calm communication approach
4. Invite reflection

Tone:
- Calm
- Clear
- Neutral
- Grounded
- Emotionally intelligent
- Never preachy
- Never mystical
- Never deterministic

Avoid therapy language.
Do not ask about internal thinking patterns.
Only discuss relationship dynamics.`;

// ── Generate response ─────────────────────────────────────────

async function generateResponse(
  message: string,
  birthline: any,
  personContext: any = null,
  conversationId: string
): Promise<string> {
  // 1. Relational pattern analysis (local, zero cost)
  const pattern = detectRelationalPattern(message, personContext);

  const patternContext = `Detected relational signals:

relationship type: ${pattern.relationshipType}
tension type: ${pattern.tensionType}
pattern: ${pattern.pattern}
escalation risk: ${pattern.escalationRisk}
guidance mode: ${pattern.guidanceMode}

Use these signals to inform your response. Do not mention these signals directly to the user.`;

  // 2. Natal context
  const natalContext = birthline
    ? `User natal data available:
birth_date: ${birthline.birth_date}
birth_time: ${birthline.birth_time ?? "unknown"}
birth_place: ${birthline.birth_place ?? "unknown"}`
    : "";

  // 3. Relationship context
  const relationshipContext = personContext
    ? `Relationship context:

Name: ${personContext.name}
Relationship: ${personContext.relationship_label}

Available natal data:
birth_date: ${personContext.birth_date}
birth_time: ${personContext.birth_time ?? "hidden"}
birth_place: ${personContext.birth_place ?? "hidden"}

Privacy level: ${personContext.privacy_level}`
    : "";

  // 4. Conversation memory (compressed history)
  const memory = await buildConversationMemory(
    supabaseAdmin,
    conversationId,
    getOpenAI()
  );

  // 5. Build message stack
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (natalContext) {
    messages.push({ role: "system", content: natalContext });
  }

  if (relationshipContext) {
    messages.push({ role: "system", content: relationshipContext });
  }

  messages.push({ role: "system", content: patternContext });

  // Inject conversation summary if present
  if (memory.summary) {
    messages.push({
      role: "system",
      content: `Conversation summary (earlier context):\n${memory.summary}`,
    });
  }

  // Inject recent messages
  for (const m of memory.recentMessages) {
    messages.push({ role: m.role, content: m.content });
  }

  // Current user message (always last)
  messages.push({ role: "user", content: message });

  // 6. Call OpenAI
  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4.1",
    temperature: 0.4,
    messages,
  });

  let response = completion.choices[0]?.message?.content || "";

  // 7. Safety guard — cap response length
  if (response.length > 2000) {
    response = response.slice(0, 2000);
  }

  return response;
}

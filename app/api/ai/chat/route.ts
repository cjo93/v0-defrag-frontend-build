import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, supabaseAdmin } from '@/lib/auth-server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  console.log('[DEFRAG_API] POST /api/ai/chat');

  try {
    // Get authenticated user
    const supabase = await createServerClient();
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
    const { message, conversation_id } = body;

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

    // Generate AI response (placeholder - integrate with actual AI provider)
    const aiResponse = await generateResponse(message, birthline);

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

async function generateResponse(message: string, birthline: any): Promise<string> {
  // TODO: Integrate with AI provider (Vercel AI Gateway, OpenAI, etc.)
  // Response structure: Recognize → Clarify → Suggest → Invite
  // Safety: Never diagnose. Never blame. Never escalate. Never suggest ultimatums.
  // Vocabulary: patterns, pressure, boundaries, timing, communication
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('mom') || lowerMessage.includes('mother')) {
    return `It sounds like you're trying to maintain connection with your mother while protecting your own space.

She may interpret distance as rejection rather than independence. When you pull back, her instinct may be to move closer — which can feel like pressure from your side.

You might try naming what you need without over-explaining: "I need some quiet tonight — it's not about you." Short, clear statements tend to land better than long justifications.

Does that pattern — where space gets read as rejection — feel familiar in this relationship?`;
  }
  
  if (lowerMessage.includes('dad') || lowerMessage.includes('father')) {
    return `It sounds like you're trying to be seen by your father without triggering his default mode of pushing harder.

Your father may interpret pressure as motivation — while you experience it as control. These two readings of the same behavior often create a loop: he pushes, you withdraw, he pushes harder.

You might try framing the boundary around what helps you stay engaged: "I do better when I have space to figure it out first." This redirects without rejecting.

Does that dynamic — where his care shows up as pressure — feel like a recurring pattern?`;
  }
  
  if (lowerMessage.includes('sister') || lowerMessage.includes('sibling') || lowerMessage.includes('brother')) {
    return `It sounds like you're navigating a dynamic where you and your sibling see the same situation very differently.

Siblings often develop complementary roles in a family system. If one person became the mediator, the other may have become the challenger — and those roles can persist long after they're useful.

You might try approaching the next conversation with curiosity rather than correction: "I see it differently — can you walk me through your side?" This tends to lower defensiveness.

Has this pattern of seeing things from opposite angles been present for a long time?`;
  }
  
  if (lowerMessage.includes('boundaries') || lowerMessage.includes('boundary') || lowerMessage.includes('space')) {
    return `It sounds like you're trying to create a boundary without it being received as a wall.

People who care about you may interpret boundaries as rejection — especially if the relationship has historically had few limits. The shift can feel sudden to them even when it's been building for you.

A boundary doesn't need justification to be valid. Try stating what you need simply: "I need some time this evening" is complete on its own. Over-explaining often invites negotiation.

Does this tension around boundaries tend to show up with the same people?`;
  }
  
  if (lowerMessage.includes('escalat') || lowerMessage.includes('fight') || lowerMessage.includes('argue') || lowerMessage.includes('conflict')) {
    return `It sounds like you're trying to find a way to communicate without the conversation spiraling.

Escalation usually happens when both people feel unheard. The instinct is to speak louder or more forcefully — but that tends to trigger defense rather than understanding.

You might try leading with curiosity before making your point: "Help me understand what you're feeling right now." This creates a pause that can redirect the energy. If things are already heated, a simple "I want to continue this — can we take five minutes?" is a reset, not a retreat.

Is there a specific moment where these conversations tend to tip over?`;
  }

  if (lowerMessage.includes('perspective') || lowerMessage.includes('understand') || lowerMessage.includes('see my')) {
    return `It sounds like you're trying to be understood by someone who keeps interpreting things differently.

When two people have different communication styles, the same words can carry very different weights. What feels like a reasonable request to you may land as a demand or criticism to them — and vice versa.

You might try reflecting their view back before sharing yours: "It sounds like you see it as... For me, it feels more like..." This signals that you're listening, which tends to lower resistance.

Has this gap in how things are interpreted been consistent, or does it shift depending on the topic?`;
  }
  
  // Default response
  return `It sounds like you're working through something that matters to you.

Relational patterns often have deep roots — they repeat not because people don't care, but because the underlying dynamics haven't shifted yet. Recognizing the pattern is the first step toward choosing a different response.

Can you tell me more about what typically happens in these situations? Understanding the specific sequence — who says what, and when it turns — can help us find a different approach.

What part of this dynamic feels most stuck right now?`;
}

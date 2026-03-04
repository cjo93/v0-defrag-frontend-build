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
  // For now, return a contextual placeholder response
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('mom') || lowerMessage.includes('mother')) {
    return `I hear you're navigating a challenging dynamic with your mother. Based on your profile, you may experience maternal relationships as both nurturing and sometimes overwhelming. The key is finding ways to maintain connection while honoring your own boundaries.

Consider: When you feel pressure building, pause before responding. A simple "I need a moment to think about that" can create space without creating distance.

What specific situation is coming up for you right now?`;
  }
  
  if (lowerMessage.includes('dad') || lowerMessage.includes('father')) {
    return `Father relationships often carry expectations and pressure around achievement or direction in life. Your profile suggests you may feel this pressure more intensely during certain periods.

The push you feel may come from a place of care, even if it doesn't land that way. Finding a way to acknowledge intent while redirecting approach can help.

Try: "I know you want the best for me. Can we talk about what that looks like from my perspective?"`;
  }
  
  if (lowerMessage.includes('boundaries') || lowerMessage.includes('space')) {
    return `Boundaries are often difficult to communicate without triggering defensiveness. Your profile suggests you may tend toward accommodating others at your own expense.

A boundary isn't a wall—it's a doorway that you control. The goal isn't to keep people out, but to choose how and when you let them in.

Simple approach: State what you need without over-explaining. "I need some quiet time this evening" is complete on its own.`;
  }
  
  if (lowerMessage.includes('escalat') || lowerMessage.includes('fight') || lowerMessage.includes('argue')) {
    return `De-escalation starts before the conversation heats up. Once you're in reactive mode, it's much harder to redirect.

Based on typical relational patterns, try leading with curiosity instead of defense: "Help me understand what you're feeling right now."

If things are already escalating, a physical reset can help: "I want to continue this conversation, but I need to step out for five minutes first."`;
  }
  
  // Default response
  return `Thank you for sharing that. Relational dynamics are complex, and the patterns we experience often have deep roots.

Based on what you've described, it sounds like there may be underlying expectations or communication styles that aren't aligned.

Can you tell me more about what typically happens in these situations? Understanding the pattern can help us find a different approach.`;
}

import { NextRequest, NextResponse } from 'next/server';
import { AIResponseSchema } from '@/lib/ai/schema';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, { cookies: { getAll: () => req.cookies.getAll() } as any });

    const { data: { session } } = await supabase.auth.getSession();
    
    // Auth Check
    if (!session && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid message payload' }, { status: 400 });
    }

    // Phase 1 MVP: Mocked AI Response matching the strict schema.
    // In production, this will hit OpenAI with response_format: { type: 'json_schema', json_schema: {...} }
    // and temperature 0.0, injecting the user's computed baseline JSON as context.

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResponse = {
      headline: "Urgency increasing withdrawal.",
      signal: {
        level: "high_sensitivity",
        label: "High sensitivity window. Lead gently."
      },
      confidence: {
        overall: 85,
        data_confidence: 90,
        pattern_confidence: 80
      },
      whats_happening: [
        "Your nervous system reads silence as risk.",
        "Intensity feels protective, even when it pushes people away.",
        "They are withdrawing to regulate their own nervous system."
      ],
      do_this_now: "Stop pursuing. Lower your volume. Wait 20 minutes before resuming.",
      one_line_to_say: "I'm not attacking you. I want to feel steady with you.",
      repeat_pattern: {
        detected: true,
        message: "This dynamic has shown up recently. A familiar theme may be forming."
      },
      visualization: {
        available: false,
        type: null
      },
      details: {
        structural_markers: [],
        timing_notes: [],
        summary_metrics: {}
      },
      safety: {
        level: "none",
        guidance: []
      }
    };

    // Strict Schema Validation
    const parsed = AIResponseSchema.safeParse(mockResponse);

    if (!parsed.success) {
      console.error("AI Drift Detected:", parsed.error);
      return NextResponse.json({ error: 'System alignment error. Recomputing...' }, { status: 500 });
    }

    return NextResponse.json(parsed.data);

  } catch (error) {
    console.error('[AI_CHAT_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

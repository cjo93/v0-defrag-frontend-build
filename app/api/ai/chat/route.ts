import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('[DEFRAG_API] AI chat message received');
  try {
    const body = await req.json();
    return NextResponse.json({
        headline: "Relational Dynamics Analysis",
        pressure: "medium",
        confidence: { overall: 85, data_confidence: 90, pattern_confidence: 80 },
        whats_happening: ["Analyzing relational dynamic", "Processing natal structure"],
        do_this_now: "Reflect on the immediate tension",
        one_line_to_say: "I am taking a moment to process this.",
        repeat_pattern: "Observed dynamic in response to pressure.",
        safety: "System note: Interaction stable."
    });
  } catch (error) {
    console.error('[DEFRAG_API] Error processing chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

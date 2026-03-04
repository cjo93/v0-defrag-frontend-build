/**
 * Conversation Memory — Compression Layer
 *
 * Instead of sending the full message history to the model,
 * this module compresses older turns into a rolling summary.
 *
 * Strategy:
 *   - Keep the last N_RECENT messages verbatim (for recency).
 *   - Summarise earlier messages into a condensed paragraph.
 *   - Store per-conversation summary in `conversation_summary` column.
 *   - Reduces token usage while preserving context.
 */

import OpenAI from "openai";

const RECENT_WINDOW = 6; // keep last 6 messages verbatim
const SUMMARY_TRIGGER = 12; // compress when history exceeds this

interface MessageRow {
  role: string;
  content: string;
}

interface MemoryPayload {
  /** Condensed summary of older turns (empty string if none) */
  summary: string;
  /** Recent messages to send verbatim */
  recentMessages: { role: "user" | "assistant" | "system"; content: string }[];
}

// ── Public API ────────────────────────────────────────────────

/**
 * Build the conversation memory payload for the AI call.
 *
 * @param supabaseAdmin  - service-role Supabase client proxy
 * @param conversationId - current conversation ID
 * @param openai         - OpenAI client (used only for compression)
 * @returns MemoryPayload with summary + recent messages
 */
export async function buildConversationMemory(
  supabaseAdmin: { from: (table: string) => any },
  conversationId: string,
  openai: OpenAI
): Promise<MemoryPayload> {
  // 1. Fetch all messages for this conversation
  const { data: allMessages } = await supabaseAdmin
    .from("messages")
    .select("role,content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const messages: MessageRow[] = allMessages ?? [];

  if (messages.length === 0) {
    return { summary: "", recentMessages: [] };
  }

  // 2. If under the trigger threshold, return all verbatim
  if (messages.length <= SUMMARY_TRIGGER) {
    return {
      summary: "",
      recentMessages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    };
  }

  // 3. Split: older messages to compress, recent to keep
  const olderMessages = messages.slice(0, messages.length - RECENT_WINDOW);
  const recentMessages = messages.slice(messages.length - RECENT_WINDOW);

  // 4. Check for an existing summary
  const { data: conv } = await supabaseAdmin
    .from("conversations")
    .select("conversation_summary")
    .eq("id", conversationId)
    .single();

  let summary = conv?.conversation_summary || "";

  // 5. Compress older turns into summary if not already compressed
  //    (We re-summarise when older messages exceed what the current summary covers)
  if (olderMessages.length > 0) {
    summary = await compressTurns(openai, summary, olderMessages);

    // Persist the compressed summary
    await supabaseAdmin
      .from("conversations")
      .update({ conversation_summary: summary })
      .eq("id", conversationId);
  }

  return {
    summary,
    recentMessages: recentMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  };
}

// ── Compression ───────────────────────────────────────────────

async function compressTurns(
  openai: OpenAI,
  existingSummary: string,
  turns: MessageRow[]
): Promise<string> {
  const turnText = turns
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = existingSummary
    ? `Below is an existing conversation summary, followed by additional turns. Produce an updated summary that captures all key relational topics, patterns discussed, guidance given, and unresolved questions. Keep it under 200 words. Do not invent information.

EXISTING SUMMARY:
${existingSummary}

NEW TURNS:
${turnText}

UPDATED SUMMARY:`
    : `Summarise the following conversation turns. Capture all key relational topics, patterns discussed, guidance given, and unresolved questions. Keep it under 200 words. Do not invent information.

TURNS:
${turnText}

SUMMARY:`;

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    return result.choices[0]?.message?.content?.trim() || existingSummary;
  } catch (err) {
    console.error("[DEFRAG] Conversation compression failed:", err);
    // Degrade gracefully — return whatever summary we had
    return existingSummary;
  }
}

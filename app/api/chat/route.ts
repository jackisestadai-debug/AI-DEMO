import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}

// The setter's permanent "brain" — baked into code, never editable from outside
const BRAIN = `You are a real human appointment setter. You talk to leads in direct messages and your one job is to have a genuine conversation, understand what they want, and get the right people to book a call.

HOW YOU TALK (follow exactly)
- You are a real person on the team. Never say or hint that you are an AI, a bot, an assistant, or a model. If asked, you're part of the team.
- Write like a real DM: short and casual. Usually one or two sentences. Never long paragraphs.
- Ask only ONE question at a time. Never stack two questions in one message.
- Never use em-dashes. Never use bullet points, numbered lists, or markdown formatting. No emojis unless the lead uses them first.
- Match the lead's energy and tone. Use plain, human language. No corporate or salesy phrases.

HOW YOU SELL (the flow, but stay natural)
- Don't pitch right away. Open warm, build a little rapport, and find out what the lead actually wants or what problem they have.
- Once you understand their situation, connect it to what the business offers in a low-pressure way.
- When the lead is interested or a good fit, invite them to a quick call and share the booking link naturally.
- Handle objections like a calm, confident human: acknowledge it, gently reframe, keep the conversation moving. Never argue, never be pushy.
- Never invent specific facts, prices, or guarantees you weren't given. If you don't know a detail, keep it general and move toward the call.

YOUR SALES TRAINING (provided per business below; if it's empty, just be warm and human and ask what brought them in)
SOP: {{system_prompt}}
RULES: {{active_rules}}
VOICE EXAMPLES: {{voice_samples}}
BUSINESS: {{business_context}}`;

export async function POST(req: NextRequest) {
  try {
    const { messages, leadId } = await req.json();

    const supabase = getSupabase();

    // If CLIENT_ID env var is set, load that specific client row.
    // Otherwise fall back to the single active row (default for single-client deploys).
    const clientQuery = process.env.CLIENT_ID
      ? supabase.from("clients").select("*").eq("id", process.env.CLIENT_ID)
      : supabase.from("clients").select("*").eq("is_active", true);

    const { data: client, error: clientError } = await clientQuery.single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: "No active client config found in Supabase." },
        { status: 500 }
      );
    }

    // Inject the business training into the brain
    const systemPrompt = BRAIN
      .replace("{{system_prompt}}", client.system_prompt || "")
      .replace("{{active_rules}}", client.active_rules || "")
      .replace("{{voice_samples}}", client.voice_samples || "")
      .replace("{{business_context}}", client.business_context || "");

    // Create a new lead record if this is the first message
    let currentLeadId = leadId as string | null;
    if (!currentLeadId) {
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .insert({ client_id: client.id })
        .select("id")
        .single();

      if (leadError || !lead) {
        return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
      }
      currentLeadId = lead.id as string;
    }

    // Persist the user's message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      await supabase.from("messages").insert({
        lead_id: currentLeadId,
        client_id: client.id,
        role: "user",
        content: lastMessage.content,
      });
    }

    // Call Claude — server-side only, key never touches the browser
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Persist the assistant reply
    await supabase.from("messages").insert({
      lead_id: currentLeadId,
      client_id: client.id,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply, leadId: currentLeadId });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL ?? "https://itxaapvblgtvslsccbeg.supabase.co",
    process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eGFhcHZibGd0dnNsc2NjYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTE1NDEsImV4cCI6MjA5NjA4NzU0MX0.z9HC-dU4JjIRaFGfZfITsNj-P1zjI5LOknXKM0jU7U4"
  );
}

// GHL integration — create contact + book appointment when lead is qualified
async function syncLeadToGHL(lead: {
  name?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  notes?: string;
}) {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return null;

  try {
    const res = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        firstName: lead.name?.split(" ")[0] ?? "",
        lastName: lead.name?.split(" ").slice(1).join(" ") ?? "",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        locationId,
        tags: ["AI Appointment Setter", lead.businessType ?? "Salong/Klinik"],
        customField: {
          notes: lead.notes ?? "",
        },
        source: "AI DM Bot",
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.contact?.id ?? null;
  } catch {
    return null;
  }
}

const BRAIN = `Du är en riktig människa som jobbar som mötesbokerare. Du skriver till potentiella kunder via direktmeddelanden och ditt enda jobb är att ha ett äkta samtal, förstå deras situation och boka in rätt personer på ett samtal.

HUR DU PRATAR (följ exakt)
- Du är en riktig person i teamet. Avslöja aldrig att du är en AI, bot eller assistent. Om någon frågar är du en del av teamet.
- Skriv som ett riktigt DM: kort och avslappnat. Vanligtvis en eller två meningar. Aldrig långa stycken.
- Ställ bara EN fråga i taget. Stapla aldrig två frågor i samma meddelande.
- Använd aldrig tankstreck. Inga punktlistor, numrerade listor eller markdown. Inga emojis såvida inte personen använder dem först.
- Matcha personens energi och ton. Enkelt, mänskligt språk. Inga företagsfraser eller säljjargong.

HUR DU SÄLJER (flödet, men håll det naturligt)
- Pitcha inte direkt. Öppna varmt, bygg lite rapport och ta reda på vad de faktiskt vill ha eller vilket problem de har.
- När du förstår deras situation, koppla det till vad tjänsten erbjuder på ett avslappnat sätt.
- När personen är intresserad eller passar bra, bjud in dem till ett snabbt samtal och dela bokningslänken naturligt.
- Hantera invändningar som en lugn, säker människa: bekräfta det, omformulera försiktigt, håll samtalet igång. Argumentera aldrig, var aldrig pushig.
- Hitta aldrig på specifika fakta, priser eller garantier du inte fått. Om du inte vet en detalj, håll det generellt och styr mot samtalet.

DIN SÄLJTRÄNING (tillhandahålls per företag nedan)
SOP: {{system_prompt}}
REGLER: {{active_rules}}
RÖSTEXEMPEL: {{voice_samples}}
FÖRETAG: {{business_context}}`;

// Detect if the assistant message contains a booking intent
function detectBookingTrigger(text: string): boolean {
  const triggers = [
    "calendly", "boka", "bokningslänk", "länk", "möte", "samtal",
    "ring", "prata", "träffas", "demo", "kolla in",
  ];
  return triggers.some((t) => text.toLowerCase().includes(t));
}

export async function POST(req: NextRequest) {
  try {
    const { messages, leadId, leadInfo } = await req.json();

    const supabase = getSupabase();

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

    const systemPrompt = BRAIN
      .replace("{{system_prompt}}", client.system_prompt || "")
      .replace("{{active_rules}}", client.active_rules || "")
      .replace("{{voice_samples}}", client.voice_samples || "")
      .replace("{{business_context}}", client.business_context || "");

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

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      await supabase.from("messages").insert({
        lead_id: currentLeadId,
        client_id: client.id,
        role: "user",
        content: lastMessage.content,
      });
    }

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

    await supabase.from("messages").insert({
      lead_id: currentLeadId,
      client_id: client.id,
      role: "assistant",
      content: reply,
    });

    // If the bot mentions booking, push lead to GHL
    let ghlContactId: string | null = null;
    if (detectBookingTrigger(reply) && leadInfo) {
      ghlContactId = await syncLeadToGHL({
        name: leadInfo.name,
        email: leadInfo.email,
        phone: leadInfo.phone,
        businessType: leadInfo.businessType,
        notes: messages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n"),
      });

      if (ghlContactId) {
        await supabase
          .from("leads")
          .update({ ghl_contact_id: ghlContactId, status: "qualified" })
          .eq("id", currentLeadId);
      }
    }

    return NextResponse.json({ reply, leadId: currentLeadId, ghlContactId });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

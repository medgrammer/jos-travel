import OpenAI from "openai";
import type { Response, ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses";
import { NextResponse } from "next/server";
import { buildAssistantInstructions } from "@/lib/platform/ai-context";
import { AI_CREDIT_UNIT_LABEL, buildWhatsAppUrl, type AiUsageType, type ChatMode } from "@/lib/platform/billing";
import { brand } from "@/lib/site-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIErrorShape = {
  status?: unknown;
  code?: unknown;
  type?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages = normalizeMessages(body?.messages);
  const conversationId = normalizeConversationId(body?.conversationId);

  if (!messages.length) {
    return NextResponse.json({ error: "Message vide." }, { status: 400 });
  }

  const admin = createAdminClient();
  const creditState = await getCreditState(admin);
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (creditState.chatMode === "human") {
    return NextResponse.json({
      redirectToWhatsApp: true,
      whatsappUrl: buildChatWhatsAppUrl(lastUserMessage?.content),
      answer: "Je vous mets en relation avec un conseiller JOS-Travel sur WhatsApp."
    });
  }

  const usageRule = getUsageRule(messages, creditState.rules);

  if (creditState.configured && creditState.remainingCredits < usageRule.credits) {
    return NextResponse.json(
      {
        redirectToWhatsApp: true,
        whatsappUrl: buildChatWhatsAppUrl(lastUserMessage?.content),
        error: "Notre équipe prend le relais sur WhatsApp."
      },
      { status: 402 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "La discussion JOS-Travel est prête, mais la configuration serveur n'est pas encore terminée."
      },
      { status: 503 }
    );
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await createTravelResponse(client, messages);

    const answer = response.output_text?.trim() || "Je suis là. Pouvez-vous préciser votre besoin de voyage ?";
    await consumeCredit(admin, usageRule, conversationId, await getAuthenticatedUserId());

    return NextResponse.json({
      answer,
      remainingCredits:
        creditState.configured && creditState.remainingCredits > 0
          ? Math.max(0, creditState.remainingCredits - usageRule.credits)
          : null
    });
  } catch (error) {
    console.error("JOS-Travel chat failed", formatOpenAIError(error));

    return NextResponse.json(
      { error: "JOS-Travel n'a pas pu répondre pour le moment. Merci de réessayer." },
      { status: 500 }
    );
  }
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(-8)
    .map((message) => {
      if (!message || typeof message !== "object") {
        return null;
      }

      const role = "role" in message && message.role === "assistant" ? "assistant" : "user";
      const content = "content" in message ? String(message.content).slice(0, 900).trim() : "";
      return content ? { role, content } : null;
    })
    .filter((message): message is ChatMessage => Boolean(message));
}

async function createTravelResponse(client: OpenAI, messages: ChatMessage[]): Promise<Response> {
  const candidates = getModelCandidates();
  let lastError: unknown = null;

  for (const model of candidates) {
    try {
      return await client.responses.create(buildResponseRequest(model, messages));
    } catch (error) {
      lastError = error;
      console.error("JOS-Travel OpenAI model attempt failed", {
        model,
        error: formatOpenAIError(error)
      });
    }
  }

  throw lastError;
}

function buildResponseRequest(model: string, messages: ChatMessage[]): ResponseCreateParamsNonStreaming {
  const request: ResponseCreateParamsNonStreaming = {
    model,
    stream: false,
    instructions: buildAssistantInstructions(),
    input: messages.map((message) => ({
      role: message.role,
      content: message.content
    }))
  };

  if (model.startsWith("gpt-5")) {
    return {
      ...request,
      reasoning: { effort: "low" },
      text: { verbosity: "low" }
    };
  }

  return request;
}

function getModelCandidates() {
  return uniqueCompact([
    process.env.OPENAI_MODEL,
    process.env.OPENAI_FALLBACK_MODEL,
    "gpt-5.4-mini"
  ]);
}

function uniqueCompact(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))));
}

function formatOpenAIError(error: unknown) {
  const shaped = error as OpenAIErrorShape;

  return {
    status: shaped.status,
    code: shaped.code,
    type: shaped.type,
    message: error instanceof Error ? error.message : shaped.message
  };
}

async function getCreditState(admin: ReturnType<typeof createAdminClient>) {
  if (!admin) {
    return {
      configured: false,
      remainingCredits: 0,
      chatMode: "ai" as ChatMode,
      rules: defaultRules()
    };
  }

  const [{ data: settings }, { data: wallet }] = await Promise.all([
    admin
      .from("ai_settings")
      .select("chat_mode,standard_message_credits,complex_message_credits,advanced_analysis_credits")
      .eq("id", true)
      .maybeSingle(),
    admin.from("ai_wallet").select("remaining_credits").eq("id", true).maybeSingle()
  ]);

  return {
    configured: true,
    remainingCredits: Number(wallet?.remaining_credits ?? 0),
    chatMode: settings?.chat_mode === "human" ? "human" : ("ai" as ChatMode),
    rules: {
      standardMessageCredits: Number(settings?.standard_message_credits ?? 10),
      complexMessageCredits: Number(settings?.complex_message_credits ?? 20),
      advancedAnalysisCredits: Number(settings?.advanced_analysis_credits ?? 50)
    }
  };
}

async function consumeCredit(
  admin: ReturnType<typeof createAdminClient>,
  usageRule: { usageType: AiUsageType; credits: number },
  conversationId: string,
  userId: string | null
) {
  if (!admin || usageRule.credits <= 0) {
    return;
  }

  const { data: wallet } = await admin
    .from("ai_wallet")
    .select("total_purchased,total_consumed,remaining_credits")
    .eq("id", true)
    .maybeSingle<{ total_purchased: number; total_consumed: number; remaining_credits: number }>();

  if (!wallet || Number(wallet.remaining_credits) < usageRule.credits) {
    return;
  }

  const nextConsumed = Number(wallet.total_consumed) + usageRule.credits;
  const balanceAfter = Math.max(0, Number(wallet.total_purchased) - nextConsumed);

  await admin
    .from("ai_wallet")
    .update({
      total_consumed: nextConsumed
    })
    .eq("id", true);

  await admin.from("ai_wallet_transactions").insert({
    transaction_type: "consumption",
    amount: -usageRule.credits,
    balance_after: balanceAfter,
    reason: getUsageReason(usageRule.usageType),
    metadata: {
      unit: AI_CREDIT_UNIT_LABEL,
      source: "jos_travel_chat"
    }
  });

  await admin.from("ai_usage_logs").insert({
    user_id: userId,
    session_id: userId ? null : conversationId,
    conversation_id: conversationId,
    usage_type: usageRule.usageType,
    credits_used: usageRule.credits,
    message_count: 1,
    metadata: {
      unit: AI_CREDIT_UNIT_LABEL,
      source: "jos_travel_chat"
    }
  });

  await admin.from("ai_settings").update({ remaining_credits: balanceAfter }).eq("id", true);

  await admin.from("ai_credit_events").insert({
    amount: -usageRule.credits,
    reason: getUsageReason(usageRule.usageType)
  });
}

function buildChatWhatsAppUrl(lastNeed?: string) {
  const text = [
    `Bonjour ${brand.name}, je souhaite poursuivre cet echange sur WhatsApp avec un conseiller.`,
    lastNeed ? `Mon besoin : ${lastNeed.slice(0, 240)}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  return buildWhatsAppUrl(text);
}

function defaultRules() {
  return {
    standardMessageCredits: 10,
    complexMessageCredits: 20,
    advancedAnalysisCredits: 50
  };
}

function getUsageRule(
  messages: ChatMessage[],
  rules: ReturnType<typeof defaultRules>
): { usageType: AiUsageType; credits: number } {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const normalized = lastUserMessage.toLowerCase();

  const advancedSignals = [
    "analyse",
    "analyser",
    "avancée",
    "advanced",
    "itinéraire complet",
    "budget détaillé",
    "comparer",
    "comparaison",
    "multi-destination",
    "business plan",
    "stratégie"
  ];

  if (lastUserMessage.length > 750 || advancedSignals.some((signal) => normalized.includes(signal))) {
    return { usageType: "advanced_analysis", credits: rules.advancedAnalysisCredits };
  }

  const complexSignals = [
    "visa",
    "bourse",
    "scholarship",
    "assurance",
    "safari",
    "groupe",
    "évènement",
    "evenement",
    "famille",
    "devis",
    "documents",
    "réservation",
    "reservation"
  ];

  if (lastUserMessage.length > 280 || messages.length >= 6 || complexSignals.some((signal) => normalized.includes(signal))) {
    return { usageType: "complex_message", credits: rules.complexMessageCredits };
  }

  return { usageType: "standard_message", credits: rules.standardMessageCredits };
}

function getUsageReason(usageType: AiUsageType) {
  if (usageType === "advanced_analysis") {
    return "Analyse avancée JOS-Travel";
  }

  if (usageType === "complex_message") {
    return "Message complexe JOS-Travel";
  }

  return "Message standard JOS-Travel";
}

function normalizeConversationId(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value.trim().slice(0, 120);
  }

  return crypto.randomUUID();
}

async function getAuthenticatedUserId() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getClaims().catch(() => ({ data: null }));
  return typeof data?.claims?.sub === "string" ? data.claims.sub : null;
}

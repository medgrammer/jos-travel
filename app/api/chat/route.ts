import OpenAI from "openai";
import type { Response, ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses";
import { NextResponse } from "next/server";
import { buildAssistantInstructions } from "@/lib/platform/ai-context";
import { createAdminClient } from "@/lib/supabase/admin";

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

  if (!messages.length) {
    return NextResponse.json({ error: "Message vide." }, { status: 400 });
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

  const admin = createAdminClient();
  const creditState = await getCreditState(admin);
  if (creditState.configured && creditState.remainingCredits <= 0) {
    return NextResponse.json(
      { error: "Le crédit de conversation est épuisé. Merci de le recharger dans l'espace admin." },
      { status: 402 }
    );
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await createTravelResponse(client, messages);

    const answer = response.output_text?.trim() || "Je suis là. Pouvez-vous préciser votre besoin de voyage ?";
    await consumeCredit(admin, creditState.remainingCredits);

    return NextResponse.json({
      answer,
      remainingCredits:
        creditState.configured && creditState.remainingCredits > 0 ? creditState.remainingCredits - 1 : null
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
    return { configured: false, remainingCredits: 0 };
  }

  const { data } = await admin.from("ai_settings").select("remaining_credits").eq("id", true).maybeSingle();

  return {
    configured: true,
    remainingCredits: Number(data?.remaining_credits ?? 0)
  };
}

async function consumeCredit(admin: ReturnType<typeof createAdminClient>, currentCredits: number) {
  if (!admin || currentCredits <= 0) {
    return;
  }

  await admin
    .from("ai_settings")
    .update({ remaining_credits: Math.max(0, currentCredits - 1) })
    .eq("id", true);

  await admin.from("ai_credit_events").insert({
    amount: -1,
    reason: "Conversation JOS-Travel"
  });
}
